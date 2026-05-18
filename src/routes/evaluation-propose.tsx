import { useState, useMemo } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Search, FileSpreadsheet, Printer, FileDown, ChevronRight, Check, Sparkles
} from "lucide-react";

export const Route = createFileRoute("/evaluation-propose")({
  head: () => ({
    meta: [
      { title: "Evaluation Propose — CRIPTON HRIS" },
      { name: "description", content: "Human resource evaluation proposal and tenure audit registry." },
    ],
  }),
  component: EvaluationProposePage,
});

interface ProposeRecord {
  sl: number;
  empId: string;
  name: string;
  designation: string;
  department: string;
  section: string;
  joiningDate: string;
  currentSalary: number;
  tenureY: number;
  tenureM: number;
  tenureD: number;
  basicSalary: number;
  houseRent: number;
  lastIncDate: string;
  lastIncAmount: number;
  lastPromDate: string;
  lastPromDesignation: string;
}

const mockRecords: ProposeRecord[] = [
  { sl: 1, empId: "2022035599", name: "Dipon Saha", designation: "Manager", department: "Business Automation (HR)", section: "Core Development (HR)", joiningDate: "07/05/2022", currentSalary: 67000.00, tenureY: 3, tenureM: 7, tenureD: 25, basicSalary: 40200.00, houseRent: 20100.00, lastIncDate: "01/01/2025", lastIncAmount: 6000, lastPromDate: "01/01/2026", lastPromDesignation: "Manager" },
  { sl: 2, empId: "2023044017", name: "Md. Rejaul Karim", designation: "Deputy Manager", department: "Business Automation (HR)", section: "Implementation & Support (HR)", joiningDate: "13/08/2023", currentSalary: 63000.00, tenureY: 2, tenureM: 4, tenureD: 19, basicSalary: 37800.00, houseRent: 18900.00, lastIncDate: "01/01/2025", lastIncAmount: 5000, lastPromDate: "01/01/2026", lastPromDesignation: "Deputy Manager" },
  { sl: 3, empId: "2021028542", name: "Zakir Hossain", designation: "Officer", department: "Business Automation (HR)", section: "Implementation & Support (HR)", joiningDate: "09/10/2021", currentSalary: 31500.00, tenureY: 4, tenureM: 2, tenureD: 23, basicSalary: 18900.00, houseRent: 9450.00, lastIncDate: "01/01/2025", lastIncAmount: 2500, lastPromDate: "01/01/2026", lastPromDesignation: "Officer" },
  { sl: 4, empId: "2024052333", name: "Mohammad Rahatul Islam", designation: "Sr. Officer", department: "Business Automation (HR)", section: "Core Development (HR)", joiningDate: "01/10/2024", currentSalary: 48000.00, tenureY: 1, tenureM: 3, tenureD: 0, basicSalary: 28800.00, houseRent: 14400.00, lastIncDate: "01/01/2025", lastIncAmount: 5000, lastPromDate: "01/01/2026", lastPromDesignation: "Sr. Officer" },
  { sl: 5, empId: "2024052410", name: "Dipan Kumar Kundu", designation: "Sr. Officer", department: "Business Automation (HR)", section: "Core Development (HR)", joiningDate: "15/10/2024", currentSalary: 41000.00, tenureY: 1, tenureM: 2, tenureD: 17, basicSalary: 24600.00, houseRent: 12300.00, lastIncDate: "01/02/2025", lastIncAmount: 3000, lastPromDate: "01/01/2026", lastPromDesignation: "Sr. Officer" },
  { sl: 6, empId: "2025053380", name: "Miraz Uddin", designation: "Jr. Executive", department: "Business Development", section: "Core Sales", joiningDate: "06/01/2025", currentSalary: 24000.00, tenureY: 0, tenureM: 11, tenureD: 26, basicSalary: 14400.00, houseRent: 7200.00, lastIncDate: "01/05/2025", lastIncAmount: 1000, lastPromDate: "01/01/2026", lastPromDesignation: "Jr. Executive" },
  { sl: 7, empId: "2021032646", name: "Sadiqul Islam", designation: "Deputy Manager", department: "Business Development", section: "Core Sales", joiningDate: "22/12/2021", currentSalary: 59000.00, tenureY: 4, tenureM: 0, tenureD: 10, basicSalary: 35400.00, houseRent: 17700.00, lastIncDate: "01/01/2025", lastIncAmount: 3000, lastPromDate: "01/01/2026", lastPromDesignation: "Deputy Manager" },
  { sl: 8, empId: "2023043909", name: "Md. Ashanur Kabir", designation: "Manager", department: "Business Development", section: "Digital Marketing", joiningDate: "01/08/2023", currentSalary: 73000.00, tenureY: 2, tenureM: 5, tenureD: 0, basicSalary: 43800.00, houseRent: 21900.00, lastIncDate: "01/07/2025", lastIncAmount: 7000, lastPromDate: "01/07/2025", lastPromDesignation: "Manager" },
  { sl: 9, empId: "2023044012", name: "Tanver Rahman Shaon", designation: "Assistant Manager", department: "Business Development", section: "Core Sales", joiningDate: "01/01/2025", currentSalary: 46000.00, tenureY: 1, tenureM: 0, tenureD: 0, basicSalary: 27600.00, houseRent: 13800.00, lastIncDate: "01/04/2025", lastIncAmount: 3000, lastPromDate: "01/01/2026", lastPromDesignation: "Assistant Manager" },
  { sl: 10, empId: "2023043910", name: "Tahmid Afsar", designation: "Assistant Manager", department: "Business Innovation", section: "Project Resource & Strategy", joiningDate: "01/08/2023", currentSalary: 52000.00, tenureY: 2, tenureM: 5, tenureD: 0, basicSalary: 31200.00, houseRent: 15600.00, lastIncDate: "01/07/2025", lastIncAmount: 12000, lastPromDate: "01/07/2025", lastPromDesignation: "Assistant Manager" },
  { sl: 11, empId: "2023044078", name: "Md. Anik Islam", designation: "Deputy Manager", department: "Business Innovation", section: "WEB-Team", joiningDate: "16/08/2023", currentSalary: 79000.00, tenureY: 2, tenureM: 4, tenureD: 16, basicSalary: 47400.00, houseRent: 23700.00, lastIncDate: "01/01/2025", lastIncAmount: 7000, lastPromDate: "01/01/2026", lastPromDesignation: "Deputy Manager" },
  { sl: 12, empId: "2025054710", name: "Raihan Jami Khan", designation: "Jr. Executive", department: "Business Innovation", section: "WEB-Team", joiningDate: "16/04/2025", currentSalary: 25000.00, tenureY: 0, tenureM: 8, tenureD: 16, basicSalary: 15000.00, houseRent: 7500.00, lastIncDate: "01/07/2025", lastIncAmount: 4000, lastPromDate: "01/01/2026", lastPromDesignation: "Jr. Executive" },
  { sl: 13, empId: "2024051510", name: "Md. Sadmanur Islam Shishir", designation: "Jr. Executive", department: "Business Innovation", section: "WEB-Team", joiningDate: "01/09/2024", currentSalary: 27000.00, tenureY: 1, tenureM: 4, tenureD: 0, basicSalary: 16200.00, houseRent: 8100.00, lastIncDate: "01/01/2025", lastIncAmount: 5000, lastPromDate: "01/01/2026", lastPromDesignation: "Jr. Executive" },
  { sl: 14, empId: "2025054707", name: "Allama Bakhtiyar Nafis", designation: "Jr. Executive", department: "Business Innovation", section: "WEB-Team", joiningDate: "16/04/2025", currentSalary: 25000.00, tenureY: 0, tenureM: 8, tenureD: 16, basicSalary: 15000.00, houseRent: 7500.00, lastIncDate: "01/07/2025", lastIncAmount: 4000, lastPromDate: "01/01/2026", lastPromDesignation: "Jr. Executive" },
  { sl: 15, empId: "2025054609", name: "Md Mahir Shahriyar", designation: "Jr. Executive", department: "Business Innovation", section: "Project Resource & Strategy", joiningDate: "15/03/2025", currentSalary: 33000.00, tenureY: 0, tenureM: 9, tenureD: 17, basicSalary: 19800.00, houseRent: 9900.00, lastIncDate: "01/06/2025", lastIncAmount: 3000, lastPromDate: "01/01/2026", lastPromDesignation: "Jr. Executive" },
  { sl: 16, empId: "2024049166", name: "MD Maimoon Hossain Shomoy", designation: "Sr. Officer", department: "Business Innovation", section: "WEB-Team", joiningDate: "18/05/2024", currentSalary: 43000.00, tenureY: 1, tenureM: 7, tenureD: 14, basicSalary: 25800.00, houseRent: 12900.00, lastIncDate: "01/01/2025", lastIncAmount: 5000, lastPromDate: "01/01/2026", lastPromDesignation: "Sr. Officer" },
  { sl: 17, empId: "2025053125", name: "Al Riyad Karim", designation: "Sr. Officer", department: "Business Innovation", section: "WEB-Team", joiningDate: "12/01/2025", currentSalary: 46000.00, tenureY: 0, tenureM: 11, tenureD: 20, basicSalary: 27600.00, houseRent: 13800.00, lastIncDate: "01/05/2025", lastIncAmount: 3000, lastPromDate: "01/01/2026", lastPromDesignation: "Sr. Officer" },
  { sl: 18, empId: "2024049326", name: "Hanif Uddin", designation: "Sr. Officer", department: "Business Innovation", section: "APPS Team", joiningDate: "01/06/2024", currentSalary: 50000.00, tenureY: 1, tenureM: 7, tenureD: 0, basicSalary: 30000.00, houseRent: 15000.00, lastIncDate: "01/01/2025", lastIncAmount: 5000, lastPromDate: "01/01/2026", lastPromDesignation: "Sr. Officer" },
  { sl: 19, empId: "2024052335", name: "Md. Al Amin", designation: "Sr. Officer", department: "Core Development", section: "RMG-Production-IE & Planning", joiningDate: "01/10/2024", currentSalary: 43000.00, tenureY: 1, tenureM: 3, tenureD: 0, basicSalary: 25800.00, houseRent: 12900.00, lastIncDate: "01/07/2025", lastIncAmount: 8000, lastPromDate: "01/07/2025", lastPromDesignation: "Sr. Officer" },
  { sl: 20, empId: "2024051507", name: "S.M Rakib Rahman Tuhin", designation: "Assistant Manager", department: "Core Development", section: "RMG-Production-IE & Planning", joiningDate: "01/09/2024", currentSalary: 57000.00, tenureY: 1, tenureM: 4, tenureD: 0, basicSalary: 34200.00, houseRent: 17100.00, lastIncDate: "01/07/2025", lastIncAmount: 12000, lastPromDate: "01/07/2025", lastPromDesignation: "Assistant Manager" }
];

function EvaluationProposePage() {
  const router = useRouter();
  
  // Filter States
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Jan");
  const [empType, setEmpType] = useState("ALL");
  const [department, setDepartment] = useState("All Departments");
  const [section, setSection] = useState("ALL");
  const [empIdInput, setEmpIdInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    year: "2026",
    month: "Jan",
    empType: "ALL",
    department: "All Departments",
    section: "ALL",
    empIdInput: ""
  });

  // Checkbox Selections
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      year,
      month,
      empType,
      department,
      section,
      empIdInput
    });
  };

  const filteredRecords = useMemo(() => {
    return mockRecords.filter(row => {
      // Dept filter
      if (appliedFilters.department !== "All Departments" && row.department !== appliedFilters.department) {
        return false;
      }
      // Section filter
      if (appliedFilters.section !== "ALL" && row.section !== appliedFilters.section) {
        return false;
      }
      // Employee ID filter
      if (appliedFilters.empIdInput.trim()) {
        const queryIds = appliedFilters.empIdInput.split(",").map(id => id.trim().toLowerCase());
        if (!queryIds.some(qid => row.empId.toLowerCase().includes(qid))) {
          return false;
        }
      }
      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchText = row.name.toLowerCase().includes(query) ||
                          row.empId.toLowerCase().includes(query) ||
                          row.designation.toLowerCase().includes(query);
        if (!matchText) return false;
      }
      return true;
    });
  }, [appliedFilters, searchQuery]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map(r => r.empId));
    }
  };

  const handleToggleSelectRow = (empId: string) => {
    if (selectedIds.includes(empId)) {
      setSelectedIds(prev => prev.filter(id => id !== empId));
    } else {
      setSelectedIds(prev => [...prev, empId]);
    }
  };

  // Submit Handler: Saves selected IDs to localStorage and moves to the configurator
  const handleSubmitAppraisal = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one employee row to initiate the increment configuration.");
      return;
    }
    // Save to localStorage so Increment Gadget can parse and display these specifically
    localStorage.setItem("gadget_preselected_empids", JSON.stringify(selectedIds));
    router.navigate({ to: "/increment-gadget" });
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          
          {/* Header Dashboard Card */}
          <div className="bg-card rounded-2xl border border-border/85 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>Human Resource</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">Evaluation Propose</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Sparkles className="size-5.5 text-primary" />
                <span>Evaluation Propose Workspace</span>
              </h1>
            </div>
          </div>

          {/* PARAMETRIC FILTERS ROW */}
          <form onSubmit={handleSearchSubmit} className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Year</label>
                <select 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold text-foreground"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Month</label>
                <select 
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold text-foreground"
                >
                  <option value="Jan">Jan</option>
                  <option value="Feb">Feb</option>
                  <option value="Dec">Dec</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Employee Type</label>
                <select 
                  value={empType}
                  onChange={(e) => setEmpType(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold text-foreground"
                >
                  <option value="ALL">ALL</option>
                  <option value="Office Executive">Office Executive</option>
                  <option value="Office Staff">Office Staff</option>
                  <option value="Worker">Worker</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Department</label>
                <select 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold text-foreground"
                >
                  <option value="All Departments">All Departments</option>
                  <option value="Business Automation (HR)">Business Automation (HR)</option>
                  <option value="Business Development">Business Development</option>
                  <option value="Business Innovation">Business Innovation</option>
                  <option value="Core Development">Core Development</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Section</label>
                <select 
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold text-foreground"
                >
                  <option value="ALL">ALL</option>
                  <option value="Core Development (HR)">Core Development (HR)</option>
                  <option value="Implementation & Support (HR)">Implementation & Support (HR)</option>
                  <option value="Core Sales">Core Sales</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Project Resource & Strategy">Project Resource & Strategy</option>
                  <option value="WEB-Team">WEB-Team</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border/20">
              <div className="space-y-1 w-full sm:w-80">
                <label className="text-[9.5px] font-black text-muted-foreground uppercase flex items-center gap-1">
                  <span>Employee Id (Comma Separator)</span>
                  <span className="text-primary-glow font-semibold lowercase italic">use comma as separator</span>
                </label>
                <input 
                  type="text"
                  value={empIdInput}
                  onChange={(e) => setEmpIdInput(e.target.value)}
                  placeholder="use comma as separator"
                  className="w-full h-9 px-3 rounded-xl bg-muted border border-border/40 text-xs font-semibold text-foreground"
                />
              </div>

              <button 
                type="submit"
                className="h-9.5 px-8 bg-primary hover:opacity-95 text-primary-foreground font-black text-xs rounded-xl shadow-xs transition uppercase tracking-wider flex items-center justify-center gap-1.5 self-end"
              >
                <Search className="size-4" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* DATAGRID GRID PANEL */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
            
            {/* Table Export Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-border/20">
              <div className="flex items-center gap-2">
                <button onClick={() => alert("Excel Export Complete.")} className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5">
                  <FileSpreadsheet className="size-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>
                <button onClick={() => window.print()} className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5">
                  <Printer className="size-3.5 text-primary" />
                  <span>Print</span>
                </button>
                <button onClick={() => alert("PDF Export Complete.")} className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5">
                  <FileDown className="size-3.5 text-rose-500" />
                  <span>PDF</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase whitespace-nowrap">Search:</span>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Query names or IDs..."
                  className="h-8.5 w-44 pl-3 pr-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold text-foreground outline-none"
                />
              </div>
            </div>

            {/* Standard Multi-Column Table Layout */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="text-[9.5px] uppercase font-bold tracking-wider text-muted-foreground/60 border-b border-border/30 bg-muted/20">
                    <th className="px-3 py-3 text-center">
                      <input 
                        type="checkbox"
                        checked={filteredRecords.length > 0 && selectedIds.length === filteredRecords.length}
                        onChange={handleToggleSelectAll}
                        className="rounded border-border/40 text-primary focus:ring-primary/20 size-3.5"
                      />
                    </th>
                    <th className="px-3 py-3 text-center">SL</th>
                    <th className="px-3 py-3">EmpID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Section</th>
                    <th className="px-3 py-3 text-center">Joining Date</th>
                    <th className="px-4 py-3 text-right">Current Salary</th>
                    <th className="px-2 py-3 text-center">Year</th>
                    <th className="px-2 py-3 text-center">Month</th>
                    <th className="px-2 py-3 text-center">Day</th>
                    <th className="px-4 py-3 text-right">Basic Salary</th>
                    <th className="px-4 py-3 text-right">House Rent</th>
                    <th className="px-3 py-3 text-center">BLL Sec 111</th>
                    <th className="px-3 py-3 text-center">Last Inc Date</th>
                    <th className="px-4 py-3 text-right">Last Inc Amount</th>
                    <th className="px-3 py-3 text-center">Last Prom Date</th>
                    <th className="px-4 py-3">Last Prom. Designation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredRecords.map((row) => {
                    const isChecked = selectedIds.includes(row.empId);
                    return (
                      <tr 
                        key={row.empId} 
                        className={`hover:bg-muted/40 transition duration-150 ${isChecked ? "bg-primary/5 border-l border-primary" : ""}`}
                      >
                        <td className="px-3 py-3 text-center">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelectRow(row.empId)}
                            className="rounded border-border/40 text-primary focus:ring-primary/20 size-3.5"
                          />
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground/75 font-semibold">{row.sl}</td>
                        <td className="px-3 py-3 font-mono font-semibold text-foreground">{row.empId}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{row.name}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{row.designation}</td>
                        <td className="px-4 py-3 text-muted-foreground/90 font-medium">{row.department}</td>
                        <td className="px-4 py-3 text-muted-foreground/80">{row.section}</td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground/80">{row.joiningDate}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">৳{row.currentSalary.toFixed(2)}</td>
                        <td className="px-2 py-3 text-center font-mono text-muted-foreground/90">{row.tenureY}</td>
                        <td className="px-2 py-3 text-center font-mono text-muted-foreground/90">{row.tenureM}</td>
                        <td className="px-2 py-3 text-center font-mono text-muted-foreground/90">{row.tenureD}</td>
                        <td className="px-4 py-3 text-right font-mono text-muted-foreground/95 font-medium">৳{row.basicSalary.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-mono text-muted-foreground/95 font-medium">৳{row.houseRent.toFixed(2)}</td>
                        <td className="px-3 py-3 text-center">
                          {row.tenureY >= 1 ? (
                            <span className="px-2 py-0.5 rounded text-[9.5px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/15 uppercase" title="Entitled to annual increment under Section 111 of BLL">
                              Entitled
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9.5px] font-extrabold bg-amber-500/10 text-amber-600 border border-amber-500/15 uppercase" title="Discretionary increment (under 1 year of service)">
                              Discretionary
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground/80">{row.lastIncDate || "—"}</td>
                        <td className="px-4 py-3 text-right font-mono text-muted-foreground/80">৳{row.lastIncAmount.toLocaleString()}</td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground/80">{row.lastPromDate || "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground/75 font-semibold">{row.lastPromDesignation || "—"}</td>
                      </tr>
                    );
                  })}

                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={18} className="text-center py-10 font-bold text-muted-foreground text-xs">
                        No appraisal proposals found matching the query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Submissions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-border/25">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Showing 1 to {filteredRecords.length} of {filteredRecords.length} entries (Selected: {selectedIds.length})
              </span>

              <div className="flex items-center gap-3">
                <button 
                  onClick={handleSubmitAppraisal}
                  className="h-10 px-8 bg-primary hover:opacity-95 text-primary-foreground font-black text-xs rounded-xl shadow-xs transition uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Check className="size-4" />
                  <span>Submit</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
