import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useRouterState } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { _ as _e } from "../_libs/cmdk.mjs";
import { R as Root, P as Portal, C as Content, a as Close, O as Overlay, T as Title, D as Description } from "../_libs/radix-ui__react-dialog.mjs";
import { R as Root2, T as Trigger, P as Portal$1, C as Content2 } from "../_libs/radix-ui__react-popover.mjs";
import { C as ChevronRight, a as Clock, b as CircleCheck, F as FolderOpen, c as CircleX, S as Search, T as Table, P as Printer, d as FileText, E as Eye, e as CalendarDays, f as TreePalm, g as ChevronLeft, G as Grid3x3, L as List, h as CalendarRange, i as Plus, A as ArrowRight, j as CircleQuestionMark, k as Paperclip, l as FileCheck, X, U as User, M as MessageSquare, m as CornerUpRight, B as Building2, n as SquareCheckBig, o as SlidersVertical, p as Timer, q as Users, H as Hash, I as Info, R as RotateCcw, r as Save, s as LayoutDashboard, t as Briefcase, u as SlidersHorizontal, v as UserRound, w as FingerprintPattern, x as CalendarX, y as ChartColumn, z as ClipboardCheck, D as UserPlus, J as Coins, K as RefreshCw, N as ShieldAlert, O as CreditCard, Q as Cpu, V as ShieldCheck, W as Lightbulb, Y as ChevronDown, Z as File, _ as Settings, $ as LifeBuoy, a0 as CornerDownLeft, a1 as Sun, a2 as Moon, a3 as MessagesSquare, a4 as Bell, a5 as Check } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
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
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
const appCss = "/assets/styles-BuJkwDmj.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$X = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CRIPTON HRIS" },
      { name: "description", content: "Modern HR management software for high-performing teams." },
      { name: "author", content: "CRIPTON" },
      { property: "og:title", content: "CRIPTON HRIS" },
      { property: "og:description", content: "Modern HR management software for high-performing teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "CRIPTON HRIS" },
      { name: "twitter:description", content: "Modern HR management software for high-performing teams." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/05484a77-948f-46d7-a418-7e21a7ec3b5c/id-preview-327f3108--896dc413-e37e-4671-9344-6489d69a3e7d.lovable.app-1778999534611.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/05484a77-948f-46d7-a418-7e21a7ec3b5c/id-preview-327f3108--896dc413-e37e-4671-9344-6489d69a3e7d.lovable.app-1778999534611.png" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$X.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const nav = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  {
    label: "SSP",
    icon: Briefcase,
    subitems: [
      { label: "New Requisition", to: "/ssp-new-requisition" },
      { label: "My Requisition", to: "/ssp-my-requisition" },
      { label: "Approval", to: "/ssp-approval" },
      { label: "Attendance", to: "/ssp-attendance" }
    ]
  },
  {
    label: "Configure",
    icon: SlidersHorizontal,
    subitems: [
      { label: "Structure Setup", to: "/configure-structure" },
      { label: "Job & Employee Setup", to: "/configure-employment" },
      { label: "Shift & Time Rules", to: "/configure-time" },
      { label: "Allowances & Bonuses", to: "/configure-compensation" },
      { label: "Education & Training", to: "/configure-education" },
      { label: "Leave & Policies", to: "/configure-policies" }
    ]
  },
  {
    label: "Personnel Info",
    icon: UserRound,
    active: true,
    subitems: [
      { label: "Personnel List", to: "/personnel-list" },
      { label: "Approval", to: "/personnel-approval" }
    ]
  },
  {
    label: "Attendance",
    icon: FingerprintPattern,
    subitems: [
      { label: "Manual Attendance", to: "/manual-attendance" },
      { label: "Manual Attendance Approval", to: "/pending-manual-attendance" },
      { label: "Employee Job Card", to: "/employee-job-card" },
      { label: "Allowance Process", to: "/" },
      { label: "Allowance Requisition", to: "/" }
    ]
  },
  {
    label: "Roster",
    icon: CalendarDays,
    subitems: [
      { label: "Create Roster", to: "/create-roster" },
      { label: "Company Holiday", to: "/company-holiday" }
    ]
  },
  {
    label: "Leave",
    icon: CalendarX,
    subitems: [
      { label: "Leave List", to: "/leave-list" },
      { label: "Leave Approve", to: "/leave-approve" },
      { label: "Earn Leave Process", to: "/earn-leave-process" },
      { label: "Earn Leave Workflow", to: "/earn-leave-workflow" },
      { label: "Earn Leave Process List", to: "/" }
    ]
  },
  {
    label: "KPI",
    icon: ChartColumn,
    subitems: [
      { label: "Task Name", to: "/kpi-task-name" },
      { label: "KPI Setting", to: "/kpi-setting" },
      { label: "Assessment Workflow", to: "/kpi-assessment-workflow" }
    ]
  },
  {
    label: "Evaluation",
    icon: ClipboardCheck,
    subitems: [
      { label: "Increment Configurator", to: "/increment-gadget" },
      { label: "Evaluation Propose", to: "/evaluation-propose" },
      { label: "Propose Increment", to: "/propose-increment" },
      { label: "Increment Summary", to: "/increment-summary" },
      { label: "Approve Increment Gadget", to: "/approve-increment-gadget" },
      { label: "Increment Queue List", to: "/increment-queuelist" },
      { label: "Approve Increment (HR)", to: "/approve-increment-hr" },
      { label: "Approve Increment", to: "/final-approve-increment" },
      { label: "Increment List", to: "/increment-list" },
      { label: "Increment History", to: "/increment-history" }
    ]
  },
  {
    label: "e-Recruitment",
    icon: UserPlus,
    subitems: [
      { label: "e-Recruitment Form", to: "/e-recruitment-form" },
      { label: "List", to: "/recruitment-basic-list" },
      { label: "Approved List", to: "/recruitment-assessment-list" }
    ]
  },
  {
    label: "IE Recruitment",
    icon: UserPlus,
    subitems: [
      { label: "Organization Setting", to: "/recruitment-basic-setup" },
      { label: "Basic Entry Form", to: "/recruitment-basic-entry" },
      { label: "Basic Info List", to: "/recruitment-basic-info-list" },
      { label: "IE Configuration", to: "/recruitment-configuration" },
      { label: "IE Assessment", to: "/recruitment-ie-list" },
      { label: "HR Assessment", to: "/recruitment-hr-list" },
      { label: "Assessment List", to: "/recruitment-assessment-list" }
    ]
  },
  {
    label: "Manage Shift",
    icon: Clock,
    active: true,
    subitems: [
      { label: "Shift Schedule", to: "/" },
      { label: "Shift Rotation", to: "/" },
      { label: "Shift Roster", to: "/" },
      { label: "Late Policy", to: "/" }
    ]
  },
  {
    label: "Budget",
    icon: Coins,
    subitems: [
      { label: "Annual Budget", to: "/" },
      { label: "Department Budget", to: "/" },
      { label: "Expense Claims", to: "/" }
    ]
  },
  {
    label: "Transfer",
    icon: RefreshCw,
    subitems: [
      { label: "Branch Transfer", to: "/" },
      { label: "Department Transfer", to: "/" },
      { label: "Transfer History", to: "/" }
    ]
  },
  {
    label: "HR Policy",
    icon: FileText,
    subitems: [
      { label: "Company Rules", to: "/" },
      { label: "Benefits Policy", to: "/" },
      { label: "Conduct Policy", to: "/" }
    ]
  },
  {
    label: "Disciplinary Action",
    icon: ShieldAlert,
    subitems: [
      { label: "Case Files", to: "/" },
      { label: "Warning Letters", to: "/" },
      { label: "Show Cause Notices", to: "/" }
    ]
  },
  {
    label: "Manage Overtime",
    icon: Timer,
    subitems: [
      { label: "Overtime Requests", to: "/" },
      { label: "OT Calculations", to: "/" },
      { label: "OT Approvals", to: "/" }
    ]
  },
  {
    label: "Manage Allowance",
    icon: CreditCard,
    subitems: [
      { label: "Allowance Setup", to: "/" },
      { label: "Employee Allowance", to: "/" },
      { label: "Tax Exemption Rules", to: "/" }
    ]
  },
  {
    label: "Processes",
    icon: Cpu,
    subitems: [
      { label: "Payroll Processing", to: "/" },
      { label: "End of Month Close", to: "/" },
      { label: "Year End Process", to: "/" }
    ]
  },
  {
    label: "Compliance",
    icon: ShieldCheck,
    subitems: [
      { label: "Statutory Compliance", to: "/" },
      { label: "Tax Reports", to: "/" },
      { label: "Audit Logs", to: "/" }
    ]
  },
  {
    label: "Idea Share",
    icon: Lightbulb,
    subitems: [
      { label: "Idea Board", to: "/" },
      { label: "Innovation Submissions", to: "/" }
    ]
  },
  {
    label: "Event",
    icon: CalendarDays,
    subitems: [
      { label: "Upcoming Events", to: "/" },
      { label: "Holiday Celebrations", to: "/" },
      { label: "Team Building", to: "/" }
    ]
  }
];
function Sidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [openMenus, setOpenMenus] = reactExports.useState(() => {
    const initial = {};
    nav.forEach((item) => {
      if (item.subitems && item.subitems.some((sub) => sub.to !== "/" && sub.to === currentPath)) {
        initial[item.label] = true;
      }
    });
    return initial;
  });
  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label]
    }));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden lg:flex w-64 h-screen sticky top-0 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 flex items-center gap-2.5 border-b border-sidebar-border/80", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8.5 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center font-extrabold text-primary-foreground shadow-[0_4px_12px_oklch(0.48_0.19_255/0.25)] text-sm tracking-tight transition-transform duration-300 hover:rotate-6", children: "C" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-extrabold tracking-tight text-[13px] text-sidebar-foreground", children: "CRIPTON" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-[0.25em] font-bold text-sidebar-primary", children: "HRIS" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2.5 pb-2 text-[9px] font-extrabold uppercase tracking-widest text-sidebar-foreground/45", children: "Workspace" }),
      nav.map((item) => {
        const Icon = item.icon;
        const isParentActive = item.to === currentPath || item.subitems && item.subitems.some((sub) => sub.to !== "/" && sub.to === currentPath);
        if (!item.subitems) {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-sidebar-border/30 last:border-0 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: item.to || "/",
              className: [
                "group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] font-semibold transition-all duration-200",
                isParentActive ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-2xs" : "text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              ].join(" "),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:text-sidebar-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label }),
                isParentActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto size-1.5 rounded-full bg-sidebar-primary shadow-[0_0_8px_var(--sidebar-primary)] animate-pulse" })
              ]
            }
          ) }, item.label);
        }
        const isOpen = openMenus[item.label];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5 border-b border-sidebar-border/30 last:border-0 pb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => toggleMenu(item.label),
              className: [
                "w-full group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] text-left transition-all duration-200 font-semibold",
                isParentActive ? "bg-sidebar-accent/30 text-sidebar-accent-foreground font-bold" : "text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              ].join(" "),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Icon,
                  {
                    className: [
                      "size-3.5 transition-colors duration-300 group-hover:scale-110 group-hover:text-sidebar-primary",
                      isParentActive ? "text-success font-black" : "text-sidebar-foreground/60"
                    ].join(" ")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: item.label }),
                isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5 text-sidebar-foreground/45 transition-transform duration-300 rotate-180" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3.5 text-sidebar-foreground/45 transition-transform duration-300" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: [
                "overflow-hidden transition-all duration-300 space-y-0.5 pl-3.5 bg-sidebar-accent/25 rounded-xl",
                isOpen ? "max-h-[600px] opacity-100 py-1.5 mt-0.5" : "max-h-0 opacity-0"
              ].join(" "),
              children: item.subitems.map((sub) => {
                const isSubActive = sub.to !== "/" && sub.to === currentPath;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: sub.to,
                    className: [
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150",
                      isSubActive ? "bg-primary/10 text-primary font-bold shadow-2xs" : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    ].join(" "),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: ["size-3 shrink-0", isSubActive ? "text-primary font-black" : "text-sidebar-foreground/45"].join(" ") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: sub.label })
                    ]
                  },
                  sub.label
                );
              })
            }
          )
        ] }, item.label);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-t border-sidebar-border/60 space-y-1 bg-sidebar-accent/15", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/configure-structure", className: "group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "size-3.5 transition-transform duration-300 group-hover:rotate-45" }),
        " Settings"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LifeBuoy, { className: "size-3.5 transition-transform duration-300 group-hover:scale-110" }),
        " Help & Support"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 mx-1 p-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border hover:border-sidebar-border/80 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-[10px] font-bold text-primary-foreground shadow-sm", children: "TAS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-success border-2 border-sidebar shadow-[0_0_6px_var(--success)]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold text-sidebar-foreground truncate", children: "Tahmid Afsar Shapno" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-sidebar-foreground/60 truncate font-semibold", children: "HR Director" })
        ] })
      ] }) })
    ] })
  ] });
}
const avatarImg = "/assets/avatar-BvM5hm4v.png";
const searchableMenus = [
  { label: "Dashboard Overview", parent: "Home", to: "/" },
  // Personnel Info
  { label: "Personnel List", parent: "Personnel Info", to: "/personnel-list", description: "View and filter complete staff profiles" },
  { label: "Manpower Basic Form", parent: "Personnel Info", to: "/" },
  { label: "Manpower Basic List", parent: "Personnel Info", to: "/" },
  { label: "Personnel QR Scanner", parent: "Personnel Info", to: "/" },
  // Attendance
  { label: "Manual Attendance Entry", parent: "Attendance", to: "/manual-attendance", description: "Insert and record manual logs" },
  { label: "Manual Attendance Approval", parent: "Attendance", to: "/pending-manual-attendance", description: "Verify pending manual logs" },
  { label: "Employee Job Card", parent: "Attendance", to: "/employee-job-card", description: "Monthly attendance cards" },
  { label: "Allowance Process", parent: "Attendance", to: "/" },
  // Roster
  { label: "Create Roster Plan", parent: "Roster", to: "/create-roster", description: "Configure employee roster plans" },
  { label: "Company Holiday Calendar", parent: "Roster", to: "/company-holiday", description: "Manage statutory company holidays" },
  // Leave
  { label: "Leave Application Form", parent: "Leave", to: "/leave-application", description: "Draft and submit new leaves" },
  { label: "Leave Approval Board", parent: "Leave", to: "/leave-approve", description: "Review and approve/reject leave requests" },
  { label: "Leave List Database", parent: "Leave", to: "/leave-list", description: "Historical database of employee leaves" },
  { label: "Earn Leave Process", parent: "Leave", to: "/earn-leave-process", description: "Accrue cash payments for earned leave" },
  { label: "Earn Leave Workflow Center", parent: "Leave", to: "/earn-leave-workflow", description: "Unified Submit/Check/Approve pipeline" },
  // Shift & Policy placeholders
  { label: "Shift Schedule Configurator", parent: "Manage Shift", to: "/" },
  { label: "Shift Rotation Planner", parent: "Manage Shift", to: "/" },
  { label: "Late Attendance Policy", parent: "Manage Shift", to: "/" },
  { label: "Annual Budget Tracker", parent: "Budget", to: "/" },
  { label: "Department Budget Allocator", parent: "Budget", to: "/" },
  { label: "Expense Claims Clearance", parent: "Budget", to: "/" },
  { label: "Branch Transfer Registry", parent: "Transfer", to: "/" },
  { label: "Task Name", parent: "KPI", to: "/kpi-task-name" },
  { label: "KPI Setting", parent: "KPI", to: "/kpi-setting" },
  { label: "Assessment Workflow", parent: "KPI", to: "/kpi-assessment-workflow" },
  { label: "Approval", parent: "Personnel Info", to: "/personnel-approval" },
  { label: "Statutory Compliance Audit", parent: "Compliance", to: "/" },
  // IE Recruitment
  { label: "Recruitment Basic ID Setup", parent: "IE Recruitment", to: "/recruitment-basic-setup", description: "Define recruitment rules and temp ID setup" },
  { label: "Recruitment Basic Entry Form", parent: "IE Recruitment", to: "/recruitment-basic-entry", description: "Register new candidate profiles temporarily" },
  { label: "Recruitment Basic Info List", parent: "IE Recruitment", to: "/recruitment-basic-list", description: "View directory of registered temp profiles" },
  { label: "Recruitment Configuration Settings", parent: "IE Recruitment", to: "/recruitment-configuration", description: "Manage SMV banks, machine list, operations etc." },
  { label: "Recruitment Assessment List", parent: "IE Recruitment", to: "/recruitment-assessment-list", description: "Floor evaluation and HR approval workflow" },
  // Configure
  { label: "Company Settings Setup", parent: "Configure", to: "/configure-structure?tab=company", description: "Configure global enterprise HR settings and validation rules." },
  { label: "Organization Setup", parent: "Configure", to: "/configure-structure?tab=company", description: "Configure organization settings" },
  { label: "Area Name Setup", parent: "Configure", to: "/configure-structure?tab=area", description: "Configure area names" },
  { label: "Company Mapping Setup", parent: "Configure", to: "/configure-structure?tab=mapping", description: "Configure company mapping" },
  { label: "Employee Type Setup", parent: "Configure", to: "/configure-employment?tab=empType", description: "Configure employee types" },
  { label: "Department Setup", parent: "Configure", to: "/configure-structure?tab=department", description: "Configure department settings" },
  { label: "Section Setup", parent: "Configure", to: "/configure-structure?tab=section", description: "Configure section settings" },
  { label: "Designation Group Setup", parent: "Configure", to: "/configure-employment?tab=designationGroup", description: "Configure designation groups" },
  { label: "Job Title Setup", parent: "Configure", to: "/configure-employment?tab=jobTitle", description: "Configure job titles" },
  { label: "Grade Setup", parent: "Configure", to: "/configure-employment?tab=grade", description: "Configure grade settings" },
  { label: "Shift Setup", parent: "Configure", to: "/configure-time?tab=shift", description: "Configure shifts" },
  { label: "Unit Setup", parent: "Configure", to: "/configure-structure?tab=unit", description: "Configure units" },
  { label: "Line Setup", parent: "Configure", to: "/configure-structure?tab=line", description: "Configure lines" },
  { label: "Country Setup", parent: "Configure", to: "/configure-employment?tab=country", description: "Configure countries" },
  { label: "Religion Setup", parent: "Configure", to: "/configure-employment?tab=religion", description: "Configure religion settings" },
  { label: "Bonus Setting", parent: "Configure", to: "/configure-compensation?tab=bonus", description: "Configure bonus settings" },
  { label: "Educational Qualification Setup", parent: "Configure", to: "/configure-education?tab=qualification", description: "Configure educational qualifications" },
  { label: "Education Institution Setup", parent: "Configure", to: "/configure-education?tab=institution", description: "Configure educational institutions" },
  { label: "Education Result Setup", parent: "Configure", to: "/configure-education?tab=result", description: "Configure education results" },
  { label: "Training Category Setup", parent: "Configure", to: "/configure-education?tab=training", description: "Configure training categories" },
  { label: "Leave Setting Setup", parent: "Configure", to: "/configure-policies?tab=leave", description: "Configure leave settings" },
  { label: "Allowance Rate Setup", parent: "Configure", to: "/configure-compensation?tab=allowance", description: "Configure allowance rates" },
  { label: "Tiffin Rate Setup", parent: "Configure", to: "/configure-compensation?tab=tiffin", description: "Configure tiffin rates" },
  { label: "Lunch Rate Setup", parent: "Configure", to: "/configure-compensation?tab=lunch", description: "Configure lunch rates" },
  { label: "Policy Name Setup", parent: "Configure", to: "/configure-policies?tab=policy", description: "Configure policies" },
  { label: "OT Configuration Setup", parent: "Configure", to: "/configure-time?tab=ot", description: "Configure overtime settings" },
  { label: "Place In BD Setup", parent: "Configure", to: "/configure-employment?tab=place", description: "Configure Bangladeshi locations" },
  { label: "Conveyance Setup", parent: "Configure", to: "/configure-compensation?tab=conveyance", description: "Configure conveyance rates" },
  { label: "Abnormal Shift Setup", parent: "Configure", to: "/configure-time?tab=abnormal", description: "Configure abnormal shifts" },
  { label: "Attendance Bonus Policy Setup", parent: "Configure", to: "/configure-time?tab=bonus", description: "Configure attendance bonuses" },
  { label: "Job Nature Setup", parent: "Configure", to: "/configure-employment?tab=nature", description: "Configure job natures" }
];
function getCategoryIcon(parent) {
  switch (parent) {
    case "Home":
      return LayoutDashboard;
    case "Personnel Info":
      return UserRound;
    case "Attendance":
      return FingerprintPattern;
    case "Roster":
      return CalendarDays;
    case "Leave":
      return CalendarX;
    case "Manage Shift":
      return Clock;
    case "Budget":
      return Coins;
    case "Transfer":
      return RefreshCw;
    case "HR Policy":
      return FileText;
    case "KPI":
      return ChartColumn;
    case "Evaluation":
      return ClipboardCheck;
    case "Disciplinary Action":
      return ShieldAlert;
    case "Manage Overtime":
      return Timer;
    case "Manage Allowance":
      return CreditCard;
    case "Processes":
      return Cpu;
    case "Compliance":
      return ShieldCheck;
    case "Idea Share":
      return Lightbulb;
    case "IE Recruitment":
      return UserPlus;
    case "Configure":
      return SlidersHorizontal;
    default:
      return LayoutDashboard;
  }
}
function Topbar() {
  const [theme, setTheme] = reactExports.useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [isSearchOpen, setIsSearchOpen] = reactExports.useState(false);
  const [focusedIndex, setFocusedIndex] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const inputEl = document.getElementById("global-menu-search-input");
        inputEl?.focus();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const filteredResults = reactExports.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return searchableMenus.filter((m) => m.to !== "/").slice(0, 5);
    }
    return searchableMenus.filter(
      (item) => item.label.toLowerCase().includes(q) || item.parent.toLowerCase().includes(q) || item.description && item.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);
  reactExports.useEffect(() => {
    setFocusedIndex(0);
  }, [searchQuery]);
  const handleSearchKeyDown = (e) => {
    if (!isSearchOpen || filteredResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % filteredResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredResults[focusedIndex];
      if (selected) {
        setIsSearchOpen(false);
        setSearchQuery("");
        window.location.href = selected.to;
      }
    }
  };
  reactExports.useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);
  reactExports.useEffect(() => {
    const clickHandler = (e) => {
      const target = e.target;
      if (!target.closest(".global-search-container")) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", clickHandler);
    return () => document.removeEventListener("mousedown", clickHandler);
  }, []);
  const [greeting, setGreeting] = reactExports.useState("Good morning");
  reactExports.useEffect(() => {
    const hours = (/* @__PURE__ */ new Date()).getHours();
    if (hours < 12) setGreeting("Good morning");
    else if (hours < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "h-14 px-5 flex items-center gap-3 border-b border-border/60 bg-card/90 backdrop-blur-md sticky top-0 z-20 transition-colors duration-300 shadow-2xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-sm font-bold tracking-tight text-foreground", children: [
        greeting,
        ", Shapno 👋"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground/90 font-medium font-sans", children: "Here's what's happening across your organization today." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative hidden md:block global-search-container", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "global-menu-search-input",
              value: searchQuery,
              onFocus: () => setIsSearchOpen(true),
              onChange: (e) => setSearchQuery(e.target.value),
              onKeyDown: handleSearchKeyDown,
              placeholder: "Search menus (e.g. Leave Application, Roster...)",
              className: "w-76 focus:w-88 pl-10 pr-14 h-9.5 rounded-full bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/40 focus:border-primary/80 focus:bg-card focus:ring-4 focus:ring-primary/10 outline-none text-xs transition-all duration-300 font-sans font-bold"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black px-2 py-0.5 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 shadow-2xs select-none pointer-events-none", children: "⌘K" })
        ] }),
        isSearchOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 top-11.5 w-[390px] bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-500 animate-pulse", children: "⚡" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: searchQuery ? `Matching Menus (${filteredResults.length})` : "Quick Access Menus" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-md bg-slate-200/50 dark:bg-slate-800 text-[8.5px] font-bold lowercase tracking-normal", children: "esc to close" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-80 overflow-y-auto p-2 space-y-1", children: [
            filteredResults.map((item, idx) => {
              const isFocused = idx === focusedIndex;
              const isActiveRoute = item.to !== "/";
              const CategoryIcon = getCategoryIcon(item.parent);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: item.to,
                  onClick: () => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  },
                  className: `w-full group text-left flex items-center gap-3 p-2.5 rounded-xl transition duration-150 border ${isFocused ? "bg-primary/[0.08] dark:bg-primary/[0.12] border-primary/20 text-primary" : "hover:bg-slate-50/70 dark:hover:bg-slate-900/40 border-transparent text-slate-700 dark:text-slate-350"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-8 rounded-lg flex items-center justify-center border shrink-0 transition-transform duration-300 ${isFocused ? "scale-105" : ""} ${isActiveRoute ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 border-slate-200/40 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryIcon, { className: "size-4" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-black tracking-tight leading-none", children: item.label }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-1.5 py-0.2 rounded text-[7.5px] font-black uppercase tracking-wider scale-90 ${isActiveRoute ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"}`, children: item.parent })
                      ] }),
                      item.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9.5px] text-slate-450 dark:text-slate-400 mt-1 font-semibold leading-tight", children: item.description })
                    ] }),
                    isFocused && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[8px] font-black px-2 py-1 rounded-md bg-primary text-white shadow-xs animate-pulse", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Enter" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CornerDownLeft, { className: "size-2.5" })
                    ] })
                  ]
                },
                item.label
              );
            }),
            filteredResults.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-8 text-center text-slate-400 font-bold text-[10.5px]", children: "No corporate menus found matching query." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/60 text-[9px] text-slate-400 font-bold flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "↑↓" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "to navigate" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Enter to open" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
          className: "relative size-9 grid place-items-center rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors duration-200",
          title: "Toggle Light/Dark Theme",
          children: theme === "dark" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "size-4.5 text-amber-400 transition-transform duration-300 hover:rotate-45" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "size-4.5 text-primary transition-transform duration-300 hover:-rotate-12" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "relative size-9 grid place-items-center rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessagesSquare, { className: "size-4.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex items-center mr-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "relative size-9 grid place-items-center rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-4.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 left-1.5 px-1 py-0.2 text-[8px] font-extrabold bg-[#1e40af] dark:bg-blue-600 text-white rounded shadow-2xs min-w-[12px] text-center", children: "0" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pl-3.5 border-l border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right hidden lg:block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-foreground", children: "Tahmid Afsar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-muted-foreground/85 mt-0.5", children: "Pakiza Software Limited (PSL-Operation)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-full overflow-hidden border border-border/80 shadow-2xs flex-shrink-0 bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: avatarImg,
            alt: "Tahmid Afsar",
            className: "size-full object-cover"
          }
        ) })
      ] })
    ] })
  ] });
}
const Route$W = createFileRoute("/ssp-request-manual-attendance")({
  component: RequestManualAttendancePage
});
const inputClass$3 = "w-full h-9 px-3 text-[13px] font-medium text-foreground bg-muted/30 dark:bg-slate-900/50 border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 hover:border-border dark:hover:border-slate-700 transition-all placeholder:text-muted-foreground/50";
const labelClass$3 = "block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5";
function Field$3({ label, required, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: labelClass$3, children: [
      label,
      required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 ml-0.5", children: "*" })
    ] }),
    children
  ] });
}
function RequestManualAttendancePage() {
  const [date, setDate] = reactExports.useState("");
  const [inTime, setInTime] = reactExports.useState("");
  const [outTime, setOutTime] = reactExports.useState("");
  const [reason, setReason] = reactExports.useState("");
  const recentRequests = [
    { id: 1, date: "02/06/2026", in: "09:00 AM", out: "06:00 PM", type: "Forgot to Punch", status: "Approved" },
    { id: 2, date: "15/05/2026", in: "08:50 AM", out: "06:15 PM", type: "Official Duty Outside", status: "Approved" },
    { id: 3, date: "10/04/2026", in: "10:00 AM", out: "07:00 PM", type: "Machine Not Working", status: "Rejected" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen flex bg-background text-foreground overflow-hidden font-sans antialiased tracking-tight", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-hidden flex flex-col px-6 py-4 gap-4 bg-slate-50/50 dark:bg-slate-950/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10.5px] text-muted-foreground shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-foreground transition-colors", children: "Home" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/ssp-attendance", className: "hover:text-foreground transition-colors", children: "Attendance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground dark:text-slate-300 font-semibold", children: "Request Manual Attendance" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-5 overflow-y-auto pr-2 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-xl shadow-sm flex flex-col shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-border/50 bg-slate-50 dark:bg-slate-900 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-4 rounded-full bg-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground tracking-tight", children: "Manual Attendance Request" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field$3, { label: "Attendance Date", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: date,
                  onChange: (e) => setDate(e.target.value),
                  className: inputClass$3
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field$3, { label: "In Time", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "time",
                    value: inTime,
                    onChange: (e) => setInTime(e.target.value),
                    className: `${inputClass$3} pl-9`
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field$3, { label: "Out Time", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "time",
                    value: outTime,
                    onChange: (e) => setOutTime(e.target.value),
                    className: `${inputClass$3} pl-9`
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field$3, { label: "Reason", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: reason,
                  onChange: (e) => setReason(e.target.value),
                  placeholder: "e.g. Forgot to punch",
                  className: inputClass$3
                }
              ) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-t border-border/50 bg-slate-50/50 dark:bg-slate-900/60 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10.5px] text-muted-foreground", children: [
                "Fields marked with ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500 font-bold", children: "*" }),
                " are required"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-9 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-[12px] font-semibold rounded-lg transition-all shadow-sm hover:shadow-md active:scale-[0.98] flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5" }),
                "Submit Request"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-xl shadow-sm flex flex-col flex-1 min-h-[300px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-b border-border/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-4 rounded-full bg-blue-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13px] font-bold text-foreground", children: "Recent Manual Requests" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-[12px] whitespace-nowrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50/50 dark:bg-slate-950/20 text-muted-foreground border-b border-border/50 sticky top-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-semibold", children: "Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-semibold", children: "In Time" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-semibold", children: "Out Time" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-semibold", children: "Reason" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-semibold", children: "Status" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "bg-white dark:bg-slate-900/40 text-foreground", children: recentRequests.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/30 dark:border-slate-800/40 last:border-0 hover:bg-muted/10 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-medium", children: req.date }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: req.in }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: req.out }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-medium", children: req.type }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border ${req.status === "Approved" ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30" : "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/30"}`, children: req.status }) })
              ] }, req.id)) })
            ] }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const $$splitComponentImporter$O = () => import("./ssp-new-requisition-DHY-1XbH.mjs");
const Route$V = createFileRoute("/ssp-new-requisition")({
  component: lazyRouteComponent($$splitComponentImporter$O, "component")
});
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Dialog = Root;
const DialogPortal = Portal;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = Overlay.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = Content.displayName;
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = Title.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = Description.displayName;
const Command = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e,
  {
    ref,
    className: cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    ),
    ...props
  }
));
Command.displayName = _e.displayName;
const CommandInput = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border-b px-3", "cmdk-input-wrapper": "", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    _e.Input,
    {
      ref,
      className: cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props
    }
  )
] }));
CommandInput.displayName = _e.Input.displayName;
const CommandList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.List,
  {
    ref,
    className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
    ...props
  }
));
CommandList.displayName = _e.List.displayName;
const CommandEmpty = reactExports.forwardRef((props, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(_e.Empty, { ref, className: "py-6 text-center text-sm", ...props }));
CommandEmpty.displayName = _e.Empty.displayName;
const CommandGroup = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Group,
  {
    ref,
    className: cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    ),
    ...props
  }
));
CommandGroup.displayName = _e.Group.displayName;
const CommandSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Separator,
  {
    ref,
    className: cn("-mx-1 h-px bg-border", className),
    ...props
  }
));
CommandSeparator.displayName = _e.Separator.displayName;
const CommandItem = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    ),
    ...props
  }
));
CommandItem.displayName = _e.Item.displayName;
const Popover = Root2;
const PopoverTrigger = Trigger;
const PopoverContent = reactExports.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = Content2.displayName;
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className
}) {
  const [open, setOpen] = reactExports.useState(false);
  const selectedOption = options.find((option) => option.value === value);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        role: "combobox",
        "aria-expanded": open,
        className: cn(
          "flex w-full items-center justify-between h-10 px-3 rounded-xl bg-background border border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm transition-all text-foreground cursor-pointer hover:border-primary/50 text-left",
          className
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 truncate", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5 text-muted-foreground/60 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: selectedOption ? selectedOption.label : placeholder })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50 text-muted-foreground" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PopoverContent,
      {
        className: "w-[var(--radix-popover-trigger-width)] p-0 shadow-lg border-border/50 rounded-xl overflow-hidden",
        align: "start",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Command, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CommandInput, { placeholder: "Search...", className: "h-9 text-xs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandList, { className: "max-h-[200px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { className: "py-3 text-center text-xs text-muted-foreground", children: "No results found." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { className: "p-1", children: options.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              CommandItem,
              {
                value: option.label,
                onSelect: () => {
                  onChange(option.value);
                  setOpen(false);
                },
                className: "text-xs rounded-lg cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary my-0.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Check,
                    {
                      className: cn(
                        "mr-2 h-3.5 w-3.5 text-primary",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )
                    }
                  ),
                  option.label
                ]
              },
              option.value
            )) })
          ] })
        ] })
      }
    )
  ] });
}
function LeaveApplicationModal({ open, onOpenChange }) {
  const details = [
    ["Type", "Sick Leave"],
    ["From", "04/04/2026"],
    ["Category", "Full Day Leave"],
    ["To", "04/04/2026"],
    ["Documents", "—"],
    ["Duration", "1 Day"],
    ["Contact", "01750021154"],
    ["Responsible", "Md. Anik Islam (Dy. Manager)"],
    ["Address", "Jahangirnagar University"],
    ["Purpose", "Semester Final Exam"]
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-3xl p-0 bg-white border border-border/40 shadow-2xl rounded-lg overflow-hidden gap-0 max-h-[95vh] [&>button]:hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border/30 flex items-center justify-between bg-muted/10 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[16px] font-bold text-foreground tracking-tight", children: "Leave Application" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground/80 mt-0.5", children: "Requisition Detail View" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onOpenChange(false), className: "size-8 rounded-full bg-white hover:bg-muted border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-6 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/10 border border-border/30 rounded-xl p-4 flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "Reference No." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] font-semibold text-foreground bg-white px-2 py-0.5 rounded border border-border/50 shadow-sm w-fit", children: "PSL-RQ-LEAVE-372569" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "Submitted By" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] font-semibold text-foreground", children: "Tahmid Afsar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground font-medium", children: "Emp ID: 2023043910 · Asst. Manager" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground font-medium", children: "Business Innovation" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-[11px] font-bold text-foreground border-b border-border/30 pb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-blue-500" }),
          "Requisition Details"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-12 gap-y-2.5 px-1", children: details.map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-border/20 pb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-muted-foreground", children: k }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] font-medium text-foreground text-right", children: v })
        ] }, k)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-[11px] font-bold text-foreground border-b border-border/30 pb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-blue-500" }),
          "Leave Balances & Status"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/30 rounded-xl overflow-hidden shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-[11px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: ["#", "Leave Type", "Enjoyed", "Balance", "Date From", "Date To", "Duration", "Pay Type"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 font-semibold border-b border-border/30", children: h }, h)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: "2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: "Sick Leave" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: "2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold text-blue-600", children: "12" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: "04/04/2026" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: "04/04/2026" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: "1 Day" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[10px] font-bold", children: "With Pay" }) })
          ] }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-[11px] font-bold text-foreground border-b border-border/30 pb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-blue-500" }),
          "Approval Signatures"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4", children: [
          { role: "Manager", name: "Md. Zahidul Islam", title: "COO", date: "02 Apr 2026 · 13:50" },
          { role: "Head of HR", name: "Rajebul Hasan Rajon", title: "Deputy Manager", date: "21 Apr 2026 · 20:11" }
        ].map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 bg-emerald-50/30 border border-emerald-100 rounded-xl flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 bg-emerald-100 p-1.5 rounded-full text-emerald-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1", children: [
              a.role,
              " Approved"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] font-bold text-foreground", children: a.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground font-medium", children: a.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 mt-1", children: a.date })
          ] })
        ] }, a.role)) })
      ] })
    ] })
  ] }) });
}
function GeneralStoreRequisitionModal({ open, onOpenChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-3xl p-0 bg-white border border-border/40 shadow-2xl rounded-lg overflow-hidden gap-0 max-h-[95vh] [&>button]:hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border/30 flex items-center justify-between bg-muted/10 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[16px] font-bold text-foreground tracking-tight", children: "General Product Store Requisition" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground/80 mt-0.5", children: "Requisition Detail View" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onOpenChange(false), className: "size-8 rounded-full bg-white hover:bg-muted border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-6 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/10 border border-border/30 rounded-xl p-4 flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "Reference No." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[13px] font-semibold text-foreground bg-white px-2 py-0.5 rounded border border-border/50 shadow-sm w-fit flex flex-col gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PSL-RQ-GEN-STO-378956" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/70 font-medium", children: "PSL/REC/STR/39" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider", children: "Submitted By" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] font-semibold text-foreground", children: "Tahmid Afsar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground font-medium", children: "Emp ID: 2023043910 · Asst. Manager" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground font-medium", children: "Business Innovation · Rev 00" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-[11px] font-bold text-foreground border-b border-border/30 pb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-blue-500" }),
          "Requisition Items"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border/30 rounded-xl overflow-hidden shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-[11px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: ["#", "Item Name", "Justification", "Req Qty", "Apd Qty", "Status"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 font-semibold border-b border-border/30", children: h }, h)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: "1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold text-foreground", children: "Pencil Battery (Size: AA)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: "For mouse use" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: "2.000 PCS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-blue-600", children: "2.000 PCS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[10px] font-bold", children: "Issued" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground/80 font-medium", children: "P: 0.000 · D: 2.000 · S: 0.000" })
            ] }) })
          ] }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-[11px] font-bold text-foreground border-b border-border/30 pb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-blue-500" }),
          "Approval Signatures"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4", children: [
          { role: "Manager", name: "Md. Zahidul Islam", title: "COO", date: "19 May 2026 · 13:33" },
          { role: "Store", name: "Rajebul Hasan Rajon", title: "Deputy Manager", date: "20 May 2026 · 09:56" }
        ].map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 bg-emerald-50/30 border border-emerald-100 rounded-xl flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 bg-emerald-100 p-1.5 rounded-full text-emerald-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1", children: [
              a.role,
              " Approved"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] font-bold text-foreground", children: a.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground font-medium", children: a.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 mt-1", children: a.date })
          ] })
        ] }, a.role)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t border-border/30 flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground/60 italic", children: "No comments recorded." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-9 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-[11px] font-bold transition-colors shadow-sm flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5" }),
          "MARK AS RECEIVED"
        ] })
      ] })
    ] })
  ] }) });
}
const Route$U = createFileRoute("/ssp-my-requisition")({
  component: MyRequisitionPage
});
function MyRequisitionPage() {
  const [leaveModalOpen, setLeaveModalOpen] = reactExports.useState(false);
  const [storeModalOpen, setStoreModalOpen] = reactExports.useState(false);
  const [requester, setRequester] = reactExports.useState("Tahmid Afsar");
  const [statusFilter, setStatusFilter] = reactExports.useState("All");
  const [dateFrom, setDateFrom] = reactExports.useState("2026-03-01");
  const [dateTo, setDateTo] = reactExports.useState("2026-06-08");
  const [reqNumber, setReqNumber] = reactExports.useState("");
  const [globalSearch, setGlobalSearch] = reactExports.useState("");
  const requesterOptions = [
    { value: "Tahmid Afsar", label: "Tahmid Afsar (Assistant Manager)" }
  ];
  const tableData = [
    {
      id: "378956",
      reqNum: "378956",
      date: "2026-05-05",
      status: "Approved",
      doc: "General Product Store Requisition",
      note: "",
      onClickView: () => setStoreModalOpen(true)
    },
    {
      id: "372569",
      reqNum: "372569",
      date: "2026-04-01",
      status: "Approved",
      doc: "Leave Application",
      note: "",
      onClickView: () => setLeaveModalOpen(true)
    }
  ];
  const totalCount = tableData.length;
  const approvedCount = tableData.filter((r) => r.status === "Approved").length;
  const pendingCount = tableData.filter((r) => r.status === "Pending").length;
  const rejectedCount = tableData.filter((r) => r.status === "Rejected").length;
  const filteredData = tableData.filter((row) => {
    if (statusFilter !== "All" && row.status !== statusFilter) return false;
    if (reqNumber && !row.reqNum.includes(reqNumber)) return false;
    if (globalSearch) {
      const search = globalSearch.toLowerCase();
      return row.reqNum.includes(search) || row.doc.toLowerCase().includes(search) || row.date.includes(search);
    }
    return true;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen flex bg-[#f1f5f9] text-[#334155] overflow-hidden font-sans antialiased tracking-tight", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col p-4 xl:p-6 gap-4 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-200/80 rounded-lg px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:text-primary transition-colors", children: "SSP" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-655 font-semibold", children: "My Requisition" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-1.5 rounded-full bg-slate-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold tracking-tight text-slate-800", children: "My Requisitions" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 font-medium", children: "Track and monitor the status of all requisitions you have submitted." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-200 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-555 shrink-0 border border-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "size-4.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider", children: "Total Submitted" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-black text-slate-800 leading-none mt-0.5", children: [
                totalCount,
                " Requests"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-200 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider", children: "Approved" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-black text-slate-800 leading-none mt-0.5", children: [
                approvedCount,
                " Requests"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-200 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider", children: "Pending" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-black text-slate-800 leading-none mt-0.5", children: [
                pendingCount,
                " Requests"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-200 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0 border border-rose-100/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider", children: "Rejected" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-black text-slate-800 leading-none mt-0.5", children: [
                rejectedCount,
                " Requests"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-200/80 rounded-lg p-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col xl:flex-row xl:items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: "Employee:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SearchableSelect,
                {
                  value: requester,
                  onChange: setRequester,
                  options: requesterOptions,
                  className: "h-8 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold px-2"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5 shadow-3xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: dateFrom,
                  onChange: (e) => setDateFrom(e.target.value),
                  className: "h-7 px-1.5 bg-transparent border-0 text-[10.5px] font-bold focus:outline-none"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-350 text-[10.5px] font-bold", children: "to" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: dateTo,
                  onChange: (e) => setDateTo(e.target.value),
                  className: "h-7 px-1.5 bg-transparent border-0 text-[10.5px] font-bold focus:outline-none"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 shadow-3xs", children: ["All", "Approved", "Pending", "Rejected"].map((filter) => {
              const isActive = statusFilter === filter;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setStatusFilter(filter),
                  className: `px-2.5 py-1 text-[9px] font-bold rounded transition-all uppercase tracking-wider ${isActive ? "bg-slate-700 text-white shadow-3xs" : "text-slate-500 hover:bg-white/40 hover:text-slate-800"}`,
                  children: filter
                },
                filter
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-2 size-3 text-slate-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: reqNumber,
                  onChange: (e) => setReqNumber(e.target.value),
                  placeholder: "Req Number...",
                  className: "h-7.5 pl-8 pr-3 w-full bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-slate-400"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] rounded-lg overflow-hidden flex flex-col min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-slate-200 bg-slate-50/20 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8 px-3 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1 bg-white cursor-pointer shadow-3xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { className: "size-3.5 text-emerald-600" }),
                " EXCEL"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8 px-3 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1 bg-white cursor-pointer shadow-3xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5 text-slate-500" }),
                " PRINT"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8 px-3 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1 bg-white cursor-pointer shadow-3xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3.5 text-rose-500" }),
                " PDF"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-48", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-2 size-3.5 text-slate-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: globalSearch,
                  onChange: (e) => setGlobalSearch(e.target.value),
                  placeholder: "Quick Search...",
                  className: "h-7.5 w-full pl-8.5 pr-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-slate-400"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 bg-white border-b border-slate-200 z-10 shadow-3xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#fafafa]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest", children: "ReqNum" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest", children: "ReqDate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest", children: "Document" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest", children: "ReqNote" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-100 text-xs font-semibold text-slate-700", children: [
              filteredData.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/20 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: row.onClickView,
                      className: "size-7 rounded-lg bg-slate-50 hover:bg-slate-900 border border-slate-200 hover:border-slate-900 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-3xs",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "size-7 rounded-lg bg-slate-50 hover:bg-slate-900 border border-slate-200 hover:border-slate-900 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-3xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5" }) })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2 font-bold text-slate-800", children: row.reqNum }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2 text-slate-500 font-mono", children: row.date }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${row.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" : "bg-amber-50 text-amber-700 border-amber-200/50"}`, children: row.status }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2 text-slate-800", children: row.doc }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2 text-slate-400 font-normal italic", children: row.note || "—" })
              ] }, row.id)),
              filteredData.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "py-8 text-center text-slate-400 font-bold", children: "No requisitions found matching current status/filters." }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[10px] font-bold text-slate-400 px-5 py-2.5 border-t border-slate-200 bg-slate-50/10 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "Showing 1 to ",
              filteredData.length,
              " of ",
              filteredData.length,
              " entries"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-30", disabled: true, children: "Previous" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "size-5.5 rounded bg-slate-700 text-white flex items-center justify-center shadow-sm text-[9.5px]", children: "1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-30", disabled: true, children: "Next" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LeaveApplicationModal, { open: leaveModalOpen, onOpenChange: setLeaveModalOpen }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(GeneralStoreRequisitionModal, { open: storeModalOpen, onOpenChange: setStoreModalOpen })
  ] });
}
const inputClass$2 = "w-full h-9 px-3 text-[13px] font-medium text-foreground bg-muted/30 dark:bg-slate-900/50 border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 hover:border-border dark:hover:border-slate-700 transition-all placeholder:text-muted-foreground/50";
const labelClass$2 = "block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5";
function Field$2({ label, required, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: labelClass$2, children: [
      label,
      required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-400 ml-0.5", children: "*" })
    ] }),
    children
  ] });
}
function RequestManualAttendanceModal({ open, onOpenChange, selectedDate }) {
  const [date, setDate] = reactExports.useState(selectedDate);
  const [inTime, setInTime] = reactExports.useState("");
  const [outTime, setOutTime] = reactExports.useState("");
  const [reason, setReason] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (open) {
      setDate(selectedDate);
      setInTime("");
      setOutTime("");
      setReason("");
    }
  }, [open, selectedDate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-xl p-0 bg-white dark:bg-slate-900 border border-border/40 dark:border-slate-800 shadow-2xl rounded-lg overflow-hidden gap-0 [&>button]:hidden text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border/30 flex items-center justify-between bg-muted/10 dark:bg-slate-900 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[16px] font-bold text-foreground tracking-tight", children: "Manual Attendance Request" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground/80 mt-0.5", children: "Submit request for missed punches" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onOpenChange(false), className: "size-8 rounded-full bg-white dark:bg-slate-800 hover:bg-muted dark:hover:bg-slate-700 border border-border/50 dark:border-slate-700 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field$2, { label: "Attendance Date", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "date",
          value: date,
          onChange: (e) => setDate(e.target.value),
          className: inputClass$2
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field$2, { label: "Reason", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: reason,
          onChange: (e) => setReason(e.target.value),
          placeholder: "e.g. Forgot to punch",
          className: inputClass$2
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field$2, { label: "In Time", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "time",
            value: inTime,
            onChange: (e) => setInTime(e.target.value),
            className: `${inputClass$2} pl-9`
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field$2, { label: "Out Time", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "time",
            value: outTime,
            onChange: (e) => setOutTime(e.target.value),
            className: `${inputClass$2} pl-9`
          }
        )
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-t border-border/50 bg-muted/10 dark:bg-slate-900 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10.5px] text-muted-foreground", children: [
        "Fields marked with ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-400 font-bold", children: "*" }),
        " are required"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => onOpenChange(false),
          className: "h-9 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-[12px] font-semibold rounded-lg transition-all shadow-sm flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5" }),
            "Submit Request"
          ]
        }
      )
    ] })
  ] }) });
}
const Route$T = createFileRoute("/ssp-my-attendance")({
  component: MyAttendancePage
});
const generateDummyData = () => {
  const days = [];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  for (let i = 1; i <= 30; i++) {
    const dateObj = new Date(2026, 5, i);
    const dayOfWeek = dateObj.getDay();
    const dayName = dayNames[dayOfWeek];
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      days.push({ date: i, status: "Weekend", dayName });
      continue;
    }
    if (i > 25) {
      days.push({ date: i, status: "Future", dayName });
      continue;
    }
    if (i === 15) {
      days.push({ date: i, status: "Absent", dayName });
      continue;
    }
    if (i === 10 || i === 11) {
      days.push({ date: i, status: "Leave", dayName });
      continue;
    }
    if (i === 4) {
      days.push({ date: i, status: "Late", inTime: "09:45 AM", outTime: "06:05 PM", dayName });
      continue;
    }
    if (i === 20) {
      days.push({ date: i, status: "Holiday", dayName });
      continue;
    }
    days.push({ date: i, status: "Present", inTime: "08:55 AM", outTime: "06:00 PM", dayName });
  }
  return days;
};
const generateYearlyDummyData = (year) => {
  const monthsData = [];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = /* @__PURE__ */ new Date();
  for (let month = 0; month < 12; month++) {
    const days = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(year, month, i);
      const dayOfWeek = dateObj.getDay();
      const dayName = dayNames[dayOfWeek];
      let status = "Present";
      let inTime;
      let outTime;
      let leaveType;
      let holidayName;
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        status = "Weekend";
      } else if (dateObj > today) {
        status = "Future";
      } else {
        const rand = Math.random();
        if (rand < 0.05) {
          status = "Absent";
        } else if (rand < 0.1) {
          status = "Leave";
          leaveType = Math.random() > 0.5 ? "Sick Leave" : "Casual Leave";
        } else if (rand < 0.15) {
          status = "Late";
          inTime = "09:45 AM";
          outTime = "06:05 PM";
        } else if (rand < 0.18) {
          status = "Holiday";
          holidayName = "Public Holiday";
        } else {
          status = "Present";
          const inMin = Math.floor(Math.random() * 15) + 45;
          inTime = `08:${inMin} AM`;
          const outMin = Math.floor(Math.random() * 30);
          outTime = `06:${outMin.toString().padStart(2, "0")} PM`;
        }
      }
      days.push({ date: i, status, inTime, outTime, dayName, leaveType, holidayName });
    }
    monthsData.push({ monthName: monthNames[month], days, emptyCells: Array(firstDay).fill(null) });
  }
  return monthsData;
};
const getStatusBadgeStyle = (status) => {
  switch (status) {
    case "Present":
      return "bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10 dark:border-emerald-500/20";
    case "Late":
      return "bg-amber-500/5 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/10 dark:border-amber-500/20";
    case "Absent":
      return "bg-rose-500/5 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/10 dark:border-rose-500/20";
    case "Leave":
      return "bg-blue-500/5 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/10 dark:border-blue-500/20";
    case "Holiday":
      return "bg-purple-500/5 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/10 dark:border-purple-500/20";
    case "Weekend":
      return "bg-slate-100/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/30 dark:border-slate-800/30";
  }
};
function MyAttendancePage() {
  const [currentMonth, setCurrentMonth] = reactExports.useState("June 2026");
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const [selectedDateStr, setSelectedDateStr] = reactExports.useState("");
  const [viewMode, setViewMode] = reactExports.useState("calendar");
  const [statusFilter, setStatusFilter] = reactExports.useState("All");
  const attendanceData = generateDummyData();
  const yearlyData = generateYearlyDummyData(2026);
  const emptyCells = Array(1).fill(null);
  const presentDays = attendanceData.filter((d) => d.status === "Present").length;
  const lateDays = attendanceData.filter((d) => d.status === "Late").length;
  const absentDays = attendanceData.filter((d) => d.status === "Absent").length;
  const leaveDays = attendanceData.filter((d) => d.status === "Leave").length;
  const holidayDays = attendanceData.filter((d) => d.status === "Holiday").length;
  const totalWorkingDays = presentDays + lateDays + absentDays + leaveDays;
  const presentRate = totalWorkingDays > 0 ? Math.round((presentDays + lateDays) / totalWorkingDays * 100) : 0;
  const handleDayClick = (dayNumber, status) => {
    if (status === "Future") return;
    const dateStr = `2026-06-${dayNumber.toString().padStart(2, "0")}`;
    setSelectedDateStr(dateStr);
    setIsModalOpen(true);
  };
  const filteredData = attendanceData.filter((day) => {
    if (statusFilter === "All") return true;
    return day.status === statusFilter;
  });
  const totalSlots = emptyCells.length + attendanceData.length;
  const numRows = Math.ceil(totalSlots / 7);
  const totalGridSlots = numRows * 7;
  const endEmptyCells = Array(totalGridSlots - totalSlots).fill(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen flex bg-[#f8fafc] dark:bg-[#0b0f19] text-[#334155] dark:text-slate-200 overflow-hidden font-sans antialiased tracking-tight", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col p-4 xl:p-6 gap-4 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-lg px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:text-primary transition-colors", children: "SSP" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600 dark:text-slate-300 font-semibold", children: "My Attendance" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-1.5 rounded-full bg-slate-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100", children: "My Attendance" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-slate-400 font-medium", children: "View your monthly attendance details, track punches, and request adjustments." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-555 dark:text-slate-400 shrink-0 border border-slate-100 dark:border-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider", children: "Working Days" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5", children: [
                totalWorkingDays,
                " Days"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100/40 dark:border-emerald-900/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider", children: "Present Days" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-extrabold text-slate-700 dark:text-slate-200", children: [
                  presentDays + lateDays,
                  " Days"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 px-1 py-0.5 rounded leading-none", children: [
                  presentRate,
                  "%"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 border border-amber-100/40 dark:border-amber-900/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider", children: "Late Arrivals" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5", children: [
                lateDays,
                " ",
                lateDays === 1 ? "Day" : "Days"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 border border-rose-100/40 dark:border-rose-900/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider", children: "Absent Days" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5", children: [
                absentDays,
                " ",
                absentDays === 1 ? "Day" : "Days"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex items-center gap-3 col-span-2 md:col-span-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 border border-blue-100/40 dark:border-blue-900/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TreePalm, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider", children: "Off / Holiday" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5", children: [
                leaveDays + holidayDays,
                " Days"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-1 hover:bg-white dark:hover:bg-slate-700 hover:shadow-2xs rounded transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-3" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold px-2 min-w-[80px] text-center select-none text-slate-700 dark:text-slate-200", children: currentMonth }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-1 hover:bg-white dark:hover:bg-slate-700 hover:shadow-2xs rounded transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setViewMode("calendar"),
                  className: `flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded transition-all ${viewMode === "calendar" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-2xs border border-slate-200/30 dark:border-slate-700" : "text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "size-3" }),
                    "Grid"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setViewMode("list"),
                  className: `flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded transition-all ${viewMode === "list" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-2xs border border-slate-200/30 dark:border-slate-700" : "text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "size-3" }),
                    "List"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setViewMode("yearly"),
                  className: `flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded transition-all ${viewMode === "yearly" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-2xs border border-slate-200/30 dark:border-slate-700" : "text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarRange, { className: "size-3" }),
                    "Yearly"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5", children: ["All", "Present", "Late", "Absent", "Leave", "Holiday", "Weekend"].map((filter) => {
            const isActive = statusFilter === filter;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setStatusFilter(filter),
                className: `px-2 py-0.5 text-[9px] font-bold rounded transition-all uppercase tracking-wider ${isActive ? "bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900 shadow-3xs" : "text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200"}`,
                children: filter
              },
              filter
            );
          }) })
        ] }),
        viewMode === "calendar" ? (
          /* Professional Contiguous Calendar Block */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col min-h-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 shrink-0", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-2.5 text-center text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest select-none", children: day }, day)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex-1 grid grid-cols-7 bg-white dark:bg-slate-900 overflow-hidden divide-x divide-slate-100 dark:divide-slate-800 border-t border-l border-slate-100 dark:border-slate-800",
                style: { gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))` },
                children: [
                  emptyCells.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "border-b border-r border-slate-200/60 dark:border-slate-800/60 bg-slate-50/25 dark:bg-slate-950/10"
                    },
                    `empty-${i}`
                  )),
                  attendanceData.map((day) => {
                    const isFilteredOut = statusFilter !== "All" && day.status !== statusFilter;
                    const isWeekend = day.status === "Weekend";
                    const isFuture = day.status === "Future";
                    const isCurrentDay = day.date === 14;
                    let cellBg = "bg-emerald-50/50 dark:bg-emerald-950/20";
                    let dateColor = "text-emerald-900 dark:text-emerald-400";
                    let statusText = "Present";
                    let statusColor = "text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-950/30 border-emerald-200/40 dark:border-emerald-900/30";
                    if (isWeekend) {
                      cellBg = "bg-slate-100/70 dark:bg-slate-900/40";
                      dateColor = "text-slate-400 dark:text-slate-500";
                      statusText = "Weekend";
                      statusColor = "text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-800/40 border-slate-300/40 dark:border-slate-700/20";
                    } else if (isFuture) {
                      cellBg = "bg-slate-50/30 dark:bg-slate-950/10 opacity-70";
                      dateColor = "text-slate-300 dark:text-slate-700";
                      statusText = "";
                      statusColor = "";
                    } else if (day.status === "Absent") {
                      cellBg = "bg-rose-50/60 dark:bg-rose-950/20";
                      dateColor = "text-rose-900 dark:text-rose-400";
                      statusText = "Absent";
                      statusColor = "text-rose-700 dark:text-rose-400 bg-rose-100/50 dark:bg-rose-950/30 border-rose-200/40 dark:border-rose-900/30";
                    } else if (day.status === "Leave") {
                      cellBg = "bg-blue-50/60 dark:bg-blue-950/20";
                      dateColor = "text-blue-900 dark:text-blue-400";
                      statusText = "Leave";
                      statusColor = "text-blue-700 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-950/30 border-blue-200/40 dark:border-blue-900/30";
                    } else if (day.status === "Holiday") {
                      cellBg = "bg-purple-50/60 dark:bg-purple-950/20";
                      dateColor = "text-purple-900 dark:text-purple-400";
                      statusText = "Holiday";
                      statusColor = "text-purple-700 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-950/30 border-purple-200/40 dark:border-purple-900/30";
                    } else if (day.status === "Late") {
                      cellBg = "bg-amber-50/60 dark:bg-amber-950/20";
                      dateColor = "text-amber-900 dark:text-amber-400";
                      statusText = "Late";
                      statusColor = "text-amber-700 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-950/30 border-amber-200/40 dark:border-amber-900/30";
                    }
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        onClick: () => handleDayClick(day.date, day.status),
                        className: `group relative p-2.5 flex flex-col justify-between border-b border-r border-slate-200/80 dark:border-slate-800/85 transition-all duration-150 ${isFilteredOut ? "opacity-10 pointer-events-none" : ""} ${isFuture ? "cursor-default select-none" : isWeekend ? "cursor-default select-none" : isCurrentDay ? `${cellBg} ring-1.5 ring-slate-800 dark:ring-slate-200 z-5 cursor-pointer shadow-sm` : `${cellBg} hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer`}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[11px] font-extrabold ${isCurrentDay ? "text-slate-900 dark:text-white" : dateColor}`, children: [
                              day.date.toString().padStart(2, "0"),
                              isCurrentDay && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/30 px-1 py-0.5 rounded", children: "Today" })
                            ] }),
                            statusText && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-1.5 py-0.5 rounded text-[7px] font-extrabold uppercase tracking-widest border ${statusColor}`, children: statusText })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col justify-end gap-1 mt-2.5", children: [
                            !isFuture && !isWeekend && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-[9.5px] font-mono select-none", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-white/45 dark:bg-slate-900/45 px-1.5 py-0.5 rounded border border-slate-200/20 dark:border-slate-800/20", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7.5px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider", children: "In:" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-700 dark:text-slate-350", children: day.inTime || "—" })
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-white/45 dark:bg-slate-900/45 px-1.5 py-0.5 rounded border border-slate-200/20 dark:border-slate-800/20", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7.5px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider", children: "Out:" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-700 dark:text-slate-350", children: day.outTime || "—" })
                              ] })
                            ] }),
                            (isWeekend || isFuture) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9" })
                          ] }),
                          !isFuture && !isWeekend && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[#fafafa]/98 dark:bg-slate-900/98 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-100 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8.5px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-1 rounded shadow-3xs hover:bg-slate-50 dark:hover:bg-slate-700", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-2" }),
                            " Adjust punches"
                          ] }) })
                        ]
                      },
                      day.date
                    );
                  }),
                  "    ",
                  endEmptyCells.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "border-b border-r border-slate-200/60 dark:border-slate-800/60 bg-slate-50/25 dark:bg-slate-950/10"
                    },
                    `empty-end-${i}`
                  ))
                ]
              }
            )
          ] })
        ) : viewMode === "yearly" ? (
          /* Professional Yearly View Panel */
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-y-auto min-h-0 shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: yearlyData.map((month, monthIndex) => {
            const endEmptyCells2 = Array((7 - (month.emptyCells.length + month.days.length) % 7) % 7).fill(null);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-extrabold text-primary mb-3 pl-1", children: month.monthName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-700/50 shadow-sm backdrop-blur-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 border-b border-slate-100/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl px-2", children: ["S", "M", "T", "W", "T", "F", "S"].map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-2 text-center text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: d }, i)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-y-1.5 p-3 bg-gradient-to-b from-transparent to-slate-50/30 dark:to-slate-900/20 rounded-b-2xl", children: [
                  month.emptyCells.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 mx-auto" }, `empty-${i}`)),
                  month.days.map((day) => {
                    let cellStyles = "";
                    if (day.status === "Present") {
                      cellStyles = "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold";
                    } else if (day.status === "Absent") {
                      cellStyles = "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 font-bold";
                    } else if (day.status === "Late") {
                      cellStyles = "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold";
                    } else if (day.status === "Leave") {
                      cellStyles = "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-bold";
                    } else if (day.status === "Holiday") {
                      cellStyles = "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 font-bold";
                    } else if (day.status === "Future") {
                      cellStyles = "bg-transparent text-slate-300 dark:text-slate-600 font-medium";
                    } else if (day.status === "Weekend") {
                      cellStyles = "bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 font-bold";
                    }
                    const interactiveClass = day.status !== "Future" && day.status !== "Weekend" ? "hover:scale-110 hover:shadow-sm cursor-pointer hover:-translate-y-0.5 z-10 hover:ring-2 ring-offset-1 dark:ring-offset-slate-900 ring-slate-200 dark:ring-slate-700" : "cursor-default";
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        onClick: () => day.status !== "Future" && day.status !== "Weekend" && handleDayClick(day.date, day.status),
                        className: `relative group w-7 h-7 mx-auto rounded-[8px] flex items-center justify-center text-[10px] transition-all duration-200 ${cellStyles} ${interactiveClass}`,
                        children: [
                          day.date,
                          day.status !== "Future" && day.status !== "Weekend" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100] flex flex-col items-center", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 text-white text-[9px] px-2 py-1.5 rounded shadow-xl whitespace-nowrap border border-slate-700 font-mono tracking-tight flex flex-col gap-0.5", children: [
                              (day.status === "Present" || day.status === "Late") && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3", children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 font-sans", children: "In:" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-emerald-400", children: day.inTime || "—" })
                                ] }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3", children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 font-sans", children: "Out:" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-rose-400", children: day.outTime || "—" })
                                ] })
                              ] }),
                              day.status === "Absent" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-rose-400 text-center font-sans tracking-wide", children: "Absent" }),
                              day.status === "Leave" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-blue-400 text-center font-sans tracking-wide", children: day.leaveType || "Leave" }),
                              day.status === "Holiday" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-purple-400 text-center font-sans tracking-wide", children: day.holidayName || "Holiday" })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-900 -mt-[1px]" })
                          ] })
                        ]
                      },
                      day.date
                    );
                  }),
                  endEmptyCells2.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 mx-auto" }, `end-empty-${i}`))
                ] })
              ] })
            ] }, month.monthName);
          }) }) })
        ) : (
          /* Professional List View Panel */
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] rounded-lg overflow-hidden flex flex-col min-h-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 bg-white dark:bg-slate-900 z-10 shadow-[0_1px_0px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0px_rgba(255,255,255,0.05)] border-b border-slate-200 dark:border-slate-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-50/50 dark:bg-slate-950/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: "Day of Week" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: "Check In" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: "Check Out" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800", children: filteredData.map((day) => {
              const isWeekend = day.status === "Weekend";
              const isFuture = day.status === "Future";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: `hover:bg-slate-50/20 dark:hover:bg-slate-800/10 transition-colors group ${day.date === 14 ? "bg-slate-50/30 dark:bg-slate-800/30" : ""}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-2.5 text-slate-700 dark:text-slate-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      day.date === 14 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-1.5 rounded-full bg-slate-800 dark:bg-slate-200" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold", children: [
                        "June ",
                        day.date.toString().padStart(2, "0"),
                        ", 2026"
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-2.5 text-xs text-slate-400 dark:text-slate-500 font-medium", children: day.dayName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${getStatusBadgeStyle(day.status)}`, children: day.status }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-2.5", children: day.inTime ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3.5 text-slate-400 dark:text-slate-500" }),
                      day.inTime
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-300 dark:text-slate-600", children: "-" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-2.5", children: day.outTime ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5 text-slate-400 dark:text-slate-500" }),
                      day.outTime
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-300 dark:text-slate-600", children: "-" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-2.5 text-right", children: !isFuture && !isWeekend && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: () => handleDayClick(day.date, day.status),
                        className: "inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-slate-900 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-800 dark:hover:bg-slate-200 px-2.5 py-1 rounded transition-all cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-2.5" }),
                          " Adjust"
                        ]
                      }
                    ) })
                  ]
                },
                day.date
              );
            }) })
          ] }) }) })
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.015)] shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleQuestionMark, { className: "size-3.5 text-slate-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Hover over any active date to request manual adjustments." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-3", children: [
            { label: "Present", color: "bg-emerald-500" },
            { label: "Late", color: "bg-amber-500" },
            { label: "Absent", color: "bg-rose-500" },
            { label: "Leave", color: "bg-blue-500" },
            { label: "Holiday", color: "bg-purple-500" },
            { label: "Weekend", color: "bg-slate-400 dark:bg-slate-600" }
          ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-1.5 rounded-full ${item.color}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: item.label })
          ] }, item.label)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RequestManualAttendanceModal,
      {
        open: isModalOpen,
        onOpenChange: setIsModalOpen,
        selectedDate: selectedDateStr
      }
    )
  ] });
}
const Route$S = createFileRoute("/ssp-leave-requisition")({
  component: LeaveRequisitionPage
});
const inputClass$1 = "w-full h-9 px-3 text-[13px] font-medium text-foreground bg-muted/30 border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 hover:border-border transition-all placeholder:text-muted-foreground/50";
const labelClass$1 = "block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5";
function Field$1({ label, required, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: labelClass$1, children: [
      label,
      required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-400 ml-0.5", children: "*" })
    ] }),
    children
  ] });
}
function LeaveRequisitionPage() {
  const [leaveType, setLeaveType] = reactExports.useState("Casual Leave");
  const [leaveCategory, setLeaveCategory] = reactExports.useState("Full Day Leave");
  const [dateFrom, setDateFrom] = reactExports.useState("");
  const [dateTo, setDateTo] = reactExports.useState("");
  const [purpose, setPurpose] = reactExports.useState("");
  const [address, setAddress] = reactExports.useState("");
  const [contact, setContact] = reactExports.useState("");
  const [responsible, setResponsible] = reactExports.useState("");
  const [onBehalf, setOnBehalf] = reactExports.useState(false);
  const [onBehalfEmp, setOnBehalfEmp] = reactExports.useState("");
  const [fileName, setFileName] = reactExports.useState("");
  const leaveTypeOptions = [
    { value: "Casual Leave", label: "Casual Leave" },
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Earned Leave", label: "Earned Leave" }
  ];
  const categoryOptions = [
    { value: "Full Day Leave", label: "Full Day Leave" },
    { value: "Half Day Leave", label: "Half Day Leave" }
  ];
  const employeeOptions = [
    { value: "emp1", label: "Md. Anik Islam (Deputy Manager)" },
    { value: "emp2", label: "Rajebul Hasan Rajon (Deputy Manager)" },
    { value: "emp3", label: "Md. Zahidul Islam (COO)" }
  ];
  const totalDays = reactExports.useMemo(() => {
    if (!dateFrom || !dateTo) return null;
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const diff = to.getTime() - from.getTime();
    if (diff < 0) return null;
    const days = Math.ceil(diff / (1e3 * 60 * 60 * 24)) + 1;
    return leaveCategory === "Half Day Leave" ? 0.5 : days;
  }, [dateFrom, dateTo, leaveCategory]);
  const balances = [
    { type: "Casual Leave", assigned: 10, enjoyed: 3, balance: 7 },
    { type: "Sick Leave", assigned: 14, enjoyed: 2, balance: 12 },
    { type: "Earned Leave", assigned: 18, enjoyed: 0, balance: 18 }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen flex bg-background text-foreground overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-hidden flex flex-col px-6 py-4 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10.5px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-foreground transition-colors", children: "Home" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/ssp-new-requisition", className: "hover:text-foreground transition-colors", children: "SSP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/ssp-new-requisition", className: "hover:text-foreground transition-colors", children: "New Requisition" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: "Leave Requisition" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex gap-5 min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-card border border-border/60 rounded-xl shadow-sm flex flex-col overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-b border-border/50 bg-muted/20 flex items-center justify-between shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-4 rounded-full bg-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground tracking-tight", children: "Leave Application Form" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground bg-muted rounded px-2 py-0.5 font-medium", children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-6 gap-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Leave Type", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                SearchableSelect,
                {
                  value: leaveType,
                  onChange: setLeaveType,
                  options: leaveTypeOptions,
                  className: inputClass$1
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Leave Category", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                SearchableSelect,
                {
                  value: leaveCategory,
                  onChange: setLeaveCategory,
                  options: categoryOptions,
                  className: inputClass$1
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Duration From", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: dateFrom,
                  onChange: (e) => setDateFrom(e.target.value),
                  className: inputClass$1
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Duration To", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "date",
                    value: dateTo,
                    onChange: (e) => setDateTo(e.target.value),
                    className: inputClass$1
                  }
                ),
                totalDays !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-xl whitespace-nowrap", children: [
                  totalDays,
                  " ",
                  totalDays === 1 ? "Day" : "Days"
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Purpose / Reason", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: purpose,
                  onChange: (e) => setPurpose(e.target.value),
                  placeholder: "e.g. Medical appointment",
                  className: inputClass$1
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Address during Leave", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: address,
                  onChange: (e) => setAddress(e.target.value),
                  placeholder: "e.g. 42 Mirpur Road, Dhaka",
                  className: inputClass$1
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Contact Number", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: contact,
                  onChange: (e) => setContact(e.target.value),
                  placeholder: "+8801XXXXXXXXX",
                  className: inputClass$1
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Responsible Employee", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                SearchableSelect,
                {
                  value: responsible,
                  onChange: setResponsible,
                  options: employeeOptions,
                  placeholder: "Select employee...",
                  className: inputClass$1
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass$1, children: "Attachment (if any)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 h-9 w-full px-3 bg-muted/30 border border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 hover:border-primary/40 transition-all group", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "size-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] text-muted-foreground group-hover:text-foreground transition-colors truncate", children: fileName || "Click to attach a document  —  PDF, JPG, PNG (max 5MB)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "file",
                      className: "hidden",
                      onChange: (e) => setFileName(e.target.files?.[0]?.name || "")
                    }
                  )
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-t border-border/50 bg-muted/10 flex items-center justify-between shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10.5px] text-muted-foreground", children: [
                "Fields marked with ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-400 font-bold", children: "*" }),
                " are required"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-9 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-[12px] font-semibold rounded-lg transition-all shadow-sm hover:shadow-md active:scale-[0.98] flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5" }),
                "Submit Requisition"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[310px] flex flex-col gap-4 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-border/50 bg-muted/20 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1 h-4 rounded-full bg-emerald-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] font-bold text-foreground", children: "Leave Balance 2026" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 space-y-2", children: balances.map((b) => {
                const pct = Math.round(b.enjoyed / b.assigned * 100);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-muted/20 border border-border/40 hover:bg-muted/30 transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-baseline mb-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] font-semibold text-foreground", children: b.type }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-bold text-emerald-600", children: [
                      b.balance,
                      " left"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 rounded-full bg-border/60 overflow-hidden mb-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full rounded-full bg-emerald-500 transition-all duration-700",
                      style: { width: `${pct}%` }
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 text-[10px] text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Assigned: ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: b.assigned })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Used: ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: b.enjoyed })
                    ] })
                  ] })
                ] }, b.type);
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-xl shadow-sm p-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 cursor-pointer group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      className: "sr-only peer",
                      checked: onBehalf,
                      onChange: (e) => setOnBehalf(e.target.checked)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-5 rounded-full bg-muted border border-border peer-checked:bg-rose-500 peer-checked:border-rose-500 transition-all" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-4" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] font-semibold text-foreground group-hover:text-rose-500 transition-colors", children: "Apply on Behalf" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Submit request for another employee" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `overflow-hidden transition-all duration-300 ease-out ${onBehalf ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: labelClass$1, children: "Select Employee" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SearchableSelect,
                  {
                    value: onBehalfEmp,
                    onChange: setOnBehalfEmp,
                    options: employeeOptions,
                    placeholder: "Search employee...",
                    className: inputClass$1
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const Route$R = createFileRoute("/ssp-ict-requisition")({
  component: ICTRequisitionPage
});
const inputClass = "w-full h-9 px-3 text-[13px] font-medium text-foreground bg-muted/30 border border-border/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 hover:border-border transition-all placeholder:text-muted-foreground/50";
const labelClass = "block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5";
function Field({ label, required, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: labelClass, children: [
      label,
      required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-400 ml-0.5", children: "*" })
    ] }),
    children
  ] });
}
function ICTRequisitionPage() {
  const [mode, setMode] = reactExports.useState("service");
  const [sProduct, setSProduct] = reactExports.useState("");
  const [sJustification, setSJustification] = reactExports.useState("");
  const [stProductFor, setStProductFor] = reactExports.useState("Department Uses");
  const [stProduct, setStProduct] = reactExports.useState("");
  const [stQuantity, setStQuantity] = reactExports.useState("");
  const [stJustification, setStJustification] = reactExports.useState("");
  const [serviceItems, setServiceItems] = reactExports.useState([]);
  const [storeItems, setStoreItems] = reactExports.useState([]);
  const [onBehalf, setOnBehalf] = reactExports.useState(false);
  const [onBehalfEmp, setOnBehalfEmp] = reactExports.useState("");
  const productForOptions = [
    { value: "Department Uses", label: "Department Uses" },
    { value: "Personal Uses", label: "Personal Uses" }
  ];
  const employeeOptions = [
    { value: "emp1", label: "Md. Anik Islam (Deputy Manager)" },
    { value: "emp2", label: "Rajebul Hasan Rajon (Deputy Manager)" },
    { value: "emp3", label: "Md. Zahidul Islam (COO)" }
  ];
  const handleAddService = () => {
    if (!sProduct || !sJustification) return;
    setServiceItems([...serviceItems, { id: Date.now().toString(), product: sProduct, justification: sJustification }]);
    setSProduct("");
    setSJustification("");
  };
  const handleAddStore = () => {
    if (!stProduct || !stQuantity || !stJustification) return;
    setStoreItems([...storeItems, { id: Date.now().toString(), productFor: stProductFor, product: stProduct, quantity: stQuantity, justification: stJustification }]);
    setStProduct("");
    setStQuantity("");
    setStJustification("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen flex bg-background text-foreground overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-hidden flex flex-col px-6 py-4 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10.5px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-foreground transition-colors", children: "Home" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/ssp-new-requisition", className: "hover:text-foreground transition-colors", children: "SSP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/ssp-new-requisition", className: "hover:text-foreground transition-colors", children: "New Requisition" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: "ICT Requisition" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex gap-5 min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-card border border-border/60 rounded-xl shadow-sm flex flex-col overflow-hidden max-w-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-border/50 bg-muted/20 flex items-center justify-between shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex bg-muted/50 p-1 rounded-lg border border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setMode("service"),
                  className: `px-4 py-1.5 text-[12px] font-bold rounded-xl transition-all ${mode === "service" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`,
                  children: "ICT Service"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setMode("store"),
                  className: `px-4 py-1.5 text-[12px] font-bold rounded-xl transition-all ${mode === "store" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`,
                  children: "ICT Store"
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-5 py-5 flex flex-col justify-between", children: [
              mode === "service" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Product", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: sProduct,
                    onChange: (e) => setSProduct(e.target.value),
                    placeholder: "e.g. Printer Repair",
                    className: inputClass
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Justification", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: sJustification,
                    onChange: (e) => setSJustification(e.target.value),
                    placeholder: "e.g. Printer is jamming frequently",
                    className: inputClass
                  }
                ) })
              ] }),
              mode === "store" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Product For", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SearchableSelect,
                  {
                    value: stProductFor,
                    onChange: setStProductFor,
                    options: productForOptions,
                    className: inputClass
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Product", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: stProduct,
                    onChange: (e) => setStProduct(e.target.value),
                    placeholder: "e.g. Mouse",
                    className: inputClass
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Quantity", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: stQuantity,
                    onChange: (e) => setStQuantity(e.target.value),
                    placeholder: "e.g. 2",
                    className: inputClass
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Justification", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: stJustification,
                    onChange: (e) => setStJustification(e.target.value),
                    placeholder: "e.g. Needed for new hires",
                    className: inputClass
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: mode === "service" ? handleAddService : handleAddStore,
                  className: "h-9 px-6 bg-blue-500 hover:bg-blue-600 text-white text-[12px] font-semibold rounded-lg transition-all shadow-sm flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
                    "ADD"
                  ]
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-[1.5] flex flex-col gap-4 shrink-0 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border/50 bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] font-bold text-foreground", children: "Added Items" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-[12px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/10 text-muted-foreground border-b border-border/40 sticky top-0 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: mode === "service" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 font-semibold", children: "Item" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 font-semibold", children: "Justification" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 font-semibold", children: "Item" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 font-semibold", children: "Quantity" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 font-semibold", children: "Justification" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 font-semibold", children: "For" })
                ] }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "text-foreground bg-card", children: mode === "service" ? serviceItems.length > 0 ? serviceItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/30 hover:bg-muted/10 transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: item.product }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: item.justification })
                ] }, item.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 2, className: "px-4 py-8 text-center text-muted-foreground/60 text-[11px] italic", children: "No items added yet." }) }) : storeItems.length > 0 ? storeItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/30 hover:bg-muted/10 transition-colors", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: item.product }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: item.quantity }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: item.justification }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: item.productFor })
                ] }, item.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-4 py-8 text-center text-muted-foreground/60 text-[11px] italic", children: "No items added yet." }) }) })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border/60 rounded-xl shadow-sm p-4 flex flex-col gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 max-w-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 cursor-pointer group mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        className: "sr-only peer",
                        checked: onBehalf,
                        onChange: (e) => setOnBehalf(e.target.checked)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-5 rounded-full bg-muted border border-border peer-checked:bg-rose-500 peer-checked:border-rose-500 transition-all" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-4" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] font-semibold text-foreground group-hover:text-rose-500 transition-colors", children: "On Behalf" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `overflow-hidden transition-all duration-300 ease-out ${onBehalf ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SearchableSelect,
                  {
                    value: onBehalfEmp,
                    onChange: setOnBehalfEmp,
                    options: employeeOptions,
                    placeholder: "Select employee...",
                    className: inputClass
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-10 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-[12px] font-semibold rounded-lg transition-all shadow-sm active:scale-[0.98] flex items-center gap-2 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }),
                "SUBMIT"
              ] })
            ] }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const $$splitComponentImporter$N = () => import("./ssp-attendance-BzRAegTm.mjs");
const Route$Q = createFileRoute("/ssp-attendance")({
  component: lazyRouteComponent($$splitComponentImporter$N, "component")
});
const Route$P = createFileRoute("/ssp-approve-manual-attendance")({
  component: ApproveManualAttendancePage
});
function ApproveManualAttendancePage() {
  const [department, setDepartment] = reactExports.useState("All Departments");
  const [search, setSearch] = reactExports.useState("");
  const deptOptions = [
    { value: "All Departments", label: "All Departments" },
    { value: "IT", label: "IT" },
    { value: "HR", label: "HR" },
    { value: "Sales", label: "Sales" }
  ];
  const pendingRequests = [
    { id: 1, name: "Tahmid Afsar", empId: "2023043910", date: "08/06/2026", in: "09:00 AM", out: "06:00 PM", reason: "Forgot to Punch", dept: "IT" },
    { id: 2, name: "Md. Anik Islam", empId: "2022011200", date: "07/06/2026", in: "08:50 AM", out: "06:15 PM", reason: "Machine Not Working", dept: "HR" },
    { id: 3, name: "Zahidul Islam", empId: "2018090011", date: "07/06/2026", in: "10:00 AM", out: "07:00 PM", reason: "Official Duty Outside", dept: "Sales" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen flex bg-background text-foreground overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-hidden flex flex-col px-6 py-4 gap-3 bg-slate-50/50 dark:bg-slate-950/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10.5px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-foreground transition-colors", children: "Home" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground dark:text-slate-300", children: "SSP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground dark:text-slate-300 font-semibold", children: "Approve Manual Attendance" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-card border border-border/60 rounded-xl shadow-sm flex flex-col overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border/50 bg-slate-50 dark:bg-slate-900 flex items-center gap-4 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              SearchableSelect,
              {
                value: department,
                onChange: setDepartment,
                options: deptOptions,
                className: "h-9 px-3 text-[12px] font-medium bg-white dark:bg-slate-900 border border-border/70 dark:border-slate-800 rounded-lg focus:border-primary/60 text-foreground"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-64", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Search Employee...",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  className: "w-full h-9 pl-9 pr-3 text-[12px] font-medium bg-white dark:bg-slate-900 border border-border/70 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all text-foreground"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-[12px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50/50 dark:bg-slate-950/25 text-muted-foreground border-b border-border/50 sticky top-0 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-semibold", children: "Employee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-semibold", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-semibold", children: "In Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-semibold", children: "Out Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-semibold", children: "Reason" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 font-semibold text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "text-foreground bg-white dark:bg-slate-900/40 divide-y divide-slate-100 dark:divide-slate-800/40", children: pendingRequests.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/30 dark:border-slate-800/40 hover:bg-muted/10 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-800 dark:text-slate-200", children: req.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
                  req.empId,
                  " · ",
                  req.dept
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium", children: req.date }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: req.in }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-muted-foreground", children: req.out }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30 rounded-xl text-[10px] font-bold", children: req.reason }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer", title: "Reject", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4.5" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors cursor-pointer", title: "Approve", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4.5" }) })
              ] }) })
            ] }, req.id)) })
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
const Route$O = createFileRoute("/ssp-approval")({
  component: SSPApprovalPage
});
const dummyRequisitions = [
  {
    id: "382650",
    reqNum: "382650",
    date: "2026-05-24",
    requestor: "Parvej Mahmud",
    reqFrom: "PSL-Operation",
    department: "Business Innovation",
    document: "Leave Application",
    note: "",
    status: "Approved",
    details: {
      empId: "20260658726",
      doj: "22/02/2026",
      designation: "Officer",
      section: "APPS Team",
      location: "Pakiza Software Limited, PSL-Operation",
      type: "Casual Leave",
      category: "Full Day Leave",
      dates: "23/05/2026 to 23/05/2026",
      duration: "1 Days",
      contact: "01521205808",
      responsible: "—",
      purpose: "went to buy cow for Eid Ul Adha",
      balances: [
        {
          leaveType: "Casual Leave",
          enjoyed: 1,
          balance: 8,
          dateFrom: "23/05/2026",
          dateTo: "23/05/2026",
          duration: "1 Days",
          payType: "With Pay"
        }
      ],
      signatures: [
        { role: "Manager", name: "Md. Anik Islam", title: "Deputy Manager", date: "25/05/2026 10:07:53", status: "Approved" },
        { role: "HOD", name: "Tahmid Afsar", title: "Assistant Manager", date: "29/05/2026 21:59:47", status: "Approved" },
        { role: "HOD", name: "Md. Zahidul Islam", title: "COO", date: "06/06/2026 14:43:07", status: "Approved" },
        { role: "Head of HR", name: "Rajebul Hasan Rajon", title: "Deputy Manager", date: "06/06/2026 15:12:22", status: "Approved" },
        { role: "Forwarded Approval", name: "Rakibul Islam Khan", title: "Managing Director (MD's)", date: "06/06/2026 18:27:04", status: "Approved" }
      ]
    }
  },
  {
    id: "382078",
    reqNum: "382078",
    date: "2026-05-21",
    requestor: "Md Mahir Shahriyar",
    reqFrom: "PSL-Operation",
    department: "Business Innovation",
    document: "Leave Application",
    note: "",
    status: "Approved",
    details: {
      empId: "20260658799",
      doj: "10/01/2025",
      designation: "Officer",
      section: "Dev Team",
      location: "Pakiza Software Limited, PSL-Operation",
      type: "Sick Leave",
      category: "Full Day Leave",
      dates: "20/05/2026 to 22/05/2026",
      duration: "3 Days",
      contact: "01712345678",
      responsible: "Md. Anik Islam",
      purpose: "Fever and cold checkup",
      balances: [
        {
          leaveType: "Sick Leave",
          enjoyed: 3,
          balance: 10,
          dateFrom: "20/05/2026",
          dateTo: "22/05/2026",
          duration: "3 Days",
          payType: "With Pay"
        }
      ],
      signatures: [
        { role: "Manager", name: "Md. Anik Islam", title: "Deputy Manager", date: "22/05/2026 09:12:00", status: "Approved" },
        { role: "HOD", name: "Tahmid Afsar", title: "Assistant Manager", date: "22/05/2026 18:45:00", status: "Approved" },
        { role: "Head of HR", name: "Rajebul Hasan Rajon", title: "Deputy Manager", date: "23/05/2026 11:20:00", status: "Approved" }
      ]
    }
  },
  {
    id: "381510",
    reqNum: "381510",
    date: "2026-05-18",
    requestor: "Parvej Mahmud",
    reqFrom: "PSL-Operation",
    department: "Business Innovation",
    document: "ICT Product Store Requisition",
    note: "",
    status: "Approved",
    details: {
      empId: "20260658726",
      doj: "22/02/2026",
      designation: "Officer",
      section: "APPS Team",
      location: "Pakiza Software Limited, PSL-Operation",
      type: "ICT Requisition",
      category: "ICT Store Mode",
      dates: "18/05/2026",
      duration: "1 Items",
      contact: "01521205808",
      responsible: "Tahmid Afsar",
      purpose: "New employee developer laptop replacement",
      balances: [
        {
          leaveType: "ICT Requisition",
          enjoyed: 1,
          balance: 0,
          dateFrom: "18/05/2026",
          dateTo: "18/05/2026",
          duration: "1 Item",
          payType: "Approved Allocation"
        }
      ],
      signatures: [
        { role: "IT Admin", name: "IT Specialist", title: "IT Dept", date: "18/05/2026 11:00:00", status: "Approved" },
        { role: "HOD", name: "Tahmid Afsar", title: "Assistant Manager", date: "19/05/2026 14:30:00", status: "Approved" }
      ]
    }
  }
];
function SSPApprovalPage() {
  const [selectedReq, setSelectedReq] = reactExports.useState(null);
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [commentText, setCommentText] = reactExports.useState("");
  const [commentsHistory, setCommentsHistory] = reactExports.useState({
    "382650": [
      { user: "Md. Anik Islam", text: "Approved, eligible for casual leave.", date: "25/05/2026 10:07" }
    ]
  });
  const [approver, setApprover] = reactExports.useState("Tahmid Afsar");
  const [location, setLocation] = reactExports.useState("All Location");
  const [docType, setDocType] = reactExports.useState("All Document");
  const [statusFilter, setStatusFilter] = reactExports.useState("Approved");
  const [reqNumSearch, setReqNumSearch] = reactExports.useState("");
  const [dateType, setDateType] = reactExports.useState("Requisition Date");
  const [dateFrom, setDateFrom] = reactExports.useState("2026-03-01");
  const [dateTo, setDateTo] = reactExports.useState("2026-06-08");
  const [globalSearch, setGlobalSearch] = reactExports.useState("");
  const approverOptions = [{ value: "Tahmid Afsar", label: "Tahmid Afsar (Assistant Manager)" }];
  const locationOptions = [{ value: "All Location", label: "All Location" }, { value: "PSL-Operation", label: "PSL-Operation" }];
  const docTypeOptions = [
    { value: "All Document", label: "All Document" },
    { value: "Leave Application", label: "Leave Application" },
    { value: "ICT Product Store Requisition", label: "ICT Product Store Requisition" }
  ];
  const dateTypeOptions = [{ value: "Requisition Date", label: "Requisition Date" }, { value: "Effective Date", label: "Effective Date" }];
  const handleOpenModal = (req) => {
    setSelectedReq(req);
    setCommentText("");
    setModalOpen(true);
  };
  const handleAddComment = () => {
    if (!commentText.trim() || !selectedReq) return;
    const newComment = {
      user: "Tahmid Afsar (You)",
      text: commentText,
      date: (/* @__PURE__ */ new Date()).toLocaleString()
    };
    setCommentsHistory((prev) => ({
      ...prev,
      [selectedReq.id]: [...prev[selectedReq.id] || [], newComment]
    }));
    setCommentText("");
  };
  const totalCount = dummyRequisitions.length;
  const approvedCount = dummyRequisitions.filter((r) => r.status === "Approved").length;
  const pendingCount = dummyRequisitions.filter((r) => r.status === "Pending").length;
  const rejectedCount = dummyRequisitions.filter((r) => r.status === "Rejected").length;
  const filteredData = dummyRequisitions.filter((item) => {
    if (statusFilter !== "All" && item.status !== statusFilter) return false;
    if (docType !== "All Document" && item.document !== docType) return false;
    if (reqNumSearch && !item.reqNum.includes(reqNumSearch)) return false;
    if (globalSearch) {
      const search = globalSearch.toLowerCase();
      return item.requestor.toLowerCase().includes(search) || item.reqNum.includes(search) || item.department.toLowerCase().includes(search) || item.document.toLowerCase().includes(search);
    }
    return true;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen flex bg-[#f1f5f9] dark:bg-[#0b0f19] text-[#334155] dark:text-slate-200 overflow-hidden font-sans antialiased tracking-tight", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col p-4 xl:p-6 gap-3.5 overflow-hidden bg-slate-50/50 dark:bg-slate-950/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:text-primary transition-colors", children: "SSP" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600 dark:text-slate-300 font-semibold", children: "Approval Queue" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-1.5 rounded-full bg-slate-400 dark:bg-slate-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100", children: "SSP Requisition Approvals" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-slate-400 font-medium", children: "Review, comment on, and authorize leave applications and general requisitions." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-100 dark:border-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider", children: "Total Queue" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5", children: [
                totalCount,
                " Requests"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100 dark:border-emerald-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider", children: "Approved" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5", children: [
                approvedCount,
                " Requests"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 border border-amber-100 dark:border-amber-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider", children: "Pending" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5", children: [
                pendingCount,
                " Requests"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 border border-rose-100 dark:border-rose-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider", children: "Rejected" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5", children: [
                rejectedCount,
                " Requests"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-sm shrink-0 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-3.5 gap-y-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider", children: "Approver" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SearchableSelect,
                {
                  value: approver,
                  onChange: setApprover,
                  options: approverOptions,
                  className: "h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider", children: "Location" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SearchableSelect,
                {
                  value: location,
                  onChange: setLocation,
                  options: locationOptions,
                  className: "h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider", children: "Document" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SearchableSelect,
                {
                  value: docType,
                  onChange: setDocType,
                  options: docTypeOptions,
                  className: "h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider", children: "Date For" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SearchableSelect,
                {
                  value: dateType,
                  onChange: setDateType,
                  options: dateTypeOptions,
                  className: "h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5 xl:col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider", children: "Date Period" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "date",
                    value: dateFrom,
                    onChange: (e) => setDateFrom(e.target.value),
                    className: "h-7 px-1.5 bg-transparent border-0 text-[10px] font-bold focus:outline-none flex-1 min-w-0 text-slate-800 dark:text-slate-200"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 dark:text-slate-600 text-[9px] font-bold", children: "to" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "date",
                    value: dateTo,
                    onChange: (e) => setDateTo(e.target.value),
                    className: "h-7 px-1.5 bg-transparent border-0 text-[10px] font-bold focus:outline-none flex-1 min-w-0 text-slate-800 dark:text-slate-200"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-inner", children: ["All", "Approved", "Pending", "Rejected"].map((filter) => {
              const isActive = statusFilter === filter;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setStatusFilter(filter),
                  className: `px-2.5 py-1 text-[9px] font-bold rounded transition-all uppercase tracking-wider ${isActive ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200"}`,
                  children: filter
                },
                filter
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-2 size-3 text-slate-400 dark:text-slate-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: reqNumSearch,
                    onChange: (e) => setReqNumSearch(e.target.value),
                    placeholder: "Req Number...",
                    className: "h-7.5 pl-8 pr-3 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none text-slate-800 dark:text-slate-200"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-7.5 px-4 bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 shadow-sm cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3" }),
                " Search"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg overflow-hidden flex flex-col min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { className: "size-3.5 text-emerald-600 dark:text-emerald-400" }),
                " EXCEL"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5 text-slate-500 dark:text-slate-400" }),
                " PRINT"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3.5 text-rose-500 dark:text-rose-400" }),
                " PDF"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-48", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-2 size-3.5 text-slate-400 dark:text-slate-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: globalSearch,
                  onChange: (e) => setGlobalSearch(e.target.value),
                  placeholder: "Quick Search...",
                  className: "h-7.5 w-full pl-8.5 pr-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-slate-400 text-slate-800 dark:text-slate-200"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-50 dark:bg-slate-950", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: "Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: "ReqNum" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: "ReqDate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: "Requestor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: "ReqFrom" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: "Document" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest", children: "ReqNote" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300", children: [
              filteredData.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleOpenModal(row),
                      className: "size-7 rounded-lg bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center cursor-pointer shadow-sm",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "size-7 rounded-lg bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center cursor-pointer shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5" }) })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2 font-bold text-slate-800 dark:text-slate-100", children: row.reqNum }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2 text-slate-500 dark:text-slate-400 font-mono", children: row.date }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2 text-slate-800 dark:text-slate-200", children: row.requestor }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2 text-slate-400 dark:text-slate-500", children: row.reqFrom }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2 text-slate-500 dark:text-slate-400", children: row.department }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-xl text-[8.5px] font-extrabold uppercase border ${row.document.includes("Leave") ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900" : "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900"}`, children: row.document }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-2 text-slate-400 dark:text-slate-500 font-normal italic", children: row.note || "—" })
              ] }, row.id)),
              filteredData.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "py-8 text-center text-slate-400 dark:text-slate-500 font-bold", children: "No requisitions found matching current filters." }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "Showing 1 to ",
              filteredData.length,
              " of ",
              filteredData.length,
              " entries"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors disabled:opacity-30", disabled: true, children: "Previous" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "size-5.5 rounded bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center shadow-sm text-[9.5px]", children: "1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors disabled:opacity-30", disabled: true, children: "Next" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    selectedReq && /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: modalOpen, onOpenChange: setModalOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-lg overflow-hidden gap-0 max-h-[92vh] flex flex-col [&>button]:hidden text-slate-700 dark:text-slate-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8.5 rounded-lg bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileCheck, { className: "size-4.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[14px] font-bold text-slate-800 dark:text-slate-100 leading-tight", children: "Requisition Authorization" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider font-extrabold", children: selectedReq.document })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setModalOpen(false),
            className: "size-7.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all cursor-pointer",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-11.5 rounded-xl bg-slate-200 dark:bg-slate-900 flex items-center justify-center text-slate-600 shrink-0 border border-slate-300 dark:border-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-6 text-slate-500 dark:text-slate-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[13px] font-extrabold text-slate-800 dark:text-slate-100", children: selectedReq.requestor }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5", children: [
                selectedReq.details.designation,
                " · ",
                selectedReq.details.section
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:flex md:items-center gap-x-6 gap-y-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 border-t md:border-t-0 border-slate-200 dark:border-slate-700 pt-3 md:pt-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-slate-400 dark:text-slate-500 block uppercase tracking-wider font-extrabold", children: "Emp ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-700 dark:text-slate-200 font-extrabold", children: selectedReq.details.empId })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-slate-400 dark:text-slate-500 block uppercase tracking-wider font-extrabold", children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-700 dark:text-slate-200 font-extrabold", children: selectedReq.department })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-slate-400 dark:text-slate-500 block uppercase tracking-wider font-extrabold", children: "Ref No" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-blue-600 dark:text-blue-400 font-extrabold bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 px-1.5 py-0.5 rounded font-mono text-[10px]", children: [
                "PSL-RQ-",
                selectedReq.document.toUpperCase().includes("LEAVE") ? "LEAVE" : "ICT",
                "-",
                selectedReq.reqNum
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-1.5 rounded-full bg-slate-500" }),
              "Requisition Information"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "w-full text-xs text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 bg-slate-50/40 dark:bg-slate-950/20 text-slate-400 dark:text-slate-400 w-1/3", children: "Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 font-bold text-slate-800 dark:text-slate-100", children: selectedReq.details.type })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 bg-slate-50/40 dark:bg-slate-950/20 text-slate-400 dark:text-slate-400", children: "Category" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-slate-600 dark:text-slate-300", children: selectedReq.details.category })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 bg-slate-50/40 dark:bg-slate-950/20 text-slate-400 dark:text-slate-400", children: "Duration" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-slate-800 dark:text-slate-100 font-extrabold", children: selectedReq.details.duration })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 bg-slate-50/40 dark:bg-slate-950/20 text-slate-400 dark:text-slate-300 font-mono", children: "Contact No" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-slate-600 dark:text-slate-300 font-mono", children: selectedReq.details.contact })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 bg-slate-50/40 dark:bg-slate-950/20 text-slate-400 dark:text-slate-400", children: "Purpose" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2 text-slate-600 dark:text-slate-300 italic font-normal", children: [
                  '"',
                  selectedReq.details.purpose,
                  '"'
                ] })
              ] })
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-1.5 rounded-full bg-slate-500" }),
              "Balances & Status Breakdown"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-[#fafafa] dark:bg-slate-950/20 border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 font-bold text-[9px] uppercase tracking-wider", children: "Leave Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 font-bold text-[9px] uppercase tracking-wider", children: "Enjoyed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 font-bold text-[9px] uppercase tracking-wider", children: "Balance" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 font-bold text-[9px] uppercase tracking-wider", children: "Pay Type" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300", children: selectedReq.details.balances.map((bal, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-slate-800 dark:text-slate-200", children: bal.leaveType }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-slate-500 dark:text-slate-400", children: bal.enjoyed }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-blue-600 dark:text-blue-400 font-extrabold", children: bal.balance }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 rounded text-[9px] font-extrabold uppercase", children: bal.payType }) })
              ] }, idx)) })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-1.5 rounded-full bg-slate-500" }),
            "Approval Workflow Signature Chain"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3", children: selectedReq.details.signatures.map((sig, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `p-3 border rounded-xl flex items-start gap-2.5 relative ${sig.status === "Approved" ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-400" : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-0.5 p-1 rounded-full ${sig.status === "Approved" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[8.5px] font-black uppercase tracking-wider block mb-0.5 ${sig.status === "Approved" ? "text-emerald-600" : "text-slate-400"}`, children: sig.role }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-extrabold text-slate-800 dark:text-slate-200 leading-tight truncate", children: sig.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9.5px] text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5", children: sig.title }),
                  sig.status === "Approved" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8.5px] text-slate-400/80 dark:text-slate-500 font-mono block mt-1", children: sig.date.split(" ")[0] })
                ] })
              ]
            },
            idx
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "size-3.5 text-slate-400 dark:text-slate-500" }),
              "Add Decision Comment"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  value: commentText,
                  onChange: (e) => setCommentText(e.target.value),
                  placeholder: "Type comment or notes here...",
                  className: "w-full h-24 p-3 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-slate-400 bg-slate-50 dark:bg-slate-950 placeholder:text-slate-400/50 resize-none"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleAddComment,
                  className: "h-8 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10.5px] font-extrabold transition-all flex items-center gap-1 cursor-pointer",
                  children: "Post Note"
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-1.5 rounded-full bg-slate-500" }),
              "Comment History Log"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 p-3 h-[125px] overflow-y-auto space-y-3", children: [
              (commentsHistory[selectedReq.id] || []).map((comm, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200 p-2.5 rounded-lg shadow-sm space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[9px] font-extrabold", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-700 dark:text-slate-300", children: comm.user }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 dark:text-slate-500 font-mono", children: comm.date })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-normal", children: [
                  '"',
                  comm.text,
                  '"'
                ] })
              ] }, idx)),
              (!commentsHistory[selectedReq.id] || commentsHistory[selectedReq.id].length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs font-bold", children: "No previous comments recorded." })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-slate-400 dark:text-slate-500", children: "Click action below to execute your requisition decision status." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setModalOpen(false),
              className: "h-8.5 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setModalOpen(false),
              className: "h-8.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all shadow-3xs flex items-center gap-1 cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CornerUpRight, { className: "size-3.5" }),
                " Forward"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setModalOpen(false),
              className: "h-8.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-3xs flex items-center gap-1 cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" }),
                " Reject"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setModalOpen(false),
              className: "h-8.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-3xs flex items-center gap-1.5 cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5" }),
                " Approve"
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
const $$splitComponentImporter$M = () => import("./recruitment-ie-list-D11lVPfc.mjs");
const Route$N = createFileRoute("/recruitment-ie-list")({
  head: () => ({
    meta: [{
      title: "IE Assessment List — CRIPTON HRIS"
    }, {
      name: "description",
      content: "Candidates pending IE evaluation."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$M, "component")
});
const $$splitComponentImporter$L = () => import("./recruitment-hr-list-BsdjgqVr.mjs");
const Route$M = createFileRoute("/recruitment-hr-list")({
  head: () => ({
    meta: [{
      title: "HR Assessment List — CRIPTON HRIS"
    }, {
      name: "description",
      content: "List of candidates pending HR evaluation."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$L, "component")
});
const $$splitComponentImporter$K = () => import("./recruitment-configuration-g9dDQsHD.mjs");
const Route$L = createFileRoute("/recruitment-configuration")({
  component: lazyRouteComponent($$splitComponentImporter$K, "component")
});
const DATA_VERSION = "v6";
const initializeRecruitmentMockData = (forceReset = false) => {
  if (typeof window === "undefined") return;
  const versionKey = "recruitment_data_version";
  const storedVersion = localStorage.getItem(versionKey);
  if (!forceReset && storedVersion === DATA_VERSION) return;
  const keysToReset = [
    "recruitment_config_operations",
    "recruitment_config_machines",
    "recruitment_config_op_grades",
    "recruitment_config_measurements",
    "recruitment_config_smv_bank",
    "recruitment_config_eff_grades",
    "recruitment_config_grade_vs_grade",
    "recruitment_config_multi_ss_v2",
    "recruitment_candidates"
  ];
  keysToReset.forEach((k) => localStorage.removeItem(k));
  const set = (key, data) => localStorage.setItem(key, JSON.stringify(data));
  set("recruitment_config_operations", [
    { id: "1", opName: "Attach Neck Rib - Tube, No Fold", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "2", opName: "Attach Back Rise", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "3", opName: "Side Seam", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "4", opName: "Sleeve Hem", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "5", opName: "Bottom Hem", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "6", opName: "Collar Join", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "7", opName: "Placket Making", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "8", opName: "Cuff Attach", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "9", opName: "Armhole Join", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "10", opName: "Label Attach", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "11", opName: "Shoulder Join", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "12", opName: "Pocket Attach", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" }
  ]);
  set("recruitment_config_machines", [
    { id: "1", mcFullName: "Single Needle Lock Stitch", mcName: "SNLS", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "2", mcFullName: "Overlock 4 Thread", mcName: "OL-4TH", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "3", mcFullName: "Overlock 5 Thread", mcName: "OL-5TH", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "4", mcFullName: "Flat Lock 3 Thread", mcName: "FL-3TH", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "5", mcFullName: "Button Hole Machine", mcName: "BH", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "6", mcFullName: "Button Attach Machine", mcName: "BA", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "7", mcFullName: "Bar Tack Machine", mcName: "BT", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "8", mcFullName: "Feed Off The Arm", mcName: "FOTA", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "9", mcFullName: "Kansai Special Waistband", mcName: "KS", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "10", mcFullName: "Snap Button Attach", mcName: "SBA", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "11", mcFullName: "Linking Machine", mcName: "LM", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "12", mcFullName: "Safety Stitch Machine", mcName: "SS", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" }
  ]);
  set("recruitment_config_op_grades", [
    { id: "1", grade: "P", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "2", grade: "P1", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "3", grade: "A+", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "4", grade: "A", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "5", grade: "A-", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "6", grade: "B+", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "7", grade: "B", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "8", grade: "B-", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "9", grade: "C+", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "10", grade: "C", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "11", grade: "C-", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "12", grade: "H", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" }
  ]);
  set("recruitment_config_measurements", [
    { id: "1", name: "44 CM", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "2", name: "12 CM", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "3", name: "14 CM", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "4", name: "32 CM", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "5", name: "20 CM", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "6", name: "38 CM", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "7", name: "50 CM", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "8", name: "24 CM", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "9", name: "10 CM", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "10", name: "18 CM", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "11", name: "28 CM", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "12", name: "36 CM", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" }
  ]);
  set("recruitment_config_smv_bank", [
    { id: "1", opName: "Attach Neck Rib - Tube, No Fold", mcName: "OL-4TH", opGrade: "P", meas: "44 CM", smvValue: "0.26", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "2", opName: "Attach Back Rise", mcName: "SNLS", opGrade: "P1", meas: "12 CM", smvValue: "0.30", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "3", opName: "Side Seam", mcName: "OL-5TH", opGrade: "A", meas: "32 CM", smvValue: "0.45", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "4", opName: "Sleeve Hem", mcName: "FL-3TH", opGrade: "B", meas: "14 CM", smvValue: "0.35", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "5", opName: "Bottom Hem", mcName: "FL-3TH", opGrade: "B", meas: "38 CM", smvValue: "0.40", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "6", opName: "Collar Join", mcName: "SNLS", opGrade: "A+", meas: "20 CM", smvValue: "0.55", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "7", opName: "Placket Making", mcName: "SNLS", opGrade: "A", meas: "18 CM", smvValue: "0.60", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "8", opName: "Cuff Attach", mcName: "OL-4TH", opGrade: "C", meas: "10 CM", smvValue: "0.25", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "9", opName: "Armhole Join", mcName: "OL-5TH", opGrade: "B+", meas: "24 CM", smvValue: "0.42", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "10", opName: "Label Attach", mcName: "SNLS", opGrade: "C-", meas: "12 CM", smvValue: "0.15", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "11", opName: "Shoulder Join", mcName: "OL-4TH", opGrade: "P", meas: "28 CM", smvValue: "0.32", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "12", opName: "Pocket Attach", mcName: "SNLS", opGrade: "B-", meas: "36 CM", smvValue: "0.38", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" }
  ]);
  set("recruitment_config_eff_grades", [
    { id: "1", effFrom: "0.00", effTo: "39.99", point: "0.00", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "2", effFrom: "40.00", effTo: "49.99", point: "1.00", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "3", effFrom: "50.00", effTo: "59.99", point: "2.00", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "4", effFrom: "60.00", effTo: "69.99", point: "3.00", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "5", effFrom: "70.00", effTo: "79.99", point: "4.00", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "6", effFrom: "80.00", effTo: "89.99", point: "4.50", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "7", effFrom: "90.00", effTo: "100.00", point: "5.00", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "8", effFrom: "100.01", effTo: "110.00", point: "5.50", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "9", effFrom: "110.01", effTo: "120.00", point: "6.00", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "10", effFrom: "120.01", effTo: "200.00", point: "7.00", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" }
  ]);
  set("recruitment_config_grade_vs_grade", [
    { id: "1", pointFrom: "0.00", pointTo: "1.99", grade: "H", salaryFrom: "12500", salaryTo: "12500", govtGrade: "Grade-4", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Hold" },
    { id: "2", pointFrom: "2.00", pointTo: "2.99", grade: "C", salaryFrom: "13000", salaryTo: "13500", govtGrade: "Grade-4", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" },
    { id: "3", pointFrom: "3.00", pointTo: "3.49", grade: "C+", salaryFrom: "13501", salaryTo: "14000", govtGrade: "Grade-3", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" },
    { id: "4", pointFrom: "3.50", pointTo: "3.99", grade: "B-", salaryFrom: "14001", salaryTo: "14200", govtGrade: "Grade-3", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" },
    { id: "5", pointFrom: "4.00", pointTo: "4.49", grade: "B", salaryFrom: "14201", salaryTo: "14500", govtGrade: "Grade-3", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" },
    { id: "6", pointFrom: "4.50", pointTo: "4.99", grade: "B+", salaryFrom: "14501", salaryTo: "15000", govtGrade: "Grade-2", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" },
    { id: "7", pointFrom: "5.00", pointTo: "5.49", grade: "A-", salaryFrom: "15001", salaryTo: "15500", govtGrade: "Grade-2", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" },
    { id: "8", pointFrom: "5.50", pointTo: "5.99", grade: "A", salaryFrom: "15501", salaryTo: "16000", govtGrade: "Grade-1", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" },
    { id: "9", pointFrom: "6.00", pointTo: "6.99", grade: "A+", salaryFrom: "16001", salaryTo: "17000", govtGrade: "Grade-1", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" },
    { id: "10", pointFrom: "7.00", pointTo: "10.00", grade: "Special", salaryFrom: "17001", salaryTo: "20000", govtGrade: "Grade-1", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" }
  ]);
  set("recruitment_config_multi_ss_v2", [
    { id: "1", point: "5.00", opGrade: "P", minOpCount: "2", mcType: "Different", eff: "90", addAmt: "500", validityRemarks: "Current", remarks: "Multi Task", validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "2", point: "5.00", opGrade: "P1", minOpCount: "1,1", mcType: "Same", eff: "90", addAmt: "500", validityRemarks: "Current", remarks: "Special SS", validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "3", point: "4.50", opGrade: "P", minOpCount: "2", mcType: "Same", eff: "85", addAmt: "300", validityRemarks: "Current", remarks: "Multi L2", validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "4", point: "4.00", opGrade: "C", minOpCount: "3", mcType: "Different", eff: "80", addAmt: "400", validityRemarks: "Current", remarks: "Multi L3", validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "5", point: "6.00", opGrade: "A", minOpCount: "2", mcType: "Different", eff: "95", addAmt: "800", validityRemarks: "Current", remarks: "Expert Multi", validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "6", point: "3.50", opGrade: "C+", minOpCount: "2", mcType: "Same", eff: "75", addAmt: "200", validityRemarks: "Current", remarks: "Basic Multi", validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "7", point: "5.50", opGrade: "A-", minOpCount: "3", mcType: "Different", eff: "90", addAmt: "600", validityRemarks: "Current", remarks: "Pro Multi", validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "8", point: "4.80", opGrade: "B+", minOpCount: "2", mcType: "Different", eff: "88", addAmt: "450", validityRemarks: "Current", remarks: "Adv Multi", validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "9", point: "6.50", opGrade: "A+", minOpCount: "4", mcType: "Different", eff: "100", addAmt: "1000", validityRemarks: "Current", remarks: "Master Multi", validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "10", point: "3.00", opGrade: "C-", minOpCount: "2", mcType: "Same", eff: "70", addAmt: "100", validityRemarks: "Current", remarks: "Trainee Multi", validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" }
  ]);
  set("recruitment_candidates", [
    {
      empIdTemp: "PAL000001",
      nameEng: "Md. Karim Hossain",
      nameBng: "মোঃ করিম হোসেন",
      employeeType: "Worker",
      department: "RMG Operation",
      section: "Sewing",
      designation: "Operator",
      unit: "Unit-6",
      line: "52",
      doj: "2026-08-16",
      dob: "1994-04-15",
      personalContact: "01634846914",
      personalEmail: "karim.hossain@example.com",
      religion: "Islam",
      maritalStatus: "Married",
      nidNumber: "5534893420",
      birthReg: "1994261548002341",
      fatherNameEng: "Md. Abdul Latif",
      fatherNameBng: "মোঃ আব্দুল লতিফ",
      motherNameEng: "Mst. Kulsum Begum",
      motherNameBng: "মোসাঃ কুলসুম বেগম",
      emergencyContact: "01711223344",
      contactPerson: "Md. Abdul Latif",
      relationship: "Father",
      presentAddress: "House: 12, Road: 4, Sector: 11, Uttara, Dhaka, Bangladesh",
      permanentAddress: "Village: Ramnagar, PO: Ramnagar, Thana: Hathazari, District: Chattogram, Bangladesh",
      academics: [
        { id: "1", title: "SSC (Vocational)", institution: "Gazipur High School", year: "2010", result: "GPA 4.50" },
        { id: "2", title: "Trade Certificate in Sewing", institution: "VTI Gazipur", year: "2012", result: "First Class" }
      ],
      experiences: [
        { id: "1", company: "Ananta Garments Ltd", designation: "Junior Operator", from: "2013-01-10", to: "2016-12-15", reason: "Salary Increment & Better Career Prospects" },
        { id: "2", company: "Standard Group Ltd", designation: "Sewing Operator", from: "2017-02-01", to: "2025-05-30", reason: "Relocated closer to home address" }
      ],
      nominee: {
        name: "Mst. Salma Khatun",
        relation: "Wife",
        nidReg: "8893482341",
        contact: "01999888777"
      },
      assessStatus: "IE Pending",
      grade: ""
    },
    {
      empIdTemp: "PAL000002",
      nameEng: "Fatema Begum",
      nameBng: "ফাতেমা বেগম",
      employeeType: "Worker",
      department: "RMG Operation",
      section: "Cutting",
      designation: "Cutter",
      unit: "Unit-6",
      line: "12",
      doj: "2026-08-17",
      dob: "1995-05-10",
      personalContact: "01700000001",
      personalEmail: "fatema.begum@example.com",
      religion: "Islam",
      maritalStatus: "Single",
      nidNumber: "3489234120",
      birthReg: "1995261548002999",
      fatherNameEng: "Md. Abul Hossain",
      fatherNameBng: "মোঃ আবুল হোসেন",
      motherNameEng: "Mst. Rehana Begum",
      motherNameBng: "মোসাঃ রেহানা বেগম",
      emergencyContact: "01811223344",
      contactPerson: "Md. Abul Hossain",
      relationship: "Father",
      presentAddress: "House: 45, Road: 1, Block: A, Tongi, Gazipur, Bangladesh",
      permanentAddress: "Village: Tongi Bazar, PO: Tongi, Thana: Gazipur Sadar, District: Gazipur, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Tongi Girls High School", year: "2011", result: "GPA 3.80" }
      ],
      experiences: [
        { id: "1", company: "Ha-Meem Group", designation: "Helper (Cutting)", from: "2014-06-01", to: "2018-08-15", reason: "Promoted to Cutter in other factory" }
      ],
      nominee: {
        name: "Md. Abul Hossain",
        relation: "Father",
        nidReg: "3489234120",
        contact: "01811223344"
      },
      assessStatus: "HR Approved",
      grade: "B"
    },
    {
      empIdTemp: "PAL000003",
      nameEng: "Md. Rakibul Islam",
      nameBng: "মোঃ রাকিবুল ইসলাম",
      employeeType: "Staff",
      department: "Quality Control",
      section: "Inspection",
      designation: "QC Inspector",
      unit: "Unit-6",
      line: "QC1",
      doj: "2026-08-18",
      dob: "1992-02-20",
      personalContact: "01800000002",
      personalEmail: "rakibul.qc@example.com",
      religion: "Islam",
      maritalStatus: "Married",
      nidNumber: "4589234122",
      birthReg: "1992261548002888",
      fatherNameEng: "Md. Altaf Ali",
      fatherNameBng: "মোঃ আলতাফ আলী",
      motherNameEng: "Mst. Shahnaz Parvin",
      motherNameBng: "মোসাঃ শাহনাজ পারভীন",
      emergencyContact: "01911223344",
      contactPerson: "Mst. Shahnaz Parvin",
      relationship: "Mother",
      presentAddress: "House: 3, Road: 14, Sector: 4, Uttara, Dhaka, Bangladesh",
      permanentAddress: "Village: Joydebpur, PO: Joydebpur, Thana: Gazipur Sadar, District: Gazipur, Bangladesh",
      academics: [
        { id: "1", title: "HSC", institution: "Joydebpur Govt College", year: "2010", result: "GPA 4.00" },
        { id: "2", title: "Diploma in textile", institution: "Dhaka Polytechnic", year: "2014", result: "GPA 3.65" }
      ],
      experiences: [
        { id: "1", company: "DBL Group Ltd", designation: "Quality Assistant", from: "2015-05-10", to: "2020-04-12", reason: "Joined as Inspector elsewhere" },
        { id: "2", company: "Pacific Jeans Ltd", designation: "QC Inspector", from: "2020-06-01", to: "2025-12-30", reason: "Personal relocation" }
      ],
      nominee: {
        name: "Mst. Lima Akter",
        relation: "Wife",
        nidReg: "9903482344",
        contact: "01999777666"
      },
      assessStatus: "HR Pending",
      grade: ""
    },
    {
      empIdTemp: "PAL000004",
      nameEng: "Rahima Khatun",
      nameBng: "রাহিমা খাতুন",
      employeeType: "Worker",
      department: "RMG Operation",
      section: "Finishing",
      designation: "Iron Man",
      unit: "Unit-6",
      line: "F-1",
      doj: "2026-08-19",
      dob: "1990-12-05",
      personalContact: "01900000003",
      personalEmail: "rahima.khatun@example.com",
      religion: "Islam",
      maritalStatus: "Married",
      nidNumber: "4189234123",
      birthReg: "1990261548002777",
      fatherNameEng: "Md. Sofiullah",
      fatherNameBng: "মোঃ সফিউল্লাহ",
      motherNameEng: "Mst. Razia Begum",
      motherNameBng: "মোসাঃ রাজিয়া বেগম",
      emergencyContact: "01511223344",
      contactPerson: "Md. Sofiullah",
      relationship: "Father",
      presentAddress: "House: 15, Road: 2, Block: C, Mirpur-1, Dhaka, Bangladesh",
      permanentAddress: "Village: Mirpur, PO: Mirpur, Thana: Mirpur, District: Dhaka, Bangladesh",
      academics: [
        { id: "1", title: "Class 8 Pass", institution: "Mirpur Primary School", year: "2005", result: "Pass" }
      ],
      experiences: [
        { id: "1", company: "Palmal Group", designation: "Iron helper", from: "2008-01-01", to: "2015-12-31", reason: "Promoted to Iron Man" }
      ],
      nominee: {
        name: "Md. Kamal Hossain",
        relation: "Husband",
        nidReg: "8893482348",
        contact: "01511223344"
      },
      assessStatus: "IE Pending",
      grade: ""
    },
    {
      empIdTemp: "PAL000005",
      nameEng: "Md. Sohel Rana",
      nameBng: "মোঃ সোহেল রানা",
      employeeType: "Worker",
      department: "RMG Operation",
      section: "Sewing",
      designation: "Operator",
      unit: "Unit-6",
      line: "53",
      doj: "2026-08-20",
      dob: "1996-07-22",
      personalContact: "01500000004",
      personalEmail: "sohel.rana@example.com",
      religion: "Islam",
      maritalStatus: "Single",
      nidNumber: "5189234124",
      birthReg: "1996261548002666",
      fatherNameEng: "Md. Akbar Ali",
      fatherNameBng: "মোঃ আকবর আলী",
      motherNameEng: "Mst. Morjina Begum",
      motherNameBng: "মোসাঃ মর্জিনা বেগম",
      emergencyContact: "01611223344",
      contactPerson: "Md. Akbar Ali",
      relationship: "Father",
      presentAddress: "House: 8, Road: 5, Sector: 6, Uttara, Dhaka, Bangladesh",
      permanentAddress: "Village: Sreepur, PO: Sreepur, Thana: Sreepur, District: Gazipur, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Sreepur Pilot High School", year: "2012", result: "GPA 3.50" }
      ],
      experiences: [
        { id: "1", company: "Epyllion Group", designation: "Junior Operator", from: "2014-03-01", to: "2020-08-30", reason: "Career growth" }
      ],
      nominee: {
        name: "Mst. Morjina Begum",
        relation: "Mother",
        nidReg: "5189234124",
        contact: "01611223344"
      },
      assessStatus: "HR Rejected",
      grade: ""
    },
    {
      empIdTemp: "PAL000006",
      nameEng: "Roksana Akhter",
      nameBng: "রোকসানা আক্তার",
      employeeType: "Worker",
      department: "RMG Operation",
      section: "Sewing",
      designation: "Helper",
      unit: "Unit-6",
      line: "54",
      doj: "2026-08-21",
      dob: "1998-03-11",
      personalContact: "01600000005",
      personalEmail: "roksana.helper@example.com",
      religion: "Islam",
      maritalStatus: "Single",
      nidNumber: "6189234125",
      birthReg: "1998261548002555",
      fatherNameEng: "Md. Abdur Rahim",
      fatherNameBng: "মোঃ আব্দুর রহিম",
      motherNameEng: "Mst. Rahima Begum",
      motherNameBng: "মোসাঃ রহিমা বেগম",
      emergencyContact: "01711223345",
      contactPerson: "Md. Abdur Rahim",
      relationship: "Father",
      presentAddress: "House: 20, Road: 3, Block: B, Tongi, Gazipur, Bangladesh",
      permanentAddress: "Village: Tongi, PO: Tongi, Thana: Gazipur, District: Gazipur, Bangladesh",
      academics: [
        { id: "1", title: "Class 8 Pass", institution: "Tongi Primary School", year: "2013", result: "Pass" }
      ],
      experiences: [
        { id: "1", company: "Viyellatex Group", designation: "Helper", from: "2018-05-15", to: "2024-04-10", reason: "Salary issue" }
      ],
      nominee: {
        name: "Mst. Rahima Begum",
        relation: "Mother",
        nidReg: "6189234125",
        contact: "01711223345"
      },
      assessStatus: "IE Pending",
      grade: ""
    },
    {
      empIdTemp: "PAL000007",
      nameEng: "Md. Jahangir Alam",
      nameBng: "মোঃ জাহাঙ্গীর আলম",
      employeeType: "Worker",
      department: "RMG Operation",
      section: "Sewing",
      designation: "Operator",
      unit: "Unit-6",
      line: "55",
      doj: "2026-08-22",
      dob: "1993-09-30",
      personalContact: "01700000006",
      personalEmail: "jahangir.operator@example.com",
      religion: "Islam",
      maritalStatus: "Married",
      nidNumber: "7189234126",
      birthReg: "1993261548002444",
      fatherNameEng: "Md. Mofiz Uddin",
      fatherNameBng: "মোঃ মফিজ উদ্দিন",
      motherNameEng: "Mst. Sakhina Khatun",
      motherNameBng: "মোসাঃ সখিনা খাতুন",
      emergencyContact: "01811223346",
      contactPerson: "Mst. Sakhina Khatun",
      relationship: "Mother",
      presentAddress: "House: 11, Road: 1, Block: D, Savar, Dhaka, Bangladesh",
      permanentAddress: "Village: Savar, PO: Savar, Thana: Savar, District: Dhaka, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Savar High School", year: "2009", result: "GPA 3.90" }
      ],
      experiences: [
        { id: "1", company: "Dekko Group", designation: "Junior Operator", from: "2010-06-01", to: "2015-12-30", reason: "Better Salary" },
        { id: "2", company: "Sterling Group", designation: "Sewing Operator", from: "2016-01-05", to: "2024-08-15", reason: "Relocation" }
      ],
      nominee: {
        name: "Mst. Kohinoor Begum",
        relation: "Wife",
        nidReg: "7189234126",
        contact: "01811223346"
      },
      assessStatus: "HR Approved",
      grade: "A-"
    },
    {
      empIdTemp: "PAL000008",
      nameEng: "Nasrin Sultana",
      nameBng: "নাসরিন সুলতানা",
      employeeType: "Worker",
      department: "RMG Operation",
      section: "Finishing",
      designation: "Folder",
      unit: "Unit-6",
      line: "F-2",
      doj: "2026-08-23",
      dob: "1997-01-14",
      personalContact: "01800000007",
      personalEmail: "nasrin.folder@example.com",
      religion: "Islam",
      maritalStatus: "Single",
      nidNumber: "8189234127",
      birthReg: "1997261548002333",
      fatherNameEng: "Md. Sirajul Islam",
      fatherNameBng: "মোঃ সিরাজুল ইসলাম",
      motherNameEng: "Mst. Rokeya Begum",
      motherNameBng: "মোসাঃ রোকেয়া বেগম",
      emergencyContact: "01911223347",
      contactPerson: "Md. Sirajul Islam",
      relationship: "Father",
      presentAddress: "House: 31, Road: 8, Sector: 10, Uttara, Dhaka, Bangladesh",
      permanentAddress: "Village: Uttara, PO: Uttara, Thana: Uttara, District: Dhaka, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Uttara Girls High School", year: "2013", result: "GPA 3.40" }
      ],
      experiences: [
        { id: "1", company: "Hamid Fabrics", designation: "Helper", from: "2015-02-10", to: "2020-11-20", reason: "Salary Increment" }
      ],
      nominee: {
        name: "Md. Sirajul Islam",
        relation: "Father",
        nidReg: "8189234127",
        contact: "01911223347"
      },
      assessStatus: "IE Pending",
      grade: ""
    },
    {
      empIdTemp: "PAL000009",
      nameEng: "Md. Abul Kashem",
      nameBng: "মোঃ আবুল কাশেম",
      employeeType: "Worker",
      department: "RMG Operation",
      section: "Cutting",
      designation: "Spreader",
      unit: "Unit-6",
      line: "13",
      doj: "2026-08-24",
      dob: "1991-11-08",
      personalContact: "01900000008",
      personalEmail: "kashem.cutter@example.com",
      religion: "Islam",
      maritalStatus: "Married",
      nidNumber: "9189234128",
      birthReg: "1991261548002222",
      fatherNameEng: "Md. Nurul Islam",
      fatherNameBng: "মোঃ নুরুল ইসলাম",
      motherNameEng: "Mst. Fatema Khatun",
      motherNameBng: "মোসাঃ ফাতেমা খাতুন",
      emergencyContact: "01511223348",
      contactPerson: "Mst. Fatema Khatun",
      relationship: "Mother",
      presentAddress: "House: 6, Road: 2, Block: E, Tongi, Gazipur, Bangladesh",
      permanentAddress: "Village: Tongi Bazar, PO: Tongi, Thana: Gazipur, District: Gazipur, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Tongi High School", year: "2007", result: "GPA 3.20" }
      ],
      experiences: [
        { id: "1", company: "Mohammadi Group", designation: "Helper (Cutting)", from: "2008-05-12", to: "2016-04-18", reason: "Promoted to Spreader" }
      ],
      nominee: {
        name: "Mst. Sabina Akter",
        relation: "Wife",
        nidReg: "9189234128",
        contact: "01511223348"
      },
      assessStatus: "HR Pending",
      grade: ""
    },
    {
      empIdTemp: "PAL000010",
      nameEng: "Mariam Akter",
      nameBng: "মরিয়ম আক্তার",
      employeeType: "Worker",
      department: "RMG Operation",
      section: "Sewing",
      designation: "Operator",
      unit: "Unit-6",
      line: "56",
      doj: "2026-08-25",
      dob: "1999-06-19",
      personalContact: "01500000009",
      personalEmail: "mariam.sewing@example.com",
      religion: "Islam",
      maritalStatus: "Single",
      nidNumber: "1289234129",
      birthReg: "1999261548002111",
      fatherNameEng: "Md. Lokman Hakim",
      fatherNameBng: "মোঃ লোকমান হাকিম",
      motherNameEng: "Mst. Amena Begum",
      motherNameBng: "মোসাঃ আমেনা বেগম",
      emergencyContact: "01611223349",
      contactPerson: "Md. Lokman Hakim",
      relationship: "Father",
      presentAddress: "House: 4, Road: 7, Sector: 3, Uttara, Dhaka, Bangladesh",
      permanentAddress: "Village: Uttara, PO: Uttara, Thana: Uttara, District: Dhaka, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Uttara Model School", year: "2015", result: "GPA 4.10" }
      ],
      experiences: [
        { id: "1", company: "Dysin Group", designation: "Helper", from: "2016-07-01", to: "2021-12-30", reason: "Promoted to Operator" }
      ],
      nominee: {
        name: "Md. Lokman Hakim",
        relation: "Father",
        nidReg: "1289234129",
        contact: "01611223349"
      },
      assessStatus: "IE Pending",
      grade: ""
    },
    {
      empIdTemp: "PAL000011",
      nameEng: "Md. Saiful Islam",
      nameBng: "মোঃ সাইফুল ইসলাম",
      employeeType: "Worker",
      department: "RMG Operation",
      section: "Sewing",
      designation: "Operator",
      unit: "Unit-6",
      line: "57",
      doj: "2026-08-26",
      dob: "1994-08-25",
      personalContact: "01600000010",
      personalEmail: "saiful.operator@example.com",
      religion: "Islam",
      maritalStatus: "Married",
      nidNumber: "2289234130",
      birthReg: "1994261548002000",
      fatherNameEng: "Md. Shamsul Alam",
      fatherNameBng: "মোঃ শামসুল আলম",
      motherNameEng: "Mst. Jahanara Begum",
      motherNameBng: "মোসাঃ জাহানারা বেগম",
      emergencyContact: "01711223350",
      contactPerson: "Mst. Jahanara Begum",
      relationship: "Mother",
      presentAddress: "House: 18, Road: 4, Savar, Dhaka, Bangladesh",
      permanentAddress: "Village: Savar, PO: Savar, Thana: Savar, District: Dhaka, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Savar Pilot School", year: "2010", result: "GPA 3.60" }
      ],
      experiences: [
        { id: "1", company: "Fakir Apparels", designation: "Junior Operator", from: "2011-01-15", to: "2018-09-30", reason: "Better prospects" }
      ],
      nominee: {
        name: "Mst. Rina Akter",
        relation: "Wife",
        nidReg: "2289234130",
        contact: "01711223350"
      },
      assessStatus: "HR Approved",
      grade: "C+"
    },
    {
      empIdTemp: "PAL000012",
      nameEng: "Halima Begum",
      nameBng: "হালিমা বেগম",
      employeeType: "Worker",
      department: "RMG Operation",
      section: "Sewing",
      designation: "Helper",
      unit: "Unit-6",
      line: "58",
      doj: "2026-08-27",
      dob: "1996-02-14",
      personalContact: "01700000011",
      personalEmail: "halima.helper@example.com",
      religion: "Islam",
      maritalStatus: "Single",
      nidNumber: "3289234131",
      birthReg: "1996261548001999",
      fatherNameEng: "Md. Hanif Ali",
      fatherNameBng: "মোঃ হানিফ আলী",
      motherNameEng: "Mst. Sahida Begum",
      motherNameBng: "মোসাঃ শাহিদা বেগম",
      emergencyContact: "01811223351",
      contactPerson: "Md. Hanif Ali",
      relationship: "Father",
      presentAddress: "House: 22, Road: 2, Block: F, Tongi, Gazipur, Bangladesh",
      permanentAddress: "Village: Tongi, PO: Tongi, Thana: Gazipur, District: Gazipur, Bangladesh",
      academics: [
        { id: "1", title: "Class 8 Pass", institution: "Tongi Girls School", year: "2011", result: "Pass" }
      ],
      experiences: [
        { id: "1", company: "Nassa Group", designation: "Helper", from: "2013-05-10", to: "2020-03-12", reason: "Personal problem" }
      ],
      nominee: {
        name: "Md. Hanif Ali",
        relation: "Father",
        nidReg: "3289234131",
        contact: "01811223351"
      },
      assessStatus: "IE Pending",
      grade: ""
    },
    {
      empIdTemp: "PAL000013",
      nameEng: "Md. Nur Islam",
      nameBng: "মোঃ নুর ইসলাম",
      employeeType: "Worker",
      department: "RMG Operation",
      section: "Finishing",
      designation: "Poly Man",
      unit: "Unit-6",
      line: "F-3",
      doj: "2026-08-28",
      dob: "1995-10-02",
      personalContact: "01800000012",
      personalEmail: "nur.finishing@example.com",
      religion: "Islam",
      maritalStatus: "Single",
      nidNumber: "4289234132",
      birthReg: "1995261548001888",
      fatherNameEng: "Md. Mozammel Hoque",
      fatherNameBng: "মোঃ মোজাম্মেল হক",
      motherNameEng: "Mst. Morjina Khatun",
      motherNameBng: "মোসাঃ মর্জিনা খাতুন",
      emergencyContact: "01911223352",
      contactPerson: "Md. Mozammel Hoque",
      relationship: "Father",
      presentAddress: "House: 14, Road: 5, Sector: 9, Uttara, Dhaka, Bangladesh",
      permanentAddress: "Village: Uttara, PO: Uttara, Thana: Uttara, District: Dhaka, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Uttara High School", year: "2011", result: "GPA 3.45" }
      ],
      experiences: [
        { id: "1", company: "Hameem Group", designation: "Poly Helper", from: "2012-08-01", to: "2019-12-30", reason: "Promoted to Poly Man" }
      ],
      nominee: {
        name: "Md. Mozammel Hoque",
        relation: "Father",
        nidReg: "4289234132",
        contact: "01911223352"
      },
      assessStatus: "HR Pending",
      grade: ""
    },
    {
      empIdTemp: "PAL000014",
      nameEng: "Shirin Akter",
      nameBng: "শিরিন আক্তার",
      employeeType: "Worker",
      department: "RMG Operation",
      section: "Sewing",
      designation: "Operator",
      unit: "Unit-6",
      line: "59",
      doj: "2026-08-29",
      dob: "1992-05-18",
      personalContact: "01900000013",
      personalEmail: "shirin.sewing@example.com",
      religion: "Islam",
      maritalStatus: "Married",
      nidNumber: "5289234133",
      birthReg: "1992261548001777",
      fatherNameEng: "Md. Abul Kalam",
      fatherNameBng: "মোঃ আবুল কালাম",
      motherNameEng: "Mst. Fatema Begum",
      motherNameBng: "মোসাঃ ফাতেমা বেগম",
      emergencyContact: "01511223353",
      contactPerson: "Md. Abul Kalam",
      relationship: "Father",
      presentAddress: "House: 25, Road: 1, Savar, Dhaka, Bangladesh",
      permanentAddress: "Village: Savar, PO: Savar, Thana: Savar, District: Dhaka, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Savar Govt School", year: "2008", result: "GPA 3.80" }
      ],
      experiences: [
        { id: "1", company: "Interstop Apparels", designation: "Operator", from: "2010-04-10", to: "2021-08-15", reason: "Family issues" }
      ],
      nominee: {
        name: "Md. Rafiqul Islam",
        relation: "Husband",
        nidReg: "5289234133",
        contact: "01511223353"
      },
      assessStatus: "IE Pending",
      grade: ""
    },
    {
      empIdTemp: "PAL000015",
      nameEng: "Md. Shahidullah",
      nameBng: "মোঃ শহীদুল্লাহ",
      employeeType: "Worker",
      department: "RMG Operation",
      section: "Cutting",
      designation: "Numbering Man",
      unit: "Unit-6",
      line: "14",
      doj: "2026-08-30",
      dob: "1998-12-09",
      personalContact: "01500000014",
      personalEmail: "shahid.cutter@example.com",
      religion: "Islam",
      maritalStatus: "Single",
      nidNumber: "6289234134",
      birthReg: "1998261548001666",
      fatherNameEng: "Md. Abdus Sobhan",
      fatherNameBng: "মোঃ আব্দুস সোবহান",
      motherNameEng: "Mst. Laila Begum",
      motherNameBng: "মোসাঃ লায়লা বেগম",
      emergencyContact: "01611223354",
      contactPerson: "Md. Abdus Sobhan",
      relationship: "Father",
      presentAddress: "House: 16, Road: 3, Block: G, Tongi, Gazipur, Bangladesh",
      permanentAddress: "Village: Tongi Bazar, PO: Tongi, Thana: Gazipur, District: Gazipur, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Tongi Pilot High School", year: "2014", result: "GPA 3.95" }
      ],
      experiences: [
        { id: "1", company: "Ha-Meem Group", designation: "Cutting Helper", from: "2015-06-01", to: "2022-12-15", reason: "Promoted to Numbering Man" }
      ],
      nominee: {
        name: "Md. Abdus Sobhan",
        relation: "Father",
        nidReg: "6289234134",
        contact: "01611223354"
      },
      assessStatus: "HR Approved",
      grade: "B+"
    }
  ]);
  localStorage.setItem(versionKey, DATA_VERSION);
};
if (typeof window !== "undefined") {
  window.__resetRecruitmentData = () => {
    initializeRecruitmentMockData(true);
    window.location.reload();
  };
}
const Route$K = createFileRoute("/recruitment-basic-setup")({
  component: RecruitmentBasicSetup
});
function RecruitmentBasicSetup() {
  const [basicFormApplicable, setBasicFormApplicable] = reactExports.useState("Yes");
  const [assessmentApplicable, setAssessmentApplicable] = reactExports.useState("Yes");
  const [allowance, setAllowance] = reactExports.useState("15");
  const [tempIdBasedOn, setTempIdBasedOn] = reactExports.useState("Organization Short Name");
  const [tempIdDigit, setTempIdDigit] = reactExports.useState("00000");
  const [tempIdStartingDigit, setTempIdStartingDigit] = reactExports.useState("1");
  const [empType, setEmpType] = reactExports.useState(["Worker"]);
  const [saved, setSaved] = reactExports.useState(false);
  reactExports.useEffect(() => {
    initializeRecruitmentMockData();
  }, []);
  const handleSubmit = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3e3);
  };
  const isTempIdVisible = basicFormApplicable === "Yes";
  const handleToggleEmpType = (type) => {
    if (empType.includes(type)) {
      setEmpType(empType.filter((t) => t !== type));
    } else {
      setEmpType([...empType, type]);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0 flex flex-col relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-colors", children: "Home" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "IE Recruitment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-black", children: "Organization Setting" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-black text-foreground tracking-tight flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "size-5.5 text-primary animate-pulse" }),
              "Organization Recruitment Configuration"
            ] })
          ] }),
          saved && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl px-4 py-2 text-sm font-bold animate-pulse", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "size-4" }),
            " Settings updated successfully!"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersVertical, { className: "size-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-bold text-foreground/70 uppercase tracking-widest", children: "Workflow Applicability" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-black text-foreground uppercase tracking-wider", children: "Basic Form Applicability" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Controls mandatory fields" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: ["Yes", "No"].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => setBasicFormApplicable(v),
                    className: `flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-bold transition-all duration-200
                          ${basicFormApplicable === v ? "bg-primary/10 border-primary text-primary shadow-2xs" : "border-border/80 bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-3 rounded-full border flex items-center justify-center ${basicFormApplicable === v ? "border-primary bg-primary" : "border-muted-foreground/30"}`, children: basicFormApplicable === v && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1 bg-background rounded-full" }) }),
                      v,
                      " Form"
                    ]
                  },
                  v
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-black text-foreground uppercase tracking-wider", children: "Assessment Requirements" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "IE & HR evaluation steps" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: ["Yes", "No"].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => setAssessmentApplicable(v),
                    className: `flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-bold transition-all duration-200
                          ${assessmentApplicable === v ? v === "No" ? "bg-amber-500/10 border-amber-500/35 text-amber-600 dark:text-amber-400 shadow-2xs" : "bg-primary/10 border-primary text-primary shadow-2xs" : "border-border/80 bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-3 rounded-full border flex items-center justify-center ${assessmentApplicable === v ? "border-current bg-current" : "border-muted-foreground/30"}`, children: assessmentApplicable === v && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1 bg-card rounded-full" }) }),
                      v === "No" ? "Skip Assessment" : "Perform Assessment"
                    ]
                  },
                  v
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5 pt-2 border-t border-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "size-4 text-primary" }),
                  " Cycle Time Allowance (%)"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      value: allowance,
                      onChange: (e) => setAllowance(e.target.value),
                      className: "w-full h-10 px-3 rounded-xl border border-border/80 bg-background text-sm text-foreground outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10",
                      min: "0",
                      max: "100"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-muted-foreground", children: "%" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-bold text-foreground/70 uppercase tracking-widest", children: "Scope & Temp ID Config" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-black text-foreground uppercase tracking-wider", children: "Applicable Employee Types" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2.5", children: ["Worker", "Staff", "Executive"].map((type) => {
                  const isSelected = empType.includes(type);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleToggleEmpType(type),
                      className: `flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl border text-sm font-bold transition-all duration-200
                            ${isSelected ? "bg-primary/10 border-primary text-primary shadow-2xs" : "border-border/80 hover:border-primary/50 bg-background text-muted-foreground hover:text-foreground"}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: isSelected,
                            readOnly: true,
                            className: "accent-primary rounded cursor-pointer size-3.5"
                          }
                        ),
                        type
                      ]
                    },
                    type
                  );
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `space-y-4 pt-4 border-t border-border/40 transition-all duration-300 ${isTempIdVisible ? "opacity-100" : "opacity-30 pointer-events-none"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "size-4 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black text-muted-foreground uppercase tracking-widest", children: "Temp ID Generation Rules" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black text-muted-foreground uppercase", children: "Base Prefix Field" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      value: tempIdBasedOn,
                      onChange: (e) => setTempIdBasedOn(e.target.value),
                      className: "w-full h-10 px-3 rounded-xl border border-border/80 bg-background text-sm text-foreground outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Dept-Code", children: "Department Code prefix" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Short Name", children: "Short Name prefix" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Organization Short Name", children: "Organization Short Name (PAL)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "None", children: "No Prefix (Numbers Only)" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black text-muted-foreground uppercase", children: "Zero Padding Pattern" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        value: tempIdDigit,
                        onChange: (e) => setTempIdDigit(e.target.value),
                        className: "w-full h-10 px-3 rounded-xl border border-border/80 bg-background text-sm text-foreground outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10",
                        placeholder: "e.g. 00000"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black text-muted-foreground uppercase", children: "Starting Digit" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        value: tempIdStartingDigit,
                        onChange: (e) => setTempIdStartingDigit(e.target.value),
                        className: "w-full h-10 px-3 rounded-xl border border-border/80 bg-background text-sm text-foreground outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10",
                        min: "1"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-muted/20 rounded-xl p-4 border border-border/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-4 text-primary shrink-0 animate-bounce" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
                    "Real-time Generated Temp ID: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "font-mono text-foreground font-black text-xs ml-1 bg-background px-2 py-0.5 border border-border/50 rounded-md", children: [
                      tempIdBasedOn === "None" ? "" : tempIdBasedOn === "Organization Short Name" ? "PAL" : tempIdBasedOn.slice(0, 3).toUpperCase(),
                      tempIdStartingDigit.padStart(tempIdDigit.length, "0")
                    ] })
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border border-border/80 p-5 shadow-xs flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground font-semibold", children: "Changes applied here will affect the recruitment module and basic registration forms." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  setBasicFormApplicable("Yes");
                  setAssessmentApplicable("Yes");
                  setAllowance("15");
                  setTempIdBasedOn("Organization Short Name");
                  setTempIdDigit("00000");
                  setTempIdStartingDigit("1");
                  setEmpType(["Worker"]);
                },
                className: "h-10 px-4.5 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground font-bold text-xs transition-all flex items-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-3.5" }),
                  " Restore Default Settings"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleSubmit,
                className: "h-10 px-8 rounded-xl bg-primary text-primary-foreground font-black text-xs shadow-md hover:shadow-lg hover:bg-primary/95 transition-all hover:-translate-y-0.5 flex items-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4" }),
                  " Save Configuration"
                ]
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] });
}
const $$splitComponentImporter$J = () => import("./recruitment-basic-list-BreNOpni.mjs");
const Route$J = createFileRoute("/recruitment-basic-list")({
  head: () => ({
    meta: [{
      title: "Application Queue List — CRIPTON HRIS"
    }, {
      name: "description",
      content: "Directory of registered candidate profiles temporarily enrolled."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$J, "component")
});
const $$splitComponentImporter$I = () => import("./recruitment-basic-info-list-yuGC4xdf.mjs");
const Route$I = createFileRoute("/recruitment-basic-info-list")({
  head: () => ({
    meta: [{
      title: "Basic Info List — CRIPTON HRIS"
    }, {
      name: "description",
      content: "Search and manage candidate basic info records."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$I, "component")
});
const $$splitComponentImporter$H = () => import("./recruitment-basic-entry-DZvSWitT.mjs");
const Route$H = createFileRoute("/recruitment-basic-entry")({
  component: lazyRouteComponent($$splitComponentImporter$H, "component")
});
const $$splitComponentImporter$G = () => import("./recruitment-assessment-list-QJwgDsgK.mjs");
const Route$G = createFileRoute("/recruitment-assessment-list")({
  head: () => ({
    meta: [{
      title: "Assessment List — CRIPTON HRIS"
    }, {
      name: "description",
      content: "List of all candidate assessments."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$G, "component")
});
const $$splitComponentImporter$F = () => import("./propose-increment-CgoFrMNF.mjs");
const Route$F = createFileRoute("/propose-increment")({
  head: () => ({
    meta: [{
      title: "Propose Increment — CRIPTON"
    }, {
      name: "description",
      content: "Submit and manage performance-based salary increments."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$F, "component")
});
const $$splitComponentImporter$E = () => import("./personnel-list-BrDd1Roi.mjs");
const Route$E = createFileRoute("/personnel-list")({
  head: () => ({
    meta: [{
      title: "Personnel List — CRIPTON HRIS"
    }, {
      name: "description",
      content: "Professional personnel database, advanced column configurations, custom search filters, and slide-over profile sheets."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$E, "component")
});
const employeesData = [{
  id: "2023043910",
  offcId: "—",
  name: "Tahmid Afsar Shapno",
  type: "Permanent",
  dept: "Business Innovation",
  sect: "Project Resource & Strategy",
  title: "Asst. Manager",
  unit: "PSL",
  line: "N/A",
  grade: "None",
  shift: "General Shift",
  shiftStart: "01/08/2023",
  joinDate: "01/08/2023",
  holiday: "—",
  blood: "AB (+ve)",
  basic: "91200.00",
  gross: "152000.00",
  email: "tahmid.bd@pakizasoftware.com",
  phone: "—",
  officeMob: "01750021154",
  personalContact: "—",
  gender: "Male",
  dob: "12/07/1999",
  otStatus: "N/A",
  otRate: "0",
  status: "Working",
  empStatus: "Permanent",
  confirmDate: "01/11/2023",
  village: "Bhola",
  acStatus: "Active"
}, {
  id: "2023046001",
  offcId: "—",
  name: "Sohanur Rahman Sohan",
  type: "Office Executive",
  dept: "HR, Admin and Compliance",
  sect: "Admin",
  title: "Executive",
  joinDate: "01/11/2023",
  holiday: "—",
  blood: "A (+ve)",
  basic: "16200.00",
  gross: "27000.00",
  email: "sohan.admin@pakizatvl.com",
  phone: "6615",
  officeMob: "01321-175928",
  personalContact: "—",
  gender: "Male",
  dob: "12/02/1998",
  otStatus: "N/A",
  otRate: "0",
  status: "Working",
  empStatus: "Permanent",
  confirmDate: "—",
  village: "Village # Bishnopur",
  acStatus: "Active"
}, {
  id: "2023043021",
  offcId: "—",
  name: "Easin Mia",
  type: "Office Executive",
  dept: "HR, Admin and Compliance",
  sect: "Admin",
  title: "Receptionist",
  unit: "PSL",
  line: "N/A",
  grade: "None",
  shift: "Exe-Ptvl",
  shiftStart: "01/05/2023",
  joinDate: "01/02/2023",
  holiday: "—",
  blood: "A (-ve)",
  basic: "11400.00",
  gross: "19000.00",
  email: "easin.admin@pakizatvl.com",
  phone: "—",
  officeMob: "1324726766",
  personalContact: "—",
  gender: "Male",
  dob: "16/07/1997",
  otStatus: "N/A",
  otRate: "0",
  status: "Working",
  empStatus: "Permanent",
  confirmDate: "—",
  village: "Chandidar",
  acStatus: "Active"
}, {
  id: "2026059411",
  offcId: "—",
  name: "Jannatul Maowa",
  type: "Office Executive",
  dept: "HR, Admin and Compliance",
  sect: "Admin",
  title: "Jr. Executive",
  unit: "PSL",
  line: "N/A",
  grade: "None",
  shift: "General Shift",
  shiftStart: "10/05/2026",
  joinDate: "10/05/2026",
  holiday: "—",
  blood: "O (+ve)",
  basic: "12000.00",
  gross: "20000.00",
  email: "maowa.admin@pakizasoftware.com",
  phone: "—",
  officeMob: "1777735383",
  personalContact: "—",
  gender: "Female",
  dob: "15/07/2001",
  otStatus: "N/A",
  otRate: "0",
  status: "Working",
  empStatus: "Probation",
  confirmDate: "10/08/2026",
  village: "Hawlader Bari, Vill# Voroshakathi",
  acStatus: "Active"
}, {
  id: "2024049326",
  offcId: "—",
  name: "Hanif Uddin",
  type: "Office Executive",
  dept: "Business Innovation",
  sect: "APPS Team",
  title: "Sr. Executive",
  unit: "PSL",
  line: "N/A",
  grade: "None",
  shift: "General-Exec",
  shiftStart: "01/06/2024",
  joinDate: "01/06/2024",
  holiday: "—",
  blood: "A (+ve)",
  basic: "30000.00",
  gross: "50000.00",
  email: "hanif.inno@pakizasoftware.com",
  phone: "—",
  officeMob: "01963978074",
  personalContact: "—",
  gender: "Male",
  dob: "15/03/1992",
  otStatus: "N/A",
  otRate: "0",
  status: "Working",
  empStatus: "Probation",
  confirmDate: "01/09/2024",
  village: "Village # Londoha",
  acStatus: "Active"
}, {
  id: "2026058726",
  offcId: "—",
  name: "Parvej Mahmud",
  type: "Office Executive",
  dept: "Business Innovation",
  sect: "APPS Team",
  title: "Executive",
  unit: "PSL",
  line: "N/A",
  grade: "None",
  shift: "General Shift",
  shiftStart: "22/02/2026",
  joinDate: "22/02/2026",
  holiday: "—",
  blood: "O (+ve)",
  basic: "24000.00",
  gross: "40000.00",
  email: "parvej.inno@pakizasoftware.com",
  phone: "—",
  officeMob: "01521205808",
  personalContact: "—",
  gender: "Male",
  dob: "06/07/1999",
  otStatus: "N/A",
  otRate: "0",
  status: "Working",
  empStatus: "Probation",
  confirmDate: "22/05/2026",
  village: "H# 1227",
  acStatus: "Active"
}, {
  id: "2023045044",
  offcId: "—",
  name: "Sultan Ahmed",
  type: "Office Executive",
  dept: "Implementation & Business Analysis",
  sect: "Business Analysis",
  title: "Manager",
  unit: "PSL",
  line: "N/A",
  grade: "None",
  shift: "General Shift",
  shiftStart: "01/10/2023",
  joinDate: "01/10/2023",
  holiday: "—",
  blood: "O (+ve)",
  basic: "48600.00",
  gross: "81000.00",
  email: "sultan.ba@pakizasoftware.com",
  phone: "—",
  officeMob: "1329726651",
  personalContact: "—",
  gender: "Male",
  dob: "03/11/1992",
  otStatus: "N/A",
  otRate: "0",
  status: "Working",
  empStatus: "Permanent",
  confirmDate: "—",
  village: "House :12, Bhangnahati",
  acStatus: "Active"
}, {
  id: "2026058686",
  offcId: "—",
  name: "Md. Abdur Rahaman",
  type: "Office Executive",
  dept: "Business Innovation",
  sect: "Business Innovation",
  title: "Executive",
  unit: "PSL",
  line: "N/A",
  grade: "None",
  shift: "General Shift",
  shiftStart: "15/02/2026",
  joinDate: "15/02/2026",
  holiday: "—",
  blood: "O (+ve)",
  basic: "30000.00",
  gross: "50000.00",
  email: "rahaman.inno@pakizasoftware.com",
  phone: "—",
  officeMob: "01531959653",
  personalContact: "—",
  gender: "Male",
  dob: "16/12/1997",
  otStatus: "N/A",
  otRate: "0",
  status: "Working",
  empStatus: "Probation",
  confirmDate: "15/05/2026",
  village: "Vill# Chachahar Moddhopara",
  acStatus: "Active"
}, {
  id: "2025058109",
  offcId: "—",
  name: "Mohammad Methoun Ahmed",
  type: "Office Executive",
  dept: "Business Automation",
  sect: "Core Development",
  title: "Sr. Manager",
  unit: "PSL",
  line: "N/A",
  grade: "None",
  shift: "General Shift",
  shiftStart: "15/12/2025",
  joinDate: "22/12/2025",
  holiday: "—",
  blood: "B (+ve)",
  basic: "78000.00",
  gross: "130000.00",
  email: "methoun.ba@pakizasoftware.com",
  phone: "—",
  officeMob: "1713060442",
  personalContact: "—",
  gender: "Male",
  dob: "12/04/1993",
  otStatus: "N/A",
  otRate: "0",
  status: "Working",
  empStatus: "Probation",
  confirmDate: "22/06/2026",
  village: "Village # Vewamara",
  acStatus: "Active"
}, {
  id: "2026058685",
  offcId: "—",
  name: "Md Johirul Islam",
  type: "Office Executive",
  dept: "Business Automation",
  sect: "Core Development",
  title: "Executive",
  unit: "PSL",
  line: "N/A",
  grade: "None",
  shift: "General Shift",
  shiftStart: "15/02/2026",
  joinDate: "15/02/2026",
  holiday: "—",
  blood: "O (+ve)",
  basic: "24000.00",
  gross: "40000.00",
  email: "johirul.ba@pakizasoftware.com",
  phone: "—",
  officeMob: "01712345678",
  personalContact: "—",
  gender: "Male",
  dob: "01/01/1996",
  otStatus: "N/A",
  otRate: "0",
  status: "Working",
  empStatus: "Probation",
  confirmDate: "15/05/2026",
  village: "Dhaka",
  acStatus: "Active"
}];
const $$splitComponentImporter$D = () => import("./personnel-approval-Bk9N7g5L.mjs");
const Route$D = createFileRoute("/personnel-approval")({
  head: () => ({
    meta: [{
      title: "Personnel Approvals — CRIPTON"
    }, {
      name: "description",
      content: "Approve new employee joinings and execute employment status conversions."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$D, "component")
});
const $$splitComponentImporter$C = () => import("./pending-manual-attendance-DRI-hGj1.mjs");
const Route$C = createFileRoute("/pending-manual-attendance")({
  head: () => ({
    meta: [{
      title: "Manual Attendance Approval — CRIPTON"
    }, {
      name: "description",
      content: "HR audit registry of attendance corrections, department approvals, and punch overrides."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$C, "component")
});
const $$splitComponentImporter$B = () => import("./manual-attendance-BCTy1myD.mjs");
const Route$B = createFileRoute("/manual-attendance")({
  head: () => ({
    meta: [{
      title: "Manual Attendance Workspace — CRIPTON"
    }, {
      name: "description",
      content: "Professional manual attendance roster dashboard, live dynamic OT calculations, and bulk-processing worksheets."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$B, "component")
});
const $$splitComponentImporter$A = () => import("./leave-list-W5B7-ium.mjs");
const Route$A = createFileRoute("/leave-list")({
  head: () => ({
    meta: [{
      title: "Leave List Database — CRIPTON"
    }, {
      name: "description",
      content: "Comprehensive query-based historical database of all corporate employee leave records."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$A, "component")
});
const $$splitComponentImporter$z = () => import("./leave-approve-CpVBaiCI.mjs");
const Route$z = createFileRoute("/leave-approve")({
  head: () => ({
    meta: [{
      title: "Leave Approvals — CRIPTON"
    }, {
      name: "description",
      content: "Review, search, and bulk approve or reject employee leave applications."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$z, "component")
});
const $$splitComponentImporter$y = () => import("./leave-application-bRYVOje-.mjs");
const Route$y = createFileRoute("/leave-application")({
  head: () => ({
    meta: [{
      title: "Leave Application — CRIPTON"
    }, {
      name: "description",
      content: "Submit employee leave requests, configure pay parameters, and review balance summaries."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$y, "component")
});
const $$splitComponentImporter$x = () => import("./kpi-task-name-DSp9RNOq.mjs");
const Route$x = createFileRoute("/kpi-task-name")({
  head: () => ({
    meta: [{
      title: "KPI Task Name Registry — CRIPTON"
    }, {
      name: "description",
      content: "Management and configuration of Key Performance Indicators (KPIs) and operational criteria."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$x, "component")
});
const $$splitComponentImporter$w = () => import("./kpi-setting-BaOcjhGJ.mjs");
const Route$w = createFileRoute("/kpi-setting")({
  head: () => ({
    meta: [{
      title: "KPI Setting point configurations — CRIPTON"
    }, {
      name: "description",
      content: "Grade settings, appraisal bands, and point range definitions."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$w, "component")
});
const $$splitComponentImporter$v = () => import("./kpi-assessment-workflow-BtYwoZuM.mjs");
const Route$v = createFileRoute("/kpi-assessment-workflow")({
  head: () => ({
    meta: [{
      title: "KPI Assessment Workflow — CRIPTON"
    }, {
      name: "description",
      content: "Appraisal approval workflow across HOD, HR, Plant Head, Managing Director, and final evaluation."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$v, "component")
});
const $$splitComponentImporter$u = () => import("./increment-summary-w120yU7k.mjs");
const Route$u = createFileRoute("/increment-summary")({
  head: () => ({
    meta: [{
      title: "Increment Summary — CRIPTON"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("./increment-report-zcpQ5HQX.mjs");
const Route$t = createFileRoute("/increment-report")({
  head: () => ({
    meta: [{
      title: "Increment Report — CRIPTON"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("./increment-queuelist-CRVEeQty.mjs");
const Route$s = createFileRoute("/increment-queuelist")({
  head: () => ({
    meta: [{
      title: "Approvals Console — CRIPTON HRIS"
    }, {
      name: "description",
      content: "Unified enterprise approval console for human resource increments, HR endorsements, and final executive MD approvals."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./increment-multiple-DQOxZuUP.mjs");
const Route$r = createFileRoute("/increment-multiple")({
  head: () => ({
    meta: [{
      title: "Increment (Multiple) — CRIPTON"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./increment-list-1NWys7VH.mjs");
const Route$q = createFileRoute("/increment-list")({
  head: () => ({
    meta: [{
      title: "Increment List — CRIPTON"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./increment-history-BeaMEII4.mjs");
const Route$p = createFileRoute("/increment-history")({
  head: () => ({
    meta: [{
      title: "Salary Increment History — CRIPTON HRIS"
    }, {
      name: "description",
      content: "Professional query-based historical database of salary increments featuring advanced column configurator toggles and sticky fixed left datagrid."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./increment-gadget-DhuUuiX-.mjs");
const Route$o = createFileRoute("/increment-gadget")({
  head: () => ({
    meta: [{
      title: "Increment Gadget — CRIPTON"
    }, {
      name: "description",
      content: "Parametric wage matrix appraisal configurator with active live ratios."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./increment-D525EarZ.mjs");
const Route$n = createFileRoute("/increment")({
  head: () => ({
    meta: [{
      title: "Salary Increment Configurator — CRIPTON"
    }, {
      name: "description",
      content: "Consolidated enterprise configurator for salary scale adjustments, bulk processes, and single increment workflow proposals."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./final-approve-increment-Dhyh8Q01.mjs");
const Route$m = createFileRoute("/final-approve-increment")({
  head: () => ({
    meta: [{
      title: "Approve Increment — CRIPTON"
    }, {
      name: "description",
      content: "Final salary increment approvals and corporate wage governance dashboard."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./evaluation-propose-DmKvD8_U.mjs");
const Route$l = createFileRoute("/evaluation-propose")({
  head: () => ({
    meta: [{
      title: "Evaluation Propose — CRIPTON HRIS"
    }, {
      name: "description",
      content: "Human resource evaluation proposal and tenure audit registry."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./employee-job-card-_oTsgRdy.mjs");
const Route$k = createFileRoute("/employee-job-card")({
  head: () => ({
    meta: [{
      title: "Employee Job Card — CRIPTON"
    }, {
      name: "description",
      content: "Comprehensive employee job card registry displaying punch timelines, attendance states, and overtime hours."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./earn-leave-workflow-BDgZkmP8.mjs");
const Route$j = createFileRoute("/earn-leave-workflow")({
  head: () => ({
    meta: [{
      title: "Earn Leave Workflow Center — CRIPTON"
    }, {
      name: "description",
      content: "Unified multi-tier workflow panel containing Earn Leave Submit, Check Verification, and HRD Authorizations."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./earn-leave-submit-DWPFUSyS.mjs");
const Route$i = createFileRoute("/earn-leave-submit")({
  head: () => ({
    meta: [{
      title: "Earn Leave Submit — CRIPTON"
    }, {
      name: "description",
      content: "Select processed employee earned leave records, configure disbursement details, and submit for clearance."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./earn-leave-process-C4o4ynrA.mjs");
const Route$h = createFileRoute("/earn-leave-process")({
  head: () => ({
    meta: [{
      title: "Earn Leave Process — CRIPTON"
    }, {
      name: "description",
      content: "Accrue, calculate, scale, and process cash compensation for employee earned leaves."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./e-recruitment-form-COTnDlGG.mjs");
const Route$g = createFileRoute("/e-recruitment-form")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./create-roster-DgrnOsfV.mjs");
const Route$f = createFileRoute("/create-roster")({
  head: () => ({
    meta: [{
      title: "Employee Roster — CRIPTON"
    }, {
      name: "description",
      content: "Corporate Shift Roster scheduling registry, weekend allocations, and default holiday configurations."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./configure-time-DKa4D7Ca.mjs");
const Route$e = createFileRoute("/configure-time")({
  head: () => ({
    meta: [{
      title: "Time & Shift Setup — CRIPTON HRIS"
    }, {
      name: "description",
      content: "Manage and configure standard shifts, abnormal shifts, attendance bonus rules, and OT config."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./configure-structure-Ccc59L4P.mjs");
const Route$d = createFileRoute("/configure-structure")({
  head: () => ({
    meta: [{
      title: "Structure Setup — CRIPTON HRIS"
    }, {
      name: "description",
      content: "Configure company structures, operating areas, departments, sections, units, lines, and mappings."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./configure-policies-Di8VMNRb.mjs");
const Route$c = createFileRoute("/configure-policies")({
  head: () => ({
    meta: [{
      title: "Leave & Policies Setup — CRIPTON HRIS"
    }, {
      name: "description",
      content: "Configure company rules, guidelines, leave structures, and policy names."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./configure-employment-Bvpn6iPE.mjs");
const Route$b = createFileRoute("/configure-employment")({
  head: () => ({
    meta: [{
      title: "Employment Setup — CRIPTON HRIS"
    }, {
      name: "description",
      content: "Configure designation groups, job titles, employee types, grades, countries, religions, and places in BD."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./configure-education-C1JHcM9N.mjs");
const Route$a = createFileRoute("/configure-education")({
  head: () => ({
    meta: [{
      title: "Education & Training Setup — CRIPTON HRIS"
    }, {
      name: "description",
      content: "Manage and configure qualifications, institutions, results, and training categories."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./configure-compensation-Bvmqf6Vi.mjs");
const Route$9 = createFileRoute("/configure-compensation")({
  head: () => ({
    meta: [{
      title: "Allowances & Bonuses Setup — CRIPTON HRIS"
    }, {
      name: "description",
      content: "Configure allowance rates, tiffin rates, lunch rates, conveyance, and bonus policies."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./company-holiday-CG-g6eqm.mjs");
const Route$8 = createFileRoute("/company-holiday")({
  head: () => ({
    meta: [{
      title: "Company Holidays — CRIPTON"
    }, {
      name: "description",
      content: "Corporate calendar holiday schedule, public holiday alignments, and organizational observances."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./approve-increment-hr-CKw343yw.mjs");
const Route$7 = createFileRoute("/approve-increment-hr")({
  head: () => ({
    meta: [{
      title: "Approve Increment (HR) — CRIPTON"
    }, {
      name: "description",
      content: "HR specific increment approvals and endorsement console."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./approve-increment-gadget-C16vA_sA.mjs");
const Route$6 = createFileRoute("/approve-increment-gadget")({
  head: () => ({
    meta: [{
      title: "Approve Increment Gadget — CRIPTON"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./add-employee-BuULb_Rw.mjs");
const Route$5 = createFileRoute("/add-employee")({
  head: () => ({
    meta: [{
      title: "Add Employee — CRIPTON HRIS"
    }, {
      name: "description",
      content: "Create a new employee profile in the digital directory."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./index-CITpxuWv.mjs");
const Route$4 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "CRIPTON HRIS — Workforce Intelligence Dashboard"
    }, {
      name: "description",
      content: "A modern HR command center: headcount, attendance, payroll, and recruitment analytics in one place."
    }, {
      property: "og:title",
      content: "CRIPTON HRIS — Workforce Intelligence Dashboard"
    }, {
      property: "og:description",
      content: "Professional HR dashboard with charts, approvals, and recruitment pipelines."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./recruitment-ie-assessment._id-YauzmUFa.mjs");
const Route$3 = createFileRoute("/recruitment-ie-assessment/$id")({
  head: () => ({
    meta: [{
      title: "IE Assessment — CRIPTON HRIS"
    }, {
      name: "description",
      content: "IE Assessment evaluation form."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./recruitment-hr-assessment._id-BM3ndZ5U.mjs");
const Route$2 = createFileRoute("/recruitment-hr-assessment/$id")({
  head: () => ({
    meta: [{
      title: "HR Assessment Form — CRIPTON HRIS"
    }, {
      name: "description",
      content: "HR Assessment evaluation."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./recruitment-detail._id-CjcJGZKk.mjs");
const Route$1 = createFileRoute("/recruitment-detail/$id")({
  head: () => ({
    meta: [{
      title: "Review Candidate Dossier — CRIPTON HRIS"
    }, {
      name: "description",
      content: "Review and approve/reject candidate applications."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./employee-detail._id-DeNN16Mx.mjs");
const Route = createFileRoute("/employee-detail/$id")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SspRequestManualAttendanceRoute = Route$W.update({
  id: "/ssp-request-manual-attendance",
  path: "/ssp-request-manual-attendance",
  getParentRoute: () => Route$X
});
const SspNewRequisitionRoute = Route$V.update({
  id: "/ssp-new-requisition",
  path: "/ssp-new-requisition",
  getParentRoute: () => Route$X
});
const SspMyRequisitionRoute = Route$U.update({
  id: "/ssp-my-requisition",
  path: "/ssp-my-requisition",
  getParentRoute: () => Route$X
});
const SspMyAttendanceRoute = Route$T.update({
  id: "/ssp-my-attendance",
  path: "/ssp-my-attendance",
  getParentRoute: () => Route$X
});
const SspLeaveRequisitionRoute = Route$S.update({
  id: "/ssp-leave-requisition",
  path: "/ssp-leave-requisition",
  getParentRoute: () => Route$X
});
const SspIctRequisitionRoute = Route$R.update({
  id: "/ssp-ict-requisition",
  path: "/ssp-ict-requisition",
  getParentRoute: () => Route$X
});
const SspAttendanceRoute = Route$Q.update({
  id: "/ssp-attendance",
  path: "/ssp-attendance",
  getParentRoute: () => Route$X
});
const SspApproveManualAttendanceRoute = Route$P.update({
  id: "/ssp-approve-manual-attendance",
  path: "/ssp-approve-manual-attendance",
  getParentRoute: () => Route$X
});
const SspApprovalRoute = Route$O.update({
  id: "/ssp-approval",
  path: "/ssp-approval",
  getParentRoute: () => Route$X
});
const RecruitmentIeListRoute = Route$N.update({
  id: "/recruitment-ie-list",
  path: "/recruitment-ie-list",
  getParentRoute: () => Route$X
});
const RecruitmentHrListRoute = Route$M.update({
  id: "/recruitment-hr-list",
  path: "/recruitment-hr-list",
  getParentRoute: () => Route$X
});
const RecruitmentConfigurationRoute = Route$L.update({
  id: "/recruitment-configuration",
  path: "/recruitment-configuration",
  getParentRoute: () => Route$X
});
const RecruitmentBasicSetupRoute = Route$K.update({
  id: "/recruitment-basic-setup",
  path: "/recruitment-basic-setup",
  getParentRoute: () => Route$X
});
const RecruitmentBasicListRoute = Route$J.update({
  id: "/recruitment-basic-list",
  path: "/recruitment-basic-list",
  getParentRoute: () => Route$X
});
const RecruitmentBasicInfoListRoute = Route$I.update({
  id: "/recruitment-basic-info-list",
  path: "/recruitment-basic-info-list",
  getParentRoute: () => Route$X
});
const RecruitmentBasicEntryRoute = Route$H.update({
  id: "/recruitment-basic-entry",
  path: "/recruitment-basic-entry",
  getParentRoute: () => Route$X
});
const RecruitmentAssessmentListRoute = Route$G.update({
  id: "/recruitment-assessment-list",
  path: "/recruitment-assessment-list",
  getParentRoute: () => Route$X
});
const ProposeIncrementRoute = Route$F.update({
  id: "/propose-increment",
  path: "/propose-increment",
  getParentRoute: () => Route$X
});
const PersonnelListRoute = Route$E.update({
  id: "/personnel-list",
  path: "/personnel-list",
  getParentRoute: () => Route$X
});
const PersonnelApprovalRoute = Route$D.update({
  id: "/personnel-approval",
  path: "/personnel-approval",
  getParentRoute: () => Route$X
});
const PendingManualAttendanceRoute = Route$C.update({
  id: "/pending-manual-attendance",
  path: "/pending-manual-attendance",
  getParentRoute: () => Route$X
});
const ManualAttendanceRoute = Route$B.update({
  id: "/manual-attendance",
  path: "/manual-attendance",
  getParentRoute: () => Route$X
});
const LeaveListRoute = Route$A.update({
  id: "/leave-list",
  path: "/leave-list",
  getParentRoute: () => Route$X
});
const LeaveApproveRoute = Route$z.update({
  id: "/leave-approve",
  path: "/leave-approve",
  getParentRoute: () => Route$X
});
const LeaveApplicationRoute = Route$y.update({
  id: "/leave-application",
  path: "/leave-application",
  getParentRoute: () => Route$X
});
const KpiTaskNameRoute = Route$x.update({
  id: "/kpi-task-name",
  path: "/kpi-task-name",
  getParentRoute: () => Route$X
});
const KpiSettingRoute = Route$w.update({
  id: "/kpi-setting",
  path: "/kpi-setting",
  getParentRoute: () => Route$X
});
const KpiAssessmentWorkflowRoute = Route$v.update({
  id: "/kpi-assessment-workflow",
  path: "/kpi-assessment-workflow",
  getParentRoute: () => Route$X
});
const IncrementSummaryRoute = Route$u.update({
  id: "/increment-summary",
  path: "/increment-summary",
  getParentRoute: () => Route$X
});
const IncrementReportRoute = Route$t.update({
  id: "/increment-report",
  path: "/increment-report",
  getParentRoute: () => Route$X
});
const IncrementQueuelistRoute = Route$s.update({
  id: "/increment-queuelist",
  path: "/increment-queuelist",
  getParentRoute: () => Route$X
});
const IncrementMultipleRoute = Route$r.update({
  id: "/increment-multiple",
  path: "/increment-multiple",
  getParentRoute: () => Route$X
});
const IncrementListRoute = Route$q.update({
  id: "/increment-list",
  path: "/increment-list",
  getParentRoute: () => Route$X
});
const IncrementHistoryRoute = Route$p.update({
  id: "/increment-history",
  path: "/increment-history",
  getParentRoute: () => Route$X
});
const IncrementGadgetRoute = Route$o.update({
  id: "/increment-gadget",
  path: "/increment-gadget",
  getParentRoute: () => Route$X
});
const IncrementRoute = Route$n.update({
  id: "/increment",
  path: "/increment",
  getParentRoute: () => Route$X
});
const FinalApproveIncrementRoute = Route$m.update({
  id: "/final-approve-increment",
  path: "/final-approve-increment",
  getParentRoute: () => Route$X
});
const EvaluationProposeRoute = Route$l.update({
  id: "/evaluation-propose",
  path: "/evaluation-propose",
  getParentRoute: () => Route$X
});
const EmployeeJobCardRoute = Route$k.update({
  id: "/employee-job-card",
  path: "/employee-job-card",
  getParentRoute: () => Route$X
});
const EarnLeaveWorkflowRoute = Route$j.update({
  id: "/earn-leave-workflow",
  path: "/earn-leave-workflow",
  getParentRoute: () => Route$X
});
const EarnLeaveSubmitRoute = Route$i.update({
  id: "/earn-leave-submit",
  path: "/earn-leave-submit",
  getParentRoute: () => Route$X
});
const EarnLeaveProcessRoute = Route$h.update({
  id: "/earn-leave-process",
  path: "/earn-leave-process",
  getParentRoute: () => Route$X
});
const ERecruitmentFormRoute = Route$g.update({
  id: "/e-recruitment-form",
  path: "/e-recruitment-form",
  getParentRoute: () => Route$X
});
const CreateRosterRoute = Route$f.update({
  id: "/create-roster",
  path: "/create-roster",
  getParentRoute: () => Route$X
});
const ConfigureTimeRoute = Route$e.update({
  id: "/configure-time",
  path: "/configure-time",
  getParentRoute: () => Route$X
});
const ConfigureStructureRoute = Route$d.update({
  id: "/configure-structure",
  path: "/configure-structure",
  getParentRoute: () => Route$X
});
const ConfigurePoliciesRoute = Route$c.update({
  id: "/configure-policies",
  path: "/configure-policies",
  getParentRoute: () => Route$X
});
const ConfigureEmploymentRoute = Route$b.update({
  id: "/configure-employment",
  path: "/configure-employment",
  getParentRoute: () => Route$X
});
const ConfigureEducationRoute = Route$a.update({
  id: "/configure-education",
  path: "/configure-education",
  getParentRoute: () => Route$X
});
const ConfigureCompensationRoute = Route$9.update({
  id: "/configure-compensation",
  path: "/configure-compensation",
  getParentRoute: () => Route$X
});
const CompanyHolidayRoute = Route$8.update({
  id: "/company-holiday",
  path: "/company-holiday",
  getParentRoute: () => Route$X
});
const ApproveIncrementHrRoute = Route$7.update({
  id: "/approve-increment-hr",
  path: "/approve-increment-hr",
  getParentRoute: () => Route$X
});
const ApproveIncrementGadgetRoute = Route$6.update({
  id: "/approve-increment-gadget",
  path: "/approve-increment-gadget",
  getParentRoute: () => Route$X
});
const AddEmployeeRoute = Route$5.update({
  id: "/add-employee",
  path: "/add-employee",
  getParentRoute: () => Route$X
});
const IndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$X
});
const RecruitmentIeAssessmentIdRoute = Route$3.update({
  id: "/recruitment-ie-assessment/$id",
  path: "/recruitment-ie-assessment/$id",
  getParentRoute: () => Route$X
});
const RecruitmentHrAssessmentIdRoute = Route$2.update({
  id: "/recruitment-hr-assessment/$id",
  path: "/recruitment-hr-assessment/$id",
  getParentRoute: () => Route$X
});
const RecruitmentDetailIdRoute = Route$1.update({
  id: "/recruitment-detail/$id",
  path: "/recruitment-detail/$id",
  getParentRoute: () => Route$X
});
const EmployeeDetailIdRoute = Route.update({
  id: "/employee-detail/$id",
  path: "/employee-detail/$id",
  getParentRoute: () => Route$X
});
const rootRouteChildren = {
  IndexRoute,
  AddEmployeeRoute,
  ApproveIncrementGadgetRoute,
  ApproveIncrementHrRoute,
  CompanyHolidayRoute,
  ConfigureCompensationRoute,
  ConfigureEducationRoute,
  ConfigureEmploymentRoute,
  ConfigurePoliciesRoute,
  ConfigureStructureRoute,
  ConfigureTimeRoute,
  CreateRosterRoute,
  ERecruitmentFormRoute,
  EarnLeaveProcessRoute,
  EarnLeaveSubmitRoute,
  EarnLeaveWorkflowRoute,
  EmployeeJobCardRoute,
  EvaluationProposeRoute,
  FinalApproveIncrementRoute,
  IncrementRoute,
  IncrementGadgetRoute,
  IncrementHistoryRoute,
  IncrementListRoute,
  IncrementMultipleRoute,
  IncrementQueuelistRoute,
  IncrementReportRoute,
  IncrementSummaryRoute,
  KpiAssessmentWorkflowRoute,
  KpiSettingRoute,
  KpiTaskNameRoute,
  LeaveApplicationRoute,
  LeaveApproveRoute,
  LeaveListRoute,
  ManualAttendanceRoute,
  PendingManualAttendanceRoute,
  PersonnelApprovalRoute,
  PersonnelListRoute,
  ProposeIncrementRoute,
  RecruitmentAssessmentListRoute,
  RecruitmentBasicEntryRoute,
  RecruitmentBasicInfoListRoute,
  RecruitmentBasicListRoute,
  RecruitmentBasicSetupRoute,
  RecruitmentConfigurationRoute,
  RecruitmentHrListRoute,
  RecruitmentIeListRoute,
  SspApprovalRoute,
  SspApproveManualAttendanceRoute,
  SspAttendanceRoute,
  SspIctRequisitionRoute,
  SspLeaveRequisitionRoute,
  SspMyAttendanceRoute,
  SspMyRequisitionRoute,
  SspNewRequisitionRoute,
  SspRequestManualAttendanceRoute,
  EmployeeDetailIdRoute,
  RecruitmentDetailIdRoute,
  RecruitmentHrAssessmentIdRoute,
  RecruitmentIeAssessmentIdRoute
};
const routeTree = Route$X._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$3 as R,
  Sidebar as S,
  Topbar as T,
  SearchableSelect as a,
  Route$2 as b,
  Route$1 as c,
  Route as d,
  employeesData as e,
  initializeRecruitmentMockData as i,
  router as r
};
