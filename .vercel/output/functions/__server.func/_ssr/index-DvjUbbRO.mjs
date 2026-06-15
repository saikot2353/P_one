import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as Sidebar, T as Topbar } from "./router-B8Fpsbpq.mjs";
import { q as Users, D as UserPlus, b8 as UserMinus, b9 as Clock4, al as TrendingUp, ba as TrendingDown, bb as ArrowUpRight, bc as Ellipsis, bd as Cake, ah as Award, t as Briefcase, e as CalendarDays, c as CircleX, a as Clock, b as CircleCheck } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, A as AreaChart, a as Area, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, P as PieChart, b as Pie, c as Cell, L as Legend, d as RadialBarChart, e as RadialBar } from "../_libs/recharts.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/cmdk.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
const spark = (seed) => Array.from({ length: 12 }, (_, i) => ({ v: 20 + Math.sin(i / 1.5 + seed) * 10 + seed * 3 + i }));
const stats = [
  { label: "Total Employees", value: "1,284", delta: "+4.6%", up: true, icon: Users, tint: "primary", data: spark(2) },
  { label: "New Hires (MTD)", value: "37", delta: "+12.1%", up: true, icon: UserPlus, tint: "success", data: spark(5) },
  { label: "Attrition Rate", value: "2.4%", delta: "-0.6%", up: false, icon: UserMinus, tint: "warning", data: spark(3) },
  { label: "Avg. Working Hrs", value: "8.2h", delta: "+0.3h", up: true, icon: Clock4, tint: "info", data: spark(7) }
];
const tintMap = {
  primary: {
    card: "bg-[oklch(0.98_0.015_255)] dark:bg-[oklch(0.20_0.035_255)] border-[oklch(0.48_0.19_255/0.15)] hover:border-[oklch(0.48_0.19_255/0.4)]",
    iconBg: "bg-primary text-primary-foreground shadow-[0_4px_12px_oklch(0.48_0.19_255/0.25)]",
    iconFg: "",
    stroke: "var(--primary)",
    ring: "ring-primary/10"
  },
  success: {
    card: "bg-[oklch(0.98_0.02_160)] dark:bg-[oklch(0.20_0.035_165)] border-[oklch(0.62_0.16_155/0.15)] hover:border-[oklch(0.62_0.16_155/0.4)]",
    iconBg: "bg-success text-success-foreground shadow-[0_4px_12px_oklch(0.62_0.16_155/0.25)]",
    iconFg: "",
    stroke: "var(--success)",
    ring: "ring-success/10"
  },
  warning: {
    card: "bg-[oklch(0.98_0.02_75)] dark:bg-[oklch(0.20_0.035_70)] border-[oklch(0.75_0.16_75/0.15)] hover:border-[oklch(0.75_0.16_75/0.4)]",
    iconBg: "bg-warning text-warning-foreground shadow-[0_4px_12px_oklch(0.75_0.16_75/0.25)]",
    iconFg: "",
    stroke: "var(--warning)",
    ring: "ring-warning/10"
  },
  info: {
    card: "bg-[oklch(0.98_0.025_250)] dark:bg-[oklch(0.20_0.035_250)] border-[oklch(0.58_0.16_250/0.15)] hover:border-[oklch(0.58_0.16_250/0.4)]",
    iconBg: "bg-info text-info-foreground shadow-[0_4px_12px_oklch(0.58_0.16_250/0.25)]",
    iconFg: "",
    stroke: "var(--info)",
    ring: "ring-info/10"
  }
};
function StatCards() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 xl:grid-cols-4 gap-4", children: stats.map((s) => {
    const Icon = s.icon;
    const t = tintMap[s.tint];
    const gradId = `g-${s.label.replace(/[^a-zA-Z0-9]/g, "-")}`;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `group relative overflow-hidden rounded-lg border p-5 ring-1 ${t.ring} ${t.card} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 relative z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80", children: s.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-3xl font-extrabold tracking-tight leading-none text-foreground", children: s.value }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-background/55 backdrop-blur-xs border border-border/40 shadow-xs ${s.up ? "text-success" : "text-destructive"}`, children: [
                s.up ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "size-3" }),
                s.delta,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/85 font-normal ml-1", children: "vs last mo." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-10 rounded-xl grid place-items-center transition-transform duration-300 group-hover:scale-110 ${t.iconBg}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 h-12 opacity-60 pointer-events-none group-hover:opacity-85 transition-opacity duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: s.data, margin: { top: 8, left: 0, right: 0, bottom: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: gradId, x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: t.stroke, stopOpacity: 0.4 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: t.stroke, stopOpacity: 0 })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "v", stroke: t.stroke, strokeWidth: 2, fill: `url(#${gradId})` })
          ] }) }) })
        ]
      },
      s.label
    );
  }) });
}
const headcount = [
  { m: "Jan", hires: 24, exits: 8 },
  { m: "Feb", hires: 31, exits: 11 },
  { m: "Mar", hires: 28, exits: 9 },
  { m: "Apr", hires: 42, exits: 14 },
  { m: "May", hires: 38, exits: 12 },
  { m: "Jun", hires: 51, exits: 10 },
  { m: "Jul", hires: 47, exits: 16 },
  { m: "Aug", hires: 55, exits: 13 },
  { m: "Sep", hires: 49, exits: 11 },
  { m: "Oct", hires: 62, exits: 15 },
  { m: "Nov", hires: 58, exits: 12 },
  { m: "Dec", hires: 71, exits: 17 }
];
const departments = [
  { name: "Engineering", value: 384, color: "var(--chart-1)" },
  { name: "Sales", value: 212, color: "var(--chart-2)" },
  { name: "Marketing", value: 156, color: "var(--chart-3)" },
  { name: "Operations", value: 198, color: "var(--chart-4)" },
  { name: "Support", value: 134, color: "var(--chart-5)" }
];
const attendance = [
  { d: "Mon", present: 1180, remote: 84, leave: 20 },
  { d: "Tue", present: 1210, remote: 60, leave: 14 },
  { d: "Wed", present: 1195, remote: 70, leave: 19 },
  { d: "Thu", present: 1224, remote: 50, leave: 10 },
  { d: "Fri", present: 1102, remote: 132, leave: 50 },
  { d: "Sat", present: 420, remote: 30, leave: 8 },
  { d: "Sun", present: 0, remote: 0, leave: 0 }
];
const goals = [
  { name: "Goals", value: 78, fill: "var(--primary)" }
];
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/90 backdrop-blur-md border border-border/80 p-3 rounded-xl shadow-xl animate-in fade-in zoom-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-xs text-foreground mb-1.5", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: payload.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[11px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full shadow-xs", style: { backgroundColor: p.color || p.stroke || p.fill } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground/90 font-medium", children: [
          p.name,
          ":"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground ml-auto", children: p.value.toLocaleString() })
      ] }, i)) })
    ] });
  }
  return null;
}
function Card({ title, subtitle, action, children, className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `group rounded-lg bg-card border border-border/70 p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-border/95 relative overflow-hidden ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold tracking-tight text-[13px] text-foreground", children: title }),
        subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/80 mt-0.5", children: subtitle })
      ] }),
      action
    ] }),
    children
  ] });
}
function Tabs() {
  const items = ["1W", "1M", "3M", "1Y", "All"];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5 p-1 rounded-lg bg-muted border border-border/40", children: items.map((i, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      className: `text-[10px] font-semibold px-2.5 py-1 rounded-md transition-all ${idx === 2 ? "bg-card text-primary font-bold shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
      children: i
    },
    i
  )) });
}
function HeadcountChart() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Headcount Trends", subtitle: "New hires vs. exits across the year", action: /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, {}), className: "xl:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[315px] mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: headcount, margin: { top: 5, right: 10, left: -20, bottom: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "gHires", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "var(--primary)", stopOpacity: 0.4 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "var(--primary)", stopOpacity: 0 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "gExits", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "var(--chart-5)", stopOpacity: 0.3 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "var(--chart-5)", stopOpacity: 0 })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)", opacity: 0.6, vertical: false }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "m", tickLine: false, axisLine: false, tick: { fontSize: 10, fill: "var(--muted-foreground)" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tickLine: false, axisLine: false, tick: { fontSize: 10, fill: "var(--muted-foreground)" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", name: "New Hires", dataKey: "hires", stroke: "var(--primary)", strokeWidth: 2.5, fill: "url(#gHires)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", name: "Exits", dataKey: "exits", stroke: "var(--chart-5)", strokeWidth: 2.5, fill: "url(#gExits)" })
  ] }) }) }) });
}
function DepartmentChart() {
  const total = departments.reduce((a, b) => a + b.value, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Department Split", subtitle: "Workforce distribution by department", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-44 mt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: departments, dataKey: "value", innerRadius: 64, outerRadius: 88, paddingAngle: 4, stroke: "none", children: departments.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: d.color, className: "outline-none filter hover:brightness-105 transition-all duration-300" }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-extrabold tracking-tight text-foreground", children: total.toLocaleString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mt-0.5", children: "Employees" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 space-y-2.5", children: departments.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs p-1.5 rounded-lg hover:bg-muted/50 transition duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2.5 rounded-full ring-2 ring-background shadow-xs", style: { background: d.color } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: d.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto font-bold text-foreground", children: d.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground/80 font-medium w-10 text-right", children: [
        Math.round(d.value / total * 100),
        "%"
      ] })
    ] }, d.name)) })
  ] });
}
function AttendanceChart() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Weekly Attendance Trends", subtitle: "Active presence and remote engagement tracking", className: "xl:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[250px] mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: attendance, margin: { top: 5, right: 10, left: -20, bottom: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "attPresent", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "var(--primary)", stopOpacity: 0.25 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "var(--primary)", stopOpacity: 0 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "attRemote", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "var(--chart-2)", stopOpacity: 0.2 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "var(--chart-2)", stopOpacity: 0 })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)", opacity: 0.6, vertical: false }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "d", tickLine: false, axisLine: false, tick: { fontSize: 10, fill: "var(--muted-foreground)" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tickLine: false, axisLine: false, tick: { fontSize: 10, fill: "var(--muted-foreground)" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { iconType: "circle", iconSize: 8, wrapperStyle: { fontSize: 11, paddingTop: 12, fontWeight: 500 } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", name: "Office Present", dataKey: "present", stroke: "var(--primary)", strokeWidth: 2.5, fill: "url(#attPresent)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", name: "Remote Work", dataKey: "remote", stroke: "var(--chart-2)", strokeWidth: 2, fill: "url(#attRemote)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", name: "On Leave", dataKey: "leave", stroke: "var(--chart-3)", strokeWidth: 1.5, strokeDasharray: "4 4", fill: "none" })
  ] }) }) }) });
}
function GoalsRadial() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Performance Goals", subtitle: "Q2 completion across teams", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-44 mt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RadialBarChart, { innerRadius: "70%", outerRadius: "96%", data: goals, startAngle: 210, endAngle: -30, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RadialBar, { background: { fill: "var(--muted)" }, dataKey: "value", cornerRadius: 20 }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-extrabold tracking-tight text-foreground", children: "78%" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mt-1", children: "Completed" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2.5 mt-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/65 border border-border/40 p-2.5 hover:bg-muted transition duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-foreground", children: "142" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-medium text-muted-foreground mt-0.5", children: "Achieved" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/65 border border-border/40 p-2.5 hover:bg-muted transition duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-foreground", children: "28" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-medium text-muted-foreground mt-0.5", children: "In progress" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/65 border border-border/40 p-2.5 hover:bg-muted transition duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-foreground", children: "12" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-medium text-muted-foreground mt-0.5", children: "At risk" })
      ] })
    ] })
  ] });
}
const requests = [
  { name: "Daniel Kwan", role: "Frontend Engineer", type: "Annual Leave", days: "Jun 12 — Jun 16", status: "pending" },
  { name: "Priya Shah", role: "Product Designer", type: "Sick Leave", days: "Today", status: "approved" },
  { name: "Marcus Lee", role: "Sales Lead", type: "WFH", days: "Jun 10 — Jun 11", status: "pending" },
  { name: "Helena Cruz", role: "HR Specialist", type: "Comp Off", days: "Jun 20", status: "rejected" },
  { name: "Tomás Rivera", role: "DevOps Engineer", type: "Annual Leave", days: "Jul 01 — Jul 08", status: "pending" }
];
const events = [
  { type: "birthday", icon: Cake, title: "Anika Mehta's birthday", date: "Today", tint: "bg-accent text-accent-foreground" },
  { type: "anniversary", icon: Award, title: "5 yrs — Jordan Park", date: "Tomorrow", tint: "bg-success/15 text-success" },
  { type: "interview", icon: Briefcase, title: "Interview · Senior PM", date: "Jun 11, 2:00 PM", tint: "bg-info/15 text-info" },
  { type: "meeting", icon: CalendarDays, title: "All-hands meeting", date: "Jun 14, 10:00 AM", tint: "bg-primary/15 text-primary" }
];
const recruitment = [
  { role: "Senior Product Manager", dept: "Product", applicants: 248, stage: "Interview", pct: 68 },
  { role: "Staff Engineer, Platform", dept: "Engineering", applicants: 412, stage: "Screening", pct: 32 },
  { role: "UX Researcher", dept: "Design", applicants: 156, stage: "Offer", pct: 88 },
  { role: "Account Executive", dept: "Sales", applicants: 198, stage: "Interview", pct: 54 }
];
function StatusPill({ status }) {
  const map = {
    approved: { cls: "bg-success/15 text-success", Icon: CircleCheck, label: "Approved" },
    pending: { cls: "bg-warning/15 text-warning", Icon: Clock, label: "Pending" },
    rejected: { cls: "bg-destructive/15 text-destructive", Icon: CircleX, label: "Rejected" }
  };
  const { cls, Icon, label } = map[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${cls}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-3" }),
    " ",
    label
  ] });
}
const initials = (n) => n.split(" ").map((s) => s[0]).slice(0, 2).join("");
function LeaveRequests() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-card border border-border/70 shadow-xs xl:col-span-2 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-border/95 relative group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-5 border-b border-border/55", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold tracking-tight text-[13px] text-foreground", children: "Pending Approvals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/80 mt-0.5", children: "Leave requests awaiting your action" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline hover:opacity-90 transition-opacity", children: [
        "View all ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "size-3.5" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-[10px] uppercase tracking-wider text-muted-foreground/60 border-b border-border/30 bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3.5 font-bold", children: "Employee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3.5 font-bold", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3.5 font-bold", children: "Period" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3.5 font-bold", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3.5 font-bold w-8" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: requests.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/45 hover:bg-muted/40 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-xl bg-gradient-to-br from-primary/95 to-primary-glow grid place-items-center text-xs font-bold text-primary-foreground shadow-xs", children: initials(r.name) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground text-xs", children: r.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground/90 font-medium", children: r.role })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground text-xs font-medium", children: r.type }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground text-xs font-medium", children: r.days }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: r.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-muted-foreground/70 hover:text-foreground p-1 rounded-md hover:bg-muted transition duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "size-4" }) }) })
      ] }, i)) })
    ] }) })
  ] });
}
function UpcomingEvents() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-card border border-border/70 p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-border/95 relative group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold tracking-tight text-[13px] text-foreground", children: "Upcoming" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/80 mt-0.5", children: "Events & milestones this week" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200", children: "Calendar →" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3.5", children: events.map((e, i) => {
      const Icon = e.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3.5 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 group/evt border border-transparent hover:border-border/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-10 rounded-xl grid place-items-center transition-transform duration-300 group-hover/evt:scale-105 shadow-2xs ${e.tint}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12px] font-semibold text-foreground truncate", children: e.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground/80 font-medium mt-0.5", children: e.date })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-xs text-primary font-bold hover:underline opacity-0 group-hover/evt:opacity-100 transition-opacity duration-200", children: "View" })
      ] }, i);
    }) })
  ] });
}
function RecruitmentPipeline() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-card border border-border/70 p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-border/95 relative group xl:col-span-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold tracking-tight text-[13px] text-foreground", children: "Recruitment Pipeline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/80 mt-0.5", children: "Active openings and candidate progress" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-xs font-semibold px-3 h-8.5 rounded-lg border border-border/60 hover:bg-muted transition duration-200", children: "Export" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-xs font-semibold px-3.5 h-8.5 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-sm hover:shadow-md hover:opacity-95 transition-all duration-300 hover:-translate-y-0.5", children: "+ New Job" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: recruitment.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group/pip rounded-xl border border-border/60 p-4.5 hover:border-primary/45 hover:shadow-xs hover:-translate-y-0.5 transition-all duration-300 bg-background/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground text-xs tracking-tight", children: r.role }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground/90 font-medium mt-1", children: [
            r.dept,
            " · ",
            r.applicants,
            " applicants"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-accent border border-accent-foreground/5 text-accent-foreground font-semibold tracking-tight", children: r.stage })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[10px] text-muted-foreground/85 font-medium mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pipeline progress" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
            r.pct,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden border border-border/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500 group-hover/pip:shadow-[0_0_8px_var(--primary-glow)]", style: { width: `${r.pct}%` } }) })
      ] })
    ] }, i)) })
  ] });
}
function DashboardPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 xl:p-8 space-y-6 lg:space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between border-b border-border/40 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75", children: "Workspace Indicators" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 mt-0.5 font-semibold", children: "Real-time operational overview metrics" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatCards, {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between border-b border-border/40 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75", children: "Overview & Analytics" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 mt-0.5 font-semibold", children: "Headcount cycles, department allocation splits, and attendance schedules" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(HeadcountChart, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DepartmentChart, {})
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AttendanceChart, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(GoalsRadial, {})
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between border-b border-border/40 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/75", children: "Operations & Logistics" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 mt-0.5 font-semibold", children: "Request approvals, milestone tracking, and active recruitment pipelines" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LeaveRequests, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(UpcomingEvents, {})
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 lg:gap-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RecruitmentPipeline, {}) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "pt-4 pb-2 text-center text-[10px] font-medium text-muted-foreground/60 border-t border-border/30", children: "© 2026 CRIPTON HRIS — crafted with care for modern people teams." })
      ] })
    ] })
  ] });
}
export {
  DashboardPage as component
};
