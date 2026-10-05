// src/components/inventory/ItemBatchLocationModals.tsx
// Unified Location (L) & Batch (B) Modals with strict item tracking, store isolation, and on-the-fly creation

import React, { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  Layers,
  Plus,
  Trash2,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  StoreLocation,
} from "@/lib/procurement-master-data";
import {
  getLocationsForStore,
  getBatchesForStore,
  createAndSaveNewLocation,
  createAndSaveNewBatch,
} from "@/lib/item-tracking-utils";

export interface LocationEntry {
  locationName: string;
  quantity: number;
}

export interface BatchEntry {
  batchNumber: string;
  quantity: number;
  createDate?: string;
  expiryDate?: string;
}

// -------------------------------------------------------------
// 1. LOCATION ALLOCATION MODAL (L)
// -------------------------------------------------------------

interface LocationAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemCode: string;
  transactionQty?: number;
  totalTransactionQty?: number;
  uom?: string;
  currentStore?: string;
  storeName?: string;
  initialEntries?: LocationEntry[];
  currentAllocations?: any[];
  readOnly?: boolean;
  onSave: (entries: LocationEntry[]) => void;
}

export function LocationAllocationModal({
  isOpen,
  onClose,
  itemName,
  itemCode,
  transactionQty,
  totalTransactionQty,
  uom = "PCS",
  currentStore,
  storeName,
  initialEntries,
  currentAllocations,
  readOnly = false,
  onSave,
}: LocationAllocationModalProps) {
  const effectiveStore = currentStore || storeName || "";
  const effectiveQty = totalTransactionQty ?? transactionQty ?? 0;
  const [storeLocations, setStoreLocations] = useState<StoreLocation[]>([]);
  const [entries, setEntries] = useState<LocationEntry[]>([]);
  const [showNewLocationForm, setShowNewLocationForm] = useState(false);

  // New Location Form Fields
  const [newLocName, setNewLocName] = useState("");
  const [newLocCode, setNewLocCode] = useState("");
  const [newLocType, setNewLocType] = useState<"Rack" | "Shelf" | "Bin" | "Floor" | "Other">("Rack");

  // Load locations for current store
  useEffect(() => {
    if (isOpen) {
      const locs = getLocationsForStore(effectiveStore);
      setStoreLocations(locs);

      const inits = initialEntries || currentAllocations;
      if (inits && inits.length > 0) {
        setEntries(inits.map((e: any) => ({ locationName: e.locationName || "", quantity: e.quantity || 0 })));
      } else {
        const defaultName = locs[0]?.locationName || "Default Bay / Bin";
        setEntries([{ locationName: defaultName, quantity: effectiveQty }]);
      }
      setShowNewLocationForm(false);
      setNewLocName("");
      setNewLocCode(`LOC-${Math.floor(100 + Math.random() * 900)}`);
      setNewLocType("Rack");
    }
  }, [isOpen, effectiveStore, effectiveQty, initialEntries, currentAllocations]);

  if (!isOpen) return null;

  const totalAssigned = entries.reduce((sum, e) => sum + (Number(e.quantity) || 0), 0);
  const isExceeded = totalAssigned > effectiveQty;

  const handleAddLocationRow = () => {
    const unpicked = storeLocations.find((l) => !entries.some((e) => e.locationName === l.locationName));
    const nextName = unpicked?.locationName || storeLocations[entries.length % (storeLocations.length || 1)]?.locationName || "Rack Area";
    const remainingQty = Math.max(0, effectiveQty - totalAssigned);
    setEntries((prev) => [...prev, { locationName: nextName, quantity: remainingQty }]);
  };

  const handleCreateNewLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim()) {
      toast.error("Location Name is required");
      return;
    }

    const created = createAndSaveNewLocation({
      store: effectiveStore,
      locationName: newLocName.trim(),
      locationCode: newLocCode.trim(),
      locationType: newLocType,
    });

    // Refresh store locations list
    const updated = getLocationsForStore(effectiveStore);
    setStoreLocations(updated);

    // Immediately make available & select in the current item transaction
    const remainingQty = Math.max(0, effectiveQty - totalAssigned);
    setEntries((prev) => [
      ...prev.filter((entry) => entry.quantity > 0),
      { locationName: created.locationName, quantity: remainingQty > 0 ? remainingQty : 0 },
    ]);

    setShowNewLocationForm(false);
    setNewLocName("");
    setNewLocCode(`LOC-${Math.floor(100 + Math.random() * 900)}`);
    toast.success(`Location "${created.locationName}" created against ${effectiveStore} and added.`);
  };

  const handleSaveModal = () => {
    if (isExceeded) {
      toast.error(`Total assigned quantity (${totalAssigned} ${uom}) exceeds transaction quantity (${effectiveQty} ${uom}).`);
      return;
    }
    const valid = entries.filter((e) => e.locationName && e.quantity > 0);
    onSave(valid.length > 0 ? valid : [{ locationName: storeLocations[0]?.locationName || "Default Bin", quantity: effectiveQty }]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-xl w-full p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <MapPin className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">Location Allocation (L)</h3>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {itemName} ({itemCode}) — Required: <strong className="text-foreground">{transactionQty} {uom}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted cursor-pointer"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* New Location Inline Creation Panel */}
        {!readOnly && (
          showNewLocationForm ? (
            <form onSubmit={handleCreateNewLocation} className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                  <Sparkles className="size-3.5" />
                  <span>+ Create New Location</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewLocationForm(false)}
                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                    Location Name*
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rack A - Shelf 02"
                    value={newLocName}
                    onChange={(e) => setNewLocName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                    Location Type
                  </label>
                  <select
                    value={newLocType}
                    onChange={(e) => setNewLocType(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-xs outline-none focus:border-blue-500"
                  >
                    <option value="Rack">Rack</option>
                    <option value="Shelf">Shelf</option>
                    <option value="Bin">Bin</option>
                    <option value="Floor">Floor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowNewLocationForm(false)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs"
                >
                  Save &amp; Add Location
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Select existing locations or create a new one for this store:
              </span>
              <button
                type="button"
                onClick={() => setShowNewLocationForm(true)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="size-3.5" /> + New Location
              </button>
            </div>
          )
        )}

        {/* Existing Location Rows */}
        <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
          {entries.map((entry, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-muted/20 p-2.5 rounded-xl border border-border">
              {/* Location Name Selection Only - No store name in list */}
              <div className="flex-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                  Location Name
                </label>
                {readOnly ? (
                  <div className="w-full px-2.5 py-1.5 bg-muted/40 border border-border rounded-lg text-xs font-semibold text-foreground">
                    {entry.locationName || "-"}
                  </div>
                ) : (
                  <select
                    value={entry.locationName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEntries((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, locationName: val } : item))
                      );
                    }}
                    className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs font-semibold focus:border-blue-500 outline-none"
                  >
                    {storeLocations.map((loc) => (
                      <option key={loc.id} value={loc.locationName}>
                        {loc.locationName}
                      </option>
                    ))}
                    {storeLocations.length === 0 && (
                      <option value={entry.locationName}>{entry.locationName}</option>
                    )}
                  </select>
                )}
              </div>

              {/* Quantity Entry */}
              <div className="w-32">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                  Quantity ({uom})
                </label>
                {readOnly ? (
                  <div className="w-full px-2.5 py-1.5 text-right font-mono font-bold bg-muted/40 border border-border rounded-lg text-xs text-foreground">
                    {entry.quantity}
                  </div>
                ) : (
                  <input
                    type="number"
                    min="0"
                    step="any"
                    max={transactionQty}
                    value={entry.quantity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEntries((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, quantity: val } : item))
                      );
                    }}
                    className="w-full px-2.5 py-1.5 text-right font-mono font-bold bg-background border border-border rounded-lg text-xs focus:border-blue-500 outline-none"
                  />
                )}
              </div>

              {/* Remove Row Button */}
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => setEntries((prev) => prev.filter((_, i) => i !== idx))}
                  disabled={entries.length <= 1}
                  className="mt-4 p-1.5 text-muted-foreground hover:text-rose-600 rounded disabled:opacity-30 cursor-pointer"
                  title="Remove Row"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          ))}

          {!readOnly && (
            <button
              type="button"
              onClick={handleAddLocationRow}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer pt-1"
            >
              <Plus className="size-3.5" /> Add Another Location
            </button>
          )}
        </div>

        {/* Validation & Total Summary */}
        <div
          className={`p-3 rounded-xl text-xs border flex items-center justify-between ${
            isExceeded
              ? "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300"
              : "bg-muted/40 border-border text-foreground"
          }`}
        >
          <div>
            <span>
              Total Assigned: <strong className="font-mono font-bold">{totalAssigned} {uom}</strong> / Max:{" "}
              <strong className="font-mono font-bold">{transactionQty} {uom}</strong>
            </span>
            {isExceeded && (
              <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 mt-0.5">
                Total location quantity must not exceed transaction quantity!
              </p>
            )}
          </div>
          <div className="font-bold text-xs flex items-center gap-1">
            {isExceeded ? (
              <span className="text-rose-600">✕ Exceeded</span>
            ) : (
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> Valid
              </span>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
          {readOnly ? (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
            >
              Close
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isExceeded}
                onClick={handleSaveModal}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer shadow-sm"
              >
                Save Locations
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. BATCH ALLOCATION MODAL (B)
// -------------------------------------------------------------

interface BatchAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemCode: string;
  transactionQty?: number;
  totalTransactionQty?: number;
  uom?: string;
  currentStore?: string;
  storeName?: string;
  initialEntries?: BatchEntry[];
  currentAllocations?: any[];
  readOnly?: boolean;
  onSave: (entries: BatchEntry[]) => void;
}

export function BatchAllocationModal({
  isOpen,
  onClose,
  itemName,
  itemCode,
  transactionQty,
  totalTransactionQty,
  uom = "PCS",
  currentStore,
  storeName,
  initialEntries,
  currentAllocations,
  readOnly = false,
  onSave,
}: BatchAllocationModalProps) {
  const effectiveStore = currentStore || storeName || "";
  const effectiveQty = totalTransactionQty ?? transactionQty ?? 0;
  const [storeBatches, setStoreBatches] = useState<StoreLocation[]>([]);
  const [entries, setEntries] = useState<BatchEntry[]>([]);
  const [showNewBatchForm, setShowNewBatchForm] = useState(false);

  // New Batch Form Fields
  const [newBatchNumber, setNewBatchNumber] = useState("");
  const [newCreateDate, setNewCreateDate] = useState("");
  const [newExpireDate, setNewExpireDate] = useState("");

  useEffect(() => {
    if (isOpen) {
      const batches = getBatchesForStore(effectiveStore, itemCode);
      setStoreBatches(batches);

      const inits = initialEntries || currentAllocations;
      if (inits && inits.length > 0) {
        setEntries(inits.map((e: any) => ({
          batchNumber: e.batchNumber || "",
          quantity: e.quantity || 0,
          createDate: e.createDate,
          expiryDate: e.expiryDate,
        })));
      } else {
        const defaultBatch = batches[0]?.batchNumbering || `BAT-${itemCode.slice(-4)}-01`;
        setEntries([
          {
            batchNumber: defaultBatch,
            quantity: effectiveQty,
            createDate: batches[0]?.createDate || new Date().toISOString().slice(0, 10),
            expiryDate: batches[0]?.expireDate || `${new Date().getFullYear() + 1}-12-31`,
          },
        ]);
      }

      setShowNewBatchForm(false);
      setNewBatchNumber(`BAT-${itemCode.slice(-4)}-${new Date().getFullYear().toString().slice(-2)}${Math.floor(10 + Math.random() * 90)}`);
      setNewCreateDate(new Date().toISOString().slice(0, 10));
      setNewExpireDate(`${new Date().getFullYear() + 2}-12-31`);
    }
  }, [isOpen, effectiveStore, itemCode, effectiveQty, initialEntries, currentAllocations]);

  if (!isOpen) return null;

  const totalAssigned = entries.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0);
  const isExceeded = totalAssigned > effectiveQty;

  const handleAddBatchRow = () => {
    const unpicked = storeBatches.find((b) => !entries.some((e) => e.batchNumber === b.batchNumbering));
    const nextNum = unpicked?.batchNumbering || `BAT-${itemCode.slice(-4)}-0${entries.length + 1}`;
    const remainingQty = Math.max(0, effectiveQty - totalAssigned);
    setEntries((prev) => [
      ...prev,
      {
        batchNumber: nextNum,
        quantity: remainingQty,
        createDate: new Date().toISOString().slice(0, 10),
        expiryDate: `${new Date().getFullYear() + 2}-12-31`,
      },
    ]);
  };

  const handleCreateNewBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchNumber.trim()) {
      toast.error("Batch Number is required");
      return;
    }

    const created = createAndSaveNewBatch({
      store: effectiveStore,
      itemCode,
      itemName,
      batchNumber: newBatchNumber.trim(),
      createDate: newCreateDate,
      expireDate: newExpireDate,
    });

    // Refresh store batches list
    const updated = getBatchesForStore(effectiveStore, itemCode);
    setStoreBatches(updated);

    // Immediately make available & select in the current item transaction
    const remainingQty = Math.max(0, effectiveQty - totalAssigned);
    setEntries((prev) => [
      ...prev.filter((entry) => entry.quantity > 0),
      {
        batchNumber: created.batchNumbering,
        quantity: remainingQty > 0 ? remainingQty : 0,
        createDate: created.createDate,
        expiryDate: created.expireDate,
      },
    ]);

    setShowNewBatchForm(false);
    toast.success(`Batch "${created.batchNumbering}" created for ${effectiveStore} and selected.`);
  };

  const handleSaveModal = () => {
    if (isExceeded) {
      toast.error(`Total assigned batch quantity (${totalAssigned} ${uom}) exceeds transaction quantity (${effectiveQty} ${uom}).`);
      return;
    }
    const valid = entries.filter((e) => e.batchNumber && e.quantity > 0);
    onSave(
      valid.length > 0
        ? valid
        : [
            {
              batchNumber: storeBatches[0]?.batchNumbering || `BAT-${itemCode.slice(-4)}-01`,
              quantity: effectiveQty,
            },
          ]
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Layers className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">Batch Allocation (B)</h3>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {itemName} ({itemCode}) — Required: <strong className="text-foreground">{transactionQty} {uom}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted cursor-pointer"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* New Batch Inline Creation Panel */}
        {!readOnly && (
          showNewBatchForm ? (
            <form onSubmit={handleCreateNewBatch} className="p-3.5 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900/60 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300">
                  <Sparkles className="size-3.5" />
                  <span>+ Create New Batch</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewBatchForm(false)}
                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                    Batch Number*
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BAT-2026-09"
                    value={newBatchNumber}
                    onChange={(e) => setNewBatchNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs font-mono font-bold focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                    Manufacture / Create Date
                  </label>
                  <input
                    type="date"
                    value={newCreateDate}
                    onChange={(e) => setNewCreateDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-xs focus:border-purple-500 outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={newExpireDate}
                    onChange={(e) => setNewExpireDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-xs focus:border-purple-500 outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowNewBatchForm(false)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-xs"
                >
                  Save &amp; Select Batch
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Select available batches for this warehouse or create a new batch:
              </span>
              <button
                type="button"
                onClick={() => setShowNewBatchForm(true)}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="size-3.5" /> + New Batch
              </button>
            </div>
          )
        )}

        {/* Batch Selection Rows */}
        <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
          {entries.map((entry, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-muted/20 p-2.5 rounded-xl border border-border items-end">
              {/* Dropdown / Searchable Batch Selector */}
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                  Batch Number
                </label>
                {readOnly ? (
                  <div className="w-full px-2.5 py-1.5 font-mono font-bold bg-muted/40 border border-border rounded-lg text-xs text-foreground">
                    {entry.batchNumber || "-"}
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={entry.batchNumber}
                      onChange={(e) => {
                        const val = e.target.value;
                        const matched = storeBatches.find((b) => b.batchNumbering === val);
                        setEntries((prev) =>
                          prev.map((item, i) =>
                            i === idx
                              ? {
                                  ...item,
                                  batchNumber: val,
                                  createDate: matched?.createDate || item.createDate,
                                  expiryDate: matched?.expireDate || item.expiryDate,
                                }
                              : item
                          )
                        );
                      }}
                      className="w-full px-2.5 py-1.5 font-mono font-bold bg-background border border-border rounded-lg text-xs focus:border-purple-500 outline-none"
                    >
                      {storeBatches.map((b) => (
                        <option key={b.id} value={b.batchNumbering}>
                          {b.batchNumbering} {b.expireDate ? `(Exp: ${b.expireDate})` : ""}
                        </option>
                      ))}
                      {storeBatches.length === 0 && (
                        <option value={entry.batchNumber}>{entry.batchNumber}</option>
                      )}
                    </select>
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                  Quantity ({uom})
                </label>
                {readOnly ? (
                  <div className="w-full px-2 py-1.5 text-right font-mono font-bold bg-muted/40 border border-border rounded-lg text-xs text-foreground">
                    {entry.quantity}
                  </div>
                ) : (
                  <input
                    type="number"
                    min="0"
                    step="any"
                    max={transactionQty}
                    value={entry.quantity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEntries((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, quantity: val } : item))
                      );
                    }}
                    className="w-full px-2 py-1.5 text-right font-mono font-bold bg-background border border-border rounded-lg text-xs focus:border-purple-500 outline-none"
                  />
                )}
              </div>

              {/* Expiry Date & Delete Action */}
              <div className="flex items-center gap-1.5">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                    Expiry Date
                  </label>
                  {readOnly ? (
                    <div className="w-full px-2 py-1.5 bg-muted/40 border border-border rounded-lg text-xs font-semibold text-foreground">
                      {entry.expiryDate || "—"}
                    </div>
                  ) : (
                    <input
                      type="date"
                      value={entry.expiryDate || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEntries((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, expiryDate: val } : item))
                        );
                      }}
                      className="w-full px-2 py-1.5 bg-background border border-border rounded-lg text-xs font-semibold focus:border-purple-500 outline-none"
                    />
                  )}
                </div>

                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => setEntries((prev) => prev.filter((_, i) => i !== idx))}
                    disabled={entries.length <= 1}
                    className="p-1.5 text-muted-foreground hover:text-rose-600 rounded disabled:opacity-30 cursor-pointer mb-0.5"
                    title="Remove Row"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {!readOnly && (
            <button
              type="button"
              onClick={handleAddBatchRow}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer pt-1"
            >
              <Plus className="size-3.5" /> Add Another Batch
            </button>
          )}
        </div>

        {/* Validation & Total Summary */}
        <div
          className={`p-3 rounded-xl text-xs border flex items-center justify-between ${
            isExceeded
              ? "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300"
              : "bg-muted/40 border-border text-foreground"
          }`}
        >
          <div>
            <span>
              Total Assigned: <strong className="font-mono font-bold">{totalAssigned} {uom}</strong> / Max:{" "}
              <strong className="font-mono font-bold">{transactionQty} {uom}</strong>
            </span>
            {isExceeded && (
              <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 mt-0.5">
                Total batch quantity must not exceed transaction quantity!
              </p>
            )}
          </div>
          <div className="font-bold text-xs flex items-center gap-1">
            {isExceeded ? (
              <span className="text-rose-600">✕ Exceeded</span>
            ) : (
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> Valid
              </span>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
          {readOnly ? (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
            >
              Close
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isExceeded}
                onClick={handleSaveModal}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 cursor-pointer shadow-sm"
              >
                Save Batches
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. ITEM TRACKING BUTTON / CELL COMPONENT
// -------------------------------------------------------------

interface ItemTrackingCellProps {
  mode?: "Batch" | "Location" | "None";
  trackingMode?: "Batch" | "Location" | "None";
  batchCount?: number;
  locationCount?: number;
  batchAllocations?: Array<{ batchNumber?: string; quantity?: number }>;
  locationAllocations?: Array<{ locationName?: string; quantity?: number }>;
  onOpenBatch?: () => void;
  onOpenLocation?: () => void;
  onOpenModal?: () => void;
  disabled?: boolean;
}

export function ItemTrackingCell({
  mode,
  trackingMode,
  batchCount,
  locationCount,
  batchAllocations,
  locationAllocations,
  onOpenBatch,
  onOpenLocation,
  onOpenModal,
  disabled = false,
}: ItemTrackingCellProps) {
  const activeMode = trackingMode || mode || "None";
  const bCount = batchCount ?? (batchAllocations?.length || 0);
  const lCount = locationCount ?? (locationAllocations?.length || 0);
  const handleBatch = onOpenBatch || onOpenModal || (() => {});
  const handleLocation = onOpenLocation || onOpenModal || (() => {});

  if (activeMode === "Batch") {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={handleBatch}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors inline-flex items-center gap-1 cursor-pointer ${
          bCount > 0
            ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800 hover:bg-purple-100"
            : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title="Assign Batches"
      >
        <Layers className="size-3" /> B ({bCount})
      </button>
    );
  }

  // Location tracking (default for all non-batch items)
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleLocation}
      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors inline-flex items-center gap-1 cursor-pointer ${
        lCount > 0
          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 hover:bg-blue-100"
          : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title="Assign Store Locations"
    >
      <MapPin className="size-3" /> L ({lCount})
    </button>
  );
}
