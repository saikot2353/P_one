import { useState, useMemo, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  FileSpreadsheet,
  Printer,
  FileText,
  UtensilsCrossed,
  Filter,
  Calendar,
  ChevronDown,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/lunch-rate-festival")({
  head: () => ({
    meta: [
      { title: "Lunch Rate Festival — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Configure and manage festival lunch rates for employees across departments and sections.",
      },
    ],
  }),
  component: LunchRateFestivalPage,
});

// ---------------------------------------------------------------------------
// Types & Defaults
// ---------------------------------------------------------------------------
export interface LunchRateFestivalRecord {
  id: string;
  sl: number;
  company: string;
  area: string;
  applicableFrom: string; // "DD/MM/YYYY" format
  applicableTo: string;   // "DD/MM/YYYY" format
  employeeType: string;
  department: string;
  section: string;
  designation: string;
  rate: number;
  isActive: "Active" | "Inactive";
  lunchType?: string[];   // ["Holiday", "Fastival", "general"]
}

const STORAGE_KEY = "hris_lunch_rate_festival_records_v1";

export const LUNCH_TYPE_OPTIONS = ["Holiday", "Fastival", "general"];

const INITIAL_RECORDS: LunchRateFestivalRecord[] = [
  {
    id: "lrf-1",
    sl: 1,
    company: "Pakiza Knit Composite Ltd",
    area: "PKCL-Savar",
    applicableFrom: "01/06/2023",
    applicableTo: "31/07/2042",
    employeeType: "Worker",
    department: "Maintenance",
    section: "Maintenance Utility & Textile",
    designation: "",
    rate: 100.0,
    isActive: "Active",
    lunchType: ["Holiday", "Fastival"],
  },
];

// Helper: Convert YYYY-MM-DD to DD/MM/YYYY
function toDisplayDate(val: string): string {
  if (!val) return "";
  if (val.includes("/")) return val;
  const parts = val.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return val;
}

// Helper: Convert DD/MM/YYYY to YYYY-MM-DD for date inputs
function toInputDate(val: string): string {
  if (!val) return "";
  if (val.includes("-")) return val;
  const parts = val.split("/");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return val;
}

export function LunchRateFestivalPage() {
  // Stored Records
  const [records, setRecords] = useState<LunchRateFestivalRecord[]>(INITIAL_RECORDS);

  // Load from localStorage on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRecords(parsed);
          }
        }
      } catch (err) {
        console.error("Failed to load from localStorage", err);
      }
    }
  }, []);

  // Update records & persist
  const updateRecords = (
    updater: (prev: LunchRateFestivalRecord[]) => LunchRateFestivalRecord[]
  ) => {
    setRecords((prev) => {
      const next = updater(prev);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (err) {
          console.error("Failed to save to localStorage", err);
        }
      }
      return next;
    });
  };

  // Table Search Query
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<LunchRateFestivalRecord | null>(null);

  // Form Fields State (Matching Image 2 + Lunch type dropdown)
  const [formCompany, setFormCompany] = useState("Pakiza Knit Composite Ltd");
  const [formArea, setFormArea] = useState("PKCL-Savar");
  const [formApplicableFrom, setFormApplicableFrom] = useState("2023-06-01");
  const [formApplicableTo, setFormApplicableTo] = useState("2042-07-31");
  const [formEmployeeType, setFormEmployeeType] = useState("ALL");
  const [formDepartment, setFormDepartment] = useState("All Departments");
  const [formSection, setFormSection] = useState("");
  const [formDesignation, setFormDesignation] = useState("ALL");
  const [formRate, setFormRate] = useState("100.00");
  const [formIsActive, setFormIsActive] = useState<"Active" | "Inactive">("Active");

  // Lunch Type multiselect state
  const [formLunchType, setFormLunchType] = useState<string[]>(["Holiday", "Fastival"]);
  const [isLunchTypeOpen, setIsLunchTypeOpen] = useState(false);
  const lunchTypeRef = useRef<HTMLDivElement>(null);

  // Close lunch type dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (lunchTypeRef.current && !lunchTypeRef.current.contains(event.target as Node)) {
        setIsLunchTypeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle single lunch type option
  const toggleLunchType = (option: string) => {
    setFormLunchType((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  // Filtered Records (searches all columns in real-time)
  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const q = searchQuery.toLowerCase();
    return records.filter((r) => {
      const lunchTypesStr = (r.lunchType || []).join(" ");
      const rowString = `${r.sl} ${r.company} ${r.area} ${r.applicableFrom} ${r.applicableTo} ${r.employeeType} ${r.department} ${r.section} ${r.designation} ${r.rate} ${r.isActive} ${lunchTypesStr}`.toLowerCase();
      return rowString.includes(q);
    });
  }, [records, searchQuery]);

  // Paginated Rows
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingRecord(null);
    setFormCompany("Pakiza Knit Composite Ltd");
    setFormArea("PKCL-Savar");
    setFormApplicableFrom("2023-06-01");
    setFormApplicableTo("2042-07-31");
    setFormEmployeeType("ALL");
    setFormDepartment("All Departments");
    setFormSection("");
    setFormDesignation("ALL");
    setFormRate("100.00");
    setFormIsActive("Active");
    setFormLunchType(["Holiday", "Fastival"]);
    setIsLunchTypeOpen(false);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (rec: LunchRateFestivalRecord) => {
    setEditingRecord(rec);
    setFormCompany(rec.company || "Pakiza Knit Composite Ltd");
    setFormArea(rec.area || "PKCL-Savar");
    setFormApplicableFrom(toInputDate(rec.applicableFrom));
    setFormApplicableTo(toInputDate(rec.applicableTo));
    setFormEmployeeType(rec.employeeType || "ALL");
    setFormDepartment(rec.department || "All Departments");
    setFormSection(rec.section || "");
    setFormDesignation(rec.designation || "ALL");
    setFormRate(rec.rate !== undefined ? rec.rate.toFixed(2) : "100.00");
    setFormIsActive(rec.isActive || "Active");
    setFormLunchType(
      Array.isArray(rec.lunchType) && rec.lunchType.length > 0
        ? rec.lunchType
        : ["Holiday", "Fastival"]
    );
    setIsLunchTypeOpen(false);
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    setIsLunchTypeOpen(false);
  };

  // Save Record
  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formCompany) {
      toast.error("Company is required");
      return;
    }
    if (!formArea) {
      toast.error("Area is required");
      return;
    }
    if (!formApplicableFrom) {
      toast.error("Applicable From date is required");
      return;
    }
    if (!formApplicableTo) {
      toast.error("Applicable To date is required");
      return;
    }

    const rateNum = parseFloat(formRate) || 0;
    const formattedFrom = toDisplayDate(formApplicableFrom);
    const formattedTo = toDisplayDate(formApplicableTo);

    if (editingRecord) {
      updateRecords((prev) =>
        prev.map((r) =>
          r.id === editingRecord.id
            ? {
                ...r,
                company: formCompany,
                area: formArea,
                applicableFrom: formattedFrom,
                applicableTo: formattedTo,
                employeeType: formEmployeeType,
                department: formDepartment === "All Departments" ? "" : formDepartment,
                section: formSection,
                designation: formDesignation === "ALL" ? "" : formDesignation,
                rate: rateNum,
                isActive: formIsActive,
                lunchType: formLunchType,
              }
            : r
        )
      );
      toast.success("Lunch Rate Festival record updated successfully");
    } else {
      updateRecords((prev) => {
        const nextSl = prev.length > 0 ? Math.max(...prev.map((r) => r.sl)) + 1 : 1;
        const newRec: LunchRateFestivalRecord = {
          id: "lrf-" + Date.now(),
          sl: nextSl,
          company: formCompany,
          area: formArea,
          applicableFrom: formattedFrom,
          applicableTo: formattedTo,
          employeeType: formEmployeeType,
          department: formDepartment === "All Departments" ? "" : formDepartment,
          section: formSection,
          designation: formDesignation === "ALL" ? "" : formDesignation,
          rate: rateNum,
          isActive: formIsActive,
          lunchType: formLunchType,
        };
        return [...prev, newRec];
      });
      toast.success("New Lunch Rate Festival record created successfully");
    }

    handleCloseModal();
  };

  // Delete Record
  const handleDeleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      updateRecords((prev) =>
        prev.filter((r) => r.id !== id).map((r, i) => ({ ...r, sl: i + 1 }))
      );
      toast.success("Record deleted");
    }
  };

  // Export to Excel / CSV
  const handleExportExcel = () => {
    if (filteredRecords.length === 0) {
      toast.error("No records to export");
      return;
    }
    const headers = [
      "SL",
      "Company",
      "Area",
      "Applicable From",
      "Applicable To",
      "Employee Type",
      "Lunch Type",
      "Department",
      "Section",
      "Designation",
      "Rate",
      "IsActive",
    ];
    const rows = filteredRecords.map((r) => [
      r.sl,
      `"${r.company}"`,
      `"${r.area}"`,
      r.applicableFrom,
      r.applicableTo,
      r.employeeType,
      `"${(r.lunchType || []).join(", ")}"`,
      `"${r.department}"`,
      `"${r.section}"`,
      `"${r.designation}"`,
      r.rate.toFixed(2),
      r.isActive,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lunch_rate_festival_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported to Excel/CSV successfully");
  };

  // Export to PDF
  const handleExportPDF = () => {
    toast.success("Generating Lunch Rate Festival PDF document...");
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      {/* Global Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        {/* Global Standard Topbar */}
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1800px] mx-auto w-full">
          {/* Breadcrumb & Header Card (Identical to other Configure pages) */}
          <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3.5" />
                <span>Configure</span>
                <ChevronRight className="size-3.5" />
                <span className="text-primary font-bold">Lunch Rate Festival</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <UtensilsCrossed className="size-6 text-primary" />
                <span>Lunch Rate Festival Setup</span>
              </h1>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="size-4.5" />
              <span>Add New Record</span>
            </button>
          </div>

          {/* Search bar & Actions toolbar (Standard Configure Layout) */}
          <div className="bg-card rounded-2xl border border-border/50 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="w-full md:w-80 h-10 px-3.5 rounded-lg border border-border/60 bg-muted/10 hover:bg-muted/20 focus-within:bg-background focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all flex items-center gap-2.5 shadow-sm">
              <Search className="size-4.5 text-muted-foreground/70" />
              <input
                type="text"
                placeholder="Search lunch rate festival records..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent border-0 outline-none text-sm w-full text-foreground placeholder:text-muted-foreground/50 font-medium"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
              <button
                onClick={handleExportExcel}
                className="h-10 px-4 rounded-xl border border-border/40 hover:bg-muted font-semibold text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <FileSpreadsheet className="size-4.5 text-emerald-600" />
                <span>Excel</span>
              </button>
              <button
                onClick={() => window.print()}
                className="h-10 px-4 rounded-xl border border-border/40 hover:bg-muted font-semibold text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <Printer className="size-4.5 text-blue-600" />
                <span>Print</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="h-10 px-4 rounded-xl border border-border/40 hover:bg-muted font-semibold text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <FileText className="size-4.5 text-red-600" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Master Table (Matching Image 1 Data & Columns with Configure Aesthetics) */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
                {/* Header (Matching Light Sky Blue bg from Image 1) */}
                <thead className="bg-[#bde3f7] dark:bg-sky-950/40 text-slate-800 dark:text-sky-200 border-b border-border/40 uppercase font-bold tracking-wider text-xs select-none">
                  <tr>
                    <th className="px-5 py-3.5 text-center w-14">SL</th>
                    <th className="px-5 py-3.5 text-center w-20">Action</th>
                    <th className="px-5 py-3.5">Applicable From</th>
                    <th className="px-5 py-3.5">Applicable To</th>
                    <th className="px-5 py-3.5">Employee Type</th>
                    <th className="px-5 py-3.5">Department</th>
                    <th className="px-5 py-3.5">Section</th>
                    <th className="px-5 py-3.5">Designation</th>
                    <th className="px-5 py-3.5 text-right pr-6">Rate</th>
                    <th className="px-5 py-3.5 text-center w-24">IsActive</th>
                  </tr>
                </thead>

                {/* Body Rows */}
                <tbody className="divide-y divide-border/30 text-foreground">
                  {paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-5 py-10 text-center text-muted-foreground text-xs">
                        No records matching the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        {/* SL */}
                        <td className="px-5 py-3.5 text-center text-muted-foreground font-medium">
                          {row.sl}
                        </td>

                        {/* Action: Amber Pencil Icon Button */}
                        <td className="px-5 py-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(row)}
                            title="Edit Record"
                            className="inline-flex items-center justify-center size-7 rounded-lg text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 transition cursor-pointer"
                          >
                            <Pencil className="size-4" />
                          </button>
                        </td>

                        {/* Applicable From */}
                        <td className="px-5 py-3.5 font-normal">
                          {row.applicableFrom}
                        </td>

                        {/* Applicable To */}
                        <td className="px-5 py-3.5 font-normal">
                          {row.applicableTo}
                        </td>

                        {/* Employee Type + Lunch Type Badges */}
                        <td className="px-5 py-3.5 font-normal">
                          <div className="font-medium text-foreground">{row.employeeType}</div>
                          {row.lunchType && row.lunchType.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {row.lunchType.map((lt) => (
                                <span
                                  key={lt}
                                  className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-300/50"
                                >
                                  {lt}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        {/* Department */}
                        <td className="px-5 py-3.5 font-normal">
                          {row.department || "—"}
                        </td>

                        {/* Section */}
                        <td className="px-5 py-3.5 font-normal">
                          {row.section || "—"}
                        </td>

                        {/* Designation */}
                        <td className="px-5 py-3.5 font-normal">
                          {row.designation || "—"}
                        </td>

                        {/* Rate */}
                        <td className="px-5 py-3.5 text-right pr-6 font-semibold">
                          {row.rate.toFixed(2)}
                        </td>

                        {/* IsActive */}
                        <td className="px-5 py-3.5 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              row.isActive === "Active"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-muted text-muted-foreground border border-border"
                            }`}
                          >
                            {row.isActive}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer (Matching Configure Pages) */}
            <div className="bg-card px-5 py-3.5 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
              <div>
                Showing {filteredRecords.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                {Math.min(currentPage * pageSize, filteredRecords.length)} of {filteredRecords.length}{" "}
                entries
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className={`text-foreground hover:text-primary transition px-2.5 py-1 text-xs cursor-pointer ${
                    currentPage <= 1 ? "opacity-40 cursor-not-allowed" : ""
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setCurrentPage(pg)}
                    className={`size-7 rounded-md font-semibold text-xs flex items-center justify-center transition cursor-pointer ${
                      currentPage === pg
                        ? "bg-[#71b340] text-white shadow-xs"
                        : "bg-transparent text-foreground hover:bg-muted"
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className={`text-foreground hover:text-primary transition px-2.5 py-1 text-xs cursor-pointer ${
                    currentPage >= totalPages ? "opacity-40 cursor-not-allowed" : ""
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------------------------- */}
        {/* Create / Edit Modal (Matching Image 2 Form Fields + Lunch type dropdown)   */}
        {/* --------------------------------------------------------------------------- */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseModal();
            }}
          >
            <div className="bg-card w-full max-w-[760px] rounded-2xl border border-border/80 shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-150 text-foreground">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <h2 className="text-lg font-bold text-foreground">
                  {editingRecord
                    ? "Update Lunch Rate Festival"
                    : "Create New Lunch Rate Festival"}
                </h2>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition cursor-pointer"
                >
                  <X className="size-4.5" />
                </button>
              </div>

              <form onSubmit={handleSaveRecord} className="space-y-6 pt-5">
                {/* 2-Column Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* 1. Left: Company * */}
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground block">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formCompany}
                        onChange={(e) => setFormCompany(e.target.value)}
                        required
                        className="w-full bg-transparent border-0 border-b border-primary text-sm font-medium text-foreground py-1.5 pr-8 focus:outline-none focus:border-primary transition appearance-none cursor-pointer"
                      >
                        <option value="Pakiza Knit Composite Ltd">Pakiza Knit Composite Ltd</option>
                        <option value="Pakiza Spinning Mills Ltd">Pakiza Spinning Mills Ltd</option>
                        <option value="Pakiza Apparels Ltd">Pakiza Apparels Ltd</option>
                      </select>
                      <ChevronDown className="size-4 text-muted-foreground absolute right-1 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* 1. Right: Area * */}
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground block">
                      Area <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formArea}
                        onChange={(e) => setFormArea(e.target.value)}
                        required
                        className="w-full bg-transparent border-0 border-b border-border text-sm font-medium text-foreground py-1.5 pr-8 focus:outline-none focus:border-primary transition appearance-none cursor-pointer"
                      >
                        <option value="PKCL-Savar">PKCL-Savar</option>
                        <option value="PSL-Operation">PSL-Operation</option>
                        <option value="ALL">ALL</option>
                      </select>
                      <ChevronDown className="size-4 text-muted-foreground absolute right-1 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* 2. Left: Applicable From * */}
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground block">
                      Applicable From <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formApplicableFrom}
                      onChange={(e) => setFormApplicableFrom(e.target.value)}
                      required
                      className="w-full bg-transparent border-0 border-b border-border text-sm text-foreground py-1.5 focus:outline-none focus:border-primary transition cursor-pointer"
                    />
                  </div>

                  {/* 2. Right: Applicable To * */}
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground block">
                      Applicable To <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formApplicableTo}
                      onChange={(e) => setFormApplicableTo(e.target.value)}
                      required
                      className="w-full bg-transparent border-0 border-b border-border text-sm text-foreground py-1.5 focus:outline-none focus:border-primary transition cursor-pointer"
                    />
                  </div>

                  {/* 3. Left: Employee Type */}
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground block">Employee Type</label>
                    <div className="relative">
                      <select
                        value={formEmployeeType}
                        onChange={(e) => setFormEmployeeType(e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-border text-sm font-medium text-foreground py-1.5 pr-8 focus:outline-none focus:border-primary transition appearance-none cursor-pointer"
                      >
                        <option value="ALL">ALL</option>
                        <option value="Worker">Worker</option>
                        <option value="Staff">Staff</option>
                        <option value="Management">Management</option>
                      </select>
                      <ChevronDown className="size-4 text-muted-foreground absolute right-1 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* 3. Right: Department */}
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground block">Department</label>
                    <div className="relative">
                      <select
                        value={formDepartment}
                        onChange={(e) => setFormDepartment(e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-border text-sm font-medium text-foreground py-1.5 pr-8 focus:outline-none focus:border-primary transition appearance-none cursor-pointer"
                      >
                        <option value="All Departments">All Departments</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="HR, Admin & Comp.">HR, Admin & Comp.</option>
                        <option value="Merchandising">Merchandising</option>
                        <option value="Knitting">Knitting</option>
                        <option value="Dyeing">Dyeing</option>
                        <option value="Cutting">Cutting</option>
                        <option value="Quality Assurance">Quality Assurance</option>
                        <option value="Production Planning">Production Planning</option>
                        <option value="Accounts & Finance">Accounts & Finance</option>
                      </select>
                      <ChevronDown className="size-4 text-muted-foreground absolute right-1 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* 4. Left: Section */}
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground block">Section</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formSection}
                        onChange={(e) => setFormSection(e.target.value)}
                        placeholder="e.g. Maintenance Utility & Textile"
                        className="w-full bg-transparent border-0 border-b border-border text-sm text-foreground py-1.5 focus:outline-none focus:border-primary transition"
                      />
                    </div>
                  </div>

                  {/* 4. Right: Designation */}
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground block">Designation</label>
                    <div className="relative">
                      <select
                        value={formDesignation}
                        onChange={(e) => setFormDesignation(e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-border text-sm font-medium text-foreground py-1.5 pr-8 focus:outline-none focus:border-primary transition appearance-none cursor-pointer"
                      >
                        <option value="ALL">ALL</option>
                        <option value="Operator">Operator</option>
                        <option value="Senior Technician">Senior Technician</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Officer">Officer</option>
                        <option value="Executive">Executive</option>
                        <option value="Assistant Manager">Assistant Manager</option>
                      </select>
                      <ChevronDown className="size-4 text-muted-foreground absolute right-1 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* 5. Left: Lunch type (Multi-Selectable Dropdown: Holiday, Fastival, general) */}
                  <div className="space-y-1 relative" ref={lunchTypeRef}>
                    <label className="text-xs text-muted-foreground block">
                      Lunch type
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsLunchTypeOpen((prev) => !prev)}
                      className="w-full text-left bg-transparent border-0 border-b border-border text-sm text-foreground py-1.5 pr-8 focus:outline-none focus:border-primary transition flex items-center justify-between cursor-pointer min-h-[35px]"
                    >
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {formLunchType.length === 0 ? (
                          <span className="text-muted-foreground/60 text-xs">
                            Select lunch type...
                          </span>
                        ) : (
                          formLunchType.map((type) => (
                            <span
                              key={type}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                            >
                              <span>{type}</span>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLunchType(type);
                                }}
                                className="hover:text-destructive cursor-pointer ml-0.5 text-xs font-bold leading-none"
                                title={`Remove ${type}`}
                              >
                                &times;
                              </span>
                            </span>
                          ))
                        )}
                      </div>
                      <ChevronDown
                        className={`size-4 text-muted-foreground absolute right-1 top-3 transition-transform ${
                          isLunchTypeOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Multiselect Floating Dropdown Menu */}
                    {isLunchTypeOpen && (
                      <div className="absolute top-full left-0 mt-1.5 w-full bg-card border border-border/80 rounded-xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between px-2 py-1 text-[11px] text-muted-foreground border-b border-border/40 pb-1.5 mb-1 font-medium">
                          <span>
                            Options ({formLunchType.length} of {LUNCH_TYPE_OPTIONS.length} selected)
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormLunchType(
                                formLunchType.length === LUNCH_TYPE_OPTIONS.length
                                  ? []
                                  : [...LUNCH_TYPE_OPTIONS]
                              );
                            }}
                            className="text-primary hover:underline text-[11px] font-semibold cursor-pointer"
                          >
                            {formLunchType.length === LUNCH_TYPE_OPTIONS.length
                              ? "Clear all"
                              : "Select all"}
                          </button>
                        </div>

                        {LUNCH_TYPE_OPTIONS.map((option) => {
                          const isChecked = formLunchType.includes(option);
                          return (
                            <div
                              key={option}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLunchType(option);
                              }}
                              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer select-none ${
                                isChecked
                                  ? "bg-primary/10 text-primary font-semibold"
                                  : "text-foreground hover:bg-muted/60"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}} // handled by parent onClick
                                className="rounded border-border text-primary focus:ring-primary size-4 cursor-pointer"
                              />
                              <span className="flex-1">{option}</span>
                              {isChecked && <Check className="size-3.5 text-primary font-bold" />}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 5. Right: Rate */}
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground block">Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formRate}
                      onChange={(e) => setFormRate(e.target.value)}
                      placeholder="100.00"
                      className="w-full bg-transparent border-0 border-b border-border text-sm text-foreground py-1.5 focus:outline-none focus:border-primary transition"
                    />
                  </div>

                  {/* 6. Left: IsActive * */}
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground block">
                      IsActive <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formIsActive}
                        onChange={(e) =>
                          setFormIsActive(e.target.value as "Active" | "Inactive")
                        }
                        required
                        className="w-full bg-transparent border-0 border-b border-border text-sm font-medium text-foreground py-1.5 pr-8 focus:outline-none focus:border-primary transition appearance-none cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      <ChevronDown className="size-4 text-muted-foreground absolute right-1 top-2.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Modal Footer: CLOSE (Orange) on Left, CREATE (Green) on Right */}
                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="h-9 px-6 bg-[#ff9800] hover:bg-[#f57c00] text-white font-bold text-xs rounded-lg shadow-sm uppercase tracking-wider transition cursor-pointer"
                  >
                    CLOSE
                  </button>

                  <div className="flex items-center gap-2">
                    {editingRecord && (
                      <button
                        type="button"
                        onClick={() => {
                          handleDeleteRecord(editingRecord.id);
                          handleCloseModal();
                        }}
                        className="h-9 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-sm uppercase tracking-wider transition cursor-pointer"
                      >
                        DELETE
                      </button>
                    )}
                    <button
                      type="submit"
                      className="h-9 px-7 bg-[#71b340] hover:bg-[#5fa030] text-white font-bold text-xs rounded-lg shadow-sm uppercase tracking-wider transition cursor-pointer"
                    >
                      {editingRecord ? "UPDATE" : "CREATE"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default LunchRateFestivalPage;
