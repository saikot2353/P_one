import type { ChangeRecord } from "./changes";

export const DEFAULT_CHANGE_RECORDS: ChangeRecord[] = [
  {
    "id": "573",
    "date": "2026-10-11T13:45",
    "type": "UI Refinement",
    "module": "Approvals - Sync Requisition",
    "link": "/sync-requisition",
    "descriptionEn": "Compacted the layout of the Sync Requisition page, constraining the requisition input field to a balanced width, reducing padding, and making the controls and workflow layer cards clean and compact.",
    "descriptionBn": "Sync Requisition পেজটির ডিজাইন কমপ্যাক্ট করা হয়েছে, যাতে রিকুইজিশন ইনপুট ফিল্ডটি অতিরিক্ত বড় না দেখায় এবং সম্পূর্ণ ইন্টারফেস পরিচ্ছন্ন ও সংকুচিত থাকে।"
  },
  {
    "id": "572",
    "date": "2026-10-11T13:35",
    "type": "UI Refinement",
    "module": "Approvals - Sync Requisition",
    "link": "/sync-requisition",
    "descriptionEn": "Streamlined the Sync Requisition page by removing the lower detailed data table while retaining the clean visual stepper cards for workflow layers.",
    "descriptionBn": "Sync Requisition পেজটি পরিচ্ছন্ন করতে নিচের বিস্তারিত ডেটা টেবিলটি সরিয়ে দেওয়া হয়েছে এবং উপরের ভিজ্যুয়াল স্টেপার কার্ডগুলো বহাল রাখা হয়েছে।"
  },
  {
    "id": "571",
    "date": "2026-10-11T13:30",
    "type": "New Addition",
    "module": "Approvals - Sync Requisition",
    "link": "/sync-requisition",
    "descriptionEn": "Added new 'Sync Requisition' (/sync-requisition) submenu under Approvals with requisition number lookup, interactive sync confirmation, and live display of dynamic workflow layers the requisition goes through.",
    "descriptionBn": "Approvals মেনুর অধীনে নতুন 'Sync Requisition' (/sync-requisition) সাবমেনু ও পেজ যুক্ত করা হয়েছে, যেখানে রিকুইজিশন নম্বর দিয়ে Sync ও Confirm করার পর রিকুইজিশনটি বর্তমানে কোন কোন ওয়ার্কফ্লো লেয়ার অতিক্রম করছে তা সরাসরি দেখা যাবে।"
  },
  {
    "id": "570",
    "date": "2026-10-11T13:05",
    "type": "New Addition",
    "module": "Approvals - Work Flow",
    "link": "/work-flows",
    "descriptionEn": "Added new 'Work Flow' (/work-flows) submenu under Approvals with complete approval workflows dashboard, multi-layer approval flow configuration modal, user assigner, and layer manager matching user design.",
    "descriptionBn": "Approvals মেনুর অধীনে নতুন 'Work Flow' (/work-flows) সাবমেনু ও পেজ তৈরি করা হয়েছে, যেখান থেকে বিভিন্ন ধরনের ওয়ার্কফ্লো তৈরি, মাল্টি-লেয়ার অনুমোদন চেইন কনফিগারেশন, লেয়ারে ইউজার যুক্ত ও অনুমোদন পরিচালনা করা যাবে।"
  },
  {
    "id": "557",
    "date": "2026-10-12T14:00",
    "type": "Inventory Management Dashboard Complete Chart-Driven Redesign",
    "module": "Inventory Management / Dashboard & Analytics",
    "link": "/inv-dashboard",
    "descriptionEn": "Completely redesigned the Inventory Management Dashboard with an executive chart-driven architecture, replacing legacy tables, repetitive cards, and alerts: (1) Global Filters: Compact toolbar with Company, Warehouse/Store, Item Group, Item Category, and From/To Date range, dynamically updating all cards and charts; (2) Four Core KPI Cards: Total Stock Value (with Weighted Average valuation method & currency formatting), Total Stock Quantity (with intelligent multi-UOM breakdown preventing incompatible unit summation), Low/Critical Stock Items (with Critical vs Low counts), and In-Transit Transfers (with en-route consignments); (3) Stock Movement Trend: Responsive multi-line chart tracking monthly Stock In, Stock Out, Transfer In, and Transfer Out with tooltips and register drilldowns; (4) Stock Health Distribution: Donut chart displaying mutually exclusive Healthy, Low, Critical, and Out-of-Stock SKUs with center counter and register drilldowns; (5) Stock Value by Store: Horizontal bar chart comparing warehouse valuations sorted descending by capital invested; (6) Top 10 Items by Stock Value: Horizontal bar chart highlighting highest-value SKUs with current stock and unit valuation; (7) Inventory Transaction Distribution: Donut chart showing transaction volume shares across Material Receipts, Issues, Transfers, Adjustments, Write-Offs, and Returns; (8) Inventory Risk Analysis: Stacked bar chart with interactive 'By Store' vs 'By Item Group' toggle comparing critical shortage, out-of-stock, and expiry risks; (9) Register Integration: Connected all KPI cards and chart segments with direct drill-downs to their respective registers while preserving filter context.",
    "descriptionBn": "ইনভেনটরি ম্যানেজমেন্ট ড্যাশবোর্ড সম্পূর্ণ আধুনিক ও চার্ট-ভিত্তিক ডিজাইনে নতুনভাবে তৈরি করা হয়েছে, যাতে আগের অপ্রয়োজনীয় বড় টেবিল, ডুপ্লিকেট কার্ড ও অ্যালার্ট সেকশন বাদ দেওয়া হয়েছে: (১) গ্লোবাল ফিল্টার: কোম্পানি, ওয়্যারহাউস/স্টোর, আইটেম গ্রুপ, আইটেম ক্যাটাগরি ও তারিখ ফিল্টার যা তাৎক্ষণিকভাবে সকল চার্ট ও কেপিআই আপডেট করে; (২) চারটি মূল কেপিআই কার্ড: মোট স্টক ভ্যালুয়েশন (ওয়েটেড অ্যাভারেজ মেথড ও কনফিগার করা কারেন্সি ফরম্যাটসহ), মোট স্টক কোয়ান্টিটি (ভিন্ন ভিন্ন UOM-এর সঠিক হিসাব ও ব্রেকডাউনসহ), লো ও ক্রিটিক্যাল স্টক আইটেম সংখ্যা এবং ট্রানজিটে থাকা ট্রান্সফার তালিকা; (৩) স্টক মুভমেন্ট ট্রেন্ড: ১২ মাসের স্টক ইন, স্টক আউট, ট্রান্সফার ইন ও আউট ট্র্যাকিংয়ের মাল্টি-লাইন চার্ট এবং ড্রিল-ডাউন সুবিধা; (৪) স্টক হেলথ ডিস্ট্রিবিউশন: হেলদি, লো, ক্রিটিক্যাল ও আউট-অব-স্টক আইটেম অনুপাতের ডোনাট চার্ট ও রেজিস্টার লিঙ্ক; (৫) স্টক ভ্যালু বাই স্টোর: ওয়্যারহাউস বা স্টোরভিত্তিক মোট স্টক ভ্যালুর অনুভূমিক বার চার্ট; (৬) টপ ১০ আইটেম বাই ভ্যালু: সর্বোচ্চ মূল্যের ১০টি আইটেমের অনুভূমিক বার চার্ট ও আইটেম রেজিস্টার ড্রিল-ডাউন; (৭) ট্রানজ্যাকশন ডিস্ট্রিবিউশন: ম্যাটেরিয়াল রিসিট, ইস্যু, ট্রান্সফার, অ্যাডজাস্টমেন্ট, রাইট-অফ ও স্টোর রিটার্নের ডোনাট চার্ট; (৮) ইনভেনটরি রিস্ক অ্যানালাইসিস: স্টোর ও আইটেম গ্রুপ টগলসহ স্টক ঘাটতি, স্টক-আউট ও মেয়াদোত্তীর্ণ ঝুঁকির স্ট্যাকড বার চার্ট; (৯) রেজিস্টার কানেক্টিভিটি: সকল কেপিআই ও চার্টের সেগমেন্টে ক্লিক করে ফিল্টারসহ সরাসরি সংশ্লিষ্ট রিপোর্ট ও রেজিস্টারে যাওয়ার পূর্ণ সুবিধা নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "556",
    "date": "2026-10-12T10:45",
    "type": "Procurement Master Data Business Type & Item Group Hierarchy Integration into Item Creation",
    "module": "Procurement & Inventory Management / Master Data & Configuration",
    "link": "/procurement-master-data",
    "descriptionEn": "Completed key Master Data and Catalog architecture enhancements: (1) Business Type Master Data: Implemented a dedicated Business Type form under Procurement Master Data (/procurement-master-data) with Type Code, Business Type Name, Description, and Status fields. Saved records are dynamically listed in the Business Type table and seamlessly populate the Business Type dropdown in the Supplier/Vendor Setup form in real-time; (2) Item Group Hierarchy Integration into Item Creation: Integrated the Item Group configuration directly into the Item Creation form (/procurement-master-data and /inventory-configuration). Users can create root Item Groups, add multi-tier sub-groups, and create items under any group or sub-group from a unified hierarchical tree explorer. Newly created groups and sub-groups immediately reflect across the tree hierarchy while fully preserving parent-group, sub-group, and item relationships; (3) Navigation Clean-Up: Removed the standalone Item Group menu from Procurement and Inventory navigation bars, ensuring all Item Group management is centralized within the Item Creation interface.",
    "descriptionBn": "প্রকিউরমেন্ট মাস্টার ডাটা এবং আইটেম ক্যাটালগ আর্কিটেকচারে গুরুত্বপূর্ণ উন্নয়ন সম্পন্ন করা হয়েছে: (১) Business Type মাস্টার ডাটা: প্রকিউরমেন্ট মাস্টার ডাটাতে (/procurement-master-data) নতুন বিজনেস টাইপ ফর্ম যুক্ত করা হয়েছে যাতে টাইপ কোড, বিজনেস টাইপ নেম, বিবরণ ও স্ট্যাটাস ফিল্ড রয়েছে। সেভ করা বিজনেস টাইপগুলো সরাসরি তালিকায় দেখা যায় এবং সাপ্লায়ার/ভেন্ডর সেটআপ ফর্মের Business Type ড্রপডাউনে তাৎক্ষণিকভাবে রিয়েল-টাইমে প্রদর্শিত হয়; (২) Item Creation ফর্মে Item Group ইন্টিগ্রেশন: আলাদা পেজের পরিবর্তে Item Creation ফর্মের ভেতরেই সম্পূর্ণ আইটেম গ্রুপ ও সাব-গ্রুপ হায়ারার্কি যুক্ত করা হয়েছে। ব্যবহারকারীরা সরাসরি এখান থেকেই মূল আইটেম গ্রুপ তৈরি, সাব-গ্রুপ যোগ এবং নির্দিষ্ট গ্রুপের অধীনে নতুন আইটেম তৈরি করতে পারেন। নতুন তৈরি করা গ্রুপ বা সাব-গ্রুপ তাৎক্ষণিকভাবে হায়ারার্কি ট্রিতে আপডেট হয় এবং তাদের মধ্যকার প্যারেন্ট-চাইল্ড সম্পর্ক পুরোপুরি অক্ষুণ্ণ থাকে; (৩) মেনু আপডেট: প্রকিউরমেন্ট ও ইনভেনটরি নেভিগেশন বার থেকে আলাদা 'Item Group' মেনু সরিয়ে নেওয়া হয়েছে এবং সমস্ত আইটেম গ্রুপ ব্যবস্থাপনা Item Creation-এর অধীনে কেন্দ্রীভূত করা হয়েছে।"
  },
  {
    "id": "553",
    "date": "2026-10-11T13:00",
    "type": "New Feature & Rule Engine Enhancements",
    "module": "Payroll / Deduction Rules & Canteen Engine",
    "link": "/payroll-deductions",
    "descriptionEn": "Implemented comprehensive smart solution for Lunch & Canteen Deductions (/payroll-deductions) addressing 3 enterprise edge cases: (1) Case 1 (Prepaid New Joiner Catch-up): Added Prepaid billing mode where new joiners cannot be charged in advance; in their 1st month salary, the engine automatically charges current month arrear (full ৳1,000 if joined ≤10th or prorated ৳500 if joined >10th) + next month advance (৳1,000), totaling ৳2,000 (≤10th) or ৳1,500 (>10th), reverting to standard ৳1,000 from month 2 onwards; (2) Case 2 (Ramadan Religion Exemption): Introduced religion exemption chips during Ramadan—fasting Muslim employees are automatically exempted (৳0) while non-Muslim staff (Hindu/Christian) continue regular canteen dining and billing (৳1,000); (3) Case 3 (High-volume Opt-out / 60% Plant No-Lunch Support): Implemented Opt-in Roster model with 1-click Canteen Roster & Excel/CSV bulk sync modal, live plant stats, fast 40% enrollment preset, and automated zeroing for non-consumers without manual payroll adjustments.",
    "descriptionBn": "লাঞ্চ ও ক্যান্টিন কর্তন ব্যবস্থার (/payroll-deductions) ৩টি জটিল সমস্যার স্মার্ট সমাধান বাস্তবায়ন করা হয়েছে: (১) কেস ১ (প্রিপেইড নতুন জয়েনিং ক্যাচ-আপ): প্রিপেইড মোডে নতুন জয়েনিং কর্মীদের ক্ষেত্রে ১ম মাসের বেতনে চলতি মাসের বকেয়া (১০ তারিখের মধ্যে জয়েন করলে পুরো ১০০০ টাকা বা ১০ তারিখের পরে জয়েন করলে প্রোরেটেড ৫০০ টাকা) এবং পরবর্তী মাসের অগ্রিম ১০০০ টাকা সহ মোট ২০০০ টাকা (≤১০ তারিখ) বা ১৫০০ টাকা (>১০ তারিখ) একসাথে চার্জ হবে এবং ২য় মাস থেকে নিয়মিত ১০০০ টাকা কর্তন হবে; (২) কেস ২ (রমজান ধর্মীয় ছাড়): রমজান মাসে মুসলিম রোজা রাখা কর্মীদের ক্যান্টিন বন্ধ থাকায় লাঞ্চ বিল ০ টাকা হবে, তবে হিন্দু ও খ্রিষ্টান কর্মীদের নিয়মিত খাবার চালু থাকায় তাদের ১০০০ টাকা কর্তন অব্যাহত থাকবে; (৩) কেস ৩ (৪০০+ কারখানায় ৬০% খাবার না খাওয়ার অপ্ট-আউট সমস্যা): অপ্ট-ইন রোস্টার মডেল এবং এক্সেল/সিএসভি বাল্ক সিঙ্ক মোডাল যুক্ত করা হয়েছে, যার মাধ্যমে খাবার না খাওয়া ৬০% কর্মীদের জন্য কোনো ম্যানুয়াল এন্ট্রি ছাড়াই স্বয়ংক্রিয়ভাবে ০ টাকা কর্তন হবে।"
  },
  {
    "id": "552",
    "date": "2026-10-11T12:15",
    "type": "Enhancement",
    "module": "Payroll / Bonus Submit & Check Bonus",
    "link": "/payroll-bonus-submit",
    "descriptionEn": "Made Req(%) and Bonus Amount editable in both Bonus Submit (/payroll-bonus-submit) and Check Bonus (/payroll-check-bonus) tables with live two-way synchronization: updating Req(%) automatically recalculates Bonus Amount, Bank Bonus, and Misc Bonus, while modifying Bonus Amount automatically updates the required percentage Req(%).",
    "descriptionBn": "বোনাস সাবমিট (/payroll-bonus-submit) এবং চেক বোনাস (/payroll-check-bonus) উভয় পেজের টেবিলে Req(%) এবং Bonus Amount ফিল্ড দুটিকে সরাসরি এডিটেবল করা হয়েছে: রিকোয়ার্ড পার্সেন্টেজ পরিবর্তন করলে স্বয়ংক্রিয়ভাবে বোনাস অ্যামাউন্ট ও ব্যাংক বোনাস হিসাব হবে এবং বোনাস অ্যামাউন্ট পরিবর্তন করলে স্বয়ংক্রিয়ভাবে Req(%) আপডেট হবে।"
  },
  {
    "id": "550",
    "date": "2026-10-11T12:00",
    "type": "Enhancement",
    "module": "Payroll / Yearly Bonus Process",
    "link": "/yearly-bonus-process",
    "descriptionEn": "Enhanced the Yearly Bonus Process page: (1) Added inline editing directly in the list view for Req(%), Net Pay, and Notes with instant recalculation of Net Pay upon changing Req(%); (2) Redesigned the Bonus Process Modal to be professional and comprehensive, including festival selection, tenure cut-off date, salary basis toggle (Basic vs Gross), active tenure slab matrix preview, and animated processing feedback; (3) Added bulk actions for Req% adjustment and approval submission.",
    "descriptionBn": "ইয়ারলি বোনাস প্রসেস পেজে গুরুত্বপূর্ণ উন্নতি করা হয়েছে: (১) প্রসেসের পর লিস্ট ভিউ থেকেই সরাসরি Req(%), Net Pay এবং Notes এডিট করার সুবিধা যুক্ত করা হয়েছে, যেখানে Req(%) পরিবর্তন করলে স্বয়ংক্রিয়ভাবে Net Pay রিক্যালকুলেট হয়; (২) প্রসেস মোডালটি অত্যন্ত প্রফেশনাল ও আধুনিক করা হয়েছে যাতে ফেস্টিভাল নির্বাচন, টেনিউর কাট-অফ ডেট, বেসিক/গ্রস স্যালারি ভিত্তি নির্বাচন এবং কোম্পানির অ্যাক্টিভ স্ল্যাব প্রিভিউ যুক্ত রয়েছে; (৩) একাধিক কর্মীর বোনাস একসাথে আপডেট ও সাবমিট করার বাল্ক অ্যাকশন যোগ করা হয়েছে।"
  },
  {
    "id": "555",
    "date": "2026-10-11T17:45",
    "type": "Authentic Geopolitical World Map Procurement Spend Map & Interactive Geometry",
    "module": "Procurement & Inventory Management / Procurement Command Center & Spend Intelligence",
    "link": "/procurement-dashboard",
    "descriptionEn": "Rebuilt the Total Cost Location (Global Geographic Spend Map) in the Procurement Management Dashboard with authentic country-level geometry based on the geopolitical world reference map: (1) Real Geographic Country Geometry: Integrated @svg-maps/world featuring all 256 geopolitical countries with recognizable continents, actual country shapes, and accurate political borders; (2) Authentic Map Styling: Replaced abstract shapes with light cyan ocean background, classic pastel political country shading (Canada yellow, US orange, Russia green, Brazil lime, China cream, India peach, Australia tan, etc.) and crisp political boundaries; (3) Proportional Spend Shading & Markers: Highlighted active procurement destinations with rich emerald spend shading (#059669 / #10b981), proportional bubble markers scaled to total procurement spend, and an animated pulse beacon on the top spend origin (Bangladesh); (4) Strict Minimal Tooltip: Hovering or clicking exclusively displays Country Name and Total Procurement Amount with zero supplier or transaction clutter; (5) Interactive Zoom & Filter Integration: Added World vs Eurasia Focus view modes, live filter synchronization across Organization, Department, Supplier, and Fiscal Period, and direct drill-downs to the Item-wise Purchase Report.",
    "descriptionBn": "প্রকিউরমেন্ট ম্যানেজমেন্ট ড্যাশবোর্ডের Total Cost Location (গ্লোবাল স্পেন্ড ম্যাপ) বাস্তবসম্মত রাজনৈতিক বিশ্ব মানচিত্রের ভৌগোলিক সীমারেখার ওপর ভিত্তি করে নতুনভাবে তৈরি করা হয়েছে: (১) নিখুঁত ভৌগোলিক মানচিত্র: @svg-maps/world লাইব্রেরি ব্যবহার করে বিশ্বের ২৫৬টি দেশের বাস্তব সীমানা, মহাদেশ ও খাঁটি দেশের আকার নিখুঁতভাবে ফুটিয়ে তোলা হয়েছে; (২) রাজনৈতিক মানচিত্রের আসল ডিজাইন: রেফারেন্স মানচিত্র অনুযায়ী হালকা সায়ান ব্লু সমুদ্র, আটলান্টিক/প্রশান্ত/ভারত মহাসাগরের মার্কার এবং বিভিন্ন দেশের জন্য আন্তর্জাতিক প্যাস্টেল রাজনৈতিক রঙের শেডিং প্রদান করা হয়েছে; (৩) খরচের আনুপাতিক হাইলাইটিং: যেসকল দেশে ক্রয় ব্যয় রয়েছে সেগুলোকে উজ্জ্বল এমারেল্ড সবুজ রঙ (#059669 / #10b981), ব্যয়ের পরিমাণের ওপর ভিত্তি করে আনুপাতিক বাবল মার্কার এবং সর্বোচ্চ ব্যয়ের দেশে (বাংলাদেশ) পালসিং বীকন দিয়ে স্পষ্ট করা হয়েছে; (৪) নির্ধারিত তথ্য প্রদর্শন: হোভার বা ক্লিকে কঠোরভাবে শুধুমাত্র দেশের নাম এবং মোট খরচের পরিমাণ প্রদর্শিত হয়, কোনো ভেন্ডর বা ট্রানজ্যাকশন সংক্রান্ত তথ্য বাদ রাখা হয়েছে; (৫) ইন্টারেক্টিভ জুম ও ড্রিল-ডাউন: ওয়ার্ল্ড ও ইউরেশিয়া ফোকাস মোড, ড্যাশবোর্ড ফিল্টার সিনক্রোনাইজেশন এবং ক্লিকে সরাসরি আইটেমভিত্তিক পারচেজ রিপোর্টে যাওয়ার সুবিধা নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "554",
    "date": "2026-10-11T17:05",
    "type": "Global Geographic Procurement Spend Map & Interactive World Map Intelligence",
    "module": "Procurement & Inventory Management / Procurement Command Center & Spend Intelligence",
    "link": "/procurement-dashboard",
    "descriptionEn": "Replaced the regional location map in the Procurement Management Dashboard with an interactive, high-fidelity SVG World Map displaying country-wise procurement expenditure: (1) Country-Level Aggregation: Consolidated purchasing expenditure strictly by country (Bangladesh, China, Germany, Switzerland, Japan, United States, Malaysia, India, United Kingdom, Vietnam, Turkey) derived from verified Supplier/Vendor Master data and item origin records, strictly excluding regional hubs, cities, or industrial zones; (2) Proportional Visual Prominence: Scaled country markers with glowing expenditure drop shadows and pulsing beacon radar animations on highest-spend origins to visually distinguish top procurement destinations; (3) Strict Tooltip Constraint: Interactive hover tooltips display strictly and exclusively the Country Name and Total Procurement Amount, deliberately omitting supplier names, supplier counts, and transaction counts; (4) Dynamic Multi-Filter Integration: Real-time map recalculation honoring all active dashboard filters (Fiscal Period, Organization, Department, and Supplier); (5) Integrated Report Drill-Down: Clicking any country or active country badge immediately opens the Item-wise Purchase Report pre-filtered by the selected country with all dashboard context intact and seamless return navigation.",
    "descriptionBn": "প্রকিউরমেন্ট ম্যানেজমেন্ট ড্যাশবোর্ডের আঞ্চলিক মানচিত্রের পরিবর্তে একটি আধুনিক, ইন্টারঅ্যাক্টিভ এসভিজি ওয়ার্ল্ড ম্যাপ (বিশ্ব মানচিত্র) যুক্ত করা হয়েছে যা দেশভিত্তিক ক্রয় ব্যয় প্রদর্শন করে: (১) দেশভিত্তিক খরচ একত্রীকরণ: সাপ্লায়ার মাস্টার ও আইটেম অরিজিনের তথ্যের ওপর ভিত্তি করে শুধুমাত্র দেশভিত্তিক (বাংলাদেশ, চীন, জার্মানি, সুইজারল্যান্ড, জাপান, যুক্তরাষ্ট্র, মালয়েশিয়া, ভারত, যুক্তরাজ্য প্রভৃতি) মোট ক্রয় ব্যয় হিসেব করা হয়েছে, কোনো শহর বা আঞ্চলিক শিল্প হাব দেখানো হয়নি; (২) আনুপাতিক ভিজ্যুয়াল বিশিষ্টতা: যেসকল দেশে ক্রয় ব্যয় বেশি সেগুলোকে আনুপাতিক বড় বাবল মার্কার, গ্লো ইফেক্ট এবং সর্বোচ্চ ব্যয়বহুল দেশে স্পন্দিত পালস রিং দিয়ে স্পষ্টভাবে ফুটিয়ে তোলা হয়েছে; (৩) নির্দিষ্ট তথ্য প্রদর্শন: হোভার বা ক্লিকে শুধুমাত্র দেশের নাম এবং মোট ক্রয় ব্যয়ের পরিমাণ প্রদর্শিত হয়, কোনো ভেন্ডরের নাম, ভেন্ডরের সংখ্যা বা ট্রানজ্যাকশন সংখ্যা কঠোরভাবে বাদ রাখা হয়েছে; (৪) ডায়নামিক ফিল্টারিং: ড্যাশবোর্ডের ফিসকাল পিরিয়ড, প্রতিষ্ঠান, ডিপার্টমেন্ট বা সাপ্লায়ার ফিল্টার পরিবর্তনের সাথে সাথে মানচিত্রটি রিয়েল-টাইমে আপডেট হয়; (৫) ফিল্টার্ড পারচেজ রিপোর্ট ড্রিল-ডাউন: মানচিত্রের যেকোনো দেশে বা নিচে প্রদর্শিত দেশের বাটনে ক্লিক করলে ফিল্টার অপরিবর্তিত রেখে সরাসরি নির্বাচিত দেশের আইটেমভিত্তিক পারচেজ রিপোর্ট ওপেন হয়।"
  },
  {
    "id": "553",
    "date": "2026-10-11T16:25",
    "type": "Procurement Management Dashboard Detailed Chart Suite & Geographic Spend Intelligence",
    "module": "Procurement & Inventory Management / Procurement Command Center & Spend Intelligence",
    "link": "/procurement-dashboard",
    "descriptionEn": "Implemented detailed 6-chart suite and executive layout enhancement for Procurement Dashboard: (1) Purchases Over Time: Grouped column chart comparing Current Year (2026) vs Previous Year (2025) across all 12 months with month drill-down into Item-wise Purchase Report; (2) Top 20 Purchases By: Horizontal bar chart with interactive toggle for Vendor, Item, and Category, displaying top 20 ranked descending with formatted amounts at bar ends and direct filtered drill-downs; (3) Total Cost Location: Interactive SVG vector map of Bangladesh with proportional bubble markers, pulse rings, and hover tooltips showing expenditure and transaction volume across Dhaka, Gazipur, Narayanganj, Chattogram Seaport, Savar, and Cumilla hubs; (4) On-Time Delivery Rate: Radial gauge measuring delivery SLA against PO delivery dates and MRR actual receipt dates, featuring SLA thresholds, on-time vs late delivery pill counts, and direct MRR register drill-down; (5) Total Orders by Status: Donut chart displaying PO/WO lifecycle distribution (Approved, Completed, Partially Received, Submitted, Draft) with total order count in donut center and status-filtered register drill-down; (6) Overdue Amount by Supplier Name: Horizontal bar chart displaying outstanding liabilities for supplier bills past payment due date with direct drill-down into Supplier Bill List; (7) Purchase by Category (Percentage & Amount): Prominent category breakdown displaying both exact monetary amount and percentage share with drill-down; (8) Removed Risk Alerts & Exceptions and Workflow Volumes sections as requested.",
    "descriptionBn": "প্রকিউরমেন্ট ম্যানেজমেন্ট ড্যাশবোর্ডের জন্য বিস্তারিত ৬-চার্ট বিশিষ্ট আধুনিক অ্যানালিটিক্স ও লেআউট সম্পন্ন করা হয়েছে: (১) Purchases Over Time: চলতি বছর (২০২৬) বনাম পূর্ববর্তী বছরের (২০২৫) ১২ মাসের ক্রয় ব্যয়ের তুলনামূলক গ্রুপড কলাম চার্ট এবং মাসভিত্তিক ড্রিল-ডাউন সুবিধা; (২) Top 20 Purchases By: ভেন্ডর, আইটেম এবং ক্যাটাগরি টগলসহ সর্বোচ্চ ২০টি ব্যয়ের অনুভূমিক বার চার্ট যাতে বারের শেষে টাকার পরিমাণ ও ফিল্টার্ড রিপোর্টে যাওয়ার সুবিধা রয়েছে; (৩) Total Cost Location: বাংলাদেশের ঢাকা, গাজীপুর, নারায়ণগঞ্জ, চট্টগ্রাম সমুদ্রবন্দর, সাভার ও কুমিল্লা হাবের জন্য আনুপাতিক বাবল মার্কার, পালস অ্যানিমেশন ও হোভার পপওভারসহ ইন্টারঅ্যাক্টিভ এসভিজি ব্যয় মানচিত্র; (৪) On-Time Delivery Rate: পিও ডেলিভারি তারিখ এবং এমআরআর রিসিভ তারিখ যাচাই করে সময়মতো পণ্য প্রাপ্তির শতকরা হার ও লেট ডেলিভারি কাউন্টসহ রেডিয়াল গেজ চার্ট; (৫) Total Orders by Status: পিও ও ওয়ার্ক অর্ডারের স্ট্যাটাসভিত্তিক ডোনাট চার্ট যার কেন্দ্রে মোট অর্ডারের সংখ্যা প্রদর্শিত হয়; (৬) Overdue Amount by Supplier Name: মেয়াদোত্তীর্ণ বকেয়া বিলের জন্য ভেন্ডরভিত্তিক অনুভূমিক বার চার্ট ও বিল লিস্ট ড্রিল-ডাউন; (৭) Purchase by Category (Percentage & Amount): ক্যাটাগরিভিত্তিক খরচের শতকরা হারের সাথে মোট টাকার সঠিক অংক স্পষ্ট প্রদর্শন; (৮) নির্দেশনামতে প্রকিউরমেন্ট রিস্ক অ্যালার্ট এবং ওয়ার্কফ্লো ভলিউম সেকশন দুটি সম্পূর্ণ বাদ দেওয়া হয়েছে।"
  },
  {
    "id": "552",
    "date": "2026-10-11T12:50",
    "type": "Procurement Management Dashboard Redesign & Chart-Driven Analytics",
    "module": "Procurement & Inventory Management / Procurement Command Center & Spend Intelligence",
    "link": "/procurement-dashboard",
    "descriptionEn": "Redesigned the Procurement Management Dashboard into a clean, modern, chart-driven executive decision-making command center: (1) Dynamic Filters: Added dynamic filtering for Fiscal Period / Date Range (FY 2026, Q3-Q4, Last 6 Months, Monthly, and Custom Range), Company/Organization, Department, and Supplier/Vendor with live automatic recalculation across all visual metrics; (2) Key Metrics: Replaced redundant KPIs with 3 essential executive cards strictly displaying Total Purchase Amount, Total Supplier Bill Amount, and Total Supplier Return Amount with ratio indicators and direct report links, eliminating budget metrics, pending approvals, and pending bills; (3) Interactive Charts & Analytics: Built 6 interactive charts including Monthly Purchase Trend (with clickable month drill-down into Item-wise Purchase Report), Purchase by Category (donut chart with category drill-down), Supplier Performance (grouped bar comparing PO, Bill, and Return amounts per vendor with multi-link quick drills), Monthly Purchase vs Supplier Bill Trend (dual bar-line trend), Monthly Supplier Return Trend (area chart with month drill-down to Supplier Return Report), and Procurement Workflow Funnel (tracking volumes and values across PR, PO/WO, MRR, and Supplier Bill with stage list navigation); (4) Dynamic Management Alerts: Added compact procurement risk cards for elevated supplier return rates, spend concentration risk, invoice-to-PO variances, and high-commitment purchase orders with direct links to records; (5) End-to-End Drill-Down Integration: Implemented functional drill-downs across all chart series and workflow stages preserving dashboard filters and providing intuitive 'Back to Dashboard' return navigation across all destination reports.",
    "descriptionBn": "প্রকিউরমেন্ট ম্যানেজমেন্ট ড্যাশবোর্ডটিকে আধুনিক, চার্ট-নির্ভর এবং এক্সিকিউটিভ সিদ্ধান্ত গ্রহণের উপযোগী কমান্ড সেন্টারে রূপান্তর করা হয়েছে: (১) ডায়নামিক ফিল্টার: ফিসকাল পিরিয়ড/তারিখ রেঞ্জ (চলতি অর্থবছর, কোয়ার্টার, বিগত ৬ মাস, মাসভিত্তিক এবং কাস্টম রেঞ্জ), কোম্পানি/প্রতিষ্ঠান, বিভাগ ও সাপ্লায়ার/ভেন্ডর ফিল্টারিং যুক্ত করা হয়েছে যা পরিবর্তনের সাথে সাথে সমস্ত চার্ট ও কেপিআই স্বয়ংক্রিয়ভাবে আপডেট হয়; (২) ৩টি প্রধান কেপিআই কার্ড: অপ্রয়োজনীয় ও বাজেট/অ্যাপ্রুভাল সংক্রান্ত মেট্রিক্স বাদ দিয়ে শুধুমাত্র ৩টি প্রধান কার্ড—মোট পারচেজ অ্যামাউন্ট, মোট সাপ্লায়ার বিল অ্যামাউন্ট এবং মোট সাপ্লায়ার রিটার্ন অ্যামাউন্ট সুনির্দিষ্ট হিসাব ও রিপোর্ট লিংকসহ প্রদর্শন করা হয়েছে; (৩) ৬টি ইন্টারঅ্যাক্টিভ চার্ট: মাসিক পারচেজ ট্রেন্ড (মাস ক্লিকে পারচেজ রিপোর্টে ড্রিল-ডাউন), ক্যাটাগরিভিত্তিক পারচেজ ডোনাট চার্ট, সাপ্লায়ার পারফরম্যান্স তুলনামূলক বার চার্ট (পিও, বিল ও রিটার্ন তুলনাসহ), পারচেজ বনাম সাপ্লায়ার বিল মাসিক ট্রেন্ড, মাসিক সাপ্লায়ার রিটার্ন এরিয়া চার্ট এবং ৪-ধাপের প্রকিউরমেন্ট ওয়ার্কফ্লো প্রসেস চার্ট (পিআর, পিও, এমআরআর ও বিল); (৪) ডায়নামিক রিস্ক অ্যালার্ট: অতিরিক্ত সাপ্লায়ার রিটার্ন, একক ভেন্ডর নির্ভরতা ঝুঁকি, বিল বনাম পিও তারতম্য এবং বড় অংকের ক্রয় আদেশের জন্য সরাসরি লিংকযুক্ত অ্যালার্ট কার্ড; (৫) নির্বিঘ্ন ড্রিল-ডাউন ও রিটার্ন ব্যবস্থা: প্রতিটি চার্ট এলিমেন্ট থেকে ফিল্টার অক্ষুণ্ণ রেখে সংশ্লিষ্ট বিস্তারিত রিপোর্টে যাওয়া এবং সেখান থেকে সহজেই 'Back to Dashboard' বাটনের মাধ্যমে ফিরে আসার পূর্ণ সুবিধা নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "551",
    "date": "2026-10-09T18:00",
    "type": "TypeScript Compilation Fixes",
    "module": "Inventory & Procurement Master Data",
    "link": "/procurement-master-data",
    "descriptionEn": "Resolved TypeScript typing and reference errors across Inventory and Procurement modules: (1) Added optional groupId to ItemProductMaster interface and updated Item Group filters in Inventory Configuration (/inventory-configuration) to support both itemGroupId and groupId; (2) Added optional targetPrice and estimatedPrice fields to CSItemQuote interface and provided fallback to estimatedUnitPrice in Comparative Statement (/procurement-comparative-statement) purchase history calculation and rate display modal; (3) Added handleOpenAddChildSubGroup and handleOpenCreateItem tree action handlers in Procurement Master Data (/procurement-master-data) to ensure sub-group tree child additions and item creations trigger reliably.",
    "descriptionBn": "ইনভেনটরি এবং প্রকিউরমেন্ট মডিউলের টাইপস্ক্রিপ্ট কম্পাইলেশন ও ইন্টারফেস সংক্রান্ত ত্রুটি সমাধান করা হয়েছে: (১) ItemProductMaster ইন্টারফেসে groupId যোগ এবং ইনভেনটরি কনফিগারেশন পেজে আইটেম গ্রুপ ফিল্টারিংয়ে itemGroupId ও groupId উভয়ের সাপোর্ট নিশ্চিত করা হয়েছে; (২) CSItemQuote ইন্টারফেসে targetPrice ও estimatedPrice যোগ এবং কম্প্যারেটিভ স্টেটমেন্ট পেজে দর ইতিহাস ও মডালে estimatedUnitPrice এর ব্যাকওয়ার্ড সাপোর্ট নিশ্চিত করা হয়েছে; (৩) প্রকিউরমেন্ট মাস্টার ডাটা পেজে সাব-গ্রুপ ট্রি থেকে চাইল্ড সাব-গ্রুপ ও সরাসরি আইটেম তৈরির জন্য handleOpenAddChildSubGroup ও handleOpenCreateItem হ্যান্ডলার সঠিকভাবে সংযুক্ত করা হয়েছে।"
  },
  {
    "id": "550",
    "date": "2026-10-08T10:30",
    "type": "Procurement & Inventory Management Workflow Fixes & Feature Enhancements",
    "module": "Procurement & Inventory Management / PO, Supplier Bill, MR, Transfers & Registers",
    "link": "/inv-transfer-requisition-approval",
    "descriptionEn": "Completed key updates and runtime fixes across Procurement & Inventory Management: (1) Purchase Order / Work Order: Resolved runtime crash on Create PO/WO form (/procurement-po-new) by declaring missing tax accumulator; (2) Supplier Bill: Item-level Tax % and tax amount from Work Orders/POs are now carried forward into Supplier Bill items and displayed in the bill item table and approval dossier; removed default prices from the Other Charges list and selection; (3) Material Request: Added permission toggle for viewing Available Stock to dynamically show or hide available stock in the form, items table, and preview report; (4) Transfer Requisition: Formatted \x27Add Item from Catalog\x27 modal into a clean table structure (Code, Item, Specification, UOM, Brand, Origin, Action) and removed unnecessary rate/price information while preserving search; (5) Transfer Requisition Approval: Updated \x27View\x27 action to open the full Transfer Requisition details on a dedicated page with item details, requested quantity, and available stock, and provided Approve, Reject, and Return actions on the details page; (6) Transfer Issue: Fixed runtime crash when selecting Intra-Company Transfer mode; (7) Item Transaction Ledger: Fixed page load crash, hid \x27Transaction Types Tracked\x27 KPI card, and added searchable Item input with clear button; (8) Item Movement Register: Removed Item Movement Register from Inventory Reports menus in sidebar and topbar; (9) Location Stock Register: Fixed page load crash, hid unneeded KPI cards (Active Storage Locations, Total Units in Bins, Bin Stock Valuation, Location Hierarchy), added searchable Item and Location filters, updated table column to \x27Location Name\x27, added Specification, Brand, and Origin columns, hid Batch column, and replaced drilldown with a detailed item stock movement history modal (In Qty, Out Qty, Balance).",
    "descriptionBn": "প্রকিউরমেন্ট এবং ইনভেনটরি ম্যানেজমেন্ট মডিউলে গুরুত্বপূর্ণ বাগ ফিক্স ও কার্যকারিতা উন্নয়ন সম্পন্ন করা হয়েছে: (১) পারচেজ অর্ডার / ওয়ার্ক অর্ডার: ক্রিয়েট পিও/ডব্লিউও পেজের ক্র্যাশ ফিক্স করা হয়েছে এবং ফর্মটি স্বাভাবিকভাবে কাজ করছে; (২) সাপ্লায়ার বিল: ওয়ার্ক অর্ডার/পিও থেকে আইটেম লেভেল ট্যাক্স (%) এবং ট্যাক্স অ্যামাউন্ট সরাসরি সাপ্লায়ার বিল আইটেম ও অ্যাপ্রুভাল ডসিয়ারে যুক্ত করা হয়েছে এবং আদার চার্জেস থেকে ডিফল্ট টাকার মান সরানো হয়েছে; (৩) ম্যাটেরিয়াল রিকোয়েস্ট: অ্যাভেইলেবল স্টক দেখার জন্য পারমিশন ও কনফিগারেশন টগল যুক্ত করা হয়েছে যা চালু বা বন্ধের ওপর ভিত্তি করে স্টক প্রদর্শিত হবে; (৪) ট্রান্সফার রিকুইজিশন: ক্যাটালগ থেকে আইটেম সিলেকশন মডালটিকে প্রপার টেবিল ফরম্যাটে (কোড, আইটেম, স্পেসিফিকেশন, ইউওএম, ব্র্যান্ড, অরিজিন ও অ্যাকশন) সাজানো হয়েছে এবং অপ্রয়োজনীয় দর/মূল্য তথ্য সরানো হয়েছে; (৫) ট্রান্সফার রিকুইজিশন অ্যাপ্রুভাল: অ্যাকশন কলামের \x27View\x27 বাটনে ক্লিক করলে সম্পূর্ণ ট্রান্সফার রিকুইজিশন বিবরণী নতুন পেজে ওপেন হবে এবং সেই পেজে অ্যাপ্রুভ, রিজেক্ট ও রিটার্ন অ্যাকশন প্রদান করা হয়েছে; (৬) ট্রান্সফার ইস্যু: ইন্ট্রা-কোম্পানি ট্রান্সফার সিলেক্ট করার ক্র্যাশ ফিক্স করা হয়েছে; (৭) আইটেম ট্রানজেকশন লেজার: পেজ লোড ক্র্যাশ ফিক্স, \x27Transaction Types Tracked\x27 কেপিআই লুকানো এবং সার্চেবল আইটেম ফিল্টার যোগ করা হয়েছে; (৮) আইটেম মুভমেন্ট রেজিস্টার: ইনভেনটরি রিপোর্টস মেনু থেকে আইটেম মুভমেন্ট রেজিস্টার সরানো হয়েছে; (৯) লোকেশন স্টক রেজিস্টার: পেজ লোড ক্র্যাশ ফিক্স, অপ্রয়োজনীয় ৪টি কেপিআই লুকানো, সার্চেবল আইটেম ও লোকেশন ফিল্টার যোগ, কলামের নাম \x27Location Name\x27 করা, স্পেসিফিকেশন/ব্র্যান্ড/অরিজিন যোগ, ব্যাচ কলাম লুকানো এবং ড্রিল-ডাউনে ইন-কোয়ান্টিটি, আউট-কোয়ান্টিটি ও ব্যালেন্স হিস্ট্রি মডাল যুক্ত করা হয়েছে।"
  },
  {
    "id": "549",
    "date": "2026-10-07T18:45",
    "type": "Procurement & Inventory Management UI, Workflow & Report Enhancements",
    "module": "Procurement & Inventory Management / Master Data, Transfers, Registers & Reports",
    "link": "/procurement-reports-monthly-purchase",
    "descriptionEn": "Implemented 26 requested UI, workflow, and report enhancements across Procurement and Inventory modules: (1) Renamed Vendor Categories label in Supplier/Vendor Setup; (2) Added item price history modal via \x27H\x27 button, item-level Tax (%), and filtered catalog strictly to service items when Document Type is Work Order; (3) In Item Setup, renamed \x27Service Flag\x27 to \x27Service\x27, renamed \x27Valuation Method\x27 to \x27Issue Type\x27 (FIFO/LIFO only), and positioned root parent item groups at the top of the group tree; (4) Added Tax field alongside VAT/Total, renamed Other Charges, and provided item-level charge inputs in Supplier Bill; (5) Resolved runtime crash in Material Requisition; (6) Hidden Rate and Total columns from Transfer Requisition forms; (7) Embedded Approve, Reject, and Return for Correction buttons inside Transfer Requisition Approval modal; (8) Introduced Intra-Company Transfer page and updated Inter-Company Transfer menu and requisition rules; (9) Cleaned filters, columns, and badges in Stock Balance Register; (10) Added searchable Item input and hid unneeded KPI in Item Transaction Ledger; (11) Cleaned filters and added Total Quantity table footer in Item Movement Register; (12) Added searchable Item selector, Value column, and Total Quantity & Value table footer in Batch Stock Register; (13) Streamlined KPIs, added Spec/Brand/Origin columns, table footer totals, and item movement timeline in Location Stock Register; (14) Removed action column, added Value column, and added table footer in Item Receipt Register; (15) Removed action column, added Value column, and added table footer in Item Issue Register; (16) Streamlined KPIs, added Value column, and added table footer in Stock Transfer Register; (17) Removed Stock Adjustment Register from Inventory sidebar and topbar menus; (18) Filtered approved write-offs, added Location column, and added table footer in Stock Write-Off Register; (19) Added Category filter, Spec/Brand/Origin columns, and table footer in Stock Valuation Register; (20) Enhanced Month-wise Material Receive Report with searchable Item, Category filter, and summarized Month/Qty/Value table with footer totals; (21) Enhanced Month-wise Material Issue Report with searchable Item, Group, Category filter, and summarized table with footer totals; (22) Enhanced Month-wise Supplier Return Report with searchable Item, Supplier, Group, Category, and summarized table with footer totals; (23) Removed Purchase Price Report & Payment Statement from Procurement menus, and renamed Month-wise Purchase Report to Item-wise Purchase Report; (24) Updated Item-wise Purchase Report with searchable master filters, from/to dates, date-wise listing table, and grand total footer; (25) Adjusted Month-wise Supplier Bill Report table container width, added Total Quantity column and footer with grand total quantity and value; (26) Standardized table footers across all inventory and procurement reports to consistently display total quantity and total value.",
    "descriptionBn": "প্রকিউরমেন্ট এবং ইনভেনটরি মডিউলে ২৬টি নতুন পরিবর্তন ও রিপোর্ট আধুনিকায়ন সম্পন্ন করা হয়েছে: (১) সাপ্লায়ার/ভেন্ডর ফর্মে লেবেল পরিবর্তন করে \x27Vendor Category\x27 করা হয়েছে; (২) পিও এবং ওয়ার্ক অর্ডারে আইটেম দর ইতিহাস দেখতে \x27H\x27 বাটন, ট্যাক্স (%) ইনপুট এবং ওয়ার্ক অর্ডারের ক্ষেত্রে শুধুমাত্র সার্ভিস আইটেম ফিল্টারিং যোগ করা হয়েছে; (৩) আইটেম সেটআপে \x27Service Flag\x27 এর নাম \x27Service\x27 এবং \x27Valuation Method\x27 এর নাম \x27Issue Type\x27 (FIFO ও LIFO) করা হয়েছে এবং গ্রুপ ট্রি-তে মূল প্যারেন্ট গ্রুপগুলোকে সবার উপরে সাজানো হয়েছে; (৪) সাপ্লায়ার বিলে ভ্যাট ও মোট টাকার পাশাপাশি ট্যাক্স ফিল্ড যোগ, আদার চার্জেস রিনেম এবং আইটেম লেভেল ইনপুট প্রদান করা হয়েছে; (৫) ম্যাটেরিয়াল রিকুইজিশন পেজের ক্র্যাশ ফিক্স করা হয়েছে; (৬) ট্রান্সফার রিকুইজিশন ফর্মে অপ্রয়োজনীয় রেট ও টোটাল কলাম লুকানো হয়েছে; (৭) ট্রান্সফার রিকুইজিশন অ্যাপ্রুভাল মডালে সরাসরি অ্যাপ্রুভ, রিজেক্ট ও রিটার্ন বাটন যুক্ত করা হয়েছে; (৮) ইন্ট্রা-কোম্পানি ট্রান্সফার পেজ তৈরি ও ইন্টার-কোম্পানি ট্রান্সফার মেনু ও নিয়ম আপডেট করা হয়েছে; (৯) স্টক ব্যালেন্স রিপোর্টে ফিল্টার ও কলাম গোছানো হয়েছে; (১০) ট্রানজেকশন লেজারে সার্চেবল আইটেম ফিল্টার যোগ করা হয়েছে; (১১) আইটেম মুভমেন্ট রিপোর্টে ফিল্টার ক্লিন এবং টেবিলের নিচে মোট কোয়ান্টিটি দেখানো হয়েছে; (১২) ব্যাচ স্টক রিপোর্টে সার্চেবল আইটেম, ভ্যালু কলাম ও ফুটারে মোট কোয়ান্টিটি এবং মোট টাকা যোগ করা হয়েছে; (১৩) লোকেশন স্টক রিপোর্টে স্পেসিফিকেশন/ব্র্যান্ড/অরিজিন কলাম, ফুটার টোটাল ও মুভমেন্ট হিস্ট্রি মডাল যোগ করা হয়েছে; (১৪) রিসিট রেজিস্টারে অপ্রয়োজনীয় অ্যাকশন কলাম সরিয়ে ভ্যালু কলাম ও ফুটার টোটাল যোগ করা হয়েছে; (১৫) ইস্যু রেজিস্টারে অপ্রয়োজনীয় অ্যাকশন কলাম সরিয়ে ভ্যালু কলাম ও ফুটার টোটাল যোগ করা হয়েছে; (১৬) স্টক ট্রান্সফার রিপোর্টে কেপিআই গোছানো, ভ্যালু কলাম এবং ফুটার টোটাল যোগ করা হয়েছে; (১৭) ইনভেনটরি সাইডবার ও টপবার মেনু থেকে স্টক অ্যাডজাস্টমেন্ট রেজিস্টার সরানো হয়েছে; (১৮) স্টক রাইট-অফ রিপোর্টে অ্যাপ্রুভড রেকর্ড ফিল্টার, লোকেশন কলাম ও ফুটার টোটাল যোগ করা হয়েছে; (১৯) স্টক ভ্যালুয়েশন রিপোর্টে ক্যাটাগরি ফিল্টার, স্পেক/ব্র্যান্ড/অরিজিন ও ফুটার টোটাল যোগ করা হয়েছে; (২০) মাসভিত্তিক ম্যাটেরিয়াল রিসিভ রিপোর্টে সার্চেবল আইটেম, ক্যাটাগরি সিলেক্ট ও সামারি টেবিলসহ ফুটার টোটাল কোয়ান্টিটি ও ভ্যালু যোগ করা হয়েছে; (২১) মাসভিত্তিক ম্যাটেরিয়াল ইস্যু রিপোর্টে সার্চেবল ফিল্টার ও সামারি টেবিলসহ ফুটার টোটাল যোগ করা হয়েছে; (২২) মাসভিত্তিক সাপ্লায়ার রিটার্ন রিপোর্টে সার্চেবল ফিল্টার ও সামারি টেবিলসহ ফুটার টোটাল যোগ করা হয়েছে; (২৩) প্রকিউরমেন্ট মেনু থেকে পারচেজ প্রাইস রিপোর্ট ও পেমেন্ট স্টেটমেন্ট সরানো হয়েছে এবং মান্থ-ওয়াইজ পারচেজ রিপোর্ট রিনেম করে \x27Item-wise Purchase Report\x27 করা হয়েছে; (২৪) আইটেম-ওয়াইজ পারচেজ রিপোর্টে সার্চেবল ফিল্টার, তারিখ রেঞ্জ, তারিখভিত্তিক রো লিস্টিং ও গ্র্যান্ড টোটাল ফুটার যুক্ত করা হয়েছে; (২৫) মান্থ-ওয়াইজ সাপ্লায়ার বিল রিপোর্টে টেবিলের কন্টেইনার উইডথ ঠিক করা হয়েছে এবং ফুটারে মোট কোয়ান্টিটি ও মোট টাকার হিসাব দেখানো হয়েছে; (২৬) সকল ইনভেনটরি ও প্রকিউরমেন্ট রিপোর্টে টেবিলের নিচে মোট কোয়ান্টিটি ও মোট ভ্যালু প্রদর্শনের মানদণ্ড শতভাগ নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "548",
    "date": "2026-10-07T12:30",
    "type": "Procurement & Inventory Management Complete Reports Suite Implementation",
    "module": "Procurement & Inventory Management / Reports Suite",
    "link": "/procurement-reports-monthly-purchase",
    "descriptionEn": "Built and organized the complete Procurement Management Reports and Inventory Management Reports suites within their respective modules: (1) Procurement Reports: Month-wise Purchase Report (/procurement-reports-monthly-purchase) and Month-wise Supplier Bill Report (/procurement-reports-monthly-supplier-bill) with monthly groupings, subtotals, grand totals, advanced filters, voucher view modals, and Excel/PDF/CSV exports; (2) Inventory Reports: Stock Balance Register (/inv-report-stock-balance) with 6 KPI cards, strict single B/L badges, and stock breakdown; Item Stock Register (/inv-report-item-stock) with item search modal, summary metrics, and transaction history drilldown; Item Transaction Ledger (/inv-report-transaction-ledger) covering all 11 transaction types with running balances; Item Movement Register (/inv-report-item-movement) with multi-stage movement timeline; Batch Stock Register (/inv-report-batch-stock) with shelf-life KPIs; Location Stock Register (/inv-report-location-stock) with Rack/Shelf/Bin tree; Item Receipt Register (/inv-report-receipt-register) across all 6 inbound sources; Item Issue Register (/inv-report-issue-register) across all 5 outbound sources; Stock Transfer Register (/inv-report-stock-transfer) with 5-stage dispatch/receive lifecycle; Stock Adjustment Register (/inv-report-stock-adjustment) for +/- count reconciliations; Stock Write-Off Register (/inv-report-stock-writeoff) for permanent casualty loss audit; and Stock Valuation Register (/inv-report-stock-valuation) for management and finance capital reporting; (3) Month-wise Inventory Reports: Month-wise Material Receive (/inv-report-monthly-receive), Month-wise Material Issue (/inv-report-monthly-issue), and Month-wise Supplier Stock Return (/inv-report-monthly-supplier-return) with monthly subtotal rows; (4) Universal Standards: Enforced configured Amount Format from Currency Setup across all monetary figures, dynamic filtering, sorting, pagination, and multi-format exports.",
    "descriptionBn": "প্রকিউরমেন্ট এবং ইনভেনটরি ম্যানেজমেন্ট মডিউলে সম্পূর্ণ রিপোর্ট স্যুট বাস্তবায়ন ও সুবিন্যস্ত করা হয়েছে: (১) প্রকিউরমেন্ট রিপোর্টস: মাসভিত্তিক পারচেজ রিপোর্ট (/procurement-reports-monthly-purchase) ও মাসভিত্তিক সাপ্লায়ার বিল রিপোর্ট (/procurement-reports-monthly-supplier-bill) যাতে রয়েছে মাসভিত্তিক গ্রুপিং, মাসিক সাবটোটাল, সর্বমোট যোগফল, পূর্ণাঙ্গ ফিল্টার, ভাউচার ভিউ মোডাল এবং এক্সেল/পিডিএফ/সিএসভি এক্সপোর্ট; (২) ইনভেনটরি রিপোর্টস: স্টক ব্যালেন্স রেজিস্টার (/inv-report-stock-balance) ৬টি কেপিআই কার্ড ও সুনির্দিষ্ট B/L ব্যাজসহ; আইটেম স্টক রেজিস্টার (/inv-report-item-stock) আইটেম সার্চ ও ড্রিলডাউনসহ; আইটেম ট্রানজেকশন লেজার (/inv-report-transaction-ledger) সকল ১১টি ট্রানজেকশন ধরন ও রানিং ব্যালেন্সসহ; আইটেম মুভমেন্ট রেজিস্টার (/inv-report-item-movement) মুভমেন্ট টাইমলাইনসহ; ব্যাচ স্টক রেজিস্টার (/inv-report-batch-stock) ৫টি এক্সপায়ারি কেপিআইসহ; লোকেশন স্টক রেজিস্টার (/inv-report-location-stock) র‍্যাক/শেলফ/বিন ড্রিলডাউনসহ; আইটেম রিসিট রেজিস্টার (/inv-report-receipt-register) ৬টি আগত উৎসসহ; আইটেম ইস্যু রেজিস্টার (/inv-report-issue-register) ৫টি বহির্গামী উৎসসহ; স্টক ট্রান্সফার রেজিস্টার (/inv-report-stock-transfer) ৫-ধাপের লাইফসাইকেল ফ্লোসহ; স্টক অ্যাডজাস্টমেন্ট রেজিস্টার (/inv-report-stock-adjustment) ম্যানুয়াল সমন্বয় অডিটসহ; স্টক রাইট-অফ রেজিস্টার (/inv-report-stock-writeoff) ক্ষতি নিরীক্ষা ও ডসিয়ারসহ; এবং স্টক ভ্যালুয়েশন রেজিস্টার (/inv-report-stock-valuation) ফিন্যান্স ও ম্যানেজমেন্ট মূল্যায়নের জন্য; (৩) মাসভিত্তিক ইনভেনটরি রিপোর্টস: মাসভিত্তিক ম্যাটেরিয়াল রিসিভ (/inv-report-monthly-receive), ইস্যু (/inv-report-monthly-issue), ও সাপ্লায়ার রিটার্ন (/inv-report-monthly-supplier-return) মাসিক সাবটোটালসহ; (৪) সার্বজনীন মানদণ্ড: কারেন্সি সেটআপের কনফিগার করা অ্যামাউন্ট ফরম্যাট, সুনির্দিষ্ট B (ব্যাচ) বা L (লোকেশন) ব্যাজ, ডায়নামিক ফিল্টারিং, সর্টিং, পেজিনেশন এবং এক্সেল, পিডিএফ ও সিএসভি এক্সপোর্ট শতভাগ নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "547",
    "date": "2026-10-07T11:25",
    "type": "Procurement Enhancements & End-to-End Stock Transfer Requisition System",
    "module": "Procurement & Inventory Management / Master Data, CS, PO, Billing, and Transfer Requisition",
    "link": "/inv-transfer-requisition",
    "descriptionEn": "Implemented comprehensive enterprise upgrades across Procurement & Inventory Management: (1) Supplier/Vendor Setup: Added multi-selection support for Vendor Categories with chip tags and auto-determination of Local/Foreign origin flag based on the selected country; (2) Currency Master: Added 'Cur. Sub Unit' text field and Amount Format dropdown with 7 standard decimal/comma options; (3) Comparative Statement (CS): Added item-wise price history modal accessed via 'H' button displaying historical supplier, purchase date, quantity, rate, and amount; added Tax % input in Supplier sections and incorporated Tax into total calculations; (4) Work Order: Added item-level and total-level Tax % and filtered item catalog to display strictly Service Flag items when Document Type is Work Order; (5) Item Setup: Added Service Flag at item and Item Group levels with automatic inheritance to child items, added item Valuation Method (FIFO/LIFO), and displayed the main/root parent Item Group at the top of the hierarchy tree; (6) Supplier Bill: Added Tax field beside VAT and Total, and transformed Other Charges into a searchable multi-select dropdown featuring only Service Flag items; (7) Warehouse/Store Setup: Set Stock Valuation Method to default to 'Weighted Average'; (8) Material Request: Added company-wise policy toggle for Available Stock allowing organizations to dynamically display or hide available stock; (9) Transfer Requisition & Issue System: Created Transfer Requisition entry form (/inv-transfer-requisition), Requisition Register (/inv-transfer-requisition-list), Approval Desk (/inv-transfer-requisition-approval) with Approve, Reject, and Return for Correction actions, Transfer Issue Register (/inv-transfer-issue-list) and entry (/inv-intercompany-transfer) enforcing mandatory requisition tagging and approval for Inter-Company transfers while allowing direct transfers without mandatory requisitions for Intra-Company transfers.",
    "descriptionBn": "à¦ªà§�à¦°à¦•à¦¿à¦‰à¦°à¦®à§‡à¦¨à§�à¦Ÿ à¦�à¦¬à¦‚ à¦‡à¦¨à¦­à§‡à¦¨à¦Ÿà¦°à¦¿ à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦®à§‡à¦¨à§�à¦Ÿà§‡ à¦¬à§�à¦¯à¦¾à¦ªà¦• à¦†à¦ªà¦—à§�à¦°à§‡à¦¡ à¦¬à¦¾à¦¸à§�à¦¤à¦¬à¦¾à§Ÿà¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: (à§§) à¦¸à¦¾à¦ªà§�à¦²à¦¾à¦¯à¦¼à¦¾à¦° à¦¸à§‡à¦Ÿà¦†à¦ªà§‡ à¦­à§‡à¦¨à§�à¦¡à¦° à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿ à¦®à¦¾à¦²à§�à¦Ÿà¦¿-à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦“ à¦²à§‹à¦•à¦¾à¦²/à¦«à¦°à§‡à¦¨ à¦«à§�à¦²à§�à¦¯à¦¾à¦— à¦…à¦Ÿà§‹-à¦¨à¦¿à¦°à§�à¦§à¦¾à¦°à¦£; (à§¨) à¦•à¦¾à¦°à§‡à¦¨à§�à¦¸à¦¿ à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦°à§‡ à¦¸à¦¾à¦¬ à¦‡à¦‰à¦¨à¦¿à¦Ÿ à¦“ à¦…à§�à¦¯à¦¾à¦®à¦¾à¦‰à¦¨à§�à¦Ÿ à¦«à¦°à¦®à§�à¦¯à¦¾à¦Ÿ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨; (à§©) à¦¸à¦¿à¦�à¦¸-à¦� à¦¦à¦° à¦‡à¦¤à¦¿à¦¹à¦¾à¦¸ à¦®à§‹à¦¡à¦¾à¦² ('H' à¦¬à¦¾à¦Ÿà¦¨) à¦“ à¦Ÿà§�à¦¯à¦¾à¦•à§�à¦¸ à¦‡à¦¨à¦ªà§�à¦Ÿ; (à§ª) à¦“à¦¯à¦¼à¦¾à¦°à§�à¦• à¦…à¦°à§�à¦¡à¦¾à¦°à§‡ à¦Ÿà§�à¦¯à¦¾à¦•à§�à¦¸ (%) à¦�à¦¬à¦‚ à¦¸à¦¾à¦°à§�à¦­à¦¿à¦¸ à¦†à¦‡à¦Ÿà§‡à¦® à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à¦¿à¦‚; (à§«) à¦†à¦‡à¦Ÿà§‡à¦® à¦¸à§‡à¦Ÿà¦†à¦ªà§‡ à¦¸à¦¾à¦°à§�à¦­à¦¿à¦¸ à¦«à§�à¦²à§�à¦¯à¦¾à¦—, à¦‡à¦¸à§�à¦¯à§� à¦Ÿà¦¾à¦‡à¦ª à¦“ à¦°à§�à¦Ÿ à¦ªà§�à¦¯à¦¾à¦°à§‡à¦¨à§�à¦Ÿ à¦—à§�à¦°à§�à¦ª à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¨; (à§¬) à¦¸à¦¾à¦ªà§�à¦²à¦¾à¦¯à¦¼à¦¾à¦° à¦¬à¦¿à¦²à§‡ à¦Ÿà§�à¦¯à¦¾à¦•à§�à¦¸ à¦«à¦¿à¦²à§�à¦¡ à¦“ à¦¸à¦¾à¦°à§�à¦­à¦¿à¦¸ à¦†à¦‡à¦Ÿà§‡à¦® à¦¦à¦¿à§Ÿà§‡ à¦†à¦¦à¦¾à¦° à¦šà¦¾à¦°à§�à¦œà§‡à¦¸ à¦¨à¦¿à¦°à§�à¦¬à¦¾à¦šà¦¨; (à§­) à¦“à¦¯à¦¼à§�à¦¯à¦¾à¦°à¦¹à¦¾à¦‰à¦¸ à¦¸à§‡à¦Ÿà¦†à¦ªà§‡ à¦“à¦¯à¦¼à§‡à¦Ÿà§‡à¦¡ à¦…à§�à¦¯à¦¾à¦­à¦¾à¦°à§‡à¦œ à¦¡à¦¿à¦«à¦²à§�à¦Ÿ; (à§®) à¦®à§�à¦¯à¦¾à¦Ÿà§‡à¦°à¦¿à¦¯à¦¼à¦¾à¦² à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨à§‡ à¦…à§�à¦¯à¦¾à¦­à§‡à¦‡à¦²à§‡à¦¬à¦² à¦¸à§�à¦Ÿà¦• à¦ªà¦²à¦¿à¦¸à¦¿ à¦Ÿà¦—à¦²; (à§¯) à¦Ÿà§�à¦°à¦¾à¦¨à§�à¦¸à¦«à¦¾à¦° à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨, à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦¡à§‡à¦¸à§�à¦• à¦“ à¦Ÿà§�à¦°à¦¾à¦¨à§�à¦¸à¦«à¦¾à¦° à¦‡à¦¸à§�à¦¯à§� à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦® à¦ªà§�à¦°à¦£à¦¯à¦¼à¦¨à¥¤"
  },
  {
    "id": "546",
    "date": "2026-10-07T14:38",
    "type": "Enhancement",
    "module": "Workspace Selection & Module Launcher (Finance & Accounting Integration)",
    "link": "/module-selection",
    "descriptionEn": "Activated 'Finance & Accounting' under the Active Modules section on the Workspace Selection page with direct routing to https://pakiza-accounts.vercel.app/, and updated the topbar Corporate Modules launcher accordingly.",
    "descriptionBn": "à¦“à¦¯à¦¼à¦¾à¦°à§�à¦•à¦¸à§�à¦ªà§‡à¦¸ à¦¸à¦¿à¦²à§‡à¦•à¦¶à¦¨ à¦ªà§‡à¦œà§‡ 'Active Modules' à¦¸à§‡à¦•à¦¶à¦¨à§‡ 'Finance & Accounting' à¦®à¦¡à¦¿à¦‰à¦²à¦Ÿà¦¿ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾ à¦•à§�à¦²à¦¿à¦• à¦•à¦°à¦²à§‡ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ https://pakiza-accounts.vercel.app/ à¦“à¦ªà§‡à¦¨ à¦¹à¦¬à§‡ à¦�à¦¬à¦‚ à¦Ÿà¦ªà¦¬à¦¾à¦° à¦®à¦¡à¦¿à¦‰à¦² à¦²à¦žà§�à¦šà¦¾à¦°à§‡à¦“ à¦²à¦¿à¦‚à¦•à¦Ÿà¦¿ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "545",
    "date": "2026-10-07T13:00",
    "type": "Enhancement",
    "module": "Configure - Job & Employee Setup (OT & Salary Formula Editing)",
    "link": "/configure-employment?tab=otFormula",
    "descriptionEn": "Enhanced formula editing across OT Configuration and Salary Structure with 1-click direct formula editor from the master table, inline row editing with auto-save, formula builder submodal presets (2x Labour Law, 1.5x OT, Gross deducted, etc.), token inserters, and interactive live calculation sandbox tester.",
    "descriptionBn": "à¦“à¦Ÿà¦¿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦�à¦¬à¦‚ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¸à§�à¦Ÿà§�à¦°à¦¾à¦•à¦šà¦¾à¦°à§‡ à¦«à¦°à§�à¦®à§�à¦²à¦¾ à¦�à¦¡à¦¿à¦Ÿà¦¿à¦‚ à¦‰à¦¨à§�à¦¨à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡; à¦�à¦–à¦¨ à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦Ÿà§‡à¦¬à¦¿à¦² à¦¥à§‡à¦•à§‡à¦‡ à§§-à¦•à§�à¦²à¦¿à¦•à§‡ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦«à¦°à§�à¦®à§�à¦²à¦¾ à¦�à¦¡à¦¿à¦Ÿà¦° à¦“à¦ªà§‡à¦¨ à¦•à¦°à¦¾ à¦¯à¦¾à§Ÿ, à¦Ÿà§‡à¦¬à¦¿à¦²à§‡à¦° à¦°à§‹-à¦¤à§‡ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ à¦Ÿà¦¾à¦‡à¦ª à¦•à¦°à§‡ à¦¸à§‡à¦­ à¦•à¦°à¦¾ à¦¯à¦¾à§Ÿ à¦�à¦¬à¦‚ à¦¸à¦¾à¦¬à¦®à¦¡à¦¾à¦²à§‡ à¦•à§�à¦‡à¦• à¦ªà§�à¦°à¦¿à¦¸à§‡à¦Ÿ (à¦²à§‡à¦¬à¦¾à¦° à¦² à§¨x, à§§.à§«x, à¦—à§�à¦°à¦¸ à¦‡à¦¤à§�à¦¯à¦¾à¦¦à¦¿), à¦Ÿà§‹à¦•à§‡à¦¨ à¦‡à¦¨à¦¸à¦¾à¦°à§�à¦Ÿà¦¾à¦° à¦“ à¦²à¦¾à¦‡à¦­ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦Ÿà¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "544",
    "date": "2026-10-07T12:45",
    "type": "New Feature",
    "module": "Configure - Job & Employee Setup (OT Configuration Formula)",
    "link": "/configure-employment?tab=otFormula",
    "descriptionEn": "Added a new 'OT Configuration (Formula)' tab in Job & Employee Setup with formula-based overtime hourly rate builder, mathematical operator toolbar, variables (BASIC, GROSS, 208, etc.), type-based rules (Regular, Holiday, Festival, Night), and live calculation simulation.",
    "descriptionBn": "Job & Employee Setup à¦ªà§‡à¦œà§‡ à¦¨à¦¤à§�à¦¨ 'OT Configuration (Formula)' à¦Ÿà§�à¦¯à¦¾à¦¬ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦Ÿà¦¾à¦‡à¦ª à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦“à¦­à¦¾à¦°à¦Ÿà¦¾à¦‡à¦® à¦°à§‡à¦Ÿ à¦«à¦°à§�à¦®à§�à¦²à¦¾ à¦¤à§ˆà¦°à¦¿, à¦—à¦¾à¦£à¦¿à¦¤à¦¿à¦• à¦…à¦ªà¦¾à¦°à§‡à¦Ÿà¦° à¦“ à¦­à§�à¦¯à¦¾à¦°à¦¿à¦¯à¦¼à§‡à¦¬à¦² (BASIC, GROSS, 208 à¦‡à¦¤à§�à¦¯à¦¾à¦¦à¦¿) à¦¦à¦¿à§Ÿà§‡ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦¸à¦®à§€à¦•à¦°à¦£ à¦�à¦¬à¦‚ à¦²à¦¾à¦‡à¦­ à¦¸à¦¿à¦®à§�à¦²à§‡à¦¶à¦¨ à¦ªà§�à¦°à¦¿à¦­à¦¿à¦‰ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "543",
    "date": "2026-10-06T17:54",
    "type": "Bug Fix",
    "module": "Dependencies / Build & Deployment",
    "descriptionEn": "Updated TanStack Start (@tanstack/react-start) and router dependencies to non-vulnerable patched versions (1.168.60+) to fix Vercel XSS vulnerability build error.",
    "descriptionBn": "à¦­à¦¾à¦°à§�à¦¸à§‡à¦² (Vercel) à¦¬à¦¿à¦²à§�à¦¡ à¦�à¦°à¦° à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦•à¦°à¦¤à§‡ à¦Ÿà¦¾à¦¨à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦• à¦¸à§�à¦Ÿà¦¾à¦°à§�à¦Ÿ (@tanstack/react-start) à¦¸à¦¹ à¦ªà§�à¦¯à¦¾à¦•à§‡à¦œà¦¸à¦®à§‚à¦¹ à¦¨à¦¿à¦°à¦¾à¦ªà¦¦ à¦“ à¦ªà§�à¦¯à¦¾à¦šà¦¡ à¦­à¦¾à¦°à§�à¦¸à¦¨à§‡ (1.168.60+) à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "542",
    "date": "2026-10-06T17:43",
    "type": "Bug Fix",
    "module": "Configure - Company Setup (Designation Organogram)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Fixed TypeScript type error in openDirectionalAdd function to allow null target when adding the first designation to a blank organogram canvas.",
    "descriptionBn": "à¦–à¦¾à¦²à¦¿ à¦…à¦°à§�à¦—à¦¾à¦¨à§‹à¦—à§�à¦°à¦¾à¦® à¦•à§�à¦¯à¦¾à¦¨à¦­à¦¾à¦¸à§‡ à¦ªà§�à¦°à¦¥à¦® à¦ªà¦¦à¦¬à§€ à¦¯à§‹à¦— à¦•à¦°à¦¾à¦° à¦¸à¦®à§Ÿ à¦“à¦ªà§‡à¦¨-à¦¡à¦¿à¦°à§‡à¦•à¦¶à¦¨à¦¾à¦²-à¦…à§�à¦¯à¦¾à¦¡ à¦«à¦¾à¦‚à¦¶à¦¨à§‡ à¦¨à¦¾à¦² (null) à¦Ÿà¦¾à¦‡à¦ª à¦�à¦°à¦° à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "541",
    "date": "2026-10-06T17:15",
    "type": "Enhancement",
    "module": "Configure - Company Setup (Designation Organogram Direct Selection)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Restored the Designation Organogram system under Configure > Company Setup and updated the 'Add Next Hierarchy Level' action to directly open the designation selector modal for Level 2 selection without manual title entry.",
    "descriptionBn": "Configure > Company Setup à¦� Organogram à¦«à¦¿à¦šà¦¾à¦°à¦Ÿà¦¿ à¦ªà§�à¦¨à¦°à§�à¦¨à¦¿à¦°à§�à¦®à¦¾à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ 'Add Next Hierarchy Level' à¦¬à¦¾à¦Ÿà¦¨à§‡ à¦•à§�à¦²à¦¿à¦• à¦•à¦°à¦²à§‡ à¦®à§�à¦¯à¦¾à¦¨à§�à¦¯à¦¼à¦¾à¦²à¦¿ à¦¨à¦¾à¦® à¦Ÿà¦¾à¦‡à¦ª à¦•à¦°à¦¾à¦° à¦¬à¦¦à¦²à§‡ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦²à§‡à¦­à§‡à¦² à§¨ à¦�à¦° à¦ªà¦¦à¦¬à§€ à¦¨à¦¿à¦°à§�à¦¬à¦¾à¦šà¦¨ à¦•à¦°à¦¾à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "540",
    "date": "2026-10-01T17:42",
    "type": "Bug Fix",
    "module": "HR Reports",
    "descriptionEn": "Fixed PDF export modal prop mismatch (title to reportTitle) causing typescript errors across multiple HR report pages.",
    "descriptionBn": "à¦¨à¦¾à¦‡à¦Ÿ à¦•à¦¾à¦°à§�à¦¡ à¦�à¦¬à¦‚ à¦Ÿà¦¿à¦«à¦¿à¦¨ à¦•à¦¾à¦°à§�à¦¡ à¦�à¦° à¦®à¦¤ à¦¬à¦¿à¦­à¦¿à¦¨à§�à¦¨ à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà§‡ à¦ªà¦¿à¦¡à¦¿à¦�à¦« à¦¡à¦¾à¦‰à¦¨à¦²à§‹à¦¡ à¦•à¦°à¦¾à¦° à¦¸à¦®à§Ÿ à¦¯à§‡ à¦¸à¦®à¦¸à§�à¦¯à¦¾ à¦¹à¦šà§�à¦›à¦¿à¦² à¦¤à¦¾ à¦ à¦¿à¦• à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "539",
    "date": "2026-10-01T11:18",
    "type": "New Feature",
    "module": "HR Reports (Absent Counseling)",
    "link": "/hr-report-absent-counseling",
    "descriptionEn": "Implemented a new Absent Counseling Report page in the HR Reports section to manage, track, and export employee absentee reasons and HR/Welfare actions.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦¨à¦¤à§�à¦¨ Absent Counseling à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦•à¦°à§�à¦®à§€à¦¦à§‡à¦° à¦…à¦¨à§�à¦ªà¦¸à§�à¦¥à¦¿à¦¤à¦¿à¦° à¦•à¦¾à¦°à¦£ à¦�à¦¬à¦‚ à¦�à¦‡à¦šà¦†à¦° à¦¬à¦¾ à¦“à§Ÿà§‡à¦²à¦«à§‡à§Ÿà¦¾à¦° à¦Ÿà¦¿à¦®à§‡à¦° à¦—à§ƒà¦¹à§€à¦¤ à¦ªà¦¦à¦•à§�à¦·à§‡à¦ª à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "538",
    "date": "2026-10-01T11:14",
    "type": "New Feature",
    "module": "HR Reports (Continous Absent)",
    "link": "/hr-report-continuous-absent",
    "descriptionEn": "Implemented a new Continous Absent report page in the HR Reports section, enabling tracking of consecutive absentee streaks across all employees.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦¨à¦¤à§�à¦¨ Continous Absent à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦�à¦•à¦Ÿà¦¾à¦¨à¦¾ à¦…à¦¨à§�à¦ªà¦¸à§�à¦¥à¦¿à¦¤ à¦•à¦°à§�à¦®à§€à¦¦à§‡à¦° à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦�à¦¬à¦‚ à¦¦à¦¿à¦¨ à¦¸à¦‚à¦–à§�à¦¯à¦¾ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "537",
    "date": "2026-10-01T11:02",
    "type": "New Feature",
    "module": "HR Reports (Without In Out Attendance)",
    "link": "/hr-report-without-in-out-attendance",
    "descriptionEn": "Implemented a new Without In Out Attendance report page in the HR Reports section, allowing HR to identify employees missing either clock-in or clock-out punches.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦¨à¦¤à§�à¦¨ Without In Out Attendance à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨ à¦¥à§‡à¦•à§‡ à¦�à¦‡à¦šà¦†à¦° à¦‡à¦¨ à¦¬à¦¾ à¦†à¦‰à¦Ÿ à¦ªà¦¾à¦žà§�à¦š à¦®à¦¿à¦¸ à¦¹à¦“à§Ÿà¦¾ à¦•à¦°à§�à¦®à§€à¦¦à§‡à¦° à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦¦à§‡à¦–à¦¤à§‡ à¦“ à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "536",
    "date": "2026-10-01T10:55",
    "type": "New Feature",
    "module": "HR Reports (Attendance & Overtime)",
    "link": "/hr-report-attendance-and-overtime",
    "descriptionEn": "Implemented a new Attendance & Overtime report page in the HR Reports section, allowing users to view, filter, and export detailed in/out times and overtime hours for all employees.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦¨à¦¤à§�à¦¨ Attendance & Overtime à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨ à¦¥à§‡à¦•à§‡ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦°à¦¾ à¦¸à¦•à¦² à¦•à¦°à§�à¦®à§€à¦¦à§‡à¦° à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ à¦¦à¦¿à¦¨à§‡à¦° à¦ªà§�à¦°à¦¬à§‡à¦¶ à¦“ à¦ªà§�à¦°à¦¸à§�à¦¥à¦¾à¦¨à§‡à¦° à¦¸à¦®à§Ÿ à¦�à¦¬à¦‚ à¦“à¦­à¦¾à¦°à¦Ÿà¦¾à¦‡à¦® à¦¦à§‡à¦–à¦¤à§‡ à¦“ à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "535",
    "date": "2026-10-01T10:50",
    "type": "New Feature",
    "module": "HR Reports (Attendance Details)",
    "link": "/hr-report-attendance-details",
    "descriptionEn": "Implemented a new Attendance Details report page in the HR Reports section, allowing users to view, filter, and export detailed in/out times for all employees.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦¨à¦¤à§�à¦¨ Attendance Details à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨ à¦¥à§‡à¦•à§‡ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦°à¦¾ à¦¸à¦•à¦² à¦•à¦°à§�à¦®à§€à¦¦à§‡à¦° à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ à¦¦à¦¿à¦¨à§‡à¦° à¦ªà§�à¦°à¦¬à§‡à¦¶ à¦“ à¦ªà§�à¦°à¦¸à§�à¦¥à¦¾à¦¨à§‡à¦° à¦¸à¦®à§Ÿ à¦¦à§‡à¦–à¦¤à§‡ à¦“ à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "534",
    "date": "2026-10-01T10:36",
    "type": "New Feature",
    "module": "HR Reports (Attendance Details PrevAbsent)",
    "link": "/hr-report-attendance-details-prevabsent",
    "descriptionEn": "Implemented a new Attendance Details PrevAbsent report page in the HR Reports section, allowing users to view, filter, and export detailed in/out times for previously absent employees.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦¨à¦¤à§�à¦¨ Attendance Details PrevAbsent à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨ à¦¥à§‡à¦•à§‡ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦°à¦¾ à¦ªà§‚à¦°à§�à¦¬à§‡ à¦…à¦¨à§�à¦ªà¦¸à§�à¦¥à¦¿à¦¤ à¦¥à¦¾à¦•à¦¾ à¦•à¦°à§�à¦®à§€à¦¦à§‡à¦° à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ à¦¦à¦¿à¦¨à§‡à¦° à¦ªà§�à¦°à¦¬à§‡à¦¶ à¦“ à¦ªà§�à¦°à¦¸à§�à¦¥à¦¾à¦¨à§‡à¦° à¦¸à¦®à§Ÿ à¦¦à§‡à¦–à¦¤à§‡ à¦“ à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "533",
    "date": new Date().toISOString().slice(0, 16),
    "type": "New Feature",
    "module": "HR Reports (Separation List)",
    "link": "/hr-report-separation-list",
    "descriptionEn": "Implemented a new 'Separation List' report page in the HR Reports section, allowing users to view, filter, and export detailed employee separation records including designation, joining date, and action date.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦¨à¦¤à§�à¦¨ 'Separation List' à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨ à¦¥à§‡à¦•à§‡ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦°à¦¾ à¦ªà¦¦à¦¤à§�à¦¯à¦¾à¦— à¦¬à¦¾ à¦¸à§‡à¦ªà¦¾à¦°à§‡à¦¶à¦¨ à¦¹à¦“à§Ÿà¦¾ à¦•à¦°à§�à¦®à§€à¦¦à§‡à¦° à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦¤à¦¥à§�à¦¯ (à¦ªà¦¦à¦¬à¦¿, à¦¯à§‹à¦—à¦¦à¦¾à¦¨à§‡à¦° à¦¤à¦¾à¦°à¦¿à¦–, à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¡à§‡à¦Ÿ à¦‡à¦¤à§�à¦¯à¦¾à¦¦à¦¿) à¦¦à§‡à¦–à¦¤à§‡ à¦“ à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "532",
    "date": "2026-10-01T11:45",
    "type": "New Feature",
    "module": "HR Reports (Tiffin Card)",
    "link": "/hr-report-tiffin-card",
    "descriptionEn": "Implemented a new 'Tiffin Card' report page in the HR Reports section, allowing users to view, filter, and export individual employee tiffin duty records including in/out times, total hours, and net pay.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦¨à¦¤à§�à¦¨ 'Tiffin Card' à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨ à¦¥à§‡à¦•à§‡ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦°à¦¾ à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ à¦•à¦°à§�à¦®à§€à¦° à¦Ÿà¦¿à¦«à¦¿à¦¨ à¦¡à¦¿à¦‰à¦Ÿà¦¿à¦° à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦¤à¦¥à§�à¦¯ (à¦ªà§�à¦°à¦¬à§‡à¦¶/à¦ªà§�à¦°à¦¸à§�à¦¥à¦¾à¦¨à§‡à¦° à¦¸à¦®à§Ÿ, à¦®à§‹à¦Ÿ à¦˜à¦£à§�à¦Ÿà¦¾ à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¦à§‡à§Ÿ à¦…à¦°à§�à¦¥à§‡à¦° à¦ªà¦°à¦¿à¦®à¦¾à¦£) à¦¦à§‡à¦–à¦¤à§‡ à¦“ à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "531",
    "date": "2026-10-01T11:43",
    "type": "New Feature",
    "module": "HR Reports (Night Card)",
    "link": "/hr-report-night-card",
    "descriptionEn": "Implemented a new 'Night Card' report page in the HR Reports section, allowing users to view, filter, and export individual employee night duty records including in/out times, total hours, and net pay.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦¨à¦¤à§�à¦¨ 'Night Card' à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨ à¦¥à§‡à¦•à§‡ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦°à¦¾ à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ à¦•à¦°à§�à¦®à§€à¦° à¦¨à¦¾à¦‡à¦Ÿ à¦¡à¦¿à¦‰à¦Ÿà¦¿à¦° à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦¤à¦¥à§�à¦¯ (à¦ªà§�à¦°à¦¬à§‡à¦¶/à¦ªà§�à¦°à¦¸à§�à¦¥à¦¾à¦¨à§‡à¦° à¦¸à¦®à§Ÿ, à¦®à§‹à¦Ÿ à¦˜à¦£à§�à¦Ÿà¦¾ à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¦à§‡à§Ÿ à¦…à¦°à§�à¦¥à§‡à¦° à¦ªà¦°à¦¿à¦®à¦¾à¦£) à¦¦à§‡à¦–à¦¤à§‡ à¦“ à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "530",
    "date": "2026-10-01T11:42",
    "type": "New Feature",
    "module": "HR Reports (Tiffin Allowance All)",
    "link": "/hr-report-tiffin-allowance-all",
    "descriptionEn": "Implemented a new 'Tiffin Allowance All' report page in the HR Reports section, allowing users to view, filter, and export detailed tiffin allowance logs, total days, and net payable amounts for employees across various departments and sections.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦¨à¦¤à§�à¦¨ 'Tiffin Allowance All' à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨ à¦¥à§‡à¦•à§‡ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦°à¦¾ à¦¬à¦¿à¦­à¦¿à¦¨à§�à¦¨ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦�à¦¬à¦‚ à¦¸à§‡à¦•à¦¶à¦¨à§‡à¦° à¦•à¦°à§�à¦®à§€à¦¦à§‡à¦° à¦Ÿà¦¿à¦«à¦¿à¦¨ à¦…à§�à¦¯à¦¾à¦²à¦¾à¦‰à¦¨à§�à¦¸à§‡à¦° à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦¤à¦¥à§�à¦¯, à¦®à§‹à¦Ÿ à¦¦à¦¿à¦¨ à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¦à§‡à§Ÿ à¦…à¦°à§�à¦¥à§‡à¦° à¦ªà¦°à¦¿à¦®à¦¾à¦£ à¦¦à§‡à¦–à¦¤à§‡, à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦°à¦¤à§‡ à¦“ à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "529",
    "date": "2026-10-01T11:26",
    "type": "Bug Fix / System Stability",
    "module": "System Routing & Git Merge Conflict Resolution",
    "link": "/changes",
    "descriptionEn": "Resolved Git merge conflicts in changes tracking data and route definitions, preventing Vite runtime evaluation errors and restoring smooth navigation across the application.",
    "descriptionBn": "à¦šà§‡à¦žà§�à¦œà§‡à¦¸ à¦Ÿà§�à¦°à§�à¦¯à¦¾à¦•à¦¿à¦‚ à¦“ à¦°à¦¾à¦‰à¦Ÿ à¦¡à§‡à¦«à¦¿à¦¨à§‡à¦¶à¦¨à§‡à¦° à¦—à¦¿à¦Ÿ à¦®à¦¾à¦°à§�à¦œ à¦•à¦¨à¦«à§�à¦²à¦¿à¦•à§�à¦Ÿ à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦«à¦²à§‡ à¦­à¦¾à¦‡à¦Ÿ (Vite) à¦°à¦¾à¦¨à¦Ÿà¦¾à¦‡à¦® à¦�à¦°à¦° à¦¦à§‚à¦° à¦¹à§Ÿà§‡ à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦® à¦¸à§�à¦¬à¦¾à¦­à¦¾à¦¬à¦¿à¦•à¦­à¦¾à¦¬à§‡ à¦¸à¦šà¦² à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "528",
    "date": "2026-09-28T18:22",
    "type": "UI/UX & Card Simplification",
    "module": "Configure - Company Setup (Organogram Card Simplification)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Removed redundant 'Reports To' label and selector across the Designation Organogram: cards now cleanly focus directly on the designation name and title without cluttering reporting lines, and the 'Reports To' input was removed from the designation modal and table view.",
    "descriptionBn": "à¦ªà¦¦à¦¬à¦¿ à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦…à¦°à§�à¦—à§�à¦¯à¦¾à¦¨à§‹à¦—à§�à¦°à¦¾à¦® à¦•à¦¾à¦°à§�à¦¡ à¦¥à§‡à¦•à§‡ à¦…à¦ªà§�à¦°à¦¯à¦¼à§‹à¦œà¦¨à§€à¦¯à¦¼ 'Reports To' à¦²à§‡à¦–à¦¾ à¦“ à¦…à¦ªà¦¶à¦¨ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¬à¦¾à¦¦ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦�à¦–à¦¨ à¦•à¦¾à¦°à§�à¦¡à§‡ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦ªà¦¦à¦¬à¦¿à¦° à¦¨à¦¾à¦® (Designation Name) à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦° à¦“ à¦¸à§�à¦¨à§�à¦¦à¦°à¦­à¦¾à¦¬à§‡ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à§Ÿ, à¦�à¦¬à¦‚ à¦¡à§‡à¦¸à¦¿à¦—à¦¨à§‡à¦¶à¦¨ à¦®à¦¡à¦¾à¦² à¦“ à¦Ÿà§‡à¦¬à¦¿à¦² à¦­à¦¿à¦‰ à¦¥à§‡à¦•à§‡à¦“ 'Reports To' à¦«à¦¿à¦²à§�à¦¡à¦Ÿà¦¿ à¦…à¦ªà¦¸à¦¾à¦°à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "527",
    "date": "2026-09-28T18:10",
    "type": "UI/UX & Builder Ergonomics",
    "module": "Configure - Company Setup (Organogram Decluttering, Blank Canvas & Clear All)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Decluttered the Designation Organogram and introduced flexible blank canvas controls: 4-way directional add buttons and card toolbars are now cleanly hidden by default and revealed smoothly on hover (with a toolbar toggle to show all controls if desired), added a '+ Blank Canvas' action to initiate completely empty templates, added a dedicated 'Remove All' button to wipe/reset the active template's designations with confirmation, and provided an interactive Root Designation picker to place the starting role on an empty canvas.",
    "descriptionBn": "à¦ªà¦¦à¦¬à¦¿ à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦…à¦°à§�à¦—à§�à¦¯à¦¾à¦¨à§‹à¦—à§�à¦°à¦¾à¦® à¦¡à¦¾à§Ÿà¦¾à¦—à§�à¦°à¦¾à¦®à§‡à¦° à¦…à¦ªà§�à¦°à§Ÿà§‹à¦œà¦¨à§€à§Ÿ à¦œà¦Ÿà¦²à¦¾ à¦¦à§‚à¦° à¦•à¦°à§‡ à¦ªà¦°à¦¿à¦šà§�à¦›à¦¨à§�à¦¨ à¦­à¦¿à¦‰ à¦�à¦¬à¦‚ à¦¶à§‚à¦¨à§�à¦¯ à¦¥à§‡à¦•à§‡ à¦¨à¦¤à§�à¦¨ à¦šà¦¾à¦°à§�à¦Ÿ à¦¤à§ˆà¦°à¦¿à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦•à¦¾à¦°à§�à¦¡à§‡à¦° à¦šà¦¾à¦°à¦ªà¦¾à¦¶à§‡à¦° à§ªà¦Ÿà¦¿ à¦¡à¦¿à¦°à§‡à¦•à¦¶à¦¨à¦¾à¦² (+) à¦¬à¦¾à¦Ÿà¦¨ à¦�à¦¬à¦‚ à¦¨à¦¿à¦šà§‡à¦° à¦Ÿà§�à¦²à¦¬à¦¾à¦° à¦�à¦–à¦¨ à¦¸à¦¾à¦§à¦¾à¦°à¦£ à¦…à¦¬à¦¸à§�à¦¥à¦¾à§Ÿ à¦²à§�à¦•à¦¿à§Ÿà§‡ à¦¥à¦¾à¦•à¦¬à§‡ à¦�à¦¬à¦‚ à¦®à¦¾à¦‰à¦¸ à¦¹à§‹à¦­à¦¾à¦° à¦•à¦°à¦²à§‡à¦‡ à¦®à¦¸à§ƒà¦£à¦­à¦¾à¦¬à§‡ à¦­à§‡à¦¸à§‡ à¦‰à¦ à¦¬à§‡ (à¦ªà§�à¦°à§Ÿà§‹à¦œà¦¨à§‡ à¦¸à¦¬ à¦¬à¦¾à¦Ÿà¦¨ à¦¦à§ƒà¦¶à§�à¦¯à¦®à¦¾à¦¨ à¦°à¦¾à¦–à¦¾à¦° à¦Ÿà¦—à¦² à¦…à¦ªà¦¶à¦¨à¦“ à¦°à§Ÿà§‡à¦›à§‡), à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦–à¦¾à¦²à¦¿ à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿ à¦¤à§ˆà¦°à¦¿à¦° à¦œà¦¨à§�à¦¯ '+ Blank Canvas' à¦¬à§‹à¦¤à¦¾à¦® à¦�à¦¬à¦‚ à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿ à¦®à¦¡à¦¾à¦²à§‡ à¦¸à§�à¦ªà¦·à§�à¦Ÿ à¦šà§Ÿà§‡à¦¸ à¦•à¦¾à¦°à§�à¦¡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¬à¦°à§�à¦¤à¦®à¦¾à¦¨ à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿà§‡à¦° à¦¸à¦¬ à¦ªà¦¦à¦¬à¦¿ à¦�à¦•à¦¸à¦¾à¦¥à§‡ à¦®à§�à¦›à§‡ à¦«à§‡à¦²à¦¾à¦° à¦œà¦¨à§�à¦¯ 'Remove All' à¦…à¦ªà¦¶à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦�à¦¬à¦‚ à¦¶à§‚à¦¨à§�à¦¯ à¦•à§�à¦¯à¦¾à¦¨à¦­à¦¾à¦¸à§‡ à¦ªà§�à¦°à¦¥à¦® à¦¶à§€à¦°à§�à¦· à¦ªà¦¦à¦¬à¦¿ (Level 1 Root) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾à¦° à¦‰à¦ªà¦¯à§‹à¦—à§€ à¦ªà¦¿à¦•à¦¾à¦° à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦® à¦šà¦¾à¦²à§� à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "526",
    "date": "2026-09-28T17:52",
    "type": "UI/UX & Design Beautification",
    "module": "Configure - Company Setup (Organogram Beautification & Compact Layout)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Refined and beautified the Designation Organogram with an ultra-compact, high-density executive aesthetic: tightened card padding, streamlined card dimensions (185-195px multi-role, 210-260px single-role), subtle level badges, sleek 4-way micro directional add buttons (+ Above, + Below, â—„+, +â–º), compact branching & converging connection rails, modernized template directory table, and a space-efficient directional picker modal.",
    "descriptionBn": "à¦ªà¦¦à¦¬à¦¿ à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦…à¦°à§�à¦—à§�à¦¯à¦¾à¦¨à§‹à¦—à§�à¦°à¦¾à¦® à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾à¦•à§‡ à¦†à¦°à¦“ à¦†à¦•à¦°à§�à¦·à¦£à§€à§Ÿ, à¦¸à§�à¦²à¦¿à¦• à¦�à¦¬à¦‚ à¦†à¦²à§�à¦Ÿà§�à¦°à¦¾-à¦•à¦®à§�à¦ªà§�à¦¯à¦¾à¦•à§�à¦Ÿ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦•à¦¾à¦°à§�à¦¡à§‡à¦° à¦¸à¦¾à¦‡à¦œ à¦“ à¦ªà§�à¦¯à¦¾à¦¡à¦¿à¦‚ à¦¸à§�à¦·à¦® à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦•à¦¾à¦°à§�à¦¡à§‡à¦° à¦šà¦¾à¦°à¦ªà¦¾à¦¶à§‡à¦° à§ªà¦Ÿà¦¿ à¦¡à¦¿à¦°à§‡à¦•à¦¶à¦¨à¦¾à¦² (+) à¦¬à¦¾à¦Ÿà¦¨à¦•à§‡ à¦†à¦§à§�à¦¨à¦¿à¦• à¦®à¦¾à¦‡à¦•à§�à¦°à§‹-à¦ªà¦¿à¦² à¦†à¦•à¦¾à¦°à§‡ à¦¨à¦¿à¦–à§�à¦�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦•à¦¾à¦¨à§‡à¦•à§�à¦Ÿà¦¿à¦‚ à¦°à§‡à¦² à¦“ à¦…à§�à¦¯à¦¾à¦°à§‹à¦—à§�à¦²à§‹à¦•à§‡ à¦ªà¦°à¦¿à¦®à¦¿à¦¤ à¦‰à¦šà§�à¦šà¦¤à¦¾à§Ÿ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡, à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿ à¦¡à¦¿à¦°à§‡à¦•à§�à¦Ÿà¦°à¦¿ à¦Ÿà§‡à¦¬à¦¿à¦²à¦•à§‡ à¦•à¦®à§�à¦ªà§�à¦¯à¦¾à¦•à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦ªà¦¦à¦¬à¦¿ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° à¦ªà¦ªà¦†à¦ª à¦®à¦¡à¦¾à¦²à¦Ÿà¦¿à¦•à§‡ à¦†à¦°à¦“ à¦¦à§ƒà¦·à§�à¦Ÿà¦¿à¦¨à¦¨à§�à¦¦à¦¨ à¦“ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦¬à¦¾à¦¨à§�à¦§à¦¬ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "525",
    "date": "2026-09-28T17:48",
    "type": "Feature Enhancement & Interactive Builder",
    "module": "Configure - Company Setup (Organogram Templates & Directional Builder)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Implemented interactive Template Table View and 4-way Directional Add (+) buttons for the Designation Organogram. Templates can now be managed in a list view with quick active/inactive toggles, direct diagram view & edit, clone, and deletion. In the diagram builder, every designation card features directional add options (+ Above, + Below, + Left, + Right). Clicking any direction opens a remaining designations picker modal to quickly select and place unassigned designations or create custom ones directly into the hierarchy.",
    "descriptionBn": "à¦…à¦°à§�à¦—à§�à¦¯à¦¾à¦¨à§‹à¦—à§�à¦°à¦¾à¦® à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿà¦—à§�à¦²à§‹à¦° à¦œà¦¨à§�à¦¯ à¦²à¦¿à¦¸à§�à¦Ÿ/à¦Ÿà§‡à¦¬à¦¿à¦² à¦­à¦¿à¦‰ à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦ªà¦¦à¦¬à¦¿ à¦•à¦¾à¦°à§�à¦¡à§‡à¦° à§ª à¦¦à¦¿à¦•à§‡à¦‡ (à¦‰à¦ªà¦°à§‡, à¦¨à¦¿à¦šà§‡, à¦¡à¦¾à¦¨à§‡, à¦¬à¦¾à¦®à§‡) à¦¡à¦¿à¦°à§‡à¦•à¦¶à¦¨à¦¾à¦² à¦¯à§‹à¦— (+) à¦…à¦ªà¦¶à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦Ÿà§‡à¦¬à¦¿à¦² à¦­à¦¿à¦‰ à¦¥à§‡à¦•à§‡ à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿ à¦¸à¦¹à¦œà§‡ à¦�à¦• à¦•à§�à¦²à¦¿à¦•à§‡ à¦�à¦•à¦Ÿà¦¿à¦­/à¦‡à¦¨-à¦�à¦•à¦Ÿà¦¿à¦­ à¦•à¦°à¦¾ à¦�à¦¬à¦‚ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦¡à¦¾à§Ÿà¦¾à¦—à§�à¦°à¦¾à¦® à¦¦à§‡à¦–à§‡ à¦�à¦¡à¦¿à¦Ÿ à¦•à¦°à¦¾ à¦¯à¦¾à§Ÿà¥¤ à¦¡à¦¾à§Ÿà¦¾à¦—à§�à¦°à¦¾à¦®à§‡ à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦ªà¦¦à¦¬à¦¿à¦° à¦šà¦¾à¦°à¦ªà¦¾à¦¶à§‡ à¦¥à¦¾à¦•à¦¾ (+â–² à¦‰à¦ªà¦°à§‡, +â–¼ à¦¨à¦¿à¦šà§‡, â—„+ à¦¬à¦¾à¦®à§‡, +â–º à¦¡à¦¾à¦¨à§‡) à¦¬à¦¾à¦Ÿà¦¨à§‡ à¦•à§�à¦²à¦¿à¦• à¦•à¦°à¦²à§‡à¦‡ à¦¬à¦¾à¦•à¦¿ à¦¥à¦¾à¦•à¦¾ à¦ªà¦¦à¦¬à¦¿à¦—à§�à¦²à§‹à¦° à¦²à¦¿à¦¸à§�à¦Ÿ à¦šà¦²à§‡ à¦†à¦¸à§‡, à¦¯à§‡à¦–à¦¾à¦¨ à¦¥à§‡à¦•à§‡ à¦ªà¦›à¦¨à§�à¦¦à¦®à¦¤à§‹ à¦ªà¦¦à¦¬à¦¿ à¦¨à¦¿à¦°à§�à¦¬à¦¾à¦šà¦¨ à¦•à¦°à§‡ à¦¸à¦¾à¦¥à§‡ à¦¸à¦¾à¦¥à§‡ à¦•à¦¾à¦™à§�à¦•à§�à¦·à¦¿à¦¤ à¦¸à§�à¦¥à¦¾à¦¨à§‡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¯à¦¾à§Ÿà¥¤"
  },
  {
    "id": "524",
    "date": "2026-09-28T17:35",
    "type": "Feature Enhancement & Architecture",
    "module": "Configure - Company Setup (Designation Organogram & Templates)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Replaced department-dependent organograms with a pure designation-based organogram system powered by dynamic templates. Features the exact corporate hierarchy (Board of Directors -> CEO -> parallel side-by-side CXOs [COO, CFO, CTO, CMO, CHRO] with branching and converging connector rails -> GM -> DGM -> AGM -> Senior Manager -> Manager -> Deputy Manager -> Assistant Manager -> Executive -> Officer), template active/inactive toggling, template duplication, custom template creation, and full persistent storage.",
    "descriptionBn": "à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦ªà§�à¦°à§Ÿà§‹à¦œà¦¨à§€à§Ÿà¦¤à¦¾ à¦¬à¦¾à¦¦ à¦¦à¦¿à§Ÿà§‡ à¦ªà§�à¦°à§‹à¦ªà§�à¦°à¦¿ à¦ªà¦¦à¦¬à¦¿ (Designation) à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦¡à¦¾à§Ÿà¦¨à¦¾à¦®à¦¿à¦• à¦…à¦°à§�à¦—à§�à¦¯à¦¾à¦¨à§‹à¦—à§�à¦°à¦¾à¦® à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦šà¦¾à¦²à§� à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾ à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿ à¦†à¦•à¦¾à¦°à§‡ à¦•à¦¾à¦œ à¦•à¦°à§‡à¥¤ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦° à¦šà¦¾à¦¹à¦¿à¦¦à¦¾ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¹à§�à¦¬à¦¹à§� à¦¹à¦¾à§Ÿà¦¾à¦°à¦¾à¦°à§�à¦•à¦¿ (Board of Directors -> CEO -> à¦ªà¦¾à¦¶à¦¾à¦ªà¦¾à¦¶à¦¿ CXO [COO, CFO, CTO, CMO, CHRO] à¦¬à§�à¦°à¦¾à¦žà§�à¦šà¦¿à¦‚ à¦“ à¦•à¦¨à¦­à¦¾à¦°à§�à¦œà¦¿à¦‚ à¦•à¦¾à¦¨à§‡à¦•à§�à¦Ÿà¦°à¦¸à¦¹ -> GM -> DGM -> AGM -> Senior Manager -> Manager -> Deputy Manager -> Assistant Manager -> Executive -> Officer) à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿ à¦�à¦•à¦Ÿà¦¿ à¦•à§�à¦²à¦¿à¦•à§‡à¦‡ à¦�à¦•à¦Ÿà¦¿à¦­ à¦¬à¦¾ à¦‡à¦¨-à¦�à¦•à¦Ÿà¦¿à¦­ à¦•à¦°à¦¾ à¦¯à¦¾à§Ÿ, à¦¨à¦¤à§�à¦¨ à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿ à¦¤à§ˆà¦°à¦¿ à¦“ à¦•à§�à¦²à§‹à¦¨ à¦•à¦°à¦¾ à¦¯à¦¾à§Ÿà¥¤"
  },
  {
    "id": "523",
    "date": "2026-09-28T17:05",
    "type": "Feature Enhancement",
    "module": "Configure - Company Setup (Designation & Organogram)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Enhanced the Organogram with a dynamic multi-department side-by-side branch structure: root CEO/MD leadership trunk with horizontal distribution rail, side-by-side department column cards with â—„ â–º horizontal reorder controls, multi-select department filter pills, department-specific color themes, and within-department side-by-side role positioning.",
    "descriptionBn": "à¦…à¦°à§�à¦—à§�à¦¯à¦¾à¦¨à§‹à¦—à§�à¦°à¦¾à¦® à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾à¦•à§‡ à¦¡à¦¾à§Ÿà¦¨à¦¾à¦®à¦¿à¦• à¦®à¦¾à¦²à§�à¦Ÿà¦¿-à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦¸à¦¾à¦‡à¦¡-à¦¬à¦¾à¦‡-à¦¸à¦¾à¦‡à¦¡ à¦¬à§�à¦°à¦¾à¦žà§�à¦š à¦•à¦¾à¦ à¦¾à¦®à§‹à¦° à¦¸à¦¾à¦¥à§‡ à¦†à¦°à¦“ à¦‰à¦¨à§�à¦¨à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¶à§€à¦°à§�à¦· à¦¸à¦¿à¦‡à¦“/à¦�à¦®à¦¡à¦¿ à¦¨à§‹à¦¡à§‡à¦° à¦¨à¦¿à¦šà§‡ à¦…à¦¨à§�à¦­à§‚à¦®à¦¿à¦• à¦¡à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿à¦¬à¦¿à¦‰à¦¶à¦¨ à¦°à§‡à¦², à¦ªà¦¾à¦¶à¦¾à¦ªà¦¾à¦¶à¦¿ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦•à¦²à¦¾à¦® à¦•à¦¾à¦°à§�à¦¡, â—„ â–º à¦¬à¦¾à¦Ÿà¦¨ à¦¦à¦¿à§Ÿà§‡ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿà¦—à§�à¦²à§‹à¦° à¦…à¦¬à¦¸à§�à¦¥à¦¾à¦¨ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨, à¦®à¦¾à¦²à§�à¦Ÿà¦¿-à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦ªà¦¿à¦²à¦¸ à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ à¦•à¦¾à¦²à¦¾à¦° à¦¥à¦¿à¦® à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "522",
    "date": "2026-09-28T17:00",
    "type": "New Feature & UI Component",
    "module": "Configure - Company Setup (Designation & Organogram)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Added a dedicated 'Designation & Organogram' tab under Company Setup. Introduced multi-level hierarchy rank and side-by-side horizontal position controls for designations sharing the same level (e.g. CMO, CTO, CFO at Level 2). Included interactive Organogram Chart View, List View, department filtering, quick level/position controls, and full persistent storage.",
    "descriptionBn": "à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿ à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸à§‡ 'Designation & Organogram' à¦¨à¦¾à¦®à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ à¦Ÿà§�à¦¯à¦¾à¦¬ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦•à¦‡ à¦²à§‡à¦­à§‡à¦²à§‡à¦° à¦ªà¦¦à¦¬à¦¿à¦—à§�à¦²à§‹à¦•à§‡ (à¦¯à§‡à¦®à¦¨ CMO, CTO, CFO) à¦ªà¦¾à¦¶à¦¾à¦ªà¦¾à¦¶à¦¿ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¨ à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦®à¦¾à¦²à§�à¦Ÿà¦¿-à¦²à§‡à¦­à§‡à¦² à¦°à§�à¦¯à¦¾à¦‚à¦• à¦“ à¦¸à¦¾à¦‡à¦¡-à¦¬à¦¾à¦‡-à¦¸à¦¾à¦‡à¦¡ à¦ªà¦œà¦¿à¦¶à¦¨ à¦•à¦¨à§�à¦Ÿà§�à¦°à§‹à¦² à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦¸à¦¾à¦¥à§‡ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à¦…à§�à¦¯à¦¾à¦•à§�à¦Ÿà¦¿à¦­ à¦…à¦°à§�à¦—à§�à¦¯à¦¾à¦¨à§‹à¦—à§�à¦°à¦¾à¦® à¦šà¦¾à¦°à§�à¦Ÿ à¦­à¦¿à¦‰, à¦²à¦¿à¦¸à§�à¦Ÿ à¦­à¦¿à¦‰ à¦�à¦¬à¦‚ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à¦¿à¦‚ à¦¯à§�à¦•à§�à¦¤ à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "521",
    "date": "2026-09-28T15:58",
    "type": "Print Fix",
    "module": "Global & Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Fixed floating AI Chatbot widget appearing on printed pages by applying print:hidden to the root chatbot container, adding global @media print display: none rules, and explicitly excluding fixed bottom-right floating widgets from print outputs.",
    "descriptionBn": "à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦•à¦°à¦¾à¦° à¦¸à¦®à§Ÿ à¦ªà¦¾à¦¤à¦¾à¦° à¦¨à¦¿à¦šà§‡à¦° à¦¡à¦¾à¦¨ à¦•à§‹à¦¨à¦¾à§Ÿ à¦­à§‡à¦¸à§‡ à¦¥à¦¾à¦•à¦¾ à¦�à¦†à¦‡ à¦šà§�à¦¯à¦¾à¦Ÿà¦¬à¦Ÿ à¦†à¦‡à¦•à¦¨ à¦šà¦²à§‡ à¦†à¦¸à¦¾à¦° à¦¸à¦®à¦¸à§�à¦¯à¦¾à¦Ÿà¦¿ à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦šà§�à¦¯à¦¾à¦Ÿà¦¬à¦Ÿà§‡à¦° à¦°à§�à¦Ÿ à¦�à¦²à¦¿à¦®à§‡à¦¨à§�à¦Ÿà§‡ print:hidden à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦—à§�à¦²à§‹à¦¬à¦¾à¦² à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦¸à¦¿à¦�à¦¸à¦�à¦¸-à¦� à¦�à¦Ÿà¦¿ à¦ªà§�à¦°à§‹à¦ªà§�à¦°à¦¿ à¦¹à¦¾à¦‡à¦¡ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "520",
    "date": "2026-09-28T15:56",
    "type": "UI & Typography Standardization",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Standardized and harmonized all font sizes across the Final Settlement Sheet: aligned section titles uniformly to 11px, box and table headers to 10px bold, data rows and values to 10px, subtotals to 10px with consistent 2-decimal formatting, and balanced Grand Total banner elements at 11px to eliminate disproportionate text.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦¶à¦¿à¦Ÿà§‡à¦° à¦¸à¦®à¦¸à§�à¦¤ à¦«à¦¨à§�à¦Ÿ à¦¸à¦¾à¦‡à¦œ à¦¸à¦¾à¦®à¦žà§�à¦œà¦¸à§�à¦¯à¦ªà§‚à¦°à§�à¦£ à¦“ à¦¸à§�à¦·à¦® à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦¸à§‡à¦•à¦¶à¦¨ à¦Ÿà¦¾à¦‡à¦Ÿà§‡à¦² à§§à§§ à¦ªà¦¿à¦•à§�à¦¸à§‡à¦², à¦Ÿà§‡à¦¬à¦¿à¦² à¦“ à¦¬à¦•à§�à¦¸à§‡à¦° à¦¹à§‡à¦¡à¦¾à¦° à§§à§¦ à¦ªà¦¿à¦•à§�à¦¸à§‡à¦² à¦¬à§‹à¦²à§�à¦¡, à¦¸à¦•à¦² à¦°à§‹ à¦“ à¦Ÿà¦¾à¦•à¦¾à¦° à¦®à¦¾à¦¨ à§§à§¦ à¦ªà¦¿à¦•à§�à¦¸à§‡à¦² à¦�à¦¬à¦‚ à¦—à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦Ÿà§‹à¦Ÿà¦¾à¦² à¦¬à§�à¦¯à¦¾à¦¨à¦¾à¦°à¦•à§‡ à¦¸à¦®à¦¾à¦¨ à§§à§§ à¦ªà¦¿à¦•à§�à¦¸à§‡à¦²à§‡ à¦¸à§�à¦¬à¦¿à¦¨à§�à¦¯à¦¸à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦•à§‹à¦¨à§‹ à¦²à§‡à¦–à¦¾ à¦…à¦¸à¦™à§�à¦—à¦¤à¦­à¦¾à¦¬à§‡ à¦¬à§œ à¦¬à¦¾ à¦›à§‹à¦Ÿ à¦¨à¦¾ à¦¦à§‡à¦–à¦¾à§Ÿà¥¤"
  },
  {
    "id": "519",
    "date": "2026-09-28T15:52",
    "type": "UI & Typography Update",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Enforced Inter font across the entire Final Settlement Sheet, ensuring all numbers, currency values, codes, and figures use Inter instead of monospace. Pinned the signatures block strictly to the bottom of the sheet across all screen heights and single-page print outputs.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦¶à¦¿à¦Ÿà§‡à¦° à¦¸à¦®à¦¸à§�à¦¤ à¦«à¦¨à§�à¦Ÿ (à¦¸à¦¬ à¦¨à¦®à§�à¦¬à¦°, à¦Ÿà¦¾à¦•à¦¾à¦° à¦ªà¦°à¦¿à¦®à¦¾à¦£ à¦“ à¦•à§‹à¦¡à¦¸à¦¹) 'Inter' à¦«à¦¨à§�à¦Ÿà§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¸à§�à¦¬à¦¾à¦•à§�à¦·à¦°à§‡à¦° à¦…à¦‚à¦¶à¦Ÿà¦¿ à¦ªà¦¾à¦¤à¦¾à¦° à¦�à¦•à§‡à¦¬à¦¾à¦°à§‡ à¦¨à¦¿à¦šà§‡ à¦ªà¦¿à¦¨ à¦•à¦°à§‡ à¦°à¦¾à¦–à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦®à¦¾à¦�à¦–à¦¾à¦¨à§‡ à¦«à¦¾à¦�à¦•à¦¾ à¦œà¦¾à§Ÿà¦—à¦¾ à¦¥à¦¾à¦•à¦²à§‡à¦“ à¦¸à§�à¦¬à¦¾à¦•à§�à¦·à¦° à¦¸à¦¬à¦¸à¦®à§Ÿ à¦¨à¦¿à¦šà§‡ à¦…à¦¬à¦¸à§�à¦¥à¦¾à¦¨ à¦•à¦°à§‡à¥¤"
  },
  {
    "id": "518",
    "date": "2026-09-28T15:43",
    "type": "Print Optimization",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Optimized single A4 print layout for Final Settlement Sheet: expanded top margin above management signatures (mt-14/print:mt-16), increased signature clearance height (h-20/print:h-22 and h-18/print:h-20), and widened inter-tier row spacing (mt-14/print:mt-16) to eliminate bottom whitespace while ensuring single-page print-to-fit compliance.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦¶à¦¿à¦Ÿà§‡à¦° à¦¸à¦¿à¦™à§�à¦—à§‡à¦² A4 à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦²à§‡à¦†à¦‰à¦Ÿ à¦¨à¦¿à¦–à§�à¦�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦°à§‡à¦° à¦‰à¦ªà¦°à§‡à¦° à¦®à¦¾à¦°à§�à¦œà¦¿à¦¨, à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦•à¦°à¦¾à¦° à¦¸à§�à¦ªà§‡à¦¸ à¦¹à¦¾à¦‡à¦Ÿ à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¥à¦® à¦“ à¦¦à§�à¦¬à¦¿à¦¤à§€à§Ÿ à¦¸à¦¾à¦°à¦¿à¦° à¦®à¦¾à¦�à§‡à¦° à¦«à¦¾à¦�à¦•à¦¾ à¦œà¦¾à§Ÿà¦—à¦¾ à¦¬à§ƒà¦¦à§�à¦§à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦«à¦²à§‡ à¦ªà¦¾à¦¤à¦¾à¦° à¦¨à¦¿à¦šà§‡à¦° à¦«à¦¾à¦�à¦•à¦¾ à¦œà¦¾à§Ÿà¦—à¦¾ à¦¸à§�à¦·à¦®à¦­à¦¾à¦¬à§‡ à¦ªà§‚à¦°à¦£ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¸à¦¿à¦™à§�à¦—à§‡à¦² A4 à¦ªà§‡à¦œà§‡ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿà¦“ à¦¨à¦¿à¦–à§�à¦�à¦¤ à¦¬à¦œà¦¾à§Ÿ à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "517",
    "date": "2026-09-28T15:42",
    "type": "UI Layout Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Separated 'Earning Sectors' and 'Deduction Sectors' into independent bordered boxes with a clean margin gap, resolving the cramped layout where the Total Earning summary was directly attached to the Deduction Sectors header.",
    "descriptionBn": "'Payment Info' à¦�à¦° à¦­à§‡à¦¤à¦°à§‡ 'Earning Sectors' à¦�à¦¬à¦‚ 'Deduction Sectors'-à¦•à§‡ à¦¦à§�à¦Ÿà¦¿ à¦ªà§ƒà¦¥à¦• à¦¬à¦°à§�à¦¡à¦¾à¦°à§�à¦¡ à¦¬à¦•à§�à¦¸à§‡ à¦­à¦¾à¦— à¦•à¦°à§‡ à¦®à¦¾à¦�à§‡ à¦®à¦¾à¦°à§�à¦œà¦¿à¦¨ à¦—à§�à¦¯à¦¾à¦ª à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦«à¦²à§‡ Total Earning à¦�à¦¬à¦‚ Deduction Sectors à¦�à¦•à§‡ à¦…à¦ªà¦°à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦²à§‡à¦—à§‡ à¦¨à¦¾ à¦¥à§‡à¦•à§‡ à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦°à¦­à¦¾à¦¬à§‡ à¦†à¦²à¦¾à¦¦à¦¾ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à¦šà§�à¦›à§‡à¥¤"
  },
  {
    "id": "516",
    "date": "2026-09-28T15:40",
    "type": "UI Layout Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Re-architected Final Settlement Sheet header: removed company address, aligned 'FINAL SETTLEMENT SHEET' title to the exact center between the logo and portrait, and resized the employee photo frame (66px Ã— 82px) for a balanced professional appearance.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦¶à¦¿à¦Ÿà§‡à¦° à¦¹à§‡à¦¡à¦¾à¦° à¦¸à§‡à¦•à¦¶à¦¨ à¦¥à§‡à¦•à§‡ à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿à¦° à¦ à¦¿à¦•à¦¾à¦¨à¦¾ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¬à¦¾à¦¦ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡, 'FINAL SETTLEMENT SHEET' à¦Ÿà¦¾à¦‡à¦Ÿà§‡à¦²à¦Ÿà¦¿ à¦²à§‹à¦—à§‹ à¦“ à¦›à¦¬à¦¿à¦° à¦®à¦¾à¦�à¦–à¦¾à¦¨à§‡ à¦¸à§‡à¦¨à§�à¦Ÿà¦¾à¦° à¦…à§�à¦¯à¦¾à¦²à¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿à¦° à¦›à¦¬à¦¿à¦° à¦«à§�à¦°à§‡à¦®à§‡à¦° à¦¸à¦¾à¦‡à¦œ à¦ªà§�à¦°à§Ÿà§‹à¦œà¦¨ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦•à¦¿à¦›à§�à¦Ÿà¦¾ à¦¬à§œ (66px Ã— 82px) à¦•à¦°à§‡ à¦­à¦¾à¦°à¦¸à¦¾à¦®à§�à¦¯à¦ªà§‚à¦°à§�à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "515",
    "date": "2026-09-28T15:39",
    "type": "UI Consistency",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Updated section heading colors for 'Earn Leave Details', 'Service Benefit Details', and 'Compensation Details' to match 'Payment Info' theme green (#4caf50), ensuring uniform visual branding across all settlement breakdown quadrants.",
    "descriptionBn": "'Earn Leave Details', 'Service Benefit Details' à¦�à¦¬à¦‚ 'Compensation Details' à¦¸à§‡à¦•à¦¶à¦¨ à¦¹à§‡à¦¡à¦¾à¦°à¦—à§�à¦²à§‹à¦° à¦•à¦¾à¦²à¦¾à¦° 'Payment Info' à¦�à¦° à¦®à¦¤à§‹ à¦�à¦•à¦‡ à¦¬à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦¥à¦¿à¦® à¦—à§�à¦°à¦¿à¦¨ (#4caf50) à¦•à¦¾à¦²à¦¾à¦°à§‡ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "514",
    "date": "2026-09-28T15:37",
    "type": "UI Layout Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Reformatted Final Settlement Sheet header: removed duplicate 'Pakiza Software Limited' text header, placed the official logo directly on top followed vertically by the company address and 'FINAL SETTLEMENT SHEET' title, and reduced employee portrait photo frame dimensions for a cleaner compact layout.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦¶à¦¿à¦Ÿà§‡à¦° à¦¹à§‡à¦¡à¦¾à¦° à¦¸à§‡à¦•à¦¶à¦¨ à¦°à¦¿à¦«à¦°à¦®à§�à¦¯à¦¾à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ 'Pakiza Software Limited' à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦¸à¦°à¦¿à§Ÿà§‡ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° à¦²à§‹à¦—à§‹ à¦°à¦¾à¦–à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦²à§‹à¦—à§‹à¦° à¦ à¦¿à¦• à¦¨à¦¿à¦šà§‡ à¦•à§�à¦°à¦®à¦¾à¦¨à§�à¦¬à§Ÿà§‡ à¦ à¦¿à¦•à¦¾à¦¨à¦¾ à¦“ 'FINAL SETTLEMENT SHEET' à¦¶à¦¿à¦°à§‹à¦¨à¦¾à¦® à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦ªà¦¾à¦¶à¦¾à¦ªà¦¾à¦¶à¦¿ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿à¦° à¦›à¦¬à¦¿à¦° à¦¸à¦¾à¦‡à¦œ à¦†à¦°à¦“ à¦›à§‹à¦Ÿ à¦“ à¦ªà¦°à¦¿à¦ªà¦¾à¦Ÿà¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "513",
    "date": "2026-09-28T15:36",
    "type": "UI / Print Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Enhanced the Grand Total section in Final Settlement Sheet into a full-width colored banner containing Bangladeshi Taka In Words on the left and Grand Total amount on the right. Increased vertical spacing and height for management signature rows to provide proper clearance while maintaining single A4 page print-to-fit layout.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦¶à¦¿à¦Ÿà§‡ à¦—à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦Ÿà§‹à¦Ÿà¦¾à¦² à¦¸à§‡à¦•à¦¶à¦¨à¦Ÿà¦¿à¦•à§‡ à¦ªà§�à¦°à§‹ à¦‰à¦‡à¦¡à¦¥ à¦œà§�à§œà§‡ à¦�à¦•à¦• à¦•à¦¾à¦²à¦¾à¦°à§‡à¦° à¦¬à§�à¦¯à¦¾à¦¨à¦¾à¦°à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦¬à¦¾à¦® à¦ªà¦¾à¦¶à§‡ à¦Ÿà¦¾à¦•à¦¾à§Ÿ à¦•à¦¥à¦¾à§Ÿ (In Words) à¦�à¦¬à¦‚ à¦¡à¦¾à¦¨ à¦ªà¦¾à¦¶à§‡ à¦—à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦Ÿà§‹à¦Ÿà¦¾à¦² à¦…à§�à¦¯à¦¾à¦®à¦¾à¦‰à¦¨à§�à¦Ÿ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à¦šà§�à¦›à§‡à¥¤ à¦�à¦›à¦¾à§œà¦¾ à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦®à§‡à¦¨à§�à¦Ÿ à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦¸à§‡à¦•à¦¶à¦¨à§‡à¦° à¦‰à¦ªà¦°-à¦¨à¦¿à¦š à¦®à¦¾à¦°à§�à¦œà¦¿à¦¨ à¦“ à¦¹à¦¾à¦‡à¦Ÿ à¦¬à¦¾à§œà¦¿à§Ÿà§‡ à¦ªà¦°à§�à¦¯à¦¾à¦ªà§�à¦¤ à¦«à¦¾à¦�à¦•à¦¾ à¦œà¦¾à§Ÿà¦—à¦¾ (proper gap) à¦¨à¦¿à¦¶à§�à¦šà¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦¸à¦¿à¦™à§�à¦—à§‡à¦² A4 à¦ªà§‡à¦œà§‡ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿà¦“ à¦¨à¦¿à¦–à§�à¦�à¦¤ à¦¥à¦¾à¦•à§‡à¥¤"
  },
  {
    "id": "512",
    "date": "2026-09-28T15:32",
    "type": "UI Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Integrated official Pakiza client logo (client_logo.png) into the Final Settlement Sheet header for both the detailed settlement view (/final-settlement) and settlement report printable statement modal (/final-settlement-report).",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦¶à¦¿à¦Ÿà§‡à¦° à¦¹à§‡à¦¡à¦¾à¦° à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦…à¦«à¦¿à¦¸à¦¿à§Ÿà¦¾à¦² à¦ªà¦¾à¦•à¦¿à¦œà¦¾ à¦•à§�à¦²à¦¾à¦¯à¦¼à§‡à¦¨à§�à¦Ÿ à¦²à§‹à¦—à§‹ (client_logo.png) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰ (/final-settlement) à¦�à¦¬à¦‚ à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦¸à§�à¦Ÿà§‡à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦ªà§�à¦°à¦¿à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦² (/final-settlement-report) à¦‰à¦­à§Ÿ à¦¸à§�à¦¥à¦¾à¦¨à§‡ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à¦¬à§‡à¥¤"
  },
  {
    "id": "511b",
    "date": "2026-09-28T15:35",
    "type": "Bug Fix / Routing",
    "module": "Conference Room Booking List",
    "link": "/conference-room-booking-list",
    "descriptionEn": "Fixed TanStack Router Route export in conference-room-booking-list.tsx enabling the route to compile and render properly at http://localhost:3000/conference-room-booking-list.",
    "descriptionBn": "conference-room-booking-list.tsx à¦«à¦¾à¦‡à¦²à§‡ TanStack à¦°à§�à¦Ÿ à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§�à¦¨à¦ƒà¦¸à¦‚à¦¯à§‹à¦œà¦¨ à¦•à¦°à§‡ à¦°à¦¾à¦‰à¦Ÿà¦¿à¦‚ à¦«à¦¿à¦•à§�à¦¸ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦«à¦²à§‡ http://localhost:3000/conference-room-booking-list à¦ªà§‡à¦œà¦Ÿà¦¿ à¦¯à¦¥à¦¾à¦¯à¦¥à¦­à¦¾à¦¬à§‡ à¦²à§‹à¦¡ à¦¹à¦šà§�à¦›à§‡à¥¤"
  },
  {
    "id": "511",
    "date": "2026-09-28T15:28",
    "type": "UI / Print Optimization",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Updated Final Settlement Sheet (/final-settlement): added formal management signature blocks (Prepared By, Checked By HR, Head of HR, Checked By Accounts, Recipients Signature, Checked By Audit, Authorized By), populated realistic demo compensation data with remarks, separated Net Payable into a standalone right-aligned Grand Total box matching company layout, reduced vertical spacing, and optimized print styles to perfectly fit a single A4 page as-is.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦¶à¦¿à¦Ÿà§‡ (/final-settlement) à¦…à¦«à¦¿à¦¸à¦¿à§Ÿà¦¾à¦² à¦«à¦°à¦®à§�à¦¯à¦¾à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à§­à¦Ÿà¦¿ à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦¬à§�à¦²à¦• à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ (à¦ªà§�à¦°à¦¿à¦ªà§‡à§Ÿà¦¾à¦°à§�à¦¡ à¦¬à¦¾à¦‡, à¦šà§‡à¦•à¦¡ à¦¬à¦¾à¦‡ à¦�à¦‡à¦šà¦†à¦°, à¦¹à§‡à¦¡ à¦…à¦¬ à¦�à¦‡à¦šà¦†à¦°, à¦šà§‡à¦•à¦¡ à¦¬à¦¾à¦‡ à¦…à§�à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§�à¦Ÿà¦¸, à¦°à¦¿à¦¸à¦¿à¦­à§‡à¦¨à§�à¦Ÿà¦¸ à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦°, à¦šà§‡à¦•à¦¡ à¦¬à¦¾à¦‡ à¦…à¦¡à¦¿à¦Ÿ à¦“ à¦…à¦¥à¦°à¦¾à¦‡à¦œà¦¡ à¦¬à¦¾à¦‡)à¥¤ à¦•à¦®à§�à¦ªà§‡à¦¨à¦¸à§‡à¦¶à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸à§‡ à¦°à¦¿à¦®à¦¾à¦°à§�à¦•à¦¸ à¦¸à¦¹ à¦¡à§‡à¦®à§‹ à¦¡à¦¾à¦Ÿà¦¾ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦‡à¦¨à¦«à§‹ à¦¥à§‡à¦•à§‡ à¦¨à§‡à¦Ÿ à¦ªà§‡à§Ÿà¦¾à¦¬à¦² à¦†à¦²à¦¾à¦¦à¦¾ à¦•à¦°à§‡ à¦¡à¦¾à¦¨à§‡ à¦—à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦Ÿà§‹à¦Ÿà¦¾à¦² à¦¹à¦¿à¦¸à§‡à¦¬à§‡ à¦…à§�à¦¯à¦¾à¦²à¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¸à§‡à¦•à¦¶à¦¨à¦—à§�à¦²à§‹à¦° à¦—à§�à¦¯à¦¾à¦ª à¦•à¦®à¦¿à§Ÿà§‡ à¦•à¦®à§�à¦ªà§�à¦¯à¦¾à¦•à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¸à¦¿à¦™à§�à¦—à§‡à¦² A4 à¦ªà§‡à¦œà§‡ à¦«à¦¿à¦Ÿ à¦¹à¦“à§Ÿà¦¾à¦° à¦®à¦¤à§‹ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦…à¦ªà¦Ÿà¦¿à¦®à¦¾à¦‡à¦œà§‡à¦¶à¦¨ à¦¨à¦¿à¦¶à§�à¦šà¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "518",
    "date": "2026-09-28T15:45",
    "type": "UI / Print Optimization",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Improved print layout height (/print:h-20), and widened inter-tier row spacing (mt-14/print:mt-16) to eliminate bottom whitespace while ensuring single-page print-to-fit compliance.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦¶à¦¿à¦Ÿà§‡à¦° à¦¸à¦¿à¦™à§�à¦—à§‡à¦² A4 à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦²à§‡à¦†à¦‰à¦Ÿ à¦¨à¦¿à¦–à§�à¦�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦°à§‡à¦° à¦‰à¦ªà¦°à§‡à¦° à¦®à¦¾à¦°à§�à¦œà¦¿à¦¨, à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦•à¦°à¦¾à¦° à¦¸à§�à¦ªà§‡à¦¸ à¦¹à¦¾à¦‡à¦Ÿ à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¥à¦® à¦“ à¦¦à§�à¦¬à¦¿à¦¤à§€à§Ÿ à¦¸à¦¾à¦°à¦¿à¦° à¦®à¦¾à¦�à§‡à¦° à¦«à¦¾à¦�à¦•à¦¾ à¦œà¦¾à§Ÿà¦—à¦¾ à¦¬à§ƒà¦¦à§�à¦§à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦«à¦²à§‡ à¦ªà¦¾à¦¤à¦¾à¦° à¦¨à¦¿à¦šà§‡à¦° à¦«à¦¾à¦�à¦•à¦¾ à¦œà¦¾à§Ÿà¦—à¦¾ à¦¸à§�à¦·à¦®à¦­à¦¾à¦¬à§‡ à¦ªà§‚à¦°à¦£ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¸à¦¿à¦™à§�à¦—à§‡à¦² A4 à¦ªà§‡à¦œà§‡ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿà¦“ à¦¨à¦¿à¦–à§�à¦�à¦¤ à¦¬à¦œà¦¾à§Ÿ à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "517",
    "date": "2026-09-28T15:42",
    "type": "UI Layout Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Separated 'Earning Sectors' and 'Deduction Sectors' into independent bordered boxes with a clean margin gap, resolving the cramped layout where the Total Earning summary was directly attached to the Deduction Sectors header.",
    "descriptionBn": "'Payment Info' à¦�à¦° à¦­à§‡à¦¤à¦°à§‡ 'Earning Sectors' à¦�à¦¬à¦‚ 'Deduction Sectors'-à¦•à§‡ à¦¦à§�à¦Ÿà¦¿ à¦ªà§ƒà¦¥à¦• à¦¬à¦°à§�à¦¡à¦¾à¦°à§�à¦¡ à¦¬à¦•à§�à¦¸à§‡ à¦­à¦¾à¦— à¦•à¦°à§‡ à¦®à¦¾à¦�à§‡ à¦®à¦¾à¦°à§�à¦œà¦¿à¦¨ à¦—à§�à¦¯à¦¾à¦ª à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦«à¦²à§‡ Total Earning à¦�à¦¬à¦‚ Deduction Sectors à¦�à¦•à§‡ à¦…à¦ªà¦°à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦²à§‡à¦—à§‡ à¦¨à¦¾ à¦¥à§‡à¦•à§‡ à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦°à¦­à¦¾à¦¬à§‡ à¦†à¦²à¦¾à¦¦à¦¾ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à¦šà§�à¦›à§‡à¥¤"
  },
  {
    "id": "516",
    "date": "2026-09-28T15:40",
    "type": "UI Layout Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Re-architected Final Settlement Sheet header: removed company address, aligned 'FINAL SETTLEMENT SHEET' title to the exact center between the logo and portrait, and resized the employee photo frame (66px Ã— 82px) for a balanced professional appearance.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦¶à¦¿à¦Ÿà§‡à¦° à¦¹à§‡à¦¡à¦¾à¦° à¦¸à§‡à¦•à¦¶à¦¨ à¦¥à§‡à¦•à§‡ à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿à¦° à¦ à¦¿à¦•à¦¾à¦¨à¦¾ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¬à¦¾à¦¦ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡, 'FINAL SETTLEMENT SHEET' à¦Ÿà¦¾à¦‡à¦Ÿà§‡à¦²à¦Ÿà¦¿ à¦²à§‹à¦—à§‹ à¦“ à¦›à¦¬à¦¿à¦° à¦®à¦¾à¦�à¦–à¦¾à¦¨à§‡ à¦¸à§‡à¦¨à§�à¦Ÿà¦¾à¦° à¦…à§�à¦¯à¦¾à¦²à¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿à¦° à¦›à¦¬à¦¿à¦° à¦«à§�à¦°à§‡à¦®à§‡à¦° à¦¸à¦¾à¦‡à¦œ à¦ªà§�à¦°à§Ÿà§‹à¦œà¦¨ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦•à¦¿à¦›à§�à¦Ÿà¦¾ à¦¬à§œ (66px Ã— 82px) à¦•à¦°à§‡ à¦­à¦¾à¦°à¦¸à¦¾à¦®à§�à¦¯à¦ªà§‚à¦°à§�à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "515",
    "date": "2026-09-28T15:39",
    "type": "UI Consistency",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Updated section heading colors for 'Earn Leave Details', 'Service Benefit Details', and 'Compensation Details' to match 'Payment Info' theme green (#4caf50), ensuring uniform visual branding across all settlement breakdown quadrants.",
    "descriptionBn": "'Earn Leave Details', 'Service Benefit Details' à¦�à¦¬à¦‚ 'Compensation Details' à¦¸à§‡à¦•à¦¶à¦¨ à¦¹à§‡à¦¡à¦¾à¦°à¦—à§�à¦²à§‹à¦° à¦•à¦¾à¦²à¦¾à¦° 'Payment Info' à¦�à¦° à¦®à¦¤à§‹ à¦�à¦•à¦‡ à¦¬à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦¥à¦¿à¦® à¦—à§�à¦°à¦¿à¦¨ (#4caf50) à¦•à¦¾à¦²à¦¾à¦°à§‡ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "514",
    "date": "2026-09-28T15:37",
    "type": "UI Layout Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Reformatted Final Settlement Sheet header: removed duplicate 'Pakiza Software Limited' text header, placed the official logo directly on top followed vertically by the company address and 'FINAL SETTLEMENT SHEET' title, and reduced employee portrait photo frame dimensions for a cleaner compact layout.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦¶à¦¿à¦Ÿà§‡à¦° à¦¹à§‡à¦¡à¦¾à¦° à¦¸à§‡à¦•à¦¶à¦¨ à¦°à¦¿à¦«à¦°à¦®à§�à¦¯à¦¾à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ 'Pakiza Software Limited' à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦¸à¦°à¦¿à§Ÿà§‡ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° à¦²à§‹à¦—à§‹ à¦°à¦¾à¦–à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦²à§‹à¦—à§‹à¦° à¦ à¦¿à¦• à¦¨à¦¿à¦šà§‡ à¦•à§�à¦°à¦®à¦¾à¦¨à§�à¦¬à§Ÿà§‡ à¦ à¦¿à¦•à¦¾à¦¨à¦¾ à¦“ 'FINAL SETTLEMENT SHEET' à¦¶à¦¿à¦°à§‹à¦¨à¦¾à¦® à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦ªà¦¾à¦¶à¦¾à¦ªà¦¾à¦¶à¦¿ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿à¦° à¦›à¦¬à¦¿à¦° à¦¸à¦¾à¦‡à¦œ à¦†à¦°à¦“ à¦›à§‹à¦Ÿ à¦“ à¦ªà¦°à¦¿à¦ªà¦¾à¦Ÿà¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "513",
    "date": "2026-09-28T15:36",
    "type": "UI / Print Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Enhanced the Grand Total section in Final Settlement Sheet into a full-width colored banner containing Bangladeshi Taka In Words on the left and Grand Total amount on the right. Increased vertical spacing and height for management signature rows to provide proper clearance while maintaining single A4 page print-to-fit layout.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦¶à¦¿à¦Ÿà§‡ à¦—à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦Ÿà§‹à¦Ÿà¦¾à¦² à¦¸à§‡à¦•à¦¶à¦¨à¦Ÿà¦¿à¦•à§‡ à¦ªà§�à¦°à§‹ à¦‰à¦‡à¦¡à¦¥ à¦œà§�à§œà§‡ à¦�à¦•à¦• à¦•à¦¾à¦²à¦¾à¦°à§‡à¦° à¦¬à§�à¦¯à¦¾à¦¨à¦¾à¦°à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦¬à¦¾à¦® à¦ªà¦¾à¦¶à§‡ à¦Ÿà¦¾à¦•à¦¾à§Ÿ à¦•à¦¥à¦¾à§Ÿ (In Words) à¦�à¦¬à¦‚ à¦¡à¦¾à¦¨ à¦ªà¦¾à¦¶à§‡ à¦—à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦Ÿà§‹à¦Ÿà¦¾à¦² à¦…à§�à¦¯à¦¾à¦®à¦¾à¦‰à¦¨à§�à¦Ÿ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à¦šà§�à¦›à§‡à¥¤ à¦�à¦›à¦¾à§œà¦¾ à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦®à§‡à¦¨à§�à¦Ÿ à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦¸à§‡à¦•à¦¶à¦¨à§‡à¦° à¦‰à¦ªà¦°-à¦¨à¦¿à¦š à¦®à¦¾à¦°à§�à¦œà¦¿à¦¨ à¦“ à¦¹à¦¾à¦‡à¦Ÿ à¦¬à¦¾à§œà¦¿à§Ÿà§‡ à¦ªà¦°à§�à¦¯à¦¾à¦ªà§�à¦¤ à¦«à¦¾à¦�à¦•à¦¾ à¦œà¦¾à§Ÿà¦—à¦¾ (proper gap) à¦¨à¦¿à¦¶à§�à¦šà¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦¸à¦¿à¦™à§�à¦—à§‡à¦² A4 à¦ªà§‡à¦œà§‡ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿà¦“ à¦¨à¦¿à¦–à§�à¦�à¦¤ à¦¥à¦¾à¦•à§‡à¥¤"
  },
  {
    "id": "512",
    "date": "2026-09-28T15:32",
    "type": "UI Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Integrated official Pakiza client logo (client_logo.png) into the Final Settlement Sheet header for both the detailed settlement view (/final-settlement) and settlement report printable statement modal (/final-settlement-report).",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦¶à¦¿à¦Ÿà§‡à¦° à¦¹à§‡à¦¡à¦¾à¦° à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦…à¦«à¦¿à¦¸à¦¿à§Ÿà¦¾à¦² à¦ªà¦¾à¦•à¦¿à¦œà¦¾ à¦•à§�à¦²à¦¾à¦¯à¦¼à§‡à¦¨à§�à¦Ÿ à¦²à§‹à¦—à§‹ (client_logo.png) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰ (/final-settlement) à¦�à¦¬à¦‚ à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦¸à§�à¦Ÿà§‡à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦ªà§�à¦°à¦¿à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦² (/final-settlement-report) à¦‰à¦­à§Ÿ à¦¸à§�à¦¥à¦¾à¦¨à§‡ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à¦¬à§‡à¥¤"
  },
  {
    "id": "511b",
    "date": "2026-09-28T15:35",
    "type": "Bug Fix / Routing",
    "module": "Conference Room Booking List",
    "link": "/conference-room-booking-list",
    "descriptionEn": "Fixed TanStack Router Route export in conference-room-booking-list.tsx enabling the route to compile and render properly at http://localhost:3000/conference-room-booking-list.",
    "descriptionBn": "conference-room-booking-list.tsx à¦«à¦¾à¦‡à¦²à§‡ TanStack à¦°à§�à¦Ÿ à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§�à¦¨à¦ƒà¦¸à¦‚à¦¯à§‹à¦œà¦¨ à¦•à¦°à§‡ à¦°à¦¾à¦‰à¦Ÿà¦¿à¦‚ à¦«à¦¿à¦•à§�à¦¸ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦«à¦²à§‡ http://localhost:3000/conference-room-booking-list à¦ªà§‡à¦œà¦Ÿà¦¿ à¦¯à¦¥à¦¾à¦¯à¦¥à¦­à¦¾à¦¬à§‡ à¦²à§‹à¦¡ à¦¹à¦šà§�à¦›à§‡à¥¤"
  },
  {
    "id": "511",
    "date": "2026-09-28T15:28",
    "type": "UI / Print Optimization",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Updated Final Settlement Sheet (/final-settlement): added formal management signature blocks (Prepared By, Checked By HR, Head of HR, Checked By Accounts, Recipients Signature, Checked By Audit, Authorized By), populated realistic demo compensation data with remarks, separated Net Payable into a standalone right-aligned Grand Total box matching company layout, reduced vertical spacing, and optimized print styles to perfectly fit a single A4 page as-is.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦¶à¦¿à¦Ÿà§‡ (/final-settlement) à¦…à¦«à¦¿à¦¸à¦¿à§Ÿà¦¾à¦² à¦«à¦°à¦®à§�à¦¯à¦¾à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à§­à¦Ÿà¦¿ à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦¬à§�à¦²à¦• à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ (à¦ªà§�à¦°à¦¿à¦ªà§‡à§Ÿà¦¾à¦°à§�à¦¡ à¦¬à¦¾à¦‡, à¦šà§‡à¦•à¦¡ à¦¬à¦¾à¦‡ à¦�à¦‡à¦šà¦†à¦°, à¦¹à§‡à¦¡ à¦…à¦¬ à¦�à¦‡à¦šà¦†à¦°, à¦šà§‡à¦•à¦¡ à¦¬à¦¾à¦‡ à¦…à§�à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§�à¦Ÿà¦¸, à¦°à¦¿à¦¸à¦¿à¦­à§‡à¦¨à§�à¦Ÿà¦¸ à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦°, à¦šà§‡à¦•à¦¡ à¦¬à¦¾à¦‡ à¦…à¦¡à¦¿à¦Ÿ à¦“ à¦…à¦¥à¦°à¦¾à¦‡à¦œà¦¡ à¦¬à¦¾à¦‡)à¥¤ à¦•à¦®à§�à¦ªà§‡à¦¨à¦¸à§‡à¦¶à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸à§‡ à¦°à¦¿à¦®à¦¾à¦°à§�à¦•à¦¸ à¦¸à¦¹ à¦¡à§‡à¦®à§‹ à¦¡à¦¾à¦Ÿà¦¾ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦‡à¦¨à¦«à§‹ à¦¥à§‡à¦•à§‡ à¦¨à§‡à¦Ÿ à¦ªà§‡à§Ÿà¦¾à¦¬à¦² à¦†à¦²à¦¾à¦¦à¦¾ à¦•à¦°à§‡ à¦¡à¦¾à¦¨à§‡ à¦—à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦Ÿà§‹à¦Ÿà¦¾à¦² à¦¹à¦¿à¦¸à§‡à¦¬à§‡ à¦…à§�à¦¯à¦¾à¦²à¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¸à§‡à¦•à¦¶à¦¨à¦—à§�à¦²à§‹à¦° à¦—à§�à¦¯à¦¾à¦ª à¦•à¦®à¦¿à§Ÿà§‡ à¦•à¦®à§�à¦ªà§�à¦¯à¦¾à¦•à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¸à¦¿à¦™à§�à¦—à§‡à¦² A4 à¦ªà§‡à¦œà§‡ à¦«à¦¿à¦Ÿ à¦¹à¦“à§Ÿà¦¾à¦° à¦®à¦¤à§‹ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦…à¦ªà¦Ÿà¦¿à¦®à¦¾à¦‡à¦œà§‡à¦¶à¦¨ à¦¨à¦¿à¦¶à§�à¦šà¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "510",
    "date": "2026-09-28T13:05",
    "type": "New Feature / History Tracking",
    "module": "Central Approvals - Conference Room Modal",
    "link": "/all-approvals",
    "descriptionEn": "Implemented Requisition Schedule & Room Reallocation History tracking for Conference Room Booking approvals. When an approver changes the meeting room, booking date, start time, or end time and approves the requisition, a schedule history card is recorded and rendered in both approval and view modals comparing original requested schedule with approved schedule.",
    "descriptionBn": "à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦¬à§�à¦•à¦¿à¦‚ à¦…à§�à¦¯à¦¾à¦ªà¦ªà§�à¦°à§�à¦­à¦¾à¦²à§‡ à¦¶à¦¿à¦¡à¦¿à¦‰à¦² à¦“ à¦°à§�à¦® à¦ªà§�à¦¨à¦°à§�à¦¨à¦¿à¦°à§�à¦§à¦¾à¦°à¦£à§‡à¦° à¦‡à¦¤à¦¿à¦¹à¦¾à¦¸ à¦Ÿà§�à¦°à§�à¦¯à¦¾à¦•à¦¿à¦‚ à¦«à¦¿à¦šà¦¾à¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦…à§�à¦¯à¦¾à¦ªà¦ªà§�à¦°à§�à¦­à¦¾à¦° à¦¯à¦¦à¦¿ à¦®à¦¿à¦Ÿà¦¿à¦‚ à¦°à§�à¦®, à¦¤à¦¾à¦°à¦¿à¦–, à¦¸à§�à¦Ÿà¦¾à¦°à§�à¦Ÿ à¦¬à¦¾ à¦�à¦¨à§�à¦¡ à¦Ÿà¦¾à¦‡à¦® à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ à¦…à§�à¦¯à¦¾à¦ªà¦ªà§�à¦°à§�à¦­ à¦•à¦°à§‡à¦¨, à¦¤à¦¬à§‡ à¦…à¦¨à§�à¦®à§‹à¦¦à¦¿à¦¤ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦­à¦¿à¦‰ à¦•à¦°à¦¾à¦° à¦¸à¦®à§Ÿ à¦…à¦°à¦¿à¦œà¦¿à¦¨à¦¾à¦² à¦°à¦¿à¦•à§�à¦¯à¦¼à§‡à¦¸à§�à¦Ÿ à¦•à¦°à¦¾ à¦¶à¦¿à¦¡à¦¿à¦‰à¦² à¦“ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¿à¦¤ à¦…à§�à¦¯à¦¾à¦ªà¦ªà§�à¦°à§�à¦­à¦¡ à¦¶à¦¿à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦¤à§�à¦²à¦¨à¦¾à¦®à§‚à¦²à¦• à¦¹à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦•à¦¾à¦°à§�à¦¡ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à¦¬à§‡à¥¤"
  },
  {
    "id": "509",
    "date": "2026-09-28T12:12",
    "type": "UI Clean Up",
    "module": "Central Approvals - Conference Room Modal",
    "link": "/all-approvals",
    "descriptionEn": "Cleaned up Conference Room Approval Modal layout: removed gradient background fill, removed section title header, and removed outer stroke border from schedule modification fields.",
    "descriptionBn": "à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦…à§�à¦¯à¦¾à¦ªà¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦¶à¦¿à¦¡à¦¿à¦‰à¦² à¦¸à§‡à¦•à¦¶à¦¨ à¦•à§�à¦²à¦¿à¦¨ à¦†à¦ª à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¬à§�à¦¯à¦¾à¦•à¦—à§�à¦°à¦¾à¦‰à¦¨à§�à¦¡à§‡à¦° à¦—à§�à¦°à¦¾à¦¡à¦¿à§Ÿà§‡à¦¨à§�à¦Ÿ à¦•à¦¾à¦²à¦¾à¦°, à¦¹à§‡à¦¡à¦¾à¦° à¦Ÿà¦¾à¦‡à¦Ÿà§‡à¦² à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦�à¦¬à¦‚ à¦¬à¦¾à¦‡à¦°à§‡à¦° à¦¸à§�à¦Ÿà§�à¦°à§‹à¦• à¦¬à¦°à§�à¦¡à¦¾à¦° à¦¸à¦°à¦¿à§Ÿà§‡ à¦«à§‡à¦²à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "508",
    "date": "2026-09-28T11:58",
    "type": "UI / UX Refactoring",
    "module": "Central Approvals - Conference Room Modal",
    "link": "/all-approvals",
    "descriptionEn": "Refactored ConferenceRoomApprovalModal: merged Approver schedule override controls & booking details into a single section named 'Booking Purpose & Details', stacked comment history and decision action panel vertically, and added a sticky bottom Approve/Reject action footer bar matching SimApprovalViewModal.",
    "descriptionBn": "ConferenceRoomApprovalModal à¦°à¦¿à¦«à§�à¦¯à¦¾à¦•à§�à¦Ÿà¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦…à§�à¦¯à¦¾à¦ªà¦ªà§�à¦°à§�à¦­à¦¾à¦° à¦¶à¦¿à¦¡à¦¿à¦‰à¦² à¦•à¦¨à§�à¦Ÿà§�à¦°à§‹à¦²à¦¸ à¦“ à¦¬à§�à¦•à¦¿à¦‚ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦�à¦• à¦•à¦°à§‡ 'Booking Purpose & Details' à¦¨à¦¾à¦®à¦• à¦¸à¦¿à¦™à§�à¦—à§‡à¦² à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦•à¦®à§‡à¦¨à§�à¦Ÿ à¦¹à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦“ à¦¡à¦¿à¦¸à¦¿à¦¶à¦¨ à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦² à¦‰à¦ªà¦°-à¦¨à¦¿à¦šà§‡ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦• à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¸à¦¿à¦® à¦…à§�à¦¯à¦¾à¦ªà¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦®à¦¤à§‹ à¦¨à¦¿à¦šà§‡ à¦¸à§�à¦Ÿà¦¿à¦•à¦¿ à¦…à§�à¦¯à¦¾à¦ªà¦ªà§�à¦°à§�à¦­/à¦°à¦¿à¦œà§‡à¦•à§�à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨ à¦¬à¦¾à¦° à¦¸à¦‚à¦¯à§‹à¦œà¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "507",
    "date": "2026-09-28T11:48",
    "type": "New Feature / Approvals",
    "module": "Central Approvals - Conference Room",
    "link": "/all-approvals",
    "descriptionEn": "Added Conference Room Booking Requisition approval module to Central Approvals (/all-approvals). Integrated ConferenceRoomApprovalModal allowing facility approvers to inspect booking details and modify the Meeting Room, Booking Date, Start Time, and End Time prior to approval/rejection.",
    "descriptionBn": "à¦¸à§‡à¦¨à§�à¦Ÿà§�à¦°à¦¾à¦² à¦…à§�à¦¯à¦¾à¦ªà¦ªà§�à¦°à§�à¦­à¦¾à¦²à¦¸ à¦ªà§‡à¦œà§‡ (/all-approvals) à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦¬à§�à¦•à¦¿à¦‚ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦…à§�à¦¯à¦¾à¦ªà¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦®à¦¡à¦¿à¦‰à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦¨à¦¤à§�à¦¨ ConferenceRoomApprovalModal à¦¸à¦‚à¦¯à§‹à¦œà¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦«à§‡à¦¸à¦¿à¦²à¦¿à¦Ÿà¦¿ à¦…à§�à¦¯à¦¾à¦ªà¦ªà§�à¦°à§�à¦­à¦¾à¦° à¦¬à§�à¦•à¦¿à¦‚à§Ÿà§‡à¦° à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦¦à§‡à¦–à¦¾à¦° à¦ªà¦¾à¦¶à¦¾à¦ªà¦¾à¦¶à¦¿ à¦®à¦¿à¦Ÿà¦¿à¦‚ à¦°à§�à¦®, à¦¤à¦¾à¦°à¦¿à¦–, à¦¸à§�à¦Ÿà¦¾à¦°à§�à¦Ÿ à¦Ÿà¦¾à¦‡à¦® à¦“ à¦�à¦¨à§�à¦¡ à¦Ÿà¦¾à¦‡à¦® à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ à¦…à§�à¦¯à¦¾à¦ªà¦ªà§�à¦°à§�à¦­ à¦¬à¦¾ à¦°à¦¿à¦œà§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "506",
    "date": "2026-09-28T11:37",
    "type": "UI / UX Update",
    "module": "Conference Room Booking List",
    "link": "/conference-room-booking-list",
    "descriptionEn": "Updated Conference Room Booking Requisition view modal: removed Room Amenities & Technical Configuration section and removed Status column from Responsible Persons & Delegates List table.",
    "descriptionBn": "à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦¬à§�à¦•à¦¿à¦‚ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦² à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦°à§�à¦® à¦…à§�à¦¯à¦¾à¦®à§‡à¦¨à¦¿à¦Ÿà¦¿à¦œ à¦…à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦Ÿà§‡à¦•à¦¨à¦¿à¦•à§�à¦¯à¦¾à¦² à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦¸à§‡à¦•à¦¶à¦¨à¦Ÿà¦¿ à¦¸à¦°à¦¿à§Ÿà§‡ à¦«à§‡à¦²à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦°à§‡à¦¸à¦ªà¦¨à§�à¦¸à¦¿à¦¬à¦² à¦ªà¦¾à¦°à§�à¦¸à¦¨à¦¸ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¥à§‡à¦•à§‡ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦•à¦²à¦¾à¦®à¦Ÿà¦¿ à¦¬à¦¾à¦¦ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "505",
    "date": "2026-09-28T11:20",
    "type": "UI / Modal Redesign",
    "module": "Conference Room Booking List",
    "link": "/conference-room-booking-list",
    "descriptionEn": "Redesigned Conference Room View Booking Modal to match standard ERP Requisition View Modal layout featuring header icon badge with booking ID & status pill, Requester & Booking Overview card with employee avatar & metadata grid, Responsible Persons & Delegates sub-table with status badges, Room Technical Amenities & Setup chips, Approval Workflow & Signatures cards, Comments History timeline, and Print Slip & Close action buttons.",
    "descriptionBn": "à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦¬à§�à¦•à¦¿à¦‚ à¦²à¦¿à¦¸à§�à¦Ÿ à¦ªà§‡à¦œà§‡à¦° (/conference-room-booking-list) à¦­à¦¿à¦‰ à¦¬à§�à¦•à¦¿à¦‚ à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦¡à¦¾à¦°à§�à¦¡ ERP à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦¸à§�à¦Ÿà¦¾à¦‡à¦²à§‡ à¦ªà§�à¦¨à¦°à§�à¦¨à¦¿à¦°à§�à¦®à¦¾à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦¬à§�à¦•à¦¿à¦‚ à¦†à¦‡à¦¡à¦¿ à¦“ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦ªà¦¿à¦² à¦¸à¦¹ à¦¹à§‡à¦¡à¦¾à¦° à¦†à¦‡à¦•à¦¨ à¦¬à§�à¦¯à¦¾à¦œ, à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦…à§�à¦¯à¦¾à¦­à¦¾à¦Ÿà¦¾à¦° à¦“ à¦®à§‡à¦Ÿà¦¾à¦¡à¦¾à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡ à¦¸à¦¹ à¦°à¦¿à¦•à§�à¦¯à¦¼à§‡à¦¸à§�à¦Ÿà¦¾à¦° à¦“ à¦¬à§�à¦•à¦¿à¦‚ à¦“à¦­à¦¾à¦°à¦­à¦¿à¦‰ à¦•à¦¾à¦°à§�à¦¡, à¦°à§‡à¦¸à¦ªà¦¨à§�à¦¸à¦¿à¦¬à¦² à¦ªà¦¾à¦°à§�à¦¸à¦¨à¦¸ à¦¸à¦¾à¦¬-à¦Ÿà§‡à¦¬à¦¿à¦², à¦Ÿà§‡à¦•à¦¨à¦¿à¦•à§�à¦¯à¦¾à¦² à¦¸à§�à¦¯à§‹à¦—-à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦šà¦¿à¦ªà¦¸, à¦…à§�à¦¯à¦¾à¦ªà¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦“à§Ÿà¦¾à¦°à§�à¦•à¦«à§�à¦²à§‹ à¦•à¦¾à¦°à§�à¦¡à¦¸ à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦¸à§�à¦²à¦¿à¦ª à¦“ à¦•à§�à¦²à§‹à¦œ à¦¬à¦¾à¦Ÿà¦¨ à¦¸à¦‚à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "504",
    "date": "2026-09-27T10:18",
    "type": "UI / PDF Standard Layout Update",
    "module": "HR Reports - All PDF & Print Views",
    "link": "/hr-reports",
    "descriptionEn": "Standardized official PDF print preview formatting across all 10 HR report pages (Continuous Absent, Daily Attendance, Monthly Attendance, Overtime Summary, Absenteeism Summary, SIM Requisition, New Joining Info, Leave Summary, Leave Details, Employee Count) featuring official Pakiza Knit Composite Ltd company logo, centered header, underlined report title, date range, and crisp border table grid layout matching reference screenshot.",
    "descriptionBn": "à¦¸à¦•à¦² à§§à§¦à¦Ÿà¦¿ à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦œà§‡à¦° à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ/à¦ªà¦¿à¦¡à¦¿à¦�à¦« à¦­à¦¿à¦‰ à¦†à¦¨à§�à¦·à§�à¦ à¦¾à¦¨à¦¿à¦•à¦­à¦¾à¦¬à§‡ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦…à¦«à¦¿à¦¸à¦¿à¦¯à¦¼à¦¾à¦² à¦ªà¦¾à¦•à§€à¦œà¦¾ à¦¨à¦¿à¦Ÿ à¦•à¦®à§�à¦ªà§‹à¦œà¦¿à¦Ÿ à¦²à¦¿à¦®à¦¿à¦Ÿà§‡à¦¡ à¦²à§‹à¦—à§‹, à¦¸à§‡à¦¨à§�à¦Ÿà¦¾à¦°à§�à¦¡ à¦¹à§‡à¦¡à¦¾à¦° à¦Ÿà¦¾à¦‡à¦Ÿà§‡à¦², à¦¡à§‡à¦Ÿ à¦°à§‡à¦žà§�à¦œ à¦�à¦¬à¦‚ à¦•à§�à¦²à¦¿à¦¯à¦¼à¦¾à¦° à¦—à§�à¦°à¦¿à¦¡ à¦¬à¦°à§�à¦¡à¦¾à¦° à¦Ÿà§‡à¦¬à¦¿à¦² à¦²à§‡à¦†à¦‰à¦Ÿ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "503",
    "date": "2026-09-26T17:08",
    "type": "New Feature / HR Report",
    "module": "HR Reports - Continuous Absent Report",
    "link": "/hr-report-continuous-absent",
    "descriptionEn": "Created Continuous Absent Report page with From Date, Company, Area, Type, Department, Job Title, Unit, Line, Min Days, and Employee ID filters, 15-column continuous absent log table with soft red row highlights, KPI metric cards, Excel export, and PDF print features.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦®à¦¡à¦¿à¦‰à¦²à§‡ Continuous Absent Report à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à¦¤à¦¾à¦°à¦¿à¦–, à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿, à¦Ÿà¦¾à¦‡à¦ª, à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ, à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡à¦¶à¦¨ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, à¦¸à¦«à¦Ÿ à¦°à§‡à¦¡ à¦¹à¦¾à¦‡à¦²à¦¾à¦‡à¦Ÿ à¦¸à¦¹ à§§à§« à¦•à¦²à¦¾à¦®à§‡à¦° à¦Ÿà§‡à¦¬à¦¿à¦², à¦•à§‡à¦ªà¦¿à¦†à¦‡ à¦®à§‡à¦Ÿà§�à¦°à¦¿à¦• à¦•à¦¾à¦°à§�à¦¡à¦¸, à¦�à¦•à§�à¦¸à§‡à¦² à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦“ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦ªà¦¿à¦¡à¦¿à¦�à¦« à¦¸à¦‚à¦¯à§�à¦•à§�à¦¤à¥¤"
  },
  {
    "id": "502",
    "date": "2026-09-26T17:02",
    "type": "New Feature / HR Report",
    "module": "HR Reports - SIM Requisition Report",
    "link": "/hr-report-sim-requisition",
    "descriptionEn": "Created SIM Requisition Report page with Department dropdown filter, 13-column requisition table with light-pink header styling, status badges (Issue Status, Req Status, Request For), KPI metric cards, Excel export, and PDF print features.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦®à¦¡à¦¿à¦‰à¦²à§‡ SIM Requisition Report à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, à¦¹à¦¾à¦²à¦•à¦¾ à¦ªà¦¿à¦‚à¦• à¦¹à§‡à¦¡à¦¾à¦° à¦¸à¦¹ à§§à§© à¦•à¦²à¦¾à¦®à§‡à¦° à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦Ÿà§‡à¦¬à¦¿à¦², à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦¬à§�à¦¯à¦¾à¦œ, à¦•à§‡à¦ªà¦¿à¦†à¦‡ à¦®à§‡à¦Ÿà§�à¦°à¦¿à¦• à¦•à¦¾à¦°à§�à¦¡à¦¸, à¦�à¦•à§�à¦¸à§‡à¦² à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦“ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦ªà¦¿à¦¡à¦¿à¦�à¦« à¦¸à¦‚à¦¯à§�à¦•à§�à¦¤à¥¤"
  },
  {
    "id": "501",
    "date": "2026-09-26T16:58",
    "type": "New Feature / HR Report",
    "module": "HR Reports - Absenteeism Summary Report",
    "link": "/hr-report-absenteeism-summary",
    "descriptionEn": "Created Absenteeism Summary Report page with Employee ID, System/Office radio, Year, Start/End Month, Status, Employee Type, Section, Designation, Unit, and Line filters, 12-column log table with light-blue header styling, Excel export, and PDF print features.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦®à¦¡à¦¿à¦‰à¦²à§‡ Absenteeism Summary Report à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦†à¦‡à¦¡à¦¿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, à¦¬à¦›à¦°, à¦®à¦¾à¦¸ à¦°à§‡à¦žà§�à¦œ, à¦¸à§‡à¦•à¦¶à¦¨ à¦“ à¦¡à§‡à¦œà¦¿à¦—à¦¨à§‡à¦¶à¦¨ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, à¦¹à¦¾à¦²à¦•à¦¾ à¦¨à§€à¦² à¦¹à§‡à¦¡à¦¾à¦° à¦¸à¦¹ à§§à§¨ à¦•à¦²à¦¾à¦®à§‡à¦° à¦²à¦— à¦Ÿà§‡à¦¬à¦¿à¦², à¦�à¦•à§�à¦¸à§‡à¦² à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦“ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰ à¦¸à¦‚à¦¯à§�à¦•à§�à¦¤à¥¤"
  },
  {
    "id": "500",
    "date": "2026-09-26T16:38",
    "type": "Bug Fix / Navigation",
    "module": "Sidebar Navigation - HR Reports",
    "link": "/hr-reports",
    "descriptionEn": "Fixed left sidebar navigation links for Monthly Attendance Report (/hr-report-monthly-attendance) and Overtime Summary (/hr-report-overtime-summary) so clicking them navigates directly to the report pages.",
    "descriptionBn": "à¦²à§‡à¦«à¦Ÿ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨à§‡ Monthly Attendance Report à¦�à¦¬à¦‚ Overtime Summary à¦�à¦° à¦²à¦¿à¦‚à¦• à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à§‡ à¦ªà§‡à¦œà¦—à§�à¦²à§‹à¦¤à§‡ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨ à¦ à¦¿à¦• à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "499",
    "date": "2026-09-26T16:34",
    "type": "New Feature / HR Report",
    "module": "HR Reports - Overtime Summary",
    "link": "/hr-report-overtime-summary",
    "descriptionEn": "Created Overtime Summary & Costing Report page with Start/End date, Section filters, 15-column costing log table (Manpower, OT Hour, OT Amount, Tiffin, Night Bill, Total Expenses, Production & Net CM Income), metric KPI cards, Excel export, and PDF print options.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦®à¦¡à¦¿à¦‰à¦²à§‡ Overtime Summary Costing à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à¦¤à¦¾à¦°à¦¿à¦– à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, à¦¸à§‡à¦•à¦¶à¦¨ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨, à§§à§« à¦•à¦²à¦¾à¦®à§‡à¦° à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦Ÿà§‡à¦¬à¦¿à¦², à¦Ÿà§‹à¦Ÿà¦¾à¦² à¦°à§‹ à¦¸à¦¾à¦®à¦¾à¦°à¦¿, à¦�à¦•à§�à¦¸à§‡à¦² à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦“ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦ªà¦¿à¦¡à¦¿à¦�à¦« à¦…à¦ªà¦¶à¦¨ à¦¸à¦‚à¦¯à§�à¦•à§�à¦¤à¥¤"
  },
  {
    "id": "498",
    "date": "2026-09-26T16:31",
    "type": "New Feature / HR Report",
    "module": "HR Reports - Monthly Attendance Report",
    "link": "/hr-report-monthly-attendance",
    "descriptionEn": "Created Monthly Attendance Details Report page with Month/Year, Employee Type, Department, Unit, Search filters, 3 view modes (Monthly Summary, Day-by-Day 1-30 Grid Matrix, Department Breakdown), metric KPI widgets, Excel export, and PDF print features.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦®à¦¡à¦¿à¦‰à¦²à§‡ Monthly Attendance Details Report à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à¦®à¦¾à¦¸/à¦¬à¦›à¦° à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, à§©à¦Ÿà¦¿ à¦­à¦¿à¦‰ à¦®à§‹à¦¡ (Monthly Summary, Day-by-Day Grid Matrix, Department Breakdown), à¦®à§‡à¦Ÿà§�à¦°à¦¿à¦• à¦•à¦¾à¦°à§�à¦¡à¦¸, à¦�à¦•à§�à¦¸à§‡à¦² à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦“ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰ à¦¸à¦‚à¦¯à§�à¦•à§�à¦¤à¥¤"
  },
  {
    "id": "497",
    "date": "2026-09-26T16:26",
    "type": "UI / Design Enhancement",
    "module": "HR Reports - Daily Attendance Report",
    "link": "/hr-report-daily-attendance",
    "descriptionEn": "Styled absent employee records with soft red background tint, red text, and solid red status badges in Daily Attendance Report.",
    "descriptionBn": "à¦¡à§‡à¦‡à¦²à¦¿ à¦�à¦Ÿà§‡à¦¨à§�à¦¡à§‡à¦¨à§�à¦¸ à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà§‡ à¦…à¦¨à§�à¦ªà¦¸à§�à¦¥à¦¿à¦¤ (Absent) à¦•à¦°à§�à¦®à¦šà¦¾à¦°à§€à¦¦à§‡à¦° à¦°à§‡à¦•à¦°à§�à¦¡ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦²à¦¾à¦² à¦°à¦™ (à¦¹à¦¾à¦²à¦•à¦¾ à¦²à¦¾à¦² à¦¬à§�à¦¯à¦¾à¦•à¦—à§�à¦°à¦¾à¦‰à¦¨à§�à¦¡ à¦“ à¦²à¦¾à¦² à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ) à¦¦à¦¿à§Ÿà§‡ à¦¹à¦¾à¦‡à¦²à¦¾à¦‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "496",
    "date": "2026-09-26T16:24",
    "type": "New Feature / HR Report",
    "module": "HR Reports - Daily Attendance Report",
    "link": "/hr-report-daily-attendance",
    "descriptionEn": "Created Daily Attendance Report page with Employee Type, Department, Section, Unit, Line, Status, Date, and Option radio filters, 19-column attendance log table, Excel export, print view, and custom PDF export buttons.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦®à¦¡à¦¿à¦‰à¦²à§‡ Daily Attendance Report à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à¦…à¦ªà¦¶à¦¨ à¦°à§‡à¦¡à¦¿à¦“ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° (Regular, Lunch, OT), à§§à§¯ à¦•à¦²à¦¾à¦®à§‡à¦° à¦Ÿà§‡à¦¬à¦¿à¦² à¦�à¦¬à¦‚ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦ªà¦¿à¦¡à¦¿à¦�à¦« à¦“ à¦�à¦•à§�à¦¸à§‡à¦² à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¸à¦‚à¦¯à§�à¦•à§�à¦¤à¥¤"
  },
  {
    "id": "495",
    "date": "2026-09-26T16:22",
    "type": "New Feature / HR Report",
    "module": "HR Reports - Leave Report",
    "link": "/hr-report-leave-details",
    "descriptionEn": "Created Leave Report page with Date From/To, Type, Department, Section, Unit, Line, Designation, and Report Type filters, detailed 13-column leave log table, Excel export, and print view.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦®à¦¡à¦¿à¦‰à¦²à§‡ Leave Report à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à¦¤à¦¾à¦°à¦¿à¦– à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ, à¦¸à§‡à¦•à¦¶à¦¨, à¦¡à§‡à¦œà¦¿à¦—à¦¨à§‡à¦¶à¦¨ à¦¸à¦¹ à§§à§¦à¦Ÿà¦¿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à¦¿à¦‚ à¦…à¦ªà¦¶à¦¨, à§§à§© à¦•à¦²à¦¾à¦®à§‡à¦° à¦²à¦¿à¦­ à¦²à¦— à¦Ÿà§‡à¦¬à¦¿à¦², à¦�à¦•à§�à¦¸à§‡à¦² à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦“ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¸à¦‚à¦¯à§�à¦•à§�à¦¤à¥¤"
  },
  {
    "id": "494",
    "date": "2026-09-26T16:20",
    "type": "New Feature / HR Report",
    "module": "HR Reports - Employee Count",
    "link": "/hr-report-employee-count",
    "descriptionEn": "Created Employee Count report page with Organization, Region, Employee Type, Section, Designation, Gender, Grade, Component, Unit, Line, and Status filters, Excel export, print view, and total headcount summary.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦®à¦¡à¦¿à¦‰à¦²à§‡ Employee Count à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à¦…à¦°à§�à¦—à¦¾à¦¨à¦¾à¦‡à¦œà§‡à¦¶à¦¨, à¦°à¦¿à¦œà¦¿à§Ÿà¦¨, à¦¸à§‡à¦•à¦¶à¦¨, à¦—à§�à¦°à§‡à¦¡, à¦‡à¦‰à¦¨à¦¿à¦Ÿ à¦¸à¦¹ à§§à§§à¦Ÿà¦¿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, à¦¹à§‡à¦¡à¦•à¦¾à¦‰à¦¨à§�à¦Ÿ à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦“ à¦�à¦•à§�à¦¸à§‡à¦² à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¸à¦‚à¦¯à§�à¦•à§�à¦¤à¥¤"
  },
  {
    "id": "493",
    "date": "2026-09-26T16:19",
    "type": "UI Standardization & Consistency",
    "module": "HR Reports - Leave Summary",
    "link": "/hr-report-leave-summary",
    "descriptionEn": "Standardized Leave Summary report layout to match exact visual hierarchy, card wrappers, and button designs of the New Joining Info report page.",
    "descriptionBn": "New Joining Info à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦œà§‡à¦° à¦²à§‡à¦†à¦‰à¦Ÿà§‡à¦° à¦¸à¦¾à¦¥à§‡ à§§à§¦à§¦% à¦¹à§�à¦¬à¦¹à§� à¦®à¦¿à¦²à¦¿à§Ÿà§‡ Leave Summary à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦œà§‡à¦° à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦¡à¦¾à¦°à§�à¦¡à¦¾à¦‡à¦œà¦¡ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "492",
    "date": "2026-09-26T16:17",
    "type": "New Feature / HR Report",
    "module": "HR Reports - Leave Summary",
    "link": "/hr-report-leave-summary",
    "descriptionEn": "Created Leave Summary report page with Year, Employee Type, Section, Unit, Line, and Option filters (Details, Gender Wise CL/SL, Gender Wise Zero Leave), Excel export, and print view.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦®à¦¡à¦¿à¦‰à¦²à§‡ Leave Summary à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à¦¬à¦›à¦°, à¦¸à§‡à¦•à¦¶à¦¨, à¦‡à¦‰à¦¨à¦¿à¦Ÿ, à¦…à¦ªà¦¶à¦¨ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ (Details, Gender Wise CL/SL, Gender Wise NO Leave), à¦�à¦•à§�à¦¸à§‡à¦² à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦“ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰ à¦¸à¦‚à¦¯à§�à¦•à§�à¦¤à¥¤"
  },
  {
    "id": "491",
    "date": "2026-09-26T16:12",
    "type": "Bug Fix / Navigation",
    "module": "Sidebar & HR Reports",
    "link": "/hr-report-new-joining-info",
    "descriptionEn": "Fixed sidebar navigation link for New Joining Info under HR Reports menu so clicking it correctly opens the New Joining Info report page.",
    "descriptionBn": "à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡à¦° 'HR Reports -> New Joining Info' à¦²à¦¿à¦‚à¦•à§‡à¦° à¦¡à¦¾à§Ÿà¦°à§‡à¦•à¦¶à¦¨ à¦ à¦¿à¦• à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦•à§�à¦²à¦¿à¦•à§‡à¦‡ à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦œà¦Ÿà¦¿ à¦“à¦ªà§‡à¦¨ à¦¹à§Ÿà¥¤"
  },
  {
    "id": "490",
    "date": "2026-09-26T16:10",
    "type": "New Feature / HR Report",
    "module": "HR Reports - New Joining Info",
    "link": "/hr-report-new-joining-info",
    "descriptionEn": "Created the HR Report page for New Joining Info featuring comprehensive multi-criteria filters, instant search, Excel export, print view, and interactive 33-column tabular display.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸ à¦®à¦¡à¦¿à¦‰à¦²à§‡ New Joining Info à¦ªà§‡à¦œà¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ à¦•à¦°à§‡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à§§à§®à¦Ÿà¦¿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à¦¿à¦‚ à¦«à¦¿à¦²à§�à¦¡, à§©à§¦+ à¦•à¦²à¦¾à¦®à§‡à¦° à¦Ÿà§‡à¦¬à¦¿à¦², à¦�à¦•à§�à¦¸à§‡à¦² à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦“ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ/à¦ªà¦¿à¦¡à¦¿à¦�à¦« à¦­à¦¿à¦‰ à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "489",
    "date": "2026-09-26T14:47",
    "type": "UI Optimization & De-duplication",
    "module": "My Profile",
    "link": "/my-profile",
    "descriptionEn": "Removed duplicate header badge elements (EMP ID, Salary, Manager, Bangla Name) to ensure each piece of information is displayed uniquely without repetition.",
    "descriptionBn": "à¦®à¦¾à¦‡ à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦¹à§‡à¦¡à¦¾à¦° à¦¥à§‡à¦•à§‡ à¦ªà§�à¦¨à¦°à¦¾à¦¬à§ƒà¦¤à§�à¦¤ à¦¤à¦¥à§�à¦¯à¦¸à¦®à§‚à¦¹ (EMP ID, à¦¬à§‡à¦¤à¦¨, à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦¾à¦° à¦‡à¦¤à§�à¦¯à¦¾à¦¦à¦¿) à¦¸à¦°à¦¿à§Ÿà§‡ à¦ªà§‡à¦œà¦Ÿà¦¿à¦•à§‡ à¦†à¦°à¦“ à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦° à¦“ à¦‡à¦‰à¦¨à¦¿à¦• à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "488",
    "date": "2026-09-26T14:42",
    "type": "UI Layout & Overlap Fix",
    "module": "My Profile",
    "link": "/my-profile",
    "descriptionEn": "Fixed text positioning and banner overlap issue in My Profile hero section, perfectly aligning employee name, badges, and card grid heights.",
    "descriptionBn": "à¦®à¦¾à¦‡ à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦¹à§‡à¦¡à¦¾à¦° à¦¬à§�à¦¯à¦¾à¦¨à¦¾à¦°à§‡ à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦“à¦­à¦¾à¦°à¦²à§�à¦¯à¦¾à¦ª à¦¸à¦®à¦¸à§�à¦¯à¦¾ à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦¨à§‡à¦®, à¦¬à§�à¦¯à¦¾à¦œ à¦“ à¦•à¦¾à¦°à§�à¦¡ à¦²à§‡à¦†à¦‰à¦Ÿ à¦ªà¦¾à¦°à¦«à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "487",
    "date": "2026-09-26T14:40",
    "type": "UI Simplification & Redesign",
    "module": "My Profile",
    "link": "/my-profile",
    "descriptionEn": "Redesigned and simplified My Profile page to focus exclusively on essential employee details including personal info, corporate details, salary, parental info, addresses, and emergency contacts.",
    "descriptionBn": "à¦®à¦¾à¦‡ à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦ªà§‡à¦œà¦Ÿà¦¿ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦°à¦¿à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à§‡ à¦¸à¦¹à¦œ à¦“ à¦¸à§�à¦¬à¦¿à¦¨à§�à¦¯à¦¸à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à§§à§­à¦Ÿà¦¿ à¦ªà§�à¦°à§Ÿà§‹à¦œà¦¨à§€à§Ÿ à¦®à§‚à¦² à¦¤à¦¥à§�à¦¯à§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "486",
    "date": "2026-09-24T20:01",
    "type": "UI Layout & Sticky Action Footer",
    "module": "All Approvals - SIM Requisition",
    "link": "/all-approvals",
    "descriptionEn": "Moved Multi-Stage Approval Hierarchy & Signatures section under Comments & Approver Controls, and converted Approve/Reject buttons into a sticky modal footer.",
    "descriptionBn": "à¦¸à¦¿à¦® à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦®à¦¡à¦¾à¦²à§‡ à¦®à¦¾à¦²à§�à¦Ÿà¦¿-à¦¸à§�à¦Ÿà§‡à¦œ à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦¸à§‡à¦•à¦¶à¦¨à¦Ÿà¦¿ à¦•à¦®à§‡à¦¨à§�à¦Ÿà¦¸ à¦“ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦²à§‡à¦° à¦¨à¦¿à¦šà§‡ à¦šà¦¾à¦²à¦¨à¦¾ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ Approve à¦“ Reject à¦¬à¦¾à¦Ÿà¦¨ à¦¦à§�à¦Ÿà¦¿à¦•à§‡ à¦¸à§�à¦Ÿà¦¿à¦•à¦¿ à¦«à§�à¦Ÿà¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "485",
    "date": "2026-09-24T19:52",
    "type": "Interactive Workflow / Approver Inputs",
    "module": "All Approvals - SIM Requisition",
    "link": "/all-approvals",
    "descriptionEn": "Added dynamic approver input controls to SIM Approval Modal: Assigned SIM & Balance for New SIM, Approved Limit for SIM Balance Limit, and New Issued SIM Number for SIM Replacement.",
    "descriptionBn": "à¦¸à¦¿à¦® à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦®à¦¡à¦¾à¦²à§‡ à¦¡à¦¾à§Ÿà¦¨à¦¾à¦®à¦¿à¦• à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦° à¦‡à¦¨à¦ªà§�à¦Ÿ à¦«à¦¿à¦²à§�à¦¡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: New SIM-à¦�à¦° à¦œà¦¨à§�à¦¯ SIM Number à¦“ Balance, Balance Limit-à¦�à¦° à¦œà¦¨à§�à¦¯ Approved Limit à¦�à¦¬à¦‚ Replacement-à¦�à¦° à¦œà¦¨à§�à¦¯ New SIM Numberà¥¤"
  },
  {
    "id": "484",
    "date": "2026-09-24T19:35",
    "type": "New Feature / UI",
    "module": "All Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Added 3 separate SIM requisition approval entries for New SIM, SIM Balance Limit, and SIM Replacement in Central Approvals with dedicated detailed approval modal.",
    "descriptionBn": "à¦¸à§‡à¦¨à§�à¦Ÿà§�à¦°à¦¾à¦² à¦…à¦² à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦²à¦¸ à¦ªà§‡à¦œà§‡ New SIM, SIM Balance Limit à¦�à¦¬à¦‚ SIM Replacement-à¦�à¦° à¦œà¦¨à§�à¦¯ à§©à¦Ÿà¦¿ à¦†à¦²à¦¾à¦¦à¦¾ à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦“ à¦¬à¦¿à¦·à¦¦ à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦®à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "483",
    "date": "2026-09-19T16:33",
    "type": "UI / Design Update",
    "module": "Separation & All Approvals",
    "link": "/ssp-approval",
    "descriptionEn": "Redesigned Resignation Approval Modal to match exact official letter layout with editable Intended Last Working Day, live body updates, and integrated a new entry in All Approvals Queue.",
    "descriptionBn": "à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² à¦°à¦¿à¦œà¦¾à¦‡à¦¨ à¦²à§‡à¦Ÿà¦¾à¦° à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦¹à§�à¦¬à¦¹à§� à¦®à¦¿à¦²à¦¿à§Ÿà§‡ à¦®à¦¡à¦¾à¦² à¦°à¦¿à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¸à¦‚à¦¶à§‡à¦¾à¦§à¦¨à¦¯à§‡à¦¾à¦—à§�à¦¯ Intended Last Working Day à¦…à¦ªà¦¶à¦¨ à¦�à¦¬à¦‚ à¦…à¦² à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦²à¦¸ à¦ªà§‡à¦œà§‡ à¦¨à¦¤à§�à¦¨ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "482",
    "date": "2026-09-19T16:07",
    "type": "New Feature / Workflow",
    "module": "Separation",
    "link": "/separation-resignation-request",
    "descriptionEn": "Added interactive Approval and Rejection actions to the Resignation Approval Modal with real-time signature clearance updates, remarks, and status tracking.",
    "descriptionBn": "à¦°à¦¿à¦œà¦¾à¦‡à¦¨ à¦…à¦ªà¦¶à¦¨ à¦®à¦¡à¦¾à¦²à§‡ à¦¨à¦¤à§�à¦¨ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à¦…à§�à¦¯à¦¾à¦•à§�à¦Ÿà¦¿à¦­ Approve à¦“ Reject à¦¬à¦¾à¦Ÿà¦¨, à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦�à¦¬à¦‚ à¦®à¦¨à§�à¦¤à¦¬à§�à¦¯ à¦¯à§‹à¦—à§‡à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "481",
    "date": "2026-09-19T15:53",
    "type": "UI / Workflow Update",
    "module": "SSP Requisition",
    "link": "/ssp-sim-requisition",
    "descriptionEn": "Refactored SIM Requisition dropdown to 3 options (New SIM, SIM Balance Limit, SIM Replacement) with dynamic conditional fields (SIM Number, Existing/Expected Limit).",
    "descriptionBn": "à¦¸à¦¿à¦® à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ à§©à¦Ÿà¦¿ à¦…à¦ªà¦¶à¦¨ (New SIM, SIM Balance Limit, SIM Replacement) à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦…à¦ªà¦¶à¦¨à§‡à¦° à¦œà¦¨à§�à¦¯ à¦¡à¦¾à§Ÿà¦¨à¦¾à¦®à¦¿à¦• à¦«à¦¿à¦²à§�à¦¡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "480",
    "date": "2026-09-19T15:09",
    "type": "New Feature / UI",
    "module": "Separation",
    "link": "/separation-resignation-request",
    "descriptionEn": "Designed and integrated a unified Resignation Approval View Modal for better readability of resignation details, clearance statuses, and signatures.",
    "descriptionBn": "à¦°à¦¿à¦œà¦¾à¦‡à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸, à¦•à§�à¦²à¦¿à§Ÿà¦¾à¦°à§‡à¦¨à§�à¦¸ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦�à¦¬à¦‚ à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦¸à¦¹à¦œà§‡ à¦ªà§œà¦¾à¦° à¦œà¦¨à§�à¦¯ à¦�à¦•à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ Resignation Approval View Modal à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦“ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "479",
    "date": "2026-09-19T14:49",
    "type": "UI Update",
    "module": "SSP Requisition",
    "link": "/ssp-sim-requisition",
    "descriptionEn": "Removed the Corporate SIM Policy Notice section from the SIM Requisition application form for a cleaner user interface.",
    "descriptionBn": "à¦¸à¦¿à¦® à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦«à¦°à§�à¦® à¦¥à§‡à¦•à§‡ 'Corporate SIM Policy Notice' à¦¸à§‡à¦•à¦¶à¦¨à¦Ÿà¦¿ à¦¸à¦°à¦¿à§Ÿà§‡ à¦«à§‡à¦²à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à¦«à§‡à¦¸à¦Ÿà¦¿ à¦†à¦°à¦“ à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦° à¦“ à¦¸à¦¹à¦œà¦¬à§‹à¦§à§�à¦¯ à¦¹à§Ÿà¥¤"
  },
  {
    "id": "478",
    "date": "2026-09-19T14:15",
    "type": "UI / UX Update",
    "module": "SSP Requisition",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Converted the SIM Requisition view into an interactive modal dialog matching the exact layout and design standards of the Leave Application view modal. Features structured employee details, full requisition particulars table, 3-tier approval signatures workflow, and comments history.",
    "descriptionBn": "à¦¸à¦¿à¦® à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦­à¦¿à¦‰à¦Ÿà¦¿à¦•à§‡ à¦ªà§ƒà¦¥à¦• à¦ªà§‡à¦œà§‡à¦° à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à§‡ à¦²à¦¿à¦­ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦®à¦¤à§‹ à¦�à¦•à¦Ÿà¦¿ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à§‡à¦•à§�à¦Ÿà¦¿à¦­ à¦®à§‹à¦¡à¦¾à¦²à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦°à§Ÿà§‡à¦›à§‡ à¦¸à§�à¦¨à§�à¦¦à¦° à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à§€ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸, à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦Ÿà§‡à¦¬à¦¿à¦², à§©-à¦¸à§�à¦¤à¦°à§‡à¦° à¦…à¦¨à§�à¦®à§‹à¦¦à¦¨ à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦«à§�à¦²à§‹ à¦�à¦¬à¦‚ à¦•à¦®à§‡à¦¨à§�à¦Ÿà¦¸ à¦¹à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿à¥¤"
  },
  {
    "id": "477",
    "date": "2026-09-19T14:06",
    "type": "UI Update",
    "module": "SSP Requisition",
    "link": "/ssp-sim-requisition-view",
    "descriptionEn": "Redesigned the SIM Requisition Slip view to exactly match the standard official requisition table layout with a header, request details block, 8-row data table, 3 approval signature blocks, and comments history.",
    "descriptionBn": "à¦…à¦«à¦¿à¦¸à¦¿à§Ÿà¦¾à¦² à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦Ÿà§‡à¦¬à¦¿à¦² à¦²à§‡à¦†à¦‰à¦Ÿà§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦®à¦¿à¦² à¦°à§‡à¦–à§‡ à¦¸à¦¿à¦® à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦¸à§�à¦²à¦¿à¦ª à¦­à¦¿à¦‰à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ à¦•à¦°à§‡ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦°à§Ÿà§‡à¦›à§‡ à¦¹à§‡à¦¡à¦¾à¦°, à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦°à¦¿à¦•à§�à§Ÿà§‡à¦¸à§�à¦Ÿ à¦¬à§�à¦²à¦•, à§®-à¦¸à¦¾à¦°à¦¿ à¦¬à¦¿à¦¶à¦¿à¦·à§�à¦Ÿ à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦², à§©à¦Ÿà¦¿ à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦¬à§�à¦²à¦• à¦�à¦¬à¦‚ à¦•à¦®à§‡à¦¨à§�à¦Ÿà¦¸ à¦¹à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿à¥¤"
  },
  {
    "id": "476",
    "date": "2026-09-19T14:15",
    "type": "UI Update",
    "module": "SSP Requisition",
    "link": "/ssp-sim-requisition",
    "descriptionEn": "Simplified the SIM Requisition form by removing the Preferred Operator field, Quick Justification Templates, and the suggestions list from the Requisition For field.",
    "descriptionBn": "à¦¸à¦¿à¦® à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦«à¦°à§�à¦®à¦Ÿà¦¿ à¦†à¦°à¦“ à¦¸à¦¹à¦œ à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ Preferred Operator à¦«à¦¿à¦²à§�à¦¡, Quick Justification Templates à¦�à¦¬à¦‚ Requisition For à¦«à¦¿à¦²à§�à¦¡à§‡à¦° à¦¸à¦¾à¦œà§‡à¦¶à¦¨ à¦²à¦¿à¦¸à§�à¦Ÿ à¦°à¦¿à¦®à§�à¦­ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "475",
    "date": "2026-09-19T14:10",
    "type": "New Feature",
    "module": "SSP Requisition",
    "link": "/ssp-sim-requisition",
    "descriptionEn": "Designed and deployed the SIM Requisition system (/ssp-sim-requisition) and official slip view (/ssp-sim-requisition-view). Features Request For dropdown, preferred operator picker, justification input with quick templates, document attachments, and an On Behalf toggle revealing Section and Requisition For fields. Submitting instantly registers the requisition into the My Requisitions table with full slip view access.",
    "descriptionBn": "à¦¸à¦¿à¦® à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦® (/ssp-sim-requisition) à¦�à¦¬à¦‚ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² à¦¸à§�à¦²à¦¿à¦ª à¦­à¦¿à¦‰ (/ssp-sim-requisition-view) à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦“ à¦šà¦¾à¦²à§� à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦°à§Ÿà§‡à¦›à§‡ Request For à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨, à¦…à¦ªà¦¾à¦°à§‡à¦Ÿà¦° à¦¨à¦¿à¦°à§�à¦¬à¦¾à¦šà¦¨, à¦•à§�à¦‡à¦• à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿà¦¸à¦¹ Justification à¦‡à¦¨à¦ªà§�à¦Ÿ, à¦«à¦¾à¦‡à¦² à¦…à§�à¦¯à¦¾à¦Ÿà¦¾à¦šà¦®à§‡à¦¨à§�à¦Ÿ à¦�à¦¬à¦‚ On Behalf à¦…à¦ªà¦¶à¦¨ à¦¯à¦¾ à¦¸à¦šà¦² à¦•à¦°à¦²à§‡ Section à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦“ Requisition For à¦‡à¦¨à¦ªà§�à¦Ÿ à¦«à¦¿à¦²à§�à¦¡ à¦¦à§ƒà¦¶à§�à¦¯à¦®à¦¾à¦¨ à¦¹à§Ÿà¥¤ à¦¸à¦¾à¦¬à¦®à¦¿à¦Ÿ à¦•à¦°à¦¾à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à¦¾à¦¥à§‡ à¦¤à¦¾ My Requisition à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ à¦¯à§�à¦•à§�à¦¤ à¦¹à§Ÿà§‡ à¦¯à¦¾à§Ÿ à¦�à¦¬à¦‚ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¸à§�à¦²à¦¿à¦ª à¦­à¦¿à¦‰ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à§Ÿà¥¤"
  },
  {
    "id": "474",
    "date": "2026-09-15T16:50",
    "type": "Bug Fix / Improvement",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Restored the missing 'Leave Count' column in the Bulk Leave allocation data table (/bulk-leave). The column displays high-density badges for Casual Leave (CL), Sick Leave (SL), and Earned Leave (EL) balances for each employee, complete with sort headers, responsive colSpan handling, and updated CSV export support.",
    "descriptionBn": "Bulk Leave à¦ªà§‡à¦œà§‡à¦° (/bulk-leave) à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ à¦ªà§‚à¦°à§�à¦¬à§‡ à¦¬à¦¾à¦¦ à¦ªà§œà§‡ à¦¯à¦¾à¦“à§Ÿà¦¾ 'Leave Count' à¦•à¦²à¦¾à¦®à¦Ÿà¦¿ à¦ªà§�à¦¨à¦°à¦¾à§Ÿ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦•à¦°à§�à¦®à§€à¦° à¦œà¦¨à§�à¦¯ Casual Leave (CL), Sick Leave (SL), à¦�à¦¬à¦‚ Earned Leave (EL) à¦¬à§�à¦¯à¦¾à¦²à§‡à¦¨à§�à¦¸ à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦° à¦¬à§�à¦¯à¦¾à¦œà§‡à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à¦šà§�à¦›à§‡, à¦¸à¦¾à¦¥à§‡ à¦¸à¦°à§�à¦Ÿ à¦¹à§‡à¦¡à¦¾à¦° à¦�à¦¬à¦‚ CSV à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¸à§�à¦¬à¦¿à¦§à¦¾à¦° à¦¸à¦¾à¦¥à§‡à¦“ à¦¸à¦®à¦¨à§�à¦¬à¦¯à¦¼ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "473",
    "date": "2026-09-15T12:45",
    "type": "UI Update",
    "module": "Counseling",
    "link": "/welfare-verification",
    "descriptionEn": "Redesigned the 'Welfare Verification' page layout to match the premium Show Cause Notices style. Applied consistent dark mode compatibility, card-based filter console, refined iconography, updated the data table aesthetics, and enhanced the 'View Action Details' modal with premium styling.",
    "descriptionBn": "'Welfare Verification' à¦ªà§‡à¦œà§‡à¦° à¦²à§‡à¦†à¦‰à¦Ÿà¦Ÿà¦¿ à¦ªà§�à¦°à¦¿à¦®à¦¿à¦¯à¦¼à¦¾à¦® 'Show Cause Notices' à¦¸à§�à¦Ÿà¦¾à¦‡à¦²à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à¦¾à¦®à¦žà§�à¦œà¦¸à§�à¦¯à¦ªà§‚à¦°à§�à¦£ à¦•à¦°à§‡ à¦°à¦¿à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦¡à¦¾à¦°à§�à¦• à¦®à§‹à¦¡ à¦¸à¦¾à¦ªà§‹à¦°à§�à¦Ÿ, à¦•à¦¾à¦°à§�à¦¡-à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦¨à¦¸à§‹à¦², à¦šà¦®à§Žà¦•à¦¾à¦° à¦†à¦‡à¦•à¦¨à§‹à¦—à§�à¦°à¦¾à¦«à¦¿, à¦¨à¦¤à§�à¦¨ à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦�à¦¬à¦‚ 'View Action Details' à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿à¦¤à§‡ à¦ªà§�à¦°à¦¿à¦®à¦¿à¦¯à¦¼à¦¾à¦® à¦²à§�à¦• à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "472",
    "date": "2026-09-15T12:40",
    "type": "UI Update",
    "module": "Counseling",
    "link": "/welfare-verification",
    "descriptionEn": "Fixed the 'Welfare Verification' data table to correctly map inline editable fields (Absent Reason, Reporting Boss, Hr Remarks, Action Remarks dropdown, Verification Phone No., Welfare Action Status dropdown, Welfare Remarks) according to the reference design. Also updated the 'View Action Details' modal to correctly display the historical counselling data for each employee.",
    "descriptionBn": "à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ 'Welfare Verification' à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦²à§‡à¦° à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ à¦�à¦¡à¦¿à¦Ÿà§‡à¦¬à¦² à¦«à¦¿à¦²à§�à¦¡à¦¸ (Absent Reason, Reporting Boss, Hr Remarks, Action Remarks dropdown, Verification Phone No., Welfare Action Status dropdown, Welfare Remarks) à¦¸à¦ à¦¿à¦•à¦­à¦¾à¦¬à§‡ à¦®à§�à¦¯à¦¾à¦ª à¦•à¦°à§‡ à¦«à¦¿à¦•à§�à¦¸ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦›à¦¾à§œà¦¾à¦“ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦•à¦°à§�à¦®à¦šà¦¾à¦°à§€à¦° à¦�à¦¤à¦¿à¦¹à¦¾à¦¸à¦¿à¦• à¦•à¦¾à¦‰à¦¨à§�à¦¸à§‡à¦²à¦¿à¦‚ à¦¡à¦¾à¦Ÿà¦¾ à¦¸à¦ à¦¿à¦•à¦­à¦¾à¦¬à§‡ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¨à§‡à¦° à¦œà¦¨à§�à¦¯ 'View Action Details' à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "471",
    "date": "2026-09-15T12:38",
    "type": "UI Update",
    "module": "Counseling",
    "link": "/absent-counseling",
    "descriptionEn": "Upgraded the 'Absent Counseling' data table to include detailed absentee metrics (Total Absent, Total Absent Monthly, Total Absent Yearly, Last Present Date) and interactive inline editable fields (Absent Reason, Reporting Boss, Hr Remarks, Action Remarks dropdown, Verification Phone No.). The mock data was also updated with 6 new realistic records to showcase the layout.",
    "descriptionBn": "'Absent Counseling' à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à§‡ à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦…à§�à¦¯à¦¾à¦¬à¦¸à§‡à¦¨à§�à¦Ÿ à¦®à§‡à¦Ÿà§�à¦°à¦¿à¦•à§�à¦¸ (Total Absent, Total Absent Monthly, Total Absent Yearly, Last Present Date) à¦�à¦¬à¦‚ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à§‡à¦•à§�à¦Ÿà¦¿à¦­ à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ à¦�à¦¡à¦¿à¦Ÿà§‡à¦¬à¦² à¦«à¦¿à¦²à§�à¦¡à¦¸ (Absent Reason, Reporting Boss, Hr Remarks, Action Remarks dropdown, Verification Phone No.) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦²à§‡à¦†à¦‰à¦Ÿ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¨à§‡à¦° à¦œà¦¨à§�à¦¯ à§¬à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ à¦¬à¦¾à¦¸à§�à¦¤à¦¬à¦¸à¦®à§�à¦®à¦¤ à¦°à§‡à¦•à¦°à§�à¦¡ à¦®à¦• à¦¡à¦¾à¦Ÿà¦¾à§Ÿ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "470",
    "date": "2026-09-15T12:37",
    "type": "New Feature",
    "module": "Counseling",
    "link": "/welfare-verification",
    "descriptionEn": "Created the 'Welfare Verification' page (/welfare-verification). It utilizes the same consistent ERP filter console layout (Date, Employee Type, Department, Section, etc.) and 'Reporting Boss' edit section. The data table has been extended to include new welfare-specific columns (Last Present Date, Absent Reason, HR Remarks, Action Remarks, Verification Phone No, Welfare Action Status, Welfare Remarks, and Status) populated with realistic data.",
    "descriptionBn": "à¦¨à¦¤à§�à¦¨ 'Welfare Verification' à¦ªà§‡à¦œ (/welfare-verification) à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦�à¦•à¦‡ à¦°à¦•à¦® à¦‡à¦†à¦°à¦ªà¦¿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦¨à¦¸à§‹à¦² à¦²à§‡à¦†à¦‰à¦Ÿ à¦�à¦¬à¦‚ 'Reporting Boss' à¦�à¦¡à¦¿à¦Ÿ à¦¸à§‡à¦•à¦¶à¦¨ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ à¦¨à¦¤à§�à¦¨ à¦“à§Ÿà§‡à¦²à¦«à§‡à§Ÿà¦¾à¦° à¦¸à¦‚à¦•à§�à¦°à¦¾à¦¨à§�à¦¤ à¦•à¦²à¦¾à¦® (Last Present Date, Absent Reason, HR Remarks, Action Remarks, Verification Phone No, Welfare Action Status, Welfare Remarks, à¦�à¦¬à¦‚ Status) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¬à¦¾à¦¸à§�à¦¤à¦¬à¦¸à¦®à§�à¦®à¦¤ à¦¡à¦¾à¦Ÿà¦¾ à¦¦à§�à¦¬à¦¾à¦°à¦¾ à¦ªà§‚à¦°à§�à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "469",
    "date": "2026-09-15T12:35",
    "type": "New Feature",
    "module": "Counseling",
    "link": "/absent-counseling",
    "descriptionEn": "Created the 'Absent Counseling' page (/absent-counseling) matching the reference UI. It features a comprehensive filter console (Date, Employee Type, Department, Section, Designation, Unit, Line, Shift, Current Shift, Job Nature, Employee Id, and System/Office toggle). Included a 'Reporting Boss' inline edit section, Export toolbar (Excel, Print, PDF), and a high-density data table with a 'View Action Details' modal that displays complete counseling history.",
    "descriptionBn": "à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦‡à¦‰à¦†à¦‡ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¨à¦¤à§�à¦¨ 'Absent Counseling' à¦ªà§‡à¦œ (/absent-counseling) à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦°à§Ÿà§‡à¦›à§‡ à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦¨à¦¸à§‹à¦² (Date, Employee Type, Department, Section, Designation, Unit, Line, Shift, Current Shift, Job Nature, Employee Id, à¦�à¦¬à¦‚ System/Office à¦Ÿà¦—à¦²)à¥¤ à¦�à¦›à¦¾à§œà¦¾à¦“ à¦°à§Ÿà§‡à¦›à§‡ 'Reporting Boss' à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ à¦�à¦¡à¦¿à¦Ÿ à¦¸à§‡à¦•à¦¶à¦¨, à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦Ÿà§�à¦²à¦¬à¦¾à¦° (Excel, Print, PDF), à¦�à¦¬à¦‚ à¦�à¦•à¦Ÿà¦¿ à¦¹à¦¾à¦‡-à¦¡à§‡à¦¨à¦¸à¦¿à¦Ÿà¦¿ à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¯à¦¾à¦° 'View Action Details' à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦•à¦¾à¦‰à¦¨à§�à¦¸à§‡à¦²à¦¿à¦‚ à¦¹à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à§Ÿà¥¤"
  },
  {
    "id": "468",
    "date": "2026-09-15T12:30",
    "type": "New Addition",
    "module": "Navigation",
    "descriptionEn": "Added a new 'Counseling' menu to the sidebar navigation with two sub-menus: 'Absent Counseling' and 'Welfare Verification'.",
    "descriptionBn": "à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨à§‡ à¦¨à¦¤à§�à¦¨ 'Counseling' à¦®à§‡à¦¨à§� à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦�à¦° à¦…à¦§à§€à¦¨à§‡ 'Absent Counseling' à¦“ 'Welfare Verification' à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "467",
    "date": "2026-09-15T12:25",
    "type": "UI Update",
    "module": "Budget",
    "link": "/budget-overtime",
    "descriptionEn": "Redesigned the Overtime Budget & OT Limit page (/budget-overtime) to match the standard ERP design layout found in My Requisitions. Added a clean, unified top header, refined the filter console elements (Year, Month, Department) inside a modern card, and implemented the standard high-density soft-accent data table for editing OT hours and amounts.",
    "descriptionBn": "à¦“à¦­à¦¾à¦°à¦Ÿà¦¾à¦‡à¦® à¦¬à¦¾à¦œà§‡à¦Ÿ à¦“ à¦“à¦Ÿà¦¿ à¦²à¦¿à¦®à¦¿à¦Ÿ à¦ªà§‡à¦œà¦Ÿà¦¿ (/budget-overtime) à¦°à¦¿à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à§‡ 'My Requisitions' à¦�à¦° à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦¡à¦¾à¦°à§�à¦¡ à¦‡à¦†à¦°à¦ªà¦¿ à¦²à§‡à¦†à¦‰à¦Ÿà§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à¦¾à¦®à¦žà§�à¦œà¦¸à§�à¦¯à¦ªà§‚à¦°à§�à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦‰à¦ªà¦°à§‡ à¦�à¦•à¦Ÿà¦¿ à¦•à§�à¦²à¦¿à¦¨ à¦“ à¦‡à¦‰à¦¨à¦¿à¦«à¦¾à¦‡à¦¡ à¦¹à§‡à¦¡à¦¾à¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦¨à¦¸à§‹à¦² (à¦¬à¦›à¦°, à¦®à¦¾à¦¸, à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ) à¦�à¦•à¦Ÿà¦¿ à¦†à¦§à§�à¦¨à¦¿à¦• à¦•à¦¾à¦°à§�à¦¡à§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦“à¦Ÿà¦¿ à¦†à¦“à§Ÿà¦¾à¦°à¦¸ à¦“ à¦…à§�à¦¯à¦¾à¦®à¦¾à¦‰à¦¨à§�à¦Ÿ à¦�à¦¡à¦¿à¦Ÿà§‡à¦° à¦œà¦¨à§�à¦¯ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦¡à¦¾à¦°à§�à¦¡ à¦¹à¦¾à¦‡-à¦¡à§‡à¦¨à¦¸à¦¿à¦Ÿà¦¿ à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² à¦‡à¦®à¦ªà§�à¦²à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "466",
    "date": "2026-09-15T11:55",
    "type": "New Feature / Refactor",
    "module": "SSP Requisition",
    "link": "/ssp-product-budget-request",
    "descriptionEn": "Merged 'General Product Budget Request' and 'ICT Product Budget Request' into a single unified 'Product Budget Request' portal (/ssp-product-budget-request) and card in the Requisition Hub. Added an in-form Product Requisition Type selector toggle (General vs ICT) that dynamically updates categories and product catalog options.",
    "descriptionBn": "à¦†à¦²à¦¾à¦¦à¦¾ à¦¥à¦¾à¦•à¦¾ 'General Product Budget Request' à¦�à¦¬à¦‚ 'ICT Product Budget Request' à¦ªà§‡à¦œ à¦¦à§�à¦Ÿà¦¿à¦•à§‡ à¦�à¦•à¦¤à§�à¦°à¦¿à¦¤ à¦•à¦°à§‡ à¦�à¦•à¦Ÿà¦¿ à¦�à¦•à¦• 'Product Budget Request' à¦ªà§‹à¦°à§�à¦Ÿà¦¾à¦²à§‡ (/ssp-product-budget-request) à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦°à¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦«à¦°à§�à¦®à§‡à¦° à¦­à§‡à¦¤à¦°à§‡ 'Product Requisition Type' à¦¸à¦¿à¦²à§‡à¦•à¦¶à¦¨ à¦…à¦ªà¦¶à¦¨ (General à¦“ ICT) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¾à¦° à¦‰à¦ªà¦° à¦¨à¦¿à¦°à§�à¦­à¦° à¦•à¦°à§‡ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦•à¦¾à¦²à¦¿ à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿ à¦“ à¦ªà§�à¦°à§‹à¦¡à¦¾à¦•à§�à¦Ÿ à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦²à¦— à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à§‡à¥¤"
  },
  {
    "id": "456",
    "date": "2026-09-14T18:03",
    "type": "UI Update",
    "module": "Attendance",
    "link": "/pending-manual-attendance",
    "descriptionEn": "Redesigned Approve Manual Attendance page (/pending-manual-attendance) matching reference ERP layout: top filter console with Start Date *, End Date *, Employee Type, Sub Department, Job Title, Unit, Line, Employee Id, Status, and SEARCH button; export toolbar with EXCEL, PRINT, and PDF buttons; high-density data table with Action (Pencil), Reason, Emp ID, Name, Department, Designation, Date, In Time, Out Date, Out Time, System Data (formatted multi-line card), and HOD status; and bottom-left APPROVE action button.",
    "descriptionBn": "à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ ERP à¦²à§‡à¦†à¦‰à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­ à¦®à§�à¦¯à¦¾à¦¨à§�à§Ÿà¦¾à¦² à¦…à§�à¦¯à¦¾à¦Ÿà§‡à¦¨à¦¡à§‡à¦¨à§�à¦¸ à¦ªà§‡à¦œà¦Ÿà¦¿ (/pending-manual-attendance) à¦ªà§�à¦¨à¦°à§�à¦¨à¦¿à¦°à§�à¦®à¦¾à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦¨à¦¸à§‹à¦²à§‡ Start Date *, End Date *, Employee Type, Sub Department, Job Title, Unit, Line, Employee Id, Status à¦�à¦¬à¦‚ SEARCH à¦¬à¦¾à¦Ÿà¦¨; à¦Ÿà§‡à¦¬à¦¿à¦² à¦•à¦¾à¦°à§�à¦¡à§‡ EXCEL, PRINT, PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨; à¦¹à¦¾à¦‡-à¦¡à§‡à¦¨à¦¸à¦¿à¦Ÿà¦¿ à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² (Action, Reason, Emp ID, Name, Department, Designation, Date, In Time, Out Date, Out Time, System Data à¦•à¦¾à¦°à§�à¦¡, HOD); à¦�à¦¬à¦‚ à¦¨à¦¿à¦šà§‡ à¦¬à¦Ÿà¦®-à¦²à§‡à¦«à¦Ÿà§‡ APPROVE à¦¬à¦¾à¦Ÿà¦¨à¥¤"
  },
  {
    "id": "455",
    "date": "2026-09-14T17:00",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-approval",
    "descriptionEn": "Updated the 'Reschedule & Allocate Alternate Slot' modal on the Conference Room Approval Portal (/conference-room-approval): embedded top 'View Booking' summary card with 4-column detail grid and RESPONSIBLE PERSONS sub-table; added 'Allocate Date *' date picker alongside Allocate Room *, Allocate Start Time *, and Allocate End Time * controls; removed quick suggestion chips.",
    "descriptionBn": "à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦ªà§‹à¦°à§�à¦Ÿà¦¾à¦²à§‡ (/conference-room-approval) 'Reschedule & Allocate Alternate Slot' à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦‰à¦ªà¦°à§‡ 'View Booking' à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦•à¦¾à¦°à§�à¦¡ à¦“ RESPONSIBLE PERSONS à¦¸à¦¾à¦¬-à¦Ÿà§‡à¦¬à¦¿à¦² à¦�à¦®à§�à¦¬à§‡à¦¡ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡; à¦¨à¦¿à¦šà§‡ Allocate Room *, Allocate Start Time *, Allocate End Time * à¦�à¦° à¦¸à¦¾à¦¥à§‡ à¦¨à¦¤à§�à¦¨ 'Allocate Date *' à¦¡à§‡à¦Ÿ à¦ªà¦¿à¦•à¦¾à¦ª à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦…à¦ªà¦¶à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ quick suggestion chips à¦¸à¦°à¦¿à¦¯à¦¼à§‡ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "465",
    "date": "2026-09-14T16:53",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-booking",
    "descriptionEn": "Cleaned up Conference Room Booking page (/conference-room-booking) UI per user request: removed the top 4 metric stat cards and the target room selector grid, placing the Booking Details form and Booked Slots live table directly below the page header.",
    "descriptionBn": "à¦‡à¦‰à¦œà¦¾à¦° à¦°à¦¿à¦•à§‹à§Ÿà§‡à¦¸à§�à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦¬à§�à¦•à¦¿à¦‚ à¦ªà§‡à¦œà§‡à¦° (/conference-room-booking) à¦“à¦ªà¦°à§‡à¦° à§ªà¦Ÿà¦¿ à¦®à§‡à¦Ÿà§�à¦°à¦¿à¦• à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿ à¦•à¦¾à¦°à§�à¦¡ à¦�à¦¬à¦‚ à¦Ÿà¦¾à¦°à§�à¦—à§‡à¦Ÿ à¦°à§�à¦® à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° à¦—à§�à¦°à¦¿à¦¡ à¦¸à¦°à¦¿à¦¯à¦¼à§‡ à¦¨à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡; à¦¬à§�à¦•à¦¿à¦‚ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦«à¦°à§�à¦® à¦“ à¦¬à§�à¦•à¦¡ à¦¸à§�à¦²à¦Ÿà¦¸ à¦Ÿà§‡à¦¬à¦¿à¦² à¦�à¦–à¦¨ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦ªà§‡à¦œ à¦¹à§‡à¦¡à¦¾à¦°à§‡à¦° à¦¨à¦¿à¦šà§‡ à¦¦à§‡à¦–à¦¤à§‡ à¦ªà¦¾à¦“à§Ÿà¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "464",
    "date": "2026-09-14T16:52",
    "type": "Bug Fix",
    "module": "Facility Management",
    "link": "/conference-room-booking",
    "descriptionEn": "Fixed runtime ReferenceError in Conference Room Booking page (/conference-room-booking): resolved undefined 'meetingRoom' variable in room select dropdown by binding directly to activeRoom.name and setSelectedRoomId state handler.",
    "descriptionBn": "à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦¬à§�à¦•à¦¿à¦‚ à¦ªà§‡à¦œà§‡à¦° (/conference-room-booking) à¦®à§‡à¦¾à¦Ÿà¦¾à¦² à¦“ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà§‡ à¦¥à¦¾à¦•à¦¾ à¦…à¦¨à¦¾à¦•à¦¾à¦™à§�à¦•à§�à¦·à¦¿à¦¤ ReferenceError à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦«à¦¿à¦²à§�à¦¡à§‡ activeRoom.name à¦“ setSelectedRoomId à¦¬à¦¾à¦‡à¦¨à§�à¦¡à¦¿à¦‚ à¦¨à¦¿à¦¶à§�à¦šà¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "463",
    "date": "2026-09-14T16:51",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-approval",
    "descriptionEn": "Redesigned Conference Room Approval modals (/conference-room-approval) with ultra-professional executive styling: rounded-3xl dialogs with backdrop blur, icon avatar headers, structured target requisition info card with status badges, icon-prefixed dropdown selects, quick suggestion justification chips, and modern gradient action buttons.",
    "descriptionBn": "à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦ªà§‡à¦œà§‡à¦° (/conference-room-approval) à¦®à§‹à¦¡à¦¾à¦²à¦—à§�à¦²à§‹ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à¦“ à¦†à¦•à¦°à§�à¦·à¦£à§€à§Ÿ à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦ªà§�à¦¨à¦°à§�à¦¨à¦¿à¦°à§�à¦®à¦¾à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¬à§�à¦¯à¦¾à¦•à¦¡à§�à¦°à¦ª à¦¬à§�à¦²à¦¾à¦° à¦¸à¦¹ rounded-3xl à¦¡à¦¾à§Ÿà¦¾à¦²à¦—, à¦†à¦‡à¦•à¦¨ à¦…à§�à¦¯à¦¾à¦­à¦¾à¦Ÿà¦¾à¦° à¦¹à§‡à¦¡à¦¾à¦°, à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦¬à§�à¦¯à¦¾à¦œ à¦¸à¦¹ à¦¸à§�à¦Ÿà§�à¦°à¦¾à¦•à¦šà¦¾à¦°à§�à¦¡ à¦Ÿà¦¾à¦°à§�à¦—à§‡à¦Ÿ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦‡à¦¨à¦«à§‹ à¦•à¦¾à¦°à§�à¦¡, à¦†à¦‡à¦•à¦¨ à¦ªà§�à¦°à¦«à¦¿à¦•à§�à¦¸ à¦¸à¦¹ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ, à¦•à§�à¦‡à¦• à¦¸à¦¾à¦¾à¦œà§‡à¦¶à¦¨ à¦°à¦¿à¦®à¦¾à¦°à§�à¦•à¦¸ à¦šà¦¿à¦ªà¦¸ à¦�à¦¬à¦‚ à¦†à¦§à§�à¦¨à¦¿à¦• à¦—à§�à¦°à§�à¦¯à¦¾à¦¡à¦¿à§Ÿà§‡à¦¨à§�à¦Ÿ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦Ÿà¦¨à¥¤"
  },
  {
    "id": "462",
    "date": "2026-09-14T16:50",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-approval",
    "descriptionEn": "Enhanced Conference Room Approval Portal (/conference-room-approval) to allow rescheduling and cancelling of already approved room bookings, added top filter console status control (Pending, Approved, Rescheduled, All), introduced an Approved & Active Bookings table with direct 'Reschedule Slot' and 'Cancel Booking' action modals, and ensured uniform Inter font (font-sans) across all chips, badges, buttons, and high-density tables.",
    "descriptionBn": "à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦ªà§‹à¦°à§�à¦Ÿà¦¾à¦²à§‡ (/conference-room-approval) à¦‡à¦¤à¦¿à¦®à¦§à§�à¦¯à§‡ à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­ à¦¹à¦“à§Ÿà¦¾ à¦¬à§�à¦•à¦¿à¦‚à¦—à§�à¦²à§‹à¦° à¦œà¦¨à§�à¦¯ à¦°à¦¿à¦¶à¦¿à¦¡à¦¿à¦‰à¦² à¦“ à¦•à§�à¦¯à¦¾à¦¨à¦¸à§‡à¦² à¦•à¦°à¦¾à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦¨à¦¸à§‹à¦²à§‡ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¡ à¦“ à¦�à¦•à§�à¦Ÿà¦¿à¦­ à¦¬à§�à¦•à¦¿à¦‚à§Ÿà§‡à¦° à¦œà¦¨à§�à¦¯ à¦†à¦²à¦¾à¦¦à¦¾ à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² à¦ªà§�à¦°à¦¦à¦¾à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ 'Reschedule Slot' à¦“ 'Cancel Booking' à¦¬à¦¾à¦Ÿà¦¨à§‡à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦¬à§�à¦•à¦¿à¦‚ à¦¸à¦®à§Ÿ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦¬à¦¾ à¦¬à¦¾à¦¤à¦¿à¦² à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡, à¦�à¦¬à¦‚ à¦¸à¦•à¦² à¦šà¦¿à¦ª, à¦¬à§�à¦¯à¦¾à¦œ à¦“ à¦Ÿà§‡à¦¬à¦¿à¦² à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿà§‡ à¦‡à¦¨à§�à¦Ÿà¦¾à¦° à¦«à¦¨à§�à¦Ÿ (font-sans) à¦¨à¦¿à¦¶à§�à¦šà¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "461",
    "date": "2026-09-14T16:49",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-approval",
    "descriptionEn": "Refined Conference Room Approval portal (/conference-room-approval): removed extra tab toggle button and conflict warning note banner; added top filter console box with Date Filter, Room Wise Filter, and Time Slot Filter; enforced clean Inter font styling across all elements, badges, tags, and table cells.",
    "descriptionBn": "à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦ªà§‹à¦°à§�à¦Ÿà¦¾à¦²à¦Ÿà¦¿ (/conference-room-approval) à¦®à¦¾à¦°à§�à¦œà¦¿à¦¤à¦­à¦¾à¦¬à§‡ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ à¦Ÿà§�à¦¯à¦¾à¦¬ à¦Ÿà¦—à¦² à¦¬à¦¾à¦Ÿà¦¨ à¦“ à¦“à§Ÿà¦¾à¦°à§�à¦¨à¦¿à¦‚ à¦¨à§‹à¦Ÿ à¦¬à§�à¦¯à¦¾à¦¨à¦¾à¦° à¦°à¦¿à¦®à§�à¦­ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡; à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦¨à¦¸à§‹à¦²à§‡ Date Filter, Room Wise Filter à¦“ Time Slot Filter à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡; à¦�à¦¬à¦‚ à¦¸à¦¬ à¦§à¦°à¦£à§‡à¦° à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ, à¦Ÿà§‡à¦¬à¦¿à¦² à¦“ à¦¬à§�à¦¯à¦¾à¦œà§‡ à¦‡à¦¨à§�à¦Ÿà¦¾à¦° (Inter) à¦«à¦¨à§�à¦Ÿ à¦¨à¦¿à¦¶à§�à¦šà¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "460",
    "date": "2026-09-14T16:48",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-booking",
    "descriptionEn": "Completely revamped Conference Room Booking page (/conference-room-booking) UI: added top executive metric stat cards (Total Rooms, Today's Bookings, Active Target Room, Facility Utilization Rate); interactive Visual Room Selector Cards grid with 1-click room selection; active room specs preview card; high-contrast form inputs with icon prefixes; and live booked slots data table with status badges and pulsing live indicator.",
    "descriptionBn": "à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦¬à§�à¦•à¦¿à¦‚ à¦ªà§‡à¦œà§‡à¦° (/conference-room-booking) à¦‡à¦‰à¦†à¦‡ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¨à¦¤à§�à¦¨ à¦“ à¦†à¦•à¦°à§�à¦·à¦£à§€à§Ÿ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡ à¦‰à¦¨à§�à¦¨à§€à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦“à¦ªà¦°à§‡ à§ªà¦Ÿà¦¿ à¦�à¦•à§�à¦¸à¦¿à¦•à¦¿à¦‰à¦Ÿà¦¿à¦­ à¦®à§‡à¦Ÿà§�à¦°à¦¿à¦• à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿ à¦•à¦¾à¦°à§�à¦¡; à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à¦…à§�à¦¯à¦¾à¦•à§�à¦Ÿà¦¿à¦­ à¦°à§�à¦®à§‡ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° à¦•à¦¾à¦°à§�à¦¡à¦¸ à¦—à§�à¦°à¦¿à¦¡ (à§§-à¦•à§�à¦²à¦¿à¦• à¦°à§�à¦® à¦¸à¦¿à¦²à§‡à¦•à¦¶à¦¨); à¦…à§�à¦¯à¦¾à¦•à§�à¦Ÿà¦¿à¦­ à¦°à§�à¦® à¦¸à§�à¦ªà§‡à¦•à§�à¦¸ à¦ªà§�à¦°à¦¿à¦­à¦¿à¦‰ à¦•à¦¾à¦°à§�à¦¡; à¦†à¦‡à¦•à¦¨ à¦ªà§�à¦°à¦«à¦¿à¦•à§�à¦¸ à¦¸à¦¹ à¦¹à¦¾à¦‡-à¦•à¦¨à¦Ÿà§�à¦°à¦¾à¦¸à§�à¦Ÿ à¦‡à¦¨à¦ªà§�à¦Ÿ à¦«à¦¿à¦²à§�à¦¡ à¦�à¦¬à¦‚ à¦ªà¦¾à¦²à¦¸à¦¿à¦‚ à¦²à¦¾à¦‡à¦­ à¦‡à¦¨à§�à¦¡à¦¿à¦•à§‡à¦Ÿà¦° à¦¸à¦¹ à¦¬à§�à¦•à¦¡ à¦¸à§�à¦²à¦Ÿà¦¸ à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦²à¥¤"
  },
  {
    "id": "459",
    "date": "2026-09-14T16:45",
    "type": "New Feature",
    "module": "Facility Management",
    "link": "/conference-room-approval",
    "descriptionEn": "Implemented Smart Overlapping Time Window Grouping Algorithm in Conference Room Approval portal (/conference-room-approval): automatically merges overlapping time requests into a consolidated slot window (e.g., 10:00 AM - 11:00 AM, 10:30 AM - 11:00 AM, and 10:50 AM - 11:30 AM are grouped under Merged Window: 10:00 AM - 11:30 AM); inside the table view, each individual requested time slot is displayed alongside organizer details, allowing approvers to approve 1 request and reschedule/reassign the conflicting slots.",
    "descriptionBn": "à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦ªà§‹à¦°à§�à¦Ÿà¦¾à¦²à§‡ (/conference-room-approval) à¦“à¦­à¦¾à¦°à¦²à§�à¦¯à¦¾à¦ªà¦¿à¦‚ à¦Ÿà¦¾à¦‡à¦® à¦‰à¦‡à¦¨à§�à¦¡à§‹ à¦—à§�à¦°à§�à¦ªà¦¿à¦‚ à¦…à§�à¦¯à¦¾à¦²à¦—à¦°à¦¿à¦¦à¦® à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦‰à¦¦à¦¾à¦¹à¦°à¦£à¦¸à§�à¦¬à¦°à§‚à¦ª à§© à¦œà¦¨ à¦¬à§�à¦¯à¦•à§�à¦¤à¦¿à¦° à¦†à¦²à¦¾à¦¦à¦¾ à¦¸à¦®à§Ÿà¦¸à§‚à¦šà§€ (à§§à§¦:à§¦à§¦ - à§§à§§:à§¦à§¦, à§§à§¦:à§©à§¦ - à§§à§§:à§¦à§¦ à¦�à¦¬à¦‚ à§§à§¦:à§«à§¦ - à§§à§§:à§©à§¦) à¦ªà¦° à¦ªà¦° à¦“à¦­à¦¾à¦°à¦²à§�à¦¯à¦¾à¦ª à¦•à¦°à¦²à§‡ à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦® à¦¸à§�à¦¬à§Ÿà¦‚à¦•à§�à¦°à¦¿à§Ÿà¦­à¦¾à¦¬à§‡ à¦®à§‹à¦Ÿ à¦Ÿà¦¾à¦‡à¦® à¦‰à¦‡à¦¨à§�à¦¡à§‹ à¦¹à¦¿à¦¸à¦¾à¦¬ à¦•à¦°à§‡ (à§§à§¦:à§¦à§¦ - à§§à§§:à§©à§¦) à¦—à§�à¦°à§�à¦ª à¦¤à§ˆà¦°à¦¿ à¦•à¦°à§‡; à¦�à¦¬à¦‚ à¦Ÿà§‡à¦¬à¦¿à¦²à§‡à¦° à¦­à§‡à¦¤à¦°à§‡ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦¬à§�à¦¯à¦•à§�à¦¤à¦¿à¦° à¦‡à¦¨à§�à¦¡à¦¿à¦­à¦¿à¦œà§�à§Ÿà¦¾à¦² à¦¸à¦®à§Ÿà¦¸à§‚à¦šà§€ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¨ à¦•à¦°à§‡ à¦¯à¦¾à¦¤à§‡ à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦° à§§à¦Ÿà¦¿ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦ªà¦›à¦¨à§�à¦¦ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­ à¦•à¦°à§‡ à¦¬à¦¾à¦•à¦¿à¦—à§�à¦²à§‹ à¦°à¦¿-à¦¶à¦¿à¦¡à¦¿à¦‰à¦² à¦¬à¦¾ à¦°à¦¿-à¦…à§�à¦¯à¦¾à¦²à§‹à¦•à¦¿à¦‰à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à§‡à¦¨à¥¤"
  },
  {
    "id": "458",
    "date": "2026-09-14T16:42",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-booking",
    "descriptionEn": "Enhanced UI aesthetics of Conference Room Booking page (/conference-room-booking): added field label icons, live selected room specifications preview banner with seating capacity badge, polished high-contrast form inputs with focus ring highlights, refined action buttons (SUBMIT and RESET), and updated live booked slots table with pulsing status indicator.",
    "descriptionBn": "à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦¬à§�à¦•à¦¿à¦‚ à¦ªà§‡à¦œà§‡à¦° (/conference-room-booking) à¦‡à¦‰à¦†à¦‡ à¦†à¦°à¦“ à¦¸à§�à¦¨à§�à¦¦à¦° à¦“ à¦�à¦¨à§�à¦Ÿà¦¾à¦°à¦ªà§�à¦°à¦¾à¦‡à¦œ-à¦—à§�à¦°à§‡à¦¡à§‡ à¦‰à¦¨à§�à¦¨à§€à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦‡à¦¨à¦ªà§�à¦Ÿ à¦«à¦¿à¦²à§�à¦¡à§‡ à¦†à¦‡à¦•à¦¨à¦¸à¦®à§‚à¦¹ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦²à¦¾à¦‡à¦­ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà§‡à¦¡ à¦°à§�à¦® à¦¸à§�à¦ªà§‡à¦•à§�à¦¸ à¦ªà§�à¦°à¦¿à¦­à¦¿à¦‰ à¦¬à§�à¦¯à¦¾à¦¨à¦¾à¦° (à¦¸à¦¿à¦Ÿà¦¿à¦‚ à¦•à§�à¦¯à¦¾à¦ªà¦¾à¦¸à¦¿à¦Ÿà¦¿ à¦¬à§�à¦¯à¦¾à¦œ à¦¸à¦¹), à¦¹à¦¾à¦‡-à¦•à¦¨à¦Ÿà§�à¦°à¦¾à¦¸à§�à¦Ÿ à¦‡à¦¨à¦ªà§�à¦Ÿ à¦«à¦¿à¦²à§�à¦¡, à¦¬à§‹à¦¤à¦¾à¦®à§‡à¦° à¦¸à§�à¦¨à§�à¦¦à¦° à¦«à¦¿à¦¨à¦¿à¦¶à¦¿à¦‚ (SUBMIT à¦“ RESET) à¦�à¦¬à¦‚ à¦²à¦¾à¦‡à¦­ à¦†à¦ªà¦¡à§‡à¦Ÿà¦¿à¦‚ à¦¬à§�à¦•à¦¡ à¦¸à§�à¦²à¦Ÿà¦¸ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "457",
    "date": "2026-09-14T16:41",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-approval",
    "descriptionEn": "Refactored Slot-Wise Competing Groups view in Conference Room Approval portal (/conference-room-approval): each time-slot conflict container now renders a high-density Table List View with Req ID, Meeting Subject & Agenda, Organizer & Dept, Attendees, Priority, and inline action buttons (Approve, Reschedule Slot, Reject).",
    "descriptionBn": "à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦ªà§‹à¦°à§�à¦Ÿà¦¾à¦²à§‡à¦° (/conference-room-approval) à¦¸à§�à¦²à¦Ÿ-à¦“à§Ÿà¦¾à¦‡à¦œ à¦•à¦®à§�à¦ªà¦¿à¦Ÿà¦¿à¦‚ à¦—à§�à¦°à§�à¦ª à¦­à¦¿à¦‰à¦Ÿà¦¿ à¦•à¦¾à¦°à§�à¦¡ à¦—à§�à¦°à¦¿à¦¡ à¦¥à§‡à¦•à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¹à¦¾à¦‡-à¦¡à§‡à¦¨à¦¸à¦¿à¦Ÿà¦¿ à¦Ÿà§‡à¦¬à¦¿à¦² à¦²à¦¿à¦¸à§�à¦Ÿ à¦­à¦¿à¦‰à¦¤à§‡ (Table List View) à¦ªà§�à¦¨à¦°à§�à¦¨à¦¿à¦°à§�à¦®à¦¾à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦Ÿà¦¾à¦‡à¦®-à¦¸à§�à¦²à¦Ÿ à¦•à¦¨à§�à¦Ÿà§‡à¦‡à¦¨à¦¾à¦°à§‡ Req ID, Subject & Agenda, Organizer, Attendees, Priority à¦�à¦¬à¦‚ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦Ÿà¦¨à¦¸à¦¹ (Approve, Reschedule Slot, Reject) à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "456",
    "date": "2026-09-14T16:39",
    "type": "New Feature",
    "module": "Facility Management",
    "link": "/conference-room-approval",
    "descriptionEn": "Implemented Smart Time-Slot Conflict Matrix & Rescheduling Workflow in Conference Room Approval portal (/conference-room-approval): automatically groups pending requisitions by Date, Room, and Time Slot; detects competing requisitions for identical slots; enables approvers to approve 1 primary booking while reallocating competing requests to alternate available rooms or time slots via interactive Reschedule & Allocate Alternate Slot modal dialog.",
    "descriptionBn": "à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦ªà§‹à¦°à§�à¦Ÿà¦¾à¦²à¦Ÿà¦¿à¦¤à§‡ (/conference-room-approval) à¦¸à§�à¦®à¦¾à¦Ÿ à¦Ÿà¦¾à¦‡à¦®-à¦¸à§�à¦²à¦Ÿ à¦•à¦¨à¦«à§�à¦²à¦¿à¦•à§�à¦Ÿ à¦®à§�à¦¯à¦¾à¦Ÿà§�à¦°à¦¿à¦•à§�à¦¸ à¦“ à¦°à¦¿-à¦¶à¦¿à¦¡à¦¿à¦‰à¦²à¦¿à¦‚ à¦“à§Ÿà¦¾à¦°à§�à¦•à¦«à§�à¦²à§‹ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦�à¦•à¦‡ à¦Ÿà¦¾à¦‡à¦® à¦¸à§�à¦²à¦Ÿ à¦“ à¦°à§�à¦®à§‡ à¦†à¦¬à§‡à¦¦à¦¨à¦•à§ƒà¦¤ à¦�à¦•à¦¾à¦§à¦¿à¦• à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨à¦—à§�à¦²à§‹à¦•à§‡ à¦—à§�à¦°à§�à¦ª à¦•à¦°à§‡ à¦•à¦¨à¦«à§�à¦²à¦¿à¦•à§�à¦Ÿ à¦¬à§�à¦¯à¦¾à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à§‡; à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦° à¦�à¦•à¦Ÿà¦¿ à¦ªà§�à¦°à¦¾à¦‡à¦®à¦¾à¦°à¦¿ à¦†à¦¬à§‡à¦¦à¦¨ à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­ à¦•à¦°à§‡ à¦¬à¦¾à¦•à¦¿ à¦ªà§�à¦°à¦¤à¦¿à¦¦à§�à¦¬à¦¨à§�à¦¦à§�à¦¬à§€ à¦†à¦¬à§‡à¦¦à¦¨à¦—à§�à¦²à§‹à¦•à§‡ à¦¬à¦¿à¦•à¦²à§�à¦ª à¦�à¦­à§‡à¦²à§‡à¦¬à¦² à¦¸à§�à¦²à¦Ÿ à¦¬à¦¾ à¦°à§�à¦®à§‡ (Reschedule & Allocate Alternate Slot à¦®à§‹à¦¡à¦¾à¦² à¦¦à¦¿à§Ÿà§‡) à¦ªà§�à¦¨à¦°à¦¾à§Ÿ à¦¬à¦°à¦¾à¦¦à§�à¦¦à§‡à¦° à¦¸à§�à¦¯à§‹à¦— à¦ªà¦¾à¦¨à¥¤"
  },
  {
    "id": "455",
    "date": "2026-09-14T16:36",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-booking-list",
    "descriptionEn": "Redesigned Conference Room Booking List page (/conference-room-booking-list) matching reference ERP layout: top filter console with From Date, To Date, and SEARCH button; table card toolbar with EXCEL, PRINT, and PDF export buttons alongside right-side Search bar; soft-accent header data table with Action (Eye & Pencil icons), Meeting Room, Date, Start Time, End Time, Agenda, Total Participants, Responsible Depts., and Status columns; bottom entries count and pagination; interactive View Booking modal with Responsible Persons sub-table; and Edit Booking modal with tag pills and UPDATE/CLOSE action buttons.",
    "descriptionBn": "à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦¬à§�à¦•à¦¿à¦‚ à¦²à¦¿à¦¸à§�à¦Ÿ à¦ªà§‡à¦œà¦Ÿà¦¿ (/conference-room-booking-list) à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ ERP à¦²à§‡à¦†à¦‰à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦ªà§�à¦¨à¦°à§�à¦¨à¦¿à¦°à§�à¦®à¦¾à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦¨à¦¸à§‹à¦²à§‡ From Date, To Date à¦“ SEARCH à¦¬à¦¾à¦Ÿà¦¨; à¦Ÿà§‡à¦¬à¦¿à¦² à¦•à¦¾à¦°à§�à¦¡à§‡ EXCEL, PRINT, PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨ à¦“ Search à¦¬à¦¾à¦°; à¦¸à¦«à¦Ÿ à¦…à§�à¦¯à¦¾à¦•à¦¸à§‡à¦¨à§�à¦Ÿ à¦¹à§‡à¦¡à¦¾à¦° à¦¸à¦¹ à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² (Action, Meeting Room, Date, Start Time, End Time, Agenda, Total Participants, Responsible Depts., Status); à¦¨à¦¿à¦šà§‡ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿à¦œ à¦•à¦¾à¦‰à¦¨à§�à¦Ÿ à¦“ à¦ªà§‡à¦œà¦¿à¦¨à§‡à¦¶à¦¨; Responsible Persons à¦¸à¦¾à¦¬-à¦Ÿà§‡à¦¬à¦¿à¦² à¦¸à¦¹ View Booking à¦®à§‹à¦¡à¦¾à¦²; à¦�à¦¬à¦‚ à¦Ÿà§�à¦¯à¦¾à¦— à¦šà¦¿à¦ªà¦¸ à¦¸à¦¹ Edit Booking à¦®à§‹à¦¡à¦¾à¦²à¥¤"
  },
  {
    "id": "454",
    "date": "2026-09-14T16:34",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-booking",
    "descriptionEn": "Redesigned Conference Room Booking page (/conference-room-booking) matching reference ERP 2-column layout: left column features 'Booking Details' form card with Date *, Meeting Room *, Start Time *, End Time *, Total Participants *, Agenda *, Responsible Department *, Responsible Persons *, and bottom-left SUBMIT and RESET action buttons; right column features 'Booked Slots' high-density live table grid with Start, End, Booked By, Meeting Agenda, Room, and Status columns.",
    "descriptionBn": "à¦•à¦¨à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦°à§�à¦® à¦¬à§�à¦•à¦¿à¦‚ à¦ªà§‡à¦œà¦Ÿà¦¿ (/conference-room-booking) à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ ERP à¦�à¦° à¦®à¦¤à§‹ à§¨-à¦•à¦²à¦¾à¦® à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦ªà§�à¦¨à¦°à§�à¦¨à¦¿à¦°à§�à¦®à¦¾à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¬à¦¾à¦® à¦•à¦²à¦¾à¦®à§‡ 'Booking Details' à¦«à¦°à§�à¦® (Date *, Meeting Room *, Start Time *, End Time *, Total Participants *, Agenda *, Responsible Department *, Responsible Persons * à¦“ à¦¬à¦Ÿà¦®-à¦²à§‡à¦«à¦Ÿà§‡ SUBMIT à¦�à¦¬à¦‚ RESET à¦¬à¦¾à¦Ÿà¦¨); à¦�à¦¬à¦‚ à¦¡à¦¾à¦¨ à¦•à¦²à¦¾à¦®à§‡ 'Booked Slots' à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² (Start, End, Booked By, Meeting Agenda, Room, Status)à¥¤"
  },
  {
    "id": "453",
    "date": "2026-09-14T16:33",
    "type": "New Feature",
    "module": "Facility Management",
    "link": "/conference-room-booking",
    "descriptionEn": "Added new top-level sidebar menu 'Conference Room' along with 3 enterprise sub-menus: 'Conference room booking' (/conference-room-booking) featuring room selection grid, technical amenities configuration, and reservation form; 'Booking list' (/conference-room-booking-list) with filter console, status badges, and booking modal; and 'Approval' (/conference-room-approval) facility manager portal with clash warnings, approve/reject workflow, and rejection justification dialog.",
    "descriptionBn": "à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡ à¦¨à¦¤à§�à¦¨ à¦ªà§�à¦°à¦§à¦¾à¦¨ à¦®à§‡à¦¨à§� 'Conference Room' à¦�à¦¬à¦‚ à¦�à¦° à¦…à¦§à§€à¦¨à§‡ à§©à¦Ÿà¦¿ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: 'Conference room booking' (/conference-room-booking) à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦°à§�à¦® à¦¸à¦¿à¦²à§‡à¦•à¦¶à¦¨, à¦Ÿà§‡à¦•à¦¨à¦¿à¦•à§�à¦¯à¦¾à¦² à¦¸à§�à¦¯à§‹à¦—-à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦“ à¦¬à§�à¦•à¦¿à¦‚ à¦«à¦°à§�à¦® à¦°à§Ÿà§‡à¦›à§‡; 'Booking list' (/conference-room-booking-list) à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦¨à¦¸à§‹à¦² à¦“ à¦¬à§�à¦•à¦¿à¦‚ à¦¹à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦°à§Ÿà§‡à¦›à§‡; à¦�à¦¬à¦‚ 'Approval' (/conference-room-approval) à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦«à§‡à¦¸à¦¿à¦²à¦¿à¦Ÿà¦¿ à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦¾à¦° à¦•à¦¨à¦«à§�à¦²à¦¿à¦•à§�à¦Ÿ à¦šà§‡à¦• à¦•à¦°à§‡ à¦…à§�à¦¯à¦¾à¦ªà¦ªà§�à¦°à§�à¦­ à¦¬à¦¾ à¦°à¦¿à¦œà§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "452",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Restored top filter console allocation controls on the Bulk Leave page (/bulk-leave) matching reference ERP layout: Leave Type *, From Date *, To Date *, and Reason fields are located in the top filter console along with Year, Department, Section, Designation, Unit, Line, Shift, and Employee ID (Comma Separator); removed popup modal; clicking SUBMIT at the bottom-left of the table grid directly executes the bulk leave allocation for all selected employees.",
    "descriptionBn": "à¦¬à¦¾à¦²à§�à¦• à¦²à¦¿à¦­ à¦ªà§‡à¦œà§‡ (/bulk-leave) à¦¹à§�à¦¬à¦¹à§� à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ ERP à¦²à§‡à¦†à¦‰à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦²à¦¿à¦­ à¦ªà§�à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦° à¦«à¦¿à¦²à§�à¦¡à¦—à§�à¦²à§‹ (Leave Type *, From Date *, To Date *, Reason) à¦ªà§�à¦¨à¦°à¦¾à§Ÿ à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦¨à¦¸à§‹à¦²à§‡ à¦«à¦¿à¦°à¦¿à§Ÿà§‡ à¦†à¦¨à¦¾ à¦¹à§Ÿà§‡à¦›à§‡; à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ à¦®à§‹à¦¡à¦¾à¦² à¦ªà¦ªà¦†à¦ª à¦‰à¦ à¦¿à§Ÿà§‡ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡; à¦�à¦¬à¦‚ à¦Ÿà§‡à¦¬à¦¿à¦²à§‡à¦° à¦¨à¦¿à¦šà§‡ à¦¬à¦Ÿà¦®-à¦²à§‡à¦«à¦Ÿà§‡ à¦¥à¦¾à¦•à¦¾ SUBMIT à¦¬à¦¾à¦Ÿà¦¨à§‡ à¦•à§�à¦²à¦¿à¦• à¦•à¦°à¦²à§‡ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà§‡à¦¡ à¦•à¦°à§�à¦®à§€à¦¦à§‡à¦° à¦¬à¦¾à¦²à§�à¦• à¦›à§�à¦Ÿà¦¿ à¦ªà§�à¦°à¦¸à§‡à¦¸ à¦¹à§Ÿà§‡ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "451",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Refactored the 'Bulk Leave Application Parameters' modal (/bulk-leave) into a wide 2-column enterprise dialog (max-w-3xl): left column features a clean high-density candidate summary table; right column provides structured Leave Type, From/To Date controls, Duration calculation bar, and Reason note text area; completely removed preset reason chips.",
    "descriptionBn": "à¦¬à¦¾à¦²à§�à¦• à¦²à¦¿à¦­ à¦†à¦¬à§‡à¦¦à¦¨à§‡à¦° à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿ (/bulk-leave) à¦�à¦•à¦Ÿà¦¿ à¦ªà§�à¦°à¦¶à¦¸à§�à¦¤ à§¨-à¦•à¦²à¦¾à¦® à¦�à¦¨à§�à¦Ÿà¦¾à¦°à¦ªà§�à¦°à¦¾à¦‡à¦œ à¦¡à¦¾à§Ÿà¦¾à¦²à¦—à§‡ (max-w-3xl) à¦ªà§�à¦¨à¦°à§�à¦¨à¦¿à¦°à§�à¦®à¦¾à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¬à¦¾à¦® à¦•à¦²à¦¾à¦®à§‡ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà§‡à¦¡ à¦•à¦°à§�à¦®à§€à¦¦à§‡à¦° à¦¡à¦¾à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡; à¦¡à¦¾à¦¨ à¦•à¦²à¦¾à¦®à§‡ Leave Type, From/To Date, Duration à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦¶à¦¨ à¦¬à¦¾à¦° à¦“ Reason à¦«à¦¿à¦²à§�à¦¡ à¦°à¦¾à¦–à¦¾ à¦¹à§Ÿà§‡à¦›à§‡; à¦�à¦¬à¦‚ à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ à¦ªà§�à¦°à§‡à¦¸à§‡à¦Ÿ à¦šà¦¿à¦ªà¦¸à¦—à§�à¦²à§‹ à¦°à¦¿à¦®à§�à¦­ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "450",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Enhanced the 'Bulk Leave Application Parameters' modal (/bulk-leave) with executive-grade UI refinements: dark gradient header banner with icon badge and close button; candidate summary pill box showing selected employee badges with IDs; Leave Type selector; From/To date inputs with side-by-side metric cards for Leave Duration and Total Impact Man-Days; reason text area with 1-click preset reason chips; and a high-impact orange confirm button.",
    "descriptionBn": "à¦¬à¦¾à¦²à§�à¦• à¦²à¦¿à¦­ à¦†à¦¬à§‡à¦¦à¦¨à§‡à¦° à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿ (/bulk-leave) à¦†à¦°à¦“ à¦¸à§�à¦¨à§�à¦¦à¦° à¦“ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡ à¦‰à¦¨à§�à¦¨à§€à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦†à¦‡à¦•à¦¨ à¦¬à§�à¦¯à¦¾à¦œ à¦¸à¦¹ à¦¡à¦¾à¦°à§�à¦• à¦—à§�à¦°à§‡à¦¡à¦¿à§Ÿà§‡à¦¨à§�à¦Ÿ à¦¹à§‡à¦¡à¦¾à¦° à¦¬à§�à¦¯à¦¾à¦¨à¦¾à¦°; à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà§‡à¦¡ à¦•à¦°à§�à¦®à§€à¦¦à§‡à¦° à¦¨à¦¾à¦® à¦“ à¦†à¦‡à¦¡à¦¿ à¦¬à§�à¦¯à¦¾à¦œ à¦¸à¦¹ à¦•à§�à¦¯à¦¾à¦¨à§�à¦¡à¦¿à¦¡à§‡à¦Ÿ à¦²à¦¿à¦¸à§�à¦Ÿ à¦¬à¦•à§�à¦¸; à¦²à¦¿à¦­ à¦Ÿà¦¾à¦‡à¦ª à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦°; à¦¡à§‡à¦Ÿ à¦ªà¦¿à¦•à¦¾à¦°à§‡à¦° à¦ªà¦¾à¦¶à§‡ Leave Duration à¦“ Total Impact Man-Days à¦�à¦° à¦�à¦•à§�à¦¸à¦¿à¦•à¦¿à¦‰à¦Ÿà¦¿à¦­ à¦®à§‡à¦Ÿà§�à¦°à¦¿à¦• à¦•à¦¾à¦°à§�à¦¡; à§§-à¦•à§�à¦²à¦¿à¦• à¦ªà§�à¦°à§‡à¦¸à§‡à¦Ÿ à¦šà¦¿à¦ªà¦¸ à¦¸à¦¹ Reason à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦�à¦°à¦¿à§Ÿà¦¾; à¦�à¦¬à¦‚ à¦…à¦°à§‡à¦žà§�à¦œ à¦•à¦¨à¦«à¦¾à¦°à§�à¦® à¦¬à¦¾à¦Ÿà¦¨à¥¤"
  },
  {
    "id": "449",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Positioned the orange SUBMIT button directly at the bottom-left of the table grid footer panel on the Bulk Leave page (/bulk-leave) matching reference ERP layout: removed screen overlay bottom bar so users search, select employees in the table, and click SUBMIT at the bottom of the table to open the leave parameter input modal.",
    "descriptionBn": "à¦¬à¦¾à¦²à§�à¦• à¦²à¦¿à¦­ à¦ªà§‡à¦œà§‡ (/bulk-leave) à¦…à¦°à§‡à¦žà§�à¦œ SUBMIT à¦¬à¦¾à¦Ÿà¦¨à¦Ÿà¦¿ à¦¹à§�à¦¬à¦¹à§� à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ ERP à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦²à§‡à¦° à¦¬à¦Ÿà¦®-à¦²à§‡à¦«à¦Ÿ à¦«à§�à¦Ÿà¦¾à¦° à¦…à¦‚à¦¶à§‡ à¦¸à§�à¦¥à¦¾à¦ªà¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¸à§�à¦•à§�à¦°à¦¿à¦¨ à¦“à¦­à¦¾à¦°à¦²à§‡ à¦¬à¦Ÿà¦® à¦¬à¦¾à¦° à¦¸à¦°à¦¿à§Ÿà§‡ à¦¸à§�à¦¬à¦¾à¦­à¦¾à¦¬à¦¿à¦• à¦Ÿà§‡à¦¬à¦¿à¦² à¦«à§�à¦Ÿà¦¾à¦°à§‡ à¦¬à¦¾à¦Ÿà¦¨ à¦°à¦¾à¦–à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦‡à¦‰à¦œà¦¾à¦° à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¾à¦° à¦ªà¦° à¦Ÿà§‡à¦¬à¦¿à¦²à§‡à¦° à¦¨à¦¿à¦šà§‡ à¦¥à¦¾à¦•à¦¾ SUBMIT à¦¬à¦¾à¦Ÿà¦¨à§‡ à¦•à§�à¦²à¦¿à¦• à¦•à¦°à§‡ à¦²à¦¿à¦­ à¦ªà§�à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦° à¦®à§‹à¦¡à¦¾à¦² à¦šà¦¾à¦²à§� à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à§‡à¦¨à¥¤"
  },
  {
    "id": "448",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Implemented interactive 'Bulk Leave Application Parameters' submission modal on the Bulk Leave page (/bulk-leave): users search and select employees from the high-density data grid and click the orange SUBMIT button to launch a confirmation modal containing selected candidate chips preview, Leave Type selector (CL, SL, EL, CPL, LWP, ML), From Date & To Date pickers with instant duration and total man-days calculation, Reason text area, and 'Confirm & Apply Bulk Leave' submission button.",
    "descriptionBn": "à¦¬à¦¾à¦²à§�à¦• à¦²à¦¿à¦­ à¦ªà§‡à¦œà§‡ (/bulk-leave) à¦¸à¦¾à¦¬à¦®à¦¿à¦Ÿ à¦®à§‹à¦¡à¦¾à¦² à¦‡à¦¨à§�à¦Ÿà¦¿à¦—à§�à¦°à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦“ à¦—à§�à¦°à¦¿à¦¡ à¦¥à§‡à¦•à§‡ à¦•à¦°à§�à¦®à§€ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à§‡ à¦…à¦°à§‡à¦žà§�à¦œ SUBMIT à¦¬à¦¾à¦Ÿà¦¨à§‡ à¦•à§�à¦²à¦¿à¦• à¦•à¦°à¦²à§‡ 'Bulk Leave Application Parameters' à¦®à§‹à¦¡à¦¾à¦² à¦“à¦ªà§‡à¦¨ à¦¹à¦¬à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà§‡à¦¡ à¦•à¦°à§�à¦®à§€à¦¦à§‡à¦° à¦²à¦¿à¦¸à§�à¦Ÿ, Leave Type à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° (CL, SL, EL, CPL, LWP, ML), From Date à¦“ To Date à¦ªà¦¿à¦•à¦¾à¦° à¦¸à¦¹ à¦²à¦¾à¦‡à¦­ à¦¡à¦¿à¦‰à¦°à§‡à¦¶à¦¨ à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦¶à¦¨, Reason à¦¨à§‹à¦Ÿ à¦«à¦¿à¦²à§�à¦¡ à¦�à¦¬à¦‚ à¦•à¦¨à¦«à¦¾à¦°à§�à¦®à§‡à¦¶à¦¨ à¦¬à¦¾à¦Ÿà¦¨ à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "447",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Refactored the 'Bulk Leave Allocation Console' (/bulk-leave) into a clean, high-density enterprise ERP interface: top header with executive KPI counter pills (Total Staff, Selected Count, Leave Duration); compact filter console with Year, Employee ID (Comma Separated), Employee Type, Department, Section, Designation, Unit, Line, Leave Type (CL, SL, EL, CPL, LWP, ML), From Date, To Date, and Reason Note; action toolbar with EXCEL, PRINT, and PDF export buttons alongside live table search; high-density corporate data table featuring select-all checkbox, Emp ID, Emp ID (Offc), Employee Name, Type, Department, Section, Designation, Unit, Line, live Leave Balances (CL/SL/EL), per-row remarks input, and row selection highlight; alongside a fixed enterprise bottom action bar showing live allocation summary and a solid blue 'Submit Bulk Leave' primary action button.",
    "descriptionBn": "à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Bulk Leave Allocation Console' à¦ªà§‡à¦œà¦Ÿà¦¿ (/bulk-leave) à¦•à§�à¦²à¦¿à¦¨ à¦“ à¦¹à¦¾à¦‡-à¦¡à§‡à¦¨à¦¸à¦¿à¦Ÿà¦¿ à¦�à¦¨à§�à¦Ÿà¦¾à¦°à¦ªà§�à¦°à¦¾à¦‡à¦œ ERP à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦®à§‡ à¦ªà§�à¦¨à¦°à§�à¦¨à¦¿à¦°à§�à¦®à¦¾à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦�à¦•à§�à¦¸à¦¿à¦•à¦¿à¦‰à¦Ÿà¦¿à¦­ KPI à¦•à¦¾à¦‰à¦¨à§�à¦Ÿà¦¾à¦° à¦ªà¦¿à¦² à¦¸à¦¹ à¦Ÿà¦ª à¦¹à§‡à¦¡à¦¾à¦° (Total Staff, Selected Count, Leave Duration); Year, Employee ID (à¦•à¦®à¦¾ à¦¸à§‡à¦ªà¦¾à¦°à§‡à¦Ÿà§‡à¦¡ à¦¸à¦¾à¦°à§�à¦š), Employee Type, Department, Section, Designation, Unit, Line, Leave Type (CL, SL, EL, CPL, LWP, ML), From Date, To Date à¦�à¦¬à¦‚ Reason à¦«à¦¿à¦²à§�à¦¡ à¦¸à¦¹ à¦•à¦®à§�à¦ªà§�à¦¯à¦¾à¦•à§�à¦Ÿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦¨à¦¸à§‹à¦²; EXCEL, PRINT, PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨ à¦“ à¦²à¦¾à¦‡à¦­ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¸à¦¾à¦°à§�à¦š à¦Ÿà§�à¦²à¦¬à¦¾à¦°; à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ-à¦…à¦² à¦šà§‡à¦•à¦¬à¦•à§�à¦¸, Emp ID, Emp ID (Offc), Employee Name, Type, Department, Section, Designation, Unit, Line, à¦²à¦¾à¦‡à¦­ à¦²à¦¿à¦­ à¦¬à§�à¦¯à¦¾à¦²à§‡à¦¨à§�à¦¸ (CL/SL/EL) à¦“ à¦°à¦¿à¦®à¦¾à¦°à§�à¦•à¦¸ à¦«à¦¿à¦²à§�à¦¡ à¦¸à¦¹ à¦¹à¦¾à¦‡-à¦¡à§‡à¦¨à¦¸à¦¿à¦Ÿà¦¿ à¦•à¦¾à¦°à¦ªà§‹à¦°à§‡à¦Ÿ à¦¡à¦¾à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡; à¦�à¦¬à¦‚ à¦°à¦¿à§Ÿà§‡à¦²-à¦Ÿà¦¾à¦‡à¦® à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦“ à¦¸à¦²à¦¿à¦¡ à¦¬à§�à¦²à§� 'Submit Bulk Leave' à¦¬à¦¾à¦Ÿà¦¨ à¦¸à¦¹ à¦¸à§�à¦Ÿà¦¿à¦•à¦¿ à¦�à¦¨à§�à¦Ÿà¦¾à¦°à¦ªà§�à¦°à¦¾à¦‡à¦œ à¦¬à¦Ÿà¦® à¦¬à¦¾à¦°à¥¤"
  },
  {
    "id": "446",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Completely redesigned the 'Bulk Leave Allocation' interface (/bulk-leave) into a modern, executive-grade 2-step workflow: top dark indigo gradient header displaying real-time metrics (Selected Staff, Leave Duration, Total Man-Days); Step 1 Leave Parameters console with visual Leave Type card selector (Casual Leave - CL, Earned Leave - EL, Sick Leave - SL, Compensatory Leave - CPL, Leave Without Pay - LWP), From Date & To Date pickers with instant duration calculation, Day Portion selector (Full Day, First Half, Second Half), Reason input, and quick-fill reason chips; Step 2 Employee Selection engine with smart instant search (supporting single/comma-separated IDs e.g. 1074, 1088), Department/Section/Type filters, Quick Select by Department shortcuts (+ Production, + Store, + Wash, + HR & Admin), live leave balances (CL, SL, EL), per-row remarks, and row selection highlight; alongside a sticky glassmorphic bottom action dock showing real-time allocation summary and a high-visibility 'Apply Bulk Leave' action button with export to CSV option.",
    "descriptionBn": "à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Bulk Leave Allocation' à¦ªà§‡à¦œà¦Ÿà¦¿ (/bulk-leave) à¦�à¦•à¦Ÿà¦¿ à¦†à¦§à§�à¦¨à¦¿à¦• à¦“ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à§¨-à¦¸à§�à¦Ÿà§‡à¦œ à¦“à§Ÿà¦¾à¦°à§�à¦•à¦«à§�à¦²à§‹à¦¤à§‡ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦°à¦¿à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦Ÿà¦ª à¦¡à¦¾à¦°à§�à¦• à¦‡à¦¨à¦¡à¦¿à¦—à§‹ à¦—à§�à¦°à§‡à¦¡à¦¿à§Ÿà§‡à¦¨à§�à¦Ÿ à¦¹à§‡à¦¡à¦¾à¦° à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦°à¦¿à§Ÿà§‡à¦²-à¦Ÿà¦¾à¦‡à¦® à¦®à§‡à¦Ÿà§�à¦°à¦¿à¦•à§�à¦¸ (Selected Staff, Leave Duration, Total Man-Days) à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à§Ÿ; à¦¸à§�à¦Ÿà§‡à¦œ à§§ à¦•à¦¨à¦¸à§‹à¦²à§‡ à¦°à§Ÿà§‡à¦›à§‡ à¦­à¦¿à¦œà§�à¦¯à§�à§Ÿà¦¾à¦² à¦²à¦¿à¦­ à¦Ÿà¦¾à¦‡à¦ª à¦•à¦¾à¦°à§�à¦¡ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° (CL, EL, SL, CPL, LWP), à¦‡à¦¨à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦Ÿ à¦¡à¦¿à¦‰à¦°à§‡à¦¶à¦¨ à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦Ÿà¦° à¦¸à¦¹ à¦¡à§‡à¦Ÿ à¦ªà¦¿à¦•à¦¾à¦°, à¦¡à§‡ à¦ªà§‹à¦°à§�à¦¶à¦¨ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° (Full Day, Half Day), à¦•à¦¾à¦°à¦£ à¦“ à¦•à§�à¦‡à¦• à¦šà¦¿à¦ªà¦¸; à¦¸à§�à¦Ÿà§‡à¦œ à§¨ à¦�à¦®à§�à¦¬à¦ªà§�à¦²à§Ÿà¦¿ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° à¦‡à¦žà§�à¦œà¦¿à¦¨à§‡ à¦°à§Ÿà§‡à¦›à§‡ à¦‡à¦¨à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦Ÿ à¦•à¦®à¦¾ à¦¸à§‡à¦ªà¦¾à¦°à§‡à¦Ÿà§‡à¦¡ à¦†à¦‡à¦¡à¦¿ à¦¸à¦¾à¦°à§�à¦š (à¦¯à§‡à¦®à¦¨: 1074, 1088), à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ/à¦¸à§‡à¦•à¦¶à¦¨ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦•à§�à¦‡à¦• à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨ (+ Production, + Store à¦‡à¦¤à§�à¦¯à¦¾à¦¦à¦¿), à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦•à¦°à§�à¦®à§€à¦° à¦²à¦¾à¦‡à¦­ à¦²à¦¿à¦­ à¦¬à§�à¦¯à¦¾à¦²à§‡à¦¨à§�à¦¸ (CL, SL, EL) à¦“ à¦°à¦¿à¦®à¦¾à¦°à§�à¦•à¦¸; à¦�à¦¬à¦‚ à¦°à¦¿à§Ÿà§‡à¦²-à¦Ÿà¦¾à¦‡à¦® à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦“ à¦¹à¦¾à¦‡-à¦­à¦¿à¦œà¦¿à¦¬à¦¿à¦²à¦¿à¦Ÿà¦¿ 'Apply Bulk Leave' à¦¬à¦¾à¦Ÿà¦¨ à¦¸à¦¹ à¦¸à§�à¦Ÿà¦¿à¦•à¦¿ à¦¬à¦Ÿà¦® à¦¬à¦¾à¦°à¥¤"
  },
  {
    "id": "445",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Created the official 'Bulk Leave' sub menu and application page under Leave module (/bulk-leave) matching exact ERP reference screenshot: top filter console with Year selector (2026), Employee Id (Comma Separator) input, Employee Type tag multi-select (Worker, Staff, etc.), Department dropdown (All Departments, Production, Store, Wash, Electric, HR & Admin), Section dropdown (ALL, Sewing, Store, Wash, Finishing, Electric, Fusing, Compliance), Designation dropdown (ALL, Operator, Loader, Jr. Distributor, Asst. Boiler Operator, Fusing Asst.), Unit dropdown (ALL, Aleya Apparels Ltd. (Shirt), Aleya Apparels Ltd., Aleya Apparels Ltd. (Pant-1), Aleya Apparels Ltd. (Pant-2)), Line dropdown (ALL, 02.Line-B, 11.Line-3, AT-N/A, N/A), Shift input, mandatory From Date & To Date pickers, Leave Type selector (CL, SL, AL, CPL, LWP, ML), Reason input, and blue 'SEARCH' button; toolbar with EXCEL, PRINT, and PDF export buttons alongside live search filter; responsive data table featuring select-all header checkbox, per-row Remarks text field, Emp ID, Emp ID(Offc), Name, Employee Type, Department, Section, Job Title, Unit, Line, Grade, and Joining Date; bottom status bar showing entry count with orange 'SUBMIT' button to process bulk leave applications; green floating quick action button (+) for quick selection modal; alongside adding the 'Bulk Leave' sub menu item under 'Leave' in Sidebar navigation, Topbar quick search, and Leave Hub card directory.",
    "descriptionBn": "Leave à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Bulk Leave' à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦�à¦¬à¦‚ à¦¬à¦¾à¦²à§�à¦• à¦²à¦¿à¦­ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦ªà§‡à¦œà¦Ÿà¦¿ (/bulk-leave) à¦¹à§�à¦¬à¦¹à§� ERP à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦¨à¦¸à§‹à¦²à§‡ à¦°à§Ÿà§‡à¦›à§‡ Year à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° (2026), Employee Id (Comma Separator) à¦‡à¦¨à¦ªà§�à¦Ÿ, Employee Type à¦Ÿà§�à¦¯à¦¾à¦— à¦®à¦¾à¦²à§�à¦Ÿà¦¿-à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ (Worker, Staff à¦‡à¦¤à§�à¦¯à¦¾à¦¦à¦¿), Department à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ (All Departments, Production, Store, Wash, Electric, HR & Admin), Section à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ (ALL, Sewing, Store, Wash, Finishing, Electric, Fusing, Compliance), Designation à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ (ALL, Operator, Loader, Jr. Distributor, Asst. Boiler Operator, Fusing Asst.), Unit à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ (ALL, Aleya Apparels Ltd. (Shirt), Aleya Apparels Ltd., Aleya Apparels Ltd. (Pant-1), Aleya Apparels Ltd. (Pant-2)), Line à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ (ALL, 02.Line-B, 11.Line-3, AT-N/A, N/A), Shift à¦‡à¦¨à¦ªà§�à¦Ÿ, à¦¬à¦¾à¦§à§�à¦¯à¦¤à¦¾à¦®à§‚à¦²à¦• From Date à¦“ To Date à¦ªà¦¿à¦•à¦¾à¦°, Leave Type à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° (CL, SL, AL, CPL, LWP, ML), Reason à¦‡à¦¨à¦ªà§�à¦Ÿ à¦�à¦¬à¦‚ à¦¬à§�à¦²à§� 'SEARCH' à¦¬à¦¾à¦Ÿà¦¨; EXCEL, PRINT, PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨ à¦�à¦¬à¦‚ à¦²à¦¾à¦‡à¦­ à¦¸à¦¾à¦°à§�à¦š à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¸à¦¹ à¦Ÿà§�à¦²à¦¬à¦¾à¦°; à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ-à¦…à¦² à¦šà§‡à¦•à¦¬à¦•à§�à¦¸, à¦ªà§�à¦°à¦¤à¦¿ à¦°à§‹à¦° à¦œà¦¨à§�à¦¯ Remarks à¦«à¦¿à¦²à§�à¦¡, Emp ID, Emp ID(Offc), Name, Employee Type, Department, Section, Job Title, Unit, Line, Grade à¦�à¦¬à¦‚ Joining Date à¦¸à¦¹ à¦¡à¦¾à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡; à¦¬à¦¾à¦²à§�à¦• à¦›à§�à¦Ÿà¦¿ à¦†à¦¬à§‡à¦¦à¦¨à§‡à¦° à¦œà¦¨à§�à¦¯ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦•à¦¾à¦‰à¦¨à§�à¦Ÿà¦¾à¦° à¦“ à¦…à¦°à§‡à¦žà§�à¦œ 'SUBMIT' à¦¬à¦¾à¦Ÿà¦¨ à¦¸à¦¹ à¦¬à¦Ÿà¦® à¦¬à¦¾à¦°; à¦•à§�à¦‡à¦• à¦¸à¦¿à¦²à§‡à¦•à¦¶à¦¨ à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦œà¦¨à§�à¦¯ à¦—à§�à¦°à¦¿à¦¨ à¦«à§�à¦²à§‹à¦Ÿà¦¿à¦‚ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦Ÿà¦¨ (+); à¦�à¦¬à¦‚ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨à§‡à¦° 'Leave' à¦®à§‡à¦¨à§�, à¦Ÿà¦ªà¦¬à¦¾à¦° à¦•à§�à¦‡à¦• à¦¸à¦¾à¦°à§�à¦š à¦“ à¦²à¦¿à¦­ à¦¹à¦¾à¦¬ à¦•à¦¾à¦°à§�à¦¡à§‡ 'Bulk Leave' à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "444",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Budget",
    "link": "/budget-overtime",
    "descriptionEn": "Added official 'Overtime Budget' / 'OT Limit' page under Budget module (/budget-overtime) matching exact ERP reference screenshot: header 'â†� OT Limit' with breadcrumbs (Home > Human Resource > OT Limit); filter console with Year selector (2026), Month selector (Sep), Department dropdown (All Departments & 70+ sections), blue 'SHOW' button with red outline, and red 'EXPORT EXCEL' button; search box toolbar; table data grid with select-all checkbox, # (SL), Year, Month, Sections (department names), OT Hours (editable input), and OT Amount (editable input); pre-populated sample department records (Accessories Store (MCD), Accessories Store 1, Accounts, Admin, Brand and Media, CAD, Chemical Store, Commercial, Compliance, Cutting, Dyeing, Finishing, HR, ICT, IE, Knitting, Maintenance, Marketing, Merchandising, MIS, Printing, Procurement, Production, QA, Sewing, Supply Chain, Washing, etc.); inline budget editing, summary total calculations, Excel download, and local storage persistence; alongside adding sub-menu items 'Overtime Budget' and 'Over Time Limit' under 'Manpower Budget' in Sidebar navigation.",
    "descriptionBn": "à¦¬à¦¾à¦œà§‡à¦Ÿ à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Overtime Budget' / 'OT Limit' à¦ªà§‡à¦œà¦Ÿà¦¿ (/budget-overtime) à¦¹à§�à¦¬à¦¹à§� ERP à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¹à§‡à¦¡à¦¾à¦° 'â†� OT Limit' à¦¸à¦¹ à¦¬à§�à¦°à§‡à¦¡à¦•à§�à¦°à¦¾à¦®à§�à¦¬ (Home > Human Resource > OT Limit); Year (2026), Month (Sep), Department à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ (All Departments à¦“ à§­à§¦+ à¦¸à§‡à¦•à¦¶à¦¨), à¦°à§‡à¦¡ à¦†à¦‰à¦Ÿà¦²à¦¾à¦‡à¦¨ à¦¸à¦¹ à¦¬à§�à¦²à§� 'SHOW' à¦¬à¦¾à¦Ÿà¦¨ à¦�à¦¬à¦‚ à¦²à¦¾à¦² 'EXPORT EXCEL' à¦¬à¦¾à¦Ÿà¦¨ à¦¸à¦¹ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦¨à¦¸à§‹à¦²; à¦¸à¦¾à¦°à§�à¦š à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦Ÿà§�à¦²à¦¬à¦¾à¦°; à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ-à¦…à¦² à¦šà§‡à¦•à¦¬à¦•à§�à¦¸, # (SL), Year, Month, Sections (à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦¨à¦¾à¦®), OT Hours (à¦�à¦¡à¦¿à¦Ÿà§‡à¦¬à¦² à¦‡à¦¨à¦ªà§�à¦Ÿ) à¦�à¦¬à¦‚ OT Amount (à¦�à¦¡à¦¿à¦Ÿà§‡à¦¬à¦² à¦‡à¦¨à¦ªà§�à¦Ÿ) à¦¸à¦¹ à¦¡à¦¾à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡; à¦¬à¦¿à¦­à¦¿à¦¨à§�à¦¨ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦ªà§�à¦°à¦¿à¦ªà¦ªà§�à¦²à§‡à¦Ÿà§‡à¦¡ à¦°à§‡à¦•à¦°à§�à¦¡ (Accessories Store (MCD), Accessories Store 1, Accounts, Admin, Compliance, Cutting, Dyeing, Finishing, HR, ICT, Sewing, etc.); à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ à¦¬à¦¾à¦œà§‡à¦Ÿ à¦�à¦¡à¦¿à¦Ÿà¦¿à¦‚, à¦®à§‹à¦Ÿ à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦¶à¦¨, à¦�à¦•à§�à¦¸à§‡à¦² à¦¡à¦¾à¦‰à¦¨à¦²à§‹à¦¡ à¦“ à¦²à§‹à¦•à¦¾à¦² à¦¸à§�à¦Ÿà§‹à¦°à§‡à¦œ à¦¸à§‡à¦­ à¦¸à§�à¦¬à¦¿à¦§à¦¾; à¦�à¦¬à¦‚ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨à§‡à¦° 'Manpower Budget' à¦®à§‡à¦¨à§�à¦° à¦…à¦§à§€à¦¨à§‡ 'Overtime Budget' à¦“ 'Over Time Limit' à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "443",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Separation",
    "link": "/separation-clearance-approval",
    "descriptionEn": "Redesigned the official 'Clearance Approval Console' page under Separation module (/separation-clearance-approval) matching exact approval queue reference screenshot UI: clean card rows displaying checkbox, green shield icon badge with Clearance ID (CLR-2025-57068), Request Type, Employee Name & Title (Riazul Islam â€¢ 2025057068 â€¢ Asst. Manager), Department & Leaving Date (Implementation & Business Analysis â€¢ Leaving: 15 Sep 2026), 6-stage clearance progress bar (83%), status pill (Pending Review, Approved, Rejected), direct circle check (âœ“) and cross (âœ•) quick decision action buttons, and uppercase blue VIEW button; and an interactive 'Clearance Request Details' modal opening upon clicking any row or VIEW button showing comprehensive employee resignation metadata, stated resignation reason, HR directives, 6-stage department clearance matrix (Accounts, Admin, ICT, Immediate Boss, HR, COO), quick approval decision controls, and official printable clearance document generator.",
    "descriptionBn": "Separation à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Clearance Approval Console' à¦ªà§‡à¦œà¦Ÿà¦¿ (/separation-clearance-approval) à¦¹à§�à¦¬à¦¹à§� à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿà§‡à¦° à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦•à¦¿à¦‰ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦ªà§�à¦¨à¦°à§�à¦¨à¦¿à¦°à§�à¦®à¦¾à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦•à§�à¦²à¦¿à¦¨ à¦•à¦¾à¦°à§�à¦¡ à¦°à§‹ à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦šà§‡à¦•à¦¬à¦•à§�à¦¸, à¦•à§�à¦²à¦¿à§Ÿà¦¾à¦°à§‡à¦¨à§�à¦¸ à¦†à¦‡à¦¡à¦¿ (CLR-2025-57068) à¦¸à¦¹ à¦¸à¦¬à§�à¦œ à¦¶à¦¿à¦²à§�à¦¡ à¦†à¦‡à¦•à¦¨ à¦¬à§�à¦¯à¦¾à¦œ, Request Type, à¦•à¦°à§�à¦®à§€ à¦¨à¦¾à¦® à¦“ à¦ªà¦¦à¦¬à¦¿ (Riazul Islam â€¢ 2025057068 â€¢ Asst. Manager), à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦“ à¦¸à¦¾à¦°à§�à¦­à¦¿à¦¸ à¦›à¦¾à§œà¦¾à¦° à¦¤à¦¾à¦°à¦¿à¦– (Implementation & Business Analysis â€¢ Leaving: 15 Sep 2026), à§¬-à¦¸à§�à¦Ÿà§‡à¦œ à¦•à§�à¦²à¦¿à§Ÿà¦¾à¦°à§‡à¦¨à§�à¦¸ à¦ªà§�à¦°à¦—à§�à¦°à§‡à¦¸ à¦¬à¦¾à¦° (83%), à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦ªà¦¿à¦² (Pending Review, Approved, Rejected), à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦¸à¦¾à¦°à§�à¦•à§‡à¦² à¦Ÿà¦¿à¦• (âœ“) à¦“ à¦•à§�à¦°à¦¸ (âœ•) à¦¬à¦¾à¦Ÿà¦¨, à¦�à¦¬à¦‚ à¦†à¦ªà¦¾à¦°à¦•à§‡à¦¸ à¦¬à§�à¦²à§� VIEW à¦¬à¦¾à¦Ÿà¦¨ à¦°à§Ÿà§‡à¦›à§‡; à¦�à¦¬à¦‚ à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦°à§‹ à¦¬à¦¾ VIEW à¦¬à¦¾à¦Ÿà¦¨à§‡ à¦•à§�à¦²à¦¿à¦• à¦•à¦°à¦²à§‡ à¦“à¦ªà§‡à¦¨ à¦¹à¦“à§Ÿà¦¾ à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ 'Clearance Request Details' à¦®à§‹à¦¡à¦¾à¦² à¦¯à¦¾à¦¤à§‡ à¦°à§Ÿà§‡à¦›à§‡ à¦ªà§‚à¦°à§�à¦£à¦¾à¦™à§�à¦— à¦ªà¦¦à¦¤à§�à¦¯à¦¾à¦— à¦®à§‡à¦Ÿà¦¾à¦¡à§‡à¦Ÿà¦¾, à¦•à¦¾à¦°à¦£, HR à¦¨à¦¿à¦°à§�à¦¦à§‡à¦¶à¦¿à¦•à¦¾, à§¬-à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦•à§�à¦²à¦¿à§Ÿà¦¾à¦°à§‡à¦¨à§�à¦¸ à¦®à§�à¦¯à¦¾à¦Ÿà§�à¦°à¦¿à¦•à§�à¦¸ à¦•à¦¾à¦°à§�à¦¡ (Accounts, Admin, ICT, Immediate Boss, HR, COO), à¦•à§�à¦‡à¦• à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦¡à¦¿à¦¸à¦¿à¦¶à¦¨ à¦•à¦¨à§�à¦Ÿà§�à¦°à§‹à¦² à¦�à¦¬à¦‚ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² à¦•à§�à¦²à¦¿à§Ÿà¦¾à¦°à§‡à¦¨à§�à¦¸ à¦«à¦°à§�à¦® à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦¸à§�à¦¬à¦¿à¦§à¦¾à¥¤"
  },
  {
    "id": "442",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Manage Overtime",
    "link": "/manage-overtime?tab=individual-review",
    "descriptionEn": "Implemented the official 'Individual OT Review' view under Manage Overtime (/manage-overtime?tab=individual-review) matching exact ERP specifications: top filter console with Requisition Type dropdown (OT, Allowance, All), 75+ Main Department dropdown (Accounts & Finance, Admin, Administration, Audit, Brand & Media, CAD, Commercial, Cutting, Dyeing, Finishing, HR, ICT, IE, Knitting, Maintenance, Marketing, Merchandising, MIS, Procurement, Production, QA, R&D, Sewing, Supply Chain, Vat & Tax, Washing, Worker, WTP, Yarn Dyeing, etc.), W.Line Name selector (ALL, 0, 01 to 65, N/A), OT Date * date picker, and blue 'Search' button; action toolbar with EXCEL, PRINT, and PDF export buttons alongside live table Search; data grid displaying âˆ‡ select column, # (SL), Emp ID, Name, Department, Designation, Date, In Time, Out Date, Out Time, and Status badge; and bottom status bar showing entry count with 'No data available in table' empty state.",
    "descriptionBn": "à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Individual OT Review' à¦ªà§‡à¦œà¦Ÿà¦¿ (/manage-overtime?tab=individual-review) à¦¹à§�à¦¬à¦¹à§� ERP à¦¸à§�à¦ªà§‡à¦¸à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦¨à¦¸à§‹à¦²à§‡ à¦°à§Ÿà§‡à¦›à§‡ Requisition Type à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ (OT, Allowance, All), à§­à§«+ Main Department à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨, W.Line Name à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° (ALL, 0, 01 à¦¥à§‡à¦•à§‡ 65, N/A), OT Date * à¦¡à§‡à¦Ÿ à¦ªà¦¿à¦•à¦¾à¦° à¦�à¦¬à¦‚ à¦¬à§�à¦²à§� 'Search' à¦¬à¦¾à¦Ÿà¦¨; EXCEL, PRINT, PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨ à¦�à¦¬à¦‚ à¦²à¦¾à¦‡à¦­ Search à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¸à¦¹ à¦Ÿà§�à¦²à¦¬à¦¾à¦°; âˆ‡ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦²à¦¾à¦®, # (SL), Emp ID, Name, Department, Designation, Date, In Time, Out Date, Out Time à¦�à¦¬à¦‚ Status à¦¬à§�à¦¯à¦¾à¦œ à¦¸à¦¹ à¦¡à¦¾à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡; à¦�à¦¬à¦‚ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦•à¦¾à¦‰à¦¨à§�à¦Ÿà¦¾à¦° à¦¸à¦¹ 'No data available in table' à¦¸à§�à¦Ÿà§‡à¦Ÿ à¦¸à¦¹ à¦¬à¦Ÿà¦® à¦¬à¦¾à¦°à¥¤"
  },
  {
    "id": "441",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Manage Overtime",
    "link": "/manage-overtime?tab=submitted-list",
    "descriptionEn": "Overhauled the official 'Submitted OT request List' page under Manage Overtime (/manage-overtime?tab=submitted-list) matching exact ERP specifications and reference screenshots: top filter console featuring Requisition Type dropdown (OT, Allowance, All), 75+ Main Department dropdown, Line Name selector (ALL, 0, 01 to 65, N/A), ApStatus filter (Review, Approved, Rejected, Pending, All), and blue 'SEARCH' button; export toolbar with EXCEL, PRINT, PDF buttons and live table Search filter; complete dataset containing all 140 entries (ReqNum 3625, 3634, 4487, 5132, 6040, 6342, 6447, 7131, 7934, 8015, 8552, 8596, 8689, 9772, 10258, 10289, 10443, etc.) displaying âˆ‡ Action column (blue ðŸ”� magnifying glass for Details view, yellow âœ�ï¸� pencil for Edit view), ReqNum, Dates, DocDetails, ReqType, Department, Line, ReqBy, ReqTime, and Status badge with remarks; interactive 'OT Request Details' modal matching Screenshot 2 featuring red 'VIEW REPORT' button, top-right 'ReqNum: 3634', export toolbar, employee detail grid with Total Amount summary, and 4 bottom verification audit cards (Checked By: Approved, Verified By HOD: Approved, Verified By HR: Review, Approved By MD: Pending); and interactive 'Edit Submitted OT Request' modal matching Screenshot 3 with breadcrumb header (Home > Human Resource > Edit Submitted OT Request), editable OT Req and Morning OT input boxes, and save functionality.",
    "descriptionBn": "à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Submitted OT request List' à¦ªà§‡à¦œà¦Ÿà¦¿ (/manage-overtime?tab=submitted-list) à¦¹à§�à¦¬à¦¹à§� ERP à¦¸à§�à¦ªà§‡à¦¸à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦“ à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦¨à¦¸à§‹à¦²à§‡ à¦°à§Ÿà§‡à¦›à§‡ Requisition Type à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ (OT, Allowance, All), à§­à§«+ Main Department à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨, Line Name à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° (ALL, 0, 01 à¦¥à§‡à¦•à§‡ 65, N/A), ApStatus à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° (Review, Approved, Rejected, Pending, All) à¦�à¦¬à¦‚ à¦¬à§�à¦²à§� 'SEARCH' à¦¬à¦¾à¦Ÿà¦¨; EXCEL, PRINT, PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦�à¦¬à¦‚ à¦²à¦¾à¦‡à¦­ Search à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¸à¦¹ à¦Ÿà§�à¦²à¦¬à¦¾à¦°; à§§à§ªà§¦à¦Ÿà¦¿ à¦°à§‡à¦•à¦°à§�à¦¡à§‡à¦° à¦ªà§‚à¦°à§�à¦£à¦¾à¦™à§�à¦— à¦¡à¦¾à¦Ÿà¦¾ à¦¸à§‡à¦Ÿ (ReqNum 3625, 3634, 4487, 5132, 6040, 6342, 6447, 7131, 7934, 8015, 8552 à¦‡à¦¤à§�à¦¯à¦¾à¦¦à¦¿) à¦¯à§‡à¦–à¦¾à¦¨à§‡ âˆ‡ Action à¦•à¦²à¦¾à¦®à§‡ à¦¬à§�à¦²à§� ðŸ”� à¦®à§�à¦¯à¦¾à¦—à¦¨à¦¿à¦«à¦¾à¦‡à¦‚ à¦—à§�à¦²à¦¾à¦¸ (à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦®à§‹à¦¡à¦¾à¦²) à¦�à¦¬à¦‚ à¦‡à§Ÿà§‡à¦²à§‹ âœ�ï¸� à¦ªà§‡à¦¨à§�à¦¸à¦¿à¦² (à¦�à¦¡à¦¿à¦Ÿ à¦®à§‹à¦¡à¦¾à¦²) à¦¬à¦¾à¦Ÿà¦¨, ReqNum, Dates, DocDetails, ReqType, Department, Line, ReqBy, ReqTime à¦�à¦¬à¦‚ à¦°à¦¿à¦®à¦¾à¦°à§�à¦• à¦¸à¦¹ Status à¦¬à§�à¦¯à¦¾à¦œ à¦°à§Ÿà§‡à¦›à§‡; à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿ à§¨ à¦�à¦° à¦¹à§�à¦¬à¦¹à§� 'OT Request Details' à¦®à§‹à¦¡à¦¾à¦² (à¦°à§‡à¦¡ 'VIEW REPORT' à¦¬à¦¾à¦Ÿà¦¨, 'ReqNum: 3634', à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¬à¦¾à¦°, à¦•à¦°à§�à¦®à§€ à¦¡à¦¾à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡, Total Amount à¦�à¦¬à¦‚ à§ªà¦Ÿà¦¿ à¦­à§‡à¦°à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦•à¦¾à¦°à§�à¦¡ - Checked By, Verified By HOD, Verified By HR, Approved By MD); à¦�à¦¬à¦‚ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿ à§© à¦�à¦° à¦¹à§�à¦¬à¦¹à§� 'Edit Submitted OT Request' à¦®à§‹à¦¡à¦¾à¦² (à¦¬à§�à¦°à§‡à¦¡à¦•à§�à¦°à¦¾à¦®à§�à¦¬ à¦¹à§‡à¦¡à¦¾à¦°, à¦�à¦¡à¦¿à¦Ÿà§‡à¦¬à¦² OT Req à¦“ Morning OT à¦‡à¦¨à¦ªà§�à¦Ÿ à¦�à¦¬à¦‚ à¦¸à§‡à¦­ à¦…à¦ªà¦¶à¦¨)à¥¤"
  },
  {
    "id": "440",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Manage Overtime",
    "link": "/manage-overtime?tab=submit",
    "descriptionEn": "Built the official 'Submit OT Req' requisition page under Manage Overtime (/manage-overtime?tab=submit) matching exact ERP specifications: top filter console with Requisition Type dropdown (OT, Allowance, All), 75+ Main Department dropdown (Accounts & Finance, Admin, Administration, All over Printing, Audit, Brand and Media, Business Automation, Business Development, CAD, Commercial, Cutting, e-Governance, Embroidery, EMS, Fabric Dyeing, Finishing, HR, ICT, IE & Planning, Knitting, Maintenance, Marketing, Merchandising, MIS, Procurement, Production, QA, R&D, Sewing, Supply Chain, Vat & Tax, Washing, Worker, WTP, Yarn Dyeing, etc.), W.Line Name selector (ALL, 0, 01 to 65, N/A), OT Date * date picker, and blue 'Search' button; action toolbar with Excel, Print, PDF export buttons alongside live table Search; data grid displaying # SL with multi-select checkbox, Emp ID, Emp ID(Off), Name, Type, Department, Designation, Unit, Line, W.Line, Date, In Time, Out Date, Out Time, OT Req, OT Type, Amount (à§³), and Status badge; and bottom action bar with entries count alongside orange 'SUBMIT OT REQ' button.",
    "descriptionBn": "à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Submit OT Req' à¦ªà§‡à¦œà¦Ÿà¦¿ (/manage-overtime?tab=submit) à¦¹à§�à¦¬à¦¹à§� ERP à¦¸à§�à¦ªà§‡à¦¸à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¨à¦¿à¦°à§�à¦®à¦¾à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦¨à¦¸à§‹à¦²à§‡ à¦°à§Ÿà§‡à¦›à§‡ Requisition Type à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ (OT, Allowance, All), à§­à§«+ Main Department à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨, W.Line Name à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° (ALL, 0, 01 à¦¥à§‡à¦•à§‡ 65, N/A), OT Date * à¦¡à§‡à¦Ÿ à¦ªà¦¿à¦•à¦¾à¦° à¦�à¦¬à¦‚ à¦¬à§�à¦²à§� 'Search' à¦¬à¦¾à¦Ÿà¦¨; Excel, Print, PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨ à¦�à¦¬à¦‚ à¦²à¦¾à¦‡à¦­ à¦Ÿà§‡à¦¬à¦¿à¦² Search à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¸à¦¹ à¦Ÿà§�à¦²à¦¬à¦¾à¦°; à¦®à¦¾à¦²à§�à¦Ÿà¦¿-à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦šà§‡à¦•à¦¬à¦•à§�à¦¸ à¦“ # à¦•à§�à¦°à¦® à¦¸à¦¹ Emp ID, Emp ID(Off), Name, Type, Department, Designation, Unit, Line, W.Line, Date, In Time, Out Date, Out Time, OT Req, OT Type, Amount (à§³) à¦�à¦¬à¦‚ Status à¦¬à§�à¦¯à¦¾à¦œ à¦¸à¦¹ à¦¡à¦¾à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡; à¦�à¦¬à¦‚ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦•à¦¾à¦‰à¦¨à§�à¦Ÿà¦¾à¦° à¦¸à¦¹ à¦…à¦°à§‡à¦žà§�à¦œ 'SUBMIT OT REQ' à¦¬à¦¾à¦Ÿà¦¨à¥¤"
  },
  {
    "id": "439",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Manage Overtime",
    "link": "/manage-overtime?tab=requisition-list",
    "descriptionEn": "Created the official 'OT Requisition List' view under Manage Overtime (/manage-overtime?tab=requisition-list) matching exact ERP specifications: top filter panel featuring Start Date, End Date, Status options (Pending, Approved, Rejected, ALL), Employee Type selector (Management, Office Executive, Production Executive, Office Staff, Production Staff, Worker, Pcs Rate Worker, Intern), exhaustive Department dropdown (67+ departments including MCD, Dyeing, Printing, Sewing, QC, etc.), complete Job Title designation list (400+ designations), Unit list (Unit-01 to Unit-10, N/A), Line list (00 to 65, N/A), Requisition Type dropdown (All, OT, Allowance), Employee Id filter, and blue 'Search' button; action toolbar with Excel, Print, and PDF export buttons alongside live Search box; data grid displaying # (SL), Emp ID, Name, Department, Designation, Date, In Time, Out Date, Out Time, and Status badge; and bottom status bar showing entry count with empty table state.",
    "descriptionBn": "à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'OT Requisition List' à¦­à¦¿à¦‰ (/manage-overtime?tab=requisition-list) à¦¹à§�à¦¬à¦¹à§� ERP à¦¸à§�à¦ªà§‡à¦¸à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦²à§‡ à¦°à§Ÿà§‡à¦›à§‡ Start Date, End Date, Status à¦…à¦ªà¦¶à¦¨ (Pending, Approved, Rejected, ALL), Employee Type à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° (Management, Office Executive, Production Executive, Office Staff, Production Staff, Worker, Pcs Rate Worker, Intern), à§¬à§­+ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨, à§ªà§¦à§¦+ à¦ªà¦¦à¦¬à¦¿à¦° Job Title à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦°, Unit à¦²à¦¿à¦¸à§�à¦Ÿ (Unit-01 à¦¥à§‡à¦•à§‡ Unit-10, N/A), Line à¦²à¦¿à¦¸à§�à¦Ÿ (00 à¦¥à§‡à¦•à§‡ 65, N/A), Requisition Type (All, OT, Allowance), Employee Id à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦�à¦¬à¦‚ à¦¬à§�à¦²à§� 'Search' à¦¬à¦¾à¦Ÿà¦¨; Excel, Print, PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨ à¦“ à¦²à¦¾à¦‡à¦­ Search à¦Ÿà§�à¦²à¦¬à¦¾à¦°; # (SL), Emp ID, Name, Department, Designation, Date, In Time, Out Date, Out Time à¦�à¦¬à¦‚ Status à¦¬à§�à¦¯à¦¾à¦œ à¦¸à¦¹ à¦¡à¦¾à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡; à¦�à¦¬à¦‚ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦•à¦¾à¦‰à¦¨à§�à¦Ÿà¦¾à¦° à¦¸à¦¹ à¦¬à¦Ÿà¦® à¦¬à¦¾à¦°à¥¤"
  },
  {
    "id": "438",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Manage Overtime",
    "link": "/approve-overtime",
    "descriptionEn": "Created the official 'Approve OT Requisition' approval console (/approve-overtime) matching exact ERP specifications: top filter panel featuring Start Date, End Date, Status options (Pending, Approved, Rejected, ALL), Employee Type selector (Management, Office Executive, Production Executive, Office Staff, Production Staff, Worker, Pcs Rate Worker, Intern), exhaustive Department dropdown (67+ departments including MCD, Dyeing, Printing, Sewing, QC, etc.), complete Job Title designation list (400+ designations), Unit list (Unit-01 to Unit-10, N/A), Line list (00 to 65, N/A), Employee Id filter, and blue 'Search' button; action toolbar with Excel, Print, and PDF export buttons alongside live Search box; data grid displaying Select All checkbox column, Emp ID, Emp ID(Off), Name, Type, Department, Designation, Unit, Line, Date, In Time, Out Date, Out Time, OT Req, MOT Req, Amount, and Status badge; and bottom action bar with entries counter alongside green 'Approve' and red 'Reject' bulk action buttons.",
    "descriptionBn": "à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Approve OT Requisition' à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦•à¦¨à¦¸à§‹à¦² (/approve-overtime) à¦¹à§�à¦¬à¦¹à§� ERP à¦¸à§�à¦ªà§‡à¦¸à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦²à§‡ à¦°à§Ÿà§‡à¦›à§‡ Start Date, End Date, Status à¦…à¦ªà¦¶à¦¨ (Pending, Approved, Rejected, ALL), Employee Type à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° (Management, Office Executive, Production Executive, Office Staff, Production Staff, Worker, Pcs Rate Worker, Intern), à§¬à§­+ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦ªà§‚à¦°à§�à¦£à¦¾à¦™à§�à¦— à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ (MCD, Dyeing, Printing, Sewing, QC à¦‡à¦¤à§�à¦¯à¦¾à¦¦à¦¿), à§ªà§¦à§¦+ à¦ªà¦¦à¦¬à¦¿à¦° Job Title à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦°, Unit à¦²à¦¿à¦¸à§�à¦Ÿ (Unit-01 à¦¥à§‡à¦•à§‡ Unit-10, N/A), Line à¦²à¦¿à¦¸à§�à¦Ÿ (00 à¦¥à§‡à¦•à§‡ 65, N/A), Employee Id à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦�à¦¬à¦‚ à¦¬à§�à¦²à§� 'Search' à¦¬à¦¾à¦Ÿà¦¨; Excel, Print, PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨ à¦“ à¦²à¦¾à¦‡à¦­ Search à¦Ÿà§�à¦²à¦¬à¦¾à¦°; à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦…à¦² à¦šà§‡à¦•à¦¬à¦•à§�à¦¸, Emp ID, Emp ID(Off), Name, Type, Department, Designation, Unit, Line, Date, In Time, Out Date, Out Time, OT Req, MOT Req, Amount à¦�à¦¬à¦‚ Status à¦¬à§�à¦¯à¦¾à¦œ à¦¸à¦¹ à¦¡à¦¾à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡; à¦�à¦¬à¦‚ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦•à¦¾à¦‰à¦¨à§�à¦Ÿà¦¾à¦° à¦¸à¦¹ à¦—à§�à¦°à¦¿à¦¨ 'Approve' à¦“ à¦°à§‡à¦¡ 'Reject' à¦¬à¦¾à¦Ÿà¦¨à¥¤"
  },
  {
    "id": "437",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Manage Overtime",
    "link": "/manage-overtime",
    "descriptionEn": "Updated 'Manage Overtime' module (/manage-overtime) to feature all 6 required menu sub-items under Sidebar: OT Requisition, Approve OT Requisition, OT Requisition List, Submit OT Req, Submitted OT List, and Individual OT Review. Redesigned the OT Requisition page to match the user's reference screenshot with exact layout components: top filter panel with blue left accent border (Date, To Date, Employee Id with 'use comma as separator' input, Employee Type selector tag box, Department, Unit, Line, and vibrant blue 'SHOW' button); top-right OT Summary widget (OT header input with pencil icon to bulk apply, W.Line selector with pencil icon to set working line for selected rows, blue note 'Time will Add auto random by +5 minutes', Budget, Approved, and red Balance counter); action toolbar with EXCEL, PRINT, and PDF export buttons alongside live search box; full data grid displaying Select All checkbox, SL, Emp ID, Name, Department, Designation, Unit, Line, In Date/Time, Out Date/Time, W.Line dropdown, calculated OT, M_OT, Status badge, Req OT input, and Req MOT input; and bottom action bar featuring showing entries counter alongside amber 'SUBMIT' and red 'DELETE' action buttons.",
    "descriptionBn": "'Manage Overtime' à¦®à¦¡à¦¿à¦‰à¦²à§‡ (/manage-overtime) à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦¸à¦•à¦² à§¬à¦Ÿà¦¿ à¦¨à¦¿à¦°à§�à¦§à¦¾à¦°à¦¿à¦¤ à¦®à§‡à¦¨à§� à¦…à¦ªà¦¶à¦¨ à¦…à¦¨à§�à¦¤à¦°à§�à¦­à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: OT Requisition, Approve OT Requisition, OT Requisition List, Submit OT Req, Submitted OT List à¦�à¦¬à¦‚ Individual OT Reviewà¥¤ à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿà§‡à¦° à¦¹à§�à¦¬à¦¹à§� à¦²à§‡à¦†à¦‰à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ OT Requisition à¦ªà§‡à¦œà¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ à¦•à¦°à§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡: à¦¨à§€à¦² à¦²à§‡à¦«à¦Ÿ à¦�à¦•à¦¸à§‡à¦¨à§�à¦Ÿà¦¯à§�à¦•à§�à¦¤ à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦² (Date, To Date, 'use comma as separator' à¦ªà§�à¦²à§‡à¦¸à¦¹à§‹à¦²à§�à¦¡à¦¾à¦° à¦¸à¦¹ Employee Id, Employee Type à¦Ÿà§�à¦¯à¦¾à¦— à¦¬à¦•à§�à¦¸, Department, Unit, Line à¦�à¦¬à¦‚ à¦¬à§�à¦²à§� 'SHOW' à¦¬à¦¾à¦Ÿà¦¨); à¦Ÿà¦ª-à¦°à¦¾à¦‡à¦Ÿ OT à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦‰à¦‡à¦œà§‡à¦Ÿ (à¦�à¦•à¦¸à¦¾à¦¥à§‡ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà§‡à¦¡ à¦°à§‹à¦¤à§‡ à¦¸à§‡à¦Ÿ à¦•à¦°à¦¾à¦° à¦ªà§‡à¦¨à§�à¦¸à¦¿à¦² à¦†à¦‡à¦•à¦¨ à¦¸à¦¹ OT à¦‡à¦¨à¦ªà§�à¦Ÿ, W.Line à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦°, 'Time will Add auto random by +5 minutes' à¦¬à§�à¦²à§� à¦¨à§‹à¦Ÿ, Budget, Approved à¦“ à¦²à¦¾à¦² à¦«à¦¨à§�à¦Ÿà§‡ Balance à¦•à¦¾à¦‰à¦¨à§�à¦Ÿà¦¾à¦°); EXCEL, PRINT, PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦�à¦¬à¦‚ à¦²à¦¾à¦‡à¦­ à¦¸à¦¾à¦°à§�à¦š à¦Ÿà§�à¦²à¦¬à¦¾à¦°; à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦…à¦² à¦šà§‡à¦•à¦¬à¦•à§�à¦¸, SL, Emp ID, Name, Department, Designation, Unit, Line, In Date/Time, Out Date/Time, W.Line à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨, à¦¹à¦¿à¦¸à¦¾à¦¬à¦•à§ƒà¦¤ OT, M_OT, Status à¦¬à§�à¦¯à¦¾à¦œ, Req OT à¦�à¦¬à¦‚ Req MOT à¦‡à¦¨à¦ªà§�à¦Ÿ à¦¸à¦¹ à¦¡à¦¾à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡; à¦�à¦¬à¦‚ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦•à¦¾à¦‰à¦¨à§�à¦Ÿà¦¾à¦° à¦¸à¦¹ à¦…à¦°à§‡à¦žà§�à¦œ 'SUBMIT' à¦“ à¦°à§‡à¦¡ 'DELETE' à¦¬à¦¾à¦Ÿà¦¨à§‡à¦° à¦¬à¦Ÿà¦® à¦¬à¦¾à¦°à¥¤"
  },
  {
    "id": "436",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "HR & SSP Requisitions",
    "link": "/ssp-new-requisition",
    "descriptionEn": "Added 'General Product Budget Request' and 'ICT Product Budget Request' as standalone portal cards in the HR/SSP New Requisition hub (/ssp-new-requisition) alongside Leave Application, IOU, and other requisitions. Each card navigates to its dedicated ERP page (/ssp-general-product-budget-request and /ssp-ict-product-budget-request) matching exact ERP screenshots: underline-styled form fields with Req. Type options for 'Monthly Purchase Request' and 'Regular Purchase Request', Category with General Stationary for General requests, Product with preloaded catalog suggestions, Quantity, Justification, and blue 'ADD' button; light-pink-headed table (#ffebee) with Item, Quantity, Justification, and For columns; red 'On Behalf :' checkbox with inline employee delegation picker; blue 'SUBMIT' button committing requests to local storage; recent submissions ledger; and sidebar/topbar navigation integration.",
    "descriptionBn": "HR/SSP à¦¨à¦¿à¦‰ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦¹à¦¾à¦¬ à¦ªà§‡à¦œà§‡ (/ssp-new-requisition) 'Leave Application' à¦�à¦¬à¦‚ 'IOU' à¦�à¦° à¦®à¦¤à§‹ 'General Product Budget Request' à¦�à¦¬à¦‚ 'ICT Product Budget Request' à¦¨à¦¾à¦®à¦• à¦¦à§�à¦Ÿà¦¿ à¦†à¦²à¦¾à¦¦à¦¾ à¦•à¦¾à¦°à§�à¦¡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦•à¦¾à¦°à§�à¦¡à§‡ à¦•à§�à¦²à¦¿à¦• à¦•à¦°à¦²à§‡ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦¤à¦¾à¦° à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ ERP à¦ªà§‡à¦œ à¦“à¦ªà§‡à¦¨ à¦¹à¦¬à§‡ (/ssp-general-product-budget-request à¦�à¦¬à¦‚ /ssp-ict-product-budget-request) à¦¯à¦¾ à¦¹à§�à¦¬à¦¹à§� ERP à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿà§‡à¦° à¦®à¦¤à§‹ à¦¤à§ˆà¦°à¦¿: à¦†à¦¨à§�à¦¡à¦¾à¦°à¦²à¦¾à¦‡à¦¨-à¦¸à§�à¦Ÿà¦¾à¦‡à¦²à§‡à¦° à¦‡à¦¨à¦ªà§�à¦Ÿà¦¯à§�à¦•à§�à¦¤ à¦«à¦°à§�à¦® (Req. Type à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨à§‡ 'Monthly Purchase Request' à¦“ 'Regular Purchase Request' à¦…à¦ªà¦¶à¦¨, à¦œà§‡à¦¨à¦¾à¦°à§‡à¦² à¦°à¦¿à¦•à§�à§Ÿà§‡à¦¸à§�à¦Ÿà§‡à¦° à¦œà¦¨à§�à¦¯ General Stationary à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿, à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦²à¦— à¦¸à¦¾à¦œà§‡à¦¶à¦¨à¦¸à¦¹ Product, Quantity, Justification à¦�à¦¬à¦‚ à¦¬à§�à¦²à§� 'ADD' à¦¬à¦¾à¦Ÿà¦¨); à¦¹à¦¾à¦²à¦•à¦¾ à¦—à§‹à¦²à¦¾à¦ªà¦¿ à¦¹à§‡à¦¡à¦¾à¦°à¦¯à§�à¦•à§�à¦¤ à¦Ÿà§‡à¦¬à¦¿à¦² (#ffebee - Item, Quantity, Justification, For); à¦²à¦¾à¦² 'On Behalf :' à¦šà§‡à¦•à¦¬à¦•à§�à¦¸à¦¸à¦¹ à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ à¦•à¦°à§�à¦®à§€ à¦¸à¦¿à¦²à§‡à¦•à¦¶à¦¨; à¦²à§‹à¦•à¦¾à¦² à¦¸à§�à¦Ÿà§‹à¦°à§‡à¦œà§‡ à¦¸à§‡à¦­ à¦•à¦°à¦¾à¦° à¦¬à§�à¦²à§� 'SUBMIT' à¦¬à¦¾à¦Ÿà¦¨; à¦¸à¦¾à¦®à§�à¦ªà§�à¦°à¦¤à¦¿à¦• à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦²à§‡à¦œà¦¾à¦°; à¦�à¦¬à¦‚ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦“ à¦Ÿà¦ªà¦¬à¦¾à¦° à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨ à¦¸à§�à¦¬à¦¿à¦§à¦¾à¥¤"
  },
  {
    "id": "435",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-reports-payment-statement",
    "descriptionEn": "Created the official 'Payment Statement' analytical and supplier accounting report console under Reports module matching exact ERP specifications: top filter bar with blue left accent bar (Bill Location dropdown with default 'PAL-Fabric Dyeing', Date From '01/09/2025', Date To '08/09/2026', vibrant blue 'SHOW' button, and vibrant green 'TRANSACTION' button); action toolbar with EXCEL, PRINT, and PDF export buttons alongside live search filter; data table featuring select-all checkbox column with filter indicator (âˆ‡), Supplier name, PreDue, BillingAmt, PaidAmt, and DueBalance with exact live mathematical balance computations (PreDue + BillingAmt - PaidAmt); and an authentic 'Transactions Statement' report modal triggered via the TRANSACTION button featuring Pakiza Apparels Limited branding and factory address (Khordo Nowpara, Rasulpur, Madhabdi, Narsingdi), sky-blue centered date range banner, and a 3-column responsive card grid for each supplier with italic blue supplier heading, pink-header Bill Table (Opening balance, bill date, bill number, bill amounts, and Bill Total), lavender-header Payment Table (Pay Date, Chq No, paid amounts, Pay Total, and Discount), and bold bottom Out Standing summary balance with full print preview support.",
    "descriptionBn": "Reports à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Payment Statement' à¦…à§�à¦¯à¦¾à¦¨à¦¾à¦²à¦¾à¦‡à¦Ÿà¦¿à¦•à§�à¦¯à¦¾à¦² à¦�à¦¬à¦‚ à¦¸à¦¾à¦ªà§�à¦²à¦¾à§Ÿà¦¾à¦° à¦…à§�à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§�à¦Ÿà¦¸ à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦•à¦¨à¦¸à§‹à¦² à¦¹à§�à¦¬à¦¹à§� ERP à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¬à¦¾à¦®à¦ªà¦¾à¦¶à§‡ à¦¨à§€à¦² à¦¬à¦°à§�à¦¡à¦¾à¦° à¦¸à¦¹ à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¬à¦¾à¦° (Bill Location à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦¡à¦¿à¦«à¦²à§�à¦Ÿ 'PAL-Fabric Dyeing', Date From '01/09/2025', Date To '08/09/2026', à¦¬à§�à¦²à§� 'SHOW' à¦¬à¦¾à¦Ÿà¦¨ à¦�à¦¬à¦‚ à¦‰à¦œà§�à¦œà§�à¦¬à¦² à¦¸à¦¬à§�à¦œ 'TRANSACTION' à¦¬à¦¾à¦Ÿà¦¨); EXCEL, PRINT, PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨ à¦“ à¦²à¦¾à¦‡à¦­ à¦¸à¦¾à¦°à§�à¦š à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦Ÿà§�à¦²à¦¬à¦¾à¦°; à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ-à¦…à¦² à¦šà§‡à¦•à¦¬à¦•à§�à¦¸ à¦•à¦²à¦¾à¦® à¦¸à¦¹ âˆ‡ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦†à¦‡à¦•à¦¨, Supplier à¦¨à¦¾à¦®, PreDue, BillingAmt, PaidAmt, à¦�à¦¬à¦‚ à¦¸à§�à¦¬à§Ÿà¦‚à¦•à§�à¦°à¦¿à§Ÿ à¦—à¦¾à¦£à¦¿à¦¤à¦¿à¦• à¦¹à¦¿à¦¸à¦¾à¦¬à¦¯à§�à¦•à§�à¦¤ DueBalance (PreDue + BillingAmt - PaidAmt) à¦¡à¦¾à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡; à¦�à¦¬à¦‚ TRANSACTION à¦¬à¦¾à¦Ÿà¦¨à§‡ à¦•à§�à¦²à¦¿à¦• à¦•à¦°à¦²à§‡ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Transactions Statement' à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦®à§‹à¦¡à¦¾à¦² à¦¯à¦¾à¦¤à§‡ à¦°à§Ÿà§‡à¦›à§‡ à¦¸à¦¬à§�à¦œ Pakiza Apparels Limited à¦¬à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡à¦¿à¦‚ à¦“ à¦•à¦¾à¦°à¦–à¦¾à¦¨à¦¾ à¦ à¦¿à¦•à¦¾à¦¨à¦¾, à¦¸à§�à¦•à¦¾à¦‡-à¦¬à§�à¦²à§� à¦¤à¦¾à¦°à¦¿à¦– à¦°à§‡à¦žà§�à¦œ à¦¬à§�à¦¯à¦¾à¦¨à¦¾à¦°, à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦¸à¦¾à¦ªà§�à¦²à¦¾à§Ÿà¦¾à¦°à§‡à¦° à¦œà¦¨à§�à¦¯ à§©-à¦•à¦²à¦¾à¦® à¦°à§‡à¦¸à¦ªà¦¨à¦¸à¦¿à¦­ à¦•à¦¾à¦°à§�à¦¡ à¦—à§�à¦°à¦¿à¦¡ (à¦‡à¦Ÿà¦¾à¦²à¦¿à¦• à¦¬à§�à¦²à§� à¦¸à¦¾à¦ªà§�à¦²à¦¾à§Ÿà¦¾à¦° à¦¹à§‡à¦¡à¦¿à¦‚, à¦—à§‹à¦²à¦¾à¦ªà¦¿ à¦¹à§‡à¦¡à¦¾à¦°à¦¯à§�à¦•à§�à¦¤ Bill Table - Opening, à¦¬à¦¿à¦² à¦¤à¦¾à¦°à¦¿à¦–, à¦¬à¦¿à¦² à¦¨à¦®à§�à¦¬à¦°, à¦¬à¦¿à¦²à§‡à¦° à¦ªà¦°à¦¿à¦®à¦¾à¦£ à¦“ Bill Total, à¦²à§�à¦¯à¦¾à¦­à§‡à¦¨à§�à¦¡à¦¾à¦° à¦¹à§‡à¦¡à¦¾à¦°à¦¯à§�à¦•à§�à¦¤ Payment Table - à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦¤à¦¾à¦°à¦¿à¦–, à¦šà§‡à¦• à¦¨à¦®à§�à¦¬à¦°, à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦ªà¦°à¦¿à¦®à¦¾à¦£, Pay Total, Discount, à¦�à¦¬à¦‚ à¦¬à§‹à¦²à§�à¦¡ à¦«à¦¨à§�à¦Ÿà§‡ Out Standing à¦¬à§�à¦¯à¦¾à¦²à§‡à¦¨à§�à¦¸) à¦¸à¦¹ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦ªà§�à¦°à¦¿à¦­à¦¿à¦‰ à¦¸à§�à¦¬à¦¿à¦§à¦¾à¥¤"
  },
  {
    "id": "434",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-reports-purchase-price",
    "descriptionEn": "Created the official 'Purchase Price' analytical report console under Reports module matching exact ERP specifications: top filter panel with blue left accent bar (Store Name, Group Name e.g. Furniture_FixedAssets, Item Name text input, and vibrant blue 'SHOW' button); export toolbar with EXCEL, PRINT, and PDF export buttons alongside real-time search; comprehensive data table displaying Action (âˆ‡ list icon button to view historical bill records), GroupName, ItemName, Uom, LowestPrice, Supplier Details (Lowest Price with supplier name, Bill No, Bill Date, and interactive [â†—] external link), LastPrice, and Supplier Details (Last Price with supplier name, Bill No, Bill Date, and interactive [â†—] external link); interactive 'Purchase Price History' modal displaying Product Name, Unit, and a detailed Bill Details ledger (# with [â†—] bill view link, PurType, Supplier, BillNo, BillDate, Rate, DCRate, LandedCost, Currency); and an authentic full 'Supplier Bill Document' modal displaying 4-row header metadata (Bill To, Bill No, Address, Bill Date, Supplier, Purchase Type, Currency, Currency Rate), itemized goods table with DC Price and Landed Cost, and complete financial summary block (Total Amt, Vat Amt, Tax Amt, Other Amt, Net Total, Discount, G.Total) with printable layout.",
    "descriptionBn": "Reports à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Purchase Price' à¦…à§�à¦¯à¦¾à¦¨à¦¾à¦²à¦¾à¦‡à¦Ÿà¦¿à¦•à§�à¦¯à¦¾à¦² à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦•à¦¨à¦¸à§‹à¦² à¦¹à§�à¦¬à¦¹à§� ERP à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¬à¦¾à¦®à¦ªà¦¾à¦¶à§‡ à¦¨à§€à¦² à¦¬à¦°à§�à¦¡à¦¾à¦° à¦¸à¦¹ à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦² (Store Name, Group Name à¦¯à§‡à¦®à¦¨ Furniture_FixedAssets, Item Name à¦‡à¦¨à¦ªà§�à¦Ÿ à¦�à¦¬à¦‚ 'SHOW' à¦¬à¦¾à¦Ÿà¦¨); EXCEL, PRINT, PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨ à¦“ à¦²à¦¾à¦‡à¦­ à¦¸à¦¾à¦°à§�à¦š à¦Ÿà§�à¦²à¦¬à¦¾à¦°; à¦�à¦•à¦¶à¦¨ à¦•à¦²à¦¾à¦® (à¦¹à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦¦à§‡à¦–à¦¤à§‡ âˆ‡ à¦²à¦¿à¦¸à§�à¦Ÿ à¦†à¦‡à¦•à¦¨ à¦¬à¦¾à¦Ÿà¦¨), GroupName, ItemName, Uom, LowestPrice, Supplier Details (Lowest Price - à¦¸à¦¾à¦ªà§�à¦²à¦¾à§Ÿà¦¾à¦° à¦¨à¦¾à¦®, à¦¬à¦¿à¦² à¦¨à¦‚, à¦¤à¦¾à¦°à¦¿à¦– à¦“ [â†—] à¦²à¦¿à¦™à§�à¦•), LastPrice, à¦�à¦¬à¦‚ Supplier Details (Last Price - à¦¸à¦¾à¦ªà§�à¦²à¦¾à§Ÿà¦¾à¦° à¦¨à¦¾à¦®, à¦¬à¦¿à¦² à¦¨à¦‚, à¦¤à¦¾à¦°à¦¿à¦– à¦“ [â†—] à¦²à¦¿à¦™à§�à¦•) à¦¸à¦¹ à¦¡à¦¾à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡; Product Name, Unit, à¦�à¦¬à¦‚ à¦ªà§‚à¦°à§�à¦£à¦¾à¦™à§�à¦— Bill Details à¦²à§‡à¦œà¦¾à¦° (# à¦•à¦²à¦¾à¦®à§‡ [â†—] à¦²à¦¿à¦™à§�à¦•, PurType, Supplier, BillNo, BillDate, Rate, DCRate, LandedCost, Currency) à¦¸à¦¹ 'Purchase Price History' à¦®à§‹à¦¡à¦¾à¦²; à¦�à¦¬à¦‚ à§ª-à¦¸à¦¾à¦°à¦¿ à¦®à§‡à¦Ÿà¦¾à¦¡à§‡à¦Ÿà¦¾ (Bill To, Bill No, Address, Bill Date, Supplier, Purchase Type, Currency, Currency Rate), DC Price à¦“ Landed Cost à¦¸à¦¹ à¦†à¦‡à¦Ÿà§‡à¦® à¦Ÿà§‡à¦¬à¦¿à¦², à¦�à¦¬à¦‚ à¦«à¦¿à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¸à¦¿à§Ÿà¦¾à¦² à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦¬à§�à¦²à¦• (Total Amt, Vat Amt, Tax Amt, Other Amt, Net Total, Discount, G.Total) à¦¸à¦¹ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Supplier Bill Document' à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦®à§‹à¦¡à¦¾à¦²à¥¤"
  },
  {
    "id": "433",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-audit-bill",
    "descriptionEn": "Created the official 'Bill Audit' verification ledger and document console under Audit module matching exact ERP specifications: top filter panel with blue left accent bar (Date From, Date To, Audited Status dropdown with Unaudited/Audited/All, Searchable Supplier Name selector, and vibrant blue 'SHOW' button); action toolbar with EXCEL, PRINT, and PDF export buttons alongside live search; data table displaying Action (Blue Print Billing Info, Amber Pencil Bill Audit, and Green Paperclip Attachment viewer buttons), Supplier, Bill No, Bill Date, Currency, Currency Rate, Bill Value, Vat Amount, Tax Amount, Net Payable, Mrr No, Challan No, Remarks, and Status badges; interactive 'Bill Audit' modal with comprehensive metadata grid (Bill No, Bill Date, Supplier, PO/WO, PO/WO Date, Currency, Exchange Rate, MRIR No, MRIR Date, Challan No, Challan Date), itemized goods table with inline editable 'Review Note' inputs, complete financial breakdown rows (Total Qty, Total Amount, Discount, Vat(Inc), Tax(Inc), Others Amount, Advance Adjustment, Net Amount), spelled-out amount in words, clickable attachment file link, editable 'Audit Value *' field, 'Audit Note' textarea, and dual action buttons (amber 'REVIEW' to mark Under Review and blue 'AUDITED' to approve and commit to local storage); authentic 'Billing Information' print preview modal featuring Pakiza Software branding, address, boxed metadata, itemized table, comment section, and a 4-tier signature block (Prepared By, Vat and Tax Inputted By, Audited By, Approved By); and a dedicated document attachment preview modal.",
    "descriptionBn": "Audit à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Bill Audit' à¦­à§‡à¦°à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦²à§‡à¦œà¦¾à¦° à¦“ à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦•à¦¨à¦¸à§‹à¦² à¦¹à§�à¦¬à¦¹à§� ERP à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¬à¦¾à¦®à¦ªà¦¾à¦¶à§‡ à¦¨à§€à¦² à¦¬à¦°à§�à¦¡à¦¾à¦° à¦¸à¦¹ à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦² (Date From, Date To, Audited Status à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ - Unaudited/Audited/All, Searchable Supplier Name à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° à¦�à¦¬à¦‚ 'SHOW' à¦¬à¦¾à¦Ÿà¦¨); EXCEL, PRINT, PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨ à¦“ à¦²à¦¾à¦‡à¦­ à¦¸à¦¾à¦°à§�à¦š à¦Ÿà§�à¦²à¦¬à¦¾à¦°; à¦�à¦•à¦¶à¦¨ à¦•à¦²à¦¾à¦® (à¦¬à§�à¦²à§� à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ Billing Info, à¦…à§�à¦¯à¦¾à¦®à§�à¦¬à¦¾à¦° à¦ªà§‡à¦¨à§�à¦¸à¦¿à¦² Bill Audit à¦�à¦¬à¦‚ à¦—à§�à¦°à¦¿à¦¨ à¦ªà§‡à¦ªà¦¾à¦°à¦•à§�à¦²à¦¿à¦ª à¦…à§�à¦¯à¦¾à¦Ÿà¦¾à¦šà¦®à§‡à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰à§Ÿà¦¾à¦° à¦¬à¦¾à¦Ÿà¦¨), Supplier, Bill No, Bill Date, Currency, Currency Rate, Bill Value, Vat Amount, Tax Amount, Net Payable, Mrr No, Challan No, Remarks, à¦�à¦¬à¦‚ Status à¦¬à§�à¦¯à¦¾à¦œ à¦¸à¦¹ à¦¡à¦¾à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡; à¦®à§‡à¦Ÿà¦¾à¦¡à§‡à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡, à¦†à¦‡à¦Ÿà§‡à¦®à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦�à¦¡à¦¿à¦Ÿà§‡à¦¬à¦² 'Review Note' à¦‡à¦¨à¦ªà§�à¦Ÿ, à¦ªà§‚à¦°à§�à¦£à¦¾à¦™à§�à¦— à¦«à¦¿à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¸à¦¿à§Ÿà¦¾à¦² à¦¬à§�à¦°à§‡à¦•à¦¡à¦¾à¦‰à¦¨ (Total Qty, Total Amount, Discount, Vat(Inc), Tax(Inc), Others Amount, Advance Adjustment, Net Amount), à¦•à¦¥à¦¾à§Ÿ à¦Ÿà¦¾à¦•à¦¾à¦° à¦ªà¦°à¦¿à¦®à¦¾à¦£, à¦•à§�à¦²à¦¿à¦•à¦¯à§‹à¦—à§�à¦¯ à¦…à§�à¦¯à¦¾à¦Ÿà¦¾à¦šà¦®à§‡à¦¨à§�à¦Ÿ à¦«à¦¾à¦‡à¦² à¦²à¦¿à¦™à§�à¦•, à¦�à¦¡à¦¿à¦Ÿà§‡à¦¬à¦² 'Audit Value *' à¦«à¦¿à¦²à§�à¦¡, 'Audit Note' à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿà¦�à¦°à¦¿à§Ÿà¦¾, à¦�à¦¬à¦‚ à¦¡à§�à§Ÿà¦¾à¦² à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦Ÿà¦¨ (à¦…à§�à¦¯à¦¾à¦®à§�à¦¬à¦¾à¦° 'REVIEW' à¦�à¦¬à¦‚ à¦¬à§�à¦²à§� 'AUDITED') à¦¸à¦¹ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à§‡à¦•à§�à¦Ÿà¦¿à¦­ 'Bill Audit' à¦®à§‹à¦¡à¦¾à¦²; Pakiza Software à¦¬à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡à¦¿à¦‚, à¦ à¦¿à¦•à¦¾à¦¨à¦¾, à¦†à¦‡à¦Ÿà§‡à¦® à¦Ÿà§‡à¦¬à¦¿à¦², à¦•à¦®à§‡à¦¨à§�à¦Ÿ à¦¸à§‡à¦•à¦¶à¦¨ à¦�à¦¬à¦‚ à§ª-à¦¸à§�à¦¤à¦° à¦¬à¦¿à¦¶à¦¿à¦·à§�à¦Ÿ à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦¬à§�à¦²à¦• (Prepared By, Vat and Tax Inputted By, Audited By, Approved By) à¦¸à¦¹ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Billing Information' à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦ªà§�à¦°à¦¿à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦²; à¦�à¦¬à¦‚ à¦¡à§‡à¦¡à¦¿à¦•à§‡à¦Ÿà§‡à¦¡ à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦…à§�à¦¯à¦¾à¦Ÿà¦¾à¦šà¦®à§‡à¦¨à§�à¦Ÿ à¦ªà§�à¦°à¦¿à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦²à¥¤"
  },
  {
    "id": "432",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-audit-landed-cost",
    "descriptionEn": "Rebuilt the official 'Update Landed Cost' registry and calculation console under Audit module matching exact ERP specifications: top filter panel with blue left accent bar (PI Date From, PI Date To, Searchable Supplier Name selector, sky-blue styled PI Number input, and 'SHOW' button); action toolbar with EXCEL, PRINT, and PDF export buttons alongside live search; data table styled with slate-gray headers displaying Action (# column with Blue Print PI and Amber Pencil edit buttons), PINo, PIDate, LcNo, LcDate, ShipmentDate, Supplier, ProductType, and Status with custom badges; interactive 'Proforma Invoice' print view modal featuring green Pakiza Knit Composite Ltd company branding, address, centered blue title, two-column metadata (PI No, LC No, Supplier, Terms, Validity, Currency, Ports, Dates, Type), itemized goods table, remarks, and financial summary (Total, Upcharge, Discount, Net Total); and an advanced 'Update Product Landed Cost Sheet' modal providing real-time landing expense apportionment (Customs Duty/Taxes, Marine Insurance, Freight & Shipping, Port Charges/C&F Commission, Inland Transportation, Bank Charges/LC Commission, and Misc Expenses), live Landed Cost Factor multiplier and surcharge percentage, and automatic line-item landed unit rate recalculations saved to local storage.",
    "descriptionBn": "Audit à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Update Landed Cost' à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦“ à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦¶à¦¨ à¦•à¦¨à¦¸à§‹à¦² à¦¹à§�à¦¬à¦¹à§� ERP à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦°à¦¿-à¦¬à¦¿à¦²à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¬à¦¾à¦®à¦ªà¦¾à¦¶à§‡ à¦¨à§€à¦² à¦¬à¦°à§�à¦¡à¦¾à¦° à¦¸à¦¹ à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦² (PI Date From, PI Date To, Searchable Supplier Name à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦°, à¦¸à§�à¦•à¦¾à¦‡-à¦¬à§�à¦²à§� à¦²à§‡à¦¬à§‡à¦² à¦¸à¦¹ PI Number à¦‡à¦¨à¦ªà§�à¦Ÿ à¦�à¦¬à¦‚ 'SHOW' à¦¬à¦¾à¦Ÿà¦¨); EXCEL, PRINT, PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨ à¦“ à¦²à¦¾à¦‡à¦­ à¦¸à¦¾à¦°à§�à¦š à¦Ÿà§�à¦²à¦¬à¦¾à¦°; à¦¸à§�à¦²à§‡à¦Ÿ-à¦§à§‚à¦¸à¦° à¦¹à§‡à¦¡à¦¾à¦° à¦¸à¦¹ à¦¡à¦¾à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡ (# à¦•à¦²à¦¾à¦®à§‡ à¦¬à§�à¦²à§� à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ PI à¦“ à¦…à§�à¦¯à¦¾à¦®à§�à¦¬à¦¾à¦° à¦ªà§‡à¦¨à§�à¦¸à¦¿à¦² à¦�à¦¡à¦¿à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨, PINo, PIDate, LcNo, LcDate, ShipmentDate, Supplier, ProductType, Status à¦¬à§�à¦¯à¦¾à¦œ); à¦¸à¦¬à§�à¦œ Pakiza Knit Composite Ltd à¦¬à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡à¦¿à¦‚, à¦ à¦¿à¦•à¦¾à¦¨à¦¾, à¦¦à§�à¦‡-à¦•à¦²à¦¾à¦® à¦®à§‡à¦Ÿà¦¾à¦¡à§‡à¦Ÿà¦¾, à¦†à¦‡à¦Ÿà§‡à¦® à¦Ÿà§‡à¦¬à¦¿à¦² à¦“ à¦«à¦¿à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¸à¦¿à§Ÿà¦¾à¦² à¦¸à¦¾à¦®à¦¾à¦°à¦¿ (Total, Upcharge, Discount, Net Total) à¦¸à¦¹ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Proforma Invoice' à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦²; à¦�à¦¬à¦‚ à¦°à¦¿à§Ÿà§‡à¦²-à¦Ÿà¦¾à¦‡à¦® à¦²à§�à¦¯à¦¾à¦¨à§�à¦¡à¦¿à¦‚ à¦¬à§�à¦¯à§Ÿ à¦¬à¦£à§�à¦Ÿà¦¨ (à¦•à¦¾à¦¸à§�à¦Ÿà¦®à¦¸ à¦¶à§�à¦²à§�à¦•, à¦®à§‡à¦°à¦¿à¦¨ à¦‡à¦¨à§�à¦¸à§�à¦¯à§�à¦°à§‡à¦¨à§�à¦¸, à¦«à§�à¦°à§‡à¦‡à¦Ÿ à¦“ à¦¶à¦¿à¦ªà¦¿à¦‚, à¦ªà§‹à¦°à§�à¦Ÿ à¦“ à¦¸à¦¿à¦…à§�à¦¯à¦¾à¦¨à§�à¦¡à¦�à¦« à¦•à¦®à¦¿à¦¶à¦¨, à¦…à¦­à§�à¦¯à¦¨à§�à¦¤à¦°à§€à¦£ à¦ªà¦°à¦¿à¦¬à¦¹à¦¨, à¦¬à§�à¦¯à¦¾à¦‚à¦• à¦šà¦¾à¦°à§�à¦œ à¦�à¦¬à¦‚ à¦…à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¯ à¦–à¦°à¦š), à¦²à¦¾à¦‡à¦­ Landed Cost Factor à¦®à¦¾à¦²à§�à¦Ÿà¦¿à¦ªà§�à¦²à¦¾à§Ÿà¦¾à¦° à¦“ à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ à¦¶à¦¤à¦•à¦°à¦¾ à¦¹à¦¾à¦°, à¦�à¦¬à¦‚ à¦²à§‹à¦•à¦¾à¦² à¦¸à§�à¦Ÿà§‹à¦°à§‡à¦œà§‡ à¦¸à¦‚à¦°à¦•à§�à¦·à¦£à¦¯à§‹à¦—à§�à¦¯ à¦†à¦‡à¦Ÿà§‡à¦®à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦¸à§�à¦¬à§Ÿà¦‚à¦•à§�à¦°à¦¿à§Ÿ à¦²à§�à¦¯à¦¾à¦¨à§�à¦¡à§‡à¦¡ à¦‡à¦‰à¦¨à¦¿à¦Ÿ à¦°à§‡à¦Ÿ à¦¸à¦¹ à¦…à§�à¦¯à¦¾à¦¡à¦­à¦¾à¦¨à§�à¦¸à¦¡ 'Update Product Landed Cost Sheet' à¦®à§‹à¦¡à¦¾à¦²à¥¤"
  },
  {
    "id": "431",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-audit-mrr",
    "descriptionEn": "Created the official 'MRR Audit' ledger and review console under the Audit module matching exact ERP mockups: top filter panel with blue left accent bar (Location Name, Store Name, MRR Date From/To, MRR Type, Searchable Supplier Name selector, comma-separated MRR Numbers and Challan Numbers filters, and vibrant blue 'SHOW' button); action toolbar with EXCEL, PRINT, and PDF export buttons alongside real-time table search; data table displaying Action (Blue Print MRIR and Amber Audit icons), MRR, MRRDate, Supplier, Challan, ChDate, BillNo, and Remark; interactive 'MRR Details' audit modal with comprehensive metadata grid (MRR No, PO No, Revision, Dates, Supplier, Challan, LC, Bill info), itemized goods table with editable line-by-line 'Review Note' fields, mandatory 'Audit Note *' observation field, and 'AUDITED' action button that commits verification status to state and local storage; and an authentic 'Material Receiving & Inspection Report (MRIR)' print preview modal featuring Pakiza Software branding, office address, receive details header, boxed metadata, quantity/price breakdown, spelled-out amount in words, verification notes, and a 6-tier signature block (MCD Prepared By, MCD Checked By, Quality Inspected By, MCD Approved By, Billing Info Inputted By, Billing Info Approved By).",
    "descriptionBn": "Audit à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'MRR Audit' à¦²à§‡à¦œà¦¾à¦° à¦“ à¦°à¦¿à¦­à¦¿à¦‰ à¦•à¦¨à¦¸à§‹à¦² à¦¹à§�à¦¬à¦¹à§� ERP à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¬à¦¾à¦®à¦ªà¦¾à¦¶à§‡ à¦¨à§€à¦² à¦¬à¦°à§�à¦¡à¦¾à¦° à¦¸à¦¹ à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦² (Location Name, Store Name, MRR Date From/To, MRR Type, Searchable Supplier Name à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦°, à¦•à¦®à¦¾-à¦¸à§‡à¦ªà¦¾à¦°à§‡à¦Ÿà§‡à¦¡ MRR Numbers à¦“ Challan Numbers à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦�à¦¬à¦‚ 'SHOW' à¦¬à¦¾à¦Ÿà¦¨); EXCEL, PRINT, PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨ à¦“ à¦²à¦¾à¦‡à¦­ à¦¸à¦¾à¦°à§�à¦š à¦Ÿà§�à¦²à¦¬à¦¾à¦°; à¦�à¦•à¦¶à¦¨ à¦•à¦²à¦¾à¦® (à¦¬à§�à¦²à§� à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ MRIR à¦“ à¦…à§�à¦¯à¦¾à¦®à§�à¦¬à¦¾à¦° à¦…à¦¡à¦¿à¦Ÿ à¦†à¦‡à¦•à¦¨), MRR, MRRDate, Supplier, Challan, ChDate, BillNo, à¦“ Remark à¦¸à¦¹ à¦¡à¦¾à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡; à¦®à§‡à¦Ÿà¦¾à¦¡à§‡à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡, à¦†à¦‡à¦Ÿà§‡à¦®à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦�à¦¡à¦¿à¦Ÿà§‡à¦¬à¦² 'Review Note' à¦‡à¦¨à¦ªà§�à¦Ÿ, à¦†à¦¬à¦¶à§�à¦¯à¦¿à¦• 'Audit Note *' à¦«à¦¿à¦²à§�à¦¡ à¦“ 'AUDITED' à¦¬à¦¾à¦Ÿà¦¨ à¦¸à¦¹ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à§‡à¦•à§�à¦Ÿà¦¿à¦­ 'MRR Details' à¦…à¦¡à¦¿à¦Ÿ à¦®à§‹à¦¡à¦¾à¦² à¦¯à¦¾ à¦­à§‡à¦°à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦²à§‹à¦•à¦¾à¦² à¦¸à§�à¦Ÿà§‹à¦°à§‡à¦œà§‡ à¦¸à¦‚à¦°à¦•à§�à¦·à¦£ à¦•à¦°à§‡; à¦�à¦¬à¦‚ Pakiza Software à¦¬à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡à¦¿à¦‚, à¦ à¦¿à¦•à¦¾à¦¨à¦¾, à¦°à¦¿à¦¸à¦¿à¦­ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦¹à§‡à¦¡à¦¾à¦°, à¦•à§‹à§Ÿà¦¾à¦¨à§�à¦Ÿà¦¿à¦Ÿà¦¿/à¦ªà§�à¦°à¦¾à¦‡à¦¸ à¦¬à§�à¦°à§‡à¦•à¦¡à¦¾à¦‰à¦¨, à¦•à¦¥à¦¾à§Ÿ à¦Ÿà¦¾à¦•à¦¾à¦° à¦ªà¦°à¦¿à¦®à¦¾à¦£, à¦­à§‡à¦°à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦¨à§‹à¦Ÿ à¦�à¦¬à¦‚ à§¬-à¦¸à§�à¦¤à¦° à¦¬à¦¿à¦¶à¦¿à¦·à§�à¦Ÿ à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦¬à§�à¦²à¦• (MCD Prepared By, MCD Checked By, Quality Inspected By, MCD Approved By, Billing Info Inputted By, Billing Info Approved By) à¦¸à¦¹ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Material Receiving & Inspection Report (MRIR)' à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦ªà§�à¦°à¦¿à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦²à¥¤"
  },
  {
    "id": "430",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-payment-list",
    "descriptionEn": "Created the official 'Payment List' report console under Payment module matching exact BPM specifications: top filter panel with Date From, Date To, Payment Mode radio group (All, Cash, Cheque), Searchable Supplier selector featuring full ERP supplier directory (with 'All...' default and instant search filter), and 'Show' action button; export toolbar with Excel, Print, PDF actions and live search; data table with exact columns (âˆ‡, Supplier, Mode, PaymentDate, Amount, ChqNo, ChqDate, Remarks); interactive Bill Payment Voucher document preview modal with Pakiza Software branding, metadata, settled bills breakdown, spelled-out amount in words, and 4-tier signature block; live integration with vouchers saved from the Bill Payment page; and pagination with record status.",
    "descriptionBn": "Payment à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Payment List' à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦•à¦¨à¦¸à§‹à¦² à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦²à§‡ Date From, Date To, Payment Mode à¦°à§‡à¦¡à¦¿à¦“ à¦…à¦ªà¦¶à¦¨ (All, Cash, Cheque), à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ ERP à¦¸à¦¾à¦ªà§�à¦²à¦¾à¦¯à¦¼à¦¾à¦° à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦¸à¦¹ Searchable à¦¸à¦¾à¦ªà§�à¦²à¦¾à¦¯à¦¼à¦¾à¦° à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° ('All...' à¦¡à¦¿à¦«à¦²à§�à¦Ÿ à¦“ à¦‡à¦¨à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦Ÿ à¦¸à¦¾à¦°à§�à¦š à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°) à¦�à¦¬à¦‚ 'Show' à¦¬à¦¾à¦Ÿà¦¨; Excel, Print, PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦Ÿà§�à¦²à¦¬à¦¾à¦° à¦“ à¦²à¦¾à¦‡à¦­ à¦¸à¦¾à¦°à§�à¦š; à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² à¦•à¦²à¦¾à¦® à¦¸à¦¹ à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² (âˆ‡, Supplier, Mode, PaymentDate, Amount, ChqNo, ChqDate, Remarks); Pakiza Software à¦¬à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡à¦¿à¦‚, à¦®à§‡à¦Ÿà¦¾à¦¡à§‡à¦Ÿà¦¾, à¦¸à§‡à¦Ÿà§‡à¦²à§�à¦¡ à¦¬à¦¿à¦² à¦¬à§�à¦°à§‡à¦•à¦¡à¦¾à¦‰à¦¨, à¦•à¦¥à¦¾à§Ÿ à¦Ÿà¦¾à¦•à¦¾à¦° à¦ªà¦°à¦¿à¦®à¦¾à¦£ à¦�à¦¬à¦‚ à§ª-à¦¸à§�à¦¤à¦° à¦¬à¦¿à¦¶à¦¿à¦·à§�à¦Ÿ à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦¬à§�à¦²à¦• à¦¸à¦¹ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à§‡à¦•à§�à¦Ÿà¦¿à¦­ Bill Payment Voucher à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦ªà§�à¦°à¦¿à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦²; Bill Payment à¦ªà§‡à¦œ à¦¥à§‡à¦•à§‡ à¦¸à§‡à¦­ à¦•à¦°à¦¾ à¦­à¦¾à¦‰à¦šà¦¾à¦°à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦²à¦¾à¦‡à¦­ à¦‡à¦¨à§�à¦Ÿà¦¿à¦—à§�à¦°à§‡à¦¶à¦¨; à¦�à¦¬à¦‚ à¦ªà§‡à¦œà¦¿à¦¨à§‡à¦¶à¦¨ à¦“ à¦°à§‡à¦•à¦°à§�à¦¡ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸à¥¤"
  },
  {
    "id": "429",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-payment-bill",
    "descriptionEn": "Created the official 'Bill Payment' settlement console under Payment module matching exact mockup specifications: top payment form card with blue left accent bar (Payment Mode, Payment Date, Supplier Name, Bank Account, Cheque No, Cheque Date, Amount, Remarks, SUBMIT button, live PaidAmt and Discount counters, and SHOW button), pending bills grid with filter/select-all checkbox column (Type, Location, Bill No, Bill Date, Bill Amt, DueAmt, editable PaidAmt and Discount inputs), live allocation calculations, auto-allocate button, secondary toolbar with currency filters (ALL, BDT, USD), search and print actions, payment history drawer, and an official printable Bill Payment Voucher document modal with multi-signature block.",
    "descriptionBn": "Payment à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Bill Payment' à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦•à¦¨à¦¸à§‹à¦² à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¬à¦¾à¦®à¦ªà¦¾à¦¶à§‡ à¦¨à§€à¦² à¦¬à¦°à§�à¦¡à¦¾à¦° à¦¸à¦¹ à¦Ÿà¦ª à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦«à¦°à§�à¦® à¦•à¦¾à¦°à§�à¦¡ (Payment Mode, Payment Date, Supplier Name, Bank Account, Cheque No, Cheque Date, Amount, Remarks, SUBMIT à¦¬à¦¾à¦Ÿà¦¨, à¦²à¦¾à¦‡à¦­ PaidAmt à¦“ Discount à¦•à¦¾à¦‰à¦¨à§�à¦Ÿà¦¾à¦° à¦�à¦¬à¦‚ SHOW à¦¬à¦¾à¦Ÿà¦¨), à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°/à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ-à¦…à¦² à¦šà§‡à¦•à¦¬à¦•à§�à¦¸ à¦•à¦²à¦¾à¦® à¦¸à¦¹ à¦ªà§‡à¦¨à§�à¦¡à¦¿à¦‚ à¦¬à¦¿à¦² à¦—à§�à¦°à¦¿à¦¡ (Type, Location, Bill No, Bill Date, Bill Amt, DueAmt, à¦�à¦¡à¦¿à¦Ÿà§‡à¦¬à¦² PaidAmt à¦“ Discount à¦‡à¦¨à¦ªà§�à¦Ÿ), à¦²à¦¾à¦‡à¦­ à¦�à¦²à§‹à¦•à§‡à¦¶à¦¨ à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦Ÿà¦°, à¦…à¦Ÿà§‹-à¦�à¦²à§‹à¦•à§‡à¦Ÿ à¦«à¦¿à¦šà¦¾à¦°, à¦•à¦¾à¦°à§‡à¦¨à§�à¦¸à¦¿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° (ALL, BDT, USD), à¦¸à¦¾à¦°à§�à¦š à¦“ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦�à¦•à¦¶à¦¨, à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦¹à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦Ÿà§�à¦¯à¦¾à¦¬ à¦�à¦¬à¦‚ à§ª-à¦¸à§�à¦¤à¦° à¦¬à¦¿à¦¶à¦¿à¦·à§�à¦Ÿ à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦¬à§�à¦²à¦• à¦¸à¦¹ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿà¦¯à§‹à¦—à§�à¦¯ Bill Payment Voucher à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦®à§‹à¦¡à¦¾à¦²à¥¤"
  },
  {
    "id": "428",
    "date": "2026-09-14T10:30",
    "type": "UI Enhancement",
    "module": "Procurement Module",
    "link": "/procurement-billing-vat-tax-register",
    "descriptionEn": "Redesigned the official 'Billing Information' document view modal in VAT and Tax Register to match the authentic ERP billing format. Features Pakiza Software company branding header with address, serif document title, bordered Bill No / Date / Supplier table, 3-row comprehensive metadata grid (PO/WO, PO Date, Currency, Exchange Rate, MRIR No, MRIR Date, Challan No, Challan Date, Advance Adjustment), itemized goods table with underlined headers and total quantity, attached multi-line financial summary (Total Amount, Discount, Others, VAT Inc, TAX Inc, Net Payable, Total Amount), spelled out 'In words' number-to-words line, comment field, and a 4-tier signature block (Prepared By, Vat and Tax Inputted By, Audited By, Approved By).",
    "descriptionBn": "VAT and Tax Register à¦ªà§‡à¦œà§‡à¦° à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² 'Billing Information' à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿ à¦°à¦¿à§Ÿà§‡à¦² ERP à¦«à¦°à¦®à§�à¦¯à¦¾à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦°à¦¿-à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦°à§Ÿà§‡à¦›à§‡ à¦ à¦¿à¦•à¦¾à¦¨à¦¾ à¦¸à¦¹ Pakiza Software à¦¬à§�à¦°à¦¾à¦¨à§�à¦¡à¦¿à¦‚ à¦¹à§‡à¦¡à¦¾à¦°, à¦¸à§‡à¦°à¦¿à¦« à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦Ÿà¦¾à¦‡à¦Ÿà§‡à¦², à¦¬à¦°à§�à¦¡à¦¾à¦° à¦¸à¦¹ Bill No/Date/Supplier à¦Ÿà§‡à¦¬à¦¿à¦², à§©-à¦¸à¦¾à¦°à¦¿ à¦¬à¦¿à¦¶à¦¿à¦·à§�à¦Ÿ à¦®à§‡à¦Ÿà¦¾à¦¡à§‡à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡ (PO/WO, PO Date, Currency, Exchange Rate, MRIR No, MRIR Date, Challan No, Challan Date, Advance Adjustment), à¦†à¦¨à§�à¦¡à¦¾à¦°à¦²à¦¾à¦‡à¦¨ à¦¹à§‡à¦¡à¦¾à¦° à¦¸à¦¹ à¦†à¦‡à¦Ÿà§‡à¦® à¦Ÿà§‡à¦¬à¦¿à¦² à¦“ à¦Ÿà§‹à¦Ÿà¦¾à¦² à¦•à§‹à§Ÿà¦¾à¦¨à§�à¦Ÿà¦¿à¦Ÿà¦¿, à¦¹à¦°à¦¿à¦œà¦¨à§�à¦Ÿà¦¾à¦² à¦«à¦¿à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¸à¦¿à§Ÿà¦¾à¦² à¦¸à¦¾à¦®à¦¾à¦°à¦¿ (Total Amount, Discount, Others, VAT Inc, TAX Inc, Net Payable), à¦•à¦¥à¦¾à§Ÿ à¦Ÿà¦¾à¦•à¦¾à¦° à¦ªà¦°à¦¿à¦®à¦¾à¦£ ('In words' number-to-words), à¦•à¦®à§‡à¦¨à§�à¦Ÿ à¦¸à§‡à¦•à¦¶à¦¨ à¦�à¦¬à¦‚ à§ª-à¦¸à§�à¦¤à¦° à¦¬à¦¿à¦¶à¦¿à¦·à§�à¦Ÿ à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦¬à§�à¦²à¦• (Prepared By, Vat and Tax Inputted By, Audited By, Approved By)à¥¤"
  },
  {
    "id": "427",
    "date": "2026-09-08T12:55",
    "type": "New Feature",
    "module": "Procurement",
    "link": "/procurement-billing-supplier-bill",
    "descriptionEn": "Merged 'Supplier Bill Record' and 'Supplier Bill Record List' into a unified 'Supplier Bill' page. Features advanced multi-filter search panel, expandable MRR detail rows, quick summary stats, and a smart Add New Supplier Bill form with live Total Bill Value and Bill Balance calculations plus an inline MRR Details entry table.",
    "descriptionBn": "'Supplier Bill Record' à¦�à¦¬à¦‚ 'Supplier Bill Record List' à¦®à§‡à¦¨à§� à¦¦à§�à¦Ÿà¦¿à¦•à§‡ à¦�à¦•à¦Ÿà¦¿ à¦�à¦•à¦• 'Supplier Bill' à¦ªà§‡à¦œà§‡ à¦�à¦•à¦¤à§�à¦°à¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦‡ à¦ªà§‡à¦œà§‡ à¦…à§�à¦¯à¦¾à¦¡à¦­à¦¾à¦¨à§�à¦¸à¦¡ à¦®à¦¾à¦²à§�à¦Ÿà¦¿-à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¸à¦¾à¦°à§�à¦š à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦², à¦�à¦•à§�à¦¸à¦ªà§�à¦¯à¦¾à¦¨à§�à¦¡à§‡à¦¬à¦² MRR à¦¡à¦¿à¦Ÿà§‡à¦‡à¦² à¦¸à¦¾à¦°à¦¿, à¦•à§�à¦‡à¦• à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¸ à¦�à¦¬à¦‚ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦®à¦¾à¦°à§�à¦Ÿ Add New Supplier Bill à¦«à¦°à§�à¦® à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦²à¦¾à¦‡à¦­ Total Bill Value à¦“ Bill Balance à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦¶à¦¨ à¦�à¦¬à¦‚ à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ MRR Details à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦Ÿà§‡à¦¬à¦¿à¦² à¦°à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "426",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-billing-prepare",
    "descriptionEn": "Updated the 'Prepare Bill' workspace under Billing module matching exact mockup specifications: top filter console (Location, Document, Supplier Name, SHOW button), 2-column split master-detail layout (Left: Pending PO & GRN List with PO NO, Attachment, ChNo, ChDate, GRNo, GRDate; Right: Prepare Bill form with Bill Number, Bill Date, Purchase Type, Currency, Exchange Rate, Is Loan), light-green itemized grid (ItemName, PurchaseQty, AcPrice, TotalPrice), financial summary (Total Amt, Discount, Other Amt, Advance Adjustment, Net Payable, G.Total), comments, and 3 action buttons (Adjustment, ATTACHMENT, SAVE).",
    "descriptionBn": "Billing à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° 'Prepare Bill' à¦ªà§‡à¦œà¦Ÿà¦¿ à¦†à¦ªà¦—à§�à¦°à§‡à¦¡ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¬à¦¾à¦° (Location, Document, Supplier Name, SHOW à¦¬à¦¾à¦Ÿà¦¨), à§¨-à¦•à¦²à¦¾à¦® à¦¸à§�à¦ªà§�à¦²à¦¿à¦Ÿ à¦²à§‡à¦†à¦‰à¦Ÿ (à¦¬à¦¾à¦® à¦ªà¦¾à¦¶à§‡: à¦ªà§‡à¦¨à§�à¦¡à¦¿à¦‚ PO à¦“ GRN à¦²à¦¿à¦¸à§�à¦Ÿ - PO NO, Att, ChNo, ChDate, GRNo, GRDate; à¦¡à¦¾à¦¨ à¦ªà¦¾à¦¶à§‡: Prepare Bill à¦«à¦°à§�à¦® - Bill Number, Bill Date, Purchase Type, Currency, Exchange Rate, Is Loan), à¦¹à¦¾à¦²à¦•à¦¾ à¦¸à¦¬à§�à¦œ à¦†à¦‡à¦Ÿà§‡à¦® à¦Ÿà§‡à¦¬à¦¿à¦² (ItemName, PurchaseQty, AcPrice, TotalPrice), à¦«à¦¿à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¸à¦¿à§Ÿà¦¾à¦² à¦¸à¦¾à¦®à¦¾à¦°à¦¿ (Total Amt, Discount, Other Amt, Advance Adjustment, Net Payable, G.Total) à¦�à¦¬à¦‚ à§©à¦Ÿà¦¿ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦Ÿà¦¨ (Adjustment, ATTACHMENT, SAVE)à¥¤"
  },
  {
    "id": "425",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-billing-vat-tax-entry",
    "descriptionEn": "Created the smart 'VAT Tax Entry' console under Billing module featuring top filter bar (Date From/To, VAT Applicable, Supplier Name, SHOW & ATTACHMENT action buttons), master-detail 2-column split layout (Left: Unposted Bills Selection List with search; Right: Prepare Bill console), editable items table, real-time VAT & Tax live calculation engine (Payer, Type: Include/Exclude, %, Output), Net Payable & G.Total summary, comments field, and attachment viewer modal.",
    "descriptionBn": "Billing à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦¸à§�à¦®à¦¾à¦°à§�à¦Ÿ 'VAT Tax Entry' à¦•à¦¨à¦¸à§‹à¦² à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦Ÿà¦ª à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¬à¦¾à¦° (Date From/To, VAT Applicable, Supplier Name, SHOW à¦�à¦¬à¦‚ ATTACHMENT à¦¬à¦¾à¦Ÿà¦¨), à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦°-à¦¡à¦¿à¦Ÿà§‡à¦‡à¦² à§¨-à¦•à¦²à¦¾à¦® à¦¸à§�à¦ªà§�à¦²à¦¿à¦Ÿ à¦²à§‡à¦†à¦‰à¦Ÿ (à¦¬à¦¾à¦® à¦ªà¦¾à¦¶à§‡: à¦†à¦¨à¦ªà§‹à¦¸à§�à¦Ÿà§‡à¦¡ à¦¬à¦¿à¦² à¦²à¦¿à¦¸à§�à¦Ÿ; à¦¡à¦¾à¦¨ à¦ªà¦¾à¦¶à§‡: à¦¬à¦¿à¦² à¦ªà§�à¦°à¦¿à¦ªà§‡à¦¯à¦¼à¦¾à¦° à¦•à¦¨à¦¸à§‹à¦²), à¦�à¦¡à¦¿à¦Ÿà§‡à¦¬à¦² à¦†à¦‡à¦Ÿà§‡à¦®à¦¸ à¦Ÿà§‡à¦¬à¦¿à¦², à¦°à¦¿à¦¯à¦¼à§‡à¦²-à¦Ÿà¦¾à¦‡à¦® VAT à¦“ TAX à¦²à¦¾à¦‡à¦­ à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦Ÿà¦° (Payer, Type: Include/Exclude, %, Output), Net Payable à¦“ G.Total à¦¸à¦¾à¦®à¦¾à¦°à¦¿, à¦•à¦®à§‡à¦¨à§�à¦Ÿ à¦¬à¦•à§�à¦¸ à¦�à¦¬à¦‚ à¦�à§�à¦¯à¦¾à¦Ÿà¦¾à¦šà¦®à§‡à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰à¦¯à¦¼à¦¾à¦° à¦®à§‹à¦¡à¦¾à¦² à¦°à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "424",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-billing-vat-tax-register",
    "descriptionEn": "Created the new 'VAT and Tax Register' compliance registry page under Billing module with Date From/To, Bill No, Purchase Order No, VAT & Tax Posting Status (All, Post, Un-Post) radio selector, Supplier Name filter, Excel/Print/PDF export actions, exact table columns (SL, Action, Supplier Name, Bill No, Bill Date, Bill Type, Currency, Exchange Rate, Bill Value, Vat amount, Tax amount, Discount Amt, Net Payable, Status), 11 sample records, and interactive Billing Information document view modal (PO/WO, MRIR, Challan, Items, Totals, In Words, Comments, and 4-tier signature block).",
    "descriptionBn": "Billing à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦¨à¦¤à§�à¦¨ 'VAT and Tax Register' à¦•à¦®à¦ªà§�à¦²à¦¾à§Ÿà§‡à¦¨à§�à¦¸ à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ Date From/To, Bill No, Purchase Order No, VAT & Tax Posting Status (All, Post, Un-Post) à¦°à§‡à¦¡à¦¿à¦“ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦°, Supplier Name à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, Excel/Print/PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ, à¦¸à¦ à¦¿à¦• à¦Ÿà§‡à¦¬à¦¿à¦² à¦•à¦²à¦¾à¦®à¦¸à¦®à§‚à¦¹, à§§à§§à¦Ÿà¦¿ à¦°à¦¿à§Ÿà§‡à¦² à¦¡à§‡à¦Ÿà¦¾ à¦°à§‡à¦•à¦°à§�à¦¡ à¦�à¦¬à¦‚ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² Billing Information à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦² (PO/WO, MRIR, Challan, à¦†à¦‡à¦Ÿà§‡à¦®à¦¸, à¦Ÿà§‹à¦Ÿà¦¾à¦², à¦‡à¦¨ à¦“à§Ÿà¦¾à¦°à§�à¦¡à¦¸, à¦•à¦®à§‡à¦¨à§�à¦Ÿ à¦�à¦¬à¦‚ à§ª-à¦¸à§�à¦¤à¦° à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦¬à§�à¦²à¦•) à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "423",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-billing-purchase-list",
    "descriptionEn": "Created the new 'Purchase List' registry page under Billing module featuring Date From/To, Location dropdown, Document search, Product Name query filters, Excel/Print/PDF export actions, exact table columns (View, Bill No, Bill Date, Supplier, Type, Currency, Rate), populated with 21+ purchase records, and interactive Bill Details Document View modal (#, Product, Unit, Quantity, Rate, Total, DC Price, LandedCost, Total Amt, Vat Amt, Tax Amt, Other Amt, Net Total, Discount, G.Total).",
    "descriptionBn": "Billing à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦¨à¦¤à§�à¦¨ 'Purchase List' à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ Date From/To, Location, Document à¦¸à¦¾à¦°à§�à¦š, Product Name à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, Excel/Print/PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦�à¦•à¦¶à¦¨, à¦¹à§�à¦¬à¦¹à§� à¦Ÿà§‡à¦¬à¦¿à¦² à¦•à¦²à¦¾à¦® (View, Bill No, Bill Date, Supplier, Type, Currency, Rate), à§¨à§§+ à¦Ÿà¦¿ à¦ªà¦¾à¦°à¦šà§‡à¦œ à¦¡à§‡à¦Ÿà¦¾ à¦°à§‡à¦•à¦°à§�à¦¡ à¦�à¦¬à¦‚ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² à¦¬à¦¿à¦² à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦² (#, Product, Unit, Quantity, Rate, Total, DC Price, LandedCost, Total Amt, Vat, Tax, Net Total, Discount, G.Total) à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "422",
    "date": "2026-09-14T10:30",
    "type": "UI Enhancement",
    "module": "Procurement Module",
    "link": "/procurement-pi-list",
    "descriptionEn": "Redesigned the Proforma Invoice (PI) View modal to mirror the official Pakiza Knit Composite Ltd format with green company logo header, cyan document title, two-column metadata grid (PI No, LC No, Supplier, Shipment Terms, PI Validity, Currency, Port of Discharge/Loading, PI Date, LC Date, Shipment Date, PI Type, Product Type), detailed itemized grid (#, ReqNums, ProductName, OriginName, Description, Quantity, Rate, Total), Remarks section, and financial total breakdown (Total, Upcharge, Discount, Net Total) with 3-tier signature block.",
    "descriptionBn": "Proforma Invoice (PI) à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² Pakiza Knit Composite Ltd à¦«à¦°à¦®à§�à¦¯à¦¾à¦Ÿà§‡ à¦†à¦ªà¦—à§�à¦°à§‡à¦¡ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦¸à¦¬à§�à¦œ à¦²à§‹à¦—à§‹ à¦¹à§‡à¦¡à¦¾à¦°, à¦¸à¦¾à¦‡à§Ÿà¦¾à¦¨ à¦¡à¦• à¦Ÿà¦¾à¦‡à¦Ÿà§‡à¦², à§¨-à¦•à¦²à¦¾à¦® à¦®à§‡à¦Ÿà¦¾à¦¡à§‡à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡, à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦†à¦‡à¦Ÿà§‡à¦® à¦—à§�à¦°à¦¿à¦¡ (#, ReqNums, ProductName, OriginName, Description, Quantity, Rate, Total), à¦°à¦¿à¦®à¦¾à¦°à§�à¦•à¦¸ à¦¸à§‡à¦•à¦¶à¦¨ à¦�à¦¬à¦‚ à¦¹à¦¿à¦¸à¦¾à¦¬à§‡à¦° à¦¸à¦¾à¦®à¦¾à¦°à¦¿ (Total, Upcharge, Discount, Net Total) à¦¸à¦¹ à§©-à¦¸à§�à¦¤à¦° à¦¬à¦¿à¦¶à¦¿à¦·à§�à¦Ÿ à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦¬à§�à¦²à¦• à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "421",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-pi-list",
    "descriptionEn": "Built the executive 'PI List (Proforma Invoice)' registry page featuring PI Date range filters, Supplier Name dropdown, PI Number search, Excel/Print/PDF exports, and exact table columns (#, PINo, PIDate, LcNo, LcDate, ShipmentDate, Supplier, ProductType, Status) with interactive Proforma Invoice document viewer modal.",
    "descriptionBn": "à¦�à¦•à§�à¦¸à¦¿à¦•à¦¿à¦‰à¦Ÿà¦¿à¦­ 'PI List (Proforma Invoice)' à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ PI à¦¡à§‡à¦Ÿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, à¦¸à¦¾à¦ªà§�à¦²à¦¾à¦‡à§Ÿà¦¾à¦° à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, PI à¦¨à¦®à§�à¦¬à¦° à¦¸à¦¾à¦°à§�à¦š, Excel/Print/PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦�à¦¬à¦‚ à¦¹à§�à¦¬à¦¹à§� à¦Ÿà§‡à¦¬à¦¿à¦² à¦•à¦²à¦¾à¦®à¦¸à¦®à§‚à¦¹ (#, PINo, PIDate, LcNo, LcDate, ShipmentDate, Supplier, ProductType, Status) à¦¸à¦¹ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² PI à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦² à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "420",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-po-list",
    "descriptionEn": "Built the executive 'Purchase Order List' registry page with date range filters, status selector (Saved, Review Pending, Approved, Rejected), payment mode filter, exact table schema (SL, PO No, PO Date, Delivery To, Bill To, Type, Currency, Prepared By, Total Amount, ItemType, Status, Req.No, Payment Type), Excel/Print/PDF export options, and interactive document viewer modal.",
    "descriptionBn": "à¦�à¦•à§�à¦¸à¦¿à¦•à¦¿à¦‰à¦Ÿà¦¿à¦­ 'Purchase Order List' à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦¡à§‡à¦Ÿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° (Saved, Review Pending, Approved, Rejected), à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦®à§‹à¦¡ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, à¦¸à¦ à¦¿à¦• à¦Ÿà§‡à¦¬à¦¿à¦² à¦•à¦²à¦¾à¦®à¦¸à¦®à§‚à¦¹, Excel/Print/PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦�à¦¬à¦‚ à¦…à¦«à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² PO à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰à§Ÿà¦¾à¦° à¦®à§‹à¦¡à¦¾à¦² à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "419",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-po-new",
    "descriptionEn": "Updated the Create Purchase Order page to pull Terms & Conditions from system configuration. Added template preset selector, live clause search, interactive checklist, and custom term addition.",
    "descriptionBn": "Create Purchase Order à¦ªà§‡à¦œà§‡ Terms & Conditions à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦¥à§‡à¦•à§‡ à¦²à§‹à¦¡ à¦•à¦°à¦¾à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦°, à¦²à¦¾à¦‡à¦­ à¦¸à¦¾à¦°à§�à¦š, à¦šà§‡à¦•à¦¬à¦¾à¦•à§�à¦¸ à¦²à¦¿à¦¸à§�à¦Ÿ à¦�à¦¬à¦‚ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦•à§�à¦²à¦œ à¦�à¦¡ à¦•à¦°à¦¾à¦° à¦…à¦ªà¦¶à¦¨ à¦°à¦¾à¦–à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "418",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-po-new",
    "descriptionEn": "Created the new 'Create Purchase Order' page featuring PO Details headers (Type, ItemType, Bill To, Delivery To, Addresses, Currency Rate, Job Description), PO Item Details adder console, editable Terms & Conditions, and financial summary calculation block (Total, Discount, VAT, TAX, Grand Total, Advance, Balance).",
    "descriptionBn": "à¦¨à¦¤à§�à¦¨ 'Create Purchase Order' à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ PO à¦¹à§‡à¦¡à¦¾à¦° à¦¤à¦¥à§�à¦¯ (Type, ItemType, Bill To, Delivery To, à¦ à¦¿à¦•à¦¾à¦¨à¦¾, à¦¬à¦¿à¦¨à¦¿à¦®à§Ÿ à¦¹à¦¾à¦°, à¦œà¦¬ à¦¡à¦¿à¦¸à¦•à§�à¦°à¦¿à¦ªà¦¶à¦¨), à¦†à¦‡à¦Ÿà§‡à¦® à¦�à¦¡à¦¾à¦° à¦•à¦¨à¦¸à§‹à¦², à¦•à¦¾à¦¸à§�à¦Ÿà¦®à¦¾à¦‡à¦œà¦¡ Terms & Conditions à¦�à¦¬à¦‚ à¦«à¦¿à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¸à¦¿à§Ÿà¦¾à¦² à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦Ÿà¦° (à¦Ÿà§‹à¦Ÿà¦¾à¦², à¦¡à¦¿à¦¸à¦•à¦¾à¦‰à¦¨à§�à¦Ÿ, à¦­à§�à¦¯à¦¾à¦Ÿ, à¦Ÿà§�à¦¯à¦¾à¦•à§�à¦¸, à¦—à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦Ÿà§‹à¦Ÿà¦¾à¦², à¦�à¦¡à¦­à¦¾à¦¨à§�à¦¸, à¦¬à§�à¦¯à¦¾à¦²à§‡à¦¨à§�à¦¸) à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "417",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Procurement Module",
    "link": "/procurement-po-requisition-wise",
    "descriptionEn": "Cleaned up UI layout on the Requisition Wise PO page by removing redundant section description paragraphs and helper subtitles for a minimal, uncluttered view.",
    "descriptionBn": "Requisition Wise PO à¦ªà§‡à¦œà§‡à¦° à¦¸à§‡à¦•à¦¶à¦¨à¦—à§�à¦²à§‹à¦° à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ à¦¬à¦°à§�à¦£à¦¨à¦¾ à¦“ à¦¸à¦¾à¦¬à¦Ÿà¦¾à¦‡à¦Ÿà§‡à¦² à¦²à§‡à¦–à¦¾à¦—à§�à¦²à§‹ à¦¤à§�à¦²à§‡ à¦¦à¦¿à§Ÿà§‡ à¦²à§‡à¦†à¦‰à¦Ÿà¦Ÿà¦¿ à¦†à¦°à¦“ à¦•à§�à¦²à¦¿à¦¨ à¦“ à¦®à¦¿à¦¨à¦¿à¦®à¦¾à¦² à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "416",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-po-requisition-wise",
    "descriptionEn": "Added an interactive Requisition Selection Modal triggered by a '+ Select / Browse Requisitions' button. Allows users to search, review estimated totals, batch select multiple requisitions, and proceed seamlessly.",
    "descriptionBn": "Requisition Wise PO à¦ªà§‡à¦œà§‡ '+ Select / Browse Requisitions' à¦¬à¦¾à¦Ÿà¦¨ à¦�à¦¬à¦‚ à¦�à¦•à¦Ÿà¦¿ à¦ªà¦ª-à¦†à¦ª à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦¸à¦¾à¦°à§�à¦š à¦•à¦°à§‡, à¦†à¦¨à§�à¦®à¦¾à¦¨à¦¿à¦• à¦®à§‚à¦²à§�à¦¯ à¦“ à¦†à¦‡à¦Ÿà§‡à¦® à¦¦à§‡à¦–à§‡ à¦¸à¦¹à¦œà§‡à¦‡ à¦�à¦•à¦¾à¦§à¦¿à¦• à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à§‡ à¦ªà§�à¦°à¦¸à§‡à¦¸ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "415",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-po-requisition-wise",
    "descriptionEn": "Streamlined the Requisition Wise PO page by removing the redundant intermediate staged items table and introducing multi-requisition badge selection. Items from selected requisitions now automatically merge into a single unified workspace table.",
    "descriptionBn": "Requisition Wise PO à¦ªà§‡à¦œà¦Ÿà¦¿ à¦†à¦°à¦“ à¦¸à¦¹à¦œ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ à¦¸à§�à¦Ÿà§‡à¦œà¦¡ à¦†à¦‡à¦Ÿà§‡à¦® à¦²à¦¿à¦¸à§�à¦Ÿ à¦¬à¦¾à¦¦ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦�à¦•à¦¸à¦¾à¦¥à§‡ à¦�à¦•à¦¾à¦§à¦¿à¦• à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¾à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¨à¦¿à¦°à§�à¦¬à¦¾à¦šà¦¿à¦¤ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨à§‡à¦° à¦†à¦‡à¦Ÿà§‡à¦®à¦—à§�à¦²à§‹ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦�à¦•à¦Ÿà¦¿ à¦¸à¦¿à¦™à§�à¦—à§‡à¦² à¦“à§Ÿà¦¾à¦°à§�à¦•à¦¸à§�à¦ªà§‡à¦¸ à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ à¦•à¦®à§�à¦¬à¦¾à¦‡à¦¨ à¦¹à§Ÿà§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "414",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-po-requisition-wise",
    "descriptionEn": "Created the executive Requisition Wise Purchase Order (PO) generator page with PO general headers, requisition item staging console, smart Terms & Conditions template selector from configuration, real-time financial calculations, and local storage integration.",
    "descriptionBn": "Requisition Wise Purchase Order (PO) à¦¤à§ˆà¦°à¦¿à¦° à¦¨à¦¤à§�à¦¨ à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ PO à¦¹à§‡à¦¡à¦¾à¦°, à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦†à¦‡à¦Ÿà§‡à¦® à¦²à§‹à¦¡à¦¾à¦°, à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦¥à§‡à¦•à§‡ à¦¸à§�à¦®à¦¾à¦°à§�à¦Ÿ Terms & Conditions à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦°, à¦²à¦¾à¦‡à¦­ à¦¹à¦¿à¦¸à¦¾à¦¬-à¦¨à¦¿à¦•à¦¾à¦¶ à¦�à¦¬à¦‚ à¦¸à§‡à¦­ à¦…à¦ªà¦¶à¦¨ à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "413",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-config-currency-rate",
    "descriptionEn": "Updated Procurement Configuration sub-menu list to strictly include: Currency Rate, Terms and Condition, Bank Info, and Bank Accounts. Removed unused menu items.",
    "descriptionBn": "Procurement Configuration à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° Currency Rate, Terms and Condition, Bank Info à¦�à¦¬à¦‚ Bank Accounts à¦¥à¦¾à¦•à§‡à¥¤ à¦¬à¦¾à¦•à¦¿ à¦…à¦ªà§�à¦°à§Ÿà§‹à¦œà¦¨à§€à§Ÿ à¦®à§‡à¦¨à§�à¦—à§�à¦²à§‹ à¦¤à§�à¦²à§‡ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "412",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-cs-create-workorder",
    "descriptionEn": "Simplified the Forward Purchase Order modal by removing unnecessary contact and remarks input boxes, and added an interactive live search bar to filter Terms & Conditions.",
    "descriptionBn": "Forward Purchase Order à¦®à§‹à¦¡à¦¾à¦² à¦¥à§‡à¦•à§‡ à¦…à¦ªà§�à¦°à§Ÿà§‹à¦œà¦¨à§€à§Ÿ à¦•à¦¨à§�à¦Ÿà¦¾à¦•à§�à¦Ÿ à¦“ à¦°à¦¿à¦®à¦¾à¦°à§�à¦•à¦¸ à¦¬à¦•à§�à¦¸ à¦¤à§�à¦²à§‡ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ Terms & Conditions à¦¸à¦¹à¦œà§‡ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦�à¦•à¦Ÿà¦¿ à¦²à¦¾à¦‡à¦­ à¦¸à¦¾à¦°à§�à¦š à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "411",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Procurement Module",
    "link": "/procurement-cs-create-workorder",
    "descriptionEn": "Redesigned the 'Forward Purchase Order' modal into an ultra-clean, minimalist, spacious layout (max-w-4xl). Removed heavy yellow alert containers and bright borders in favor of clean typography, neutral borders, and smooth spacing.",
    "descriptionBn": "'Forward Purchase Order' à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿ à¦†à¦°à¦“ à¦¬à§œ (max-w-4xl), à¦…à¦¤à¦¿ à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦° à¦“ à¦ªà¦°à¦¿à¦šà§�à¦›à¦¨à§�à¦¨ à¦®à¦¿à¦¨à¦¿à¦®à¦¾à¦²à¦¿à¦¸à§�à¦Ÿ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦­à¦¾à¦°à§€ à¦¹à¦²à§�à¦¦ à¦¬à¦•à§�à¦¸ à¦“ à¦‰à¦œà§�à¦œà§�à¦¬à¦² à¦•à¦¾à¦²à¦¾à¦° à¦¬à¦¾à¦¦ à¦¦à¦¿à§Ÿà§‡ à¦•à§�à¦²à¦¿à¦¨ à¦¹à§‡à¦¡à¦¾à¦°, à¦¨à¦¿à¦‰à¦Ÿà§�à¦°à¦¾à¦² à¦¬à¦°à§�à¦¡à¦¾à¦° à¦“ à¦ªà¦°à§�à¦¯à¦¾à¦ªà§�à¦¤ à¦¸à§�à¦ªà§‡à¦¸à¦¿à¦‚ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "410",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-cs-create-workorder",
    "descriptionEn": "Implemented Purchase Order (PO) Draft status workflow with a dedicated 'Forward Purchase Order' modal. Enables interactive selection, custom term addition, and processing of Terms & Conditions before forwarding POs to vendors and approval channels.",
    "descriptionBn": "Purchase Order (PO) à¦²à¦¿à¦¸à§�à¦Ÿà§‡ à¦¡à§�à¦°à¦¾à¦«à¦Ÿ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦�à¦¬à¦‚ 'Forward Purchase Order' à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦«à¦°à¦“à§Ÿà¦¾à¦°à§�à¦¡ à¦•à¦°à¦¾à¦° à¦†à¦—à§‡ à¦ªà§�à¦°à§Ÿà§‹à¦œà¦¨à§€à§Ÿ Terms & Conditions à¦¨à¦¿à¦°à§�à¦¬à¦¾à¦šà¦¨ à¦“ à¦•à¦¾à¦¸à§�à¦Ÿà¦®à¦¾à¦‡à¦œ à¦•à¦°à§‡ à¦ªà§�à¦°à¦¸à§‡à¦¸ à¦•à¦°à¦¾à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "409",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-cs-create-workorder",
    "descriptionEn": "Renamed 'CS Workorder List' sub-menu to 'CS PO List' and redesigned the Purchase Order console with an official executive Purchase Order (PO) document view modal featuring company headers, supplier/delivery details, watermark overlays, itemized quotation tables, financial summary blocks, terms & conditions, and printable layout.",
    "descriptionBn": "'CS Workorder List' à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§�à¦° à¦¨à¦¾à¦® à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ 'CS PO List' à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦…à¦«à¦¿à¦¶à¦¿à¦¯à¦¼à¦¾à¦² Purchase Order (PO) à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿ à¦¹à§‡à¦¡à¦¾à¦°, à¦¸à¦¾à¦ªà§�à¦²à¦¾à¦‡à§Ÿà¦¾à¦° à¦“ à¦¡à§‡à¦²à¦¿à¦­à¦¾à¦°à¦¿ à¦¤à¦¥à§�à¦¯, à¦“à§Ÿà¦¾à¦Ÿà¦¾à¦°à¦®à¦¾à¦°à§�à¦•, à¦†à¦‡à¦Ÿà§‡à¦® à¦Ÿà§‡à¦¬à¦¿à¦², à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦“ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦…à¦ªà¦¶à¦¨ à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "408",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation Module",
    "link": "/separation-clearance-configuration",
    "descriptionEn": "Updated Clearance Configuration to feature HTML5 drag-and-drop layer reordering, a single top 'Add Layer' button, color-matched UI theme, and dual approver assignment modes (Default Role vs Searchable Specific Person). Removed unnecessary top sub-header tabs.",
    "descriptionBn": "Clearance Configuration-à¦� à¦¡à§�à¦°à§�à¦¯à¦¾à¦— à¦�à¦¨à§�à¦¡ à¦¡à§�à¦°à¦ª à¦¦à¦¿à§Ÿà§‡ à¦²à§‡à§Ÿà¦¾à¦°à§‡à¦° à¦¸à¦¿à¦°à¦¿à§Ÿà¦¾à¦² à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨à§‡à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾, à¦�à¦•à¦Ÿà¦¿ à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ 'Add Layer' à¦¬à¦¾à¦Ÿà¦¨, à¦¬à§�à¦²à§� à¦¥à¦¿à¦® à¦®à§�à¦¯à¦¾à¦šà¦¿à¦‚ à¦�à¦¬à¦‚ Default Role à¦¬à¦¾ Searchable Person à¦…à§�à¦¯à¦¾à¦¸à¦¾à¦‡à¦¨ à¦•à¦°à¦¾à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ à¦¹à§‡à¦¡à¦¾à¦° à¦Ÿà§�à¦¯à¦¾à¦¬ à¦¤à§�à¦²à§‡ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "407",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation Module",
    "link": "/separation-clearance-configuration",
    "descriptionEn": "Refined Clearance Configuration into a clean table-based grid layout with columns for Layer Name, Assigned Approver Person, Remarks, and actions, integrated as a dedicated sub-menu under Separation in the sidebar.",
    "descriptionBn": "Clearance Configuration à¦ªà§‡à¦œà¦Ÿà¦¿ à¦�à¦•à¦Ÿà¦¿ à¦•à§�à¦²à¦¿à¦¨ à¦Ÿà§‡à¦¬à¦¿à¦² à¦—à§�à¦°à¦¿à¦¡à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦° à¦•à¦²à¦¾à¦®à§‡ à¦°à§Ÿà§‡à¦›à§‡ Layer Name, Assigned Approver Person à¦�à¦¬à¦‚ Remarks, à¦�à¦¬à¦‚ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡ Separation-à¦�à¦° à¦…à¦§à§€à¦¨à§‡ à¦�à¦•à¦Ÿà¦¿ à¦†à¦²à¦¾à¦¦à¦¾ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¹à¦¿à¦¸à§‡à¦¬à§‡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "406",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Separation Module",
    "link": "/separation-clearance-configuration",
    "descriptionEn": "Created Separation Clearance Configuration page (/separation-clearance-configuration) allowing dynamic multi-layer workflow creation ('Add More Layer' option), stage reordering, checklist item management, and searchable approver person selection for each layer.",
    "descriptionBn": "Separation Module-à¦� à¦¨à¦¤à§�à¦¨ Clearance Configuration à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦‡à¦šà§�à¦›à¦¾à¦®à¦¤à§‹ à¦²à§‡à§Ÿà¦¾à¦° à¦¤à§ˆà¦°à¦¿ (Add More Option), à¦¸à¦¿à¦•à§�à§Ÿà§‡à¦¨à§�à¦¸ à¦ªà§�à¦¨à¦ƒà¦¬à¦¿à¦¨à§�à¦¯à¦¾à¦¸, à¦šà§‡à¦•à¦²à¦¿à¦¸à§�à¦Ÿ à¦†à¦‡à¦Ÿà§‡à¦® à¦¯à§�à¦•à§�à¦¤à¦•à¦°à¦£ à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¤à¦¿ à¦²à§‡à§Ÿà¦¾à¦°à§‡ à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ à¦…à¦¨à§�à¦®à§‹à¦¦à¦¨à¦•à¦¾à¦°à§€ à¦¬à§�à¦¯à¦•à§�à¦¤à¦¿ (Approver Person) à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¾ à¦¯à¦¾à§Ÿà¥¤"
  },
  {
    "id": "405",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-cs-batch-list",
    "descriptionEn": "Enhanced Create CS Wizard with searchable multi-select requisitions in Step 1 (auto-combining items) and searchable candidate vendor selection in Step 2.",
    "descriptionBn": "Create CS Wizard-à¦�à¦° Step 1-à¦� à¦¸à¦¾à¦°à§�à¦š à¦…à¦ªà¦¶à¦¨ à¦¸à¦¹ à¦�à¦•à¦¾à¦§à¦¿à¦• à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ (à¦†à¦‡à¦Ÿà§‡à¦® à¦•à¦®à§�à¦¬à¦¾à¦‡à¦¨) à¦�à¦¬à¦‚ Step 2-à¦� à¦¸à¦¾à¦°à§�à¦š à¦…à¦ªà¦¶à¦¨ à¦¸à¦¹ à¦­à§‡à¦¨à§�à¦¡à¦° à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¾à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "404",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Procurement Module",
    "link": "/procurement-cs-detail?id=CS-2026-YRN4",
    "descriptionEn": "Added an 'Are you sure?' confirmation modal with a vendor PO breakdown summary when clicking the Finalize CS button.",
    "descriptionBn": "Finalize CS à¦¬à¦¾à¦Ÿà¦¨à§‡ à¦•à§�à¦²à¦¿à¦• à¦•à¦°à¦²à§‡ à¦­à§‡à¦¨à§�à¦¡à¦° à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• PO à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦¸à¦¹ à¦�à¦•à¦Ÿà¦¿ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² 'Are you sure?' à¦•à¦¨à¦«à¦¾à¦°à§�à¦®à§‡à¦¶à¦¨ à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "403",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-cs-detail?id=CS-2026-YRN4",
    "descriptionEn": "Created dedicated full-page CS Detail route (/procurement-cs-detail) with sticky item columns, horizontal vendor scrolling, clean cell color highlighting, fully visible vendor names, and searchable vendor selectors.",
    "descriptionBn": "à¦¨à§‚à¦¤à¦¨ à¦¡à§‡à¦¡à¦¿à¦•à§‡à¦Ÿà§‡à¦¡ à¦«à§�à¦²-à¦ªà§‡à¦œ CS Detail à¦ªà§‡à¦œ (/procurement-cs-detail) à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦†à¦‡à¦Ÿà§‡à¦® à¦•à¦²à¦¾à¦® à¦¸à§�à¦Ÿà¦¿à¦•à¦¿ à¦«à¦¿à¦•à§�à¦¸à¦¡ à¦¥à¦¾à¦•à§‡, à¦­à§‡à¦¨à§�à¦¡à¦° à¦•à¦²à¦¾à¦® à¦¸à¦¾à¦‡à¦¡à§‡ à¦¸à§�à¦•à§�à¦°à§‹à¦² à¦¹à§Ÿ, à¦•à¦® à¦¦à¦¾à¦®à§‡à¦° à¦¸à§‡à¦² à¦¡à¦¿à¦°à§‡à¦•à§�à¦Ÿ à¦•à¦¾à¦²à¦¾à¦° à¦¹à¦¾à¦‡à¦²à¦¾à¦‡à¦Ÿ à¦¹à§Ÿ à¦�à¦¬à¦‚ à¦­à§‡à¦¨à§�à¦¡à¦° à¦¨à§‡à¦® à¦¸à¦¾à¦°à§�à¦šà§‡à¦¬à¦² à¦¥à¦¾à¦•à§‡à¥¤"
  },
  {
    "id": "402",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Procurement Module",
    "link": "/procurement-cs-batch-list",
    "descriptionEn": "Redesigned the CS Comparison Matrix into an ultra-compact, high-density Excel-style grid layout with tight cell padding, inline lowest price chips, and slim header bars.",
    "descriptionBn": "CS Comparison Matrix-à¦•à§‡ à¦�à¦•à§�à¦¸à§‡à¦² à¦¶à¦¿à¦Ÿ à¦—à§�à¦°à¦¿à¦¡à§‡à¦° à¦®à¦¤à§‹ à¦…à¦¤à§�à¦¯à¦¨à§�à¦¤ à¦•à¦®à§�à¦ªà§�à¦¯à¦¾à¦•à§�à¦Ÿ à¦“ à¦Ÿà¦¾à¦‡à¦Ÿ à¦ªà§�à¦¯à¦¾à¦¡à¦¿à¦‚ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦�à¦• à¦¨à¦œà¦°à§‡ à¦…à¦¨à§‡à¦•à¦—à§�à¦²à§‹ à¦†à¦‡à¦Ÿà§‡à¦®à§‡à¦° à¦¡à¦¾à¦Ÿà¦¾ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à§Ÿà¥¤"
  },
  {
    "id": "401",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Procurement Module",
    "link": "/procurement-cs-batch-list",
    "descriptionEn": "Replaced text buttons in the CS table Actions column with sleek single icon buttons to prevent text wrapping and fix row height expansion.",
    "descriptionBn": "CS à¦Ÿà§‡à¦¬à¦¿à¦²à§‡à¦° Actions à¦•à¦²à¦¾à¦®à§‡à¦° à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨ à¦¤à§�à¦²à§‡ à¦�à¦•à¦Ÿà¦¿ à¦•à§�à¦²à¦¿à¦¨ à¦†à¦‡à¦•à¦¨ à¦¬à¦¾à¦Ÿà¦¨ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦­à§‡à¦™à§‡ à¦¨à¦¾ à¦¯à¦¾à§Ÿ à¦�à¦¬à¦‚ à¦°à§‹ à¦¹à¦¾à¦‡à¦Ÿ à¦ à¦¿à¦• à¦¥à¦¾à¦•à§‡à¥¤"
  },
  {
    "id": "400",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Procurement Module",
    "link": "/procurement-cs-batch-list",
    "descriptionEn": "Polished the Comparison Sheet Matrix & Wizard UI into an executive clean view, incorporating 15+ real-world procurement items, sticky matrix headers, sleek green highlight pills, and refined vendor select controls.",
    "descriptionBn": "Comparison Sheet Matrix à¦“ Wizard-à¦�à¦° à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦†à¦§à§�à¦¨à¦¿à¦• à¦“ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦°à§Ÿà§‡à¦›à§‡ à§§à§«+ à¦†à¦‡à¦Ÿà§‡à¦® à¦Ÿà§‡à¦¸à§�à¦Ÿ à¦¡à§‡à¦Ÿà¦¾à¦¸à§‡à¦Ÿ, à¦¸à§�à¦Ÿà¦¿à¦•à¦¿ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¹à§‡à¦¡à¦¾à¦°, à¦—à§�à¦°à¦¿à¦¨ à¦¹à¦¾à¦‡à¦²à¦¾à¦‡à¦Ÿ à¦ªà¦¿à¦² à¦�à¦¬à¦‚ à¦­à§‡à¦¨à§�à¦¡à¦° à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦¨à§�à¦Ÿà§�à¦°à§‹à¦²à¥¤"
  },
  {
    "id": "399",
    "date": "2026-09-14T10:30",
    "type": "Business Logic",
    "module": "Procurement Module",
    "link": "/procurement-cs-batch-list",
    "descriptionEn": "Implemented full CS Creation Wizard (Requisition auto item loading & side-by-side vendor quotes) and Comparison Matrix with green lowest-price highlights, item-wise vendor selectors, and auto PO generation.",
    "descriptionBn": "à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ CS à¦¤à§ˆà¦°à¦¿ Wizard (à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦†à¦‡à¦Ÿà§‡à¦® à¦…à¦Ÿà§‹-à¦²à§‹à¦¡ à¦“ à¦¸à¦¾à¦‡à¦¡-à¦¬à¦¾à¦‡-à¦¸à¦¾à¦‡à¦¡ à¦­à§‡à¦¨à§�à¦¡à¦° à¦¦à¦°à¦ªà¦¤à§�à¦°) à¦�à¦¬à¦‚ à¦¸à¦¬à¦šà§‡à§Ÿà§‡ à¦•à¦® à¦¦à¦¾à¦® à¦—à§�à¦°à¦¿à¦¨ à¦¹à¦¾à¦‡à¦²à¦¾à¦‡à¦Ÿ, à¦†à¦‡à¦Ÿà§‡à¦®à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦­à§‡à¦¨à§�à¦¡à¦° à¦¨à¦¿à¦°à§�à¦¬à¦¾à¦šà¦¨ à¦“ à¦…à¦Ÿà§‹ PO à¦œà§‡à¦¨à¦¾à¦°à§‡à¦¶à¦¨ à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "398",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-cs-batch-list",
    "descriptionEn": "Restructured the Comparison Sheet submenus in the Procurement module into two clean sections: 'CS List' (with a top button to create a new CS) and 'CS Workorder List'.",
    "descriptionBn": "à¦ªà§�à¦°à§‹à¦•à¦¿à¦‰à¦°à¦®à§‡à¦¨à§�à¦Ÿ à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° Comparison Sheet à¦¸à¦¾à¦¬à¦®à§‡à¦¨à§� à¦¦à§�à¦Ÿà¦¿ à¦¸à§�à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ à¦…à¦‚à¦¶à§‡ à¦ªà§�à¦¨à¦°à§�à¦—à¦ à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: 'CS List' (à¦¨à¦¤à§�à¦¨ CS à¦¤à§ˆà¦°à¦¿à¦° à¦¬à¦¾à¦Ÿà¦¨ à¦¸à¦¹) à¦�à¦¬à¦‚ 'CS Workorder List'à¥¤"
  },
  {
    "id": "397",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Personnel Info",
    "link": "/employee-doc-issue",
    "descriptionEn": "Replaced the Status pill buttons on the Employee Doc Issue page (/employee-doc-issue) with a sleek filter dropdown containing 'All Issues', 'Pending', and 'Action Taken' options.",
    "descriptionBn": "Employee Doc Issue (/employee-doc-issue) à¦ªà§‡à¦œà§‡à¦° à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦¬à¦¾à¦Ÿà¦¨ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ 'All Issues', 'Pending' à¦�à¦¬à¦‚ 'Action Taken' à¦…à¦ªà¦¶à¦¨ à¦¸à¦®à§�à¦¬à¦²à¦¿à¦¤ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "396",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Personnel Info",
    "link": "/employee-doc-issue",
    "descriptionEn": "Added an 'SL' (Serial) column to the Employee Doc Issue table (/employee-doc-issue) for better row tracking.",
    "descriptionBn": "Employee Doc Issue (/employee-doc-issue) à¦ªà§‡à¦œà§‡à¦° à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ à¦Ÿà§�à¦°à§�à¦¯à¦¾à¦•à¦¿à¦‚ à¦¸à§�à¦¬à¦¿à¦§à¦¾à¦° à¦œà¦¨à§�à¦¯ 'SL' (à¦¸à¦¿à¦°à¦¿à¦¯à¦¼à¦¾à¦²) à¦•à¦²à¦¾à¦® à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "395",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Personnel Info",
    "link": "/employee-doc-issue",
    "descriptionEn": "Kept the Status and Action column texts in one line for the Employee Doc Issue table (/employee-doc-issue) to prevent text wrapping and improve layout readability.",
    "descriptionBn": "Employee Doc Issue (/employee-doc-issue) à¦ªà§‡à¦œà§‡à¦° à¦Ÿà§‡à¦¬à¦¿à¦²à§‡à¦° Status à¦�à¦¬à¦‚ Action à¦•à¦²à¦¾à¦®à§‡à¦° à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿà¦—à§�à¦²à§‹à¦•à§‡ à¦�à¦• à¦²à¦¾à¦‡à¦¨à§‡ à¦°à¦¾à¦–à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦²à§‡à¦†à¦‰à¦Ÿ à¦¸à§�à¦¨à§�à¦¦à¦° à¦¦à§‡à¦–à¦¾à§Ÿ à¦�à¦¬à¦‚ à¦²à¦¾à¦‡à¦¨ à¦­à§‡à¦™à§‡ à¦¨à¦¾ à¦¯à¦¾à§Ÿà¥¤"
  },
  {
    "id": "394",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Personnel Info",
    "link": "/employee-doc-issue",
    "descriptionEn": "Removed top metric summary cards (Total Flagged Issues, Action Required, Pending Verification) from the Employee Doc Issue page (/employee-doc-issue) per user request.",
    "descriptionBn": "à¦‡à¦‰à¦œà¦¾à¦° à¦°à¦¿à¦•à§�à¦¯à¦¼à§‡à¦¸à§�à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ Employee Doc Issue à¦ªà§‡à¦œ (/employee-doc-issue) à¦¥à§‡à¦•à§‡ à¦‰à¦ªà¦°à§‡à¦° à¦®à§‡à¦Ÿà§�à¦°à¦¿à¦• à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦•à¦¾à¦°à§�à¦¡à¦¸à¦®à§‚à¦¹ (Total Flagged Issues, Action Required, Pending Verification) à¦°à¦¿à¦®à§�à¦­ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "393",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Personnel Info",
    "link": "/employee-doc-issue",
    "descriptionEn": "Refined Employee Doc Issue (/employee-doc-issue) table & modal UI: removed card container box from Issue Feedback column to show plain text, updated Document Details column to display clickable document title text opening a detail modal without showing raw filenames, and redesigned the Re-Upload Document Modal to be minimal and professional.",
    "descriptionBn": "Employee Doc Issue (/employee-doc-issue) à¦ªà§‡à¦œà§‡à¦° à¦Ÿà§‡à¦¬à¦¿à¦² à¦“ à¦®à§‹à¦¡à¦¾à¦² à¦°à¦¿à¦«à¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦«à¦¿à¦¡à¦¬à§�à¦¯à¦¾à¦• à¦•à¦²à¦¾à¦® à¦¥à§‡à¦•à§‡ à¦•à¦¾à¦°à§�à¦¡ à¦¬à¦•à§�à¦¸ à¦¤à§�à¦²à§‡ à¦ªà§�à¦²à§‡à¦¨ à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦«à¦¾à¦‡à¦²à¦¨à§‡à¦® à¦¹à¦¾à¦‡à¦¡ à¦•à¦°à§‡ à¦¡à¦•à§�à¦¯à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦•à§�à¦²à¦¿à¦•à§‡à¦¬à¦² à¦²à¦¿à¦‚à¦•à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦°à¦¿-à¦†à¦ªà¦²à§‹à¦¡ à¦®à§‹à¦¡à¦¾à¦² à¦®à¦¿à¦¨à¦¿à¦®à¦¾à¦² à¦“ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "392",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Personnel Info",
    "link": "/employee-doc-issue",
    "descriptionEn": "Updated Employee Doc Issue (/employee-doc-issue) layout: removed image/scan preview components and converted the issue list into a structured, responsive Data Table view with columns for Employee Info, Document Details, HR Feedback, Status, and Upload Actions.",
    "descriptionBn": "Employee Doc Issue (/employee-doc-issue) à¦ªà§‡à¦œà§‡à¦° à¦²à§‡à¦†à¦‰à¦Ÿ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦‡à¦®à§‡à¦œ à¦¸à§�à¦•à§�à¦¯à¦¾à¦¨ à¦ªà§�à¦°à¦¾à¦•à¦¦à¦°à§�à¦¶à¦¨ à¦°à¦¿à¦®à§�à¦­ à¦•à¦°à§‡ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦‡à¦¸à§�à¦¯à§� à¦²à¦¿à¦¸à§�à¦Ÿà¦Ÿà¦¿à¦•à§‡ à¦Ÿà§‡à¦¬à¦¿à¦² à¦­à¦¿à¦‰à¦¤à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "391",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Personnel Info",
    "link": "/employee-doc-issue",
    "descriptionEn": "Added new 'Employee Doc Issue' submenu under Personnel Info in Sidebar & Topbar navigation. Flagged document issues raised in Employee Doc Verification (/employee-doc-verification) are now routed directly here, where employees and HR can review compliance feedback, inspect flagged scans, and re-upload revised documents.",
    "descriptionBn": "Personnel Info à¦®à§‡à¦¨à§�à¦° à¦…à¦§à§€à¦¨à§‡ à¦¨à¦¤à§�à¦¨ 'Employee Doc Issue' à¦¸à¦¾à¦¬à¦®à§‡à¦¨à§� à¦�à¦¬à¦‚ à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ Employee Doc Verification à¦ªà§‡à¦œà§‡ à¦•à§‹à¦¨à§‹ à¦¡à¦•à§�à¦¯à§�à¦®à§‡à¦¨à§�à¦Ÿà§‡ à¦‡à¦¸à§�à¦¯à§� à¦°à§‡à¦‡à¦œ à¦•à¦°à¦¾ à¦¹à¦²à§‡ à¦¤à¦¾ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦�à¦‡ à¦ªà§‡à¦œà§‡ à¦†à¦¸à¦¬à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦‡à¦‰à¦œà¦¾à¦° à¦•à¦¾à¦°à¦£ à¦¦à§‡à¦–à§‡ à¦¸à¦‚à¦¶à§‹à¦§à¦¿à¦¤ à¦¡à¦•à§�à¦¯à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦ªà§�à¦¨à¦°à¦¾à§Ÿ à¦†à¦ªà¦²à§‹à¦¡ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "390",
    "date": "2026-09-14T10:30",
    "type": "UI Navigation",
    "module": "Personnel Info",
    "link": "/disciplinary-lefty",
    "descriptionEn": "Moved 'Lefty' menu item from Disciplinary Action to Personnel Info parent menu in both Sidebar and Topbar navigation.",
    "descriptionBn": "à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦�à¦¬à¦‚ à¦Ÿà¦ªà¦¬à¦¾à¦° à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨à§‡ 'Lefty' à¦®à§‡à¦¨à§�à¦Ÿà¦¿ Disciplinary Action à¦¥à§‡à¦•à§‡ à¦¸à¦°à¦¿à§Ÿà§‡ Personnel Info à¦�à¦° à¦…à¦§à§€à¦¨à§‡ à¦¸à§�à¦¥à¦¾à¦¨à¦¾à¦¨à§�à¦¤à¦°à¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "389",
    "date": "2026-09-14T10:30",
    "type": "UI Navigation",
    "module": "Disciplinary Action",
    "link": "/disciplinary-showcause-notices",
    "descriptionEn": "Reordered Disciplinary Action sub-menu items to sequential workflow order: 1. Show Cause Notices, 2. Warning Letters, 3. Case Files, 4. Lefty.",
    "descriptionBn": "Disciplinary Action à¦®à§‡à¦¨à§�à¦° à¦¸à¦¾à¦¬-à¦†à¦‡à¦Ÿà§‡à¦®à¦—à§�à¦²à§‹ à¦¨à¦¤à§�à¦¨ à¦¸à¦¿à¦•à§‹à¦¯à¦¼à§‡à¦¨à§�à¦¸à§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡: à§§. Show Cause Notices, à§¨. Warning Letters, à§©. Case Files, à¦�à¦¬à¦‚ à§ª. Leftyà¥¤"
  },
  {
    "id": "388",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Disciplinary Action",
    "link": "/disciplinary-lefty",
    "descriptionEn": "Simplified Lefty Management table UI: Employee Info column now shows only Name & ID; stage badges renamed to 'Stage 1', 'Stage 2', 'Stage 3'; and salary mode badge updated to 'Cash'.",
    "descriptionBn": "Lefty Management à¦Ÿà§‡à¦¬à¦¿à¦²à§‡à¦° à¦²à§‡à¦†à¦‰à¦Ÿ à¦¸à¦¹à¦œ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: Employee Info à¦•à¦²à¦¾à¦®à§‡ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° Name à¦“ ID à¦°à¦¾à¦–à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ (à¦…à¦«à¦¿à¦¸à¦¿à§Ÿà¦¾à¦² à¦†à¦‡à¦¡à¦¿ à¦“ à¦ªà¦¦à¦¬à§€ à¦°à¦¿à¦®à§�à¦­ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡); à¦¸à§�à¦Ÿà§‡à¦œ à¦¬à§�à¦¯à¦¾à¦œà¦¸à¦®à§‚à¦¹ à¦•à§‡à¦¬à¦² 'Stage 1', 'Stage 2', 'Stage 3' à¦� à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦®à§‹à¦¡ à¦²à§‡à¦¬à§‡à¦² 'Cash' à¦� à¦°à¦¿à¦¨à§‡à¦® à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "387",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Disciplinary Action",
    "link": "/disciplinary-lefty",
    "descriptionEn": "Cleaned up UI on Lefty Management page (/disciplinary-lefty) by removing top policy guidelines banner per user request.",
    "descriptionBn": "à¦‡à¦‰à¦œà¦¾à¦° à¦°à¦¿à¦•à§�à¦¯à¦¼à§‡à¦¸à§�à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ Lefty Management à¦ªà§‡à¦œ (/disciplinary-lefty) à¦¥à§‡à¦•à§‡ à¦‰à¦ªà¦°à§‡à¦° à¦ªà¦²à¦¿à¦¸à¦¿ à¦¨à¦¿à¦°à§�à¦¦à§‡à¦¶à¦¿à¦•à¦¾ à¦¬à§�à¦¯à¦¾à¦¨à¦¾à¦° à¦°à¦¿à¦®à§�à¦­ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "386",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Disciplinary Action",
    "link": "/disciplinary-lefty",
    "descriptionEn": "Added new 'Lefty' menu under Disciplinary Action (/disciplinary-lefty) to track unauthorized absences. Enforces policy: 10 days absent without notice marks employee as Lefty, generates 1st Notice, and converts salary 100% to Cash; +10 days generates 2nd Notice; +7 days generates Final Discharge Notice.",
    "descriptionBn": "Disciplinary Action à¦�à¦° à¦…à¦§à§€à¦¨à§‡ à¦¨à¦¤à§�à¦¨ 'Lefty' à¦®à§‡à¦¨à§� (/disciplinary-lefty) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦…à¦—à§‹à¦šà¦°à§‡ à§§à§¦ à¦¦à¦¿à¦¨ à¦…à¦¨à§�à¦ªà¦¸à§�à¦¥à¦¿à¦¤ à¦¥à¦¾à¦•à¦²à§‡ à¦•à¦°à§�à¦®à§€ Lefty à¦šà¦¿à¦¹à§�à¦¨à¦¿à¦¤ à¦¹à¦¬à§‡, à§§à¦® à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦ªà¦¤à§�à¦° à¦‡à¦¸à§�à¦¯à§� à¦¹à¦¬à§‡ à¦�à¦¬à¦‚ à¦¬à§‡à¦¤à¦¨ à§§à§¦à§¦% à¦•à§�à¦¯à¦¾à¦¶à§‡ à¦°à§�à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦¹à¦¬à§‡; à¦†à¦°à¦“ à§§à§¦ à¦¦à¦¿à¦¨ à¦ªà¦° à§¨à§Ÿ à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦�à¦¬à¦‚ à¦†à¦°à¦“ à§­ à¦¦à¦¿à¦¨ à¦ªà¦° à¦šà§‚à§œà¦¾à¦¨à§�à¦¤ à¦¬à¦°à¦–à¦¾à¦¸à§�à¦¤à¦ªà¦¤à§�à¦° à¦‡à¦¸à§�à¦¯à§� à¦•à¦°à¦¾à¦° à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦²à¦œà¦¿à¦• à¦“ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "385",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Self-Service (SSP)",
    "link": "/ssp-iou-requisition",
    "descriptionEn": "Built complete modern 'Cash & IOU Requisition Entry' module (/ssp-iou-requisition) matching Pakiza ERP schema (Requisition Master parameters, Requisition Details line items table, custom purpose modal, auto Taka in-words generator) with 'On Behalf Of' employee selection support.",
    "descriptionBn": "Pakiza ERP à¦¸à§�à¦•à¦¿à¦®à¦¾ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦•à§�à¦¯à¦¾à¦¶ à¦“ IOU à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦®à¦¡à¦¿à¦‰à¦² (/ssp-iou-requisition) à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦†à¦§à§�à¦¨à¦¿à¦• à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦…à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¯ à¦¸à¦¹à¦•à¦°à§�à¦®à§€à¦¦à§‡à¦° à¦ªà¦•à§�à¦·à§‡ à¦†à¦¬à§‡à¦¦à¦¨ à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ 'On Behalf Of' à¦…à¦ªà¦¶à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "384",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Payroll",
    "link": "/payroll-bonus-submit",
    "descriptionEn": "Redesigned all 6 Bonus Submit and Check Bonus pages to match Pakiza ERP schema (Join Date, Basic, Gross, Default%, Req%, Bonus Amount, Bank Bonus, Misc. Bonus, Notes, Unit, Line, Account No, Bank Name, EXCEL/PRINT/PDF buttons, and exact ERP layout).",
    "descriptionBn": "Bonus Submit à¦�à¦¬à¦‚ à§«à¦Ÿà¦¿ Check Bonus à¦ªà§‡à¦œà¦¸à¦®à§‚à¦¹à¦•à§‡ Pakiza ERP à¦¸à§�à¦•à¦¿à¦®à¦¾ à¦�à¦¬à¦‚ à¦²à§‡à¦†à¦‰à¦Ÿ (Join Date, Basic, Gross, Default%, Req%, Bonus Amount, Bank Bonus, Misc. Bonus, Notes, Unit, Line, Account No, Bank Name, EXCEL/PRINT/PDF à¦¬à¦¾à¦Ÿà¦¨) à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦ªà§�à¦¨à¦°à§�à¦—à¦ à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "383",
    "date": "2026-09-14T10:30",
    "type": "UI Layout Optimization",
    "module": "Payroll",
    "link": "/payroll-salary-submit",
    "descriptionEn": "Grouped all salary submit and checking menus under a parent 'Salary Submission' sub-menu in Payroll -> Salary Process, featuring Salary Submit, Check Salary, Check Salary Vat/Tax, Check Salary Audit, Check Salary Plant Head, and the new Check Salary Accounts (/payroll-check-salary-accounts).",
    "descriptionBn": "Payroll -> Salary Process à¦�à¦° à¦…à¦§à§€à¦¨à§‡ 'Salary Submission' à¦ªà§�à¦¯à¦¾à¦°à§‡à¦¨à§�à¦Ÿ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¤à§ˆà¦°à¦¿ à¦•à¦°à§‡ Salary Submit, Check Salary, Check Salary Vat/Tax, Check Salary Audit, Check Salary Plant Head à¦�à¦¬à¦‚ à¦¨à¦¤à§�à¦¨ Check Salary Accounts à¦ªà§‡à¦œà¦¸à¦®à§‚à¦¹ à¦¸à¦‚à¦—à¦ à¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "382",
    "date": "2026-09-14T10:30",
    "type": "New Sub-Menus",
    "module": "Payroll",
    "link": "/payroll-check-bonus",
    "descriptionEn": "Created 5 Check Bonus sub-menu pages under Payroll -> Salary Process -> Bonus Submission: Check Bonus (/payroll-check-bonus), Check Bonus Vat/Tax (/payroll-check-bonus-vattax), Check Bonus Audit (/payroll-check-bonus-audit), Check Bonus Plant Head (/payroll-check-bonus-planthead with APPROVE button), and Check Bonus Accounts (/payroll-check-bonus-accounts).",
    "descriptionBn": "Payroll -> Salary Process -> Bonus Submission à¦�à¦° à¦…à¦§à§€à¦¨à§‡ à§«à¦Ÿà¦¿ à¦šà§‡à¦• à¦¬à§‹à¦¨à¦¾à¦¸ à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: Check Bonus, Check Bonus Vat/Tax, Check Bonus Audit, Check Bonus Plant Head (à¦¯à§‡à¦–à¦¾à¦¨à§‡ APPROVE à¦¬à¦¾à¦Ÿà¦¨ à¦¬à¦¿à¦¦à§�à¦¯à¦®à¦¾à¦¨) à¦�à¦¬à¦‚ Check Bonus Accountsà¥¤"
  },
  {
    "id": "381",
    "date": "2026-09-14T10:30",
    "type": "New Sub-Menu",
    "module": "Payroll",
    "link": "/payroll-bonus-submit",
    "descriptionEn": "Added 'Bonus Submission' -> 'Bonus Submit' (/payroll-bonus-submit) under Payroll -> Salary Process for monthly and festival bonus submission with attendance log search and CSV export.",
    "descriptionBn": "Payroll -> Salary Process à¦�à¦° à¦…à¦§à§€à¦¨à§‡ 'Bonus Submission' -> 'Bonus Submit' (/payroll-bonus-submit) à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦«à§‡à¦¸à§�à¦Ÿà¦¿à¦­à§�à¦¯à¦¾à¦² à¦“ à¦®à¦¾à¦¨à§�à¦¥à¦²à¦¿ à¦¬à§‹à¦¨à¦¾à¦¸ à¦¸à¦¾à¦¬à¦®à¦¿à¦Ÿ, à¦°à¦¿à¦­à¦¿à¦‰ à¦�à¦¬à¦‚ à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦•à¦°à¦¾ à¦¸à¦®à§�à¦­à¦¬à¥¤"
  },
  {
    "id": "380",
    "date": "2026-09-14T10:30",
    "type": "New Sub-Menus",
    "module": "Payroll",
    "link": "/payroll-check-salary-vattax",
    "descriptionEn": "Added 3 new Salary Check sub-menus under Payroll -> Salary Process: 'Check Salary Vat/Tax' (/payroll-check-salary-vattax), 'Check Salary Audit' (/payroll-check-salary-audit), and 'Check Salary Plant Head' (/payroll-check-salary-planthead) featuring REVIEW and APPROVE controls.",
    "descriptionBn": "Payroll -> Salary Process à¦�à¦° à¦…à¦§à§€à¦¨à§‡ à§©à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: 'Check Salary Vat/Tax', 'Check Salary Audit' à¦�à¦¬à¦‚ 'Check Salary Plant Head' (à¦¯à§‡à¦–à¦¾à¦¨à§‡ Submit à¦�à¦° à¦¬à¦¦à¦²à§‡ 'APPROVE' à¦¬à¦¾à¦Ÿà¦¨ à¦¸à¦‚à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡)à¥¤"
  },
  {
    "id": "379",
    "date": "2026-09-14T10:30",
    "type": "New Sub-Menu",
    "module": "Payroll",
    "link": "/payroll-check-salary",
    "descriptionEn": "Added 'Check Salary' sub-menu under Payroll -> Salary Process (/payroll-check-salary) featuring dual action buttons ('REVIEW' and 'SUBMIT') for both bulk and row-level salary verification.",
    "descriptionBn": "Payroll -> Salary Process à¦�à¦° à¦…à¦§à§€à¦¨à§‡ 'Check Salary' (/payroll-check-salary) à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡; à¦�à¦¤à§‡ à¦¯à§Œà¦¥à¦­à¦¾à¦¬à§‡ à¦¬à¦¾à¦²à§�à¦• à¦“ à¦‡à¦¨à§�à¦¡à¦¿à¦­à¦¿à¦œà§�à¦¯à¦¼à¦¾à¦² 'REVIEW' à¦�à¦¬à¦‚ 'SUBMIT' à¦¬à¦¾à¦Ÿà¦¨à§‡à¦° à¦¸à¦¾à¦¹à¦¾à¦¯à§�à¦¯à§‡ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¯à¦¾à¦šà¦¾à¦‡ à¦•à¦°à¦¾à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "378",
    "date": "2026-09-14T10:30",
    "type": "UI Layout Optimization",
    "module": "Payroll",
    "link": "/payroll-salary-submit",
    "descriptionEn": "Redesigned Employee Attendance Details popup (/payroll-salary-submit) into a clean, spacious 5XL modal focusing purely on 31-day Date & Punch Log table with high visibility.",
    "descriptionBn": "Salary Submit (/payroll-salary-submit) à¦ªà§‡à¦œà§‡à¦° à¦�à¦Ÿà§‡à¦¨à§�à¦¡à§‡à¦¨à§�à¦¸ à¦ªà¦ªà¦†à¦ªà¦Ÿà¦¿ clutter à¦¸à¦°à¦¿à¦¯à¦¼à§‡ à¦†à¦°à¦“ à¦¬à¦¡à¦¼ à¦“ à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦° à§«XL à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à§©à§§ à¦¦à¦¿à¦¨à§‡à¦° à¦‡à¦¨/à¦†à¦‰à¦Ÿ à¦¸à¦®à§Ÿ à¦“ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦¸à§�à¦ªà¦·à§�à¦Ÿ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "377",
    "date": "2026-09-14T10:30",
    "type": "Feature Enhancement",
    "module": "Payroll",
    "link": "/payroll-salary-submit",
    "descriptionEn": "Added Employee Attendance & Monthly Job Card popup modal to Salary Submit page (/payroll-salary-submit) triggered upon clicking the row search button or searching by Employee ID.",
    "descriptionBn": "Salary Submit (/payroll-salary-submit) à¦ªà§‡à¦œà§‡ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿à¦° à¦¸à¦¾à¦°à§�à¦š à¦¬à¦¾à¦Ÿà¦¨à§‡ à¦¬à¦¾ à¦†à¦‡à¦¡à¦¿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à§‡ à¦•à§�à¦²à¦¿à¦• à¦•à¦°à¦²à§‡ à¦‰à¦•à§�à¦¤ à¦•à¦°à§�à¦®à§€à¦° à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦‰à¦ªà¦¸à§�à¦¥à¦¿à¦¤à¦¿ (Present, Late, Absent, Leave, In/Out time log) à¦¦à§‡à¦–à¦¾à¦¨à§‹à¦° à¦�à¦Ÿà§‡à¦¨à§�à¦¡à§‡à¦¨à§�à¦¸ à¦ªà¦ªà¦†à¦ª à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "376",
    "date": "2026-09-14T10:30",
    "type": "Filter & Export Update",
    "module": "Payroll",
    "link": "/payroll-salary-submit",
    "descriptionEn": "Added Status filter ('ALL', 'Submitted Only', 'Not Submitted (Draft)') to Salary Submit page (/payroll-salary-submit) along with dynamic CSV file export functionality for filtered salary records.",
    "descriptionBn": "Salary Submit (/payroll-salary-submit) à¦ªà§‡à¦œà§‡ 'Status' à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° ('ALL', 'Submitted Only', 'Not Submitted (Draft)') à¦�à¦¬à¦‚ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à¦•à§ƒà¦¤ à¦¡à¦¾à¦Ÿà¦¾ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ CSV à¦«à¦°à¦®à§‡à¦Ÿà§‡ à¦«à¦¾à¦‡à¦² à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¬à¦¾ à¦¡à¦¾à¦‰à¦¨à¦²à§‹à¦¡ à¦•à¦°à¦¾à¦° à¦«à¦¿à¦šà¦¾à¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "375",
    "date": "2026-09-14T10:30",
    "type": "UI Refinement",
    "module": "Payroll",
    "link": "/payroll-salary-submit",
    "descriptionEn": "Refined Salary Submit page (/payroll-salary-submit) to use clean, high-density enterprise grid borders, compact form controls, and crisp non-rounded table cards for an executive HR layout.",
    "descriptionBn": "Salary Submit (/payroll-salary-submit) à¦ªà§‡à¦œà§‡à¦° à¦—à§‹à¦² à¦“ à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ à¦°à¦¾à¦‰à¦¨à§�à¦¡à§‡à¦¡ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ à¦‰à¦šà§�à¦š-à¦˜à¦¨à¦¤à§�à¦¬à§‡à¦° à¦�à¦¨à§�à¦Ÿà¦¾à¦°à¦ªà§�à¦°à¦¾à¦‡à¦œ à¦¬à¦°à§�à¦¡à¦¾à¦°, à¦¨à¦¿à¦–à§�à¦�à¦¤ à¦Ÿà§‡à¦¬à¦¿à¦² à¦—à§�à¦°à¦¿à¦¡ à¦�à¦¬à¦‚ à¦¸à¦¾à¦°à§�à¦ª à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à¦•à¦¨à§�à¦Ÿà§�à¦°à§‹à¦² à¦¦à¦¿à§Ÿà§‡ à¦¨à¦¤à§�à¦¨à¦­à¦¾à¦¬à§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "374",
    "date": "2026-09-14T10:30",
    "type": "New Sub-Menu",
    "module": "Payroll",
    "link": "/payroll-salary-submit",
    "descriptionEn": "Added 'Salary Submit' sub-menu under Payroll -> Salary Process (/payroll-salary-submit) featuring monthly salary data loading (Year, Month, Employee Type, Department filters), employee feedback & review comments, and bulk salary submission & export functionality.",
    "descriptionBn": "Payroll -> Salary Process à¦®à§‡à¦¨à§�à¦° à¦…à¦§à§€à¦¨à§‡ 'Salary Submit' (/payroll-salary-submit) à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡; à¦�à¦¤à§‡ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à§‡ à¦¡à¦¾à¦Ÿà¦¾ à¦²à§‹à¦¡ à¦•à¦°à¦¾, à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦«à¦¿à¦¡à¦¬à§�à¦¯à¦¾à¦• à¦“ à¦°à¦¿à¦­à¦¿à¦‰ à¦•à¦®à§‡à¦¨à§�à¦Ÿ à¦¸à¦®à§�à¦ªà¦¾à¦¦à¦¨, à¦�à¦¬à¦‚ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à§‡ à¦�à¦•à¦¸à¦¾à¦¥à§‡ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¸à¦¾à¦¬à¦®à¦¿à¦Ÿ à¦•à¦°à¦¾à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦…à¦¨à§�à¦¤à¦°à§�à¦­à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "373",
    "date": "2026-09-14T10:30",
    "type": "UI Redesign",
    "module": "KPI Performance",
    "link": "/kpi-dashboard",
    "descriptionEn": "Redesigned KPI Performance Dashboard (/kpi-dashboard) into an executive analytics dashboard with live KPI metrics, Grade Band distribution charts, multi-layer approval pipeline funnel, department performance matrix, top performers wall, and searchable appraisal register.",
    "descriptionBn": "KPI Performance Dashboard (/kpi-dashboard) à¦ªà§‡à¦œà¦Ÿà¦¿à¦•à§‡ à¦�à¦•à§�à¦¸à¦¿à¦•à¦¿à¦‰à¦Ÿà¦¿à¦­ à¦…à§�à¦¯à¦¾à¦¨à¦¾à¦²à¦¿à¦Ÿà¦¿à¦•à§�à¦¸ à¦¡à§�à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§�à¦¡à§‡ à¦¨à¦¤à§�à¦¨à¦­à¦¾à¦¬à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡; à¦�à¦¤à§‡ à¦²à¦¾à¦‡à¦­ à¦•à§‡à¦œà¦¿à¦†à¦‡ à¦®à§‡à¦Ÿà§�à¦°à¦¿à¦•à§�à¦¸, à¦—à§�à¦°à§‡à¦¡ à¦¡à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿à¦¬à¦¿à¦‰à¦¶à¦¨ à¦¬à¦¾à¦° à¦šà¦¾à¦°à§�à¦Ÿ, à¦®à¦¾à¦²à§�à¦Ÿà¦¿-à¦²à§‡à¦¯à¦¼à¦¾à¦° à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦ªà¦¾à¦‡à¦ªà¦²à¦¾à¦‡à¦¨, à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦ªà¦¾à¦°à¦«à¦°à¦®à§�à¦¯à¦¾à¦¨à§�à¦¸ à¦®à§�à¦¯à¦¾à¦Ÿà§�à¦°à¦¿à¦•à§�à¦¸ à¦�à¦¬à¦‚ à¦¸à¦¾à¦°à§�à¦šà¦¯à§‹à¦—à§�à¦¯ à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à¦¾à¦‡à¦œà¦¾à¦² à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà¦¾à¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "372",
    "date": "2026-09-14T10:30",
    "type": "Print Layout Update",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Configured print media page break rule starting from 'Recommendation By HRD' in Assesment Final Report (/kpi-final-report) so HRD recommendations and signature blocks print cleanly on Page 2.",
    "descriptionBn": "Assesment Final Report (/kpi-final-report) à¦ªà§‡à¦œà§‡ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦…à¦ªà¦¶à¦¨à§‡ 'Recommendation By HRD' à¦…à¦‚à¦¶ à¦¥à§‡à¦•à§‡ à¦ªà¦°à¦¬à¦°à§�à¦¤à§€ à¦¸à¦•à¦² à¦¸à§‡à¦•à¦¶à¦¨ à¦ªà§‡à¦œ à§¨ (à§¨à§Ÿ à¦ªà§ƒà¦·à§�à¦ à¦¾)-à¦� à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦¹à¦“à§Ÿà¦¾à¦° à¦¨à¦¿à§Ÿà¦® à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "371",
    "date": "2026-09-14T10:30",
    "type": "Calculation Fix",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Corrected Average Assessment Point calculation in Assesment Final Report (/kpi-final-report) to dynamically calculate Total Mark (softwareScore + hodJobScore + hodOtherScore + hrdOtherScore - showcaseDeduction) and auto-assign Grade Band with 100% mathematical accuracy.",
    "descriptionBn": "Assesment Final Report (/kpi-final-report) à¦ªà§‡à¦œà§‡à¦° Average Assessment Point à¦¸à§‡à¦•à¦¶à¦¨à§‡ Total Mark à¦�à¦¬à¦‚ Grade à¦¹à¦¿à¦¸à¦¾à¦¬à¦•à§‡ (Software Auto + HOD Job + HOD Others + HRD Others - Show Case Deduction) à¦¶à¦¤à¦­à¦¾à¦— à¦¨à¦¿à¦°à§�à¦­à§�à¦² à¦“ à¦¡à¦¾à¦¯à¦¼à¦¨à¦¾à¦®à¦¿à¦• à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "370",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Identified top 3 criteria (Attendance, Target Achievement, Job Knowledge) with [System Auto Generated] badges in Assesment Final Report (/kpi-final-report) and merged their score cells across HOD and HRD columns into single auto-generation blocks.",
    "descriptionBn": "Assesment Final Report (/kpi-final-report) à¦ªà§‡à¦œà§‡à¦° à¦ªà§�à¦°à¦¥à¦® à§©à¦Ÿà¦¿ à¦•à§�à¦°à¦¾à¦‡à¦Ÿà§‡à¦°à¦¿à§Ÿà¦¾à¦•à§‡ [System Auto Generated] à¦¹à¦¿à¦¸à§‡à¦¬à§‡ à¦†à¦‡à¦¡à§‡à¦¨à§�à¦Ÿà¦¿à¦«à¦¾à¦‡ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¤à¦¾à¦¦à§‡à¦° à¦¸à§�à¦•à§‹à¦° à¦¸à§‡à¦² à¦®à¦¾à¦°à§�à¦œ à¦•à¦°à§‡ à¦¸à¦«à¦Ÿà¦“à§Ÿà§�à¦¯à¦¾à¦° à¦…à¦Ÿà§‹-à¦œà§‡à¦¨à¦¾à¦°à§‡à¦Ÿà§‡à¦¡ à¦¬à§�à¦²à¦•à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "369",
    "date": "2026-09-14T10:30",
    "type": "UI Fix",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Refined Assessment Gradings table formatting in Assesment Final Report (/kpi-final-report) with clean padding, proper character spacing for '< 50', and fixed text typos across recommendation tables.",
    "descriptionBn": "Assesment Final Report (/kpi-final-report) à¦ªà§‡à¦œà§‡à¦° Assessment Gradings à¦Ÿà§‡à¦¬à¦¿à¦²à§‡à¦° à¦ªà§�à¦¯à¦¾à¦¡à¦¿à¦‚, à¦¸à§�à¦ªà§‡à¦¸à¦¿à¦‚ à¦�à¦¬à¦‚ à¦Ÿà¦¾à¦‡à¦ªà§‹ à¦¸à¦‚à¦¶à§‹à¦§à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "368",
    "date": "2026-09-14T10:30",
    "type": "Typography Update",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Enforced Times New Roman font across all numbers, dates, IDs, scores, currency amounts, and text elements in Assesment Final Report (/kpi-final-report) to ensure 100% font consistency.",
    "descriptionBn": "Assesment Final Report (/kpi-final-report) à¦ªà§‡à¦œà§‡à¦° à¦¸à¦•à¦² à¦¸à¦‚à¦–à§�à¦¯à¦¾, à¦¤à¦¾à¦°à¦¿à¦–, à¦†à¦‡à¦¡à¦¿, à¦¸à§�à¦•à§‹à¦° à¦“ à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦�à¦²à¦¿à¦®à§‡à¦¨à§�à¦Ÿà§‡ à¦¶à¦¤à¦­à¦¾à¦— Times New Roman à¦«à¦¨à§�à¦Ÿ à¦ªà§�à¦°à§Ÿà§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "367",
    "date": "2026-09-14T10:30",
    "type": "UI Fix",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Fixed Assessment Criteria table cell alignment in Assesment Final Report (/kpi-final-report) by removing merged colSpan cells on top rows to align all 4 sub-columns (HOD Max, HOD Given Score, HRD Max, HRD Given Score) with 100% precision.",
    "descriptionBn": "Assesment Final Report (/kpi-final-report) à¦ªà§‡à¦œà§‡à¦° à¦Ÿà§‡à¦¬à¦¿à¦²à§‡à¦° à¦ªà§�à¦°à¦¥à¦® à§©à¦Ÿà¦¿ à¦¸à¦¾à¦°à¦¿à¦° à¦®à¦¾à¦°à§�à¦œ à¦•à¦°à¦¾ à¦¸à§‡à¦² à¦¸à¦°à¦¿à§Ÿà§‡ à¦¸à¦•à¦² à¦¸à¦¾à¦°à¦¿à¦° à§ªà¦Ÿà¦¿ à¦¸à¦¾à¦¬-à¦•à¦²à¦¾à¦® (HOD Max, HOD Given, HRD Max, HRD Given) à¦¸à¦ à¦¿à¦•à¦­à¦¾à¦¬à§‡ à¦¸à¦¾à¦°à¦¿à¦¬à¦¦à§�à¦§ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "366",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Clarified KPI Assessment Criteria table header in Assesment Final Report (/kpi-final-report) by adding explicit sub-column headers 'Max' and 'Given Score' under Department Head (HOD) and Human Resources (HRD).",
    "descriptionBn": "Assesment Final Report (/kpi-final-report) à¦ªà§‡à¦œà§‡à¦° à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ HOD à¦“ HRD à¦•à¦²à¦¾à¦®à¦•à§‡ à¦¸à§�à¦ªà¦·à§�à¦Ÿ à¦•à¦°à¦¤à§‡ 'Max' (à¦¸à¦°à§�à¦¬à§‹à¦šà§�à¦š à¦¨à¦®à§�à¦¬à¦°) à¦�à¦¬à¦‚ 'Given Score' (à¦ªà§�à¦°à¦¾à¦ªà§�à¦¤ à¦¨à¦®à§�à¦¬à¦°) à¦¶à¦¿à¦°à§‹à¦¨à¦¾à¦® à¦¸à¦¾à¦¬-à¦•à¦²à¦¾à¦® à¦†à¦•à¦¾à¦°à§‡ à¦†à¦²à¦¾à¦¦à¦¾ à¦•à¦°à§‡ à¦¦à§‡à¦–à¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "365",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Refined Assesment Final Report (/kpi-final-report) layout strictly to A4 page dimensions (210mm x 297mm) with Times New Roman font typography, employee photo box, company logo emblem, crisp high-contrast tables, and A4 PDF print optimization.",
    "descriptionBn": "Assesment Final Report (/kpi-final-report) à¦ªà§‡à¦œà§‡à¦° à¦²à§‡à¦†à¦‰à¦Ÿ Times New Roman à¦«à¦¨à§�à¦Ÿ, à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿à¦° à¦²à§‹à¦—à§‹, à¦‡à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿à¦° à¦›à¦¬à¦¿ à¦�à¦¬à¦‚ à¦¸à§�à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ A4 à¦¸à¦¾à¦‡à¦œ (210mm x 297mm) à¦«à¦°à¦®à§‡à¦Ÿà§‡ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "364",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Created 'Assesment Final Report' (/kpi-final-report) under KPI Performance featuring employee register list view and official print-ready 'Employee Performance Evaluation & Appraisal Form'.",
    "descriptionBn": "KPI Performance à¦®à§‡à¦¨à§�à¦° à¦…à¦§à§€à¦¨à§‡ 'Assesment Final Report' (/kpi-final-report) à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à¦‡à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦�à¦¬à¦‚ à¦…à¦«à¦¿à¦¸à¦¿à¦¯à¦¼à¦¾à¦² à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ-à¦°à§‡à¦¡à¦¿ 'Employee Performance Evaluation & Appraisal Form' à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦…à¦¨à§�à¦¤à¦°à§�à¦­à§�à¦•à§�à¦¤ à¦°à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "363",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "HR Approvals",
    "link": "/kpi-approval",
    "descriptionEn": "Enhanced KPI Approval (/kpi-approval) with multi-layer approval support (HRD, Plant Head, MD). Higher approval layers keep top evaluation form active while locking HOD Assessment, HOD Evaluation, HR Evaluation, and Employee Info as view-only.",
    "descriptionBn": "KPI Approval (/kpi-approval) à¦ªà§‡à¦œà§‡ à¦®à¦¾à¦²à§�à¦Ÿà¦¿-à¦²à§‡à¦¯à¦¼à¦¾à¦° à¦�à¦ªà§�à¦°à§�à¦­à¦¾à¦² (HRD, Plant Head, MD) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦ªà¦°à¦¬à¦°à§�à¦¤à§€ à¦�à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦²à§‡à¦¯à¦¼à¦¾à¦°à§‡ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° à¦‰à¦ªà¦°à§‡à¦° à¦«à¦°à§�à¦® à¦•à¦¨à§�à¦Ÿà§�à¦°à§‹à¦² à¦ªà¦¾à¦°à§�à¦Ÿ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡ à¦�à¦¬à¦‚ à¦¬à¦¾à¦•à¦¿ HOD/HR à¦®à§‚à¦²à§�à¦¯à¦¾à¦¯à¦¼à¦¨ à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦² à¦“ Employee Info à¦­à¦¿à¦‰-à¦…à¦¨à¦²à¦¿ à¦¥à¦¾à¦•à¦¬à§‡à¥¤"
  },
  {
    "id": "362",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "HR Approvals",
    "link": "/kpi-approval",
    "descriptionEn": "Created 'KPI Approval' (/kpi-approval) sub-menu under HR Approvals featuring a list view of pending approvals and HRD Final Evaluation screen matching HOD Assessment criteria, HOD & HR Evaluation key-value panels, and Employee Info card.",
    "descriptionBn": "HR Approvals à¦®à§‡à¦¨à§�à¦° à¦…à¦§à§€à¦¨à§‡ 'KPI Approval' (/kpi-approval) à¦¨à¦¾à¦®à§‡à¦° à¦¨à¦¤à§�à¦¨ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à¦ªà§‡à¦¨à§�à¦¡à¦¿à¦‚ à¦�à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦²à¦¿à¦¸à§�à¦Ÿ à¦­à¦¿à¦‰ à¦�à¦¬à¦‚ HOD Assessment, HOD & HR Evaluation à¦“ Employee Info à¦¸à¦¹ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ HRD à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦®à§‚à¦²à§�à¦¯à¦¾à¦¯à¦¼à¦¨ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨ à¦…à¦¨à§�à¦¤à¦°à§�à¦­à§�à¦•à§�à¦¤ à¦°à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "361",
    "date": "2026-09-14T10:30",
    "type": "UI Improvement",
    "module": "Approvals",
    "link": "/pending-approvals",
    "descriptionEn": "Updated sub-menu label and route header to 'All Pending Approval List' (/pending-approvals) under Approvals menu.",
    "descriptionBn": "Approvals à¦®à§‡à¦¨à§�à¦° à¦…à¦§à§€à¦¨à§‡ à¦¥à¦¾à¦•à¦¾ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦“ à¦ªà§‡à¦œà§‡à¦° à¦¨à¦¾à¦® à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ 'All Pending Approval List' à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "360",
    "date": "2026-09-14T10:30",
    "type": "UI Improvement",
    "module": "Approvals",
    "link": "/pending-approvals",
    "descriptionEn": "Simplified Pending Approvals (/pending-approvals) to a clean, minimal list focusing on requisition title, employee, current approval stage (e.g. Stage 2/3), and pending approver name.",
    "descriptionBn": "Pending Approvals (/pending-approvals) à¦ªà§‡à¦œà¦Ÿà¦¿ à¦¸à¦¹à¦œ à¦“ à¦•à§�à¦²à¦¿à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦¸à¦¹à¦œà§‡à¦‡ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦¤à¦¾à¦²à¦¿à¦•à¦¾, à¦¬à¦°à§�à¦¤à¦®à¦¾à¦¨ à¦¸à§�à¦Ÿà§‡à¦œ (à¦¯à§‡à¦®à¦¨ Stage 2/3) à¦�à¦¬à¦‚ à¦•à¦¾à¦° à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ à¦ªà§‡à¦¨à§�à¦¡à¦¿à¦‚ à¦†à¦›à§‡ à¦¤à¦¾ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à§Ÿà¥¤"
  },
  {
    "id": "359",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Approvals",
    "link": "/pending-approvals",
    "descriptionEn": "Added a new sub-menu and route 'Pending Approvals' (/pending-approvals) under Approvals consolidating all pending requisitions with smart 'Pending to whom' approver tracking, approval chain steppers, and reminder nudges.",
    "descriptionBn": "Approvals à¦®à§‡à¦¨à§�à¦° à¦…à¦§à§€à¦¨à§‡ 'Pending Approvals' (/pending-approvals) à¦¨à¦¾à¦®à§‡à¦° à¦¨à¦¤à§�à¦¨ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦“ à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦ªà§�à¦°à¦¤à¦¿à¦·à§�à¦ à¦¾à¦¨à§‡à¦° à¦¸à¦•à¦² à¦ªà§‡à¦¨à§�à¦¡à¦¿à¦‚ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦�à¦¬à¦‚ à¦¤à¦¾ à¦•à¦¾à¦° à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ à¦ªà§‡à¦¨à§�à¦¡à¦¿à¦‚ à¦†à¦›à§‡ ('Pending to whom!') à¦¤à¦¾ à¦¸à§�à¦ªà¦·à§�à¦Ÿà¦­à¦¾à¦¬à§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "358",
    "date": "2026-09-14T10:30",
    "type": "UI Improvement",
    "module": "Payroll (Salary Process)",
    "link": "/payroll-period-lock",
    "descriptionEn": "Refined Payroll Period Lock UI with professional typography, right-aligned table action buttons, and enabled/disabled state handling for the Certificate button.",
    "descriptionBn": "Payroll Period Lock à¦ªà§‡à¦œà§‡à¦° UI à¦•à§‡ à¦†à¦°à¦“ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à¦“ à¦®à¦¾à¦°à§�à¦œà¦¿à¦¤ à¦°à§‚à¦ª à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦Ÿà¦¨ à¦¡à¦¾à¦¨à¦ªà¦¾à¦¶à§‡ à¦�à¦²à¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦†à¦¨à¦²à¦• à¦¥à¦¾à¦•à¦¾ à¦…à¦¬à¦¸à§�à¦¥à¦¾à§Ÿ à¦¸à¦¾à¦°à§�à¦Ÿà¦¿à¦«à¦¿à¦•à§‡à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨ à¦¡à¦¿à¦œà§‡à¦¬à¦² à¦•à¦°à¦¾ à¦°à¦¾à¦–à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "357",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Payroll (Salary Process)",
    "link": "/payroll-period-lock",
    "descriptionEn": "Created a dedicated sub-menu and route 'Payroll Period Lock & Approval' (/payroll-period-lock) under Payroll -> Salary Process with period analytics cards, lock/unlock modals, persistent state, and printable frozen audit certificates.",
    "descriptionBn": "Payroll -> Salary Process à¦�à¦° à¦¨à¦¿à¦šà§‡ 'Payroll Period Lock & Approval' (/payroll-period-lock) à¦¨à¦¾à¦®à§‡à¦° à¦¨à¦¤à§�à¦¨ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦¸à¦•à¦² à¦®à¦¾à¦¸à§‡à¦° à¦¬à§‡à¦¤à¦¨ à¦ªà§�à¦°à¦¸à§‡à¦¸à§‡à¦° à¦²à¦•/à¦†à¦¨à¦²à¦• à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦®à§‡à¦¨à§�à¦Ÿ à¦�à¦¬à¦‚ à¦…à¦¡à¦¿à¦Ÿ à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦œà§‡à¦¨à¦¾à¦°à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "356",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Payroll (Monthly Salary Process)",
    "link": "/monthly-salary-process",
    "descriptionEn": "Added a persistent Payroll Lock & Unlock System to Monthly Salary Process (/monthly-salary-process) featuring Lock/Unlock action buttons, Lock Confirmation Modal, Unlock Authorization Modal, top warning banner, and edit protection.",
    "descriptionBn": "Monthly Salary Process (/monthly-salary-process) à¦ªà§‡à¦œà§‡ à¦ªà§‡à¦°à§‹à¦² à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦²à¦• à¦“ à¦†à¦¨à¦²à¦• à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦® à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦²à¦• à¦•à¦°à¦¾ à¦…à¦¬à¦¸à§�à¦¥à¦¾à§Ÿ à¦¬à§‡à¦¤à¦¨ à¦¶à¦¿à¦Ÿà§‡ à¦�à¦¡à¦¿à¦Ÿ à¦�à¦¬à¦‚ à¦ªà§�à¦¨à¦°à¦¾à§Ÿ à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦¶à¦¨ à¦¨à¦¿à¦·à§�à¦•à§�à¦°à¦¿à§Ÿ à¦¥à¦¾à¦•à¦¬à§‡à¥¤"
  },
  {
    "id": "355",
    "date": "2026-09-14T10:30",
    "type": "Bug Fix",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Fixed a runtime ReferenceError in Employee Doc Verification (/employee-doc-verification) caused by an undefined setRejectTarget call inside openModal and closeModal, restoring instant modal opening on Review click.",
    "descriptionBn": "Employee Doc Verification (/employee-doc-verification) à¦ªà§‡à¦œà§‡ openModal à¦“ closeModal à¦«à¦¾à¦‚à¦¶à¦¨à§‡ à¦¥à¦¾à¦•à¦¾ à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦�à¦°à¦° à¦¦à§‚à¦° à¦•à¦°à§‡ à¦°à¦­à¦¿à¦‰ à¦¬à¦¾à¦Ÿà¦¨à§‡ à¦•à§�à¦²à¦¿à¦• à¦•à¦°à¦¾à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à¦¾à¦¥à§‡ à¦®à§‹à¦¡à¦¾à¦² à¦“à¦ªà§‡à¦¨ à¦¹à¦“à§Ÿà¦¾ à¦¨à¦¿à¦¶à§�à¦šà¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "354",
    "date": "2026-09-14T10:30",
    "type": "Bug Fix",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Enhanced modal triggers in Employee Doc Verification (/employee-doc-verification) by binding openModal to the blue Review > button, yellow â�± REVIEW status pill, and entire table row, while elevating modal z-index to z-[100].",
    "descriptionBn": "Employee Doc Verification (/employee-doc-verification) à¦ªà§‡à¦œà§‡ Review à¦¬à¦¾à¦Ÿà¦¨, à¦¹à¦²à§�à¦¦ â�± REVIEW à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦¬à§�à¦¯à¦¾à¦œ à¦�à¦¬à¦‚ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦Ÿà§‡à¦¬à¦¿à¦² à¦°à§‹ à¦¤à§‡ à¦®à§‹à¦¡à¦¾à¦² à¦“à¦ªà§‡à¦¨ à¦Ÿà§�à¦°à¦¿à¦—à¦¾à¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ z-index à¦¬à§ƒà¦¦à§�à¦§à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "353",
    "date": "2026-09-14T10:30",
    "type": "Bug Fix",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Fixed the Review button click handler in Employee Doc Verification (/employee-doc-verification) to cleanly open the verification modal and side-by-side OCR match console.",
    "descriptionBn": "Employee Doc Verification (/employee-doc-verification) à¦ªà§‡à¦œà§‡à¦° Review à¦¬à¦¾à¦Ÿà¦¨ à¦•à§�à¦²à¦¿à¦• à¦¸à¦®à¦¸à§�à¦¯à¦¾ à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦¸à¦¹à¦œà§‡ à¦­à§‡à¦°à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦®à§‹à¦¡à¦¾à¦² à¦“ à¦¡à¦•à§�à¦¯à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦¸à§�à¦•à§�à¦¯à¦¾à¦¨ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à§Ÿà¥¤"
  },
  {
    "id": "352",
    "date": "2026-09-14T10:30",
    "type": "Revert",
    "module": "Allowance Requisition",
    "link": "/allowance-requisition",
    "descriptionEn": "Reverted Allowance Requisition (/allowance-requisition) back to its original comprehensive layout per user request.",
    "descriptionBn": "à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦° à¦¨à¦¿à¦°à§�à¦¦à§‡à¦¶à¦¨à¦¾à§Ÿ Allowance Requisition (/allowance-requisition) à¦ªà§‡à¦œà¦Ÿà¦¿ à¦ªà§‚à¦°à§�à¦¬à§‡à¦° à¦­à¦¾à¦°à§�à¦¸à¦¨à§‡ à¦°à¦¿à¦­à¦¾à¦°à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "351",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Other Separations)",
    "link": "/separation-company-initiated",
    "descriptionEn": "Expanded the Initiate Company Separation Order modal width to max-w-5xl (~1024px wide) and arranged the category selection buttons into a clean 3-column grid per user request.",
    "descriptionBn": "Other Separations (/separation-company-initiated) à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿à¦° à¦šà¦“à§œà¦¾ à¦†à¦°à¦“ à¦¬à§œ (max-w-5xl layout) à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¸à§‡à¦ªà¦¾à¦°à§‡à¦¶à¦¨ à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿ à¦¬à¦¾à¦Ÿà¦¨à¦—à§�à¦²à§‹à¦•à§‡ à§©à¦Ÿà¦¿ à¦•à¦²à¦¾à¦®à§‡à¦° à¦—à§�à¦°à¦¿à¦¡à§‡ à¦šà¦®à§Žà¦•à¦¾à¦°à¦­à¦¾à¦¬à§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "350",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Allowance Requisition",
    "link": "/allowance-requisition",
    "descriptionEn": "Redesigned Allowance Requisition (/allowance-requisition) to show a Saved Requisition List table, added a top '+ Create Allowance Requisition' header button, and created a modal with Date Range (Start/End Date), Allowance Type, Multi-Select Employee checklist, and Save functionality.",
    "descriptionBn": "Allowance Requisition (/allowance-requisition) à¦ªà§‡à¦œà§‡ à¦ªà§‚à¦°à§�à¦¬à§‡ à¦¸à¦‚à¦°à¦•à§�à¦·à¦¿à¦¤ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦‰à¦ªà¦°à§‡ '+ Create Allowance Requisition' à¦¬à¦¾à¦Ÿà¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à§‡ à¦®à§‹à¦¡à¦¾à¦² à¦šà¦¾à¦²à§� à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦¡à§‡à¦Ÿ à¦°à§‡à¦žà§�à¦œ, à¦�à¦²à¦¾à¦‰à¦¨à§�à¦¸ à¦Ÿà¦¾à¦‡à¦ª, à¦®à¦¾à¦²à§�à¦Ÿà¦¿-à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦�à¦¬à¦‚ à¦¸à§‡à¦­ à¦¬à¦¾à¦Ÿà¦¨ à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "349",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Other Separations)",
    "link": "/separation-company-initiated",
    "descriptionEn": "Simplified the Category Selection buttons in the Initiate Company Separation modal (/separation-company-initiated) by removing subtitle descriptions to display clean, uncluttered category titles per user request.",
    "descriptionBn": "Other Separations (/separation-company-initiated) à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦¸à§‡à¦ªà¦¾à¦°à§‡à¦¶à¦¨ à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿ à¦…à¦ªà¦¶à¦¨à¦—à§�à¦²à§‹ à¦¥à§‡à¦•à§‡ à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ à¦¬à¦¿à¦¬à¦°à¦£ à¦¸à¦¾à¦¬à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦¸à¦°à¦¿à§Ÿà§‡ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦° à¦�à¦¬à¦‚ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿ à¦¶à¦¿à¦°à§‹à¦¨à¦¾à¦®à§‡à¦° à¦¬à¦¾à¦Ÿà¦¨ à¦¹à¦¿à¦¸à§‡à¦¬à§‡ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "348",
    "date": "2026-09-14T10:30",
    "type": "New Module",
    "module": "Separation (Other Separations)",
    "link": "/separation-company-initiated",
    "descriptionEn": "Added a new menu 'Other Separations' (/separation-company-initiated) under Separation to manage company & management-initiated separations: Termination with Notice, Retirement, Mutual Separation, Medical Invalidation, Deceased Employee Settlement, and Disciplinary Dismissal.",
    "descriptionBn": "Separation à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ 'Other Separations' (/separation-company-initiated) à¦¨à¦¾à¦®à§‡ à¦¨à¦¤à§�à¦¨ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦¨à§‹à¦Ÿà¦¿à¦¶à¦¸à¦¹ à¦šà¦¾à¦•à¦°à¦¿ à¦…à¦¬à¦¸à¦¾à¦¨, à¦…à¦¬à¦¸à¦°à¦—à§�à¦°à¦¹à¦£, à¦¦à§�à¦¬à¦¿à¦ªà¦¾à¦•à§�à¦·à¦¿à¦• à¦¸à¦®à¦�à§‹à¦¤à¦¾, à¦šà¦¿à¦•à¦¿à§Žà¦¸à¦¾à¦œà¦¨à¦¿à¦¤ à¦…à¦•à§�à¦·à¦®à¦¤à¦¾, à¦®à§ƒà¦¤à§�à¦¯à§�à¦œà¦¨à¦¿à¦¤ à¦ªà¦¾à¦“à¦¨à¦¾ à¦�à¦¬à¦‚ à¦¶à§ƒà¦™à§�à¦–à¦²à¦¾à¦­à¦™à§�à¦—à§‡à¦° à¦¬à¦°à¦–à¦¾à¦¸à§�à¦¤ à¦ªà§�à¦°à¦•à§�à¦°à¦¿à§Ÿà¦¾à¦—à§�à¦²à§‹ à¦ªà¦°à¦¿à¦šà¦¾à¦²à¦¨à¦¾ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "347",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Clearance Matrix)",
    "link": "/separation-clearance",
    "descriptionEn": "Expanded the Create Clearance Request modal dimensions in Separation Clearance (/separation-clearance) to a spacious max-w-3xl layout with generous inner padding (px-8 py-6), larger form controls, and roomier resignation details profile card.",
    "descriptionBn": "Separation Clearance (/separation-clearance) à¦ªà§‡à¦œà§‡à¦° à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿ à¦šà¦¾à¦°à¦¦à¦¿à¦•à§‡ à¦†à¦°à¦“ à¦¬à§œ (max-w-3xl layout) à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦­à§‡à¦¤à¦°à§‡à¦° à¦ªà§�à¦¯à¦¾à¦¡à¦¿à¦‚ à¦“ à¦²à§‡à¦†à¦‰à¦Ÿ à¦†à¦°à¦“ à¦ªà§�à¦°à¦¸à¦¾à¦°à¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "346",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Clearance Matrix)",
    "link": "/separation-clearance",
    "descriptionEn": "Refined the Create Clearance Request modal in Separation Clearance (/separation-clearance) by limiting selection ONLY to approved resigned employees via a searchable combobox, removing Separation Type, auto-populating resignation metadata cards, and enhancing modal design.",
    "descriptionBn": "Separation Clearance (/separation-clearance) à¦ªà§‡à¦œà§‡à¦° à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿ à¦°à¦¿à¦«à¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° à¦ªà¦¦à¦¤à§�à¦¯à¦¾à¦— à¦…à¦¨à§�à¦®à§‹à¦¦à¦¨à¦ªà§�à¦°à¦¾à¦ªà§�à¦¤ à¦•à¦°à§�à¦®à§€à¦°à¦¾à¦‡ à¦…à¦¨à§�à¦¸à¦¨à§�à¦§à¦¾à¦¨à¦¯à§‹à¦—à§�à¦¯ (Searchable) à¦¤à¦¾à¦²à¦¿à¦•à¦¾à§Ÿ à¦¥à¦¾à¦•à§‡à¦¨, à¦¸à§‡à¦ªà¦¾à¦°à§‡à¦¶à¦¨ à¦Ÿà¦¾à¦‡à¦ª à¦«à¦¿à¦²à§�à¦¡ à¦¤à§�à¦²à§‡ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦ªà¦¦à¦¤à§�à¦¯à¦¾à¦—à§‡à¦° à¦¤à¦¥à§�à¦¯ à¦¸à§�à¦¬à§Ÿà¦‚à¦•à§�à¦°à¦¿à§Ÿà¦­à¦¾à¦¬à§‡ à¦­à§‡à¦¸à§‡ à¦“à¦ à¦¾à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "345",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Separation (Clearance Matrix)",
    "link": "/separation-clearance",
    "descriptionEn": "Added a '+ Create Clearance Request' button in the header bar of Separation Clearance (/separation-clearance) with a modal allowing HR/Management to select employees, choose Separation Types, set leaving date, and initiate a new 6-stage clearance workflow.",
    "descriptionBn": "Separation Clearance (/separation-clearance) à¦ªà§‡à¦œà§‡à¦° à¦¹à§‡à¦¡à¦¾à¦° à¦¬à¦¾à¦°à§‡ '+ Create Clearance Request' à¦¬à¦¾à¦Ÿà¦¨ à¦“ à¦®à§‹à¦¡à¦¾à¦² à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦�à¦‡à¦šà¦†à¦° à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦•à¦°à§�à¦®à§€à¦° à¦œà¦¨à§�à¦¯ à¦¸à§‡à¦ªà¦¾à¦°à§‡à¦¶à¦¨ à¦Ÿà¦¾à¦‡à¦ª à¦“ à¦¸à¦¾à¦°à§�à¦­à¦¿à¦¸ à¦›à¦¾à§œà¦¾à¦° à¦¤à¦¾à¦°à¦¿à¦– à¦¸à§‡à¦Ÿ à¦•à¦°à§‡ à¦¨à¦¤à§�à¦¨ à§¬à¦Ÿà¦¿ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦›à¦¾à§œà¦ªà¦¤à§�à¦° à¦°à¦¿à¦•à§‹à§Ÿà§‡à¦¸à§�à¦Ÿ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¥¤"
  },
  {
    "id": "344",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Exit Documents)",
    "link": "/separation-exit-documents",
    "descriptionEn": "Fixed dropdown text alignment to left-aligned and resolved menu clipping issues by expanding dropdown width (w-64) and applying smart upward placement (bottom-full) on bottom rows in Exit Documents (/separation-exit-documents).",
    "descriptionBn": "Exit Documents (/separation-exit-documents) à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦…à¦ªà¦¶à¦¨à¦—à§�à¦²à§‹à¦•à§‡ à¦²à§‡à¦«à¦Ÿ-à¦�à¦²à¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¨à¦¿à¦šà§‡à¦° à¦¸à¦¾à¦°à¦¿à¦¤à§‡ à¦…à¦ªà¦¶à¦¨à¦—à§�à¦²à§‹ à¦•à§‡à¦Ÿà§‡ à¦¯à¦¾à¦“à§Ÿà¦¾à¦° à¦¸à¦®à¦¸à§�à¦¯à¦¾ à¦¸à¦®à¦¾à¦§à¦¾à¦¨à§‡ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦ªà§�à¦°à¦¸à§�à¦¤à§�à¦¤à¦•à¦°à¦£ à¦“ à¦¸à§�à¦®à¦¾à¦°à§�à¦Ÿ à¦†à¦ªà¦“à§Ÿà¦¾à¦°à§�à¦¡ à¦ªà¦œà¦¿à¦¶à¦¨à¦¿à¦‚ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "343",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Exit Documents)",
    "link": "/separation-exit-documents",
    "descriptionEn": "Simplified the items inside the Exit Documents Download/Issue Documents dropdown menu to clean, simple document names without icons or subtext per user request.",
    "descriptionBn": "Exit Documents à¦ªà§‡à¦œà§‡à¦° à¦¡à¦¾à¦‰à¦¨à¦²à§‹à¦¡ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦®à§‡à¦¨à§�à¦° à¦†à¦‡à¦Ÿà§‡à¦®à¦—à§�à¦²à§‹à¦•à§‡ à¦†à¦‡à¦•à¦¨ à¦�à¦¬à¦‚ à¦¸à¦¾à¦¬à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦›à¦¾à§œà¦¾ à¦�à¦•à¦¦à¦® à¦¸à¦¾à¦§à¦¾à¦°à¦£ à¦“ à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦° à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦¨à¦¾à¦® à¦¹à¦¿à¦¸à§‡à¦¬à§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "342",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Exit Documents)",
    "link": "/separation-exit-documents",
    "descriptionEn": "Removed top document tabs on Exit Documents (/separation-exit-documents) per user request and replaced them with a Download/Issue Documents dropdown button in the table Actions column allowing users to generate any of the 6 departure documents or download full packages.",
    "descriptionBn": "Exit Documents (/separation-exit-documents) à¦ªà§‡à¦œ à¦¥à§‡à¦•à§‡ à¦‰à¦ªà¦°à§‡à¦° à¦Ÿà§�à¦¯à¦¾à¦¬à¦—à§�à¦²à§‹ à¦¤à§�à¦²à§‡ à¦¦à¦¿à¦¯à¦¼à§‡ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦•à¦°à§�à¦®à§€à¦° à¦ªà¦¾à¦¶à§‡ Actions à¦•à¦²à¦¾à¦®à§‡ Download/Issue Documents à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦¬à¦¾à¦Ÿà¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦¯à§‡à¦•à§‹à¦¨ à¦¬à¦¿à¦¦à¦¾à¦¯à¦¼à§€ à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦¦à§‡à¦–à¦¾ à¦“ à¦¡à¦¾à¦‰à¦¨à¦²à§‹à¦¡ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "341",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Clearance Matrix)",
    "link": "/separation-clearance",
    "descriptionEn": "Removed the redundant top department cards from Separation Clearance (/separation-clearance) per user feedback and added a comprehensive filter bar featuring Date Range (Leaving From/To), Department dropdown selector, Overall Status dropdown, Search keyword, and Reset Filters button.",
    "descriptionBn": "à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦° à¦‡à¦‰à¦œà¦¾à¦° à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à¦«à§‡à¦¸ à¦«à¦¿à¦¡à¦¬à§�à¦¯à¦¾à¦• à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ Separation Clearance (/separation-clearance) à¦¥à§‡à¦•à§‡ à¦…à¦ªà§�à¦°à¦¯à¦¼à§‹à¦œà¦¨à§€à¦¯à¦¼ à¦Ÿà¦ª à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦•à¦¾à¦°à§�à¦¡à¦—à§�à¦²à§‹ à¦¸à¦°à¦¿à¦¯à¦¼à§‡ à¦«à§‡à¦²à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¡à§‡à¦Ÿ à¦°à§‡à¦žà§�à¦œ (Leaving From/To), à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦°, à¦“à¦­à¦¾à¦°à¦…à¦² à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° à¦“ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦°à¦¿à¦¸à§�à¦Ÿà§‹à¦° à¦¬à§‹à¦¤à¦¾à¦®à¦¸à¦¹ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¬à¦¾à¦° à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "340",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Exit Documents)",
    "link": "/separation-exit-documents",
    "descriptionEn": "Upgraded the Exit Documents Issuance page (/separation-exit-documents) to support 6 lucrative executive corporate departure paper documents: Release Letter, Clearance Form (with 6-dept matrix table), Experience Certificate, NOC, Service Certificate, and Final Settlement Voucher with brand gradient top bars, profile cards, and digital QR seals.",
    "descriptionBn": "Exit Documents (/separation-exit-documents) à¦ªà§‡à¦œà¦Ÿà¦¿ à¦†à¦ªà¦—à§�à¦°à§‡à¦¡ à¦•à¦°à§‡ à§¬à¦Ÿà¦¿ à¦�à¦•à§�à¦¸à¦¿à¦•à¦¿à¦‰à¦Ÿà¦¿à¦­ à¦•à¦°à§�à¦ªà§‹à¦°à§‡à¦Ÿ à¦ªà§‡à¦ªà¦¾à¦° à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ (à¦°à¦¿à¦²à¦¿à¦œ à¦²à§‡à¦Ÿà¦¾à¦°, à§¬à¦Ÿà¦¿ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦›à¦¾à§œà¦ªà¦¤à§�à¦° à¦«à¦°à§�à¦®, à¦…à¦­à¦¿à¦œà§�à¦žà¦¤à¦¾ à¦¸à¦¨à¦¦à¦ªà¦¤à§�à¦°, NOC, à¦¸à¦¾à¦°à§�à¦­à¦¿à¦¸ à¦¸à¦¾à¦°à§�à¦Ÿà¦¿à¦«à¦¿à¦•à§‡à¦Ÿ à¦�à¦¬à¦‚ à¦šà§‚à§œà¦¾à¦¨à§�à¦¤ à¦ªà¦¾à¦“à¦¨à¦¾ à¦­à¦¾à¦‰à¦šà¦¾à¦°) à¦¬à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦—à§�à¦°à§�à¦¯à¦¾à¦¡à¦¿à¦¯à¦¼à§‡à¦¨à§�à¦Ÿ à¦…à§�à¦¯à¦¾à¦•à¦¸à§‡à¦¨à§�à¦Ÿ à¦¬à¦¾à¦° à¦“ à¦¡à¦¿à¦œà¦¿à¦Ÿà¦¾à¦² QR à¦¸à¦¿à¦•à¦¿à¦‰à¦°à¦¿à¦Ÿà¦¿ à¦¸à¦¿à¦²à¦¸à¦¹ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "339",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Clearance & Resignation)",
    "link": "/separation-clearance",
    "descriptionEn": "Elevated the Employee Clearance Form and Resignation Letter view modals into lucrative executive corporate document paper designs featuring top brand gradient accent bars, employee profile cards, dark gradient table headers, rounded status pills, and digital QR security verification seal.",
    "descriptionBn": "Employee Clearance Form à¦�à¦¬à¦‚ Resignation Letter à¦¦à§‡à¦–à¦¾à¦° à¦®à§‹à¦¡à¦¾à¦² à¦¦à§�à¦Ÿà¦¿à¦•à§‡ à¦²à§�à¦•à¦°à§‡à¦Ÿà¦¿à¦­ à¦�à¦•à§�à¦¸à¦¿à¦•à¦¿à¦‰à¦Ÿà¦¿à¦­ à¦•à¦°à§�à¦ªà§‹à¦°à§‡à¦Ÿ à¦ªà§‡à¦ªà¦¾à¦° à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦¬à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦—à§�à¦°à§�à¦¯à¦¾à¦¡à¦¿à¦¯à¦¼à§‡à¦¨à§�à¦Ÿ à¦…à§�à¦¯à¦¾à¦•à¦¸à§‡à¦¨à§�à¦Ÿ à¦¬à¦¾à¦°, à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦•à¦¾à¦°à§�à¦¡, à¦¡à¦¾à¦°à§�à¦• à¦Ÿà§‡à¦¬à¦¿à¦² à¦¹à§‡à¦¡à¦¾à¦°, à¦¸à¦«à¦Ÿ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦ªà¦¿à¦²à¦¸ à¦�à¦¬à¦‚ à¦¡à¦¿à¦œà¦¿à¦Ÿà¦¾à¦² QR à¦¸à¦¿à¦•à¦¿à¦‰à¦°à¦¿à¦Ÿà¦¿ à¦¸à¦¿à¦² à¦¥à¦¾à¦•à¦¬à§‡à¥¤"
  },
  {
    "id": "338",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Clearance Matrix)",
    "link": "/separation-clearance",
    "descriptionEn": "Upgraded the Separation Clearance page (/separation-clearance) with a 6-stage clearance progress tracking dashboard and integrated the official printable Pakiza Software 'Employee Clearance Form' matching the reference document (Accounts, Administration, ICT, Immediate Reporting, HR Department, COO).",
    "descriptionBn": "Separation Clearance à¦ªà§‡à¦œà¦Ÿà¦¿à¦¤à§‡ à§¬à¦Ÿà¦¿ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° (Accounts, Admin, ICT, Immediate Reporting, HR, COO) à¦ªà§�à¦°à§‹à¦—à§�à¦°à§‡à¦¸ à¦¬à¦¾à¦° à¦¸à¦¹ à¦¸à§�à¦®à¦¾à¦°à§�à¦Ÿ à¦¡à§�à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§�à¦¡ à¦�à¦¬à¦‚ à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦¹à§�à¦¬à¦¹à§� à¦…à¦«à¦¿à¦¸à¦¿à§Ÿà¦¾à¦² à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿà¦¯à§‹à¦—à§�à¦¯ 'Employee Clearance Form' à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "337",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Resignation Request)",
    "link": "/separation-resignation-request",
    "descriptionEn": "Added a searchable Separation Reason combobox with 18+ comprehensive reasons and integrated a Rich Text Formatting Toolbar (Bold, Italic, Underline, Bullet List, Numbered List) styled with Inter font typography in Resignation Request (/separation-resignation-request).",
    "descriptionBn": "Resignation Request (/separation-resignation-request) à¦®à§‹à¦¡à¦¾à¦²à§‡ à¦¸à¦¾à¦°à§�à¦š à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¸à¦¹ à§§à§®+ à¦Ÿà¦¿ à¦¸à§‡à¦ªà¦¾à¦°à§‡à¦¶à¦¨ à¦°à¦¿à¦œà¦¨ à¦•à¦®à§�à¦¬à§‹à¦¬à¦•à§�à¦¸ à¦�à¦¬à¦‚ à¦‡à¦¨à§�à¦Ÿà¦¾à¦° (Inter) à¦«à¦¨à§�à¦Ÿ à¦¸à¦¹ à¦°à¦¿à¦š à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦«à¦°à¦®à§�à¦¯à¦¾à¦Ÿà¦¿à¦‚ à¦Ÿà§�à¦²à¦¬à¦¾à¦° (Bold, Italic, Underline, Bullet List, Numbered List) à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "336",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Resignation Request)",
    "link": "/separation-resignation-request",
    "descriptionEn": "Transformed the Resignation Request page into an Employee Self-Service portal with a large email-style modal composer featuring auto-filled metadata, Subject line, Notice Date, Last Working Date, comprehensive Reasons dropdown, and spacious editable letter body while removing table approval buttons.",
    "descriptionBn": "Resignation Request à¦ªà§‡à¦œà¦Ÿà¦¿à¦•à§‡ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦° à¦¨à¦¿à¦œà§‡à¦° à¦°à¦¿à¦•à§‹à¦¯à¦¼à§‡à¦¸à§�à¦Ÿ à¦•à¦°à¦¾à¦° à¦‰à¦ªà¦¯à§‹à¦—à§€ à¦‡à¦®à§‡à¦‡à¦²-à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦²à¦¾à¦°à§�à¦œ à¦•à¦®à§�à¦ªà§‹à¦œà¦¾à¦° à¦®à§‹à¦¡à¦¾à¦²à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦†à¦‡à¦¡à¦¿ à¦“ à¦¨à¦¾à¦® à¦…à¦Ÿà§‹-à¦¶à§‹ à¦•à¦°à¦¬à§‡, à¦¸à¦¾à¦¬à¦œà§‡à¦•à§�à¦Ÿ, à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦¡à§‡à¦Ÿ, à¦²à¦¾à¦¸à§�à¦Ÿ à¦“à§Ÿà¦¾à¦°à§�à¦•à¦¿à¦‚ à¦¡à§‡à¦Ÿ, à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦°à¦¿à¦œà¦¨ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦�à¦¬à¦‚ à¦¬à¦¿à¦¸à§�à¦¤à§ƒà¦¤ à¦²à§‡à¦Ÿà¦¾à¦° à¦¬à¦¡à¦¿ à¦�à¦¡à¦¿à¦Ÿà¦° à¦¥à¦¾à¦•à¦¬à§‡à¥¤"
  },
  {
    "id": "335",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Separation Module",
    "link": "/separation-resignation-request",
    "descriptionEn": "Created the comprehensive Separation Module featuring 4 smart sub-routes: Resignation Request (/separation-resignation-request), 6-Stage Multi-Departmental Clearance Matrix (/separation-clearance: Accounts, Admin, ICT, Reporting Boss, HR, C-Level), Settlement Payment (/separation-payment), and Exit Document Issuance (/separation-exit-documents).",
    "descriptionBn": "à¦¸à§�à¦®à¦¾à¦°à§�à¦Ÿ à¦¸à§‡à¦ªà¦¾à¦°à§‡à¦¶à¦¨ à¦®à¦¡à¦¿à¦‰à¦² à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à¦¾à¦° à¦…à¦§à§€à¦¨à§‡ à§ª à¦Ÿà¦¿ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: Resignation Request, à§¬à¦Ÿà¦¿ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° (Accounts, Admin, ICT, Reporting Boss, HR, C-Level) à¦¸à§�à¦®à¦¾à¦°à§�à¦Ÿ à¦•à§�à¦²à¦¿à¦¯à¦¼à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦®à§�à¦¯à¦¾à¦Ÿà§�à¦°à¦¿à¦•à§�à¦¸ (/separation-clearance), à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ (/separation-payment), à¦�à¦¬à¦‚ à¦°à¦¿à¦²à¦¿à¦œ à¦²à§‡à¦Ÿà¦¾à¦° à¦“ à¦�à¦•à§�à¦¸à¦ªà§‡à¦°à¦¿à¦¯à¦¼à§‡à¦¨à§�à¦¸ à¦¸à¦¾à¦°à§�à¦Ÿà¦¿à¦«à¦¿à¦•à§‡à¦Ÿà¦¸à¦¹ Exit Documentsà¥¤"
  },
  {
    "id": "334",
    "date": "2026-09-14T10:30",
    "type": "Cleanup",
    "module": "Leave (Maternity Leave)",
    "link": "/maternity-payment",
    "descriptionEn": "Removed the redundant /maternity-leave route page and purged all associated links from Sidebar.tsx and Topbar.tsx navigation menus per user request.",
    "descriptionBn": "à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦° à¦…à¦¨à§�à¦°à§‹à¦§ à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ /maternity-leave à¦°à§�à¦Ÿ à¦ªà§‡à¦œà¦Ÿà¦¿ à¦®à§�à¦›à§‡ à¦«à§‡à¦²à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦“ à¦Ÿà¦ªà¦¬à¦¾à¦° à¦®à§‡à¦¨à§� à¦¥à§‡à¦•à§‡ à¦�à¦° à¦¸à¦¬ à¦§à¦°à¦¨à§‡à¦° à¦²à¦¿à¦‚à¦• à¦¸à¦°à¦¿à¦¯à¦¼à§‡ à¦«à§‡à¦²à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "333",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Configure (Maternity Configuration)",
    "link": "/maternity-configuration",
    "descriptionEn": "Created the Maternity Policy Configuration module (/maternity-configuration) under Configure, enabling HR administrators to define cutoff date rules to automatically evaluate whether maternity benefit calculation is processed using Gross Pay or Net Pay, complemented by an active rules registry and live calculation simulator.",
    "descriptionBn": "Configure à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ Maternity Configuration (/maternity-configuration) à¦¨à¦¾à¦®à§‡ à¦¨à¦¤à§�à¦¨ à¦ªà§‡à¦œ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦•à¦¾à¦Ÿà¦…à¦« à¦¡à§‡à¦Ÿ à¦¥à§�à¦°à§‡à¦¶à¦¹à§‹à¦²à§�à¦¡ à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦®à¦¾à¦¤à§ƒà¦¤à§�à¦¬à¦•à¦¾à¦²à§€à¦¨ à¦›à§�à¦Ÿà¦¿à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ Gross Pay à¦¨à¦¾à¦•à¦¿ Net Pay à¦¤à§‡ à¦¹à¦¿à¦¸à¦¾à¦¬ à¦¹à¦¬à§‡ à¦¤à¦¾ à¦¨à¦¿à¦°à§�à¦§à¦¾à¦°à¦£ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡, à¦¸à¦¾à¦¥à§‡ à¦²à¦¾à¦‡à¦­ à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦¶à¦¨ à¦¸à¦¿à¦®à§�à¦²à§‡à¦Ÿà¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "332",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Leave (Maternity Leave)",
    "link": "/maternity-leave",
    "descriptionEn": "Set Emp Name, Sub Department, Job Title, and Date of joining input fields to readOnly with grey background styling in Maternity Leave (/maternity-leave) to signify auto-populated employee metadata.",
    "descriptionBn": "Maternity Leave (/maternity-leave) à¦ªà§‡à¦œà§‡ Emp Name, Sub Department, Job Title, à¦�à¦¬à¦‚ Date of joining à¦‡à¦¨à¦ªà§�à¦Ÿ à¦«à¦¿à¦²à§�à¦¡à¦—à§�à¦²à§‹à¦•à§‡ readOnly à¦�à¦¬à¦‚ à¦§à§‚à¦¸à¦° à¦¬à§�à¦¯à¦¾à¦•à¦—à§�à¦°à¦¾à¦‰à¦¨à§�à¦¡ à¦¸à§�à¦Ÿà¦¾à¦‡à¦²à§‡ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦…à¦Ÿà§‹-à¦«à¦¿à¦² à¦¡à¦¾à¦Ÿà¦¾ à¦¸à§�à¦ªà¦·à§�à¦Ÿ à¦¬à§‹à¦�à¦¾ à¦¯à¦¾à¦¯à¦¼à¥¤"
  },
  {
    "id": "331",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Navigation (Sidebar)",
    "link": "/maternity-leave",
    "descriptionEn": "Grouped Maternity Leave, Maternity Payment, and Maternity Payment Report under a collapsible 'Maternity' sub-category within the Leave sidebar navigation menu for clean information architecture.",
    "descriptionBn": "à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨à§‡ Leave à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ 'Maternity' à¦¨à¦¾à¦®à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¨à§‡à¦¸à§�à¦Ÿà§‡à¦¡ à¦¸à¦¾à¦¬-à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à§‡ à¦¤à¦¾à¦° à¦…à¦§à§€à¦¨à§‡ Maternity Leave, Maternity Payment, à¦�à¦¬à¦‚ Maternity Payment Report à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§�à¦—à§�à¦²à§‹ à¦—à§�à¦šà§�à¦› à¦†à¦•à¦¾à¦°à§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "330",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Leave (Maternity Payment)",
    "link": "/maternity-payment",
    "descriptionEn": "Removed the duplicate '+ Add New' button from the export toolbar in Maternity Payment (/maternity-payment), leaving strictly 1 primary Add button in the top breadcrumb header card. Restyled table action buttons into soft, subtle, professional icon badges with light color tints and crisp borders.",
    "descriptionBn": "Maternity Payment (/maternity-payment) à¦ªà§‡à¦œà§‡à¦° à¦Ÿà§�à¦²à¦¬à¦¾à¦° à¦¥à§‡à¦•à§‡ à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ 'Add New' à¦¬à¦¾à¦Ÿà¦¨à¦Ÿà¦¿ à¦¸à¦°à¦¿à¦¯à¦¼à§‡ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° à¦‰à¦ªà¦°à§‡ à¦®à§‚à¦² à¦¹à§‡à¦¡à¦¾à¦°à§‡ à§§ à¦Ÿà¦¿ à¦…à§�à¦¯à¦¾à¦¡ à¦¬à¦¾à¦Ÿà¦¨ à¦°à¦¾à¦–à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦Ÿà§‡à¦¬à¦¿à¦²à§‡à¦° à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦Ÿà¦¨à¦—à§�à¦²à§‹à¦•à§‡ à¦¸à§‹à¦¬à¦¾à¦°, à¦¸à¦«à¦Ÿ à¦�à¦¬à¦‚ à¦®à¦¾à¦°à§�à¦œà¦¿à¦¤ à¦¬à§�à¦¯à¦¾à¦•à¦—à§�à¦°à¦¾à¦‰à¦¨à§�à¦¡ à¦Ÿà¦¿à¦¨à§�à¦Ÿ à¦“ à¦¬à¦°à§�à¦¡à¦¾à¦° à¦¦à¦¿à¦¯à¦¼à§‡ à¦¨à¦¤à§�à¦¨à¦­à¦¾à¦¬à§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "329",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Leave (Maternity Leave)",
    "link": "/maternity-leave",
    "descriptionEn": "Relocated the 'Load 3-Month Salary History' button to a dedicated bottom-right footer row inside the top Configurator Card in Maternity Leave (/maternity-leave), improving card symmetry and form visual hierarchy.",
    "descriptionBn": "Maternity Leave (/maternity-leave) à¦ªà§‡à¦œà§‡à¦° à¦‰à¦ªà¦°à§‡à¦¬ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦Ÿà¦° à¦•à¦¾à¦°à§�à¦¡à§‡à¦° à¦¡à¦¾à¦¨ à¦ªà¦¾à¦¶à§‡à¦° à¦¨à¦¿à¦šà§‡ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à¦«à§�à¦Ÿà¦¾à¦° à¦¸à§‡à¦¶à¦¨à§‡ 'Load 3-Month Salary History' à¦¬à¦¾à¦Ÿà¦¨à¦Ÿà¦¿ à¦¸à¦°à¦¿à§Ÿà§‡ à¦ªà§‡à¦œà§‡à¦° à¦­à¦¿à¦œà§�à¦¯à§�à§Ÿà¦¾à¦² à¦…à§�à¦¯à¦¾à¦²à¦¾à¦‡à¦¨à¦®à§‡à¦¨à§�à¦Ÿ à¦¸à§�à¦¨à§�à¦¦à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "328",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Leave (Maternity Leave)",
    "link": "/maternity-leave",
    "descriptionEn": "Realigned the Maternity Leave (/maternity-leave) configurator form controls into a clean, balanced 2-column grid and pre-populated 3 full months of realistic salary history demo data by default (Basic, Houserent, Medical, Conveyance, Present/Absence days, OT Hours, Wages Payable, and Net Wages) with a light-blue table header and summary totals row.",
    "descriptionBn": "Maternity Leave (/maternity-leave) à¦ªà§‡à¦œà§‡à¦° à¦«à¦°à§�à¦® à¦«à¦¿à¦²à§�à¦¡à¦—à§�à¦²à§‹à¦•à§‡ à§¨-à¦•à¦²à¦¾à¦®à§‡à¦° à¦•à§�à¦²à¦¿à¦¨ à¦—à§�à¦°à¦¿à¦¡à§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¡à¦¿à¦«à¦²à§�à¦Ÿà¦­à¦¾à¦¬à§‡ à§© à¦®à¦¾à¦¸à§‡à¦° à¦ªà§‚à¦°à§�à¦£à¦¾à¦™à§�à¦— à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¹à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦¡à§‡à¦®à§‹ à¦¡à¦¾à¦Ÿà¦¾ (à¦®à§Œà¦²à¦¿à¦• à¦¬à§‡à¦¤à¦¨, à¦¬à¦¾à¦¡à¦¼à¦¿ à¦­à¦¾à¦¡à¦¼à¦¾, à¦šà¦¿à¦•à¦¿à§Žà¦¸à¦¾, à¦¯à¦¾à¦¤à¦¾à¦¯à¦¼à¦¾à¦¤, à¦“à¦­à¦¾à¦°à¦Ÿà¦¾à¦‡à¦®, à¦…à¦°à§�à¦œà¦¿à¦¤ à¦®à¦œà§�à¦°à§€) à¦“ à¦²à¦¾à¦‡à¦Ÿ-à¦¬à§�à¦²à§� à¦Ÿà§‡à¦¬à¦¿à¦² à¦¹à§‡à¦¡à¦¾à¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "327",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Leave (Maternity Payment)",
    "link": "/maternity-payment",
    "descriptionEn": "Relocated the Add Maternity Payment record trigger from the bottom-right floating button to top header positions ('+ Add New Maternity Payment' button in breadcrumb header and toolbar) matching other standard HRIS module pages.",
    "descriptionBn": "Maternity Payment à¦ªà§‡à¦œà§‡à¦° à¦¨à¦¿à¦šà§‡ à¦¥à¦¾à¦•à¦¾ à¦­à¦¾à¦¸à¦®à¦¾à¦¨ à¦ªà§�à¦²à¦¾à¦¸ à¦¬à¦¾à¦Ÿà¦¨à¦Ÿà¦¿ à¦¸à¦°à¦¿à¦¯à¦¼à§‡ à¦¦à¦¿à¦¯à¦¼à§‡ à¦…à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¯ à¦ªà§‡à¦œà§‡à¦° à¦®à¦¤à§‹ à¦‰à¦ªà¦°à§‡ à¦¹à§‡à¦¡à¦¾à¦°à§‡ à¦“ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦¾à¦°à§‡ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² '+ Add New Maternity Payment' à¦¬à¦¾à¦Ÿà¦¨ à¦¸à§�à¦¥à¦¾à¦ªà¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "326",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Leave (Maternity Payment)",
    "link": "/maternity-payment",
    "descriptionEn": "Refined the View / Actions column in Maternity Payment (/maternity-payment) by removing redundant search icons and standardizing 4 sleek professional action buttons per row: 1st Payment Bill (Indigo FileText icon), 2nd Payment Bill (Rose FileCheck icon), Edit Record (Amber Pencil icon), and Delete Record (Crimson Trash icon) with clear Bengali & English tooltips.",
    "descriptionBn": "Maternity Payment à¦ªà§‡à¦œà§‡à¦° à¦Ÿà§‡à¦¬à¦¿à¦² à¦¥à§‡à¦•à§‡ à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ à§¨ à¦Ÿà¦¿ à¦¸à¦¾à¦°à§�à¦š à¦†à¦‡à¦•à¦¨ à¦¸à¦°à¦¿à¦¯à¦¼à§‡ à¦«à§‡à¦²à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à§ª à¦Ÿà¦¿ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦Ÿà¦¨ à¦°à¦¾à¦–à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à§§à¦® à¦•à¦¿à¦¸à§�à¦¤à¦¿ à¦¬à¦¿à¦² (Indigo FileText), à§¨à¦¯à¦¼ à¦•à¦¿à¦¸à§�à¦¤à¦¿ à¦¬à¦¿à¦² (Rose FileCheck), à¦¸à¦®à§�à¦ªà¦¾à¦¦à¦¨à¦¾ (Amber Edit), à¦�à¦¬à¦‚ à¦®à§�à¦›à§‡ à¦«à§‡à¦²à§�à¦¨ (Crimson Trash) â€” à¦¯à¦¾ à¦Ÿà§�à¦²à¦Ÿà¦¿à¦ª à¦“ à¦®à¦¾à¦°à§�à¦œà¦¿à¦¤ à¦•à¦¾à¦²à¦¾à¦° à¦ªà§�à¦¯à¦¾à¦²à§‡à¦Ÿ à¦¦à¦¿à¦¯à¦¼à§‡ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "325",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Leave (Maternity Payment Report)",
    "link": "/maternity-payment-report",
    "descriptionEn": "Added a new 'Maternity Payment Report' sub-menu under the Leave module and created the Maternity Payment Report page (/maternity-payment-report). Features include Date range searching, Department and Section filters, summary metric cards (1st/2nd Payment totals and beneficiary counts), light-blue report table, real-time search, and Excel/PDF/Print exports.",
    "descriptionBn": "Leave à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦¨à¦¤à§�à¦¨ 'Maternity Payment Report' à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦®à§‡à¦Ÿà¦¾à¦°à¦¨à¦¿à¦Ÿà¦¿ à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦œ (/maternity-payment-report) à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦¤à¦¾à¦°à¦¿à¦–à§‡à¦° à¦¸à§€à¦®à¦¾ à¦¨à¦¿à¦°à§�à¦¬à¦¾à¦šà¦¨, à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦“ à¦¸à§‡à¦•à¦¶à¦¨ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦®à§‡à¦Ÿà§�à¦°à¦¿à¦• à¦•à¦¾à¦°à§�à¦¡ (à§§à¦® à¦“ à§¨à§Ÿ à¦•à¦¿à¦¸à§�à¦¤à¦¿à¦° à¦®à§‹à¦Ÿ à¦Ÿà¦¾à¦•à¦¾ à¦“ à¦¸à§�à¦¬à¦¿à¦§à¦¾à¦­à§‹à¦—à§€ à¦¸à¦‚à¦–à§�à¦¯à¦¾), à¦²à¦¾à¦‡à¦Ÿ-à¦¬à§�à¦²à§� à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦Ÿà§‡à¦¬à¦¿à¦², à¦‡à¦¨à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦Ÿ à¦¸à¦¾à¦°à§�à¦š à¦�à¦¬à¦‚ Excel/PDF/Print à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦°à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "324",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Leave (Maternity Payment)",
    "link": "/maternity-payment",
    "descriptionEn": "Created official 1st Payment Bill (à¦ªà§�à¦°à¦¥à¦® à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦¬à¦¿à¦²) and 2nd Payment Bill (à¦¦à§�à¦¬à¦¿à¦¤à§€à§Ÿ à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦¬à¦¿à¦²) printable Bengali views for Maternity Payment records. Includes official Pakiza Knit Composite letterhead, employee & bill information, December 2022 salary breakdown table, 112-day benefit calculation formulas with in-words Bengali currency formatting, required attachments checklist, and 7 official signature blocks.",
    "descriptionBn": "à¦®à§‡à¦Ÿà¦¾à¦°à¦¨à¦¿à¦Ÿà¦¿ à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦°à§‡à¦•à¦°à§�à¦¡à§‡à¦° à¦œà¦¨à§�à¦¯ à¦…à¦«à¦¿à¦¸à¦¿à¦¯à¦¼à¦¾à¦² 'à¦ªà§�à¦°à¦¥à¦® à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦¬à¦¿à¦²' à¦�à¦¬à¦‚ 'à¦¦à§�à¦¬à¦¿à¦¤à§€à§Ÿ à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦¬à¦¿à¦²' à¦­à¦¿à¦‰ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦ªà¦¾à¦•à¦¿à¦œà¦¾ à¦¨à§€à¦Ÿ à¦•à¦®à§�à¦ªà§‹à¦œà¦¿à¦Ÿ à¦²à§‡à¦Ÿà¦¾à¦°à¦¹à§‡à¦¡, à¦•à¦°à§�à¦®à§€ à¦“ à¦¬à¦¿à¦² à¦¬à¦¿à¦¬à¦°à¦£à§€, à¦¡à¦¿à¦¸à§‡à¦®à§�à¦¬à¦°-à§¨à§¦à§¨à§¨ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¬à¦¿à¦¬à¦°à¦£à§€ à¦Ÿà§‡à¦¬à¦¿à¦², à§§à§§à§¨ à¦¦à¦¿à¦¨à§‡à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¹à¦¿à¦¸à¦¾à¦¬ à¦“ à¦•à¦¥à¦¾à¦¯à¦¼ à¦Ÿà¦¾à¦•à¦¾ à¦²à§‡à¦–à¦¾, à¦¸à¦‚à¦¯à§�à¦•à§�à¦¤à¦¿ à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦�à¦¬à¦‚ à§­à¦Ÿà¦¿ à¦…à¦«à¦¿à¦¸à¦¿à¦¯à¦¼à¦¾à¦² à¦¸à§�à¦¬à¦¾à¦•à§�à¦·à¦° à¦¬à§�à¦²à¦• à¦°à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "323",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Leave (Maternity Payment)",
    "link": "/maternity-payment",
    "descriptionEn": "Added a new 'Maternity Payment' sub-menu under the Leave module and built the Maternity Payment management registry (/maternity-payment). Features include pre-populated real employee maternity records, Date range searching, live table filtering, Excel/PDF/Print export, floating creation button, interactive Add/Edit/View modal with salary history calculation, and 112/120-day benefit installment summary.",
    "descriptionBn": "Leave à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦¨à¦¤à§�à¦¨ 'Maternity Payment' à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦®à§‡à¦Ÿà¦¾à¦°à¦¨à¦¿à¦Ÿà¦¿ à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦ªà§‡à¦œ (/maternity-payment) à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦•à¦°à§�à¦®à§€à¦¦à§‡à¦° à¦®à§‡à¦Ÿà¦¾à¦°à¦¨à¦¿à¦Ÿà¦¿ à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦°à§‡à¦•à¦°à§�à¦¡ à¦¦à§‡à¦–à¦¾, à¦¤à¦¾à¦°à¦¿à¦– à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à¦¿à¦‚, Excel/PDF/Print à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ, à¦«à§�à¦²à§‹à¦Ÿà¦¿à¦‚ à¦ªà§�à¦²à¦¾à¦¸ à¦¬à¦¾à¦Ÿà¦¨ à¦¦à¦¿à¦¯à¦¼à§‡ à¦¨à¦¤à§�à¦¨ à¦†à¦¬à§‡à¦¦à¦¨ à¦“ à¦�à¦¡à¦¿à¦Ÿ à¦®à§‹à¦¡à¦¾à¦², à§© à¦®à¦¾à¦¸à§‡à¦° à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¹à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦“ à§§à§§à§¨/à§§à§¨à§¦ à¦¦à¦¿à¦¨à§‡à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦•à¦¿à¦¸à§�à¦¤à¦¿ à¦¹à¦¿à¦¸à¦¾à¦¬ à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦°à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "322",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Leave (Maternity Leave)",
    "link": "/maternity-leave",
    "descriptionEn": "Added a new Maternity Leave sub-menu under the Leave module and created the Maternity Leave benefit calculation page (/maternity-leave). Features include 3-month salary history loading, 112-day benefit calculation, 1st and 2nd installment splitting (pre/post-natal), PDF printing, Excel export, and saved application tracking.",
    "descriptionBn": "Leave à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦¨à¦¤à§�à¦¨ 'Maternity Leave' à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦®à§‡à¦Ÿà¦¾à¦°à¦¨à¦¿à¦Ÿà¦¿ à¦²à¦¿à¦­ à¦¬à§‡à¦¨à¦¿à¦«à¦¿à¦Ÿ à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦¶à¦¨ à¦ªà§‡à¦œ (/maternity-leave) à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à§© à¦®à¦¾à¦¸à§‡à¦° à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¹à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦²à§‹à¦¡, à§§à§§à§¨ à¦¦à¦¿à¦¨à§‡à¦° à¦®à¦¾à¦¤à§ƒà¦¤à§�à¦¬à¦•à¦¾à¦²à§€à¦¨ à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¹à¦¿à¦¸à¦¾à¦¬, à§¨ à¦•à¦¿à¦¸à§�à¦¤à¦¿à¦¤à§‡ (à¦ªà§�à¦°à¦¾à¦• à¦“ à¦ªà§�à¦°à¦¸à§‚à¦¤à¦¿ à¦ªà¦°à¦¬à¦°à§�à¦¤à§€) à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦­à¦¾à¦—, PDF à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ, Excel à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦�à¦¬à¦‚ à¦¸à§‡à¦­ à¦•à¦°à¦¾ à¦†à¦¬à§‡à¦¦à¦¨à§‡à¦° à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "321",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Added searchable multi-select dropdown filters for Company and Area to the Employee Doc Verification filter bar. Users can now select one or more companies and areas to narrow down the employee list. Active filters are highlighted in blue and can be cleared individually or all at once via a 'Reset filters' button.",
    "descriptionBn": "Employee Doc Verification à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¬à¦¾à¦°à§‡ Company à¦�à¦¬à¦‚ Area-à¦�à¦° à¦œà¦¨à§�à¦¯ à¦¸à¦¾à¦°à§�à¦šà¦¯à§‹à¦—à§�à¦¯ à¦®à¦¾à¦²à§�à¦Ÿà¦¿-à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦•à¦¾à¦§à¦¿à¦• à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿ à¦¬à¦¾ à¦�à¦°à¦¿à¦¯à¦¼à¦¾ à¦¬à§‡à¦›à§‡ à¦•à¦°à§�à¦®à§€ à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦¸à¦‚à¦•à§€à¦°à§�à¦£ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤ à¦¸à¦•à§�à¦°à¦¿à¦¯à¦¼ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¨à§€à¦² à¦°à¦™à§‡ à¦¹à¦¾à¦‡à¦²à¦¾à¦‡à¦Ÿ à¦¹à¦¯à¦¼ à¦�à¦¬à¦‚ 'Reset filters' à¦¬à¦¾à¦Ÿà¦¨à§‡ à¦•à§�à¦²à¦¿à¦• à¦•à¦°à§‡ à¦¸à¦¬ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦�à¦•à¦¸à¦¾à¦¥à§‡ à¦°à¦¿à¦¸à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¯à¦¾à¦¯à¦¼à¥¤"
  },
  {
    "id": "320",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Removed the redundant 'Reject' button across the Employee Doc Verification module. All document issues (whether rejection or HR escalation) are now handled exclusively through the unified 'Mark as Issue' flow, simplifying the user experience.",
    "descriptionBn": "Employee Doc Verification à¦®à¦¡à¦¿à¦‰à¦² à¦¥à§‡à¦•à§‡ 'Reject' à¦¬à¦¾à¦Ÿà¦¨à¦Ÿà¦¿ à¦¸à¦°à¦¿à¦¯à¦¼à§‡ à¦«à§‡à¦²à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦–à¦¨ à¦¥à§‡à¦•à§‡ à¦¸à¦¬ à¦§à¦°à¦¨à§‡à¦° à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦¸à¦®à¦¸à§�à¦¯à¦¾ à¦¬à¦¾ à¦°à¦¿à¦œà§‡à¦•à¦¶à¦¨ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° 'Mark as Issue' à¦…à¦ªà¦¶à¦¨à§‡à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦ªà¦°à¦¿à¦šà¦¾à¦²à¦¿à¦¤ à¦¹à¦¬à§‡, à¦¯à¦¾ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦¦à§‡à¦° à¦œà¦¨à§�à¦¯ à¦†à¦°à¦“ à¦¸à¦¹à¦œà¥¤"
  },
  {
    "id": "319",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Added a live HR Notification Bell to the Topbar. When a document is flagged with 'Mark as Issue', an instant notification is pushed to HR with the employee name, document title, issue description, and timestamp. Notifications are stored in localStorage, show an unread badge, and can be dismissed individually or cleared all at once.",
    "descriptionBn": "à¦Ÿà¦ªà¦¬à¦¾à¦°à§‡ à¦�à¦•à¦Ÿà¦¿ à¦²à¦¾à¦‡à¦­ HR à¦¨à§‹à¦Ÿà¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦¬à§‡à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ 'Mark as Issue' à¦¦à¦¿à¦²à§‡ à¦¸à¦¾à¦¥à§‡ à¦¸à¦¾à¦¥à§‡ HR-à¦•à§‡ à¦¨à§‹à¦Ÿà¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦¯à¦¾à¦¯à¦¼, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦•à¦°à§�à¦®à§€à¦° à¦¨à¦¾à¦®, à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦¨à¦¾à¦®, à¦¸à¦®à¦¸à§�à¦¯à¦¾à¦° à¦¬à¦¿à¦¬à¦°à¦£ à¦“ à¦¸à¦®à¦¯à¦¼ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¯à¦¼à¥¤ à¦¨à§‹à¦Ÿà¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨à¦—à§�à¦²à§‹ localStorage-à¦� à¦¸à§‡à¦­ à¦¥à¦¾à¦•à§‡, à¦†à¦¨à¦°à¦¿à¦¡ à¦¬à§�à¦¯à¦¾à¦œ à¦¦à§‡à¦–à¦¾à¦¯à¦¼, à¦�à¦¬à¦‚ à¦�à¦•à¦Ÿà¦¿ à¦�à¦•à¦Ÿà¦¿ à¦¬à¦¾ à¦¸à¦¬ à¦�à¦•à¦¸à¦¾à¦¥à§‡ à¦®à§�à¦›à§‡ à¦¦à§‡à¦“à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¯à¦¼à¥¤"
  },
  {
    "id": "318",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Added 'Mark as Issue' button to Employee Doc Verification. Verifiers can now flag a document with a specific issue description (from presets or custom text). Flagged documents show an orange 'Issue Flagged' status pill, display the issue note inline, and offer a 'Re-verify' button to reset the document back to Pending after the employee updates it. The global stats bar now also shows a Flagged count.",
    "descriptionBn": "Employee Doc Verification à¦ªà§‡à¦œà§‡ 'Mark as Issue' à¦¬à¦¾à¦Ÿà¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦­à§‡à¦°à¦¿à¦«à¦¾à¦¯à¦¼à¦¾à¦°à¦°à¦¾ à¦�à¦–à¦¨ à¦�à¦•à¦Ÿà¦¿ à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿà§‡ à¦¸à¦®à¦¸à§�à¦¯à¦¾ à¦šà¦¿à¦¹à§�à¦¨à¦¿à¦¤ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨ â€” à¦ªà§�à¦°à¦¿à¦¸à§‡à¦Ÿ à¦¬à¦¾ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦¬à¦¿à¦¬à¦°à¦£ à¦¦à¦¿à¦¯à¦¼à§‡à¥¤ à¦«à§�à¦²à§�à¦¯à¦¾à¦— à¦•à¦°à¦¾ à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿà§‡ à¦•à¦®à¦²à¦¾ à¦°à¦™à§‡à¦° 'Issue Flagged' à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦“ à¦¸à¦®à¦¸à§�à¦¯à¦¾à¦° à¦¨à§‹à¦Ÿ à¦¦à§‡à¦–à¦¾à¦¬à§‡, à¦�à¦¬à¦‚ à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦¹à¦²à§‡ 'Re-verify' à¦¬à¦¾à¦Ÿà¦¨ à¦¦à¦¿à¦¯à¦¼à§‡ à¦†à¦¬à¦¾à¦° Pending-à¦� à¦«à§‡à¦°à¦¾à¦¨à§‹ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "317",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "SSP Modals",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Added a checkmark icon to the Serial Number (SL) column in both Leave Application and Group Leave Application modal tables.",
    "descriptionBn": "à¦²à¦¿à¦­ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦�à¦¬à¦‚ à¦—à§�à¦°à§�à¦ª à¦²à¦¿à¦­ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦®à¦¡à¦¾à¦²à§‡à¦° à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ à¦¸à¦¿à¦°à¦¿à§Ÿà¦¾à¦² à¦¨à¦®à§�à¦¬à¦° (SL) à¦•à¦²à¦¾à¦®à§‡ à¦�à¦•à¦Ÿà¦¿ à¦šà§‡à¦•à¦®à¦¾à¦°à§�à¦• à¦†à¦‡à¦•à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "316",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "General Product Store Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Added a Revision Count indicator alongside the Application Number in the General Product Store Requisition modal header.",
    "descriptionBn": "à¦œà§‡à¦¨à¦¾à¦°à§‡à¦² à¦ªà§�à¦°à§‹à¦¡à¦¾à¦•à§�à¦Ÿ à¦¸à§�à¦Ÿà§‹à¦° à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦®à¦¡à¦¾à¦²à§‡à¦° à¦¹à§‡à¦¡à¦¾à¦°à§‡ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦¨à¦®à§�à¦¬à¦°à§‡à¦° à¦ªà¦¾à¦¶à§‡ à¦°à¦¿à¦­à¦¿à¦¶à¦¨ à¦•à¦¾à¦‰à¦¨à§�à¦Ÿ à¦¨à¦¿à¦°à§�à¦¦à§‡à¦¶à¦• à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "315",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "General Product Store Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Redesigned the General Product Store Requisition detail view modal using the premium LeaveApplicationModal framework layout, featuring the custom items checkmarked list table shown in the design mockup.",
    "descriptionBn": "à¦œà§‡à¦¨à¦¾à¦°à§‡à¦² à¦ªà§�à¦°à§‹à¦¡à¦¾à¦•à§�à¦Ÿ à¦¸à§�à¦Ÿà§‹à¦° à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦² à¦­à¦¿à¦‰ à¦®à¦¡à¦¾à¦²à¦Ÿà¦¿ à¦ªà§�à¦°à¦¿à¦®à¦¿à§Ÿà¦¾à¦® à¦²à¦¿à¦­ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦®à¦¡à¦¾à¦² à¦²à§‡à¦†à¦‰à¦Ÿà§‡à¦° à¦†à¦¦à¦²à§‡ à¦¨à¦¤à§�à¦¨ à¦•à¦°à§‡ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦�à¦¬à¦‚ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦†à¦‡à¦Ÿà§‡à¦® à¦Ÿà§‡à¦¬à¦¿à¦²à¦Ÿà¦¿ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿ à¦®à§‹à¦•à¦¾à¦†à¦ªà§‡à¦° à¦šà§‡à¦•à¦®à¦¾à¦°à§�à¦• à¦²à¦¿à¦¸à§�à¦Ÿ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "314",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Group Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Re-added the Requester avatar image to the Requester Details section in the Group Leave Application modal, formatted identically to the standard Employee Details layout.",
    "descriptionBn": "à¦—à§�à¦°à§�à¦ª à¦²à¦¿à¦­ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦®à¦¡à¦¾à¦²à§‡à¦° 'Requester Details' à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦†à¦¬à§‡à¦¦à¦¨à¦•à¦¾à¦°à§€à¦° à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦›à¦¬à¦¿ à¦ªà§�à¦¨à¦°à¦¾à§Ÿ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾ à¦¸à¦¾à¦§à¦¾à¦°à¦£ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à§€ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦²à§‡à¦†à¦‰à¦Ÿà§‡à¦° à¦…à¦¨à§�à¦°à§‚à¦ªà¥¤"
  },
  {
    "id": "313",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Group Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Renamed the combined details card in the Group Leave Application Modal to 'Requester Details' and updated the field list to match the requested items, including custom label alignment width.",
    "descriptionBn": "à¦—à§�à¦°à§�à¦ª à¦²à¦¿à¦­ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦®à¦¡à¦¾à¦²à§‡à¦° à¦•à¦®à§�à¦¬à¦¾à¦‡à¦¨à§�à¦¡ à¦•à¦¾à¦°à§�à¦¡à§‡à¦° à¦¨à¦¾à¦® à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ 'Requester Details' à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦²à§‡à¦¬à§‡à¦²à¦—à§�à¦²à§‹à¦° à¦ªà§�à¦°à¦¸à§�à¦¥ à¦¸à¦®à¦¨à§�à¦¬à¦¯à¦¼ à¦•à¦°à§‡ à¦¨à¦¤à§�à¦¨ à¦«à¦¿à¦²à§�à¦¡à¦—à§�à¦²à§‹à¦° à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "312",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Group Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Combined the Requester and Request For panels in the Group Leave Application details modal into a single Employee Details section without an avatar image, aligning with the default Employee Details layout.",
    "descriptionBn": "à¦—à§�à¦°à§�à¦ª à¦²à¦¿à¦­ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦®à¦¡à¦¾à¦²à§‡ à¦°à¦¿à¦•à§‹à§Ÿà§‡à¦¸à§�à¦Ÿà¦¾à¦° à¦�à¦¬à¦‚ à¦°à¦¿à¦•à§‹à§Ÿà§‡à¦¸à§�à¦Ÿ à¦«à¦° à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦² à¦¦à§�à¦Ÿà¦¿à¦•à§‡ à¦�à¦•à¦Ÿà¦¿ à¦�à¦•à¦• à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à§€ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ (à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦›à¦¬à¦¿ à¦›à¦¾à§œà¦¾), à¦¯à¦¾ à¦¸à¦¾à¦§à¦¾à¦°à¦£ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à§€ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦²à§‡à¦†à¦‰à¦Ÿà§‡à¦° à¦…à¦¨à§�à¦°à§‚à¦ªà¥¤"
  },
  {
    "id": "311",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Group Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Created and integrated the Group Leave Application Modal on the My Requisitions page, featuring a dual-panel Requester/Request For header layout and a comprehensive table displaying all leave member requests.",
    "descriptionBn": "à¦®à¦¾à¦‡ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦ªà§‡à¦œà§‡ à¦—à§�à¦°à§�à¦ª à¦²à¦¿à¦­ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦®à¦¡à¦¾à¦² à¦¤à§ˆà¦°à¦¿ à¦�à¦¬à¦‚ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦°à¦¿à¦•à§‹à§Ÿà§‡à¦¸à§�à¦Ÿà¦¾à¦° à¦“ à¦°à¦¿à¦•à§‹à§Ÿà§‡à¦¸à§�à¦Ÿ à¦«à¦° à¦¸à§‡à¦•à¦¶à¦¨à¦—à§�à¦²à§‹à¦° à¦¡à§�à§Ÿà¦¾à¦²-à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦² à¦²à§‡à¦†à¦‰à¦Ÿ à¦�à¦¬à¦‚ à¦¸à¦•à¦² à¦•à¦°à§�à¦®à¦šà¦¾à¦°à§€à¦° à¦›à§�à¦Ÿà¦¿à¦° à¦†à¦¬à§‡à¦¦à¦¨à§‡à¦° à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² à¦…à¦¨à§�à¦¤à¦°à§�à¦­à§�à¦•à§�à¦¤ à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "310",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Updated the Employee Details avatar image height to exactly 91px as requested.",
    "descriptionBn": "à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à§€ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦•à¦°à§�à¦®à¦šà¦¾à¦°à§€à¦° à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦›à¦¬à¦¿à¦° à¦‰à¦šà§�à¦šà¦¤à¦¾ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ 91 à¦ªà¦¿à¦•à§�à¦¸à§‡à¦² à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "309",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Reduced horizontal column gap inside Employee Details section and corrected vertical top-alignment of the avatar image with the details grid.",
    "descriptionBn": "à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à§€ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦•à¦²à¦¾à¦®à¦—à§�à¦²à§‹à¦° à¦®à¦§à§�à¦¯à¦¬à¦°à§�à¦¤à§€ à¦–à¦¾à¦²à¦¿ à¦œà¦¾à§Ÿà¦—à¦¾ à¦•à¦®à¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦•à¦°à§�à¦®à¦šà¦¾à¦°à§€à¦° à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦›à¦¬à¦¿à¦° à¦¸à¦¾à¦¥à§‡ à¦¡à¦¾à¦¨à¦ªà¦¾à¦¶à§‡à¦° à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦—à§�à¦°à¦¿à¦¡à§‡à¦° à¦‰à¦²à§�à¦²à¦®à§�à¦¬ à¦¸à¦¾à¦°à¦¿à¦¬à¦¦à§�à¦§à¦¤à¦¾ (vertical alignment) à¦ à¦¿à¦• à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "308",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Increased Dialog content maximum width size from max-w-5xl to max-w-7xl, shortened details table headers to their short-form titles (e.g., DUR., ENJ. / BAL., DOCS) and enforced single-line rendering.",
    "descriptionBn": "à¦²à¦¿à¦­ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦®à¦¡à¦¾à¦²à§‡à¦° à¦¸à¦°à§�à¦¬à§‹à¦šà§�à¦š à¦‰à¦‡à¦¡à¦¥ à¦¬à¦¾à§œà¦¿à§Ÿà§‡ max-w-7xl à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦�à¦¬à¦‚ à¦•à¦²à¦¾à¦® à¦Ÿà¦¾à¦‡à¦Ÿà§‡à¦²à¦—à§�à¦²à§‹ à¦¸à¦‚à¦•à§�à¦·à¦¿à¦ªà§�à¦¤ à¦†à¦•à¦¾à¦°à§‡ (à¦¯à§‡à¦®à¦¨: DUR., ENJ. / BAL., DOCS) à¦ªà§�à¦°à¦•à¦¾à¦¶ à¦•à¦°à§‡ à¦�à¦• à¦²à¦¾à¦‡à¦¨à§‡ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¨à§‡à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "307",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Optimized Leave Requisition modal table layout to fit all columns inside the grid without horizontal scrolling by wrapping text and stacking Date Range vertically.",
    "descriptionBn": "à¦²à¦¿à¦­ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦®à¦¡à¦¾à¦²à§‡à¦° à¦Ÿà§‡à¦¬à¦¿à¦² à¦²à§‡à¦†à¦‰à¦Ÿ à¦…à¦ªà§�à¦Ÿà¦¿à¦®à¦¾à¦‡à¦œ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦•à§‹à¦¨ à¦¹à¦°à¦¿à¦œà¦¨à§�à¦Ÿà¦¾à¦² à¦¸à§�à¦•à§�à¦°à¦² à¦›à¦¾à§œà¦¾à¦‡ à¦•à¦¨à§�à¦Ÿà§‡à¦¨à§�à¦Ÿ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à§Ÿà¥¤ à¦�à¦° à¦œà¦¨à§�à¦¯ à¦¡à§‡à¦Ÿ à¦°à§‡à¦žà§�à¦œ à¦­à¦¾à¦°à§�à¦Ÿà¦¿à¦•à§�à¦¯à¦¾à¦²à¦¿ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦°â€�à§�à¦¯à¦¾à¦ªà¦¿à¦‚ à¦¸à¦•à§�à¦°à¦¿à§Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "306",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Moved Contact and Responsible fields from the Leave Balance Table to the Employee Details card section of the Leave Requisition modal.",
    "descriptionBn": "à¦²à¦¿à¦­ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦®à¦¡à¦¾à¦²à§‡à¦° à¦²à¦¿à¦­ à¦¬à§�à¦¯à¦¾à¦²à§‡à¦¨à§�à¦¸ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¥à§‡à¦•à§‡ à¦•à¦¨à§�à¦Ÿà¦¾à¦•à§�à¦Ÿ à¦�à¦¬à¦‚ à¦°à§‡à¦¸à¦ªà¦¨à¦¸à¦¿à¦¬à¦² à¦«à¦¿à¦²à§�à¦¡ à¦¦à§�à¦Ÿà¦¿à¦•à§‡ à¦¸à¦°à¦¿à§Ÿà§‡ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à§€ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦•à¦¾à¦°à§�à¦¡ à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦¸à§�à¦¥à¦¾à¦¨à¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "305",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Added Employee Avatar Image inside the Employee Details section of the Leave Application Details modal.",
    "descriptionBn": "à¦²à¦¿à¦­ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦®à¦¡à¦¾à¦²à§‡à¦° à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à§€ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦•à¦°à§�à¦®à¦šà¦¾à¦°à§€à¦° à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦›à¦¬à¦¿ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "304",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Updated Leave Application Details modal on the My Requisitions page to render Employee Details and Leave Details side-by-side using the same clean, bordered card styling with inline labels and bold values.",
    "descriptionBn": "à¦®à¦¾à¦‡ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦ªà§‡à¦œà§‡à¦° à¦²à¦¿à¦­ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦®à¦¡à¦¾à¦²à¦Ÿà¦¿à¦° à¦²à§‡à¦†à¦‰à¦Ÿ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦–à¦¨ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦�à¦¬à¦‚ à¦²à¦¿à¦­ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦¸à§‡à¦•à¦¶à¦¨ à¦¦à§�à¦Ÿà¦¿ à¦ªà¦¾à¦¶à¦¾à¦ªà¦¾à¦¶à¦¿ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à¦¬à§‡ à¦�à¦¬à¦‚ à¦‰à¦­à§Ÿ à¦¸à§‡à¦•à¦¶à¦¨à§‡à¦‡ à¦�à¦•à¦‡ à¦°à¦•à¦® à¦•à¦¾à¦°à§�à¦¡ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦“ à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ à¦²à§‡à¦¬à§‡à¦² à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "303",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Allowance Requisition",
    "link": "/allowance-requisition",
    "descriptionEn": "Created the new Allowance Requisition menu under Manage Allowance, featuring dynamic search parameters (Start/End date, Employee, Dept, Unit, Line), select-all list checkboxes, inline OT inputs editing, a batch assignment panel to configure selected records, CSV export, print layout styling, and list submission.",
    "descriptionBn": "à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œ à¦…à§�à¦¯à¦¾à¦²à¦¾à¦‰à¦¨à§�à¦¸à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦¨à¦¤à§�à¦¨ 'Allowance Requisition' à¦®à§‡à¦¨à§� à¦“ à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦°à§Ÿà§‡à¦›à§‡ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦• à¦¸à¦¾à¦°à§�à¦š à¦ªà§�à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦° (à¦¶à§�à¦°à§�/à¦¶à§‡à¦· à¦¤à¦¾à¦°à¦¿à¦–, à¦•à¦°à§�à¦®à¦šà¦¾à¦°à§€, à¦¬à¦¿à¦­à¦¾à¦—, à¦‡à¦‰à¦¨à¦¿à¦Ÿ, à¦²à¦¾à¦‡à¦¨), à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ-à¦…à¦² à¦šà§‡à¦•à¦¬à¦•à§�à¦¸, à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ à¦“à¦­à¦¾à¦°à¦Ÿà¦¾à¦‡à¦® à¦‡à¦¨à¦ªà§�à¦Ÿ à¦�à¦¡à¦¿à¦Ÿà¦°, à¦¨à¦¿à¦°à§�à¦¬à¦¾à¦šà¦¿à¦¤ à¦°à§‡à¦•à¦°à§�à¦¡à§‡à¦° à¦®à¦¾à¦¨ à¦�à¦•à¦¬à¦¾à¦°à§‡ à¦¸à§‡à¦Ÿ à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦¬à§�à¦¯à¦¾à¦š à¦…à§�à¦¯à¦¾à¦¸à¦¾à¦‡à¦¨à¦®à§‡à¦¨à§�à¦Ÿ à¦®à§‹à¦¡à¦¾à¦², à¦�à¦•à§�à¦¸à§‡à¦² à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ, à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦“ à¦¸à¦¾à¦¬à¦®à¦¿à¦¶à¦¨ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨à¥¤"
  },
  {
    "id": "302",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Reordered the columns in the Leave Application details table and combined the Enjoyed and Balance fields into a single 'ENJOYED / BAL' column.",
    "descriptionBn": "à¦²à¦¿à¦­ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦Ÿà§‡à¦¬à¦¿à¦²à§‡à¦° à¦•à¦²à¦¾à¦®à¦—à§�à¦²à§‹à¦° à¦•à§�à¦°à¦® à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦�à¦¨à¦œà§Ÿà§‡à¦¡ à¦“ à¦¬à§�à¦¯à¦¾à¦²à§‡à¦¨à§�à¦¸ à¦«à¦¿à¦²à§�à¦¡ à¦¦à§�à¦Ÿà¦¿à¦•à§‡ à¦�à¦•à¦¤à§�à¦°à¦¿à¦¤ à¦•à¦°à§‡ à¦�à¦•à¦Ÿà¦¿ à¦�à¦•à¦• à¦•à¦²à¦¾à¦® à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "301",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Applied fixed-width alignment to all entry labels within the Employee Details and Leave Details cards of the Leave Application Details modal, ensuring that all data values are perfectly aligned in a uniform vertical column.",
    "descriptionBn": "à¦²à¦¿à¦­ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦®à¦¡à¦¾à¦²à§‡à¦° à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à§€ à¦“ à¦²à¦¿à¦­ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦•à¦¾à¦°à§�à¦¡à§‡à¦° à¦­à§‡à¦¤à¦°à§‡à¦° à¦¸à¦•à¦² à¦²à§‡à¦¬à§‡à¦²à§‡à¦° à¦œà¦¨à§�à¦¯ à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ à¦ªà§�à¦°à¦¸à§�à¦¥ (fixed width) à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦«à¦²à§‡ à¦¸à¦¬à¦—à§�à¦²à§‹ à¦¡à§‡à¦Ÿà¦¾ à¦­à§�à¦¯à¦¾à¦²à§� à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦¨à§�à¦¦à¦°, à¦¸à§‹à¦œà¦¾ à¦•à¦²à¦¾à¦®à§‡ à¦¸à¦¾à¦°à¦¿à¦¬à¦¦à§�à¦§à¦­à¦¾à¦¬à§‡ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à¦šà§�à¦›à§‡à¥¤"
  },
  {
    "id": "300",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Updated Employee Details and Leave Details grids inside the Leave Application Details modal to be single-column. This left-aligns all entry fields sequentially to prevent text wrapping of long values while preserving the vertical row spacing.",
    "descriptionBn": "à¦²à¦¿à¦­ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦®à¦¡à¦¾à¦²à§‡à¦° à¦­à§‡à¦¤à¦°à§‡ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à§€ à¦“ à¦²à¦¿à¦­ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸à§‡à¦° à¦—à§�à¦°à¦¿à¦¡ à¦²à§‡à¦†à¦‰à¦Ÿ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ à¦¸à¦¿à¦™à§�à¦—à§‡à¦²-à¦•à¦²à¦¾à¦® à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦° à¦«à¦²à§‡ à¦¸à¦¬ à¦¤à¦¥à§�à¦¯ à¦¬à¦¾à¦® à¦ªà¦¾à¦¶à§‡ à¦¸à¦¾à¦°à¦¿à¦¬à¦¦à§�à¦§à¦­à¦¾à¦¬à§‡ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à¦¬à§‡, à¦¯à¦¾ à¦¬à§œ à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦²à¦¾à¦‡à¦¨à§‡à¦° à¦°à§‡à¦¨à§�à¦¡à¦¾à¦°à¦¿à¦‚ à¦‰à¦¨à§�à¦¨à¦¤ à¦•à¦°à§‡à¥¤"
  },
  {
    "id": "299",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "JD List",
    "link": "/jd-list",
    "descriptionEn": "Made the Edit functionality fully functional on the JD List page. Users can now edit details of existing Job Descriptions (such as department, designation, reports to, key responsibilities, and qualifications) in the same modal interface with pre-filled inputs.",
    "descriptionBn": "à¦œà§‡à¦¡à¦¿ (JD) à¦²à¦¿à¦¸à§�à¦Ÿ à¦ªà§‡à¦œà§‡ à¦�à¦¡à¦¿à¦Ÿ à¦…à¦ªà¦¶à¦¨à¦Ÿà¦¿à¦•à§‡ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¸à¦šà¦² à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦°à¦¾ à¦�à¦–à¦¨ à¦�à¦•à¦‡ à¦®à¦¡à¦¾à¦² à¦‰à¦‡à¦¨à§�à¦¡à§‹à¦¤à§‡ à¦¬à¦¿à¦¦à§�à¦¯à¦®à¦¾à¦¨ à¦¤à¦¥à§�à¦¯à¦—à§�à¦²à§‹ à¦ªà§�à¦°à¦¿-à¦«à¦¿à¦²à¦¡ à¦…à¦¬à¦¸à§�à¦¥à¦¾à§Ÿ à¦ªà§‡à§Ÿà§‡ à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦¤à¦¥à§�à¦¯ (à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ, à¦¡à§‡à¦œà¦¿à¦—à¦¨à§‡à¦¶à¦¨, à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦Ÿà§�, à¦®à§‚à¦² à¦¦à¦¾à§Ÿà¦¿à¦¤à§�à¦¬à¦¸à¦®à§‚à¦¹ à¦�à¦¬à¦‚ à¦¶à¦¿à¦•à§�à¦·à¦¾à¦—à¦¤ à¦¯à§‹à¦—à§�à¦¯à¦¤à¦¾) à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "298",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Salary Sheet (Exec)",
    "link": "/salary-sheet-exec",
    "descriptionEn": "Created the Salary Sheet (Exec) landscape print report layout with 31 specific columns mapped precisely from the provided reference. Wired it to the Salary Sheet (Exec) button.",
    "descriptionBn": "à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦¥à§‡à¦•à§‡ 31 à¦Ÿà¦¿ à¦•à¦²à¦¾à¦® à¦¸à§�à¦ªà§‡à¦¸à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¶à¦¿à¦Ÿ (Exec) à¦²à§�à¦¯à¦¾à¦¨à§�à¦¡à¦¸à§�à¦•à§‡à¦ª à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦²à§‡à¦†à¦‰à¦Ÿ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦�à¦Ÿà¦¿à¦•à§‡ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¶à¦¿à¦Ÿ (Exec) à¦¬à¦¾à¦Ÿà¦¨à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "297",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Bank Sheet (Exec)",
    "link": "/bank-sheet-exec",
    "descriptionEn": "Created the Bank Sheet (Exec) portrait print report layout matching the provided layout and wired it to the Bank Sheet (Exec) button in the Advanced Report Actions.",
    "descriptionBn": "à¦¬à§�à¦¯à¦¾à¦‚à¦• à¦¶à¦¿à¦Ÿ (Exec) à¦ªà§‹à¦°à§�à¦Ÿà§�à¦°à§‡à¦Ÿ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦²à§‡à¦†à¦‰à¦Ÿ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦�à¦Ÿà¦¿à¦•à§‡ à¦…à§�à¦¯à¦¾à¦¡à¦­à¦¾à¦¨à§�à¦¸à¦¡ à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¸à§‡à¦•à¦¶à¦¨à§‡à¦° à¦¬à§�à¦¯à¦¾à¦‚à¦• à¦¶à¦¿à¦Ÿ (Exec) à¦¬à¦¾à¦Ÿà¦¨à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "296",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Salary Sheet Full (Without Holiday)",
    "link": "/salary-sheet-full-without-holiday",
    "descriptionEn": "Created Salary Sheet Full (Without Holiday) report layout by mapping to the exact 30-column screenshot specification, omitting the Holiday column. Linked the report to the corresponding button in the Advance Report Actions section.",
    "descriptionBn": "à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿà§‡à¦° 30-à¦•à¦²à¦¾à¦® à¦¸à§�à¦ªà§‡à¦¸à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦¹à¦²à¦¿à¦¡à§‡ à¦•à¦²à¦¾à¦® à¦¬à¦¾à¦¦ à¦¦à¦¿à§Ÿà§‡ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¶à¦¿à¦Ÿ à¦«à§�à¦² (à¦‰à¦‡à¦¦à¦¾à¦‰à¦Ÿ à¦¹à¦²à¦¿à¦¡à§‡) à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦²à§‡à¦†à¦‰à¦Ÿ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦�à¦Ÿà¦¿à¦•à§‡ à¦¸à¦‚à¦¶à§�à¦²à¦¿à¦·à§�à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "295",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Salary Sheet Full (WH)",
    "link": "/salary-sheet-full-wh",
    "descriptionEn": "Created Salary Sheet Full (WH) report layout based on the exact screenshot specifications and wired it to the Salary Sheet Full(WH) button.",
    "descriptionBn": "à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿà§‡à¦° à¦¸à§�à¦ªà§‡à¦¸à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¶à¦¿à¦Ÿ à¦«à§�à¦² (WH) à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦²à§‡à¦†à¦‰à¦Ÿ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦�à¦Ÿà¦¿à¦•à§‡ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¶à¦¿à¦Ÿ à¦«à§�à¦² (WH) à¦¬à¦¾à¦Ÿà¦¨à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "294",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "OT Sheet (Holiday)",
    "link": "/ot-sheet-holiday",
    "descriptionEn": "Created OT Sheet(Holiday) report with custom landscape layout and dynamic column grouping mapping to the provided screenshot structure. Wired it to the OT Sheet(Holiday) button in the Monthly Salary Details portal.",
    "descriptionBn": "à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿà§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦®à¦¿à¦² à¦°à§‡à¦–à§‡ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦²à§�à¦¯à¦¾à¦¨à§�à¦¡à¦¸à§�à¦•à§‡à¦ª à¦²à§‡à¦†à¦‰à¦Ÿ à¦�à¦¬à¦‚ à¦¡à¦¾à¦¯à¦¼à¦¨à¦¾à¦®à¦¿à¦• à¦•à¦²à¦¾à¦® à¦—à§�à¦°à§�à¦ªà¦¿à¦‚ à¦¸à¦¹ OT Sheet (Holiday) à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦®à¦¾à¦¸à¦¿à¦• à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦ªà§‹à¦°à§�à¦Ÿà¦¾à¦²à§‡ à¦¬à¦¾à¦Ÿà¦¨à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "293",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Cash Sheet (Exec)",
    "link": "/cash-sheet-print",
    "descriptionEn": "Added a portrait-oriented printable A4 Cash Payment Sheet report route (/cash-sheet-print) for the Payroll module, mapping exactly to reference mockups and wired to the Cash Sheet (Exec) button.",
    "descriptionBn": "à¦ªà§‡-à¦°à§‹à¦² à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦œà¦¨à§�à¦¯ à¦�à¦•à¦Ÿà¦¿ à¦ªà§‹à¦°à§�à¦Ÿà§�à¦°à§‡à¦Ÿ-à¦“à¦°à¦¿à¦¯à¦¼à§‡à¦¨à§�à¦Ÿà§‡à¦¡ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿà¦¯à§‹à¦—à§�à¦¯ A4 à¦•à§�à¦¯à¦¾à¦¶ à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦¶à¦¿à¦Ÿ à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦°à¦¾à¦‰à¦Ÿ (/cash-sheet-print) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦�à¦Ÿà¦¿ à¦•à§�à¦¯à¦¾à¦¶ à¦¶à¦¿à¦Ÿ (Exec) à¦¬à¦¾à¦Ÿà¦¨à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à¦‚à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "292",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Dept. wise Salary Sheet",
    "link": "/dept-wise-salary-sheet",
    "descriptionEn": "Added Department wise salary sheet print view with chunking by department and employee type, matching the PDF format.",
    "descriptionBn": "à¦ªà¦¿à¦¡à¦¿à¦�à¦« à¦«à¦°à¦®à§�à¦¯à¦¾à¦Ÿà§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦®à¦¿à¦² à¦°à§‡à¦–à§‡ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦�à¦¬à¦‚ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à§€ à¦Ÿà¦¾à¦‡à¦ª à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦šà¦¾à¦™à§�à¦•à¦¿à¦‚ à¦¸à¦¹ à¦¬à¦¿à¦­à¦¾à¦— à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦¬à§‡à¦¤à¦¨ à¦¶à¦¿à¦Ÿ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "291",
    "date": "2026-09-14T10:30",
    "type": "Bug Fix",
    "module": "Monthly Salary Sheet Print",
    "link": "/salary-sheet-print",
    "descriptionEn": "Fixed a bug in calculatedRows where spreading vals (returned by getSalaryValues) overwrote the row serial number ('sl' key) with the sick leave count ('sl' key). Renamed the row serial number property to 'serialNo' to resolve duplicate property declarations and ensure the serial number renders correctly in print sheets.",
    "descriptionBn": "à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¶à¦¿à¦Ÿ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦ªà§‡à¦‡à¦œà§‡ à¦�à¦•à¦Ÿà¦¿ à¦¬à¦¾à¦— à¦«à¦¿à¦•à§�à¦¸ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ row serial number ('sl') à¦�à¦¬à¦‚ sick leave ('sl') à¦�à¦•à¦‡ à¦•à¦¿ (key) à¦¨à¦¾à¦® à¦¹à¦“à§Ÿà¦¾à¦° à¦•à¦¾à¦°à¦£à§‡ à¦¸à¦¾à§Ÿà¦¾à¦²à¦¾à¦°à¦¿ à¦¶à¦¿à¦Ÿà§‡à¦° à¦•à§�à¦°à¦®à¦¿à¦• à¦¨à¦®à§�à¦¬à¦°à¦Ÿà¦¿ à¦­à§�à¦² à¦†à¦¸à¦›à¦¿à¦²à¥¤ à¦•à§�à¦°à¦®à¦¿à¦• à¦¨à¦®à§�à¦¬à¦°à§‡à¦° à¦•à¦¿ à¦¨à¦¾à¦® à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ 'serialNo' à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦�à¦Ÿà¦¿ à¦¸à¦ à¦¿à¦•à¦­à¦¾à¦¬à§‡ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦¶à¦¿à¦Ÿà§‡ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à§Ÿà¥¤"
  },
  {
    "id": "290",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Monthly Salary Details",
    "link": "/monthly-salary-details",
    "descriptionEn": "Created a new professional, printable Landscape A4 Monthly Salary Sheet report route (/salary-sheet-print) for the Payroll module. Renders Pakiza Software branding, department/unit/line filters, complete double-header table grid (Salary Breakdown, Attendance, Deductions, Overtime, Net Pay), and bottom executive signature logs matching the reference screenshot. Wired this print action to all 'Salary Sheet' buttons in the Monthly Salary Details portal.",
    "descriptionBn": "à¦ªà§‡-à¦°à§‹à¦² à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦œà¦¨à§�à¦¯ à¦�à¦•à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦², à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ-à¦¬à¦¾à¦¨à§�à¦§à¦¬ à¦²à§�à¦¯à¦¾à¦¨à§�à¦¡à¦¸à§�à¦•à§‡à¦ª A4 à¦®à¦¾à¦¸à¦¿à¦• à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¶à¦¿à¦Ÿ à¦°à¦¾à¦‰à¦Ÿ (/salary-sheet-print) à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦°à§Ÿà§‡à¦›à§‡ à¦ªà¦¾à¦•à¦¿à¦œà¦¾ à¦¸à¦«à¦Ÿà¦“à§Ÿà§�à¦¯à¦¾à¦° à¦¬à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡à¦¿à¦‚ à¦¹à§‡à¦¡à¦¾à¦°, à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ/à¦‡à¦‰à¦¨à¦¿à¦Ÿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦®à§‡à¦Ÿà¦¾, à¦ªà§‚à¦°à§�à¦£à¦¾à¦™à§�à¦— à¦¡à¦¾à¦¬à¦²-à¦¹à§‡à¦¡à¦¾à¦° à¦—à§�à¦°à¦¿à¦¡ à¦Ÿà§‡à¦¬à¦¿à¦² (à¦¬à§‡à¦¤à¦¨ à¦¬à§�à¦°à§‡à¦•à¦¡à¦¾à¦‰à¦¨, à¦¹à¦¾à¦œà¦¿à¦°à¦¾, à¦•à¦°à§�à¦¤à¦¨, à¦“à¦­à¦¾à¦°à¦Ÿà¦¾à¦‡à¦®, à¦¨à§‡à¦Ÿ à¦ªà§‡) à¦�à¦¬à¦‚ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿà§‡à¦° à¦®à¦¤à§‹ à§¬à¦Ÿà¦¿ à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦�à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦¸à§‡à¦•à¦¶à¦¨à¥¤ à¦®à¦¾à¦¸à¦¿à¦• à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦ªà§‹à¦°à§�à¦Ÿà¦¾à¦²à§‡à¦° à¦¸à¦¬ 'Salary Sheet' à¦¬à¦¾à¦Ÿà¦¨à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦�à¦‡ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "289",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Workspace Selection Portal",
    "link": "/module-selection",
    "descriptionEn": "Updated the workspace landing page to separate modules into two distinct sections: 'Active Modules' (containing HRIS, Merchandising, Procurement Management, Inventory Management, and My Dashboard) and 'Available Modules' (containing the remaining modules). Integrated clean section headers, visual status indicators (online/offline module counts), and staggered animations.",
    "descriptionBn": "à¦“à¦¯à¦¼à¦¾à¦°à§�à¦•à¦¸à§�à¦ªà§‡à¦¸ à¦²à§�à¦¯à¦¾à¦¨à§�à¦¡à¦¿à¦‚ à¦ªà§‡à¦œà¦Ÿà¦¿ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦®à¦¡à¦¿à¦‰à¦²à¦—à§�à¦²à§‹à¦•à§‡ à¦¦à§�à¦Ÿà¦¿ à¦†à¦²à¦¾à¦¦à¦¾ à¦¬à¦¿à¦­à¦¾à¦—à§‡ à¦¬à¦¿à¦­à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: 'Active Modules' (à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦°à¦¯à¦¼à§‡à¦›à§‡ HRIS, Merchandising, Procurement Management, Inventory Management à¦�à¦¬à¦‚ My Dashboard) à¦�à¦¬à¦‚ 'Available Modules' (à¦…à¦¬à¦¶à¦¿à¦·à§�à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¯ à¦®à¦¡à¦¿à¦‰à¦²à¦—à§�à¦²à§‹)à¥¤ à¦�à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à§�à¦¨à§�à¦¦à¦° à¦¸à§‡à¦•à¦¶à¦¨ à¦¹à§‡à¦¡à¦¾à¦°, à¦²à¦¾à¦‡à¦­ à¦…à¦¨à¦²à¦¾à¦‡à¦¨/à¦…à¦«à¦²à¦¾à¦‡à¦¨ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦•à¦¾à¦‰à¦¨à§�à¦Ÿà¦¾à¦° à¦�à¦¬à¦‚ à¦¸à§�à¦®à§�à¦¥ à¦…à§�à¦¯à¦¾à¦¨à¦¿à¦®à§‡à¦¶à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "288",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Payroll",
    "link": "/employee-tax-pay",
    "descriptionEn": "Created the new Employee Tax Pay (Tax Update) menu and interactive form page in the Payroll module. Featuring period filters, total person and amount statistics cards, bank details, chalan numbers/dates configurations, and an editable data grid with inline input fields matching the user's reference screenshot.",
    "descriptionBn": "à¦ªà§‡-à¦°à§‹à¦² à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦¨à¦¤à§�à¦¨ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦Ÿà§�à¦¯à¦¾à¦•à§�à¦¸ à¦ªà§‡ (à¦Ÿà§�à¦¯à¦¾à¦•à§�à¦¸ à¦†à¦ªà¦¡à§‡à¦Ÿ) à¦®à§‡à¦¨à§� à¦�à¦¬à¦‚ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à¦…à§�à¦¯à¦¾à¦•à§�à¦Ÿà¦¿à¦­ à¦«à¦°à§�à¦® à¦ªà§‡à¦‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦° à¦®à¦§à§�à¦¯à§‡ à¦°à¦¯à¦¼à§‡à¦›à§‡ à¦¬à¦›à¦° à¦“ à¦®à¦¾à¦¸ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, à¦®à§‹à¦Ÿ à¦¬à§�à¦¯à¦•à§�à¦¤à¦¿ à¦“ à¦Ÿà¦¾à¦•à¦¾à¦° à¦ªà¦°à¦¿à¦®à¦¾à¦£à§‡à¦° à¦ªà¦°à¦¿à¦¸à¦‚à¦–à§�à¦¯à¦¾à¦¨ à¦•à¦¾à¦°à§�à¦¡, à¦¬à§�à¦¯à¦¾à¦‚à¦• à¦“ à¦šà¦¾à¦²à¦¾à¦¨ à¦¨à¦®à§�à¦¬à¦°/à¦¤à¦¾à¦°à¦¿à¦– à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦�à¦¬à¦‚ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿà§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à¦¾à¦®à¦žà§�à¦œà¦¸à§�à¦¯à¦ªà§‚à¦°à§�à¦£ à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ à¦‡à¦¨à¦ªà§�à¦Ÿ à¦«à¦¿à¦²à§�à¦¡ à¦¸à¦¹ à¦�à¦•à¦Ÿà¦¿ à¦�à¦¡à¦¿à¦Ÿà§‡à¦¬à¦² à¦¡à§‡à¦Ÿà¦¾ à¦—à§�à¦°à¦¿à¦¡ à¦Ÿà§‡à¦¬à¦¿à¦²à¥¤"
  },
  {
    "id": "287",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Currency Rate Configuration",
    "link": "/procurement-config-currency-rate",
    "descriptionEn": "Redesigned the Currency Rate Configuration page under the Procurement Module. Implemented clean bottom-bordered inline inputs, float labels, specific active coloring for form action buttons (Create/Update), a floating green plus action button for create modal opening, and pagination controls.",
    "descriptionBn": "à¦ªà§�à¦°à¦•à¦¿à¦‰à¦°à¦®à§‡à¦¨à§�à¦Ÿ à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦•à¦¾à¦°à§‡à¦¨à§�à¦¸à¦¿ à¦°à§‡à¦Ÿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦ªà§‡à¦‡à¦œà¦Ÿà¦¿ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦°à¦¿à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦° à¦®à¦§à§�à¦¯à§‡ à¦°à¦¯à¦¼à§‡à¦›à§‡ à¦ªà¦°à¦¿à¦šà§�à¦›à¦¨à§�à¦¨ à¦¬à¦Ÿà¦®-à¦¬à¦°à§�à¦¡à¦¾à¦°à¦¡ à¦‡à¦¨à¦ªà§�à¦Ÿ à¦«à¦¿à¦²à§�à¦¡, à¦«à§�à¦²à§‹à¦Ÿà¦¿à¦‚ à¦²à§‡à¦¬à§‡à¦² à¦¸à§�à¦Ÿà¦¾à¦‡à¦², à¦«à¦°à§�à¦®à§‡à¦° à¦¸à¦¾à¦¬à¦®à¦¿à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨à§‡ (Create/Update) à¦¬à¦¿à¦¶à§‡à¦· à¦•à¦¾à¦²à¦¾à¦°à¦¿à¦‚ à¦¥à¦¿à¦®, à¦•à§�à¦°à¦¿à¦¯à¦¼à§‡à¦Ÿ à¦®à§‹à¦¡à¦¾à¦² à¦“à¦ªà§‡à¦¨ à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦«à§�à¦²à§‹à¦Ÿà¦¿à¦‚ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦ªà§�à¦²à¦¾à¦¸ à¦¬à¦¾à¦¤à¦¨ à¦�à¦¬à¦‚ à¦ªà§‡à¦œà¦¿à¦¨à§‡à¦¶à¦¨ à¦•à¦¨à§�à¦Ÿà§�à¦°à§‹à¦²à¦¸à¥¤"
  },
  {
    "id": "286",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Management Module",
    "link": "/procurement-dashboard",
    "descriptionEn": "Created the new Procurement Management module, including custom ProcurementSidebar, ProcurementTopbar, 45 individual static route files, and a rich graphical overview dashboard equipped with Recharts trends (spend and payouts), allocation splits, and comprehensive performance metrics.",
    "descriptionBn": "à¦¨à¦¤à§�à¦¨ à¦ªà§�à¦°à¦•à¦¿à¦‰à¦°à¦®à§‡à¦¨à§�à¦Ÿ à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦®à§‡à¦¨à§�à¦Ÿ à¦®à¦¡à¦¿à¦‰à¦² à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦°à¦¯à¦¼à§‡à¦›à§‡ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦ªà§�à¦°à¦•à¦¿à¦‰à¦°à¦®à§‡à¦¨à§�à¦Ÿ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°, à¦ªà§�à¦°à¦•à¦¿à¦‰à¦°à¦®à§‡à¦¨à§�à¦Ÿ à¦Ÿà¦ªà¦¬à¦¾à¦°, à§ªà§«à¦Ÿà¦¿ à¦ªà§ƒà¦¥à¦• à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¿à¦• à¦°à¦¾à¦‰à¦Ÿ à¦ªà§‡à¦‡à¦œ à¦�à¦¬à¦‚ à¦°à¦¿à¦šà¦¾à¦°à§�à¦Ÿà¦¸ (Recharts) à¦—à§�à¦°à¦¾à¦«à¦¿à¦•à§�à¦¯à¦¾à¦² à¦Ÿà§�à¦°à§‡à¦¨à§�à¦¡ à¦…à§�à¦¯à¦¾à¦¨à¦¾à¦²à¦¿à¦Ÿà¦¿à¦•à¦¸, à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿ à¦¸à§�à¦ªà§‡à¦¨à§�à¦¡ à¦…à§�à¦¯à¦¾à¦²à§‹à¦•à§‡à¦¶à¦¨ à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¿à¦®à¦¿à§Ÿà¦¾à¦® à¦ªà¦¾à¦°à¦«à¦°à¦®à§�à¦¯à¦¾à¦¨à§�à¦¸ à¦®à§‡à¦Ÿà§�à¦°à¦¿à¦•à§�à¦¸ à¦¸à¦®à§ƒà¦¦à§�à¦§ à¦�à¦•à¦Ÿà¦¿ à¦†à¦•à¦°à§�à¦·à¦¨à§€à§Ÿ à¦¡à§�à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§�à¦¡ à¦²à§‡à¦†à¦‰à¦Ÿà¥¤"
  },
  {
    "id": "285",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Employee Job Card",
    "link": "/employee-job-card",
    "descriptionEn": "Redesigned the Employee Job Card workspace including Scope & Parameters form columns grid, inline query triggers, employee profile summary card, stat card tiles, and responsive Attendance Summary block.",
    "descriptionBn": "à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦œà¦¬ à¦•à¦¾à¦°à§�à¦¡ à¦ªà§‡à¦œà¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ à¦•à¦°à§‡ à¦°à¦¿à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦°à§Ÿà§‡à¦›à§‡ à¦¸à§�à¦•à§‹à¦ª à¦“ à¦ªà§�à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦°à¦¸ à¦¸à¦¾à¦°à§�à¦š à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦², à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦Ÿà§�à¦°à¦¿à¦—à¦¾à¦°, à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦•à¦¾à¦°à§�à¦¡, à§ªà¦Ÿà¦¿ à¦ªà§�à¦°à¦¿à¦®à¦¿à§Ÿà¦¾à¦® à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿ à¦Ÿà¦¾à¦‡à¦²à¦¸ à¦�à¦¬à¦‚ à¦¡à¦¾à§Ÿà¦¨à¦¾à¦®à¦¿à¦• à¦…à§�à¦¯à¦¾à¦Ÿà§‡à¦¨à¦¡à§‡à¦¨à§�à¦¸ à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦¬à§�à¦²à¦•à¥¤"
  },
  {
    "id": "284",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition",
    "link": "/ssp-approval",
    "descriptionEn": "Refined the Leave Details list view to incorporate the Leave Type and Address as standard inline labeled items, providing a completely uniform key-value reading experience.",
    "descriptionBn": "à¦²à¦¿à¦­ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡ 'à¦²à¦¿à¦­ à¦Ÿà¦¾à¦‡à¦ª' à¦�à¦¬à¦‚ 'à¦…à§�à¦¯à¦¾à¦¡à§�à¦°à§‡à¦¸' à¦•à§‡ à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ à¦²à¦¿à¦¸à§�à¦Ÿ à¦†à¦‡à¦Ÿà§‡à¦® à¦¹à¦¿à¦¸à§‡à¦¬à§‡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à¦ªà§�à¦°à§‹ à¦¸à§‡à¦•à¦¶à¦¨à¦Ÿà¦¿ à¦�à¦•à¦Ÿà¦¿ à¦®à¦¾à¦¨à¦¾à¦¨à¦¸à¦‡ à¦�à¦¬à¦‚ à¦¸à§�à¦¨à§�à¦¦à¦° à¦•à§€-à¦­à§�à¦¯à¦¾à¦²à§� à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à§Ÿà¥¤"
  },
  {
    "id": "283",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition",
    "link": "/ssp-approval",
    "descriptionEn": "Redesigned the Leave Details section into a clean inline list view layout matching the employee profile description layout, using inline key-value labels and bold values.",
    "descriptionBn": "à¦²à¦¿à¦­ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦¸à§‡à¦•à¦¶à¦¨à¦Ÿà¦¿ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦¡à§‡à¦¸à¦•à§�à¦°à¦¿à¦ªà¦¶à¦¨à§‡à¦° à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦�à¦•à¦Ÿà¦¿ à¦ªà¦°à¦¿à¦šà§�à¦›à¦¨à§�à¦¨ à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ à¦²à¦¿à¦¸à§�à¦Ÿ à¦­à¦¿à¦‰ à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦°à¦¿à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ à¦•à§€-à¦­à§�à¦¯à¦¾à¦²à§� à¦²à§‡à¦¬à§‡à¦² à¦�à¦¬à¦‚ à¦¬à§‹à¦²à§�à¦¡ à¦­à§�à¦¯à¦¾à¦²à§� à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "282",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition",
    "link": "/ssp-approval",
    "descriptionEn": "Refined the Leave Details section into a structured 4-column layout to prevent UI breaks on long text blocks and corrected fallback Tailwind text color styles for consistent reading.",
    "descriptionBn": "à¦²à¦¿à¦­ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦¸à§‡à¦•à¦¶à¦¨à¦Ÿà¦¿ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦¨à§�à¦¦à¦° à§ª-à¦•à¦²à¦¾à¦® à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦²à¦®à§�à¦¬à¦¾ à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿà§‡à¦° à¦•à¦¾à¦°à¦£à§‡ UI à¦­à§‡à¦™à§‡ à¦¨à¦¾ à¦¯à¦¾à§Ÿ à¦�à¦¬à¦‚ à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦•à¦¾à¦²à¦¾à¦° à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦¸à¦ à¦¿à¦•à¦­à¦¾à¦¬à§‡ à¦°à§‡à¦¨à§�à¦¡à¦¾à¦° à¦¹à¦“à§Ÿà¦¾à¦° à¦œà¦¨à§�à¦¯ à¦•à§�à¦²à¦¾à¦¸à¦—à§�à¦²à§‹ à¦ à¦¿à¦• à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "281",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Increased modal design weight (width), redesigned the Leave Details section into premium statistics card tiles, and fixed a missing 'details' reference causing a runtime crash on /ssp-my-requisition.",
    "descriptionBn": "à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦“à¦œà¦¨ (à¦ªà§�à¦°à¦¸à§�à¦¥) à¦¬à§ƒà¦¦à§�à¦§à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦²à¦¿à¦­ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦¸à§‡à¦•à¦¶à¦¨à¦Ÿà¦¿ à¦ªà§�à¦°à¦¿à¦®à¦¿à§Ÿà¦¾à¦® à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¿à¦¸à§�à¦Ÿà¦¿à¦•à¦¸ à¦•à¦¾à¦°à§�à¦¡ à¦Ÿà¦¾à¦‡à¦²à¦¸ à¦†à¦•à¦¾à¦°à§‡ à¦°à¦¿à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ /ssp-my-requisition à¦ªà§‡à¦‡à¦œà§‡à¦° à¦°à¦¾à¦¨à¦Ÿà¦¾à¦‡à¦® à¦•à§�à¦°à§�à¦¯à¦¾à¦¶ à¦¹à¦“à§Ÿà¦¾ à¦¬à¦¾à¦—à¦Ÿà¦¿ à¦«à¦¿à¦•à§�à¦¸ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "280",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Redesigned the Leave Application Requisition Detail View modal for the Employee portal to match the premium wireframe layout.",
    "descriptionBn": "à¦•à¦°à§�à¦®à¦šà¦¾à¦°à§€ à¦ªà§‹à¦°à§�à¦Ÿà¦¾à¦²à§‡à¦° à¦œà¦¨à§�à¦¯ à¦²à¦¿à¦­ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦² à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿ à¦ªà§�à¦°à¦¿à¦®à¦¿à§Ÿà¦¾à¦® à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦°à¦¿à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "279",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition",
    "link": "/ssp-approval",
    "descriptionEn": "Redesigned the Leave Application detail view modal to match the premium, structured UI mockup, featuring a clean requester/request-for grid, detailed parameter blocks, and inline signatures.",
    "descriptionBn": "à¦²à¦¿à¦­ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦² à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦² à¦°à¦¿à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦°à§Ÿà§‡à¦›à§‡ à¦°à¦¿à¦•à§‹à§Ÿà§‡à¦¸à§�à¦Ÿà¦¾à¦° à¦“ à¦°à¦¿à¦•à§‹à§Ÿà§‡à¦¸à§�à¦Ÿ-à¦«à¦° à¦—à§�à¦°à¦¿à¦¡, à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦²à¦¿à¦­ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦¬à§�à¦²à¦• à¦�à¦¬à¦‚ à¦¸à§�à¦¨à§�à¦¦à¦° à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦“à¦¯à¦¼à¦¾à¦°à§�à¦•à¦«à§�à¦²à§‹à¥¤"
  },
  {
    "id": "278",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Workspace Settings Profile",
    "link": "/enroll-fingerprint",
    "descriptionEn": "Simplified the Enroll Fingerprint page to a clean, mobile-style UI â€” tap the sensor icon to add a fingerprint, rename or delete saved ones just like iOS Touch ID settings.",
    "descriptionBn": "à¦«à¦¿à¦™à§�à¦—à¦¾à¦°à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦�à¦¨à¦°à§‹à¦² à¦ªà§‡à¦œà¦Ÿà¦¿ à¦®à§‹à¦¬à¦¾à¦‡à¦²à§‡à¦° à¦®à¦¤à§‹ à¦¸à¦¹à¦œ UI à¦¤à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ â€” à¦¸à§‡à¦¨à§�à¦¸à¦° à¦†à¦‡à¦•à¦¨à§‡ à¦Ÿà§�à¦¯à¦¾à¦ª à¦•à¦°à¦²à§‡à¦‡ à¦«à¦¿à¦™à§�à¦—à¦¾à¦°à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦¯à§‹à¦— à¦¹à¦¬à§‡, à¦°à¦¿à¦¨à§‡à¦® à¦¬à¦¾ à¦¡à¦¿à¦²à§‡à¦Ÿà¦“ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "277",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Workspace Login Portal",
    "link": "/login",
    "descriptionEn": "Login fingerprint button now uses the real WebAuthn API â€” the browser prompts the actual Touch ID sensor. Login won't proceed until you physically touch the fingerprint sensor.",
    "descriptionBn": "à¦²à¦—à¦‡à¦¨ à¦ªà§‡à¦œà§‡à¦° à¦«à¦¿à¦™à§�à¦—à¦¾à¦°à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨à¦Ÿà¦¿ à¦�à¦–à¦¨ à¦†à¦¸à¦² WebAuthn API à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§‡ â€” à¦†à¦¸à¦² Touch ID à¦¸à§‡à¦¨à§�à¦¸à¦° à¦¸à§�à¦ªà¦°à§�à¦¶ à¦¨à¦¾ à¦•à¦°à¦²à§‡ à¦²à¦—à¦‡à¦¨ à¦¹à¦¬à§‡ à¦¨à¦¾à¥¤"
  },
  {
    "id": "276",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Workspace Settings Profile",
    "link": "/enroll-fingerprint",
    "descriptionEn": "Developed a dedicated Biometric Setup page (/enroll-fingerprint) featuring a professional fingerprint enrollment console with multi-pass scans, visual hand-mapping selectors, real-time minutiae extraction, and active biometric templates logs.",
    "descriptionBn": "à¦«à¦¿à¦™à§�à¦—à¦¾à¦°à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà§�à¦°à§‡à¦¶à¦¨à§‡à¦° à¦œà¦¨à§�à¦¯ à¦�à¦•à¦Ÿà¦¿ à¦¡à§‡à¦¡à¦¿à¦•à§‡à¦Ÿà§‡à¦¡ à¦ªà§‡à¦œ (/enroll-fingerprint) à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦°à§Ÿà§‡à¦›à§‡ à§ª-à¦§à¦¾à¦ªà§‡à¦° à¦­à§‡à¦°à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦¸à§�à¦•à§�à¦¯à¦¾à¦¨à¦¾à¦°, à¦­à¦¿à¦œà§�à¦¯à§�à§Ÿà¦¾à¦² à¦¹à§�à¦¯à¦¾à¦¨à§�à¦¡-à¦®à§�à¦¯à¦¾à¦ªà¦¿à¦‚ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦°, à¦°à¦¿à¦¯à¦¼à§‡à¦²-à¦Ÿà¦¾à¦‡à¦® à¦®à¦¿à¦¨à¦¿à¦Ÿ à¦ªà§Ÿà§‡à¦¨à§�à¦Ÿ à¦�à¦•à§�à¦¸à¦Ÿà§�à¦°à¦¾à¦•à¦¶à¦¨ à¦�à¦¬à¦‚ à¦…à§�à¦¯à¦¾à¦•à§�à¦Ÿà¦¿à¦­ à¦¬à¦¾à¦¯à¦¼à§‹à¦®à§‡à¦Ÿà§�à¦°à¦¿à¦• à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿ à¦¡à¦¾à¦Ÿà¦¾à¦¬à§‡à¦¸à¥¤"
  },
  {
    "id": "275",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Workspace Header Navigation",
    "descriptionEn": "Added interactive dropdown menu to Topbar profile block with options: My Profile, Change Region, and Enroll Fingerprint setup dialog.",
    "descriptionBn": "à¦Ÿà¦ªà¦¬à¦¾à¦° à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦�à¦•à¦Ÿà¦¿ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à§‡à¦•à§�à¦Ÿà¦¿à¦­ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦®à§‡à¦¨à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦°à§Ÿà§‡à¦›à§‡: My Profile, Change Region à¦�à¦¬à¦‚ Enroll Fingerprint à¦¸à§‡à¦Ÿà¦†à¦ª à¦®à§‹à¦¡à¦¾à¦²à¥¤"
  },
  {
    "id": "274",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Workspace Login Portal",
    "link": "/login",
    "descriptionEn": "Implemented secure fingerprint authentication option on the login page, featuring a high-fidelity scanning modal, laser scan line animations, and automated user redirection.",
    "descriptionBn": "à¦²à¦—à¦‡à¦¨ à¦ªà§‡à¦œà§‡ à¦«à¦¿à¦™à§�à¦—à¦¾à¦°à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦¦à¦¿à§Ÿà§‡ à¦²à¦—à¦‡à¦¨ à¦•à¦°à¦¾à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦°à§Ÿà§‡à¦›à§‡ à¦¦à§ƒà¦·à§�à¦Ÿà¦¿à¦¨à¦¨à§�à¦¦à¦¨ à¦…à§�à¦¯à¦¾à¦¨à¦¿à¦®à§‡à¦Ÿà§‡à¦¡ à¦¸à§�à¦•à§�à¦¯à¦¾à¦¨à¦¿à¦‚ à¦®à¦¡à¦¾à¦² à¦�à¦¬à¦‚ à¦¸à§�à¦¬à§Ÿà¦‚à¦•à§�à¦°à¦¿à§Ÿ à¦°à¦¿à¦¡à¦¾à¦‡à¦°à§‡à¦•à¦¶à¦¨ à¦¸à§�à¦¬à¦¿à¦§à¦¾à¥¤"
  },
  {
    "id": "273",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Sidebar Navigation Layout",
    "descriptionEn": "Reorganized Leave and SSP Attendance sidebar menus into nested dropdown submenus (excluding Hub pages) for cleaner navigation.",
    "descriptionBn": "à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨ à¦¸à¦¹à¦œ à¦“ à¦ªà¦°à¦¿à¦šà§�à¦›à¦¨à§�à¦¨ à¦•à¦°à¦¤à§‡ à¦¹à¦¾à¦¬ à¦ªà§‡à¦œà¦—à§�à¦²à§‹ à¦¬à¦¾à¦¦ à¦¦à¦¿à§Ÿà§‡ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦®à§‡à¦¨à§�à¦¤à§‡ à¦²à¦¿à¦­ à¦�à¦¬à¦‚ à¦�à¦¸à¦�à¦¸à¦ªà¦¿ à¦…à§�à¦¯à¦¾à¦Ÿà§‡à¦¨à¦¡à§‡à¦¨à§�à¦¸ à¦…à¦ªà¦¶à¦¨à¦—à§�à¦²à§‹à¦•à§‡ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§�à¦¤à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "272",
    "date": "2026-09-14T10:30",
    "type": "Bug Fix",
    "module": "System Settings",
    "link": "/changes",
    "descriptionEn": "Resolved TypeScript compilation type-checking error by adding 'Bug Fix' to the ChangeRecord allowed types and selection dropdown options.",
    "descriptionBn": "à¦Ÿà¦¾à¦‡à¦ªà¦¸à§�à¦•à§�à¦°à¦¿à¦ªà§�à¦Ÿ à¦•à¦®à§�à¦ªà¦¾à¦‡à¦²à§‡à¦¶à¦¨ à¦Ÿà¦¾à¦‡à¦ª-à¦šà§‡à¦•à¦¿à¦‚ à¦¤à§�à¦°à§�à¦Ÿà¦¿ à¦¦à§‚à¦° à¦•à¦°à¦¤à§‡ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨à§‡à¦° à¦ªà§�à¦°à¦•à¦¾à¦°à¦­à§‡à¦¦à§‡ 'Bug Fix' à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦�à¦° à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦…à¦ªà¦¶à¦¨ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "271",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Added Lock/Unlock layout toggle button to dynamically toggle drag and drop permissions and show/hide reorder handle badges.",
    "descriptionBn": "à¦¡à§�à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§�à¦¡ à¦²à§‡à¦†à¦‰à¦Ÿ à¦²à¦•/à¦†à¦¨à¦²à¦• à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦¬à¦¾à¦Ÿà¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾ à¦¦à¦¿à§Ÿà§‡ à¦¡à§�à¦°à§�à¦¯à¦¾à¦— à¦…à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦¡à§�à¦°à¦ª à¦¸à¦•à§�à¦°à¦¿à§Ÿ à¦¬à¦¾ à¦¨à¦¿à¦·à§�à¦•à§�à¦°à¦¿à§Ÿ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡ à¦�à¦¬à¦‚ à¦¹à§�à¦¯à¦¾à¦¨à§�à¦¡à§‡à¦² à¦¬à§�à¦¯à¦¾à¦œ à¦²à§�à¦•à¦¾à¦¨à§‹ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "270",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Updated default widget positioning to set order: Attendance Summary, Notice Board, Recent Messages, Leave Balance, Ontime vs Late, Upcoming, and bumped local storage namespace.",
    "descriptionBn": "à¦¡à§�à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§�à¦¡ à¦‰à¦‡à¦œà§‡à¦Ÿà§‡à¦° à¦¡à¦¿à¦«à¦²à§�à¦Ÿ à¦²à§‡à¦†à¦‰à¦Ÿ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡: Attendance Summary, Notice Board, Recent Messages, Leave Balance, Ontime vs Late, Upcoming à¦�à¦¬à¦‚ à¦²à§‹à¦•à¦¾à¦² à¦¸à§�à¦Ÿà§‹à¦°à§‡à¦œ à¦•à§€ à¦¸à¦‚à¦¸à§�à¦•à¦°à¦£ à§©-à¦� à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "269",
    "date": "2026-09-14T10:30",
    "type": "Bug Fix",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Increased the dashboard widget heights to 330px and scaled up inline charts, eliminating notice items and bottom buttons clipping on viewport zoom scales.",
    "descriptionBn": "à¦¡à§�à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§�à¦¡ à¦‰à¦‡à¦œà§‡à¦Ÿà§‡à¦° à¦¹à¦¾à¦‡à¦Ÿ à§©à§©à§¦ à¦ªà¦¿à¦•à§�à¦¸à§‡à¦² à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦šà¦¾à¦°à§�à¦Ÿà¦—à§�à¦²à§‹à¦° à¦‰à¦šà§�à¦šà¦¤à¦¾ à¦¸à¦®à¦¨à§�à¦¬à§Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦«à¦²à§‡ à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦†à¦‡à¦Ÿà§‡à¦® à¦¬à¦¾ à¦¨à¦¿à¦šà§‡à¦° à¦¬à¦¾à¦Ÿà¦¨à¦—à§�à¦²à§‹ à¦•à§‡à¦Ÿà§‡ à¦¯à¦¾à¦¬à§‡ à¦¨à¦¾à¥¤"
  },
  {
    "id": "268",
    "date": "2026-09-14T10:30",
    "type": "Bug Fix",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Resolved a UI layout overlap on dashboard widgets by shifting the top-right header action links to the left of the absolute hoverable drag handles.",
    "descriptionBn": "à¦¡à§�à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§�à¦¡ à¦‰à¦‡à¦œà§‡à¦Ÿà§‡à¦° à¦¶à§€à¦°à§�à¦·à§‡ à¦¥à¦¾à¦•à¦¾ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦Ÿà¦¨à¦—à§�à¦²à§‹à¦° à¦®à¦¾à¦°à§�à¦œà¦¿à¦¨ à¦…à¦«à¦¸à§‡à¦Ÿ à¦¬à¦¾à§œà¦¿à§Ÿà§‡ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦«à¦²à§‡ à¦¹à§‹à¦­à¦¾à¦° à¦•à¦°à¦¾ à¦…à¦¬à¦¸à§�à¦¥à¦¾à§Ÿ à¦¡à§�à¦°à§�à¦¯à¦¾à¦— à¦¹à§�à¦¯à¦¾à¦¨à§�à¦¡à§‡à¦²à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦•à§‹à¦¨à§‹ à¦“à¦­à¦¾à¦°à¦²à§�à¦¯à¦¾à¦ªà¦¿à¦‚ à¦¹à¦¬à§‡ à¦¨à¦¾à¥¤"
  },
  {
    "id": "267",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Upgraded the Leave Balance widget to dynamically map any number of leave types, showing them inside a horizontally scrollable carousel with custom SVG radial progress gauges.",
    "descriptionBn": "à¦²à§€à¦­ à¦¬à§�à¦¯à¦¾à¦²à§‡à¦¨à§�à¦¸ à¦‰à¦‡à¦œà§‡à¦Ÿà¦Ÿà¦¿ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à§‡ à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦¸à¦‚à¦–à§�à¦¯à¦• à¦²à§€à¦­ à¦Ÿà¦¾à¦‡à¦ª à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦• à¦°à§‡à¦¨à§�à¦¡à¦¾à¦° à¦•à¦°à¦¾à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦�à¦¬à¦‚ à¦¹à¦°à¦¿à¦œà¦¨à§�à¦Ÿà¦¾à¦² à¦¸à§�à¦•à§�à¦°à¦²à¦¯à§‹à¦—à§�à¦¯ à¦•à§�à¦¯à¦¾à¦°à§‹à¦¸à§‡à¦² à¦“ SVG à¦¸à¦¾à¦°à§�à¦•à§�à¦²à¦¾à¦° à¦—à§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "266",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Optimized dashboard overview cards height to a uniform 310px, compressed paddings/gaps, reduced chart sizes, and restructured list contents to completely eliminate blank spaces.",
    "descriptionBn": "à¦¡à§�à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§�à¦¡ à¦•à¦¾à¦°à§�à¦¡à§‡à¦° à¦‰à¦šà§�à¦šà¦¤à¦¾ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ à§©à§§à§¦ à¦ªà¦¿à¦•à§�à¦¸à§‡à¦² à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦­à§‡à¦¤à¦°à§‡à¦° à¦ªà§�à¦¯à¦¾à¦¡à¦¿à¦‚ à¦“ à¦—à§�à¦¯à¦¾à¦ª à¦•à¦®à¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡, à¦�à¦¬à¦‚ à¦«à¦¾à¦�à¦•à¦¾ à¦œà¦¾à§Ÿà¦—à¦¾ à¦¦à§‚à¦° à¦•à¦°à§‡ à¦†à¦°à¦“ à¦•à¦®à§�à¦ªà§�à¦¯à¦¾à¦•à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "265",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Added a 'Reset Layout' button next to the Download Report header to restore the default dashboard overview widget sequence.",
    "descriptionBn": "à¦¡à§�à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§�à¦¡ à¦“à¦­à¦¾à¦°à¦­à¦¿à¦‰à§Ÿà§‡à¦° à¦ªà§‚à¦°à§�à¦¬à¦¨à¦¿à¦°à§�à¦§à¦¾à¦°à¦¿à¦¤ à¦‰à¦‡à¦œà§‡à¦Ÿ à¦²à§‡à¦†à¦‰à¦Ÿ à¦ªà§�à¦¨à¦°à¦¾à§Ÿ à¦«à¦¿à¦°à§‡ à¦ªà¦¾à¦“à§Ÿà¦¾à¦° à¦œà¦¨à§�à¦¯ à¦¹à§‡à¦¡à¦¾à¦° à¦¸à§‡à¦•à¦¶à¦¨à§‡ 'Reset Layout' à¦¬à¦¾à¦Ÿà¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "264",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Implemented dynamic drag-and-drop widget reordering on the main dashboard layout, added visual drag handles, and integrated aesthetic card borders/accents.",
    "descriptionBn": "à¦¡à§�à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§�à¦¡à§‡à¦° à¦ªà§�à¦°à¦§à¦¾à¦¨ à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦• à¦¡à§�à¦°à§�à¦¯à¦¾à¦—-à¦…à§�à¦¯à¦¾à¦¨à§�à¦¡-à¦¡à§�à¦°à¦ª à¦‰à¦‡à¦œà§‡à¦Ÿ à¦°à¦¿-à¦…à¦°à§�à¦¡à¦¾à¦°à¦¿à¦‚ à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¡à§�à¦°à§�à¦¯à¦¾à¦— à¦¹à§�à¦¯à¦¾à¦¨à§�à¦¡à¦² à¦“ à¦†à¦•à¦°à§�à¦·à¦£à§€à§Ÿ à¦•à¦¾à¦°à§�à¦¡ à¦¬à¦°à§�à¦¡à¦¾à¦° à¦�à¦•à§�à¦¸à§‡à¦¨à§�à¦Ÿà¦¸à¦¹ à¦¸à§Œà¦¨à§�à¦¦à¦°à§�à¦¯à¦¬à¦°à§�à¦§à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "263",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Refactored top stats cards into a highly compact horizontal flex-row, placed Notice Board and Recent Messages cards prominently below stats, and shifted charts and upcoming events/leave balances down.",
    "descriptionBn": "à¦Ÿà¦ª à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¸ à¦•à¦¾à¦°à§�à¦¡à¦—à§�à¦²à§‹à¦•à§‡ à¦†à¦°à¦“ à¦•à¦®à§�à¦ªà§�à¦¯à¦¾à¦•à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¸à§‡à¦° à¦ à¦¿à¦• à¦¨à¦¿à¦šà§‡ à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦¬à§‹à¦°à§�à¦¡ à¦“ à¦¸à¦¾à¦®à§�à¦ªà§�à¦°à¦¤à¦¿à¦• à¦®à§‡à¦¸à§‡à¦œ à¦•à¦¾à¦°à§�à¦¡ à¦¸à§�à¦¥à¦¾à¦ªà¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦�à¦¬à¦‚ à¦…à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¯ à¦šà¦¾à¦°à§�à¦Ÿ à¦“ à¦‰à¦‡à¦œà§‡à¦Ÿ à¦¨à¦¿à¦šà§‡ à¦¸à¦°à¦¿à§Ÿà§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "262",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Added a dynamic Notice Board widget card and interactive full-circular announcement preview letters to the Organization Overview dashboard layout.",
    "descriptionBn": "à¦…à¦°à§�à¦—à¦¾à¦¨à¦¾à¦‡à¦œà§‡à¦¶à¦¨ à¦“à¦­à¦¾à¦°à¦­à¦¿à¦‰ à¦¡à§�à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§�à¦¡à§‡ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦• à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦¬à§‹à¦°à§�à¦¡ à¦‰à¦‡à¦œà§‡à¦Ÿ à¦•à¦¾à¦°à§�à¦¡ à¦�à¦¬à¦‚ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à§‡à¦•à§�à¦Ÿà¦¿à¦­ à¦¸à¦¾à¦°à§�à¦•à§�à¦²à¦¾à¦° à¦ªà§�à¦°à¦¿à¦­à¦¿à¦‰ à¦²à§‡à¦Ÿà¦¾à¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "261",
    "date": "2026-09-14T10:30",
    "type": "Bug Fix",
    "module": "Sidebar Navigation Layout",
    "link": "/module-selection",
    "descriptionEn": "Implemented synchronous state load from sessionStorage and an navigation lock state to prevent sidebar scroll jumping or menu resets on route navigation changes.",
    "descriptionBn": "à¦®à§‡à¦¨à§� à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨à§‡à¦° à¦¸à¦®à§Ÿ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦¸à§�à¦•à§�à¦°à¦² à¦²à¦¾à¦«à¦¾à¦¨à§‹ à¦�à¦¬à¦‚ à¦¬à¦¨à§�à¦§ à¦¹à¦“à§Ÿà¦¾ à¦°à§‹à¦§ à¦•à¦°à¦¤à§‡ à¦¸à¦¿à¦¨à¦•à§�à¦°à§‹à¦¨à¦¾à¦¸ à¦¸à§�à¦Ÿà§‡à¦Ÿ à¦²à§‹à¦¡ à¦�à¦¬à¦‚ à¦Ÿà§�à¦°à¦¾à¦¨à¦œà¦¿à¦¶à¦¨ à¦²à¦•à¦¿à¦‚ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "260",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Salary Increment History",
    "link": "/increment-history",
    "descriptionEn": "Mounted the complete 57 salary increment history mock records and set all year-by-year increment columns visible by default to match the target report visual layout.",
    "descriptionBn": "à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦‡à¦¨à¦•à§�à¦°à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦¹à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦¡à¦¾à¦Ÿà¦¾à¦¬à§‡à¦œà§‡ à§«à§­à¦Ÿà¦¿ à¦°à§‡à¦•à¦°à§�à¦¡ à¦²à§‹à¦¡ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¸à¦¬à¦—à§�à¦²à§‹ à¦•à¦²à¦¾à¦® à¦¡à¦¿à¦«à¦²à§�à¦Ÿà¦­à¦¾à¦¬à§‡ à¦¦à§ƒà¦¶à§�à¦¯à¦®à¦¾à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦¸à¦¹à¦œà§‡ à¦¸à¦•à¦² à¦�à¦¤à¦¿à¦¹à¦¾à¦¸à¦¿à¦• à¦¤à¦¥à§�à¦¯ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à§Ÿà¥¤"
  },
  {
    "id": "259",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Increment Report Workspace",
    "link": "/increment-report",
    "descriptionEn": "Implemented dynamic Increment Report page including the multi-parametric search filter console, side-scrolling reports table with green (lens) and orange (file sheet) preview icons, and modular appraisal letters popups.",
    "descriptionBn": "à¦¡à¦¾à§Ÿà¦¨à¦¾à¦®à¦¿à¦• à¦‡à¦¨à¦•à§�à¦°à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦œà¦Ÿà¦¿ à¦¸à¦«à¦²à¦­à¦¾à¦¬à§‡ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦°à§Ÿà§‡à¦›à§‡ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¸à¦¾à¦°à§�à¦š à¦•à¦¨à¦¸à§‹à¦², à¦¸à¦¾à¦‡à¦¡-à¦¸à§�à¦•à§�à¦°à§‹à¦² à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦², à¦ªà§�à¦°à¦¿à¦­à¦¿à¦‰ à¦¬à¦¾à¦Ÿà¦¨ à¦�à¦¬à¦‚ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à§‡à¦•à§�à¦Ÿà¦¿à¦­ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦‡à¦¨à¦•à§�à¦°à¦¿à¦®à§‡à¦¨à§�à¦Ÿ/à¦ªà§�à¦°à¦®à§‹à¦¶à¦¨ à¦²à§‡à¦Ÿà¦¾à¦° à¦®à§‹à¦¡à¦¾à¦² à¦‰à¦‡à¦¨à§�à¦¡à§‹à¥¤"
  },
  {
    "id": "258",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Proposed Increment List",
    "link": "/propose-increment",
    "descriptionEn": "Implemented side-scrolling table configuration for proposed increments list to display detailed compensation fields on a single line, fit column widths to content, and aligned mock records with correct base and increment arithmetic.",
    "descriptionBn": "à¦ªà§�à¦°à¦¸à§�à¦¤à¦¾à¦¬à¦¿à¦¤ à¦‡à¦¨à¦•à§�à¦°à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦ªà§‡à¦œà¦Ÿà¦¿ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¸à¦¬ à¦•à¦²à¦¾à¦® à¦¯à¦¾à¦¤à§‡ à¦�à¦• à¦²à¦¾à¦‡à¦¨à§‡ à¦¸à§�à¦¨à§�à¦¦à¦°à¦­à¦¾à¦¬à§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à§Ÿ à¦¸à§‡à¦œà¦¨à§�à¦¯ à¦¸à¦¾à¦‡à¦¡-à¦¸à§�à¦•à§�à¦°à§‹à¦² à¦¸à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¬à¦¾à¦¸à§�à¦¤à¦¬à¦¸à¦®à§�à¦®à¦¤ à¦¬à§‡à¦¸ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦“ à¦‡à¦¨à¦•à§�à¦°à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦¹à¦¿à¦¸à§‡à¦¬ à¦®à¦¿à¦²à¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "257",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Salary Increment Configurator",
    "link": "/increment",
    "descriptionEn": "Redesigned the single increment workspace to match the premium multiple increment visual scheme: implemented the exact dual-panel layout (Employee Details & Increment Details) with inline material underline input fields, interactive SHOW/SUBMIT triggers, and custom orange color configurations.",
    "descriptionBn": "à¦¸à¦¿à¦™à§�à¦—à§‡à¦² à¦‡à¦¨à¦•à§�à¦°à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦“à¦¯à¦¼à¦¾à¦°à§�à¦•à¦¸à§�à¦ªà§‡à¦¸à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ à¦•à¦°à§‡ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à¦¸à§�à¦ªà§‡à¦¸à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦¦à§�à¦Ÿà¦¿ à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦² (à¦•à¦°à§�à¦®à¦šà¦¾à¦°à§€à¦° à¦¤à¦¥à§�à¦¯ à¦“ à¦‡à¦¨à¦•à§�à¦°à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦¤à¦¥à§�à¦¯), à¦®à§�à¦¯à¦¾à¦Ÿà§‡à¦°à¦¿à¦¯à¦¼à¦¾à¦² à¦†à¦¨à§�à¦¡à¦¾à¦°à¦²à¦¾à¦‡à¦¨ à¦«à¦¿à¦²à§�à¦¡, à¦¶à§‹/à¦¸à¦¾à¦¬à¦®à¦¿à¦Ÿ à¦Ÿà§�à¦°à¦¿à¦—à¦¾à¦° à¦�à¦¬à¦‚ à¦¦à§ƒà¦·à§�à¦Ÿà¦¿à¦¨à¦¨à§�à¦¦à¦¨ à¦•à¦®à¦²à¦¾ à¦°à¦™à§‡à¦° à¦¬à¦¾à¦Ÿà¦¨ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "256",
    "date": "2026-09-14T10:30",
    "type": "Business Logic",
    "module": "Final Settlement Configuration",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Enhanced Final Settlement: added options in Settlement Type Configuration to choose between Year Basis and Day Basis for calculations, along with a toggle to count the present day. When Day Basis is selected, the configuration table dynamically updates from Year/Month/Day columns to a single Min. Service Days field, and the engine evaluates tiers accordingly.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦¹à¦¿à¦¸à¦¾à¦¬ à¦†à¦°à§‹ à¦‰à¦¨à§�à¦¨à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦ªà¦²à¦¿à¦¸à¦¿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨à§‡ à¦¬à¦›à¦° à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• (Year Basis) à¦¬à¦¾ à¦¦à¦¿à¦¨ à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• (Day Basis) à¦¹à¦¿à¦¸à¦¾à¦¬ à¦�à¦¬à¦‚ à¦¬à¦°à§�à¦¤à¦®à¦¾à¦¨ à¦¦à¦¿à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾à¦° à¦Ÿà¦—à¦² à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¡à§‡ à¦¬à§‡à¦¸à¦¿à¦¸ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦²à§‡ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦Ÿà§‡à¦¬à¦¿à¦²à¦Ÿà¦¿ à¦¬à¦›à¦°/à¦®à¦¾à¦¸/à¦¦à¦¿à¦¨à§‡à¦° à¦•à¦²à¦¾à¦® à¦¥à§‡à¦•à§‡ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¿à¦¤ à¦¹à§Ÿà§‡ à¦¶à§�à¦§à§� 'Min. Service Days' à¦‡à¦¨à¦ªà§�à¦Ÿà§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦¹à§Ÿà¥¤"
  },
  {
    "id": "255",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Completely redesigned the Employee Doc Verification page: cleaner table with live document progress bars, a polished full-screen review modal, fully functional Verify / Reject / Verify-All / Complete Verification buttons, a dedicated Reject Dialog with quick-reason presets and a custom text area, and an improved scan viewer with OCR match/mismatch highlighting.",
    "descriptionBn": "Employee Doc Verification à¦ªà§‡à¦œà¦Ÿà¦¿ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¨à¦¤à§�à¦¨ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦ªà§�à¦°à¦—à§�à¦°à§‡à¦¸ à¦¬à¦¾à¦° à¦¯à§‹à¦— à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦°à¦¿à¦­à¦¿à¦‰ à¦®à¦¡à¦¾à¦² à¦†à¦°à§‹ à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦° à¦“ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à¦¹à¦¯à¦¼à§‡à¦›à§‡, Verify / Reject / Verify All / Complete Verification à¦¬à¦¾à¦Ÿà¦¨ à¦¸à¦ à¦¿à¦•à¦­à¦¾à¦¬à§‡ à¦•à¦¾à¦œ à¦•à¦°à¦›à§‡, Reject à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦†à¦²à¦¾à¦¦à¦¾ à¦¡à¦¾à¦¯à¦¼à¦¾à¦²à¦— à¦¬à¦•à§�à¦¸ à¦�à¦¸à§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦ªà§�à¦°à¦¿-à¦¸à§‡à¦Ÿ à¦°à¦¿à¦œà¦¨ à¦�à¦¬à¦‚ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦°à¦¿à¦œà¦¨ à¦²à§‡à¦–à¦¾à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦†à¦›à§‡, à¦�à¦¬à¦‚ à¦¸à§�à¦•à§�à¦¯à¦¾à¦¨ à¦­à¦¿à¦‰à¦¯à¦¼à¦¾à¦°à§‡ OCR à¦®à§�à¦¯à¦¾à¦š à¦“ à¦®à¦¿à¦¸à¦®à§�à¦¯à¦¾à¦š à¦†à¦°à§‹ à¦¸à§�à¦ªà¦·à§�à¦Ÿà¦­à¦¾à¦¬à§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¯à¦¼à¥¤"
  },
  {
    "id": "254",
    "date": "2026-09-14T10:30",
    "type": "Business Logic",
    "module": "Final Settlement Configuration",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Made the Final Settlement compensation calculation fully dynamic: replaced 4 hardcoded day-bracket fields with a configurable 'Compensation Tiers' table (Year / Month / Day â†’ Days per Year). HR can now add, edit, or remove tiers for each settlement type directly from the configuration page. The calculation engine reads from this config automatically.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦•à§�à¦·à¦¤à¦¿à¦ªà§‚à¦°à¦£ à¦¹à¦¿à¦¸à¦¾à¦¬ à¦�à¦–à¦¨ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦• à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦†à¦—à§‡à¦° à§ªà¦Ÿà¦¿ à¦¹à¦¾à¦°à§�à¦¡à¦•à§‹à¦¡à§‡à¦¡ à¦¬à§�à¦°à§�à¦¯à¦¾à¦•à§‡à¦Ÿà§‡à¦° à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à§‡ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦Ÿà¦¾à¦‡à¦ªà§‡à¦° à¦œà¦¨à§�à¦¯ 'Compensation Tiers' à¦Ÿà§‡à¦¬à¦¿à¦² à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ HR à¦¨à¦¿à¦œà§‡à¦‡ à¦¬à¦›à¦°/à¦®à¦¾à¦¸/à¦¦à¦¿à¦¨ à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦Ÿà¦¾à¦¯à¦¼à¦¾à¦° à¦¯à§‹à¦—, à¦¸à¦®à§�à¦ªà¦¾à¦¦à¦¨à¦¾ à¦¬à¦¾ à¦®à§�à¦›à§‡ à¦«à§‡à¦²à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨ à¦�à¦¬à¦‚ à¦¹à¦¿à¦¸à¦¾à¦¬ à¦¸à§�à¦¬à¦¯à¦¼à¦‚à¦•à§�à¦°à¦¿à¦¯à¦¼à¦­à¦¾à¦¬à§‡ à¦¸à§‡à¦‡ à¦•à¦¨à¦«à¦¿à¦— à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦¹à¦¬à§‡à¥¤"
  },
  {
    "id": "253",
    "date": "2026-09-14T10:30",
    "type": "Business Logic",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Updated Final Settlement compensation calculation to use exact Year + Month + Day business rules with 8 service tiers (SL1â€“SL8): e.g. 2Y 11M 30D+ â†’ 7 days/yr, 3Yâ€“8Y 11M â†’ 15 days/yr, 9Y 11M 30D+ or 10Y+ â†’ 30 days/yr. Now stores Month and Day service period fields alongside Year for precise tier matching.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦•à§�à¦·à¦¤à¦¿à¦ªà§‚à¦°à¦£ à¦¹à¦¿à¦¸à¦¾à¦¬ à¦�à¦–à¦¨ à¦¸à¦ à¦¿à¦• à¦¬à¦›à¦° + à¦®à¦¾à¦¸ + à¦¦à¦¿à¦¨à§‡à¦° à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦¤à§‡ à§®à¦Ÿà¦¿ à¦¸à¦¾à¦°à§�à¦­à¦¿à¦¸ à¦Ÿà¦¾à¦¯à¦¼à¦¾à¦° (SL1â€“SL8) à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦—à¦£à¦¨à¦¾ à¦•à¦°à¦¾ à¦¹à¦¬à§‡à¥¤ à¦¯à§‡à¦®à¦¨: à§¨ à¦¬à¦›à¦° à§§à§§ à¦®à¦¾à¦¸ à§©à§¦+ à¦¦à¦¿à¦¨ â†’ à§­ à¦¦à¦¿à¦¨/à¦¬à¦›à¦°, à§©â€“à§® à¦¬à¦›à¦° â†’ à§§à§« à¦¦à¦¿à¦¨/à¦¬à¦›à¦°, à§¯ à¦¬à¦›à¦° à§§à§§ à¦®à¦¾à¦¸ à§©à§¦+ à¦¦à¦¿à¦¨ à¦¬à¦¾ à§§à§¦+ à¦¬à¦›à¦° â†’ à§©à§¦ à¦¦à¦¿à¦¨/à¦¬à¦›à¦°à¥¤"
  },
  {
    "id": "252",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Created the Employee Doc Verification page with interactive side-by-side OCR scan review console and individual verification actions (Approve/Reject) per document. Added approvals menu item and topbar integration.",
    "descriptionBn": "à¦•à¦°à§�à¦®à¦šà¦¾à¦°à§€à¦¦à§‡à¦° à¦†à¦ªà¦²à§‹à¦¡à¦•à§ƒà¦¤ à¦ªà§�à¦°à§Ÿà§‹à¦œà¦¨à§€à§Ÿ à¦•à¦¾à¦—à¦œà¦ªà¦¤à§�à¦° à¦“ à¦¸à¦¾à¦°à§�à¦Ÿà¦¿à¦«à¦¿à¦•à§‡à¦Ÿ à¦¯à¦¾à¦šà¦¾à¦‡à§Ÿà§‡à¦° à¦œà¦¨à§�à¦¯ 'Employee Doc Verification' à¦«à¦¿à¦šà¦¾à¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦†à¦²à¦¾à¦¦à¦¾ à¦†à¦²à¦¾à¦¦à¦¾à¦­à¦¾à¦¬à§‡ (à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­/à¦°à¦¿à¦œà§‡à¦•à§�à¦Ÿ) à¦¯à¦¾à¦šà¦¾à¦‡ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡ à¦�à¦¬à¦‚ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦• à¦�à¦†à¦‡-à¦“à¦¸à¦¿à¦†à¦° à¦¸à§�à¦•à§�à¦¯à¦¾à¦¨ à¦­à¦¿à¦‰à§Ÿà¦¾à¦°à§‡à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦¤à§�à¦²à¦¨à¦¾ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "251",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Final Settlement Configuration",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Upgraded all configuration lists to fully responsive, clean HTML tables, resolving layout wraps and headers misalignment. Formatted compensation rate columns with robust fallback checks.",
    "descriptionBn": "à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦¤à¦¾à¦²à¦¿à¦•à¦¾à¦° à¦—à§�à¦°à¦¿à¦¡ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ à¦¦à§ƒà¦·à§�à¦Ÿà¦¿à¦¨à¦¨à§�à¦¦à¦¨ à¦“ à¦°à§‡à¦¸à¦ªà¦¨à¦¸à¦¿à¦­ HTML à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à¦¾à¦° à¦«à¦²à§‡ à¦•à¦²à¦¾à¦®à§‡à¦° à¦®à¦¿à¦¸-à¦…à§�à¦¯à¦¾à¦²à¦¾à¦‡à¦¨à¦®à§‡à¦¨à§�à¦Ÿ à¦¸à¦®à¦¸à§�à¦¯à¦¾ à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "250",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Upgraded the detail print view header with a clean flex layout displaying the employee's ID badge photo. Expanded the mock profiles database to allow real-time calculations and accurate photo loads for all listed users.",
    "descriptionBn": "à¦¡à¦¿à¦Ÿà§‡à¦‡à¦² à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰ à¦¹à§‡à¦¡à¦¾à¦° à¦‰à¦¨à§�à¦¨à¦¤ à¦•à¦°à§‡ à¦•à¦°à§�à¦®à¦šà¦¾à¦°à§€à¦° à¦†à¦‡à¦¡à¦¿ à¦¬à§�à¦¯à¦¾à¦œ à¦›à¦¬à¦¿ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¨à§‡à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦›à¦¾à§œà¦¾à¦“ à¦¸à¦•à¦² à¦•à¦°à§�à¦®à¦šà¦¾à¦°à§€à¦° à¦œà¦¨à§�à¦¯ à¦°à¦¿à¦¯à¦¼à§‡à¦²-à¦Ÿà¦¾à¦‡à¦® à¦¹à¦¿à¦¸à¦¾à¦¬à¦¨à¦¿à¦•à¦¾à¦¶ à¦�à¦¬à¦‚ à¦¸à¦ à¦¿à¦• à¦›à¦¬à¦¿ à¦²à§‹à¦¡ à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦¡à§‡à¦Ÿà¦¾à¦¬à§‡à¦¸ à¦ªà§�à¦°à¦¸à¦¾à¦°à¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "249",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Added diverse mock settlement records with varying settlement types (Resignation, Termination, Retirement, Dismissal, Death) and configured custom color status badges in the list view.",
    "descriptionBn": "à¦²à¦¿à¦¸à§�à¦Ÿ à¦­à¦¿à¦‰à¦¤à§‡ à¦¬à¦¿à¦­à¦¿à¦¨à§�à¦¨ à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿à¦° à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦°à§‡à¦•à¦°à§�à¦¡ (à¦ªà¦¦à¦¤à§�à¦¯à¦¾à¦—, à¦›à¦¾à¦�à¦Ÿà¦¾à¦‡, à¦…à¦¬à¦¸à¦°, à¦¬à¦°à¦–à¦¾à¦¸à§�à¦¤, à¦®à§ƒà¦¤à§�à¦¯à§�) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿à¦° à¦œà¦¨à§�à¦¯ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦°à¦™à§‡à¦° à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦¬à§�à¦¯à¦¾à¦œ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦•à¦¾à¦²à¦¿ à¦¦à§‡à¦–à¦¾à¦¨à§‹à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "248",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Added a styled employee photo avatar slot to the Employee Information panel, displaying mock profiles photos for loaded users.",
    "descriptionBn": "à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦‡à¦¨à¦«à¦°à¦®à§‡à¦¶à¦¨ à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦²à§‡ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦›à¦¬à¦¿à¦° à¦œà¦¨à§�à¦¯ à¦�à¦•à¦Ÿà¦¿ à¦¦à§ƒà¦·à§�à¦Ÿà¦¿à¦¨à¦¨à§�à¦¦à¦¨ à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦¸à§�à¦²à¦Ÿ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à¦¾à¦¥à§‡ à¦¸à§�à¦¬à§Ÿà¦‚à¦•à§�à¦°à¦¿à§Ÿà¦­à¦¾à¦¬à§‡ à¦›à¦¬à¦¿ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¿à¦¤ à¦¹à§Ÿà¥¤"
  },
  {
    "id": "247",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Added accordion toggles to all final settlement sections. Toggling a section's header or checkbox expands/collapses the card and dynamically updates calculations to exclude unchecked sections.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦¸à¦¬ à¦•à¦¾à¦°à§�à¦¡à§‡ à¦…à§�à¦¯à¦¾à¦•à§‹à¦°à§�à¦¡à¦¿à§Ÿà¦¾à¦¨ à¦Ÿà¦—à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦•à§‹à¦¨à§‹ à¦¸à§‡à¦•à¦¶à¦¨à§‡à¦° à¦¹à§‡à¦¡à¦¾à¦° à¦¬à¦¾ à¦šà§‡à¦• à¦¬à¦•à§�à¦¸ à¦Ÿà¦—à¦² à¦•à¦°à¦²à§‡ à¦•à¦¾à¦°à§�à¦¡à¦Ÿà¦¿ à¦ªà§�à¦°à¦¸à¦¾à¦°à¦¿à¦¤/à¦¸à¦‚à¦•à§�à¦šà¦¿à¦¤ à¦¹à¦¬à§‡ à¦�à¦¬à¦‚ à¦†à¦¨à¦šà§‡à¦• à¦•à¦°à¦¾ à¦¸à§‡à¦•à¦¶à¦¨ à¦¸à§�à¦¬à§Ÿà¦‚à¦•à§�à¦°à¦¿à§Ÿà¦­à¦¾à¦¬à§‡ à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦¶à¦¨ à¦¥à§‡à¦•à§‡ à¦¬à¦¾à¦¦ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "246",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Polished and modernized the Salary Information, Earn Leave Encashment, Service Benefit, Compensation Additions, and Deductions sections on the Final Settlement form. Replaced raw tables and flat text with custom stat cards, badge elements, structured layouts, and currency formatting for a highly professional view.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦«à¦°à§�à¦®à§‡à¦° à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦‡à¦¨à¦«à¦°à¦®à§‡à¦¶à¦¨, à¦…à¦°à§�à¦œà¦¿à¦¤ à¦›à§�à¦Ÿà¦¿ à¦¨à¦—à¦¦à§€à¦•à¦°à¦£, à¦¸à¦¾à¦°à§�à¦­à¦¿à¦¸ à¦¬à§‡à¦¨à¦¿à¦«à¦¿à¦Ÿ, à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ à¦•à§�à¦·à¦¤à¦¿à¦ªà§‚à¦°à¦£ à¦�à¦¬à¦‚ à¦¡à¦¿à¦¡à¦¾à¦•à¦¶à¦¨ à¦¸à§‡à¦•à¦¶à¦¨à¦—à§�à¦²à§‹à¦° à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦†à¦§à§�à¦¨à¦¿à¦• à¦“ à¦¦à§ƒà¦·à§�à¦Ÿà¦¿à¦¨à¦¨à§�à¦¦à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦ªà§�à¦²à§‡à¦‡à¦¨ à¦Ÿà§‡à¦¬à¦¿à¦² à¦“ à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿà§‡à¦° à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à§‡ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿ à¦•à¦¾à¦°à§�à¦¡, à¦¬à§�à¦¯à¦¾à¦œ à¦�à¦²à¦¿à¦®à§‡à¦¨à§�à¦Ÿ, à¦ªà¦°à¦¿à¦ªà¦¾à¦Ÿà¦¿ à¦²à§‡à¦†à¦‰à¦Ÿ à¦�à¦¬à¦‚ à¦²à§‹à¦•à¦¾à¦² à¦•à¦¾à¦°à§‡à¦¨à§�à¦¸à¦¿ à¦«à¦°à¦®à§�à¦¯à¦¾à¦Ÿà¦¿à¦‚ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "245",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Implemented dynamic calculations for Notice Pay, Notice Shortage Deduction, Tiered Service Compensation, Earned Leave Encashment, and Provident Fund payout using live configurations stored in LocalStorage. Added three mock employee profiles (Tahmid Afsar, Anika Rahman, Sabbir Ahmed) to showcase various service lengths and rule combinations.",
    "descriptionBn": "à¦²à§‹à¦•à¦¾à¦² à¦¸à§�à¦Ÿà§‹à¦°à§‡à¦œà§‡ à¦¸à¦‚à¦°à¦•à§�à¦·à¦¿à¦¤ à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§‡ à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦ªà§‡, à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦¶à¦°à§�à¦Ÿà§‡à¦œ à¦¡à¦¿à¦¡à¦¾à¦•à¦¶à¦¨, à¦¸à¦¾à¦°à§�à¦­à¦¿à¦¸ à¦²à§‡à¦¨à§�à¦¥à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦•à§�à¦·à¦¤à¦¿à¦ªà§‚à¦°à¦£, à¦…à¦°à§�à¦œà¦¿à¦¤ à¦›à§�à¦Ÿà¦¿ à¦¨à¦—à¦¦à§€à¦•à¦°à¦£ à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦­à¦¿à¦¡à§‡à¦¨à§�à¦Ÿ à¦«à¦¾à¦¨à§�à¦¡ à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦¡à¦¾à§Ÿà¦¨à¦¾à¦®à¦¿à¦• à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦¶à¦¨ à¦‡à¦žà§�à¦œà¦¿à¦¨ à¦šà¦¾à¦²à§� à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¬à¦¿à¦­à¦¿à¦¨à§�à¦¨ à¦®à§‡à§Ÿà¦¾à¦¦à§‡à¦° à¦�à¦¬à¦‚ à¦¨à¦¿à§Ÿà¦®à§‡à¦° à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¨à§‡à¦° à¦œà¦¨à§�à¦¯ à¦¤à¦¿à¦¨à¦Ÿà¦¿ à¦¡à§‡à¦®à§‹ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² (à¦¤à¦¾à¦¹à¦®à¦¿à¦¦ à¦†à¦«à¦¸à¦¾à¦°, à¦†à¦¨à¦¿à¦•à¦¾ à¦°à¦¹à¦®à¦¾à¦¨, à¦¸à¦¾à¦¬à§�à¦¬à¦¿à¦° à¦†à¦¹à¦®à§‡à¦¦) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "244",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Redesigned the Configuration & Records section of the Final Settlement form. Reorganized all inputs (Employee ID, dates, and settings) into a single, cohesive, modern 6-column responsive grid layout with a polished header, and placed the 'Load' button inline with the Employee ID input.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦«à¦°à§�à¦®à§‡à¦° 'à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦“ à¦°à§‡à¦•à¦°à§�à¦¡à¦¸' à¦¸à§‡à¦•à¦¶à¦¨à¦Ÿà¦¿à¦° à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¸à¦¬ à¦‡à¦¨à¦ªà§�à¦Ÿ à¦«à¦¿à¦²à§�à¦¡à¦•à§‡ (à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦†à¦‡à¦¡à¦¿, à¦¤à¦¾à¦°à¦¿à¦– à¦�à¦¬à¦‚ à¦…à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¯ à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸) à¦�à¦•à¦Ÿà¦¿ à¦†à¦§à§�à¦¨à¦¿à¦• à¦“ à¦¸à§�à¦¨à§�à¦¦à¦° à§¬-à¦•à¦²à¦¾à¦® à¦°à§‡à¦¸à¦ªà¦¨à§�à¦¸à¦¿à¦­ à¦—à§�à¦°à¦¿à¦¡ à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ 'Load' à¦¬à¦¾à¦Ÿà¦¨à¦Ÿà¦¿à¦•à§‡ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦†à¦‡à¦¡à¦¿ à¦‡à¦¨à¦ªà§�à¦Ÿà§‡à¦° à¦ªà¦¾à¦¶à§‡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "243",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Final Settlement",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Removed the BLA 2006 Quick Reference statutory guide sections from the Notice Period Policy and Service Period Policy creation/edit modals.",
    "descriptionBn": "à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦ªà¦¿à¦°à¦¿à¦¯à¦¼à¦¡ à¦�à¦¬à¦‚ à¦¸à¦¾à¦°à§�à¦­à¦¿à¦¸ à¦ªà¦¿à¦°à¦¿à¦¯à¦¼à¦¡ à¦ªà¦²à¦¿à¦¸à¦¿ à¦¤à§ˆà¦°à¦¿à¦° à¦®à§‹à¦¡à¦¾à¦²à¦—à§�à¦²à§‹ à¦¥à§‡à¦•à§‡ à¦¬à¦¿à¦�à¦²à¦� à§¨à§¦à§¦à§¬ à¦•à§�à¦‡à¦• à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦—à¦¾à¦‡à¦¡ à¦¸à§‡à¦•à¦¶à¦¨à¦—à§�à¦²à§‹ à¦¬à¦¾à¦¦ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "242",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Final Settlement",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Reorganized the Compensation and Gratuity configuration input fields from a single line into a neat two-line layout inside the modal for a cleaner and better view.",
    "descriptionBn": "à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦­à§‡à¦¤à¦°à§‡ à¦•à§�à¦·à¦¤à¦¿à¦ªà§‚à¦°à¦£ à¦�à¦¬à¦‚ à¦—à§�à¦°à§�à¦¯à¦¾à¦šà§�à¦‡à¦Ÿà¦¿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨à§‡à¦° à¦‡à¦¨à¦ªà§�à¦Ÿ à¦«à¦¿à¦²à§�à¦¡à¦—à§�à¦²à§‹à¦•à§‡ à¦�à¦• à¦²à¦¾à¦‡à¦¨à§‡à¦° à¦¬à¦¦à¦²à§‡ à¦¸à§�à¦¨à§�à¦¦à¦°à¦­à¦¾à¦¬à§‡ à¦¦à§�à¦‡ à¦²à¦¾à¦‡à¦¨à§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à§‡à¦¨ à¦¦à§‡à¦–à¦¤à§‡ à¦“ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¤à§‡ à¦†à¦°à¦“ à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¹à§Ÿà¥¤"
  },
  {
    "id": "241",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Compensation Days/Year now supports 4 tiers: 3+ years, 5+ years, under 10 years, and 10+ years. HR can now configure custom compensation rates for each service length bracket per settlement type.",
    "descriptionBn": "à¦•à¦®à¦ªà§‡à¦¨à¦¸à§‡à¦¶à¦¨ à¦¡à§‡à¦œ/à¦‡à¦¯à¦¼à¦¾à¦° à¦�à¦–à¦¨ à§ªà¦Ÿà¦¿ à¦¸à§�à¦¤à¦°à§‡ à¦­à¦¾à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à§©+ à¦¬à¦›à¦°, à§«+ à¦¬à¦›à¦°, à§§à§¦ à¦¬à¦›à¦°à§‡à¦° à¦¨à¦¿à¦šà§‡ à¦�à¦¬à¦‚ à§§à§¦+ à¦¬à¦›à¦°à¥¤ à¦�à¦‡à¦šà¦†à¦° à¦�à¦–à¦¨ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦Ÿà¦¾à¦‡à¦ªà§‡à¦° à¦œà¦¨à§�à¦¯ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦¸à¦¾à¦°à§�à¦­à¦¿à¦¸ à¦¦à§ˆà¦°à§�à¦˜à§�à¦¯à§‡à¦° à¦œà¦¨à§�à¦¯ à¦†à¦²à¦¾à¦¦à¦¾ à¦°à§‡à¦Ÿ à¦¸à§‡à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "240",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Deep legal analysis completed: all 12 Final Settlement Types, 8 Notice Period policies, and 9 Service Period rules are now fully aligned with the Bangladesh Labour Act, 2006 (amended 2013). Each type now carries a legal BLA section reference, two-tier compensation rates (<10 yrs / â‰¥10 yrs), separate flags for Gratuity, PF, Earned Leave, Misconduct, and Death in Service â€” all editable by HR.",
    "descriptionBn": "à¦—à¦­à§€à¦° à¦†à¦‡à¦¨à¦¿ à¦¬à¦¿à¦¶à§�à¦²à§‡à¦·à¦£ à¦¸à¦®à§�à¦ªà¦¨à§�à¦¨: à¦¸à¦•à¦² à§§à§¨à¦Ÿà¦¿ à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦Ÿà¦¾à¦‡à¦ª, à§®à¦Ÿà¦¿ à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦ªà¦¿à¦°à¦¿à¦¯à¦¼à¦¡ à¦¨à§€à¦¤à¦¿ à¦�à¦¬à¦‚ à§¯à¦Ÿà¦¿ à¦¸à¦¾à¦°à§�à¦­à¦¿à¦¸ à¦ªà¦¿à¦°à¦¿à¦¯à¦¼à¦¡ à¦¨à¦¿à¦¯à¦¼à¦® à¦�à¦–à¦¨ à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶ à¦¶à§�à¦°à¦® à¦†à¦‡à¦¨ à§¨à§¦à§¦à§¬ (à¦¸à¦‚à¦¶à§‹à¦§à¦¿à¦¤ à§¨à§¦à§§à§©) à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£à¦­à¦¾à¦¬à§‡ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦Ÿà¦¾à¦‡à¦ªà§‡ à¦�à¦–à¦¨ à¦†à¦‡à¦¨à¦¿ à¦§à¦¾à¦°à¦¾à¦° à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸, à¦¦à§�à¦‡ à¦¸à§�à¦¤à¦°à§‡à¦° à¦•à§�à¦·à¦¤à¦¿à¦ªà§‚à¦°à¦£à§‡à¦° à¦¹à¦¾à¦°, à¦—à§�à¦°à§�à¦¯à¦¾à¦šà§�à¦‡à¦Ÿà¦¿, à¦ªà¦¿à¦�à¦«, à¦…à¦°à§�à¦œà¦¿à¦¤ à¦›à§�à¦Ÿà¦¿à¦° à¦�à¦¨à¦•à§�à¦¯à¦¾à¦¶à¦®à§‡à¦¨à§�à¦Ÿ, à¦…à¦¸à¦¦à¦¾à¦šà¦°à¦£ à¦�à¦¬à¦‚ à¦®à§ƒà¦¤à§�à¦¯à§�à¦œà¦¨à¦¿à¦¤ à¦•à§‡à¦¸à§‡à¦° à¦œà¦¨à§�à¦¯ à¦†à¦²à¦¾à¦¦à¦¾ à¦¸à§�à¦‡à¦š à¦°à¦¯à¦¼à§‡à¦›à§‡ â€” à¦¯à¦¾ à¦�à¦‡à¦šà¦†à¦° à¦¨à¦¿à¦œà§‡à¦‡ à¦ªà¦°à¦¿à¦šà¦¾à¦²à¦¨à¦¾ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "239",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Notice Period Policies and Service Period Requirements are now fully dynamic. HR can manage exact rules based on employee types, payment basis, and specific benefit types like Gratuity and Leave Encashment.",
    "descriptionBn": "à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦ªà¦¿à¦°à¦¿à¦¯à¦¼à¦¡ à¦�à¦¬à¦‚ à¦¸à¦¾à¦°à§�à¦­à¦¿à¦¸ à¦ªà¦¿à¦°à¦¿à¦¯à¦¼à¦¡à§‡à¦° à¦¨à¦¿à¦¯à¦¼à¦®à¦—à§�à¦²à¦¿ à¦�à¦–à¦¨ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦•à¥¤ à¦�à¦‡à¦šà¦†à¦° à¦�à¦–à¦¨ à¦•à¦°à§�à¦®à§€à¦° à¦§à¦°à¦¨ à¦�à¦¬à¦‚ à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦­à¦¿à¦¤à§�à¦¤à¦¿ à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦¨à§‹à¦Ÿà¦¿à¦¶à§‡à¦° à¦¨à¦¿à¦¯à¦¼à¦® à¦�à¦¬à¦‚ à¦—à§�à¦°à§�à¦¯à¦¾à¦šà§�à¦‡à¦Ÿà¦¿à¦° à¦®à¦¤à§‹ à¦¸à§�à¦¬à¦¿à¦§à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦¨à§�à¦¯à§‚à¦¨à¦¤à¦® à¦¸à¦¾à¦°à§�à¦­à¦¿à¦¸à§‡à¦° à¦¸à¦®à¦¯à¦¼à¦•à¦¾à¦² à¦ªà¦°à¦¿à¦šà¦¾à¦²à¦¨à¦¾ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "238",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Implemented fully dynamic Final Settlement Policy configuration. HR can now add, edit, and manage custom settlement types with specific notice periods, compensation rules, and leave encashment settings based on Bangladesh Labour Act.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦ªà¦²à¦¿à¦¸à¦¿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦• à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦‡à¦šà¦†à¦° à¦�à¦–à¦¨ à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶ à¦¶à§�à¦°à¦® à¦†à¦‡à¦¨ à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦Ÿà¦¾à¦‡à¦ª à¦¯à§‹à¦— à¦�à¦¬à¦‚ à¦�à¦¡à¦¿à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦ªà¦¿à¦°à¦¿à¦¯à¦¼à¦¡ à¦�à¦¬à¦‚ à¦•à§�à¦·à¦¤à¦¿à¦ªà§‚à¦°à¦£à§‡à¦° à¦¨à¦¿à¦¯à¦¼à¦® à¦¸à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "237",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Updated Final Settlement module to align with Bangladesh Labour Act standards. Separated Settlement Types from Components, introduced 12 distinct settlement types, and implemented dynamic demo calculations for Resignation, Termination, Dismissal, Retirement, etc.",
    "descriptionBn": "à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶ à¦¶à§�à¦°à¦® à¦†à¦‡à¦¨ à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦®à¦¡à¦¿à¦‰à¦² à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦Ÿà¦¾à¦‡à¦ª à¦�à¦¬à¦‚ à¦•à¦®à§�à¦ªà§‹à¦¨à§‡à¦¨à§�à¦Ÿ à¦†à¦²à¦¾à¦¦à¦¾ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à§§à§¨à¦Ÿà¦¿ à¦­à¦¿à¦¨à§�à¦¨ à¦Ÿà¦¾à¦‡à¦ª à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦°à¦¿à¦œà¦¾à¦‡à¦¨, à¦Ÿà¦¾à¦°à§�à¦®à¦¿à¦¨à§‡à¦¶à¦¨, à¦¡à¦¿à¦¸à¦®à¦¿à¦¸à¦¾à¦² à¦‡à¦¤à§�à¦¯à¦¾à¦¦à¦¿à¦° à¦œà¦¨à§�à¦¯ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦• à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦¶à¦¨ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "236",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Redesigned the Final Settlement execution page. Transformed the layout into a clean, modern, flat UI featuring unified grid-based data fields, colorful distinct sections for benefits/deductions, and borderless bottom-lined inputs for an elevated aesthetic experience.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦�à¦•à§�à¦¸à¦¿à¦•à¦¿à¦‰à¦¶à¦¨ à¦ªà§‡à¦œà¦Ÿà¦¿à¦° à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦ªà§‡à¦œà¦Ÿà¦¿à¦•à§‡ à¦�à¦–à¦¨ à¦�à¦•à¦Ÿà¦¿ à¦®à¦¡à¦¾à¦°à§�à¦¨, à¦«à§�à¦²à§�à¦¯à¦¾à¦Ÿ à¦‡à¦‰à¦†à¦‡-à¦¤à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦—à§�à¦°à¦¿à¦¡ à¦²à§‡à¦†à¦‰à¦Ÿ, à¦†à¦•à¦°à§�à¦·à¦£à§€à§Ÿ à¦°à¦™à§‡à¦° à¦¸à§‡à¦•à¦¶à¦¨ à¦�à¦¬à¦‚ à¦¸à§�à¦¨à§�à¦¦à¦° à¦¬à¦°à§�à¦¡à¦¾à¦°à¦²à§‡à¦¸ à¦‡à¦¨à¦ªà§�à¦Ÿ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "235",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Final Settlement",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Added a new Final Settlement Configuration page with three tabs: Notice Deduction, Final Settlement Type, and Service Period Setup. Users can now easily customize settings and save configurations.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨à§‡à¦° à¦œà¦¨à§�à¦¯ à¦�à¦•à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ à¦ªà§‡à¦œ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦¤à¦¿à¦¨à¦Ÿà¦¿ à¦Ÿà§�à¦¯à¦¾à¦¬ à¦°à¦¯à¦¼à§‡à¦›à§‡: à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦¡à¦¿à¦¡à¦¾à¦•à¦¶à¦¨, à¦«à¦¾à¦‡à¦¨à¦¾à¦² à¦¸à§‡à¦Ÿà§‡à¦²à¦®à§‡à¦¨à§�à¦Ÿ à¦Ÿà¦¾à¦‡à¦ª à¦�à¦¬à¦‚ à¦¸à¦¾à¦°à§�à¦­à¦¿à¦¸ à¦ªà¦¿à¦°à¦¿à§Ÿà¦¡ à¦¸à§‡à¦Ÿà¦†à¦ªà¥¤ à¦�à¦–à¦¨ à¦–à§�à¦¬ à¦¸à¦¹à¦œà§‡à¦‡ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦�à¦¬à¦‚ à¦¸à§‡à¦­ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "234",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "System Settings",
    "link": "/changes",
    "descriptionEn": "Fixed a typing issue where 'UX Optimization' was missing from the list of allowed change types.",
    "descriptionBn": "à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦® à¦†à¦ªà¦¡à§‡à¦Ÿà§‡à¦° à¦¤à¦¾à¦²à¦¿à¦•à¦¾à§Ÿ 'UX Optimization' à¦Ÿà¦¾à¦‡à¦ªà¦Ÿà¦¿ à¦…à¦ªà¦¶à¦¨ à¦¹à¦¿à¦¸à§‡à¦¬à§‡ à¦¨à¦¾ à¦¥à¦¾à¦•à¦¾à¦° à¦¸à¦®à¦¸à§�à¦¯à¦¾à¦Ÿà¦¿ à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "233",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Payroll Reports",
    "link": "/monthly-salary-details",
    "descriptionEn": "Created the new 'Monthly Salary Details' report page. Added advanced filter options (Year, Month, Department, etc.), populated the datatable with real-time employee salary structures, and integrated a comprehensive suite of report generation action buttons at the bottom.",
    "descriptionBn": "à¦¨à¦¤à§�à¦¨ 'Monthly Salary Details' à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦ªà§‡à¦‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦–à¦¾à¦¨à§‡ à¦…à§�à¦¯à¦¾à¦¡à¦­à¦¾à¦¨à§�à¦¸à¦¡ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦…à¦ªà¦¶à¦¨ (Year, Month, Department, à¦‡à¦¤à§�à¦¯à¦¾à¦¦à¦¿) à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¸à§�à¦Ÿà§�à¦°à¦¾à¦•à¦šà¦¾à¦° à¦¦à¦¿à§Ÿà§‡ à¦¡à¦¾à¦Ÿà¦¾à¦Ÿà§‡à¦¬à¦¿à¦² à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦�à¦¬à¦‚ à¦ªà§‡à¦‡à¦œà§‡à¦° à¦¨à¦¿à¦šà§‡ à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿ à¦œà§‡à¦¨à¦¾à¦°à§‡à¦Ÿ à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦ªà§�à¦°à§Ÿà§‹à¦œà¦¨à§€à§Ÿ à¦¸à¦¬ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦Ÿà¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "232",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Implemented a structured table layout for the Loan Terms & Details section inside the details modal. Utilizes a light-gray table header and borderless table row design matching the styling of the other master data tables.",
    "descriptionBn": "Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¨ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¨ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¸ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â«Ã Â¦Â°Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â§â€¡ Ã Â¦Â°Ã Â§â€šÃ Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å¸-Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¹Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¹Ã Â§â‚¬Ã Â¦Â¨ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â°Ã Â§â€¹ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â®Ã Â¦Å¾Ã Â§ï¿½Ã Â¦Å“Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£Ã Â¥Â¤"
  },
  {
    "id": "231",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Refined the Loan Terms details grid layout for a cleaner and more professional presentation. Replaced spreadsheet-like vertical divider lines with an aligned borderless grid system, and standardized all value colors and font sizes to prevent a clashing layout.",
    "descriptionBn": "Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¨ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¸ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â² Ã Â¦â€œ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Å¡Ã Â§ï¿½Ã Â¦â€ºÃ Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¤Ã Â§â€¹ Ã Â¦â€¦Ã Â¦Â¨Ã Â¦Â®Ã Â¦Â¨Ã Â§â‚¬Ã Â§Å¸ Ã Â¦â€“Ã Â¦Â¾Ã Â¦ï¿½Ã Â§Å“Ã Â¦Â¾ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â­Ã Â¦Â¾Ã Â¦Å“Ã Â¦â€¢ Ã Â¦Â°Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â²Ã Â§â‚¬Ã Â¦Â² Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¹Ã Â§â‚¬Ã Â¦Â¨ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¡ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â® Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â¬ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â° Ã Â¦Â«Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“ Ã Â¦â€œ Ã Â¦Â°Ã Â¦â„¢ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦â€¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¶ Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â¥Â¤"
  },
  {
    "id": "230",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Separated main tabs content sections in the details modal using clean horizontal dividers. Replaced blocky nested white cards in the timeline, projections, and comments sections with borderless flat areas divided by thin solid separator lines for a more professional, cohesive layout.",
    "descriptionBn": "Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â§â€šÃ Â¦Â² Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Å¡Ã Â§ï¿½Ã Â¦â€ºÃ Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â¹Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â­Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¦Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â®Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨, Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Å“Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦â€¢Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¸ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦â€œ Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¤Ã Â¦Â²Ã Â¦Â¾ Ã Â¦Â¸Ã Â§â€¹Ã Â¦Å“Ã Â¦Â¾ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â­Ã Â¦Â¾Ã Â¦Å“Ã Â¦â€¢ Ã Â¦Â°Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¤Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â² Ã Â¦â€œ Ã Â¦â€”Ã Â§â€¹Ã Â¦â€ºÃ Â¦Â¾Ã Â¦Â¨Ã Â§â€¹Ã Â¥Â¤"
  },
  {
    "id": "229",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Polished the details modal styling for a cleaner and less bulky aesthetic. Reduced typography weights (replaced heavy font-black with font-bold or font-semibold), consolidated font sizes (made details metrics flat text-base), and compacted modal frames, headers, switcher containers, and footer buttons.",
    "descriptionBn": "Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¸ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Å¡Ã Â§ï¿½Ã Â¦â€ºÃ Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â²Ã Â¦â€¢Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â«Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦â€œÃ Â¦Â­Ã Â¦Â¾Ã Â¦Â°-Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â¸ Ã Â¦â€¢Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ (Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â°Ã Â§â‚¬ Ã Â¦Â«Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸-Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦Â«Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸-Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¬Ã Â¦Â¾ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â®Ã Â¦Â¿Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡), Ã Â¦Â«Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â®Ã Â¦Å¾Ã Â§ï¿½Ã Â¦Å“Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ (Ã Â¦Â®Ã Â§â€¡Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Å¸-Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡), Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¹Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°, Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¡Ã Â¦Å¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â«Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦â€¢Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "228",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Redesigned the Loan Terms & Details section inside the details modal to a clean, flat, borderless design. Replaced blocky card panels with a horizontal metrics bar separated by clean vertical dividers, and flat inline text indicators to reduce card fatigue.",
    "descriptionBn": "Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¨ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¨ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¸ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡-Ã Â¦Â®Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â°Ã Â§â€šÃ Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â²Ã Â¦â€¢ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦â€œ Ã Â¦Â¬Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â®Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¡Ã Â¦Å¸/Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â­Ã Â¦Â¾Ã Â¦Å“Ã Â¦â€¢Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦Â¹Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â®Ã Â§â€¡Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¤Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦â€ Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€œ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Å¡Ã Â§ï¿½Ã Â¦â€ºÃ Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨Ã Â¥Â¤"
  },
  {
    "id": "227",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Redesigned the Loan Terms & Details section inside the Loan details modal into a split-layout comparative dashboard. Features a visual loan amount allocation panel with a dynamic progress bar on the left, and a high-contrast dark-slate repayment overview sidebar card on the right.",
    "descriptionBn": "Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¨ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¨ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¸ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Å¸-Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¶Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â§â€¡ Ã Â¦Â°Ã Â§â€šÃ Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â® Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶Ã Â§â€¡ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¸ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¨ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶Ã Â§â€¡ Ã Â¦Â¹Ã Â¦Â¾Ã Â¦â€¡-Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢-Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â°Ã Â¦Â¿Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "226",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Company Setup",
    "link": "/company-setup?tab=payslip",
    "descriptionEn": "Updated the Employee Type dropdown in the Payslip Template configuration to standard categories (Worker, Office Executive, Staff). Added a smart conditional OT Type selection (e.g. 2hrs OT, 3hrs OT) that elegantly animates in whenever 'Worker' is selected, making template designation highly specific and professional.",
    "descriptionBn": "à¦ªà§‡ à¦¸à§�à¦²à¦¿à¦ª à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿ à¦¤à§ˆà¦°à¦¿à¦° à¦¸à¦®à§Ÿ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦Ÿà¦¾à¦‡à¦ª à¦…à¦ªà¦¶à¦¨à¦—à§�à¦²à§‹ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ (Worker, Office Executive, Staff) à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦›à¦¾à§œà¦¾à¦“ à¦¯à¦–à¦¨ 'Worker' à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¬à§‡, à¦¤à¦–à¦¨ à¦¸à§�à¦¬à§Ÿà¦‚à¦•à§�à¦°à¦¿à§Ÿà¦­à¦¾à¦¬à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦®à¦¾à¦°à§�à¦Ÿ OT Type à¦…à¦ªà¦¶à¦¨ (à¦¯à§‡à¦®à¦¨- 2hrs OT, 3hrs OT) à¦…à§�à¦¯à¦¾à¦¨à¦¿à¦®à§‡à¦¶à¦¨ à¦¸à¦¹ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à¦¬à§‡, à¦¯à¦¾ à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿà¦—à§�à¦²à§‹à¦•à§‡ à¦†à¦°à¦“ à¦¸à§�à¦ªà§‡à¦¸à¦¿à¦«à¦¿à¦• à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à¦•à¦°à¦¬à§‡à¥¤"
  },
  {
    "id": "225",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Added inline editing for Approved Amount and Installment Terms inside the Loan details modal. Editing dynamically updates the calculations, monthly rate, and amortization projections in real time. Redesigned the tab switcher for full width container aesthetics and enhanced the details card formatting.",
    "descriptionBn": "Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¨ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â£ (Approved Amount) Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¢Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Â° Ã Â¦Â®Ã Â§â€¡Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â¦ (Installment Terms) Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â§Ã Â¦Â¾ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬Ã Â¦â€¢Ã Â§Æ’Ã Â¦Â¤ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å“ Ã Â¦â€œ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â®Ã Â§â€¹Ã Â¦Â°Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â§Å¸Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¹Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€ºÃ Â¦Â¾Ã Â§Å“Ã Â¦Â¾ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¡Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â°Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²-Ã Â¦â€°Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¥ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦â€ Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â·Ã Â¦Â£Ã Â§â‚¬Ã Â§Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "224",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Upgraded the All Approvals page by adding a prominent 'View' button for all approval requests and making the new Modal design accessible across all module types (Leave, Advance, Increment, etc.), instead of just Loan requests.",
    "descriptionBn": "Ã Â¦Â¸Ã Â¦â€¢Ã Â¦Â² Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â² Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â·Ã Â§ï¿½Ã Â¦Å¸ 'View' Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â° Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¬ Ã Â¦Â§Ã Â¦Â°Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° (Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â­, Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸, Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¡Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¿) Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â§Å¸Ã Â§â€¡Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "223",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Designed and integrated an interactive Loan Approval View Modal in the All Approvals page. It presents comprehensive loan summary data, terms, repayment metrics, zero-interest amortization projections table, approval flow timeline cards, and comments/notes history using a modern card-based modal interface.",
    "descriptionBn": "Ã Â¦â€¦Ã Â¦Â² Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¸ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â·Ã Â¦Â£Ã Â§â‚¬Ã Â§Å¸ Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¨ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â·Ã Â¦Â¿Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¤ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â¦Â£, Ã Â¦Â¶Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â²Ã Â§â‚¬, Ã Â§Âª-Ã Â§Â§Ã Â§Â¦ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â°Ã Â¦Â¿-Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¡Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸, Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â°Ã Â§â€¹-Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â®Ã Â§â€¹Ã Â¦Â°Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â² Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â², Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Âª-Ã Â¦Â¬Ã Â¦Â¾Ã Â¦â€¡-Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Âª Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â®Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¢Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸/Ã Â¦Â¨Ã Â§â€¹Ã Â¦Å¸Ã Â¦Â¸ Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Å“Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "222",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Company Setup",
    "link": "/company-setup?tab=payslip",
    "descriptionEn": "Polished the Payslip Templates Setup page for better UI/UX. Improved the empty state with a dedicated icon, added modern focus rings to all form inputs, redesigned the English/Bangla toggle switch, added clear action icons to all buttons, and included a success notification when a new template is created.",
    "descriptionBn": "Ã Â¦ÂªÃ Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Âª Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦â€ Ã Â¦Âª Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¸ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦â€ Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â·Ã Â¦Â£Ã Â§â‚¬Ã Â§Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦â€ Ã Â¦â€¡Ã Â¦â€¢Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦ï¿½Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â¦Å¡Ã Â§ï¿½Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¬ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸Ã Â§â€¡ Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â«Ã Â§â€¹Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â¬ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€ Ã Â¦â€¡Ã Â¦â€¢Ã Â¦Â¨ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€ºÃ Â¦Â¾Ã Â§Å“Ã Â¦Â¾ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â§Å¸ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸ Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å“ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "221",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Company Setup",
    "link": "/company-setup?tab=payslip",
    "descriptionEn": "Upgraded the Payslip Configuration system to be template-based. Users can now view a list of templates, create new templates targeting specific companies and employee types, configure custom field names/visibilities for each template individually, and manage them via an interactive list and configure workflow.",
    "descriptionBn": "Ã Â¦ÂªÃ Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Âª Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â®Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â­Ã Â¦Â¿Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â°Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§â‚¬Ã Â¦Â°Ã Â¦Â¾ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§Å¸Ã Â¦Â¿ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨, Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â® Ã Â¦â€œ Ã Â¦Â­Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨Ã Â¥Â¤"
  },
  {
    "id": "220",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Company Setup",
    "link": "/company-setup?tab=payslip",
    "descriptionEn": "Implemented a fully dynamic Payslip Configuration tab within the Company Setup page. Users can edit English and Bengali names/labels for all working status, earning, and deduction fields, customize visibility toggles per company, and view real-time pay slip mockups in both English and Bengali with a mathematically consistent preview totaling 165,000 Net Payment.",
    "descriptionBn": "Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦â€ Ã Â¦Âª Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¤Ã Â¦Â°Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¸Ã Â¦Â²Ã Â¦Â¿Ã Â¦Âª Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â®Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¦Ã Â¦Â¬Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾, Ã Â¦â€ Ã Â§Å¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦â€¢Ã Â¦Â² Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¡Ã Â¦â€šÃ Â¦Â°Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿ Ã Â¦â€œ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦â€šÃ Â¦Â²Ã Â¦Â¾ Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â® Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â¦Â¨/Ã Â¦â€¦Ã Â¦Â« Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â­ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¸Ã Â¦Â²Ã Â¦Â¿Ã Â¦Âª Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¨Ã Â§â€¡Ã Â¦Å¸ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â§Â§Ã Â§Â¬Ã Â§Â«,Ã Â§Â¦Ã Â§Â¦Ã Â§Â¦ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¸Ã Â¦Â®Ã Â§â‚¬Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â£Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â®Ã Â¦Å¾Ã Â§ï¿½Ã Â¦Å“Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "219",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Employee Job Card",
    "link": "/employee-job-card",
    "descriptionEn": "Removed the summary stats cards ribbon (Present, Leaves, Holidays, Overtime, Late Entries, and Early Leaves) to make the registry interface cleaner and more streamlined.",
    "descriptionBn": "Ã Â¦Å“Ã Â¦Â¬ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¸ Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â¨ (Present, Leaves, Holidays Ã Â¦â€¡Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦â€šÃ Â¦Â¬Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹) Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦Â«Ã Â§â€¡Ã Â¦Â²Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¸Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Å¡Ã Â§ï¿½Ã Â¦â€ºÃ Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â§Å¸Ã Â¥Â¤"
  },
  {
    "id": "218",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Employee Job Card",
    "link": "/employee-job-card",
    "descriptionEn": "Removed the dynamic employee metadata summary card to make the view strictly focus on filtering logs and presenting the core table data, removing unnecessary clutter.",
    "descriptionBn": "Ã Â¦Å“Ã Â¦Â¬ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§Å¸Ã Â¦Â¿ Ã Â¦Â®Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦Â«Ã Â§â€¡Ã Â¦Â²Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â§Ã Â§ï¿½ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§Å¸Ã Â§â€¹Ã Â¦Å“Ã Â¦Â¨Ã Â§â‚¬Ã Â§Å¸ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â«Ã Â§â€¹Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§â€¡ Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "217",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Employee Job Card",
    "link": "/employee-job-card",
    "descriptionEn": "Replaced the Month and Year dropdowns with a comprehensive Date Range selector (Start Date and End Date). This allows for much more flexible and precise log fetching across multiple periods.",
    "descriptionBn": "Ã Â¦Å“Ã Â¦Â¬ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Month Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Year Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â¦Ã Â¦Â²Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Date Range Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â° (Start Date Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š End Date) Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â®Ã Â§â€¡ Ã Â¦â€“Ã Â§ï¿½Ã Â¦Â¬ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“Ã Â§â€¡Ã Â¦â€¡ Ã Â¦ÂªÃ Â¦â€ºÃ Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â®Ã Â¦Â¤Ã Â§â€¹ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€“Ã Â§â€¡Ã Â¦Â° Ã Â¦Â²Ã Â¦â€” Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "216",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Employee Job Card",
    "link": "/employee-job-card",
    "descriptionEn": "Perfected the alignment of all filter fields into a single, unified grid layout. Removed the 'Show Advanced' toggle to keep all fields permanently visible and easily accessible.",
    "descriptionBn": "Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§Å¸Ã Â¦Â¿ Ã Â¦Å“Ã Â¦Â¬ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â° Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â° Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ (Alignment) Ã Â¦Â Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â°, Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â„¢Ã Â§ï¿½Ã Â¦â€”Ã Â¦Â² Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¡ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ 'Show Advanced' Ã Â¦Å¸Ã Â¦â€”Ã Â¦Â²Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â«Ã Â¦Â²Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¬ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¸Ã Â¦Â¬Ã Â¦Â¸Ã Â¦Â®Ã Â§Å¸ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "215",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Employee Job Card",
    "link": "/employee-job-card",
    "descriptionEn": "Simplified the Job Card UI by removing confusing multi-employee selections and reorganizing filters into a cleaner, single-row design. Moved the 'Runtime Evaluation' into an 'Advanced' toggle.",
    "descriptionBn": "Ã Â¦Å“Ã Â¦Â¬ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¸ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦â€¦Ã Â¦Â¨Ã Â§â€¡Ã Â¦â€¢ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â„¢Ã Â§ï¿½Ã Â¦â€”Ã Â¦Â²-Ã Â¦Â°Ã Â§â€¹ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'Runtime Evaluation' Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ 'Advanced' Ã Â¦Å¸Ã Â¦â€”Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¤Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "214",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Disciplinary Action",
    "link": "/disciplinary-showcause-notices",
    "descriptionEn": "Added Disciplinary Show Cause Notices page to manage and track notices with complete lifecycle tracking and a modern modal interface.",
    "descriptionBn": "Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¿Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¶Ã Â§â€¹-Ã Â¦â€¢Ã Â¦Å“ Ã Â¦Â¨Ã Â§â€¹Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â¶ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¨Ã Â§â€¹Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â¶ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¦Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â«Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â² Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¿Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€ Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â§Ã Â¦Â¾ Ã Â¦Â°Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "213",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Disciplinary Action",
    "link": "/disciplinary-warning-letters",
    "descriptionEn": "Added Disciplinary Warning Letters page with comprehensive record tracking, filtering, and a modern modal for issuing letters.",
    "descriptionBn": "Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¿Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â²Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¸ (Ã Â¦Â¸Ã Â¦Â¤Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â®Ã Â§â€šÃ Â¦Â²Ã Â¦â€¢ Ã Â¦Å¡Ã Â¦Â¿Ã Â¦Â Ã Â¦Â¿) Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Å¡Ã Â¦Â¿Ã Â¦Â Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¦Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦Â°Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¿Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€ Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â§Ã Â¦Â¾ Ã Â¦Â°Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "212",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Disciplinary Action",
    "link": "/disciplinary-case-files",
    "descriptionEn": "Added Disciplinary Action module with a comprehensive Case Files management page including advanced filtering and status tracking.",
    "descriptionBn": "Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¿Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â¸ Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¤ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â§Ã Â¦Â¾ Ã Â¦Â°Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "211",
    "date": "2026-09-14T10:30",
    "type": "UX Optimization",
    "module": "KPI Cycles",
    "link": "/kpi-cycles",
    "descriptionEn": "Added a real-time search bar to the Employee Selection modal, allowing users to instantly filter by Name, ID, or Department. Also introduced profile picture avatars (with fallback initials) to each employee card for quick visual identification.",
    "descriptionBn": "Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§Å¸Ã Â§â‚¬ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡Ã Â¦Â²-Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â® Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â¯Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®, Ã Â¦â€ Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¿ Ã Â¦Â¬Ã Â¦Â¾ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¦Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦Â¦Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§Å¸Ã Â¦Â¿ Ã Â¦â€“Ã Â§ï¿½Ã Â¦ï¿½Ã Â¦Å“Ã Â§â€¡ Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶Ã Â¦Â¿, Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€¢ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€¢Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â­Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° (Ã Â¦â€¦Ã Â¦Â¥Ã Â¦Â¬Ã Â¦Â¾ Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦â€ Ã Â¦Â¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â·Ã Â¦Â°) Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â¦Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“Ã Â§â€¡Ã Â¦â€¡ Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸Ã Â¥Â¤"
  },
  {
    "id": "210",
    "date": "2026-09-14T10:30",
    "type": "UX Optimization",
    "module": "KPI Cycles",
    "link": "/kpi-cycles",
    "descriptionEn": "Replaced the standard popover for 'Applicable Employees' with a dedicated advanced selection modal. This provides a much better experience by showing employee details (ID, Name, and Department) in a spacious grid view.",
    "descriptionBn": "'Applicable Employees' Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¡Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â§Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â£ Ã Â¦ÂªÃ Â¦ÂªÃ Â¦â€œÃ Â¦Â­Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¡ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â«Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¬Ã Â§Å“ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§Å¸Ã Â¦Â¿Ã Â¦Â¦Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤ (ID, Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â® Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¿Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸) Ã Â¦Â¤Ã Â¦Â¥Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“Ã Â§â€¡Ã Â¦â€¡ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â°Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§â‚¬Ã Â¦Â¦Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¦Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦â€¦Ã Â¦Â­Ã Â¦Â¿Ã Â¦Å“Ã Â§ï¿½Ã Â¦Å¾Ã Â¦Â¤Ã Â¦Â¾ Ã Â¦Â¦Ã Â§â€¡Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "209",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Core UI",
    "link": "/kpi-cycles",
    "descriptionEn": "Upgraded the MultiSelect component to display selected items as visible chips inside the input box (showing up to 3 items and a '+ X more' badge) instead of a generic text like '6 items selected'. This provides immediate visibility into what is selected without needing to open the dropdown.",
    "descriptionBn": "MultiSelect Ã Â¦â€¢Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â° '6 items selected' Ã Â¦ï¿½Ã Â¦Â°Ã Â¦â€¢Ã Â¦Â® Ã Â¦Â²Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â§â€¡, Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¡Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦â€ Ã Â¦â€¡Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â®Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¬Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¤Ã Â¦Â°Ã Â§â€¡ Ã Â¦Å¡Ã Â¦Â¿Ã Â¦ÂªÃ Â¦Â¸ (Chips) Ã Â¦â€ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ (Ã Â¦Â¸Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¬Ã Â§â€¹Ã Â¦Å¡Ã Â§ï¿½Ã Â¦Å¡ Ã Â§Â©Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦â€¡Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â® Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ '+ X more' Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å“ Ã Â¦Â¸Ã Â¦Â¹)Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â«Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦â€“Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¡ Ã Â¦â€¢Ã Â§â‚¬ Ã Â¦â€¢Ã Â§â‚¬ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¤Ã Â¦Â¾ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“Ã Â§â€¡ Ã Â¦Â¬Ã Â§â€¹Ã Â¦ï¿½Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "208",
    "date": "2026-09-14T10:30",
    "type": "UX Optimization",
    "module": "KPI Cycles",
    "link": "/kpi-cycles",
    "descriptionEn": "Deep UX optimization for KPI Cycles modal. The Applicable Departments and Applicable Employees inputs are now neatly aligned side-by-side using a grid layout to save vertical space. Furthermore, the Employees list is now smartly filtered dynamically based on the selected Departments.",
    "descriptionBn": "KPI Cycles Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° UX-Ã Â¦ï¿½ Ã Â¦Â¬Ã Â§Å“ Ã Â¦Â§Ã Â¦Â°Ã Â¦Â£Ã Â§â€¡Ã Â¦Â° Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨Ã Â§Å¸Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Applicable Departments Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Applicable Employees Ã Â¦â€¡Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¦Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â°Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¡ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€ºÃ Â¦Â¾Ã Â§Å“Ã Â¦Â¾, Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¡Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦â€œÃ Â¦ÂªÃ Â¦Â° Ã Â¦Â­Ã Â¦Â¿Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Employees-Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â¾ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Â¹Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "207",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "KPI Cycles",
    "link": "/kpi-cycles",
    "descriptionEn": "Upgraded the KPI Cycles creation modal with a smart, searchable combobox (MultiSelect) for both Applicable Departments and Applicable Employees, replacing the previous bulky scrollable lists for a much more professional and clean UX.",
    "descriptionBn": "KPI Cycles Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â° Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€œ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Applicable Departments Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Applicable Employees Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¡Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€ Ã Â¦â€”Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¬Ã Â§Å“ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â²Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡-Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â§Ã Â¦Â¾Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€ Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿-Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â¬Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "206",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "KPI Cycles",
    "link": "/kpi-cycles",
    "descriptionEn": "Upgraded the 'Create/Edit Cycle' modal to be more user-friendly. Replaced the native multi-select box with scrollable checkbox lists for both Applicable Departments and Applicable Employees.",
    "descriptionBn": "'Create/Edit Cycle' Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â°-Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â²Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦â€ Ã Â¦â€”Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿-Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¬Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â¦Ã Â¦Â²Ã Â§â€¡ Applicable Departments Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Applicable Employees-Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦Â¨ Ã Â¦Å¡Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¬Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "205",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Employee Increment",
    "link": "/increment-list",
    "descriptionEn": "Reordered fields in the Employee Evaluation modal to place the KPI option before the promotion checkbox, as per the new logical flow.",
    "descriptionBn": "Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦â€¡Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½Ã Â§Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â® Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡; Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â§â‚¬ KPI Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Å¡Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¬Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â° Ã Â¦â€ Ã Â¦â€”Ã Â§â€¡ Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "204",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Employee Increment",
    "link": "/increment-list",
    "descriptionEn": "Updated the Employee Evaluation modal flow to enforce a logical order: the 'Pull Increment Data from KPI' option is now disabled until an employee is selected, and checking the KPI option auto-fills data specifically for the selected employee.",
    "descriptionBn": "Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦â€¡Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½Ã Â§Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â²Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦ï¿½Ã Â¦Â¨Ã Â¦Â«Ã Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¨Ã Â§â€¹ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€ Ã Â¦â€”Ã Â§â€¡ 'Pull Increment Data from KPI' Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â² Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¬Ã Â§â€¡, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š KPI Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Å¡Ã Â§â€¡Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¦Ã Â¦Å¸Ã Â§â€¹Ã Â¦Â®Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¹Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "203",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Fixed a TypeScript error where the initialDyeings and initialFinishings arrays were missing the status property.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦ÂªÃ Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â°Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ initialDyeings Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š initialFinishings Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¤Ã Â§â€¡ status Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â®Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦â€ºÃ Â¦Â¿Ã Â¦Â²Ã Â¥Â¤"
  },
  {
    "id": "202",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Fixed a TypeScript error where the FabricConstructionSpec data was missing the rateConstraint property.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦ÂªÃ Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â°Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ FabricConstructionSpec Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ rateConstraint Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â®Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦â€ºÃ Â¦Â¿Ã Â¦Â²Ã Â¥Â¤"
  },
  {
    "id": "201",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Fixed a TypeScript error where SpecialCostSpec and AdditionalCostSpec were missing rate and rateConstraint properties.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦ÂªÃ Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â°Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ SpecialCostSpec Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š AdditionalCostSpec-Ã Â¦ï¿½ rate Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š rateConstraint Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â®Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦â€ºÃ Â¦Â¿Ã Â¦Â²Ã Â¥Â¤"
  },
  {
    "id": "200",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "User Management",
    "link": "/user-management",
    "descriptionEn": "Restored the avatar/image holder circle next to the employee name in the User Access Overview modal, removed the bottom metadata ribbon (Landing Route, Phone, Last Login) to reduce clutter, and removed the short company code (e.g. PSL, PKCL) chips beside the company names in the access list.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸ Ã Â¦â€œÃ Â¦Â­Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§Å¸Ã Â¦Â¿Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶Ã Â§â€¡ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â­Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°/Ã Â¦â€ºÃ Â¦Â¬Ã Â¦Â¿ Ã Â¦â€ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â¨ (Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€°Ã Â¦Å¸, Ã Â¦Â«Ã Â§â€¹Ã Â¦Â¨, Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â²Ã Â¦â€”Ã Â¦â€¡Ã Â¦Â¨) Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€ºÃ Â¦Â¾Ã Â§Å“Ã Â¦Â¾Ã Â¦â€œ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸ Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¶Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¡ (Ã Â¦Â¯Ã Â§â€¡Ã Â¦Â®Ã Â¦Â¨- PSL, PKCL) Ã Â¦Å¡Ã Â¦Â¿Ã Â¦ÂªÃ Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â®Ã Â§ï¿½Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "199",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "User Management",
    "link": "/user-management",
    "descriptionEn": "Removed the user avatar/image section from the User Access Overview modal to create a cleaner layout.",
    "descriptionBn": "Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€ºÃ Â¦Â¿Ã Â¦Â®Ã Â¦â€ºÃ Â¦Â¾Ã Â¦Â® Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸ Ã Â¦â€œÃ Â¦Â­Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦â€ºÃ Â¦Â¬Ã Â¦Â¿/Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â­Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦Â«Ã Â§â€¡Ã Â¦Â²Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "198",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "User Management",
    "link": "/user-management",
    "descriptionEn": "Added a dedicated 'User Access Overview' action button and modal in the User Management table. It provides a visual snapshot of user credentials, system role, department, status, and an enhanced card-based matrix of assigned companies and accessible operational areas.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Å“Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ 'User Access Overview' Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â°Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§â‚¬Ã Â¦Â° Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦Â¤Ã Â¦Â¥Ã Â§ï¿½Ã Â¦Â¯, Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â® Ã Â¦Â°Ã Â§â€¹Ã Â¦Â², Ã Â¦Â¡Ã Â¦Â¿Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿ Ã Â¦â€œ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¾Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Å“Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "197",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Evaluation",
    "link": "/increment-list",
    "descriptionEn": "Added a 'Pull from KPI' integration in the Evaluation modal. You can now check a box to automatically fetch and fill the increment amount based on an employee's KPI score. When unchecked, you can manually enter the amount. This streamlines the data entry for KPI-driven evaluations.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½Ã Â§Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡ 'Pull from KPI' Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€¡ Ã Â¦Å¡Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¬Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡ Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§Å¸Ã Â¦Â¿Ã Â¦Â° KPI Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦â€°Ã Â¦ÂªÃ Â¦Â° Ã Â¦Â­Ã Â¦Â¿Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â£ Ã Â¦â€¦Ã Â¦Å¸Ã Â§â€¹Ã Â¦Â®Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤ Ã Â¦â€ Ã Â¦Â° Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¨Ã Â¦Â¿ Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€“Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨, Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Å“Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“ Ã Â¦â€œ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€“Ã Â§ï¿½Ã Â¦ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "196",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Evaluation",
    "link": "/increment-list",
    "descriptionEn": "Enhanced the 'New Evaluation' modal for a more professional experience. Replaced the manual designation input field with an 'Is Promoted?' checkbox. When checked, it gracefully reveals a dropdown to precisely select the new designation. This prevents typos and makes the form much cleaner.",
    "descriptionBn": "Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€¡Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½Ã Â§Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ 'Is Promoted?' Ã Â¦Å¡Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¬Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦â€ Ã Â¦Â¸Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â«Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â² Ã Â¦Â¹Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¤Ã Â§â€¡Ã Â¦â€œ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€”Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "195",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Evaluation",
    "link": "/increment-list",
    "descriptionEn": "Corrected the Evaluation sidebar menu. It is now called 'Evaluation' and contains three sub-menus: Increment List, Summary, and History. The 'Evaluate' button remains conveniently at the top of the Increment List page as requested.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½Ã Â§Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â® 'Evaluation' Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â° Ã Â¦â€ Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Ã Â§Â©Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ Ã Â¦â€ Ã Â¦â€ºÃ Â§â€¡: Increment List, Summary, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š HistoryÃ Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€ºÃ Â¦Â¾Ã Â§Å“Ã Â¦Â¾ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ÂªÃ Â§â€¡Ã Â¦â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦â€°Ã Â¦ÂªÃ Â¦Â°Ã Â§â€¡ 'Evaluate' Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦â€”Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¤Ã Â§â€¹Ã Â¦â€¡ Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "194",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Evaluation",
    "link": "/increment-list",
    "descriptionEn": "Refactored the Evaluation workflow again based on feedback. The main entry point is now simply 'Increment List' in the sidebar. We removed the extra tabs and added a direct 'New Evaluation' button at the top of the list. Clicking it opens a fast, intuitive modal where you can select Year, Month, Employee, enter a Promotion Designation (if any), and input the Increment Amount, saving it instantly.",
    "descriptionBn": "Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â¡Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â° Ã Â¦â€°Ã Â¦ÂªÃ Â¦Â° Ã Â¦Â­Ã Â¦Â¿Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦â€¡Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½Ã Â§Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â¦â€œ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â° 'Increment List' Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â®Ã Â§ï¿½Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â«Ã Â§â€¡Ã Â¦Â²Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ÂªÃ Â§â€¡Ã Â¦â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦â€°Ã Â¦ÂªÃ Â¦Â°Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ 'New Evaluation' Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€¡ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨Ã Â§â€¡ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â²Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦â€œÃ Â¦ÂªÃ Â§â€¡Ã Â¦Â¨ Ã Â¦Â¹Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¬Ã Â¦â€ºÃ Â¦Â°, Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¾ Ã Â¦Â¬Ã Â¦Â¸Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦â€“Ã Â§ï¿½Ã Â¦Â¬ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“Ã Â§â€¡Ã Â¦â€¡ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â­ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "193",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Evaluation",
    "link": "/evaluation-propose",
    "descriptionEn": "Completely streamlined the Evaluation workflow into 4 simple steps: Evaluate, Increment List, Summary, and History. Removed the complex configurator step. Managers can now directly input the proposed 'Increment Amount' and 'Promotion Designation' for each employee in the Evaluate datatable itself, making the process much faster and more professional.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½Ã Â§Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â§ÂªÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“ Ã Â¦Â§Ã Â¦Â¾Ã Â¦ÂªÃ Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Evaluate, Increment List, Summary Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š HistoryÃ Â¥Â¤ Ã Â¦Å“Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Âª Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¦ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿ Evaluate Ã Â¦ÂªÃ Â§â€¡Ã Â¦â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¬Ã Â¦Â¸Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§Å¸Ã Â¦Â¿Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ 'Increment Amount' Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'Promotion Designation' Ã Â¦â€¡Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨, Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Å“Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦Â¦Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€œ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "192",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Evaluation",
    "link": "/evaluation-propose",
    "descriptionEn": "Simplified the Evaluation menu into a cleaner, modern, and professional inline tab navigation bar by removing the large block layout and complex descriptions. This makes the interface more user-friendly and standard.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½Ã Â§Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“, Ã Â¦â€ Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¶Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¬Ã Â§Å“ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â²Ã Â¦â€¢ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¸Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€”Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â°Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§â‚¬Ã Â¦Â¦Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¿ Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â°-Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â²Ã Â¦Â¿Ã Â¥Â¤"
  },
  {
    "id": "191",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Configuration - Allowance Rate",
    "link": "/allowance-rate",
    "descriptionEn": "Created a new 'Allowance Rate' configuration page with a centralized one-page modal design. Users can easily view, add, edit, and delete company-wide allowance rates (Percentage or Fixed amount) using a beautiful and well-organized interface.",
    "descriptionBn": "Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ 'Allowance Rate' Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦â€¡Ã Â¦Å“ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦â€œ Ã Â¦â€”Ã Â§â€¹Ã Â¦â€ºÃ Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦ï¿½Ã Â¦â€¢-Ã Â¦ÂªÃ Â§â€¡Ã Â¦â€¡Ã Â¦Å“ Ã Â¦Â®Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â² Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿Ã Â¥Â¤ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â°Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§â‚¬Ã Â¦Â°Ã Â¦Â¾ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“Ã Â§â€¡Ã Â¦â€¡ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â° Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ (Ã Â¦Â¶Ã Â¦Â¤Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¬Ã Â¦Â¾ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â£) Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¤Ã Â§â€¡, Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¤Ã Â§â€¡, Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â²Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨Ã Â¥Â¤"
  },
  {
    "id": "190",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Merchandising Quotation",
    "link": "/merchandising-quotation",
    "descriptionEn": "Implemented dynamic rate constraints across the Buyer Costing form based on Master Settings. When a description is selected, the rate field is automatically populated with a default rate. Depending on the master setting, the rate field can now be 'Fixed' (cannot be changed), 'Increase Only' (can only be raised), 'Decrease Only' (can only be lowered), or 'No Restriction' (can be freely edited).",
    "descriptionBn": "Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸Ã Â§â€¡Ã Â¦Â° Ã Â¦â€°Ã Â¦ÂªÃ Â¦Â° Ã Â¦Â­Ã Â¦Â¿Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¡Ã Â¦Â¾Ã Â§Å¸Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¸Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ (Rate Constraint) Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¨Ã Â§â€¹ Ã Â¦â€ Ã Â¦â€¡Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â® Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â§â€¡ Ã Â¦â€¦Ã Â¦Å¸Ã Â§â€¹Ã Â¦Â®Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Å¡Ã Â¦Â²Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â¸Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦â€°Ã Â¦ÂªÃ Â¦Â° Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â­Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¡ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Å¸Ã Â¦Â¿ 'Fixed', 'Increase Only', 'Decrease Only', Ã Â¦â€¦Ã Â¦Â¥Ã Â¦Â¬Ã Â¦Â¾ 'No Restriction' Ã Â¦Â¹Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "189",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Merchandising Quotation",
    "link": "/merchandising-quotation",
    "descriptionEn": "Replaced all free-text description fields in the Buyer Costing form with dropdown menus. The options for Fabric Class, Used In, Accessories, Embellishments, Washing, Yarn Count, Knitting, and Dyeing are now directly populated from the Master Settings.",
    "descriptionBn": "Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦â€¢Ã Â¦Â² Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¸Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Fabric Class, Used In, Accessories, Embellishments, Washing, Yarn Count, Knitting, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Dyeing Ã Â¦ï¿½Ã Â¦Â° Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â¸Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "188",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Financial Aid & Zakat",
    "link": "/financial-aid-list",
    "descriptionEn": "Upgraded the 'Employee Verified Details' card in both the Financial Aid Request and Zakat Assignment modals to display a comprehensive view including the employee's image, department, section, join date, and gross salary.",
    "descriptionBn": "Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â² Ã Â¦ï¿½Ã Â¦â€¡Ã Â¦Â¡ Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¤ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â° 'Employee Verified Details' Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€ºÃ Â¦Â¬Ã Â¦Â¿, Ã Â¦Â¡Ã Â¦Â¿Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨, Ã Â¦Å“Ã Â§Å¸Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "187",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Financial Aid",
    "link": "/financial-aid-list",
    "descriptionEn": "Fixed an issue where the 'New Aid Request' financial modal was not opening on the Financial Aid page.",
    "descriptionBn": "Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â² Ã Â¦ï¿½Ã Â¦â€¡Ã Â¦Â¡ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ 'New Aid Request' Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€œÃ Â¦ÂªÃ Â§â€¡Ã Â¦Â¨ Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "186",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Merchandising Order Profile",
    "link": "/merchandising-order-profile",
    "descriptionEn": "Redesigned the 'Style Master Data' table into a modern, gorgeous Card-based UI with clear hierarchical blocks for Fabric, Yarn, and Trims requirements instead of a dense, monolithic HTML table.",
    "descriptionBn": "'Style Master Data' Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡-Ã Â¦Â­Ã Â¦Â¿Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Â¹Ã Â¦Â¬Ã Â§â€¡, Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Fabric, Yarn Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Trims Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€ Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â²Ã Â¦â€¢ Ã Â¦Â°Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "185",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Merchandising Quotation",
    "link": "/merchandising-quotation",
    "descriptionEn": "Added a dynamic 'Budget Summary' table showing a comprehensive breakdown of order value, variable costs, contribution margin, and net profit based on form variables.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ 'Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å“Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿' Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â§â‚¬ Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½, Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦â€¢Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¨Ã Â§â€¡Ã Â¦Å¸ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â«Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¥Â¤"
  },
  {
    "id": "184",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Zakat Management",
    "link": "/zakat-management",
    "descriptionEn": "Implemented Budget Configuration and Zakat List sub-menus. Styled tables for a cleaner, modern look aligning with the requested minimal design.",
    "descriptionBn": "Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å“Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¤ Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â¦Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â§ï¿½ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦â€œ Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â° Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "183",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Budget Planning",
    "link": "/budget-planning",
    "descriptionEn": "Redesigned the Budget Planning page by combining Approved and Pending budgets into a single master list with new filtering options. Moved the Budget Strategy Form and Staged Proposals into a Create Budget modal.",
    "descriptionBn": "Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å“Ã Â§â€¡Ã Â¦Å¸ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€š Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â­Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å“Ã Â§â€¡Ã Â¦Å¸Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦â€¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å“Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â® Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â§â€¹Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â²Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ 'Create Budget' Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "182",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Recruitment Configuration",
    "link": "/recruitment-configuration",
    "descriptionEn": "Refined the 'Weight Factor' field to strictly enforce numeric input and automatically format the value to 2 decimal places.",
    "descriptionBn": "Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¡ (Operation Grade) Ã Â¦ï¿½Ã Â¦Â° 'Weight Factor' Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â° Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¹Ã Â¦Â£ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â§Â¨ Ã Â¦Â¦Ã Â¦Â¶Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¯Ã Â¦Â¼Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â«Ã Â¦Â°Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¥Â¤"
  },
  {
    "id": "181",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Recruitment Configuration",
    "link": "/recruitment-configuration",
    "descriptionEn": "Added a new 'Weight Factor' field to the Operation Grade configuration matrix. It captures a numeric 2-decimal value and displays it in the data table.",
    "descriptionBn": "Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¡ (Operation Grade) Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ 'Weight Factor' Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Å¸Ã Â¦Â¿ Ã Â§Â¨ Ã Â¦Â¦Ã Â¦Â¶Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦ÂªÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦Â¸Ã Â¦â€šÃ Â¦â€“Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Â§Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â£ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¤Ã Â¦Â¾ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Â¹Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "180",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Recruitment Configuration",
    "link": "/recruitment-configuration",
    "descriptionEn": "Updated the SMV Value in the SMV Bank configuration matrix to consistently format to 4 decimal places.",
    "descriptionBn": "Ã Â¦ï¿½Ã Â¦Â¸Ã Â¦ï¿½Ã Â¦Â®Ã Â¦Â­Ã Â¦Â¿ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€šÃ Â¦â€¢ (SMV Bank) Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡ SMV Value Ã Â¦â€¢Ã Â§â€¡ Ã Â§Âª Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â®Ã Â§â€¡Ã Â¦Â² Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Â¸ (Ã Â§Âª Ã Â¦Â¦Ã Â¦Â¶Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾Ã Â¦Â¨) Ã Â¦ÂªÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦Â«Ã Â¦Â°Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "179",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Recruitment Configuration",
    "link": "/recruitment-configuration",
    "descriptionEn": "Updated the OP Grade field in the Multi/SS configuration matrix to use a multi-select component.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿/Ã Â¦ï¿½Ã Â¦Â¸Ã Â¦ï¿½Ã Â¦Â¸ (Multi/SS) Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡ OP Grade Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿-Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "178",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Add Employee",
    "link": "/add-employee",
    "descriptionEn": "Added a 'Company Reference (Internal)' section under Professional & Corporate References to track if a new employee has any relatives working in the company. Captures region and relative's employee ID.",
    "descriptionBn": "Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ 'Company Reference (Internal)' Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â®Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¥Ã Â§â‚¬Ã Â¦Â° Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¨Ã Â§â€¹ Ã Â¦â€ Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â®Ã Â§â‚¬Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â¤Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â°Ã Â¦Â¤ Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â°Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€œÃ Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦â€ Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦â€šÃ Â¦Â°Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â·Ã Â¦Â£ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "177",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Add Employee",
    "link": "/add-employee",
    "descriptionEn": "Flattened the Personal & Identity tab into a single continuous scrollable form by removing sub-steps (Placement, Contact, Emergency, Reference) for a faster and unified data entry experience.",
    "descriptionBn": "Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¹Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€ Ã Â¦â€¡Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦â€¢ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â²Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Âª (Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Â¸Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦â€¢Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦â€¡Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å“Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Â¿, Ã Â¦Â°Ã Â§â€¡Ã Â¦Â«Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸) Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¤Ã Â¦Â¾Ã Â§Å¸ Ã Â¦Â¸Ã Â¦Â¬ Ã Â¦Â¤Ã Â¦Â¥Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â¦Â£Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â§Ã Â¦Â¾ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "176",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Personnel List",
    "link": "/employee-detail/2023046001R",
    "descriptionEn": "Redesigned the employee detail profile header for a more professional and user-friendly experience. The employee's avatar is now prominently displayed at the very top alongside key information organized cleanly.",
    "descriptionBn": "Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â² Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦Â¹Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿Ã Â¦Â° Ã Â¦â€ºÃ Â¦Â¬Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¥Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â¬Ã Â§Å“ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¬Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â¤Ã Â¦Â¥Ã Â§ï¿½Ã Â¦Â¯Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â°Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦â€ Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "175",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "IE Recruitment",
    "link": "/recruitment-basic-entry",
    "descriptionEn": "Added Unit, Line, and Date of Joining (DOJ) to the Mandatory Information card on top as required fields while removing duplicate inputs from Company Info.",
    "descriptionBn": "Ã Â¦â€ Ã Â¦â€¡Ã Â¦â€¡ Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡ Unit, Line Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Date of Joining (DOJ) Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â²Ã Â¦â€¢ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€°Ã Â¦ÂªÃ Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â«Ã Â§â€¹ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "174",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Inventory",
    "link": "/inv-receive-list",
    "descriptionEn": "Implemented the Receive List page with detailed filtering, searchable table, and a comprehensive Print Details (MRIR) modal.",
    "descriptionBn": "Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€š, Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â² Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸ (MRIR) Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â­ Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "173",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Inventory",
    "link": "/inv-receive-direct",
    "descriptionEn": "Implemented the Direct Receive page with a complete MRR form and an interactive product entry table.",
    "descriptionBn": "Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦â€ Ã Â¦Â°Ã Â¦â€ Ã Â¦Â° (MRR) Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â® Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â°Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â­ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "172",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Inventory",
    "link": "/inv-yarn-opening-stock",
    "descriptionEn": "Implemented the Yarn Opening Stock page with a multiple-product add form in a modal for efficient stock entry.",
    "descriptionBn": "Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦â€¦Ã Â¦Â¨Ã Â§â€¡Ã Â¦â€¢ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â§Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â® Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦â€¡Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€œÃ Â¦ÂªÃ Â§â€¡Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦â€¢ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "171",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Inventory",
    "link": "/inv-config-uom",
    "descriptionEn": "Added new configuration pages for Unit of Measurement (UoM), Brand, and Model in the Inventory module.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â²Ã Â§â€¡ Unit of Measurement (UoM), Brand, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Model Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "170",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Human Resource",
    "link": "/add-employee",
    "descriptionEn": "Added a new 'House No' field in both Present and Permanent Address sections and updated the dispatch previews.",
    "descriptionBn": "Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾Ã Â§Å¸Ã Â§â‚¬ Ã Â¦Â Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ 'House No' Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¸Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "169",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Human Resource",
    "link": "/add-employee",
    "descriptionEn": "Removed the separate Smart Scanner card and moved its button to the top right of the Primary Information header to save vertical space.",
    "descriptionBn": "Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€œ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â®Ã Â§â€¹Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¡Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¹Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦â€°Ã Â¦ÂªÃ Â¦Â°Ã Â§â€¡ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¦Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¨Ã Â§â€¡Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "168",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Human Resource",
    "link": "/add-employee",
    "descriptionEn": "Added a collapsible accordion toggle to the Sub-section Progress Stepper Timeline on the Add Employee page.",
    "descriptionBn": "Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â° Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â®Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â§â€¡ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨ Ã Â¦Å¸Ã Â¦â€”Ã Â¦Â² Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "167",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Human Resource",
    "link": "/add-employee",
    "descriptionEn": "Added a collapsible accordion toggle to the Profile Completion Status card on the Add Employee page to save screen space when not needed.",
    "descriptionBn": "Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â¤Ã Â§â€¡ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨ Ã Â¦Å¸Ã Â¦â€”Ã Â¦Â² Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¦Ã Â¦Â°Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ºÃ Â§â€¹Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¥Â¤"
  },
  {
    "id": "166",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Human Resource",
    "link": "/add-employee",
    "descriptionEn": "Compacted the layout of the Add Employee page by reducing padding, shrinking the progress cards, and minimizing the timeline stepper to maximize visible workspace.",
    "descriptionBn": "Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦â€¢Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡; Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¸ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦ï¿½Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡, Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦ÂªÃ Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦â€ºÃ Â§â€¹Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "165",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Inventory Management",
    "link": "/inv-config-product-type",
    "descriptionEn": "Standardized table designs across all Inventory configuration pages (Product Type, Store Name, Group Name, Product Name) for consistent font sizes, alignments, and action buttons.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¬ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ (Ã Â¦Â«Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“, Ã Â¦ï¿½Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨) Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â®Ã Â¦Å¾Ã Â§ï¿½Ã Â¦Å“Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "164",
    "date": "2026-09-14T10:30",
    "type": "New Addition",
    "module": "Inventory Management",
    "link": "/inv-config-group-name",
    "descriptionEn": "Created the Group Name configuration page with Product Type filtering and a clean single-column modal for group entry.",
    "descriptionBn": "Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Âª Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â® Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦â€¡Ã Â¦Å“ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Âª Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "163",
    "date": "2026-09-14T10:30",
    "type": "New Addition",
    "module": "Inventory Management",
    "link": "/inv-config-store-name",
    "descriptionEn": "Created the Store Name configuration page featuring an advanced locations multi-select tag input.",
    "descriptionBn": "Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¹Ã Â¦Â° Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â® Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦â€¡Ã Â¦Å“ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€”-Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿-Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ Ã Â¦â€ Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "162",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Inventory Management",
    "link": "/inventory-dashboard",
    "descriptionEn": "Added three new sub-menus (UoM, Brand, Model) under the Configuration main menu in the Inventory sidebar.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ 'Configuration' Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å¡Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ (UoM, Brand, Model) Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "161",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Inventory Management",
    "link": "/inventory-dashboard",
    "descriptionEn": "Refined and reorganized the Inventory sidebar menu structure. Consolidated sections into Configuration, Config, Store Receive, and Store Issue with updated sub-menus.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Configuration, Config, Store Receive, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Store Issue Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "160",
    "date": "2026-09-14T10:30",
    "type": "New Addition",
    "module": "Inventory Management",
    "link": "/inv-config-product-name",
    "descriptionEn": "Created the Product Name configuration page with store-specific filtering and a dual-column modal design to show existing products for context during creation.",
    "descriptionBn": "Product Name Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦â€¡Ã Â¦Å“ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¹Ã Â¦Â° Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¶Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â²-Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦â€ Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦â€ Ã Â¦â€”Ã Â§â€¡Ã Â¦Â° Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¥Â¤"
  },
  {
    "id": "159",
    "date": "2026-09-14T10:30",
    "type": "New Addition",
    "module": "Inventory Management",
    "link": "/inv-config-product-type",
    "descriptionEn": "Created the Product Type Configuration page under Inventory Management. Features include a dynamic data table, Create/Update modals with standard fields, and an interactive dual-list parameter assignment modal.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Å“Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦â€ Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ 'Product Type Configuration' Ã Â¦ÂªÃ Â§â€¡Ã Â¦â€¡Ã Â¦Å“ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â², Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Å¸/Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¶Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â²-Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "158",
    "date": "2026-09-14T10:30",
    "type": "New Addition",
    "module": "Inventory Management",
    "link": "/inv-yarn-opening-stock",
    "descriptionEn": "Added a new 'Manage Item' menu group to the Inventory Sidebar and created the 'Yarn Opening Stock' page featuring a search, filtering layout, and an 'Add New Stock' button.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ 'Manage Item' Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Âª Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'Yarn Opening Stock' Ã Â¦ÂªÃ Â§â€¡Ã Â¦â€¡Ã Â¦Å“ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡, Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'Add New Stock' Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦Â°Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "157",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Inventory Management",
    "link": "/inventory-dashboard",
    "descriptionEn": "Removed placeholder menus from the Inventory sidebar. The sidebar now only strictly displays the 'Dashboard' and 'Configuration' menus.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â®Ã Â§â€¹ Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¦ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â° 'Dashboard' Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'Configuration' Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "156",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Inventory Management",
    "link": "/inventory-dashboard",
    "descriptionEn": "Redesigned the Store Selection modal to be more compact with horizontal store cards, and added a search bar to easily filter stores by name or description.",
    "descriptionBn": "Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¹Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦â€¢Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â§â€¡ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¹Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“Ã Â§â€¡ Ã Â¦â€“Ã Â§ï¿½Ã Â¦ï¿½Ã Â¦Å“Ã Â§â€¡ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "155",
    "date": "2026-09-14T10:30",
    "type": "New",
    "module": "Inventory Management",
    "link": "/inventory-dashboard",
    "descriptionEn": "Created the new Inventory Management module with a dashboard layout consistent with HRIS. Added a Store Selection Modal (e.g. General Store, ICT Store) that appears on first load to enforce store context.",
    "descriptionBn": "Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Å“Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â² Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦â€¡Ã Â¦Å¡Ã Â¦â€ Ã Â¦Â°Ã Â¦â€ Ã Â¦â€¡Ã Â¦ï¿½Ã Â¦Â¸ (HRIS) Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¤Ã Â§â€¹ Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â²Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¥Ã Â¦Â®Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¶ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¹Ã Â¦Â° (Ã Â¦Â¯Ã Â§â€¡Ã Â¦Â®Ã Â¦Â¨- Ã Â¦Å“Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â² Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¹Ã Â¦Â°, Ã Â¦â€ Ã Â¦â€¡Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¹Ã Â¦Â°) Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¡Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "154",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "e-Recruitment",
    "link": "/e-recruitment-form",
    "descriptionEn": "Redesigned form tooltips with a professional card UI, detailed field instructions, and placed the hover icon before the label for improved user guidance.",
    "descriptionBn": "Ã Â¦â€¡-Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â²Ã Â¦Å¸Ã Â¦Â¿Ã Â¦ÂªÃ Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â²Ã Â§â€¡Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦â€ Ã Â¦â€”Ã Â§â€¡ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â«Ã Â§â€¹ Ã Â¦â€ Ã Â¦â€¡Ã Â¦â€¢Ã Â¦Â¨ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦â€”Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¦Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â§Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¥Â¤"
  },
  {
    "id": "153",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "e-Recruitment",
    "link": "/",
    "descriptionEn": "Hid the 'Settings' and 'Approved List' menus from the e-Recruitment section in both the sidebar and topbar navigation.",
    "descriptionBn": "Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Å¸Ã Â¦ÂªÃ Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€”Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€°Ã Â¦Â­Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦â€”Ã Â¦Â¾ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€¡-Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° 'Settings' Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'Approved List' Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¹Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "152",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "e-Recruitment",
    "link": "/e-recruitment-form",
    "descriptionEn": "Fixed an issue in the e-Recruitment form where the 'jobPost' property was missing from the URL search parameters type definition.",
    "descriptionBn": "e-Recruitment Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ URL Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ 'jobPost' Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â®Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦â€ºÃ Â¦Â¿Ã Â¦Â²Ã Â¥Â¤"
  },
  {
    "id": "151",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "e-Recruitment",
    "link": "/e-recruitment-form",
    "descriptionEn": "Completely redesigned the e-Recruitment form into a standalone page with a step-by-step sidebar navigation. The main app navigation has been removed from this page for a focused applicant experience.",
    "descriptionBn": "Ã Â¦â€¡-Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Âª-Ã Â¦Â¬Ã Â¦Â¾Ã Â¦â€¡-Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Âª Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€”Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¯Ã Â¦Â¼Ã Â¦â€šÃ Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¥Â¤ Ã Â¦Â«Ã Â§â€¹Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â¡ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¦Ã Â¦Â­Ã Â¦Â¿Ã Â¦Å“Ã Â§ï¿½Ã Â¦Å¾Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â®Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Âª Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€”Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦â€¡ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "150",
    "date": "2026-09-14T10:30",
    "type": "New Addition",
    "module": "e-Recruitment",
    "link": "/e-recruitment-link-generator",
    "descriptionEn": "Enhanced the 'Link Generator' workflow under e-Recruitment. Added 'Form Status' column and 'Copy Link', 'Offer Letter' buttons in the Application Queue list. The 'Review' button is now automatically disabled until the candidate fills out the form. Also added 'Form Status' and 'Workflow Status' dropdown filters to easily sort candidates.",
    "descriptionBn": "e-Recruitment Ã Â¦ï¿½Ã Â¦Â° Ã Â¦â€¦Ã Â¦Â§Ã Â§â‚¬Ã Â¦Â¨Ã Â§â€¡ 'Link Generator' Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡ 'Form Status' Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â® Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'Copy Link', 'Offer Letter' Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â® Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â² Ã Â¦â€ Ã Â¦Âª Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦ÂªÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤ 'Review' Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¯Ã Â¦Â¼Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€ºÃ Â¦Â¾Ã Â§Å“Ã Â¦Â¾ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“Ã Â§â€¡ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€“Ã Â§â€¹Ã Â¦ï¿½Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ 'Form Status' Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'Workflow Status' Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "149",
    "date": "2026-08-04T15:53",
    "type": "Modify",
    "module": "Personnel List",
    "link": "/personnel-list",
    "descriptionEn": "Removed the 'OT After(H)' field from the Assign OT And Allowance modal and updated the modal to automatically prefill and display the employee's existing OT Option and OT Rate if already assigned.",
    "descriptionBn": "Assign OT And Allowance Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ 'OT After(H)' Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â°Ã Â§â‚¬Ã Â¦Â° Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â§Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤ OT Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ Ã Â¦â€œ OT Rate Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦â€“Ã Â§â€¹Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â¤Ã Â¦Â¾ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â§Å¸Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "148",
    "date": "2026-08-04T15:33",
    "type": "New Addition",
    "module": "Personnel List",
    "link": "/personnel-list",
    "descriptionEn": "Implemented all operational modals for Personnel List: 'Shift Update' (Shift Rotation), 'Employee Status Change', 'Shift Update - Default Holiday', 'ID Card Issue Date', and 'Revenue Mapping' with interactive fields and submit actions.",
    "descriptionBn": "Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¹Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â² Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¬Ã Â¦Â¾Ã Â§Å¸Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: 'Shift Update' (Shift Rotation), 'Employee Status Change', 'Shift Update - Default Holiday', 'ID Card Issue Date', Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'Revenue Mapping'Ã Â¥Â¤"
  },
  {
    "id": "147",
    "date": "2026-08-04T15:30",
    "type": "New Addition",
    "module": "Personnel List",
    "link": "/personnel-list",
    "descriptionEn": "Added the 'Assign OT And Allowance' modal to Personnel List when clicking 'OT Status Update' for selected employees (with N/A, OverTime, Fixed OverTime options, OT Rate, Close/Delete/Submit buttons), and increased the Personnel Operations sidebar width for better readability.",
    "descriptionBn": "Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¹Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â² Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¡Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â°Ã Â§â‚¬Ã Â¦Â¦Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ 'OT Status Update' Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â²Ã Â§â€¡ 'Assign OT And Allowance' Ã Â¦ÂªÃ Â¦ÂªÃ Â¦â€ Ã Â¦Âª Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â§Ã Â¦Â¾Ã Â¦Å“Ã Â¦Â¨Ã Â¦â€¢Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â° Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥ (Width) Ã Â¦Â¬Ã Â¦Â¾Ã Â§Å“Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦Å¡Ã Â¦â€œÃ Â§Å“Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "146",
    "date": "2026-07-25T10:15",
    "type": "New Addition",
    "module": "Module Selection",
    "link": "/module-selection",
    "descriptionEn": "Created this 'Changes!' page! It works just like Excel, so you can easily track and edit all the new updates happening in the system.",
    "descriptionBn": "Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ 'Changes!' Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡! Ã Â¦ï¿½Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¤Ã Â§â€¹ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Å“ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡, Ã Â¦Â¤Ã Â¦Â¾Ã Â¦â€¡ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¨Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“Ã Â§â€¡Ã Â¦â€¡ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢ Ã Â¦â€œ Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨Ã Â¥Â¤"
  },
  {
    "id": "145",
    "date": "2026-07-25T11:45",
    "type": "Modify",
    "module": "Order Profile",
    "link": "/merchandising-order-profile",
    "descriptionEn": "Made the Basic Information section much cleaner! It's now laid out in 4 neat columns, making it much easier to read and prettier to look at.",
    "descriptionBn": "Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â°Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡! Ã Â¦ï¿½Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â§ÂªÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹, Ã Â¦Â«Ã Â¦Â²Ã Â§â€¡ Ã Â¦ÂªÃ Â§Å“Ã Â¦Â¾ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¤Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€”Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "144",
    "date": "2026-07-25T12:10",
    "type": "Modify",
    "module": "Order Profile",
    "link": "/merchandising-order-profile",
    "descriptionEn": "Fixed the messy tables for Yarn, Fabric, and Trim! They are now combined into one perfectly aligned master table.",
    "descriptionBn": "Yarn, Fabric Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Trim-Ã Â¦ï¿½Ã Â¦Â° Ã Â¦â€ºÃ Â§Å“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡! Ã Â¦ï¿½Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "143",
    "date": "2026-07-25T13:00",
    "type": "Modify",
    "module": "Order Profile",
    "link": "/merchandising-order-profile",
    "descriptionEn": "Made the tables more compact by reducing the text size and spacing. Now everything fits on the screen without having to scroll left and right!",
    "descriptionBn": "Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Å¸ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦â€¢Ã Â¦Â®Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦â€¢Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡-Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦â€ºÃ Â¦Â¾Ã Â§Å“Ã Â¦Â¾Ã Â¦â€¡ Ã Â¦Â¸Ã Â¦Â¬ Ã Â¦ï¿½Ã Â¦â€¢ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡!"
  },
  {
    "id": "142",
    "date": "2026-07-25T13:45",
    "type": "Modify",
    "module": "Global System",
    "link": "/",
    "descriptionEn": "Switched the entire system to default to Light Mode! Everything will look bright and clear right from the start.",
    "descriptionBn": "Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¥Ã Â¦Â¿Ã Â¦Â® Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡! Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¬Ã Â¦â€¢Ã Â¦Â¿Ã Â¦â€ºÃ Â§ï¿½ Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡Ã Â¦â€¡ Ã Â¦â€°Ã Â¦Å“Ã Â§ï¿½Ã Â¦Å“Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "141",
    "date": "2026-07-25T14:50",
    "type": "Modify",
    "module": "Personnel List",
    "link": "/personnel-list",
    "descriptionEn": "Moved the 'Operations' tools to a sidebar! Now, when you select an employee, the tools automatically pop up on the right side. You can still see the main table and continue clicking other employees to update multiple at once.",
    "descriptionBn": "Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¸Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡! Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¨Ã Â§â€¹ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¡ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¸Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¨Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡ Ã Â¦â€“Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¨Ã Â¦Â¿ Ã Â¦Â¤Ã Â¦â€“Ã Â¦Â¨Ã Â¦â€œ Ã Â¦Â®Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â§Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Å“ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨Ã Â¥Â¤"
  },
  {
    "id": "140",
    "date": "2026-07-25T15:08",
    "type": "Modify",
    "module": "Payroll Deductions",
    "link": "/payroll-deductions",
    "descriptionEn": "Removed the 'Auto-Skip during Ramadan' option and the 'Single Period Exceptions' configuration from the Payroll Deductions setup panel.",
    "descriptionBn": "Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â°Ã Â§â€¹Ã Â¦Â² Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â² Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ 'Ã Â¦Â°Ã Â§â€¹Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§â€¡ Ã Â¦â€¦Ã Â¦Å¸Ã Â§â€¹-Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¿Ã Â¦Âª' Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â„¢Ã Â§ï¿½Ã Â¦â€”Ã Â§â€¡Ã Â¦Â² Ã Â¦ÂªÃ Â¦Â¿Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨' Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¦ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "139",
    "date": "2026-07-25T15:35",
    "type": "Modify",
    "module": "User Management",
    "link": "/user-management",
    "descriptionEn": "Merged Company and Section access options into a nested view where Areas (renamed from Sections) show up directly under their selected Company. Renamed all 'Section' terms to 'Area'.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Å“Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸ Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¡ Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¤Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¾ (Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â® Ã Â¦ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¾) Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å¡Ã Â§â€¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€ºÃ Â¦Â¾Ã Â§Å“Ã Â¦Â¾ Ã Â¦Â¸Ã Â¦Â¬ Ã Â¦Å“Ã Â¦Â¾Ã Â§Å¸Ã Â¦â€”Ã Â¦Â¾Ã Â§Å¸ 'Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨' Ã Â¦Â¶Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¦Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â® Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ 'Ã Â¦ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¾' Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "138",
    "date": "2026-07-25T15:40",
    "type": "Modify",
    "module": "Salary Process",
    "link": "/monthly-salary-process",
    "descriptionEn": "Refactored the Payroll Adjustments editing dialog in Monthly Salary Process. Removed Section 1 (Attendance Parameters) and Section 2 (Monthly Earnings) fields. Upgraded Section 3 (Monthly Deductions & Exceptions) into a premium card-based layout with customized Lucide icons and currency symbols.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â²Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â° Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â°Ã Â§â€¹Ã Â¦Â² Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â²Ã Â¦â€” Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â§Â§ (Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°) Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â§Â¨ (Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â²Ã Â¦Â¿ Ã Â¦â€ Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸) Ã Â¦ï¿½Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¦ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€ºÃ Â¦Â¾Ã Â§Å“Ã Â¦Â¾ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â§Â© (Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â²Ã Â¦Â¿ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨Ã Â¦Â¸) Ã Â¦ï¿½Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€ Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â·Ã Â¦Â£Ã Â§â‚¬Ã Â§Å¸ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦â€ Ã Â¦â€¡Ã Â¦â€¢Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "137",
    "date": "2026-07-25T15:43",
    "type": "Modify",
    "module": "Salary Process",
    "link": "/monthly-salary-process",
    "descriptionEn": "Upgraded the Monthly Salary Process data table to match the detailed 58-column spreadsheet layout. Loaded the full 14 employees roster matching the active bank and account details exactly.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â²Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â§Â«Ã Â§Â®Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¦ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸Ã Â§â€¡ Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨Ã Â§â‚¬Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€šÃ Â¦â€¢ Ã Â¦â€œ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¨Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â°Ã Â¦Â¸Ã Â¦Â¹ Ã Â§Â§Ã Â§Âª Ã Â¦Å“Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¸ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "136",
    "date": "2026-07-25T15:46",
    "type": "Modify",
    "module": "Salary Process",
    "link": "/monthly-salary-process",
    "descriptionEn": "Added a custom column rearrangement and show/hide toggle panel to the Monthly Salary Process page, enabling draggable reordering, visibility control, and template saving matching the personnel list page design.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â²Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â® Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¹Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡/Ã Â¦Â¶Ã Â§â€¹ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡, Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¦Ã Â§Æ’Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¤Ã Â¦Â¾ Ã Â¦Â¨Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â£ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¹Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â² Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¤Ã Â§â€¹ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â­ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "135",
    "date": "2026-07-25T15:48",
    "type": "Modify",
    "module": "Salary Process",
    "link": "/monthly-salary-process",
    "descriptionEn": "Updated default column visibility to show all 58 columns on load, and removed the currency Taka (Ã Â§Â³) symbol from the table cell amounts.",
    "descriptionBn": "Ã Â¦Â¸Ã Â¦Â¬Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â§Â«Ã Â§Â®Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦Â¹Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â¦Ã Â§Æ’Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€“Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¾ (Ã Â§Â³) Ã Â¦Å¡Ã Â¦Â¿Ã Â¦Â¹Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¦ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "134",
    "date": "2026-07-25T16:20",
    "type": "Modify",
    "module": "Evaluation",
    "link": "/evaluation-propose",
    "descriptionEn": "Redesigned all 7 Evaluation sub-pages to be simpler and easier to use! Added a shared horizontal tab navigation bar across all pages so you can jump between Configurator, Evaluation Propose, Propose Increment, Summary, Queue & Approvals, Increment List, and History without using the sidebar. Also cleaned up breadcrumbs, added short descriptions to each page, and renamed jargon-heavy labels (e.g. 'Increment Gadget' is now 'Configurator'). Created a documentation file explaining how the full workflow works.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¬Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â§Â­Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“ Ã Â¦â€œ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡! Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦â€°Ã Â¦ÂªÃ Â¦Â°Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¹Ã Â¦Â°Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â² Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€ Ã Â¦â€ºÃ Â§â€¡ Ã¢â‚¬â€� Configurator, Evaluation Propose, Propose Increment, Summary, Queue & Approvals, Increment List, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š History Ã¢â‚¬â€� Ã Â¦Â¯Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€ºÃ Â¦Â¾Ã Â¦Â¡Ã Â¦Â¼Ã Â¦Â¾Ã Â¦â€¡ Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¨Ã Â§â€¹ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¬ Ã Â¦Â Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦â€ºÃ Â§â€¹Ã Â¦Å¸ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â¦Â£ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'Increment Gadget' Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¤Ã Â§â€¹ Ã Â¦â€¢Ã Â¦Â Ã Â¦Â¿Ã Â¦Â¨ Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€ºÃ Â¦Â¾Ã Â¦Â¡Ã Â¦Â¼Ã Â¦Â¾ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€“Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â²Ã Â¦â€œ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "133",
    "date": "2026-07-25T16:25",
    "type": "Modify",
    "module": "Evaluation",
    "link": "/evaluation-propose",
    "descriptionEn": "Fixed the double-navigation issue in the Evaluation module! Before, there were both sidebar sub-items AND a tab bar Ã¢â‚¬â€� which was confusing. Now the sidebar shows a single 'Evaluation' link, and the tab bar at the top of each page handles all navigation within the module. The sidebar also stays highlighted on all Evaluation pages.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â² Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€”Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Â Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡! Ã Â¦â€ Ã Â¦â€”Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ Ã Â¦â€ºÃ Â¦Â¿Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦â€œ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€ºÃ Â¦Â¿Ã Â¦Â² Ã¢â‚¬â€� Ã Â¦Â¦Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¹ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¿ Ã Â¦Â¹Ã Â¦Å¡Ã Â§ï¿½Ã Â¦â€ºÃ Â¦Â¿Ã Â¦Â²Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â§Ã Â§ï¿½ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ 'Evaluation' Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€šÃ Â¦â€¢ Ã Â¦â€ Ã Â¦â€ºÃ Â§â€¡, Ã Â¦â€ Ã Â¦Â° Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦â€°Ã Â¦ÂªÃ Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡Ã Â¦â€¡ Ã Â¦Â¸Ã Â¦Â¬ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤ Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¨Ã Â§â€¹ Ã Â¦â€¡Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° 'Evaluation' Ã Â¦â€ Ã Â¦â€¡Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â®Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¹Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¡ Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "132",
    "date": "2026-07-25T17:47",
    "type": "New Addition",
    "module": "Benefits",
    "link": "/payroll-benefits-common",
    "descriptionEn": "Brand new Common Benefits page built! You can now filter employees by type, department, section, and benefit category, then enter individual benefit amounts in an editable table. Features include select-all checkboxes, live amount totals, search, pagination, Excel/Print/PDF export, and a Save button with a confirmation toast.",
    "descriptionBn": "Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Common Benefits Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡! Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¨Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Âª, Ã Â¦Â¡Ã Â¦Â¿Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€”Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨Ã Â¥Â¤ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸-Ã Â¦â€¦Ã Â¦Â² Ã Â¦Å¡Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¬Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸, Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â­ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Å¸Ã Â§â€¹Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â², Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡, Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨, Excel/Print/PDF Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â­ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¨Ã Â§â€¹Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â¦â€œ Ã Â¦â€ Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "131",
    "date": "2026-07-25T17:50",
    "type": "New Addition",
    "module": "Benefits",
    "link": "/payroll-benefits-monthly",
    "descriptionEn": "New Monthly Benefits page is live! Filter by month, year, benefit type, benefit name, employee type, department, unit, or employee ID. Add new records via the '+' button or the FAB, edit or delete existing ones, and view full details in a clean modal. Modals match the rest of the system's style Ã¢â‚¬â€� orange CLOSE, green SUBMIT.",
    "descriptionBn": "Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Monthly Benefits Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡! Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸, Ã Â¦Â¬Ã Â¦â€ºÃ Â¦Â°, Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Âª, Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®, Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Âª, Ã Â¦Â¡Ã Â¦Â¿Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦â€¡Ã Â¦â€°Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â¬Ã Â¦Â¾ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦â€ Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¿ Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤ '+' Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦Â¬Ã Â¦Â¾ Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â°Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡, Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¦Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦Â¬Ã Â¦Â¾ Ã Â¦Â®Ã Â§ï¿½Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â«Ã Â§â€¡Ã Â¦Â²Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¬Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¤Ã Â§â€¹Ã Â¦â€¡ Ã¢â‚¬â€� Ã Â¦â€¦Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¾Ã Â§ï¿½Ã Â¦Å“ CLOSE, Ã Â¦Â¸Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Å“ SUBMITÃ Â¥Â¤"
  },
  {
    "id": "130",
    "date": "2026-07-25T21:30",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-dashboard",
    "descriptionEn": "Restructured the entire Merchandising module sidebar menu into 9 clean, task-oriented categories matching BD garments industry standard workflow stages. Also upgraded the Order Entry form workspace into a Unified Order & Costing Hub, adding a segmented Knit | Woven | Sweater type selector with dynamically conditional fields for Yarn counts, GSM, Weave density, or Sweater Gauges.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ Ã Â§Â¯Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“Ã Â§â€¡ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€”Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¨Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€”Ã Â¦Â Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦â€šÃ Â¦Â²Ã Â¦Â¾Ã Â¦Â¦Ã Â§â€¡Ã Â¦Â¶Ã Â§â€¡Ã Â¦Â° Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¸ Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦Â§Ã Â¦Â¾Ã Â¦ÂªÃ Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â®Ã Â¦Å¾Ã Â§ï¿½Ã Â¦Å“Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£Ã Â¥Â¤ Ã Â¦Â¤Ã Â¦Â¾Ã Â¦â€ºÃ Â¦Â¾Ã Â¦Â¡Ã Â¦Â¼Ã Â¦Â¾ Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¡Ã Â¦â€°Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡ Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â°Ã Â§â€šÃ Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å¸, Ã Â¦â€œÃ Â¦Â­Ã Â§â€¡Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€ Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾ Ã Â¦â€ Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â² Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¯Ã Â§â€¡Ã Â¦Â®Ã Â¦Â¨ Ã Â¦Å“Ã Â¦Â¿Ã Â¦ï¿½Ã Â¦Â¸Ã Â¦ï¿½Ã Â¦Â®, Ã Â¦â€¡Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦â€°Ã Â¦â€¡Ã Â¦Â­ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€”Ã Â¦Å“ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¯Ã Â¦Â¼Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Å¡Ã Â¦Â²Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â¸Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "129",
    "date": "2026-07-25T21:40",
    "type": "New Addition",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Built the complete RMG Merchandising ERP Suite! Created 7 brand-new dedicated pages: Master Settings (Buyer config, Fabric/Yarn specs, Process Loss %, Trims master), Capacity Planning & Booking (SMV calculator, Monthly limits, Over-booking alerts), Sample Development Tracker (Proto/Fit/PP requisitions & Buyer feedback), Material Bookings (Auto Yarn Kg calculator, Fabric & Trims WOs), Service Work Orders (Washing, Printing, Dyeing, Embroidery sub-contracts), TNA Critical Path Calendar (11 Milestones timeline), and MM BI Reports (PO Order status, Buyer export share). All sidebar links are fully connected.",
    "descriptionBn": "Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦â€ Ã Â¦Â°Ã Â¦ï¿½Ã Â¦Â®Ã Â¦Å“Ã Â¦Â¿ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦â€¡Ã Â¦â€ Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡! Ã Â§Â­Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸, Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€š, Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â² Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°, Ã Â¦Â®Ã Â§â€¡Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¬Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¿Ã Â¦â€š, Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â­Ã Â¦Â¿Ã Â¦Â¸ Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢ Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°, Ã Â¦Å¸Ã Â¦Â¿Ã Â¦ï¿½Ã Â¦Â¨Ã Â¦ï¿½ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ï¿½Ã Â¦Â® Ã Â¦Â¬Ã Â¦Â¿Ã Â¦â€ Ã Â¦â€¡ Ã Â¦Â°Ã Â¦Â¿Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¸Ã Â¥Â¤ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¬ Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€šÃ Â¦â€¢ Ã Â¦Â¸Ã Â¦Å¡Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "128",
    "date": "2026-07-25T21:51",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Completely eliminated duplicate navigation in the Merchandising module! Replaced redundant accordion sub-menus in the sidebar with clean, direct-action top-level navigation links. Sub-view switching is now handled exclusively by the sleek horizontal top tab bar on each dedicated module page for a 100% stable, uncluttered user experience.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€”Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¦Ã Â§â€šÃ Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡! Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¡Ã Â¦Â¼Ã Â¦Â¤Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â°Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸-Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€šÃ Â¦â€¢ Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¬ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Å¡Ã Â§ï¿½Ã Â¦â€ºÃ Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Å¸Ã Â¦Âª Ã Â¦Â¹Ã Â¦Â°Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â² Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Â¹Ã Â¦Â¬Ã Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â§Â§Ã Â§Â¦Ã Â§Â¦% Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¿Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Â¶Ã Â§â‚¬Ã Â¦Â² Ã Â¦â€œ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â°Ã Â¥Â¤"
  },
  {
    "id": "127",
    "date": "2026-07-25T22:00",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-dashboard",
    "descriptionEn": "Deep-researched and rebuilt the entire Merchandising sidebar navigation from scratch based on real Bangladesh RMG ERP standards (OCMS BD, PrideSys, Infocrat). New structure: 'Master Settings' accordion (5 sub-items linking directly to specific database tabs), 'Orders & Costing' accordion (Order Ledger + New Order Entry), and 6 clean flat-link items (Sample, Material Booking, Work Orders, TNA, Capacity, Reports). Active state auto-highlights the correct parent and child. Smart auto-expand: accordion opens automatically when you navigate to its page.",
    "descriptionBn": "Ã Â¦Â¬Ã Â¦Â¾Ã Â¦â€šÃ Â¦Â²Ã Â¦Â¾Ã Â¦Â¦Ã Â§â€¡Ã Â¦Â¶Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¬ Ã Â¦â€ Ã Â¦Â°Ã Â¦ï¿½Ã Â¦Â®Ã Â¦Å“Ã Â¦Â¿ Ã Â¦â€¡Ã Â¦â€ Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° (OCMS BD, PrideSys, Infocrat) Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â§â‚¬ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€”Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â°: 'Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸' Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨ (Ã Â§Â«Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦â€ Ã Â¦â€¡Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â® Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦â€“Ã Â§â€¹Ã Â¦Â²Ã Â§â€¡), 'Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€œ Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š' Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨ (Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â²Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â° + Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿), Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â§Â¬Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸ Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€šÃ Â¦â€¢ (Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â², Ã Â¦Â®Ã Â§â€¡Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¬Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¿Ã Â¦â€š, Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢ Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°, Ã Â¦Å¸Ã Â¦Â¿Ã Â¦ï¿½Ã Â¦Â¨Ã Â¦ï¿½, Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿, Ã Â¦Â°Ã Â¦Â¿Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¸)Ã Â¥Â¤ Ã Â¦Â¸Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â®Ã Â¦Â¿Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€ Ã Â¦â€¡Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â® Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¯Ã Â¦Â¼Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¹Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å¸ Ã Â¦â€œ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨ Ã Â¦â€“Ã Â§â€¹Ã Â¦Â²Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "126",
    "date": "2026-07-25T22:09",
    "type": "New Addition",
    "module": "Merchandising",
    "link": "/merchandising-inquiry",
    "descriptionEn": "Added the missing first stage of the garments order lifecycle: 'Buyer Inquiry & Pre-Costing Quotation' page. The Orders & Costing sidebar accordion now correctly shows all 3 workflow steps in order: Buyer Inquiry & Quotation Ã¢â€ â€™ Purchase Order (PO) Register Ã¢â€ â€™ Order Entry & Costing (KDS). The new inquiry page includes: Inquiry Register (log buyer style inquiries with AQL, payment terms, ship date), a live Pre-Costing Engine (auto-calculates Quoted FOB from fabric consumption, CMT, trims, overheads and profit margin), and a Quotation Status Kanban Board (Draft Ã¢â€ â€™ Sent to Buyer Ã¢â€ â€™ Buyer Approved Ã¢â€ â€™ Converted to PO).",
    "descriptionBn": "Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¸ Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â«Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¥Ã Â¦Â® Ã Â¦Â§Ã Â¦Â¾Ã Â¦Âª Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: 'Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿-Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨' Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ 'Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€œ Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š' Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â§Ã Â¦Â¾Ã Â¦Âª Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Å¡Ã Â§ï¿½Ã Â¦â€ºÃ Â§â€¡: Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã¢â€ â€™ Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€œ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã¢â€ â€™ Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¥Â¤ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦â€ Ã Â¦â€ºÃ Â§â€¡: Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° (Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿, Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¿Ã Â¦â€°Ã Â¦ï¿½Ã Â¦Â², Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¸ Ã Â¦Â²Ã Â¦â€”), Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â­ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿-Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦â€¡Ã Â¦Å¾Ã Â§ï¿½Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¨ (Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨, Ã Â¦Â¸Ã Â¦Â¿Ã Â¦ï¿½Ã Â¦Â®Ã Â¦Å¸Ã Â¦Â¿, Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¸, Ã Â¦â€œÃ Â¦Â­Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¹Ã Â§â€¡Ã Â¦Â¡ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â«Ã Â¦â€œÃ Â¦Â¬Ã Â¦Â¿ Ã Â¦â€¦Ã Â¦Å¸Ã Â§â€¹-Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Å¸) Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ (Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â«Ã Â¦Å¸ Ã¢â€ â€™ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã¢â€ â€™ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â­Ã Â¦Â¡ Ã¢â€ â€™ Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€œÃ Â¦Â¤Ã Â§â€¡ Ã Â¦Â°Ã Â§â€šÃ Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â°)Ã Â¥Â¤"
  },
  {
    "id": "125",
    "date": "2026-07-27T10:10",
    "type": "Modify",
    "module": "Company Setup",
    "link": "/company-setup",
    "descriptionEn": "Added all 15 missing parameters to the Company Basic Settings modal matching the enterprise standard layout! Included New Employee Approval, Authorization (L/E), Absent Deduct Based On, ML Count, ML Stamp, WithOut In Absent, Searching By, Holiday Tiffin, Holiday Night, Early Out, Early Out Based On, Salary Breakdown Round, Sandwich Holiday, Sandwich Employee Type, and Late Time Calculation.",
    "descriptionBn": "Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿ Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸Ã Â§â‚¬ Ã Â§Â§Ã Â§Â«Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡! Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦Â°Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€° Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§Å¸Ã Â¦Â¿ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â², Ã Â¦â€¦Ã Â¦Â¥Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ (Ã Â¦ï¿½Ã Â¦Â²/Ã Â¦â€¡), Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¸Ã Â¦Â¡ Ã Â¦â€¦Ã Â¦Â¨, Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ï¿½Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ï¿½Ã Â¦Â² Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â®Ã Â§ï¿½Ã Â¦Âª, Ã Â¦â€°Ã Â¦â€¡Ã Â¦Â¦Ã Â¦Â¾Ã Â¦â€°Ã Â¦Å¸ Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¬Ã Â¦Â¾Ã Â¦â€¡, Ã Â¦Â¹Ã Â§â€¹Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡ Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â¨, Ã Â¦Â¹Ã Â§â€¹Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å¸, Ã Â¦â€ Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¿ Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸, Ã Â¦â€ Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¿ Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¸Ã Â¦Â¡ Ã Â¦â€¦Ã Â¦Â¨, Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡, Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦â€°Ã Â¦â€¡Ã Â¦Å¡ Ã Â¦Â¹Ã Â§â€¹Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡, Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦â€°Ã Â¦â€¡Ã Â¦Å¡ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§Å¸Ã Â¦Â¿ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Âª Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â²Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â® Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â¥Â¤"
  },
  {
    "id": "124",
    "date": "2026-07-27T10:12",
    "type": "Modify",
    "module": "Company Setup",
    "link": "/company-setup",
    "descriptionEn": "Reorganized the Company Basic Settings modal with interactive category filter tabs (All Settings, Approvals & Governance, Attendance & Work, OT & Allowances, Leave & Holidays, Salary & Validation, ID & System Setup) and 6 structured 4-column responsive grid cards with clear red asterisks for required fields.",
    "descriptionBn": "Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿ Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Å¡Ã Â¦Â®Ã Â§Å½Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â­ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€”Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬ (Ã Â¦â€¦Ã Â¦Â² Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸, Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¸, Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸, Ã Â¦â€œÃ Â¦Â­Ã Â¦Â¾Ã Â¦Â°Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â®, Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â­ Ã Â¦â€œ Ã Â¦Â¹Ã Â§â€¹Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡, Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿, Ã Â¦â€ Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¿ Ã Â¦â€œ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â® Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸) Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â§Â¬Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â§Âª-Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¸Ã Â¦ÂªÃ Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â­ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€œ Ã Â¦â€”Ã Â§â€¹Ã Â¦â€ºÃ Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "123",
    "date": "2026-07-27T11:26",
    "type": "New Addition",
    "module": "Payroll",
    "link": "/payroll-benefits-master-data",
    "descriptionEn": "Built the complete Payroll Master Data (Master Information) page matching the enterprise standard screen! Features Master For category selection (Common Benefit Add/Deduct, Individual Benefit Add/Deduct, Bonus Type / Festival Master), inline entry form (Name, Comments, Status), table row editing via pencil icon, Excel/Print/PDF exports, status filters, live search, and dynamic record counters.",
    "descriptionBn": "Ã Â¦ÂªÃ Â§â€¡ Ã Â¦Â°Ã Â§â€¹Ã Â¦Â² Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â°Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£Ã Â¦Â°Ã Â§â€šÃ Â¦ÂªÃ Â§â€¡ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡! Ã Â¦ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â°Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â«Ã Â¦Â° Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€”Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¡Ã Â¦Â¨ (Ã Â¦â€¢Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¨ Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡/Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â­Ã Â¦Â¿Ã Â¦Å“Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¿Ã Â¦Å¸, Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Âª/Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°), Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â® (Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â®, Ã Â¦â€¢Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¸, Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¸), Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â² Ã Â¦â€ Ã Â¦â€¡Ã Â¦â€¢Ã Â¦Â¨ Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â°Ã Â§â€¹ Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š, Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â²/Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸/Ã Â¦ÂªÃ Â¦Â¿Ã Â¦Â¡Ã Â¦Â¿Ã Â¦ï¿½Ã Â¦Â« Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â­ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¹Ã Â¦Â°Ã Â§â€¡Ã Â¦Å“Ã Â¥Â¤"
  },
  {
    "id": "122",
    "date": "2026-07-27T11:45",
    "type": "Modify",
    "module": "Payroll",
    "link": "/payroll-benefits-master-data",
    "descriptionEn": "Completely redesigned the Payroll Master Data page for zero-scroll list efficiency! Replaced static top form with an instant List View first design, top horizontal category pills filter, status badges, one-click table row status toggling, and a prominent '+ Add Master Item' primary button that opens a sleek backdrop modal for adding and editing master options without pushing data down.",
    "descriptionBn": "Ã Â¦ÂªÃ Â§â€¡ Ã Â¦Â°Ã Â§â€¹Ã Â¦Â² Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â°Ã Â§â€¹-Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â² Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â«Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¨Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€”Ã Â¦Â Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡! Ã Â¦â€ Ã Â¦â€”Ã Â§â€¡ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â£Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¹Ã Â¦Â¤Ã Â§â€¹, Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¡Ã Â§â€¡Ã Â¦â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¦Ã Â§Æ’Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨Ã Â¥Â¤ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€”Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â¿Ã Â¦Â²Ã Â¦Â¸, Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â°Ã Â§â€¹ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢-Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ '+ Add Master Item' Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ÂªÃ Â¦ÂªÃ Â¦â€ Ã Â¦Âª Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€œ Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾ Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€“Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "121",
    "date": "2026-07-27T11:48",
    "type": "Modify",
    "module": "Payroll",
    "link": "/payroll-benefits-master-data",
    "descriptionEn": "Cleaned and refined the Master Information page to exact original specifications! Removed redundant top navigation pills and horizontal category scroll bars, restoring the ultra-clean enterprise Master Information layout with a 4-column entry form (Master For, Name, Comments, Status), table export controls (Excel, Print, PDF), pencil edit actions, and bottom SUBMIT button.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â°Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¦Ã Â¦Â® Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€“Ã Â§ï¿½Ã Â¦ï¿½Ã Â¦Â¤ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â²-Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸Ã Â§â€¡ Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡! Ã Â¦â€¦Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§Å¸Ã Â§â€¹Ã Â¦Å“Ã Â¦Â¨Ã Â§â‚¬Ã Â§Å¸ Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€”Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â¦Â¿Ã Â¦Â²Ã Â¦Â¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€”Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â² Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¦ Ã Â¦Â¦Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â§Âª-Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â® Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â® (Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â«Ã Â¦Â°, Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â®, Ã Â¦â€¢Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¸, Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¸), Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸ (Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â², Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦ÂªÃ Â¦Â¿Ã Â¦Â¡Ã Â¦Â¿Ã Â¦ï¿½Ã Â¦Â«), Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¦Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¦Ã Â¦Â® Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "120",
    "date": "2026-07-27T11:49",
    "type": "Modify",
    "module": "Payroll",
    "link": "/payroll-benefits-master-data",
    "descriptionEn": "Elevated the Master Information page with stunning modern aesthetics and placed all 4 form fields (Master For *, Name *, Comments, Status *) inside an interactive '+ Add Master Item' modal popup! Features an indigo-purple gradient hero banner, real-time KPI stats (Total Items, Active, Inactive), category dropdown filter, search box, export options, and one-click status toggling.",
    "descriptionBn": "Ã Â¦ÂªÃ Â§â€¡ Ã Â¦Â°Ã Â§â€¹Ã Â¦Â² Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â°Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â²Ã Â§ï¿½Ã Â¦â€¢ Ã Â¦â€œ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¦Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡! Ã Â§ÂªÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡ (Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â«Ã Â¦Â°, Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â®, Ã Â¦â€¢Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¸, Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¸) Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ '+ Add Master Item' Ã Â¦ÂªÃ Â¦ÂªÃ Â¦â€ Ã Â¦Âª Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¤Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦Â¨Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦â€œÃ Â¦ÂªÃ Â¦Â°Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â°Ã Â§â€¹ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â°, Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡Ã Â¦Â²-Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â® Ã Â¦â€¢Ã Â§â€¡Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€ Ã Â¦â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¸, Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€”Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "119",
    "date": "2026-07-27T11:52",
    "type": "Modify",
    "module": "Payroll",
    "link": "/payroll-benefits-master-data",
    "descriptionEn": "Updated all primary action buttons on the Payroll Master Data page (including the main header button, footer button, and modal submit button) to use the project's standard primary brand color (bg-primary) for visual consistency.",
    "descriptionBn": "Ã Â¦ÂªÃ Â§â€¡ Ã Â¦Â°Ã Â§â€¹Ã Â¦Â² Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦â€¢Ã Â¦Â² Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ (Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â§Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦Â¹Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨, Ã Â¦Â«Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨) Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Å“Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â° (bg-primary) Ã Â¦ï¿½ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â®Ã Â¦Å¾Ã Â§ï¿½Ã Â¦Å“Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "118",
    "date": "2026-07-27T11:53",
    "type": "Modify",
    "module": "Payroll",
    "link": "/payroll-benefits",
    "descriptionEn": "Removed redundant 'Loan/Advance Req.' and 'Loan Reschedule Sys.' submenus under the Benefits section in both the main sidebar navigation and the Payroll Benefits overview dashboard page.",
    "descriptionBn": "Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¸ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¦Ã Â¦Â§Ã Â§â‚¬Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¾ Ã Â¦â€¦Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§Å¸Ã Â§â€¹Ã Â¦Å“Ã Â¦Â¨Ã Â§â‚¬Ã Â§Å¸ 'Loan/Advance Req.' Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'Loan Reschedule Sys.' Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ Ã Â¦Â¦Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â®Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€”Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§â€¡ Ã Â¦Â°Ã Â§â€¹Ã Â¦Â² Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¸ Ã Â¦â€œÃ Â¦Â­Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¶Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¦ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "117",
    "date": "2026-07-28T14:55",
    "type": "Modify",
    "module": "Benefits",
    "link": "/payroll-benefits-common",
    "descriptionEn": "Redesigned the Common Benefits page into a highly user-friendly dual-view layout. Replaced the modal with a spacious full-screen Configure Workspace, featuring dynamic employee lists, default quick-fill amounts, individual overrides, and manual employee add/remove controls.",
    "descriptionBn": "Ã Â¦â€¢Ã Â¦Â®Ã Â¦Â¨ Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¸ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â°-Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â²Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â²-Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸Ã Â§â€¡ Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²-Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¸ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦â€¡Ã Â¦â€¢-Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â² Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤/Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¦ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â§Ã Â¦Â¾ Ã Â¦Â°Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "116",
    "date": "2026-07-28T15:56",
    "type": "Modify",
    "module": "Company Setup",
    "link": "/company-setup",
    "descriptionEn": "Added a new 'Half Leave' Yes/No setting dropdown to the Company Architecture & ID Setup configuration panel on the Company Setup page.",
    "descriptionBn": "Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦â€ Ã Â¦Âª Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿ Ã Â¦â€ Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦â€ Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¿ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦â€ Ã Â¦Âª Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â²Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ 'Half Leave' (Yes/No) Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "115",
    "date": "2026-07-29T10:10",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-dashboard",
    "descriptionEn": "Simplified the Merchandising module sidebar menu by removing all other links and keeping only the Dashboard and Order Entry & Costing workspace.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¸Ã Â¦Â¬ Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€šÃ Â¦â€¢ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¦ Ã Â¦Â¦Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â° Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¶Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€œ Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¸ Ã Â¦Â°Ã Â§â€¡Ã Â¦â€“Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "114",
    "date": "2026-07-29T10:12",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Added the new 'MERC Master Setting' accordion sidebar menu containing 34 custom submenus, correctly mapped to default RMG database tabs.",
    "descriptionBn": "Ã Â§Â©Ã Â§ÂªÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ 'MERC Master Setting' Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¯Ã Â¦Â¥Ã Â§â€¹Ã Â¦ÂªÃ Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ RMG Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¸ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â¸Ã Â¦â€šÃ Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "113",
    "date": "2026-07-29T10:15",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Refactored the MERC Master Settings to use a clean split layout. The sidebar menu now has a single direct link, and the settings page groups all 34 sub-settings into interactive sub-tabs nested within the 5 main database categories. Also built a fully functional generic CRUD Master DB manager.",
    "descriptionBn": "MERC Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Å¡Ã Â¦Â®Ã Â§Å½Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸Ã Â§â€¡ Ã Â¦Â°Ã Â§â€šÃ Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€šÃ Â¦â€¢ Ã Â¦Â°Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¤Ã Â¦Â°Ã Â§â€¡ Ã Â§Â©Ã Â§ÂªÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦â€¢Ã Â§â€¡ Ã Â§Â«Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â®Ã Â§â€šÃ Â¦Â² Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€”Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â° Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¤Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦â€ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€ºÃ Â¦Â¾Ã Â§Å“Ã Â¦Â¾ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²-Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€šÃ Â¦Â¶Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â² Ã Â¦Å“Ã Â§â€¡Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ CRUD Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¸ Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "112",
    "date": "2026-07-29T10:23",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Reorganized the Merchandising Settings hierarchy to match the requested 8-category taxonomy (Company Configuration, Business Partners, Product Masters, Fabric Masters, Yarn Masters, Color & Processing, Costing, and Quality). Renamed the sidebar settings menu to 'Merchandising Settings'.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â°Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â§Ã Â¦â€¢Ã Â§Æ’Ã Â¦Â¤ Ã Â§Â®Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€”Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤Ã Â§â€¡ (Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨, Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â¸ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â°, Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¸, Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¸, Ã Â¦â€¡Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¸, Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€œ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€š, Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿) Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â® Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ 'Merchandising Settings' Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "111",
    "date": "2026-07-29T10:25",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented a fully nested three-level accordion layout in the Merchandising Settings sidebar. Clicking 'Merchandising Settings' now reveals the 8 sub-categories, and clicking each sub-category reveals its corresponding parameter configuration links.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ 'Merchandising Settings' Ã Â¦ï¿½ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â²Ã Â§â€¡ Ã Â§Â®Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€”Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¦Ã Â§Æ’Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€”Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤Ã Â§â€¡ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â­Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€šÃ Â¦â€¢Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¥Â¤"
  },
  {
    "id": "110",
    "date": "2026-07-29T11:20",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Fixed the sidebar scrolling behavior by removing nested max-height restrictions and duplicate scrollbars from the nested subGroup accordion containers, allowing the entire sidebar pane to scroll naturally.",
    "descriptionBn": "Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Âª Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€¦Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸-Ã Â¦Â¹Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â²Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦Â«Ã Â§â€¡Ã Â¦Â²Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â«Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¡Ã Â§ï¿½Ã Â¦â€ºÃ Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¥Â¤"
  },
  {
    "id": "109",
    "date": "2026-07-29T11:25",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Fixed text alignment issues on the accordion header buttons by adding the 'text-left' class, ensuring wrapped texts are properly left-aligned.",
    "descriptionBn": "Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨ Ã Â¦Â¹Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â° Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Å¸ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ 'text-left' Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Å¡Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â§â€¡ Ã Â¦Â°Ã¢â‚¬ï¿½Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Âª Ã Â¦Â¹Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦ï¿½ Ã Â¦Â¦Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "108",
    "date": "2026-07-30T10:59",
    "type": "New Addition",
    "module": "Personnel File",
    "link": "/add-employee",
    "descriptionEn": "Added a new 'Allowance' card to the personnel file creation page and updated the employee detail view to show these overtime, holiday rate, behavior bonus, and transport/mobile/lunch allowances dynamically.",
    "descriptionBn": "Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¹Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â² Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ 'Allowance' Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§Å¸Ã Â¦Â¿ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸ Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦â€œÃ Â¦Â­Ã Â¦Â¾Ã Â¦Â°Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â®, Ã Â¦Â¹Ã Â§â€¹Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸, Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¹Ã Â§â€¡Ã Â¦Â­Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸/Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¬Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â²/Ã Â¦Â²Ã Â¦Â¾Ã Â¦Å¾Ã Â§ï¿½Ã Â¦Å¡ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¿ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "107",
    "date": "2026-07-30T11:05",
    "type": "Modify",
    "module": "Personnel File",
    "link": "/add-employee",
    "descriptionEn": "Simplified the Disbursement Routing & Bank Details card to show only Bank Pay, Cash Pay, Bank Name, and Account Number in both employee creation and employee detail views.",
    "descriptionBn": "Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸ Ã Â¦â€°Ã Â¦Â­Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦â€¡ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€šÃ Â¦â€¢ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€šÃ Â¦â€¢ Ã Â¦ÂªÃ Â§â€¡, Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¶ Ã Â¦ÂªÃ Â§â€¡, Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€šÃ Â¦â€¢Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â® Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¨Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â° Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¥Â¤"
  },
  {
    "id": "106",
    "date": "2026-07-30T11:10",
    "type": "Modify",
    "module": "Personnel File",
    "link": "/add-employee",
    "descriptionEn": "Shifted Job Description and Assigned Equipment & Assets sections from Financial & Employment to Qualifications & Experience tab on both employee creation and details screens. Removed the Submit button from the custom Allowance card.",
    "descriptionBn": "Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸ Ã Â¦â€°Ã Â¦Â­Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦â€¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Å“Ã Â¦Â¬ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¸Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¢Ã Â¦Â°Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦â€¡Ã Â¦ÂªÃ Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¦Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â² Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦Â«Ã Â§â€¡Ã Â¦Â²Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "105",
    "date": "2026-07-30T11:15",
    "type": "Modify",
    "module": "Personnel File",
    "link": "/add-employee",
    "descriptionEn": "Implemented robust file uploading, size validation (5MB max), extension validation (.pdf, .jpg, .jpeg, .png), upload progress indicators, and an interactive secure document preview modal for academic and experience attachments.",
    "descriptionBn": "Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â¦Â­Ã Â¦Â¿Ã Â¦Å“Ã Â§ï¿½Ã Â¦Å¾Ã Â¦Â¤Ã Â¦Â¾ Ã Â¦Â¸Ã Â¦Â¨Ã Â¦Â¦Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Å¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¶Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¾Ã Â¦Â²Ã Â§â‚¬ Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â²Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€š, Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“ Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ (Ã Â¦Â¸Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¬Ã Â§â€¹Ã Â¦Å¡Ã Â§ï¿½Ã Â¦Å¡ Ã Â§Â« Ã Â¦Â®Ã Â§â€¡Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å¸), Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ (.pdf, .jpg, .jpeg, .png), Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¸ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â­ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â° Ã Â¦Â¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "104",
    "date": "2026-07-30T12:00",
    "type": "Modify",
    "module": "Personnel File",
    "link": "/add-employee",
    "descriptionEn": "Added a smart missing attachment warning modal on form submit. It detects which academic degrees and work experience entries are filled in but missing a supporting document, lists them by name, and lets the user go back to attach files or proceed anyway.",
    "descriptionBn": "Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â® Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â®Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Å¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¯Ã Â¦Â¼Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¬Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦â€¦Ã Â¦Â­Ã Â¦Â¿Ã Â¦Å“Ã Â§ï¿½Ã Â¦Å¾Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨Ã Â¦Â¿, Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â¾ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â°Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§â‚¬Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â°Ã Â§â€¡ Ã Â¦â€”Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦Â¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â¾ Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¼Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦Â¦Ã Â§â€¡Ã Â¦Â¯Ã Â¦Â¼Ã Â¥Â¤"
  },
  {
    "id": "103",
    "date": "2026-07-30T12:12",
    "type": "Modify",
    "module": "Personnel File",
    "link": "/add-employee",
    "descriptionEn": "Implemented the dynamic pre-upload attachment ID generation and saved qualification/experience details with attachment tokens in localStorage during employee creation.",
    "descriptionBn": "Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿-Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Å¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€ Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¿ Ã Â¦Å“Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¹Ã Â¦Â°Ã Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Å¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Å¸Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦Â¸Ã Â¦â€šÃ Â¦Â°Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â·Ã Â¦Â£ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "102",
    "date": "2026-07-30T14:18",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-dashboard",
    "descriptionEn": "Restructured the Merchandising module sidebar menu to align with the core RMG workflow: Inquiry, Quotation, PO Management, Pre Costing, Order Management (with sub-menus), Yarn Booking, and Fabric Booking, with the Merchandising Settings category moved to the top.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ Ã Â¦â€ Ã Â¦Â°Ã Â¦ï¿½Ã Â¦Â®Ã Â¦Å“Ã Â¦Â¿ Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â§â‚¬ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ (Inquiry, Quotation, PO Management, Pre Costing, Order Management sub-menus, Yarn Booking Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Fabric Booking) Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'Merchandising Settings' Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€°Ã Â¦ÂªÃ Â¦Â°Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "101",
    "date": "2026-07-30T14:24",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-dashboard",
    "descriptionEn": "Added 'Capacity' section with sub-menus (Monthly Capacity, Capacity Allocation, Capacity Distribution, Sales Target Entry) right after the Dashboard category in the Merchandising module sidebar.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Dashboard-Ã Â¦ï¿½Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â° Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ 'Capacity' Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Â®Ã Â§â€šÃ Â¦Â¹ (Monthly Capacity, Capacity Allocation, Capacity Distribution, Sales Target Entry) Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "100",
    "date": "2026-07-30T14:30",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-capacity-planning",
    "descriptionEn": "Implemented the fully interactive Capacity Allocation module, including a spreadsheet-style Master Ledger view with filters/searches/exports, and an inline day-by-day calculation form for month-wise line capacity allocation.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â²Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â­ 'Capacity Allocation' Ã Â¦Â«Ã Â¦Â¿Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â®Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°/Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡/Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Å¸-Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â²Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Â­Ã Â¦Â¿Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â® Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¸ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â­Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦Â°Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "99",
    "date": "2026-07-30T14:46",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-capacity-planning",
    "descriptionEn": "Implemented the 'Monthly Capacity' configuration panel inside the capacity planning module. Added Status, Year, and Month filters, spreadsheet export capabilities, and loaded realistic month-wise line machine/SMV capacity calculation entries as seed data.",
    "descriptionBn": "Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¦Ã Â¦Â§Ã Â§â‚¬Ã Â¦Â¨Ã Â§â€¡ 'Monthly Capacity' Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â² Ã Â¦â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â®Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¸, Ã Â¦Â¬Ã Â¦â€ºÃ Â¦Â°, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°, Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â­Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â¨/Ã Â¦ï¿½Ã Â¦Â¸Ã Â¦ï¿½Ã Â¦Â®Ã Â¦Â­Ã Â¦Â¿ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â®Ã Â§â€¹ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "98",
    "date": "2026-07-30T14:48",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-capacity-planning",
    "descriptionEn": "Implemented the 'Capacity Distribution' workspace and list ledger in the capacity planning module. Features auto-lookup of month-wise capacities, multi-buyer selection (Zara, Mango, Fatface, etc.), allocation ratio validation, and real-time distribution summaries.",
    "descriptionBn": "Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â²Ã Â§â€¡ 'Capacity Distribution' Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦â€œ Ã Â¦Â²Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â­Ã Â¦Â¿Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â®Ã Â§â€¹Ã Â¦Å¸ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â²-Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾, Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¦Ã Â§â€¡Ã Â¦Â° (Ã Â¦Â¯Ã Â§â€¡Ã Â¦Â®Ã Â¦Â¨: Zara, Mango, Fatface Ã Â¦â€¡Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¿) Ã Â¦Â®Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦Â¶Ã Â¦Â¤Ã Â¦Â¾Ã Â¦â€šÃ Â¦Â¶ Ã Â¦Â­Ã Â¦Â¾Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â²-Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â®Ã Â§â€¹Ã Â¦Å¸ Ã Â¦Â¬Ã Â¦Â£Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€”Ã Â¦Â«Ã Â¦Â² Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "97",
    "date": "2026-07-30T14:55",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-monthly-capacity",
    "descriptionEn": "Refactored the capacity planning module from a single tabbed route to four separate, independent URLs/pages: /merchandising-monthly-capacity, /merchandising-capacity-allocation, /merchandising-capacity-distribution, and /merchandising-sales-target-entry. Updated the merchandising sidebar layout and navigation routes accordingly.",
    "descriptionBn": "Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â²Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â° Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â¡ Ã Â¦â€¡Ã Â¦â€°Ã Â¦â€ Ã Â¦Â°Ã Â¦ï¿½Ã Â¦Â² Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â§ÂªÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾ Ã Â¦â€¡Ã Â¦â€°Ã Â¦â€ Ã Â¦Â°Ã Â¦ï¿½Ã Â¦Â² Ã Â¦â€œ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â­Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: /merchandising-monthly-capacity, /merchandising-capacity-allocation, /merchandising-capacity-distribution Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š /merchandising-sales-target-entryÃ Â¥Â¤ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦â€œ Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€”Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€šÃ Â¦â€¢Ã Â¦Â¸Ã Â¦Â®Ã Â§â€šÃ Â¦Â¹ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "96",
    "date": "2026-07-30T14:58",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-capacity-distribution",
    "descriptionEn": "Refactored the Capacity Distribution list layout and edit controls to match the user's reference columns: SL, edit pencil, Company Name, Location, Year, Month, Total Capacity (Min), and Total Capacity (Pcs). Also refactored the creation/editing view to open in a wide modal overlay with a dual-panel layout.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¦Ã Â§â€¡Ã Â§Å¸Ã Â¦Â¾ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Â¶Ã Â¦Å¸ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸Ã Â§â‚¬ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¸Ã Â¦Â®Ã Â§â€šÃ Â¦Â¹ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â² Ã Â¦ÂªÃ Â¦Å“Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€ºÃ Â¦Â¾Ã Â§Å“Ã Â¦Â¾ Ã Â¦ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¤Ã Â§â€¹ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€œ Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡Ã Â¦â€œ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦Âª-Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¡ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â°Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "95",
    "date": "2026-07-30T15:00",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-sales-target-entry",
    "descriptionEn": "Refactored the Sales Target Entry page. List view now features columns: SL, edit pencil, Year, and Buyer Name. Added a backdrop-blurred wide modal for creating/editing targets with top controls: Year, Buyer, and GET MONTH button, along with a bottom-scrollable 12-month details grid showing: SL, Month, Quantity (Pcs), Amount (USD), Minute, Margin (USD), CM, RM, Avg SMV, Avg Eff, Mgt Notes, and a blue Team ACTION button.",
    "descriptionBn": "Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â²Ã Â¦Â¸ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€”Ã Â§â€¡Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡ SL, Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â², Ã Â¦Â¬Ã Â¦â€ºÃ Â¦Â° Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â°Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€ºÃ Â¦Â¾Ã Â§Å“Ã Â¦Â¾ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€”Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€œ Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦Âª-Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¡ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â¬Ã Â¦â€ºÃ Â¦Â°, Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š GET MONTH Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â¯Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â§Â§Ã Â§Â¨ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â° Ã Â¦â€ºÃ Â¦â€¢ Ã Â¦Å“Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦â€œ Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¸Ã Â¦Â®Ã Â§â€šÃ Â¦Â¹Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â§â€¹Ã Â¦Å¸ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€”Ã Â¦Â«Ã Â¦Â² Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â²-Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â®Ã Â§â€¡ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾ Ã Â¦Â°Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "94",
    "date": "2026-07-30T15:08",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-work-orders",
    "descriptionEn": "Added a new 'Workorder' accordion menu in the Merchandising Sidebar below Fabric Booking. Included submenus: Dyed Yarn WO, Trims WO, Wash WO, AOP WO, Print WO, Emb WO, and Sweater Service WO, pointing to /merchandising-work-orders with specific tab query parameters.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Fabric Booking Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å¡Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ 'Workorder' Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Â®Ã Â§â€šÃ Â¦Â¹ Ã Â¦Â¹Ã Â¦Å¡Ã Â§ï¿½Ã Â¦â€ºÃ Â§â€¡: Dyed Yarn WO, Trims WO, Wash WO, AOP WO, Print WO, Emb WO, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Sweater Service WO; Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€”Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â§ï¿½Ã Â§Å¸Ã Â§â€¡Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦Â¨Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ /merchandising-work-orders Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡ Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€”Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "93",
    "date": "2026-07-30T15:11",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-reports",
    "descriptionEn": "Added a new 'Reports' accordion menu in the Merchandising Sidebar containing 24 submenu entries (Sample Report, Capacity & Booking, Order Summary, Date Wise Shipment, Yarn Booking Status, Order Pre. Vs Post Costing, etc.) pointing to /merchandising-reports with tab query configurations.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¶Ã Â§â€¡Ã Â¦Â·Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ 'Reports' Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦â€¦Ã Â¦Â§Ã Â§â‚¬Ã Â¦Â¨Ã Â§â€¡ Ã Â§Â¨Ã Â§ÂªÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦Â°Ã Â¦Â¿Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½ (Ã Â¦Â¯Ã Â§â€¡Ã Â¦Â®Ã Â¦Â¨: Sample Report, Capacity & Booking, Order Summary, Date Wise Shipment, Yarn Booking Status, Order Pre. Vs Post Costing Ã Â¦â€¡Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¿) Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦â€¢Ã Â§ï¿½Ã Â§Å¸Ã Â§â€¡Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ /merchandising-reports Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡ Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€”Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "92",
    "date": "2026-07-30T15:12",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Renamed the 'Merchandising Settings' accordion label to 'MM Settings' in the sidebar layout.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸Ã Â§â€¡ 'Merchandising Settings' Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨ Ã Â¦Â²Ã Â§â€¡Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â® Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ 'MM Settings' Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "91",
    "date": "2026-07-30T15:15",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-reports",
    "descriptionEn": "Refactored the sidebar component in MerchandisingLayout.tsx to preserve and restore scroll position via sessionStorage. Updated accordion expanded states initialization to dynamically analyze the current URL pathname and search tab parameters, ensuring the active category and subitem are always expanded, selected, and scrolled into view.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â² Ã Â¦ÂªÃ Â¦Å“Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â§Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ sessionStorage Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â° Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â° Ã Â¦â€°Ã Â¦ÂªÃ Â¦Â° Ã Â¦Â­Ã Â¦Â¿Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¸Ã Â¦â€šÃ Â¦Â¶Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€”Ã Â¦Â°Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â§Å¸Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¡, Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â² Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¦Ã Â§Æ’Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "90",
    "date": "2026-07-30T15:17",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Moved the static menuCategories configuration array outside the MerchandisingLayout component scope to fix a ReferenceError during component state initialization.",
    "descriptionBn": "Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â§Å¸ Ã Â¦â€ Ã Â¦Â¸Ã Â¦Â¾ ReferenceError Ã Â¦Â¦Ã Â§â€šÃ Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ MerchandisingLayout Ã Â¦â€¢Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢ menuCategories Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦Â¨Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "89",
    "date": "2026-07-30T15:23",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Refactored the Company Wise MERC Setting master page under MM Settings. Rendered custom company ledger table (Act hamburger dropdown, SL, Company Name, Address, and status badges). Implemented action dropdown with items (Fabric Source, Print Type, Fabric Nature, UOM, Body Part, Map DOM Key) that trigger backdrop-blurred multi-select tag modal setup editors with suggestion listings and manual custom tagging.",
    "descriptionBn": "MM Settings Ã Â¦ï¿½Ã Â¦Â° Ã Â¦â€¦Ã Â¦Â§Ã Â§â‚¬Ã Â¦Â¨Ã Â§â€¡ 'Company Wise MERC Setting' Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ (Fabric Source, Print Type, Fabric Nature, UOM, Body Part, Map DOM Key) Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â­ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€” Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â° Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Å“Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€” Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¬Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€šÃ Â§Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â®Ã Â§â€¡ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€” Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾ Ã Â¦Â°Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "88",
    "date": "2026-07-30T15:47",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings?tab=costing-configuration-cpm",
    "descriptionEn": "Replaced the old simple 4-field Costing Configuration panel with a proper data table showing Setup Date, Year, Month, CM Expense, No of Resource, Working Hour, Working Day, CPM (auto-calculated), Applied CPM, Currency, and Status. Added Create and Update modals with full field validation.",
    "descriptionBn": "Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â§Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â£ Ã Â§Âª-Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â° Costing Configuration Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â²Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£Ã Â¦Â¾Ã Â¦â„¢Ã Â§ï¿½Ã Â¦â€” Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â¤Ã Â§â€¡ Setup Date, Year, Month, CM Expense, No of Resource, Working Hour, Working Day, CPM (Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¯Ã Â¦Â¼Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦â€”Ã Â¦Â£Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾), Applied CPM, Currency Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Status Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â¦Å¡Ã Â§ï¿½Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¸Ã Â¦Â¹ Create Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Update Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "87",
    "date": "2026-07-30T15:49",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings?tab=payment-terms",
    "descriptionEn": "Built a dedicated Payment Terms tab with a clean data table (Actions, SL, Name, IsActive) pre-loaded with 10 standard terms (120/180/30/60/90 Days BBLC, At Sight, Cash, FOD, Others, TT). Added Create and Update modals with Short Name and IsActive fields.",
    "descriptionBn": "Payment Terms Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£Ã Â¦Â¾Ã Â¦â„¢Ã Â§ï¿½Ã Â¦â€” Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² (Actions, SL, Name, IsActive) Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â§Â§Ã Â§Â¦Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â® (120/180/30/60/90 Days BBLC, At Sight, Cash, FOD, Others, TT) Ã Â¦â€ Ã Â¦â€”Ã Â§â€¡ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡Ã Â¦â€¡ Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦â€ Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Short Name Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š IsActive Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¸Ã Â¦Â¹ Create Ã Â¦â€œ Update Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "86",
    "date": "2026-07-30T16:11",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings?tab=buying-house",
    "descriptionEn": "Created a dedicated Buying House tab with a detailed data table (Actions, SL, Short Name, Full Name, Contact Person, Address, Phone, Email, Fax, IsActive) pre-populated with standard houses (ITPS, JMS Buyer, KLD, PFD). Added fully validated Create/Update modals.",
    "descriptionBn": "Buying House Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¸Ã Â¦Â¹ Create/Update Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡Ã Â¦â€¡ ITPS, JMS Buyer, KLD, PFD Ã Â¦â€¡Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¹Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦â€ Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "85",
    "date": "2026-07-30T16:15",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings?tab=buyer-wise-brand",
    "descriptionEn": "Implemented a dedicated Buyer Brand tab with a custom table (Actions, SL, Buyer Name, Brand, IsActive). Integrated dynamic Buyer selection dropdown populated from registered buyers list and added Create/Update modals.",
    "descriptionBn": "Buyer Brand Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â¦Â¿ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾ Ã Â¦Â°Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¤Ã Â¦Â¾ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€œ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "84",
    "date": "2026-07-30T16:20",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings?tab=buying-agent",
    "descriptionEn": "Added a dedicated Buying Agent tab with a detailed data table (Actions, SL, Short Name, Full Name, Address, Phone, Email, Fax, IsActive) preloaded with initial agent (JMS Buyer Agent) and added fully validated Create/Update modals.",
    "descriptionBn": "Buying Agent Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¸Ã Â¦Â¹ Create/Update Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡Ã Â¦â€¡ JMS Buyer Agent Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦â€ Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "83",
    "date": "2026-07-30T16:24",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings?tab=supplier",
    "descriptionEn": "Created a dedicated Supplier tab with a clean table (Actions, SL, Company Name, Name, Designation, Address, E-mail, Cell, IsActive) preloaded with 10 standard supplier entries, along with custom validated Create/Update modals.",
    "descriptionBn": "Supplier Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¸Ã Â¦Â¹ Create/Update Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡Ã Â¦â€¡ Ã Â§Â§Ã Â§Â¦Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦â€ Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "82",
    "date": "2026-07-30T16:29",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings?tab=buyer-name",
    "descriptionEn": "Replaced the simple buyer modal with a comprehensive, beautiful 14-accordion 'Buyer Profile' editor. Updated the buyer table to match screenshots with Excel/Print/Pdf options, country filters, and 15 default entries.",
    "descriptionBn": "Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â§Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â£ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â§Â§Ã Â§Âª-Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Å¡Ã Â¦Â®Ã Â§Å½Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â° 'Buyer Profile' Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â° Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â¾ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â²/Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸/Ã Â¦ÂªÃ Â¦Â¿Ã Â¦Â¡Ã Â¦Â¿Ã Â¦ï¿½Ã Â¦Â« Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨, Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â§Â§Ã Â§Â«Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "81",
    "date": "2026-07-30T17:07",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Extracted renderDynamicMasterDB logic into a standalone React component (DynamicMasterDBManager) to avoid conditional React hooks rendering and fix the Rules of Hooks violation.",
    "descriptionBn": "Rules of Hooks Ã Â¦Â²Ã Â¦â„¢Ã Â§ï¿½Ã Â¦ËœÃ Â¦Â¨ Ã Â¦ï¿½Ã Â§Å“Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¢Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¹Ã Â§ï¿½Ã Â¦â€¢ Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¤Ã Â§â€¡ renderDynamicMasterDB Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€šÃ Â¦Â¶Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¨ Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡ (DynamicMasterDBManager) Ã Â¦Â°Ã Â§â€šÃ Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "80",
    "date": "2026-07-30T17:55",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Fixed layout overlap bug by making the main switch fallback conditional. Now, custom tabs (buyer-name, fabric-construction, additional-cost-entry, rmg-process-loss) correctly hide the generic fallback table, preventing duplicate elements from showing.",
    "descriptionBn": "Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦â€œÃ Â¦Â­Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Âª Ã Â¦Â¬Ã Â¦Â¾Ã Â¦â€”Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¦Ã Â§â€šÃ Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¢Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â«Ã Â¦Â²Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â¸Ã Â¦Â®Ã Â§â€šÃ Â¦Â¹Ã Â§â€¡ (buyer-name, fabric-construction, additional-cost-entry, rmg-process-loss) Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â§Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â£ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦Â° Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¨Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¬Ã Â§Æ’Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¿ Ã Â¦Â¹Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¾Ã Â¥Â¤"
  },
  {
    "id": "79",
    "date": "2026-07-30T18:05",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented beautiful, fully-functional custom layouts and modals for 'Item Department', 'Garment Item Name (GMT Item Name)', and 'Body Part' tabs based on layout screenshots. Added Excel/Print/Pdf options, search filters, default entries, and select dropdowns.",
    "descriptionBn": "'Item Department', 'Garment Item Name (GMT Item Name)' Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'Body Part' Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Â¶Ã Â¦Å¸ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸Ã Â§â‚¬ Ã Â¦â€ Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â·Ã Â¦Â£Ã Â§â‚¬Ã Â§Å¸ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â²/Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸/Ã Â¦ÂªÃ Â¦Â¿Ã Â¦Â¡Ã Â¦Â¿Ã Â¦ï¿½Ã Â¦Â« Ã Â¦Â°Ã Â¦Â«Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿, Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°, Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¤Ã Â¦Â¥Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¸Ã Â¦Â®Ã Â§â€šÃ Â¦Â¹ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â­Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦Â°Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "78",
    "date": "2026-07-30T18:11",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Added beautiful, fully-functional custom styled registry tables, filters, and add/edit modals for both 'Season' and 'Sample Type' tabs, resolving a React state namespace collision with the pre-existing accordion seasons state.",
    "descriptionBn": "'Season' Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'Sample Type' Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â¦Ã Â§ï¿½Ã Â¦Â¬Ã Â§Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€ Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â·Ã Â¦Â£Ã Â§â‚¬Ã Â§Å¸ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦Â°Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â², Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡/Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â¬Ã Â¦Â¾Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦ï¿½Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬ 'seasons' Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â®Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¸ Ã Â¦Â¸Ã Â¦â€šÃ Â¦ËœÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â·Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "77",
    "date": "2026-07-30T18:18",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented custom styled registry tables, pagination indicators, action sheets, search functions, and input/select modals for both 'Size Group' (Group size) and 'UoM' (Unit of Measurement) settings tabs matching design specifications.",
    "descriptionBn": "'Size Group' (Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Âª Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“) Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'UoM' (Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¾Ã Â¦ÂªÃ Â¦â€¢ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦â€¢) Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Â¦Ã Â§ï¿½Ã Â¦Â¬Ã Â§Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸Ã Â§â‚¬ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦Â°Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â², Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Å¸, Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡/Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "76",
    "date": "2026-07-30T18:32",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented custom registry layouts, actions, live searches, export mock actions, and dialog modals for 'Fabric GSM', 'Fabric Nature' (Fabric Type), and 'Fabric Construction' tabs matching screen layouts.",
    "descriptionBn": "'Fabric GSM', 'Fabric Nature' (Fabric Type) Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'Fabric Construction' Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸Ã Â§â‚¬ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦Â°Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â², Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨, Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡/Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "75",
    "date": "2026-08-01T10:47",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Added a searchable 'Supplier Category' multi-select dropdown as the first field in the Add/Update Supplier modal (options: Yarn, Fabric, Trims, etc.), displayed selected categories as pill badges in the Supplier table, and made Designation, E-mail, and Cell fields optional (removed validation constraints).",
    "descriptionBn": "Ã Â¦Â¸Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¾Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡/Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¥Ã Â¦Â® Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¬Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â² Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿-Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ 'Supplier Category' Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¸Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¾Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€”Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦ÂªÃ Â¦Â¿Ã Â¦Â² Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å“ Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¬Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨, Ã Â¦â€¡Ã Â¦Â®Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â² Ã Â¦â€œ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â² Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Å¡Ã Â§ï¿½Ã Â¦â€ºÃ Â¦Â¿Ã Â¦â€¢ (optional) Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ (Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â®Ã Â§â€šÃ Â¦Â²Ã Â¦â€¢ Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¨Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡)Ã Â¥Â¤"
  },
  {
    "id": "74",
    "date": "2026-08-01T10:51",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Upgraded the UOM (Measurement Head) modal and registry table matching specifications, including advanced properties: Unit Name, Short Name, Unit Group, Sort Order, Relative Factor, and a checkbox for Is Base Unit status.",
    "descriptionBn": "UOM (Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¾Ã Â¦ÂªÃ Â¦â€¢ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦â€¢) Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â°Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â¬Ã Â§Ë†Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¸Ã Â¦Â®Ã Â§â€šÃ Â¦Â¹ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Unit Name, Short Name, Unit Group, Sort Order, Relative Factor Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Is Base Unit Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Å¡Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¬Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¥Â¤"
  },
  {
    "id": "73",
    "date": "2026-08-01T10:54",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Added generic Manage Rates ($) buttons and details modals for Dyeing and Finishing tabs under RMG Master Settings, supporting dynamic date validation and export actions matching design layouts.",
    "descriptionBn": "RMG Master Settings-Ã Â¦ï¿½Ã Â¦Â° Ã Â¦â€¦Ã Â¦Â§Ã Â§â‚¬Ã Â¦Â¨Ã Â§â€¡ Dyeing Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Finishing Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Å“Ã Â§â€¡Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ Manage Rates ($) Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸Ã Â§â‚¬ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "72",
    "date": "2026-08-01T14:35",
    "type": "New Addition",
    "module": "Global System",
    "link": "/module-selection",
    "descriptionEn": "Added a compact, Google-style corporate modules launcher (3x3 grid / waffle button) to both the global dashboard Topbar and the Merchandising layout header, enabling instant, dynamic switching between HRIS, Merchandising, and all other modules from anywhere in the application.",
    "descriptionBn": "Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¶Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Å¸Ã Â¦ÂªÃ Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦Â¹Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€°Ã Â¦Â­Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦â€”Ã Â§ï¿½Ã Â¦â€”Ã Â¦Â²-Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â² Ã Â¦Â²Ã Â¦Å¾Ã Â§ï¿½Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â° (Ã Â§Â©xÃ Â§Â© Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¡ / Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â«Ã Â§â€¡Ã Â¦Â² Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨) Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿ HRIS, Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¡Ã Â¦Å¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â¯Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "71",
    "date": "2026-08-01T15:00",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented Yarn Brand, Yarn Type, Yarn Count, and Yarn PO Type custom settings pages with specifications matching the screenshots, custom add/edit modals, export actions, live search, and an olive green floating plus action button.",
    "descriptionBn": "Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Â¶Ã Â¦Å¸ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸Ã Â§â‚¬ Yarn Brand, Yarn Type, Yarn Count Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Yarn PO Type-Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¦Â¸Ã Â¦Â®Ã Â§â€šÃ Â¦Â¹ Ã Â¦â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡/Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â², Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â­ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡, Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦Å“Ã Â¦Â²Ã Â¦ÂªÃ Â¦Â¾Ã Â¦â€¡ Ã Â¦Â¸Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Å“ Ã Â¦Â°Ã Â¦â„¢Ã Â§â€¡Ã Â¦Â° Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "70",
    "date": "2026-08-01T15:10",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented Yarn PO Settings custom configuration page, with custom dropdown fields for Company Name and Action parameter (Ceiling/Floor/Round/None), Nearest Value and CompareValue Value input controls, custom add/edit modals, and Excel/Print/PDF export functionalities.",
    "descriptionBn": "Yarn PO Settings-Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Company Name Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Action Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° (Ceiling/Floor/Round/None)-Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡, Nearest Value Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š CompareValue Value-Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â², Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "69",
    "date": "2026-08-01T15:15",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Removed the top 'RMG Master Database & Parameters' header banner block from the Merchandising Master Settings workspace to streamline the interface.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸ Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¶Ã Â§â‚¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â·Ã Â¦Â¦Ã Â§â€¡Ã Â¦Â¶ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ 'RMG Master Database & Parameters' Ã Â¦Â¹Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â°Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¸Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Å¡Ã Â§ï¿½Ã Â¦â€ºÃ Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â° Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â§Å¸Ã Â¥Â¤"
  },
  {
    "id": "68",
    "date": "2026-08-01T15:20",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented Garment & Fabric Color and Print/Color Type custom settings pages with datasets matching reference screenshots, custom add/edit dialog modals, and integrated their modals with the floating action plus button.",
    "descriptionBn": "Garment & Fabric Color Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Print/Color Type-Ã Â¦ï¿½Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¦Â¸Ã Â¦Â®Ã Â§â€šÃ Â¦Â¹ Ã Â¦â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡/Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â², Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "67",
    "date": "2026-08-01T15:25",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented Print/Embroidery/Wash Type (Special Cost) configuration page, featuring main parameters, sub-modals, a floating plus action button, and a nested 'Rat Chart Information' interactive modal.",
    "descriptionBn": "Print/Embroidery/Wash Type-Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â® Ã Â¦â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡/Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â­ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "66",
    "date": "2026-08-01T15:30",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented AOP Process configuration page featuring initial dataset matching reference screenshots ('Discharge Print', 'Pigment Print'), custom Add New/Update AopProcess modal dialogs, and integrated floating action plus button.",
    "descriptionBn": "AOP Process-Ã Â¦ï¿½Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦Â°Ã Â§â€¡Ã Â¦Â«Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Â¶Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â£Ã Â§â€¡ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸, 'Add New AopProcess' Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "65",
    "date": "2026-08-02T16:25",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Completely redesigned the Quotation detail view into a side-by-side high-fidelity Buyer Costing Sheet: built a 2-column header with buyer details/dress sketch mockups, side-by-side grids containing the garment cost breakdown (with dynamic yarn, accessories, embellishments, wash, other costs lists) and fabric price calculation, profit gap metrics banner, and signature approvals section.",
    "descriptionBn": "Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â² Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€°Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â§â‚¬ Ã Â§Â¨-Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â­Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â§â€¡ Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨Ã Â§â‚¬Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â® Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶Ã Â§â€¡ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¤Ã Â¦Â¥Ã Â§ï¿½Ã Â¦Â¯, Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€œ Ã Â¦ï¿½Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§â€¡Ã Â¦Å¡ Ã Â¦â€¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Å“ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â° Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â¶Ã Â¦Â¾Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â° Ã Â¦â€“Ã Â¦Â°Ã Â¦Å¡ (Ã Â¦â€¡Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨, Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â¦Å“, Ã Â¦ï¿½Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾Ã Â¦Â¶ Ã Â¦â€œ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€“Ã Â¦Â°Ã Â¦Å¡ Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â¾) Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¡Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¦Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â° Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â², Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â«Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Âª Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€œ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å¡Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â·Ã Â¦Â°Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§â‚¬Ã Â¦Â¦Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â¾ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â°Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â«Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦Â¤Ã Â§â€¹Ã Â¦Â²Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "64",
    "date": "2026-08-02T16:30",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Configured the style image slot in the Quotation detail/print view to default load the premium dress sketch illustration image and enabled dynamic file upload replacements.",
    "descriptionBn": "Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²/Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦â€¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Å“ Ã Â¦Â¬Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§â€¡Ã Â¦Å¡ Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Å“Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾ Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦Â«Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â²Ã Â§ï¿½ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "63",
    "date": "2026-08-01T15:35",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented Additional Cost Entry custom configuration page featuring pre-populated financial/commission/commercial datasets, custom edit modal dialog, and floating action button.",
    "descriptionBn": "Additional Cost Entry Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â², Ã Â¦â€¢Ã Â¦Â®Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦â€¢Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸, Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "62",
    "date": "2026-08-01T15:38",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented RMG Process Loss custom configuration page with comprehensive parameters (Garment types dropdown, Order qty ranges, Cutting/Print/EMB/Sewing/Wash/Finishing percentages), custom Add New/Update modal dialog, and light blue table styling matching reference screenshots.",
    "descriptionBn": "RMG Process Loss Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦Â¸Ã Â¦â€¢Ã Â¦Â² Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡/Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â°Ã Â§â€¡Ã Â¦Â«Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸Ã Â§â‚¬ Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å¸ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â²Ã Â§ï¿½ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¸Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "61",
    "date": "2026-08-01T15:42",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented Quality Label custom configuration page with pre-populated 'AQL Standard' entry, custom create/edit modal labeled 'Create New Country' matching reference design, and floating action button integration.",
    "descriptionBn": "Quality Label Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦Â°Ã Â§â€¡Ã Â¦Â«Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸Ã Â§â‚¬ Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸/Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦â€œ Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "60",
    "date": "2026-08-01T15:46",
    "type": "Modify",
    "module": "Monthly Capacity Planning",
    "link": "/merchandising-monthly-capacity",
    "descriptionEn": "Updated the Setup New Monthly Capacity modal dialog layout to match reference screenshot design exactly, including a left blue accent border card, horizontal grid alignment across three rows, real-time formula calculations for operators and minutes, and underline styled input fields.",
    "descriptionBn": "Setup New Monthly Capacity Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦â€œ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦Â°Ã Â§â€¡Ã Â¦Â«Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Â¶Ã Â¦Å¸ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸Ã Â§â‚¬ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â²-Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â® Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¾ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "59",
    "date": "2026-08-01T15:52",
    "type": "Modify",
    "module": "Company Setup",
    "link": "/company-setup",
    "descriptionEn": "Added a new 'Default Holiday Setup' tab inside Company Setup, including initial Friday/Saturday weekend history data, list ledger with calendar badges, search filtering, and CRUD operations modal featuring datepicker and MultiSelect days.",
    "descriptionBn": "Company Setup Ã Â¦ï¿½ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ 'Default Holiday Setup' Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦â€¡Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â¾, Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å“Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡/Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "58",
    "date": "2026-08-01T15:56",
    "type": "Modify",
    "module": "Company Setup",
    "link": "/company-setup",
    "descriptionEn": "Removed edit and delete actions from the Default Holiday Setup list to treat it strictly as a historical track of weekend configurations, and added status indicators (Active, Upcoming, Archived) for all setup records.",
    "descriptionBn": "Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¹Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦â€ Ã Â¦Âª Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€œ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â²Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¦ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â¹Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€ºÃ Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â¸ (Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢) Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¬Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Å“ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â°Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â° (Active, Upcoming, Archived) Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "57",
    "date": "2026-08-01T16:08",
    "type": "Modify",
    "module": "Employee Roster",
    "link": "/create-roster",
    "descriptionEn": "Updated the DEFAULT HOLIDAY generator in the employee roster matrix to dynamically query and apply the weekly holidays configured in the Default Holiday Setup track based on the target month and year.",
    "descriptionBn": "Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦Â°Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â° DEFAULT HOLIDAY Ã Â¦Å“Ã Â§â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â° Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€”Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦â€œ Ã Â¦Â¬Ã Â¦â€ºÃ Â¦Â° Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸Ã Â§â‚¬ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¹Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦â€ Ã Â¦Âª Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â¹Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€ºÃ Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿ Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§Å¸Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "56",
    "date": "2026-08-01T16:13",
    "type": "Modify",
    "module": "Employee Roster",
    "link": "/create-roster",
    "descriptionEn": "Redesigned the Employee Roster page to automatically pre-populate the roster matrix with active default weekly holidays upon loading or switching months/years, and removed the redundant ROSTER HOLIDAY and DEFAULT HOLIDAY action buttons.",
    "descriptionBn": "Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿ Ã Â¦Â°Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦Â¹Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¬Ã Â¦Â¾ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¸/Ã Â¦Â¬Ã Â¦â€ºÃ Â¦Â° Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â§Å¸ Ã Â¦Â°Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â§Å¸Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¸Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â¹Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€ºÃ Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â° Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â¨Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¦Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡ Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â¦Â£ Ã Â¦Â¹Ã Â§Å¸, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§Å¸Ã Â§â€¹Ã Â¦Å“Ã Â¦Â¨Ã Â§â‚¬Ã Â§Å¸ ROSTER HOLIDAY Ã Â¦â€œ DEFAULT HOLIDAY Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦Â¦Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¦ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "55",
    "date": "2026-08-01T16:48",
    "type": "New Addition",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Created a brand-new dedicated Prepare Pre-Cost page containing an initial pre-cost list view and a detailed, tab-free workspace featuring complete Order Basic Information, RMG Operation Process Loss %, dynamic style details entry with size breakdown tables, and checkable Additional Costing formulas matching the design system.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â²Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ 'Prepare Pre-Cost' Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â¾ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š '+ Prepare Pre-Cost' Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨Ã Â§â€¡ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â²Ã Â§â€¡ Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â°Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨, Ã Â¦â€ Ã Â¦Â°Ã Â¦ï¿½Ã Â¦Â®Ã Â¦Å“Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸ Ã Â¦Â²Ã Â¦Â¸ %, Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¾ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Å¡Ã Â¦Â®Ã Â§Å½Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¸ Ã Â¦â€œÃ Â¦ÂªÃ Â§â€¡Ã Â¦Â¨ Ã Â¦Â¹Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "54",
    "date": "2026-08-01T17:04",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Polished the Pre-Cost form interface: removed the duplicate top-bar Cancel/Save buttons, replaced with a clean query number + style count indicator. Upgraded the bottom summary bar to show 3 live KPI metrics (Avg Quoted FOB, Total Qty, Styles count) and an optional Commission Total card. Actions are now a single Discard + Save Sheet pair, cleaner and more professional.",
    "descriptionBn": "Pre-Cost Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¸ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¶ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦Â¡Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Å¸Ã Â¦Âª-Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Cancel/Save Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â° Ã Â¦â€œ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â° Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â«Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â­ Ã Â¦â€¢Ã Â§â€¡Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€ Ã Â¦â€¡ Ã Â¦Â®Ã Â§â€¡Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ (Ã Â¦â€”Ã Â¦Â¡Ã Â¦Â¼ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦Â«Ã Â¦â€œÃ Â¦Â¬Ã Â¦Â¿, Ã Â¦Â®Ã Â§â€¹Ã Â¦Å¸ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â£, Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦Â¸Ã Â¦â€šÃ Â¦â€“Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾) Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Å¡Ã Â§ï¿½Ã Â¦â€ºÃ Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â®Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Å¸Ã Â§â€¹Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â¦Å¡Ã Â§ï¿½Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦â€“Ã Â¦Â¨ Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â§Ã Â§ï¿½ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Discard + Save Sheet Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°, Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦â€ Ã Â¦â€”Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€¦Ã Â¦Â¨Ã Â§â€¡Ã Â¦â€¢ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â²Ã Â¥Â¤"
  },
  {
    "id": "53",
    "date": "2026-08-02T10:55",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-inquiry",
    "descriptionEn": "Upgraded the Buyer Inquiry page: refactored the old modal-based workflow to a premium split-view list register and dedicated Prepare Inquiry workspace. Added division-specific configuration grids for Knit/Woven/Sweater specs (e.g. GSM, weave construction, machine gauge), process toggles, sketch image upload slot, and a real-time live pre-costing FOB/CMT calculator engine.",
    "descriptionBn": "Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Å¸-Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¸ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å¸/Ã Â¦â€œÃ Â¦Â­Ã Â§â€¡Ã Â¦Â¨/Ã Â¦Â¸Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¡ (Ã Â¦Â¯Ã Â§â€¡Ã Â¦Â®Ã Â¦Â¨ Ã Â¦Å“Ã Â¦Â¿Ã Â¦ï¿½Ã Â¦Â¸Ã Â¦ï¿½Ã Â¦Â®, Ã Â¦â€°Ã Â¦â€¡Ã Â¦Â­ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨, Ã Â¦â€”Ã Â§â€¡Ã Â¦Å“), Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸ Ã Â¦Å¸Ã Â¦â€”Ã Â¦Â²Ã Â¦Â¸, Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§â€¡Ã Â¦Å¡ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â²Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â²-Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â® Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿-Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â«Ã Â¦â€œÃ Â¦Â¬Ã Â¦Â¿ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â° Ã Â¦â€¡Ã Â¦Å¾Ã Â§ï¿½Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¨ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â­Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "52",
    "date": "2026-08-02T10:58",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-inquiry",
    "descriptionEn": "Simplified the Buyer Inquiry creation and editing form by removing unnecessary PO-specific inputs (AQL Standard, Agent, Brand, Currency, Exchange Rate, and Shipping Mode). Retained only the core specifications required during initial buyer quotation to keep the workflow clean and focused.",
    "descriptionBn": "Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¦Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦â€¦Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¹Ã Â¦Å“Ã Â¦Â¨Ã Â§â‚¬Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€œ-Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¯Ã Â§â€¡Ã Â¦Â®Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Â¿Ã Â¦â€°Ã Â¦ï¿½Ã Â¦Â² Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡, Ã Â¦ï¿½Ã Â¦Å“Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡, Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Â¿, Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Å¡Ã Â§â€¡Ã Â¦Å¾Ã Â§ï¿½Ã Â¦Å“ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¶Ã Â¦Â¿Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€š Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦Â¦Ã Â¦Â¿Ã Â§Å¸Ã Â§â€¡Ã Â¥Â¤ Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¥Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¹Ã Â¦Å“Ã Â¦Â¨Ã Â§â‚¬Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦Â®Ã Â§â€šÃ Â¦Â² Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "51",
    "date": "2026-08-02T11:02",
    "type": "New Addition",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Created the new Buyer Price Quotation page, completing the standard RMG workflow sequence: Inquiry -> Quotation -> Order Entry. It features a list register of quotations, a pipeline status board, a detailed cost calculation workspace (linking active inquiries to auto-populate specifications), and a print-ready official quote sheet preview layout.",
    "descriptionBn": "Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¸ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦â€ Ã Â¦Â°Ã Â¦ï¿½Ã Â¦Â®Ã Â¦Å“Ã Â¦Â¿ Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡: Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ -> Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ -> Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°, Ã Â¦ÂªÃ Â¦Â¾Ã Â¦â€¡Ã Â¦ÂªÃ Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡, Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¸ (Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€šÃ Â¦â€¢ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡), Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸-Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¿ Ã Â¦â€¦Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â² Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "50",
    "date": "2026-08-02T11:05",
    "type": "New Addition",
    "module": "Merchandising",
    "link": "/merchandising-po",
    "descriptionEn": "Created the new Purchase Order (PO) Register page, successfully establishing the full RMG sequence: Inquiry -> Quotation -> PO -> Order Entry. It features a list register of official buyer contracts, KPI summaries, and a workspace that links to approved quotations (auto-populating product specs and FOB price offers) and allows proceeding directly to the Order Entry details hub.",
    "descriptionBn": "Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â¦Å¡Ã Â§â€¡Ã Â¦Å“ Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° (Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€œ) Ã Â¦Â°Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦â€ Ã Â¦Â°Ã Â¦ï¿½Ã Â¦Â®Ã Â¦Å“Ã Â¦Â¿ Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¹Ã Â§Å¸Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡: Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ -> Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ -> Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€œ -> Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°, Ã Â¦â€¢Ã Â§â€¡Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€ Ã Â¦â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¸ Ã Â¦Â°Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¦Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€šÃ Â¦â€¢ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¤Ã Â¦Â¥Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¦Ã Â¦Å¸Ã Â§â€¹-Ã Â¦ÂªÃ Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€šÃ Â¦â€¢ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¦Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "49",
    "date": "2026-08-02T11:08",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Fixed a ReferenceError where 'showCostingModal' was not defined inside the Quotation page component. Declared the missing state hooks for showCostingModal and costingItem to resolve the rendering crash.",
    "descriptionBn": "Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦â€°Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¤Ã Â¦Â°Ã Â§â€¡ 'showCostingModal' Ã Â¦Â¸Ã Â¦â€šÃ Â¦Å“Ã Â§ï¿½Ã Â¦Å¾Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Â¨Ã Â¦Â¾ Ã Â¦Â¥Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â£Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â¸Ã Â¦Â¾ Ã Â¦Â°Ã Â§â€¡Ã Â¦Â«Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦ï¿½Ã Â¦Â°Ã Â¦Â°Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦â€šÃ Â¦Â¶Ã Â§â€¹Ã Â¦Â§Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€š Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¶ Ã Â¦ï¿½Ã Â§Å“Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ showCostingModal Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š costingItem-Ã Â¦ï¿½Ã Â¦Â° Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¹Ã Â§ï¿½Ã Â¦â€¢Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "48",
    "date": "2026-08-02T11:12",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-inquiry",
    "descriptionEn": "Standardized the UI/UX design of the Buyer Inquiry, Price Quotation, and Purchase Order pages to match the premium Order Entry page. Applied unified input component states, teal focus-rings, action button gradients, sidebar links, and structured section layout headers.",
    "descriptionBn": "Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿, Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¸ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â¦Å¡Ã Â§â€¡Ã Â¦Å“ Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â® Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â®Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â°Ã Â§â€¡Ã Â¦â€“Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦â€¦Ã Â¦Â­Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â«Ã Â§â€¹Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸-Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€š, Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦Â¹Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "47",
    "date": "2026-08-02T11:15",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Standardized the UI/UX design of the Prepare Pre-Costing page to match the premium Order Entry page styling. Integrated unified input states, teal highlights, action button gradients, sidebar links, and structured section layout headers, and added the linkable inquiry dropdown.",
    "descriptionBn": "Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿-Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â® Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â®Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â°Ã Â§â€¡Ã Â¦â€“Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦â€¦Ã Â¦Â­Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â«Ã Â§â€¹Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸-Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€š, Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â° Ã Â¦Å¸Ã Â¦â€”Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "46",
    "date": "2026-08-02T11:20",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-order-profile",
    "descriptionEn": "Completed the sequential integration of the RMG Merchandising lifecycle (Inquiry -> Pre-Costing -> Quotation -> PO -> Order Entry). Updated the Quotation page to pull costing parameters directly from Pre-costing sheets, and updated the Order Entry page to include a PO linkage dropdown, auto-populating final buyer, style reference, ship date, unit FOB, and sizing grids from the PO registry.",
    "descriptionBn": "Ã Â¦â€ Ã Â¦Â°Ã Â¦ï¿½Ã Â¦Â®Ã Â¦Å“Ã Â¦Â¿ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â«Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â² (Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ -> Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿-Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š -> Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ -> Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€œ -> Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿) Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿-Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â§Ã Â¦Â¾ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€œ Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€šÃ Â¦â€¢Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€œ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¯Ã Â¦Â¼Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°, Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦Â°Ã Â§â€¡Ã Â¦Â«Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸, Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Âª Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸, Ã Â¦ï¿½Ã Â¦Â«Ã Â¦â€œÃ Â¦Â¬Ã Â¦Â¿ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¡ Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "45",
    "date": "2026-08-02T11:25",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-inquiry",
    "descriptionEn": "Reordered and serialized the Merchandising module sidebar menu inside MerchandisingLayout.tsx to match the logical RMG lifecycle: Inquiry -> Pre Costing -> Quotation -> PO Management -> Order Management.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â² Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ MerchandisingLayout.tsx-Ã Â¦ï¿½ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Â¯Ã Â§Å’Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€ Ã Â¦Â°Ã Â¦ï¿½Ã Â¦Â®Ã Â¦Å“Ã Â¦Â¿ Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â«Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¥Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â®Ã Â¦Å¾Ã Â§ï¿½Ã Â¦Å“Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£: Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿ -> Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š -> Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ -> Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€œ Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Å“Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ -> Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Å“Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¥Â¤"
  },
  {
    "id": "44",
    "date": "2026-08-02T11:30",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-order-profile",
    "descriptionEn": "Refactored the entire merchandising flow to support professional RMG parameters: added sample checklists to Inquiry, itemized trims spreadsheets to Pre-Costing, commercial terms to Quotation, and L/C Details plus Nominated Supplier assignments to PO Management and Order Entry.",
    "descriptionBn": "Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹-Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¶Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€ Ã Â¦Â°Ã Â¦ï¿½Ã Â¦Â®Ã Â¦Å“Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â² Ã Â¦Å¡Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿-Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦â€ Ã Â¦â€¡Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â®Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“Ã Â¦Â¡ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Å¸, Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â² Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€œ Ã Â¦â€œ Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â²/Ã Â¦Â¸Ã Â¦Â¿ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â¦Â£Ã Â§â‚¬ Ã Â¦â€œ Ã Â¦Â¨Ã Â¦Â®Ã Â¦Â¿Ã Â¦Â¨Ã Â§â€¡Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "43",
    "date": "2026-08-02T11:55",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Cloned the Pakiza Knit Composite Ltd high-fidelity costing/quotation sheet, integrating garment cost breakdowns (main fabric, trims, emb, washing, overheads), fabric price formulas (yarn cost blend ratios, knitting, process loss), machine productivity income calculations, and official signature rows.",
    "descriptionBn": "Ã Â¦ÂªÃ Â¦Â¾Ã Â¦â€¢Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¹Ã Â¦Å“Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¹Ã Â¦Â¾Ã Â¦â€¡-Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â²Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š/Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦Â°Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¸ Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ (Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨ Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢, Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¸, Ã Â¦ï¿½Ã Â¦Â®Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿, Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â¶Ã Â¦Â¿Ã Â¦â€š, Ã Â¦â€œÃ Â¦Â­Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¹Ã Â§â€¡Ã Â¦Â¡), Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¸ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¾ (Ã Â¦â€¡Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¿Ã Â¦â€œ, Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š, Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸ Ã Â¦Â²Ã Â¦Â¸), Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â¨ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â­Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¨Ã Â§â€¡Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â°Ã Â§â€¹Ã Â¥Â¤"
  },
  {
    "id": "42",
    "date": "2026-08-02T12:00",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Implemented automatic costing formulas in the Quotation page: CAD consumption plus wastage auto-computes fabric consumption, Fabric Price/KG dynamically maps into main fabric rate, dozen costs sum automatically, and markups yield the live FOB price with target gap validation.",
    "descriptionBn": "Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¯Ã Â¦Â¼Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¾ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Å“ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬, Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¸/Ã Â¦â€¢Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¯Ã Â¦Â¼Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â®Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸Ã Â§â€¡ Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€š, Ã Â¦Â¡Ã Â¦Å“Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦â€ Ã Â¦Âª Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â­ Ã Â¦ï¿½Ã Â¦Â«Ã Â¦â€œÃ Â¦Â¬Ã Â¦Â¿ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€œ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€”Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Âª Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "41",
    "date": "2026-08-02T12:05",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Completely rebuilt the Quotation/Buyer Costing page as a true spreadsheet-style layout matching the Pakiza Knit ERP: dynamic + add row and Ãƒâ€” delete row buttons for every section (Fabric, Accessories, Embellishment, Washing, Other Costs, Yarn, Knitting, Dyeing), split left/right table panels, inline editable cells, and auto-calculated fabric consumption and FOB pricing.",
    "descriptionBn": "Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨/Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦â€¢Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¡Ã Â¦â€ Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¿Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¤Ã Â§â€¹ Ã Â¦Â¸Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¨Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â£ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨Ã Â§â€¡ (Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢, Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â¦Å“, Ã Â¦ï¿½Ã Â¦Â®Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿, Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â¶Ã Â¦Â¿Ã Â¦â€š, Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€“Ã Â¦Â°Ã Â¦Å¡, Ã Â¦â€¡Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨, Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š, Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿Ã Â¦â€š) Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ + Ã Â¦Â°Ã Â§â€¹ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ãƒâ€” Ã Â¦Â°Ã Â§â€¹ Ã Â¦Â®Ã Â§ï¿½Ã Â¦â€ºÃ Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â®-Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â­Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â², Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¯Ã Â¦Â¼Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦ï¿½Ã Â¦Â«Ã Â¦â€œÃ Â¦Â¬Ã Â¦Â¿ Ã Â¦Â®Ã Â§â€šÃ Â¦Â²Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "40",
    "date": "2026-08-02T12:10",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Full design overhaul of the Buyer Costing Sheet: replaced harsh purple/blue table headers with clean white card sections and a consistent indigo accent palette, added a sticky live FOB pricing panel on the right, grouped related sections side-by-side, made delete buttons hover-to-reveal, and highlighted auto-calculated fields in teal for clarity.",
    "descriptionBn": "Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦â€¢Ã Â¦Â¡Ã Â¦Â¼Ã Â¦Â¾ Ã Â¦Â¬Ã Â§â€¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¿/Ã Â¦Â¨Ã Â§â‚¬Ã Â¦Â² Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¹Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€”Ã Â§â€¹ Ã Â¦Â°Ã Â¦â„¢Ã Â§â€¡Ã Â¦Â° Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â¿ Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â­ Ã Â¦ï¿½Ã Â¦Â«Ã Â¦â€œÃ Â¦Â¬Ã Â¦Â¿ Ã Â¦Â®Ã Â§â€šÃ Â¦Â²Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â²Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â¹Ã Â§â€¹Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¯Ã Â¦Â¼Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â°Ã Â¦â„¢Ã Â§â€¡ Ã Â¦Â¹Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "39",
    "date": "2026-08-02T12:16",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Added major UX improvements to the Buyer Costing Sheet: collapsible sections with chevrons, section total chips showing $/dozen in headers, dashed full-width Add Row buttons, teal-styled auto-calculated fields, context-sensitive FOB card (green when target met), inline tooltip hints on complex fields, and main fabric row highlighted differently from editable rows.",
    "descriptionBn": "Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¬Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦â€¡Ã Â¦â€°Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â° Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¤Ã Â¦Â¿ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â­Ã Â¦Â°Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â­Ã Â¦Â¾Ã Â¦ï¿½Ã Â¦Å“ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â§Ã Â¦Â¾, Ã Â¦Â¹Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡ $/Ã Â¦Â¡Ã Â¦Å“Ã Â¦Â¨ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Å¸Ã Â§â€¹Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â² Ã Â¦Å¡Ã Â¦Â¿Ã Â¦Âª, Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¶Ã Â¦Â¡ Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¹ Add Row Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â®, Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â°Ã Â¦â„¢Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¯Ã Â¦Â¼Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡, Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€”Ã Â§â€¡Ã Â¦Å¸ Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â¦Â£ Ã Â¦Â¹Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Å“ FOB Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡, Ã Â¦Å“Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â§â€¡ Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â²Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Âª Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â®Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â°Ã Â§â€¹ Ã Â¦â€ Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â¬Ã Â§â€¡ Ã Â¦Â¹Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "38",
    "date": "2026-08-02T12:31",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Completely rebuilt the Pre-Costing page with three views: (1) List view with date/buyer/status filters, Excel/Print/PDF export buttons, and color-coded status badges; (2) Entry form with collapsible sections for Order Info, Process Loss, Style FOB details, Fabric (B.1), Accessories (B.5), CM Cost (D), Special Cost (G), Others (H), and a live budget summary card; (3) Full detail/print view matching the Pakiza Knit ERP format with budget summary A-K, all costing sections, and 5-person approval signature block.",
    "descriptionBn": "Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿-Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¨Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â£ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: (Ã Â§Â§) Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€“/Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¤Ã Â¦Â¾/Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°, Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â²/Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸/Ã Â¦ÂªÃ Â¦Â¿Ã Â¦Â¡Ã Â¦Â¿Ã Â¦ï¿½Ã Â¦Â« Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â® Ã Â¦â€œ Ã Â¦Â°Ã Â¦â„¢Ã Â¦Â¿Ã Â¦Â¨ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å“ Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â¦Â¾ Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€°; (Ã Â§Â¨) Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¤Ã Â¦Â¥Ã Â§ï¿½Ã Â¦Â¯, Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸ Ã Â¦Â²Ã Â¦Â¸, Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² FOB, Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ (B.1), Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â¦Å“ (B.5), Ã Â¦Â¸Ã Â¦Â¿Ã Â¦ï¿½Ã Â¦Â® Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ (D), Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¶Ã Â§â€¡Ã Â¦Â· Ã Â¦â€“Ã Â¦Â°Ã Â¦Å¡ (G), Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ (H) Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â­ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å“Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¸Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â·Ã Â§â€¡Ã Â¦Âª Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®; (Ã Â§Â©) Ã Â¦ÂªÃ Â¦Â¾Ã Â¦â€¢Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¡Ã Â¦â€ Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¿Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¤Ã Â§â€¹ Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤/Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€°, Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å“Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¸Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â·Ã Â§â€¡Ã Â¦Âª A-K Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â§Â« Ã Â¦Å“Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¦Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦â€¡ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â²Ã Â¦â€¢ Ã Â¦Â¸Ã Â¦Â¹Ã Â¥Â¤"
  },
  {
    "id": "37",
    "date": "2026-08-02T13:28",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Rebuilt the Pre-Costing detail/print view to match the Pakiza Knit ERP format: company header with logo, 6-column style info grid, Key Information + Style Image + Budget Summary in a 3-panel side-by-side layout, B.4 Fabric Conversion Cost grouped by Knitting/Dyeing sub-sections with sub-totals, B.2 Yarn and B.3 Dyed Yarn tables, G Special Cost + H Others Cost + I Sample Cost displayed side by side, and a 5-person approval block with Approved/Pending status per approver.",
    "descriptionBn": "Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿-Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²/Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦ÂªÃ Â¦Â¾Ã Â¦â€¢Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦â€¡Ã Â¦â€ Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¿Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¤Ã Â§â€¹ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¨Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â£ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦Â²Ã Â§â€¹Ã Â¦â€”Ã Â§â€¹ Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿ Ã Â¦Â¹Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°, Ã Â§Â¬-Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦Â¤Ã Â¦Â¥Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¡, Ã Â§Â©-Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â² Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶Ã Â¦Â¿ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸Ã Â§â€¡ Ã Â¦â€¢Ã Â§â‚¬ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â«Ã Â§â€¹ + Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦â€¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Å“ + Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å“Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¸Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â·Ã Â§â€¡Ã Â¦Âª, Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š/Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬-Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¹ B.4 Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸, B.2 Ã Â¦â€¡Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€œ B.3 Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¡ Ã Â¦â€¡Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â², Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶Ã Â¦Â¾Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¶Ã Â¦Â¿ G Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¶Ã Â§â€¡Ã Â¦Â· Ã Â¦â€“Ã Â¦Â°Ã Â¦Å¡ + H Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€“Ã Â¦Â°Ã Â¦Å¡ + I Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â² Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¦Ã Â¦Â¨Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§â‚¬Ã Â¦Â° Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â­Ã Â¦Â¡/Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦Â¸Ã Â¦Â¹ Ã Â§Â« Ã Â¦Å“Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦â€¡ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â²Ã Â¦â€¢Ã Â¥Â¤"
  },
  {
    "id": "36",
    "date": "2026-08-02T15:00",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Polished the Pre-Costing Detail/Print view: added matching letterhead design elements, cleaner 6-column Style Info borders and spacing, highly-aligned 3-column mid-section (Key Info, Style image, Budget table), and custom tables formatting (perfect grid alignments, dollar symbol formatting, monospace fonts for values, and refined border-slate configurations). Added status-colored signature lines with clean spacing.",
    "descriptionBn": "Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿-Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²/Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¡Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â²Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¹Ã Â§â€¡Ã Â¦Â¡ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€°Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾Ã Â¦Â¨, Ã Â§Â¬-Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦Â¤Ã Â¦Â¥Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€œ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€š, Ã Â§Â©-Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â®Ã Â¦Â¾Ã Â¦ï¿½Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€“Ã Â§ï¿½Ã Â¦ï¿½Ã Â¦Â¤ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€“Ã Â§ï¿½Ã Â¦ï¿½Ã Â¦Â¤ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¡ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦Â¡Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â² Ã Â¦Â«Ã Â¦Â°Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š, Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â®Ã Â¦Â¨Ã Â§â€¹Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¸ Ã Â¦Â«Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â® Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â«Ã Â¦Â°Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "35",
    "date": "2026-08-02T15:03",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Resolved Pre-Costing page rendering issues: imported React to fix ReferenceError, added stable unique keys to fallback empty table rows in Yarn, Dyed Yarn, and Embellishment tables, and filtered process types in Fabric Conversion map to prevent returning null elements.",
    "descriptionBn": "Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿-Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Â¸Ã Â¦â€šÃ Â¦Â¶Ã Â§â€¹Ã Â¦Â§Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦Â°Ã Â§â€¡Ã Â¦Â«Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦ï¿½Ã Â¦Â°Ã Â¦Â° Ã Â¦Â¦Ã Â§â€šÃ Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ React Ã Â¦â€¡Ã Â¦Â®Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦â€¡Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨, Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡ Ã Â¦â€¡Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢ Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿ Ã Â¦Â°Ã Â§â€¹-Ã Â¦Â¤Ã Â§â€¡ Ã Â¦â€¡Ã Â¦â€°Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â¿ (key) Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "34",
    "date": "2026-08-02T15:05",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Expanded the Pre-Costing printable sheet width by increasing the outer container constraint from max-w-7xl to max-w-[1500px] and changing the card container to max-w-full, reducing empty space on the sides for wide screen displays.",
    "descriptionBn": "Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿-Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Âª Ã Â¦â€¢Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¢Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€°Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¥ max-w-7xl Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¡Ã Â¦Â¼Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ max-w-[1500px] Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¤Ã Â¦Â°Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ max-w-full Ã Â¦ï¿½ Ã Â¦Â°Ã Â§â€šÃ Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "33",
    "date": "2026-08-02T15:12",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Completely rebuilt the Pre-Costing edit/new entry form view matching the user's screenshot layout and fields exactly: added all basic information inputs (Query No, Query Date, customer buying house, departments, agent/brand, etc.), RMG process loss inputs, Order Style Information row insertion controller (with items mapping itemType, sizeGroup, and checkboxes PRINT/EMB/WASH/SPECIAL), dynamic styles basic grid table rendering matching all columns from the screenshot, and Additional Costing spreadsheet-style input panel with final Save button.",
    "descriptionBn": "Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿-Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“Ã Â§â€¡Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸/Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â® Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Â¶Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¤Ã Â§â€¹ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¨Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â£ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¨Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â°, Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸, Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¹Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¸, Ã Â¦ï¿½Ã Â¦Å“Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸/Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦Â¸Ã Â¦â€¢Ã Â¦Â² Ã Â¦Â¬Ã Â§â€¡Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¤Ã Â¦Â¥Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸, Ã Â¦â€ Ã Â¦Â°Ã Â¦ï¿½Ã Â¦Â®Ã Â¦Å“Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸ Ã Â¦Â²Ã Â¦Â¸ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸, Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦Â¤Ã Â¦Â¥Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸ Ã Â¦â€œ Ã Â¦Â²Ã Â¦Â¿Ã Â¦â„¢Ã Â§ï¿½Ã Â¦â€¢Ã Â§â€¡Ã Â¦Å“ (PRINT/EMB/WASH/SPECIAL), Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Â¶Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¬ Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¡ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€š Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€“Ã Â¦Â°Ã Â¦Å¡Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¶Ã Â§â‚¬Ã Â¦Å¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â² Ã Â¦Â¸Ã Â¦Â¹ Ã Â¦Â¸Ã Â¦â€šÃ Â¦Â°Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â·Ã Â¦Â£ Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â®Ã Â¥Â¤"
  },
  {
    "id": "32",
    "date": "2026-08-02T15:20",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Ensured 100% field coverage in the Pre-Costing detail/print sheet: added missing Key Information attributes including M/c Per Line, Production per Hour, Assortment, Fabric Loss Qty, Lead Time, and Sample, and linked dynamic calculation parameters.",
    "descriptionBn": "Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿-Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²/Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡ Ã Â¦Â¶Ã Â¦Â¤Ã Â¦Â­Ã Â¦Â¾Ã Â¦â€” Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â­Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Å“ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Å¡Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦â€¢Ã Â§â‚¬ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â°Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¦ Ã Â¦ÂªÃ Â§Å“Ã Â¦Â¾ Ã Â¦ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â¿Ã Â¦â€°Ã Â¦Å¸ Ã Â¦Â¯Ã Â§â€¡Ã Â¦Â®Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â¨ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â° Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨, Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â° Ã Â¦â€ Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾Ã Â¦Â°, Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¸Ã Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â²Ã Â¦Â¸ Ã Â¦â€¢Ã Â§â€¹Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¿, Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â® Ã Â¦â€œ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "31",
    "date": "2026-08-02T15:49",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Reordered sidebar workflow menus to follow the specified ERP pipeline sequence: Inquiry, Quotation, PO Management, and Pre Costing.",
    "descriptionBn": "Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¿Ã Â¦â€š Ã Â¦Â¬Ã Â¦Â¾ Ã Â¦â€¡Ã Â¦â€ Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¿ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â§â‚¬ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦â€¡Ã Â¦Â¨Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿, Ã Â¦â€¢Ã Â§â€¹Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨, Ã Â¦ÂªÃ Â¦Â¿Ã Â¦â€œ Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Å“Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿-Ã Â¦â€¢Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¥Â¤"
  },
  {
    "id": "30",
    "date": "2026-08-02T16:01",
    "type": "New Addition",
    "module": "Merchandising",
    "link": "/merchandising-bom",
    "descriptionEn": "Created the Bill of Materials (BOM) page: integrated 'Bill of Materials' and 'BOM List' links into the sidebar layout; designed a filterable BOM Sheet Report register with status-colored row highlighting; implemented a high-fidelity Accessories BOM Sheet details view featuring Color/Size breakdown grids, Fabric detail lists, and sewing trim items grouped by style with subtotals.",
    "descriptionBn": "Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦â€¦Ã Â¦Â¬ Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¸ (BOM) Ã Â¦ÂªÃ Â§â€¡Ã Â¦Å“ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸Ã Â§â€¡ Ã Â¦Â²Ã Â¦Â¿Ã Â¦â„¢Ã Â§ï¿½Ã Â¦â€¢ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡; Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸Ã Â§â‚¬ Ã Â¦Â°Ã Â¦â„¢Ã Â¦Â¿Ã Â¦Â¨ Ã Â¦Â°Ã Â§â€¹ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡; Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â¦Å“ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦â€œÃ Â¦ï¿½Ã Â¦Â® Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â°/Ã Â¦Â¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¡, Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸Ã Â§â‚¬ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Âª Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¡Ã Â¦â€š Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¸ Ã Â¦â€ Ã Â¦â€¡Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬Ã Â¦Å¸Ã Â§â€¹Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â² Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â°Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "29",
    "date": "2026-08-02T16:03",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-bom",
    "descriptionEn": "Upgraded the BOM List view row highlights to soft, professional pastel tints (Approved: soft green, Pending: soft blue, Review: soft amber, Saved: soft grey) and replaced the harsh white-on-colored text with premium high-contrast dark text and stylized inline action eye buttons.",
    "descriptionBn": "Ã Â¦Â¬Ã Â¦Â¿Ã Â¦â€œÃ Â¦ï¿½Ã Â¦Â® Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€°Ã Â§Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¦Ã Â¦Â¤Ã Â¦Â¿Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€°Ã Â¦Å“Ã Â§ï¿½Ã Â¦Å“Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â² Ã Â¦Â°Ã Â¦â„¢ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â®Ã Â§Æ’Ã Â¦Â¦Ã Â§ï¿½ Ã Â¦â€œ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¶Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â°Ã Â¦â„¢Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ (Ã Â¦ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â­Ã Â¦Â¡: Ã Â¦Â¸Ã Â¦Â«Ã Â¦Å¸ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨, Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€š: Ã Â¦Â¸Ã Â¦Â«Ã Â¦Å¸ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â²Ã Â§ï¿½, Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€°: Ã Â¦Â¸Ã Â¦Â«Ã Â¦Å¸ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â°, Ã Â¦Â¸Ã Â§â€¡Ã Â¦Â­Ã Â¦Â¡: Ã Â¦Â¸Ã Â¦Â«Ã Â¦Å¸ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡) Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â²Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â°Ã Â¦â„¢ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â·Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€”Ã Â¦Â¾Ã Â§ï¿½ Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Å¸ Ã Â¦â€œ Ã Â¦â€ Ã Â¦â€¢Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â·Ã Â¦Â£Ã Â§â‚¬Ã Â§Å¸ Ã Â¦â€ Ã Â¦â€¡ (Eye) Ã Â¦â€ Ã Â¦â€¡Ã Â¦â€¢Ã Â¦Â¨ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "28",
    "date": "2026-08-02T16:40",
    "type": "New Addition",
    "module": "Merchandising",
    "link": "/merchandising-cad",
    "descriptionEn": "Created the CAD Consumption Update module: implemented a filterable registry list view; built a high-fidelity spreadsheet-style edit/entry form with automatic dozen-wise consumption and wastage weight calculations; and designed a printable sheet featuring style details, marker length/DIA parameters, signature approvals, and marker nest visualizers.",
    "descriptionBn": "Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â² Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€°; Ã Â¦Â¡Ã Â¦Å“Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¤Ã Â¦Â¿ Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Å“Ã Â¦Â¾Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ Ã Â¦â€œ Ã Â¦â€œÃ Â§Å¸Ã Â§â€¡Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Å“ Ã Â¦â€œÃ Â¦Å“Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â§Å¸Ã Â¦â€šÃ Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸ Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¶Ã Â§â‚¬Ã Â¦Å¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸/Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®; Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¸, Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¦Ã Â§Ë†Ã Â¦Â°Ã Â§ï¿½Ã Â¦ËœÃ Â§ï¿½Ã Â¦Â¯/Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€ Ã Â¦â€¡Ã Â¦ï¿½ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°, Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§Å¸Ã Â§â€¹Ã Â¦Å“Ã Â¦Â¨Ã Â§â‚¬Ã Â§Å¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â·Ã Â¦Â° Ã Â¦â€œ Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "27",
    "date": "2026-08-02T16:45",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-cad",
    "descriptionEn": "Refined the CAD entry/edit screen into a unified borderless spreadsheet grid editor visually matching the printable sheet, integrated the marker nesting and style card assets from the workspace, and added dark mode styling support.",
    "descriptionBn": "Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿/Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â°Ã Â¦â€œ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¶Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€œ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦â€“Ã Â§ï¿½Ã Â¦ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â°Ã Â§â€šÃ Â¦Âª Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¹Ã Â§â‚¬Ã Â¦Â¨ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¶Ã Â§â‚¬Ã Â¦Å¸ Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â°Ã Â§â€šÃ Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€š Ã Â¦â€œ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦â€¡Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€¢ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡ Ã Â¦Â¸Ã Â¦Â¾Ã Â¦ÂªÃ Â§â€¹Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Å¡Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "26",
    "date": "2026-08-02T23:42",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Added the missing 'Working Hour' field to the OT Configuration edit modal under the OT Deductions block; added options for 'Worker', 'HR, Admin and Compliance', 'Admin', and 'Driver' to their respective dropdown selects; updated the default configurations; conditionally rendered the 'Fixed OT Hour' field when OT Type is set to 'Fixed Hour'; reorganized standard shift info settings modal to match legacy fields exactly, and changed action button to 'CREATE'.",
    "descriptionBn": "Ã Â¦â€œÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡ Ã Â¦â€œÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â²Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â° Ã Â¦â€ Ã Â¦â€œÃ Â¦Â¤Ã Â¦Â¾Ã Â§Å¸ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¿Ã Â¦Â¤ 'Working Hour' Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡; Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬-Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¬ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡ 'Worker', 'HR, Admin and Compliance', 'Admin' Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š 'Driver' Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡; Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â«Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡; Ã Â¦â€œÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Âª 'Fixed Hour' Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¶Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¸Ã Â¦Â¾Ã Â¦ÂªÃ Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â·Ã Â§â€¡ 'Fixed OT Hour' Ã Â¦â€¡Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡; Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â«Ã Â¦Å¸ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â°Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¸Ã Â¦Â¿ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸Ã Â§â‚¬ Ã Â¦Â°Ã Â¦Â¿Ã Â¦â€¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â¨Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Å“ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¬Ã Â§â€¹Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â® Ã Â¦ÂªÃ Â¦Â°Ã Â¦Â¿Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ 'CREATE' Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "25",
    "date": "2026-08-03T00:13",
    "type": "Modify",
    "module": "Allowance Rate",
    "link": "/configure-compensation?tab=allowance",
    "descriptionEn": "Upgraded text inputs to dropdown select elements in the Allowance Rate (Holiday Rate) configuration modal: converted Company, Area, Employee Type, Department, Section, Designation, Rate For, and Div By Hour fields into fully configured select options to match the legacy screen's look and feel.",
    "descriptionBn": "Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ (Ã Â¦Â¹Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸) Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦Å¸Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¸Ã Â¦Å¸ Ã Â¦â€¡Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€°Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â°Ã Â§â€šÃ Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦ï¿½Ã Â¦Â° Ã Â¦Â®Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â§â€¡ Ã Â¦â€¢Ã Â§â€¹Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â¦Â¿, Ã Â¦ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¾, Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â§â‚¬ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Âª, Ã Â¦Â¡Ã Â¦Â¿Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸, Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨, Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨, Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â«Ã Â¦Â° Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â­ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦â€¡ Ã Â¦â€ Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â¬Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¤Ã Â§â‚¬ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â§Å¸Ã Â§â‚¬ Ã Â¦Â¡Ã Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¡Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨ Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â°Ã Â§â€šÃ Â¦ÂªÃ Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "24",
    "date": "2026-08-04T11:15",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Upgraded the OT configuration modal to a premium Dialog with a dynamic round slab builder, and added a detailed timings/slabs overview table layout.",
    "descriptionBn": "Ã Â¦â€œÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â®Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â® Ã Â¦Â¡Ã Â¦Â¾Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â²Ã Â¦â€”Ã Â§â€¡ Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¨Ã Â§â‚¬Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â®Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦Â°Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Â¸Ã Â¦Â®Ã Â§Å¸ Ã Â¦â€œ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¬ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¬Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¦Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "23",
    "date": "2026-08-04T11:20",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Added conditional fields for Day Name, Time From, and Time To under the Prayer Break option in the OT configuration dialog when set to Yes.",
    "descriptionBn": "Ã Â¦â€œÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â²Ã Â¦â€”Ã Â§â€¡ Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦â€¢ Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ 'Yes' Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¡Ã Â§â€¡ Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â®, Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â® Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â® Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â® Ã Â¦Å¸Ã Â§ï¿½ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¢Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â² Ã Â¦â€¡Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "22",
    "date": "2026-08-04T11:22",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Increased width of the OT configuration dialog modal from 5xl to 7xl to allow more room for nested configurations.",
    "descriptionBn": "Ã Â¦â€œÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â²Ã Â¦â€” Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥ 5xl Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Â¡Ã Â¦Â¼Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ 7xl Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¡ Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦â€ Ã Â¦Â°Ã Â§â€¹ Ã Â¦Â¸Ã Â¦Â¹Ã Â¦Å“Ã Â§â€¡ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¹Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¥Â¤"
  },
  {
    "id": "21",
    "date": "2026-08-04T11:28",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Added conditional fields for Deduction For, Time From, Time To, and Deduct Min under the Dinner/Others Break option in the OT configuration dialog when set to Yes, and included 'Regular' in Deduction For options.",
    "descriptionBn": "Ã Â¦â€œÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â²Ã Â¦â€”Ã Â§â€¡ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â°/Ã Â¦â€ Ã Â¦Â¦Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â°Ã Â§â€¡Ã Â¦â€¢ Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ 'Yes' Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â²Ã Â§â€¡ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â«Ã Â¦Â°, Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â® Ã Â¦Â«Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â®, Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â® Ã Â¦Å¸Ã Â§ï¿½ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â®Ã Â¦Â¿Ã Â¦Â¨ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€¢Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¨Ã Â¦Â¾Ã Â¦Â² Ã Â¦â€¡Ã Â¦Â¨Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Â¡Ã Â¦Â¾Ã Â¦â€¢Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â«Ã Â¦Â° Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨Ã Â§â€¡ 'Regular' Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "20",
    "date": "2026-08-04T11:31",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Implemented validation checks and marked asterisks for all required fields in the OT configuration dialog when clicking Create/Update.",
    "descriptionBn": "Ã Â¦â€œÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â²Ã Â¦â€”Ã Â§â€¡ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦Å¸/Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¬Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¨Ã Â§â€¡ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¹Ã Â¦Å“Ã Â¦Â¨Ã Â§â‚¬Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â° Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â²Ã Â¦Â¿Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å¡Ã Â¦Â¿Ã Â¦Â¹Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "19",
    "date": "2026-08-04T11:45",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Embedded the OT Configurations Overview table inside the settings dialog to display existing rules and easily load them into the form above via a pencil click.",
    "descriptionBn": "Ã Â¦â€œÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾Ã Â¦Â²Ã Â¦â€”Ã Â§â€¡Ã Â¦Â° Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¤Ã Â¦Â°Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦â€œÃ Â¦Â­Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦Â¨Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â®Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â¨Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â² Ã Â¦â€ Ã Â¦â€¡Ã Â¦â€¢Ã Â¦Â¨ Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â²Ã Â¦Â¿Ã Â¦â€¢Ã Â§â€¡Ã Â¦Â° Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â®Ã Â§â€¡ Ã Â¦Â¸Ã Â§â€¡Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦â€¢Ã Â§â€¡ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡Ã Â¦Â° Ã Â¦Â­Ã Â§â€¡Ã Â¦Â¤Ã Â¦Â°Ã Â§â€¡ Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼Ã Â¥Â¤"
  },
  {
    "id": "18",
    "date": "2026-08-04T11:46",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Configured separate layouts for Add/Edit rules and Settings modes: hid Start/End Dates and the Configurations table during Add/Edit rule operations, rendering them exclusively in Settings mode.",
    "descriptionBn": "Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡/Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â¨Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â® Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦â€ Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾ Ã Â¦Â²Ã Â§â€¡Ã Â¦â€ Ã Â¦â€°Ã Â¦Å¸ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡: Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¡/Ã Â¦ï¿½Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å¸ Ã Â¦Â¨Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â® Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â§Å¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸/Ã Â¦ï¿½Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦Â¹Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â° Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â§â€¡ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦Â¦Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¶Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Â¹Ã Â¦Â¬Ã Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "17",
    "date": "2026-08-04T11:48",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Filtered the OT Configurations Overview history table in the settings modal to only display rules matching the selected Employee Type.",
    "descriptionBn": "Ã Â¦Â¸Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€šÃ Â¦Â¸ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â²Ã Â§â€¡Ã Â¦Â° Ã Â¦â€œÃ Â¦Å¸Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨ Ã Â¦â€œÃ Â¦Â­Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Â¹Ã Â¦Â¿Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â²Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â§Ã Â§ï¿½ Ã Â¦Â¸Ã Â¦Â¿Ã Â¦Â²Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¡ Ã Â¦ï¿½Ã Â¦Â®Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â²Ã Â¦Â¯Ã Â¦Â¼Ã Â§â‚¬ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦ÂªÃ Â§â€¡Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â¦Â®Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€“Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¹Ã Â¦Â° Ã Â¦Â¬Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¬Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "16",
    "date": "2026-08-04T11:58",
    "type": "Modify",
    "module": "Allowance Rate",
    "link": "/configure-compensation?tab=allowance",
    "descriptionEn": "Added missing fields ('Div By Day', 'Calculation For') and 'Basic Salary' option under Based On to the Allowance Rate form, states, interfaces, mock data, and table overview columns.",
    "descriptionBn": "Ã Â¦ï¿½Ã Â¦Â²Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¸ Ã Â¦Â°Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â«Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â®Ã Â§â€¡ Ã Â¦â€¦Ã Â¦Â¨Ã Â§ï¿½Ã Â¦ÂªÃ Â¦Â¸Ã Â§ï¿½Ã Â¦Â¥Ã Â¦Â¿Ã Â¦Â¤ Ã Â¦Â«Ã Â¦Â¿Ã Â¦Â²Ã Â§ï¿½Ã Â¦Â¡ ('Div By Day', 'Calculation For') Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Based On Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨Ã Â§â€¡ 'Basic Salary' Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡, Ã Â¦Â¯Ã Â¦Â¾ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Å¸, Ã Â¦â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â«Ã Â§â€¡Ã Â¦Â¸, Ã Â¦Â®Ã Â¦â€¢ Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦â€œÃ Â¦Â­Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â­Ã Â¦Â¿Ã Â¦â€° Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦â€¢Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â®Ã Â§â€¡ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â¡Ã Â§â€¡Ã Â¦Å¸ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "15",
    "date": "2026-08-15T17:35",
    "type": "New",
    "module": "HR Policy",
    "link": "/hr-policy",
    "descriptionEn": "Fully redesigned the HR Policy module to exclusively focus on Policy uploading and management, completely removing Job Description (JD) features. Added a dedicated attachment upload workflow.",
    "descriptionBn": "Ã Â¦ï¿½Ã Â¦â€¡Ã Â¦Å¡Ã Â¦â€ Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¿ Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â²Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£Ã Â¦Â°Ã Â§â€šÃ Â¦ÂªÃ Â§â€¡ Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¡Ã Â¦Â¿Ã Â¦Å“Ã Â¦Â¾Ã Â¦â€¡Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¶Ã Â§ï¿½Ã Â¦Â§Ã Â§ï¿½Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¿ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦â€œ Ã Â¦Â®Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§â€¡Ã Â¦Å“Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â° Ã Â¦â€°Ã Â¦ÂªÃ Â¦Â° Ã Â¦Â«Ã Â§â€¹Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â¸ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¯Ã Â¦Â¼, Ã Â¦Å“Ã Â¦Â¬ Ã Â¦Â¡Ã Â§â€¡Ã Â¦Â¸Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ (JD) Ã Â¦Â«Ã Â¦Â¿Ã Â¦Å¡Ã Â¦Â¾Ã Â¦Â°Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹ Ã Â¦Â¸Ã Â¦Â®Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€šÃ Â¦Â°Ã Â§ï¿½Ã Â¦Â£ Ã Â¦Â¸Ã Â¦Â°Ã Â¦Â¿Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡ Ã Â¦Â¦Ã Â§â€¡Ã Â¦â€œÃ Â¦Â¯Ã Â¦Â¼Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ÂªÃ Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¿ Ã Â¦â€¦Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Å¸Ã Â¦Â¾Ã Â¦Å¡Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦â€ Ã Â¦ÂªÃ Â¦Â²Ã Â§â€¹Ã Â¦Â¡ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€¦Ã Â¦ÂªÃ Â¦Â¶Ã Â¦Â¨ Ã Â¦Â¯Ã Â§â€¹Ã Â¦â€” Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â¦Â¯Ã Â¦Â¼Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "14",
    "date": "2026-08-15T17:42",
    "type": "New",
    "module": "JD List",
    "link": "/jd-list",
    "descriptionEn": "Created a new dedicated JD List module decoupled from HR Policies. Features a high-fidelity data table and a standardized modal for creating JDs based on Department and Designation.",
    "descriptionBn": "Ã Â¦ï¿½Ã Â¦â€¡Ã Â¦Å¡Ã Â¦â€ Ã Â¦Â° Ã Â¦ÂªÃ Â¦Â²Ã Â¦Â¿Ã Â¦Â¸Ã Â¦Â¿ Ã Â¦Â¥Ã Â§â€¡Ã Â¦â€¢Ã Â§â€¡ Ã Â¦â€ Ã Â¦Â²Ã Â¦Â¾Ã Â¦Â¦Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Â¨Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¨ 'JD List' Ã Â¦Â®Ã Â¦Â¡Ã Â¦Â¿Ã Â¦â€°Ã Â¦Â² Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤ Ã Â¦ï¿½Ã Â¦Â¤Ã Â§â€¡ Ã Â¦Â¡Ã Â¦Â¿Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â®Ã Â§â€¡Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å“Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â§â€¡Ã Â¦Â° Ã Â¦â€œÃ Â¦ÂªÃ Â¦Â° Ã Â¦Â­Ã Â¦Â¿Ã Â¦Â¤Ã Â§ï¿½Ã Â¦Â¤Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â§â€¡ Ã Â¦Å“Ã Â§â€¡Ã Â¦Â¡Ã Â¦Â¿ (JD) Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾Ã Â¦Â° Ã Â¦Å“Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¯ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Å¸Ã Â§â€¡Ã Â¦Â¬Ã Â¦Â¿Ã Â¦Â² Ã Â¦ï¿½Ã Â¦Â¬Ã Â¦â€š Ã Â¦Â¸Ã Â§ï¿½Ã Â¦Å¸Ã Â§ï¿½Ã Â¦Â¯Ã Â¦Â¾Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¡ Ã Â¦Â®Ã Â§â€¹Ã Â¦Â¡Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¯Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â¤ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "13",
    "date": "2026-08-16T15:09",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Fixed a TypeScript error in the YarnCountSpec initial data configuration by correcting object properties.",
    "descriptionBn": "Ã Â¦â€¡Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â¾Ã Â¦â€°Ã Â¦Â¨Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦Â¸Ã Â§ï¿½Ã Â¦ÂªÃ Â§â€¡Ã Â¦â€¢ (YarnCountSpec)-Ã Â¦ï¿½Ã Â¦Â° Ã Â¦â€¡Ã Â¦Â¨Ã Â¦Â¿Ã Â¦Â¶Ã Â¦Â¿Ã Â§Å¸Ã Â¦Â¾Ã Â¦Â² Ã Â¦Â¡Ã Â§â€¡Ã Â¦Å¸Ã Â¦Â¾ Ã Â¦â€¢Ã Â¦Â¨Ã Â¦Â«Ã Â¦Â¿Ã Â¦â€”Ã Â¦Â¾Ã Â¦Â°Ã Â§â€¡Ã Â¦Â¶Ã Â¦Â¨Ã Â§â€¡ Ã Â¦Â­Ã Â§ï¿½Ã Â¦Â² Ã Â¦â€¦Ã Â¦Â¬Ã Â¦Å“Ã Â§â€¡Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Å¸ Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Â°Ã Â¦ÂªÃ Â¦Â¾Ã Â¦Â°Ã Â§ï¿½Ã Â¦Å¸Ã Â¦Â¿Ã Â¦â€”Ã Â§ï¿½Ã Â¦Â²Ã Â§â€¹Ã Â¦Â° Ã Â¦â€¢Ã Â¦Â¾Ã Â¦Â°Ã Â¦Â£Ã Â§â€¡ Ã Â¦Â¤Ã Â§Ë†Ã Â¦Â°Ã Â¦Â¿ Ã Â¦Â¹Ã Â¦â€œÃ Â§Å¸Ã Â¦Â¾ Ã Â¦ï¿½Ã Â¦â€¢Ã Â¦Å¸Ã Â¦Â¿ Ã Â¦Å¸Ã Â¦Â¾Ã Â¦â€¡Ã Â¦ÂªÃ Â¦Â¸Ã Â§ï¿½Ã Â¦â€¢Ã Â§ï¿½Ã Â¦Â°Ã Â¦Â¿Ã Â¦ÂªÃ Â§ï¿½Ã Â¦Å¸ Ã Â¦ï¿½Ã Â¦Â°Ã Â¦Â° Ã Â¦Â¸Ã Â¦Â®Ã Â¦Â¾Ã Â¦Â§Ã Â¦Â¾Ã Â¦Â¨ Ã Â¦â€¢Ã Â¦Â°Ã Â¦Â¾ Ã Â¦Â¹Ã Â§Å¸Ã Â§â€¡Ã Â¦â€ºÃ Â§â€¡Ã Â¥Â¤"
  },
  {
    "id": "12",
    "date": "2026-08-18T08:42",
    "type": "New",
    "module": "Monthly Salary Process",
    "link": "/monthly-salary-process",
    "descriptionEn": "Added the Advanced Report Actions accordion to the Monthly Salary Process page, enabling dynamic smart printing for processed salary records directly in Pay Slip templates (English & Bangla) precisely matching single-column A4 format.",
    "descriptionBn": "Monthly Salary Process à¦ªà§‡à¦œà§‡ Advanced Report Actions à¦…à¦ªà¦¶à¦¨ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦ªà§�à¦°à¦¸à§‡à¦¸ à¦•à¦°à¦¾ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦°à§‡à¦•à¦°à§�à¦¡à¦—à§�à¦²à§‹ à¦¥à§‡à¦•à§‡ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ Pay Slip (à¦‡à¦‚à¦°à§‡à¦œà¦¿ à¦“ à¦¬à¦¾à¦‚à¦²à¦¾) à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡, à¦¯à¦¾ à¦¸à¦¿à¦™à§�à¦—à§‡à¦²-à¦•à¦²à¦¾à¦® A4 à¦«à¦°à¦®à§�à¦¯à¦¾à¦Ÿà§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "11",
    "date": "2026-08-20T10:23",
    "type": "Feature Update",
    "module": "Payroll Advance",
    "link": "/payroll-advance",
    "descriptionEn": "Added detailed requisition view modal mimicking the salary advance requisition layout. Allows comprehensive view of employee info, requested amount, advance history, and multi-level approval workflows.",
    "descriptionBn": "Payroll Advance-à¦� à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿à¦° à¦¤à¦¥à§�à¦¯, à¦¹à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦�à¦¬à¦‚ à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦“à§Ÿà¦¾à¦°à§�à¦•à¦«à§�à¦²à§‹ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à§Ÿà¥¤"
  },
  {
    "id": "10",
    "date": "2026-08-20T10:35",
    "type": "UI Update",
    "module": "Payroll Advance",
    "link": "/payroll-advance",
    "descriptionEn": "Redesigned the Approval Workflow and Comments sections in the Payroll Advance details view for a cleaner, more interactive experience.",
    "descriptionBn": "à¦ªà§‡-à¦°à§‹à¦² à¦…à§�à¦¯à¦¾à¦¡à¦­à¦¾à¦¨à§�à¦¸ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦­à¦¿à¦‰à¦¤à§‡ à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦“à§Ÿà¦¾à¦°à§�à¦•à¦«à§�à¦²à§‹ à¦�à¦¬à¦‚ à¦•à¦®à§‡à¦¨à§�à¦Ÿà¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡à¦° à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦†à¦°à¦“ à¦¸à§�à¦¨à§�à¦¦à¦° à¦�à¦¬à¦‚ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à¦…à§�à¦¯à¦¾à¦•à§�à¦Ÿà¦¿à¦­ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "9",
    "date": "2026-08-20T10:53",
    "type": "UI Update",
    "module": "Advance Approval",
    "link": "/approve-advance",
    "descriptionEn": "Copied the detailed requisition view modal from Payroll Advance to the Advance Approval page for a consistent and improved approval experience.",
    "descriptionBn": "à¦ªà§‡-à¦°à§‹à¦² à¦…à§�à¦¯à¦¾à¦¡à¦­à¦¾à¦¨à§�à¦¸ à¦¥à§‡à¦•à§‡ à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿ à¦…à§�à¦¯à¦¾à¦¡à¦­à¦¾à¦¨à§�à¦¸ à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦ªà§‡à¦œà§‡ à¦•à¦ªà¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦²à§‡à¦° à¦…à¦­à¦¿à¦œà§�à¦žà¦¤à¦¾ à¦†à¦°à¦“ à¦­à¦¾à¦²à§‹ à¦�à¦¬à¦‚ à¦¸à¦¾à¦®à¦žà§�à¦œà¦¸à§�à¦¯à¦ªà§‚à¦°à§�à¦£ à¦¹à§Ÿà¥¤"
  },
  {
    "id": "8",
    "date": "2026-08-23T11:26",
    "type": "Modify",
    "module": "Evaluation",
    "link": "/increment",
    "descriptionEn": "Removed all old evaluation pages and horizontal/sub-tab navigation bars. Reorganized the Evaluation module with 5 clean standalone page workspaces: Increment (Single), Increment (Multi), Proposed Increment, Increment Report, and Increment History.",
    "descriptionBn": "à¦®à§‚à¦²à§�à¦¯à¦¾à¦¯à¦¼à¦¨ à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦ªà§�à¦°à¦¾à¦¤à¦¨ à¦ªà§‡à¦œ à¦�à¦¬à¦‚ à¦¸à¦•à¦² à¦…à¦¨à§�à¦­à§‚à¦®à¦¿à¦•/à¦¸à¦¾à¦¬-à¦Ÿà§�à¦¯à¦¾à¦¬ à¦¬à¦¾à¦° à¦®à§�à¦›à§‡ à¦«à§‡à¦²à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦®à¦¡à¦¿à¦‰à¦²à¦Ÿà¦¿à¦•à§‡ à§«à¦Ÿà¦¿ à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦° à¦“ à¦¸à§�à¦¬à¦¤à¦¨à§�à¦¤à§�à¦° à¦ªà§‡à¦œà§‡ à¦ªà§�à¦¨à¦°à§�à¦¬à¦¿à¦¨à§�à¦¯à¦¾à¦¸ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: Increment (Single), Increment (Multi), Proposed Increment, Increment Report, à¦�à¦¬à¦‚ Increment Historyà¥¤"
  },
  {
    "id": "7",
    "date": "2026-08-23T11:54",
    "type": "New Feature",
    "module": "Evaluation",
    "link": "/increment-multiple",
    "descriptionEn": "Fully implemented the new Increment (Multi) page workspace, including query filter consoles, search modal for employee IDs, dynamic calculations by percentage and fixed value, and interactive spreadsheet datagrid actions.",
    "descriptionBn": "à¦¨à¦¤à§�à¦¨ Increment (Multi) à¦ªà§‡à¦œ à¦“à¦¯à¦¼à¦¾à¦°à§�à¦•à¦¸à§�à¦ªà§‡à¦¸à¦Ÿà¦¿ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¬à¦¾à¦¸à§�à¦¤à¦¬à¦¾à¦¯à¦¼à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦•à§�à¦¯à¦¼à§‡à¦°à¦¿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦¨à¦¸à§‹à¦², à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦†à¦‡à¦¡à¦¿à¦° à¦œà¦¨à§�à¦¯ à¦¸à¦¾à¦°à§�à¦š à¦®à¦¡à¦¾à¦², à¦ªà¦¾à¦°à¦¸à§‡à¦¨à§�à¦Ÿà§‡à¦œ à¦“ à¦«à¦¿à¦•à§�à¦¸à¦¡ à¦­à§�à¦¯à¦¾à¦²à§�à¦° à¦¡à¦¾à¦¯à¦¼à¦¨à¦¾à¦®à¦¿à¦• à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦¶à¦¨ à¦�à¦¬à¦‚ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à§‡à¦•à§�à¦Ÿà¦¿à¦­ à¦¸à§�à¦ªà§�à¦°à§‡à¦¡à¦¶à§€à¦Ÿ à¦¡à§‡à¦Ÿà¦¾à¦—à§�à¦°à¦¿à¦¡ à¦…à¦¨à§�à¦¤à¦°à§�à¦­à§�à¦•à§�à¦¤ à¦°à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "6",
    "date": "2026-08-23T12:03",
    "type": "New Feature",
    "module": "Personnel",
    "link": "/set-hod",
    "descriptionEn": "Added a new Set HOD configuration page and navigation links under Personnel Info. This page enables users to assign and manage Head of Department (HOD) roles bulky department-wise with active/inactive historical registry logs.",
    "descriptionBn": "à¦ªà¦¾à¦°à§�à¦¸à§‹à¦¨à§‡à¦² à¦‡à¦¨à¦«à§‹à¦° à¦…à¦§à§€à¦¨à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ Set HOD à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦ªà§‡à¦œ à¦�à¦¬à¦‚ à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨ à¦²à¦¿à¦‚à¦• à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦‡ à¦ªà§‡à¦œà¦Ÿà¦¿à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦°à¦¾ à¦¸à¦•à§�à¦°à¦¿à§Ÿ/à¦¨à¦¿à¦·à§�à¦•à§�à¦°à¦¿à§Ÿ à¦¹à¦¿à¦¸à§�à¦Ÿà§‹à¦°à¦¿à¦•à§�à¦¯à¦¾à¦² à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦²à¦—à¦¸à¦¹ à¦¬à¦¾à¦²à§�à¦• à¦¬à¦¾ à¦¬à¦¿à¦­à¦¾à¦—-à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦¹à§‡à¦¡ à¦…à¦« à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ (HOD) à¦°à§‹à¦² à¦¨à¦¿à¦°à§�à¦§à¦¾à¦°à¦£ à¦“ à¦ªà¦°à¦¿à¦šà¦¾à¦²à¦¨à¦¾ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "5",
    "date": "2026-08-23T13:28",
    "type": "New Feature",
    "module": "Personnel",
    "link": "/set-manager",
    "descriptionEn": "Added a new Set Manager page under Personnel Info to bulk assign reporting managers to employees. Features a master staff manager directory and a bulk assignment console modal with department/designation checklists.",
    "descriptionBn": "à¦•à¦°à§�à¦®à¦šà¦¾à¦°à§€à¦¦à§‡à¦° à¦œà¦¨à§�à¦¯ à¦¬à¦¾à¦²à§�à¦• à¦¬à¦¾ à¦�à¦•à¦•à¦¾à¦²à§€à¦¨ à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¿à¦‚ à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦¾à¦° à¦¨à¦¿à¦°à§�à¦§à¦¾à¦°à¦£ à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦ªà¦¾à¦°à§�à¦¸à§‹à¦¨à§‡à¦² à¦‡à¦¨à¦«à§‹à¦° à¦…à¦§à§€à¦¨à§‡ à¦¨à¦¤à§�à¦¨ Set Manager à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦ªà§‡à¦œà¦Ÿà¦¿à¦¤à§‡ à¦�à¦•à¦Ÿà¦¿ à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦¸à§�à¦Ÿà¦¾à¦« à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦¾à¦° à¦¡à¦¿à¦°à§‡à¦•à§�à¦Ÿà¦°à¦¿ à¦�à¦¬à¦‚ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ/à¦¡à§‡à¦¸à¦¿à¦—à¦¨à§‡à¦¶à¦¨ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à¦¸à¦¹ à¦¬à¦¾à¦²à§�à¦• à¦…à§�à¦¯à¦¾à¦¸à¦¾à¦‡à¦¨à¦®à§‡à¦¨à§�à¦Ÿ à¦®à¦¡à¦¾à¦² à¦•à¦¨à¦¸à§‹à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "4",
    "date": "2026-08-23T14:22",
    "type": "New Feature",
    "module": "Personnel",
    "link": "/notice",
    "descriptionEn": "Added a new Notice Board route page and sidebar navigation links. Features a live search directory of notices, rich text circular content configurations using jodit-react, circular format exports, and a premium official letterhead document circular view overlay.",
    "descriptionBn": "à¦�à¦•à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ Notice Board à¦ªà§‡à¦œ à¦�à¦¬à¦‚ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨ à¦²à¦¿à¦‚à¦• à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦ªà§‡à¦œà¦Ÿà¦¿à¦¤à§‡ à¦¨à§‹à¦Ÿà¦¿à¦¸à§‡à¦° à¦²à¦¾à¦‡à¦­ à¦¸à¦¾à¦°à§�à¦š à¦¡à¦¿à¦°à§‡à¦•à§�à¦Ÿà¦°à¦¿, jodit-react à¦�à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦°à¦¿à¦š à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦¸à¦¾à¦°à§�à¦•à§�à¦²à¦¾à¦° à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨, à¦¬à¦¿à¦­à¦¿à¦¨à§�à¦¨ à¦¸à¦¾à¦°à§�à¦•à§�à¦²à¦¾à¦° à¦«à¦¾à¦‡à¦² à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦�à¦¬à¦‚ à¦�à¦•à¦Ÿà¦¿ à¦†à¦§à§�à¦¨à¦¿à¦• à¦•à¦°à§�à¦ªà§‹à¦°à§‡à¦Ÿ à¦²à§‡à¦Ÿà¦¾à¦°à¦¹à§‡à¦¡ à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦¸à¦¾à¦°à§�à¦•à§�à¦²à¦¾à¦° à¦­à¦¿à¦‰ à¦“à¦­à¦¾à¦°à¦²à§‡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "3",
    "date": "2026-08-24T15:40",
    "type": "UI Update",
    "module": "Employee Job Card",
    "link": "/employee-job-card",
    "descriptionEn": "Redesigned Employee Job Card with modern header styling and repositioned Attendance Summary Panel. Rebuilt top filter cards and statistics grids.",
    "descriptionBn": "à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦œà¦¬ à¦•à¦¾à¦°à§�à¦¡ à¦ªà§‡à¦œà¦Ÿà¦¿à¦•à§‡ à¦¨à¦¤à§�à¦¨à¦­à¦¾à¦¬à§‡ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦†à¦§à§�à¦¨à¦¿à¦• à¦¹à§‡à¦¡à¦¾à¦° à¦¸à§�à¦Ÿà¦¾à¦‡à¦²à¦¿à¦‚ à¦�à¦¬à¦‚ à¦…à§�à¦¯à¦¾à¦Ÿà§‡à¦¨à¦¡à§‡à¦¨à§�à¦¸ à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦²à¦Ÿà¦¿ à¦ªà§�à¦¨à¦°à¦¾à§Ÿ à¦ªà¦œà¦¿à¦¶à¦¨ à¦•à¦°à¦¾ à¦…à¦¨à§�à¦¤à¦°à§�à¦­à§�à¦•à§�à¦¤à¥¤"
  },
  {
    "id": "2",
    "date": "2026-09-08T15:15",
    "type": "Feature Update",
    "module": "SSP Requisition",
    "link": "/ssp-general-product-budget-request",
    "descriptionEn": "Converted the Product field into an interactive searchable dropdown with custom entry support across both General Product and ICT Product budget request forms. Enhanced the Add Item mechanism with automated quantity unit formatting, optional justification fallback, and seamless ERP table queuing.",
    "descriptionBn": "à¦œà§‡à¦¨à¦¾à¦°à§‡à¦² à¦ªà§�à¦°à§‹à¦¡à¦¾à¦•à§�à¦Ÿ à¦�à¦¬à¦‚ à¦†à¦‡à¦¸à¦¿à¦Ÿà¦¿ à¦ªà§�à¦°à§‹à¦¡à¦¾à¦•à§�à¦Ÿ à¦¬à¦¾à¦œà§‡à¦Ÿ à¦°à¦¿à¦•à§�à¦‡à¦œà¦¿à¦¶à¦¨ à¦‰à¦­à§Ÿ à¦ªà§‡à¦œà§‡ à¦ªà§�à¦°à§‹à¦¡à¦¾à¦•à§�à¦Ÿ à¦‡à¦¨à¦ªà§�à¦Ÿ à¦«à¦¿à¦²à§�à¦¡à¦Ÿà¦¿à¦•à§‡ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à¦…à§�à¦¯à¦¾à¦•à§�à¦Ÿà¦¿à¦­ à¦¸à¦¾à¦°à§�à¦šà§‡à¦¬à¦² à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦›à¦¾à§œà¦¾à¦“ à¦†à¦‡à¦Ÿà§‡à¦® à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾à¦° à¦ªà§�à¦°à¦•à§�à¦°à¦¿à§Ÿà¦¾à§Ÿ à¦¸à§�à¦¬à§Ÿà¦‚à¦•à§�à¦°à¦¿à§Ÿ à¦‡à¦‰à¦¨à¦¿à¦Ÿ à¦«à¦°à¦®à§�à¦¯à¦¾à¦Ÿà¦¿à¦‚ à¦“ à¦«à¦²à¦¬à§�à¦¯à¦¾à¦• à¦¸à¦¾à¦ªà§‹à¦°à§�à¦Ÿ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à§‡ à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦¨à¦¿à¦¶à§�à¦šà¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "1",
    "date": "2026-09-08T15:17",
    "type": "UI / UX",
    "module": "SSP Requisition",
    "link": "/ssp-general-product-budget-request",
    "descriptionEn": "Polished the SearchableSelect component with a dedicated 'underline' variant! Fixed the bottom border line curvature bug to produce a crisp 1px straight underline, removed distracting icons in trigger state, and aligned chevron arrows perfectly with standard form select elements.",
    "descriptionBn": "SearchableSelect à¦•à¦®à§�à¦ªà§‹à¦¨à§‡à¦¨à§�à¦Ÿà¦Ÿà¦¿à¦¤à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¨à¦¿à¦¬à§‡à¦¦à¦¿à¦¤ 'underline' à¦­à§�à¦¯à¦¾à¦°à¦¿à§Ÿà§‡à¦¨à§�à¦Ÿ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡! à¦‡à¦‰-à¦¶à§‡à¦ª à¦¬à¦¾à¦�à¦•à¦¾à¦¨à§‹ à¦²à¦¾à¦‡à¦¨à§‡à¦° à¦¬à¦¾à¦—à¦Ÿà¦¿ à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦•à¦°à§‡ à¦–à¦¾à§œà¦¾ à§§ à¦ªà¦¿à¦•à§�à¦¸à§‡à¦² à¦¬à¦Ÿà¦® à¦¬à¦°à§�à¦¡à¦¾à¦° à¦²à¦¾à¦‡à¦¨ à¦¨à¦¿à¦¶à§�à¦šà¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦…à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¯ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦¡à¦¾à¦°à§�à¦¡ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦¹à§�à¦¬à¦¹à§� à¦¸à¦¾à¦®à¦žà§�à¦œà¦¸à§�à¦¯à¦ªà§‚à¦°à§�à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  }
];
