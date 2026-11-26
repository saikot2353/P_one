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
  Megaphone,
  ArrowRight,
  Eye,
  Gift,
  Calendar,
  Phone,
  Mail,
  AlertCircle,
  FileCheck,
  MessageCircle,
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


const CHART_TOOLTIP_CONTENT_STYLE: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderColor: "#cbd5e1",
  borderWidth: "1px",
  borderRadius: "10px",
  padding: "8px 12px",
  fontSize: "12px",
  fontWeight: 600,
  color: "#0f172a",
  boxShadow: "0 12px 28px -6px rgba(15, 23, 42, 0.16)",
};

const CHART_TOOLTIP_LABEL_STYLE: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 800,
  color: "#0f172a",
  marginBottom: "4px",
  borderBottom: "1px solid #f1f5f9",
  paddingBottom: "3px",
};

const CHART_TOOLTIP_ITEM_STYLE: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 700,
  padding: "1px 0",
};

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

            {(!settings?.scope || settings?.scope === "area" || settings?.scope === "company") && def?.supportedScopes && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
                Area
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
  const customLabels = settings?.chipLabels || {};
  const applyCustomLabel = <T extends { id: string }>(item: T): T => {
    const custom = customLabels[item.id]?.trim();
    if (!custom) return item;
    const patched: any = { ...item };
    if ("label" in patched) patched.label = custom;
    if ("title" in patched) patched.title = custom;
    if ("name" in patched) patched.name = custom;
    return patched as T;
  };
  const orderByChips = <T extends { id: string }>(items: T[]): T[] => {
    if (enabledChips.length === 0) return items.map(applyCustomLabel);
    const map = new Map(items.map((item) => [item.id, item]));
    const ordered = enabledChips.map((id) => map.get(id)).filter((x): x is T => !!x);
    return (ordered.length > 0 ? ordered : items).map(applyCustomLabel);
  };

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

      const scopeScale =
        scope === "personal"
          ? 0.01
          : scope === "area"
            ? Math.min(1, Math.max(0.28, (settings?.areas?.length || 1) / 3))
            : scope === "managed_depts" || scope === "department"
              ? Math.min(1, Math.max(0.25, (settings?.departments?.length || settings?.managedDepartments?.length || 1) / 6))
              : 1;

      const extraAttendanceChips: StatChip[] = [
        {
          id: "worker",
          label: "Worker",
          value: Math.max(1, Math.round(5420 * scopeScale)).toLocaleString(),
          unit: "Operators",
          note: "Floor workforce",
          boxClass: "bg-blue-500/10 border-blue-500/20",
          labelClass: "text-blue-600 dark:text-blue-400",
          valueClass: "text-foreground",
          noteClass: "text-blue-600/80",
        },
        {
          id: "staff",
          label: "Staff",
          value: Math.max(1, Math.round(1017 * scopeScale)).toLocaleString(),
          unit: "Officers",
          note: "Office & Tech",
          boxClass: "bg-indigo-500/10 border-indigo-500/20",
          labelClass: "text-indigo-600 dark:text-indigo-400",
          valueClass: "text-foreground",
          noteClass: "text-indigo-600/80",
        },
        {
          id: "staff_present",
          label: "Staff Present",
          value: Math.max(1, Math.round(978 * scopeScale)).toLocaleString(),
          pct: "96.2%",
          note: "On duty",
          boxClass: "bg-emerald-500/10 border-emerald-500/20",
          labelClass: "text-emerald-600 dark:text-emerald-400",
          valueClass: "text-emerald-700 dark:text-emerald-300",
          noteClass: "text-emerald-600/80",
        },
        {
          id: "worker_present",
          label: "Worker Present",
          value: Math.max(1, Math.round(5180 * scopeScale)).toLocaleString(),
          pct: "95.6%",
          note: "Lines active",
          boxClass: "bg-teal-500/10 border-teal-500/20",
          labelClass: "text-teal-600 dark:text-teal-400",
          valueClass: "text-teal-700 dark:text-teal-300",
          noteClass: "text-teal-600/80",
        },
        {
          id: "worker_absent",
          label: "Worker Absent",
          value: Math.max(0, Math.round(240 * scopeScale)).toLocaleString(),
          pct: "4.4%",
          note: "Floor absent",
          boxClass: "bg-rose-500/10 border-rose-500/20",
          labelClass: "text-rose-600 dark:text-rose-400",
          valueClass: "text-rose-700 dark:text-rose-300",
          noteClass: "text-rose-600/80",
        },
        {
          id: "staff_absent",
          label: "Staff Absent",
          value: Math.max(0, Math.round(39 * scopeScale)).toLocaleString(),
          pct: "3.8%",
          note: "Office absent",
          boxClass: "bg-red-500/10 border-red-500/20",
          labelClass: "text-red-600 dark:text-red-400",
          valueClass: "text-red-700 dark:text-red-300",
          noteClass: "text-red-600/80",
        },
        {
          id: "holiday",
          label: "Holiday",
          value: Math.max(0, Math.round(112 * scopeScale)).toLocaleString(),
          note: "Rostered off",
          boxClass: "bg-purple-500/10 border-purple-500/20",
          labelClass: "text-purple-600 dark:text-purple-400",
          valueClass: "text-purple-700 dark:text-purple-300",
          noteClass: "text-purple-600/80",
        },
        {
          id: "late_worker",
          label: "Late Worker",
          value: Math.max(0, Math.round(145 * scopeScale)).toLocaleString(),
          pct: "2.7%",
          note: "Grace applied",
          boxClass: "bg-amber-500/10 border-amber-500/20",
          labelClass: "text-amber-600 dark:text-amber-400",
          valueClass: "text-amber-700 dark:text-amber-300",
          noteClass: "text-amber-600/80",
        },
        {
          id: "late_staff",
          label: "Late Staff",
          value: Math.max(0, Math.round(28 * scopeScale)).toLocaleString(),
          pct: "2.8%",
          note: "After 9:15 AM",
          boxClass: "bg-orange-500/10 border-orange-500/20",
          labelClass: "text-orange-600 dark:text-orange-400",
          valueClass: "text-orange-700 dark:text-orange-300",
          noteClass: "text-orange-600/80",
        },
        {
          id: "leave_worker",
          label: "Worker on Leave",
          value: Math.max(0, Math.round(64 * scopeScale)).toLocaleString(),
          pct: "1.2%",
          note: "Approved leave",
          boxClass: "bg-violet-500/10 border-violet-500/20",
          labelClass: "text-violet-600 dark:text-violet-400",
          valueClass: "text-violet-700 dark:text-violet-300",
          noteClass: "text-violet-600/80",
        },
        {
          id: "leave_staff",
          label: "Staff on Leave",
          value: Math.max(0, Math.round(14 * scopeScale)).toLocaleString(),
          pct: "1.4%",
          note: "CL / SL / EL",
          boxClass: "bg-fuchsia-500/10 border-fuchsia-500/20",
          labelClass: "text-fuchsia-600 dark:text-fuchsia-400",
          valueClass: "text-fuchsia-700 dark:text-fuchsia-300",
          noteClass: "text-fuchsia-600/80",
        },
        {
          id: "uninformed_absent",
          label: "Uninformed Absent",
          value: Math.max(0, Math.round(118 * scopeScale)).toLocaleString(),
          pct: "1.8%",
          note: "No prior notice",
          boxClass: "bg-rose-500/10 border-rose-500/20",
          labelClass: "text-rose-600 dark:text-rose-400",
          valueClass: "text-rose-700 dark:text-rose-300",
          noteClass: "text-rose-600/80",
        },
        {
          id: "weekend_duty",
          label: "Weekend Duty",
          value: Math.max(0, Math.round(86 * scopeScale)).toLocaleString(),
          note: "Special shift",
          boxClass: "bg-sky-500/10 border-sky-500/20",
          labelClass: "text-sky-600 dark:text-sky-400",
          valueClass: "text-sky-700 dark:text-sky-300",
          noteClass: "text-sky-600/80",
        },
      ];

      extraAttendanceChips.forEach((ec) => {
        if (!chips.some((c) => c.id === ec.id)) chips.push(ec);
      });

      const visibleChips = orderByChips(chips);

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

    case "hr_workforce_info": {
      const scopeScale =
        scope === "personal"
          ? 0.01
          : scope === "area"
            ? Math.min(1, Math.max(0.28, (settings?.areas?.length || 1) / 3))
            : scope === "managed_depts" || scope === "department"
              ? Math.min(1, Math.max(0.25, (settings?.departments?.length || settings?.managedDepartments?.length || 1) / 6))
              : 1;

      const infoChips = [
        {
          id: "total_manpower",
          label: "Total Man Power",
          value: Math.max(1, Math.round(6437 * scopeScale)).toLocaleString(),
          sub: "Active Payroll",
          box: "bg-blue-500/10 border-blue-500/20",
          titleCls: "text-blue-600 dark:text-blue-400",
          valCls: "text-foreground",
        },
        {
          id: "worker",
          label: "Worker",
          value: Math.max(1, Math.round(5420 * scopeScale)).toLocaleString(),
          sub: "84.2% of Total",
          box: "bg-emerald-500/10 border-emerald-500/20",
          titleCls: "text-emerald-600 dark:text-emerald-400",
          valCls: "text-emerald-700 dark:text-emerald-300",
        },
        {
          id: "staff",
          label: "Staff",
          value: Math.max(1, Math.round(1017 * scopeScale)).toLocaleString(),
          sub: "15.8% of Total",
          box: "bg-indigo-500/10 border-indigo-500/20",
          titleCls: "text-indigo-600 dark:text-indigo-400",
          valCls: "text-indigo-700 dark:text-indigo-300",
        },
        {
          id: "resign",
          label: "Resign",
          value: Math.max(0, Math.round(84 * scopeScale)).toLocaleString(),
          sub: "Formal Exit (MTD)",
          box: "bg-amber-500/10 border-amber-500/20",
          titleCls: "text-amber-600 dark:text-amber-400",
          valCls: "text-amber-700 dark:text-amber-300",
        },
        {
          id: "lefty",
          label: "Lefty",
          value: Math.max(0, Math.round(46 * scopeScale)).toLocaleString(),
          sub: "Unauthorized Left",
          box: "bg-rose-500/10 border-rose-500/20",
          titleCls: "text-rose-600 dark:text-rose-400",
          valCls: "text-rose-700 dark:text-rose-300",
        },
        {
          id: "ml",
          label: "ML",
          value: Math.max(0, Math.round(38 * scopeScale)).toLocaleString(),
          sub: "Maternity Leave",
          box: "bg-purple-500/10 border-purple-500/20",
          titleCls: "text-purple-600 dark:text-purple-400",
          valCls: "text-purple-700 dark:text-purple-300",
        },
        {
          id: "others",
          label: "Others",
          value: Math.max(0, Math.round(22 * scopeScale)).toLocaleString(),
          sub: "Suspended / Hold",
          box: "bg-slate-500/10 border-slate-500/20",
          titleCls: "text-slate-600 dark:text-slate-400",
          valCls: "text-foreground",
        },
        {
          id: "new_joining",
          label: "New Joining",
          value: `+${Math.max(1, Math.round(96 * scopeScale))}`,
          sub: "This month",
          box: "bg-teal-500/10 border-teal-500/20",
          titleCls: "text-teal-600 dark:text-teal-400",
          valCls: "text-teal-700 dark:text-teal-300",
        },
        {
          id: "male",
          label: "Male",
          value: Math.max(1, Math.round(2446 * scopeScale)).toLocaleString(),
          sub: "38.0% of Total",
          box: "bg-sky-500/10 border-sky-500/20",
          titleCls: "text-sky-600 dark:text-sky-400",
          valCls: "text-sky-700 dark:text-sky-300",
        },
        {
          id: "female",
          label: "Female",
          value: Math.max(1, Math.round(3991 * scopeScale)).toLocaleString(),
          sub: "62.0% of Total",
          box: "bg-pink-500/10 border-pink-500/20",
          titleCls: "text-pink-600 dark:text-pink-400",
          valCls: "text-pink-700 dark:text-pink-300",
        },
        {
          id: "confirmed",
          label: "Confirmed",
          value: Math.max(1, Math.round(5790 * scopeScale)).toLocaleString(),
          sub: "Permanent staff",
          box: "bg-emerald-500/10 border-emerald-500/20",
          titleCls: "text-emerald-600 dark:text-emerald-400",
          valCls: "text-emerald-700 dark:text-emerald-300",
        },
        {
          id: "probation",
          label: "Probation",
          value: Math.max(0, Math.round(647 * scopeScale)).toLocaleString(),
          sub: "Under 3-6m review",
          box: "bg-cyan-500/10 border-cyan-500/20",
          titleCls: "text-cyan-600 dark:text-cyan-400",
          valCls: "text-cyan-700 dark:text-cyan-300",
        },
        {
          id: "terminated",
          label: "Terminated",
          value: Math.max(0, Math.round(11 * scopeScale)).toLocaleString(),
          sub: "Disciplinary",
          box: "bg-red-500/10 border-red-500/20",
          titleCls: "text-red-600 dark:text-red-400",
          valCls: "text-red-700 dark:text-red-300",
        },
        {
          id: "retired",
          label: "Retired",
          value: Math.max(0, Math.round(4 * scopeScale)).toLocaleString(),
          sub: "Superannuation",
          box: "bg-violet-500/10 border-violet-500/20",
          titleCls: "text-violet-600 dark:text-violet-400",
          valCls: "text-violet-700 dark:text-violet-300",
        },
      ];
      const filteredInfoChips = orderByChips(infoChips);

      return (
        <div className={getMetricGridClass(colSpan, Math.max(1, filteredInfoChips.length))}>
          {filteredInfoChips.map((c) => (
            <div key={c.id} className={`p-3 rounded-xl border ${c.box}`}>
              <span className={`text-[10.5px] font-bold uppercase tracking-wider block truncate ${c.titleCls}`}>
                {c.label}
              </span>
              <div className={`text-xl sm:text-2xl font-black font-mono mt-1 ${c.valCls}`}>{c.value}</div>
              <div className="text-[10px] text-muted-foreground font-medium mt-1 truncate">{c.sub}</div>
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
                    contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
                   labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
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
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${row.rate >= 95
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
                    contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
                   labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
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
                    contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
                   labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
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
                  contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
                 labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
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
                  contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
                 labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
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

      let rawPie: Array<{ id: string; name: string; value: number; color: string; unit?: string }> = [];
      let pieSubTitle = "";

      const pieScale =
        scope === "personal"
          ? 0.01
          : scope === "area"
            ? Math.min(1, Math.max(0.28, areasList.length / 3))
            : scope === "managed_depts" || scope === "department"
              ? Math.min(1, Math.max(0.22, deptsList.length / 6))
              : 1;

      if (scope === "personal") {
        rawPie = [
          { id: "present", name: "My Present Days", value: 21, color: "#10b981", unit: "Days" },
          { id: "absent", name: "Absent", value: 0, color: "#f43f5e", unit: "Days" },
          { id: "leave", name: "Approved Leave", value: 1, color: "#8b5cf6", unit: "Days" },
          { id: "late", name: "Late Entry", value: 1, color: "#f59e0b", unit: "Days" },
          { id: "holiday", name: "Holiday / Off", value: 8, color: "#3b82f6", unit: "Days" },
          { id: "early_leave", name: "Early Departure", value: 0, color: "#64748b", unit: "Days" },
          { id: "ml", name: "ML", value: 0, color: "#ec4899", unit: "Days" },
          { id: "weekend_duty", name: "Weekend Duty", value: 1, color: "#06b6d4", unit: "Days" },
        ];
      } else {
        if (scope === "area") {
          pieSubTitle = areasList.length > 1 ? `${areasList.length} Areas` : areasList[0];
        } else if (scope === "managed_depts" || scope === "department") {
          pieSubTitle = deptsList.length > 1 ? `${deptsList.length} Departments` : deptsList[0];
        }
        rawPie = [
          { id: "present", name: "Present", value: Math.round(1196 * pieScale), color: "#10b981" },
          { id: "absent", name: "Absent", value: Math.round(42 * pieScale), color: "#f43f5e" },
          { id: "late", name: "Late Entry", value: Math.round(73 * pieScale), color: "#f59e0b" },
          { id: "leave", name: "On Leave", value: Math.round(10 * pieScale), color: "#8b5cf6" },
          { id: "holiday", name: "Holiday", value: Math.round(112 * pieScale), color: "#3b82f6" },
          { id: "early_leave", name: "Early Departure", value: Math.round(16 * pieScale), color: "#64748b" },
          { id: "ml", name: "ML", value: Math.round(38 * pieScale), color: "#ec4899" },
          { id: "weekend_duty", name: "Weekend Duty", value: Math.round(48 * pieScale), color: "#06b6d4" },
        ];
      }

      const pieData = orderByChips(rawPie);

      const totalPieVal = pieData.reduce((acc, item) => acc + item.value, 0);
      const presentEntry = pieData.find((d) => d.id === "present") || pieData[0];
      const presentPct = totalPieVal > 0 && presentEntry ? Math.round((presentEntry.value / totalPieVal) * 100) : 0;

      return (
        <div className={pieLayoutClass}>
          <div className={`${pieChartClass} relative flex items-center justify-center`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={colSpan <= 3 ? 36 : 46}
                  outerRadius={colSpan <= 3 ? 54 : 66}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${entry.id}-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val}`, name]}
                  contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
                 labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-foreground leading-none">{presentPct}%</span>
              <span className="text-[8.5px] uppercase tracking-wider font-bold text-muted-foreground mt-0.5">Present</span>
            </div>
          </div>
          <div className={pieLegendClass}>
            {pieSubTitle && (
              <div className="text-[10.5px] font-bold text-primary mb-1 truncate">{pieSubTitle}</div>
            )}
            {pieData.map((d) => {
              const pct = totalPieVal > 0 ? Math.round((d.value / totalPieVal) * 100) : 0;
              return (
                <div
                  key={d.id}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl border transition-colors"
                  style={{
                    backgroundColor: `${d.color}0d`,
                    borderColor: `${d.color}22`,
                  }}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-foreground font-bold text-[10.5px] truncate">{d.name}</span>
                  </div>
                  <span className="text-[11px] font-black shrink-0" style={{ color: d.color }}>
                    {pct}%{" "}
                    <span className="text-[9px] text-muted-foreground font-medium">
                      ({d.value.toLocaleString()}{d.unit ? ` ${d.unit}` : ""})
                    </span>
                  </span>
                </div>
              );
            })}
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
                  <Tooltip contentStyle={CHART_TOOLTIP_CONTENT_STYLE}  labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
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
                    contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
                   labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
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
                    contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
                   labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
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
                <Tooltip contentStyle={CHART_TOOLTIP_CONTENT_STYLE}  labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
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
      const deptsList = settings?.departments || settings?.managedDepartments || (settings?.department ? [settings.department] : ["Sewing Floor", "Cutting Unit"]);
      const scopeScale =
        scope === "personal"
          ? 0.005
          : scope === "managed_depts" || scope === "department"
          ? Math.min(1, Math.max(0.25, deptsList.length / 6))
          : 1;

      const baseOtData = [
        { day: "Sat", hours: 420, cost: 58000 },
        { day: "Sun", hours: 610, cost: 84000 },
        { day: "Mon", hours: 580, cost: 79000 },
        { day: "Tue", hours: 640, cost: 89000 },
        { day: "Wed", hours: 590, cost: 81000 },
        { day: "Thu", hours: 680, cost: 95000 },
        { day: "Fri", hours: 320, cost: 44000 },
      ];

      const otData =
        scope === "personal"
          ? [
              { day: "Sat", hours: 2.5, cost: 625, costK: 0.63 },
              { day: "Sun", hours: 2.0, cost: 500, costK: 0.5 },
              { day: "Mon", hours: 3.0, cost: 750, costK: 0.75 },
              { day: "Tue", hours: 2.0, cost: 500, costK: 0.5 },
              { day: "Wed", hours: 3.5, cost: 875, costK: 0.88 },
              { day: "Thu", hours: 2.0, cost: 500, costK: 0.5 },
              { day: "Fri", hours: 1.5, cost: 375, costK: 0.38 },
            ]
          : baseOtData.map((d) => {
              const hrs = Math.round(d.hours * scopeScale);
              const amt = Math.round(d.cost * scopeScale);
              return {
                day: d.day,
                hours: hrs,
                cost: amt,
                costK: Number((amt / 1000).toFixed(1)),
              };
            });

      const totalHrs = otData.reduce((s, d) => s + d.hours, 0);
      const totalCost = otData.reduce((s, d) => s + d.cost, 0);

      return (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <div className="text-[10px] font-bold text-violet-600 uppercase">Total OT Hours</div>
              <div className="text-base font-black font-mono text-foreground">
                {totalHrs.toLocaleString()} <span className="text-[10px] font-semibold text-muted-foreground">hrs</span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-[10px] font-bold text-emerald-600 uppercase">Total OT Amount</div>
              <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                ৳{totalCost.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={otData} margin={{ top: 10, right: 6, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 9.5 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9.5 }} tickFormatter={(v) => `৳${v}K`} />
                <Tooltip
                  cursor={{ fill: "rgba(99, 102, 241, 0.06)" }}
                  formatter={(val: any, name: any, item: any) => {
                    if (name === "hours") return [`${val} hrs`, "OT Hours"];
                    return [`৳${Number(item?.payload?.cost ?? 0).toLocaleString()}`, "OT Amount"];
                  }}
                  contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
                  labelStyle={{ color: "#0f172a", fontWeight: 700, marginBottom: "2px" }}
                 itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
                <Legend
                  verticalAlign="top"
                  height={22}
                  formatter={(val) => (
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {val === "hours" ? "OT Hours" : "OT Amount (৳)"}
                    </span>
                  )}
                />
                <Bar yAxisId="left" dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="hours" />
                <Bar yAxisId="right" dataKey="costK" fill="#10b981" radius={[4, 4, 0, 0]} name="costK" />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
              <Tooltip contentStyle={CHART_TOOLTIP_CONTENT_STYLE}  labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
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

    case "hr_recruitment_pipeline": {
      const isYearly = settings?.period === "year";
      return (
        <div className={getMetricGridClass(colSpan, 4)}>
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
              {isYearly ? "Yearly Openings" : "Openings"}
            </span>
            <span className="text-xl font-mono font-bold text-foreground mt-1 block">
              {isYearly ? "186" : "18"}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {isYearly ? "FY 2026 Requisitions" : "Requisitions"}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">
              {isYearly ? "Screened (YTD)" : "Screening"}
            </span>
            <span className="text-xl font-mono font-bold text-foreground mt-1 block">
              {isYearly ? "1,480" : "142"}
            </span>
            <span className="text-[10px] text-muted-foreground">CVs Reviewed</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
              {isYearly ? "Interviewed (YTD)" : "Interview"}
            </span>
            <span className="text-xl font-mono font-bold text-foreground mt-1 block">
              {isYearly ? "340" : "24"}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {isYearly ? "Full Year" : "This Week"}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
              {isYearly ? "Hired (YTD)" : "Offered"}
            </span>
            <span className="text-xl font-mono font-bold text-foreground mt-1 block">
              {isYearly ? "142" : "6"}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {isYearly ? "94.2% Joined" : "Accepted"}
            </span>
          </div>
        </div>
      );
    }

    case "hr_requisitions_summary": {
      const deptsList = settings?.departments || settings?.managedDepartments || ["Sewing Floor", "Cutting Unit"];
      const scale =
        scope === "personal"
          ? 0.02
          : scope === "managed_depts" || scope === "department"
          ? Math.min(1, Math.max(0.25, deptsList.length / 6))
          : 1;

      const reqChips = orderByChips([
        {
          id: "total_req",
          label: "Total Requisitions",
          value: Math.max(1, Math.round(1248 * scale)).toLocaleString(),
          badge: "+12.5%",
          badgeCls: "text-emerald-500",
          valCls: "text-foreground",
          iconBg: "bg-indigo-500/10 text-indigo-500",
          icon: <FileCheck size={16} />,
          href: "/ssp-my-requisition",
        },
        {
          id: "pending_req",
          label: "Pending Requisitions",
          value: Math.max(0, Math.round(42 * scale)).toLocaleString(),
          badge: "+4.2%",
          badgeCls: "text-rose-500",
          valCls: "text-amber-500",
          iconBg: "bg-amber-500/10 text-amber-500",
          icon: <AlertCircle size={16} />,
          href: "/pending-approvals",
        },
        {
          id: "unread_msg",
          label: "Unread Messages",
          value: scope === "personal" ? "5" : Math.max(1, Math.round(18 * scale)).toString(),
          badge: "New",
          badgeCls: "text-muted-foreground",
          valCls: "text-foreground",
          iconBg: "bg-blue-500/10 text-blue-500",
          icon: <MessageCircle size={16} />,
          pulse: true,
          href: "/messenger",
        },
        {
          id: "my_req_pending",
          label: "My Requisition Pending",
          value: scope === "personal" ? "8" : Math.max(1, Math.round(12 * scale)).toString(),
          badge: "Awaiting",
          badgeCls: "text-amber-600",
          valCls: "text-amber-600 dark:text-amber-400",
          iconBg: "bg-orange-500/10 text-orange-500",
          icon: <Clock size={16} />,
          href: "/ssp-my-requisition",
        },
        {
          id: "my_app_pending",
          label: "My Approval Pending",
          value: scope === "personal" ? "14" : Math.max(2, Math.round(19 * scale)).toString(),
          badge: "Action Needed",
          badgeCls: "text-indigo-600",
          valCls: "text-indigo-600 dark:text-indigo-400",
          iconBg: "bg-purple-500/10 text-purple-500",
          icon: <CheckCircle2 size={16} />,
          href: "/pending-approvals",
        },
        {
          id: "approved_req",
          label: "Approved Requisitions",
          value: Math.max(1, Math.round(1184 * scale)).toLocaleString(),
          badge: "94.9%",
          badgeCls: "text-emerald-600",
          valCls: "text-emerald-600 dark:text-emerald-400",
          iconBg: "bg-emerald-500/10 text-emerald-500",
          icon: <CheckCircle2 size={16} />,
          href: "/all-approvals",
        },
      ]);

      const reqGridCls = colSpan <= 4 ? "grid grid-cols-1 gap-1.5 py-0.5" : getMetricGridClass(colSpan, Math.max(1, reqChips.length));

      return (
        <div className={reqGridCls}>
          {reqChips.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                window.location.href = c.href;
              }}
              className="w-full text-left px-3 py-2 rounded-xl border border-border/80 bg-card shadow-2xs flex items-center justify-between gap-2.5 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group/req"
            >
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-muted-foreground group-hover/req:text-primary uppercase tracking-wider truncate transition-colors">
                  {c.label}
                </p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className={`${colSpan <= 4 ? "text-lg" : "text-2xl"} font-extrabold ${c.valCls}`}>{c.value}</span>
                  <span className={`text-[9.5px] font-bold ${c.badgeCls}`}>{c.badge}</span>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center relative shrink-0`}>
                {c.icon}
                {c.pulse && (
                  <span className="absolute -top-0.5 -right-0.5 size-2 bg-red-500 border border-card rounded-full animate-pulse" />
                )}
              </div>
            </button>
          ))}
        </div>
      );
    }

    case "hr_ontime_vs_late_chart": {
      const deptsList = settings?.departments || settings?.managedDepartments || ["Sewing Floor", "Cutting Unit"];
      const scale =
        scope === "personal"
          ? 0.22
          : scope === "managed_depts" || scope === "department"
          ? Math.min(1, Math.max(0.3, deptsList.length / 6))
          : 1;

      const ontimeData = [
        { month: "Jan", onTime: Math.round(95 * scale), late: Math.round(12 * scale) },
        { month: "Feb", onTime: Math.round(98 * scale), late: Math.round(8 * scale) },
        { month: "Mar", onTime: Math.round(92 * scale), late: Math.round(15 * scale) },
        { month: "Apr", onTime: Math.round(99 * scale), late: Math.round(5 * scale) },
        { month: "May", onTime: Math.round(102 * scale), late: Math.round(10 * scale) },
        { month: "Jun", onTime: Math.round(94 * scale), late: Math.round(14 * scale) },
      ];

      return (
        <div className="h-[220px] w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ontimeData} margin={{ top: 8, right: 6, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} dy={6} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} />
              <Tooltip
                cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
               labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
              {isChipVisible("ontime") && <Bar dataKey="onTime" name="On Time" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />}
              {isChipVisible("late") && <Bar dataKey="late" name="Late" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={12} />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    case "hr_leave_balance_card": {
      const leaveItems = orderByChips([
        { id: "casual", name: "Casual Leave", left: 7, total: 10, used: 3, pct: 70, bgCls: "bg-blue-500/5 border-blue-500/10", txtCls: "text-blue-600 dark:text-blue-400", ringCls: "text-blue-500" },
        { id: "sick", name: "Sick Leave", left: 12, total: 14, used: 2, pct: 86, bgCls: "bg-emerald-500/5 border-emerald-500/10", txtCls: "text-emerald-600 dark:text-emerald-400", ringCls: "text-emerald-500" },
        { id: "earned", name: "Earned Leave", left: 18, total: 18, used: 0, pct: 100, bgCls: "bg-amber-500/5 border-amber-500/10", txtCls: "text-amber-600 dark:text-amber-400", ringCls: "text-amber-500" },
        { id: "maternity", name: "Maternity", left: 90, total: 90, used: 0, pct: 100, bgCls: "bg-purple-500/5 border-purple-500/10", txtCls: "text-purple-600 dark:text-purple-400", ringCls: "text-purple-500" },
        { id: "compoff", name: "Comp Off", left: 2, total: 4, used: 2, pct: 50, bgCls: "bg-indigo-500/5 border-indigo-500/10", txtCls: "text-indigo-600 dark:text-indigo-400", ringCls: "text-indigo-500" },
        { id: "lwp", name: "Without Pay", left: 0, total: 0, used: 5, pct: 0, bgCls: "bg-slate-500/5 border-slate-500/10", txtCls: "text-slate-600 dark:text-slate-400", ringCls: "text-slate-500" },
      ]);
      return (
        <div className="flex flex-col justify-start">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[10.5px] text-muted-foreground">Scroll horizontally to view all allocations</p>
            <span className="text-[9.5px] font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
              {leaveItems.length} Types
            </span>
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
            {leaveItems.map((leave) => (
              <div
                key={leave.id}
                className={`p-2.5 rounded-xl border ${leave.bgCls} flex flex-col justify-between items-center text-center w-[125px] min-w-[125px] h-[185px] shrink-0 transition-all duration-200 hover:scale-[1.015] hover:shadow-xs`}
              >
                <div className="size-14 flex items-center justify-center relative shrink-0 mt-1">
                  <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="3.5" fill="transparent" className="text-muted-foreground/10" />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      fill="transparent"
                      strokeDasharray="138.2"
                      strokeDashoffset={138.2 - (leave.pct / 100) * 138.2}
                      className={leave.ringCls}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={`text-[10px] font-extrabold ${leave.txtCls}`}>{leave.pct}%</span>
                </div>
                <div className="mt-1 flex-1 flex flex-col justify-center w-full">
                  <span className={`text-[9.5px] font-black tracking-wider uppercase block ${leave.txtCls} truncate w-full`}>
                    {leave.name}
                  </span>
                  <span className="text-sm font-extrabold text-foreground mt-0.5 block">
                    {leave.left} <span className="text-[9px] font-normal text-muted-foreground">/ {leave.total}</span>
                  </span>
                </div>
                <div className="mt-1 pt-1.5 border-t border-border/40 w-full flex justify-between text-[8px] font-bold text-muted-foreground">
                  <span>Left: {leave.left}</span>
                  <span>Used: {leave.used}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "hr_notice_board": {
      const notices = orderByChips([
        {
          id: "holiday",
          title: "Holiday Notice",
          category: "HOLIDAY",
          date: "Aug 16, 2026",
          circularNo: "PSL/HR/2026/0010",
          summary: "Pakiza Software Limited issued a holiday notice for an office closure from Wednesday, August 5, 2026, to Saturday.",
          badgeBg: "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400",
        },
        {
          id: "meeting",
          title: "Monthly Performance Review",
          category: "MEETING",
          date: "Aug 20, 2026",
          circularNo: "PSL/HR/2026/0013",
          summary: "The monthly performance review cycle for August 2026 has been initiated.",
          badgeBg: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400",
        },
        {
          id: "policy",
          title: "Dress Code Policy Update",
          category: "POLICY",
          date: "Aug 18, 2026",
          circularNo: "PSL/HR/2026/0014",
          summary: "Updates regarding office dress code policy, effective from September 1, 2026.",
          badgeBg: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
        },
      ]);
      return (
        <div className="flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[10.5px] text-muted-foreground flex items-center gap-1">
              <Megaphone className="size-3 text-primary" /> Official circulars &amp; announcements
            </p>
            <button
              type="button"
              onClick={() => {
                window.location.href = "/notice";
              }}
              className="text-[10.5px] font-bold flex items-center gap-1 text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              View All <ArrowRight size={11} />
            </button>
          </div>
          <div className="space-y-1.5">
            {notices.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  window.location.href = "/notice";
                }}
                className="py-1.5 px-2.5 rounded-xl border border-border/40 hover:border-primary/30 bg-muted/10 hover:bg-primary/5 transition-all duration-200 cursor-pointer group/item"
              >
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className={`text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded ${n.badgeBg}`}>
                    {n.category}
                  </span>
                  <span className="text-[8.5px] font-semibold text-muted-foreground font-mono">{n.date}</span>
                </div>
                <h5 className="font-bold text-[11px] text-foreground group-hover/item:text-primary transition-colors leading-tight line-clamp-1">
                  {n.title}
                </h5>
                <p className="text-[9.5px] text-muted-foreground mt-0.5 line-clamp-1 font-medium">{n.summary}</p>
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-border/20 text-[8.5px] font-bold text-muted-foreground/60">
                  <span>Ref: {n.circularNo}</span>
                  <span className="flex items-center gap-0.5 text-primary opacity-0 group-hover/item:opacity-100 transition-opacity">
                    Read <Eye size={10} />
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/notice";
            }}
            className="w-full py-1.5 text-xs font-bold rounded-lg border border-border bg-muted/50 hover:bg-muted text-foreground transition-colors text-center shadow-2xs cursor-pointer"
          >
            Go to Notice Board
          </button>
        </div>
      );
    }

    case "hr_messages_feed": {
      const msgs = orderByChips([
        {
          id: "hr_desk",
          from: "HR Department",
          time: "10:42 AM",
          text: "Sarah: Please review the updated policy document.",
          initials: "HR",
          avatarBg: "bg-blue-500/10 text-blue-600",
          unread: true,
        },
        {
          id: "floor_chief",
          from: "Michael Chen",
          time: "Yesterday",
          text: "Are we still on for the 3PM sync?",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
          statusColor: "bg-emerald-500",
          unread: false,
        },
        {
          id: "payroll",
          from: "Alice Smith",
          time: "Mon",
          text: "Thanks for sending over the assets!",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
          statusColor: "bg-amber-500",
          unread: false,
        },
        {
          id: "it_support",
          from: "IT Support",
          time: "Mon",
          text: "Ticket #4042 has been marked resolved.",
          initials: "IT",
          avatarBg: "bg-purple-500/10 text-purple-600",
          unread: false,
        },
      ]);
      return (
        <div className="flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[10.5px] text-muted-foreground">Unread and latest conversations</p>
            <button
              type="button"
              onClick={() => {
                window.location.href = "/messenger";
              }}
              className="text-[10.5px] font-bold flex items-center gap-1 text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              View All <ArrowRight size={11} />
            </button>
          </div>
          <div className="space-y-1.5">
            {msgs.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  window.location.href = "/messenger";
                }}
                className="flex items-start gap-2.5 p-1.5 rounded-xl border border-border/40 hover:border-primary/30 bg-muted/10 hover:bg-primary/5 cursor-pointer transition-all duration-200 group/item"
              >
                <div className="relative shrink-0">
                  {m.image ? (
                    <img
                      src={m.image}
                      alt={m.from}
                      className="w-8 h-8 rounded-full object-cover border-2 border-background shadow-xs"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full ${m.avatarBg} flex items-center justify-center border-2 border-background font-bold text-[10px] shadow-xs`}>
                      {m.initials}
                    </div>
                  )}
                  {m.unread && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 border border-background rounded-full animate-pulse shadow-xs" />
                  )}
                  {m.statusColor && (
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${m.statusColor} border-2 border-background rounded-full shadow-xs`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h5 className="font-bold text-[11px] text-foreground group-hover/item:text-primary transition-colors truncate">
                      {m.from}
                    </h5>
                    <span className={`text-[8.5px] shrink-0 ${m.unread ? "font-bold text-primary" : "font-semibold text-muted-foreground"}`}>
                      {m.time}
                    </span>
                  </div>
                  <p className={`text-[10px] mt-0.5 truncate ${m.unread ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>
                    {m.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/messenger";
            }}
            className="w-full py-1.5 text-xs font-bold rounded-lg border border-border bg-primary text-primary-foreground hover:opacity-90 shadow-xs transition-opacity cursor-pointer"
          >
            Open Messenger
          </button>
        </div>
      );
    }

    case "hr_upcoming_events": {
      const events = orderByChips([
        {
          id: "birthdays",
          title: "Anika's Birthday",
          date: "Today",
          cardCls: "border-rose-500/10 bg-rose-500/5",
          iconBgCls: "bg-rose-500/10 text-rose-500",
          icon: <Gift size={12} />,
        },
        {
          id: "anniversaries",
          title: "Jordan Park (5y)",
          date: "Tomorrow",
          cardCls: "border-amber-500/10 bg-amber-500/5",
          iconBgCls: "bg-amber-500/10 text-amber-500",
          icon: <Briefcase size={12} />,
        },
        {
          id: "interviews",
          title: "Interview: Sr. PM",
          date: "Jun 11, 2:00 PM",
          cardCls: "border-blue-500/10 bg-blue-500/5",
          iconBgCls: "bg-blue-500/10 text-blue-500",
          icon: <Users size={12} />,
        },
        {
          id: "holidays",
          title: "All-hands Meeting",
          date: "Jun 14, 10:00 AM",
          cardCls: "border-purple-500/10 bg-purple-500/5",
          iconBgCls: "bg-purple-500/10 text-purple-500",
          icon: <Calendar size={12} />,
        },
      ]);
      return (
        <div className="flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[10.5px] text-muted-foreground">Events &amp; milestones this week</p>
            <button
              type="button"
              onClick={() => {
                window.location.href = "/calendar";
              }}
              className="text-[10.5px] font-bold flex items-center gap-1 text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              Calendar <ArrowRight size={11} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {events.map((ev) => (
              <div key={ev.id} className={`p-2.5 rounded-xl border ${ev.cardCls} flex items-start gap-2 min-h-[68px]`}>
                <div className={`mt-0.5 p-1 rounded-lg ${ev.iconBgCls} shrink-0`}>{ev.icon}</div>
                <div className="min-w-0">
                  <h5 className="font-bold text-[11px] text-foreground truncate">{ev.title}</h5>
                  <p className="text-[9.5px] text-muted-foreground font-bold mt-0.5">{ev.date}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/calendar";
            }}
            className="w-full py-1.5 text-xs font-bold rounded-lg border border-border bg-muted/50 hover:bg-muted text-foreground transition-colors cursor-pointer"
          >
            View Full Calendar
          </button>
        </div>
      );
    }

    case "hr_team_members": {
      const teamMembers = [
        { id: "2024049326", group: "sr_exec", name: "Hanif Uddin", role: "Sr. Executive", phone: "01963978074", email: "hanif.inno@pakizasoftware.com", image: "https://bpm.pakizaknit.com/Photo/EmpPicture/9caa5b84-6645-47c9-a35f-906ec1002c4d.jpg" },
        { id: "2026058726", group: "exec", name: "Parvej Mahmud", role: "Executive", phone: "01521205808", email: "parvej.inno@pakizasoftware.com", image: "https://bpm.pakizaknit.com/Photo/EmpPicture/b224da2f-32a6-4ab5-b98d-2fa9bddc2faa.jpg" },
        { id: "2026058686", group: "exec", name: "Md. Abdur Rahaman", role: "Executive", phone: "01531959653", email: "rahaman.inno@pakizasoftware.com", image: "https://bpm.pakizaknit.com/Photo/EmpPicture/c32e2945-6433-43f7-835d-fd238617c955.jpg" },
        { id: "2023043910", group: "managers", name: "Tahmid Afsar", role: "Asst. Manager", phone: "01750021154", email: "tahmid.bd@pakizasoftware.com", image: "https://bpm.pakizaknit.com/Photo/EmpPicture/ab9adb3b-d38f-45bf-9569-22dc5ec46fcd.jpg" },
        { id: "2025054609", group: "jr_exec", name: "Md Mahir Shahriyar", role: "Jr. Executive", phone: "01713060427", email: "", image: "https://bpm.pakizaknit.com/Photo/EmpPicture/b314987a-a621-4906-9a64-2a18104da3e6.jpg" },
        { id: "2023044078", group: "managers", name: "Md. Anik Islam", role: "Deputy Manager", phone: "01324726844", email: "anik.ba@pakizasoftware.com", image: "https://bpm.pakizaknit.com/Photo/EmpPicture/3bc63d43-b2f2-49aa-b0a2-1e7eda819a65.jpg" },
        { id: "2024049166", group: "sr_exec", name: "MD Maimoon Hossain Shomoy", role: "Sr. Executive", phone: "01796221964", email: "shomoy.inno@pakizasoftware.com", image: "https://bpm.pakizaknit.com/Photo/EmpPicture/988bc5ac-552c-48bd-9d6f-cc2329c56d08.jpg" },
        { id: "2024051510", group: "jr_exec", name: "Md. Sadmanur Islam Shishir", role: "Jr. Executive", phone: "01946432534", email: "shishir.inno@pakizasoftware.com", image: "https://bpm.pakizaknit.com/Photo/EmpPicture/e4668770-dddd-4026-b3e6-963fbeedb13a.jpg" },
        { id: "2025053125", group: "sr_exec", name: "Al Riyad Karim", role: "Sr. Executive", phone: "01732461622", email: "", image: "https://bpm.pakizaknit.com/Photo/EmpPicture/7668c174-80e8-49bf-808f-5b6624c853a0.jpg" },
        { id: "2025054707", group: "jr_exec", name: "Allama Bakhtiyar Nafis", role: "Jr. Executive", phone: "01724654380", email: "nafis.inno@pakizasoftware.com", image: "https://bpm.pakizaknit.com/Photo/EmpPicture/abd4f21d-eb54-4cc6-a197-ca373e4693be.jpg" },
        { id: "2025054710", group: "jr_exec", name: "Raihan Jami Khan", role: "Jr. Executive", phone: "01786076080", email: "jami.inno@pakizasoftware.com", image: "https://bpm.pakizaknit.com/Photo/EmpPicture/93e35c4c-f827-4152-8faa-34ed422a1629.jpg" },
        { id: "2026059418", group: "jr_exec", name: "Md Robayet Hasan Yeasin", role: "Jr. Executive", phone: "01748570672", email: "yeasin.inno@pakizasoftware.com", image: "https://bpm.pakizaknit.com/Photo/EmpPicture/4e73fa2f-e1d4-4b6a-90f8-153d977f9e63.jpg" },
        { id: "2026059427", group: "jr_exec", name: "Mir Md Moshiu Islam", role: "Jr. Executive", phone: "01898899180", email: "moshiu.inno@pakizasoftware.com", image: "https://bpm.pakizaknit.com/Photo/EmpPicture/108e0e41-f8c9-439c-aa94-46a83b263b3a.jpg" },
        { id: "2026059573", group: "exec", name: "Md. Piyash Hasan", role: "Executive", phone: "01790800372", email: "piyash.inno@pakizasoftware.com", image: "https://bpm.pakizaknit.com/Photo/EmpPicture/0fa2e575-f1e5-4490-9e5b-6b89d039ce10.jpg" },
        { id: "2026060310", group: "sr_exec", name: "Md. Shahid Hasan", role: "Sr. Executive", phone: "", email: "", image: "https://i.pravatar.cc/150?u=2026060310" },
      ].filter((m) => isChipVisible(m.group));

      const gridCols =
        colSpan <= 4
          ? "grid-cols-1"
          : colSpan <= 8
          ? "grid-cols-1 sm:grid-cols-2"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

      return (
        <div className={`grid ${gridCols} gap-3`}>
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="p-3 rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-sm hover:border-primary/30 transition-all group flex items-center gap-3"
            >
              <div className="relative shrink-0">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-background shadow-2xs"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-[1.5px] border-background rounded-full" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground text-[12.5px] truncate group-hover:text-primary transition-colors">
                  {member.name}
                </h4>
                <p className="text-[10px] text-muted-foreground font-medium truncate">
                  {member.role} <span className="opacity-50 mx-0.5">•</span> {member.id}
                </p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 truncate">
                  <Phone size={10} className="text-primary/70 shrink-0" />
                  {member.phone || "N/A"}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {member.email ? (
                  <a
                    href={`mailto:${member.email}`}
                    title="Send Email"
                    className="p-1.5 rounded-md bg-muted/50 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                  >
                    <Mail size={14} />
                  </a>
                ) : (
                  <div className="p-1.5 rounded-md bg-transparent text-muted-foreground/20 cursor-not-allowed">
                    <Mail size={14} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    case "hr_manpower_budget_vs_onboard": {
      const deptsList = settings?.departments || settings?.managedDepartments || ["Sewing Floor", "Cutting Unit"];
      const scale =
        scope === "managed_depts" || scope === "department"
          ? Math.min(1, Math.max(0.25, deptsList.length / 6))
          : 1;

      const budgetMp = Math.round(6800 * scale);
      const onboardMp = Math.round(6437 * scale);
      const vacancyMp = Math.max(0, budgetMp - onboardMp);
      const fillRate = ((onboardMp / Math.max(1, budgetMp)) * 100).toFixed(1);

      const avgSalary = 18000;
      const budgetAmt = budgetMp * avgSalary;
      const onboardAmt = onboardMp * avgSalary;
      const vacancyAmt = vacancyMp * avgSalary;

      const formatTakaShort = (amt: number) => {
        if (amt >= 10000000) return `৳${(amt / 10000000).toFixed(2)} Cr`;
        if (amt >= 100000) return `৳${(amt / 100000).toFixed(1)} L`;
        return `৳${amt.toLocaleString()}`;
      };

      const mpChips = orderByChips([
        { id: "budget_mp", label: "Budgeted MP", value: formatTakaShort(budgetAmt), sub: `${budgetMp.toLocaleString()} Headcount`, cls: "bg-blue-500/10 border-blue-500/20", titleCls: "text-blue-600", valCls: "text-foreground" },
        { id: "onboard_mp", label: "Actual On-Board", value: formatTakaShort(onboardAmt), sub: `${onboardMp.toLocaleString()} Employees`, cls: "bg-emerald-500/10 border-emerald-500/20", titleCls: "text-emerald-600", valCls: "text-emerald-600 dark:text-emerald-400" },
        { id: "vacancy", label: "Vacancy / Gap", value: formatTakaShort(vacancyAmt), sub: `${vacancyMp.toLocaleString()} Open Positions`, cls: "bg-amber-500/10 border-amber-500/20", titleCls: "text-amber-600", valCls: "text-amber-600 dark:text-amber-400" },
        { id: "fill_rate", label: "Fill Rate", value: `${fillRate}%`, sub: `${onboardMp.toLocaleString()} / ${budgetMp.toLocaleString()} MP`, cls: "bg-indigo-500/10 border-indigo-500/20", titleCls: "text-indigo-600", valCls: "text-indigo-600 dark:text-indigo-400" },
      ]);

      const mpChartData = [
        { dept: "Sewing", budgetCount: Math.round(3450 * scale), onboardCount: Math.round(3287 * scale) },
        { dept: "QC", budgetCount: Math.round(800 * scale), onboardCount: Math.round(760 * scale) },
        { dept: "Finishing", budgetCount: Math.round(680 * scale), onboardCount: Math.round(639 * scale) },
        { dept: "Wash", budgetCount: Math.round(660 * scale), onboardCount: Math.round(638 * scale) },
        { dept: "Cutting", budgetCount: Math.round(410 * scale), onboardCount: Math.round(383 * scale) },
        { dept: "Packing", budgetCount: Math.round(220 * scale), onboardCount: Math.round(197 * scale) },
      ].map((d) => ({
        ...d,
        budget: Number(((d.budgetCount * avgSalary) / 100000).toFixed(1)),
        onboard: Number(((d.onboardCount * avgSalary) / 100000).toFixed(1)),
      }));

      return (
        <div className="space-y-3">
          <div className={getMetricGridClass(colSpan, Math.max(1, mpChips.length))}>
            {mpChips.map((c) => (
              <div key={c.id} className={`p-2.5 rounded-xl border ${c.cls}`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider block truncate ${c.titleCls}`}>
                  {c.label}
                </span>
                <div className={`text-lg sm:text-xl font-black font-mono mt-0.5 ${c.valCls}`}>{c.value}</div>
                <div className="text-[10px] font-semibold text-muted-foreground truncate">{c.sub}</div>
              </div>
            ))}
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mpChartData} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="dept" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 9.5 }} tickFormatter={(v) => `৳${v}L`} />
                <Tooltip
                  cursor={{ fill: "rgba(59, 130, 246, 0.06)" }}
                  formatter={(val: any, name: any, props: any) => {
                    const cnt = name === "Budgeted Amount" ? props?.payload?.budgetCount : props?.payload?.onboardCount;
                    return [`৳${val}L (${cnt?.toLocaleString() || 0} MP)`, name];
                  }}
                  contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
                  labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                  itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                />
                <Legend
                  verticalAlign="top"
                  height={22}
                  formatter={(val) => (
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {val}
                    </span>
                  )}
                />
                <Bar dataKey="budget" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Budgeted Amount" />
                <Bar dataKey="onboard" fill="#10b981" radius={[3, 3, 0, 0]} name="Actual On-Board" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    case "hr_separation_turnover": {
      const deptsList = settings?.departments || settings?.managedDepartments || ["Sewing Floor", "Cutting Unit"];
      const scale =
        scope === "managed_depts" || scope === "department"
          ? Math.min(1, Math.max(0.25, deptsList.length / 6))
          : 1;

      const resignCnt = Math.max(1, Math.round(84 * scale));
      const leftyCnt = Math.max(1, Math.round(46 * scale));
      const termCnt = Math.max(0, Math.round(11 * scale));
      const retCnt = Math.max(0, Math.round(4 * scale));
      const totalSep = resignCnt + leftyCnt + termCnt + retCnt;

      const sepChips = orderByChips([
        { id: "total_sep", label: "Total Separation", value: totalSep.toLocaleString(), sub: "This Month", cls: "bg-rose-500/10 border-rose-500/20", titleCls: "text-rose-600", valCls: "text-rose-600 dark:text-rose-400" },
        { id: "turnover_rate", label: "Turnover Rate", value: "2.25%", sub: "Target <3.0%", cls: "bg-indigo-500/10 border-indigo-500/20", titleCls: "text-indigo-600", valCls: "text-foreground" },
        { id: "resign", label: "Resign", value: resignCnt.toLocaleString(), sub: "Formal exit", cls: "bg-amber-500/10 border-amber-500/20", titleCls: "text-amber-600", valCls: "text-amber-600 dark:text-amber-400" },
        { id: "lefty", label: "Lefty", value: leftyCnt.toLocaleString(), sub: "Unauthorized", cls: "bg-red-500/10 border-red-500/20", titleCls: "text-red-600", valCls: "text-red-600 dark:text-red-400" },
        { id: "terminated", label: "Terminated", value: termCnt.toLocaleString(), sub: "Disciplinary", cls: "bg-slate-500/10 border-slate-500/20", titleCls: "text-slate-600", valCls: "text-foreground" },
        { id: "retired", label: "Retired", value: retCnt.toLocaleString(), sub: "Superannuation", cls: "bg-purple-500/10 border-purple-500/20", titleCls: "text-purple-600", valCls: "text-purple-600 dark:text-purple-400" },
      ]);

      const sepTrendData = [
        { month: "Jun", resign: Math.round(72 * scale), lefty: Math.round(38 * scale) },
        { month: "Jul", resign: Math.round(88 * scale), lefty: Math.round(49 * scale) },
        { month: "Aug", resign: Math.round(79 * scale), lefty: Math.round(42 * scale) },
        { month: "Sep", resign: Math.round(91 * scale), lefty: Math.round(51 * scale) },
        { month: "Oct", resign: Math.round(76 * scale), lefty: Math.round(40 * scale) },
        { month: "Nov", resign: resignCnt, lefty: leftyCnt },
      ];

      return (
        <div className="space-y-3">
          <div className={getMetricGridClass(colSpan, Math.max(1, sepChips.length))}>
            {sepChips.map((c) => (
              <div key={c.id} className={`p-2.5 rounded-xl border ${c.cls}`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider block truncate ${c.titleCls}`}>
                  {c.label}
                </span>
                <div className={`text-lg sm:text-xl font-black font-mono mt-0.5 ${c.valCls}`}>{c.value}</div>
                <div className="text-[10px] text-muted-foreground truncate">{c.sub}</div>
              </div>
            ))}
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sepTrendData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 9.5 }} />
                <Tooltip
                  cursor={{ fill: "rgba(244, 63, 94, 0.06)" }}
                  contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
                 labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
                <Legend
                  verticalAlign="top"
                  height={22}
                  formatter={(val) => (
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {val === "resign" ? "Resign" : "Lefty"}
                    </span>
                  )}
                />
                <Bar dataKey="resign" fill="#f59e0b" radius={[3, 3, 0, 0]} name="resign" />
                <Bar dataKey="lefty" fill="#f43f5e" radius={[3, 3, 0, 0]} name="lefty" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    case "hr_increment_yearly": {
      const deptsList = settings?.departments || settings?.managedDepartments || ["Sewing Floor", "Cutting Unit"];
      const scale =
        scope === "personal"
          ? 0.002
          : scope === "managed_depts" || scope === "department"
          ? Math.min(1, Math.max(0.25, deptsList.length / 6))
          : 1;

      const rawMonths = [
        { month: "Jan", amt: 840000, staff: 520 },
        { month: "Feb", amt: 310000, staff: 195 },
        { month: "Mar", amt: 245000, staff: 150 },
        { month: "Apr", amt: 420000, staff: 260 },
        { month: "May", amt: 190000, staff: 120 },
        { month: "Jun", amt: 280000, staff: 175 },
        { month: "Jul", amt: 1420000, staff: 890 },
        { month: "Aug", amt: 360000, staff: 220 },
        { month: "Sep", amt: 210000, staff: 135 },
        { month: "Oct", amt: 295000, staff: 185 },
        { month: "Nov", amt: 165000, staff: 105 },
        { month: "Dec", amt: 125000, staff: 85 },
      ].map((m) => {
        const scaledAmt = Math.round(m.amt * scale);
        return {
          month: m.month,
          amt: scaledAmt,
          amtLac: Number((scaledAmt / 100000).toFixed(2)),
          staff: Math.max(1, Math.round(m.staff * scale)),
        };
      });

      const totalAmt = rawMonths.reduce((s, m) => s + m.amt, 0);
      const totalStaff = scope === "personal" ? 1 : rawMonths.reduce((s, m) => s + m.staff, 0);
      const peak = rawMonths.reduce((best, curr) => (curr.amt > best.amt ? curr : best), rawMonths[0]);

      const incChips = orderByChips([
        {
          id: "total_inc_amt",
          label: "Total Yearly Increment",
          value: totalAmt >= 100000 ? `৳${(totalAmt / 100000).toFixed(2)} Lac` : `৳${totalAmt.toLocaleString()}`,
          sub: "FY 2026 Total",
          cls: "bg-emerald-500/10 border-emerald-500/20",
          titleCls: "text-emerald-600",
          valCls: "text-emerald-600 dark:text-emerald-400",
        },
        {
          id: "inc_employees",
          label: "Incremented Staff",
          value: totalStaff.toLocaleString(),
          sub: "Employees covered",
          cls: "bg-blue-500/10 border-blue-500/20",
          titleCls: "text-blue-600",
          valCls: "text-foreground",
        },
        {
          id: "avg_inc_pct",
          label: "Avg Increment %",
          value: "8.4%",
          sub: "Across grades",
          cls: "bg-indigo-500/10 border-indigo-500/20",
          titleCls: "text-indigo-600",
          valCls: "text-indigo-600 dark:text-indigo-400",
        },
        {
          id: "peak_month",
          label: "Peak Month",
          value: `${peak.month} (৳${peak.amtLac}L)`,
          sub: `${peak.staff} staff`,
          cls: "bg-purple-500/10 border-purple-500/20",
          titleCls: "text-purple-600",
          valCls: "text-purple-600 dark:text-purple-400",
        },
      ]);

      return (
        <div className="space-y-3">
          <div className={getMetricGridClass(colSpan, Math.max(1, incChips.length))}>
            {incChips.map((c) => (
              <div key={c.id} className={`p-2.5 rounded-xl border ${c.cls}`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider block truncate ${c.titleCls}`}>
                  {c.label}
                </span>
                <div className={`text-lg sm:text-xl font-black font-mono mt-0.5 ${c.valCls}`}>{c.value}</div>
                <div className="text-[10px] text-muted-foreground truncate">{c.sub}</div>
              </div>
            ))}
          </div>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rawMonths} margin={{ top: 18, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 9.5 }} tickFormatter={(v) => `৳${v}L`} />
                <Tooltip
                  cursor={{ fill: "rgba(16, 185, 129, 0.06)" }}
                  formatter={(_, __, item) => {
                    const p = item?.payload;
                    return [`৳${Number(p?.amt ?? 0).toLocaleString()} (${p?.staff} staff)`, "Increment Amount"];
                  }}
                  contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
                 labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
                <Bar dataKey="amtLac" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={38}>
                  <LabelList
                    dataKey="amtLac"
                    position="top"
                    formatter={(v: any) => `৳${v}L`}
                    style={{ fontSize: "9.5px", fontWeight: 700, fill: "#059669" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

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
                <Tooltip formatter={(val: any) => [`${val}% Share`, "Volume"]} contentStyle={CHART_TOOLTIP_CONTENT_STYLE}  labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
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
              <Tooltip contentStyle={CHART_TOOLTIP_CONTENT_STYLE}  labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
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
      const isYearly = settings?.period === "year";
      const areasList = settings?.areas || ["Dhaka North / Gazipur"];
      const deptsList = settings?.departments || settings?.managedDepartments || (settings?.department ? [settings.department] : ["Sewing Floor", "Cutting Unit"]);

      const scopeFactor =
        scope === "personal"
          ? 0.0012
          : scope === "area"
            ? Math.min(1, Math.max(0.3, areasList.length / 3))
            : scope === "managed_depts" || scope === "department"
              ? Math.min(1, Math.max(0.25, deptsList.length / 6))
              : 1;
      const mult = isYearly ? 12 : 1;

      let payChips: Array<{ id: string; label: string; value: string; sub: string; cls: string; titleCls: string; valCls: string }> = [];

      if (scope === "personal") {
        payChips = [
          { id: "gross_payroll", label: isYearly ? "Yearly Earnings" : "Gross Earnings", value: `৳${(42000 * mult).toLocaleString()}`, sub: isYearly ? "FY 2026 Total" : "Basic + Allowances", cls: "bg-emerald-500/10 border-emerald-500/20", titleCls: "text-emerald-600", valCls: "text-emerald-700 dark:text-emerald-300" },
          { id: "ot_payout", label: isYearly ? "Yearly OT" : "OT Allowance", value: `৳${(4120 * mult).toLocaleString()}`, sub: isYearly ? "Annual OT" : "16.5 hrs approved", cls: "bg-blue-500/10 border-blue-500/20", titleCls: "text-blue-600", valCls: "text-blue-700 dark:text-blue-300" },
          { id: "net_disbursed", label: isYearly ? "Yearly Net" : "My Net Payable", value: `৳${(38500 * mult).toLocaleString()}`, sub: "Bank Asia ***892", cls: "bg-purple-500/10 border-purple-500/20", titleCls: "text-purple-600", valCls: "text-foreground" },
          { id: "pending_bank", label: "Deductions", value: `৳${(3500 * mult).toLocaleString()}`, sub: "Tax & PF", cls: "bg-rose-500/10 border-rose-500/20", titleCls: "text-rose-600", valCls: "text-rose-700 dark:text-rose-300" },
        ];
      } else {
        const prefix =
          scope === "area"
            ? `${areasList.length} Area(s)`
            : scope === "managed_depts" || scope === "department"
              ? deptsList.length > 1 ? `${deptsList.length} Depts` : deptsList[0]
              : isYearly ? "FY 2026" : "Nov 2026";
        payChips = [
          { id: "gross_payroll", label: isYearly ? "Yearly Payroll" : "Net Payroll Payable", value: `৳${(3.28 * scopeFactor * mult).toFixed(2)} Cr`, sub: prefix, cls: "bg-purple-500/10 border-purple-500/20", titleCls: "text-purple-600", valCls: "text-foreground" },
          { id: "ot_payout", label: isYearly ? "Yearly OT Payout" : "OT Allowance", value: isYearly ? `৳${(4.61 * scopeFactor).toFixed(2)} Cr` : `৳${(38.4 * scopeFactor).toFixed(1)} Lac`, sub: "Approved OT", cls: "bg-blue-500/10 border-blue-500/20", titleCls: "text-blue-600", valCls: "text-blue-700 dark:text-blue-300" },
          { id: "net_disbursed", label: "Bank Transfer (88%)", value: `৳${(2.89 * scopeFactor * mult).toFixed(2)} Cr`, sub: "BEFTN / EFT", cls: "bg-emerald-500/10 border-emerald-500/20", titleCls: "text-emerald-600", valCls: "text-emerald-700 dark:text-emerald-300" },
          { id: "pending_bank", label: "Cash / MFS (12%)", value: isYearly ? `৳${(4.68 * scopeFactor).toFixed(2)} Cr` : `৳${(39.2 * scopeFactor).toFixed(1)} Lac`, sub: "Floor cash & MFS", cls: "bg-amber-500/10 border-amber-500/20", titleCls: "text-amber-600", valCls: "text-amber-700 dark:text-amber-300" },
        ];
      }

      const yearlyPayrollChart = [
        { month: "Jan", salary: 312, ot: 34 },
        { month: "Feb", salary: 308, ot: 31 },
        { month: "Mar", salary: 325, ot: 39 },
        { month: "Apr", salary: 342, ot: 44 },
        { month: "May", salary: 318, ot: 35 },
        { month: "Jun", salary: 356, ot: 48 },
        { month: "Jul", salary: 322, ot: 36 },
        { month: "Aug", salary: 326, ot: 38 },
        { month: "Sep", salary: 330, ot: 41 },
        { month: "Oct", salary: 334, ot: 40 },
        { month: "Nov", salary: 328, ot: 38 },
        { month: "Dec", salary: 335, ot: 37 },
      ].map((m) => ({
        month: m.month,
        salary: Number((m.salary * scopeFactor).toFixed(1)),
        ot: Number((m.ot * scopeFactor).toFixed(1)),
      }));

      const visiblePayChips = orderByChips(payChips);
      return (
        <div className="space-y-3">
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

          {isYearly && (
            <div className="h-48 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyPayrollChart} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 9.5 }} />
                  <YAxis tick={{ fontSize: 9.5 }} tickFormatter={(v) => `৳${v}L`} />
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      `৳${val} Lac`,
                      name === "salary" ? "Net Salary Payout" : "OT Allowance",
                    ]}
                    contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
                   labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
                  <Legend
                    verticalAlign="top"
                    height={24}
                    formatter={(val) => (
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {val === "salary" ? "Net Salary (Lac)" : "OT Allowance (Lac)"}
                      </span>
                    )}
                  />
                  <Bar dataKey="salary" fill="#6366f1" radius={[3, 3, 0, 0]} name="salary" />
                  <Bar dataKey="ot" fill="#10b981" radius={[3, 3, 0, 0]} name="ot" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
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
              <Tooltip formatter={(v: any) => [`৳${v.toLocaleString()}`, "Payroll Cost"]} contentStyle={CHART_TOOLTIP_CONTENT_STYLE}  labelStyle={CHART_TOOLTIP_LABEL_STYLE} itemStyle={CHART_TOOLTIP_ITEM_STYLE}/>
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
