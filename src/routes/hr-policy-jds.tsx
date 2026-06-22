import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { 
  ChevronRight, FileText, CheckCircle2, Search, SlidersHorizontal, 
  Trash2, Printer, FileDown, Plus, Pencil, Check, X, Building, Landmark, 
  Briefcase, Send, UserCheck, Info, ArrowLeft, Eye, ShieldCheck, HelpCircle,
  FileSpreadsheet
} from "lucide-react";
import { toast } from "sonner";

interface SearchParams {
  selectedSl?: string;
  mode?: "list" | "create" | "edit" | "details";
  filterWorkflow?: string;
}

export const Route = createFileRoute("/hr-policy-jds")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      selectedSl: (search.selectedSl as string) || "",
      mode: (search.mode as "list" | "create" | "edit" | "details") || "list",
      filterWorkflow: (search.filterWorkflow as string) || "ALL",
    };
  },
  head: () => ({
    meta: [
      { title: "JD List — Pakiza HRIS" },
      { name: "description", content: "Create, view, manage, and approve Job Description Sheets (JDS) in a unified workflow manager." },
    ],
  }),
  component: JDSManagementPage,
});

interface JDSItem {
  sl: number;
  company: string;
  location: string;
  department: string;
  section: string;
  designation: string;
  title: string;
  reportsTo: string;
  reportees: string;
  isDefault: boolean;
  
  jobSummary: { jdFor: string; keyTask: string }[];
  responsibilities: { jdFor: string; keyTask: string }[];
  technologies: { jdFor: string; keyTask: string }[];
  competencies: { jdFor: string; keyTask: string }[];
  
  submitStatus: "Pending" | "Submitted";
  hrStatus: "Pending" | "Approved" | "Rejected";
  hodStatus: "Pending" | "Approved" | "Rejected";
  plantHeadStatus: "Pending" | "Approved" | "Rejected";
  mdStatus: "Pending" | "Approved" | "Rejected";
}

const INITIAL_JDS_LIST: JDSItem[] = [
  {
    sl: 1,
    company: "Pakiza Software Limited",
    location: "PSL-Operation",
    department: "HR, Admin and Compliance",
    section: "Admin",
    designation: "Receptionist",
    title: "Default",
    reportsTo: "Rajebul Hasan Rajon",
    reportees: "—",
    isDefault: true,
    jobSummary: [
      { jdFor: "Customer Service", keyTask: "Welcome buyers and visitors warmly and direct them to the appropriate office or person." },
      { jdFor: "Inquiries", keyTask: "Provide information, answer questions, and respond to requests for help." }
    ],
    responsibilities: [
      { jdFor: "Phone System", keyTask: "Manage incoming phone calls, direct inquiries to team members, and check voice mailboxes regularly." },
      { jdFor: "Front Desk Admin", keyTask: "Keep reception area clean, organize schedules, book meeting rooms, and dispatch posts." },
      { jdFor: "Visitor Log", keyTask: "Log visitors on Cripton ERP guest portal." }
    ],
    technologies: [
      { jdFor: "Cripton ERP", keyTask: "Use Guest Booking module and attendance desk portal daily." },
      { jdFor: "Office Suites", keyTask: "Log spreadsheets on Microsoft Excel and write reports in Word." }
    ],
    competencies: [
      { jdFor: "Soft Skills", keyTask: "Excellent verbal and written communication." },
      { jdFor: "Multitasking", keyTask: "Ability to manage phone calls, visitor logs, and mail distributions simultaneously." }
    ],
    submitStatus: "Submitted",
    hrStatus: "Approved",
    hodStatus: "Approved",
    plantHeadStatus: "Pending",
    mdStatus: "Pending"
  },
  {
    sl: 2,
    company: "Pakiza Software Limited",
    location: "PSL-Operation",
    department: "Implementation & Business Analysis",
    section: "ERP Team",
    designation: "Executive",
    title: "Default",
    reportsTo: "Md. Anik Islam",
    reportees: "—",
    isDefault: true,
    jobSummary: [
      { jdFor: "ERP Support", keyTask: "Provide configuration and level-1 support to clients adopting Cripton HRIS solutions." }
    ],
    responsibilities: [
      { jdFor: "Client Training", keyTask: "Provide live training webinars and draft user guides for personnel modules." }
    ],
    technologies: [
      { jdFor: "Database tools", keyTask: "Run validation SQL scripts in PostgreSQL database." }
    ],
    competencies: [
      { jdFor: "Technical Support", keyTask: "Clear diagnostic abilities and product domain knowledge." }
    ],
    submitStatus: "Submitted",
    hrStatus: "Pending",
    hodStatus: "Pending",
    plantHeadStatus: "Pending",
    mdStatus: "Pending"
  },
  {
    sl: 3,
    company: "Pakiza Software Limited",
    location: "PSL-Operation",
    department: "Accounts & Finance",
    section: "Accounts",
    designation: "Executive",
    title: "Default",
    reportsTo: "Md. Zahidul Islam",
    reportees: "—",
    isDefault: true,
    jobSummary: [
      { jdFor: "Accounting", keyTask: "Perform regular entries for accounts receivables and process expense checks." }
    ],
    responsibilities: [
      { jdFor: "Audit Prep", keyTask: "File invoices and verify bank disbursement vouchers are correctly cataloged." }
    ],
    technologies: [
      { jdFor: "ERP Ledger", keyTask: "Use Ledger Module in Cripton accounting suite." }
    ],
    competencies: [
      { jdFor: "Tax/Vat knowledge", keyTask: "Up to date with domestic corporate withholding tax guidelines." }
    ],
    submitStatus: "Pending",
    hrStatus: "Pending",
    hodStatus: "Pending",
    plantHeadStatus: "Pending",
    mdStatus: "Pending"
  },
  {
    sl: 4,
    company: "Pakiza Software Limited",
    location: "PSL-Operation",
    department: "HR, Admin and Compliance",
    section: "Admin",
    designation: "Assistant Manager",
    title: "Lead JDS",
    reportsTo: "Tahmid Afsar",
    reportees: "3 Executives",
    isDefault: false,
    jobSummary: [
      { jdFor: "HR Strategy", keyTask: "Develop and implement HR policies in alignment with organizational standards." }
    ],
    responsibilities: [
      { jdFor: "Compliance Auditing", keyTask: "Audit employee records, payroll sheets, and contract compliance logs." }
    ],
    technologies: [
      { jdFor: "HRIS Suites", keyTask: "Manage staff directory databases and configure leave metrics." }
    ],
    competencies: [
      { jdFor: "Leadership", keyTask: "Direct team tasks and coordinate cross-departmental operations." }
    ],
    submitStatus: "Submitted",
    hrStatus: "Approved",
    hodStatus: "Approved",
    plantHeadStatus: "Approved",
    mdStatus: "Approved"
  }
];

export default function JDSManagementPage() {
  const { selectedSl, mode, filterWorkflow: urlFilterWorkflow } = Route.useSearch();
  const navigate = useNavigate();

  const [jdsList, setJdsList] = useState<JDSItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hris_jds_list");
      return saved ? JSON.parse(saved) : INITIAL_JDS_LIST;
    }
    return INITIAL_JDS_LIST;
  });

  const saveList = (updated: JDSItem[]) => {
    setJdsList(updated);
    localStorage.setItem("hris_jds_list", JSON.stringify(updated));
  };

  // State to track active selection
  const activeSl = useMemo(() => {
    if (selectedSl) {
      const exists = jdsList.some(j => j.sl === Number(selectedSl));
      if (exists) return Number(selectedSl);
    }
    return null;
  }, [selectedSl, jdsList]);

  const activeItem = useMemo(() => {
    return jdsList.find(j => j.sl === activeSl) || null;
  }, [activeSl, jdsList]);

  // Form states - Create / Edit JDS
  const [company, setCompany] = useState("Pakiza Software Limited");
  const [location, setLocation] = useState("PSL-Operation");
  const [department, setDepartment] = useState("HR, Admin and Compliance");
  const [section, setSection] = useState("Admin");
  const [designation, setDesignation] = useState("Receptionist");
  const [isDefault, setIsDefault] = useState(true);
  const [title, setTitle] = useState("Default");
  const [reportsTo, setReportsTo] = useState("");
  const [reportees, setReportees] = useState("");

  const [jobSummary, setJobSummary] = useState<{ jdFor: string; keyTask: string }[]>([]);
  const [responsibilities, setResponsibilities] = useState<{ jdFor: string; keyTask: string }[]>([]);
  const [technologies, setTechnologies] = useState<{ jdFor: string; keyTask: string }[]>([]);
  const [competencies, setCompetencies] = useState<{ jdFor: string; keyTask: string }[]>([]);

  // Simulation role helper
  const [actingRole, setActingRole] = useState<"HR" | "HOD" | "Plant Head" | "MD">("HR");

  // Filter pane states
  const [filterCompany, setFilterCompany] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterDept, setFilterDept] = useState("All Departments");
  const [filterSection, setFilterSection] = useState("All");
  const [filterDesignation, setFilterDesignation] = useState("ALL");
  const [filterWorkflow, setFilterWorkflow] = useState("ALL");
  const [filterSearch, setFilterSearch] = useState("");

  // Sync filterWorkflow state with URL Search parameter
  useEffect(() => {
    if (urlFilterWorkflow) {
      setFilterWorkflow(urlFilterWorkflow);
    }
  }, [urlFilterWorkflow]);

  // Populate form if mode is edit
  useEffect(() => {
    if (mode === "edit" && activeItem) {
      setCompany(activeItem.company);
      setLocation(activeItem.location);
      setDepartment(activeItem.department);
      setSection(activeItem.section);
      setDesignation(activeItem.designation);
      setIsDefault(activeItem.isDefault);
      setTitle(activeItem.title);
      setReportsTo(activeItem.reportsTo);
      setReportees(activeItem.reportees);
      setJobSummary(activeItem.jobSummary);
      setResponsibilities(activeItem.responsibilities);
      setTechnologies(activeItem.technologies);
      setCompetencies(activeItem.competencies);
    } else if (mode === "create") {
      setCompany("Pakiza Software Limited");
      setLocation("PSL-Operation");
      setDepartment("HR, Admin and Compliance");
      setSection("Admin");
      setDesignation("Receptionist");
      setIsDefault(true);
      setTitle("Default");
      setReportsTo("");
      setReportees("");
      setJobSummary([]);
      setResponsibilities([]);
      setTechnologies([]);
      setCompetencies([]);
    }
  }, [mode, activeSl, activeItem]);

  // Dropdown list options mapping
  const companyOptions = [
    { value: "Pakiza Software Limited", label: "Pakiza Software Limited" },
    { value: "Pakiza Knit Composite Ltd", label: "Pakiza Knit Composite Ltd" },
    { value: "Pakiza Group", label: "Pakiza Group" }
  ];
  const locationOptions = [
    { value: "PSL-Operation", label: "PSL-Operation" },
    { value: "PKCL-Factory", label: "PKCL-Factory" },
    { value: "Head Office", label: "Head Office" }
  ];
  const filterCompanyOptions = [
    { value: "All", label: "All Companies" },
    ...companyOptions
  ];
  const filterLocationOptions = [
    { value: "All", label: "All Locations" },
    ...locationOptions
  ];
  const deptOptions = [
    { value: "HR, Admin and Compliance", label: "HR, Admin and Compliance" },
    { value: "Implementation & Business Analysis", label: "Implementation & Business Analysis" },
    { value: "Accounts & Finance", label: "Accounts & Finance" }
  ];
  const filterDeptOptions = [
    { value: "All Departments", label: "All Departments" },
    ...deptOptions
  ];
  const sectionOptions = [
    { value: "Admin", label: "Admin" },
    { value: "ERP Team", label: "ERP Team" },
    { value: "Accounts", label: "Accounts" }
  ];
  const filterSectionOptions = [
    { value: "All", label: "All Sections" },
    ...sectionOptions
  ];
  const designationOptions = [
    { value: "Receptionist", label: "Receptionist" },
    { value: "Executive", label: "Executive" },
    { value: "Assistant Manager", label: "Assistant Manager" },
    { value: "Deputy Manager", label: "Deputy Manager" },
    { value: "Manager", label: "Manager" }
  ];
  const filterDesignationOptions = [
    { value: "ALL", label: "All Designations" },
    ...designationOptions
  ];

  const filterWorkflowOptions = [
    { value: "ALL", label: "All JDs" },
    { value: "DRAFT", label: "Drafts (Awaiting Submission)" },
    { value: "HR", label: "Awaiting HR Approval" },
    { value: "HOD", label: "Awaiting HOD Approval" },
    { value: "PLANT", label: "Awaiting Plant Head Approval" },
    { value: "MD", label: "Awaiting MD Approval" },
    { value: "APPROVED", label: "Fully Approved & Issued" }
  ];

  const handleAddRow = (type: "summary" | "resp" | "tech" | "comp") => {
    const newRow = { jdFor: "", keyTask: "" };
    if (type === "summary") setJobSummary([...jobSummary, newRow]);
    else if (type === "resp") setResponsibilities([...responsibilities, newRow]);
    else if (type === "tech") setTechnologies([...technologies, newRow]);
    else if (type === "comp") setCompetencies([...competencies, newRow]);
  };

  const handleUpdateRow = (type: "summary" | "resp" | "tech" | "comp", index: number, field: "jdFor" | "keyTask", value: string) => {
    if (type === "summary") {
      const next = [...jobSummary];
      next[index][field] = value;
      setJobSummary(next);
    } else if (type === "resp") {
      const next = [...responsibilities];
      next[index][field] = value;
      setResponsibilities(next);
    } else if (type === "tech") {
      const next = [...technologies];
      next[index][field] = value;
      setTechnologies(next);
    } else if (type === "comp") {
      const next = [...competencies];
      next[index][field] = value;
      setCompetencies(next);
    }
  };

  const handleRemoveRow = (type: "summary" | "resp" | "tech" | "comp", index: number) => {
    if (type === "summary") setJobSummary(jobSummary.filter((_, i) => i !== index));
    else if (type === "resp") setResponsibilities(responsibilities.filter((_, i) => i !== index));
    else if (type === "tech") setTechnologies(technologies.filter((_, i) => i !== index));
    else if (type === "comp") setCompetencies(competencies.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isEdit = mode === "edit";
    let nextList = [...jdsList];

    const item: JDSItem = {
      sl: isEdit ? Number(activeSl) : (jdsList.length > 0 ? Math.max(...jdsList.map(j => j.sl)) + 1 : 1),
      company,
      location,
      department,
      section,
      designation,
      title,
      reportsTo,
      reportees,
      isDefault,
      jobSummary,
      responsibilities,
      technologies,
      competencies,
      submitStatus: "Pending",
      hrStatus: "Pending",
      hodStatus: "Pending",
      plantHeadStatus: "Pending",
      mdStatus: "Pending",
    };

    if (isEdit) {
      nextList = jdsList.map(j => j.sl === item.sl ? item : j);
      toast.success("Job Description Sheet updated successfully!");
    } else {
      nextList.push(item);
      toast.success("Job Description Sheet registered successfully!");
    }

    saveList(nextList);
    navigate({ to: "/hr-policy-jds", search: { selectedSl: String(item.sl), mode: "details" } });
  };

  const handleDeleteJDS = (sl: number) => {
    if (confirm("Are you sure you want to delete this JDS specification? This action is permanent.")) {
      const nextList = jdsList.filter(j => j.sl !== sl);
      saveList(nextList);
      toast.success("JDS specifications deleted successfully");
      navigate({ to: "/hr-policy-jds", search: { selectedSl: "", mode: "list" } });
    }
  };

  const handleWorkflowSubmit = (sl: number) => {
    const updated = jdsList.map(j => j.sl === sl ? { ...j, submitStatus: "Submitted" as const } : j);
    saveList(updated);
    toast.success("JDS submitted to HR approval workflow!");
  };

  const handleApproverDecision = (sl: number, role: "HR" | "HOD" | "Plant Head" | "MD", decision: "Approved" | "Rejected") => {
    const updated = jdsList.map(j => {
      if (j.sl === sl) {
        if (role === "HR") return { ...j, hrStatus: decision };
        if (role === "HOD") return { ...j, hodStatus: decision };
        if (role === "Plant Head") return { ...j, plantHeadStatus: decision };
        if (role === "MD") return { ...j, mdStatus: decision };
      }
      return j;
    });
    saveList(updated);
    toast.success(`Request decision updated to ${decision} as ${role}!`);
  };

  const handlePrint = (item: JDSItem) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Job Description - ${item.designation}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { font-size: 28px; margin: 0; color: #0f172a; text-transform: uppercase; letter-spacing: 1px; }
            .company { font-size: 14px; font-weight: bold; color: #64748b; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; font-size: 13px; }
            th { background-color: #f8fafc; font-weight: 800; text-transform: uppercase; color: #475569; width: 25%; }
            .section-title { font-size: 16px; font-weight: 800; text-transform: uppercase; color: #0f172a; border-bottom: 2px solid #cbd5e1; padding-bottom: 6px; margin: 30px 0 15px 0; letter-spacing: 0.5px; }
            ol { padding-left: 20px; margin: 0; }
            li { margin-bottom: 10px; font-size: 13px; }
            .footer-table { margin-top: 80px; width: 100%; border: none; }
            .footer-table td { border: none; text-align: center; width: 33%; font-weight: bold; color: #475569; border-top: 1px solid #cbd5e1; padding-top: 15px; font-size: 12px; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Job Description</h1>
            <div class="company">${item.company} — ${item.location}</div>
          </div>
          
          <table>
            <tr>
              <th>Designation</th>
              <td>${item.designation}</td>
              <th>Section</th>
              <td>${item.section}</td>
            </tr>
            <tr>
              <th>Report Title</th>
              <td>${item.title}</td>
              <th>Location</th>
              <td>${item.location}</td>
            </tr>
            <tr>
              <th>Reports To</th>
              <td>${item.reportsTo || "—"}</td>
              <th>Reportees</th>
              <td>${item.reportees || "—"}</td>
            </tr>
          </table>

          <div class="section-title">Job Summary</div>
          <ol>
            ${item.jobSummary.map(row => `<li><strong>${row.jdFor}:</strong> ${row.keyTask}</li>`).join("")}
          </ol>

          <div class="section-title">Key Responsibilities</div>
          <ol>
            ${item.responsibilities.map(row => `<li><strong>${row.jdFor}:</strong> ${row.keyTask}</li>`).join("")}
          </ol>

          <div class="section-title">Technologies & Tools Used</div>
          <ol>
            ${item.technologies.map(row => `<li><strong>${row.jdFor}:</strong> ${row.keyTask}</li>`).join("")}
          </ol>

          <div class="section-title">Key Competencies</div>
          <ol>
            ${item.competencies.map(row => `<li><strong>${row.jdFor}:</strong> ${row.keyTask}</li>`).join("")}
          </ol>

          <table class="footer-table">
            <tr>
              <td>Prepared By</td>
              <td>Head Of Department</td>
              <td>Approved By</td>
            </tr>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filter list results
  const filteredJds = useMemo(() => {
    return jdsList.filter(j => {
      const matchCompany = filterCompany === "All" || j.company === filterCompany;
      const matchLocation = filterLocation === "All" || j.location === filterLocation;
      const matchDept = filterDept === "All Departments" || j.department === filterDept;
      const matchSect = filterSection === "All" || j.section === filterSection;
      const matchDesig = filterDesignation === "ALL" || j.designation === filterDesignation;
      const matchSearch = !filterSearch || 
                          j.designation.toLowerCase().includes(filterSearch.toLowerCase()) ||
                          j.department.toLowerCase().includes(filterSearch.toLowerCase()) ||
                          j.section.toLowerCase().includes(filterSearch.toLowerCase());
      
      const matchWorkflow = filterWorkflow === "ALL" ||
                            (filterWorkflow === "DRAFT" && j.submitStatus === "Pending") ||
                            (filterWorkflow === "HR" && j.submitStatus === "Submitted" && j.hrStatus === "Pending") ||
                            (filterWorkflow === "HOD" && j.submitStatus === "Submitted" && j.hrStatus === "Approved" && j.hodStatus === "Pending") ||
                            (filterWorkflow === "PLANT" && j.submitStatus === "Submitted" && j.hrStatus === "Approved" && j.hodStatus === "Approved" && j.plantHeadStatus === "Pending") ||
                            (filterWorkflow === "MD" && j.submitStatus === "Submitted" && j.hrStatus === "Approved" && j.hodStatus === "Approved" && j.plantHeadStatus === "Approved" && j.mdStatus === "Pending") ||
                            (filterWorkflow === "APPROVED" && j.submitStatus === "Submitted" && j.hrStatus === "Approved" && j.hodStatus === "Approved" && j.plantHeadStatus === "Approved" && j.mdStatus === "Approved");

      return matchCompany && matchLocation && matchDept && matchSect && matchDesig && matchSearch && matchWorkflow;
    });
  }, [jdsList, filterCompany, filterLocation, filterDept, filterSection, filterDesignation, filterSearch, filterWorkflow]);

  // Determine sequential workflow state
  const workflowState = useMemo(() => {
    if (!activeItem) return null;
    if (activeItem.submitStatus === "Pending") {
      return { currentStep: "Submit", text: "Draft - Awaiting Submission" };
    }
    if (activeItem.hrStatus === "Pending") {
      return { currentStep: "HR", text: "Under HR Review" };
    }
    if (activeItem.hrStatus === "Rejected") {
      return { currentStep: "HR_Rejected", text: "Rejected by HR" };
    }
    if (activeItem.hodStatus === "Pending") {
      return { currentStep: "HOD", text: "Under HOD Review" };
    }
    if (activeItem.hodStatus === "Rejected") {
      return { currentStep: "HOD_Rejected", text: "Rejected by HOD" };
    }
    if (activeItem.plantHeadStatus === "Pending") {
      return { currentStep: "Plant Head", text: "Under Plant Head Review" };
    }
    if (activeItem.plantHeadStatus === "Rejected") {
      return { currentStep: "Plant_Rejected", text: "Rejected by Plant Head" };
    }
    if (activeItem.mdStatus === "Pending") {
      return { currentStep: "MD", text: "Under MD Review" };
    }
    if (activeItem.mdStatus === "Rejected") {
      return { currentStep: "MD_Rejected", text: "Rejected by Managing Director" };
    }
    return { currentStep: "Approved", text: "Fully Approved & Issued" };
  }, [activeItem]);

  const getWorkflowBadge = (status: string, lock?: boolean) => {
    if (lock) return "bg-slate-100 text-slate-400 dark:bg-slate-900/60 dark:text-slate-600 border-slate-200/50 dark:border-slate-800/40";
    if (status === "Approved") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    if (status === "Rejected") return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  };

  const getChainNodeStyle = (status: string, fallback: string) => {
    const activeStatus = status === "Pending" ? fallback : status;
    if (activeStatus === "Approved") {
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-500/80";
    }
    if (activeStatus === "Rejected") {
      return "bg-rose-500/10 text-rose-600 border-rose-500 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-500/80";
    }
    return "bg-amber-500/10 text-amber-600 border-amber-500 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-500/80";
  };

  const getWorkflowCellBadge = (item: JDSItem, role: "HR" | "HOD" | "Plant Head" | "MD") => {
    if (item.submitStatus === "Pending") {
      return <span className="text-[10px] font-bold text-slate-400">Locked</span>;
    }
    
    if (role === "HR") {
      return (
        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${getWorkflowBadge(item.hrStatus)}`}>
          {item.hrStatus}
        </span>
      );
    }
    
    if (role === "HOD") {
      const isLocked = item.hrStatus !== "Approved";
      return (
        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${getWorkflowBadge(item.hodStatus, isLocked)}`}>
          {isLocked ? "Locked" : item.hodStatus}
        </span>
      );
    }
    
    if (role === "Plant Head") {
      const isLocked = item.hrStatus !== "Approved" || item.hodStatus !== "Approved";
      return (
        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${getWorkflowBadge(item.plantHeadStatus, isLocked)}`}>
          {isLocked ? "Locked" : item.plantHeadStatus}
        </span>
      );
    }
    
    if (role === "MD") {
      const isLocked = item.hrStatus !== "Approved" || item.hodStatus !== "Approved" || item.plantHeadStatus !== "Approved";
      return (
        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${getWorkflowBadge(item.mdStatus, isLocked)}`}>
          {isLocked ? "Locked" : item.mdStatus}
        </span>
      );
    }
  };

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        {/* Content Container */}
        <div className="flex-1 overflow-hidden flex flex-col px-6 py-4 gap-4 bg-[#f8fafc] dark:bg-[#090d16]">
          
          {/* Page Header */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest font-black">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <span className="text-muted-foreground font-black">HR Policy</span>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <span className="text-foreground font-extrabold">JD List</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 rounded-xl px-3 py-1.5 font-black uppercase tracking-wider">
                Unified JD Directory
              </span>
            </div>
          </div>

          {/* DYNAMIC VIEW ROUTER */}
          <div className="flex-1 bg-card border border-border rounded-2xl shadow-xs flex flex-col overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-indigo-500" />
            
            {/* VIEW 1: MASTER JD LIST (TABLE VIEW) */}
            {mode === "list" && (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                
                {/* Title & Add Button */}
                <div className="px-6 py-4 border-b border-border bg-muted/10 shrink-0 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Designation Job Description Sheets (JDS)</h3>
                    <p className="text-[9.5px] font-bold text-muted-foreground/80 leading-none mt-1">Unified directory for creation, submission, and role-based sequential approvals.</p>
                  </div>
                  <button
                    onClick={() => navigate({ to: "/hr-policy-jds", search: { selectedSl: "", mode: "create" } })}
                    className="h-9 px-4 bg-primary hover:bg-primary/95 text-white font-black text-[11px] rounded-xl uppercase tracking-wider flex items-center gap-1.5 transition duration-150 shadow-2xs"
                  >
                    <Plus className="size-4" /> Create New JDS
                  </button>
                </div>

                {/* Filters Pane */}
                <div className="px-6 py-4 border-b border-border bg-card shrink-0 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-black uppercase text-muted-foreground/75 tracking-wider flex items-center gap-1.5">
                      <SlidersHorizontal className="size-3.5" /> Filters & Autocomplete Search
                    </span>
                    
                    {/* Search box */}
                    <div className="relative w-72">
                      <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search designation keyword..."
                        value={filterSearch}
                        onChange={e => setFilterSearch(e.target.value)}
                        className="w-full h-8.5 pl-8 pr-3 text-[11px] font-bold bg-muted/10 border border-border/80 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 p-3 bg-muted/5 border border-border/60 rounded-xl">
                    <div className="space-y-1">
                      <label className="text-[8.5px] font-black uppercase text-muted-foreground">Company</label>
                      <SearchableSelect
                        value={filterCompany}
                        onChange={setFilterCompany}
                        options={filterCompanyOptions}
                        className="h-8 py-0 text-xs rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8.5px] font-black uppercase text-muted-foreground">Location</label>
                      <SearchableSelect
                        value={filterLocation}
                        onChange={setFilterLocation}
                        options={filterLocationOptions}
                        className="h-8 py-0 text-xs rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8.5px] font-black uppercase text-muted-foreground">Department</label>
                      <SearchableSelect
                        value={filterDept}
                        onChange={setFilterDept}
                        options={filterDeptOptions}
                        className="h-8 py-0 text-xs rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8.5px] font-black uppercase text-muted-foreground">Section</label>
                      <SearchableSelect
                        value={filterSection}
                        onChange={setFilterSection}
                        options={filterSectionOptions}
                        className="h-8 py-0 text-xs rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8.5px] font-black uppercase text-muted-foreground">Designation</label>
                      <SearchableSelect
                        value={filterDesignation}
                        onChange={setFilterDesignation}
                        options={filterDesignationOptions}
                        className="h-8 py-0 text-xs rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8.5px] font-black uppercase text-muted-foreground">Workflow Stage</label>
                      <SearchableSelect
                        value={filterWorkflow}
                        onChange={setFilterWorkflow}
                        options={filterWorkflowOptions}
                        className="h-8 py-0 text-xs rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Table list */}
                <div className="flex-1 overflow-auto min-h-0 bg-card">
                  <table className="w-full text-left text-xs border-collapse whitespace-nowrap min-w-[1200px]">
                    <thead className="text-muted-foreground uppercase font-black tracking-wider text-[9.5px] border-b border-border/50 bg-[#f8fafc] dark:bg-[#0f172a] sticky top-0 z-10">
                      <tr>
                        <th className="px-5 py-4 w-[60px] text-center">#</th>
                        <th className="px-5 py-4 w-[160px] text-center">Actions</th>
                        <th className="px-5 py-4 min-w-[180px]">Designation Name</th>
                        <th className="px-5 py-4 min-w-[180px]">Company Name</th>
                        <th className="px-5 py-4 w-[120px] text-center">Location</th>
                        <th className="px-5 py-4 min-w-[200px]">Main Department</th>
                        <th className="px-5 py-4 min-w-[120px]">Section</th>
                        <th className="px-5 py-4 w-[120px] text-center">Reports To</th>
                        <th className="px-5 py-4 w-[100px] text-center">Workflow</th>
                        <th className="px-5 py-4 w-[110px] text-center">HR</th>
                        <th className="px-5 py-4 w-[110px] text-center">HOD</th>
                        <th className="px-5 py-4 w-[110px] text-center">Plant Head</th>
                        <th className="px-5 py-4 w-[110px] text-center">MD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 text-foreground">
                      {filteredJds.length === 0 ? (
                        <tr>
                          <td colSpan={15} className="py-12 text-center text-[12px] font-bold text-muted-foreground/60">
                            No registered Job Description Sheets match the selected filters.
                          </td>
                        </tr>
                      ) : (
                        filteredJds.map((item, idx) => (
                          <tr key={item.sl} className="group hover:bg-[#f1f5f9] dark:hover:bg-[#1c283d] transition-all">
                            <td className="px-5 py-3.5 text-center font-mono text-slate-500 font-semibold">{idx + 1}</td>
                            
                            <td className="px-5 py-3.5">
                              <div className="flex items-center justify-center gap-3.5">
                                <button
                                  type="button"
                                  onClick={() => navigate({ to: "/hr-policy-jds", search: { selectedSl: String(item.sl), mode: "details" } })}
                                  title="View Specs & Approval Progress"
                                  className="text-emerald-500 hover:text-emerald-600 transition flex items-center gap-1 font-bold text-[11px]"
                                >
                                  <Eye className="size-4" /> View
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => navigate({ to: "/hr-policy-jds", search: { selectedSl: String(item.sl), mode: "edit" } })}
                                  title="Edit Specifications"
                                  className="text-orange-500 hover:text-orange-600 transition"
                                >
                                  <Pencil className="size-4" />
                                </button>

                                {item.submitStatus === "Pending" ? (
                                  <button
                                    type="button"
                                    onClick={() => handleWorkflowSubmit(item.sl)}
                                    title="Submit to Sequential workflow"
                                    className="text-indigo-600 hover:text-indigo-700 transition flex items-center gap-1 font-bold text-[11px]"
                                  >
                                    <Send className="size-3.5" /> Submit
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-muted-foreground/50 select-none">Routing</span>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleDeleteJDS(item.sl)}
                                  title="Delete JD specifications"
                                  className="text-rose-500 hover:text-rose-600 transition"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </td>

                            <td className="px-5 py-3.5 font-black text-foreground/95">
                              <div className="flex items-center gap-2">
                                <span>{item.designation}</span>
                                {item.isDefault && (
                                  <span className="text-[8px] font-black uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1.5 py-0.2 rounded-md">Default</span>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-slate-500">{item.company}</td>
                            <td className="px-5 py-3.5 text-center text-slate-500 font-semibold">{item.location}</td>
                            <td className="px-5 py-3.5 font-medium">{item.department}</td>
                            <td className="px-5 py-3.5 font-medium text-slate-500">{item.section}</td>
                            <td className="px-5 py-3.5 text-center text-slate-500">{item.reportsTo || "—"}</td>
                            
                            <td className="px-5 py-3.5 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${
                                item.submitStatus === "Submitted" 
                                  ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" 
                                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              }`}>
                                {item.submitStatus === "Submitted" ? "Active" : "Draft"}
                              </span>
                            </td>

                            <td className="px-5 py-3.5 text-center">{getWorkflowCellBadge(item, "HR")}</td>
                            <td className="px-5 py-3.5 text-center">{getWorkflowCellBadge(item, "HOD")}</td>
                            <td className="px-5 py-3.5 text-center">{getWorkflowCellBadge(item, "Plant Head")}</td>
                            <td className="px-5 py-3.5 text-center">{getWorkflowCellBadge(item, "MD")}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* VIEW 2: CREATE / EDIT JDS BUILDER FORM */}
            {(mode === "create" || mode === "edit") && (
              <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden bg-card">
                
                {/* Form Header */}
                <div className="px-6 py-4.5 border-b border-border bg-muted/10 shrink-0 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
                      {mode === "edit" ? "Edit Job Description Specifications" : "Register New Job Description Sheet (JDS)"}
                    </h3>
                    <p className="text-[9.5px] font-bold text-muted-foreground/80 leading-none mt-1">Specify design metrics, report details, and tasks to trigger approvals.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/hr-policy-jds", search: { selectedSl: activeSl ? String(activeSl) : "", mode: activeSl ? "details" : "list" } })}
                    className="h-8 px-4 border border-border bg-card hover:bg-muted text-[10.5px] font-black text-foreground rounded-lg uppercase tracking-wider transition"
                  >
                    Back
                  </button>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Position Details */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/20 p-5 rounded-2xl border border-border/60 space-y-4">
                    <h4 className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-3 rounded-full bg-primary" /> Target Position Specifications
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-muted-foreground/80 uppercase tracking-widest">Company</label>
                        <SearchableSelect
                          value={company}
                          onChange={setCompany}
                          options={companyOptions}
                          placeholder="Select Company..."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-muted-foreground/80 uppercase tracking-widest">Location</label>
                        <SearchableSelect
                          value={location}
                          onChange={setLocation}
                          options={locationOptions}
                          placeholder="Select Location..."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-muted-foreground/80 uppercase tracking-widest">Department</label>
                        <SearchableSelect
                          value={department}
                          onChange={setDepartment}
                          options={deptOptions}
                          placeholder="Select Department..."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-muted-foreground/80 uppercase tracking-widest">Section</label>
                        <SearchableSelect
                          value={section}
                          onChange={setSection}
                          options={sectionOptions}
                          placeholder="Select Section..."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-muted-foreground/80 uppercase tracking-widest">Designation</label>
                        <SearchableSelect
                          value={designation}
                          onChange={setDesignation}
                          options={designationOptions}
                          placeholder="Select Designation..."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-muted-foreground/80 uppercase tracking-widest">Report Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Default" className="w-full h-10 px-3.5 text-[13px] font-bold bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-muted-foreground/80 uppercase tracking-widest">Reports To</label>
                        <input type="text" value={reportsTo} onChange={e => setReportsTo(e.target.value)} placeholder="Name / Designation" className="w-full h-10 px-3.5 text-[13px] font-bold bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-muted-foreground/80 uppercase tracking-widest">Reportees</label>
                        <input type="text" value={reportees} onChange={e => setReportees(e.target.value)} placeholder="Name / Team size" className="w-full h-10 px-3.5 text-[13px] font-bold bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                      </div>
                      <div className="flex items-center gap-2 pt-5">
                        <input type="checkbox" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} id="form-default-checkbox" className="rounded border-border text-primary size-4 cursor-pointer" />
                        <label htmlFor="form-default-checkbox" className="text-[11px] font-bold text-muted-foreground uppercase cursor-pointer select-none">Set as Default JDS</label>
                      </div>
                    </div>
                  </div>

                  {/* Task scope grids */}
                  {[
                    { id: "summary", label: "Job Summary Details", rows: jobSummary },
                    { id: "resp", label: "Key Responsibilities", rows: responsibilities },
                    { id: "tech", label: "Technologies & Tools Used", rows: technologies },
                    { id: "comp", label: "Key Competencies", rows: competencies }
                  ].map(block => (
                    <div key={block.id} className="bg-slate-50/50 dark:bg-slate-900/20 p-5 rounded-2xl border border-border/60 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-extrabold text-muted-foreground/80 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-3 rounded-full bg-primary" /> {block.label}
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleAddRow(block.id as any)}
                          className="h-7.5 px-3 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5"
                        >
                          <Plus className="size-3.5" /> ADD ROW
                        </button>
                      </div>

                      <div className="border border-border/70 rounded-xl overflow-hidden bg-card">
                        <div className="grid grid-cols-[60px_180px_1fr_60px] items-center px-4 py-2 border-b border-border bg-muted/20 text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                          <span>SL</span>
                          <span>JD For</span>
                          <span>Key Task</span>
                          <span className="text-center">Action</span>
                        </div>
                        <div className="divide-y divide-border/30">
                          {block.rows.length === 0 ? (
                            <div className="p-5 text-center text-muted-foreground/60 text-[11px] font-bold">
                              No rows registered. Click "ADD ROW" to register task scopes.
                            </div>
                          ) : (
                            block.rows.map((row, idx) => (
                              <div key={idx} className="grid grid-cols-[60px_180px_1fr_60px] items-center px-4 py-2 text-[12px] gap-3">
                                <span className="font-mono text-center font-bold text-muted-foreground">{idx + 1}</span>
                                <input
                                  type="text"
                                  value={row.jdFor}
                                  placeholder="Scope Category"
                                  onChange={e => handleUpdateRow(block.id as any, idx, "jdFor", e.target.value)}
                                  className="h-8.5 px-2.5 bg-muted/20 border border-border rounded-lg text-[11.5px] font-bold"
                                  required
                                />
                                <input
                                  type="text"
                                  value={row.keyTask}
                                  placeholder="Scope Task details"
                                  onChange={e => handleUpdateRow(block.id as any, idx, "keyTask", e.target.value)}
                                  className="h-8.5 px-2.5 bg-muted/20 border border-border rounded-lg text-[11.5px] font-bold"
                                  required
                                />
                                <div className="flex justify-center">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveRow(block.id as any, idx)}
                                    className="text-rose-500 hover:text-rose-600 transition"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Save */}
                <div className="px-6 py-4 border-t border-border bg-muted/10 flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/hr-policy-jds", search: { selectedSl: activeSl ? String(activeSl) : "", mode: activeSl ? "details" : "list" } })}
                    className="h-9.5 px-5 border border-border bg-card hover:bg-muted text-foreground text-[10.5px] font-black rounded-xl transition uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9.5 px-7 bg-primary hover:bg-primary/95 text-white text-[10.5px] font-black rounded-xl transition shadow flex items-center gap-1.5 uppercase tracking-wider"
                  >
                    <CheckCircle2 className="size-4" />
                    Save Job Description
                  </button>
                </div>
              </form>
            )}

            {/* VIEW 3: DETAILED JD SHEET & SEQUENTIAL APPROVAL VIEW */}
            {mode === "details" && activeItem && (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-card">
                
                {/* Header Actions */}
                <div className="px-6 py-4 border-b border-border bg-card shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs relative z-10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate({ to: "/hr-policy-jds", search: { selectedSl: "", mode: "list" } })}
                      className="size-8 rounded-lg hover:bg-muted flex items-center justify-center border border-border transition text-slate-500 hover:text-foreground"
                    >
                      <ArrowLeft className="size-4" />
                    </button>
                    <div>
                      <span className="text-[9px] font-black text-indigo-600 bg-indigo-500/10 rounded px-2 py-0.5 uppercase tracking-wide">
                        JDS-{activeItem.sl} View Mode
                      </span>
                      <h2 className="text-sm font-black text-foreground uppercase tracking-tight mt-1">{activeItem.designation} JD Details</h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handlePrint(activeItem)}
                      className="h-8.5 px-3 border border-border bg-card hover:bg-muted text-foreground text-[10.5px] font-extrabold rounded-xl flex items-center gap-1.5 uppercase tracking-wider transition"
                    >
                      <Printer className="size-3.5" /> Print JDS
                    </button>
                    <button
                      onClick={() => toast.success("Exported list specifications to Excel!")}
                      className="h-8.5 px-3 border border-border bg-card hover:bg-muted text-foreground text-[10.5px] font-extrabold rounded-xl flex items-center gap-1.5 uppercase tracking-wider transition"
                    >
                      <FileDown className="size-3.5" /> Export Excel
                    </button>
                    <button
                      onClick={() => navigate({ to: "/hr-policy-jds", search: { selectedSl: String(activeItem.sl), mode: "edit" } })}
                      className="h-8.5 px-4 bg-amber-500 hover:bg-amber-600 text-white text-[10.5px] font-black rounded-xl flex items-center gap-1.5 uppercase tracking-wider transition shadow-2xs"
                    >
                      <Pencil className="size-3.5" /> Edit JDS
                    </button>
                    <button
                      onClick={() => handleDeleteJDS(activeItem.sl)}
                      className="size-8.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-rose-500 flex items-center justify-center transition"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {/* View Details Body: Approval sequential workflow & Paper display */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40 dark:bg-slate-900/10">
                  
                  {/* 1. SEQUENTIAL APPROVAL PIPELINE (ONE-AFTER-ANOTHER) */}
                  <div className="bg-card border border-border p-5 rounded-2xl shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <ShieldCheck className="size-4 text-indigo-500" /> Permission Sequential Approval Pipeline
                      </h4>
                      <div className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-500/10 px-2.5 py-0.5 rounded-md">
                        Current Stage: {workflowState?.text}
                      </div>
                    </div>

                    {/* Visual pipeline stages indicating locked vs unlocked steps */}
                    <div className="grid grid-cols-4 gap-4 p-4 bg-muted/10 rounded-xl relative border border-border/40">
                      {[
                        { role: "HR", name: "HR Reviewer", status: activeItem.hrStatus, unlocked: activeItem.submitStatus === "Submitted" },
                        { role: "HOD", name: "Department Head", status: activeItem.hodStatus, unlocked: activeItem.submitStatus === "Submitted" && activeItem.hrStatus === "Approved" },
                        { role: "Plant Head", name: "Plant Manager", status: activeItem.plantHeadStatus, unlocked: activeItem.submitStatus === "Submitted" && activeItem.hrStatus === "Approved" && activeItem.hodStatus === "Approved" },
                        { role: "MD", name: "Managing Director", status: activeItem.mdStatus, unlocked: activeItem.submitStatus === "Submitted" && activeItem.hrStatus === "Approved" && activeItem.hodStatus === "Approved" && activeItem.plantHeadStatus === "Approved" }
                      ].map((stage, i) => {
                        const style = getChainNodeStyle(stage.status, stage.unlocked ? "Approved" : "Pending");
                        return (
                          <div key={i} className="flex flex-col items-center justify-center text-center relative z-10">
                            <div className={`size-10 rounded-full flex items-center justify-center text-[11px] font-black border-2 transition-all ${
                              stage.unlocked 
                                ? style 
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-700 border-slate-200 dark:border-slate-800"
                            }`}>
                              {stage.role}
                            </div>
                            <span className="text-[10.5px] font-extrabold text-foreground mt-2 leading-none">{stage.name}</span>
                            <span className="text-[8.5px] font-bold text-muted-foreground mt-1 flex items-center gap-1">
                              {stage.unlocked ? (
                                <span>{stage.status}</span>
                              ) : (
                                <span className="text-slate-400 italic">Locked</span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Sequential Role Actions Controller */}
                    <div className="p-4 bg-indigo-500/[0.03] dark:bg-indigo-500/[0.06] border border-indigo-500/15 rounded-xl space-y-4">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Simulation permission selector */}
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                            Acting / Mock Role:
                          </span>
                          <select 
                            value={actingRole} 
                            onChange={e => setActingRole(e.target.value as any)} 
                            className="h-8 px-3 border border-indigo-500/25 bg-card text-indigo-700 dark:text-indigo-400 text-[11px] font-black rounded-lg focus:outline-none"
                          >
                            <option value="HR">HR Reviewer</option>
                            <option value="HOD">Department Head (HOD)</option>
                            <option value="Plant Head">Plant Manager (Plant Head)</option>
                            <option value="MD">Managing Director (MD)</option>
                          </select>
                        </div>

                        {/* Interactive conditional sequential review buttons */}
                        <div className="flex items-center gap-2">
                          {activeItem.submitStatus === "Pending" ? (
                            <button
                              onClick={() => handleWorkflowSubmit(activeItem.sl)}
                              className="h-8.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-lg flex items-center gap-1.5 uppercase tracking-wider transition shadow-2xs"
                            >
                              <Send className="size-3.5" /> Submit JDS to Workflow
                            </button>
                          ) : (
                            <>
                              {/* HR'S TURN */}
                              {workflowState?.currentStep === "HR" && actingRole === "HR" && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleApproverDecision(activeItem.sl, "HR", "Approved")}
                                    className="h-8.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg flex items-center gap-1 uppercase tracking-wider transition"
                                  >
                                    <Check className="size-3.5" /> Approve as HR
                                  </button>
                                  <button
                                    onClick={() => handleApproverDecision(activeItem.sl, "HR", "Rejected")}
                                    className="h-8.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-lg flex items-center gap-1 uppercase tracking-wider transition"
                                  >
                                    <X className="size-3.5" /> Reject as HR
                                  </button>
                                </div>
                              )}

                              {/* HOD'S TURN */}
                              {workflowState?.currentStep === "HOD" && actingRole === "HOD" && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleApproverDecision(activeItem.sl, "HOD", "Approved")}
                                    className="h-8.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg flex items-center gap-1 uppercase tracking-wider transition"
                                  >
                                    <Check className="size-3.5" /> Approve as HOD
                                  </button>
                                  <button
                                    onClick={() => handleApproverDecision(activeItem.sl, "HOD", "Rejected")}
                                    className="h-8.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-lg flex items-center gap-1 uppercase tracking-wider transition"
                                  >
                                    <X className="size-3.5" /> Reject as HOD
                                  </button>
                                </div>
                              )}

                              {/* PLANT HEAD'S TURN */}
                              {workflowState?.currentStep === "Plant Head" && actingRole === "Plant Head" && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleApproverDecision(activeItem.sl, "Plant Head", "Approved")}
                                    className="h-8.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg flex items-center gap-1 uppercase tracking-wider transition"
                                  >
                                    <Check className="size-3.5" /> Approve as Plant Head
                                  </button>
                                  <button
                                    onClick={() => handleApproverDecision(activeItem.sl, "Plant Head", "Rejected")}
                                    className="h-8.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-lg flex items-center gap-1 uppercase tracking-wider transition"
                                  >
                                    <X className="size-3.5" /> Reject as Plant Head
                                  </button>
                                </div>
                              )}

                              {/* MD'S TURN */}
                              {workflowState?.currentStep === "MD" && actingRole === "MD" && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleApproverDecision(activeItem.sl, "MD", "Approved")}
                                    className="h-8.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg flex items-center gap-1 uppercase tracking-wider transition"
                                  >
                                    <Check className="size-3.5" /> Approve as MD
                                  </button>
                                  <button
                                    onClick={() => handleApproverDecision(activeItem.sl, "MD", "Rejected")}
                                    className="h-8.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-lg flex items-center gap-1 uppercase tracking-wider transition"
                                  >
                                    <X className="size-3.5" /> Reject as MD
                                  </button>
                                </div>
                              )}
                              
                              {/* FALLBACK INFO / ERROR */}
                              {["HR", "HOD", "Plant Head", "MD"].includes(workflowState?.currentStep || "") && workflowState?.currentStep !== actingRole && (
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                  <Info className="size-3.5 text-indigo-500" />
                                  Currently awaiting approval stage: <span className="font-extrabold text-foreground underline">{workflowState?.currentStep}</span>. Select that role above to make decision.
                                </span>
                              )}

                              {workflowState?.currentStep === "Approved" && (
                                <span className="text-[10.5px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/20 rounded-lg flex items-center gap-1.5 animate-bounce">
                                  <CheckCircle2 className="size-4" /> This Job Description Sheet is Fully Approved & Active!
                                </span>
                              )}

                              {workflowState?.currentStep.endsWith("_Rejected") && (
                                <span className="text-[10.5px] font-black text-rose-600 bg-rose-500/10 px-3 py-1.5 border border-rose-500/20 rounded-lg flex items-center gap-1.5">
                                  <X className="size-4 animate-ping" /> The JDS review has stopped due to rejection. Please edit and submit again.
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* 2. JDS FORMAL DISPLAY PAPER CONTAINER */}
                  <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
                    <div className="bg-muted/10 border-b border-border/80 px-6 py-3 shrink-0 flex items-center justify-between text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                      <span>Official Job Description Specifications Record</span>
                      <span>Pakiza Document Viewer</span>
                    </div>

                    <div className="p-8 space-y-6 bg-card text-foreground font-sans">
                      {/* Document Title */}
                      <div className="text-center border-b border-border/80 pb-5 space-y-1">
                        <span className="text-[11px] font-black uppercase text-muted-foreground/80 tracking-widest">{activeItem.company}</span>
                        <h3 className="text-xl font-black text-foreground uppercase tracking-wide">Job Description</h3>
                        <span className="text-[10px] font-bold text-slate-400">Position Level Specifications Record</span>
                      </div>

                      {/* Info grid */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-border text-[12px] font-sans">
                          <tbody>
                            <tr>
                              <td className="border border-border bg-muted/25 p-3 font-extrabold text-muted-foreground uppercase w-1/4">Designation</td>
                              <td className="border border-border p-3 font-bold text-foreground">{activeItem.designation}</td>
                              <td className="border border-border bg-muted/25 p-3 font-extrabold text-muted-foreground uppercase w-1/4">Section</td>
                              <td className="border border-border p-3 font-bold text-foreground">{activeItem.section}</td>
                            </tr>
                            <tr>
                              <td className="border border-border bg-muted/25 p-3 font-extrabold text-muted-foreground uppercase">Report Title</td>
                              <td className="border border-border p-3 font-bold text-foreground">{activeItem.title}</td>
                              <td className="border border-border bg-muted/25 p-3 font-extrabold text-muted-foreground uppercase">Location</td>
                              <td className="border border-border p-3 font-bold text-foreground">{activeItem.location}</td>
                            </tr>
                            <tr>
                              <td className="border border-border bg-muted/25 p-3 font-extrabold text-muted-foreground uppercase">Reports To</td>
                              <td className="border border-border p-3 font-bold text-foreground">{activeItem.reportsTo || "—"}</td>
                              <td className="border border-border bg-muted/25 p-3 font-extrabold text-muted-foreground uppercase">Reportees</td>
                              <td className="border border-border p-3 font-bold text-foreground">{activeItem.reportees || "—"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Detail segments */}
                      {[
                        { title: "Job Summary", rows: activeItem.jobSummary },
                        { title: "Key Responsibilities", rows: activeItem.responsibilities },
                        { title: "Technologies & Tools Used", rows: activeItem.technologies },
                        { title: "Key Competencies", rows: activeItem.competencies }
                      ].map((sec, i) => (
                        <div key={i} className="space-y-2">
                          <h4 className="text-[12.5px] font-black uppercase text-foreground border-b border-border pb-1.5 tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-3 rounded-full bg-primary" /> {sec.title}
                          </h4>
                          <ol className="list-decimal pl-5 space-y-2 text-[12px] text-muted-foreground">
                            {sec.rows.length === 0 ? (
                              <span className="text-muted-foreground/60 italic font-semibold">No tasks registered for this scope.</span>
                            ) : (
                              sec.rows.map((row, idx) => (
                                <li key={idx} className="leading-relaxed">
                                  <strong className="text-foreground font-bold">{row.jdFor}: </strong> {row.keyTask}
                                </li>
                              ))
                            )}
                          </ol>
                        </div>
                      ))}

                      {/* prepared by sig */}
                      <table className="w-full text-center mt-12 text-[9px] font-black uppercase text-slate-500" style={{ border: "none" }}>
                        <tbody>
                          <tr style={{ border: "none" }}>
                            <td style={{ border: "none", borderTop: "1.5px solid var(--border)", paddingTop: "12px", width: "33%" }}>Prepared By</td>
                            <td style={{ border: "none", borderTop: "1.5px solid var(--border)", paddingTop: "12px", width: "33%" }}>Head Of Department</td>
                            <td style={{ border: "none", borderTop: "1.5px solid var(--border)", paddingTop: "12px", width: "33%" }}>Approved By</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>
            )}
            
          </div>

        </div>
      </main>
    </div>
  );
}
