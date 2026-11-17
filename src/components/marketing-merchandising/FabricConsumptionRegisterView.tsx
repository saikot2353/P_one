import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Calculator,
  Plus,
  Search,
  RotateCcw,
  Eye,
  Scissors,
  CheckCircle2,
  Clock,
  AlertCircle,
  Layers,
  Printer,
  Trash2,
  Users,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";
import {
  MMFabricConsumptionCadRecord,
  MMRepository,
  MM_BUYERS_MASTER,
  MM_MERCHANTS_MASTER,
} from "../../lib/marketing-merchandising-data";
import { SearchableSelect } from "../ui/searchable-select";

export interface FabricConsumptionRegisterViewProps {
  registerRole?: "merchant" | "cad";
  onCreateRequest?: () => void;
  onOpenRequest?: (id: string, mode?: "view" | "cad-response" | "edit") => void;
}

export function FabricConsumptionRegisterView({
  registerRole = "merchant",
  onCreateRequest,
  onOpenRequest,
}: FabricConsumptionRegisterViewProps) {
  const [records, setRecords] = useState<MMFabricConsumptionCadRecord[]>([]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBuyer, setFilterBuyer] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState<string>(
    registerRole === "cad" ? "Pending CAD" : "ALL"
  );
  const [filterResponseStatus, setFilterResponseStatus] = useState<string>("ALL");
  const [filterMerchandiser, setFilterMerchandiser] = useState("ALL");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterCadDateFrom, setFilterCadDateFrom] = useState("");
  const [filterCadDateTo, setFilterCadDateTo] = useState("");

  // Load records from repository
  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    const list = MMRepository.getFabricConsumptionCadList();
    setRecords(list);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterBuyer("ALL");
    setFilterStatus(registerRole === "cad" ? "Pending CAD" : "ALL");
    setFilterResponseStatus("ALL");
    setFilterMerchandiser("ALL");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterCadDateFrom("");
    setFilterCadDateTo("");
  };

  // Buyer searchable select options
  const buyerFilterOptions = useMemo(() => {
    return [
      { value: "ALL", label: "All Buyers" },
      ...MM_BUYERS_MASTER.map((b) => ({
        value: b.name,
        label: `${b.name} (${b.country})`,
      })),
    ];
  }, []);

  // Merchandiser searchable select options
  const merchandiserFilterOptions = useMemo(() => {
    return [
      { value: "ALL", label: "All Merchandisers" },
      ...MM_MERCHANTS_MASTER.map((m) => ({
        value: m.name,
        label: `${m.name} — ${m.designation}`,
      })),
    ];
  }, []);

  // Scope records according to Register Role
  // CAD Register rule: MUST show ONLY requests that have actually been submitted to CAD.
  // Merchant Draft records (status === "Draft") MUST NOT appear in the CAD register.
  const scopedRecords = useMemo(() => {
    if (registerRole === "cad") {
      return records.filter((rec) => rec.status !== "Draft");
    }
    return records;
  }, [records, registerRole]);

  // KPI Metrics
  const metrics = useMemo(() => {
    const total = scopedRecords.length;
    const received = scopedRecords.filter((r) => r.cadResponseStatus === "Received").length;
    const pendingCad = scopedRecords.filter((r) => r.status === "Pending CAD").length;
    const inProgress = scopedRecords.filter(
      (r) => r.cadResponseStatus === "In Progress" || r.status === "In Progress"
    ).length;
    const drafts = scopedRecords.filter((r) => r.status === "Draft").length;
    return { total, received, pendingCad, inProgress, drafts };
  }, [scopedRecords]);

  // Filtered List
  const filteredRecords = useMemo(() => {
    return scopedRecords.filter((rec) => {
      // Search query: Request No, Style, Buyer
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          rec.requestNo.toLowerCase().includes(q) ||
          rec.styleOrder.toLowerCase().includes(q) ||
          rec.buyer.toLowerCase().includes(q) ||
          rec.merchandiser.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Buyer
      if (filterBuyer !== "ALL" && rec.buyer !== filterBuyer) return false;

      // Request Status
      if (filterStatus !== "ALL" && rec.status !== filterStatus) return false;

      // CAD Response Status (for CAD register)
      if (
        registerRole === "cad" &&
        filterResponseStatus !== "ALL" &&
        rec.cadResponseStatus !== filterResponseStatus
      ) {
        return false;
      }

      // Merchandiser
      if (filterMerchandiser !== "ALL" && rec.merchandiser !== filterMerchandiser) return false;

      // Request Date range
      if (filterDateFrom && rec.requestDate < filterDateFrom) return false;
      if (filterDateTo && rec.requestDate > filterDateTo) return false;

      // CAD Response Date range
      if (filterCadDateFrom && (!rec.cadResponseDate || rec.cadResponseDate < filterCadDateFrom))
        return false;
      if (
        filterCadDateTo &&
        (!rec.cadResponseDate || rec.cadResponseDate.substring(0, 10) > filterCadDateTo)
      )
        return false;

      return true;
    });
  }, [
    scopedRecords,
    searchQuery,
    filterBuyer,
    filterStatus,
    filterResponseStatus,
    filterMerchandiser,
    filterDateFrom,
    filterDateTo,
    filterCadDateFrom,
    filterCadDateTo,
    registerRole,
  ]);

  const handleDeleteDraft = (id: string) => {
    if (confirm("Are you sure you want to delete this draft request?")) {
      MMRepository.deleteFabricConsumptionCadRecord(id);
      loadRecords();
      toast.success("Draft request deleted.");
    }
  };

  const isCadView = registerRole === "cad";

  return (
    <div className="space-y-6">
      {/* ── Top Header and Register Title ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            {isCadView ? (
              <>
                <Calculator className="size-5 text-indigo-600" />
                <span>Fabric Consumption Register (CAD)</span>
              </>
            ) : (
              <>
                <Scissors className="size-5 text-teal-600" />
                <span>Fabric Consumption Register (Mer)</span>
              </>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {!isCadView && (
            <button
              type="button"
              onClick={onCreateRequest}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Plus className="size-3.5" />
              <span>New Fabric Consumption Request</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="size-3.5" /> Print Register
          </button>
        </div>
      </div>

      {/* ── KPI Stat Cards ────────────────────────────────────────── */}
      <div
        className={`grid gap-3.5 ${
          isCadView
            ? "grid-cols-2 sm:grid-cols-4"
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        }`}
      >
        {/* Total */}
        <div
          onClick={() => {
            setFilterStatus("ALL");
            setFilterResponseStatus("ALL");
          }}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>{isCadView ? "Total in CAD Queue" : "Total Requests"}</span>
            <Layers className="size-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {metrics.total}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {isCadView ? "Submitted requests only" : "All registered CAD requests"}
          </p>
        </div>

        {/* Pending CAD */}
        <div
          onClick={() => {
            setFilterStatus("Pending CAD");
            setFilterResponseStatus("ALL");
          }}
          className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 shadow-xs hover:border-blue-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-400 text-xs font-bold">
            <span>Pending CAD</span>
            <Clock className="size-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700 dark:text-blue-400 mt-1">
            {metrics.pendingCad}
          </div>
          <p className="text-[10px] text-blue-600/80 mt-0.5">Awaiting CAD estimation</p>
        </div>

        {/* In Progress */}
        <div
          onClick={() => {
            setFilterStatus("In Progress");
            setFilterResponseStatus("ALL");
          }}
          className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 shadow-xs hover:border-amber-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 text-xs font-bold">
            <span>CAD In Progress</span>
            <Scissors className="size-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">
            {metrics.inProgress}
          </div>
          <p className="text-[10px] text-amber-600/80 mt-0.5">Calculations underway</p>
        </div>

        {/* Received */}
        <div
          onClick={() => {
            setFilterResponseStatus("Received");
            setFilterStatus("ALL");
          }}
          className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 shadow-xs hover:border-emerald-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            <span>{isCadView ? "CAD Completed" : "Consumption Received"}</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
            {metrics.received}
          </div>
          <p className="text-[10px] text-emerald-600/80 mt-0.5">Response submitted to Merchant</p>
        </div>

        {/* Merchant Drafts (Visible ONLY in Merchant Register) */}
        {!isCadView && (
          <div
            onClick={() => {
              setFilterStatus("Draft");
              setFilterResponseStatus("ALL");
            }}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-bold">
              <span>Merchant Drafts</span>
              <FileText className="size-4 text-slate-400" />
            </div>
            <div className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-1">
              {metrics.drafts}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Unsubmitted requests</p>
          </div>
        )}
      </div>

      {/* ── Search & Filter Controls ───────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          {/* Search bar: Label changed to "Search Request / Style / Buyer" */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Search Request / Style / Buyer
            </label>
            <div className="relative">
              <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Request No., Style, Buyer, Merchandiser..."
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Buyer Filter — Searchable dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Buyer
            </label>
            <SearchableSelect
              options={buyerFilterOptions}
              value={filterBuyer}
              onChange={(val) => setFilterBuyer(val)}
              placeholder="Search Buyer..."
            />
          </div>

          {/* Request Status Filter — Closed option REMOVED */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Request Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">All Request Statuses</option>
              {!isCadView && <option value="Draft">Draft</option>}
              <option value="Pending CAD">Pending CAD</option>
              <option value="In Progress">In Progress</option>
              <option value="CAD Submitted">CAD Submitted</option>
            </select>
          </div>

          {/* Merchandiser Filter — Searchable dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Merchandiser
            </label>
            <SearchableSelect
              options={merchandiserFilterOptions}
              value={filterMerchandiser}
              onChange={(val) => setFilterMerchandiser(val)}
              placeholder="Search Merchandiser..."
            />
          </div>

          {/* CAD Response Status Filter (Only in CAD register) or Request Date */}
          {isCadView ? (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                CAD Response Status
              </label>
              <select
                value={filterResponseStatus}
                onChange={(e) => setFilterResponseStatus(e.target.value)}
                className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-indigo-700 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Response Statuses</option>
                <option value="Received">Consumption Received</option>
                <option value="In Progress">In Progress (CAD Draft)</option>
                <option value="Not Received">Not Received</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Req Date From
              </label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full h-9 px-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold"
              />
            </div>
          )}

          {/* Request Date From (for CAD register) */}
          {isCadView && (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Req Date From
              </label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full h-9 px-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold"
              />
            </div>
          )}

          {/* Request Date To */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Req Date To
            </label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full h-9 px-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold"
            />
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="size-3.5" /> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* ── CENTRAL REGISTER TABLE ─────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">
                <th className="py-3 px-3 text-center w-12">SL</th>
                <th className="py-3 px-3">Request No.</th>
                <th className="py-3 px-3">Request Date</th>
                <th className="py-3 px-3">Buyer</th>
                {/* Style */}
                <th className="py-3 px-3">Style</th>
                <th className="py-3 px-3">Merchandiser</th>
                <th className="py-3 px-3">Submitted Date</th>
                <th className="py-3 px-3">CAD Resp Date</th>
                <th className="py-3 px-3">Request Status</th>

                <th className="py-3 px-3 text-right sticky right-0 bg-slate-100 dark:bg-slate-800 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 whitespace-nowrap">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-12 text-center text-slate-400"
                  >
                    {isCadView ? (
                      <Calculator className="size-8 mx-auto text-slate-300 mb-2" />
                    ) : (
                      <Scissors className="size-8 mx-auto text-slate-300 mb-2" />
                    )}
                    <p className="font-semibold text-slate-600 dark:text-slate-400">
                      {isCadView
                        ? "No submitted requests found in the CAD queue."
                        : "No Fabric Consumption records found."}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isCadView
                        ? "Requests will appear here as soon as a Merchandiser submits them to CAD."
                        : "Adjust your search filters or click 'New Fabric Consumption Request' to create one."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, idx) => {
                  const isReceived = rec.cadResponseStatus === "Received";
                  const isInProgress =
                    rec.cadResponseStatus === "In Progress" || rec.status === "In Progress";
                  const isPendingCad = rec.status === "Pending CAD";

                  return (
                    <tr
                      key={rec.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* SL */}
                      <td className="py-3 px-3 text-center text-slate-400 font-mono font-semibold">
                        {idx + 1}
                      </td>

                      {/* Request No. */}
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => onOpenRequest?.(rec.id, "view")}
                          className="font-mono font-bold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{rec.requestNo}</span>
                          {rec.attachments && rec.attachments.length > 0 && (
                            <span
                              className="inline-flex items-center text-[10px] text-slate-400 font-sans"
                              title={`${rec.attachments.length} document(s) attached`}
                            >
                              <Paperclip className="size-3 text-teal-600" />
                              <span>({rec.attachments.length})</span>
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Request Date */}
                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                        {rec.requestDate}
                      </td>

                      {/* Buyer */}
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {rec.buyer}
                      </td>

                      {/* Style */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {rec.styleOrder}
                        </span>
                      </td>

                      {/* Merchandiser */}
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {rec.merchandiser}
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                        {rec.submittedDate || "Not Submitted"}
                      </td>

                      {/* CAD Response Date */}
                      <td className="py-3 px-3 font-mono text-[11px]">
                        {rec.cadResponseDate ? (
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                            {rec.cadResponseDate}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Pending</span>
                        )}
                      </td>

                      {/* Request Status */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            rec.status === "CAD Submitted"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                              : rec.status === "Pending CAD"
                              ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800"
                              : rec.status === "In Progress"
                              ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                              : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                          }`}
                        >
                          {rec.status === "CAD Submitted" && <CheckCircle2 className="size-3" />}
                          {rec.status === "Pending CAD" && <Clock className="size-3" />}
                          {rec.status === "In Progress" && <Clock className="size-3" />}
                          {rec.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right sticky right-0 bg-slate-50/90 dark:bg-slate-900/90 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            type="button"
                            onClick={() => onOpenRequest?.(rec.id, "view")}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition-colors"
                            title="View Fabric Consumption Details"
                          >
                            <Eye className="size-3.5" />
                          </button>

                          {/* Merchant Draft actions (Only in Merchant register for Draft records) */}
                          {!isCadView && rec.status === "Draft" && (
                            <>
                              <button
                                type="button"
                                onClick={() => onOpenRequest?.(rec.id, "edit")}
                                className="px-2 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-[11px] font-bold border border-teal-200 cursor-pointer"
                                title="Edit Draft Request"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDraft(rec.id)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                                title="Delete Draft"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </>
                          )}

                          {/* CAD Team actions (Shown ONLY in CAD register for pending/in-progress items) */}
                          {isCadView && (rec.status === "Pending CAD" || rec.status === "In Progress") && (
                            <button
                              type="button"
                              onClick={() => onOpenRequest?.(rec.id, "cad-response")}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-[11px] font-bold border border-indigo-300 dark:border-indigo-800 cursor-pointer flex items-center gap-1 shadow-xs"
                              title="Enter / Calculate CAD Fabric Consumption"
                            >
                              <Scissors className="size-3" /> Enter CAD Data
                            </button>
                          )}

                          {/* Received action */}
                          {isReceived && (
                            <button
                              type="button"
                              onClick={() => onOpenRequest?.(rec.id, "view")}
                              className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 cursor-pointer flex items-center gap-1"
                              title="Review Received CAD Consumption"
                            >
                              <CheckCircle2 className="size-3" /> View Received
                            </button>
                          )}
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
    </div>
  );
}

export default FabricConsumptionRegisterView;
