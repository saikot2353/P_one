// src/components/inventory/TransferBatchLocationModals.tsx
// Dedicated Batch Allocation (B) & Location Allocation (L) Modals
// Exclusively for Stock Transfer Entry (Inter-Company & Intra-Company)

import React, { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  Layers,
  Plus,
  Trash2,
  X,
  Building2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { StoreLocation } from "@/lib/procurement-master-data";
import {
  getLocationsForStore,
  getBatchesForStore,
} from "@/lib/item-tracking-utils";

export interface TransferLocationEntry {
  sourceLocationName: string;
  destinationLocationName: string;
  locationName: string;
  quantity: number;
  fromWarehouse: string;
  fromStore: string;
  toWarehouse: string;
  toStore: string;
}

export interface TransferBatchEntry {
  sourceBatchNumber: string;
  destinationBatchNumber: string;
  batchNumber: string;
  quantity: number;
  fromWarehouse: string;
  fromStore: string;
  toWarehouse: string;
  toStore: string;
  createDate?: string;
  expiryDate?: string;
}

export interface StoreOption {
  id: string;
  name?: string;
  storeName?: string;
  storeCode?: string;
  organization?: string;
}

// -------------------------------------------------------------
// 1. TRANSFER LOCATION ALLOCATION MODAL (L)
// -------------------------------------------------------------

interface TransferLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemCode: string;
  transactionQty: number;
  uom?: string;
  transferType?: "Inter-Company" | "Intra-Company";
  sourceStore: string;
  availableSourceStores?: StoreOption[];
  defaultDestinationStore: string;
  availableDestinationStores: StoreOption[];
  initialEntries?: Array<{
    sourceLocationName?: string;
    destinationLocationName?: string;
    locationName?: string;
    quantity?: number;
    fromWarehouse?: string;
    fromStore?: string;
    toWarehouse?: string;
    toStore?: string;
  }>;
  onSave: (entries: TransferLocationEntry[]) => void;
  readOnly?: boolean;
}

export function TransferLocationAllocationModal({
  isOpen,
  onClose,
  itemName,
  itemCode,
  transactionQty,
  uom = "PCS",
  transferType = "Intra-Company",
  sourceStore,
  availableSourceStores,
  defaultDestinationStore,
  availableDestinationStores,
  initialEntries,
  onSave,
  readOnly = false,
}: TransferLocationModalProps) {
  const effectiveQty = transactionQty ?? 0;
  const isIntra = transferType === "Intra-Company";

  const fromStoreOptions =
    availableSourceStores && availableSourceStores.length > 0
      ? availableSourceStores
      : availableDestinationStores;
  const toStoreOptions =
    availableDestinationStores && availableDestinationStores.length > 0
      ? availableDestinationStores
      : availableSourceStores || [];

  const [selectedFromStore, setSelectedFromStore] = useState<string>(() => {
    return (
      initialEntries?.[0]?.fromStore ||
      sourceStore ||
      fromStoreOptions[0]?.storeName ||
      fromStoreOptions[0]?.name ||
      ""
    );
  });

  const [selectedToStore, setSelectedToStore] = useState<string>(() => {
    return (
      initialEntries?.[0]?.toStore ||
      defaultDestinationStore ||
      toStoreOptions[0]?.storeName ||
      toStoreOptions[0]?.name ||
      ""
    );
  });

  const [entries, setEntries] = useState<TransferLocationEntry[]>([]);

  // Load locations dynamically per selected warehouse
  const sourceLocations = useMemo(() => {
    const list = getLocationsForStore(selectedFromStore);
    if (list.length > 0) return list;
    return [
      { id: "sloc-1", locationName: "Rack A-01 (Primary Staging)", locationType: "Rack" },
      { id: "sloc-2", locationName: "Shelf B-02 (Bulk Raw Area)", locationType: "Shelf" },
      { id: "sloc-3", locationName: "Bin C-01 (Dispatch Bin)", locationType: "Bin" },
    ] as StoreLocation[];
  }, [selectedFromStore]);

  const destinationLocations = useMemo(() => {
    const list = getLocationsForStore(selectedToStore);
    if (list.length > 0) return list;
    return [
      { id: "dloc-1", locationName: "Rack D-01 (Inward Receiving)", locationType: "Rack" },
      { id: "dloc-2", locationName: "Shelf E-01 (Transit Bin)", locationType: "Shelf" },
      { id: "dloc-3", locationName: "Floor Area F-01 (Inspection Bay)", locationType: "Floor" },
    ] as StoreLocation[];
  }, [selectedToStore]);

  useEffect(() => {
    if (isOpen) {
      const src =
        initialEntries?.[0]?.fromStore ||
        sourceStore ||
        fromStoreOptions[0]?.storeName ||
        fromStoreOptions[0]?.name ||
        "";
      const dest =
        initialEntries?.[0]?.toStore ||
        defaultDestinationStore ||
        toStoreOptions.find((s) => (s.storeName || s.name) !== src)?.storeName ||
        toStoreOptions[0]?.storeName ||
        toStoreOptions[0]?.name ||
        "";

      setSelectedFromStore(src);
      setSelectedToStore(dest);

      const srcLocs = getLocationsForStore(src);
      const dstLocs = getLocationsForStore(dest);
      const defSrc = srcLocs[0]?.locationName || "Rack A-01 (Primary Staging)";
      const defDst = dstLocs[0]?.locationName || "Rack D-01 (Inward Receiving)";

      if (initialEntries && initialEntries.length > 0) {
        setEntries(
          initialEntries.map((e, idx) => {
            const rowSrc =
              e.sourceLocationName ||
              (isIntra ? "" : e.locationName) ||
              srcLocs[idx % (srcLocs.length || 1)]?.locationName ||
              defSrc;
            const rowDst =
              e.destinationLocationName ||
              (isIntra ? e.locationName : "") ||
              dstLocs[idx % (dstLocs.length || 1)]?.locationName ||
              defDst;
            return {
              sourceLocationName: rowSrc,
              destinationLocationName: isIntra ? rowDst : "",
              locationName: isIntra ? rowDst : rowSrc,
              quantity: e.quantity || 0,
              fromWarehouse: e.fromWarehouse || e.fromStore || src,
              fromStore: e.fromStore || e.fromWarehouse || src,
              toWarehouse: isIntra ? e.toWarehouse || e.toStore || dest : "",
              toStore: isIntra ? e.toStore || e.toWarehouse || dest : "",
            };
          })
        );
      } else {
        setEntries([
          {
            sourceLocationName: defSrc,
            destinationLocationName: isIntra ? defDst : "",
            locationName: isIntra ? defDst : defSrc,
            quantity: effectiveQty,
            fromWarehouse: src,
            fromStore: src,
            toWarehouse: isIntra ? dest : "",
            toStore: isIntra ? dest : "",
          },
        ]);
      }
    }
  }, [isOpen, isIntra, sourceStore, defaultDestinationStore, fromStoreOptions, toStoreOptions, initialEntries, effectiveQty]);

  if (!isOpen) return null;

  const totalAssigned = entries.reduce((sum, e) => sum + (Number(e.quantity) || 0), 0);
  const isExceeded = totalAssigned > effectiveQty;
  const remainingQty = Math.max(0, effectiveQty - totalAssigned);

  const handleFromStoreChange = (newStore: string) => {
    setSelectedFromStore(newStore);
    const newLocs = getLocationsForStore(newStore);
    const defSrc = newLocs[0]?.locationName || "Rack A-01 (Primary Staging)";
    setEntries((prev) =>
      prev.map((item, idx) => ({
        ...item,
        fromWarehouse: newStore,
        fromStore: newStore,
        sourceLocationName: newLocs[idx % (newLocs.length || 1)]?.locationName || defSrc,
        locationName: isIntra ? item.destinationLocationName : newLocs[idx % (newLocs.length || 1)]?.locationName || defSrc,
      }))
    );
  };

  const handleToStoreChange = (newStore: string) => {
    setSelectedToStore(newStore);
    const newLocs = getLocationsForStore(newStore);
    const defDst = newLocs[0]?.locationName || "Rack D-01 (Inward Receiving)";
    setEntries((prev) =>
      prev.map((item, idx) => ({
        ...item,
        toWarehouse: newStore,
        toStore: newStore,
        destinationLocationName: newLocs[idx % (newLocs.length || 1)]?.locationName || defDst,
        locationName: newLocs[idx % (newLocs.length || 1)]?.locationName || defDst,
      }))
    );
  };

  const handleSourceLocationChangeForRow = (index: number, locName: string) => {
    setEntries((prev) =>
      prev.map((e, idx) =>
        idx === index
          ? {
              ...e,
              sourceLocationName: locName,
              locationName: isIntra ? e.destinationLocationName : locName,
            }
          : e
      )
    );
  };

  const handleDestLocationChangeForRow = (index: number, locName: string) => {
    setEntries((prev) =>
      prev.map((e, idx) =>
        idx === index
          ? {
              ...e,
              destinationLocationName: locName,
              locationName: locName,
            }
          : e
      )
    );
  };

  const handleQuantityChangeForRow = (index: number, qtyStr: string) => {
    const qty = Math.max(0, parseFloat(qtyStr) || 0);
    setEntries((prev) =>
      prev.map((e, idx) => (idx === index ? { ...e, quantity: qty } : e))
    );
  };

  const handleAddRow = () => {
    const unpickedSrc = sourceLocations.find(
      (l) => !entries.some((e) => e.sourceLocationName === l.locationName)
    );
    const nextSrc =
      unpickedSrc?.locationName ||
      sourceLocations[entries.length % (sourceLocations.length || 1)]?.locationName ||
      "Rack A-01";

    const unpickedDst = destinationLocations.find(
      (l) => !entries.some((e) => e.destinationLocationName === l.locationName)
    );
    const nextDst =
      unpickedDst?.locationName ||
      destinationLocations[entries.length % (destinationLocations.length || 1)]?.locationName ||
      "Rack D-01";

    setEntries((prev) => [
      ...prev,
      {
        sourceLocationName: nextSrc,
        destinationLocationName: isIntra ? nextDst : "",
        locationName: isIntra ? nextDst : nextSrc,
        quantity: remainingQty,
        fromWarehouse: selectedFromStore,
        fromStore: selectedFromStore,
        toWarehouse: isIntra ? selectedToStore : "",
        toStore: isIntra ? selectedToStore : "",
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    if (entries.length === 1) {
      toast.error("At least one location allocation is required.");
      return;
    }
    setEntries((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleConfirm = () => {
    if (entries.length === 0) {
      toast.error("Please add at least one location allocation.");
      return;
    }

    if (totalAssigned <= 0) {
      toast.error("Allocated quantity must be greater than zero.");
      return;
    }

    if (isExceeded) {
      toast.error(
        `Total allocated quantity (${totalAssigned} ${uom}) cannot exceed transfer quantity (${effectiveQty} ${uom}).`
      );
      return;
    }

    if (isIntra) {
      const hasInvalid = entries.some(
        (e) => !e.sourceLocationName.trim() || !e.destinationLocationName.trim()
      );
      if (hasInvalid) {
        toast.error("Please select a valid source and destination location for all rows.");
        return;
      }

      onSave(
        entries.map((e) => ({
          ...e,
          locationName: e.destinationLocationName,
          fromWarehouse: selectedFromStore,
          fromStore: selectedFromStore,
          toWarehouse: selectedToStore,
          toStore: selectedToStore,
        }))
      );
    } else {
      const hasInvalid = entries.some(
        (e) => !(e.sourceLocationName || e.locationName || "").trim()
      );
      if (hasInvalid) {
        toast.error("Please select a valid source location for all rows.");
        return;
      }

      onSave(
        entries.map((e) => {
          const lName = e.sourceLocationName || e.locationName;
          return {
            ...e,
            sourceLocationName: lName,
            destinationLocationName: "",
            locationName: lName,
            fromWarehouse: selectedFromStore,
            fromStore: selectedFromStore,
            toWarehouse: "",
            toStore: "",
          };
        })
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <MapPin className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">
                  Location Allocation (Stock Transfer)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  {isIntra ? "Intra-Company Allocation" : "Multi-Company Allocation"}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Transfer Info Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">
              Item Details
            </span>
            <span className="font-bold text-slate-800">
              <span className="font-mono text-emerald-600 mr-1.5">{itemCode}</span>
              {itemName}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {!isIntra && (
              <div className="text-right">
                <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">
                  Source Store
                </span>
                <span className="font-semibold text-slate-700">{sourceStore}</span>
              </div>
            )}
            <div className="text-right">
              <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">
                Total Transfer Qty
              </span>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                {effectiveQty.toLocaleString()} {uom}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* 1. Warehouse / Store Selection Section (Only for Intra-Company Transfer) */}
          {isIntra && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Transfer Route & Warehouse Selection
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {/* From Warehouse / Store */}
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    From Warehouse / Store *
                  </label>
                  <select
                    disabled={readOnly}
                    value={selectedFromStore}
                    onChange={(e) => handleFromStoreChange(e.target.value)}
                    className="w-full h-8.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {fromStoreOptions.map((w) => {
                      const sName = w.storeName || w.name || "";
                      return (
                        <option key={w.id} value={sName}>
                          {sName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* To Warehouse / Store */}
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    To Warehouse / Store *
                  </label>
                  <select
                    disabled={readOnly}
                    value={selectedToStore}
                    onChange={(e) => handleToStoreChange(e.target.value)}
                    className="w-full h-8.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {toStoreOptions.map((w) => {
                      const sName = w.storeName || w.name || "";
                      return (
                        <option key={w.id} value={sName}>
                          {sName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 2. Allocation Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">SL</th>
                  {isIntra ? (
                    <>
                      <th className="py-2.5 px-3">Source Location *</th>
                      <th className="py-2.5 px-3">Destination Location *</th>
                    </>
                  ) : (
                    <th className="py-2.5 px-3">Location *</th>
                  )}
                  <th className="py-2.5 px-3 text-right w-36">Transfer Qty *</th>
                  {!readOnly && <th className="py-2.5 px-2 w-10 text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 text-center font-mono text-slate-400 font-bold">
                      {idx + 1}
                    </td>

                    {/* Source Location */}
                    <td className="py-2.5 px-3">
                      {readOnly ? (
                        <span className="font-medium text-slate-700">
                          {entry.sourceLocationName}
                        </span>
                      ) : (
                        <select
                          value={entry.sourceLocationName}
                          onChange={(e) => handleSourceLocationChangeForRow(idx, e.target.value)}
                          className="w-full h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
                        >
                          {sourceLocations.map((loc) => (
                            <option key={loc.id} value={loc.locationName}>
                              {loc.locationName} ({loc.locationType || "Bin"})
                            </option>
                          ))}
                          {!sourceLocations.some((l) => l.locationName === entry.sourceLocationName) && (
                            <option value={entry.sourceLocationName}>{entry.sourceLocationName}</option>
                          )}
                        </select>
                      )}
                    </td>

                    {/* Destination Location (Only for Intra-Company) */}
                    {isIntra && (
                      <td className="py-2.5 px-3">
                        {readOnly ? (
                          <span className="font-medium text-slate-700">
                            {entry.destinationLocationName}
                          </span>
                        ) : (
                          <select
                            value={entry.destinationLocationName}
                            onChange={(e) => handleDestLocationChangeForRow(idx, e.target.value)}
                            className="w-full h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
                          >
                            {destinationLocations.map((loc) => (
                              <option key={loc.id} value={loc.locationName}>
                                {loc.locationName} ({loc.locationType || "Bin"})
                              </option>
                            ))}
                            {!destinationLocations.some(
                              (l) => l.locationName === entry.destinationLocationName
                            ) && (
                              <option value={entry.destinationLocationName}>
                                {entry.destinationLocationName}
                              </option>
                            )}
                          </select>
                        )}
                      </td>
                    )}

                    {/* Transfer Qty */}
                    <td className="py-2.5 px-3 text-right">
                      {readOnly ? (
                        <span className="font-mono font-bold text-slate-800">
                          {entry.quantity.toLocaleString()} {uom}
                        </span>
                      ) : (
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={entry.quantity === 0 ? "" : entry.quantity}
                          onChange={(e) => handleQuantityChangeForRow(idx, e.target.value)}
                          placeholder="0"
                          className="w-full h-8 px-2.5 text-right font-mono font-bold text-xs rounded-lg border border-slate-200 bg-white text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      )}
                    </td>

                    {/* Action */}
                    {!readOnly && (
                      <td className="py-2.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(idx)}
                          disabled={entries.length === 1}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Remove Row"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Row Button */}
          {!readOnly && (
            <button
              type="button"
              onClick={handleAddRow}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>+ Add Allocation Row</span>
            </button>
          )}

          {/* Validation Warnings */}
          {isExceeded && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 text-rose-600 shrink-0" />
              <span>
                <strong>Allocation Exceeded:</strong> Total allocated quantity ({totalAssigned}{" "}
                {uom}) exceeds the transfer quantity ({effectiveQty} {uom}) by{" "}
                {(totalAssigned - effectiveQty).toFixed(2)} {uom}.
              </span>
            </div>
          )}

          {!isExceeded && remainingQty > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 text-amber-600 shrink-0" />
              <span>
                <strong>Partially Allocated:</strong> {remainingQty.toFixed(2)} {uom} remaining to be
                allocated to reach the transfer quantity.
              </span>
            </div>
          )}
        </div>

        {/* Footer Summary & Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-500 font-medium">Total Allocated: </span>
              <span
                className={`font-mono font-bold text-sm ${
                  isExceeded ? "text-rose-600" : "text-emerald-700"
                }`}
              >
                {totalAssigned.toLocaleString()} / {effectiveQty.toLocaleString()} {uom}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Remaining: </span>
              <span className="font-mono font-bold text-slate-700">
                {remainingQty.toLocaleString()} {uom}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            {!readOnly && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isExceeded || totalAssigned <= 0}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold transition shadow-sm disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="size-4" />
                <span>Confirm Location Allocation</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. TRANSFER BATCH ALLOCATION MODAL (B)
// -------------------------------------------------------------

interface TransferBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemCode: string;
  transactionQty: number;
  uom?: string;
  transferType?: "Inter-Company" | "Intra-Company";
  sourceStore: string;
  availableSourceStores?: StoreOption[];
  defaultDestinationStore: string;
  availableDestinationStores: StoreOption[];
  initialEntries?: Array<{
    sourceBatchNumber?: string;
    destinationBatchNumber?: string;
    batchNumber?: string;
    quantity?: number;
    fromWarehouse?: string;
    fromStore?: string;
    toWarehouse?: string;
    toStore?: string;
    createDate?: string;
    expiryDate?: string;
  }>;
  onSave: (entries: TransferBatchEntry[]) => void;
  readOnly?: boolean;
}

export function TransferBatchAllocationModal({
  isOpen,
  onClose,
  itemName,
  itemCode,
  transactionQty,
  uom = "PCS",
  transferType = "Intra-Company",
  sourceStore,
  availableSourceStores,
  defaultDestinationStore,
  availableDestinationStores,
  initialEntries,
  onSave,
  readOnly = false,
}: TransferBatchModalProps) {
  const effectiveQty = transactionQty ?? 0;
  const isIntra = transferType === "Intra-Company";

  const fromStoreOptions =
    availableSourceStores && availableSourceStores.length > 0
      ? availableSourceStores
      : availableDestinationStores;
  const toStoreOptions =
    availableDestinationStores && availableDestinationStores.length > 0
      ? availableDestinationStores
      : availableSourceStores || [];

  const [selectedFromStore, setSelectedFromStore] = useState<string>(() => {
    return (
      initialEntries?.[0]?.fromStore ||
      sourceStore ||
      fromStoreOptions[0]?.storeName ||
      fromStoreOptions[0]?.name ||
      ""
    );
  });

  const [selectedToStore, setSelectedToStore] = useState<string>(() => {
    return (
      initialEntries?.[0]?.toStore ||
      defaultDestinationStore ||
      toStoreOptions[0]?.storeName ||
      toStoreOptions[0]?.name ||
      ""
    );
  });

  const [entries, setEntries] = useState<TransferBatchEntry[]>([]);

  // Available batches dynamically per selected warehouse
  const sourceBatches = useMemo(() => {
    const list = getBatchesForStore(selectedFromStore, itemCode);
    if (list.length > 0) return list;
    return [
      {
        id: "sbat-1",
        batchNumbering: `BAT-${itemCode.slice(-4)}-SRC-01`,
        expireDate: `${new Date().getFullYear() + 1}-12-31`,
      },
      {
        id: "sbat-2",
        batchNumbering: `BAT-${itemCode.slice(-4)}-SRC-02`,
        expireDate: `${new Date().getFullYear() + 2}-06-30`,
      },
    ] as StoreLocation[];
  }, [selectedFromStore, itemCode]);

  const destinationBatches = useMemo(() => {
    const list = getBatchesForStore(selectedToStore, itemCode);
    if (list.length > 0) return list;
    return [
      {
        id: "dbat-1",
        batchNumbering: `BAT-${itemCode.slice(-4)}-DST-01`,
        expireDate: `${new Date().getFullYear() + 1}-12-31`,
      },
      {
        id: "dbat-2",
        batchNumbering: `BAT-${itemCode.slice(-4)}-DST-02`,
        expireDate: `${new Date().getFullYear() + 2}-06-30`,
      },
    ] as StoreLocation[];
  }, [selectedToStore, itemCode]);

  useEffect(() => {
    if (isOpen) {
      const src =
        initialEntries?.[0]?.fromStore ||
        sourceStore ||
        fromStoreOptions[0]?.storeName ||
        fromStoreOptions[0]?.name ||
        "";
      const dest =
        initialEntries?.[0]?.toStore ||
        defaultDestinationStore ||
        toStoreOptions.find((s) => (s.storeName || s.name) !== src)?.storeName ||
        toStoreOptions[0]?.storeName ||
        toStoreOptions[0]?.name ||
        "";

      setSelectedFromStore(src);
      setSelectedToStore(dest);

      const srcBatches = getBatchesForStore(src, itemCode);
      const dstBatches = getBatchesForStore(dest, itemCode);
      const defSrc = srcBatches[0]?.batchNumbering || `BAT-${itemCode.slice(-4)}-SRC-01`;
      const defDst = dstBatches[0]?.batchNumbering || `BAT-${itemCode.slice(-4)}-DST-01`;

      if (initialEntries && initialEntries.length > 0) {
        setEntries(
          initialEntries.map((e, idx) => {
            const rowSrc =
              e.sourceBatchNumber ||
              (isIntra ? "" : e.batchNumber) ||
              srcBatches[idx % (srcBatches.length || 1)]?.batchNumbering ||
              defSrc;
            const rowDst =
              e.destinationBatchNumber ||
              (isIntra ? e.batchNumber : "") ||
              dstBatches[idx % (dstBatches.length || 1)]?.batchNumbering ||
              defDst;
            return {
              sourceBatchNumber: rowSrc,
              destinationBatchNumber: isIntra ? rowDst : "",
              batchNumber: isIntra ? rowDst : rowSrc,
              quantity: e.quantity || 0,
              fromWarehouse: e.fromWarehouse || e.fromStore || src,
              fromStore: e.fromStore || e.fromWarehouse || src,
              toWarehouse: isIntra ? e.toWarehouse || e.toStore || dest : "",
              toStore: isIntra ? e.toStore || e.toWarehouse || dest : "",
              createDate: e.createDate || new Date().toISOString().slice(0, 10),
              expiryDate: e.expiryDate || `${new Date().getFullYear() + 1}-12-31`,
            };
          })
        );
      } else {
        setEntries([
          {
            sourceBatchNumber: defSrc,
            destinationBatchNumber: isIntra ? defDst : "",
            batchNumber: isIntra ? defDst : defSrc,
            quantity: effectiveQty,
            fromWarehouse: src,
            fromStore: src,
            toWarehouse: isIntra ? dest : "",
            toStore: isIntra ? dest : "",
            createDate: srcBatches[0]?.createDate || new Date().toISOString().slice(0, 10),
            expiryDate: srcBatches[0]?.expireDate || `${new Date().getFullYear() + 1}-12-31`,
          },
        ]);
      }
    }
  }, [isOpen, isIntra, sourceStore, defaultDestinationStore, fromStoreOptions, toStoreOptions, initialEntries, effectiveQty, itemCode]);

  if (!isOpen) return null;

  const totalAssigned = entries.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0);
  const isExceeded = totalAssigned > effectiveQty;
  const remainingQty = Math.max(0, effectiveQty - totalAssigned);

  const handleFromStoreChange = (newStore: string) => {
    setSelectedFromStore(newStore);
    const newBatches = getBatchesForStore(newStore, itemCode);
    const defSrc = newBatches[0]?.batchNumbering || `BAT-${itemCode.slice(-4)}-SRC-01`;
    setEntries((prev) =>
      prev.map((item, idx) => ({
        ...item,
        fromWarehouse: newStore,
        fromStore: newStore,
        sourceBatchNumber: newBatches[idx % (newBatches.length || 1)]?.batchNumbering || defSrc,
        batchNumber: isIntra ? item.destinationBatchNumber : newBatches[idx % (newBatches.length || 1)]?.batchNumbering || defSrc,
      }))
    );
  };

  const handleToStoreChange = (newStore: string) => {
    setSelectedToStore(newStore);
    const newBatches = getBatchesForStore(newStore, itemCode);
    const defDst = newBatches[0]?.batchNumbering || `BAT-${itemCode.slice(-4)}-DST-01`;
    setEntries((prev) =>
      prev.map((item, idx) => ({
        ...item,
        toWarehouse: newStore,
        toStore: newStore,
        destinationBatchNumber: newBatches[idx % (newBatches.length || 1)]?.batchNumbering || defDst,
        batchNumber: newBatches[idx % (newBatches.length || 1)]?.batchNumbering || defDst,
      }))
    );
  };

  const handleSourceBatchChangeForRow = (index: number, batchNum: string) => {
    setEntries((prev) =>
      prev.map((e, idx) =>
        idx === index
          ? {
              ...e,
              sourceBatchNumber: batchNum,
              batchNumber: isIntra ? e.destinationBatchNumber : batchNum,
            }
          : e
      )
    );
  };

  const handleDestBatchChangeForRow = (index: number, batchNum: string) => {
    setEntries((prev) =>
      prev.map((e, idx) =>
        idx === index
          ? {
              ...e,
              destinationBatchNumber: batchNum,
              batchNumber: batchNum,
            }
          : e
      )
    );
  };

  const handleQuantityChangeForRow = (index: number, qtyStr: string) => {
    const qty = Math.max(0, parseFloat(qtyStr) || 0);
    setEntries((prev) =>
      prev.map((e, idx) => (idx === index ? { ...e, quantity: qty } : e))
    );
  };

  const handleAddRow = () => {
    const unpickedSrc = sourceBatches.find(
      (b) => !entries.some((e) => e.sourceBatchNumber === b.batchNumbering)
    );
    const nextSrc =
      unpickedSrc?.batchNumbering ||
      sourceBatches[entries.length % (sourceBatches.length || 1)]?.batchNumbering ||
      `BAT-${itemCode.slice(-4)}-SRC-0${entries.length + 1}`;

    const unpickedDst = destinationBatches.find(
      (b) => !entries.some((e) => e.destinationBatchNumber === b.batchNumbering)
    );
    const nextDst =
      unpickedDst?.batchNumbering ||
      destinationBatches[entries.length % (destinationBatches.length || 1)]?.batchNumbering ||
      `BAT-${itemCode.slice(-4)}-DST-0${entries.length + 1}`;

    setEntries((prev) => [
      ...prev,
      {
        sourceBatchNumber: nextSrc,
        destinationBatchNumber: isIntra ? nextDst : "",
        batchNumber: isIntra ? nextDst : nextSrc,
        quantity: remainingQty,
        fromWarehouse: selectedFromStore,
        fromStore: selectedFromStore,
        toWarehouse: isIntra ? selectedToStore : "",
        toStore: isIntra ? selectedToStore : "",
        createDate: new Date().toISOString().slice(0, 10),
        expiryDate: `${new Date().getFullYear() + 2}-12-31`,
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    if (entries.length === 1) {
      toast.error("At least one batch allocation is required.");
      return;
    }
    setEntries((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleConfirm = () => {
    if (entries.length === 0) {
      toast.error("Please add at least one batch allocation.");
      return;
    }

    if (totalAssigned <= 0) {
      toast.error("Allocated quantity must be greater than zero.");
      return;
    }

    if (isExceeded) {
      toast.error(
        `Total allocated quantity (${totalAssigned} ${uom}) cannot exceed transfer quantity (${effectiveQty} ${uom}).`
      );
      return;
    }

    if (isIntra) {
      const hasInvalid = entries.some(
        (e) => !e.sourceBatchNumber.trim() || !e.destinationBatchNumber.trim()
      );
      if (hasInvalid) {
        toast.error("Please select a valid source and destination batch for all rows.");
        return;
      }

      onSave(
        entries.map((e) => ({
          ...e,
          batchNumber: e.destinationBatchNumber,
          fromWarehouse: selectedFromStore,
          fromStore: selectedFromStore,
          toWarehouse: selectedToStore,
          toStore: selectedToStore,
        }))
      );
    } else {
      const hasInvalid = entries.some(
        (e) => !(e.sourceBatchNumber || e.batchNumber || "").trim()
      );
      if (hasInvalid) {
        toast.error("Please select a valid batch number for all rows.");
        return;
      }

      onSave(
        entries.map((e) => {
          const bNum = e.sourceBatchNumber || e.batchNumber;
          return {
            ...e,
            sourceBatchNumber: bNum,
            destinationBatchNumber: "",
            batchNumber: bNum,
            fromWarehouse: selectedFromStore,
            fromStore: selectedFromStore,
            toWarehouse: "",
            toStore: "",
          };
        })
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-purple-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Layers className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">
                  Batch Allocation (Stock Transfer)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800">
                  {isIntra ? "Intra-Company Allocation" : "Multi-Company Allocation"}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Transfer Info Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">
              Item Details
            </span>
            <span className="font-bold text-slate-800">
              <span className="font-mono text-purple-600 mr-1.5">{itemCode}</span>
              {itemName}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {!isIntra && (
              <div className="text-right">
                <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">
                  Source Store
                </span>
                <span className="font-semibold text-slate-700">{sourceStore}</span>
              </div>
            )}
            <div className="text-right">
              <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">
                Total Transfer Qty
              </span>
              <span className="font-mono font-bold text-purple-700 text-sm">
                {effectiveQty.toLocaleString()} {uom}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* 1. Warehouse / Store Selection Section (Only for Intra-Company Transfer) */}
          {isIntra && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-purple-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Transfer Route & Warehouse Selection
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {/* From Warehouse / Store */}
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    From Warehouse / Store *
                  </label>
                  <select
                    disabled={readOnly}
                    value={selectedFromStore}
                    onChange={(e) => handleFromStoreChange(e.target.value)}
                    className="w-full h-8.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    {fromStoreOptions.map((w) => {
                      const sName = w.storeName || w.name || "";
                      return (
                        <option key={w.id} value={sName}>
                          {sName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* To Warehouse / Store */}
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    To Warehouse / Store *
                  </label>
                  <select
                    disabled={readOnly}
                    value={selectedToStore}
                    onChange={(e) => handleToStoreChange(e.target.value)}
                    className="w-full h-8.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    {toStoreOptions.map((w) => {
                      const sName = w.storeName || w.name || "";
                      return (
                        <option key={w.id} value={sName}>
                          {sName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 2. Allocation Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">SL</th>
                  {isIntra ? (
                    <>
                      <th className="py-2.5 px-3">Source Batch / Lot *</th>
                      <th className="py-2.5 px-3">Destination Batch / Lot *</th>
                    </>
                  ) : (
                    <th className="py-2.5 px-3">Batch / Lot Number *</th>
                  )}
                  <th className="py-2.5 px-3 text-right w-36">Transfer Qty *</th>
                  {!readOnly && <th className="py-2.5 px-2 w-10 text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 text-center font-mono text-slate-400 font-bold">
                      {idx + 1}
                    </td>

                    {/* Source Batch / Lot */}
                    <td className="py-2.5 px-3">
                      {readOnly ? (
                        <span className="font-mono font-medium text-slate-700">
                          {entry.sourceBatchNumber}
                        </span>
                      ) : (
                        <select
                          value={entry.sourceBatchNumber}
                          onChange={(e) => handleSourceBatchChangeForRow(idx, e.target.value)}
                          className="w-full h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-mono font-medium text-slate-800 outline-none focus:ring-2 focus:ring-purple-500/20"
                        >
                          {sourceBatches.map((b) => (
                            <option key={b.id} value={b.batchNumbering}>
                              {b.batchNumbering} {b.expireDate ? `(Exp: ${b.expireDate})` : ""}
                            </option>
                          ))}
                          {!sourceBatches.some((b) => b.batchNumbering === entry.sourceBatchNumber) && (
                            <option value={entry.sourceBatchNumber}>{entry.sourceBatchNumber}</option>
                          )}
                        </select>
                      )}
                    </td>

                    {/* Destination Batch / Lot (Only for Intra-Company) */}
                    {isIntra && (
                      <td className="py-2.5 px-3">
                        {readOnly ? (
                          <span className="font-mono font-medium text-slate-700">
                            {entry.destinationBatchNumber}
                          </span>
                        ) : (
                          <select
                            value={entry.destinationBatchNumber}
                            onChange={(e) => handleDestBatchChangeForRow(idx, e.target.value)}
                            className="w-full h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-mono font-medium text-slate-800 outline-none focus:ring-2 focus:ring-purple-500/20"
                          >
                            {destinationBatches.map((b) => (
                              <option key={b.id} value={b.batchNumbering}>
                                {b.batchNumbering} {b.expireDate ? `(Exp: ${b.expireDate})` : ""}
                              </option>
                            ))}
                            {!destinationBatches.some(
                              (b) => b.batchNumbering === entry.destinationBatchNumber
                            ) && (
                              <option value={entry.destinationBatchNumber}>
                                {entry.destinationBatchNumber}
                              </option>
                            )}
                          </select>
                        )}
                      </td>
                    )}

                    {/* Transfer Qty */}
                    <td className="py-2.5 px-3 text-right">
                      {readOnly ? (
                        <span className="font-mono font-bold text-slate-800">
                          {entry.quantity.toLocaleString()} {uom}
                        </span>
                      ) : (
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={entry.quantity === 0 ? "" : entry.quantity}
                          onChange={(e) => handleQuantityChangeForRow(idx, e.target.value)}
                          placeholder="0"
                          className="w-full h-8 px-2.5 text-right font-mono font-bold text-xs rounded-lg border border-slate-200 bg-white text-slate-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      )}
                    </td>

                    {/* Action */}
                    {!readOnly && (
                      <td className="py-2.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(idx)}
                          disabled={entries.length === 1}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Remove Row"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Row Button */}
          {!readOnly && (
            <button
              type="button"
              onClick={handleAddRow}
              className="flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-800 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 transition cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>+ Add Allocation Row</span>
            </button>
          )}

          {/* Validation Warnings */}
          {isExceeded && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 text-rose-600 shrink-0" />
              <span>
                <strong>Allocation Exceeded:</strong> Total allocated quantity ({totalAssigned}{" "}
                {uom}) exceeds the transfer quantity ({effectiveQty} {uom}) by{" "}
                {(totalAssigned - effectiveQty).toFixed(2)} {uom}.
              </span>
            </div>
          )}

          {!isExceeded && remainingQty > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 text-amber-600 shrink-0" />
              <span>
                <strong>Partially Allocated:</strong> {remainingQty.toFixed(2)} {uom} remaining to be
                allocated to reach the transfer quantity.
              </span>
            </div>
          )}
        </div>

        {/* Footer Summary & Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-500 font-medium">Total Allocated: </span>
              <span
                className={`font-mono font-bold text-sm ${
                  isExceeded ? "text-rose-600" : "text-purple-700"
                }`}
              >
                {totalAssigned.toLocaleString()} / {effectiveQty.toLocaleString()} {uom}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Remaining: </span>
              <span className="font-mono font-bold text-slate-700">
                {remainingQty.toLocaleString()} {uom}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            {!readOnly && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isExceeded || totalAssigned <= 0}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-bold transition shadow-sm disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="size-4" />
                <span>Confirm Batch Allocation</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
