import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  ChevronRight,
  UserPlus,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  X,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { HRReportPdfModal, ColumnDef } from "@/components/hr-reports/HRReportPdfModal";

export const Route = createFileRoute("/hr-report-employee-info-compliance")({
  head: () => ({
    meta: [
      { title: "Employee Info (Compliance) Report — CRIPTON HRIS" },
      {
        name: "description",
        content: "Generate and export comprehensive new joining employee reports.",
      },
    ],
  }),
  component: EmployeeInfoComplianceReportPage,
});

export interface ComplianceRecord {
  sl: number;
  id: string;
  empIdOffc: string;
  name: string;
  type: string;
  department: string;
  section: string;
  designationGroup: string;
  designation: string;
  unit: string;
  line: string;
  grade: string;
  jobNature: string;
  dutyShift: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  religion: string;
  nomineeName: string;
  nomineeRelation: string;
  emergencyContact: string;
  presentAddress: string;
  permanentAddress: string;
  maritalStatus: string;
  status: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  joiningDate: string;
  basicSalary: number;
  grossSalary: number;
  accountNumber: string;
}

const INITIAL_DATA: ComplianceRecord[] = [
  {
    sl: 1,
    id: "2026061937",
    empIdOffc: "2026061937",
    name: "Md. Jahidul Islam",
    type: "Office Executive",
    department: "Implementation & Business Analysis",
    section: "HR Team",
    designationGroup: "Officer",
    designation: "Executive",
    unit: "PSL",
    line: "N/A",
    grade: "None",
    jobNature: "Permanent",
    dutyShift: "PSL-EX",
    fatherName: "Md. Rafiqul Islam",
    motherName: "Sima Begum",
    spouseName: "Rubyat Binte Hassan",
    religion: "Islam",
    nomineeName: "Rubyat Binte Hassan",
    nomineeRelation: "Wife",
    emergencyContact: "01772625585",
    presentAddress: "শান্তিনগর, হাতিরঝিল, ঢাকা, ঢাকা",
    permanentAddress: "ফতুল্লা, ফতুল্লা, নারায়ণগঞ্জ, ঢাকা",
    maritalStatus: "Married",
    status: "Working",
    dateOfBirth: "10/11/1995",
    gender: "Male",
    bloodGroup: "A (+ve)",
    joiningDate: "20/09/2026",
    basicSalary: 21000.0,
    grossSalary: 35000.0,
    accountNumber: "1501204859001",
  },
  {
    sl: 2,
    id: "2025054609",
    empIdOffc: "2025054609",
    name: "Md Mahir Shahriyar",
    type: "Office Executive",
    department: "Business Innovation",
    section: "Project Resource & Strategy",
    designationGroup: "Officer",
    designation: "Jr. Executive",
    unit: "PSL",
    line: "N/A",
    grade: "None",
    jobNature: "Permanent",
    dutyShift: "PSL-EX",
    fatherName: "Md Abdur Rouf",
    motherName: "Mst. Khadiza Begum",
    spouseName: "N/A",
    religion: "Islam",
    nomineeName: "Md Abdur Rouf",
    nomineeRelation: "Father",
    emergencyContact: "01740820000",
    presentAddress: "H#44/23, Jigatala TSO, Dhanmondi, Dhaka",
    permanentAddress: "262 Purandapur Parbazar, Jhikargachha, Khulna",
    maritalStatus: "Unmarried",
    status: "Working",
    dateOfBirth: "21/10/1996",
    gender: "Male",
    bloodGroup: "B (+ve)",
    joiningDate: "15/03/2025",
    basicSalary: 27000.0,
    grossSalary: 45000.0,
    accountNumber: "2050148293011",
  },
  {
    sl: 3,
    id: "2026090102",
    empIdOffc: "2026090102",
    name: "Nusrat Jahan",
    type: "Office Executive",
    department: "Software Development",
    section: "Frontend Architecture",
    designationGroup: "Management",
    designation: "Sr. Executive",
    unit: "PSL",
    line: "N/A",
    grade: "Grade 2",
    jobNature: "Permanent",
    dutyShift: "PSL-EX",
    fatherName: "Anwar Hossain",
    motherName: "Farida Yasmin",
    spouseName: "Tariqul Islam",
    religion: "Islam",
    nomineeName: "Tariqul Islam",
    nomineeRelation: "Husband",
    emergencyContact: "01819234567",
    presentAddress: "House 12, Road 4, Uttara, Dhaka",
    permanentAddress: "Vill: Kazipur, PS: Sirajganj Sadar, Sirajganj",
    maritalStatus: "Married",
    status: "Working",
    dateOfBirth: "05/04/1993",
    gender: "Female",
    bloodGroup: "O (+ve)",
    joiningDate: "01/09/2026",
    basicSalary: 33000.0,
    grossSalary: 55000.0,
    accountNumber: "1102938475601",
  },
  {
    sl: 4,
    id: "2026090511",
    empIdOffc: "2026090511",
    name: "Tanvir Ahmed",
    type: "Office Executive",
    department: "Accounts & Finance",
    section: "Payroll Audit",
    designationGroup: "Staff",
    designation: "Officer",
    unit: "PSL",
    line: "N/A",
    grade: "None",
    jobNature: "Probationary",
    dutyShift: "PSL-EX",
    fatherName: "Mustafizur Rahman",
    motherName: "Laila Arjumand",
    spouseName: "N/A",
    religion: "Islam",
    nomineeName: "Mustafizur Rahman",
    nomineeRelation: "Father",
    emergencyContact: "01912345678",
    presentAddress: "Mirpur 10, Block C, Dhaka",
    permanentAddress: "Sadar Road, Barishal Sadar, Barishal",
    maritalStatus: "Unmarried",
    status: "Working",
    dateOfBirth: "12/08/1998",
    gender: "Male",
    bloodGroup: "AB (+ve)",
    joiningDate: "05/09/2026",
    basicSalary: 16800.0,
    grossSalary: 28000.0,
    accountNumber: "1402938471092",
  },
  {
    sl: 5,
    id: "2026091244",
    empIdOffc: "2026091244",
    name: "Mst. Farhana Akter",
    type: "Office Executive",
    department: "Human Resources",
    section: "Talent Acquisition",
    designationGroup: "Management",
    designation: "Assistant Manager",
    unit: "PSL",
    line: "N/A",
    grade: "Grade 1",
    jobNature: "Permanent",
    dutyShift: "PSL-EX",
    fatherName: "Khorshed Alam",
    motherName: "Razia Khatun",
    spouseName: "Monirul Islam",
    religion: "Islam",
    nomineeName: "Monirul Islam",
    nomineeRelation: "Husband",
    emergencyContact: "01711223344",
    presentAddress: "Gulshan 1, Avenue 3, Dhaka",
    permanentAddress: "Main Road, Comilla Sadar, Comilla",
    maritalStatus: "Married",
    status: "Working",
    dateOfBirth: "18/02/1991",
    gender: "Female",
    bloodGroup: "A (-ve)",
    joiningDate: "12/09/2026",
    basicSalary: 36000.0,
    grossSalary: 60000.0,
    accountNumber: "1702938471203",
  },
  {
    sl: 6,
    id: "2026091889",
    empIdOffc: "2026091889",
    name: "Sk. Ariful Islam",
    type: "Office Executive",
    department: "IT Infrastructure",
    section: "DevOps & Cloud",
    designationGroup: "Officer",
    designation: "System Administrator",
    unit: "PSL",
    line: "N/A",
    grade: "None",
    jobNature: "Permanent",
    dutyShift: "PSL-EX",
    fatherName: "Sk. Nazrul Islam",
    motherName: "Salma Begum",
    spouseName: "N/A",
    religion: "Islam",
    nomineeName: "Sk. Nazrul Islam",
    nomineeRelation: "Father",
    emergencyContact: "01678901234",
    presentAddress: "Banani, Block F, Dhaka",
    permanentAddress: "Sonadanga, Khulna Sadar, Khulna",
    maritalStatus: "Unmarried",
    status: "Working",
    dateOfBirth: "30/06/1996",
    gender: "Male",
    bloodGroup: "O (+ve)",
    joiningDate: "18/09/2026",
    basicSalary: 30000.0,
    grossSalary: 50000.0,
    accountNumber: "1902938481239",
  },
];

const STATUS_OPTIONS = [
  "Working",
  "Resigned",
  "Removed",
  "Dismissed",
  "Retired",
  "Terminated",
  "Show Caused",
  "Warning",
  "Suspension(Half pay)",
  "Suspension(Full pay)",
  "Appointment Letter Issue",
  "Lefty",
  "Maternity Pause",
  "Discharged",
  "In-Active",
  "Dead",
  "Retrenchment",
  "Transfer",
];

export function EmployeeInfoComplianceReportPage() {
  // Filter States
  
  
  const [department, setDepartment] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [gender, setGender] = useState("ALL");
  const [bloodGroup, setBloodGroup] = useState("ALL");
  const [status, setStatus] = useState("Working");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [grade, setGrade] = useState("ALL");
  const [religion, setReligion] = useState("ALL");
  const [joiningDateFrom, setJoiningDateFrom] = useState("2026-08-27");
  const [joiningDateTo, setJoiningDateTo] = useState("2026-09-26");
  const [grossFrom, setGrossFrom] = useState("");
  const [grossTo, setGrossTo] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [idType, setIdType] = useState<"System" | "Office">("System");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [tableSearch, setTableSearch] = useState("");

  // Modal / Preview state
  const [selectedRecord, setSelectedRecord] = useState<ComplianceRecord | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isReportPdfModalOpen, setIsReportPdfModalOpen] = useState(false);

  const pdfColumns: ColumnDef<ComplianceRecord>[] = [
    { header: "SL", accessor: (_, idx) => idx + 1, align: "center", width: "40px" },
    { header: "ID", accessor: (r) => r.id, align: "center" },
    { header: "Name", accessor: (r) => r.name },
    { header: "Employee Type", accessor: (r) => r.type },
    { header: "Department", accessor: (r) => r.department },
    { header: "Designation", accessor: (r) => r.designation },
    { header: "Join Date", accessor: (r) => r.joiningDate, align: "center" },
    { header: "Gross Salary (৳)", accessor: (r) => r.grossSalary, align: "right" },
    { header: "Emergency Contact", accessor: (r) => r.emergencyContact, align: "center" },
    { header: "Status", accessor: (r) => r.status, align: "center" },
  ];

  // Applied filter trigger
  const [appliedFilters, setAppliedFilters] = useState({
    
    
    department: "ALL",
    section: "ALL",
    designation: "ALL",
    gender: "ALL",
    bloodGroup: "ALL",
    status: "Working",
    unit: "ALL",
    line: "ALL",
    grade: "ALL",
    religion: "ALL",
    joiningDateFrom: "2026-08-27",
    joiningDateTo: "2026-09-26",
    grossFrom: "",
    grossTo: "",
    employeeId: "",
    idType: "System",
    employeeType: "ALL",
  });

  const handleSearch = () => {
    setAppliedFilters({
      
      department,
      section,
      designation,
      gender,
      bloodGroup,
      status,
      unit,
      line,
      grade,
      religion,
      joiningDateFrom,
      joiningDateTo,
      grossFrom,
      grossTo,
      employeeId,
      idType,
      employeeType,
    });
    toast.success("Filtering Employee Info (Compliance) Report...");
  };

  const handleReset = () => {
    setDepartment("ALL");
    setSection("ALL");
    setDesignation("ALL");
    setGender("ALL");
    setBloodGroup("ALL");
    setStatus("Working");
    setUnit("ALL");
    setLine("ALL");
    setGrade("ALL");
    setReligion("ALL");
    setJoiningDateFrom("2026-08-27");
    setJoiningDateTo("2026-09-26");
    setGrossFrom("");
    setGrossTo("");
    setEmployeeId("");
    setIdType("System");
    setEmployeeType("ALL");
    setTableSearch("");
    setAppliedFilters({
      
      
      department: "ALL",
      section: "ALL",
      designation: "ALL",
      gender: "ALL",
      bloodGroup: "ALL",
      status: "Working",
      unit: "ALL",
      line: "ALL",
      grade: "ALL",
      religion: "ALL",
      joiningDateFrom: "2026-08-27",
      joiningDateTo: "2026-09-26",
      grossFrom: "",
      grossTo: "",
      employeeId: "",
      idType: "System",
      employeeType: "ALL",
    });
    toast.info("Filter criteria reset to default.");
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return INITIAL_DATA.filter((item) => {
      if (appliedFilters.department !== "ALL" && item.department !== appliedFilters.department) return false;
      if (appliedFilters.section !== "ALL" && item.section !== appliedFilters.section) return false;
      if (appliedFilters.designation !== "ALL" && item.designation !== appliedFilters.designation) return false;
      if (appliedFilters.gender !== "ALL" && item.gender !== appliedFilters.gender) return false;
      if (appliedFilters.bloodGroup !== "ALL" && item.bloodGroup !== appliedFilters.bloodGroup) return false;
      if (appliedFilters.status !== "ALL" && false /* removed status */) return false;
      if (appliedFilters.unit !== "ALL" && item.unit !== appliedFilters.unit) return false;
      if (appliedFilters.employeeType !== "ALL" && item.type !== appliedFilters.employeeType) return false;
      
      if (appliedFilters.grossFrom && item.currentSalary < Number(appliedFilters.grossFrom)) return false;
      if (appliedFilters.grossTo && item.currentSalary > Number(appliedFilters.grossTo)) return false;

      if (appliedFilters.employeeId) {
        const idToCompare = appliedFilters.idType === "System" ? item.id : item.id;
        if (!idToCompare.toLowerCase().includes(appliedFilters.employeeId.toLowerCase())) return false;
      }

      if (tableSearch) {
        const query = tableSearch.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchId = item.id.includes(query) || item.id.includes(query);
        const matchDept = item.department.toLowerCase().includes(query);
        const matchDesig = item.designation.toLowerCase().includes(query);
        if (!matchName && !matchId && !matchDept && !matchDesig) return false;
      }

      return true;
    });
  }, [appliedFilters, tableSearch]);

  const handleExportExcel = () => {
    const headers = [
  "SL", "ID", "Name", "Type", "Department", "Sub Department", "Designation Group",
  "Designation", "Unit", "Line", "Grade", "Date of Birth", "Gender", "Blood Group",
  "Joining Date", "Current Salary"
];

    const csvRows = filteredData.map((r, i) => [
  (i + 1).toString(),
  r.id,
  r.name,
  r.type,
  r.department,
  r.section,
  r.designationGroup,
  r.designation,
  r.unit,
  r.line,
  r.grade,
  r.dateOfBirth,
  r.gender,
  r.bloodGroup,
  r.joiningDate,
  r.currentSalary.toFixed(2),
]);

    const csvContent = [
      headers.join(","),
      ...csvRows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `New_Joining_Info_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel report exported successfully!");
  };

  const handlePrint = () => {
    toast.info("Opening browser print dialog...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleViewPdf = (record?: ComplianceRecord) => {
    setSelectedRecord(record || filteredData[0] || null);
    setIsPdfModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 max-w-[1700px] mx-auto w-full">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <Link to="/hr-reports" className="hover:text-primary transition-colors">
              HR Reports
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              Employee Info (Compliance)
            </span>
          </div>

          {/* Page Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400">
                <UserPlus className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Employee Info (Compliance) Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Filter, view, and export comprehensive new joiner employee profiles & onboarding dossiers.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                <RefreshCw className="size-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>

          {/* Comprehensive Search & Filter Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <SlidersHorizontal className="size-4" />
              <span>Search & Filter Criteria</span>
            </div>

            {/* Filter Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 text-xs">
              {/* 1. Employee Type */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Employee Type
                </label>
                <select
                  value={employeeType}
                  onChange={(e) => setEmployeeType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL Types</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Probationary">Probationary</option>
                  <option value="Contractual">Contractual</option>
                </select>
              </div>

              

              {/* 3. Department */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">All Departments</option>
                  <option value="Implementation & Business Analysis">
                    Implementation & Business Analysis
                  </option>
                  <option value="Business Innovation">Business Innovation</option>
                  <option value="Software Development">Software Development</option>
                  <option value="Accounts & Finance">Accounts & Finance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="IT Infrastructure">IT Infrastructure</option>
                </select>
              </div>

              {/* 4. Section */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Section
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL Sections</option>
                  <option value="HR Team">HR Team</option>
                  <option value="Project Resource & Strategy">Project Resource & Strategy</option>
                  <option value="Frontend Architecture">Frontend Architecture</option>
                  <option value="Payroll Audit">Payroll Audit</option>
                  <option value="Talent Acquisition">Talent Acquisition</option>
                </select>
              </div>

              {/* 5. Designation */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Designation
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL Designations</option>
                  <option value="Executive">Executive</option>
                  <option value="Jr. Executive">Jr. Executive</option>
                  <option value="Sr. Executive">Sr. Executive</option>
                  <option value="Officer">Officer</option>
                  <option value="Assistant Manager">Assistant Manager</option>
                  <option value="System Administrator">System Administrator</option>
                </select>
              </div>

              {/* 6. Gender */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* 7. Blood Group */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="A (+ve)">A (+ve)</option>
                  <option value="B (+ve)">B (+ve)</option>
                  <option value="O (+ve)">O (+ve)</option>
                  <option value="AB (+ve)">AB (+ve)</option>
                  <option value="A (-ve)">A (-ve)</option>
                </select>
              </div>

              {/* 8. Status */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL Statuses</option>
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* 9. Unit */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL Units</option>
                  <option value="PSL">PSL</option>
                </select>
              </div>

              {/* 10. Line */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Line
                </label>
                <select
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL Lines</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>

              {/* 11. Grade */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Grade
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL Grades</option>
                  <option value="None">None</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                </select>
              </div>

              {/* 12. Religion */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Religion
                </label>
                <select
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="Islam">Islam</option>
                  <option value="Hinduism">Hinduism</option>
                  <option value="Christianity">Christianity</option>
                  <option value="Buddhism">Buddhism</option>
                </select>
              </div>

              {/* 13. Joining Date From */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Joining Date From
                </label>
                <input
                  type="date"
                  value={joiningDateFrom}
                  onChange={(e) => setJoiningDateFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* 14. Joining Date To */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Joining Date To
                </label>
                <input
                  type="date"
                  value={joiningDateTo}
                  onChange={(e) => setJoiningDateTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* 15. Gross From */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Gross From
                </label>
                <input
                  type="number"
                  placeholder="Min Salary"
                  value={grossFrom}
                  onChange={(e) => setGrossFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* 16. Gross To */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Gross To
                </label>
                <input
                  type="number"
                  placeholder="Max Salary"
                  value={grossTo}
                  onChange={(e) => setGrossTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* 17. Employee Id + Radio Type */}
              <div className="space-y-1 col-span-1 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Employee Id
                  </label>
                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="idType"
                        checked={idType === "System"}
                        onChange={() => setIdType("System")}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>System</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="idType"
                        checked={idType === "Office"}
                        onChange={() => setIdType("Office")}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Office</span>
                    </label>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Search by Employee ID..."
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* 18. Employee Type */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Employee Type
                </label>
                <select
                  value={employeeType}
                  onChange={(e) => setEmployeeType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL Types</option>
                  <option value="Office Executive">Office Executive</option>
                  <option value="Factory Worker">Factory Worker</option>
                </select>
              </div>
            </div>

            {/* Search Trigger Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95"
              >
                <Search className="size-4" />
                <span>SEARCH REPORT</span>
              </button>
            </div>
          </div>

          {/* Action Toolbar & Results Table Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Toolbar Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              {/* Quick Export Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <FileSpreadsheet className="size-4" />
                  <span>EXCEL</span>
                </button>

                <button
                  onClick={() => setIsReportPdfModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <Printer className="size-4" />
                  <span>PRINT</span>
                </button>

                <button
                  onClick={() => setIsReportPdfModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-300 dark:border-rose-800/80 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <FileText className="size-4" />
                  <span>PDF</span>
                </button>
              </div>

              {/* Instant Search Box */}
              <div className="flex items-center gap-2 w-full sm:w-72">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Search:
                </span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Search in table..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-[11px] text-left border-collapse min-w-[3200px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-2.5 w-12 text-center">SL</th>
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Emp ID(Offc)</th>
                    <th className="p-2.5">Name</th>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5">Department</th>
                    <th className="p-2.5">Section</th>
                    <th className="p-2.5">Designation Group</th>
                    <th className="p-2.5">Designation</th>
                    <th className="p-2.5">Unit</th>
                    <th className="p-2.5">Line</th>
                    <th className="p-2.5">Grade</th>
                    <th className="p-2.5">Job Nature</th>
                    <th className="p-2.5">Duty Shift</th>
                    <th className="p-2.5">Father Name</th>
                    <th className="p-2.5">Mother Name</th>
                    <th className="p-2.5">Spouse Name</th>
                    <th className="p-2.5">Religion</th>
                    <th className="p-2.5">Nominee Name</th>
                    <th className="p-2.5">Nominee Relation</th>
                    <th className="p-2.5">Emergency Contact</th>
                    <th className="p-2.5">Present Address</th>
                    <th className="p-2.5">Permanent Address</th>
                    <th className="p-2.5">Marital Status</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Date of Birth</th>
                    <th className="p-2.5">Gender</th>
                    <th className="p-2.5">Blood Group</th>
                    <th className="p-2.5">Joining Date</th>
                    <th className="p-2.5 text-right">Basic Salary</th>
                    <th className="p-2.5 text-right">Gross Salary</th>
                    <th className="p-2.5">Account Number</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredData.length > 0 ? (
                    filteredData.map((row, idx) => (
                      <tr
                        key={row.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {row.id}
                        </td>
                        <td className="p-2.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {row.empIdOffc}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                          {row.name}
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">{row.type}</td>
                        <td className="p-2.5 text-slate-800 dark:text-slate-200 font-semibold">
                          {row.department}
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">{row.section}</td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {row.designationGroup}
                        </td>
                        <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">
                          {row.designation}
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">{row.unit}</td>
                        <td className="p-2.5 text-slate-500">{row.line}</td>
                        <td className="p-2.5 text-slate-500">{row.grade}</td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">{row.jobNature}</td>
                        <td className="p-2.5 font-mono text-slate-600 dark:text-slate-300">
                          {row.dutyShift}
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">{row.fatherName}</td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">{row.motherName}</td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">{row.spouseName}</td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">{row.religion}</td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">{row.nomineeName}</td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {row.nomineeRelation}
                        </td>
                        <td className="p-2.5 font-mono text-rose-600 dark:text-rose-400 font-bold">
                          {row.emergencyContact}
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                          {row.presentAddress}
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                          {row.permanentAddress}
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">{row.maritalStatus}</td>
                        <td className="p-2.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                            {row.status}
                          </span>
                        </td>
                        <td className="p-2.5 font-mono text-slate-600 dark:text-slate-300">
                          {row.dateOfBirth}
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">{row.gender}</td>
                        <td className="p-2.5 font-bold text-rose-600 dark:text-rose-400">
                          {row.bloodGroup}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                          {row.joiningDate}
                        </td>
                        <td className="p-2.5 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {row.basicSalary.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {row.grossSalary.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-2.5 font-mono text-slate-600 dark:text-slate-300">
                          {row.accountNumber}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={32} className="p-8 text-center text-slate-400 dark:text-slate-500">
                        No matching new joining records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Bottom Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing 1 to {filteredData.length} of {filteredData.length} entries
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleViewPdf()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Eye className="size-3.5" />
                  <span>VIEW (PDF)</span>
                </button>

                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-600 hover:bg-lime-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5" />
                  <span>EXPORT (EXCEL)</span>
                </button>

                <div className="flex items-center gap-1 text-xs">
                  <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">
                    Previous
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold">
                    1
                  </button>
                  <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* PDF View / Report Slip Modal */}
      {isPdfModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6 relative">
            <button
              onClick={() => setIsPdfModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="size-4" />
            </button>

            {/* Official Report Slip Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 text-center space-y-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
                PAKIZA SOFTWARE LIMITED
              </h2>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                NEW JOINING PERSONNEL DOSSIER REPORT
              </p>
              <p className="text-[11px] text-slate-400">Generated: {new Date().toLocaleDateString()}</p>
            </div>

            {/* Report Content */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                    EMPLOYEE NAME
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {selectedRecord.name}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                    EMP ID (OFFICE)
                  </span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                    {selectedRecord.empIdOffc}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                    DEPARTMENT
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedRecord.department}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                    DESIGNATION
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedRecord.designation}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                    JOINING DATE
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedRecord.joiningDate}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                    GROSS SALARY
                  </span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                    ৳ {selectedRecord.grossSalary.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Personal & Emergency Details */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <h4 className="font-extrabold uppercase text-slate-500 text-[10px] tracking-wider">
                  PARENTS & EMERGENCY CONTACT
                </h4>
                <div className="grid grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-slate-400">Father:</span> {selectedRecord.fatherName}
                  </div>
                  <div>
                    <span className="text-slate-400">Mother:</span> {selectedRecord.motherName}
                  </div>
                  <div>
                    <span className="text-slate-400">Emergency Contact:</span>{" "}
                    <span className="font-mono font-bold text-rose-600">
                      {selectedRecord.emergencyContact}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Blood Group:</span>{" "}
                    <span className="font-bold text-rose-600">{selectedRecord.bloodGroup}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handlePrint()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                <Printer className="size-4" />
                <span>PRINT DOSSIER</span>
              </button>

              <button
                onClick={() => {
                  toast.success("Downloading PDF Dossier...");
                  setIsPdfModalOpen(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Download className="size-4" />
                <span>DOWNLOAD PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official PDF / Print View Modal */}
      <HRReportPdfModal
        isOpen={isReportPdfModalOpen}
        onClose={() => setIsReportPdfModalOpen(false)}
        reportTitle="Employee Info (Compliance) Report"
        companyName={appliedFilters.company || "Pakiza Knit Composite Ltd"}
        dateRange={`${appliedFilters.joiningDateFrom} - ${appliedFilters.joiningDateTo}`}
        columns={pdfColumns}
        data={filteredData}
      />
    </div>
  );
}
