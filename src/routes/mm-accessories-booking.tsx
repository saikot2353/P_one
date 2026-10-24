import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useRef } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMAccessoriesBooking,
  MMAccessoriesBookingLine,
  MMAccessoriesBookingAllocation,
  MMAccessoriesBookingSizeDetail,
  MMMainOrder,
  MMAccessoriesEstimationRecord,
  MMAccessoriesEstimationRow,
  INITIAL_MM_ORDERS,
  INITIAL_MM_ACCESSORIES_ESTIMATIONS,
} from "../lib/marketing-merchandising-data";
import {
  Package,
  Plus,
  Search,
  ArrowLeft,
  FileText,
  Check,
  X,
  Printer,
  Layers,
  Trash2,
  Paperclip,
  Download,
  Save,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import {
  MMBookingAttachmentModal,
  MMAttachmentRecord,
} from "../components/marketing-merchandising/MMBookingAttachmentModal";

export const ACCESSORIES_BOOKING_ATTACHMENTS_STORAGE_KEY =
  "cripton_mm_accessories_booking_attachments_v1";

export type MMAccessoriesBookingAttachmentRecord = MMAttachmentRecord;

export type AccessoriesBookingType =
  | "Main Accessories Booking"
  | "Short Accessories Booking"
  | "Additional Accessories Booking";

interface AccessoriesBookingSearchParams {
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

export const Route = createFileRoute("/mm-accessories-booking")({
  validateSearch: (search: Record<string, unknown>): AccessoriesBookingSearchParams => ({
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
      { title: "Accessories Booking — Marketing & Merchandising | CriptonHRIS" },
      {
        name: "description",
        content:
          "Enterprise Accessories Booking form replicating legacy ERP interface with PO allocation, size-wise booking requirements, and Local Storage persistence.",
      },
    ],
  }),
  component: MMAccessoriesBookingPage,
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

// Helper to generate sequential JobID/NN booking number from persisted records
function generateNextBookingNumber(jobId: string, persistedBookings: MMAccessoriesBooking[]): string {
  const cleanJobId = jobId?.trim() || "JOB-2026-0001";
  const prefix = `${cleanJobId}/`;
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

function MMAccessoriesBookingPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  // Master Data & Persisted Lists
  const [orders, setOrders] = useState<MMMainOrder[]>([]);
  const [estimations, setEstimations] = useState<MMAccessoriesEstimationRecord[]>([]);
  const [allBookings, setAllBookings] = useState<MMAccessoriesBooking[]>([]);

  // Active Booking Form State
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string>("Draft");
  const [bookingNo, setBookingNo] = useState<string>("JOB-2026-0001/01");
  const [ourRef, setOurRef] = useState<string>("JOB-2026-0001");
  const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [payMode, setPayMode] = useState<string>("TT 30 Days");

  // Supplier & Delivery Information
  const [supplierId, setSupplierId] = useState<string>("SUP-ACC-01");
  const [supplierName, setSupplierName] = useState<string>("ABC Accessories Ltd.");
  const [bookingType, setBookingType] = useState<AccessoriesBookingType>("Main Accessories Booking");
  const [delMode, setDelMode] = useState<string>("Road");
  const [delPlace, setDelPlace] = useState<string>("Pakiza Central Accessories Store");
  const [reqDate, setReqDate] = useState<string>("2026-11-15");
  const [deliveryDate, setDeliveryDate] = useState<string>("2026-11-25");

  // Additional Information
  const [note, setNote] = useState<string>("Accessories must strictly match approved gold seal sample specifications.");
  const [termsAndConditions, setTermsAndConditions] = useState<string>(
    "1. Quality testing standard: Oeko-Tex Standard 100 Class I.\n2. Quantity tolerance: Max +/- 2% acceptable.\n3. Delivery F.O.R. Pakiza Composite Garments Unit.\n4. Defective, chipped or off-shade items subject to replacement within 48 hours."
  );
  const [piReference, setPiReference] = useState<string>("Not Linked");

  // Summary Grid State
  const [summaryLines, setSummaryLines] = useState<MMAccessoriesBookingLine[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);

  // Modals
  const [showPoSelectionModal, setShowPoSelectionModal] = useState<boolean>(false);
  const [targetAccessoryLine, setTargetAccessoryLine] = useState<MMAccessoriesBookingLine | null>(null);
  const [poFilterStatus, setPoFilterStatus] = useState<"Pending" | "Booked" | "All">("Pending");
  const [poSearchQuery, setPoSearchQuery] = useState<string>("");
  const [tempSelectedPoIds, setTempSelectedPoIds] = useState<string[]>([]);
  const [showAddAccessoryModal, setShowAddAccessoryModal] = useState<boolean>(false);
  const [addAccessorySearch, setAddAccessorySearch] = useState<string>("");
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [deleteConfirmLine, setDeleteConfirmLine] = useState<MMAccessoriesBookingLine | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Attachments State (Fabric Booking Parity)
  const [attachments, setAttachments] = useState<MMAttachmentRecord[]>([]);

  // Active line derived
  const activeLine = useMemo(() => {
    if (selectedLineId) {
      const found = summaryLines.find((l) => l.id === selectedLineId);
      if (found) return found;
    }
    return summaryLines[0] || null;
  }, [summaryLines, selectedLineId]);

  // Load Initial Data on Mount & Parse Query Params
  useEffect(() => {
    const loadedOrders = MMRepository.getOrders();
    const resolvedOrders = loadedOrders.length > 0 ? loadedOrders : INITIAL_MM_ORDERS;
    setOrders(resolvedOrders);

    const loadedEsts = MMRepository.getAccessoriesEstimations();
    const resolvedEsts = loadedEsts.length > 0 ? loadedEsts : INITIAL_MM_ACCESSORIES_ESTIMATIONS;
    setEstimations(resolvedEsts);

    const loadedBookings = MMRepository.getAccessoriesBookings();
    setAllBookings(loadedBookings);

    // Process Search Params
    const targetJobId = search.jobId || search.ref;
    const targetBookingParam = search.bookingId || search.id;

    if (targetBookingParam) {
      const existing = loadedBookings.find((b) => b.id === targetBookingParam || b.bookingNo === targetBookingParam);
      if (existing) {
        loadBookingIntoForm(existing);
        return;
      } else {
        toast.error(`Booking record not found for "${targetBookingParam}".`);
      }
    }

    // Check for staged transfer from Accessories Estimation Register
    let transferPayload: any = null;
    try {
      const s = sessionStorage.getItem("cripton_mm_accessories_booking_transfer_v1");
      const l = localStorage.getItem("cripton_mm_accessories_booking_transfer_v1");
      if (s) transferPayload = JSON.parse(s);
      else if (l) transferPayload = JSON.parse(l);
    } catch (e) {
      console.error("Error reading transfer payload:", e);
    }

    if (transferPayload && transferPayload.items && transferPayload.items.length > 0) {
      initializeFromTransferPayload(transferPayload, resolvedOrders, resolvedEsts, loadedBookings);
      return;
    }

    // Fallback: If search.source === "estimation" and search.rowIds exists, reconstruct the items from resolvedEsts
    if (search.source === "estimation" && search.rowIds) {
      const rowIdList = search.rowIds.split(",").map((s) => s.trim()).filter(Boolean);
      if (rowIdList.length > 0) {
        const foundItems: any[] = [];
        let primarySupplier = search.supplier || "";
        let primaryJobId = targetJobId || "";

        resolvedEsts.forEach((est) => {
          (est.accessoriesRows || []).forEach((row) => {
            if (rowIdList.includes(row.id)) {
              if (!primarySupplier && row.supplier) primarySupplier = row.supplier;
              if (!primaryJobId) primaryJobId = est.jobNo || est.ourRef || "";
              foundItems.push({
                id: row.id,
                estimationId: est.id,
                ourRef: est.jobNo || est.ourRef || primaryJobId,
                style: est.style || "STYLE-2026",
                grpType: "TRIMS",
                accessoryItem: row.itemName || "Item",
                itemName: row.itemName || "Item",
                description: row.description || "",
                budgetValue: Number((row.amount || ((row.marketQty || 0) * (row.unitRate || 0)) || 0).toFixed(2)),
                amount: Number((row.amount || ((row.marketQty || 0) * (row.unitRate || 0)) || 0).toFixed(2)),
                unit: row.consumptionUnit || row.marketUnit || "Pcs",
                rate: row.unitRate || 0,
                requiredQty: row.marketQty || 0,
                usedPlace: row.usedPlace,
                size: row.singleSizeSpec || row.sizeFactType || "Standard",
                color: row.singleColorName || row.colorType || "Standard",
                sizeRows: row.sizeRows,
                colorMappings: row.colorMappings,
                supplier: row.supplier || primarySupplier,
              });
            }
          });
        });

        if (foundItems.length > 0) {
          const reconstructedPayload = {
            supplier: primarySupplier,
            jobId: primaryJobId,
            items: foundItems,
          };
          initializeFromTransferPayload(reconstructedPayload, resolvedOrders, resolvedEsts, loadedBookings);
          return;
        }
      }
    }

    // Do NOT run initFromJobId if source is estimation
    if (search.source === "estimation") {
      return;
    }

    if (targetJobId) {
      initFromJobId(targetJobId, search.accessoryId, search.itemName, search.supplier, resolvedOrders, resolvedEsts, loadedBookings);
    } else if (resolvedEsts.length > 0) {
      const firstEst = resolvedEsts[0];
      initFromJobId(firstEst.jobNo || firstEst.ourRef, undefined, undefined, undefined, resolvedOrders, resolvedEsts, loadedBookings);
    }
  }, [search.jobId, search.ref, search.accessoryId, search.bookingId, search.rowId, search.rowIds, search.source]);

  // Attachment Storage Helpers (Matching Fabric Booking implementation)
  const loadBookingAttachments = (targetBookingKey: string): MMAttachmentRecord[] => {
    try {
      const raw = localStorage.getItem(ACCESSORIES_BOOKING_ATTACHMENTS_STORAGE_KEY);
      if (!raw) return [];
      const list: MMAttachmentRecord[] = JSON.parse(raw);
      return list.filter((a) => a.bookingId === targetBookingKey || (!a.bookingId && !targetBookingKey));
    } catch {
      return [];
    }
  };

  const saveBookingAttachmentsToStorage = (updatedList: MMAttachmentRecord[]) => {
    try {
      const raw = localStorage.getItem(ACCESSORIES_BOOKING_ATTACHMENTS_STORAGE_KEY);
      const list: MMAttachmentRecord[] = raw ? JSON.parse(raw) : [];
      const currentBookingKey = editingBookingId || bookingNo || "booking-default";
      const otherRecords = list.filter((a) => a.bookingId !== currentBookingKey);
      const combined = [...otherRecords, ...updatedList];
      localStorage.setItem(ACCESSORIES_BOOKING_ATTACHMENTS_STORAGE_KEY, JSON.stringify(combined));
    } catch (e) {
      console.error("Failed to persist attachments to LocalStorage:", e);
    }
  };

  const handleAddAttachment = (newRecord: MMAttachmentRecord) => {
    setAttachments((prev) => {
      const next = [newRecord, ...prev];
      saveBookingAttachmentsToStorage(next);
      return next;
    });
  };

  const handleDeleteAttachment = (id: string) => {
    setAttachments((prev) => {
      const next = prev.filter((a) => a.id !== id);
      saveBookingAttachmentsToStorage(next);
      return next;
    });
    toast.info("Attachment removed.");
  };

  // Sync attachments whenever editing booking ID or booking number changes
  useEffect(() => {
    const key = editingBookingId || bookingNo;
    if (key) {
      setAttachments(loadBookingAttachments(key));
    }
  }, [editingBookingId, bookingNo]);

  // Initialize form from Job ID and Estimation
  const initFromJobId = (
    refId: string,
    targetAccessoryId?: string,
    targetItemName?: string,
    targetSupplier?: string,
    ords = orders,
    ests = estimations,
    persistedBookings = allBookings
  ) => {
    const matchedOrder = ords.find((o) => (o.jobNo || o.orderNo) === refId || o.id === refId);
    const matchedEst = ests.find((e) => (e.jobNo || e.ourRef) === refId || e.orderId === refId);

    const effectiveJobId = matchedOrder?.jobNo || matchedEst?.jobNo || refId;
    setOurRef(effectiveJobId);

    // Generate sequential JobID/NN booking number based on persisted records
    const generatedNo = generateNextBookingNumber(effectiveJobId, persistedBookings);
    setBookingNo(generatedNo);
    setEditingBookingId(null);
    setBookingType("Main Accessories Booking");

    if (matchedOrder) {
      if (matchedOrder.shipmentDate) setDeliveryDate(matchedOrder.shipmentDate);
    }

    // Resolve Accessories from Estimation or Order
    let linesToBuild: MMAccessoriesBookingLine[] = [];
    if (matchedEst && matchedEst.accessoriesRows && matchedEst.accessoriesRows.length > 0) {
      const rows = (targetAccessoryId || search.rowId)
        ? matchedEst.accessoriesRows.filter((r) => (search.rowId && r.id === search.rowId) || r.id === targetAccessoryId || r.budgetItemName === targetAccessoryId || r.itemName === targetItemName)
        : matchedEst.accessoriesRows;

      const activeRows = rows.length > 0 ? rows : matchedEst.accessoriesRows;
      // Per requirements: DO NOT automatically populate PO details and size-wise booking rows!
      // Detailed Size-wise Booking Grid remains unpopulated until user performs PO selection and clicks P.
      linesToBuild = activeRows.map((r, rIdx) => {
        return {
          id: `abl-${Date.now()}-${rIdx}`,
          ourRef: effectiveJobId,
          style: matchedEst.style || matchedOrder?.styleNo || "STYLE-2026",
          grpType: "TRIMS",
          accessoryItem: r.itemName || "Button",
          description: r.description || `${r.itemName} standard spec`,
          bookAmt: 0,
          budgetValue: Number((r.amount || 300).toFixed(2)),
          allocations: [],
          sizeWiseDetails: [],
        };
      });

      if (targetSupplier) {
        setSupplierName(targetSupplier);
      } else if (activeRows[0]?.supplier) {
        setSupplierName(activeRows[0].supplier);
      }
    } else {
      // Fallback line
      linesToBuild = [
        {
          id: `abl-${Date.now()}-0`,
          ourRef: effectiveJobId,
          style: matchedOrder?.styleNo || "PK-POLO-2026",
          grpType: "TRIMS",
          accessoryItem: targetItemName || "Button",
          description: "18L 4-Hole Horn / Polyester Button",
          bookAmt: 0,
          budgetValue: 320.0,
          allocations: [],
          sizeWiseDetails: [],
        },
      ];
      if (targetSupplier) setSupplierName(targetSupplier);
    }

    setSummaryLines(linesToBuild);
    if (linesToBuild.length > 0) {
      setSelectedLineId(linesToBuild[0].id);
    }
  };

  // Initialize form from staged multi-item transfer payload
  const initializeFromTransferPayload = (
    tp: any,
    ords = orders,
    ests = estimations,
    persistedBookings = allBookings
  ) => {
    const firstItem = tp.items[0];
    const effectiveJobId = tp.jobId || firstItem.ourRef || "JOB-2026-0001";
    setOurRef(effectiveJobId);

    const generatedNo = generateNextBookingNumber(effectiveJobId, persistedBookings);
    setBookingNo(generatedNo);
    setEditingBookingId(null);
    setBookingType("Main Accessories Booking");

    if (tp.supplier) {
      setSupplierName(tp.supplier);
    } else if (firstItem.supplier) {
      setSupplierName(firstItem.supplier);
    }

    const matchedOrder = ords.find((o) => (o.jobNo || o.orderNo) === effectiveJobId || o.id === effectiveJobId);
    if (matchedOrder && matchedOrder.shipmentDate) {
      setDeliveryDate(matchedOrder.shipmentDate);
    }

    const linesToBuild: MMAccessoriesBookingLine[] = tp.items.map((it: any, rIdx: number) => {
      const lineOrder = ords.find((o) => (o.jobNo || o.orderNo) === it.ourRef || o.id === it.ourRef);
      return {
        id: `abl-${Date.now()}-${rIdx}`,
        ourRef: it.ourRef || effectiveJobId,
        style: it.style || lineOrder?.styleNo || matchedOrder?.styleNo || "STYLE-2026",
        grpType: it.grpType || "TRIMS",
        accessoryItem: it.accessoryItem || it.itemName || "Item",
        description: it.description || `${it.accessoryItem || it.itemName} spec`,
        bookAmt: 0,
        budgetValue: Number((it.budgetValue || it.amount || 300).toFixed(2)),
        allocations: [],
        sizeWiseDetails: [],
        estimationId: it.estimationId,
        estimationItemId: it.id,
        supplier: tp.supplier || it.supplier,
        unit: it.unit || "Pcs",
        rate: it.rate || 0,
        requiredQty: it.requiredQty || 0,
        usedPlace: it.usedPlace || "",
        size: it.size || "Standard",
        color: it.color || "Standard",
        sizeRows: it.sizeRows,
        colorMappings: it.colorMappings,
      };
    });

    setSummaryLines(linesToBuild);
    if (linesToBuild.length > 0) {
      setSelectedLineId(linesToBuild[0].id);
    }
  };

  // Generate Available PO Allocations for an accessory item line and order context
  const getEligibleAllocationsForLine = (
    line: MMAccessoriesBookingLine,
    order: MMMainOrder | undefined
  ): MMAccessoriesBookingAllocation[] => {
    if (!order) {
      return [
        {
          id: `${line.id}-po-alloc-1`,
          selected: false,
          poNo: "PO-HM-99881-A",
          gmtColor: "Navy Blue",
          gmtQty: 15000,
          note: "Main production batch",
          lot: "LOT-01",
          delDt: "2026-11-20",
          country: "Germany",
          bookQty: 0,
          balance: 15000,
        },
        {
          id: `${line.id}-po-alloc-2`,
          selected: false,
          poNo: "PO-HM-99881-B",
          gmtColor: "Heather Grey",
          gmtQty: 15000,
          note: "Secondary run",
          lot: "LOT-02",
          delDt: "2026-11-25",
          country: "Sweden",
          bookQty: 0,
          balance: 15000,
        },
      ];
    }

    const pos = order.poWiseBreakdown || [];
    const colors = order.colorWiseBreakdown || [{ color: "Navy Blue", quantity: order.orderQuantity || 20000 }];

    if (pos.length > 0) {
      return pos.map((po, idx) => {
        const colorName = colors[idx % colors.length]?.color || "Standard Color";
        return {
          id: `${line.id}-po-alloc-${idx + 1}`,
          selected: false,
          poNo: po.poNumber || `PO-${idx + 1001}`,
          gmtColor: colorName,
          gmtQty: po.quantity || 10000,
          note: `PO delivery for ${po.destinationCountry || "Export"}`,
          lot: `LOT-0${idx + 1}`,
          delDt: po.shipmentDate || "2026-11-20",
          country: po.destinationCountry || "Germany",
          bookQty: 0,
          balance: po.quantity || 10000,
        };
      });
    }

    return [
      {
        id: `${line.id}-po-alloc-1`,
        selected: false,
        poNo: order.buyerPoNumber || "PO-EXP-01",
        gmtColor: colors[0]?.color || "Navy Blue",
        gmtQty: order.orderQuantity || 20000,
        note: "Export Allocation",
        lot: "LOT-01",
        delDt: order.shipmentDate || "2026-11-20",
        country: "Germany",
        bookQty: 0,
        balance: order.orderQuantity || 20000,
      },
    ];
  };

  // Generate Size-wise details for an accessory item line and its confirmed allocations
  const generateSizeDetailsForLine = (
    ref: string,
    order: MMMainOrder | undefined,
    row: MMAccessoriesEstimationRow | null,
    allocations: MMAccessoriesBookingAllocation[],
    line?: MMAccessoriesBookingLine
  ): MMAccessoriesBookingSizeDetail[] => {
    const selectedAllocations = allocations.filter((a) => a.selected);
    if (selectedAllocations.length === 0) return [];

    const orderSizes = order?.sizeWiseBreakdown && order.sizeWiseBreakdown.length > 0
      ? order.sizeWiseBreakdown.map((s) => ({ size: (s as any).size || (s as any).sizeName, qty: s.quantity }))
      : [
          { size: "S", qty: 4500 },
          { size: "M", qty: 6500 },
          { size: "L", qty: 5500 },
          { size: "XL", qty: 3500 },
        ];

    const effectiveLine = line || targetAccessoryLine;
    const itemName = row?.itemName || effectiveLine?.accessoryItem || "Button";
    const description = row?.description || effectiveLine?.description || `${itemName} Specification`;
    const cons = Number(row?.consumptionQtyPerPc) || 1;
    const wPct = Number(row?.wastagePct) || 3;
    const unit = row?.marketUnit || "Pcs";
    const convFact = row?.conversionFactor && row.conversionFactor > 0 ? row.conversionFactor : 1;
    const rate = Number(row?.unitRate) || 0.05;

    const details: MMAccessoriesBookingSizeDetail[] = [];
    let detailIdx = 1;

    for (const alloc of selectedAllocations) {
      const totalAllocQty = alloc.gmtQty || 10000;
      const totalOrderSizesQty = orderSizes.reduce((a, b) => a + b.qty, 0) || 1;

      for (const sz of orderSizes) {
        const proportionalGmtQty = Math.round((sz.qty / totalOrderSizesQty) * totalAllocQty);
        const reqQty = proportionalGmtQty * cons;
        const grossReq = reqQty * (1 + wPct / 100);
        const bookQty = Math.round((grossReq / convFact) * 100) / 100;
        const total = Math.round(bookQty * rate * 100) / 100;

        details.push({
          id: `det-${Date.now()}-${detailIdx++}`,
          lineId: effectiveLine?.id || "",
          status: "Pending",
          ourRef: ref,
          itemName: itemName,
          description: description,
          color: alloc.gmtColor,
          size: sz.size || "M",
          codeSpecPo: alloc.poNo,
          gmtQty: proportionalGmtQty,
          reqQty: Number(reqQty.toFixed(2)),
          unit: unit,
          bookedWastagePct: wPct,
          bookQty: bookQty,
          storeRcvdQty: 0,
          rate: rate,
          total: total,
        });
      }
    }

    return details;
  };

  // Load an existing saved booking into form
  const loadBookingIntoForm = (b: MMAccessoriesBooking) => {
    setEditingBookingId(b.id);
    setBookingStatus(b.status || "Draft");
    setBookingNo(b.bookingNo);
    setOurRef(b.ourRef || "JOB-2026-0001");
    setBookingDate(b.bookingDate || new Date().toISOString().slice(0, 10));
    setPayMode(b.payMode || "TT 30 Days");
    setSupplierId(b.supplierId || "SUP-ACC-01");
    setSupplierName(b.supplierName || "ABC Accessories Ltd.");
    
    // Resolve Booking Type from saved record
    const rawType = b.bookType || (b as any).bookingType;
    if (
      rawType === "Short Accessories Booking" ||
      rawType === "Additional Accessories Booking" ||
      rawType === "Main Accessories Booking"
    ) {
      setBookingType(rawType);
    } else if (rawType === "Additional Booking" || (b as any).additionalBooking === "Yes") {
      setBookingType("Additional Accessories Booking");
    } else {
      setBookingType("Main Accessories Booking");
    }

    setDelMode(b.deliveryMode || "Road");
    setDelPlace(b.deliveryPlace || "Pakiza Central Accessories Store");
    setReqDate(b.reqDate || "2026-11-15");
    setDeliveryDate(b.deliveryDate || "2026-11-25");
    setNote(b.note || b.notes || "");
    setTermsAndConditions(b.termsAndConditions || "");
    setPiReference(b.piReference || "Not Linked");

    if (b.lines && b.lines.length > 0) {
      setSummaryLines(b.lines);
      setSelectedLineId(b.lines[0].id);
    } else {
      initFromJobId(b.ourRef || "JOB-2026-0001");
    }
    toast.success(`Loaded Accessories Booking ${b.bookingNo}`);
  };

  // Summary Grid Row Selection & PO Selection "D" Button Handlers
  const handleSelectSummaryLine = (lineId: string) => {
    setSelectedLineId(lineId);
  };

  // Open PO Selection Window ("D" Button):
  // Immediately loads eligible POs without modifying the background allocation grid.
  const handleOpenPoSelectionModal = (line: MMAccessoriesBookingLine) => {
    setTargetAccessoryLine(line);
    // Preserve previously confirmed allocations for this line
    const confirmedAllocations = line.allocations || [];
    const confirmedIds = confirmedAllocations.filter((a) => a.selected).map((a) => a.id);
    setTempSelectedPoIds(confirmedIds);
    setPoFilterStatus("Pending");
    setPoSearchQuery("");
    setShowPoSelectionModal(true);
  };

  // When clicking OK in PO Selection Window:
  // Apply selected allocations to PO & GMT Color grid ONLY.
  // DO NOT populate Detailed Size-wise Booking Grid automatically!
  const handleConfirmPoSelection = () => {
    if (!targetAccessoryLine) return;
    if (tempSelectedPoIds.length === 0) {
      toast.warning("Please select at least one PO allocation record.");
      return;
    }

    const matchedOrder = orders.find((o) => (o.jobNo || o.orderNo) === targetAccessoryLine.ourRef || (o.jobNo || o.orderNo) === ourRef);
    const allEligible = getEligibleAllocationsForLine(targetAccessoryLine, matchedOrder);
    const confirmedAllocations = allEligible
      .filter((alloc) => tempSelectedPoIds.includes(alloc.id))
      .map((alloc) => ({
        ...alloc,
        selected: true,
      }));

    setSummaryLines((prev) => {
      return prev.map((line) => {
        if (line.id !== targetAccessoryLine.id) return line;
        return {
          ...line,
          allocations: confirmedAllocations,
        };
      });
    });

    setShowPoSelectionModal(false);
    toast.success(`Applied ${confirmedAllocations.length} PO allocation(s) for ${targetAccessoryLine.accessoryItem}. Click 'P' to populate size-wise details.`);
  };

  const handleCancelPoSelection = () => {
    setShowPoSelectionModal(false);
    setTargetAccessoryLine(null);
  };

  // P (Populate) Button Handler for Summary Grid
  const handlePopulateSizeDetails = (lineId: string) => {
    const line = summaryLines.find((l) => l.id === lineId);
    if (!line) return;

    const selectedAllocations = (line.allocations || []).filter((a) => a.selected);
    if (selectedAllocations.length === 0) {
      toast.error("Please select a PO before proceeding with the populate action.");
      return;
    }

    const matchedOrder = orders.find((o) => (o.jobNo || o.orderNo) === line.ourRef || (o.jobNo || o.orderNo) === ourRef);
    const matchingEst = estimations.find((e) => (line.estimationId && e.id === line.estimationId) || (e.jobNo || e.ourRef) === line.ourRef || (e.jobNo || e.ourRef) === ourRef);
    const matchingEstRow = matchingEst?.accessoriesRows?.find((r) => (line.estimationItemId && r.id === line.estimationItemId) || r.itemName === line.accessoryItem) || null;

    const newDetails = generateSizeDetailsForLine(line.ourRef || ourRef, matchedOrder, matchingEstRow, selectedAllocations, line);
    const newBookAmt = newDetails.reduce((a, b) => a + b.total, 0);

    setSummaryLines((prev) =>
      prev.map((l) => {
        if (l.id !== lineId) return l;
        return {
          ...l,
          sizeWiseDetails: newDetails,
          bookAmt: Number(newBookAmt.toFixed(2)),
        };
      })
    );

    toast.success(`Successfully populated size-wise booking details for ${line.accessoryItem}.`);
  };

  // Validate if a row can be safely removed under booking rules
  const isRowSafeToDelete = (line: MMAccessoriesBookingLine) => {
    const hasStoreReceived = (line.sizeWiseDetails || []).some((d) => (d.storeRcvdQty || 0) > 0);
    if (hasStoreReceived) {
      return {
        safe: false,
        reason: `Cannot delete "${line.accessoryItem}" because goods have already been received in the store for this item.`,
      };
    }
    return { safe: true };
  };

  const handleDeleteRowClick = (line: MMAccessoriesBookingLine) => {
    const check = isRowSafeToDelete(line);
    if (!check.safe) {
      toast.error(check.reason);
      return;
    }
    setDeleteConfirmLine(line);
  };

  // Delete an individual accessory line from the summary grid and cleanly remove associated allocations and details
  const handleDeleteSummaryLine = (lineId: string) => {
    const lineToDelete = summaryLines.find((l) => l.id === lineId);
    if (!lineToDelete) return;

    const nextLines = summaryLines.filter((l) => l.id !== lineId);
    setSummaryLines(nextLines);

    if (selectedLineId === lineId) {
      setSelectedLineId(nextLines[0]?.id || "");
    }

    // Persist deletion if booking is already saved in LocalStorage
    if (editingBookingId) {
      try {
        const allSaved = MMRepository.getAccessoriesBookings();
        const existing = allSaved.find((b) => b.id === editingBookingId || b.bookingNo === bookingNo);
        if (existing) {
          const allDetails = nextLines.flatMap((l) => l.sizeWiseDetails || []);
          const totalBookingValue = nextLines.reduce((acc, l) => acc + (l.bookAmt || 0), 0);
          const totalBookingQty = allDetails.reduce((acc, d) => acc + (d.bookQty || 0), 0);

          const updatedBooking: MMAccessoriesBooking = {
            ...existing,
            lines: nextLines,
            totalBookedAmount: Number(totalBookingValue.toFixed(2)),
            totalBookedQty: Number(totalBookingQty.toFixed(2)),
            items: allDetails.map((det, dIdx) => ({
              id: det.id || `item-${dIdx}`,
              lineId: det.lineId,
              jobId: ourRef,
              style: nextLines.find((l) => l.id === det.lineId)?.style || "STYLE-2026",
              accessoryName: det.itemName,
              description: det.description,
              color: det.color,
              size: det.size,
              codeSpecPo: det.codeSpecPo || "",
              gmtQty: det.gmtQty,
              reqQty: det.reqQty,
              unit: det.unit,
              wastagePct: det.bookedWastagePct,
              bookQty: det.bookQty,
              rate: det.rate,
              total: det.total,
              storeRcvdQty: det.storeRcvdQty,
              supplierName: supplierName,
            })) as any,
          };
          MMRepository.saveAccessoriesBooking(updatedBooking);
        }
      } catch (e) {
        console.error("Failed to update persisted booking upon deletion:", e);
      }
    }

    setDeleteConfirmLine(null);
    toast.success(`Accessory entry "${lineToDelete.accessoryItem}" deleted successfully.`);
  };

  // Handle Detail Grid Quantity / Rate changes
  const handleDetailFieldChange = (
    detailId: string,
    field: "bookQty" | "rate",
    val: string
  ) => {
    if (!activeLine) return;
    const num = parseFloat(val) || 0;

    setSummaryLines((prev) => {
      return prev.map((line) => {
        if (line.id !== activeLine.id) return line;
        const updatedDetails = (line.sizeWiseDetails || []).map((det) => {
          if (det.id !== detailId) return det;
          const next = { ...det, [field]: num };
          next.total = Number(((next.bookQty || 0) * (next.rate || 0)).toFixed(2));
          return next;
        });

        const newBookAmt = updatedDetails.reduce((a, b) => a + b.total, 0);
        return {
          ...line,
          sizeWiseDetails: updatedDetails,
          bookAmt: Number(newBookAmt.toFixed(2)),
        };
      });
    });
  };

  // Ceiling Rounding R> control
  const handleRoundUpBookQty = (detailId: string) => {
    if (!activeLine) return;
    setSummaryLines((prev) => {
      return prev.map((line) => {
        if (line.id !== activeLine.id) return line;
        const updatedDetails = (line.sizeWiseDetails || []).map((det) => {
          if (det.id !== detailId) return det;
          const rounded = Math.ceil(det.bookQty);
          const total = Number((rounded * (det.rate || 0)).toFixed(2));
          return { ...det, bookQty: rounded, total };
        });

        const newBookAmt = updatedDetails.reduce((a, b) => a + b.total, 0);
        return {
          ...line,
          sizeWiseDetails: updatedDetails,
          bookAmt: Number(newBookAmt.toFixed(2)),
        };
      });
    });
    toast.info("Book quantity rounded up to whole unit (R>)");
  };

  // Filter eligible POs in PO Selection Window (Loads immediately from line and order)
  const eligiblePosForModal = useMemo(() => {
    if (!targetAccessoryLine) return [];
    const matchedOrder = orders.find((o) => (o.jobNo || o.orderNo) === targetAccessoryLine.ourRef || (o.jobNo || o.orderNo) === ourRef);
    const pool = getEligibleAllocationsForLine(targetAccessoryLine, matchedOrder);

    return pool.filter((item) => {
      if (poFilterStatus === "Pending") {
        if ((item.balance || 0) <= 0 && item.bookQty && item.bookQty > 0) return false;
      } else if (poFilterStatus === "Booked") {
        const isSelected = tempSelectedPoIds.includes(item.id);
        if (!isSelected && (!item.bookQty || item.bookQty === 0)) return false;
      }

      if (poSearchQuery.trim()) {
        const q = poSearchQuery.toLowerCase();
        const matchesPo = item.poNo.toLowerCase().includes(q);
        const matchesColor = item.gmtColor.toLowerCase().includes(q);
        const matchesLot = item.lot?.toLowerCase().includes(q);
        const matchesCountry = item.country?.toLowerCase().includes(q);
        if (!matchesPo && !matchesColor && !matchesLot && !matchesCountry) return false;
      }

      return true;
    });
  }, [targetAccessoryLine, orders, ourRef, poFilterStatus, poSearchQuery, tempSelectedPoIds]);

  // Select All state in PO Selection Window
  const allEligiblePosSelected = useMemo(() => {
    if (eligiblePosForModal.length === 0) return false;
    return eligiblePosForModal.every((item) => tempSelectedPoIds.includes(item.id));
  }, [eligiblePosForModal, tempSelectedPoIds]);

  const toggleSelectAllEligiblePos = () => {
    if (allEligiblePosSelected) {
      const currentFilteredIds = new Set(eligiblePosForModal.map((i) => i.id));
      setTempSelectedPoIds((prev) => prev.filter((id) => !currentFilteredIds.has(id)));
    } else {
      const filteredIds = eligiblePosForModal.map((i) => i.id);
      setTempSelectedPoIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const toggleTempPoId = (id: string) => {
    setTempSelectedPoIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Active Line Allocations and Size Details (Upper-Right Allocation Grid)
  const activeAllocations = useMemo(() => {
    return activeLine?.allocations || [];
  }, [activeLine]);

  const activeAllocationsGmtQtyTotal = useMemo(() => {
    return activeAllocations.reduce((acc, curr) => acc + (curr.gmtQty || 0), 0);
  }, [activeAllocations]);

  const activeSizeDetails = useMemo(() => {
    return activeLine?.sizeWiseDetails || [];
  }, [activeLine]);

  const sizeDetailsTotals = useMemo(() => {
    let gmtQty = 0;
    let reqQty = 0;
    let bookQty = 0;
    let storeRcvdQty = 0;
    let totalAmount = 0;

    activeSizeDetails.forEach((d) => {
      gmtQty += d.gmtQty || 0;
      reqQty += d.reqQty || 0;
      bookQty += d.bookQty || 0;
      storeRcvdQty += d.storeRcvdQty || 0;
      totalAmount += d.total || 0;
    });

    return {
      gmtQty,
      reqQty: Number(reqQty.toFixed(2)),
      bookQty: Number(bookQty.toFixed(2)),
      storeRcvdQty: Number(storeRcvdQty.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
    };
  }, [activeSizeDetails]);

  // Summary Grid Footer Totals
  const summaryBudgetTotal = useMemo(() => {
    return summaryLines.reduce((acc, curr) => acc + (curr.budgetValue || 0), 0);
  }, [summaryLines]);

  const summaryBookingTotal = useMemo(() => {
    return summaryLines.reduce((acc, curr) => acc + (curr.bookAmt || 0), 0);
  }, [summaryLines]);

  // Supplier-based filtering for Add Item button (Section 4.1)
  const eligibleEstimationItemsForSupplier = useMemo(() => {
    const matchedEst = estimations.find((e) => (e.jobNo || e.ourRef) === ourRef);
    if (!matchedEst || !matchedEst.accessoriesRows) return [];

    const currentSupplierClean = supplierName.toLowerCase().trim();
    const alreadyAddedItems = summaryLines.map((l) => l.accessoryItem.toLowerCase().trim());

    return matchedEst.accessoriesRows.filter((row) => {
      const rowSupplierClean = (row.supplier || "").toLowerCase().trim();
      const matchesSupplier =
        !rowSupplierClean ||
        rowSupplierClean.includes(currentSupplierClean) ||
        currentSupplierClean.includes(rowSupplierClean);

      const notAlreadyAdded = !alreadyAddedItems.includes((row.itemName || "").toLowerCase().trim());
      return matchesSupplier && notAlreadyAdded;
    });
  }, [estimations, ourRef, supplierName, summaryLines]);

  const handleAddAccessoryLine = (estRow: MMAccessoriesEstimationRow) => {
    const newLine: MMAccessoriesBookingLine = {
      id: `abl-${Date.now()}-${summaryLines.length}`,
      ourRef: ourRef,
      style: activeLine?.style || "STYLE-2026",
      grpType: "TRIMS",
      accessoryItem: estRow.itemName || "Item",
      description: estRow.description || `${estRow.itemName} standard spec`,
      bookAmt: 0,
      budgetValue: Number((estRow.amount || 250).toFixed(2)),
      allocations: [],
      sizeWiseDetails: [],
    };

    setSummaryLines((prev) => [...prev, newLine]);
    setSelectedLineId(newLine.id);
    setShowAddAccessoryModal(false);
    toast.success(`Added accessory item "${newLine.accessoryItem}" to booking.`);
  };

  // Save Booking as Draft Handler (Section 5)
  const handleSaveBooking = () => {
    if (isSaving || isSubmitting) return;

    // Lock validation: cannot modify Approved or Pending bookings
    if (bookingStatus === "Approved") {
      toast.error("Cannot modify an Approved booking. It is locked in read-only mode.");
      return;
    }
    if (bookingStatus === "Submitted" || bookingStatus === "Pending") {
      toast.error("This booking has been submitted for approval and is locked.");
      return;
    }

    // Draft Validation 1: Job ID
    if (!ourRef || ourRef.trim() === "") {
      toast.error("Validation Error: Job ID is required to save booking.");
      return;
    }

    // Draft Validation 2: At least one item in summary grid
    if (summaryLines.length === 0) {
      toast.error("Validation Error: Please add at least one accessory item before saving.");
      return;
    }

    setIsSaving(true);

    try {
      const allDetails = summaryLines.flatMap((l) => l.sizeWiseDetails || []);
      const totalBookingValue = summaryLines.reduce((acc, l) => acc + (l.bookAmt || 0), 0);
      const totalBookingQty = allDetails.reduce((acc, d) => acc + (d.bookQty || 0), 0);
      const effectiveStatus = bookingStatus || "Draft";

      const bookingPayload: MMAccessoriesBooking = {
        id: editingBookingId || `acc-book-${Date.now()}`,
        bookingNo: bookingNo,
        ourRef: ourRef,
        bookingDate: bookingDate,
        payMode: payMode,
        supplierId: supplierId,
        supplierName: supplierName,
        deliveryMode: delMode,
        bookType: bookingType,
        deliveryPlace: delPlace,
        reqDate: reqDate,
        deliveryDate: deliveryDate,
        status: effectiveStatus,
        note: note,
        termsAndConditions: termsAndConditions,
        totalBookedAmount: Number(totalBookingValue.toFixed(2)),
        totalBookedQty: Number(totalBookingQty.toFixed(2)),
        totalPreCostAmount: Number(totalBookingValue.toFixed(2)),
        totalSavingAmount: 0,
        overallSavingPct: 0,
        currency: "USD",
        conversionRate: 1.0,
        paymentTerms: payMode,
        createdBy: "Tanvir Ahmed",
        createdDate: bookingDate,
        lines: summaryLines,
        items: (allDetails.length > 0
          ? allDetails.map((det, dIdx) => {
              const parentLine = summaryLines.find((l) => l.id === det.lineId);
              return {
                id: det.id || `item-${dIdx}`,
                lineId: det.lineId,
                jobId: parentLine?.ourRef || ourRef,
                style: parentLine?.style || activeLine?.style || "STYLE-2026",
                accessoryName: det.itemName,
                description: det.description,
                color: det.color,
                size: det.size,
                codeSpecPo: det.codeSpecPo || "",
                gmtQty: det.gmtQty,
                reqQty: det.reqQty,
                unit: det.unit,
                wastagePct: det.bookedWastagePct,
                bookQty: det.bookQty,
                rate: det.rate,
                total: det.total,
                storeRcvdQty: det.storeRcvdQty,
                supplierName: supplierName,
                estimationItemId: parentLine?.estimationItemId,
              };
            })
          : summaryLines.map((l, lIdx) => ({
              id: `item-${l.id || lIdx}`,
              lineId: l.id,
              jobId: l.ourRef || ourRef,
              style: l.style,
              accessoryName: l.accessoryItem,
              description: l.description,
              color: l.color || "Standard",
              size: l.size || "Standard",
              codeSpecPo: "",
              gmtQty: 0,
              reqQty: l.requiredQty || 0,
              unit: l.unit || "Pcs",
              wastagePct: 0,
              bookQty: l.bookAmt > 0 ? l.bookAmt : (l.requiredQty || 0),
              rate: l.rate || 0,
              total: l.bookAmt > 0 ? l.bookAmt : (l.budgetValue || 0),
              storeRcvdQty: 0,
              supplierName: supplierName,
              estimationItemId: l.estimationItemId,
            }))) as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      MMRepository.saveAccessoriesBooking(bookingPayload);

      // Update parent estimation items booking status and booking number
      try {
        const ests = MMRepository.getAccessoriesEstimations();
        let updatedAny = false;
        const updatedEsts = ests.map((est) => {
          let estModified = false;
          const updatedRows = (est.accessoriesRows || []).map((row) => {
            const matchingLine = summaryLines.find(
              (l) =>
                (l.estimationItemId && l.estimationItemId === row.id) ||
                (l.id === row.id)
            );
            if (matchingLine) {
              estModified = true;
              updatedAny = true;
              return {
                ...row,
                bookingRef: bookingPayload.bookingNo,
                bookingStatus: "Booked" as any,
                marketQty: matchingLine.bookAmt > 0 ? matchingLine.bookAmt : row.marketQty,
              };
            }
            return row;
          });

          if (estModified) {
            return {
              ...est,
              accessoriesRows: updatedRows,
              updatedAt: new Date().toISOString(),
            };
          }
          return est;
        });

        if (updatedAny) {
          MMRepository.saveAllAccessoriesEstimations(updatedEsts);
          setEstimations(updatedEsts);
        }
      } catch (e) {
        console.error("Failed to update estimation records booking status:", e);
      }

      // Clear transfer storage so future separate navigations start clean
      try {
        sessionStorage.removeItem("cripton_mm_accessories_booking_transfer_v1");
        localStorage.removeItem("cripton_mm_accessories_booking_transfer_v1");
      } catch (e) {}

      setAllBookings((prev) => {
        const idx = prev.findIndex((b) => b.id === bookingPayload.id || b.bookingNo === bookingPayload.bookingNo);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = bookingPayload;
          return copy;
        }
        return [bookingPayload, ...prev];
      });

      setEditingBookingId(bookingPayload.id);
      toast.success("Accessories Booking saved successfully.");
    } catch (err) {
      console.error("Error saving booking draft:", err);
      toast.error("Failed to save accessories booking draft.");
    } finally {
      setIsSaving(false);
    }
  };

  // Submit & Validation Handler (Section 5.3 & 5.4)
  const handleSubmitBooking = () => {
    if (isSubmitting || isSaving) return;

    if (bookingStatus === "Approved") {
      toast.warning(`Accessories Booking ${bookingNo} is already Approved and cannot be resubmitted.`);
      return;
    }
    if (bookingStatus === "Submitted" || bookingStatus === "Pending") {
      toast.info(`Accessories Booking ${bookingNo} has already been submitted and is currently Pending Approval.`);
      return;
    }

    // Validation 1: Job ID
    if (!ourRef || ourRef.trim() === "") {
      toast.error("Validation Error: Job ID is required to submit the booking.");
      return;
    }

    // Validation 2: Summary items
    if (summaryLines.length === 0) {
      toast.error("Validation Error: Please add at least one accessory item to the summary grid.");
      return;
    }

    // Validation 3: PO Allocations selected
    const linesWithoutAllocations = summaryLines.filter(
      (l) => !l.allocations || l.allocations.filter((a) => a.selected).length === 0
    );
    if (linesWithoutAllocations.length > 0) {
      toast.error(`Validation Error: Please select PO allocations using 'D' for item "${linesWithoutAllocations[0].accessoryItem}".`);
      return;
    }

    // Validation 4: Size-wise booking details populated via P
    const linesWithoutDetails = summaryLines.filter(
      (l) => !l.sizeWiseDetails || l.sizeWiseDetails.length === 0
    );
    if (linesWithoutDetails.length > 0) {
      toast.error(`Validation Error: Size-wise booking details not populated for "${linesWithoutDetails[0].accessoryItem}". Please click 'P' to populate before submitting.`);
      return;
    }

    // Validation 5: Quantities > 0
    const allDetails = summaryLines.flatMap((l) => l.sizeWiseDetails || []);
    const invalidQtyRows = allDetails.filter((d) => !d.bookQty || d.bookQty <= 0);
    if (invalidQtyRows.length > 0) {
      toast.error("Validation Error: All booking quantities must be greater than zero.");
      return;
    }

    setIsSubmitting(true);

    try {
      const totalBookingValue = summaryLines.reduce((acc, l) => acc + (l.bookAmt || 0), 0);
      const totalBookingQty = allDetails.reduce((acc, d) => acc + (d.bookQty || 0), 0);

      const bookingPayload: MMAccessoriesBooking = {
        id: editingBookingId || `acc-book-${Date.now()}`,
        bookingNo: bookingNo,
        ourRef: ourRef,
        bookingDate: bookingDate,
        payMode: payMode,
        supplierId: supplierId,
        supplierName: supplierName,
        deliveryMode: delMode,
        bookType: bookingType,
        deliveryPlace: delPlace,
        reqDate: reqDate,
        deliveryDate: deliveryDate,
        status: "Submitted",
        note: note,
        termsAndConditions: termsAndConditions,
        totalBookedAmount: Number(totalBookingValue.toFixed(2)),
        totalBookedQty: Number(totalBookingQty.toFixed(2)),
        totalPreCostAmount: Number(totalBookingValue.toFixed(2)),
        totalSavingAmount: 0,
        overallSavingPct: 0,
        currency: "USD",
        conversionRate: 1.0,
        paymentTerms: payMode,
        createdBy: "Tanvir Ahmed",
        createdDate: bookingDate,
        lines: summaryLines,
        items: allDetails.map((det, dIdx) => {
          const parentLine = summaryLines.find((l) => l.id === det.lineId);
          return {
            id: det.id || `item-${dIdx}`,
            lineId: det.lineId,
            jobId: parentLine?.ourRef || ourRef,
            style: parentLine?.style || activeLine?.style || "STYLE-2026",
            accessoryName: det.itemName,
            description: det.description,
            color: det.color,
            size: det.size,
            codeSpecPo: det.codeSpecPo || "",
            gmtQty: det.gmtQty,
            reqQty: det.reqQty,
            unit: det.unit,
            wastagePct: det.bookedWastagePct,
            bookQty: det.bookQty,
            rate: det.rate,
            total: det.total,
            storeRcvdQty: det.storeRcvdQty,
            supplierName: supplierName,
            estimationItemId: parentLine?.estimationItemId,
          };
        }) as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      MMRepository.saveAccessoriesBooking(bookingPayload);

      // Update parent estimation items booking status and booking number
      try {
        const ests = MMRepository.getAccessoriesEstimations();
        let updatedAny = false;
        const updatedEsts = ests.map((est) => {
          let estModified = false;
          const updatedRows = (est.accessoriesRows || []).map((row) => {
            const matchingLine = summaryLines.find(
              (l) =>
                (l.estimationItemId && l.estimationItemId === row.id) ||
                (l.id === row.id)
            );
            if (matchingLine) {
              estModified = true;
              updatedAny = true;
              return {
                ...row,
                bookingRef: bookingPayload.bookingNo,
                bookingStatus: "Booked" as any,
                marketQty: matchingLine.bookAmt > 0 ? matchingLine.bookAmt : row.marketQty,
              };
            }
            return row;
          });

          if (estModified) {
            return {
              ...est,
              accessoriesRows: updatedRows,
              updatedAt: new Date().toISOString(),
            };
          }
          return est;
        });

        if (updatedAny) {
          MMRepository.saveAllAccessoriesEstimations(updatedEsts);
          setEstimations(updatedEsts);
        }
      } catch (e) {
        console.error("Failed to update estimation records booking status:", e);
      }

      // Clear transfer storage so future separate navigations start clean
      try {
        sessionStorage.removeItem("cripton_mm_accessories_booking_transfer_v1");
        localStorage.removeItem("cripton_mm_accessories_booking_transfer_v1");
      } catch (e) {}

      setAllBookings((prev) => {
        const idx = prev.findIndex((b) => b.id === bookingPayload.id || b.bookingNo === bookingPayload.bookingNo);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = bookingPayload;
          return copy;
        }
        return [bookingPayload, ...prev];
      });

      setEditingBookingId(bookingPayload.id);
      setBookingStatus("Pending");

      toast.success("Accessories Booking submitted successfully for approval.");
    } catch (err) {
      console.error("Error submitting booking:", err);
      toast.error("Failed to submit accessories booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Proforma Invoice Creation Integration (GR_1311 -> PI Entry)
  const handleCreatePI = () => {
    // 1. Validate that the Accessories Booking record is saved and eligible for PI creation
    const savedBooking = editingBookingId
      ? allBookings.find((b) => b.id === editingBookingId)
      : allBookings.find((b) => b.bookingNo === bookingNo);

    if (!savedBooking) {
      toast.error(
        "Validation Notice: Please save or submit this Accessories Booking before creating a Proforma Invoice."
      );
      return;
    }

    // 2. Validate booking items
    if (!savedBooking.items?.length && !summaryLines?.length) {
      toast.error(
        "Validation Notice: Accessories Booking must contain valid line items to create a Proforma Invoice."
      );
      return;
    }

    toast.info(`Opening Proforma Invoice Entry for Accessories Booking ${savedBooking.bookingNo}...`);

    // 3. Open the existing PI Entry form with source context
    navigate({
      to: "/mm-proforma-invoice-create",
      search: {
        bookingId: savedBooking.id,
        source: "accessories",
        item: "Accessories",
      } as any,
    });
  };

  const handleExit = () => {
    navigate({ to: "/mm-accessories-estimation", search: { ref: ourRef } });
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-accessories-booking"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-order-entry" },
        { label: "Accessories Estimation", to: "/mm-accessories-estimation" },
        { label: "Accessories Booking", to: "/mm-accessories-booking" },
      ]}
      title="Accessories Booking"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            title="Return to Accessories Estimation"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>Estimation</span>
          </button>
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white shadow-xs transition-colors"
            title="Preview Booking Sheet"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          {bookingStatus === "Approved" ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Approved (Locked)
            </span>
          ) : bookingStatus === "Pending" || bookingStatus === "Submitted" ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              Pending Approval (Locked)
            </span>
          ) : (
            <>
              <button
                type="button"
                disabled={isSaving || isSubmitting}
                onClick={handleSaveBooking}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 shadow-xs transition-colors disabled:opacity-50"
                title="Save Accessories Booking as Draft"
              >
                <Save className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                <span>{isSaving ? "Saving..." : "Save"}</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting || isSaving}
                onClick={handleSubmitBooking}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors disabled:opacity-50"
                title="Submit Accessories Booking"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Submitting..." : "Submit for Approval"}</span>
              </button>
            </>
          )}
        </div>
      }
    >
      <div className="space-y-3 font-sans pb-10 text-xs">
        {bookingStatus === "Approved" && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="flex-1">
              <span className="font-bold">Booking Officially Approved:</span> Accessories Booking #{bookingNo} has been authorized. To maintain compliance and audit integrity, approved booking lines and header details are locked in read-only mode.
            </div>
            {editingBookingId && (
              <Link
                to="/mm-accessories-booking-approval-details"
                search={{ id: editingBookingId }}
                className="px-2.5 py-1 rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
              >
                View Approval
              </Link>
            )}
          </div>
        )}
        {(bookingStatus === "Pending" || bookingStatus === "Submitted") && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-300 shadow-xs">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 animate-pulse" />
            <div className="flex-1">
              <span className="font-bold">Pending Authorization:</span> Accessories Booking #{bookingNo} has been submitted and is currently in the approval review queue. It cannot be edited until reviewed or returned.
            </div>
            <Link
              to="/mm-accessories-booking-approval"
              className="px-2.5 py-1 rounded bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
            >
              Approval Queue
            </Link>
          </div>
        )}
        {bookingStatus === "Returned" && (
          <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl p-3.5 flex items-center gap-3 text-xs text-purple-800 dark:text-purple-300 shadow-xs">
            <RotateCcw className="w-5 h-5 text-purple-600 shrink-0" />
            <div className="flex-1">
              <span className="font-bold">Booking Returned for Correction:</span> This booking was returned by the authorization authority. Please modify the required fields and click <strong>Submit for Approval</strong> to resubmit.
            </div>
          </div>
        )}
        {/* ================================================================== */}
        {/* FORM CONTAINER WITH LEGACY ERP AESTHETICS                          */}
        {/* ================================================================== */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
          {/* ================================================================ */}
          {/* 1. LEGACY ERP WINDOW HEADER (Section 2.1 Cleaned)                 */}
          {/* ================================================================ */}
          <div className="bg-slate-200 dark:bg-slate-850 px-3 py-1.5 border-b border-slate-300 dark:border-slate-750 flex items-center justify-between gap-2 text-[11px]">
            <span className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              Accessories Booking
            </span>
          </div>

          {/* ================================================================ */}
          {/* 2. BOOKING INFORMATION SECTION (Section 3)                         */}
          {/* ================================================================ */}
          <div className="p-3 bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
            {/* Main Header Fields: 5 Logical Columns (Row 1: A-E, Row 2: F-J) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-2.5 items-center">
              {/* Position A: Job ID (read-only) */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="w-[80px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  Job ID:
                </label>
                <input
                  type="text"
                  readOnly
                  value={ourRef}
                  className="h-7.5 w-full min-w-0 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono font-bold text-teal-700 dark:text-teal-400 cursor-not-allowed text-left text-xs"
                />
              </div>

              {/* Position B & C: Supplier (Swapped with Booking No, read-only, tooltip for long names, intentional span across 2 columns) */}
              <div className="flex items-center gap-1.5 min-w-0 sm:col-span-2 lg:col-span-2">
                <label className="w-[80px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  Supplier:
                </label>
                <input
                  type="text"
                  readOnly
                  value={supplierName}
                  title={supplierName}
                  className="h-7.5 w-full min-w-0 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 cursor-not-allowed text-xs truncate"
                />
              </div>

              {/* Position D: Booking Date */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="w-[80px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  Booking Date:
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="h-7.5 w-full min-w-0 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Position E: Pay Mode */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="w-[80px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
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

              {/* Position F: Booking No (Swapped with Supplier, JobID/NN sequential format) */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="w-[80px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  Booking No:
                </label>
                <input
                  type="text"
                  readOnly
                  value={bookingNo}
                  className="h-7.5 w-full min-w-0 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-800 dark:text-slate-200 cursor-not-allowed text-left text-xs"
                />
              </div>

              {/* Position G: Booking Type (constrained dropdown with truncation & tooltip) */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="w-[80px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  Booking Type:
                </label>
                <select
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value as AccessoriesBookingType)}
                  title={bookingType}
                  className="h-7.5 w-full min-w-0 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-1 focus:ring-teal-500 focus:outline-none truncate"
                >
                  <option value="Main Accessories Booking">Main Accessories Booking</option>
                  <option value="Short Accessories Booking">Short Accessories Booking</option>
                  <option value="Additional Accessories Booking">Additional Accessories Booking</option>
                </select>
              </div>

              {/* Position H: Del Mode */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="w-[80px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
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

              {/* Position I: Del Place (Pakiza Companies Dropdown, constrained with truncation) */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="w-[80px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
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

              {/* Position J: Delivery Date */}
              <div className="flex items-center gap-1.5 min-w-0">
                <label className="w-[80px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
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

            {/* Bottom Row: Req Date, Terms & Conditions, PI No, Notes */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-750">
              <div className="flex flex-wrap items-center gap-4">
                {/* Req Date */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <label className="w-[80px] shrink-0 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    Req Date:
                  </label>
                  <input
                    type="date"
                    value={reqDate}
                    onChange={(e) => setReqDate(e.target.value)}
                    className="h-7.5 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                {/* Terms & Conditions button + '+' button */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="h-7.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded border border-slate-300 dark:border-slate-700 font-semibold text-[11px] flex items-center gap-1.5 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Terms &amp; Conditions</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="h-7.5 w-7.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-300 dark:border-slate-600 transition-colors"
                    title="Edit Terms & Conditions"
                  >
                    +
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
          {/* 3. SPLIT SECTION: SUMMARY GRID (LEFT) & PO ALLOCATION (RIGHT)     */}
          {/* ================================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-slate-200 dark:border-slate-800">
            {/* 3.1 Upper-Left: Accessories Booking Summary Grid (Col-Span-8) */}
            <div className="lg:col-span-8 p-3 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-teal-600" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide text-[11px]">
                    Accessories Booking Summary Grid
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    ({summaryLines.length} item{summaryLines.length === 1 ? "" : "s"})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddAccessoryModal(true)}
                  className="px-2 py-0.5 rounded font-bold text-[10px] bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Item</span>
                </button>
              </div>

              {/* Summary Grid Table (Columns: Job ID, Style, Grp Type + D, Accessories, P, Book Amt, Action) */}
              <div className="border border-slate-200 dark:border-slate-750 rounded-lg overflow-x-auto max-h-56 bg-white dark:bg-slate-950 shadow-inner">
                <table className="w-full border-collapse text-left text-[11px]">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                    <tr>
                      <th className="py-1.5 px-2.5">Job ID</th>
                      <th className="py-1.5 px-2.5">Style</th>
                      <th className="py-1.5 px-2 text-center w-16">Grp Type</th>
                      <th className="py-1.5 px-2.5">Accessories</th>
                      <th className="py-1.5 px-2 text-center w-12">P</th>
                      <th className="py-1.5 px-2.5 text-right w-28">Book Amt</th>
                      <th className="py-1.5 px-2 text-center w-14">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {summaryLines.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">
                          No accessory items added. Click <strong>+ Add Item</strong> or load from Accessories Estimation.
                        </td>
                      </tr>
                    ) : (
                      summaryLines.map((line) => {
                        const isSelected = activeLine?.id === line.id;
                        const isPopulated = Boolean(line.sizeWiseDetails && line.sizeWiseDetails.length > 0);
                        return (
                          <tr
                            key={line.id}
                            onClick={() => handleSelectSummaryLine(line.id)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-teal-50/70 dark:bg-teal-950/40 border-l-2 border-teal-600"
                                : "hover:bg-slate-50 dark:hover:bg-slate-850"
                            }`}
                          >
                            <td className="py-1.5 px-2.5 font-bold text-teal-700 dark:text-teal-400">
                              {line.ourRef}
                            </td>
                            <td className="py-1.5 px-2.5 font-sans font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                              {line.style}
                            </td>
                            {/* Grp Type with the CRITICAL "D" button (Trims text removed) */}
                            <td className="py-1 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center font-sans">
                                <button
                                  type="button"
                                  onClick={() => handleOpenPoSelectionModal(line)}
                                  className="w-5 h-5 rounded bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] shadow-xs flex items-center justify-center transition-colors"
                                  title={`Open PO Selection Window for ${line.accessoryItem} (D)`}
                                >
                                  D
                                </button>
                              </div>
                            </td>
                            <td className="py-1.5 px-2.5 font-sans font-bold text-slate-900 dark:text-slate-100">
                              {line.accessoryItem}
                            </td>
                            {/* P (Populate) button immediately after Accessories column */}
                            <td className="py-1 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handlePopulateSizeDetails(line.id)}
                                className={`w-6 h-5 rounded font-extrabold text-[11px] shadow-xs flex items-center justify-center transition-colors ${
                                  isPopulated
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700"
                                    : "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600"
                                }`}
                                title={`Populate Size-wise details for ${line.accessoryItem} (P)`}
                              >
                                P
                              </button>
                            </td>
                            <td className="py-1.5 px-2.5 text-right font-bold text-emerald-700 dark:text-emerald-400">
                              ${(line.bookAmt || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            {/* Row Delete Action */}
                            <td className="py-1 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleDeleteRowClick(line)}
                                className="w-6 h-6 mx-auto rounded flex items-center justify-center text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                                title={`Delete ${line.accessoryItem} entry`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Budget Value & Total Fields below Summary Grid */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-600 dark:text-slate-400 font-sans text-[11px]">Budget Value:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    ${summaryBudgetTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-600 dark:text-slate-400 font-sans text-[11px]">Total Book Amount:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    ${summaryBookingTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* 3.2 Upper-Right: PO and GMT Color Allocation Grid (Col-Span-4) */}
            <div className="lg:col-span-4 p-3 space-y-2 bg-slate-50/40 dark:bg-slate-900/40">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide text-[11px]">
                    PO and GMT Color Allocation Grid
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {activeAllocations.length} PO(s) allocated
                </span>
              </div>

              {/* PO Allocation Grid (# Column removed, ColSpan: 3) */}
              <div className="border border-slate-200 dark:border-slate-750 rounded-lg overflow-x-auto max-h-56 bg-white dark:bg-slate-950 shadow-inner">
                <table className="w-full border-collapse text-left text-[11px]">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                    <tr>
                      <th className="py-1.5 px-3">PO No.</th>
                      <th className="py-1.5 px-3">GMT Color</th>
                      <th className="py-1.5 px-3 text-right">GMT Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {activeAllocations.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-400 font-sans">
                          No POs allocated yet. Click <strong className="text-amber-600 font-mono">D</strong> on the summary table to open the PO Selection Window.
                        </td>
                      </tr>
                    ) : (
                      activeAllocations.map((alloc) => (
                        <tr
                          key={alloc.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-850 bg-teal-50/40 dark:bg-teal-950/20"
                        >
                          <td className="py-1.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                            {alloc.poNo}
                          </td>
                          <td className="py-1.5 px-3 font-sans font-semibold text-slate-700 dark:text-slate-300">
                            {alloc.gmtColor}
                          </td>
                          <td className="py-1.5 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                            {(alloc.gmtQty || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Selected Count & Total GMT Qty Summary below allocation grid */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 font-mono text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400 font-sans text-[11px]">
                  Allocations: <span className="font-bold text-teal-700 dark:text-teal-400 font-mono">{activeAllocations.length}</span>
                </span>
                <span className="font-semibold text-slate-600 dark:text-slate-400 font-sans text-[11px]">
                  Total GMT Qty:{" "}
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {activeAllocationsGmtQtyTotal.toLocaleString()} pcs
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* 4. DETAILED SIZE-WISE BOOKING GRID (Section 7)                    */}
          {/* ================================================================ */}
          <div className="p-3 bg-white dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide text-[11px]">
                  Detailed Size-wise Booking Grid
                </span>
              </div>
            </div>

            {/* Detailed Table (Columns: Job ID, Item Name, Desc, Color, Size, GMT Qty, Req Qty, Unit, Wastage %, Book Qty, Store Rcvd, Rate, Total) */}
            <div className="border border-slate-200 dark:border-slate-750 rounded-lg overflow-x-auto max-h-[420px] bg-white dark:bg-slate-950 shadow-xs relative">
              <table className="w-full border-collapse text-left whitespace-nowrap text-[11px]">
                <thead className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-700 sticky top-0 z-20">
                  <tr>
                    <th className="py-1.5 px-2.5 border-r border-slate-300 dark:border-slate-700">Job ID</th>
                    <th className="py-1.5 px-2.5 border-r border-slate-300 dark:border-slate-700">Item Name</th>
                    <th className="py-1.5 px-2.5 border-r border-slate-300 dark:border-slate-700">Description</th>
                    <th className="py-1.5 px-2 border-r border-slate-300 dark:border-slate-700">Color</th>
                    <th className="py-1.5 px-2 text-center border-r border-slate-300 dark:border-slate-700">Size</th>
                    <th className="py-1.5 px-2.5 text-right border-r border-slate-300 dark:border-slate-700">GMT Qty</th>
                    <th className="py-1.5 px-2.5 text-right border-r border-slate-300 dark:border-slate-700">Req Qty</th>
                    <th className="py-1.5 px-2 text-center border-r border-slate-300 dark:border-slate-700">Unit</th>
                    <th className="py-1.5 px-2 text-right border-r border-slate-300 dark:border-slate-700">Wastage %</th>
                    <th className="py-1.5 px-2.5 text-right border-r border-slate-300 dark:border-slate-700 font-extrabold text-teal-700 dark:text-teal-400">
                      Book Qty
                    </th>
                    <th className="py-1.5 px-2.5 text-right border-r border-slate-300 dark:border-slate-700">Store Rcvd</th>
                    <th className="py-1.5 px-2 text-right border-r border-slate-300 dark:border-slate-700">Rate ($)</th>
                    <th className="py-1.5 px-2.5 text-right font-bold text-emerald-700 dark:text-emerald-400">Total ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {activeSizeDetails.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="py-12 text-center text-slate-400 font-sans">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <Package className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                          <span className="font-semibold text-slate-500">
                            Detailed size-wise booking rows are not populated yet.
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Select PO allocations using the <strong className="text-amber-600 font-mono font-bold">D</strong> button, then click <strong className="text-emerald-600 font-mono font-bold">P</strong> in the summary grid to populate.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    activeSizeDetails.map((det) => (
                      <tr key={det.id} className="hover:bg-teal-50/30 dark:hover:bg-teal-950/20">
                        {/* 1. Job ID */}
                        <td className="py-1 px-2.5 font-bold text-teal-700 dark:text-teal-400 border-r border-slate-200 dark:border-slate-800">
                          {det.ourRef}
                        </td>

                        {/* 2. Item Name */}
                        <td className="py-1 px-2.5 font-sans font-semibold text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800">
                          {det.itemName}
                        </td>

                        {/* 3. Description */}
                        <td className="py-1 px-2.5 font-sans text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 truncate max-w-[140px]" title={det.description}>
                          {det.description}
                        </td>

                        {/* 4. Color */}
                        <td className="py-1 px-2 font-sans font-semibold text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800">
                          {det.color}
                        </td>

                        {/* 5. Size */}
                        <td className="py-1 px-2 text-center font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
                          {det.size}
                        </td>

                        {/* 6. GMT Qty (Read-Only) */}
                        <td className="py-1 px-2.5 text-right border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-850/50 cursor-not-allowed">
                          {(Number(det.gmtQty) || 0).toLocaleString()}
                        </td>

                        {/* 7. Req Qty */}
                        <td className="py-1 px-2.5 text-right font-semibold text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800">
                          {(Number(det.reqQty) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* 8. Unit */}
                        <td className="py-1 px-2 text-center font-mono text-[10px] text-slate-500 border-r border-slate-200 dark:border-slate-800">
                          {det.unit}
                        </td>

                        {/* 9. Wastage % (Read-Only, Section 7.4) */}
                        <td className="py-1 px-2 text-right border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-850/50 cursor-not-allowed font-mono">
                          {Number(det.bookedWastagePct || 0).toFixed(1)}%
                        </td>

                        {/* 10. Book Qty with R> Rounding control */}
                        <td className="py-1 px-2 text-right border-r border-slate-200 dark:border-slate-800 font-bold text-teal-700 dark:text-teal-400">
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              step="any"
                              value={det.bookQty}
                              onChange={(e) => handleDetailFieldChange(det.id, "bookQty", e.target.value)}
                              className="w-20 px-1 py-0.5 text-right rounded border border-transparent hover:border-teal-400 bg-transparent focus:bg-white dark:focus:bg-slate-900 font-bold text-teal-700 dark:text-teal-400"
                            />
                            <button
                              type="button"
                              onClick={() => handleRoundUpBookQty(det.id)}
                              className="px-1 py-0.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 rounded text-[9px] font-bold text-slate-700 dark:text-slate-200"
                              title="Round up to whole unit (R>)"
                            >
                              R&gt;
                            </button>
                          </div>
                        </td>

                        {/* 11. Store Rcvd Qty */}
                        <td className="py-1 px-2.5 text-right border-r border-slate-200 dark:border-slate-800 text-slate-400">
                          {(Number(det.storeRcvdQty) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* 12. Rate ($) */}
                        <td className="py-1 px-2 text-right border-r border-slate-200 dark:border-slate-800">
                          <input
                            type="number"
                            step="0.001"
                            value={det.rate}
                            onChange={(e) => handleDetailFieldChange(det.id, "rate", e.target.value)}
                            className="w-16 px-1 py-0.5 text-right rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-700 bg-transparent focus:bg-white dark:focus:bg-slate-900 font-medium text-slate-800 dark:text-slate-200"
                          />
                        </td>

                        {/* 13. Total ($) */}
                        <td className="py-1 px-2.5 text-right font-extrabold text-emerald-700 dark:text-emerald-400">
                          ${(det.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

                {/* 14. Summary Footer */}
                <tfoot className="bg-slate-100 dark:bg-slate-800 font-bold border-t-2 border-slate-300 dark:border-slate-700 font-mono text-[11px] sticky bottom-0 z-10">
                  <tr>
                    <td colSpan={5} className="py-2 px-3 text-right font-sans uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Total Summary:
                    </td>
                    <td className="py-2 px-2.5 text-right text-slate-800 dark:text-slate-200">
                      {sizeDetailsTotals.gmtQty.toLocaleString()}
                    </td>
                    <td className="py-2 px-2.5 text-right text-slate-800 dark:text-slate-200">
                      {sizeDetailsTotals.reqQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td></td>
                    <td></td>
                    <td className="py-2 px-2.5 text-right font-extrabold text-teal-700 dark:text-teal-400">
                      {sizeDetailsTotals.bookQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2 px-2.5 text-right text-slate-500">
                      {sizeDetailsTotals.storeRcvdQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td></td>
                    <td className="py-2 px-2.5 text-right font-extrabold text-emerald-700 dark:text-emerald-400">
                      ${sizeDetailsTotals.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ================================================================ */}
          {/* 5. FOOTER SECTION (Section 8 Parity & Actions)                    */}
          {/* ================================================================ */}
          <div className="p-3 bg-slate-100 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
            {/* Left Action: Attachment Modal Button (Fabric Booking Parity) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAttachmentModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                title="Document Storage — Accessories Booking Attachments"
              >
                <Paperclip className="w-3.5 h-3.5 text-teal-600" />
                <span>Attachment ({attachments.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 shadow-xs transition-colors"
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
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-300 dark:border-slate-750 shadow-xs"
                title="Create Proforma Invoice from this Accessories Booking"
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
              ) : (
                <>
                  <button
                    type="button"
                    disabled={isSaving || isSubmitting}
                    onClick={handleSaveBooking}
                    className="px-5 py-2 rounded-xl font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 shadow-xs flex items-center gap-1.5 text-xs transition-colors disabled:opacity-50"
                    title="Save current Accessories Booking information as draft"
                  >
                    <Save className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    <span>{isSaving ? "Saving..." : "Save"}</span>
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting || isSaving}
                    onClick={handleSubmitBooking}
                    className="px-6 py-2 rounded-xl font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm flex items-center gap-1.5 text-xs transition-colors disabled:opacity-50"
                    title="Validate and Submit Accessories Booking"
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
        {/* MODAL 1: PO SELECTION WINDOW ("D" Button Workflow — Section 5)     */}
        {/* ================================================================== */}
        {showPoSelectionModal && targetAccessoryLine && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-5xl w-full max-h-[85vh] flex flex-col text-xs overflow-hidden">
              {/* Header */}
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                    D
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    PO Selection Window — {targetAccessoryLine.accessoryItem}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCancelPoSelection}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Left-Side Information Panel & Search Area */}
              <div className="p-3 border-b border-slate-200 dark:border-slate-700 space-y-2 bg-slate-50 dark:bg-slate-850/50">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Job ID</span>
                    <span className="font-mono font-bold text-teal-700 dark:text-teal-400">{targetAccessoryLine.ourRef}</span>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Style</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 truncate block">{targetAccessoryLine.style}</span>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Item</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{targetAccessoryLine.accessoryItem}</span>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Desc</span>
                    <span className="text-slate-700 dark:text-slate-300 truncate block">{targetAccessoryLine.description}</span>
                  </div>
                </div>

                {/* Search, C Button, Select All & Pending/Booked/All Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-1.5 flex-1 max-w-md">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-2.5 top-2 text-slate-400" />
                      <input
                        type="text"
                        value={poSearchQuery}
                        onChange={(e) => setPoSearchQuery(e.target.value)}
                        placeholder="Search by PO No, Color..."
                        className="w-full pl-8 pr-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                      />
                    </div>
                    {/* The C control */}
                    <button
                      type="button"
                      onClick={() => setPoSearchQuery("")}
                      className="px-2 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 rounded font-bold text-xs"
                      title="Clear search filter (C)"
                    >
                      C
                    </button>
                  </div>

                  {/* Select All Option (Section 5.2) */}
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700 dark:text-slate-300 text-xs select-none bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700">
                    <input
                      type="checkbox"
                      checked={allEligiblePosSelected}
                      onChange={toggleSelectAllEligiblePos}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <span>Select All</span>
                  </label>

                  {/* Radio options: Pending, Booked, All */}
                  <div className="flex items-center gap-3 px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs">
                    {(["Pending", "Booked", "All"] as const).map((mode) => (
                      <label key={mode} className="flex items-center gap-1 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                        <input
                          type="radio"
                          name="poFilterStatus"
                          checked={poFilterStatus === mode}
                          onChange={() => setPoFilterStatus(mode)}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span>{mode}</span>
                      </label>
                    ))}
                  </div>

                  <div className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
                    {tempSelectedPoIds.length} of {eligiblePosForModal.length} PO(s) Selected
                  </div>
                </div>
              </div>

              {/* PO Selection Table (Columns: Checkbox, PO No., Del DT, Color, Qty, Book Qty, Balance; Lot and Country removed) */}
              <div className="flex-1 overflow-auto p-3">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 font-bold border-b border-slate-200 dark:border-slate-700 z-10">
                    <tr>
                      <th className="py-2 px-2 text-center w-10">
                        <input
                          type="checkbox"
                          checked={allEligiblePosSelected}
                          onChange={toggleSelectAllEligiblePos}
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                          title="Select All"
                        />
                      </th>
                      <th className="py-2 px-3 font-mono">PO No.</th>
                      <th className="py-2 px-2.5">Del DT</th>
                      <th className="py-2 px-3">Color</th>
                      <th className="py-2 px-3 text-right">Qty</th>
                      <th className="py-2 px-3 text-right">Book Qty</th>
                      <th className="py-2 px-3 text-right font-extrabold text-emerald-700 dark:text-emerald-400">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {eligiblePosForModal.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">
                          No matching PO allocation records found for this filter.
                        </td>
                      </tr>
                    ) : (
                      eligiblePosForModal.map((item) => {
                        const isChecked = tempSelectedPoIds.includes(item.id);
                        return (
                          <tr
                            key={item.id}
                            onClick={() => toggleTempPoId(item.id)}
                            className={`cursor-pointer transition-colors ${
                              isChecked
                                ? "bg-teal-50/70 dark:bg-teal-950/30 font-semibold"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            <td className="py-2 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleTempPoId(item.id)}
                                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                              />
                            </td>
                            <td className="py-2 px-3 font-bold text-teal-700 dark:text-teal-400">{item.poNo}</td>
                            <td className="py-2 px-2.5 text-slate-600 dark:text-slate-400">{item.delDt || "2026-11-20"}</td>
                            <td className="py-2 px-3 font-sans font-semibold text-slate-900 dark:text-slate-100">{item.gmtColor}</td>
                            <td className="py-2 px-3 text-right font-bold text-slate-800 dark:text-slate-200">
                              {(item.gmtQty || 0).toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-right text-slate-500">
                              {(item.bookQty || 0).toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-right font-extrabold text-emerald-700 dark:text-emerald-400">
                              {(item.balance || item.gmtQty || 0).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer: Back and OK buttons */}
              <div className="p-3 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleCancelPoSelection}
                  className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPoSelection}
                  className="px-6 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>OK</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MODAL 2: ADD ACCESSORY ITEM MODAL (Supplier-Filtered, Section 4.1) */}
        {/* ================================================================== */}
        {showAddAccessoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-750 pb-2">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block">
                    Add Accessory Item to Booking
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Showing eligible items for supplier: <strong className="text-teal-700 dark:text-teal-400">{supplierName}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddAccessoryModal(false)}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={addAccessorySearch}
                  onChange={(e) => setAddAccessorySearch(e.target.value)}
                  placeholder="Filter eligible accessory items..."
                  className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />

                <div className="max-h-60 overflow-auto border border-slate-200 dark:border-slate-750 rounded divide-y divide-slate-100 dark:divide-slate-800">
                  {eligibleEstimationItemsForSupplier
                    .filter((i) => !addAccessorySearch || (i.itemName || "").toLowerCase().includes(addAccessorySearch.toLowerCase()))
                    .map((item, idx) => (
                      <div
                        key={item.id || idx}
                        onClick={() => handleAddAccessoryLine(item)}
                        className="p-2.5 hover:bg-teal-50 dark:hover:bg-slate-850 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">{item.itemName}</span>
                          <span className="text-[11px] text-slate-500 block truncate max-w-md">{item.description || "Standard Accessory Spec"}</span>
                        </div>
                        <div className="text-right font-mono text-[11px]">
                          <span className="font-bold text-teal-700 dark:text-teal-400 block">${(item.unitRate || 0).toFixed(3)} / {item.marketUnit || "Pcs"}</span>
                          <span className="text-slate-400">Budget: ${(item.amount || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}

                  {eligibleEstimationItemsForSupplier.length === 0 && (
                    <div className="py-8 text-center text-slate-400">
                      No additional eligible accessory estimation items found for supplier <strong>{supplierName}</strong> under Job ID <strong>{ourRef}</strong>.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-750">
                <button
                  type="button"
                  onClick={() => setShowAddAccessoryModal(false)}
                  className="px-4 py-1.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MODAL 3: TERMS & CONDITIONS MODAL                                  */}
        {/* ================================================================== */}
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-xl w-full p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-750 pb-2">
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Accessories Booking Terms &amp; Conditions
                </span>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <textarea
                rows={8}
                value={termsAndConditions}
                onChange={(e) => setTermsAndConditions(e.target.value)}
                className="w-full p-2.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs leading-relaxed focus:ring-1 focus:ring-teal-500 outline-none"
                placeholder="Enter standard procurement terms and conditions..."
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-750">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="px-4 py-1.5 rounded border border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTermsModal(false);
                    toast.success("Terms & Conditions updated.");
                  }}
                  className="px-4 py-1.5 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                >
                  Save Terms
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MODAL 4: DOCUMENT ATTACHMENTS MODAL (Fabric Booking Shared Design) */}
        {/* ================================================================== */}
        <MMBookingAttachmentModal
          isOpen={showAttachmentModal}
          onClose={() => setShowAttachmentModal(false)}
          bookingNo={bookingNo}
          supplierName={supplierName}
          bookingTypeLabel="Accessories Booking"
          attachments={attachments}
          onAddAttachment={handleAddAttachment}
          onDeleteAttachment={handleDeleteAttachment}
        />

        {/* ================================================================== */}
        {/* MODAL 5: PRINTABLE ERP PREVIEW SHEET MODAL                         */}
        {/* ================================================================== */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col text-xs overflow-hidden">
              <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-teal-400" />
                  <span className="font-bold text-sm">
                    Print Preview — Accessories Booking Order Sheet ({bookingNo})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded text-xs flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Sheet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(false)}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-700 text-slate-300"
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
                    Accessories Booking Order Sheet
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded border border-slate-200">
                  <div className="space-y-1">
                    <p><strong>Booking No:</strong> <span className="font-mono text-teal-700 font-bold">{bookingNo}</span></p>
                    <p><strong>Job ID:</strong> <span className="font-mono font-bold">{ourRef}</span></p>
                    <p><strong>Supplier:</strong> {supplierName}</p>
                    <p><strong>Booking Type:</strong> {bookingType}</p>
                    <p><strong>Delivery Mode:</strong> {delMode}</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>Booking Date:</strong> {bookingDate}</p>
                    <p><strong>Delivery Date:</strong> {deliveryDate}</p>
                    <p><strong>Delivery Place:</strong> {delPlace}</p>
                    <p><strong>Pay Mode:</strong> {payMode}</p>
                    <p><strong>PI Reference:</strong> {piReference}</p>
                  </div>
                </div>

                {/* Summary Table */}
                <div className="space-y-1">
                  <span className="font-bold text-xs uppercase tracking-wide text-slate-700">1. Accessories Summary</span>
                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead className="bg-slate-100 font-bold text-slate-800">
                      <tr>
                        <th className="border border-slate-300 p-1.5 text-left">Job ID</th>
                        <th className="border border-slate-300 p-1.5 text-left">Style</th>
                        <th className="border border-slate-300 p-1.5 text-left">Accessory Item</th>
                        <th className="border border-slate-300 p-1.5 text-right">Book Amount ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryLines.map((l) => (
                        <tr key={l.id}>
                          <td className="border border-slate-300 p-1.5 font-mono">{l.ourRef}</td>
                          <td className="border border-slate-300 p-1.5">{l.style}</td>
                          <td className="border border-slate-300 p-1.5 font-bold">{l.accessoryItem}</td>
                          <td className="border border-slate-300 p-1.5 text-right font-mono font-bold text-emerald-700">
                            ${(l.bookAmt || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold">
                      <tr>
                        <td colSpan={3} className="border border-slate-300 p-1.5 text-right">Total Booking Value:</td>
                        <td className="border border-slate-300 p-1.5 text-right font-mono text-emerald-800 font-extrabold">
                          ${summaryBookingTotal.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Detailed Size Table */}
                <div className="space-y-1 pt-2">
                  <span className="font-bold text-xs uppercase tracking-wide text-slate-700">2. Size-wise Booking Details</span>
                  <table className="w-full border-collapse border border-slate-300 text-[10px]">
                    <thead className="bg-slate-100 font-bold text-slate-800">
                      <tr>
                        <th className="border border-slate-300 p-1 text-left">Item Name</th>
                        <th className="border border-slate-300 p-1 text-left">Color</th>
                        <th className="border border-slate-300 p-1 text-center">Size</th>
                        <th className="border border-slate-300 p-1 text-right">GMT Qty</th>
                        <th className="border border-slate-300 p-1 text-right">Req Qty</th>
                        <th className="border border-slate-300 p-1 text-center">Unit</th>
                        <th className="border border-slate-300 p-1 text-right">Wastage %</th>
                        <th className="border border-slate-300 p-1 text-right">Book Qty</th>
                        <th className="border border-slate-300 p-1 text-right">Rate ($)</th>
                        <th className="border border-slate-300 p-1 text-right">Total ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSizeDetails.map((det) => (
                        <tr key={det.id}>
                          <td className="border border-slate-300 p-1">{det.itemName}</td>
                          <td className="border border-slate-300 p-1">{det.color}</td>
                          <td className="border border-slate-300 p-1 text-center font-bold">{det.size}</td>
                          <td className="border border-slate-300 p-1 text-right font-mono">{(det.gmtQty || 0).toLocaleString()}</td>
                          <td className="border border-slate-300 p-1 text-right font-mono">{(det.reqQty || 0).toFixed(2)}</td>
                          <td className="border border-slate-300 p-1 text-center font-mono">{det.unit}</td>
                          <td className="border border-slate-300 p-1 text-right font-mono">{det.bookedWastagePct}%</td>
                          <td className="border border-slate-300 p-1 text-right font-mono font-bold text-teal-800">{(det.bookQty || 0).toFixed(2)}</td>
                          <td className="border border-slate-300 p-1 text-right font-mono">${(det.rate || 0).toFixed(3)}</td>
                          <td className="border border-slate-300 p-1 text-right font-mono font-bold text-emerald-800">${(det.total || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold">
                      <tr>
                        <td colSpan={7} className="border border-slate-300 p-1 text-right">Summary Totals:</td>
                        <td className="border border-slate-300 p-1 text-right font-mono text-teal-900 font-extrabold">{sizeDetailsTotals.bookQty.toFixed(2)}</td>
                        <td></td>
                        <td className="border border-slate-300 p-1 text-right font-mono text-emerald-900 font-extrabold">${sizeDetailsTotals.totalAmount.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Terms & Conditions */}
                <div className="pt-2 text-[10px] space-y-1">
                  <span className="font-bold uppercase tracking-wide text-slate-700">Procurement Terms:</span>
                  <p className="whitespace-pre-line text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                    {termsAndConditions}
                  </p>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-4 gap-4 pt-12 text-center text-xs font-semibold text-slate-600">
                  <div className="border-t border-slate-400 pt-1">Prepared By (Merchandiser)</div>
                  <div className="border-t border-slate-400 pt-1">Checked By (Head of Trims)</div>
                  <div className="border-t border-slate-400 pt-1">Approved By (GM - MM)</div>
                  <div className="border-t border-slate-400 pt-1">Supplier Acceptance</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* DELETE SUMMARY LINE CONFIRMATION MODAL                           */}
        {/* ================================================================ */}
        {deleteConfirmLine && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-rose-50/50 dark:bg-rose-950/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      Delete Accessory Entry
                    </h3>
                    <p className="text-xs text-slate-500">
                      Confirm deletion of booking line
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmLine(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <p>
                    Are you sure you want to delete the entry for{" "}
                    <strong className="text-slate-900 dark:text-slate-100">
                      {deleteConfirmLine.accessoryItem}
                    </strong>{" "}
                    (Job ID: <span className="font-mono font-semibold">{deleteConfirmLine.ourRef}</span>, Style:{" "}
                    <span className="font-semibold">{deleteConfirmLine.style}</span>)?
                  </p>
                </div>

                {((deleteConfirmLine.allocations?.length || 0) > 0 ||
                  (deleteConfirmLine.sizeWiseDetails?.length || 0) > 0) && (
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Associated Dependent Records Detected</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      This entry currently has{" "}
                      <strong>{deleteConfirmLine.allocations?.length || 0} PO allocation(s)</strong> and{" "}
                      <strong>{deleteConfirmLine.sizeWiseDetails?.length || 0} size-wise detail row(s)</strong>.
                      Deleting this entry will cleanly remove all associated allocations and size details. Source estimation records will remain untouched.
                    </p>
                  </div>
                )}
              </div>

              <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmLine(null)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteSummaryLine(deleteConfirmLine.id);
                    setDeleteConfirmLine(null);
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Row</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketingMerchandisingLayout>
  );
}
