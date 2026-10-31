import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  Search,
  Filter,
  ArrowUpRight,
  History,
  Layers,
  Sparkles,
  TrendingUp,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  FileCode,
  ShieldCheck,
  EyeOff,
  Compass,
} from "lucide-react";
import {
  DEFAULT_MERCHANDISING_PAGES,
  BASELINE_DATE,
  MerchandisingPageRecord,
} from "./-mm-route-catalog";

export const Route = createFileRoute("/shapnocheck")({
  head: () => ({
    meta: [
      { title: "MM Route Catalog & Component Manifest" },
      {
        name: "description",
        content: "Merchandising module specifications, route definitions, and component coverage registry.",
      },
    ],
  }),
  component: ShapnoCheckPage,
});

function ShapnoCheckPage() {
  const [items] = useState<MerchandisingPageRecord[]>(DEFAULT_MERCHANDISING_PAGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMenu, setSelectedMenu] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [activeModalItem, setActiveModalItem] = useState<MerchandisingPageRecord | null>(null);

  // Unique menus list for filter dropdown
  const menus = useMemo(() => {
    const set = new Set<string>();
    DEFAULT_MERCHANDISING_PAGES.forEach((p) => set.add(p.menu));
    return ["All", ...Array.from(set)];
  }, []);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.menu.toLowerCase().includes(q) ||
        item.subMenu.toLowerCase().includes(q) ||
        (item.subGroup && item.subGroup.toLowerCase().includes(q)) ||
        item.fullPath.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

      const matchesMenu = selectedMenu === "All" || item.menu === selectedMenu;

      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Modified" && item.modificationPercent > 0) ||
        (selectedStatus === "Baseline" && item.modificationPercent === 0) ||
        item.status === selectedStatus;

      return matchesSearch && matchesMenu && matchesStatus;
    });
  }, [items, searchQuery, selectedMenu, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const totalItems = items.length;
    const modifiedItems = items.filter((p) => p.modificationPercent > 0).length;
    const totalPercentSum = items.reduce((acc, p) => acc + p.modificationPercent, 0);
    const avgPercent = totalItems > 0 ? (totalPercentSum / totalItems).toFixed(1) : "0.0";
    const totalRevisions = items.reduce((acc, p) => acc + (p.totalRevisions || 0), 0);

    return {
      totalItems,
      modifiedItems,
      unmodifiedItems: totalItems - modifiedItems,
      avgPercent,
      totalRevisions,
    };
  }, [items]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "SL",
      "Sidebar Menu",
      "Sub-Group",
      "Sub-Menu / Tab",
      "Full URL Path",
      "Base Route",
      "Modification %",
      "Status",
      "Last Modified",
      "Total Revisions",
      "Description",
    ];

    const rows = filteredItems.map((p, idx) => [
      (idx + 1).toString(),
      `"${p.menu.replace(/"/g, '""')}"`,
      `"${(p.subGroup || "").replace(/"/g, '""')}"`,
      `"${p.subMenu.replace(/"/g, '""')}"`,
      `"${p.fullPath}"`,
      `"${p.baseRoute}"`,
      `${p.modificationPercent}%`,
      `"${p.status}"`,
      `"${p.lastModified}"`,
      p.totalRevisions.toString(),
      `"${p.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `merchandising_shapnocheck_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for percent badge color
  const getPercentColorBadge = (pct: number) => {
    if (pct === 0) {
      return "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
    }
    if (pct < 30) {
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
    }
    if (pct < 75) {
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
    }
    return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
  };

  // Helper for progress bar fill
  const getProgressBarFill = (pct: number) => {
    if (pct === 0) return "bg-slate-300 dark:bg-slate-700";
    if (pct < 30) return "bg-gradient-to-r from-blue-500 to-indigo-500";
    if (pct < 75) return "bg-gradient-to-r from-amber-500 to-orange-500";
    return "bg-gradient-to-r from-emerald-500 to-teal-500";
  };

  return (
    <MerchandisingLayout
      activePath=""
      breadcrumbs={[
        { label: "Merchandising", to: "/merchandising-dashboard" },
        { label: "MM Route Catalog & Manifest" },
      ]}
      title="MM Route Catalog & Architecture Manifest"
    >
      <div className="space-y-6 pb-12">
        {/* Banner with Discrete Sub-System Notice */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-950 p-6 text-white shadow-xl border border-slate-700/50">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold mb-2 border border-indigo-400/30">
                <EyeOff size={14} className="text-indigo-300" />
                Private Diagnostics Index: <code className="font-mono text-white">/shapnocheck</code>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                MM Sub-System Architecture & Component Manifest
              </h1>
              <p className="text-slate-300 text-xs md:text-sm mt-1.5 max-w-2xl leading-relaxed">
                Comprehensive registry of all <span className="font-bold text-white underline">84 sidebar menus, sub-groups, sub-menus, and report tabs</span> with
                exact feature modification index & status tracking from{" "}
                <span className="font-bold text-teal-300 font-mono">13 October 2026</span>.
              </p>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/20 transition-all shadow-sm"
              >
                <Download size={14} />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
              <span>Total Menu / Sub-items</span>
              <Layers size={16} className="text-teal-600 dark:text-teal-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.totalItems}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Every sidebar menu & tab
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
              <span>Modified Items</span>
              <Sparkles size={16} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.modifiedItems}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Updated since 13 Oct 2026
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
              <span>Baseline (Unchanged)</span>
              <Clock size={16} className="text-slate-500 dark:text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
              {stats.unmodifiedItems}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              0% baseline items
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
              <span>Average Progress</span>
              <TrendingUp size={16} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.avgPercent}%
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Across all 84 items
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
              <span>Total Revisions</span>
              <History size={16} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats.totalRevisions}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Change logs recorded
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sidebar menu, sub-menu, tab, or URL path..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Compass size={14} />
              <span>Sidebar Menu:</span>
            </div>
            <select
              value={selectedMenu}
              onChange={(e) => setSelectedMenu(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {menus.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 ml-1">
              <Filter size={14} />
              <span>Status:</span>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Statuses ({items.length})</option>
              <option value="Baseline">Baseline (0% changes)</option>
              <option value="Modified">Modified (&gt; 0% changes)</option>
              <option value="Completed">Completed (100%)</option>
            </select>
          </div>
        </div>

        {/* Master Table of All 84 Granular Items */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold tracking-wide">
                  <th className="py-3 px-3 w-12 text-center">SL</th>
                  <th className="py-3 px-3.5 min-w-[140px]">Sidebar Menu</th>
                  <th className="py-3 px-3.5 min-w-[150px]">Sub-Group</th>
                  <th className="py-3 px-4 min-w-[200px]">Sub-Menu / Feature / Tab</th>
                  <th className="py-3 px-3 min-w-[240px]">Target URL / Path</th>
                  <th className="py-3 px-4 min-w-[190px]">Modification Progress (%)</th>
                  <th className="py-3 px-3 text-center min-w-[110px]">Status</th>
                  <th className="py-3 px-3 text-center min-w-[105px]">Last Modified</th>
                  <th className="py-3 px-3 text-center min-w-[80px]">Revisions</th>
                  <th className="py-3 px-4 text-right min-w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 dark:text-slate-500">
                      <AlertCircle size={28} className="mx-auto mb-2 text-slate-400" />
                      No merchandising menus match your filter or search query.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => {
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* SL */}
                        <td className="py-3 px-3 text-center font-mono text-slate-400">
                          {index + 1}
                        </td>

                        {/* Menu */}
                        <td className="py-3 px-3.5">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {item.menu}
                          </span>
                        </td>

                        {/* Sub-Group */}
                        <td className="py-3 px-3.5">
                          {item.subGroup ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              {item.subGroup}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">—</span>
                          )}
                        </td>

                        {/* Sub-Menu / Tab */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-teal-700 dark:text-teal-400">
                            {item.subMenu}
                          </div>
                          <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                            {item.description}
                          </div>
                        </td>

                        {/* Target Path */}
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          <a
                            href={item.fullPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-teal-600 dark:hover:text-teal-400 hover:underline inline-flex items-center gap-1 group/link"
                            title={`Navigate to ${item.fullPath}`}
                          >
                            <span className="truncate max-w-[220px]">{item.fullPath}</span>
                            <ArrowUpRight size={12} className="opacity-60 group-hover/link:opacity-100" />
                          </a>
                        </td>

                        {/* % Modification */}
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPercentColorBadge(
                                item.modificationPercent
                              )}`}
                            >
                              {item.modificationPercent}%
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {item.modificationPercent === 0
                                ? "Baseline"
                                : `${item.modificationPercent}% done`}
                            </span>
                          </div>
                          {/* Visual Progress Bar */}
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 rounded-full ${getProgressBarFill(
                                item.modificationPercent
                              )}`}
                              style={{ width: `${Math.max(item.modificationPercent, 2)}%` }}
                            />
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 text-center">
                          {item.modificationPercent === 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              <Clock size={11} />
                              Baseline
                            </span>
                          ) : item.modificationPercent >= 100 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 size={11} />
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              <TrendingUp size={11} />
                              Modified
                            </span>
                          )}
                        </td>

                        {/* Last Modified */}
                        <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          {item.lastModified}
                        </td>

                        {/* Revisions */}
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block font-mono text-[11px] px-2 py-0.5 rounded-md font-semibold ${
                              item.totalRevisions > 0
                                ? "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 font-bold"
                                : "text-slate-400"
                            }`}
                          >
                            {item.totalRevisions}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setActiveModalItem(item)}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-50 dark:text-slate-300 dark:hover:text-teal-300 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
                              title="View change history log"
                            >
                              <History size={13} />
                              <span>History</span>
                            </button>
                            <a
                              href={item.fullPath}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <span>Open</span>
                              <ArrowUpRight size={13} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Change Log History Modal */}
        {activeModalItem && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                <div>
                  <div className="flex items-center gap-2">
                    <History size={18} className="text-teal-600 dark:text-teal-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {activeModalItem.menu} &gt; {activeModalItem.subMenu}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    URL:{" "}
                    <code className="text-teal-600 dark:text-teal-400 font-mono">
                      {activeModalItem.fullPath}
                    </code>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModalItem(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="text-xs">
                    <span className="text-slate-500">Current Progress:</span>{" "}
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {activeModalItem.modificationPercent}% Modification
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-500">Baseline Date:</span>{" "}
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                      {BASELINE_DATE}
                    </span>
                  </div>
                </div>

                {activeModalItem.changeHistory && activeModalItem.changeHistory.length > 0 ? (
                  <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                    {activeModalItem.changeHistory.map((item, i) => (
                      <div key={item.id || i} className="relative flex items-start gap-4 pl-8">
                        <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-teal-500 ring-4 ring-white dark:ring-slate-900" />
                        <div className="flex-1 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 p-3.5 rounded-xl shadow-xs">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {item.type}
                            </span>
                            <span className="text-slate-400 font-mono text-[11px]">
                              {item.date}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {item.description}
                          </p>
                          <div className="mt-2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            +{item.percentDelta}% modification delta
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                    <FileCode size={36} className="mx-auto text-slate-400 mb-2 opacity-60" />
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Baseline State (0% Modifications)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                      No modifications have been recorded for this sub-menu since the 13 October 2026
                      baseline. Any changes made by the agent will be logged here with date, description, and percent delta.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                <a
                  href={activeModalItem.fullPath}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>Open Sub-Menu Directly</span>
                  <ArrowUpRight size={14} />
                </a>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MerchandisingLayout>
  );
}
