import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  MMRepository,
  MMAccessoriesBooking,
  MMAccessoriesBookingLine,
  MMAccessoriesMasterItem,
  INITIAL_MM_ACCESSORIES_MASTER,
} from "../lib/marketing-merchandising-data";
import { DEFAULT_UOMS, UOM } from "../lib/procurement-master-data";
import {
  Package,
  Plus,
  Search,
  ArrowLeft,
  FileText,
  Check,
  X,
  Printer,
  Trash2,
  Paperclip,
  Save,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Scale,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import {
  MMBookingAttachmentModal,
  MMAttachmentRecord,
} from "../components/marketing-merchandising/MMBookingAttachmentModal";

export const MANUAL_BOOKING_ATTACHMENTS_STORAGE_KEY =
  "cripton_mm_manual_booking_attachments_v1";

export type MMAccessoriesBookingAttachmentRecord = MMAttachmentRecord;

export type AccessoriesBookingType = "Block Booking";

export interface ManualBookingItemRow {
  id: string;
  itemId?: string;
  itemCode?: string;
  itemName: string;
  unit: string;
  marketUnit: string;
  conversionFactor: number;
  bookQty: number;
  marketQty: number;
  storeRcvdQty: number;
  rate: number;
  total: number;
}

export interface ConversionModalState {
  isOpen: boolean;
  rowId: string;
  marketUnit: string;
  consumptionUnit: string;
  factor: number;
  factorInput: string;
  previousMarketUnit: string;
}

interface ManualBookingSearchParams {
  mode?: "view" | "edit" | "create";
  source?: string;
  jobId?: string;
  ref?: string;
  rowId?: string;
  rowIds?: string;
  accessoryId?: string;
  itemName?: string;
  supplier?: string;
  bookingId?: string;
  id?: string;
}

export const Route = createFileRoute("/mm-manual-booking")({
  validateSearch: (search: Record<string, unknown>): ManualBookingSearchParams => ({
    mode: (search.mode as "view" | "edit" | "create") || undefined,
    source: (search.source as string) || undefined,
    jobId: (search.jobId as string) || undefined,
    ref: (search.ref as string) || undefined,
    rowId: (search.rowId as string) || undefined,
    rowIds: (search.rowIds as string) || undefined,
    accessoryId: (search.accessoryId as string) || undefined,
    itemName: (search.itemName as string) || undefined,
    supplier: (search.supplier as string) || undefined,
    bookingId: (search.bookingId as string) || undefined,
    id: (search.id as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Manual Booking — Marketing & Merchandising | CriptonHRIS" },
      {
        name: "description",
        content:
          "Enterprise Manual Booking form replicating ERP interface with customizable items, searchable accessory library, and independent Market Unit conversion.",
      },
    ],
  }),
  component: MMManualBookingPage,
});

// Pakiza Company master list for Del Place
const PAKIZA_DELIVERY_COMPANIES = [
  "Pakiza Central Accessories Store",
  "Pakiza Knit Composite Ltd.",
  "Pakiza Apparels Ltd.",
  "Pakiza Textiles Ltd.",
  "Pakiza Spinning Mills Ltd.",
  "Pakiza Woven Dyeing Ltd.",
];

// Helper to generate sequential booking number from persisted records
function generateNextBookingNumber(persistedBookings: MMAccessoriesBooking[]): string {
  const prefix = "MB-BLK-2026/";
  const matching = persistedBookings.filter((b) => b.bookingNo && b.bookingNo.startsWith(prefix));
  let maxSeq = 0;
  matching.forEach((b) => {
    const suffix = b.bookingNo.replace(prefix, "").trim();
    const seq = parseInt(suffix, 10);
    if (!isNaN(seq) && seq > maxSeq) {
      maxSeq = seq;
    }
  });
  const nextSeq = maxSeq + 1;
  const seqStr = nextSeq < 10 ? `0${nextSeq}` : `${nextSeq}`;
  return `${prefix}${seqStr}`;
}

const DEFAULT_BOOKING_ITEMS: ManualBookingItemRow[] = [
  {
    id: "mbi-1",
    itemId: "acc-m-001",
    itemCode: "ACC-BTN-01",
    itemName: "18L 4-Hole Pearl Button (11.5mm)",
    unit: "Pcs",
    marketUnit: "Pcs",
    conversionFactor: 1,
    bookQty: 5000,
    marketQty: 5000,
    storeRcvdQty: 0,
    rate: 0.015,
    total: 75.0,
  },
  {
    id: "mbi-2",
    itemId: "acc-m-004",
    itemCode: "ACC-THD-01",
    itemName: "Astra 40/2 Spun Poly Sewing Thread",
    unit: "Cone",
    marketUnit: "Cone",
    conversionFactor: 1,
    bookQty: 120,
    marketQty: 120,
    storeRcvdQty: 0,
    rate: 1.85,
    total: 222.0,
  },
];

function MMManualBookingPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const isViewMode = search.mode === "view";

  // Master Data & Persisted Lists
  const [allBookings, setAllBookings] = useState<MMAccessoriesBooking[]>([]);
  const [accessoriesMaster, setAccessoriesMaster] = useState<MMAccessoriesMasterItem[]>([]);
  const [uomsList, setUomsList] = useState<UOM[]>([]);

  // Active Booking Form State
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string>("Draft");
  const [bookingNo, setBookingNo] = useState<string>("MB-BLK-2026/01");
  const [ourRef, setOurRef] = useState<string>("JOB-2026-0001");
  const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [payMode, setPayMode] = useState<string>("TT 30 Days");

  // Supplier & Delivery Information
  const [supplierId, setSupplierId] = useState<string>("SUP-ACC-01");
  const [supplierName, setSupplierName] = useState<string>("ABC Accessories Ltd.");
  const [bookingType, setBookingType] = useState<string>("Block Booking");
  const [delMode, setDelMode] = useState<string>("Road");
  const [delPlace, setDelPlace] = useState<string>("Pakiza Central Accessories Store");
  const [reqDate, setReqDate] = useState<string>("2026-11-15");
  const [deliveryDate, setDeliveryDate] = useState<string>("2026-11-25");

  // Supplier Master Options
  const suppliersList = useMemo(() => {
    return MMRepository.getSuppliers();
  }, []);

  const supplierOptions = useMemo(() => {
    const options = suppliersList.map((s) => ({
      value: s.id,
      label: `${s.supplierName} (${s.supplierCode})`,
    }));
    if (supplierId && !options.some((o) => o.value === supplierId)) {
      options.unshift({
        value: supplierId,
        label: supplierName ? `${supplierName} (${supplierId})` : supplierId,
      });
    }
    return options;
  }, [suppliersList, supplierId, supplierName]);

  const handleSupplierChange = (val: string) => {
    const selected = suppliersList.find((s) => s.id === val || s.supplierCode === val || s.supplierName === val);
    if (selected) {
      setSupplierId(selected.id);
      setSupplierName(selected.supplierName);
    } else {
      setSupplierId(val);
      setSupplierName(val);
    }
  };

  // Additional Information
  const [note, setNote] = useState<string>(
    "Block booking for seasonal bulk order. Accessories must match approved standard specs."
  );
  const [termsAndConditions, setTermsAndConditions] = useState<string>(
    "1. Quality testing standard: Oeko-Tex Standard 100 Class I.\n2. Quantity tolerance: Max +/- 2% acceptable.\n3. Delivery F.O.R. Pakiza Composite Garments Unit.\n4. Defective or off-shade items subject to replacement within 48 hours."
  );
  const [piReference, setPiReference] = useState<string>("Not Linked");

  // Grid Items State
  const [items, setItems] = useState<ManualBookingItemRow[]>(DEFAULT_BOOKING_ITEMS);

  // Modals & Popovers
  const [itemPickerRowId, setItemPickerRowId] = useState<string | null>(null);
  const [itemSearchQuery, setItemSearchQuery] = useState<string>("");
  const [conversionModal, setConversionModal] = useState<ConversionModalState>({
    isOpen: false,
    rowId: "",
    marketUnit: "",
    consumptionUnit: "",
    factor: 1,
    factorInput: "1",
    previousMarketUnit: "",
  });
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Attachments State
  const [attachments, setAttachments] = useState<MMAttachmentRecord[]>([]);

  // Load Initial Data on Mount & Parse Query Params
  useEffect(() => {
    const loadedBookings = MMRepository.getManualBookings();
    setAllBookings(loadedBookings);

    // Load Accessory items from master data repository
    const masterItems = MMRepository.getAccessoriesMaster();
    setAccessoriesMaster(masterItems.length > 0 ? masterItems : INITIAL_MM_ACCESSORIES_MASTER);

    // Load UOM master
    let storedUoms: UOM[] = DEFAULT_UOMS;
    try {
      const raw = localStorage.getItem("proc_uoms");
      if (raw) storedUoms = JSON.parse(raw);
    } catch {
      storedUoms = DEFAULT_UOMS;
    }
    setUomsList(storedUoms);

    // Process Search Params
    const targetBookingParam = search.bookingId || search.id;
    if (targetBookingParam) {
      const existing = loadedBookings.find(
        (b) => b.id === targetBookingParam || b.bookingNo === targetBookingParam
      );
      if (existing) {
        loadBookingIntoForm(existing);
        return;
      } else {
        toast.error(`Booking record not found for "${targetBookingParam}".`);
      }
    } else {
      // Auto-generate fresh booking number
      setBookingNo(generateNextBookingNumber(loadedBookings));
    }
  }, [search.bookingId, search.id]);

  // Load saved booking into form
  const loadBookingIntoForm = (b: MMAccessoriesBooking) => {
    setEditingBookingId(b.id);
    setBookingStatus(b.status || "Draft");
    setBookingNo(b.bookingNo);
    setOurRef(b.ourRef || "JOB-2026-0001");
    setBookingDate(b.bookingDate || new Date().toISOString().slice(0, 10));
    setPayMode(b.payMode || "TT 30 Days");
    setSupplierId(b.supplierId || "SUP-ACC-01");
    setSupplierName(b.supplierName || "ABC Accessories Ltd.");
    setBookingType("Block Booking");
    setDelMode(b.deliveryMode || b.delMode || "Road");
    setDelPlace(b.deliveryPlace || b.delPlace || "Pakiza Central Accessories Store");
    setReqDate(b.reqDate || "2026-11-15");
    setDeliveryDate(b.deliveryDate || "2026-11-25");
    setNote(b.note || b.notes || "");
    setTermsAndConditions(b.termsAndConditions || "");
    setPiReference(b.piReference || "Not Linked");

    // Restore item rows
    if (b.items && b.items.length > 0) {
      const restored: ManualBookingItemRow[] = b.items.map((it: any, idx) => {
        const factor = it.conversionFactor && it.conversionFactor > 0 ? it.conversionFactor : 1;
        const bQty = Number(it.bookedQty ?? it.bookQty ?? 0);
        const mQty =
          it.marketQty != null
            ? Number(it.marketQty)
            : Number((bQty / factor).toFixed(2));
        const rUnit = it.unit || "Pcs";
        const mUnit = it.marketUnit || rUnit;
        const rate = Number(it.bookedRate ?? it.rate ?? 0);
        const total =
          it.totalAmount != null
            ? Number(it.totalAmount)
            : Number((bQty * rate).toFixed(2));
        return {
          id: it.bookingItemId || it.id || `mbi-${idx}`,
          itemId: it.preCostItemId || it.itemId || "",
          itemCode: it.itemCode || it.codeSpecPo || "",
          itemName: it.accessoryName || it.itemDescription || it.itemName || "Accessory Item",
          unit: rUnit,
          marketUnit: mUnit,
          conversionFactor: factor,
          bookQty: bQty,
          marketQty: mQty,
          storeRcvdQty: Number(it.storeRcvdQty || 0),
          rate,
          total,
        };
      });
      setItems(restored);
    } else if (b.lines && b.lines.length > 0) {
      const restored: ManualBookingItemRow[] = [];
      b.lines.forEach((l, lIdx) => {
        if (l.sizeWiseDetails && l.sizeWiseDetails.length > 0) {
          l.sizeWiseDetails.forEach((d, dIdx) => {
            const factor = d.conversionFactor && d.conversionFactor > 0 ? d.conversionFactor : 1;
            const bQty = Number(d.bookQty || 0);
            const mQty =
              d.marketQty != null
                ? Number(d.marketQty)
                : Number((bQty / factor).toFixed(2));
            restored.push({
              id: d.id || `mbi-${lIdx}-${dIdx}`,
              itemId: "",
              itemCode: d.codeSpecPo || "",
              itemName: d.itemName || l.accessoryItem || "Accessory Item",
              unit: d.unit || l.unit || "Pcs",
              marketUnit: d.marketUnit || d.unit || l.unit || "Pcs",
              conversionFactor: factor,
              bookQty: bQty,
              marketQty: mQty,
              storeRcvdQty: Number(d.storeRcvdQty || 0),
              rate: Number(d.rate || 0),
              total: Number((d.total || bQty * (d.rate || 0)).toFixed(2)),
            });
          });
        } else {
          restored.push({
            id: l.id || `mbi-${lIdx}`,
            itemId: l.estimationItemId || "",
            itemCode: "",
            itemName: l.accessoryItem || "Accessory Item",
            unit: l.unit || "Pcs",
            marketUnit: l.unit || "Pcs",
            conversionFactor: 1,
            bookQty: Number(l.bookAmt || l.requiredQty || 0),
            marketQty: Number(l.bookAmt || l.requiredQty || 0),
            storeRcvdQty: 0,
            rate: Number(l.rate || 0),
            total: Number(l.bookAmt || 0),
          });
        }
      });
      setItems(restored.length > 0 ? restored : DEFAULT_BOOKING_ITEMS);
    }
    toast.success(`Loaded Manual Booking ${b.bookingNo}`);
  };

  // Filter accessory items for search picker
  const filteredAccessoryItems = useMemo(() => {
    if (!itemSearchQuery.trim()) return accessoriesMaster;
    const q = itemSearchQuery.toLowerCase().trim();
    return accessoriesMaster.filter(
      (it) =>
        it.itemName.toLowerCase().includes(q) ||
        (it.itemCode && it.itemCode.toLowerCase().includes(q)) ||
        (it.category && it.category.toLowerCase().includes(q))
    );
  }, [accessoriesMaster, itemSearchQuery]);

  // Totals for detailed grid
  const totals = useMemo(() => {
    let bookQty = 0;
    let marketQty = 0;
    let storeRcvdQty = 0;
    let totalAmount = 0;

    items.forEach((r) => {
      bookQty += r.bookQty || 0;
      marketQty += r.marketQty || 0;
      storeRcvdQty += r.storeRcvdQty || 0;
      totalAmount += r.total || 0;
    });

    return {
      bookQty: Number(bookQty.toFixed(2)),
      marketQty: Number(marketQty.toFixed(2)),
      storeRcvdQty: Number(storeRcvdQty.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
    };
  }, [items]);

  // Row Management
  const handleAddRow = () => {
    const firstItem = accessoriesMaster[0];
    const defaultUnit = firstItem?.unit || "Pcs";
    const newRow: ManualBookingItemRow = {
      id: `mbi-${Date.now()}-${items.length}`,
      itemId: firstItem?.id || "",
      itemCode: firstItem?.itemCode || "",
      itemName: firstItem?.itemName || "Select Accessory Item",
      unit: defaultUnit,
      marketUnit: defaultUnit,
      conversionFactor: 1,
      bookQty: 0,
      marketQty: 0,
      storeRcvdQty: 0,
      rate: firstItem?.defaultRate || 0,
      total: 0,
    };
    setItems((prev) => [...prev, newRow]);
    toast.success("New item row added.");
  };

  const handleDeleteRow = (rowId: string) => {
    if (items.length <= 1) {
      toast.error("At least one booking item is required.");
      return;
    }
    setItems((prev) => prev.filter((r) => r.id !== rowId));
    toast.info("Item row removed.");
  };

  const handleSelectItem = (rowId: string, item: MMAccessoriesMasterItem) => {
    const primaryUnit = item.unit || "Pcs";
    setItems((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const rate = item.defaultRate || r.rate || 0;
        const factor = 1;
        const marketQty = Number((r.bookQty / factor).toFixed(2));
        const total = Number((r.bookQty * rate).toFixed(2));
        return {
          ...r,
          itemId: item.id,
          itemCode: item.itemCode,
          itemName: item.itemName,
          unit: primaryUnit,
          marketUnit: primaryUnit,
          conversionFactor: factor,
          marketQty,
          rate,
          total,
        };
      })
    );
    setItemPickerRowId(null);
    setItemSearchQuery("");
    toast.success(`Selected item "${item.itemName}"`);
  };

  // Unit and Market Unit change handlers
  const handleUnitChange = (rowId: string, newUnit: string) => {
    const row = items.find((r) => r.id === rowId);
    if (!row) return;

    if (newUnit === row.marketUnit) {
      setItems((prev) =>
        prev.map((r) => {
          if (r.id !== rowId) return r;
          return {
            ...r,
            unit: newUnit,
            conversionFactor: 1,
            marketQty: r.bookQty,
          };
        })
      );
    } else {
      setConversionModal({
        isOpen: true,
        rowId: row.id,
        marketUnit: row.marketUnit,
        consumptionUnit: newUnit,
        factor: row.conversionFactor > 0 ? row.conversionFactor : 1,
        factorInput: row.conversionFactor > 0 ? String(row.conversionFactor) : "1",
        previousMarketUnit: row.marketUnit,
      });
      setItems((prev) =>
        prev.map((r) => {
          if (r.id !== rowId) return r;
          return { ...r, unit: newUnit };
        })
      );
    }
  };

  const handleMarketUnitChange = (rowId: string, newMarketUnit: string) => {
    const row = items.find((r) => r.id === rowId);
    if (!row) return;

    if (newMarketUnit === row.unit) {
      // Both units match — no conversion dialog needed
      setItems((prev) =>
        prev.map((r) => {
          if (r.id !== rowId) return r;
          return {
            ...r,
            marketUnit: newMarketUnit,
            conversionFactor: 1,
            marketQty: r.bookQty,
          };
        })
      );
      toast.info(`Market Unit set to ${newMarketUnit} (1 : 1 relation)`);
    } else {
      // Units differ — trigger Unit Relation Dialog
      setConversionModal({
        isOpen: true,
        rowId: row.id,
        marketUnit: newMarketUnit,
        consumptionUnit: row.unit,
        factor: row.conversionFactor > 0 && row.conversionFactor !== 1 ? row.conversionFactor : 1,
        factorInput:
          row.conversionFactor > 0 && row.conversionFactor !== 1
            ? String(row.conversionFactor)
            : "",
        previousMarketUnit: row.marketUnit,
      });
    }
  };

  const handleOpenConversionForEdit = (row: ManualBookingItemRow) => {
    setConversionModal({
      isOpen: true,
      rowId: row.id,
      marketUnit: row.marketUnit,
      consumptionUnit: row.unit,
      factor: row.conversionFactor,
      factorInput: String(row.conversionFactor || 1),
      previousMarketUnit: row.marketUnit,
    });
  };

  const handleConfirmConversion = () => {
    if (!conversionModal.isOpen) return;
    const factorNum = parseFloat(conversionModal.factorInput);
    if (isNaN(factorNum) || factorNum <= 0) {
      toast.error("Please enter a valid positive conversion factor greater than 0.");
      return;
    }

    setItems((prev) =>
      prev.map((r) => {
        if (r.id !== conversionModal.rowId) return r;
        const calculatedMarketQty = Number((r.bookQty / factorNum).toFixed(2));
        return {
          ...r,
          marketUnit: conversionModal.marketUnit,
          conversionFactor: factorNum,
          marketQty: calculatedMarketQty,
        };
      })
    );

    toast.success(
      `Unit relation applied: 1 ${conversionModal.marketUnit} = ${factorNum} ${conversionModal.consumptionUnit}`
    );
    setConversionModal({
      isOpen: false,
      rowId: "",
      marketUnit: "",
      consumptionUnit: "",
      factor: 1,
      factorInput: "",
      previousMarketUnit: "",
    });
  };

  const handleCancelConversion = () => {
    // Reverts proposed Market Unit change to previous confirmed value without applying
    if (conversionModal.rowId && conversionModal.previousMarketUnit) {
      setItems((prev) =>
        prev.map((r) => {
          if (r.id !== conversionModal.rowId) return r;
          return {
            ...r,
            marketUnit: conversionModal.previousMarketUnit,
          };
        })
      );
    }
    setConversionModal({
      isOpen: false,
      rowId: "",
      marketUnit: "",
      consumptionUnit: "",
      factor: 1,
      factorInput: "",
      previousMarketUnit: "",
    });
    toast.info("Unit conversion cancelled.");
  };

  // Quantity and Rate handlers
  const handleBookQtyChange = (rowId: string, val: string) => {
    const num = parseFloat(val) || 0;
    setItems((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const factor = r.conversionFactor > 0 ? r.conversionFactor : 1;
        const marketQty = Number((num / factor).toFixed(2));
        const total = Number((num * (r.rate || 0)).toFixed(2));
        return {
          ...r,
          bookQty: num,
          marketQty,
          total,
        };
      })
    );
  };

  const handleRateChange = (rowId: string, val: string) => {
    const num = parseFloat(val) || 0;
    setItems((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const total = Number(((r.bookQty || 0) * num).toFixed(2));
        return {
          ...r,
          rate: num,
          total,
        };
      })
    );
  };

  const handleStoreRcvdChange = (rowId: string, val: string) => {
    const num = parseFloat(val) || 0;
    setItems((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        return { ...r, storeRcvdQty: num };
      })
    );
  };

  const handleRoundUpBookQty = (rowId: string) => {
    setItems((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const rounded = Math.ceil(r.bookQty);
        const factor = r.conversionFactor > 0 ? r.conversionFactor : 1;
        const marketQty = Number((rounded / factor).toFixed(2));
        const total = Number((rounded * (r.rate || 0)).toFixed(2));
        return {
          ...r,
          bookQty: rounded,
          marketQty,
          total,
        };
      })
    );
    toast.info("Book quantity rounded up to whole unit (R>)");
  };

  // Save Booking as Draft
  const handleSaveBooking = () => {
    if (isSaving || isSubmitting) return;

    if (bookingStatus === "Approved") {
      toast.error("Cannot modify an Approved booking. It is locked in read-only mode.");
      return;
    }
    if (bookingStatus === "Submitted" || bookingStatus === "Pending") {
      toast.error("This booking has been submitted for approval and is locked.");
      return;
    }

    if (items.length === 0) {
      toast.error("Validation Error: Please add at least one booking item before saving.");
      return;
    }

    setIsSaving(true);

    try {
      const parentLine: MMAccessoriesBookingLine = {
        id: `line-${Date.now()}`,
        ourRef: ourRef || "JOB-2026-0001",
        style: "STYLE-2026",
        grpType: "TRIMS",
        accessoryItem: items[0]?.itemName || "Manual Block Booking Accessories",
        description: "Manual Block Booking Accessories",
        bookAmt: totals.totalAmount,
        budgetValue: totals.totalAmount,
        unit: items[0]?.unit || "Pcs",
        sizeWiseDetails: items.map((r) => ({
          id: r.id,
          lineId: `line-${Date.now()}`,
          ourRef: ourRef || "JOB-2026-0001",
          itemName: r.itemName,
          description: `${r.itemName} (${r.unit})`,
          color: "Standard",
          size: "Standard",
          codeSpecPo: r.itemCode || "",
          gmtQty: 0,
          reqQty: r.bookQty,
          unit: r.unit,
          marketUnit: r.marketUnit,
          conversionFactor: r.conversionFactor,
          marketQty: r.marketQty,
          bookedWastagePct: 0,
          bookQty: r.bookQty,
          storeRcvdQty: r.storeRcvdQty,
          rate: r.rate,
          total: r.total,
        })),
      };

      const bookingPayload: MMAccessoriesBooking = {
        id: editingBookingId || `acc-book-${Date.now()}`,
        bookingNo: bookingNo,
        ourRef: ourRef || "JOB-2026-0001",
        bookingDate: bookingDate,
        payMode: payMode,
        supplierId: supplierId,
        supplierName: supplierName,
        deliveryMode: delMode,
        bookType: "Block Booking",
        deliveryPlace: delPlace,
        reqDate: reqDate,
        deliveryDate: deliveryDate,
        status: bookingStatus || "Draft",
        note: note,
        termsAndConditions: termsAndConditions,
        totalBookedAmount: totals.totalAmount,
        totalBookedQty: totals.bookQty,
        totalPreCostAmount: totals.totalAmount,
        totalSavingAmount: 0,
        overallSavingPct: 0,
        currency: "USD",
        conversionRate: 1.0,
        paymentTerms: payMode,
        createdBy: "Tanvir Ahmed",
        createdDate: bookingDate,
        lines: [parentLine],
        items: items.map((r) => ({
          bookingItemId: r.id,
          estimationItemId: r.itemId || "",
          orderId: "",
          orderNo: "",
          styleNo: "",
          poNumber: "",
          preCostItemId: r.itemId || "",
          itemDescription: r.itemName,
          specification: "",
          sizeOrDimension: "",
          color: "Standard",
          unit: r.unit,
          marketUnit: r.marketUnit,
          conversionFactor: r.conversionFactor,
          marketQty: r.marketQty,
          requiredQty: r.bookQty,
          bookedQty: r.bookQty,
          bookedRate: r.rate,
          totalAmount: r.total,
          preCostRate: r.rate,
          preCostAmount: r.total,
          initialSavingAmount: 0,
          initialSavingPct: 0,
          isOverBudget: false,
          isSavingTargetMissed: false,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      MMRepository.saveManualBooking(bookingPayload);

      setAllBookings((prev) => {
        const idx = prev.findIndex(
          (b) => b.id === bookingPayload.id || b.bookingNo === bookingPayload.bookingNo
        );
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = bookingPayload;
          return copy;
        }
        return [bookingPayload, ...prev];
      });

      setEditingBookingId(bookingPayload.id);
      toast.success("Manual Booking saved successfully.");
    } catch (err) {
      console.error("Error saving manual booking:", err);
      toast.error("Failed to save manual booking draft.");
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Booking for Approval
  const handleSubmitBooking = () => {
    if (isSubmitting || isSaving) return;

    if (bookingStatus === "Approved") {
      toast.warning(`Manual Booking ${bookingNo} is already Approved.`);
      return;
    }
    if (bookingStatus === "Submitted" || bookingStatus === "Pending") {
      toast.info(`Manual Booking ${bookingNo} is currently Pending Approval.`);
      return;
    }

    if (items.length === 0) {
      toast.error("Validation Error: Please add at least one booking item before submitting.");
      return;
    }

    const invalidQuantities = items.filter((r) => !r.bookQty || r.bookQty <= 0);
    if (invalidQuantities.length > 0) {
      toast.error(
        `Validation Error: Book Quantity must be greater than 0 for item "${invalidQuantities[0].itemName}".`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const parentLine: MMAccessoriesBookingLine = {
        id: `line-${Date.now()}`,
        ourRef: ourRef || "JOB-2026-0001",
        style: "STYLE-2026",
        grpType: "TRIMS",
        accessoryItem: items[0]?.itemName || "Manual Block Booking Accessories",
        description: "Manual Block Booking Accessories",
        bookAmt: totals.totalAmount,
        budgetValue: totals.totalAmount,
        unit: items[0]?.unit || "Pcs",
        sizeWiseDetails: items.map((r) => ({
          id: r.id,
          lineId: `line-${Date.now()}`,
          ourRef: ourRef || "JOB-2026-0001",
          itemName: r.itemName,
          description: `${r.itemName} (${r.unit})`,
          color: "Standard",
          size: "Standard",
          codeSpecPo: r.itemCode || "",
          gmtQty: 0,
          reqQty: r.bookQty,
          unit: r.unit,
          marketUnit: r.marketUnit,
          conversionFactor: r.conversionFactor,
          marketQty: r.marketQty,
          bookedWastagePct: 0,
          bookQty: r.bookQty,
          storeRcvdQty: r.storeRcvdQty,
          rate: r.rate,
          total: r.total,
        })),
      };

      const bookingPayload: MMAccessoriesBooking = {
        id: editingBookingId || `acc-book-${Date.now()}`,
        bookingNo: bookingNo,
        ourRef: ourRef || "JOB-2026-0001",
        bookingDate: bookingDate,
        payMode: payMode,
        supplierId: supplierId,
        supplierName: supplierName,
        deliveryMode: delMode,
        bookType: "Block Booking",
        deliveryPlace: delPlace,
        reqDate: reqDate,
        deliveryDate: deliveryDate,
        status: "Submitted",
        note: note,
        termsAndConditions: termsAndConditions,
        totalBookedAmount: totals.totalAmount,
        totalBookedQty: totals.bookQty,
        totalPreCostAmount: totals.totalAmount,
        totalSavingAmount: 0,
        overallSavingPct: 0,
        currency: "USD",
        conversionRate: 1.0,
        paymentTerms: payMode,
        createdBy: "Tanvir Ahmed",
        createdDate: bookingDate,
        lines: [parentLine],
        items: items.map((r) => ({
          bookingItemId: r.id,
          estimationItemId: r.itemId || "",
          orderId: "",
          orderNo: "",
          styleNo: "",
          poNumber: "",
          preCostItemId: r.itemId || "",
          itemDescription: r.itemName,
          specification: "",
          sizeOrDimension: "",
          color: "Standard",
          unit: r.unit,
          marketUnit: r.marketUnit,
          conversionFactor: r.conversionFactor,
          marketQty: r.marketQty,
          requiredQty: r.bookQty,
          bookedQty: r.bookQty,
          bookedRate: r.rate,
          totalAmount: r.total,
          preCostRate: r.rate,
          preCostAmount: r.total,
          initialSavingAmount: 0,
          initialSavingPct: 0,
          isOverBudget: false,
          isSavingTargetMissed: false,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      MMRepository.saveManualBooking(bookingPayload);
      MMRepository.submitManualBooking(bookingPayload.id, "Tanvir Ahmed");
      setBookingStatus("Pending");
      setEditingBookingId(bookingPayload.id);

      toast.success(
        `Manual Booking ${bookingNo} submitted for approval. Record is now locked.`
      );
    } catch (err) {
      console.error("Error submitting manual booking:", err);
      toast.error("Failed to submit manual booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Proforma Invoice Creation Integration
  const handleCreatePI = () => {
    let savedBooking = editingBookingId
      ? allBookings.find((b) => b.id === editingBookingId)
      : allBookings.find((b) => b.bookingNo === bookingNo);

    if (!savedBooking) {
      if (items.length === 0) {
        toast.error("Validation Notice: Please add at least one booking item before creating a Proforma Invoice.");
        return;
      }
      handleSaveBooking();
      savedBooking = MMRepository.getManualBookingById(editingBookingId || bookingNo) || allBookings.find((b) => b.bookingNo === bookingNo);
    }

    if (!savedBooking) {
      toast.error(
        "Validation Notice: Please save or submit this Manual Booking before creating a Proforma Invoice."
      );
      return;
    }

    if (!savedBooking.items?.length && !items.length) {
      toast.error("Validation Notice: Manual Booking must contain items to create a PI.");
      return;
    }

    toast.info(`Opening Proforma Invoice Entry for Manual Booking ${savedBooking.bookingNo}...`);

    navigate({
      to: "/mm-proforma-invoice-create",
      search: {
        bookingId: savedBooking.id,
        bookingNo: savedBooking.bookingNo,
        source: "manual-booking",
        item: "Accessories",
      } as any,
    });
  };

  const handleExit = () => {
    navigate({ to: "/mm-manual-booking-register" });
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-manual-booking"
      title="Manual Booking"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Booking Information" },
        { label: "Manual Booking Registes (Acc)", to: "/mm-manual-booking-register" },
        { label: "Manual Booking Form" },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/mm-manual-booking-register"
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Register</span>
          </Link>
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Sheet</span>
          </button>
        </div>
      }
    >
      <div className="space-y-4 p-4 max-w-[1600px] mx-auto text-xs">
        {/* Main Application Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          {/* ================================================================ */}
          {/* 1. TOP HEADER BAR                                                */}
          {/* ================================================================ */}
          <div className="p-3 bg-slate-100/90 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                <span className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide text-xs">
                  Manual Booking
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                  {bookingNo}
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1">
                {bookingStatus === "Approved" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Approved (Locked)</span>
                  </span>
                ) : bookingStatus === "Submitted" || bookingStatus === "Pending" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300">
                    <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    <span>Pending Approval (Locked)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    <span>Draft</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExit}
                className="px-3 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
              >
                Exit
              </button>
            </div>
          </div>

          {/* ================================================================ */}
          {/* 2. MANUAL BOOKING HEADER SECTION                                 */}
          {/* Job ID completely removed; Booking Type contains ONLY Block Booking */}
          {/* ================================================================ */}
          <div className="p-3 bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2.5 items-center">
              {/* Supplier (Span 2 columns on lg) */}
              <div className="flex items-center gap-1.5 min-w-0 sm:col-span-2 lg:col-span-2">
                <label className="w-[85px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  Supplier:
                </label>
                <div className="w-full min-w-0">
                  <SearchableSelect
                    options={supplierOptions}
                    value={supplierId}
                    onChange={handleSupplierChange}
                    placeholder="Search and select supplier..."
                    className="h-7.5 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-800 dark:text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 shadow-none"
                  />
                </div>
              </div>

              {/* Booking Date */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="w-[85px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  Booking Date:
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="h-7.5 w-full min-w-0 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Pay Mode */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="w-[85px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  Pay. Mode:
                </label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  className="h-7.5 w-full min-w-0 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-1 focus:ring-teal-500 focus:outline-none truncate"
                >
                  <option value="TT 30 Days">TT 30 Days</option>
                  <option value="At Sight">At Sight</option>
                  <option value="Internal Transfer">Internal Transfer</option>
                  <option value="LC 60 Days">LC 60 Days</option>
                </select>
              </div>

              {/* Booking No */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="w-[85px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  Booking No:
                </label>
                <input
                  type="text"
                  readOnly
                  value={bookingNo}
                  className="h-7.5 w-full min-w-0 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-800 dark:text-slate-200 cursor-not-allowed text-left text-xs"
                />
              </div>

              {/* Booking Type: RETAIN ONLY Block Booking */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="w-[85px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  Booking Type:
                </label>
                <select
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value)}
                  className="h-7.5 w-full min-w-0 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-teal-700 dark:text-teal-400 focus:ring-1 focus:ring-teal-500 focus:outline-none truncate"
                >
                  <option value="Block Booking">Block Booking</option>
                </select>
              </div>

              {/* Del Mode */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="w-[85px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  Del Mode:
                </label>
                <select
                  value={delMode}
                  onChange={(e) => setDelMode(e.target.value)}
                  className="h-7.5 w-full min-w-0 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none truncate"
                >
                  <option value="Road">Road</option>
                  <option value="Air">Air</option>
                  <option value="Sea">Sea</option>
                </select>
              </div>

              {/* Del Place */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="w-[85px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  Del Place:
                </label>
                <select
                  value={delPlace}
                  onChange={(e) => setDelPlace(e.target.value)}
                  title={delPlace}
                  className="h-7.5 w-full min-w-0 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-1 focus:ring-teal-500 focus:outline-none truncate"
                >
                  {PAKIZA_DELIVERY_COMPANIES.map((cmp) => (
                    <option key={cmp} value={cmp}>
                      {cmp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Req Date (Positioned to the left of Delivery Date in the same row) */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="w-[85px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  Req Date:
                </label>
                <input
                  type="date"
                  value={reqDate}
                  onChange={(e) => setReqDate(e.target.value)}
                  className="h-7.5 w-full min-w-0 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Delivery Date */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="w-[85px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  Delivery Date:
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="h-7.5 w-full min-w-0 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Bottom Row: Terms & Conditions, PI No, Notes */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-750">
              <div className="flex flex-wrap items-center gap-4">
                {/* Terms & Conditions button */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="h-7.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded border border-slate-300 dark:border-slate-700 font-semibold text-[11px] flex items-center gap-1.5 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Terms &amp; Conditions</span>
                  </button>
                </div>

                {/* PI No display */}
                <div className="flex items-center gap-1.5 text-[11px] h-7.5 px-2.5 py-1 bg-slate-100/80 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700">
                  <span className="font-semibold text-slate-500">PI No:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {piReference}
                  </span>
                </div>
              </div>

              {/* Note input */}
              <div className="flex-1 min-w-[240px] max-w-lg flex items-center gap-2">
                <label className="text-[11px] font-semibold text-slate-500 shrink-0">Note:</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter procurement notes..."
                  className="h-7.5 w-full min-w-0 px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* 3. DETAILED SIZE-WISE BOOKING GRID                                */}
          {/* Removed: Job ID, Color, Size, GMT Qty, Req Qty, Wastage %, Desc  */}
          {/* Added: Searchable Item Name, Market Unit, Unit Relation Modal     */}
          {/* ================================================================ */}
          <div className="p-3 bg-white dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide text-[11px]">
                  Detailed Size-wise Booking Grid
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-400">
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddRow}
                className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item Row</span>
              </button>
            </div>

            {/* Table */}
            <div className="border border-slate-200 dark:border-slate-750 rounded-lg overflow-x-auto max-h-[480px] bg-white dark:bg-slate-950 shadow-xs relative">
              <table className="w-full border-collapse text-left whitespace-nowrap text-[11px]">
                <thead className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-700 sticky top-0 z-20">
                  <tr>
                    <th className="py-2 px-2.5 text-center border-r border-slate-300 dark:border-slate-700 w-10">
                      #
                    </th>
                    <th className="py-2 px-3 border-r border-slate-300 dark:border-slate-700 min-w-[260px]">
                      Item Name
                    </th>
                    <th className="py-2 px-2.5 text-center border-r border-slate-300 dark:border-slate-700 w-28">
                      Unit
                    </th>
                    <th className="py-2 px-2.5 text-center border-r border-slate-300 dark:border-slate-700 w-32 bg-teal-50/50 dark:bg-teal-950/20 text-teal-800 dark:text-teal-300">
                      Market Unit
                    </th>
                    <th className="py-2 px-2.5 text-center border-r border-slate-300 dark:border-slate-700 w-36">
                      Unit Relation / Factor
                    </th>
                    <th className="py-2 px-2.5 text-right border-r border-slate-300 dark:border-slate-700 font-extrabold text-teal-700 dark:text-teal-400 w-28">
                      Book Qty
                    </th>
                    <th className="py-2 px-2.5 text-right border-r border-slate-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200 w-28">
                      Market Qty
                    </th>
                    <th className="py-2 px-2.5 text-right border-r border-slate-300 dark:border-slate-700 w-24">
                      Store Rcvd
                    </th>
                    <th className="py-2 px-2 text-right border-r border-slate-300 dark:border-slate-700 w-24">
                      Rate ($)
                    </th>
                    <th className="py-2 px-2.5 text-right font-bold text-emerald-700 dark:text-emerald-400 w-28">
                      Total ($)
                    </th>
                    <th className="py-2 px-2 text-center w-16 sticky right-0 bg-slate-200 dark:bg-slate-800">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-10 text-center text-slate-400 font-sans">
                        <Package className="w-8 h-8 mx-auto mb-1.5 text-slate-300 dark:text-slate-600" />
                        <p className="font-semibold text-slate-600 dark:text-slate-400">
                          No booking items added yet.
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Click "Add Item Row" to add your first accessory line.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    items.map((r, idx) => {
                      const isConverted = r.unit !== r.marketUnit;

                      return (
                        <tr
                          key={r.id}
                          className="hover:bg-teal-50/20 dark:hover:bg-teal-950/10 transition-colors"
                        >
                          {/* 1. SL */}
                          <td className="py-1.5 px-2.5 text-center text-slate-500 border-r border-slate-200 dark:border-slate-800">
                            {idx + 1}
                          </td>

                          {/* 2. Item Name: Searchable Dropdown / Selector */}
                          <td className="py-1.5 px-2.5 border-r border-slate-200 dark:border-slate-800 font-sans">
                            <button
                              type="button"
                              onClick={() => {
                                setItemPickerRowId(r.id);
                                setItemSearchQuery("");
                              }}
                              className="w-full text-left px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 flex items-center justify-between gap-2 transition cursor-pointer group"
                              title="Click to select accessory item from master list"
                            >
                              <div className="truncate">
                                <span className="font-semibold text-slate-900 dark:text-white">
                                  {r.itemName || "Select Accessory Item..."}
                                </span>
                                {r.itemCode && (
                                  <span className="ml-1.5 font-mono text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                                    [{r.itemCode}]
                                  </span>
                                )}
                              </div>
                              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0" />
                            </button>
                          </td>

                          {/* 3. Unit (Consumption Unit) */}
                          <td className="py-1.5 px-2 border-r border-slate-200 dark:border-slate-800 text-center">
                            <select
                              value={r.unit}
                              onChange={(e) => handleUnitChange(r.id, e.target.value)}
                              className="w-full px-1.5 py-1 text-center font-mono font-bold text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            >
                              {uomsList.map((u) => (
                                <option key={u.id} value={u.uomCode}>
                                  {u.uomCode}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* 4. Market Unit (Beside Unit, Searchable selection) */}
                          <td className="py-1.5 px-2 border-r border-slate-200 dark:border-slate-800 text-center bg-teal-50/30 dark:bg-teal-950/10">
                            <select
                              value={r.marketUnit}
                              onChange={(e) => handleMarketUnitChange(r.id, e.target.value)}
                              className="w-full px-1.5 py-1 text-center font-mono font-bold text-xs rounded border border-teal-400 dark:border-teal-700 bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                              title="Select Market Unit (conversion dialog opens if different from Unit)"
                            >
                              {uomsList.map((u) => (
                                <option key={u.id} value={u.uomCode}>
                                  {u.uomCode} ({u.uomName})
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* 5. Unit Relation / Factor */}
                          <td className="py-1.5 px-2.5 border-r border-slate-200 dark:border-slate-800 text-center">
                            {isConverted ? (
                              <button
                                type="button"
                                onClick={() => handleOpenConversionForEdit(r)}
                                className="px-2 py-0.5 rounded bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 border border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-200 font-mono text-[10px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                                title="Click to view or adjust conversion relation factor"
                              >
                                <Scale className="w-3 h-3 text-teal-600 shrink-0" />
                                <span>
                                  1 {r.marketUnit} = {r.conversionFactor} {r.unit}
                                </span>
                              </button>
                            ) : (
                              <span
                                className="font-mono text-slate-400 text-[10px]"
                                title="Units are identical (1:1 relation)"
                              >
                                1 : 1
                              </span>
                            )}
                          </td>

                          {/* 6. Book Qty (with R> Round Up button) */}
                          <td className="py-1.5 px-2 text-right border-r border-slate-200 dark:border-slate-800 font-bold text-teal-700 dark:text-teal-400">
                            <div className="flex items-center justify-end gap-1">
                              <input
                                type="number"
                                step="any"
                                value={r.bookQty}
                                onChange={(e) => handleBookQtyChange(r.id, e.target.value)}
                                className="w-20 px-1 py-0.5 text-right rounded border border-transparent hover:border-teal-400 bg-transparent focus:bg-white dark:focus:bg-slate-900 font-bold text-teal-700 dark:text-teal-400"
                              />
                              <button
                                type="button"
                                onClick={() => handleRoundUpBookQty(r.id)}
                                className="px-1 py-0.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 rounded text-[9px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                                title="Round up to whole unit (R>)"
                              >
                                R&gt;
                              </button>
                            </div>
                          </td>

                          {/* 7. Market Qty (Calculated automatically from Factor) */}
                          <td className="py-1.5 px-2.5 text-right border-r border-slate-200 dark:border-slate-800 font-mono font-bold text-slate-800 dark:text-slate-200">
                            <span>
                              {(r.marketQty || 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-1 font-sans">
                              {r.marketUnit}
                            </span>
                          </td>

                          {/* 8. Store Rcvd Qty (Non-editable) */}
                          <td className="py-1.5 px-2 text-right border-r border-slate-200 dark:border-slate-800 text-slate-500">
                            <input
                              type="number"
                              step="any"
                              readOnly
                              disabled
                              value={r.storeRcvdQty}
                              title="Store Received Quantity (System Managed)"
                              className="w-16 px-1 py-0.5 text-right rounded border border-transparent bg-slate-100/70 dark:bg-slate-800/60 font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed select-none"
                            />
                          </td>

                          {/* 9. Rate ($) */}
                          <td className="py-1.5 px-2 text-right border-r border-slate-200 dark:border-slate-800">
                            <input
                              type="number"
                              step="0.0001"
                              value={r.rate}
                              onChange={(e) => handleRateChange(r.id, e.target.value)}
                              className="w-16 px-1 py-0.5 text-right rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-700 bg-transparent focus:bg-white dark:focus:bg-slate-900 font-medium text-slate-800 dark:text-slate-200"
                            />
                          </td>

                          {/* 10. Total ($) */}
                          <td className="py-1.5 px-2.5 text-right font-extrabold text-emerald-700 dark:text-emerald-400">
                            $
                            {(r.total || 0).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>

                          {/* 11. Actions */}
                          <td className="py-1.5 px-2 text-center sticky right-0 bg-white dark:bg-slate-950">
                            <button
                              type="button"
                              onClick={() => handleDeleteRow(r.id)}
                              title="Delete row"
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>

                {/* Table Summary Footer */}
                <tfoot className="bg-slate-100 dark:bg-slate-800 font-bold border-t-2 border-slate-300 dark:border-slate-700 font-mono text-[11px] sticky bottom-0 z-10">
                  <tr>
                    <td
                      colSpan={5}
                      className="py-2 px-3 text-right font-sans uppercase tracking-wider text-slate-600 dark:text-slate-400"
                    >
                      Total Summary:
                    </td>
                    <td className="py-2 px-2.5 text-right font-extrabold text-teal-700 dark:text-teal-400">
                      {totals.bookQty.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-2 px-2.5 text-right text-slate-800 dark:text-slate-200">
                      {totals.marketQty.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-2 px-2.5 text-right text-slate-500">
                      {totals.storeRcvdQty.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td></td>
                    <td className="py-2 px-2.5 text-right font-extrabold text-emerald-700 dark:text-emerald-400">
                      $
                      {totals.totalAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ================================================================ */}
          {/* 4. FOOTER ACTIONS                                                */}
          {/* ================================================================ */}
          <div className="p-3 bg-slate-100 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
            {/* Left Action: Attachment Modal Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAttachmentModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all shadow-xs cursor-pointer"
                title="Document Storage — Manual Booking Attachments"
              >
                <Paperclip className="w-3.5 h-3.5 text-teal-600" />
                <span>Attachment ({attachments.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 shadow-xs transition-colors cursor-pointer"
                title="Preview Booking Sheet"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Preview</span>
              </button>
            </div>

            {/* Right Action: PI Create, Save and Submit Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCreatePI}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-300 dark:border-slate-750 shadow-xs cursor-pointer"
                title="Create Proforma Invoice from this Manual Booking"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Proforma Invoice Create</span>
              </button>
              {bookingStatus === "Approved" ? (
                <span className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Approved (Locked)</span>
                </span>
              ) : bookingStatus === "Pending" || bookingStatus === "Submitted" ? (
                <span className="px-4 py-2 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>Pending Approval (Locked)</span>
                </span>
              ) : isViewMode ? (
                <button
                  type="button"
                  onClick={() => {
                    navigate({
                      to: "/mm-manual-booking",
                      search: { ...search, mode: "edit" },
                    });
                  }}
                  className="px-6 py-2 rounded-xl font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
                >
                  <span>Switch to Edit Mode</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={isSaving || isSubmitting}
                    onClick={handleSaveBooking}
                    className="px-5 py-2 rounded-xl font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 shadow-xs flex items-center gap-1.5 text-xs transition-colors disabled:opacity-50 cursor-pointer"
                    title="Save current Manual Booking as draft"
                  >
                    <Save className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    <span>{isSaving ? "Saving..." : "Save"}</span>
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting || isSaving}
                    onClick={handleSubmitBooking}
                    className="px-6 py-2 rounded-xl font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm flex items-center gap-1.5 text-xs transition-colors disabled:opacity-50 cursor-pointer"
                    title="Validate and Submit Manual Booking"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Submitting..." : "Submit for Approval"}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* MODAL 1: SEARCHABLE ACCESSORY ITEM PICKER                          */}
        {/* ================================================================== */}
        {itemPickerRowId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col text-xs overflow-hidden">
              {/* Header */}
              <div className="bg-slate-800 text-white px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-teal-400" />
                  <span className="font-bold text-sm">Select Accessory Item</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setItemPickerRowId(null);
                    setItemSearchQuery("");
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search accessory items by name, code, category..."
                    value={itemSearchQuery}
                    onChange={(e) => setItemSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Item Table (Exactly 3 columns: Item Code | Item Name | UoM) */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold sticky top-0 border-b border-slate-200 dark:border-slate-700 z-10">
                    <tr>
                      <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 w-36">Item Code</th>
                      <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-700">Item Name</th>
                      <th className="py-2 px-3 text-center w-28">UoM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredAccessoryItems.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-slate-400">
                          No matching accessory items found.
                        </td>
                      </tr>
                    ) : (
                      filteredAccessoryItems.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => handleSelectItem(itemPickerRowId, item)}
                          className="hover:bg-teal-50 dark:hover:bg-teal-950/40 cursor-pointer transition-colors"
                        >
                          <td className="py-2 px-3 font-mono font-bold text-teal-700 dark:text-teal-400 border-r border-slate-200 dark:border-slate-800">
                            {item.itemCode}
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800">
                            {item.itemName}
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-medium text-slate-700 dark:text-slate-300">
                            {item.unit || "Pcs"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="p-3 bg-slate-100 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
                <span>Total Items: {filteredAccessoryItems.length}</span>
                <button
                  type="button"
                  onClick={() => {
                    setItemPickerRowId(null);
                    setItemSearchQuery("");
                  }}
                  className="px-3 py-1 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MODAL 2: UNIT CONVERSION RELATION DIALOG                           */}
        {/* Required Fields: Market Unit, One Unit Relation / Factor, Unit     */}
        {/* Buttons: Cancel (reverts unconfirmed), Confirm (validates > 0)     */}
        {/* ================================================================== */}
        {conversionModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-md w-full overflow-hidden text-xs">
              {/* Header */}
              <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-teal-400" />
                  <h3 className="font-bold text-sm">Unit Conversion Relation</h3>
                </div>
                <button
                  type="button"
                  onClick={handleCancelConversion}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Please define the conversion relation between the proposed{" "}
                  <strong className="text-teal-700 dark:text-teal-400 font-semibold">
                    Market Unit
                  </strong>{" "}
                  and the primary{" "}
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                    Consumption Unit
                  </strong>
                  .
                </p>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-750 space-y-3">
                  {/* 1. Market Unit (Display only) */}
                  <div className="flex items-center justify-between gap-3">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                      Market Unit:
                    </label>
                    <div className="w-48 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-mono font-bold text-teal-700 dark:text-teal-400 text-xs">
                      {conversionModal.marketUnit}
                    </div>
                  </div>

                  {/* 2. One Unit Relation / Factor (User input, positive required) */}
                  <div className="flex items-center justify-between gap-3">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                      One Unit Relation / Factor: <span className="text-rose-500">*</span>
                    </label>
                    <div className="w-48">
                      <input
                        type="number"
                        step="any"
                        min="0.000001"
                        autoFocus
                        placeholder="e.g. 12 or 100"
                        value={conversionModal.factorInput}
                        onChange={(e) =>
                          setConversionModal((prev) => ({
                            ...prev,
                            factorInput: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-teal-500 rounded-md font-mono font-bold text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* 3. Consumption Unit (Display only) */}
                  <div className="flex items-center justify-between gap-3">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                      Consumption Unit:
                    </label>
                    <div className="w-48 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {conversionModal.consumptionUnit}
                    </div>
                  </div>
                </div>

                {/* Conversion Preview Sentence */}
                {parseFloat(conversionModal.factorInput) > 0 ? (
                  <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-lg border border-teal-200 dark:border-teal-800/60 text-[11px] text-teal-800 dark:text-teal-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>
                      <strong>Formula:</strong> 1 {conversionModal.marketUnit} ={" "}
                      {conversionModal.factorInput} {conversionModal.consumptionUnit}. (Market Qty =
                      Book Qty ÷ {conversionModal.factorInput})
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Please enter a valid positive factor greater than 0.</span>
                  </div>
                )}
              </div>

              {/* Actions: Cancel & Confirm */}
              <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 border-t border-slate-200 dark:border-slate-750 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCancelConversion}
                  className="px-4 py-2 rounded-lg font-semibold text-xs border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmConversion}
                  className="px-5 py-2 rounded-lg font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MODAL 3: TERMS & CONDITIONS                                        */}
        {/* ================================================================== */}
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-xl w-full p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-sm">Terms &amp; Conditions</span>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                rows={6}
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
                className="w-full p-2.5 border rounded-lg dark:bg-slate-800 text-xs font-mono"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg"
                >
                  Save &amp; Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MODAL 4: PRINT PREVIEW SHEET                                       */}
        {/* ================================================================== */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col text-xs overflow-hidden">
              <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-teal-400" />
                  <span className="font-bold text-sm">
                    Print Preview — Manual Booking Sheet ({bookingNo})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Sheet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(false)}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable Body */}
              <div className="p-6 overflow-auto bg-white text-slate-900 space-y-4 print:p-0 font-sans">
                {/* Header Block */}
                <div className="text-center border-b border-slate-300 pb-3">
                  <h1 className="text-xl font-black uppercase tracking-wider text-slate-900">
                    Pakiza Knit Composite Ltd.
                  </h1>
                  <p className="text-xs text-slate-600 font-medium">
                    Central Merchandising &amp; Accessories Procurement Division
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Plot # 12-14, Gorai Industrial Area, Mirzapur, Tangail, Bangladesh
                  </p>
                  <div className="mt-2 inline-block bg-slate-100 border border-slate-300 px-4 py-1 rounded text-xs font-bold uppercase tracking-wide">
                    Manual Booking Order Sheet
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded border border-slate-200">
                  <div className="space-y-1">
                    <p>
                      <strong>Booking No:</strong>{" "}
                      <span className="font-mono text-teal-700 font-bold">{bookingNo}</span>
                    </p>
                    <p>
                      <strong>Supplier:</strong> {supplierName}
                    </p>
                    <p>
                      <strong>Booking Type:</strong> {bookingType}
                    </p>
                    <p>
                      <strong>Delivery Mode:</strong> {delMode}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p>
                      <strong>Booking Date:</strong> {bookingDate}
                    </p>
                    <p>
                      <strong>Delivery Date:</strong> {deliveryDate}
                    </p>
                    <p>
                      <strong>Delivery Place:</strong> {delPlace}
                    </p>
                    <p>
                      <strong>Pay Mode:</strong> {payMode}
                    </p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="space-y-1">
                  <span className="font-bold text-xs uppercase tracking-wide text-slate-700">
                    Manual Booking Items
                  </span>
                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead className="bg-slate-100 font-bold text-slate-800">
                      <tr>
                        <th className="border border-slate-300 p-1.5 text-center w-8">#</th>
                        <th className="border border-slate-300 p-1.5 text-left">Item Name</th>
                        <th className="border border-slate-300 p-1.5 text-center">UoM</th>
                        <th className="border border-slate-300 p-1.5 text-right">Booking QTY</th>
                        <th className="border border-slate-300 p-1.5 text-right">Rate ($)</th>
                        <th className="border border-slate-300 p-1.5 text-right">Total ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it, idx) => (
                        <tr key={it.id}>
                          <td className="border border-slate-300 p-1.5 text-center font-mono">
                            {idx + 1}
                          </td>
                          <td className="border border-slate-300 p-1.5 font-bold">
                            {it.itemName}
                            {it.itemCode && (
                              <span className="ml-1 text-slate-500 font-mono text-[10px]">
                                ({it.itemCode})
                              </span>
                            )}
                          </td>
                          <td className="border border-slate-300 p-1.5 text-center font-semibold text-teal-700">
                            {it.marketUnit}
                          </td>
                          <td className="border border-slate-300 p-1.5 text-right font-mono font-bold text-teal-700">
                            {(it.marketQty || 0).toLocaleString()}
                          </td>
                          <td className="border border-slate-300 p-1.5 text-right font-mono">
                            ${(it.rate || 0).toFixed(4)}
                          </td>
                          <td className="border border-slate-300 p-1.5 text-right font-mono font-bold text-emerald-700">
                            ${(it.total || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold">
                      <tr>
                        <td colSpan={3} className="border border-slate-300 p-1.5 text-right">
                          Total Summary:
                        </td>
                        <td className="border border-slate-300 p-1.5 text-right font-mono font-extrabold text-teal-800">
                          {totals.marketQty.toLocaleString()}
                        </td>
                        <td className="border border-slate-300 p-1.5"></td>
                        <td className="border border-slate-300 p-1.5 text-right font-mono text-emerald-800 font-extrabold">
                          ${totals.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Terms and Conditions */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-xs uppercase text-slate-700">
                    Terms &amp; Conditions
                  </span>
                  <pre className="text-[11px] text-slate-600 font-sans whitespace-pre-wrap mt-1">
                    {termsAndConditions}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MODAL 5: ATTACHMENT MODAL                                          */}
        {/* ================================================================== */}
        {showAttachmentModal && (
          <MMBookingAttachmentModal
            isOpen={showAttachmentModal}
            onClose={() => setShowAttachmentModal(false)}
            bookingNo={bookingNo}
            supplierName={supplierName}
            bookingTypeLabel="Manual Booking"
            attachments={attachments}
            onAddAttachment={(rec) => setAttachments((prev) => [...prev, rec])}
            onDeleteAttachment={(id) => setAttachments((prev) => prev.filter((a) => a.id !== id))}
          />
        )}
      </div>
    </MarketingMerchandisingLayout>
  );
}
