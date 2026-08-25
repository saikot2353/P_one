import { Fragment, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Search,
  FileDown,
  Printer,
  FileText,
  ChevronRight,
  Eye,
  ChevronDown,
  LayoutGrid,
} from "lucide-react";

export const Route = createFileRoute("/monthly-salary-details")({
  head: () => ({
    meta: [
      { title: "Monthly Salary Details — CRIPTON HRIS" },
      { name: "description", content: "Monthly Salary Details Report" },
    ],
  }),
  component: MonthlySalaryDetailsPage,
});

export const mockData = [
  {
    "sl": "1",
    "statusType": "Regular",
    "empId": "2025058109",
    "empIdOff": "",
    "name": "Mohammad Methoun Ahmed",
    "joinDate": "22/12/2025",
    "empType": "Office Executive",
    "department": "Business Automation",
    "section": "Core Development",
    "designation": "Sr. Manager",
    "totalPay": "128333"
  },
  {
    "sl": "2",
    "statusType": "Regular",
    "empId": "2026058685",
    "empIdOff": "",
    "name": "Md Johirul Islam",
    "joinDate": "15/02/2026",
    "empType": "Office Executive",
    "department": "Business Automation",
    "section": "Core Development",
    "designation": "Executive",
    "totalPay": "36750"
  },
  {
    "sl": "3",
    "statusType": "Regular",
    "empId": "2022035599",
    "empIdOff": "",
    "name": "Dipon Saha",
    "joinDate": "07/05/2022",
    "empType": "Office Executive",
    "department": "Business Automation (HR)",
    "section": "Core Development (HR)",
    "designation": "Manager",
    "totalPay": "68340"
  },
  {
    "sl": "4",
    "statusType": "Regular",
    "empId": "2024052333",
    "empIdOff": "",
    "name": "Mohammad Rahatul Islam",
    "joinDate": "01/10/2024",
    "empType": "Office Executive",
    "department": "Business Automation (HR)",
    "section": "Core Development (HR)",
    "designation": "Sr. Executive",
    "totalPay": "46750"
  },
  {
    "sl": "5",
    "statusType": "Regular",
    "empId": "2024052410",
    "empIdOff": "",
    "name": "Dipan Kumar Kundu",
    "joinDate": "15/10/2024",
    "empType": "Office Executive",
    "department": "Business Automation (HR)",
    "section": "Core Development (HR)",
    "designation": "Sr. Executive",
    "totalPay": "39750"
  },
  {
    "sl": "6",
    "statusType": "Regular",
    "empId": "2025057067",
    "empIdOff": "",
    "name": "Sunit Corneleous Sarker",
    "joinDate": "01/10/2025",
    "empType": "Office Executive",
    "department": "Business Automation (HR)",
    "section": "Core Development (HR)",
    "designation": "Executive",
    "totalPay": "33750"
  },
  {
    "sl": "7",
    "statusType": "Regular",
    "empId": "2021028542",
    "empIdOff": "",
    "name": "Zakir Hossain",
    "joinDate": "09/10/2021",
    "empType": "Office Executive",
    "department": "Business Automation (HR)",
    "section": "Implementation & Support (HR)",
    "designation": "Executive",
    "totalPay": "29620"
  },
  {
    "sl": "8",
    "statusType": "Regular",
    "empId": "2023044017",
    "empIdOff": "",
    "name": "Md. Rejaul Karim",
    "joinDate": "13/08/2023",
    "empType": "Office Executive",
    "department": "Business Automation (HR)",
    "section": "Implementation & Support (HR)",
    "designation": "Deputy Manager",
    "totalPay": "61750"
  },
  {
    "sl": "9",
    "statusType": "Regular",
    "empId": "2025055045",
    "empIdOff": "",
    "name": "Md. Mahfuzur Rahman",
    "joinDate": "03/05/2025",
    "empType": "Office Executive",
    "department": "Business Automation (HR)",
    "section": "Implementation & Support (HR)",
    "designation": "Jr. Executive",
    "totalPay": "20310"
  },
  {
    "sl": "10",
    "statusType": "Regular",
    "empId": "2023044012",
    "empIdOff": "",
    "name": "Tanver Rahman Shaon",
    "joinDate": "01/01/2025",
    "empType": "Office Executive",
    "department": "Business Development",
    "section": "Core Sales",
    "designation": "Deputy Manager",
    "totalPay": "48333"
  },
  {
    "sl": "11",
    "statusType": "Regular",
    "empId": "2025053377",
    "empIdOff": "",
    "name": "Md. Maruf Hossen",
    "joinDate": "05/01/2025",
    "empType": "Office Executive",
    "department": "Business Development",
    "section": "Core Sales",
    "designation": "Asst. Manager",
    "totalPay": "52910"
  },
  {
    "sl": "12",
    "statusType": "Regular",
    "empId": "2025053380",
    "empIdOff": "",
    "name": "Miraz Uddin",
    "joinDate": "06/01/2025",
    "empType": "Office Executive",
    "department": "Business Development",
    "section": "Core Sales",
    "designation": "Jr. Executive",
    "totalPay": "22750"
  },
  {
    "sl": "13",
    "statusType": "Regular",
    "empId": "2025054315",
    "empIdOff": "",
    "name": "Md. Shahinur Alahi Khan",
    "joinDate": "16/02/2025",
    "empType": "Office Executive",
    "department": "Business Development",
    "section": "Core Sales",
    "designation": "Asst. Manager",
    "totalPay": "58750"
  },
  {
    "sl": "14",
    "statusType": "Regular",
    "empId": "2023043909",
    "empIdOff": "",
    "name": "Md. Ashanur Kabir",
    "joinDate": "01/08/2023",
    "empType": "Office Executive",
    "department": "Business Development",
    "section": "Digital Marketing",
    "designation": "Manager",
    "totalPay": "78750"
  },
  {
    "sl": "15",
    "statusType": "Regular",
    "empId": "2024049326",
    "empIdOff": "",
    "name": "Hanif Uddin",
    "joinDate": "01/06/2024",
    "empType": "Office Executive",
    "department": "Business Innovation",
    "section": "APPS Team",
    "designation": "Sr. Executive",
    "totalPay": "38750"
  },
  {
    "sl": "16",
    "statusType": "Regular",
    "empId": "2026058726",
    "empIdOff": "",
    "name": "Parvej Mahmud",
    "joinDate": "22/02/2026",
    "empType": "Office Executive",
    "department": "Business Innovation",
    "section": "APPS Team",
    "designation": "Executive",
    "totalPay": "47850"
  },
  {
    "sl": "17",
    "statusType": "Regular",
    "empId": "2023043910",
    "empIdOff": "",
    "name": "Tahmid Afsar",
    "joinDate": "01/08/2023",
    "empType": "Office Executive",
    "department": "Business Innovation",
    "section": "Project Resource & Strategy",
    "designation": "Deputy Manager",
    "totalPay": "59673"
  },
  {
    "sl": "18",
    "statusType": "Regular",
    "empId": "2025054609",
    "empIdOff": "",
    "name": "Md Mahir Shahriyar",
    "joinDate": "15/03/2025",
    "empType": "Office Executive",
    "department": "Business Innovation",
    "section": "Project Resource & Strategy",
    "designation": "Jr. Executive",
    "totalPay": "31750"
  },
  {
    "sl": "19",
    "statusType": "Regular",
    "empId": "2024049166",
    "empIdOff": "",
    "name": "MD Maimoon Hossain Shomoy",
    "joinDate": "18/05/2024",
    "empType": "Office Executive",
    "department": "Business Innovation",
    "section": "WEB-Team",
    "designation": "Sr. Executive",
    "totalPay": "41750"
  },
  {
    "sl": "20",
    "statusType": "Regular",
    "empId": "2024051510",
    "empIdOff": "",
    "name": "Md. Sadmanur Islam Shishir",
    "joinDate": "01/09/2024",
    "empType": "Office Executive",
    "department": "Business Innovation",
    "section": "WEB-Team",
    "designation": "Jr. Executive",
    "totalPay": "25750"
  },
  {
    "sl": "21",
    "statusType": "Regular",
    "empId": "2023044078",
    "empIdOff": "",
    "name": "Md. Anik Islam",
    "joinDate": "16/08/2023",
    "empType": "Office Executive",
    "department": "Business Innovation",
    "section": "WEB-Team",
    "designation": "Deputy Manager",
    "totalPay": "74530"
  },
  {
    "sl": "22",
    "statusType": "Regular",
    "empId": "2025053125",
    "empIdOff": "",
    "name": "Al Riyad Karim",
    "joinDate": "12/01/2025",
    "empType": "Office Executive",
    "department": "Business Innovation",
    "section": "WEB-Team",
    "designation": "Sr. Executive",
    "totalPay": "44750"
  },
  {
    "sl": "23",
    "statusType": "Regular",
    "empId": "2025054707",
    "empIdOff": "",
    "name": "Allama Bakhtiyar Nafis",
    "joinDate": "16/04/2025",
    "empType": "Office Executive",
    "department": "Business Innovation",
    "section": "WEB-Team",
    "designation": "Jr. Executive",
    "totalPay": "23250"
  },
  {
    "sl": "24",
    "statusType": "Regular",
    "empId": "2025054710",
    "empIdOff": "",
    "name": "Raihan Jami Khan",
    "joinDate": "16/04/2025",
    "empType": "Office Executive",
    "department": "Business Innovation",
    "section": "WEB-Team",
    "designation": "Jr. Executive",
    "totalPay": "23750"
  },
  {
    "sl": "25",
    "statusType": "Regular",
    "empId": "2026059418",
    "empIdOff": "",
    "name": "Md Robayet Hasan Yeasin",
    "joinDate": "10/05/2026",
    "empType": "Office Executive",
    "department": "Business Innovation",
    "section": "WEB-Team",
    "designation": "Jr. Executive",
    "totalPay": "28750"
  },
  {
    "sl": "26",
    "statusType": "Regular",
    "empId": "2026059427",
    "empIdOff": "",
    "name": "Mir Md Moshiu Islam",
    "joinDate": "11/05/2026",
    "empType": "Office Executive",
    "department": "Business Innovation",
    "section": "WEB-Team",
    "designation": "Jr. Executive",
    "totalPay": "23750"
  },
  {
    "sl": "27",
    "statusType": "Regular",
    "empId": "2026059573",
    "empIdOff": "",
    "name": "Md. Piyash Hasan",
    "joinDate": "10/06/2026",
    "empType": "Office Executive",
    "department": "Business Innovation",
    "section": "WEB-Team",
    "designation": "Executive",
    "totalPay": "37950"
  },
  {
    "sl": "28",
    "statusType": "New",
    "empId": "2026060310",
    "empIdOff": "",
    "name": "Md. Shahid Hasan",
    "joinDate": "01/07/2026",
    "empType": "Office Executive",
    "department": "Business Innovation",
    "section": "WEB-Team",
    "designation": "Sr. Executive",
    "totalPay": "43830"
  },
  {
    "sl": "29",
    "statusType": "New",
    "empId": "2026060987",
    "empIdOff": "",
    "name": "Shahadath Hossain Tamim",
    "joinDate": "20/07/2026",
    "empType": "Office Executive",
    "department": "Business Innovation",
    "section": "WEB-Team",
    "designation": "Asst. Manager",
    "totalPay": "39603"
  },
  {
    "sl": "30",
    "statusType": "Regular",
    "empId": "2024053060",
    "empIdOff": "",
    "name": "Md. Mahfujul Haque",
    "joinDate": "10/12/2024",
    "empType": "Office Executive",
    "department": "Core Development",
    "section": "General ERP (Com, A/C, Fixed Asset, Vat)",
    "designation": "Manager",
    "totalPay": "86333"
  },
  {
    "sl": "31",
    "statusType": "Regular",
    "empId": "2024053062",
    "empIdOff": "",
    "name": "Mohammad Mayhedi Hasan",
    "joinDate": "10/12/2024",
    "empType": "Office Executive",
    "department": "Core Development",
    "section": "General ERP (Com, A/C, Fixed Asset, Vat)",
    "designation": "Deputy Manager",
    "totalPay": "72750"
  },
  {
    "sl": "32",
    "statusType": "Regular",
    "empId": "2025053673",
    "empIdOff": "",
    "name": "Md Jahid Hasan Polok",
    "joinDate": "20/01/2025",
    "empType": "Office Executive",
    "department": "Core Development",
    "section": "General ERP (Com, A/C, Fixed Asset, Vat)",
    "designation": "Sr. Executive",
    "totalPay": "43830"
  },
  {
    "sl": "33",
    "statusType": "Regular",
    "empId": "2025054614",
    "empIdOff": "",
    "name": "Md. Rana Miah",
    "joinDate": "07/04/2025",
    "empType": "Office Executive",
    "department": "Core Development",
    "section": "General ERP (Com, A/C, Fixed Asset, Vat)",
    "designation": "Sr. Executive",
    "totalPay": "55590"
  },
  {
    "sl": "34",
    "statusType": "Regular",
    "empId": "2023043974",
    "empIdOff": "",
    "name": "Md. Anwar Hossain",
    "joinDate": "09/08/2023",
    "empType": "Office Executive",
    "department": "Core Development",
    "section": "Merchandising-Purchase-MCD",
    "designation": "Asst. Manager",
    "totalPay": "80750"
  },
  {
    "sl": "35",
    "statusType": "Regular",
    "empId": "2024051507",
    "empIdOff": "",
    "name": "S.M Rakib Rahman Tuhin",
    "joinDate": "01/09/2024",
    "empType": "Office Executive",
    "department": "Core Development",
    "section": "RMG-Production-IE & Planning",
    "designation": "Asst. Manager",
    "totalPay": "67350"
  },
  {
    "sl": "36",
    "statusType": "Regular",
    "empId": "2024052335",
    "empIdOff": "",
    "name": "Md. Al Amin",
    "joinDate": "01/10/2024",
    "empType": "Office Executive",
    "department": "Core Development",
    "section": "RMG-Production-IE & Planning",
    "designation": "Sr. Executive",
    "totalPay": "49750"
  },
  {
    "sl": "37",
    "statusType": "Regular",
    "empId": "2025056560",
    "empIdOff": "",
    "name": "Md. Rafsan Kabir",
    "joinDate": "01/09/2025",
    "empType": "Office Executive",
    "department": "Core Development",
    "section": "RMG-Production-IE & Planning",
    "designation": "Jr. Executive",
    "totalPay": "18750"
  },
  {
    "sl": "38",
    "statusType": "Regular",
    "empId": "2024046961",
    "empIdOff": "",
    "name": "Sumaya Siddika",
    "joinDate": "03/01/2024",
    "empType": "Office Executive",
    "department": "Core Development",
    "section": "Textile Team",
    "designation": "Deputy Manager",
    "totalPay": "66000"
  },
  {
    "sl": "39",
    "statusType": "Regular",
    "empId": "2025054548",
    "empIdOff": "",
    "name": "Md Rahat Hossain",
    "joinDate": "06/03/2025",
    "empType": "Office Executive",
    "department": "Database Administrator (DBA)",
    "section": "DBA",
    "designation": "Asst. Manager",
    "totalPay": "63070"
  },
  {
    "sl": "40",
    "statusType": "Regular",
    "empId": "2023046001",
    "empIdOff": "",
    "name": "Sohanur Rahman Sohan",
    "joinDate": "01/11/2023",
    "empType": "Office Executive",
    "department": "HR, Admin and Compliance",
    "section": "Admin",
    "designation": "Executive",
    "totalPay": "17415"
  },
  {
    "sl": "41",
    "statusType": "Regular",
    "empId": "2023043021",
    "empIdOff": "",
    "name": "Easin Mia",
    "joinDate": "01/02/2023",
    "empType": "Office Executive",
    "department": "HR, Admin and Compliance",
    "section": "Admin",
    "designation": "Receptionist",
    "totalPay": "17750"
  },
  {
    "sl": "42",
    "statusType": "Regular",
    "empId": "2026059411",
    "empIdOff": "",
    "name": "Jannatul Maowa",
    "joinDate": "10/05/2026",
    "empType": "Office Executive",
    "department": "HR, Admin and Compliance",
    "section": "Admin",
    "designation": "Jr. Executive",
    "totalPay": "18350"
  },
  {
    "sl": "43",
    "statusType": "Regular",
    "empId": "2025057068",
    "empIdOff": "",
    "name": "Riazul Islam",
    "joinDate": "01/10/2025",
    "empType": "Office Executive",
    "department": "Implementation & Business Analysis",
    "section": "Accounts & Vat",
    "designation": "Asst. Manager",
    "totalPay": "48750"
  },
  {
    "sl": "44",
    "statusType": "Regular",
    "empId": "2023045044",
    "empIdOff": "",
    "name": "Sultan Ahmed",
    "joinDate": "01/10/2023",
    "empType": "Office Executive",
    "department": "Implementation & Business Analysis",
    "section": "Business Analysis",
    "designation": "Sr. Manager",
    "totalPay": "89272"
  },
  {
    "sl": "45",
    "statusType": "Regular",
    "empId": "2024051509",
    "empIdOff": "",
    "name": "Irfan Hossain",
    "joinDate": "01/09/2024",
    "empType": "Office Executive",
    "department": "Implementation & Business Analysis",
    "section": "ERP Team",
    "designation": "Jr. Executive",
    "totalPay": "25480"
  },
  {
    "sl": "46",
    "statusType": "Regular",
    "empId": "2024051508",
    "empIdOff": "",
    "name": "Pabitra Khasnabish Druba",
    "joinDate": "01/09/2024",
    "empType": "Office Executive",
    "department": "Implementation & Business Analysis",
    "section": "ERP Team",
    "designation": "Sr. Executive",
    "totalPay": "50000"
  },
  {
    "sl": "47",
    "statusType": "Regular",
    "empId": "2023046544",
    "empIdOff": "",
    "name": "Mazharul Haque",
    "joinDate": "02/12/2023",
    "empType": "Office Executive",
    "department": "Implementation & Business Analysis",
    "section": "ERP Team",
    "designation": "Deputy Manager",
    "totalPay": "66750"
  }
];

function MonthlySalaryDetailsPage() {
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Jul");
  const [salaryType, setSalaryType] = useState("ALL(Reguler,New Employee)");
  const [payOption, setPayOption] = useState("ALL");
  const [bankName, setBankName] = useState("");
  
  const [empType, setEmpType] = useState(["Office Executive"]);
  const [department, setDepartment] = useState("All Departments");
  const [section, setSection] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  
  const [line, setLine] = useState("ALL");
  const [empIdInput, setEmpIdInput] = useState("");
  const [outputMode, setOutputMode] = useState("System");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const filteredData = mockData.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.empId.includes(searchQuery)
  );

  const handleOpenPayslip = (lang: "en" | "bn") => {
    localStorage.setItem("print_payslip_data", JSON.stringify(filteredData));
    window.open(`/payslip-print?lang=${lang}`, "_blank");
  };

  const handleOpenSalarySheet = () => {
    const filtersData = {
      year,
      month,
      empType,
      department,
      unit,
      line
    };
    localStorage.setItem("print_salary_sheet_data", JSON.stringify(filteredData));
    localStorage.setItem("print_salary_sheet_filters", JSON.stringify(filtersData));
    window.open(`/salary-sheet-print`, "_blank");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto bg-muted/20">
        <Topbar />

        <div className="p-4 md:p-6 space-y-6 w-full max-w-[1600px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3.5" />
            <Link to="/payroll-reports" className="hover:text-foreground transition-colors">Payroll Reports</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-semibold">Monthly Salary Details</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
                <FileText className="size-6 text-primary" />
                Monthly Salary Details
              </h1>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-card rounded-2xl border border-border/60 p-5 shadow-sm space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Year</label>
                <SearchableSelect
                  value={year}
                  onChange={setYear}
                  options={[{ value: "2026", label: "2026" }, { value: "2025", label: "2025" }]}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Month</label>
                <SearchableSelect
                  value={month}
                  onChange={setMonth}
                  options={[{ value: "Jul", label: "Jul" }, { value: "Aug", label: "Aug" }]}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Salary Type</label>
                <SearchableSelect
                  value={salaryType}
                  onChange={setSalaryType}
                  options={[{ value: "ALL(Reguler,New Employee)", label: "ALL(Reguler,New Employee)" }]}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Pay Option</label>
                <SearchableSelect
                  value={payOption}
                  onChange={setPayOption}
                  options={[{ value: "ALL", label: "ALL" }]}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Bank Name</label>
                <SearchableSelect
                  value={bankName}
                  onChange={setBankName}
                  options={[]}
                  placeholder="Select Bank"
                />
              </div>
            </div>
            
            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Employee Type</label>
                <MultiSelect
                  selected={empType}
                  onChange={setEmpType}
                  options={[
                    { value: "Office Executive", label: "Office Executive" },
                    { value: "Worker", label: "Worker" },
                    { value: "Staff", label: "Staff" }
                  ]}
                  placeholder="Select Employee Type"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Department</label>
                <SearchableSelect
                  value={department}
                  onChange={setDepartment}
                  options={[{ value: "All Departments", label: "All Departments" }]}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Section</label>
                <SearchableSelect
                  value={section}
                  onChange={setSection}
                  options={[{ value: "ALL", label: "ALL" }]}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Unit</label>
                <SearchableSelect
                  value={unit}
                  onChange={setUnit}
                  options={[{ value: "ALL", label: "ALL" }]}
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Line</label>
                <SearchableSelect
                  value={line}
                  onChange={setLine}
                  options={[{ value: "ALL", label: "ALL" }]}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Employee Id</label>
                <input
                  type="text"
                  value={empIdInput}
                  onChange={(e) => setEmpIdInput(e.target.value)}
                  placeholder="use comma as separator"
                  className="w-full h-10 px-3 rounded-xl border border-border/80 bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/60"
                />
              </div>
              <div className="flex flex-col gap-2 pl-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="outputMode"
                    value="System"
                    checked={outputMode === "System"}
                    onChange={(e) => setOutputMode(e.target.value)}
                    className="size-4 accent-primary"
                  />
                  <span>System</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="outputMode"
                    value="Office"
                    checked={outputMode === "Office"}
                    onChange={(e) => setOutputMode(e.target.value)}
                    className="size-4 accent-primary"
                  />
                  <span>Office</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <button className="h-10 px-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all uppercase tracking-wide">
                  Get Salary Data
                </button>
                <button className="h-10 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all uppercase tracking-wide">
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Action Button Grid Accordion */}
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setIsActionsOpen(!isActionsOpen)}
              className="w-full p-4 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                  <LayoutGrid className="size-4" />
                </div>
                <h2 className="text-sm font-bold text-foreground">Advanced Report Actions</h2>
              </div>
              <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-300 ${isActionsOpen ? "rotate-180" : ""}`} />
            </button>
            
            {isActionsOpen && (
              <div className="p-5 border-t border-border/60 bg-card space-y-5 animate-in slide-in-from-top-2 fade-in duration-200">
                {/* Row 1 */}
                <div className="flex flex-wrap gap-2">
                  <ReportBtn onClick={() => handleOpenPayslip("en")}>Pay Slip-English</ReportBtn>
                  <ReportBtn onClick={() => handleOpenPayslip("bn")}>Pay Slip-Bangla</ReportBtn>
                  <ReportBtn onClick={handleOpenSalarySheet}>Salary Sheet</ReportBtn>
                  <ReportBtn onClick={handleOpenSalarySheet}>Dept.Wise Salary Sheet</ReportBtn>
                  <ReportBtn onClick={handleOpenSalarySheet}>Salary Sheet(Exec)</ReportBtn>
                  <ReportBtn>Bank Sheet(Exec)</ReportBtn>
                  <ReportBtn>Export Bank Sheet(Exec)</ReportBtn>
                </div>
                
                {/* Row 2 */}
                <div className="flex flex-wrap gap-2">
                  <ReportBtn onClick={() => handleOpenPayslip("en")}>Pay Slip-English</ReportBtn>
                  <ReportBtn onClick={() => handleOpenPayslip("bn")}>Pay Slip-Bangla</ReportBtn>
                  <ReportBtn onClick={() => handleOpenPayslip("bn")}>Pay Slip-Bangla(WH)</ReportBtn>
                  <ReportBtn onClick={handleOpenSalarySheet}>Salary Sheet Full(Without Holiday)</ReportBtn>
                  <ReportBtn onClick={handleOpenSalarySheet}>Salary Sheet Full(WH)</ReportBtn>
                  <ReportBtn>OT Sheet(Holiday)</ReportBtn>
                  <ReportBtn>Cash Sheet(Exec)</ReportBtn>
                  <ReportBtn>Export Cash Sheet(Exec)</ReportBtn>
                </div>

                {/* Row 3 */}
                <div className="flex flex-wrap gap-2">
                  <ReportBtn onClick={() => handleOpenPayslip("bn")}>Pay Slip-Bangla(2Hr)</ReportBtn>
                  <ReportBtn onClick={() => handleOpenPayslip("bn")}>Pay Slip-Bangla(3Hr)</ReportBtn>
                  <ReportBtn onClick={handleOpenSalarySheet}>Salary Sheet(2Hr)</ReportBtn>
                  <ReportBtn onClick={handleOpenSalarySheet}>Salary Sheet(3Hr)</ReportBtn>
                  <ReportBtn onClick={handleOpenSalarySheet}>Salary Sheet(4HR)</ReportBtn>
                </div>

                {/* Row 4 */}
                <div className="flex flex-wrap gap-2">
                  <ReportBtn onClick={() => handleOpenPayslip("en")}>Pay Slip(NT)</ReportBtn>
                  <ReportBtn onClick={handleOpenSalarySheet}>Salary Sheet(NT)</ReportBtn>
                </div>

                {/* Row 5 */}
                <div className="flex flex-wrap gap-2">
                  <ReportBtn>Bank Forwarding(A)</ReportBtn>
                  <ReportBtn>Bank Forwarding(2)</ReportBtn>
                  <ReportBtn>Bank Forwarding(3)</ReportBtn>
                  <ReportBtn>Bank Forwarding(NT)</ReportBtn>
                </div>
              </div>
            )}
          </div>

          {/* Action Toolbar & Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="h-9 px-4 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm">
                <FileText className="size-4" /> EXCEL
              </button>
              <button className="h-9 px-4 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm">
                <Printer className="size-4" /> PRINT
              </button>
              <button className="h-9 px-4 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm">
                <FileDown className="size-4" /> PDF
              </button>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-border/80 bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/60 shadow-sm"
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto overflow-y-auto max-h-[700px] relative">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-muted/95 backdrop-blur-sm text-muted-foreground uppercase font-bold text-[10px] tracking-wider sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-4 py-3 border-r border-border/30 w-12 text-center">SL</th>
                    <th className="px-3 py-3 w-10"></th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Emp Id</th>
                    <th className="px-4 py-3">Emp Id(Off)</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Join Date</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Section</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3 text-right">Total Pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredData.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-4 py-3 text-center border-r border-border/30 text-muted-foreground font-medium">
                        {row.sl}
                      </td>
                      <td className="px-3 py-3">
                        <button className="p-1 rounded bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors">
                          <Search className="size-3.5" />
                        </button>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${row.statusType === "New" ? "bg-amber-500/10 text-amber-600" : "bg-blue-500/10 text-blue-600"}`}>
                          {row.statusType}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">{row.empId}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.empIdOff || "—"}</td>
                      <td className="px-4 py-3 font-bold text-foreground">{row.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.joinDate}</td>
                      <td className="px-4 py-3">{row.empType}</td>
                      <td className="px-4 py-3">{row.department}</td>
                      <td className="px-4 py-3">{row.section}</td>
                      <td className="px-4 py-3">{row.designation}</td>
                      <td className="px-4 py-3 text-right font-bold text-foreground">{row.totalPay}</td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={12} className="px-4 py-8 text-center text-muted-foreground font-medium">
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ReportBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="h-9 px-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 hover:shadow-md text-primary text-xs font-bold transition-all duration-300 whitespace-nowrap flex items-center gap-2 group">
      <FileText className="size-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
      {children}
    </button>
  );
}
