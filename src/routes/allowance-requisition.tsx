import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  ChevronRight,
  Calendar,
  User,
  Search,
  FileSpreadsheet,
  Printer,
  FileDown,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Edit,
  SlidersHorizontal,
  Check,
  ChevronDown,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/allowance-requisition")({
  head: () => ({
    meta: [
      { title: "Allowance Requisition — CRIPTON" },
      { name: "description", content: "Create and manage allowance requisitions for employees." },
    ],
  }),
  component: AllowanceRequisitionPage,
});

// Mock Lists for dropdowns
const MOCK_DEPARTMENTS = [
  "ALL",
  "Project Resource & Strategy",
  "HR, Admin and Compliance",
  "Business Automation",
  "Implementation & Business Analysis",
  "Accounts & Finance",
];

const MOCK_UNITS = ["ALL", "PSL", "PTVL", "UGC", "ICT"];
const MOCK_LINES = ["ALL", "N/A", "Line 01", "Line 02", "Line 03"];
const MOCK_EMPLOYEES = [
  { id: "2023043910", name: "Tahmid Afsar", department: "Project Resource & Strategy", designation: "Deputy Manager", unit: "PSL", line: "N/A" },
  { id: "2026081190", name: "Kamal", department: "Business Automation", designation: "Junior Officer", unit: "ICT", line: "Line 01" },
  { id: "2016001055", name: "Md. Zahidul Islam", department: "HR, Admin and Compliance", designation: "Chief Operating Officer", unit: "PSL", line: "N/A" },
  { id: "2022035599", name: "Dipon Saha", department: "Accounts & Finance", designation: "Manager", unit: "PTVL", line: "Line 02" },
];

interface RequisitionItem {
  id: string;
  empId: string;
  name: string;
  department: string;
  designation: string;
  unit: string;
  line: string;
  inDate: string;
  inTime: string;
  outDate: string;
  outTime: string;
  ot: string;
  status: string;
}

// Initial records matching the user's screenshot
const INITIAL_REQUISITIONS: RequisitionItem[] = [
  { id: "AR-001", empId: "2023043910", name: "Tahmid Afsar", department: "Project Resource & Strategy", designation: "Deputy Manager", unit: "PSL", line: "N/A", inDate: "05/08/2026", inTime: "", outDate: "", outTime: "", ot: "0.00", status: "Holiday" },
  { id: "AR-002", empId: "2023043910", name: "Tahmid Afsar", department: "Project Resource & Strategy", designation: "Deputy Manager", unit: "PSL", line: "N/A", inDate: "06/08/2026", inTime: "", outDate: "", outTime: "", ot: "0.00", status: "Holiday" },
  { id: "AR-003", empId: "2023043910", name: "Tahmid Afsar", department: "Project Resource & Strategy", designation: "Deputy Manager", unit: "PSL", line: "N/A", inDate: "07/08/2026", inTime: "", outDate: "", outTime: "", ot: "0.00", status: "Holiday" },
  { id: "AR-004", empId: "2023043910", name: "Tahmid Afsar", department: "Project Resource & Strategy", designation: "Deputy Manager", unit: "PSL", line: "N/A", inDate: "08/08/2026", inTime: "", outDate: "", outTime: "", ot: "0.00", status: "Holiday" },
  { id: "AR-005", empId: "2023043910", name: "Tahmid Afsar", department: "Project Resource & Strategy", designation: "Deputy Manager", unit: "PSL", line: "N/A", inDate: "14/08/2026", inTime: "", outDate: "", outTime: "", ot: "0.00", status: "Holiday" },
  { id: "AR-006", empId: "2023043910", name: "Tahmid Afsar", department: "Project Resource & Strategy", designation: "Deputy Manager", unit: "PSL", line: "N/A", inDate: "21/08/2026", inTime: "", outDate: "", outTime: "", ot: "0.00", status: "Holiday" },
  { id: "AR-007", empId: "2023043910", name: "Tahmid Afsar", department: "Project Resource & Strategy", designation: "Deputy Manager", unit: "PSL", line: "N/A", inDate: "26/08/2026", inTime: "", outDate: "", outTime: "", ot: "0.00", status: "Holiday" },
  { id: "AR-008", empId: "2023043910", name: "Tahmid Afsar", department: "Project Resource & Strategy", designation: "Deputy Manager", unit: "PSL", line: "N/A", inDate: "27/08/2026", inTime: "", outDate: "", outTime: "", ot: "0.00", status: "Holiday" },
  { id: "AR-009", empId: "2023043910", name: "Tahmid Afsar", department: "Project Resource & Strategy", designation: "Deputy Manager", unit: "PSL", line: "N/A", inDate: "28/08/2026", inTime: "", outDate: "", outTime: "", ot: "0.00", status: "Holiday" },
];

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Reusable SearchableSelect matching existing design system
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select employee...",
  className = "",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filteredOptions = options.filter(
    (o) =>
      o.label.toLowerCase().includes(search.toLowerCase()) ||
      o.value.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
        }}
        className="w-full h-10 px-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold flex items-center justify-between text-left focus:border-[#2563eb] hover:bg-slate-100/80 transition duration-150 cursor-pointer"
      >
        <span className="truncate text-slate-800 font-bold">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`size-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden animate-in fade-in-50 slide-in-from-top-1 duration-150">
          <div className="p-2 border-b border-slate-100 relative">
            <Search className="size-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full h-8 pl-8 pr-3 bg-slate-50 border border-slate-200 focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 rounded-lg outline-none text-xs font-bold transition font-sans"
            />
          </div>

          <div className="max-h-48 overflow-y-auto p-1 divide-y divide-slate-100 font-sans text-xs">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left rounded-lg transition duration-100 flex items-center justify-between font-bold ${
                      isSelected
                        ? "bg-[#2563eb]/10 text-[#2563eb]"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check className="size-3 text-[#2563eb]" />}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-2.5 text-center text-slate-400 text-[11px] font-medium">
                No matching employees found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AllowanceRequisitionPage() {
  const [records, setRecords] = useState<RequisitionItem[]>(INITIAL_REQUISITIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter States
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-30");
  const [filterEmpId, setFilterEmpId] = useState("2023043910");
  const [filterEmpType, setFilterEmpType] = useState("ALL");
  const [filterDept, setFilterDept] = useState("ALL");
  const [filterUnit, setFilterUnit] = useState("ALL");
  const [filterLine, setFilterLine] = useState("ALL");

  // Modals States
  const [isBatchAssignOpen, setIsBatchAssignOpen] = useState(false);
  const [isSingleEditOpen, setIsSingleEditOpen] = useState(false);

  // Single Edit / New Record Form State
  const [targetRecord, setTargetRecord] = useState<RequisitionItem | null>(null);
  const [formData, setFormData] = useState({
    empId: "",
    name: "",
    department: "",
    designation: "",
    unit: "",
    line: "",
    inDate: "",
    inTime: "",
    outDate: "",
    outTime: "",
    ot: "0.00",
    status: "Holiday",
  });

  // Batch Assignment Form State
  const [batchFormData, setBatchFormData] = useState({
    inTime: "",
    outTime: "",
    ot: "0.00",
    status: "Holiday",
  });

  const employeeOptions = useMemo(() => {
    return MOCK_EMPLOYEES.map((e) => ({
      value: e.id,
      label: `${e.id} - ${e.name}`,
    }));
  }, []);

  // Filter & Search Logic
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Filter parameters
      if (filterEmpId && r.empId !== filterEmpId) return false;
      if (filterDept !== "ALL" && r.department !== filterDept) return false;
      if (filterUnit !== "ALL" && r.unit !== filterUnit) return false;
      if (filterLine !== "ALL" && r.line !== filterLine) return false;

      // Text search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.empId.includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q) ||
          r.inDate.includes(q)
        );
      }
      return true;
    });
  }, [records, searchQuery, filterEmpId, filterDept, filterUnit, filterLine]);

  // Checkbox management
  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map((r) => r.id));
    }
  };

  // Inline OT Change handler
  const handleInlineOtChange = (id: string, otVal: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ot: otVal } : r))
    );
  };

  // SHOW filter click handler
  const handleShowData = () => {
    const selectedEmp = MOCK_EMPLOYEES.find((e) => e.id === filterEmpId);
    if (!selectedEmp) return;

    // Load/Generate mock holiday data based on selected criteria
    const formattedStart = new Date(startDate);
    const formattedEnd = new Date(endDate);
    
    if (isNaN(formattedStart.getTime()) || isNaN(formattedEnd.getTime())) {
      toast.error("Please select valid dates");
      return;
    }

    // Keep the Tahmid Afsar mock rows if selected, else generate dynamically
    if (filterEmpId === "2023043910") {
      setRecords(INITIAL_REQUISITIONS);
    } else {
      // Generate some dummy holidays for the selected person
      const generated: RequisitionItem[] = [];
      let current = new Date(formattedStart);
      let sl = 1;
      while (current <= formattedEnd && generated.length < 5) {
        const isHoliday = current.getDay() === 5 || current.getDay() === 6; // Fri or Sat
        if (isHoliday) {
          const day = String(current.getDate()).padStart(2, "0");
          const month = String(current.getMonth() + 1).padStart(2, "0");
          const year = current.getFullYear();
          generated.push({
            id: `AR-GEN-${sl}`,
            empId: selectedEmp.id,
            name: selectedEmp.name,
            department: selectedEmp.department,
            designation: selectedEmp.designation,
            unit: selectedEmp.unit,
            line: selectedEmp.line,
            inDate: `${day}/${month}/${year}`,
            inTime: "",
            outDate: "",
            outTime: "",
            ot: "0.00",
            status: "Holiday",
          });
          sl++;
        }
        current.setDate(current.getDate() + 1);
      }
      setRecords(generated);
    }
    setSelectedIds([]);
    toast.success("Filters applied and list updated!");
  };

  // Delete Row
  const handleDeleteRow = (id: string) => {
    if (window.confirm("Are you sure you want to delete this requisition item?")) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      toast.success("Record deleted successfully.");
    }
  };

  // Open single edit modal
  const handleOpenEdit = (item: RequisitionItem) => {
    setTargetRecord(item);
    setFormData({
      empId: item.empId,
      name: item.name,
      department: item.department,
      designation: item.designation,
      unit: item.unit,
      line: item.line,
      inDate: item.inDate,
      inTime: item.inTime,
      outDate: item.outDate,
      outTime: item.outTime,
      ot: item.ot,
      status: item.status,
    });
    setIsSingleEditOpen(true);
  };

  // Save single edit
  const handleSaveSingleEdit = () => {
    if (!formData.inDate) {
      toast.error("Please enter a valid Date.");
      return;
    }
    setRecords((prev) =>
      prev.map((r) =>
        r.id === targetRecord?.id
          ? {
              ...r,
              inDate: formData.inDate,
              inTime: formData.inTime,
              outDate: formData.outDate,
              outTime: formData.outTime,
              ot: formData.ot,
              status: formData.status,
            }
          : r
      )
    );
    setIsSingleEditOpen(false);
    setTargetRecord(null);
    toast.success("Requisition updated successfully!");
  };



  // Open batch assign modal
  const handleOpenBatchAssign = () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one record to assign parameters.");
      return;
    }
    setBatchFormData({
      inTime: "",
      outTime: "",
      ot: "0.00",
      status: "Holiday",
    });
    setIsBatchAssignOpen(true);
  };

  // Save batch assign values
  const handleApplyBatchAssign = () => {
    setRecords((prev) =>
      prev.map((r) => {
        if (selectedIds.includes(r.id)) {
          return {
            ...r,
            inTime: batchFormData.inTime || r.inTime,
            outTime: batchFormData.outTime || r.outTime,
            ot: batchFormData.ot || r.ot,
            status: batchFormData.status || r.status,
          };
        }
        return r;
      })
    );
    setIsBatchAssignOpen(false);
    toast.success(`Batch parameters assigned to ${selectedIds.length} records!`);
  };

  // Excel export utility
  const handleExportCSV = () => {
    const headers = [
      "SL",
      "Emp ID",
      "Name",
      "Department",
      "Designation",
      "Unit",
      "Line",
      "In Date",
      "In Time",
      "Out Date",
      "Out Time",
      "OT",
      "Status",
    ];
    const rows = filteredRecords.map((r, index) => [
      index + 1,
      r.empId,
      r.name,
      r.department,
      r.designation,
      r.unit,
      r.line,
      r.inDate,
      r.inTime,
      r.outDate,
      r.outTime,
      r.ot,
      r.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `allowance_requisition_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported to Excel successfully!");
  };

  // Submit all records
  const handleSubmitRequisitions = () => {
    toast.success(`Submitted allowance requisitions successfully for ${filteredRecords.length} records!`);
  };

  const insetLabelClass = "text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1 block";
  const insetInputClass =
    "w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm appearance-none";

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto bg-muted/20 pb-10">
        <Topbar />

        <div className="flex-1 flex flex-col p-4 md:p-6 w-full space-y-6">
          {/* Breadcrumbs and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <Link to="/" className="hover:text-[#2563eb] transition-colors">
                Home
              </Link>
              <ChevronRight className="size-3" />
              <span className="text-slate-500">Human Resource</span>
              <ChevronRight className="size-3" />
              <span className="text-slate-800 font-bold">Allowance Requisition</span>
            </div>

          </div>

          {/* Heading */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2.5">
              Allowance Requisition
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Create, view, and process allowance requisitions for holiday duty and overtime parameters.
            </p>
          </div>

          {/* Upper Section: Filters & Assign Card */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            {/* Left Box: Filters */}
            <div className="lg:col-span-3 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Start Date */}
                <div className="space-y-1">
                  <Label className={insetLabelClass}>Start Date</Label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={insetInputClass}
                    />
                  </div>
                </div>

                {/* To Date */}
                <div className="space-y-1">
                  <Label className={insetLabelClass}>To Date</Label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={insetInputClass}
                    />
                  </div>
                </div>

                {/* Employee ID SearchableSelect */}
                <div className="space-y-1 sm:col-span-2">
                  <Label className={insetLabelClass}>Employee ID</Label>
                  <SearchableSelect
                    options={employeeOptions}
                    value={filterEmpId}
                    onChange={setFilterEmpId}
                  />
                </div>

                {/* Employee Type */}
                <div className="space-y-1">
                  <Label className={insetLabelClass}>Employee Type</Label>
                  <div className="relative">
                    <select
                      className={insetInputClass}
                      value={filterEmpType}
                      onChange={(e) => setFilterEmpType(e.target.value)}
                    >
                      {MOCK_EMPLOYEES.map((e) => (
                        <option key={e.id} value={e.id === "2023043910" ? "ALL" : e.id}>
                          {e.id === "2023043910" ? "ALL" : e.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown className="size-3.5" />
                    </div>
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-1">
                  <Label className={insetLabelClass}>Department</Label>
                  <div className="relative">
                    <select
                      className={insetInputClass}
                      value={filterDept}
                      onChange={(e) => setFilterDept(e.target.value)}
                    >
                      {MOCK_DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown className="size-3.5" />
                    </div>
                  </div>
                </div>

                {/* Unit */}
                <div className="space-y-1">
                  <Label className={insetLabelClass}>Unit</Label>
                  <div className="relative">
                    <select
                      className={insetInputClass}
                      value={filterUnit}
                      onChange={(e) => setFilterUnit(e.target.value)}
                    >
                      {MOCK_UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown className="size-3.5" />
                    </div>
                  </div>
                </div>

                {/* Line */}
                <div className="space-y-1">
                  <Label className={insetLabelClass}>Line</Label>
                  <div className="relative">
                    <select
                      className={insetInputClass}
                      value={filterLine}
                      onChange={(e) => setFilterLine(e.target.value)}
                    >
                      {MOCK_LINES.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown className="size-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <Button
                  onClick={handleShowData}
                  className="h-10 px-6 rounded-lg bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm"
                >
                  Show
                </Button>
              </div>
            </div>

            {/* Right Box: Assign Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-blue-300 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Assign
                  </span>
                  <div className="text-4xl font-extrabold text-slate-800 mt-2 select-none">
                    {selectedIds.length}
                  </div>
                </div>
                <button
                  onClick={handleOpenBatchAssign}
                  className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-[#2563eb] rounded-lg border border-slate-200 transition-colors shadow-sm cursor-pointer"
                  title="Batch Assign Parameters"
                >
                  <Pencil className="size-4" />
                </button>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                <Info className="size-3.5 text-blue-500" />
                <span>Select rows to batch assign parameters.</span>
              </div>
            </div>
          </div>

          {/* Action Export bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-[10px] font-bold uppercase tracking-wider transition-colors bg-white cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="size-3.5" /> Excel
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 text-[10px] font-bold uppercase tracking-wider transition-colors bg-white cursor-pointer shadow-xs"
              >
                <Printer className="size-3.5" /> Print
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-bold uppercase tracking-wider transition-colors bg-white cursor-pointer shadow-xs"
              >
                <FileDown className="size-3.5" /> PDF
              </button>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500">Search:</span>
              <Input
                placeholder="Search listing..."
                className="h-9 w-full sm:w-60 rounded-lg bg-white border-slate-200 text-sm focus:ring-1 focus:ring-[#2563eb] shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 flex flex-col">
            <div className="overflow-x-auto">
              <Table className="whitespace-nowrap">
                <TableHeader className="bg-slate-50/75 border-b border-slate-200">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[40px] px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredRecords.length > 0 &&
                          selectedIds.length === filteredRecords.length
                        }
                        onChange={handleToggleSelectAll}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 size-3.5 cursor-pointer"
                      />
                    </TableHead>
                    <TableHead className="w-[50px] px-4 py-3 text-center text-[10px] font-black uppercase text-slate-500">
                      SL
                    </TableHead>
                    <TableHead className="px-4 py-3 text-[10px] font-black uppercase text-slate-500">
                      Emp ID
                    </TableHead>
                    <TableHead className="px-4 py-3 text-[10px] font-black uppercase text-slate-500">
                      Name
                    </TableHead>
                    <TableHead className="px-4 py-3 text-[10px] font-black uppercase text-slate-500">
                      Department
                    </TableHead>
                    <TableHead className="px-4 py-3 text-[10px] font-black uppercase text-slate-500">
                      Designation
                    </TableHead>
                    <TableHead className="px-4 py-3 text-[10px] font-black uppercase text-slate-500">
                      Unit
                    </TableHead>
                    <TableHead className="px-4 py-3 text-[10px] font-black uppercase text-slate-500">
                      Line
                    </TableHead>
                    <TableHead className="px-4 py-3 text-[10px] font-black uppercase text-slate-500">
                      In Date
                    </TableHead>
                    <TableHead className="px-4 py-3 text-[10px] font-black uppercase text-slate-500">
                      In Time
                    </TableHead>
                    <TableHead className="px-4 py-3 text-[10px] font-black uppercase text-slate-500">
                      Out Date
                    </TableHead>
                    <TableHead className="px-4 py-3 text-[10px] font-black uppercase text-slate-500">
                      Out Time
                    </TableHead>
                    <TableHead className="px-4 py-3 text-[10px] font-black uppercase text-slate-500 w-[100px]">
                      OT
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center text-[10px] font-black uppercase text-slate-500">
                      Status
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center text-[10px] font-black uppercase text-slate-500">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-slate-100">
                  {filteredRecords.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={15} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <AlertCircle className="size-10 text-slate-300 mb-2" />
                          <span className="text-sm font-semibold">No records found</span>
                          <span className="text-xs text-slate-400 mt-0.5">
                            Try adjusting filters or search query.
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((row, idx) => {
                      const isSelected = selectedIds.includes(row.id);
                      return (
                        <TableRow
                          key={row.id}
                          className={`hover:bg-slate-50/50 transition-colors ${
                            isSelected ? "bg-blue-50/20" : ""
                          }`}
                        >
                          <TableCell className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleRow(row.id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 size-3.5 cursor-pointer"
                            />
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center text-xs font-semibold text-slate-500">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs font-bold text-slate-800">
                            {row.empId}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs font-semibold text-slate-700">
                            {row.name}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs text-slate-600">
                            {row.department}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs text-slate-600">
                            {row.designation}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs text-slate-500">
                            {row.unit}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs text-slate-500">
                            {row.line}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs text-slate-600 font-medium">
                            {row.inDate}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs text-slate-600 font-mono">
                            {row.inTime || "-"}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs text-slate-600 font-medium">
                            {row.outDate || "-"}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs text-slate-600 font-mono">
                            {row.outTime || "-"}
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <input
                              type="text"
                              value={row.ot}
                              onChange={(e) => handleInlineOtChange(row.id, e.target.value)}
                              className="h-8 w-20 px-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs"
                            />
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-bold uppercase tracking-wider ${
                                row.status === "Holiday"
                                  ? "bg-amber-50 text-amber-600 border-amber-200"
                                  : row.status === "Present"
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                    : "bg-slate-50 text-slate-500 border-slate-200"
                              }`}
                            >
                              {row.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenEdit(row)}
                                className="p-1.5 hover:bg-amber-50 text-amber-500 hover:text-amber-600 rounded-lg transition-colors border border-transparent hover:border-amber-100 cursor-pointer"
                                title="Edit Requisition"
                              >
                                <Edit className="size-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteRow(row.id)}
                                className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-100 cursor-pointer"
                                title="Delete Requisition"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Table Footer */}
            <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 gap-4">
              <span className="text-xs font-medium text-slate-500">
                Showing 1 to {filteredRecords.length} of {filteredRecords.length} entries
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-semibold text-slate-600 border-slate-200 bg-white hover:bg-slate-50 shadow-xs cursor-not-allowed"
                  disabled
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-semibold text-slate-600 border-slate-200 bg-white hover:bg-slate-50 shadow-xs cursor-not-allowed"
                  disabled
                >
                  Next
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Submit Actions */}
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <Button
              onClick={handleSubmitRequisitions}
              className="h-10 px-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md"
            >
              Submit
            </Button>
          </div>
        </div>
      </main>

      {/* Batch Assign Modal */}
      <Dialog open={isBatchAssignOpen} onOpenChange={setIsBatchAssignOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white rounded-lg shadow-xl border-0">
          <DialogHeader className="px-6 py-4 border-b border-slate-100">
            <DialogTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-blue-500" />
              Batch Assign Parameters ({selectedIds.length} items)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Assign time punch and overtime properties to all selected items simultaneously.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4 bg-slate-50/30">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={insetLabelClass}>In Time</Label>
                <Input
                  type="text"
                  placeholder="e.g. 09:00 AM"
                  value={batchFormData.inTime}
                  onChange={(e) => setBatchFormData({ ...batchFormData, inTime: e.target.value })}
                  className={insetInputClass}
                />
              </div>
              <div>
                <Label className={insetLabelClass}>Out Time</Label>
                <Input
                  type="text"
                  placeholder="e.g. 06:00 PM"
                  value={batchFormData.outTime}
                  onChange={(e) => setBatchFormData({ ...batchFormData, outTime: e.target.value })}
                  className={insetInputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={insetLabelClass}>OT Hours</Label>
                <Input
                  type="text"
                  placeholder="e.g. 1.50"
                  value={batchFormData.ot}
                  onChange={(e) => setBatchFormData({ ...batchFormData, ot: e.target.value })}
                  className={insetInputClass}
                />
              </div>
              <div>
                <Label className={insetLabelClass}>Status</Label>
                <div className="relative">
                  <select
                    className={insetInputClass}
                    value={batchFormData.status}
                    onChange={(e) => setBatchFormData({ ...batchFormData, status: e.target.value })}
                  >
                    <option value="Holiday">Holiday</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown className="size-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 bg-white">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-lg px-5 text-xs font-bold text-slate-600 border-slate-200 hover:bg-slate-50 uppercase tracking-wide"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleApplyBatchAssign}
              className="h-9 rounded-lg px-5 text-xs font-bold bg-[#2563eb] hover:bg-blue-700 text-white uppercase tracking-wide"
            >
              Assign Parameters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single Edit Modal */}
      <Dialog open={isSingleEditOpen} onOpenChange={setIsSingleEditOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white rounded-lg shadow-xl border-0">
          <DialogHeader className="px-6 py-4 border-b border-slate-100">
            <DialogTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Edit className="size-5 text-amber-500" />
              Edit Requisition Record
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-4 bg-slate-50/30">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={insetLabelClass}>Employee ID</Label>
                <Input value={formData.empId} disabled className={`${insetInputClass} bg-slate-50 text-slate-400 cursor-not-allowed`} />
              </div>
              <div>
                <Label className={insetLabelClass}>Employee Name</Label>
                <Input value={formData.name} disabled className={`${insetInputClass} bg-slate-50 text-slate-400 cursor-not-allowed`} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={insetLabelClass}>In Date</Label>
                <Input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={formData.inDate}
                  onChange={(e) => setFormData({ ...formData, inDate: e.target.value })}
                  className={insetInputClass}
                />
              </div>
              <div>
                <Label className={insetLabelClass}>Status</Label>
                <div className="relative">
                  <select
                    className={insetInputClass}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Holiday">Holiday</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown className="size-3.5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={insetLabelClass}>In Time</Label>
                <Input
                  type="text"
                  placeholder="e.g. 09:00 AM"
                  value={formData.inTime}
                  onChange={(e) => setFormData({ ...formData, inTime: e.target.value })}
                  className={insetInputClass}
                />
              </div>
              <div>
                <Label className={insetLabelClass}>Out Time</Label>
                <Input
                  type="text"
                  placeholder="e.g. 06:00 PM"
                  value={formData.outTime}
                  onChange={(e) => setFormData({ ...formData, outTime: e.target.value })}
                  className={insetInputClass}
                />
              </div>
            </div>

            <div>
              <Label className={insetLabelClass}>OT Hours</Label>
              <Input
                type="text"
                placeholder="e.g. 0.00"
                value={formData.ot}
                onChange={(e) => setFormData({ ...formData, ot: e.target.value })}
                className={insetInputClass}
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 bg-white">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-lg px-5 text-xs font-bold text-slate-600 border-slate-200 hover:bg-slate-50 uppercase tracking-wide"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleSaveSingleEdit}
              className="h-9 rounded-lg px-5 text-xs font-bold bg-[#2563eb] hover:bg-blue-700 text-white uppercase tracking-wide"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
}
