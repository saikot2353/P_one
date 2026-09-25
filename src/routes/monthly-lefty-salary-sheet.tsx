import { useState, useMemo } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Search,
  FileDown,
  Printer,
  FileText,
  ChevronRight,
  Filter,
  Users,
  Banknote,
  CalendarDays,
  Building2,
  RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/monthly-lefty-salary-sheet")({
  head: () => ({
    meta: [
      { title: "Monthly Lefty Salary Sheet — CRIPTON HRIS" },
      { name: "description", content: "Monthly Left/Resigned Employee Salary Sheet Report" },
    ],
  }),
  component: MonthlyLeftySalarySheetPage,
});

export interface LeftySalaryRecord {
  sl: number;
  id: string;
  name: string;
  prs: number;
  slLeave: number;
  cl: number;
  ml: number;
  el: number;
  basic: number;
  hRent: number;
  med: number;
  conv: number;
  gross: number;
  lastPresent: string;
  netPayment: number;
}

export const leftySalaryData: LeftySalaryRecord[] = [
  { sl: 1, id: "2026059499", name: "Mst. Shabina Khatun", prs: 6, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7700, hRent: 3850, med: 750, conv: 450, gross: 14000, lastPresent: "06/09/2026", netPayment: 5766 },
  { sl: 2, id: "2026059504", name: "Most. Moslema Khatun", prs: 13, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7566, hRent: 3784, med: 750, conv: 450, gross: 13800, lastPresent: "06/09/2026", netPayment: 11416 },
  { sl: 3, id: "2026059509", name: "Asma Khatun", prs: 6, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7700, hRent: 3850, med: 750, conv: 450, gross: 14000, lastPresent: "06/09/2026", netPayment: 5299 },
  { sl: 4, id: "2026059514", name: "Md. Golam Azam", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 2492 },
  { sl: 5, id: "2026059523", name: "Rozina", prs: 11, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7966, hRent: 3984, med: 750, conv: 450, gross: 14400, lastPresent: "06/09/2026", netPayment: 10073 },
  { sl: 6, id: "2026059524", name: "Md. Ashraf Hossain", prs: 1, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 6700, hRent: 3350, med: 750, conv: 450, gross: 12500, lastPresent: "06/09/2026", netPayment: 573 },
  { sl: 7, id: "2026059543", name: "Md. Rasel", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7566, hRent: 3784, med: 750, conv: 450, gross: 13800, lastPresent: "06/09/2026", netPayment: 3317 },
  { sl: 8, id: "2026059555", name: "Labni", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7633, hRent: 3817, med: 750, conv: 450, gross: 13900, lastPresent: "06/09/2026", netPayment: 3287 },
  { sl: 9, id: "2026059583", name: "Mst. Nasren Nahar", prs: 7, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7700, hRent: 3850, med: 750, conv: 450, gross: 14000, lastPresent: "06/09/2026", netPayment: 6545 },
  { sl: 10, id: "2026059591", name: "Md. Ruhul Amin", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 3063 },
  { sl: 11, id: "2026059598", name: "Md. Shapon", prs: 5, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8366, hRent: 4184, med: 750, conv: 450, gross: 15000, lastPresent: "06/09/2026", netPayment: 5355 },
  { sl: 12, id: "2026059641", name: "Mst. Morium Khatun", prs: 10, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 6700, hRent: 3350, med: 750, conv: 450, gross: 12500, lastPresent: "06/09/2026", netPayment: 7665 },
  { sl: 13, id: "2026059681", name: "Md. Rakibul Islam", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8366, hRent: 4184, med: 750, conv: 450, gross: 15000, lastPresent: "06/09/2026", netPayment: 3071 },
  { sl: 14, id: "2026059691", name: "Md. Morsalin Sardar", prs: 6, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 5127 },
  { sl: 15, id: "2026059712", name: "Md. Tara Mia", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8700, hRent: 4350, med: 750, conv: 450, gross: 15500, lastPresent: "06/09/2026", netPayment: 2718 },
  { sl: 16, id: "2026059719", name: "Mst Rita Akter", prs: 7, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7700, hRent: 3850, med: 750, conv: 450, gross: 14000, lastPresent: "06/09/2026", netPayment: 6474 },
  { sl: 17, id: "2026059763", name: "Md. Ahad Ali", prs: 1, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7566, hRent: 3784, med: 750, conv: 450, gross: 13800, lastPresent: "06/09/2026", netPayment: 628 },
  { sl: 18, id: "2026059776", name: "Mst. Angoor Khatun", prs: 1, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 808 },
  { sl: 19, id: "2026059796", name: "Mst. Ripa Akter", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7433, hRent: 3717, med: 750, conv: 450, gross: 13600, lastPresent: "06/09/2026", netPayment: 2322 },
  { sl: 20, id: "2026059797", name: "Md. Rony Hossain", prs: 14, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8700, hRent: 4350, med: 750, conv: 450, gross: 15500, lastPresent: "06/09/2026", netPayment: 9971 },
  { sl: 21, id: "2026059801", name: "Mst. Munni Akter Moon", prs: 2, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 6700, hRent: 3350, med: 750, conv: 450, gross: 12500, lastPresent: "06/09/2026", netPayment: 796 },
  { sl: 22, id: "2026059814", name: "Argina Begum", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7900, hRent: 3950, med: 750, conv: 450, gross: 14300, lastPresent: "06/09/2026", netPayment: 4351 },
  { sl: 23, id: "2026059856", name: "Md. Nishad Hosen", prs: 2, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 14100, hRent: 7050, med: 1410, conv: 940, gross: 23500, lastPresent: "06/09/2026", netPayment: 2289 },
  { sl: 24, id: "2026059904", name: "Mst. Manzu Ara Khatun", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7700, hRent: 3850, med: 750, conv: 450, gross: 14000, lastPresent: "06/09/2026", netPayment: 4260 },
  { sl: 25, id: "2026059910", name: "Most. Jui Akter", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7766, hRent: 3884, med: 750, conv: 450, gross: 14100, lastPresent: "06/09/2026", netPayment: 3119 },
  { sl: 26, id: "2026059940", name: "Md. Biplob Hosen", prs: 15, slLeave: 2, cl: 0, ml: 0, el: 0, basic: 8366, hRent: 4184, med: 750, conv: 450, gross: 15000, lastPresent: "06/09/2026", netPayment: 13151 },
  { sl: 27, id: "2026059942", name: "Md. Roman Mia", prs: 5, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 4324 },
  { sl: 28, id: "2026059953", name: "Najmul Hossen", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 2242 },
  { sl: 29, id: "2026059961", name: "Mst. Shirina Begum", prs: 2, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 1177 },
  { sl: 30, id: "2026059964", name: "Mitali Rani", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 6700, hRent: 3350, med: 750, conv: 450, gross: 12500, lastPresent: "06/09/2026", netPayment: 3082 },
  { sl: 31, id: "2026059989", name: "Md. Sajjat Sheikh", prs: 5, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8700, hRent: 4350, med: 750, conv: 450, gross: 15500, lastPresent: "06/09/2026", netPayment: 5248 },
  { sl: 32, id: "2026059998", name: "Md. Shamim Islam", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 564 },
  { sl: 33, id: "2026060005", name: "Mohammad Sakil", prs: 5, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8366, hRent: 4184, med: 750, conv: 450, gross: 15000, lastPresent: "06/09/2026", netPayment: 3777 },
  { sl: 34, id: "2026060010", name: "Md. Ananul Haque", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8366, hRent: 4184, med: 750, conv: 450, gross: 15000, lastPresent: "06/09/2026", netPayment: 1964 },
  { sl: 35, id: "2026060022", name: "Akhi Rani Das", prs: 10, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 8868 },
  { sl: 36, id: "2026060023", name: "Md. Liton Ali", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 2242 },
  { sl: 37, id: "2026060038", name: "Md. Mohiuddin Miah", prs: 5, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 6900, hRent: 3450, med: 750, conv: 450, gross: 12800, lastPresent: "06/09/2026", netPayment: 3793 },
  { sl: 38, id: "2026060056", name: "Mst. Puspo Khatun", prs: 6, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7700, hRent: 3850, med: 750, conv: 450, gross: 14000, lastPresent: "06/09/2026", netPayment: 5766 },
  { sl: 39, id: "2026060067", name: "Chayera", prs: 6, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7833, hRent: 3917, med: 750, conv: 450, gross: 14200, lastPresent: "06/09/2026", netPayment: 5779 },
  { sl: 40, id: "2026060072", name: "Mst. Rubiya Khatun", prs: 15, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 11420 },
  { sl: 41, id: "2026060078", name: "Mst. Swety Akter", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8033, hRent: 4017, med: 750, conv: 450, gross: 14500, lastPresent: "06/09/2026", netPayment: 2874 },
  { sl: 42, id: "2026060087", name: "Asma Khatun", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 2455 },
  { sl: 43, id: "2026060107", name: "Rubina Begum", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8833, hRent: 4417, med: 750, conv: 450, gross: 15700, lastPresent: "06/09/2026", netPayment: 3123 },
  { sl: 44, id: "2026060120", name: "Md. Jahangir Alom", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8366, hRent: 4184, med: 750, conv: 450, gross: 15000, lastPresent: "06/09/2026", netPayment: 1964 },
  { sl: 45, id: "2026060144", name: "Rima Karmaker", prs: 5, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7566, hRent: 3784, med: 750, conv: 450, gross: 13800, lastPresent: "06/09/2026", netPayment: 4262 },
  { sl: 46, id: "2026060164", name: "Md. Minarul Haque", prs: 7, slLeave: 0, cl: 3, ml: 0, el: 0, basic: 7700, hRent: 3850, med: 750, conv: 450, gross: 14000, lastPresent: "06/09/2026", netPayment: 4642 },
  { sl: 47, id: "2026060178", name: "Imran Sheikh", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 2876 },
  { sl: 48, id: "2026060238", name: "Mst. Asiya Khatun", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7566, hRent: 3784, med: 750, conv: 450, gross: 13800, lastPresent: "06/09/2026", netPayment: 1965 },
  { sl: 49, id: "2026060248", name: "Mst. Rozina Akter", prs: 2, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 864 },
  { sl: 50, id: "2026060254", name: "Sufia Begum", prs: 11, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7700, hRent: 3850, med: 750, conv: 450, gross: 14000, lastPresent: "06/09/2026", netPayment: 10256 },
  { sl: 51, id: "2026060280", name: "Mst. Marufa Khanum", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8033, hRent: 4017, med: 750, conv: 450, gross: 14500, lastPresent: "06/09/2026", netPayment: 3213 },
  { sl: 52, id: "2026060297", name: "Nasima Aktari", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7566, hRent: 3784, med: 750, conv: 450, gross: 13800, lastPresent: "06/09/2026", netPayment: 1965 },
  { sl: 53, id: "2026060321", name: "Jakia", prs: 2, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7700, hRent: 3850, med: 750, conv: 450, gross: 14000, lastPresent: "06/09/2026", netPayment: 1218 },
  { sl: 54, id: "2026060330", name: "Md. Sadekur Rahman", prs: 9, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7900, hRent: 3950, med: 750, conv: 450, gross: 14300, lastPresent: "06/09/2026", netPayment: 8399 },
  { sl: 55, id: "2026060344", name: "Md. Sohel Rana", prs: 5, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8766, hRent: 4384, med: 750, conv: 450, gross: 15600, lastPresent: "06/09/2026", netPayment: 5808 },
  { sl: 56, id: "2026060362", name: "Md. Masud Rana", prs: 5, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 6700, hRent: 3350, med: 750, conv: 450, gross: 12500, lastPresent: "06/09/2026", netPayment: 3439 },
  { sl: 57, id: "2026060365", name: "Arun Haldar", prs: 6, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 16800, hRent: 8400, med: 1680, conv: 1120, gross: 28000, lastPresent: "06/09/2026", netPayment: 9618 },
  { sl: 58, id: "2026060382", name: "Most. Ritu Akter", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 3764 },
  { sl: 59, id: "2026060383", name: "Mithun Kumar", prs: 1, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 1001 },
  { sl: 60, id: "2026060389", name: "Mst. Laboni", prs: 2, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 1177 },
  { sl: 61, id: "2026060390", name: "Md. Jahangir Alam", prs: 6, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 5440 },
  { sl: 62, id: "2026060400", name: "Mst. Sharmin Akter", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7433, hRent: 3717, med: 750, conv: 450, gross: 13600, lastPresent: "06/09/2026", netPayment: 4140 },
  { sl: 63, id: "2026060409", name: "Tania Akther", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7833, hRent: 3917, med: 750, conv: 450, gross: 14200, lastPresent: "06/09/2026", netPayment: 2326 },
  { sl: 64, id: "2026060481", name: "Md. Rokon Mia", prs: 7, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 18000, hRent: 9000, med: 1800, conv: 1200, gross: 30000, lastPresent: "06/09/2026", netPayment: 11425 },
  { sl: 65, id: "2026060482", name: "Sabuj Hossain", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 6700, hRent: 3350, med: 750, conv: 450, gross: 12500, lastPresent: "06/09/2026", netPayment: 1487 },
  { sl: 66, id: "2026060486", name: "Helna Begum", prs: 5, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7566, hRent: 3784, med: 750, conv: 450, gross: 13800, lastPresent: "06/09/2026", netPayment: 4333 },
  { sl: 67, id: "2026060511", name: "Md. Abdur Rahman Mia", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 17100, hRent: 8550, med: 1710, conv: 1140, gross: 28500, lastPresent: "06/09/2026", netPayment: 4357 },
  { sl: 68, id: "2026060512", name: "Md. Azad", prs: 7, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 16500, hRent: 8250, med: 1650, conv: 1100, gross: 27500, lastPresent: "06/09/2026", netPayment: 9231 },
  { sl: 69, id: "2026060534", name: "Sathi", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7700, hRent: 3850, med: 750, conv: 450, gross: 14000, lastPresent: "06/09/2026", netPayment: 3096 },
  { sl: 70, id: "2026060537", name: "Mst. Selina Khatun", prs: 2, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7566, hRent: 3784, med: 750, conv: 450, gross: 13800, lastPresent: "06/09/2026", netPayment: 1520 },
  { sl: 71, id: "2026060594", name: "Mst. Shirin", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7633, hRent: 3817, med: 750, conv: 450, gross: 13900, lastPresent: "06/09/2026", netPayment: 1981 },
  { sl: 72, id: "2026060601", name: "Salma Begum", prs: 5, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7566, hRent: 3784, med: 750, conv: 450, gross: 13800, lastPresent: "06/09/2026", netPayment: 4333 },
  { sl: 73, id: "2026060616", name: "Sreemoti Aloka Rani", prs: 6, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 5169 },
  { sl: 74, id: "2026060621", name: "Mst. Julia Begum", prs: 6, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7833, hRent: 3917, med: 750, conv: 450, gross: 14200, lastPresent: "06/09/2026", netPayment: 5527 },
  { sl: 75, id: "2026060626", name: "Mst. Kajoly Akter", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 2242 },
  { sl: 76, id: "2026060638", name: "Nimay Chandro Roy", prs: 11, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8033, hRent: 4017, med: 750, conv: 450, gross: 14500, lastPresent: "06/09/2026", netPayment: 10916 },
  { sl: 77, id: "2026060644", name: "Md. Habib", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8033, hRent: 4017, med: 750, conv: 450, gross: 14500, lastPresent: "06/09/2026", netPayment: 3184 },
  { sl: 78, id: "2026060656", name: "Md. Rashedul Islam", prs: 7, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 6700, hRent: 3350, med: 750, conv: 450, gross: 12500, lastPresent: "06/09/2026", netPayment: 5194 },
  { sl: 79, id: "2026060663", name: "Esrat Jahan Happy", prs: 14, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 11511 },
  { sl: 80, id: "2026060687", name: "Md. Kajim", prs: 7, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8100, hRent: 4050, med: 750, conv: 450, gross: 14600, lastPresent: "06/09/2026", netPayment: 7308 },
  { sl: 81, id: "2026060717", name: "Mrs. Eti Moni", prs: 8, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 7224 },
  { sl: 82, id: "2026060720", name: "Md. Miron Mia", prs: 8, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8033, hRent: 4017, med: 750, conv: 450, gross: 14500, lastPresent: "06/09/2026", netPayment: 7316 },
  { sl: 83, id: "2026060723", name: "Forida Parvin", prs: 2, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 1248 },
  { sl: 84, id: "2026060738", name: "Mst Monni Begum", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7700, hRent: 3850, med: 750, conv: 450, gross: 14000, lastPresent: "06/09/2026", netPayment: 3096 },
  { sl: 85, id: "2026060778", name: "Bibi Ayasha", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7566, hRent: 3784, med: 750, conv: 450, gross: 13800, lastPresent: "06/09/2026", netPayment: 1965 },
  { sl: 86, id: "2026060801", name: "Mst. Lovly Begum", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 2992 },
  { sl: 87, id: "2026060822", name: "Sabina", prs: 2, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7566, hRent: 3784, med: 750, conv: 450, gross: 13800, lastPresent: "06/09/2026", netPayment: 1520 },
  { sl: 88, id: "2026060828", name: "Md. Jasim Uddin", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7500, hRent: 3750, med: 750, conv: 450, gross: 13700, lastPresent: "06/09/2026", netPayment: 3028 },
  { sl: 89, id: "2026060839", name: "Ms. Akhi Akter", prs: 9, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7433, hRent: 3717, med: 750, conv: 450, gross: 13600, lastPresent: "06/09/2026", netPayment: 7496 },
  { sl: 90, id: "2026060864", name: "Md. Shahin Alam", prs: 7, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 17100, hRent: 8550, med: 1710, conv: 1140, gross: 28500, lastPresent: "06/09/2026", netPayment: 9504 },
  { sl: 91, id: "2026060920", name: "Md. Shahi Dullah", prs: 5, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 16800, hRent: 8400, med: 1680, conv: 1120, gross: 28000, lastPresent: "06/09/2026", netPayment: 6462 },
  { sl: 92, id: "2026060929", name: "Raton Hossain", prs: 2, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8366, hRent: 4184, med: 750, conv: 450, gross: 15000, lastPresent: "06/09/2026", netPayment: 958 },
  { sl: 93, id: "2026060956", name: "Mst. Sarmin Akter", prs: 2, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7566, hRent: 3784, med: 750, conv: 450, gross: 13800, lastPresent: "06/09/2026", netPayment: 1520 },
  { sl: 94, id: "2026060967", name: "Md. Saiful Islam", prs: 10, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 18000, hRent: 9000, med: 1800, conv: 1200, gross: 30000, lastPresent: "06/09/2026", netPayment: 13491 },
  { sl: 95, id: "2026060981", name: "Md. Sohel Rana", prs: 7, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7966, hRent: 3984, med: 750, conv: 450, gross: 14400, lastPresent: "06/09/2026", netPayment: 6396 },
  { sl: 96, id: "2026060983", name: "Md. Sabbir Hossain", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 6700, hRent: 3350, med: 750, conv: 450, gross: 12500, lastPresent: "06/09/2026", netPayment: 2633 },
  { sl: 97, id: "2026060999", name: "Md. Shamsul Islam", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 6700, hRent: 3350, med: 750, conv: 450, gross: 12500, lastPresent: "06/09/2026", netPayment: 3371 },
  { sl: 98, id: "2026061001", name: "Md. Oliullah", prs: 5, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "06/09/2026", netPayment: 4517 },
  { sl: 99, id: "2026061005", name: "Mst. Farjana Akter", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7500, hRent: 3750, med: 750, conv: 450, gross: 13700, lastPresent: "06/09/2026", netPayment: 2269 },
  { sl: 100, id: "2026061030", name: "Aysha", prs: 3, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7433, hRent: 3717, med: 750, conv: 450, gross: 13600, lastPresent: "06/09/2026", netPayment: 3273 },
  { sl: 101, id: "2026061043", name: "Md. Abdur Razzak", prs: 7, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8033, hRent: 4017, med: 750, conv: 450, gross: 14500, lastPresent: "06/09/2026", netPayment: 6849 },
  { sl: 102, id: "2026061049", name: "Md. Rubel Fakir", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 6900, hRent: 3450, med: 750, conv: 450, gross: 12800, lastPresent: "06/09/2026", netPayment: 2867 },
  { sl: 103, id: "2026061139", name: "Mst. Chen Banu", prs: 9, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7566, hRent: 3784, med: 750, conv: 450, gross: 13800, lastPresent: "03/09/2026", netPayment: 7412 },
  { sl: 104, id: "2026061192", name: "Md. Ariful Islam", prs: 15, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7900, hRent: 3950, med: 750, conv: 450, gross: 14300, lastPresent: "03/09/2026", netPayment: 13216 },
  { sl: 105, id: "2026061195", name: "Md. Nurnnaby", prs: 11, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 17100, hRent: 8550, med: 1710, conv: 1140, gross: 28500, lastPresent: "03/09/2026", netPayment: 14211 },
  { sl: 106, id: "2026061206", name: "Md. Bipul Mia", prs: 8, slLeave: 2, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "03/09/2026", netPayment: 8264 },
  { sl: 107, id: "2026061241", name: "Md. Shohidul Islam", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7566, hRent: 3784, med: 750, conv: 450, gross: 13800, lastPresent: "03/09/2026", netPayment: 3764 },
  { sl: 108, id: "2026061244", name: "Mst. Bilkis", prs: 4, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8700, hRent: 4350, med: 750, conv: 450, gross: 15500, lastPresent: "03/09/2026", netPayment: 4782 },
  { sl: 109, id: "2026061286", name: "Sreemoti Sanjita Rani", prs: 5, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7500, hRent: 3750, med: 750, conv: 450, gross: 13700, lastPresent: "03/09/2026", netPayment: 3612 },
  { sl: 110, id: "2026061290", name: "Imam Hossain", prs: 6, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8700, hRent: 4350, med: 750, conv: 450, gross: 15500, lastPresent: "03/09/2026", netPayment: 4728 },
  { sl: 111, id: "2026061316", name: "Mst. Morzina Khatun", prs: 7, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7833, hRent: 3917, med: 750, conv: 450, gross: 14200, lastPresent: "03/09/2026", netPayment: 6063 },
  { sl: 112, id: "2026061352", name: "Md. Emon Hossain", prs: 9, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8700, hRent: 4350, med: 750, conv: 450, gross: 15500, lastPresent: "03/09/2026", netPayment: 7677 },
  { sl: 113, id: "2026061355", name: "Mst. Mina Begum", prs: 9, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7966, hRent: 3984, med: 750, conv: 450, gross: 14400, lastPresent: "03/09/2026", netPayment: 7859 },
  { sl: 114, id: "2026061362", name: "Mst. Santona Begum", prs: 5, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7833, hRent: 3917, med: 750, conv: 450, gross: 14200, lastPresent: "03/09/2026", netPayment: 4131 },
  { sl: 115, id: "2026061368", name: "Mst. Nasima Khanum", prs: 8, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7900, hRent: 3950, med: 750, conv: 450, gross: 14300, lastPresent: "03/09/2026", netPayment: 6826 },
  { sl: 116, id: "2026061469", name: "Abdur Rahman Bisash", prs: 6, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "03/09/2026", netPayment: 5187 },
  { sl: 117, id: "2026061486", name: "Alpona Akter", prs: 9, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 8233, hRent: 4117, med: 750, conv: 450, gross: 14800, lastPresent: "03/09/2026", netPayment: 8839 },
  { sl: 118, id: "2026061500", name: "Md. Badsha Alom", prs: 9, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "03/09/2026", netPayment: 7135 },
  { sl: 119, id: "2026061558", name: "Akhtar Banu", prs: 9, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 7400, hRent: 3700, med: 750, conv: 450, gross: 13550, lastPresent: "03/09/2026", netPayment: 6456 },
  { sl: 120, id: "2026061583", name: "Md. Chan Mia", prs: 7, slLeave: 1, cl: 0, ml: 0, el: 0, basic: 8366, hRent: 4184, med: 750, conv: 450, gross: 15000, lastPresent: "03/09/2026", netPayment: 6875 },
  { sl: 121, id: "2026061620", name: "Md. Kausir Alam", prs: 5, slLeave: 0, cl: 0, ml: 0, el: 0, basic: 17100, hRent: 8550, med: 1710, conv: 1140, gross: 28500, lastPresent: "03/09/2026", netPayment: 5676 },
];

function MonthlyLeftySalarySheetPage() {
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Aug");
  const [company, setCompany] = useState("Pakiza Knit Composite Ltd");
  const [empType, setEmpType] = useState("ALL");
  const [subDept, setSubDept] = useState("ALL");
  const [jobTitle, setJobTitle] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [empIdInput, setEmpIdInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    return leftySalaryData.filter((item) => {
      if (empIdInput.trim()) {
        const ids = empIdInput.split(",").map((i) => i.trim());
        if (!ids.some((id) => item.id.includes(id))) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.id.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.lastPresent.includes(q)
        );
      }
      return true;
    });
  }, [empIdInput, searchQuery]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, r) => {
        acc.prs += r.prs;
        acc.slLeave += r.slLeave;
        acc.cl += r.cl;
        acc.ml += r.ml;
        acc.el += r.el;
        acc.basic += r.basic;
        acc.hRent += r.hRent;
        acc.med += r.med;
        acc.conv += r.conv;
        acc.gross += r.gross;
        acc.netPayment += r.netPayment;
        return acc;
      },
      {
        prs: 0,
        slLeave: 0,
        cl: 0,
        ml: 0,
        el: 0,
        basic: 0,
        hRent: 0,
        med: 0,
        conv: 0,
        gross: 0,
        netPayment: 0,
      }
    );
  }, [filteredData]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-BD", {
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleExportCSV = () => {
    const headers = [
      "SL",
      "ID",
      "Name",
      "PRS",
      "SL",
      "CL",
      "ML",
      "EL",
      "Basic",
      "H.Rent",
      "Med",
      "Conv",
      "Gross",
      "Last Present",
      "Net Payment",
    ];
    const rows = filteredData.map((r) => [
      r.sl,
      r.id,
      r.name,
      r.prs,
      r.slLeave,
      r.cl,
      r.ml,
      r.el,
      r.basic,
      r.hRent,
      r.med,
      r.conv,
      r.gross,
      r.lastPresent,
      r.netPayment,
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
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `monthly_lefty_salary_sheet_${year}_${month}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto bg-muted/20">
        <Topbar />

        <div className="p-4 md:p-6 space-y-6 w-full max-w-[1600px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link to="/payroll-reports" className="hover:text-foreground transition-colors">
              Payroll Reports
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-semibold">Monthly Lefty Salary Sheet</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                  <FileText className="size-6" />
                </div>
                Monthly Lefty Salary Sheet
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Comprehensive salary statement for resigned and separated employees for {month} {year}.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <Printer className="size-4 text-muted-foreground" />
                Print Statement
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-card border border-border/60 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 border border-blue-500/20">
                <Users className="size-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Left Employees
                </p>
                <p className="text-xl font-bold text-foreground">{filteredData.length}</p>
              </div>
            </div>

            <div className="bg-card border border-border/60 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 border border-emerald-500/20">
                <Banknote className="size-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Gross Salary
                </p>
                <p className="text-xl font-bold text-emerald-600">
                  ৳ {formatCurrency(totals.gross)}
                </p>
              </div>
            </div>

            <div className="bg-card border border-border/60 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-600 border border-purple-500/20">
                <CalendarDays className="size-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Basic Salary
                </p>
                <p className="text-xl font-bold text-purple-600">
                  ৳ {formatCurrency(totals.basic)}
                </p>
              </div>
            </div>

            <div className="bg-card border border-border/60 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 border border-amber-500/20">
                <Building2 className="size-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Net Payable
                </p>
                <p className="text-xl font-bold text-amber-600">
                  ৳ {formatCurrency(totals.netPayment)}
                </p>
              </div>
            </div>
          </div>

          {/* Filters Section (Matching Reference Screenshot Layout & Controls) */}
          <div className="bg-card rounded-2xl border border-border/60 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40 text-xs font-bold text-foreground uppercase tracking-wider">
              <Filter className="size-4 text-primary" />
              Filter & Search Parameters
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Year</label>
                <SearchableSelect
                  value={year}
                  onChange={setYear}
                  options={[
                    { value: "2026", label: "2026" },
                    { value: "2025", label: "2025" },
                    { value: "2024", label: "2024" },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Month</label>
                <SearchableSelect
                  value={month}
                  onChange={setMonth}
                  options={[
                    { value: "Jan", label: "Jan" },
                    { value: "Feb", label: "Feb" },
                    { value: "Mar", label: "Mar" },
                    { value: "Apr", label: "Apr" },
                    { value: "May", label: "May" },
                    { value: "Jun", label: "Jun" },
                    { value: "Jul", label: "Jul" },
                    { value: "Aug", label: "Aug" },
                    { value: "Sep", label: "Sep" },
                    { value: "Oct", label: "Oct" },
                    { value: "Nov", label: "Nov" },
                    { value: "Dec", label: "Dec" },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Company</label>
                <SearchableSelect
                  value={company}
                  onChange={setCompany}
                  options={[
                    { value: "Pakiza Knit Composite Ltd", label: "Pakiza Knit Composite Ltd" },
                    { value: "Pakiza Woven Ltd", label: "Pakiza Woven Ltd" },
                    { value: "Pakiza Spinning Mills", label: "Pakiza Spinning Mills" },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">
                  Employee Type
                </label>
                <SearchableSelect
                  value={empType}
                  onChange={setEmpType}
                  options={[
                    { value: "ALL", label: "ALL" },
                    { value: "Office Executive", label: "Office Executive" },
                    { value: "Worker", label: "Worker" },
                    { value: "Staff", label: "Staff" },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">
                  Sub Department
                </label>
                <SearchableSelect
                  value={subDept}
                  onChange={setSubDept}
                  options={[
                    { value: "ALL", label: "ALL" },
                    { value: "Sewing", label: "Sewing" },
                    { value: "Cutting", label: "Cutting" },
                    { value: "Finishing", label: "Finishing" },
                    { value: "Maintenance", label: "Maintenance" },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Job Title</label>
                <SearchableSelect
                  value={jobTitle}
                  onChange={setJobTitle}
                  options={[
                    { value: "ALL", label: "ALL" },
                    { value: "Operator", label: "Operator" },
                    { value: "Helper", label: "Helper" },
                    { value: "Quality Inspector", label: "Quality Inspector" },
                    { value: "Executive", label: "Executive" },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Unit</label>
                <SearchableSelect
                  value={unit}
                  onChange={setUnit}
                  options={[
                    { value: "ALL", label: "ALL" },
                    { value: "Unit-01", label: "Unit-01" },
                    { value: "Unit-02", label: "Unit-02" },
                    { value: "Unit-03", label: "Unit-03" },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Line</label>
                <SearchableSelect
                  value={line}
                  onChange={setLine}
                  options={[
                    { value: "ALL", label: "ALL" },
                    { value: "Line-01", label: "Line-01" },
                    { value: "Line-02", label: "Line-02" },
                    { value: "Line-03", label: "Line-03" },
                  ]}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border/40">
              <div className="w-full sm:w-80 space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">
                  Employee Id Search
                </label>
                <input
                  type="text"
                  value={empIdInput}
                  onChange={(e) => setEmpIdInput(e.target.value)}
                  placeholder="Enter employee ID or comma separated IDs..."
                  className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-xs focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/60 shadow-sm"
                />
              </div>

              <div className="flex items-center gap-3 self-end">
                <button
                  onClick={() => {
                    setEmpIdInput("");
                    setSearchQuery("");
                  }}
                  className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="size-3.5 text-muted-foreground" />
                  Reset
                </button>
                <button className="h-9 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-sm transition-all uppercase tracking-wide">
                  Load records
                </button>
              </div>
            </div>
          </div>

          {/* Action Toolbar & Live Filter Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
              >
                <FileText className="size-4 text-emerald-600" /> EXCEL
              </button>
              <button
                onClick={() => window.print()}
                className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
              >
                <Printer className="size-4 text-blue-600" /> PRINT
              </button>
              <button
                onClick={handleExportCSV}
                className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
              >
                <FileDown className="size-4 text-rose-600" /> PDF
              </button>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by ID, Name or Date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-border/80 bg-background text-xs focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/60 shadow-sm"
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto overflow-y-auto max-h-[700px] relative">
              <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
                <thead className="bg-muted/95 backdrop-blur-sm text-muted-foreground uppercase font-bold text-[10px] tracking-wider sticky top-0 z-10 shadow-sm">
                  <tr className="border-b border-border/60">
                    <th className="px-3 py-3 border-r border-border/40 text-center w-12 bg-muted/95">
                      SL
                    </th>
                    <th className="px-4 py-3 border-r border-border/40 font-bold text-foreground">
                      ID
                    </th>
                    <th className="px-4 py-3 border-r border-border/40 font-bold text-foreground">
                      Name
                    </th>
                    <th className="px-3 py-3 border-r border-border/40 text-center bg-blue-500/5 text-blue-700 dark:text-blue-400">
                      PRS
                    </th>
                    <th className="px-3 py-3 border-r border-border/40 text-center bg-rose-500/5 text-rose-700 dark:text-rose-400">
                      SL
                    </th>
                    <th className="px-3 py-3 border-r border-border/40 text-center">CL</th>
                    <th className="px-3 py-3 border-r border-border/40 text-center">ML</th>
                    <th className="px-3 py-3 border-r border-border/40 text-center">EL</th>
                    <th className="px-4 py-3 border-r border-border/40 text-right font-bold">
                      Basic
                    </th>
                    <th className="px-4 py-3 border-r border-border/40 text-right">H.Rent</th>
                    <th className="px-4 py-3 border-r border-border/40 text-right">Med</th>
                    <th className="px-4 py-3 border-r border-border/40 text-right">Conv</th>
                    <th className="px-4 py-3 border-r border-border/40 text-right font-bold text-purple-600 dark:text-purple-400">
                      Gross
                    </th>
                    <th className="px-4 py-3 border-r border-border/40 text-center">
                      Last Present
                    </th>
                    <th className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      Net Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-medium">
                  {filteredData.map((row) => (
                    <tr
                      key={row.sl}
                      className="hover:bg-muted/40 transition-colors group text-[11px]"
                    >
                      <td className="px-3 py-2.5 text-center border-r border-border/30 text-muted-foreground font-semibold bg-muted/10">
                        {row.sl}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 font-mono font-bold text-foreground">
                        {row.id}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 font-semibold text-foreground">
                        {row.name}
                      </td>
                      <td className="px-3 py-2.5 border-r border-border/30 text-center font-bold text-blue-600 dark:text-blue-400 bg-blue-500/5">
                        {row.prs}
                      </td>
                      <td className="px-3 py-2.5 border-r border-border/30 text-center font-semibold text-muted-foreground">
                        {row.slLeave}
                      </td>
                      <td className="px-3 py-2.5 border-r border-border/30 text-center text-muted-foreground">
                        {row.cl}
                      </td>
                      <td className="px-3 py-2.5 border-r border-border/30 text-center text-muted-foreground">
                        {row.ml}
                      </td>
                      <td className="px-3 py-2.5 border-r border-border/30 text-center text-muted-foreground">
                        {row.el}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-right font-semibold text-foreground">
                        {formatCurrency(row.basic)}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-right text-muted-foreground">
                        {formatCurrency(row.hRent)}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-right text-muted-foreground">
                        {formatCurrency(row.med)}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-right text-muted-foreground">
                        {formatCurrency(row.conv)}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-right font-bold text-foreground">
                        {formatCurrency(row.gross)}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-center font-mono text-muted-foreground">
                        {row.lastPresent}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                        ৳ {formatCurrency(row.netPayment)}
                      </td>
                    </tr>
                  ))}

                  {filteredData.length === 0 && (
                    <tr>
                      <td
                        colSpan={15}
                        className="px-4 py-12 text-center text-muted-foreground font-medium"
                      >
                        No lefty salary records found matching your search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>

                {/* Total Summary Footer */}
                {filteredData.length > 0 && (
                  <tfoot className="bg-muted/90 font-bold text-xs border-t-2 border-border/80 sticky bottom-0 z-10 backdrop-blur-sm">
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-3 border-r border-border/40 text-right uppercase tracking-wider text-foreground"
                      >
                        Grand Total ({filteredData.length} Employees)
                      </td>
                      <td className="px-3 py-3 border-r border-border/40 text-center text-blue-600">
                        {totals.prs}
                      </td>
                      <td className="px-3 py-3 border-r border-border/40 text-center">
                        {totals.slLeave}
                      </td>
                      <td className="px-3 py-3 border-r border-border/40 text-center">
                        {totals.cl}
                      </td>
                      <td className="px-3 py-3 border-r border-border/40 text-center">
                        {totals.ml}
                      </td>
                      <td className="px-3 py-3 border-r border-border/40 text-center">
                        {totals.el}
                      </td>
                      <td className="px-4 py-3 border-r border-border/40 text-right">
                        ৳ {formatCurrency(totals.basic)}
                      </td>
                      <td className="px-4 py-3 border-r border-border/40 text-right">
                        ৳ {formatCurrency(totals.hRent)}
                      </td>
                      <td className="px-4 py-3 border-r border-border/40 text-right">
                        ৳ {formatCurrency(totals.med)}
                      </td>
                      <td className="px-4 py-3 border-r border-border/40 text-right">
                        ৳ {formatCurrency(totals.conv)}
                      </td>
                      <td className="px-4 py-3 border-r border-border/40 text-right text-purple-600">
                        ৳ {formatCurrency(totals.gross)}
                      </td>
                      <td className="px-4 py-3 border-r border-border/40 text-center">—</td>
                      <td className="px-4 py-3 text-right text-emerald-600">
                        ৳ {formatCurrency(totals.netPayment)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
