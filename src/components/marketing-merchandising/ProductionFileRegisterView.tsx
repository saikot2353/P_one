import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Clock,
  Download,
  FileCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  RefreshCw,
  GitBranch,
  Paperclip,
} from "lucide-react";
import {
  MMRepository,
  MMProductionFileRecord,
  ProductionFileStatus,
} from "../../lib/marketing-merchandising-data";
import {
  ProductionFileDetailModal,
  ProductionFileAttachmentsModal,
  ProductionFileVersionHistoryModal,
} from "./ProductionFileModals";

export function ProductionFileRegisterView() {
  const navigate = useNavigate();

  // Records loaded from unified repository
  const [records, setRecords] = useState<MMProductionFileRecord[]>([]);

  // Search & 7 Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJobNo, setFilterJobNo] = useState("");
  const [filterPreCostNo, setFilterPreCostNo] = useState("");
  const [filterStyle, setFilterStyle] = useState("");
  const [filterPo, setFilterPo] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | ProductionFileStatus>("ALL");
  const [filterCreatedFrom, setFilterCreatedFrom] = useState("");
  const [filterCreatedTo, setFilterCreatedTo] = useState("");
  const [filterSubmittedFrom, setFilterSubmittedFrom] = useState("");
  const [filterSubmittedTo, setFilterSubmittedTo] = useState("");

  // Modals state
  const [selectedRecord, setSelectedRecord] = useState<MMProductionFileRecord | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [attachmentsModalOpen, setAttachmentsModalOpen] = useState(false);
  const [versionHistoryModalOpen, setVersionHistoryModalOpen] = useState(false);

  // Amendment prompt dialog
  const [amendTargetRecord, setAmendTargetRecord] = useState<MMProductionFileRecord | null>(null);
  const [amendmentReasonInput, setAmendmentReasonInput] = useState("");
  const [amendModalOpen, setAmendModalOpen] = useState(false);
  const [amendError, setAmendError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Load records
  const loadRecords = () => {
    const list = MMRepository.getProductionFiles();
    setRecords(list);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // Filter option lists derived from data
  const uniqueJobNos = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.jobNo).filter(Boolean)));
  }, [records]);

  const uniquePreCostNos = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.preCostNo).filter((x): x is string => Boolean(x))));
  }, [records]);

  const uniqueStyles = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.styleNo).filter(Boolean)));
  }, [records]);

  // KPI Calculations
  const stats = useMemo(() => {
    const total = records.length;
    const pending = records.filter((r) => r.status === "Submitted").length;
    const approved = records.filter((r) => r.status === "Approved").length;
    const rejected = records.filter((r) => r.status === "Rejected").length;
    const drafts = records.filter((r) => r.status === "Draft").length;
    return { total, pending, approved, rejected, drafts };
  }, [records]);

  // Multi-Filter Matching Logic
  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      // Global search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesGlobal =
          item.fileRefNo.toLowerCase().includes(q) ||
          item.jobNo.toLowerCase().includes(q) ||
          (item.preCostNo && item.preCostNo.toLowerCase().includes(q)) ||
          item.styleNo.toLowerCase().includes(q) ||
          (item.buyerName && item.buyerName.toLowerCase().includes(q)) ||
          (item.submittedBy && item.submittedBy.toLowerCase().includes(q)) ||
          item.poItems.some((p) => p.po.toLowerCase().includes(q));
        if (!matchesGlobal) return false;
      }

      // Filter 1: Job No (Searchable)
      if (filterJobNo.trim()) {
        if (!item.jobNo.toLowerCase().includes(filterJobNo.trim().toLowerCase())) return false;
      }

      // Filter 2: Pre Costing No (Searchable)
      if (filterPreCostNo.trim()) {
        if (!item.preCostNo || !item.preCostNo.toLowerCase().includes(filterPreCostNo.trim().toLowerCase())) {
          return false;
        }
      }

      // Filter 3: Style (Searchable selection)
      if (filterStyle.trim() && filterStyle !== "ALL") {
        if (!item.styleNo.toLowerCase().includes(filterStyle.trim().toLowerCase())) return false;
      }

      // Filter 4: PO Number
      if (filterPo.trim()) {
        const poQ = filterPo.toLowerCase();
        const hasPo = item.poItems.some((p) => p.po.toLowerCase().includes(poQ));
        if (!hasPo) return false;
      }

      // Filter 5: Status
      if (filterStatus !== "ALL" && item.status !== filterStatus) return false;

      // Filter 6: Created Date Range
      if (filterCreatedFrom && item.createdDate < filterCreatedFrom) return false;
      if (filterCreatedTo && item.createdDate.slice(0, 10) > filterCreatedTo) return false;

      // Filter 7: Submitted Date Range
      if (filterSubmittedFrom) {
        if (!item.submittedDate || item.submittedDate < filterSubmittedFrom) return false;
      }
      if (filterSubmittedTo) {
        if (!item.submittedDate || item.submittedDate.slice(0, 10) > filterSubmittedTo) return false;
      }

      return true;
    });
  }, [
    records,
    searchTerm,
    filterJobNo,
    filterPreCostNo,
    filterStyle,
    filterPo,
    filterStatus,
    filterCreatedFrom,
    filterCreatedTo,
    filterSubmittedFrom,
    filterSubmittedTo,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilterJobNo("");
    setFilterPreCostNo("");
    setFilterStyle("");
    setFilterPo("");
    setFilterStatus("ALL");
    setFilterCreatedFrom("");
    setFilterCreatedTo("");
    setFilterSubmittedFrom("");
    setFilterSubmittedTo("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm ||
    filterJobNo ||
    filterPreCostNo ||
    (filterStyle && filterStyle !== "ALL") ||
    filterPo ||
    filterStatus !== "ALL" ||
    filterCreatedFrom ||
    filterCreatedTo ||
    filterSubmittedFrom ||
    filterSubmittedTo;

  // Status badge styling
  const renderStatusBadge = (item: MMProductionFileRecord) => {
    switch (item.status) {
      case "Approved":
        return (
          <div className="flex flex-col items-center">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-3 h-3" /> Approved
            </span>
            {item.version && item.version > 1 && (
              <span className="text-[10px] text-teal-600 font-bold mt-0.5">
                v{item.version} ({item.versionType})
              </span>
            )}
          </div>
        );
      case "Submitted":
        return (
          <div className="flex flex-col items-center">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              <Clock className="w-3 h-3" /> Submitted (Pending)
            </span>
            {item.version && item.version > 1 && (
              <span className="text-[10px] text-amber-700 font-bold mt-0.5">
                Amendment v{item.version}
              </span>
            )}
          </div>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case "Draft":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <FileText className="w-3 h-3" /> Draft
          </span>
        );
    }
  };

  // Launch Amendment Workflow
  const handleStartAmendment = (record: MMProductionFileRecord) => {
    setAmendTargetRecord(record);
    setAmendmentReasonInput("");
    setAmendError("");
    setAmendModalOpen(true);
  };

  const handleConfirmStartAmendment = () => {
    if (!amendTargetRecord) return;
    if (!amendmentReasonInput.trim()) {
      setAmendError("Please provide an amendment reason.");
      return;
    }

    const currentUser = "Tanvir Ahmed (Merchandiser)";
    const newAmdRecord = MMRepository.createAmendment(
      amendTargetRecord.id,
      amendmentReasonInput.trim(),
      currentUser
    );

    setAmendModalOpen(false);

    if (newAmdRecord) {
      loadRecords();
      navigate({ to: `/mm-production-file?id=${newAmdRecord.id}&mode=amend` });
    } else {
      alert("A pending amendment already exists for this production file.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header - NO FOLDER ICON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Marketing & Merchandising</span>
            <span>/</span>
            <span>Production File Management</span>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">Production File Register</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Production File Register
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {filteredRecords.length} record(s)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadRecords}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Refresh Records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate({ to: "/mm-production-file" })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Production File
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          onClick={() => setFilterStatus("ALL")}
          className={`p-3.5 rounded-xl border cursor-pointer transition ${
            filterStatus === "ALL"
              ? "bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800 shadow-sm"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
          }`}
        >
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Total Files</span>
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 block">
            {stats.total}
          </span>
        </div>

        <div
          onClick={() => setFilterStatus("Submitted")}
          className={`p-3.5 rounded-xl border cursor-pointer transition ${
            filterStatus === "Submitted"
              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 shadow-sm"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
          }`}
        >
          <span className="text-xs text-amber-600 dark:text-amber-400 block font-medium">
            Pending Approval
          </span>
          <span className="text-xl font-bold text-amber-700 dark:text-amber-400 mt-1 block">
            {stats.pending}
          </span>
        </div>

        <div
          onClick={() => setFilterStatus("Approved")}
          className={`p-3.5 rounded-xl border cursor-pointer transition ${
            filterStatus === "Approved"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 shadow-sm"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
          }`}
        >
          <span className="text-xs text-emerald-600 dark:text-emerald-400 block font-medium">Approved</span>
          <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-1 block">
            {stats.approved}
          </span>
        </div>

        <div
          onClick={() => setFilterStatus("Rejected")}
          className={`p-3.5 rounded-xl border cursor-pointer transition ${
            filterStatus === "Rejected"
              ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 shadow-sm"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
          }`}
        >
          <span className="text-xs text-rose-600 dark:text-rose-400 block font-medium">Rejected</span>
          <span className="text-xl font-bold text-rose-700 dark:text-rose-400 mt-1 block">
            {stats.rejected}
          </span>
        </div>

        <div
          onClick={() => setFilterStatus("Draft")}
          className={`p-3.5 rounded-xl border cursor-pointer transition ${
            filterStatus === "Draft"
              ? "bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-600 shadow-sm"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
          }`}
        >
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Drafts</span>
          <span className="text-xl font-bold text-slate-700 dark:text-slate-300 mt-1 block">
            {stats.drafts}
          </span>
        </div>
      </div>

      {/* Global Search and 7 Filters Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        {/* Row 1: Global Search & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Job No, Pre Costing No, Style, PO, Submitter..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Row 2: 7 Filters with Searchable Job No & Pre Costing No */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1 text-xs">
          {/* Filter 1: Job No. (Searchable selection with datalist) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Job No.
            </label>
            <input
              list="job-no-options"
              type="text"
              placeholder="Search / Select Job..."
              value={filterJobNo}
              onChange={(e) => {
                setFilterJobNo(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
            />
            <datalist id="job-no-options">
              {uniqueJobNos.map((j) => (
                <option key={j} value={j} />
              ))}
            </datalist>
          </div>

          {/* Filter 2: Pre Costing No. (Searchable selection with datalist) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Pre Costing No.
            </label>
            <input
              list="pc-no-options"
              type="text"
              placeholder="Search / Select PC..."
              value={filterPreCostNo}
              onChange={(e) => {
                setFilterPreCostNo(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
            />
            <datalist id="pc-no-options">
              {uniquePreCostNos.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>

          {/* Filter 3: Style (Searchable selection with datalist & clear) */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Style
              </label>
              {filterStyle && filterStyle !== "ALL" && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterStyle("");
                    setCurrentPage(1);
                  }}
                  className="text-[10px] text-rose-500 hover:text-rose-700 flex items-center gap-0.5"
                  title="Clear Style filter"
                >
                  <X className="w-2.5 h-2.5" /> Clear
                </button>
              )}
            </div>
            <div className="relative">
              <input
                list="style-options"
                type="text"
                placeholder="Search / Select Style..."
                value={filterStyle === "ALL" ? "" : filterStyle}
                onChange={(e) => {
                  setFilterStyle(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2 py-1.5 pr-6 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
              />
              {filterStyle && filterStyle !== "ALL" && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterStyle("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-1.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <datalist id="style-options">
              {uniqueStyles.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          {/* Filter 4: PO Number */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              PO Number
            </label>
            <input
              type="text"
              placeholder="e.g. PO-HM-99"
              value={filterPo}
              onChange={(e) => {
                setFilterPo(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
            />
          </div>

          {/* Filter 5: Status */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted (Pending)</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Filter 6: Created Date From */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Created From
            </label>
            <input
              type="date"
              value={filterCreatedFrom}
              onChange={(e) => {
                setFilterCreatedFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px]"
            />
          </div>

          {/* Filter 7: Submitted Date To */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Submitted To
            </label>
            <input
              type="date"
              value={filterSubmittedTo}
              onChange={(e) => {
                setFilterSubmittedTo(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* Production File Record Table (Columns "Production File Ref" and "PO Summary" REMOVED per spec) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-3.5 py-3 w-12 text-center">SL</th>
                <th className="px-3.5 py-3">Job No.</th>
                <th className="px-3.5 py-3">Style</th>
                <th className="px-3.5 py-3 text-right">Total PO QTY</th>
                <th className="px-3.5 py-3">Created By & Date</th>
                <th className="px-3.5 py-3">Submitted Date</th>
                <th className="px-3.5 py-3 text-center">Status</th>
                <th className="px-3.5 py-3 text-center w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((item, idx) => {
                  const sl = (currentPage - 1) * pageSize + idx + 1;
                  const isEligibleForAmendment = item.status === "Approved";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-850/60 transition"
                    >
                      <td className="px-3.5 py-3 text-center text-slate-500">{sl}</td>
                      <td className="px-3.5 py-3 font-semibold text-slate-900 dark:text-slate-100">
                        {item.jobNo || "—"}
                        {item.version && item.version > 1 && (
                          <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                            v{item.version}
                          </span>
                        )}
                      </td>
                      <td className="px-3.5 py-3">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                          {item.styleNo}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate max-w-[130px]">
                          {item.buyerName || ""}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                        {item.totalPoQty.toLocaleString()}
                      </td>
                      <td className="px-3.5 py-3">
                        <span className="text-slate-800 dark:text-slate-200 block truncate max-w-[120px]">
                          {item.createdBy}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {item.createdDate}
                        </span>
                      </td>
                      <td className="px-3.5 py-3">
                        {item.submittedDate ? (
                          <div>
                            <span className="text-slate-800 dark:text-slate-200 block truncate max-w-[110px]">
                              {item.submittedBy || "Submitted"}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              {item.submittedDate}
                            </span>
                          </div>
                        ) : (
                          <span className="italic text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-3.5 py-3 text-center">{renderStatusBadge(item)}</td>
                      <td className="px-3.5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* View Details */}
                          <button
                            onClick={() => {
                              setSelectedRecord(item);
                              setDetailModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Amend Action (Only eligible for Approved records) */}
                          {isEligibleForAmendment && (
                            <button
                              onClick={() => handleStartAmendment(item)}
                              className="p-1.5 rounded-lg text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition"
                              title="Create Production File Amendment"
                            >
                              <GitBranch className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Edit Draft or Rejected Record */}
                          {item.status === "Draft" && (
                            <button
                              onClick={() => navigate({ to: `/mm-production-file?id=${item.id}&mode=edit` })}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition"
                              title="Edit Draft"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {item.status === "Rejected" && (
                            <button
                              onClick={() => navigate({ to: `/mm-production-file?id=${item.id}&mode=edit` })}
                              className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                              title="Edit Rejected Record & Resubmit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* View Attachments (PI Entry component style) */}
                          <button
                            onClick={() => {
                              setSelectedRecord(item);
                              setAttachmentsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="View / Download Attachments"
                          >
                            <Paperclip className="w-3.5 h-3.5 text-teal-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                    <p className="text-xs font-medium">No production file records match the current filters.</p>
                    {hasActiveFilters && (
                      <button
                        onClick={resetFilters}
                        className="mt-2 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        Clear search & filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 dark:text-slate-400">
            Showing {(currentPage - 1) * pageSize + (filteredRecords.length > 0 ? 1 : 0)} to{" "}
            {Math.min(currentPage * pageSize, filteredRecords.length)} of {filteredRecords.length} records
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium text-slate-700 dark:text-slate-300">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProductionFileDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        record={selectedRecord}
        onEdit={(rec) => navigate({ to: `/mm-production-file?id=${rec.id}&mode=edit` })}
        onAmend={handleStartAmendment}
      />

      <ProductionFileAttachmentsModal
        isOpen={attachmentsModalOpen}
        onClose={() => setAttachmentsModalOpen(false)}
        record={selectedRecord}
      />

      <ProductionFileVersionHistoryModal
        isOpen={versionHistoryModalOpen}
        onClose={() => setVersionHistoryModalOpen(false)}
        record={selectedRecord}
      />

      {/* Amendment Initialization Dialog */}
      {amendModalOpen && amendTargetRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-teal-600 dark:text-teal-400">
              <GitBranch className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Create Production File Amendment
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Job: {amendTargetRecord.jobNo} | Style: {amendTargetRecord.styleNo}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This will create <strong>Version {(amendTargetRecord.version || 1) + 1}</strong> as an amendment.
              Original Job, Style, and PO details are preserved and locked. You can upload replacement or additional
              document attachments.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reason for Amendment <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={amendmentReasonInput}
                onChange={(e) => {
                  setAmendmentReasonInput(e.target.value);
                  setAmendError("");
                }}
                placeholder="e.g. Revised CAD marker width from cutting floor, updated trim layout card..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              {amendError && <p className="text-[11px] text-rose-600 mt-1">{amendError}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAmendModalOpen(false)}
                className="px-4 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStartAmendment}
                className="px-4 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition"
              >
                Start Amendment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
