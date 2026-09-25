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
  TrendingUp,
  Building2,
  RefreshCw,
  ChevronLeft,
} from "lucide-react";

export const Route = createFileRoute("/employee-salary-history")({
  head: () => ({
    meta: [
      { title: "Employee Salary History — CRIPTON HRIS" },
      { name: "description", content: "Comprehensive 12-Month Employee Salary History Report" },
    ],
  }),
  component: EmployeeSalaryHistoryPage,
});

export interface SalaryHistoryRecord {
  sl: number;
  id: string;
  empIdOff: string;
  name: string;
  type: string;
  department: string;
  section: string;
  designation: string;
  joinDate: string;
  nid: string;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
}

export const salaryHistoryData: SalaryHistoryRecord[] = [
  { sl: 1, id: "2015003488", empIdOff: "2015003488", name: "Md. Komol Hossain", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Assistant Manager", joinDate: "19/12/2015", nid: "6908676270", jan: 52623, feb: 51583, mar: 27663, apr: 51583, may: 18823, jun: 54703, jul: 53663, aug: 51583, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 2, id: "2016001097", empIdOff: "2016001097", name: "Md. Saddam Hossain", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Deputy Manager", joinDate: "01/08/2016", nid: "", jan: 84840, feb: 84840, mar: 42420, apr: 84840, may: 29694, jun: 84840, jul: 83840, aug: 83840, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 3, id: "2016001098", empIdOff: "2016001098", name: "Md. Ruhul Amin Chowdhury", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Manager", joinDate: "06/08/2016", nid: "", jan: 77846, feb: 76360, mar: 51924, apr: 104266, may: 38316, jun: 92266, jul: 100266, aug: 97266, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 4, id: "2016003490", empIdOff: "2016003490", name: "Muhammad Omar Faruk", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Deputy Manager", joinDate: "16/01/2016", nid: "ন", jan: 55700, feb: 57928, mar: 27850, apr: 56814, may: 19495, jun: 55700, jul: 55700, aug: 55700, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 5, id: "2016003493", empIdOff: "2016003493", name: "Md. Mahatab Uddin Buiyan", type: "Office Executive", department: "Admin and Compliance", section: "Admin and Compliance", designation: "Deputy Manager", joinDate: "07/01/2016", nid: "", jan: 59049, feb: 59049, mar: 29899, apr: 59049, may: 19988, jun: 57883, jul: 60381, aug: 58049, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 6, id: "2021023000", empIdOff: "", name: "Md. Humayun Kabir", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Asst. Manager", joinDate: "01/02/2021", nid: "8517654453557", jan: 58483, feb: 58483, mar: 29033, apr: 57305, may: 21376, jun: 58483, jul: 57483, aug: 57483, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 7, id: "2021026359", empIdOff: "", name: "Md. Shaidul Islam Sahid", type: "Office Executive", department: "Maintenance (RMG)", section: "Maintenance RMG", designation: "Officer", joinDate: "10/08/2021", nid: "19940620707000014", jan: 42500, feb: 42500, mar: 21250, apr: 42500, may: 15725, jun: 42500, jul: 42500, aug: 42500, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 8, id: "2014005235", empIdOff: "2014005235", name: "Shefali Perveen", type: "Office Executive", department: "Admin and Compliance", section: "Welfare", designation: "Deputy Manager", joinDate: "15/04/2014", nid: "ন", jan: 65200, feb: 65200, mar: 32600, apr: 65200, may: 21516, jun: 65200, jul: 65200, aug: 65200, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 9, id: "2015001084", empIdOff: "2015001084", name: "Uddipan Madhu", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "11/08/2015", nid: "", jan: 20234, feb: 15724, mar: 14508, apr: 18424, may: 7578, jun: 24224, jul: 21424, aug: 30224, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 10, id: "2015003494", empIdOff: "2015003494", name: "Md. Shohel Rana", type: "Office Executive", department: "Admin and Compliance", section: "Fire and Safety", designation: "Sr. Officer (Fire & Safety)", joinDate: "01/03/2015", nid: "1459194997", jan: 54583, feb: 44583, mar: 27083, apr: 49683, may: 23233, jun: 60083, jul: 51583, aug: 53783, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 11, id: "2015005007", empIdOff: "2015005007", name: "Md. Raju Ahmed", type: "Office Executive", department: "Admin and Compliance", section: "General Store (MCD)", designation: "Manager", joinDate: "01/09/2015", nid: "..n.", jan: 63483, feb: 63483, mar: 31533, apr: 63483, may: 21948, jun: 63483, jul: 44483, aug: 44483, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 12, id: "2016001101", empIdOff: "2016001101", name: "Habibur", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Sr. Merchandiser", joinDate: "20/09/2016", nid: "", jan: 34501, feb: 37380, mar: 22250, apr: 41500, may: 15575, jun: 44500, jul: 43500, aug: 44390, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 13, id: "2016003589", empIdOff: "2016003589", name: "Md. Gulzar Hossain", type: "Office Executive", department: "Maintenance (RMG)", section: "Maintenance RMG", designation: "Manager", joinDate: "02/01/2016", nid: "ন", jan: 68069, feb: 68069, mar: 33826, apr: 68069, may: 23553, jun: 68069, jul: 69439, aug: 68069, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 14, id: "2018010448", empIdOff: "2018010448", name: "Md. Shahidul Islam (Alam)", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Asst. Manager", joinDate: "03/03/2018", nid: "19906412831000221", jan: 67000, feb: 67000, mar: 33500, apr: 67000, may: 23450, jun: 67000, jul: 66000, aug: 66000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 15, id: "2016003592", empIdOff: "2016003592", name: "Md. Jafor Ali", type: "Office Executive", department: "Maintenance (RMG)", section: "Maintenance RMG", designation: "Asst. Manager", joinDate: "02/05/2016", nid: "n1", jan: 47993, feb: 47993, mar: 24756, apr: 47993, may: 17495, jun: 47993, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 16, id: "2017009716", empIdOff: "2017009716", name: "Md. Billal Hossain", type: "Office Executive", department: "Maintenance (RMG)", section: "Maintenance RMG", designation: "Officer", joinDate: "18/12/2017", nid: "ন", jan: 41961, feb: 41961, mar: 20981, apr: 42800, may: 15735, jun: 43430, jul: 44481, aug: 43640, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 17, id: "2018011218", empIdOff: "2018011218", name: "Md. Tipu Sultan", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Asst. Manager", joinDate: "02/06/2018", nid: "00", jan: 71881, feb: 70463, mar: 35023, apr: 70463, may: 24391, jun: 70463, jul: 70881, aug: 69463, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 18, id: "2018011914", empIdOff: "2018011914", name: "Shamim Ahmed", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Assistant Manager", joinDate: "16/09/2018", nid: "8524904046782", jan: 42583, feb: 32583, mar: 21083, apr: 40183, may: 14633, jun: 43443, jul: 43000, aug: 43000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 19, id: "2018012820", empIdOff: "2018012820", name: "Md.Abdullah Al Mamun", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Deputy Manager", joinDate: "10/11/2018", nid: "19914120405000002", jan: 94583, feb: 94583, mar: 45183, apr: 94583, may: 32833, jun: 94583, jul: 94583, aug: 93583, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 20, id: "2019015021", empIdOff: "2019015021", name: "Md. Rayhan Ahmmed (Raju)", type: "Office Executive", department: "Admin and Compliance", section: "Admin and Compliance", designation: "Asst. Officer", joinDate: "01/07/2019", nid: "9141286188", jan: 30804, feb: 28288, mar: 15100, apr: 27200, may: 11174, jun: 21200, jul: 26200, aug: 29200, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 21, id: "2019016145", empIdOff: "", name: "Monoranjan Kha", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Manager", joinDate: "10/10/2019", nid: "19932611459000158", jan: 84500, feb: 84500, mar: 42250, apr: 84500, may: 29575, jun: 84500, jul: 83500, aug: 83500, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 22, id: "2022037162", empIdOff: "", name: "Md. Yeahia", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Sr. Officer", joinDate: "20/07/2022", nid: "1993411906000222", jan: 35800, feb: 35800, mar: 17900, apr: 35800, may: 13246, jun: 36516, jul: 35516, aug: 35516, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 23, id: "2022040007", empIdOff: "", name: "Nawar Nazafat Harun", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Sr. Officer", joinDate: "18/10/2022", nid: "9151717049", jan: 31100, feb: 31100, mar: 15550, apr: 31100, may: 10885, jun: 31100, jul: 30100, aug: 30100, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 24, id: "2023043354", empIdOff: "", name: "Monalisa", type: "Office Executive", department: "Admin and Compliance", section: "Welfare", designation: "Welfare Officer", joinDate: "01/03/2023", nid: "", jan: 0, feb: 0, mar: 15414, apr: 29164, may: 10207, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 25, id: "2023043744", empIdOff: "", name: "Md. Ashikujjaman", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Sr. Merchandiser", joinDate: "17/06/2023", nid: "6903379649", jan: 55000, feb: 55000, mar: 27500, apr: 55000, may: 18150, jun: 56100, jul: 55000, aug: 56100, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 26, id: "2024049291", empIdOff: "", name: "Mohammad Tasnim Ferdous", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "15/05/2024", nid: "1515460887", jan: 23000, feb: 23000, mar: 11500, apr: 23000, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 27, id: "2024053133", empIdOff: "", name: "Shanto Malo", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "12/12/2024", nid: "5105060908", jan: 23600, feb: 28000, mar: 9800, apr: 100, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 28, id: "2024053284", empIdOff: "", name: "Kazi Sazzad Hossain", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Sr. Merchandiser", joinDate: "21/12/2024", nid: "7752146774", jan: 64260, feb: 65000, mar: 31500, apr: 63000, may: 22050, jun: 63000, jul: 62000, aug: 63260, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 29, id: "2025054610", empIdOff: "", name: "Md. Faysal Hossain", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Sr. Merchandiser", joinDate: "15/03/2025", nid: "8246115276", jan: 48000, feb: 48000, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 30, id: "2023043354", empIdOff: "", name: "Monalisa", type: "Office Executive", department: "Admin and Compliance", section: "Welfare", designation: "Welfare Officer", joinDate: "01/03/2023", nid: "", jan: 27500, feb: 27500, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 31, id: "2023043446", empIdOff: "", name: "Md. Imran Sharif", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Sr. Officer", joinDate: "11/03/2023", nid: "8252184562", jan: 0, feb: 0, mar: 16815, apr: 31815, may: 11771, jun: 31815, jul: 30815, aug: 31451, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 32, id: "2023043961", empIdOff: "", name: "Mesbah Ul Haque Siam", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "01/08/2023", nid: "6015442681", jan: 15700, feb: 17780, mar: 13450, apr: 12824, may: 10491, jun: 11681, jul: 14438, aug: 12400, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 33, id: "2023044512", empIdOff: "", name: "Md. Hossain", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Sr. Merchandiser", joinDate: "10/09/2023", nid: "6893648938", jan: 55683, feb: 54583, mar: 27083, apr: 54583, may: 18833, jun: 54583, jul: 54683, aug: 53583, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 34, id: "2023044855", empIdOff: "", name: "Mr. Jobayer", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "16/09/2023", nid: "6857976564", jan: 23331, feb: 23331, mar: 11665, apr: 23331, may: 8166, jun: 23331, jul: 22798, aug: 22331, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 35, id: "2024052341", empIdOff: "", name: "Md. Shajalal Manik", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "01/10/2024", nid: "8256234777", jan: 30000, feb: 54000, mar: 15000, apr: 30000, may: 10500, jun: 30000, jul: 29000, aug: 29000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 36, id: "2024052904", empIdOff: "", name: "Md. Bokul Hossain", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "25/11/2024", nid: "5065843467", jan: 41000, feb: 53000, mar: 21320, apr: 41000, may: 14350, jun: 41000, jul: 40000, aug: 40000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 37, id: "2019016227", empIdOff: "", name: "Md. Khairul Islam", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "08/10/2019", nid: "ন", jan: 29800, feb: 29800, mar: 14304, apr: 29800, may: 10430, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 38, id: "2020019096", empIdOff: "", name: "Md. Rubel Biswas", type: "Office Executive", department: "Maintenance", section: "Maintenance Utility & Textile", designation: "Deputy Manager", joinDate: "01/07/2020", nid: "3323208068183", jan: 66363, feb: 62583, mar: 38643, apr: 63843, may: 24153, jun: 62583, jul: 64103, aug: 65363, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 39, id: "2020019715", empIdOff: "", name: "Oalid Hossain", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Deputy Manager", joinDate: "01/09/2020", nid: "416 810 6013", jan: 55093, feb: 45083, mar: 32333, apr: 59083, may: 22508, jun: 62083, jul: 61083, aug: 58083, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 40, id: "2020022006", empIdOff: "", name: "Refat Shaon Seto", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Asst. Manager", joinDate: "10/12/2020", nid: "", jan: 62570, feb: 62570, mar: 31285, apr: 62570, may: 23151, jun: 62570, jul: 61570, aug: 61570, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 41, id: "2021026570", empIdOff: "", name: "Dr. Sonia Kaiser", type: "Office Executive", department: "Admin and Compliance", section: "Medical", designation: "Doctor", joinDate: "18/08/2021", nid: "8233712994", jan: 69000, feb: 69000, mar: 34500, apr: 69000, may: 24150, jun: 69000, jul: 68000, aug: 68000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 42, id: "2022036954", empIdOff: "", name: "Md. Rafiur Rahman", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "15/06/2022", nid: "7778453048", jan: 30990, feb: 30990, mar: 15495, apr: 30990, may: 10846, jun: 30990, jul: 29990, aug: 29990, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 43, id: "2022040121", empIdOff: "", name: "Md. Mostafijur Rahman", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Sr. Merchandiser", joinDate: "24/10/2022", nid: "1946630884", jan: 23700, feb: 24800, mar: 21000, apr: 30000, may: 11700, jun: 30000, jul: 29000, aug: 29300, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 44, id: "2025054611", empIdOff: "", name: "Md. Jakir Hossain", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "15/03/2025", nid: "1490964440", jan: 45900, feb: 45000, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 45, id: "2025054850", empIdOff: "", name: "Md. Rifat Hasan", type: "Office Executive", department: "Merchandising Supply Chain", section: "Merchandising Supply Chain", designation: "Officer", joinDate: "19/04/2025", nid: "1953855101", jan: 0, feb: 0, mar: 0, apr: 28000, may: 9800, jun: 28000, jul: 28000, aug: 28000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 46, id: "2025055915", empIdOff: "", name: "Md. Nazim Uddin", type: "Office Executive", department: "Maintenance (RMG)", section: "Maintenance RMG", designation: "Asst. Officer", joinDate: "14/07/2025", nid: "5084212322", jan: 37440, feb: 39000, mar: 19500, apr: 39000, may: 14430, jun: 39000, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 47, id: "2025056467", empIdOff: "", name: "Md. Hasibur Rahman", type: "Office Executive", department: "Merchandising Supply Chain", section: "Merchandising Supply Chain", designation: "Asst. Officer", joinDate: "16/08/2025", nid: "", jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 22331, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 48, id: "2025057141", empIdOff: "", name: "Mehedi Hasan Bappy", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "04/10/2025", nid: "6901637618", jan: 37000, feb: 37000, mar: 18500, apr: 37000, may: 12950, jun: 37000, jul: 34520, aug: 36000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 49, id: "2025057218", empIdOff: "", name: "Syed Kutubul Arefin Taqee", type: "Office Executive", department: "Admin and Compliance", section: "Compliance", designation: "Product Safety Officer", joinDate: "04/10/2025", nid: "7355091195", jan: 35000, feb: 35000, mar: 17500, apr: 35000, may: 12250, jun: 35000, jul: 34000, aug: 34000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 50, id: "2026059463", empIdOff: "", name: "Rafiqul Islam Rifat", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "16/05/2026", nid: "2402468520", jan: 0, feb: 0, mar: 0, apr: 0, may: 7236, jun: 31360, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 51, id: "2026060770", empIdOff: "", name: "Md. Foysal Ahmed", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "12/07/2026", nid: "1503262311", jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 24806, aug: 39000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 52, id: "2025053921", empIdOff: "", name: "Md. Tonmoy Hossen", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Tr. Merchandiser", joinDate: "01/02/2025", nid: "7364376082", jan: 0, feb: 19089, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 53, id: "2025054373", empIdOff: "", name: "Mohammod Asfaqul Islam Turzo", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "10/02/2025", nid: "8260509859", jan: 0, feb: 26513, mar: 13257, apr: 26513, may: 9280, jun: 26513, jul: 25983, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 54, id: "2025054376", empIdOff: "", name: "Md. Shibly Sadik", type: "Office Executive", department: "Maintenance", section: "Maintenance Utility & Textile", designation: "Asst. Officer", joinDate: "10/02/2025", nid: "2407684428", jan: 34980, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 55, id: "2025054376", empIdOff: "", name: "Md. Shibly Sadik", type: "Office Executive", department: "Maintenance", section: "Maintenance Utility & Textile", designation: "Asst. Officer", joinDate: "10/02/2025", nid: "2407684428", jan: 0, feb: 34997, mar: 18199, apr: 35697, may: 12949, jun: 35697, jul: 35397, aug: 33997, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 56, id: "2025058069", empIdOff: "", name: "Mahfuzur Rahman", type: "Office Executive", department: "Admin and Compliance", section: "General Store (MCD)", designation: "Officer", joinDate: "01/12/2025", nid: "9576838677", jan: 29120, feb: 30800, mar: 14560, apr: 29120, may: 10920, jun: 31360, jul: 29680, aug: 29120, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 57, id: "2026058687", empIdOff: "", name: "Md. Raihan", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "15/02/2026", nid: "4654191917", jan: 0, feb: 16640, mar: 16000, apr: 32000, may: 11200, jun: 32000, jul: 31000, aug: 31000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 58, id: "2026058746", empIdOff: "", name: "Md. Sajib Shekh", type: "Office Executive", department: "Production Planning", section: "Production Planning", designation: "Officer", joinDate: "01/04/2026", nid: "7811917983", jan: 0, feb: 0, mar: 0, apr: 32000, may: 10560, jun: 32640, jul: 31000, aug: 31000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 59, id: "2023042570", empIdOff: "", name: "Md. Nayem Hossain", type: "Office Executive", department: "Merchandising Supply Chain", section: "Merchandising Supply Chain", designation: "Sr. Officer", joinDate: "10/01/2023", nid: "ন", jan: 39239, feb: 39239, mar: 19619, apr: 39239, may: 13734, jun: 39239, jul: 38239, aug: 38239, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 60, id: "2023043446", empIdOff: "", name: "Md. Imran Sharif", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Sr. Officer", joinDate: "11/03/2023", nid: "8252184562", jan: 30000, feb: 30000, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 61, id: "2023046305", empIdOff: "", name: "Md. Shah Alom", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "11/11/2023", nid: "", jan: 30755, feb: 30755, mar: 15377, apr: 30755, may: 10764, jun: 30755, jul: 29755, aug: 29755, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 62, id: "2024048213", empIdOff: "", name: "Shadman Shakib", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "21/03/2024", nid: "6901089885", jan: 0, feb: 0, mar: 14440, apr: 28000, may: 9800, jun: 28000, jul: 27000, aug: 27000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 63, id: "2024052917", empIdOff: "", name: "Md. Sofiul Alam", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "01/12/2024", nid: "3713552770", jan: 49000, feb: 53000, mar: 24500, apr: 49000, may: 17150, jun: 49000, jul: 48000, aug: 48000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 64, id: "2025053792", empIdOff: "", name: "Emran Miah", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "23/01/2025", nid: "1032911792", jan: 26950, feb: 27500, mar: 13750, apr: 27500, may: 9625, jun: 27500, jul: 26500, aug: 26500, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 65, id: "2025053921", empIdOff: "", name: "Md. Tonmoy Hossen", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Tr. Merchandiser", joinDate: "01/02/2025", nid: "7364376082", jan: 0, feb: 0, mar: 15367, apr: 22000, may: 7700, jun: 22000, jul: 21000, aug: 21000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 66, id: "2016003533", empIdOff: "2016003533", name: "Md. Aminur Rahman", type: "Office Executive", department: "Admin and Compliance", section: "Security", designation: "Officer", joinDate: "02/01/2016", nid: "1022551145", jan: 28741, feb: 25924, mar: 21130, apr: 25220, may: 15143, jun: 28740, jul: 25924, aug: 25924, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 67, id: "2016003779", empIdOff: "2016003779", name: "Sree Juntu Kumar", type: "Office Executive", department: "Maintenance", section: "Maintenance Utility & Textile", designation: "Sr. Officer", joinDate: "20/03/2016", nid: "ন", jan: 49237, feb: 51061, mar: 28267, apr: 47413, may: 19604, jun: 51973, jul: 48237, aug: 47325, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 68, id: "2017009298", empIdOff: "2017009298", name: "Md. Golam Mawla", type: "Office Executive", department: "Maintenance (RMG)", section: "Maintenance RMG", designation: "Asst. Officer", joinDate: "13/11/2017", nid: "ন", jan: 31414, feb: 31414, mar: 15707, apr: 31414, may: 11623, jun: 31414, jul: 32044, aug: 33094, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 69, id: "2018011304", empIdOff: "2018011304", name: "Md. Mijanur Rahman Hridoy", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Deputy Manager", joinDate: "01/07/2018", nid: "2617635397877", jan: 51803, feb: 50583, mar: 30083, apr: 60583, may: 20933, jun: 61803, jul: 63023, aug: 60583, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 70, id: "2021025645", empIdOff: "", name: "Md. Masud Rana", type: "Office Executive", department: "Maintenance", section: "Maintenance Utility & Textile", designation: "Sr. Officer", joinDate: "01/07/2021", nid: "50171176435490", jan: 47700, feb: 50400, mar: 27000, apr: 46800, may: 19350, jun: 51300, jul: 47600, aug: 46700, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 71, id: "2021027152", empIdOff: "", name: "Md. Mehedi Hasan", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Sr. Officer", joinDate: "09/09/2021", nid: "19942617278000109", jan: 24300, feb: 25000, mar: 13000, apr: 26000, may: 9250, jun: 23200, jul: 22000, aug: 24200, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 72, id: "2022039452", empIdOff: "", name: "Md. Firoz Ahmed", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Deputy Manager", joinDate: "01/10/2022", nid: "", jan: 72934, feb: 72934, mar: 36467, apr: 72934, may: 25527, jun: 72934, jul: 71934, aug: 71934, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 73, id: "2016001089", empIdOff: "2016001089", name: "Md. Rokonuzzaman", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Manager", joinDate: "15/01/2016", nid: "6895034095", jan: 72991, feb: 81391, mar: 50487, apr: 98391, may: 35216, jun: 101391, jul: 102427, aug: 100391, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 74, id: "2016004993", empIdOff: "2016004993", name: "SK. Hedayet Hossain", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Asst. Manager", joinDate: "20/10/2016", nid: "", jan: 67342, feb: 67342, mar: 33671, apr: 67342, may: 23570, jun: 67342, jul: 66342, aug: 66342, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 75, id: "2016005607", empIdOff: "2016005607", name: "Tejen Biswas", type: "Office Executive", department: "Maintenance (RMG)", section: "Maintenance RMG", designation: "Officer", joinDate: "08/12/2016", nid: "8210795773764", jan: 40423, feb: 40423, mar: 19815, apr: 40423, may: 14663, jun: 40423, jul: 40423, aug: 41216, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 76, id: "2018012954", empIdOff: "2018012954", name: "Hasan Mahmud Taibur Rahman", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Sr. Merchandiser", joinDate: "17/11/2018", nid: "1935306363", jan: 29613, feb: 38883, mar: 24391, apr: 39783, may: 17074, jun: 36783, jul: 36783, aug: 40859, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 77, id: "2020020226", empIdOff: "", name: "Md. Rasadul Hasan", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Asst. Manager", joinDate: "01/10/2020", nid: "4631517499", jan: 50583, feb: 50583, mar: 25083, apr: 50583, may: 17433, jun: 50583, jul: 51603, aug: 50583, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 78, id: "2021022308", empIdOff: "", name: "Ashraful Islam", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "02/01/2021", nid: "8217320010500", jan: 37118, feb: 23246, mar: 17817, apr: 25633, may: 9249, jun: 27118, jul: 24157, aug: 26118, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 79, id: "2021024886", empIdOff: "", name: "Md. Abid Hasan", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Sr. Merchandiser", joinDate: "02/06/2021", nid: "2849221466", jan: 42920, feb: 42920, mar: 21460, apr: 42920, may: 15022, jun: 42920, jul: 41920, aug: 41920, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 80, id: "2014001070", empIdOff: "2014001070", name: "Kholil Ullah Roman", type: "Office Executive", department: "Merchandising Supply Chain", section: "Merchandising Supply Chain", designation: "Manager", joinDate: "16/01/2014", nid: "ন", jan: 89726, feb: 89726, mar: 44654, apr: 89726, may: 31133, jun: 89726, jul: 88726, aug: 88726, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 81, id: "2015003501", empIdOff: "2015003501", name: "Md.Jahangir Alam", type: "Office Executive", department: "Admin and Compliance", section: "General Store (MCD)", designation: "Officer", joinDate: "06/12/2015", nid: "ন", jan: 31968, feb: 29600, mar: 14800, apr: 29600, may: 11544, jun: 30192, jul: 30192, aug: 30192, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 82, id: "2016003492", empIdOff: "2016003492", name: "Md. Mostofa Kamal", type: "Office Executive", department: "Admin and Compliance", section: "Admin and Compliance", designation: "Deputy Manager", joinDate: "01/03/2016", nid: "6125207153906", jan: 58300, feb: 58300, mar: 32648, apr: 58300, may: 21571, jun: 60632, jul: 58466, aug: 58466, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 83, id: "2017008576", empIdOff: "2017008576", name: "Md. Shariful Islam", type: "Office Executive", department: "Maintenance", section: "Maintenance Utility & Textile", designation: "Sr. Manager (EMS & Energy)", joinDate: "14/05/2017", nid: "ন", jan: 110918, feb: 108735, mar: 60708, apr: 108735, may: 37786, jun: 108735, jul: 97735, aug: 102735, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 84, id: "2019014659", empIdOff: "2019014659", name: "Utpal Kumar Shaha", type: "Office Executive", department: "Maintenance", section: "Maintenance Utility & Textile", designation: "Officer", joinDate: "20/04/2019", nid: "19786816053868116", jan: 42328, feb: 41894, mar: 25234, apr: 42328, may: 17501, jun: 42328, jul: 44770, aug: 45584, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 85, id: "2020021636", empIdOff: "0", name: "Md. Sajal Mahmud Ratul", type: "Office Executive", department: "Admin and Compliance", section: "Admin and Compliance", designation: "Asst. Manager", joinDate: "05/12/2020", nid: "3272199062", jan: 44383, feb: 44383, mar: 23775, apr: 43487, may: 16159, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 86, id: "2020021990", empIdOff: "", name: "Md. Sahidul Islam Shadin", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Sr. Merchandiser", joinDate: "06/12/2020", nid: "8651225628", jan: 44920, feb: 44920, mar: 22460, apr: 44920, may: 15722, jun: 44920, jul: 43920, aug: 43920, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 87, id: "2015003509", empIdOff: "2015003509", name: "Md. Abedin Al Muzahid", type: "Office Executive", department: "Admin and Compliance", section: "General Store (MCD)", designation: "Deputy Manager", joinDate: "12/12/2015", nid: "ন", jan: 43900, feb: 43022, mar: 21950, apr: 43900, may: 15365, jun: 43900, jul: 42900, aug: 42900, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 88, id: "2017009274", empIdOff: "2017009274", name: "Md. Fajle Rabbi", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Assistant Manager", joinDate: "11/11/2017", nid: "", jan: 47283, feb: 49191, mar: 23433, apr: 47283, may: 16278, jun: 47283, jul: 48237, aug: 48237, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 89, id: "2018010864", empIdOff: "2018010864", name: "Md. Ahammad Ali", type: "Office Executive", department: "Maintenance (RMG)", section: "Maintenance RMG", designation: "Officer", joinDate: "08/04/2018", nid: "19895612836000056", jan: 38200, feb: 38200, mar: 19100, apr: 38410, may: 13026, jun: 39670, jul: 40510, aug: 39040, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 90, id: "2019016000", empIdOff: "", name: "Md. Majbahur Rahman", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Assistant Manager", joinDate: "01/10/2019", nid: "6893176799", jan: 41851, feb: 43861, mar: 24533, apr: 43863, may: 17048, jun: 44483, jul: 44481, aug: 44483, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 91, id: "2020018595", empIdOff: "", name: "Nur Islam Alamgir", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Asst. Manager", joinDate: "15/03/2020", nid: "9116925836", jan: 61500, feb: 61500, mar: 30750, apr: 61500, may: 21525, jun: 61500, jul: 60500, aug: 60500, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 92, id: "2020021549", empIdOff: "", name: "Aminur Islam", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Assistant Manager", joinDate: "01/12/2020", nid: "4600914305", jan: 48654, feb: 48654, mar: 23850, apr: 48654, may: 17649, jun: 47700, jul: 46562, aug: 44654, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 93, id: "2021029266", empIdOff: "", name: "Md. Abu Zakir", type: "Office Executive", department: "Admin and Compliance", section: "Compliance", designation: "Asst. Manager", joinDate: "17/10/2021", nid: "4639581794", jan: 28523, feb: 25666, mar: 14733, apr: 38866, may: 13753, jun: 47866, jul: 47866, aug: 47866, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 94, id: "2015004955", empIdOff: "2015004955", name: "Md. Monirul Islam", type: "Office Executive", department: "Maintenance", section: "Maintenance Utility & Textile", designation: "Deputy Manager", joinDate: "20/10/2015", nid: "", jan: 52583, feb: 52583, mar: 26083, apr: 52583, may: 18133, jun: 52583, jul: 51583, aug: 51583, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 95, id: "2016004632", empIdOff: "2016004632", name: "Md. Kamruzzaman", type: "Office Executive", department: "Admin and Compliance", section: "General Store (MCD)", designation: "Officer", joinDate: "23/01/2016", nid: "..n", jan: 30192, feb: 30192, mar: 15392, apr: 30784, may: 11544, jun: 30192, jul: 31376, aug: 30192, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 96, id: "2018011308", empIdOff: "2018011308", name: "Masud Parvej Piyas", type: "Office Executive", department: "Merchandising Supply Chain", section: "Merchandising Supply Chain", designation: "Asst. Manager", joinDate: "01/07/2018", nid: "19953393050000156", jan: 51965, feb: 51965, mar: 25983, apr: 51965, may: 18188, jun: 51965, jul: 50965, aug: 50965, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 97, id: "2020020592", empIdOff: "", name: "Md. Sadiquer Rahman", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Asst. Manager", joinDate: "15/10/2020", nid: "2845492590", jan: 34423, feb: 29743, mar: 28083, apr: 53694, may: 19533, jun: 56583, jul: 55583, aug: 55583, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 98, id: "2020021551", empIdOff: "", name: "Md. Taufik Al Bisara", type: "Office Executive", department: "Merchandising Supply Chain", section: "Merchandising Supply Chain", designation: "Officer", joinDate: "01/12/2020", nid: "", jan: 17593, feb: 20333, mar: 13787, apr: 23033, may: 9651, jun: 27573, jul: 24953, aug: 22453, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 99, id: "2021025486", empIdOff: "", name: "Md. Humayun Kabir", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Sr. Officer", joinDate: "26/06/2021", nid: "6406850385", jan: 41922, feb: 41100, mar: 20550, apr: 41922, may: 14385, jun: 41100, jul: 41744, aug: 40922, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 100, id: "2022037007", empIdOff: "", name: "Jahurul Alam", type: "Office Executive", department: "Admin and Compliance", section: "Compliance", designation: "Sr. Manager", joinDate: "18/07/2022", nid: "3729178289", jan: 90000, feb: 90000, mar: 45000, apr: 90000, may: 31500, jun: 90000, jul: 89000, aug: 89000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 101, id: "2025054598", empIdOff: "", name: "Md Zubayer Hossain Khan", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "10/03/2025", nid: "6900447589", jan: 0, feb: 0, mar: 23600, apr: 44600, may: 15610, jun: 44600, jul: 43600, aug: 43600, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 102, id: "2025054717", empIdOff: "", name: "Md. Muhib Al Faysal", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Manager", joinDate: "15/04/2025", nid: "5997242911", jan: 89583, feb: 89583, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 103, id: "2025055532", empIdOff: "", name: "Anower Hossain", type: "Office Executive", department: "Maintenance (RMG)", section: "Maintenance RMG", designation: "Asst. Officer", joinDate: "01/07/2025", nid: "19951314617000014", jan: 24310, feb: 23700, mar: 13120, apr: 26970, may: 10615, jun: 29850, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 104, id: "2025056697", empIdOff: "", name: "Md. Hasan Mahmud", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "11/09/2025", nid: "19933921505000004", jan: 42000, feb: 33560, mar: 21840, apr: 32160, may: 14700, jun: 39000, jul: 39320, aug: 38840, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 105, id: "2026058534", empIdOff: "", name: "Md. Mahadi Hasan Rana", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "14/01/2026", nid: "7754358959", jan: 13355, feb: 23000, mar: 11500, apr: 23000, may: 8050, jun: 23000, jul: 22000, aug: 22000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 106, id: "2026060007", empIdOff: "", name: "Md. Abu Ibnasina Rabby", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Tr. Merchandiser", joinDate: "16/06/2026", nid: "2428946699", jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 9000, jul: 17000, aug: 17000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 107, id: "2022040133", empIdOff: "", name: "Rasel Hera", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "01/11/2022", nid: "6877667615", jan: 41360, feb: 41360, mar: 20680, apr: 38360, may: 14476, jun: 38360, jul: 37360, aug: 37360, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 108, id: "2023043915", empIdOff: "", name: "Biplob Hossen", type: "Office Executive", department: "Maintenance", section: "Maintenance Utility & Textile", designation: "Asst. Engineer", joinDate: "06/08/2023", nid: "7329719707", jan: 34230, feb: 35280, mar: 20160, apr: 32760, may: 13545, jun: 35910, jul: 33810, aug: 34020, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 109, id: "2023044289", empIdOff: "", name: "Giko Chakma", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Sr. Merchandiser", joinDate: "02/09/2023", nid: "5075084151", jan: 51083, feb: 51083, mar: 25333, apr: 51083, may: 18638, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 110, id: "2023045869", empIdOff: "", name: "Sayed Rabbil Karim", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Sr. Merchandiser", joinDate: "22/10/2023", nid: "4629803489", jan: 50500, feb: 50500, mar: 25250, apr: 50500, may: 18685, jun: 50500, jul: 49500, aug: 49500, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 111, id: "2024052342", empIdOff: "", name: "Subroto Sikder", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "01/10/2024", nid: "1918745124", jan: 33000, feb: 41400, mar: 17160, apr: 33000, may: 11550, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 112, id: "2024053079", empIdOff: "", name: "Shaikh Mohammad Asif Uddin", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "10/12/2024", nid: "7305680923", jan: 39000, feb: 43000, mar: 19500, apr: 39000, may: 14430, jun: 39000, jul: 38780, aug: 38000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 113, id: "2024053371", empIdOff: "", name: "Shihab Tanvir", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Asst. Manager", joinDate: "28/11/2024", nid: "R5535665896", jan: 80000, feb: 100000, mar: 40000, apr: 80000, may: 28000, jun: 80000, jul: 79000, aug: 79000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 114, id: "2022038447", empIdOff: "", name: "Md. Al Amin", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "02/09/2022", nid: "19916117255000032", jan: 33000, feb: 32340, mar: 17160, apr: 33000, may: 11550, jun: 33000, jul: 33000, aug: 33000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 115, id: "2022039086", empIdOff: "", name: "Arif Hossain", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "10/09/2022", nid: "3257501431", jan: 35700, feb: 35000, mar: 17500, apr: 35000, may: 12250, jun: 35000, jul: 34000, aug: 34000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 116, id: "2022040241", empIdOff: "", name: "Md. Mahmudul Hasan", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "05/11/2022", nid: "19959322809000006", jan: 26513, feb: 26513, mar: 13257, apr: 26513, may: 9280, jun: 26513, jul: 25513, aug: 25513, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 117, id: "2022040294", empIdOff: "", name: "Mahidul Hasan", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "06/11/2022", nid: "01630894102", jan: 27997, feb: 19157, mar: 13499, apr: 32378, may: 9249, jun: 25997, jul: 24997, aug: 24997, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 118, id: "2022041173", empIdOff: "", name: "Md. Maksudur Rahman", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "23/11/2022", nid: "6003728257", jan: 31000, feb: 31000, mar: 15500, apr: 31000, may: 10850, jun: 31000, jul: 30000, aug: 30000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 119, id: "2024049934", empIdOff: "", name: "Md. Abu Sayed Sayem", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "08/07/2024", nid: "5554332857", jan: 43000, feb: 43000, mar: 21500, apr: 43000, may: 15050, jun: 43000, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 120, id: "2025053921", empIdOff: "", name: "Md. Tonmoy Hossen", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Tr. Merchandiser", joinDate: "01/02/2025", nid: "7364376082", jan: 18000, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 121, id: "2022041218", empIdOff: "", name: "Md. Mustafizur Rahman", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "04/12/2022", nid: "9105933247", jan: 25800, feb: 30800, mar: 17900, apr: 35800, may: 12530, jun: 35800, jul: 34800, aug: 35800, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 122, id: "2023043355", empIdOff: "", name: "Dr. Dewan Ashik Ahmed", type: "Office Executive", department: "Admin and Compliance", section: "Medical", designation: "Doctor", joinDate: "01/03/2023", nid: "4607570985", jan: 51000, feb: 51000, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 123, id: "2024047178", empIdOff: "", name: "Md. Sabbir Rahman", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "10/01/2024", nid: "1925715482", jan: 44583, feb: 45483, mar: 22083, apr: 44583, may: 15333, jun: 44583, jul: 44900, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 124, id: "2024052679", empIdOff: "", name: "Md. Sagar Howlader", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Officer", joinDate: "10/11/2024", nid: "1490260534", jan: 27000, feb: 28000, mar: 14040, apr: 24540, may: 9450, jun: 27000, jul: 23540, aug: 23000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 125, id: "2025054554", empIdOff: "", name: "Moniur Rahman Mridha", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "01/03/2025", nid: "6903894340", jan: 45000, feb: 45000, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 126, id: "2025054554", empIdOff: "", name: "Moniur Rahman Mridha", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "01/03/2025", nid: "6903894340", jan: 0, feb: 0, mar: 25223, apr: 44723, may: 16703, jun: 47723, jul: 44723, aug: 46723, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 127, id: "2025054598", empIdOff: "", name: "Md Zubayer Hossain Khan", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "10/03/2025", nid: "6900447589", jan: 42000, feb: 42000, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 128, id: "2025054611", empIdOff: "", name: "Md. Jakir Hossain", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "15/03/2025", nid: "1490964440", jan: 0, feb: 0, mar: 25223, apr: 47723, may: 16703, jun: 47723, jul: 47677, aug: 46723, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 129, id: "2021023801", empIdOff: "", name: "Md. Rabiul Hasan", type: "Office Executive", department: "Admin and Compliance", section: "Fire and Safety", designation: "Asst. Officer", joinDate: "15/03/2021", nid: "01795885085", jan: 24800, feb: 24500, mar: 16900, apr: 33800, may: 13182, jun: 37180, jul: 32800, aug: 32800, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 130, id: "2021024689", empIdOff: "", name: "Abdullah-Al-Fahad", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Sr. Manager", joinDate: "10/06/2021", nid: "5660134086", jan: 66083, feb: 66083, mar: 37833, apr: 66083, may: 26358, jun: 76083, jul: 75083, aug: 75083, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 131, id: "2021030482", empIdOff: "", name: "Md. Abu Tamim", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "10/11/2021", nid: "3734095684", jan: 33000, feb: 33000, mar: 16500, apr: 33000, may: 11550, jun: 33000, jul: 32000, aug: 32000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 132, id: "2022035481", empIdOff: "", name: "Mizanur Rahman", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "02/04/2022", nid: "N-7355190161", jan: 27573, feb: 27573, mar: 13787, apr: 27573, may: 9651, jun: 27573, jul: 26573, aug: 26573, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 133, id: "2023043355", empIdOff: "", name: "Dr. Dewan Ashik Ahmed", type: "Office Executive", department: "Admin and Compliance", section: "Medical", designation: "Doctor", joinDate: "01/03/2023", nid: "4607570985", jan: 0, feb: 0, mar: 28586, apr: 54086, may: 18930, jun: 54086, jul: 53086, aug: 53086, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 134, id: "2023044857", empIdOff: "", name: "Md. Rakibul Alam Raju", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Deputy Manager", joinDate: "16/09/2023", nid: "1458350384", jan: 80383, feb: 80383, mar: 39983, apr: 80383, may: 27863, jun: 80383, jul: 79383, aug: 79383, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 135, id: "2023045170", empIdOff: "", name: "Utsha Chakraborty", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "04/10/2023", nid: "9155039424", jan: 30000, feb: 30000, mar: 15000, apr: 30000, may: 10500, jun: 30000, jul: 29000, aug: 29000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 136, id: "2025054613", empIdOff: "", name: "Khandkar Mohammad Nizamuddin", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Sr. Manager", joinDate: "07/04/2025", nid: "8208455611", jan: 109583, feb: 109583, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 137, id: "2025056561", empIdOff: "", name: "Arman Hossain Juwel", type: "Office Executive", department: "Admin and Compliance", section: "Admin and Compliance", designation: "Officer", joinDate: "01/09/2025", nid: "6001747143", jan: 22440, feb: 18700, mar: 11000, apr: 22000, may: 9020, jun: 19440, jul: 18980, aug: 21440, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 138, id: "2025057416", empIdOff: "", name: "Nipa Das", type: "Office Executive", department: "Admin and Compliance", section: "Welfare", designation: "Welfare Officer", joinDate: "14/10/2025", nid: "6017065951", jan: 22000, feb: 22000, mar: 10560, apr: 22000, may: 7700, jun: 22000, jul: 21000, aug: 21000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 139, id: "2026058724", empIdOff: "", name: "Md. Sakir Ahmed", type: "Office Executive", department: "Admin and Compliance", section: "Admin and Compliance", designation: "Jr. Officer", joinDate: "18/02/2026", nid: "", jan: 0, feb: 6286, mar: 6080, apr: 11190, may: 3350, jun: 12150, jul: 11830, aug: 13750, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 140, id: "2026061205", empIdOff: "", name: "Md. Nazmul Hasan", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Sr. Officer (Recruitment)", joinDate: "15/08/2026", nid: "6850751659", jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 23726, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 141, id: "2025054373", empIdOff: "", name: "Mohammod Asfaqul Islam Turzo", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "10/02/2025", nid: "8260509859", jan: 25500, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 142, id: "2025054850", empIdOff: "", name: "Md. Rifat Hasan", type: "Office Executive", department: "Merchandising Supply Chain", section: "Merchandising Supply Chain", designation: "Officer", joinDate: "19/04/2025", nid: "1953855101", jan: 22000, feb: 22000, mar: 11000, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 143, id: "2025055532", empIdOff: "", name: "Anower Hossain", type: "Office Executive", department: "Maintenance (RMG)", section: "Maintenance RMG", designation: "Asst. Officer", joinDate: "01/07/2025", nid: "19951314617000014", jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 33973, aug: 34353, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 144, id: "2025057075", empIdOff: "", name: "Md. Al Amin", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "07/10/2025", nid: "9161575627", jan: 15120, feb: 16400, mar: 13000, apr: 20102, may: 9100, jun: 19772, jul: 17871, aug: 18822, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 145, id: "2025057077", empIdOff: "", name: "Md. Tamzit Ahmed", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Officer", joinDate: "01/10/2025", nid: "5068309904", jan: 32000, feb: 32000, mar: 17920, apr: 32640, may: 11840, jun: 33920, jul: 31640, aug: 31640, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 146, id: "2025057264", empIdOff: "", name: "Sultan Mahamud", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "08/10/2025", nid: "6001681276", jan: 30000, feb: 30000, mar: 15000, apr: 30000, may: 10500, jun: 30000, jul: 29000, aug: 29000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 147, id: "2025057721", empIdOff: "", name: "Azizul Hakim Rakib", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "08/11/2025", nid: "5564931102", jan: 25000, feb: 25000, mar: 12500, apr: 25000, may: 8750, jun: 25000, jul: 24000, aug: 24500, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 148, id: "2026061639", empIdOff: "", name: "Mst. Aesha Siddika", type: "Office Executive", department: "Admin and Compliance", section: "Welfare", designation: "Sr. Welfare Officer", joinDate: "22/08/2026", nid: "7319836917", jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 9790, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 149, id: "2024048213", empIdOff: "", name: "Shadman Shakib", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "21/03/2024", nid: "6901089885", jan: 26000, feb: 26000, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 150, id: "2024049934", empIdOff: "", name: "Md. Abu Sayed Sayem", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "08/07/2024", nid: "5554332857", jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 44602, aug: 44602, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 151, id: "2024052484", empIdOff: "", name: "Md. Mushfiqur Rahman", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "20/10/2024", nid: "1952297065", jan: 39000, feb: 40220, mar: 19500, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 152, id: "2025057076", empIdOff: "", name: "Mahmmad Ali", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "01/10/2025", nid: "5102108742", jan: 43860, feb: 43000, mar: 21500, apr: 43000, may: 15050, jun: 43000, jul: 42000, aug: 42000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 153, id: "2025058228", empIdOff: "", name: "Sajjad Al Mamun", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "10/12/2025", nid: "3310648831", jan: 30000, feb: 24880, mar: 15000, apr: 30000, may: 10500, jun: 30000, jul: 26000, aug: 26000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 154, id: "2026058628", empIdOff: "", name: "Md. Jafor", type: "Office Executive", department: "Merchandising Supply Chain", section: "Merchandising Supply Chain", designation: "Officer", joinDate: "01/02/2026", nid: "2410264895", jan: 0, feb: 29120, mar: 14000, apr: 28000, may: 9800, jun: 28000, jul: 27000, aug: 27000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 155, id: "2026058688", empIdOff: "", name: "Md. Razaul Karim", type: "Office Executive", department: "Maintenance", section: "Maintenance Utility & Textile", designation: "Asst. Engineer", joinDate: "15/02/2026", nid: "3754187734", jan: 0, feb: 15000, mar: 14400, apr: 29400, may: 9300, jun: 29400, jul: 30510, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 156, id: "2026059465", empIdOff: "", name: "Arif Hossain", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "16/05/2026", nid: "4204139473", jan: 0, feb: 0, mar: 0, apr: 0, may: 7452, jun: 28000, jul: 27000, aug: 27000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 157, id: "2025054635", empIdOff: "", name: "Unmon Basak Arnob", type: "Office Executive", department: "Merchandising Supply Chain", section: "Merchandising Supply Chain", designation: "Asst. Officer", joinDate: "10/04/2025", nid: "1509652457", jan: 22000, feb: 22000, mar: 10560, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 158, id: "2025054635", empIdOff: "", name: "Unmon Basak Arnob", type: "Office Executive", department: "Merchandising Supply Chain", section: "Merchandising Supply Chain", designation: "Asst. Officer", joinDate: "10/04/2025", nid: "1509652457", jan: 0, feb: 0, mar: 0, apr: 26000, may: 9100, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 159, id: "2025056804", empIdOff: "", name: "Md. Emrul Kayes Pranto", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "14/09/2025", nid: "6004102932", jan: 35000, feb: 35000, mar: 17500, apr: 35000, may: 12250, jun: 35000, jul: 34000, aug: 34000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 160, id: "2025057578", empIdOff: "", name: "Abdul Mukit", type: "Office Executive", department: "Merchandising Supply Chain", section: "Merchandising Supply Chain", designation: "Officer", joinDate: "01/11/2025", nid: "8705707506", jan: 30000, feb: 30000, mar: 15000, apr: 30000, may: 10500, jun: 30000, jul: 29000, aug: 29000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 161, id: "2026058538", empIdOff: "", name: "Md. Roni Islam", type: "Office Executive", department: "Merchandising Supply Chain", section: "Merchandising Supply Chain", designation: "Officer", joinDate: "15/01/2026", nid: "6438180991", jan: 15355, feb: 28000, mar: 14000, apr: 28000, may: 9800, jun: 28000, jul: 27000, aug: 27000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 162, id: "2026059466", empIdOff: "", name: "Md. Manirul Islam", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "06/06/2026", nid: "6444374356", jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 38333, jul: 45000, aug: 45000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 163, id: "2026059552", empIdOff: "", name: "Md. Ashikul Islam", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "08/06/2026", nid: "8238449204", jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 35840, jul: 46040, aug: 47000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 164, id: "2026060478", empIdOff: "", name: "Saju Kundu", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "04/07/2026", nid: "4210662526", jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 33323, aug: 37000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 165, id: "2022032904", empIdOff: "", name: "Md. Shamim Reza", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Sr. Officer", joinDate: "04/01/2022", nid: "8224532856", jan: 36300, feb: 36300, mar: 18150, apr: 37026, may: 12705, jun: 36300, jul: 36026, aug: 36026, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 166, id: "2022036851", empIdOff: "", name: "Md. Sabuz Mia", type: "Office Executive", department: "Maintenance (RMG)", section: "Maintenance RMG", designation: "Asst. Officer", joinDate: "11/06/2022", nid: "7345099647.", jan: 37200, feb: 37200, mar: 18600, apr: 37200, may: 13020, jun: 39510, jul: 41564, aug: 40514, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 167, id: "2022039244", empIdOff: "", name: "Md. Mehedi Hasan", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Sr. Merchandiser", joinDate: "19/09/2022", nid: "7804780117", jan: 47836, feb: 47836, mar: 23710, apr: 47836, may: 16472, jun: 47836, jul: 46836, aug: 46836, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 168, id: "2022039923", empIdOff: "", name: "Md. Razaul Karim", type: "Office Executive", department: "Merchandising Supply Chain", section: "Merchandising Supply Chain", designation: "Officer", joinDate: "15/10/2022", nid: "2371741717", jan: 21824, feb: 26424, mar: 14317, apr: 20998, may: 8393, jun: 24786, jul: 20496, aug: 23736, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 169, id: "2024052060", empIdOff: "", name: "Rakib Hossain Sarder", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "14/09/2024", nid: "7804176266", jan: 27540, feb: 27000, mar: 13500, apr: 27000, may: 9450, jun: 27000, jul: 26540, aug: 26000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 170, id: "2024052571", empIdOff: "", name: "Md. Pervez Mosharaf", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "02/11/2024", nid: "4643575287", jan: 34000, feb: 38040, mar: 17000, apr: 34000, may: 11900, jun: 34000, jul: 34000, aug: 34680, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 171, id: "2024052678", empIdOff: "", name: "Jewel Islam", type: "Office Executive", department: "Human Resources", section: "Human Resources", designation: "Officer", joinDate: "10/11/2024", nid: "8233013773", jan: 18600, feb: 25020, mar: 14560, apr: 28000, may: 10920, jun: 28000, jul: 28120, aug: 27560, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 172, id: "2024052918", empIdOff: "", name: "Md. Jahirul Islam", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Merchandiser", joinDate: "01/12/2024", nid: "4173377666", jan: 44000, feb: 48000, mar: 22000, apr: 44000, may: 15400, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 173, id: "2025054610", empIdOff: "", name: "Md. Faysal Hossain", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Sr. Merchandiser", joinDate: "15/03/2025", nid: "8246115276", jan: 0, feb: 0, mar: 26904, apr: 50904, may: 17816, jun: 50904, jul: 49904, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 174, id: "2025055915", empIdOff: "", name: "Md. Nazim Uddin", type: "Office Executive", department: "Maintenance (RMG)", section: "Maintenance RMG", designation: "Asst. Officer", joinDate: "14/07/2025", nid: "5084212322", jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 34360, aug: 40360, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 175, id: "2025056467", empIdOff: "", name: "Md. Hasibur Rahman", type: "Office Executive", department: "Merchandising Supply Chain", section: "Merchandising Supply Chain", designation: "Asst. Officer", joinDate: "16/08/2025", nid: "", jan: 22000, feb: 22000, mar: 11000, apr: 22000, may: 7700, jun: 22000, jul: 21000, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 176, id: "2025056900", empIdOff: "", name: "Rafsun", type: "Office Executive", department: "Maintenance (RMG)", section: "Maintenance RMG", designation: "Asst. Officer", joinDate: "13/09/2025", nid: "1518802325", jan: 32000, feb: 32000, mar: 16000, apr: 32000, may: 11200, jun: 32000, jul: 30360, aug: 32050, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 177, id: "2025056904", empIdOff: "", name: "Md. Golam Mohiuddin", type: "Office Executive", department: "Admin and Compliance", section: "Admin and Compliance", designation: "Sr. Officer (Admin)", joinDate: "18/09/2025", nid: "2402294660", jan: 34980, feb: 33000, mar: 16500, apr: 33660, may: 12870, jun: 35640, jul: 31160, aug: 31820, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 178, id: "2026059052", empIdOff: "", name: "Md. Salim Ahmmed Munna", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Manager", joinDate: "09/04/2026", nid: "19921918194000301", jan: 0, feb: 0, mar: 0, apr: 55000, may: 26250, jun: 75000, jul: 75500, aug: 74000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 179, id: "2026059632", empIdOff: "", name: "Shekhor Chandro Shill", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "10/06/2026", nid: "3306837182", jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 20160, jul: 27000, aug: 27000, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 180, id: "2026061211", empIdOff: "", name: "Mohammad Tasnim Ferdous", type: "Office Executive", department: "Marketing and Merchandising", section: "Marketing & Merchandising", designation: "Assistant Merchandiser", joinDate: "02/08/2026", nid: "R1515460887", jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 28032, sep: 0, oct: 0, nov: 0, dec: 0 },
  { sl: 181, id: "2026061223", empIdOff: "", name: "Md. Parvej Hossain", type: "Office Executive", department: "Maintenance", section: "Maintenance Utility & Textile", designation: "Engineer", joinDate: "03/08/2026", nid: "R7355204947", jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 31742, sep: 0, oct: 0, nov: 0, dec: 0 },
];

function EmployeeSalaryHistoryPage() {
  const [year, setYear] = useState("2026");
  const [payMode, setPayMode] = useState("ALL");
  const [salaryType, setSalaryType] = useState("ALL");
  const [empType, setEmpType] = useState("Office Executive");
  const [department, setDepartment] = useState("All Departments");
  const [section, setSection] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [empIdInput, setEmpIdInput] = useState("");
  const [outputMode, setOutputMode] = useState("System");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(181); // Default show all entries like screenshot or paginated

  const filteredData = useMemo(() => {
    return salaryHistoryData.filter((item) => {
      if (empIdInput.trim()) {
        const ids = empIdInput.split(",").map((i) => i.trim());
        if (!ids.some((id) => item.id.includes(id))) return false;
      }
      if (department !== "All Departments" && item.department !== department) {
        return false;
      }
      if (section !== "ALL" && item.section !== section) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.id.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.section.toLowerCase().includes(q) ||
          item.designation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [empIdInput, department, section, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, r) => {
        acc.jan += r.jan;
        acc.feb += r.feb;
        acc.mar += r.mar;
        acc.apr += r.apr;
        acc.may += r.may;
        acc.jun += r.jun;
        acc.jul += r.jul;
        acc.aug += r.aug;
        acc.sep += r.sep;
        acc.oct += r.oct;
        acc.nov += r.nov;
        acc.dec += r.dec;
        acc.totalAnnual +=
          r.jan + r.feb + r.mar + r.apr + r.may + r.jun + r.jul + r.aug + r.sep + r.oct + r.nov + r.dec;
        return acc;
      },
      {
        jan: 0,
        feb: 0,
        mar: 0,
        apr: 0,
        may: 0,
        jun: 0,
        jul: 0,
        aug: 0,
        sep: 0,
        oct: 0,
        nov: 0,
        dec: 0,
        totalAnnual: 0,
      }
    );
  }, [filteredData]);

  const formatCurrency = (val: number) => {
    if (val === 0) return "0";
    return new Intl.NumberFormat("en-BD", {
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleExportCSV = () => {
    const headers = [
      "SL",
      "Id",
      "Emp Id(Off)",
      "Name",
      "Type",
      "Department",
      "Section",
      "Designation",
      "Join Date",
      "NID",
      "Jan,2026",
      "Feb,2026",
      "Mar,2026",
      "Apr,2026",
      "May,2026",
      "Jun,2026",
      "Jul,2026",
      "Aug,2026",
      "Sep,2026",
      "Oct,2026",
      "Nov,2026",
      "Dec,2026",
    ];
    const rows = filteredData.map((r) => [
      r.sl,
      r.id,
      r.empIdOff,
      r.name,
      r.type,
      r.department,
      r.section,
      r.designation,
      r.joinDate,
      r.nid,
      r.jan,
      r.feb,
      r.mar,
      r.apr,
      r.may,
      r.jun,
      r.jul,
      r.aug,
      r.sep,
      r.oct,
      r.nov,
      r.dec,
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
    link.setAttribute("download", `employee_salary_history_${year}.csv`);
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
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link to="/payroll-reports" className="hover:text-foreground transition-colors">
              Payroll Reports
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-semibold">Employee Salary History</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                  <FileText className="size-6" />
                </div>
                Employee Salary History
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Month-by-month salary disbursement history and comparison statement for {year}.
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
                  Total Employees
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
                  August 2026 Payout
                </p>
                <p className="text-xl font-bold text-emerald-600">
                  ৳ {formatCurrency(totals.aug)}
                </p>
              </div>
            </div>

            <div className="bg-card border border-border/60 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-600 border border-purple-500/20">
                <TrendingUp className="size-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  July 2026 Payout
                </p>
                <p className="text-xl font-bold text-purple-600">
                  ৳ {formatCurrency(totals.jul)}
                </p>
              </div>
            </div>

            <div className="bg-card border border-border/60 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 border border-amber-500/20">
                <Building2 className="size-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Yearly Total Disbursed
                </p>
                <p className="text-xl font-bold text-amber-600">
                  ৳ {formatCurrency(totals.totalAnnual)}
                </p>
              </div>
            </div>
          </div>

          {/* Filters Section (Matching Reference Screenshot Layout) */}
          <div className="bg-card rounded-2xl border border-border/60 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40 text-xs font-bold text-foreground uppercase tracking-wider">
              <Filter className="size-4 text-primary" />
              Filter & Search Parameters
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
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
                <label className="text-xs font-semibold text-foreground/80 block">Pay Mode</label>
                <SearchableSelect
                  value={payMode}
                  onChange={setPayMode}
                  options={[
                    { value: "ALL", label: "ALL" },
                    { value: "Bank", label: "Bank" },
                    { value: "Cash", label: "Cash" },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Salary Type</label>
                <SearchableSelect
                  value={salaryType}
                  onChange={setSalaryType}
                  options={[
                    { value: "ALL", label: "ALL" },
                    { value: "Regular", label: "Regular" },
                    { value: "Executive", label: "Executive" },
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
                    { value: "Office Executive", label: "Office Executive" },
                    { value: "Worker", label: "Worker" },
                    { value: "Staff", label: "Staff" },
                    { value: "ALL", label: "ALL" },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Department</label>
                <SearchableSelect
                  value={department}
                  onChange={setDepartment}
                  options={[
                    { value: "All Departments", label: "All Departments" },
                    { value: "Human Resources", label: "Human Resources" },
                    { value: "Marketing and Merchandising", label: "Marketing and Merchandising" },
                    { value: "Admin and Compliance", label: "Admin and Compliance" },
                    { value: "Maintenance (RMG)", label: "Maintenance (RMG)" },
                    { value: "Maintenance", label: "Maintenance" },
                    { value: "Merchandising Supply Chain", label: "Merchandising Supply Chain" },
                    { value: "Production Planning", label: "Production Planning" },
                  ]}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Section</label>
                <SearchableSelect
                  value={section}
                  onChange={setSection}
                  options={[
                    { value: "ALL", label: "ALL" },
                    { value: "Human Resources", label: "Human Resources" },
                    { value: "Marketing & Merchandising", label: "Marketing & Merchandising" },
                    { value: "Admin and Compliance", label: "Admin and Compliance" },
                    { value: "Welfare", label: "Welfare" },
                    { value: "Fire and Safety", label: "Fire and Safety" },
                    { value: "Maintenance RMG", label: "Maintenance RMG" },
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
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Employee Id</label>
                <input
                  type="text"
                  value={empIdInput}
                  onChange={(e) => setEmpIdInput(e.target.value)}
                  placeholder="Use Comma As Separator"
                  className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-xs focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/60 shadow-sm"
                />
              </div>

              <div className="flex items-center gap-4 py-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input
                    type="radio"
                    name="outputMode"
                    value="System"
                    checked={outputMode === "System"}
                    onChange={(e) => setOutputMode(e.target.value)}
                    className="size-3.5 accent-primary"
                  />
                  <span>System</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input
                    type="radio"
                    name="outputMode"
                    value="Office"
                    checked={outputMode === "Office"}
                    onChange={(e) => setOutputMode(e.target.value)}
                    className="size-3.5 accent-primary"
                  />
                  <span>Office</span>
                </label>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex justify-end gap-3 pt-2 border-t border-border/40">
              <button
                onClick={() => {
                  setEmpIdInput("");
                  setDepartment("All Departments");
                  setSection("ALL");
                  setSearchQuery("");
                }}
                className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="size-3.5 text-muted-foreground" />
                Reset Filters
              </button>
              <button className="h-9 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all uppercase tracking-wide">
                Get Salary Data
              </button>
            </div>
          </div>

          {/* Action Toolbar & Live Search */}
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

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by ID, Name, Department..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-border/80 bg-background text-xs focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/60 shadow-sm"
                />
              </div>
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
                      Id
                    </th>
                    <th className="px-4 py-3 border-r border-border/40 font-bold text-foreground">
                      Emp Id(Off)
                    </th>
                    <th className="px-4 py-3 border-r border-border/40 font-bold text-foreground">
                      Name
                    </th>
                    <th className="px-4 py-3 border-r border-border/40">Type</th>
                    <th className="px-4 py-3 border-r border-border/40">Department</th>
                    <th className="px-4 py-3 border-r border-border/40">Section</th>
                    <th className="px-4 py-3 border-r border-border/40">Designation</th>
                    <th className="px-4 py-3 border-r border-border/40 text-center">Join Date</th>
                    <th className="px-4 py-3 border-r border-border/40">NID</th>
                    <th className="px-4 py-3 border-r border-border/40 text-right">Jan,2026</th>
                    <th className="px-4 py-3 border-r border-border/40 text-right">Feb,2026</th>
                    <th className="px-4 py-3 border-r border-border/40 text-right">Mar,2026</th>
                    <th className="px-4 py-3 border-r border-border/40 text-right">Apr,2026</th>
                    <th className="px-4 py-3 border-r border-border/40 text-right">May,2026</th>
                    <th className="px-4 py-3 border-r border-border/40 text-right">Jun,2026</th>
                    <th className="px-4 py-3 border-r border-border/40 text-right">Jul,2026</th>
                    <th className="px-4 py-3 border-r border-border/40 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      Aug,2026
                    </th>
                    <th className="px-4 py-3 border-r border-border/40 text-right text-muted-foreground/60">
                      Sep,2026
                    </th>
                    <th className="px-4 py-3 border-r border-border/40 text-right text-muted-foreground/60">
                      Oct,2026
                    </th>
                    <th className="px-4 py-3 border-r border-border/40 text-right text-muted-foreground/60">
                      Nov,2026
                    </th>
                    <th className="px-4 py-3 text-right text-muted-foreground/60">Dec,2026</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-medium">
                  {paginatedData.map((row) => (
                    <tr
                      key={`${row.sl}-${row.id}`}
                      className="hover:bg-muted/40 transition-colors group text-[11px]"
                    >
                      <td className="px-3 py-2.5 text-center border-r border-border/30 text-muted-foreground font-semibold bg-muted/10">
                        {row.sl}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 font-mono font-bold text-foreground">
                        {row.id}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 font-mono text-muted-foreground">
                        {row.empIdOff || "—"}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 font-bold text-foreground">
                        {row.name}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-muted-foreground">
                        {row.type}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-muted-foreground">
                        {row.department}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-muted-foreground">
                        {row.section}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-muted-foreground">
                        {row.designation}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-center font-mono text-muted-foreground">
                        {row.joinDate}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 font-mono text-muted-foreground/80">
                        {row.nid || "—"}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-right font-mono text-foreground">
                        {formatCurrency(row.jan)}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-right font-mono text-foreground">
                        {formatCurrency(row.feb)}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-right font-mono text-foreground">
                        {formatCurrency(row.mar)}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-right font-mono text-foreground">
                        {formatCurrency(row.apr)}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-right font-mono text-foreground">
                        {formatCurrency(row.may)}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-right font-mono text-foreground">
                        {formatCurrency(row.jun)}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-right font-mono text-foreground">
                        {formatCurrency(row.jul)}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                        {formatCurrency(row.aug)}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-right font-mono text-muted-foreground/50">
                        {formatCurrency(row.sep)}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-right font-mono text-muted-foreground/50">
                        {formatCurrency(row.oct)}
                      </td>
                      <td className="px-4 py-2.5 border-r border-border/30 text-right font-mono text-muted-foreground/50">
                        {formatCurrency(row.nov)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-muted-foreground/50">
                        {formatCurrency(row.dec)}
                      </td>
                    </tr>
                  ))}

                  {filteredData.length === 0 && (
                    <tr>
                      <td
                        colSpan={22}
                        className="px-4 py-12 text-center text-muted-foreground font-medium"
                      >
                        No employee salary history records found matching your search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>

                {/* Total Summary Footer */}
                {filteredData.length > 0 && (
                  <tfoot className="bg-muted/90 font-bold text-xs border-t-2 border-border/80 sticky bottom-0 z-10 backdrop-blur-sm">
                    <tr>
                      <td
                        colSpan={10}
                        className="px-4 py-3 border-r border-border/40 text-right uppercase tracking-wider text-foreground"
                      >
                        Grand Total ({filteredData.length} Employees)
                      </td>
                      <td className="px-4 py-3 border-r border-border/40 text-right font-mono">
                        ৳ {formatCurrency(totals.jan)}
                      </td>
                      <td className="px-4 py-3 border-r border-border/40 text-right font-mono">
                        ৳ {formatCurrency(totals.feb)}
                      </td>
                      <td className="px-4 py-3 border-r border-border/40 text-right font-mono">
                        ৳ {formatCurrency(totals.mar)}
                      </td>
                      <td className="px-4 py-3 border-r border-border/40 text-right font-mono">
                        ৳ {formatCurrency(totals.apr)}
                      </td>
                      <td className="px-4 py-3 border-r border-border/40 text-right font-mono">
                        ৳ {formatCurrency(totals.may)}
                      </td>
                      <td className="px-4 py-3 border-r border-border/40 text-right font-mono">
                        ৳ {formatCurrency(totals.jun)}
                      </td>
                      <td className="px-4 py-3 border-r border-border/40 text-right font-mono">
                        ৳ {formatCurrency(totals.jul)}
                      </td>
                      <td className="px-4 py-3 border-r border-border/40 text-right font-mono text-emerald-600">
                        ৳ {formatCurrency(totals.aug)}
                      </td>
                      <td className="px-4 py-3 border-r border-border/40 text-right font-mono text-muted-foreground/60">
                        ৳ {formatCurrency(totals.sep)}
                      </td>
                      <td className="px-4 py-3 border-r border-border/40 text-right font-mono text-muted-foreground/60">
                        ৳ {formatCurrency(totals.oct)}
                      </td>
                      <td className="px-4 py-3 border-r border-border/40 text-right font-mono text-muted-foreground/60">
                        ৳ {formatCurrency(totals.nov)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-muted-foreground/60">
                        ৳ {formatCurrency(totals.dec)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Table Footer with Entries Info & Controls */}
            <div className="p-4 bg-card border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="text-muted-foreground font-medium">
                Showing {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}{" "}
                entries
              </div>

              {pageSize < filteredData.length && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="h-8 px-3 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:hover:bg-card transition-colors flex items-center gap-1 font-semibold"
                  >
                    <ChevronLeft className="size-3.5" /> Previous
                  </button>
                  <span className="px-2 font-semibold">Page {currentPage}</span>
                  <button
                    disabled={currentPage * pageSize >= filteredData.length}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="h-8 px-3 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:hover:bg-card transition-colors flex items-center gap-1 font-semibold"
                  >
                    Next <ChevronRight className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
