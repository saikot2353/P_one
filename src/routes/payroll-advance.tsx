import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { useState } from "react";
import {
  ChevronRight, Banknote, Search, Plus, Filter, Download,
  Printer, FileText, Trash2, Edit, MoreHorizontal, FileSpreadsheet
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/payroll-advance")({
  head: () => ({
    meta: [
      { title: "Advance Management — CRIPTON" },
      { name: "description", content: "Manage advance requisitions and lists in a unified view." },
    ],
  }),
  component: PayrollAdvancePage,
});

// Dummy Data based on the user's screenshots
const advanceData = [
  { id: 1, empId: "2021028542", empName: "Zakir Hossain", designation: "Executive", type: "Office Executive", dept: "Implementation & Support (HR)", company: "Pakiza Software Limited", month: "04", year: "2026", amount: 15000.00, status: "Approved", remarks: "Salary Advance." },
  { id: 2, empId: "2022041203", empName: "Khairul Bashar Masum", designation: "Asst. Manager", type: "Office Executive", dept: "HR Team", company: "Pakiza Software Limited", month: "02", year: "2026", amount: 5500.00, status: "Approved", remarks: "Salary Advance." },
  { id: 3, empId: "2022041203", empName: "Khairul Bashar Masum", designation: "Asst. Manager", type: "Office Executive", dept: "HR Team", company: "Pakiza Software Limited", month: "04", year: "2026", amount: 3500.00, status: "Pending", remarks: "Salary Advance" },
  { id: 4, empId: "2022041203", empName: "Khairul Bashar Masum", designation: "Asst. Manager", type: "Office Executive", dept: "HR Team", company: "Pakiza Software Limited", month: "01", year: "2026", amount: 5000.00, status: "Approved", remarks: "Salary Advance." },
  { id: 5, empId: "2023043021", empName: "Easin Mia", designation: "Receptionist", type: "Office Executive", dept: "Admin", company: "Pakiza Software Limited", month: "01", year: "2026", amount: 10000.00, status: "Rejected", remarks: "Salary Advance." },
  { id: 6, empId: "2023043577", empName: "Md. Mostakim Shah", designation: "Office Boy", type: "Office Staff", dept: "Admin", company: "Pakiza Software Limited", month: "01", year: "2026", amount: 5000.00, status: "Approved", remarks: "Salary Advance." },
  { id: 7, empId: "2023043577", empName: "Md. Mostakim Shah", designation: "Office Boy", type: "Office Staff", dept: "Admin", company: "Pakiza Software Limited", month: "02", year: "2026", amount: 5000.00, status: "Approved", remarks: "Salary Advance." },
  { id: 8, empId: "2023043910", empName: "Tahmid Afsar", designation: "Asst. Manager", type: "Office Executive", dept: "Project Resource & Strategy", company: "Pakiza Software Limited", month: "04", year: "2026", amount: 7500.00, status: "Approved", remarks: "Salary Advance" },
  { id: 9, empId: "2023043974", empName: "Md. Anwar Hossain", designation: "Asst. Manager", type: "Office Executive", dept: "Merchandising-Purchase-MCD", company: "Pakiza Software Limited", month: "01", year: "2026", amount: 65000.00, status: "Approved", remarks: "Salary Advance." },
  { id: 10, empId: "2023046001", empName: "Sohanur Rahman Schan", designation: "Executive", type: "Office Executive", dept: "Admin", company: "Pakiza Software Limited", month: "04", year: "2026", amount: 8333.00, status: "Approved", remarks: "Loan & Salary Advance" },
];

function PayrollAdvancePage() {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved": return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Approved</Badge>;
      case "Pending": return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">Pending</Badge>;
      case "Rejected": return <Badge className="bg-rose-500/10 text-rose-600 border-rose-200">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto bg-muted/20">
        <Topbar />
        <div className="p-4 md:p-6 space-y-6 w-full">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3.5" />
            <span>Payroll</span>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-semibold">Advance Management</span>
          </div>

          {/* Page Header & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-md border border-primary/20 text-primary">
                  <Banknote className="size-5" />
                </div>
                Advance Management
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Unified view for managing advance requisitions and historical lists.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                <FileSpreadsheet className="size-4" /> Excel
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                <Printer className="size-4" /> Print
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                <FileText className="size-4" /> PDF
              </Button>
              
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shadow-sm">
                    <Plus className="size-4" /> New Requisition
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>New Advance Requisition</DialogTitle>
                    <DialogDescription>
                      Create a new salary or general advance request for an employee.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="req-emp">Employee</Label>
                      <Select>
                        <SelectTrigger id="req-emp">
                          <SelectValue placeholder="Select Employee..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2021028542">2021028542 - Zakir Hossain</SelectItem>
                          <SelectItem value="2022041203">2022041203 - Khairul Bashar Masum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="req-month">Month</Label>
                        <Select defaultValue="06">
                          <SelectTrigger id="req-month">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="01">January</SelectItem>
                            <SelectItem value="02">February</SelectItem>
                            <SelectItem value="03">March</SelectItem>
                            <SelectItem value="04">April</SelectItem>
                            <SelectItem value="05">May</SelectItem>
                            <SelectItem value="06">June</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="req-year">Year</Label>
                        <Select defaultValue="2026">
                          <SelectTrigger id="req-year">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2026">2026</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="req-amount">Advance Amount</Label>
                      <Input id="req-amount" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="req-remarks">Remarks</Label>
                      <Input id="req-remarks" placeholder="E.g., Salary Advance" />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={() => setIsModalOpen(false)}>Submit Requisition</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

            </div>
          </div>

          {/* Smart Filter Panel */}
          <div className="bg-card border border-border/60 rounded-lg p-4 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Employee Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input placeholder="Search by ID or Name..." className="pl-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Month</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All Months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    <SelectItem value="01">January</SelectItem>
                    <SelectItem value="02">February</SelectItem>
                    <SelectItem value="03">March</SelectItem>
                    <SelectItem value="04">April</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Year</label>
                <Select defaultValue="2026">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border/40 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Company</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="All Companies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      <SelectItem value="pakiza">Pakiza Software Limited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Employee Type</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="office-exec">Office Executive</SelectItem>
                      <SelectItem value="office-staff">Office Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Department</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="hr">HR Team</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="it">IT Department</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button variant="default" className="flex-1">
                    Apply Filters
                  </Button>
                  <Button variant="outline" className="px-3" title="Reset Filters">
                    Reset
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex justify-center -mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-muted-foreground hover:text-foreground h-7"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="size-3 mr-1.5" />
                {showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
              </Button>
            </div>
          </div>

          {/* Unified Data Table */}
          <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-12 text-center">SL</TableHead>
                    <TableHead>Emp ID</TableHead>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {advanceData.map((row, idx) => (
                    <TableRow key={row.id} className="hover:bg-muted/30">
                      <TableCell className="text-center text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell className="font-medium text-primary">{row.empId}</TableCell>
                      <TableCell>
                        <div className="font-medium">{row.empName}</div>
                        <div className="text-xs text-muted-foreground hidden lg:block">{row.type} • {row.company}</div>
                      </TableCell>
                      <TableCell>{row.designation}</TableCell>
                      <TableCell>{row.dept}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{row.month}/{row.year}</div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        {row.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(row.status)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate" title={row.remarks}>
                        {row.remarks}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-70 hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                            <Edit className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination Placeholder */}
            <div className="p-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground bg-muted/20">
              <div>Showing 1 to 10 of 20 entries</div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="default" size="sm" className="h-8 w-8 p-0">1</Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">2</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

