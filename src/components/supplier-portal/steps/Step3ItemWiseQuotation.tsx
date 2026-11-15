import React, { useState, useMemo } from "react";
import {
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Percent,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  Info,
  Search,
  Filter,
  Sparkles,
  Tag,
  Check,
  Edit3,
} from "lucide-react";
import {
  SupplierInvitationRecord,
  ItemQuotationEntry,
  CSItem,
} from "@/lib/supplier-portal/types";
import { calculateItemValues } from "@/lib/supplier-portal/mock-data";
import { toast } from "sonner";

interface Props {
  invitation: SupplierInvitationRecord;
  onUpdateItemQuote?: (itemId: string, entry: ItemQuotationEntry) => void;
  onUpdateItemQuotes?: (itemQuotes: Record<string, ItemQuotationEntry>) => void;
  onNext: () => void;
  onPrev: () => void;
  isReadOnly: boolean;
}

export function Step3ItemWiseQuotation({
  invitation,
  onUpdateItemQuote,
  onUpdateItemQuotes,
  onNext,
  onPrev,
  isReadOnly,
}: Props) {
  const { items, currentQuotation, csInfo } = invitation;
  const itemQuotes = currentQuotation.itemQuotes || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "QUOTED" | "NOT_QUOTED">("ALL");
  const [activeExpandedId, setActiveExpandedId] = useState<string | null>(items[0]?.itemId || null);

  // Helper to dispatch updates cleanly
  const dispatchItemChange = (itemId: string, updatedEntry: ItemQuotationEntry) => {
    if (onUpdateItemQuote) {
      onUpdateItemQuote(itemId, updatedEntry);
    } else if (onUpdateItemQuotes) {
      const merged = { ...itemQuotes, [itemId]: updatedEntry };
      onUpdateItemQuotes(merged);
    }
  };

  // Metrics
  const quotedItems = items.filter(
    (i) => itemQuotes[i.itemId]?.status === "Quoted" && Number(itemQuotes[i.itemId]?.unitPrice) > 0
  );
  const quotedCount = quotedItems.length;
  const notQuotedCount = items.length - quotedCount;

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const entry = itemQuotes[item.itemId];
      const isQuoted = entry?.status === "Quoted";

      if (statusFilter === "QUOTED" && !isQuoted) return false;
      if (statusFilter === "NOT_QUOTED" && isQuoted) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.itemName.toLowerCase().includes(q);
        const matchesCode = item.itemCode.toLowerCase().includes(q);
        const matchesSpec = item.specification.toLowerCase().includes(q);
        return matchesName || matchesCode || matchesSpec;
      }
      return true;
    });
  }, [items, itemQuotes, statusFilter, searchQuery]);

  const handleFieldChange = (
    itemId: string,
    field: keyof ItemQuotationEntry,
    value: string | number
  ) => {
    if (isReadOnly) return;
    const current = itemQuotes[itemId] || {
      itemId,
      status: "Quoted",
      offeredBrand: "",
      offeredOrigin: "",
      unitPrice: 0,
      discountPercent: 0,
      vatPercent: 7.5,
      taxPercent: 3.0,
      deliveryLeadTimeDays: 7,
      warrantyPeriodMonths: 12,
      remarks: "",
    };

    let sanitizedValue = value;
    if (
      field === "unitPrice" ||
      field === "discountPercent" ||
      field === "vatPercent" ||
      field === "taxPercent" ||
      field === "deliveryLeadTimeDays" ||
      field === "warrantyPeriodMonths"
    ) {
      sanitizedValue = Math.max(0, Number(value) || 0);
      if (field === "discountPercent") {
        sanitizedValue = Math.min(100, sanitizedValue);
      }
    }

    const updated: ItemQuotationEntry = {
      ...current,
      [field]: sanitizedValue,
    };

    dispatchItemChange(itemId, updated);
  };

  const handleToggleStatus = (itemId: string, currentStatus: "Quoted" | "Not Quoted") => {
    if (isReadOnly) return;
    const newStatus = currentStatus === "Quoted" ? "Not Quoted" : "Quoted";
    const current = itemQuotes[itemId] || {
      itemId,
      status: "Quoted",
      offeredBrand: "",
      offeredOrigin: "",
      unitPrice: 0,
      discountPercent: 0,
      vatPercent: 7.5,
      taxPercent: 3.0,
      deliveryLeadTimeDays: 7,
      warrantyPeriodMonths: 12,
      remarks: "",
    };

    dispatchItemChange(itemId, {
      ...current,
      status: newStatus,
    });

    toast.info(
      newStatus === "Not Quoted"
        ? "Item marked as Not Quoted (omitted from pricing total)"
        : "Item activated for quoting"
    );
  };

  const handleQuoteAll = () => {
    if (isReadOnly) return;
    const newQuotes: Record<string, ItemQuotationEntry> = { ...itemQuotes };
    items.forEach((item) => {
      const existing = newQuotes[item.itemId] || {
        itemId: item.itemId,
        status: "Quoted",
        offeredBrand: "",
        offeredOrigin: "",
        unitPrice: item.targetPrice || 0,
        discountPercent: 0,
        vatPercent: 7.5,
        taxPercent: 3.0,
        deliveryLeadTimeDays: 14,
        warrantyPeriodMonths: 12,
        remarks: "",
      };
      newQuotes[item.itemId] = {
        ...existing,
        status: "Quoted",
      };
    });

    if (onUpdateItemQuotes) {
      onUpdateItemQuotes(newQuotes);
    } else if (onUpdateItemQuote) {
      items.forEach((item) => onUpdateItemQuote(item.itemId, newQuotes[item.itemId]));
    }
    toast.success("All items set to Quoted status.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-[#4169E1] font-bold text-xs">
                3
              </span>
              <h2 className="text-xl font-black text-[#172554] tracking-tight">
                Item-Wise Quotation Workspace
              </h2>
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              Submit your proposed brand, origin, unit rates, and statutory tax percentages for each item.
              Unquoted items are excluded from the Comparative Statement.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span>{quotedCount} Quoted</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold shadow-2xs">
              <XCircle className="size-3.5 text-slate-400" />
              <span>{notQuotedCount} Not Quoted</span>
            </div>

            {!isReadOnly && notQuotedCount > 0 && (
              <button
                type="button"
                onClick={handleQuoteAll}
                className="h-8 px-3.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#4169E1] text-xs font-bold transition shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="size-3 text-[#4169E1]" />
                Quote All Items
              </button>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="size-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items by code or name..."
              className="w-full text-xs pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4169E1] font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
            <span className="text-[#64748B] text-[11px] font-semibold mr-1">Filter:</span>
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-[#4169E1] text-white shadow-2xs"
                  : "bg-slate-100 text-[#64748B] hover:text-[#172554]"
              }`}
            >
              All ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("QUOTED")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === "QUOTED"
                  ? "bg-[#4169E1] text-white shadow-2xs"
                  : "bg-slate-100 text-[#64748B] hover:text-[#172554]"
              }`}
            >
              Quoted ({quotedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("NOT_QUOTED")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === "NOT_QUOTED"
                  ? "bg-[#4169E1] text-white shadow-2xs"
                  : "bg-slate-100 text-[#64748B] hover:text-[#172554]"
              }`}
            >
              Not Quoted ({notQuotedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Item-wise Quotation Cards List */}
      <div className="space-y-4">
        {filteredItems.map((item, idx) => {
          const entry = itemQuotes[item.itemId] || {
            itemId: item.itemId,
            status: "Not Quoted",
            offeredBrand: "",
            offeredOrigin: "",
            unitPrice: 0,
            discountPercent: 0,
            vatPercent: 7.5,
            taxPercent: 3.0,
            deliveryLeadTimeDays: 7,
            warrantyPeriodMonths: 12,
            remarks: "",
          };

          const isQuoted = entry.status === "Quoted";
          const calcs = calculateItemValues(item, entry);
          const isExpanded = activeExpandedId === item.itemId;

          return (
            <div
              key={item.itemId}
              className={`rounded-2xl border transition-all duration-150 overflow-hidden shadow-xs ${
                isQuoted
                  ? "bg-white border-[#E2E8F0] hover:border-[#4169E1]/50"
                  : "bg-[#F8FAFC] border-[#E2E8F0] opacity-80"
              }`}
            >
              {/* Item Card Header */}
              <div className="p-5 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                <div className="flex items-start gap-3.5">
                  <div className="size-9 rounded-xl bg-[#4169E1] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    #{item.sl || idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-[#172554]">
                        {item.itemName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-[#64748B] font-mono font-bold">
                        {item.itemCode}
                      </span>
                      {item.category && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-[#4169E1] border border-blue-200 font-semibold">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      {item.specification}
                    </p>
                  </div>
                </div>

                {/* Right Header: Required Qty & Quotation Toggle */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                  <div className="text-right px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase block">
                      Required Quantity
                    </span>
                    <span className="text-sm font-extrabold text-[#172554] font-mono">
                      {item.requiredQuantity.toLocaleString()} {item.uom}
                    </span>
                  </div>

                  {/* Toggle Quoted / Not Quoted */}
                  {!isReadOnly ? (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item.itemId, entry.status)}
                      className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                        isQuoted
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                          : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                      }`}
                    >
                      {isQuoted ? (
                        <>
                          <Check className="size-3.5 stroke-[3]" />
                          <span>Quoting Item</span>
                        </>
                      ) : (
                        <span>Not Quoted</span>
                      )}
                    </button>
                  ) : (
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        isQuoted
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {entry.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Input Workspace (Active only when Quoted) */}
              {isQuoted ? (
                <div className="p-5 sm:p-6 bg-white space-y-5">
                  {/* Row 1: Brand, Origin, Unit Price, Discount */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-[#172554] uppercase tracking-wider block mb-1">
                        Offered Brand / Make *
                      </label>
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={entry.offeredBrand}
                        onChange={(e) => handleFieldChange(item.itemId, "offeredBrand", e.target.value)}
                        placeholder="e.g. Dystar, Huntsman..."
                        className="w-full text-xs px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4169E1] font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#172554] uppercase tracking-wider block mb-1">
                        Country of Origin *
                      </label>
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={entry.offeredOrigin}
                        onChange={(e) => handleFieldChange(item.itemId, "offeredOrigin", e.target.value)}
                        placeholder="e.g. Germany, Switzerland..."
                        className="w-full text-xs px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4169E1] font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#172554] uppercase tracking-wider block mb-1">
                        Unit Price ({csInfo.currency}) *
                      </label>
                      <div className="relative">
                        <span className="text-xs text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 font-bold font-mono">
                          {csInfo.currency}
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          disabled={isReadOnly}
                          value={entry.unitPrice || ""}
                          onChange={(e) => handleFieldChange(item.itemId, "unitPrice", e.target.value)}
                          placeholder="0.00"
                          className="w-full text-xs pl-12 pr-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4169E1] font-bold font-mono text-[#172554]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#172554] uppercase tracking-wider block mb-1">
                        Item Discount (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          disabled={isReadOnly}
                          value={entry.discountPercent || ""}
                          onChange={(e) => handleFieldChange(item.itemId, "discountPercent", e.target.value)}
                          placeholder="0.0"
                          className="w-full text-xs px-3 pr-8 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4169E1] font-mono text-[#172554]"
                        />
                        <span className="text-xs text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 font-bold">
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: VAT, TAX, Lead Time, Warranty */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-[#172554] uppercase tracking-wider block mb-1">
                        VAT (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          disabled={isReadOnly}
                          value={entry.vatPercent || ""}
                          onChange={(e) => handleFieldChange(item.itemId, "vatPercent", e.target.value)}
                          placeholder="7.5"
                          className="w-full text-xs px-3 pr-8 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4169E1] font-mono text-[#172554]"
                        />
                        <span className="text-xs text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 font-bold">
                          %
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#172554] uppercase tracking-wider block mb-1">
                        AIT / TAX (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          disabled={isReadOnly}
                          value={entry.taxPercent || ""}
                          onChange={(e) => handleFieldChange(item.itemId, "taxPercent", e.target.value)}
                          placeholder="3.0"
                          className="w-full text-xs px-3 pr-8 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4169E1] font-mono text-[#172554]"
                        />
                        <span className="text-xs text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 font-bold">
                          %
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#172554] uppercase tracking-wider block mb-1">
                        Lead Time (Days)
                      </label>
                      <input
                        type="number"
                        disabled={isReadOnly}
                        value={entry.deliveryLeadTimeDays || ""}
                        onChange={(e) => handleFieldChange(item.itemId, "deliveryLeadTimeDays", e.target.value)}
                        placeholder="14"
                        className="w-full text-xs px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4169E1] font-mono text-[#172554]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#172554] uppercase tracking-wider block mb-1">
                        Warranty (Months)
                      </label>
                      <input
                        type="number"
                        disabled={isReadOnly}
                        value={entry.warrantyPeriodMonths || ""}
                        onChange={(e) => handleFieldChange(item.itemId, "warrantyPeriodMonths", e.target.value)}
                        placeholder="12"
                        className="w-full text-xs px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4169E1] font-mono text-[#172554]"
                      />
                    </div>
                  </div>

                  {/* Remarks input */}
                  <div>
                    <label className="text-[11px] font-bold text-[#172554] uppercase tracking-wider block mb-1">
                      Technical / Supply Remarks
                    </label>
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={entry.remarks}
                      onChange={(e) => handleFieldChange(item.itemId, "remarks", e.target.value)}
                      placeholder="Specify pack size, certification, batch shelf life, or any technical variances..."
                      className="w-full text-xs px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
                    />
                  </div>

                  {/* Reactive Financial Calculation Breakdown Bar */}
                  <div className="pt-4 border-t border-[#E2E8F0] bg-[#F8FAFC] p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-4 text-[#64748B]">
                      <div>
                        <span>Gross: </span>
                        <strong className="text-[#172554]">
                          {csInfo.currency} {calcs.grossAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </strong>
                      </div>
                      <span>•</span>
                      <div>
                        <span>Disc: </span>
                        <strong className="text-emerald-700">
                          - {csInfo.currency} {calcs.discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </strong>
                      </div>
                      <span>•</span>
                      <div>
                        <span>Taxable: </span>
                        <strong className="text-[#172554]">
                          {csInfo.currency} {calcs.taxableAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </strong>
                      </div>
                      <span>•</span>
                      <div>
                        <span>VAT ({entry.vatPercent}%): </span>
                        <strong className="text-[#172554]">
                          + {csInfo.currency} {calcs.vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-[#64748B] block">
                        Final Line Total
                      </span>
                      <span className="text-base font-black text-[#4169E1]">
                        {csInfo.currency} {calcs.finalItemAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 text-center text-xs text-[#64748B] italic">
                  This item is marked as <strong>Not Quoted</strong> and will not be included in your submitted pricing.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#172554] text-xs font-bold transition-all shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          <span>Previous: Supplier Information</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4169E1] hover:bg-[#2347B5] active:bg-[#1E3FA8] text-white text-xs font-bold transition-all shadow-md shadow-[#4169E1]/20 cursor-pointer hover:scale-[1.01]"
        >
          <span>Proceed to Overall Quotation</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
