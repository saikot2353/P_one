import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMProformaInvoice,
  PIStatus,
} from "../lib/marketing-merchandising-data";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Search,
  Filter,
  Eye,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  FileCheck,
  Plus,
} from "lucide-react";

interface SearchParams {
  tab?: string;
  piNo?: string;
  status?: string;
}

export const Route = createFileRoute("/mm-pi-verification-approval")({
  head: () => ({
    meta: [
      { title: "PI Verification Approval — Marketing & Merchandising | CriptonHRIS" },
      {
        name: "description",
        content: "Dedicated approval register for Proforma Invoices submitted for merchandising verification and management authorization.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    tab: (search.tab as string) || undefined,
    piNo: (search.piNo as string) || undefined,
    status: (search.status as string) || undefined,
  }),
  component: MMPIVerificationApprovalPage,
});

type ApprovalTab = "Pending" | "Approved" | "Rejected" | "Returned" | "All";

export default function MMPIVerificationApprovalPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [pis, setPis] = useState<MMProformaInvoice[]>([]);
  const [activeTab, setActiveTab] = useState<ApprovalTab>(() => {
    if (search.status === "approved" || search.tab === "approved") return "Approved";
    if (search.status === "rejected" || search.tab === "rejected") return "Rejected";
    if (search.status === "returned" || search.tab === "returned") return "Returned";
    if (search.status === "all" || search.tab === "all") return "All";
    return "Pending";
  });

  const [searchQuery, setSearchQuery] = useState(search.piNo || "");
  const [supplierFilter, setSupplierFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const loadData = () => {
    const list = MMRepository.getPIs();
    setPis(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Normalize status for approval workflow
  const normalizeStatus = (
    status?: string
  ): "Pending" | "Approved" | "Rejected" | "Returned" | "Draft" => {
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

  // Tab counts (exclude Draft from Pending approval counts)
  const tabCounts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let returned = 0;
    let all = 0;

    pis.forEach((p) => {
      const norm = normalizeStatus(p.status);
      if (norm === "Pending") pending++;
      else if (norm === "Approved") approved++;
      else if (norm === "Rejected") rejected++;
      else if (norm === "Returned") returned++;

      if (norm !== "Draft") {
        all++;
      }
    });

    return {
      Pending: pending,
      Approved: approved,
      Rejected: rejected,
      Returned: returned,
      All: all,
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

  // Filtered approval PIs
  const filteredPis = useMemo(() => {
    return pis.filter((p) => {
      const norm = normalizeStatus(p.status);

      // In Approval Register, Drafts do NOT appear in the approval queue unless explicitly filtered in All
      if (activeTab === "Pending" && norm !== "Pending") return false;
      if (activeTab === "Approved" && norm !== "Approved") return false;
      if (activeTab === "Rejected" && norm !== "Rejected") return false;
      if (activeTab === "Returned" && norm !== "Returned") return false;
      if (activeTab === "All" && norm === "Draft") return false; // approval register focuses on submitted/reviewed records

      if (supplierFilter !== "All" && p.supplierName !== supplierFilter) {
        return false;
      }

      if (dateFilter && p.piDate !== dateFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mPiNo = p.piNo.toLowerCase().includes(q);
        const mSup = p.supplierName?.toLowerCase().includes(q);
        const mJob = getJobSummary(p).toLowerCase().includes(q);
        const mStyle = getStyleSummary(p).toLowerCase().includes(q);
        const mBookings = p.allocatedBookings?.some((b) => b.bookingNo.toLowerCase().includes(q));
        if (!mPiNo && !mSup && !mJob && !mStyle && !mBookings) {
          return false;
        }
      }

      return true;
    });
  }, [pis, activeTab, supplierFilter, dateFilter, searchQuery]);

  const hasActiveFilters =
    searchQuery.trim() !== "" || supplierFilter !== "All" || dateFilter !== "";

  const clearFilters = () => {
    setSearchQuery("");
    setSupplierFilter("All");
    setDateFilter("");
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
            Draft
          </span>
        );
    }
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-pi-verification-approval"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "PI / Proforma Invoice", to: "/mm-pi" },
        { label: "PI Verification Approval" },
      ]}
      title="PI Verification Approval"
      subtitle="Dedicated approval register for Proforma Invoices submitted for merchandising verification and management authorization."
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/mm-pi"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors shadow-sm"
          >
            <FileCheck className="w-4 h-4 text-slate-600" />
            <span>PI Register</span>
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
                { id: "Pending", label: "Pending Approval", count: tabCounts.Pending },
                { id: "Approved", label: "Approved", count: tabCounts.Approved },
                { id: "Rejected", label: "Rejected", count: tabCounts.Rejected },
                { id: "Returned", label: "Returned", count: tabCounts.Returned },
                { id: "All", label: "All Records", count: tabCounts.All },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ApprovalTab)}
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
            <span className="font-semibold text-slate-800">{tabCounts[activeTab]}</span> records
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Quick Search */}
            <div className="lg:col-span-2 relative">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Search PI / Supplier / Booking
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="PI No, Supplier, Job ID, Style, Booking..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
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

            {/* Filter by PI Date */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                PI Date
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>

            {/* Reset Controls */}
            <div className="flex items-end">
              {hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="w-full py-1.5 px-3 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                <div className="text-[11px] text-slate-400 pb-2">All filters cleared</div>
              )}
            </div>
          </div>
        </div>

        {/* Approval Register Table */}
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
                  <th className="py-3 px-3.5 whitespace-nowrap">Booking Number(s)</th>
                  <th className="py-3 px-3 text-right whitespace-nowrap">Total Quantity</th>
                  <th className="py-3 px-3.5 text-right whitespace-nowrap">PI Value</th>
                  <th className="py-3 px-2.5 text-center whitespace-nowrap">Curr.</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">Approval Status</th>
                  <th className="py-3 px-3 whitespace-nowrap">Submitted By</th>
                  <th className="py-3 px-3 whitespace-nowrap">Submitted Date</th>
                  <th className="py-3 px-3 text-center whitespace-nowrap sticky right-0 bg-slate-50 z-10 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPis.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-semibold text-slate-800">
                          {activeTab === "Pending"
                            ? "No Proforma Invoices Pending Approval"
                            : `No ${activeTab} Proforma Invoices Found`}
                        </p>
                        <p className="text-xs text-slate-500 max-w-sm">
                          {hasActiveFilters
                            ? "No records match your active search filters. Try clearing filters to see all records."
                            : activeTab === "Pending"
                            ? "All submitted proforma invoices have been reviewed or authorized."
                            : `There are currently no proforma invoices with status '${activeTab}'.`}
                        </p>
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="mt-2 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                          >
                            Reset Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPis.map((pi) => {
                    const jobSummary = getJobSummary(pi);
                    const styleSummary = getStyleSummary(pi);
                    const totalQty = getTotalQuantity(pi);

                    return (
                      <tr
                        key={pi.id}
                        className="hover:bg-indigo-50/40 transition-colors group"
                      >
                        {/* PI Number Hyperlink - opens dedicated details page */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <Link
                            to="/mm-pi-approval-details"
                            search={{ id: pi.id, from: "approval" } as any}
                            className="font-mono font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1.5"
                            title={`Review PI ${pi.piNo}`}
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

                        {/* Supplier */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="font-semibold text-slate-800">
                              {pi.supplierName}
                            </span>
                          </div>
                          {pi.businessUnit && (
                            <span className="block text-[10px] text-slate-500 pl-5">
                              {pi.businessUnit}
                            </span>
                          )}
                        </td>

                        {/* Job ID */}
                        <td className="py-3 px-3 whitespace-nowrap text-slate-700 font-mono font-medium">
                          {jobSummary}
                        </td>

                        {/* Style */}
                        <td className="py-3 px-3 whitespace-nowrap text-slate-700 font-medium">
                          {styleSummary}
                        </td>

                        {/* Booking Number(s) */}
                        <td className="py-3 px-3.5">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {pi.allocatedBookings && pi.allocatedBookings.length > 0 ? (
                              pi.allocatedBookings.map((b) => (
                                <span
                                  key={b.bookingId}
                                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                                    b.bookingType === "Fabric"
                                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                                      : "bg-teal-50 text-teal-700 border border-teal-200"
                                  }`}
                                  title={`${b.bookingType} Booking: ${b.bookingNo}`}
                                >
                                  {b.bookingNo}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 italic">Direct PI</span>
                            )}
                          </div>
                        </td>

                        {/* Total Quantity */}
                        <td className="py-3 px-3 text-right whitespace-nowrap font-mono text-slate-800">
                          <span className="font-semibold">
                            {totalQty.qty.toLocaleString("en-US")}
                          </span>{" "}
                          <span className="text-[10px] text-slate-500">{totalQty.unit}</span>
                        </td>

                        {/* PI Value */}
                        <td className="py-3 px-3.5 text-right whitespace-nowrap font-mono font-bold text-slate-900">
                          {pi.currency === "USD" ? "$" : "৳"}
                          {Number(pi.totalPiValue || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        {/* Currency */}
                        <td className="py-3 px-2.5 text-center whitespace-nowrap">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {pi.currency || "USD"}
                          </span>
                        </td>

                        {/* Approval Status */}
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          {getStatusBadge(pi.status)}
                        </td>

                        {/* Submitted By */}
                        <td className="py-3 px-3 whitespace-nowrap text-slate-700 text-xs">
                          {pi.submittedBy || pi.createdBy || "—"}
                        </td>

                        {/* Submitted Date */}
                        <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                          {pi.submittedDate || pi.createdDate || "—"}
                        </td>

                        {/* Action - dedicated View / Review page */}
                        <td className="py-3 px-3 text-center whitespace-nowrap sticky right-0 bg-white group-hover:bg-indigo-50/40 z-10 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                          <Link
                            to="/mm-pi-approval-details"
                            search={{ id: pi.id, from: "approval" } as any}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded transition-colors"
                            title="Open dedicated PI approval details page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{normalizeStatus(pi.status) === "Pending" ? "Review" : "View"}</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Summary */}
          {filteredPis.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <span>
                  Total in <strong className="text-slate-900">{activeTab}</strong> queue:{" "}
                  <strong className="text-slate-900">{filteredPis.length}</strong>
                </span>
                <span>•</span>
                <span>
                  Total Value:{" "}
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
                Click Review or View to perform approval actions on the dedicated page
              </div>
            </div>
          )}
        </div>
      </div>
    </MarketingMerchandisingLayout>
  );
}
