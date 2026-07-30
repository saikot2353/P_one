import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, FileSpreadsheet, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/changes")({
  component: ChangesPage,
});

type ChangeRecord = {
  id: string;
  date: string;
  type: "Modify" | "New Addition" | "";
  module: string;
  link?: string;
  descriptionEn: string;
  descriptionBn: string;
};

function ChangesPage() {
  const [records, setRecords] = useState<ChangeRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("system_changes_v56");
    if (saved) {
      setRecords(JSON.parse(saved));
    } else {
      setRecords([
        {
          id: "1",
          date: "2026-07-25T10:15",
          type: "New Addition",
          module: "Module Selection",
          link: "/module-selection",
          descriptionEn: "Created this 'Changes!' page! It works just like Excel, so you can easily track and edit all the new updates happening in the system.",
          descriptionBn: "নতুন 'Changes!' পেজ তৈরি করা হয়েছে! এটি এক্সেলের মতো কাজ করে, তাই আপনি সহজেই সিস্টেমের নতুন আপডেটগুলো ট্র্যাক ও এডিট করতে পারবেন।",
        },
        {
          id: "2",
          date: "2026-07-25T11:45",
          type: "Modify",
          module: "Order Profile",
          link: "/merchandising-order-profile",
          descriptionEn: "Made the Basic Information section much cleaner! It's now laid out in 4 neat columns, making it much easier to read and prettier to look at.",
          descriptionBn: "বেসিক ইনফরমেশন সেকশনটি আরও সুন্দর করা হয়েছে! এটি এখন ৪টি কলামে সাজানো, ফলে পড়া সহজ এবং দেখতে আরও ভালো লাগছে।",
        },
        {
          id: "3",
          date: "2026-07-25T12:10",
          type: "Modify",
          module: "Order Profile",
          link: "/merchandising-order-profile",
          descriptionEn: "Fixed the messy tables for Yarn, Fabric, and Trim! They are now combined into one perfectly aligned master table.",
          descriptionBn: "Yarn, Fabric এবং Trim-এর ছড়ানো টেবিলগুলো ঠিক করা হয়েছে! এগুলোকে এখন একটি সুন্দর সাজানো মাস্টার টেবিলে একত্রিত করা হয়েছে।",
        },
        {
          id: "4",
          date: "2026-07-25T13:00",
          type: "Modify",
          module: "Order Profile",
          link: "/merchandising-order-profile",
          descriptionEn: "Made the tables more compact by reducing the text size and spacing. Now everything fits on the screen without having to scroll left and right!",
          descriptionBn: "টেক্সট সাইজ এবং স্পেসিং কমিয়ে টেবিলগুলোকে আরও কম্প্যাক্ট করা হয়েছে। এখন ডানে-বামে স্ক্রল করা ছাড়াই সব এক স্ক্রিনে ফিট হয়ে যাবে!",
        },
        {
          id: "5",
          date: "2026-07-25T13:45",
          type: "Modify",
          module: "Global System",
          link: "/",
          descriptionEn: "Switched the entire system to default to Light Mode! Everything will look bright and clear right from the start.",
          descriptionBn: "সিস্টেমের ডিফল্ট থিম হিসেবে লাইট মোড সেট করা হয়েছে! এখন সবকিছু শুরু থেকেই উজ্জ্বল এবং পরিষ্কার দেখাবে।",
        },
        {
          id: "6",
          date: "2026-07-25T14:50",
          type: "Modify",
          module: "Personnel List",
          link: "/personnel-list",
          descriptionEn: "Moved the 'Operations' tools to a sidebar! Now, when you select an employee, the tools automatically pop up on the right side. You can still see the main table and continue clicking other employees to update multiple at once.",
          descriptionBn: "অপারেশন টুলসগুলোকে সাইডবারে সরানো হয়েছে! এখন মেইন টেবিল থেকে যেকোনো এমপ্লয়ি সিলেক্ট করলেই টুলসগুলো ডানপাশে স্লাইড হয়ে খুলবে। আপনি তখনও মেইন টেবিল দেখতে পাবেন এবং একসাথে একাধিক কাজ করার জন্য অন্য এমপ্লয়ি সিলেক্ট করতে পারবেন।",
        },
        {
          id: "7",
          date: "2026-07-25T15:08",
          type: "Modify",
          module: "Payroll Deductions",
          link: "/payroll-deductions",
          descriptionEn: "Removed the 'Auto-Skip during Ramadan' option and the 'Single Period Exceptions' configuration from the Payroll Deductions setup panel.",
          descriptionBn: "পেরোল ডিডাকশন প্যানেল থেকে 'রোজার মাসে অটো-স্কিপ' অপশন এবং 'সিঙ্গেল পিরিয়ড এক্সেপশন' সেটিং অপশনগুলো বাদ দেওয়া হয়েছে।",
        },
        {
          id: "8",
          date: "2026-07-25T15:35",
          type: "Modify",
          module: "User Management",
          link: "/user-management",
          descriptionEn: "Merged Company and Section access options into a nested view where Areas (renamed from Sections) show up directly under their selected Company. Renamed all 'Section' terms to 'Area'.",
          descriptionBn: "ইউজার ম্যানেজমেন্টে কোম্পানি এবং সেকশন এক্সেস অপশনগুলোকে একত্রিত করা হয়েছে। এখন কোম্পানি সিলেক্ট করলেই তার ভেতরের এরিয়া (সেকশন এর নতুন নাম এরিয়া) অপশনগুলো নিচে দেখা যাবে। এছাড়া সব জায়গায় 'সেকশন' শব্দের নাম পরিবর্তন করে 'এরিয়া' করা হয়েছে।",
        },
        {
          id: "9",
          date: "2026-07-25T15:40",
          type: "Modify",
          module: "Salary Process",
          link: "/monthly-salary-process",
          descriptionEn: "Refactored the Payroll Adjustments editing dialog in Monthly Salary Process. Removed Section 1 (Attendance Parameters) and Section 2 (Monthly Earnings) fields. Upgraded Section 3 (Monthly Deductions & Exceptions) into a premium card-based layout with customized Lucide icons and currency symbols.",
          descriptionBn: "মান্থলি স্যালারি প্রসেসের পেরোল অ্যাডজাস্টমেন্ট এডিট ডায়ালগ রিফ্যাক্টর করা হয়েছে। সেকশন ১ (অ্যাটেনডেন্স প্যারামিটার) এবং সেকশন ২ (মান্থলি আর্নিংস) এর ইনপুটগুলো বাদ দেওয়া হয়েছে। এছাড়া সেকশন ৩ (মান্থলি ডিডাকশন অ্যান্ড এক্সেপশনস) এর ইনপুটগুলোকে আকর্ষণীয় কার্ড ডিজাইনে সাজানো হয়েছে এবং সাথে আইকন ও টাকার সাইন যোগ করা হয়েছে।",
        },
        {
          id: "10",
          date: "2026-07-25T15:43",
          type: "Modify",
          module: "Salary Process",
          link: "/monthly-salary-process",
          descriptionEn: "Upgraded the Monthly Salary Process data table to match the detailed 58-column spreadsheet layout. Loaded the full 14 employees roster matching the active bank and account details exactly.",
          descriptionBn: "মান্থলি স্যালারি প্রসেস টেবিলটিকে ৫৮টি কলামবিশিষ্ট বিশদ স্প্রেডশিট লেআউটে উন্নীত করা হয়েছে। ব্যাংক ও অ্যাকাউন্ট নম্বরসহ ১৪ জন এমপ্লয়ির সম্পুর্ণ ডেটাবেস যুক্ত করা হয়েছে।",
        },
        {
          id: "11",
          date: "2026-07-25T15:46",
          type: "Modify",
          module: "Salary Process",
          link: "/monthly-salary-process",
          descriptionEn: "Added a custom column rearrangement and show/hide toggle panel to the Monthly Salary Process page, enabling draggable reordering, visibility control, and template saving matching the personnel list page design.",
          descriptionBn: "মান্থলি স্যালারি প্রসেস পেজে কলামের ক্রম পরিবর্তন এবং হাইড/শো করার অপশন যুক্ত করা হয়েছে। এর মাধ্যমে ড্র্যাগ করে কলাম সাজানো যাবে, কলামের দৃশ্যমানতা নিয়ন্ত্রণ করা যাবে এবং পার্সোনেল লিস্ট পেজের মতো কাস্টম লেআউট টেমপ্লেট সেভ করা যাবে।",
        },
        {
          id: "12",
          date: "2026-07-25T15:48",
          type: "Modify",
          module: "Salary Process",
          link: "/monthly-salary-process",
          descriptionEn: "Updated default column visibility to show all 58 columns on load, and removed the currency Taka (৳) symbol from the table cell amounts.",
          descriptionBn: "সবগুলো ৫৮টি কলাম লোড হওয়ার সাথে সাথে দৃশ্যমান রাখতে ডিফল্ট সেটিং আপডেট করা হয়েছে এবং টেবিল সেলের অ্যামাউন্ট থেকে টাকা (৳) চিহ্ন বাদ দেওয়া হয়েছে।",
        },
        {
          id: "13",
          date: "2026-07-25T16:20",
          type: "Modify",
          module: "Evaluation",
          link: "/evaluation-propose",
          descriptionEn: "Redesigned all 7 Evaluation sub-pages to be simpler and easier to use! Added a shared horizontal tab navigation bar across all pages so you can jump between Configurator, Evaluation Propose, Propose Increment, Summary, Queue & Approvals, Increment List, and History without using the sidebar. Also cleaned up breadcrumbs, added short descriptions to each page, and renamed jargon-heavy labels (e.g. 'Increment Gadget' is now 'Configurator'). Created a documentation file explaining how the full workflow works.",
          descriptionBn: "ইভ্যালুয়েশন মডিউলের সবগুলো ৭টি সাবপেজ আরও সহজ ও সুন্দর করা হয়েছে! এখন প্রতিটি পেজের উপরে একটি হরিজন্টাল ট্যাব বার আছে — Configurator, Evaluation Propose, Propose Increment, Summary, Queue & Approvals, Increment List, এবং History — যেটাতে দিয়ে সাইডবার ছাড়াই যেকোনো পেজে যাওয়া যাবে। ব্রেডক্রাম্ব ঠিক করা হয়েছে, প্রতিটি পেজে ছোট বিবরণ যোগ করা হয়েছে, এবং 'Increment Gadget' এর মতো কঠিন নামগুলো সহজ করা হয়েছে। এছাড়া সম্পূর্ণ ওয়ার্কফ্লো ব্যাখ্যা করে একটি ডকুমেন্টেশন ফাইলও তৈরি করা হয়েছে।",
        },
        {
          id: "14",
          date: "2026-07-25T16:25",
          type: "Modify",
          module: "Evaluation",
          link: "/evaluation-propose",
          descriptionEn: "Fixed the double-navigation issue in the Evaluation module! Before, there were both sidebar sub-items AND a tab bar — which was confusing. Now the sidebar shows a single 'Evaluation' link, and the tab bar at the top of each page handles all navigation within the module. The sidebar also stays highlighted on all Evaluation pages.",
          descriptionBn: "ইভ্যালুয়েশন মডিউলের ডাবল নেভিগেশন সমস্যা ঠিক করা হয়েছে! আগে সাইডবারে সাব-মেনু ছিল এবং পেজেও ট্যাব বার ছিল — দুটো একসাথে থাকায় বিভ্রান্তি হচ্ছিল। এখন সাইডবারে শুধু একটি 'Evaluation' লিংক আছে, আর পেজের উপরের ট্যাব বার থেকেই সব সাবপেজে যাওয়া যাবে। যেকোনো ইভ্যালুয়েশন পেজে থাকলে সাইডবারের 'Evaluation' আইটেমটি হাইলাইটেড থাকবে।",
        },
        {
          id: "15",
          date: "2026-07-25T17:47",
          type: "New Addition",
          module: "Benefits",
          link: "/payroll-benefits-common",
          descriptionEn: "Brand new Common Benefits page built! You can now filter employees by type, department, section, and benefit category, then enter individual benefit amounts in an editable table. Features include select-all checkboxes, live amount totals, search, pagination, Excel/Print/PDF export, and a Save button with a confirmation toast.",
          descriptionBn: "নতুন Common Benefits পেজ তৈরি হয়েছে! এখন আপনি এমপ্লয়ি টাইপ, ডিপার্টমেন্ট, সেকশন এবং বেনিফিট ক্যাটাগরি দিয়ে ফিল্টার করে প্রতিটি এমপ্লয়ির জন্য বেনিফিট অ্যামাউন্ট সরাসরি টেবিলে এন্ট্রি দিতে পারবেন। সিলেক্ট-অল চেকবক্স, লাইভ অ্যামাউন্ট টোটাল, সার্চ, পেজিনেশন, Excel/Print/PDF এক্সপোর্ট এবং সেভ বাটন সহ কনফার্মেশন নোটিফিকেশনও আছে।",
        },
        {
          id: "16",
          date: "2026-07-25T17:50",
          type: "New Addition",
          module: "Benefits",
          link: "/payroll-benefits-monthly",
          descriptionEn: "New Monthly Benefits page is live! Filter by month, year, benefit type, benefit name, employee type, department, unit, or employee ID. Add new records via the '+' button or the FAB, edit or delete existing ones, and view full details in a clean modal. Modals match the rest of the system's style — orange CLOSE, green SUBMIT.",
          descriptionBn: "নতুন Monthly Benefits পেজ তৈরি হয়েছে! মাস, বছর, বেনিফিট টাইপ, বেনিফিট নাম, এমপ্লয়ি টাইপ, ডিপার্টমেন্ট, ইউনিট বা এমপ্লয়ি আইডি দিয়ে ফিল্টার করা যাবে। '+' বাটন বা ফ্লোটিং বাটন দিয়ে নতুন রেকর্ড যোগ করা যাবে, সম্পাদনা বা মুছে ফেলা যাবে। মোডাল বাকি সিস্টেমের মতোই — অরেঞ্জ CLOSE, সবুজ SUBMIT।",
        },
        {
          id: "17",
          date: "2026-07-25T21:30",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-dashboard",
          descriptionEn: "Restructured the entire Merchandising module sidebar menu into 9 clean, task-oriented categories matching BD garments industry standard workflow stages. Also upgraded the Order Entry form workspace into a Unified Order & Costing Hub, adding a segmented Knit | Woven | Sweater type selector with dynamically conditional fields for Yarn counts, GSM, Weave density, or Sweater Gauges.",
          descriptionBn: "মার্চেন্ডাইজিং মডিউলের সম্পূর্ণ সাইডবার মেনু ৯টি সহজে ব্যবহারযোগ্য ক্যাটাগরিতে পুনর্গঠন করা হয়েছে যা বাংলাদেশের গার্মেন্টস শিল্পের কাজের ধাপগুলোর সাথে সামঞ্জস্যপূর্ণ। তাছাড়া অর্ডার এন্ট্রি ফর্মটিকে একটি ইউনিফাইড অর্ডার এবং কস্টিং হাবে রূপান্তর করা হয়েছে, যেখানে নিট, ওভেন এবং সোয়েটার অর্ডারের জন্য আলাদা আলাদা কন্ডিশনাল প্যারামিটার যেমন জিএসএম, ইয়ার্ন কাউন্ট, উইভ ডেনসিটি এবং সোয়েটার গজ ফিল্ডগুলো স্বয়ংক্রিয়ভাবে চলে আসবে।",
        },
        {
          id: "18",
          date: "2026-07-25T21:40",
          type: "New Addition",
          module: "Merchandising",
          link: "/merchandising-master-settings",
          descriptionEn: "Built the complete RMG Merchandising ERP Suite! Created 7 brand-new dedicated pages: Master Settings (Buyer config, Fabric/Yarn specs, Process Loss %, Trims master), Capacity Planning & Booking (SMV calculator, Monthly limits, Over-booking alerts), Sample Development Tracker (Proto/Fit/PP requisitions & Buyer feedback), Material Bookings (Auto Yarn Kg calculator, Fabric & Trims WOs), Service Work Orders (Washing, Printing, Dyeing, Embroidery sub-contracts), TNA Critical Path Calendar (11 Milestones timeline), and MM BI Reports (PO Order status, Buyer export share). All sidebar links are fully connected.",
          descriptionBn: "সম্পূর্ণ আরএমজি মার্চেন্ডাইজিং ইআরপি স্যুট তৈরি করা হয়েছে! ৭টি নতুন পেজ যোগ করা হয়েছে: মাস্টার সেটিংস, ক্যাপাসিটি প্ল্যানিং, স্যাম্পল ট্র্যাকার, মেটেরিয়াল বুকিং, সার্ভিস ওয়ার্ক অর্ডার, টিএনএ ক্যালেন্ডার এবং এমএম বিআই রিপোর্টস। সাইডবারের সব লিংক সচল করা হয়েছে।",
        },
        {
          id: "19",
          date: "2026-07-25T21:51",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-master-settings",
          descriptionEn: "Completely eliminated duplicate navigation in the Merchandising module! Replaced redundant accordion sub-menus in the sidebar with clean, direct-action top-level navigation links. Sub-view switching is now handled exclusively by the sleek horizontal top tab bar on each dedicated module page for a 100% stable, uncluttered user experience.",
          descriptionBn: "মার্চেন্ডাইজিং মডিউলের সম্পূর্ণ ডুপ্লিকেট নেভিগেশন দূর করা হয়েছে! সাইডবারের বাড়তি সাব-মেনু একর্ডিয়নগুলো সরিয়ে সরাসরি ডিরেক্ট-লিংক মেনু করা হয়েছে। এখন থেকে সব সাব-ভিউ পরিবর্তন প্রতিটি পেজের পরিচ্ছন্ন টপ হরিজন্টাল ট্যাব বার দিয়ে পরিচালিত হবে, যা ইউজার এক্সপেরিয়েন্সকে করেছে ১০০% স্থিতিশীল ও সুন্দর।",
        },
        {
          id: "20",
          date: "2026-07-25T22:00",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-dashboard",
          descriptionEn: "Deep-researched and rebuilt the entire Merchandising sidebar navigation from scratch based on real Bangladesh RMG ERP standards (OCMS BD, PrideSys, Infocrat). New structure: 'Master Settings' accordion (5 sub-items linking directly to specific database tabs), 'Orders & Costing' accordion (Order Ledger + New Order Entry), and 6 clean flat-link items (Sample, Material Booking, Work Orders, TNA, Capacity, Reports). Active state auto-highlights the correct parent and child. Smart auto-expand: accordion opens automatically when you navigate to its page.",
          descriptionBn: "বাংলাদেশের বাস্তব আরএমজি ইআরপি সিস্টেমের (OCMS BD, PrideSys, Infocrat) স্ট্যান্ডার্ড অনুযায়ী মার্চেন্ডাইজিং সাইডবার নেভিগেশন সম্পূর্ণ নতুনভাবে তৈরি করা হয়েছে। নতুন স্ট্রাকচার: 'মাস্টার সেটিংস' একর্ডিয়ন (৫টি সাব-আইটেম যা সরাসরি নির্দিষ্ট ট্যাব খোলে), 'অর্ডার ও কস্টিং' একর্ডিয়ন (অর্ডার লেজার + নতুন অর্ডার এন্ট্রি), এবং ৬টি সরাসরি ফ্ল্যাট লিংক (স্যাম্পল, মেটেরিয়াল বুকিং, ওয়ার্ক অর্ডার, টিএনএ, ক্যাপাসিটি, রিপোর্টস)। সক্রিয় পেজের সাথে মিলিয়ে সাইডবার আইটেম স্বয়ংক্রিয়ভাবে হাইলাইট ও একর্ডিয়ন খোলে।",
        },
        {
          id: "21",
          date: "2026-07-25T22:09",
          type: "New Addition",
          module: "Merchandising",
          link: "/merchandising-inquiry",
          descriptionEn: "Added the missing first stage of the garments order lifecycle: 'Buyer Inquiry & Pre-Costing Quotation' page. The Orders & Costing sidebar accordion now correctly shows all 3 workflow steps in order: Buyer Inquiry & Quotation → Purchase Order (PO) Register → Order Entry & Costing (KDS). The new inquiry page includes: Inquiry Register (log buyer style inquiries with AQL, payment terms, ship date), a live Pre-Costing Engine (auto-calculates Quoted FOB from fabric consumption, CMT, trims, overheads and profit margin), and a Quotation Status Kanban Board (Draft → Sent to Buyer → Buyer Approved → Converted to PO).",
          descriptionBn: "গার্মেন্টস অর্ডার লাইফসাইকেলের প্রথম ধাপ যোগ করা হয়েছে: 'বায়ার ইনকোয়ারি এবং প্রি-কস্টিং কোটেশন' পেজ। এখন সাইডবারে 'অর্ডার ও কস্টিং' সেকশনে সঠিক ক্রমে তিনটি ধাপ দেখাচ্ছে: বায়ার ইনকোয়ারি → পিও রেজিস্টার → অর্ডার এন্ট্রি। নতুন পেজে আছে: ইনকোয়ারি রেজিস্টার (বায়ারের স্টাইল ইনকোয়ারি, একিউএল, পেমেন্ট টার্মস লগ), লাইভ প্রি-কস্টিং ইঞ্জিন (ফ্যাব্রিক কনসাম্পশন, সিএমটি, ট্রিমস, ওভারহেড থেকে এফওবি অটো-ক্যালকুলেট) এবং কোটেশন স্ট্যাটাস কানবান বোর্ড (ড্রাফট → বায়ারে পাঠানো → বায়ার অ্যাপ্রুভড → পিওতে রূপান্তর)।",
        },
        {
          id: "22",
          date: "2026-07-27T10:10",
          type: "Modify",
          module: "Company Setup",
          link: "/company-setup",
          descriptionEn: "Added all 15 missing parameters to the Company Basic Settings modal matching the enterprise standard layout! Included New Employee Approval, Authorization (L/E), Absent Deduct Based On, ML Count, ML Stamp, WithOut In Absent, Searching By, Holiday Tiffin, Holiday Night, Early Out, Early Out Based On, Salary Breakdown Round, Sandwich Holiday, Sandwich Employee Type, and Late Time Calculation.",
          descriptionBn: "কোম্পানি বেসিক সেটিংস মোডালে এন্টারপ্রাইজ স্ট্যান্ডার্ড লেআউট অনুযায়ী ১৫টি নতুন ফিল্ড যুক্ত করা হয়েছে! যার মধ্যে রয়েছে নিউ এমপ্লয়ি অ্যাপ্রুভাল, অথরাইজেশন (এল/ই), অ্যাবসেন্ট ডিডাক্ট বেসড অন, এমএল কাউন্ট, এমএল স্ট্যাম্প, উইদাউট ইন অ্যাবসেন্ট, সার্চিং বাই, হোলিডে টিফিন, হোলিডে নাইট, আর্লি আউট, আর্লি আউট বেসড অন, স্যালারি ব্রেকডাউন রাউন্ড, স্যান্ডউইচ হোলিডে, স্যান্ডউইচ এমপ্লয়ি টাইপ এবং লেট টাইম ক্যালকুলেশন।",
        },
        {
          id: "23",
          date: "2026-07-27T10:12",
          type: "Modify",
          module: "Company Setup",
          link: "/company-setup",
          descriptionEn: "Reorganized the Company Basic Settings modal with interactive category filter tabs (All Settings, Approvals & Governance, Attendance & Work, OT & Allowances, Leave & Holidays, Salary & Validation, ID & System Setup) and 6 structured 4-column responsive grid cards with clear red asterisks for required fields.",
          descriptionBn: "কোম্পানি বেসিক সেটিংস মোডালকে চমৎকার ইন্টারেক্টিভ ক্যাটাগরি ফিল্টার ট্যাব (অল সেটিংস, অ্যাপ্রুভালস, অ্যাটেনডেন্স, ওভারটাইম, লিভ ও হোলিডে, স্যালারি, আইডি ও সিস্টেম সেটিংস) এবং ৬টি সুন্দর ৪-কলাম রেসপন্সিভ গ্রিড কার্ডের মাধ্যমে সুবিন্যস্ত ও গোছানো হয়েছে।",
        },
        {
          id: "24",
          date: "2026-07-27T11:26",
          type: "New Addition",
          module: "Payroll",
          link: "/payroll-benefits-master-data",
          descriptionEn: "Built the complete Payroll Master Data (Master Information) page matching the enterprise standard screen! Features Master For category selection (Common Benefit Add/Deduct, Individual Benefit Add/Deduct, Bonus Type / Festival Master), inline entry form (Name, Comments, Status), table row editing via pencil icon, Excel/Print/PDF exports, status filters, live search, and dynamic record counters.",
          descriptionBn: "পে রোল মাস্টার ইনফরমেশন পেজটি সম্পূর্ণরূপে তৈরি করা হয়েছে! এতে রয়েছে মাস্টার ফর ক্যাটাগরি নির্বাচন (কমোন বেনিফিট অ্যাড/ডিডাক্ট, ইন্ডিভিজুয়াল বেনিফিট, বোনাস টাইপ/ফেস্টিভ্যাল মাস্টার), ইনলাইন এন্ট্রি ফর্ম (নেম, কমেন্টস, স্ট্যাটাস), পেন্সিল আইকন দিয়ে টেবিল রো এডিটিং, এক্সেল/প্রিন্ট/পিডিএফ এক্সপোর্ট, লাইভ সার্চ এবং পারসিস্টেন্ট ডাটা স্টোরেজ।",
        },
        {
          id: "25",
          date: "2026-07-27T11:45",
          type: "Modify",
          module: "Payroll",
          link: "/payroll-benefits-master-data",
          descriptionEn: "Completely redesigned the Payroll Master Data page for zero-scroll list efficiency! Replaced static top form with an instant List View first design, top horizontal category pills filter, status badges, one-click table row status toggling, and a prominent '+ Add Master Item' primary button that opens a sleek backdrop modal for adding and editing master options without pushing data down.",
          descriptionBn: "পে রোল মাস্টার ডাটা পেজটি জিরো-স্ক্রোল লিস্ট ফার্স্ট ডিজাইনে সম্পূর্ণ পুনর্গঠন করা হয়েছে! আগে ফর্মের কারণে স্ক্রোল করতে হতো, এখন পেজ লোডেই পুরো ডাটা টেবিল দৃশ্যমান। ক্যাটাগরি ফিল্টার পিলস, সরাসরি টেবিল রো থেকে এক-ক্লিকে স্ট্যাটাস পরিবর্তন এবং ডানে নতুন '+ Add Master Item' বাটন যোগ করা হয়েছে যা ক্লিকে পপআপ মোডালে এন্ট্রি ও এডিটের ব্যবস্থা রাখে।",
        },
        {
          id: "26",
          date: "2026-07-27T11:48",
          type: "Modify",
          module: "Payroll",
          link: "/payroll-benefits-master-data",
          descriptionEn: "Cleaned and refined the Master Information page to exact original specifications! Removed redundant top navigation pills and horizontal category scroll bars, restoring the ultra-clean enterprise Master Information layout with a 4-column entry form (Master For, Name, Comments, Status), table export controls (Excel, Print, PDF), pencil edit actions, and bottom SUBMIT button.",
          descriptionBn: "মাস্টার ইনফরমেশন পেজটি একদম নিখুঁত এবং রিয়াল-ওয়ার্ল্ড এন্টারপ্রাইজ লেআউটে রিফাইন করা হয়েছে! অপ্রয়োজনীয় নেভিগেশন পিলস এবং অতিরিক্ত ক্যাটাগরি স্ক্রোল বার বাদ দিয়ে ৪-কলাম এন্ট্রি ফর্ম (মাস্টার ফর, নেম, কমেন্টস, স্ট্যাটাস), টেবিল এক্সপোর্ট (এক্সেল, প্রিন্ট, পিডিএফ), পেন্সিল এডিট একশন এবং নিচের দিকে সাবমিট বাটন সহ পেজটি একদম ক্লিয়ার করা হয়েছে।",
        },
        {
          id: "27",
          date: "2026-07-27T11:49",
          type: "Modify",
          module: "Payroll",
          link: "/payroll-benefits-master-data",
          descriptionEn: "Elevated the Master Information page with stunning modern aesthetics and placed all 4 form fields (Master For *, Name *, Comments, Status *) inside an interactive '+ Add Master Item' modal popup! Features an indigo-purple gradient hero banner, real-time KPI stats (Total Items, Active, Inactive), category dropdown filter, search box, export options, and one-click status toggling.",
          descriptionBn: "পে রোল মাস্টার ইনফরমেশন পেজটি আধুনিক প্রিমিয়াম লুক ও ফিল দিয়ে সাজানো হয়েছে! ৪টি ফিল্ড (মাস্টার ফর, নেম, কমেন্টস, স্ট্যাটাস) নতুন '+ Add Master Item' পপআপ মোডালের ভেতর নিয়ে নেওয়া হয়েছে। পেজের ওপরে স্টানিং হিরো ব্যানার, রিয়েল-টাইম কেপিআই স্ট্যাটস, ক্যাটাগরি ড্রপডাউন এবং টেবিল এডিটিং যুক্ত করা হয়েছে।",
        },
        {
          id: "28",
          date: "2026-07-27T11:52",
          type: "Modify",
          module: "Payroll",
          link: "/payroll-benefits-master-data",
          descriptionEn: "Updated all primary action buttons on the Payroll Master Data page (including the main header button, footer button, and modal submit button) to use the project's standard primary brand color (bg-primary) for visual consistency.",
          descriptionBn: "পে রোল মাস্টার ডাটা পেজের সকল প্রাইমারি অ্যাকশন বাটন (প্রধান হেডার বাটন, ফুটার বাটন এবং মোডাল সাবমিট বাটন) প্রোজেক্টের স্ট্যান্ডার্ড ব্র্যান্ড কালার (bg-primary) এ পরিবর্তন করা হয়েছে যাতে ডিজাইনে সামঞ্জস্য থাকে।",
        },
        {
          id: "29",
          date: "2026-07-27T11:53",
          type: "Modify",
          module: "Payroll",
          link: "/payroll-benefits",
          descriptionEn: "Removed redundant 'Loan/Advance Req.' and 'Loan Reschedule Sys.' submenus under the Benefits section in both the main sidebar navigation and the Payroll Benefits overview dashboard page.",
          descriptionBn: "বেনিফিটস সেকশনের অধীনে থাকা অপ্রয়োজনীয় 'Loan/Advance Req.' এবং 'Loan Reschedule Sys.' সাবমেনু দুটি মেইন সাইডবার নেভিগেশন এবং পে রোল বেনিফিটস ওভারভিউ ড্যাশবোর্ড পেজ থেকে বাদ দেওয়া হয়েছে।",
        },
        {
          id: "30",
          date: "2026-07-28T14:55",
          type: "Modify",
          module: "Benefits",
          link: "/payroll-benefits-common",
          descriptionEn: "Redesigned the Common Benefits page into a highly user-friendly dual-view layout. Replaced the modal with a spacious full-screen Configure Workspace, featuring dynamic employee lists, default quick-fill amounts, individual overrides, and manual employee add/remove controls.",
          descriptionBn: "কমন বেনিফিটস পেজটিকে আরও ইউজার-ফ্রেন্ডলি করতে ডুয়াল-ভিউ লেআউটে রিডিজাইন করা হয়েছে। মোডালের পরিবর্তে ফুল-স্ক্রিন কনফিগারেশন ওয়ার্কস্পেস যুক্ত করা হয়েছে, যেখানে ডাইনামিক এমপ্লয়ি লিস্ট, ডিফল্ট কুইক-ফিল অ্যামাউন্ট, প্রতি এমপ্লয়ির জন্য কাস্টম অ্যামাউন্ট এবং ম্যানুয়ালি এমপ্লয়ি যুক্ত/বাদ দেওয়ার সুবিধা রয়েছে।",
        },
        {
          id: "31",
          date: "2026-07-28T15:56",
          type: "Modify",
          module: "Company Setup",
          link: "/company-setup",
          descriptionEn: "Added a new 'Half Leave' Yes/No setting dropdown to the Company Architecture & ID Setup configuration panel on the Company Setup page.",
          descriptionBn: "কোম্পানি সেটআপ পেজের কোম্পানি আর্কিটেকচার অ্যান্ড আইডি সেটআপ প্যানেলে একটি নতুন 'Half Leave' (Yes/No) সেটিং ড্রপডাউন যুক্ত করা হয়েছে।"
        },
        {
          id: "32",
          date: "2026-07-29T10:10",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-dashboard",
          descriptionEn: "Simplified the Merchandising module sidebar menu by removing all other links and keeping only the Dashboard and Order Entry & Costing workspace.",
          descriptionBn: "মার্চেন্ডাইজিং মডিউলের সাইডবার মেনু থেকে অন্যান্য সব লিংক বাদ দিয়ে শুধুমাত্র ড্যাশবোর্ড এবং অর্ডার এন্ট্রি ও কস্টিং ওয়ার্কস্পেস রেখে একে সহজ করা হয়েছে।",
        },
        {
          id: "33",
          date: "2026-07-29T10:12",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-master-settings",
          descriptionEn: "Added the new 'MERC Master Setting' accordion sidebar menu containing 34 custom submenus, correctly mapped to default RMG database tabs.",
          descriptionBn: "৩৪টি সাব-মেনু বিশিষ্ট নতুন 'MERC Master Setting' সাইডবার একর্ডিয়ন মেনু যুক্ত করা হয়েছে এবং সেগুলোকে যথোপযুক্ত RMG ডেটাবেস ট্যাবের সাথে সংযুক্ত করা হয়েছে।",
        },
        {
          id: "34",
          date: "2026-07-29T10:15",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-master-settings",
          descriptionEn: "Refactored the MERC Master Settings to use a clean split layout. The sidebar menu now has a single direct link, and the settings page groups all 34 sub-settings into interactive sub-tabs nested within the 5 main database categories. Also built a fully functional generic CRUD Master DB manager.",
          descriptionBn: "MERC মাস্টার সেটিংস পেজটিকে চমৎকার স্প্লিট লেআউটে রূপান্তর করা হয়েছে। সাইডবারে এখন একটি সরাসরি লিংক রয়েছে এবং পেজের ভেতরে ৩৪টি প্যারামিটারকে ৫টি মূল ক্যাটাগরির ভেতরে সাব-ট্যাব আকারে সাজানো হয়েছে। এছাড়া একটি ফুল-ফাংশনাল জেনেরিক CRUD মাস্টার ডাটাবেস ম্যানেজার তৈরি করা হয়েছে।",
        },
        {
          id: "35",
          date: "2026-07-29T10:23",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-master-settings",
          descriptionEn: "Reorganized the Merchandising Settings hierarchy to match the requested 8-category taxonomy (Company Configuration, Business Partners, Product Masters, Fabric Masters, Yarn Masters, Color & Processing, Costing, and Quality). Renamed the sidebar settings menu to 'Merchandising Settings'.",
          descriptionBn: "মার্চেন্ডাইজিং সেটিংসের স্তরবিন্যাস পরিবর্তন করে অনুরোধকৃত ৮টি ক্যাটাগরিতে (কোম্পানি কনফিগারেশন, বিজনেস পার্টনার, প্রোডাক্ট মাস্টার্স, ফেব্রিক মাস্টার্স, ইয়ার্ন মাস্টার্স, কালার ও প্রসেসিং, কস্টিং, এবং কোয়ালিটি) সাজানো হয়েছে। সাইডবারের মেনুর নাম পরিবর্তন করে 'Merchandising Settings' রাখা হয়েছে।",
        },
        {
          id: "36",
          date: "2026-07-29T10:25",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-master-settings",
          descriptionEn: "Implemented a fully nested three-level accordion layout in the Merchandising Settings sidebar. Clicking 'Merchandising Settings' now reveals the 8 sub-categories, and clicking each sub-category reveals its corresponding parameter configuration links.",
          descriptionBn: "মার্চেন্ডাইজিং সেটিংসের সাইডবারে একটি সম্পূর্ণ ত্রিমাত্রিক একর্ডিয়ন লেআউট তৈরি করা হয়েছে। 'Merchandising Settings' এ ক্লিক করলে ৮টি সাব-ক্যাটাগরি দৃশ্যমান হয়, এবং প্রতিটি সাব-ক্যাটাগরিতে ক্লিক করলে তার অন্তর্ভুক্ত প্যারামিটার কনফিগারেশন লিংকগুলো দেখা যায়।",
        },
        {
          id: "37",
          date: "2026-07-29T11:20",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-master-settings",
          descriptionEn: "Fixed the sidebar scrolling behavior by removing nested max-height restrictions and duplicate scrollbars from the nested subGroup accordion containers, allowing the entire sidebar pane to scroll naturally.",
          descriptionBn: "সাইডবার স্ক্রোলিং সমস্যা সমাধান করা হয়েছে। সাব-গ্রুপ একর্ডিয়ন কন্টেইনার থেকে অতিরিক্ত ম্যাক্স-হাইট এবং ডুপ্লিকেট স্ক্রোলবার সরিয়ে ফেলা হয়েছে, যার ফলে সম্পূর্ণ সাইডবারটি এখন স্বাচ্ছন্দ্যে স্ক্রোল করা যায়।",
        },
        {
          id: "38",
          date: "2026-07-29T11:25",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-master-settings",
          descriptionEn: "Fixed text alignment issues on the accordion header buttons by adding the 'text-left' class, ensuring wrapped texts are properly left-aligned.",
          descriptionBn: "একর্ডিয়ন হেডার বাটনগুলোর টেক্সট অ্যালাইনমেন্ট ফিক্স করা হয়েছে। 'text-left' ক্লাস যোগ করার মাধ্যমে নিশ্চিত করা হয়েছে যে র‍্যাপ হওয়া লেখাগুলো বাঁ দিকে সমানভাবে বিন্যস্ত থাকবে।",
        },
        {
          id: "39",
          date: "2026-07-30T10:59",
          type: "New Addition",
          module: "Personnel File",
          link: "/add-employee",
          descriptionEn: "Added a new 'Allowance' card to the personnel file creation page and updated the employee detail view to show these overtime, holiday rate, behavior bonus, and transport/mobile/lunch allowances dynamically.",
          descriptionBn: "পার্সোনেল ফাইল ক্রিয়েশন পেজে একটি নতুন 'Allowance' কার্ড যুক্ত করা হয়েছে এবং এমপ্লয়ি ডিটেইলস ভিউতে ওভারটাইম, হোলিডে রেট, বিহেভিয়ার বোনাস এবং ট্রান্সপোর্ট/মোবাইল/লাঞ্চ অ্যালাউন্সগুলো ডাইনামিকলি দেখানোর ব্যবস্থা করা হয়েছে।",
        },
        {
          id: "40",
          date: "2026-07-30T11:05",
          type: "Modify",
          module: "Personnel File",
          link: "/add-employee",
          descriptionEn: "Simplified the Disbursement Routing & Bank Details card to show only Bank Pay, Cash Pay, Bank Name, and Account Number in both employee creation and employee detail views.",
          descriptionBn: "এমপ্লয়ি ক্রিয়েশন এবং এমপ্লয়ি ডিটেইলস উভয় পেজেই ব্যাংক ডিটেইলস কার্ডটি সহজ করা হয়েছে যাতে শুধুমাত্র ব্যাংক পে, ক্যাশ পে, ব্যাংকের নাম এবং অ্যাকাউন্ট নম্বর দেখা যায়।",
        },
        {
          id: "41",
          date: "2026-07-30T11:10",
          type: "Modify",
          module: "Personnel File",
          link: "/add-employee",
          descriptionEn: "Shifted Corporate Job Description & Charter and Corporate Equipment & Asset Assignment sections from Financial & Employment to Qualifications & Experience tab on both employee creation and details screens. Removed the Submit button from the custom Allowance card.",
          descriptionBn: "এমপ্লয়ি ক্রিয়েশন এবং ডিটেইলস উভয় পেজেই করপোরেট জব ডেসক্রিপশন এবং করপোরেট ইকুইপমেন্ট সেকশন দুটিকে ফিন্যান্সিয়াল অ্যান্ড এমপ্লয়মেন্ট ট্যাব থেকে কোয়ালিফিকেশন অ্যান্ড এক্সপেরিয়েন্স ট্যাবে স্থানান্তরিত করা হয়েছে। কাস্টম অ্যালাউন্স কার্ড থেকে সাবমিট বাটনটি সরিয়ে ফেলা হয়েছে।",
        },
        {
          id: "42",
          date: "2026-07-30T11:15",
          type: "Modify",
          module: "Personnel File",
          link: "/add-employee",
          descriptionEn: "Implemented robust file uploading, size validation (5MB max), extension validation (.pdf, .jpg, .jpeg, .png), upload progress indicators, and an interactive secure document preview modal for academic and experience attachments.",
          descriptionBn: "একাডেমিক এবং অভিজ্ঞতা সনদের অ্যাটাচমেন্টের জন্য শক্তিশালী ফাইল আপলোডিং, ফাইলের সাইজ ভ্যালিডেশন (সর্বোচ্চ ৫ মেগাবাইট), ফাইল এক্সটেনশন ভ্যালিডেশন (.pdf, .jpg, .jpeg, .png), আপলোড প্রোগ্রেস বার এবং একটি ইন্টারেক্টিভ সিকিউর ডকুমেন্ট প্রিভিউ মোডাল তৈরি করা হয়েছে।",
        },
        {
          id: "43",
          date: "2026-07-30T12:00",
          type: "Modify",
          module: "Personnel File",
          link: "/add-employee",
          descriptionEn: "Added a smart missing attachment warning modal on form submit. It detects which academic degrees and work experience entries are filled in but missing a supporting document, lists them by name, and lets the user go back to attach files or proceed anyway.",
          descriptionBn: "ফর্ম সাবমিটের সময় একটি স্মার্ট মিসিং অ্যাটাচমেন্ট ওয়ার্নিং মোডাল যুক্ত করা হয়েছে। এটি স্বয়ংক্রিয়ভাবে শনাক্ত করে কোন একাডেমিক ডিগ্রি বা কর্মঅভিজ্ঞতার এন্ট্রিতে ডকুমেন্ট আপলোড করা হয়নি, সেগুলোর নাম দিয়ে একটি তালিকা দেখায়, এবং ব্যবহারকারীকে ফিরে গিয়ে ডকুমেন্ট যোগ করার বা এড়িয়ে সাবমিট করার সুযোগ দেয়।",
        },
        {
          id: "44",
          date: "2026-07-30T12:12",
          type: "Modify",
          module: "Personnel File",
          link: "/add-employee",
          descriptionEn: "Implemented the dynamic pre-upload attachment ID generation and saved qualification/experience details with attachment tokens in localStorage during employee creation.",
          descriptionBn: "এমপ্লয়ি ক্রিয়েশন ফর্মে ডাইনামিক প্রি-আপলোড অ্যাটাচমেন্ট আইডি জেনারেশন ইমপ্লিমেন্ট করা হয়েছে এবং লোকাল স্টোরেজে কোয়ালিফিকেশন ও এক্সপেরিয়েন্স ডেটা অ্যাটাচমেন্ট টোকেনসহ সংরক্ষণ করার ব্যবস্থা করা হয়েছে।",
        },
        {
          id: "45",
          date: "2026-07-30T14:18",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-dashboard",
          descriptionEn: "Restructured the Merchandising module sidebar menu to align with the core RMG workflow: Inquiry, Quotation, PO Management, Pre Costing, Order Management (with sub-menus), Yarn Booking, and Fabric Booking, with the Merchandising Settings category moved to the top.",
          descriptionBn: "মার্চেন্ডাইজিং মডিউলের সাইডবার মেনু আরএমজি ওয়ার্কফ্লো অনুযায়ী সাজানো হয়েছে (Inquiry, Quotation, PO Management, Pre Costing, Order Management sub-menus, Yarn Booking এবং Fabric Booking) এবং 'Merchandising Settings' মেনুটিকে সবার উপরে নিয়ে যাওয়া হয়েছে।",
        },
        {
          id: "46",
          date: "2026-07-30T14:24",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-dashboard",
          descriptionEn: "Added 'Capacity' section with sub-menus (Monthly Capacity, Capacity Allocation, Capacity Distribution, Sales Target Entry) right after the Dashboard category in the Merchandising module sidebar.",
          descriptionBn: "মার্চেন্ডাইজিং সাইডবারে Dashboard-এর পর নতুন 'Capacity' মেনু এবং তার সাব-মেনুসমূহ (Monthly Capacity, Capacity Allocation, Capacity Distribution, Sales Target Entry) যুক্ত করা হয়েছে।",
        },
        {
          id: "47",
          date: "2026-07-30T14:30",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-capacity-planning",
          descriptionEn: "Implemented the fully interactive Capacity Allocation module, including a spreadsheet-style Master Ledger view with filters/searches/exports, and an inline day-by-day calculation form for month-wise line capacity allocation.",
          descriptionBn: "মার্চেন্ডাইজিং ক্যাড ক্যাপাসিটি প্ল্যানিং মডিউলে একটি সম্পূর্ণ ইন্টারঅ্যাক্টিভ 'Capacity Allocation' ফিচার যোগ করা হয়েছে। এর মধ্যে ফিল্টার/সার্চ/এক্সপোর্ট সহ স্প্রেডশিট-স্টাইলের মাস্টার লেজার ভিউ এবং দিনভিত্তিক ক্যাপাসিটি হিসাবের জন্য ফর্ম ওয়ার্কস্পেস অন্তর্ভুক্ত রয়েছে।",
        },
        {
          id: "48",
          date: "2026-07-30T14:46",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-capacity-planning",
          descriptionEn: "Implemented the 'Monthly Capacity' configuration panel inside the capacity planning module. Added Status, Year, and Month filters, spreadsheet export capabilities, and loaded realistic month-wise line machine/SMV capacity calculation entries as seed data.",
          descriptionBn: "ক্যাপাসিটি প্ল্যানিং মডিউলের অধীনে 'Monthly Capacity' প্যানেল ইমপ্লিমেন্ট করা হয়েছে। এর মধ্যে স্ট্যাটাস, বছর, এবং মাস ফিল্টার, স্প্রেডশিট এক্সপোর্ট এবং বিভিন্ন মাসের মেশিন/এসএমভি ক্যাপাসিটি ক্যালকুলেশন সংক্রান্ত ডেমো ডেটা যুক্ত করা হয়েছে।",
        },
        {
          id: "49",
          date: "2026-07-30T14:48",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-capacity-planning",
          descriptionEn: "Implemented the 'Capacity Distribution' workspace and list ledger in the capacity planning module. Features auto-lookup of month-wise capacities, multi-buyer selection (Zara, Mango, Fatface, etc.), allocation ratio validation, and real-time distribution summaries.",
          descriptionBn: "ক্যাপাসিটি প্ল্যানিং মডিউলে 'Capacity Distribution' পেজ ও লেজার তৈরি করা হয়েছে। এর মাধ্যমে মাসভিত্তিক মোট ক্যাপাসিটি রিয়েল-টাইমে সার্চ করা, নির্দিষ্ট বায়ারদের (যেমন: Zara, Mango, Fatface ইত্যাদি) মধ্যে শতাংশ ভাগ করে দেওয়া এবং রিয়েল-টাইমে মোট বণ্টনের যোগফল হিসাবের ব্যবস্থা করা হয়েছে।",
        },
        {
          id: "50",
          date: "2026-07-30T14:55",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-monthly-capacity",
          descriptionEn: "Refactored the capacity planning module from a single tabbed route to four separate, independent URLs/pages: /merchandising-monthly-capacity, /merchandising-capacity-allocation, /merchandising-capacity-distribution, and /merchandising-sales-target-entry. Updated the merchandising sidebar layout and navigation routes accordingly.",
          descriptionBn: "ক্যাপাসিটি প্ল্যানিং মডিউলকে একটি মাত্র ট্যাবড ইউআরএল থেকে পরিবর্তন করে ৪টি আলাদা ইউআরএল ও পেজে বিভক্ত করা হয়েছে: /merchandising-monthly-capacity, /merchandising-capacity-allocation, /merchandising-capacity-distribution এবং /merchandising-sales-target-entry। সেই সাথে মার্চেন্ডাইজিং সাইডবার লেআউট ও নেভিগেশন লিংকসমূহ আপডেট করা হয়েছে।",
        },
        {
          id: "51",
          date: "2026-07-30T14:58",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-capacity-distribution",
          descriptionEn: "Refactored the Capacity Distribution list layout and edit controls to match the user's reference columns: SL, edit pencil, Company Name, Location, Year, Month, Total Capacity (Min), and Total Capacity (Pcs). Also refactored the creation/editing view to open in a wide modal overlay with a dual-panel layout.",
          descriptionBn: "ইউজারের দেয়া স্ক্রিনশট অনুযায়ী ক্যাপাসিটি ডিস্ট্রিবিউশন টেবিলের কলামসমূহ এবং এডিট পেন্সিল পজিশন বিন্যস্ত করা হয়েছে। এছাড়া এলোকেশন পেজের মতো ডিস্ট্রিবিউশন তৈরি ও এডিট করার ফর্মটিকেও ব্যাকড্রপ-ব্লারড মোডালে রুপান্তর করা হয়েছে।",
        },
        {
          id: "52",
          date: "2026-07-30T15:00",
          type: "Modify",
          module: "Merchandising",
          link: "/merchandising-sales-target-entry",
          descriptionEn: "Refactored the Sales Target Entry page. List view now features columns: SL, edit pencil, Year, and Buyer Name. Added a backdrop-blurred wide modal for creating/editing targets with top controls: Year, Buyer, and GET MONTH button, along with a bottom-scrollable 12-month details grid showing: SL, Month, Quantity (Pcs), Amount (USD), Minute, Margin (USD), CM, RM, Avg SMV, Avg Eff, Mgt Notes, and a blue Team ACTION button.",
          descriptionBn: "সেলস টার্গেট এন্ট্রি পেজটি রিফ্যাক্টর করা হয়েছে। লিস্ট ভিউ টেবিলে SL, এডিট পেন্সিল, বছর এবং বায়ার নামের কলাম রয়েছে। এছাড়া টার্গেট তৈরি ও এডিট করার জন্য ব্যাকড্রপ-ব্লারড মোডাল যুক্ত করা হয়েছে যেখানে বছর, বায়ার এবং GET MONTH বাটনের সাহায্যে ১২ মাসের ছক জেনারেট করা ও কলামসমূহের মোট যোগফল রিয়েল-টাইমে ক্যালকুলেট করার ব্যবস্থা রয়েছে।",
        },
      ]);
    }
  }, []);



  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      {/* Header toolbar */}
      <div className="h-14 border-b border-slate-300 bg-[#f3f4f6] flex items-center justify-between px-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/module-selection" className="p-1.5 rounded hover:bg-slate-300 text-slate-600 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2 text-[#107c41] font-semibold text-lg">
            <FileSpreadsheet size={24} />
            System Changes Tracker
          </div>
        </div>

      </div>

      {/* Excel Formula Bar Fake */}
      <div className="h-8 border-b border-slate-300 bg-white flex items-center px-4 shrink-0 text-sm">
        <div className="w-10 text-slate-400 font-mono flex items-center justify-center border-r border-slate-300 h-full bg-slate-100 italic">
          fx
        </div>
        <div className="flex-1 px-3 text-slate-500 font-mono overflow-hidden whitespace-nowrap">
          {records.length} total changes tracked
        </div>
      </div>

      {/* Spreadsheet Container */}
      <div className="flex-1 overflow-auto bg-slate-50 relative">
        <table className="w-full border-collapse bg-white table-fixed min-w-[1400px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#f3f4f6] text-slate-600 text-[11px] text-center border-b border-slate-300 font-normal">
              <th className="w-10 border-r border-slate-300 bg-slate-200"></th>
              <th className="w-44 border-r border-slate-300 py-1.5 font-semibold text-slate-700">A (Date & Time)</th>
              <th className="w-48 border-r border-slate-300 py-1.5 font-semibold text-slate-700">B (Type)</th>
              <th className="w-64 border-r border-slate-300 py-1.5 font-semibold text-slate-700">C (Module/Area)</th>
              <th className="w-[450px] border-r border-slate-300 py-1.5 font-semibold text-left pl-3 text-slate-700">D (English)</th>
              <th className="w-[450px] border-r border-slate-300 py-1.5 font-semibold text-left pl-3 text-slate-700">E (Bangla)</th>
            </tr>
          </thead>
          <tbody>
            {records.map((row, idx) => (
              <tr key={row.id} className="text-[11px] group hover:bg-[#e5f1eb] transition-colors">
                <td className="border-b border-r border-slate-300 bg-slate-100 text-center text-xs text-slate-500 py-1 sticky left-0 z-10 w-10 select-none">
                  {idx + 1}
                </td>
                <td className="border-b border-r border-slate-300 p-0 align-top">
                  <input
                    type="datetime-local"
                    value={row.date}
                    readOnly
                    className="w-full h-full min-h-[48px] px-2 py-2 outline-none bg-transparent text-slate-800 text-[11px]"
                  />
                </td>
                <td className="border-b border-r border-slate-300 p-0 align-top">
                  <select
                    value={row.type}
                    disabled
                    className="w-full h-full min-h-[48px] px-2 py-2 outline-none bg-transparent text-slate-800 appearance-none text-[11px]"
                  >
                    <option value="">Select Type...</option>
                    <option value="New Addition">New Addition</option>
                    <option value="Modify">Modify</option>
                  </select>
                </td>
                <td className="border-b border-r border-slate-300 p-0 group relative align-top">
                  <div className="flex items-start w-full h-full min-h-[48px]">
                    <input
                      type="text"
                      value={row.module}
                      placeholder="e.g. Dashboard"
                      readOnly
                      className="flex-1 min-w-0 h-full px-2 py-2 outline-none bg-transparent text-slate-800 placeholder:text-slate-300 text-[11px]"
                    />
                    {row.link && (
                      <Link
                        to={row.link as any}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 mt-1 mr-1 text-[#107c41] hover:bg-[#107c41]/10 rounded flex items-center justify-center shrink-0"
                        title={`Open ${row.module}`}
                      >
                        <ExternalLink className="size-3.5" />
                      </Link>
                    )}
                  </div>
                </td>
                <td className="border-b border-r border-slate-300 p-0 align-top">
                  <textarea
                    rows={3}
                    value={row.descriptionEn}
                    placeholder="Enter change details..."
                    readOnly
                    className="w-full h-full px-3 py-2 outline-none bg-transparent text-slate-800 placeholder:text-slate-300 text-[11px] resize-none overflow-y-auto"
                  />
                </td>
                <td className="border-b border-r border-slate-300 p-0 align-top">
                  <textarea
                    rows={3}
                    value={row.descriptionBn}
                    placeholder="বাংলায় বিবরণ লিখুন..."
                    readOnly
                    className="w-full h-full px-3 py-2 outline-none bg-transparent text-slate-800 placeholder:text-slate-300 text-[11px] resize-none overflow-y-auto"
                  />
                </td>
              </tr>
            ))}
            {/* Empty filler rows to look like Excel */}
            {Array.from({ length: Math.max(0, 30 - records.length) }).map((_, i) => (
              <tr key={`empty-${i}`} className="text-[13px] h-[28px]">
                <td className="border-b border-r border-slate-300 bg-slate-100 text-center text-xs text-slate-400 py-1 sticky left-0 z-10 w-10 select-none">
                  {records.length + i + 1}
                </td>
                <td className="border-b border-r border-slate-300"></td>
                <td className="border-b border-r border-slate-300"></td>
                <td className="border-b border-r border-slate-300"></td>
                <td className="border-b border-r border-slate-300"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
