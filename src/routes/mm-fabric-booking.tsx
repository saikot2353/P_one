import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useRef, Fragment } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMFabricBooking,
  MMFabricBookingLine,
  MMFabricBookingAllocation,
  MMFabricBookingDetail,
  MMFabricBookingItem,
  MMMainOrder,
  MMFabricEstimationRecord,
  MMFabricEstimationRow,
  MMFabricMasterItem,
  MMSupplierMasterItem,
  INITIAL_MM_SUPPLIERS_MASTER,
  INITIAL_MM_FABRIC_MASTER,
} from "../lib/marketing-merchandising-data";
import {
  Scissors,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Percent,
  TrendingDown,
  AlertTriangle,
  Save,
  Download,
  Calendar,
  ArrowLeft,
  Building2,
  User,
  FileText,
  Check,
  X,
  Printer,
  RefreshCw,
  Filter,
  Layers,
  DollarSign,
  Globe,
  Trash2,
  Edit3,
  ChevronDown,
  CheckSquare,
  Square,
  ShieldCheck,
  ExternalLink,
  Paperclip,
  Upload,
  Info,
  File,
  Send,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

export const FABRIC_BOOKING_ATTACHMENTS_STORAGE_KEY = "cripton_mm_fabric_booking_attachments_v1";

export interface MMFabricBookingAttachmentRecord {
  id: string;
  bookingId: string;
  fileName: string;
  title: string;
  documentType: string;
  note?: string;
  fileSize: string;
  fileSizeBytes: number;
  uploadedBy: string;
  uploadTime: string;
  storageType: "file" | "image";
  dataUrl?: string;
}

interface FabricBookingSearchParams {
  source?: string;
  jobId?: string;
  rowId?: string;
  rowIds?: string;
  supplier?: string;
  bookingId?: string;
  id?: string;
  tab?: string;
}

export const Route = createFileRoute("/mm-fabric-booking")({
  validateSearch: (search: Record<string, unknown>): FabricBookingSearchParams => ({
    source: (search.source as string) || undefined,
    jobId: (search.jobId as string) || undefined,
    rowId: (search.rowId as string) || undefined,
    rowIds: (search.rowIds as string) || undefined,
    supplier: (search.supplier as string) || undefined,
    bookingId: (search.bookingId as string) || undefined,
    id: (search.id as string) || undefined,
    tab: (search.tab as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Fabric Booking Management — Marketing & Merchandising | CriptonHRIS" },
      {
        name: "description",
        content:
          "Enterprise 3-section Fabric Booking form with PO allocation interface, multi-style supplier consolidation, automatic quantity suggestions, and Local Storage persistence.",
      },
    ],
  }),
  component: MMFabricBookingPage,
});

function MMFabricBookingPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  // Primary mode: "form" for active 3-section booking editor, "register" for list view
  const [viewMode, setViewMode] = useState<"form" | "register">("form");
  const [isSupplierLocked, setIsSupplierLocked] = useState<boolean>(false);

  // Master Data & Persisted Lists
  const [bookings, setBookings] = useState<MMFabricBooking[]>([]);
  const [orders, setOrders] = useState<MMMainOrder[]>([]);
  const [suppliers, setSuppliers] = useState<MMSupplierMasterItem[]>(INITIAL_MM_SUPPLIERS_MASTER);
  const [fabricMaster, setFabricMaster] = useState<MMFabricMasterItem[]>(INITIAL_MM_FABRIC_MASTER);
  const [estimations, setEstimations] = useState<MMFabricEstimationRecord[]>([]);
  const [policy, setPolicy] = useState(MMRepository.getPolicy());

  // Active Booking Form State (Section A: Header)
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [ourRef, setOurRef] = useState<string>("JOB-2026-0001");
  const [bookNo, setBookNo] = useState<string>("FB-2026-0035");
  const [supplierId, setSupplierId] = useState<string>("sup-001");
  const [supplierName, setSupplierName] = useState<string>("Pakiza Knitting & Dyeing");
  const [cp, setCp] = useState<string>("Md. Tanvir Ahmed");
  const [status, setStatus] = useState<string>("Draft");
  const [bookingDesc, setBookingDesc] = useState<string>("Main production fabric booking");
  const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [delMode, setDelMode] = useState<string>("Road");
  const [loadPort, setLoadPort] = useState<string>("Factory Warehouse");
  const [destination, setDestination] = useState<string>("Pakiza Knit Cutting Floor");
  const [reqDate, setReqDate] = useState<string>("2026-11-15");
  const [deliveryDate, setDeliveryDate] = useState<string>("2026-11-25");
  const [etaPort, setEtaPort] = useState<string>("2026-11-20");
  const [factDate, setFactDate] = useState<string>("2026-11-10");
  const [bookingType, setBookingType] = useState<string>("Main Fabric Booking");
  const [bookingUnit, setBookingUnit] = useState<string>("Pakiza Knit Composite Ltd.");
  const [delPlace, setDelPlace] = useState<string>("Pakiza Central Fabric Store");
  const [currency, setCurrency] = useState<string>("USD");
  const [convRate, setConvRate] = useState<number>(1.0);
  const [payMode, setPayMode] = useState<string>("Internal Transfer / TT 30 Days");
  const [note, setNote] = useState<string>("Fabric must be tested for shrinkage (< 4%) and color fastness.");
  const [termsAndConditions, setTermsAndConditions] = useState<string>(
    "1. Quality testing standard: ISO 105 color fastness to washing 4-5.\n2. Shrinkage tolerance: Length & Width max +/- 3%.\n3. Delivery F.O.R. cutting floor at Pakiza Composite Unit.\n4. Defective or off-shade rolls subject to immediate replacement within 72 hours."
  );
  const [piReference, setPiReference] = useState<string>("Not Linked");

  // Section B & C: Summary Lines with nested Allocations
  const [summaryLines, setSummaryLines] = useState<MMFabricBookingLine[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);

  // Active fabric line in Section B & C
  const activeLine = useMemo(() => {
    if (selectedLineId) {
      const found = summaryLines.find((l) => l.id === selectedLineId);
      if (found) return found;
    }
    return summaryLines[0] || null;
  }, [summaryLines, selectedLineId]);

  // Modals & Sub-interfaces
  const [showSupplierModal, setShowSupplierModal] = useState<boolean>(false);
  const [supplierSearch, setSupplierSearch] = useState<string>("");

  const [showAddFabricModal, setShowAddFabricModal] = useState<boolean>(false);
  const [addFabricSearch, setAddFabricSearch] = useState<string>("");

  // PO Selection Modal (Section 6 & 16 - "D" Button workflow)
  const [showPoSelectionModal, setShowPoSelectionModal] = useState<boolean>(false);
  const [targetFabricLine, setTargetFabricLine] = useState<MMFabricBookingLine | null>(null);
  const [tempSelectedPoIds, setTempSelectedPoIds] = useState<string[]>([]);
  const [poModalSearch, setPoModalSearch] = useState<string>("");

  // Terms & Conditions Modal
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [tempTerms, setTempTerms] = useState<string>("");

  // Preview / Print Modal
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // Document Storage Attachments (PI Entry Form Parity)
  const [showAttachmentModal, setShowAttachmentModal] = useState<boolean>(false);
  const [bookingAttachments, setBookingAttachments] = useState<MMFabricBookingAttachmentRecord[]>([]);
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState<string>("");
  const [uploadNote, setUploadNote] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadBookingAttachments = (targetBookingId: string): MMFabricBookingAttachmentRecord[] => {
    try {
      const raw = localStorage.getItem(FABRIC_BOOKING_ATTACHMENTS_STORAGE_KEY);
      if (!raw) return [];
      const list: MMFabricBookingAttachmentRecord[] = JSON.parse(raw);
      return list.filter((a) => a.bookingId === targetBookingId || (!a.bookingId && !targetBookingId));
    } catch {
      return [];
    }
  };

  const saveBookingAttachmentsToStorage = (updatedList: MMFabricBookingAttachmentRecord[]) => {
    try {
      const raw = localStorage.getItem(FABRIC_BOOKING_ATTACHMENTS_STORAGE_KEY);
      const list: MMFabricBookingAttachmentRecord[] = raw ? JSON.parse(raw) : [];
      const currentBookingKey = editingBookingId || bookNo || "booking-default";
      const otherRecords = list.filter((a) => a.bookingId !== currentBookingKey);
      const combined = [...otherRecords, ...updatedList];
      localStorage.setItem(FABRIC_BOOKING_ATTACHMENTS_STORAGE_KEY, JSON.stringify(combined));
    } catch (e) {
      console.error("Failed to persist attachments to LocalStorage:", e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 3 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of 3 MB.`);
      setSelectedUploadFile(null);
      e.target.value = "";
      return;
    }

    setSelectedUploadFile(file);
    if (!uploadTitle.trim()) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      setUploadTitle(nameWithoutExt);
    }
  };

  const handleUploadAttachment = () => {
    setUploadError(null);
    if (!selectedUploadFile) {
      setUploadError("Please select a file to upload.");
      return;
    }
    if (!uploadTitle.trim()) {
      setUploadError("Attachment Title is required.");
      return;
    }

    const currentBookingKey = editingBookingId || bookNo || "booking-default";
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newRecord: MMFabricBookingAttachmentRecord = {
        id: `att-${Date.now()}`,
        bookingId: currentBookingKey,
        fileName: selectedUploadFile.name,
        title: uploadTitle.trim(),
        documentType: "Fabric Booking Document",
        note: uploadNote.trim(),
        fileSize:
          selectedUploadFile.size < 1024 * 1024
            ? `${(selectedUploadFile.size / 1024).toFixed(1)} KB`
            : `${(selectedUploadFile.size / (1024 * 1024)).toFixed(2)} MB`,
        fileSizeBytes: selectedUploadFile.size,
        uploadedBy: cp || "Md. Tanvir Ahmed (Merchandiser)",
        uploadTime: new Date().toISOString().replace("T", " ").substring(0, 16),
        storageType: "file",
        dataUrl: dataUrl,
      };

      setBookingAttachments((prev) => {
        const next = [newRecord, ...prev];
        saveBookingAttachmentsToStorage(next);
        return next;
      });

      setSelectedUploadFile(null);
      setUploadTitle("");
      setUploadNote("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success(`Document "${newRecord.title}" uploaded successfully.`);
    };

    reader.onerror = () => {
      setUploadError("Failed to read file for upload.");
    };

    reader.readAsDataURL(selectedUploadFile);
  };

  const handleDeleteAttachment = (id: string) => {
    setBookingAttachments((prev) => {
      const next = prev.filter((a) => a.id !== id);
      saveBookingAttachmentsToStorage(next);
      return next;
    });
    toast.info("Attachment removed.");
  };

  const handleDownloadAttachment = (att: MMFabricBookingAttachmentRecord) => {
    try {
      if (!att) {
        toast.error("Attachment record not found.");
        return;
      }
      const link = document.createElement("a");
      let objectUrlToRevoke: string | null = null;
      if (att.dataUrl && (att.dataUrl.startsWith("data:") || att.dataUrl.startsWith("blob:"))) {
        link.href = att.dataUrl;
      } else {
        const textContent = `Fabric Booking Attached Document\nFilename: ${att.fileName}\nTitle: ${att.title}\nUploaded By: ${att.uploadedBy}\nUpload Time: ${att.uploadTime}\nFile Size: ${att.fileSize}\nNote: ${att.note || "N/A"}`;
        const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
        objectUrlToRevoke = URL.createObjectURL(blob);
        link.href = objectUrlToRevoke;
      }
      link.download = att.fileName || `${att.title.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (objectUrlToRevoke) {
        setTimeout(() => URL.revokeObjectURL(objectUrlToRevoke!), 1000);
      }
      toast.success(`Downloading ${att.fileName || att.title}`);
    } catch (e) {
      console.error("Download failed:", e);
      toast.error("Failed to download file. The file content is unavailable.");
    }
  };

  // Sync attachments with current booking ID / booking number
  useEffect(() => {
    const key = editingBookingId || bookNo;
    if (key) {
      setBookingAttachments(loadBookingAttachments(key));
    }
  }, [editingBookingId, bookNo]);

  // Register Search & Filters
  const [registerSearchTerm, setRegisterSearchTerm] = useState<string>("");
  const [registerStatusFilter, setRegisterStatusFilter] = useState<string>("All");

  // Rounding toggle state (Section C "R>")
  const [roundingApplied, setRoundingApplied] = useState<boolean>(false);
  const [overbookingReason, setOverbookingReason] = useState<string>("");
  const [deliveryDateError, setDeliveryDateError] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // Initialization & Staged Transfer Handler
  // --------------------------------------------------------------------------
  useEffect(() => {
    const loadedBookings = MMRepository.getFabricBookings();
    const loadedOrders = MMRepository.getOrders();
    const loadedSuppliers = MMRepository.getSuppliers();
    const loadedFabricMaster = MMRepository.getFabricMaster();
    const loadedEstimations = MMRepository.getFabricEstimations();
    const loadedPolicy = MMRepository.getPolicy();

    setBookings(loadedBookings);
    setOrders(loadedOrders);
    if (loadedSuppliers.length > 0) setSuppliers(loadedSuppliers);
    if (loadedFabricMaster.length > 0) setFabricMaster(loadedFabricMaster);
    setEstimations(loadedEstimations);
    setPolicy(loadedPolicy);

    // 1. If opening a specific saved booking
    const targetBookingParam = search.bookingId || search.id;
    if (targetBookingParam) {
      const b = loadedBookings.find((x) => x.id === targetBookingParam || x.bookingNo === targetBookingParam);
      if (b) {
        loadExistingBooking(b);
        return;
      } else {
        toast.error(`Booking record not found for "${targetBookingParam}".`);
      }
    }

    // 2. Check for staged transfer from Fabric Estimation
    let transferPayload: any = null;
    try {
      const s = sessionStorage.getItem("cripton_mm_fabric_booking_transfer_v1");
      const l = localStorage.getItem("cripton_mm_fabric_booking_transfer_v1");
      if (s) transferPayload = JSON.parse(s);
      else if (l) transferPayload = JSON.parse(l);
    } catch (e) {
      console.error("Error reading transfer payload:", e);
    }

    // 3. Fallback: Reconstruct from Fabric Estimation if navigated with query params
    if (
      !transferPayload &&
      (search.source === "estimation" ||
        search.source === "estimation_multi" ||
        search.rowId ||
        search.rowIds)
    ) {
      const targetIds = (
        search.rowIds ? search.rowIds.split(",") : [search.rowId]
      )
        .map((id) => (id ? id.trim() : ""))
        .filter(Boolean);

      const reconstructedItems: any[] = [];
      for (const tId of targetIds) {
        for (const est of loadedEstimations) {
          const foundRow = est.fabricRows.find((r) => r.id === tId);
          if (foundRow) {
            reconstructedItems.push({
              jobId: est.ourRef || est.jobNo,
              orderId: est.orderId,
              buyer: est.buyer,
              style: est.style,
              fabricEstimationId: est.id,
              fabricEstimationItemId: foundRow.id,
              fabricCode: foundRow.code || foundRow.fabricNo,
              fabricDescription: foundRow.fabricDescription,
              width: foundRow.width,
              usedPlace: foundRow.usedPlace,
              fabricColor:
                foundRow.singleColorName ||
                (foundRow.colorMappings && foundRow.colorMappings[0]?.itemColor) ||
                "Solid DTM",
              requiredQuantity: foundRow.requireQty,
              remainingQuantity: foundRow.requireQty,
              unit: foundRow.unit || foundRow.sku || "Kg",
              rate: foundRow.rate,
              estimatedFabricValue: (foundRow.requireQty || 0) * (foundRow.rate || 0),
              supplier: foundRow.supplier,
              supplierId: foundRow.supplierId,
              orderQuantity: est.quantity,
              colorMappings: foundRow.colorMappings || [],
              consum: foundRow.consum,
              wPct: foundRow.wPct,
              per: foundRow.per,
            });
            break;
          }
        }
      }

      if (reconstructedItems.length > 0) {
        transferPayload = {
          isMultiItem: true,
          supplier: reconstructedItems[0].supplier,
          supplierId: reconstructedItems[0].supplierId,
          jobId: reconstructedItems[0].jobId,
          style: reconstructedItems[0].style,
          buyer: reconstructedItems[0].buyer,
          items: reconstructedItems,
        };
      }
    }

    if (transferPayload) {
      // Clear transfer key so subsequent direct visits don't re-trigger
      try {
        sessionStorage.removeItem("cripton_mm_fabric_booking_transfer_v1");
        localStorage.removeItem("cripton_mm_fabric_booking_transfer_v1");
      } catch (e) {}

      initializeFromTransfer(transferPayload, loadedBookings, loadedSuppliers, loadedOrders);
    } else {
      // Default initial state: load the first booking or create a clean form
      if (loadedBookings.length > 0 && loadedBookings[0].lines && loadedBookings[0].lines.length > 0) {
        loadExistingBooking(loadedBookings[0]);
      } else {
        createNewEmptyBooking(loadedBookings);
      }
    }
  }, [search.source, search.rowId, search.rowIds, search.jobId, search.bookingId]);

  // Initialize a new booking pre-loaded with transferred estimation item(s)
  const initializeFromTransfer = (
    tp: any,
    existingBookings: MMFabricBooking[],
    allSuppliers: MMSupplierMasterItem[],
    allOrders: MMMainOrder[]
  ) => {
    setViewMode("form");
    setEditingBookingId(null);
    const orderRef = tp.jobId || "JOB-2026-0001";
    setOurRef(orderRef);
    const newBookNo = MMRepository.generateNextBookingNo(orderRef);
    setBookNo(newBookNo);
    setStatus("Draft");
    setDeliveryDateError(null);

    // Normalize collection of incoming estimation items
    const rawItems: any[] =
      tp.items && Array.isArray(tp.items) && tp.items.length > 0 ? tp.items : [tp];

    // Supplier resolution: use the common supplier context and strictly lock it
    const suppId = tp.supplierId || rawItems[0]?.supplierId;
    const suppName = tp.supplier || tp.supplierName || rawItems[0]?.supplier;
    const matchedSupp = allSuppliers.find(
      (s) =>
        (suppId && s.id === suppId) ||
        (suppName && s.supplierName.toLowerCase() === suppName.toLowerCase())
    );
    if (matchedSupp) {
      setSupplierId(matchedSupp.id);
      setSupplierName(matchedSupp.supplierName);
      setCp(matchedSupp.contactPerson || "Md. Tanvir Ahmed");
    } else if (suppName) {
      setSupplierId(suppId || "sup-001");
      setSupplierName(suppName);
      setCp("Contact Person");
    } else {
      setSupplierId("sup-001");
      setSupplierName("Pakiza Knitting & Dyeing");
      setCp("Md. Tanvir Ahmed");
    }
    setIsSupplierLocked(true);

    const effectiveDesc =
      rawItems.length > 1
        ? `Combined Fabric Booking for ${rawItems.length} items from ${matchedSupp?.supplierName || suppName}`
        : `Fabric booking transferred from Estimation (${orderRef} / ${rawItems[0]?.style || "T-Shirt"})`;
    setBookingDesc(effectiveDesc);
    setBookingDate(new Date().toISOString().slice(0, 10));

    // Construct distinct booking detail line for every transferred item
    const newLines: MMFabricBookingLine[] = rawItems.map((item, idx) => {
      const lineOrderRef = item.jobId || orderRef;
      const reqQty = Number(item.requiredQuantity ?? item.requireQty) || 0;
      const unitRate = Number(item.rate) || 4.10;
      const budgetVal =
        Number(item.estimatedFabricValue) || Math.round(reqQty * unitRate * 100) / 100;
      const remQty =
        item.remainingQuantity !== undefined ? Number(item.remainingQuantity) : reqQty;
      const prevBooked = Math.max(0, reqQty - remQty);

      return {
        id: `fbl-${Date.now()}-${idx + 1}`,
        fabricEstimationId: item.fabricEstimationId,
        fabricEstimationItemId: item.fabricEstimationItemId || item.id,
        jobId: lineOrderRef,
        ourRef: lineOrderRef,
        styleNo: item.style || "HM-KT-8841",
        styleNameSnapshot: item.style || "Crew Neck T-Shirt",
        buyerNameSnapshot: item.buyer || "H&M European Retail",
        supplierId: matchedSupp?.id || suppId || "sup-001",
        fabricCodeId: item.fabricCodeId,
        fabricCode: item.fabricCode || item.code || item.fabricNo || `FAB-00${idx + 1}`,
        fabricDescription: item.fabricDescription || "100% Cotton Fabric",
        width: item.width || '48" Open',
        usedPlace: item.usedPlace || "Body & Trims",
        grpType: "Main Body",
        color:
          item.fabricColor ||
          item.color ||
          item.singleColorName ||
          (item.colorMappings && item.colorMappings[0]?.itemColor) ||
          "Solid DTM",
        unit: item.unit || item.sku || "Kg",
        requiredQuantity: reqQty,
        previouslyBookedQuantity: prevBooked,
        remainingRequirement: remQty,
        suggestedBookingQuantity: 0,
        bookingQuantity: 0,
        receivedQuantity: 0,
        rate: unitRate,
        currency: "USD",
        lineTotal: 0,
        budgetValue: budgetVal,
        rcv: false,
        allocations: [],
        bookingDetails: [],
      };
    });

    setSummaryLines(newLines);
    if (newLines.length > 0) {
      setSelectedLineId(newLines[0].id);
    }
    toast.success(
      `Loaded ${newLines.length} Fabric Estimation item(s) for supplier "${matchedSupp?.supplierName || suppName}". Supplier is locked.`
    );
  };

  const createNewEmptyBooking = (existingBookings: MMFabricBooking[]) => {
    setViewMode("form");
    setEditingBookingId(null);
    setIsSupplierLocked(false);
    setBookingAttachments([]);
    setOurRef("");
    setBookNo("");
    setSupplierId("");
    setSupplierName("");
    setCp("");
    setStatus("Draft");
    setBookingDesc("");
    setBookingDate(new Date().toISOString().slice(0, 10));
    setDelMode("Road");
    setLoadPort("");
    setDestination("");
    setReqDate("");
    setDeliveryDate("");
    setEtaPort("");
    setFactDate("");
    setBookingType("Main Fabric Booking");
    setBookingUnit("");
    setDelPlace("");
    setCurrency("USD");
    setConvRate(1.0);
    setPayMode("Internal Transfer / TT 30 Days");
    setNote("");
    setTermsAndConditions("");
    setPiReference("Not Linked");
    setDeliveryDateError(null);
    setSummaryLines([]);
    setSelectedLineId(null);
    setTargetFabricLine(null);
    setTempSelectedPoIds([]);
    toast.info("Created a new empty fabric booking. Please select a supplier.");
  };

  const loadExistingBooking = (b: MMFabricBooking) => {
    setViewMode("form");
    setEditingBookingId(b.id);
    setIsSupplierLocked(true);
    setBookNo(b.bookingNo);
    setOurRef(b.ourRef || b.lines?.[0]?.ourRef || "JOB-2026-0001");
    setSupplierId(b.supplierId || "sup-001");
    setSupplierName(b.supplierName || "Pakiza Knitting & Dyeing");
    setCp(b.cp || "Md. Tanvir Ahmed");
    setStatus(b.status || "Draft");
    setBookingDesc(b.bookingDescription || "Bulk Fabric Booking");
    setBookingDate(b.bookingDate || new Date().toISOString().slice(0, 10));
    setDelMode(b.deliveryMode || "Road");
    setLoadPort(b.loadPort || "Factory Warehouse");
    setDestination(b.destination || b.destinationPlace || "Pakiza Knit Cutting Floor");
    setReqDate(b.requiredDate || "2026-11-15");
    setDeliveryDate(b.deliveryDate || "2026-11-25");
    setEtaPort(b.etaPort || "2026-11-20");
    setFactDate(b.factoryDate || "2026-11-10");
    setBookingType(b.bookingType || "Main Fabric Booking");
    setBookingUnit(b.bookingUnit || "Pakiza Knit Composite Ltd.");
    setDelPlace(b.deliveryPlace || "Pakiza Central Fabric Store");
    setCurrency(b.currency || "USD");
    setConvRate(b.conversionRate || 1.0);
    setPayMode(b.paymentMode || b.paymentTerms || "Internal Transfer / TT 30 Days");
    setNote(b.note || b.notes || "");
    setTermsAndConditions(b.termsAndConditions || "");
    setPiReference(b.piReference || "Not Linked");

    if (b.lines && b.lines.length > 0) {
      setSummaryLines(b.lines);
    } else if (b.items && b.items.length > 0) {
      // Map backwards compatibility items to full lines
      const mapped: MMFabricBookingLine[] = b.items.map((itm, idx) => ({
        id: `fbl-${idx + 1}`,
        fabricEstimationId: itm.estimationItemId,
        fabricEstimationItemId: itm.estimationItemId,
        jobId: itm.orderNo || b.ourRef || "JOB-2026-0001",
        ourRef: itm.orderNo || b.ourRef || "JOB-2026-0001",
        styleNo: itm.styleNo || "HM-KT-8841",
        styleNameSnapshot: itm.styleNo,
        buyerNameSnapshot: "H&M Hennes & Mauritz",
        supplierId: b.supplierId || "sup-001",
        fabricCode: "FAB-001",
        fabricDescription: itm.fabricDescription,
        width: itm.diaGsm,
        usedPlace: "Body & Trims",
        grpType: "Main Body",
        color: itm.fabricColor || "Solid Reactive",
        unit: itm.unit || "Kg",
        requiredQuantity: itm.requiredQty,
        previouslyBookedQuantity: 0,
        remainingRequirement: Math.max(0, itm.requiredQty - itm.bookedQty),
        suggestedBookingQuantity: itm.bookedQty,
        bookingQuantity: itm.bookedQty,
        receivedQuantity: 0,
        rate: itm.unitRate,
        currency: "USD",
        lineTotal: itm.totalAmount,
        budgetValue: itm.preCostAmount,
        rcv: false,
        allocations: [
          {
            id: `fba-compat-${idx}`,
            orderId: itm.orderId || "ord-001",
            poId: "po-001",
            poNumber: itm.poNumber || "PO-HM-99881-A",
            lotNumber: "LOT-01",
            colorName: itm.garmentColor || "All Colors",
            countryName: "Germany",
            garmentOrderQuantity: 10000,
            estimatedFabricRequirement: itm.requiredQty,
            previouslyBookedQuantity: 0,
            remainingRequirement: Math.max(0, itm.requiredQty - itm.bookedQty),
            suggestedBookingQuantity: itm.bookedQty,
            bookingQuantity: itm.bookedQty,
            unit: itm.unit || "Kg",
          },
        ],
      }));
      setSummaryLines(mapped);
    } else {
      setSummaryLines([]);
    }
  };

  // --------------------------------------------------------------------------
  // Summary & Totals Calculations
  // --------------------------------------------------------------------------
  const calculatedBookingTotal = useMemo(() => {
    return summaryLines.reduce((acc, l) => acc + (Number(l.lineTotal) || 0), 0);
  }, [summaryLines]);

  const calculatedTotalBookedQty = useMemo(() => {
    return summaryLines.reduce((acc, l) => acc + (Number(l.bookingQuantity) || 0), 0);
  }, [summaryLines]);

  const calculatedTotalBudgetValue = useMemo(() => {
    return summaryLines.reduce((acc, l) => acc + (Number(l.budgetValue) || 0), 0);
  }, [summaryLines]);

  const totalCostSaving = useMemo(() => {
    return calculatedTotalBudgetValue - calculatedBookingTotal;
  }, [calculatedTotalBudgetValue, calculatedBookingTotal]);

  const savingPercentage = useMemo(() => {
    if (calculatedTotalBudgetValue <= 0) return 0;
    return (totalCostSaving / calculatedTotalBudgetValue) * 100;
  }, [totalCostSaving, calculatedTotalBudgetValue]);

  // --------------------------------------------------------------------------
  // Supplier Selection Handler & Mismatch Guard (Section 4.2 & 10)
  // --------------------------------------------------------------------------
  const handleSelectSupplier = (supp: MMSupplierMasterItem) => {
    // Check existing lines against new supplier
    const conflictingLines = summaryLines.filter(
      (l) => l.supplierId && l.supplierId !== supp.id
    );

    if (conflictingLines.length > 0) {
      if (
        !window.confirm(
          `Changing supplier to "${supp.supplierName}" will create a supplier mismatch for ${conflictingLines.length} item(s) already in the booking. Do you want to proceed and update these items to "${supp.supplierName}"?`
        )
      ) {
        return;
      }
      // Update conflicting lines to newly selected supplier
      setSummaryLines((prev) =>
        prev.map((l) => ({
          ...l,
          supplierId: supp.id,
        }))
      );
    }

    setSupplierId(supp.id);
    setSupplierName(supp.supplierName);
    setCp(supp.contactPerson || "Md. Tanvir Ahmed");
    setShowSupplierModal(false);
    toast.success(`Selected Supplier: ${supp.supplierName}`);
  };

  // --------------------------------------------------------------------------
  // Add Fabric Item from Fabric Estimation (Multi-Style Support, Section 5 & 10)
  // Filtered strictly by active supplier (Section 3.3)
  // --------------------------------------------------------------------------
  const eligibleEstimationItems = useMemo(() => {
    const list: {
      estimationId: string;
      jobId: string;
      buyer: string;
      style: string;
      row: MMFabricEstimationRow;
      orderQty: number;
    }[] = [];

    if (!supplierId && !supplierName) {
      return list;
    }

    const curSuppId = supplierId?.trim().toLowerCase();
    const curSuppName = supplierName?.trim().toLowerCase();

    estimations.forEach((est) => {
      est.fabricRows.forEach((r) => {
        const rSuppId = (r.supplierId || "").trim().toLowerCase();
        const rSuppName = (r.supplier || "").trim().toLowerCase();

        const isSupplierMatch =
          (curSuppId && rSuppId && curSuppId === rSuppId) ||
          (curSuppName && rSuppName && curSuppName === rSuppName);

        if (!isSupplierMatch) return;

        // Exclude if already added to current booking lines
        const alreadyAdded = summaryLines.some(
          (l) =>
            (l.fabricEstimationItemId && l.fabricEstimationItemId === r.id) ||
            (l.jobId === (est.ourRef || est.jobNo) && l.fabricCode === r.code)
        );
        if (!alreadyAdded) {
          list.push({
            estimationId: est.id,
            jobId: est.ourRef || est.jobNo || "JOB-2026-0001",
            buyer: est.buyer,
            style: est.style,
            row: r,
            orderQty: est.quantity,
          });
        }
      });
    });

    return list;
  }, [estimations, summaryLines, supplierId, supplierName]);

  // Helper to extract eligible PO lines for a fabric item from parent orders
  const getEligiblePosForLine = (line: MMFabricBookingLine): MMFabricBookingAllocation[] => {
    const parentOrder = orders.find(
      (o) =>
        o.jobNo === line.jobId ||
        o.ourRef === line.jobId ||
        o.orderNo === line.jobId ||
        (o.styleNo && line.styleNo && o.styleNo.toLowerCase() === line.styleNo.toLowerCase())
    );

    const eligibleList: MMFabricBookingAllocation[] = [];

    if (parentOrder && parentOrder.poDetails && parentOrder.poDetails.length > 0) {
      parentOrder.poDetails.forEach((p, pIdx) => {
        if (p.breakdown?.colorBreakdowns && p.breakdown.colorBreakdowns.length > 0) {
          p.breakdown.colorBreakdowns.forEach((cb: any, cIdx: number) => {
            const allocId = `${line.id}-${p.poNumber || p.id}-${cb.color || "DTM"}-${pIdx}-${cIdx}`;
            const gmtQty = Number(cb.quantity) || Math.round(Number(p.qty || 10000) / (p.breakdown?.colorBreakdowns?.length || 1));
            const bookedQty = 0;
            eligibleList.push({
              id: allocId,
              orderId: parentOrder.id,
              poId: p.id,
              poNumber: p.poNumber || `PO-HM-${pIdx + 1}`,
              lotNumber: p.lot || `LOT-0${pIdx + 1}`,
              colorName: cb.color || line.color || "Black",
              countryName: p.destCountry || parentOrder.destinationCountry || "Germany",
              garmentOrderQuantity: gmtQty,
              bookedOrderQuantity: bookedQty,
              balance: Math.max(0, gmtQty - bookedQty),
              estimatedFabricRequirement: 0,
              previouslyBookedQuantity: bookedQty,
              remainingRequirement: gmtQty,
              suggestedBookingQuantity: 0,
              bookingQuantity: 0,
              unit: line.unit || "Kg",
              selected: true,
            });
          });
        } else {
          const allocId = `${line.id}-${p.poNumber || p.id}-${pIdx}`;
          const gmtQty = Number(p.qty) || 10000;
          const bookedQty = 0;
          eligibleList.push({
            id: allocId,
            orderId: parentOrder.id,
            poId: p.id,
            poNumber: p.poNumber || `PO-HM-${pIdx + 1}`,
            lotNumber: p.lot || `LOT-0${pIdx + 1}`,
            colorName: line.color || "Black",
            countryName: p.destCountry || parentOrder.destinationCountry || "Germany",
            garmentOrderQuantity: gmtQty,
            bookedOrderQuantity: bookedQty,
            balance: Math.max(0, gmtQty - bookedQty),
            estimatedFabricRequirement: 0,
            previouslyBookedQuantity: bookedQty,
            remainingRequirement: gmtQty,
            suggestedBookingQuantity: 0,
            bookingQuantity: 0,
            unit: line.unit || "Kg",
            selected: true,
          });
        }
      });
    } else {
      // Deterministic fallback eligible PO lines for testing multi-PO selection
      eligibleList.push(
        {
          id: `${line.id}-PO-HM-99881-A-Black`,
          orderId: "ord-001",
          poId: "po-001",
          poNumber: "PO-HM-99881-A",
          lotNumber: "LOT-01",
          colorName: "Black",
          countryName: "Germany",
          garmentOrderQuantity: 15000,
          bookedOrderQuantity: 0,
          balance: 15000,
          estimatedFabricRequirement: 0,
          previouslyBookedQuantity: 0,
          remainingRequirement: 15000,
          suggestedBookingQuantity: 0,
          bookingQuantity: 0,
          unit: line.unit || "Kg",
          selected: true,
        },
        {
          id: `${line.id}-PO-HM-99881-A-Melange`,
          orderId: "ord-001",
          poId: "po-001",
          poNumber: "PO-HM-99881-A",
          lotNumber: "LOT-01",
          colorName: "Melange Grey",
          countryName: "Germany",
          garmentOrderQuantity: 10000,
          bookedOrderQuantity: 0,
          balance: 10000,
          estimatedFabricRequirement: 0,
          previouslyBookedQuantity: 0,
          remainingRequirement: 10000,
          suggestedBookingQuantity: 0,
          bookingQuantity: 0,
          unit: line.unit || "Kg",
          selected: true,
        },
        {
          id: `${line.id}-PO-HM-99881-B-Black`,
          orderId: "ord-001",
          poId: "po-002",
          poNumber: "PO-HM-99881-B",
          lotNumber: "LOT-02",
          colorName: "Black",
          countryName: "Sweden",
          garmentOrderQuantity: 12000,
          bookedOrderQuantity: 0,
          balance: 12000,
          estimatedFabricRequirement: 0,
          previouslyBookedQuantity: 0,
          remainingRequirement: 12000,
          suggestedBookingQuantity: 0,
          bookingQuantity: 0,
          unit: line.unit || "Kg",
          selected: true,
        },
        {
          id: `${line.id}-PO-HM-99881-B-Melange`,
          orderId: "ord-001",
          poId: "po-002",
          poNumber: "PO-HM-99881-B",
          lotNumber: "LOT-02",
          colorName: "Melange Grey",
          countryName: "Sweden",
          garmentOrderQuantity: 8000,
          bookedOrderQuantity: 0,
          balance: 8000,
          estimatedFabricRequirement: 0,
          previouslyBookedQuantity: 0,
          remainingRequirement: 8000,
          suggestedBookingQuantity: 0,
          bookingQuantity: 0,
          unit: line.unit || "Kg",
          selected: true,
        }
      );
    }

    return eligibleList;
  };

  const handleAddFabricItem = (item: (typeof eligibleEstimationItems)[0]) => {
    const r = item.row;

    // Supplier mismatch check (Section 5.3 & Section 10)
    const itemSupp = r.supplier || "Pakiza Knitting & Dyeing";
    if (
      supplierName &&
      supplierName.trim().toLowerCase() !== itemSupp.trim().toLowerCase()
    ) {
      toast.error(
        `Supplier Mismatch: This fabric item is associated with "${itemSupp}", but the current booking is for "${supplierName}". All items in a single booking must belong to the same supplier.`
      );
      return;
    }

    const unitRate = Number(r.rate) || 4.20;
    const reqQty = Number(r.requireQty) || 0;
    const budgetVal = Math.round(reqQty * unitRate * 100) / 100;

    const newLine: MMFabricBookingLine = {
      id: `fbl-${Date.now()}`,
      fabricEstimationId: item.estimationId,
      fabricEstimationItemId: r.id,
      jobId: item.jobId,
      ourRef: item.jobId,
      styleNo: item.style,
      styleNameSnapshot: item.style,
      buyerNameSnapshot: item.buyer,
      supplierId: supplierId,
      fabricCodeId: r.fabricCodeId,
      fabricCode: r.code || r.fabricNo || "FAB-001",
      fabricDescription: r.fabricDescription || "100% Cotton Knitted Fabric",
      width: r.width || '68/70"',
      usedPlace: r.usedPlace || "Body",
      grpType: "Main Body",
      color: r.singleColorName || (r.colorMappings && r.colorMappings[0]?.itemColor) || "Solid DTM",
      unit: r.unit || r.sku || "Kg",
      requiredQuantity: reqQty,
      previouslyBookedQuantity: 0,
      remainingRequirement: reqQty,
      suggestedBookingQuantity: 0,
      bookingQuantity: 0,
      receivedQuantity: 0,
      rate: unitRate,
      currency: currency,
      lineTotal: 0,
      budgetValue: budgetVal,
      rcv: false,
      allocations: [],
      bookingDetails: [],
    };

    setSummaryLines((prev) => [...prev, newLine]);
    setSelectedLineId(newLine.id);
    setShowAddFabricModal(false);
    toast.success(`Added fabric item: ${newLine.fabricDescription} (${item.style}). Click 'D.' to select POs.`);
  };

  const handleRemoveSummaryLine = (lineId: string) => {
    setSummaryLines((prev) => {
      const filtered = prev.filter((l) => l.id !== lineId);
      if (selectedLineId === lineId) {
        setSelectedLineId(filtered[0]?.id || null);
      }
      return filtered;
    });
    toast.info("Fabric item removed from booking.");
  };

  // --------------------------------------------------------------------------
  // PO Selection Modal Handlers (The "D" Button - Section 6, 7, 16)
  // --------------------------------------------------------------------------
  const handleOpenPoSelectionModal = (line: MMFabricBookingLine) => {
    setTargetFabricLine(line);
    setSelectedLineId(line.id);

    // Load already confirmed PO IDs for this line
    const existingIds = (line.allocations || []).map((a) => a.id);
    setTempSelectedPoIds(existingIds);
    setPoModalSearch("");
    setShowPoSelectionModal(true);
  };

  const handleToggleSelectAll = (filteredEligible: MMFabricBookingAllocation[]) => {
    const filteredIds = filteredEligible.map((p) => p.id);
    const allSelected = filteredIds.every((id) => tempSelectedPoIds.includes(id));

    if (allSelected) {
      // Deselect all filtered
      setTempSelectedPoIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      // Select all filtered
      setTempSelectedPoIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleToggleTempPo = (poId: string) => {
    setTempSelectedPoIds((prev) =>
      prev.includes(poId) ? prev.filter((id) => id !== poId) : [...prev, poId]
    );
  };

  const handleCancelPoSelection = () => {
    setShowPoSelectionModal(false);
    setTempSelectedPoIds([]);
  };

  const handleConfirmPoSelection = () => {
    if (!targetFabricLine) return;

    const allEligible = getEligiblePosForLine(targetFabricLine);
    const confirmed = allEligible.filter((p) => tempSelectedPoIds.includes(p.id));

    // Preserve existing selection flags or initialize selected: true
    const updatedAllocations: MMFabricBookingAllocation[] = confirmed.map((p) => {
      const existing = (targetFabricLine.allocations || []).find((a) => a.id === p.id);
      return {
        ...p,
        selected: existing ? existing.selected !== false : true,
      };
    });

    setSummaryLines((prev) =>
      prev.map((l) => {
        if (l.id === targetFabricLine.id) {
          return {
            ...l,
            allocations: updatedAllocations,
          };
        }
        return l;
      })
    );

    setShowPoSelectionModal(false);
    toast.success(
      `Confirmed ${updatedAllocations.length} PO(s) for ${targetFabricLine.fabricCode}. Now click 'P' under Populate to calculate fabric requirements.`
    );
  };

  // Toggle PO inclusion/exclusion in Section B Right-Side Allocation Table
  const handleToggleAllocationSelected = (lineId: string, allocId: string) => {
    setSummaryLines((prev) =>
      prev.map((l) => {
        if (l.id === lineId) {
          const updatedAllocs = (l.allocations || []).map((a) => {
            if (a.id === allocId) {
              return { ...a, selected: a.selected === false ? true : false };
            }
            return a;
          });
          return {
            ...l,
            allocations: updatedAllocs,
          };
        }
        return l;
      })
    );
  };

  // --------------------------------------------------------------------------
  // The "V" Button — Color-wise Fabric Requirement Calculation (Section 8, 9, 16)
  // --------------------------------------------------------------------------
  const handleCalculateFabricDetails = (line: MMFabricBookingLine) => {
    setSelectedLineId(line.id);

    // 1. Validation: At least one PO must be selected
    const activeAllocations = (line.allocations || []).filter((a) => a.selected !== false);
    if (activeAllocations.length === 0) {
      toast.error("Please select a PO before proceeding with the populate action.");
      return;
    }

    // 2. Validation: Find Fabric Estimation record
    const estRecord = estimations.find(
      (e) =>
        e.id === line.fabricEstimationId ||
        e.jobNo === line.jobId ||
        e.ourRef === line.ourRef ||
        e.ourRef === line.jobId ||
        e.orderId === line.jobId
    );

    if (!estRecord) {
      toast.error(`No Fabric Estimation found for Job ${line.jobId || line.ourRef}. Please ensure fabric estimation is saved.`);
      return;
    }

    // 3. Validation: Find matching fabric row in Fabric Estimation
    const estRow =
      estRecord.fabricRows.find(
        (r) =>
          r.id === line.fabricEstimationItemId ||
          r.code?.toLowerCase() === line.fabricCode?.toLowerCase() ||
          r.fabricNo?.toLowerCase() === line.fabricCode?.toLowerCase()
      ) || estRecord.fabricRows[0];

    if (!estRow) {
      toast.error(`No matching fabric estimation item found for fabric code ${line.fabricCode}.`);
      return;
    }

    // 4. Color Mapping: Validate and resolve Garment Color to Fabric Color mapping
    const colorMappings = estRow.colorMappings || [];
    const singleColor = estRow.singleColorName;

    // 5. Consumption derivation
    const consumRate = Number(estRow.consum) || 2.65;
    const basis = (estRow.per === "Pcs" || estRow.per === "pc") ? 1 : 12;
    const wPct = Number(estRow.wPct) || 5;
    const unit = estRow.unit || estRow.sku || line.unit || "Kg";
    const usedPlace = estRow.usedPlace || line.usedPlace || "Body";
    const width = estRow.width || line.width || '48" Open';
    const supplierRate = Number(line.rate) || Number(estRow.rate) || 4.10;

    const generatedDetails: MMFabricBookingDetail[] = [];

    for (const alloc of activeAllocations) {
      const gmtColor = alloc.colorName || "Black";
      let mappedFabricColor = "";

      const match = colorMappings.find(
        (m: any) => m.garmentsColor?.trim().toLowerCase() === gmtColor.trim().toLowerCase()
      );

      if (match && match.itemColor) {
        mappedFabricColor = match.itemColor;
      } else if (singleColor) {
        mappedFabricColor = singleColor;
      } else if (colorMappings.length === 1 && colorMappings[0].itemColor) {
        mappedFabricColor = colorMappings[0].itemColor;
      } else if (line.color) {
        mappedFabricColor = line.color;
      } else {
        toast.error(`Missing color mapping for garment color: "${gmtColor}". Please verify Fabric Estimation.`);
        return;
      }

      const garmentQty = Number(alloc.garmentOrderQuantity) || 0;
      const reqQty = Math.round((garmentQty * (consumRate / basis) * (1 + wPct / 100)) * 100) / 100;

      // Prevent duplicates: find if row already exists for this PO line + colors
      const detailId = `fbd-${line.id}-${alloc.poNumber}-${gmtColor}-${mappedFabricColor}`.replace(/\s+/g, "-");
      const existingDetail = (line.bookingDetails || []).find((d) => d.id === detailId);

      const bookQty = existingDetail ? existingDetail.bookingQuantity : reqQty;
      const rate = existingDetail ? existingDetail.rate : supplierRate;
      const lineTotal = Math.round(bookQty * rate * 100) / 100;

      generatedDetails.push({
        id: detailId,
        bookingLineId: line.id,
        poId: alloc.poId,
        poNumber: alloc.poNumber,
        lotNumber: alloc.lotNumber || "LOT-01",
        countryName: alloc.countryName || "Germany",
        rcv: existingDetail ? !!existingDetail.rcv : false,
        ourRef: line.ourRef || line.jobId,
        usedPlace: usedPlace,
        fabricCode: line.fabricCode,
        fabricDescription: line.fabricDescription,
        width: width,
        garmentColor: gmtColor,
        fabricColor: mappedFabricColor,
        requiredQuantity: reqQty,
        unit: unit,
        bookingQuantity: bookQty,
        receivedQuantity: existingDetail?.receivedQuantity || 0,
        rate: rate,
        lineTotal: lineTotal,
      });
    }

    const totalReqQty = generatedDetails.reduce((sum, d) => sum + d.requiredQuantity, 0);
    const totalBookQty = generatedDetails.reduce((sum, d) => sum + d.bookingQuantity, 0);
    const totalLineAmount = generatedDetails.reduce((sum, d) => sum + d.lineTotal, 0);
    const budgetVal = Math.round(totalReqQty * (estRow.rate || supplierRate) * 100) / 100;

    setSummaryLines((prev) =>
      prev.map((l) => {
        if (l.id === line.id) {
          return {
            ...l,
            requiredQuantity: totalReqQty,
            bookingQuantity: totalBookQty,
            lineTotal: totalLineAmount,
            budgetValue: budgetVal,
            bookingDetails: generatedDetails,
          };
        }
        return l;
      })
    );

    toast.success(
      `Calculated color-wise fabric requirements for ${line.fabricCode}: ${generatedDetails.length} detail line(s) populated in Section C.`
    );
  };

  // --------------------------------------------------------------------------
  // Detail Grid Editing (Section 10 — Book Qty, Rate, Rcv, Rounding)
  // --------------------------------------------------------------------------
  const handleUpdateDetailBookQty = (lineId: string, detailId: string, val: number) => {
    const safeQty = isNaN(val) ? 0 : Math.max(0, val);
    setSummaryLines((prev) =>
      prev.map((l) => {
        if (l.id === lineId && l.bookingDetails) {
          const updatedDetails = l.bookingDetails.map((d) => {
            if (d.id === detailId) {
              return {
                ...d,
                bookingQuantity: safeQty,
                lineTotal: Math.round(safeQty * d.rate * 100) / 100,
              };
            }
            return d;
          });
          const newBookQty = updatedDetails.reduce((sum, d) => sum + d.bookingQuantity, 0);
          const newLineTotal = updatedDetails.reduce((sum, d) => sum + d.lineTotal, 0);
          return {
            ...l,
            bookingQuantity: newBookQty,
            lineTotal: newLineTotal,
            bookingDetails: updatedDetails,
          };
        }
        return l;
      })
    );
  };

  const handleUpdateDetailRate = (lineId: string, detailId: string, val: number) => {
    const safeRate = isNaN(val) ? 0 : Math.max(0, val);
    setSummaryLines((prev) =>
      prev.map((l) => {
        if (l.id === lineId && l.bookingDetails) {
          const updatedDetails = l.bookingDetails.map((d) => {
            if (d.id === detailId) {
              return {
                ...d,
                rate: safeRate,
                lineTotal: Math.round(d.bookingQuantity * safeRate * 100) / 100,
              };
            }
            return d;
          });
          const newLineTotal = updatedDetails.reduce((sum, d) => sum + d.lineTotal, 0);
          return {
            ...l,
            rate: safeRate,
            lineTotal: newLineTotal,
            bookingDetails: updatedDetails,
          };
        }
        return l;
      })
    );
  };

  const handleRoundDetailQty = (lineId: string, detailId: string) => {
    setSummaryLines((prev) =>
      prev.map((l) => {
        if (l.id === lineId && l.bookingDetails) {
          const updatedDetails = l.bookingDetails.map((d) => {
            if (d.id === detailId) {
              const rounded = Math.ceil(d.bookingQuantity);
              return {
                ...d,
                bookingQuantity: rounded,
                lineTotal: Math.round(rounded * d.rate * 100) / 100,
              };
            }
            return d;
          });
          const newBookQty = updatedDetails.reduce((sum, d) => sum + d.bookingQuantity, 0);
          const newLineTotal = updatedDetails.reduce((sum, d) => sum + d.lineTotal, 0);
          return {
            ...l,
            bookingQuantity: newBookQty,
            lineTotal: newLineTotal,
            bookingDetails: updatedDetails,
          };
        }
        return l;
      })
    );
  };

  const handleToggleDetailRcv = (lineId: string, detailId: string) => {
    setSummaryLines((prev) =>
      prev.map((l) => {
        if (l.id === lineId && l.bookingDetails) {
          return {
            ...l,
            bookingDetails: l.bookingDetails.map((d) =>
              d.id === detailId ? { ...d, rcv: !d.rcv } : d
            ),
          };
        }
        return l;
      })
    );
  };

  const handleToggleRounding = () => {
    if (!activeLine || !activeLine.bookingDetails) return;
    setRoundingApplied(!roundingApplied);

    setSummaryLines((prev) =>
      prev.map((l) => {
        if (l.id === activeLine.id && l.bookingDetails) {
          const updatedDetails = l.bookingDetails.map((d) => {
            const rounded = !roundingApplied ? Math.ceil(d.bookingQuantity) : d.requiredQuantity;
            return {
              ...d,
              bookingQuantity: rounded,
              lineTotal: Math.round(rounded * d.rate * 100) / 100,
            };
          });
          const newBookQty = updatedDetails.reduce((sum, d) => sum + d.bookingQuantity, 0);
          const newLineTotal = updatedDetails.reduce((sum, d) => sum + d.lineTotal, 0);
          return {
            ...l,
            bookingQuantity: newBookQty,
            lineTotal: newLineTotal,
            bookingDetails: updatedDetails,
          };
        }
        return l;
      })
    );
    toast.info(!roundingApplied ? "Whole unit rounding applied to active booking details." : "Original calculated quantities restored.");
  };

  // --------------------------------------------------------------------------
  // Save Booking to Local Storage & Update Estimation (Section 4, 14, 15)
  // --------------------------------------------------------------------------
  const handleSaveBooking = () => {
    // Lock validation: cannot modify Approved or Pending bookings
    if (status === "Approved") {
      toast.error("Cannot modify an Approved booking. It is locked in read-only mode.");
      return;
    }
    if (status === "Pending") {
      toast.error("This booking has been submitted for approval and is locked.");
      return;
    }

    // 1. Validations
    if (!supplierName || !supplierName.trim()) {
      toast.error("Validation Error: Please select a Supplier before saving.");
      return;
    }

    if (!deliveryDate || !deliveryDate.trim()) {
      setDeliveryDateError("Delivery Date is mandatory.");
      toast.error("Validation Error: Delivery Date is mandatory.");
      return;
    }
    setDeliveryDateError(null);

    if (summaryLines.length === 0) {
      toast.error("Validation Error: At least one fabric item is required in the booking.");
      return;
    }

    for (let i = 0; i < summaryLines.length; i++) {
      const line = summaryLines[i];
      if (line.bookingQuantity <= 0) {
        toast.error(`Item #${i + 1} (${line.fabricDescription}): Please enter a valid booking quantity greater than zero.`);
        return;
      }
      if (line.rate <= 0) {
        toast.error(`Item #${i + 1} (${line.fabricDescription}): Please enter a valid booking rate greater than zero.`);
        return;
      }
    }

    // 2. Prepare items for compatibility with existing PI and saving variance calculations
    const itemsCompat: MMFabricBookingItem[] = summaryLines.map((l, idx) => {
      const budgetVal = l.budgetValue || l.lineTotal;
      const initialSaving = budgetVal - l.lineTotal;
      const savingPct = budgetVal > 0 ? (initialSaving / budgetVal) * 100 : 0;

      return {
        bookingItemId: `FBI-${bookNo.replace(/[^0-9]/g, "").slice(-3) || "001"}-${idx + 1}`,
        estimationItemId: l.fabricEstimationItemId || `FE-${Date.now()}-${idx}`,
        orderId: l.allocations[0]?.orderId || "ord-001",
        orderNo: l.jobId,
        styleNo: l.styleNo || "HM-KT-8841",
        poNumber: l.allocations[0]?.poNumber || "PO-HM-99881-A",
        preCostItemId: "PCI-101",
        fabricDescription: l.fabricDescription,
        garmentColor: l.allocations[0]?.colorName || "All Garment Colors",
        fabricColor: l.color || "Solid Reactive",
        diaGsm: l.width || "Width 48 Inch Open, 220 GSM",
        unit: l.unit,
        requiredQty: l.requiredQuantity,
        bookedQty: l.bookingQuantity,
        unitRate: l.rate,
        totalAmount: l.lineTotal,
        preCostRate: l.budgetValue && l.bookingQuantity > 0 ? l.budgetValue / l.bookingQuantity : l.rate,
        preCostAmount: budgetVal,
        initialSavingAmount: initialSaving,
        initialSavingPct: Number(savingPct.toFixed(2)),
        isOverBudget: initialSaving < 0,
        isSavingTargetMissed: savingPct < policy.savingTargetPercentage,
        exceptionReason: overbookingReason || undefined,
      };
    });

    const targetId = editingBookingId || `fb-${Date.now()}`;
    const effectiveStatus = status || "Draft";
    const existingBooking = MMRepository.getFabricBookings().find((b) => b.id === targetId || b.bookingNo === bookNo);

    const bookingPayload: MMFabricBooking = {
      id: targetId,
      bookingNo: bookNo,
      supplierId: supplierId,
      supplierName: supplierName,
      supplierNameSnapshot: supplierName,
      bookingDate: bookingDate,
      bookingDescription: bookingDesc,
      status: effectiveStatus,
      deliveryMode: delMode,
      loadPort: loadPort,
      destination: destination,
      destinationPlace: destination,
      requiredDate: reqDate,
      deliveryDate: deliveryDate,
      etaPort: etaPort,
      factoryDate: factDate,
      bookingType: bookingType,
      bookingUnit: bookingUnit,
      deliveryPlace: delPlace,
      currency: currency,
      conversionRate: convRate,
      paymentMode: payMode,
      paymentTerms: payMode,
      cp: cp,
      note: note,
      notes: note,
      termsAndConditions: termsAndConditions,
      piReference: piReference,
      ourRef: ourRef,
      lines: summaryLines,
      items: itemsCompat,
      totalAmount: calculatedBookingTotal,
      totalBookedQty: calculatedTotalBookedQty,
      totalBookedAmount: calculatedBookingTotal,
      totalPreCostAmount: calculatedTotalBudgetValue,
      totalSavingAmount: totalCostSaving,
      overallSavingPct: Number(savingPercentage.toFixed(2)),
      createdBy: existingBooking?.createdBy || "Rashidul Islam (Head of Merchandising)",
      createdDate: existingBooking?.createdDate || new Date().toISOString().slice(0, 10),
      createdAt: existingBooking?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvalHistory: existingBooking?.approvalHistory,
    };

    MMRepository.saveFabricBooking(bookingPayload);
    setBookings(MMRepository.getFabricBookings());
    setEstimations(MMRepository.getFabricEstimations());

    MMRepository.addAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      entityType: "FabricBooking",
      entityId: bookingPayload.bookingNo,
      action: editingBookingId ? "Update" : "Create",
      userId: "USR-004",
      userName: "Rashidul Islam (Head of Merchandising)",
      comments: `Saved Fabric Booking ${bookingPayload.bookingNo} for supplier ${supplierName}. Items: ${summaryLines.length}, Total: $${calculatedBookingTotal.toFixed(2)} (${currency}). Status: ${bookingPayload.status}`,
    });

    setEditingBookingId(bookingPayload.id);
    setStatus(effectiveStatus);
    toast.success(`Fabric Booking ${bookingPayload.bookingNo} saved successfully in Local Storage!`);
  };

  // --------------------------------------------------------------------------
  // Submit Booking for Approval Workflow (Section 2 of specification)
  // Draft -> Submit -> Pending Approval -> Approved / Rejected / Returned
  // --------------------------------------------------------------------------
  const handleSubmitBooking = () => {
    // 1. Prevent duplicate submit or submitting already approved/pending bookings
    if (status === "Approved") {
      toast.warning(`Fabric Booking ${bookNo} is already Approved and cannot be resubmitted.`);
      return;
    }
    if (status === "Pending") {
      toast.info(`Fabric Booking ${bookNo} has already been submitted and is currently Pending Approval.`);
      return;
    }

    // 2. Validate mandatory fields
    if (!supplierName || !supplierName.trim()) {
      toast.error("Validation Error: Please select a Supplier before submitting.");
      return;
    }

    if (!deliveryDate || !deliveryDate.trim()) {
      setDeliveryDateError("Delivery Date is mandatory.");
      toast.error("Validation Error: Delivery Date is mandatory.");
      return;
    }
    setDeliveryDateError(null);

    if (summaryLines.length === 0) {
      toast.error("Validation Error: At least one fabric item is required in the booking.");
      return;
    }

    for (let i = 0; i < summaryLines.length; i++) {
      const line = summaryLines[i];
      if (line.bookingQuantity <= 0) {
        toast.error(`Item #${i + 1} (${line.fabricDescription}): Please enter a valid booking quantity greater than zero.`);
        return;
      }
      if (line.rate <= 0) {
        toast.error(`Item #${i + 1} (${line.fabricDescription}): Please enter a valid booking rate greater than zero.`);
        return;
      }
    }

    // 3. Prepare items
    const itemsCompat: MMFabricBookingItem[] = summaryLines.map((l, idx) => {
      const budgetVal = l.budgetValue || l.lineTotal;
      const initialSaving = budgetVal - l.lineTotal;
      const savingPct = budgetVal > 0 ? (initialSaving / budgetVal) * 100 : 0;

      return {
        bookingItemId: `FBI-${bookNo.replace(/[^0-9]/g, "").slice(-3) || "001"}-${idx + 1}`,
        estimationItemId: l.fabricEstimationItemId || `FE-${Date.now()}-${idx}`,
        orderId: l.allocations[0]?.orderId || "ord-001",
        orderNo: l.jobId,
        styleNo: l.styleNo || "HM-KT-8841",
        poNumber: l.allocations[0]?.poNumber || "PO-HM-99881-A",
        preCostItemId: "PCI-101",
        fabricDescription: l.fabricDescription,
        garmentColor: l.allocations[0]?.colorName || "All Garment Colors",
        fabricColor: l.color || "Solid Reactive",
        diaGsm: l.width || "Width 48 Inch Open, 220 GSM",
        unit: l.unit,
        requiredQty: l.requiredQuantity,
        bookedQty: l.bookingQuantity,
        unitRate: l.rate,
        totalAmount: l.lineTotal,
        preCostRate: l.budgetValue && l.bookingQuantity > 0 ? l.budgetValue / l.bookingQuantity : l.rate,
        preCostAmount: budgetVal,
        initialSavingAmount: initialSaving,
        initialSavingPct: Number(savingPct.toFixed(2)),
        isOverBudget: initialSaving < 0,
        isSavingTargetMissed: savingPct < policy.savingTargetPercentage,
        exceptionReason: overbookingReason || undefined,
      };
    });

    const targetId = editingBookingId || `fb-${Date.now()}`;
    const submitTime = new Date().toISOString();
    const submittingUser = "Tanvir Ahmed (Merchandiser)";
    const existingBooking = MMRepository.getFabricBookings().find((b) => b.id === targetId || b.bookingNo === bookNo);
    const existingHistory = existingBooking?.approvalHistory || [];

    const bookingPayload: MMFabricBooking = {
      id: targetId,
      bookingNo: bookNo,
      supplierId: supplierId,
      supplierName: supplierName,
      supplierNameSnapshot: supplierName,
      bookingDate: bookingDate,
      bookingDescription: bookingDesc,
      status: "Pending",
      deliveryMode: delMode,
      loadPort: loadPort,
      destination: destination,
      destinationPlace: destination,
      requiredDate: reqDate,
      deliveryDate: deliveryDate,
      etaPort: etaPort,
      factoryDate: factDate,
      bookingType: bookingType,
      bookingUnit: bookingUnit,
      deliveryPlace: delPlace,
      currency: currency,
      conversionRate: convRate,
      paymentMode: payMode,
      paymentTerms: payMode,
      cp: cp,
      note: note,
      notes: note,
      termsAndConditions: termsAndConditions,
      piReference: piReference,
      ourRef: ourRef,
      lines: summaryLines,
      items: itemsCompat,
      totalAmount: calculatedBookingTotal,
      totalBookedQty: calculatedTotalBookedQty,
      totalBookedAmount: calculatedBookingTotal,
      totalPreCostAmount: calculatedTotalBudgetValue,
      totalSavingAmount: totalCostSaving,
      overallSavingPct: Number(savingPercentage.toFixed(2)),
      createdBy: existingBooking?.createdBy || submittingUser,
      createdDate: existingBooking?.createdDate || new Date().toISOString().slice(0, 10),
      submittedBy: submittingUser,
      submittedDate: submitTime,
      createdAt: existingBooking?.createdAt || submitTime,
      updatedAt: submitTime,
      approvalHistory: [
        ...existingHistory,
        {
          id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          bookingId: targetId,
          bookingNo: bookNo,
          action: "Submitted",
          previousStatus: status || "Draft",
          newStatus: "Pending",
          performedBy: submittingUser,
          timestamp: submitTime,
          comment: "Submitted for authorization",
        },
      ],
    };

    MMRepository.saveFabricBooking(bookingPayload);
    setBookings(MMRepository.getFabricBookings());
    setEstimations(MMRepository.getFabricEstimations());
    setEditingBookingId(bookingPayload.id);
    setStatus("Pending");

    MMRepository.addAuditLog({
      id: `aud-${Date.now()}`,
      timestamp: submitTime.replace("T", " ").substring(0, 19),
      entityType: "FabricBooking",
      entityId: bookingPayload.bookingNo,
      action: "Submit",
      userId: "USR-004",
      userName: submittingUser,
      comments: `Submitted Fabric Booking ${bookingPayload.bookingNo} for authorization. Total: $${calculatedBookingTotal.toFixed(2)} (${currency}). Status set to Pending.`,
    });

    toast.success(`Fabric Booking ${bookingPayload.bookingNo} submitted for approval successfully! Now visible in Approval Queue under Pending.`);
  };

  const handleDeleteBooking = (id: string, bNo: string) => {
    if (window.confirm(`Are you sure you want to delete Fabric Booking ${bNo}?`)) {
      MMRepository.deleteFabricBooking(id);
      const updated = MMRepository.getFabricBookings();
      setBookings(updated);
      toast.success(`Fabric Booking ${bNo} deleted.`);
      if (editingBookingId === id) {
        createNewEmptyBooking(updated);
      }
    }
  };

  // Filtered Register Bookings
  const filteredRegisterBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        !registerSearchTerm.trim() ||
        b.bookingNo.toLowerCase().includes(registerSearchTerm.toLowerCase()) ||
        b.supplierName.toLowerCase().includes(registerSearchTerm.toLowerCase()) ||
        (b.ourRef && b.ourRef.toLowerCase().includes(registerSearchTerm.toLowerCase())) ||
        (b.lines && b.lines.some((l) => l.styleNo?.toLowerCase().includes(registerSearchTerm.toLowerCase())));

      const matchStatus = registerStatusFilter === "All" || b.status === registerStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [bookings, registerSearchTerm, registerStatusFilter]);

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-fabric-booking"
      breadcrumbs={[{ label: "Marketing & Merchandising" }, { label: "Fabric Booking Management" }]}
      title="Fabric Booking Management"
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/mm-order-entry"
            search={{ tab: "fabric-estimation" } as any}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
            title="Return to Fabric Estimation preserving form data"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Estimation</span>
          </Link>
          {status === "Approved" ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Approved (Locked)
            </span>
          ) : status === "Pending" ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              Pending Approval (Locked)
            </span>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSaveBooking}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/30 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Booking</span>
              </button>
              <button
                type="button"
                onClick={handleSubmitBooking}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/30 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit for Approval</span>
              </button>
            </>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {status === "Approved" && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="flex-1">
              <span className="font-bold">Booking Officially Approved:</span> Fabric Booking #{bookNo} has been authorized. To maintain compliance and audit integrity, approved booking lines and header details are locked in read-only mode.
            </div>
            {editingBookingId && (
              <Link
                to="/mm-fabric-booking-approval-details"
                search={{ id: editingBookingId }}
                className="px-2.5 py-1 rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
              >
                View Approval
              </Link>
            )}
          </div>
        )}
        {status === "Pending" && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-300 shadow-xs">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 animate-pulse" />
            <div className="flex-1">
              <span className="font-bold">Pending Authorization:</span> Fabric Booking #{bookNo} has been submitted and is currently in the approval review queue. It cannot be edited until reviewed or returned.
            </div>
            <Link
              to="/mm-fabric-booking-approval"
              className="px-2.5 py-1 rounded bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
            >
              Approval Queue
            </Link>
          </div>
        )}
        {status === "Returned" && (
          <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl p-3.5 flex items-center gap-3 text-xs text-purple-800 dark:text-purple-300 shadow-xs">
            <RotateCcw className="w-5 h-5 text-purple-600 shrink-0" />
            <div className="flex-1">
              <span className="font-bold">Booking Returned for Correction:</span> This booking was returned by the authorization authority. Please modify the required fields and click <strong>Submit for Approval</strong> to resubmit.
            </div>
          </div>
        )}
        {/* ============================================================== */}
          {/* SECTION A: FABRIC BOOKING INFORMATION                          */}
          {/* ============================================================== */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Fabric Booking Information
                  </h3>
                </div>
              </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTempTerms(termsAndConditions);
                      setShowTermsModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Terms &amp; Conditions</span>
                  </button>
                </div>
              </div>

              {/* Header Fields in Logical Rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                {/* 1. Job ID */}
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Job ID
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={ourRef}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 font-mono font-bold text-teal-700 dark:text-teal-300 cursor-not-allowed"
                    placeholder="e.g. JOB-2026-0001"
                  />
                </div>

                {/* 2. Book No. * */}
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Book No. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={bookNo}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 font-mono font-bold text-slate-800 dark:text-slate-200 cursor-not-allowed"
                  />
                </div>

                {/* 3. Supplier * */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-600 dark:text-slate-400 text-xs">
                      Supplier <span className="text-rose-500">*</span>
                    </label>
                    {isSupplierLocked ? (
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                        Locked to Estimation
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                        Selectable
                      </span>
                    )}
                  </div>
                  {isSupplierLocked ? (
                    <input
                      type="text"
                      readOnly
                      value={supplierName || "No Supplier Assigned"}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 font-semibold text-slate-700 dark:text-slate-300 cursor-not-allowed truncate"
                      title="Supplier is locked based on the source Fabric Estimation item"
                    />
                  ) : (
                    <select
                      value={supplierId}
                      onChange={(e) => {
                        const sId = e.target.value;
                        setSupplierId(sId);
                        const matched = suppliers.find((s) => s.id === sId);
                        if (matched) {
                          setSupplierName(matched.supplierName);
                          setCp(matched.contactPerson || "Contact Person");
                        } else {
                          setSupplierName("");
                          setCp("");
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-teal-400 dark:border-teal-600 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 text-xs shadow-sm"
                    >
                      <option value="">-- Select Registered Supplier --</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.supplierName} ({s.category || s.supplierCode})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* 4. Booking Date */}
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Booking Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>

                {/* 5. Delivery Date (Mandatory) */}
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Delivery Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => {
                      setDeliveryDate(e.target.value);
                      if (e.target.value) setDeliveryDateError(null);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg border ${
                      deliveryDateError
                        ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    }`}
                  />
                  {deliveryDateError && (
                    <p className="text-[11px] font-semibold text-rose-500 mt-1">{deliveryDateError}</p>
                  )}
                </div>

                {/* 6. Del. Place (Dropdown) */}
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Del. Place</label>
                  <select
                    value={delPlace}
                    onChange={(e) => setDelPlace(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Pakiza Central Fabric Store">Pakiza Central Fabric Store</option>
                    <option value="Pakiza Knit Cutting Floor">Pakiza Knit Cutting Floor</option>
                    <option value="Unit 1 Dyeing Warehouse">Unit 1 Dyeing Warehouse</option>
                    <option value="Unit 2 Garments Cutting Store">Unit 2 Garments Cutting Store</option>
                    <option value="External Warehouse / Off-site Storage">External Warehouse / Off-site Storage</option>
                  </select>
                </div>

                {/* 7. Del. Mode */}
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Del. Mode</label>
                  <select
                    value={delMode}
                    onChange={(e) => setDelMode(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Road">Road (Truck / Lorry)</option>
                    <option value="Sea">Sea (FCL / LCL Container)</option>
                    <option value="Air">Air (Courier / Cargo)</option>
                  </select>
                </div>

                {/* 8. Booking Type */}
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Booking Type</label>
                  <select
                    value={bookingType}
                    onChange={(e) => setBookingType(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Main Fabric Booking">Main Fabric Booking</option>
                    <option value="Sample Fabric Booking">Sample Fabric Booking</option>
                    <option value="Short Fabric Booking">Short Fabric Booking</option>
                    <option value="Additional Fabric Booking">Additional Fabric Booking</option>
                  </select>
                </div>

                {/* 9. Booking Unit */}
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Booking Unit</label>
                  <select
                    value={bookingUnit}
                    onChange={(e) => setBookingUnit(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Pakiza Knit Composite Ltd.">Pakiza Knit Composite Ltd.</option>
                    <option value="Unit 1 (Knitting & Dyeing)">Unit 1 (Knitting &amp; Dyeing)</option>
                    <option value="Unit 2 (Garments & Finishing)">Unit 2 (Garments &amp; Finishing)</option>
                  </select>
                </div>

                {/* 10. Currency */}
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="BDT">BDT (৳)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                {/* 11. Pay. Mode */}
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Pay. Mode</label>
                  <select
                    value={payMode}
                    onChange={(e) => setPayMode(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Internal Transfer / TT 30 Days">Internal Transfer / TT 30 Days</option>
                    <option value="LC at Sight">LC at Sight</option>
                    <option value="Deferred LC 60 Days">Deferred LC 60 Days</option>
                    <option value="Advance Payment">Advance Payment</option>
                  </select>
                </div>

                {/* 12. PI Reference */}
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">PI Reference</label>
                  <div className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-400 truncate">
                    {piReference}
                  </div>
                </div>

                {/* 13. Notes & Remarks */}
                <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Notes &amp; Remarks</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    placeholder="Enter additional booking notes, shrinkage tolerances, color fastness, or packing instructions..."
                  />
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* ============================================================== */}
            {/* SECTION B: STYLE AND PO SUMMARY & PO ALLOCATION               */}
            {/* ============================================================== */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Style and PO Summary
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAddFabricSearch("");
                      setShowAddFabricModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Style</span>
                  </button>
                </div>
              </div>

              {/* 2-Column Split: Left = Style and PO Summary, Right = PO Allocation */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
                {/* Left Side: Style and PO Summary Table (col-span-7) */}
                <div className="xl:col-span-7 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 px-1">
                    <span className="flex items-center gap-1.5">
                      <span>Style and PO Summary Table</span>
                      <span className="text-[10px] font-normal text-slate-400">({summaryLines.length} item(s))</span>
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-2">SL</th>
                          <th className="py-2.5 px-2.5">Style</th>
                          <th className="py-2.5 px-2.5">Fabric Code</th>
                          <th className="py-2.5 px-2 text-center">PO Dt.</th>
                          <th className="py-2.5 px-2 text-right">Book Amount</th>
                          <th className="py-2.5 px-2 text-right">Budget Value</th>
                          <th className="py-2.5 px-2 text-center">Populate</th>
                          <th className="py-2.5 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {summaryLines.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-slate-400">
                              No fabric items added yet. Click <strong className="text-teal-600">+ Add Another Style</strong> or open from Fabric Estimation.
                            </td>
                          </tr>
                        ) : (
                          summaryLines.map((line, idx) => {
                            const isSelected = activeLine?.id === line.id;
                            const allocatedCount = line.allocations?.filter((a) => a.selected !== false).length || 0;

                            return (
                              <tr
                                key={line.id}
                                onClick={() => setSelectedLineId(line.id)}
                                className={`cursor-pointer transition-colors ${
                                  isSelected
                                    ? "bg-teal-50/90 dark:bg-teal-950/60 border-l-4 border-teal-600 font-medium shadow-sm"
                                    : "hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                                }`}
                              >
                                <td className="py-2.5 px-2 font-mono text-slate-400">{idx + 1}</td>
                                <td className="py-2.5 px-2.5 font-semibold text-slate-800 dark:text-slate-200">
                                  {line.styleNo}
                                </td>
                                <td className="py-2.5 px-2.5 font-mono font-bold">{line.fabricCode}</td>
                                {/* PO Dt. column immediately after Fabric Code */}
                                <td className="py-2.5 px-2 text-center">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenPoSelectionModal(line);
                                    }}
                                    className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-1"
                                    title={`Open PO Selection for ${line.fabricCode} (${allocatedCount} POs allocated)`}
                                  >
                                    <span>D.</span>
                                    <span className="text-[10px] bg-amber-700/60 px-1 rounded-full font-mono">
                                      {allocatedCount}
                                    </span>
                                  </button>
                                </td>
                                <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                                  ${line.lineTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-2.5 px-2 text-right font-mono text-slate-500">
                                  ${(line.budgetValue || line.lineTotal).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </td>
                                {/* Populate (P) button column */}
                                <td className="py-2.5 px-2 text-center">
                                  {(() => {
                                    const isPopulated = Boolean(line.bookingDetails && line.bookingDetails.length > 0);
                                    return (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCalculateFabricDetails(line);
                                        }}
                                        className={`px-2 py-0.5 rounded font-black text-[11px] transition-all inline-flex items-center gap-0.5 ${
                                          isPopulated
                                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:scale-105 active:scale-95"
                                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 shadow-none hover:scale-105 active:scale-95"
                                        }`}
                                        title={
                                          isPopulated
                                            ? "Populated: Fabric Booking Details active (Click to recalculate)"
                                            : "Populate / Calculate Fabric Requirements (P)"
                                        }
                                      >
                                        <span>P</span>
                                      </button>
                                    );
                                  })()}
                                </td>
                                <td className="py-2.5 px-2 text-right">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveSummaryLine(line.id);
                                    }}
                                    className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                    title="Remove fabric item from booking"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                      {summaryLines.length > 0 && (
                        <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 border-t border-slate-200 dark:border-slate-800">
                          <tr>
                            <td colSpan={4} className="py-2 px-2.5 text-right uppercase tracking-wider text-[10px] text-slate-500">
                              Summary Totals:
                            </td>
                            <td className="py-2 px-2 text-right font-mono text-teal-700 dark:text-teal-400">
                              ${calculatedBookingTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-2 px-2 text-right font-mono text-slate-500">
                              ${calculatedTotalBudgetValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </td>
                            <td colSpan={2}></td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </div>

                {/* Right Side: PO Allocation Table (col-span-5) */}
                <div className="xl:col-span-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 px-1">
                    <span>PO Allocation Table</span>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto min-h-[140px]">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-2.5">PO No</th>
                          <th className="py-2.5 px-2.5">GMT Color</th>
                          <th className="py-2.5 px-2.5 text-right">GMT Qty</th>
                          <th className="py-2.5 px-2.5">Note</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {!activeLine || !activeLine.allocations || activeLine.allocations.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-slate-400 text-xs px-4">
                              No purchase orders selected for this fabric item.
                              <br />
                              Click <strong className="text-amber-600 font-mono">D.</strong> on the left to open the PO Selection Modal.
                            </td>
                          </tr>
                        ) : (
                          activeLine.allocations.map((alloc) => (
                            <tr key={alloc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                              <td className="py-2 px-2.5 font-mono font-bold text-teal-700 dark:text-teal-400">
                                {alloc.poNumber}
                              </td>
                              <td className="py-2 px-2.5 font-semibold text-slate-800 dark:text-slate-200">
                                {alloc.colorName || "DTM"}
                              </td>
                              <td className="py-2 px-2.5 text-right font-mono font-semibold">
                                {alloc.garmentOrderQuantity.toLocaleString()} pcs
                              </td>
                              <td className="py-2 px-2.5 text-slate-500 text-[11px] truncate max-w-[120px]">
                                {alloc.note || "-"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                      {activeLine && activeLine.allocations && activeLine.allocations.length > 0 && (
                        <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold border-t border-slate-200 dark:border-slate-800">
                          <tr>
                            <td colSpan={2} className="py-2 px-2 text-right uppercase text-[10px] text-slate-500">
                              Total GMT Qty:
                            </td>
                            <td className="py-2 px-2.5 text-right font-mono text-teal-700 dark:text-teal-300">
                              {activeLine.allocations
                                .reduce((acc, a) => acc + (a.garmentOrderQuantity || 0), 0)
                                .toLocaleString()}{" "}
                              pcs
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* SECTION C: FABRIC BOOKING DETAILS GRID (Page 10-13, 16-18)     */}
            {/* ============================================================== */}
            {/* ============================================================== */}
            {/* SECTION C: FABRIC BOOKING DETAILS                             */}
            {/* ============================================================== */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Fabric Booking Details
                    </h3>
                  </div>
                </div>
              </div>

              {/* Detail Table */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Job ID</th>
                      <th className="py-2.5 px-3">Used Place</th>
                      <th className="py-2.5 px-3">Fab Code</th>
                      <th className="py-2.5 px-3 min-w-[200px]">Fabric Description</th>
                      <th className="py-2.5 px-3">Width</th>
                      <th className="py-2.5 px-3">Color</th>
                      <th className="py-2.5 px-3 text-right">Req Qty</th>
                      <th className="py-2.5 px-2.5 text-center">Unit</th>
                      <th className="py-2.5 px-3 text-right min-w-[110px]">
                        Book Qty <span className="text-teal-600 font-bold">*</span>
                      </th>
                      <th className="py-2.5 px-2.5 text-right">Rcvd Qty</th>
                      <th className="py-2.5 px-3 text-right min-w-[100px]">
                        Rate <span className="text-teal-600 font-bold">*</span>
                      </th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {!activeLine || !activeLine.bookingDetails || activeLine.bookingDetails.length === 0 ? (
                      <tr>
                        <td colSpan={12} className="py-8 text-center text-slate-400 text-xs px-4">
                          Fabric Booking Details not generated yet.
                          <br />
                          Select POs using <strong className="text-amber-600 font-mono">D.</strong> on Section B, then click the{" "}
                          <strong className="text-emerald-600 font-mono">P</strong> button under Populate to calculate color-wise requirements.
                        </td>
                      </tr>
                    ) : (
                      activeLine.bookingDetails.map((detail) => (
                        <tr key={detail.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          {/* 1. Job ID */}
                          <td className="py-2 px-3 font-mono font-bold text-teal-700 dark:text-teal-400">
                            {detail.ourRef}
                          </td>

                          {/* 2. Used Place */}
                          <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{detail.usedPlace || "Body"}</td>

                          {/* 3. Fab Code */}
                          <td className="py-2 px-3 font-mono font-bold">{detail.fabricCode}</td>

                          {/* 4. Fabric Description (Read-only from Fabric Master) */}
                          <td className="py-2 px-3 text-slate-800 dark:text-slate-200">
                            <div className="font-medium">{detail.fabricDescription}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              PO: {detail.poNumber} | Country: {detail.countryName}
                            </div>
                          </td>

                          {/* 5. Width */}
                          <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-400">{detail.width || '68/70"'}</td>

                          {/* 6. Color (Mapped Fabric Color) */}
                          <td className="py-2 px-3">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{detail.fabricColor}</span>
                            {detail.garmentColor && detail.garmentColor !== detail.fabricColor && (
                              <span className="text-[10px] text-slate-400 block font-normal">
                                (GMT: {detail.garmentColor})
                              </span>
                            )}
                          </td>

                          {/* 7. Req Qty */}
                          <td className="py-2 px-3 text-right font-mono font-semibold text-slate-500">
                            {detail.requiredQuantity.toLocaleString()}
                          </td>

                          {/* 8. Unit */}
                          <td className="py-2 px-2.5 text-center font-mono font-bold text-slate-600 dark:text-slate-400">
                            {detail.unit}
                          </td>

                          {/* 9. Book Qty (Editable) */}
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              step="any"
                              value={detail.bookingQuantity}
                              onChange={(e) => handleUpdateDetailBookQty(activeLine.id, detail.id, parseFloat(e.target.value))}
                              className="w-24 px-2 py-1 text-right font-mono font-bold rounded-lg border border-teal-300 dark:border-teal-700 bg-teal-50/50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200 focus:ring-1 focus:ring-teal-500"
                            />
                          </td>

                          {/* 10. Rcvd Qty */}
                          <td className="py-2 px-2.5 text-right font-mono text-slate-400">
                            {detail.receivedQuantity || 0}
                          </td>

                          {/* 11. Rate (Editable) */}
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              step="0.01"
                              value={detail.rate}
                              onChange={(e) => handleUpdateDetailRate(activeLine.id, detail.id, parseFloat(e.target.value))}
                              className="w-20 px-2 py-1 text-right font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-teal-500"
                            />
                          </td>

                          {/* 12. Total */}
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                            ${detail.lineTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {activeLine && activeLine.bookingDetails && activeLine.bookingDetails.length > 0 && (
                    <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold border-t border-slate-200 dark:border-slate-800">
                      <tr>
                        <td colSpan={6} className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px] text-slate-500">
                          Active Item Totals ({activeLine.fabricCode}):
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                          {activeLine.bookingDetails.reduce((acc, d) => acc + d.requiredQuantity, 0).toLocaleString()}
                        </td>
                        <td></td>
                        <td className="py-2.5 px-3 text-right font-mono text-teal-700 dark:text-teal-300">
                          {activeLine.bookingDetails.reduce((acc, d) => acc + d.bookingQuantity, 0).toLocaleString()}
                        </td>
                        <td colSpan={2}></td>
                        <td className="py-2.5 px-3 text-right font-mono text-base font-extrabold text-teal-600 dark:text-teal-400">
                          ${activeLine.bookingDetails.reduce((acc, d) => acc + d.lineTotal, 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>

            {/* Bottom Form Actions Bar */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Link
                  to="/mm-order-entry"
                  search={{ tab: "fabric-estimation" } as any}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Fabric Estimation</span>
                </Link>
                <button
                  type="button"
                  onClick={() => createNewEmptyBooking(bookings)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Empty Booking</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAttachmentModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                  title="Document Storage — Fabric Booking Attachments"
                >
                  <Paperclip className="w-3.5 h-3.5 text-teal-600" />
                  <span>Attachment ({bookingAttachments.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const activeBooking = editingBookingId
                      ? bookings.find((b) => b.id === editingBookingId)
                      : bookings.find((b) => b.bookingNo === bookNo) || bookings[0];
                    const targetId = activeBooking?.id || "fb-001";
                    navigate({
                      to: "/mm-proforma-invoice-create",
                      search: { bookingId: targetId } as any,
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Proforma Invoice Create</span>
                </button>
                {status === "Approved" ? (
                  <span className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Approved (Locked)</span>
                  </span>
                ) : status === "Pending" ? (
                  <span className="px-4 py-2 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span>Pending Approval (Locked)</span>
                  </span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleSaveBooking}
                      className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-teal-600/30 transition-all hover:scale-[1.02]"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Fabric Booking</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitBooking}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit for Approval</span>
                    </button>
                  </>
                )}
              </div>
            </div>

        {/* ================================================================== */}
        {/* SUPPLIER LOOKUP MODAL (Section 4.2 / Section 17)                    */}
        {/* ================================================================== */}
        {showSupplierModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Select Supplier (Supplier Master)</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={supplierSearch}
                  onChange={(e) => setSupplierSearch(e.target.value)}
                  placeholder="Search by supplier name, category, or contact person..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b">
                    <tr>
                      <th className="py-2 px-3">Supplier Code</th>
                      <th className="py-2 px-3">Supplier Name</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Contact Person</th>
                      <th className="py-2 px-3 text-right">Select</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {suppliers
                      .filter(
                        (s) =>
                          !supplierSearch.trim() ||
                          s.supplierName.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                          s.supplierCode.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                          (s.contactPerson && s.contactPerson.toLowerCase().includes(supplierSearch.toLowerCase()))
                      )
                      .map((s) => (
                        <tr key={s.id} className="hover:bg-teal-50/40 dark:hover:bg-teal-950/20">
                          <td className="py-2.5 px-3 font-mono font-bold text-teal-600 dark:text-teal-400">{s.supplierCode}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{s.supplierName}</td>
                          <td className="py-2.5 px-3 text-slate-500">{s.category}</td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{s.contactPerson || "—"}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleSelectSupplier(s)}
                              className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                            >
                              Choose
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* ADD FABRIC ITEM MODAL (Multi-Style Sourcing, Section 5 & 10)       */}
        {/* ================================================================== */}
        {showAddFabricModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-teal-600" />
                    <span>Add Fabric Item from Fabric Estimation</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Showing eligible styles and fabric estimation records for supplier{" "}
                    <strong className="text-teal-700 dark:text-teal-300">{supplierName || "None Selected"}</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddFabricModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={addFabricSearch}
                  onChange={(e) => setAddFabricSearch(e.target.value)}
                  placeholder="Search by Job ID, Style, Fabric Code, or Description..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b">
                    <tr>
                      <th className="py-2.5 px-3">Job ID</th>
                      <th className="py-2.5 px-3">Style</th>
                      <th className="py-2.5 px-3">Fabric Code</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3">Supplier</th>
                      <th className="py-2.5 px-3 text-right">Req Qty</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(() => {
                      const filteredList = eligibleEstimationItems.filter((item) => {
                        if (!addFabricSearch.trim()) return true;
                        const term = addFabricSearch.toLowerCase();
                        return (
                          item.jobId.toLowerCase().includes(term) ||
                          item.style.toLowerCase().includes(term) ||
                          item.row.code.toLowerCase().includes(term) ||
                          item.row.fabricDescription.toLowerCase().includes(term) ||
                          (item.row.supplier && item.row.supplier.toLowerCase().includes(term))
                        );
                      });

                      if (filteredList.length === 0) {
                        return (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-500">
                              {supplierName
                                ? `No eligible styles or fabric estimation records found for supplier "${supplierName}".`
                                : "Please select a supplier in the booking header first."}
                            </td>
                          </tr>
                        );
                      }

                      return filteredList.map((item, idx) => (
                        <tr
                          key={`add-item-${idx}`}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                        >
                          <td className="py-2.5 px-3 font-mono font-bold text-teal-700 dark:text-teal-300">{item.jobId}</td>
                          <td className="py-2.5 px-3 font-semibold">{item.style}</td>
                          <td className="py-2.5 px-3 font-mono font-bold">{item.row.code}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-medium text-slate-900 dark:text-white">{item.row.fabricDescription}</div>
                            <div className="text-[10px] text-slate-400">Used: {item.row.usedPlace} | Width: {item.row.width}</div>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                            {item.row.supplier || supplierName}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold">
                            {Number(item.row.requireQty || 0).toLocaleString()} {item.row.unit || "Kg"}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleAddFabricItem(item)}
                              className="px-3 py-1 rounded-lg font-bold text-xs shadow-sm bg-teal-600 hover:bg-teal-700 text-white transition-all"
                            >
                              Add to Booking
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* THE "D" BUTTON — PO ALLOCATION INTERFACE (Section 7, 8, 9)          */}
        {/* ================================================================== */}
        {/* ================================================================== */}
        {/* THE "D" BUTTON — PO SELECTION MODAL (Section 6, 7, 16, 19)          */}
        {/* ================================================================== */}
        {showPoSelectionModal && targetFabricLine && (() => {
          const eligiblePos = getEligiblePosForLine(targetFabricLine);
          const filteredEligible = eligiblePos.filter((p) => {
            if (!poModalSearch.trim()) return true;
            const q = poModalSearch.toLowerCase();
            return (
              p.poNumber.toLowerCase().includes(q) ||
              (p.colorName && p.colorName.toLowerCase().includes(q)) ||
              (p.countryName && p.countryName.toLowerCase().includes(q)) ||
              (p.lotNumber && p.lotNumber.toLowerCase().includes(q))
            );
          });
          const allSelected = filteredEligible.length > 0 && filteredEligible.every((p) => tempSelectedPoIds.includes(p.id));
          const someSelected = filteredEligible.some((p) => tempSelectedPoIds.includes(p.id));
          const totalSelectedOrderQty = filteredEligible
            .filter((p) => tempSelectedPoIds.includes(p.id))
            .reduce((acc, p) => acc + (p.garmentOrderQuantity || 0), 0);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
              <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 my-4">
                {/* 6.2 Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="space-y-0.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
                        D.
                      </span>
                      <span>PO Selection for Fabric Allocation</span>
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancelPoSelection}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    title="Close without saving"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 6.2 Non-Editable Header Information Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Job ID</span>
                    <div className="font-mono font-bold text-teal-700 dark:text-teal-300">
                      {targetFabricLine.ourRef || targetFabricLine.jobId}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Style</span>
                    <div className="font-bold text-slate-800 dark:text-slate-200 truncate" title={targetFabricLine.styleNo}>
                      {targetFabricLine.styleNo}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Fabric Code</span>
                    <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {targetFabricLine.fabricCode}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Fabric Description</span>
                    <div className="font-medium text-slate-700 dark:text-slate-300 truncate" title={targetFabricLine.fabricDescription}>
                      {targetFabricLine.fabricDescription}
                    </div>
                  </div>
                </div>

                {/* Search Bar & Multi-Select Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={poModalSearch}
                      onChange={(e) => setPoModalSearch(e.target.value)}
                      placeholder="Search by PO number or color..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSelectAll(filteredEligible)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      {allSelected ? "Clear All" : "Select All"}
                    </button>
                    <span className="text-xs text-slate-500 font-mono px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      {filteredEligible.filter((p) => tempSelectedPoIds.includes(p.id)).length} of {filteredEligible.length} Selected
                    </span>
                  </div>
                </div>

                {/* 6.2 PO Selection Table */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto max-h-80 shadow-inner">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                      <tr>
                        <th className="py-2.5 px-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            ref={(el) => {
                              if (el) el.indeterminate = someSelected && !allSelected;
                            }}
                            onChange={() => handleToggleSelectAll(filteredEligible)}
                            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                            title="Select / Deselect all"
                          />
                        </th>
                        <th className="py-2.5 px-3">PO No</th>
                        <th className="py-2.5 px-3">Color</th>
                        <th className="py-2.5 px-3 text-right">Order Qty</th>
                        <th className="py-2.5 px-3 text-right">Booked Order Qty</th>
                        <th className="py-2.5 px-3 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredEligible.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            No eligible purchase orders found for this style and order reference.
                          </td>
                        </tr>
                      ) : (
                        filteredEligible.map((p) => {
                          const isChecked = tempSelectedPoIds.includes(p.id);
                          const balanceVal = p.balance ?? (p.garmentOrderQuantity - (p.bookedOrderQuantity || 0));

                          return (
                            <tr
                              key={p.id}
                              onClick={() => handleToggleTempPo(p.id)}
                              className={`cursor-pointer transition-colors ${
                                isChecked
                                  ? "bg-teal-50/70 dark:bg-teal-950/30 hover:bg-teal-100/60 dark:hover:bg-teal-900/40"
                                  : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                              }`}
                            >
                              <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleTempPo(p.id)}
                                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                                />
                              </td>
                              <td className="py-2 px-3 font-mono font-bold text-teal-700 dark:text-teal-400">
                                {p.poNumber}
                              </td>
                              <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">
                                {p.colorName}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900 dark:text-slate-100">
                                {p.garmentOrderQuantity.toLocaleString()} pcs
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-slate-400">
                                {(p.bookedOrderQuantity || 0).toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {balanceVal.toLocaleString()}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold border-t border-slate-200 dark:border-slate-800">
                      <tr>
                        <td colSpan={3} className="py-2 px-3 text-right uppercase text-[11px] text-slate-500">
                          Selected Order Qty Total:
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-extrabold text-teal-700 dark:text-teal-300">
                          {totalSelectedOrderQty.toLocaleString()} pcs
                        </td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* 6.2 Modal Footer with Back & OK Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleCancelPoSelection}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPoSelection}
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/30 flex items-center gap-1.5 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>OK</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ================================================================== */}
        {/* TERMS & CONDITIONS MODAL (Section 4.2 / Section 13)                */}
        {/* ================================================================== */}
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Fabric Booking Terms &amp; Conditions</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <label className="font-semibold text-slate-600 dark:text-slate-400 block">Edit Terms &amp; Conditions</label>
                <textarea
                  rows={8}
                  value={tempTerms}
                  onChange={(e) => setTempTerms(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTermsAndConditions(tempTerms);
                    setShowTermsModal(false);
                    toast.success("Terms & Conditions updated.");
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                >
                  Save Terms
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* PREVIEW / PRINT PROFORMA BOOKING SHEET MODAL (Section 13)           */}
        {/* ================================================================== */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-6">
              {/* Toolbar */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 print:hidden">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Proforma Fabric Booking Sheet Preview</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Document</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable Document Sheet */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-5 text-xs text-slate-800 dark:text-slate-200">
                {/* Company Banner */}
                <div className="text-center space-y-1 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <h1 className="text-lg font-black tracking-wide text-teal-800 dark:text-teal-300">
                    PAKIZA KNIT COMPOSITE LIMITED
                  </h1>
                  <p className="text-[11px] text-slate-500">
                    Head Office: 98 Motijheel C/A, Dhaka-1000 | Factory: Khordo Nowpara, Madhabdi, Narsingdi
                  </p>
                  <div className="inline-block mt-1 px-4 py-1 rounded bg-slate-100 dark:bg-slate-800 font-bold uppercase tracking-widest text-[11px]">
                    Official Fabric Procurement Booking Order
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="space-y-1">
                    <div>
                      <span className="font-bold text-slate-500">Booking No: </span>
                      <strong className="font-mono text-teal-700 dark:text-teal-400">{bookNo}</strong>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500">Our Ref / Job: </span>
                      <strong className="font-mono">{ourRef}</strong>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500">Booking Date: </span>
                      <span>{bookingDate}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500">Delivery Date: </span>
                      <span>{deliveryDate}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500">Delivery Mode: </span>
                      <span>{delMode} ({destination})</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div>
                      <span className="font-bold text-slate-500">Supplier: </span>
                      <strong className="text-slate-900 dark:text-white">{supplierName}</strong>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500">Contact Person: </span>
                      <span>{cp}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500">Payment Terms: </span>
                      <span>{payMode}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500">Currency: </span>
                      <span className="font-mono font-bold">{currency}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500">Status: </span>
                      <strong className="font-mono text-teal-600">{status}</strong>
                    </div>
                  </div>
                </div>

                {/* Fabric Items Table */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 font-bold border-b">
                      <tr>
                        <th className="py-2 px-3">#</th>
                        <th className="py-2 px-3">Style</th>
                        <th className="py-2 px-3">Fabric Code</th>
                        <th className="py-2 px-3">Fabric Description</th>
                        <th className="py-2 px-3">Width</th>
                        <th className="py-2 px-3">Color</th>
                        <th className="py-2 px-3 text-right">Book Qty</th>
                        <th className="py-2 px-3 text-right">Rate</th>
                        <th className="py-2 px-3 text-right">Total ({currency})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {summaryLines.map((l, i) => (
                        <tr key={l.id}>
                          <td className="py-2 px-3 font-mono">{i + 1}</td>
                          <td className="py-2 px-3 font-semibold">{l.styleNo}</td>
                          <td className="py-2 px-3 font-mono font-bold">{l.fabricCode}</td>
                          <td className="py-2 px-3 font-medium">{l.fabricDescription}</td>
                          <td className="py-2 px-3">{l.width}</td>
                          <td className="py-2 px-3">{l.color}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold">
                            {l.bookingQuantity.toLocaleString()} {l.unit}
                          </td>
                          <td className="py-2 px-3 text-right font-mono">${l.rate.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold">
                            ${l.lineTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold border-t">
                      <tr>
                        <td colSpan={6} className="py-2.5 px-3 text-right uppercase">Total Booked Amount:</td>
                        <td className="py-2.5 px-3 text-right font-mono text-teal-700 dark:text-teal-400">
                          {calculatedTotalBookedQty.toLocaleString()} {summaryLines[0]?.unit || "Kg"}
                        </td>
                        <td></td>
                        <td className="py-2.5 px-3 text-right font-mono text-sm font-extrabold text-teal-600 dark:text-teal-400">
                          ${calculatedBookingTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Terms & Conditions */}
                <div className="space-y-1.5 border-t border-slate-200 dark:border-slate-800 pt-3">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-500">Terms &amp; Conditions</h4>
                  <pre className="text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-sans leading-relaxed">
                    {termsAndConditions}
                  </pre>
                </div>

                {/* Signature Block */}
                <div className="grid grid-cols-4 gap-4 pt-12 text-center text-[11px]">
                  <div className="border-t border-slate-300 dark:border-slate-700 pt-1 font-semibold text-slate-600">
                    Prepared By (Merchandiser)
                  </div>
                  <div className="border-t border-slate-300 dark:border-slate-700 pt-1 font-semibold text-slate-600">
                    Checked By (Fabric In-Charge)
                  </div>
                  <div className="border-t border-slate-300 dark:border-slate-700 pt-1 font-semibold text-slate-600">
                    Approved By (Head of Sourcing)
                  </div>
                  <div className="border-t border-slate-300 dark:border-slate-700 pt-1 font-semibold text-slate-600">
                    Supplier Acceptance Signature
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* DOCUMENT STORAGE — FABRIC BOOKING ATTACHMENTS MODAL (PI Parity)    */}
        {/* ================================================================== */}
        {showAttachmentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-teal-600" />
                    <span>Document Storage — Fabric Booking Attachments</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Booking No: <span className="font-mono font-bold text-teal-700 dark:text-teal-400">{bookNo || "Draft Booking"}</span> | Supplier: <span className="font-semibold text-slate-700 dark:text-slate-300">{supplierName || "N/A"}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowAttachmentModal(false);
                    setUploadError(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* Single File Storage Section */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-teal-600/30">
                      <File className="w-4 h-4" />
                      <span>File Storage</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full font-mono">
                        {bookingAttachments.length}
                      </span>
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-teal-600" />
                    <span>Maximum File Size: <strong>3 MB</strong></span>
                  </div>
                </div>

                {/* Upload Error Banner */}
                {uploadError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                    <button type="button" onClick={() => setUploadError(null)} className="p-0.5 text-rose-500">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* File Selection and Upload Form */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    {/* File Selection Control */}
                    <div className="md:col-span-4">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Choose Document or Image <span className="text-rose-500">*</span>
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.txt,image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fb-attachment-file-upload-input"
                      />
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="fb-attachment-file-upload-input"
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5 text-teal-600" />
                          <span>Choose File</span>
                        </label>
                        <span className="text-[11px] text-slate-500 truncate max-w-[160px]" title={selectedUploadFile ? selectedUploadFile.name : "No file chosen"}>
                          {selectedUploadFile ? selectedUploadFile.name : "No file chosen"}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="md:col-span-4">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        placeholder="e.g. Signed Fabric Booking Copy"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                      />
                    </div>

                    {/* Note */}
                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Note
                      </label>
                      <input
                        type="text"
                        value={uploadNote}
                        onChange={(e) => setUploadNote(e.target.value)}
                        placeholder="Optional remarks"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                      />
                    </div>

                    {/* Upload Button */}
                    <div className="md:col-span-1">
                      <button
                        type="button"
                        onClick={handleUploadAttachment}
                        className="w-full px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1 transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Attachment Table (7 columns: Remove, Title, Note, Uploaded By, Upload Time, File Size, Download) */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-2.5 px-3 text-center w-12">Remove</th>
                        <th className="py-2.5 px-3 min-w-[160px]">Title</th>
                        <th className="py-2.5 px-3 min-w-[220px] max-w-sm">Note</th>
                        <th className="py-2.5 px-3 min-w-[130px]">Uploaded By</th>
                        <th className="py-2.5 px-3 min-w-[130px]">Upload Time</th>
                        <th className="py-2.5 px-3 min-w-[90px] text-right">File Size</th>
                        <th className="py-2.5 px-3 min-w-[110px] text-center">Download</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {bookingAttachments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                            No documents stored for this Fabric Booking.
                          </td>
                        </tr>
                      ) : (
                        bookingAttachments.map((att) => (
                          <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            {/* 1. Remove */}
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteAttachment(att.id)}
                                title="Remove attachment"
                                className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>

                            {/* 2. Title */}
                            <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                              {att.title}
                              <span className="block text-[10px] font-mono text-slate-400 font-normal">
                                {att.fileName}
                              </span>
                            </td>

                            {/* 3. Note (Text wrapped onto multiple lines) */}
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 max-w-sm whitespace-normal break-words leading-relaxed">
                              {att.note || "—"}
                            </td>

                            {/* 4. Uploaded By */}
                            <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                              {att.uploadedBy}
                            </td>

                            {/* 5. Upload Time */}
                            <td className="py-2.5 px-3 font-mono text-slate-500">
                              {att.uploadTime}
                            </td>

                            {/* 6. File Size */}
                            <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                              {att.fileSize}
                            </td>

                            {/* 7. Download */}
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleDownloadAttachment(att)}
                                title={`Download ${att.fileName || att.title}`}
                                className="px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 border border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 font-semibold text-[11px] inline-flex items-center gap-1 shadow-sm transition-all"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Total persistent attachments for this Fabric Booking: <strong>{bookingAttachments.length}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowAttachmentModal(false);
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketingMerchandisingLayout>
  );
}
