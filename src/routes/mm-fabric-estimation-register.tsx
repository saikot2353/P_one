import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMFabricEstimationRecord,
  MMFabricEstimationRow,
  MMFabricBooking,
  MMMainOrder,
  MMFabricColorMapping,
} from "../lib/marketing-merchandising-data";
import {
  Scissors,
  Search,
  RotateCcw,
  ExternalLink,
  PlusCircle,
  FileSpreadsheet,
  Printer,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  Layers,
  Building2,
  ShoppingBag,
  CheckSquare,
  Square,
  X,
  Sparkles,
  Palette,
  Trash2,
  Check,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mm-fabric-estimation-register")({
  head: () => ({
    meta: [
      { title: "Fabric Estimation Register — Marketing & Merchandising | CriptonHRIS" },
      {
        name: "description",
        content: "Complete register of all saved fabric estimation items with supplier-based booking tracking and allocation status.",
      },
    ],
  }),
  component: MMFabricEstimationRegisterPage,
});

export interface FabricEstimationRegisterRow {
  rowId: string;
  estimationId: string;
  orderId: string;
  // Columns 1-6: Parent Order Context
  buyer: string;
  jobId: string;
  style: string;
  merchant: string;
  gmtItem: string;
  orderQty: number;
  // Columns 7-18: Fabric Item Details
  fabricItem: string;
  usedPlace: string;
  fabricDescription: string;
  supplier: string;
  supplierId?: string;
  consumption: number;
  unit: string;
  wastagePct: number;
  requiredQty: number;
  estRate: number;
  estValue: number;
  width: string;
  fabricColor: string;
  // Columns 19-22: Booking Status & Values
  bookNo: string;
  bookQty: number;
  bookValue: number;
  bookingStatus: "Not Booked" | "Partially Booked" | "Fully Booked" | "Pending Approval";
  hasActualBooking: boolean;
  actualBookingId?: string;
  actualBookingNo?: string;
  // Underlying record refs
  rawRow: MMFabricEstimationRow;
  rawEstimation: MMFabricEstimationRecord;
}

export function MMFabricEstimationRegisterPage() {
  const navigate = useNavigate();

  // Primary Data States
  const [estimations, setEstimations] = useState<MMFabricEstimationRecord[]>([]);
  const [orders, setOrders] = useState<MMMainOrder[]>([]);
  const [fabricBookings, setFabricBookings] = useState<MMFabricBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters State (8 Filter Criteria)
  const [filterBuyer, setFilterBuyer] = useState("");
  const [filterJobId, setFilterJobId] = useState("");
  const [filterStyle, setFilterStyle] = useState("");
  const [filterMerchant, setFilterMerchant] = useState("");
  const [filterGmtItem, setFilterGmtItem] = useState("");
  const [filterFabricItem, setFilterFabricItem] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");
  const [filterBookingStatus, setFilterBookingStatus] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");

  // Booking Status Segmented Tab State (Section 4)
  const [bookingStatusTab, setBookingStatusTab] = useState<"All" | "Booked" | "Not Booked">("All");

  // Multi-Item Row Selection State (Section 5)
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  // Original Color Detail "D" Modal State (Section 2)
  const [activeColorModalRow, setActiveColorModalRow] = useState<FabricEstimationRegisterRow | null>(null);
  const [modalColorType, setModalColorType] = useState<"DTM" | "Contrast" | "Single Color">("DTM");
  const [modalSingleColor, setModalSingleColor] = useState<string>("");
  const [modalColorMappings, setModalColorMappings] = useState<MMFabricColorMapping[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Load data from LocalStorage via MMRepository
  const reloadData = () => {
    try {
      setLoading(true);
      const loadedEsts = MMRepository.getFabricEstimations();
      const loadedOrders = MMRepository.getOrders();
      const loadedBookings = MMRepository.getFabricBookings();
      setEstimations(loadedEsts);
      setOrders(loadedOrders);
      setFabricBookings(loadedBookings);
    } catch (err) {
      console.error("Failed to load fabric estimation register data:", err);
      toast.error("Failed to load fabric estimation records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Transform estimation items into flat register rows
  const registerRows = useMemo<FabricEstimationRegisterRow[]>(() => {
    const rows: FabricEstimationRegisterRow[] = [];

    estimations.forEach((est) => {
      // Find parent order record for enriched merchant / item / buyer data if available
      const order = orders.find(
        (o) =>
          o.jobNo === est.jobNo ||
          o.jobNo === est.ourRef ||
          o.id === est.orderId ||
          o.orderNo === est.jobNo
      );

      const effectiveBuyer = est.buyer || order?.buyerName || "-";
      const effectiveJobId = est.ourRef || est.jobNo || order?.jobNo || "-";
      const effectiveStyle = est.style || order?.styleNo || "-";
      const effectiveMerchant = order?.merchan || order?.merchandisingRef || "Md. Tanvir Ahmed";
      const effectiveGmtItem = order?.garmentItem || est.itemName || "Garment Item";
      const effectiveOrderQty = est.quantity || order?.orderQuantity || 0;

      if (!est.fabricRows || est.fabricRows.length === 0) return;

      est.fabricRows.forEach((item) => {
        // Find matching bookings for this fabric estimation item
        const matchingBookings: { bookingNo: string; bookingId: string; qty: number; value: number; status: string }[] = [];

        fabricBookings.forEach((fb) => {
          let lineBookedQty = 0;
          let lineBookedValue = 0;
          let hasMatch = false;

          // Check line matching
          if (fb.lines && fb.lines.length > 0) {
            fb.lines.forEach((l) => {
              // 1. Direct item ID match (highest precision)
              const matchesItemId = Boolean(l.fabricEstimationItemId && l.fabricEstimationItemId === item.id);

              // 2. Verified direct bookingRef match against this saved booking
              const matchesBookingRef = Boolean(
                item.bookingRef &&
                (fb.bookingNo === item.bookingRef || fb.id === item.bookingRef) &&
                (l.fabricEstimationItemId === item.id ||
                  (!l.fabricEstimationItemId &&
                    (l.jobId === est.jobNo || l.ourRef === est.ourRef) &&
                    (l.fabricEstimationId === est.id || item.code === l.fabricCode || item.fabricNo === l.fabricCode)))
              );

              // 3. Fallback for legacy seed records where fabricEstimationItemId was not recorded
              // (strictly disallow if l.fabricEstimationItemId points to a different item)
              const matchesLegacyLine =
                !l.fabricEstimationItemId &&
                (l.jobId === est.jobNo || l.ourRef === est.ourRef) &&
                l.fabricEstimationId === est.id &&
                ((item.code && l.fabricCode === item.code) ||
                  (item.fabricNo && l.fabricCode === item.fabricNo) ||
                  l.fabricDescription === item.fabricDescription);

              if (matchesItemId || matchesBookingRef || matchesLegacyLine) {
                hasMatch = true;
                const bQty = Number(l.bookingQuantity) || 0;
                lineBookedQty += bQty;
                lineBookedValue += Number(l.lineTotal) || bQty * (l.rate || item.rate || 0);
              }
            });
          }

          // Check items matching (if fabric booking stores items array)
          if (fb.items && fb.items.length > 0) {
            fb.items.forEach((it) => {
              const matchesItemId = Boolean(it.estimationItemId && it.estimationItemId === item.id);
              const matchesLegacyItem =
                !it.estimationItemId &&
                (it.orderNo === est.jobNo || it.styleNo === est.style) &&
                it.fabricDescription === item.fabricDescription;

              if (matchesItemId || matchesLegacyItem) {
                hasMatch = true;
                const bQty = Number(it.bookedQty) || 0;
                lineBookedQty += bQty;
                lineBookedValue += Number(it.totalAmount) || bQty * (it.unitRate || item.rate || 0);
              }
            });
          }

          if (hasMatch) {
            matchingBookings.push({
              bookingNo: fb.bookingNo,
              bookingId: fb.id,
              qty: lineBookedQty,
              value: lineBookedValue,
              status: fb.status,
            });
          }
        });

        const totalBookedQty = matchingBookings.reduce((acc, curr) => acc + curr.qty, 0);
        const totalBookedValue = matchingBookings.reduce((acc, curr) => acc + curr.value, 0);

        // ONLY booking numbers that correspond to actual saved matching bookings
        const bookingNumbers = Array.from(
          new Set(matchingBookings.map((b) => b.bookingNo).filter(Boolean))
        );

        // Derive Booking Status strictly from actual saved booking data
        let derivedStatus: "Not Booked" | "Partially Booked" | "Fully Booked" | "Pending Approval" = "Not Booked";
        const hasPending = matchingBookings.some(
          (b) => b.status === "Pending" || b.status === "In Review" || b.status === "Draft"
        );

        const requiredQty = Number(item.requireQty) || 0;
        if (matchingBookings.length === 0 || (bookingNumbers.length === 0 && totalBookedQty === 0)) {
          derivedStatus = "Not Booked";
        } else if (hasPending && !matchingBookings.some((b) => b.status === "Approved")) {
          derivedStatus = "Pending Approval";
        } else if (requiredQty > 0 && totalBookedQty >= requiredQty) {
          derivedStatus = "Fully Booked";
        } else if (totalBookedQty > 0) {
          derivedStatus = "Partially Booked";
        } else if (bookingNumbers.length > 0) {
          derivedStatus = "Fully Booked";
        } else {
          derivedStatus = "Not Booked";
        }

        // Color string summary
        let colorDisplay = item.singleColorName || "";
        if (!colorDisplay && item.colorMappings && item.colorMappings.length > 0) {
          const uniqueColors = Array.from(
            new Set(item.colorMappings.map((c) => c.itemColor || c.garmentsColor).filter(Boolean))
          );
          colorDisplay = uniqueColors.join(", ");
        }
        if (!colorDisplay) {
          colorDisplay = item.colorType || "DTM";
        }

        const estVal =
          (item.requireQty || 0) * (item.rate || 0) ||
          (item.costPerDz ? (item.costPerDz * (effectiveOrderQty / 12)) : 0);

        rows.push({
          rowId: item.id,
          estimationId: est.id,
          orderId: est.orderId,
          buyer: effectiveBuyer,
          jobId: effectiveJobId,
          style: effectiveStyle,
          merchant: effectiveMerchant,
          gmtItem: effectiveGmtItem,
          orderQty: effectiveOrderQty,
          fabricItem: item.budgetItemName || item.fabricNo || "Fabric",
          usedPlace: item.usedPlace || "-",
          fabricDescription: item.fabricDescription || "-",
          supplier: item.supplier || "Pakiza Knitting & Dyeing",
          supplierId: item.supplierId,
          consumption: Number(item.consum || item.consPerDz || item.consPerPc || 0),
          unit: item.unit || item.marketUnit || item.sku || "Kg",
          wastagePct: Number(item.wPct ?? 0),
          requiredQty: Number(item.requireQty || 0),
          estRate: Number(item.rate || 0),
          estValue: Number(estVal),
          width: item.width || "-",
          fabricColor: colorDisplay,
          bookNo: bookingNumbers.length > 0 ? bookingNumbers.join(", ") : "-",
          bookQty: totalBookedQty,
          bookValue: totalBookedValue,
          bookingStatus: derivedStatus,
          hasActualBooking: matchingBookings.length > 0,
          actualBookingId: matchingBookings[0]?.bookingId,
          actualBookingNo: matchingBookings[0]?.bookingNo,
          rawRow: item,
          rawEstimation: est,
        });
      });
    });

    return rows;
  }, [estimations, orders, fabricBookings]);

  // Dynamic filter options extracted from actual loaded data
  const filterOptions = useMemo(() => {
    return {
      buyers: Array.from(new Set(registerRows.map((r) => r.buyer))).filter((x) => x && x !== "-").sort(),
      jobIds: Array.from(new Set(registerRows.map((r) => r.jobId))).filter((x) => x && x !== "-").sort(),
      styles: Array.from(new Set(registerRows.map((r) => r.style))).filter((x) => x && x !== "-").sort(),
      merchants: Array.from(new Set(registerRows.map((r) => r.merchant))).filter((x) => x && x !== "-").sort(),
      gmtItems: Array.from(new Set(registerRows.map((r) => r.gmtItem))).filter((x) => x && x !== "-").sort(),
      fabricItems: Array.from(new Set(registerRows.map((r) => r.fabricItem))).filter((x) => x && x !== "-").sort(),
      suppliers: Array.from(new Set(registerRows.map((r) => r.supplier))).filter((x) => x && x !== "-").sort(),
      bookingStatuses: ["Not Booked", "Partially Booked", "Fully Booked", "Pending Approval"],
    };
  }, [registerRows]);

  // Dynamic counts for Booking Status Tabs (Section 4)
  const tabCounts = useMemo(() => {
    const total = registerRows.length;
    const booked = registerRows.filter(
      (r) =>
        r.bookingStatus === "Fully Booked" ||
        r.bookingStatus === "Partially Booked" ||
        r.bookingStatus === "Pending Approval" ||
        r.bookNo !== "-" ||
        r.bookQty > 0
    ).length;
    const notBooked = registerRows.filter(
      (r) =>
        r.bookingStatus === "Not Booked" &&
        r.bookNo === "-" &&
        (!r.bookQty || r.bookQty === 0)
    ).length;
    return { total, booked, notBooked };
  }, [registerRows]);

  // Multi-Filter AND Matching
  const filteredRows = useMemo(() => {
    return registerRows.filter((r) => {
      // 1. Booking Status Segmented Tab Filter (Section 4)
      if (bookingStatusTab === "Booked") {
        const isBooked =
          r.bookingStatus === "Fully Booked" ||
          r.bookingStatus === "Partially Booked" ||
          r.bookingStatus === "Pending Approval" ||
          r.bookNo !== "-" ||
          r.bookQty > 0;
        if (!isBooked) return false;
      } else if (bookingStatusTab === "Not Booked") {
        const isNotBooked =
          r.bookingStatus === "Not Booked" &&
          r.bookNo === "-" &&
          (!r.bookQty || r.bookQty === 0);
        if (!isNotBooked) return false;
      }

      if (filterBuyer && r.buyer !== filterBuyer) return false;
      if (filterJobId && r.jobId !== filterJobId) return false;
      if (filterStyle && r.style !== filterStyle) return false;
      if (filterMerchant && r.merchant !== filterMerchant) return false;
      if (filterGmtItem && r.gmtItem !== filterGmtItem) return false;
      if (filterFabricItem && r.fabricItem !== filterFabricItem) return false;
      if (filterSupplier && r.supplier !== filterSupplier) return false;
      if (filterBookingStatus && r.bookingStatus !== filterBookingStatus) return false;

      if (globalSearch) {
        const q = globalSearch.toLowerCase();
        const haystack = [
          r.buyer,
          r.jobId,
          r.style,
          r.merchant,
          r.gmtItem,
          r.fabricItem,
          r.fabricDescription,
          r.supplier,
          r.usedPlace,
          r.fabricColor,
          r.bookNo,
          r.bookingStatus,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [
    registerRows,
    bookingStatusTab,
    filterBuyer,
    filterJobId,
    filterStyle,
    filterMerchant,
    filterGmtItem,
    filterFabricItem,
    filterSupplier,
    filterBookingStatus,
    globalSearch,
  ]);

  // Selected row objects
  const selectedRows = useMemo(() => {
    return registerRows.filter((r) => selectedRowIds.includes(r.rowId));
  }, [registerRows, selectedRowIds]);

  // Statistics aggregations for export and reference
  const stats = useMemo(() => {
    const totalItems = filteredRows.length;
    const totalRequiredQty = filteredRows.reduce((acc, r) => acc + r.requiredQty, 0);
    const totalEstValue = filteredRows.reduce((acc, r) => acc + r.estValue, 0);
    const totalBookedValue = filteredRows.reduce((acc, r) => acc + r.bookValue, 0);
    const fullyBookedCount = filteredRows.filter((r) => r.bookingStatus === "Fully Booked").length;
    const bookingRate = totalEstValue > 0 ? (totalBookedValue / totalEstValue) * 100 : 0;

    return {
      totalItems,
      totalRequiredQty,
      totalEstValue,
      totalBookedValue,
      fullyBookedCount,
      bookingRate,
    };
  }, [filteredRows]);

  // Reset all filters
  const handleClearFilters = () => {
    setFilterBuyer("");
    setFilterJobId("");
    setFilterStyle("");
    setFilterMerchant("");
    setFilterGmtItem("");
    setFilterFabricItem("");
    setFilterSupplier("");
    setFilterBookingStatus("");
    setGlobalSearch("");
    setCurrentPage(1);
    toast.info("All register filters have been reset.");
  };

  const hasActiveFilters =
    Boolean(filterBuyer || filterJobId || filterStyle || filterMerchant || filterGmtItem || filterFabricItem || filterSupplier || filterBookingStatus || globalSearch);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  // ── ROW SELECTION & SAME-SUPPLIER ENFORCEMENT (Section 5) ──────────────────
  const handleToggleSelectRow = (row: FabricEstimationRegisterRow) => {
    const isFullyBooked =
      row.bookingStatus === "Fully Booked" ||
      (row.requiredQty > 0 && row.bookQty >= row.requiredQty);

    if (isFullyBooked) {
      toast.warning(
        `Item "${row.fabricItem}" (${row.fabricDescription}) is already fully booked (${row.bookNo}) and cannot be selected for a new booking.`
      );
      return;
    }

    if (selectedRowIds.includes(row.rowId)) {
      const nextIds = selectedRowIds.filter((id) => id !== row.rowId);
      setSelectedRowIds(nextIds);
      if (nextIds.length === 0) {
        setSelectedSupplier(null);
      }
    } else {
      // Same-Supplier Restriction: check actual supplier ID and displayed supplier name
      const itemSupplierKey = (row.supplierId || row.supplier || "").trim();
      const currentSelected = selectedRows[0];
      const activeSupplierKey = currentSelected
        ? (currentSelected.supplierId || currentSelected.supplier || "").trim()
        : (selectedSupplier || "").trim();

      if (
        selectedSupplier &&
        activeSupplierKey &&
        itemSupplierKey.toLowerCase() !== activeSupplierKey.toLowerCase() &&
        row.supplier.toLowerCase().trim() !== selectedSupplier.toLowerCase().trim()
      ) {
        toast.error(
          "You can select fabric estimation items from only one supplier per booking. Please select items from the same supplier."
        );
        return;
      }

      setSelectedRowIds((prev) => [...prev, row.rowId]);
      if (!selectedSupplier) {
        setSelectedSupplier(row.supplier);
        toast.info(`Selection supplier set to: "${row.supplier}".`);
      }
    }
  };

  const handleClearSelection = () => {
    setSelectedRowIds([]);
    setSelectedSupplier(null);
    toast.info("Item selection cleared. You may now select items from any supplier.");
  };

  const handleSelectAllEligible = () => {
    // Eligible not-booked items within current filtered scope
    const eligibleRows = filteredRows.filter(
      (r) =>
        r.bookingStatus !== "Fully Booked" &&
        (r.requiredQty > (r.bookQty || 0) || (r.bookingStatus === "Not Booked" && r.bookNo === "-"))
    );

    if (eligibleRows.length === 0) {
      toast.warning("No eligible unbooked fabric items available to select in this view.");
      return;
    }

    if (selectedSupplier) {
      const sameSupplierRows = eligibleRows.filter(
        (r) =>
          (r.supplierId && selectedRows[0]?.supplierId && r.supplierId === selectedRows[0]?.supplierId) ||
          r.supplier.toLowerCase().trim() === selectedSupplier.toLowerCase().trim()
      );
      const newIds = Array.from(new Set([...selectedRowIds, ...sameSupplierRows.map((r) => r.rowId)]));
      setSelectedRowIds(newIds);
      toast.success(`Selected ${sameSupplierRows.length} eligible items for supplier "${selectedSupplier}".`);
    } else {
      const targetSupplier = eligibleRows[0].supplier;
      const targetSupplierId = eligibleRows[0].supplierId;
      const suppRows = eligibleRows.filter(
        (r) =>
          (targetSupplierId && r.supplierId && r.supplierId === targetSupplierId) ||
          r.supplier.toLowerCase().trim() === targetSupplier.toLowerCase().trim()
      );
      const excludedCount = eligibleRows.length - suppRows.length;
      setSelectedSupplier(targetSupplier);
      setSelectedRowIds(suppRows.map((r) => r.rowId));

      if (excludedCount > 0) {
        toast.info(
          `Selected ${suppRows.length} items for "${targetSupplier}". ${excludedCount} items from other suppliers were excluded.`
        );
      } else {
        toast.success(`Selected all ${suppRows.length} eligible items for "${targetSupplier}".`);
      }
    }
  };

  // ── COMBINED MULTI-ITEM FABRIC BOOKING (Section 6) ─────────────────────────
  const handleCreateFabricBooking = () => {
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one eligible fabric estimation item to create a booking.");
      return;
    }

    const supp = selectedRows[0].supplier;
    const suppId = selectedRows[0].supplierId;
    const hasDifferentSupplier = selectedRows.some((r) =>
      suppId && r.supplierId
        ? r.supplierId !== suppId
        : r.supplier.toLowerCase().trim() !== supp.toLowerCase().trim()
    );
    if (hasDifferentSupplier) {
      toast.error(
        "You can select fabric estimation items from only one supplier per booking. Please select items from the same supplier."
      );
      return;
    }

    const hasFullyBooked = selectedRows.some(
      (r) =>
        r.bookingStatus === "Fully Booked" ||
        (r.requiredQty > 0 && r.bookQty >= r.requiredQty)
    );
    if (hasFullyBooked) {
      toast.error("Validation Error: One or more selected items are already fully booked.");
      return;
    }

    const transferPayload = {
      isMultiItem: true,
      supplier: supp,
      supplierId: suppId,
      jobId: selectedRows[0].jobId,
      style: selectedRows[0].style,
      buyer: selectedRows[0].buyer,
      items: selectedRows.map((r) => ({
        jobId: r.jobId,
        orderId: r.orderId,
        buyer: r.buyer,
        style: r.style,
        fabricEstimationId: r.estimationId,
        fabricEstimationItemId: r.rowId,
        fabricCode: r.rawRow.code || r.rawRow.fabricNo,
        fabricDescription: r.fabricDescription,
        width: r.width,
        usedPlace: r.usedPlace,
        fabricColor: r.fabricColor,
        requiredQuantity: r.requiredQty,
        remainingQuantity: Math.max(0, r.requiredQty - r.bookQty),
        unit: r.unit,
        rate: r.estRate,
        estimatedFabricValue: r.estValue,
        supplier: r.supplier,
        supplierId: r.supplierId,
        colorMappings: r.rawRow.colorMappings || [],
        singleColorName: r.rawRow.singleColorName,
        colorType: r.rawRow.colorType,
        consum: r.consumption,
        wPct: r.wastagePct,
        per: r.rawRow.per,
      })),
    };

    try {
      sessionStorage.setItem("cripton_mm_fabric_booking_transfer_v1", JSON.stringify(transferPayload));
      localStorage.setItem("cripton_mm_fabric_booking_transfer_v1", JSON.stringify(transferPayload));
    } catch (e) {
      console.error("Failed to stage fabric booking transfer payload:", e);
    }

    toast.success(
      `Opening Fabric Booking for ${selectedRows.length} item(s) from "${supp}"...`
    );

    navigate({
      to: "/mm-fabric-booking",
      search: {
        source: "estimation_multi",
        jobId: selectedRows[0].jobId,
        supplier: supp,
        rowIds: selectedRows.map((r) => r.rowId).join(","),
      } as any,
    });
  };

  // Single-Row Booking Action
  const handleInitiateBooking = (row: FabricEstimationRegisterRow) => {
    if (row.hasActualBooking) {
      handleViewBooking(row);
      return;
    }

    if (
      row.bookingStatus === "Fully Booked" ||
      (row.requiredQty > 0 && row.bookQty >= row.requiredQty)
    ) {
      toast.warning(`Item "${row.fabricItem}" is already fully booked (${row.bookNo}).`);
      return;
    }

    setSelectedRowIds([row.rowId]);
    setSelectedSupplier(row.supplier);

    const est = row.rawEstimation;
    const item = row.rawRow;

    const transferPayload = {
      isMultiItem: true,
      supplier: row.supplier,
      supplierId: row.supplierId,
      jobId: row.jobId,
      style: row.style,
      buyer: row.buyer,
      items: [
        {
          jobId: est.ourRef || est.jobNo,
          orderId: est.orderId,
          buyer: est.buyer,
          style: est.style,
          fabricEstimationId: est.id,
          fabricEstimationItemId: item.id,
          fabricCode: item.code || item.fabricNo,
          fabricDescription: item.fabricDescription,
          width: item.width,
          usedPlace: item.usedPlace,
          fabricColor:
            item.singleColorName ||
            (item.colorMappings && item.colorMappings[0]?.itemColor) ||
            "Solid DTM",
          requiredQuantity: item.requireQty,
          remainingQuantity: Math.max(0, (item.requireQty || 0) - row.bookQty),
          unit: item.unit || item.sku || "Kg",
          rate: item.rate,
          estimatedFabricValue: (item.requireQty || 0) * (item.rate || 0),
          supplier: item.supplier,
          supplierId: item.supplierId,
          orderQuantity: est.quantity,
          colorMappings: item.colorMappings || [],
          singleColorName: item.singleColorName,
          colorType: item.colorType,
          consum: item.consum,
          wPct: item.wPct,
          per: item.per,
        },
      ],
    };

    try {
      sessionStorage.setItem("cripton_mm_fabric_booking_transfer_v1", JSON.stringify(transferPayload));
      localStorage.setItem("cripton_mm_fabric_booking_transfer_v1", JSON.stringify(transferPayload));
    } catch (e) {
      console.error("Failed to stage booking transfer payload:", e);
    }

    toast.success(
      `Initiating Fabric Booking for ${item.budgetItemName || item.fabricNo} (Supplier: ${item.supplier})...`
    );

    navigate({
      to: "/mm-fabric-booking",
      search: {
        source: "estimation",
        jobId: est.ourRef || est.jobNo,
        supplier: row.supplier,
        rowId: item.id,
        rowIds: item.id,
      } as any,
    });
  };

  // ── ORIGINAL COLOR DETAIL "D" MODAL HANDLERS (Section 2) ───────────────────
  const handleOpenColorModal = (row: FabricEstimationRegisterRow) => {
    setActiveColorModalRow(row);
    const raw = row.rawRow;
    setModalColorType(raw.colorType || "DTM");
    setModalSingleColor(raw.singleColorName || (raw.colorMappings?.[0]?.itemColor || ""));

    if (raw.colorMappings && raw.colorMappings.length > 0) {
      setModalColorMappings(JSON.parse(JSON.stringify(raw.colorMappings)));
    } else {
      const matchedOrder = orders.find(
        (o) => o.jobNo === row.jobId || o.id === row.orderId || o.orderNo === row.jobId
      );
      const defaultColors: string[] = [];
      if (matchedOrder?.colorWiseBreakdown && matchedOrder.colorWiseBreakdown.length > 0) {
        matchedOrder.colorWiseBreakdown.forEach((cb: any) => {
          const c = cb.color || cb.colorName;
          if (c && !defaultColors.includes(c)) defaultColors.push(c);
        });
      }
      const finalColors =
        defaultColors.length > 0 ? defaultColors : ["Black", "White", "Navy Blue", "Heather Grey"];
      setModalColorMappings(
        finalColors.map((cName, cIdx) => ({
          id: `cm-${Date.now()}-${cIdx}`,
          garmentsColor: cName,
          itemColor: raw.singleColorName || cName,
        }))
      );
    }
  };

  const handleApplySingleColorP = () => {
    if (!modalSingleColor.trim()) {
      toast.warning("Please enter a color name before clicking P.");
      return;
    }
    setModalColorMappings((prev) =>
      prev.map((cm) => ({
        ...cm,
        itemColor: modalSingleColor.trim(),
      }))
    );
    toast.success(`Applied "${modalSingleColor.trim()}" across all garment color rows.`);
  };

  const handleAddColorMappingRow = () => {
    setModalColorMappings((prev) => [
      ...prev,
      {
        id: `cm-${Date.now()}-${prev.length + 1}`,
        garmentsColor: "Navy Blue",
        itemColor: modalSingleColor || "Navy Blue",
      },
    ]);
  };

  const handleRemoveColorMappingRow = (idx: number) => {
    setModalColorMappings((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleImportColorsFromOrder = () => {
    if (!activeColorModalRow) return;
    const matchedOrder = orders.find(
      (o) =>
        o.jobNo === activeColorModalRow.jobId ||
        o.id === activeColorModalRow.orderId ||
        o.orderNo === activeColorModalRow.jobId
    );
    const extractedColors: string[] = [];
    if (matchedOrder?.colorWiseBreakdown && matchedOrder.colorWiseBreakdown.length > 0) {
      matchedOrder.colorWiseBreakdown.forEach((cb: any) => {
        const c = cb.color || cb.colorName;
        if (c && !extractedColors.includes(c)) extractedColors.push(c);
      });
    }
    const orderColors =
      extractedColors.length > 0
        ? extractedColors
        : ["Black", "White", "Navy Blue", "Heather Grey", "Olive Green"];

    setModalColorMappings(
      orderColors.map((c, i) => ({
        id: `cm-imp-${Date.now()}-${i + 1}`,
        garmentsColor: c,
        itemColor: modalSingleColor || c,
      }))
    );
    toast.success(`Imported ${orderColors.length} garment colors from order breakdown.`);
  };

  const handleSaveColorModal = () => {
    if (!activeColorModalRow) return;
    try {
      const est = activeColorModalRow.rawEstimation;
      const updatedRows = (est.fabricRows || []).map((r) => {
        if (r.id === activeColorModalRow.rowId) {
          return {
            ...r,
            colorType: modalColorType,
            singleColorName: modalColorType === "Single Color" ? modalSingleColor : undefined,
            colorMappings: JSON.parse(JSON.stringify(modalColorMappings)),
          };
        }
        return r;
      });
      const updatedEst: MMFabricEstimationRecord = {
        ...est,
        fabricRows: updatedRows,
        updatedAt: new Date().toISOString(),
      };
      MMRepository.saveFabricEstimation(updatedEst);
      reloadData();
      setActiveColorModalRow(null);
      toast.success(`Color mappings updated for ${activeColorModalRow.fabricItem}.`);
    } catch (err) {
      console.error("Failed to save color mappings:", err);
      toast.error("Failed to save color mappings.");
    }
  };

  // Action: Open Estimation Form for viewing / editing
  const handleOpenEstimation = (row: FabricEstimationRegisterRow) => {
    toast.info(`Opening Fabric Estimation for ${row.jobId} (${row.style})...`);
    navigate({
      to: "/mm-order-entry",
      search: {
        tab: "fabric-estimation",
        jobId: row.jobId,
        ref: row.jobId,
        from: "register",
      } as any,
    });
  };

  // Action: View Saved Fabric Booking
  const handleViewBooking = (row: FabricEstimationRegisterRow) => {
    const bookingIdentifier = row.actualBookingId || row.actualBookingNo || (row.bookNo !== "-" ? row.bookNo : "");
    if (!bookingIdentifier) {
      toast.error("No saved Fabric Booking found for this estimation item.");
      return;
    }
    toast.info(`Opening saved Fabric Booking (${bookingIdentifier})...`);
    navigate({
      to: "/mm-fabric-booking",
      search: {
        bookingId: bookingIdentifier,
      } as any,
    });
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredRows.length === 0) {
      toast.error("No records to export.");
      return;
    }

    const headers = [
      "SL",
      "Buyer",
      "Job ID",
      "Style",
      "Merchant",
      "GMT Item",
      "Order Qty",
      "Fabric Item",
      "Used Place",
      "Fabric Description",
      "Supplier",
      "Consumption",
      "Unit",
      "Wastage %",
      "Required Qty",
      "Est. Rate",
      "Est. Value",
      "Width",
      "Fabric Color",
      "Book No",
      "Book Qty",
      "Book Value",
      "Booking Status",
    ];

    const csvLines = [headers.join(",")];
    filteredRows.forEach((r, idx) => {
      const line = [
        idx + 1,
        `"${r.buyer.replace(/"/g, '""')}"`,
        `"${r.jobId}"`,
        `"${r.style.replace(/"/g, '""')}"`,
        `"${r.merchant.replace(/"/g, '""')}"`,
        `"${r.gmtItem.replace(/"/g, '""')}"`,
        r.orderQty,
        `"${r.fabricItem.replace(/"/g, '""')}"`,
        `"${r.usedPlace.replace(/"/g, '""')}"`,
        `"${r.fabricDescription.replace(/"/g, '""')}"`,
        `"${r.supplier.replace(/"/g, '""')}"`,
        r.consumption,
        `"${r.unit}"`,
        r.wastagePct,
        r.requiredQty,
        r.estRate,
        r.estValue.toFixed(2),
        `"${r.width}"`,
        `"${r.fabricColor.replace(/"/g, '""')}"`,
        `"${r.bookNo}"`,
        r.bookQty,
        r.bookValue.toFixed(2),
        `"${r.bookingStatus}"`,
      ];
      csvLines.push(line.join(","));
    });

    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Fabric_Estimation_Register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Fabric Estimation Register exported successfully.");
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-fabric-estimation-register"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Confirm Order Entry", to: "/mm-order-entry" },
        { label: "Fabric Estimation Register" },
      ]}
      title="Fabric Estimation Register"
      subtitle="Complete view of all saved fabric estimation items with supplier-based booking tracking and allocation status"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/mm-order-entry" })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Confirm Order Entry</span>
          </button>
        </div>
      }
    >
      <div className="space-y-4 pb-12">
        {/* ── TOP CONTROLS: BOOKING STATUS TABS & SELECTION BANNER (Section 4 & 5) ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 shadow-xs">
          {/* Segmented Booking Status Tabs (Section 4) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setBookingStatusTab("All");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                bookingStatusTab === "All"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>All</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {tabCounts.total}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setBookingStatusTab("Booked");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                bookingStatusTab === "Booked"
                  ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Booked</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                {tabCounts.booked}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setBookingStatusTab("Not Booked");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                bookingStatusTab === "Not Booked"
                  ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Not Booked</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                {tabCounts.notBooked}
              </span>
            </button>
          </div>

          {/* Multi-Selection Status & Supplier Lock Banner (Section 5) */}
          <div className="flex items-center gap-2 flex-wrap">
            {selectedRowIds.length > 0 ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-xs">
                <span className="font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-teal-600" />
                  <span>{selectedRowIds.length} item(s) selected</span>
                </span>
                <span className="text-slate-400 dark:text-slate-500">|</span>
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  <strong>Supplier:</strong> {selectedSupplier}
                </span>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="ml-2 px-2 py-0.5 rounded bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600 text-[11px] font-bold border border-rose-200 dark:border-rose-800 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Clear Selection</span>
                </button>
                <button
                  type="button"
                  onClick={handleCreateFabricBooking}
                  className="ml-1 px-3 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold transition-all flex items-center gap-1 shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Create Fabric Booking</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllEligible}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
                  <span>Select All Eligible</span>
                </button>
                <span className="text-[11px] text-slate-400">
                  Select eligible items to create combined bookings from one supplier
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── FILTER TOOLBAR & CONTROLS ───────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-teal-600" />
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Searchable Register Filters
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                {filteredRows.length} of {registerRows.length} records
              </span>
            </div>

            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* 8 Multi-Field Search Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {/* 1. Buyer */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Buyer</label>
              <select
                value={filterBuyer}
                onChange={(e) => {
                  setFilterBuyer(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-8 px-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">All Buyers</option>
                {filterOptions.buyers.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Job ID / Our Ref */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Job ID / Ref</label>
              <select
                value={filterJobId}
                onChange={(e) => {
                  setFilterJobId(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-8 px-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">All Job IDs</option>
                {filterOptions.jobIds.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Style */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Style</label>
              <select
                value={filterStyle}
                onChange={(e) => {
                  setFilterStyle(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-8 px-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">All Styles</option>
                {filterOptions.styles.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Merchant */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Merchant</label>
              <select
                value={filterMerchant}
                onChange={(e) => {
                  setFilterMerchant(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-8 px-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">All Merchants</option>
                {filterOptions.merchants.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. GMT Item */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">GMT Item</label>
              <select
                value={filterGmtItem}
                onChange={(e) => {
                  setFilterGmtItem(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-8 px-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">All GMT Items</option>
                {filterOptions.gmtItems.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Fabric Item */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Fabric Item</label>
              <select
                value={filterFabricItem}
                onChange={(e) => {
                  setFilterFabricItem(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-8 px-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">All Fabric Items</option>
                {filterOptions.fabricItems.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* 7. Supplier */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Supplier</label>
              <select
                value={filterSupplier}
                onChange={(e) => {
                  setFilterSupplier(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-8 px-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">All Suppliers</option>
                {filterOptions.suppliers.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* 8. Booking Status Dropdown */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Booking Status</label>
              <select
                value={filterBookingStatus}
                onChange={(e) => {
                  setFilterBookingStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-8 px-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold"
              >
                <option value="">All Statuses</option>
                {filterOptions.bookingStatuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick text search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by keywords across Buyer, Job ID, Fabric Description, Color, Booking No..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-8.5 pl-8 pr-3 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* ── REGISTER TABLE CONTAINER (No serial prefixes on headers, Section 1 & 2) ── */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-left border-collapse min-w-[2200px]">
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  {/* Selection Checkbox Header (Section 5) */}
                  <th className="py-2.5 px-3 text-center w-12 sticky left-0 z-20 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={handleSelectAllEligible}
                      title="Select all eligible items"
                      className="p-1 hover:text-teal-600 transition-colors"
                    >
                      {selectedRowIds.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-teal-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </th>
                  {/* SL Column (Preserved, Section 1) */}
                  <th className="py-2.5 px-2 text-center w-12 border-r border-slate-200 dark:border-slate-700">
                    SL
                  </th>
                  {/* Clean column headers without serial number prefixes (Section 1) */}
                  <th className="py-2.5 px-3 min-w-[130px]">Buyer</th>
                  <th className="py-2.5 px-3 min-w-[120px]">Job ID</th>
                  <th className="py-2.5 px-3 min-w-[120px]">Style</th>
                  <th className="py-2.5 px-3 min-w-[130px]">Merchant</th>
                  <th className="py-2.5 px-3 min-w-[140px]">GMT Item</th>
                  <th className="py-2.5 px-3 min-w-[90px] text-right">Order Qty</th>
                  <th className="py-2.5 px-3 min-w-[130px]">Fabric Item</th>
                  <th className="py-2.5 px-3 min-w-[110px]">Used Place</th>
                  <th className="py-2.5 px-3 min-w-[180px]">Fabric Description</th>
                  <th className="py-2.5 px-3 min-w-[160px]">Supplier</th>
                  <th className="py-2.5 px-3 min-w-[85px] text-right">Consumption</th>
                  <th className="py-2.5 px-2 min-w-[65px] text-center">Unit</th>
                  <th className="py-2.5 px-2 min-w-[75px] text-right">Wastage %</th>
                  <th className="py-2.5 px-3 min-w-[100px] text-right">Required Qty</th>
                  <th className="py-2.5 px-3 min-w-[85px] text-right">Est. Rate</th>
                  <th className="py-2.5 px-3 min-w-[100px] text-right">Est. Value</th>
                  <th className="py-2.5 px-3 min-w-[85px]">Width</th>
                  {/* Color Detail Column with Original D Button (Section 2) */}
                  <th className="py-2.5 px-3 min-w-[110px] text-center">Color</th>
                  <th className="py-2.5 px-3 min-w-[130px]">Book No</th>
                  <th className="py-2.5 px-3 min-w-[95px] text-right">Book Qty</th>
                  <th className="py-2.5 px-3 min-w-[100px] text-right">Book Value</th>
                  <th className="py-2.5 px-3 min-w-[120px] text-center">Booking Status</th>
                  <th className="py-2.5 px-3 min-w-[150px] text-center sticky right-0 z-20 bg-slate-100 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={25} className="py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-8 h-8 text-slate-400" />
                        <div className="font-semibold text-sm">No matching fabric estimation records found</div>
                        <p className="text-xs text-slate-400 max-w-md">
                          Try adjusting or clearing your search filters to view saved estimation items.
                        </p>
                        {hasActiveFilters && (
                          <button
                            type="button"
                            onClick={handleClearFilters}
                            className="mt-2 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 font-bold text-xs hover:bg-teal-100 transition-colors"
                          >
                            Clear All Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row, idx) => {
                    const slNo = (currentPage - 1) * pageSize + idx + 1;
                    const isSelected = selectedRowIds.includes(row.rowId);
                    const isFullyBooked =
                      row.bookingStatus === "Fully Booked" ||
                      (row.requiredQty > 0 && row.bookQty >= row.requiredQty);
                    const isOtherSupplier = Boolean(
                      selectedSupplier &&
                        (row.supplierId && selectedRows[0]?.supplierId
                          ? row.supplierId !== selectedRows[0]?.supplierId
                          : row.supplier.toLowerCase().trim() !== selectedSupplier.toLowerCase().trim())
                    );
                    const isRowDisabled = isFullyBooked || isOtherSupplier;

                    return (
                      <tr
                        key={row.rowId || idx}
                        className={`transition-colors group ${
                          isSelected
                            ? "bg-teal-50/50 dark:bg-teal-950/30"
                            : "hover:bg-slate-50/70 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        {/* Selection Checkbox (Section 5) */}
                        <td className="py-2 px-3 text-center sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 border-r border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            disabled={isRowDisabled}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleSelectRow(row);
                            }}
                            className={`p-1 rounded transition-colors ${
                              isRowDisabled
                                ? "cursor-not-allowed opacity-40 text-slate-300 dark:text-slate-700"
                                : isSelected
                                ? "text-teal-600 hover:text-teal-700 cursor-pointer"
                                : "text-slate-400 hover:text-slate-600 cursor-pointer"
                            }`}
                            title={
                              isFullyBooked
                                ? "This fabric item is already fully booked."
                                : isOtherSupplier
                                ? `Supplier mismatch: only items from "${selectedSupplier}" can be selected for this booking.`
                                : isSelected
                                ? "Deselect item"
                                : "Select item for combined Fabric Booking"
                            }
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-teal-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* SL Column */}
                        <td className="py-2 px-2 text-center text-slate-400 font-mono text-[11px] border-r border-slate-100 dark:border-slate-800">
                          {slNo}
                        </td>

                        {/* Buyer */}
                        <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                          {row.buyer}
                        </td>

                        {/* Job ID */}
                        <td className="py-2 px-3">
                          <span className="font-mono font-bold text-teal-700 dark:text-teal-400">
                            {row.jobId}
                          </span>
                        </td>

                        {/* Style */}
                        <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-100">
                          {row.style}
                        </td>

                        {/* Merchant */}
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                          {row.merchant}
                        </td>

                        {/* GMT Item */}
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-300 truncate max-w-[150px]">
                          {row.gmtItem}
                        </td>

                        {/* Order Qty */}
                        <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                          {row.orderQty.toLocaleString()}
                        </td>

                        {/* Fabric Item */}
                        <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">
                          {row.fabricItem}
                        </td>

                        {/* Used Place */}
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 font-medium">
                            {row.usedPlace}
                          </span>
                        </td>

                        {/* Fabric Description */}
                        <td className="py-2 px-3 text-slate-700 dark:text-slate-200 truncate max-w-[200px]" title={row.fabricDescription}>
                          {row.fabricDescription}
                        </td>

                        {/* Supplier */}
                        <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3 h-3 text-teal-600 shrink-0" />
                            <span className="truncate">{row.supplier}</span>
                          </div>
                        </td>

                        {/* Consumption */}
                        <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                          {row.consumption.toFixed(4)}
                        </td>

                        {/* Unit */}
                        <td className="py-2 px-2 text-center text-slate-500 font-medium">
                          {row.unit}
                        </td>

                        {/* Wastage % */}
                        <td className="py-2 px-2 text-right font-mono text-slate-600 dark:text-slate-400">
                          {row.wastagePct}%
                        </td>

                        {/* Required Qty */}
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                          {row.requiredQty.toLocaleString()}
                        </td>

                        {/* Est. Rate */}
                        <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                          ${row.estRate.toFixed(2)}
                        </td>

                        {/* Est. Value */}
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                          ${row.estValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Width */}
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400 text-xs">
                          {row.width}
                        </td>

                        {/* Color (Section 2: Original D Button) */}
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenColorModal(row)}
                            className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/60 dark:hover:bg-purple-800 dark:text-purple-200 font-bold rounded text-[11px] border border-purple-300 dark:border-purple-700 shadow-xs inline-flex items-center gap-1 cursor-pointer transition-colors"
                            title={`Fabric Color Details (${row.rawRow.colorMappings?.length || (row.rawRow.singleColorName ? 1 : 0)})`}
                          >
                            <span>D</span>
                            <span className="text-[10px] opacity-85">
                              ({row.rawRow.colorMappings?.length || (row.rawRow.singleColorName ? 1 : 0)})
                            </span>
                          </button>
                        </td>

                        {/* Book No */}
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                          {row.bookNo !== "-" ? (
                            <span className="font-bold text-blue-600 dark:text-blue-400">{row.bookNo}</span>
                          ) : (
                            <span className="text-slate-400 italic">—</span>
                          )}
                        </td>

                        {/* Book Qty */}
                        <td className="py-2 px-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {row.bookQty > 0 ? row.bookQty.toLocaleString() : "—"}
                        </td>

                        {/* Book Value */}
                        <td className="py-2 px-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {row.bookValue > 0
                            ? `$${row.bookValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : "—"}
                        </td>

                        {/* Booking Status */}
                        <td className="py-2 px-3 text-center">
                          {row.bookingStatus === "Fully Booked" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3" />
                              Fully Booked
                            </span>
                          )}
                          {row.bookingStatus === "Partially Booked" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              <Clock className="w-3 h-3" />
                              Partially Booked
                            </span>
                          )}
                          {row.bookingStatus === "Pending Approval" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              <Clock className="w-3 h-3" />
                              Pending Approval
                            </span>
                          )}
                          {row.bookingStatus === "Not Booked" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              Not Booked
                            </span>
                          )}
                        </td>

                        {/* Actions (Sticky Right) */}
                        <td className="py-2 px-3 text-center sticky right-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 border-l border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEstimation(row)}
                              title="View / Edit Estimation Record"
                              className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold transition-colors flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                              <span>View</span>
                            </button>
                            {row.hasActualBooking ? (
                              <button
                                type="button"
                                onClick={() => handleViewBooking(row)}
                                title={`View saved Fabric Booking (${row.actualBookingNo || row.bookNo})`}
                                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-850 text-[11px] font-bold transition-colors flex items-center gap-1 shadow-xs"
                              >
                                <Eye className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                                <span>View Booking</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleInitiateBooking(row)}
                                title={`Create Fabric Booking with locked supplier: ${row.supplier}`}
                                className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold transition-colors flex items-center gap-1 shadow-xs"
                              >
                                <Scissors className="w-3 h-3" />
                                <span>Booking</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center gap-2 text-slate-500">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-7 px-2 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>
                Showing {filteredRows.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                {Math.min(currentPage * pageSize, filteredRows.length)} of {filteredRows.length} items
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── FLOATING SELECTION BAR (When multiple items selected) ────────── */}
        {selectedRows.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-4 animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                {selectedRows.length}
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-100">{selectedRows.length} Items Selected</span>
                <span className="text-slate-400 block text-[10px]">
                  Supplier: <strong className="text-teal-300">{selectedSupplier}</strong>
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-700" />

            <div className="text-right text-xs hidden sm:block">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Total Req Qty</div>
              <div className="font-mono font-bold text-teal-400">
                {selectedRows.reduce((acc, r) => acc + r.requiredQty, 0).toLocaleString()} Kg
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearSelection}
                className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleCreateFabricBooking}
                className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Create Fabric Booking ({selectedRows.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* ── ORIGINAL COLOR DETAIL "D" MODAL (Section 2) ─────────────────── */}
        {activeColorModalRow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-teal-600" />
                    <span>Fabric Color Details Specification</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Row: <strong className="text-teal-700 dark:text-teal-300">{activeColorModalRow.rawRow.fabricNo || "Fabric"}</strong> ({activeColorModalRow.fabricItem}) | Job ID: <strong className="text-slate-700 dark:text-slate-300">{activeColorModalRow.jobId}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveColorModalRow(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Reference Information Summary */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Buyer</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{activeColorModalRow.buyer}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Job ID</span>
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400 truncate block">{activeColorModalRow.jobId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Style</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{activeColorModalRow.style}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Used Place</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{activeColorModalRow.usedPlace}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Code</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate block">{activeColorModalRow.rawRow.code || "-"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Fabric Description</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate block" title={activeColorModalRow.fabricDescription}>
                    {activeColorModalRow.fabricDescription}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Width</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">{activeColorModalRow.width}</span>
                </div>
              </div>

              {/* Color Type Selector & Single Color Entry */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/60">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <label className="font-bold text-teal-900 dark:text-teal-200">Color Type:</label>
                    <select
                      value={modalColorType}
                      onChange={(e) => setModalColorType(e.target.value as "DTM" | "Contrast" | "Single Color")}
                      className="p-1.5 px-3 rounded-lg border border-teal-300 dark:border-teal-800 bg-white dark:bg-slate-800 text-xs font-bold text-teal-800 dark:text-teal-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="DTM">DTM (Dye-To-Match)</option>
                      <option value="Contrast">Contrast</option>
                      <option value="Single Color">Single Color</option>
                    </select>
                  </div>

                  {/* Single Color: Color Name & P Button */}
                  {modalColorType === "Single Color" && (
                    <div className="flex items-center gap-2 animate-in fade-in">
                      <label className="font-bold text-teal-900 dark:text-teal-200">Color Name:</label>
                      <input
                        type="text"
                        value={modalSingleColor}
                        onChange={(e) => setModalSingleColor(e.target.value)}
                        placeholder="e.g. Navy Blue"
                        className="p-1.5 px-3 rounded-lg border border-teal-300 dark:border-teal-800 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 w-36 sm:w-44 focus:ring-1 focus:ring-teal-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplySingleColorP}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-mono font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
                        title="Click P to populate Item Color with this uniform color name"
                      >
                        P
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleImportColorsFromOrder}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-teal-500" />
                    <span>Import Order Breakdown Colors</span>
                  </button>
                </div>
              </div>

              {/* Garments Color and Item Color Mapping Grid (2-column editable table) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Garments Color &amp; Fabric Item Color Mapping
                  </h4>
                  <span className="text-[11px] text-slate-400">{modalColorMappings.length} Mappings Configured</span>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[11px] font-bold border-b border-slate-200 dark:border-slate-700 sticky top-0">
                      <tr>
                        <th className="py-2 px-3 w-12 text-center">SL</th>
                        <th className="py-2 px-3">Garments Color</th>
                        <th className="py-2 px-3">Item Color</th>
                        <th className="py-2 px-3 w-16 text-center">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {modalColorMappings.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-xs text-slate-400">
                            No color mappings configured yet. Click &quot;Import Order Breakdown Colors&quot;.
                          </td>
                        </tr>
                      ) : (
                        modalColorMappings.map((cm, idx) => (
                          <tr key={cm.id || idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                            <td className="py-2 px-3 text-center font-mono text-slate-400 text-[11px]">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={cm.garmentsColor}
                                readOnly
                                placeholder="Garment color"
                                className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-not-allowed select-none"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={cm.itemColor}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setModalColorMappings((prev) =>
                                    prev.map((c, i) => (i === idx ? { ...c, itemColor: val } : c))
                                  );
                                }}
                                placeholder="Corresponding fabric item color"
                                className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-1 focus:ring-teal-500"
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveColorMappingRow(idx)}
                                className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                                title="Remove Color Mapping"
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

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveColorModalRow(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveColorModal}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply &amp; Save Color Mappings</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketingMerchandisingLayout>
  );
}
