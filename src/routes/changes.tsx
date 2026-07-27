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
    const saved = localStorage.getItem("system_changes_v24");
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
