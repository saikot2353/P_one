import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Layers,
  FileText,
  DollarSign,
  AlertCircle,
  ExternalLink,
  Calendar,
  Package,
  Hash,
} from "lucide-react";
import {
  getInvitations,
  resetSupplierPortalData,
} from "@/lib/supplier-portal/storage";
import { SupplierInvitationRecord } from "@/lib/supplier-portal/types";

export const Route = createFileRoute("/supplier-portal/")({
  head: () => ({
    meta: [
      { title: "Supplier Quotation Portal — Pakiza Group" },
      {
        name: "description",
        content:
          "Official enterprise gateway for invited suppliers to review CS specifications and submit commercial quotations.",
      },
    ],
  }),
  component: SupplierPortalIndexPage,
});

function SupplierPortalIndexPage() {
  const [invitations, setInvitations] = useState<SupplierInvitationRecord[]>([]);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    setInvitations(getInvitations());
  }, []);

  const handleResetData = () => {
    if (
      window.confirm(
        "Reset all demo invitations, drafts, and revision logs to initial seed data?"
      )
    ) {
      const seeded = resetSupplierPortalData();
      setInvitations(seeded);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      case "Submitted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "Revision Approved":
        return "bg-cyan-50 text-cyan-700 border-cyan-200/80";
      case "Revision Requested":
        return "bg-orange-50 text-orange-700 border-orange-200/80";
      case "Invitation Sent":
      case "Link Opened":
        return "bg-blue-50 text-[#4169E1] border-blue-200/80";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] text-[#172554] flex flex-col font-sans selection:bg-[#4169E1] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-[#E2E8F0] bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#4169E1] flex items-center justify-center font-black text-white text-xl shadow-md shadow-[#4169E1]/20">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#172554] text-lg tracking-tight">
                  Pakiza Group
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#4169E1] text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                  Procurement
                </span>
              </div>
              <span className="text-xs text-[#64748B] block font-medium">
                Supplier Quotation Portal • Gateway
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-semibold text-[#64748B] hover:text-[#172554] transition-colors shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#4169E1]" />
              Reset Demo Seed Data
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-14 bg-gradient-to-b from-white via-white to-[#F5F8FF] border-b border-[#E2E8F0]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#4169E1] text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Phase 1 Standalone Procurement Architecture
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#172554] tracking-tight leading-tight">
              Supplier Quotation &amp; Comparative Statement Portal
            </h1>
            <p className="mt-4 text-base text-[#64748B] leading-relaxed">
              A modern, isolated digital procurement portal for invited suppliers to review
              Comparative Statement (CS) specifications, submit itemized and overall pricing,
              upload technical brochures, and manage quotation revision workflows.
            </p>
          </div>

          {resetSuccess && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Demo invitations and revision logs have been restored to initial prototype defaults.</span>
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights Banner */}
      <section className="py-8 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#4169E1] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-[#172554] text-sm block">Token-Based Security</span>
                <span className="text-[#64748B] mt-0.5 block leading-relaxed">
                  Isolated guest access via secure tokens without ERP login
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-[#172554] text-sm block">Procurement Math Engine</span>
                <span className="text-[#64748B] mt-0.5 block leading-relaxed">
                  Reactive Gross, VAT, TAX &amp; Net Line total calculations
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-[#172554] text-sm block">Revision &amp; Audit Trail</span>
                <span className="text-[#64748B] mt-0.5 block leading-relaxed">
                  Formal revision requests and version archiving (v1.0, v2.0)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-[#172554] text-sm block">Official Print &amp; PDF</span>
                <span className="text-[#64748B] mt-0.5 block leading-relaxed">
                  Corporate quotation printouts on clean, standard A4 layout
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Invitations Grid */}
      <section className="py-12 flex-1">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-[#172554] tracking-tight">
                Simulated Supplier Invitations
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                Select an invitation below to test the portal under different supplier scenarios and workflow states.
              </p>
            </div>
            <div className="text-xs text-[#64748B] font-mono bg-white px-3 py-1.5 rounded-lg border border-[#E2E8F0] shadow-2xs">
              Storage: <span className="text-[#4169E1] font-semibold">cripton_sqp_*</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {invitations.map((inv) => {
              const status = inv.currentQuotation.status;
              const badgeClass = getStatusBadge(status);

              return (
                <div
                  key={inv.invitationToken}
                  className="rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#4169E1]/50 p-6 flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-[#4169E1]/5 group shadow-xs"
                >
                  <div>
                    {/* Top Row: Token & Status */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-[11px] text-[#64748B] bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                        Token: {inv.invitationToken}
                      </span>
                      <span
                        className={`text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full border ${badgeClass}`}
                      >
                        {status}
                      </span>
                    </div>

                    {/* Supplier Name & CS Subject */}
                    <h3 className="text-lg font-bold text-[#172554] group-hover:text-[#4169E1] transition-colors">
                      {inv.supplierMaster.supplierName}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1 font-medium line-clamp-1">
                      {inv.csInfo.csSubject}
                    </p>

                    {/* Meta Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#E2E8F0] text-xs">
                      <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                        <span className="text-[#64748B] block text-[10px] uppercase font-bold tracking-wider">
                          CS Number
                        </span>
                        <span className="font-mono font-bold text-[#172554] text-xs">
                          {inv.csInfo.csNumber}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                        <span className="text-[#64748B] block text-[10px] uppercase font-bold tracking-wider">
                          Submission Deadline
                        </span>
                        <span className="text-[#172554] font-semibold text-xs">
                          {new Date(inv.csInfo.submissionDeadline).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" }
                          )}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                        <span className="text-[#64748B] block text-[10px] uppercase font-bold tracking-wider">
                          Items in Tender
                        </span>
                        <span className="text-[#172554] font-semibold text-xs">
                          {inv.items.length} Required Items
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                        <span className="text-[#64748B] block text-[10px] uppercase font-bold tracking-wider">
                          Quotation Ref / Ver
                        </span>
                        <span className="font-mono text-[#172554] font-semibold text-xs truncate block">
                          {inv.currentQuotation.quotationReference} (v{inv.currentQuotation.version}.0)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Open Portal Link */}
                  <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-xs text-[#64748B]">
                      Currency: <strong className="text-[#172554]">{inv.csInfo.currency}</strong>
                    </span>

                    <Link
                      to="/supplier-portal/invitation/$invitationToken"
                      params={{ invitationToken: inv.invitationToken }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4169E1] hover:bg-[#2347B5] active:bg-[#1E3FA8] text-white text-xs font-bold transition-all shadow-md shadow-[#4169E1]/20 group-hover:scale-[1.02] cursor-pointer"
                    >
                      Open Quotation Portal
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-6 text-center text-xs text-[#64748B]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <p className="font-semibold text-[#172554]">
            © {new Date().getFullYear()} Pakiza Group • Enterprise Procurement Division
          </p>
          <p className="mt-1 text-[11px] text-[#64748B]">
            Phase 1 Standalone Architecture • Complete Data Isolation
          </p>
        </div>
      </footer>
    </div>
  );
}
