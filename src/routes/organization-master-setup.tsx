import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { OrgMasterSidebar, orgMasterNavGroups } from "@/components/dashboard/OrgMasterSidebar";
import { OrgMasterTopbar, masterSearchableItems } from "@/components/dashboard/OrgMasterTopbar";
import { CompanySetupView, type TabType as CompanySetupTabType } from "@/routes/company-setup";
import { StructureSetupView, type TabType as StructureTabType } from "@/routes/configure-structure";
import { LocationManagementView, type LocationTabType } from "@/components/organization/LocationManagementView";
import { PersonnelListView } from "@/routes/personnel-list";
import {
  Building2,
  FolderTree,
  Factory,
  MapPin,
  Users,
  UserCheck,
  Award,
  BookUser,
  Handshake,
  Briefcase,
  Truck,
  UserPlus,
  ShoppingBag,
  Navigation,
  Package,
  PackageSearch,
  Layers,
  BadgeCheck,
  Palette,
  Scale,
  Warehouse,
  Cpu,
  Boxes,
  Banknote,
  Landmark,
  Coins,
  CalendarClock,
  CreditCard,
  Percent,
  Calculator,
  TrendingUp,
  Target,
  FolderKanban,
  Scissors,
  FileCheck,
  Ship,
  Anchor,
  SlidersHorizontal,
  FileText,
  CalendarDays,
  HelpCircle,
  Tag,
  Hash,
  ChevronRight,
  Search,
  Sparkles,
  ShieldCheck,
  Database,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  X,
} from "lucide-react";

interface SearchParams {
  tab?: string;
  subtab?: string;
}

export const Route = createFileRoute("/organization-master-setup")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      tab: typeof search.tab === "string" ? search.tab : undefined,
      subtab: typeof search.subtab === "string" ? search.subtab : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Organization Master Setup — CRIPTON ERP" },
      {
        name: "description",
        content:
          "Centralized enterprise organization master setup, structures, business entities and global references.",
      },
    ],
  }),
  component: OrgMasterSetupPage,
});

function OrgMasterSetupPage() {
  const { tab, subtab } = Route.useSearch();
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const currentActiveItem = useMemo(() => {
    if (!tab) return null;
    return masterSearchableItems.find((item) => item.tabKey === tab) || null;
  }, [tab]);

  const filteredGroups = useMemo(() => {
    if (!filterText.trim()) return orgMasterNavGroups;

    const q = filterText.toLowerCase().trim();
    return orgMasterNavGroups
      .map((g) => ({
        ...g,
        subitems: g.subitems.filter(
          (sub) =>
            sub.label.toLowerCase().includes(q) ||
            (sub.description && sub.description.toLowerCase().includes(q)),
        ),
      }))
      .filter((g) => g.subitems.length > 0);
  }, [filterText]);

  const handleSelectTab = (newTab: string) => {
    navigate({
      to: "/organization-master-setup",
      search: { tab: newTab },
    });
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      {/* Module Sidebar (Wider: w-72 md:w-76 lg:w-80, responsive md:flex + mobile drawer) */}
      <OrgMasterSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Module Topbar */}
        <OrgMasterTopbar
          onSelectTab={handleSelectTab}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((v) => !v)}
        />

        <div className="p-3 sm:p-4 lg:p-4.5 space-y-3.5 w-full">
          {/* Detail View for Selected Tab */}
          {currentActiveItem ? (
            currentActiveItem.tabKey === "employee-management" ? (
              <PersonnelListView
                embedded={true}
                onBackToOverview={() =>
                  navigate({
                    to: "/organization-master-setup",
                    search: {},
                  })
                }
              />
            ) : currentActiveItem.tabKey === "location-management" ? (
              <LocationManagementView
                embedded={true}
                initialTab={(subtab as LocationTabType) || "country"}
                onTabChange={(newSubTab) => {
                  navigate({
                    to: "/organization-master-setup",
                    search: { tab: "location-management", subtab: newSubTab },
                  });
                }}
                onBackToOverview={() =>
                  navigate({
                    to: "/organization-master-setup",
                    search: {},
                  })
                }
              />
            ) : currentActiveItem.tabKey === "org-structure" ? (
              <StructureSetupView
                embedded={true}
                initialTab={(subtab as StructureTabType) || "group"}
                onTabChange={(newSubTab) => {
                  navigate({
                    to: "/organization-master-setup",
                    search: { tab: "org-structure", subtab: newSubTab },
                  });
                }}
                onBackToOverview={() =>
                  navigate({
                    to: "/organization-master-setup",
                    search: {},
                  })
                }
              />
            ) : currentActiveItem.tabKey === "company-management" ? (
              <CompanySetupView
                embedded={true}
                initialTab={(subtab as CompanySetupTabType) || "department"}
                onTabChange={(newSubTab) => {
                  navigate({
                    to: "/organization-master-setup",
                    search: { tab: "company-management", subtab: newSubTab },
                  });
                }}
                onBackToOverview={() =>
                  navigate({
                    to: "/organization-master-setup",
                    search: {},
                  })
                }
              />
            ) : (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Breadcrumb / Back button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() =>
                    navigate({
                      to: "/organization-master-setup",
                      search: {},
                    })
                  }
                  className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors"
                >
                  <ArrowLeft className="size-4" />
                  <span>Back to Master Overview (All {masterSearchableItems.length} Menus)</span>
                </button>

                <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                  Category: {currentActiveItem.parent}
                </span>
              </div>

              {/* Master Detail Header Card */}
              <div className="relative overflow-hidden rounded-2xl border border-sky-200 dark:border-sky-800/60 bg-gradient-to-br from-sky-50/70 via-card to-blue-50/40 dark:from-sky-950/20 dark:via-card dark:to-blue-950/10 p-6 md:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="size-14 rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/25 flex items-center justify-center shrink-0">
                      <currentActiveItem.icon className="size-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                          {currentActiveItem.label}
                        </h2>
                        {currentActiveItem.isSoon ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60">
                            Coming Soon
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                            Active Master Setup
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                        {currentActiveItem.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        alert(`Master configuration for ${currentActiveItem.label} is ready.`)
                      }
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-500 transition shadow-sm inline-flex items-center gap-2"
                    >
                      <Sparkles className="size-4" />
                      Configure Schema
                    </button>
                  </div>
                </div>
              </div>

              {/* Master Details Content Blocks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl border border-border/70 bg-card shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                    <Database className="size-4" />
                    Master Data Scope
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Provides standardized authority records and central definitions across ERP
                    modules (HRIS, Merchandising, Accounts, Procurement, Inventory).
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-border/70 bg-card shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <ShieldCheck className="size-4" />
                    Validation & Governance
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Strict referential integrity, auditing history, role permissions and
                    cross-company synchronization.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-border/70 bg-card shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    <CheckCircle2 className="size-4" />
                    Sidebar Navigation
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Accessible directly via the Organization Master Setup sidebar under{" "}
                    <span className="font-bold text-foreground">{currentActiveItem.parent}</span>.
                  </p>
                </div>
              </div>

              {/* Sister Menus in same Section */}
              <div className="p-6 rounded-2xl border border-border/70 bg-card shadow-2xs space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Related Menus in {currentActiveItem.parent}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {masterSearchableItems
                    .filter((m) => m.parent === currentActiveItem.parent)
                    .map((item) => {
                      const isCurrent = item.tabKey === currentActiveItem.tabKey;
                      const IconComp = item.icon;
                      return (
                        <button
                          key={item.tabKey}
                          onClick={() => handleSelectTab(item.tabKey)}
                          className={`p-3.5 rounded-xl text-left border transition flex items-start gap-3 ${
                            isCurrent
                              ? "border-sky-500 bg-sky-50/50 dark:bg-sky-950/30"
                              : "border-border/60 hover:border-sky-300 dark:hover:border-sky-700 bg-card hover:bg-muted/40"
                          }`}
                        >
                          <div
                            className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isCurrent ? "bg-sky-600 text-white" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <IconComp className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <p className="text-xs font-bold text-foreground truncate">
                                {item.label}
                              </p>
                              {item.isSoon && (
                                <span className="px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 shrink-0">
                                  Soon
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
            )
          ) : (
            /* Overview Hub View (When no tab is selected) - Full Width Minimum Gap */
            <div className="space-y-3.5 animate-in fade-in duration-200">
              {/* Header Hero Banner */}
              <div className="relative overflow-hidden rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-4 sm:p-5 md:p-6 text-white shadow-xl shadow-sky-600/10">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 backdrop-blur-md border border-white/20">
                      <Building2 className="size-3" />
                      <span>Enterprise Master Architecture</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
                      Organization Master Setup
                    </h2>
                    <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed font-medium">
                      Single source of truth for company hierarchies, business partners, product
                      master catalogs, financial parameters, and global classifications.
                    </p>
                  </div>

                  {/* Summary Metric Badges */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[90px]">
                      <div className="text-xl font-black text-white">{orgMasterNavGroups.length}</div>
                      <div className="text-[9.5px] font-bold text-sky-200 uppercase tracking-wider">
                        Categories
                      </div>
                    </div>
                    <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[90px]">
                      <div className="text-xl font-black text-white">{masterSearchableItems.length}</div>
                      <div className="text-[9.5px] font-bold text-sky-200 uppercase tracking-wider">
                        Master Menus
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative background circle */}
                <div className="absolute -right-16 -bottom-16 size-64 rounded-full bg-white/5 pointer-events-none blur-2xl" />
              </div>

              {/* Search Bar Only */}
              <div className="relative w-full p-2.5 rounded-xl border border-border/70 bg-card shadow-2xs">
                <div className="relative w-full max-w-lg">
                  <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder="Search master setups by name or description (e.g. Company, Tax, Bank...)"
                    className="w-full pl-9.5 pr-8 py-2 text-xs rounded-lg bg-muted/60 border border-transparent focus:border-sky-500 focus:bg-background outline-none transition font-medium"
                  />
                  {filterText && (
                    <button
                      onClick={() => setFilterText("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                      title="Clear search"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 9 Category Grid Sections - Full Width, 4 columns on large screens with minimum gap */}
              <div className="space-y-3.5">
                {filteredGroups.map((group) => {
                  const GroupIcon = group.icon;
                  return (
                    <div
                      key={group.label}
                      className="rounded-2xl border border-border/80 bg-card p-4 sm:p-4.5 md:p-5 shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                            <GroupIcon className="size-4.5" />
                          </div>
                          <h3 className="text-sm sm:text-base font-black tracking-tight text-foreground">
                            {group.label}
                          </h3>
                        </div>
                      </div>

                      {/* Sub-item Grid: 4 columns on xl/2xl to fill width with minimal gap */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2.5">
                        {group.subitems.map((sub) => {
                          const SubIcon = sub.icon;
                          return (
                            <button
                              key={sub.tabKey || sub.label}
                              onClick={() => sub.tabKey && handleSelectTab(sub.tabKey)}
                              className="group p-3.5 rounded-xl border border-border/60 hover:border-sky-400 dark:hover:border-sky-700 bg-background/50 hover:bg-sky-50/40 dark:hover:bg-sky-950/20 text-left transition duration-200 flex flex-col justify-between space-y-2 shadow-2xs"
                            >
                              <div className="flex items-start gap-2.5">
                                <div className="size-8.5 rounded-lg bg-muted group-hover:bg-sky-500 group-hover:text-white text-foreground/80 flex items-center justify-center shrink-0 transition-colors">
                                  <SubIcon className="size-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <h4 className="text-xs font-bold text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">
                                        {sub.label}
                                      </h4>
                                      {sub.isSoon && (
                                        <span className="px-1.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
                                          Soon
                                        </span>
                                      )}
                                    </div>
                                    <ChevronRight className="size-3 text-muted-foreground group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                                  </div>
                                  <p className="text-[10.5px] text-muted-foreground leading-relaxed line-clamp-2 mt-1">
                                    {sub.description}
                                  </p>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[9.5px] font-semibold text-muted-foreground/80">
                                <span className="truncate">Key: {sub.tabKey}</span>
                                {sub.isSoon ? (
                                  <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0 ml-1">
                                    Coming Soon
                                  </span>
                                ) : (
                                  <span className="text-sky-600 dark:text-sky-400 font-bold group-hover:underline shrink-0 ml-1">
                                    Configure &rarr;
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
