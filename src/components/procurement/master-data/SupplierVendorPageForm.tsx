import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Save, Users, Building, CreditCard, FileText, Edit, Check, ChevronDown, X, Search, Globe } from "lucide-react";
import { SupplierVendor, VendorCategory, Origin } from "@/lib/procurement-master-data";

interface SupplierVendorPageFormProps {
  mode: "create" | "edit" | "view";
  initialData?: SupplierVendor | null;
  vendorCategories: VendorCategory[];
  origins: Origin[];
  onSave: (data: SupplierVendor) => void;
  onCancel: () => void;
  onSwitchToEdit?: () => void;
}

export function SupplierVendorPageForm({
  mode,
  initialData,
  vendorCategories,
  origins,
  onSave,
  onCancel,
  onSwitchToEdit,
}: SupplierVendorPageFormProps) {
  const [formData, setFormData] = useState<Partial<SupplierVendor>>(() => {
    if (initialData) return { ...initialData };
    return {
      vendorCode: `SUP-${Math.floor(100 + Math.random() * 900)}`,
      vendorName: "",
      vendorCategory: vendorCategories[0]?.categoryName || "General",
      businessType: "Manufacturing",
      tradeLicenseNo: "",
      tin: "",
      bin: "",
      registrationNo: "",
      country: origins[0]?.originName || "Bangladesh",
      localForeignStatus: (origins[0]?.originName || "Bangladesh").toLowerCase() === "bangladesh" ? "Local" : "Foreign",
      address: "",
      status: "Active",
      createDate: new Date().toISOString().split("T")[0],
      contactPersonName: "",
      designation: "",
      mobileNumber: "",
      emailAddress: "",
      website: "",
      bankName: "",
      branchName: "",
      accountName: "",
      accountNumber: "",
      routingNumber: "",
      swiftCode: "",
      termsConditionsDescription: "",
    };
  });

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const isView = mode === "view";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    const errors: Record<string, string> = {};
    if (!formData.vendorCode?.trim()) errors.vendorCode = "Supplier Code is required";
    if (!formData.vendorName?.trim()) errors.vendorName = "Supplier / Vendor Name is required";
    if (!formData.mobileNumber?.trim()) errors.mobileNumber = "Mobile Number is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload: SupplierVendor = {
      id: initialData?.id || `sup-${Date.now()}`,
      vendorCode: formData.vendorCode || `SUP-${Date.now()}`,
      vendorName: formData.vendorName || "",
      vendorCategory: formData.vendorCategory || "General",
      businessType: formData.businessType || "Trading",
      tradeLicenseNo: formData.tradeLicenseNo || "",
      tin: formData.tin || "",
      bin: formData.bin || "",
      registrationNo: formData.registrationNo || "",
      country: formData.country || "Bangladesh",
      localForeignStatus: (formData.country || "Bangladesh").toLowerCase() === "bangladesh" ? "Local" : "Foreign",
      address: formData.address || "",
      status: formData.status || "Active",
      createDate: formData.createDate || new Date().toISOString().split("T")[0],
      contactPersonName: formData.contactPersonName || "",
      designation: formData.designation || "",
      mobileNumber: formData.mobileNumber || "",
      emailAddress: formData.emailAddress || "",
      website: formData.website || "",
      bankName: formData.bankName || "",
      branchName: formData.branchName || "",
      accountName: formData.accountName || "",
      accountNumber: formData.accountNumber || "",
      routingNumber: formData.routingNumber || "",
      swiftCode: formData.swiftCode || "",
      termsConditionsDescription: formData.termsConditionsDescription || "",
    };

    onSave(payload);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground transition shadow-2xs cursor-pointer"
            title="Back to Supplier List"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Master Data / Supplier & Vendor Master
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                  mode === "create"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : mode === "edit"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                }`}
              >
                {mode === "create" ? "New Entry" : mode === "edit" ? "Edit Mode" : "Read-Only View"}
              </span>
            </div>
            <h1 className="text-xl font-black text-foreground tracking-tight mt-0.5">
              {mode === "create"
                ? "Create Supplier / Vendor"
                : mode === "edit"
                  ? `Edit Supplier — ${formData.vendorName || formData.vendorCode}`
                  : `Supplier Profile — ${formData.vendorName || formData.vendorCode}`}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            {isView ? "Back to List" : "Cancel"}
          </button>
          {isView && onSwitchToEdit ? (
            <button
              type="button"
              onClick={onSwitchToEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Edit className="size-3.5" />
              <span>Edit Record</span>
            </button>
          ) : !isView ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>{mode === "create" ? "Save Supplier" : "Update Supplier"}</span>
            </button>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Supplier / Vendor Profile */}
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/60">
            <Users className="size-4 text-amber-500" />
            <h2 className="text-sm font-bold text-foreground">Supplier / Vendor Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Supplier Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.vendorCode || ""}
                onChange={(e) => setFormData({ ...formData, vendorCode: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              {formErrors.vendorCode && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.vendorCode}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold mb-1 text-foreground">
                Supplier / Vendor Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.vendorName || ""}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                placeholder="e.g. Apex Textile Chemical & Dyestuffs Ltd"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              {formErrors.vendorName && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.vendorName}</p>
              )}
            </div>

            {/* Multi-Selection Vendor Category */}
            <div className="relative">
              <label className="block text-xs font-bold mb-1 text-foreground">
                Vendor Category (Multiple Selection)
              </label>
              
              {/* Selected Categories Tags */}
              <div
                onClick={() => !isView && setCategoryDropdownOpen((prev) => !prev)}
                className={`min-h-9 p-1.5 rounded-lg border border-border/80 bg-background text-xs font-medium focus-within:border-amber-500 flex flex-wrap items-center gap-1.5 cursor-pointer ${
                  isView ? "bg-muted/50 cursor-default" : ""
                }`}
              >
                {(() => {
                  const selectedList = formData.vendorCategory
                    ? formData.vendorCategory.split(",").map((s) => s.trim()).filter(Boolean)
                    : [];
                  if (selectedList.length === 0) {
                    return <span className="text-muted-foreground text-xs px-1.5">Select Vendor Categories...</span>;
                  }
                  return selectedList.map((catName) => (
                    <span
                      key={catName}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[11px] font-bold"
                    >
                      {catName}
                      {!isView && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const next = selectedList.filter((c) => c !== catName);
                            setFormData({ ...formData, vendorCategory: next.join(", ") });
                          }}
                          className="hover:text-rose-500 transition-colors"
                        >
                          <X className="size-3" />
                        </button>
                      )}
                    </span>
                  ));
                })()}
                {!isView && (
                  <ChevronDown className="size-3.5 text-muted-foreground ml-auto shrink-0 mr-1" />
                )}
              </div>

              {/* Multi-Selection Dropdown Menu */}
              {categoryDropdownOpen && !isView && (
                <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-card rounded-xl border border-border shadow-xl p-2 space-y-1.5 max-h-56 flex flex-col">
                  <div className="relative shrink-0">
                    <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      autoFocus
                      value={categorySearchQuery}
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                      placeholder="Search categories..."
                      className="w-full pl-8 pr-2.5 h-7.5 rounded-lg border border-border/80 bg-muted/40 text-xs font-medium focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div className="overflow-y-auto flex-1 divide-y divide-border/40 pr-0.5">
                    {vendorCategories
                      .filter((vc) =>
                        !categorySearchQuery.trim() ||
                        vc.categoryName.toLowerCase().includes(categorySearchQuery.toLowerCase())
                      )
                      .map((vc) => {
                        const selectedList = formData.vendorCategory
                          ? formData.vendorCategory.split(",").map((s) => s.trim()).filter(Boolean)
                          : [];
                        const isSelected = selectedList.includes(vc.categoryName);
                        return (
                          <button
                            type="button"
                            key={vc.id}
                            onClick={() => {
                              let next: string[];
                              if (isSelected) {
                                next = selectedList.filter((c) => c !== vc.categoryName);
                              } else {
                                next = [...selectedList, vc.categoryName];
                              }
                              setFormData({ ...formData, vendorCategory: next.join(", ") });
                            }}
                            className={`w-full py-1.5 px-2 rounded-md text-xs font-medium text-left flex items-center justify-between hover:bg-amber-500/10 hover:text-amber-600 transition cursor-pointer ${
                              isSelected ? "bg-amber-500/15 text-amber-600 font-bold" : "text-foreground"
                            }`}
                          >
                            <span>{vc.categoryName}</span>
                            {isSelected && <Check className="size-3.5 text-amber-500 shrink-0" />}
                          </button>
                        );
                      })}
                  </div>
                  <div className="pt-1 border-t border-border/40 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded bg-amber-500 text-white hover:bg-amber-600 cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Business Type</label>
              <select
                disabled={isView}
                value={formData.businessType || "Manufacturing"}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                <option value="Manufacturing">Manufacturing</option>
                <option value="Distributor">Distributor</option>
                <option value="Trader / Indentor">Trader / Indentor</option>
                <option value="Service Provider">Service Provider</option>
                <option value="Contractor">Contractor</option>
              </select>
            </div>

            {/* Country with Auto-derived Local / Foreign Determination */}
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Country</label>
              <select
                disabled={isView}
                value={formData.country || "Bangladesh"}
                onChange={(e) => {
                  const country = e.target.value;
                  const localForeignStatus = country.trim().toLowerCase() === "bangladesh" ? "Local" : "Foreign";
                  setFormData({ ...formData, country, localForeignStatus });
                }}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                {origins.map((o) => (
                  <option key={o.id} value={o.originName}>
                    {o.originName}
                  </option>
                ))}
              </select>
            </div>

            {/* Auto-derived Local / Foreign Status Indicator */}
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Origin Status (Local / Foreign Flag)
              </label>
              <div className="w-full h-9 px-3 rounded-lg border border-border/80 bg-muted/40 flex items-center justify-between text-xs">
                <span
                  className={`font-black uppercase tracking-wider text-[11px] px-2 py-0.5 rounded-full border ${
                    (formData.localForeignStatus || (formData.country?.toLowerCase() === "bangladesh" ? "Local" : "Foreign")) === "Local"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                  }`}
                >
                  {formData.localForeignStatus || (formData.country?.toLowerCase() === "bangladesh" ? "Local" : "Foreign")}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                  <Globe className="size-3 text-muted-foreground" />
                  Auto-determined
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Trade License No</label>
              <input
                type="text"
                disabled={isView}
                value={formData.tradeLicenseNo || ""}
                onChange={(e) => setFormData({ ...formData, tradeLicenseNo: e.target.value })}
                placeholder="e.g. TRAD/DNCC/120934/2024"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">TIN</label>
              <input
                type="text"
                disabled={isView}
                value={formData.tin || ""}
                onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                placeholder="Tax Identification Number"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">BIN / VAT Reg</label>
              <input
                type="text"
                disabled={isView}
                value={formData.bin || ""}
                onChange={(e) => setFormData({ ...formData, bin: e.target.value })}
                placeholder="Business Identification Number"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Status</label>
              <select
                disabled={isView}
                value={formData.status || "Active"}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })
                }
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Create Date</label>
              <input
                type="date"
                disabled={isView}
                value={formData.createDate || ""}
                onChange={(e) => setFormData({ ...formData, createDate: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold mb-1 text-foreground">Full Address</label>
              <textarea
                rows={2}
                disabled={isView}
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Corporate Office, Factory or Warehouse location"
                className="w-full p-2.5 rounded-lg border border-border/80 bg-background text-xs resize-none focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/60">
            <Building className="size-4 text-blue-500" />
            <h2 className="text-sm font-bold text-foreground">Contact Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Contact Person Name
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.contactPersonName || ""}
                onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                placeholder="e.g. Engr. M. A. Hasan"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Designation</label>
              <input
                type="text"
                disabled={isView}
                value={formData.designation || ""}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Head of Commercial / Sales Director"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.mobileNumber || ""}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                placeholder="e.g. +880 1711-XXXXXX"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              {formErrors.mobileNumber && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.mobileNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Email Address</label>
              <input
                type="email"
                disabled={isView}
                value={formData.emailAddress || ""}
                onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                placeholder="commercial@supplier.com"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold mb-1 text-foreground">Website</label>
              <input
                type="text"
                disabled={isView}
                value={formData.website || ""}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.supplier-company.com"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Bank Information */}
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/60">
            <CreditCard className="size-4 text-emerald-500" />
            <h2 className="text-sm font-bold text-foreground">Bank Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Bank Name</label>
              <input
                type="text"
                disabled={isView}
                value={formData.bankName || ""}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="e.g. Eastern Bank PLC"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Branch Name</label>
              <input
                type="text"
                disabled={isView}
                value={formData.branchName || ""}
                onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                placeholder="e.g. Principal Branch, Dhaka"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Account Name</label>
              <input
                type="text"
                disabled={isView}
                value={formData.accountName || ""}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                placeholder="Exact legal corporate account name"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Account Number</label>
              <input
                type="text"
                disabled={isView}
                value={formData.accountNumber || ""}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="e.g. 1011020030405"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Routing Number</label>
              <input
                type="text"
                disabled={isView}
                value={formData.routingNumber || ""}
                onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                placeholder="e.g. 095260123"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">SWIFT Code</label>
              <input
                type="text"
                disabled={isView}
                value={formData.swiftCode || ""}
                onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                placeholder="e.g. EBLBBDDH"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Procurement Terms */}
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/60">
            <FileText className="size-4 text-purple-500" />
            <h2 className="text-sm font-bold text-foreground">Procurement Terms</h2>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 text-foreground">
              Terms & Conditions Short Description
            </label>
            <textarea
              rows={3}
              disabled={isView}
              value={formData.termsConditionsDescription || ""}
              onChange={(e) =>
                setFormData({ ...formData, termsConditionsDescription: e.target.value })
              }
              placeholder="Commercial agreement terms, warranty clauses, inspection standards, payment protocol..."
              className="w-full p-2.5 rounded-lg border border-border/80 bg-background text-xs resize-none focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            {isView ? "Back to Supplier List" : "Cancel"}
          </button>
          {!isView && (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-4" />
              <span>{mode === "create" ? "Save Supplier" : "Update Supplier"}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
