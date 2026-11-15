import React from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, RotateCcw, ShieldAlert, ExternalLink, HelpCircle } from "lucide-react";
import { resetSupplierPortalData, getInvitations } from "@/lib/supplier-portal/storage";

interface Props {
  token?: string;
}

export const InvalidInvitationView: React.FC<Props> = ({ token }) => {
  const invitations = getInvitations();

  const handleReset = () => {
    resetSupplierPortalData();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172554] flex flex-col justify-between font-sans selection:bg-[#4169E1] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-[#E2E8F0] bg-white px-6 py-4 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4169E1] flex items-center justify-center font-black text-white text-base shadow-sm">
              P
            </div>
            <div>
              <span className="font-extrabold text-[#172554] text-sm tracking-tight block">
                Pakiza Group
              </span>
              <span className="text-xs text-[#64748B] block font-medium">
                Supplier Quotation Portal
              </span>
            </div>
          </div>

          <Link
            to="/supplier-portal"
            className="text-xs font-semibold text-[#4169E1] hover:underline"
          >
            ← Back to Portal Gateway
          </Link>
        </div>
      </header>

      {/* Main card */}
      <div className="max-w-xl mx-auto w-full px-4 py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-6 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-black text-[#172554] tracking-tight mb-2">
          Invalid or Expired Invitation
        </h1>
        <p className="text-sm text-[#64748B] max-w-md mx-auto mb-6 leading-relaxed">
          The quotation invitation token{" "}
          {token ? (
            <code className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-xs font-mono">
              {token}
            </code>
          ) : (
            "provided"
          )}{" "}
          does not exist, has expired, or is no longer accessible. Please verify the URL from your official invitation email.
        </p>

        {/* Demo invitations quick-picker */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 text-left mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E2E8F0]">
            <h3 className="text-xs uppercase font-bold text-[#172554] tracking-wider">
              Available Prototype Demo Invitations:
            </h3>
            <span className="text-[11px] text-[#64748B]">Click to test</span>
          </div>

          <div className="space-y-2">
            {invitations.map((inv) => (
              <Link
                key={inv.invitationToken}
                to="/supplier-portal/invitation/$invitationToken"
                params={{ invitationToken: inv.invitationToken }}
                className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] hover:bg-blue-50/60 border border-[#E2E8F0] hover:border-[#4169E1]/50 transition-all text-xs group cursor-pointer"
              >
                <div>
                  <div className="font-bold text-[#172554] group-hover:text-[#4169E1]">
                    {inv.supplierMaster.supplierName}
                  </div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">
                    {inv.csInfo.csNumber} • Status:{" "}
                    <span className="text-[#4169E1] font-semibold">
                      {inv.currentQuotation.status}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#4169E1] group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/supplier-portal"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#4169E1] hover:bg-[#2347B5] text-white text-xs font-bold transition-all shadow-md shadow-[#4169E1]/20 inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            Go to Portal Gateway
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#64748B] hover:text-[#172554] text-xs font-semibold transition-colors inline-flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#4169E1]" />
            Reset Demo Data to Seed
          </button>
        </div>
      </div>

      {/* Mini footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-4 text-center text-xs text-[#64748B]">
        © {new Date().getFullYear()} Pakiza Software • CriptonHRIS Procurement Subsystem.
      </footer>
    </div>
  );
};
