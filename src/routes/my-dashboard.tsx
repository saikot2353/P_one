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
  Coffee,
  Megaphone,
  Eye,
  RotateCcw,
  Lock,
  Unlock
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const teamMembers = [
  { id: '2024049326', name: 'Hanif Uddin', role: 'Sr. Executive', phone: '01963978074', email: 'hanif.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/9caa5b84-6645-47c9-a35f-906ec1002c4d.jpg' },
  { id: '2026058726', name: 'Parvej Mahmud', role: 'Executive', phone: '01521205808', email: 'parvej.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/b224da2f-32a6-4ab5-b98d-2fa9bddc2faa.jpg' },
  { id: '2026058686', name: 'Md. Abdur Rahaman', role: 'Executive', phone: '01531959653', email: 'rahaman.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/c32e2945-6433-43f7-835d-fd238617c955.jpg' },
  { id: '2023043910', name: 'Tahmid Afsar', role: 'Asst. Manager', phone: '01750021154', email: 'tahmid.bd@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/ab9adb3b-d38f-45bf-9569-22dc5ec46fcd.jpg' },
  { id: '2025054609', name: 'Md Mahir Shahriyar', role: 'Jr. Executive', phone: '01713060427', email: '', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/b314987a-a621-4906-9a64-2a18104da3e6.jpg' },
  { id: '2023044078', name: 'Md. Anik Islam', role: 'Deputy Manager', phone: '01324726844', email: 'anik.ba@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/3bc63d43-b2f2-49aa-b0a2-1e7eda819a65.jpg' },
  { id: '2024049166', name: 'MD Maimoon Hossain Shomoy', role: 'Sr. Executive', phone: '01796221964', email: 'shomoy.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/988bc5ac-552c-48bd-9d6f-cc2329c56d08.jpg' },
  { id: '2024051510', name: 'Md. Sadmanur Islam Shishir', role: 'Jr. Executive', phone: '01946432534', email: 'shishir.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/e4668770-dddd-4026-b3e6-963fbeedb13a.jpg' },
  { id: '2025053125', name: 'Al Riyad Karim', role: 'Sr. Executive', phone: '01732461622', email: '', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/7668c174-80e8-49bf-808f-5b6624c853a0.jpg' },
  { id: '2025054707', name: 'Allama Bakhtiyar Nafis', role: 'Jr. Executive', phone: '01724654380', email: 'nafis.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/abd4f21d-eb54-4cc6-a197-ca373e4693be.jpg' },
  { id: '2025054710', name: 'Raihan Jami Khan', role: 'Jr. Executive', phone: '01786076080', email: 'jami.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/93e35c4c-f827-4152-8faa-34ed422a1629.jpg' },
  { id: '2026059418', name: 'Md Robayet Hasan Yeasin', role: 'Jr. Executive', phone: '01748570672', email: 'yeasin.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/4e73fa2f-e1d4-4b6a-90f8-153d977f9e63.jpg' },
  { id: '2026059427', name: 'Mir Md Moshiu Islam', role: 'Jr. Executive', phone: '01898899180', email: 'moshiu.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/108e0e41-f8c9-439c-aa94-46a83b263b3a.jpg' },
  { id: '2026059573', name: 'Md. Piyash Hasan', role: 'Executive', phone: '01790800372', email: 'piyash.inno@pakizasoftware.com', image: 'https://bpm.pakizaknit.com/Photo/EmpPicture/0fa2e575-f1e5-4490-9e5b-6b89d039ce10.jpg' },
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

const dashboardNotices = [
  {
    id: "ntc-2",
    title: "Holiday Notice",
    summary: "Pakiza Software Limited issued a holiday notice for an office closure from Wednesday, August 5, 2026, to Saturday.",
    details: `
      <p>Dear Employees,</p>
      <p>Please note that Pakiza Software Limited will remain closed from <strong>Wednesday, August 5, 2026</strong> to <strong>Saturday, August 8, 2026</strong> on account of the upcoming national public holidays.</p>
      <p>Key Instructions:</p>
      <ul>
        <li>All departments will resume normal operations on Sunday, August 9, 2026.</li>
        <li>Emergency support staff in operations should coordinate shift coverages with their respective supervisors.</li>
      </ul>
      <p>We wish you a safe and restful holiday.</p>
    `,
    category: "HOLIDAY",
    author: "Shishir",
    role: "HR Manager",
    date: "Aug 16, 2026",
    circularNo: "PSL/HR/2026/0010"
  },
  {
    id: "ntc-3",
    title: "Monthly Performance Review",
    summary: "The monthly performance review cycle for August 2026 has been initiated.",
    details: "<p>We have initiated the performance review cycle for the month of August 2026. All team leads and supervisors are requested to submit their peer evaluations and KPI assessments in the dashboard portal by August 28, 2026.</p>",
    category: "MEETING",
    author: "Tahmid Afsar Shapno",
    role: "HR Director",
    date: "Aug 20, 2026",
    circularNo: "PSL/HR/2026/0013"
  },
  {
    id: "ntc-4",
    title: "Dress Code Policy Update",
    summary: "Updates regarding office dress code policy, effective from September 1, 2026.",
    details: "<p>Starting September 1, 2026, the company will adopt a business casual dress code from Monday to Thursday. Friday remains casual dress day. Please refer to the HR Handbook for detailed wear guidelines.</p>",
    category: "POLICY",
    author: "Rajebul Hasan Rajon",
    role: "HR Executive",
    date: "Aug 18, 2026",
    circularNo: "PSL/HR/2026/0014"
  }
];

export default function MyDashboard() {
  const [layout, setLayout] = useState<LayoutSection[]>([]);
  const [activeUrl, setActiveUrl] = useState<string | null>('__overview__');
  const [selectedDashboardNotice, setSelectedDashboardNotice] = useState<any | null>(null);
  const [overviewWidgets, setOverviewWidgets] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboard_overview_widgets_v3");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return ["chart_attendance", "notice", "messages", "leave", "chart_ontime", "events"];
  });
  const [draggedOverviewId, setDraggedOverviewId] = useState<string | null>(null);
  const [isDragEnabled, setIsDragEnabled] = useState(false);

  const handleOverviewDragStart = (e: React.DragEvent, id: string) => {
    if (!isDragEnabled) {
      e.preventDefault();
      return;
    }
    setDraggedOverviewId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleOverviewDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleOverviewDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedOverviewId || draggedOverviewId === targetId) return;

    const sourceIndex = overviewWidgets.indexOf(draggedOverviewId);
    const targetIndex = overviewWidgets.indexOf(targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    const updated = [...overviewWidgets];
    updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, draggedOverviewId);

    setOverviewWidgets(updated);
    localStorage.setItem("dashboard_overview_widgets_v3", JSON.stringify(updated));
    setDraggedOverviewId(null);
  };

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
            className={`w-full group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] font-semibold transition-all duration-200 mb-1 ${activeUrl === '__overview__'
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
          >
            <LayoutDashboard className="size-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveUrl('__config__')}
            className={`w-full group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] font-semibold transition-all duration-200 ${activeUrl === '__config__' || activeUrl === null
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
                  onClick={() => setOpenSidebarSections(prev => ({ ...prev, [section.id]: !isOpen }))}
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
                          className={`w-full group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all duration-200 ${activeUrl === item.to
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

      <main className="flex-1 min-w-0 flex flex-col relative overflow-hidden bg-muted/20">
        <Topbar />

        {activeUrl === '__overview__' ? (
          /* Main Dashboard Overview Area */
          <div className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8 space-y-6 bg-background">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold tracking-tight">Organization Overview</h1>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsDragEnabled(!isDragEnabled)}
                  className={`text-xs font-bold px-3 py-2 rounded-lg border flex items-center gap-1.5 shadow-xs cursor-pointer select-none transition-all duration-200 ${
                    isDragEnabled 
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15 animate-pulse" 
                      : "bg-card border-border hover:bg-muted text-foreground"
                  }`}
                  title={isDragEnabled ? "Click to lock widget positions" : "Click to unlock widget positions for reordering"}
                >
                  {isDragEnabled ? (
                    <>
                      <Unlock className="size-3.5" /> Lock Layout
                    </>
                  ) : (
                    <>
                      <Lock className="size-3.5 text-muted-foreground" /> Unlock Layout
                    </>
                  )}
                </button>
                <button 
                  onClick={() => {
                    const defaultWidgets = ["chart_attendance", "notice", "messages", "leave", "chart_ontime", "events"];
                    setOverviewWidgets(defaultWidgets);
                    localStorage.setItem("dashboard_overview_widgets_v3", JSON.stringify(defaultWidgets));
                  }}
                  className="text-xs font-bold px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer select-none"
                  title="Restore default widget layout order"
                >
                  <RotateCcw className="size-3.5 text-muted-foreground" /> Reset Layout
                </button>
                <button className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-xs">
                  Download Report
                </button>
              </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="p-3.5 rounded-xl border border-border/80 bg-card shadow-xs flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Requisitions</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-foreground">1,248</span>
                    <span className="text-emerald-500 text-[10px] font-bold flex items-center gap-0.5"><TrendingUp size={10} /> +12.5%</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <FileCheck size={18} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/80 bg-card shadow-xs flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Requisitions</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-amber-500">42</span>
                    <span className="text-rose-500 text-[10px] font-bold flex items-center gap-0.5"><TrendingUp size={10} /> +4.2%</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <AlertCircle size={18} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/80 bg-card shadow-xs flex items-center justify-between group hover:border-primary/30 transition-colors cursor-pointer" onClick={() => window.location.href = '/messenger'}>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-wider">Unread Messages</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-foreground">5</span>
                    <span className="text-muted-foreground text-[10px] font-bold">New</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center relative shrink-0">
                  <MessageCircle size={18} />
                  <span className="absolute -top-0.5 -right-0.5 size-2.5 bg-red-500 border border-card rounded-full animate-pulse"></span>
                </div>
              </div>
            </div>

            {/* Drag and Drop Dashboard Overview Widgets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {overviewWidgets.map((widgetId) => {
                const isDragging = draggedOverviewId === widgetId;

                const getWidgetContent = () => {
                  switch (widgetId) {
                    case "notice":
                      return (
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                                  <Megaphone className="size-4 text-primary" /> Notice Board
                                </h4>
                                <p className="text-[10px] mt-0.5 text-muted-foreground">Official circulars & announcements</p>
                              </div>
                              <button 
                                onClick={() => window.location.href = '/notice'} 
                                className="text-[10px] font-bold flex items-center gap-1 text-primary hover:text-primary/80 transition-colors mr-20"
                              >
                                View All <ArrowRight size={12} />
                              </button>
                            </div>

                            <div className="space-y-1.5">
                              {dashboardNotices.map((ntc) => {
                                const isHoliday = ntc.category === "HOLIDAY";
                                const isPolicy = ntc.category === "POLICY";
                                const isMeeting = ntc.category === "MEETING";
                                
                                let badgeBg = "bg-slate-500/10 text-slate-600 dark:bg-slate-400/10 dark:text-slate-400";
                                if (isHoliday) badgeBg = "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400";
                                if (isPolicy) badgeBg = "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400";
                                if (isMeeting) badgeBg = "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400";

                                return (
                                  <div 
                                    key={ntc.id} 
                                    onClick={() => setSelectedDashboardNotice(ntc)}
                                    className="py-1.5 px-2.5 rounded-xl border border-border/40 hover:border-primary/30 bg-muted/10 hover:bg-primary/5 transition-all duration-200 cursor-pointer group/item"
                                  >
                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                      <span className={`text-[7.5px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded ${badgeBg} shadow-[0_0_8px_rgba(0,0,0,0.02)]`}>
                                        {ntc.category}
                                      </span>
                                      <span className="text-[8px] font-semibold text-muted-foreground font-mono">
                                        {ntc.date}
                                      </span>
                                    </div>
                                    <h5 className="font-bold text-[10.5px] text-foreground group-hover/item:text-primary transition-colors leading-tight line-clamp-1">
                                      {ntc.title}
                                    </h5>
                                    <p className="text-[9.5px] text-muted-foreground mt-0.5 line-clamp-1 font-medium">
                                      {ntc.summary}
                                    </p>
                                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-border/20 text-[8px] font-bold text-muted-foreground/60">
                                      <span>Ref: {ntc.circularNo}</span>
                                      <span className="flex items-center gap-0.5 text-primary opacity-0 group-hover/item:opacity-100 transition-opacity">
                                        Read <Eye size={10} />
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <button 
                            onClick={() => window.location.href = '/notice'} 
                            className="w-full py-1 text-xs font-bold rounded-lg border border-border bg-muted/50 hover:bg-muted text-foreground transition-colors text-center shadow-xs"
                          >
                            Go to Notice Board
                          </button>
                        </div>
                      );
                    case "messages":
                      return (
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-bold text-sm text-foreground">Recent Messages</h4>
                                <p className="text-[10px] mt-0.5 text-muted-foreground">Unread and latest conversations</p>
                              </div>
                              <button onClick={() => window.location.href = '/messenger'} className="text-[10px] font-bold flex items-center gap-1 text-primary hover:text-primary/80 transition-colors cursor-pointer mr-20">
                                View All <ArrowRight size={12} />
                              </button>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-start gap-2 p-1.5 rounded-xl border border-border/40 hover:border-primary/30 bg-muted/10 hover:bg-primary/5 cursor-pointer transition-all duration-200 group/item" onClick={() => window.location.href = '/messenger'}>
                                <div className="relative shrink-0">
                                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center border-2 border-background font-bold text-[10px] shadow-sm">HR</div>
                                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 border border-background rounded-full animate-pulse shadow-sm"></span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <h5 className="font-semibold text-[11px] text-foreground group-hover/item:text-primary transition-colors truncate font-bold">HR Department</h5>
                                    <span className="text-[8px] font-bold text-primary">10:42 AM</span>
                                  </div>
                                  <p className="text-[10px] font-bold mt-0.5 text-foreground truncate">Sarah: Please review the updated policy document.</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2 p-1.5 rounded-xl border border-border/40 hover:border-primary/30 bg-muted/10 hover:bg-primary/5 cursor-pointer transition-all duration-200 group/item" onClick={() => window.location.href = '/messenger'}>
                                <div className="relative shrink-0">
                                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop" alt="user" className="w-8 h-8 rounded-full object-cover border-2 border-background shadow-sm" />
                                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-background rounded-full shadow-sm"></span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <h5 className="font-semibold text-[11px] text-foreground group-hover/item:text-primary transition-colors truncate font-bold">Michael Chen</h5>
                                    <span className="text-[8px] font-medium text-muted-foreground font-semibold">Yesterday</span>
                                  </div>
                                  <p className="text-[10px] font-medium mt-0.5 text-muted-foreground truncate">Are we still on for the 3PM sync?</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2 p-1.5 rounded-xl border border-border/40 hover:border-primary/30 bg-muted/10 hover:bg-primary/5 cursor-pointer transition-all duration-200 group/item" onClick={() => window.location.href = '/messenger'}>
                                <div className="relative shrink-0">
                                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="user" className="w-8 h-8 rounded-full object-cover border-2 border-background shadow-sm" />
                                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-amber-500 border-2 border-background rounded-full shadow-sm"></span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <h5 className="font-semibold text-[11px] text-foreground group-hover/item:text-primary transition-colors truncate font-bold">Alice Smith</h5>
                                    <span className="text-[8px] font-medium text-muted-foreground font-semibold">Mon</span>
                                  </div>
                                  <p className="text-[10px] font-medium mt-0.5 text-muted-foreground truncate">Thanks for sending over the assets!</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2 p-1.5 rounded-xl border border-border/40 hover:border-primary/30 bg-muted/10 hover:bg-primary/5 cursor-pointer transition-all duration-200 group/item" onClick={() => window.location.href = '/messenger'}>
                                <div className="relative shrink-0">
                                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center border-2 border-background font-bold text-[10px] shadow-sm">IT</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <h5 className="font-semibold text-[11px] text-foreground group-hover/item:text-primary transition-colors truncate font-bold">IT Support</h5>
                                    <span className="text-[8px] font-medium text-muted-foreground font-semibold">Mon</span>
                                  </div>
                                  <p className="text-[10px] font-medium mt-0.5 text-muted-foreground truncate">Ticket #4042 has been marked resolved.</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button onClick={() => window.location.href = '/messenger'} className="w-full py-1 text-xs font-bold rounded-lg border border-border bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-opacity cursor-pointer">
                            Open Messenger
                          </button>
                        </div>
                      );
                    case "chart_ontime":
                      return (
                        <div className="flex flex-col justify-between h-full">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-sm flex items-center gap-2 text-foreground">
                              <BarChart3 size={16} className="text-indigo-500" /> Ontime vs Late
                            </h4>
                          </div>
                          <div className="h-[245px] w-full mt-auto text-xs">
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
                      );
                    case "chart_attendance":
                      return (
                        <div className="flex flex-col justify-between h-full">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-sm flex items-center gap-2 text-foreground">
                              <PieChartIcon size={16} className="text-purple-500" /> Attendance Summary
                            </h4>
                          </div>
                          <div className="flex items-center justify-between gap-4 flex-1">
                            <div className="w-1/2 h-[240px] flex items-center justify-center relative text-xs">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={attendanceData}
                                    innerRadius={50}
                                    outerRadius={70}
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
                                <span className="text-2xl font-extrabold text-foreground">85%</span>
                                <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground mt-0.5">Present</span>
                              </div>
                            </div>

                            <div className="w-1/2 space-y-2 pr-1">
                              <div className="p-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="size-2 rounded-full bg-[#10b981]"></span>
                                  <span className="text-[10px] font-bold text-foreground">Present</span>
                                </div>
                                <span className="text-[11px] font-black text-emerald-600">85% <span className="text-[8px] text-muted-foreground font-medium">(1k+)</span></span>
                              </div>
                              <div className="p-1.5 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="size-2 rounded-full bg-[#f59e0b]"></span>
                                  <span className="text-[10px] font-bold text-foreground">Late</span>
                                </div>
                                <span className="text-[11px] font-black text-amber-600">10% <span className="text-[8px] text-muted-foreground font-medium">(125)</span></span>
                              </div>
                              <div className="p-1.5 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="size-2 rounded-full bg-[#ef4444]"></span>
                                  <span className="text-[10px] font-bold text-foreground">Absent</span>
                                </div>
                                <span className="text-[11px] font-black text-rose-600">5% <span className="text-[8px] text-muted-foreground font-medium">(62)</span></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    case "events":
                      return (
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-bold text-sm text-foreground">Upcoming</h4>
                                <p className="text-[10px] mt-0.5 text-muted-foreground">Events & milestones this week</p>
                              </div>
                              <button className="text-[10px] font-bold flex items-center gap-1 text-primary hover:text-primary/80 transition-colors mr-20">
                                Calendar <ArrowRight size={12} />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="p-2 rounded-xl border border-rose-500/10 bg-rose-500/5 flex items-start gap-2 h-[72px]">
                                <div className="mt-0.5 p-1 rounded-lg bg-rose-500/10 text-rose-500 shrink-0">
                                  <Gift size={12} />
                                </div>
                                <div className="min-w-0">
                                  <h5 className="font-bold text-[10.5px] text-foreground truncate">Anika's Birthday</h5>
                                  <p className="text-[9px] text-muted-foreground font-bold mt-0.5">Today</p>
                                </div>
                              </div>

                              <div className="p-2 rounded-xl border border-amber-500/10 bg-amber-500/5 flex items-start gap-2 h-[72px]">
                                <div className="mt-0.5 p-1 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
                                  <Briefcase size={12} />
                                </div>
                                <div className="min-w-0">
                                  <h5 className="font-bold text-[10.5px] text-foreground truncate">Jordan Park (5y)</h5>
                                  <p className="text-[9px] text-muted-foreground font-bold mt-0.5">Tomorrow</p>
                                </div>
                              </div>

                              <div className="p-2 rounded-xl border border-blue-500/10 bg-blue-500/5 flex items-start gap-2 h-[72px]">
                                <div className="mt-0.5 p-1 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                                  <Users size={12} />
                                </div>
                                <div className="min-w-0">
                                  <h5 className="font-bold text-[10.5px] text-foreground truncate">Interview: Sr. PM</h5>
                                  <p className="text-[9px] text-muted-foreground font-bold mt-0.5">Jun 11, 2:00 PM</p>
                                </div>
                              </div>

                              <div className="p-2 rounded-xl border border-purple-500/10 bg-purple-500/5 flex items-start gap-2 h-[72px]">
                                <div className="mt-0.5 p-1 rounded-lg bg-purple-500/10 text-purple-500 shrink-0">
                                  <Calendar size={12} />
                                </div>
                                <div className="min-w-0">
                                  <h5 className="font-bold text-[10.5px] text-foreground truncate">All-hands Meeting</h5>
                                  <p className="text-[9px] text-muted-foreground font-bold mt-0.5">Jun 14, 10:00 AM</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button className="w-full py-1 text-xs font-bold rounded-lg border border-border bg-muted/50 hover:bg-muted text-foreground transition-colors">
                            View Full Calendar
                          </button>
                        </div>
                      );
                    case "leave":
                      {
                        const leaveBalances = [
                          { id: "casual", name: "Casual Leave", left: 7, total: 10, used: 3, percentage: 70, color: "blue" },
                          { id: "sick", name: "Sick Leave", left: 12, total: 14, used: 2, percentage: 86, color: "emerald" },
                          { id: "earned", name: "Earned Leave", left: 18, total: 18, used: 0, percentage: 100, color: "amber" },
                          { id: "maternity", name: "Maternity", left: 90, total: 90, used: 0, percentage: 100, color: "purple" },
                          { id: "compoff", name: "Comp Off", left: 2, total: 4, used: 2, percentage: 50, color: "indigo" },
                          { id: "lwp", name: "Without Pay", left: 0, total: 0, used: 5, percentage: 0, color: "slate" },
                        ];

                        return (
                          <div className="flex flex-col justify-start h-full">
                            <style>{`
                              .custom-scrollbar::-webkit-scrollbar {
                                height: 4px;
                              }
                              .custom-scrollbar::-webkit-scrollbar-track {
                                background: transparent;
                              }
                              .custom-scrollbar::-webkit-scrollbar-thumb {
                                background: rgba(0, 0, 0, 0.12);
                                border-radius: 4px;
                              }
                              .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                                background: rgba(255, 255, 255, 0.12);
                              }
                            `}</style>
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-bold text-[13px] text-foreground">Leave Balance</h4>
                                <p className="text-[10px] mt-0.5 text-muted-foreground">Scroll horizontally to view all allocations</p>
                              </div>
                              <span className="text-[9px] font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                {leaveBalances.length} Types
                              </span>
                            </div>

                            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 flex-1 custom-scrollbar">
                              {leaveBalances.map((leave) => {
                                let bgClass = "bg-slate-500/5 border-slate-500/10";
                                let textColor = "text-slate-600 dark:text-slate-400";
                                
                                if (leave.color === "blue") {
                                  bgClass = "bg-blue-500/5 border-blue-500/10";
                                  textColor = "text-blue-600 dark:text-blue-400";
                                } else if (leave.color === "emerald") {
                                  bgClass = "bg-emerald-500/5 border-emerald-500/10";
                                  textColor = "text-emerald-600 dark:text-emerald-400";
                                } else if (leave.color === "amber") {
                                  bgClass = "bg-amber-500/5 border-amber-500/10";
                                  textColor = "text-amber-600 dark:text-amber-400";
                                } else if (leave.color === "purple") {
                                  bgClass = "bg-purple-500/5 border-purple-500/10";
                                  textColor = "text-purple-600 dark:text-purple-400";
                                } else if (leave.color === "indigo") {
                                  bgClass = "bg-indigo-500/5 border-indigo-500/10";
                                  textColor = "text-indigo-600 dark:text-indigo-400";
                                }

                                return (
                                  <div 
                                    key={leave.id} 
                                    className={`p-2.5 rounded-xl border ${bgClass} flex flex-col justify-between items-center text-center w-[125px] min-w-[125px] h-[190px] shrink-0 transition-all duration-200 hover:scale-[1.015] hover:shadow-xs`}
                                  >
                                    <div className="size-14 flex items-center justify-center relative shrink-0 mt-1">
                                      <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 56 56">
                                        <circle
                                          cx="28"
                                          cy="28"
                                          r="22"
                                          stroke="currentColor"
                                          strokeWidth="3.5"
                                          fill="transparent"
                                          className="text-muted-foreground/10"
                                        />
                                        <circle
                                          cx="28"
                                          cy="28"
                                          r="22"
                                          stroke="currentColor"
                                          strokeWidth="3.5"
                                          fill="transparent"
                                          strokeDasharray="138.2"
                                          strokeDashoffset={138.2 - (leave.percentage / 100) * 138.2}
                                          className={
                                            leave.color === "blue" ? "text-blue-500" :
                                            leave.color === "emerald" ? "text-emerald-500" :
                                            leave.color === "amber" ? "text-amber-500" :
                                            leave.color === "purple" ? "text-purple-500" :
                                            leave.color === "indigo" ? "text-indigo-500" : "text-slate-500"
                                          }
                                          strokeLinecap="round"
                                        />
                                      </svg>
                                      <span className={`text-[10px] font-extrabold ${textColor}`}>{leave.percentage}%</span>
                                    </div>
                                    <div className="mt-1 flex-1 flex flex-col justify-center">
                                      <span className={`text-[9.5px] font-black tracking-wider uppercase block ${textColor} truncate w-full`}>
                                        {leave.name}
                                      </span>
                                      <span className="text-sm font-extrabold text-foreground mt-0.5 block">
                                        {leave.left} <span className="text-[9px] font-normal text-muted-foreground">/ {leave.total}</span>
                                      </span>
                                    </div>
                                    <div className="mt-1 pt-1.5 border-t border-border/40 w-full flex justify-between text-[8px] font-bold text-muted-foreground">
                                      <span>Left: {leave.left}</span>
                                      <span>Used: {leave.used}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }
                    default:
                      return null;
                  }
                };

                // Add card header top colored accent lines for each widget type
                let accentColor = "bg-primary/5";
                if (widgetId === "notice") accentColor = "border-t-2 border-t-blue-500";
                if (widgetId === "messages") accentColor = "border-t-2 border-t-amber-500";
                if (widgetId === "chart_ontime") accentColor = "border-t-2 border-t-indigo-500";
                if (widgetId === "chart_attendance") accentColor = "border-t-2 border-t-purple-500";
                if (widgetId === "events") accentColor = "border-t-2 border-t-rose-500";
                if (widgetId === "leave") accentColor = "border-t-2 border-t-emerald-500";

                return (
                  <div
                    key={widgetId}
                    draggable={isDragEnabled}
                    onDragStart={(e) => handleOverviewDragStart(e, widgetId)}
                    onDragOver={isDragEnabled ? handleOverviewDragOver : undefined}
                    onDrop={isDragEnabled ? (e) => handleOverviewDrop(e, widgetId) : undefined}
                    className={`group/card relative bg-card p-4 rounded-2xl border border-border/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[330px] lg:h-[330px] ${accentColor} ${
                      isDragEnabled ? "cursor-grab active:cursor-grabbing hover:scale-[1.005] active:scale-[0.995]" : ""
                    } ${
                      isDragging ? "opacity-30 border-dashed border-primary bg-primary/5" : ""
                    }`}
                  >
                    {/* Drag Handle Indicator */}
                    {isDragEnabled && (
                      <div className="absolute top-3.5 right-3.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none text-muted-foreground/50 flex items-center gap-1 bg-muted/65 px-1.5 py-0.5 rounded-md border border-border/40 backdrop-blur-xs select-none">
                        <GripVertical className="size-3" />
                        <span className="text-[7.5px] font-black uppercase tracking-wider">Drag to reorder</span>
                      </div>
                    )}

                    {getWidgetContent()}
                  </div>
                );
              })}
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
                        className="w-10 h-10 rounded-full object-fill border-2 border-background shadow-xs"
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
                          onClick={() => setOpenPoolGroups(prev => ({ ...prev, [groupName]: !isOpen }))}
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

        {/* Dashboard Notice Preview Modal */}
        {selectedDashboardNotice && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999] animate-in fade-in duration-200">
            <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in scale-in duration-300">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-muted/30 border-b border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone className="size-4.5 text-primary" />
                  <div>
                    <h3 className="text-xs font-black uppercase text-foreground">
                      Official Announcement Circular
                    </h3>
                    <p className="text-[9.5px] font-bold text-muted-foreground tracking-wider uppercase mt-0.5">
                      Reference ID: {selectedDashboardNotice.circularNo}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDashboardNotice(null)}
                  className="size-7.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition flex items-center justify-center font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 bg-card">
                {/* Formal Letterhead */}
                <div className="text-center border-b border-border/40 pb-5 space-y-1 bg-muted/10 p-4 rounded-xl">
                  <h2 className="text-sm font-black tracking-[0.15em] text-foreground uppercase">
                    Pakiza Software Limited
                  </h2>
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    Corporate Office • HR & Operations Division
                  </p>
                  <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground pt-4 border-t border-dashed border-border/40 mt-3">
                    <span>Circular No: {selectedDashboardNotice.circularNo}</span>
                    <span>Date: {selectedDashboardNotice.date}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-black text-foreground">
                    Subject: {selectedDashboardNotice.title}
                  </h3>

                  {/* Notice Detail HTML Content */}
                  <div 
                    className="text-xs leading-relaxed text-foreground/90 space-y-3 prose dark:prose-invert prose-xs"
                    dangerouslySetInnerHTML={{ __html: selectedDashboardNotice.details }}
                  />
                </div>

                {/* Signatory Footer */}
                <div className="pt-6 border-t border-border/30 flex justify-end">
                  <div className="text-right space-y-1">
                    <p className="text-xs font-bold text-foreground">
                      {selectedDashboardNotice.author}
                    </p>
                    <p className="text-[10px] font-semibold text-muted-foreground">
                      {selectedDashboardNotice.role}
                    </p>
                    <p className="text-[9px] uppercase tracking-widest text-primary font-bold">
                      HR & Compliance
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="px-6 py-4 bg-muted/20 border-t border-border/40 flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground font-semibold">
                  Category: <strong className="text-foreground uppercase">{selectedDashboardNotice.category}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => window.print()}
                    className="h-8.5 px-4 bg-muted hover:bg-muted-foreground/10 text-foreground font-bold text-xs rounded-lg transition"
                  >
                    Print Notice
                  </button>
                  <button 
                    onClick={() => setSelectedDashboardNotice(null)}
                    className="h-8.5 px-4 bg-primary hover:opacity-90 text-primary-foreground font-bold text-xs rounded-lg shadow-sm transition"
                  >
                    Acknowledge & Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
