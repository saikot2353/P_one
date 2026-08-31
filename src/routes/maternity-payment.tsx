import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  FileSpreadsheet,
  Printer,
  FileDown,
  Search,
  Plus,
  Trash2,
  Edit,
  X,
  CheckCircle2,
  Coins,
  ShieldCheck,
  FileText,
  FileCheck,
} from "lucide-react";

export const Route = createFileRoute("/maternity-payment")({
  head: () => ({
    meta: [
      { title: "Maternity Payment Registry — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Manage maternity payment records, benefit disbursements, salary calculations, and employee applications.",
      },
    ],
  }),
  component: MaternityPaymentPage,
});

export interface MaternityPaymentRecord {
  id: string;
  empId: string;
  empName: string;
  empType: string;
  department: string;
  section: string;
  unit: string;
  line: string;
  joiningDate: string;
  eddDate: string;
  startDate: string;
  endDate: string;
  applyDate: string;
  days: number;
  totalEarningAmount: number;
  createdBy: string;
  createdDate: string;
  area?: string;
  jobTitle?: string;
  subDepartment?: string;
  monthlyWage?: number;
  basicWage?: number;
  houseRent?: number;
  medical?: number;
  conveyance?: number;
  presentDays?: number;
  absentDays?: number;
  leaveDays?: number;
  holidayDays?: number;
  dailyWage?: number;
  total112Wage?: number;
  firstInstallment?: number;
  secondInstallment?: number;
  inWordsBn?: string;
}

// Pre-loaded 20 exact records from user prompt reference
const initialMaternityPaymentRecords: MaternityPaymentRecord[] = [
  {
    id: "MP-2016003496",
    empId: "2016003496",
    empName: "মোসাঃ সাথী আক্তার",
    empType: "Office Executive",
    department: "Admin and Compliance",
    section: "Medical",
    unit: "N/A",
    line: "N/A",
    joiningDate: "13/02/2016",
    eddDate: "07/03/2023",
    startDate: "10/01/2023",
    endDate: "01/05/2023",
    applyDate: "09/01/2023",
    days: 112,
    totalEarningAmount: 150769,
    createdBy: "HR Admin",
    createdDate: "09/01/2023 10:12:00",
    area: "PKCL-Savar",
    jobTitle: "অফিসার",
    subDepartment: "মেডিক্যাল",
    monthlyWage: 35000,
    basicWage: 21000,
    houseRent: 10500,
    medical: 2100,
    conveyance: 1400,
    presentDays: 26,
    absentDays: 0,
    leaveDays: 0,
    holidayDays: 5,
    dailyWage: 1346.15,
    total112Wage: 150769,
    firstInstallment: 75385,
    secondInstallment: 75385,
    inWordsBn: "পঁচাত্তর হাজার তিন শত পঁচাশি টাকা মাত্র।",
  },
  {
    id: "MP-2020021174",
    empId: "2020021174",
    empName: "Mst. Rikta Akter",
    empType: "Office Staff",
    department: "Sample & CAD",
    section: "Sample",
    unit: "N/A",
    line: "N/A",
    joiningDate: "10/11/2020",
    eddDate: "15/02/2024",
    startDate: "21/12/2023",
    endDate: "10/04/2024",
    applyDate: "06/12/2023",
    days: 112,
    totalEarningAmount: 97754,
    createdBy: "Mst. Rikta Akter",
    createdDate: "06/12/2023 10:24:32",
    area: "PKCL-Savar",
    jobTitle: "Sample Man",
    subDepartment: "Sample",
    monthlyWage: 22700,
    basicWage: 13620,
    houseRent: 6810,
    medical: 1500,
    conveyance: 770,
    presentDays: 26,
    absentDays: 0,
    leaveDays: 0,
    holidayDays: 4,
    dailyWage: 873.08,
    total112Wage: 97785,
    firstInstallment: 48892,
    secondInstallment: 48893,
    inWordsBn: "আটচল্লিশ হাজার আট শত বিরানব্বই টাকা মাত্র।",
  },
  {
    id: "MP-2020021628",
    empId: "2020021628",
    empName: "Mst. Bablee khatun",
    empType: "Worker",
    department: "Finishing Department",
    section: "Finishing",
    unit: "Unit-06",
    line: "N/A",
    joiningDate: "01/12/2020",
    eddDate: "08/02/2023",
    startDate: "14/12/2022",
    endDate: "04/04/2023",
    applyDate: "13/12/2022",
    days: 112,
    totalEarningAmount: 42418,
    createdBy: "Mst. Bablee khatun",
    createdDate: "05/04/2023 01:08:37",
    area: "PKCL-Savar",
    jobTitle: "Finishing Operator",
    subDepartment: "Finishing",
    monthlyWage: 9850,
    basicWage: 5910,
    houseRent: 2955,
    medical: 600,
    conveyance: 385,
    presentDays: 26,
    absentDays: 0,
    leaveDays: 0,
    holidayDays: 4,
    dailyWage: 378.85,
    total112Wage: 42431,
    firstInstallment: 21215,
    secondInstallment: 21216,
    inWordsBn: "একুশ হাজার দুই শত পোনের টাকা মাত্র।",
  },
  {
    id: "MP-2020021637",
    empId: "2020021637",
    empName: "Mrs. Liza Akter Banu",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    unit: "Unit-06",
    line: "31",
    joiningDate: "01/12/2020",
    eddDate: "24/02/2023",
    startDate: "30/12/2022",
    endDate: "20/04/2023",
    applyDate: "30/12/2022",
    days: 112,
    totalEarningAmount: 37081,
    createdBy: "Mrs. Liza Akter Banu",
    createdDate: "05/04/2023 01:29:47",
    area: "PKCL-Gazipur",
    jobTitle: "Sewing Operator",
    subDepartment: "Sewing",
    monthlyWage: 8600,
    basicWage: 5160,
    houseRent: 2580,
    medical: 500,
    conveyance: 360,
    presentDays: 26,
    absentDays: 0,
    leaveDays: 0,
    holidayDays: 4,
    dailyWage: 330.77,
    total112Wage: 37046,
    firstInstallment: 18523,
    secondInstallment: 18523,
    inWordsBn: "আঠারো হাজার পাঁচ শত তেইশ টাকা মাত্র।",
  },
  {
    id: "MP-2020021669",
    empId: "2020021669",
    empName: "Josna Begum",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    unit: "Unit-05",
    line: "04",
    joiningDate: "01/12/2020",
    eddDate: "10/04/2026",
    startDate: "09/02/2026",
    endDate: "08/06/2026",
    applyDate: "24/01/2026",
    days: 120,
    totalEarningAmount: 72175,
    createdBy: "Josna Begum",
    createdDate: "24/01/2026 10:06:14",
    area: "PKCL-Savar",
    jobTitle: "Senior Sewing Operator",
    subDepartment: "Sewing",
    monthlyWage: 15638,
    basicWage: 9382,
    houseRent: 4691,
    medical: 1000,
    conveyance: 565,
    presentDays: 26,
    absentDays: 0,
    leaveDays: 0,
    holidayDays: 4,
    dailyWage: 601.46,
    total112Wage: 72175,
    firstInstallment: 36087,
    secondInstallment: 36088,
    inWordsBn: "ছত্রিশ হাজার সাতাশি টাকা মাত্র।",
  },
  {
    id: "MP-2020021685",
    empId: "2020021685",
    empName: "Mrs. Aklima",
    empType: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    unit: "Unit-06",
    line: "29",
    joiningDate: "02/12/2020",
    eddDate: "25/03/2026",
    startDate: "24/01/2026",
    endDate: "23/05/2026",
    applyDate: "04/01/2026",
    days: 120,
    totalEarningAmount: 72175,
    createdBy: "Mrs. Aklima",
    createdDate: "04/01/2026 12:41:09",
    area: "PKCL-Savar",
    jobTitle: "Senior Operator",
    subDepartment: "Sewing",
    monthlyWage: 15638,
    basicWage: 9382,
    houseRent: 4691,
    medical: 1000,
    conveyance: 565,
    presentDays: 26,
    absentDays: 0,
    leaveDays: 0,
    holidayDays: 4,
    dailyWage: 601.46,
    total112Wage: 72175,
    firstInstallment: 36087,
    secondInstallment: 36088,
    inWordsBn: "ছত্রিশ হাজার সাতাশি টাকা মাত্র।",
  },
  {
    id: "MP-2020021702",
    empId: "2020021702",
    empName: "Mrs. Rubia Khatun",
    empType: "Worker",
    department: "Quality Assurance Department",
    section: "Finishing Quality",
    unit: "Unit-06",
    line: "N/A",
    joiningDate: "02/12/2020",
    eddDate: "30/08/2023",
    startDate: "05/07/2023",
    endDate: "24/10/2023",
    applyDate: "27/06/2023",
    days: 112,
    totalEarningAmount: 63913,
    createdBy: "Mrs. Rubia Khatun",
    createdDate: "27/06/2023 09:56:50",
    area: "Head Office",
    jobTitle: "Quality Inspector",
    subDepartment: "Finishing Quality",
    monthlyWage: 14840,
    basicWage: 8904,
    houseRent: 4452,
    medical: 900,
    conveyance: 584,
    presentDays: 26,
    absentDays: 0,
    leaveDays: 0,
    holidayDays: 4,
    dailyWage: 570.77,
    total112Wage: 63926,
    firstInstallment: 31963,
    secondInstallment: 31963,
    inWordsBn: "একত্রিশ হাজার নয় শত তেষট্টি টাকা মাত্র।",
  },
];

interface InModalSalaryRow {
  month: string;
  day: number;
  basic: number;
  houseRent: number;
  medical: number;
  conveyance: number;
  food: number;
  monthlyWages: number;
  present: number;
  abs: number;
  leave: number;
  holiday: number;
  absDeduct: number;
  attnBonus: number;
  wagesPayable: number;
  otHours: number;
  otRate: number;
  otAmount: number;
}

function MaternityPaymentPage() {
  // Database state
  const [records, setRecords] = useState<MaternityPaymentRecord[]>(initialMaternityPaymentRecords);

  // Filter States
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Toast notification
  const [toastMsg, setToastMsg] = useState("");

  // Main Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  // Modal Form Inputs
  const [modalArea, setModalArea] = useState("PKCL-Savar");
  const [modalApplyDate, setModalApplyDate] = useState("06/12/2023");
  const [modalEmpId, setModalEmpId] = useState("2020021174");
  const [modalEddDate, setModalEddDate] = useState("15/02/2024");
  const [modalEmpName, setModalEmpName] = useState("Mst. Rikta Akter");
  const [modalStartDate, setModalStartDate] = useState("21/12/2023");
  const [modalSubDept, setModalSubDept] = useState("Sample");
  const [modalEndDate, setModalEndDate] = useState("10/04/2024");
  const [modalJobTitle, setModalJobTitle] = useState("Sample Man");
  const [modalDays, setModalDays] = useState(112);
  const [modalJoiningDate, setModalJoiningDate] = useState("10/11/2020");

  // In-modal salary history state & calculations
  const [isLoadedHistory, setIsLoadedHistory] = useState(false);
  const [salaryHistoryRows, setSalaryHistoryRows] = useState<InModalSalaryRow[]>([]);
  
  // Bottom Calculation Fields
  const [epwd, setEpwd] = useState<number | "">("");
  const [et112Days, setEt112Days] = useState<number | "">("");
  const [pfMonth, setPfMonth] = useState("N/A");
  const [pfDeduct, setPfDeduct] = useState("0.00");
  const [firstInsPayable, setFirstInsPayable] = useState<number | "">("");
  const [firstInsDate, setFirstInsDate] = useState("");
  const [secondInsPayable, setSecondInsPayable] = useState<number | "">("");
  const [secondInsDate, setSecondInsDate] = useState("");

  // Official Bengali Bill Voucher View Modal State
  const [isBillVoucherOpen, setIsBillVoucherOpen] = useState(false);
  const [activeBillType, setActiveBillType] = useState<"1st" | "2nd">("1st");
  const [activeBillRecord, setActiveBillRecord] = useState<MaternityPaymentRecord | null>(null);

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        rec.empId.toLowerCase().includes(query) ||
        rec.empName.toLowerCase().includes(query) ||
        rec.department.toLowerCase().includes(query) ||
        rec.section.toLowerCase().includes(query) ||
        rec.empType.toLowerCase().includes(query);

      return matchesSearch;
    });
  }, [records, searchTerm]);

  // Open official Bengali Payment Bill Voucher view
  const handleOpenBillVoucher = (rec: MaternityPaymentRecord, type: "1st" | "2nd") => {
    setActiveBillRecord(rec);
    setActiveBillType(type);
    setIsBillVoucherOpen(true);
  };

  // Open modal for new record
  const handleOpenAddModal = () => {
    setModalMode("create");
    setSelectedRecordId(null);
    setModalArea("PKCL-Savar");
    setModalApplyDate(new Date().toISOString().slice(0, 10));
    setModalEmpId("");
    setModalEmpName("");
    setModalSubDept("");
    setModalJobTitle("");
    setModalJoiningDate("");
    setModalEddDate("");
    setModalStartDate("");
    setModalEndDate("");
    setModalDays(112);

    setSalaryHistoryRows([]);
    setIsLoadedHistory(false);
    setEpwd("");
    setEt112Days("");
    setFirstInsPayable("");
    setFirstInsDate("");
    setSecondInsPayable("");
    setSecondInsDate("");

    setIsModalOpen(true);
  };

  // Open modal for editing record
  const handleOpenEditModal = (rec: MaternityPaymentRecord) => {
    setModalMode("edit");
    setSelectedRecordId(rec.id);
    setModalArea(rec.area || "PKCL-Savar");
    setModalApplyDate(rec.applyDate);
    setModalEmpId(rec.empId);
    setModalEmpName(rec.empName);
    setModalSubDept(rec.section);
    setModalJobTitle(rec.jobTitle || rec.section);
    setModalJoiningDate(rec.joiningDate);
    setModalEddDate(rec.eddDate);
    setModalStartDate(rec.startDate);
    setModalEndDate(rec.endDate);
    setModalDays(rec.days);

    loadSalaryHistoryForRecord(rec);
    setIsModalOpen(true);
  };

  // Open modal for viewing record
  const handleOpenViewModal = (rec: MaternityPaymentRecord) => {
    setModalMode("view");
    setSelectedRecordId(rec.id);
    setModalArea(rec.area || "PKCL-Savar");
    setModalApplyDate(rec.applyDate);
    setModalEmpId(rec.empId);
    setModalEmpName(rec.empName);
    setModalSubDept(rec.section);
    setModalJobTitle(rec.jobTitle || rec.section);
    setModalJoiningDate(rec.joiningDate);
    setModalEddDate(rec.eddDate);
    setModalStartDate(rec.startDate);
    setModalEndDate(rec.endDate);
    setModalDays(rec.days);

    loadSalaryHistoryForRecord(rec);
    setIsModalOpen(true);
  };

  const handleModalEmpIdChange = (idVal: string) => {
    setModalEmpId(idVal);
    const matched = initialMaternityPaymentRecords.find((r) => r.empId === idVal.trim());
    if (matched) {
      setModalEmpName(matched.empName);
      setModalSubDept(matched.section);
      setModalJobTitle(matched.jobTitle || matched.section);
      setModalJoiningDate(matched.joiningDate);
    }
  };

  // Load 3-month salary history in modal
  const loadSalaryHistoryForRecord = (rec?: MaternityPaymentRecord) => {
    const totalEarning = rec ? rec.totalEarningAmount : 60000;
    const avgDaily = Number((totalEarning / 112).toFixed(2));
    const grossMonthly = rec?.monthlyWage || Math.round((totalEarning / 112) * 26);
    const basic = rec?.basicWage || Math.round(grossMonthly * 0.6);
    const houseRent = rec?.houseRent || Math.round(basic * 0.5);
    const medical = rec?.medical || 1500;
    const conveyance = rec?.conveyance || 1000;
    const food = grossMonthly - (basic + houseRent + medical + conveyance);

    const rows: InModalSalaryRow[] = [
      {
        month: "ডিসেম্বর-২০২২",
        day: 26,
        basic,
        houseRent,
        medical,
        conveyance,
        food: food > 0 ? food : 0,
        monthlyWages: grossMonthly,
        present: 26,
        abs: 0,
        leave: 0,
        holiday: 5,
        absDeduct: 0,
        attnBonus: 0,
        wagesPayable: grossMonthly,
        otHours: 0,
        otRate: 201.92,
        otAmount: 0,
      },
    ];

    setSalaryHistoryRows(rows);
    setIsLoadedHistory(true);

    const epwdVal = avgDaily;
    const total112 = Number((avgDaily * (rec ? rec.days : 112)).toFixed(2));
    const firstHalf = rec?.firstInstallment || Number((total112 / 2).toFixed(2));
    const secondHalf = rec?.secondInstallment || Number((total112 - firstHalf).toFixed(2));

    setEpwd(epwdVal);
    setEt112Days(total112);
    setFirstInsPayable(firstHalf);
    setFirstInsDate(rec ? rec.startDate : "10/01/2023");
    setSecondInsPayable(secondHalf);
    setSecondInsDate(rec ? rec.endDate : "01/05/2023");
  };

  const handleModalLoad = () => {
    if (!modalEmpId) {
      alert("Please enter Employee Id first!");
      return;
    }
    loadSalaryHistoryForRecord();
  };

  // Delete record action
  const handleDeleteRecord = (id: string, empName: string) => {
    if (confirm(`Are you sure you want to delete Maternity Payment record for ${empName}?`)) {
      setRecords(records.filter((r) => r.id !== id));
      setToastMsg(`Record ${id} deleted successfully.`);
      setTimeout(() => setToastMsg(""), 4000);
    }
  };

  // Save / Update Modal Form
  const handleSaveModal = () => {
    if (!modalEmpId || !modalEmpName) {
      alert("Please complete the required Employee ID and Name fields!");
      return;
    }

    if (modalMode === "edit" && selectedRecordId) {
      const updated = records.map((r) => {
        if (r.id === selectedRecordId) {
          return {
            ...r,
            empId: modalEmpId,
            empName: modalEmpName,
            section: modalSubDept,
            jobTitle: modalJobTitle,
            joiningDate: modalJoiningDate,
            eddDate: modalEddDate,
            startDate: modalStartDate,
            endDate: modalEndDate,
            applyDate: modalApplyDate,
            days: modalDays,
            totalEarningAmount: typeof et112Days === "number" ? et112Days : r.totalEarningAmount,
          };
        }
        return r;
      });
      setRecords(updated);
      setToastMsg(`Maternity Payment record for ${modalEmpName} updated successfully.`);
    } else {
      const newRec: MaternityPaymentRecord = {
        id: `MP-${modalEmpId || Date.now()}`,
        empId: modalEmpId,
        empName: modalEmpName,
        empType: "Worker",
        department: "RMG Operations",
        section: modalSubDept || "Sewing",
        unit: "Unit-06",
        line: "N/A",
        joiningDate: modalJoiningDate || "01/12/2020",
        eddDate: modalEddDate || "15/02/2026",
        startDate: modalStartDate || "01/01/2026",
        endDate: modalEndDate || "22/04/2026",
        applyDate: modalApplyDate || new Date().toISOString().slice(0, 10),
        days: modalDays,
        totalEarningAmount: typeof et112Days === "number" ? et112Days : 65000,
        createdBy: "HR Admin",
        createdDate: new Date().toLocaleString(),
        area: modalArea,
        jobTitle: modalJobTitle,
        subDepartment: modalSubDept,
        monthlyWage: 35000,
        basicWage: 21000,
        houseRent: 10500,
        medical: 2100,
        conveyance: 1400,
        presentDays: 26,
        absentDays: 0,
        leaveDays: 0,
        holidayDays: 5,
        dailyWage: 1346.15,
        total112Wage: 150769,
        firstInstallment: 75385,
        secondInstallment: 75385,
        inWordsBn: "পঁচাত্তর হাজার তিন শত পঁচাশি টাকা মাত্র।",
      };
      setRecords([newRec, ...records]);
      setToastMsg(`New Maternity Payment record for ${modalEmpName} created successfully.`);
    }

    setTimeout(() => setToastMsg(""), 5000);
    setIsModalOpen(false);
  };

  // Export CSV
  const handleExportExcel = () => {
    const headers = [
      "Emp Id",
      "Employee Name",
      "Employee Type",
      "Department",
      "Section",
      "Unit",
      "Line",
      "Joining Date",
      "EDD Date",
      "Start Date",
      "End Date",
      "Apply Date",
      "Days",
      "Total Earning Amount",
      "CreatedBy",
      "CreatedDate",
    ];

    const rows = filteredRecords.map((r) => [
      r.empId,
      r.empName,
      r.empType,
      r.department,
      r.section,
      r.unit,
      r.line,
      r.joiningDate,
      r.eddDate,
      r.startDate,
      r.endDate,
      r.applyDate,
      r.days,
      r.totalEarningAmount,
      r.createdBy,
      r.createdDate,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${val}"`).join(",")),
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Maternity_Payment_Registry_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans overflow-hidden">
      {/* Primary Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar />

        {/* Top Header Card with Breadcrumb & Prominent Top '+ Add New Maternity Payment' Button */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-500">Leave</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Maternity Payment
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <ShieldCheck size={14} /> Total Records: {records.length}
            </span>

            {/* Top Primary '+ Add New Maternity Payment' Button (Matching other HR pages) */}
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-all uppercase tracking-wider"
            >
              <Plus size={16} />
              <span>Add New Maternity Payment</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

          {/* Toast Notification */}
          {toastMsg && (
            <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-sm animate-fadeIn">
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <CheckCircle2 size={18} className="text-emerald-600" />
                {toastMsg}
              </div>
              <button
                onClick={() => setToastMsg("")}
                className="text-emerald-600 hover:text-emerald-800 text-xs font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            {/* Top Date Range Search Controls */}
            <div className="flex flex-wrap items-end gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-500 dark:text-slate-400 font-medium">Date From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 dark:text-slate-400 font-medium">Date To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <button
                type="button"
                className="h-8 px-5 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
              >
                <Search size={13} />
                SEARCH
              </button>
            </div>

            {/* Action Bar (EXCEL, PRINT, PDF, Top Add New, Search input) */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="px-3.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <FileSpreadsheet size={14} className="text-emerald-600" />
                  EXCEL
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Printer size={14} className="text-slate-600" />
                  PRINT
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <FileDown size={14} className="text-rose-600" />
                  PDF
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 ml-2"
                >
                  <Plus size={14} />
                  Add New
                </button>
              </div>

              {/* Instant Search Textbox */}
              <div className="flex items-center gap-2 text-xs">
                <label className="text-slate-500 font-medium">Search:</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by Emp ID, Name, Dept..."
                  className="h-8 px-2.5 w-64 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>

          </div>

          {/* Main Table View */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs min-w-[1600px]">
                <thead>
                  <tr className="bg-[#bce0fd] dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700 font-bold">
                    <th className="py-3 px-3 text-center w-36">View / Actions</th>
                    <th className="py-3 px-3">Emp Id</th>
                    <th className="py-3 px-3">Employee Name</th>
                    <th className="py-3 px-3">Employee Type</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Section</th>
                    <th className="py-3 px-3">Unit</th>
                    <th className="py-3 px-3">Line</th>
                    <th className="py-3 px-3">Joining Date</th>
                    <th className="py-3 px-3">EDD Date</th>
                    <th className="py-3 px-3">Start Date</th>
                    <th className="py-3 px-3">End Date</th>
                    <th className="py-3 px-3">Apply Date</th>
                    <th className="py-3 px-3 text-center">Days</th>
                    <th className="py-3 px-3 text-right">Total Earning Amount</th>
                    <th className="py-3 px-3">CreatedBy</th>
                    <th className="py-3 px-3">CreatedDate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRecords.map((rec) => (
                    <tr
                      key={rec.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-slate-700 dark:text-slate-300"
                    >
                      {/* Action Buttons:
                          1. 1st Payment Bill View (১ম কিস্তি) - Sleek Indigo
                          2. 2nd Payment Bill View (২য় কিস্তি) - Sleek Rose/Purple
                          3. Edit Record - Sleek Amber
                          4. Delete Record - Sleek Crimson
                      */}
                      <td className="py-2 px-2 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          
                          {/* 1st Payment Bill View Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenBillVoucher(rec, "1st")}
                            title="১ম কিস্তি বিল (1st Payment Bill)"
                            className="p-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white transition-all shadow-sm flex items-center justify-center"
                          >
                            <FileText size={13} />
                          </button>

                          {/* 2nd Payment Bill View Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenBillVoucher(rec, "2nd")}
                            title="২য় কিস্তি বিল (2nd Payment Bill)"
                            className="p-1.5 rounded-md bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white transition-all shadow-sm flex items-center justify-center"
                          >
                            <FileCheck size={13} />
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(rec)}
                            title="সম্পাদনা (Edit Record)"
                            className="p-1.5 rounded-md bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white transition-all shadow-sm flex items-center justify-center"
                          >
                            <Edit size={13} />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteRecord(rec.id, rec.empName)}
                            title="মুছে ফেলুন (Delete Record)"
                            className="p-1.5 rounded-md bg-slate-700 hover:bg-red-600 active:bg-red-700 text-white transition-all shadow-sm flex items-center justify-center"
                          >
                            <Trash2 size={13} />
                          </button>

                        </div>
                      </td>

                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {rec.empId}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                        {rec.empName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                        {rec.empType}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                        {rec.department}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                        {rec.section}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                        {rec.unit}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                        {rec.line}
                      </td>
                      <td className="py-2.5 px-3">{rec.joiningDate}</td>
                      <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400 font-medium">
                        {rec.eddDate}
                      </td>
                      <td className="py-2.5 px-3">{rec.startDate}</td>
                      <td className="py-2.5 px-3">{rec.endDate}</td>
                      <td className="py-2.5 px-3 text-slate-500">{rec.applyDate}</td>
                      <td className="py-2.5 px-3 text-center font-bold">{rec.days}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-rose-700 dark:text-rose-400">
                        ৳{rec.totalEarningAmount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px]">{rec.createdBy}</td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px] font-mono">
                        {rec.createdDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
              <div>Showing 61 to 80 of 261 entries</div>
              <div className="flex items-center gap-1 font-medium">
                <button className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-white">
                  Previous
                </button>
                <button className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-white">
                  1
                </button>
                <button className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-white">
                  2
                </button>
                <button className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-white">
                  3
                </button>
                <button className="px-2.5 py-1 rounded border border-blue-500 bg-blue-500 text-white font-bold">
                  4
                </button>
                <button className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-white">
                  5
                </button>
                <span className="px-1 text-slate-400">…</span>
                <button className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-white">
                  14
                </button>
                <button className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-white">
                  Next
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* OFFICIAL BENGALI MATERNITY BENEFIT BILL VIEW MODAL */}
      {isBillVoucherOpen && activeBillRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none print:w-full">
            
            {/* Modal Control Bar */}
            <div className="px-6 py-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-slate-800">
                  মাতৃত্বকালীন ছুটির সুবিধাদি বিল ({activeBillType === "1st" ? "প্রথম পেমেন্ট" : "দ্বিতীয় পেমেন্ট"})
                </span>
                <div className="flex items-center bg-white rounded border border-slate-300 p-0.5 text-xs font-bold">
                  <button
                    onClick={() => setActiveBillType("1st")}
                    className={`px-3 py-1 rounded ${
                      activeBillType === "1st" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    ১ম কিস্তি বিল (1st Payment)
                  </button>
                  <button
                    onClick={() => setActiveBillType("2nd")}
                    className={`px-3 py-1 rounded ${
                      activeBillType === "2nd" ? "bg-rose-600 text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    ২য় কিস্তি বিল (2nd Payment)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Printer size={14} /> প্রিন্ট করুন (Print)
                </button>
                <button
                  type="button"
                  onClick={() => setIsBillVoucherOpen(false)}
                  className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Print Voucher Container */}
            <div className="flex-1 overflow-y-auto p-8 font-sans space-y-6 text-slate-900 bg-white">
              
              {/* Header Letterhead */}
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-rose-600 text-white font-black text-xl tracking-tighter rounded font-serif">
                    PAKIZA
                  </div>
                </div>

                <div className="text-center flex-1 pr-12">
                  <h1 className="text-xl font-extrabold text-slate-900 font-serif">
                    পাকিজা নীট কম্পোজিট লিঃ
                  </h1>
                  <p className="text-xs text-slate-600 mt-0.5">
                    এ-১/৫,মজিদপুর (বড়বলি মেহের),সাভার,ঢাকা
                  </p>
                  <h2 className="text-base font-bold text-slate-900 mt-2 tracking-wide underline underline-offset-4">
                    মাতৃত্বকালীন ছুটির সুবিধাদি বিল
                  </h2>
                </div>
              </div>

              {/* Table 1: Employee & Bill Information Table */}
              <div className="border border-slate-400 text-xs">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300 w-36">আবেদনের তারিখ</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 w-4 font-mono">:</td>
                      <td className="py-1.5 px-3 border-r border-slate-300">{activeBillRecord.applyDate}</td>
                      <td className="py-1.5 px-3 border-r border-slate-300"></td>
                      <td className="py-1.5 px-3 border-r border-slate-300 w-4 font-mono"></td>
                      <td className="py-1.5 px-3"></td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">আইডি নং</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-mono">:</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-bold">{activeBillRecord.empId}</td>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300 w-44">প্রত্যাশিত ডেলিভারির তারিখ</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-mono">:</td>
                      <td className="py-1.5 px-3 font-semibold text-rose-700">{activeBillRecord.eddDate}</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">নাম</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-mono">:</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-bold">{activeBillRecord.empName}</td>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">ছুটির মেয়াদ</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-mono">:</td>
                      <td className="py-1.5 px-3">
                        {activeBillRecord.startDate} <span className="mx-2 font-bold">হতে</span> {activeBillRecord.endDate}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">পদবী</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-mono">:</td>
                      <td className="py-1.5 px-3 border-r border-slate-300">{activeBillRecord.jobTitle || activeBillRecord.section}</td>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">বিলের বিবরণ</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-mono">:</td>
                      <td className="py-1.5 px-3 font-bold text-blue-800">
                        {activeBillType === "1st" ? "প্রথম পেমেন্ট" : "দ্বিতীয় পেমেন্ট"}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">বিভাগ</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-mono">:</td>
                      <td className="py-1.5 px-3 border-r border-slate-300">{activeBillRecord.subDepartment || activeBillRecord.department}</td>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">বিলের তারিখ</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-mono">:</td>
                      <td className="py-1.5 px-3"></td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">যোগদানের তারিখ</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-mono">:</td>
                      <td className="py-1.5 px-3 border-r border-slate-300">{activeBillRecord.joiningDate}</td>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">পরিশোধিত দিন (এই বিলের মাধ্যমে)</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-mono">:</td>
                      <td className="py-1.5 px-3 font-bold">৫৬</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section 2 Title */}
              <div className="font-bold text-xs underline text-slate-900">
                বিবরণঃ
              </div>

              {/* Table 2: Monthly Salary Breakdown Table */}
              <div className="border border-slate-400 text-xs">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300 w-36">মাসের নাম</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-bold w-40">ডিসেম্বর-২০২২</td>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300 w-36">উপস্থিত</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 text-center font-bold w-24">26</td>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300 w-36">প্রাপ্ত মজুরী</td>
                      <td className="py-1.5 px-3 font-bold text-right">{(activeBillRecord.monthlyWage || 35000).toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">মূল মজুরী</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-bold">{(activeBillRecord.basicWage || 21000).toLocaleString()}</td>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">অনুপস্থিত</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 text-center">0</td>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">ওভারটাইম ঘন্টা</td>
                      <td className="py-1.5 px-3 text-right font-mono">0.00</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">বাড়ী ভাড়া</td>
                      <td className="py-1.5 px-3 border-r border-slate-300">{(activeBillRecord.houseRent || 10500).toLocaleString()}</td>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">ছুটি</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 text-center">0</td>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">ওভারটাইম হার</td>
                      <td className="py-1.5 px-3 text-right font-mono">201.92</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">চিকিৎসা ভাতা</td>
                      <td className="py-1.5 px-3 border-r border-slate-300">{(activeBillRecord.medical || 2100).toLocaleString()}</td>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">সাপ্তাহিক ছুটি</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 text-center">5</td>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">মোট ওভারটাইম</td>
                      <td className="py-1.5 px-3 text-right">0</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">যাতায়াত ভাতা</td>
                      <td className="py-1.5 px-3 border-r border-slate-300">{(activeBillRecord.conveyance || 1400).toLocaleString()}</td>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">অনুপস্থিত কর্তন</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 text-center">0</td>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">বোনাস</td>
                      <td className="py-1.5 px-3 text-right">0</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">খাদ্য ভাতা</td>
                      <td className="py-1.5 px-3 border-r border-slate-300">0</td>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">হাজিরা বোনাস</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 text-center">0</td>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">মোট অর্জিত মজুরী</td>
                      <td className="py-1.5 px-3 font-bold text-right text-rose-700">{(activeBillRecord.monthlyWage || 35000).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">মাসিক মজুরী</td>
                      <td className="py-1.5 px-3 border-r border-slate-300 font-bold">{(activeBillRecord.monthlyWage || 35000).toLocaleString()}</td>
                      <td className="py-1.5 px-3 border-r border-slate-300"></td>
                      <td className="py-1.5 px-3 border-r border-slate-300"></td>
                      <td className="py-1.5 px-3 border-r border-slate-300"></td>
                      <td className="py-1.5 px-3"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section 3 Title & Formulas */}
              <div className="space-y-2 pt-1 text-xs">
                <h3 className="font-bold underline text-slate-900">
                  মাতৃত্বকালীন ছুটির হিসাব বিবরণীঃ
                </h3>

                <div className="space-y-1.5 font-medium pl-2">
                  <div className="flex items-center gap-3">
                    <span className="w-40 font-bold">একদিনের গড় মজুরী</span>
                    <span>=</span>
                    <div className="inline-flex items-center gap-1 font-mono">
                      <span className="border-b border-slate-900 px-1 font-bold">{(activeBillRecord.monthlyWage || 35000)}</span>
                      <span>/</span>
                      <span className="px-1">26</span>
                    </div>
                    <span>=</span>
                    <span className="font-bold font-mono">{(activeBillRecord.dailyWage || 1346.15)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-40 font-bold">মোট মজুরী</span>
                    <span>=</span>
                    <span className="font-mono">{(activeBillRecord.dailyWage || 1346.15)}</span>
                    <span>×</span>
                    <span className="font-mono">112</span>
                    <span>=</span>
                    <span className="font-bold font-mono">{(activeBillRecord.total112Wage || 150769)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-40 font-bold">ভবিষ্যৎ তহবিলে প্রদেয় চাঁদার পরিমান</span>
                    <span>=</span>
                    <span className="font-bold font-mono">0</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-40 font-bold text-blue-900">
                      {activeBillType === "1st" ? "প্রথম কিস্তি" : "দ্বিতীয় কিস্তি"}
                    </span>
                    <span>=</span>
                    <span className="font-bold text-rose-700 font-mono text-sm">
                      {activeBillType === "1st"
                        ? (activeBillRecord.firstInstallment || 75385).toLocaleString()
                        : (activeBillRecord.secondInstallment || 75385).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="w-20 font-bold">কথায়</span>
                    <span>=</span>
                    <span className="font-bold text-slate-900 underline underline-offset-2">
                      {activeBillRecord.inWordsBn || "পঁচাত্তর হাজার তিন শত পঁচাশি টাকা মাত্র।"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attachments checklist */}
              <div className="space-y-1 text-xs pt-1">
                <div className="font-bold underline text-slate-900">সংযুক্তিঃ</div>
                <div className="pl-6 space-y-0.5 text-slate-800">
                  <div>১) ছুটি ফর্মের ফটোকপি।</div>
                  <div>২) বিগত এক মাসের মজুরী শীট।</div>
                  <div>৩) বিগত এক মাসের জব কার্ড।</div>
                  <div>৪) ঈদ বোনাস শীট (যদি থাকে)।</div>
                  <div>৫) অর্জিত ছুটির নগদায়ন শীট (যদি থাকে)।</div>
                </div>
              </div>

              {/* Official Signature Lines Footer */}
              <div className="pt-12 grid grid-cols-7 gap-2 text-[10px] text-center font-bold text-slate-900">
                <div className="border-t border-slate-900 pt-1">
                  প্রস্তুতকারী
                  <div className="font-normal text-[9px] text-slate-600">(মানব সম্পদ)</div>
                </div>
                <div className="border-t border-slate-900 pt-1">
                  কল্যাণ কর্মকর্তা
                  <div className="font-normal text-[9px] text-slate-600">(কমপ্লায়েন্স বিভাগ)</div>
                </div>
                <div className="border-t border-slate-900 pt-1">
                  সহকারী ব্যবস্থাপক
                  <div className="font-normal text-[9px] text-slate-600">(কমপ্লায়েন্স বিভাগ)</div>
                </div>
                <div className="border-t border-slate-900 pt-1">
                  নিরীক্ষাকারী
                  <div className="font-normal text-[9px] text-slate-600">(ইন্টারনাল অডিট)</div>
                </div>
                <div className="border-t border-slate-900 pt-1">
                  সিনিঃ ব্যবস্থাপক
                  <div className="font-normal text-[9px] text-slate-600">(অর্থ ও হিসাব)</div>
                </div>
                <div className="border-t border-slate-900 pt-1">
                  ব্যবস্থাপক
                  <div className="font-normal text-[9px] text-slate-600">(মানব সম্পদ ও কমপ্লায়েন্স)</div>
                </div>
                <div className="border-t border-slate-900 pt-1">
                  গ্রহীতার স্বাক্ষর
                  <div className="font-normal text-[9px] text-slate-700">({activeBillRecord.empName})</div>
                  <div className="font-normal text-[9px] text-slate-500">{activeBillRecord.jobTitle || "অফিসার"}</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Maternity Payment Add/Edit/View Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Coins size={20} className="text-blue-600" />
                Maternity Payment {modalMode === "create" ? "Form" : modalMode === "edit" ? "Edit" : "Details"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              
              {/* Form Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                    <label className="block text-[11px] text-slate-400 font-medium">Area</label>
                    <select
                      value={modalArea}
                      onChange={(e) => setModalArea(e.target.value)}
                      disabled={modalMode === "view"}
                      className="w-full bg-transparent py-1 font-bold text-slate-800 dark:text-slate-100 outline-none border-b border-blue-500"
                    >
                      <option value="PKCL-Savar">PKCL-Savar</option>
                      <option value="PKCL-Gazipur">PKCL-Gazipur</option>
                      <option value="Head Office">Head Office</option>
                    </select>
                  </div>

                  <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                    <label className="block text-[11px] text-slate-400 font-medium">Employee Id</label>
                    <input
                      type="text"
                      value={modalEmpId}
                      onChange={(e) => handleModalEmpIdChange(e.target.value)}
                      disabled={modalMode === "view"}
                      placeholder="Enter Emp ID"
                      className="w-full bg-transparent py-1 font-bold text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                    <label className="block text-[11px] text-slate-400 font-medium">Employee Name</label>
                    <input
                      type="text"
                      value={modalEmpName}
                      onChange={(e) => setModalEmpName(e.target.value)}
                      disabled={modalMode === "view"}
                      className="w-full bg-transparent py-1 font-bold text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                    <label className="block text-[11px] text-slate-400 font-medium">Sub Department</label>
                    <input
                      type="text"
                      value={modalSubDept}
                      onChange={(e) => setModalSubDept(e.target.value)}
                      disabled={modalMode === "view"}
                      className="w-full bg-transparent py-1 text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                    <label className="block text-[11px] text-slate-400 font-medium">Job Title</label>
                    <input
                      type="text"
                      value={modalJobTitle}
                      onChange={(e) => setModalJobTitle(e.target.value)}
                      disabled={modalMode === "view"}
                      className="w-full bg-transparent py-1 text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                    <label className="block text-[11px] text-slate-400 font-medium">Date Of Joining</label>
                    <input
                      type="text"
                      value={modalJoiningDate}
                      onChange={(e) => setModalJoiningDate(e.target.value)}
                      disabled={modalMode === "view"}
                      className="w-full bg-transparent py-1 text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                    <label className="block text-[11px] text-slate-400 font-medium">Apply Date</label>
                    <input
                      type="text"
                      value={modalApplyDate}
                      onChange={(e) => setModalApplyDate(e.target.value)}
                      disabled={modalMode === "view"}
                      className="w-full bg-transparent py-1 text-slate-800 dark:text-slate-100 outline-none font-medium"
                    />
                  </div>

                  <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                    <label className="block text-[11px] text-slate-400 font-medium">EDD Date</label>
                    <input
                      type="text"
                      value={modalEddDate}
                      onChange={(e) => setModalEddDate(e.target.value)}
                      disabled={modalMode === "view"}
                      className="w-full bg-transparent py-1 text-slate-800 dark:text-slate-100 outline-none font-medium text-rose-600"
                    />
                  </div>

                  <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                    <label className="block text-[11px] text-slate-400 font-medium">Start Date</label>
                    <input
                      type="text"
                      value={modalStartDate}
                      onChange={(e) => setModalStartDate(e.target.value)}
                      disabled={modalMode === "view"}
                      className="w-full bg-transparent py-1 text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                    <label className="block text-[11px] text-slate-400 font-medium">End Date</label>
                    <input
                      type="text"
                      value={modalEndDate}
                      onChange={(e) => setModalEndDate(e.target.value)}
                      disabled={modalMode === "view"}
                      className="w-full bg-transparent py-1 text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                    <label className="block text-[11px] text-slate-400 font-medium">Days</label>
                    <input
                      type="number"
                      value={modalDays}
                      onChange={(e) => setModalDays(Number(e.target.value))}
                      disabled={modalMode === "view"}
                      className="w-full bg-transparent py-1 font-bold text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleModalLoad}
                      className="px-5 py-1.5 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow"
                    >
                      LOAD
                    </button>
                  </div>
                </div>

              </div>

              {/* Salary History Section inside modal */}
              <div className="space-y-2 pt-2">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  Salary History
                </h3>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded">
                  <table className="w-full text-left border-collapse min-w-[900px] text-[11px]">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200">
                        <th className="py-2 px-2 border-r">Month</th>
                        <th className="py-2 px-2 border-r text-center">Day</th>
                        <th className="py-2 px-2 border-r text-right">Basic</th>
                        <th className="py-2 px-2 border-r text-right">Houserent</th>
                        <th className="py-2 px-2 border-r text-right">Medical</th>
                        <th className="py-2 px-2 border-r text-right">Conveyance</th>
                        <th className="py-2 px-2 border-r text-right">Food</th>
                        <th className="py-2 px-2 border-r text-right font-bold">Monthly Wages</th>
                        <th className="py-2 px-2 border-r text-center">Present</th>
                        <th className="py-2 px-2 border-r text-center">Abs</th>
                        <th className="py-2 px-2 border-r text-center">Leave</th>
                        <th className="py-2 px-2 border-r text-center">Holiday</th>
                        <th className="py-2 px-2 border-r text-right">Abs. Deduct</th>
                        <th className="py-2 px-2 border-r text-right">Attn. Bonus</th>
                        <th className="py-2 px-2 border-r text-right font-bold">Wages Payable</th>
                        <th className="py-2 px-2 border-r text-center">OT Hours</th>
                        <th className="py-2 px-2 border-r text-right">OT Rate</th>
                        <th className="py-2 px-2 text-right">OT Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salaryHistoryRows.length === 0 ? (
                        <tr>
                          <td colSpan={18} className="py-6 text-center text-slate-400 italic">
                            No salary history loaded. Click LOAD button above.
                          </td>
                        </tr>
                      ) : (
                        salaryHistoryRows.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-1.5 px-2 border-r font-bold">{row.month}</td>
                            <td className="py-1.5 px-2 border-r text-center">{row.day}</td>
                            <td className="py-1.5 px-2 border-r text-right">{row.basic}</td>
                            <td className="py-1.5 px-2 border-r text-right">{row.houseRent}</td>
                            <td className="py-1.5 px-2 border-r text-right">{row.medical}</td>
                            <td className="py-1.5 px-2 border-r text-right">{row.conveyance}</td>
                            <td className="py-1.5 px-2 border-r text-right">{row.food}</td>
                            <td className="py-1.5 px-2 border-r text-right font-bold">{row.monthlyWages}</td>
                            <td className="py-1.5 px-2 border-r text-center text-emerald-600">{row.present}</td>
                            <td className="py-1.5 px-2 border-r text-center text-rose-500">{row.abs}</td>
                            <td className="py-1.5 px-2 border-r text-center">{row.leave}</td>
                            <td className="py-1.5 px-2 border-r text-center">{row.holiday}</td>
                            <td className="py-1.5 px-2 border-r text-right">{row.absDeduct}</td>
                            <td className="py-1.5 px-2 border-r text-right">{row.attnBonus}</td>
                            <td className="py-1.5 px-2 border-r text-right font-bold">{row.wagesPayable}</td>
                            <td className="py-1.5 px-2 border-r text-center">{row.otHours}</td>
                            <td className="py-1.5 px-2 border-r text-right">{row.otRate}</td>
                            <td className="py-1.5 px-2 text-right">{row.otAmount}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Benefit Calculation Summary Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 pt-3">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                  <label className="block text-[11px] text-slate-400 font-medium">EPWD</label>
                  <input
                    type="text"
                    readOnly
                    value={epwd}
                    placeholder="Earnings Per Working Day"
                    className="w-full bg-transparent py-1 font-bold text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>

                <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                  <label className="block text-[11px] text-slate-400 font-medium">ET For {modalDays} Days</label>
                  <input
                    type="text"
                    readOnly
                    value={et112Days}
                    placeholder="Earnings Total"
                    className="w-full bg-transparent py-1 font-bold text-rose-600 dark:text-rose-400 outline-none"
                  />
                </div>

                <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                  <label className="block text-[11px] text-slate-400 font-medium">PF Month</label>
                  <input
                    type="text"
                    value={pfMonth}
                    onChange={(e) => setPfMonth(e.target.value)}
                    disabled={modalMode === "view"}
                    className="w-full bg-transparent py-1 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>

                <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                  <label className="block text-[11px] text-slate-400 font-medium">PF Deduct</label>
                  <input
                    type="text"
                    value={pfDeduct}
                    onChange={(e) => setPfDeduct(e.target.value)}
                    disabled={modalMode === "view"}
                    className="w-full bg-transparent py-1 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>

                <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                  <label className="block text-[11px] text-slate-400 font-medium">1st ins. payable for 56 days</label>
                  <input
                    type="text"
                    readOnly
                    value={firstInsPayable}
                    className="w-full bg-transparent py-1 font-bold text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>

                <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                  <label className="block text-[11px] text-slate-400 font-medium">1st instalment date</label>
                  <input
                    type="text"
                    value={firstInsDate}
                    onChange={(e) => setFirstInsDate(e.target.value)}
                    disabled={modalMode === "view"}
                    className="w-full bg-transparent py-1 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>

                <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                  <label className="block text-[11px] text-slate-400 font-medium">2nd instalment payable at after birth of Baby</label>
                  <input
                    type="text"
                    readOnly
                    value={secondInsPayable}
                    className="w-full bg-transparent py-1 font-bold text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>

                <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                  <label className="block text-[11px] text-slate-400 font-medium">2nd instalment date</label>
                  <input
                    type="text"
                    value={secondInsDate}
                    onChange={(e) => setSecondInsDate(e.target.value)}
                    disabled={modalMode === "view"}
                    className="w-full bg-transparent py-1 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Modal Footer Buttons */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50 dark:bg-slate-800/60">
              {modalMode !== "view" && (
                <button
                  type="button"
                  onClick={handleSaveModal}
                  className="px-5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow transition-all"
                >
                  {modalMode === "edit" ? "UPDATE" : "SAVE"}
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow transition-all"
              >
                CLOSE
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
