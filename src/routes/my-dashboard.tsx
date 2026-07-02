import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  Settings, 
  Plus, 
  Trash2, 
  GripVertical,
  LayoutDashboard,
  ChevronDown,
  Search,
  Calendar,
  Gift,
  Briefcase,
  ArrowRight,
  Clock,
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  FileCheck,
  AlertCircle,
  Users,
  Phone,
  Mail,
  MoreHorizontal,
  MessageCircle,
  Coffee
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const teamMembers = [
  { id: '2024049326', name: 'Hanif Uddin', role: 'Sr. Executive', phone: '01963978074', email: 'hanif.inno@pakizasoftware.com', image: 'https://i.pravatar.cc/150?u=2024049326' },
  { id: '2026058726', name: 'Parvej Mahmud', role: 'Executive', phone: '01521205808', email: 'parvej.inno@pakizasoftware.com', image: 'https://i.pravatar.cc/150?u=2026058726' },
  { id: '2026058686', name: 'Md. Abdur Rahaman', role: 'Executive', phone: '01531959653', email: 'rahaman.inno@pakizasoftware.com', image: 'https://i.pravatar.cc/150?u=2026058686' },
  { id: '2023043910', name: 'Tahmid Afsar', role: 'Asst. Manager', phone: '01750021154', email: 'tahmid.bd@pakizasoftware.com', image: 'https://i.pravatar.cc/150?u=2023043910' },
  { id: '2025054609', name: 'Md Mahir Shahriyar', role: 'Jr. Executive', phone: '01713060427', email: '', image: 'https://i.pravatar.cc/150?u=2025054609' },
  { id: '2023044078', name: 'Md. Anik Islam', role: 'Deputy Manager', phone: '01324726844', email: 'anik.ba@pakizasoftware.com', image: 'https://i.pravatar.cc/150?u=2023044078' },
  { id: '2024049166', name: 'MD Maimoon Hossain Shomoy', role: 'Sr. Executive', phone: '01796221964', email: 'shomoy.inno@pakizasoftware.com', image: 'https://i.pravatar.cc/150?u=2024049166' },
  { id: '2024051510', name: 'Md. Sadmanur Islam Shishir', role: 'Jr. Executive', phone: '01946432534', email: 'shishir.inno@pakizasoftware.com', image: 'https://i.pravatar.cc/150?u=2024051510' },
  { id: '2025053125', name: 'Al Riyad Karim', role: 'Sr. Executive', phone: '01732461622', email: '', image: 'https://i.pravatar.cc/150?u=2025053125' },
  { id: '2025054707', name: 'Allama Bakhtiyar Nafis', role: 'Jr. Executive', phone: '01724654380', email: 'nafis.inno@pakizasoftware.com', image: 'https://i.pravatar.cc/150?u=2025054707' },
  { id: '2025054710', name: 'Raihan Jami Khan', role: 'Jr. Executive', phone: '01786076080', email: 'jami.inno@pakizasoftware.com', image: 'https://i.pravatar.cc/150?u=2025054710' },
  { id: '2026059418', name: 'Md Robayet Hasan Yeasin', role: 'Jr. Executive', phone: '01748570672', email: 'yeasin.inno@pakizasoftware.com', image: 'https://i.pravatar.cc/150?u=2026059418' },
  { id: '2026059427', name: 'Mir Md Moshiu Islam', role: 'Jr. Executive', phone: '01898899180', email: 'moshiu.inno@pakizasoftware.com', image: 'https://i.pravatar.cc/150?u=2026059427' },
  { id: '2026059573', name: 'Md. Piyash Hasan', role: 'Executive', phone: '01790800372', email: 'piyash.inno@pakizasoftware.com', image: 'https://i.pravatar.cc/150?u=2026059573' },
  { id: '2026060310', name: 'Md. Shahid Hasan', role: 'Sr. Executive', phone: '', email: '', image: 'https://i.pravatar.cc/150?u=2026060310' }
];

const attendanceData = [
  { name: 'Present', value: 85, color: '#10b981' },
  { name: 'Absent', value: 5, color: '#ef4444' },
  { name: 'Leave', value: 10, color: '#f59e0b' },
];

const ontimeVsLateData = [
  { month: 'Jan', onTime: 95, late: 12 },
  { month: 'Feb', onTime: 98, late: 8 },
  { month: 'Mar', onTime: 92, late: 15 },
  { month: 'Apr', onTime: 99, late: 5 },
  { month: 'May', onTime: 102, late: 10 },
  { month: 'Jun', onTime: 94, late: 14 },
];
import { nav } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export const Route = createFileRoute("/my-dashboard")({
  component: MyDashboard,
});

type DraggableItem = {
  id: string;
  originalLabel: string;
  name: string;
  icon: any;
  to: string;
};

type LayoutSection = {
  id: string;
  name: string;
  items: string[]; // store IDs, not full objects
};

const ALL_ITEMS: DraggableItem[] = [];

nav.forEach(item => {
  if (!item.subitems) {
    ALL_ITEMS.push({
      id: item.label.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      originalLabel: item.label,
      name: item.label,
      icon: item.icon || LayoutDashboard,
      to: item.to || "/",
    });
  } else {
    item.subitems.forEach(sub => {
      if (sub.subitems) {
        sub.subitems.forEach(nested => {
          const fullLabel = `${item.label} - ${nested.label}`;
          ALL_ITEMS.push({
            id: fullLabel.toLowerCase().replace(/[^a-z0-9]/g, "_"),
            originalLabel: fullLabel,
            name: nested.label,
            icon: item.icon || LayoutDashboard,
            to: nested.to || "/",
          });
        });
      } else {
        const fullLabel = `${item.label} - ${sub.label}`;
        ALL_ITEMS.push({
          id: fullLabel.toLowerCase().replace(/[^a-z0-9]/g, "_"),
          originalLabel: fullLabel,
          name: sub.label,
          icon: item.icon || LayoutDashboard,
          to: sub.to || "/",
        });
      }
    });
  }
});

export default function MyDashboard() {
  const [layout, setLayout] = useState<LayoutSection[]>([]);
  const [activeUrl, setActiveUrl] = useState<string | null>('__overview__');
  const [openSidebarSections, setOpenSidebarSections] = useState<Record<string, boolean>>({});
  const [openPoolGroups, setOpenPoolGroups] = useState<Record<string, boolean>>({});
  
  const [newSectionName, setNewSectionName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("All");
  
  // Drag state
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragSource, setDragSource] = useState<string | null>(null); // 'pool' or sectionId

  useEffect(() => {
    const stored = localStorage.getItem("my_dashboard_layout");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as LayoutSection[];
        // Validate against ALL_ITEMS to ensure no dangling IDs
        const validated = parsed.map(sec => ({
          ...sec,
          items: sec.items.filter(id => ALL_ITEMS.some(i => i.id === id))
        }));
        setLayout(validated);
      } catch (e) {
        // init empty
      }
    }
  }, []);

  const saveLayout = (newLayout: LayoutSection[]) => {
    setLayout(newLayout);
    localStorage.setItem("my_dashboard_layout", JSON.stringify(newLayout));
  };

  const addSection = () => {
    if (!newSectionName.trim()) return;
    const newSection: LayoutSection = {
      id: `section_${Date.now()}`,
      name: newSectionName.trim(),
      items: [],
    };
    saveLayout([...layout, newSection]);
    setNewSectionName("");
  };

  const deleteSection = (sectionId: string) => {
    saveLayout(layout.filter(s => s.id !== sectionId));
  };

  // HTML5 Drag Handlers
  const handleDragStart = (e: React.DragEvent, itemId: string, sourceId: string) => {
    setDraggedItemId(itemId);
    setDragSource(sourceId);
    e.dataTransfer.effectAllowed = "move";
    // Slight delay so the dragging image is generated before hiding the original
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.classList.add("opacity-50");
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.classList.remove("opacity-50");
    }
    setDraggedItemId(null);
    setDragSource(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropOnSection = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    if (!draggedItemId || !dragSource) return;

    if (dragSource === targetSectionId) {
      // Just reordering within same section - skipped for simple implementation
      return; 
    }

    let newLayout = [...layout];

    // Remove from source section
    if (dragSource !== 'pool') {
      const sourceSec = newLayout.find(s => s.id === dragSource);
      if (sourceSec) {
        sourceSec.items = sourceSec.items.filter(i => i !== draggedItemId);
      }
    }

    // Add to target section
    const targetSec = newLayout.find(s => s.id === targetSectionId);
    if (targetSec) {
      targetSec.items.push(draggedItemId);
    }

    saveLayout(newLayout);
  };

  const handleDropOnPool = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItemId || dragSource === 'pool') return;

    // Remove from source section
    let newLayout = [...layout];
    const sourceSec = newLayout.find(s => s.id === dragSource);
    if (sourceSec) {
      sourceSec.items = sourceSec.items.filter(i => i !== draggedItemId);
    }
    saveLayout(newLayout);
  };

  const handleDropOnItem = (e: React.DragEvent, targetSectionId: string, targetItemId: string) => {
    e.preventDefault();
    e.stopPropagation(); // don't trigger section drop
    if (!draggedItemId || !dragSource) return;

    let newLayout = JSON.parse(JSON.stringify(layout)) as LayoutSection[]; // deep clone
    
    // Remove from source
    if (dragSource !== 'pool') {
      const sourceSec = newLayout.find(s => s.id === dragSource);
      if (sourceSec) sourceSec.items = sourceSec.items.filter(i => i !== draggedItemId);
    }

    // Insert into target
    const targetSec = newLayout.find(s => s.id === targetSectionId);
    if (targetSec) {
      const targetIndex = targetSec.items.findIndex(i => i === targetItemId);
      targetSec.items.splice(targetIndex, 0, draggedItemId);
    }

    saveLayout(newLayout);
  };

  // Compute unassigned items
  const assignedItemIds = new Set(layout.flatMap(s => s.items));
  const unassignedItems = ALL_ITEMS.filter(i => !assignedItemIds.has(i.id));

  const allAvailableModules = Array.from(new Set(unassignedItems.map(item => item.originalLabel.split(" - ")[0]))).sort();

  // Search and Group Unassigned Items
  const filteredUnassignedItems = unassignedItems.filter(item => {
    const moduleName = item.originalLabel.split(" - ")[0];
    const matchesSearch = item.originalLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = selectedModule === "All" || moduleName === selectedModule;
    return matchesSearch && matchesModule;
  });

  const groupedPool = filteredUnassignedItems.reduce((acc, item) => {
    const groupName = item.originalLabel.split(" - ")[0];
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(item);
    return acc;
  }, {} as Record<string, typeof unassignedItems>);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      {/* Custom Dashboard Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300">
        <div className="px-5 py-4 flex items-center gap-2.5 border-b border-sidebar-border/80">
          <div className="size-8.5 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center font-extrabold text-primary-foreground shadow-[0_4px_12px_oklch(0.48_0.19_255/0.25)] text-sm tracking-tight transition-transform duration-300 hover:rotate-6">
            M
          </div>
          <div className="leading-tight">
            <div className="font-extrabold tracking-tight text-[13px] text-sidebar-foreground">
              MY DASHBOARD
            </div>
            <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-sidebar-primary">
              WORKSPACE
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
          <div className="px-2.5 pb-2 text-[9px] font-extrabold uppercase tracking-widest text-sidebar-foreground/45">
            Overview
          </div>
          
          <button
            onClick={() => setActiveUrl('__overview__')}
            className={`w-full group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] font-semibold transition-all duration-200 mb-1 ${
              activeUrl === '__overview__'
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <LayoutDashboard className="size-4" />
            <span>Dashboard Overview</span>
          </button>
          
          <button
            onClick={() => setActiveUrl('__config__')}
            className={`w-full group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] font-semibold transition-all duration-200 ${
              activeUrl === '__config__' || activeUrl === null
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <Settings className="size-4" />
            <span>Configuration Builder</span>
          </button>

          <div className="mt-6 mb-2 px-2.5 text-[9px] font-extrabold uppercase tracking-widest text-sidebar-foreground/45">
            My Custom Menus
          </div>

          {layout.map((section) => {
            const isOpen = openSidebarSections[section.id] !== false; // open by default

            return (
              <div key={section.id} className="mt-1">
                <button
                  onClick={() => setOpenSidebarSections(prev => ({...prev, [section.id]: !isOpen}))}
                  className="w-full group flex items-center justify-between px-3 py-2.5 rounded-lg text-[12px] font-semibold text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
                >
                  <span>{section.name}</span>
                  <ChevronDown className={`size-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="mt-1 flex flex-col gap-0.5 ml-2">
                    {section.items.map(itemId => {
                      const item = ALL_ITEMS.find(i => i.id === itemId);
                      if (!item) return null;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveUrl(item.to)}
                          className={`w-full group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all duration-200 ${
                            activeUrl === item.to
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          }`}
                        >
                          <Icon className="size-3.5" />
                          <span>{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col relative overflow-hidden bg-background">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }}></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }}></div>
        </div>

        <Topbar />

        {activeUrl === '__overview__' ? (
          /* Main Dashboard Overview Area */
          <div className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8 space-y-6 bg-transparent relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold tracking-tight">Organization Overview</h1>
              <button className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                Download Report
              </button>
            </div>
            
            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-xl border border-border/80 bg-card shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium mb-1 text-muted-foreground">Total Requisitions</p>
                    <h4 className="text-3xl font-extrabold text-foreground">1,248</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <FileCheck size={20} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="text-emerald-500 flex items-center gap-0.5"><TrendingUp size={12} /> +12.5%</span>
                  <span className="text-muted-foreground/70">vs last month</span>
                </div>
              </div>
              
              <div className="p-4 rounded-xl border border-border/80 bg-card shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium mb-1 text-muted-foreground">Pending Requisitions</p>
                    <h4 className="text-3xl font-extrabold text-amber-500">42</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <AlertCircle size={20} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="text-rose-500 flex items-center gap-0.5"><TrendingUp size={12} /> +4.2%</span>
                  <span className="text-muted-foreground/70">requires action</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/80 bg-card shadow-sm group hover:border-primary/30 transition-colors cursor-pointer" onClick={() => window.location.href = '/messenger'}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium mb-1 text-muted-foreground group-hover:text-primary transition-colors">Unread Messages</p>
                    <h4 className="text-3xl font-extrabold text-foreground">5 <span className="text-sm font-semibold text-muted-foreground">New</span></h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center relative">
                    <MessageCircle size={20} />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-card rounded-full animate-pulse"></span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <div className="flex -space-x-2">
                    <img className="w-5 h-5 rounded-full border border-card" src="https://i.pravatar.cc/150?u=2024049326" alt="avatar" />
                    <img className="w-5 h-5 rounded-full border border-card" src="https://i.pravatar.cc/150?u=2026058726" alt="avatar" />
                  </div>
                  <span className="text-muted-foreground/70 truncate">HR Dept & Management Group</span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Bar Chart */}
              <div className="p-4 rounded-xl border border-border/80 bg-card shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-sm flex items-center gap-2 text-foreground"><BarChart3 size={16} className="text-indigo-500"/> Ontime vs Late</h4>
                </div>
                <div className="h-64 w-full mt-auto text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ontimeVsLateData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                      <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="onTime" name="On Time" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                      <Bar dataKey="late" name="Late" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="p-4 rounded-xl border border-border/80 bg-card shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm flex items-center gap-2 text-foreground"><PieChartIcon size={16} className="text-purple-500"/> Attendance Summary</h4>
                </div>
                <div className="h-64 w-full mt-auto flex items-center justify-center relative text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendanceData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {attendanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-extrabold text-foreground">85%</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mt-1">Present</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Widgets Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Upcoming Events */}
              <div className="p-4 rounded-xl border border-border/80 bg-card shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Upcoming</h4>
                    <p className="text-[10px] mt-0.5 text-muted-foreground">Events & milestones this week</p>
                  </div>
                  <button className="text-[10px] font-bold flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                    Calendar <ArrowRight size={12} />
                  </button>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex items-start gap-3 group">
                    <div className="mt-0.5 p-2 rounded-lg bg-rose-500/10 text-rose-500">
                      <Gift size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h5 className="font-semibold text-sm text-foreground group-hover:text-rose-500 transition-colors">Anika Mehta's birthday</h5>
                        <button className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">View</button>
                      </div>
                      <p className="text-xs font-medium mt-0.5 text-muted-foreground">Today</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 group">
                    <div className="mt-0.5 p-2 rounded-lg bg-amber-500/10 text-amber-500">
                      <Briefcase size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h5 className="font-semibold text-sm text-foreground group-hover:text-amber-500 transition-colors">5 yrs — Jordan Park</h5>
                        <button className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">View</button>
                      </div>
                      <p className="text-xs font-medium mt-0.5 text-muted-foreground">Tomorrow</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="mt-0.5 p-2 rounded-lg bg-blue-500/10 text-blue-500">
                      <Users size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h5 className="font-semibold text-sm text-foreground group-hover:text-blue-500 transition-colors">Interview · Senior PM</h5>
                        <button className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">View</button>
                      </div>
                      <p className="text-xs font-medium mt-0.5 text-muted-foreground">Jun 11, 2:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="mt-0.5 p-2 rounded-lg bg-purple-500/10 text-purple-500">
                      <Calendar size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h5 className="font-semibold text-sm text-foreground group-hover:text-purple-500 transition-colors">All-hands meeting</h5>
                      </div>
                      <p className="text-xs font-medium mt-0.5 text-muted-foreground">Jun 14, 10:00 AM</p>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 py-2 text-xs font-bold rounded-lg border border-border bg-muted/50 hover:bg-muted text-foreground transition-colors">
                  View Full Calendar
                </button>
              </div>

              {/* Detailed Leave Balance */}
              <div className="p-4 rounded-xl border border-border/80 bg-card shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-[13px] text-foreground">Leave Balance</h4>
                </div>
                
                {/* Casual Leave */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-[11px] tracking-wider text-foreground">CASUAL LEAVE</h4>
                    <span className="bg-blue-500/10 text-blue-600 font-bold text-[10px] px-2 py-0.5 rounded-full">7 left</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted/70 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span>Assigned: <strong className="text-foreground text-[10px] ml-0.5">10</strong></span>
                    <span>Enjoyed: <strong className="text-foreground text-[10px] ml-0.5">3</strong></span>
                  </div>
                </div>
                
                <div className="h-px w-full bg-border/50 my-2"></div>
                
                {/* Sick Leave */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-[11px] tracking-wider text-foreground">SICK LEAVE</h4>
                    <span className="bg-emerald-500/10 text-emerald-600 font-bold text-[10px] px-2 py-0.5 rounded-full">12 left</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted/70 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '14%' }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span>Assigned: <strong className="text-foreground text-[10px] ml-0.5">14</strong></span>
                    <span>Enjoyed: <strong className="text-foreground text-[10px] ml-0.5">2</strong></span>
                  </div>
                </div>

                <div className="h-px w-full bg-border/50 my-2"></div>

                {/* Earned Leave */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-[11px] tracking-wider text-foreground">EARNED LEAVE</h4>
                    <span className="bg-amber-500/10 text-amber-600 font-bold text-[10px] px-2 py-0.5 rounded-full">18 left</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted/70 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span>Assigned: <strong className="text-foreground text-[10px] ml-0.5">18</strong></span>
                    <span>Enjoyed: <strong className="text-foreground text-[10px] ml-0.5">0</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* My Team Members Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight text-foreground">My Team Members</h2>
                <button className="text-xs font-semibold px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors">
                  View All
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {teamMembers.map(member => (
                  <div key={member.id} className="p-3 rounded-xl border border-border/60 bg-card shadow-xs hover:shadow-sm hover:border-primary/30 transition-all group flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-background shadow-xs"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-[1.5px] border-background rounded-full"></span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-[13px] truncate group-hover:text-primary transition-colors">{member.name}</h4>
                      <p className="text-[10px] text-muted-foreground font-medium truncate">{member.role} <span className="opacity-50 mx-0.5">•</span> {member.id}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 truncate">
                        <Phone size={10} className="text-primary/70" /> 
                        {member.phone || 'N/A'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 shrink-0">
                      {member.email ? (
                        <a href={`mailto:${member.email}`} title="Send Email" className="p-1.5 rounded-md bg-muted/50 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                          <Mail size={14} />
                        </a>
                      ) : (
                        <div className="p-1.5 rounded-md bg-transparent text-muted-foreground/20 cursor-not-allowed">
                          <Mail size={14} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        ) : activeUrl === '__config__' || activeUrl === null ? (
          /* Main Configuration Content Area */
          <div className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8 space-y-6">
            <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-foreground">
                  Workspace Builder
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Create sections and drag menus to organize your custom workspace.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  placeholder="New Section Name"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSection()}
                  className="h-9 px-3 text-sm rounded-lg border border-border/80 bg-background outline-none focus:border-primary"
                />
                <button 
                  onClick={addSection}
                  className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 flex items-center gap-2"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              
              {/* Pool of Unassigned Items */}
              <div 
                className="col-span-1 bg-card rounded-xl border border-border/80 p-0 shadow-sm h-[600px] flex flex-col overflow-hidden"
                onDragOver={handleDragOver}
                onDrop={handleDropOnPool}
              >
                <div className="p-4 border-b border-border/60 bg-muted/10 space-y-3">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                    <span>Available Menus</span>
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">{filteredUnassignedItems.length}</span>
                  </h3>
                  
                  <div className="flex gap-2">
                    <select 
                      value={selectedModule}
                      onChange={(e) => setSelectedModule(e.target.value)}
                      className="w-1/3 h-9 px-2 text-xs rounded-lg border border-border/60 bg-background outline-none focus:border-primary/60 transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_8px_center]"
                    >
                      <option value="All">All Modules</option>
                      {allAvailableModules.map(mod => (
                        <option key={mod} value={mod}>{mod}</option>
                      ))}
                    </select>
                    <div className="relative flex-1">
                      <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                      <input 
                        type="text"
                        placeholder="Search menus..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full h-9 pl-9 pr-3 text-xs rounded-lg border border-border/60 bg-background outline-none focus:border-primary/60 transition-colors"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 space-y-3 scrollbar-thin">
                  {Object.entries(groupedPool).map(([groupName, items]) => {
                    // Automatically open group if searching, otherwise use state
                    const isOpen = searchQuery ? true : openPoolGroups[groupName] !== false;
                    
                    return (
                      <div key={groupName} className="rounded-lg border border-border/40 overflow-hidden">
                        <button
                          onClick={() => setOpenPoolGroups(prev => ({...prev, [groupName]: !isOpen}))}
                          className="w-full flex items-center justify-between px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <span className="text-xs font-bold text-foreground/80">{groupName} <span className="text-muted-foreground font-medium ml-1">({items.length})</span></span>
                          <ChevronDown className={`size-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        
                        {isOpen && (
                          <div className="p-2 space-y-1.5 bg-card">
                            {items.map(item => {
                              const Icon = item.icon;
                              return (
                                <div 
                                  key={item.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, item.id, 'pool')}
                                  onDragEnd={handleDragEnd}
                                  className="group flex items-center gap-2.5 p-2 rounded-md border border-border/40 bg-background hover:bg-muted/40 cursor-grab active:cursor-grabbing transition-colors shadow-2xs"
                                >
                                  <GripVertical size={13} className="text-muted-foreground/40 group-hover:text-muted-foreground/70 shrink-0" />
                                  <Icon size={14} className="text-primary/70 shrink-0" />
                                  <span className="text-[11px] font-semibold text-foreground truncate">{item.name}</span>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {Object.keys(groupedPool).length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-sm text-muted-foreground/60">
                      <Search className="size-8 text-muted-foreground/20 mb-2" />
                      <p>No menus found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sections Canvas */}
              <div className="col-span-1 md:col-span-2 space-y-4">
                {layout.length === 0 ? (
                  <div className="bg-card/50 border border-dashed border-border p-12 rounded-xl flex flex-col items-center justify-center text-center">
                    <LayoutDashboard size={40} className="text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground font-medium">No sections yet.</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">Add a section above to start building.</p>
                  </div>
                ) : (
                  layout.map(section => (
                    <div 
                      key={section.id} 
                      className="bg-card rounded-xl border border-border/80 shadow-sm overflow-hidden"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnSection(e, section.id)}
                    >
                      <div className="bg-muted/40 px-4 py-3 flex items-center justify-between border-b border-border/60">
                        <h3 className="font-bold text-foreground">{section.name}</h3>
                        <button 
                          onClick={() => deleteSection(section.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="p-3 min-h-[100px] flex flex-col gap-2">
                        {section.items.length === 0 ? (
                          <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground/50 border-2 border-dashed border-border/50 rounded-lg">
                            Drag menus here
                          </div>
                        ) : (
                          section.items.map(itemId => {
                            const item = ALL_ITEMS.find(i => i.id === itemId);
                            if (!item) return null;
                            const Icon = item.icon;
                            return (
                              <div 
                                key={item.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, item.id, section.id)}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDropOnItem(e, section.id, item.id)}
                                className="group flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-background shadow-xs hover:border-primary/30 cursor-grab active:cursor-grabbing transition-colors"
                              >
                                <GripVertical size={14} className="text-muted-foreground/50 group-hover:text-muted-foreground" />
                                <Icon size={16} className="text-primary/70" />
                                <span className="text-sm font-semibold text-foreground">{item.name}</span>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Render Iframe of the module */
          <div className="flex-1 w-full h-full p-2 bg-background">
            <iframe 
              src={`${activeUrl}?embed=true`} 
              className="w-full h-full border-0 rounded-lg shadow-sm ring-1 ring-border"
              title="Module View"
            />
          </div>
        )}
      </main>
    </div>
  );
}
