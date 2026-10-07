import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Badge } from "@/components/ui/badge";
import {
  Timer,
  ChevronRight,
  Search,
  Printer,
  CheckCircle2,
  X,
  AlertCircle,
  ShieldCheck,
  Download,
  Eye,
  Clock,
  XCircle,
  FileSpreadsheet,
  FileText,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/approve-overtime")({
  head: () => ({
    meta: [
      { title: "Approve OT Requisition — CRIPTON" },
      { name: "description", content: "Approve or Reject Employee Overtime Requisitions." },
    ],
  }),
  component: ApproveOvertimePage,
});

export interface ApproveOTRecord {
  id: string;
  empId: string;
  empIdOff: string;
  name: string;
  type: string;
  department: string;
  designation: string;
  unit: string;
  line: string;
  date: string;
  inTime: string;
  outDate: string;
  outTime: string;
  otReq: number;
  motReq: number;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  reason?: string;
}

const EMPLOYEE_TYPES = [
  "ALL",
  "Management",
  "Office Executive",
  "Production Executive",
  "Office Staff",
  "Production Staff",
  "Worker",
  "Pcs Rate Worker",
  "Intern",
];

const DEPARTMENTS = [
  "ALL",
  "Accessories Store (MCD)",
  "Accessories Store 1",
  "Accounts",
  "Accounts & Finance",
  "Admin",
  "Admin and Compliance",
  "Admin and Compliiance",
  "Brand and Media",
  "CAD",
  "Chemical Store (MCD)",
  "Civil Engineering",
  "Commercial",
  "Compliance",
  "Cutting",
  "Cutting 1",
  "Cutting Quality",
  "Dyeing Finishing",
  "Dyeing Lab",
  "Dyeing planning and Batch",
  "Dyeing Production",
  "Embroidery",
  "Embroidery Quality",
  "Fabric Quality",
  "Fabrics Finish Fabric Store (MCD)",
  "Finishing",
  "Finishing 1",
  "Finishing Quality",
  "Fire and Safety",
  "General Store (MCD)",
  "GPQ",
  "Grey Fabric Store (MCD)",
  "House Keeping",
  "Human Resources",
  "ICT",
  "Industrial Engineering (I.E.)",
  "Internal Audit",
  "Knitting Production",
  "Knitting Quality",
  "Maintenance RMG",
  "Maintenance Utility & Textile",
  "Management",
  "Marketing",
  "Marketing & Merchandising",
  "Medical",
  "Merchandising Supply Chain",
  "MIS",
  "Office Admin",
  "Printing",
  "Printing Quality",
  "Procurement and Supply Chain",
  "Production Audit",
  "Production Planning",
  "Production Planning 1",
  "QMS",
  "Recycling Management",
  "RMG Operations",
  "Sample",
  "Security",
  "Sewing",
  "Sewing Quality",
  "Special Quality",
  "Special Quality Store Quality",
  "Transport",
  "Vat & Tax",
  "Welfare",
  "Yarn Store (MCD)",
];

const JOB_TITLES = [
  "ALL",
  "Sr. Welder", "A.Q.C", "AC Helper", "Accounts Officer", "Admin Assistant", "Admin Executive", "Admin Officer", "Advisor", "AGM", "APM", "Assistant Manager", "Assistant Manager (Business Development)", "Assistant Manager (Security)", "Assistant Merchandiser", "Assistant Officer", "Assistant Officer (Bond)", "Assistant Officer (IT)", "Assistant Officer (Logistics)", "Assistant Officer (Vat)", "Assort Man", "Asst Planning Officer", "Asst. Batch Man", "Asst. Care Giver", "Asst. Carpenter", "Asst. Color Man", "Asst. Color Master", "Asst. Compactor Operator", "Asst. Cook", "Asst. Electrician", "Asst. Engineer", "Asst. Engineer (Elec.)", "Asst. Engraving Operator", "Asst. Fitter", "Asst. Floor In-charge", "Asst. General Manager", "Asst. Generator Operator", "Asst. In-charge", "Asst. Knitting Operator", "Asst. Manager", "Asst. Manager (Admin & Logistics)", "Asst. Manager (Admin)", "Asst. Manager (Fabric)", "Asst. Manager (Gray Fabric)", "Asst. Manager (IE)", "Asst. Manager (R&D)", "Asst. Manager (Utility)", "Asst. Marker", "Asst. Marketing Officer", "Asst. Mechanic", "Asst. Office (GPQ)", "Asst. Officer", "Asst. Officer (Accessories)", "Asst. Officer (Admin)", "Asst. Officer (Audit)", "Asst. Officer (Chemical)", "Asst. Officer (Costing)", "Asst. Officer (Finished Fabric)", "Asst. Officer (General)", "Asst. Officer (Grey Fabric)", "Asst. Officer (Logistic)", "Asst. Officer (Outside)", "Asst. Officer (Planning)", "Asst. Officer (RQS)", "Asst. Officer (Supply Chain)", "Asst. Officer (Tally)", "Asst. Officer (VAT & TAX)", "Asst. Officer (Yarn Store)", "Asst. Operator", "Asst. Packing Man", "Asst. Painter", "Asst. Planning Officer", "Asst. Printer", "Asst. Production Officer", "Asst. QC (Sample)", "Asst. QC In-charge", "Asst. Quality Controller", "Asst. Quality Inspector", "Asst. Reporter", "Asst. Sample Man", "Asst. Sample Supervisor", "Asst. Security Supervisor", "Asst. Sewing Operator", "Asst. Stenter Operator", "Asst. Store Keeper", "Asst. store Officer", "Asst. Supervisor", "Asst. Technician", "Asst. Thai Mistry", "Asst. Welder", "Asst. Welder Fitter", "Asst. Welfare Officer", "Ast. Manager (IE)", "Auditor", "Auto Cutter Operator", "Auto Spader Operator", "Batch Man", "Boiler Helper", "Boiler Operator", "Brush Operator", "Bundle Man", "Business Development Manager", "Business Intelligence Manager", "Buya", "CAD Assistant", "CAD cutter Man", "CAD Officer", "Canteen Boy", "Care Giver", "Caretaker", "Carpenter", "Cashier", "CBDO", "CEO", "Chairman", "Checker", "Chief Business Officer", "Chief Designer", "Chief Marketing Officer", "Chief Operating Officer", "Chief Technical Officer", "Civil Helper", "Cleaner", "Cleaner Supervisor", "Collar Mending Operator", "Color In-Charge", "Color Man", "Color Master", "Commercial Assistant", "Compactor Operator", "Computer Operator", "Concrete Batching Plant Operator", "Concrete Pump Operator", "Concrete Pump Pipe Fitter", "Consultant", "Cook", "Cook (Assistant)", "Coordinator", "Coordinator (Planning)", "Costing Officer", "Curing Man", "Customer Engagement Engineer", "Customer Engagement Manager", "Customer Engagement Specialist", "Cutter", "Cutter Man", "Cutting Co-ordinator", "Data Entry Officer", "Data Entry Operator", "Delivery Assistant", "Delivery Man", "Deputy Manager", "Deputy Manager (Business Development)", "Designer", "DGM", "Digital Marketing Executive", "Dining Supervisor", "Director", "Doctor", "DPM", "Driver", "Dump truck Driver", "E.T.P. Officer", "Electrical Helper", "Electrician", "Embroidery Quality Engineer", "Engineer (Civil)", "Engineer (Electrical)", "Engineer (Mech.)", "Engraving Operator", "ERP Officer", "ETP Helper", "ETP Operator", "ETP Supervisor", "Excavator Helper", "Excavator Operator", "Executive", "Executive (Elec.)", "Executive Director", "Fabric coordinator", "Fashion Designer", "Fire and Safety Officer", "Fire Assistant", "Fire Man", "Fitter Man", "Floor In-charge", "Floor Representative", "Folder", "Folder Technician", "Folding Man", "Foreign Procurement Specialist", "Forklift Driver", "Forklift Operator", "Gardener", "Gen. Operator", "General Manager", "General Manager (Production Operations)", "General Manager (Production)", "Generator Helper", "Generator Operator", "GM Operation", "GPQ", "Gr. Auto Spader Operator", "Gr. Batch Man", "Gr. Bundle Man", "Gr. Color Man", "Gr. Cutter Man", "Gr. Delivery Man", "Gr. Electrician", "Gr. Folding Man", "Gr. Handtag Man", "Gr. In-charge (Finishing)", "Gr. Input Man", "Gr. Iron Man", "Gr. Lay Man", "Gr. Layer Man", "Gr. Marker", "Gr. Mechanic", "Gr. Needle Detector Operator", "Gr. Needle Man", "Gr. Operator", "Gr. Operator (Dyeing)", "Gr. Operator (Embroidery)", "Gr. Operator (Knitting)", "Gr. Operator (Printing)", "Gr. Operator (Sewing)", "Gr. Packer", "Gr. Packing Man", "Gr. Painter", "Gr. Plumber", "Gr. Poly Man", "Gr. Quality Inspector", "Gr. Receive Man", "Gr. Sample Man", "Gr. Scissor Man", "Gr. Sewing Operator", "Gr. Spot Man", "Gr. Sticker Man", "Gr. Sucker Operator", "Gr. Welder", "Gr. Writer Man", "Handtag Man", "Head of Accounts & Finance", "Head of Administration", "Head of Business Development", "Head of Civil", "Head Of Design", "Head Of Enterprise", "Head of Fabrics Co-ordinator", "Head of Internal Audit", "Head of Marketing (Foreign Trade)", "Head of Printing Operations", "Head Of Technology", "Helper", "Helper (Cook)", "Helper (Cover Van)", "House Keeping Supervisor", "HR Officer", "IE Officer", "Imam", "In-charge", "In-charge (Fire & Safety)", "In-charge CAD", "Infrastructure Engineer", "Infrastructure Specialist", "Input Man", "Input Supervisor", "Iron Man", "Job Trainer", "Jr. Assort Man", "Jr. Auto Spader Operator", "Jr. Batch Man", "Jr. Bundle Man", "Jr. Color Man", "Jr. Color Master", "Jr. Cutter", "Jr. Delivery Man", "Jr. Designer", "Jr. Electrician", "Jr. Executive", "Jr. Executive (IE)", "Jr. Fire Man", "Jr. Fitter", "Jr. Folder", "Jr. Folding Man", "Jr. Handtag man", "Jr. Input Man", "Jr. Iron Man", "Jr. Lay Man", "Jr. Layer Man", "Jr. Marker", "Jr. Mechanic", "Jr. Mechanical Fitter", "Jr. Medical Officer", "Jr. Motor Wender", "Jr. Needle Detector Operator", "Jr. Needle Man", "Jr. Officer", "Jr. Officer (Front Desk)", "Jr. Officer (HR)", "Jr. Officer (IT)", "Jr. Officer (Pattern)", "Jr. Officer (Procurement)", "Jr. Officer (RQS)", "Jr. Operator", "Jr. Operator (Dyeing)", "Jr. Operator (Embroidery)", "Jr. Operator (Knitting)", "Jr. Operator (Printing)", "Jr. Operator (Sewing)", "Jr. Operator (Succer)", "Jr. Packer", "Jr. Packing Auditor", "Jr. Packing Man", "Jr. Painter", "Jr. Plumber", "Jr. Poly Man", "Jr. Production Officer", "Jr. Quality Inspector", "Jr. Receive Man", "Jr. Reporter", "Jr. Sample Man", "Jr. Scissor Man", "Jr. Security Guard", "Jr. Spot Man", "Jr. Sticker Man", "Jr. Store Officer", "Jr. Striper Man", "Jr. Succer Operator", "Jr. Sucker Operator", "Jr. Technician", "Jr. Wash Man", "Jr. Welder", "Jr. Welder Fitter", "Jr. Welfare Officer", "Jr. Writer", "Knitting In-Charge", "Knitting Operator", "Lab Assistant", "Label Operator", "Lathe Supervisor", "Lay Man", "Layer Man", "Leader (Loader)", "Lift Operator", "Line Chief", "Line Ironman", "Line QC", "Loader", "Logistics Officer", "Mac. Helper", "Management Representative (MIS)", "Management Trainee", "Manager", "Manager (Export & Import)", "Manager (IT)", "Manager (Printing Operations)", "Manager (Sample & Design)", "Managing Director", "Marker", "Marketing Assistant", "Marketing Officer", "Mason", "Mason Helper", "Mechanic", "Mechanical Fitter", "Mechanical Helper", "Mechanical In-charge", "Mechanical Welder Fitter", "Medical Assistant", "Medical Officer", "Merchandiser", "Merchandising Assistant", "Messenger", "Metal Detection Operator", "MIS Assistant", "MIS Officer", "Morgan Auto Spreader Operator", "Needle Detector Operator", "Needle Machin Operator", "Needle Machine Operator", "Needle Man", "Numbering Man", "Nurse", "Office Assistant", "Office Assistant (IT)", "Office Asst", "Office Boy", "Office Peon", "Office Supporting Staff", "Officer", "Officer (Accessories)", "Officer (Audit)", "Officer (Chemical)", "Officer (Color Master)", "Officer (Coordinator)", "Officer (Delivery)", "Officer (Expose)", "Officer (Fabric coordinator)", "Officer (Finished Fabric)", "Officer (General)", "Officer (GPQ)", "Officer (Grey Fabric)", "Officer (HR & Comp.)", "Officer (IT)", "Officer (Pattern Master)", "Officer (Pattern)", "Officer (QMS)", "Officer (R&D)", "Officer (Tally)", "Officer (VAT)", "Officer (Yarn Store)", "Officer (Yarn, Grey & Finished)", "Operator", "Operator (Dyeing)", "Operator (Embroidery)", "Operator (Gen. & Comp.)", "Operator (Knitting)", "Operator (Printing)", "Operator (Sewing)", "Operator (Spr. Machine)", "PA TO CEO", "Packing Auditor", "Packing List Officer", "Packing Man", "Packing Supervisor", "Painter", "Pattern Master", "Payloader Operator", "Photo Copy Operator", "Planning Manager", "Planning Officer", "Plumber", "Poly Man", "Print Co-ordinator", "Print Receive Man", "Probationary", "Process Automation Manager", "Procurement Assistant", "Procurement Officer", "Product Developer", "Product Safety Officer", "Production Associate", "Production Manager", "Production Officer", "Production Officer-(R&D)", "Production Reporter", "Project Engineer", "Purchase Officer", "Q.A. In-charge", "QC In-charge", "QC Supervisor", "Quality Auditor", "Quality Controller", "Quality Inspector", "R&D Assistant", "Receive Asst", "Receive Man", "Receive Supervisor", "Reporter", "Reporting & Analysis Specialist", "RQS Officer", "Sales Executive", "Sales Man", "Sample Asst", "Sample Man", "Sample Officer", "Sample QC", "Sample Supervisor", "Scissor Man", "Security Guard", "Security Head", "Security In-charge", "Security Officer", "Security Supervisor", "Senior Officer", "Sewing In-charge", "Sewing Operator", "Shade Keeper", "Shaker Man", "Shaper Supervisor", "Shift In-charge", "Shift In-charge (Security)", "Shift Officer", "Shift Officer (Finishing)", "Shift Officer (Lab)", "Site Engineer", "Size Set Man", "Slitting Operator", "Spot Man", "Spot Supervisor", "Sr Store Keeper", "Sr. Assort Man", "Sr. Batch Man", "Sr. Boiler Operator", "Sr. Bundle Man", "Sr. Color Man", "Sr. Color Master", "Sr. Compliance Officer", "Sr. Cutter", "Sr. Cutter Man", "Sr. Delivery Man", "Sr. Designer", "Sr. Electrician", "Sr. Engineer", "Sr. ETP Operator", "Sr. Executive", "Sr. Executive (Admin)", "Sr. Executive (CAD)", "Sr. Executive (ETP)", "Sr. Executive (IE)", "Sr. Fire Man", "Sr. Fitter Man", "Sr. Floor In-charge", "Sr. Folding Man", "Sr. General Manager", "Sr. Generator Operator", "Sr. Helper", "Sr. In-charge", "Sr. In-charge (QA)", "Sr. Input Man", "Sr. Ironman", "Sr. Lay Man", "Sr. Layer Man", "Sr. Lift Operator", "Sr. Manager", "Sr. Manager (EMS & Energy)", "Sr. Marker", "Sr. Mechanic", "Sr. Mechanical Fitter", "Sr. Merchandiser", "Sr. Motor Wender", "Sr. Needle Man", "Sr. Officer", "Sr. Officer (Accessories)", "Sr. Officer (Admin)", "Sr. Officer (CAD)", "Sr. Officer (Chemical)", "Sr. Officer (Dining & Procurement)", "Sr. Officer (Finished Fabric)", "Sr. Officer (Fire & Safety)", "Sr. Officer (General)", "Sr. Officer (GPQ)", "Sr. Officer (Grey Fabric)", "Sr. Officer (HR & Payroll)", "Sr. Officer (HR)", "Sr. Officer (IE)", "Sr. Officer (IT)", "Sr. Officer (Pattern)", "Sr. Officer (Planning & Production)", "Sr. Officer (Recruitment)", "Sr. Officer (RQS)", "Sr. Officer (Sample)", "Sr. Officer (Security)", "Sr. Officer (Store Quality)", "Sr. Officer (Yarn Store)", "Sr. Operator", "Sr. Operator (Dyeing)", "Sr. Operator (Embroidery)", "Sr. Operator (Knitting)", "Sr. Operator (Printing)", "Sr. Operator (Sewing)", "Sr. Operator (Spr. Machine)", "Sr. Packer Man", "Sr. Packing Man", "Sr. Pattern Master", "Sr. Planning Officer", "Sr. PM", "Sr. Production Officer", "Sr. Quality Assurance", "Sr. Quality Controller", "Sr. Quality Inspector", "Sr. Receive Man", "Sr. Sample Man", "Sr. Scissor Man", "Sr. Sticker Man", "Sr. Store Officer", "Sr. Striper Man", "Sr. Supervisor", "Sr. Supervisor (Security)", "Sr. Technical Officer", "Sr. Technician", "Sr. Welfare Officer", "Sr. Writer Man", "Sr. WTP Operator", "Sr.Officer (QMS)", "Stenter Operator", "Sticker Man", "Store Asst", "Store Keeper", "Store Officer", "Store Q.C.", "Store Q.I.", "Striper Man", "Sub Asst. Engineer", "Succer Helper", "Succer Operator", "Supervisor", "Supervisor (Auto Cutter)", "Supervisor (Succer)", "Supply Chain Manager", "Sweeper", "Tally Man", "Tea Boy", "Team Leader (Size Set)", "Technical Operation", "Technician", "Technician A/C", "Telephone Operator", "Thai Mistry", "Tr. IE Officer", "Tr. Merchandiser", "Tr. Supervisor", "Trainee", "Trainee Asst. Officer", "Trainee Officer", "Trainee Officer (HR)", "Trainee Officer (IT)", "Wash Man", "Welder", "Welder Fitter", "Welder Helper", "Welfare Officer", "Work Study Officer", "Writer Man", "WTP Helper", "WTP Operator",
];

const UNITS = [
  "ALL",
  "N/A",
  "Unit-01",
  "Unit-02",
  "Unit-03",
  "Unit-04",
  "Unit-05",
  "Unit-06",
  "Unit-07",
  "Unit-08",
  "Unit-10",
];

const LINES = [
  "ALL",
  "0",
  ...Array.from({ length: 65 }, (_, i) => (i + 1).toString().padStart(2, "0")),
  "N/A",
];

function ApproveOvertimePage() {
  // Filter States
  const [startDate, setStartDate] = useState("2026-09-13");
  const [endDate, setEndDate] = useState("2026-09-13");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Pending" | "Approved" | "Rejected">("Pending");
  const [selectedEmpType, setSelectedEmpType] = useState("ALL");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedJobTitle, setSelectedJobTitle] = useState("ALL");
  const [selectedUnit, setSelectedUnit] = useState("ALL");
  const [selectedLine, setSelectedLine] = useState("ALL");
  const [empIdInput, setEmpIdInput] = useState("");

  // Table Search Filter
  const [tableSearch, setTableSearch] = useState("");

  // Initial Sample Records
  const initialRecords: ApproveOTRecord[] = [
    {
      id: "REQ-2026-001",
      empId: "2020021549",
      empIdOff: "OFF-1549",
      name: "Aminur Islam",
      type: "Office Executive",
      department: "Human Resources",
      designation: "Assistant Manager",
      unit: "N/A",
      line: "N/A",
      date: "13/09/2026",
      inTime: "07:42:47",
      outDate: "13/09/2026",
      outTime: "18:15:00",
      otReq: 2.0,
      motReq: 0,
      amount: 300.0,
      status: "Pending",
      reason: "Urgent Month-end Payroll Reconciliation",
    },
    {
      id: "REQ-2026-002",
      empId: "2023044857",
      empIdOff: "OFF-4857",
      name: "Md. Rakibul Alam Raju",
      type: "Office Executive",
      department: "Marketing & Merchandising",
      designation: "Deputy Manager",
      unit: "Unit-05",
      line: "02",
      date: "13/09/2026",
      inTime: "08:03:56",
      outDate: "13/09/2026",
      outTime: "21:00:00",
      otReq: 4.0,
      motReq: 0,
      amount: 600.0,
      status: "Pending",
      reason: "Export Shipment Booking Execution",
    },
    {
      id: "REQ-2026-003",
      empId: "2023045146",
      empIdOff: "OFF-5146",
      name: "Asif Hossain",
      type: "Worker",
      department: "Admin",
      designation: "Driver",
      unit: "Unit-01",
      line: "01",
      date: "13/09/2026",
      inTime: "08:30:12",
      outDate: "13/09/2026",
      outTime: "22:30:00",
      otReq: 3.5,
      motReq: 0,
      amount: 525.0,
      status: "Pending",
      reason: "Night Shift Staff Transport Duty",
    },
    {
      id: "REQ-2026-004",
      empId: "2023043910",
      empIdOff: "OFF-3910",
      name: "Tahmid Afsar Shapno",
      type: "Office Executive",
      department: "Business Innovation",
      designation: "Asst. Manager",
      unit: "Unit-02",
      line: "N/A",
      date: "13/09/2026",
      inTime: "09:00:00",
      outDate: "13/09/2026",
      outTime: "20:45:00",
      otReq: 2.5,
      motReq: 0,
      amount: 375.0,
      status: "Approved",
      reason: "System Integration Testing",
    },
  ];

  const [records, setRecords] = useState<ApproveOTRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_approve_ot_list");
      return saved ? JSON.parse(saved) : initialRecords;
    }
    return initialRecords;
  });

  useEffect(() => {
    localStorage.setItem("cripton_approve_ot_list", JSON.stringify(records));
  }, [records]);

  // Selected row IDs for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter Computation
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (selectedEmpType !== "ALL" && r.type !== selectedEmpType) return false;
      if (selectedDept !== "ALL" && r.department !== selectedDept) return false;
      if (selectedJobTitle !== "ALL" && r.designation !== selectedJobTitle) return false;
      if (selectedUnit !== "ALL" && r.unit !== selectedUnit) return false;
      if (selectedLine !== "ALL" && r.line !== selectedLine) return false;
      if (empIdInput.trim()) {
        const q = empIdInput.toLowerCase().trim();
        if (!r.empId.toLowerCase().includes(q) && !r.empIdOff.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase().trim();
        return (
          r.name.toLowerCase().includes(q) ||
          r.empId.toLowerCase().includes(q) ||
          r.empIdOff.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [
    records,
    statusFilter,
    selectedEmpType,
    selectedDept,
    selectedJobTitle,
    selectedUnit,
    selectedLine,
    empIdInput,
    tableSearch,
  ]);

  // Row Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredRecords.map((r) => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Bulk Approve Action
  const handleBulkApprove = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one record to Approve!");
      return;
    }
    setRecords((prev) =>
      prev.map((r) => (selectedIds.has(r.id) ? { ...r, status: "Approved" } : r)),
    );
    toast.success(`Successfully approved ${selectedIds.size} OT requisitions!`);
    setSelectedIds(new Set());
  };

  // Bulk Reject Action
  const handleBulkReject = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one record to Reject!");
      return;
    }
    setRecords((prev) =>
      prev.map((r) => (selectedIds.has(r.id) ? { ...r, status: "Rejected" } : r)),
    );
    toast.error(`Rejected ${selectedIds.size} OT requisitions.`);
    setSelectedIds(new Set());
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      toast.error("No records available to export.");
      return;
    }
    const headers = [
      "#",
      "Emp ID",
      "Emp ID(Off)",
      "Name",
      "Type",
      "Department",
      "Designation",
      "Unit",
      "Line",
      "Date",
      "In Time",
      "Out Date",
      "Out Time",
      "OT Req",
      "MOT Req",
      "Amount",
      "Status",
    ];

    const rows = filteredRecords.map((r, index) => [
      (index + 1).toString(),
      r.empId,
      r.empIdOff,
      r.name,
      r.type,
      r.department,
      r.designation,
      r.unit,
      r.line,
      r.date,
      r.inTime,
      r.outDate,
      r.outTime,
      r.otReq.toString(),
      r.motReq.toString(),
      r.amount.toFixed(2),
      r.status,
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Approve_OT_Requisition_${startDate}_to_${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#090d16] text-foreground font-sans antialiased">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">
          {/* Header Banner */}
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden border-l-4 border-l-emerald-600">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <Link to="/manage-overtime" className="hover:text-primary transition-colors">
                  Manage Overtime
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-emerald-600 font-semibold uppercase">Approve OT Requisition</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <ShieldCheck className="size-6 text-emerald-600" />
                <span>Approve OT Requisition</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Filter overtime requisitions by department, job title, line, or unit, review requested hours, and execute batch approval decisions.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/manage-overtime"
                className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm uppercase tracking-wider"
              >
                <Timer className="size-4" /> OT Requisition Page
              </Link>
            </div>
          </div>

          {/* Top Filter Controls Section (Matching User Specification) */}
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h2 className="text-sm font-black text-foreground flex items-center gap-2">
                <Filter className="size-4 text-emerald-600" /> Search & Filter OT Requisitions
              </h2>
              <button
                onClick={() => {
                  setStartDate("2026-09-13");
                  setEndDate("2026-09-13");
                  setStatusFilter("Pending");
                  setSelectedEmpType("ALL");
                  setSelectedDept("ALL");
                  setSelectedJobTitle("ALL");
                  setSelectedUnit("ALL");
                  setSelectedLine("ALL");
                  setEmpIdInput("");
                  toast.info("Filters reset to default.");
                }}
                className="text-[11px] font-bold text-rose-500 hover:underline"
              >
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 text-xs">
              {/* Start Date */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-emerald-500 shadow-2xs"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-emerald-500 shadow-2xs"
                />
              </div>

              {/* Status Selector */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Status
                </label>
                <div className="flex items-center gap-1.5 h-9 px-2 bg-background border border-border/70 rounded-lg">
                  {(["Pending", "Approved", "Rejected", "ALL"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                        statusFilter === st
                          ? st === "Pending"
                            ? "bg-amber-500 text-white"
                            : st === "Approved"
                            ? "bg-emerald-600 text-white"
                            : st === "Rejected"
                            ? "bg-rose-600 text-white"
                            : "bg-blue-600 text-white"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Employee Type */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Employee Type
                </label>
                <select
                  value={selectedEmpType}
                  onChange={(e) => setSelectedEmpType(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-emerald-500 shadow-2xs"
                >
                  {EMPLOYEE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-emerald-500 shadow-2xs truncate"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Title / Designation */}
              <div className="sm:col-span-2 lg:col-span-2">
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Job Title
                </label>
                <select
                  value={selectedJobTitle}
                  onChange={(e) => setSelectedJobTitle(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-emerald-500 shadow-2xs truncate"
                >
                  {JOB_TITLES.map((jt) => (
                    <option key={jt} value={jt}>
                      {jt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Unit
                </label>
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-emerald-500 shadow-2xs"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Line
                </label>
                <select
                  value={selectedLine}
                  onChange={(e) => setSelectedLine(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-emerald-500 shadow-2xs"
                >
                  {LINES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee Id */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Employee Id
                </label>
                <input
                  type="text"
                  value={empIdInput}
                  onChange={(e) => setEmpIdInput(e.target.value)}
                  placeholder="Filter Employee Id..."
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-emerald-500 shadow-2xs"
                />
              </div>

              {/* SHOW / Search Action Button */}
              <div className="flex items-end sm:col-span-2 lg:col-span-1">
                <button
                  onClick={() => toast.success(`Loaded ${filteredRecords.length} OT requisitions.`)}
                  className="w-full h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm transition uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Search className="size-3.5" /> Search
                </button>
              </div>
            </div>
          </div>

          {/* Data Grid Toolbar & Table Container */}
          <div className="bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden">
            {/* Export Toolbar (Excel, Print, PDF & Table Search) */}
            <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 bg-muted/20">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="h-8.5 px-3 rounded border border-border/70 bg-background hover:bg-muted text-foreground text-[11px] font-bold flex items-center gap-1.5 shadow-2xs transition"
                >
                  <FileSpreadsheet className="size-3.5 text-emerald-600" /> Excel
                </button>
                <button
                  onClick={() => window.print()}
                  className="h-8.5 px-3 rounded border border-border/70 bg-background hover:bg-muted text-foreground text-[11px] font-bold flex items-center gap-1.5 shadow-2xs transition"
                >
                  <Printer className="size-3.5 text-blue-600" /> Print
                </button>
                <button
                  onClick={() => toast.info("PDF Export generated successfully.")}
                  className="h-8.5 px-3 rounded border border-border/70 bg-background hover:bg-muted text-foreground text-[11px] font-bold flex items-center gap-1.5 shadow-2xs transition"
                >
                  <FileText className="size-3.5 text-rose-600" /> PDF
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">Search:</span>
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="h-8.5 px-3 w-48 sm:w-64 rounded-md border border-border/70 bg-background text-xs outline-none focus:border-emerald-500 shadow-2xs"
                />
              </div>
            </div>

            {/* Data Grid Table (Matching User's Specified Header Columns) */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[1250px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900/90 text-foreground font-bold border-b border-border/60 text-[11px] whitespace-nowrap">
                    <th className="px-3 py-3 w-10 text-center border-r border-border/40">
                      <input
                        type="checkbox"
                        className="rounded border-border/70"
                        checked={
                          filteredRecords.length > 0 && selectedIds.size === filteredRecords.length
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-3 py-3 border-r border-border/40">Emp ID</th>
                    <th className="px-3 py-3 border-r border-border/40">Emp ID(Off)</th>
                    <th className="px-3 py-3 border-r border-border/40">Name</th>
                    <th className="px-3 py-3 border-r border-border/40">Type</th>
                    <th className="px-3 py-3 border-r border-border/40">Department</th>
                    <th className="px-3 py-3 border-r border-border/40">Designation</th>
                    <th className="px-3 py-3 text-center border-r border-border/40">Unit</th>
                    <th className="px-3 py-3 text-center border-r border-border/40">Line</th>
                    <th className="px-3 py-3 text-center border-r border-border/40">Date</th>
                    <th className="px-3 py-3 text-center border-r border-border/40">In Time</th>
                    <th className="px-3 py-3 text-center border-r border-border/40">Out Date</th>
                    <th className="px-3 py-3 text-center border-r border-border/40">Out Time</th>
                    <th className="px-3 py-3 text-center border-r border-border/40 font-mono">OT Req</th>
                    <th className="px-3 py-3 text-center border-r border-border/40 font-mono">MOT Req</th>
                    <th className="px-3 py-3 text-right border-r border-border/40 font-mono">Amount</th>
                    <th className="px-3 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 font-sans text-xs">
                  {filteredRecords.map((row) => {
                    const isChecked = selectedIds.has(row.id);
                    return (
                      <tr
                        key={row.id}
                        className={`transition duration-100 ${
                          isChecked ? "bg-emerald-50/50 dark:bg-emerald-950/20" : "hover:bg-muted/40"
                        }`}
                      >
                        <td className="px-3 py-2.5 text-center border-r border-border/30">
                          <input
                            type="checkbox"
                            className="rounded border-border/70"
                            checked={isChecked}
                            onChange={() => toggleSelectRow(row.id)}
                          />
                        </td>
                        <td className="px-3 py-2.5 font-mono font-bold text-foreground border-r border-border/30">
                          {row.empId}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-muted-foreground border-r border-border/30">
                          {row.empIdOff}
                        </td>
                        <td className="px-3 py-2.5 font-bold text-foreground border-r border-border/30">
                          {row.name}
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground border-r border-border/30">
                          {row.type}
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground border-r border-border/30">
                          {row.department}
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground border-r border-border/30">
                          {row.designation}
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono text-muted-foreground border-r border-border/30">
                          {row.unit}
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono text-muted-foreground border-r border-border/30">
                          {row.line}
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono border-r border-border/30">
                          {row.date}
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono text-muted-foreground border-r border-border/30">
                          {row.inTime}
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono border-r border-border/30">
                          {row.outDate}
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono text-muted-foreground border-r border-border/30">
                          {row.outTime}
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono font-bold text-foreground border-r border-border/30">
                          {row.otReq.toFixed(2)}
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono font-bold text-foreground border-r border-border/30">
                          {row.motReq}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono font-bold text-emerald-600 border-r border-border/30">
                          ৳ {row.amount.toFixed(2)}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span
                            className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                              row.status === "Approved"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : row.status === "Pending"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td
                        colSpan={17}
                        className="px-4 py-12 text-center text-muted-foreground font-medium"
                      >
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Action Bar (Approve & Reject Buttons matching user's spec) */}
            <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 bg-muted/10">
              <div className="text-xs text-muted-foreground font-semibold">
                Showing {filteredRecords.length > 0 ? 1 : 0} to {filteredRecords.length} of {records.length} entries
                {selectedIds.size > 0 && (
                  <span className="ml-2 text-emerald-600 font-bold">
                    ({selectedIds.size} selected)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleBulkApprove}
                  disabled={selectedIds.size === 0}
                  className="h-9 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-md shadow-xs transition uppercase tracking-wider flex items-center gap-1.5"
                >
                  <CheckCircle2 className="size-3.5" /> Approve
                </button>
                <button
                  onClick={handleBulkReject}
                  disabled={selectedIds.size === 0}
                  className="h-9 px-6 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-md shadow-xs transition uppercase tracking-wider flex items-center gap-1.5"
                >
                  <XCircle className="size-3.5" /> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
