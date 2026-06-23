import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import {
  ChevronRight, Search, FileText, Printer, FileDown, MinusCircle, Save
} from "lucide-react";

export const Route = createFileRoute("/payroll-deductions")({
  component: PayrollDeductionsPage,
});

function PayrollDeductionsPage() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  
  // Mock List Data
  const mockListData = Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    empId: [
      "2025057068", "2023046001", "2023043021", "2026059411", "2024049326",
      "2026058726", "2023045044", "2026058686", "2025058109", "2026058685",
      "2022035599", "2024052333", "2024052410", "2025057067", "2023044012"
    ][i] || `20250570${i}`,
    name: [
      "Riazul Islam", "Sohanur Rahman Sohan", "Easin Mia", "Jannatul Maowa", "Hanif Uddin",
      "Parvej Mahmud", "Sultan Ahmed", "Md. Abdur Rahaman", "Mohammad Methoun Ahmed", "Md Johirul Islam",
      "Dipon Saha", "Mohammad Rahatul Islam", "Dipan Kumar Kundu", "Sunit Corneleous Sarker", "Tanver Rahman Shaon"
    ][i] || "Employee Name",
    empType: "Office Executive",
    department: [
      "Accounts & Vat", "Admin", "Admin", "Admin", "APPS Team",
      "APPS Team", "Business Analysis", "Business Innovation", "Core Development", "Core Development",
      "Core Development (HR)", "Core Development (HR)", "Core Development (HR)", "Core Development (HR)", "Core Sales"
    ][i] || "Department",
    designation: [
      "Asst. Manager", "Executive", "Receptionist", "Jr. Executive", "Sr. Executive",
      "Executive", "Manager", "Executive", "Sr. Manager", "Executive",
      "Manager", "Sr. Executive", "Sr. Executive", "Executive", "Asst. Manager"
    ][i] || "Designation",
    joinDate: [
      "01/10/2025", "01/11/2023", "01/02/2023", "10/05/2026", "01/06/2024",
      "22/02/2026", "01/10/2023", "15/02/2026", "22/12/2025", "15/02/2026",
      "07/05/2022", "01/10/2024", "15/10/2024", "01/10/2025", "01/01/2025"
    ][i] || "01/01/2025",
    amount: "0"
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
            <span className="text-foreground font-semibold">Other Deduction</span>
          </div>

          {/* Header & Actions */}
          <div className="bg-card border border-border/60 rounded-lg p-6 shadow-sm">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5 mb-6">
              <div className="p-2 rounded-md border bg-rose-600/10 border-rose-600/20 text-rose-600">
                <MinusCircle className="size-5" />
              </div>
              Other Deduction
            </h1>
            
            {/* Inline Filters */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Year</label>
                  <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                    <option>2026</option>
                    <option>2025</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Month</label>
                  <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                    <option>Select Month</option>
                    <option>January</option>
                    <option>February</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Employee Type</label>
                  <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                    <option>ALL</option>
                    <option>Permanent</option>
                    <option>Contractual</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Department</label>
                  <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                    <option>All Departments</option>
                    <option>IT</option>
                    <option>HR</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Section</label>
                  <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                    <option>ALL</option>
                    <option>Software</option>
                    <option>Networking</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Deduction Type</label>
                  <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                    <option>---Select---</option>
                    <option>Penalty</option>
                    <option>Damage</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Amount (Tk)</label>
                  <input 
                    type="number"
                    className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5 lg:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">EmpId</label>
                  <input 
                    type="text"
                    placeholder="Input Comma As Separator"
                    className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="flex items-end justify-end">
                  <Button variant="default" className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 shadow-sm w-full md:w-auto" onClick={handleFetchData}>
                    <Search className="size-4 mr-2" />
                    SEARCH
                  </Button>
                </div>
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
                    <MinusCircle className="size-5" />
                  </div>
                  <p className="text-sm text-slate-500">Click <span className="font-semibold text-slate-700">SEARCH</span> to fetch employee list for deductions</p>
                </div>
              ) : (
                <div className="p-0 flex flex-col flex-1 h-full">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 bg-slate-100/80 border-b border-slate-200">
                        <tr>
                          <th className="p-3 font-semibold whitespace-nowrap pl-4 w-12 text-center">
                            <input 
                              type="checkbox" 
                              className="accent-blue-600 w-3.5 h-3.5 rounded border-slate-300"
                              onChange={handleSelectAll}
                              checked={selectedRows.length === mockListData.length && mockListData.length > 0}
                            />
                          </th>
                          <th className="p-3 font-semibold whitespace-nowrap">Emp ID</th>
                          <th className="p-3 font-semibold whitespace-nowrap">Name</th>
                          <th className="p-3 font-semibold whitespace-nowrap">Emp Type</th>
                          <th className="p-3 font-semibold whitespace-nowrap">Department</th>
                          <th className="p-3 font-semibold whitespace-nowrap">Designation</th>
                          <th className="p-3 font-semibold whitespace-nowrap">Join Date</th>
                          <th className="p-3 font-semibold whitespace-nowrap w-32">Amount(Tk)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {mockListData.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 pl-4 text-center">
                              <input 
                                type="checkbox" 
                                className="accent-blue-600 w-3.5 h-3.5 rounded border-slate-300"
                                checked={selectedRows.includes(row.id)}
                                onChange={() => handleSelectRow(row.id)}
                              />
                            </td>
                            <td className="p-3 font-medium text-slate-700">{row.empId}</td>
                            <td className="p-3 text-slate-700">{row.name}</td>
                            <td className="p-3 text-slate-600">{row.empType}</td>
                            <td className="p-3 text-slate-600">{row.department}</td>
                            <td className="p-3 text-slate-600">{row.designation}</td>
                            <td className="p-3 text-slate-600">{row.joinDate}</td>
                            <td className="p-2 pr-4">
                              <input 
                                type="number" 
                                defaultValue={row.amount}
                                className="w-full h-8 rounded border border-slate-200 bg-white px-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-right"
                              />
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
                      <Button variant="default" size="sm" className="h-8 w-8 p-0 text-xs bg-blue-600 hover:bg-blue-700 text-white">1</Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs text-slate-500 bg-white hover:bg-slate-50" disabled>Next</Button>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-200 bg-slate-50 mt-auto flex justify-end">
                    <Button className="bg-[#8bc34a] hover:bg-[#7cb342] text-white px-8 h-10 shadow-sm font-semibold rounded-md flex items-center gap-2">
                      <Save className="size-4" />
                      SAVE DEDUCTIONS
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
