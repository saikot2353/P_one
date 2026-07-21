import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import { Search, FileText, Printer, FileDown } from "lucide-react";

export const Route = createFileRoute("/monthly-salary-process")({
  head: () => ({
    meta: [
      { title: "Monthly Salary Process — CRIPTON" },
      { name: "description", content: "Process and submit monthly salaries." },
    ],
  }),
  component: MonthlySalaryProcessPage,
});

function MonthlySalaryProcessPage() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Mock data for dropdowns
  const years = ["2026", "2025", "2024"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const processTypes = ["Final", "Advance", "Bonus"];
  const salaryTypes = ["ALL", "Regular", "Contractual"];

  // Mock comprehensive employee data based on screenshot
  const mockData = [
    {
      id: 1,
      empId: "2023043910",
      name: "Tahmid Afsar",
      wd: 27,
      present: 14,
      absent: 1,
      leave: 1,
      holiday: 4,
      basic: 31200,
      gross: 52000,
      ot: "0",
      otPay: "0",
      attBonus: "0",
      allowance: "0",
      lunchDeduct: "0",
      pf: "0",
      tax: "0",
      absentDeduct: "1040",
      advance: "0",
      adjust: "0.00",
      wagelyAdv: "0.00",
      loan: "0"
    },
    {
      id: 2,
      empId: "2023044078",
      name: "Md. Anik Islam",
      wd: 30,
      present: 5,
      absent: 1,
      leave: 0,
      holiday: 1,
      basic: 47400,
      gross: 79000,
      ot: "0.00",
      otPay: "0",
      attBonus: "0",
      allowance: "0",
      lunchDeduct: "0",
      pf: "0",
      tax: "0",
      absentDeduct: "1580",
      advance: "0",
      adjust: "0.00",
      wagelyAdv: "0.00",
      loan: "10"
    },
    {
      id: 3,
      empId: "2026058686",
      name: "Md. Abdur Rahaman",
      wd: 12,
      present: 8,
      absent: 0,
      leave: 1,
      holiday: 3,
      basic: 30000,
      gross: 50000,
      ot: "0.00",
      otPay: "0",
      attBonus: "0",
      allowance: "0",
      lunchDeduct: "1250",
      pf: "0",
      tax: "0",
      absentDeduct: "0",
      advance: "0",
      adjust: "0.00",
      wagelyAdv: "0.00",
      loan: "0"
    },
  ];

  const handleFetchData = () => {
    setIsDataLoaded(true);
  };

  return (
    <div className="min-h-screen flex bg-[#f8f9fa] text-slate-800">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 md:p-6 space-y-4 w-full">
          {/* Header Form Layout directly on page */}
          <div className="bg-white border border-slate-200/60 shadow-sm p-6 pt-4 space-y-6">
            
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="col-span-2">
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Year</label>
                <select className="w-full h-8 bg-transparent border-0 border-b border-slate-300 text-sm font-medium focus:ring-0 focus:border-blue-500 px-0 rounded-none">
                  <option>2026</option>
                  <option>2025</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Month</label>
                <select className="w-full h-8 bg-transparent border-0 border-b border-slate-300 text-sm font-medium focus:ring-0 focus:border-blue-500 px-0 rounded-none">
                  <option>Jul</option>
                  <option>Aug</option>
                </select>
              </div>
              <div className="col-span-3">
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Process Type</label>
                <select className="w-full h-8 bg-transparent border-0 border-b border-slate-300 text-sm font-medium focus:ring-0 focus:border-blue-500 px-0 rounded-none">
                  <option>Final</option>
                  <option>Advance</option>
                </select>
              </div>
              <div className="col-span-3">
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Salary Type</label>
                <select className="w-full h-8 bg-transparent border-0 border-b border-slate-300 text-sm font-medium focus:ring-0 focus:border-blue-500 px-0 rounded-none">
                  <option>ALL</option>
                  <option>Regular</option>
                </select>
              </div>
              <div className="col-span-2 flex justify-start">
                <Button className="bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold h-8 px-6 text-xs shadow-sm rounded">
                  PROCESS
                </Button>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="col-span-4">
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Company</label>
                <select className="w-full h-8 bg-transparent border-0 border-b border-slate-300 text-sm font-medium focus:ring-0 focus:border-blue-500 px-0 rounded-none">
                  <option>Pakiza Software Limited</option>
                </select>
              </div>
              <div className="col-span-4">
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Area Name</label>
                <select className="w-full h-8 bg-transparent border-0 border-b border-slate-300 text-sm font-medium focus:ring-0 focus:border-blue-500 px-0 rounded-none">
                  <option>PSL-Operation</option>
                </select>
              </div>
              <div className="col-span-4">
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Employee Type</label>
                <select className="w-full h-8 bg-transparent border-0 border-b border-slate-300 text-sm font-medium focus:ring-0 focus:border-blue-500 px-0 rounded-none">
                  <option>ALL</option>
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="col-span-3">
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Department</label>
                <select className="w-full h-8 bg-transparent border-0 border-b border-slate-300 text-sm font-medium focus:ring-0 focus:border-blue-500 px-0 rounded-none">
                  <option>ALL</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Unit</label>
                <select className="w-full h-8 bg-transparent border-0 border-b border-slate-300 text-sm font-medium focus:ring-0 focus:border-blue-500 px-0 rounded-none">
                  <option>ALL</option>
                </select>
              </div>
              <div className="col-span-3">
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Employee Id</label>
                <input
                  type="text"
                  placeholder="Use comma as separator"
                  className="w-full h-8 bg-transparent border-0 border-b border-slate-300 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:ring-0 focus:border-blue-500 px-0 rounded-none"
                />
              </div>
              <div className="col-span-4 flex justify-start">
                <Button 
                  className="bg-[#8bc34a] hover:bg-[#7cb342] text-white font-bold h-8 px-6 text-xs shadow-sm rounded uppercase"
                  onClick={handleFetchData}
                >
                  Get Processed Data
                </Button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200/60 shadow-sm flex flex-col min-h-[500px]">
            
            {/* Top Action Bar */}
            <div className="p-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
              <div className="flex rounded-md border border-slate-200 overflow-hidden shadow-sm">
                <Button variant="ghost" size="sm" className="h-8 px-4 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border-r border-slate-200 rounded-none">
                  <FileDown className="size-3.5 mr-1.5" />
                  EXCEL
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-4 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 border-r border-slate-200 rounded-none">
                  <Printer className="size-3.5 mr-1.5" />
                  PRINT
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-4 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 rounded-none">
                  <FileText className="size-3.5 mr-1.5" />
                  PDF
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-slate-600">Search:</span>
                <input
                  type="text"
                  className="h-8 w-48 rounded border border-slate-300 bg-white px-3 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Data Table */}
            <div className="flex-1 overflow-x-auto relative">
              <table className="w-full text-left text-xs whitespace-nowrap min-w-[1500px]">
                <thead className="text-[11px] bg-[#e9ecef] text-slate-600 font-semibold border-b border-slate-300 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">SL <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 text-center w-12"></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">Emp Id <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1 min-w-[180px]">Name <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">WD <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">Present <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">Absent <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">Leave <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">Holiday <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">Basic <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">Gross <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">OT <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">OT Pay <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">Att. Bonus <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">Allowance <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">Lunch Deduct <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">PF <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">Tax <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">Absent Deduction <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">Advance <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">Adjust <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">Wagely Adv <span className="text-[9px] opacity-40">▼</span></th>
                    <th className="px-3 py-3 border-r border-slate-200 flex items-center gap-1">Loan <span className="text-[9px] opacity-40">▼</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {!isDataLoaded ? (
                    <tr>
                      <td colSpan={23} className="px-6 py-12 text-center text-slate-400">
                        Click "GET PROCESSED DATA" to load the monthly salary report.
                      </td>
                    </tr>
                  ) : (
                    mockData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors odd:bg-white even:bg-[#f8f9fa]">
                        <td className="px-3 py-2.5 font-medium">{row.id}</td>
                        <td className="px-3 py-2.5 text-center">
                          <button className="bg-[#8bc34a] hover:bg-[#7cb342] text-white p-1 rounded transition-colors shadow-sm">
                            <Search className="size-3.5" strokeWidth={3} />
                          </button>
                        </td>
                        <td className="px-3 py-2.5">{row.empId}</td>
                        <td className="px-3 py-2.5 font-medium min-w-[180px]">{row.name}</td>
                        <td className="px-3 py-2.5">{row.wd}</td>
                        <td className="px-3 py-2.5">{row.present}</td>
                        <td className="px-3 py-2.5">{row.absent}</td>
                        <td className="px-3 py-2.5">{row.leave}</td>
                        <td className="px-3 py-2.5">{row.holiday}</td>
                        <td className="px-3 py-2.5">{row.basic}</td>
                        <td className="px-3 py-2.5">{row.gross}</td>
                        <td className="px-3 py-2.5">{row.ot}</td>
                        <td className="px-3 py-2.5">{row.otPay}</td>
                        <td className="px-3 py-2.5">{row.attBonus}</td>
                        <td className="px-3 py-2.5">{row.allowance}</td>
                        <td className="px-3 py-2.5">{row.lunchDeduct}</td>
                        <td className="px-3 py-2.5">{row.pf}</td>
                        <td className="px-3 py-2.5">{row.tax}</td>
                        <td className="px-3 py-2.5">{row.absentDeduct}</td>
                        <td className="px-3 py-2.5">{row.advance}</td>
                        <td className="px-3 py-2.5">{row.adjust}</td>
                        <td className="px-3 py-2.5">{row.wagelyAdv}</td>
                        <td className="px-3 py-2.5">{row.loan}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {isDataLoaded && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white text-xs text-slate-500">
                <div>
                  Showing 1 to {mockData.length} of {mockData.length} entries
                </div>
                <div className="flex gap-1 items-center">
                  <span className="cursor-not-allowed text-slate-400 mr-2">Previous</span>
                  <button className="h-6 w-6 rounded bg-[#8bc34a] text-white flex items-center justify-center font-bold">1</button>
                  <span className="cursor-not-allowed text-slate-400 ml-2">Next</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
