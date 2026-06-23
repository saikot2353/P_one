import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  ChevronRight, Calculator, CheckCircle2, Search,
  Play, FileText, Printer, FileDown, Send, Trash2
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

function YearlyBonusProcessPage() {
  const [activeTab, setActiveTab] = useState("processing");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [submittedRows, setSubmittedRows] = useState<number[]>([]);

  // Mock data for dropdowns
  const years = ["2026", "2025", "2024"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const bonusTypes = ["--Select--", "Eid-ul-Fitr", "Eid-ul-Adha", "Durga Puja", "Christmas"];
  const employeeTypes = ["ALL", "Regular", "Contractual"];

  // Mock employee data for bonus
  const mockData = [
    {
      id: 1, empId: "1001", empIdOff: "O-1001", name: "Tahmid Afsar Shapno",
      type: "Regular", dept: "IT", section: "Software", desig: "HR Director",
      joinDate: "2020-01-15", basic: 45000, gross: 75000, percentage: 100, bonusAmount: 45000
    },
    {
      id: 2, empId: "1002", empIdOff: "O-1002", name: "Rajebul Hasan Rajon",
      type: "Regular", dept: "Operations", section: "Production", desig: "Manager",
      joinDate: "2021-03-10", basic: 35000, gross: 60000, percentage: 100, bonusAmount: 35000
    },
    {
      id: 3, empId: "1003", empIdOff: "O-1003", name: "John Doe",
      type: "Contractual", dept: "Operations", section: "Logistics", desig: "Executive",
      joinDate: "2023-06-01", basic: 20000, gross: 35000, percentage: 50, bonusAmount: 10000
    }
  ];

  const handleFetchData = () => {
    setIsDataLoaded(true);
    setIsFilterModalOpen(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(mockData.filter(d => !submittedRows.includes(d.id)).map(d => d.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (selectedRows.length === 0) return;
    alert(`Successfully submitted bonus for ${selectedRows.length} employees!`);
    
    setSubmittedRows(prev => [...prev, ...selectedRows]);
    setSelectedRows([]);
    setActiveTab("submitted");
  };

  const handleDelete = () => {
    if (selectedRows.length === 0) return;
    const confirm = window.confirm(`Are you sure you want to delete processing data for ${selectedRows.length} employees?`);
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
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
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
                  Unified workspace to process yearly bonuses, review calculations, and submit for final approval.
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
                    <Button variant="default" className="bg-primary hover:bg-primary/90 text-white border-0 shadow-sm font-semibold h-9 px-4">
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
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Bonus For</label>
                        <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                          {bonusTypes.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Effective Date</label>
                        <input 
                          type="date" 
                          defaultValue="2026-06-23"
                          className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Year</label>
                        <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                          {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Month</label>
                        <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                          <option value="Jun">Jun</option>
                          {months.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>

                      {/* Organization */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Employee Type</label>
                        <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                          {employeeTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Department</label>
                        <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                          <option>All Departments</option>
                          <option>IT</option>
                          <option>Operations</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Section</label>
                        <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                          <option>ALL</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-500 mb-1.5 block">EmpId</label>
                          <div className="flex items-center gap-2 text-[10px]">
                            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="empid_type_bonus" defaultChecked className="accent-primary" /> System</label>
                            <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="empid_type_bonus" className="accent-primary" /> Office</label>
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

          {/* Data Tables */}
          <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-2 border-b border-border/60 flex items-center justify-between bg-muted/10">
                <TabsList className="bg-background/50 border border-border/40 p-1">
                  <TabsTrigger value="processing" className="text-xs px-4">Processing Details</TabsTrigger>
                  <TabsTrigger value="submitted" className="text-xs px-4">Submitted List</TabsTrigger>
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
                  <span>Review calculations, add feedback, and select employees before submitting the yearly bonus.</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/30 text-muted-foreground font-semibold border-b border-border/60">
                      <tr>
                        <th className="px-4 py-3 whitespace-nowrap w-10 sticky left-0 bg-muted/30 z-10">
                          <input 
                            type="checkbox" 
                            className="rounded border-input accent-primary size-4 cursor-pointer" 
                            checked={isDataLoaded && mockData.filter(r => !submittedRows.includes(r.id)).length > 0 && selectedRows.length === mockData.filter(r => !submittedRows.includes(r.id)).length}
                            onChange={handleSelectAll}
                            disabled={!isDataLoaded || mockData.filter(r => !submittedRows.includes(r.id)).length === 0}
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
                        <th className="px-4 py-3 whitespace-nowrap text-right">Basic</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right">Gross</th>
                        <th className="px-4 py-3 whitespace-nowrap text-center">Bonus(%)</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right font-bold text-primary">Bonus Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {!isDataLoaded || mockData.filter(r => !submittedRows.includes(r.id)).length === 0 ? (
                        <tr>
                          <td colSpan={13} className="px-4 py-12 text-center text-muted-foreground">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Search className="size-8 opacity-20" />
                              <p>{!isDataLoaded ? "No records found for processing. Click SEARCH or PROCESS." : "All bonuses have been submitted."}</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        mockData.filter(r => !submittedRows.includes(r.id)).map(row => (
                          <tr key={`proc-${row.id}`} className={`hover:bg-muted/30 transition-colors ${selectedRows.includes(row.id) ? 'bg-primary/5' : ''}`}>
                            <td className="px-4 py-2 sticky left-0 z-10 bg-background/95 backdrop-blur">
                              <input 
                                type="checkbox" 
                                className="rounded border-input accent-primary size-4 cursor-pointer" 
                                checked={selectedRows.includes(row.id)}
                                onChange={() => handleSelectRow(row.id)}
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input type="text" placeholder="Add feedback..." className="h-7 text-xs rounded border border-input bg-background px-2 min-w-[120px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                            </td>
                            <td className="px-4 py-2">{row.empId}</td>
                            <td className="px-4 py-2">{row.empIdOff}</td>
                            <td className="px-4 py-2 font-medium">{row.name}</td>
                            <td className="px-4 py-2">{row.dept}</td>
                            <td className="px-4 py-2">{row.section}</td>
                            <td className="px-4 py-2">{row.desig}</td>
                            <td className="px-4 py-2">{row.joinDate}</td>
                            <td className="px-4 py-2 text-right">{row.basic.toLocaleString()}</td>
                            <td className="px-4 py-2 text-right">{row.gross.toLocaleString()}</td>
                            <td className="px-4 py-2 text-center">{row.percentage}%</td>
                            <td className="px-4 py-2 text-right font-bold">{row.bonusAmount.toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
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
                        <th className="px-4 py-3 whitespace-nowrap text-right">Basic</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right">Gross</th>
                        <th className="px-4 py-3 whitespace-nowrap text-center">Bonus(%)</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right font-bold text-emerald-600">Bonus Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {mockData.filter(r => submittedRows.includes(r.id)).length === 0 ? (
                        <tr>
                          <td colSpan={13} className="px-4 py-12 text-center text-muted-foreground">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <FileText className="size-8 opacity-20" />
                              <p>No submitted records yet.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        mockData.filter(r => submittedRows.includes(r.id)).map(row => (
                          <tr key={`sub-${row.id}`} className="hover:bg-muted/30 transition-colors bg-muted/5">
                            <td className="px-4 py-2">
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="size-3" /> Submitted
                              </span>
                            </td>
                            <td className="px-4 py-2 text-muted-foreground">-</td>
                            <td className="px-4 py-2">{row.empId}</td>
                            <td className="px-4 py-2">{row.empIdOff}</td>
                            <td className="px-4 py-2 font-medium">{row.name}</td>
                            <td className="px-4 py-2">{row.dept}</td>
                            <td className="px-4 py-2">{row.section}</td>
                            <td className="px-4 py-2">{row.desig}</td>
                            <td className="px-4 py-2">{row.joinDate}</td>
                            <td className="px-4 py-2 text-right">{row.basic.toLocaleString()}</td>
                            <td className="px-4 py-2 text-right">{row.gross.toLocaleString()}</td>
                            <td className="px-4 py-2 text-center">{row.percentage}%</td>
                            <td className="px-4 py-2 text-right font-bold text-emerald-600">{row.bonusAmount.toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Pagination Footer */}
            <div className="p-3 border-t border-border/60 bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
              <div>Showing {isDataLoaded ? mockData.length : 0} to {isDataLoaded ? mockData.length : 0} of {isDataLoaded ? mockData.length : 0} entries</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" className="h-7 px-2.5 text-[10px]" disabled>Previous</Button>
                  <Button variant="outline" size="sm" className="h-7 px-2.5 text-[10px]" disabled>Next</Button>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button 
                    variant="outline" 
                    className="border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 h-8 disabled:opacity-50 disabled:cursor-not-allowed px-4 font-semibold shadow-sm" 
                    disabled={!isDataLoaded || selectedRows.length === 0}
                    onClick={handleDelete}
                  >
                    <Trash2 className="size-3.5 mr-1.5" />
                    DELETE
                  </Button>
                  <Button 
                    variant="default" 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 h-8 disabled:opacity-50 disabled:cursor-not-allowed px-4 font-semibold shadow-sm" 
                    disabled={!isDataLoaded || selectedRows.length === 0}
                    onClick={handleSubmit}
                  >
                    <Send className="size-3.5 mr-1.5" />
                    SUBMIT {selectedRows.length > 0 ? `(${selectedRows.length})` : ''}
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
