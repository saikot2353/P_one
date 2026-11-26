import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Layers,
  Plus,
  Trash2,
  Save,
  Sparkles,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  PieChart,
  LayoutGrid,
  ArrowRight,
  Copy,
  Database,
  Eye,
} from "lucide-react";
import {
  DashboardComponentDefinition,
  CustomWidgetVisualType,
  CustomWidgetAggregation,
  CustomWidgetChipItem,
  CustomWidgetChartPoint,
  CustomWidgetChipColor,
  WidgetColSpan,
  loadCustomWidgets,
  saveCustomWidgets,
} from "./dashboard-maker-types";
import { DashboardWidgetRenderer } from "./DashboardWidgetRenderer";

const ICON_OPTIONS = [
  { id: "Layers", label: "Layers" },
  { id: "Users", label: "Users" },
  { id: "Banknote", label: "Money / Taka" },
  { id: "Clock", label: "Clock / Time" },
  { id: "TrendingUp", label: "Trend Up" },
  { id: "PieChart", label: "Pie Chart" },
  { id: "Briefcase", label: "Briefcase" },
  { id: "Target", label: "Target" },
];

const DATA_SOURCE_PRESETS = [
  { id: "hr_attendance", label: "Attendance & Presence" },
  { id: "hr_manpower", label: "Manpower & Headcount" },
  { id: "hr_ot_payroll", label: "Overtime & Payroll" },
  { id: "hr_separation", label: "Separation & Turnover" },
  { id: "zakat_welfare", label: "Zakat & Welfare" },
  { id: "custom_manual", label: "Custom / Manual Metrics" },
];

const DB_SCHEMA_BY_SOURCE: Record<
  string,
  {
    table: string;
    groupByColumns: Array<{ col: string; label: string }>;
    metricColumns: Array<{ col: string; label: string }>;
  }
> = {
  hr_attendance: {
    table: "dash_daily_attendance_rollup",
    groupByColumns: [
      { col: "department_id", label: "Department" },
      { col: "section_id", label: "Section" },
      { col: "line_id", label: "Line" },
      { col: "att_date", label: "Date (Daily)" },
      { col: "area_id", label: "Area / Zone" },
    ],
    metricColumns: [
      { col: "worker_present", label: "Worker Present" },
      { col: "worker_absent", label: "Worker Absent" },
      { col: "staff_present", label: "Staff Present" },
      { col: "staff_absent", label: "Staff Absent" },
      { col: "late_worker", label: "Late Worker" },
      { col: "late_staff", label: "Late Staff" },
      { col: "on_leave", label: "On Leave" },
      { col: "holiday", label: "Holiday" },
    ],
  },
  hr_manpower: {
    table: "employees",
    groupByColumns: [
      { col: "department_id", label: "Department" },
      { col: "emp_type", label: "Employee Type (Worker/Staff)" },
      { col: "gender", label: "Gender" },
      { col: "area_id", label: "Area / Zone" },
    ],
    metricColumns: [
      { col: "id", label: "Employee Count (id)" },
      { col: "gross_salary", label: "Gross Salary (৳)" },
      { col: "basic_salary", label: "Basic Salary (৳)" },
    ],
  },
  hr_ot_payroll: {
    table: "dash_monthly_finance_rollup",
    groupByColumns: [
      { col: "month_no", label: "Month (Jan–Dec)" },
      { col: "department_id", label: "Department" },
      { col: "area_id", label: "Area / Zone" },
    ],
    metricColumns: [
      { col: "ot_budget_amt", label: "OT Budget Amount (৳)" },
      { col: "ot_req_hours", label: "OT Requisition Hours" },
      { col: "ot_actual_hours", label: "OT Actual Hours" },
      { col: "ot_actual_amt", label: "OT Actual Amount (৳)" },
      { col: "payroll_gross", label: "Gross Payroll (৳)" },
      { col: "payroll_net", label: "Net Disbursed (৳)" },
      { col: "increment_amount", label: "Increment Amount (৳)" },
      { col: "increment_staff_cnt", label: "Incremented Staff Count" },
    ],
  },
  hr_separation: {
    table: "dash_monthly_finance_rollup",
    groupByColumns: [
      { col: "month_no", label: "Month (Jan–Dec)" },
      { col: "department_id", label: "Department" },
      { col: "area_id", label: "Area / Zone" },
    ],
    metricColumns: [
      { col: "resign_count", label: "Resign Count" },
      { col: "lefty_count", label: "Lefty Count" },
      { col: "terminated_count", label: "Terminated Count" },
      { col: "retired_count", label: "Retired Count" },
    ],
  },
  zakat_welfare: {
    table: "zakat_records",
    groupByColumns: [
      { col: "purpose_category", label: "Purpose Category" },
      { col: "disbursement_channel", label: "Disbursement Channel" },
      { col: "disbursement_mode", label: "Disbursement Mode" },
      { col: "budget_year", label: "Budget Year" },
    ],
    metricColumns: [
      { col: "amount", label: "Disbursed Amount (৳)" },
      { col: "id", label: "Beneficiary Count (id)" },
    ],
  },
  custom_manual: {
    table: "custom_manual_metrics",
    groupByColumns: [{ col: "label", label: "Custom Label" }],
    metricColumns: [{ col: "value", label: "Custom Value" }],
  },
};

const AGGREGATION_OPTIONS: CustomWidgetAggregation[] = ["SUM", "COUNT", "AVG", "MAX", "MIN"];

const CHIP_COLOR_OPTIONS: Array<{ id: CustomWidgetChipColor; label: string; dot: string }> = [
  { id: "blue", label: "Blue", dot: "bg-blue-500" },
  { id: "emerald", label: "Emerald", dot: "bg-emerald-500" },
  { id: "amber", label: "Amber", dot: "bg-amber-500" },
  { id: "rose", label: "Rose", dot: "bg-rose-500" },
  { id: "purple", label: "Purple", dot: "bg-purple-500" },
  { id: "indigo", label: "Indigo", dot: "bg-indigo-500" },
  { id: "teal", label: "Teal", dot: "bg-teal-500" },
];

const VISUAL_TYPES: Array<{ id: CustomWidgetVisualType; label: string; icon: React.ReactNode }> = [
  { id: "kpi_cards", label: "KPI Metric Cards", icon: <LayoutGrid className="size-4" /> },
  { id: "bar_chart", label: "Bar Chart", icon: <BarChart3 className="size-4" /> },
  { id: "area_chart", label: "Area / Trend", icon: <TrendingUp className="size-4" /> },
  { id: "pie_chart", label: "Donut / Pie", icon: <PieChart className="size-4" /> },
];

const DEFAULT_CHIPS: CustomWidgetChipItem[] = [
  { id: "metric_1", label: "Total Target", value: "৳24.5L", sub: "Monthly Allocation", color: "blue" },
  { id: "metric_2", label: "Achieved", value: "৳21.8L", sub: "89.0% Completed", color: "emerald" },
  { id: "metric_3", label: "Pending", value: "৳2.7L", sub: "In Progress", color: "amber" },
];

const DEFAULT_CHART_POINTS: CustomWidgetChartPoint[] = [
  { label: "Jan", value: 420, secondaryValue: 380, color: "#3b82f6" },
  { label: "Feb", value: 480, secondaryValue: 410, color: "#10b981" },
  { label: "Mar", value: 510, secondaryValue: 495, color: "#f59e0b" },
  { label: "Apr", value: 460, secondaryValue: 440, color: "#8b5cf6" },
  { label: "May", value: 590, secondaryValue: 530, color: "#ef4444" },
  { label: "Jun", value: 640, secondaryValue: 610, color: "#06b6d4" },
];

export const WidgetMakerView: React.FC = () => {
  const [savedWidgets, setSavedWidgets] = useState<DashboardComponentDefinition[]>(() => loadCustomWidgets());
  const [editingId, setEditingId] = useState<string | null>(null);

  // Builder form state
  const [name, setName] = useState("Department Efficiency & Cost");
  const [description, setDescription] = useState("Custom HRIS widget built with Widget Maker.");
  const [badge, setBadge] = useState("Custom Widget");
  const [iconName, setIconName] = useState("Layers");
  const [defaultColSpan, setDefaultColSpan] = useState<WidgetColSpan>(6);
  const [scopes, setScopes] = useState<Array<"personal" | "area" | "department">>(["area", "department"]);

  const [visualType, setVisualType] = useState<CustomWidgetVisualType>("bar_chart");
  const [dataSource, setDataSource] = useState("hr_ot_payroll");
  const [groupByColumn, setGroupByColumn] = useState("month_no");
  const [primaryColumn, setPrimaryColumn] = useState("ot_actual_amt");
  const [primaryAggregation, setPrimaryAggregation] = useState<CustomWidgetAggregation>("SUM");
  const [secondaryColumn, setSecondaryColumn] = useState("ot_budget_amt");
  const [secondaryAggregation, setSecondaryAggregation] = useState<CustomWidgetAggregation>("SUM");
  const [valuePrefix, setValuePrefix] = useState("৳");
  const [valueSuffix, setValueSuffix] = useState("K");
  const [primarySeriesLabel, setPrimarySeriesLabel] = useState("Actual");
  const [secondarySeriesLabel, setSecondarySeriesLabel] = useState("Budget");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState("#10b981");
  const [chips, setChips] = useState<CustomWidgetChipItem[]>(DEFAULT_CHIPS);
  const [chartPoints, setChartPoints] = useState<CustomWidgetChartPoint[]>(DEFAULT_CHART_POINTS);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const activeSchema = DB_SCHEMA_BY_SOURCE[dataSource] || DB_SCHEMA_BY_SOURCE.custom_manual;

  const handleDataSourceChange = (nextSource: string) => {
    setDataSource(nextSource);
    const schema = DB_SCHEMA_BY_SOURCE[nextSource] || DB_SCHEMA_BY_SOURCE.custom_manual;
    const firstGroup = schema.groupByColumns[0]?.col || "label";
    const firstMetric = schema.metricColumns[0]?.col || "value";
    const secondMetric = schema.metricColumns[1]?.col || "";
    setGroupByColumn(firstGroup);
    setPrimaryColumn(firstMetric);
    setPrimaryAggregation(firstMetric === "id" ? "COUNT" : "SUM");
    setSecondaryColumn(secondMetric);
    setSecondaryAggregation(secondMetric === "id" ? "COUNT" : "SUM");
  };

  const resetBuilder = () => {
    setEditingId(null);
    setName("New Custom Widget");
    setDescription("Custom HRIS widget built with Widget Maker.");
    setBadge("Custom Widget");
    setIconName("Layers");
    setDefaultColSpan(6);
    setScopes(["area", "department"]);
    setVisualType("bar_chart");
    handleDataSourceChange("hr_attendance");
    setValuePrefix("");
    setValueSuffix("");
    setPrimarySeriesLabel("Actual");
    setSecondarySeriesLabel("Target");
    setPrimaryColor("#3b82f6");
    setSecondaryColor("#10b981");
    setChips(DEFAULT_CHIPS);
    setChartPoints(DEFAULT_CHART_POINTS);
  };

  const loadIntoBuilder = (def: DashboardComponentDefinition) => {
    setEditingId(def.id);
    setName(def.name);
    setDescription(def.description);
    setBadge(def.badge || "Custom Widget");
    setIconName(def.iconName || "Layers");
    setDefaultColSpan(def.defaultColSpan || 6);
    setScopes(
      (def.supportedScopes?.filter((s): s is "personal" | "area" | "department" =>
        s === "personal" || s === "area" || s === "department"
      ) as Array<"personal" | "area" | "department">) || ["area", "department"]
    );
    const spec = def.customSpec;
    if (spec) {
      setVisualType(spec.visualType);
      setDataSource(spec.dataSource || "custom_manual");
      setGroupByColumn(spec.groupByColumn || "label");
      setPrimaryColumn(spec.primaryColumn || "value");
      setPrimaryAggregation(spec.primaryAggregation || "SUM");
      setSecondaryColumn(spec.secondaryColumn || "");
      setSecondaryAggregation(spec.secondaryAggregation || "SUM");
      setValuePrefix(spec.valuePrefix || "");
      setValueSuffix(spec.valueSuffix || "");
      setPrimarySeriesLabel(spec.primarySeriesLabel || "Value");
      setSecondarySeriesLabel(spec.secondarySeriesLabel || "Secondary");
      setPrimaryColor(spec.primaryColor || "#3b82f6");
      setSecondaryColor(spec.secondaryColor || "#10b981");
      setChips(spec.chips?.length ? spec.chips : DEFAULT_CHIPS);
      setChartPoints(spec.chartPoints?.length ? spec.chartPoints : DEFAULT_CHART_POINTS);
    }
  };

  const toggleScope = (s: "personal" | "area" | "department") => {
    setScopes((prev) => {
      if (prev.includes(s)) {
        return prev.length > 1 ? prev.filter((x) => x !== s) : prev;
      }
      return [...prev, s];
    });
  };

  const previewDef: DashboardComponentDefinition = useMemo(() => {
    const id = editingId || "custom_preview";
    return {
      id,
      name: name.trim() || "Untitled Custom Widget",
      module: "hris",
      moduleLabel: "HRIS & Workforce",
      category: visualType === "kpi_cards" ? "Metric Cards" : "Chart & Analytics",
      description: description.trim() || "Custom widget",
      iconName,
      defaultColSpan,
      minColSpan: 3,
      badge: badge.trim() || "Custom",
      supportedScopes: scopes,
      isCustom: true,
      availableChips:
        visualType === "pie_chart"
          ? undefined
          : chips.map((c) => ({ id: c.id, label: c.label, defaultEnabled: true })),
      customSpec: {
        visualType,
        dataSource,
        dbTable: activeSchema.table,
        groupByColumn,
        primaryColumn,
        primaryAggregation,
        secondaryColumn: secondaryColumn || undefined,
        secondaryAggregation: secondaryColumn ? secondaryAggregation : undefined,
        valuePrefix,
        valueSuffix,
        primarySeriesLabel,
        secondarySeriesLabel,
        primaryColor,
        secondaryColor,
        chips,
        chartPoints,
      },
    };
  }, [
    editingId,
    name,
    description,
    badge,
    iconName,
    defaultColSpan,
    scopes,
    visualType,
    dataSource,
    activeSchema.table,
    groupByColumn,
    primaryColumn,
    primaryAggregation,
    secondaryColumn,
    secondaryAggregation,
    valuePrefix,
    valueSuffix,
    primarySeriesLabel,
    secondarySeriesLabel,
    primaryColor,
    secondaryColor,
    chips,
    chartPoints,
  ]);

  const handleSaveWidget = () => {
    const widgetId = editingId || `custom_w_${Date.now()}`;
    const toSave: DashboardComponentDefinition = {
      ...previewDef,
      id: widgetId,
    };

    const exists = savedWidgets.some((w) => w.id === widgetId);
    const nextList = exists
      ? savedWidgets.map((w) => (w.id === widgetId ? toSave : w))
      : [toSave, ...savedWidgets];

    setSavedWidgets(nextList);
    saveCustomWidgets(nextList);
    setEditingId(widgetId);
    showToast(exists ? "Custom widget updated in Component Library!" : "New custom widget added to Component Library!");
  };

  const handleDeleteWidget = (id: string) => {
    const nextList = savedWidgets.filter((w) => w.id !== id);
    setSavedWidgets(nextList);
    saveCustomWidgets(nextList);
    if (editingId === id) resetBuilder();
    showToast("Custom widget deleted");
  };

  const handleDuplicateWidget = (def: DashboardComponentDefinition) => {
    const copy: DashboardComponentDefinition = {
      ...def,
      id: `custom_w_${Date.now()}`,
      name: `${def.name} (Copy)`,
    };
    const nextList = [copy, ...savedWidgets];
    setSavedWidgets(nextList);
    saveCustomWidgets(nextList);
    loadIntoBuilder(copy);
    showToast("Custom widget duplicated");
  };

  const addChip = () => {
    const idx = chips.length + 1;
    setChips([
      ...chips,
      { id: `metric_${Date.now()}`, label: `Metric ${idx}`, value: "0", sub: "Details", color: "indigo" },
    ]);
  };

  const addChartPoint = () => {
    setChartPoints([
      ...chartPoints,
      { label: `Item ${chartPoints.length + 1}`, value: 350, secondaryValue: 300, color: "#6366f1" },
    ]);
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 dark:border-slate-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-400 dark:text-emerald-600" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Sparkles className="size-5" />
            </span>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                Dynamic Widget Maker
              </h1>
              <p className="text-xs text-muted-foreground">
                Build custom KPI cards, Bar, Area &amp; Donut widgets — saved widgets appear directly in Dashboard Maker!
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={resetBuilder}
            className="h-9 px-3.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="size-3.5" /> New Widget
          </button>
          <button
            type="button"
            onClick={handleSaveWidget}
            className="h-9 px-4 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Save className="size-3.5" />
            {editingId ? "Update Widget" : "Save to Component Library"}
          </button>
          <Link
            to="/dashboard-maker"
            className="h-9 px-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5"
          >
            Open Dashboard Maker <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* Saved Custom Widgets Bar */}
      {savedWidgets.length > 0 && (
        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Layers className="size-3.5 text-primary" />
              My Custom Widgets ({savedWidgets.length})
            </span>
            <span className="text-[11px] text-muted-foreground">
              Click any widget to edit, or open Dashboard Maker to place it on your dashboard
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {savedWidgets.map((w) => {
              const active = editingId === w.id;
              return (
                <div
                  key={w.id}
                  onClick={() => loadIntoBuilder(w)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    active
                      ? "border-primary bg-primary/5 ring-2 ring-primary/15"
                      : "border-border/60 bg-background hover:border-primary/40"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-foreground truncate">{w.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <span className="uppercase font-bold text-primary">{w.customSpec?.visualType?.replace("_", " ")}</span>
                      <span>• {Math.round(((w.defaultColSpan || 6) / 12) * 100)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleDuplicateWidget(w)}
                      className="size-6 rounded-md hover:bg-muted text-muted-foreground flex items-center justify-center cursor-pointer"
                      title="Duplicate"
                    >
                      <Copy className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteWidget(w.id)}
                      className="size-6 rounded-md hover:bg-rose-500/10 text-rose-500 flex items-center justify-center cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Split Workspace: Left Builder Form + Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT: BUILDER CONTROLS */}
        <div className="lg:col-span-6 space-y-4">
          {/* Basic Info & Visualization Type */}
          <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-2xs space-y-3.5">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              1. Widget Identity &amp; Layout
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">Widget Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">Badge Label</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">Icon</label>
                <select
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-border bg-background text-xs font-semibold outline-none focus:border-primary"
                >
                  {ICON_OPTIONS.map((ic) => (
                    <option key={ic.id} value={ic.id}>
                      {ic.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">Default Width</label>
                <select
                  value={defaultColSpan}
                  onChange={(e) => setDefaultColSpan(Number(e.target.value) as WidgetColSpan)}
                  className="w-full h-9 px-2.5 rounded-xl border border-border bg-background text-xs font-semibold outline-none focus:border-primary"
                >
                  <option value={4}>33% (4 cols)</option>
                  <option value={6}>50% (6 cols)</option>
                  <option value={8}>67% (8 cols)</option>
                  <option value={12}>100% (12 cols)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1 flex items-center gap-1">
                  <Database className="size-3 text-primary" /> Data Source ({activeSchema.table})
                </label>
                <select
                  value={dataSource}
                  onChange={(e) => handleDataSourceChange(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-border bg-background text-xs font-semibold outline-none focus:border-primary"
                >
                  {DATA_SOURCE_PRESETS.map((ds) => (
                    <option key={ds.id} value={ds.id}>
                      {ds.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1.5">Visualization Type</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {VISUAL_TYPES.map((vt) => (
                    <button
                      key={vt.id}
                      type="button"
                      onClick={() => setVisualType(vt.id)}
                      className={`px-2.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                        visualType === vt.id
                          ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                          : "bg-background border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {vt.icon}
                      <span className="truncate">{vt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1.5">Supported Scopes</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "personal" as const, label: "Self" },
                    { id: "area" as const, label: "Area" },
                    { id: "department" as const, label: "Department" },
                  ].map((sc) => {
                    const active = scopes.includes(sc.id);
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => toggleScope(sc.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                          active
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-background border-border text-muted-foreground"
                        }`}
                      >
                        {sc.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* KPI Chips Builder (shown for kpi_cards, bar_chart, area_chart) */}
          {visualType !== "pie_chart" && (
            <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  2. Metric Chips ({chips.length})
                </h2>
                <button
                  type="button"
                  onClick={addChip}
                  className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="size-3" /> Add Chip
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {chips.map((chip, idx) => (
                  <div
                    key={chip.id}
                    className="p-2.5 rounded-xl border border-border/60 bg-background grid grid-cols-12 gap-2 items-center"
                  >
                    <input
                      type="text"
                      value={chip.label}
                      onChange={(e) =>
                        setChips(chips.map((c, i) => (i === idx ? { ...c, label: e.target.value } : c)))
                      }
                      placeholder="Label"
                      className="col-span-4 h-8 px-2 rounded-lg border border-border text-xs font-semibold outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      value={chip.value}
                      onChange={(e) =>
                        setChips(chips.map((c, i) => (i === idx ? { ...c, value: e.target.value } : c)))
                      }
                      placeholder="Value"
                      className="col-span-3 h-8 px-2 rounded-lg border border-border text-xs font-mono font-bold outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      value={chip.sub || ""}
                      onChange={(e) =>
                        setChips(chips.map((c, i) => (i === idx ? { ...c, sub: e.target.value } : c)))
                      }
                      placeholder="Subtext"
                      className="col-span-3 h-8 px-2 rounded-lg border border-border text-[11px] outline-none focus:border-primary"
                    />
                    <select
                      value={chip.color}
                      onChange={(e) =>
                        setChips(
                          chips.map((c, i) =>
                            i === idx ? { ...c, color: e.target.value as CustomWidgetChipColor } : c
                          )
                        )
                      }
                      className="col-span-1 h-8 px-1 rounded-lg border border-border text-[10px] outline-none"
                    >
                      {CHIP_COLOR_OPTIONS.map((co) => (
                        <option key={co.id} value={co.id}>
                          {co.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setChips(chips.filter((_, i) => i !== idx))}
                      className="col-span-1 size-7 rounded-lg hover:bg-rose-500/10 text-rose-500 flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>

                    {/* DB Column Mapping for this Chip */}
                    <div className="col-span-12 flex flex-wrap items-center gap-2 pt-1 border-t border-border/40 text-[10.5px]">
                      <span className="font-bold text-primary flex items-center gap-1 shrink-0">
                        <Database className="size-3" /> DB Column:
                      </span>
                      <select
                        value={chip.aggregation || "SUM"}
                        onChange={(e) =>
                          setChips(
                            chips.map((c, i) =>
                              i === idx ? { ...c, aggregation: e.target.value as CustomWidgetAggregation } : c
                            )
                          )
                        }
                        className="h-6 px-1.5 rounded-md border border-border bg-muted/40 font-mono font-bold text-[10px] outline-none"
                      >
                        {AGGREGATION_OPTIONS.map((agg) => (
                          <option key={agg} value={agg}>
                            {agg}
                          </option>
                        ))}
                      </select>
                      <select
                        value={chip.dbColumn || activeSchema.metricColumns[0]?.col || ""}
                        onChange={(e) =>
                          setChips(chips.map((c, i) => (i === idx ? { ...c, dbColumn: e.target.value } : c)))
                        }
                        className="flex-1 min-w-[140px] h-6 px-2 rounded-md border border-border bg-muted/40 font-mono text-[10.5px] outline-none"
                      >
                        {activeSchema.metricColumns.map((mc) => (
                          <option key={mc.col} value={mc.col}>
                            {activeSchema.table}.{mc.col} ({mc.label})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chart Series & Points Builder */}
          {visualType !== "kpi_cards" && (
            <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  3. Chart Data Points ({chartPoints.length})
                </h2>
                <button
                  type="button"
                  onClick={addChartPoint}
                  className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="size-3" /> Add Point
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-primary block mb-1">X-Axis / Group By Column</label>
                  <select
                    value={groupByColumn}
                    onChange={(e) => setGroupByColumn(e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-background text-[11px] font-mono outline-none"
                  >
                    {activeSchema.groupByColumns.map((gc) => (
                      <option key={gc.col} value={gc.col}>
                        {gc.col} ({gc.label})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-primary block mb-1">Primary Y-Axis Column</label>
                  <div className="flex gap-1">
                    <select
                      value={primaryAggregation}
                      onChange={(e) => setPrimaryAggregation(e.target.value as CustomWidgetAggregation)}
                      className="w-16 h-8 px-1 rounded-lg border border-border bg-background text-[10.5px] font-mono font-bold outline-none"
                    >
                      {AGGREGATION_OPTIONS.map((agg) => (
                        <option key={agg} value={agg}>
                          {agg}
                        </option>
                      ))}
                    </select>
                    <select
                      value={primaryColumn}
                      onChange={(e) => setPrimaryColumn(e.target.value)}
                      className="flex-1 min-w-0 h-8 px-2 rounded-lg border border-border bg-background text-[11px] font-mono outline-none"
                    >
                      {activeSchema.metricColumns.map((mc) => (
                        <option key={mc.col} value={mc.col}>
                          {mc.col}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground block mb-1">Secondary Y-Axis (Optional)</label>
                  <div className="flex gap-1">
                    <select
                      value={secondaryAggregation}
                      onChange={(e) => setSecondaryAggregation(e.target.value as CustomWidgetAggregation)}
                      className="w-16 h-8 px-1 rounded-lg border border-border bg-background text-[10.5px] font-mono font-bold outline-none"
                    >
                      {AGGREGATION_OPTIONS.map((agg) => (
                        <option key={agg} value={agg}>
                          {agg}
                        </option>
                      ))}
                    </select>
                    <select
                      value={secondaryColumn}
                      onChange={(e) => setSecondaryColumn(e.target.value)}
                      className="flex-1 min-w-0 h-8 px-2 rounded-lg border border-border bg-background text-[11px] font-mono outline-none"
                    >
                      <option value="">None</option>
                      {activeSchema.metricColumns.map((mc) => (
                        <option key={mc.col} value={mc.col}>
                          {mc.col}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground block mb-1">Prefix (e.g. ৳)</label>
                  <input
                    type="text"
                    value={valuePrefix}
                    onChange={(e) => setValuePrefix(e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground block mb-1">Suffix (e.g. K, %)</label>
                  <input
                    type="text"
                    value={valueSuffix}
                    onChange={(e) => setValueSuffix(e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground block mb-1">Primary Series</label>
                  <input
                    type="text"
                    value={primarySeriesLabel}
                    onChange={(e) => setPrimarySeriesLabel(e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground block mb-1">Primary Color</label>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full h-8 p-0.5 rounded-lg border border-border bg-background cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {chartPoints.map((pt, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl border border-border/60 bg-background grid grid-cols-12 gap-2 items-center"
                  >
                    <input
                      type="text"
                      value={pt.label}
                      onChange={(e) =>
                        setChartPoints(chartPoints.map((p, i) => (i === idx ? { ...p, label: e.target.value } : p)))
                      }
                      placeholder="Label"
                      className="col-span-4 h-8 px-2 rounded-lg border border-border text-xs font-semibold outline-none"
                    />
                    <input
                      type="number"
                      value={pt.value}
                      onChange={(e) =>
                        setChartPoints(
                          chartPoints.map((p, i) => (i === idx ? { ...p, value: Number(e.target.value) || 0 } : p))
                        )
                      }
                      placeholder="Value"
                      className="col-span-3 h-8 px-2 rounded-lg border border-border text-xs font-mono outline-none"
                    />
                    {visualType === "pie_chart" ? (
                      <input
                        type="color"
                        value={pt.color || "#3b82f6"}
                        onChange={(e) =>
                          setChartPoints(
                            chartPoints.map((p, i) => (i === idx ? { ...p, color: e.target.value } : p))
                          )
                        }
                        className="col-span-4 h-8 p-0.5 rounded-lg border border-border cursor-pointer"
                      />
                    ) : (
                      <input
                        type="number"
                        value={pt.secondaryValue ?? ""}
                        onChange={(e) =>
                          setChartPoints(
                            chartPoints.map((p, i) =>
                              i === idx
                                ? { ...p, secondaryValue: e.target.value === "" ? undefined : Number(e.target.value) }
                                : p
                            )
                          )
                        }
                        placeholder="2nd Val (opt)"
                        className="col-span-4 h-8 px-2 rounded-lg border border-border text-xs font-mono outline-none"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setChartPoints(chartPoints.filter((_, i) => i !== idx))}
                      className="col-span-1 size-7 rounded-lg hover:bg-rose-500/10 text-rose-500 flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: LIVE PREVIEW */}
        <div className="lg:col-span-6 sticky top-4 space-y-3">
          <div className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-2xs flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Eye className="size-4 text-primary" />
              Live Widget Preview
            </span>
            <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              Width: {Math.round((defaultColSpan / 12) * 100)}%
            </span>
          </div>

          <DashboardWidgetRenderer
            widget={{
              id: "preview_widget",
              componentId: previewDef.id,
              colSpan: defaultColSpan,
              settings: {
                scope: scopes[0] || "area",
                areas: ["Dhaka North / Gazipur"],
                departments: ["Sewing Floor"],
              },
            }}
            overrideDef={previewDef}
          />

          {/* Database Column Binding Summary */}
          <div className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-2xs space-y-2 text-xs">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <Database className="size-3.5 text-primary" />
              Backend Query Binding Preview
            </div>
            <div className="text-[11px] text-muted-foreground space-y-1 font-mono bg-muted/40 p-2.5 rounded-xl border border-border/40">
              <div>
                <span className="text-primary font-bold">TABLE:</span> {activeSchema.table}
              </div>
              {visualType !== "kpi_cards" && (
                <div>
                  <span className="text-primary font-bold">CHART:</span> {primaryAggregation}({primaryColumn})
                  {secondaryColumn ? `, ${secondaryAggregation}(${secondaryColumn})` : ""} GROUP BY {groupByColumn}
                </div>
              )}
              {visualType !== "pie_chart" && chips.length > 0 && (
                <div>
                  <span className="text-primary font-bold">CHIPS:</span>{" "}
                  {chips
                    .map((c) => `${c.label} = ${c.aggregation || "SUM"}(${c.dbColumn || activeSchema.metricColumns[0]?.col || "value"})`)
                    .join(" | ")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
