import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useRef } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  MMRepository,
  MMAccessoriesBooking,
  MMAccessoriesBookingLine,
} from "../lib/marketing-merchandising-data";
import {
  MMMasterDataRepository,
  MMFabricSetupRecord,
} from "../lib/merchandising-master-data";
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

export const BLOCK_FABRIC_BOOKING_ATTACHMENTS_STORAGE_KEY =
  "cripton_mm_block_fabric_booking_attachments_v1";

export type MMAccessoriesBookingAttachmentRecord = MMAttachmentRecord;

export type FabricBookingType = "Block Booking";

export interface MMFabricMasterItem {
  id: string;
  itemCode: string;
  itemName: string;
  fabricComposition: string;
  fabricType: string;
  gsm: number;
  category: "Fabric";
  unit: string;
  marketUnit: string;
  conversionFactor: number;
  defaultRate: number;
}

export const FABRIC_UOM_OPTIONS = [
  { uomCode: "KG", uomName: "Kilogram" },
  { uomCode: "TON (Metric Ton)", uomName: "Metric Ton" },
  { uomCode: "YDS", uomName: "Yards" },
  { uomCode: "MTR", uomName: "Meters" },
  { uomCode: "LBS", uomName: "Pounds" },
  { uomCode: "ROLL", uomName: "Rolls" },
];

export interface BlockFabricBookingItemRow {
  id: string;
  itemId?: string;
  itemCode?: string;
  itemName: string;
  fabricComposition?: string;
  fabricType?: string;
  gsm?: number;
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

interface BlockFabricBookingSearchParams {
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

export const Route = createFileRoute("/mm-block-fabric-booking")({
  validateSearch: (search: Record<string, unknown>): BlockFabricBookingSearchParams => ({
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
      { title: "Block Fabric Booking — Marketing & Merchandising | CriptonHRIS" },
      {
        name: "description",
        content:
          "Enterprise Block Fabric Booking form with searchable fabric setups, fabric library, and KG to TON Unit Relation conversion.",
      },
    ],
  }),
  component: MMBlockFabricBookingPage,
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
  const prefix = "BFB-2026/";
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

const DEFAULT_BOOKING_ITEMS: BlockFabricBookingItemRow[] = [
  {
    id: "bfbi-1",
    itemId: "fab-001",
    itemCode: "FAB-SJ-001",
    itemName: "100% Cotton Single Jersey 160 GSM",
    fabricComposition: "100% Cotton",
    fabricType: "Single Jersey",
    gsm: 160,
    unit: "KG",
    marketUnit: "TON (Metric Ton)",
    conversionFactor: 1000,
    bookQty: 5000,
    marketQty: 5.0,
    storeRcvdQty: 0,
    rate: 4.8,
    total: 24000.0,
  },
  {
    id: "bfbi-2",
    itemId: "fab-002",
    itemCode: "FAB-SJ-002",
    itemName: "95% Cotton 5% Spandex Single Jersey 190 GSM",
    fabricComposition: "95% Cotton 5% Spandex",
    fabricType: "Single Jersey",
    gsm: 190,
    unit: "KG",
    marketUnit: "TON (Metric Ton)",
    conversionFactor: 1000,
    bookQty: 2500,
    marketQty: 2.5,
    storeRcvdQty: 0,
    rate: 5.5,
    total: 13750.0,
  },
];

function MMBlockFabricBookingPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const isViewMode = search.mode === "view";

  // Master Data & Persisted Lists
  const [allBookings, setAllBookings] = useState<MMAccessoriesBooking[]>([]);
  const [fabricMasterList, setFabricMasterList] = useState<MMFabricMasterItem[]>([]);
  const [uomsList, setUomsList] = useState<UOM[]>([]);

  // Active Booking Form State
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string>("Draft");
  const [bookingNo, setBookingNo] = useState<string>("BFB-2026/01");
  const [ourRef, setOurRef] = useState<string>("JOB-FAB-2026-001");
  const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [payMode, setPayMode] = useState<string>("At Sight LC");

  // Supplier & Delivery Information
  const [supplierId, setSupplierId] = useState<string>("sup-005");
  const [supplierName, setSupplierName] = useState<string>("Pakiza Knitting & Dyeing Ltd");
  const [bookingType, setBookingType] = useState<string>("Block Booking");
  const [delMode, setDelMode] = useState<string>("Road");
  const [delPlace, setDelPlace] = useState<string>("Factory Mill Store (Gazipur)");
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
    "Block booking for seasonal bulk order. Fabric must match approved composition, GSM, width, and standard finishing specs."
  );
  const [termsAndConditions, setTermsAndConditions] = useState<string>(
    "1. Quality testing standard: 4-Point System benchmark, Color Fastness Grade 4+.\n2. Quantity tolerance: Max +/- 3% acceptable.\n3. Delivery F.O.R. Pakiza Knitting & Dyeing Mill Store (Gazipur).\n4. Defective, shading, or off-spec fabric lot subject to replacement within 48 hours."
  );
  const [piReference, setPiReference] = useState<string>("Not Linked");

  // Grid Items State
  const [items, setItems] = useState<BlockFabricBookingItemRow[]>(DEFAULT_BOOKING_ITEMS);

  // Active inline search state per row for autocomplete
  const [activeInlineRowId, setActiveInlineRowId] = useState<string | null>(null);

  // Modals & Popovers
  const [itemPickerRowId, setItemPickerRowId] = useState<string | null>(null);
  const [itemSearchQuery, setItemSearchQuery] = useState<string>("");
  const [conversionModal, setConversionModal] = useState<ConversionModalState>({
    isOpen: false,
    rowId: "",
    marketUnit: "",
    consumptionUnit: "",
    factor: 1000,
    factorInput: "1000",
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
    const loadedBookings = MMRepository.getBlockFabricBookings();
    setAllBookings(loadedBookings);

    // Load Fabric Setup Master Data into Fabric Master List
    try {
      const fabricSetups: MMFabricSetupRecord[] = MMMasterDataRepository.getFabricSetups();
      if (fabricSetups && fabricSetups.length > 0) {
        const mappedItems: MMFabricMasterItem[] = fabricSetups.map((fs, idx) => ({
          id: fs.id || `fab-setup-${idx + 1}`,
          itemCode: fs.code || `FAB-${idx + 1}`,
          itemName: fs.fabricName || `${fs.fabricComposition || ""} ${fs.fabricType || ""} ${fs.gsm || ""} GSM`.trim(),
          fabricComposition: fs.fabricComposition || "",
          fabricType: fs.fabricType || "",
          gsm: fs.gsm || 0,
          category: "Fabric",
          unit: "KG",
          marketUnit: "TON (Metric Ton)",
          conversionFactor: 1000,
          defaultRate: 4.8,
        }));
        setFabricMasterList(mappedItems);
      } else {
        // Fallback default fabric items
        setFabricMasterList([
          {
            id: "fab-001",
            itemCode: "FAB-SJ-001",
            itemName: "100% Cotton Single Jersey 160 GSM",
            fabricComposition: "100% Cotton",
            fabricType: "Single Jersey",
            gsm: 160,
            category: "Fabric",
            unit: "KG",
            marketUnit: "TON (Metric Ton)",
            conversionFactor: 1000,
            defaultRate: 4.8,
          },
          {
            id: "fab-002",
            itemCode: "FAB-SJ-002",
            itemName: "95% Cotton 5% Spandex Single Jersey 190 GSM",
            fabricComposition: "95% Cotton 5% Spandex",
            fabricType: "Single Jersey",
            gsm: 190,
            category: "Fabric",
            unit: "KG",
            marketUnit: "TON (Metric Ton)",
            conversionFactor: 1000,
            defaultRate: 5.5,
          },
          {
            id: "fab-003",
            itemCode: "FAB-RIB-001",
            itemName: "100% Cotton 2x2 Rib 220 GSM",
            fabricComposition: "100% Cotton",
            fabricType: "Rib",
            gsm: 220,
            category: "Fabric",
            unit: "KG",
            marketUnit: "TON (Metric Ton)",
            conversionFactor: 1000,
            defaultRate: 5.2,
          },
          {
            id: "fab-004",
            itemCode: "FAB-FT-001",
            itemName: "60% Cotton 40% Polyester French Terry 260 GSM",
            fabricComposition: "60% Cotton 40% Polyester",
            fabricType: "French Terry",
            gsm: 260,
            category: "Fabric",
            unit: "KG",
            marketUnit: "TON (Metric Ton)",
            conversionFactor: 1000,
            defaultRate: 4.9,
          },
        ]);
      }
    } catch {
      // Ignored
    }

    setUomsList(DEFAULT_UOMS);

    // Handle incoming search params
    const targetBookingId = search.bookingId || search.id;
    if (targetBookingId) {
      const existing = loadedBookings.find((b) => b.id === targetBookingId || b.bookingNo === targetBookingId);
      if (existing) {
        populateFormFromBooking(existing);
        return;
      }
    }

    // Default sequential booking number for newly created block fabric booking
    const nextNo = generateNextBookingNumber(loadedBookings);
    setBookingNo(nextNo);
  }, [search.bookingId, search.id]);

  // Load attachments when editingBookingId or bookingNo changes
  useEffect(() => {
    const activeId = editingBookingId || bookingNo;
    if (!activeId) return;

    try {
      const raw = localStorage.getItem(BLOCK_FABRIC_BOOKING_ATTACHMENTS_STORAGE_KEY);
      if (raw) {
        const allAtts: MMAttachmentRecord[] = JSON.parse(raw);
        const matched = allAtts.filter((a) => a.bookingId === activeId || a.bookingId === bookingNo);
        setAttachments(matched);
      }
    } catch {
      // Ignored
    }
  }, [editingBookingId, bookingNo]);

  // Helper to populate form fields from an existing booking
  const populateFormFromBooking = (b: MMAccessoriesBooking) => {
    setEditingBookingId(b.id);
    setBookingStatus(b.status || "Draft");
    setBookingNo(b.bookingNo || "");
    setOurRef(b.ourRef || "JOB-FAB-2026-001");
    setBookingDate(b.bookingDate || new Date().toISOString().slice(0, 10));
    setDeliveryDate(b.deliveryDate || "");
    setPayMode(b.payMode || b.paymentTerms || "At Sight LC");
    setSupplierId(b.supplierId || "sup-005");
    setSupplierName(b.supplierName || "Pakiza Knitting & Dyeing Ltd");
    setBookingType("Block Booking");
    setDelMode(b.delMode || b.deliveryMode || "Road");
    setDelPlace(b.delPlace || b.deliveryPlace || "Factory Mill Store (Gazipur)");
    setNote(b.bookingDesc || "Block Fabric Booking");
    setPiReference(b.piReference || "Not Linked");

    if (b.items && b.items.length > 0) {
      const mapped: BlockFabricBookingItemRow[] = b.items.map((it: any, idx) => {
        const unit = it.unit || "KG";
        const marketUnit = it.marketUnit || "TON (Metric Ton)";
        const factor = it.conversionFactor || 1000;
        const bQty = Number(it.bookedQty ?? it.bookQty ?? 0);
        const mQty = it.marketQty !== undefined && it.marketQty !== null ? Number(it.marketQty) : Math.round((bQty / factor) * 1000) / 1000;
        const rate = Number(it.bookedRate ?? it.rate ?? 0);
        const total = it.totalAmount !== undefined ? Number(it.totalAmount) : Math.round(bQty * rate * 100) / 100;

        return {
          id: it.bookingItemId || `row-${idx + 1}`,
          itemId: it.preCostItemId || it.estimationItemId || "",
          itemCode: it.itemCode || "",
          itemName: it.itemDescription || it.itemName || "",
          unit,
          marketUnit,
          conversionFactor: factor,
          bookQty: bQty,
          marketQty: mQty,
          storeRcvdQty: 0,
          rate,
          total,
        };
      });
      setItems(mapped);
    } else if (b.lines && b.lines.length > 0) {
      const mapped: BlockFabricBookingItemRow[] = b.lines.map((l: any, idx) => ({
        id: l.id || `row-${idx + 1}`,
        itemId: l.accessoryId || "",
        itemCode: l.itemCode || "",
        itemName: l.accessoryItem || l.trimType || "Fabric Item",
        unit: l.unit || "KG",
        marketUnit: "TON (Metric Ton)",
        conversionFactor: 1000,
        bookQty: Number(l.bookQty) || 0,
        marketQty: Math.round(((Number(l.bookQty) || 0) / 1000) * 1000) / 1000,
        storeRcvdQty: Number(l.receivedQty || l.storeRcvdQty || 0),
        rate: Number(l.rate) || 0,
        total: Number(l.bookAmt) || 0,
      }));
      setItems(mapped);
    }
  };

  // Grand Totals Calculation
  const grandTotals = useMemo(() => {
    let totalBookQty = 0;
    let totalMarketQty = 0;
    let totalStoreRcvd = 0;
    let totalAmount = 0;

    items.forEach((r) => {
      totalBookQty += Number(r.bookQty) || 0;
      totalMarketQty += Number(r.marketQty) || 0;
      totalStoreRcvd += Number(r.storeRcvdQty) || 0;
      totalAmount += Number(r.total) || 0;
    });

    return {
      totalBookQty: Math.round(totalBookQty * 100) / 100,
      totalMarketQty: Math.round(totalMarketQty * 1000) / 1000,
      totalStoreRcvd: Math.round(totalStoreRcvd * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
    };
  }, [items]);

  // Filtered fabric items in picker modal
  const filteredFabricItems = useMemo(() => {
    if (!itemSearchQuery.trim()) return fabricMasterList;
    const q = itemSearchQuery.toLowerCase();
    return fabricMasterList.filter(
      (it) =>
        it.itemName.toLowerCase().includes(q) ||
        it.itemCode.toLowerCase().includes(q) ||
        (it.fabricComposition && it.fabricComposition.toLowerCase().includes(q)) ||
        (it.fabricType && it.fabricType.toLowerCase().includes(q))
    );
  }, [fabricMasterList, itemSearchQuery]);

  // Handle row item selection from fabric library modal or dropdown
  const handleSelectItem = (rowId: string, fabricItem: MMFabricMasterItem | { itemName: string; itemCode?: string; gsm?: number; fabricComposition?: string; fabricType?: string }) => {
    setItems((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const newRate = (fabricItem as any).defaultRate || r.rate || 4.8;
        const newTotal = Math.round(r.bookQty * newRate * 100) / 100;
        return {
          ...r,
          itemId: (fabricItem as any).id || r.itemId,
          itemCode: fabricItem.itemCode || r.itemCode,
          itemName: fabricItem.itemName,
          fabricComposition: fabricItem.fabricComposition,
          fabricType: fabricItem.fabricType,
          gsm: fabricItem.gsm,
          rate: newRate,
          total: newTotal,
        };
      })
    );
    setItemPickerRowId(null);
    setItemSearchQuery("");
    setActiveInlineRowId(null);
  };

  // Unit changes
  const handleUnitChange = (rowId: string, newUnit: string) => {
    setItems((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        return { ...r, unit: newUnit };
      })
    );
  };

  // Market unit change: triggers conversion modal if market unit != consumption unit
  const handleMarketUnitChange = (rowId: string, newMarketUnit: string) => {
    const row = items.find((r) => r.id === rowId);
    if (!row) return;

    if (newMarketUnit === row.unit) {
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
      return;
    }

    const defaultFactor =
      (newMarketUnit.includes("TON") && row.unit === "KG") ||
      (newMarketUnit === "KG" && row.unit === "G")
        ? 1000
        : row.conversionFactor && row.conversionFactor > 0
        ? row.conversionFactor
        : 1000;

    setConversionModal({
      isOpen: true,
      rowId,
      marketUnit: newMarketUnit,
      consumptionUnit: row.unit,
      factor: defaultFactor,
      factorInput: defaultFactor.toString(),
      previousMarketUnit: row.marketUnit,
    });
  };

  // Cancel conversion dialog
  const handleCancelConversion = () => {
    setConversionModal((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  // Confirm conversion factor dialog
  const handleConfirmConversion = () => {
    const parsedFactor = parseFloat(conversionModal.factorInput);
    if (isNaN(parsedFactor) || parsedFactor <= 0) {
      toast.error("Please enter a valid positive factor greater than 0.");
      return;
    }

    setItems((prev) =>
      prev.map((r) => {
        if (r.id !== conversionModal.rowId) return r;
        const newMarketQty = Math.round((r.bookQty / parsedFactor) * 1000) / 1000;
        return {
          ...r,
          marketUnit: conversionModal.marketUnit,
          conversionFactor: parsedFactor,
          marketQty: newMarketQty,
        };
      })
    );

    setConversionModal((prev) => ({ ...prev, isOpen: false }));
    toast.success(
      `Relation confirmed: 1 ${conversionModal.marketUnit} = ${parsedFactor.toLocaleString()} ${conversionModal.consumptionUnit}`
    );
  };

  // Open existing factor for edit
  const handleOpenConversionForEdit = (row: BlockFabricBookingItemRow) => {
    setConversionModal({
      isOpen: true,
      rowId: row.id,
      marketUnit: row.marketUnit,
      consumptionUnit: row.unit,
      factor: row.conversionFactor,
      factorInput: row.conversionFactor.toString(),
      previousMarketUnit: row.marketUnit,
    });
  };

  // Bidirectional Quantity Calculations:
  // 1. User updates Consumption Qty (KG) -> auto-computes Market Qty (TON)
  const handleBookQtyChange = (rowId: string, val: number) => {
    setItems((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const bQty = Math.max(0, val);
        const factor = r.conversionFactor > 0 ? r.conversionFactor : 1;
        const mQty = Math.round((bQty / factor) * 1000) / 1000;
        const total = Math.round(bQty * r.rate * 100) / 100;
        return {
          ...r,
          bookQty: bQty,
          marketQty: mQty,
          total,
        };
      })
    );
  };

  // 2. User updates Market Qty (TON) -> auto-computes Consumption Qty (KG)
  const handleMarketQtyChange = (rowId: string, val: number) => {
    setItems((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const mQty = Math.max(0, val);
        const factor = r.conversionFactor > 0 ? r.conversionFactor : 1;
        const bQty = Math.round(mQty * factor * 100) / 100;
        const total = Math.round(bQty * r.rate * 100) / 100;
        return {
          ...r,
          marketQty: mQty,
          bookQty: bQty,
          total,
        };
      })
    );
  };

  // Rate Change
  const handleRateChange = (rowId: string, val: number) => {
    setItems((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const rate = Math.max(0, val);
        const total = Math.round(r.bookQty * rate * 100) / 100;
        return { ...r, rate, total };
      })
    );
  };

  // Add Item Row
  const handleAddItemRow = () => {
    const nextId = `bfbi-${Date.now()}`;
    const defaultFabric = fabricMasterList[0];
    const newRow: BlockFabricBookingItemRow = {
      id: nextId,
      itemId: defaultFabric?.id || "fab-001",
      itemCode: defaultFabric?.itemCode || "FAB-SJ-001",
      itemName: defaultFabric?.itemName || "100% Cotton Single Jersey 160 GSM",
      fabricComposition: defaultFabric?.fabricComposition || "100% Cotton",
      fabricType: defaultFabric?.fabricType || "Single Jersey",
      gsm: defaultFabric?.gsm || 160,
      unit: "KG",
      marketUnit: "TON (Metric Ton)",
      conversionFactor: 1000,
      bookQty: 1000,
      marketQty: 1.0,
      storeRcvdQty: 0,
      rate: defaultFabric?.defaultRate || 4.8,
      total: 4800.0,
    };
    setItems((prev) => [...prev, newRow]);
  };

  // Remove Item Row
  const handleRemoveRow = (rowId: string) => {
    if (items.length <= 1) {
      toast.warning("At least one fabric booking line item is required.");
      return;
    }
    setItems((prev) => prev.filter((r) => r.id !== rowId));
  };

  // Construct Save Payload
  const constructBookingPayload = (newStatus?: string): MMAccessoriesBooking => {
    const activeId = editingBookingId || `bfb-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const bookingLines: MMAccessoriesBookingLine[] = items.map((r, idx) => ({
      id: r.id || `line-${idx + 1}`,
      accessoriesBookingId: activeId,
      bookingNo,
      estimationId: "est-block-fab",
      estimationItemId: r.itemId || `fab-${idx + 1}`,
      accessoryId: r.itemId || `fab-${idx + 1}`,
      accessoryItem: r.itemName,
      trimType: r.fabricType || "Fabric",
      itemCode: r.itemCode || "",
      specification: r.itemName,
      supplierId,
      supplierName,
      unit: r.unit,
      reqQty: r.bookQty,
      bookQty: r.bookQty,
      rate: r.rate,
      bookAmt: r.total,
      currency: "USD",
      ourRef,
      style: "",
      season: "Advance Fabric Pool",
      buyerNameSnapshot: "Internal Advance Fabric Pool",
      brandSnapshot: "Cripton Fabric",
      departmentSnapshot: "Knitting & Dyeing Division",
      grpType: "Fabric",
      description: r.itemName,
    }));

    const mappedItems: any[] = items.map((r, idx) => ({
      bookingItemId: r.id,
      estimationItemId: r.itemId || `fab-${idx + 1}`,
      orderId: "",
      orderNo: "",
      styleNo: "",
      poNumber: "",
      preCostItemId: r.itemId || `fab-${idx + 1}`,
      itemDescription: r.itemName,
      specification: r.itemName,
      sizeOrDimension: r.gsm ? `${r.gsm} GSM` : "",
      color: "Solid / Greige",
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
    }));

    return {
      id: activeId,
      bookingNo,
      ourRef,
      bookingDate,
      deliveryDate,
      reqDate,
      supplierId,
      supplierName,
      bookingDesc: note,
      payMode,
      paymentTerms: payMode,
      deliveryMode: delMode,
      delMode,
      deliveryPlace: delPlace,
      delPlace,
      bookType: "Block Fabric Booking",
      currency: "USD",
      conversionRate: 1.0,
      status: (newStatus || bookingStatus || "Draft") as any,
      piReference: piReference || "Not Linked",
      totalBookedQty: grandTotals.totalBookQty,
      totalBookedAmount: grandTotals.totalAmount,
      totalPreCostAmount: grandTotals.totalAmount,
      totalSavingAmount: 0,
      overallSavingPct: 0,
      createdBy: "Senior Merchandiser (Tanvir Ahmed)",
      createdDate: bookingDate,
      createdAt: nowIso,
      updatedAt: nowIso,
      lines: bookingLines,
      items: mappedItems,
    };
  };

  // Save Booking
  const handleSaveBooking = (statusOverride?: string) => {
    if (!bookingNo.trim()) {
      toast.error("Booking Number is required.");
      return;
    }
    if (!supplierName.trim()) {
      toast.error("Fabric Supplier / Mill is required.");
      return;
    }
    if (items.length === 0) {
      toast.error("At least one fabric item is required.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = constructBookingPayload(statusOverride);
      MMRepository.saveBlockFabricBooking(payload);
      setEditingBookingId(payload.id);
      if (statusOverride) {
        setBookingStatus(statusOverride);
      }
      toast.success(`Block Fabric Booking ${payload.bookingNo} saved successfully!`);
    } catch {
      toast.error("Failed to save block fabric booking.");
    } finally {
      setIsSaving(false);
    }
  };

  // Submit for Authorization
  const handleSubmitForAuthorization = () => {
    if (!bookingNo.trim()) {
      toast.error("Booking Number is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = constructBookingPayload("Pending");
      MMRepository.saveBlockFabricBooking(payload);
      MMRepository.submitBlockFabricBooking(payload.id, "Tanvir Ahmed");
      setEditingBookingId(payload.id);
      setBookingStatus("Pending");
      toast.success(`Block Fabric Booking ${payload.bookingNo} submitted for authorization!`);
    } catch {
      toast.error("Failed to submit block fabric booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Booking
  const handleDeleteBooking = () => {
    if (!editingBookingId) {
      toast.error("This booking has not been persisted yet.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete Block Fabric Booking ${bookingNo}?`)) {
      const ok = MMRepository.deleteBlockFabricBooking(editingBookingId);
      if (ok) {
        toast.success(`Booking ${bookingNo} deleted.`);
        navigate({ to: "/mm-block-fabric-booking-register" });
      } else {
        toast.error("Failed to delete booking.");
      }
    }
  };

  // Navigate to PI Creation
  const handleOpenPI = () => {
    let savedBooking = editingBookingId ? MMRepository.getBlockFabricBookingById(editingBookingId) : undefined;
    if (!savedBooking) {
      handleSaveBooking("Draft");
      savedBooking = constructBookingPayload("Draft");
      MMRepository.saveBlockFabricBooking(savedBooking);
    }

    toast.info(`Opening Proforma Invoice Entry for Block Fabric Booking ${savedBooking.bookingNo}...`);

    navigate({
      to: "/mm-proforma-invoice-create",
      search: {
        bookingId: savedBooking.id,
        bookingNo: savedBooking.bookingNo,
        source: "block-fabric-booking",
        item: "Block Booking",
      } as any,
    });
  };

  const handleExit = () => {
    navigate({ to: "/mm-block-fabric-booking-register" });
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-block-fabric-booking"
      title="Block Fabric Booking"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Booking Information" },
        { label: "Block Fabric Booking", to: "/mm-block-fabric-booking-register" },
        { label: "Create Fabric Block Booking" },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/mm-block-fabric-booking-register"
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
          <button
            type="button"
            onClick={() => setShowAttachmentModal(true)}
            className="relative px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <Paperclip className="w-3.5 h-3.5 text-slate-500" />
            <span>Attachments</span>
            {attachments.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-teal-500 absolute -top-0.5 -right-0.5" />
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-3 p-4 max-w-[1600px] mx-auto text-xs">
        {/* Status Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Block Fabric Booking
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-300 font-bold">
              {bookingNo}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                bookingStatus === "Approved"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : bookingStatus === "Pending"
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-slate-100 text-slate-700 border border-slate-300"
              }`}
            >
              {bookingStatus}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenPI}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Create PI</span>
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 1. TOP CONTROL PANEL & HEADER DETAILS                                */}
        {/* ==================================================================== */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
              <Package className="w-4 h-4 text-teal-600" />
              <span>Fabric Booking Information</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span>Date: {bookingDate}</span>
              <span>•</span>
              <span>Our Ref: {ourRef}</span>
            </div>
          </div>

          <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
            {/* Booking No */}
            <div>
              <label className="text-slate-500 block text-[11px] mb-1 font-semibold">
                Booking No. <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isViewMode}
                value={bookingNo}
                onChange={(e) => setBookingNo(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-teal-700 dark:text-teal-400 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Our Ref / Job */}
            <div>
              <label className="text-slate-500 block text-[11px] mb-1 font-semibold">
                Our Ref. / Job No.
              </label>
              <input
                type="text"
                disabled={isViewMode}
                value={ourRef}
                onChange={(e) => setOurRef(e.target.value)}
                placeholder="e.g. JOB-FAB-2026-001"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Booking Date */}
            <div>
              <label className="text-slate-500 block text-[11px] mb-1 font-semibold">
                Booking Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                disabled={isViewMode}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Delivery Date */}
            <div>
              <label className="text-slate-500 block text-[11px] mb-1 font-semibold">
                Delivery Date
              </label>
              <input
                type="date"
                disabled={isViewMode}
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Fabric Supplier / Mill */}
            <div className="col-span-2">
              <label className="text-slate-500 block text-[11px] mb-1 font-semibold">
                Fabric Supplier / Mill <span className="text-rose-500">*</span>
              </label>
              <SearchableSelect
                options={supplierOptions}
                value={supplierId}
                onChange={handleSupplierChange}
                placeholder="Search or Select Fabric Mill..."
                className="w-full text-xs"
              />
            </div>

            {/* Booking Type (Readonly) */}
            <div>
              <label className="text-slate-500 block text-[11px] mb-1 font-semibold">
                Booking Type
              </label>
              <input
                type="text"
                readOnly
                value={bookingType}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
              />
            </div>

            {/* Pay Mode */}
            <div>
              <label className="text-slate-500 block text-[11px] mb-1 font-semibold">
                Pay Mode / Terms
              </label>
              <select
                disabled={isViewMode}
                value={payMode}
                onChange={(e) => setPayMode(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="At Sight LC">At Sight LC</option>
                <option value="60 Days Deferred LC">60 Days Deferred LC</option>
                <option value="90 Days Usance LC">90 Days Usance LC</option>
                <option value="TT 30 Days">TT 30 Days</option>
                <option value="Cash in Advance">Cash in Advance</option>
              </select>
            </div>

            {/* Delivery Mode */}
            <div>
              <label className="text-slate-500 block text-[11px] mb-1 font-semibold">
                Delivery Mode
              </label>
              <select
                disabled={isViewMode}
                value={delMode}
                onChange={(e) => setDelMode(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Road">Road / Covered Van</option>
                <option value="Air">Air Freight</option>
                <option value="Sea">Sea Freight</option>
              </select>
            </div>

            {/* Delivery Place */}
            <div className="col-span-2">
              <label className="text-slate-500 block text-[11px] mb-1 font-semibold">
                Delivery Place
              </label>
              <input
                type="text"
                disabled={isViewMode}
                value={delPlace}
                onChange={(e) => setDelPlace(e.target.value)}
                placeholder="e.g. Factory Mill Store (Gazipur)"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            {/* Notes / Remarks */}
            <div className="col-span-2 md:col-span-4 lg:col-span-6">
              <label className="text-slate-500 block text-[11px] mb-1 font-semibold">
                Booking Remarks &amp; Special Instructions
              </label>
              <input
                type="text"
                disabled={isViewMode}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter special instructions or quality specifications..."
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 2. FABRIC BOOKING DETAILS TABLE                                      */}
        {/* Searchable Fabric Item Name, KG / TON conversion, bidirectional      */}
        {/* ==================================================================== */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
              <Package className="w-4 h-4 text-teal-600" />
              <span>Fabric Booking Details</span>
              <span className="text-slate-400 font-normal">({items.length} items)</span>
            </div>

            {!isViewMode && (
              <button
                type="button"
                onClick={handleAddItemRow}
                className="px-3 py-1 rounded-md bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Fabric Line</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-700 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 w-12">
                    #
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-200 dark:border-slate-700 min-w-[320px]">
                    Fabric Item Name (Fabric Setup Master Data)
                  </th>
                  <th className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 w-28">
                    Unit
                  </th>
                  <th className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 w-36 bg-teal-50/50 dark:bg-teal-950/20 text-teal-800 dark:text-teal-300">
                    Market Unit
                  </th>
                  <th className="py-2.5 px-3 text-center border-r border-slate-200 dark:border-slate-700 w-44">
                    Unit Relation / Factor
                  </th>
                  <th className="py-2.5 px-3 text-right border-r border-slate-200 dark:border-slate-700 w-32">
                    Book Qty (KG)
                  </th>
                  <th className="py-2.5 px-3 text-right border-r border-slate-200 dark:border-slate-700 w-32 bg-teal-50/40 dark:bg-teal-950/10 text-teal-800 dark:text-teal-300">
                    Market Qty (TON)
                  </th>
                  <th className="py-2.5 px-3 text-right border-r border-slate-200 dark:border-slate-700 w-28">
                    Rate ($/KG)
                  </th>
                  <th className="py-2.5 px-3 text-right border-r border-slate-200 dark:border-slate-700 w-32">
                    Amount ($)
                  </th>
                  {!isViewMode && (
                    <th className="py-2.5 px-3 text-center w-16">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {items.map((r, idx) => {
                  const isConverted = r.marketUnit !== r.unit && r.conversionFactor > 0;
                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Index */}
                      <td className="py-2 px-3 text-center font-mono text-slate-500 border-r border-slate-200 dark:border-slate-800">
                        {idx + 1}
                      </td>

                      {/* Fabric Item Name: Searchable Dropdown / Selector with Library picker button */}
                      <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-1.5">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              disabled={isViewMode}
                              placeholder="Type or search fabric item..."
                              value={r.itemName}
                              onFocus={() => !isViewMode && setActiveInlineRowId(r.id)}
                              onChange={(e) => {
                                const val = e.target.value;
                                setItems((prev) =>
                                  prev.map((row) => (row.id === r.id ? { ...row, itemName: val } : row))
                                );
                                setActiveInlineRowId(r.id);
                              }}
                              className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-teal-500"
                            />

                            {/* Inline Autocomplete Dropdown from Fabric Setup Master Data */}
                            {activeInlineRowId === r.id && !isViewMode && (
                              <div
                                className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl max-h-56 overflow-y-auto z-40 text-xs"
                                onMouseDown={(e) => e.preventDefault()}
                              >
                                {fabricMasterList
                                  .filter((f) =>
                                    !r.itemName ||
                                    f.itemName.toLowerCase().includes(r.itemName.toLowerCase()) ||
                                    f.itemCode.toLowerCase().includes(r.itemName.toLowerCase())
                                  )
                                  .slice(0, 10)
                                  .map((f) => (
                                    <div
                                      key={f.id}
                                      onClick={() => handleSelectItem(r.id, f)}
                                      className="px-3 py-1.5 hover:bg-teal-50 dark:hover:bg-teal-950/40 cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0 flex items-center justify-between gap-2"
                                    >
                                      <div>
                                        <div className="font-semibold text-slate-900 dark:text-white">
                                          {f.itemName}
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                          {f.fabricComposition} • {f.fabricType} {f.gsm ? `• ${f.gsm} GSM` : ""}
                                        </div>
                                      </div>
                                      <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                                        [{f.itemCode}]
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>

                          {/* Quick Library Picker Button */}
                          <button
                            type="button"
                            disabled={isViewMode}
                            onClick={() => {
                              setItemPickerRowId(r.id);
                              setItemSearchQuery("");
                            }}
                            className="p-1.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-teal-700 dark:text-teal-400 cursor-pointer transition shrink-0"
                            title="Open Fabric Setup Master Library"
                          >
                            <Search className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Unit */}
                      <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-800 text-center">
                        <select
                          disabled={isViewMode}
                          value={r.unit}
                          onChange={(e) => handleUnitChange(r.id, e.target.value)}
                          className="w-full px-1.5 py-1 text-center font-mono font-bold text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-1 focus:ring-teal-500"
                        >
                          {FABRIC_UOM_OPTIONS.map((u) => (
                            <option key={u.uomCode} value={u.uomCode}>
                              {u.uomCode}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Market Unit */}
                      <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-800 text-center bg-teal-50/20 dark:bg-teal-950/10">
                        <select
                          disabled={isViewMode}
                          value={r.marketUnit}
                          onChange={(e) => handleMarketUnitChange(r.id, e.target.value)}
                          className="w-full px-1.5 py-1 text-center font-mono font-bold text-xs rounded border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 focus:ring-1 focus:ring-teal-500"
                          title="Select Market Unit (conversion dialog opens if different from Unit)"
                        >
                          {FABRIC_UOM_OPTIONS.map((u) => (
                            <option key={u.uomCode} value={u.uomCode}>
                              {u.uomName ? `${u.uomCode} (${u.uomName})` : u.uomCode}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Unit Relation / Factor */}
                      <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-800 text-center">
                        {isConverted ? (
                          <button
                            type="button"
                            disabled={isViewMode}
                            onClick={() => handleOpenConversionForEdit(r)}
                            className="px-2 py-0.5 rounded bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 border border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-200 font-mono text-[10px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                            title="Click to view or adjust conversion relation factor"
                          >
                            <Scale className="w-3 h-3 text-teal-600 shrink-0" />
                            <span>
                              1 {r.marketUnit.includes("TON") ? "TON" : r.marketUnit} = {r.conversionFactor.toLocaleString()} {r.unit}
                            </span>
                          </button>
                        ) : (
                          <span className="font-mono text-slate-400 text-[11px]">1 : 1</span>
                        )}
                      </td>

                      {/* Book Qty (KG) */}
                      <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-800 text-right">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          disabled={isViewMode}
                          value={r.bookQty || ""}
                          onChange={(e) => handleBookQtyChange(r.id, parseFloat(e.target.value) || 0)}
                          className="w-28 px-2 py-1 text-right font-mono font-bold text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-1 focus:ring-teal-500"
                        />
                      </td>

                      {/* Market Qty (TON) */}
                      <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-800 text-right bg-teal-50/20 dark:bg-teal-950/10">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          disabled={isViewMode}
                          value={r.marketQty || ""}
                          onChange={(e) => handleMarketQtyChange(r.id, parseFloat(e.target.value) || 0)}
                          className="w-28 px-2 py-1 text-right font-mono font-bold text-xs rounded border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 focus:ring-1 focus:ring-teal-500"
                        />
                      </td>

                      {/* Rate ($/KG) */}
                      <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-800 text-right">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          disabled={isViewMode}
                          value={r.rate || ""}
                          onChange={(e) => handleRateChange(r.id, parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 text-right font-mono font-bold text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-1 focus:ring-teal-500"
                        />
                      </td>

                      {/* Amount ($) */}
                      <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-800 text-right font-mono font-bold text-slate-900 dark:text-white">
                        $
                        {r.total.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      {/* Action */}
                      {!isViewMode && (
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(r.id)}
                            className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                            title="Delete line"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>

              {/* Table Footer / Grand Totals */}
              <tfoot>
                <tr className="bg-slate-100 dark:bg-slate-800/80 font-bold border-t border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
                  <td colSpan={5} className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px] border-r border-slate-300 dark:border-slate-700">
                    Grand Totals:
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono border-r border-slate-300 dark:border-slate-700">
                    {grandTotals.totalBookQty.toLocaleString()} KG
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-teal-700 dark:text-teal-300 border-r border-slate-300 dark:border-slate-700">
                    {grandTotals.totalMarketQty.toLocaleString()} TON
                  </td>
                  <td className="py-2.5 px-3 text-right border-r border-slate-300 dark:border-slate-700 text-slate-400 font-normal">
                    —
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-teal-700 dark:text-teal-300 border-r border-slate-300 dark:border-slate-700">
                    $
                    {grandTotals.totalAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  {!isViewMode && <td />}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 3. FOOTER ACTIONS & CONTROLS                                         */}
        {/* ==================================================================== */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
            <button
              type="button"
              onClick={() => setShowAttachmentModal(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer"
            >
              Manage Attachments ({attachments.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!isViewMode && (
              <>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSaveBooking("Draft")}
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Saving..." : "Save Draft"}</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitForAuthorization}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Submitting..." : "Submit for Authorization"}</span>
                </button>

                {editingBookingId && (
                  <button
                    type="button"
                    onClick={handleDeleteBooking}
                    className="px-3 py-2 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/40 font-semibold text-xs transition cursor-pointer"
                  >
                    Delete
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              onClick={handleExit}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* MODAL 1: SEARCHABLE FABRIC SETUP LIBRARY PICKER                      */}
        {/* ==================================================================== */}
        {itemPickerRowId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col text-xs overflow-hidden">
              {/* Header */}
              <div className="bg-slate-800 text-white px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-teal-400" />
                  <span className="font-bold text-sm">Select Fabric Item from Fabric Setup Master Data</span>
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
                    placeholder="Search fabric items by name, code, composition, type, or GSM..."
                    value={itemSearchQuery}
                    onChange={(e) => setItemSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Item Table */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold sticky top-0 border-b border-slate-200 dark:border-slate-700 z-10">
                    <tr>
                      <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 w-32">Fabric Code</th>
                      <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-700">Fabric Item Name</th>
                      <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-700">Composition &amp; Type</th>
                      <th className="py-2 px-3 text-center border-r border-slate-200 dark:border-slate-700 w-20">GSM</th>
                      <th className="py-2 px-3 text-center w-20">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredFabricItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                          No matching fabric setup items found.
                        </td>
                      </tr>
                    ) : (
                      filteredFabricItems.map((item) => (
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
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800">
                            {item.fabricComposition} {item.fabricType ? `• ${item.fabricType}` : ""}
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-medium border-r border-slate-200 dark:border-slate-800">
                            {item.gsm || "—"}
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-teal-700 dark:text-teal-300">
                            {item.unit || "KG"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="p-3 bg-slate-100 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
                <span>Total Fabric Setups: {filteredFabricItems.length}</span>
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

        {/* ==================================================================== */}
        {/* MODAL 2: UNIT CONVERSION RELATION DIALOG                             */}
        {/* ==================================================================== */}
        {conversionModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-md w-full overflow-hidden text-xs">
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
                  <div className="flex items-center justify-between gap-3">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                      Market Unit:
                    </label>
                    <div className="w-48 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-mono font-bold text-teal-700 dark:text-teal-400 text-xs">
                      {conversionModal.marketUnit}
                    </div>
                  </div>

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
                        placeholder="e.g. 1000"
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

                  <div className="flex items-center justify-between gap-3">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                      Consumption Unit:
                    </label>
                    <div className="w-48 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {conversionModal.consumptionUnit}
                    </div>
                  </div>
                </div>

                {parseFloat(conversionModal.factorInput) > 0 ? (
                  <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-lg border border-teal-200 dark:border-teal-800/60 text-[11px] text-teal-800 dark:text-teal-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>
                      <strong>Formula:</strong> 1 {conversionModal.marketUnit} ={" "}
                      {Number(conversionModal.factorInput).toLocaleString()} {conversionModal.consumptionUnit}. (Market Quantity (TON) =
                      Quantity (KG) ÷ {Number(conversionModal.factorInput).toLocaleString()} | Quantity (KG) = Market Quantity (TON) × {Number(conversionModal.factorInput).toLocaleString()})
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Please enter a valid positive factor greater than 0.</span>
                  </div>
                )}
              </div>

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

        {/* ==================================================================== */}
        {/* MODAL 3: TERMS & CONDITIONS                                          */}
        {/* ==================================================================== */}
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

        {/* ==================================================================== */}
        {/* MODAL 4: ATTACHMENTS MODAL                                           */}
        {/* ==================================================================== */}
        {showAttachmentModal && (
          <MMBookingAttachmentModal
            isOpen={showAttachmentModal}
            onClose={() => setShowAttachmentModal(false)}
            bookingNo={bookingNo}
            supplierName={supplierName}
            bookingTypeLabel="Block Fabric Booking"
            attachments={attachments}
            onAddAttachment={(rec: MMAttachmentRecord) => setAttachments((prev) => [...prev, rec])}
            onDeleteAttachment={(id: string) => setAttachments((prev) => prev.filter((a) => a.id !== id))}
          />
        )}

        {/* ==================================================================== */}
        {/* MODAL 5: PRINT PREVIEW SHEET                                         */}
        {/* ==================================================================== */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col text-xs overflow-hidden">
              <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-teal-400" />
                  <span className="font-bold text-sm">
                    Print Preview — Block Fabric Booking Sheet ({bookingNo})
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
                    Central Merchandising &amp; Fabric Procurement Division
                  </p>
                  <div className="inline-block mt-2 px-3 py-0.5 bg-slate-100 rounded text-xs font-bold text-slate-800 uppercase tracking-widest border border-slate-300">
                    Advance Block Fabric Booking Sheet
                  </div>
                </div>

                {/* Info Block */}
                <div className="grid grid-cols-2 gap-4 border border-slate-300 p-3 rounded text-xs">
                  <div className="space-y-1">
                    <div>
                      <strong className="text-slate-700">Booking No:</strong>{" "}
                      <span className="font-mono font-bold">{bookingNo}</span>
                    </div>
                    <div>
                      <strong className="text-slate-700">Our Ref / Job:</strong>{" "}
                      <span className="font-mono">{ourRef}</span>
                    </div>
                    <div>
                      <strong className="text-slate-700">Booking Date:</strong> {bookingDate}
                    </div>
                    <div>
                      <strong className="text-slate-700">Delivery Date:</strong> {deliveryDate || "As per schedule"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div>
                      <strong className="text-slate-700">Fabric Supplier / Mill:</strong>{" "}
                      <span className="font-bold">{supplierName}</span>
                    </div>
                    <div>
                      <strong className="text-slate-700">Pay Mode:</strong> {payMode}
                    </div>
                    <div>
                      <strong className="text-slate-700">Delivery Mode:</strong> {delMode}
                    </div>
                    <div>
                      <strong className="text-slate-700">Delivery Place:</strong> {delPlace}
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                  <thead className="bg-slate-100 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2 border-r border-slate-300 text-center w-10">#</th>
                      <th className="p-2 border-r border-slate-300">Fabric Item Name / Setup</th>
                      <th className="p-2 border-r border-slate-300 text-center w-20">Unit</th>
                      <th className="p-2 border-r border-slate-300 text-center w-28">Market Unit</th>
                      <th className="p-2 border-r border-slate-300 text-right w-24">Booking Qty</th>
                      <th className="p-2 border-r border-slate-300 text-right w-24">Market Qty</th>
                      <th className="p-2 border-r border-slate-300 text-right w-24">Rate ($)</th>
                      <th className="p-2 text-right w-28">Amount ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {items.map((r, i) => (
                      <tr key={r.id}>
                        <td className="p-2 text-center border-r border-slate-300 font-mono">{i + 1}</td>
                        <td className="p-2 border-r border-slate-300 font-semibold">{r.itemName}</td>
                        <td className="p-2 text-center border-r border-slate-300 font-mono">{r.unit}</td>
                        <td className="p-2 text-center border-r border-slate-300 font-mono">{r.marketUnit}</td>
                        <td className="p-2 text-right border-r border-slate-300 font-mono">
                          {r.bookQty.toLocaleString()} {r.unit}
                        </td>
                        <td className="p-2 text-right border-r border-slate-300 font-mono">
                          {r.marketQty.toLocaleString()}
                        </td>
                        <td className="p-2 text-right border-r border-slate-300 font-mono">
                          ${r.rate.toFixed(2)}
                        </td>
                        <td className="p-2 text-right font-mono font-bold">
                          ${r.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-slate-300 bg-slate-50 font-bold">
                    <tr>
                      <td colSpan={4} className="p-2 text-right uppercase border-r border-slate-300">
                        Total:
                      </td>
                      <td className="p-2 text-right font-mono border-r border-slate-300">
                        {grandTotals.totalBookQty.toLocaleString()} KG
                      </td>
                      <td className="p-2 text-right font-mono border-r border-slate-300">
                        {grandTotals.totalMarketQty.toLocaleString()} TON
                      </td>
                      <td className="p-2 border-r border-slate-300" />
                      <td className="p-2 text-right font-mono font-bold">
                        ${grandTotals.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Terms Block */}
                <div className="border border-slate-300 p-3 rounded text-[11px] space-y-1">
                  <div className="font-bold text-slate-800">Terms &amp; Conditions:</div>
                  <pre className="whitespace-pre-wrap font-sans text-slate-700">{termsAndConditions}</pre>
                </div>

                {/* Signatures */}
                <div className="pt-12 grid grid-cols-4 gap-4 text-center text-xs">
                  <div className="border-t border-slate-400 pt-1 font-semibold">Prepared By</div>
                  <div className="border-t border-slate-400 pt-1 font-semibold">Merchandiser In-Charge</div>
                  <div className="border-t border-slate-400 pt-1 font-semibold">Head of Merchandising</div>
                  <div className="border-t border-slate-400 pt-1 font-semibold">Authorized Signatory</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketingMerchandisingLayout>
  );
}
