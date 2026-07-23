import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ChevronRight,
  Calculator,
  CheckCircle2,
  Search,
  Play,
  FileText,
  Printer,
  FileDown,
  Send,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/yearly-bonus-process")({
  head: () => ({
    meta: [
      { title: "Yearly Bonus Process — CRIPTON" },
      { name: "description", content: "Process and submit yearly bonuses." },
    ],
  }),
  component: YearlyBonusProcessPage,
});

interface FestivalBonusRule {
  id: string;
  minTenureMonths: number;
  maxTenureMonths: number;
  bonusType: "basic-percent" | "gross-percent" | "flat";
  bonusValue: number;
}

function YearlyBonusProcessPage() {
  const [activeTab, setActiveTab] = useState("processing");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [submittedRows, setSubmittedRows] = useState<number[]>([]);

  // Filter states
  const [effectiveDate, setEffectiveDate] = useState("2026-06-23");
  const [bonusType, setBonusType] = useState("Eid-ul-Fitr");
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Jun");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [department, setDepartment] = useState("All Departments");

  // Load rules from local storage
  const [bonusRules, setBonusRules] = useState<FestivalBonusRule[]>([]);

  useEffect(() => {
    const storedRules = localStorage.getItem("payroll_bonus_rules");
    if (storedRules) {
      try {
        const parsed = JSON.parse(storedRules);
        if (Array.isArray(parsed)) {
          setBonusRules(parsed);
          return;
        }
      } catch (e) {
        console.error("Failed to parse bonus rules", e);
      }
    }
    // Fallback defaults matching user tenure requirements
    setBonusRules([
      { id: "1", minTenureMonths: 0, maxTenureMonths: 3, bonusType: "flat", bonusValue: 1000 },
      { id: "2", minTenureMonths: 3, maxTenureMonths: 6, bonusType: "basic-percent", bonusValue: 50 },
      { id: "3", minTenureMonths: 6, maxTenureMonths: 12, bonusType: "basic-percent", bonusValue: 80 },
      { id: "4", minTenureMonths: 12, maxTenureMonths: 999, bonusType: "basic-percent", bonusValue: 100 }
    ]);
  }, []);

  // Helper calculation for tenure months
  const getTenureMonths = (joinDateStr: string, effectiveDateStr: string) => {
    const join = new Date(joinDateStr);
    const eff = new Date(effectiveDateStr);
    if (isNaN(join.getTime()) || isNaN(eff.getTime())) return 0;
    const diffYears = eff.getFullYear() - join.getFullYear();
    const diffMonths = eff.getMonth() - join.getMonth();
    const months = diffYears * 12 + diffMonths;
    return months >= 0 ? months : 0;
  };

  // Mock data for dropdowns
  const years = ["2026", "2025", "2024"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const bonusTypes = ["--Select--", "Eid-ul-Fitr", "Eid-ul-Adha", "Durga Puja", "Christmas"];
  const employeeTypes = ["ALL", "Regular", "Contractual"];

  // Mock base employees
  const mockBaseEmployees = [
    {
      id: 1,
      empId: "1001",
      empIdOff: "O-1001",
      name: "Tahmid Afsar Shapno",
      type: "Regular",
      dept: "IT",
      section: "Software",
      desig: "HR Director",
      joinDate: "2020-01-15",
      basic: 45000,
      gross: 75000,
    },
    {
      id: 2,
      empId: "1002",
      empIdOff: "O-1002",
      name: "Rajebul Hasan Rajon",
      type: "Regular",
      dept: "Operations",
      section: "Production",
      desig: "Manager",
      joinDate: "2021-03-10",
      basic: 35000,
      gross: 60000,
    },
    {
      id: 3,
      empId: "1003",
      empIdOff: "O-1003",
      name: "John Doe",
      type: "Contractual",
      dept: "Operations",
      section: "Logistics",
      desig: "Executive",
      joinDate: "2025-11-20", // joined recently
      basic: 20000,
      gross: 35000,
    },
    {
      id: 4,
      empId: "1004",
      empIdOff: "O-1004",
      name: "Sarah Kabir",
      type: "Regular",
      dept: "HR",
      section: "Admin",
      desig: "Specialist",
      joinDate: "2026-02-10", // joined ~4 months before effective date
      basic: 30000,
      gross: 50000,
    }
  ];

  // Dynamically compute bonus values based on local storage tenure rule matching
  const processedEmployees = useMemo(() => {
    return mockBaseEmployees.map((emp) => {
      const tenure = getTenureMonths(emp.joinDate, effectiveDate);
      const rule = bonusRules.find(r => tenure >= r.minTenureMonths && tenure < r.maxTenureMonths);
      
      let percentage = 0;
      let bonusAmount = 0;
      
      if (rule) {
        if (rule.bonusType === "basic-percent") {
          percentage = rule.bonusValue;
          bonusAmount = Math.round(emp.basic * (rule.bonusValue / 100));
        } else if (rule.bonusType === "gross-percent") {
          percentage = rule.bonusValue;
          bonusAmount = Math.round(emp.gross * (rule.bonusValue / 100));
        } else if (rule.bonusType === "flat") {
          percentage = 100;
          bonusAmount = rule.bonusValue;
        }
      }
      
      return {
        ...emp,
        percentage,
        bonusAmount,
        tenureMonths: tenure
      };
    });
  }, [bonusRules, effectiveDate]);

  const handleFetchData = () => {
    setIsDataLoaded(true);
    setIsFilterModalOpen(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(processedEmployees.filter((d) => !submittedRows.includes(d.id)).map((d) => d.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  const handleSubmit = () => {
    if (selectedRows.length === 0) return;
    alert(`Successfully submitted bonus for ${selectedRows.length} employees!`);

    setSubmittedRows((prev) => [...prev, ...selectedRows]);
    setSelectedRows([]);
    setActiveTab("submitted");
  };

  const handleDelete = () => {
    if (selectedRows.length === 0) return;
    const confirm = window.confirm(
      `Are you sure you want to delete processing data for ${selectedRows.length} employees?`,
    );
    if (confirm) {
      alert("Deleted successfully.");
      setSelectedRows([]);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto bg-muted/20">
        <Topbar />

        <div className="p-4 md:p-6 space-y-6 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span>Payroll</span>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-semibold">Yearly Bonus Process</span>
          </div>

          {/* Header */}
          <div className="bg-card border border-border/60 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 rounded-md border border-primary/20 text-primary">
                    <Calculator className="size-5" />
                  </div>
                  Yearly Bonus Process & Submit
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                  Unified workspace to process yearly bonuses, review calculations, and submit for
                  final approval.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex bg-muted/30 border border-border/60 rounded-md p-0.5 shadow-sm">
                  <Button variant="ghost" size="sm" className="h-9 px-3 text-xs font-medium">
                    <FileDown className="size-4 mr-1.5 text-emerald-600" />
                    EXCEL
                  </Button>
                  <div className="w-px bg-border/60 my-1"></div>
                  <Button variant="ghost" size="sm" className="h-9 px-3 text-xs font-medium">
                    <Printer className="size-4 mr-1.5 text-blue-600" />
                    PRINT
                  </Button>
                  <div className="w-px bg-border/60 my-1"></div>
                  <Button variant="ghost" size="sm" className="h-9 px-3 text-xs font-medium">
                    <FileText className="size-4 mr-1.5 text-rose-600" />
                    PDF
                  </Button>
                </div>

                <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      className="bg-primary hover:bg-primary/90 text-white border-0 shadow-sm font-semibold h-9 px-4 cursor-pointer"
                    >
                      <Play className="size-4 mr-2 fill-current" />
                      PROCESS
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto bg-slate-50 border-slate-200 shadow-2xl p-6">
                    <DialogHeader className="mb-4">
                      <DialogTitle className="flex items-center gap-2 text-slate-700 text-lg font-semibold">
                        <Search className="size-5 text-slate-400" />
                        Bonus Filter Configuration
                      </DialogTitle>
                    </DialogHeader>

                    <div className="py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Bonus Configuration */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                          Bonus For
                        </label>
                        <select 
                          value={bonusType}
                          onChange={(e) => setBonusType(e.target.value)}
                          className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          {bonusTypes.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                          Effective Date
                        </label>
                        <input
                          type="date"
                          value={effectiveDate}
                          onChange={(e) => setEffectiveDate(e.target.value)}
                          className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                          Year
                        </label>
                        <select 
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                          Month
                        </label>
                        <select 
                          value={month}
                          onChange={(e) => setMonth(e.target.value)}
                          className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          {months.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Organization */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                          Employee Type
                        </label>
                        <select 
                          value={employeeType}
                          onChange={(e) => setEmployeeType(e.target.value)}
                          className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          {employeeTypes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                          Department
                        </label>
                        <select 
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="All Departments">All Departments</option>
                          <option value="IT">IT</option>
                          <option value="Operations">Operations</option>
                          <option value="HR">HR</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                          Section
                        </label>
                        <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                          <option>ALL</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                            EmpId
                          </label>
                          <div className="flex items-center gap-2 text-[10px]">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name="empid_type_bonus"
                                defaultChecked
                                className="accent-primary"
                              />{" "}
                              System
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name="empid_type_bonus"
                                className="accent-primary"
                              />{" "}
                              Office
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="Employee ID"
                          className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <DialogFooter className="pt-6 mt-4 border-t border-slate-200/60">
                      <Button
                        variant="outline"
                        className="h-10 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100 font-medium px-6 cursor-pointer"
                        onClick={() => setIsFilterModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        className="h-10 rounded-lg bg-[#279863] hover:bg-[#208050] text-white font-medium px-6 shadow-sm cursor-pointer"
                        onClick={handleFetchData}
                      >
                        <Search className="size-4 mr-1.5" />
                        FETCH DATA
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Data Tables */}
          <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-2 border-b border-border/60 flex items-center justify-between bg-muted/10">
                <TabsList className="bg-background/50 border border-border/40 p-1">
                  <TabsTrigger value="processing" className="text-xs px-4">
                    Processing Details
                  </TabsTrigger>
                  <TabsTrigger value="submitted" className="text-xs px-4">
                    Submitted List
                  </TabsTrigger>
                </TabsList>

                <div className="relative max-w-xs w-full mr-2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search in table..."
                    className="w-full h-8 pl-9 pr-3 rounded-md border border-input bg-background text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>

              {/* Tab 1: Processing Details */}
              <TabsContent value="processing" className="m-0 border-0 outline-none">
                <div className="bg-primary/5 px-4 py-2 text-xs border-b border-primary/10 flex items-center gap-2 text-primary">
                  <CheckCircle2 className="size-4" />
                  <span>
                    Review calculations, add feedback, and select employees before submitting the
                    yearly bonus.
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/30 text-muted-foreground font-semibold border-b border-border/60">
                      <tr>
                        <th className="px-4 py-3 whitespace-nowrap w-10 sticky left-0 bg-muted/30 z-10">
                          <input
                            type="checkbox"
                            className="rounded border-input accent-primary size-4 cursor-pointer"
                            checked={
                              isDataLoaded &&
                              processedEmployees.filter((r) => !submittedRows.includes(r.id)).length > 0 &&
                              selectedRows.length ===
                                processedEmployees.filter((r) => !submittedRows.includes(r.id)).length
                            }
                            onChange={handleSelectAll}
                            disabled={
                              !isDataLoaded ||
                              processedEmployees.filter((r) => !submittedRows.includes(r.id)).length === 0
                            }
                          />
                        </th>
                        <th className="px-4 py-3 whitespace-nowrap">Feedback</th>
                        <th className="px-4 py-3 whitespace-nowrap">Emp Id</th>
                        <th className="px-4 py-3 whitespace-nowrap">Emp ID(Off)</th>
                        <th className="px-4 py-3 whitespace-nowrap min-w-[150px]">Name</th>
                        <th className="px-4 py-3 whitespace-nowrap">Department</th>
                        <th className="px-4 py-3 whitespace-nowrap">Section</th>
                        <th className="px-4 py-3 whitespace-nowrap">Designation</th>
                        <th className="px-4 py-3 whitespace-nowrap">Join Date</th>
                        <th className="px-4 py-3 whitespace-nowrap">Tenure</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right">Basic</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right">Gross</th>
                        <th className="px-4 py-3 whitespace-nowrap text-center">Bonus(%) / Flat</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right font-bold text-primary">
                          Bonus Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {!isDataLoaded ||
                      processedEmployees.filter((r) => !submittedRows.includes(r.id)).length === 0 ? (
                        <tr>
                          <td colSpan={14} className="px-4 py-12 text-center text-muted-foreground">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Search className="size-8 opacity-20" />
                              <p>
                                {!isDataLoaded
                                  ? "No records found for processing. Click SEARCH or PROCESS."
                                  : "All bonuses have been submitted."}
                                </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        processedEmployees
                          .filter((r) => !submittedRows.includes(r.id))
                          .map((row) => (
                            <tr
                              key={`proc-${row.id}`}
                              className={`hover:bg-muted/30 transition-colors ${selectedRows.includes(row.id) ? "bg-primary/5" : ""}`}
                            >
                              <td className="px-4 py-2 sticky left-0 z-10 bg-background/95 backdrop-blur">
                                <input
                                  type="checkbox"
                                  className="rounded border-input accent-primary size-4 cursor-pointer"
                                  checked={selectedRows.includes(row.id)}
                                  onChange={() => handleSelectRow(row.id)}
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="text"
                                  placeholder="Add feedback..."
                                  className="h-7 text-xs rounded border border-input bg-background px-2 min-w-[120px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                              </td>
                              <td className="px-4 py-2">{row.empId}</td>
                              <td className="px-4 py-2">{row.empIdOff}</td>
                              <td className="px-4 py-2 font-medium">{row.name}</td>
                              <td className="px-4 py-2">{row.dept}</td>
                              <td className="px-4 py-2">{row.section}</td>
                              <td className="px-4 py-2">{row.desig}</td>
                              <td className="px-4 py-2">{row.joinDate}</td>
                              <td className="px-4 py-2 font-semibold text-slate-700">
                                {row.tenureMonths} mths
                              </td>
                              <td className="px-4 py-2 text-right">{row.basic.toLocaleString()}</td>
                              <td className="px-4 py-2 text-right">{row.gross.toLocaleString()}</td>
                              <td className="px-4 py-2 text-center font-bold">
                                {row.percentage === 100 && row.bonusAmount !== row.basic && row.bonusAmount !== row.gross 
                                  ? "Flat Payout" 
                                  : `${row.percentage}%`}
                              </td>
                              <td className="px-4 py-2 text-right font-bold">
                                {row.bonusAmount.toLocaleString()}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Processing actions */}
                {isDataLoaded &&
                  processedEmployees.filter((r) => !submittedRows.includes(r.id)).length > 0 && (
                    <div className="p-4 border-t border-border/60 flex items-center justify-between bg-muted/5">
                      <div className="text-xs text-muted-foreground">
                        Selected <span className="font-bold text-foreground">{selectedRows.length}</span> of{" "}
                        <span className="font-bold text-foreground">
                          {processedEmployees.filter((r) => !submittedRows.includes(r.id)).length}
                        </span>{" "}
                        employees
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 h-9 font-semibold text-xs"
                          onClick={handleDelete}
                          disabled={selectedRows.length === 0}
                        >
                          <Trash2 className="size-4 mr-1.5" />
                          DELETE
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-white border-0 shadow-sm h-9 px-5 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                          onClick={handleSubmit}
                          disabled={selectedRows.length === 0}
                        >
                          <Send className="size-3.5" />
                          SUBMIT TO APPROVAL
                        </Button>
                      </div>
                    </div>
                  )}
              </TabsContent>

              {/* Tab 2: Submitted List */}
              <TabsContent value="submitted" className="m-0 border-0 outline-none">
                <div className="bg-emerald-500/5 px-4 py-2 text-xs border-b border-emerald-500/10 flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="size-4" />
                  <span>List of employees whose bonuses have already been submitted.</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/30 text-muted-foreground font-semibold border-b border-border/60">
                      <tr>
                        <th className="px-4 py-3 whitespace-nowrap">Status</th>
                        <th className="px-4 py-3 whitespace-nowrap">Feedback</th>
                        <th className="px-4 py-3 whitespace-nowrap">Emp Id</th>
                        <th className="px-4 py-3 whitespace-nowrap">Emp ID(Off)</th>
                        <th className="px-4 py-3 whitespace-nowrap min-w-[150px]">Name</th>
                        <th className="px-4 py-3 whitespace-nowrap">Department</th>
                        <th className="px-4 py-3 whitespace-nowrap">Section</th>
                        <th className="px-4 py-3 whitespace-nowrap">Designation</th>
                        <th className="px-4 py-3 whitespace-nowrap">Join Date</th>
                        <th className="px-4 py-3 whitespace-nowrap">Tenure</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right">Basic</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right">Gross</th>
                        <th className="px-4 py-3 whitespace-nowrap text-center">Bonus(%) / Flat</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right font-bold text-emerald-600">
                          Bonus Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {processedEmployees.filter((r) => submittedRows.includes(r.id)).length === 0 ? (
                        <tr>
                          <td colSpan={14} className="px-4 py-12 text-center text-muted-foreground">
                            No submitted records found.
                          </td>
                        </tr>
                      ) : (
                        processedEmployees
                          .filter((r) => submittedRows.includes(r.id))
                          .map((row) => (
                            <tr key={`sub-${row.id}`} className="hover:bg-muted/20 transition-colors">
                              <td className="px-4 py-2 font-medium text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="size-3.5" />
                                Submitted
                              </td>
                              <td className="px-4 py-2 text-muted-foreground/60">—</td>
                              <td className="px-4 py-2">{row.empId}</td>
                              <td className="px-4 py-2">{row.empIdOff}</td>
                              <td className="px-4 py-2 font-medium">{row.name}</td>
                              <td className="px-4 py-2">{row.dept}</td>
                              <td className="px-4 py-2">{row.section}</td>
                              <td className="px-4 py-2">{row.desig}</td>
                              <td className="px-4 py-2">{row.joinDate}</td>
                              <td className="px-4 py-2 font-semibold text-slate-700">
                                {row.tenureMonths} mths
                              </td>
                              <td className="px-4 py-2 text-right">{row.basic.toLocaleString()}</td>
                              <td className="px-4 py-2 text-right">{row.gross.toLocaleString()}</td>
                              <td className="px-4 py-2 text-center font-bold">
                                {row.percentage === 100 && row.bonusAmount !== row.basic && row.bonusAmount !== row.gross 
                                  ? "Flat Payout" 
                                  : `${row.percentage}%`}
                              </td>
                              <td className="px-4 py-2 text-right font-bold">
                                {row.bonusAmount.toLocaleString()}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>

            {/* Pagination / Total count */}
            <div className="px-4 py-3 bg-muted/10 border-t border-border/60 text-xs text-muted-foreground flex justify-between items-center font-medium">
              <span>
                Showing {isDataLoaded ? processedEmployees.length : 0} to {isDataLoaded ? processedEmployees.length : 0}{" "}
                of {isDataLoaded ? processedEmployees.length : 0} entries
              </span>
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" className="h-7 px-2.5 text-[10px] font-semibold" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-2.5 text-[10px] font-semibold" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
