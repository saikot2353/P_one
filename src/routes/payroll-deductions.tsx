import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
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
  Search, 
  FileText, 
  Printer, 
  FileDown, 
  MinusCircle, 
  Save, 
  Plus, 
  Edit, 
  Trash2,
  CheckCircle2
} from "lucide-react";

export const Route = createFileRoute("/payroll-deductions")({
  component: PayrollDeductionsPage,
});

function PayrollDeductionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Mock Templates List Data
  const mockTemplates = [
    { id: 1, name: "Late Penalty (Over 3 Days)", type: "Penalty", amount: "500", targetGroup: "All Staff", status: "Active" },
    { id: 2, name: "ID Card Loss Deduction", type: "Damage", amount: "200", targetGroup: "All Permanent", status: "Active" },
    { id: 3, name: "Transport Deduction", type: "Other", amount: "1000", targetGroup: "IT Dept", status: "Inactive" },
  ];

  // Mock Employee Preview Data
  const mockPreviewData = Array.from({ length: 5 }).map((_, i) => ({
    id: i + 1,
    empId: ["2025057068", "2023046001", "2023043021", "2026059411", "2024049326"][i],
    name: ["Riazul Islam", "Sohanur Rahman Sohan", "Easin Mia", "Jannatul Maowa", "Hanif Uddin"][i],
    empType: "Office Executive",
    department: ["Accounts & Vat", "Admin", "Admin", "Admin", "APPS Team"][i],
    designation: ["Asst. Manager", "Executive", "Receptionist", "Jr. Executive", "Sr. Executive"][i],
    amount: "500",
  }));

  const handleFetchPreview = () => {
    setIsPreviewLoaded(true);
    setSelectedRows([]);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(mockPreviewData.map((d) => d.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((r) => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSaveTemplate = () => {
    // mock save action
    setIsModalOpen(false);
    setIsPreviewLoaded(false);
  }

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
            <span className="text-foreground font-semibold">Other Deductions</span>
          </div>

          {/* Header & Actions */}
          <div className="bg-card border border-border/60 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  <div className="p-2 rounded-md border bg-rose-600/10 border-rose-600/20 text-rose-600">
                    <MinusCircle className="size-5" />
                  </div>
                  Deduction Templates
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                  Manage reusable deduction rules that automatically apply during the monthly salary process.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm font-semibold h-10 px-6"
                    >
                      <Plus className="size-4 mr-2" />
                      CREATE NEW TEMPLATE
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-5xl p-0 bg-white border-0 shadow-2xl overflow-hidden rounded-xl">
                    <DialogHeader className="px-6 py-5 border-b border-slate-100 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <MinusCircle className="size-5" />
                        </div>
                        <div>
                          <DialogTitle className="text-lg font-bold text-slate-800">Other Deduction Setup</DialogTitle>
                        </div>
                      </div>
                    </DialogHeader>

                    <div className="px-6 py-5 max-h-[75vh] overflow-y-auto bg-slate-50/50 space-y-6">
                      
                      {/* Configuration Form */}
                      <div className="space-y-4">
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                          <div className="space-y-4">
                            <div className="space-y-1.5 max-w-md">
                              <label className="text-xs font-semibold text-slate-500 block">Template Name <span className="text-rose-500">*</span></label>
                              <input
                                type="text"
                                placeholder="e.g. Late Fine Policy"
                                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              />
                            </div>

                            <div className="h-px bg-slate-100 my-4" />

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">EmpId</label>
                                <input
                                  type="text"
                                  placeholder="Input Comma As Separator"
                                  className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Deduction Type <span className="text-rose-500">*</span></label>
                                <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                                  <option>---Select---</option>
                                  <option>Penalty</option>
                                  <option>Damage</option>
                                </select>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Amount (Tk) <span className="text-rose-500">*</span></label>
                                <input
                                  type="number"
                                  className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-end justify-end mt-4">
                              <Button
                                variant="default"
                                className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 shadow-sm flex items-center gap-2"
                                onClick={handleFetchPreview}
                              >
                                <Search className="size-4" />
                                PREVIEW EMPLOYEES
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Preview Table */}
                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-slate-500" />
                          <h3 className="text-sm font-semibold text-slate-700">Affected Employees Preview</h3>
                        </div>
                        {!isPreviewLoaded ? (
                           <div className="p-8 text-center text-slate-400 text-sm">
                             Click preview to check which employees match the selected criteria.
                           </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                              <thead className="text-[11px] font-semibold text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                <tr>
                                  <th className="px-4 py-3 text-center w-12">
                                    <input
                                      type="checkbox"
                                      className="accent-blue-600 w-3.5 h-3.5 rounded border-slate-300"
                                      onChange={handleSelectAll}
                                      checked={selectedRows.length === mockPreviewData.length && mockPreviewData.length > 0}
                                    />
                                  </th>
                                  <th className="px-4 py-3">Emp ID</th>
                                  <th className="px-4 py-3">Name</th>
                                  <th className="px-4 py-3">Department</th>
                                  <th className="px-4 py-3">Designation</th>
                                  <th className="px-4 py-3 w-32">Amount(Tk)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {mockPreviewData.map((row) => (
                                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-2 text-center">
                                      <input
                                        type="checkbox"
                                        className="accent-blue-600 w-3.5 h-3.5 rounded border-slate-300"
                                        checked={selectedRows.includes(row.id)}
                                        onChange={() => handleSelectRow(row.id)}
                                      />
                                    </td>
                                    <td className="px-4 py-2 font-medium text-slate-700">{row.empId}</td>
                                    <td className="px-4 py-2 text-slate-700">{row.name}</td>
                                    <td className="px-4 py-2 text-slate-600">{row.department}</td>
                                    <td className="px-4 py-2 text-slate-600">{row.designation}</td>
                                    <td className="px-4 py-2">
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
                        )}
                      </div>
                    </div>

                    <DialogFooter className="px-6 py-5 border-t border-slate-100 bg-white flex justify-end gap-3">
                      <Button
                        variant="ghost"
                        className="text-slate-600 font-medium px-4 hover:bg-slate-100"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm px-6 flex items-center gap-2"
                        onClick={handleSaveTemplate}
                      >
                        <Save className="size-4" />
                        SAVE TEMPLATE
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Main Interface (List view for Templates) */}
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
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="h-8 w-64 rounded-md border border-slate-200 bg-white px-3 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex-1 p-0 overflow-auto bg-background/50 flex flex-col">
              <div className="p-0 flex flex-col flex-1 h-full">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground/60 bg-slate-100/80 border-b border-slate-200">
                      <tr>
                        <th className="p-4 font-semibold whitespace-nowrap pl-6">Sl</th>
                        <th className="p-4 font-semibold whitespace-nowrap">Template Name</th>
                        <th className="p-4 font-semibold whitespace-nowrap">Deduction Type</th>
                        <th className="p-4 font-semibold whitespace-nowrap">Default Amount</th>
                        <th className="p-4 font-semibold whitespace-nowrap">Target Group</th>
                        <th className="p-4 font-semibold whitespace-nowrap text-center">Status</th>
                        <th className="p-4 font-semibold whitespace-nowrap text-center pr-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockTemplates.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="p-4 pl-6 text-slate-500 font-medium">{idx + 1}</td>
                          <td className="p-4 font-semibold text-slate-800">{row.name}</td>
                          <td className="p-4 text-slate-600">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                              {row.type}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-slate-700">৳ {row.amount}</td>
                          <td className="p-4 text-slate-600">{row.targetGroup}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${row.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="p-4 text-center pr-6">
                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit Template">
                                <Edit className="size-3.5" />
                              </button>
                              <button className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors" title="Delete Template">
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div className="text-xs font-medium text-slate-500">
                    Showing 1 to {mockTemplates.length} of {mockTemplates.length} entries
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-8 text-xs text-slate-500 bg-white hover:bg-slate-50" disabled>Previous</Button>
                    <Button variant="default" size="sm" className="h-8 w-8 p-0 text-xs bg-blue-600 hover:bg-blue-700 text-white">1</Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs text-slate-500 bg-white hover:bg-slate-50" disabled>Next</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
