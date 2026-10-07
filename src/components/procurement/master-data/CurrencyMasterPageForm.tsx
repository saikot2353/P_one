import { useState } from "react";
import { ArrowLeft, Save, Coins, Edit } from "lucide-react";
import { Currency } from "@/lib/procurement-master-data";

interface CurrencyMasterPageFormProps {
  mode: "create" | "edit" | "view";
  initialData?: Currency | null;
  onSave: (data: Currency) => void;
  onCancel: () => void;
  onSwitchToEdit?: () => void;
}

export function CurrencyMasterPageForm({
  mode,
  initialData,
  onSave,
  onCancel,
  onSwitchToEdit,
}: CurrencyMasterPageFormProps) {
  const [formData, setFormData] = useState<Partial<Currency>>(() => {
    if (initialData) return { ...initialData };
    return {
      currencyCode: "",
      currencyName: "",
      symbol: "৳",
      decimalPlaces: 2,
      exchangeRate: 1.0,
      rateDate: new Date().toISOString().split("T")[0],
      baseCurrency: false,
      status: "Active",
    };
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const isView = mode === "view";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    const errors: Record<string, string> = {};
    if (!formData.currencyCode?.trim()) errors.currencyCode = "Currency Code is required";
    if (!formData.currencyName?.trim()) errors.currencyName = "Currency Name is required";
    if (!formData.symbol?.trim()) errors.symbol = "Symbol is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload: Currency = {
      id: initialData?.id || `cur-${Date.now()}`,
      currencyCode: formData.currencyCode?.toUpperCase() || "",
      currencyName: formData.currencyName || "",
      symbol: formData.symbol || "$",
      decimalPlaces: Number(formData.decimalPlaces) || 2,
      exchangeRate: Number(formData.exchangeRate) || 1.0,
      rateDate: formData.rateDate || new Date().toISOString().split("T")[0],
      baseCurrency: !!formData.baseCurrency,
      status: (formData.status as any) || "Active",
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
            title="Back to Currency List"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Master Data / Currency Master
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
                {mode === "create" ? "New Currency" : mode === "edit" ? "Edit Mode" : "Read-Only View"}
              </span>
            </div>
            <h1 className="text-xl font-black text-foreground tracking-tight mt-0.5">
              {mode === "create"
                ? "Add Currency"
                : mode === "edit"
                  ? `Edit Currency — ${formData.currencyCode}`
                  : `Currency Details — ${formData.currencyCode}`}
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
              <span>Edit Currency</span>
            </button>
          ) : !isView ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>{mode === "create" ? "Save Currency" : "Update Currency"}</span>
            </button>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="bg-card rounded-2xl border border-border/70 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/60">
            <Coins className="size-4 text-amber-500" />
            <h2 className="text-sm font-bold text-foreground">Currency Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Currency Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isView}
                maxLength={4}
                value={formData.currencyCode || ""}
                onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value.toUpperCase() })}
                placeholder="e.g. BDT, USD, EUR"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold uppercase focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              {formErrors.currencyCode && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.currencyCode}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Currency Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.currencyName || ""}
                onChange={(e) => setFormData({ ...formData, currencyName: e.target.value })}
                placeholder="e.g. Bangladeshi Taka, US Dollar"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              {formErrors.currencyName && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.currencyName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">
                Symbol <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isView}
                value={formData.symbol || ""}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                placeholder="e.g. ৳, $, €, £, ¥"
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-bold text-amber-600 dark:text-amber-400 focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
              {formErrors.symbol && (
                <p className="text-[10px] text-rose-500 mt-1">{formErrors.symbol}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Exchange Rate (to BDT)</label>
              <input
                type="number"
                step="0.0001"
                disabled={isView}
                value={formData.exchangeRate ?? 1}
                onChange={(e) => setFormData({ ...formData, exchangeRate: Number(e.target.value) })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-mono font-bold focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Rate Date</label>
              <input
                type="date"
                disabled={isView}
                value={formData.rateDate || ""}
                onChange={(e) => setFormData({ ...formData, rateDate: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-foreground">Status</label>
              <select
                disabled={isView}
                value={formData.status || "Active"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-xs font-medium focus:border-amber-500 outline-none disabled:bg-muted/50 disabled:text-foreground"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-bold transition cursor-pointer"
          >
            {isView ? "Back to Currency List" : "Cancel"}
          </button>
          {!isView && (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Save className="size-4" />
              <span>{mode === "create" ? "Save Currency" : "Update Currency"}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
