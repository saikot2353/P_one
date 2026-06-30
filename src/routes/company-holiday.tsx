import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Calendar,
  ChevronRight,
  Plus,
  Search,
  FileSpreadsheet,
  Printer,
  FileDown,
  X,
  Trash2,
  CalendarDays,
  CheckCircle,
} from "lucide-react";

export const Route = createFileRoute("/company-holiday")({
  head: () => ({
    meta: [
      { title: "Company Holidays — CRIPTON" },
      {
        name: "description",
        content:
          "Corporate calendar holiday schedule, public holiday alignments, and organizational observances.",
      },
    ],
  }),
  component: CompanyHolidayPage,
});

// Prefilled holiday records for corporate operations
interface HolidayRecord {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: number;
  type: "Govt Holiday" | "Company Specific";
  status: "Active" | "Inactive";
  description: string;
}

const initialHolidays: HolidayRecord[] = [
  {
    id: "H-001",
    name: "New Year's Day",
    startDate: "01/01/2026",
    endDate: "01/01/2026",
    days: 1,
    type: "Company Specific",
    status: "Active",
    description: "First day of the calendar year.",
  },
  {
    id: "H-002",
    name: "International Mother Language Day",
    startDate: "21/02/2026",
    endDate: "21/02/2026",
    days: 1,
    type: "Govt Holiday",
    status: "Active",
    description: "Language movement memory day.",
  },
  {
    id: "H-003",
    name: "Independence Day of Bangladesh",
    startDate: "26/03/2026",
    endDate: "26/03/2026",
    days: 1,
    type: "Govt Holiday",
    status: "Active",
    description: "National independence observance.",
  },
  {
    id: "H-004",
    name: "Bengali New Year (Pohela Boishakh)",
    startDate: "14/04/2026",
    endDate: "14/04/2026",
    days: 1,
    type: "Govt Holiday",
    status: "Active",
    description: "Traditional Bengali year arrival festival.",
  },
  {
    id: "H-005",
    name: "May Day",
    startDate: "01/05/2026",
    endDate: "01/05/2026",
    days: 1,
    type: "Govt Holiday",
    status: "Active",
    description: "International Workers' Day.",
  },
  {
    id: "H-006",
    name: "Eid-ul-Fitr Break",
    startDate: "18/05/2026",
    endDate: "21/05/2026",
    days: 4,
    type: "Govt Holiday",
    status: "Active",
    description: "Religious festival holidays.",
  },
  {
    id: "H-007",
    name: "Eid-ul-Adha Vacation",
    startDate: "26/07/2026",
    endDate: "29/07/2026",
    days: 4,
    type: "Govt Holiday",
    status: "Active",
    description: "Sacrificial festival breaks.",
  },
  {
    id: "H-008",
    name: "National Mourning Day",
    startDate: "15/08/2026",
    endDate: "15/08/2026",
    days: 1,
    type: "Govt Holiday",
    status: "Active",
    description: "National memory day.",
  },
  {
    id: "H-009",
    name: "Victory Day",
    startDate: "16/12/2026",
    endDate: "16/12/2026",
    days: 1,
    type: "Govt Holiday",
    status: "Active",
    description: "National victory day celebration.",
  },
  {
    id: "H-010",
    name: "Christmas Day",
    startDate: "25/12/2026",
    endDate: "25/12/2026",
    days: 1,
    type: "Company Specific",
    status: "Active",
    description: "Annual Christian observance holiday.",
  },
];

function CompanyHolidayPage() {
  const [holidays, setHolidays] = useState<HolidayRecord[]>(initialHolidays);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedType, setSelectedType] = useState("ALL");

  // Modal State for adding holiday
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newType, setNewType] = useState<"Govt Holiday" | "Company Specific">("Govt Holiday");
  const [newDesc, setNewDesc] = useState("");

  // Statistics calculation for dynamic metric cards
  const stats = useMemo(() => {
    let govtCount = 0;
    let companyCount = 0;
    let totalDays = 0;

    holidays.forEach((h) => {
      totalDays += h.days;
      if (h.type === "Govt Holiday") govtCount++;
      else companyCount++;
    });

    return { total: holidays.length, govtCount, companyCount, totalDays };
  }, [holidays]);

  // Filtering holiday rows
  const filteredHolidays = useMemo(() => {
    return holidays.filter((h) => {
      // Filter by Type
      if (selectedType !== "ALL" && h.type !== selectedType) return false;
      // Filter by Year (matches dates like "xx/xx/2026")
      if (selectedYear && !h.startDate.includes(selectedYear)) return false;
      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          h.name.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q) ||
          h.startDate.includes(q) ||
          h.endDate.includes(q)
        );
      }
      return true;
    });
  }, [holidays, selectedType, selectedYear, searchQuery]);

  // Handle Add New Holiday Form submission
  const handleAddHolidaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newStartDate || !newEndDate) {
      alert("Please fill in all required fields!");
      return;
    }

    // Format HTML date input "YYYY-MM-DD" to "DD/MM/YYYY"
    const formatDate = (dateStr: string) => {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    };

    const formattedStart = formatDate(newStartDate);
    const formattedEnd = formatDate(newEndDate);

    // Calculate days difference
    const startObj = new Date(newStartDate);
    const endObj = new Date(newEndDate);
    const timeDiff = endObj.getTime() - startObj.getTime();
    const daysDiff = Math.max(Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1, 1);

    const newRecord: HolidayRecord = {
      id: `H-${String(holidays.length + 1).padStart(3, "0")}`,
      name: newName,
      startDate: formattedStart,
      endDate: formattedEnd,
      days: daysDiff,
      type: newType,
      status: "Active",
      description: newDesc || "No description provided.",
    };

    setHolidays((prev) => [newRecord, ...prev]);
    setIsModalOpen(false);

    // Reset fields
    setNewName("");
    setNewStartDate("");
    setNewEndDate("");
    setNewType("Govt Holiday");
    setNewDesc("");
  };

  // Handle Delete Holiday
  const handleDeleteHoliday = (id: string) => {
    if (confirm("Are you sure you want to delete this holiday record from the registry?")) {
      setHolidays((prev) => prev.filter((h) => h.id !== id));
    }
  };

  // Utility Actions
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">
          {/* Breadcrumbs and Title Card */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Human Resource</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-semibold">Company Holiday</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <Calendar className="size-5.5 text-primary animate-pulse" />
                <span>Company Holiday</span>
              </h1>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="h-9 px-5 bg-primary hover:bg-primary-glow text-primary-foreground font-semibold text-xs rounded-lg shadow-sm flex items-center gap-2 transition uppercase tracking-wider"
            >
              <Plus className="size-4" />
              <span>Add Holiday</span>
            </button>
          </div>

          {/* Quick Statistics Summary Panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
            {[
              {
                label: "TOTAL HOLIDAYS",
                val: `${stats.total} Events`,
                desc: "Registered in calendar",
                color: "text-primary bg-primary/5 border-primary/10",
              },
              {
                label: "TOTAL OFF DAYS",
                val: `${stats.totalDays} Days`,
                desc: "Accumulated off days",
                color: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
              },
              {
                label: "GOVERNMENT HOLIDAYS",
                val: `${stats.govtCount} Events`,
                desc: "Gazetted public holidays",
                color: "text-amber-500 bg-amber-500/5 border-amber-500/10",
              },
              {
                label: "COMPANY SPECIFIC",
                val: `${stats.companyCount} Events`,
                desc: "Internal office breaks",
                color: "text-blue-500 bg-blue-500/5 border-blue-500/10",
              },
            ].map((st, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border bg-card ${st.color} shadow-xs space-y-1 transition duration-200 hover:scale-[1.01]`}
              >
                <span className="text-[9px] font-black tracking-wider uppercase opacity-75">
                  {st.label}
                </span>
                <div className="text-xl font-black">{st.val}</div>
                <div className="text-[10px] opacity-60 font-semibold">{st.desc}</div>
              </div>
            ))}
          </div>

          {/* Filtering Card */}
          <div className="bg-card rounded-lg border border-border/85 p-5 shadow-xs space-y-4 print:hidden">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                Filter Controls
              </span>
              <span className="text-[9px] font-bold text-muted-foreground/50">Search Registry</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Year Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Year Selection
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none text-primary"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              {/* Type Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Holiday Category
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none"
                >
                  <option value="ALL">ALL Categories</option>
                  <option value="Govt Holiday">Government Holidays Only</option>
                  <option value="Company Specific">Company Specific Only</option>
                </select>
              </div>

              {/* Real-time search query */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Query Text
                </label>
                <div className="relative">
                  <Search className="size-4 text-muted-foreground/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by holiday name..."
                    className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:bg-card focus:border-primary transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Holiday Spreadsheet Registry Card */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4">
            {/* Utilities Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4 print:hidden">
              <div className="flex items-center gap-1.5 select-none">
                <button className="h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition">
                  <FileSpreadsheet className="size-3.5 text-emerald-500" />
                  <span>EXCEL</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition"
                >
                  <Printer className="size-3.5 text-blue-500" />
                  <span>PRINT</span>
                </button>
                <button className="h-8.5 px-4 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition">
                  <FileDown className="size-3.5 text-rose-500" />
                  <span>PDF</span>
                </button>
              </div>

              <span className="text-[10px] font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border/50">
                Matches Found: {filteredHolidays.length} Events
              </span>
            </div>

            {/* Public Holiday Matrix Table */}
            <div className="overflow-x-auto border border-border/50 rounded-xl">
              <table className="w-full border-collapse text-[11px] text-left">
                <thead>
                  <tr className="bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap">
                    <th className="px-4 py-3 font-extrabold text-center w-12 border-r border-border/30">
                      SL
                    </th>
                    <th className="px-4 py-3 font-extrabold w-48 border-r border-border/30">
                      Holiday Name
                    </th>
                    <th className="px-4 py-3 font-extrabold text-center w-28 border-r border-border/30">
                      Start Date
                    </th>
                    <th className="px-4 py-3 font-extrabold text-center w-28 border-r border-border/30">
                      End Date
                    </th>
                    <th className="px-4 py-3 font-extrabold text-center w-24 border-r border-border/30">
                      Duration (Days)
                    </th>
                    <th className="px-4 py-3 font-extrabold w-36 border-r border-border/30">
                      Category
                    </th>
                    <th className="px-4 py-3 font-extrabold w-56 border-r border-border/30">
                      Description
                    </th>
                    <th className="px-4 py-3 font-extrabold text-center w-24 border-r border-border/30">
                      Status
                    </th>
                    <th className="px-4 py-3 font-extrabold text-center w-20 print:hidden">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredHolidays.map((row, idx) => {
                    let typeBadgeClass = "text-foreground font-semibold";
                    if (row.type === "Govt Holiday") {
                      typeBadgeClass = "text-amber-600 dark:text-amber-400 font-extrabold";
                    } else if (row.type === "Company Specific") {
                      typeBadgeClass = "text-blue-600 dark:text-blue-400 font-extrabold";
                    }

                    return (
                      <tr
                        key={row.id}
                        className="hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition duration-75 whitespace-nowrap"
                      >
                        <td className="px-4 py-2.5 text-center font-bold text-muted-foreground/60 border-r border-border/20">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-2.5 font-bold text-foreground border-r border-border/20">
                          {row.name}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-center text-foreground/80 border-r border-border/20">
                          {row.startDate}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-center text-foreground/80 border-r border-border/20">
                          {row.endDate}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-center font-extrabold text-primary border-r border-border/20">
                          {row.days} Days
                        </td>
                        <td className={`px-4 py-2.5 ${typeBadgeClass} border-r border-border/20`}>
                          {row.type}
                        </td>
                        <td
                          className="px-4 py-2.5 text-muted-foreground max-w-[200px] truncate border-r border-border/20"
                          title={row.description}
                        >
                          {row.description}
                        </td>
                        <td className="px-4 py-2.5 text-center border-r border-border/20">
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 text-[9.5px]">
                            <CheckCircle className="size-3" />
                            <span>{row.status}</span>
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-center print:hidden">
                          <button
                            onClick={() => handleDeleteHoliday(row.id)}
                            className="p-1 hover:bg-rose-500/10 text-rose-500 hover:text-rose-600 rounded transition"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredHolidays.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-4 py-16 text-center text-muted-foreground font-semibold"
                      >
                        No holiday records found matching the current year or search parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Holiday Animated Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-2xl rounded-lg border border-border/80 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-lg transition"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-base font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-3.5 mb-5">
              <CalendarDays className="size-5 text-primary animate-bounce" />
              <span>Add Corporate Holiday</span>
            </h3>

            <form onSubmit={handleAddHolidaySubmit} className="space-y-4 text-xs font-semibold">
              {/* Holiday Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Holiday Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Independence Day Break"
                  className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary focus:bg-card transition"
                />
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary focus:bg-card transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary focus:bg-card transition"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Holiday Category
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none"
                >
                  <option value="Govt Holiday">Government Holiday</option>
                  <option value="Company Specific">Company Specific Break</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Description
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Additional context or official notice reference details..."
                  className="w-full h-18 p-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold outline-none focus:border-primary focus:bg-card resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-border/30 mt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-4 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs transition uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-6 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs rounded-lg transition uppercase tracking-wider"
                >
                  Save Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
