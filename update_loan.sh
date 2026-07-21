cat << 'INNER_EOF' > /Volumes/Office Files/1. Projects/criptonhris/src/routes/loan-application.tsx
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
  ClipboardList,
  Search,
  FileText,
  Printer,
  FileDown,
  FileEdit,
  Banknote,
  Plus,
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
    empId: \`202304391\${i}\`,
    empName: ["Tahmid Afsar", "Sadiqul Islam", "Rajibul Hasan"][i],
    areaName: "PSL-Operation",
    joinDate: "01/08/2023",
    expLoanAmount: [70000, 86400, 50000][i],
    appLoanAmt: 0,
    status: "Pending",
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
        joiningDate: "01/05/2022",
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
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
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
                    <Button
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm font-semibold h-10 px-6"
                    >
                      <Plus className="size-4 mr-2" />
                      APPLY FOR LOAN
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[850px] p-0 bg-white border-0 shadow-2xl overflow-hidden rounded-xl">
                    <DialogHeader className="px-6 py-5 border-b border-slate-100 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <FileEdit className="size-5" />
                        </div>
                        <DialogTitle className="text-lg font-bold text-slate-800">New Loan Application</DialogTitle>
                      </div>
                    </DialogHeader>

                    <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-8 bg-slate-50/50">
                      {/* Search Section */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Search className="size-4 text-slate-400" />
                          Employee Lookup
                        </h3>
                        <div className="flex items-end gap-4 max-w-md">
                          <div className="space-y-1.5 flex-1">
                            <label className="text-xs font-semibold text-slate-500 block">
                              Employee Id <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={empIdInput}
                              onChange={(e) => setEmpIdInput(e.target.value)}
                              placeholder="Type ID to fetch..."
                              className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <Button
                            onClick={handleSearchEmployee}
                            className="h-10 px-6 bg-slate-800 hover:bg-slate-900 text-white shadow-sm rounded-lg"
                          >
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
                              <label className="text-xs font-semibold text-slate-400 block">
                                {item.label}
                              </label>
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
                            <label className="text-xs font-semibold text-slate-500 block">
                              Max Loan Amount
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              disabled={!empDetails}
                              className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-50"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 block">
                              Expected Loan Amount
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              disabled={!empDetails}
                              className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-50"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 block">
                              Pay Installment (Months)
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              disabled={!empDetails}
                              className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-50"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 block">
                              Installment Amount
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              disabled={!empDetails}
                              className="w-full h-10 rounded-lg border border-slate-200 bg-slate-100/50 px-3 text-sm text-slate-700 shadow-sm opacity-80 cursor-not-allowed"
                              readOnly
                            />
                          </div>

                          <div className="space-y-1.5 lg:col-span-4 mt-2">
                            <label className="text-xs font-semibold text-slate-500 block">
                              Reason
                            </label>
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

                    <DialogFooter className="px-6 py-5 border-t border-slate-100 bg-white flex justify-end gap-3">
                      <Button
                        variant="ghost"
                        className="text-slate-600 font-medium px-4 hover:bg-slate-100"
                        onClick={() => setIsApplyModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={!empDetails}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm px-6"
                        onClick={handleSubmitApplication}
                      >
                        Create
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
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="filter_empid_type"
                          defaultChecked
                          className="accent-primary"
                        />{" "}
                        System
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="filter_empid_type" className="accent-primary" />{" "}
                        Office
                      </label>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Employee ID"
                    className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5 w-full md:w-48">
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Status
                  </label>
                  <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </div>

                <Button
                  variant="default"
                  className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 shadow-sm w-full md:w-auto"
                  onClick={handleFetchData}
                >
                  <Search className="size-4 mr-2" />
                  SEARCH
                </Button>
              </div>
            </div>
          </div>

          {/* Main Interface (List view) - updated to look like personnel-list */}
          <div className="bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden transition-all duration-300">
            {/* Toolbar Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 border-b border-border/40">
              {/* Export Buttons */}
              <div className="flex items-center gap-2">
                <button className="h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200 flex items-center gap-1.5">
                  <FileDown className="size-3.5 text-emerald-500" />
                  <span>Excel</span>
                </button>
                <button className="h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200 flex items-center gap-1.5">
                  <Printer className="size-3.5 text-primary" />
                  <span>Print</span>
                </button>
                <button className="h-8.5 px-3 rounded-lg border border-border/60 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition duration-200 flex items-center gap-1.5">
                  <FileText className="size-3.5 text-rose-500" />
                  <span>PDF</span>
                </button>
              </div>

              {/* Toolbar Right: Search Bar */}
              <div className="flex items-center gap-3 ml-auto w-full md:w-auto">
                <div className="relative flex-1 md:w-64 lg:w-72">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    type="text"
                    placeholder="Search application..."
                    className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto min-h-[400px]">
              {!isDataLoaded ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                  <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 border border-slate-200 shadow-sm text-slate-400">
                    <Search className="size-5" />
                  </div>
                  <p className="text-sm text-slate-500">
                    Click <span className="font-semibold text-slate-700">SEARCH</span> to fetch
                    application history
                  </p>
                </div>
              ) : (
                <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 bg-muted/40 border-b border-border/40">
                      <th className="px-5 py-4 font-bold">Sl</th>
                      <th className="px-5 py-4 font-bold text-center">View</th>
                      <th className="px-5 py-4 font-bold">Emp Id</th>
                      <th className="px-5 py-4 font-bold">Employee Name</th>
                      <th className="px-5 py-4 font-bold">Area Name</th>
                      <th className="px-5 py-4 font-bold">Join Date</th>
                      <th className="px-5 py-4 font-bold text-right">Exp. Loan Amount</th>
                      <th className="px-5 py-4 font-bold text-right">App. Loan Amt</th>
                      <th className="px-5 py-4 font-bold text-center">Approved Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/45">
                    {mockListData.map((row, index) => (
                      <tr key={row.id} className="group transition-all hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]">
                        <td className="px-5 py-3.5 text-muted-foreground/80 font-medium">{index + 1}</td>
                        <td className="px-5 py-3.5 text-center">
                          <button className="p-1.5 bg-emerald-50 text-emerald-600 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors">
                            <Search className="size-3.5" />
                          </button>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-primary">{row.empId}</td>
                        <td className="px-5 py-3.5 font-medium text-foreground">{row.empName}</td>
                        <td className="px-5 py-3.5 text-muted-foreground/90 font-medium">{row.areaName}</td>
                        <td className="px-5 py-3.5 text-muted-foreground/80 font-medium">{row.joinDate}</td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold text-primary">
                          ৳ {row.expLoanAmount.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-semibold text-foreground/90">0.00</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={\`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold \${row.status === 'Approved' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'}\`}>
                            <span className={\`size-1.5 rounded-full \${row.status === 'Approved' ? 'bg-success' : 'bg-warning animate-pulse'}\`} />
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Bottom Footer Info */}
            {isDataLoaded && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-t border-border/40 bg-muted/15">
                <span className="text-[11px] font-semibold text-muted-foreground/80">
                  Showing {mockListData.length > 0 ? 1 : 0} to {mockListData.length} of {mockListData.length} entries
                </span>
                <div className="flex items-center gap-1">
                  <button className="h-8 px-3 rounded-lg border border-border/60 bg-card hover:bg-muted text-xs font-bold text-muted-foreground disabled:opacity-50 transition" disabled>
                    Previous
                  </button>
                  <button className="h-8 w-8 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-2xs">
                    1
                  </button>
                  <button className="h-8 px-3 rounded-lg border border-border/60 bg-card hover:bg-muted text-xs font-bold text-muted-foreground disabled:opacity-50 transition" disabled>
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
INNER_EOF
sh update_loan.sh
