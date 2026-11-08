import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Copy,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  X,
  Layers,
  Sparkles,
  ArrowLeft,
  Save,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import {
  MMYarnRateWeeklyRecord,
  YarnRateEntryRow,
  YarnTypeUpchargeRow,
  PREDEFINED_YARN_COMPOSITIONS,
  DEFAULT_YARN_TYPES_UPCHARGE,
  MMMasterDataRepository,
} from "../../../lib/merchandising-master-data";
import { SearchableSelect } from "../../ui/searchable-select";

export function YarnRateManager() {
  const [records, setRecords] = useState<MMYarnRateWeeklyRecord[]>(() =>
    MMMasterDataRepository.getYarnRates(),
  );

  // Active Yarn Counts from Yarn Count Master
  const activeYarnCounts = useMemo(() => {
    return MMMasterDataRepository.getYarnCounts().filter((yc) => yc.status === "Active");
  }, []);

  // Active Compositions from Fabric Composition Master
  const activeFabricCompositions = useMemo(() => {
    return MMMasterDataRepository.getFabricCompositions().filter((fc) => fc.status === "Active");
  }, []);

  // Merged composition options (predefined + custom active compositions)
  const compositionOptions = useMemo(() => {
    const set = new Set<string>(PREDEFINED_YARN_COMPOSITIONS);
    activeFabricCompositions.forEach((fc) => set.add(fc.name));
    return Array.from(set).map((c) => ({ value: c, label: c }));
  }, [activeFabricCompositions]);

  const yarnCountOptions = useMemo(() => {
    return activeYarnCounts.map((yc) => ({ value: yc.yarnCount, label: yc.yarnCount }));
  }, [activeYarnCounts]);

  const yarnTypeOptions = useMemo(() => {
    return DEFAULT_YARN_TYPES_UPCHARGE.map((yt) => ({
      value: yt.yarnType,
      label: yt.yarnType,
    }));
  }, []);

  const saveRecords = (newRecords: MMYarnRateWeeklyRecord[]) => {
    setRecords(newRecords);
    MMMasterDataRepository.saveYarnRates(newRecords);
  };

  // View Mode: "list" | "form" | "view"
  const [viewMode, setViewMode] = useState<"list" | "form" | "view">("list");
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedRecord, setSelectedRecord] = useState<MMYarnRateWeeklyRecord | null>(null);

  // Expanded row id in the register list for inline preview
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Search & Filter & Pagination for list
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Active" | "Inactive">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Form State
  const [recordDate, setRecordDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [weekLabel, setWeekLabel] = useState<string>("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [remarks, setRemarks] = useState<string>("");
  const [entries, setEntries] = useState<YarnRateEntryRow[]>([]);
  const [upcharges, setUpcharges] = useState<YarnTypeUpchargeRow[]>([]);

  // Confirmation Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "delete" | "status";
    item: MMYarnRateWeeklyRecord | null;
    targetStatus?: "Active" | "Inactive";
  }>({ isOpen: false, type: "delete", item: null });

  // Calculate week label automatically from date
  const computeWeekLabel = (dStr: string): string => {
    try {
      const d = new Date(dStr);
      if (isNaN(d.getTime())) return "Current Week Rate";
      const startOfYear = new Date(d.getFullYear(), 0, 1);
      const pastDays = (d.getTime() - startOfYear.getTime()) / 86400000;
      const weekNum = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
      return `Week ${weekNum}, ${d.getFullYear()} (${dStr})`;
    } catch {
      return "Weekly Rate";
    }
  };

  // Switch to Create Mode
  const handleOpenCreate = () => {
    setSelectedRecord(null);
    setFormMode("create");
    const today = new Date().toISOString().split("T")[0];
    setRecordDate(today);
    setWeekLabel(computeWeekLabel(today));
    setFormStatus("Active");
    setRemarks("");

    // Initial default row
    const defaultCount = activeYarnCounts[0]?.yarnCount || "30/1";
    setEntries([
      {
        id: `row-${Date.now()}-1`,
        date: today,
        grade: "A",
        count: defaultCount,
        composition: PREDEFINED_YARN_COMPOSITIONS[0],
        rate: 3.45,
      },
      {
        id: `row-${Date.now()}-2`,
        date: today,
        grade: "B",
        count: defaultCount,
        composition: PREDEFINED_YARN_COMPOSITIONS[0],
        rate: 3.15,
      },
    ]);

    // No default preselected upcharges
    setUpcharges([]);

    setViewMode("form");
  };

  // Switch to Edit Mode
  const handleOpenEdit = (rec: MMYarnRateWeeklyRecord) => {
    setSelectedRecord(rec);
    setFormMode("edit");
    setRecordDate(rec.effectiveDate);
    setWeekLabel(rec.weekLabel);
    setFormStatus(rec.status);
    setRemarks(rec.remarks || "");
    setEntries(JSON.parse(JSON.stringify(rec.entries || [])));
    setUpcharges(JSON.parse(JSON.stringify(rec.upcharges || [])));
    setViewMode("form");
  };

  // Switch to View Mode (Two-column Grade A / B layout)
  const handleOpenView = (rec: MMYarnRateWeeklyRecord) => {
    setSelectedRecord(rec);
    setViewMode("view");
  };

  // Copy From feature
  const handleCopyFrom = (sourceRecordId: string) => {
    const source = records.find((r) => r.id === sourceRecordId);
    if (!source) return;

    // Deep copy entries with new row ids
    const copiedEntries: YarnRateEntryRow[] = (source.entries || []).map((e, idx) => ({
      ...e,
      id: `copy-${Date.now()}-${idx}`,
      date: recordDate, // preserve current date or keep as needed
    }));

    // Deep copy upcharges with new ids
    const copiedUpcharges: YarnTypeUpchargeRow[] = (source.upcharges || []).map((u, idx) => ({
      ...u,
      id: `copy-up-${Date.now()}-${idx}`,
    }));

    setEntries(copiedEntries);
    setUpcharges(copiedUpcharges);
    toast.success(
      `Copied ${copiedEntries.length} entries & ${copiedUpcharges.length} upcharges from ${source.weekLabel}.`,
    );
  };

  // Add Dynamic Row to Main Yarn Rate Entry Section
  const handleAddRow = () => {
    const defaultCount = activeYarnCounts[0]?.yarnCount || "30/1";
    const newRow: YarnRateEntryRow = {
      id: `row-${Date.now()}-${entries.length + 1}`,
      date: recordDate,
      grade: "A",
      count: defaultCount,
      composition: PREDEFINED_YARN_COMPOSITIONS[0],
      rate: 3.4,
    };
    setEntries((prev) => [...prev, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    if (entries.length <= 1) {
      toast.error("At least one rate entry row is required.");
      return;
    }
    setEntries((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRowChange = <K extends keyof YarnRateEntryRow>(
    id: string,
    field: K,
    val: YarnRateEntryRow[K],
  ) => {
    setEntries((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };

  // Add Dynamic Row to Yarn Type / Certification Upcharge Section
  const handleAddUpcharge = () => {
    const newUpcharge: YarnTypeUpchargeRow = {
      id: `up-${Date.now()}-${upcharges.length + 1}`,
      yarnType: "",
      upcharge: 0,
    };
    setUpcharges((prev) => [...prev, newUpcharge]);
  };

  const handleRemoveUpcharge = (id: string) => {
    setUpcharges((prev) => prev.filter((u) => u.id !== id));
  };

  const handleUpchargeTypeChange = (id: string, newType: string) => {
    if (!newType) {
      setUpcharges((prev) =>
        prev.map((u) => (u.id === id ? { ...u, yarnType: "", upcharge: 0 } : u)),
      );
      return;
    }
    // Prevent duplicate selection
    const alreadySelected = upcharges.some((u) => u.id !== id && u.yarnType === newType);
    if (alreadySelected) {
      toast.error(`"${newType}" is already added to this upcharge list.`);
      return;
    }
    const defaultVal =
      DEFAULT_YARN_TYPES_UPCHARGE.find((yt) => yt.yarnType === newType)?.defaultUpcharge ?? 0;

    setUpcharges((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, yarnType: newType, upcharge: u.upcharge > 0 ? u.upcharge : defaultVal }
          : u,
      ),
    );
  };

  const handleUpchargeValueChange = (id: string, val: number) => {
    setUpcharges((prev) =>
      prev.map((u) => (u.id === id ? { ...u, upcharge: Math.max(0, val) } : u)),
    );
  };

  // Save Form Handler
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recordDate) {
      toast.error("Please specify an effective Date.");
      return;
    }
    if (entries.length === 0) {
      toast.error("Please add at least one Yarn Rate row.");
      return;
    }

    // Validation: Check duplicate combinations of Grade + Count + Composition
    const seen = new Set<string>();
    for (let i = 0; i < entries.length; i++) {
      const row = entries[i];
      if (!row.count) {
        toast.error(`Row #${i + 1}: Yarn Count is required.`);
        return;
      }
      if (!row.composition) {
        toast.error(`Row #${i + 1}: Composition is required.`);
        return;
      }
      if (row.rate < 0 || isNaN(row.rate)) {
        toast.error(`Row #${i + 1}: Rate must be a valid non-negative number.`);
        return;
      }

      const key = `${row.grade}_${row.count}_${row.composition}`.toLowerCase();
      if (seen.has(key)) {
        toast.error(
          `Duplicate entry detected in Row #${i + 1}: [Grade: ${row.grade}, Count: ${row.count}, Composition: ${row.composition}]. Duplicate combinations are not allowed.`,
        );
        return;
      }
      seen.add(key);
    }

    // Validation: Check duplicate upcharge types
    const upchargeSeen = new Set<string>();
    for (let i = 0; i < upcharges.length; i++) {
      const up = upcharges[i];
      if (!up.yarnType || !up.yarnType.trim()) {
        toast.error(`Row #${i + 1} in Upcharges: Please select a Yarn Type / Certification, or remove the row.`);
        return;
      }
      if (upchargeSeen.has(up.yarnType)) {
        toast.error(`Duplicate Yarn Type detected in upcharges: "${up.yarnType}".`);
        return;
      }
      upchargeSeen.add(up.yarnType);
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const d = new Date(recordDate);
    const year = d.getFullYear() || 2026;
    const computedLabel = weekLabel.trim() || computeWeekLabel(recordDate);
    const finalEntries = entries.map((e) => ({ ...e, date: e.date || recordDate }));

    if (formMode === "create") {
      const newRecordNo = `YR-${year}-W${String(records.length + 40).padStart(2, "0")}`;
      const newRecord: MMYarnRateWeeklyRecord = {
        id: `yr-${Date.now()}`,
        recordNo: newRecordNo,
        effectiveDate: recordDate,
        weekNumber: 45,
        year,
        weekLabel: computedLabel,
        entries: finalEntries,
        upcharges,
        status: formStatus,
        remarks: remarks.trim(),
        createdAt: now,
        updatedAt: now,
      };

      saveRecords([newRecord, ...records]);
      toast.success(`Yarn Rate submission "${computedLabel}" saved successfully.`);
    } else if (formMode === "edit" && selectedRecord) {
      const updated = records.map((r) =>
        r.id === selectedRecord.id
          ? {
              ...r,
              effectiveDate: recordDate,
              weekLabel: computedLabel,
              entries: finalEntries,
              upcharges,
              status: formStatus,
              remarks: remarks.trim(),
              updatedAt: now,
            }
          : r,
      );
      saveRecords(updated);
      toast.success(`Yarn Rate submission "${computedLabel}" updated.`);
    }

    setViewMode("list");
  };

  // Status & Delete Handlers
  const promptStatusChange = (item: MMYarnRateWeeklyRecord) => {
    const nextStatus = item.status === "Active" ? "Inactive" : "Active";
    setConfirmDialog({
      isOpen: true,
      type: "status",
      item,
      targetStatus: nextStatus,
    });
  };

  const promptDelete = (item: MMYarnRateWeeklyRecord) => {
    setConfirmDialog({ isOpen: true, type: "delete", item });
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.item) return;

    if (confirmDialog.type === "delete") {
      const filtered = records.filter((r) => r.id !== confirmDialog.item!.id);
      saveRecords(filtered);
      toast.success(`Yarn Rate record "${confirmDialog.item.weekLabel}" deleted.`);
    } else if (confirmDialog.type === "status" && confirmDialog.targetStatus) {
      const updated = records.map((r) =>
        r.id === confirmDialog.item!.id
          ? {
              ...r,
              status: confirmDialog.targetStatus!,
              updatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
            }
          : r,
      );
      saveRecords(updated);
      toast.success(`Status updated for "${confirmDialog.item.weekLabel}".`);
    }

    setConfirmDialog({ isOpen: false, type: "delete", item: null });
  };

  // Filtered List
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.weekLabel.toLowerCase().includes(q) ||
        r.recordNo.toLowerCase().includes(q) ||
        r.effectiveDate.toLowerCase().includes(q) ||
        r.entries.some(
          (e) => e.count.toLowerCase().includes(q) || e.composition.toLowerCase().includes(q),
        );
      const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [records, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* ══════════════════════════════════════════════════════════════════
          VIEW 1: REGISTER LIST (WITH EXPANDABLE PREVIEW)
         ══════════════════════════════════════════════════════════════════ */}
      {viewMode === "list" && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <TrendingUp className="size-6" />
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  Weekly Yarn Rate Register
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-bold">
                    {records.length} weeks
                  </span>
                </h1>
                <p className="text-xs text-slate-500">
                  Track weekly Grade A & Grade B benchmark yarn rates, composition blends, and
                  certification upcharges.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer self-start md:self-auto"
            >
              <Plus className="size-4" />
              <span>Create Yarn Rate (Full Form)</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search week, record no, count, composition..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500">Status:</span>
              {(["ALL", "Active", "Inactive"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === s
                      ? "bg-teal-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 w-10"></th>
                    <th className="py-3.5 px-4">Record No</th>
                    <th className="py-3.5 px-4">Week / Effective Date</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <TrendingUp className="size-8 mx-auto mb-2 opacity-40" />
                        <p className="font-bold">No Yarn Rate records found</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((item) => {
                      const gradeAEntries = (item.entries || []).filter((e) => e.grade === "A");
                      const gradeBEntries = (item.entries || []).filter((e) => e.grade === "B");
                      const isExpanded = expandedRowId === item.id;

                      return (
                        <React.Fragment key={item.id}>
                          <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => setExpandedRowId(isExpanded ? null : item.id)}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                title="Toggle Quick Rates Preview"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="size-4 text-teal-600" />
                                ) : (
                                  <ChevronDown className="size-4" />
                                )}
                              </button>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                              {item.recordNo}
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-900 dark:text-white">
                                {item.weekLabel}
                              </p>
                              <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Calendar className="size-3" /> {item.effectiveDate}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => promptStatusChange(item)}
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                                  item.status === "Active"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                    : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                                }`}
                              >
                                {item.status === "Active" ? (
                                  <>
                                    <CheckCircle2 className="size-3 text-emerald-600" /> Active
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="size-3 text-rose-600" /> Inactive
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenView(item)}
                                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                                  title="View Grade A & B Breakdown"
                                >
                                  <Eye className="size-3.5 text-indigo-500" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(item)}
                                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 className="size-3.5 text-amber-500" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => promptDelete(item)}
                                  className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-600 dark:text-slate-400 hover:text-rose-600 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="size-3.5 text-rose-500" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Quick Expanded Details Row without opening full form */}
                          {isExpanded && (
                            <tr className="bg-slate-50/90 dark:bg-slate-800/60 border-y border-slate-200/80 dark:border-slate-700">
                              <td colSpan={5} className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                                      <Sparkles className="size-3.5 text-teal-600" />
                                      Quick Rate Breakdown for {item.weekLabel}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenView(item)}
                                      className="text-teal-700 dark:text-teal-400 hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                                    >
                                      Open Grade-wise View →
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Grade A Box */}
                                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                      <span className="text-[10px] uppercase font-black text-indigo-700 dark:text-indigo-400 block mb-2">
                                        Grade A Rates ({gradeAEntries.length} items)
                                      </span>
                                      <div className="space-y-1">
                                        {gradeAEntries.map((e) => (
                                          <div
                                            key={e.id}
                                            className="flex items-center justify-between text-[11px] py-1 border-b border-slate-100 dark:border-slate-800 last:border-0"
                                          >
                                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                                              {e.count} — {e.composition}
                                            </span>
                                            <span className="font-mono font-bold text-teal-700 dark:text-teal-400">
                                              ${e.rate.toFixed(2)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Grade B Box */}
                                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                      <span className="text-[10px] uppercase font-black text-amber-700 dark:text-amber-400 block mb-2">
                                        Grade B Rates ({gradeBEntries.length} items)
                                      </span>
                                      <div className="space-y-1">
                                        {gradeBEntries.map((e) => (
                                          <div
                                            key={e.id}
                                            className="flex items-center justify-between text-[11px] py-1 border-b border-slate-100 dark:border-slate-800 last:border-0"
                                          >
                                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                                              {e.count} — {e.composition}
                                            </span>
                                            <span className="font-mono font-bold text-teal-700 dark:text-teal-400">
                                              ${e.rate.toFixed(2)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredRecords.length)}{" "}
                  to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of{" "}
                  {filteredRecords.length} records
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer hover:bg-slate-50"
                  >
                    <ChevronLeft className="size-3.5" />
                  </button>
                  <span className="font-bold px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer hover:bg-slate-50"
                  >
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VIEW 2: DEDICATED FULL-PAGE FORM (CREATE / EDIT)
         ══════════════════════════════════════════════════════════════════ */}
      {viewMode === "form" && (
        <form onSubmit={handleSaveForm} className="space-y-6">
          {/* Header Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                title="Back to Register"
              >
                <ArrowLeft className="size-4" />
              </button>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  {formMode === "create"
                    ? "New Yarn Rate Entry (Weekly)"
                    : `Edit Yarn Rate — ${selectedRecord?.recordNo}`}
                </h2>
                <p className="text-xs text-slate-500">
                  Dedicated full-page entry for weekly yarn price benchmarks and certification
                  upcharges.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                <Save className="size-3.5" />
                <span>{formMode === "create" ? "Save Weekly Rates" : "Update Rates"}</span>
              </button>
            </div>
          </div>

          {/* Copy From Selection Feature at Top of Entry Form */}
          <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 rounded-2xl p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-lg">
                  <Copy className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
                    Copy From Previous Week's Rates
                  </h4>
                  <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80">
                    Instantly populate all Grade A/B rates and certification upcharges from an
                    existing weekly benchmark.
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-80">
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleCopyFrom(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 text-indigo-950 dark:text-indigo-100 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs"
                >
                  <option value="" disabled>
                    -- Select source week to copy from --
                  </option>
                  {records.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.weekLabel} ({r.entries.length} items, {r.upcharges.length} upcharges)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Week & Header Information */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Week & Effective Date Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Effective Rate Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={recordDate}
                    onChange={(e) => {
                      setRecordDate(e.target.value);
                      setWeekLabel(computeWeekLabel(e.target.value));
                    }}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Week Identification / Label
                </label>
                <input
                  type="text"
                  value={weekLabel}
                  onChange={(e) => setWeekLabel(e.target.value)}
                  placeholder="e.g. Week 45, 2026 (Nov 02 - Nov 08)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <div className="flex items-center gap-4 pt-1.5">
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="yr-form-status"
                      checked={formStatus === "Active"}
                      onChange={() => setFormStatus("Active")}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      Active
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="yr-form-status"
                      checked={formStatus === "Inactive"}
                      onChange={() => setFormStatus("Inactive")}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span className="font-semibold text-rose-700 dark:text-rose-400">Inactive</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Main Yarn Rate (Dynamic Rows) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  Main Yarn Rate
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-400">
                    {entries.length} rows
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Enter Grade (A/B), Yarn Count, Composition blend, and benchmark USD rate.
                  Prevent duplicate combinations.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-xl text-xs font-bold hover:bg-teal-100 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="size-3.5" />
                <span>New Row</span>
              </button>
            </div>

            {/* Entries Table */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3 w-28">Grade *</th>
                    <th className="py-2.5 px-3 w-48">Count (Yarn Count Master) *</th>
                    <th className="py-2.5 px-3">Composition *</th>
                    <th className="py-2.5 px-3 w-36 text-right">Rate (USD) *</th>
                    <th className="py-2.5 px-3 w-14 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {entries.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>

                      {/* Grade A / B */}
                      <td className="py-2.5 px-3">
                        <select
                          value={row.grade}
                          onChange={(e) =>
                            handleRowChange(row.id, "grade", e.target.value as "A" | "B")
                          }
                          className={`w-full px-2 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-teal-500 cursor-pointer ${
                            row.grade === "A"
                              ? "text-indigo-700 dark:text-indigo-300"
                              : "text-amber-700 dark:text-amber-300"
                          }`}
                        >
                          <option value="A">Grade A</option>
                          <option value="B">Grade B</option>
                        </select>
                      </td>

                      {/* Count (Searchable Dropdown populated from Yarn Count master) */}
                      <td className="py-2.5 px-3">
                        <SearchableSelect
                          options={yarnCountOptions}
                          value={row.count}
                          onChange={(val) => handleRowChange(row.id, "count", val)}
                          placeholder="Select Count..."
                          className="h-8 text-xs font-mono font-bold"
                          allowCustom
                        />
                      </td>

                      {/* Composition */}
                      <td className="py-2.5 px-3">
                        <SearchableSelect
                          options={compositionOptions}
                          value={row.composition}
                          onChange={(val) => handleRowChange(row.id, "composition", val)}
                          placeholder="Select Composition..."
                          className="h-8 text-xs font-medium"
                          allowCustom
                        />
                      </td>

                      {/* Rate */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="relative">
                          <DollarSign className="size-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={row.rate}
                            onChange={(e) =>
                              handleRowChange(row.id, "rate", parseFloat(e.target.value) || 0)
                            }
                            className="w-full pl-6 pr-2 py-1.5 text-xs font-black font-mono text-right rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                          />
                        </div>
                      </td>

                      {/* Remove Row */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(row.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 cursor-pointer"
                          title="Remove row"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Yarn Type / Certification and Upcharge (Side by Side) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  Yarn Type / Certification and Upcharge
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-400">
                    {upcharges.length} items
                  </span>
                </h3>
              </div>

              <button
                type="button"
                onClick={handleAddUpcharge}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-xl text-xs font-bold hover:bg-teal-100 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="size-3.5" />
                <span>Add Upcharge</span>
              </button>
            </div>

            {/* Upcharge Table */}
            <div className="max-w-2xl border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3">Yarn Type / Certification *</th>
                    <th className="py-2.5 px-3 w-44 text-right">Upcharge (USD) *</th>
                    <th className="py-2.5 px-3 w-14 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {upcharges.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400 text-xs">
                        No certification upcharges added. Click "+ Add Upcharge" to append one.
                      </td>
                    </tr>
                  ) : (
                    upcharges.map((up, idx) => (
                      <tr key={up.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <SearchableSelect
                            options={yarnTypeOptions}
                            value={up.yarnType}
                            onChange={(val) => handleUpchargeTypeChange(up.id, val)}
                            placeholder="Select Certification / Yarn Type..."
                            className="h-8 text-xs font-bold"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="relative">
                            <span className="text-[11px] font-bold text-slate-400 absolute left-2 top-1/2 -translate-y-1/2">
                              +$
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={up.upcharge}
                              onChange={(e) =>
                                handleUpchargeValueChange(up.id, parseFloat(e.target.value) || 0)
                              }
                              className="w-full pl-7 pr-2 py-1.5 text-xs font-black font-mono text-right rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                            />
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveUpcharge(up.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Remove upcharge"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
            >
              Cancel & Back to Register
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              <Save className="size-4" />
              <span>
                {formMode === "create" ? "Save Weekly Yarn Rates" : "Update Weekly Yarn Rates"}
              </span>
            </button>
          </div>
        </form>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VIEW 3: GRADE-WISE VIEW (SIDE BY SIDE: GRADE A | GRADE B)
         ══════════════════════════════════════════════════════════════════ */}
      {viewMode === "view" && selectedRecord && (
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                title="Back to Register"
              >
                <ArrowLeft className="size-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-teal-700 dark:text-teal-400">
                    {selectedRecord.recordNo}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedRecord.status === "Active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {selectedRecord.status}
                  </span>
                </div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Grade-wise Yarn Rate View — {selectedRecord.weekLabel}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(selectedRecord)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                <Edit2 className="size-3.5" />
                <span>Edit Record</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
              >
                Back to Register
              </button>
            </div>
          </div>

          {/* TWO-COLUMN SIDE-BY-SIDE LAYOUT: GRADE A (LEFT) | GRADE B (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN: GRADE A */}
            <div className="bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/60 rounded-2xl shadow-xs overflow-hidden">
              <div className="px-5 py-4 bg-indigo-50/80 dark:bg-indigo-950/60 border-b border-indigo-200 dark:border-indigo-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    A
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-indigo-950 dark:text-indigo-200">
                      Grade A Yarn Rates
                    </h3>
                    <p className="text-[11px] text-indigo-800/80 dark:text-indigo-400">
                      Top-tier export quality spinning rates & specifications
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-200/60 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200 font-mono">
                  {selectedRecord.entries.filter((e) => e.grade === "A").length} entries
                </span>
              </div>

              <div className="p-4 space-y-4">
                {selectedRecord.entries.filter((e) => e.grade === "A").length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No Grade A rate entries saved for this week.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Count</th>
                          <th className="py-2.5 px-3">Composition</th>
                          <th className="py-2.5 px-3 text-right">Rate (USD)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {selectedRecord.entries
                          .filter((e) => e.grade === "A")
                          .map((e) => (
                            <tr key={e.id} className="hover:bg-indigo-50/20">
                              <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                                {e.date}
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                                {e.count}
                              </td>
                              <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-200">
                                {e.composition}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-black text-indigo-700 dark:text-indigo-400">
                                ${e.rate.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Associated Yarn Type & Upcharges for Grade A */}
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                    Applicable Certification Upcharges (USD)
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedRecord.upcharges.map((up) => (
                      <div
                        key={up.id}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {up.yarnType}
                        </span>
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          +${up.upcharge.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: GRADE B */}
            <div className="bg-white dark:bg-slate-900 border-2 border-amber-200 dark:border-amber-900/60 rounded-2xl shadow-xs overflow-hidden">
              <div className="px-5 py-4 bg-amber-50/80 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-7 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    B
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-amber-950 dark:text-amber-200">
                      Grade B Yarn Rates
                    </h3>
                    <p className="text-[11px] text-amber-800/80 dark:text-amber-400">
                      Standard secondary benchmark rates & specifications
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-mono">
                  {selectedRecord.entries.filter((e) => e.grade === "B").length} entries
                </span>
              </div>

              <div className="p-4 space-y-4">
                {selectedRecord.entries.filter((e) => e.grade === "B").length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No Grade B rate entries saved for this week.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Count</th>
                          <th className="py-2.5 px-3">Composition</th>
                          <th className="py-2.5 px-3 text-right">Rate (USD)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {selectedRecord.entries
                          .filter((e) => e.grade === "B")
                          .map((e) => (
                            <tr key={e.id} className="hover:bg-amber-50/20">
                              <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                                {e.date}
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                                {e.count}
                              </td>
                              <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-200">
                                {e.composition}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-black text-amber-700 dark:text-amber-400">
                                ${e.rate.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Associated Yarn Type & Upcharges for Grade B */}
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                    Applicable Certification Upcharges (USD)
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedRecord.upcharges.map((up) => (
                      <div
                        key={up.id}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {up.yarnType}
                        </span>
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          +${up.upcharge.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && confirmDialog.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  confirmDialog.type === "delete"
                    ? "bg-rose-50 text-rose-600 dark:bg-rose-950/60"
                    : "bg-amber-50 text-amber-600 dark:bg-amber-950/60"
                }`}
              >
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {confirmDialog.type === "delete"
                    ? "Delete Yarn Rate Record?"
                    : `Change Status to ${confirmDialog.targetStatus}?`}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {confirmDialog.type === "delete"
                    ? `Are you sure you want to permanently delete Yarn Rate submission for "${confirmDialog.item.weekLabel}" (${confirmDialog.item.recordNo})?`
                    : `Are you sure you want to change status to ${confirmDialog.targetStatus}?`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog({ isOpen: false, type: "delete", item: null })}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-xs cursor-pointer ${
                  confirmDialog.type === "delete"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {confirmDialog.type === "delete" ? "Delete Record" : "Confirm Status Change"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YarnRateManager;
