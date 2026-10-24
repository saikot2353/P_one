import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMAccessoriesEstimationRecord,
  MMAccessoriesEstimationRow,
  MMAccessoriesBooking,
  MMMainOrder,
  MMAccessoriesSizeSpecRow,
  MMAccessoriesColorMappingRow,
} from "../lib/marketing-merchandising-data";
import {
  Package,
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
  Building2,
  Tag,
  CheckSquare,
  Square,
  X,
  ArrowRight,
  ShieldAlert,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mm-accessories-estimation-register")({
  head: () => ({
    meta: [
      { title: "Accessories Estimation Register — Marketing & Merchandising | CriptonHRIS" },
      {
        name: "description",
        content: "Complete register of all saved accessories estimation items with size/color specifications, booking tracking, and same-supplier multi-item booking.",
      },
    ],
  }),
  component: MMAccessoriesEstimationRegisterPage,
});

export interface AccessoriesEstimationRegisterRow {
  rowId: string;
  estimationId: string;
  orderId: string;
  // Parent Order Context
  buyer: string;
  jobId: string;
  style: string;
  merchant: string;
  gmtItem: string;
  orderQty: number;
  // Accessories Item Details
  item: string;
  usedPlace: string;
  description: string;
  supplier: string;
  consumption: number;
  conUnit: string;
  wastagePct: number;
  requiredQty: number;
  estRate: number;
  estValue: number;
  size: string;
  sizeTooltip: string;
  color: string;
  colorTooltip: string;
  // Booking Information
  bookNo: string;
  bookQty: number;
  bookValue: number;
  bookingStatus: "Not Booked" | "Partially Booked" | "Fully Booked" | "Pending Approval";
  isBooked: boolean;
  // Underlying record refs
  rawRow: MMAccessoriesEstimationRow;
  rawEstimation: MMAccessoriesEstimationRecord;
}

export function MMAccessoriesEstimationRegisterPage() {
  const navigate = useNavigate();

  // Primary Data States
  const [estimations, setEstimations] = useState<MMAccessoriesEstimationRecord[]>([]);
  const [orders, setOrders] = useState<MMMainOrder[]>([]);
  const [accessoriesBookings, setAccessoriesBookings] = useState<MMAccessoriesBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking Status Segmented Filter: "All" | "Booked" | "Not Booked" (Section 6)
  const [bookingStatusTab, setBookingStatusTab] = useState<"All" | "Booked" | "Not Booked">("All");

  // Multi-Item Selection State (Section 7 & 8)
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  // Search & Filter State
  const [filterBuyer, setFilterBuyer] = useState("");
  const [filterJobId, setFilterJobId] = useState("");
  const [filterStyle, setFilterStyle] = useState("");
  const [filterMerchant, setFilterMerchant] = useState("");
  const [filterGmtItem, setFilterGmtItem] = useState("");
  const [filterItem, setFilterItem] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Size "D" Modal State (Issue 1: Original Size Detail Modal)
  const [activeSizeModalRow, setActiveSizeModalRow] = useState<AccessoriesEstimationRegisterRow | null>(null);
  const [sizeFactType, setSizeFactType] = useState<"SAME AS GMT SIZE" | "SINGLE SIZE">("SAME AS GMT SIZE");
  const [singleSizeSpec, setSingleSizeSpec] = useState<string>("");
  const [sizeRows, setSizeRows] = useState<MMAccessoriesSizeSpecRow[]>([]);

  // Color "D" Modal State (Issue 1: Original Color Detail Modal)
  const [activeColorModalRow, setActiveColorModalRow] = useState<AccessoriesEstimationRegisterRow | null>(null);
  const [colorType, setColorType] = useState<"DTM" | "Contrast" | "Single Color">("DTM");
  const [singleColorInput, setSingleColorInput] = useState<string>("");
  const [colorMappings, setColorMappings] = useState<MMAccessoriesColorMappingRow[]>([]);

  // Load data from LocalStorage via MMRepository
  const reloadData = () => {
    try {
      setLoading(true);
      const loadedEsts = MMRepository.getAccessoriesEstimations();
      const loadedOrders = MMRepository.getOrders();
      const loadedBookings = MMRepository.getAccessoriesBookings();
      setEstimations(loadedEsts);
      setOrders(loadedOrders);
      setAccessoriesBookings(loadedBookings);
    } catch (err) {
      console.error("Failed to load accessories estimation register data:", err);
      toast.error("Failed to load accessories estimation records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Transform accessories estimation items into flat register rows
  const registerRows = useMemo<AccessoriesEstimationRegisterRow[]>(() => {
    const rows: AccessoriesEstimationRegisterRow[] = [];

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

      if (!est.accessoriesRows || est.accessoriesRows.length === 0) return;

      est.accessoriesRows.forEach((item) => {
        // Find matching bookings for this specific estimation item
        const matchingBookings: { bookingNo: string; bookingId: string; qty: number; value: number; status: string }[] = [];

        accessoriesBookings.forEach((ab) => {
          let lineBookedQty = 0;
          let lineBookedValue = 0;
          let hasMatch = false;

          // 1. Check direct bookingRef match if verified against this saved booking
          if (item.bookingRef && (ab.bookingNo === item.bookingRef || ab.id === item.bookingRef)) {
            const matchesJob = !(ab as any).jobNo || (ab as any).jobNo === est.jobNo || (ab as any).jobNo === est.ourRef;
            const containsItem =
              (ab.items && ab.items.some((it) => it.estimationItemId === item.id || (matchesJob && it.itemDescription === item.description))) ||
              (ab.lines && ab.lines.some((l) => (l as any).estimationItemId === item.id || l.id === item.id || (matchesJob && l.accessoryItem?.toLowerCase().trim() === item.itemName?.toLowerCase().trim())));
            if (containsItem) {
              hasMatch = true;
              const bQty = item.marketQty || 0;
              lineBookedQty += bQty;
              lineBookedValue += item.amount || bQty * (item.unitRate || 0);
            }
          }

          // 2. Check item matching in booking items by exact item ID
          if (ab.items && ab.items.length > 0) {
            ab.items.forEach((it) => {
              if (it.estimationItemId === item.id) {
                hasMatch = true;
                const bQty = Number(it.bookedQty) || 0;
                lineBookedQty += bQty;
                lineBookedValue += Number(it.totalAmount) || bQty * (it.bookedRate || item.unitRate || 0);
              }
            });
          }

          // 3. Check booking line match by exact estimation item ID
          if (ab.lines && ab.lines.length > 0) {
            ab.lines.forEach((l) => {
              if ((l as any).estimationItemId === item.id || l.id === item.id) {
                hasMatch = true;
                const bQty = Number(l.bookAmt) || 0;
                lineBookedQty += bQty;
                lineBookedValue += bQty * (item.unitRate || 1);
              }
            });
          }

          if (hasMatch) {
            matchingBookings.push({
              bookingNo: ab.bookingNo,
              bookingId: ab.id,
              qty: lineBookedQty,
              value: lineBookedValue,
              status: ab.status,
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

        const requiredQty = Number(item.marketQty) || 0;
        if (matchingBookings.length === 0 || bookingNumbers.length === 0) {
          derivedStatus = "Not Booked";
        } else if (hasPending && !matchingBookings.some((b) => b.status === "Approved")) {
          derivedStatus = "Pending Approval";
        } else if (requiredQty > 0 && totalBookedQty >= requiredQty) {
          derivedStatus = "Fully Booked";
        } else if (totalBookedQty > 0) {
          derivedStatus = "Partially Booked";
        } else {
          derivedStatus = "Fully Booked";
        }

        const isBooked = derivedStatus !== "Not Booked";

        // Size Formatting (Section 3.1)
        let sizeDisplay = "";
        let sizeTooltip = "";
        if (item.singleSizeSpec && item.sizeFactType === "SINGLE SIZE") {
          sizeDisplay = item.singleSizeSpec;
          sizeTooltip = `Single Size Spec: ${item.singleSizeSpec}`;
        } else if (item.sizeRows && item.sizeRows.length > 0) {
          const specs = Array.from(new Set(item.sizeRows.map((s) => s.itemSpecification).filter(Boolean)));
          if (specs.length === 1) {
            sizeDisplay = `${specs[0]} (${item.sizeRows.map((s) => s.gmtSize).join(", ")})`;
          } else if (specs.length > 1) {
            sizeDisplay = item.sizeRows.map((s) => `${s.gmtSize}: ${s.itemSpecification || s.gmtSize}`).join(", ");
          } else {
            sizeDisplay = item.singleSizeSpec || item.sizeFactType || item.sizeRows.map((s) => s.gmtSize).join(", ");
          }
          sizeTooltip = item.sizeRows.map((s) => `${s.gmtSize} → ${s.itemSpecification || "Standard"}`).join(" | ");
        } else if (item.singleSizeSpec) {
          sizeDisplay = item.singleSizeSpec;
          sizeTooltip = item.singleSizeSpec;
        } else {
          sizeDisplay = item.sizeFactType || "—";
          sizeTooltip = sizeDisplay;
        }

        // Color Formatting (Section 3.2)
        let colorDisplay = "";
        let colorTooltip = "";
        if (item.colorMappings && item.colorMappings.length > 0) {
          colorDisplay = item.colorMappings.map((c) => `${c.garmentsColor}: ${c.itemColor}`).join(", ");
          colorTooltip = item.colorMappings.map((c) => `${c.garmentsColor} → ${c.itemColor}`).join(" | ");
        } else if (item.singleColorName) {
          colorDisplay = item.singleColorName;
          colorTooltip = `Single Color: ${item.singleColorName}`;
        } else if (item.colorType) {
          colorDisplay = item.colorType;
          colorTooltip = `Color Type: ${item.colorType}`;
        } else {
          colorDisplay = "—";
          colorTooltip = "—";
        }

        const estVal =
          item.amount ||
          (Number(item.marketQty || 0) * Number(item.unitRate || 0)) ||
          0;

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
          item: item.itemName || item.budgetItemName || "Accessory",
          usedPlace: item.usedPlace || "-",
          description: item.description || "-",
          supplier: item.supplier || "ABC Accessories Ltd.",
          consumption: Number(item.consumptionQtyPerPc || 0),
          conUnit: item.consumptionUnit || "Pcs",
          wastagePct: Number(item.wastagePct ?? 0),
          requiredQty: Number(item.marketQty || 0),
          estRate: Number(item.unitRate || 0),
          estValue: Number(estVal),
          size: sizeDisplay,
          sizeTooltip: sizeTooltip,
          color: colorDisplay,
          colorTooltip: colorTooltip,
          bookNo: bookingNumbers.length > 0 ? bookingNumbers.join(", ") : "—",
          bookQty: isBooked ? totalBookedQty : 0,
          bookValue: isBooked ? totalBookedValue : 0,
          bookingStatus: derivedStatus,
          isBooked: isBooked,
          rawRow: item,
          rawEstimation: est,
        });
      });
    });

    return rows;
  }, [estimations, orders, accessoriesBookings]);

  // Counts for Segmented Tabs (Section 6)
  const tabCounts = useMemo(() => {
    const total = registerRows.length;
    const booked = registerRows.filter((r) => r.isBooked).length;
    const notBooked = total - booked;
    return { total, booked, notBooked };
  }, [registerRows]);

  // Dynamic filter options extracted from actual loaded data
  const filterOptions = useMemo(() => {
    return {
      buyers: Array.from(new Set(registerRows.map((r) => r.buyer))).filter((x) => x && x !== "-").sort(),
      jobIds: Array.from(new Set(registerRows.map((r) => r.jobId))).filter((x) => x && x !== "-").sort(),
      styles: Array.from(new Set(registerRows.map((r) => r.style))).filter((x) => x && x !== "-").sort(),
      merchants: Array.from(new Set(registerRows.map((r) => r.merchant))).filter((x) => x && x !== "-").sort(),
      gmtItems: Array.from(new Set(registerRows.map((r) => r.gmtItem))).filter((x) => x && x !== "-").sort(),
      items: Array.from(new Set(registerRows.map((r) => r.item))).filter((x) => x && x !== "-").sort(),
      suppliers: Array.from(new Set(registerRows.map((r) => r.supplier))).filter((x) => x && x !== "-").sort(),
    };
  }, [registerRows]);

  // Multi-Filter AND Matching (incorporates Section 6 Booking Status Tab)
  const filteredRows = useMemo(() => {
    return registerRows.filter((r) => {
      // 1. Booking Status Tab Filter (Section 6)
      if (bookingStatusTab === "Booked" && !r.isBooked) return false;
      if (bookingStatusTab === "Not Booked" && r.isBooked) return false;

      // 2. Dropdown Filters
      if (filterBuyer && r.buyer !== filterBuyer) return false;
      if (filterJobId && r.jobId !== filterJobId) return false;
      if (filterStyle && r.style !== filterStyle) return false;
      if (filterMerchant && r.merchant !== filterMerchant) return false;
      if (filterGmtItem && r.gmtItem !== filterGmtItem) return false;
      if (filterItem && r.item !== filterItem) return false;
      if (filterSupplier && r.supplier !== filterSupplier) return false;

      // 3. Keyword Search
      if (globalSearch) {
        const q = globalSearch.toLowerCase();
        const haystack = [
          r.buyer,
          r.jobId,
          r.style,
          r.merchant,
          r.gmtItem,
          r.item,
          r.description,
          r.supplier,
          r.usedPlace,
          r.size,
          r.color,
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
    filterItem,
    filterSupplier,
    globalSearch,
  ]);

  // Reset all filters
  const handleClearFilters = () => {
    setFilterBuyer("");
    setFilterJobId("");
    setFilterStyle("");
    setFilterMerchant("");
    setFilterGmtItem("");
    setFilterItem("");
    setFilterSupplier("");
    setGlobalSearch("");
    setBookingStatusTab("All");
    setCurrentPage(1);
    toast.info("All register filters have been reset.");
  };

  const hasActiveFilters =
    Boolean(
      bookingStatusTab !== "All" ||
      filterBuyer ||
      filterJobId ||
      filterStyle ||
      filterMerchant ||
      filterGmtItem ||
      filterItem ||
      filterSupplier ||
      globalSearch
    );

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  // Selected Row Objects
  const selectedRows = useMemo(() => {
    return registerRows.filter((r) => selectedRowIds.includes(r.rowId));
  }, [registerRows, selectedRowIds]);

  // Multi-Item Selection Handlers (Section 7 & 8)
  const handleToggleRowSelection = (row: AccessoriesEstimationRegisterRow) => {
    if (row.isBooked) {
      toast.warning(`Item "${row.item}" is already booked (${row.bookNo}) and cannot be selected for a new booking.`);
      return;
    }

    if (selectedRowIds.includes(row.rowId)) {
      // Deselect
      const nextIds = selectedRowIds.filter((id) => id !== row.rowId);
      setSelectedRowIds(nextIds);
      if (nextIds.length === 0) {
        setSelectedSupplier(null);
      }
    } else {
      // Select: Validate Same-Supplier Restriction (Section 7.2)
      if (selectedSupplier && selectedSupplier.toLowerCase().trim() !== row.supplier.toLowerCase().trim()) {
        toast.error(
          `All items in a single booking must belong to the same supplier. Please clear your current selection or select items from "${selectedSupplier}".`,
          { duration: 5000 }
        );
        return;
      }

      setSelectedRowIds((prev) => [...prev, row.rowId]);
      if (!selectedSupplier) {
        setSelectedSupplier(row.supplier);
        toast.info(`Selection locked to supplier: "${row.supplier}".`);
      }
    }
  };

  // Clear Selection Handler (Section 7.3)
  const handleClearSelection = () => {
    setSelectedRowIds([]);
    setSelectedSupplier(null);
    toast.info("Item selection cleared. You may now select items from any supplier.");
  };

  // Select All Handler respecting Same-Supplier Restriction (Section 8)
  const handleSelectAll = () => {
    // Eligible not-booked items within current filtered scope
    const eligibleNotBookedRows = filteredRows.filter((r) => !r.isBooked);

    if (eligibleNotBookedRows.length === 0) {
      toast.warning("No eligible not-booked items available to select in this view.");
      return;
    }

    if (selectedSupplier) {
      // Supplier already selected: select all remaining eligible items for this supplier
      const sameSupplierRows = eligibleNotBookedRows.filter(
        (r) => r.supplier.toLowerCase().trim() === selectedSupplier.toLowerCase().trim()
      );
      const newIds = Array.from(new Set([...selectedRowIds, ...sameSupplierRows.map((r) => r.rowId)]));
      setSelectedRowIds(newIds);
      toast.success(`Selected ${sameSupplierRows.length} eligible items for "${selectedSupplier}".`);
    } else {
      // No supplier currently selected
      const uniqueSuppliers = Array.from(new Set(eligibleNotBookedRows.map((r) => r.supplier)));
      if (uniqueSuppliers.length === 1) {
        // Only one supplier visible
        const targetSupp = uniqueSuppliers[0];
        setSelectedSupplier(targetSupp);
        setSelectedRowIds(eligibleNotBookedRows.map((r) => r.rowId));
        toast.success(`Selected all ${eligibleNotBookedRows.length} items for "${targetSupp}".`);
      } else {
        // Multiple suppliers: select items for the first supplier and inform user
        const targetSupp = uniqueSuppliers[0];
        const suppRows = eligibleNotBookedRows.filter((r) => r.supplier === targetSupp);
        setSelectedSupplier(targetSupp);
        setSelectedRowIds(suppRows.map((r) => r.rowId));
        toast.info(
          `Selected ${suppRows.length} items for "${targetSupp}". (Single booking requires items from the same supplier).`,
          { duration: 5000 }
        );
      }
    }
  };

  // ── SIZE "D" MODAL HANDLERS (Issue 1) ──
  const handleOpenSizeModal = (row: AccessoriesEstimationRegisterRow) => {
    setActiveSizeModalRow(row);
    const raw = row.rawRow;
    setSizeFactType(raw.sizeFactType || "SAME AS GMT SIZE");
    setSingleSizeSpec(raw.singleSizeSpec || "");

    if (raw.sizeRows && raw.sizeRows.length > 0) {
      setSizeRows(JSON.parse(JSON.stringify(raw.sizeRows)));
    } else {
      const matchedOrder = orders.find(
        (o) => o.jobNo === row.jobId || o.id === row.orderId || o.orderNo === row.jobId
      );
      const defaultSizes =
        matchedOrder?.sizeWiseBreakdown && matchedOrder.sizeWiseBreakdown.length > 0
          ? matchedOrder.sizeWiseBreakdown.map((sb) => ({
              sizeName: (sb as any).size || (sb as any).sizeName,
              qty: sb.quantity,
            }))
          : [
              { sizeName: "8S", qty: Math.round(row.orderQty * 0.15) || 4500 },
              { sizeName: "8R", qty: Math.round(row.orderQty * 0.25) || 7500 },
              { sizeName: "8L", qty: Math.round(row.orderQty * 0.20) || 6000 },
              { sizeName: "10S", qty: Math.round(row.orderQty * 0.25) || 8500 },
              { sizeName: "10R", qty: Math.round(row.orderQty * 0.15) || 12000 },
            ];

      const initialSizeRows: MMAccessoriesSizeSpecRow[] = defaultSizes.map((sz, sIdx) => {
        const req = sz.qty * (raw.consumptionQtyPerPc || 1);
        const wPct = raw.wastagePct || 3;
        const wQty = Math.ceil(req * (wPct / 100));
        return {
          id: `sz-${Date.now()}-${sIdx}`,
          gmtSize: sz.sizeName,
          itemSpecification: raw.singleSizeSpec || `${row.item} Spec for ${sz.sizeName}`,
          requiredItemQty: req,
          wastageQty: wQty,
          totalQty: req + wQty,
          gmtOrderQty: sz.qty,
          totalWastagePct: wPct,
        };
      });
      setSizeRows(initialSizeRows);
    }
  };

  const handleApplySingleSizeSpecToAll = () => {
    if (!singleSizeSpec.trim()) {
      toast.warning("Please enter a single size specification before applying.");
      return;
    }
    setSizeRows((prev) =>
      prev.map((r) => ({
        ...r,
        itemSpecification: singleSizeSpec,
      }))
    );
    toast.success(`Applied "${singleSizeSpec}" across all ${sizeRows.length} size rows.`);
  };

  const handleSaveSizeModal = () => {
    if (!activeSizeModalRow) return;
    try {
      const est = activeSizeModalRow.rawEstimation;
      const updatedRows = (est.accessoriesRows || []).map((r) => {
        if (r.id === activeSizeModalRow.rowId) {
          return {
            ...r,
            sizeFactType: sizeFactType,
            singleSizeSpec: singleSizeSpec,
            sizeRows: JSON.parse(JSON.stringify(sizeRows)),
          };
        }
        return r;
      });
      const updatedEst: MMAccessoriesEstimationRecord = {
        ...est,
        accessoriesRows: updatedRows,
        updatedAt: new Date().toISOString(),
      };
      MMRepository.saveAccessoriesEstimation(updatedEst);
      reloadData();
      setActiveSizeModalRow(null);
      toast.success(`Size specification updated for ${activeSizeModalRow.item}.`);
    } catch (err) {
      console.error("Failed to save size specification:", err);
      toast.error("Failed to save size specification.");
    }
  };

  // ── COLOR "D" MODAL HANDLERS (Issue 1) ──
  const handleOpenColorModal = (row: AccessoriesEstimationRegisterRow) => {
    setActiveColorModalRow(row);
    const raw = row.rawRow;
    setColorType(raw.colorType || "DTM");
    setSingleColorInput(raw.singleColorName || "");

    if (raw.colorMappings && raw.colorMappings.length > 0) {
      setColorMappings(JSON.parse(JSON.stringify(raw.colorMappings)));
    } else {
      const matchedOrder = orders.find(
        (o) => o.jobNo === row.jobId || o.id === row.orderId || o.orderNo === row.jobId
      );
      const defaultColors =
        matchedOrder?.colorWiseBreakdown && matchedOrder.colorWiseBreakdown.length > 0
          ? matchedOrder.colorWiseBreakdown.map((cb) => (cb as any).color || (cb as any).colorName)
          : ["Black", "White", "Navy Blue", "Heather Grey", "Olive Green"];

      const initialColors: MMAccessoriesColorMappingRow[] = defaultColors.map((cName, cIdx) => ({
        id: `cm-${Date.now()}-${cIdx}`,
        garmentsColor: cName,
        itemColor: cName,
      }));
      setColorMappings(initialColors);
    }
  };

  const handleApplySingleColorToAll = () => {
    if (!singleColorInput.trim()) {
      toast.warning("Please enter a uniform color name.");
      return;
    }
    setColorMappings((prev) =>
      prev.map((cm) => ({
        ...cm,
        itemColor: singleColorInput,
      }))
    );
    toast.success(`Applied "${singleColorInput}" to all garment colors.`);
  };

  const handleSaveColorModal = () => {
    if (!activeColorModalRow) return;
    try {
      const est = activeColorModalRow.rawEstimation;
      const updatedRows = (est.accessoriesRows || []).map((r) => {
        if (r.id === activeColorModalRow.rowId) {
          return {
            ...r,
            colorType: colorType,
            singleColorName: singleColorInput,
            colorMappings: JSON.parse(JSON.stringify(colorMappings)),
          };
        }
        return r;
      });
      const updatedEst: MMAccessoriesEstimationRecord = {
        ...est,
        accessoriesRows: updatedRows,
        updatedAt: new Date().toISOString(),
      };
      MMRepository.saveAccessoriesEstimation(updatedEst);
      reloadData();
      setActiveColorModalRow(null);
      toast.success(`Color mappings updated for ${activeColorModalRow.item}.`);
    } catch (err) {
      console.error("Failed to save color mappings:", err);
      toast.error("Failed to save color mappings.");
    }
  };

  // Action: Create Accessories Booking for selected items (Section 9 & Issue 2 Multi-Item Fix)
  const handleCreateAccessoriesBooking = () => {
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one eligible accessories item to create a booking.");
      return;
    }

    const supp = selectedRows[0].supplier;
    const hasDifferentSupplier = selectedRows.some((r) => r.supplier.toLowerCase().trim() !== supp.toLowerCase().trim());
    if (hasDifferentSupplier) {
      toast.error("Validation Error: All selected items must belong to the same supplier.");
      return;
    }

    const hasBooked = selectedRows.some((r) => r.isBooked);
    if (hasBooked) {
      toast.error("Validation Error: One or more selected items are already booked.");
      return;
    }

    // Build staged transfer payload containing EVERY selected item
    const transferPayload = {
      supplier: supp,
      jobId: selectedRows[0].jobId,
      items: selectedRows.map((r) => ({
        id: r.rowId,
        estimationId: r.estimationId,
        ourRef: r.jobId,
        style: r.style,
        grpType: "TRIMS",
        accessoryItem: r.item,
        itemName: r.item,
        description: r.description,
        budgetValue: Number(r.estValue.toFixed(2)),
        amount: Number(r.estValue.toFixed(2)),
        unit: r.conUnit,
        rate: r.estRate,
        requiredQty: r.requiredQty,
        usedPlace: r.usedPlace,
        size: r.size,
        color: r.color,
        sizeRows: r.rawRow.sizeRows,
        colorMappings: r.rawRow.colorMappings,
        supplier: r.supplier,
      })),
    };

    try {
      sessionStorage.setItem("cripton_mm_accessories_booking_transfer_v1", JSON.stringify(transferPayload));
      localStorage.setItem("cripton_mm_accessories_booking_transfer_v1", JSON.stringify(transferPayload));
    } catch (e) {
      console.error("Failed to stage accessories transfer payload:", e);
    }

    toast.success(
      `Opening Accessories Booking for ${selectedRows.length} item(s) from "${supp}"...`
    );

    // Pass rowIds (all selected item IDs) without single rowId override
    navigate({
      to: "/mm-accessories-booking",
      search: {
        source: "estimation",
        jobId: selectedRows[0].jobId,
        supplier: supp,
        rowIds: selectedRows.map((r) => r.rowId).join(","),
      } as any,
    });
  };

  // Single-Row Booking Action
  const handleInitiateSingleBooking = (row: AccessoriesEstimationRegisterRow) => {
    if (row.isBooked) {
      toast.info(`Opening existing booking (${row.bookNo}) for ${row.item}...`);
      navigate({
        to: "/mm-accessories-booking",
        search: {
          jobId: row.jobId,
          bookingId: row.bookNo,
        } as any,
      });
      return;
    }

    const transferPayload = {
      supplier: row.supplier,
      jobId: row.jobId,
      items: [
        {
          id: row.rowId,
          estimationId: row.estimationId,
          ourRef: row.jobId,
          style: row.style,
          grpType: "TRIMS",
          accessoryItem: row.item,
          itemName: row.item,
          description: row.description,
          budgetValue: Number(row.estValue.toFixed(2)),
          amount: Number(row.estValue.toFixed(2)),
          unit: row.conUnit,
          rate: row.estRate,
          requiredQty: row.requiredQty,
          usedPlace: row.usedPlace,
          size: row.size,
          color: row.color,
          sizeRows: row.rawRow.sizeRows,
          colorMappings: row.rawRow.colorMappings,
          supplier: row.supplier,
        },
      ],
    };

    try {
      sessionStorage.setItem("cripton_mm_accessories_booking_transfer_v1", JSON.stringify(transferPayload));
      localStorage.setItem("cripton_mm_accessories_booking_transfer_v1", JSON.stringify(transferPayload));
    } catch (e) {}

    toast.success(`Initiating Accessories Booking for ${row.item} (Supplier: ${row.supplier})...`);

    navigate({
      to: "/mm-accessories-booking",
      search: {
        source: "estimation",
        jobId: row.jobId,
        accessoryId: row.rawRow.budgetItemName || row.rowId,
        itemName: row.item,
        supplier: row.supplier,
        rowIds: row.rowId,
        rowId: row.rowId,
      } as any,
    });
  };

  // Action: Open Estimation Form for editing
  const handleOpenEstimation = (row: AccessoriesEstimationRegisterRow) => {
    toast.info(`Opening Accessories Estimation (GR_1308) for ${row.jobId}...`);
    navigate({
      to: "/mm-accessories-estimation",
      search: {
        ref: row.jobId,
        jobId: row.jobId,
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
      "Job ID / Our Ref",
      "Style",
      "Merchant",
      "GMT Item",
      "Order Qty",
      "Item",
      "Used Place",
      "Description",
      "Supplier",
      "Consumption",
      "Con. Unit",
      "Wastage %",
      "Required Qty",
      "Est. Rate",
      "Est. Value",
      "Size",
      "Color",
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
        `"${r.item.replace(/"/g, '""')}"`,
        `"${r.usedPlace.replace(/"/g, '""')}"`,
        `"${r.description.replace(/"/g, '""')}"`,
        `"${r.supplier.replace(/"/g, '""')}"`,
        r.consumption,
        `"${r.conUnit}"`,
        r.wastagePct,
        r.requiredQty,
        r.estRate,
        r.estValue.toFixed(2),
        `"${r.size.replace(/"/g, '""')}"`,
        `"${r.color.replace(/"/g, '""')}"`,
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
    link.setAttribute("download", `Accessories_Estimation_Register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Accessories Estimation Register exported successfully.");
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-accessories-estimation-register"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Confirm Order Entry", to: "/mm-order-entry" },
        { label: "Accessories Estimation Register" },
      ]}
      title="Accessories Estimation Register"
      subtitle="Central register of all saved accessories estimation items with size/color specifications, booking tracking, and combined booking workflow"
      actions={
        <div className="flex items-center gap-2">
          {/* Create Accessories Booking Button (Section 9) */}
          <button
            type="button"
            onClick={handleCreateAccessoriesBooking}
            disabled={selectedRowIds.length === 0}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              selectedRowIds.length > 0
                ? "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/25 ring-2 ring-teal-400/30"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Create Accessories Booking ({selectedRowIds.length})</span>
          </button>

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
            onClick={() => navigate({ to: "/mm-accessories-estimation" })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Estimation</span>
          </button>
        </div>
      }
    >
      <div className="space-y-4 pb-12">
        {/* ── TOP CONTROL BAR: BOOKING STATUS TABS & MULTI-SELECTION TOOLBAR ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          {/* Booking Status Filter Tabs (Section 6) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setBookingStatusTab("All");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                bookingStatusTab === "All"
                  ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>All Items</span>
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

          {/* Multi-Selection Status & Supplier Lock Banner (Section 7.2 & 7.3) */}
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
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
                  <span>Select All Eligible</span>
                </button>
                <span className="text-[11px] text-slate-400">
                  Select eligible items to create combined bookings
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

          {/* 7 Search Dropdown Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
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

            {/* 6. Item */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Item</label>
              <select
                value={filterItem}
                onChange={(e) => {
                  setFilterItem(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-8 px-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">All Items</option>
                {filterOptions.items.map((it) => (
                  <option key={it} value={it}>
                    {it}
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
          </div>

          {/* Quick text search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by keywords across Buyer, Job ID, Item Name, Description, Supplier, Size, Color, Booking No..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-8.5 pl-8 pr-3 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* ── REGISTER TABLE CONTAINER (No serial prefixes on headers, Section 2) ── */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-left border-collapse min-w-[2200px]">
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  {/* Selection Checkbox Header (Section 7 & 8) */}
                  <th className="py-2.5 px-3 text-center w-12 sticky left-0 z-20 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={handleSelectAll}
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
                  <th className="py-2.5 px-2 text-center w-12">SL</th>
                  {/* Clean column headers without serial number prefixes (Section 2) */}
                  <th className="py-2.5 px-3 min-w-[130px]">Buyer</th>
                  <th className="py-2.5 px-3 min-w-[120px]">Job ID / Our Ref</th>
                  <th className="py-2.5 px-3 min-w-[120px]">Style</th>
                  <th className="py-2.5 px-3 min-w-[130px]">Merchant</th>
                  <th className="py-2.5 px-3 min-w-[140px]">GMT Item</th>
                  <th className="py-2.5 px-3 min-w-[90px] text-right">Order Qty</th>
                  <th className="py-2.5 px-3 min-w-[130px]">Item</th>
                  <th className="py-2.5 px-3 min-w-[110px]">Used Place</th>
                  <th className="py-2.5 px-3 min-w-[180px]">Description</th>
                  <th className="py-2.5 px-3 min-w-[160px]">Supplier</th>
                  <th className="py-2.5 px-3 min-w-[85px] text-right">Consumption</th>
                  <th className="py-2.5 px-2 min-w-[65px] text-center">Con. Unit</th>
                  <th className="py-2.5 px-2 min-w-[75px] text-right">Wastage %</th>
                  <th className="py-2.5 px-3 min-w-[100px] text-right">Required Qty</th>
                  <th className="py-2.5 px-3 min-w-[85px] text-right">Est. Rate</th>
                  <th className="py-2.5 px-3 min-w-[100px] text-right">Est. Value</th>
                  <th className="py-2.5 px-3 min-w-[140px] text-center">Size</th>
                  <th className="py-2.5 px-3 min-w-[150px] text-center">Color</th>
                  <th className="py-2.5 px-3 min-w-[130px]">Book No</th>
                  <th className="py-2.5 px-3 min-w-[95px] text-right">Book Qty</th>
                  <th className="py-2.5 px-3 min-w-[100px] text-right">Book Value</th>
                  <th className="py-2.5 px-3 min-w-[120px] text-center">Booking Status</th>
                  <th className="py-2.5 px-3 min-w-[160px] text-center sticky right-0 z-20 bg-slate-100 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700">
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
                        <div className="font-semibold text-sm">No matching accessories estimation records found</div>
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

                    // Same-supplier restriction checks (Section 7.2)
                    const isDifferentSupplier =
                      Boolean(selectedSupplier) &&
                      selectedSupplier!.toLowerCase().trim() !== row.supplier.toLowerCase().trim();

                    const isCheckboxDisabled = row.isBooked || isDifferentSupplier;

                    let disabledReason = "";
                    if (row.isBooked) {
                      disabledReason = `Item is already booked (${row.bookNo}).`;
                    } else if (isDifferentSupplier) {
                      disabledReason = `Selection restricted to "${selectedSupplier}". Clear selection to choose "${row.supplier}".`;
                    }

                    return (
                      <tr
                        key={row.rowId || idx}
                        className={`transition-colors group ${
                          isSelected
                            ? "bg-teal-50/50 dark:bg-teal-950/30"
                            : "hover:bg-slate-50/70 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        {/* Checkbox Column (Section 7) */}
                        <td className="py-2 px-3 text-center sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 border-r border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => handleToggleRowSelection(row)}
                            disabled={isCheckboxDisabled}
                            title={disabledReason || (isSelected ? "Deselect item" : "Select item for combined booking")}
                            className={`p-1 rounded transition-colors ${
                              isCheckboxDisabled
                                ? "opacity-35 cursor-not-allowed text-slate-300 dark:text-slate-600"
                                : isSelected
                                ? "text-teal-600 hover:text-teal-700"
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            }`}
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-teal-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* SL */}
                        <td className="py-2 px-2 text-center text-slate-400 font-mono text-[11px]">
                          {slNo}
                        </td>

                        {/* Buyer */}
                        <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                          {row.buyer}
                        </td>

                        {/* Job ID / Our Ref */}
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

                        {/* Item */}
                        <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-1.5">
                            <Tag className="w-3 h-3 text-teal-600 shrink-0" />
                            <span>{row.item}</span>
                          </div>
                        </td>

                        {/* Used Place */}
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 font-medium">
                            {row.usedPlace}
                          </span>
                        </td>

                        {/* Description */}
                        <td className="py-2 px-3 text-slate-700 dark:text-slate-200 truncate max-w-[200px]" title={row.description}>
                          {row.description}
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
                          {row.consumption.toFixed(3)}
                        </td>

                        {/* Con. Unit */}
                        <td className="py-2 px-2 text-center text-slate-500 font-medium">
                          {row.conUnit}
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
                          ${row.estRate.toFixed(3)}
                        </td>

                        {/* Est. Value */}
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                          ${row.estValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Size (Issue 1: Original D Button) */}
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenSizeModal(row)}
                            className="px-2 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/60 dark:hover:bg-blue-800 dark:text-blue-200 font-bold rounded text-[10px] border border-blue-300 dark:border-blue-700 shadow-xs inline-flex items-center gap-1 cursor-pointer transition-colors"
                            title={`Sizewise Item Specification Declaration (${row.rawRow.sizeRows?.length || (row.rawRow.singleSizeSpec ? 1 : 0)})`}
                          >
                            <span>D</span>
                            <span className="text-[9px] opacity-85">({row.rawRow.sizeRows?.length || (row.rawRow.singleSizeSpec ? 1 : 0)})</span>
                          </button>
                        </td>

                        {/* Color (Issue 1: Original D Button) */}
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenColorModal(row)}
                            className="px-2 py-0.5 bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/60 dark:hover:bg-purple-800 dark:text-purple-200 font-bold rounded text-[10px] border border-purple-300 dark:border-purple-700 shadow-xs inline-flex items-center gap-1 cursor-pointer transition-colors"
                            title={`Accessories Color Entry (${row.rawRow.colorMappings?.length || (row.rawRow.singleColorName ? 1 : 0)})`}
                          >
                            <span>D</span>
                            <span className="text-[9px] opacity-85">({row.rawRow.colorMappings?.length || (row.rawRow.singleColorName ? 1 : 0)})</span>
                          </button>
                        </td>

                        {/* Book No (Section 4: Actual Related Booking Number) */}
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                          {row.bookNo !== "—" ? (
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
                            {/* View / Edit */}
                            <button
                              type="button"
                              onClick={() => handleOpenEstimation(row)}
                              title="Open Accessories Estimation Form"
                              className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold transition-colors flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                              <span>View</span>
                            </button>

                            {/* Booking Action */}
                            <button
                              type="button"
                              onClick={() => handleInitiateSingleBooking(row)}
                              title={
                                row.isBooked
                                  ? `Open existing booking ${row.bookNo}`
                                  : `Create booking for ${row.item} (Supplier: ${row.supplier})`
                              }
                              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors flex items-center gap-1 shadow-xs ${
                                row.isBooked
                                  ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700"
                                  : "bg-teal-600 hover:bg-teal-700 text-white"
                              }`}
                            >
                              {row.isBooked ? (
                                <Eye className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                              ) : (
                                <Package className="w-3 h-3" />
                              )}
                              <span>{row.isBooked ? "View Booking" : "Booking"}</span>
                            </button>
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

        {/* Floating/Bottom Action Bar when items are selected */}
        {selectedRowIds.length > 0 && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-6 h-6 rounded-full bg-teal-500 text-slate-950 font-black flex items-center justify-center text-xs">
                {selectedRowIds.length}
              </span>
              <span>
                Item(s) selected from <strong>{selectedSupplier}</strong>
              </span>
            </div>

            <div className="h-4 w-px bg-slate-700" />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearSelection}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleCreateAccessoriesBooking}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
              >
                <span>Create Accessories Booking</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MODAL: SIZE D — SIZEWISE ITEM SPECIFICATION DECLARATION (Issue 1) */}
        {/* ================================================================== */}
        {activeSizeModalRow !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-5xl w-full max-h-[85vh] flex flex-col text-xs overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    Sizewise Item Specification Declaration
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="font-semibold text-teal-700 dark:text-teal-400 font-mono text-xs">
                    {activeSizeModalRow.item}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSizeModalRow(null)}
                    className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold border border-slate-300 dark:border-slate-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSizeModal}
                    className="px-4 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs transition-colors"
                  >
                    SAVE
                  </button>
                </div>
              </div>

              {/* Modal Top Header Fields */}
              <div className="p-3 bg-white dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-0.5">Item Name:</label>
                    <input
                      type="text"
                      readOnly
                      value={activeSizeModalRow.item}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-0.5">Wastage %:</label>
                    <input
                      type="number"
                      readOnly
                      value={activeSizeModalRow.rawRow.wastagePct ?? activeSizeModalRow.wastagePct}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-0.5">Market Unit:</label>
                    <input
                      type="text"
                      readOnly
                      value={activeSizeModalRow.rawRow.marketUnit || activeSizeModalRow.conUnit}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-0.5">Size Fact Type:</label>
                    <select
                      value={sizeFactType}
                      onChange={(e) => setSizeFactType(e.target.value as any)}
                      className="w-full px-2 py-1 rounded border border-teal-500 bg-teal-50 dark:bg-slate-800 font-bold text-teal-800 dark:text-teal-300"
                    >
                      <option value="SAME AS GMT SIZE">SAME AS GMT SIZE</option>
                      <option value="SINGLE SIZE">SINGLE SIZE</option>
                    </select>
                  </div>
                </div>

                {/* If SINGLE SIZE is chosen: Show single size input with P populate button */}
                {sizeFactType === "SINGLE SIZE" && (
                  <div className="p-2.5 bg-amber-50/70 dark:bg-slate-800/80 rounded-lg border border-amber-200 dark:border-amber-800/40 flex flex-wrap items-center gap-3">
                    <label className="font-bold text-amber-900 dark:text-amber-300 shrink-0 text-xs">
                      Single Size Specification:
                    </label>
                    <div className="flex items-center gap-1.5 flex-1 max-w-md">
                      <input
                        type="text"
                        value={singleSizeSpec}
                        onChange={(e) => setSingleSizeSpec(e.target.value)}
                        placeholder="e.g. 18L (11.5mm) 4-Hole or 25x55 mm Folded..."
                        className="w-full px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplySingleSizeSpecToAll}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shadow-xs text-xs"
                        title="Apply specification across all size rows"
                      >
                        P
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Size Specification Grid (ALWAYS RENDERED, PRESERVES GMT SIZES AND QUANTITIES) */}
              <div className="flex-1 overflow-auto p-3 space-y-2">
                <div className="overflow-x-auto border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold sticky top-0">
                      <tr>
                        <th className="py-1.5 px-2.5 border-r border-slate-200 dark:border-slate-700 min-w-[80px]">
                          GMT Size
                        </th>
                        <th className="py-1.5 px-3 border-r border-slate-200 dark:border-slate-700 min-w-[240px]">
                          Item Specification
                        </th>
                        <th className="py-1.5 px-3 text-right border-r border-slate-200 dark:border-slate-700 min-w-[110px]">
                          Required Item Qty
                        </th>
                        <th className="py-1.5 px-2.5 text-right border-r border-slate-200 dark:border-slate-700 min-w-[90px]">
                          Wastage Qty
                        </th>
                        <th className="py-1.5 px-3 text-right border-r border-slate-200 dark:border-slate-700 min-w-[100px] font-bold text-teal-700 dark:text-teal-400">
                          Total Qty
                        </th>
                        <th className="py-1.5 px-3 text-right border-r border-slate-200 dark:border-slate-700 min-w-[110px]">
                          GMT Order Qty (Read-Only)
                        </th>
                        <th className="py-1.5 px-2.5 text-right min-w-[100px]">
                          Total Wastage (%) (Read-Only)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                      {sizeRows.map((sr, sIdx) => (
                        <tr key={sr.id || sIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                          <td className="py-1.5 px-2.5 font-bold text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60">
                            {sr.gmtSize}
                          </td>
                          <td className="py-1.5 px-2.5 border-r border-slate-200 dark:border-slate-800 font-sans">
                            <input
                              type="text"
                              value={sr.itemSpecification}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSizeRows((prev) => {
                                  const updated = [...prev];
                                  updated[sIdx] = { ...updated[sIdx], itemSpecification: val };
                                  return updated;
                                });
                              }}
                              className="w-full px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-sans text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                            />
                          </td>
                          <td className="py-1.5 px-3 text-right border-r border-slate-200 dark:border-slate-800">
                            {sr.requiredItemQty.toLocaleString()}
                          </td>
                          <td className="py-1.5 px-2.5 text-right border-r border-slate-200 dark:border-slate-800 text-slate-500">
                            {sr.wastageQty.toLocaleString()}
                          </td>
                          <td className="py-1.5 px-3 text-right border-r border-slate-200 dark:border-slate-800 font-bold text-teal-700 dark:text-teal-400">
                            {sr.totalQty.toLocaleString()}
                          </td>
                          <td className="py-1.5 px-3 text-right border-r border-slate-200 dark:border-slate-800 font-bold bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300">
                            {sr.gmtOrderQty.toLocaleString()}
                          </td>
                          <td className="py-1.5 px-2.5 text-right bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400">
                            {sr.totalWastagePct}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-100 dark:bg-slate-850 font-bold border-t border-slate-300 dark:border-slate-700 sticky bottom-0">
                      <tr>
                        <td className="py-2 px-2.5 font-sans">
                          No. of Size: {sizeRows.length}
                        </td>
                        <td className="py-2 px-2.5 text-right font-sans">
                          Totals:
                        </td>
                        <td className="py-2 px-3 text-right font-mono">
                          {sizeRows.reduce((a, b) => a + (b.requiredItemQty || 0), 0).toLocaleString()}
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono text-slate-500">
                          {sizeRows.reduce((a, b) => a + (b.wastageQty || 0), 0).toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-teal-700 dark:text-teal-400">
                          {sizeRows.reduce((a, b) => a + (b.totalQty || 0), 0).toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                          {sizeRows.reduce((a, b) => a + (b.gmtOrderQty || 0), 0).toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* MODAL: COLOR D — ACCESSORIES COLOR ENTRY (Issue 1)                */}
        {/* ================================================================== */}
        {activeColorModalRow !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col text-xs overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    Accessories Color Entry
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="font-semibold text-teal-700 dark:text-teal-400 font-mono text-xs">
                    {activeColorModalRow.item}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveColorModalRow(null)}
                    className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold border border-slate-300 dark:border-slate-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveColorModal}
                    className="px-4 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs transition-colors"
                  >
                    SAVE
                  </button>
                </div>
              </div>

              {/* Reference Header */}
              <div className="p-3 bg-white dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block text-[11px]">Job ID:</span>
                    <strong className="font-mono text-teal-700 dark:text-teal-400 text-xs">{activeColorModalRow.jobId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[11px]">Buyer Name:</span>
                    <strong className="text-slate-800 dark:text-slate-200 text-xs">{activeColorModalRow.buyer}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[11px]">Accessories Name:</span>
                    <strong className="text-slate-800 dark:text-slate-200 text-xs">
                      {activeColorModalRow.item}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[11px]">Description:</span>
                    <span className="text-slate-600 dark:text-slate-400 truncate block text-xs">
                      {activeColorModalRow.description}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Color Type:</label>
                    <select
                      value={colorType}
                      onChange={(e) => {
                        const nextType = e.target.value as any;
                        setColorType(nextType);
                        if (nextType === "DTM") {
                          setColorMappings((prev) =>
                            prev.map((cm) => ({ ...cm, itemColor: cm.garmentsColor }))
                          );
                        }
                      }}
                      className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                    >
                      <option value="DTM">DTM</option>
                      <option value="Contrast">Contrast</option>
                      <option value="Single Color">Single Color</option>
                    </select>
                  </div>

                  {colorType === "Single Color" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={singleColorInput}
                        onChange={(e) => setSingleColorInput(e.target.value)}
                        placeholder="Enter uniform color name..."
                        className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs min-w-[200px]"
                      />
                      <button
                        type="button"
                        onClick={handleApplySingleColorToAll}
                        className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded shadow-xs"
                      >
                        Populate
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 2-Column Garments Color and Item Color Mapping Grid (Garments Color Read-only) */}
              <div className="flex-1 overflow-auto p-3">
                <div className="border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 overflow-hidden">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 sticky top-0">
                      <tr>
                        <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 w-1/2">
                          Garments Color (Read-Only)
                        </th>
                        <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-700 w-1/2">
                          Item Color
                        </th>
                        <th className="py-2 px-2 text-center w-12">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {colorMappings.map((cm, cIdx) => (
                        <tr key={cm.id || cIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                          {/* Garments Color: Non-editable / Read-only */}
                          <td className="py-1.5 px-3 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-semibold cursor-not-allowed select-none">
                            {cm.garmentsColor}
                          </td>
                          <td className="py-1.5 px-3 border-r border-slate-200 dark:border-slate-800">
                            <input
                              type="text"
                              value={cm.itemColor}
                              readOnly={colorType === "DTM"}
                              onChange={(e) => {
                                const val = e.target.value;
                                setColorMappings((prev) => {
                                  const updated = [...prev];
                                  updated[cIdx] = { ...updated[cIdx], itemColor: val };
                                  return updated;
                                });
                              }}
                              className={`w-full px-2 py-0.5 rounded border ${
                                colorType === "DTM"
                                  ? "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed"
                                  : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-teal-500"
                              } outline-none text-xs`}
                            />
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setColorMappings((prev) => prev.filter((_, idx) => idx !== cIdx));
                              }}
                              disabled={colorType === "DTM"}
                              className="text-slate-400 hover:text-rose-500 disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
                              title="Remove mapping row"
                            >
                              <X className="w-3.5 h-3.5 mx-auto" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketingMerchandisingLayout>
  );
}
