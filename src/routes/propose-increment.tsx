import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { EvaluationTabNav } from "@/components/evaluation/EvaluationTabNav";
import {
  ChevronRight,
  Sparkles,
  Search,
  FileSpreadsheet,
  Printer,
  FileDown,
  Trash2,
  PenTool,
  Check,
  X,
} from "lucide-react";

export const Route = createFileRoute("/propose-increment")({
  head: () => ({
    meta: [
      { title: "Propose Increment — CRIPTON" },
      { name: "description", content: "Submit and manage performance-based salary increments." },
    ],
  }),
  component: ProposeIncrementPage,
});

interface ProposeRecord {
  sl: number;
  empId: string;
  name: string;
  designation: string;
  department: string;
  section: string;
  grade: string;
  joiningDate: string;
  salary: number;
  jobDuration: string;
  lastInc: number;
  lastIncDate: string;
  proposeInc: number;
  proposeProm: string;
  tillAfterSalary: number;
  remarks: string;
  status: "Pending" | "Approved";
}

const initial42Records: ProposeRecord[] = [
  {
    sl: 1,
    empId: "2024053060",
    name: "Md. Mahfujul Haque",
    designation: "Manager",
    department: "Core Development",
    section: "General ERP (Com, A/C, Fixed Asset, Vat)",
    grade: "None",
    joiningDate: "10/12/2024",
    salary: 88000.0,
    jobDuration: "1 year 1 month 22 days",
    lastInc: 0,
    lastIncDate: "",
    proposeInc: 8000,
    proposeProm: "Manager",
    tillAfterSalary: 88000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 2,
    empId: "2024053062",
    name: "Mohammad Mayhedi Hasan",
    designation: "Deputy Manager",
    department: "Core Development",
    section: "General ERP (Com, A/C, Fixed Asset, Vat)",
    grade: "None",
    joiningDate: "10/12/2024",
    salary: 74000.0,
    jobDuration: "1 year 1 month 22 days",
    lastInc: 0,
    lastIncDate: "",
    proposeInc: 4000,
    proposeProm: "Deputy Manager",
    tillAfterSalary: 74000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 3,
    empId: "2025053377",
    name: "Md. Maruf Hossen",
    designation: "Asst. Manager",
    department: "Business Development",
    section: "Core Sales",
    grade: "None",
    joiningDate: "05/01/2025",
    salary: 58000.0,
    jobDuration: "1 year 0 month 27 days",
    lastInc: 0,
    lastIncDate: "",
    proposeInc: 3000,
    proposeProm: "Asst. Manager",
    tillAfterSalary: 58000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 4,
    empId: "2025053673",
    name: "Md Jahid Hasan Polok",
    designation: "Sr. Executive",
    department: "Core Development",
    section: "General ERP (Com, A/C, Fixed Asset, Vat)",
    grade: "None",
    joiningDate: "20/01/2025",
    salary: 46000.0,
    jobDuration: "1 year 0 month 12 days",
    lastInc: 0,
    lastIncDate: "",
    proposeInc: 6000,
    proposeProm: "Sr. Executive",
    tillAfterSalary: 46000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 5,
    empId: "2025054315",
    name: "Md. Shahinur Alahi Khan",
    designation: "Asst. Manager",
    department: "Business Development",
    section: "Core Sales",
    grade: "None",
    joiningDate: "16/02/2025",
    salary: 53000.0,
    jobDuration: "0 year 11 month 16 days",
    lastInc: 0,
    lastIncDate: "",
    proposeInc: 3000,
    proposeProm: "Asst. Manager",
    tillAfterSalary: 53000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 6,
    empId: "2025054548",
    name: "Md Rahat Hossain",
    designation: "Asst. Manager",
    department: "Database Administrator (DBA)",
    section: "DBA",
    grade: "None",
    joiningDate: "06/03/2025",
    salary: 67000.0,
    jobDuration: "0 year 10 month 26 days",
    lastInc: 0,
    lastIncDate: "",
    proposeInc: 2000,
    proposeProm: "Asst. Manager",
    tillAfterSalary: 67000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 7,
    empId: "2025055045",
    name: "Md. Mahfuzur Rahman",
    designation: "Jr. Executive",
    department: "Business Automation (HR)",
    section: "Implementation & Support (HR)",
    grade: "None",
    joiningDate: "03/05/2025",
    salary: 22000.0,
    jobDuration: "0 year 8 month 29 days",
    lastInc: 0,
    lastIncDate: "",
    proposeInc: 4000,
    proposeProm: "Jr. Executive",
    tillAfterSalary: 22000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 8,
    empId: "2025055747",
    name: "Sabbir Hossen Babu",
    designation: "Office Boy",
    department: "HR, Admin and Compliance",
    section: "Admin",
    grade: "None",
    joiningDate: "13/07/2025",
    salary: 11500.0,
    jobDuration: "0 year 6 month 19 days",
    lastInc: 0,
    lastIncDate: "",
    proposeInc: 1500,
    proposeProm: "Office Boy",
    tillAfterSalary: 11500,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 9,
    empId: "2025056473",
    name: "Hasnain",
    designation: "Cleaner",
    department: "HR, Admin and Compliance",
    section: "Admin",
    grade: "None",
    joiningDate: "20/08/2025",
    salary: 12000.0,
    jobDuration: "0 year 5 month 12 days",
    lastInc: 0,
    lastIncDate: "",
    proposeInc: 1000,
    proposeProm: "Cleaner",
    tillAfterSalary: 12000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 10,
    empId: "2025056560",
    name: "Md. Rafsan Kabir",
    designation: "Jr. Executive",
    department: "Core Development",
    section: "RMG-Production-IE & Planning",
    grade: "None",
    joiningDate: "01/09/2025",
    salary: 20000.0,
    jobDuration: "0 year 4 month 0 days",
    lastInc: 0,
    lastIncDate: "",
    proposeInc: 5000,
    proposeProm: "Jr. Executive",
    tillAfterSalary: 20000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 11,
    empId: "2025057437",
    name: "Towhidur Rahman",
    designation: "Executive",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "18/10/2025",
    salary: 27000.0,
    jobDuration: "0 year 3 month 14 days",
    lastInc: 0,
    lastIncDate: "",
    proposeInc: 2000,
    proposeProm: "Executive",
    tillAfterSalary: 27000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 12,
    empId: "2025054609",
    name: "Md Mahir Shahriyar",
    designation: "Jr. Executive",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "15/03/2025",
    salary: 33000.0,
    jobDuration: "0 year 10 month 17 days",
    lastInc: 3000,
    lastIncDate: "01/06/2025",
    proposeInc: 5000,
    proposeProm: "Jr. Executive",
    tillAfterSalary: 33000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 13,
    empId: "2025054707",
    name: "Allama Bakhtiyar Nafis",
    designation: "Jr. Executive",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "16/04/2025",
    salary: 25000.0,
    jobDuration: "0 year 9 month 16 days",
    lastInc: 4000,
    lastIncDate: "01/07/2025",
    proposeInc: 6000,
    proposeProm: "Jr. Executive",
    tillAfterSalary: 25000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 14,
    empId: "2025054710",
    name: "Raihan Jami Khan",
    designation: "Jr. Executive",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "16/04/2025",
    salary: 25000.0,
    jobDuration: "0 year 9 month 16 days",
    lastInc: 4000,
    lastIncDate: "01/07/2025",
    proposeInc: 6000,
    proposeProm: "Jr. Executive",
    tillAfterSalary: 25000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 15,
    empId: "2025053380",
    name: "Miraz Uddin",
    designation: "Jr. Executive",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "06/01/2025",
    salary: 24000.0,
    jobDuration: "1 year 0 month 26 days",
    lastInc: 1000,
    lastIncDate: "01/05/2025",
    proposeInc: 3000,
    proposeProm: "Jr. Executive",
    tillAfterSalary: 24000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 16,
    empId: "2025053125",
    name: "Al Riyad Karim",
    designation: "Sr. Executive",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "12/01/2025",
    salary: 46000.0,
    jobDuration: "1 year 0 month 20 days",
    lastInc: 3000,
    lastIncDate: "01/05/2025",
    proposeInc: 8000,
    proposeProm: "Sr. Executive",
    tillAfterSalary: 46000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 17,
    empId: "2023046543",
    name: "Md. Abdulla- Al- Mamun",
    designation: "Asst. Manager",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "02/12/2023",
    salary: 60000.0,
    jobDuration: "2 year 1 month 30 days",
    lastInc: 5000,
    lastIncDate: "01/01/2025",
    proposeInc: 5000,
    proposeProm: "Asst. Manager",
    tillAfterSalary: 60000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 18,
    empId: "2023046544",
    name: "Mazharul Haque",
    designation: "Deputy Manager",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "02/12/2023",
    salary: 68000.0,
    jobDuration: "2 year 1 month 30 days",
    lastInc: 6000,
    lastIncDate: "01/01/2025",
    proposeInc: 10000,
    proposeProm: "Deputy Manager",
    tillAfterSalary: 68000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 19,
    empId: "2023044012",
    name: "Tanver Rahman Shaon",
    designation: "Asst. Manager",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "01/01/2025",
    salary: 46000.0,
    jobDuration: "1 year 0 month 0 days",
    lastInc: 3000,
    lastIncDate: "01/04/2025",
    proposeInc: 3000,
    proposeProm: "Asst. Manager",
    tillAfterSalary: 46000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 20,
    empId: "2023044017",
    name: "Md. Rejaul Karim",
    designation: "Deputy Manager",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "13/08/2023",
    salary: 63000.0,
    jobDuration: "2 year 5 month 19 days",
    lastInc: 5000,
    lastIncDate: "01/01/2025",
    proposeInc: 8000,
    proposeProm: "Deputy Manager",
    tillAfterSalary: 63000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 21,
    empId: "2024049166",
    name: "MD Maimoon Hossain Shomoy",
    designation: "Sr. Executive",
    department: "Core Development",
    section: "General Group",
    grade: "",
    joiningDate: "18/05/2024",
    salary: 43000.0,
    jobDuration: "1 year 8 month 14 days",
    lastInc: 5000,
    lastIncDate: "01/01/2025",
    proposeInc: 8000,
    proposeProm: "Sr. Executive",
    tillAfterSalary: 43000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 22,
    empId: "2024049326",
    name: "Hanif Uddin",
    designation: "Sr. Executive",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "01/06/2024",
    salary: 50000.0,
    jobDuration: "1 year 7 month 0 days",
    lastInc: 5000,
    lastIncDate: "01/01/2025",
    proposeInc: 10000,
    proposeProm: "Sr. Executive",
    tillAfterSalary: 50000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 23,
    empId: "2024051508",
    name: "Pabitra Khasnabish Druba",
    designation: "Sr. Executive",
    department: "Core Development",
    section: "General Group",
    grade: "",
    joiningDate: "01/09/2024",
    salary: 43000.0,
    jobDuration: "1 year 4 month 0 days",
    lastInc: 2000,
    lastIncDate: "01/01/2025",
    proposeInc: 6000,
    proposeProm: "Sr. Executive",
    tillAfterSalary: 43000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 24,
    empId: "2024051509",
    name: "Irfan Hossain",
    designation: "Jr. Executive",
    department: "Core Development",
    section: "General Group",
    grade: "",
    joiningDate: "01/09/2024",
    salary: 26000.0,
    jobDuration: "1 year 4 month 0 days",
    lastInc: 3000,
    lastIncDate: "01/01/2025",
    proposeInc: 3000,
    proposeProm: "Jr. Executive",
    tillAfterSalary: 26000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 25,
    empId: "2024051510",
    name: "Md. Sadmanur Islam Shishir",
    designation: "Jr. Executive",
    department: "Core Development",
    section: "General Group",
    grade: "",
    joiningDate: "01/09/2024",
    salary: 27000.0,
    jobDuration: "1 year 4 month 0 days",
    lastInc: 5000,
    lastIncDate: "01/01/2025",
    proposeInc: 7000,
    proposeProm: "Jr. Executive",
    tillAfterSalary: 27000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 26,
    empId: "2024052333",
    name: "Mohammad Rahatul Islam",
    designation: "Sr. Executive",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "01/10/2024",
    salary: 48000.0,
    jobDuration: "1 year 3 month 0 days",
    lastInc: 5000,
    lastIncDate: "01/01/2025",
    proposeInc: 8000,
    proposeProm: "Sr. Executive",
    tillAfterSalary: 48000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 27,
    empId: "2024052336",
    name: "Md. Badal Mia",
    designation: "Driver",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "01/10/2024",
    salary: 20700.0,
    jobDuration: "1 year 3 month 0 days",
    lastInc: 500,
    lastIncDate: "01/01/2025",
    proposeInc: 1200,
    proposeProm: "Driver",
    tillAfterSalary: 20700,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 28,
    empId: "2024052410",
    name: "Dipan Kumar Kundu",
    designation: "Sr. Executive",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "15/10/2024",
    salary: 41000.0,
    jobDuration: "1 year 3 month 17 days",
    lastInc: 3000,
    lastIncDate: "01/02/2025",
    proposeInc: 8000,
    proposeProm: "Sr. Executive",
    tillAfterSalary: 41000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 29,
    empId: "2023044078",
    name: "Md. Anik Islam",
    designation: "Deputy Manager",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "16/08/2023",
    salary: 79000.0,
    jobDuration: "2 year 5 month 16 days",
    lastInc: 7000,
    lastIncDate: "01/01/2025",
    proposeInc: 12000,
    proposeProm: "Deputy Manager",
    tillAfterSalary: 79000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 30,
    empId: "2023045146",
    name: "Asif Hossain",
    designation: "Driver",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "04/10/2023",
    salary: 21200.0,
    jobDuration: "2 year 3 month 28 days",
    lastInc: 1500,
    lastIncDate: "01/01/2025",
    proposeInc: 1200,
    proposeProm: "Driver",
    tillAfterSalary: 21200,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 31,
    empId: "2023046001",
    name: "Sohanur Rahman Sohan",
    designation: "Executive",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "01/11/2023",
    salary: 27000.0,
    jobDuration: "2 year 2 month 0 days",
    lastInc: 4500,
    lastIncDate: "01/01/2025",
    proposeInc: 5000,
    proposeProm: "Executive",
    tillAfterSalary: 27000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 32,
    empId: "2024046961",
    name: "Sumaya Siddika",
    designation: "Deputy Manager",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "03/01/2024",
    salary: 66000.0,
    jobDuration: "2 year 0 month 29 days",
    lastInc: 4000,
    lastIncDate: "01/01/2025",
    proposeInc: 10000,
    proposeProm: "Deputy Manager",
    tillAfterSalary: 66000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 33,
    empId: "2022040132",
    name: "Md. Sakil",
    designation: "Asst. Cook",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "29/10/2022",
    salary: 13900.0,
    jobDuration: "3 year 3 month 3 days",
    lastInc: 1200,
    lastIncDate: "01/01/2025",
    proposeInc: 1500,
    proposeProm: "Asst. Cook",
    tillAfterSalary: 13900,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 34,
    empId: "2022041203",
    name: "Khairul Bashar Masum",
    designation: "Asst. Manager",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "01/12/2022",
    salary: 46500.0,
    jobDuration: "3 year 1 month 0 days",
    lastInc: 2500,
    lastIncDate: "01/01/2025",
    proposeInc: 1000,
    proposeProm: "Asst. Manager",
    tillAfterSalary: 46500,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 35,
    empId: "2023043021",
    name: "Easin Mia",
    designation: "Receptionist",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "01/02/2023",
    salary: 19000.0,
    jobDuration: "2 year 11 month 0 days",
    lastInc: 2000,
    lastIncDate: "01/01/2025",
    proposeInc: 2500,
    proposeProm: "Receptionist",
    tillAfterSalary: 19000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 36,
    empId: "2023043577",
    name: "Md. Mostakim Shah",
    designation: "Office Boy",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "02/05/2023",
    salary: 14700.0,
    jobDuration: "2 year 8 month 30 days",
    lastInc: 2000,
    lastIncDate: "01/01/2025",
    proposeInc: 1500,
    proposeProm: "Office Boy",
    tillAfterSalary: 14700,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 37,
    empId: "2021023079",
    name: "Md. Monjur Alam",
    designation: "Driver",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "01/02/2023",
    salary: 21900.0,
    jobDuration: "2 year 11 month 0 days",
    lastInc: 1500,
    lastIncDate: "01/01/2025",
    proposeInc: 1200,
    proposeProm: "Driver",
    tillAfterSalary: 21900,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 38,
    empId: "2022035599",
    name: "Dipon Saha",
    designation: "Manager",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "07/05/2022",
    salary: 67000.0,
    jobDuration: "3 year 8 month 25 days",
    lastInc: 6000,
    lastIncDate: "01/01/2025",
    proposeInc: 8000,
    proposeProm: "Manager",
    tillAfterSalary: 67000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 39,
    empId: "2021028542",
    name: "Zakir Hossain",
    designation: "Executive",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "09/10/2021",
    salary: 31500.0,
    jobDuration: "4 year 3 month 23 days",
    lastInc: 2500,
    lastIncDate: "01/01/2025",
    proposeInc: 3000,
    proposeProm: "Executive",
    tillAfterSalary: 31500,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 40,
    empId: "2021032646",
    name: "Sadiqul Islam",
    designation: "Deputy Manager",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "22/12/2021",
    salary: 59000.0,
    jobDuration: "4 year 1 month 10 days",
    lastInc: 3000,
    lastIncDate: "01/01/2025",
    proposeInc: 3000,
    proposeProm: "Deputy Manager",
    tillAfterSalary: 59000,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 41,
    empId: "2021022804",
    name: "Kaikobad Howlader",
    designation: "Security Guard",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "12/01/2021",
    salary: 15700.0,
    jobDuration: "5 year 0 month 20 days",
    lastInc: 1000,
    lastIncDate: "01/01/2025",
    proposeInc: 1200,
    proposeProm: "Security Guard",
    tillAfterSalary: 15700,
    remarks: "",
    status: "Approved",
  },
  {
    sl: 42,
    empId: "2019013884",
    name: "Javed Mia",
    designation: "Helper (Cook)",
    department: "Core Development",
    section: "General Group",
    grade: "None",
    joiningDate: "12/01/2019",
    salary: 21200.0,
    jobDuration: "7 year 0 month 20 days",
    lastInc: 1000,
    lastIncDate: "01/01/2025",
    proposeInc: 1500,
    proposeProm: "Helper (Cook)",
    tillAfterSalary: 21200,
    remarks: "",
    status: "Approved",
  },
];

function ProposeIncrementPage() {
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Jan");
  const [approveStatus, setApproveStatus] = useState("Approved");
  const [company, setCompany] = useState("Pakiza Software Limited");
  const [area, setArea] = useState("PSL-Operation");
  const [empType, setEmpType] = useState("ALL");
  const [subDept, setSubDept] = useState("ALL");
  const [jobTitle, setJobTitle] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [gender, setGender] = useState("ALL");

  const [records, setRecords] = useState<ProposeRecord[]>(initial42Records);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Modal State
  const [editingRow, setEditingRow] = useState<ProposeRecord | null>(null);
  const [editProposeInc, setEditProposeInc] = useState(0);
  const [editProposeProm, setEditProposeProm] = useState("");
  const [editRemarks, setEditRemarks] = useState("");

  const filteredRecords = useMemo(() => {
    return records.filter((row) => {
      if (approveStatus !== "ALL" && row.status !== approveStatus) return false;
      if (subDept !== "ALL" && row.department !== subDept) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          row.name.toLowerCase().includes(q) ||
          row.empId.includes(q) ||
          row.designation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [records, approveStatus, subDept, searchQuery]);

  const handleDeleteRow = (empId: string) => {
    if (confirm("Are you sure you want to remove this proposed increment record?")) {
      setRecords((prev) => prev.filter((r) => r.empId !== empId));
    }
  };

  const handleOpenEdit = (row: ProposeRecord) => {
    setEditingRow(row);
    setEditProposeInc(row.proposeInc);
    setEditProposeProm(row.proposeProm);
    setEditRemarks(row.remarks);
  };

  const handleSaveEdit = () => {
    if (!editingRow) return;
    setRecords((prev) =>
      prev.map((r) => {
        if (r.empId === editingRow.empId) {
          return {
            ...r,
            proposeInc: editProposeInc,
            proposeProm: editProposeProm,
            tillAfterSalary: r.salary + editProposeInc,
            remarks: editRemarks,
          };
        }
        return r;
      }),
    );
    setEditingRow(null);
    alert("Record updated successfully.");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Breadcrumbs */}
          <div className="bg-card rounded-lg border border-border/85 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3" />
                <span>Evaluation</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">Propose Increment</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Sparkles className="size-5.5 text-primary animate-pulse" />
                <span>Propose Increment</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">Submit and manage performance-based salary increment proposals</p>
            </div>
          </div>

          {/* Evaluation Module Tab Nav */}
          <EvaluationTabNav />

          {/* PARAMETRIC FILTERS ROW */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  Month
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="Jan">Jan</option>
                  <option value="Dec">Dec</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  Approve Status
                </label>
                <select
                  value={approveStatus}
                  onChange={(e) => setApproveStatus(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  Company Name
                </label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="Pakiza Software Limited">Pakiza Software Limited</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  Area Name
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="PSL-Operation">PSL-Operation</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  Employee Type
                </label>
                <select
                  value={empType}
                  onChange={(e) => setEmpType(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="ALL">ALL</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-3 border-t border-border/20">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  Sub Department
                </label>
                <select
                  value={subDept}
                  onChange={(e) => setSubDept(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="ALL">ALL</option>
                  <option value="Core Development">Core Development</option>
                  <option value="Business Development">Business Development</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">
                  Job Title
                </label>
                <select
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Line</label>
                <select
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                >
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div className="space-y-1 flex items-end justify-between gap-3">
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold"
                  >
                    <option value="ALL">ALL</option>
                  </select>
                </div>
                <button
                  onClick={() => alert("Search compiled.")}
                  className="h-8 px-5 bg-primary hover:opacity-95 text-primary-foreground font-black text-[10px] rounded-lg shadow-2xs tracking-wider uppercase flex items-center justify-center gap-1"
                >
                  <Search className="size-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE ROSTER DATAGRID */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4">
            {/* Table Export Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-border/20">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Excel Export Complete.")}
                  className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="size-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Printer className="size-3.5 text-primary" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => alert("PDF Export Complete.")}
                  className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5"
                >
                  <FileDown className="size-3.5 text-rose-500" />
                  <span>PDF</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase whitespace-nowrap">
                  Search:
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Quick Search..."
                  className="h-8.5 w-44 pl-3 pr-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold text-foreground outline-none"
                />
              </div>
            </div>

            {/* Standard Multi-Column Table Layout */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="text-[9.5px] uppercase font-bold tracking-wider text-muted-foreground/60 border-b border-border/30 bg-muted/20">
                    <th className="px-3 py-3 text-center">Action</th>
                    <th className="px-3 py-3 text-center">#</th>
                    <th className="px-3 py-3 font-mono font-black">Employee ID</th>
                    <th className="px-4 py-3">Employee Name</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Section</th>
                    <th className="px-3 py-3 text-center">Grade</th>
                    <th className="px-3 py-3 text-center">Joining Date</th>
                    <th className="px-4 py-3 text-right">Salary</th>
                    <th className="px-4 py-3">Job Duration</th>
                    <th className="px-4 py-3 text-right">Last Increment</th>
                    <th className="px-3 py-3 text-center">Last Inc Date</th>
                    <th className="px-4 py-3 text-right text-primary">Propose Increment</th>
                    <th className="px-4 py-3 text-primary">Propose Promotion</th>
                    <th className="px-4 py-3 text-right text-primary">
                      Till after Increment Salary
                    </th>
                    <th className="px-4 py-3">Remarks</th>
                    <th className="px-3 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredRecords.map((row) => {
                    return (
                      <tr key={row.empId} className="hover:bg-muted/40 transition">
                        <td className="px-3 py-3 text-center flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(row)}
                            className="p-1 hover:bg-primary/10 text-primary rounded transition"
                            title="Edit Proposal"
                          >
                            <PenTool className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(row.empId)}
                            className="p-1 hover:bg-rose-500/10 text-rose-500 rounded transition"
                            title="Delete Proposal"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                        <td className="px-3 py-3 text-center font-mono font-bold text-muted-foreground/60">
                          {row.sl}
                        </td>
                        <td className="px-3 py-3 font-mono font-black text-foreground">
                          {row.empId}
                        </td>
                        <td className="px-4 py-3 font-extrabold text-foreground">{row.name}</td>
                        <td className="px-4 py-3 font-bold text-foreground">{row.designation}</td>
                        <td className="px-4 py-3 text-muted-foreground font-semibold">
                          {row.department}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground/80">{row.section}</td>
                        <td className="px-3 py-3 text-center font-semibold text-muted-foreground">
                          {row.grade}
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground">
                          {row.joiningDate}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-foreground">
                          ৳{row.salary.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground font-semibold">
                          {row.jobDuration}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                          {row.lastInc > 0 ? `৳${row.lastInc.toLocaleString()}` : "0"}
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground">
                          {row.lastIncDate || "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-black text-primary">
                          ৳{row.proposeInc.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-primary font-black">{row.proposeProm}</td>
                        <td className="px-4 py-3 text-right font-mono font-black text-primary">
                          ৳{row.tillAfterSalary.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground/50 italic">
                          {row.remarks || "—"}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/15" : "bg-amber-500/10 text-amber-600 border border-amber-500/15"}`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination & Submissions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-border/25">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Showing 1 to {filteredRecords.length} of {filteredRecords.length} entries
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Edit Modal Popover */}
        {editingRow && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-lg w-full max-w-2xl p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-250">
              <div className="flex items-center justify-between pb-3 border-b border-border/20">
                <h3 className="text-sm font-black text-foreground flex items-center gap-1.5 uppercase">
                  <Sparkles className="size-4.5 text-primary" />
                  <span>Update Proposal</span>
                </h3>
                <button
                  onClick={() => setEditingRow(null)}
                  className="p-1 hover:bg-muted text-muted-foreground rounded"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground font-semibold block mb-1">Employee</span>
                  <span className="font-extrabold text-foreground">
                    {editingRow.name} ({editingRow.empId})
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground font-semibold block mb-1">
                    Designation
                  </span>
                  <span className="font-extrabold text-foreground">{editingRow.designation}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-semibold block mb-1">
                    Current Gross Salary
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    ৳{editingRow.salary.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    Propose Increment Amount (৳)
                  </label>
                  <input
                    type="number"
                    value={editProposeInc}
                    onChange={(e) => setEditProposeInc(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-mono font-bold text-foreground outline-none focus:border-primary transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    Propose Promotion Designation
                  </label>
                  <input
                    type="text"
                    value={editProposeProm}
                    onChange={(e) => setEditProposeProm(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-muted border border-border/40 text-xs font-bold text-foreground outline-none focus:border-primary transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    Remarks / Justification
                  </label>
                  <textarea
                    rows={2}
                    value={editRemarks}
                    onChange={(e) => setEditRemarks(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-muted border border-border/40 text-xs font-semibold text-foreground outline-none focus:border-primary transition"
                    placeholder="KPI objectives completed, etc..."
                  />
                </div>

                <div className="p-3 bg-muted/40 rounded-xl border border-border/20 text-center font-semibold text-xs space-y-1">
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                    New Proposed Salary
                  </span>
                  <span className="font-mono font-black text-primary text-sm">
                    ৳{(editingRow.salary + editProposeInc).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/20">
                <button
                  onClick={() => setEditingRow(null)}
                  className="h-8 px-4 bg-muted hover:bg-muted/80 text-foreground font-black text-[10px] rounded-lg transition uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="h-8 px-5 bg-primary hover:opacity-95 text-primary-foreground font-black text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Check className="size-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
