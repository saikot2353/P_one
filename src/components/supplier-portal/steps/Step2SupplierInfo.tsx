import React, { useState } from "react";
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Shield,
  AlertCircle,
} from "lucide-react";
import { SupplierInvitationRecord, SupplierContactInfo } from "@/lib/supplier-portal/types";
import { toast } from "sonner";

interface Props {
  invitation: SupplierInvitationRecord;
  onUpdateContact: (contact: SupplierContactInfo) => void;
  onNext: () => void;
  onPrev: () => void;
  isReadOnly: boolean;
}

export function Step2SupplierInfo({
  invitation,
  onUpdateContact,
  onNext,
  onPrev,
  isReadOnly,
}: Props) {
  const { supplierMaster } = invitation;
  const [form, setForm] = useState<SupplierContactInfo>({ ...invitation.supplierContact });
  const [errors, setErrors] = useState<Partial<Record<keyof SupplierContactInfo, string>>>({});

  const validate = (): boolean => {
    const errs: Partial<Record<keyof SupplierContactInfo, string>> = {};
    if (!form.contactPerson.trim()) errs.contactPerson = "Contact Person name is required";
    if (!form.designation.trim()) errs.designation = "Designation is required";
    if (!form.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = "Please enter a valid email address";
    }
    if (!form.mobile.trim()) errs.mobile = "Mobile/Phone number is required";
    if (!form.officeAddress.trim()) errs.officeAddress = "Office address is required";
    if (!form.country.trim()) errs.country = "Country is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: keyof SupplierContactInfo, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    onUpdateContact(updated);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleProceed = () => {
    if (validate()) {
      toast.success("Supplier contact details saved for quotation.");
      onNext();
    } else {
      toast.error("Please fill in all required contact information.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Scope Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3.5 text-[#172554] text-xs shadow-2xs">
        <Shield className="size-4.5 text-[#4169E1] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-extrabold text-[#172554]">Portal Contact Information Scope</span>
          <p className="text-[#64748B]">
            Contact information updated in this section is stored exclusively for this specific quotation
            record and will not alter your permanent Master profile in Pakiza Group’s central vendor registry.
          </p>
        </div>
      </div>

      {/* Supplier Master Information (Read-Only) */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
        <h3 className="text-xs font-extrabold text-[#172554] uppercase tracking-wider pb-3 border-b border-[#E2E8F0] flex items-center gap-2">
          <Building2 className="size-4 text-[#4169E1]" />
          <span>Supplier Master Credentials (Read-Only)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              Assigned Supplier Code
            </label>
            <div className="font-mono font-bold text-[#172554] text-sm">
              {supplierMaster.supplierCode}
            </div>
          </div>

          <div className="space-y-1 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              Official Registered Legal Name
            </label>
            <div className="font-bold text-[#172554] text-sm">
              {supplierMaster.supplierName}
            </div>
          </div>
        </div>
      </div>

      {/* Editable Contact Information */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <h3 className="text-xs font-extrabold text-[#172554] uppercase tracking-wider flex items-center gap-2">
            <User className="size-4 text-[#4169E1]" />
            <span>Quotation Authorized Contact Representative</span>
          </h3>
          {isReadOnly && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              Read-Only (Locked)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Contact Person */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Contact Person Name *</span>
            </label>
            <div className="relative">
              <input
                type="text"
                disabled={isReadOnly}
                value={form.contactPerson}
                onChange={(e) => handleChange("contactPerson", e.target.value)}
                placeholder="e.g. Engr. Mahmudul Hasan"
                className={`w-full h-10 px-3.5 rounded-xl border bg-slate-50/50 text-xs font-semibold outline-none transition ${
                  errors.contactPerson ? "border-rose-500 ring-1 ring-rose-500/20" : "border-slate-300 focus:bg-white focus:border-blue-600"
                } disabled:bg-slate-100 disabled:text-slate-500`}
              />
            </div>
            {errors.contactPerson && (
              <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                <AlertCircle className="size-3" />
                {errors.contactPerson}
              </span>
            )}
          </div>

          {/* Designation */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Designation *
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={form.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
              placeholder="e.g. Director - Industrial Sales"
              className={`w-full h-10 px-3.5 rounded-xl border bg-slate-50/50 text-xs font-semibold outline-none transition ${
                errors.designation ? "border-rose-500 ring-1 ring-rose-500/20" : "border-slate-300 focus:bg-white focus:border-blue-600"
              } disabled:bg-slate-100 disabled:text-slate-500`}
            />
            {errors.designation && (
              <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                <AlertCircle className="size-3" />
                {errors.designation}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Mail className="size-3 text-slate-400" />
              <span>Official Email Address *</span>
            </label>
            <input
              type="email"
              disabled={isReadOnly}
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="name@company.com"
              className={`w-full h-10 px-3.5 rounded-xl border bg-slate-50/50 text-xs font-semibold outline-none transition ${
                errors.email ? "border-rose-500 ring-1 ring-rose-500/20" : "border-slate-300 focus:bg-white focus:border-blue-600"
              } disabled:bg-slate-100 disabled:text-slate-500`}
            />
            {errors.email && (
              <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                <AlertCircle className="size-3" />
                {errors.email}
              </span>
            )}
          </div>

          {/* Mobile */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Phone className="size-3 text-slate-400" />
              <span>Direct Mobile / Phone *</span>
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={form.mobile}
              onChange={(e) => handleChange("mobile", e.target.value)}
              placeholder="+880 1713-000000"
              className={`w-full h-10 px-3.5 rounded-xl border bg-slate-50/50 text-xs font-mono font-semibold outline-none transition ${
                errors.mobile ? "border-rose-500 ring-1 ring-rose-500/20" : "border-slate-300 focus:bg-white focus:border-blue-600"
              } disabled:bg-slate-100 disabled:text-slate-500`}
            />
            {errors.mobile && (
              <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                <AlertCircle className="size-3" />
                {errors.mobile}
              </span>
            )}
          </div>

          {/* Country */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Globe className="size-3 text-slate-400" />
              <span>Country *</span>
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
              placeholder="e.g. Bangladesh"
              className={`w-full h-10 px-3.5 rounded-xl border bg-slate-50/50 text-xs font-semibold outline-none transition ${
                errors.country ? "border-rose-500 ring-1 ring-rose-500/20" : "border-slate-300 focus:bg-white focus:border-blue-600"
              } disabled:bg-slate-100 disabled:text-slate-500`}
            />
            {errors.country && (
              <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                <AlertCircle className="size-3" />
                {errors.country}
              </span>
            )}
          </div>

          {/* Office Address */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="size-3 text-slate-400" />
              <span>Corporate Office Physical Address *</span>
            </label>
            <textarea
              rows={2}
              disabled={isReadOnly}
              value={form.officeAddress}
              onChange={(e) => handleChange("officeAddress", e.target.value)}
              placeholder="Plot/Building, Road, Area, City, Postal Code"
              className={`w-full p-3 rounded-xl border bg-slate-50/50 text-xs font-medium outline-none transition resize-none ${
                errors.officeAddress ? "border-rose-500 ring-1 ring-rose-500/20" : "border-slate-300 focus:bg-white focus:border-blue-600"
              } disabled:bg-slate-100 disabled:text-slate-500`}
            />
            {errors.officeAddress && (
              <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                <AlertCircle className="size-3" />
                {errors.officeAddress}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="h-10 px-5 rounded-xl border border-[#E2E8F0] hover:bg-slate-50 text-[#172554] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Overview</span>
        </button>

        <button
          type="button"
          onClick={handleProceed}
          className="h-10 px-6 rounded-xl bg-[#4169E1] hover:bg-[#2347B5] active:bg-[#1E3FA8] text-white text-xs font-bold shadow-md shadow-[#4169E1]/20 transition flex items-center gap-1.5 cursor-pointer hover:scale-[1.01]"
        >
          <span>Continue to Item Quotations</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

