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
  { label: "Evaluate", to: "/evaluation-propose", icon: ClipboardList },
  { label: "Increment List", to: "/increment-list", icon: ListOrdered },
  { label: "Summary", to: "/increment-summary", icon: BarChart2 },
  { label: "History", to: "/increment-history", icon: History },
] as const;

export function EvaluationTabNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="mb-6 flex flex-col gap-4">
      {/* Top bar with module label */}
      <div className="flex items-center gap-2.5">
        <div className="size-2 rounded-full bg-primary animate-pulse" />
        <span className="text-sm font-bold tracking-wide text-primary uppercase">
          Evaluation & Increment Module
        </span>
      </div>

      {/* Tab scroll container */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border/50 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {EVAL_TABS.map((tab) => {
          const isActive = currentPath === tab.to;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={[
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")}
            >
              <Icon className="size-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
