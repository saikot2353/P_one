import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { useState } from "react";
import {
  ChevronRight, CheckCircle2, XCircle, Search, 
  Printer, FileText, FileSpreadsheet, Eye,
  Banknote, CalendarClock
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/approve-advance")({
  head: () => ({
    meta: [
      { title: "Advance Requisition Approvals — CRIPTON" },
      { name: "description", content: "Review and approve employee advance requisitions." },
    ],
  }),
  component: ApproveAdvancePage,
});

// Dummy Data for Pending Approvals
const initialPendingData = [
  { id: 1, empId: "2022041203", empName: "Khairul Bashar Masum", designation: "Asst. Manager", dept: "HR Team", amount: "3,500.00", reqDate: "2026-04-10", type: "Salary Advance", remarks: "For personal emergency." },
  { id: 2, empId: "2023043021", empName: "Easin Mia", designation: "Receptionist", dept: "Admin", amount: "10,000.00", reqDate: "2026-04-12", type: "General Advance", remarks: "Medical expense." },
  { id: 3, empId: "2023046001", empName: "Sohanur Rahman Schan", designation: "Executive", dept: "Admin", amount: "5,000.00", reqDate: "2026-04-15", type: "Salary Advance", remarks: "Advance for festival." },
];

function ApproveAdvancePage() {
  const [approvals, setApprovals] = useState(initialPendingData);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleApprove = (id: number) => {
    setApprovals(prev => prev.filter(req => req.id !== id));
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
  };

  const handleReject = (id: number) => {
    setApprovals(prev => prev.filter(req => req.id !== id));
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
  };

  const handleApproveSelected = () => {
    setApprovals(prev => prev.filter(req => !selectedIds.includes(req.id)));
    setSelectedIds([]);
  };

  const handleRejectSelected = () => {
    setApprovals(prev => prev.filter(req => !selectedIds.includes(req.id)));
    setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === approvals.length && approvals.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(approvals.map(req => req.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto bg-muted/20">
        <Topbar />
        <div className="p-4 md:p-6 space-y-6 w-full max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3.5" />
            <span>Payroll</span>
            <ChevronRight className="size-3.5" />
            <span>Payroll Approval</span>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-semibold">Advance Requisitions</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-md border border-primary/20 text-primary">
                  <CalendarClock className="size-5" />
                </div>
                Advance Requisition Approvals
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Review, approve, or reject pending employee advance requests.
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-background p-1.5 rounded-lg border shadow-sm">
               <div className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-md text-sm font-semibold border border-amber-200/50 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                 {approvals.length} Pending
               </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-card border border-border/60 rounded-lg shadow-sm">
            {selectedIds.length > 0 && (
              <div className="p-3 bg-primary/5 border-b border-border/50 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/20">
                    {selectedIds.length} Selected
                  </Badge>
                  <span className="text-sm font-medium text-muted-foreground">items ready for action</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleRejectSelected} className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 h-8">
                    <XCircle className="size-3.5 mr-1.5" />
                    Reject Selected
                  </Button>
                  <Button size="sm" onClick={handleApproveSelected} className="bg-emerald-600 hover:bg-emerald-700 text-white h-8">
                    <CheckCircle2 className="size-3.5 mr-1.5" />
                    Approve Selected
                  </Button>
                </div>
              </div>
            )}
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
                <Input className="h-8 w-[250px]" placeholder="Search by name or ID..." />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[40px] text-center">
                      <Checkbox 
                        checked={approvals.length > 0 && selectedIds.length === approvals.length}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead className="w-[60px] text-xs font-semibold">SL</TableHead>
                    <TableHead className="text-xs font-semibold">Req Date</TableHead>
                    <TableHead className="text-xs font-semibold">EmpId</TableHead>
                    <TableHead className="text-xs font-semibold">Name</TableHead>
                    <TableHead className="text-xs font-semibold">Dept & Desig</TableHead>
                    <TableHead className="text-xs font-semibold">Type</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Amount</TableHead>
                    <TableHead className="text-xs font-semibold">Remarks</TableHead>
                    <TableHead className="w-[140px] text-xs font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-sm text-muted-foreground py-12">
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2 className="size-8 text-emerald-500/50" />
                          <p>No pending advance requisitions to review!</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    approvals.map((row, idx) => (
                      <TableRow key={row.id} className={selectedIds.includes(row.id) ? "bg-primary/5" : ""}>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={selectedIds.includes(row.id)}
                            onCheckedChange={() => toggleSelect(row.id)}
                            aria-label={`Select row ${idx + 1}`}
                          />
                        </TableCell>
                        <TableCell className="text-xs font-medium">{idx + 1}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{row.reqDate}</TableCell>
                        <TableCell className="text-xs font-medium">{row.empId}</TableCell>
                        <TableCell className="text-xs font-medium text-primary">{row.empName}</TableCell>
                        <TableCell className="text-xs">
                          <div className="flex flex-col">
                            <span>{row.dept}</span>
                            <span className="text-muted-foreground text-[10px]">{row.designation}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] bg-background">
                            {row.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-right font-bold text-rose-600">
                          {row.amount}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate" title={row.remarks}>
                          {row.remarks}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 text-emerald-600"
                              onClick={() => handleApprove(row.id)}
                              title="Approve"
                            >
                              <CheckCircle2 className="size-3.5" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7 border-rose-200 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 text-rose-600"
                              onClick={() => handleReject(row.id)}
                              title="Reject"
                            >
                              <XCircle className="size-3.5" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7 text-muted-foreground"
                              title="View Details"
                            >
                              <Eye className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="p-3 border-t border-border/50 flex justify-between items-center bg-muted/10">
              <div className="text-[11px] text-muted-foreground">Showing {approvals.length > 0 ? 1 : 0} to {approvals.length} of {approvals.length} pending requests</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
