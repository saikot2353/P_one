import React, { useState, useEffect, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  File,
  ArrowLeft,
  Settings,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import type { NavItem } from "./navigation/types";

export interface BaseSidebarProps {
  moduleTitle: string;
  moduleSubtitle?: string;
  moduleBadge?: string;
  moduleIcon?: React.ElementType;
  nav: NavItem[];
  storageKey?: string;
}

export function BaseSidebar({
  moduleTitle,
  moduleSubtitle = "Enterprise Suite",
  moduleBadge = "Module",
  moduleIcon: ModuleIcon = LayoutDashboard,
  nav,
  storageKey = "sidebar_scroll",
}: BaseSidebarProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const scrollRef = useRef<HTMLElement>(null);
  const isTransitioning = useRef(false);

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    nav.forEach((item) => {
      if (item.subitems) {
        const isChildActive = item.subitems.some((sub) => {
          if (sub.to && sub.to !== "/" && sub.to === currentPath) return true;
          if (
            sub.subitems &&
            sub.subitems.some((nested) => {
              if (nested.to && nested.to !== "/" && nested.to === currentPath) return true;
              if (
                nested.subitems &&
                nested.subitems.some((deep) => deep.to !== "/" && deep.to === currentPath)
              )
                return true;
              return false;
            })
          )
            return true;
          return false;
        });
        if (isChildActive) {
          initial[item.label] = true;
        }
        item.subitems.forEach((sub) => {
          if (
            sub.subitems &&
            sub.subitems.some((nested) => {
              if (nested.to && nested.to !== "/" && nested.to === currentPath) return true;
              if (
                nested.subitems &&
                nested.subitems.some((deep) => deep.to !== "/" && deep.to === currentPath)
              )
                return true;
              return false;
            })
          ) {
            initial[sub.label] = true;
          }
        });
      }
    });

    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(`${storageKey}_menus`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return { ...parsed, ...initial };
        } catch (e) {}
      }
    }
    return initial;
  });

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      sessionStorage.setItem(`${storageKey}_menus`, JSON.stringify(openMenus));
    }
  }, [openMenus, storageKey]);

  useEffect(() => {
    if (typeof window !== "undefined" && scrollRef.current) {
      const savedScroll = sessionStorage.getItem(storageKey);
      if (savedScroll) {
        const targetScroll = parseInt(savedScroll, 10);
        scrollRef.current.scrollTop = targetScroll;
        const timer = setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = targetScroll;
          }
        }, 60);
        return () => clearTimeout(timer);
      }
    }
  }, [storageKey]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (isTransitioning.current) return;
    sessionStorage.setItem(storageKey, e.currentTarget.scrollTop.toString());
  };

  const handleNavClick = () => {
    isTransitioning.current = true;
    setTimeout(() => {
      isTransitioning.current = false;
    }, 400);
  };

  const toggleMenu = (label: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const userRole =
    typeof window !== "undefined"
      ? (() => {
          try {
            const u = localStorage.getItem("cripton_current_user");
            if (u) return JSON.parse(u).role?.toLowerCase();
          } catch (e) {}
          return "admin";
        })()
      : "admin";

  const filteredNav = nav
    .filter((item) => !item.hidden)
    .map((item) => {
      if (item.label === "Digital Business Card" && item.subitems) {
        const isRegularEmp = userRole === "employee";
        const filteredSubs = item.subitems.filter((sub) => {
          if (isRegularEmp && sub.to === "/digital-business-cards-admin") return false;
          return true;
        });
        return { ...item, subitems: filteredSubs };
      }
      return item;
    });

  if (typeof window !== "undefined" && window.location.search.includes("embed=true")) {
    return null;
  }

  return (
    <aside className="hidden lg:flex w-64 h-screen sticky top-0 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300">
      {/* Header Link back to Module Selection */}
      <Link
        to="/module-selection"
        className="px-5 py-4 flex items-center gap-2.5 border-b border-sidebar-border/80 group transition-all duration-300 hover:bg-sidebar-accent/30 cursor-pointer relative z-50"
      >
        <div className="absolute left-[70px] top-[80%] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none z-50">
          <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl flex items-center gap-1.5 whitespace-nowrap">
            <LayoutDashboard className="size-3" />
            Switch to Another Module
          </div>
        </div>

        {/* 3D Flip Logo */}
        <div className="relative size-8.5 rounded-xl text-sm tracking-tight [perspective:1000px]">
          <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-glow font-extrabold text-primary-foreground shadow-[0_4px_12px_oklch(0.48_0.19_255/0.25)] flex items-center justify-center rounded-xl [backface-visibility:hidden]">
              C
            </div>
            <div className="absolute inset-0 bg-sidebar-primary text-primary-foreground flex items-center justify-center rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-md border-2 border-primary/20">
              <ArrowLeft className="size-4.5" />
            </div>
          </div>
        </div>

        <div className="leading-tight truncate">
          <div className="font-extrabold tracking-tight text-[13px] text-sidebar-foreground group-hover:text-primary transition-colors duration-300 truncate">
            {moduleTitle}
          </div>
          <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-sidebar-primary flex items-center gap-1">
            <span>CRIPTON</span>
            <span className="opacity-40">•</span>
            <span className="text-amber-500 font-black">{moduleBadge}</span>
          </div>
        </div>
      </Link>

      {/* Navigation list */}
      <nav
        ref={scrollRef}
        onScroll={handleScroll}
        onClick={handleNavClick}
        className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none"
      >
        <div className="px-2.5 pb-2 text-[9px] font-extrabold uppercase tracking-widest text-sidebar-foreground/45 flex items-center justify-between">
          <span>{moduleSubtitle}</span>
        </div>

        {filteredNav.map((item) => {
          const Icon = item.icon;

          const isParentActive =
            item.to === currentPath ||
            (item.activeRoutes && item.activeRoutes.some((r) => r === currentPath)) ||
            (item.subitems &&
              item.subitems.some((sub) => {
                if (sub.to && sub.to !== "/" && sub.to === currentPath) return true;
                if (
                  sub.subitems &&
                  sub.subitems.some((nested) => nested.to !== "/" && nested.to === currentPath)
                )
                  return true;
                return false;
              }));

          if (!item.subitems) {
            return (
              <div
                key={item.label}
                className="border-b border-sidebar-border/30 last:border-0 pb-1"
              >
                <Link
                  to={item.to || "/"}
                  search={item.search}
                  className={[
                    "group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] font-semibold transition-all duration-200",
                    isParentActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-2xs"
                      : "text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  ].join(" ")}
                >
                  <Icon className="size-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:text-sidebar-primary" />
                  <span>{item.label}</span>
                  {isParentActive && (
                    <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary shadow-[0_0_8px_var(--sidebar-primary)] animate-pulse" />
                  )}
                </Link>
              </div>
            );
          }

          const isOpen = openMenus[item.label];

          return (
            <div
              key={item.label}
              className="border-b border-sidebar-border/30 last:border-0 pb-1"
            >
              <button
                onClick={(e) => toggleMenu(item.label, e)}
                className={[
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] font-semibold transition-all duration-200",
                  isParentActive
                    ? "bg-sidebar-accent/50 text-sidebar-foreground font-bold"
                    : "text-sidebar-foreground/85 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "size-3.5 transition-transform duration-300",
                    isParentActive ? "text-primary" : "text-sidebar-foreground/70",
                  ].join(" ")}
                />
                <span className="flex-1 truncate text-left">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="bg-amber-500/10 text-amber-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md mr-1 leading-none shadow-[0_0_8px_oklch(0.7_0.2_50/0.15)] border border-amber-500/20">
                    {item.count}
                  </span>
                )}
                {isOpen ? (
                  <ChevronDown className="size-3.5 text-sidebar-foreground/45 transition-transform duration-300 rotate-180" />
                ) : (
                  <ChevronRight className="size-3.5 text-sidebar-foreground/45 transition-transform duration-300" />
                )}
              </button>

              <div
                className={[
                  "overflow-hidden transition-all duration-300 space-y-0.5 pl-3.5 bg-sidebar-accent/25 rounded-xl",
                  isOpen ? "max-h-[2500px] opacity-100 py-1.5 mt-0.5" : "max-h-0 opacity-0",
                ].join(" ")}
              >
                {item.subitems
                  .filter((sub) => !sub.hidden)
                  .map((sub) => {
                    if (sub.subitems) {
                      const isSubOpen = openMenus[sub.label];
                      const isSubActive = sub.subitems.some((nested) => {
                        if (nested.to && nested.to !== "/" && nested.to === currentPath) return true;
                        if (
                          nested.subitems &&
                          nested.subitems.some((deep) => deep.to !== "/" && deep.to === currentPath)
                        )
                          return true;
                        return false;
                      });

                      return (
                        <div key={sub.label} className="space-y-0.5">
                          <button
                            onClick={(e) => toggleMenu(sub.label, e)}
                            className={[
                              "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150",
                              isSubActive
                                ? "text-sidebar-foreground font-bold"
                                : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                            ].join(" ")}
                          >
                            <div className="flex items-center gap-2">
                              <File
                                className={[
                                  "size-3 shrink-0",
                                  isSubActive
                                    ? "text-primary font-black"
                                    : "text-sidebar-foreground/45",
                                ].join(" ")}
                              />
                              <span className="truncate">{sub.label}</span>
                            </div>
                            {sub.count !== undefined && sub.count > 0 && (
                              <span className="bg-amber-500/10 text-amber-600 text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none shadow-[0_0_8px_oklch(0.7_0.2_50/0.15)] border border-amber-500/20">
                                {sub.count}
                              </span>
                            )}
                            {isSubOpen ? (
                              <ChevronDown className="size-3 text-sidebar-foreground/45 transition-transform duration-300 rotate-180" />
                            ) : (
                              <ChevronRight className="size-3 text-sidebar-foreground/45 transition-transform duration-300" />
                            )}
                          </button>

                          <div
                            className={[
                              "overflow-hidden transition-all duration-300 space-y-0.5 pl-6",
                              isSubOpen
                                ? "max-h-[1500px] opacity-100 py-0.5 mt-0.5"
                                : "max-h-0 opacity-0",
                            ].join(" ")}
                          >
                            {sub.subitems
                              .filter((nested) => !nested.hidden)
                              .map((nested) => {
                                const isNestedActive =
                                  nested.to !== "/" && nested.to === currentPath;

                                return (
                                  <Link
                                    key={nested.label}
                                    to={nested.to || "/"}
                                    search={nested.search}
                                    className={[
                                      "group flex items-center justify-between px-3 py-1.5 rounded-md text-[11px] font-medium transition-all duration-150",
                                      isNestedActive
                                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    ].join(" ")}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={[
                                          "w-1.5 h-1.5 rounded-full shrink-0",
                                          isNestedActive
                                            ? "bg-primary-foreground"
                                            : "bg-sidebar-foreground/30",
                                        ].join(" ")}
                                      />
                                      <span className="truncate">{nested.label}</span>
                                    </div>
                                  </Link>
                                );
                              })}
                          </div>
                        </div>
                      );
                    }

                    const isSubActive =
                      sub.to !== "/" &&
                      (sub.to === currentPath ||
                        (currentPath.startsWith(sub.to || "") && sub.to !== "/"));

                    return (
                      <Link
                        key={sub.label}
                        to={sub.to || "/"}
                        search={sub.search}
                        className={[
                          "group flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150",
                          isSubActive
                            ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                            : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-2">
                          <File
                            className={[
                              "size-3 shrink-0",
                              isSubActive
                                ? "text-primary-foreground"
                                : "text-sidebar-foreground/45",
                            ].join(" ")}
                          />
                          <span className="truncate">{sub.label}</span>
                        </div>
                        {sub.count !== undefined && sub.count > 0 && (
                          <span className="bg-amber-500/10 text-amber-600 text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none border border-amber-500/20">
                            {sub.count}
                          </span>
                        )}
                      </Link>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer controls */}
      <div className="p-3 border-t border-sidebar-border/80 flex items-center justify-between gap-1 text-[11px]">
        <Link
          to="/configure-structure"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors group"
        >
          <Settings className="size-3.5 transition-transform duration-300 group-hover:rotate-45" />
          <span>Settings</span>
        </Link>
        <Link
          to="/hr-policy"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors group"
        >
          <LifeBuoy className="size-3.5 transition-transform duration-300 group-hover:scale-110" />
          <span>Support</span>
        </Link>
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("cripton_current_user");
              window.location.href = "/";
            }
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sidebar-foreground/60 hover:text-rose-600 hover:bg-rose-500/10 transition-colors group"
          title="Sign Out"
        >
          <LogOut className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 text-rose-500" />
        </button>
      </div>
    </aside>
  );
}

