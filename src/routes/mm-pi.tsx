import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMProformaInvoice,
  PIStatus,
} from "../lib/marketing-merchandising-data";
import {
  FileCheck,
  Search,
  Filter,
  Eye,
  Edit,
  Plus,
  ShieldCheck,
  Calendar,
  Building2,
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Tag,
  DollarSign,
  Package,
} from "lucide-react";

interface SearchParams {
  tab?: string;
  status?: string;
  piNo?: string;
}

export const Route = createFileRoute("/mm-pi")({
  head: () => ({
    meta: [
      { title: "PI Register — Marketing & Merchandising | CriptonHRIS" },
      {
        name: "description",
        content: "Proforma Invoice (PI) Register with saved ERP records, multi-booking consolidation, financial totals, and verification statuses.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    tab: (search.tab as string) || undefined,
    status: (search.status as string) || undefined,
    piNo: (search.piNo as string) || undefined,
  }),
  component: MMPIRegisterPage,
});

type StatusFilter = "All" | "Draft" | "Pending" | "Approved" | "Rejected" | "Returned";

export default function MMPIRegisterPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  // If user requested approval tab via old query param (?tab=approval), redirect seamlessly to dedicated approval route
  useEffect(() => {
    if (search.tab === "approval") {
      navigate({ to: "/mm-pi-verification-approval" });
    }
  }, [search.tab, navigate]);

  const [pis, setPis] = useState<MMProformaInvoice[]>([]);
  const [activeTab, setActiveTab] = useState<StatusFilter>(() => {
    if (search.status === "pending") return "Pending";
    if (search.status === "approved") return "Approved";
    if (search.status === "draft") return "Draft";
    return "All";
  });

  // Filter state
  const [searchQuery, setSearchQuery] = useState(search.piNo || "");
  const [piNoFilter, setPiNoFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("All");
  const [jobIdFilter, setJobIdFilter] = useState("");
  const [styleFilter, setStyleFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadData = () => {
    const list = MMRepository.getPIs();
    setPis(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Normalization helper
  const normalizeStatus = (status?: string): StatusFilter => {
    if (!status) return "Draft";
    const s = status.toLowerCase().trim();
    if (s.includes("pending") || s.includes("submit")) return "Pending";
    if (s.includes("approve") || s.includes("pass")) return "Approved";
    if (s.includes("reject")) return "Rejected";
    if (s.includes("return")) return "Returned";
    return "Draft";
  };

  // Distinct suppliers from actual saved PIs
  const suppliers = useMemo(() => {
    const set = new Set<string>();
    pis.forEach((p) => {
      if (p.supplierName) set.add(p.supplierName.trim());
    });
    return Array.from(set).sort();
  }, [pis]);

  // Tab counts
  const tabCounts = useMemo(() => {
    let draft = 0;
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let returned = 0;

    pis.forEach((p) => {
      const norm = normalizeStatus(p.status);
      if (norm === "Draft") draft++;
      else if (norm === "Pending") pending++;
      else if (norm === "Approved") approved++;
      else if (norm === "Rejected") rejected++;
      else if (norm === "Returned") returned++;
    });

    return {
      All: pis.length,
      Draft: draft,
      Pending: pending,
      Approved: approved,
      Rejected: rejected,
      Returned: returned,
    };
  }, [pis]);

  // Extract Job ID summary
  const getJobSummary = (p: MMProformaInvoice): string => {
    const jobs = new Set<string>();
    if (p.allocatedBookings) {
      p.allocatedBookings.forEach((b) => {
        if (b.orderNo) jobs.add(b.orderNo);
      });
    }
    if (p.items) {
      p.items.forEach((it) => {
        if (it.jobId) jobs.add(it.jobId);
      });
    }
    const arr = Array.from(jobs);
    if (arr.length === 0) return "—";
    if (arr.length === 1) return arr[0];
    return `${arr[0]} (+${arr.length - 1})`;
  };

  // Extract Style summary
  const getStyleSummary = (p: MMProformaInvoice): string => {
    const styles = new Set<string>();
    if (p.allocatedBookings) {
      p.allocatedBookings.forEach((b) => {
        if (b.styleNo) styles.add(b.styleNo);
      });
    }
    if (p.items) {
      p.items.forEach((it) => {
        if (it.styleNo) styles.add(it.styleNo);
      });
    }
    const arr = Array.from(styles);
    if (arr.length === 0) return "—";
    if (arr.length === 1) return arr[0];
    return `${arr[0]} (+${arr.length - 1})`;
  };

  // Calculate total quantity across items without duplication
  const getTotalQuantity = (p: MMProformaInvoice): { qty: number; unit: string } => {
    if (!p.items || p.items.length === 0) return { qty: 0, unit: "Pcs" };
    const total = p.items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
    const unit = p.items[0]?.unit || "Pcs";
    return { qty: total, unit };
  };

  // Filtered PIs
  const filteredPis = useMemo(() => {
    return pis.filter((p) => {
      const norm = normalizeStatus(p.status);
      if (activeTab !== "All" && norm !== activeTab) {
        return false;
      }
      if (supplierFilter !== "All" && p.supplierName !== supplierFilter) {
        return false;
      }
      if (piNoFilter.trim() && !p.piNo.toLowerCase().includes(piNoFilter.toLowerCase().trim())) {
        return false;
      }
      const jobStr = getJobSummary(p).toLowerCase();
      if (jobIdFilter.trim() && !jobStr.includes(jobIdFilter.toLowerCase().trim())) {
        return false;
      }
      const styleStr = getStyleSummary(p).toLowerCase();
      if (styleFilter.trim() && !styleStr.includes(styleFilter.toLowerCase().trim())) {
        return false;
      }
      if (fromDate && p.piDate && p.piDate < fromDate) {
        return false;
      }
      if (toDate && p.piDate && p.piDate > toDate) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mPiNo = p.piNo.toLowerCase().includes(q);
        const mSup = p.supplierName?.toLowerCase().includes(q);
        const mJob = jobStr.includes(q);
        const mStyle = styleStr.includes(q);
        const mBookings = p.allocatedBookings?.some((b) => b.bookingNo.toLowerCase().includes(q));
        if (!mPiNo && !mSup && !mJob && !mStyle && !mBookings) {
          return false;
        }
      }
      return true;
    });
  }, [pis, activeTab, supplierFilter, piNoFilter, jobIdFilter, styleFilter, fromDate, toDate, searchQuery]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    piNoFilter.trim() !== "" ||
    supplierFilter !== "All" ||
    jobIdFilter.trim() !== "" ||
    styleFilter.trim() !== "" ||
    fromDate !== "" ||
    toDate !== "" ||
    activeTab !== "All";

  const clearFilters = () => {
    setSearchQuery("");
    setPiNoFilter("");
    setSupplierFilter("All");
    setJobIdFilter("");
    setStyleFilter("");
    setFromDate("");
    setToDate("");
    setActiveTab("All");
  };

  const getStatusBadge = (status: PIStatus | string) => {
    const norm = normalizeStatus(status);
    switch (norm) {
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Pending Approval
          </span>
        );
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved
          </span>
        );

      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected
          </span>
        );
      case "Returned":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
            Returned
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            Draft
          </span>
        );
    }
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-pi"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "PI / Proforma Invoice", to: "/mm-pi" },
        { label: "PI Register" },
      ]}
      title="Proforma Invoice (PI) Register"
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/mm-pi-verification-approval"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>PI Verification Approval</span>
            {tabCounts.Pending > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                {tabCounts.Pending}
              </span>
            )}
          </Link>
          <Link
            to="/mm-proforma-invoice-create"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Proforma Invoice</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Status Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 pt-2 rounded-t-lg shadow-sm">
          <div className="flex items-center gap-1 overflow-x-auto pb-px">
            {(
              [
                { id: "All", label: "All PIs", count: tabCounts.All },
                { id: "Draft", label: "Draft", count: tabCounts.Draft },
                { id: "Pending", label: "Pending Approval", count: tabCounts.Pending },
                { id: "Approved", label: "Approved", count: tabCounts.Approved },
                { id: "Rejected", label: "Rejected", count: tabCounts.Rejected },
                { id: "Returned", label: "Returned", count: tabCounts.Returned },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as StatusFilter)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? "border-indigo-600 text-indigo-600 font-semibold"
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 pb-2">
            Showing <span className="font-semibold text-slate-800">{filteredPis.length}</span> of{" "}
            <span className="font-semibold text-slate-800">{pis.length}</span> records
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {/* Quick Search */}
            <div className="lg:col-span-2 relative">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Search PI / Supplier / Booking
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="PI No, Supplier, Job, Style, Booking..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Filter by PI Number */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                PI Number
              </label>
              <input
                type="text"
                placeholder="e.g. PI-PK-..."
                value={piNoFilter}
                onChange={(e) => setPiNoFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Filter by Supplier */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Supplier
              </label>
              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="All">All Suppliers ({suppliers.length})</option>
                {suppliers.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Job ID */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Job ID
              </label>
              <input
                type="text"
                placeholder="Job ID"
                value={jobIdFilter}
                onChange={(e) => setJobIdFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Filter by From Date */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>

            {/* Filter by To Date */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>
          </div>

          {/* Active Filter Indicators & Reset */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Filter className="w-3.5 h-3.5 text-indigo-600" />
                <span>Filters active:</span>
                {activeTab !== "All" && (
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                    Status: {activeTab}
                  </span>
                )}
                {supplierFilter !== "All" && (
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Supplier: {supplierFilter}
                  </span>
                )}
                {piNoFilter && (
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                    PI: {piNoFilter}
                  </span>
                )}
                {jobIdFilter && (
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                    Job: {jobIdFilter}
                  </span>
                )}
                {fromDate && (
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    From: {fromDate}
                  </span>
                )}
                {toDate && (
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    To: {toDate}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* PI Register Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3.5 whitespace-nowrap">PI Number</th>
                  <th className="py-3 px-3 whitespace-nowrap">PI Date</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">Supplier</th>
                  <th className="py-3 px-3 whitespace-nowrap">Job ID</th>
                  <th className="py-3 px-3 whitespace-nowrap">Style</th>
                  <th className="py-3 px-3.5 text-right whitespace-nowrap">PI Value</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">PI Status</th>
                  <th className="py-3 px-3 whitespace-nowrap">Created By</th>
                  <th className="py-3 px-3 text-center whitespace-nowrap sticky right-0 bg-slate-50 z-10 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPis.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <FileCheck className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-semibold text-slate-800">
                          No Proforma Invoices Found
                        </p>
                        <p className="text-xs text-slate-500 max-w-sm">
                          {hasActiveFilters
                            ? "No proforma invoices match your active search or filter criteria. Try clearing filters or searching for different terms."
                            : "There are currently no proforma invoice records saved in the system. Create a PI from approved bookings to get started."}
                        </p>
                        {hasActiveFilters ? (
                          <button
                            onClick={clearFilters}
                            className="mt-2 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                          >
                            Reset Filters
                          </button>
                        ) : (
                          <Link
                            to="/mm-proforma-invoice-create"
                            className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Create Proforma Invoice
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPis.map((pi) => {
                    const jobSummary = getJobSummary(pi);
                    const styleSummary = getStyleSummary(pi);
                    const totalQty = getTotalQuantity(pi);
                    const isEditable = pi.status === "Draft" || pi.status === "Returned";

                    return (
                      <tr
                        key={pi.id}
                        className="hover:bg-indigo-50/40 transition-colors group"
                      >
                        {/* PI Number Hyperlink -> opens existing PI Entry Form in view mode */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <Link
                            to="/mm-proforma-invoice-create"
                            search={{ piId: pi.id, mode: "view" } as any}
                            className="font-mono font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1.5"
                            title={`View PI in Entry Form: ${pi.piNo}`}
                          >
                            <span>{pi.piNo}</span>
                          </Link>
                          {pi.entryNo && (
                            <span className="block text-[10px] text-slate-400 font-mono">
                              {pi.entryNo}
                            </span>
                          )}
                        </td>

                        {/* PI Date */}
                        <td className="py-3 px-3 whitespace-nowrap text-slate-700 font-medium">
                          {pi.piDate || "—"}
                        </td>

                        {/* Supplier (Display only supplier name, no unit name) */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="font-semibold text-slate-800">
                              {pi.supplierName}
                            </span>
                          </div>
                        </td>

                        {/* Job ID */}
                        <td className="py-3 px-3 whitespace-nowrap text-slate-700 font-mono font-medium">
                          {jobSummary}
                        </td>

                        {/* Style */}
                        <td className="py-3 px-3 whitespace-nowrap text-slate-700 font-medium">
                          {styleSummary}
                        </td>

                        {/* PI Value */}
                        <td className="py-3 px-3.5 text-right whitespace-nowrap font-mono font-bold text-slate-900">
                          {pi.currency === "USD" ? "$" : "৳"}
                          {Number(pi.totalPiValue || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        {/* PI Status */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          {getStatusBadge(pi.status)}
                        </td>

                        {/* Created By */}
                        <td className="py-3 px-3 whitespace-nowrap text-slate-600 text-[11px]">
                          <div>{pi.createdBy || pi.merchant || "—"}</div>
                          {pi.createdDate && (
                            <div className="text-[10px] text-slate-400">{pi.createdDate}</div>
                          )}
                        </td>

                        {/* Action (Sticky) */}
                        <td className="py-3 px-3 text-center whitespace-nowrap sticky right-0 bg-white group-hover:bg-indigo-50/40 z-10 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* View Action opens existing PI Entry Form in view mode */}
                            <Link
                              to="/mm-proforma-invoice-create"
                              search={{ piId: pi.id, mode: "view" } as any}
                              className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-100/60 rounded transition-colors"
                              title="View in PI Entry Form"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            {/* Edit Action if allowed */}
                            {isEditable ? (
                              <Link
                                to="/mm-proforma-invoice-create"
                                search={{ piId: pi.id } as any}
                                className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-100/60 rounded transition-colors"
                                title="Edit Proforma Invoice"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                            ) : (
                              <span
                                className="p-1.5 text-slate-300 cursor-not-allowed"
                                title="Editing locked after approval / verification"
                              >
                                <Edit className="w-4 h-4" />
                              </span>
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

          {/* Footer Summary Bar */}
          {filteredPis.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <span>
                  Total Displayed PIs:{" "}
                  <strong className="text-slate-900">{filteredPis.length}</strong>
                </span>
                <span>•</span>
                <span>
                  Cumulative Value:{" "}
                  <strong className="text-slate-900 font-mono">
                    $
                    {filteredPis
                      .reduce((sum, p) => sum + (Number(p.totalPiValue) || 0), 0)
                      .toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </strong>
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Click any PI Number or View action icon to open full details
              </div>
            </div>
          )}
        </div>
      </div>
    </MarketingMerchandisingLayout>
  );
}
