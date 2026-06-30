import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { useState } from "react";
import {
  ChevronRight,
  Coins,
  Search,
  Plus,
  Printer,
  FileText,
  FileSpreadsheet,
  Edit,
  Trash2,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/incentive-allowance")({
  head: () => ({
    meta: [
      { title: "Incentive Allowance — CRIPTON" },
      { name: "description", content: "Manage and assign incentive allowances for employees." },
    ],
  }),
  component: IncentiveAllowancePage,
});

// Dummy Employee Options
const employeeOptions = [
  { value: "2021028542", label: "2021028542 - Zakir Hossain" },
  { value: "2022041203", label: "2022041203 - Khairul Bashar Masum" },
  { value: "2023043910", label: "2023043910 - Tahmid Afsar" },
  { value: "2023046001", label: "2023046001 - Sohanur Rahman Schan" },
];

// Dummy Data
const initialData: any[] = [
  {
    empId: "2021028542",
    name: "Zakir Hossain",
    dept: "Implementation & Support (HR)",
    designation: "Executive",
    amount: "5,000.00",
    status: "Approved",
    remark: "Performance Bonus",
  },
  {
    empId: "2022041203",
    name: "Khairul Bashar Masum",
    dept: "HR Team",
    designation: "Asst. Manager",
    amount: "8,500.00",
    status: "Pending",
    remark: "Festival Incentive",
  },
  {
    empId: "2023043910",
    name: "Tahmid Afsar",
    dept: "Project Resource & Strategy",
    designation: "Asst. Manager",
    amount: "12,000.00",
    status: "Approved",
    remark: "Project Completion",
  },
  {
    empId: "2023046001",
    name: "Sohanur Rahman Schan",
    dept: "Admin",
    designation: "Executive",
    amount: "3,000.00",
    status: "Rejected",
    remark: "Incomplete KPI",
  },
];

function IncentiveAllowancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [allowanceData, setAllowanceData] = useState(initialData);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto bg-muted/20">
        <Topbar />
        <div className="p-4 md:p-6 space-y-6 w-full">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span>Payroll</span>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-semibold">Incentive Allowance</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-md border border-primary/20 text-primary">
                  <Coins className="size-5" />
                </div>
                Incentive Allowance
              </h1>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-sm">
                  <Plus className="size-4" /> New Incentive
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2 border-b border-border/40">
                  <DialogTitle className="text-xl font-semibold text-foreground/80">
                    Incentive Allowance
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Create a new incentive allowance.
                  </DialogDescription>
                </DialogHeader>
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Empid <span className="text-destructive">*</span>
                    </Label>
                    <SearchableSelect
                      options={employeeOptions}
                      value={selectedEmpId}
                      onChange={setSelectedEmpId}
                      placeholder="Select Employee..."
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Allowance Amount
                    </Label>
                    <Input type="number" placeholder="Enter amount" className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Remark</Label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter remarks here..."
                    />
                  </div>
                </div>
                <DialogFooter className="p-4 border-t border-border/40 bg-muted/10 sm:justify-between">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      className="bg-orange-500 hover:bg-orange-600 text-white border-0 font-bold px-6"
                    >
                      CLOSE
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-[#7CB342] hover:bg-[#689f38] text-white font-bold px-6"
                    onClick={() => setIsModalOpen(false)}
                  >
                    CREATE
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Main Content Area */}
          <div className="bg-card border border-border/60 rounded-lg shadow-sm">
            <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-2 bg-background">
                  <FileSpreadsheet className="size-3.5" /> EXCEL
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-2 bg-background">
                  <Printer className="size-3.5" /> PRINT
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-2 bg-background">
                  <FileText className="size-3.5" /> PDF
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Search:</span>
                <Input className="h-8 w-[200px]" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#cfd8dc]/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[100px] text-xs font-semibold text-slate-600">
                      Actions
                    </TableHead>
                    <TableHead className="w-[60px] text-xs font-semibold text-slate-600">
                      SL
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">EmpId</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Name</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Dept</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">
                      Designation
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 text-right">
                      Allowance Amount
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 text-center">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600">Remark</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allowanceData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center text-xs text-muted-foreground py-4"
                      >
                        No data available in table
                      </TableCell>
                    </TableRow>
                  ) : (
                    allowanceData.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Edit className="size-3 text-blue-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Trash2 className="size-3 text-rose-500" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">{idx + 1}</TableCell>
                        <TableCell className="text-xs font-medium">{row.empId}</TableCell>
                        <TableCell className="text-xs">{row.name}</TableCell>
                        <TableCell className="text-xs">{row.dept}</TableCell>
                        <TableCell className="text-xs">{row.designation}</TableCell>
                        <TableCell className="text-xs text-right font-medium">
                          {row.amount}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={`text-[10px] uppercase ${
                              row.status === "Approved"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
                                : row.status === "Pending"
                                  ? "bg-amber-500/10 text-amber-600 border-amber-200"
                                  : "bg-rose-500/10 text-rose-600 border-rose-200"
                            }`}
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {row.remark}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="p-3 border-t border-border/50 flex justify-between items-center bg-muted/10">
              <div className="text-[11px] text-muted-foreground">
                Showing 1 to {allowanceData.length} of {allowanceData.length} entries
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-[11px] text-muted-foreground cursor-not-allowed"
                  disabled
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-[11px] text-muted-foreground cursor-not-allowed"
                  disabled
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
