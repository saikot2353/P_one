import { useState, useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell, Search, MessagesSquare, Sun, Moon, CornerDownLeft,
  UserRound, Fingerprint, CalendarDays, CalendarX, Clock, Coins, Users,
  RefreshCw, FileText, BarChart3, ClipboardCheck, ShieldAlert, Timer,
  CreditCard, Cpu, ShieldCheck as ComplianceIcon, Lightbulb, LayoutDashboard, UserPlus
} from "lucide-react";
import avatarImg from "./avatar.png";

interface SearchMenuLink {
  label: string;
  parent: string;
  to: string;
  description?: string;
}

const searchableMenus: SearchMenuLink[] = [
  { label: "Dashboard Overview", parent: "Home", to: "/" },
  // Personnel Info
  { label: "Personnel List", parent: "Personnel Info", to: "/personnel-list", description: "View and filter complete staff profiles" },
  { label: "Manpower Basic Form", parent: "Personnel Info", to: "/" },
  { label: "Manpower Basic List", parent: "Personnel Info", to: "/" },
  { label: "Personnel QR Scanner", parent: "Personnel Info", to: "/" },
  { label: "Salary Pay Scale Builder", parent: "Personnel Info", to: "/" },
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
  // e-Recruitment
  { label: "Recruitment Basic ID Setup", parent: "e-Recruitment", to: "/recruitment-basic-setup", description: "Define recruitment rules and temp ID setup" },
  { label: "Recruitment Basic Entry Form", parent: "e-Recruitment", to: "/recruitment-basic-entry", description: "Register new candidate profiles temporarily" },
  { label: "Recruitment Basic Info List", parent: "e-Recruitment", to: "/recruitment-basic-list", description: "View directory of registered temp profiles" },
  { label: "Recruitment Configuration Settings", parent: "e-Recruitment", to: "/recruitment-configuration", description: "Manage SMV banks, machine list, operations etc." },
  { label: "Recruitment Assessment List", parent: "e-Recruitment", to: "/recruitment-assessment-list", description: "Floor evaluation and HR approval workflow" },
];

// Dynamically fetch search category visual icon
function getCategoryIcon(parent: string) {
  switch (parent) {
    case "Home": return LayoutDashboard;
    case "Personnel Info": return UserRound;
    case "Attendance": return Fingerprint;
    case "Roster": return CalendarDays;
    case "Leave": return CalendarX;
    case "Manage Shift": return Clock;
    case "Budget": return Coins;
    case "Transfer": return RefreshCw;
    case "HR Policy": return FileText;
    case "KPI": return BarChart3;
    case "Evaluation": return ClipboardCheck;
    case "Disciplinary Action": return ShieldAlert;
    case "Manage Overtime": return Timer;
    case "Manage Allowance": return CreditCard;
    case "Processes": return Cpu;
    case "Compliance": return ComplianceIcon;
    case "Idea Share": return Lightbulb;
    case "e-Recruitment": return UserPlus;
    default: return LayoutDashboard;
  }
}

export function Topbar() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });

  // Global Command Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Keypress event listener for keyboard shortcut Ctrl+K / Cmd+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Filter list matching current input query
  const filteredResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      // Show default active system paths for Quick Access
      return searchableMenus.filter(m => m.to !== "/").slice(0, 5);
    }
    return searchableMenus.filter(item => 
      item.label.toLowerCase().includes(q) ||
      item.parent.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Sync index boundary
  useEffect(() => {
    setFocusedIndex(0);
  }, [searchQuery]);

  // Handle keyboard traversal inside the command popup
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchOpen || filteredResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex(prev => (prev + 1) % filteredResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
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

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Close dropdown on click outside
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".global-search-container")) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", clickHandler);
    return () => document.removeEventListener("mousedown", clickHandler);
  }, []);

  // Dynamic Greeting based on time of day (Safe for SSR hydration)
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good morning");
    else if (hours < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <header className="h-14 px-5 flex items-center gap-3 border-b border-border/60 bg-card/90 backdrop-blur-md sticky top-0 z-20 transition-colors duration-300 shadow-2xs">
      <div>
        <h1 className="text-sm font-bold tracking-tight text-foreground">{greeting}, Shapno 👋</h1>
        <p className="text-[11px] text-muted-foreground/90 font-medium font-sans">Here's what's happening across your organization today.</p>
      </div>
      <div className="ml-auto flex items-center gap-2.5">
        
        {/* Interactive Global Menu Search Container */}
        <div className="relative hidden md:block global-search-container">
          <div className="relative group">
            <Search className="size-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              id="global-menu-search-input"
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search menus (e.g. Leave Application, Roster...)"
              className="w-76 focus:w-88 pl-10 pr-14 h-9.5 rounded-full bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/40 focus:border-primary/80 focus:bg-card focus:ring-4 focus:ring-primary/10 outline-none text-xs transition-all duration-300 font-sans font-bold"
            />
            <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black px-2 py-0.5 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 shadow-2xs select-none pointer-events-none">⌘K</kbd>
          </div>

          {/* Search Result Popover List */}
          {isSearchOpen && (
            <div className="absolute right-0 top-11.5 w-[390px] bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              
              {/* Header inside popover */}
              <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <span className="text-amber-500 animate-pulse">⚡</span>
                  <span>{searchQuery ? `Matching Menus (${filteredResults.length})` : "Quick Access Menus"}</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200/50 dark:bg-slate-800 text-[8.5px] font-bold lowercase tracking-normal">esc to close</span>
              </div>

              {/* Scrollable list items */}
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {filteredResults.map((item, idx) => {
                  const isFocused = idx === focusedIndex;
                  const isActiveRoute = item.to !== "/";
                  const CategoryIcon = getCategoryIcon(item.parent);

                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className={`w-full group text-left flex items-center gap-3 p-2.5 rounded-xl transition duration-150 border ${
                        isFocused
                          ? "bg-primary/[0.08] dark:bg-primary/[0.12] border-primary/20 text-primary"
                          : "hover:bg-slate-50/70 dark:hover:bg-slate-900/40 border-transparent text-slate-700 dark:text-slate-350"
                      }`}
                    >
                      {/* Left: Beautiful visually distinct Category Icon Box */}
                      <div className={`size-8 rounded-lg flex items-center justify-center border shrink-0 transition-transform duration-300 ${
                        isFocused ? "scale-105" : ""
                      } ${
                        isActiveRoute 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                          : "bg-slate-100 border-slate-200/40 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500"
                      }`}>
                        <CategoryIcon className="size-4" />
                      </div>
                      
                      {/* Middle: Text details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black tracking-tight leading-none">
                            {item.label}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[7.5px] font-black uppercase tracking-wider scale-90 ${
                            isActiveRoute 
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                              : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                          }`}>
                            {item.parent}
                          </span>
                        </div>
                        {item.description && (
                          <div className="text-[9.5px] text-slate-450 dark:text-slate-400 mt-1 font-semibold leading-tight">
                            {item.description}
                          </div>
                        )}
                      </div>

                      {/* Right: Enter key badge */}
                      {isFocused && (
                        <div className="flex items-center gap-1.5 text-[8px] font-black px-2 py-1 rounded-md bg-primary text-white shadow-xs animate-pulse">
                          <span>Enter</span>
                          <CornerDownLeft className="size-2.5" />
                        </div>
                      )}
                    </Link>
                  );
                })}

                {filteredResults.length === 0 && (
                  <div className="px-4 py-8 text-center text-slate-400 font-bold text-[10.5px]">
                    No corporate menus found matching query.
                  </div>
                )}
              </div>

              {/* Search Instructions Bar */}
              <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/60 text-[9px] text-slate-400 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span>↑↓</span>
                  <span>to navigate</span>
                </span>
                <span>Enter to open</span>
              </div>

            </div>
          )}

        </div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative size-9 grid place-items-center rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors duration-200"
          title="Toggle Light/Dark Theme"
        >
          {theme === "dark" ? (
            <Sun className="size-4.5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="size-4.5 text-primary transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>
        <button className="relative size-9 grid place-items-center rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors duration-200">
          <MessagesSquare className="size-4.5" />
        </button>
        
        {/* Notification Bell with 0 Badge */}
        <div className="relative flex items-center mr-1">
          <button className="relative size-9 grid place-items-center rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors duration-200">
            <Bell className="size-4.5" />
            <span className="absolute top-1 left-1.5 px-1 py-0.2 text-[8px] font-extrabold bg-[#1e40af] dark:bg-blue-600 text-white rounded shadow-2xs min-w-[12px] text-center">
              0
            </span>
          </button>
        </div>

        {/* User Profile Block */}
        <div className="flex items-center gap-3 pl-3.5 border-l border-border/60">
          <div className="text-right hidden lg:block">
            <div className="text-xs font-bold text-foreground">Tahmid Afsar</div>
            <div className="text-[9px] font-bold text-muted-foreground/85 mt-0.5">Pakiza Software Limited (PSL-Operation)</div>
          </div>
          <div className="size-9 rounded-full overflow-hidden border border-border/80 shadow-2xs flex-shrink-0 bg-muted">
            <img 
              src={avatarImg} 
              alt="Tahmid Afsar" 
              className="size-full object-cover" 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
