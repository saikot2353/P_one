import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Users,
  Calculator,
  ShoppingCart,
  Package,
  Monitor,
  Truck,
  Banknote,
  Target,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  Store,
} from "lucide-react";

export const Route = createFileRoute("/module-selection")({
  component: ModuleSelectionPage,
});

type Theme = "dark" | "light";

/* ─────────── Animated Background ─────────── */
function AnimatedBackground({ theme }: { theme: Theme }) {
  return (
    <div className={`fixed inset-0 z-0 transition-colors duration-1000 ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#f0f2f5]'}`}>
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated glowing orbs */}
        <div className={`absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-40 animate-[spin_20s_linear_infinite] origin-bottom-right ${theme === 'dark' ? 'bg-indigo-600/30' : 'bg-blue-400/30'}`} />
        <div className={`absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-40 animate-[spin_25s_linear_infinite_reverse] origin-top-left ${theme === 'dark' ? 'bg-purple-600/20' : 'bg-indigo-300/40'}`} />
        <div className={`absolute top-[20%] left-[60%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-30 animate-[pulse_10s_ease-in-out_infinite] ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-cyan-300/30'}`} />
      </div>
      
      {/* Grid overlay */}
      <div className={`absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiM4ODgiIGZpbGwtb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')] opacity-50`} />
    </div>
  );
}

/* ─────────── Module Data ─────────── */
const modules = [
  {
    id: "hris",
    name: "HRIS",
    description: "Human Resource Information System",
    icon: Users,
    color: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/20",
    path: "/",
  },
  {
    id: "merchandising",
    name: "Merchandising",
    description: "Product catalog and sales planning",
    icon: Store,
    color: "from-teal-500 to-emerald-600",
    shadow: "shadow-teal-500/20",
    path: "/merchandising-dashboard",
  },
  {
    id: "finance",
    name: "Finance & Accounting",
    description: "Manage accounts and financials",
    icon: Calculator,
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
    path: "/",
  },
  {
    id: "procurement",
    name: "Procurement Management",
    description: "Purchasing and vendor management",
    icon: ShoppingCart,
    color: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
    path: "/",
  },
  {
    id: "inventory",
    name: "Inventory Management",
    description: "Track stock and supplies",
    icon: Package,
    color: "from-purple-500 to-fuchsia-600",
    shadow: "shadow-purple-500/20",
    path: "/",
  },
  {
    id: "asset",
    name: "Asset Management",
    description: "Track company equipment",
    icon: Monitor,
    color: "from-rose-500 to-red-600",
    shadow: "shadow-rose-500/20",
    path: "/",
  },
  {
    id: "fleet",
    name: "Vehicle & Fleet",
    description: "Manage company vehicles",
    icon: Truck,
    color: "from-cyan-500 to-blue-600",
    shadow: "shadow-cyan-500/20",
    path: "/",
  },
  {
    id: "payroll",
    name: "Payroll Management",
    description: "Salary and compensation",
    icon: Banknote,
    color: "from-green-500 to-emerald-600",
    shadow: "shadow-green-500/20",
    path: "/",
  },
  {
    id: "project",
    name: "Project Management",
    description: "Tasks, timelines, and teams",
    icon: Target,
    color: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/20",
    path: "/",
  },
  {
    id: "dms",
    name: "DMS",
    description: "Document Management System",
    icon: FileText,
    color: "from-slate-500 to-gray-700",
    shadow: "shadow-slate-500/20",
    path: "/",
  },
  {
    id: "crm",
    name: "CRM",
    description: "Customer Relationship Management",
    icon: HeartHandshake,
    color: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/20",
    path: "/",
  },
  {
    id: "dashboard",
    name: "My Dashboard",
    description: "Personal overview and stats",
    icon: LayoutDashboard,
    color: "from-indigo-500 to-blue-600",
    shadow: "shadow-indigo-500/20",
    path: "/my-dashboard",
  },
];

export default function ModuleSelectionPage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme>("dark");
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  // Auto-detect system theme initially, or load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("app-theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("app-theme", newTheme);
  };

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen w-full font-sans selection:bg-indigo-500/30 overflow-x-hidden ${isDark ? 'text-white' : 'text-slate-900'}`}>
      <AnimatedBackground theme={theme} />
      
      {/* Header */}
      <header className={`relative z-10 w-full px-6 py-4 flex justify-between items-center border-b backdrop-blur-md transition-colors duration-500 ${isDark ? 'border-white/10 bg-black/20' : 'border-slate-200/50 bg-white/40'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-bold text-white text-xl">C</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">CRIPTON HRIS</h1>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Workspace Selection</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full backdrop-blur-md transition-all hover:scale-105 ${
              isDark 
                ? 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white' 
                : 'bg-black/5 hover:bg-black/10 text-slate-600 hover:text-slate-900'
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <div className={`h-6 w-[1px] ${isDark ? 'bg-white/10' : 'bg-slate-300'}`}></div>
          
          <button
            onClick={() => navigate({ to: '/login' })}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md transition-all hover:scale-105 text-sm font-medium ${
              isDark
                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20'
                : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200'
            }`}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex flex-col items-center">
        
        <div className="text-center max-w-2xl mb-16 space-y-4 animate-[fadeInDown_0.5s_ease-out]">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-2 ${
            isDark ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
          }`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            System Online
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Admin</span>
          </h2>
          <p className={`text-lg md:text-xl ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
            Select a module to continue to your workspace.
          </p>
        </div>

        {/* Grid Container */}
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
          {modules.map((module, idx) => {
            const Icon = module.icon;
            const isHovered = hoveredModule === module.id;
            
            return (
              <button
                key={module.id}
                onClick={() => navigate({ to: module.path })}
                onMouseEnter={() => setHoveredModule(module.id)}
                onMouseLeave={() => setHoveredModule(null)}
                className={`group relative text-left p-6 rounded-2xl backdrop-blur-xl transition-all duration-300 border ${
                  isDark 
                    ? 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.05] hover:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]' 
                    : 'bg-white/60 hover:bg-white border-slate-200/60 hover:border-indigo-200 shadow-xl shadow-slate-200/40 hover:shadow-indigo-500/10'
                }`}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${idx * 0.05}s both`
                }}
              >
                {/* Background glow on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.08] transition-opacity duration-300`} />
                
                <div className="relative flex flex-col h-full gap-4">
                  <div className="flex justify-between items-start">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br ${module.color} ${module.shadow} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                      <Icon size={26} className="text-white" />
                    </div>
                    
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isHovered 
                        ? (isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-indigo-600') 
                        : 'bg-transparent text-transparent'
                    }`}>
                      <ChevronRight size={18} className={isHovered ? "translate-x-0" : "-translate-x-2"} />
                    </div>
                  </div>
                  
                  <div className="mt-2 flex-grow">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-500 transition-colors">
                      {module.name}
                    </h3>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                      {module.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </main>

      {/* Global Animations inline for convenience */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
