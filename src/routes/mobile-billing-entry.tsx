import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  ChevronRight,
  Smartphone,
  RotateCcw,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  Send,
  Users,
  ShieldCheck,
  Building2,
  Upload,
  X,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { MultiSelect } from "@/components/ui/multi-select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  MobileBillRecord,
  BILLING_YEARS,
  BILLING_MONTHS,
  COMPANIES_LIST,
  LOCATIONS_LIST,
  DEPARTMENTS_LIST,
  loadMobileBillingRecords,
  saveMobileBillingRecords,
  resetMobileBillingToDefaults,
  generateSeedEmployeeBills,
} from "./-mobile-billing-data";

export const Route = createFileRoute("/mobile-billing-entry")({
  head: () => ({
    meta: [
      { title: "Mobile Bill Entry — CRIPTON HRIS" },
      {
        name: "description",
        content: "Month-wise mobile bill entry, corporate SIM limits, and locked bill submissions.",
      },
    ],
  }),
  component: MobileBillEntryPage,
});

export function MobileBillEntryPage() {
  // All billing records in memory
  const [allRecords, setAllRecords] = useState<MobileBillRecord[]>([]);

  // Searchable single-select filters
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<string>("October");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");

  // Searchable multi-select filters
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");

  // Table display state: initially empty until user filters
  const [hasFiltered, setHasFiltered] = useState<boolean>(false);

  // Active filtered view records
  const [activeRecords, setActiveRecords] = useState<MobileBillRecord[]>([]);

  // Excel Upload Modal State
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [excelFileName, setExcelFileName] = useState("");
  const [isProcessingExcel, setIsProcessingExcel] = useState(false);
  const [parsedExcelMatches, setParsedExcelMatches] = useState<
    {
      rowNumber: number;
      mobile: string;
      empId: string;
      amount: number;
      matchedStaff: MobileBillRecord | null;
    }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Options for searchable selects
  const yearOptions = useMemo(
    () => BILLING_YEARS.map((y) => ({ value: String(y), label: String(y) })),
    []
  );

  const monthOptions = useMemo(
    () => BILLING_MONTHS.map((m) => ({ value: m, label: m })),
    []
  );

  const locationOptions = useMemo(
    () => [
      { value: "ALL", label: "All Locations" },
      ...LOCATIONS_LIST.map((loc) => ({ value: loc, label: loc })),
    ],
    []
  );

  const companyOptions = useMemo(
    () => COMPANIES_LIST.map((c) => ({ value: c.code, label: c.code })),
    []
  );

  const departmentOptions = useMemo(
    () => DEPARTMENTS_LIST.map((d) => ({ value: d, label: d })),
    []
  );

  // Load from local storage on mount
  useEffect(() => {
    const loaded = loadMobileBillingRecords();
    setAllRecords(loaded);
  }, []);

  // Format currency helpers
  const fmt = (v: number) =>
    v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Clean and normalize phone number for matching
  const cleanPhone = (phone: any): string => {
    if (!phone) return "";
    let p = String(phone).replace(/[^0-9]/g, "");
    if (p.startsWith("880") && p.length === 13) {
      p = p.substring(2);
    }
    if (p.length === 10 && p.startsWith("1")) {
      p = "0" + p;
    }
    return p;
  };

  // Helper to get or build current month base records
  const getOrInitializeMonthRecords = (): MobileBillRecord[] => {
    const cycle = `${selectedMonth}-${selectedYear}`;
    let existingForMonth = allRecords.filter(
      (r) => r.year === selectedYear && (r.month === selectedMonth || r.billCycle === cycle)
    );

    if (existingForMonth.length === 0) {
      const templateStaff = generateSeedEmployeeBills();
      existingForMonth = templateStaff.map((s, idx) => ({
        ...s,
        id: `bill-${selectedYear}-${selectedMonth}-${idx + 1}`,
        year: selectedYear,
        month: selectedMonth,
        billCycle: cycle,
        billingMonth: `${BILLING_MONTHS[BILLING_MONTHS.indexOf(selectedMonth) === 0 ? 11 : BILLING_MONTHS.indexOf(selectedMonth) - 1]}-${selectedYear}`,
        actualBill: s.actualBill || 0,
        deduction: s.actualBill > s.limit ? Number((s.actualBill - s.limit).toFixed(2)) : 0,
        totalPayment: s.actualBill > s.limit ? s.limit : s.actualBill,
        status: "Active",
        isLocked: false,
      }));

      const merged = [...existingForMonth, ...allRecords];
      setAllRecords(merged);
      saveMobileBillingRecords(merged);
    }
    return existingForMonth;
  };

  // Handle "Filter / Load List"
  const handleApplyFilter = () => {
    const existingForMonth = getOrInitializeMonthRecords();

    // Filter by selected company, department, location
    const matched = existingForMonth.filter((r) => {
      // Company multi-select
      if (selectedCompanies.length > 0) {
        const matches = selectedCompanies.some(
          (c) => r.companyCode === c || r.companyCode.includes(c)
        );
        if (!matches) return false;
      }

      // Department multi-select
      if (selectedDepartments.length > 0) {
        if (!selectedDepartments.includes(r.department)) {
          return false;
        }
      }

      // Location
      if (selectedLocation !== "ALL" && r.location !== selectedLocation) {
        return false;
      }

      return true;
    });

    setActiveRecords(matched);
    setHasFiltered(true);

    if (matched.length > 0) {
      toast.success(`Loaded ${matched.length} staff records for ${selectedMonth} ${selectedYear}!`);
    } else {
      toast.info("No corporate SIM profiles found for the selected scope.");
    }
  };

  // Reset filters and empty list
  const handleResetFilters = () => {
    setSelectedYear(2026);
    setSelectedMonth("October");
    setSelectedCompanies([]);
    setSelectedDepartments([]);
    setSelectedLocation("ALL");
    setSearchQuery("");
    setHasFiltered(false);
    setActiveRecords([]);
    toast.info("Filters reset. Screen is cleared.");
  };

  // Handle inline Actual Bill change
  const handleInlineBillChange = (id: string, newBillStr: string) => {
    const newBill = parseFloat(newBillStr) || 0;

    const updateRecord = (item: MobileBillRecord) => {
      if (item.id === id) {
        const deduction = newBill > item.limit ? Number((newBill - item.limit).toFixed(2)) : 0;
        const totalPayment = newBill > item.limit ? item.limit : newBill;
        return {
          ...item,
          actualBill: newBill,
          deduction,
          totalPayment: Number(totalPayment.toFixed(2)),
        };
      }
      return item;
    };

    setActiveRecords((prev) => prev.map(updateRecord));
    setAllRecords((prev) => {
      const updated = prev.map(updateRecord);
      saveMobileBillingRecords(updated);
      return updated;
    });
  };

  // Unlock / Lock a single record
  const handleToggleLock = (id: string) => {
    const updateRecord = (item: MobileBillRecord) => {
      if (item.id === id) {
        const nextState = !item.isLocked;
        return {
          ...item,
          isLocked: nextState,
          status: nextState ? ("Locked" as const) : ("Active" as const),
        };
      }
      return item;
    };

    setActiveRecords((prev) => prev.map(updateRecord));
    setAllRecords((prev) => {
      const updated = prev.map(updateRecord);
      saveMobileBillingRecords(updated);
      return updated;
    });

    const target = activeRecords.find((r) => r.id === id);
    if (target?.isLocked) {
      toast.info(`Unlocked ${target.empName} for bill editing.`);
    } else {
      toast.success(`Locked bill for ${target?.empName}.`);
    }
  };

  // Unlock all rows
  const handleUnlockAll = () => {
    const updateAll = (list: MobileBillRecord[]) =>
      list.map((r) =>
        activeRecords.some((ar) => ar.id === r.id)
          ? { ...r, isLocked: false, status: "Active" as const }
          : r
      );

    setActiveRecords((prev) => prev.map((r) => ({ ...r, isLocked: false, status: "Active" })));
    setAllRecords((prev) => {
      const updated = updateAll(prev);
      saveMobileBillingRecords(updated);
      return updated;
    });
    toast.info("All records unlocked for editing.");
  };

  // Lock all rows
  const handleLockAll = () => {
    const updateAll = (list: MobileBillRecord[]) =>
      list.map((r) =>
        activeRecords.some((ar) => ar.id === r.id)
          ? { ...r, isLocked: true, status: "Locked" as const }
          : r
      );

    setActiveRecords((prev) => prev.map((r) => ({ ...r, isLocked: true, status: "Locked" })));
    setAllRecords((prev) => {
      const updated = updateAll(prev);
      saveMobileBillingRecords(updated);
      return updated;
    });
    toast.success("All records locked.");
  };

  // Final Submit Action: saves all data and locks the bill
  const handleSubmitAllBills = () => {
    if (activeRecords.length === 0) {
      toast.error("No bill records to submit.");
      return;
    }

    const lockedRecords = activeRecords.map((r) => ({
      ...r,
      isLocked: true,
      status: "Submitted" as const,
    }));

    setActiveRecords(lockedRecords);

    setAllRecords((prev) => {
      const activeMap = new Map(lockedRecords.map((r) => [r.id, r]));
      const updated = prev.map((r) => (activeMap.has(r.id) ? activeMap.get(r.id)! : r));
      saveMobileBillingRecords(updated);
      return updated;
    });

    toast.success(
      `Submitted and locked ${activeRecords.length} mobile bills for ${selectedMonth} ${selectedYear}!`,
      {
        description: "All records are now locked. Click 'Unlock' if any modifications are needed.",
      }
    );
  };

  // EXCEL PARSER: Parse uploaded file and match against corporate SIMs
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFileName(file.name);
    setIsProcessingExcel(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (rows.length === 0) {
          toast.error("The uploaded Excel sheet contains no data.");
          setIsProcessingExcel(false);
          return;
        }

        // Get active reference staff list for this month
        const pool = getOrInitializeMonthRecords();

        const matches: {
          rowNumber: number;
          mobile: string;
          empId: string;
          amount: number;
          matchedStaff: MobileBillRecord | null;
        }[] = [];

        rows.forEach((row, idx) => {
          let mobileVal = "";
          let empIdVal = "";
          let amountVal = 0;

          // Intelligently find columns
          for (const key of Object.keys(row)) {
            const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
            const val = row[key];

            // Mobile / SIM column
            if (
              normalizedKey.includes("mobile") ||
              normalizedKey.includes("msisdn") ||
              normalizedKey.includes("phone") ||
              normalizedKey.includes("sim") ||
              normalizedKey === "number"
            ) {
              if (!mobileVal && val) mobileVal = String(val).trim();
            }

            // Emp ID column
            if (
              normalizedKey.includes("empid") ||
              normalizedKey.includes("employeeid") ||
              normalizedKey === "id" ||
              normalizedKey.includes("cardno")
            ) {
              if (!empIdVal && val) empIdVal = String(val).trim();
            }

            // Amount / Bill column
            if (
              normalizedKey.includes("actualbill") ||
              normalizedKey.includes("billamount") ||
              normalizedKey.includes("gpbill") ||
              normalizedKey.includes("amount") ||
              normalizedKey.includes("bill") ||
              normalizedKey.includes("total")
            ) {
              const parsedNum = parseFloat(String(val).replace(/[^0-9.-]/g, ""));
              if (!isNaN(parsedNum)) {
                amountVal = parsedNum;
              }
            }
          }

          // Try matching staff
          const cleanedMobile = cleanPhone(mobileVal);
          let foundStaff: MobileBillRecord | null = null;

          if (cleanedMobile) {
            foundStaff = pool.find((s) => cleanPhone(s.simNo) === cleanedMobile) || null;
          }

          if (!foundStaff && empIdVal) {
            foundStaff = pool.find((s) => s.empId.toLowerCase() === empIdVal.toLowerCase()) || null;
          }

          matches.push({
            rowNumber: idx + 2,
            mobile: mobileVal,
            empId: empIdVal,
            amount: amountVal,
            matchedStaff: foundStaff,
          });
        });

        setParsedExcelMatches(matches);
        setIsExcelModalOpen(true);
        toast.success(`Parsed ${rows.length} rows from ${file.name}!`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to parse Excel file. Please ensure it is a valid .xlsx, .xls, or .csv file.");
      } finally {
        setIsProcessingExcel(false);
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read file.");
      setIsProcessingExcel(false);
    };

    reader.readAsArrayBuffer(file);
    // Reset file input value so user can upload same file if modified
    e.target.value = "";
  };

  // APPLY EXCEL AMOUNTS: Auto-populate matching amounts into the bill sheet
  const handleApplyExcelAmounts = () => {
    const validMatches = parsedExcelMatches.filter((m) => m.matchedStaff !== null);
    if (validMatches.length === 0) {
      toast.error("No matching employees found from the uploaded file.");
      return;
    }

    const monthRecords = getOrInitializeMonthRecords();
    const updateMap = new Map<string, number>();

    validMatches.forEach((m) => {
      if (m.matchedStaff) {
        updateMap.set(m.matchedStaff.id, m.amount);
      }
    });

    const updatedMonthRecords = monthRecords.map((r) => {
      if (updateMap.has(r.id)) {
        const newBill = updateMap.get(r.id)!;
        const deduction = newBill > r.limit ? Number((newBill - r.limit).toFixed(2)) : 0;
        const totalPayment = newBill > r.limit ? r.limit : newBill;
        return {
          ...r,
          actualBill: newBill,
          deduction,
          totalPayment: Number(totalPayment.toFixed(2)),
          isLocked: false, // unlocked so user can inspect and adjust before final submit
          status: "Active" as const,
        };
      }
      return r;
    });

    // Update global store
    const fullUpdated = allRecords.map((r) => {
      const match = updatedMonthRecords.find((ur) => ur.id === r.id);
      return match || r;
    });
    setAllRecords(fullUpdated);
    saveMobileBillingRecords(fullUpdated);

    // Apply to current active view
    setActiveRecords(updatedMonthRecords);
    setHasFiltered(true);
    setIsExcelModalOpen(false);

    toast.success(
      `Auto-populated actual bills for ${validMatches.length} staff from Excel!`,
      {
        description: "Review the populated amounts below, then click 'Submit' to lock the bills.",
      }
    );
  };

  // DOWNLOAD REAL EXCEL TEMPLATE (.xlsx)
  const handleDownloadExcelTemplate = (mode: "prefilled" | "blank" = "prefilled") => {
    // If user has filtered records, use those; otherwise use all seed staff SIMs
    const baseStaff = activeRecords.length > 0 ? activeRecords : generateSeedEmployeeBills();
    const recordsToExport = mode === "blank" ? baseStaff.slice(0, 5) : baseStaff;

    const templateRows = recordsToExport.map((s, idx) => ({
      "SL": idx + 1,
      "Mobile No": s.simNo,
      "Actual Bill": mode === "blank" ? "" : (s.actualBill > 0 ? s.actualBill : ""),
      "Emp ID": s.empId,
      "Employee Name": s.empName,
      "Company": s.companyCode,
      "Location": s.location,
      "Department": s.department,
      "Designation": s.designation,
      "Approved Limit": s.limit,
    }));

    const worksheet = XLSX.utils.json_to_sheet(templateRows);

    // Set nice column widths for Excel
    worksheet["!cols"] = [
      { wch: 6 },  // SL
      { wch: 16 }, // Mobile No
      { wch: 16 }, // Actual Bill
      { wch: 14 }, // Emp ID
      { wch: 24 }, // Employee Name
      { wch: 16 }, // Company
      { wch: 18 }, // Location
      { wch: 20 }, // Department
      { wch: 22 }, // Designation
      { wch: 16 }, // Approved Limit
    ];

    // Instructions sheet for user convenience
    const instructions = [
      {
        "Step": "1",
        "Guidelines": "Enter the operator's actual billed amount in the 'Actual Bill' column for each corporate SIM.",
      },
      {
        "Step": "2",
        "Guidelines": "Do not alter the 'Mobile No' or 'Emp ID' columns, as the parser uses them to auto-match staff.",
      },
      {
        "Step": "3",
        "Guidelines": "If an employee's bill exceeds their approved limit, CRIPTON HRIS will automatically calculate excess salary deductions.",
      },
      {
        "Step": "4",
        "Guidelines": "Save this file (.xlsx, .xls, or .csv) and click 'Upload Excel' on the Mobile Bill Entry screen.",
      },
      {
        "Step": "5",
        "Guidelines": "Review the auto-populated bill sheet and click 'Submit' to commit and lock the monthly billing data.",
      },
    ];
    const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
    instructionsSheet["!cols"] = [
      { wch: 8 },
      { wch: 90 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mobile Bill Entry");
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Upload Instructions");

    const fileName =
      mode === "blank"
        ? `Mobile_Bill_Blank_Template_${selectedMonth}_${selectedYear}.xlsx`
        : `Mobile_Bill_Template_${selectedMonth}_${selectedYear}.xlsx`;

    XLSX.writeFile(workbook, fileName);
    toast.success(
      mode === "blank"
        ? "Blank Excel template downloaded successfully!"
        : `Excel template downloaded with ${recordsToExport.length} corporate SIMs!`,
      {
        description: "Open the file, fill in the 'Actual Bill' column, and upload it back.",
      }
    );
  };

  // Filtered by search within active records
  const displayedRecords = useMemo(() => {
    if (!searchQuery.trim()) return activeRecords;
    const q = searchQuery.toLowerCase();
    return activeRecords.filter(
      (r) =>
        r.empId.toLowerCase().includes(q) ||
        r.empName.toLowerCase().includes(q) ||
        r.simNo.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.designation.toLowerCase().includes(q)
    );
  }, [activeRecords, searchQuery]);

  // Summaries
  const summaries = useMemo(() => {
    let totalLimit = 0;
    let totalBill = 0;
    let totalDeduction = 0;
    let totalPayment = 0;
    let lockedCount = 0;

    activeRecords.forEach((r) => {
      totalLimit += r.limit;
      totalBill += r.actualBill;
      totalDeduction += r.deduction;
      totalPayment += r.totalPayment;
      if (r.isLocked) lockedCount++;
    });

    return {
      count: activeRecords.length,
      totalLimit,
      totalBill,
      totalDeduction,
      totalPayment,
      lockedCount,
      allLocked: activeRecords.length > 0 && lockedCount === activeRecords.length,
    };
  }, [activeRecords]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "SL",
      "Emp ID",
      "Employee Name",
      "Card No",
      "Designation",
      "Company",
      "Location",
      "Department",
      "SIM No",
      "Operator",
      "Approved Limit",
      "Actual Bill",
      "Excess Deduction",
      "Company Payment",
      "Lock Status",
    ];

    const rows = displayedRecords.map((r, idx) => [
      (idx + 1).toString(),
      r.empId,
      r.empName,
      r.cardNo || "",
      r.designation,
      r.companyCode,
      r.location,
      r.department,
      r.simNo,
      r.operator,
      r.limit.toString(),
      r.actualBill.toString(),
      r.deduction.toString(),
      r.totalPayment.toString(),
      r.isLocked ? "Locked" : "Unlocked",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((v) => `"${(v || "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Mobile_Bills_${selectedMonth}_${selectedYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported bill records to CSV!");
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      {/* Hidden File Input for Excel */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".xlsx, .xls, .csv"
        className="hidden"
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 max-w-[1700px] mx-auto w-full">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="hover:text-primary transition-colors">Mobile Billing</span>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              Bill Entry
            </span>
          </div>

          {/* Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400">
                <Smartphone className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Mobile Bill Entry</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold">
                    Month-wise Entry
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Upload operator Excel bill to auto-populate amounts, edit actual bills, and submit to lock.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* UPLOAD EXCEL BUTTON */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                title="Upload Excel bill file to auto-populate actual amounts"
              >
                <FileSpreadsheet className="size-3.5" />
                <span>Upload Excel</span>
              </button>

              {/* DOWNLOAD EXCEL TEMPLATE BUTTON */}
              <button
                onClick={() => handleDownloadExcelTemplate("prefilled")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Download formatted Excel template pre-filled with corporate SIM numbers"
              >
                <Download className="size-3.5 text-blue-600 dark:text-blue-400" />
                <span>Excel Template</span>
              </button>

              {hasFiltered && activeRecords.length > 0 && (
                <>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Download className="size-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={handleSubmitAllBills}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <Send className="size-3.5" />
                    <span>Submit Bills</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Month-wise Filter Console */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Filter className="size-3.5 text-blue-600" />
                <span>Filter Scope (Searchable & Multi-Select)</span>
                {(selectedCompanies.length > 0 || selectedDepartments.length > 0) && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 font-semibold">
                    {selectedCompanies.length > 0 && `${selectedCompanies.length} companies`}
                    {selectedCompanies.length > 0 && selectedDepartments.length > 0 && ", "}
                    {selectedDepartments.length > 0 && `${selectedDepartments.length} depts`}
                  </span>
                )}
              </div>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span>Reset Filters</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3.5 items-end">
              {/* Year */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Year
                </label>
                <SearchableSelect
                  options={yearOptions}
                  value={String(selectedYear)}
                  onChange={(val) => setSelectedYear(Number(val))}
                  placeholder="Year..."
                  className="h-10 text-xs font-semibold"
                />
              </div>

              {/* Month */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Billing Month
                </label>
                <SearchableSelect
                  options={monthOptions}
                  value={selectedMonth}
                  onChange={(val) => setSelectedMonth(val)}
                  placeholder="Month..."
                  className="h-10 text-xs font-semibold"
                />
              </div>

              {/* Company (Multi-Select) */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Company (Multi-Select)
                </label>
                <MultiSelect
                  options={companyOptions}
                  selected={selectedCompanies}
                  onChange={setSelectedCompanies}
                  placeholder="All Companies..."
                  className="min-h-10 text-xs"
                />
              </div>

              {/* Department (Multi-Select) */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Department (Multi-Select)
                </label>
                <MultiSelect
                  options={departmentOptions}
                  selected={selectedDepartments}
                  onChange={setSelectedDepartments}
                  placeholder="All Departments..."
                  className="min-h-10 text-xs"
                />
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <SearchableSelect
                  options={locationOptions}
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                  placeholder="Location..."
                  className="h-10 text-xs"
                />
              </div>

              {/* Action Button: Filter / Load List */}
              <div className="md:col-span-12 flex items-center justify-between gap-3 pt-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="size-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    disabled={!hasFiltered}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={hasFiltered ? "Search filtered staff..." : "Filter first to search..."}
                    className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 h-10 disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadExcelTemplate("prefilled")}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    title="Download Excel template pre-filled with staff SIMs"
                  >
                    <Download className="size-3.5 text-blue-600" />
                    <span>Excel Template</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="size-3.5" />
                    <span>Upload Excel</span>
                  </button>

                  <button
                    onClick={handleApplyFilter}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <Filter className="size-3.5" />
                    <span>Filter / Load List</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Initial Empty State (shuru te faka thakbe) */}
          {!hasFiltered ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-12 text-center shadow-xs">
              <div className="max-w-md mx-auto space-y-3">
                <div className="size-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Filter className="size-7 stroke-[1.8]" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Filter to Load Billing Sheet or Upload Excel
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Select your desired <strong>Year</strong>, <strong>Month</strong>, <strong>Company</strong>, and <strong>Department</strong> above and click <strong>"Filter / Load List"</strong>, or upload an operator Excel file to auto-populate the amounts.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2.5 flex-wrap">
                  <button
                    onClick={handleApplyFilter}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <Filter className="size-3.5" />
                    <span>Filter / Load List</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="size-3.5" />
                    <span>Upload Excel</span>
                  </button>
                  <button
                    onClick={() => handleDownloadExcelTemplate("prefilled")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
                    title="Download Excel template pre-filled with all corporate SIM numbers"
                  >
                    <Download className="size-3.5 text-blue-600" />
                    <span>Download Excel Template</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Table Container after filtering */
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden space-y-0">
              {/* Table Action Bar */}
              <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Showing {displayedRecords.length} staff records for {selectedMonth} {selectedYear}
                  </span>
                  {summaries.lockedCount > 0 && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                      <Lock className="size-3" />
                      <span>{summaries.lockedCount} Locked</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadExcelTemplate("prefilled")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-all cursor-pointer"
                    title="Download Excel template for this staff list"
                  >
                    <Download className="size-3.5 text-blue-600" />
                    <span>Excel Template</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="size-3.5" />
                    <span>Upload Excel</span>
                  </button>
                  <button
                    onClick={handleUnlockAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                    title="Unlock all records to edit actual bills"
                  >
                    <Unlock className="size-3.5" />
                    <span>Unlock All</span>
                  </button>
                  <button
                    onClick={handleLockAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                    title="Lock all records"
                  >
                    <Lock className="size-3.5" />
                    <span>Lock All</span>
                  </button>
                  <button
                    onClick={handleSubmitAllBills}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <Send className="size-3.5" />
                    <span>Submit</span>
                  </button>
                </div>
              </div>

              {/* Main Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#d9e1f2] dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-300 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-3">SL</th>
                      <th className="py-3 px-3">Emp ID</th>
                      <th className="py-3 px-3">Employee Name</th>
                      <th className="py-3 px-3">Mobile No</th>
                      <th className="py-3 px-3">Company</th>
                      <th className="py-3 px-3">Department</th>
                      <th className="py-3 px-3 text-right">Limit (৳)</th>
                      <th className="py-3 px-3 text-right w-36">
                        <span className="text-blue-900 dark:text-blue-300 underline underline-offset-2">
                          Actual Bill (৳) *
                        </span>
                      </th>
                      <th className="py-3 px-3 text-right">Deduction (৳)</th>
                      <th className="py-3 px-3 text-right">Payable (৳)</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {displayedRecords.length === 0 ? (
                      <tr>
                        <td colSpan={12} className="py-10 text-center text-slate-400">
                          No staff found matching the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      displayedRecords.map((r, idx) => {
                        const isLocked = !!r.isLocked;
                        const isExcess = r.actualBill > r.limit;

                        return (
                          <tr
                            key={r.id}
                            className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                              isExcess ? "bg-amber-50/30 dark:bg-amber-950/10" : ""
                            }`}
                          >
                            <td className="py-2.5 px-3 font-medium text-slate-500">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                              {r.empId}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-slate-900 dark:text-white">
                                {r.empName}
                              </div>
                              <div className="text-[10px] text-slate-400">{r.designation}</div>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-blue-600 dark:text-blue-400 font-semibold">
                              {r.simNo}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                              {r.companyCode}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                              {r.department}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-semibold">
                              ৳ {fmt(r.limit)}
                            </td>

                            {/* ONLY Actual Bill is editable, and locked when isLocked is true */}
                            <td className="py-2 px-3 text-right">
                              <div className="relative inline-block w-full max-w-[130px]">
                                <input
                                  type="number"
                                  step="0.01"
                                  disabled={isLocked}
                                  value={r.actualBill}
                                  onChange={(e) => handleInlineBillChange(r.id, e.target.value)}
                                  className={`w-full text-right px-2.5 py-1.5 font-mono rounded-lg border text-xs font-bold transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                                    isLocked
                                      ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 cursor-not-allowed select-none"
                                      : isExcess
                                      ? "border-amber-400 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 shadow-2xs"
                                      : "border-blue-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                                  }`}
                                />
                                {isLocked && (
                                  <Lock className="size-3 text-slate-400 absolute left-2 top-2.5 pointer-events-none" />
                                )}
                              </div>
                            </td>

                            <td className="py-2.5 px-3 text-right font-mono">
                              {r.deduction > 0 ? (
                                <span className="text-amber-600 dark:text-amber-400 font-bold">
                                  ৳ {fmt(r.deduction)}
                                </span>
                              ) : (
                                <span className="text-slate-400">৳ 0.00</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              ৳ {fmt(r.totalPayment)}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isLocked
                                    ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                    : isExcess
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                }`}
                              >
                                {isLocked ? (
                                  <>
                                    <Lock className="size-2.5" />
                                    <span>Locked</span>
                                  </>
                                ) : (
                                  <span>Editable</span>
                                )}
                              </span>
                            </td>

                            {/* Lock / Unlock Toggle Button */}
                            <td className="py-2.5 px-3 text-center">
                              <button
                                onClick={() => handleToggleLock(r.id)}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                  isLocked
                                    ? "bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                                }`}
                                title={isLocked ? "Click to unlock and edit bill" : "Click to lock"}
                              >
                                {isLocked ? (
                                  <>
                                    <Unlock className="size-3" />
                                    <span>Unlock</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="size-3" />
                                    <span>Lock</span>
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>

                  {/* Totals Footer */}
                  {displayedRecords.length > 0 && (
                    <tfoot className="bg-[#d9e1f2] dark:bg-slate-800 font-black text-slate-900 dark:text-slate-100 border-t-2 border-slate-400">
                      <tr>
                        <td colSpan={6} className="py-3 px-3 text-right uppercase tracking-wider">
                          Summary ({displayedRecords.length} Staff):
                        </td>
                        <td className="py-3 px-3 text-right font-mono">
                          ৳ {fmt(summaries.totalLimit)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-blue-700 dark:text-blue-300">
                          ৳ {fmt(summaries.totalBill)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-amber-700 dark:text-amber-300">
                          ৳ {fmt(summaries.totalDeduction)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-700 dark:text-emerald-300">
                          ৳ {fmt(summaries.totalPayment)}
                        </td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              {/* Bottom Submit Console */}
              {displayedRecords.length > 0 && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Workflow Instruction:
                    </span>{" "}
                    Input all actual bill amounts for the staff list above. Once completed, click{" "}
                    <strong>"Submit Bills"</strong> to save and lock all records.
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSubmitAllBills}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="size-4" />
                      <span>Submit Bills</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* EXCEL UPLOAD PREVIEW & AUTO-POPULATE MODAL */}
      {isExcelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <FileSpreadsheet className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Auto-Populate Bills from Excel
                  </h3>
                  <p className="text-xs text-slate-500">
                    File: <span className="font-semibold text-slate-700 dark:text-slate-300">{excelFileName}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExcelModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body / Preview */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Template Download Notification / Quick Access */}
              <div className="flex items-center justify-between p-3.5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl gap-3 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-2.5 text-xs text-blue-900 dark:text-blue-200">
                  <FileSpreadsheet className="size-4 text-emerald-600 shrink-0" />
                  <span>Looking for the standard template? Download pre-filled corporate SIM list.</span>
                </div>
                <button
                  onClick={() => handleDownloadExcelTemplate("prefilled")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700 hover:bg-blue-50 text-xs font-bold text-blue-700 dark:text-blue-300 shadow-2xs cursor-pointer shrink-0"
                >
                  <Download className="size-3 text-blue-600" />
                  <span>Download Template (.xlsx)</span>
                </button>
              </div>

              {/* Match Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Total Rows in Excel
                  </span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {parsedExcelMatches.length}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                    Matched Staff SIMs
                  </span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    {parsedExcelMatches.filter((m) => m.matchedStaff !== null).length}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">
                    Total Amount in Excel
                  </span>
                  <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                    ৳ {fmt(parsedExcelMatches.reduce((sum, m) => sum + m.amount, 0))}
                  </span>
                </div>
              </div>

              {/* Matched Preview Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-[350px] overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 sticky top-0 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2 px-3">Excel Row</th>
                      <th className="py-2 px-3">Mobile No</th>
                      <th className="py-2 px-3">Matched Employee</th>
                      <th className="py-2 px-3">Department</th>
                      <th className="py-2 px-3 text-right">Approved Limit (৳)</th>
                      <th className="py-2 px-3 text-right">Excel Bill (৳)</th>
                      <th className="py-2 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {parsedExcelMatches.map((m, idx) => {
                      const isMatched = m.matchedStaff !== null;
                      const isExcess = isMatched && m.amount > (m.matchedStaff?.limit || 0);

                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${
                            !isMatched ? "opacity-60 bg-slate-50/50" : ""
                          }`}
                        >
                          <td className="py-2 px-3 font-mono text-slate-500">#{m.rowNumber}</td>
                          <td className="py-2 px-3 font-mono font-semibold text-blue-600 dark:text-blue-400">
                            {m.mobile || m.empId || "—"}
                          </td>
                          <td className="py-2 px-3">
                            {isMatched ? (
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {m.matchedStaff?.empName}
                                </span>
                                <span className="text-[10px] text-slate-400 block">
                                  {m.matchedStaff?.empId} • {m.matchedStaff?.designation}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">No corporate SIM match</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                            {m.matchedStaff?.department || "—"}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-semibold">
                            {isMatched ? fmt(m.matchedStaff!.limit) : "—"}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ৳ {fmt(m.amount)}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {isMatched ? (
                              isExcess ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                  Exceeds Limit
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                  Matched
                                </span>
                              )
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                Unmatched
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
                <AlertCircle className="size-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Clicking <strong>"Auto-Populate to Bill Sheet"</strong> will automatically assign these amounts to the corresponding staff members and calculate excess salary deductions.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-800/30">
              <button
                onClick={() => setIsExcelModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyExcelAmounts}
                disabled={parsedExcelMatches.filter((m) => m.matchedStaff !== null).length === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <CheckCircle2 className="size-4" />
                <span>
                  Auto-Populate ({parsedExcelMatches.filter((m) => m.matchedStaff !== null).length} Staff)
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
