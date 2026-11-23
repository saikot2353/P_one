import React, { useState, useMemo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Plus,
  Sparkles,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  Trash2,
  Copy,
  Eye,
  ArrowLeft,
  Save,
  MoveUp,
  MoveDown,
  Layers,
  Building2,
  Store,
  Package,
  Banknote,
  ShoppingCart,
  Users,
  Grid,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Info,
  Clock,
  RotateCcw,
  GripVertical,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowDownToLine,
  Maximize2,
  HelpCircle,
} from "lucide-react";
import {
  DashboardTemplate,
  DashboardWidgetConfig,
  DashboardComponentDefinition,
  DASHBOARD_COMPONENTS_CATALOG,
  loadDashboardTemplates,
  saveDashboardTemplates,
  getActiveDashboardTemplateId,
  setActiveDashboardTemplateId,
  DEFAULT_DASHBOARD_TEMPLATES,
  WidgetColSpan,
} from "./dashboard-maker-types";
import { DashboardWidgetRenderer } from "./DashboardWidgetRenderer";

type DragItemData =
  | { type: "new_component"; componentId: string }
  | { type: "existing_widget"; widgetId: string; fromIndex: number };

export const DashboardMakerView: React.FC = () => {
  const [templates, setTemplates] = useState<DashboardTemplate[]>([]);
  const [activeTemplateId, setActiveId] = useState<string>("");
  const [currentView, setCurrentView] = useState<"list" | "builder">("list");
  const [editingTemplate, setEditingTemplate] = useState<DashboardTemplate | null>(null);

  // Live Canvas View Controls
  const [canvasDevice, setCanvasDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(true);

  // Filters for Template List
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Filters for Component Library in Side Drawer
  const [componentSearch, setComponentSearch] = useState("");
  const [componentModuleFilter, setComponentModuleFilter] = useState<string>("all");

  // Drag and Drop States
  const [draggedItem, setDraggedItem] = useState<DragItemData | null>(null);
  const [hoveredDropIndex, setHoveredDropIndex] = useState<number | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadDashboardTemplates();
    setTemplates(loaded);
    const active = getActiveDashboardTemplateId();
    setActiveId(active);
  }, []);

  // Global safety listener for drag cleanup
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      setDraggedItem(null);
      setHoveredDropIndex(null);
    };
    window.addEventListener("dragend", handleGlobalDragEnd);
    window.addEventListener("mouseup", handleGlobalDragEnd);
    return () => {
      window.removeEventListener("dragend", handleGlobalDragEnd);
      window.removeEventListener("mouseup", handleGlobalDragEnd);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Switch Active Dashboard Template
  const handleSetActive = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveDashboardTemplateId(id);
    setActiveId(id);
    const updated = templates.map((t) => ({
      ...t,
      isActiveMain: t.id === id,
    }));
    setTemplates(updated);
    saveDashboardTemplates(updated);
    showToast("Template set as Active Main Dashboard!");
  };

  // Create New Template
  const handleCreateNew = () => {
    const newTpl: DashboardTemplate = {
      id: "tpl_custom_" + Date.now(),
      title: "My Custom Workspace",
      description: "Visual enterprise dashboard layout tailored with modular drag & drop components.",
      category: "Custom",
      modules: ["hris", "merchandising"],
      isDefault: false,
      isActiveMain: false,
      layoutColumns: 12,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      widgets: [
        { id: "w_inst_1", componentId: "hr_quick_stats", colSpan: 12 },
        { id: "w_inst_2", componentId: "mm_order_pipeline", colSpan: 12 },
        { id: "w_inst_3", componentId: "hr_attendance_pie", colSpan: 6 },
        { id: "w_inst_4", componentId: "mm_buyer_distribution", colSpan: 6 },
      ],
    };
    setEditingTemplate(newTpl);
    setCurrentView("builder");
  };

  // Edit Existing Template
  const handleEdit = (tpl: DashboardTemplate, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingTemplate(JSON.parse(JSON.stringify(tpl)));
    setCurrentView("builder");
  };

  // Duplicate Template
  const handleDuplicate = (tpl: DashboardTemplate, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const copy: DashboardTemplate = {
      ...JSON.parse(JSON.stringify(tpl)),
      id: "tpl_copy_" + Date.now(),
      title: `${tpl.title} (Copy)`,
      isDefault: false,
      isActiveMain: false,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    const updated = [copy, ...templates];
    setTemplates(updated);
    saveDashboardTemplates(updated);
    showToast(`Duplicated "${tpl.title}"`);
  };

  // Delete Template
  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this custom dashboard template?")) return;
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    saveDashboardTemplates(updated);
    if (activeTemplateId === id && updated.length > 0) {
      handleSetActive(updated[0].id);
    }
    showToast("Template deleted.");
  };

  // Save Template from Builder
  const handleSaveBuilder = () => {
    if (!editingTemplate) return;
    if (!editingTemplate.title.trim()) {
      alert("Please provide a title for this template.");
      return;
    }

    // Infer modules from selected widgets
    const usedModules = new Set<DashboardTemplate["modules"][number]>();
    editingTemplate.widgets.forEach((w) => {
      const def = DASHBOARD_COMPONENTS_CATALOG.find((c) => c.id === w.componentId);
      if (def?.module) {
        usedModules.add(def.module);
      }
    });

    const updatedTemplate: DashboardTemplate = {
      ...editingTemplate,
      modules: Array.from(usedModules),
      updatedAt: new Date().toISOString().split("T")[0],
    };

    const exists = templates.some((t) => t.id === updatedTemplate.id);
    let updatedList: DashboardTemplate[];
    if (exists) {
      updatedList = templates.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t));
    } else {
      updatedList = [updatedTemplate, ...templates];
    }

    if (updatedTemplate.isActiveMain) {
      setActiveId(updatedTemplate.id);
      setActiveDashboardTemplateId(updatedTemplate.id);
      updatedList = updatedList.map((t) => ({
        ...t,
        isActiveMain: t.id === updatedTemplate.id,
      }));
    }

    setTemplates(updatedList);
    saveDashboardTemplates(updatedList);
    setEditingTemplate(updatedTemplate);
    showToast("Dashboard layout saved successfully!");
  };

  // Reset to default templates
  const handleResetDefaults = () => {
    if (!window.confirm("Restore factory default dashboard templates? Any custom templates will be preserved.")) return;
    const customOnly = templates.filter((t) => !t.isDefault);
    const merged = [...DEFAULT_DASHBOARD_TEMPLATES, ...customOnly];
    setTemplates(merged);
    saveDashboardTemplates(merged);
    setActiveId(DEFAULT_DASHBOARD_TEMPLATES[0].id);
    setActiveDashboardTemplateId(DEFAULT_DASHBOARD_TEMPLATES[0].id);
    showToast("Default templates restored!");
  };

  // Add Component from Library (Click or Drop)
  const addComponentAtPosition = (componentId: string, insertIndex?: number) => {
    if (!editingTemplate) return;
    const def = DASHBOARD_COMPONENTS_CATALOG.find((c) => c.id === componentId);
    const newWidget: DashboardWidgetConfig = {
      id: "w_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      componentId,
      colSpan: def?.defaultColSpan || 6,
      customTitle: def?.name,
    };

    const currentWidgets = [...editingTemplate.widgets];
    if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= currentWidgets.length) {
      currentWidgets.splice(insertIndex, 0, newWidget);
    } else {
      currentWidgets.push(newWidget);
    }

    setEditingTemplate({
      ...editingTemplate,
      widgets: currentWidgets,
    });
    showToast(`Added "${def?.name || componentId}" to live canvas`);
  };

  // Duplicate an existing widget in canvas
  const handleDuplicateWidget = (widget: DashboardWidgetConfig, index: number) => {
    if (!editingTemplate) return;
    const copy: DashboardWidgetConfig = {
      ...widget,
      id: "w_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      customTitle: widget.customTitle ? `${widget.customTitle} (Copy)` : undefined,
    };
    const currentWidgets = [...editingTemplate.widgets];
    currentWidgets.splice(index + 1, 0, copy);
    setEditingTemplate({
      ...editingTemplate,
      widgets: currentWidgets,
    });
    showToast("Widget duplicated in canvas");
  };

  // Reorder existing widget within canvas
  const moveWidgetToPosition = (fromIndex: number, toIndex: number) => {
    if (!editingTemplate || fromIndex === toIndex) return;
    const currentWidgets = [...editingTemplate.widgets];
    const [moved] = currentWidgets.splice(fromIndex, 1);
    const targetIdx = toIndex > fromIndex ? toIndex - 1 : toIndex;
    currentWidgets.splice(targetIdx, 0, moved);

    setEditingTemplate({
      ...editingTemplate,
      widgets: currentWidgets,
    });
    showToast(`Moved widget to position #${targetIdx + 1}`);
  };

  // Remove Widget from Canvas
  const handleRemoveWidget = (widgetId: string) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      widgets: editingTemplate.widgets.filter((w) => w.id !== widgetId),
    });
    showToast("Widget removed from canvas");
  };

  // Update Widget ColSpan
  const handleWidgetColSpanChange = (widgetId: string, span: WidgetColSpan) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      widgets: editingTemplate.widgets.map((w) => (w.id === widgetId ? { ...w, colSpan: span } : w)),
    });
  };

  // Update Widget Custom Title
  const handleWidgetTitleChange = (widgetId: string, title: string) => {
    if (!editingTemplate) return;
    setEditingTemplate({
      ...editingTemplate,
      widgets: editingTemplate.widgets.map((w) => (w.id === widgetId ? { ...w, customTitle: title } : w)),
    });
  };

  // -------------------------------------------------------------
  // DRAG AND DROP HANDLERS (Snappy & Cross-Browser Reliable)
  // -------------------------------------------------------------
  const onDragStartNew = (e: React.DragEvent, componentId: string) => {
    const data: DragItemData = { type: "new_component", componentId };
    setDraggedItem(data);
    e.dataTransfer.setData("text/plain", JSON.stringify(data));
    e.dataTransfer.effectAllowed = "copyMove";
  };

  const onDragStartExisting = (e: React.DragEvent, widgetId: string, index: number) => {
    const data: DragItemData = { type: "existing_widget", widgetId, fromIndex: index };
    setDraggedItem(data);
    e.dataTransfer.setData("text/plain", JSON.stringify(data));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOverSlot = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (hoveredDropIndex !== targetIndex) {
      setHoveredDropIndex(targetIndex);
    }
  };

  const onDropSlot = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setHoveredDropIndex(null);

    let data: DragItemData | null = draggedItem;
    if (!data) {
      try {
        const raw = e.dataTransfer.getData("text/plain");
        if (raw) data = JSON.parse(raw);
      } catch {
        // fallback
      }
    }

    if (!data) return;

    if (data.type === "new_component") {
      addComponentAtPosition(data.componentId, targetIndex);
    } else if (data.type === "existing_widget") {
      moveWidgetToPosition(data.fromIndex, targetIndex);
    }

    setDraggedItem(null);
  };

  // Filtered Templates for List View
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === "All" || t.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [templates, searchQuery, categoryFilter]);

  // Filtered Component Catalog for Side Drawer
  const filteredCatalog = useMemo(() => {
    return DASHBOARD_COMPONENTS_CATALOG.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(componentSearch.toLowerCase()) ||
        c.description.toLowerCase().includes(componentSearch.toLowerCase()) ||
        c.moduleLabel.toLowerCase().includes(componentSearch.toLowerCase());
      const matchModule = componentModuleFilter === "all" || c.module === componentModuleFilter;
      return matchSearch && matchModule;
    });
  }, [componentSearch, componentModuleFilter]);

  const activeDraggedDef =
    draggedItem?.type === "new_component"
      ? DASHBOARD_COMPONENTS_CATALOG.find((c) => c.id === draggedItem.componentId)
      : null;

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 dark:border-slate-200 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="size-4 text-emerald-400 dark:text-emerald-600" />
          {toastMessage}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW 1: TEMPLATE GALLERY & LIST MODE                          */}
      {/* ------------------------------------------------------------- */}
      {currentView === "list" && (
        <div className="space-y-5">
          {/* Studio Banner */}
          <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-600 text-white">
                    Visual Dashboard Studio
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    Live Drag & Drop Component Customizer
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
                  <Sparkles className="size-6 text-blue-600" />
                  Dashboard Maker
                </h1>
                <p className="text-xs text-muted-foreground max-w-2xl">
                  Build custom dashboards with live visual feedback: select widgets from the side panel, drag & drop into the live canvas, resize width, and activate any layout as your Main Dashboard.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <Link
                  to="/"
                  className="h-10 px-4 rounded-xl border border-border/70 hover:bg-muted text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <LayoutDashboard className="size-4 text-primary" />
                  View Main Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Plus className="size-4" />
                  Create Dashboard Template
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-border/30 text-xs">
              <div className="p-3 rounded-xl bg-background/80 border border-border/50">
                <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Total Templates
                </span>
                <span className="text-xl font-black font-mono text-foreground mt-0.5 block">{templates.length}</span>
              </div>
              <div className="p-3 rounded-xl bg-background/80 border border-border/50">
                <span className="text-[10.5px] font-bold text-emerald-600 uppercase tracking-wider block">
                  Active Main Dashboard
                </span>
                <span className="text-sm font-bold text-foreground truncate mt-0.5 block">
                  {templates.find((t) => t.id === activeTemplateId)?.title || "Standard HRIS"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-background/80 border border-border/50">
                <span className="text-[10.5px] font-bold text-blue-600 uppercase tracking-wider block">
                  Modular Components
                </span>
                <span className="text-xl font-black font-mono text-foreground mt-0.5 block">
                  {DASHBOARD_COMPONENTS_CATALOG.length} across 5 Modules
                </span>
              </div>
              <div className="p-3 rounded-xl bg-background/80 border border-border/50">
                <span className="text-[10.5px] font-bold text-purple-600 uppercase tracking-wider block">
                  Custom User Templates
                </span>
                <span className="text-xl font-black font-mono text-foreground mt-0.5 block">
                  {templates.filter((t) => !t.isDefault).length} Saved
                </span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/60">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {["All", "Executive", "Operations", "Departmental", "Custom"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    categoryFilter === cat
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 rounded-lg border border-border/60 bg-muted/20 text-xs outline-none focus:border-primary"
                />
              </div>
              <button
                type="button"
                onClick={handleResetDefaults}
                title="Restore default templates"
                className="size-8 rounded-lg border border-border/60 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Template Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((tpl) => {
              const isActive = tpl.id === activeTemplateId;
              return (
                <div
                  key={tpl.id}
                  className={`bg-card rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                    isActive ? "border-emerald-500/80 ring-2 ring-emerald-500/20" : "border-border/60"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                        {tpl.category}
                      </span>
                      {isActive ? (
                        <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="size-3" /> Active Main
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleSetActive(tpl.id, e)}
                          className="text-[10.5px] font-semibold text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
                        >
                          Set as Main
                        </button>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-foreground leading-snug">{tpl.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{tpl.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {tpl.modules.map((m) => (
                        <span
                          key={m}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 uppercase tracking-wider"
                        >
                          {m === "merchandising" ? "MM Module" : m}
                        </span>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-xl bg-muted/20 border border-border/40 text-xs flex items-center justify-between">
                      <span className="text-muted-foreground text-[11px]">Selected Widgets</span>
                      <span className="font-mono font-bold text-foreground">{tpl.widgets.length} components</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleDuplicate(tpl, e)}
                        className="size-8 rounded-lg border border-border/60 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title="Duplicate Template"
                      >
                        <Copy className="size-3.5" />
                      </button>
                      {!tpl.isDefault && (
                        <button
                          type="button"
                          onClick={(e) => handleDelete(tpl.id, e)}
                          className="size-8 rounded-lg border border-transparent hover:border-rose-500/30 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete Template"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleEdit(tpl, e)}
                      className="h-8 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <SlidersHorizontal className="size-3.5" />
                      Open Live Drag & Drop Studio
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW 2: LIVE VISUAL CANVAS WITH DRAGGABLE SIDE COMPONENT DOCK  */}
      {/* ------------------------------------------------------------- */}
      {currentView === "builder" && editingTemplate && (
        <div className="space-y-3">
          {/* Top Visual Studio Control Bar */}
          <div className="bg-card rounded-2xl border border-border/60 p-3.5 shadow-sm space-y-2.5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Left Title and Back */}
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setCurrentView("list")}
                  className="size-8.5 rounded-xl border border-border/60 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                  title="Back to Template Gallery"
                >
                  <ArrowLeft className="size-4" />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.2 rounded bg-primary/10 text-primary">
                      Drag & Drop Canvas
                    </span>
                    <span className="text-[11px] text-muted-foreground hidden sm:inline">
                      Drag widgets from the side dock into the live view, or drag handles to reorder!
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editingTemplate.title}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                    className="text-base sm:text-lg font-bold text-foreground bg-transparent border-b border-dashed border-border/80 focus:border-primary outline-none w-full max-w-md"
                    placeholder="Dashboard Template Title..."
                  />
                </div>
              </div>

              {/* Right: Device Switcher, Active Toggle, and Save */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {/* Side Dock Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsSideDrawerOpen(!isSideDrawerOpen)}
                  className={`h-8 px-2.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isSideDrawerOpen
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  title="Toggle Components Side Panel"
                >
                  {isSideDrawerOpen ? <PanelLeftClose className="size-3.5" /> : <PanelLeftOpen className="size-3.5" />}
                  <span>{isSideDrawerOpen ? "Hide Components" : "Show Components"}</span>
                </button>

                {/* Device Switcher */}
                <div className="inline-flex rounded-lg border border-border/60 p-0.5 bg-muted/20">
                  <button
                    type="button"
                    onClick={() => setCanvasDevice("desktop")}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      canvasDevice === "desktop" ? "bg-background text-primary shadow-xs font-bold" : "text-muted-foreground"
                    }`}
                    title="Desktop Wide View"
                  >
                    <Monitor className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCanvasDevice("tablet")}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      canvasDevice === "tablet" ? "bg-background text-primary shadow-xs font-bold" : "text-muted-foreground"
                    }`}
                    title="Tablet Mode (768px)"
                  >
                    <Tablet className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCanvasDevice("mobile")}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      canvasDevice === "mobile" ? "bg-background text-primary shadow-xs font-bold" : "text-muted-foreground"
                    }`}
                    title="Mobile Mode (420px)"
                  >
                    <Smartphone className="size-3.5" />
                  </button>
                </div>

                {/* Set as Active Main Switch */}
                <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/50 bg-muted/20 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={editingTemplate.isActiveMain || editingTemplate.id === activeTemplateId}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setEditingTemplate({ ...editingTemplate, isActiveMain: isChecked });
                    }}
                    className="size-3.5 accent-primary rounded cursor-pointer"
                  />
                  <span className="font-semibold text-foreground text-[11px]">Active Main</span>
                </label>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSaveBuilder}
                  className="h-8 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Save className="size-3.5" />
                  Save Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE DRAGGING BANNER: Displays when user picks up any component */}
          {draggedItem && (
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-3 rounded-xl shadow-lg border border-blue-400/40 flex items-center justify-between text-xs font-bold animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 animate-spin text-amber-300" />
                <span>
                  Dragging:{" "}
                  <span className="underline decoration-amber-300 decoration-2 font-black">
                    {activeDraggedDef ? activeDraggedDef.name : "Canvas Widget"}
                  </span>
                </span>
                <span className="text-[11px] font-normal opacity-90 hidden sm:inline">
                  — Hover over any glowing drop slot in the live view below and release to place it!
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDraggedItem(null)}
                className="text-[11px] font-semibold bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded cursor-pointer transition-colors"
              >
                Cancel Drag
              </button>
            </div>
          )}

          {/* SPLIT SCREEN WORKSPACE: SIDEBAR DOCK (LEFT) + LIVE DASHBOARD CANVAS (RIGHT) */}
          <div className="flex gap-4 items-start relative min-h-[750px]">
            {/* ----------------------------------------------------------- */}
            {/* 1. SIDE COMPONENT DOCK (Draggable tiles with clear cues)    */}
            {/* ----------------------------------------------------------- */}
            {isSideDrawerOpen && (
              <div className="w-80 sm:w-92 shrink-0 bg-card rounded-2xl border border-border/60 p-3.5 space-y-3 sticky top-4 max-h-[820px] overflow-hidden flex flex-col shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <div>
                    <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Layers className="size-3.5 text-blue-600" />
                      Component Library ({filteredCatalog.length})
                    </h3>
                    <p className="text-[10.5px] text-muted-foreground">
                      Drag cards directly into the canvas or click <strong>+</strong>
                    </p>
                  </div>
                </div>

                {/* Module Selector Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs no-scrollbar">
                  {[
                    { id: "all", label: "All" },
                    { id: "hris", label: "HRIS" },
                    { id: "merchandising", label: "MM" },
                    { id: "inventory", label: "Inv" },
                    { id: "accounts", label: "Accounts" },
                    { id: "procurement", label: "Proc" },
                  ].map((mod) => (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => setComponentModuleFilter(mod.id)}
                      className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                        componentModuleFilter === mod.id
                          ? "bg-blue-600 text-white shadow-2xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {mod.label}
                    </button>
                  ))}
                </div>

                {/* Search Box */}
                <div className="relative">
                  <Search className="size-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search components (e.g. attendance, orders)..."
                    value={componentSearch}
                    onChange={(e) => setComponentSearch(e.target.value)}
                    className="w-full h-7 pl-7 pr-2.5 rounded-lg border border-border/60 bg-muted/20 text-xs outline-none focus:border-primary"
                  />
                </div>

                {/* Draggable Component Cards List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {filteredCatalog.map((comp) => {
                    const isAdded = editingTemplate.widgets.some((w) => w.componentId === comp.id);
                    const isBeingDragged =
                      draggedItem?.type === "new_component" && draggedItem.componentId === comp.id;

                    return (
                      <div
                        key={comp.id}
                        draggable={true}
                        onDragStart={(e) => onDragStartNew(e, comp.id)}
                        className={`group p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between gap-2 cursor-grab active:cursor-grabbing hover:shadow-sm select-none ${
                          isBeingDragged
                            ? "opacity-50 ring-2 ring-blue-500 bg-blue-500/10 border-blue-500"
                            : isAdded
                            ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/70"
                            : "border-border/60 bg-background hover:border-blue-400 hover:bg-blue-50/25 dark:hover:bg-blue-950/25"
                        }`}
                        title="Drag this card into the dashboard view, or click +"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {/* Visible Drag Handle Indicator */}
                          <div className="size-6 rounded-md bg-muted/50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors text-muted-foreground">
                            <GripVertical className="size-3.5" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-muted text-muted-foreground">
                                {comp.moduleLabel.split(" ")[0]}
                              </span>
                              <span className="text-[9px] text-muted-foreground truncate">
                                • {comp.category.split(" ")[0]}
                              </span>
                            </div>
                            <div className="font-bold text-foreground text-xs truncate leading-tight mt-0.5">
                              {comp.name}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => addComponentAtPosition(comp.id)}
                            className={`size-6 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                              isAdded
                                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                                : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                            }`}
                            title="Click to add to canvas"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-[11px] text-blue-800 dark:text-blue-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <GripVertical className="size-3.5 text-blue-600 shrink-0" />
                    How Drag & Drop Works:
                  </div>
                  <p className="text-[10px] text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
                    1. Click and hold any card above.<br />
                    2. Drag it over the dashboard view on the right.<br />
                    3. Release inside any highlighted drop zone!
                  </p>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* 2. THE LIVE DASHBOARD VIEW (With prominent drop zones)      */}
            {/* ----------------------------------------------------------- */}
            <div className="flex-1 min-w-0 bg-card rounded-2xl border border-border/60 p-4 sm:p-5 shadow-xs flex flex-col space-y-4">
              {/* Canvas Header / Banner */}
              <div className="flex items-center justify-between border-b border-border/40 pb-3 gap-2">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <LayoutDashboard className="size-4 text-primary" />
                    Live Dashboard View
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Customize in place: reorder by dragging, adjust widget widths, or rename headers
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {editingTemplate.widgets.length} Widgets
                  </span>
                </div>
              </div>

              {/* Rendered Canvas Frame according to Device */}
              <div
                className={`mx-auto transition-all duration-300 w-full ${
                  canvasDevice === "tablet"
                    ? "max-w-3xl border-x-4 border-slate-300 dark:border-slate-800 p-3 rounded-2xl bg-muted/10 shadow-xl"
                    : canvasDevice === "mobile"
                    ? "max-w-sm border-x-4 border-slate-300 dark:border-slate-800 p-2 rounded-2xl bg-muted/10 shadow-xl"
                    : "w-full"
                }`}
              >
                {/* Empty State / Initial Dropzone */}
                {editingTemplate.widgets.length === 0 ? (
                  <div
                    onDragOver={(e) => onDragOverSlot(e, 0)}
                    onDrop={(e) => onDropSlot(e, 0)}
                    className={`p-16 text-center border-2 border-dashed rounded-2xl space-y-3 cursor-pointer transition-all ${
                      hoveredDropIndex === 0
                        ? "border-blue-600 bg-blue-600/10 scale-[1.01]"
                        : "border-blue-400/60 bg-blue-50/20 dark:bg-blue-950/20"
                    }`}
                  >
                    <div className="size-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                      <ArrowDownToLine className="size-7 animate-bounce" />
                    </div>
                    <div className="font-bold text-foreground text-sm">Your Canvas is Ready</div>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                      <strong>Drag any component from the Component Library on the left</strong> and drop it right into this box, or click the <strong>+</strong> button on any card!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-12 gap-3.5 lg:gap-4.5">
                    {/* Top Drop Slot before the first widget (visible when dragging) */}
                    {draggedItem && (
                      <div
                        onDragOver={(e) => onDragOverSlot(e, 0)}
                        onDrop={(e) => onDropSlot(e, 0)}
                        className={`col-span-12 transition-all duration-200 rounded-xl flex items-center justify-center border-2 border-dashed cursor-pointer ${
                          hoveredDropIndex === 0
                            ? "h-20 bg-blue-600 text-white border-blue-600 shadow-xl scale-[1.01]"
                            : "h-14 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/60 hover:border-blue-600 animate-pulse"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <Plus className="size-4 animate-bounce" />
                          <span>
                            {hoveredDropIndex === 0
                              ? "✨ Release here to place at the very top (Position #1)"
                              : "📥 Drop here to place at the top (Position #1)"}
                          </span>
                        </div>
                      </div>
                    )}

                    {editingTemplate.widgets.map((widget, idx) => {
                      const def = DASHBOARD_COMPONENTS_CATALOG.find((c) => c.id === widget.componentId);
                      const colSpanClass = getColSpanClass(widget.colSpan, canvasDevice);
                      const isBeingDragged =
                        draggedItem?.type === "existing_widget" && draggedItem.widgetId === widget.id;
                      const isHoveredSlot = hoveredDropIndex === idx + 1;

                      return (
                        <React.Fragment key={widget.id}>
                          {/* The Widget Box */}
                          <div
                            className={`${colSpanClass} relative group transition-all duration-200 ${
                              isBeingDragged ? "opacity-30 scale-95" : ""
                            }`}
                            onDragOver={(e) => onDragOverSlot(e, idx)}
                            onDrop={(e) => onDropSlot(e, idx)}
                          >
                            {/* Editable Widget Wrapper */}
                            <div className="h-full rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                              {/* Prominent Drag Header Bar with Clear Drag Cue */}
                              <div className="bg-muted/50 border-b border-border/60 px-3 py-2 flex items-center justify-between gap-2 text-xs">
                                {/* Drag Handle & Title */}
                                <div className="flex items-center gap-2 min-w-0">
                                  <div
                                    draggable={true}
                                    onDragStart={(e) => onDragStartExisting(e, widget.id, idx)}
                                    className="cursor-grab active:cursor-grabbing px-2 py-1 rounded-md bg-background hover:bg-blue-600 hover:text-white border border-border/60 text-muted-foreground transition-all flex items-center gap-1 font-bold text-[10.5px] shadow-2xs select-none"
                                    title="Click and drag to reorder on canvas"
                                  >
                                    <GripVertical className="size-3.5" />
                                    <span>#{idx + 1}</span>
                                  </div>

                                  <input
                                    type="text"
                                    value={widget.customTitle || def?.name}
                                    onChange={(e) => handleWidgetTitleChange(widget.id, e.target.value)}
                                    className="font-bold text-xs text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary outline-none truncate max-w-[160px] sm:max-w-xs"
                                    title="Click to rename widget title"
                                  />
                                </div>

                                {/* Width Pills, Duplicate & Delete */}
                                <div className="flex items-center gap-1 shrink-0">
                                  {/* Width selector pills */}
                                  <div className="hidden sm:inline-flex rounded-lg border border-border/60 p-0.5 bg-background text-[10px] font-bold">
                                    {[
                                      { label: "25%", val: 3 as WidgetColSpan },
                                      { label: "33%", val: 4 as WidgetColSpan },
                                      { label: "50%", val: 6 as WidgetColSpan },
                                      { label: "100%", val: 12 as WidgetColSpan },
                                    ].map((w) => (
                                      <button
                                        key={w.val}
                                        type="button"
                                        onClick={() => handleWidgetColSpanChange(widget.id, w.val)}
                                        className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                                          widget.colSpan === w.val
                                            ? "bg-primary text-primary-foreground shadow-2xs"
                                            : "text-muted-foreground hover:text-foreground"
                                        }`}
                                        title={`Set width: ${w.label}`}
                                      >
                                        {w.label}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Duplicate button */}
                                  <button
                                    type="button"
                                    onClick={() => handleDuplicateWidget(widget, idx)}
                                    className="size-6 rounded border border-border/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                                    title="Duplicate Widget"
                                  >
                                    <Copy className="size-3" />
                                  </button>

                                  {/* Up / Down Move buttons */}
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => moveWidgetToPosition(idx, idx - 1)}
                                    className="size-6 rounded border border-border/50 hover:bg-muted disabled:opacity-20 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                                    title="Move Up"
                                  >
                                    <MoveUp className="size-3" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === editingTemplate.widgets.length - 1}
                                    onClick={() => moveWidgetToPosition(idx, idx + 2)}
                                    className="size-6 rounded border border-border/50 hover:bg-muted disabled:opacity-20 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                                    title="Move Down"
                                  >
                                    <MoveDown className="size-3" />
                                  </button>

                                  {/* Delete Widget */}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveWidget(widget.id)}
                                    className="size-6 rounded border border-transparent hover:border-rose-500/30 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 flex items-center justify-center cursor-pointer transition-colors"
                                    title="Remove Widget"
                                  >
                                    <Trash2 className="size-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Live Rendered Content */}
                              <div className="p-3 sm:p-4 flex-1">
                                <DashboardWidgetRenderer widget={widget} isCompact={canvasDevice === "mobile"} />
                              </div>
                            </div>
                          </div>

                          {/* Dedicated Drop Slot between widgets (expands prominently during drag) */}
                          {draggedItem && (
                            <div
                              onDragOver={(e) => onDragOverSlot(e, idx + 1)}
                              onDrop={(e) => onDropSlot(e, idx + 1)}
                              className={`col-span-12 transition-all duration-200 rounded-xl flex items-center justify-center border-2 border-dashed cursor-pointer ${
                                isHoveredSlot
                                  ? "h-20 bg-blue-600 text-white border-blue-600 shadow-xl scale-[1.01]"
                                  : "h-14 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/60 hover:border-blue-600 animate-pulse"
                              }`}
                            >
                              <div className="flex items-center gap-2 font-bold text-xs">
                                <Plus className="size-4 animate-bounce" />
                                <span>
                                  {isHoveredSlot
                                    ? `✨ Release here to place between #${idx + 1} and #${idx + 2}`
                                    : `📥 Drop here to insert at Position #${idx + 2}`}
                                </span>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}

                    {/* Bottom Append Drop Zone (Always available for drag & drop or click) */}
                    <div
                      onDragOver={(e) => onDragOverSlot(e, editingTemplate.widgets.length)}
                      onDrop={(e) => onDropSlot(e, editingTemplate.widgets.length)}
                      className={`col-span-12 p-6 text-center border-2 border-dashed rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                        hoveredDropIndex === editingTemplate.widgets.length
                          ? "border-blue-600 bg-blue-600 text-white shadow-xl scale-[1.01]"
                          : "border-border/70 hover:border-blue-500 hover:bg-blue-50/15 dark:hover:bg-blue-950/20 text-muted-foreground"
                      }`}
                    >
                      <div className="size-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
                        <Plus className="size-5" />
                      </div>
                      <div className="font-bold text-xs text-foreground">
                        {hoveredDropIndex === editingTemplate.widgets.length
                          ? "✨ Release to append widget to the end"
                          : "Drop component here to append to the end of the dashboard"}
                      </div>
                      <span className="text-[10.5px] text-muted-foreground">
                        You can also drag directly from the component library on the left
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function getColSpanClass(span: WidgetColSpan, device: "desktop" | "tablet" | "mobile"): string {
  if (device === "mobile") {
    return "col-span-12";
  }
  if (device === "tablet") {
    if (span >= 6) return "col-span-12";
    return "col-span-6";
  }
  switch (span) {
    case 12:
      return "col-span-12";
    case 6:
      return "col-span-12 lg:col-span-6";
    case 4:
      return "col-span-12 sm:col-span-6 lg:col-span-4";
    case 3:
      return "col-span-12 sm:col-span-6 lg:col-span-3";
    default:
      return "col-span-12 lg:col-span-6";
  }
}
