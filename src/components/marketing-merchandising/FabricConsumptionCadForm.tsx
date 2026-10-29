import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Calculator,
  Save,
  Send,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Printer,
  Sparkles,
  Info,
  Check,
  ChevronRight,
  Eye,
  Scissors,
  FileSpreadsheet,
  Layers,
  HelpCircle,
  Maximize2,
  Download,
  Paperclip,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  MMFabricConsumptionCadRecord,
  MMCadItemRow,
  MMCadCalculationMode,
  DEFAULT_CAD_BODY_PARTS,
  INITIAL_APEROL_CAD_ROWS,
  calculateCadRow,
  calculateCadTable,
  MMRepository,
  MM_BUYERS_MASTER,
  MM_MERCHANTS_MASTER,
  MMSeasonMasterItem,
  MMFabricConsumptionAttachment,
} from "../../lib/marketing-merchandising-data";
import { SearchableSelect } from "../ui/searchable-select";
import MMFabricConsumptionAttachmentModal from "./MMFabricConsumptionAttachmentModal";
import FabricConsumptionPreviewModal from "./FabricConsumptionPreviewModal";

export interface FabricConsumptionCadFormProps {
  initialId?: string;
  initialMode?: "create" | "cad-response" | "view" | "edit";
  onBackToList?: () => void;
  onNavigateToRequest?: (id: string, mode?: "view" | "cad-response") => void;
}

export function FabricConsumptionCadForm({
  initialId,
  initialMode = "create",
  onBackToList,
  onNavigateToRequest,
}: FabricConsumptionCadFormProps) {
  // Current mode: "create" (Merchant new), "edit" (Merchant draft edit), "cad-response" (CAD entering data), "view" (Read-only)
  const [mode, setMode] = useState<"create" | "cad-response" | "view" | "edit">(initialMode);
  const [recordId, setRecordId] = useState<string | undefined>(initialId);

  // Master data
  const [seasonsMaster, setSeasonsMaster] = useState<MMSeasonMasterItem[]>([]);
  const [cadBodyParts, setCadBodyParts] = useState<string[]>(DEFAULT_CAD_BODY_PARTS);

  // Attachment Modal State
  const [showAttachmentModal, setShowAttachmentModal] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<MMFabricConsumptionAttachment[]>([]);

  // Add Body Part Modal State
  const [showAddBodyPartModal, setShowAddBodyPartModal] = useState<boolean>(false);
  const [newBodyPartName, setNewBodyPartName] = useState<string>("");
  const [targetRowIndexForNewBodyPart, setTargetRowIndexForNewBodyPart] = useState<number | null>(null);

  // Preview Report Modal State
  const [showPreviewReportModal, setShowPreviewReportModal] = useState<boolean>(false);

  // Logged-in user helper
  const getLoggedInUser = (): string => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cripton_current_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.name) return parsed.name;
        } catch {
          if (typeof stored === "string" && stored.length > 1) return stored;
        }
      }
    }
    return MM_MERCHANTS_MASTER[0]?.name || "Tanvir Ahmed (Merchandiser)";
  };

  // Form State
  const [requestNo, setRequestNo] = useState("");
  const [requestDate, setRequestDate] = useState(new Date().toISOString().substring(0, 10));
  const [buyer, setBuyer] = useState("MARLIN MEDIA");
  const [styleOrder, setStyleOrder] = useState("");
  // Efficiency and Fabrication are blank by default for new requests
  const [efficiency, setEfficiency] = useState("");
  const [sizeRange, setSizeRange] = useState("");
  const [fabrication, setFabrication] = useState("");
  const [season, setSeason] = useState("Autumn / Winter 2026");
  const [merchandiser, setMerchandiser] = useState(getLoggedInUser());
  const [requestRemarks, setRequestRemarks] = useState("");
  const [submittedDate, setSubmittedDate] = useState<string | undefined>(undefined);

  // CAD fields
  const [cadAssignedTo, setCadAssignedTo] = useState("Kazi Mofizul (CAD In-Charge)");
  const [cadResponseDate, setCadResponseDate] = useState<string | undefined>(undefined);
  const [cadSubmittedBy, setCadSubmittedBy] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<MMFabricConsumptionCadRecord["status"]>("Draft");
  const [cadResponseStatus, setCadResponseStatus] = useState<MMFabricConsumptionCadRecord["cadResponseStatus"]>("Not Received");
  const [rows, setRows] = useState<MMCadItemRow[]>([]);
  const [notes, setNotes] = useState("..");
  const [comments, setComments] = useState("ONE BODY ONE WAY CUTTING.");
  const [history, setHistory] = useState<MMFabricConsumptionCadRecord["history"]>([]);

  // Calculation summaries
  const totals = useMemo(() => {
    return calculateCadTable(rows);
  }, [rows]);

  // Load masters and record on mount
  useEffect(() => {
    const seasons = MMRepository.getSeasons();
    setSeasonsMaster(seasons);

    const parts = MMRepository.getCadBodyParts();
    setCadBodyParts(parts);

    if (initialId) {
      loadRecord(initialId);
    } else {
      initNewRecord();
    }
  }, [initialId]);

  const initNewRecord = () => {
    const list = MMRepository.getFabricConsumptionCadList();
    const nextNum = list.length + 1;
    const generatedNo = `FCAD-2026-${String(nextNum).padStart(4, "0")}`;
    const defaultBuyer = MM_BUYERS_MASTER[0]?.name || "MARLIN MEDIA";

    setRequestNo(generatedNo);
    setRequestDate(new Date().toISOString().substring(0, 10));
    setBuyer(defaultBuyer);

    const b = MM_BUYERS_MASTER.find((item) => item.name === defaultBuyer);
    if (b && b.styles.length > 0) {
      setStyleOrder(b.styles[0].styleNo);
    } else {
      setStyleOrder("");
    }

    // Load initial size range from Buyer's configured sizes
    const buyerSizes = MMRepository.getBuyerConfiguredSizes(defaultBuyer);
    if (buyerSizes.sizeRanges.length > 0) {
      setSizeRange(buyerSizes.sizeRanges[0]);
    } else {
      setSizeRange("");
    }

    // Both Efficiency and Fabrication are blank by default for new requests
    setEfficiency("");
    setFabrication("");
    setSeason("Autumn / Winter 2026");
    setMerchandiser(getLoggedInUser());
    setRequestRemarks("");
    setStatus("Draft");
    setCadResponseStatus("Not Received");
    setAttachments([]);
    setRows([]);
    setNotes("..");
    setComments("ONE BODY ONE WAY CUTTING.");
  };

  const loadRecord = (id: string) => {
    const rec = MMRepository.getFabricConsumptionCadById(id);
    if (!rec) {
      toast.error("Fabric Consumption request not found.");
      return;
    }
    setRecordId(rec.id);
    setRequestNo(rec.requestNo);
    setRequestDate(rec.requestDate);
    setBuyer(rec.buyer);
    setStyleOrder(rec.styleOrder);
    setEfficiency(rec.efficiency || "");
    setSizeRange(rec.sizeRange || "");
    setFabrication(rec.fabrication || "");
    setSeason(rec.season || "Autumn / Winter 2026");
    setMerchandiser(rec.merchandiser);
    setRequestRemarks(rec.requestRemarks || "");
    setSubmittedDate(rec.submittedDate);
    setCadAssignedTo(rec.cadAssignedTo || "Kazi Mofizul (CAD In-Charge)");
    setCadResponseDate(rec.cadResponseDate);
    setCadSubmittedBy(rec.cadSubmittedBy);
    setStatus(rec.status);
    setCadResponseStatus(rec.cadResponseStatus);
    setNotes(rec.notes || "..");
    setComments(rec.comments || "ONE BODY ONE WAY CUTTING.");
    setAttachments(rec.attachments || []);
    setHistory(rec.history || []);

    // If CAD rows are empty (newly opened by CAD), populate 7 default rows from template
    if (!rec.rows || rec.rows.length === 0) {
      setRows(INITIAL_APEROL_CAD_ROWS.map((r, i) => ({ ...r, id: `cad-r-${Date.now()}-${i + 1}` })));
    } else {
      setRows(rec.rows);
    }
  };

  // Buyer searchable select options
  const buyerOptions = useMemo(() => {
    return MM_BUYERS_MASTER.map((b) => ({
      value: b.name,
      label: `${b.name} (${b.country})`,
    }));
  }, []);

  // Styles filtered according to the selected Buyer
  const availableStyles = useMemo(() => {
    const b = MM_BUYERS_MASTER.find((item) => item.name === buyer);
    return b ? b.styles.map((s) => ({ value: s.styleNo, label: `${s.styleNo} — ${s.description}` })) : [];
  }, [buyer]);

  // Sizes / size ranges configured for the selected Buyer
  const availableBuyerSizes = useMemo(() => {
    const config = MMRepository.getBuyerConfiguredSizes(buyer);
    const set = new Set<string>();
    config.sizeRanges.forEach((sr) => set.add(sr));
    config.configuredSizes.forEach((cs) => set.add(cs));
    return Array.from(set).map((sz) => ({ value: sz, label: sz }));
  }, [buyer]);

  // Handle Buyer change: refresh available Style and Size Range options.
  // Clear a previously selected Style or Size Range if no longer valid for newly selected Buyer.
  const handleBuyerChange = (newBuyer: string) => {
    setBuyer(newBuyer);
    const b = MM_BUYERS_MASTER.find((item) => item.name === newBuyer);
    const newStyles = b ? b.styles : [];

    // Style validation
    const styleStillValid = newStyles.some((s) => s.styleNo === styleOrder);
    if (!styleStillValid) {
      if (newStyles.length > 0) {
        setStyleOrder(newStyles[0].styleNo);
      } else {
        setStyleOrder("");
      }
    }

    // Size range validation
    const newBuyerSizes = MMRepository.getBuyerConfiguredSizes(newBuyer);
    const validSizes = [...newBuyerSizes.sizeRanges, ...newBuyerSizes.configuredSizes];
    const sizeStillValid = validSizes.includes(sizeRange);
    if (!sizeStillValid) {
      if (newBuyerSizes.sizeRanges.length > 0) {
        setSizeRange(newBuyerSizes.sizeRanges[0]);
      } else if (newBuyerSizes.configuredSizes.length > 0) {
        setSizeRange(newBuyerSizes.configuredSizes[0]);
      } else {
        setSizeRange("");
      }
    }
  };

  // ── Attachment Handlers ──────────────────────────────────────
  const handleAddAttachment = (newAtt: MMFabricConsumptionAttachment) => {
    const updated = [...attachments, newAtt];
    setAttachments(updated);

    // If an active record already exists, persist attachments immediately
    if (recordId) {
      const currentRec = MMRepository.getFabricConsumptionCadById(recordId);
      if (currentRec) {
        const updatedRec: MMFabricConsumptionCadRecord = {
          ...currentRec,
          attachments: updated,
          history: [
            ...(currentRec.history || []),
            {
              timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
              user: getLoggedInUser(),
              action: "Attachment Added",
              status: currentRec.status,
              notes: `Document "${newAtt.title}" (${newAtt.fileName}) attached by ${newAtt.uploadedRole || "User"}.`,
            },
          ],
        };
        MMRepository.saveFabricConsumptionCadRecord(updatedRec);
        setHistory(updatedRec.history || []);
      }
    }
  };

  const handleDeleteAttachment = (attId: string) => {
    const updated = attachments.filter((a) => a.id !== attId);
    setAttachments(updated);

    if (recordId) {
      const currentRec = MMRepository.getFabricConsumptionCadById(recordId);
      if (currentRec) {
        const updatedRec: MMFabricConsumptionCadRecord = {
          ...currentRec,
          attachments: updated,
        };
        MMRepository.saveFabricConsumptionCadRecord(updatedRec);
      }
    }
    toast.success("Attachment removed.");
  };

  // ── Body Part Catalog Modal Handlers ─────────────────────────
  const handleOpenAddBodyPartModal = (rowIndex?: number | null) => {
    setTargetRowIndexForNewBodyPart(rowIndex ?? null);
    setNewBodyPartName("");
    setShowAddBodyPartModal(true);
  };

  const handleSaveNewBodyPart = () => {
    const trimmed = newBodyPartName.trim().toUpperCase();
    if (!trimmed) {
      toast.error("Please enter a valid body part name.");
      return;
    }

    const currentParts = MMRepository.getCadBodyParts();
    const exists = currentParts.some((p) => p.toUpperCase() === trimmed);
    if (exists) {
      toast.error(`Body part "${trimmed}" already exists in the catalog.`);
      return;
    }

    MMRepository.addCadBodyPart(trimmed);
    const updatedList = MMRepository.getCadBodyParts();
    setCadBodyParts(updatedList);

    // Automatically assign this newly created body part to the calling row if one was targeted
    if (targetRowIndexForNewBodyPart !== null && rows[targetRowIndexForNewBodyPart]) {
      handleUpdateCadRow(targetRowIndexForNewBodyPart, "bodyPart", trimmed);
      toast.success(`Body part "${trimmed}" added to catalog and selected!`);
    } else {
      toast.success(`Body part "${trimmed}" added to catalog!`);
    }

    setShowAddBodyPartModal(false);
    setNewBodyPartName("");
    setTargetRowIndexForNewBodyPart(null);
  };

  // ── Merchant Actions ──────────────────────────────────────────
  const handleSaveMerchantDraft = () => {
    if (!styleOrder.trim()) {
      toast.error("Please enter or select a Style.");
      return;
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const id = recordId || `fcad-${Date.now()}`;
    const record: MMFabricConsumptionCadRecord = {
      id,
      requestNo: requestNo || `FCAD-2026-${Date.now().toString().slice(-4)}`,
      requestDate,
      jobId: `JOB-2026-${Date.now().toString().slice(-4)}`,
      buyer,
      styleOrder,
      efficiency,
      sizeRange,
      fabrication,
      season,
      merchandiser,
      requestRemarks,
      status: "Draft",
      cadResponseStatus: "Not Received",
      attachments,
      rows: rows.length > 0 ? rows : [],
      totalFinishKg: totals.totalFinishKg,
      totalWaste10Kg: totals.totalWaste10Kg,
      wash10Pct: totals.wash10Pct,
      notes,
      comments,
      history: [
        ...(history || []),
        {
          timestamp: now,
          user: merchandiser,
          action: recordId ? "Draft Updated" : "Draft Created",
          status: "Draft",
          notes: requestRemarks || "Merchant draft updated",
        },
      ],
    };

    MMRepository.saveFabricConsumptionCadRecord(record);
    setRecordId(id);
    setHistory(record.history || []);
    toast.success(`Draft request ${record.requestNo} saved successfully.`);
  };

  const handleSubmitToCad = () => {
    if (!styleOrder.trim()) {
      toast.error("Please specify a Style before submitting to CAD.");
      return;
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const id = recordId || `fcad-${Date.now()}`;
    const record: MMFabricConsumptionCadRecord = {
      id,
      requestNo: requestNo || `FCAD-2026-${Date.now().toString().slice(-4)}`,
      requestDate,
      jobId: `JOB-2026-${Date.now().toString().slice(-4)}`,
      buyer,
      styleOrder,
      efficiency,
      sizeRange,
      fabrication,
      season,
      merchandiser,
      requestRemarks,
      submittedDate: now,
      cadAssignedTo,
      status: "Pending CAD",
      cadResponseStatus: "Not Received",
      attachments,
      rows: rows.length > 0 ? rows : [],
      totalFinishKg: totals.totalFinishKg,
      totalWaste10Kg: totals.totalWaste10Kg,
      wash10Pct: totals.wash10Pct,
      notes,
      comments,
      history: [
        ...(history || []),
        {
          timestamp: now,
          user: merchandiser,
          action: "Submitted to CAD",
          status: "Pending CAD",
          notes: `Request submitted to CAD queue. Remarks: ${requestRemarks || "Standard marker estimation requested."}`,
        },
      ],
    };

    MMRepository.saveFabricConsumptionCadRecord(record);
    setRecordId(id);
    setStatus("Pending CAD");
    setSubmittedDate(now);
    setHistory(record.history || []);
    setMode("view");
    toast.success(`Request ${record.requestNo} submitted to CAD team queue successfully!`);
  };

  // ── CAD Team Actions ──────────────────────────────────────────
  const handleUpdateCadRow = (index: number, field: keyof MMCadItemRow, value: any) => {
    if (mode === "view") return;
    setRows((prev) => {
      const copy = [...prev];
      const target = { ...copy[index], [field]: value };

      // Condumption conversion helper
      let condVal = 12;
      if (field === "condumption") {
        condVal = Number(value) === 1 || String(value).toUpperCase().includes("PCS") ? 1 : 12;
        target.condumption = condVal;
      } else {
        condVal = Number(target.condumption) === 1 ? 1 : 12;
      }

      // If user toggled mode to Auto, recompute finishKgConsumption and waste10Consumption immediately
      if (field === "calculationMode" && value === "Auto") {
        const markerLength = Number(target.markerLength) || 0;
        const diaFinish = Number(target.diaFinish) || 0;
        const fabricGsm = Number(target.fabricGsm) || 0;
        const law = Number(target.law) || 1550;
        const markerQty = Number(target.markerQty) || 1;
        if (law > 0 && markerQty > 0) {
          target.finishKgConsumption = Number(
            (((markerLength * diaFinish * fabricGsm) / law / markerQty) * condVal).toFixed(3)
          );
        }
        target.waste10Consumption = Number((target.finishKgConsumption * 1.1).toFixed(3));
      }

      // If user changed diaFinish or cuttableFinish, recompute diaCut
      if (field === "diaFinish" || field === "cuttableFinish") {
        const df = field === "diaFinish" ? Number(value) || 0 : Number(target.diaFinish) || 0;
        const cf = field === "cuttableFinish" ? Number(value) || 0 : Number(target.cuttableFinish) || 0;
        target.diaCut = Number((df - cf).toFixed(2));
      }

      // If in Auto mode and any formula variable changed, recalculate finish consumption & waste+10%
      if (
        target.calculationMode === "Auto" &&
        (field === "markerLength" ||
          field === "diaFinish" ||
          field === "fabricGsm" ||
          field === "law" ||
          field === "markerQty" ||
          field === "condumption")
      ) {
        const ml = field === "markerLength" ? Number(value) || 0 : Number(target.markerLength) || 0;
        const df = field === "diaFinish" ? Number(value) || 0 : Number(target.diaFinish) || 0;
        const gsm = field === "fabricGsm" ? Number(value) || 0 : Number(target.fabricGsm) || 0;
        const law = field === "law" ? Number(value) || 1550 : Number(target.law) || 1550;
        const mq = field === "markerQty" ? Number(value) || 1 : Number(target.markerQty) || 1;

        if (law > 0 && mq > 0) {
          target.finishKgConsumption = Number((((ml * df * gsm) / law / mq) * condVal).toFixed(3));
          target.waste10Consumption = Number((target.finishKgConsumption * 1.1).toFixed(3));
        }
      }

      // In Manual mode, allow user to set finishKgConsumption or waste10Consumption manually
      if (target.calculationMode === "Manual") {
        if (field === "finishKgConsumption") {
          target.finishKgConsumption = Number(value) || 0;
          // If waste10Consumption is not yet set or was zero, update it as default 1.1
          if (target.waste10Consumption === 0) {
            target.waste10Consumption = Number(((Number(value) || 0) * 1.1).toFixed(3));
          }
        }
        if (field === "waste10Consumption") {
          target.waste10Consumption = Number(value) || 0;
        }
      }

      copy[index] = target;
      return copy;
    });
  };

  const handleAddCadRow = () => {
    if (mode === "view") return;
    const nextSl = rows.length + 1;
    const defaultPart = cadBodyParts[0] || "BODY";
    const newRow: MMCadItemRow = {
      id: `cad-r-${Date.now()}-${nextSl}`,
      sl: nextSl,
      bodyPart: defaultPart,
      markerLength: 10.0,
      diaFinish: 60.0,
      diaCut: 58.0,
      markerQty: 2,
      fabricGsm: 200,
      calculationMode: "Auto",
      finishKgConsumption: 0,
      waste10Consumption: 0,
      diaMake: "OPEN",
      law: 1550,
      condumption: 12,
      cuttableFinish: 2,
      consumptionRatio: 0,
    };
    const calculated = calculateCadRow(newRow, totals.totalFinishKg);
    setRows((prev) => [...prev, calculated]);
  };

  const handleRemoveCadRow = (index: number) => {
    if (mode === "view") return;
    if (rows.length <= 1) {
      toast.error("At least one body-part row is required.");
      return;
    }
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveCadDraft = () => {
    if (!recordId) {
      toast.error("No active request to save CAD draft for.");
      return;
    }
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const currentRec = MMRepository.getFabricConsumptionCadById(recordId);
    if (!currentRec) return;

    // Detect if Efficiency or Fabrication was updated by CAD
    const changedFields: string[] = [];
    if (currentRec.efficiency !== efficiency) changedFields.push(`Efficiency: "${efficiency}"`);
    if (currentRec.fabrication !== fabrication) changedFields.push(`Fabrication: "${fabrication}"`);

    const updatedRecord: MMFabricConsumptionCadRecord = {
      ...currentRec,
      efficiency, // Persist CAD edited Efficiency
      fabrication, // Persist CAD edited Fabrication
      status: "In Progress",
      cadResponseStatus: "In Progress",
      cadAssignedTo,
      attachments,
      rows,
      totalFinishKg: totals.totalFinishKg,
      totalWaste10Kg: totals.totalWaste10Kg,
      wash10Pct: totals.wash10Pct,
      notes,
      comments,
      history: [
        ...(currentRec.history || []),
        {
          timestamp: now,
          user: getLoggedInUser(),
          action: "CAD Draft Saved",
          status: "In Progress",
          notes:
            changedFields.length > 0
              ? `CAD draft saved with updated ${changedFields.join(", ")}.`
              : "CAD calculation draft saved. Calculations pending final submission.",
        },
      ],
    };

    MMRepository.saveFabricConsumptionCadRecord(updatedRecord);
    setStatus("In Progress");
    setCadResponseStatus("In Progress");
    setHistory(updatedRecord.history || []);
    toast.success("CAD draft saved. Status updated to 'In Progress'.");
  };

  const handleSubmitCadResponse = () => {
    if (!recordId) {
      toast.error("No active request to submit CAD response for.");
      return;
    }
    if (rows.length === 0) {
      toast.error("Please add at least one body part calculation row.");
      return;
    }
    if (totals.totalFinishKg <= 0) {
      toast.error("Calculated total consumption must be greater than zero.");
      return;
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const currentRec = MMRepository.getFabricConsumptionCadById(recordId);
    if (!currentRec) return;

    const loggedIn = getLoggedInUser();
    const updatedRecord: MMFabricConsumptionCadRecord = {
      ...currentRec,
      efficiency, // Persist CAD edited Efficiency
      fabrication, // Persist CAD edited Fabrication
      status: "CAD Submitted",
      cadResponseStatus: "Received", // Formally mark as Received for Merchandiser
      cadAssignedTo,
      cadResponseDate: now,
      cadSubmittedBy: loggedIn,
      cadSubmissionTimestamp: now,
      attachments,
      rows,
      totalFinishKg: totals.totalFinishKg,
      totalWaste10Kg: totals.totalWaste10Kg,
      wash10Pct: totals.wash10Pct,
      notes,
      comments,
      history: [
        ...(currentRec.history || []),
        {
          timestamp: now,
          user: loggedIn,
          action: "CAD Response Submitted",
          status: "CAD Submitted",
          notes: `Completed fabric consumption calculations (${totals.totalFinishKg} Finish Kg, ${totals.totalWaste10Kg} Waste+10% Kg). Marked as Received for Merchandiser.`,
        },
      ],
    };

    MMRepository.saveFabricConsumptionCadRecord(updatedRecord);
    setStatus("CAD Submitted");
    setCadResponseStatus("Received");
    setCadResponseDate(now);
    setCadSubmittedBy(loggedIn);
    setHistory(updatedRecord.history || []);
    setMode("view");
    toast.success("CAD Response submitted successfully! Consumption Received by Merchant.");
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header Navigation & Status Bar ─────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToList}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Back to Register"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>
                {mode === "create"
                  ? "New Fabric Consumption Request (Merchant)"
                  : mode === "cad-response"
                  ? `CAD Consumption Entry — ${requestNo}`
                  : `Fabric Consumption Details — ${requestNo}`}
              </span>
              {cadResponseStatus === "Received" ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="size-3.5" /> Consumption Received
                </span>
              ) : cadResponseStatus === "In Progress" ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <Clock className="size-3.5" /> CAD In Progress
                </span>
              ) : status === "Pending CAD" ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <Clock className="size-3.5" /> Pending CAD Queue
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Merchant Draft
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Mode Switcher / Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Clearly Visible Dedicated Preview Report Button */}
          <button
            type="button"
            onClick={() => setShowPreviewReportModal(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-1.5 shadow-xs transition-all"
            title="Open Dedicated Preview Report"
          >
            <FileText className="size-3.5 text-teal-600" />
            <span>Preview Report</span>
          </button>
          {mode === "view" && (
            <>
              {status === "Draft" && (
                <button
                  type="button"
                  onClick={() => setMode("edit")}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Edit Request
                </button>
              )}
              {(status === "Pending CAD" || status === "In Progress") && (
                <button
                  type="button"
                  onClick={() => setMode("cad-response")}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Scissors className="size-3.5" /> Enter CAD Calculations
                </button>
              )}
              {status === "CAD Submitted" && (
                <button
                  type="button"
                  onClick={() => setMode("cad-response")}
                  className="px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 cursor-pointer flex items-center gap-1.5"
                >
                  <Calculator className="size-3.5" /> Re-open CAD Data
                </button>
              )}
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="size-3.5" /> Print
              </button>
            </>
          )}

          {mode === "create" || mode === "edit" ? (
            <>
              <button
                type="button"
                onClick={handleSaveMerchantDraft}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Save className="size-3.5" /> Save Draft
              </button>
              <button
                type="button"
                onClick={handleSubmitToCad}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Send className="size-3.5" /> Submit to CAD
              </button>
            </>
          ) : mode === "cad-response" ? (
            <>
              <button
                type="button"
                onClick={handleSaveCadDraft}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Save className="size-3.5" /> Save CAD Draft
              </button>
              <button
                type="button"
                onClick={handleSubmitCadResponse}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="size-3.5" /> Submit Response to Merchant
              </button>
            </>
          ) : null}
        </div>
      </div>

      {/* ── SECTION 1: REQUEST HEADER INFORMATION ─────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-teal-600 rounded-full inline-block" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="size-4 text-teal-600" />
              <span>Request Header Information</span>
            </h2>
          </div>
        </div>

        {/* Section 1 Fields (JOB ID removed, Buyer before Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 text-xs">
          {/* Request No. */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Request No.
            </label>
            <input
              type="text"
              readOnly
              value={requestNo}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono font-bold cursor-not-allowed text-xs"
            />
          </div>

          {/* Buyer * (Moved BEFORE Style, with searchable dropdown functionality) */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Buyer <span className="text-rose-500">*</span>
            </label>
            {mode === "create" || mode === "edit" ? (
              <SearchableSelect
                options={buyerOptions}
                value={buyer}
                onChange={handleBuyerChange}
                placeholder="Search & select Buyer..."
              />
            ) : (
              <input
                type="text"
                readOnly
                value={buyer}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs"
              />
            )}
          </div>

          {/* Style * (Renamed from Style / Order *, placed immediately after Buyer, filtered by selected Buyer) */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Style <span className="text-rose-500">*</span>
            </label>
            {mode === "create" || mode === "edit" ? (
              availableStyles.length > 0 ? (
                <SearchableSelect
                  options={availableStyles}
                  value={styleOrder}
                  onChange={(val) => setStyleOrder(val)}
                  placeholder="Select Style..."
                />
              ) : (
                <input
                  type="text"
                  value={styleOrder}
                  onChange={(e) => setStyleOrder(e.target.value)}
                  placeholder="e.g. APEROL-BASEBALL-JACKET"
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold text-xs focus:ring-2 focus:ring-teal-500"
                />
              )
            ) : (
              <input
                type="text"
                readOnly
                value={styleOrder}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs"
              />
            )}
          </div>

          {/* Efficiency (%) — Blank by default, editable in both Merchant and CAD response modes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Efficiency (%)
            </label>
            <input
              type="text"
              readOnly={mode === "view"}
              value={efficiency}
              onChange={(e) => setEfficiency(e.target.value)}
              placeholder="e.g. 85%"
              className={`w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs transition-all ${
                mode === "view"
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 border-indigo-200 dark:border-indigo-800"
              }`}
            />
          </div>

          {/* Size Range — Loaded from selected Buyer's configured size data */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Size Range
            </label>
            {mode === "create" || mode === "edit" ? (
              availableBuyerSizes.length > 0 ? (
                <div className="relative">
                  <select
                    value={sizeRange}
                    onChange={(e) => setSizeRange(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold text-xs focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Size Range...</option>
                    {availableBuyerSizes.map((sz) => (
                      <option key={sz.value} value={sz.value}>
                        {sz.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <input
                  type="text"
                  value={sizeRange}
                  onChange={(e) => setSizeRange(e.target.value)}
                  placeholder="e.g. S TO L"
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold text-xs focus:ring-2 focus:ring-teal-500"
                />
              )
            ) : (
              <input
                type="text"
                readOnly
                value={sizeRange || "—"}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              />
            )}
          </div>

          {/* Fabrication * — Blank by default, editable in both Merchant and CAD response modes */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Fabrication <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              readOnly={mode === "view"}
              value={fabrication}
              onChange={(e) => setFabrication(e.target.value)}
              placeholder="e.g. BODY+SLV 370 GSM"
              className={`w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold text-xs transition-all ${
                mode === "view"
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 border-indigo-200 dark:border-indigo-800"
              }`}
            />
          </div>

          {/* Season */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Season
            </label>
            {mode === "create" || mode === "edit" ? (
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold text-xs focus:ring-2 focus:ring-teal-500"
              >
                {seasonsMaster.map((s) => (
                  <option key={s.id} value={s.seasonName}>
                    {s.seasonName}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                readOnly
                value={season}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs"
              />
            )}
          </div>

          {/* Merchandiser */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Merchandiser
            </label>
            <input
              type="text"
              readOnly
              value={merchandiser}
              className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
            />
          </div>

          {/* Request Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Request Date
            </label>
            <input
              type="date"
              readOnly={mode === "view" || mode === "cad-response"}
              value={requestDate}
              onChange={(e) => setRequestDate(e.target.value)}
              className={`w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold text-xs ${
                mode === "view" || mode === "cad-response"
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
              }`}
            />
          </div>

          {/* Request Remarks / Instructions + Attachment Button immediately to the right */}
          <div className="lg:col-span-6 flex flex-col md:flex-row items-stretch md:items-end gap-3 pt-1">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Request Remarks / Instructions to CAD Team
              </label>
              <textarea
                rows={2}
                readOnly={mode === "view" || mode === "cad-response"}
                value={requestRemarks}
                onChange={(e) => setRequestRemarks(e.target.value)}
                placeholder="Provide any specific cutting or marker requirements, shrinkage observations, or pattern instructions..."
                className={`w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-normal ${
                  mode === "view" || mode === "cad-response"
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
                }`}
              />
            </div>

            {/* Attachment Button immediately to the right */}
            <div className="shrink-0 mb-0.5">
              <button
                type="button"
                onClick={() => setShowAttachmentModal(true)}
                className="h-10 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-all whitespace-nowrap"
                title="View and manage request document attachments"
              >
                <Paperclip className="size-4 text-teal-600" />
                <span>Attachment ({attachments.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: CAD FABRIC CONSUMPTION DETAILS ──────────────── */}
      {(mode === "cad-response" || mode === "view" || status !== "Draft") && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-600 rounded-full inline-block" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="size-4 text-indigo-600" />
                <span>CAD Fabric Consumption Details</span>
              </h2>
            </div>

            {mode === "cad-response" && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddCadRow}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Plus className="size-3.5" /> Add Body Part Row
                </button>
              </div>
            )}
          </div>

          {/* Calculation Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-[11px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">
                  <th className="py-2.5 px-3 text-center w-10">SL</th>
                  <th className="py-2.5 px-3 min-w-[210px]">
                    <div className="flex items-center justify-between gap-2">
                      <span>Name of Body Parts</span>
                      <button
                        type="button"
                        onClick={() => handleOpenAddBodyPartModal(null)}
                        className="p-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-2xs"
                        title="Add new body part to catalog"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </th>
                  <th className="py-2.5 px-2 text-right min-w-[90px]">Marker Length</th>
                  <th className="py-2.5 px-2 text-right min-w-[85px]">DIA Finish</th>
                  <th className="py-2.5 px-2 text-right min-w-[80px] bg-slate-50 dark:bg-slate-800/50">DIA Cut</th>
                  <th className="py-2.5 px-2 text-right min-w-[80px]">Marker QTY</th>
                  <th className="py-2.5 px-2 text-right min-w-[80px]">Fabric GSM</th>
                  <th className="py-2.5 px-2 text-center min-w-[100px] bg-indigo-50/50 dark:bg-indigo-950/20">Calculation</th>
                  <th className="py-2.5 px-3 text-right min-w-[125px] bg-emerald-50/50 dark:bg-emerald-950/20 font-black text-emerald-800 dark:text-emerald-400">
                    Finish/KG Consumption
                  </th>
                  <th className="py-2.5 px-3 text-right min-w-[125px] bg-teal-50/50 dark:bg-teal-950/20 font-black text-teal-800 dark:text-teal-400">
                    Waste+10%/KG
                  </th>
                  <th className="py-2.5 px-2 text-center min-w-[95px]">DIA make</th>
                  {/* Law column aligned to LEFT */}
                  <th className="py-2.5 px-2 text-left min-w-[75px] text-rose-600 font-bold">Law</th>
                  <th className="py-2.5 px-2 text-center min-w-[80px] text-rose-600 font-bold">Consumption</th>
                  <th className="py-2.5 px-2 text-right min-w-[80px] text-rose-600 font-bold">Cuttable finish</th>
                  {/* Replaced Ratio (%) with WASH 10% */}
                  <th className="py-2.5 px-3 text-right min-w-[100px] bg-indigo-50/40 dark:bg-indigo-950/20 font-black text-indigo-700 dark:text-indigo-400">
                    WASH 10%
                  </th>
                  {mode === "cad-response" && <th className="py-2.5 px-2 text-center w-10">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map((row, idx) => {
                  const isManual = row.calculationMode === "Manual";

                  return (
                    <tr
                      key={row.id || idx}
                      className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                        isManual ? "bg-amber-50/20 dark:bg-amber-950/10" : ""
                      }`}
                    >
                      {/* SL */}
                      <td className="py-2 px-3 text-center text-slate-400 font-mono font-bold">
                        {idx + 1}
                      </td>

                      {/* Name of Body Parts: Searchable list without row + button */}
                      <td className="py-1.5 px-2">
                        {mode === "cad-response" ? (
                          <div className="relative">
                            <input
                              type="text"
                              value={row.bodyPart}
                              onChange={(e) => handleUpdateCadRow(idx, "bodyPart", e.target.value)}
                              list={`body-part-suggestions-${idx}`}
                              placeholder="Select or type body part..."
                              className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs focus:ring-2 focus:ring-teal-500"
                            />
                            <datalist id={`body-part-suggestions-${idx}`}>
                              {cadBodyParts.map((bp) => (
                                <option key={bp} value={bp} />
                              ))}
                            </datalist>
                          </div>
                        ) : (
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {row.bodyPart}
                          </span>
                        )}
                      </td>

                      {/* Marker Length */}
                      <td className="py-1.5 px-2 text-right">
                        {mode === "cad-response" ? (
                          <input
                            type="number"
                            step="0.01"
                            value={row.markerLength}
                            onChange={(e) => handleUpdateCadRow(idx, "markerLength", e.target.value)}
                            className="w-full h-8 px-2 text-right rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-semibold"
                          />
                        ) : (
                          <span className="font-mono">{Number(row.markerLength).toFixed(2)}</span>
                        )}
                      </td>

                      {/* DIA Finish */}
                      <td className="py-1.5 px-2 text-right">
                        {mode === "cad-response" ? (
                          <input
                            type="number"
                            step="0.01"
                            value={row.diaFinish}
                            onChange={(e) => handleUpdateCadRow(idx, "diaFinish", e.target.value)}
                            className="w-full h-8 px-2 text-right rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-semibold"
                          />
                        ) : (
                          <span className="font-mono">{Number(row.diaFinish).toFixed(2)}</span>
                        )}
                      </td>

                      {/* DIA Cut (Calculative) */}
                      <td className="py-2 px-2 text-right font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40">
                        {Number(row.diaCut).toFixed(2)}
                      </td>

                      {/* Marker QTY */}
                      <td className="py-1.5 px-2 text-right">
                        {mode === "cad-response" ? (
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={row.markerQty}
                            onChange={(e) => handleUpdateCadRow(idx, "markerQty", e.target.value)}
                            className="w-full h-8 px-2 text-right rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-semibold"
                          />
                        ) : (
                          <span className="font-mono">{row.markerQty}</span>
                        )}
                      </td>

                      {/* Fabric GSM */}
                      <td className="py-1.5 px-2 text-right">
                        {mode === "cad-response" ? (
                          <input
                            type="number"
                            step="1"
                            value={row.fabricGsm}
                            onChange={(e) => handleUpdateCadRow(idx, "fabricGsm", e.target.value)}
                            className="w-full h-8 px-2 text-right rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-semibold"
                          />
                        ) : (
                          <span className="font-mono">{row.fabricGsm}</span>
                        )}
                      </td>

                      {/* Calculation Mode Dropdown */}
                      <td className="py-1.5 px-2 text-center bg-indigo-50/30 dark:bg-indigo-950/10">
                        {mode === "cad-response" ? (
                          <select
                            value={row.calculationMode}
                            onChange={(e) =>
                              handleUpdateCadRow(idx, "calculationMode", e.target.value as MMCadCalculationMode)
                            }
                            className={`h-8 px-2 rounded-lg border text-xs font-bold cursor-pointer ${
                              isManual
                                ? "bg-amber-100 text-amber-900 border-amber-300"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-400"
                            }`}
                          >
                            <option value="Auto">Auto</option>
                            <option value="Manual">Manual</option>
                          </select>
                        ) : (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isManual
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                : "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300"
                            }`}
                          >
                            {row.calculationMode}
                          </span>
                        )}
                      </td>

                      {/* Finish/KG Consumption — Allows manual entry in Manual mode */}
                      <td
                        className={`py-1.5 px-3 text-right font-mono font-black ${
                          isManual
                            ? "bg-amber-100/60 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200"
                            : "bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
                        }`}
                      >
                        {mode === "cad-response" && isManual ? (
                          <input
                            type="number"
                            step="0.001"
                            value={row.finishKgConsumption}
                            onChange={(e) =>
                              handleUpdateCadRow(idx, "finishKgConsumption", e.target.value)
                            }
                            title="Manual finish consumption entry"
                            className="w-full h-8 px-2 text-right rounded-lg border border-amber-400 bg-amber-50 text-amber-950 font-mono font-black text-xs"
                          />
                        ) : (
                          <span>{Number(row.finishKgConsumption).toFixed(3)}</span>
                        )}
                      </td>

                      {/* Waste+10%/KG Consumption — Allows manual entry in Manual mode */}
                      <td
                        className={`py-1.5 px-3 text-right font-mono font-black ${
                          isManual
                            ? "bg-amber-100/60 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200"
                            : "bg-teal-50/40 dark:bg-teal-950/10 text-teal-700 dark:text-teal-400"
                        }`}
                      >
                        {mode === "cad-response" && isManual ? (
                          <input
                            type="number"
                            step="0.001"
                            value={row.waste10Consumption}
                            onChange={(e) =>
                              handleUpdateCadRow(idx, "waste10Consumption", e.target.value)
                            }
                            title="Manual waste+10% entry"
                            className="w-full h-8 px-2 text-right rounded-lg border border-amber-400 bg-amber-50 text-amber-950 font-mono font-black text-xs"
                          />
                        ) : (
                          <span>{Number(row.waste10Consumption).toFixed(3)}</span>
                        )}
                      </td>

                      {/* DIA make — Text input field */}
                      <td className="py-1.5 px-2 text-center">
                        {mode === "cad-response" ? (
                          <input
                            type="text"
                            value={row.diaMake}
                            onChange={(e) => handleUpdateCadRow(idx, "diaMake", e.target.value)}
                            placeholder="e.g. OPEN"
                            className="w-full h-8 px-2 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold uppercase"
                          />
                        ) : (
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {row.diaMake}
                          </span>
                        )}
                      </td>

                      {/* Law (1550) — Left aligned consistently */}
                      <td className="py-1.5 px-2 text-left">
                        {mode === "cad-response" ? (
                          <input
                            type="number"
                            value={row.law}
                            onChange={(e) => handleUpdateCadRow(idx, "law", e.target.value)}
                            className="w-full h-8 px-2 text-left rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-rose-600 font-bold"
                          />
                        ) : (
                          <span className="font-mono text-rose-600 font-bold block text-left">
                            {row.law}
                          </span>
                        )}
                      </td>

                      {/* Condumption: Selection options limited to only DZ and PCS */}
                      <td className="py-1.5 px-2 text-center">
                        {mode === "cad-response" ? (
                          <select
                            value={row.condumption === 1 ? 1 : 12}
                            onChange={(e) =>
                              handleUpdateCadRow(idx, "condumption", Number(e.target.value))
                            }
                            className="h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-rose-600 font-bold text-xs"
                          >
                            <option value={12}>DZ</option>
                            <option value={1}>PCS</option>
                          </select>
                        ) : (
                          <span className="font-mono text-rose-600 font-bold">
                            {row.condumption === 1 || String(row.condumption).includes("PCS")
                              ? "PCS"
                              : "DZ"}
                          </span>
                        )}
                      </td>

                      {/* Cuttable finish (2) */}
                      <td className="py-1.5 px-2 text-right">
                        {mode === "cad-response" ? (
                          <input
                            type="number"
                            value={row.cuttableFinish}
                            onChange={(e) => handleUpdateCadRow(idx, "cuttableFinish", e.target.value)}
                            className="w-full h-8 px-1 text-right rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-rose-600 font-bold"
                          />
                        ) : (
                          <span className="font-mono text-rose-600 font-bold">
                            {row.cuttableFinish}
                          </span>
                        )}
                      </td>

                      {/* WASH 10% Column (Replaced Ratio (%))
                          Displayed in only ONE designated row (row index 0), all other rows blank */}
                      <td className="py-2 px-3 text-right font-mono font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50/30 dark:bg-indigo-950/15">
                        {idx === 0 ? totals.wash10Pct.toFixed(3) : ""}
                      </td>

                      {/* Action */}
                      {mode === "cad-response" && (
                        <td className="py-1.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveCadRow(idx)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                            title="Remove body part row"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>

              {/* Table Footer Summary Row */}
              <tfoot>
                <tr className="bg-slate-200/80 dark:bg-slate-800 font-black text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700">
                  <td colSpan={7} className="py-3 px-3 text-right uppercase tracking-wider text-xs">
                    Finish Total:
                  </td>
                  <td className="py-3 px-2 text-center text-indigo-600 text-[10px]">
                    {rows.filter((r) => r.calculationMode === "Auto").length} Auto /{" "}
                    {rows.filter((r) => r.calculationMode === "Manual").length} Man
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-950/40">
                    {totals.totalFinishKg.toFixed(3)}
                  </td>
                  {/* Waste+10%/KG Total Display: Removed "KG" or "Kgs" suffix, purely numeric total */}
                  <td className="py-3 px-3 text-right font-mono text-xs text-teal-700 dark:text-teal-400 bg-teal-100/50 dark:bg-teal-950/40">
                    {totals.totalWaste10Kg.toFixed(3)}
                  </td>
                  <td
                    colSpan={4}
                    className="py-3 px-3 text-right text-xs uppercase font-bold text-slate-600 dark:text-slate-400"
                  >
                    WASH 10% (Total Waste):
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-xs text-indigo-600 dark:text-indigo-400 font-black bg-indigo-100/50 dark:bg-indigo-950/40">
                    {totals.wash10Pct.toFixed(3)}
                  </td>
                  {mode === "cad-response" && <td></td>}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Notes and Comments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Note:
              </label>
              <input
                type="text"
                readOnly={mode === "view"}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. .."
                className={`w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold ${
                  mode === "view"
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                }`}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Comments:
              </label>
              <input
                type="text"
                readOnly={mode === "view"}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="e.g. ONE BODY ONE WAY CUTTING."
                className={`w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold uppercase ${
                  mode === "view"
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                }`}
              />
            </div>
          </div>

          {/* CAD Response Status Banner when submitted */}
          {cadResponseStatus === "Received" && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-200">
                    Fabric Consumption Response Received from CAD
                  </h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Submitted by <strong>{cadSubmittedBy || "CAD In-Charge"}</strong> on{" "}
                    <strong>{cadResponseDate || "Recently"}</strong>. Total finish fabric:{" "}
                    <strong>{totals.totalFinishKg.toFixed(3)} Kg</strong> | Total with 10% waste:{" "}
                    <strong>{totals.totalWaste10Kg.toFixed(3)} Kg</strong>.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
                Verified & Ready for Costing
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── SECTION 3: REQUEST & RESPONSE WORKFLOW HISTORY ──────────── */}
      {history && history.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="w-1.5 h-4 bg-slate-500 rounded-full inline-block" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              3. Request & Response Workflow History
            </h2>
          </div>

          <div className="space-y-2">
            {history.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-teal-500"></span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{h.action}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 font-medium">{h.user}</span>
                  {h.notes && (
                    <>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 dark:text-slate-400 italic text-[11px]">{h.notes}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <span>{h.timestamp}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {h.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Attachment Modal (PI Entry Form design) ────────────────── */}
      <MMFabricConsumptionAttachmentModal
        isOpen={showAttachmentModal}
        onClose={() => setShowAttachmentModal(false)}
        requestNo={requestNo}
        buyerName={buyer}
        styleName={styleOrder}
        attachments={attachments}
        onAddAttachment={handleAddAttachment}
        onDeleteAttachment={handleDeleteAttachment}
        currentUser={getLoggedInUser()}
        currentRole={mode === "cad-response" ? "CAD" : "Merchant"}
        readOnly={mode === "view" && status === "CAD Submitted" && false}
      />

      {/* ── Add New Body Part to Catalog Dialog Modal ──────────────── */}
      {showAddBodyPartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="size-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Add New Body Part to Catalog
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddBodyPartModal(false);
                  setNewBodyPartName("");
                  setTargetRowIndexForNewBodyPart(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Body Part Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newBodyPartName}
                  onChange={(e) => setNewBodyPartName(e.target.value)}
                  placeholder="e.g. HOOD 2-PANEL / COLLAR STAND"
                  className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold uppercase focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSaveNewBodyPart();
                    }
                  }}
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  This body part will be added to the master list and immediately selected for the current row.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowAddBodyPartModal(false);
                  setNewBodyPartName("");
                  setTargetRowIndexForNewBodyPart(null);
                }}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewBodyPart}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="size-3.5" />
                <span>Save Body Part</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FABRIC CONSUMPTION DEDICATED PREVIEW REPORT MODAL ── */}
      <FabricConsumptionPreviewModal
        isOpen={showPreviewReportModal}
        onClose={() => setShowPreviewReportModal(false)}
        data={{
          requestNo,
          requestDate,
          buyer,
          styleOrder,
          efficiency,
          sizeRange,
          fabrication,
          season,
          merchandiser,
          requestRemarks,
          submittedDate,
          cadAssignedTo,
          cadResponseDate,
          cadSubmittedBy,
          status,
          cadResponseStatus,
          notes,
          comments,
          attachments,
          rows,
          totals,
        }}
      />
    </div>
  );
}

export default FabricConsumptionCadForm;
