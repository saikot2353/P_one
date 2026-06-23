import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  ChevronRight, ClipboardList, Search, FileText, Printer, FileDown, 
  FileEdit, Banknote, Plus
} from "lucide-react";

export const Route = createFileRoute("/loan-application")({
  component: LoanApplicationPage,
});

function LoanApplicationPage() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  
  // Form State
  const [empIdInput, setEmpIdInput] = useState("");
  const [empDetails, setEmpDetails] = useState<any>(null);

  // Mock List Data
  const mockListData = Array.from({ length: 3 }).map((_, i) => ({
    id: i + 1,
    empId: `202304391${i}`,
    empName: ["Tahmid Afsar", "Sadiqul Islam", "Rajibul Hasan"][i],
    areaName: "PSL-Operation",
    joinDate: "01/08/2023",
    expLoanAmount: [70000, 86400, 50000][i],
    appLoanAmt: 0,
    status: "Pending"
  }));

  const handleFetchData = () => {
    setIsDataLoaded(true);
  };

  const handleSearchEmployee = () => {
    if (empIdInput.length > 3) {
      setEmpDetails({
        name: "Rajibul Hasan Rajon",
        section: "Software Development",
        designation: "Software Engineer",
        unit: "IT Division",
        grade: "Grade 3",
        line: "N/A",
        basicSalary: "৳ 45,000",
        grossSalary: "৳ 75,000",
        joiningDate: "01/05/2022"
      });
    } else {
      setEmpDetails(null);
    }
  };

  const handleSubmitApplication = () => {
    // mock submit
    setIsApplyModalOpen(false);
    setEmpDetails(null);
    setEmpIdInput("");
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
            <span className="text-foreground font-semibold">Loan Management</span>
          </div>

          {/* Header & Actions */}
          <div className="bg-card border border-border/60 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <div className="p-2 rounded-md border bg-primary/10 border-primary/20 text-primary transition-colors">
                    <ClipboardList className="size-5" />
                  </div>
                  Loan Management
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                  Unified workspace to manage loan application history and submit new requests.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {/* Apply Loan Modal Button */}
                <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm font-semibold h-10 px-6">
                      <Plus className="size-4 mr-2" />
                      APPLY FOR LOAN
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[850px] max-h-[95vh] overflow-y-auto bg-slate-50 border-slate-200 shadow-2xl p-6">
                    <DialogHeader className="mb-4">
                      <DialogTitle className="flex items-center gap-2 text-slate-700 text-xl font-bold border-b border-slate-200/60 pb-3">
                        <FileEdit className="size-5 text-blue-600" />
                        New Loan Application
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-8 mt-2">
                      {/* Search Section */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Search className="size-4 text-slate-400" />
                          Employee Lookup
                        </h3>
                        <div className="flex items-end gap-4 max-w-md">
                          <div className="space-y-1.5 flex-1">
                            <label className="text-xs font-semibold text-slate-500 block">Employee Id <span className="text-rose-500">*</span></label>
                            <input 
                              type="text" 
                              value={empIdInput}
                              onChange={(e) => setEmpIdInput(e.target.value)}
                              placeholder="Type ID to fetch..." 
                              className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <Button onClick={handleSearchEmployee} className="h-10 px-6 bg-slate-800 hover:bg-slate-900 text-white shadow-sm rounded-lg">
                            Fetch
                          </Button>
                        </div>
                      </div>

                      {/* Employee Details (Read-only) */}
                      <div className="space-y-4 pt-4 border-t border-slate-200/60">
                        <h3 className="text-sm font-semibold text-slate-700">Employee Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {[
                            { label: "Employee Name", value: empDetails?.name },
                            { label: "Section", value: empDetails?.section },
                            { label: "Designation", value: empDetails?.designation },
                            { label: "Unit", value: empDetails?.unit },
                            { label: "Grade", value: empDetails?.grade },
                            { label: "Line", value: empDetails?.line },
                            { label: "Basic Salary", value: empDetails?.basicSalary },
                            { label: "Gross Salary", value: empDetails?.grossSalary },
                            { label: "Joining Date", value: empDetails?.joiningDate },
                          ].map((item, idx) => (
                            <div key={idx} className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-400 block">{item.label}</label>
                              <div className="w-full h-10 flex items-center rounded-lg border border-slate-200 bg-slate-100/50 px-3 text-sm text-slate-700 shadow-sm opacity-80 cursor-not-allowed truncate">
                                {item.value || "-"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Loan Request Details */}
                      <div className="space-y-4 pt-4 border-t border-slate-200/60">
                        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Banknote className="size-4 text-emerald-600" />
                          Loan Request Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 block">Max Loan Amount</label>
                            <input 
                              type="number" 
                              placeholder="0" 
                              disabled={!empDetails}
                              className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-50"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 block">Expected Loan Amount</label>
                            <input 
                              type="number" 
                              placeholder="0" 
                              disabled={!empDetails}
                              className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-50"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 block">Pay Installment (Months)</label>
                            <input 
                              type="number" 
                              placeholder="0" 
                              disabled={!empDetails}
                              className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-50"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 block">Installment Amount</label>
                            <input 
                              type="number" 
                              placeholder="0" 
                              disabled={!empDetails}
                              className="w-full h-10 rounded-lg border border-slate-200 bg-slate-100/50 px-3 text-sm text-slate-700 shadow-sm opacity-80 cursor-not-allowed"
                              readOnly
                            />
                          </div>
                          
                          <div className="space-y-1.5 lg:col-span-4 mt-2">
                            <label className="text-xs font-semibold text-slate-500 block">Reason</label>
                            <textarea 
                              placeholder="Enter reason for loan request..." 
                              rows={3}
                              disabled={!empDetails}
                              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none disabled:opacity-50 disabled:bg-slate-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter className="pt-6 mt-4 border-t border-slate-200/60">
                      <Button variant="outline" className="h-10 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100 font-medium px-6" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
                      <Button 
                        disabled={!empDetails}
                        className="h-10 rounded-lg bg-[#8bc34a] hover:bg-[#7cb342] text-white font-semibold shadow-sm px-6"
                        onClick={handleSubmitApplication}
                      >
                        SUBMIT APPLICATION
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {/* Inline Filters */}
            <div className="mt-6 border-t border-border/60 pt-6">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="space-y-1.5 w-full md:w-64">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-500">Employee ID</label>
                    <div className="flex items-center gap-2 text-[10px]">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="filter_empid_type" defaultChecked className="accent-primary" /> System</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="filter_empid_type" className="accent-primary" /> Office</label>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter Employee ID" 
                    className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5 w-full md:w-48">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Status</label>
                  <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </div>
                
                <Button variant="default" className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 shadow-sm w-full md:w-auto" onClick={handleFetchData}>
                  <Search className="size-4 mr-2" />
                  SEARCH
                </Button>
              </div>
            </div>
          </div>

          {/* Main Interface (List view) */}
          <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            {/* Top Level Action Buttons */}
            <div className="p-4 border-b border-border/60 bg-muted/10 flex justify-between items-center">
              <div className="flex bg-white border border-slate-200 rounded-md p-0.5 shadow-sm">
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-medium text-slate-600 hover:bg-slate-50">
                  <FileDown className="size-4 mr-1.5 text-emerald-600" />
                  EXCEL
                </Button>
                <div className="w-px bg-slate-200 my-1"></div>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-medium text-slate-600 hover:bg-slate-50">
                  <Printer className="size-4 mr-1.5 text-blue-600" />
                  PRINT
                </Button>
                <div className="w-px bg-slate-200 my-1"></div>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-medium text-slate-600 hover:bg-slate-50">
                  <FileText className="size-4 mr-1.5 text-rose-600" />
                  PDF
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Search:</span>
                <input type="text" className="h-8 w-48 rounded-md border border-slate-200 bg-white px-3 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>
            
            <div className="flex-1 p-0 overflow-auto bg-background/50">
              {!isDataLoaded ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                  <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 border border-slate-200 shadow-sm text-slate-400">
                    <Search className="size-5" />
                  </div>
                  <p className="text-sm text-slate-500">Click <span className="font-semibold text-slate-700">SEARCH</span> to fetch application history</p>
                </div>
              ) : (
                <div className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="p-3 font-semibold whitespace-nowrap pl-4">Sl</th>
                          <th className="p-3 font-semibold whitespace-nowrap text-center">View</th>
                          <th className="p-3 font-semibold whitespace-nowrap">Emp Id</th>
                          <th className="p-3 font-semibold whitespace-nowrap">Employee Name</th>
                          <th className="p-3 font-semibold whitespace-nowrap">Area Name</th>
                          <th className="p-3 font-semibold whitespace-nowrap">Join Date</th>
                          <th className="p-3 font-semibold whitespace-nowrap text-right">Exp. Loan Amount</th>
                          <th className="p-3 font-semibold whitespace-nowrap text-right">App. Loan Amt</th>
                          <th className="p-3 font-semibold whitespace-nowrap text-center pr-4">Approved Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {mockListData.map((row, index) => (
                          <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 pl-4 text-slate-500">{index + 1}</td>
                            <td className="p-3 text-center">
                              <button className="p-1 bg-emerald-50 text-emerald-600 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors">
                                <Search className="size-3.5" />
                              </button>
                            </td>
                            <td className="p-3 font-medium text-slate-700">{row.empId}</td>
                            <td className="p-3 text-slate-700">{row.empName}</td>
                            <td className="p-3 text-slate-600">{row.areaName}</td>
                            <td className="p-3 text-slate-600">{row.joinDate}</td>
                            <td className="p-3 text-right font-medium text-slate-700">৳ {row.expLoanAmount.toLocaleString()}</td>
                            <td className="p-3 text-right text-slate-400">0.00</td>
                            <td className="p-3 text-center pr-4">
                              <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs font-medium text-slate-500">
                      Showing 1 to {mockListData.length} of {mockListData.length} entries
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 text-xs text-slate-500 bg-white hover:bg-slate-50" disabled>Previous</Button>
                      <Button variant="default" size="sm" className="h-8 w-8 p-0 text-xs bg-[#8bc34a] hover:bg-[#7cb342] text-white">1</Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs text-slate-500 bg-white hover:bg-slate-50" disabled>Next</Button>
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
