import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { toast } from "sonner";
import {
  Timer,
  ChevronRight,
  Search,
  Printer,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Send,
  CheckSquare,
  Wand2,
  Trash2,
  FileSpreadsheet,
  FileText,
  Pencil,
  Eye,
  Plus,
  RefreshCw,
  UserCheck,
  Building2,
  Users,
  CheckCircle,
  XCircle,
  Filter,
  Calendar,
} from "lucide-react";

interface SearchParams {
  tab?: "requisition" | "requisition-list" | "submit" | "submitted-list" | "individual-review";
}

export const Route = createFileRoute("/manage-overtime")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    tab: (search.tab as SearchParams["tab"]) || "requisition",
  }),
  head: () => ({
    meta: [
      { title: "Manage Overtime — CRIPTON" },
      { name: "description", content: "OT Requisitions, Submissions, Approvals & Individual OT Review." },
    ],
  }),
  component: ManageOvertimePage,
});

export interface AttendanceRecord {
  id: string;
  sl: number;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  unit: string;
  line: string;
  inDate: string;
  inTime: string;
  outDate: string;
  outTime: string;
  wLine: string;
  calculatedOt: number;
  mOtInput: number;
  status: "Present" | "Late" | "Absent";
  reqOtInput: string;
  reqMotInput: string;
  reasonInput: string;
}

export interface SubmittedOTRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  otDate: string;
  calculatedOt: number;
  reqOt: number;
  reqMot: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
  batchId?: string;
}

export interface OTRequisitionListItem {
  id: string;
  empId: string;
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
  reqType: "OT" | "Allowance";
  status: "Pending" | "Approved" | "Rejected";
}

export interface SubmitOTReqItem {
  id: string;
  empId: string;
  empIdOff: string;
  name: string;
  type: string;
  department: string;
  designation: string;
  unit: string;
  line: string;
  wLine: string;
  date: string;
  inTime: string;
  outDate: string;
  outTime: string;
  otReq: number;
  otType: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
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

const MAIN_DEPARTMENTS = [
  "ALL",
  "Accounts & Finance",
  "Admin",
  "Admin and Compliance",
  "Admin and Compliiance",
  "Administration",
  "All over Printing",
  "Audit",
  "Brand and Media",
  "Business Automation",
  "Business Automation (HR)",
  "Business Development",
  "Business Innovation",
  "CAD",
  "Canteen",
  "Civil Engineering",
  "Commercial",
  "Commercial, Procurement and Supply Chain",
  "Core Development",
  "CSR",
  "Cutting",
  "Database Administrator (DBA)",
  "Designing",
  "e-Governance",
  "Embroidery",
  "EMS",
  "ENORSIA",
  "Fabric Dyeing",
  "Fabrics Department",
  "Finishing Department",
  "HR, Admin and Compliance",
  "Human Resources",
  "I.C.T.",
  "IE & Planning",
  "Implementation & Business Analysis",
  "Industrial Engineering (I.E.)",
  "Information and Communication Technology",
  "Internal Audit",
  "Knitting",
  "Maintenance",
  "Maintenance (RMG)",
  "Management",
  "Marketing",
  "Marketing and Merchandising",
  "Marketing and Technical",
  "Material Control Department",
  "Merchandinsing Supply chain",
  "Merchandising Supply Chain",
  "MIS",
  "Operation & Marketing",
  "Planning Sourcing",
  "Print and Emblishment",
  "Procurement and Supply Chain",
  "Product Management",
  "Production Audit",
  "Production Planning",
  "Project Resource & Strategy",
  "Quality Assurance Department",
  "Recycling Management",
  "Research and Development",
  "RMG Operations",
  "Sample",
  "Sample & CAD",
  "Sewing",
  "Supply Chain",
  "Technical Operation",
  "Technology",
  "Vat & Tax",
  "VAT & TAX",
  "Washing",
  "Worker",
  "WTP",
  "Yarn Dyeing",
  "Yarn Dyeing (Production)",
];

const JOB_TITLES = [
  "ALL",
  "Sr. Welder", "A.Q.C", "AC Helper", "Accounts Officer", "Admin Assistant", "Admin Executive", "Admin Officer", "Advisor", "AGM", "APM", "Assistant Manager", "Assistant Manager (Business Development)", "Assistant Manager (Security)", "Assistant Merchandiser", "Assistant Officer", "Assistant Officer (Bond)", "Assistant Officer (IT)", "Assistant Officer (Logistics)", "Assistant Officer (Vat)", "Assort Man", "Asst Planning Officer", "Asst. Batch Man", "Asst. Care Giver", "Asst. Carpenter", "Asst. Color Man", "Asst. Color Master", "Asst. Compactor Operator", "Asst. Cook", "Asst. Electrician", "Asst. Engineer", "Asst. Engineer (Elec.)", "Asst. Engraving Operator", "Asst. Fitter", "Asst. Floor In-charge", "Asst. General Manager", "Asst. Generator Operator", "Asst. In-charge", "Asst. Knitting Operator", "Asst. Manager", "Asst. Manager (Admin & Logistics)", "Asst. Manager (Admin)", "Asst. Manager (Fabric)", "Asst. Manager (Gray Fabric)", "Asst. Manager (IE)", "Asst. Manager (R&D)", "Asst. Manager (Utility)", "Asst. Marker", "Asst. Marketing Officer", "Asst. Mechanic", "Asst. Office (GPQ)", "Asst. Officer", "Asst. Officer (Accessories)", "Asst. Officer (Admin)", "Asst. Officer (Audit)", "Asst. Officer (Chemical)", "Asst. Officer (Costing)", "Asst. Officer (Finished Fabric)", "Asst. Officer (General)", "Asst. Officer (Grey Fabric)", "Asst. Officer (Logistic)", "Asst. Officer (Outside)", "Asst. Officer (Planning)", "Asst. Officer (RQS)", "Asst. Officer (Supply Chain)", "Asst. Officer (Tally)", "Asst. Officer (VAT & TAX)", "Asst. Officer (Yarn Store)", "Asst. Operator", "Asst. Packing Man", "Asst. Painter", "Asst. Planning Officer", "Asst. Printer", "Asst. Production Officer", "Asst. QC (Sample)", "Asst. QC In-charge", "Asst. Quality Controller", "Asst. Quality Inspector", "Asst. Reporter", "Asst. Sample Man", "Asst. Sample Supervisor", "Asst. Security Supervisor", "Asst. Sewing Operator", "Asst. Stenter Operator", "Asst. Store Keeper", "Asst. store Officer", "Asst. Supervisor", "Asst. Technician", "Asst. Thai Mistry", "Asst. Welder", "Asst. Welder Fitter", "Asst. Welfare Officer", "Ast. Manager (IE)", "Auditor", "Auto Cutter Operator", "Auto Spader Operator", "Batch Man", "Boiler Helper", "Boiler Operator", "Brush Operator", "Bundle Man", "Business Development Manager", "Business Intelligence Manager", "Buya", "CAD Assistant", "CAD cutter Man", "CAD Officer", "Canteen Boy", "Care Giver", "Caretaker", "Carpenter", "Cashier", "CBDO", "CEO", "Chairman", "Checker", "Chief Business Officer", "Chief Designer", "Chief Marketing Officer", "Chief Operating Officer", "Chief Technical Officer", "Civil Helper", "Cleaner", "Cleaner Supervisor", "Collar Mending Operator", "Color In-Charge", "Color Man", "Color Master", "Commercial Assistant", "Compactor Operator", "Computer Operator", "Concrete Batching Plant Operator", "Concrete Pump Operator", "Concrete Pump Pipe Fitter", "Consultant", "Cook", "Cook (Assistant)", "Coordinator", "Coordinator (Planning)", "Costing Officer", "Curing Man", "Customer Engagement Engineer", "Customer Engagement Manager", "Customer Engagement Specialist", "Cutter", "Cutter Man", "Cutting Co-ordinator", "Data Entry Officer", "Data Entry Operator", "Delivery Assistant", "Delivery Man", "Deputy Manager", "Deputy Manager (Business Development)", "Designer", "DGM", "Digital Marketing Executive", "Dining Supervisor", "Director", "Doctor", "DPM", "Driver", "Dump truck Driver", "E.T.P. Officer", "Electrical Helper", "Electrician", "Embroidery Quality Engineer", "Engineer (Civil)", "Engineer (Electrical)", "Engineer (Mech.)", "Engraving Operator", "ERP Officer", "ETP Helper", "ETP Operator", "ETP Supervisor", "Excavator Helper", "Excavator Operator", "Executive", "Executive (Elec.)", "Executive Director", "Fabric coordinator", "Fashion Designer", "Fire and Safety Officer", "Fire Assistant", "Fire Man", "Fitter Man", "Floor In-charge", "Floor Representative", "Folder", "Folder Technician", "Folding Man", "Foreign Procurement Specialist", "Forklift Driver", "Forklift Operator", "Gardener", "Gen. Operator", "General Manager", "General Manager (Production Operations)", "General Manager (Production)", "Generator Helper", "Generator Operator", "GM Operation", "GPQ", "Gr. Auto Spader Operator", "Gr. Batch Man", "Gr. Bundle Man", "Gr. Color Man", "Gr. Cutter Man", "Gr. Delivery Man", "Gr. Electrician", "Gr. Folding Man", "Gr. Handtag Man", "Gr. In-charge (Finishing)", "Gr. Input Man", "Gr. Iron Man", "Gr. Lay Man", "Gr. Layer Man", "Gr. Marker", "Gr. Mechanic", "Gr. Needle Detector Operator", "Gr. Needle Man", "Gr. Operator", "Gr. Operator (Dyeing)", "Gr. Operator (Embroidery)", "Gr. Operator (Knitting)", "Gr. Operator (Printing)", "Gr. Operator (Sewing)", "Gr. Packer", "Gr. Packing Man", "Gr. Painter", "Gr. Plumber", "Gr. Poly Man", "Gr. Quality Inspector", "Gr. Receive Man", "Gr. Sample Man", "Gr. Scissor Man", "Gr. Sewing Operator", "Gr. Spot Man", "Gr. Sticker Man", "Gr. Sucker Operator", "Gr. Welder", "Gr. Writer Man", "Handtag Man", "Head of Accounts & Finance", "Head of Administration", "Head of Business Development", "Head of Civil", "Head Of Design", "Head Of Enterprise", "Head of Fabrics Co-ordinator", "Head of Internal Audit", "Head of Marketing (Foreign Trade)", "Head of Printing Operations", "Head Of Technology", "Helper", "Helper (Cook)", "Helper (Cover Van)", "House Keeping Supervisor", "HR Officer", "IE Officer", "Imam", "In-charge", "In-charge (Fire & Safety)", "In-charge CAD", "Infrastructure Engineer", "Infrastructure Specialist", "Input Man", "Input Supervisor", "Iron Man", "Job Trainer", "Jr. Assort Man", "Jr. Auto Spader Operator", "Jr. Batch Man", "Jr. Bundle Man", "Jr. Color Man", "Jr. Color Master", "Jr. Cutter", "Jr. Delivery Man", "Jr. Designer", "Jr. Electrician", "Jr. Executive", "Jr. Executive (IE)", "Jr. Fire Man", "Jr. Fitter", "Jr. Folder", "Jr. Folding Man", "Jr. Handtag man", "Jr. Input Man", "Jr. Iron Man", "Jr. Lay Man", "Jr. Layer Man", "Jr. Marker", "Jr. Mechanic", "Jr. Mechanical Fitter", "Jr. Medical Officer", "Jr. Motor Wender", "Jr. Needle Detector Operator", "Jr. Needle Man", "Jr. Officer", "Jr. Officer (Front Desk)", "Jr. Officer (HR)", "Jr. Officer (IT)", "Jr. Officer (Pattern)", "Jr. Officer (Procurement)", "Jr. Officer (RQS)", "Jr. Operator", "Jr. Operator (Dyeing)", "Jr. Operator (Embroidery)", "Jr. Operator (Knitting)", "Jr. Operator (Printing)", "Jr. Operator (Sewing)", "Jr. Operator (Succer)", "Jr. Packer", "Jr. Packing Auditor", "Jr. Packing Man", "Jr. Painter", "Jr. Plumber", "Jr. Poly Man", "Jr. Production Officer", "Jr. Quality Inspector", "Jr. Receive Man", "Jr. Reporter", "Jr. Sample Man", "Jr. Scissor Man", "Jr. Security Guard", "Jr. Spot Man", "Jr. Sticker Man", "Jr. Store Officer", "Jr. Striper Man", "Jr. Succer Operator", "Jr. Sucker Operator", "Jr. Technician", "Jr. Wash Man", "Jr. Welder", "Jr. Welder Fitter", "Jr. Welfare Officer", "Jr. Writer", "Knitting In-Charge", "Knitting Operator", "Lab Assistant", "Label Operator", "Lathe Supervisor", "Lay Man", "Layer Man", "Leader (Loader)", "Lift Operator", "Line Chief", "Line Ironman", "Line QC", "Loader", "Logistics Officer", "Mac. Helper", "Management Representative (MIS)", "Management Trainee", "Manager", "Manager (Export & Import)", "Manager (IT)", "Manager (Printing Operations)", "Manager (Sample & Design)", "Managing Director", "Marker", "Marketing Assistant", "Marketing Officer", "Mason", "Mason Helper", "Mechanic", "Mechanical Fitter", "Mechanical Helper", "Mechanical In-charge", "Mechanical Welder Fitter", "Medical Assistant", "Medical Officer", "Merchandiser", "Merchandising Assistant", "Messenger", "Metal Detection Operator", "MIS Assistant", "MIS Officer", "Morgan Auto Spreader Operator", "Needle Detector Operator", "Needle Machin Operator", "Needle Machine Operator", "Needle Man", "Numbering Man", "Nurse", "Office Assistant", "Office Assistant (IT)", "Office Asst", "Office Boy", "Office Peon", "Office Supporting Staff", "Officer", "Officer (Accessories)", "Officer (Audit)", "Officer (Chemical)", "Officer (Color Master)", "Officer (Coordinator)", "Officer (Delivery)", "Officer (Expose)", "Officer (Fabric coordinator)", "Officer (Finished Fabric)", "Officer (General)", "Officer (GPQ)", "Officer (Grey Fabric)", "Officer (HR & Comp.)", "Officer (IT)", "Officer (Pattern Master)", "Officer (Pattern)", "Officer (QMS)", "Officer (R&D)", "Officer (Tally)", "Officer (VAT)", "Officer (Yarn Store)", "Officer (Yarn, Grey & Finished)", "Operator", "Operator (Dyeing)", "Operator (Embroidery)", "Operator (Gen. & Comp.)", "Operator (Knitting)", "Operator (Printing)", "Operator (Sewing)", "Operator (Spr. Machine)", "PA TO CEO", "Packing Auditor", "Packing List Officer", "Packing Man", "Packing Supervisor", "Painter", "Pattern Master", "Payloader Operator", "Photo Copy Operator", "Planning Manager", "Planning Officer", "Plumber", "Poly Man", "Print Co-ordinator", "Print Receive Man", "Probationary", "Process Automation Manager", "Procurement Assistant", "Procurement Officer", "Product Developer", "Product Safety Officer", "Production Associate", "Production Manager", "Production Officer", "Production Officer-(R&D)", "Production Reporter", "Project Engineer", "Purchase Officer", "Purchase Officer", "Q.A. In-charge", "QC In-charge", "QC Supervisor", "Quality Auditor", "Quality Controller", "Quality Inspector", "R&D Assistant", "Receive Asst", "Receive Man", "Receive Supervisor", "Reporter", "Reporting & Analysis Specialist", "RQS Officer", "Sales Executive", "Sales Man", "Sample Asst", "Sample Man", "Sample Officer", "Sample QC", "Sample Supervisor", "Scissor Man", "Security Guard", "Security Head", "Security In-charge", "Security Officer", "Security Supervisor", "Senior Officer", "Sewing In-charge", "Sewing Operator", "Shade Keeper", "Shaker Man", "Shaper Supervisor", "Shift In-charge", "Shift In-charge (Security)", "Shift Officer", "Shift Officer (Finishing)", "Shift Officer (Lab)", "Site Engineer", "Size Set Man", "Slitting Operator", "Spot Man", "Spot Supervisor", "Sr Store Keeper", "Sr. Assort Man", "Sr. Batch Man", "Sr. Boiler Operator", "Sr. Bundle Man", "Sr. Color Man", "Sr. Color Master", "Sr. Compliance Officer", "Sr. Cutter", "Sr. Cutter Man", "Sr. Delivery Man", "Sr. Designer", "Sr. Electrician", "Sr. Engineer", "Sr. ETP Operator", "Sr. Executive", "Sr. Executive (Admin)", "Sr. Executive (CAD)", "Sr. Executive (ETP)", "Sr. Executive (IE)", "Sr. Fire Man", "Sr. Fitter Man", "Sr. Floor In-charge", "Sr. Folding Man", "Sr. General Manager", "Sr. Generator Operator", "Sr. Helper", "Sr. In-charge", "Sr. In-charge (QA)", "Sr. Input Man", "Sr. Ironman", "Sr. Lay Man", "Sr. Layer Man", "Sr. Lift Operator", "Sr. Manager", "Sr. Manager (EMS & Energy)", "Sr. Marker", "Sr. Mechanic", "Sr. Mechanical Fitter", "Sr. Merchandiser", "Sr. Motor Wender", "Sr. Needle Man", "Sr. Officer", "Sr. Officer (Accessories)", "Sr. Officer (Admin)", "Sr. Officer (CAD)", "Sr. Officer (Chemical)", "Sr. Officer (Dining & Procurement)", "Sr. Officer (Finished Fabric)", "Sr. Officer (Fire & Safety)", "Sr. Officer (General)", "Sr. Officer (GPQ)", "Sr. Officer (Grey Fabric)", "Sr. Officer (HR & Payroll)", "Sr. Officer (HR)", "Sr. Officer (IE)", "Sr. Officer (IT)", "Sr. Officer (Pattern)", "Sr. Officer (Planning & Production)", "Sr. Officer (Recruitment)", "Sr. Officer (RQS)", "Sr. Officer (Sample)", "Sr. Officer (Security)", "Sr. Officer (Store Quality)", "Sr. Officer (Yarn Store)", "Sr. Operator", "Sr. Operator (Dyeing)", "Sr. Operator (Embroidery)", "Sr. Operator (Knitting)", "Sr. Operator (Printing)", "Sr. Operator (Sewing)", "Sr. Operator (Spr. Machine)", "Sr. Packer Man", "Sr. Packing Man", "Sr. Pattern Master", "Sr. Planning Officer", "Sr. PM", "Sr. Production Officer", "Sr. Quality Assurance", "Sr. Quality Controller", "Sr. Quality Inspector", "Sr. Receive Man", "Sr. Sample Man", "Sr. Scissor Man", "Sr. Sticker Man", "Sr. Store Officer", "Sr. Striper Man", "Sr. Supervisor", "Sr. Supervisor (Security)", "Sr. Technical Officer", "Sr. Technician", "Sr. Welfare Officer", "Sr. Writer Man", "Sr. WTP Operator", "Sr.Officer (QMS)", "Stenter Operator", "Sticker Man", "Store Asst", "Store Keeper", "Store Officer", "Store Q.C.", "Store Q.I.", "Striper Man", "Sub Asst. Engineer", "Succer Helper", "Succer Operator", "Supervisor", "Supervisor (Auto Cutter)", "Supervisor (Succer)", "Supply Chain Manager", "Sweeper", "Tally Man", "Tea Boy", "Team Leader (Size Set)", "Technical Operation", "Technician", "Technician A/C", "Telephone Operator", "Thai Mistry", "Tr. IE Officer", "Tr. Merchandiser", "Tr. Supervisor", "Trainee", "Trainee Asst. Officer", "Trainee Officer", "Trainee Officer (HR)", "Trainee Officer (IT)", "Wash Man", "Welder", "Welder Fitter", "Welder Helper", "Welfare Officer", "Work Study Officer", "Writer Man", "WTP Helper", "WTP Operator",
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

function ManageOvertimePage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const activeTab = searchParams.tab || "requisition";

  const setActiveTab = (tab: SearchParams["tab"]) => {
    navigate({ search: { tab } });
  };

  // Top Filter States for OT Requisition
  const [filterDate, setFilterDate] = useState("2026-09-13");
  const [filterToDate, setFilterToDate] = useState("2026-09-13");
  const [employeeIdFilter, setEmployeeIdFilter] = useState("");
  const [selectedEmpTypes, setSelectedEmpTypes] = useState<string[]>(["Office Executive"]);
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedUnit, setSelectedUnit] = useState("ALL");
  const [selectedLine, setSelectedLine] = useState("ALL");

  // Top Right OT Bulk Settings Widget States
  const [headerOtValue, setHeaderOtValue] = useState<number>(0);
  const [headerWLineValue, setHeaderWLineValue] = useState<string>("ALL");
  const [autoRandomTime, setAutoRandomTime] = useState<boolean>(true);

  // Search Query inside Table Toolbar
  const [tableSearch, setTableSearch] = useState("");

  // Attendance Records State
  const initialAttendance: AttendanceRecord[] = [
    {
      id: "ATT-101",
      sl: 1,
      employeeId: "2020021549",
      employeeName: "Aminur Islam",
      department: "Human Resources",
      designation: "Assistant Manager",
      unit: "N/A",
      line: "N/A",
      inDate: "13/09/2026",
      inTime: "07:42:47",
      outDate: "13/09/2026",
      outTime: "18:15:00",
      wLine: "N/A",
      calculatedOt: 0.0,
      mOtInput: 0,
      status: "Present",
      reqOtInput: "0.00",
      reqMotInput: "0",
      reasonInput: "",
    },
    {
      id: "ATT-102",
      sl: 2,
      employeeId: "2023044857",
      employeeName: "Md. Rakibul Alam Raju",
      department: "Marketing & Merchandising",
      designation: "Deputy Manager",
      unit: "Unit-05",
      line: "N/A",
      inDate: "13/09/2026",
      inTime: "08:03:56",
      outDate: "13/09/2026",
      outTime: "21:00:00",
      wLine: "Line-02",
      calculatedOt: 0.0,
      mOtInput: 0,
      status: "Present",
      reqOtInput: "0.00",
      reqMotInput: "0",
      reasonInput: "",
    },
    {
      id: "ATT-103",
      sl: 3,
      employeeId: "2023045146",
      employeeName: "Asif Hossain",
      department: "Admin",
      designation: "Driver",
      unit: "Unit-01",
      line: "Line-01",
      inDate: "13/09/2026",
      inTime: "08:30:12",
      outDate: "13/09/2026",
      outTime: "22:30:00",
      wLine: "Line-01",
      calculatedOt: 3.5,
      mOtInput: 0,
      status: "Present",
      reqOtInput: "3.50",
      reqMotInput: "0",
      reasonInput: "Factory Transport Duty",
    },
    {
      id: "ATT-104",
      sl: 4,
      employeeId: "2023043910",
      employeeName: "Tahmid Afsar Shapno",
      department: "Business Innovation",
      designation: "Asst. Manager",
      unit: "Unit-02",
      line: "N/A",
      inDate: "13/09/2026",
      inTime: "09:00:00",
      outDate: "13/09/2026",
      outTime: "20:45:00",
      wLine: "N/A",
      calculatedOt: 2.5,
      mOtInput: 0,
      status: "Present",
      reqOtInput: "2.50",
      reqMotInput: "0",
      reasonInput: "ERP Module Optimization",
    },
  ];

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendance);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // OT Requisition List Tab Filter States
  const [listStartDate, setListStartDate] = useState("2026-09-13");
  const [listEndDate, setListEndDate] = useState("2026-09-13");
  const [listStatusFilter, setListStatusFilter] = useState<"ALL" | "Pending" | "Approved" | "Rejected">("Pending");
  const [listEmpType, setListEmpType] = useState("ALL");
  const [listDepartment, setListDepartment] = useState("ALL");
  const [listJobTitle, setListJobTitle] = useState("ALL");
  const [listUnit, setListUnit] = useState("ALL");
  const [listLine, setListLine] = useState("ALL");
  const [listReqType, setListReqType] = useState<"All" | "OT" | "Allowance">("All");
  const [listEmpIdInput, setListEmpIdInput] = useState("");
  const [listTableSearch, setListTableSearch] = useState("");

  // Submit OT Req Tab Filter States (User Specification)
  const [submitReqType, setSubmitReqType] = useState<"OT" | "Allowance" | "All">("OT");
  const [submitMainDept, setSubmitMainDept] = useState("ALL");
  const [submitWLineName, setSubmitWLineName] = useState("ALL");
  const [submitOtDate, setSubmitOtDate] = useState("2026-09-13");
  const [submitTableSearch, setSubmitTableSearch] = useState("");
  const [submitSelectedIds, setSubmitSelectedIds] = useState<Set<string>>(new Set());

  // Submit OT Req Sample Items Persistence
  const initialSubmitReqItems: SubmitOTReqItem[] = [
    {
      id: "SUB-ITEM-201",
      empId: "2020021549",
      empIdOff: "OFF-1549",
      name: "Aminur Islam",
      type: "Office Executive",
      department: "Human Resources",
      designation: "Assistant Manager",
      unit: "N/A",
      line: "N/A",
      wLine: "N/A",
      date: "13/09/2026",
      inTime: "07:42:47",
      outDate: "13/09/2026",
      outTime: "18:15:00",
      otReq: 2.0,
      otType: "Regular OT",
      amount: 300.0,
      status: "Pending",
    },
    {
      id: "SUB-ITEM-202",
      empId: "2023044857",
      empIdOff: "OFF-4857",
      name: "Md. Rakibul Alam Raju",
      type: "Office Executive",
      department: "Marketing & Merchandising",
      designation: "Deputy Manager",
      unit: "Unit-05",
      line: "N/A",
      wLine: "02",
      date: "13/09/2026",
      inTime: "08:03:56",
      outDate: "13/09/2026",
      outTime: "21:00:00",
      otReq: 4.0,
      otType: "Regular OT",
      amount: 600.0,
      status: "Pending",
    },
    {
      id: "SUB-ITEM-203",
      empId: "2023045146",
      empIdOff: "OFF-5146",
      name: "Asif Hossain",
      type: "Worker",
      department: "Admin",
      designation: "Driver",
      unit: "Unit-01",
      line: "01",
      wLine: "01",
      date: "13/09/2026",
      inTime: "08:30:12",
      outDate: "13/09/2026",
      outTime: "22:30:00",
      otReq: 3.5,
      otType: "Regular OT",
      amount: 525.0,
      status: "Pending",
    },
  ];

  const [submitReqItems, setSubmitReqItems] = useState<SubmitOTReqItem[]>(initialSubmitReqItems);

  // Filtered Submit OT Req Items
  const filteredSubmitReqItems = useMemo(() => {
    return submitReqItems.filter((item) => {
      if (submitReqType !== "All" && item.otType !== submitReqType && submitReqType !== "OT") return false;
      if (submitMainDept !== "ALL" && item.department !== submitMainDept) return false;
      if (submitWLineName !== "ALL" && item.wLine !== submitWLineName) return false;
      if (submitOtDate && item.date !== submitOtDate.split("-").reverse().join("/")) {
        // match date if formatted
      }
      if (submitTableSearch.trim()) {
        const q = submitTableSearch.toLowerCase().trim();
        return (
          item.name.toLowerCase().includes(q) ||
          item.empId.toLowerCase().includes(q) ||
          item.empIdOff.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.designation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [submitReqItems, submitReqType, submitMainDept, submitWLineName, submitOtDate, submitTableSearch]);

  // OT Requisition List Data Items Persistence
  const initialRequisitionListItems: OTRequisitionListItem[] = [
    {
      id: "REQ-ITEM-101",
      empId: "2020021549",
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
      reqType: "OT",
      status: "Pending",
    },
    {
      id: "REQ-ITEM-102",
      empId: "2023044857",
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
      reqType: "OT",
      status: "Pending",
    },
    {
      id: "REQ-ITEM-103",
      empId: "2023045146",
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
      reqType: "OT",
      status: "Approved",
    },
    {
      id: "REQ-ITEM-104",
      empId: "2023043910",
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
      reqType: "OT",
      status: "Approved",
    },
  ];

  const [requisitionListItems] = useState<OTRequisitionListItem[]>(initialRequisitionListItems);

  // Filtered Items for OT Requisition List Tab
  const filteredRequisitionList = useMemo(() => {
    return requisitionListItems.filter((item) => {
      if (listStatusFilter !== "ALL" && item.status !== listStatusFilter) return false;
      if (listEmpType !== "ALL" && item.type !== listEmpType) return false;
      if (listDepartment !== "ALL" && item.department !== listDepartment) return false;
      if (listJobTitle !== "ALL" && item.designation !== listJobTitle) return false;
      if (listUnit !== "ALL" && item.unit !== listUnit) return false;
      if (listLine !== "ALL" && item.line !== listLine) return false;
      if (listReqType !== "All" && item.reqType !== listReqType) return false;
      if (listEmpIdInput.trim()) {
        const q = listEmpIdInput.toLowerCase().trim();
        if (!item.empId.toLowerCase().includes(q)) return false;
      }
      if (listTableSearch.trim()) {
        const q = listTableSearch.toLowerCase().trim();
        return (
          item.name.toLowerCase().includes(q) ||
          item.empId.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.designation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [
    requisitionListItems,
    listStatusFilter,
    listEmpType,
    listDepartment,
    listJobTitle,
    listUnit,
    listLine,
    listReqType,
    listEmpIdInput,
    listTableSearch,
  ]);

  // Submitted Records Persistence
  const [submittedRecords, setSubmittedRecords] = useState<SubmittedOTRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_submitted_ot");
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: "OT-REQ-9841",
              employeeId: "2023043910",
              employeeName: "Tahmid Afsar Shapno",
              department: "Business Innovation",
              designation: "Asst. Manager",
              otDate: "2026-09-12",
              calculatedOt: 2.5,
              reqOt: 2.5,
              reqMot: 0,
              reason: "System Integration",
              status: "Approved",
              submittedAt: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              id: "OT-REQ-9842",
              employeeId: "2023045146",
              employeeName: "Asif Hossain",
              department: "Admin",
              designation: "Driver",
              otDate: "2026-09-13",
              calculatedOt: 3.5,
              reqOt: 3.5,
              reqMot: 0,
              reason: "Late Transport Duty",
              status: "Pending",
              submittedAt: new Date().toISOString(),
            },
          ];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("cripton_submitted_ot", JSON.stringify(submittedRecords));
  }, [submittedRecords]);

  // Global Budget Pool State
  const [budgetPool] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_ot_budget");
      return saved ? parseFloat(saved) : 50000;
    }
    return 50000;
  });

  // Calculate Financials & Statistics
  const stats = useMemo(() => {
    let approvedHours = 0;
    let pendingHours = 0;
    submittedRecords.forEach((r) => {
      const total = r.reqOt + r.reqMot;
      if (r.status === "Approved") approvedHours += total;
      if (r.status === "Pending") pendingHours += total;
    });

    const approvedCost = approvedHours * 150;
    const pendingCost = pendingHours * 150;
    const remainingBalance = budgetPool - approvedCost;

    return {
      budgetPool,
      approvedHours,
      pendingHours,
      approvedCost,
      pendingCost,
      remainingBalance,
    };
  }, [submittedRecords, budgetPool]);

  // Handle Input Changes in Requisition Data Table
  const handleRecordChange = (
    id: string,
    field: keyof AttendanceRecord,
    value: string | number,
  ) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
    if (field === "reqOtInput" || field === "reqMotInput" || field === "wLine") {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    }
  };

  // Row Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(attendanceRecords.map((r) => r.id)));
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

  // Submit OT Req Row Selection Handlers
  const handleSelectAllSubmitRows = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSubmitSelectedIds(new Set(filteredSubmitReqItems.map((r) => r.id)));
    } else {
      setSubmitSelectedIds(new Set());
    }
  };

  const toggleSelectSubmitRow = (id: string) => {
    setSubmitSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Bulk Submit Handler for Submit OT Req Tab
  const handleExecuteSubmitBatch = () => {
    if (submitSelectedIds.size === 0) {
      toast.error("Please select at least one row to Submit!");
      return;
    }
    toast.success(`Successfully submitted ${submitSelectedIds.size} OT requisitions!`);
    setSubmitReqItems((prev) => prev.filter((item) => !submitSelectedIds.has(item.id)));
    setSubmitSelectedIds(new Set());
  };

  // Bulk Apply Header OT / W.Line to Selected Rows
  const handleApplyHeaderOt = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one employee row to apply header OT!");
      return;
    }
    setAttendanceRecords((prev) =>
      prev.map((r) =>
        selectedIds.has(r.id)
          ? { ...r, reqOtInput: headerOtValue.toString() }
          : r,
      ),
    );
    toast.success(`Applied ${headerOtValue} OT hours to ${selectedIds.size} selected records!`);
  };

  const handleApplyHeaderWLine = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one employee row to apply W.Line!");
      return;
    }
    setAttendanceRecords((prev) =>
      prev.map((r) =>
        selectedIds.has(r.id)
          ? { ...r, wLine: headerWLineValue }
          : r,
      ),
    );
    toast.success(`Set W.Line to "${headerWLineValue}" for ${selectedIds.size} records!`);
  };

  // Action: SUBMIT OT Requisition
  const handleSubmitRequisition = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one employee record to submit.");
      return;
    }

    const selectedRows = attendanceRecords.filter((r) => selectedIds.has(r.id));
    const newSubmissions: SubmittedOTRecord[] = [];
    let totalOtHours = 0;
    let totalMotHours = 0;

    selectedRows.forEach((row) => {
      const reqOt = parseFloat(row.reqOtInput) || 0;
      const reqMot = parseFloat(row.reqMotInput) || 0;

      totalOtHours += reqOt;
      totalMotHours += reqMot;

      newSubmissions.push({
        id: `OT-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        employeeId: row.employeeId,
        employeeName: row.employeeName,
        department: row.department,
        designation: row.designation,
        otDate: filterDate,
        calculatedOt: row.calculatedOt,
        reqOt: reqOt,
        reqMot: reqMot,
        reason: row.reasonInput || "Standard Operational Workload",
        status: "Pending",
        submittedAt: new Date().toISOString(),
      });
    });

    setSubmittedRecords((prev) => [...newSubmissions, ...prev]);

    setSelectedIds(new Set());
    toast.success(`Successfully submitted OT Requisition for ${selectedRows.length} employees!`);
    setActiveTab("submitted-list");
  };

  // Action: DELETE Selected Rows
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select records to remove from the current grid.");
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedIds.size} records from the view?`)) {
      setAttendanceRecords((prev) => prev.filter((r) => !selectedIds.has(r.id)));
      setSelectedIds(new Set());
      toast.info("Selected records removed.");
    }
  };

  // Export CSV Handler for Requisition Table
  const handleExportCSV = () => {
    const headers = [
      "SL",
      "Emp ID",
      "Name",
      "Department",
      "Designation",
      "Unit",
      "Line",
      "In Date",
      "In Time",
      "Out Date",
      "Out Time",
      "W.Line",
      "OT",
      "M_OT",
      "Status",
      "Req OT",
      "Req MOT",
    ];

    const filtered = attendanceRecords.filter((r) => {
      if (!tableSearch.trim()) return true;
      const q = tableSearch.toLowerCase();
      return (
        r.employeeName.toLowerCase().includes(q) ||
        r.employeeId.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.designation.toLowerCase().includes(q)
      );
    });

    const rows = filtered.map((r, i) => [
      (i + 1).toString(),
      r.employeeId,
      r.employeeName,
      r.department,
      r.designation,
      r.unit,
      r.line,
      r.inDate,
      r.inTime,
      r.outDate,
      r.outTime,
      r.wLine,
      r.calculatedOt.toFixed(2),
      r.mOtInput.toString(),
      r.status,
      r.reqOtInput,
      r.reqMotInput,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((val) => `"${val}"`).join(","))].join("\n");
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `OT_Requisition_${filterDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export CSV Handler for Submit OT Req Tab
  const handleExportSubmitReqCSV = () => {
    if (filteredSubmitReqItems.length === 0) {
      toast.error("No records to export.");
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
      "W.Line",
      "Date",
      "In Time",
      "Out Date",
      "Out Time",
      "OT Req",
      "OT Type",
      "Amount",
      "Status",
    ];

    const rows = filteredSubmitReqItems.map((r, index) => [
      (index + 1).toString(),
      r.empId,
      r.empIdOff,
      r.name,
      r.type,
      r.department,
      r.designation,
      r.unit,
      r.line,
      r.wLine,
      r.date,
      r.inTime,
      r.outDate,
      r.outTime,
      r.otReq.toString(),
      r.otType,
      r.amount.toFixed(2),
      r.status,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((val) => `"${val}"`).join(","))].join("\n");
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Submit_OT_Requisition_${submitOtDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export CSV Handler for OT Requisition List Tab
  const handleExportRequisitionListCSV = () => {
    if (filteredRequisitionList.length === 0) {
      toast.error("No records to export.");
      return;
    }
    const headers = [
      "#",
      "Emp ID",
      "Name",
      "Department",
      "Designation",
      "Date",
      "In Time",
      "Out Date",
      "Out Time",
      "Status",
    ];

    const rows = filteredRequisitionList.map((r, index) => [
      (index + 1).toString(),
      r.empId,
      r.name,
      r.department,
      r.designation,
      r.date,
      r.inTime,
      r.outDate,
      r.outTime,
      r.status,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((val) => `"${val}"`).join(","))].join("\n");
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `OT_Requisition_List_${listStartDate}_to_${listEndDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Attendance for Data Grid
  const filteredAttendance = useMemo(() => {
    return attendanceRecords.filter((r) => {
      if (selectedDept !== "ALL" && r.department !== selectedDept) return false;
      if (selectedUnit !== "ALL" && r.unit !== selectedUnit) return false;
      if (selectedLine !== "ALL" && r.line !== selectedLine) return false;
      if (employeeIdFilter.trim()) {
        const ids = employeeIdFilter.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
        if (ids.length > 0 && !ids.some((id) => r.employeeId.toLowerCase().includes(id))) {
          return false;
        }
      }
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase();
        return (
          r.employeeName.toLowerCase().includes(q) ||
          r.employeeId.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q) ||
          r.line.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [attendanceRecords, selectedDept, selectedUnit, selectedLine, employeeIdFilter, tableSearch]);

  // Individual Review State
  const [selectedIndividualId, setSelectedIndividualId] = useState<string>("2023043910");
  const individualEmployee = useMemo(() => {
    return attendanceRecords.find((r) => r.employeeId === selectedIndividualId) || attendanceRecords[0];
  }, [attendanceRecords, selectedIndividualId]);

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#090d16] text-foreground font-sans antialiased">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">
          {/* Header Banner */}
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest mb-1">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground">Manage Overtime</span>
                <ChevronRight className="size-2.5" />
                <span className="text-blue-600 font-semibold uppercase">
                  {activeTab.replace("-", " ")}
                </span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <Timer className="size-6 text-blue-600" />
                <span>Overtime Management Console</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Requisition overtime hours, manage department batch submissions, track approvals, and execute employee reviews.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/approve-overtime"
                className="h-9 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm uppercase tracking-wider"
              >
                <CheckCircle2 className="size-4" /> Approve OT Requisition
              </Link>
            </div>
          </div>

          {/* TAB 1: OT REQUISITION */}
          {activeTab === "requisition" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Top Section: Filters & Header Widget Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                {/* Filter Controls Panel */}
                <div className="xl:col-span-3 bg-card rounded-xl border border-border/80 p-5 shadow-xs relative overflow-hidden border-l-4 border-l-blue-600">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Date */}
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                        Date
                      </label>
                      <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-blue-500 shadow-2xs"
                      />
                    </div>

                    {/* To Date */}
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={filterToDate}
                        onChange={(e) => setFilterToDate(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-blue-500 shadow-2xs"
                      />
                    </div>

                    {/* Employee Id */}
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                        Employee Id
                      </label>
                      <input
                        type="text"
                        value={employeeIdFilter}
                        onChange={(e) => setEmployeeIdFilter(e.target.value)}
                        placeholder="use comma as separator"
                        className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-blue-500 shadow-2xs"
                      />
                    </div>

                    {/* Employee Type */}
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                        Employee Type
                      </label>
                      <div className="flex items-center gap-1.5 h-9 px-2 rounded-lg bg-background border border-border/70 overflow-x-auto scrollbar-none">
                        {selectedEmpTypes.map((type) => (
                          <span
                            key={type}
                            className="bg-muted text-foreground text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-border/50 shrink-0"
                          >
                            {type}
                            <button
                              onClick={() =>
                                setSelectedEmpTypes(selectedEmpTypes.filter((t) => t !== type))
                              }
                              className="text-muted-foreground hover:text-rose-500"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Department */}
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                        Department
                      </label>
                      <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-blue-500 shadow-2xs"
                      >
                        <option value="ALL">ALL</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Marketing & Merchandising">Marketing & Merchandising</option>
                        <option value="Business Innovation">Business Innovation</option>
                        <option value="Admin">Admin</option>
                        <option value="Production">Production</option>
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
                        className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-blue-500 shadow-2xs"
                      >
                        <option value="ALL">ALL</option>
                        <option value="Unit-01">Unit-01</option>
                        <option value="Unit-02">Unit-02</option>
                        <option value="Unit-05">Unit-05</option>
                        <option value="N/A">N/A</option>
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
                        className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-blue-500 shadow-2xs"
                      >
                        <option value="ALL">ALL</option>
                        <option value="Line-01">Line-01</option>
                        <option value="Line-02">Line-02</option>
                        <option value="N/A">N/A</option>
                      </select>
                    </div>
                  </div>

                  {/* SHOW Button */}
                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-start">
                    <button
                      onClick={() => toast.info("Attendance data loaded for the selected filters.")}
                      className="h-8.5 px-6 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-bold text-xs rounded-md shadow-xs transition uppercase tracking-wider"
                    >
                      SHOW
                    </button>
                  </div>
                </div>

                {/* Header OT Widget */}
                <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col justify-between border-l-4 border-l-emerald-600">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 items-center">
                      {/* OT Bulk Header Input */}
                      <div>
                        <span className="text-[11px] font-bold text-muted-foreground block mb-0.5">
                          OT
                        </span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={headerOtValue}
                            onChange={(e) => setHeaderOtValue(parseFloat(e.target.value) || 0)}
                            className="w-16 h-8 px-2 rounded border border-border/70 text-xs font-bold text-center bg-background"
                          />
                          <button
                            onClick={handleApplyHeaderOt}
                            className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 rounded transition"
                            title="Apply OT to Selected Rows"
                          >
                            <Pencil className="size-4" />
                          </button>
                        </div>
                      </div>

                      {/* W.Line Bulk Header Select */}
                      <div>
                        <span className="text-[11px] font-bold text-muted-foreground block mb-0.5">
                          W.Line
                        </span>
                        <div className="flex items-center gap-1">
                          <select
                            value={headerWLineValue}
                            onChange={(e) => setHeaderWLineValue(e.target.value)}
                            className="w-20 h-8 px-1.5 rounded border border-border/70 text-xs font-semibold bg-background"
                          >
                            <option value="ALL">ALL</option>
                            <option value="Line-01">Line-01</option>
                            <option value="Line-02">Line-02</option>
                            <option value="N/A">N/A</option>
                          </select>
                          <button
                            onClick={handleApplyHeaderWLine}
                            className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 rounded transition"
                            title="Apply W.Line to Selected Rows"
                          >
                            <Pencil className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Auto Random Note */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        checked={autoRandomTime}
                        onChange={(e) => setAutoRandomTime(e.target.checked)}
                        className="rounded text-blue-600"
                        id="auto-time-check"
                      />
                      <label
                        htmlFor="auto-time-check"
                        className="text-[11px] font-semibold text-blue-500 dark:text-blue-400 leading-tight cursor-pointer"
                      >
                        Time will Add auto random by +5 minutes
                      </label>
                    </div>
                  </div>

                  {/* Financial Counters */}
                  <div className="pt-3 mt-3 border-t border-border/40 text-xs space-y-1 font-bold">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Budget :</span>
                      <span className="text-foreground font-mono">৳ {stats.budgetPool.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Approved :</span>
                      <span className="text-emerald-600 font-mono">৳ {stats.approvedCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-rose-600">
                      <span>Balance :</span>
                      <span className="font-mono">৳ {stats.remainingBalance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar & Table Container */}
              <div className="bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden">
                {/* Global Action Toolbar */}
                <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 bg-muted/20">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportCSV}
                      className="h-8.5 px-3 rounded border border-border/70 bg-background hover:bg-muted text-foreground text-[11px] font-bold flex items-center gap-1.5 shadow-2xs transition"
                    >
                      <FileSpreadsheet className="size-3.5 text-emerald-600" /> EXCEL
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="h-8.5 px-3 rounded border border-border/70 bg-background hover:bg-muted text-foreground text-[11px] font-bold flex items-center gap-1.5 shadow-2xs transition"
                    >
                      <Printer className="size-3.5 text-blue-600" /> PRINT
                    </button>
                    <button
                      onClick={() => toast.info("PDF Summary downloaded.")}
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
                      className="h-8.5 px-3 w-48 sm:w-64 rounded-md border border-border/70 bg-background text-xs outline-none focus:border-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Main Attendance Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse min-w-[1100px]">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-900/90 text-foreground font-bold border-b border-border/60 text-[11px] whitespace-nowrap">
                        <th className="px-3 py-3 w-10 text-center border-r border-border/40">
                          <input
                            type="checkbox"
                            className="rounded border-border/70"
                            checked={
                              filteredAttendance.length > 0 &&
                              selectedIds.size === filteredAttendance.length
                            }
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th className="px-3 py-3 w-12 text-center border-r border-border/40">SL</th>
                        <th className="px-3 py-3 border-r border-border/40">Emp ID</th>
                        <th className="px-3 py-3 border-r border-border/40">Name</th>
                        <th className="px-3 py-3 border-r border-border/40">Department</th>
                        <th className="px-3 py-3 border-r border-border/40">Designation</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">Unit</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">Line</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">In Date</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">In Time</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">Out Date</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">Out Time</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">W.Line</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">OT</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">M_OT</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">Status</th>
                        <th className="px-3 py-3 text-center border-r border-border/40 w-20">Req OT</th>
                        <th className="px-3 py-3 text-center w-20">Req MOT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 font-sans text-xs">
                      {filteredAttendance.map((row) => {
                        const isChecked = selectedIds.has(row.id);
                        return (
                          <tr
                            key={row.id}
                            className={`transition duration-100 ${
                              isChecked
                                ? "bg-blue-50/50 dark:bg-blue-950/20"
                                : "hover:bg-muted/40"
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
                            <td className="px-3 py-2.5 text-center font-mono font-medium text-muted-foreground border-r border-border/30">
                              {row.sl}
                            </td>
                            <td className="px-3 py-2.5 font-mono font-bold text-foreground border-r border-border/30">
                              {row.employeeId}
                            </td>
                            <td className="px-3 py-2.5 font-bold text-foreground border-r border-border/30">
                              {row.employeeName}
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
                              {row.inDate}
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
                            <td className="px-3 py-2.5 text-center font-mono text-muted-foreground border-r border-border/30">
                              {row.wLine}
                            </td>
                            <td className="px-2 py-2 text-center border-r border-border/30">
                              <input
                                type="text"
                                value={row.calculatedOt > 0 ? row.calculatedOt.toFixed(2) : "0.00"}
                                onChange={(e) =>
                                  handleRecordChange(row.id, "calculatedOt", parseFloat(e.target.value) || 0)
                                }
                                className="w-16 h-7 px-1.5 rounded border border-border/70 bg-background text-xs font-bold text-center outline-none focus:border-blue-500 font-mono text-emerald-600"
                              />
                            </td>
                            <td className="px-2 py-2 text-center border-r border-border/30">
                              <input
                                type="text"
                                value={row.mOtInput}
                                onChange={(e) =>
                                  handleRecordChange(row.id, "mOtInput", parseInt(e.target.value) || 0)
                                }
                                className="w-14 h-7 px-1.5 rounded border border-border/70 bg-background text-xs font-bold text-center outline-none focus:border-blue-500 font-mono"
                              />
                            </td>
                            <td className="px-3 py-2.5 text-center border-r border-border/30">
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                {row.status}
                              </span>
                            </td>
                            <td className="px-2 py-2 text-center border-r border-border/30">
                              <input
                                type="text"
                                value={row.reqOtInput}
                                onChange={(e) =>
                                  handleRecordChange(row.id, "reqOtInput", e.target.value)
                                }
                                className="w-16 h-7 px-1.5 rounded border border-border/70 bg-background text-xs font-bold text-center outline-none focus:border-blue-500"
                              />
                            </td>
                            <td className="px-2 py-2 text-center">
                              <input
                                type="text"
                                value={row.reqMotInput}
                                onChange={(e) =>
                                  handleRecordChange(row.id, "reqMotInput", e.target.value)
                                }
                                className="w-16 h-7 px-1.5 rounded border border-border/70 bg-background text-xs font-bold text-center outline-none focus:border-blue-500"
                              />
                            </td>
                          </tr>
                        );
                      })}
                      {filteredAttendance.length === 0 && (
                        <tr>
                          <td
                            colSpan={18}
                            className="px-4 py-12 text-center text-muted-foreground font-medium"
                          >
                            No attendance entries found for the selected criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer Action Bar */}
                <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 bg-muted/10">
                  <div className="text-xs text-muted-foreground font-semibold">
                    Showing 1 to {filteredAttendance.length} of {attendanceRecords.length} entries
                    {selectedIds.size > 0 && (
                      <span className="ml-2 text-blue-600 font-bold">
                        ({selectedIds.size} selected)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSubmitRequisition}
                      disabled={selectedIds.size === 0}
                      className="h-9 px-6 bg-[#f57c00] hover:bg-[#e65100] disabled:opacity-50 text-white font-bold text-xs rounded-md shadow-xs transition uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <Send className="size-3.5" /> SUBMIT
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      disabled={selectedIds.size === 0}
                      className="h-9 px-6 bg-[#d32f2f] hover:bg-[#c62828] disabled:opacity-50 text-white font-bold text-xs rounded-md shadow-xs transition uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <Trash2 className="size-3.5" /> DELETE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OT REQUISITION LIST */}
          {activeTab === "requisition-list" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Top Filter Controls Console for OT Requisition List */}
              <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <h2 className="text-sm font-black text-foreground flex items-center gap-2">
                    <Filter className="size-4 text-blue-600" /> Filter OT Requisition List
                  </h2>
                  <button
                    onClick={() => {
                      setListStartDate("2026-09-13");
                      setListEndDate("2026-09-13");
                      setListStatusFilter("Pending");
                      setListEmpType("ALL");
                      setListDepartment("ALL");
                      setListJobTitle("ALL");
                      setListUnit("ALL");
                      setListLine("ALL");
                      setListReqType("All");
                      setListEmpIdInput("");
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
                      value={listStartDate}
                      onChange={(e) => setListStartDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-blue-500 shadow-2xs"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={listEndDate}
                      onChange={(e) => setListEndDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-blue-500 shadow-2xs"
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
                          onClick={() => setListStatusFilter(st)}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                            listStatusFilter === st
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
                      value={listEmpType}
                      onChange={(e) => setListEmpType(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-blue-500 shadow-2xs"
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
                      value={listDepartment}
                      onChange={(e) => setListDepartment(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-blue-500 shadow-2xs truncate"
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
                      value={listJobTitle}
                      onChange={(e) => setListJobTitle(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-blue-500 shadow-2xs truncate"
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
                      value={listUnit}
                      onChange={(e) => setListUnit(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-blue-500 shadow-2xs"
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
                      value={listLine}
                      onChange={(e) => setListLine(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-blue-500 shadow-2xs"
                    >
                      {LINES.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Requisition Type */}
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                      Requisition Type
                    </label>
                    <select
                      value={listReqType}
                      onChange={(e) => setListReqType(e.target.value as "All" | "OT" | "Allowance")}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-blue-500 shadow-2xs"
                    >
                      <option value="All">All</option>
                      <option value="OT">OT</option>
                      <option value="Allowance">Allowance</option>
                    </select>
                  </div>

                  {/* Employee Id */}
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                      Employee Id
                    </label>
                    <input
                      type="text"
                      value={listEmpIdInput}
                      onChange={(e) => setListEmpIdInput(e.target.value)}
                      placeholder="Filter Employee Id..."
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-blue-500 shadow-2xs"
                    />
                  </div>

                  {/* Search Action Button */}
                  <div className="flex items-end sm:col-span-2 lg:col-span-1">
                    <button
                      onClick={() => toast.success(`Loaded ${filteredRequisitionList.length} records.`)}
                      className="w-full h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-sm transition uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <Search className="size-3.5" /> Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Grid Toolbar & Table */}
              <div className="bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden">
                {/* Export Toolbar */}
                <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 bg-muted/20">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportRequisitionListCSV}
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
                      value={listTableSearch}
                      onChange={(e) => setListTableSearch(e.target.value)}
                      className="h-8.5 px-3 w-48 sm:w-64 rounded-md border border-border/70 bg-background text-xs outline-none focus:border-blue-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-900/90 text-foreground font-bold border-b border-border/60 text-[11px] whitespace-nowrap">
                        <th className="px-3 py-3 w-12 text-center border-r border-border/40">#</th>
                        <th className="px-3 py-3 border-r border-border/40">Emp ID</th>
                        <th className="px-3 py-3 border-r border-border/40">Name</th>
                        <th className="px-3 py-3 border-r border-border/40">Department</th>
                        <th className="px-3 py-3 border-r border-border/40">Designation</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">Date</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">In Time</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">Out Date</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">Out Time</th>
                        <th className="px-3 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 font-sans text-xs">
                      {filteredRequisitionList.map((row, index) => (
                        <tr key={row.id} className="hover:bg-muted/40 transition">
                          <td className="px-3 py-2.5 text-center font-mono font-medium text-muted-foreground border-r border-border/30">
                            {index + 1}
                          </td>
                          <td className="px-3 py-2.5 font-mono font-bold text-foreground border-r border-border/30">
                            {row.empId}
                          </td>
                          <td className="px-3 py-2.5 font-bold text-foreground border-r border-border/30">
                            {row.name}
                          </td>
                          <td className="px-3 py-2.5 text-muted-foreground border-r border-border/30">
                            {row.department}
                          </td>
                          <td className="px-3 py-2.5 text-muted-foreground border-r border-border/30">
                            {row.designation}
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
                      ))}
                      {filteredRequisitionList.length === 0 && (
                        <tr>
                          <td
                            colSpan={10}
                            className="px-4 py-12 text-center text-muted-foreground font-medium"
                          >
                            No data available in table
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Bar */}
                <div className="p-4 flex items-center justify-between border-t border-border/40 bg-muted/10">
                  <div className="text-xs text-muted-foreground font-semibold">
                    Showing {filteredRequisitionList.length > 0 ? 1 : 0} to {filteredRequisitionList.length} of {requisitionListItems.length} entries
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUBMIT OT REQ (EXACT ERP SPECIFICATION MATCH) */}
          {activeTab === "submit" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Top Filter Controls Console for Submit OT Req */}
              <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <h2 className="text-sm font-black text-foreground flex items-center gap-2">
                    <Filter className="size-4 text-amber-500" /> Filter Submit OT Requisition
                  </h2>
                  <button
                    onClick={() => {
                      setSubmitReqType("OT");
                      setSubmitMainDept("ALL");
                      setSubmitWLineName("ALL");
                      setSubmitOtDate("2026-09-13");
                      setSubmitTableSearch("");
                      toast.info("Filters reset to default.");
                    }}
                    className="text-[11px] font-bold text-rose-500 hover:underline"
                  >
                    Reset Filters
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 text-xs">
                  {/* Requisition Type */}
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                      Requisition Type
                    </label>
                    <select
                      value={submitReqType}
                      onChange={(e) => setSubmitReqType(e.target.value as "OT" | "Allowance" | "All")}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-amber-500 shadow-2xs"
                    >
                      <option value="OT">OT</option>
                      <option value="Allowance">Allowance</option>
                      <option value="All">All</option>
                    </select>
                  </div>

                  {/* Main Department */}
                  <div className="sm:col-span-2 lg:col-span-2">
                    <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                      Main Department
                    </label>
                    <select
                      value={submitMainDept}
                      onChange={(e) => setSubmitMainDept(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-amber-500 shadow-2xs truncate"
                    >
                      {MAIN_DEPARTMENTS.map((md) => (
                        <option key={md} value={md}>
                          {md}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* W.Line Name */}
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                      W.Line Name
                    </label>
                    <select
                      value={submitWLineName}
                      onChange={(e) => setSubmitWLineName(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-amber-500 shadow-2xs"
                    >
                      {LINES.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* OT Date * */}
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                      OT Date *
                    </label>
                    <input
                      type="date"
                      value={submitOtDate}
                      onChange={(e) => setSubmitOtDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>

                  {/* Search Action Button */}
                  <div className="flex items-end sm:col-span-2 lg:col-span-1">
                    <button
                      onClick={() => toast.success(`Loaded ${filteredSubmitReqItems.length} records for submission.`)}
                      className="w-full h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-sm transition uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <Search className="size-3.5" /> Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Grid Toolbar & Table */}
              <div className="bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden">
                {/* Export Toolbar (Excel, Print, PDF & Search) */}
                <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 bg-muted/20">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportSubmitReqCSV}
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
                      value={submitTableSearch}
                      onChange={(e) => setSubmitTableSearch(e.target.value)}
                      className="h-8.5 px-3 w-48 sm:w-64 rounded-md border border-border/70 bg-background text-xs outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Data Grid Table Matching User's Specified Column Structure */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse min-w-[1250px]">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-900/90 text-foreground font-bold border-b border-border/60 text-[11px] whitespace-nowrap">
                        <th className="px-3 py-3 w-10 text-center border-r border-border/40">
                          <input
                            type="checkbox"
                            className="rounded border-border/70"
                            checked={
                              filteredSubmitReqItems.length > 0 &&
                              submitSelectedIds.size === filteredSubmitReqItems.length
                            }
                            onChange={handleSelectAllSubmitRows}
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
                        <th className="px-3 py-3 text-center border-r border-border/40">W.Line</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">Date</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">In Time</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">Out Date</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">Out Time</th>
                        <th className="px-3 py-3 text-center border-r border-border/40 font-mono">OT Req</th>
                        <th className="px-3 py-3 text-center border-r border-border/40">OT Type</th>
                        <th className="px-3 py-3 text-right border-r border-border/40 font-mono">Amount</th>
                        <th className="px-3 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 font-sans text-xs">
                      {filteredSubmitReqItems.map((row) => {
                        const isChecked = submitSelectedIds.has(row.id);
                        return (
                          <tr
                            key={row.id}
                            className={`transition duration-100 ${
                              isChecked ? "bg-amber-50/50 dark:bg-amber-950/20" : "hover:bg-muted/40"
                            }`}
                          >
                            <td className="px-3 py-2.5 text-center border-r border-border/30">
                              <input
                                type="checkbox"
                                className="rounded border-border/70"
                                checked={isChecked}
                                onChange={() => toggleSelectSubmitRow(row.id)}
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
                            <td className="px-3 py-2.5 text-center font-mono text-muted-foreground border-r border-border/30">
                              {row.wLine}
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
                            <td className="px-3 py-2.5 text-center font-semibold border-r border-border/30">
                              {row.otType}
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
                      {filteredSubmitReqItems.length === 0 && (
                        <tr>
                          <td
                            colSpan={18}
                            className="px-4 py-12 text-center text-muted-foreground font-medium"
                          >
                            No data available in table
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Action Bar (Submit Button) */}
                <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 bg-muted/10">
                  <div className="text-xs text-muted-foreground font-semibold">
                    Showing {filteredSubmitReqItems.length > 0 ? 1 : 0} to {filteredSubmitReqItems.length} of {submitReqItems.length} entries
                    {submitSelectedIds.size > 0 && (
                      <span className="ml-2 text-amber-600 font-bold">
                        ({submitSelectedIds.size} selected)
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleExecuteSubmitBatch}
                    disabled={submitSelectedIds.size === 0}
                    className="h-9 px-6 bg-[#f57c00] hover:bg-[#e65100] disabled:opacity-50 text-white font-bold text-xs rounded-md shadow-xs transition uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Send className="size-3.5" /> SUBMIT
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SUBMITTED OT LIST */}
          {activeTab === "submitted-list" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-border/40 bg-muted/10">
                  <h2 className="text-sm font-black text-foreground">Submitted OT Requests Ledger</h2>
                  <button
                    onClick={() => window.print()}
                    className="h-8.5 px-3 rounded border border-border/70 bg-background hover:bg-muted text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="size-3.5" /> Print Ledger
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/40 text-foreground font-bold border-b border-border/60 text-[11px]">
                        <th className="px-4 py-3">Req ID</th>
                        <th className="px-4 py-3">Employee Details</th>
                        <th className="px-4 py-3 text-center">OT Date</th>
                        <th className="px-4 py-3 text-center">Requested Hours</th>
                        <th className="px-4 py-3 text-center">Submitted At</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {submittedRecords.map((row) => (
                        <tr key={row.id} className="hover:bg-muted/30 transition">
                          <td className="px-4 py-3 font-mono font-bold text-foreground/70">{row.id}</td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-foreground">{row.employeeName}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">{row.employeeId} • {row.department}</div>
                          </td>
                          <td className="px-4 py-3 text-center font-mono">{row.otDate}</td>
                          <td className="px-4 py-3 text-center font-bold text-sm">{row.reqOt + row.reqMot} hrs</td>
                          <td className="px-4 py-3 text-center font-mono text-muted-foreground">
                            {new Date(row.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-center">
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
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                setSubmittedRecords((prev) => prev.filter((r) => r.id !== row.id));
                                toast.info("Request cancelled.");
                              }}
                              className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                              title="Cancel Request"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: INDIVIDUAL OT REVIEW */}
          {activeTab === "individual-review" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-card rounded-xl border border-border/80 shadow-xs p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
                  <div>
                    <h2 className="text-base font-black text-foreground flex items-center gap-2">
                      <UserCheck className="size-5 text-blue-600" />
                      Individual Overtime Review
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Inspect single employee punch records, system OT vs manager requested OT, and attendance history.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedIndividualId}
                      onChange={(e) => setSelectedIndividualId(e.target.value)}
                      className="h-9 px-3 rounded-lg border border-border/70 bg-background text-xs font-bold outline-none"
                    >
                      {attendanceRecords.map((r) => (
                        <option key={r.employeeId} value={r.employeeId}>
                          {r.employeeName} ({r.employeeId})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => window.print()}
                      className="h-9 px-4 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Printer className="size-3.5" /> Print Card
                    </button>
                  </div>
                </div>

                {/* Profile Card */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/20 border border-border/60">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Employee Name</span>
                    <div className="text-sm font-black text-foreground mt-0.5">{individualEmployee.employeeName}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Employee ID</span>
                    <div className="text-sm font-mono font-bold text-blue-600 mt-0.5">{individualEmployee.employeeId}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Department & Designation</span>
                    <div className="text-sm font-semibold text-foreground mt-0.5">
                      {individualEmployee.department} • {individualEmployee.designation}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Assigned Shift</span>
                    <div className="text-sm font-mono font-semibold text-foreground mt-0.5">General (08:00 AM - 05:00 PM)</div>
                  </div>
                </div>

                {/* Ledger for Individual */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/40 text-foreground font-bold border-b border-border/60">
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-center">In Time</th>
                        <th className="px-4 py-3 text-center">Out Time</th>
                        <th className="px-4 py-3 text-center">Sys OT</th>
                        <th className="px-4 py-3 text-center">Req OT</th>
                        <th className="px-4 py-3 text-center">Req MOT</th>
                        <th className="px-4 py-3">Reason / Remarks</th>
                        <th className="px-4 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 font-sans">
                      <tr className="hover:bg-muted/20">
                        <td className="px-4 py-3 font-mono">{individualEmployee.inDate}</td>
                        <td className="px-4 py-3 text-center font-mono">{individualEmployee.inTime}</td>
                        <td className="px-4 py-3 text-center font-mono">{individualEmployee.outTime}</td>
                        <td className="px-4 py-3 text-center font-mono font-bold text-emerald-600">
                          {individualEmployee.calculatedOt.toFixed(2)} hrs
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-bold">{individualEmployee.reqOtInput} hrs</td>
                        <td className="px-4 py-3 text-center font-mono font-bold">{individualEmployee.reqMotInput} hrs</td>
                        <td className="px-4 py-3 text-muted-foreground">{individualEmployee.reasonInput || "General Operations"}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            Present
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
