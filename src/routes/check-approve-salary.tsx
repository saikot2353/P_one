import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  ChevronRight, ClipboardCheck, Search,
  Play, FileText, Printer, FileDown, CheckCircle, XCircle
} from "lucide-react";

export const Route = createFileRoute("/check-approve-salary")({
  component: CheckApproveSalaryPage,
});

function CheckApproveSalaryPage() {
  const [mainTab, setMainTab] = useState("check");
  const [subTab, setSubTab] = useState("monthly");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Mock Counts
  const counts = {
    check: 142,
    approve: 45,
    monthly: 89,
    advance: 12,
    bonus: 41
  };

  // Filter Options
  const years = ["2026", "2025", "2024"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const employeeTypes = ["ALL", "Permanent", "Contractual", "Probation"];
  const processTypes = ["Final", "Advance", "Bonus"];
  const salaryTypes = ["ALL", "Cash", "Bank", "Mobile Banking"];
  const bonusTypes = ["ALL", "Eid-ul-Fitr", "Eid-ul-Adha", "Performance", "Festival"];
  const salaryBases = ["ALL", "Basic", "Gross"];

  // Mock Data
  const mockData = Array.from({ length: 5 }).map((_, i) => ({
    id: i + 1,
    empId: `EMP-${2000 + i}`,
    name: ["Rajibul Hasan", "Arifur Rahman", "Sumon Ali", "Kamrul Islam", "Rubel Hossain"][i],
    department: ["IT", "Operations", "HR", "Finance", "Marketing"][i],
    designation: ["Software Engineer", "Manager", "Executive", "Accountant", "Officer"][i],
    employeeType: "Permanent",
    totalPay: Math.floor(Math.random() * 50000) + 30000,
    bankPay: Math.floor(Math.random() * 40000) + 20000,
    cashPay: Math.floor(Math.random() * 10000),
    reviewComments: "",
    feedback: ""
  }));

  const handleFetchData = () => {
    setIsDataLoaded(true);
    setIsFilterModalOpen(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(mockData.map(d => d.id));
    } else {
      setSelectedRows([]);
    }
  };

  const toggleRowSelect = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto bg-muted/20">
        <Topbar />
        
        <div className="p-4 md:p-6 space-y-6 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3.5" />
            <span>Payroll</span>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-semibold">Check & Approve</span>
          </div>

          {/* Header & Actions */}
          <div className="bg-card border border-border/60 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <div className={`p-2 rounded-md border ${mainTab === 'check' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-emerald-600/10 border-emerald-600/20 text-emerald-600'} transition-colors`}>
                    {mainTab === 'check' ? <ClipboardCheck className="size-5" /> : <CheckCircle className="size-5" />}
                  </div>
                  Salary Process Validation
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                  Unified workspace to {mainTab === 'check' ? 'review and validate' : 'verify and approve'} monthly salaries, advances, and bonuses.
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="flex bg-muted/50 p-1 rounded-lg border border-border/60 shadow-inner">
                <button 
                  onClick={() => setMainTab('check')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all ${mainTab === 'check' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'}`}
                >
                  <ClipboardCheck className="size-4" />
                  CHECK MODE
                  <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] ${mainTab === 'check' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                    {counts.check}
                  </span>
                </button>
                <button 
                  onClick={() => setMainTab('approve')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all ${mainTab === 'approve' ? 'bg-emerald-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'}`}
                >
                  <CheckCircle className="size-4" />
                  APPROVE MODE
                  <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] ${mainTab === 'approve' ? 'bg-white/20 text-white' : 'bg-emerald-600/10 text-emerald-600'}`}>
                    {counts.approve}
                  </span>
                </button>
              </div>
            </div>
            
            {/* Top Level Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-between border-t border-border/60 pt-4">
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
                    <Button variant="default" className="bg-primary hover:bg-primary/90 text-white border-0 shadow-sm font-semibold h-9 px-4">
                      <Play className="size-4 mr-2 fill-current" />
                      FILTER / SEARCH
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto bg-slate-50 border-slate-200 shadow-2xl p-6">
                    <DialogHeader className="mb-4">
                      <DialogTitle className="flex items-center gap-2 text-slate-700 text-lg font-semibold">
                        <Search className="size-5 text-slate-400" />
                        
                        
                        {subTab === "monthly" ? "Monthly Salary Filter" : subTab === "advance" ? "Advance Salary Filter" : "Bonus Filter"}
                      
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Common Period Filters */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Year</label>
                        <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                          {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Month</label>
                        <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                          <option value="May">May</option>
                          {months.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      
                      {/* Sub-Tab Specific Filters */}
                      {subTab === "monthly" && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Process Type</label>
                            <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                              {processTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Salary Type</label>
                            <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                              {salaryTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        </>
                      )}

                      {subTab === "advance" && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Salary Based</label>
                            <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                              {salaryBases.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Salary(%)</label>
                            <input type="number" defaultValue={50} className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                          </div>
                        </>
                      )}

                      {subTab === "bonus" && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Bonus For</label>
                            <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                              {bonusTypes.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Effective Date</label>
                            <input type="date" defaultValue="2026-06-23" className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                          </div>
                        </>
                      )}

                      {/* Common Organization Filters */}
                      <div className="space-y-1.5 lg:col-span-2">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Company</label>
                        <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                          <option>Pakiza Software Limited</option>
                        </select>
                      </div>
                      <div className="space-y-1.5 lg:col-span-2">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Area Name</label>
                        <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                          <option>PSL-Operation</option>
                        </select>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Department</label>
                        <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                          <option>ALL</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Section</label>
                        <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                          <option>ALL</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Employee Type</label>
                        <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                          {employeeTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      
                      {/* Check/Approve Specific Filter */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Status</label>
                        <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                          <option>Pending</option>
                          {mainTab === "approve" && <option>Checked</option>}
                          <option>Approved</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 lg:col-span-4">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Employee ID</label>
                          <div className="flex items-center gap-2 text-[10px]">
                            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="empid_type_check" defaultChecked className="accent-primary" /> System</label>
                            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="empid_type_check" className="accent-primary" /> Office</label>
                          </div>
                        </div>
                        <input 
                          type="text" 
                          placeholder="Use comma as separator" 
                          className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter className="pt-6 mt-4 border-t border-slate-200/60">
                      <Button variant="outline" className="h-10 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100 font-medium px-6" onClick={() => setIsFilterModalOpen(false)}>Cancel</Button>
                      <Button variant="default" className="h-10 rounded-lg bg-[#279863] hover:bg-[#208050] text-white font-medium px-6 shadow-sm" onClick={handleFetchData}>
                        <Search className="size-4 mr-1.5" />
                        FETCH DATA
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Main Interface */}
          <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden flex flex-col">
            
            {/* Sub Category Tabs */}
            <div className="px-4 py-3 border-b border-border/60 bg-muted/10">
                <Tabs value={subTab} onValueChange={setSubTab} className="w-full">
                  <TabsList className="h-8 bg-transparent p-0 gap-4">
                    <TabsTrigger value="monthly" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-4 h-7 text-xs border border-transparent data-[state=active]:border-primary/20">
                      Monthly Salary
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] ${subTab === 'monthly' ? 'bg-primary/20' : 'bg-muted-foreground/10 text-muted-foreground'}`}>{counts.monthly}</span>
                    </TabsTrigger>
                    <TabsTrigger value="advance" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-4 h-7 text-xs border border-transparent data-[state=active]:border-primary/20">
                      Advance Salary
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] ${subTab === 'advance' ? 'bg-primary/20' : 'bg-muted-foreground/10 text-muted-foreground'}`}>{counts.advance}</span>
                    </TabsTrigger>
                    <TabsTrigger value="bonus" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-4 h-7 text-xs border border-transparent data-[state=active]:border-primary/20">
                      Yearly Bonus
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] ${subTab === 'bonus' ? 'bg-primary/20' : 'bg-muted-foreground/10 text-muted-foreground'}`}>{counts.bonus}</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex-1 p-0 overflow-auto bg-background/50">
                {!isDataLoaded ? (
                  <div className="h-64 flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                    <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3 border border-border/60 shadow-sm">
                      <Search className="size-5" />
                    </div>
                    <p className="text-sm">Click <span className="font-semibold text-foreground">FILTER / SEARCH</span> to fetch data</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    
                    {/* Action Bar */}
                    <div className="flex items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                        {mainTab === "check" ? (
                          <>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs font-semibold px-4 shadow-sm" disabled={selectedRows.length === 0}>
                              CHECK
                            </Button>
                            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white h-8 text-xs font-semibold px-4 shadow-sm" disabled={selectedRows.length === 0}>
                              REVIEW
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs font-semibold px-4 shadow-sm" disabled={selectedRows.length === 0}>
                              APPROVE
                            </Button>
                            <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white h-8 text-xs font-semibold px-4 shadow-sm" disabled={selectedRows.length === 0}>
                              REJECT
                            </Button>
                          </>
                        )}
                      </div>
                      <div className="text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border/60">
                        Showing {mockData.length} entries
                      </div>
                    </div>

                    <div className="border border-border/60 rounded-md overflow-hidden bg-card shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-muted-foreground bg-muted/30 border-b border-border/60">
                            <tr>
                              <th className="p-3 w-10">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-border/60 text-primary focus:ring-primary accent-primary" 
                                  onChange={handleSelectAll}
                                  checked={selectedRows.length === mockData.length && mockData.length > 0}
                                />
                              </th>
                              <th className="p-3 font-semibold whitespace-nowrap">Feedback</th>
                              <th className="p-3 font-semibold whitespace-nowrap">Review Comments</th>
                              <th className="p-3 font-semibold whitespace-nowrap">Emp Id</th>
                              <th className="p-3 font-semibold whitespace-nowrap">Name</th>
                              <th className="p-3 font-semibold whitespace-nowrap">Employee Type</th>
                              <th className="p-3 font-semibold whitespace-nowrap">Department</th>
                              <th className="p-3 font-semibold whitespace-nowrap">Designation</th>
                              <th className="p-3 font-semibold text-right whitespace-nowrap">Total Pay</th>
                              <th className="p-3 font-semibold text-right whitespace-nowrap">Bank Pay</th>
                              <th className="p-3 font-semibold text-right whitespace-nowrap">Cash Pay</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/40">
                            {mockData.map((row) => (
                              <tr key={row.id} className={`hover:bg-muted/10 transition-colors ${selectedRows.includes(row.id) ? 'bg-primary/5' : ''}`}>
                                <td className="p-3">
                                  <input 
                                    type="checkbox" 
                                    className="rounded border-border/60 text-primary focus:ring-primary accent-primary" 
                                    checked={selectedRows.includes(row.id)}
                                    onChange={() => toggleRowSelect(row.id)}
                                  />
                                </td>
                                <td className="p-3">
                                  <input type="text" className="w-full text-xs h-7 rounded border-border/60 bg-background px-2" placeholder="Feedback..." />
                                </td>
                                <td className="p-3">
                                  <input type="text" className="w-full text-xs h-7 rounded border-border/60 bg-background px-2" placeholder="Comments..." />
                                </td>
                                <td className="p-3 font-medium text-foreground">{row.empId}</td>
                                <td className="p-3 text-foreground">{row.name}</td>
                                <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-medium border border-blue-200">{row.employeeType}</span></td>
                                <td className="p-3">{row.department}</td>
                                <td className="p-3">{row.designation}</td>
                                <td className="p-3 text-right font-medium text-emerald-600">৳ {row.totalPay.toLocaleString()}</td>
                                <td className="p-3 text-right text-blue-600">৳ {row.bankPay.toLocaleString()}</td>
                                <td className="p-3 text-right text-rose-600">৳ {row.cashPay.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}
