import { Link, useRouterState } from "@tanstack/react-router";
import {
  Settings2,
  ClipboardList,
  TrendingUp,
  BarChart2,
  ListOrdered,
  CheckSquare,
  History,
} from "lucide-react";

const EVAL_TABS = [
  {
    label: "Configurator",
    to: "/increment-gadget",
    icon: Settings2,
    desc: "Set increment rules",
  },
  {
    label: "Evaluation Propose",
    to: "/evaluation-propose",
    icon: ClipboardList,
    desc: "Review tenure & eligibility",
  },
  {
    label: "Propose Increment",
    to: "/propose-increment",
    icon: TrendingUp,
    desc: "Submit salary increments",
  },
  {
    label: "Summary",
    to: "/increment-summary",
    icon: BarChart2,
    desc: "Department-wise totals",
  },
  {
    label: "Queue & Approvals",
    to: "/increment-queuelist",
    icon: CheckSquare,
    desc: "Approve pending increments",
  },
  {
    label: "Increment List",
    to: "/increment-list",
    icon: ListOrdered,
    desc: "Finalized increment records",
  },
  {
    label: "History",
    to: "/increment-history",
    icon: History,
    desc: "Year-wise increment log",
  },
] as const;

export function EvaluationTabNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="bg-card border border-border/60 rounded-xl shadow-xs overflow-hidden mb-5">
      {/* Top bar with module label */}
      <div className="px-5 py-2.5 border-b border-border/50 flex items-center gap-2.5 bg-primary/5">
        <div className="size-2 rounded-full bg-primary animate-pulse" />
        <span className="text-[11px] font-black uppercase tracking-widest text-primary">
          Evaluation & Increment Module
        </span>
      </div>

      {/* Tab scroll container */}
      <div className="overflow-x-auto">
        <div className="flex items-stretch min-w-max">
          {EVAL_TABS.map((tab) => {
            const isActive = currentPath === tab.to;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={[
                  "flex flex-col items-center justify-center gap-1 px-4 py-3 border-r border-border/40 last:border-r-0 transition-all duration-200 min-w-[130px] group relative",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                ].join(" ")}
              >
                {isActive && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-foreground/40" />
                )}
                <Icon
                  className={[
                    "size-4 transition-transform duration-200",
                    isActive ? "scale-110" : "group-hover:scale-105",
                  ].join(" ")}
                />
                <span className="text-[11px] font-bold leading-tight text-center">
                  {tab.label}
                </span>
                <span
                  className={[
                    "text-[9px] leading-tight text-center hidden sm:block",
                    isActive ? "text-primary-foreground/70" : "text-muted-foreground/60",
                  ].join(" ")}
                >
                  {tab.desc}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
