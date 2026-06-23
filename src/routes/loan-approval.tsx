import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import {
  ChevronRight, CheckCircle2, Search, FileText, Printer, FileDown, UserCheck, ShieldCheck
} from "lucide-react";

export const Route = createFileRoute("/loan-approval")({
  component: LoanApprovalPage,
});

function LoanApprovalPage() {
  const [mainTab, setMainTab] = useState("hod");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  
  // Mock List Data
  const mockListData = Array.from({ length: 2 }).map((_, i) => ({
    id: i + 1,
    empId: ["2019013884", "2023045146"][i],
    empIdOff: ["2019013884", ""][i],
    empName: ["Javed Mia", "Asif Hossain"][i],
    areaName: "PSL-Operation",
    joinDate: ["12/01/2019", "04/10/2023"][i],
    expLoanAmount: 30000,
    status: "Approved"
  }));

  const handleFetchData = () => {
    setIsDataLoaded(true);
    setSelectedRows([]);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(mockListData.map(d => d.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(r => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
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
            <span className="text-foreground font-semibold">Loan Approval</span>
          </div>

          {/* Header & Actions */}
          <div className="bg-card border border-border/60 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <div className={`p-2 rounded-md border ${mainTab === 'hod' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' : 'bg-blue-600/10 border-blue-600/20 text-blue-600'} transition-colors`}>
                    {mainTab === 'hod' ? <UserCheck className="size-5" /> : <ShieldCheck className="size-5" />}
                  </div>
                  Loan Approval Validation
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                  Unified workspace to verify and approve loan applications at the {mainTab === 'hod' ? 'Department Head' : 'Human Resources'} level.
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="flex bg-muted/50 p-1 rounded-lg border border-border/60 shadow-inner">
                <button 
                  onClick={() => setMainTab('hod')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all ${mainTab === 'hod' ? 'bg-amber-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'}`}
                >
                  <UserCheck className="size-4" />
                  HOD APPROVAL
                </button>
                <button 
                  onClick={() => setMainTab('hr')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all ${mainTab === 'hr' ? 'bg-blue-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'}`}
                >
                  <ShieldCheck className="size-4" />
                  HR APPROVAL
                </button>
              </div>
            </div>
            
            {/* Inline Filters */}
            <div className="mt-6 border-t border-border/60 pt-6">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="space-y-1.5 w-full md:w-64">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-500">Employee ID</label>
                    <div className="flex items-center gap-2 text-[10px]">
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="empid_type" defaultChecked className="accent-primary" /> System</label>
                      <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="empid_type" className="accent-primary" /> Office</label>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter Employee ID" 
                    className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5 w-full md:w-64">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Area Name</label>
                  <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                    <option>PSL-Operation</option>
                    <option>PSL-IT</option>
                    <option>PSL-HR</option>
                  </select>
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
            
            <div className="flex-1 p-0 overflow-auto bg-background/50 flex flex-col">
              {!isDataLoaded ? (
                <div className="h-full flex-1 min-h-[400px] flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                  <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 border border-slate-200 shadow-sm text-slate-400">
                    <Search className="size-5" />
                  </div>
                  <p className="text-sm text-slate-500">Click <span className="font-semibold text-slate-700">SEARCH</span> to fetch approval requests</p>
                </div>
              ) : (
                <div className="p-0 flex flex-col flex-1 h-full">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 bg-blue-100/50 border-b border-slate-200">
                        <tr>
                          <th className="p-3 font-semibold whitespace-nowrap pl-4">Sl</th>
                          <th className="p-3 font-semibold whitespace-nowrap text-center">
                            Action<br/>
                            <input 
                              type="checkbox" 
                              className="mt-1 accent-blue-600 w-4 h-4 rounded border-slate-300"
                              onChange={handleSelectAll}
                              checked={selectedRows.length === mockListData.length && mockListData.length > 0}
                            />
                          </th>
                          <th className="p-3 font-semibold whitespace-nowrap text-center">View</th>
                          <th className="p-3 font-semibold whitespace-nowrap">Emp Id</th>
                          <th className="p-3 font-semibold whitespace-nowrap">Emp ID(Off)</th>
                          <th className="p-3 font-semibold whitespace-nowrap">Employee Name</th>
                          <th className="p-3 font-semibold whitespace-nowrap">Area Name</th>
                          <th className="p-3 font-semibold whitespace-nowrap">Join Date</th>
                          <th className="p-3 font-semibold whitespace-nowrap text-right">Exp. Loan Amount</th>
                          <th className="p-3 font-semibold whitespace-nowrap text-center pr-4">Approved Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {mockListData.map((row, index) => (
                          <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 pl-4 text-slate-500">{index + 1}</td>
                            <td className="p-3 text-center">
                              <input 
                                type="checkbox" 
                                className="accent-blue-600 w-4 h-4 rounded border-slate-300"
                                checked={selectedRows.includes(row.id)}
                                onChange={() => handleSelectRow(row.id)}
                              />
                            </td>
                            <td className="p-3 text-center">
                              <button className="p-1 bg-emerald-50 text-emerald-600 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors">
                                <Search className="size-3.5" />
                              </button>
                            </td>
                            <td className="p-3 font-medium text-slate-700">{row.empId}</td>
                            <td className="p-3 text-slate-500">{row.empIdOff}</td>
                            <td className="p-3 text-slate-700">{row.empName}</td>
                            <td className="p-3 text-slate-600">{row.areaName}</td>
                            <td className="p-3 text-slate-600">{row.joinDate}</td>
                            <td className="p-3 text-right font-medium text-slate-700">{row.expLoanAmount.toLocaleString()}</td>
                            <td className="p-3 text-center pr-4">
                              {row.status}
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

                  <div className="p-4 border-t border-slate-200 bg-slate-50 mt-auto flex gap-3">
                    <Button className="bg-[#8bc34a] hover:bg-[#7cb342] text-white px-8 h-10 shadow-sm font-semibold rounded-md">
                      APPROVED
                    </Button>
                    <Button className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-8 h-10 shadow-sm font-semibold rounded-md">
                      REJECT
                    </Button>
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
