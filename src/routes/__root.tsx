import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Chatbot } from "../components/ui/chatbot";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CRIPTON HRIS" },
      { name: "description", content: "Modern HR management software for high-performing teams." },
      { name: "author", content: "CRIPTON" },
      { property: "og:title", content: "CRIPTON HRIS" },
      {
        property: "og:description",
        content: "Modern HR management software for high-performing teams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "CRIPTON HRIS" },
      {
        name: "twitter:description",
        content: "Modern HR management software for high-performing teams.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/05484a77-948f-46d7-a418-7e21a7ec3b5c/id-preview-327f3108--896dc413-e37e-4671-9344-6489d69a3e7d.lovable.app-1778999534611.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/05484a77-948f-46d7-a418-7e21a7ec3b5c/id-preview-327f3108--896dc413-e37e-4671-9344-6489d69a3e7d.lovable.app-1778999534611.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("cripton_logged_in_strict") === "true";
      const isPublicPath = currentPath === "/login" || currentPath === "/e-recruitment-form";

      if (!isLoggedIn && !isPublicPath) {
        navigate({ to: "/login" });
      }
    }
  }, [currentPath, navigate]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const versionKey = "hris_master_data_version_v12";
      if (localStorage.getItem(versionKey) !== "true") {
        const keysToClear = [
          "hris_organizations",
          "hris_areas",
          "hris_company_mappings",
          "hris_departments",
          "hris_sections",
          "hris_units",
          "hris_lines",
          "hris_designations",
          "hris_job_titles",
          "hris_employee_types",
          "hris_grades",
          "hris_job_natures",
          "hris_countries",
          "hris_religions",
          "hris_places_in_bd",
          "hris_educational_qualifications",
          "hris_educational_institutions",
          "hris_educational_results",
          "hris_training_categories",
          "hris_shifts",
          "hris_ot_config",
          "hris_abnormal_shifts",
          "hris_attendance_bonus_policy",
          "hris_leave_settings",
          "hris_policy_names",
          "hris_allowance_rates",
          "hris_tiffin_rates",
          "hris_lunch_rates",
          "hris_conveyance_setups",
          "hris_bonus_settings",
          "recruitment_config_operations",
          "recruitment_config_machines",
          "recruitment_config_op_grades",
          "recruitment_config_measurements",
          "recruitment_config_smv_bank",
          "recruitment_config_eff_grades",
          "recruitment_config_grade_vs_grade",
          "recruitment_config_multi_ss_v2",
          "recruitment_candidates",
          "recruitment_data_version",
          "recruitment_synced_employees",
        ];
        keysToClear.forEach((key) => localStorage.removeItem(key));
        localStorage.setItem(versionKey, "true");
        window.location.reload();
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Chatbot />
    </QueryClientProvider>
  );
}
