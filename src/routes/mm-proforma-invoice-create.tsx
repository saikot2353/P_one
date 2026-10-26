import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMProformaInvoice,
  MMPIAllocatedBooking,
  MMPIItem,
  MMPIAdditionalCharge,
  MMFabricBooking,
  MMAccessoriesBooking,
  PIStatus,
  MM_MERCHANTS_MASTER,
} from "../lib/marketing-merchandising-data";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  FileText,
  Plus,
  Trash2,
  Search,
  Eye,
  AlertTriangle,
  X,
  FileCheck,
  Building2,
  Calendar,
  Layers,
  Paperclip,
  Printer,
  ChevronRight,
  RefreshCw,
  Info,
  ShieldAlert,
  Send,
  MessageSquare,
  HelpCircle,
  Clock,
  Upload,
  Download,
  Edit2,
  File,
  Image as ImageIcon,
  Check,
} from "lucide-react";

// Master charge names per Section 6.1 specification
export const ADDITIONAL_CHARGE_OPTIONS = [
  "Bank Charge",
  "Documentation Charge",
  "Inspection Charge",
  "Testing Charge",
  "Commission",
  "Transportation Charge",
  "Handling Charge",
  "Other Commercial Charge",
];

// Document Types per Section 8 specification
export const DEFAULT_DOCUMENT_TYPES = [
  "Proforma Invoice Copy",
  "Fabric Test Report",
  "Lab Dip Approval",
  "Bank Document",
  "Commercial Contract",
  "Technical Spec Sheet",
  "Packaging Spec",
  "Other Document",
];

export interface MMPIAttachmentRecord {
  id: string;
  piId: string;
  fileName: string;
  title: string;
  documentType: string;
  note: string;
  fileSize: string;
  fileSizeBytes: number;
  uploadedBy: string;
  uploadTime: string;
  storageType: "file" | "image";
  dataUrl?: string;
}

export const INITIAL_DUMMY_ATTACHMENTS: MMPIAttachmentRecord[] = [
  {
    id: "att-001",
    piId: "default",
    fileName: "Proforma_Invoice_Pakiza_2026.pdf",
    title: "Supplier Signed Proforma Invoice",
    documentType: "Proforma Invoice Copy",
    note: "Final counter-signed copy with official stamp",
    fileSize: "1.4 MB",
    fileSizeBytes: 1468006,
    uploadedBy: "Tanvir Ahmed (Merchandiser)",
    uploadTime: "2026-10-22 10:15",
    storageType: "file",
  },
  {
    id: "att-002",
    piId: "default",
    fileName: "Single_Jersey_160GSM_Test_Report.pdf",
    title: "ITS Fabric Physical & Chemical Test Report",
    documentType: "Fabric Test Report",
    note: "Meets shrinkage (< 3%) and colorfastness (Grade 4-5)",
    fileSize: "850 KB",
    fileSizeBytes: 870400,
    uploadedBy: "Tanvir Ahmed (Merchandiser)",
    uploadTime: "2026-10-22 10:30",
    storageType: "file",
  },
  {
    id: "att-003",
    piId: "default",
    fileName: "Henley_Fabric_Swatch_Scan.png",
    title: "Approved Royal Blue Dye Swatch Card",
    documentType: "Lab Dip Approval",
    note: "Light source D65 approved by buyer",
    fileSize: "2.1 MB",
    fileSizeBytes: 2202009,
    uploadedBy: "Tanvir Ahmed (Merchandiser)",
    uploadTime: "2026-10-22 10:45",
    storageType: "file",
  },
];

export const ATTACHMENTS_STORAGE_KEY = "cripton_mm_pi_attachments_v1";

interface SearchParams {
  bookingId?: string;
  bookingIds?: string;
  bookingNo?: string;
  bookingNos?: string;
  piId?: string;
  id?: string;
  view?: string;
  mode?: string;
  source?: string;
  item?: string;
}

export const Route = createFileRoute("/mm-proforma-invoice-create")({
  head: () => ({
    meta: [
      { title: "Proforma Invoice Entry Form — Marketing & Merchandising | CriptonHRIS" },
      {
        name: "description",
        content: "Proforma Invoice Entry Form with Fabric and Accessories Booking integration in Marketing & Merchandising.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    bookingId: (search.bookingId as string) || undefined,
    bookingIds: (search.bookingIds as string) || undefined,
    bookingNo: (search.bookingNo as string) || undefined,
    bookingNos: (search.bookingNos as string) || undefined,
    piId: (search.piId as string) || (search.id as string) || undefined,
    id: (search.id as string) || (search.piId as string) || undefined,
    view: (search.view as string) || undefined,
    mode: (search.mode as string) || undefined,
    source: (search.source as string) || undefined,
    item: (search.item as string) || undefined,
  }),
  component: MMProformaInvoiceCreatePage,
});

function MMProformaInvoiceCreatePage() {
  const search = Route.useSearch();
  const { bookingId, bookingIds, piId: rawPiId, id: rawId, view: searchView, mode: searchMode, source: searchSource, item: searchItem } = search;
  const effectivePiId = rawPiId || rawId;
  const isViewMode = searchView === "true" || searchMode === "view";
  const navigate = useNavigate();

  // Local state for all Bookings from localStorage / MMRepository
  const [fabricBookings, setFabricBookings] = useState<MMFabricBooking[]>([]);
  const [accBookings, setAccBookings] = useState<MMAccessoriesBooking[]>([]);
  const [allPis, setAllPis] = useState<MMProformaInvoice[]>([]);
  const [selectedCandidateBookingIds, setSelectedCandidateBookingIds] = useState<string[]>([]);

  // Current PI Draft State
  const [currentId, setCurrentId] = useState<string>("");
  const [entryNo, setEntryNo] = useState<string>("");
  const [entryDate, setEntryDate] = useState<string>("");
  const [source, setSource] = useState<string>("Nominated");
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [itemCategory, setItemCategory] = useState<string>("Fabric");
  const [supplierName, setSupplierName] = useState<string>("");
  const [status, setStatus] = useState<PIStatus>("Draft");
  const [merchant, setMerchant] = useState<string>("Tanvir Ahmed - Key Account Manager");
  const [lcOpenDate, setLcOpenDate] = useState<string>("");
  const [lcType, setLcType] = useState<string>("Sight LC");
  const [impUnit, setImpUnit] = useState<string>("Unit 2 - Garments");
  const [previousPiRef, setPreviousPiRef] = useState<string>("");
  const [previousPiVal, setPreviousPiVal] = useState<number>(0);
  const [amendmentReason, setAmendmentReason] = useState<string>("");
  const [piDate, setPiDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [piNumber, setPiNumber] = useState<string>("");
  const [paymentTerms, setPaymentTerms] = useState<string>("TT 30 Days");
  const [deliveryMode, setDeliveryMode] = useState<"Sea" | "Air" | "Road">("Road");
  const [deliveryPlace, setDeliveryPlace] = useState<string>("FOB Factory Savar");
  const [priorityLevel, setPriorityLevel] = useState<"Normal" | "Urgent" | "High" | "Critical">("Normal");
  const [bdtRate, setBdtRate] = useState<number>(121.5);
  const [usdRate, setUsdRate] = useState<number>(1.0);
  const [bblcNo, setBblcNo] = useState<string>("");
  const [docNo, setDocNo] = useState<string>("");
  const [businessUnit, setBusinessUnit] = useState<string>("Unit 2 - Garments");
  const [deliveryTerms, setDeliveryTerms] = useState<string>("FOB Savar");

  // Section B & C: Attached Bookings & Populated Items State
  const [attachedBookings, setAttachedBookings] = useState<MMPIAllocatedBooking[]>([]);
  const [activeBookingId, setActiveBookingId] = useState<string>("");
  const [populatedBookingIds, setPopulatedBookingIds] = useState<string[]>([]);
  const [piItems, setPiItems] = useState<MMPIItem[]>([]);

  // Section D: Notes and Comments
  const [notes, setNotes] = useState<string>("");
  const [comments, setComments] = useState<Array<{ id: string; user: string; timestamp: string; message: string }>>([]);
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [showCommentsModal, setShowCommentsModal] = useState<boolean>(false);

  // Section E: Additional Charges
  const [additionalChargesList, setAdditionalChargesList] = useState<MMPIAdditionalCharge[]>([]);

  // Attachments (Section 8: Document Storage Reference-Based Design)
  const [showAttachmentModal, setShowAttachmentModal] = useState<boolean>(false);
  const [storageTab, setStorageTab] = useState<"file" | "image">("file");
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState<string>("");
  const [uploadDocType, setUploadDocType] = useState<string>(DEFAULT_DOCUMENT_TYPES[0]);
  const [uploadNote, setUploadNote] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [documentTypes, setDocumentTypes] = useState<string[]>(DEFAULT_DOCUMENT_TYPES);
  const [showAddDocType, setShowAddDocType] = useState<boolean>(false);
  const [customDocTypeInput, setCustomDocTypeInput] = useState<string>("");
  const [piAttachments, setPiAttachments] = useState<MMPIAttachmentRecord[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [editingAttachment, setEditingAttachment] = useState<MMPIAttachmentRecord | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // UI Modals & Views
  const [showAddBookingModal, setShowAddBookingModal] = useState<boolean>(false);
  const [showViewListModal, setShowViewListModal] = useState<boolean>(false);
  const [bookingSearchQuery, setBookingSearchQuery] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showLcBreakupModal, setShowLcBreakupModal] = useState<boolean>(false);
  const [showBbModal, setShowBbModal] = useState<boolean>(false);
  const [bbTargetBooking, setBbTargetBooking] = useState<MMPIAllocatedBooking | null>(null);

  // Register / View List Filters
  const [listSearch, setListSearch] = useState<string>("");
  const [listStatusFilter, setListStatusFilter] = useState<string>("All");
  const [listDateFrom, setListDateFrom] = useState<string>("");
  const [listDateTo, setListDateTo] = useState<string>("");

  // Load Initial Master Data
  useEffect(() => {
    const loadedBookings = MMRepository.getFabricBookings();
    setFabricBookings(loadedBookings);

    const loadedAccBookings = MMRepository.getAccessoriesBookings();
    setAccBookings(loadedAccBookings);

    const loadedPis = MMRepository.getPIs();
    setAllPis(loadedPis);
  }, []);

  // Initialize or Load Existing PI / Source Booking
  useEffect(() => {
    if (fabricBookings.length === 0 && accBookings.length === 0) return;

    // Case 1: Loading an existing PI by piId or id
    if (effectivePiId) {
      const existing = MMRepository.getPIs().find(
        (p) =>
          p.id === effectivePiId ||
          p.piNo === effectivePiId ||
          decodeURIComponent(p.id) === effectivePiId ||
          decodeURIComponent(p.piNo) === effectivePiId
      );
      if (existing) {
        populateFormFromPI(existing);
        return;
      }
    }

    // Case 2: Opening from one or more source Bookings (Accessories or Fabric)
    const effectiveBookingIds = (bookingIds || bookingId || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (effectiveBookingIds.length > 0) {
      const firstId = effectiveBookingIds[0];
      const isAccessories =
        searchSource?.toLowerCase() === "accessories" ||
        searchItem?.toLowerCase() === "accessories" ||
        firstId.startsWith("acc-") ||
        accBookings.some((ab) => effectiveBookingIds.includes(ab.id) || effectiveBookingIds.includes(ab.bookingNo));

      if (isAccessories) {
        const selectedList = accBookings.filter(
          (b) => effectiveBookingIds.includes(b.id) || effectiveBookingIds.includes(b.bookingNo)
        );
        if (selectedList.length === 0) {
          setValidationError(`Source booking(s) "${effectiveBookingIds.join(", ")}" not found in persisted Accessories Bookings.`);
          return;
        }

        if (selectedList.length === 1) {
          initializeNewPiFromAccessoriesBooking(selectedList[0]);
          return;
        }

        initializeNewPiFromMultipleAccessoriesBookings(selectedList);
        return;
      }

      // Case 2.2: Opening from source Fabric Booking(s)
      const selectedList = fabricBookings.filter(
        (b) => effectiveBookingIds.includes(b.id) || effectiveBookingIds.includes(b.bookingNo)
      );
      if (selectedList.length === 0) {
        setValidationError(`Source booking(s) "${effectiveBookingIds.join(", ")}" not found in persisted Fabric Bookings.`);
        return;
      }

      if (selectedList.length === 1) {
        initializeNewPiFromSourceBooking(selectedList[0]);
        return;
      }

      initializeNewPiFromMultipleFabricBookings(selectedList);
      return;
    }

    // Case 3: Brand new blank PI
    if (!currentId) {
      initializeBlankPi(searchItem === "Accessories" ? "Accessories" : "Fabric");
    }
  }, [bookingId, bookingIds, effectivePiId, fabricBookings, accBookings, searchSource, searchItem]);

  // Helper to initialize blank PI
  const initializeBlankPi = (defaultCategory: "Fabric" | "Accessories" = "Fabric") => {
    const nextEntry = MMRepository.generateNextPIEntryNo();
    const nextPiNo = MMRepository.generateNextPINumber();
    const newId = `pi-${Date.now()}`;
    const nowStr = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setCurrentId(newId);
    setEntryNo(nextEntry);
    setEntryDate(nowStr);
    setPiNumber(nextPiNo);
    setSource("Nominated");
    setItemCategory(defaultCategory);
    setSupplierName("");
    setMerchant("Tanvir Ahmed - Key Account Manager");
    setStatus("Draft");
    setBblcNo("");
    setAttachedBookings([]);
    setPiItems([]);
    setActiveBookingId("");
    setAdditionalChargesList([]);
    setNotes("Standard Proforma Invoice terms apply. Payment via confirmed irrevocable documentary LC.");
    setComments([]);
    setAttachments([]);
  };

  // Helper to initialize new PI from a source Fabric Booking
  const initializeNewPiFromSourceBooking = (booking: MMFabricBooking) => {
    const nextEntry = MMRepository.generateNextPIEntryNo();
    const nextPiNo = MMRepository.generateNextPINumber(booking.supplierName);
    const newId = `pi-${Date.now()}`;
    const nowStr = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setCurrentId(newId);
    setEntryNo(nextEntry);
    setEntryDate(nowStr);
    setPiNumber(nextPiNo);
    setSource("Nominated");
    setItemCategory("Fabric");
    setSupplierName(booking.supplierName || "Pakiza Knitting & Dyeing");
    setMerchant("Tanvir Ahmed - Key Account Manager");
    setStatus("Draft");
    setBusinessUnit(booking.bookingUnit || "Unit 2 - Garments");
    setDeliveryTerms(booking.deliveryPlace || "FOB Savar");
    setDeliveryMode(
      booking.deliveryMode === "Sea" || booking.deliveryMode === "Air" || booking.deliveryMode === "Road"
        ? booking.deliveryMode
        : "Road"
    );
    setDeliveryPlace(booking.deliveryPlace || "FOB Factory Savar");
    setPaymentTerms(booking.paymentTerms || "TT 30 Days");
    setBdtRate(booking.conversionRate && booking.conversionRate > 1 ? booking.conversionRate : 121.5);
    setUsdRate(1.0);
    setBblcNo(booking.piReference || "");
    setNotes(`Proforma Invoice created from Fabric Booking ${booking.bookingNo}.`);

    // Attach source booking
    const attached: MMPIAllocatedBooking = {
      bookingId: booking.id,
      bookingNo: booking.bookingNo,
      bookingType: "Fabric",
      orderNo: booking.items?.[0]?.orderNo || booking.lines?.[0]?.ourRef || "ORD-2026-0041",
      styleNo: booking.items?.[0]?.styleNo || booking.lines?.[0]?.styleNo || "HM-KT-8841",
      allocatedAmount: booking.totalAmount || booking.totalBookedAmount || 63635.8,
      bookingDesc: booking.bookingDescription || `Knitted fabric for Order ${booking.items?.[0]?.orderNo || "ORD-001"}`,
      bookingDate: booking.bookingDate || new Date().toISOString().split("T")[0],
      deliveryMode: booking.deliveryMode || "Road",
      deliveryDate: booking.deliveryDate || "",
      affectedGarmentQty: booking.totalBookedQty || 15138,
      buyerName: booking.lines?.[0]?.buyerNameSnapshot || "H&M Europe",
      season: "Spring/Summer 2026",
    };

    setAttachedBookings([attached]);
    setActiveBookingId(booking.id);

    // Populate items from booking
    const items = extractItemsFromBooking(booking, 121.5);
    setPiItems(items);
    setAdditionalChargesList([]);
    setComments([
      {
        id: `cmt-${Date.now()}`,
        user: "System",
        timestamp: nowStr,
        message: `Proforma Invoice draft initiated from Fabric Booking ${booking.bookingNo}.`,
      },
    ]);
  };

  // Helper to initialize new PI from a source Accessories Booking
  const initializeNewPiFromAccessoriesBooking = (booking: MMAccessoriesBooking) => {
    const nextEntry = MMRepository.generateNextPIEntryNo();
    const nextPiNo = MMRepository.generateNextPINumber(booking.supplierName);
    const newId = `pi-${Date.now()}`;
    const nowStr = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setCurrentId(newId);
    setEntryNo(nextEntry);
    setEntryDate(nowStr);
    setPiNumber(nextPiNo);
    setSource("Nominated");
    setItemCategory("Accessories");
    setSupplierName(booking.supplierName || "ABC Accessories Ltd.");
    setMerchant("Tanvir Ahmed - Key Account Manager");
    setStatus("Draft");
    setBusinessUnit(booking.bookingUnit || "Unit 2 - Garments");
    setDeliveryTerms(booking.delPlace || booking.deliveryPlace || "Pakiza Central Accessories Store");
    setDeliveryMode(
      booking.delMode === "Sea" || booking.delMode === "Air" || booking.delMode === "Road"
        ? (booking.delMode as any)
        : booking.deliveryMode === "Sea" || booking.deliveryMode === "Air" || booking.deliveryMode === "Road"
        ? (booking.deliveryMode as any)
        : "Road"
    );
    setDeliveryPlace(booking.delPlace || booking.deliveryPlace || "Pakiza Central Accessories Store");
    setPaymentTerms(booking.payMode || booking.paymentTerms || "TT 30 Days");
    setBdtRate(booking.convRate && booking.convRate > 1 ? booking.convRate : 121.5);
    setUsdRate(1.0);
    setBblcNo(booking.piReference || "");
    setNotes(`Proforma Invoice created from Accessories Booking ${booking.bookingNo}.`);

    const orderNo = booking.ourRef || "ORD-2026-0041";
    const styleNo = booking.lines?.[0]?.style || (booking.items?.[0] as any)?.style || "STYLE-2026";
    const jobId = booking.ourRef || booking.bookingNo.split("/")[0] || "JOB-2026-0001";

    // Attach source booking
    const attached: MMPIAllocatedBooking = {
      bookingId: booking.id,
      bookingNo: booking.bookingNo,
      bookingType: "Accessories",
      orderNo: orderNo,
      styleNo: styleNo,
      allocatedAmount: booking.totalBookedAmount || 0,
      bookingDesc: booking.bookingDesc || booking.lines?.[0]?.description || `Accessories Booking ${booking.bookingNo}`,
      bookingDate: booking.bookingDate || new Date().toISOString().split("T")[0],
      deliveryMode: (booking.delMode || booking.deliveryMode || "Road") as any,
      deliveryDate: booking.deliveryDate || "",
      affectedGarmentQty: booking.totalBookedQty || 10000,
      buyerName: "H&M Europe",
      season: resolveSeasonForJob(jobId, styleNo, orderNo),
    };

    setAttachedBookings([attached]);
    setActiveBookingId(booking.id);

    // Populate items from booking
    const items = extractItemsFromAccessoriesBooking(booking, 121.5);
    setPiItems(items);
    setAdditionalChargesList([]);
    setComments([
      {
        id: `cmt-${Date.now()}`,
        user: "System",
        timestamp: nowStr,
        message: `Proforma Invoice draft initiated from Accessories Booking ${booking.bookingNo}.`,
      },
    ]);
  };

  // Helper to initialize new PI from multiple Fabric Bookings
  const initializeNewPiFromMultipleFabricBookings = (bookingList: MMFabricBooking[]) => {
    if (bookingList.length === 0) return;
    if (bookingList.length === 1) {
      initializeNewPiFromSourceBooking(bookingList[0]);
      return;
    }

    const firstBooking = bookingList[0];
    const nextEntry = MMRepository.generateNextPIEntryNo();
    const nextPiNo = MMRepository.generateNextPINumber(firstBooking.supplierName);
    const newId = `pi-${Date.now()}`;
    const nowStr = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setCurrentId(newId);
    setEntryNo(nextEntry);
    setEntryDate(nowStr);
    setPiNumber(nextPiNo);
    setSource("Nominated");
    setItemCategory("Fabric");
    setSupplierName(firstBooking.supplierName || "Pakiza Knitting & Dyeing");
    setMerchant("Tanvir Ahmed - Key Account Manager");
    setStatus("Draft");
    setBusinessUnit(firstBooking.bookingUnit || "Unit 2 - Garments");
    setDeliveryTerms(firstBooking.deliveryPlace || "FOB Savar");
    setDeliveryMode(
      firstBooking.deliveryMode === "Sea" || firstBooking.deliveryMode === "Air" || firstBooking.deliveryMode === "Road"
        ? firstBooking.deliveryMode
        : "Road"
    );
    setDeliveryPlace(firstBooking.deliveryPlace || "FOB Factory Savar");
    setPaymentTerms(firstBooking.paymentTerms || "TT 30 Days");
    setBdtRate(firstBooking.conversionRate && firstBooking.conversionRate > 1 ? firstBooking.conversionRate : 121.5);
    setUsdRate(1.0);
    setBblcNo(firstBooking.piReference || "");
    setNotes(`Proforma Invoice created from combined Fabric Bookings: ${bookingList.map((b) => b.bookingNo).join(", ")}.`);

    const attached: MMPIAllocatedBooking[] = bookingList.map((b) => ({
      bookingId: b.id,
      bookingNo: b.bookingNo,
      bookingType: "Fabric",
      orderNo: b.items?.[0]?.orderNo || b.lines?.[0]?.jobId || b.ourRef || "ORD-2026-0041",
      styleNo: b.items?.[0]?.styleNo || b.lines?.[0]?.styleNo || "HM-KT-8841",
      allocatedAmount: b.totalAmount || b.totalBookedAmount || 0,
      bookingDesc: b.bookingDescription || `Fabric Booking ${b.bookingNo}`,
      bookingDate: b.bookingDate || new Date().toISOString().split("T")[0],
      deliveryMode: (b.deliveryMode as any) || "Road",
      deliveryDate: b.deliveryDate || "",
      affectedGarmentQty: b.totalBookedQty || 10000,
      buyerName: b.lines?.[0]?.buyerNameSnapshot || "H&M Europe",
      season: "Spring/Summer 2026",
    }));

    setAttachedBookings(attached);
    setActiveBookingId(firstBooking.id);

    // Extract items across all bookings
    const allItems: MMPIItem[] = [];
    bookingList.forEach((b) => {
      const bItems = extractItemsFromBooking(b, 121.5);
      allItems.push(...bItems);
    });

    setPiItems(allItems);
    setAdditionalChargesList([]);
    setComments([
      {
        id: `cmt-${Date.now()}`,
        user: "System",
        timestamp: nowStr,
        message: `Proforma Invoice draft initiated from combined Fabric Bookings: ${bookingList.map((b) => b.bookingNo).join(", ")}.`,
      },
    ]);
  };

  // Helper to initialize new PI from multiple Accessories Bookings
  const initializeNewPiFromMultipleAccessoriesBookings = (bookingList: MMAccessoriesBooking[]) => {
    if (bookingList.length === 0) return;
    if (bookingList.length === 1) {
      initializeNewPiFromAccessoriesBooking(bookingList[0]);
      return;
    }

    const firstBooking = bookingList[0];
    const nextEntry = MMRepository.generateNextPIEntryNo();
    const nextPiNo = MMRepository.generateNextPINumber(firstBooking.supplierName);
    const newId = `pi-${Date.now()}`;
    const nowStr = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setCurrentId(newId);
    setEntryNo(nextEntry);
    setEntryDate(nowStr);
    setPiNumber(nextPiNo);
    setSource("Nominated");
    setItemCategory("Accessories");
    setSupplierName(firstBooking.supplierName || "ABC Accessories Ltd.");
    setMerchant("Tanvir Ahmed - Key Account Manager");
    setStatus("Draft");
    setBusinessUnit(firstBooking.bookingUnit || "Unit 2 - Garments");
    setDeliveryTerms(firstBooking.delPlace || firstBooking.deliveryPlace || "Pakiza Central Accessories Store");
    setDeliveryMode(
      firstBooking.delMode === "Sea" || firstBooking.delMode === "Air" || firstBooking.delMode === "Road"
        ? (firstBooking.delMode as any)
        : (firstBooking.deliveryMode as any) || "Road"
    );
    setDeliveryPlace(firstBooking.delPlace || firstBooking.deliveryPlace || "Pakiza Central Accessories Store");
    setPaymentTerms(firstBooking.payMode || firstBooking.paymentTerms || "TT 30 Days");
    setBdtRate(firstBooking.convRate && firstBooking.convRate > 1 ? firstBooking.convRate : 121.5);
    setUsdRate(1.0);
    setBblcNo(firstBooking.piReference || "");
    setNotes(`Proforma Invoice created from combined Accessories Bookings: ${bookingList.map((b) => b.bookingNo).join(", ")}.`);

    const attached: MMPIAllocatedBooking[] = bookingList.map((b) => {
      const orderNo = b.ourRef || "ORD-2026-0041";
      const styleNo = b.lines?.[0]?.style || (b.items?.[0] as any)?.style || "STYLE-2026";
      const jobId = b.ourRef || b.bookingNo.split("/")[0] || "JOB-2026-0001";
      return {
        bookingId: b.id,
        bookingNo: b.bookingNo,
        bookingType: "Accessories",
        orderNo: orderNo,
        styleNo: styleNo,
        allocatedAmount: b.totalBookedAmount || 0,
        bookingDesc: b.bookingDesc || b.lines?.[0]?.description || `Accessories Booking ${b.bookingNo}`,
        bookingDate: b.bookingDate || new Date().toISOString().split("T")[0],
        deliveryMode: (b.delMode || b.deliveryMode || "Road") as any,
        deliveryDate: b.deliveryDate || "",
        affectedGarmentQty: b.totalBookedQty || 10000,
        buyerName: "H&M Europe",
        season: resolveSeasonForJob(jobId, styleNo, orderNo),
      };
    });

    setAttachedBookings(attached);
    setActiveBookingId(firstBooking.id);

    // Extract items across all bookings
    const allItems: MMPIItem[] = [];
    bookingList.forEach((b) => {
      const bItems = extractItemsFromAccessoriesBooking(b, 121.5);
      allItems.push(...bItems);
    });

    setPiItems(allItems);
    setAdditionalChargesList([]);
    setComments([
      {
        id: `cmt-${Date.now()}`,
        user: "System",
        timestamp: nowStr,
        message: `Proforma Invoice draft initiated from combined Accessories Bookings: ${bookingList.map((b) => b.bookingNo).join(", ")}.`,
      },
    ]);
  };

  // Helper to extract PI Items from an Accessories Booking preserving real data relationships
  const extractItemsFromAccessoriesBooking = (
    booking: MMAccessoriesBooking,
    rateBdt: number = 121.5
  ): MMPIItem[] => {
    const result: MMPIItem[] = [];

    if (booking.items && booking.items.length > 0) {
      booking.items.forEach((item, idx) => {
        const itemAny = item as any;
        const jobId =
          itemAny.jobId || item.orderNo || booking.ourRef || booking.bookingNo.split("/")[0] || "JOB-2026-0001";
        const styleNo = item.styleNo || itemAny.style || booking.lines?.[0]?.style || "STYLE-2026";
        const buyer = (booking.lines?.[0] as any)?.buyerNameSnapshot || "H&M Europe";
        const season = resolveSeasonForJob(jobId, styleNo);
        const qty = item.bookedQty || itemAny.bookQty || 0;
        const rate = item.bookedRate || itemAny.rate || 0;
        const amountUsd = item.totalAmount || itemAny.total || Number((qty * rate).toFixed(2));
        const gmtQty = itemAny.gmtQty || booking.totalBookedQty || 10000;
        const qtyDz = Number((gmtQty / 12).toFixed(2));

        result.push({
          piItemId: `PII-${booking.id}-${item.bookingItemId || itemAny.id || idx + 1}`,
          bookingId: booking.id,
          bookingItemId: item.bookingItemId || itemAny.id || `ABI-${idx + 1}`,
          sourceBookingNo: booking.bookingNo,
          buyerName: buyer,
          season: season,
          jobId: jobId,
          styleNo: styleNo,
          fabricCode: "",
          affectedGmtQty: gmtQty,
          qtyDz: qtyDz,
          itemCategory: "Accessories",
          itemDescription: item.itemDescription || itemAny.accessoryName || "Accessories Item",
          specification: item.specification || `${item.color || ""} ${item.sizeOrDimension || itemAny.size || ""}`.trim(),
          color: item.color || "",
          dzConsump: Number((qty / (qtyDz || 1)).toFixed(2)),
          unit: item.unit || "Pcs",
          quantity: qty,
          unitPrice: rate,
          totalAmount: amountUsd,
          amountBdt: Number((amountUsd * rateBdt).toFixed(2)),
        });
      });
      return result;
    }

    if (booking.lines && booking.lines.length > 0) {
      booking.lines.forEach((line, lIdx) => {
        const jobId =
          line.ourRef || booking.ourRef || booking.bookingNo.split("/")[0] || "JOB-2026-0001";
        const styleNo = line.style || "STYLE-2026";
        const season = resolveSeasonForJob(jobId, styleNo);
        const buyer = "H&M Europe";

        if (line.sizeWiseDetails && line.sizeWiseDetails.length > 0) {
          line.sizeWiseDetails.forEach((det, dIdx) => {
            const qty = det.bookQty || 0;
            const rate = det.rate || 0;
            const amountUsd = det.total || Number((qty * rate).toFixed(2));
            const gmtQty = det.gmtQty || 10000;
            const qtyDz = Number((gmtQty / 12).toFixed(2));

            result.push({
              piItemId: `PII-${booking.id}-${det.id || `${lIdx}-${dIdx}`}`,
              bookingId: booking.id,
              bookingItemId: det.id || `ABD-${lIdx + 1}-${dIdx + 1}`,
              sourceBookingNo: booking.bookingNo,
              buyerName: buyer,
              season: season,
              jobId: jobId,
              styleNo: styleNo,
              fabricCode: "",
              affectedGmtQty: gmtQty,
              qtyDz: qtyDz,
              itemCategory: "Accessories",
              itemDescription: det.itemName
                ? `${det.itemName} - ${det.description || ""}`.trim()
                : line.accessoryItem || "Accessories Item",
              specification: `${det.color || ""} ${det.size || ""}`.trim(),
              color: det.color || "",
              dzConsump: Number((qty / (qtyDz || 1)).toFixed(2)),
              unit: det.unit || "Pcs",
              quantity: qty,
              unitPrice: rate,
              totalAmount: amountUsd,
              amountBdt: Number((amountUsd * rateBdt).toFixed(2)),
            });
          });
        } else {
          const qty = line.bookAmt || 0;
          result.push({
            piItemId: `PII-${booking.id}-${line.id || lIdx + 1}`,
            bookingId: booking.id,
            bookingItemId: line.id || `LINE-${lIdx + 1}`,
            sourceBookingNo: booking.bookingNo,
            buyerName: buyer,
            season: season,
            jobId: jobId,
            styleNo: styleNo,
            fabricCode: "",
            affectedGmtQty: 10000,
            qtyDz: Number((10000 / 12).toFixed(2)),
            itemCategory: "Accessories",
            itemDescription: line.accessoryItem || line.description || "Accessories Item",
            specification: line.description || "",
            color: "",
            dzConsump: 1,
            unit: "Lot",
            quantity: 1,
            unitPrice: qty,
            totalAmount: qty,
            amountBdt: Number((qty * rateBdt).toFixed(2)),
          });
        }
      });
      return result;
    }

    return [];
  };

  // Retrieve Season from related Order Entry or authoritative source record
  const resolveSeasonForJob = (jobId: string, styleNo: string, orderNo?: string): string => {
    try {
      const allOrders = MMRepository.getOrders();
      const matched = allOrders.find(
        (o) =>
          (orderNo && o.orderNo === orderNo) ||
          (jobId && (o.jobNo === jobId || o.ourRef === jobId || o.id === jobId)) ||
          (styleNo && o.styleNo === styleNo)
      );
      if (matched?.season) return matched.season;
    } catch {
      // Fallback
    }

    if (jobId.includes("0002") || styleNo.includes("1001")) return "Summer 2026";
    if (jobId.includes("0003") || styleNo.includes("2001")) return "Autumn 2026";
    if (jobId.includes("0004") || styleNo.includes("3001")) return "Winter 2026";
    if (jobId.includes("0001") || styleNo.includes("8841")) return "Autumn / Winter 2026";
    return "Spring/Summer 2026";
  };

  // Helper to extract PI Items from a Fabric Booking preserving real data relationships
  const extractItemsFromBooking = (booking: MMFabricBooking, rateBdt: number = 121.5): MMPIItem[] => {
    if (booking.items && booking.items.length > 0) {
      return booking.items.map((item, idx) => {
        const lineMatch = booking.lines?.find(
          (l) => l.styleNo === item.styleNo || l.fabricDescription === item.fabricDescription
        );
        const buyer = lineMatch?.buyerNameSnapshot || booking.lines?.[0]?.buyerNameSnapshot || "H&M Europe";
        const jobId = lineMatch?.jobId || lineMatch?.ourRef || booking.ourRef || booking.bookingNo.split("/")[0] || "JOB-2026-0001";
        const styleNo = item.styleNo || lineMatch?.styleNo || "HM-KT-8841";
        const season = resolveSeasonForJob(jobId, styleNo, item.orderNo);
        const gmtQty = lineMatch?.allocations?.reduce((s, a) => s + (a.garmentOrderQuantity || 0), 0) || (booking.totalBookedQty || 15138);
        const qtyDz = Number((gmtQty / 12).toFixed(2));
        const dzConsump = Number(((item.bookedQty || 0) / (qtyDz || 1)).toFixed(2));
        const qty = item.bookedQty || 0;
        const rate = item.unitRate || 0;
        const amountUsd = item.totalAmount || Number((qty * rate).toFixed(2));
        const amountTk = Number((amountUsd * rateBdt).toFixed(2));

        return {
          piItemId: `PII-${booking.id}-${item.bookingItemId || idx + 1}`,
          bookingId: booking.id,
          bookingItemId: item.bookingItemId || `FBI-${idx + 1}`,
          sourceBookingNo: booking.bookingNo,
          buyerName: buyer,
          season: season,
          jobId: jobId,
          styleNo: styleNo,
          fabricCode: lineMatch?.fabricCode || "",
          affectedGmtQty: gmtQty,
          qtyDz: qtyDz,
          itemCategory: "Fabric",
          itemDescription: item.fabricDescription || "100% Cotton Fabric",
          specification: `${item.diaGsm || ""} ${item.garmentColor || ""}`.trim(),
          color: item.garmentColor || item.fabricColor || "",
          dzConsump: dzConsump,
          unit: item.unit || "Kg",
          quantity: qty,
          unitPrice: rate,
          totalAmount: amountUsd,
          amountBdt: amountTk,
        };
      });
    }

    if (booking.lines && booking.lines.length > 0) {
      const result: MMPIItem[] = [];
      booking.lines.forEach((line, lineIdx) => {
        const buyer = line.buyerNameSnapshot || "H&M Europe";
        const jobId = line.jobId || line.ourRef || booking.ourRef || booking.bookingNo.split("/")[0] || "JOB-2026-0001";
        const season = resolveSeasonForJob(jobId, line.styleNo || "");
        const gmtQty = line.allocations?.reduce((s, a) => s + (a.garmentOrderQuantity || 0), 0) || (booking.totalBookedQty || 10000);
        const qtyDz = Number((gmtQty / 12).toFixed(2));

        if (line.bookingDetails && line.bookingDetails.length > 0) {
          line.bookingDetails.forEach((detail, dIdx) => {
            const qty = detail.bookingQuantity || 0;
            const rate = detail.rate || line.rate || 0;
            const amountUsd = detail.lineTotal || Number((qty * rate).toFixed(2));
            const dzConsump = Number((qty / (qtyDz || 1)).toFixed(2));

            result.push({
              piItemId: `PII-${booking.id}-${detail.id || `${lineIdx}-${dIdx}`}`,
              bookingId: booking.id,
              bookingItemId: detail.id || `FBD-${lineIdx + 1}-${dIdx + 1}`,
              sourceBookingNo: booking.bookingNo,
              buyerName: buyer,
              season: season,
              jobId: jobId,
              styleNo: line.styleNo || "HM-KT-8841",
              fabricCode: detail.fabricCode || line.fabricCode || "",
              affectedGmtQty: gmtQty,
              qtyDz: qtyDz,
              itemCategory: "Fabric",
              itemDescription: detail.fabricDescription || line.fabricDescription || "100% Cotton Knitted Fabric",
              specification: `${detail.width || line.width || ""} ${detail.garmentColor || ""}`.trim(),
              color: detail.garmentColor || detail.fabricColor || line.color || "",
              dzConsump: dzConsump,
              unit: detail.unit || line.unit || "Kg",
              quantity: qty,
              unitPrice: rate,
              totalAmount: amountUsd,
              amountBdt: Number((amountUsd * rateBdt).toFixed(2)),
            });
          });
        } else {
          const qty = line.bookingQuantity || 0;
          const rate = line.rate || 0;
          const amountUsd = line.lineTotal || Number((qty * rate).toFixed(2));
          const dzConsump = Number((qty / (qtyDz || 1)).toFixed(2));

          result.push({
            piItemId: `PII-${booking.id}-${line.id || lineIdx + 1}`,
            bookingId: booking.id,
            bookingItemId: line.id || `LINE-${lineIdx + 1}`,
            sourceBookingNo: booking.bookingNo,
            buyerName: buyer,
            season: season,
            jobId: jobId,
            styleNo: line.styleNo || "HM-KT-8841",
            fabricCode: line.fabricCode || "",
            affectedGmtQty: gmtQty,
            qtyDz: qtyDz,
            itemCategory: "Fabric",
            itemDescription: line.fabricDescription || "100% Cotton Knitted Fabric",
            specification: `${line.width || ""} ${line.color || ""}`.trim(),
            color: line.color || "",
            dzConsump: dzConsump,
            unit: line.unit || "Kg",
            quantity: qty,
            unitPrice: rate,
            totalAmount: amountUsd,
            amountBdt: Number((amountUsd * rateBdt).toFixed(2)),
          });
        }
      });
      return result;
    }

    return [];
  };

  // Helper to load an existing PI into form state
  const populateFormFromPI = (pi: MMProformaInvoice) => {
    setCurrentId(pi.id);
    setEntryNo(pi.entryNo || "ENT-PI-001");
    setEntryDate(pi.entryDate || pi.createdDate || "");
    setSource(pi.source || "Fabric Booking");
    setIsWaiting(pi.isWaiting || false);
    setItemCategory(pi.itemCategory || "Fabric");
    setSupplierName(pi.supplierName || "");
    setStatus(pi.status || "Draft");
    setMerchant(pi.merchant || "Tanvir Ahmed - Senior Merchandiser");
    setLcOpenDate(pi.lcOpenDate || "");
    setLcType(pi.lcType || "Sight LC");
    setImpUnit(pi.impUnit || pi.businessUnit || "Unit 2 - Garments");
    setPreviousPiRef(pi.previousPiRef || "");
    setPreviousPiVal(pi.previousPiVal || 0);
    setAmendmentReason(pi.amendmentReason || "");
    setPiDate(pi.piDate || new Date().toISOString().split("T")[0]);
    setPiNumber(pi.piNo || "");
    setPaymentTerms(pi.paymentTerms || "TT 30 Days");
    setDeliveryMode(pi.deliveryMode || "Road");
    setDeliveryPlace(pi.deliveryPlace || pi.deliveryTerms || "FOB Savar");
    setPriorityLevel(pi.priorityLevel || "Normal");
    setBdtRate(pi.bdtRate || pi.conversionRate || 121.5);
    setUsdRate(pi.usdRate || 1.0);
    setBblcNo(pi.bblcReferenceNo || "");
    setDocNo(pi.docNo || "");
    setBusinessUnit(pi.businessUnit || "Unit 2 - Garments");
    setDeliveryTerms(pi.deliveryTerms || "FOB Savar");
    setAttachedBookings(pi.allocatedBookings || []);
    setActiveBookingId(pi.activeBookingId || pi.allocatedBookings[0]?.bookingId || "");
    setPiItems(pi.items || []);
    setAdditionalChargesList(pi.charges || []);
    setNotes(pi.notes || "");
    setComments(pi.comments || []);
    setAttachments(pi.attachments || []);
  };

  // --------------------------------------------------------------------------
  // Dynamic Calculations (Section 11)
  // PI Total = Sum of ALL attached bookings' items amounts + Sum of Additional Charges
  // Separate USD and BDT totals.
  // --------------------------------------------------------------------------
  const calculatedTotals = useMemo(() => {
    // 1. Items totals across ALL attached bookings in the PI
    let itemsTotalUsd = 0;
    let itemsTotalBdt = 0;

    for (const item of piItems) {
      itemsTotalUsd += item.totalAmount || 0;
      itemsTotalBdt += item.amountBdt || (item.totalAmount || 0) * bdtRate;
    }

    // 2. Additional Charges totals
    let chargesTotalUsd = 0;
    let chargesTotalBdt = 0;

    for (const chg of additionalChargesList) {
      chargesTotalUsd += chg.amountUsd || 0;
      chargesTotalBdt += chg.amountBdt || (chg.amountUsd || 0) * bdtRate;
    }

    const grandTotalUsd = itemsTotalUsd + chargesTotalUsd;
    const grandTotalBdt = itemsTotalBdt + chargesTotalBdt;

    return {
      itemsTotalUsd: Number(itemsTotalUsd.toFixed(2)),
      itemsTotalBdt: Number(itemsTotalBdt.toFixed(2)),
      chargesTotalUsd: Number(chargesTotalUsd.toFixed(2)),
      chargesTotalBdt: Number(chargesTotalBdt.toFixed(2)),
      grandTotalUsd: Number(grandTotalUsd.toFixed(2)),
      grandTotalBdt: Number(grandTotalBdt.toFixed(2)),
    };
  }, [piItems, additionalChargesList, bdtRate]);

  // Active booking object
  const activeBooking = useMemo(() => {
    return attachedBookings.find((b) => b.bookingId === activeBookingId);
  }, [attachedBookings, activeBookingId]);

  // Ref. Details items filtered for the ACTIVE booking only (Page 7-8)
  const activeBookingItems = useMemo(() => {
    if (!activeBookingId) return [];
    return piItems.filter(
      (item) => item.bookingId === activeBookingId || (activeBooking && item.sourceBookingNo === activeBooking.bookingNo)
    );
  }, [piItems, activeBookingId, activeBooking]);

  // Section 2.2 & 2.3: Aggregate booking items across colors
  const consolidatedBookingItems = useMemo(() => {
    const map = new Map<
      string,
      {
        key: string;
        sourceBookingNo: string;
        bookingId: string;
        buyerName: string;
        jobId: string;
        season: string;
        styleNo: string;
        fabricCode: string;
        itemDescription: string;
        quantity: number;
        unit: string;
        unitPrice: number;
        totalAmount: number;
        amountBdt: number;
        colors: string[];
      }
    >();

    for (const item of piItems) {
      // Grouping key ensuring:
      // 1. Same booking, job, season, style, fabric item, unit, and unit rate are merged across colors
      // 2. Different fabric items, jobs, units, or rates are kept distinct
      const groupKey = [
        item.sourceBookingNo || item.bookingId,
        item.buyerName || "",
        item.jobId || "",
        item.season || "",
        item.styleNo || "",
        item.fabricCode || "",
        item.itemDescription || "",
        item.unit || "Kg",
        Number(item.unitPrice || 0).toFixed(4),
      ].join("___");

      const existing = map.get(groupKey);
      if (!existing) {
        map.set(groupKey, {
          key: groupKey,
          sourceBookingNo: item.sourceBookingNo || "",
          bookingId: item.bookingId || "",
          buyerName: item.buyerName || "H&M Europe",
          jobId: item.jobId || "JOB-2026-0001",
          season: item.season || "Spring/Summer 2026",
          styleNo: item.styleNo || "HM-KT-8841",
          fabricCode: item.fabricCode || "",
          itemDescription: item.itemDescription || "100% Cotton Knitted Fabric",
          quantity: item.quantity || 0,
          unit: item.unit || "Kg",
          unitPrice: item.unitPrice || 0,
          totalAmount: item.totalAmount || 0,
          amountBdt: item.amountBdt || 0,
          colors: item.color ? [item.color] : [],
        });
      } else {
        existing.quantity += item.quantity || 0;
        existing.totalAmount = Number((existing.quantity * existing.unitPrice).toFixed(2));
        existing.amountBdt = Number((existing.totalAmount * bdtRate).toFixed(2));
        if (item.color && !existing.colors.includes(item.color)) {
          existing.colors.push(item.color);
        }
      }
    }

    return Array.from(map.values());
  }, [piItems, bdtRate]);

  // --------------------------------------------------------------------------
  // Section 1.3: PI Preview Report Filtering & Calculations
  // Retrieve Booking No records linked to that specific PI, and display ONLY
  // the booking details associated with those linked Booking No records.
  // --------------------------------------------------------------------------
  const previewBookingItems = useMemo(() => {
    if (attachedBookings.length === 0) return [];
    const validBookingIds = new Set(attachedBookings.map((b) => b.bookingId));
    const validBookingNos = new Set(
      attachedBookings.map((b) => b.bookingNo.trim().toLowerCase())
    );

    return piItems.filter((item) => {
      const matchId = Boolean(item.bookingId && validBookingIds.has(item.bookingId));
      const matchNo = Boolean(
        item.sourceBookingNo &&
          validBookingNos.has(item.sourceBookingNo.trim().toLowerCase())
      );
      return matchId || matchNo;
    });
  }, [piItems, attachedBookings]);

  const previewReportTotals = useMemo(() => {
    let itemsTotalUsd = 0;
    for (const item of previewBookingItems) {
      itemsTotalUsd += item.totalAmount || 0;
    }
    let chargesTotalUsd = 0;
    for (const chg of additionalChargesList) {
      chargesTotalUsd += chg.amountUsd || 0;
    }
    const grandTotalUsd = itemsTotalUsd + chargesTotalUsd;
    return {
      itemsTotalUsd: Number(itemsTotalUsd.toFixed(2)),
      chargesTotalUsd: Number(chargesTotalUsd.toFixed(2)),
      grandTotalUsd: Number(grandTotalUsd.toFixed(2)),
    };
  }, [previewBookingItems, additionalChargesList]);

  // --------------------------------------------------------------------------
  // Action Handlers
  // --------------------------------------------------------------------------

  // Switch Active Detail View & Retrieve exact booking items (Internal Helper)
  const handlePopulateBookingItems = (bookingIdToPopulate: string) => {
    setActiveBookingId(bookingIdToPopulate);
    setValidationError(null);

    if (itemCategory === "Accessories") {
      const booking = accBookings.find(
        (b) => b.id === bookingIdToPopulate || b.bookingNo === bookingIdToPopulate
      );
      if (!booking) return;

      const extracted = extractItemsFromAccessoriesBooking(booking, bdtRate);
      if (extracted.length === 0) {
        setValidationError(`No accessory items found in Accessories Booking "${booking.bookingNo}".`);
        return;
      }

      setPiItems((prev) => {
        const alreadyHas = prev.some(
          (it) => it.bookingId === booking.id || it.sourceBookingNo === booking.bookingNo
        );
        if (alreadyHas) return prev;
        return [...prev, ...extracted];
      });

      setPopulatedBookingIds((prev) => (prev.includes(booking.id) ? prev : [...prev, booking.id]));
      return;
    }

    const booking = fabricBookings.find(
      (b) => b.id === bookingIdToPopulate || b.bookingNo === bookingIdToPopulate
    );
    if (!booking) return;

    const extracted = extractItemsFromBooking(booking, bdtRate);
    if (extracted.length === 0) {
      setValidationError(`No fabric items found in Fabric Booking "${booking.bookingNo}".`);
      return;
    }

    setPiItems((prev) => {
      const alreadyHas = prev.some(
        (it) => it.bookingId === booking.id || it.sourceBookingNo === booking.bookingNo
      );
      if (alreadyHas) return prev;
      return [...prev, ...extracted];
    });

    setPopulatedBookingIds((prev) => (prev.includes(booking.id) ? prev : [...prev, booking.id]));
  };

  // Remove Booking from current PI draft
  const handleRemoveBooking = (bookingIdToRemove: string) => {
    if (status === "Passed") {
      setValidationError("Cannot modify bookings of a Passed Proforma Invoice.");
      return;
    }

    const removedBooking = attachedBookings.find((b) => b.bookingId === bookingIdToRemove);
    const removedBookingNo = removedBooking?.bookingNo?.trim().toLowerCase();

    const updatedBookings = attachedBookings.filter((b) => b.bookingId !== bookingIdToRemove);
    const updatedItems = piItems.filter((item) => {
      if (item.bookingId === bookingIdToRemove) return false;
      if (removedBookingNo && item.sourceBookingNo && item.sourceBookingNo.trim().toLowerCase() === removedBookingNo) return false;
      return true;
    });

    setAttachedBookings(updatedBookings);
    setPiItems(updatedItems);
    setPopulatedBookingIds((prev) => prev.filter((id) => id !== bookingIdToRemove));

    // If active booking was removed, switch active to the first remaining or empty
    if (activeBookingId === bookingIdToRemove) {
      setActiveBookingId(updatedBookings[0]?.bookingId || "");
    }

    // If all bookings removed, clear supplier lock
    if (updatedBookings.length === 0) {
      setSupplierName("");
    }

    setSuccessMessage(`Booking removed from draft PI. The underlying ${itemCategory} Booking record is intact.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Add Additional Fabric Booking with Strict Same-Supplier Validation (Section 1.3 & 1.4)
  const handleAddBookingToPi = (candidate: MMFabricBooking) => {
    setValidationError(null);

    // Check 1: Already attached?
    const alreadyAttached = attachedBookings.some(
      (b) => b.bookingId === candidate.id || b.bookingNo === candidate.bookingNo
    );
    if (alreadyAttached) {
      setValidationError("This booking has already been added to the current Proforma Invoice.");
      return;
    }

    // Check 2: Same-Supplier Validation (Strict Requirement)
    if (supplierName && supplierName.trim().toLowerCase() !== candidate.supplierName.trim().toLowerCase()) {
      setValidationError("All bookings added to a single Proforma Invoice must belong to the same supplier.");
      return;
    }

    // If PI doesn't have a supplier yet, lock to this supplier
    if (!supplierName) {
      setSupplierName(candidate.supplierName);
    }

    const orderNo = candidate.items?.[0]?.orderNo || candidate.lines?.[0]?.ourRef || "ORD-001";
    const styleNo = candidate.items?.[0]?.styleNo || candidate.lines?.[0]?.styleNo || "STY-001";
    const jobId = candidate.ourRef || candidate.lines?.[0]?.jobId || candidate.bookingNo.split("/")[0] || "JOB-2026-0001";

    // Create attached booking record
    const newAttachedBooking: MMPIAllocatedBooking = {
      bookingId: candidate.id,
      bookingNo: candidate.bookingNo,
      bookingType: "Fabric",
      orderNo: orderNo,
      styleNo: styleNo,
      allocatedAmount: candidate.totalAmount || candidate.totalBookedAmount || 10000,
      bookingDesc: candidate.bookingDescription || `Fabric Booking ${candidate.bookingNo}`,
      bookingDate: candidate.bookingDate || new Date().toISOString().split("T")[0],
      deliveryMode: candidate.deliveryMode || "Road",
      deliveryDate: candidate.deliveryDate || "",
      affectedGarmentQty: candidate.totalBookedQty || 10000,
      buyerName: candidate.lines?.[0]?.buyerNameSnapshot || "H&M Europe",
      season: resolveSeasonForJob(jobId, styleNo, orderNo),
    };

    // 1. Add selected booking to Booking Information section
    setAttachedBookings((prev) => [...prev, newAttachedBooking]);
    setActiveBookingId(candidate.id);

    // 2. Automatically retrieve and populate its associated items in Booking Details section
    const newItems = extractItemsFromBooking(candidate, bdtRate);
    setPiItems((prev) => {
      const existingFromThisBooking = prev.some(
        (it) => it.bookingId === candidate.id || it.sourceBookingNo === candidate.bookingNo
      );
      if (existingFromThisBooking) return prev;
      return [...prev, ...newItems];
    });

    setPopulatedBookingIds((prev) => (prev.includes(candidate.id) ? prev : [...prev, candidate.id]));
    setShowAddBookingModal(false);
    setSuccessMessage(`Successfully attached booking ${candidate.bookingNo} and automatically populated its booking details.`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // Add Additional Accessories Booking with Strict Same-Supplier Validation
  const handleAddAccessoriesBookingToPi = (candidate: MMAccessoriesBooking) => {
    setValidationError(null);

    // Check 1: Already attached?
    const alreadyAttached = attachedBookings.some(
      (b) => b.bookingId === candidate.id || b.bookingNo === candidate.bookingNo
    );
    if (alreadyAttached) {
      setValidationError("This booking has already been added to the current Proforma Invoice.");
      return;
    }

    // Check 2: Same-Supplier Validation
    if (supplierName && supplierName.trim().toLowerCase() !== candidate.supplierName.trim().toLowerCase()) {
      setValidationError("All bookings added to a single Proforma Invoice must belong to the same supplier.");
      return;
    }

    // If PI doesn't have a supplier yet, lock to this supplier
    if (!supplierName) {
      setSupplierName(candidate.supplierName);
    }

    const orderNo = candidate.ourRef || "ORD-001";
    const styleNo = candidate.lines?.[0]?.style || (candidate.items?.[0] as any)?.style || "STY-001";
    const jobId = candidate.ourRef || candidate.bookingNo.split("/")[0] || "JOB-2026-0001";

    const newAttachedBooking: MMPIAllocatedBooking = {
      bookingId: candidate.id,
      bookingNo: candidate.bookingNo,
      bookingType: "Accessories",
      orderNo: orderNo,
      styleNo: styleNo,
      allocatedAmount: candidate.totalBookedAmount || 0,
      bookingDesc: candidate.bookingDesc || candidate.lines?.[0]?.description || `Accessories Booking ${candidate.bookingNo}`,
      bookingDate: candidate.bookingDate || new Date().toISOString().split("T")[0],
      deliveryMode: (candidate.delMode || candidate.deliveryMode || "Road") as any,
      deliveryDate: candidate.deliveryDate || "",
      affectedGarmentQty: candidate.totalBookedQty || 10000,
      buyerName: "H&M Europe",
      season: resolveSeasonForJob(jobId, styleNo, orderNo),
    };

    setAttachedBookings((prev) => [...prev, newAttachedBooking]);
    setActiveBookingId(candidate.id);

    const newItems = extractItemsFromAccessoriesBooking(candidate, bdtRate);
    setPiItems((prev) => {
      const existingFromThisBooking = prev.some(
        (it) => it.bookingId === candidate.id || it.sourceBookingNo === candidate.bookingNo
      );
      if (existingFromThisBooking) return prev;
      return [...prev, ...newItems];
    });

    setPopulatedBookingIds((prev) => (prev.includes(candidate.id) ? prev : [...prev, candidate.id]));
    setShowAddBookingModal(false);
    setSuccessMessage(`Successfully attached Accessories Booking ${candidate.bookingNo} and automatically populated its booking details.`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // Batch Attach Multiple Bookings
  const handleBatchAttachBookings = (candidateIds: string[]) => {
    if (candidateIds.length === 0) return;
    setValidationError(null);

    if (itemCategory === "Accessories") {
      const candidates = accBookings.filter((b) => candidateIds.includes(b.id));
      if (candidates.length === 0) return;

      const firstSupplier = supplierName || candidates[0].supplierName;
      for (const c of candidates) {
        if (firstSupplier && c.supplierName && c.supplierName.trim().toLowerCase() !== firstSupplier.trim().toLowerCase()) {
          setValidationError("All selected bookings must belong to the same supplier.");
          return;
        }
      }

      if (!supplierName && firstSupplier) {
        setSupplierName(firstSupplier);
      }

      const newAttached: MMPIAllocatedBooking[] = [];
      const newItemsToAdd: MMPIItem[] = [];
      const newPopulatedIds: string[] = [];

      for (const candidate of candidates) {
        if (attachedBookings.some((ab) => ab.bookingId === candidate.id || ab.bookingNo === candidate.bookingNo)) {
          continue;
        }
        const orderNo = candidate.ourRef || "ORD-001";
        const styleNo = candidate.lines?.[0]?.style || (candidate.items?.[0] as any)?.style || "STY-001";
        const jobId = candidate.ourRef || candidate.bookingNo.split("/")[0] || "JOB-2026-0001";

        newAttached.push({
          bookingId: candidate.id,
          bookingNo: candidate.bookingNo,
          bookingType: "Accessories",
          orderNo: orderNo,
          styleNo: styleNo,
          allocatedAmount: candidate.totalBookedAmount || 0,
          bookingDesc: candidate.bookingDesc || candidate.lines?.[0]?.description || `Accessories Booking ${candidate.bookingNo}`,
          bookingDate: candidate.bookingDate || new Date().toISOString().split("T")[0],
          deliveryMode: (candidate.delMode || candidate.deliveryMode || "Road") as any,
          deliveryDate: candidate.deliveryDate || "",
          affectedGarmentQty: candidate.totalBookedQty || 10000,
          buyerName: "H&M Europe",
          season: resolveSeasonForJob(jobId, styleNo, orderNo),
        });

        const extracted = extractItemsFromAccessoriesBooking(candidate, bdtRate);
        newItemsToAdd.push(...extracted);
        newPopulatedIds.push(candidate.id);
      }

      if (newAttached.length === 0) {
        setValidationError("All selected bookings are already attached to this Proforma Invoice.");
        return;
      }

      setAttachedBookings((prev) => [...prev, ...newAttached]);
      setPiItems((prev) => {
        const existingKeys = new Set(prev.map((it) => `${it.bookingId}_${it.piItemId}`));
        const filteredNew = newItemsToAdd.filter((it) => !existingKeys.has(`${it.bookingId}_${it.piItemId}`));
        return [...prev, ...filteredNew];
      });
      setPopulatedBookingIds((prev) => [...new Set([...prev, ...newPopulatedIds])]);
      setSelectedCandidateBookingIds([]);
      setShowAddBookingModal(false);
      toast.success(`Successfully attached ${newAttached.length} Accessories Booking(s).`);
    } else {
      const candidates = fabricBookings.filter((b) => candidateIds.includes(b.id));
      if (candidates.length === 0) return;

      const firstSupplier = supplierName || candidates[0].supplierName;
      for (const c of candidates) {
        if (firstSupplier && c.supplierName && c.supplierName.trim().toLowerCase() !== firstSupplier.trim().toLowerCase()) {
          setValidationError("All selected bookings must belong to the same supplier.");
          return;
        }
      }

      if (!supplierName && firstSupplier) {
        setSupplierName(firstSupplier);
      }

      const newAttached: MMPIAllocatedBooking[] = [];
      const newItemsToAdd: MMPIItem[] = [];
      const newPopulatedIds: string[] = [];

      for (const candidate of candidates) {
        if (attachedBookings.some((ab) => ab.bookingId === candidate.id || ab.bookingNo === candidate.bookingNo)) {
          continue;
        }
        const orderNo = candidate.items?.[0]?.orderNo || candidate.lines?.[0]?.ourRef || "ORD-001";
        const styleNo = candidate.items?.[0]?.styleNo || candidate.lines?.[0]?.styleNo || "STY-001";
        const jobId = candidate.ourRef || candidate.lines?.[0]?.jobId || candidate.bookingNo.split("/")[0] || "JOB-2026-0001";

        newAttached.push({
          bookingId: candidate.id,
          bookingNo: candidate.bookingNo,
          bookingType: "Fabric",
          orderNo: orderNo,
          styleNo: styleNo,
          allocatedAmount: candidate.totalAmount || candidate.totalBookedAmount || 10000,
          bookingDesc: candidate.bookingDescription || `Fabric Booking ${candidate.bookingNo}`,
          bookingDate: candidate.bookingDate || new Date().toISOString().split("T")[0],
          deliveryMode: candidate.deliveryMode || "Road",
          deliveryDate: candidate.deliveryDate || "",
          affectedGarmentQty: candidate.totalBookedQty || 10000,
          buyerName: candidate.lines?.[0]?.buyerNameSnapshot || "H&M Europe",
          season: resolveSeasonForJob(jobId, styleNo, orderNo),
        });

        const extracted = extractItemsFromBooking(candidate, bdtRate);
        newItemsToAdd.push(...extracted);
        newPopulatedIds.push(candidate.id);
      }

      if (newAttached.length === 0) {
        setValidationError("All selected bookings are already attached to this Proforma Invoice.");
        return;
      }

      setAttachedBookings((prev) => [...prev, ...newAttached]);
      setPiItems((prev) => {
        const existingKeys = new Set(prev.map((it) => `${it.bookingId}_${it.piItemId}`));
        const filteredNew = newItemsToAdd.filter((it) => !existingKeys.has(`${it.bookingId}_${it.piItemId}`));
        return [...prev, ...filteredNew];
      });
      setPopulatedBookingIds((prev) => [...new Set([...prev, ...newPopulatedIds])]);
      setSelectedCandidateBookingIds([]);
      setShowAddBookingModal(false);
      toast.success(`Successfully attached ${newAttached.length} Fabric Booking(s).`);
    }
  };

  // Additional Charges Handlers (Section E)
  const handleAddChargeRow = () => {
    if (status === "Passed") {
      setValidationError("Cannot modify charges of a Passed Proforma Invoice.");
      return;
    }

    const available = ADDITIONAL_CHARGE_OPTIONS.find(
      (opt) => !additionalChargesList.some((c) => c.particulars === opt)
    );
    if (!available) {
      setValidationError("All standard additional charge types have already been added.");
      return;
    }

    const newCharge: MMPIAdditionalCharge = {
      id: `chg-${Date.now()}`,
      particulars: available,
      note: "Standard logistics surcharge",
      amountUsd: 150,
      amountBdt: Number((150 * bdtRate).toFixed(2)),
    };
    setAdditionalChargesList((prev) => [...prev, newCharge]);
  };

  const handleUpdateCharge = (id: string, field: keyof MMPIAdditionalCharge, value: string | number) => {
    if (status === "Passed") return;

    setAdditionalChargesList((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        if (field === "particulars") {
          return {
            ...c,
            particulars: String(value),
          };
        }

        if (field === "amountUsd") {
          // Negative decimal support: accept valid negative/positive numbers
          const valStr = String(value);
          const num = parseFloat(valStr);
          const finalVal = isNaN(num) ? 0 : num;
          return {
            ...c,
            amountUsd: finalVal,
            amountBdt: Number((finalVal * bdtRate).toFixed(2)),
          };
        }
        if (field === "amountBdt") {
          const num = parseFloat(String(value)) || 0;
          return {
            ...c,
            amountBdt: num,
          };
        }
        return {
          ...c,
          [field]: value,
        };
      })
    );
  };

  const handleDeleteChargeRow = (id: string) => {
    if (status === "Passed") {
      setValidationError("Cannot modify charges of a Passed Proforma Invoice.");
      return;
    }
    setAdditionalChargesList((prev) => prev.filter((c) => c.id !== id));
  };

  // Add Comment (Section D)
  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const newEntry = {
      id: `cmt-${Date.now()}`,
      user: merchant || "Tanvir Ahmed - Key Account Manager",
      timestamp: new Date().toLocaleString(),
      message: newCommentText.trim(),
    };
    setComments((prev) => [...prev, newEntry]);
    setNewCommentText("");
  };

  // Section 8: Document Storage Attachment Handlers
  const loadPiAttachments = (targetPiId: string): MMPIAttachmentRecord[] => {
    try {
      const raw = localStorage.getItem(ATTACHMENTS_STORAGE_KEY);
      if (!raw) {
        const seeded = INITIAL_DUMMY_ATTACHMENTS.map((a) => ({ ...a, piId: targetPiId || "pi-default" }));
        localStorage.setItem(ATTACHMENTS_STORAGE_KEY, JSON.stringify(seeded));
        return seeded;
      }
      const list: MMPIAttachmentRecord[] = JSON.parse(raw);
      const matches = list.filter((a) => a.piId === targetPiId || (!a.piId && !targetPiId) || a.piId === "pi-default");
      if (matches.length === 0) {
        const seeded = INITIAL_DUMMY_ATTACHMENTS.map((a) => ({ ...a, piId: targetPiId || "pi-default" }));
        localStorage.setItem(ATTACHMENTS_STORAGE_KEY, JSON.stringify([...list, ...seeded]));
        return seeded;
      }
      return matches;
    } catch {
      return INITIAL_DUMMY_ATTACHMENTS;
    }
  };

  const savePiAttachmentsToStorage = (updatedList: MMPIAttachmentRecord[]) => {
    try {
      const raw = localStorage.getItem(ATTACHMENTS_STORAGE_KEY);
      const list: MMPIAttachmentRecord[] = raw ? JSON.parse(raw) : [];
      const currentPiKey = currentId || "pi-default";
      const otherRecords = list.filter((a) => a.piId !== currentPiKey && a.piId !== "pi-default");
      const combined = [...otherRecords, ...updatedList];
      localStorage.setItem(ATTACHMENTS_STORAGE_KEY, JSON.stringify(combined));
    } catch (e) {
      console.error("Failed to persist attachments to LocalStorage:", e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate maximum file size: 3 MB (3 * 1024 * 1024 bytes)
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

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newRecord: MMPIAttachmentRecord = {
        id: `att-${Date.now()}`,
        piId: currentId || "pi-default",
        fileName: selectedUploadFile.name,
        title: uploadTitle.trim(),
        documentType: uploadDocType,
        note: uploadNote.trim(),
        fileSize:
          selectedUploadFile.size < 1024 * 1024
            ? `${(selectedUploadFile.size / 1024).toFixed(1)} KB`
            : `${(selectedUploadFile.size / (1024 * 1024)).toFixed(2)} MB`,
        fileSizeBytes: selectedUploadFile.size,
        uploadedBy: merchant || "Tanvir Ahmed (Merchandiser)",
        uploadTime: new Date().toISOString().replace("T", " ").substring(0, 16),
        storageType: storageTab,
        dataUrl: dataUrl,
      };

      setPiAttachments((prev) => {
        const next = [newRecord, ...prev];
        savePiAttachmentsToStorage(next);
        return next;
      });

      setSelectedUploadFile(null);
      setUploadTitle("");
      setUploadNote("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSuccessMessage(`Document "${newRecord.title}" uploaded successfully.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    };

    reader.onerror = () => {
      setUploadError("Failed to read file for upload.");
    };

    reader.readAsDataURL(selectedUploadFile);
  };

  const handleDeleteAttachment = (id: string) => {
    setPiAttachments((prev) => {
      const next = prev.filter((a) => a.id !== id);
      savePiAttachmentsToStorage(next);
      return next;
    });
  };

  const handleDownloadAttachment = (att: MMPIAttachmentRecord) => {
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
        const textContent = `Proforma Invoice Attached Document\nFilename: ${att.fileName}\nTitle: ${att.title}\nUploaded By: ${att.uploadedBy}\nUpload Time: ${att.uploadTime}\nFile Size: ${att.fileSize}\nNote: ${att.note || "N/A"}`;
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

  const handleSaveEditedAttachment = () => {
    if (!editingAttachment) return;
    setPiAttachments((prev) => {
      const next = prev.map((a) => (a.id === editingAttachment.id ? editingAttachment : a));
      savePiAttachmentsToStorage(next);
      return next;
    });
    setEditingAttachment(null);
    setSuccessMessage("Attachment metadata updated successfully.");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAddCustomDocType = () => {
    const trimmed = customDocTypeInput.trim();
    if (!trimmed) return;
    if (!documentTypes.includes(trimmed)) {
      setDocumentTypes((prev) => [...prev, trimmed]);
    }
    setUploadDocType(trimmed);
    setCustomDocTypeInput("");
    setShowAddDocType(false);
  };

  // Synchronize attachments when currentId changes
  useEffect(() => {
    if (currentId) {
      const loaded = loadPiAttachments(currentId);
      setPiAttachments(loaded);
    }
  }, [currentId]);

  // Save PI Draft to Local Storage
  const handleSaveDraft = (overrideStatus?: PIStatus): boolean => {
    setValidationError(null);

    // Validation
    if (!piNumber.trim()) {
      setValidationError("Validation Error: Proforma Invoice number (PI Number) is required.");
      return false;
    }
    if (attachedBookings.length === 0) {
      setValidationError(`Validation Error: At least one ${itemCategory} Booking must be attached to the Proforma Invoice.`);
      return false;
    }
    if (!supplierName.trim()) {
      setValidationError("Validation Error: Supplier name is required.");
      return false;
    }

    // Section 3.3: Supplier Consistency Validation
    const mismatch = attachedBookings.some((b) => {
      const original =
        itemCategory === "Accessories"
          ? accBookings.find((ab) => ab.id === b.bookingId || ab.bookingNo === b.bookingNo)
          : fabricBookings.find((fb) => fb.id === b.bookingId || fb.bookingNo === b.bookingNo);
      return original && original.supplierName.trim().toLowerCase() !== supplierName.trim().toLowerCase();
    });
    if (mismatch) {
      setValidationError("All bookings added to a single Proforma Invoice must belong to the same supplier.");
      return false;
    }

    // Validate uniqueness of bookings (Section 1.4)
    const bookingNos = attachedBookings.map((b) => b.bookingNo);
    if (new Set(bookingNos).size !== bookingNos.length) {
      setValidationError("This booking has already been added to the current Proforma Invoice.");
      return false;
    }

    const piRecordToSave: MMProformaInvoice = {
      id: currentId || `pi-${Date.now()}`,
      piNo: piNumber.trim(),
      entryNo: entryNo || "ENT-PI-001",
      piDate: piDate,
      entryDate: entryDate || new Date().toLocaleString(),
      source: source,
      isWaiting: isWaiting,
      itemCategory: itemCategory,
      supplierName: supplierName.trim(),
      businessUnit: businessUnit,
      currency: "USD",
      conversionRate: bdtRate,
      bdtRate: bdtRate,
      usdRate: usdRate,
      paymentTerms: paymentTerms,
      deliveryTerms: deliveryTerms,
      deliveryMode: deliveryMode,
      deliveryPlace: deliveryPlace,
      priorityLevel: priorityLevel,
      merchant: merchant,
      lcOpenDate: lcOpenDate,
      lcType: lcType,
      impUnit: impUnit,
      previousPiRef: previousPiRef,
      previousPiVal: previousPiVal,
      amendmentReason: amendmentReason,
      bblcReferenceNo: bblcNo,
      docNo: docNo,
      status: overrideStatus || status,
      allocatedBookings: attachedBookings,
      items: previewBookingItems.length > 0 ? previewBookingItems : piItems,
      charges: additionalChargesList,
      additionalCharges: calculatedTotals.chargesTotalUsd,
      totalPiValue: calculatedTotals.grandTotalUsd,
      totalPiValueBdt: calculatedTotals.grandTotalBdt,
      activeBookingId: activeBookingId,
      notes: notes,
      comments: comments,
      attachments: attachments,
      createdBy: merchant || "Tanvir Ahmed - Key Account Manager",
      createdDate: entryDate || new Date().toISOString().split("T")[0],
      version: 1,
    };

    if (overrideStatus === "Passed") {
      piRecordToSave.approvedBy = "Executive Merchandising Manager";
      piRecordToSave.approvalDate = new Date().toISOString().split("T")[0];
    }

    MMRepository.savePI(piRecordToSave);
    setAllPis(MMRepository.getPIs());

    setSuccessMessage(`Proforma Invoice draft (${piNumber}) successfully saved to Local Storage.`);
    setTimeout(() => setSuccessMessage(null), 4000);
    return true;
  };

  // Submit Action (Section 9 — Submit Button)
  const handleSubmitPI = () => {
    setValidationError(null);

    // 1. Validate all mandatory fields
    if (!piNumber.trim()) {
      setValidationError("Validation Error: Proforma Invoice number (PI Number) is required.");
      return;
    }
    if (!supplierName.trim()) {
      setValidationError("Validation Error: Supplier name is required.");
      return;
    }
    if (!piDate) {
      setValidationError("Validation Error: PI Date is required.");
      return;
    }

    // 2. Confirm that at least one eligible booking is associated with the PI
    if (attachedBookings.length === 0) {
      setValidationError(`Validation Error: At least one eligible ${itemCategory} Booking must be associated with the Proforma Invoice.`);
      return;
    }

    // 3. Confirm that all selected bookings belong to the same supplier
    const mismatch = attachedBookings.some((b) => {
      const original =
        itemCategory === "Accessories"
          ? accBookings.find((ab) => ab.id === b.bookingId || ab.bookingNo === b.bookingNo)
          : fabricBookings.find((fb) => fb.id === b.bookingId || fb.bookingNo === b.bookingNo);
      return original && original.supplierName.trim().toLowerCase() !== supplierName.trim().toLowerCase();
    });
    if (mismatch) {
      setValidationError("All bookings added to a single Proforma Invoice must belong to the same supplier.");
      return;
    }

    // Validate uniqueness of bookings (Section 1.4)
    const bookingNos = attachedBookings.map((b) => b.bookingNo);
    if (new Set(bookingNos).size !== bookingNos.length) {
      setValidationError("This booking has already been added to the current Proforma Invoice.");
      return;
    }

    // 4. Confirm that the Booking Details table contains the correct associated items
    if (piItems.length === 0) {
      setValidationError(`Validation Error: Booking Details table must contain associated ${itemCategory.toLowerCase()} booking items.`);
      return;
    }

    // 5. Recalculate applicable totals
    const finalTotal = calculatedTotals.grandTotalUsd;
    if (finalTotal <= 0) {
      setValidationError("Validation Error: Proforma Invoice total value must be greater than 0.00 USD.");
      return;
    }

    // 6. Save the PI and its booking/item relationships to Local Storage
    // 7. Update status to "Pending Approval" upon submission and record audit log
    const recordId = currentId || `pi-${Date.now()}`;
    const submissionTimestamp = new Date().toISOString().split("T")[0];
    const submitter = merchant || "Tanvir Ahmed - Key Account Manager";

    const updatedApprovalHistory = [
      {
        id: `ah-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        bookingId: recordId,
        bookingNo: piNumber.trim(),
        action: "Submitted" as const,
        previousStatus: status,
        newStatus: "Pending Approval" as const,
        performedBy: submitter,
        timestamp: new Date().toLocaleString(),
        comment: "Proforma Invoice submitted for verification and approval.",
      },
    ];

    const piRecordToSave: MMProformaInvoice = {
      id: recordId,
      piNo: piNumber.trim(),
      entryNo: entryNo || "ENT-PI-001",
      piDate: piDate,
      entryDate: entryDate || new Date().toLocaleString(),
      source: source,
      isWaiting: isWaiting,
      itemCategory: itemCategory,
      supplierName: supplierName.trim(),
      businessUnit: businessUnit,
      currency: "USD",
      conversionRate: bdtRate,
      bdtRate: bdtRate,
      usdRate: usdRate,
      paymentTerms: paymentTerms,
      deliveryTerms: deliveryTerms,
      deliveryMode: deliveryMode,
      deliveryPlace: deliveryPlace,
      priorityLevel: priorityLevel,
      merchant: merchant,
      lcOpenDate: lcOpenDate,
      lcType: lcType,
      impUnit: impUnit,
      previousPiRef: previousPiRef,
      previousPiVal: previousPiVal,
      amendmentReason: amendmentReason,
      bblcReferenceNo: bblcNo,
      docNo: docNo,
      status: "Pending Approval",
      submittedBy: submitter,
      submittedDate: submissionTimestamp,
      approvalHistory: updatedApprovalHistory,
      allocatedBookings: attachedBookings,
      items: piItems,
      charges: additionalChargesList,
      additionalCharges: calculatedTotals.chargesTotalUsd,
      totalPiValue: finalTotal,
      totalPiValueBdt: calculatedTotals.grandTotalBdt,
      activeBookingId: activeBookingId,
      notes: notes,
      comments: comments,
      attachments: attachments,
      createdBy: merchant || "Tanvir Ahmed - Key Account Manager",
      createdDate: entryDate || submissionTimestamp,
      version: 1,
    };

    MMRepository.savePI(piRecordToSave);
    setStatus("Pending Approval");
    setAllPis(MMRepository.getPIs());
    setCurrentId(recordId);

    // 8. Display success message
    setSuccessMessage(`Proforma Invoice ${piNumber} has been successfully submitted for approval.`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // Enable Edit (Section 12 - Edit)
  const handleEnableEdit = () => {
    if (status === "Passed") {
      if (
        window.confirm("This Proforma Invoice is in 'Passed' status. Do you wish to re-open it into 'Draft' mode?")
      ) {
        setStatus("Draft");
        handleSaveDraft("Draft");
      }
    } else {
      setSuccessMessage("Form is in editable state.");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Filtered PI Register List for View List Modal
  const filteredPiList = useMemo(() => {
    return allPis.filter((p) => {
      if (listStatusFilter !== "All" && p.status !== listStatusFilter) {
        return false;
      }
      if (listSearch) {
        const q = listSearch.toLowerCase();
        const matchNo = p.piNo?.toLowerCase().includes(q);
        const matchSupplier = p.supplierName?.toLowerCase().includes(q);
        const matchEntry = p.entryNo?.toLowerCase().includes(q);
        if (!matchNo && !matchSupplier && !matchEntry) return false;
      }
      if (listDateFrom && p.piDate < listDateFrom) return false;
      if (listDateTo && p.piDate > listDateTo) return false;
      return true;
    });
  }, [allPis, listSearch, listStatusFilter, listDateFrom, listDateTo]);

  return (
    <MarketingMerchandisingLayout
      activePath={itemCategory === "Accessories" ? "/mm-accessories-booking" : "/mm-fabric-booking"}
      breadcrumbs={[
        { label: "Marketing & Merchandising" },
        {
          label: itemCategory === "Accessories" ? "Accessories Booking" : "Fabric Booking",
          to: itemCategory === "Accessories" ? "/mm-accessories-booking" : "/mm-fabric-booking",
        },
        { label: "Proforma Invoice Entry Form" },
      ]}
      title="Proforma Invoice Entry Form"
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/mm-pi"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>PI Register</span>
          </Link>
          <Link
            to="/mm-pi-verification-approval"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-all shadow-sm"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Verification Approval</span>
          </Link>
          {!isViewMode && (
            <button
              onClick={() => handleSaveDraft()}
              disabled={status === "Passed" || status === "Approved"}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white shadow-sm shadow-teal-600/30 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-6 pb-20">
        {/* Banner Alert for Validation or Success */}
        {validationError && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-200 shadow-sm animate-in fade-in">
            <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs font-medium space-y-1">
              <div className="font-bold text-rose-900 dark:text-rose-100">Validation Notice</div>
              <div>{validationError}</div>
            </div>
            <button
              onClick={() => setValidationError(null)}
              className="text-rose-400 hover:text-rose-700 dark:hover:text-rose-100 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs font-medium">
              <div className="font-bold text-emerald-900 dark:text-emerald-100">Success</div>
              <div>{successMessage}</div>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-100 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* View Mode Notice Banner */}
        {isViewMode && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>
                <strong>View Mode:</strong> Viewing saved Proforma Invoice record <span className="font-mono font-bold">{piNumber || currentId}</span>. All fields are displayed in inspection mode.
              </span>
            </div>
            <Link
              to="/mm-proforma-invoice-create"
              search={{ piId: currentId } as any}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline"
            >
              Switch to Edit
            </Link>
          </div>
        )}

        {/* Status & Quick Overview Header */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 font-bold">
              PI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-900 dark:text-white">
                  {piNumber || "New Proforma Invoice"}
                </h1>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    status === "Passed"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                      : status === "Approved"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
                  }`}
                >
                  {status}
                </span>
                {isWaiting && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                    Waiting Flagged
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Supplier:{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {supplierName || "No supplier locked yet"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">PI Total (USD)</span>
              <span className="text-base font-extrabold text-teal-600 dark:text-teal-400">
                ${calculatedTotals.grandTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* PI Information Section                                             */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                PI Information Section
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">ERP Standard Synergy Field Arrangement</span>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
              {/* Column 1: PI Date & PI Number (Strict Requirement: Must appear in the first column, in this order) */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    PI Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={piDate}
                    onChange={(e) => setPiDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-teal-500 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    PI Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={piNumber}
                    onChange={(e) => setPiNumber(e.target.value)}
                    placeholder="e.g. PI-2026-0042"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-teal-700 dark:text-teal-300 font-mono font-bold text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Column 2: Supplier & Source */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Supplier <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={supplierName}
                    readOnly
                    disabled
                    placeholder={
                      itemCategory === "Accessories"
                        ? "Populated from selected Accessories Booking"
                        : "Populated from selected Fabric Booking"
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 font-bold text-teal-700 dark:text-teal-300 text-xs cursor-not-allowed select-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-teal-500 text-xs font-semibold"
                  >
                    <option value="Nominated">Nominated</option>
                    <option value="Open">Open</option>
                  </select>
                </div>
              </div>

              {/* Column 3: Item Category & Merchant */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Item</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => {
                      const nextVal = e.target.value;
                      if (attachedBookings.length > 0 && nextVal !== itemCategory) {
                        const confirmed = window.confirm(
                          `Changing Item type to "${nextVal}" will clear currently attached ${attachedBookings.length} ${itemCategory} booking(s). Do you want to proceed?`
                        );
                        if (!confirmed) return;
                        setAttachedBookings([]);
                        setPiItems([]);
                        setActiveBookingId("");
                        setSupplierName("");
                      }
                      setItemCategory(nextVal);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-teal-500 text-xs font-semibold"
                  >
                    <option value="Fabric">Fabric</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Merchan.</label>
                  <select
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-teal-500 text-xs font-semibold"
                  >
                    {MM_MERCHANTS_MASTER.map((m) => (
                      <option key={m.id} value={`${m.name} - ${m.designation}`}>
                        {m.name} ({m.designation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Column 4: Payment Terms & Delivery Mode */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Pay Term</label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-teal-500 text-xs"
                  >
                    <option value="TT 30 Days">TT 30 Days</option>
                    <option value="LC 60 Days">LC 60 Days</option>
                    <option value="LC 90 Days">LC 90 Days</option>
                    <option value="Sight LC at Bank">Sight LC at Bank</option>
                    <option value="Cash In Advance">Cash In Advance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Del Mode</label>
                  <select
                    value={deliveryMode}
                    onChange={(e) => setDeliveryMode(e.target.value as "Sea" | "Air" | "Road")}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-teal-500 text-xs"
                  >
                    <option value="Road">Road</option>
                    <option value="Sea">Sea</option>
                    <option value="Air">Air</option>
                  </select>
                </div>
              </div>

              {/* Column 5: BBLC No & Delivery Terms */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">BBLC No</label>
                  <input
                    type="text"
                    value={bblcNo}
                    readOnly
                    disabled
                    placeholder="Populated from booking data"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono cursor-not-allowed select-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Delivery Terms</label>
                  <input
                    type="text"
                    value={deliveryTerms}
                    onChange={(e) => setDeliveryTerms(e.target.value)}
                    placeholder="e.g. FOB Savar"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-teal-500 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SECTION B — Booking Information Table                              */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Booking Information
              </h2>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {attachedBookings.length} {attachedBookings.length === 1 ? "booking" : "bookings"} attached
              </span>
            </div>

            <button
              onClick={() => {
                setBookingSearchQuery("");
                setShowAddBookingModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Booking</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Booking No</th>
                  <th className="py-2.5 px-3">Booking Desc</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Amount ($)</th>
                  <th className="py-2.5 px-3">Del.Mode</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attachedBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      No {itemCategory} Bookings attached yet. Click &ldquo;Add Another Booking&rdquo; above.
                    </td>
                  </tr>
                ) : (
                  attachedBookings.map((bk) => (
                    <tr
                      key={bk.bookingId}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-teal-700 dark:text-teal-400">
                        {bk.bookingNo}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                        {bk.bookingDesc || `${itemCategory} Booking`}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{bk.bookingDate}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                        ${bk.allocatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{bk.deliveryMode || "Road"}</td>

                      {/* Remove Action */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveBooking(bk.bookingId)}
                          title={`Remove from current PI draft (${itemCategory} Booking remains intact)`}
                          className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-700 disabled:opacity-40 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SECTION C — Consolidated Booking Details                           */}
        {/* Aggregated across colors with Season column directly after Job ID  */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Booking Details
              </h2>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Consolidated Across Colors
              </span>
            </div>

            <div className="text-[11px] text-slate-500">
              Showing <span className="font-bold text-teal-700 dark:text-teal-300">{consolidatedBookingItems.length}</span> consolidated {itemCategory.toLowerCase()}{" "}
              {consolidatedBookingItems.length === 1 ? "item" : "items"} across attached bookings
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Booking No</th>
                  <th className="py-2.5 px-3">Buyer</th>
                  <th className="py-2.5 px-3">Job ID</th>
                  <th className="py-2.5 px-3">Season</th>
                  <th className="py-2.5 px-3">Style</th>
                  <th className="py-2.5 px-3">{itemCategory === "Accessories" ? "Item Description" : "Fabric Description"}</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate</th>
                  <th className="py-2.5 px-3 text-right">Amount ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {consolidatedBookingItems.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
                      {attachedBookings.length === 0
                        ? `Attach an eligible ${itemCategory} booking above to automatically populate booking details.`
                        : "No booking details available."}
                    </td>
                  </tr>
                ) : (
                  consolidatedBookingItems.map((item) => (
                    <tr key={item.key} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-teal-700 dark:text-teal-400">
                        {item.sourceBookingNo}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {item.buyerName || "H&M Europe"}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                        {item.jobId || "JOB-2026-0001"}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-indigo-700 dark:text-indigo-400">
                        {item.season || "Spring/Summer 2026"}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                        {item.styleNo || "HM-KT-8841"}
                      </td>
                      <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">
                        {item.itemDescription || (itemCategory === "Accessories" ? "Accessory Item" : "100% Cotton Knitted Fabric")}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {item.quantity.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{item.unit || (itemCategory === "Accessories" ? "Pcs" : "Kg")}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-800 dark:text-slate-200">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-teal-700 dark:text-teal-400">
                        ${item.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SECTION D & E — Notes and Comments & Additional Charge             */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section D — Notes and Comments */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Notes and Comments
                </h2>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Note / Special Instructions
                </label>
                <textarea
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter Proforma Invoice terms, bank coordinates, packaging standards, and remarks..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section E — Additional Charge */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Additional Charge
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddChargeRow}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Charge Row</span>
              </button>
            </div>

            <div className="p-5 flex-1 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2 px-2">Particulars</th>
                    <th className="py-2 px-2">Note</th>
                    <th className="py-2 px-2 text-right">Amount ($)</th>
                    <th className="py-2 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {additionalChargesList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400 text-xs">
                        No additional charges entered. Click &ldquo;Add Charge Row&rdquo; to add freight, testing, or deduction adjustments.
                      </td>
                    </tr>
                  ) : (
                    additionalChargesList.map((chg) => (
                      <tr key={chg.id}>
                        <td className="py-2 px-2">
                          {/* Non-editable dropdown per Section 6.1 */}
                          <select
                            value={chg.particulars}
                            onChange={(e) => handleUpdateCharge(chg.id, "particulars", e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-teal-500"
                          >
                            {ADDITIONAL_CHARGE_OPTIONS.map((opt) => {
                              const isTaken = additionalChargesList.some(
                                (other) => other.id !== chg.id && other.particulars === opt
                              );
                              return (
                                <option key={opt} value={opt} disabled={isTaken}>
                                  {opt} {isTaken ? "(Already Added)" : ""}
                                </option>
                              );
                            })}
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={chg.note}
                            onChange={(e) => handleUpdateCharge(chg.id, "note", e.target.value)}
                            placeholder="Explanation / commercial note"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                          />
                        </td>
                        <td className="py-2 px-2 text-right">
                          {/* Negative amount support per Section 6.2 */}
                          <input
                            type="number"
                            step="any"
                            value={chg.amountUsd}
                            onChange={(e) => handleUpdateCharge(chg.id, "amountUsd", e.target.value)}
                            placeholder="0.00"
                            className={`w-28 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-right font-mono font-bold ${
                              chg.amountUsd < 0
                                ? "text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800"
                                : "text-slate-900 dark:text-white"
                            }`}
                          />
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteChargeRow(chg.id)}
                            className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-2.5 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-400 uppercase text-[10px]">
                Total Additional Charges:
              </span>
              <div className="flex items-center gap-4 font-mono font-bold">
                <span
                  className={
                    calculatedTotals.chargesTotalUsd < 0
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-teal-700 dark:text-teal-300"
                  }
                >
                  {calculatedTotals.chargesTotalUsd < 0 ? "-" : ""}$
                  {Math.abs(calculatedTotals.chargesTotalUsd).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SECTION 11 — Consolidated Proforma Invoice Totals                   */}
        {/* Crucial: Sum of ALL attached bookings' items + Additional Charges  */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-gradient-to-r from-teal-500/10 via-slate-100 to-indigo-500/10 dark:from-teal-950/40 dark:via-slate-900 dark:to-indigo-950/40 rounded-2xl border border-teal-200/80 dark:border-teal-800/80 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Consolidated Proforma Invoice Totals</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Calculated across all <span className="font-bold text-teal-600">{attachedBookings.length}</span> attached
                {" "}{itemCategory} Bookings plus Additional Charges.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Additional Charges (Signed Total)
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  ${calculatedTotals.chargesTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {additionalChargesList.length} {additionalChargesList.length === 1 ? "charge item" : "charge items"}
                </span>
              </div>
            </div>

            <div className="bg-teal-600/10 dark:bg-teal-900/30 rounded-xl p-3.5 border border-teal-300 dark:border-teal-700">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Grand PI Total (Final Valuation)
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-base font-black text-teal-700 dark:text-teal-300">
                  ${calculatedTotals.grandTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {itemCategory} Items + Net Charges
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SECTION 12 — Bottom Action Toolbar & Filters                       */}
        {/* ------------------------------------------------------------------ */}
        <div className="sticky bottom-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-300/80 dark:border-slate-700/80 p-3.5 shadow-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Preview */}
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-teal-600" />
              <span>Preview</span>
            </button>

            {/* Edit */}
            <button
              type="button"
              onClick={handleEnableEdit}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit</span>
            </button>

            {/* Attachment (Opens Document Storage Modal) */}
            <button
              type="button"
              onClick={() => setShowAttachmentModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all"
            >
              <Paperclip className="w-3.5 h-3.5 text-teal-600" />
              <span>Attachment ({piAttachments.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
              Status: <span className="text-slate-700 dark:text-slate-300 font-bold">{status}</span>
            </span>
            <button
              type="button"
              onClick={() => handleSaveDraft()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save PI Draft</span>
            </button>

            {/* Submit Button (Moved from Passed>> to the right side of action area) */}
            <button
              type="button"
              onClick={handleSubmitPI}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-extrabold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/30 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MODAL 1: ADD ANOTHER BOOKING (STRICT SUPPLIER FILTERING - MULTI-SELECT) */}
      {/* ==================================================================== */}
      {showAddBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Add {itemCategory} Booking(s)</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                    {itemCategory}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Select eligible {itemCategory} Booking(s) from supplier:{" "}
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    {supplierName || "Any Supplier (first booking locks supplier)"}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCandidateBookingIds([]);
                  setShowAddBookingModal(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={bookingSearchQuery}
                  onChange={(e) => setBookingSearchQuery(e.target.value)}
                  placeholder={`Search by Booking No, Style, or Job ID (${itemCategory})...`}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {(() => {
                // Filter only eligible bookings belonging to current PI's supplier and active itemCategory
                const rawCandidates: any[] = itemCategory === "Accessories" ? accBookings : fabricBookings;

                const eligible = rawCandidates.filter((b) => {
                  // Rule 1: Filter by exact supplier name if PI has supplier locked
                  if (
                    supplierName &&
                    b.supplierName?.trim().toLowerCase() !== supplierName.trim().toLowerCase()
                  ) {
                    return false;
                  }

                  // Rule 2: Exclude cancelled
                  if (b.status === "Cancelled") return false;

                  // Search query filter
                  if (bookingSearchQuery) {
                    const q = bookingSearchQuery.toLowerCase();
                    const matchNo = b.bookingNo?.toLowerCase().includes(q);
                    const matchSupplier = b.supplierName?.toLowerCase().includes(q);
                    const matchStyle = itemCategory === "Accessories"
                      ? b.items?.some((i: any) => i.style?.toLowerCase().includes(q) || i.accessoryName?.toLowerCase().includes(q)) ||
                        b.lines?.some((l: any) => l.style?.toLowerCase().includes(q) || l.itemGroup?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q))
                      : b.items?.some((i: any) => i.styleNo?.toLowerCase().includes(q)) ||
                        b.lines?.some((l: any) => l.jobId?.toLowerCase().includes(q) || l.styleNo?.toLowerCase().includes(q));
                    if (!matchNo && !matchSupplier && !matchStyle) return false;
                  }

                  return true;
                });

                if (eligible.length === 0) {
                  return (
                    <div className="py-12 px-6 text-center text-slate-500 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                        <Layers className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {supplierName
                          ? `No eligible ${itemCategory.toLowerCase()} bookings found for supplier "${supplierName}".`
                          : `No eligible ${itemCategory.toLowerCase()} bookings available.`}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Bookings from other suppliers and non-{itemCategory} items are excluded to ensure strict supplier and item consistency.
                      </p>
                    </div>
                  );
                }

                const unattachedEligible = eligible.filter(
                  (b) => !attachedBookings.some((ab) => ab.bookingId === b.id || ab.bookingNo === b.bookingNo)
                );

                const isAllSelected =
                  unattachedEligible.length > 0 &&
                  unattachedEligible.every((b) => selectedCandidateBookingIds.includes(b.id));

                return (
                  <div className="space-y-2">
                    {unattachedEligible.length > 1 && (
                      <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCandidateBookingIds(unattachedEligible.map((b) => b.id));
                              } else {
                                setSelectedCandidateBookingIds([]);
                              }
                            }}
                            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                          />
                          <span>Select All Eligible ({unattachedEligible.length})</span>
                        </label>
                        <span className="text-[11px] text-slate-400">
                          {selectedCandidateBookingIds.length} selected
                        </span>
                      </div>
                    )}

                    {eligible.map((b) => {
                      const isAlreadyAttached = attachedBookings.some(
                        (ab) => ab.bookingId === b.id || ab.bookingNo === b.bookingNo
                      );
                      const isChecked = selectedCandidateBookingIds.includes(b.id);
                      const bookingAmount =
                        itemCategory === "Accessories"
                          ? (b.totalBookedAmount || b.totalAmount || 0)
                          : (b.totalAmount || b.totalBookedAmount || 0);

                      return (
                        <div
                          key={b.id}
                          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 transition-all ${
                            isAlreadyAttached
                              ? "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 opacity-75"
                              : isChecked
                              ? "border-teal-500 bg-teal-50/40 dark:bg-teal-950/20 shadow-sm"
                              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-500 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {!isAlreadyAttached && (
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  setSelectedCandidateBookingIds((prev) =>
                                    e.target.checked ? [...prev, b.id] : prev.filter((id) => id !== b.id)
                                  );
                                }}
                                className="mt-1 rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                              />
                            )}

                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-900 dark:text-white">{b.bookingNo}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  {b.status || "Approved"}
                                </span>
                                {isAlreadyAttached ? (
                                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                    Already Added
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                                    Eligible
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Supplier: <span className="font-semibold text-slate-700 dark:text-slate-300">{b.supplierName}</span> | Date: {b.bookingDate}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Amount: <span className="font-mono font-bold text-teal-600">${bookingAmount.toLocaleString()}</span> | Delivery Mode: {b.delMode || b.deliveryMode || "Road"}
                              </div>
                            </div>
                          </div>

                          <div>
                            {isAlreadyAttached ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setValidationError("This booking has already been added to the current Proforma Invoice.");
                                }}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed flex items-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Already Added</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  if (itemCategory === "Accessories") {
                                    handleAddAccessoriesBookingToPi(b as MMAccessoriesBooking);
                                  } else {
                                    handleAddBookingToPi(b as MMFabricBooking);
                                  }
                                }}
                                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Attach to PI</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                {selectedCandidateBookingIds.length > 0 ? (
                  <span>
                    <strong className="text-teal-600 font-bold">{selectedCandidateBookingIds.length}</strong> booking(s) selected
                  </span>
                ) : (
                  <span>Select multiple bookings to attach in a single PI</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBatchAttachBookings(selectedCandidateBookingIds)}
                  disabled={selectedCandidateBookingIds.length === 0}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Attach Selected ({selectedCandidateBookingIds.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCandidateBookingIds([]);
                    setShowAddBookingModal(false);
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: VIEW LIST / REGISTER WITH DATE & STATUS FILTERS (SEC 12)    */}
      {/* ==================================================================== */}
      {showViewListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Proforma Invoice Register</h3>
                <p className="text-xs text-slate-500">
                  View, filter, or switch between saved Proforma Invoices without losing current unsaved work.
                </p>
              </div>
              <button
                onClick={() => setShowViewListModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter controls */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={listSearch}
                  onChange={(e) => setListSearch(e.target.value)}
                  placeholder="Filter by PI Nr, Supplier, Entry No..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
              </div>

              <div>
                <select
                  value={listStatusFilter}
                  onChange={(e) => setListStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                >
                  <option value="All">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Approved">Approved</option>
                  <option value="Passed">Passed</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-slate-500">
                <span>From:</span>
                <input
                  type="date"
                  value={listDateFrom}
                  onChange={(e) => setListDateFrom(e.target.value)}
                  className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
              </div>

              <div className="flex items-center gap-1.5 text-slate-500">
                <span>To:</span>
                <input
                  type="date"
                  value={listDateTo}
                  onChange={(e) => setListDateTo(e.target.value)}
                  className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setListSearch("");
                  setListStatusFilter("All");
                  setListDateFrom("");
                  setListDateTo("");
                }}
                className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 text-xs underline"
              >
                Reset
              </button>
            </div>

            {/* List Table */}
            <div className="p-4 overflow-y-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2 px-3">PI Nr.</th>
                    <th className="py-2 px-3">Entry No</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Supplier</th>
                    <th className="py-2 px-3">Bookings</th>
                    <th className="py-2 px-3 text-right">Value (USD)</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPiList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                        No Proforma Invoices match the active filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredPiList.map((pi) => (
                      <tr key={pi.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                          {pi.piNo}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">{pi.entryNo}</td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{pi.piDate}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                          {pi.supplierName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                          {pi.allocatedBookings?.length || 0}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                          ${pi.totalPiValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              pi.status === "Passed"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : pi.status === "Approved"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            }`}
                          >
                            {pi.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              populateFormFromPI(pi);
                              setShowViewListModal(false);
                            }}
                            className="px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 font-bold text-[11px]"
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  initializeBlankPi();
                  setShowViewListModal(false);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-600 text-white hover:bg-teal-700"
              >
                + Create New Blank PI
              </button>
              <button
                type="button"
                onClick={() => setShowViewListModal(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
              >
                Return to Current Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: PREVIEW PROFORMA INVOICE (SECTION 12)                        */}
      {/* ==================================================================== */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Proforma Invoice Preview</h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 text-xs bg-white text-slate-900">
              {/* Formal Header */}
              <div className="border-b pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-wider">CRIPTON COMPOSITE TEXTILES LTD.</h2>
                  <p className="text-slate-500 text-[11px]">Marketing & Merchandising Division | Savar Export Zone</p>
                  <p className="text-slate-500 text-[11px]">Dhaka, Bangladesh | E-mail: mm-commercial@cripton.com</p>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-teal-100 text-teal-900 font-extrabold text-sm rounded uppercase">
                    PROFORMA INVOICE
                  </div>
                  <div className="font-mono font-bold mt-1 text-slate-800">Nr: {piNumber || "DRAFT"}</div>
                  <div className="text-slate-500 text-[11px]">Date: {piDate}</div>
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Beneficiary / Supplier</div>
                  <div className="font-bold text-sm text-slate-800">{supplierName || "Pakiza Knitting & Dyeing"}</div>
                  <div className="text-slate-600">Export Industrial Area, Savar</div>
                  <div className="text-slate-600">Payment Terms: {paymentTerms}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Applicant / Buyer</div>
                  <div className="font-bold text-sm text-slate-800">Cripton HRIS Garments Ltd.</div>
                  <div className="text-slate-600">Unit: {impUnit}</div>
                  <div className="text-slate-600">LC Type: {lcType} | Port: {deliveryPlace}</div>
                </div>
              </div>

              {/* Bookings Attached */}
              <div>
                <div className="text-xs font-bold text-slate-700 uppercase mb-2">Attached {itemCategory} Bookings</div>
                <div className="flex flex-wrap gap-2">
                  {attachedBookings.map((b) => (
                    <span key={b.bookingId} className="px-2.5 py-1 bg-slate-100 rounded border text-slate-700 font-mono">
                      {b.bookingNo} ({b.styleNo}) — ${b.allocatedAmount.toLocaleString()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Items Table */}
              <div>
                <div className="text-xs font-bold text-slate-700 uppercase mb-2">Itemized {itemCategory} Specifications</div>
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="p-2 border-b">Job ID</th>
                      <th className="p-2 border-b">Description</th>
                      <th className="p-2 border-b text-right">Quantity</th>
                      <th className="p-2 border-b text-right">Unit Rate</th>
                      <th className="p-2 border-b text-right">Amount ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewBookingItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400 text-xs font-sans">
                          No booking items linked to this Proforma Invoice.
                        </td>
                      </tr>
                    ) : (
                      previewBookingItems.map((item) => (
                        <tr key={item.piItemId} className="border-b">
                          <td className="p-2 font-mono">{item.jobId}</td>
                          <td className="p-2">{item.itemDescription}</td>
                          <td className="p-2 text-right font-mono">
                            {item.quantity.toLocaleString()} {item.unit}
                          </td>
                          <td className="p-2 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                          <td className="p-2 text-right font-mono font-bold">${item.totalAmount.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Additional charges */}
              {additionalChargesList.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-700 uppercase mb-2">Additional Charges</div>
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 border-b">Particulars</th>
                        <th className="p-2 border-b">Note</th>
                        <th className="p-2 border-b text-right">USD ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {additionalChargesList.map((chg) => (
                        <tr key={chg.id} className="border-b">
                          <td className="p-2 font-medium">{chg.particulars}</td>
                          <td className="p-2 text-slate-500">{chg.note}</td>
                          <td className="p-2 text-right font-mono">${chg.amountUsd.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Totals */}
              <div className="flex justify-end pt-2">
                <div className="w-72 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Total:</span>
                    <span>${previewReportTotals.itemsTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Charges Total:</span>
                    <span>${previewReportTotals.chargesTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t pt-1 flex justify-between font-bold text-sm text-teal-800">
                    <span>PI Total (USD):</span>
                    <span>${previewReportTotals.grandTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {notes && (
                <div className="border-t pt-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Remarks / Notes:</div>
                  <div className="text-slate-700 text-xs mt-1 whitespace-pre-wrap">{notes}</div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: LC BREAKUP (SECTION 12)                                     */}
      {/* ==================================================================== */}
      {showLcBreakupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Letter of Credit (LC) Breakup</h3>
                <p className="text-xs text-slate-500">Commercial LC allocation breakdown by booking</p>
              </div>
              <button
                onClick={() => setShowLcBreakupModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">LC Opening Date</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{lcOpenDate || "Pending"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">LC Type</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{lcType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Back-to-Back LC Ref</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{bblcNo || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Commercial Unit</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{impUnit}</span>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                  Booking Share Breakdown
                </div>
                <div className="space-y-2">
                  {attachedBookings.map((b) => {
                    const pct =
                      calculatedTotals.grandTotalUsd > 0
                        ? ((b.allocatedAmount / calculatedTotals.grandTotalUsd) * 100).toFixed(1)
                        : "0";
                    return (
                      <div
                        key={b.bookingId}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-mono font-bold text-teal-600">{b.bookingNo}</div>
                          <div className="text-[11px] text-slate-500">
                            {b.styleNo} — Garments: {(b.affectedGarmentQty || 0).toLocaleString()} pcs
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-slate-900 dark:text-white">
                            ${b.allocatedAmount.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400 font-semibold">{pct}% of PI</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
              <button
                type="button"
                onClick={() => setShowLcBreakupModal(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 5: COMMENTS (SECTION 9)                                        */}
      {/* ==================================================================== */}
      {showCommentsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Proforma Invoice Comments</h3>
                <p className="text-xs text-slate-500">Section D communication & audit comments trail</p>
              </div>
              <button
                onClick={() => setShowCommentsModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
              {comments.length === 0 ? (
                <div className="py-8 text-center text-slate-400">No comments posted yet.</div>
              ) : (
                comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold text-teal-600 dark:text-teal-400">{c.user}</span>
                      <span>{c.timestamp}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200">{c.message}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                placeholder="Type a comment or status note..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
              />
              <button
                type="button"
                onClick={handleAddComment}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 6: ATTACHMENTS — DOCUMENT STORAGE REFERENCE DESIGN (SECTION 8)  */}
      {/* ==================================================================== */}
      {showAttachmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-teal-600" />
                  <span>Document Storage — Proforma Invoice Attachments</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  PI Ref: <span className="font-mono font-bold text-teal-700 dark:text-teal-400">{piNumber || "Draft PI"}</span> | Supplier: <span className="font-semibold text-slate-700 dark:text-slate-300">{supplierName || "N/A"}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAttachmentModal(false);
                  setEditingAttachment(null);
                  setUploadError(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Section 4.3: Single File Storage Section (Image Storage tab removed) */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-teal-600/30">
                    <File className="w-4 h-4" />
                    <span>File Storage</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full font-mono">
                      {piAttachments.length}
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

              {/* Section 4.1: File Selection and Upload Form (Document Type removed) */}
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
                      id="attachment-file-upload-input"
                    />
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="attachment-file-upload-input"
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
                      placeholder="e.g. Official Signed PI"
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

              {/* Section 2: Attachment Table (7 columns: Remove, Title, Note, Uploaded By, Upload Time, File Size, Download) */}
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
                    {piAttachments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                          No documents stored for this Proforma Invoice.
                        </td>
                      </tr>
                    ) : (
                      piAttachments.map((att) => (
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
                Total persistent attachments for this PI: <strong>{piAttachments.length}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowAttachmentModal(false);
                  setEditingAttachment(null);
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 7: BB INFORMATION (SECTION B 'BB' ACTION)                      */}
      {/* ==================================================================== */}
      {showBbModal && bbTargetBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Back-to-Back LC Information</h3>
                <p className="text-xs text-slate-500 font-mono">Booking: {bbTargetBooking.bookingNo}</p>
              </div>
              <button
                onClick={() => setShowBbModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Booking No:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {bbTargetBooking.bookingNo}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Associated Style:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{bbTargetBooking.styleNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Allocated Amount:</span>
                <span className="font-mono font-bold text-teal-600">
                  ${bbTargetBooking.allocatedAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Master LC Reference:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {bblcNo || "LC-BBLC-2026-9901"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">BB LC Status:</span>
                <span className="font-bold text-amber-600">Under Commercial Processing</span>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
              <button
                type="button"
                onClick={() => setShowBbModal(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </MarketingMerchandisingLayout>
  );
}
