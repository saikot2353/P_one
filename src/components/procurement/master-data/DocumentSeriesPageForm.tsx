import { useState, useMemo } from "react";
import { ArrowLeft, Save, Hash, Search, Edit } from "lucide-react";
import {
  DocumentNumberSeries,
  DocumentDateFormat,
  AVAILABLE_DOCUMENT_TYPES,
  formatDocumentNumber,
} from "@/lib/procurement-master-data";

interface DocumentSeriesPageFormProps {
  mode: "create" | "edit" | "view";
  initialData?: DocumentNumberSeries | null;
  companyList?: string[];
  onSave: (data: DocumentNumberSeries) => void;
  onCancel: () => void;
  onSwitchToEdit?: () => void;
}

const DATE_FORMAT_OPTIONS: Array<{ value: DocumentDateFormat; label: string; example: string }> = [
  { value: "None", label: "None (Standard: PR-00001)", example: "PR-00001" },
  { value: "Month + Year", label: "Month + Year (PR-260900001)", example: "PR-260900001" },
  { value: "Year + Month", label: "Year + Month (PR-2609-00001)", example: "PR-2609-00001" },
  { value: "Year-Month", label: "Year-Month (PR-26-09-00001)", example: "PR-26-09-00001" },
  { value: "Year", label: "Year (PR-26-00001)", example: "PR-26-00001" },
  { value: "Month", label: "Month (PR-09-00001)", example: "PR-09-00001" },
  { value: "Year + Number", label: "Year + Number (PR-2600001)", example: "PR-2600001" },
  { value: "Month + Number", label: "Month + Number (PR-0900001)", example: "PR-0900001" },
];

export function DocumentSeriesPageForm({
  mode,
  initialData,
  companyList = [
    "Pakiza Knit Composite Ltd",
    "Pakiza Apparels Ltd",
    "Pakiza Spinning Mills Ltd",
    "Pakiza Dyeing & Printing Industries Ltd",
    "Pakiza Textiles Ltd",
  ],
  onSave,
  onCancel,
  onSwitchToEdit,
}: DocumentSeriesPageFormProps) {
  const [formData, setFormData] = useState<Partial<DocumentNumberSeries>>(() => {
    if (initialData) return { ...initialData };
    return {
      company: companyList[0] || "Pakiza Knit Composite Ltd",
      documentType: AVAILABLE_DOCUMENT_TYPES[0].label,
      numberingMethod: "Auto",
      prefix: AVAILABLE_DOCUMENT_TYPES[0].defaultPrefix,
      separator: "-",
      dateFormat: "None",
      resetFrequency: "Yearly",
      startingNumber: 1,
      numberLength: 5,
      status: "Active",
    };
  });

  const [docSearchQuery, setDocSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const isView = mode === "view";

  const filteredDocTypes = useMemo(() => {
    if (!docSearchQuery) return AVAILABLE_DOCUMENT_TYPES;
    return AVAILABLE_DOCUMENT_TYPES.filter((dt) =>
      dt.label.toLowerCase().includes(docSearchQuery.toLowerCase()),
    );
  }, [docSearchQuery]);

  const handleSelectDocType = (doc: { value: string; label: string; defaultPrefix: string }) => {
    setFormData((prev) => ({
      ...prev,
      documentType: doc.label,
      prefix: prev.prefix || doc.defaultPrefix,
    }));
    setIsDropdownOpen(false);
    setDocSearchQuery("");
  };

  const previewFormattedNumber = useMemo(() => {
    const series: DocumentNumberSeries = {
      id: "preview",
      company: formData.company || companyList[0] || "",
      documentType: formData.documentType || "PR",
      numberingMethod: "Auto",
      prefix: formData.prefix || "PR",
      separator: formData.separator || "-",
      dateFormat: (formData.dateFormat as any) || "None",
      resetFrequency: (formData.resetFrequency as any) || "Yearly",
      startingNumber: Number(formData.startingNumber) || 1,
      numberLength: Number(formData.numberLength) || 5,
      status: "Active",
    };
    return formatDocumentNumber(series, Number(formData.startingNumber) || 1);
  }, [formData, companyList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    const errors: Record<string, string> = {};
    if (!formData.company?.trim()) errors.company = "Company is required";
    if (!formData.documentType?.trim()) errors.documentType = "Document Type is required";
    if (!formData.prefix?.trim()) errors.prefix = "Prefix is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload: DocumentNumberSeries = {
      id: initialData?.id || `num-${Date.now()}`,
      company: formData.company || companyList[0] || "",
      documentType: formData.documentType || "",
      numberingMethod: "Auto",
      prefix: formData.prefix || "",
      separator: (formData.separator as any) || "-",
      dateFormat: (formData.dateFormat as any) || "None",
      resetFrequency: (formData.resetFrequency as any) || "Yearly",
      startingNumber: Number(formData.startingNumber) || 1,
      numberLength: Number(formData.numberLength) || 5,
      status: (formData.status as any) || "Active",
      currentNumber: initialData?.currentNumber ?? (Number(formData.startingNumber) || 1),
    };

    onSave(payload);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground transition shadow-2xs cursor-pointer"
            title="Back to Document Series List"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Master Data / Document Type Series
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
                {mode === "create" ? "New Series" : mode === "edit" ? "Edit Mode" : "Read-Only View"}
              </span>
            </div>
            <h1 className="text-xl font-black text-foreground tracking-tight mt-0.5">
              {mode === "create"
                ? "Configure Document Number Series"
                : mode === "edit"
                  ? `Edit Series — ${formData.documentType}`
                  : `Series Details — ${formData.documentType}`}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            {isView ? "Back to Series List" : "Cancel"}
          </button>
          {isView && onSwitchToEdit ? (
            <button
              type="button"
              onClick={onSwitchToEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Edit className="size-3.5" />
              <span>Edit Configuration</span>
            </button>
          ) : !isView ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>{mode === "create" ? "Save Configuration" : "Update Configuration"}</span>
            </button>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/60">
            <Hash className="size-4 text-amber-500" />
            <h2 className="text-sm font-bold text-foreground">Series Configuration Rules</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Added Field: Company (Company-wise numbering) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold mb-1 text-foreground">
                Company <span className="text-rose-500">*</span>
              </label>
              <select
                disabled={isView}
                value={formData.company || companyList[0] || ""}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                {companyList.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Each company maintains its own distinct sequence counter
              </span>
            </div>

            {/* Document Type with Searchable Dropdown */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold mb-1 text-foreground">
                Document Type <span className="text-rose-500">*</span>
              </label>
              {isView ? (
                <div className="w-full h-9 px-3 rounded-lg border border-border/80 bg-muted/40 text-xs font-medium flex items-center">
                  {formData.documentType}
                </div>
              ) : (
                <div className="relative">
                  <div
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium flex items-center justify-between cursor-pointer focus:border-amber-500"
                  >
                    <span className="truncate">{formData.documentType || "-- Select Document --"}</span>
                    <Search className="size-3.5 text-muted-foreground" />
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute left-0 right-0 top-10 z-50 bg-popover border border-border rounded-xl shadow-xl p-2 space-y-1.5 max-h-60 overflow-y-auto">
                      <div className="relative">
                        <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={docSearchQuery}
                          onChange={(e) => setDocSearchQuery(e.target.value)}
                          placeholder="Search form / document name..."
                          className="w-full pl-8 pr-3 h-7.5 rounded-lg border border-border bg-background text-xs outline-none focus:border-amber-500"
                          autoFocus
                        />
                      </div>
                      <div className="divide-y divide-border/40">
                        {filteredDocTypes.map((dt) => (
                          <div
                            key={dt.value}
                            onClick={() => handleSelectDocType(dt)}
                            className="p-2 hover:bg-muted/80 rounded-lg text-xs cursor-pointer flex items-center justify-between"
                          >
                            <span className="font-semibold text-foreground">{dt.label}</span>
                            <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {dt.defaultPrefix}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {formErrors.documentType && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.documentType}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Numbering Method
              </label>
              <div className="w-full h-9 px-3 rounded-lg border border-border/80 bg-muted/40 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center">
                Auto (System Generated)
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Prefix <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.prefix || ""}
                onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                placeholder="e.g. PR, PO, RFQ"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              {formErrors.prefix && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.prefix}</p>
              )}
            </div>

            {/* Added Field: Date Format */}
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Date Format <span className="text-rose-500">*</span>
              </label>
              <select
                disabled={isView}
                value={formData.dateFormat || "None"}
                onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                {DATE_FORMAT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Separator</label>
              <select
                disabled={isView}
                value={formData.separator || "-"}
                onChange={(e) => setFormData({ ...formData, separator: e.target.value as any })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                <option value="/">Slash ( / )</option>
                <option value="-">Hyphen ( - )</option>
                <option value=".">Dot ( . )</option>
                <option value="None">None</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Reset Frequency
              </label>
              <select
                disabled={isView}
                value={formData.resetFrequency || "Yearly"}
                onChange={(e) =>
                  setFormData({ ...formData, resetFrequency: e.target.value as any })
                }
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                <option value="Never">Never</option>
                <option value="Yearly">Yearly</option>
                <option value="Monthly">Monthly</option>
                <option value="Daily">Daily</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Starting Number
              </label>
              <input
                type="number"
                disabled={isView}
                value={formData.startingNumber ?? 1}
                onChange={(e) =>
                  setFormData({ ...formData, startingNumber: Number(e.target.value) })
                }
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Number Length</label>
              <input
                type="number"
                disabled={isView}
                min={3}
                max={12}
                value={formData.numberLength ?? 5}
                onChange={(e) =>
                  setFormData({ ...formData, numberLength: Number(e.target.value) })
                }
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
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
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
              Live Generated Document Number Preview
            </div>
            <div className="text-2xl font-black font-mono text-foreground mt-1 tracking-tight">
              {previewFormattedNumber}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Company: <span className="font-semibold text-foreground">{formData.company}</span> • Date Format:{" "}
              <span className="font-semibold text-foreground">{formData.dateFormat || "None"}</span> • Separator:{" "}
              <span className="font-semibold text-foreground">
                {formData.separator === "None" ? "None" : formData.separator || "-"}
              </span>{" "}
              • Length: {formData.numberLength || 5} digits
            </p>
          </div>

          <div className="p-3 bg-card rounded-xl border border-border/70 text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              Sample Output
            </span>
            <span className="font-mono text-xs font-black text-amber-600 dark:text-amber-400">
              {previewFormattedNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            {isView ? "Back to Series List" : "Cancel"}
          </button>
          {!isView && (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-4" />
              <span>{mode === "create" ? "Save Configuration" : "Update Configuration"}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
