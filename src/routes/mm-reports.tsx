import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMAuditLogEntry,
} from "../lib/marketing-merchandising-data";
import {
  ClipboardList,
  Search,
  Filter,
  FileSpreadsheet,
  Download,
  Calendar,
  Layers,
  History,
  ShieldCheck,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mm-reports")({
  head: () => ({
    meta: [
      { title: "MM Registers & Enterprise Audit Trail — CriptonHRIS" },
      {
        name: "description",
        content: "Centralized registers, multi-criteria report explorer, and full operational audit logs for Marketing & Merchandising.",
      },
    ],
  }),
  component: MMReportsPage,
});

function MMReportsPage() {
  const [auditLogs, setAuditLogs] = useState<MMAuditLogEntry[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setAuditLogs(MMRepository.getAuditLogs());
  }, []);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchEntity = selectedEntity === "All" || log.entityType === selectedEntity;
      const matchSearch =
        searchTerm === "" ||
        log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.comments && log.comments.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchEntity && matchSearch;
    });
  }, [auditLogs, selectedEntity, searchTerm]);

  const handleExportAuditCsv = () => {
    const headers = ["Timestamp", "Entity Type", "Entity ID", "Action", "Authorized User", "Audit Comments"];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.entityType}"`,
      `"${l.entityId}"`,
      `"${l.action}"`,
      `"${l.userName.replace(/"/g, '""')}"`,
      `"${(l.comments || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mm_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit trail exported successfully.");
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-reports"
      breadcrumbs={[{ label: "Registers & Audit Trail" }]}
      title="Registers, Search & Enterprise Audit Trail"
      subtitle="Complete operational transparency, immutable transaction histories, and centralized register links"
      actions={
        <button
          onClick={handleExportAuditCsv}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
          <span>Export Audit Log</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Quick Links to All 12 Registers */}
        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Centralized Functional Registers Directory
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            <Link
              to="/mm-buyer-quotation"
              className="p-2.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 text-center font-bold text-slate-800 dark:text-slate-200"
            >
              Quotation Register
            </Link>
            <Link
              to="/mm-pre-costing"
              className="p-2.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 text-center font-bold text-slate-800 dark:text-slate-200"
            >
              Pre-Costing Register
            </Link>
            <Link
              to="/mm-order-entry"
              className="p-2.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 text-center font-bold text-slate-800 dark:text-slate-200"
            >
              Main Order Register
            </Link>
            <Link
              to="/mm-bom"
              className="p-2.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 text-center font-bold text-slate-800 dark:text-slate-200"
            >
              BOM Register
            </Link>
            <Link
              to="/mm-fabric-booking"
              className="p-2.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 text-center font-bold text-slate-800 dark:text-slate-200"
            >
              Fabric Bookings
            </Link>
            <Link
              to="/mm-accessories-booking"
              className="p-2.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 text-center font-bold text-slate-800 dark:text-slate-200"
            >
              Accessories Bookings
            </Link>
            <Link
              to="/mm-booking-approval-queue"
              className="p-2.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 text-center font-bold text-slate-800 dark:text-slate-200"
            >
              Approval Queue
            </Link>
            <Link
              to="/mm-pi"
              className="p-2.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 text-center font-bold text-slate-800 dark:text-slate-200"
            >
              PI Register
            </Link>
            <Link
              to="/mm-order-closure"
              className="p-2.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 text-center font-bold text-slate-800 dark:text-slate-200"
            >
              Closure History
            </Link>
            <Link
              to="/mm-cost-saving-analysis"
              className="p-2.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 text-center font-bold text-slate-800 dark:text-slate-200"
            >
              Cost Saving Report
            </Link>
            <Link
              to="/mm-policy-config"
              className="p-2.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 text-center font-bold text-slate-800 dark:text-slate-200"
            >
              Policy Audit Log
            </Link>
            <Link
              to="/mm-dashboard"
              className="p-2.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 text-center font-bold text-teal-600"
            >
              Command Center
            </Link>
          </div>
        </div>

        {/* Audit Trail Explorer Toolbar */}
        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Entity ID, User, or Action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Filter Entity:</span>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="p-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
            >
              <option value="All">All Entities</option>
              <option value="Quotation">Buyer Quotations</option>
              <option value="PreCosting">Pre-Costings</option>
              <option value="MainOrder">Main Orders</option>
              <option value="BOM">BOMs</option>
              <option value="FabricBooking">Fabric Bookings</option>
              <option value="AccessoriesBooking">Accessories Bookings</option>
              <option value="PI">Proforma Invoices</option>
              <option value="CompanyPolicy">Company Policies</option>
              <option value="OrderClosure">Order Closure & Reopening</option>
            </select>
          </div>
        </div>

        {/* Audit Trail Table */}
        <div className="rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-b font-semibold">
                <tr>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Entity Type</th>
                  <th className="py-3 px-3">Entity Identifier</th>
                  <th className="py-3 px-3">Operation / Action</th>
                  <th className="py-3 px-3">Authorized User</th>
                  <th className="py-3 px-3">Comments & Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono text-slate-500">{log.timestamp}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800">
                        {log.entityType}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-teal-600 dark:text-teal-400">{log.entityId}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          log.action === "Approve"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : log.action === "Reject"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : log.action === "Close"
                            ? "bg-rose-50 text-rose-700"
                            : log.action === "Amend"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">{log.userName}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 italic">"{log.comments}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MarketingMerchandisingLayout>
  );
}
