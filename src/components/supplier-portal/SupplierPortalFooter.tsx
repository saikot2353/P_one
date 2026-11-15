import React from "react";
import { ShieldCheck, Mail, Phone, Lock } from "lucide-react";

export function SupplierPortalFooter() {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] text-[#64748B] text-xs py-8 mt-16 shadow-2xs">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0] text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#172554] font-bold text-sm">
              <ShieldCheck className="size-4 text-[#4169E1]" />
              <span>Pakiza Group • Enterprise Procurement Division</span>
            </div>
            <p className="text-[#64748B] text-xs max-w-xl">
              Official supplier-facing Comparative Statement quotation portal. All bids, prices,
              and commercial terms are encrypted and strictly confidential under NDA.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs text-[#172554]">
            <div className="flex items-center gap-1.5">
              <Mail className="size-3.5 text-[#4169E1]" />
              <span className="font-medium">procurement@pakizaknit.com</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="size-3.5 text-[#4169E1]" />
              <span className="font-medium">+880 2-9669871 (Ext: 402)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#64748B]">
          <div>
            © {new Date().getFullYear()} Pakiza Software &amp; CriptonHRIS Procurement Subsystem. All
            rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#172554] font-medium">
              <Lock className="size-3 text-[#4169E1]" />
              256-bit Encrypted Session
            </span>
            <span>•</span>
            <span className="hover:text-[#172554] cursor-pointer">Supplier Terms of Engagement</span>
            <span>•</span>
            <span className="hover:text-[#172554] cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
