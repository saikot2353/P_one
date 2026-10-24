import type { ChangeRecord } from "./changes";

export const DEFAULT_CHANGE_RECORDS: ChangeRecord[] = [
  {
    "id": "601",
    "date": "2026-10-24T14:15",
    "type": "Fix Company Area/Section Dropdown Data Loading in Create Warehouse / Store Form",
    "module": "Inventory Management / Master Data",
    "link": "/inventory-configuration",
    "descriptionEn": "Resolved the issue where the 'Company Area/Section' dropdown was remaining empty in Create Warehouse / Store Form (General Store Information): (1) Root Cause Diagnosed: Identified that the form was querying hris_areas and hris_sections from localStorage without fallback initialization, causing the dropdown to be empty whenever the user accessed Inventory forms prior to visiting the company setup module; (2) Reused Reference Implementation: Adopted the established Working Area data-loading patterns from the Add Employee Form and Company Master Data, linking area/section records directly with selected organizations (including all 20 canonical areas for Pakiza Knit Composite Ltd, working areas for Pakiza Software Limited, and configured areas for all sister concerns); (3) Organization-Aware Reactive Filtering: Dynamically populates and refreshes valid area/section options based on the chosen organization, clearing prior selections if no longer valid; (4) Robust Selection & Persistence: Ensured accurate mapping of display names and underlying record identifiers, maintaining existing selections during edit mode, and providing fallback preservation for previously saved values.",
    "descriptionBn": "Create Warehouse / Store ফর্মের General Store Information সেকশনে 'Company Area/Section' ড্রপডাউন খালি থাকার সমস্যা সমাধান করা হয়েছে: (১) মূল কারণ নির্ণয়: ফর্মটি লোকাল স্টোরেজের hris_areas এবং hris_sections কি থেকে ডেটা খোঁজার চেষ্টা করত যেখানে কোনো ফলব্যাক ইনিশিয়ালাইজেশন ছিল না, ফলে ব্যবহারকারী Company Setup পেজে আগে না গেলে ড্রপডাউনটি খালি থেকে যেত; (২) রেফারেন্স ইমপ্লিমেন্টেশন অনুসরণ: Add Employee Form-এর Working Area এবং Company Setup-এর সুপ্রতিষ্ঠিত ডেটা-লোডিং কৌশল অনুসরণ করে অর্গানাইজেশনের সাথে এরিয়া ও সেকশন সংযুক্ত করা হয়েছে (যার মধ্যে Pakiza Knit Composite Ltd-এর ২০টি অনুমোদিত এরিয়া, Pakiza Software Limited-এর ওয়ার্কিং এরিয়া এবং অন্যান্য সহযোগী প্রতিষ্ঠানের নির্ধারিত এরিয়া অন্তর্ভুক্ত); (৩) অর্গানাইজেশনভিত্তিক স্বয়ংক্রিয় ফিল্টারিং: অর্গানাইজেশন নির্বাচন বা পরিবর্তনের সাথে সাথে ড্রপডাউন স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট এরিয়া ও সেকশন লোড করে এবং পূর্বে নির্বাচিত মান যদি নতুন অর্গানাইজেশনের সাথে না মিলে তবে তা নিরাপদভাবে রিসেট করে; (৪) নিখুঁত পারসিস্টেন্স ও এডিট সাপোর্ট: এরিয়া ও সেকশনের নাম ও আইডির সঠিক ম্যাপিং নিশ্চিত করা হয়েছে, যাতে নতুন তৈরির সময় ডাটা সেভ হয় এবং বিদ্যমান ওয়্যারহাউজ এডিট করার সময় সংরক্ষিত মান অক্ষুণ্ণভাবে প্রদর্শিত হয়।"
  },
  {
    "id": "600",
    "date": "2026-10-24T13:45",
    "type": "ERP Enhancement & Bug Fixes — Booking Registers, Proforma Invoice, Menu Visibility, and Inventory Forms",
    "module": "Marketing & Merchandising / Inventory Management",
    "link": "/mm-fabric-booking-register",
    "descriptionEn": "Comprehensive ERP enhancements and bug fixes across Booking Registers, Proforma Invoice creation, Sidebar Navigation, Item Creation, and Warehouse forms: (1) Fabric Booking Approval & Register Booking QTY Display: Removed incorrect company name rendering from Booking QTY column and mapped to authentic line-level units of measurement (UOM, e.g., Kg); (2) Register Column Cleanup: Removed 'Fabric Items' and 'Currency' columns from Fabric Booking Register, and removed 'Accessories Items' and 'Currency' columns from Accessories Booking Register while updating table layout and colSpans; (3) Explicit Proforma Invoice (PI) Creation: Fixed single and multi-selection logic so clicking 'Create PI' passes only the explicitly selected booking IDs and numbers without pulling unselected same-supplier bookings or hijacking to preexisting unrelated multi-booking PIs; (4) Proforma Invoice Form Cleanup: Removed the 'Latest Comment Activity' visible UI section from Section D without deleting historical comment logs; (5) Streamlined Navigation Visibility: Hid 5 obsolete/duplicate menu entries ('Accessories Estimation & Booking', 'Fabric Estimation & Booking', 'BOM Management', 'Booking Approval Queue', and 'Registers & Audit Trail') from visible sidebar navigation while strictly preserving all underlying routes and business logic; (6) Inventory Item Creation HS Code: Added 'HS Code' field immediately to the left of 'Item Name' in the same grid row, ensuring full persistence across save and reload cycles; (7) Warehouse / Store Company Area/Section: Added 'Company Area/Section' dropdown immediately to the right of 'Organization *' in General Store Information, dynamically populating assigned areas/sections from existing organization master data and clearing invalid selections upon organization change.",
    "descriptionBn": "বুকিং রেজিস্টার, প্রোফরমা ইনভয়েস ক্রিয়েশন, সাইডবার নেভিগেশন, আইটেম ক্রিয়েশন ও ওয়্যারহাউজ ফর্মে সামগ্রিক আধুনিকায়ন ও বাগ ফিক্স সম্পন্ন: (১) ফেব্রিক বুকিং অ্যাপ্রুভাল ও রেজিস্টারে বুকিং পরিমাণ সংশোধন: Booking QTY কলামে পরিমাণের সাথে ভুলভাবে কোম্পানির নাম প্রদর্শন বন্ধ করে সঠিক ইউনিট (UOM, যেমন: Kg) ম্যাপিং নিশ্চিত করা হয়েছে; (২) রেজিস্টার কলাম পরিচ্ছন্নকরণ: Fabric Booking Register থেকে 'Fabric Items' ও 'Currency' কলাম এবং Accessories Booking Register থেকে 'Accessories Items' ও 'Currency' কলাম অপসারণ করা হয়েছে এবং টেবিল colSpan সমন্বয় করা হয়েছে; (৩) নির্দিষ্ট প্রোফরমা ইনভয়েস (PI) নির্বাচন: ব্যবহারকারী যখন কোনো নির্দিষ্ট বুকিং নির্বাচন করে 'Create PI'-তে ক্লিক করেন, তখন শুধুমাত্র সেই নির্দিষ্ট বুকিং আইডি ও নম্বর PI এন্ট্রি ফর্মে প্রেরিত হবে— কোনো অপ্রয়োজনীয় বা পূর্ববর্তী মাল্টি-বুকিং PI স্বয়ংক্রিয়ভাবে লোড হবে না; (৪) প্রোফরমা ইনভয়েস ফর্ম থেকে কমেন্ট অ্যাক্টিভিটি অপসারণ: Section D থেকে 'Latest Comment Activity' সেকশনের দৃশ্যমান UI বাদ দেওয়া হয়েছে (পূর্ববর্তী কমেন্ট হিস্ট্রি ও অডিট ট্রেইল অক্ষুণ্ণ রেখে); (৫) সাইডবার মেনু দৃশ্যমানতা নিয়ন্ত্রণ: সাইডবার থেকে ৫টি অপ্রয়োজনীয় মেনু ('Accessories Estimation & Booking', 'Fabric Estimation & Booking', 'BOM Management', 'Booking Approval Queue' এবং 'Registers & Audit Trail') আড়াল করা হয়েছে (মূল পেজ, রাউট ও কার্যকারিতা সম্পূর্ণ সুরক্ষিত রেখে); (৬) ইনভেন্টরি আইটেম ক্রিয়েশনে HS Code ফিল্ড: Item Name-এর ঠিক বাম পাশে একই সারিতে নতুন 'HS Code' ফিল্ড যোগ করা হয়েছে এবং সেভ ও পুনরায় লোডের সময় এর নির্ভরযোগ্য পারসিস্টেন্স নিশ্চিত করা হয়েছে; (৭) ওয়্যারহাউজ / স্টোর ফর্মে Company Area/Section: General Store Information-এ Organization *-এর ঠিক ডান পাশে নতুন 'Company Area/Section' ড্রপডাউন যুক্ত করা হয়েছে যা নির্বাচিত অর্গানাইজেশনের অধীনে সংরক্ষিত এরিয়া ও সেকশনগুলো স্বয়ংক্রিয়ভাবে লোড করে এবং অর্গানাইজেশন পরিবর্তন হলে ড্রপডাউন রিফ্রেশ ও রিসেট করে।"
  },
  {
    "id": "599",
    "date": "2026-10-24T12:25",
    "type": "Update Fabric & Accessories Booking Approval — Register and Details Forms",
    "module": "Marketing & Merchandising / Booking Information",
    "link": "/mm-fabric-booking-approval",
    "descriptionEn": "Comprehensive update across Fabric and Accessories Booking Approval Register and Details forms: (1) Fabric Booking Approval Register: Removed Currency column; strictly separated Booking Qty (displaying only quantity and unit) and Supplier (displaying only supplier name) into independent columns; renamed Budget Value to Pre Cost Value; (2) Fabric Booking Approval Details Form: Removed Currency and Conv Rate fields from header banner and Section A without affecting underlying data; renamed Section B Budget Value column to Pre Cost Value displaying authentic pre-costing values; (3) Accessories Booking Approval Register: Removed Accessories Items column and Currency column; renamed Budget Value to Pre Cost Value with non-duplicated pre-cost item budget mapping; ensured Booking Qty and Supplier are clean independent columns; (4) Accessories Booking Approval Details Form: Removed introductory descriptive subtitle ('Dedicated authorization review, budget comparison, and approval history'); renamed Section A to 'Accessories Booking Information', renamed 'Job ID / Our Ref' to 'Job ID', and removed PI Reference, Currency, and Conv Rate fields; renamed Section B to 'Style & PO Summary', added 'PO QTY' immediately after Associated PO Details displaying the deduplicated sum of quantities of all POs associated with the style, removed PO Allocation Count, and renamed Budget Value to Pre Cost Value; renamed Section C to 'Item-wise Budget vs. Booking Comparison', removed Color, Size, Budget Qty, Budget Unit, Budget Rate, and Quantity Variance, added 'Pre Cost Item' immediately after Style showing genuine mapped pre-cost item name (with fallback 'Pre-Cost Item Not Linked'), renamed Budget Value to Pre Costing Value, and consolidated color-wise and size-wise booking rows per pre-cost item without budget duplication; renamed Section D to 'Workflow & Approval History' while preserving complete approval audit history and action dialogs.",
    "descriptionBn": "Fabric এবং Accessories Booking Approval Register ও Details ফর্মদ্বয়ে গুরুত্বপূর্ণ সংস্কার সম্পন্ন: (১) ফেব্রিক বুকিং অ্যাপ্রুভাল রেজিস্টার: Currency কলাম অপসারণ করা হয়েছে; Booking Qty (শুধুমাত্র পরিমাণ ও ইউনিট) এবং Supplier (শুধুমাত্র সাপ্লায়ারের নাম) দুটি সম্পূর্ণ স্বাধীন কলামে আলাদা করা হয়েছে; Budget Value কলামটিকে Pre Cost Value নামে পরিবর্তন করা হয়েছে; (২) ফেব্রিক বুকিং অ্যাপ্রুভাল ডিটেইলস ফর্ম: ব্যানার ও সেকশন A থেকে Currency ও Conv Rate ফিল্ড অপসারণ করা হয়েছে; সেকশন B-তে Budget Value কলামটিকে Pre Cost Value নামে পরিবর্তন করা হয়েছে; (৩) অ্যাক্সেসরিজ বুকিং অ্যাপ্রুভাল রেজিস্টার: Accessories Items এবং Currency কলাম অপসারণ করা হয়েছে; Budget Value কলামটিকে Pre Cost Value নামে পরিবর্তন করে প্রি-কস্ট আইটেমের প্রকৃত বাজেট প্রদর্শনের ব্যবস্থা করা হয়েছে; (৪) অ্যাক্সেসরিজ বুকিং অ্যাপ্রুভাল ডিটেইলস ফর্ম: ডিটেইলস পেজের উপরের পরিচিতিমূলক সাবটাইটেল বাদ দেওয়া হয়েছে; সেকশন A-এর নাম 'Accessories Booking Information' করা হয়েছে, 'Job ID / Our Ref'-কে 'Job ID' করা হয়েছে এবং PI Reference, Currency ও Conv Rate ফিল্ড বাদ দেওয়া হয়েছে; সেকশন B-এর নাম 'Style & PO Summary' করা হয়েছে, Associated PO Details-এর ঠিক পরেই নতুন 'PO QTY' কলাম যুক্ত করে সংশ্লিষ্ট PO-গুলোর সঠিক মোট পরিমাণ প্রদর্শন করা হয়েছে, PO Allocation Count বাদ দেওয়া হয়েছে এবং Budget Value-কে Pre Cost Value নামে পরিবর্তন করা হয়েছে; সেকশন C-এর নাম 'Item-wise Budget vs. Booking Comparison' করা হয়েছে, Color, Size, Budget Qty, Budget Unit, Budget Rate এবং Quantity Variance বাদ দেওয়া হয়েছে, Style-এর পরেই 'Pre Cost Item' কলাম যোগ করে এস্টিমেশন ও প্রি-কস্টিং থেকে আইটেম ম্যাপিং ও ফলব্যাক নিশ্চিত করা হয়েছে, Budget Value-কে 'Pre Costing Value' করা হয়েছে এবং কালার ও সাইজভিত্তিক বুকিং রো-গুলোকে প্রি-কস্ট আইটেম অনুযায়ী একত্রিত করে বাজেট ভ্যালু পুনরাবৃত্তি ছাড়া প্রদর্শন করা হয়েছে; সেকশন D-এর নাম 'Workflow & Approval History' করা হয়েছে এবং বিদ্যমান অনুমোদন হিস্ট্রি ও অ্যাকশন ডায়ালগ সম্পূর্ণ অক্ষুণ্ণ রাখা হয়েছে।"
  },
  {
    "id": "598",
    "date": "2026-10-24T12:05",
    "type": "Update Fabric Booking Approval Register and Details Form",
    "module": "Marketing & Merchandising / Booking Information",
    "link": "/mm-fabric-booking-approval",
    "descriptionEn": "Updated Fabric Booking Approval Register (/mm-fabric-booking-approval) and Details Form (/mm-fabric-booking-approval-details): (1) Register Columns: Removed Fabric Items column; separated Booking Qty and Supplier into distinct columns; added a separate Value column displaying actual booking value calculated from saved booking detail rows; renamed Budget Value to Pre Cost Value displaying the pre-costing budget value linked to the booking's job, style, and items without double counting; (2) Clean Details Header: Removed introductory descriptive subtitle ('Dedicated authorization review, budget comparison, and approval history') from the details page; (3) Section A — Fabric Booking Information: Renamed section title to 'Fabric Booking Information'; renamed 'Job ID / Our Ref' to 'Job ID'; removed 'PI Reference' field completely from Section A without affecting PI data elsewhere; (4) Section B — Style & PO Summary: Renamed section title to 'Style & PO Summary'; added 'PO QTY' column immediately after Associated PO Details displaying the accurate sum of quantities of all POs associated with the style from saved order and breakdown records (counting each PO quantity once); removed 'PO Allocation Count' column; (5) Section C — Item-wise Budget vs. Booking Comparison: Renamed section title to 'Item-wise Budget vs. Booking Comparison'; removed Color and Fabric Code columns; added 'Pre Cost Item' column immediately after Style showing the authentic mapped pre-cost item name from estimation and pre-costing records with 'Pre-Cost Item Not Linked' fallback; renamed Budget Value to Pre Costing Value; removed Budget Qty, Budget Unit, Budget Rate, and Quantity Variance columns; enforced Color Aggregation Rule by consolidating color-wise booking rows into pre-cost items without duplicating pre-costing budget values; retained Total Booked Qty, Booked Rate, Booked Value, and Value Variance; (6) Section D — Workflow & Approval History: Renamed section title to 'Workflow & Approval History' while preserving all existing approval actions, modal confirmation flows, and history logs.",
    "descriptionBn": "Fabric Booking Approval Register (/mm-fabric-booking-approval) এবং Details Form (/mm-fabric-booking-approval-details)-এ প্রয়োজনীয় আপডেট সম্পন্ন: (১) ফেব্রিক বুকিং অ্যাপ্রুভাল রেজিস্টার কলাম বিন্যাস: Fabric Items কলামটি অপসারণ করা হয়েছে; Booking Qty এবং Supplier দুটি আলাদা স্বতন্ত্র কলামে প্রদর্শন করা হয়েছে; বুকিং ডিটেইলস রো থেকে গণনাকৃত বুকিং মূল্যের জন্য একটি পৃথক Value কলাম যুক্ত করা হয়েছে; Budget Value কলামটির নাম পরিবর্তন করে Pre Cost Value রাখা হয়েছে যাতে ডাবল-কাউন্টিং ছাড়া প্রকৃত প্রি-কস্টিং বাজেট প্রদর্শিত হয়; (২) ডিটেইলস হেডার পরিচ্ছন্নকরণ: ডিটেইলস পেজের উপরের পরিচিতিমূলক টেক্সট ('Dedicated authorization review, budget comparison, and approval history') বাদ দেওয়া হয়েছে; (৩) সেকশন A — Fabric Booking Information: সেকশনের নাম পরিবর্তন করে 'Fabric Booking Information' করা হয়েছে; 'Job ID / Our Ref' ফিল্ডটিকে শুধু 'Job ID' নামে নামকরণ করা হয়েছে; এবং PI ডেটা অক্ষুণ্ণ রেখে এই ফর্ম থেকে 'PI Reference' ফিল্ডটি সম্পূর্ণরূপে বাদ দেওয়া হয়েছে; (৪) সেকশন B — Style & PO Summary: সেকশনের নাম পরিবর্তন করে 'Style & PO Summary' করা হয়েছে; Associated PO Details কলামের ঠিক পরেই নতুন 'PO QTY' কলাম যুক্ত করে সংশ্লিষ্ট PO-গুলোর সঠিক মোট পরিমাণ (প্রতিটি PO-এর পরিমাণ একবার গণনা করে) প্রদর্শনের ব্যবস্থা করা হয়েছে; এবং 'PO Allocation Count' কলামটি সরিয়ে নেওয়া হয়েছে; (৫) সেকশন C — Item-wise Budget vs. Booking Comparison: সেকশনের নাম পরিবর্তন করে 'Item-wise Budget vs. Booking Comparison' করা হয়েছে; Color এবং Fabric Code কলাম অপসারণ করা হয়েছে; Style-এর ঠিক পরেই 'Pre Cost Item' কলাম যোগ করে এস্টিমেশন ও প্রি-কস্টিংয়ের ম্যাপিং অনুযায়ী প্রকৃত আইটেমের নাম প্রদর্শন এবং ফলব্যাক হিসেবে 'Pre-Cost Item Not Linked' ব্যবস্থা রাখা হয়েছে; Budget Value-কে 'Pre Costing Value' নামে পরিবর্তন করা হয়েছে; Budget Qty, Budget Unit, Budget Rate ও Quantity Variance বাদ দেওয়া হয়েছে; কালারভিত্তিক রো-গুলোকে প্রি-কস্ট আইটেম অনুযায়ী একত্রিত (aggregate) করে বাজেট ভ্যালু পুনরাবৃত্তি না হওয়ার নিশ্চয়তা দেওয়া হয়েছে এবং Total Booked Qty, Booked Rate, Booked Value ও Value Variance বজায় রাখা হয়েছে; (৬) সেকশন D — Workflow & Approval History: সেকশনের নাম পরিবর্তন করে 'Workflow & Approval History' করা হয়েছে এবং বিদ্যমান অনুমোদন ওয়ার্কফ্লো, কমেন্ট ও হিস্ট্রি সম্পূর্ণ অক্ষুণ্ণ রাখা হয়েছে।"
  },
  {
    "id": "597",
    "date": "2026-10-24T00:05",
    "type": "Workflow & Navigation Fixes: Booking Submission, Hyperlinks, Consolidated Budget Comparison & Approval Comments",
    "module": "Marketing & Merchandising / Booking Information",
    "link": "/mm-fabric-booking",
    "descriptionEn": "Implemented comprehensive workflow, navigation, budget comparison, and approval enhancements across Fabric and Accessories Booking modules: (1) Booking Form Submit Workflow: Added prominent 'Submit for Approval' action buttons in both Fabric Booking (/mm-fabric-booking) and Accessories Booking (/mm-accessories-booking) forms; enforces Draft (default on save) -> Submit (validates supplier, delivery date, item rates and quantities, updates status to Pending, logs submission timestamp and user, and creates audit entry) workflow feeding directly into the Approval Pending queue; allows editing and re-submission when Returned, while locking Approved and Pending bookings with status banners; (2) Booking Number Direct Link Navigation: Clicking Fabric Booking No. in Fabric Booking Approval and Fabric Booking Register now navigates directly to the Fabric Booking Form (/mm-fabric-booking?bookingId=...), and clicking Accessories Booking No. in Accessories Booking Approval and Register opens the Accessories Booking Form (/mm-accessories-booking?bookingId=...); (3) Action -> View Navigation: Action -> View buttons consistently route to the dedicated Approval Details pages (/mm-fabric-booking-approval-details and /mm-accessories-booking-approval-details); (4) Consolidated Item-wise Budget vs. Booking Comparison: Replaced separate detail and comparison sections with a unified side-by-side 17-column comparison table (Job ID, Style, Item, Description, Color, Size/Width, Budget Qty/Unit/Rate/Value, Booked Qty/Unit/Rate/Value, Quantity Variance, Value Variance, and Status Badges) complete with a Grand Total summary row; (5) Optional Approval Comments: Added an optional comments textarea to the Approve Confirmation dialog on both approval details pages, saving comments to the approval history log; (6) Strict Data Integrity: Preserved authentic persisted booking records without dummy or placeholder data.",
    "descriptionBn": "Fabric এবং Accessories Booking মডিউলে পূর্ণাঙ্গ ওয়ার্কফ্লো, নেভিগেশন, বাজেট তুলনা ও অনুমোদন সুবিধা সংস্কার: (১) বুকিং ফর্ম সাবমিট ওয়ার্কফ্লো: Fabric Booking (/mm-fabric-booking) এবং Accessories Booking (/mm-accessories-booking) ফর্মদ্বয়ে সুস্পষ্ট 'Submit for Approval' বাটন সংযোজন; খসড়া (Draft) থেকে সাবমিট (সাপ্লায়ার, ডেলিভারি তারিখ, আইটেম রেট ও পরিমাণ যাচাই করে স্ট্যাটাস Pending করা, জমাদানের সময় ও ব্যবহারকারী সংরক্ষণ করা এবং অডিট হিস্ট্রি রেকর্ড করা) ওয়ার্কফ্লো নিশ্চিত করা হয়েছে যা সরাসরি অ্যাপ্রুভাল পেন্ডিং তালিকায় যুক্ত হয়; অনুমোদিত (Approved) ও পেন্ডিং বুকিং এডিট বন্ধ রাখা হয়েছে এবং প্রত্যাখ্যাত/ফেরত (Returned) বুকিং পুনরায় সংশোধন ও সাবমিট করার ব্যবস্থা রাখা হয়েছে; (২) বুকিং নম্বরে সরাসরি লিঙ্ক নেভিগেশন: Fabric Approval ও Register ফর্মে Booking No.-এ ক্লিক করলে সরাসরি মূল Fabric Booking ফর্ম ওপেন হয় এবং Accessories Approval ও Register ফর্মে Booking No.-এ ক্লিক করলে মূল Accessories Booking ফর্ম ওপেন হয়; (৩) Action -> View নেভিগেশন: উভয় অ্যাপ্রুভাল ও রেজিস্টার পেজে Actions কলামের 'View' বাটনে ক্লিক করলে ডেডিকেটেড Approval Details পেজ ওপেন হয়; (৪) সমন্বিত বাজেট ও বুকিং তুলনা টেবিল: পৃথক সেকশন C ও D-এর পরিবর্তে একটি একক ১৭-কলামের আইটেমভিত্তিক সাইড-বাই-সাইড তুলনা টেবিল ও গ্র্যান্ড টোটাল সামারি রো যুক্ত করা হয়েছে যাতে বাজেট বনাম বুকড পরিমাণ, রেট, ভ্যালু, ভ্যারিয়েন্স ও স্ট্যাটাস ব্যাজ সুস্পষ্টভাবে প্রদর্শিত হয়; (৫) অনুমোদনে ঐচ্ছিক মন্তব্য ফিল্ড: উভয় অ্যাপ্রুভাল ডিটেইলস পেজের Approve Confirmation ডায়ালগে একটি ঐচ্ছিক Comments টেক্সটবক্স যুক্ত করা হয়েছে যা মন্তব্য থাকলে তা অ্যাপ্রুভাল হিস্ট্রিতে রেকর্ড করে; (৬) কঠোর ডেটা শুদ্ধতা: ডামি বা মক ডেটা ছাড়া ব্যবহারকারীর প্রকৃত সংরক্ষিত বুকিং রেকর্ড ও ডেটা নির্ভরতা অক্ষুণ্ণ রাখা হয়েছে।"
  },
  {
    "id": "596",
    "date": "2026-10-23T23:05",
    "type": "Bug Fix & Data Integrity: Booking Approval and Register Navigation & Details Rendering",
    "module": "Marketing & Merchandising / Booking Information",
    "link": "/mm-fabric-booking-approval",
    "descriptionEn": "Resolved navigation and page-loading errors across Fabric Booking Approval, Accessories Booking Approval, Fabric Booking Register, and Accessories Booking Register while enforcing strict data integrity: (1) Root Cause Resolution: Identified and eliminated runtime TypeErrors caused by unhandled undefined properties (such as bookedRate, bookedQty, rate, bookQty) in item arrays and budget comparison sections of the dedicated details pages (/mm-fabric-booking-approval-details and /mm-accessories-booking-approval-details); (2) Seamless Booking No. & View Navigation: Standardized declarative routing for both Booking No. links and View action buttons across all four forms, passing the booking identifier and supporting URL decoding with robust multi-field ID/bookingNo lookup; (3) Graceful Record Not Found Handling: Replaced generic crash/error boundary screens with an elegant 'Booking record not found' view featuring clear messaging and direct navigation back to both Approval and Register forms when an invalid or deleted booking identifier is requested; (4) Strict Data Integrity & Zero Dummy Data: Removed automatic seeding and sample dummy booking data injection (INITIAL_MM_FABRIC_BOOKINGS and INITIAL_MM_ACCESSORIES_BOOKINGS) from MMRepository getters, ensuring all four forms display strictly genuine, user-saved booking records; (5) Automatic Legacy Dummy Purging: Purged legacy dummy booking records from Local Storage while preserving 100% of authentic saved bookings and relationships; (6) Clean Empty States: Added informative, professional empty state indicators ('No Fabric Bookings Found', 'No Accessories Bookings Found') across all registers when no bookings exist.",
    "descriptionBn": "Confirm Order Entry-এর Booking Information-এর অধীনে ৪টি ফর্ম (Fabric Booking Approval, Accessories Booking Approval, Fabric Booking Register, Accessories Booking Register)-এ নেভিগেশন ও পেজ লোডিং ত্রুটি সমাধান এবং কঠোর ডেটা শুদ্ধতা নিশ্চিতকরণ: (১) মূল ত্রুটির সমাধান: ডেডিকেটেড ডিটেইলস পেজদ্বয়ে (/mm-fabric-booking-approval-details ও /mm-accessories-booking-approval-details) আইটেম অ্যারে এবং বাজেট তুলনা সেকশনে আনডিফাইন্ড প্রোপার্টি (যেমন bookedRate, bookedQty, rate, bookQty)-এর কারণে ঘটে যাওয়া রানটাইম টাইপ-এরর সম্পূর্ণ দূর করা হয়েছে; (২) নির্ভুল Booking No. ও View নেভিগেশন: চারটি ফর্মেই Booking No. লিঙ্ক ও View অ্যাকশন বাটনের মাধ্যমে ডিটেইলস পেজে যাওয়ার ডিক্লেয়ারেটিভ রাউটিং নিশ্চিত করা হয়েছে, যেখানে আইডি ও বুকিং নম্বর ডিকোড করে নিখুঁতভাবে সংশ্লিষ্ট সেভড বুকিং রেকর্ড লোড হয়; (৩) রেকর্ড নট ফাউন্ড হ্যান্ডলিং: কোনো অবৈধ বা ডিলিট হওয়া আইডি দিয়ে পেজে প্রবেশ করলে কোনো এরর পেজ বা ক্র্যাশ না দেখিয়ে সুন্দর 'Booking record not found' স্ক্রিন প্রদর্শিত হয় এবং অনুমোদন ও রেজিস্টার ফর্মে নিরাপদে ফিরে আসার বাটন প্রদান করা হয়েছে; (৪) ডামি ডেটা সম্পূর্ণ বর্জন: MMRepository থেকে স্বয়ংক্রিয়ভাবে স্যাম্পল বা ডামি বুকিং ডেটা (INITIAL_MM_FABRIC_BOOKINGS ও INITIAL_MM_ACCESSORIES_BOOKINGS) ইনজেক্ট করা পুরোপুরি বন্ধ করা হয়েছে, ফলে শুধুমাত্র ব্যবহারকারীর সফলভাবে সেভ করা প্রকৃত বুকিং প্রদর্শিত হয়; (৫) পুরনো ডামি বুকিং পরিচ্ছন্নকরণ: লোকাল স্টোরেজে পূর্বে জমা থাকা ডামি বুকিং রেকর্ডগুলো স্বয়ংক্রিয়ভাবে ফিল্টার করে মুছে ফেলা হয়েছে (প্রকৃত বুকিং সম্পূর্ণ অক্ষুণ্ণ রেখে); (৬) পরিচ্ছন্ন এম্পটি স্টেট: কোনো বুকিং না থাকলে প্রতিটি ফর্মে পরিচ্ছন্ন 'No Fabric Bookings Found' বা 'No Accessories Bookings Found' মেসেজ প্রদর্শিত হয়।"
  },
  {
    "id": "595",
    "date": "2026-10-23T22:20",
    "type": "Booking Information Menu — Fabric & Accessories Booking Approval and Registers with Multi-Selection & PI Creation",
    "module": "Marketing & Merchandising / Booking Information",
    "link": "/mm-fabric-booking-approval",
    "descriptionEn": "Implemented the complete Booking Information parent menu with 4 dedicated functional pages and end-to-end Proforma Invoice (PI) integration: (1) Sidebar Hierarchy: Added new parent menu 'Booking Information' under Confirm Order Entry featuring Fabric Booking Approval (/mm-fabric-booking-approval), Accessories Booking Approval (/mm-accessories-booking-approval), Fabric Booking Register (/mm-fabric-booking-register), and Accessories Booking Register (/mm-accessories-booking-register); (2) Booking Approval Pages: Dedicated approval registers for Fabric and Accessories with dynamic status tabs (Pending, Approved, Rejected, Returned, All), style/job summaries, quantities, booking value, budget value, and favorable/unfavorable variance calculations; (3) Dedicated Approval Details Pages: Full-screen details pages (/mm-fabric-booking-approval-details and /mm-accessories-booking-approval-details) featuring Section A (Booking Info), Section B (Style/PO Summary), Section C (Booking Details), Section D (Budget Comparison), and Section E (Approval History) with modal authorization dialogs for Approve, Reject (with required reason), and Return (with required correction comment); (4) Central Booking Registers: Central registers for Fabric and Accessories with multi-column filters, search, and dynamic status tabs; (5) Same-Supplier Multi-Selection: Enabled checkboxes strictly on Approved bookings, enforcing same-supplier locking with clear cross-supplier warning messages, Select All Eligible, and Clear Selection controls; (6) Proforma Invoice Integration: Prominent 'Create Proforma Invoice' action dynamically populates all selected bookings and combined detail lines into the PI Entry Form (/mm-proforma-invoice-create) with supplier consolidation and total calculation without duplicate lines.",
    "descriptionBn": "মার্কেটিং অ্যান্ড মার্চেন্ডাইজিং মডিউলে নতুন 'Booking Information' প্যারেন্ট মেনু এবং ৪টি পূর্ণাঙ্গ ফাংশনাল পেজ সহ প্রোফরমা ইনভয়েস (PI) ইন্টিগ্রেশন সম্পন্ন: (১) সাইডবার মেনু বিন্যাস: 'Confirm Order Entry'-এর নিচে নতুন প্যারেন্ট মেনু 'Booking Information' যুক্ত করা হয়েছে যাতে রয়েছে Fabric Booking Approval (/mm-fabric-booking-approval), Accessories Booking Approval (/mm-accessories-booking-approval), Fabric Booking Register (/mm-fabric-booking-register) এবং Accessories Booking Register (/mm-accessories-booking-register); (২) বুকিং অনুমোদন পেজ: ফেব্রিক ও অ্যাক্সেসরিজের জন্য ডেডিকেটেড অ্যাপ্রুভাল রেজিস্টার যেখানে স্ট্যাটাস ট্যাব (Pending, Approved, Rejected, Returned, All), স্টাইল/জব সামারি, পরিমাণ, বুকিং মূল্য, বাজেট মূল্য ও অনুকূল/প্রতিকূল ভ্যারিয়েন্স প্রদর্শিত হয়; (৩) ডেডিকেটেড অ্যাপ্রুভাল ডিটেইলস পেজ: ফুল-স্ক্রিন ডিটেইলস পেজ (/mm-fabric-booking-approval-details ও /mm-accessories-booking-approval-details) যেখানে সেকশন A (বুকিং তথ্য), B (স্টাইল ও PO সামারি), C (ডিটেইলস রো), D (বাজেট তুলনা) ও E (অ্যাপ্রুভাল হিস্ট্রি) রয়েছে এবং Approve, Reject (বাধ্যতামূলক কারণসহ) ও Return (বাধ্যতামূলক সংশোধন মন্তব্যসহ) করার ব্যবস্থা রয়েছে; (৪) কেন্দ্রীয় বুকিং রেজিস্টার: ফেব্রিক ও অ্যাক্সেসরিজ বুকিং ব্রাউজ ও পরিচালনার জন্য মাল্টি-ফিল্টার এবং সার্চ সহ সেন্ট্রাল রেজিস্টার; (৫) একই সাপ্লায়ারের মাল্টি-সিলেকশন: শুধুমাত্র Approved বুকিংগুলোর জন্য চেকবক্স সক্রিয় থাকে এবং একই সাপ্লায়ারের অধীনে একাধিক বুকিং নির্বাচন নিশ্চিত করে ভিন্ন সাপ্লায়ারের বুকিং নির্বাচন আটকে দেয়; (৬) PI তৈরির স্বয়ংক্রিয় ইন্টিগ্রেশন: 'Create Proforma Invoice' বাটনে ক্লিক করলে নির্বাচিত সকল অনুমোদিত বুকিং ও সেগুলোর আইটেম বিস্তারিত PI Entry ফর্মে (/mm-proforma-invoice-create) সমন্বিত হয়ে স্বয়ংক্রিয়ভাবে লোড হয়।"
  },
  {
    "id": "594",
    "date": "2026-10-23T21:20",
    "type": "Accessories Estimation & Register Booking Logic Fix + Fabric Estimation Register Enhancements",
    "module": "Marketing & Merchandising / Estimation & Booking Registers",
    "link": "/mm-accessories-estimation-register",
    "descriptionEn": "Corrected automatic dummy booking number generation and booking status resolution across Accessories Estimation and the Accessories Estimation Register, alongside key workflow enhancements to the Fabric Estimation Register: (1) Accessories Dummy Booking Prevention: Prevented automatic booking number assignment or placeholder creation during Accessories Estimation creation, saving, editing, or reopening; Booking No is read-only and remains empty until an actual Accessories Booking is saved; (2) Authentic Accessories Booking Status: Items in the Accessories Estimation Register default to 'Not Booked' (Book No: '—', Book Qty: 0) unless an actual saved Accessories Booking contains that exact estimation item ID; (3) Clean Orphan Accessories Booking Numbers: Automatically detects and purges dummy or orphaned booking numbers from Local Storage estimations while preserving genuine saved bookings; (4) Dynamic 'View Booking' vs 'Booking' in Both Registers: Register action buttons dynamically display 'View Booking' for booked items (opening the saved booking in view mode) and 'Booking' for unbooked items; (5) Fabric Register Color D Modal Clean-Up: Removed the '+ Add Row' button from the Fabric Color Details Specification modal when accessed via the register's Color D button while preserving all saved color mappings; (6) Fabric Register View Action: Clicking 'View' in the Fabric Estimation Register opens the actual saved Fabric Estimation in Order Entry with Job ID, fabric items, consumption, calculations, and colors loaded, supporting seamless return navigation.",
    "descriptionBn": "Accessories Estimation ও Accessories Estimation Register-এ স্বয়ংক্রিয় ডামি বুকিং নম্বর জেনারেশন ও স্ট্যাটাস লজিক সংশোধন এবং Fabric Estimation Register-এ গুরুত্বপূর্ণ আধুনিকায়ন: (১) অ্যাক্সেসরিজ ডামি বুকিং বন্ধকরণ: অ্যাক্সেসরিজ এস্টিমেশন তৈরি, সেভ বা এডিট করার সময় কোনো প্রকার ডামি বা স্বয়ংক্রিয় বুকিং নম্বর তৈরি হওয়া সম্পূর্ণ বন্ধ করা হয়েছে; কমার্শিয়াল তথ্যের 'Booking No.' ফিল্ডটি রিড-অনলি রাখা হয়েছে এবং প্রকৃত বুকিং না হওয়া পর্যন্ত এটি খালি থাকবে; (২) সঠিক বুকিং স্ট্যাটাস নির্ধারণ: Accessories Estimation Register-এ আনবুকড আইটেমগুলো এখন সঠিকভাবে 'Not Booked' (Book No: '—' ও Book Qty: 0) হিসেবে প্রদর্শিত হবে; কেবলমাত্র MMRepository-তে সংরক্ষিত প্রকৃত বুকিং রেকর্ডের সাথে সুনির্দিষ্ট আইটেম আইডি লিংক থাকলেই তা বুকড হিসেবে চিহ্নিত হবে; (৩) ডামি বুকিং নম্বর স্বয়ংক্রিয় পরিচ্ছন্নকরণ: লোকাল স্টোরেজে থাকা আগের যেসকল অ্যাক্সেসরিজ এস্টিমেশনে কোনো বৈধ সেভড বুকিং ছাড়াই ভুলবশত বুকিং নম্বর ছিল, সেগুলো স্বয়ংক্রিয়ভাবে শনাক্ত করে মুছে ফেলার নিরাপদ ক্লিনআপ ব্যবস্থা যুক্ত করা হয়েছে; (৪) উভয় রেজিস্টারে ডায়নামিক 'View Booking' ও 'Booking' বাটন: প্রকৃত বুকিং সম্পন্ন হওয়া আইটেমের জন্য 'View Booking' (যা সংশ্লিষ্ট বুকিংটি ভিউ মোডে খোলে) এবং আনবুকড আইটেমের জন্য 'Booking' বাটন প্রদর্শিত হয়; (৫) ফেব্রিক রেজিস্টার Color D মডাল সংস্কার: রেজিস্টারের Color D বাটনে ক্লিক করলে যে মডাল খোলে সেখান থেকে '+ Add Row' বাটনটি অপসারণ করা হয়েছে (সংরক্ষিত কালার রো সম্পূর্ণ অক্ষুণ্ণ রেখে); (৬) ফেব্রিক রেজিস্টার View অ্যাকশন: Fabric Estimation Register-এর Actions কলামের 'View' বাটনে ক্লিক করলে Order Entry-তে সংশ্লিষ্ট জব ও স্টাইলের মূল সেভড Fabric Estimation ফর্মটি সমস্ত ডেটাসহ লোড হয় এবং সহজে পুনরায় রেজিস্টারে ফিরে আসার ব্যবস্থা নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "593",
    "date": "2026-10-23T20:50",
    "type": "Fabric Estimation & Register — Fix Automatic Dummy Booking Number Generation & Status Logic",
    "module": "Marketing & Merchandising / Fabric Estimation & Booking",
    "link": "/mm-fabric-estimation-register",
    "descriptionEn": "Corrected automatic dummy booking number generation and booking status resolution in Fabric Estimation and the Fabric Estimation Register: (1) Eliminated Automatic Dummy Booking Numbers: Prevented automatic creation, assignment, or placeholder generation of booking numbers when creating, saving, editing, or reopening Fabric Estimations; the Booking No field in Commercial References is now strictly read-only and reserved until an actual Fabric Booking is created; (2) Authentic Booking-Status Verification: In the Fabric Estimation Register, items are now classified as 'Not Booked' by default (displaying '—' for Book No and 0 Book Qty) unless linked to an actual, successfully saved Fabric Booking in MMRepository; (3) Precise Estimation-to-Booking Linkage: Refined booking resolution logic to match strictly by fabric estimation item ID (fabricEstimationItemId) rather than broad fabric codes, eliminating cross-item false 'Booked' statuses; (4) Automatic Orphan Booking Number Purge: Implemented automated cleanup of dummy or orphan booking numbers in existing Local Storage estimations where no actual saved fabric booking exists, while preserving genuine booking records; (5) Preserved Same-Supplier Workflow: Retained full support for combining multiple estimation items into a single booking under the same supplier with dynamic status updates upon saving.",
    "descriptionBn": "Fabric Estimation এবং Fabric Estimation Register-এ স্বয়ংক্রিয় ডামি বুকিং নম্বর জেনারেশন ও বুকিং স্ট্যাটাসের ভুল লজিক সংশোধন: (১) স্বয়ংক্রিয় ডামি বুকিং নম্বর বন্ধকরণ: ফ্যাব্রিক এস্টিমেশন তৈরি, সেভ বা এডিট করার সময় কোনো প্রকার ডামি, প্রি-ফিল্ড বা স্বয়ংক্রিয় বুকিং নম্বর তৈরি হওয়া সম্পূর্ণ বন্ধ করা হয়েছে; কমার্শিয়াল রেফারেন্সের 'Booking No.' ফিল্ডটি এখন কেবল রিড-অনলি রাখা হয়েছে এবং প্রকৃত বুকিং না হওয়া পর্যন্ত এটি খালি থাকবে; (২) নির্ভুল বুকিং স্ট্যাটাস নির্ধারণ: Fabric Estimation Register-এ নতুন বা অবুকড আইটেমগুলো এখন সঠিকভাবে 'Not Booked' (Book No: '—' ও Book Qty: 0) হিসেবে প্রদর্শিত হবে; যতক্ষণ না MMRepository-তে একটি বৈধ ও সংরক্ষিত Fabric Booking রেকর্ড থাকবে, ততক্ষণ কোনো আইটেম বুকড হবে না; (৩) নির্দিষ্ট আইটেম আইডি লিঙ্কিং: সাধারণ ফ্যাব্রিক কোডের পরিবর্তে সুনির্দিষ্ট আইটেম আইডি (fabricEstimationItemId) দিয়ে বুকিং ভ্যালিডেশন করায় এক আইটেমের বুকিংয়ের কারণে অন্য আইটেম বুকড দেখানোর সমস্যা দূর হয়েছে; (৪) ডামি বুকিং নম্বর স্বয়ংক্রিয়ভাবে মুছে ফেলা: লোকাল স্টোরেজে থাকা আগের যেসকল এস্টিমেশনে কোনো বৈধ সেভড বুকিং ছাড়াই ভুলবশত বুকিং নম্বর যুক্ত হয়েছিল, সেগুলো স্বয়ংক্রিয়ভাবে শনাক্ত করে মুছে ফেলার নিরাপদ ক্লিনআপ ব্যবস্থা চালু করা হয়েছে (প্রকৃত বুকিং অক্ষুণ্ণ রেখে); (৫) সেইম-সাপ্লায়ার ওয়ার্কফ্লো বজায় রাখা: একই সাপ্লায়ারের একাধিক এস্টিমেশন আইটেম একত্র করে বুকিং করা এবং বুকিং সফলভাবে সেভ করার পর রেজিস্টারে স্ট্যাটাস ও বুকিং নম্বর আপডেট হওয়ার স্বাভাবিক নিয়ম অক্ষুণ্ণ রয়েছে।"
  },
  {
    "id": "592",
    "date": "2026-10-23T20:25",
    "type": "Fabric Estimation Register — UI Improvements, Original Color Details Modal & Same-Supplier Multi-Item Booking",
    "module": "Marketing & Merchandising / Fabric Estimation & Booking",
    "link": "/mm-fabric-estimation-register",
    "descriptionEn": "Implemented comprehensive UI improvements, interactive color detail specification modal, and same-supplier multi-item booking workflow for the Fabric Estimation Register: (1) Column Header & Serial Clean-Up: Removed numerical prefixes from all column headers, eliminated redundant serial columns while retaining the clean SL column, and placed the selection checkbox column directly to the left of SL; (2) Original Fabric Color Detail 'D' Modal: Replaced static color text with the interactive 'D ({count})' button that opens the original Fabric Estimation Color Details specification modal supporting DTM, Contrast, and Single Color with uniform 'P' population, garment color mapping grid, breakdown color import, add/remove row, and safe viewing/editing with MMRepository LocalStorage persistence; (3) KPI Cards Removal: Removed all 6 KPI cards (Fabric Items, Required Fabric, Est. Total Value, Total Booked, Fully Booked, Booking Progress) to maximize register layout space; (4) Dynamic Booking Status Filter Tabs: Added segmented tabs ('All', 'Booked', 'Not Booked') with dynamic live item counts operating simultaneously with dropdown and search filters; (5) Same-Supplier Multi-Item Selection & Validation: Added selection checkboxes restricted strictly to eligible items from the same supplier, blocking cross-supplier selections with an explanatory toast notification, supported by 'Select All Eligible' and 'Clear Selection' actions; (6) Integrated Multi-Item Fabric Booking Workflow: Staged all selected items across single or multiple jobs/styles into the Fabric Booking form (/mm-fabric-booking) creating distinct booking detail rows with the supplier locked, query fallback reconstruction, and automatic bidirectional synchronization updating booking references and statuses in the estimation register upon save.",
    "descriptionBn": "Fabric Estimation Register-এ সামগ্রিক ইউআই আধুনিকায়ন, আসল কালার ডিটেইলস মডাল ও একই সাপ্লায়ারের মাল্টি-আইটেম বুকিং সুবিধা বাস্তবায়ন: (১) কলাম হেডার পরিচ্ছন্নকরণ: টেবিল হেডার থেকে সকল সংখ্যাসূচক প্রিফিক্স অপসারণ করা হয়েছে, মূল SL কলাম অক্ষুণ্ণ রেখে অপ্রয়োজনীয় সিরিয়াল বাদ দেওয়া হয়েছে এবং SL কলামের ঠিক বামে সিলেকশন চেকবক্স কলাম যুক্ত করা হয়েছে; (২) আসল ফ্যাব্রিক কালার ডিটেইল 'D' মডাল: সাধারণ কালার টেক্সটের পরিবর্তে আসল 'D ({count})' বাটন যুক্ত করা হয়েছে; এতে ক্লিক করলে Fabric Estimation-এর আসল Color Details Specification মডাল খোলে (যাতে DTM, Contrast ও Single Color-এর সাথে 'P' পপুলেট বোতাম, গার্মেন্ট কালার ম্যাপিং টেবিল, অর্ডার ব্রেকডাউন থেকে কালার ইমপোর্ট এবং রো যোগ/বিয়োগ করার পূর্ণ সুবিধা রয়েছে); কেবল দেখলে বা বন্ধ করলে ডেটা অপরিবর্তিত থাকে এবং সেভ করলে তা MMRepository লোকাল স্টোরেজে সংরক্ষিত হয়; (৩) কেপিআই কার্ড অপসারণ: রেজিস্টারের টেবিলের জায়গা বাড়াতে ৬টি কেপিআই কার্ড (Fabric Items, Required Fabric, Est. Total Value, Total Booked, Fully Booked, Booking Progress) সম্পূর্ণ সরিয়ে ফেলা হয়েছে; (৪) বুকিং স্ট্যাটাস ফিল্টার ট্যাব: রেজিস্টারের শীর্ষে ডায়নামিক কাউন্টসহ তিনটি সেগমেন্টেড ট্যাব ('All', 'Booked', 'Not Booked') যুক্ত করা হয়েছে যা অন্যান্য ড্রপডাউন ও সার্চ ফিল্টারের সাথে সমন্বিতভাবে কাজ করে; (৫) একই সাপ্লায়ারের মাল্টি-আইটেম সিলেকশন ও ভ্যালিডেশন: একই সাপ্লায়ারের এস্টিমেশন আইটেম নির্বাচনের জন্য চেকবক্স যোগ করা হয়েছে এবং ভিন্ন সাপ্লায়ারের আইটেম সিলেক্ট করলে সুস্পষ্ট সতর্কবার্তাসহ ব্লক করা হয়; সাথে 'Select All Eligible' ও 'Clear Selection' সুবিধা রাখা হয়েছে; (৬) সমন্বিত মাল্টি-আইটেম ফ্যাব্রিক বুকিং ওয়ার্কফ্লো: একাধিক জব বা স্টাইলের নির্বাচিত সকল আইটেম Fabric Booking ফর্মে পৃথক পৃথক বুকিং রো হিসেবে লোড হয়, সাপ্লায়ার ফিল্ড লক থাকে, রিলোড হলেও কোয়েরি থেকে স্বয়ংক্রিয় রিকনস্ট্রাকশন হয় এবং বুকিং সেভ করার সাথে সাথে মূল এস্টিমেশন রেজিস্টারে বুকিং রেফারেন্স ও বুকড স্ট্যাটাস আপডেট হয়ে যায়।"
  },
  {
    "id": "591",
    "date": "2026-10-23T18:50",
    "type": "Accessories Estimation Register — Restored Original Size & Color D Buttons & Multi-Item Booking Data Flow Fix",
    "module": "Marketing & Merchandising / Accessories Estimation & Booking",
    "link": "/mm-accessories-estimation-register",
    "descriptionEn": "Fixed two critical issues in the Accessories Estimation Register: (1) Restored Original Size and Color 'D' Detail Buttons: Replaced plain text summaries with the original interactive 'D ({count})' buttons identical to the Accessories Estimation entry form; clicking the Size D button opens the original Sizewise Item Specification Declaration modal (supporting 'SAME AS GMT SIZE' and 'SINGLE SIZE' with 'P' population, garment sizes, item specs, and calculations), and clicking the Color D button opens the original Accessories Color Entry modal (supporting 'DTM', 'Contrast', and 'Single Color' mappings); viewing or closing modals never alters estimation data, while saved updates persist cleanly; (2) Fixed Multi-Item Accessories Booking Data Flow: Completely resolved the single-item loss issue when creating an accessories booking from the register; all selected items under the shared supplier (including multiple styles/jobs) now reliably transfer into the Accessories Booking Summary Grid as separate booking detail rows; eliminated premature storage clearing and single-item query overwrites, added automatic item reconstruction fallback from rowIds, preserved all item quantities, rates, budget values, and size/color references, enforced the same-supplier rule with a read-only supplier field, and updated booking numbers and booking statuses in both the booking record and the estimation register upon save.",
    "descriptionBn": "Accessories Estimation Register-এর দুটি গুরুত্বপূর্ণ সমস্যার সফল সমাধান: (১) মূল Size ও Color 'D' বাটন ও মডাল পুনঃস্থাপন: সাধারণ টেক্সটের পরিবর্তে Accessories Estimation এন্ট্রি ফর্মের অনুরূপ আসল 'D ({count})' বাটন যুক্ত করা হয়েছে; Size কলামের D বাটনে ক্লিক করলে আসল Sizewise Item Specification Declaration মডাল খোলে (যাতে 'SAME AS GMT SIZE' ও 'SINGLE SIZE'-এর সাথে 'P' পপুলেট বোতাম, গার্মেন্ট সাইজ এবং হিসাব সংরক্ষিত থাকে) এবং Color কলামের D বাটনে ক্লিক করলে আসল Accessories Color Entry মডাল খোলে (যাতে DTM, Contrast ও Single Color ম্যাপিং প্রদর্শিত হয়); মডাল দেখলে বা বন্ধ করলে ডেটা নষ্ট হয় না এবং সেভ করলে তা লোকাল স্টোরেজে সংরক্ষিত হয়; (২) মাল্টি-আইটেম বুকিং ডেটা প্রবাহ সংশোধন: রেজিস্টার থেকে একাধিক আইটেম নির্বাচন করে বুকিং করার সময় একটি মাত্র আইটেম যাওয়ার সমস্যাটি পুরোপুরি দূর করা হয়েছে; একই সাপ্লায়ারের নির্বাচিত সকল আইটেম (বিভিন্ন স্টাইল বা জব আইডির হলেও) এখন সম্পূর্ণ ডেটাসহ Accessories Booking Summary Grid-এ পৃথক পৃথক রো হিসেবে লোড হয়; সেশন স্টোরেজ অকালে মুছে যাওয়া এবং সিঙ্গেল রো প্যারামিটার দ্বারা ওভাররাইট হওয়া রোধ করা হয়েছে, কোয়ান্টিটি, রেট, বাজেট ভ্যালু ও সাইজ/কালার অক্ষুণ্ণ রাখা হয়েছে, সেইম-সাপ্লায়ার বিধিনিষেধ বহাল রেখে সাপ্লায়ার ফিল্ড লক রাখা হয়েছে এবং বুকিং সেভ করার পর স্বয়ংক্রিয়ভাবে এস্টিমেশন রেজিস্টারে বুকিং নম্বর ও বুকড স্ট্যাটাস আপডেট হওয়ার ব্যবস্থা নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "590",
    "date": "2026-10-23T18:25",
    "type": "Marketing & Merchandising — Accessories Estimation Register Improvements & Same-Supplier Combined Booking",
    "module": "Marketing & Merchandising / Estimation & Booking Registers",
    "link": "/mm-accessories-estimation-register",
    "descriptionEn": "Completed key functional upgrades to the Accessories Estimation Register in the Marketing & Merchandising module: (1) Column Header Clean-Up: Removed the 1–22 numerical prefixes from all column headers (Buyer, Job ID / Our Ref, Style, Merchant, GMT Item, Order Qty, Item, Used Place, Description, Supplier, Consumption, Con. Unit, Wastage %, Required Qty, Est. Rate, Est. Value, Size, Color, Book No, Book Qty, Book Value, Booking Status), creating clean, modern labels; (2) Actual Size D & Color D Data Mapping: Linked the Size and Color table columns directly to the actual estimation detail data saved via the Size D and Color D modals (singleSizeSpec, sizeRows with garment sizes and item specifications, colorType, singleColorName, and colorMappings) with hover tooltips and zero cross-item merging; (3) Actual Related Booking Numbers: Populated the Book No column exclusively with valid associated accessories booking numbers from MMRepository, displaying '—' for unbooked items; (4) KPI Cards Removal: Removed all 6 KPI cards (Accessories Items, Required Units, Est. Total Value, Total Booked, Fully Booked, Booking Progress), reallocating layout space effectively to the register and filters; (5) Booking Status Segmented Filter: Added an instant segmented tab control ('All', 'Booked', 'Not Booked') with dynamic item counts that operates simultaneously with all dropdown and text search filters; (6) Multi-Item Selection & Same-Supplier Validation: Replaced the Size/Color action button with an item selection checkbox that allows selecting eligible not-booked items while strictly enforcing the same-supplier rule (restricting selection to items from the same supplier and blocking cross-supplier selections with explanatory feedback); (7) Select All & Deselect Controls: Added a smart 'Select All Eligible' control respecting the same-supplier constraint and active filters, alongside an instant 'Clear Selection' action; (8) Create Accessories Booking Action: Added a prominent 'Create Accessories Booking' action with floating selection bar that stages selected estimation items and opens Accessories Booking (/mm-accessories-booking) with pre-populated line items and the supplier locked.",
    "descriptionBn": "Marketing & Merchandising মডিউলের Accessories Estimation Register-এ গুরুত্বপূর্ণ আধুনিকায়ন এবং একই সাপ্লায়ারের মাল্টি-আইটেম কম্বাইন্ড বুকিং সুবিধা বাস্তবায়ন: (১) কলাম হেডার পরিচ্ছন্নকরণ: টেবিল হেডার থেকে ১ থেকে ২২ পর্যন্ত সকল সিরিয়াল নম্বর প্রিফিক্স (Buyer, Job ID / Our Ref, Style, Merchant, GMT Item, Order Qty, Item, Used Place, Description, Supplier, Consumption, Con. Unit, Wastage %, Required Qty, Est. Rate, Est. Value, Size, Color, Book No, Book Qty, Book Value, Booking Status) অপসারণ করে মানসম্মত আধুনিক লেবেল প্রদান করা হয়েছে; (২) সাইজ ও কালার তথ্যের নিখুঁত ম্যাপিং: Size D এবং Color D মডালের মাধ্যমে সেভ করা প্রকৃত এস্টিমেশন ডেটার সাথে সাইজ ও কালার কলাম সরাসরি সংযুক্ত করা হয়েছে (গার্মেন্ট সাইজ ও আইটেম স্পেক সংবলিত sizeRows, singleSizeSpec, কালার ম্যাপিং এবং কালার টাইপ) যাতে ক্রস-আইটেম ডেটা মার্জ না হয়; (৩) প্রকৃত বুকিং নম্বর প্রদর্শন: Book No কলামে কেবল সংশ্লিষ্ট এস্টিমেশন আইটেমের নিজস্ব বৈধ বুকিং নম্বর প্রদর্শনের ব্যবস্থা করা হয়েছে এবং আনবুকড আইটেমের জন্য সুস্পষ্ট '—' প্রদর্শন নিশ্চিত করা হয়েছে; (৪) কেপিআই কার্ড অপসারণ: ৬টি কেপিআই কার্ড (Accessories Items, Required Units, Est. Total Value, Total Booked, Fully Booked, Booking Progress) সম্পূর্ণ সরিয়ে টেবিল ও ফিল্টারের জন্য প্রয়োজনীয় জায়গা উন্মুক্ত করা হয়েছে; (৫) বুকিং স্ট্যাটাস ফিল্টার ট্যাব: রেজিস্টারের শীর্ষে আইটেম কাউন্টসহ তিনটি সেগমেন্টেড ট্যাব ('All', 'Booked', 'Not Booked') যোগ করা হয়েছে যা বিদ্যমান ড্রপডাউন ও সার্চ ফিল্টারের সাথে সমন্বিতভাবে কাজ করে; (৬) মাল্টি-আইটেম সিলেকশন ও সেইম-সাপ্লায়ার ভ্যালিডেশন: অ্যাকশন কলামের Size/Color বাটনটি প্রতিস্থাপন করে সিলেকশন চেকবক্স যুক্ত করা হয়েছে এবং কঠোরভাবে সেইম-সাপ্লায়ার নিয়ম কার্যকর করা হয়েছে (একই সাপ্লায়ারের আনবুকড আইটেম নির্বাচনযোগ্য এবং ভিন্ন সাপ্লায়ারের আইটেম সিলেক্ট করতে গেলে সতর্কবার্তা দিয়ে ব্লক করা হয়); (৭) সিলেক্ট অল ও ক্লিয়ার সিলেকশন: সেইম-সাপ্লায়ার সীমাবদ্ধতা বজায় রেখে সক্রিয় ফিল্টারের অধীনে আনবুকড আইটেমগুলো এক ক্লিকে নির্বাচনের জন্য 'Select All Eligible' এবং সিলেকশন মুক্ত করার জন্য 'Clear Selection' বাটন যোগ করা হয়েছে; (৮) ক্রিয়েট অ্যাক্সেসরিজ বুকিং অ্যাকশন: একাধিক আইটেম সিলেক্ট করার পর ভাসমান বারসহ 'Create Accessories Booking' বাটন যুক্ত করা হয়েছে যা সিলেক্টেড আইটেমগুলোর তথ্য স্বয়ংক্রিয়ভাবে Accessories Booking ফর্মে নিয়ে যায় এবং সাপ্লায়ারকে লক করে রাখে।"
  },
  {
    "id": "589",
    "date": "2026-10-23T17:25",
    "type": "Marketing & Merchandising — Confirm Order Menu Restructuring, Fabric Estimation Register & Accessories Estimation Register",
    "module": "Marketing & Merchandising / Estimation & Booking Registers",
    "link": "/mm-fabric-estimation-register",
    "descriptionEn": "Implemented major estimation register enhancements and Confirm Order Entry sidebar menu restructuring in the Marketing & Merchandising module: (1) Confirm Order Entry Sidebar Restructuring: Removed 'New Confirm Order' and 'PO & Breakdown Reconciliation' from visible navigation, renamed 'Main Order Register' to 'Confirm Order' (/mm-order-entry), and added direct navigation to the two new registers ('Fabric Estimation Register' and 'Accessories Estimation Register'); (2) Fabric Estimation Register (/mm-fabric-estimation-register): Implemented the full register displaying all saved fabric estimation items created through the Fabric Estimation form, adhering to the 22-column specification (Buyer, Job ID, Style, Merchant, GMT Item, Order Qty, Fabric Item, Used Place, Fabric Description, Supplier, Consumption, Unit, Wastage %, Required Qty, Est. Rate, Est. Value, Width, Fabric Color, Book No, Book Qty, Book Value, Booking Status) alongside summary KPI cards, CSV export, print, and pagination; (3) Accessories Estimation Register (/mm-accessories-estimation-register): Implemented the full register displaying all saved accessories estimation items created through the Accessories Estimation form, adhering to the 22-column specification, interactive Size/Color specification modal, summary KPI cards, CSV export, print, and pagination; (4) Dynamic Searchable Multi-Filtering: Added 8 responsive dynamic filters (Buyer, Job ID / Our Ref, Style, Merchant, GMT Item, Estimation Item, Supplier, Booking Status) with AND-based logic, global text search, reset controls, and empty states; (5) Supplier-Locked Booking Workflows: Built seamless row-level 'Booking' action buttons on both registers that stage estimation item context and open the respective Fabric Booking (/mm-fabric-booking) or Accessories Booking (/mm-accessories-booking) forms with the assigned supplier strictly locked and additional item additions constrained to that same supplier; (6) Local Storage Persistence & Data Integrity: Integrated direct LocalStorage data binding through MMRepository, ensuring all saved estimations, updates, and booking statuses persist reliably across refreshes without data duplication or hardcoding.",
    "descriptionBn": "Marketing & Merchandising মডিউলে Confirm Order Entry মেনু পুনর্গঠন এবং সম্পূর্ণ কার্যকরী Fabric Estimation Register ও Accessories Estimation Register বাস্তবায়ন: (১) সাইডবার মেনু পুনর্গঠন: দৃশ্যমান মেনু থেকে 'New Confirm Order' ও 'PO & Breakdown Reconciliation' অপসারণ করা হয়েছে, 'Main Order Register'-এর নাম পরিবর্তন করে 'Confirm Order' (/mm-order-entry) রাখা হয়েছে এবং Confirm Order Entry-এর অধীনে দুটি নতুন মেনু ('Fabric Estimation Register' ও 'Accessories Estimation Register') যুক্ত করা হয়েছে; (২) ফেব্রিক এস্টিমেশন রেজিস্টার (/mm-fabric-estimation-register): ফেব্রিক এস্টিমেশন ফর্মের মাধ্যমে তৈরিকৃত সকল সেভড আইটেম প্রদর্শনের জন্য সম্পূর্ণ রেজিস্টার তৈরি করা হয়েছে যাতে সুনির্দিষ্ট ২২টি কলাম (Buyer, Job ID, Style, Merchant, GMT Item, Order Qty, Fabric Item, Used Place, Fabric Description, Supplier, Consumption, Unit, Wastage %, Required Qty, Est. Rate, Est. Value, Width, Fabric Color, Book No, Book Qty, Book Value, Booking Status) অন্তর্ভুক্ত এবং সেই সাথে সামারি কেপিআই কার্ড, সিএসভি এক্সপোর্ট, প্রিন্ট ও পেজিনেশন যুক্ত করা হয়েছে; (৩) অ্যাক্সেসরিজ এস্টিমেশন রেজিস্টার (/mm-accessories-estimation-register): অ্যাক্সেসরিজ এস্টিমেশন ফর্মের সকল সেভড আইটেম প্রদর্শনের জন্য সম্পূর্ণ রেজিস্টার বাস্তবায়ন করা হয়েছে যাতে ২২টি কলাম, বিস্তারিত সাইজ ও কালার স্পেক দেখার জন্য 'Size/Color' মডাল, কেপিআই কার্ড ও এক্সপোর্ট সুবিধা রয়েছে; (৪) ৮টি ডায়নামিক সার্চেবল মাল্টি-ফিল্টার: বায়ার, জব আইডি, স্টাইল, মার্চেন্ট, গার্মেন্ট আইটেম, এস্টিমেশন আইটেম, সাপ্লায়ার এবং বুকিং স্ট্যাটাসের ওপর ভিত্তি করে ৮টি ডায়নামিক সার্চেবল ফিল্টার ও গ্লোবাল সার্চ যোগ করা হয়েছে যা সমন্বিত AND লজিকে কাজ করে; (৫) সাপ্লায়ার-লকড বুকিং ওয়ার্কফ্লো: উভয় রেজিস্টারের প্রতিটি রো-তে 'Booking' অ্যাকশন যুক্ত করা হয়েছে যা এস্টিমেশন আইটেম ও প্যারেন্ট অর্ডারের তথ্য নিয়ে স্বয়ংক্রিয়ভাবে Fabric Booking অথবা Accessories Booking ফর্মে নিয়ে যায় এবং সংশ্লিষ্ট সাপ্লায়ারকে লক করে রাখে যাতে অন্য সাপ্লায়ারের আইটেম যুক্ত না হতে পারে; (৬) লোকাল স্টোরেজ পারসিস্টেন্স: MMRepository-এর মাধ্যমে রিয়েল লোকাল স্টোরেজ ডেটার সাথে সরাসরি সংযুক্ত করা হয়েছে, ফলে পেজ রিফ্রেশ করলেও সকল ডেটা, গণনা ও বুকিং স্ট্যাটাস অবিকৃত ও স্থায়ী থাকে।"
  },
  {
    "id": "588",
    "date": "2026-10-23T16:35",
    "type": "Marketing & Merchandising — New Confirm Order Register Improvements & Searchable Filters",
    "module": "Marketing & Merchandising / Order Register",
    "link": "/mm-order-entry",
    "descriptionEn": "Upgraded the New Confirm Order register in the Marketing & Merchandising module: (1) Toolbar & Register Clean-Up: Removed the 9 redundant action buttons (Report, View Order, All Data, Status, Size List, Attachment, Order Color, Fabric Requirement Details, Accessories Requirement Details) along with the 'Form Mode' indicator and 'Viewing Register' label, optimizing spacing and eliminating visual clutter; (2) Job ID Column Standardization: Renamed the 'Order No / Our Ref' column to 'Job ID' and updated the table to display exclusively the distinct Job ID for each row without combining with Order No, Our Ref, or secondary labels; (3) Order SL & Lock Icon Removal: Removed the 'Order SL' column completely from register table headers and rows, and removed the lock icon button positioned to the left of the Edit action while preserving full Edit functionality and permissions; (4) Four Dynamic Searchable Filters: Introduced responsive searchable dropdown filters for Buyer, Style, Job ID, and Merchant populated dynamically with distinct values from active order records, complete with instant dropdown searching, clear controls, and active filter count indicators; (5) Combined AND-Based Multi-Filtering & Empty State: Enabled simultaneous multi-criteria filtering where orders must match all selected parameters, integrated with pagination that auto-resets to page 1 upon filter changes, an instant 'Reset Filters' action, and an informative empty state ('No orders found matching the selected filters.'); (6) Sidebar Navigation Streamlining: Removed the 'Item Cost Saving Analysis' entry from the Marketing & Merchandising module's left navigation sidebar.",
    "descriptionBn": "Marketing & Merchandising মডিউলের New Confirm Order রেজিস্টারে সামগ্রিক আধুনিকায়ন ও ফিল্টারিং সুবিধা বাস্তবায়ন: (১) অপ্রয়োজনীয় বাটন ও লেবেল অপসারণ: রেজিস্টার হেডার থেকে ৯টি অতিরিক্ত বাটন (Report, View Order, All Data, Status, Size List, Attachment, Order Color, Fabric Requirement Details, Accessories Requirement Details) এবং 'Form Mode' ও 'Viewing Register' টেক্সট সম্পূর্ণ অপসারণ করা হয়েছে, ফলে ইন্টারফেস পরিচ্ছন্ন ও সুষম হয়েছে; (২) Job ID কলামের প্রমিতকরণ: পূর্বের 'Order No / Our Ref' কলামটির নাম পরিবর্তন করে 'Job ID' করা হয়েছে এবং প্রতিটি সারিতে Order No বা Our Ref-এর সংমিশ্রণ ছাড়া এককভাবে শুধু নির্দিষ্ট Job ID প্রদর্শনের ব্যবস্থা নিশ্চিত করা হয়েছে; (৩) Order SL ও লক আইকন অপসারণ: টেবিলের হেডার ও বডি থেকে 'Order SL' কলামটি সম্পূর্ণ বাদ দেওয়া হয়েছে এবং Edit অ্যাকশনের বাম পাশের লক আইকনটি অপসারণ করা হয়েছে (মূল Edit অ্যাকশন ও অনুমোদনের কার্যকারিতা অক্ষুণ্ণ রেখে); (৪) ৪টি ডায়নামিক সার্চেবল ফিল্টার: রেজিস্টারের উপরে বায়ার (Buyer), স্টাইল (Style), জব আইডি (Job ID), এবং মার্চেন্ট (Merchant)-এর জন্য ৪টি সার্চেবল ড্রপডাউন যুক্ত করা হয়েছে যা অর্ডার ডেটাবেজ থেকে স্বয়ংক্রিয়ভাবে ইউনিক মান নিয়ে পপুলেট হয় এবং ড্রপডাউনের ভেতরে লাইভ সার্চের সুবিধা রয়েছে; (৫) সমন্বিত AND ফিল্টারিং ও রিসেট সুবিধা: একাধিক ফিল্টার একসাথে নির্বাচন করলে সবগুলো শর্ত পূরণকারী অর্ডার প্রদর্শন (AND লজিক), ফিল্টার পরিবর্তনের সাথে সাথে পেজ ১-এ স্বয়ংক্রিয় রিসেট, এক ক্লিকে সকল ফিল্টার রিসেট বাটন এবং কোনো ফলাফল না থাকলে সুস্পষ্ট নোটিশ ('No orders found matching the selected filters.') প্রদর্শন নিশ্চিত করা হয়েছে; (৬) সাইডবার মেনু পরিচ্ছন্নকরণ: Marketing & Merchandising সাইডবার থেকে 'Item Cost Saving Analysis' মেনুটি সফলভাবে অপসারণ করা হয়েছে।"
  },
  {
    "id": "587",
    "date": "2026-10-23T12:45",
    "type": "Marketing & Merchandising Sidebar — Default Collapsed State & Independent Group Expansion",
    "module": "Marketing & Merchandising / Navigation Sidebar",
    "link": "/mm-dashboard",
    "descriptionEn": "Fixed sidebar navigation behavior in the Marketing & Merchandising module: (1) Default Collapsed State: Replaced the previous hardcoded open state with an empty initial state so that all expandable menu groups (Buyer Quotation, Style Pre-Costing, Confirm Order Entry, BOM Management, Fabric Estimation & Booking, Accessories Estimation & Booking, Approval Queue, PI, Order Closure, etc.) start collapsed by default without cluttering the sidebar; (2) Independent Expand & Collapse Interaction: Clicking any menu group or its chevron toggles only that specific group, expanding to reveal its submenu items or collapsing to hide them without affecting unrelated groups; (3) State Preservation Across Navigation: Integrated in-memory and session storage caching so that when a user expands a group and navigates within its submenus, the group remains expanded and active items stay highlighted without resetting or force-expanding other menus; (4) Clean Module Reset: Navigating back to Module Selection cleanly clears the sidebar cache, ensuring that whenever the module is reopened, all expandable groups start in their clean collapsed state.",
    "descriptionBn": "Marketing & Merchandising মডিউলে সাইডবার নেভিগেশন সংস্কার এবং ডিফল্ট কলাপ্সড রূপ বাস্তবায়ন: (১) ডিফল্ট কলাপ্সড স্টেট: পূর্বে সকল মেনু গ্রুপ স্বয়ংক্রিয়ভাবে উন্মুক্ত থাকার ত্রুটি সংশোধন করে ডিফল্ট অবস্থায় সকল এক্সপ্যান্ডেবল গ্রুপ (Buyer Quotation, Style Pre-Costing, Confirm Order Entry, BOM Management, Fabric Estimation & Booking, Accessories Estimation & Booking, Approval Queue, PI, Order Closure ইত্যাদি) বন্ধ বা কলাপ্সড রাখা হয়েছে, ফলে সাইডবার অপ্রয়োজনীয় বড় ও অগোছালো হয় না; (২) স্বতন্ত্র এক্সপ্যান্ড ও কলাপ্স ইন্টারঅ্যাকশন: কোনো মেনু গ্রুপ বা তার পাশের তীর চিহ্নে ক্লিক করলে কেবল সেই নির্দিষ্ট গ্রুপটি খোলে এবং সাবমেনু প্রদর্শিত হয়, আবার ক্লিক করলে বন্ধ হয়ে যায়— যা অন্যান্য মেনু গ্রুপকে প্রভাবিত করে না; (৩) নেভিগেশনের সময় স্টেট সংরক্ষণ: ইন-মেমোরি ও সেশন স্টোরেজ ক্যাশিংয়ের মাধ্যমে ব্যবহারকারী কোনো গ্রুপ খুলে তার সাবমেনুতে নেভিগেট করলে সেই গ্রুপটি উন্মুক্ত থাকে এবং সিলেক্টেড সাবমেনুর হাইলাইটিং অপরিবর্তিত থাকে; (৪) ক্লিন মডিউল রিসেট: টপবারের 'Modules' বাটনে ক্লিক করে মডিউল সিলেকশনে ফিরে গেলে সাইডবার ক্যাশ স্বয়ংক্রিয়ভাবে রিসেট হয়ে যায়, ফলে পরবর্তীতে যেকোনো সময় মডিউলে প্রবেশ করলে পুনরায় পরিচ্ছন্ন কলাপ্সড সাইডবার লোড হয়।"
  },
  {
    "id": "586",
    "date": "2026-10-23T12:30",
    "type": "PI Entry & Accessories Booking — UI Clean-Up, Filtered PI Preview & Safe Row Deletion",
    "module": "Marketing & Merchandising / PI Entry & Accessories Booking",
    "link": "/mm-proforma-invoice-create",
    "descriptionEn": "Implemented targeted UI and functional updates across Proforma Invoice Entry and Accessories Booking: (1) PI Entry Clean-Up: Completely removed the 'View List' button and deleted the descriptive subtitle text while maintaining header layout and numbering logic; (2) PI Preview Report Strict Filtering: Upgraded the PI Preview Report data pipeline to filter booking records strictly by the attached bookings linked to the active PI, preventing unrelated supplier or job bookings from appearing and keeping reference details, item quantities, and report totals 100% consistent for both Fabric and Accessories PIs; (3) Summary Grid Delete Control: Added a dedicated delete button (Trash2) to every row of the Accessories Booking Summary Grid with safe row validation (preventing deletion if goods have already been store-received), a confirmation dialog warning of dependent PO allocations or size-wise detail rows, clean removal of dependent data without touching master estimation records, and automated recalculation of totals and persistence; (4) Balanced Two-Panel Proportions: Reallocated split grid widths to give the Accessories Booking Summary Grid more horizontal space (lg:col-span-8) and reduced the 3-column PO and GMT Color Allocation Grid (lg:col-span-4); (5) Header Field Repositioning: Swapped visual positions of Supplier (now in the primary position with 2-column span) and Booking No (now in the second row) without altering underlying data bindings or generation logic.",
    "descriptionBn": "Proforma Invoice Entry এবং Accessories Booking ফর্মে ইউআই আধুনিকীকরণ, সঠিক প্রিভিউ ফিল্টারিং ও নিরাপদ রো ডিলিট সুবিধা বাস্তবায়ন: (১) PI Entry উইন্ডো পরিচ্ছন্নকরণ: 'View List' বাটন এবং বর্ণনামূলক সাবটাইটেল টেক্সট সম্পূর্ণ অপসারণ করা হয়েছে, যাতে হেডার লেআউট ও নম্বর জেনারেশন অপরিবর্তিত থাকে; (২) PI Preview Report কঠোর ফিল্টারিং: প্রিভিউ রিপোর্টে ডেটা পাইপলাইন সংস্কার করা হয়েছে যাতে শুধুমাত্র বর্তমান PI-এর সাথে সংযুক্ত বুকিং নম্বরগুলোর তথ্যই প্রদর্শিত হয়, অন্য কোনো বুকিং বা অসংলগ্ন আইটেম বাদ দেওয়া হয়েছে এবং Fabric ও Accessories উভয় PI-এর রেফারেন্স বিবরণ, পরিমাণ ও টোটাল নিখুঁতভাবে সমন্বয় করা হয়েছে; (৩) সামারি গ্রিডে রো ডিলিট অপশন: Accessories Booking Summary Grid-এর প্রতিটি সারিতে ডেডিকেটেড ডিলিট বাটন (Trash2) যুক্ত করা হয়েছে; পণ্য স্টোরে গৃহীত থাকলে ডিলিট প্রতিরোধ করার নিয়ম এবং ডিপেনডেন্ট PO অ্যালোকেশন বা সাইজ-ওয়াইজ রো থাকলে সতর্কবার্তামূলক কনফার্মেশন মোডাল দেখানো, মাস্টার এস্টিমেশন অপরিবর্তিত রেখে নিরাপদভাবে মুছে ফেলা এবং স্বয়ংক্রিয়ভাবে মোট হিসাব রিক্যালকুলেশন ও পারসিস্টেন্স নিশ্চিত করা হয়েছে; (৪) ভারসাম্যপূর্ণ গ্রিড প্রপোর্শন: স্প্লিট সেকশনে সামারি গ্রিডের প্রশস্ততা বৃদ্ধি করে lg:col-span-8 এবং ৩-কলাম বিশিষ্ট PO and GMT Color Allocation গ্রিড সংকুচিত করে lg:col-span-4 করা হয়েছে; (৫) হেডারে Supplier ও Booking No-এর অবস্থান অদলবদল: অন্তর্নিহিত ডেটা বাইন্ডিং ও লজিক অপরিবর্তিত রেখে Supplier ফিল্ডকে প্রথম সারিতে (২-কলাম স্প্যান সহ) এবং Booking No ফিল্ডকে দ্বিতীয় সারিতে স্থানান্তর করা হয়েছে।"
  },
  {
    "id": "585",
    "date": "2026-10-23T12:00",
    "type": "Accessories Booking Integration with Existing PI Entry & Multiple Booking Selection",
    "module": "Marketing & Merchandising / PI Entry & Accessories Booking",
    "link": "/mm-proforma-invoice-create",
    "descriptionEn": "Integrated Accessories Booking (GR_1311) with the existing Proforma Invoice (PI Entry) form without duplicating forms or business logic: (1) Proforma Invoice Create Button: Added a validated 'Proforma Invoice Create' button to the Accessories Booking footer action area, ensuring the booking is saved and contains line items before navigating with source parameters; (2) Source-Aware Item & Supplier Initialization: When initiated from Accessories Booking, the existing PI Entry form automatically initializes the Item field to 'Accessories', populates the relevant Supplier, locks the item category, and filters booking lookups exclusively to Accessories; when initiated from Fabric Booking, Item continues to be 'Fabric'; (3) Multi-Booking Selection with Strict Supplier Consistency: Upgraded the Add Booking modal to display eligible candidate bookings matching the source item category and supplier, with individual and 'Select All Eligible' batch checkboxes allowing multiple bookings for the same supplier to be attached in a single PI; (4) Dynamic Booking & Reference Grids: Automatically extracts and populates accessory specifications, units, quantities, unit rates, and totals across the Booking Information and Consolidated Booking Details grids, recalculating totals and net additional charges; (5) Preserved Workflows: Retained existing PI numbering, persistence (MMRepository.savePI), document storage attachments, print preview, and full backward compatibility with Fabric PI creation without regressions.",
    "descriptionBn": "পূর্ববর্তী ফর্ম বা লজিক ডুপ্লিকেট না করে বিদ্যমান Proforma Invoice (PI Entry) ফর্মের সাথে Accessories Booking (GR_1311)-এর সমন্বিত ইন্টিগ্রেশন: (১) Proforma Invoice Create বাটন: Accessories Booking ফর্মে ভ্যালিডেশন সমৃদ্ধ 'Proforma Invoice Create' বাটন যুক্ত করা হয়েছে, যা বুকিং সংরক্ষিত থাকা এবং লাইন আইটেম থাকা নিশ্চিত করে সোর্স প্যারামিটার সহ PI Entry ফর্মে নেভিগেট করে; (২) সোর্স-সচেতন Item ও Supplier ইনিশিয়ালাইজেশন: Accessories Booking থেকে শুরু হলে বিদ্যমান PI Entry ফর্মে Item ফিল্ড স্বয়ংক্রিয়ভাবে 'Accessories' সেট হয়, সংশ্লিষ্ট সাপ্লায়ার পপুলেট হয় এবং লুকআপে কেবল এক্সেসরিজ বুকিং প্রদর্শিত হয়; অনুরূপভাবে Fabric Booking থেকে আসলে Item ফিল্ড 'Fabric' থাকে; (৩) একই সাপ্লায়ারের জন্য মাল্টিপল বুকিং সিলেকশন: Add Booking মোডাল সংস্কার করে একই সাপ্লায়ারের উপযোগী সকল বুকিং প্রদর্শনের ব্যবস্থা করা হয়েছে, যেখানে চেকবক্স এবং 'Select All Eligible' অপশন ব্যবহার করে একাধিক বুকিং একটিমাত্র PI-তে একসাথে যুক্ত করা যায়; (৪) ডায়নামিক বুকিং ও রেফারেন্স গ্রিড: নির্বাচিত এক্সেসরিজ বুকিং থেকে স্বয়ংক্রিয়ভাবে স্পেসিফিকেশন, ইউনিট, কোয়ান্টিটি, ইউনিট রেট ও অ্যামাউন্ট রিকনসাইল করে Booking Information এবং Consolidated Booking Details গ্রিডে যুক্ত করা হয় এবং মোট মূল্য ও অতিরিক্ত চার্জ স্বয়ংক্রিয়ভাবে পুনর্গণনা হয়; (৫) অপরিবর্তিত এন্টারপ্রাইজ কার্যকারিতা: বিদ্যমান PI নম্বর জেনারেশন, ডেটা পারসিসটেন্স (MMRepository.savePI), ডকুমেন্ট স্টোরেজ অ্যাটাচমেন্ট ও প্রিন্ট প্রিভিউ অক্ষুণ্ণ রাখা হয়েছে এবং Fabric PI-এর পূর্বের কোনো কার্যকারিতা পরিবর্তন না করে সম্পূর্ণ সুরক্ষিত রাখা হয়েছে।"
  },
  {
    "id": "584",
    "date": "2026-10-23T11:30",
    "type": "UI Layout & Field Alignment Fix — Accessories Booking Header Grid",
    "module": "Marketing & Merchandising / Accessories Booking",
    "link": "/mm-accessories-booking",
    "descriptionEn": "Fixed field alignment, spacing, and overlapping issues in the Accessories Booking header section: (1) Five-Column Unified Grid: Replaced mismatched rows with a unified 5-column CSS grid (A-E on Row 1, F-J on Row 2) with consistent horizontal (gap-x-4) and vertical (gap-y-2.5) spacing; (2) Overlap Elimination: Fully resolved overlaps between Booking Type and Del Mode, and Del Place and Delivery Date by enforcing min-w-0 flex containment, full-width inputs, and controlled truncation with native tooltips for long values; (3) Standardized Label & Control Dimensions: Set uniform 80px label widths and consistent 30px (h-7.5) control heights across all 10 cells to achieve laser-straight vertical alignment; (4) Intentional Grid Span: Positioned Booking No across an intentional 2-column span to cleanly balance Row 1 without awkward spacing; (5) Aligned Bottom Info Row: Structured the bottom information bar with dedicated spacing and borders for Req Date, Terms & Conditions button controls, PI No display, and Note input.",
    "descriptionBn": "Accessories Booking ফর্মে হেডার সেকশনের ফিল্ড অ্যালাইনমেন্ট, স্পেসিং ও ওভারল্যাপিং সংক্রান্ত সমস্যার সমাধান: (১) ৫-কলাম বিশিষ্ট সুসংহত গ্রিড: পূর্বের অসম গ্রিড রো-এর পরিবর্তে প্রথম সারিতে ৫টি (A-E) এবং দ্বিতীয় সারিতে ৫টি (F-J) ফিল্ড পজিশন নিয়ে একটি সুবিন্যস্ত ৫-কলাম গ্রিড তৈরি করা হয়েছে, যাতে অনুভূমিক (gap-x-4) ও উল্লম্ব (gap-y-2.5) ব্যবধান সম্পূর্ণ সুষম থাকে; (২) ওভারল্যাপ সম্পূর্ণ দূরীকরণ: Booking Type এবং Del Mode, ও Del Place এবং Delivery Date ফিল্ডগুলোর মধ্যে হওয়া টেক্সট ও কন্ট্রোল ওভারল্যাপ দূর করা হয়েছে; min-w-0 কনটেইনমেন্ট, ফুল-উইডথ ইনপুট এবং দীর্ঘ টেক্সটের জন্য ট্রাঙ্কেশন ও মাউস হোভারে সম্পূর্ণ টেক্সট প্রদর্শনের ব্যবস্থা রাখা হয়েছে; (৩) স্ট্যান্ডার্ড লেবেল ও ইনপুট সাইজ: প্রতিটি ফিল্ডের জন্য সুনির্দিষ্ট ৮০ পিক্সেল লেবেল উইডথ এবং ৩০ পিক্সেল (h-7.5) হাইট নির্ধারণ করে নিখুঁত উল্লম্ব সারিবদ্ধকরণ নিশ্চিত করা হয়েছে; (৪) ইন্টেনশনাল গ্রিড স্প্যান: প্রথম সারির ভারসাম্য বজায় রাখতে Booking No ফিল্ডটিকে পরিকল্পিতভাবে ২-কলাম স্প্যান দেওয়া হয়েছে; (৫) বটম ইনফো সেকশন সংস্কার: নিচের সারিতে Req Date, Terms & Conditions বাটন ও প্লাস কন্ট্রোল, PI No ব্যাজ এবং Note ইনপুট ফিল্ডকে সুনির্দিষ্ট স্পেসিং ও বর্ডার দিয়ে সুন্দরভাবে বিন্যস্ত করা হয়েছে।"
  },
  {
    "id": "583",
    "date": "2026-10-23T11:15",
    "type": "Bug Fixes, UI Refinements & Attachment/Save Workflow Alignment — Accessories Booking Form (GR_1311)",
    "module": "Marketing & Merchandising / Accessories Booking",
    "link": "/mm-accessories-booking",
    "descriptionEn": "Implemented additional bug fixes, UI refinements, and functional workflow updates for the Accessories Booking Form (GR_1311): (1) First-Click PO Loading Bug Fix: Resolved the issue where PO numbers failed to display on the first click of the 'D' button under Grp Type; eligible PO records are now computed immediately upon opening the modal without altering background allocations. Background PO and GMT Color Allocation Grid remains untouched until the user explicitly selects PO records and clicks 'OK', and previously confirmed selections are preserved when reopening the window; (2) Summary Grid Cleanup: Removed the 'Trims' text from the 'Grp Type' column while preserving the column, alignment, and 'D' button functionality; (3) Booking Info Section Updates: Completely removed the 'Booking Desc' field and adjusted Row 1 to a balanced 4-column grid; renamed 'Additional Booking' to 'Booking Type' as a dropdown with exactly three options ('Main Accessories Booking', 'Short Accessories Booking', 'Additional Accessories Booking') that persist and load accurately; (4) PO and GMT Color Allocation Grid Refinement: Completely removed the '#' checkbox column, keeping PO No., GMT Color, and GMT Qty; (5) Attachment Button & Modal Parity: Replaced the old attachments UI with the exact shared Fabric Booking Attachment button styling and modal component (MMBookingAttachmentModal) with 3MB file validation, notes, upload/download/deletion, and dedicated LocalStorage persistence under 'cripton_mm_accessories_booking_attachments_v1'; (6) Dual Save & Submit Actions: Added a dedicated 'Save' button in the footer and top bar allowing draft-level validation and persistence with 'Accessories Booking saved successfully.' confirmation, while keeping 'Submit' for full submission validation with 'Accessories Booking submitted successfully.' notification.",
    "descriptionBn": "Accessories Booking ফর্মে (GR_1311) জরুরি বাগ ফিক্স, ইউআই রিফাইনমেন্ট এবং ফাংশনাল ওয়ার্কফ্লো উন্নয়ন: (১) প্রথম ক্লিকে PO লোডিং সমস্যার সমাধান: Grp Type কলামের 'D' বাটনে প্রথমবার ক্লিক করলে PO নম্বর প্রদর্শিত না হওয়া এবং ব্যাকগ্রাউন্ড গ্রিডে অনাকাঙ্ক্ষিতভাবে যুক্ত হওয়ার বাগটি ফিক্স করা হয়েছে; এখন প্রথম ক্লিকেই সাথে সাথে উপযুক্ত PO রেকর্ড প্রদর্শিত হয় এবং ব্যাকগ্রাউন্ড গ্রিড খালি থাকে। ব্যবহারকারী নির্দিষ্ট PO নির্বাচন করে 'OK' চাপলে কেবল তখনই PO and GMT Color Allocation গ্রিডে তথ্য যুক্ত হয় এবং উইন্ডোটি পুনরায় খুললে পূর্বের নির্বাচিত রেকর্ডগুলো সংরক্ষিত থাকে; (২) সামারি গ্রিড সংস্কার: 'Grp Type' কলাম থেকে 'Trims' লেখাটি অপসারণ করা হয়েছে (কলাম, অ্যালাইনমেন্ট ও 'D' বাটনের কার্যকারিতা অপরিবর্তিত রেখে); (৩) বুকিং ইনফরমেশন সেকশন আপডেট: 'Booking Desc' ফিল্ডটি সম্পূর্ণ অপসারণ করে ৪-কলাম বিশিষ্ট সুবিন্যস্ত গ্রিড করা হয়েছে; 'Additional Booking'-এর নাম পরিবর্তন করে 'Booking Type' করা হয়েছে এবং এতে সুনির্দিষ্ট ৩টি অপশন ('Main Accessories Booking', 'Short Accessories Booking', 'Additional Accessories Booking') সহ ড্রপডাউনে রূপান্তর করা হয়েছে যা পারসিস্টেন্টভাবে সংরক্ষিত ও লোড হয়; (৪) PO and GMT Color Allocation গ্রিড সংস্কার: গ্রিড থেকে '#' চেকবক্স কলামটি সম্পূর্ণ বাদ দেওয়া হয়েছে এবং PO No., GMT Color ও GMT Qty সঠিকভাবে প্রদর্শিত হচ্ছে; (৫) Fabric Booking স্টাইলের Attachment বাটন ও মোডাল: পূর্বের কাস্টম মোডালের পরিবর্তে Fabric Booking-এর অনুরূপ শেয়ার্ড Attachment বাটন ও মোডাল কম্পোনেন্ট (MMBookingAttachmentModal) প্রতিস্থাপন করা হয়েছে (৩ মেগাবাইট ফাইল ভ্যালিডেশন, নোটস, আপলোড, প্রিভিউ/ডাউনলোড ও ডিলিট সুবিধা সহ) যা 'cripton_mm_accessories_booking_attachments_v1'-এর অধীনে নির্ভরযোগ্যভাবে কাজ করে; (৬) পৃথক Save ও Submit অ্যাকশন: ফুটারে এবং টপবারে একটি পৃথক 'Save' বাটন যুক্ত করা হয়েছে যা ড্রাফট-লেভেল ভ্যালিডেশনের মাধ্যমে 'Accessories Booking saved successfully.' বার্তা সহ তথ্য সংরক্ষণ করে এবং 'Submit' বাটন চূড়ান্ত সাবমিশন ও ভ্যালিডেশন পরিচালনা করে 'Accessories Booking submitted successfully.' বার্তা প্রদর্শন করে।"
  },
  {
    "id": "582",
    "date": "2026-10-22T23:45",
    "type": "Updated UI & Functional Alignment — Accessories Booking Form",
    "module": "Marketing & Merchandising / Accessories Booking",
    "link": "/mm-accessories-booking",
    "descriptionEn": "Implemented comprehensive updated UI and functional requirements for the Accessories Booking Form: (1) Main Header & Toolbar Streamlining: Removed company name display, duplicate booking number header, Action/Edit/Record/Help/Quick View desktop menus, Status field, All (Reference Scope) checkbox, and View List button, keeping a clean ERP window title; (2) Job ID-Based Sequential Booking No: Replaced random booking generation with a persistent Job ID-based sequence (format: JobID/NN, e.g. JOB-2026-0001/01, /02, /03) determined from persisted records; (3) Booking Header Information Fields: Renamed 'Our Ref' to 'Job ID' and locked it as read-only (removing lookup button); locked 'Supplier' as read-only (removing lookup button); removed CP, Load Port, Destination, Fact Date, and Conv Rate fields; replaced 'Book Type' with 'Additional Booking' (No/Yes); and converted 'Del Place' into a dropdown populated with Pakiza company master names; (4) Summary Grid Refinements & Add Item Filtering: Renamed column to 'Job ID', removed 'Desc' column, removed 'Trims' subtitle under 'Grp Type', and configured '+ Add Item' to filter exclusively for accessories associated with the current booking's supplier and estimation context (preventing duplicate additions); (5) Two-Stage PO Allocation & Dedicated 'P' Button Population: Separated PO selection from size-wise generation. Clicking 'D' opens the PO Selection Window (with Lot and Country removed, and a functional 'Select All' checkbox). Clicking OK updates the PO allocation grid without populating details. Clicking the newly added 'P' button beside the Accessories column validates PO selection and populates color-wise and size-wise breakdown into the detailed grid; (6) Detailed Size-Wise Booking Grid Updates: Removed 'Status' and 'Code Spec/PO' columns, renamed column to 'Job ID', and made 'Wastage %' strictly read-only; (7) Footer Clean-Up & Submit Button: Removed From/To date fields, With Our Ref/With Buyer Ref/None radio filters, All Data, Post Flag, With Price, Editing Active, New, and View List buttons. Preserved Document Storage 'Attachment' modal (PI Entry parity) and Printable Preview Sheet, and introduced a validated 'Submit' button with LocalStorage persistence under 'cripton_mm_accessories_bookings_v1'.",
    "descriptionBn": "Accessories Booking ফর্মে আপডেটেড ইউআই ও কার্যকরী নির্দেশনাসমূহ বাস্তবায়ন: (১) মেইন হেডার ও টুলবার পরিচ্ছন্নকরণ: কোম্পানির নাম প্রদর্শন, ডুপ্লিকেট বুকিং নম্বর হেডার, Action/Edit/Record/Help/Quick View ডেস্কটপ মেনুবার, Status ফিল্ড, All (Reference Scope) চেকবক্স এবং View List বাটন অপসারণ করে একটি পরিচ্ছন্ন ERP উইন্ডো হেডার রাখা হয়েছে; (২) Job ID-ভিত্তিক ক্রমানুসারে Booking No জেনারেশন: র‍্যান্ডম নম্বরের পরিবর্তে সংরক্ষিত বুকিং রেকর্ড বিশ্লেষণ করে Job ID ভিত্তিক ধারাবাহিক বুকিং নম্বর জেনারেশন (JobID/NN, যেমন JOB-2026-0001/01, /02, /03) চালু করা হয়েছে; (৩) বুকিং হেডার ফিল্ড সংস্করণ: 'Our Ref'-এর নাম পরিবর্তন করে 'Job ID' এবং ফিল্ডটিকে রিড-অনলি করা হয়েছে (পাশের বাটন সরানো হয়েছে); 'Supplier' ফিল্ডটিকে রিড-অনলি করা হয়েছে (পাশের বাটন সরানো হয়েছে); CP, Load Port, Destination, Fact Date এবং Conv Rate ফিল্ডসমূহ অপসারণ করা হয়েছে; 'Book Type'-এর স্থলে 'Additional Booking' (No/Yes) প্রতিস্থাপন করা হয়েছে; এবং 'Del Place' ফিল্ডে সাধারণ টেক্সটের বদলে পাকিজা কোম্পানি মাস্টার সমৃদ্ধ ড্রপডাউন যুক্ত করা হয়েছে; (৪) সামারি গ্রিড ও Add Item সাপ্লায়ার ফিল্টারিং: কলামের নাম 'Job ID' করা হয়েছে, 'Desc' কলাম অপসারণ করা হয়েছে, 'Grp Type'-এর নিচের 'Trims' সাবটেক্সট বাদ দেওয়া হয়েছে, এবং '+ Add Item' বাটনে বর্তমান বুকিংয়ের সাপ্লায়ার ও এস্টিমেশনের সাথে সংশ্লিষ্ট এক্সেসরিজ আইটেম ছাড়া অন্য আইটেম বাদ দিয়ে ডুপ্লিকেট রোধ করা হয়েছে; (৫) দ্বি-ধাপবিশিষ্ট PO বরাদ্দ ও 'P' বাটন দ্বারা পপুলেশন: PO নির্বাচন এবং সাইজ ব্রেকডাউন পপুলেশন সম্পূর্ণ আলাদা করা হয়েছে। 'D' বাটনে ক্লিক করলে PO Selection উইন্ডো খোলে (যেখান থেকে Lot ও Country কলাম সরানো হয়েছে এবং কার্যকর 'Select All' অপশন যুক্ত করা হয়েছে)। OK চাপলে PO Allocation গ্রিডে তথ্য যুক্ত হয় কিন্তু নিচের ডিটেইলস গ্রিড খালি থাকে। এরপর Accessories কলামের পাশের 'P' বাটনে ক্লিক করলে সিস্টেম PO ভ্যালিডেশন করে স্বয়ংক্রিয়ভাবে কালার ও সাইজওয়াইজ রেকর্ড পপুলেট করে; (৬) বিস্তারিত সাইজওয়াইজ গ্রিড আপডেট: 'Status' এবং 'Code Spec/PO' কলাম দুটি অপসারণ করা হয়েছে, কলামের নাম 'Job ID' করা হয়েছে এবং 'Wastage %' ফিল্ডটি সম্পূর্ণ রিড-অনলি করা হয়েছে; (৭) ফুটার পরিচ্ছন্নকরণ ও Submit বাটন: তারিখ ফিল্ড, রেফারেন্স রেডিও অপশন, All Data, Post Flag, With Price, Editing Active, New এবং View List বাটনসমূহ বাদ দিয়ে পরিচ্ছন্ন কমপ্যাক্ট রূপ দেওয়া হয়েছে। PI Entry স্টাইলের ডকুমেন্ট স্টোরেজ 'Attachment' মোডাল ও প্রিন্ট প্রিভিউ অক্ষুণ্ণ রেখে একটি পূর্ণাঙ্গ ভ্যালিডেশন সমৃদ্ধ 'Submit' বাটন যুক্ত করা হয়েছে যা লোকাল স্টোরেজে ডেটা সংরক্ষণ করে।"
  },
  {
    "id": "581",
    "date": "2026-10-22T22:35",
    "type": "New Feature & Desktop ERP Form Replication — Accessories Booking Form",
    "module": "Marketing & Merchandising / Accessories Booking",
    "link": "/mm-accessories-booking",
    "descriptionEn": "Implemented the comprehensive Accessories Booking form in the Marketing & Merchandising module adhering to the 17-page legacy ERP specifications: (1) Navigation & Context Integration: Connected line items in Accessories Estimation to Accessories Booking with query parameters (source, jobId, ref, rowId, accessoryId, itemName, supplier), loading order and estimation context seamlessly without duplicate records; (2) Desktop ERP Header & Menus: Built authentic enterprise ERP header for 'Pakiza Knit Composite Ltd.' with menus ('Action', 'Edit', 'Record', 'Help', 'Quick View') and header metadata fields (Booking No, Our Ref with 'P' lookup, Booking Desc, Booking Date, Pay Mode, Supplier with 'P' lookup, CP, Del Mode, Load Port, Book Type, Booking Unit, Destination, Del Place, Req Date, Delivery Date, ETA Port, Fact Date, Conv Rate, Status dropdown with 'Own Source', Note, Terms & Conditions modal + '+' control, PI No, and 'All' toggle); (3) Accessories Booking Summary Grid: Positioned in upper-left with 6 columns ('Our Ref', 'Style', 'Grp Type' with interactive 'D' button, 'Accessories', 'Desc', 'Book Amt'), vertical scrolling, and auto-calculating 'Budget Value' and 'Total' summary fields; (4) Grp Type D Button & PO Selection Modal: Clicking 'D' opens the dedicated PO Selection Window with left-side info panel (Our Ref, Style, Item, Desc), search/clear filter with 'C' button, radio filters ('Pending', 'Booked', 'All'), and 9-column allocation table (Checkbox, Lot, PO No, Del DT, Color, Country, Qty, Book Qty, Balance) with 'Back' and 'OK' validation actions; (5) PO and GMT Color Allocation Grid: Positioned in upper-right with columns (Selection Checkbox, PO No, GMT Color, GMT Qty, Note), maintaining real-time synchronization with the PO selection window, row counts, and GMT quantity summaries; (6) Detailed Size-Wise Booking Grid: Lower calculation area with 15 columns (Received/Status Indicator, Our Ref, Item Name, Description, Color, Size, Code Spec/PO, GMT Qty, Req Qty, Unit, Booked Wastage %, Book Qty with 'R>' ceiling rounding control, Store Rcvd Qty, Rate, Total) with auto-proportional size breakdown, conversion, and reconciled footer totals; (7) Bottom Actions & Integration: Date Range From/To, radio filters ('With Our Ref', 'With Buyer Ref', 'None'), 'View List' modal for saved bookings, 'All Data' and 'Post Flag' toggles, Document Storage 'Attachment' modal (up to 3MB upload with individual download), 'Edit', 'With Price' toggle, full printable ERP 'Preview' sheet, and persistent LocalStorage storage under 'cripton_mm_accessories_bookings_v1'.",
    "descriptionBn": "মার্কেটিং ও মার্চেন্ডাইজিং মডিউলে ১৭ পৃষ্ঠার লিগ্যাসি ডেস্কটপ ERP স্পেসিফিকেশন ও রেফারেন্স স্ক্রিনশট অনুযায়ী পূর্ণাঙ্গ Accessories Booking ফর্ম বাস্তবায়ন: (১) নেভিগেশন ও কনটেক্সট ইন্টিগ্রেশন: Accessories Estimation টেবিলের প্রতিটি রো-তে থাকা 'Booking' বাটন থেকে সরাসরি অর্ডার, আইটেম ও সাপ্লায়ার প্যারামিটার সহ Accessories Booking ফর্মে আসা নিশ্চিত করা হয়েছে (কোনো ডুপ্লিকেট রেকর্ড তৈরি ছাড়া); (২) ডেস্কটপ ERP হেডার ও মেনুবার: 'Pakiza Knit Composite Ltd.'-এর এন্টারপ্রাইজ মেনুবার ('Action', 'Edit', 'Record', 'Help', 'Quick View') সহ কমপ্যাক্ট বুকিং হেডার ফিল্ডসমূহ (Booking No, 'P' লুকআপ সহ Our Ref, Booking Desc, Booking Date, Pay Mode, 'P' লুকআপ সহ Supplier, CP, Del Mode, Load Port, Book Type, Booking Unit, Destination, Del Place, Req Date, Delivery Date, ETA Port, Fact Date, Conv Rate, 'Own Source' সহ Status, Note, Terms & Conditions মোডাল ও '+' কন্ট্রোল, PI No, এবং 'All' চেকবক্স); (৩) এক্সেসরিজ বুকিং সামারি গ্রিড: ওপরের বাম পাশে ৬টি কলামের গ্রিড ('Our Ref', 'Style', কার্যকরী 'D' বাটন সহ 'Grp Type', 'Accessories', 'Desc', 'Book Amt'), ডায়নামিক 'Budget Value' এবং 'Total' ফুটার ফিল্ড; (৪) Grp Type D বাটন ও PO সিলেকশন মোডাল: 'D' বাটনে ক্লিক করলে নিবেদিত PO Selection উইন্ডো ওপেন হয়, যাতে বাম পাশের ইনফো প্যানেল (Our Ref, Style, Item, Desc), 'C' বাটন সহ সার্চ ফিল্টার, রেডিও বাটন ('Pending', 'Booked', 'All'), এবং ৯-কলামের টেবিল (সিলেকশন চেকবক্স, Lot, PO No, Del DT, Color, Country, Qty, Book Qty, Balance) এবং 'Back' ও 'OK' অ্যাকশন ভ্যালিডেশন যুক্ত রয়েছে; (৫) PO & GMT Color অ্যালোকেশন গ্রিড: ওপরের ডান পাশে ৫-কলামের গ্রিড (Checkbox, PO No, GMT Color, GMT Qty, Note), যা PO Selection উইন্ডোর সাথে রিয়েল-টাইমে সিঙ্ক থাকে এবং নির্বাচিত মোট রো ও GMT Qty প্রদর্শন করে; (৬) বিস্তারিত সাইজওয়াইজ বুকিং গ্রিড: নিচের অংশে ১৫-কলাম বিশিষ্ট হিসাব গ্রিড (Received/Status, Our Ref, Item Name, Description, Color, Size, Code Spec/PO, GMT Qty, Req Qty, Unit, Booked Wastage %, 'R>' রাউন্ডিং বাটন সহ Book Qty, Store Rcvd Qty, Rate, Total) যেখানে অর্ডার সাইজ ব্রেকডাউন, স্বয়ংক্রিয় ওয়েস্টেজ ও রিকোয়ারমেন্ট ক্যালকুলেশন এবং সামারি ফুটারে সম্পূর্ণ রিকনসাইল করা হয়েছে; (৭) বটম অ্যাকশন কন্ট্রোল ও প্রিন্ট প্রিভিউ: Date Range From/To, রেডিও ফিল্টার ('With Our Ref', 'With Buyer Ref', 'None'), সংরক্ষিত বুকিং দেখার জন্য 'View List' মোডাল, 'All Data' ও 'Post Flag' টগল, ডকুমেন্ট স্টোরেজ 'Attachment' মোডাল (সর্বোচ্চ ৩ মেগাবাইট ফাইল আপলোড ও প্রতিটি ফাইলের জন্য ডাউনলোড সুবিধা), 'Edit', 'With Price' টগল, অফিসিয়াল ফরম্যাটের প্রিন্টযোগ্য ERP 'Preview' শিট এবং লোকাল স্টোরেজে 'cripton_mm_accessories_bookings_v1'-এর অধীনে নির্ভরযোগ্য সংরক্ষণ।"
  },
  {
    "id": "580",
    "date": "2026-10-22T22:05",
    "type": "Additional UI & Functional Refinements — GR_1308: Accessories Estimation Form",
    "module": "Marketing & Merchandising / Accessories Estimation",
    "link": "/mm-accessories-estimation",
    "descriptionEn": "Implemented additional UI and functional refinements to the Accessories Estimation Form (GR_1308): (1) Job ID Selection Modal: Removed the 'Job ID No.' column from the Select Job ID Record lookup table, retaining Job ID, Style, Quantity, and Value with seamless selection; (2) Search Field Button Labels: Relabeled the lookup action buttons beside 'Find Pre Costing' and 'Find Job ID' from 'V' to 'P' while maintaining button styling and instant lookup invocation; (3) Left-Aligned Information Sections: Systematically left-aligned all labels, field values, and input controls across 'Order & Buyer Info', 'Item & Quantity', and 'Booking & PI Info' sections for consistent vertical hierarchy and readability, keeping read-only state intact; (4) Heading Simplification: Renamed 'Group B: Item & Quantity' to 'Item & Quantity'; (5) Pre Costing Item V Button Removed & Strict Filter: Removed the 'V' lookup button beside Pre Costing Item, making the field clickable to open the lookup, and filtered the selection list at the query level to display accessories and trims only (strictly excluding fabric items); (6) Searchable Master Table Lookups for Item Name & Supplier: Replaced standard dropdowns with table-style searchable modal lookups for both 'Item Name' (with 16 comprehensive master accessories items) and 'Supplier' (with registered suppliers and contact info), preventing arbitrary text typing; (7) Dynamic Grs Unit Relation Factor: Made the Grs Unit Relation / Factor field editable in the Market Unit conversion modal with numeric validation, allowing custom conversion ratios (e.g. 120 vs 144) to dynamically drive Market Quantity calculation and persist per row; (8) Size D Single Size Relabel & Cleanup: Renamed the Single Size Specification apply button from 'V' to 'P' and removed the redundant instructional text, preserving the full GMT size breakdown rows, order quantities, and specification auto-population.",
    "descriptionBn": "Accessories Estimation ফর্মে (GR_1308) অতিরিক্ত ইউআই ও কার্যকরী সংস্কারসমূহ বাস্তবায়ন: (১) Job ID সিলেকশন টেবিল: Select Job ID Record মোডাল টেবিল থেকে 'Job ID No.' কলামটি অপসারণ করা হয়েছে, যাতে Job ID, Style, Quantity ও Value কলামসমূহ বহাল থেকে নির্বাচন অক্ষুণ্ণ থাকে; (২) সার্চ বাটন লেবেল আপডেট: 'Find Pre Costing' এবং 'Find Job ID' ফিল্ডের পাশের লুকআপ বাটন দুটির লেবেল 'V' থেকে পরিবর্তন করে 'P' করা হয়েছে; (৩) ইনফরমেশন সেকশন বাম-সারিবদ্ধকরণ: 'Order & Buyer Info', 'Item & Quantity' এবং 'Booking & PI Info' সেকশনের সকল লেবেল ও ইনপুট কন্ট্রোল বাম দিকে সারিবদ্ধ (left-aligned) করা হয়েছে যাতে তথ্যের ধারাবাহিকতা ও পাঠযোগ্যতা বৃদ্ধি পায় (রিড-অনলি লকিং অক্ষুণ্ণ রেখে); (৪) সেকশন হেডিং পরিবর্তন: 'Group B: Item & Quantity' পরিবর্তন করে সরাসরি 'Item & Quantity' করা হয়েছে; (৫) Pre Costing Item-এর V বাটন অপসারণ ও ফেব্রিক বাদ দেওয়া: Pre Costing Item ফিল্ডের পাশের 'V' বাটন অপসারণ করে ফিল্ডটিকে ক্লিকেবল করা হয়েছে এবং কুয়েরি লেভেলে কঠোর ফিল্টারিংয়ের মাধ্যমে ফেব্রিক আইটেমসমূহ সম্পূর্ণ বাদ দিয়ে কেবল এক্সেসরিজ আইটেমসমূহ প্রদর্শন নিশ্চিত করা হয়েছে; (৬) Item Name ও Supplier-এর জন্য সার্চেবল মাস্টার মোডাল: সাধারণ ড্রপডাউনের পরিবর্তে 'Item Name' (১৬টি স্ট্যান্ডার্ড মাস্টার এক্সেসরিজ আইটেম) এবং 'Supplier' (নিবন্ধিত সাপ্লায়ার ও লোকেশন)-এর জন্য সার্চযোগ্য টেবিল মোডাল চালু করা হয়েছে যাতে ম্যানুয়াল অননুমোদিত এন্ট্রি বন্ধ থাকে; (৭) ডায়নামিক Grs Unit কনভার্সন ফ্যাক্টর: Market Unit কনভার্সন মোডালে Grs Unit Relation / Factor ফিল্ডটিকে এডিটেবল করা হয়েছে, যাতে ব্যবহারকারী কাস্টম অনুপাত (যেমন ১৪৪-এর বদলে ১২০) প্রদান করলে তা স্বয়ংক্রিয়ভাবে Market Quantity ক্যালকুলেশনে প্রয়োগ হয় এবং রো-লেভেলে সংরক্ষিত থাকে; (৮) Size D Single Size বাটন ও টেক্সট সংশোধন: Single Size Specification ফিল্ডের পাশের বাটনটিকে 'V' থেকে 'P'-তে রূপান্তর করা হয়েছে এবং অপ্রয়োজনীয় নির্দেশমূলক বাক্যটি অপসারণ করা হয়েছে, যেখানে GMT সাইজ ব্রেকডাউন ও অর্ডার কোয়ান্টিটি সম্পূর্ণ সংরক্ষিত থাকে।"
  },
  {
    "id": "579",
    "date": "2026-10-22T21:15",
    "type": "Comprehensive UI & Functional Alignment — GR_1308: Accessories Estimation Form",
    "module": "Marketing & Merchandising / Accessories Estimation",
    "link": "/mm-accessories-estimation",
    "descriptionEn": "Implemented comprehensive UI and functional updates to the Accessories Estimation Form (GR_1308) in accordance with the 15-page detailed change request: (1) Form Header & Search Section: Simplified heading to 'Accessories Estimation', removed duplicate headings, record-navigation controls ('<<< >>>'), and refresh button. Replaced Find QTN with 'Find Pre Costing' searchable lookup modal (Pre Costing No, Job ID, Style, Quantity, Value). Removed Find Budget completely. Renamed Find Ref to 'Find Job ID' with searchable lookup modal; (2) Order Information Groups: Renamed Group A to 'Order & Buyer Info' with Job ID, Style, and Buyer Name set to read-only, and Order Date removed. In Group B ('Item & Quantity'), set Item and Quantity to read-only, and removed Packing Type and Unit. Completely removed Group C ('Commercial') section from UI. Renamed Group D to 'Booking & PI Info' with Booking No, PI No, and BBLC No set to read-only and date fields removed; (3) Estimation Table Enhancements: Renamed Budget Item Name to 'Pre Costing Item' with searchable accessory selection modal. Converted Item Name to searchable list with 8 standard accessories (Button, Sewing Thread, Main Label, Care Label, Poly Bag, Zipper, Hang Tag, Elastic Tape). Converted Used Place to searchable list with 8 placement options. Converted Supplier into searchable list (with 7 initial suppliers) and removed the redundant 'V' button. Made Cons Unit and Market Qty read-only, formatting Market Qty to exactly two decimal places. Introduced 'Market Unit – Grs Unit Relation' modal when Market Unit changes with Confirm/Cancel workflow. Restricted Nominee Status strictly to 'Nominated' and 'Own Source'. Removed PO column. Made Booking column sticky right for persistent accessibility during horizontal scrolling, with a stable table-container scroll height; (4) Size D & Color D Modals: Enlarged Size D modal to desktop dimensions, fixed SINGLE SIZE issue so GMT size rows are never hidden or cleared, and locked GMT Order Qty and Total Wastage (%) as read-only. Enlarged Color D modal, renamed Our Ref to Job ID (read-only), and made Garments Color read-only; (5) Footer Streamlining: Removed Req. Sheet, View List, Color Summary, Budget Acc Desc input, and Exit button, keeping a clean, compact New and Save footer.",
    "descriptionBn": "১৫ পৃষ্ঠার বিস্তারিত চেঞ্জ রিকোয়েস্ট অনুযায়ী Accessories Estimation ফর্মে (GR_1308) সমন্বিত ইউআই ও কার্যকরী সংস্কারসমূহ বাস্তবায়ন: (১) হেডার ও সার্চ সেকশন: শিরোনামটি সরল করে কেবল 'Accessories Estimation' রাখা হয়েছে, ডুপ্লিকেট হেডিং, রেকর্ড নেভিগেশন ('<<< >>>') ও রিফ্রেশ বাটন অপসারণ করা হয়েছে। Find QTN-এর স্থলে 'Find Pre Costing' সার্চেবল লুকআপ মোডাল যুক্ত করা হয়েছে (Pre Costing No, Job ID, Style, Quantity, Value)। Find Budget সম্পূর্ণ মুছে ফেলা হয়েছে। Find Ref-এর নাম পরিবর্তন করে 'Find Job ID' সার্চেবল লুকআপ দেওয়া হয়েছে; (২) অর্ডার ইনফরমেশন গ্রুপ: Group A-এর নাম 'Order & Buyer Info' করা হয়েছে এবং Job ID, Style ও Buyer Name রিড-অনলি রেখে Order Date মুছে ফেলা হয়েছে। Group B ('Item & Quantity') থেকে Packing Type ও Unit মুছে Item ও Quantity রিড-অনলি করা হয়েছে। সম্পূর্ণ Group C ('Commercial') সেকশনটি ইউআই থেকে বাদ দেওয়া হয়েছে। Group D-এর নাম 'Booking & PI Info' করে Booking No, PI No ও BBLC No রিড-অনলি করা হয়েছে এবং তারিখ ফিল্ডগুলো সরানো হয়েছে; (৩) এস্টিমেশন টেবিল সংস্করণ: Budget Item Name কলামের নাম 'Pre Costing Item' করে সার্চেবল আইটেম নির্বাচন মোডাল যুক্ত করা হয়েছে। Item Name ফিল্ডটিকে ৮টি সাধারণ এক্সেসরিজ আইটেম সমৃদ্ধ সার্চেবল ড্রপডাউনে রূপান্তর করা হয়েছে। Used Place ফিল্ডে ৮টি প্লেসমেন্ট অপশন সহ সার্চেবল ড্রপডাউন দেওয়া হয়েছে। Supplier ফিল্ডটিকে ৭টি সাপ্লায়ার সমৃদ্ধ সার্চেবল ড্রপডাউনে রূপান্তর করে পাশের অপ্রয়োজনীয় 'V' বাটন সরানো হয়েছে। Cons Unit ও Market Qty রিড-অনলি করা হয়েছে এবং Market Qty ঠিক দুই দশমিক স্থানে প্রদর্শন নিশ্চিত করা হয়েছে। Market Unit পরিবর্তনের ক্ষেত্রে নিশ্চিতকরণ সহ 'Market Unit – Grs Unit Relation' মোডাল চালু করা হয়েছে। Nominee Status শুধুমাত্র 'Nominated' ও 'Own Source' বিকল্পে সীমিত করা হয়েছে। PO কলাম বাদ দেওয়া হয়েছে। হরিজন্টাল স্ক্রলিংয়ের সময় সহজে অ্যাক্সেসের জন্য Booking কলামটিকে স্টিকি-রাইট করা হয়েছে এবং টেবিল স্ক্রলিং স্ট্যাবল করা হয়েছে; (৪) Size D ও Color D মোডাল: Size D মোডালকে পূর্ণাঙ্গ ডেস্কটপ আকারে বড় করা হয়েছে, SINGLE SIZE নির্বাচন করলে GMT সাইজ রো অদৃশ্য হয়ে যাওয়ার বাগ ফিক্স করা হয়েছে এবং GMT Order Qty ও Total Wastage (%) রিড-অনলি করা হয়েছে। Color D মোডাল বড় করে Our Ref-এর নাম Job ID (রিড-অনলি) করা হয়েছে এবং Garments Color ফিল্ডটি রিড-অনলি করা হয়েছে; (৫) ফুটার পরিচ্ছন্নকরণ: Req. Sheet, View List, Color Summary, Budget Acc Desc ইনপুট এবং Exit বাটন সরিয়ে শুধুমাত্র New ও Save বাটন বিশিষ্ট কমপ্যাক্ট ফুটার বজায় রাখা হয়েছে।"
  },
  {
    "id": "578",
    "date": "2026-10-22T19:25",
    "type": "UI Correction & Container Hierarchy Alignment — GR_1308: Accessories Estimation Form",
    "module": "Marketing & Merchandising / Accessories Estimation",
    "link": "/mm-accessories-estimation",
    "descriptionEn": "Corrected the Accessories Estimation Form (GR_1308) UI layout and container hierarchy to match original legacy enterprise ERP design: (1) Removed Nested Application Appearance: Eliminated faux desktop OS window frames, titlebars, window controls (Minimize, Maximize, Close), and redundant menu bar ('Action', 'Edit', 'Record', 'Help', 'Quick View') that previously created an application-inside-an-application appearance; (2) Unified Enterprise Layout: Seamlessly integrated the estimation form directly into MarketingMerchandisingLayout with coherent page hierarchy, moving record navigation (|<<, <, 1 of N, >, >>|), refresh, and order exit controls into layout actions; (3) Compact Form Organization: Cleaned up Order Information (Groups A, B, C, D) by removing decorative dots, excessive card borders, and oversized containers while preserving all underlying order data; (4) De-duplicated Footer & Actions: Preserved single consistent action bar in the footer (Req. Sheet, View List, Color Summary, Accessories Booking, Budget Acc Desc input, New, Save, Exit) eliminating duplicate New/Save buttons; (5) Dialog Refinement: Restyled Size D (Sizewise Item Specification Declaration) and Color D (Accessories Color Entry) modals into clean, properly-sized dialogs with backdrop blur and explicit Back/Save controls, retaining all calculations and multi-tier item workflows intact.",
    "descriptionBn": "লিগ্যাসি এন্টারপ্রাইজ ERP রেফারেন্স অনুযায়ী Accessories Estimation ফর্মের (GR_1308) ইউআই লেআউট ও কন্টেইনার স্তরবিন্যাস সংশোধন: (১) নেস্টেড অ্যাপ্লিকেশন অ্যাপিয়ারেন্স দূরীকরণ: ফর্মের ভেতরে থাকা কৃত্রিম ডেস্কটপ উইন্ডো ফ্রেম, টাইটেলবার, উইন্ডো কন্ট্রোল (Minimize, Maximize, Close) এবং রিডান্ড্যান্ট মেনু বার ('Action', 'Edit', 'Record', 'Help', 'Quick View') সম্পূর্ণ অপসারণ করা হয়েছে, যা পূর্বে একটি অ্যাপের ভেতরে আরেকটি অ্যাপের বিভ্রান্তিকর রূপ তৈরি করেছিল; (২) একক সমন্বিত এন্টারপ্রাইজ লেআউট: MarketingMerchandisingLayout-এর সাথে সামঞ্জস্য রেখে ফর্মটিকে সরাসরি সিঙ্গেল-কন্টেইনার হায়ারার্কিতে যুক্ত করা হয়েছে এবং রেকর্ড নেভিগেশন (|<<, <, 1 of N, >, >>|), রিফ্রেশ ও ব্যাক-টু-অর্ডার কন্ট্রোলসমূহ লেআউট অ্যাকশনে বিন্যস্ত করা হয়েছে; (৩) কমপ্যাক্ট ফর্ম বিন্যাস: অর্ডার ইনফরমেশনের ৪টি গ্রুপ (Group A, B, C, D) থেকে অনাবশ্যক কালার ডট ও অতিরিক্ত কার্ড বর্ডার সরিয়ে পরিচ্ছন্ন কমপ্যাক্ট রূপ দেওয়া হয়েছে (মূল তথ্য অপরিবর্তিত রেখে); (৪) অ্যাকশন বাটন সমন্বয়: একাধিক স্থানে থাকা ডুপ্লিকেট New/Save বাটন দূর করে ফুটার অ্যাকশন বারে সুনির্দিষ্ট অবস্থানে (Req. Sheet, View List, Color Summary, Accessories Booking, Budget Acc Desc ইনপুট, New, Save, Exit) বজায় রাখা হয়েছে; (৫) মোডাল রিফাইনমেন্ট: Size D (Sizewise Item Specification Declaration) এবং Color D (Accessories Color Entry) মোডালগুলোকে যথাযথ সাইজের ক্লিন ডায়ালগ আকারে ব্যাকড্রপ ব্লার সহ সাজানো হয়েছে (Back ও Save বাটন সহ) এবং যাবতীয় ক্যালকুলেশন ও স্পেসিফিকেশন লজিক সম্পূর্ণ কার্যকর রাখা হয়েছে।"
  },
  {
    "id": "577",
    "date": "2026-10-22T18:45",
    "type": "New Feature & Desktop ERP Form Replication — GR_1308: Accessories Estimation Form",
    "module": "Marketing & Merchandising / Accessories Estimation",
    "link": "/mm-accessories-estimation",
    "descriptionEn": "Developed the Accessories Estimation Form ('GR_1308: Accessories Estimation') replicating the desktop ERP legacy interface layout and workflow in Marketing & Merchandising: (1) Navigation & Entry Point: Connected 'View Trims' in Order Entry (Accessories Requirement Details section) to directly load the Accessories Estimation Form with full order context (buyer, style, item, quantity, unit rate, and requirements) without creating duplicate orders or requirements; (2) Window Header & Toolbar: Built the classic ERP desktop window title bar (GR_1308: Accessories Estimation, Pakiza Knit Composite Ltd., Key Account Merchandiser Tanvir Ahmed), desktop menu controls (Action, Edit, Record, Help, Quick View), record navigation (|<<, <, >, >>|), and action toolbar (New, Save, Delete, Refresh, Req Sheet, Exit); (3) Search & Reference Information: Implemented Find QTN, Find Budget, and Find Ref lookups with 'V' action buttons alongside 4-group compact reference layout (Group A: Our Ref, Style, Order Date, Buyer; Group B: Item, Packing Type, Quantity, Unit; Group C: Pay Term, Rate, Place, Note; Group D: Booking No & Dt, PI No & Dt, BBLC No & Dt); (4) Accessories Estimation Details Table: 20-column high-density grouped grid (Row Delete X, In House?, Budget Item Name, Item Name, Description, Used Place, Consumption Qty/Pcs, Cons Unit, Wastage %, Wastage Qty, Market Qty with unit conversion [Gross, Cones, Dzn, Pcs], Market Unit, Unit Rate, Total Amount, Nominee Status, Supplier lookup, Size D button, Color D button, PO D button, Booking button); (5) Sizewise Item Specification (Size D Modal): Modal with 'SAME AS GMT SIZE' and 'SINGLE SIZE' workflows, row-level size specifications, required and wastage quantity auto-calculation, and size summary breakdown (No. of Size, Total Required, Wastage, Total Qty, Total GMT Order Qty); (6) Accessories Color Entry (Color D Modal): 2-column mapping grid with read-only Garment Colors, DTM auto-matching, Contrast mapping, and Single Color uniform population; (7) PO Allocations (PO D Modal): Row-level PO selection and quantity allocation; (8) Footer Controls & Storage: Interactive Req. Sheet print/export modal, View List of all saved estimations, Color Summary modal, Budget Acc Desc input, and reliable Local Storage persistence under 'cripton_mm_accessories_estimations_v1'.",
    "descriptionBn": "Marketing & Merchandising মডিউলে লিগ্যাসি ডেস্কটপ ERP আর্কিটেকচার অনুযায়ী Accessories Estimation ফর্ম ('GR_1308: Accessories Estimation') সম্পূর্ণ বাস্তবায়ন: (১) নেভিগেশন ও এন্ট্রি পয়েন্ট: Order Entry ফর্মের Accessories Requirement Details সেকশন থেকে 'View Trims' বাটনে ক্লিক করলে স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট অর্ডারের তথ্য (বায়ার, স্টাইল, আইটেম, কোয়ান্টিটি, রেট ও রিকোয়ারমেন্টস) সহ সরাসরি Accessories Estimation ফর্ম ওপেন হয় (কোনো অতিরিক্ত বা ডুপ্লিকেট রেকর্ড তৈরি ছাড়া); (২) উইন্ডো হেডার ও টুলবার: ক্লাসিক ডেস্কটপ উইন্ডো টাইটেল বার (GR_1308: Accessories Estimation, Pakiza Knit Composite Ltd., মার্চেন্ডাইজার Tanvir Ahmed), মেনু বার (Action, Edit, Record, Help, Quick View), রেকর্ড নেভিগেটর (|<<, <, >, >>|) এবং অ্যাকশন টুলবার (New, Save, Delete, Refresh, Req Sheet, Exit) বাস্তবায়ন; (৩) সার্চ ও রেফারেন্স ইনফরমেশন: 'V' বাটনযুক্ত Find QTN, Find Budget ও Find Ref সার্চ কন্ট্রোল এবং ৪টি সুবিন্যস্ত গ্রুপে রেফারেন্স ডেটা প্রদর্শন (Group A: Our Ref, Style, Order Date, Buyer; Group B: Item, Packing Type, Quantity, Unit; Group C: Pay Term, Rate, Place, Note; Group D: Booking No & Dt, PI No & Dt, BBLC No & Dt); (৪) Accessories Estimation Details টেবিল: ২০-কলাম বিশিষ্ট হাই-ডেনসিটি টেবিল (রো ডিলিট X, In House?, Budget Item Name, Item Name, Description, Used Place, Cons Qty/Pcs, Cons Unit, Wastage %, Wastage Qty, ইউনিট কনভার্সন সহ Market Qty [Gross, Cones, Dzn, Pcs], Market Unit, Unit Rate, Total Amount, Nominee Status, Supplier, Size D বাটন, Color D বাটন, PO D বাটন ও Booking বাটন); (৫) সাইজওয়াইজ আইটেম স্পেসিফিকেশন (Size D মোডাল): 'SAME AS GMT SIZE' এবং 'SINGLE SIZE' সুবিধা, রো-লেভেল সাইজ স্পেসিফিকেশন, স্বয়ংক্রিয় কোয়ান্টিটি ও ওয়েস্টেজ ক্যালকুলেশন এবং সাইজ সামারি (No. of Size, Total Required, Wastage, Total Qty, Total GMT Order Qty); (৬) Accessories Color Entry (Color D মোডাল): রিড-অনলি Garment Colors সহ ২-কলামের ম্যাপিং গ্রিড, DTM কালার অটো-ম্যাচিং, Contrast কালার ম্যাপিং ও Single Color ইউনিফর্ম পপুলেশন; (৭) PO Allocation (PO D মোডাল): প্রতিটি এক্সেসরিজ আইটেমের সাথে অর্ডারের PO বরাদ্দকরণ ইন্টারফেস; (৮) ফুটার অ্যাকশন ও ডেটা পারসিস্টেন্স: প্রিন্টযোগ্য Req. Sheet প্রিভিউ মোডাল, সংরক্ষিত সকল এস্টিমেশনের View List মোডাল, এক্সেসরিজভিত্তিক Color Summary মোডাল, Budget Acc Desc ইনপুট এবং লোকাল স্টোরেজে 'cripton_mm_accessories_estimations_v1' কি-এর অধীনে সম্পূর্ণ নির্ভরযোগ্য পারসিস্টেন্স।"
  },
  {
    "id": "576",
    "date": "2026-10-22T16:35",
    "type": "UI/UX & Functional Updates — Fabric Estimation Color Mapping & Fabric Booking PO Allocation, Populate Validation & Attachments",
    "module": "Marketing & Merchandising / Fabric Estimation & Fabric Booking",
    "link": "/mm-fabric-booking",
    "descriptionEn": "Implemented UI/UX and functional updates for Fabric Estimation and Fabric Booking Management: (1) Fabric Estimation — Color Mapping Modal: Removed the '+ Add Color' button from the Fabric Color Entry & Item Color Mapping modal without impacting existing color mapping capabilities. Made the 'Garments Color' field non-editable (read-only) so it reliably displays system-populated values while preventing manual user edits; (2) Fabric Booking — P (Populate) Button Dynamic Styling: Initialized the P (Populate) button with its default neutral color styling upon form load. Only after user selects POs and successfully populates the Fabric Booking Details section does the P button transition to its active/highlighted emerald color, visually confirming successful population; (3) PO Allocation Table Default State: Configured the PO Allocation Table to be blank by default when navigating from Fabric Estimation, preventing automated PO pre-selection and prompting users to click 'D.' to select POs explicitly; (4) PO Selection Validation Before Populate: Added strict validation before executing the populate action. If the user clicks P without selecting any PO via the D button, the system halts and presents the exact validation message: 'Please select a PO before proceeding with the populate action.'; (5) Fabric Booking Document Storage Attachment Functionality: Added an 'Attachment' button in the Fabric Booking Management Form footer. Integrated a Document Storage modal matching the PI Entry Form design with 3 MB file size limits, 7-column table (Remove, Title, Note with multi-line wrapping, Uploaded By, Upload Time, File Size, individual working Download with original filename and error toasts), and autonomous Local Storage persistence under 'cripton_mm_fabric_booking_attachments_v1'.",
    "descriptionBn": "Fabric Estimation ও Fabric Booking Management — ইউআই/ইউএক্স ও কার্যকরী আপডেটসমূহ বাস্তবায়ন: (১) ফেব্রিক এস্টিমেশন — কালার ম্যাপিং মোডাল: কালার ম্যাপিং কার্যকারিতা অক্ষুণ্ণ রেখে Fabric Color Entry & Item Color Mapping মোডাল থেকে '+ Add Color' বাটনটি অপসারণ করা হয়েছে। 'Garments Color' ফিল্ডটিকে নন-এডিটেবল (read-only) করা হয়েছে যাতে সিস্টেম বা পূর্বনির্ধারিত মান অপরিবর্তিত থাকে এবং ব্যবহারকারী ম্যানুয়ালি পরিবর্তন করতে না পারেন; (২) ফেব্রিক বুকিং — P (Populate) বাটনের ডায়নামিক স্টাইলিং: ফর্ম লোড হওয়ার সময় P বাটনটি ডিফল্ট নিউট্রাল রঙে প্রদর্শিত থাকে। ব্যবহারকারী PO নির্বাচন করে সফলভাবে Fabric Booking Details সেকশনে ডেটা লোড করার পরই P বাটনটি অ্যাক্টিভ/হাইলাইটেড পান্না (emerald) রঙে পরিবর্তিত হয়ে সফল পপুলেশন নিশ্চিত করে; (৩) PO Allocation টেবিল ডিফল্ট ব্ল্যাঙ্ক স্টেট: ফেব্রিক এস্টিমেশন থেকে বুকিং ফর্মে আসার পর PO Allocation টেবিল ডিফল্টভাবে সম্পূর্ণ ব্ল্যাঙ্ক থাকে, যাতে কোনো PO স্বয়ংক্রিয়ভাবে সিলেক্ট না হয়ে ব্যবহারকারী 'D.' বাটনে ক্লিক করে নির্দিষ্ট PO বেছে নিতে পারেন; (৪) পপুলেটের পূর্বে PO সিলেকশন ভ্যালিডেশন: P বাটনে ক্লিক করার সময় PO সিলেক্ট করা আছে কিনা তা যাচাই করার ভ্যালিডেশন যুক্ত করা হয়েছে। কোনো PO সিলেক্ট না করে P বাটনে ক্লিক করলে পপুলেশন বন্ধ হয়ে নির্দিষ্ট সতর্কবার্তা 'Please select a PO before proceeding with the populate action.' প্রদর্শিত হয়; (৫) ফেব্রিক বুকিং ডকুমেন্ট স্টোরেজ Attachment সুবিধা: ফেব্রিক বুকিং ফর্মের ফুটারে 'Attachment' বাটন সংযোজন করা হয়েছে। PI Entry ফর্মে ব্যবহৃত রেফারেন্স অনুযায়ী একই ডিজাইনের ডকুমেন্ট স্টোরেজ মোডাল যুক্ত করা হয়েছে (সর্বোচ্চ ৩ মেগাবাইট ফাইল আপলোড, ৭-কলাম বিশিষ্ট টেবিল, টেক্সট র‍্যাপিং সমৃদ্ধ Note কলাম, প্রতিটি রো-এর জন্য স্বতন্ত্র আসল ফাইল ডাউনলোড ও লোকাল স্টোরেজে 'cripton_mm_fabric_booking_attachments_v1' কি-এর অধীনে সংরক্ষণ)।"
  },
  {
    "id": "575",
    "date": "2026-10-22T15:45",
    "type": "UI Updates & Functional Corrections — PI Entry Form & Fabric Booking Form",
    "module": "Marketing & Merchandising / Fabric Booking & PI",
    "link": "/mm-fabric-booking",
    "descriptionEn": "Implemented UI and functional corrections for PI Entry Form and Fabric Booking Form: (1) PI Attachment Table Layout & Download Fixes: Completely removed the 'Re-write' column and its modal control from the PI attachment table. Fixed the 'Download' column layout with horizontal scroll wrapping, ensuring every row provides an individual, working download action with original filename/type and toast error handling. Enabled multi-line text wrapping for the 'Note' column (no ellipsis or column clipping); (2) Fabric Booking — Style & PO Summary Table Updates: Renamed the 'V' action button to 'P' and the table column header from 'V' to 'Populate' while preserving calculation and booking logic. Fixed the 'Add Another Style' button to display only a single plus sign ('+ Add Another Style'); (3) Supplier-Specific Style Filtering: Filtered eligible styles and Fabric Estimation records in the 'Add Another Style' modal strictly by the booking's current supplier ID/reference, excluding unrelated suppliers and presenting a clean empty-state message if no records match; (4) New Empty Booking Full Form Reset: Enhanced 'New Empty Booking' to completely clear all booking fields (Our Ref/Job ID, Booking No, Supplier, CP, Description, delivery dates/places, style summary, PO allocations, booking details, and temporary selections) while leaving saved LocalStorage records intact. Unlocks the Supplier field and renders an editable dropdown of registered suppliers; (5) Supplier Context & Locking from Fabric Estimation: Fixed the issue where initiating a booking from a Fabric Estimation line item passed an incorrect supplier. Correctly resolves the estimation item's supplier ID and name, passes it to the booking form (including resilience on page refresh via query params), populates it automatically, locks the Supplier field as read-only, and restricts subsequent style additions to that same supplier.",
    "descriptionBn": "PI Entry Form ও Fabric Booking Form — ইউআই ও কার্যকরী সংশোধনসমূহ বাস্তবায়ন: (১) PI Attachment টেবিল লেআউট ও ডাউনলোড সংশোধন: PI Attachment টেবিল থেকে 'Re-write' কলাম ও এডিট কন্ট্রোল সম্পূর্ণ অপসারণ করা হয়েছে। হরিজন্টাল স্ক্রল র‍্যাপিং সহ 'Download' কলাম দৃশ্যমান ও সক্রিয় করা হয়েছে, যাতে প্রতিটি রো-এর জন্য নিজস্ব আসল ফাইল ও নাম সহ ডাউনলোড কার্যকর থাকে এবং এরর হ্যান্ডলিং ও টোস্ট নোটিফিকেশন যুক্ত করা হয়েছে। 'Note' কলামে টেক্সট র‍্যাপিং নিশ্চিত করা হয়েছে যাতে কোনো টেক্সট কেটে না গিয়ে একাধিক লাইনে সুন্দরভাবে দেখা যায়; (২) Fabric Booking — Style & PO Summary টেবিল আপডেট: টেবিলের 'V' বাটনটির নাম পরিবর্তন করে 'P' এবং সংশ্লিষ্ট কলাম হেডার 'V' থেকে পরিবর্তন করে 'Populate' করা হয়েছে (মূল বুকিং ও ক্যালকুলেশন কার্যকারিতা অক্ষুণ্ণ রেখে)। 'Add Another Style' বাটনে অতিরিক্ত প্লাস চিহ্ন দূর করে একক প্লাস আইকন ('+ Add Another Style') নিশ্চিত করা হয়েছে; (৩) সাপ্লায়ার অনুযায়ী স্টাইল ফিল্টারিং: 'Add Another Style' মোডালে শুধুমাত্র বর্তমান বুকিংয়ের সাপ্লায়ার আইডি ও নামের সাথে মিলে এমন অনুমোদিত স্টাইল ও ফেব্রিক এস্টিমেশন রেকর্ডগুলোই প্রদর্শিত হবে। ভিন্ন সাপ্লায়ারের রেকর্ড স্বয়ংক্রিয়ভাবে বাদ দেওয়া হয়েছে এবং কোনো রেকর্ড না থাকলে পরিচ্ছন্ন এম্পটি-স্টেট মেসেজ প্রদর্শিত হবে; (৪) New Empty Booking পূর্ণাঙ্গ ফর্ম রিসেট: 'New Empty Booking' বাটনে ক্লিক করলে পূর্বের বুকিংয়ের সমস্ত ডেটা (Our Ref/Job ID, Booking No, Supplier, CP, Description, ডেলিভারি তারিখ/স্থান, স্টাইল সামারি, PO বরাদ্দ এবং ফেব্রিক ডিটেইলস) সম্পূর্ণ মুছে ফ্রেশ স্টেটে রিসেট হয়, যেখানে সংরক্ষিত বুকিং অপরিবর্তিত থাকে। সাথে সাথে Supplier ফিল্ডটি আনলক হয়ে এডিটেবল ড্রপডাউন আকারে প্রদর্শিত হয়; (৫) ফেব্রিক এস্টিমেশন থেকে সঠিক সাপ্লায়ার পাস ও লকিং: ফেব্রিক এস্টিমেশন রো-এর 'Booking' বাটন থেকে বুকিং ওপেন করার সময় ভুল সাপ্লায়ার আসার সমস্যা সমাধান করা হয়েছে। এস্টিমেশন আইটেমের প্রকৃত সাপ্লায়ার আইডি ও নাম সঠিকভাবে বুকিং ফর্মে ট্রান্সফার হয় (পেজ রিফ্রেশেও কোয়েরি প্যারামসের মাধ্যমে নির্ভরযোগ্যভাবে রিস্টোর হয়), স্বয়ংক্রিয়ভাবে সাপ্লায়ার ফিল্ডে বসে এবং সাপ্লায়ার ফিল্ডটি নন-এডিটেবল হিসেবে লক থাকে।"
  },
  {
    "id": "574",
    "date": "2026-10-22T14:55",
    "type": "UI Updates & Functional Enhancements — Automatic Booking Population, Color Consolidation, Season Field & Document Storage",
    "module": "Marketing & Merchandising / Proforma Invoice",
    "link": "/mm-proforma-invoice-create",
    "descriptionEn": "Implemented additional requirements and UI updates for the Proforma Invoice Entry Form: (1) Booking Information Section & Automatic Population: Completely removed the 'P' button and the 'P to Populated' column from the Booking Information table. The initial booking from Fabric Booking is automatically populated with its details and fabric items immediately upon opening the form. Clicking 'Add Another Booking' and attaching an eligible booking automatically retrieves and populates its associated fabric items into Booking Details and recalculates consolidated PI totals without requiring any manual button click; (2) Duplicate Booking Prevention: Excluded already-added bookings or displayed them with an 'Already Added' disabled state in the booking selection dialog. Added uniqueness validation with notification 'This booking has already been added to the current Proforma Invoice.' when attempting duplicate selection or before saving; (3) Booking Details Section — Color Aggregation: Completely removed the 'Color' column from the visible Booking Details table. Aggregated booking items across different colors for matching fabric items (same booking, Job ID, Season, Style, Fabric Code, description, unit, and unit rate) into clean consolidated rows (summing quantities and calculating consolidated amount without double-counting) while preserving underlying color-wise data internally; (4) Season Column: Added a new 'Season' column immediately to the right of the 'Job ID' column (order: Buyer, Job ID, Season, Style, Fabric Description, Quantity, Unit, Unit Rate, Amount), automatically populating authoritative season data from related Order Entry and Job records; (5) Attachment Modal Updates: Removed the 'Document Type *' input from the file upload form and removed the 'Document Type' column from the attachment table, producing a clean 8-column table layout. Completely removed the separate 'Image Storage' tab and panel, consolidating document storage into a unified File Storage interface that accepts documents and images up to 3 MB with full download, re-write, and Local Storage persistence.",
    "descriptionBn": "Proforma Invoice Entry ফর্মে নতুন স্পেসিফিকেশন অনুযায়ী অতিরিক্ত রিকোয়ারমেন্টস ও ইউআই আপডেট সম্পন্ন করা হয়েছে: (১) Booking Information সেকশন ও স্বয়ংক্রিয় পপুলেশন: Booking Information টেবিল থেকে 'P' বাটন এবং 'P to Populated' কলাম সম্পূর্ণ অপসারণ করা হয়েছে। ফেব্রিক বুকিং থেকে পিআই ফর্মে প্রবেশ করলে প্রাথমিক বুকিং ও এর সমস্ত আইটেম তাৎক্ষণিকভাবে স্বয়ংক্রিয়ভাবে পপুলেট হয়। পরবর্তীতে 'Add Another Booking'-এ ক্লিক করে নতুন বুকিং যুক্ত করা মাত্রই এর সংশ্লিষ্ট ফেব্রিক আইটেমসমূহ স্বয়ংক্রিয়ভাবে Booking Details সেকশনে যুক্ত হয় এবং কোনো ম্যানুয়াল বাটন ক্লিক ছাড়াই মোট কোয়ান্টিটি ও গ্র্যান্ড টোটাল রিক্যালকুলেট হয়; (২) ডুপ্লিকেট বুকিং নির্বাচন প্রতিরোধ: ইতিমধ্যে যুক্ত হওয়া বুকিংগুলোকে সিলেকশন মোডালে 'Already Added' ডিসেবলড অবস্থায় প্রদর্শন এবং পুনরায় যুক্ত করার চেষ্টা করলে তাৎক্ষণিক সতর্কবার্তা 'This booking has already been added to the current Proforma Invoice.' প্রদান করা হয়েছে; সাবমিটের পূর্বেও ডুপ্লিকেট বুকিং প্রতিরোধ ভ্যালিডেশন নিশ্চিত করা হয়েছে; (৩) Booking Details সেকশন — কালার একত্রীকরণ (Color Aggregation): দৃশ্যমান Booking Details টেবিল থেকে 'Color' কলাম সম্পূর্ণ সরানো হয়েছে। একই ফেব্রিক আইটেমের বিভিন্ন কালারের কোয়ান্টিটি এবং অ্যামাউন্ট একত্র করে সমন্বিত রো (Consolidated Row) হিসেবে প্রদর্শন করা হয়েছে (মূল ফেব্রিক বুকিংয়ের কালার ডেটা অক্ষুণ্ণ রেখে কোনো ডাবল-কাউন্টিং ছাড়া নির্ভুল মোট হিসাব); (৪) Season কলাম সংযোজন: Job ID কলামের ঠিক ডান পাশে নতুন 'Season' কলাম যুক্ত করা হয়েছে (কলাম ক্রম: Buyer, Job ID, Season, Style, Fabric Description, Quantity, Unit, Unit Rate, Amount) যা সংশ্লিষ্ট অর্ডার এন্ট্রি ও জব রেকর্ড থেকে স্বয়ংক্রিয়ভাবে অথেনটিক সিজন রিট্রিভ করে প্রদর্শন করে; (৫) Attachment মোডাল আধুনিকায়ন: ফাইল আপলোড ফর্ম থেকে 'Document Type *' ইনপুট এবং এটাচমেন্ট টেবিল থেকে 'Document Type' কলাম সম্পূর্ণ অপসারণ করে ৮-কলামের সুবিন্যস্ত টেবিল লেআউট নিশ্চিত করা হয়েছে। স্বতন্ত্র 'Image Storage' ট্যাব ও প্যানেল সম্পূর্ণ বাদ দিয়ে একক File Storage ইন্টারফেসে সমন্বিত করা হয়েছে (যা ৩ মেগাবাইট পর্যন্ত ডকুমেন্ট ও ইমেজ ফাইল আপলোড, রি-রাইট, ডাউনলোড ও লোকাল স্টোরেজে সংরক্ষণ সমর্থন করে)।"
  },
  {
    "id": "573",
    "date": "2026-10-22T12:40",
    "type": "UI Improvements & Functional Fixes — Marketing & Merchandising Proforma Invoice Entry Form",
    "module": "Marketing & Merchandising / Proforma Invoice",
    "link": "/mm-proforma-invoice-create",
    "descriptionEn": "Implemented comprehensive UI improvements and functional requirements for the Proforma Invoice Entry Form: (1) PI Information Section: Reorganized into a clean 5-column layout adapting responsively to screen width, with Column 1 strictly displaying 'PI Date *' and 'PI Number *' (renamed from 'PI Nr.'); (2) Booking Information Section: Renamed action button to 'Add Another Booking'. Implemented strict supplier-specific filtering so only bookings matching the current PI's supplier can be added (e.g. Pakiza Knitting & Dyeing), with empty-state feedback when no matching bookings exist; (3) Supplier Consistency Validation: Enforced strict validation preventing saving or submitting if bookings belong to different suppliers, with exact alert 'All bookings added to a single Proforma Invoice must belong to the same supplier.'; (4) Booking Information Table & Population Control: Renamed 'V' action button to 'P' and table column header to 'P to Populated'. Fixed booking item population to reliably retrieve and consolidate fabric booking items into Booking Details below without duplicating existing lines upon repeated clicks; (5) Consolidated Booking Details: Displays consolidated items across all attached bookings with source traceability (Booking No, Buyer, Job ID, Style, Fabric Description, Color, Quantity, Unit, Unit Rate, Amount) and auto-recalculated grand totals; (6) Sample Fabric Booking Data: Seeded realistic test records for Pakiza Knitting & Dyeing across multiple jobs (JOB-2026-0002/01, JOB-2026-0003/01, JOB-2026-0003/02, JOB-2026-0004/01) with styles, fabrics, and quantities with safe non-duplicating Local Storage initialization; (7) Additional Charge Section: Converted Particulars into a non-editable dropdown with master charge categories, preventing duplicate charge lines. Enabled signed positive and negative decimal values (e.g. -150.00 for deductions) with clear negative display and automatic reduction of the PI grand total; (8) Footer Buttons Cleanup: Removed 'LC Breakup' and 'View List' buttons completely from the PI footer without leaving empty whitespace while keeping the 'Attachment' button; (9) Attachment Modal (Reference-Based Design): Built modal with File Storage and Image Storage tabs, file selection and upload, strict 3 MB file size validation, full 9-column attachment table, metadata re-write, client-side download, and deletion with persistent Local Storage tracking under 'cripton_mm_pi_attachments_v1'.",
    "descriptionBn": "Proforma Invoice Entry ফর্মে ইউআই উন্নয়ন ও কার্যকরী সংশোধন বাস্তবায়ন করা হয়েছে: (১) PI Information সেকশন: রেসপনসিভ ৫-কলাম লেআউটে সাজানো হয়েছে যেখানে প্রথম কলামে ধারাবাহিকভাবে 'PI Date *' এবং 'PI Number *' (পূর্বের 'PI Nr.' থেকে পরিবর্তিত) অবস্থান করছে; (২) Booking Information সেকশন: বাটনটির নাম পরিবর্তন করে 'Add Another Booking' করা হয়েছে। কঠোর সাপ্লায়ার ফিল্টারিং নিশ্চিত করা হয়েছে যাতে শুধুমাত্র বর্তমান পিআই-এর নির্বাচিত সাপ্লায়ারের (যেমন: Pakiza Knitting & Dyeing) বুকিংগুলোই তালিকায় দৃশ্যমান হয়; (৩) সাপ্লায়ার সামঞ্জস্যতা ভ্যালিডেশন: ভিন্ন কোনো সাপ্লায়ারের বুকিং থাকলে সাবমিট রোধ করতে সতর্কবার্তা 'All bookings added to a single Proforma Invoice must belong to the same supplier.' প্রদর্শন করা হয়েছে; (৪) Booking Information টেবিল ও পপুলেট কন্ট্রোল: 'V' বাটনটির নাম পরিবর্তন করে 'P' এবং টেবিল কলাম হেডার 'P to Populated' করা হয়েছে। 'P' বাটনে ক্লিক করলে বুকিং আইটেমগুলো নিচে Booking Details টেবিলে নিখুঁতভাবে লোড হয় এবং বারবার ক্লিকে ডুপ্লিকেট আইটেম তৈরি হওয়া সম্পূর্ণ প্রতিরোধ করা হয়েছে; (৫) সমন্বিত Booking Details: সকল যুক্ত বুকিংয়ের আইটেমসমূহ সোর্স বুকিং নম্বর, বায়ার, জব আইডি, স্টাইল, ফেব্রিক ডেসক্রিপশন, কালার, পরিমাণ, ইউনিট, রেট ও মোট মূল্যসহ দৃশ্যমান থাকে; (৬) স্যাম্পল ফেব্রিক বুকিং টেস্ট ডেটা: Pakiza Knitting & Dyeing সাপ্লায়ারের জন্য বিভিন্ন জব ও স্টাইল সম্বলিত বাস্তবসম্মত বুকিং রেকর্ড (JOB-2026-0002/01, JOB-2026-0003/01, JOB-2026-0003/02, JOB-2026-0004/01) লোকাল স্টোরেজে নিরাপদে সিড করা হয়েছে; (৭) Additional Charge সেকশন: Particulars ফিল্ডটিকে নির্দিষ্ট ড্রপডাউনে রূপান্তর করা হয়েছে এবং একই চার্জের পুনরাবৃত্তি প্রতিরোধ করা হয়েছে। পজিটিভ ও নেগেটিভ অ্যামাউন্ট (যেমন: -150.00 ডিডাকশন) সমর্থন করে যা মোট পিআই ভ্যালু থেকে স্বয়ংক্রিয়ভাবে বিয়োগ হয়; (৮) ফুটার বাটন পরিচ্ছন্নকরণ: ফুটার থেকে 'LC Breakup' এবং 'View List' বাটন দুটি সম্পূর্ণ অপসারণ করা হয়েছে এবং 'Attachment' বাটন যথাস্থানে বহাল রাখা হয়েছে; (৯) ডকুমেন্ট স্টোরেজ Attachment মোডাল: রেফারেন্স অনুযায়ী File Storage এবং Image Storage ট্যাব, ৩ মেগাবাইট ফাইল সাইজ লিমিট ভ্যালিডেশন, ৯-কলামের পূর্ণাঙ্গ টেবিল, মেটাডাটা রি-রাইট, ডাউনলোড এবং রিমুভ সুবিধাসহ 'cripton_mm_pi_attachments_v1'-এ ব্রাউজার লোকাল স্টোরেজে স্থায়ীভাবে সংরক্ষণ করা হয়েছে।"
  },
  {
    "id": "572",
    "date": "2026-10-22T11:40",
    "type": "Enhancement & Bug Fix — Proforma Invoice Entry Form UI Modifications & Functional Requirements",
    "module": "Marketing & Merchandising / Proforma Invoice",
    "link": "/mm-proforma-invoice-create",
    "descriptionEn": "Implemented the 12-page Proforma Invoice Entry Form UI Modifications and Functional Requirements: (1) General Form-Level: Removed standalone Entry field outside main sections and removed PI Total (BDT) display; (2) Section A (PI Information Section): Renamed section heading to 'PI Information Section'; retained exactly the 9 required fields (Source [Nominated, Open], Item [Fabric, Accessories], Supplier [read-only, populated from Fabric Booking], Merchan. [defaults to user's merchant], PI Date, PI Nr., Pay Term, Del Mode, and BBLC No [read-only, populated from booking/commercial data]); removed 15 deprecated fields (Entry No, Date, Waiting?, PI Status, LC Open Dt, LC Type, Imp Unit, Prvs. PI, Prvs Val, Amnd. Reason, Del Place, Priority Level, BDT@ Exchange, USD@ Exchange, Doc No); (3) Supplier & Booking Validation: Populated Supplier automatically from first booking and enforced strict same-supplier consolidation blocking any different-supplier booking with validation message 'All bookings included in one Proforma Invoice must belong to the same supplier.'; (4) Section B (Booking Information): Renamed heading to 'Booking Information'; removed 4 columns (Del Date, Afft. Gmt. Qty, BB, Ref) retaining Booking No, Booking Desc, Date, Amount ($), Del.Mode, V button, and Action; (5) Critical Functional Fix — Booking Row V Button: Clicking 'V' retrieves and displays fabric booking items matching the exact booking ID (with Job ID, buyer, style, color, unit, rate, amount) without duplicating or mixing with other bookings, displaying clear empty-state messaging when no items match; (6) Section C (Booking Details): Renamed heading to 'Booking Details'; renamed 'Our Ref' to 'Job ID'; removed 4 columns (Qty(Dz), Description, Dz Consump, Amount in Tk) while retaining Buyer, Season, Job ID, Affected Gmt.Qty, ITEM, Item Qty, Unit, Unit Rate, and Amount ($); (7) Section D (Notes and Comments): Renamed heading to 'Notes and Comments'; removed 'Commts>' button while retaining Note textarea; (8) Section E (Additional Charge): Renamed heading to 'Additional Charge' and removed the dollar symbol from the heading; converted Particulars into a searchable datalist from master data; enabled positive and negative amounts where negative values reduce the total; removed Amount in Tk column and BDT total; (9) Section 11 (Consolidated Proforma Invoice Totals): Renamed heading to 'Consolidated Proforma Invoice Totals'; removed 'Fabric Items Value (2 items)' card and removed BDT rate badge/totals; displayed net signed additional charges and final consolidated USD grand total; (10) Submit Button: Replaced and moved Passed>> button to the right side of the action area as a prominent 'Submit' button with full mandatory validation, same-supplier verification, and Local Storage saving without approval or passing side-effects.",
    "descriptionBn": "১২-পৃষ্ঠার স্পেসিফিকেশন অনুযায়ী Marketing & Merchandising মডিউলের Proforma Invoice Entry ফর্মে ইউআই পরিমার্জন ও ফাংশনাল বাগ সমাধান সম্পন্ন করা হয়েছে: (১) সাধারণ পেজ পরিবর্তন: মূল সেকশনের বাইরে থাকা স্ট্যান্ডঅ্যালোন Entry ফিল্ড এবং PI Total (BDT) প্রদর্শন সম্পূর্ণ অপসারণ করা হয়েছে; (২) Section A (PI Information Section): সেকশনের শিরোনাম পরিবর্তন করে 'PI Information Section' করা হয়েছে; শুধুমাত্র প্রয়োজনীয় ৯টি ফিল্ড রাখা হয়েছে (Source [Nominated, Open], Item [Fabric, Accessories], Supplier [রিড-অনলি, ফেব্রিক বুকিং থেকে স্বয়ংক্রিয়ভাবে আসা], Merchan. [ডিফল্ট মার্চেন্ট সিলেক্টেড], PI Date, PI Nr., Pay Term, Del Mode এবং BBLC No [রিড-অনলি]); ১৫টি অপ্রয়োজনীয় ফিল্ড (Entry No, Date, Waiting?, PI Status, LC Open Dt, LC Type, Imp Unit, Prvs. PI, Prvs Val, Amnd. Reason, Del Place, Priority Level, BDT@ Exchange, USD@ Exchange, Doc No) সম্পূর্ণ সরানো হয়েছে; (৩) সাপ্লায়ার ও বুকিং ভ্যালিডেশন: প্রথম বুকিং থেকে সাপ্লায়ার স্বয়ংক্রিয়ভাবে সেট হয় এবং ভিন্ন কোনো সাপ্লায়ারের বুকিং যুক্ত করতে গেলে তাৎক্ষণিক সতর্কবার্তা 'All bookings included in one Proforma Invoice must belong to the same supplier.' দেখিয়ে বাতিল করে; (৪) Section B (Booking Information): সেকশনের নাম 'Booking Information' করা হয়েছে; ৪টি কলাম (Del Date, Afft. Gmt. Qty, BB, Ref) অপসারণ করে Booking No, Desc, Date, Amount ($), Del.Mode, V বাটন ও Action রাখা হয়েছে; (৫) 'V' বাটন সংক্রান্ত ক্রিটিক্যাল সমাধান: বুকিং রো-এর 'V' বাটনে ক্লিক করলে সেই নির্দিষ্ট বুকিং আইডির আওতাধীন ফেব্রিক বুকিং আইটেমসমূহ (Job ID, Buyer, Season, ITEM, Item Qty, Unit, Unit Rate, Amount $) নিখুঁতভাবে রিট্রিভ করে নিচে লোড করে এবং বারবার ক্লিকে ডুপ্লিকেট হওয়া সম্পূর্ণ প্রতিরোধ করে; (৬) Section C (Booking Details): সেকশন শিরোনাম 'Booking Details' করা হয়েছে; 'Our Ref'-এর নাম পরিবর্তন করে 'Job ID' করা হয়েছে; ৪টি কলাম (Qty(Dz), Description, Dz Consump, Amount in Tk) বাদ দিয়ে Buyer, Season, Job ID, Affected Gmt.Qty, ITEM, Item Qty, Unit, Unit Rate এবং Amount ($) বজায় রাখা হয়েছে; (৭) Section D (Notes and Comments): সেকশনের নাম পরিবর্তন এবং 'Commts>' বাটন অপসারণ করে নোট এডিটর রাখা হয়েছে; (৮) Section E (Additional Charge): সেকশনের নাম থেকে ডলার আইকন ($) সরানো হয়েছে; Particulars ফিল্ডটিকে মাস্টার-ডাটা ড্রপডাউন/ডাটা-লিস্টে রূপান্তর করা হয়েছে; নেগেটিভ অ্যামাউন্ট ইনপুটের সুবিধা দেওয়া হয়েছে যা মোট চার্জ থেকে বিয়োগ হয় এবং BDT কলাম ও মোট BDT সরানো হয়েছে; (৯) Section 11 (Consolidated Proforma Invoice Totals): সেকশনের নাম পরিবর্তন, 'Fabric Items Value (2 items)' কার্ড ও BDT টোটাল বাদ দিয়ে নেট অতিরিক্ত চার্জ ও ফাইনাল USD গ্র্যান্ড টোটাল প্রদর্শন করা হয়েছে; (১০) Submit বাটন: পূর্বের Passed>> বাটন সরিয়ে অ্যাকশন এরিয়ার ডান পাশে একটি আকর্ষণীয় 'Submit' বাটন স্থাপন করা হয়েছে যা পূর্ণ ভ্যালিডেশন শেষে লোকাল স্টোরেজে পিআই ডেটা সংরক্ষণ করে (কোনো পাসিং/অ্যাপ্রুভাল পার্শ্বপ্রতিক্রিয়া ছাড়া)।"
  },
  {
    "id": "571",
    "date": "2026-10-22T01:45",
    "type": "New Feature — ERP Proforma Invoice Entry Form & Fabric Booking Multi-Consolidation",
    "module": "Marketing & Merchandising / Proforma Invoice",
    "link": "/mm-proforma-invoice-create",
    "descriptionEn": "Implemented the full 17-page Proforma Invoice Entry Form specification in Marketing & Merchandising based on the Pridesys Synergy ERP reference: (1) Fabric Booking Integration: Clicking 'Proforma Invoice Create' in Fabric Booking seamlessly routes to /mm-proforma-invoice-create with source booking ID, auto-populating Supplier, entry metadata, and source items without duplicates; (2) Section A (PI Main Information): Built 24 standard ERP fields including auto-generated Entry No (ENT-PI-xxx), Date, Source, Waiting? checkbox, Item ('Fabric'), auto-populated Supplier, PI Status workflow, Merchan., LC Open Dt, LC Type, Imp Unit, Prvs. PI, Prvs Val, Amnd. Reason, PI Date, PI Nr. (PI-{Supplier}-{Year}-{Seq}), Pay Term, Del Mode, Del Place, Priority Level, live BDT@ & USD@ exchange rates, BBLC No, and Doc No; (3) Section B (Booking Information Table): Integrated multi-booking table (Booking No, Booking Desc, Date, Amount $, Del.Mode, Del Date, Afft. Gmt. Qty, V, BB, Ref, and safe remove draft action); (4) Strict Same-Supplier Consolidation: Searchable '+ Add Additional Booking' dialog enforces same-supplier rules, rejecting any booking belonging to a different supplier with a clear explanatory validation banner; (5) Section C (Ref. Details Table) & Dynamic 'V' Switcher: Each attached booking features its own 'V' action button which dynamically loads that booking's itemized fabric details (Buyer, Season, Our Ref/Job ID, Afft. Gmt. Qty, Qty Dz, ITEM, Description, Dz Consump, Item Qty, Unit, Unit Rate, Amount $, Amount in Tk) without mutating other bookings or duplicating items; (6) Section D (Notes & Comments): Implemented dedicated PI note area and interactive 'Commts>' modal preserving audit logs; (7) Section E (Additional Charges): Dynamic charge table (Particulars, Note, Amount $, Amount in Tk) with live conversion and add/delete rows; (8) Section 11 (PI Total Valuation Engine): Calculated live grand totals strictly summing ALL attached bookings' items plus additional charges in separate USD ($) and BDT (৳) balances without mixing currencies or restricting to visible Ref. Details; (9) Section 12 (ERP Bottom Toolbar & Modals): Implemented Passed>> action with validation guards, View List (PI Register with search, date range, and status filters), formal printable PI Preview modal, LC Breakup modal, Edit toggle, and Attachment manager; (10) Data Integrity: Full browser Local Storage persistence under 'cripton_mm_proforma_invoices_v1' ensuring drafts and relationships are fully preserved on refresh while keeping underlying Fabric Bookings intact.",
    "descriptionBn": "Pridesys Synergy ERP রেফারেন্স মডেল ও ১৭-পৃষ্ঠার স্পেসিফিকেশন অনুযায়ী Marketing & Merchandising মডিউলে সম্পূর্ণ Proforma Invoice Entry Form বাস্তবায়ন সম্পন্ন করা হয়েছে: (১) Fabric Booking ইন্টিগ্রেশন: ফেব্রিক বুকিং ফর্মে 'Proforma Invoice Create' বাটনে ক্লিক করলে সোর্স বুকিং আইডিসহ সরাসরি /mm-proforma-invoice-create রাউটে আসে এবং স্বয়ংক্রিয়ভাবে সাপ্লায়ার, বুকিং ইনফরমেশন ও ফেব্রিক আইটেমসমূহ যুক্ত করে (ডুপ্লিকেট প্রতিরোধ সহ); (২) Section A (PI Main Information): ২৪টি সুবিন্যস্ত ERP ফিল্ড— স্বয়ংক্রিয় Entry No (ENT-PI-xxx), Date, Source, Waiting? চেকবক্স, Item ('Fabric'), অটো-পপুলেটেড Supplier, PI Status, Merchan., LC Open Dt, LC Type, Imp Unit, Prvs. PI, Prvs Val, Amnd. Reason, PI Date, PI Nr., Pay Term, Del Mode, Del Place, Priority Level, লাইভ BDT@ ও USD@ রেট, BBLC No এবং Doc No; (৩) Section B (Booking Information Table): মাল্টি-বুকিং টেবিল (Booking No, Desc, Date, Amount $, Del.Mode, Del Date, Afft. Gmt. Qty, V, BB, Ref এবং ড্রাফট থেকে রিমুভ কন্ট্রোল); (৪) কঠোর Same-Supplier ভ্যালিডেশন: সার্চেবল '+ Add Additional Booking' ডায়ালগে একই সাপ্লায়ারের বুকিং যাচাই করা হয় এবং ভিন্ন কোনো সাপ্লায়ারের বুকিং যুক্ত করতে গেলে তাৎক্ষণিক স্পষ্ট ভ্যালিডেশন সতর্কবার্তা দিয়ে তা বাতিল করে; (৫) Section C (Ref. Details Table) ও ডাইনামিক 'V' সুইচিং: প্রতিটি বুকিংয়ের নিজস্ব 'V' বাটন রয়েছে যাতে ক্লিকে শুধুমাত্র সেই নির্দিষ্ট বুকিংয়ের ফেব্রিক আইটেমসমূহ (Buyer, Season, Job ID, Gmt Qty, Qty Dz, ITEM, Description, Dz Consump, Item Qty, Unit, Rate, Amount $, Amount in Tk) নিচে লোড হয় (অন্যান্য বুকিং বিনষ্ট বা আইটেম ডুপ্লিকেট না করে); (৬) Section D (Notes & Comments): প্রফর্মা ইনভয়েস নোট এবং ইন্টারঅ্যাক্টিভ 'Commts>' মোডাল; (৭) Section E (Additional Charges): অতিরিক্ত চার্জ টেবিল (Particulars, Note, Amount $, Amount in Tk) যাতে লাইভ যোগ-বিয়োগের সুবিধা রয়েছে; (৮) Section 11 (PI Total ভ্যালুয়েশন ইঞ্জিন): সকল সংযুক্ত বুকিংয়ের আইটেম এবং অতিরিক্ত চার্জের সমন্বয়ে আলাদা USD ($) এবং BDT (৳) টোটাল হিসাব (শুধুমাত্র দৃশ্যমান টেবিলের উপর সীমাবদ্ধ না রেখে সম্পূর্ণ পিআই-এর সকল বুকিং নিয়ে নির্ভুল হিসাব); (৯) Section 12 (ERP বটম টুলবার ও মোডালসমূহ): ভ্যালিডেশন গার্ড সহ Passed>> বাটন, View List (সার্চ, ডেট রেঞ্জ ও স্ট্যাটাস ফিল্টার সম্বলিত PI রেজিস্টার), প্রিন্টযোগ্য ফরমাল Preview মোডাল, LC Breakup মোডাল, Edit বাটন এবং Attachment ম্যানেজার; (১০) ডেটা ইন্টিগ্রিটি: 'cripton_mm_proforma_invoices_v1'-এ ব্রাউজার লোকাল স্টোরেজ পারসিস্টেন্স বজায় রাখা হয়েছে যাতে রিফ্রেশ করলেও ড্রাফট ও রিলেশনশিপ অক্ষুণ্ণ থাকে এবং মূল Fabric Booking ডেটা সম্পূর্ণরূপে সংরক্ষিত থাকে।"
  },
  {
    "id": "570",
    "date": "2026-10-22T01:10",
    "type": "Fabric Booking Management — UI Refinement and Field-Level Changes",
    "module": "Marketing & Merchandising / Fabric Booking",
    "link": "/mm-fabric-booking",
    "descriptionEn": "Implemented the 14-page UI Refinement and Field-Level Changes specification for Fabric Booking Management: (1) Page-Level: Removed the descriptive subtitle and 'Fabric Booking Form (ERP 3-Section)' heading; removed the Bookings Register list component from the page while preserving persisted bookings in Local Storage; (2) Section A (Fabric Booking Information): Renamed 'Our Ref / Job ID *' to non-editable 'Job ID', renamed 'Book No. (Unique) *' to 'Book No. *' with Job ID-based sequential generation ({Job ID}/{Sequential Number}, e.g. JOB-2026-0001/01, /02), renamed 'Supplier (Master Data) *' to non-editable 'Supplier *'; removed 9 unused fields (CP, Status, Booking Desc., Load Port, Destination, Req Date, ETA Port, Fact. Date, Conv Rate @ $); made Delivery Date mandatory with validation error message; converted Del. Place into a dropdown with factory and warehouse options; (3) Section B (Style and PO Summary): Renamed section heading to 'Style and PO Summary' and table heading to 'Style and PO Summary Table'; removed descriptive text and 'Active: ...' badge while retaining row selection highlighting; renamed button to '+ Add Another Style'; removed Our Ref, Grp Type, and Total (USD) columns; renamed Book Amount (USD) and Budget Value (USD) removing (USD); positioned 'PO Dt.' (with 'D.' button) immediately right of Fabric Code; placed the 'V' calculation button immediately after Budget Value; (4) PO Allocation Table: Simplified heading strictly to 'PO Allocation Table' (removing fabric code and style badge); removed '+ Select POs (D.)' button; removed Sel, Lot, Country, Booked, and Balance columns, keeping PO No, GMT Color, GMT Qty, and Note; (5) Section C (Fabric Booking Details): Renamed section heading to 'Fabric Booking Details'; removed dynamic active item description and 'R> Standard' header button; removed Rcv? and R> columns; renamed Our Ref to Job ID, Rate (USD) * to Rate, and Total (USD) to Total; removed Pre-Cost Budget Value and completely removed the Cost Saving Target Status section; (6) Proforma Invoice Navigation: Renamed 'Proforma Booking Sheet' button to 'Proforma Invoice Create' navigating to placeholder route /mm-proforma-invoice-create preserving fabric booking data; (7) Data Integrity: Preserved full Local Storage persistence under 'cripton_mm_fabric_bookings_v1' with zero data regressions.",
    "descriptionBn": "১৪-পৃষ্ঠার স্পেসিফিকেশন অনুযায়ী Marketing & Merchandising মডিউলের Fabric Booking Management ফর্মে ফিল্ড-লেভেল ও ইউআই পরিমার্জন সম্পন্ন করা হয়েছে: (১) পেজ-লেভেল পরিবর্তন: বর্ণনামূলক সাবটাইটেল এবং 'Fabric Booking Form (ERP 3-Section)' হেডিং অপসারণ করা হয়েছে; পেজ থেকে Bookings Register কম্পোনেন্টটি বাদ দেওয়া হয়েছে (লোকাল স্টোরেজে সংরক্ষিত ডেটা অক্ষুণ্ণ রেখে); (২) Section A (Fabric Booking Information): 'Our Ref / Job ID *'-এর নাম পরিবর্তন করে নন-এডিটেবল 'Job ID' করা হয়েছে; 'Book No. (Unique) *'-এর নাম 'Book No. *' করা হয়েছে এবং Job ID-ভিত্তিক ধারাবাহিক বুকিং নম্বর জেনারেশন ফরম্যাট ({Job ID}/{Sequential Number}, যেমন: JOB-2026-0001/01, /02) নিশ্চিত করা হয়েছে; 'Supplier (Master Data) *' পরিবর্তন করে নন-এডিটেবল 'Supplier *' করা হয়েছে; ৯টি অপ্রয়োজনীয় ফিল্ড (CP, Status, Booking Desc., Load Port, Destination, Req Date, ETA Port, Fact. Date, Conv Rate @ $) সম্পূর্ণ সরানো হয়েছে; Delivery Date আবশ্যক (mandatory) করে ভ্যালিডেশন এরর মেসেজ যুক্ত করা হয়েছে; Del. Place ফিল্ডটিকে উপযুক্ত ডেলিভারি লোকেশন সম্বলিত ড্রপডাউনে রূপান্তর করা হয়েছে; (৩) Section B (Style and PO Summary): সেকশনের শিরোনাম 'Style and PO Summary' এবং টেবিলের নাম 'Style and PO Summary Table' করা হয়েছে; বর্ণনামূলক লেখা ও 'Active: ...' ব্যাজ অপসারণ করা হয়েছে (রো সিলেকশন হাইলাইট বজায় রেখে); বাটনটির নাম পরিবর্তন করে '+ Add Another Style' করা হয়েছে; Our Ref, Grp Type ও Total (USD) কলামগুলো সরানো হয়েছে; বুক অ্যামাউন্ট ও বাজেট ভ্যালু থেকে '(USD)' বাদ দেওয়া হয়েছে; Fabric Code-এর ঠিক ডানপাশে 'PO Dt.' কলাম (D. বাটন সহ) স্থাপন করা হয়েছে এবং Budget Value কলামের পরপরই 'V' ক্যালকুলেশন বাটন অবস্থান করানো হয়েছে; (৪) PO Allocation Table: টেবিল হেডিং সংক্ষেপ করে শুধুমাত্র 'PO Allocation Table' রাখা হয়েছে; '+ Select POs (D.)' বাটন সরানো হয়েছে; Sel, Lot, Country, Booked ও Balance কলামগুলো বাদ দিয়ে PO No, GMT Color, GMT Qty ও Note কলাম রাখা হয়েছে; (৫) Section C (Fabric Booking Details): সেকশন শিরোনাম 'Fabric Booking Details' করা হয়েছে; ডাইনামিক অ্যাক্টিভ আইটেম ডেসক্রিপশন ও 'R> Standard' হেডার বাটন বাদ দেওয়া হয়েছে; Rcv? ও R> কলাম অপসারণ করা হয়েছে; Our Ref পরিবর্তন করে Job ID, Rate (USD) * পরিবর্তন করে Rate এবং Total (USD) পরিবর্তন করে Total করা হয়েছে; Pre-Cost Budget Value প্রদর্শন এবং সম্পূর্ণ Cost Saving Target Status সেকশনটি ইউআই থেকে বাদ দেওয়া হয়েছে; (৬) Proforma Invoice নেভিগেশন: 'Proforma Booking Sheet' বাটনের নাম পরিবর্তন করে 'Proforma Invoice Create' করা হয়েছে এবং এটি /mm-proforma-invoice-create রাউটে নেভিগেট করে (পূর্বের বুকিং তথ্য সংরক্ষণ সহ); (৭) ডেটা ইন্টিগ্রিটি: 'cripton_mm_fabric_bookings_v1'-এ ব্রাউজার লোকাল স্টোরেজ পারসিস্টেন্স বজায় রাখা হয়েছে যাতে পূর্বের কোনো ডেটা বিনষ্ট না হয়।"
  },
  {
    "id": "569",
    "date": "2026-10-21T23:55",
    "type": "Fabric Booking Workflow Correction & ERP Reference UI Implementation",
    "module": "Marketing & Merchandising / Fabric Booking",
    "link": "/mm-fabric-booking",
    "descriptionEn": "Corrected and enhanced the Marketing & Merchandising Fabric Booking screen according to the 22-page ERP specification: (1) Section B 2-Column Split: Positioned Style & Fabric Summary table on the left with interactive row selection and visual active highlight, and dynamic PO Allocation table on the right displaying isolated allocations strictly belonging to the currently selected fabric item; (2) Critical 'D.' Button & PO Selection Modal: Clicking 'D.' opens a dedicated dialog featuring non-editable header cards (Our Ref/Job ID, Style, Fabric Code, Fabric Description), live search bar, Select-All toggle, and a multi-select table with Checkbox, Lot, PO No, Color, Country, Order Qty, Booked Order Qty, and Balance. Unsaved changes are safely discarded on 'Back' and applied on 'OK'; (3) Isolated Allocation State & PO Checkboxes: Each fabric item maintains its own independent PO allocation records with include/exclude calculation checkboxes in the right-side allocation table; (4) Critical 'V' Button Calculation Engine: Placed 'V' button beside Book Amount in Section B. Clicking 'V' validates selected POs and Fabric Estimation linkages, looks up Garment Color to Fabric Color mappings, calculates exact required fabric quantities using garment order quantities, consumption, unit basis, and wastage %, and populates color-wise rows in Section C Fabric Booking Details without creating duplicate rows; (5) Section C Fabric Booking Details: Implemented full ERP table structure (Rcv?, Our Ref, Used Place, Fab Code, Fabric Description, Width, Color, Req Qty, Unit, editable Book Qty, Rcvd Qty, 'R>' rounding toggle, editable Rate, and Line Total) with synchronized recalculations and footer summaries; (6) Multi-Style Booking & Supplier Validation: Enabled consolidating multiple styles under the same supplier with strict validation preventing accidental supplier mismatching; (7) Seamless Fabric Estimation Integration & Local Storage Persistence: Fabric Estimation 'Booking' button carries full context and immediately activates the transferred line in Fabric Booking, while maintaining full data persistence under 'cripton_mm_fabric_bookings_v1'.",
    "descriptionBn": "২২-পৃষ্ঠার ERP স্পেসিফিকেশন ও রেফারেন্স অনুযায়ী Marketing & Merchandising মডিউলের Fabric Booking স্ক্রিনের যাবতীয় ওয়ার্কফ্লো সংশোধন ও উন্নয়ন সম্পন্ন করা হয়েছে: (১) Section B দ্বি-কলাম লেআউট: বাম পাশে Style & Fabric Summary টেবিল (ইন্টারেক্টিভ রো সিলেকশন ও স্পষ্ট হাইলাইট সহ) এবং ডান পাশে Dynamic PO Allocation টেবিল স্থাপন করা হয়েছে, যা শুধুমাত্র বর্তমানে নির্বাচিত ফেব্রিক আইটেমের জন্য বরাদ্দকৃত PO গুলো প্রদর্শন করে; (২) 'D.' বাটন ও PO Selection মোডাল: 'D.' বাটনে ক্লিকে একটি স্বতন্ত্র মোডাল ওপেন হয় যাতে রিড-অনলি হেডার কার্ডস (Our Ref/Job ID, Style, Fabric Code, Description), লাইভ সার্চ বার, সিলেক্ট-অল টগল এবং চেকবক্স, Lot, PO No, Color, Country, Order Qty, Booked Order Qty ও Balance কলাম সম্বলিত টেবিল রয়েছে— 'Back' বাটনে ক্লিক করলে অসংরক্ষিত পরিবর্তন বাতিল হয় এবং 'OK' বাটনে ক্লিক করলে নির্বাচন সংরক্ষিত হয়; (৩) আইসোলেটেড এলোকেশন স্টেট ও চেকবক্স: প্রতিটি ফেব্রিক আইটেমের নিজস্ব স্বতন্ত্র PO এলোকেশন স্টেট সংরক্ষিত থাকে এবং ডান পাশের টেবিলে চেকবক্সের মাধ্যমে নির্দিষ্ট PO লাইন অন্তর্ভুক্ত বা বাদ দেওয়া যায়; (৪) 'V' বাটন ক্যালকুলেশন ইঞ্জিন: Section B-এর Book Amount-এর পাশে 'V' বাটন স্থাপন করা হয়েছে। 'V' বাটনে ক্লিক করলে PO সিলেকশন ও ফেব্রিক এস্টিমেশন যাচাই করে, Garment Color থেকে Fabric Color ম্যাপিং রিট্রিভ করে এবং গার্মেন্ট কোয়ান্টিটি, কনজাম্পশন ও ওয়েস্টেজ % অনুযায়ী নিখুঁত রিকোয়ার্ড ফেব্রিক কোয়ান্টিটি হিসাব করে Section C Fabric Booking Details-এ কালার-ভিত্তিক রো পপুলেট করে (বারবার ক্লিকে ডুপ্লিকেট তৈরি হওয়া সম্পূর্ণ প্রতিরোধ করা হয়েছে); (৫) Section C Fabric Booking Details: ERP স্ট্যান্ডার্ড অনুযায়ী পূর্ণাঙ্গ টেবিল স্ট্রাকচার (Rcv?, Our Ref, Used Place, Fab Code, Description, Width, Color, Req Qty, Unit, এডিটেবল Book Qty, Rcvd Qty, 'R>' রাউন্ডিং বাটন, এডিটেবল Rate ও Line Total) এবং লাইভ রিক্যালকুলেশন ও সামারি টোটাল নিশ্চিত করা হয়েছে; (৬) মাল্টি-স্টাইল বুকিং ও সাপ্লায়ার ভ্যালিডেশন: একই সাপ্লায়ারের অধীনে একাধিক ভিন্ন ভিন্ন স্টাইলের ফেব্রিক আইটেম বুকিংয়ে যুক্ত করার সুবিধা এবং ভুল সাপ্লায়ার একত্রীকরণ রোধে কঠোর ভ্যালিডেশন দেওয়া হয়েছে; (৭) ফেব্রিক এস্টিমেশন ইন্টিগ্রেশন ও পারসিস্টেন্স: Fabric Estimation-এর Booking বাটনে ক্লিক করলে সম্পূর্ণ রেফারেন্স ও কনটেক্সট সহ Fabric Booking ফর্মে আসে এবং সরাসরি সংশ্লিষ্ট আইটেম সিলেক্টেড থাকে, এবং 'cripton_mm_fabric_bookings_v1'-এ ব্রাউজার লোকাল স্টোরেজে স্থায়ীভাবে সংরক্ষিত হয়।"
  },
  {
    "id": "568",
    "date": "2026-10-20T23:15",
    "type": "New Feature & Workflow Integration — Full ERP Fabric Booking Form & Estimation Navigation",
    "module": "Marketing & Merchandising / Fabric Booking Management",
    "link": "/mm-fabric-booking",
    "descriptionEn": "Implemented the full enterprise Fabric Booking Management workflow and seamless Fabric Estimation → Fabric Booking navigation based on the 36-page ERP specification: (1) Seamless Row Booking Navigation: Clicking the Booking button on any fabric item row in Fabric Estimation auto-saves current estimation state, packages complete transfer payload (Job ID, Buyer, Style, Pre-Costing refs, Fabric Code, Description, Width, Used Place, Unit, Rate, Require Qty, and PO breakdown allocations) and navigates directly to the 3-Section Fabric Booking Form with pre-loaded context; (2) Section A: Fabric Booking Information Header: Arranged in clean, balanced ERP rows featuring Our Ref, unique persistent Book No. (auto-generated e.g. FB-2026-0035 with regeneration trigger), searchable Supplier Master lookup modal, CP (Contact Person), Status workflow dropdown, Booking Description, Booking Date, Del. Mode (Road/Sea/Air), Load Port, Destination, Req Date, Delivery Date, ETA Port, Factory Date, Booking Type, Booking Unit, Del. Place, Currency ($/€/৳/£), Conversion Rate, Payment Mode, Notes, and interactive Terms & Conditions modal; (3) Section B: Style and Fabric Summary Grid: Multi-record summary displaying Our Ref, Style, Fabric Code, Grp Type, Book Amount, Budget Value, and Line Total, with a dedicated '+ Add Fabric Item' modal to consolidate multiple styles under the same nominated supplier while preventing duplicate lines and supplier mismatches; (4) The 'D' Button & PO Allocation Interface (Option C): Each fabric item summary row features a distinct 'D' button opening the PO Allocation dialog (Lot, PO No., Color, Country, Order Qty in Pcs, Booked Order Qty, Balance) automatically calculating suggested booking quantities from estimation consumption with full manual editing support, inline overbooking warnings, exception justification reason fields, and Select All / OK / Cancel controls; (5) Section C: Fabric Booking Details Grid: Itemized tracking with Rcv? checkbox, Our Ref, Used Place, Fab Code, Description (read-only from Fabric Master), Width, Color, Req Qty, Unit, editable Book Qty with live recalculation, Rcvd Qty, editable Rate, 'R>' rounding toggle, Line Total, summary totals, and Cost Saving target analytics; (6) Proforma Sheet & Navigation: Built comprehensive printable Proforma Fabric Booking Sheet with 4-tier signature blocks and Back to Estimation navigation preserving unsaved parent order and estimation data; (7) Local Storage Persistence: Secure persistence under 'cripton_mm_fabric_bookings_v1' maintaining synchronized booked status and booking numbers across Fabric Estimations.",
    "descriptionBn": "৩৬-পৃষ্ঠার পূর্ণাঙ্গ ERP স্পেসিফিকেশন ও রেফারেন্স মডেল অনুযায়ী Marketing & Merchandising মডিউলে সম্পূর্ণ Fabric Booking Management এবং Fabric Estimation → Fabric Booking নির্বিঘ্ন নেভিগেশন বাস্তবায়ন করা হয়েছে: (১) অটোমেটিক ডেটা ট্রান্সফার ও বুকিং বাটন নেভিগেশন: ফেব্রিক এস্টিমেশন গ্রিডের প্রতিটি রো-এর Booking বাটনে ক্লিক করার সাথে সাথে বর্তমান এস্টিমেশনের ডেটা লোকাল স্টোরেজে স্বয়ংক্রিয়ভাবে সংরক্ষিত হয় এবং Job ID, বায়ার, স্টাইল, প্রি-কস্টিং রেফারেন্স, ফেব্রিক কোড, বিবরণ, প্রস্থ, ব্যবহারস্থল, ইউনিট, রেট, প্রয়োজনীয় কোয়ান্টিটি ও PO ব্রেকডাউন সহ সম্পূর্ণ ট্রান্সফার পেলোড নিয়ে সরাসরি ৩-সেকশন বিশিষ্ট Fabric Booking ফর্মে নেভিগেট করে; (২) Section A: Fabric Booking Information (হেডার): পরিচ্ছন্ন ERP রো লেআউটে সাজানো হেডার যাতে রয়েছে Our Ref (Job ID), ইউনিক ও স্থায়ী Book No. (স্বয়ংক্রিয় জেনারেটেড FB-2026-0035 সহ রিফ্রেশ বাটন), সার্চেবল Supplier Master লুকআপ মোডাল, CP (Contact Person), স্ট্যাটাস ড্রপডাউন (Draft, Saved, Pending Approval, Approved, Rejected, Cancelled), বুকিং বিবরণ, বুকিং তারিখ, ডেলিভারি মোড (Road/Sea/Air), লোড পোর্ট, গন্তব্য, রিকোয়ার্ড ও ডেলিভারি তারিখ, ETA পোর্ট, ফ্যাক্টরি ডেট, বুকিং টাইপ, বুকিং ইউনিট, ডেলিভারি প্লেস, কারেন্সি ($/€/৳/£), কনভার্সন রেট, পেমেন্ট টার্মস, নোট এবং এডিটেবল Terms & Conditions মোডাল; (৩) Section B: Style and Fabric Summary গ্রিড: Our Ref, Style, Fabric Code, Grp Type, Book Amount, Budget Value এবং Line Total কলাম সম্বলিত সামারি টেবিল, সাথে একই সাপ্লায়ারের অধীনে একাধিক ভিন্ন ভিন্ন স্টাইলের ফেব্রিক আইটেম বুকিংয়ে অন্তর্ভুক্ত করার জন্য '+ Add Fabric Item' মোডাল (ডুপ্লিকেট ও সাপ্লায়ার অমিল প্রতিরোধ ব্যবস্থা সহ); (৪) 'D' বাটন ও PO Allocation ইন্টারফেস (Option C): প্রতিটি ফেব্রিক আইটেমের পাশে স্বতন্ত্র 'D' বাটন যা ক্লিকে PO Allocation মোডাল ওপেন করে (Lot, PO No., Color, Country, Order Qty pcs, Booked Order Qty, Balance)— এতে Option C ইঞ্জিন স্বয়ংক্রিয়ভাবে কনজাম্পশন অনুযায়ী প্রস্তাবিত বুকিং কোয়ান্টিটি হিসাব করে এবং ব্যবহারকারীকে ম্যানুয়ালি পরিবর্তনের সুযোগ দেয়, অতিরিক্ত বুকিংয়ের ক্ষেত্রে ওয়ার্নিং ও জাস্টিফিকেশন ইনপুট এবং Select All / OK / Cancel কন্ট্রোল নিশ্চিত করা হয়েছে; (৫) Section C: Fabric Booking Details গ্রিড: Rcv? চেকবক্স, Our Ref, Used Place, Fab Code, Description (ফেব্রিক মাস্টার থেকে রিড-অনলি), Width, Color, Req Qty, Unit, এডিটেবল Book Qty (রিয়েল-টাইম ক্যালকুলেশন সহ), Rcvd Qty, এডিটেবল Rate, 'R>' রাউন্ডিং টগল বাটন, লাইন টোটাল, সামারি টোটাল এবং কস্ট সেভিং টার্গেট অ্যানালিটিক্স বার; (৬) প্রফর্মা বুকিং শিট ও ব্যাক নেভিগেশন: ৪-স্তর বিশিষ্ট সিগনেচার ব্লক সহ প্রিন্টযোগ্য Proforma Fabric Booking Sheet এবং পূর্বের এস্টিমেশন ডেটা অক্ষুণ্ণ রেখে Back to Estimation নেভিগেশন; (৭) লোকাল স্টোরেজে সংরক্ষণ: 'cripton_mm_fabric_bookings_v1'-এ পূর্ণাঙ্গ বুকিং ও PO এলোকেশন সংরক্ষণ এবং ফেব্রিক এস্টিমেশনে বুকিং রেফারেন্স সিনক্রোনাইজেশন নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "567",
    "date": "2026-10-20T22:15",
    "type": "Fabric Estimation Form UI Corrections — Header Subtitle Removal, Searchable Pre-Cost Items & Row Booking Action",
    "module": "Marketing & Merchandising / Fabric Estimation",
    "link": "/mm-order-entry",
    "descriptionEn": "Implemented targeted corrections and enhancements to the Fabric Estimation module: (1) Header Subtitle Removal: Completely eliminated the text '— Pridesys Synergy ERP Fabric Consumption, Cost Breakdown & Color Mapping Specification' from the layout title bar and rendered UI; (2) Reference Section Cleanup: Removed Active Source, Buyer, and Order QTY selection indicators from the Reference & Search Information card; (3) Commercial Reference Section: Completely removed explanatory sentence ('Commercial downstream relationships preserved for material booking, PI generation, and commercial L/C workflows') while preserving Booking No., PI No., and BBLC No. fields intact; (4) Fabric Details Info Grid: Removed the Market Unit column with grid layout and alignment preserved; updated Color field to display strictly a single button labeled 'D. Color' (eliminating any '+ Add Color' buttons) with color mapping count badge, opening the Fabric Color Entry modal with row-level association; converted Pre Costing Item from a dropdown to a searchable list modal with code, description, body part, unit rate, and nominated supplier; made Fabric Description read-only auto-populated from Fabric Master code; restored the Booking button for every fabric row in a sticky action column ('Actions') opening a contextual Fabric Item Booking modal with Job ID, Pre-Costing ref, item description, code, width, SKU, and require qty with direct link to /mm-fabric-booking; (5) Consumption & Cost Calculation: Removed the Unit field from the section, organizing the remaining 9 input and derived calculation fields into a clean, aligned, balanced responsive grid while keeping all underlying math derivations intact.",
    "descriptionBn": "Fabric Estimation ফর্মে নির্দিষ্ট কারেকশন ও উন্নয়ন সম্পন্ন করা হয়েছে: (১) হেডার সাবটাইটেল সম্পূর্ণ অপসারণ: লেআউট টাইটেল বার ও রেন্ডার হওয়া স্ক্রিন থেকে '— Pridesys Synergy ERP Fabric Consumption, Cost Breakdown & Color Mapping Specification' লেখাটি সম্পূর্ণ মুছে ফেলা হয়েছে; (২) রেফারেন্স সেকশন পরিষ্কারকরণ: Reference & Search Information কার্ড থেকে Active Source, Buyer এবং Order QTY ইন্ডিকেটর ফিল্ডগুলো বাদ দেওয়া হয়েছে; (৩) কমার্শিয়াল রেফারেন্স সেকশন: 'Commercial downstream relationships preserved...' ব্যাখ্যামূলক বাক্যটি সম্পূর্ণ অপসারণ করা হয়েছে এবং Booking No., PI No., ও BBLC No. ফিল্ডগুলো যথাযথ অক্ষুণ্ণ রাখা হয়েছে; (৪) Fabric Details Info গ্রিড: গ্রিড থেকে Market Unit কলামটি বাদ দেওয়া হয়েছে; Color ফিল্ডে পূর্বে থাকা '+ Add Color' বাটনটি পুরোপুরি সরিয়ে শুধুমাত্র একটি 'D. Color' বাটন রাখা হয়েছে যা রো-লেভেলে কালার এন্ট্রি মোডাল ওপেন করে; Pre Costing Item ফিল্ডটিকে সাধারণ ড্রপডাউনের বদলে একটি সার্চেবল লিস্ট মোডালে রূপান্তর করা হয়েছে যাতে আইটেম কোড, বিবরণ, বডি পার্ট, ইউনিট রেট এবং মনোনীত সাপ্লায়ার সহ সার্চ ও সিলেক্ট করা যায়; Fabric Description ফিল্ডটিকে পাঠযোগ্য (read-only) করা হয়েছে যা ফেব্রিক কোড সিলেক্ট করলে নিজে থেকেই বসে যায় কিন্তু ম্যানুয়ালি পরিবর্তন করা যায় না; প্রতিটি ফেব্রিক রো-এর ডান প্রান্তে স্টিকি অ্যাকশন কলামে একটি Booking বাটন যুক্ত করা হয়েছে যা Job ID, প্রি-কস্টিং রেফারেন্স, ফেব্রিক আইটেম, কোড, বিবরণ, প্রস্থ, SKU এবং প্রয়োজনীয় পরিমাণ সহ কনটেক্সট সম্বলিত বুকিং ইন্টারফেস মোডাল ওপেন করে এবং /mm-fabric-booking-এ সরাসরি নেভিগেট করার সুবিধা দেয়; (৫) কনজাম্পশন ও কস্টিং হিসাব: সেকশনটি থেকে Unit ফিল্ডটি অপসারণ করা হয়েছে এবং বাকি ৯টি ইনপুট ও ডেরিভেটিভ ক্যালকুলেশন ফিল্ডকে একটি পরিচ্ছন্ন, সারিবদ্ধ ও সুষম গ্রিডে সাজানো হয়েছে।"
  },
  {
    "id": "566",
    "date": "2026-10-20T21:15",
    "type": "Fabric Estimation Form Enhancements — Searchable Master Lists, Color Mapping & Pre-Costing Integration",
    "module": "Marketing & Merchandising / Fabric Estimation",
    "link": "/mm-order-entry",
    "descriptionEn": "Completed comprehensive form simplification, master data integration, and workflow enhancements to the Fabric Estimation module based on the latest specification: (1) Header Cleanup: Removed the descriptive subtitle and Pridesys Synergy ERP badge, renaming 'Order Ref:' to 'Job ID:'; (2) Reference & Search Simplification: Completely removed Find QTN and 12 redundant reference fields (Our Ref, Buyer Ref, O/Date, Buyer, Item Name, Packing Type, LC Basis, Quantity, Rate, Unit, Place, Note) leaving a clean search section; (3) Searchable Find Job ID: Renamed Find Our Ref to Find Job ID, opening a searchable structured table modal (JOB ID, Buyer, Style, Order QTY) with live search and highlighting, loading previously saved fabric estimation records for that job with overwrite confirmation protection; (4) Searchable Find Pre Costing: Renamed Find Budget to Find Pre Costing, opening a searchable structured table modal (Pre Costing ID, JOB ID, Buyer, Style, Order QTY), loading fabric items specifically associated with that Pre-Costing record (category === 'Fabric') with Pre Costing Item linkages preserved; (5) Separate Commercial Reference Section: Created a visually distinct adjacent section for Booking No., PI No., and BBLC No., maintaining downstream relationships for fabric booking, proforma invoicing, and back-to-back letters of credit; (6) Fabric Details Info Grid: Renamed section to Fabric Details Info, defaulted Inhouse? to unchecked (false) for new rows, completely removed the Fabric No column from the visible grid, replaced Used Place option 'Trim' with 'Shell', renamed Budget Item to Pre Costing Item with a contextual dropdown showing fabric items from the active Pre-Costing record; (7) Searchable Fabric Master & SKU Auto-Population: Renamed Code to Fabric Code with a searchable modal table (Fabric Code, Fabric Description, Width, Unit), auto-populating Fabric Description, Width, and setting SKU strictly from the fabric's Unit value; (8) Size-Wise Cons Column Removal: Removed Size Wise Cons column and associated UI controls from the visible grid; (9) Color Entry & Single Color 'P' Button: Removed standalone Add Color button from the grid; in the Fabric Color Entry modal, selecting 'Single Color' exposes an inline 'Color Name' input and a 'P' button that instantly populates the Item Color mapping across rows with the entered color while preserving DTM/Contrast modes; (10) Searchable Supplier Master Selection: Linked Supplier column to a searchable modal displaying registered suppliers from Supplier Master data; (11) Simplified Consumption & Cost Calculation: Locked Order Qty to non-editable read-only pulling from the active job, completely hid 6 bulk calculation fields (Bulk Cons, Bulk W%, Cons/Pc Bulk, Cons/Dz Bulk, Cost/Pc Bulk, Require Qty Bulk); (12) Bottom Actions & Submit Workflow: Removed View List, Req. Sheet, and Fabric Booking buttons from the page footer; added a primary Submit button validating Job ID, fabric items, master codes, suppliers, color mappings, and consumption values before persisting records to Local Storage under 'cripton_mm_fabric_estimations_v1'.",
    "descriptionBn": "সর্বশেষ রিকোয়ারমেন্ট অনুযায়ী Marketing & Merchandising মডিউলের Fabric Estimation ফর্মে সর্বাধুনিক উন্নয়ন ও সহজীকরণ সম্পন্ন করা হয়েছে: (১) পরিচ্ছন্ন হেডার: বড় ডেসক্রিপশন সাবটাইটেল ও ERP মডিউল ব্যাজ বাদ দিয়ে 'Order Ref:' লেবেল পরিবর্তন করে 'Job ID:' করা হয়েছে; (২) রেফারেন্স ও সার্চ ফিল্ড সহজীকরণ: Find QTN এবং অপ্রয়োজনীয় ১২টি ফিল্ড (Our Ref, Buyer Ref, O/Date, Buyer, Item Name, Packing Type, LC Basis, Quantity, Rate, Unit, Place, Note) সম্পূর্ণ সরিয়ে পরিচ্ছন্ন ইন্টারফেস নিশ্চিত করা হয়েছে; (৩) সার্চেবল Find Job ID: Find Our Ref-এর নাম পরিবর্তন করে Find Job ID করা হয়েছে, যা ক্লিকে একটি সার্চেবল টেবিল মোডাল (JOB ID, Buyer, Style, Order QTY) ওপেন করে এবং নির্বাচিত জবের পূর্বে সেভ করা ফেব্রিক এস্টিমেশন রেকর্ডগুলো গ্রিডে লোড করে (ওভাররাইট সতর্কতা সহ); (৪) সার্চেবল Find Pre Costing: Find Budget-এর নাম পরিবর্তন করে Find Pre Costing করা হয়েছে, যা সার্চেবল টেবিল মোডালে (Pre Costing ID, JOB ID, Buyer, Style, Order QTY) নির্দিষ্ট প্রি-কস্টিং রেকর্ডের ফেব্রিক আইটেমগুলো গ্রিডে লোড করে ও প্রি-কস্টিং আইটেমের সাথে সংযোগ বজায় রাখে; (৫) পৃথক কমার্শিয়াল রেফারেন্স সেকশন: Booking No., PI No., এবং BBLC No. নিয়ে পাশে একটি পৃথক ও সুস্পষ্ট সেকশন তৈরি করা হয়েছে, যাতে ভবিষ্যতে ফেব্রিক বুকিং, পিআই এবং ব্যাক-টু-ব্যাক এলসি ওয়ার্কফ্লো নির্বিঘ্ন থাকে; (৬) Fabric Details Info গ্রিড: গ্রিডের শিরোনাম পরিবর্তন, নতুন সারির ক্ষেত্রে Inhouse? চেকবক্স ডিফল্ট আনচেকড (false) রাখা, দৃশ্যমান গ্রিড থেকে Fabric No কলাম সম্পূর্ণ অপসারণ, Used Place অপশনে 'Trim'-এর বদলে 'Shell' প্রতিস্থাপন, এবং Budget Item-এর নাম Pre Costing Item-এ রূপান্তর করে সংশ্লিষ্ট প্রি-কস্টিং ফেব্রিক আইটেমের ড্রপডাউন প্রদান; (৭) সার্চেবল ফেব্রিক মাস্টার ও SKU অটো-পপুলেশন: Code কলামের নাম পরিবর্তন করে Fabric Code করা হয়েছে যা সার্চেবল মোডাল (Fabric Code, Fabric Description, Width, Unit) থেকে ফেব্রিক সিলেক্ট করার সাথে সাথে Fabric Description, Width এবং ফেব্রিক মাস্টারের Unit অনুযায়ী SKU স্বয়ংক্রিয়ভাবে পূরণ করে; (৮) Size Wise Cons কলাম অপসারণ: ফেব্রিক ডিটেইলস গ্রিড থেকে সাইজ-ভিত্তিক কনজাম্পশন কলামটি অপসারণ করা হয়েছে; (৯) কালার এন্ট্রি ও Single Color-এ 'P' বাটন: গ্রিড থেকে স্ট্যান্ডঅ্যালোন Add Color বাটন সরানো হয়েছে; কালার এন্ট্রি মোডালে 'Single Color' নির্বাচন করলে একটি 'Color Name' ইনপুট ও পাশে 'P' বাটন প্রদর্শিত হয়, যাতে ক্লিক করলে টাইপকৃত কালারের নাম Item Color-এ স্বয়ংক্রিয়ভাবে বসে যায় (DTM ও Contrast মোড সম্পূর্ণ অক্ষুণ্ণ রেখে); (১০) সার্চেবল সাপ্লায়ার মাস্টার সিলেকশন: সাপ্লায়ার কলামকে সার্চেবল সাপ্লায়ার মাস্টার মোডালের সাথে যুক্ত করা হয়েছে; (১১) সহজীকৃত কনজাম্পশন ও কস্টিং হিসাব: Order Qty ফিল্ডটি লক ও নন-এডিটেবল করা হয়েছে (যা সরাসরি মূল জব থেকে মান নেয়) এবং বাল্ক সম্পর্কিত ৬টি অপ্রয়োজনীয় ফিল্ড (Bulk Cons, Bulk W%, Cons/Pc Bulk, Cons/Dz Bulk, Cost/Pc Bulk, Require Qty Bulk) দৃশ্যমান ইউআই থেকে লুকিয়ে ফেলা হয়েছে; (১২) সাবমিট অ্যাকশন ওয়ার্কফ্লো: নিচ থেকে View List, Req. Sheet এবং Fabric Booking বাটনগুলো বাদ দিয়ে একটি প্রাইমারি Submit বাটন যুক্ত করা হয়েছে যা Job ID, ফেব্রিক আইটেম, মাস্টার কোড, সাপ্লায়ার, কালার ম্যাপিং এবং কনজাম্পশন ভ্যালিডেশন শেষে 'cripton_mm_fabric_estimations_v1'-এ সফলভাবে ডেটা সংরক্ষণ করে।"
  },
  {
    "id": "565",
    "date": "2026-10-20T16:00",
    "type": "Automatic Order Value Calculation & Dedicated Full-Page Fabric Estimation Integration",
    "module": "Marketing & Merchandising / Confirm Order & Fabric Estimation",
    "link": "/mm-order-entry",
    "descriptionEn": "Completed enterprise integration of Order Value field and dedicated full-page Fabric Estimation screen based on the Pridesys Synergy ERP reference workflow: (1) Automatic Order Value Calculation: Added a non-editable, read-only Order Value field in the Commercial Information section of the New Confirm Order form, calculating dynamically as the sum of all associated PO values (PO Quantity × PO Unit Rate) with selected order currency formatting and 2-decimal precision, immediately updating upon PO additions, edits, or removals; (2) Dedicated Full-Page Fabric Estimation Screen: Activated the 'Fabric Requirement Details → View Specs' and top toolbar buttons to open a dedicated full-page Fabric Estimation screen within the module layout, seamlessly pre-populating parent order references without losing unsaved or saved order entries; (3) Reference & Search Information: Integrated complete reference headers including Find QTN, Find Budget, Find Our Ref searchable modals, O/Date, Our Ref, Buyer Ref, Buyer, Item Name, Packing Type, LC Basis (FOB, etc.), Quantity, Rate, Unit, Place, Note, Booking No., PI No., and BBLC No.; (4) Fabric Details Grid: Built dynamic specification table featuring Inhouse? checkbox, Fabric No, Used Place (Body, Collar, Cuff, etc.), Budget Item Name (Single Jersey, 1x1 Rib, Fleece, Pique, etc.), Code, Fabric Description, SKU, Size-Wise Consumption breakdown modal, Color Entry control with live color count badges, Width, Market Unit (Kg, Yds, Mtr), Rate ($), Nominee Status, Supplier selection, Fabric Booking links, and '+ Add Fab' / row delete controls; (5) Fabric Color Entry Modal: Developed dedicated color mapping modal displaying order/fabric reference details, Color Type dropdown (DTM, Contrast, Single Color), 2-column editable mapping grid for Garments Color and Item Color with 1-click import from order breakdown colors and row-level preservation; (6) Real-Time Consumption & Cost Derivations: Synchronized mathematical derivations for Per (Dzn/Pcs), Consum, Unit, Wastage %, Cons/Pc, Cons/Dz, Cost/Pc, Cost/Dz, Order Qty, Require Qty, Bulk Cons, Bulk W%, Cons/Pc (Bulk), Cons/Dz (Bulk), Cost/Pc (Bulk), Cost/Dz (Bulk), and Require Qty (Bulk); (7) Bottom Action Bar & Navigation: Implemented Back (restoring the previous Order Entry form and preserving 100% of unsaved form data), Save (persisting estimation and color mappings while updating the parent form's fabric summary), View List (library of saved estimation records), Req. Sheet (printable technical yields), Req. Summary, and Fabric Booking (/mm-fabric-booking); (8) Local Storage Persistence: Secure persistence under 'cripton_mm_fabric_estimations_v1' ensuring full multi-order and multi-fabric row data isolation.",
    "descriptionBn": "Pridesys Synergy ERP রেফারেন্স মডেল অনুযায়ী Marketing & Merchandising মডিউলের New Confirm Order ফর্মে স্বয়ংক্রিয় Order Value ক্যালকুলেশন এবং ডেডিকেটেড ফুল-পেজ Fabric Estimation স্ক্রিনের সফল বাস্তবায়ন সম্পন্ন করা হয়েছে: (১) অটোমেটিক Order Value ফিল্ড: কমার্শিয়াল ইনফরমেশন সেকশনে একটি নন-এডিটেবল Order Value ফিল্ড যুক্ত করা হয়েছে যা অর্ডারের সকল PO-এর মান (PO Quantity × PO Unit Rate)-এর নিখুঁত যোগফল স্বয়ংক্রিয়ভাবে প্রদর্শন করে, কারেন্সি অনুযায়ী ফরম্যাটিং করে এবং কোনো PO যোগ, পরিবর্তন বা মুছে ফেলার সাথে সাথে লাইভ আপডেট হয়; (২) ফুল-পেজ Fabric Estimation স্ক্রিন: 'Fabric Requirement Details → View Specs' বাটন এবং শীর্ষ টুলবারের বাটনের মাধ্যমে একটি ডেডিকেটেড পূর্ণাঙ্গ ফেব্রিক এস্টিমেশন স্ক্রিন চালু করা হয়েছে, যা মূল অর্ডারের সেভ করা বা অসংরক্ষিত কোনো তথ্য মুছে ফেলা ছাড়াই স্বয়ংক্রিয়ভাবে বায়ার, স্টাইল ও অর্ডার ইনফরমেশন দিয়ে প্রস্তুত হয়; (৩) রেফারেন্স ও সার্চ ইনফরমেশন: Find QTN, Find Budget, Find Our Ref সার্চেবল মোডাল সহ O/Date, Our Ref, Buyer Ref, Buyer, Item Name, Packing Type, LC Basis (FOB), Quantity, Rate, Unit, Place, Note, Booking No., PI No. এবং BBLC No. ফিল্ডের পূর্ণাঙ্গ ব্যবস্থা; (৪) ফেব্রিক ডিটেইলস গ্রিড: Inhouse? চেকবক্স, Fabric No, Used Place (Body, Collar, Cuff ইত্যাদি), Budget Item (Single Jersey, Rib, Fleece ইত্যাদি), Code, Fabric Description, SKU, সাইজ-ভিত্তিক কনজাম্পশন মোডাল, লাইভ কালার কাউন্ট ব্যাজ সহ Color Entry কন্ট্রোল, Width, Market Unit (Kg, Yds, Mtr), Rate ($), Nominee Status, Supplier নির্বাচন, Booking লিঙ্ক এবং '+ Add Fab' ও রো ডিলিট সুবিধা; (৫) Fabric Color Entry মোডাল: প্রতিটি ফেব্রিক রো-এর জন্য স্বতন্ত্র কালার এন্ট্রি মোডাল, যাতে বায়ার, কোড ও ফেব্রিক রেফারেন্স তথ্যের সাথে Color Type (DTM, Contrast, Single Color) এবং Garments Color ও Item Color ম্যাপিংয়ের ২-কলাম এডিটেবল গ্রিড ও অর্ডার ব্রেকডাউন থেকে এক ক্লিকে কালার ইমপোর্ট সুবিধা রয়েছে; (৬) রিয়েল-টাইম কনজাম্পশন ও কস্টিং ডেরিভেশন: Per (Dzn/Pcs), Consum, Unit, Wastage %, Cons/Pc, Cons/Dz, Cost/Pc, Cost/Dz, Order Qty, Require Qty, Bulk Cons, Bulk W%, Cons/Pc (Bulk), Cons/Dz (Bulk), Cost/Pc (Bulk), Cost/Dz (Bulk) এবং Require Qty (Bulk)-এর স্বয়ংক্রিয় গাণিতিক হিসাব; (৭) বটম অ্যাকশন বার ও নির্ভরযোগ্য ব্যাক নেভিগেশন: Back বাটন (মূল অর্ডার ফর্মে ফিরে যাওয়া যেখানে ব্যবহারকারীর পূর্বে প্রবেশ করানো সকল PO, ব্রেকডাউন ও ফিল্ড অক্ষুণ্ণ থাকে), Save বাটন (ফেব্রিক ও কালার ম্যাপিং লোকাল স্টোরেজে সংরক্ষণ এবং অর্ডার ফর্মে ফেব্রিক সামারি আপডেট), View List (সেভ করা এস্টিমেশন তালিকা), Req. Sheet (প্রিন্টযোগ্য টেকনিক্যাল শিট), Req. Summary এবং Fabric Booking (/mm-fabric-booking); (৮) লোকাল স্টোরেজ পারসিস্টেন্স: 'cripton_mm_fabric_estimations_v1'-এ সম্পূর্ণ ডেটা সংরক্ষণ ও একাধিক অর্ডারের মাঝে পূর্ণ আইসোলেশন নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "564",
    "date": "2026-10-20T14:45",
    "type": "PO / Order Details S.C/LC Column Reorder, Bulk Size Entry & Editable Color Qty Reconciliation",
    "module": "Marketing & Merchandising / Confirm Order",
    "link": "/mm-order-entry",
    "descriptionEn": "Completed high-priority enhancements across PO / Order Details and PO-wise Size & Color-wise Quantity Breakdown: (1) S.C/LC No. Column Reorder: Moved S.C/LC No. column immediately before the Breakdown column in the PO / Order Details table with full searchable selection and responsive horizontal scrolling preserved; (2) Bulk Size Entry: Enhanced Add Size modal to accept comma-separated, space-separated, and mixed-separator bulk entries (e.g. 'XXL, 3XL, 4XL, 5XL' or 'S M L XL') with trimming, duplicate prevention, order preservation, and dynamic column initialization across all colors; (3) Clean Single-Plus Buttons: Removed redundant duplicate plus signs from '+ Add Color' and '+ Add Size' toolbar actions; (4) Editable Color Qty & Two-Way Reconciliation: Made Color Qty directly editable as color target quantities with one-click ratio-based proportional allocation (including manual overwrite confirmation guard) and manual size quantity entry; (5) Multi-Scenario Reconciliation: Dynamic validation enforcing Scenarios A (100% matched), B (color-level size mismatch alerts with exact differences), C (under-allocation draft warning), and D (over-allocation save blockade); (6) Local Storage Persistence: Secure persistence of custom sizes, ratios, target color quantities, and breakdown records under 'cripton_mm_orders_v2'.",
    "descriptionBn": "PO / Order Details এবং PO-wise Size & Color-wise Quantity Breakdown-এ অত্যন্ত গুরুত্বপূর্ণ উন্নয়ন ও আধুনিকায়ন সম্পন্ন করা হয়েছে: (১) S.C/LC No. কলাম স্থানান্তর: PO / Order Details টেবিলে S.C/LC No. কলামটিকে স্থানান্তরিত করে সরাসরি Breakdown কলামের ঠিক বামে স্থাপন করা হয়েছে এবং সার্চেবল সিলেকশন ও অনুভূমিক স্ক্রলিং বজায় রাখা হয়েছে; (২) বাল্ক সাইজ এন্ট্রি: Add Size মোডালে কমা, স্পেস অথবা মিক্সড সেপারেটর দিয়ে এক ক্লিকে একাধিক সাইজ (যেমন: 'XXL, 3XL, 4XL, 5XL') যোগ করার সুবিধা যুক্ত করা হয়েছে— সাথে স্বয়ংক্রিয় ট্রিম, ডুপ্লিকেট রোধ, সাইজের ক্রম বজায় রাখা এবং সকল কালারে একযোগে কলাম জেনারেশন নিশ্চিত করা হয়েছে; (৩) বাটন থেকে অতিরিক্ত প্লাস আইকন অপসারণ: Add Color ও Add Size বাটনে ডবল প্লাস সাইন বাদ দিয়ে পরিচ্ছন্ন সিঙ্গেল প্লাস আইকন ও লেবেল নিশ্চিত করা হয়েছে; (৪) এডিটযোগ্য Color Qty ও রেশিও ডিস্ট্রিবিউশন: Color Qty ফিল্ডটিকে সরাসরি এডিটেবল টার্গেট কোয়ান্টিটিতে রূপান্তর করা হয়েছে, সাথে এক ক্লিকে রেশিও অনুযায়ী সাইজে আনুপাতিক বন্টন (ম্যানুয়াল ভ্যালু ওভাররাইট কনফার্মেশন সহ) এবং ম্যানুয়াল সাইজ এন্ট্রি সুবিধা যুক্ত করা হয়েছে; (৫) পূর্ণাঙ্গ রিকনসিলিয়েশন ভ্যালিডেশন: সিনারিও A (শতভাগ মিল), সিনারিও B (কালার ও সাইজের পার্থক্যের সুস্পষ্ট তালিকা ও পরিমাণ প্রদর্শন), সিনারিও C (কম বরাদ্দে ড্রাফট ওয়ার্নিং) এবং সিনারিও D (PO Qty-এর বেশি বরাদ্দ ব্লক) শতভাগ বাস্তবায়ন করা হয়েছে; (৬) লোকাল স্টোরেজে সংরক্ষণ: 'cripton_mm_orders_v2'-এ কাস্টম সাইজ, রেশিও, কালার টার্গেট ও ব্রেকডাউন ডেটা রিলোড ও সেশন জুড়ে স্থায়ীভাবে সংরক্ষিত রাখা হয়েছে।"
  },
  {
    "id": "563",
    "date": "2026-10-20T13:30",
    "type": "PO-wise Size & Color-wise Quantity Breakdown UI/UX Enhancement & Physical Row Alignment",
    "module": "Marketing & Merchandising / Confirm Order",
    "link": "/mm-order-entry",
    "descriptionEn": "Implemented comprehensive UI/UX fixes and architectural enhancements to the Size Detail Information & PO-wise Size & Color-wise Quantity Breakdown interface: (1) Simplified Header: Completely removed Lot No., Dest Country, and Copy From Breakdown fields, retaining exclusively the selected PO No. and total PO Qty with live allocation reconciliation badge; (2) Removed Grid Rate Rows: Eliminated all size-level Rate ($) rows, associated rate inputs, and calculations from the right size grid without reserving blank space, while safely preserving color-level commercial rates; (3) Removed Assrt. Status: Cleaned out the Assrt. Status column header and dropdowns from the color table and balanced remaining column widths; (4) Dynamic Custom Size Management: Introduced '+ Add Size' action opening a dedicated modal with validation (empty check, case-insensitive duplicate prevention, and quick suggestion presets like XS, XXL, 8S, 14R, etc.), dynamically appending new size columns across all colors with initialized ratio (1) and qty (0), along with column-level size removal and confirmation guard; (5) Critical Physical Row Alignment: Re-architected breakdown table into a unified HTML table where left color columns (Sel, Del, Color, Rate, Color Qty) use rowSpan={2} to physically lock Ratio (Row 1) and Qty (Row 2) across any number of colors (1, 3, 5, 10, or 20+ colors) without vertical drift, supported by sticky column freezing and independent horizontal/vertical scrolling; (6) Job No. Read-only in Pre Costing Ref Mode: Enforced read-only mode with visual badge on Job No. when Pre Costing Ref is selected to preserve linkage, while retaining auto-generation in New Order mode; (7) PO Table S.C/LC No. Column: Added S.C/LC No. column to PO / Order Details table with a searchable selection modal filtered by buyer/company, supporting Sales Contract and LC selection with Local Storage persistence.",
    "descriptionBn": "Marketing & Merchandising মডিউলের Size Detail Information ও PO-wise Size & Color-wise Quantity Breakdown ইন্টারফেসে প্রয়োজনীয় ইউআই/ইউএক্স ও কাঠামোগত পরিবর্তন সম্পন্ন করা হয়েছে: (১) পরিচ্ছন্ন হেডার: হেডার থেকে Lot No., Dest Country এবং Copy From Breakdown ফিল্ডগুলো সম্পূর্ণরূপে অপসারণ করে শুধুমাত্র নির্বাচিত PO No. ও PO Qty রাখা হয়েছে এবং লাইভ বরাদ্দ স্ট্যাটাস যুক্ত করা হয়েছে; (২) গ্রিড থেকে রেট রো অপসারণ: সাইজ-ভিত্তিক গ্রিড থেকে প্রতিটি কালারের Rate ($) সারি ও ইনপুট ফিল্ড বাদ দেওয়া হয়েছে (কোনো ফাঁকা জায়গা না রেখে), তবে কালার টেবিলের মূল বাণিজ্যিক রেট বজায় রাখা হয়েছে; (৩) Assrt. Status অপসারণ: কালার টেবিল থেকে Assrt. Status কলাম ও ড্রপডাউন বাদ দিয়ে কলামগুলোর প্রস্থের সুষম সমন্বয় করা হয়েছে; (৪) কাস্টম সাইজ যোগ করার সুবিধা: '+ Add Size' বাটন এবং মোডাল যুক্ত করা হয়েছে (খালি ও ডুপ্লিকেট সাইজ প্রতিরোধ, XS, XXL, 8S, 14R ইত্যাদি দ্রুত সিলেক্ট অপশন), যা সকল কালারে একযোগে নতুন সাইজ কলাম যুক্ত করে এবং প্রতিটি কলামে রিমুভ অপশন ও কনফার্মেশন নিশ্চিত করা হয়েছে; (৫) কালার ও সাইজ সারির নিখুঁত শারীরিক এলাইনমেন্ট: পূর্বের আলাদা দুটি প্যানেলের বদলে একটি সমন্বিত সিঙ্গেল HTML টেবিল তৈরি করা হয়েছে যেখানে প্রতিটি কালারের বাম দিকের সেলগুলো (Sel, Del, কালার, রেট, মোট পরিমাণ) rowSpan={2} দিয়ে ফিজিক্যালি লক করা হয়েছে— ফলে কালারের সংখ্যা ১টি, ৩টি, ৫টি, ১০টি বা ২০টির বেশি হলেও সাইজের অনুপাত ও কোয়ান্টিটি সারি কখনোই আর এলোমেলো বা মিস-এলাইন হবে না; (৬) Pre Costing Ref মোডে Job No. শুধুমাত্র পাঠযোগ্য: Pre Costing Ref সিলেক্ট করা থাকলে Job No. ফিল্ডটি স্বয়ংক্রিয়ভাবে পূরণ হয়ে লক (Read-only) থাকে এবং New Order মোডে ইউনিক Job No. জেনারেট হয়; (৭) PO টেবিলে S.C/LC No. কলাম: PO / Order Details টেবিলে নতুন S.C/LC No. কলাম এবং সার্চেবল সিলেকশন মোডাল যুক্ত করা হয়েছে (বায়ার ও কোম্পানি অনুযায়ী ফিল্টারিং এবং সেলস কন্ট্রাক্ট বা এলসি নির্বাচন ও লোকাল স্টোরেজে সংরক্ষণ সুবিধা)।"
  },
  {
    "id": "562",
    "date": "2026-10-20T12:45",
    "type": "PO-wise Size & Color-wise Quantity Breakdown Two-Panel Horizontal Layout & Ratio Engine",
    "module": "Marketing & Merchandising / Confirm Order",
    "link": "/mm-order-entry",
    "descriptionEn": "Completed comprehensive redesign of the PO-wise Size & Color-wise Quantity Breakdown modal in Marketing & Merchandising matching the legacy reference interface: (1) Overall Layout: Replaced the vertically stacked layout with a two-panel horizontal arrangement featuring the Garments Color Table on the left and the Size-wise Quantity Grid on the right; (2) Header & PO Identification: Clear 'Size Detail Information' header with read-only PO No. and PO Qty, Lot No. selection, Copy From Breakdown dropdown with confirmation guard, and Dest Country indicator; (3) Left Panel Garments Color Table: Full color management table with Select checkbox, Remove action, Garments Color dropdown (from master colors), editable Rate ($), Assrt. Status, dynamic Color Qty, and '+ Add Color' action; (4) Right Panel Size-wise Quantity Grid: Size columns displayed horizontally across the top from selected Buyer Dept size set with horizontal scrolling; each color contains three synchronized logical rows: Ratio (editable with quick calculator distribute), Qty (editable with live aggregation), and Rate ($); (5) Ratio Wise Qty Change Dialog: Integrated dedicated modal with color selection, target quantity allocation, configurable size ratios, quick presets, and live whole-piece Largest Remainder proportional distribution without discarding rounding remainders; (6) Size Selection & Population: 'Size From Buyer Dept.' dropdown and 'Populate >>' button loading standard size sets across all colors; (7) Quantity Reconciliation: Dynamic calculation of Total Color Qty, Total Size Qty, Breakdown Total, and Remaining Balance with Case A (exact match), Case B (under-allocation draft warning), and Case C (over-allocation blocked); (8) Local Storage Persistence: Complete state preservation in 'cripton_mm_orders_v2' across POs and sessions with unsaved change discard protection.",
    "descriptionBn": "Marketing & Merchandising মডিউলে PO-wise Size & Color-wise Quantity Breakdown মোডালটির পূর্ণাঙ্গ রি-ডিজাইন ও টু-প্যানেল লেআউট সম্পন্ন করা হয়েছে: (১) টু-প্যানেল অনুভূমিক লেআউট: আগের উল্লম্বভাবে স্তূপীকৃত লেআউট পরিবর্তন করে বাম পাশে Garments Color Table এবং ডান পাশে Size-wise Quantity Grid স্থাপন করে রেফারেন্স ডিজাইন অনুযায়ী সাজানো হয়েছে; (২) হেডার ও পিও সনাক্তকরণ: সুস্পষ্ট 'Size Detail Information' শিরোনাম, শুধুমাত্র পাঠযোগ্য PO No. ও PO Qty, Lot No. ড্রপডাউন, অন্য পিও থেকে ব্রেকডাউন কপির জন্য ড্রপডাউন ও নিশ্চিতকরণ ডায়ালগ এবং গন্তব্য দেশ প্রদর্শন; (৩) বাম প্যানেল (কালার টেবিল): সিলেক্ট চেকবক্স, রিমুভ বাটন, মাস্টার কালার ড্রপডাউন, রেট ($), অ্যাসর্ট স্ট্যাটাস, ডায়নামিক কালার কোয়ান্টিটি এবং নিচে '+ Add Color' বাটন; (৪) ডান প্যানেল (সাইজ গ্রিড): উপরে অনুভূমিকভাবে সাইজ কলাম বিন্যাস এবং প্রতিটি কালারের জন্য ৩টি সমন্বিত সারি— Ratio (অনুপাত এন্ট্রি), Qty (কোয়ান্টিটি এন্ট্রি) এবং Rate ($), সাথে অনুভূমিক মসৃণ স্ক্রলিং সুবিধা; (৫) রেশিও অনুযায়ী কোয়ান্টিটি বন্টন: 'Ratio Wise Qty Change' বাটন ও ডেডিকেটেড ডায়ালগ, যেখানে কালার নির্বাচন, মোট পরিমাণ নির্ধারণ, অনুপাত সেট এবং Largest Remainder পদ্ধতিতে কোনো ভগ্নাংশ বাদ না দিয়ে পূর্ণ সংখ্যায় সঠিক অনুপাতে স্বয়ংক্রিয় বন্টন সুবিধা যুক্ত করা হয়েছে; (৬) সাইজ সিলেকশন ও পপুলেট: 'Size From Buyer Dept.' ড্রপডাউন এবং 'Populate >>' বাটনের মাধ্যমে সকল কালারে এক ক্লিকে স্ট্যান্ডার্ড সাইজ সেট লোড করার সুবিধা; (৭) রিকনসিলিয়েশন ও ভ্যালিডেশন: Total Color Qty, Total Size Qty, Breakdown Total এবং Remaining Balance লাইভ হিসাব, শতভাগ মিললে অনুমোদন, কম হলে ড্রাফট হিসেবে সেভ এবং অতিরিক্ত বরাদ্দ (Over-allocation) কঠোরভাবে ব্লক করা হয়েছে; (৮) লোকাল স্টোরেজ ও সুরক্ষা: 'cripton_mm_orders_v2'-এ পিও-ভিত্তিক ডেটা সংরক্ষণ এবং সেভ না করে বের হওয়ার ক্ষেত্রে ডিসকার্ড সুরক্ষা নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "561",
    "date": "2026-10-20T12:00",
    "type": "New Confirm Order Form UI/UX Layout Optimization & Process Template Architecture",
    "module": "Marketing & Merchandising / Confirm Order",
    "link": "/mm-order-entry",
    "descriptionEn": "Implemented comprehensive UI/UX layout optimizations on the New Confirm Order form in Marketing & Merchandising: (1) Order Type & Reference Information: Placed the Pre Costing Ref. field directly beside the radio button on the same line with a compact width, dynamically hiding and reclaiming space when 'New Order' is selected; aligned Job No., Order Type, and Order Status across a single balanced 3-column row; (2) Company & Buyer Information: Arranged all six fields (Beneficiary, Buyer, Buyer Dept, Merchant, A/C Holder, Delivery Mode) in a single row on desktop screens; removed the Country column from the searchable Buyer selection modal table; converted Merchant from a text input to a searchable selection list/modal defaulting dynamically to the logged-in user without hardcoding; (3) Style & Garment Information: Arranged Style, GMT Item, Place, and Pack Type in a single vertical column; removed the Garment Item column from the Style selection modal table; removed visible 'Knit' and 'Woven' badges from the GMT Item selection modal list while preserving underlying data; (4) Commercial Information: Arranged Unit Price, Currency, Pay Term, and CM in a single vertical column, preserving full currency calculations, price types, and PCS/DZ unit options; (5) Manufacturing Process Sequence: Introduced a '+ New Process' button opening a dedicated modal to configure reusable process templates with auto-numbered SL, 2 initial rows, Add/Remove row controls, and Local Storage persistence; saved templates immediately populate the 'Load Process Template...' dropdown and apply cleanly to the sequence table; (6) 3-Section Side-by-Side Layout: Arranged Style & Garment Information (left), Commercial Information (middle), and Manufacturing Process Sequence (right) side by side in a 3-column grid on desktop screens, with responsive vertical stacking on smaller screens; (7) Order Quantity & Delivery Information: Removed Del DT, PCD, Dest Country, Del Mode, Del port, and Place (Factory/Delivery), retaining only the 5 essential fields while preserving underlying data; (8) PO / Order Details: Removed the Default Port column from the Dest Country selection modal table while preserving full country selection, breakdown modals, and table functionality.",
    "descriptionBn": "Marketing & Merchandising মডিউলের New Confirm Order ফর্মের পূর্ণাঙ্গ ইউআই/ইউএক্স লেআউট আধুনিকায়ন ও প্রসেস টেমপ্লেট আর্কিটেকচার সম্পন্ন করা হয়েছে: (১) অর্ডার টাইপ ও রেফারেন্স ইনফরমেশন: Pre Costing Ref. রেডিও বাটন সিলেক্ট করলে রেফারেন্স ফিল্ডটি একই সারিতে পাশে কমপ্যাক্ট আকারে প্রদর্শিত হয় এবং New Order সিলেক্ট করলে কোনো ফাঁকা জায়গা ছাড়াই লুকিয়ে যায়; Job No., Order Type এবং Order Status ফিল্ড তিনটি একই সারিতে সুষম ৩-কলাম লেআউটে সাজানো হয়েছে; (২) কোম্পানি ও বায়ার ইনফরমেশন: ডেস্কটপ স্ক্রিনে ছয়টি ফিল্ড এক সারিতে বিন্যস্ত করা হয়েছে; বায়ার সিলেকশন মোডাল টেবিল থেকে Country কলাম বাদ দেওয়া হয়েছে; মার্চেন্ট ফিল্ডকে ফ্রি টেক্সট ইনপুটের বদলে সার্চেবল সিলেকশন ড্রপডাউন/মোডালে রূপান্তর করে হার্ডকোড ছাড়াই লগইন করা ইউজারের সাথে স্বয়ংক্রিয়ভাবে ডিফল্ট সিলেকশন হিসেবে যুক্ত করা হয়েছে; (৩) স্টাইল ও গার্মেন্টস ইনফরমেশন: Style, GMT Item, Place এবং Pack Type ফিল্ড চারটি একটি সিঙ্গেল ভার্টিক্যাল কলামে পর্যায়ক্রমে সাজানো হয়েছে; Style সিলেকশন মোডাল টেবিল থেকে Garment Item কলাম বাদ দেওয়া হয়েছে; GMT Item সিলেকশন তালিকা থেকে Knit ও Woven দৃশ্যমান ব্যাজ বাদ দিয়ে মাস্টার ডেটা অক্ষুণ্ণ রাখা হয়েছে; (৪) কমার্শিয়াল ইনফরমেশন: Unit Price, Currency, Pay Term এবং CM ফিল্ডগুলো একটি সিঙ্গেল ভার্টিক্যাল কলামে সাজানো হয়েছে এবং সকল বাণিজ্যিক হিসাব, কারেন্সি পরিবর্তন ও PCS/DZ অপশন বজায় রাখা হয়েছে; (৫) ম্যানুফ্যাকচারিং প্রসেস সিকোয়েন্স: '+ New Process' বাটন ও প্রসেস টেমপ্লেট তৈরির মোডাল যুক্ত করা হয়েছে (প্রাথমিক ২টি রো, রো যোগ/বাদ, অটো SL নম্বর ও লোকাল স্টোরেজে সংরক্ষণ সুবিধা); সেভ করা টেমপ্লেট তাৎক্ষণিকভাবে 'Load Process Template' ড্রপডাউনে পাওয়া যায় এবং টেবিলে লোড করা যায়; (৬) ৩টি মূল সেকশন পাশাপাশি বিন্যাস: Style & Garment Info (বামে), Commercial Info (মাঝখানে) এবং Manufacturing Process Sequence (ডানে) ডেস্কটপে পাশাপাশি ৩-কলামে এবং ছোট স্ক্রিনে রেসপনসিভভাবে সাজানো হয়েছে; (৭) অর্ডার কোয়ান্টিটি ও ডেলিভারি: এই সেকশন থেকে Del DT, PCD, Dest Country, Del Mode, Del port এবং Place ফিল্ডগুলো বাদ দিয়ে প্রয়োজনীয় ৫টি ফিল্ড রাখা হয়েছে; (৮) PO / Order Details: Dest Country মোডাল থেকে Default Port কলাম বাদ দেওয়া হয়েছে এবং বাকি সকল কান্ট্রি সিলেকশন ও ব্রেকডাউন কার্যকারিতা অক্ষুণ্ণ রাখা হয়েছে।"
  },
  {
    "id": "560",
    "date": "2026-10-20T01:30",
    "type": "Marketing & Merchandising New Confirm Order Form Comprehensive UI/UX Redesign",
    "module": "Marketing & Merchandising / Confirm Order",
    "link": "/mm-order-entry",
    "descriptionEn": "Completed comprehensive UI/UX redesign of the New Confirm Order form in Marketing & Merchandising module in strict isolation: (1) Form Title & Header: Updated label to 'New Confirm Order' and completely removed the top breakdown reconciliation summary block; (2) Order Type & Reference Info: Removed section numbers, replaced order toggle with 'New Order / Copy from Costing' radio group, integrated searchable Pre-Costing selection table modal with auto-population of editable fields and demo costing fallback in Local Storage, automated unique Job No. generation, cleaned Order Type dropdown (removed Test and Buffer), standardized Order Status to 'Active', 'Inactive', 'Closed', made Job No. mandatory, and removed Order SL and redundant copy sections; (3) Company & Buyer Info: Made Beneficiary Company read-only auto-populated from user context, added searchable table selection modals for Buyer and Buyer Department, updated Merchant label and populated from user context with editable override, implemented automatic Buyer-wise Account Holder lookup, and hid Local Agent and Dept Code; (4) Style & Garment Info: Searchable table selection modals for Style (filtered by buyer) and GMT Item, restricted Place dropdown strictly to 'Top', 'Bottom', 'Top&Bottom', introduced table-based Process Name configuration with SL numbers, Add/Remove rows, and Local Storage saved Process Templates, and removed Size; (5) Commercial Info: Added Price Type dropdown (FOB, etc.) beside Unit Price, added standalone Currency selector with dynamic currency symbol formatting across monetary fields, added PCS/DZ unit dropdown for CM, hid Pcs field, and relocated delivery fields; (6) Order Quantity & Delivery Info & Instructions: Updated clean section headings; (7) Removed Section 8 Delivery Lot Details completely from the form; (8) PO / Order Details Table: Hid No, Projection, PO, Lot, Del port columns; removed V, S., and Size columns; repositioned Qty immediately left of RATE; integrated searchable modal for Dest Country; updated button label strictly to 'Breakdown' while fully preserving PO-wise size & color breakdown modal functionality; (9) Scrolling & Layout: Resolved all viewport clipping, sticky element overlaps, and enabled responsive vertical and horizontal scrolling across the form, tables, and modal dialogs.",
    "descriptionBn": "নতুন Marketing & Merchandising মডিউলের New Confirm Order ফর্মের পূর্ণাঙ্গ ইউআই/ইউএক্স আধুনিকায়ন সম্পন্ন করা হয়েছে: (১) ফর্ম টাইটেল ও হেডার: নাম পরিবর্তন করে 'New Confirm Order' করা হয়েছে এবং উপরের রিকনসিলিয়েশন সারাংশ ব্লকটি সম্পূর্ণ বাদ দেওয়া হয়েছে; (২) অর্ডার টাইপ ও রেফারেন্স ইনফরমেশন: সেকশন নম্বর বাদ দিয়ে 'New Order / Copy from Costing' রেডিও বাটন যোগ করা হয়েছে, প্রি-কস্টিং রেকর্ড সার্চ ও নির্বাচনের টেবিল মোডাল এবং স্বয়ংক্রিয় এডিটেবল ডেটা পূরণ সুবিধা যুক্ত করা হয়েছে, নতুন অর্ডারের জন্য স্বয়ংক্রিয় ইউনিক Job No. জেনারেট করার ব্যবস্থা করা হয়েছে, Order Type থেকে Test ও Buffer অপশন বাদ দেওয়া হয়েছে, Order Status-এ Active, Inactive ও Closed নির্ধারণ করা হয়েছে, Job No. ফিল্ডটি বাধ্যতামূলক করা হয়েছে এবং Order SL ও কপি সেকশনগুলো বাদ দেওয়া হয়েছে; (৩) কোম্পানি ও বায়ার ইনফরমেশন: Beneficiary Company শুধুমাত্র পাঠযোগ্য (Read-only) রাখা হয়েছে, বায়ার ও বায়ার ডিপার্টমেন্টের জন্য সার্চেবল টেবিল মোডাল যোগ করা হয়েছে, মার্চেন্ট ফিল্ড আপডেট ও এডিটযোগ্য করা হয়েছে, বায়ার অনুযায়ী স্বয়ংক্রিয় A/C Holder পপুলেশন নিশ্চিত করা হয়েছে এবং Local Agent ও Dept Code হাইড করা হয়েছে; (৪) স্টাইল ও গার্মেন্টস ইনফরমেশন: বায়ার-ভিত্তিক সার্চেবল স্টাইল ও জিএমটি আইটেম মোডাল, Place ড্রপডাউনে Top, Bottom, Top&Bottom নির্ধারণ, প্রসেস নেম টেবিল কনফিগারেশন (ক্রমিক নম্বর, যোগ/বাদ) ও লোকাল স্টোরেজে প্রসেস টেমপ্লেট সংরক্ষণ সুবিধা যুক্ত করা হয়েছে এবং Size ফিল্ডটি সরানো হয়েছে; (৫) কমার্শিয়াল ইনফরমেশন: Unit Price-এর পাশে Price Type ড্রপডাউন এবং আলাদা Currency ফিল্ড যুক্ত করে সব অংকের সাথে নির্বাচিত কারেন্সি সাইন ডায়নামিক প্রদর্শন, CM-এর জন্য PCS/DZ ড্রপডাউন যোগ, Pcs ফিল্ড হাইড এবং ডেলিভারি ফিল্ডগুলো স্থানান্তরিত করা হয়েছে; (৬) অর্ডার কোয়ান্টিটি ও ইন্সট্রাকশনস: পরিচ্ছন্ন শিরোনাম প্রদান করা হয়েছে; (৭) Delivery Lot Details সেকশন ফর্ম থেকে সম্পূর্ণ বাদ দেওয়া হয়েছে; (৮) PO / Order Details টেবিল: No, Projection, PO, Lot, Del port কলাম হাইড করা হয়েছে; V, S., Size কলাম পুরোপুরি বাদ দেওয়া হয়েছে; Qty কলামটিকে RATE-এর ঠিক বামে স্থাপন করা হয়েছে; Dest Country-তে সার্চেবল মোডাল যুক্ত করা হয়েছে এবং প্রতিটি লাইনের বাটনকে শুধুমাত্র 'Breakdown' নাম দিয়ে পিও-ভিত্তিক সাইজ ও কালার ব্রেকডাউন মোডালের সাথে যুক্ত রাখা হয়েছে; (৯) স্ক্রলিং ও লেআউট সমাধান: সম্পূর্ণ ফর্মে স্মুথ উল্লম্ব স্ক্রলিং, টেবিলের অনুভূমিক স্ক্রলিং এবং রেসপনসিভ মোডাল ভিউপোর্ট নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "559",
    "date": "2026-10-19T18:05",
    "type": "Marketing & Merchandising Order Entry & PO-wise Size & Color Breakdown",
    "module": "Marketing & Merchandising / Order Entry",
    "link": "/mm-order-entry",
    "descriptionEn": "Completed full field-accuracy-first implementation of Order Entry and PO-wise Size & Color-wise Quantity Breakdown in the new Marketing & Merchandising module: (1) Main Order Entry: Implemented all 33 header fields across Sections 1 to 7 with preserved labels including 'Merchan.', 'Our Ref', 'Order SL', 'Pay Term', 'CM', 'Pcs', 'First Del Dt', 'Confirm Dt', 'Extra Cutting %', 'SMV', 'PCD', and 'Copy From Our Ref' with template & buyer-based copy actions; (2) Delivery Lot Details Table: Dedicated table supporting LOT#, Quantity, Del Date with full CRUD and lot-to-order reconciliation; (3) PO / Order Details Table: Comprehensive table with all 17 original columns (No, Projection, PO, Qty, LOT, PO No, PO Desc, RATE, Value, Del DT, PCD, Dest Country, Del Mode, Del port, V, S., Size) and row-level 'Size & Color Breakdown' action buttons with live allocation status indicators; (4) PO-wise Size & Color Breakdown Modal: Integrated secondary workflow tied to specific PO with Section 10 controls (Lot No, Ratio Wise Qty Change, Size From Buyer Dept, Populate >>, Country Break-down, Copy From Breakdown, Note, Company, Line Name, Start/Finish Dates, Plan Qty), Section 11 Color-wise breakdowns, and Section 12 Size-wise quantity grids; (5) Zero-Tolerance Reconciliation & Validation: Strict barrier blocking over-allocations (> PO Qty) while permitting under-allocated drafts with remaining balance alerts, and mismatch alerts when updating PO quantities; (6) Section 13 Original Actions: Functional dialogs for Report, View Order, All Data, Status, Size List, Attachment, Order Color, Fabric Requirement Details, and Accessories Requirement Details; (7) Isolated Local Storage Persistence: Secure persistence under 'cripton_mm_orders_v2' ensuring complete isolation without modifying legacy Merchandising, Procurement, or Inventory modules.",
    "descriptionBn": "নতুন Marketing & Merchandising মডিউলে Order Entry ফর্ম এবং PO-wise Size ও Color-wise কোয়ান্টিটি ব্রেকডাউন নিখুঁতভাবে তৈরি ও সম্পূর্ণ করা হয়েছে: (১) শতভাগ ফিল্ড নির্ভুলতা: মূল স্পেসিফিকেশন ও রেফারেন্স অনুযায়ী 'Merchan.', 'Our Ref', 'Order SL', 'Pay Term', 'CM', 'Pcs', 'First Del Dt', 'Confirm Dt', 'Extra Cutting %', 'SMV', 'PCD' সহ সেকশন ১ থেকে ৭-এর মোট ৩৩টি মূল ফিল্ড এবং টেমপ্লেট ও বায়ারভিত্তিক কপি সুবিধা বাস্তবায়ন করা হয়েছে; (২) Delivery Lot টেবিল: LOT#, কোয়ান্টিটি এবং ডেলিভারি ডেট সহ স্বয়ংসম্পূর্ণ লট টেবিল এবং অর্ডার কোয়ান্টিটির সাথে সমন্বয় যাচাই; (৩) PO / Order Details টেবিল: No, Projection, PO, Qty, LOT, PO No, PO Desc, RATE, Value, Del DT, PCD, Dest Country, Del Mode, Del port, V, S., Size সহ ১৭টি মূল কলাম এবং প্রতি লাইনে লাইভ স্ট্যাটাসসহ 'Size & Color Breakdown' বাটন; (৪) PO-ভিত্তিক সাইজ ও কালার ব্রেকডাউন মোডাল: নির্দিষ্ট PO-এর অধীনে Lot No, Ratio Wise Qty Change, Size From Buyer Dept, Populate >>, Country Break-down, Copy From Breakdown, Note, Company, Line Name, Start/Finish Dates, Plan Qty সহ মাল্টি-কালার ও সাইজ গ্রিড এন্ট্রি; (৫) জিরো-টলারেন্স ভ্যালিডেশন: PO কোয়ান্টিটির অতিরিক্ত (Over-allocation) সংরক্ষণ কঠোরভাবে ব্লক করা এবং অসম্পূর্ণ বরাদ্দের ক্ষেত্রে ড্রাফট হিসেবে সতর্কবার্তাসহ সেভ করার সুবিধা; (৬) সেকশন ১৩-এর সকল অ্যাকশন: Report, View Order, All Data, Status, Size List, Attachment, Order Color, Fabric Requirement Details এবং Accessories Requirement Details অ্যাকশন ও মোডাল ডায়ালগ যুক্ত করা হয়েছে; (৭) স্থানীয় ডেটা সংরক্ষণ: পূর্বের Merchandising, Procurement বা Inventory মডিউলের কোনো কোড পরিবর্তন না করে সম্পূর্ণ স্বতন্ত্র 'cripton_mm_orders_v2' লোকাল স্টোরেজে ডেটা সংরক্ষণ ও রিলোড সুবিধা নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "558",
    "date": "2026-10-19T10:45",
    "type": "New Marketing & Merchandising Module Launch & Item-Level Saving Intelligence",
    "module": "Marketing & Merchandising / Core Architecture",
    "link": "/mm-dashboard",
    "descriptionEn": "Successfully developed and launched a completely new, independent 'Marketing & Merchandising' module within CriptonHRIS in strict isolation from the existing Merchandising, Procurement, and Inventory modules: (1) Module Isolation: Full non-modification compliance preserving all existing routes and data, registering the new module cleanly in ModuleLauncher and ModuleSelection; (2) 15 Core Company Policies: Configured policies for quotation/pre-costing approvals, booking saving target (default 2%), budget overrun controls, wastage rules, country breakdown requirement, FOB/BOM permissions, and approval limits with full audit history; (3) Buyer Quotation Management: Complete commercial workflow for Woven and Knit garments, style particulars, color/size breakdowns, and policy-driven approvals; (4) Style Pre-Costing & Amendment Diff: Individual item-level costing with persistent preCostItemId identifiers (100% Cotton, Buttons, Zippers, Tags, Labels) and visual revision comparison diff highlighting added (green), modified (amber), and removed (red) components; (5) Confirm Order Entry: Zero-tolerance breakdown reconciliation validating that color, size, PO, lot, and country breakdowns strictly match the total order quantity, plus role-authorized FOB modification audit log; (6) Traceable BOM Management: Mandatory item-level linkage between BOM items and approved Pre-Cost Item IDs with unmapped item exception handling; (7) Fabric & Accessories Bookings: Independent approval workflows and line-level booking saving tracking; (8) Item-wise Cost Saving Analysis: Granular calculation engine distinguishing initial booking saving from final actual cost, rate vs quantity variances, negative overrun warnings, and multi-tier rollups; (9) Proforma Invoice (PI) Management: Eligibility validation blocking pending or rejected bookings, supplier consolidation, and PI approval; (10) Order Closure & Reopening Control: Operational transaction blockade displaying the mandated exact warning 'This order is currently closed. Please reopen the order before proceeding with this transaction.' with full history.",
    "descriptionBn": "পূর্বের Merchandising, Procurement এবং Inventory মডিউল পুরোপুরি অক্ষুণ্ণ রেখে CriptonHRIS-এ সম্পূর্ণ নতুন এবং স্বতন্ত্র 'Marketing & Merchandising' মডিউল সফলভাবে চালু করা হয়েছে: (১) মডিউল আইসোলেশন: আগের কোনো কোড বা ডেটায় হাত না দিয়ে ModuleLauncher ও ModuleSelection-এ নতুন মডিউল যুক্ত করা হয়েছে; (২) ১৫টি প্রাতিষ্ঠানিক পলিসি: কোটেশন/কস্টিং অনুমোদন, বুকিং সেভিং টার্গেট (ডিফল্ট ২%), বাজেট অতিক্রম নিয়ন্ত্রণ, অপচয় হিসাব, কান্ট্রি ব্রেকডাউন বাধ্যবাধকতা, এফওবি/বিওএম পারমিশন এবং অডিট লগসহ পূর্ণাঙ্গ পলিসি ব্যবস্থাপনা; (৩) বায়ার কোটেশন: ওভেন ও নিট গার্মেন্টসের জন্য পূর্ণাঙ্গ বাণিজ্যিক কোটেশন, কালার-সাইজ ব্রেকডাউন এবং পলিসি অনুমোদনের ব্যবস্থা; (৪) প্রি-কস্টিং ও রিভিশন তুলনা: প্রতিটি আইটেমের জন্য স্থায়ী preCostItemId (১০০% কটন, বোতাম, চেইন, ট্যাগ, লেবেল) এবং রিভিশন পরিবর্তনের জন্য ভিজ্যুয়াল ডিফারেন্স টেবিল যাতে নতুন যুক্ত (সবুজ), পরিবর্তিত (হলুদ) ও বাদ দেওয়া (লাল) আইটেম স্পষ্ট ফুটে ওঠে; (৫) কনফার্ম অর্ডার এন্ট্রি: কালার, সাইজ, পিও, লট এবং কান্ট্রি ব্রেকডাউনের মোট যোগফল অর্ডার কোয়ান্টিটির সাথে শতভাগ মেলানোর জিরো-টলারেন্স ভ্যালিডেশন এবং অনুমোদিত এফওবি পরিবর্তনের অডিট ট্রেইল; (৬) ট্রেসেবল বিওএম: অনুমোদিত প্রি-কস্টিং আইটেম আইডির সাথে বিওএম লাইনের সরাসরি সংযোগ এবং নতুন আনম্যাচড আইটেম ট্র্যাকিং; (৭) ফেব্রিক ও এক্সেসরিজ বুকিং: সম্পূর্ণ স্বাধীন অনুমোদন ব্যবস্থা এবং বুকিং সেভিং হিসাব; (৮) আইটেমভিত্তিক কস্ট সেভিং রিপোর্ট: রেট বনাম কোয়ান্টিটি ভ্যারিয়েন্স, বাজেট অতিরিক্ত খরচ চিহ্নিতকরণ এবং মাল্টি-লেভেল রোলআপ রিপোর্ট; (৯) পিআই (প্রোফরমা ইনভয়েস): অননুমোদিত বা রিজেক্টেড বুকিং ব্লক করার কড়া নিয়মসহ পিআই তৈরি ও অনুমোদন; (১০) অর্ডার ক্লোজার ও রিওপেনিং: অর্ডার ক্লোজ থাকলে যেকোনো ট্রানজ্যাকশন ব্লক করে নির্দেশনামাফিক সুনির্দিষ্ট বার্তা প্রদর্শন এবং রিওপেন করার অডিট হিস্টোরি নিশ্চিত করা হয়েছে।"
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
    "date": "2026-10-11T10:25",
    "type": "TypeScript Compilation and Interface Consistency Fixes",
    "module": "Procurement & Inventory Management / Master Data, Configuration & CS",
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
    "descriptionEn": "Completed key updates and runtime fixes across Procurement & Inventory Management: (1) Purchase Order / Work Order: Resolved runtime crash on Create PO/WO form (/procurement-po-new) by declaring missing tax accumulator; (2) Supplier Bill: Item-level Tax % and tax amount from Work Orders/POs are now carried forward into Supplier Bill items and displayed in the bill item table and approval dossier; removed default prices from the Other Charges list and selection; (3) Material Request: Added permission toggle for viewing Available Stock to dynamically show or hide available stock in the form, items table, and preview report; (4) Transfer Requisition: Formatted 'Add Item from Catalog' modal into a clean table structure (Code, Item, Specification, UOM, Brand, Origin, Action) and removed unnecessary rate/price information while preserving search; (5) Transfer Requisition Approval: Updated 'View' action to open the full Transfer Requisition details on a dedicated page with item details, requested quantity, and available stock, and provided Approve, Reject, and Return actions on the details page; (6) Transfer Issue: Fixed runtime crash when selecting Intra-Company Transfer mode; (7) Item Transaction Ledger: Fixed page load crash, hid 'Transaction Types Tracked' KPI card, and added searchable Item input with clear button; (8) Item Movement Register: Removed Item Movement Register from Inventory Reports menus in sidebar and topbar; (9) Location Stock Register: Fixed page load crash, hid unneeded KPI cards (Active Storage Locations, Total Units in Bins, Bin Stock Valuation, Location Hierarchy), added searchable Item and Location filters, updated table column to 'Location Name', added Specification, Brand, and Origin columns, hid Batch column, and replaced drilldown with a detailed item stock movement history modal (In Qty, Out Qty, Balance).",
    "descriptionBn": "প্রকিউরমেন্ট এবং ইনভেনটরি ম্যানেজমেন্ট মডিউলে গুরুত্বপূর্ণ বাগ ফিক্স ও কার্যকারিতা উন্নয়ন সম্পন্ন করা হয়েছে: (১) পারচেজ অর্ডার / ওয়ার্ক অর্ডার: ক্রিয়েট পিও/ডব্লিউও পেজের ক্র্যাশ ফিক্স করা হয়েছে এবং ফর্মটি স্বাভাবিকভাবে কাজ করছে; (২) সাপ্লায়ার বিল: ওয়ার্ক অর্ডার/পিও থেকে আইটেম লেভেল ট্যাক্স (%) এবং ট্যাক্স অ্যামাউন্ট সরাসরি সাপ্লায়ার বিল আইটেম ও অ্যাপ্রুভাল ডসিয়ারে যুক্ত করা হয়েছে এবং আদার চার্জেস থেকে ডিফল্ট টাকার মান সরানো হয়েছে; (৩) ম্যাটেরিয়াল রিকোয়েস্ট: অ্যাভেইলেবল স্টক দেখার জন্য পারমিশন ও কনফিগারেশন টগল যুক্ত করা হয়েছে যা চালু বা বন্ধের ওপর ভিত্তি করে স্টক প্রদর্শিত হবে; (৪) ট্রান্সফার রিকুইজিশন: ক্যাটালগ থেকে আইটেম সিলেকশন মডালটিকে প্রপার টেবিল ফরম্যাটে (কোড, আইটেম, স্পেসিফিকেশন, ইউওএম, ব্র্যান্ড, অরিজিন ও অ্যাকশন) সাজানো হয়েছে এবং অপ্রয়োজনীয় দর/মূল্য তথ্য সরানো হয়েছে; (৫) ট্রান্সফার রিকুইজিশন অ্যাপ্রুভাল: অ্যাকশন কলামের 'View' বাটনে ক্লিক করলে সম্পূর্ণ ট্রান্সফার রিকুইজিশন বিবরণী নতুন পেজে ওপেন হবে এবং সেই পেজে অ্যাপ্রুভ, রিজেক্ট ও রিটার্ন অ্যাকশন প্রদান করা হয়েছে; (৬) ট্রান্সফার ইস্যু: ইন্ট্রা-কোম্পানি ট্রান্সফার সিলেক্ট করার ক্র্যাশ ফিক্স করা হয়েছে; (৭) আইটেম ট্রানজেকশন লেজার: পেজ লোড ক্র্যাশ ফিক্স, 'Transaction Types Tracked' কেপিআই লুকানো এবং সার্চেবল আইটেম ফিল্টার যোগ করা হয়েছে; (৮) আইটেম মুভমেন্ট রেজিস্টার: ইনভেনটরি রিপোর্টস মেনু থেকে আইটেম মুভমেন্ট রেজিস্টার সরানো হয়েছে; (৯) লোকেশন স্টক রেজিস্টার: পেজ লোড ক্র্যাশ ফিক্স, অপ্রয়োজনীয় ৪টি কেপিআই লুকানো, সার্চেবল আইটেম ও লোকেশন ফিল্টার যোগ, কলামের নাম 'Location Name' করা, স্পেসিফিকেশন/ব্র্যান্ড/অরিজিন যোগ, ব্যাচ কলাম লুকানো এবং ড্রিল-ডাউনে ইন-কোয়ান্টিটি, আউট-কোয়ান্টিটি ও ব্যালেন্স হিস্ট্রি মডাল যুক্ত করা হয়েছে।"
  },
  {
    "id": "549",
    "date": "2026-10-07T18:45",
    "type": "Procurement & Inventory Management UI, Workflow & Report Enhancements",
    "module": "Procurement & Inventory Management / Master Data, Transfers, Registers & Reports",
    "link": "/procurement-reports-monthly-purchase",
    "descriptionEn": "Implemented 26 requested UI, workflow, and report enhancements across Procurement and Inventory modules: (1) Renamed Vendor Categories label in Supplier/Vendor Setup; (2) Added item price history modal via 'H' button, item-level Tax (%), and filtered catalog strictly to service items when Document Type is Work Order; (3) In Item Setup, renamed 'Service Flag' to 'Service', renamed 'Valuation Method' to 'Issue Type' (FIFO/LIFO only), and positioned root parent item groups at the top of the group tree; (4) Added Tax field alongside VAT/Total, renamed Other Charges, and provided item-level charge inputs in Supplier Bill; (5) Resolved runtime crash in Material Requisition; (6) Hidden Rate and Total columns from Transfer Requisition forms; (7) Embedded Approve, Reject, and Return for Correction buttons inside Transfer Requisition Approval modal; (8) Introduced Intra-Company Transfer page and updated Inter-Company Transfer menu and requisition rules; (9) Cleaned filters, columns, and badges in Stock Balance Register; (10) Added searchable Item input and hid unneeded KPI in Item Transaction Ledger; (11) Cleaned filters and added Total Quantity table footer in Item Movement Register; (12) Added searchable Item selector, Value column, and Total Quantity & Value table footer in Batch Stock Register; (13) Streamlined KPIs, added Spec/Brand/Origin columns, table footer totals, and item movement timeline in Location Stock Register; (14) Removed action column, added Value column, and added table footer in Item Receipt Register; (15) Removed action column, added Value column, and added table footer in Item Issue Register; (16) Streamlined KPIs, added Value column, and added table footer in Stock Transfer Register; (17) Removed Stock Adjustment Register from Inventory sidebar and topbar menus; (18) Filtered approved write-offs, added Location column, and added table footer in Stock Write-Off Register; (19) Added Category filter, Spec/Brand/Origin columns, and table footer in Stock Valuation Register; (20) Enhanced Month-wise Material Receive Report with searchable Item, Category filter, and summarized Month/Qty/Value table with footer totals; (21) Enhanced Month-wise Material Issue Report with searchable Item, Group, Category filter, and summarized table with footer totals; (22) Enhanced Month-wise Supplier Return Report with searchable Item, Supplier, Group, Category, and summarized table with footer totals; (23) Removed Purchase Price Report & Payment Statement from Procurement menus, and renamed Month-wise Purchase Report to Item-wise Purchase Report; (24) Updated Item-wise Purchase Report with searchable master filters, from/to dates, date-wise listing table, and grand total footer; (25) Adjusted Month-wise Supplier Bill Report table container width, added Total Quantity column and footer with grand total quantity and value; (26) Standardized table footers across all inventory and procurement reports to consistently display total quantity and total value.",
    "descriptionBn": "প্রকিউরমেন্ট এবং ইনভেনটরি মডিউলে ২৬টি নতুন পরিবর্তন ও রিপোর্ট আধুনিকায়ন সম্পন্ন করা হয়েছে: (১) সাপ্লায়ার/ভেন্ডর ফর্মে লেবেল পরিবর্তন করে 'Vendor Category' করা হয়েছে; (২) পিও এবং ওয়ার্ক অর্ডারে আইটেম দর ইতিহাস দেখতে 'H' বাটন, ট্যাক্স (%) ইনপুট এবং ওয়ার্ক অর্ডারের ক্ষেত্রে শুধুমাত্র সার্ভিস আইটেম ফিল্টারিং যোগ করা হয়েছে; (৩) আইটেম সেটআপে 'Service Flag' এর নাম 'Service' এবং 'Valuation Method' এর নাম 'Issue Type' (FIFO ও LIFO) করা হয়েছে এবং গ্রুপ ট্রি-তে মূল প্যারেন্ট গ্রুপগুলোকে সবার উপরে সাজানো হয়েছে; (৪) সাপ্লায়ার বিলে ভ্যাট ও মোট টাকার পাশাপাশি ট্যাক্স ফিল্ড যোগ, আদার চার্জেস রিনেম এবং আইটেম লেভেল ইনপুট প্রদান করা হয়েছে; (৫) ম্যাটেরিয়াল রিকুইজিশন পেজের ক্র্যাশ ফিক্স করা হয়েছে; (৬) ট্রান্সফার রিকুইজিশন ফর্মে অপ্রয়োজনীয় রেট ও টোটাল কলাম লুকানো হয়েছে; (৭) ট্রান্সফার রিকুইজিশন অ্যাপ্রুভাল মডালে সরাসরি অ্যাপ্রুভ, রিজেক্ট ও রিটার্ন বাটন যুক্ত করা হয়েছে; (৮) ইন্ট্রা-কোম্পানি ট্রান্সফার পেজ তৈরি ও ইন্টার-কোম্পানি ট্রান্সফার মেনু ও নিয়ম আপডেট করা হয়েছে; (৯) স্টক ব্যালেন্স রিপোর্টে ফিল্টার ও কলাম গোছানো হয়েছে; (১০) ট্রানজেকশন লেজারে সার্চেবল আইটেম ফিল্টার যোগ করা হয়েছে; (১১) আইটেম মুভমেন্ট রিপোর্টে ফিল্টার ক্লিন এবং টেবিলের নিচে মোট কোয়ান্টিটি দেখানো হয়েছে; (১২) ব্যাচ স্টক রিপোর্টে সার্চেবল আইটেম, ভ্যালু কলাম ও ফুটারে মোট কোয়ান্টিটি এবং মোট টাকা যোগ করা হয়েছে; (১৩) লোকেশন স্টক রিপোর্টে স্পেসিফিকেশন/ব্র্যান্ড/অরিজিন কলাম, ফুটার টোটাল ও মুভমেন্ট হিস্ট্রি মডাল যোগ করা হয়েছে; (১৪) রিসিট রেজিস্টারে অপ্রয়োজনীয় অ্যাকশন কলাম সরিয়ে ভ্যালু কলাম ও ফুটার টোটাল যোগ করা হয়েছে; (১৫) ইস্যু রেজিস্টারে অপ্রয়োজনীয় অ্যাকশন কলাম সরিয়ে ভ্যালু কলাম ও ফুটার টোটাল যোগ করা হয়েছে; (১৬) স্টক ট্রান্সফার রিপোর্টে কেপিআই গোছানো, ভ্যালু কলাম এবং ফুটার টোটাল যোগ করা হয়েছে; (১৭) ইনভেনটরি সাইডবার ও টপবার মেনু থেকে স্টক অ্যাডজাস্টমেন্ট রেজিস্টার সরানো হয়েছে; (১৮) স্টক রাইট-অফ রিপোর্টে অ্যাপ্রুভড রেকর্ড ফিল্টার, লোকেশন কলাম ও ফুটার টোটাল যোগ করা হয়েছে; (১৯) স্টক ভ্যালুয়েশন রিপোর্টে ক্যাটাগরি ফিল্টার, স্পেক/ব্র্যান্ড/অরিজিন ও ফুটার টোটাল যোগ করা হয়েছে; (২০) মাসভিত্তিক ম্যাটেরিয়াল রিসিভ রিপোর্টে সার্চেবল আইটেম, ক্যাটাগরি সিলেক্ট ও সামারি টেবিলসহ ফুটার টোটাল কোয়ান্টিটি ও ভ্যালু যোগ করা হয়েছে; (২১) মাসভিত্তিক ম্যাটেরিয়াল ইস্যু রিপোর্টে সার্চেবল ফিল্টার ও সামারি টেবিলসহ ফুটার টোটাল যোগ করা হয়েছে; (২২) মাসভিত্তিক সাপ্লায়ার রিটার্ন রিপোর্টে সার্চেবল ফিল্টার ও সামারি টেবিলসহ ফুটার টোটাল যোগ করা হয়েছে; (২৩) প্রকিউরমেন্ট মেনু থেকে পারচেজ প্রাইস রিপোর্ট ও পেমেন্ট স্টেটমেন্ট সরানো হয়েছে এবং মান্থ-ওয়াইজ পারচেজ রিপোর্ট রিনেম করে 'Item-wise Purchase Report' করা হয়েছে; (২৪) আইটেম-ওয়াইজ পারচেজ রিপোর্টে সার্চেবল ফিল্টার, তারিখ রেঞ্জ, তারিখভিত্তিক রো লিস্টিং ও গ্র্যান্ড টোটাল ফুটার যুক্ত করা হয়েছে; (২৫) মান্থ-ওয়াইজ সাপ্লায়ার বিল রিপোর্টে টেবিলের কন্টেইনার উইডথ ঠিক করা হয়েছে এবং ফুটারে মোট কোয়ান্টিটি ও মোট টাকার হিসাব দেখানো হয়েছে; (২৬) সকল ইনভেনটরি ও প্রকিউরমেন্ট রিপোর্টে টেবিলের নিচে মোট কোয়ান্টিটি ও মোট ভ্যালু প্রদর্শনের মানদণ্ড শতভাগ নিশ্চিত করা হয়েছে।"
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
    "descriptionBn": "প্রকিউরমেন্ট এবং ইনভেনটরি ম্যানেজমেন্টে ব্যাপক আপগ্রেড বাস্তবায়ন করা হয়েছে: (১) সাপ্লায়ার সেটআপে ভেন্ডর ক্যাটাগরি মাল্টি-সিলেক্ট ও লোকাল/ফরেন ফ্ল্যাগ অটো-নির্ধারণ; (২) কারেন্সি মাস্টারে সাব ইউনিট ও অ্যামাউন্ট ফরম্যাট ড্রপডাউন; (৩) সিএস-এ দর ইতিহাস মোডাল ('H' বাটন) ও ট্যাক্স ইনপুট; (৪) ওয়ার্ক অর্ডারে ট্যাক্স (%) এবং সার্ভিস আইটেম ফিল্টারিং; (৫) আইটেম সেটআপে সার্ভিস ফ্ল্যাগ, ইস্যু টাইপ ও রুট প্যারেন্ট গ্রুপ প্রদর্শন; (৬) সাপ্লায়ার বিলে ট্যাক্স ফিল্ড ও সার্ভিস আইটেম দিয়ে আদার চার্জেস নির্বাচন; (৭) ওয়্যারহাউস সেটআপে ওয়েটেড অ্যাভারেজ ডিফল্ট; (৮) ম্যাটেরিয়াল রিকুইজিশনে অ্যাভেইলেবল স্টক পলিসি টগল; (৯) ট্রান্সফার রিকুইজিশন, অ্যাপ্রুভাল ডেস্ক ও ট্রান্সফার ইস্যু সিস্টেম প্রণয়ন।"
  },
  {
    "id": "546",
    "date": "2026-10-07T14:38",
    "type": "Enhancement",
    "module": "Workspace Selection & Module Launcher (Finance & Accounting Integration)",
    "link": "/module-selection",
    "descriptionEn": "Activated 'Finance & Accounting' under the Active Modules section on the Workspace Selection page with direct routing to https://pakiza-accounts.vercel.app/, and updated the topbar Corporate Modules launcher accordingly.",
    "descriptionBn": "ওয়ার্কস্পেস সিলেকশন পেজে 'Active Modules' সেকশনে 'Finance & Accounting' মডিউলটি যুক্ত করা হয়েছে যা ক্লিক করলে সরাসরি https://pakiza-accounts.vercel.app/ ওপেন হবে এবং টপবার মডিউল লঞ্চারেও লিংকটি আপডেট করা হয়েছে।"
  },
  {
    "id": "545",
    "date": "2026-10-07T13:00",
    "type": "Enhancement",
    "module": "Configure - Job & Employee Setup (OT & Salary Formula Editing)",
    "link": "/configure-employment?tab=otFormula",
    "descriptionEn": "Enhanced formula editing across OT Configuration and Salary Structure with 1-click direct formula editor from the master table, inline row editing with auto-save, formula builder submodal presets (2x Labour Law, 1.5x OT, Gross deducted, etc.), token inserters, and interactive live calculation sandbox tester.",
    "descriptionBn": "ওটি কনফিগারেশন এবং স্যালারি স্ট্রাকচারে ফর্মুলা এডিটিং উন্নত করা হয়েছে; এখন মাস্টার টেবিল থেকেই ১-ক্লিকে সরাসরি ফর্মুলা এডিটর ওপেন করা যায়, টেবিলের রো-তে সরাসরি ইনলাইন টাইপ করে সেভ করা যায় এবং সাবমডালে কুইক প্রিসেট (লেবার ল ২x, ১.৫x, গ্রস ইত্যাদি), টোকেন ইনসার্টার ও লাইভ স্যালারি ক্যালকুলেটর যুক্ত করা হয়েছে।"
  },
  {
    "id": "544",
    "date": "2026-10-07T12:45",
    "type": "New Feature",
    "module": "Configure - Job & Employee Setup (OT Configuration Formula)",
    "link": "/configure-employment?tab=otFormula",
    "descriptionEn": "Added a new 'OT Configuration (Formula)' tab in Job & Employee Setup with formula-based overtime hourly rate builder, mathematical operator toolbar, variables (BASIC, GROSS, 208, etc.), type-based rules (Regular, Holiday, Festival, Night), and live calculation simulation.",
    "descriptionBn": "Job & Employee Setup পেজে নতুন 'OT Configuration (Formula)' ট্যাব যুক্ত করা হয়েছে যার মাধ্যমে টাইপ ভিত্তিক ওভারটাইম রেট ফর্মুলা তৈরি, গাণিতিক অপারেটর ও ভ্যারিয়েবল (BASIC, GROSS, 208 ইত্যাদি) দিয়ে কাস্টম সমীকরণ এবং লাইভ সিমুলেশন প্রিভিউ দেখা যাবে।"
  },
  {
    "id": "543",
    "date": "2026-10-06T17:54",
    "type": "Bug Fix",
    "module": "Dependencies / Build & Deployment",
    "descriptionEn": "Updated TanStack Start (@tanstack/react-start) and router dependencies to non-vulnerable patched versions (1.168.60+) to fix Vercel XSS vulnerability build error.",
    "descriptionBn": "ভার্সেল (Vercel) বিল্ড এরর সমাধান করতে টানস্ট্যাক স্টার্ট (@tanstack/react-start) সহ প্যাকেজসমূহ নিরাপদ ও প্যাচড ভার্সনে (1.168.60+) আপডেট করা হয়েছে।"
  },
  {
    "id": "542",
    "date": "2026-10-06T17:43",
    "type": "Bug Fix",
    "module": "Configure - Company Setup (Designation Organogram)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Fixed TypeScript type error in openDirectionalAdd function to allow null target when adding the first designation to a blank organogram canvas.",
    "descriptionBn": "খালি অর্গানোগ্রাম ক্যানভাসে প্রথম পদবী যোগ করার সময় ওপেন-ডিরেকশনাল-অ্যাড ফাংশনে নাল (null) টাইপ এরর সমাধান করা হয়েছে।"
  },
  {
    "id": "541",
    "date": "2026-10-06T17:15",
    "type": "Enhancement",
    "module": "Configure - Company Setup (Designation Organogram Direct Selection)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Restored the Designation Organogram system under Configure > Company Setup and updated the 'Add Next Hierarchy Level' action to directly open the designation selector modal for Level 2 selection without manual title entry.",
    "descriptionBn": "Configure > Company Setup এ Organogram ফিচারটি পুনর্নির্মাণ করা হয়েছে এবং 'Add Next Hierarchy Level' বাটনে ক্লিক করলে ম্যানুয়ালি নাম টাইপ করার বদলে সরাসরি লেভেল ২ এর পদবী নির্বাচন করার সুবিধা যুক্ত করা হয়েছে।"
  },
  {
    "id": "540",
    "date": "2026-10-01T17:42",
    "type": "Bug Fix",
    "module": "HR Reports",
    "descriptionEn": "Fixed PDF export modal prop mismatch (title to reportTitle) causing typescript errors across multiple HR report pages.",
    "descriptionBn": "নাইট কার্ড এবং টিফিন কার্ড এর মত বিভিন্ন এইচআর রিপোর্টে পিডিএফ ডাউনলোড করার সময় যে সমস্যা হচ্ছিল তা ঠিক করা হয়েছে।"
  },
  {
    "id": "539",
    "date": "2026-10-01T11:18",
    "type": "New Feature",
    "module": "HR Reports (Absent Counseling)",
    "link": "/hr-report-absent-counseling",
    "descriptionEn": "Implemented a new Absent Counseling Report page in the HR Reports section to manage, track, and export employee absentee reasons and HR/Welfare actions.",
    "descriptionBn": "এইচআর রিপোর্টস সেকশনে নতুন Absent Counseling রিপোর্ট পেজ যুক্ত করা হয়েছে, যার মাধ্যমে কর্মীদের অনুপস্থিতির কারণ এবং এইচআর বা ওয়েলফেয়ার টিমের গৃহীত পদক্ষেপ দেখা যাবে।"
  },
  {
    "id": "538",
    "date": "2026-10-01T11:14",
    "type": "New Feature",
    "module": "HR Reports (Continous Absent)",
    "link": "/hr-report-continuous-absent",
    "descriptionEn": "Implemented a new Continous Absent report page in the HR Reports section, enabling tracking of consecutive absentee streaks across all employees.",
    "descriptionBn": "এইচআর রিপোর্টস সেকশনে নতুন Continous Absent রিপোর্ট পেজ যুক্ত করা হয়েছে, যার মাধ্যমে একটানা অনুপস্থিত কর্মীদের তালিকা এবং দিন সংখ্যা দেখা যাবে।"
  },
  {
    "id": "537",
    "date": "2026-10-01T11:02",
    "type": "New Feature",
    "module": "HR Reports (Without In Out Attendance)",
    "link": "/hr-report-without-in-out-attendance",
    "descriptionEn": "Implemented a new Without In Out Attendance report page in the HR Reports section, allowing HR to identify employees missing either clock-in or clock-out punches.",
    "descriptionBn": "এইচআর রিপোর্টস সেকশনে নতুন Without In Out Attendance রিপোর্ট পেজ যুক্ত করা হয়েছে, যেখান থেকে এইচআর ইন বা আউট পাঞ্চ মিস হওয়া কর্মীদের তালিকা দেখতে ও এক্সপোর্ট করতে পারবেন।"
  },
  {
    "id": "536",
    "date": "2026-10-01T10:55",
    "type": "New Feature",
    "module": "HR Reports (Attendance & Overtime)",
    "link": "/hr-report-attendance-and-overtime",
    "descriptionEn": "Implemented a new Attendance & Overtime report page in the HR Reports section, allowing users to view, filter, and export detailed in/out times and overtime hours for all employees.",
    "descriptionBn": "এইচআর রিপোর্টস সেকশনে নতুন Attendance & Overtime রিপোর্ট পেজ যুক্ত করা হয়েছে, যেখান থেকে ব্যবহারকারীরা সকল কর্মীদের নির্দিষ্ট দিনের প্রবেশ ও প্রস্থানের সময় এবং ওভারটাইম দেখতে ও এক্সপোর্ট করতে পারবেন।"
  },
  {
    "id": "535",
    "date": "2026-10-01T10:50",
    "type": "New Feature",
    "module": "HR Reports (Attendance Details)",
    "link": "/hr-report-attendance-details",
    "descriptionEn": "Implemented a new Attendance Details report page in the HR Reports section, allowing users to view, filter, and export detailed in/out times for all employees.",
    "descriptionBn": "এইচআর রিপোর্টস সেকশনে নতুন Attendance Details রিপোর্ট পেজ যুক্ত করা হয়েছে, যেখান থেকে ব্যবহারকারীরা সকল কর্মীদের নির্দিষ্ট দিনের প্রবেশ ও প্রস্থানের সময় দেখতে ও এক্সপোর্ট করতে পারবেন।"
  },
  {
    "id": "534",
    "date": "2026-10-01T10:36",
    "type": "New Feature",
    "module": "HR Reports (Attendance Details PrevAbsent)",
    "link": "/hr-report-attendance-details-prevabsent",
    "descriptionEn": "Implemented a new Attendance Details PrevAbsent report page in the HR Reports section, allowing users to view, filter, and export detailed in/out times for previously absent employees.",
    "descriptionBn": "এইচআর রিপোর্টস সেকশনে নতুন Attendance Details PrevAbsent রিপোর্ট পেজ যুক্ত করা হয়েছে, যেখান থেকে ব্যবহারকারীরা পূর্বে অনুপস্থিত থাকা কর্মীদের নির্দিষ্ট দিনের প্রবেশ ও প্রস্থানের সময় দেখতে ও এক্সপোর্ট করতে পারবেন।"
  },
  {
    "id": "533",
    "date": new Date().toISOString().slice(0, 16),
    "type": "New Feature",
    "module": "HR Reports (Separation List)",
    "link": "/hr-report-separation-list",
    "descriptionEn": "Implemented a new 'Separation List' report page in the HR Reports section, allowing users to view, filter, and export detailed employee separation records including designation, joining date, and action date.",
    "descriptionBn": "এইচআর রিপোর্টস সেকশনে নতুন 'Separation List' রিপোর্ট পেজ যুক্ত করা হয়েছে, যেখান থেকে ব্যবহারকারীরা পদত্যাগ বা সেপারেশন হওয়া কর্মীদের বিস্তারিত তথ্য (পদবি, যোগদানের তারিখ, অ্যাকশন ডেট ইত্যাদি) দেখতে ও এক্সপোর্ট করতে পারবেন।"
  },
  {
    "id": "532",
    "date": "2026-10-01T11:45",
    "type": "New Feature",
    "module": "HR Reports (Tiffin Card)",
    "link": "/hr-report-tiffin-card",
    "descriptionEn": "Implemented a new 'Tiffin Card' report page in the HR Reports section, allowing users to view, filter, and export individual employee tiffin duty records including in/out times, total hours, and net pay.",
    "descriptionBn": "এইচআর রিপোর্টস সেকশনে নতুন 'Tiffin Card' রিপোর্ট পেজ যুক্ত করা হয়েছে, যেখান থেকে ব্যবহারকারীরা নির্দিষ্ট কর্মীর টিফিন ডিউটির বিস্তারিত তথ্য (প্রবেশ/প্রস্থানের সময়, মোট ঘণ্টা এবং প্রদেয় অর্থের পরিমাণ) দেখতে ও এক্সপোর্ট করতে পারবেন।"
  },
  {
    "id": "531",
    "date": "2026-10-01T11:43",
    "type": "New Feature",
    "module": "HR Reports (Night Card)",
    "link": "/hr-report-night-card",
    "descriptionEn": "Implemented a new 'Night Card' report page in the HR Reports section, allowing users to view, filter, and export individual employee night duty records including in/out times, total hours, and net pay.",
    "descriptionBn": "এইচআর রিপোর্টস সেকশনে নতুন 'Night Card' রিপোর্ট পেজ যুক্ত করা হয়েছে, যেখান থেকে ব্যবহারকারীরা নির্দিষ্ট কর্মীর নাইট ডিউটির বিস্তারিত তথ্য (প্রবেশ/প্রস্থানের সময়, মোট ঘণ্টা এবং প্রদেয় অর্থের পরিমাণ) দেখতে ও এক্সপোর্ট করতে পারবেন।"
  },
  {
    "id": "530",
    "date": "2026-10-01T11:42",
    "type": "New Feature",
    "module": "HR Reports (Tiffin Allowance All)",
    "link": "/hr-report-tiffin-allowance-all",
    "descriptionEn": "Implemented a new 'Tiffin Allowance All' report page in the HR Reports section, allowing users to view, filter, and export detailed tiffin allowance logs, total days, and net payable amounts for employees across various departments and sections.",
    "descriptionBn": "এইচআর রিপোর্টস সেকশনে নতুন 'Tiffin Allowance All' রিপোর্ট পেজ যুক্ত করা হয়েছে, যেখান থেকে ব্যবহারকারীরা বিভিন্ন ডিপার্টমেন্ট এবং সেকশনের কর্মীদের টিফিন অ্যালাউন্সের বিস্তারিত তথ্য, মোট দিন এবং প্রদেয় অর্থের পরিমাণ দেখতে, ফিল্টার করতে ও এক্সপোর্ট করতে পারবেন।"
  },
  {
    "id": "529",
    "date": "2026-10-01T11:26",
    "type": "Bug Fix / System Stability",
    "module": "System Routing & Git Merge Conflict Resolution",
    "link": "/changes",
    "descriptionEn": "Resolved Git merge conflicts in changes tracking data and route definitions, preventing Vite runtime evaluation errors and restoring smooth navigation across the application.",
    "descriptionBn": "চেঞ্জেস ট্র্যাকিং ও রাউট ডেফিনেশনের গিট মার্জ কনফ্লিক্ট সমাধান করা হয়েছে, যার ফলে ভাইট (Vite) রানটাইম এরর দূর হয়ে সিস্টেম স্বাভাবিকভাবে সচল হয়েছে।"
  },
  {
    "id": "528",
    "date": "2026-09-28T18:22",
    "type": "UI/UX & Card Simplification",
    "module": "Configure - Company Setup (Organogram Card Simplification)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Removed redundant 'Reports To' label and selector across the Designation Organogram: cards now cleanly focus directly on the designation name and title without cluttering reporting lines, and the 'Reports To' input was removed from the designation modal and table view.",
    "descriptionBn": "পদবি ভিত্তিক অর্গ্যানোগ্রাম কার্ড থেকে অপ্রয়োজনীয় 'Reports To' লেখা ও অপশন সম্পূর্ণ বাদ দেওয়া হয়েছে: এখন কার্ডে সরাসরি পদবির নাম (Designation Name) পরিষ্কার ও সুন্দরভাবে প্রদর্শিত হয়, এবং ডেসিগনেশন মডাল ও টেবিল ভিউ থেকেও 'Reports To' ফিল্ডটি অপসারণ করা হয়েছে।"
  },
  {
    "id": "527",
    "date": "2026-09-28T18:10",
    "type": "UI/UX & Builder Ergonomics",
    "module": "Configure - Company Setup (Organogram Decluttering, Blank Canvas & Clear All)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Decluttered the Designation Organogram and introduced flexible blank canvas controls: 4-way directional add buttons and card toolbars are now cleanly hidden by default and revealed smoothly on hover (with a toolbar toggle to show all controls if desired), added a '+ Blank Canvas' action to initiate completely empty templates, added a dedicated 'Remove All' button to wipe/reset the active template's designations with confirmation, and provided an interactive Root Designation picker to place the starting role on an empty canvas.",
    "descriptionBn": "পদবি ভিত্তিক অর্গ্যানোগ্রাম ডায়াগ্রামের অপ্রয়োজনীয় জটলা দূর করে পরিচ্ছন্ন ভিউ এবং শূন্য থেকে নতুন চার্ট তৈরির সুবিধা যুক্ত করা হয়েছে: কার্ডের চারপাশের ৪টি ডিরেকশনাল (+) বাটন এবং নিচের টুলবার এখন সাধারণ অবস্থায় লুকিয়ে থাকবে এবং মাউস হোভার করলেই মসৃণভাবে ভেসে উঠবে (প্রয়োজনে সব বাটন দৃশ্যমান রাখার টগল অপশনও রয়েছে), সম্পূর্ণ খালি টেমপ্লেট তৈরির জন্য '+ Blank Canvas' বোতাম এবং টেমপ্লেট মডালে স্পষ্ট চয়েস কার্ড যুক্ত করা হয়েছে, বর্তমান টেমপ্লেটের সব পদবি একসাথে মুছে ফেলার জন্য 'Remove All' অপশন যুক্ত করা হয়েছে, এবং শূন্য ক্যানভাসে প্রথম শীর্ষ পদবি (Level 1 Root) যুক্ত করার উপযোগী পিকার সিস্টেম চালু করা হয়েছে।"
  },
  {
    "id": "526",
    "date": "2026-09-28T17:52",
    "type": "UI/UX & Design Beautification",
    "module": "Configure - Company Setup (Organogram Beautification & Compact Layout)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Refined and beautified the Designation Organogram with an ultra-compact, high-density executive aesthetic: tightened card padding, streamlined card dimensions (185-195px multi-role, 210-260px single-role), subtle level badges, sleek 4-way micro directional add buttons (+ Above, + Below, ◄+, +►), compact branching & converging connection rails, modernized template directory table, and a space-efficient directional picker modal.",
    "descriptionBn": "পদবি ভিত্তিক অর্গ্যানোগ্রাম ব্যবস্থাকে আরও আকর্ষণীয়, স্লিক এবং আল্ট্রা-কম্প্যাক্ট ডিজাইনে রূপান্তর করা হয়েছে: কার্ডের সাইজ ও প্যাডিং সুষম করা হয়েছে, প্রতিটি কার্ডের চারপাশের ৪টি ডিরেকশনাল (+) বাটনকে আধুনিক মাইক্রো-পিল আকারে নিখুঁত করা হয়েছে, কানেক্টিং রেল ও অ্যারোগুলোকে পরিমিত উচ্চতায় সাজানো হয়েছে, টেমপ্লেট ডিরেক্টরি টেবিলকে কম্প্যাক্ট করা হয়েছে এবং পদবি সিলেক্টর পপআপ মডালটিকে আরও দৃষ্টিনন্দন ও ব্যবহারবান্ধব করা হয়েছে।"
  },
  {
    "id": "525",
    "date": "2026-09-28T17:48",
    "type": "Feature Enhancement & Interactive Builder",
    "module": "Configure - Company Setup (Organogram Templates & Directional Builder)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Implemented interactive Template Table View and 4-way Directional Add (+) buttons for the Designation Organogram. Templates can now be managed in a list view with quick active/inactive toggles, direct diagram view & edit, clone, and deletion. In the diagram builder, every designation card features directional add options (+ Above, + Below, + Left, + Right). Clicking any direction opens a remaining designations picker modal to quickly select and place unassigned designations or create custom ones directly into the hierarchy.",
    "descriptionBn": "অর্গ্যানোগ্রাম টেমপ্লেটগুলোর জন্য লিস্ট/টেবিল ভিউ এবং প্রতিটি পদবি কার্ডের ৪ দিকেই (উপরে, নিচে, ডানে, বামে) ডিরেকশনাল যোগ (+) অপশন যুক্ত করা হয়েছে। টেবিল ভিউ থেকে টেমপ্লেট সহজে এক ক্লিকে একটিভ/ইন-একটিভ করা এবং সরাসরি ডায়াগ্রাম দেখে এডিট করা যায়। ডায়াগ্রামে যেকোনো পদবির চারপাশে থাকা (+▲ উপরে, +▼ নিচে, ◄+ বামে, +► ডানে) বাটনে ক্লিক করলেই বাকি থাকা পদবিগুলোর লিস্ট চলে আসে, যেখান থেকে পছন্দমতো পদবি নির্বাচন করে সাথে সাথে কাঙ্ক্ষিত স্থানে যুক্ত করা যায়।"
  },
  {
    "id": "524",
    "date": "2026-09-28T17:35",
    "type": "Feature Enhancement & Architecture",
    "module": "Configure - Company Setup (Designation Organogram & Templates)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Replaced department-dependent organograms with a pure designation-based organogram system powered by dynamic templates. Features the exact corporate hierarchy (Board of Directors -> CEO -> parallel side-by-side CXOs [COO, CFO, CTO, CMO, CHRO] with branching and converging connector rails -> GM -> DGM -> AGM -> Senior Manager -> Manager -> Deputy Manager -> Assistant Manager -> Executive -> Officer), template active/inactive toggling, template duplication, custom template creation, and full persistent storage.",
    "descriptionBn": "ডিপার্টমেন্টের প্রয়োজনীয়তা বাদ দিয়ে পুরোপুরি পদবি (Designation) ভিত্তিক ডায়নামিক অর্গ্যানোগ্রাম ব্যবস্থা চালু করা হয়েছে, যা টেমপ্লেট আকারে কাজ করে। ব্যবহারকারীর চাহিদা অনুযায়ী হুবহু হায়ারার্কি (Board of Directors -> CEO -> পাশাপাশি CXO [COO, CFO, CTO, CMO, CHRO] ব্রাঞ্চিং ও কনভার্জিং কানেক্টরসহ -> GM -> DGM -> AGM -> Senior Manager -> Manager -> Deputy Manager -> Assistant Manager -> Executive -> Officer) তৈরি করা হয়েছে। যেকোনো টেমপ্লেট একটি ক্লিকেই একটিভ বা ইন-একটিভ করা যায়, নতুন টেমপ্লেট তৈরি ও ক্লোন করা যায়।"
  },
  {
    "id": "523",
    "date": "2026-09-28T17:05",
    "type": "Feature Enhancement",
    "module": "Configure - Company Setup (Designation & Organogram)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Enhanced the Organogram with a dynamic multi-department side-by-side branch structure: root CEO/MD leadership trunk with horizontal distribution rail, side-by-side department column cards with ◄ ► horizontal reorder controls, multi-select department filter pills, department-specific color themes, and within-department side-by-side role positioning.",
    "descriptionBn": "অর্গ্যানোগ্রাম ব্যবস্থাকে ডায়নামিক মাল্টি-ডিপার্টমেন্ট সাইড-বাই-সাইড ব্রাঞ্চ কাঠামোর সাথে আরও উন্নত করা হয়েছে: শীর্ষ সিইও/এমডি নোডের নিচে অনুভূমিক ডিস্ট্রিবিউশন রেল, পাশাপাশি সাজানো ডিপার্টমেন্ট কলাম কার্ড, ◄ ► বাটন দিয়ে ডিপার্টমেন্টগুলোর অবস্থান পরিবর্তন, মাল্টি-ডিপার্টমেন্ট ফিল্টার পিলস এবং প্রতিটি ডিপার্টমেন্টের নির্দিষ্ট কালার থিম যুক্ত করা হয়েছে।"
  },
  {
    "id": "522",
    "date": "2026-09-28T17:00",
    "type": "New Feature & UI Component",
    "module": "Configure - Company Setup (Designation & Organogram)",
    "link": "/company-setup?tab=organogram",
    "descriptionEn": "Added a dedicated 'Designation & Organogram' tab under Company Setup. Introduced multi-level hierarchy rank and side-by-side horizontal position controls for designations sharing the same level (e.g. CMO, CTO, CFO at Level 2). Included interactive Organogram Chart View, List View, department filtering, quick level/position controls, and full persistent storage.",
    "descriptionBn": "কোম্পানি সেটিংসে 'Designation & Organogram' নামে একটি নতুন ট্যাব যুক্ত করা হয়েছে। একই লেভেলের পদবিগুলোকে (যেমন CMO, CTO, CFO) পাশাপাশি প্রদর্শন করার জন্য মাল্টি-লেভেল র্যাংক ও সাইড-বাই-সাইড পজিশন কন্ট্রোল সুবিধা তৈরি করা হয়েছে, যার সাথে ইন্টারঅ্যাক্টিভ অর্গ্যানোগ্রাম চার্ট ভিউ, লিস্ট ভিউ এবং ডিপার্টমেন্ট ফিল্টারিং যুক্ত রয়েছে।"
  },
  {
    "id": "521",
    "date": "2026-09-28T15:58",
    "type": "Print Fix",
    "module": "Global & Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Fixed floating AI Chatbot widget appearing on printed pages by applying print:hidden to the root chatbot container, adding global @media print display: none rules, and explicitly excluding fixed bottom-right floating widgets from print outputs.",
    "descriptionBn": "প্রিন্ট করার সময় পাতার নিচের ডান কোনায় ভেসে থাকা এআই চ্যাটবট আইকন চলে আসার সমস্যাটি সমাধান করা হয়েছে: চ্যাটবটের রুট এলিমেন্টে print:hidden যুক্ত করা হয়েছে এবং গ্লোবাল প্রিন্ট সিএসএস-এ এটি পুরোপুরি হাইড করা হয়েছে।"
  },
  {
    "id": "520",
    "date": "2026-09-28T15:56",
    "type": "UI & Typography Standardization",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Standardized and harmonized all font sizes across the Final Settlement Sheet: aligned section titles uniformly to 11px, box and table headers to 10px bold, data rows and values to 10px, subtotals to 10px with consistent 2-decimal formatting, and balanced Grand Total banner elements at 11px to eliminate disproportionate text.",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট শিটের সমস্ত ফন্ট সাইজ সামঞ্জস্যপূর্ণ ও সুষম করা হয়েছে: প্রতিটি সেকশন টাইটেল ১১ পিক্সেল, টেবিল ও বক্সের হেডার ১০ পিক্সেল বোল্ড, সকল রো ও টাকার মান ১০ পিক্সেল এবং গ্র্যান্ড টোটাল ব্যানারকে সমান ১১ পিক্সেলে সুবিন্যস্ত করা হয়েছে যাতে কোনো লেখা অসঙ্গতভাবে বড় বা ছোট না দেখায়।"
  },
  {
    "id": "519",
    "date": "2026-09-28T15:52",
    "type": "UI & Typography Update",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Enforced Inter font across the entire Final Settlement Sheet, ensuring all numbers, currency values, codes, and figures use Inter instead of monospace. Pinned the signatures block strictly to the bottom of the sheet across all screen heights and single-page print outputs.",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট শিটের সমস্ত ফন্ট (সব নম্বর, টাকার পরিমাণ ও কোডসহ) 'Inter' ফন্টে রূপান্তর করা হয়েছে এবং স্বাক্ষরের অংশটি পাতার একেবারে নিচে পিন করে রাখা হয়েছে যাতে মাঝখানে ফাঁকা জায়গা থাকলেও স্বাক্ষর সবসময় নিচে অবস্থান করে।"
  },
  {
    "id": "518",
    "date": "2026-09-28T15:43",
    "type": "Print Optimization",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Optimized single A4 print layout for Final Settlement Sheet: expanded top margin above management signatures (mt-14/print:mt-16), increased signature clearance height (h-20/print:h-22 and h-18/print:h-20), and widened inter-tier row spacing (mt-14/print:mt-16) to eliminate bottom whitespace while ensuring single-page print-to-fit compliance.",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট শিটের সিঙ্গেল A4 প্রিন্ট লেআউট নিখুঁত করা হয়েছে: সিগনেচারের উপরের মার্জিন, সিগনেচার করার স্পেস হাইট এবং প্রথম ও দ্বিতীয় সারির মাঝের ফাঁকা জায়গা বৃদ্ধি করা হয়েছে, যার ফলে পাতার নিচের ফাঁকা জায়গা সুষমভাবে পূরণ হয়েছে এবং সিঙ্গেল A4 পেজে প্রিন্টও নিখুঁত বজায় রয়েছে।"
  },
  {
    "id": "517",
    "date": "2026-09-28T15:42",
    "type": "UI Layout Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Separated 'Earning Sectors' and 'Deduction Sectors' into independent bordered boxes with a clean margin gap, resolving the cramped layout where the Total Earning summary was directly attached to the Deduction Sectors header.",
    "descriptionBn": "'Payment Info' এর ভেতরে 'Earning Sectors' এবং 'Deduction Sectors'-কে দুটি পৃথক বর্ডার্ড বক্সে ভাগ করে মাঝে মার্জিন গ্যাপ দেওয়া হয়েছে, ফলে Total Earning এবং Deduction Sectors একে অপরের সাথে লেগে না থেকে পরিষ্কারভাবে আলাদা প্রদর্শিত হচ্ছে।"
  },
  {
    "id": "516",
    "date": "2026-09-28T15:40",
    "type": "UI Layout Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Re-architected Final Settlement Sheet header: removed company address, aligned 'FINAL SETTLEMENT SHEET' title to the exact center between the logo and portrait, and resized the employee photo frame (66px × 82px) for a balanced professional appearance.",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট শিটের হেডার সেকশন থেকে কোম্পানির ঠিকানা সম্পূর্ণ বাদ দেওয়া হয়েছে, 'FINAL SETTLEMENT SHEET' টাইটেলটি লোগো ও ছবির মাঝখানে সেন্টার অ্যালাইন করা হয়েছে এবং এমপ্লয়ির ছবির ফ্রেমের সাইজ প্রয়োজন অনুযায়ী কিছুটা বড় (66px × 82px) করে ভারসাম্যপূর্ণ করা হয়েছে।"
  },
  {
    "id": "515",
    "date": "2026-09-28T15:39",
    "type": "UI Consistency",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Updated section heading colors for 'Earn Leave Details', 'Service Benefit Details', and 'Compensation Details' to match 'Payment Info' theme green (#4caf50), ensuring uniform visual branding across all settlement breakdown quadrants.",
    "descriptionBn": "'Earn Leave Details', 'Service Benefit Details' এবং 'Compensation Details' সেকশন হেডারগুলোর কালার 'Payment Info' এর মতো একই ব্র্যান্ড থিম গ্রিন (#4caf50) কালারে পরিবর্তন করা হয়েছে।"
  },
  {
    "id": "514",
    "date": "2026-09-28T15:37",
    "type": "UI Layout Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Reformatted Final Settlement Sheet header: removed duplicate 'Pakiza Software Limited' text header, placed the official logo directly on top followed vertically by the company address and 'FINAL SETTLEMENT SHEET' title, and reduced employee portrait photo frame dimensions for a cleaner compact layout.",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট শিটের হেডার সেকশন রিফরম্যাট করা হয়েছে: অতিরিক্ত 'Pakiza Software Limited' টেক্সট সরিয়ে শুধুমাত্র লোগো রাখা হয়েছে এবং লোগোর ঠিক নিচে ক্রমান্বয়ে ঠিকানা ও 'FINAL SETTLEMENT SHEET' শিরোনাম সাজানো হয়েছে। পাশাপাশি এমপ্লয়ির ছবির সাইজ আরও ছোট ও পরিপাটি করা হয়েছে।"
  },
  {
    "id": "513",
    "date": "2026-09-28T15:36",
    "type": "UI / Print Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Enhanced the Grand Total section in Final Settlement Sheet into a full-width colored banner containing Bangladeshi Taka In Words on the left and Grand Total amount on the right. Increased vertical spacing and height for management signature rows to provide proper clearance while maintaining single A4 page print-to-fit layout.",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট শিটে গ্র্যান্ড টোটাল সেকশনটিকে পুরো উইডথ জুড়ে একক কালারের ব্যানারে রূপান্তর করা হয়েছে, যার বাম পাশে টাকায় কথায় (In Words) এবং ডান পাশে গ্র্যান্ড টোটাল অ্যামাউন্ট প্রদর্শিত হচ্ছে। এছাড়া ম্যানেজমেন্ট সিগনেচার সেকশনের উপর-নিচ মার্জিন ও হাইট বাড়িয়ে পর্যাপ্ত ফাঁকা জায়গা (proper gap) নিশ্চিত করা হয়েছে যাতে সিঙ্গেল A4 পেজে প্রিন্টও নিখুঁত থাকে।"
  },
  {
    "id": "512",
    "date": "2026-09-28T15:32",
    "type": "UI Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Integrated official Pakiza client logo (client_logo.png) into the Final Settlement Sheet header for both the detailed settlement view (/final-settlement) and settlement report printable statement modal (/final-settlement-report).",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট শিটের হেডার সেকশনে অফিসিয়াল পাকিজা ক্লায়েন্ট লোগো (client_logo.png) যুক্ত করা হয়েছে, যা ডিটেইল সেটেলমেন্ট ভিউ (/final-settlement) এবং সেটেলমেন্ট রিপোর্ট স্টেটমেন্ট প্রিভিউ মোডাল (/final-settlement-report) উভয় স্থানে প্রদর্শিত হবে।"
  },
  {
    "id": "511b",
    "date": "2026-09-28T15:35",
    "type": "Bug Fix / Routing",
    "module": "Conference Room Booking List",
    "link": "/conference-room-booking-list",
    "descriptionEn": "Fixed TanStack Router Route export in conference-room-booking-list.tsx enabling the route to compile and render properly at http://localhost:3000/conference-room-booking-list.",
    "descriptionBn": "conference-room-booking-list.tsx ফাইলে TanStack রুট এক্সপোর্ট পুনঃসংযোজন করে রাউটিং ফিক্স করা হয়েছে, যার ফলে http://localhost:3000/conference-room-booking-list পেজটি যথাযথভাবে লোড হচ্ছে।"
  },
  {
    "id": "511",
    "date": "2026-09-28T15:28",
    "type": "UI / Print Optimization",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Updated Final Settlement Sheet (/final-settlement): added formal management signature blocks (Prepared By, Checked By HR, Head of HR, Checked By Accounts, Recipients Signature, Checked By Audit, Authorized By), populated realistic demo compensation data with remarks, separated Net Payable into a standalone right-aligned Grand Total box matching company layout, reduced vertical spacing, and optimized print styles to perfectly fit a single A4 page as-is.",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট শিটে (/final-settlement) অফিসিয়াল ফরম্যাট অনুযায়ী ৭টি সিগনেচার ব্লক যুক্ত করা হয়েছে (প্রিপেয়ার্ড বাই, চেকড বাই এইচআর, হেড অব এইচআর, চেকড বাই অ্যাকাউন্টস, রিসিভেন্টস সিগনেচার, চেকড বাই অডিট ও অথরাইজড বাই)। কম্পেনসেশন ডিটেইলসে রিমার্কস সহ ডেমো ডাটা যুক্ত করা হয়েছে, পেমেন্ট ইনফো থেকে নেট পেয়াবল আলাদা করে ডানে গ্র্যান্ড টোটাল হিসেবে অ্যালাইন করা হয়েছে, সেকশনগুলোর গ্যাপ কমিয়ে কম্প্যাক্ট করা হয়েছে এবং সিঙ্গেল A4 পেজে ফিট হওয়ার মতো প্রিন্ট অপটিমাইজেশন নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "518",
    "date": "2026-09-28T15:45",
    "type": "UI / Print Optimization",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Improved print layout height (/print:h-20), and widened inter-tier row spacing (mt-14/print:mt-16) to eliminate bottom whitespace while ensuring single-page print-to-fit compliance.",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট শিটের সিঙ্গেল A4 প্রিন্ট লেআউট নিখুঁত করা হয়েছে: সিগনেচারের উপরের মার্জিন, সিগনেচার করার স্পেস হাইট এবং প্রথম ও দ্বিতীয় সারির মাঝের ফাঁকা জায়গা বৃদ্ধি করা হয়েছে, যার ফলে পাতার নিচের ফাঁকা জায়গা সুষমভাবে পূরণ হয়েছে এবং সিঙ্গেল A4 পেজে প্রিন্টও নিখুঁত বজায় রয়েছে।"
  },
  {
    "id": "517",
    "date": "2026-09-28T15:42",
    "type": "UI Layout Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Separated 'Earning Sectors' and 'Deduction Sectors' into independent bordered boxes with a clean margin gap, resolving the cramped layout where the Total Earning summary was directly attached to the Deduction Sectors header.",
    "descriptionBn": "'Payment Info' এর ভেতরে 'Earning Sectors' এবং 'Deduction Sectors'-কে দুটি পৃথক বর্ডার্ড বক্সে ভাগ করে মাঝে মার্জিন গ্যাপ দেওয়া হয়েছে, ফলে Total Earning এবং Deduction Sectors একে অপরের সাথে লেগে না থেকে পরিষ্কারভাবে আলাদা প্রদর্শিত হচ্ছে।"
  },
  {
    "id": "516",
    "date": "2026-09-28T15:40",
    "type": "UI Layout Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Re-architected Final Settlement Sheet header: removed company address, aligned 'FINAL SETTLEMENT SHEET' title to the exact center between the logo and portrait, and resized the employee photo frame (66px × 82px) for a balanced professional appearance.",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট শিটের হেডার সেকশন থেকে কোম্পানির ঠিকানা সম্পূর্ণ বাদ দেওয়া হয়েছে, 'FINAL SETTLEMENT SHEET' টাইটেলটি লোগো ও ছবির মাঝখানে সেন্টার অ্যালাইন করা হয়েছে এবং এমপ্লয়ির ছবির ফ্রেমের সাইজ প্রয়োজন অনুযায়ী কিছুটা বড় (66px × 82px) করে ভারসাম্যপূর্ণ করা হয়েছে।"
  },
  {
    "id": "515",
    "date": "2026-09-28T15:39",
    "type": "UI Consistency",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Updated section heading colors for 'Earn Leave Details', 'Service Benefit Details', and 'Compensation Details' to match 'Payment Info' theme green (#4caf50), ensuring uniform visual branding across all settlement breakdown quadrants.",
    "descriptionBn": "'Earn Leave Details', 'Service Benefit Details' এবং 'Compensation Details' সেকশন হেডারগুলোর কালার 'Payment Info' এর মতো একই ব্র্যান্ড থিম গ্রিন (#4caf50) কালারে পরিবর্তন করা হয়েছে।"
  },
  {
    "id": "514",
    "date": "2026-09-28T15:37",
    "type": "UI Layout Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Reformatted Final Settlement Sheet header: removed duplicate 'Pakiza Software Limited' text header, placed the official logo directly on top followed vertically by the company address and 'FINAL SETTLEMENT SHEET' title, and reduced employee portrait photo frame dimensions for a cleaner compact layout.",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট শিটের হেডার সেকশন রিফরম্যাট করা হয়েছে: অতিরিক্ত 'Pakiza Software Limited' টেক্সট সরিয়ে শুধুমাত্র লোগো রাখা হয়েছে এবং লোগোর ঠিক নিচে ক্রমান্বয়ে ঠিকানা ও 'FINAL SETTLEMENT SHEET' শিরোনাম সাজানো হয়েছে। পাশাপাশি এমপ্লয়ির ছবির সাইজ আরও ছোট ও পরিপাটি করা হয়েছে।"
  },
  {
    "id": "513",
    "date": "2026-09-28T15:36",
    "type": "UI / Print Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Enhanced the Grand Total section in Final Settlement Sheet into a full-width colored banner containing Bangladeshi Taka In Words on the left and Grand Total amount on the right. Increased vertical spacing and height for management signature rows to provide proper clearance while maintaining single A4 page print-to-fit layout.",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট শিটে গ্র্যান্ড টোটাল সেকশনটিকে পুরো উইডথ জুড়ে একক কালারের ব্যানারে রূপান্তর করা হয়েছে, যার বাম পাশে টাকায় কথায় (In Words) এবং ডান পাশে গ্র্যান্ড টোটাল অ্যামাউন্ট প্রদর্শিত হচ্ছে। এছাড়া ম্যানেজমেন্ট সিগনেচার সেকশনের উপর-নিচ মার্জিন ও হাইট বাড়িয়ে পর্যাপ্ত ফাঁকা জায়গা (proper gap) নিশ্চিত করা হয়েছে যাতে সিঙ্গেল A4 পেজে প্রিন্টও নিখুঁত থাকে।"
  },
  {
    "id": "512",
    "date": "2026-09-28T15:32",
    "type": "UI Enhancement",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Integrated official Pakiza client logo (client_logo.png) into the Final Settlement Sheet header for both the detailed settlement view (/final-settlement) and settlement report printable statement modal (/final-settlement-report).",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট শিটের হেডার সেকশনে অফিসিয়াল পাকিজা ক্লায়েন্ট লোগো (client_logo.png) যুক্ত করা হয়েছে, যা ডিটেইল সেটেলমেন্ট ভিউ (/final-settlement) এবং সেটেলমেন্ট রিপোর্ট স্টেটমেন্ট প্রিভিউ মোডাল (/final-settlement-report) উভয় স্থানে প্রদর্শিত হবে।"
  },
  {
    "id": "511b",
    "date": "2026-09-28T15:35",
    "type": "Bug Fix / Routing",
    "module": "Conference Room Booking List",
    "link": "/conference-room-booking-list",
    "descriptionEn": "Fixed TanStack Router Route export in conference-room-booking-list.tsx enabling the route to compile and render properly at http://localhost:3000/conference-room-booking-list.",
    "descriptionBn": "conference-room-booking-list.tsx ফাইলে TanStack রুট এক্সপোর্ট পুনঃসংযোজন করে রাউটিং ফিক্স করা হয়েছে, যার ফলে http://localhost:3000/conference-room-booking-list পেজটি যথাযথভাবে লোড হচ্ছে।"
  },
  {
    "id": "511",
    "date": "2026-09-28T15:28",
    "type": "UI / Print Optimization",
    "module": "Payroll - Final Settlement Sheet",
    "link": "/final-settlement",
    "descriptionEn": "Updated Final Settlement Sheet (/final-settlement): added formal management signature blocks (Prepared By, Checked By HR, Head of HR, Checked By Accounts, Recipients Signature, Checked By Audit, Authorized By), populated realistic demo compensation data with remarks, separated Net Payable into a standalone right-aligned Grand Total box matching company layout, reduced vertical spacing, and optimized print styles to perfectly fit a single A4 page as-is.",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট শিটে (/final-settlement) অফিসিয়াল ফরম্যাট অনুযায়ী ৭টি সিগনেচার ব্লক যুক্ত করা হয়েছে (প্রিপেয়ার্ড বাই, চেকড বাই এইচআর, হেড অব এইচআর, চেকড বাই অ্যাকাউন্টস, রিসিভেন্টস সিগনেচার, চেকড বাই অডিট ও অথরাইজড বাই)। কম্পেনসেশন ডিটেইলসে রিমার্কস সহ ডেমো ডাটা যুক্ত করা হয়েছে, পেমেন্ট ইনফো থেকে নেট পেয়াবল আলাদা করে ডানে গ্র্যান্ড টোটাল হিসেবে অ্যালাইন করা হয়েছে, সেকশনগুলোর গ্যাপ কমিয়ে কম্প্যাক্ট করা হয়েছে এবং সিঙ্গেল A4 পেজে ফিট হওয়ার মতো প্রিন্ট অপটিমাইজেশন নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "510",
    "date": "2026-09-28T13:05",
    "type": "New Feature / History Tracking",
    "module": "Central Approvals - Conference Room Modal",
    "link": "/all-approvals",
    "descriptionEn": "Implemented Requisition Schedule & Room Reallocation History tracking for Conference Room Booking approvals. When an approver changes the meeting room, booking date, start time, or end time and approves the requisition, a schedule history card is recorded and rendered in both approval and view modals comparing original requested schedule with approved schedule.",
    "descriptionBn": "কনফারেন্স রুম বুকিং অ্যাপপ্রুভালে শিডিউল ও রুম পুনর্নির্ধারণের ইতিহাস ট্র্যাকিং ফিচার যুক্ত করা হয়েছে। অ্যাপপ্রুভার যদি মিটিং রুম, তারিখ, স্টার্ট বা এন্ড টাইম পরিবর্তন করে অ্যাপপ্রুভ করেন, তবে অনুমোদিত রিকুইজিশন ভিউ করার সময় অরিজিনাল রিকুয়েস্ট করা শিডিউল ও পরিবর্তিত অ্যাপপ্রুভড শিডিউলের তুলনামূলক হিস্ট্রি কার্ড প্রদর্শিত হবে।"
  },
  {
    "id": "509",
    "date": "2026-09-28T12:12",
    "type": "UI Clean Up",
    "module": "Central Approvals - Conference Room Modal",
    "link": "/all-approvals",
    "descriptionEn": "Cleaned up Conference Room Approval Modal layout: removed gradient background fill, removed section title header, and removed outer stroke border from schedule modification fields.",
    "descriptionBn": "কনফারেন্স রুম অ্যাপপ্রুভাল মোডালের শিডিউল সেকশন ক্লিন আপ করা হয়েছে: ব্যাকগ্রাউন্ডের গ্রাডিয়েন্ট কালার, হেডার টাইটেল টেক্সট এবং বাইরের স্ট্রোক বর্ডার সরিয়ে ফেলা হয়েছে।"
  },
  {
    "id": "508",
    "date": "2026-09-28T11:58",
    "type": "UI / UX Refactoring",
    "module": "Central Approvals - Conference Room Modal",
    "link": "/all-approvals",
    "descriptionEn": "Refactored ConferenceRoomApprovalModal: merged Approver schedule override controls & booking details into a single section named 'Booking Purpose & Details', stacked comment history and decision action panel vertically, and added a sticky bottom Approve/Reject action footer bar matching SimApprovalViewModal.",
    "descriptionBn": "ConferenceRoomApprovalModal রিফ্যাক্টর করা হয়েছে: অ্যাপপ্রুভার শিডিউল কন্ট্রোলস ও বুকিং ডিটেইলস এক করে 'Booking Purpose & Details' নামক সিঙ্গেল সেকশনে রূপান্তর করা হয়েছে, কমেন্ট হিস্ট্রি ও ডিসিশন প্যানেল উপর-নিচে স্ট্যাক করা হয়েছে এবং সিম অ্যাপপ্রুভাল মোডালের মতো নিচে স্টিকি অ্যাপপ্রুভ/রিজেক্ট বাটন বার সংযোজন করা হয়েছে।"
  },
  {
    "id": "507",
    "date": "2026-09-28T11:48",
    "type": "New Feature / Approvals",
    "module": "Central Approvals - Conference Room",
    "link": "/all-approvals",
    "descriptionEn": "Added Conference Room Booking Requisition approval module to Central Approvals (/all-approvals). Integrated ConferenceRoomApprovalModal allowing facility approvers to inspect booking details and modify the Meeting Room, Booking Date, Start Time, and End Time prior to approval/rejection.",
    "descriptionBn": "সেন্ট্রাল অ্যাপপ্রুভালস পেজে (/all-approvals) কনফারেন্স রুম বুকিং রিকুইজিশন অ্যাপপ্রুভাল মডিউল যুক্ত করা হয়েছে। এতে নতুন ConferenceRoomApprovalModal সংযোজন করা হয়েছে, যার মাধ্যমে ফেসিলিটি অ্যাপপ্রুভার বুকিংয়ের বিস্তারিত দেখার পাশাপাশি মিটিং রুম, তারিখ, স্টার্ট টাইম ও এন্ড টাইম পরিবর্তন করে অ্যাপপ্রুভ বা রিজেক্ট করতে পারবেন।"
  },
  {
    "id": "506",
    "date": "2026-09-28T11:37",
    "type": "UI / UX Update",
    "module": "Conference Room Booking List",
    "link": "/conference-room-booking-list",
    "descriptionEn": "Updated Conference Room Booking Requisition view modal: removed Room Amenities & Technical Configuration section and removed Status column from Responsible Persons & Delegates List table.",
    "descriptionBn": "কনফারেন্স রুম বুকিং রিকুইজিশন ভিউ মোডাল আপডেট করা হয়েছে: রুম অ্যামেনিটিজ অ্যান্ড টেকনিক্যাল কনফিগারেশন সেকশনটি সরিয়ে ফেলা হয়েছে এবং রেসপন্সিবল পার্সনস টেবিল থেকে স্ট্যাটাস কলামটি বাদ দেওয়া হয়েছে।"
  },
  {
    "id": "505",
    "date": "2026-09-28T11:20",
    "type": "UI / Modal Redesign",
    "module": "Conference Room Booking List",
    "link": "/conference-room-booking-list",
    "descriptionEn": "Redesigned Conference Room View Booking Modal to match standard ERP Requisition View Modal layout featuring header icon badge with booking ID & status pill, Requester & Booking Overview card with employee avatar & metadata grid, Responsible Persons & Delegates sub-table with status badges, Room Technical Amenities & Setup chips, Approval Workflow & Signatures cards, Comments History timeline, and Print Slip & Close action buttons.",
    "descriptionBn": "কনফারেন্স রুম বুকিং লিস্ট পেজের (/conference-room-booking-list) ভিউ বুকিং মোডালটি স্ট্যান্ডার্ড ERP রিকুইজিশন ভিউ মোডালের স্টাইলে পুনর্নির্মাণ করা হয়েছে। এতে বুকিং আইডি ও স্ট্যাটাস পিল সহ হেডার আইকন ব্যাজ, এমপ্লয়ি অ্যাভাটার ও মেটাডাটা গ্রিড সহ রিকুয়েস্টার ও বুকিং ওভারভিউ কার্ড, রেসপন্সিবল পার্সনস সাব-টেবিল, টেকনিক্যাল সুযোগ-সুবিধা কনফিগারেশন চিপস, অ্যাপপ্রুভাল ওয়ার্কফ্লো কার্ডস এবং প্রিন্ট স্লিপ ও ক্লোজ বাটন সংযুক্ত করা হয়েছে।"
  },
  {
    "id": "504",
    "date": "2026-09-27T10:18",
    "type": "UI / PDF Standard Layout Update",
    "module": "HR Reports - All PDF & Print Views",
    "link": "/hr-reports",
    "descriptionEn": "Standardized official PDF print preview formatting across all 10 HR report pages (Continuous Absent, Daily Attendance, Monthly Attendance, Overtime Summary, Absenteeism Summary, SIM Requisition, New Joining Info, Leave Summary, Leave Details, Employee Count) featuring official Pakiza Knit Composite Ltd company logo, centered header, underlined report title, date range, and crisp border table grid layout matching reference screenshot.",
    "descriptionBn": "সকল ১০টি এইচআর রিপোর্ট পেজের প্রিন্ট/পিডিএফ ভিউ আনুষ্ঠানিকভাবে আপডেট করা হয়েছে। এতে অফিসিয়াল পাকীজা নিট কম্পোজিট লিমিটেড লোগো, সেন্টার্ড হেডার টাইটেল, ডেট রেঞ্জ এবং ক্লিয়ার গ্রিড বর্ডার টেবিল লেআউট যুক্ত করা হয়েছে।"
  },
  {
    "id": "503",
    "date": "2026-09-26T17:08",
    "type": "New Feature / HR Report",
    "module": "HR Reports - Continuous Absent Report",
    "link": "/hr-report-continuous-absent",
    "descriptionEn": "Created Continuous Absent Report page with From Date, Company, Area, Type, Department, Job Title, Unit, Line, Min Days, and Employee ID filters, 15-column continuous absent log table with soft red row highlights, KPI metric cards, Excel export, and PDF print features.",
    "descriptionBn": "এইচআর রিপোর্টস মডিউলে Continuous Absent Report পেজ তৈরি করা হয়েছে, যাতে তারিখ, কোম্পানি, টাইপ, ডিপার্টমেন্ট, ডিজাইনেশন ফিল্টার, সফট রেড হাইলাইট সহ ১৫ কলামের টেবিল, কেপিআই মেট্রিক কার্ডস, এক্সেল এক্সপোর্ট ও প্রিন্ট পিডিএফ সংযুক্ত।"
  },
  {
    "id": "502",
    "date": "2026-09-26T17:02",
    "type": "New Feature / HR Report",
    "module": "HR Reports - SIM Requisition Report",
    "link": "/hr-report-sim-requisition",
    "descriptionEn": "Created SIM Requisition Report page with Department dropdown filter, 13-column requisition table with light-pink header styling, status badges (Issue Status, Req Status, Request For), KPI metric cards, Excel export, and PDF print features.",
    "descriptionBn": "এইচআর রিপোর্টস মডিউলে SIM Requisition Report পেজ তৈরি করা হয়েছে, যাতে ডিপার্টমেন্ট ফিল্টার, হালকা পিংক হেডার সহ ১৩ কলামের রিকুইজিশন টেবিল, স্ট্যাটাস ব্যাজ, কেপিআই মেট্রিক কার্ডস, এক্সেল এক্সপোর্ট ও প্রিন্ট পিডিএফ সংযুক্ত।"
  },
  {
    "id": "501",
    "date": "2026-09-26T16:58",
    "type": "New Feature / HR Report",
    "module": "HR Reports - Absenteeism Summary Report",
    "link": "/hr-report-absenteeism-summary",
    "descriptionEn": "Created Absenteeism Summary Report page with Employee ID, System/Office radio, Year, Start/End Month, Status, Employee Type, Section, Designation, Unit, and Line filters, 12-column log table with light-blue header styling, Excel export, and PDF print features.",
    "descriptionBn": "এইচআর রিপোর্টস মডিউলে Absenteeism Summary Report পেজ তৈরি করা হয়েছে, যাতে এমপ্লয়ি আইডি ফিল্টার, বছর, মাস রেঞ্জ, সেকশন ও ডেজিগনেশন ফিল্টার, হালকা নীল হেডার সহ ১২ কলামের লগ টেবিল, এক্সেল এক্সপোর্ট ও প্রিন্ট ভিউ সংযুক্ত।"
  },
  {
    "id": "500",
    "date": "2026-09-26T16:38",
    "type": "Bug Fix / Navigation",
    "module": "Sidebar Navigation - HR Reports",
    "link": "/hr-reports",
    "descriptionEn": "Fixed left sidebar navigation links for Monthly Attendance Report (/hr-report-monthly-attendance) and Overtime Summary (/hr-report-overtime-summary) so clicking them navigates directly to the report pages.",
    "descriptionBn": "লেফট সাইডবার নেভিগেশনে Monthly Attendance Report এবং Overtime Summary এর লিংক আপডেট করে পেজগুলোতে সরাসরি নেভিগেশন ঠিক করা হয়েছে।"
  },
  {
    "id": "499",
    "date": "2026-09-26T16:34",
    "type": "New Feature / HR Report",
    "module": "HR Reports - Overtime Summary",
    "link": "/hr-report-overtime-summary",
    "descriptionEn": "Created Overtime Summary & Costing Report page with Start/End date, Section filters, 15-column costing log table (Manpower, OT Hour, OT Amount, Tiffin, Night Bill, Total Expenses, Production & Net CM Income), metric KPI cards, Excel export, and PDF print options.",
    "descriptionBn": "এইচআর রিপোর্টস মডিউলে Overtime Summary Costing পেজ তৈরি করা হয়েছে, যাতে তারিখ ফিল্টার, সেকশন ড্রপডাউন, ১৫ কলামের কস্টিং টেবিল, টোটাল রো সামারি, এক্সেল এক্সপোর্ট ও প্রিন্ট পিডিএফ অপশন সংযুক্ত।"
  },
  {
    "id": "498",
    "date": "2026-09-26T16:31",
    "type": "New Feature / HR Report",
    "module": "HR Reports - Monthly Attendance Report",
    "link": "/hr-report-monthly-attendance",
    "descriptionEn": "Created Monthly Attendance Details Report page with Month/Year, Employee Type, Department, Unit, Search filters, 3 view modes (Monthly Summary, Day-by-Day 1-30 Grid Matrix, Department Breakdown), metric KPI widgets, Excel export, and PDF print features.",
    "descriptionBn": "এইচআর রিপোর্টস মডিউলে Monthly Attendance Details Report পেজ তৈরি করা হয়েছে, যাতে মাস/বছর ফিল্টার, ৩টি ভিউ মোড (Monthly Summary, Day-by-Day Grid Matrix, Department Breakdown), মেট্রিক কার্ডস, এক্সেল এক্সপোর্ট ও প্রিন্ট ভিউ সংযুক্ত।"
  },
  {
    "id": "497",
    "date": "2026-09-26T16:26",
    "type": "UI / Design Enhancement",
    "module": "HR Reports - Daily Attendance Report",
    "link": "/hr-report-daily-attendance",
    "descriptionEn": "Styled absent employee records with soft red background tint, red text, and solid red status badges in Daily Attendance Report.",
    "descriptionBn": "ডেইলি এটেন্ডেন্স রিপোর্টে অনুপস্থিত (Absent) কর্মচারীদের রেকর্ড সম্পূর্ণ লাল রঙ (হালকা লাল ব্যাকগ্রাউন্ড ও লাল টেক্সট) দিয়ে হাইলাইট করা হয়েছে।"
  },
  {
    "id": "496",
    "date": "2026-09-26T16:24",
    "type": "New Feature / HR Report",
    "module": "HR Reports - Daily Attendance Report",
    "link": "/hr-report-daily-attendance",
    "descriptionEn": "Created Daily Attendance Report page with Employee Type, Department, Section, Unit, Line, Status, Date, and Option radio filters, 19-column attendance log table, Excel export, print view, and custom PDF export buttons.",
    "descriptionBn": "এইচআর রিপোর্টস মডিউলে Daily Attendance Report পেজ তৈরি করা হয়েছে, যাতে অপশন রেডিও ফিল্টার (Regular, Lunch, OT), ১৯ কলামের টেবিল এবং কাস্টম পিডিএফ ও এক্সেল এক্সপোর্ট সংযুক্ত।"
  },
  {
    "id": "495",
    "date": "2026-09-26T16:22",
    "type": "New Feature / HR Report",
    "module": "HR Reports - Leave Report",
    "link": "/hr-report-leave-details",
    "descriptionEn": "Created Leave Report page with Date From/To, Type, Department, Section, Unit, Line, Designation, and Report Type filters, detailed 13-column leave log table, Excel export, and print view.",
    "descriptionBn": "এইচআর রিপোর্টস মডিউলে Leave Report পেজ তৈরি করা হয়েছে, যাতে তারিখ ফিল্টার, ডিপার্টমেন্ট, সেকশন, ডেজিগনেশন সহ ১০টি ফিল্টারিং অপশন, ১৩ কলামের লিভ লগ টেবিল, এক্সেল এক্সপোর্ট ও প্রিন্ট সুবিধা সংযুক্ত।"
  },
  {
    "id": "494",
    "date": "2026-09-26T16:20",
    "type": "New Feature / HR Report",
    "module": "HR Reports - Employee Count",
    "link": "/hr-report-employee-count",
    "descriptionEn": "Created Employee Count report page with Organization, Region, Employee Type, Section, Designation, Gender, Grade, Component, Unit, Line, and Status filters, Excel export, print view, and total headcount summary.",
    "descriptionBn": "এইচআর রিপোর্টস মডিউলে Employee Count রিপোর্ট পেজ তৈরি করা হয়েছে, যাতে অর্গানাইজেশন, রিজিয়ন, সেকশন, গ্রেড, ইউনিট সহ ১১টি ফিল্টার, হেডকাউন্ট সামারি ও এক্সেল এক্সপোর্ট সংযুক্ত।"
  },
  {
    "id": "493",
    "date": "2026-09-26T16:19",
    "type": "UI Standardization & Consistency",
    "module": "HR Reports - Leave Summary",
    "link": "/hr-report-leave-summary",
    "descriptionEn": "Standardized Leave Summary report layout to match exact visual hierarchy, card wrappers, and button designs of the New Joining Info report page.",
    "descriptionBn": "New Joining Info রিপোর্ট পেজের লেআউটের সাথে ১০০% হুবহু মিলিয়ে Leave Summary রিপোর্ট পেজের ডিজাইন স্ট্যান্ডার্ডাইজড করা হয়েছে।"
  },
  {
    "id": "492",
    "date": "2026-09-26T16:17",
    "type": "New Feature / HR Report",
    "module": "HR Reports - Leave Summary",
    "link": "/hr-report-leave-summary",
    "descriptionEn": "Created Leave Summary report page with Year, Employee Type, Section, Unit, Line, and Option filters (Details, Gender Wise CL/SL, Gender Wise Zero Leave), Excel export, and print view.",
    "descriptionBn": "এইচআর রিপোর্টস মডিউলে Leave Summary পেজ তৈরি করা হয়েছে, যাতে বছর, সেকশন, ইউনিট, অপশন ড্রপডাউন (Details, Gender Wise CL/SL, Gender Wise NO Leave), এক্সেল এক্সপোর্ট ও প্রিন্ট ভিউ সংযুক্ত।"
  },
  {
    "id": "491",
    "date": "2026-09-26T16:12",
    "type": "Bug Fix / Navigation",
    "module": "Sidebar & HR Reports",
    "link": "/hr-report-new-joining-info",
    "descriptionEn": "Fixed sidebar navigation link for New Joining Info under HR Reports menu so clicking it correctly opens the New Joining Info report page.",
    "descriptionBn": "সাইডবারের 'HR Reports -> New Joining Info' লিংকের ডায়রেকশন ঠিক করা হয়েছে যাতে ক্লিকেই রিপোর্ট পেজটি ওপেন হয়।"
  },
  {
    "id": "490",
    "date": "2026-09-26T16:10",
    "type": "New Feature / HR Report",
    "module": "HR Reports - New Joining Info",
    "link": "/hr-report-new-joining-info",
    "descriptionEn": "Created the HR Report page for New Joining Info featuring comprehensive multi-criteria filters, instant search, Excel export, print view, and interactive 33-column tabular display.",
    "descriptionBn": "এইচআর রিপোর্টস মডিউলে New Joining Info পেজটি নতুন করে যুক্ত করা হয়েছে, যাতে ১৮টি ফিল্টারিং ফিল্ড, ৩০+ কলামের টেবিল, এক্সেল এক্সপোর্ট ও প্রিন্ট/পিডিএফ ভিউ সুবিধা রয়েছে।"
  },
  {
    "id": "489",
    "date": "2026-09-26T14:47",
    "type": "UI Optimization & De-duplication",
    "module": "My Profile",
    "link": "/my-profile",
    "descriptionEn": "Removed duplicate header badge elements (EMP ID, Salary, Manager, Bangla Name) to ensure each piece of information is displayed uniquely without repetition.",
    "descriptionBn": "মাই প্রোফাইল হেডার থেকে পুনরাবৃত্ত তথ্যসমূহ (EMP ID, বেতন, ম্যানেজার ইত্যাদি) সরিয়ে পেজটিকে আরও পরিষ্কার ও ইউনিক করা হয়েছে।"
  },
  {
    "id": "488",
    "date": "2026-09-26T14:42",
    "type": "UI Layout & Overlap Fix",
    "module": "My Profile",
    "link": "/my-profile",
    "descriptionEn": "Fixed text positioning and banner overlap issue in My Profile hero section, perfectly aligning employee name, badges, and card grid heights.",
    "descriptionBn": "মাই প্রোফাইল হেডার ব্যানারে টেক্সট ওভারল্যাপ সমস্যা সমাধান করা হয়েছে এবং প্রোফাইল নেম, ব্যাজ ও কার্ড লেআউট পারফেক্ট করা হয়েছে।"
  },
  {
    "id": "487",
    "date": "2026-09-26T14:40",
    "type": "UI Simplification & Redesign",
    "module": "My Profile",
    "link": "/my-profile",
    "descriptionEn": "Redesigned and simplified My Profile page to focus exclusively on essential employee details including personal info, corporate details, salary, parental info, addresses, and emergency contacts.",
    "descriptionBn": "মাই প্রোফাইল পেজটি সম্পূর্ণ রিডিজাইন করে সহজ ও সুবিন্যস্ত করা হয়েছে এবং ১৭টি প্রয়োজনীয় মূল তথ্যে সাজানো হয়েছে।"
  },
  {
    "id": "486",
    "date": "2026-09-24T20:01",
    "type": "UI Layout & Sticky Action Footer",
    "module": "All Approvals - SIM Requisition",
    "link": "/all-approvals",
    "descriptionEn": "Moved Multi-Stage Approval Hierarchy & Signatures section under Comments & Approver Controls, and converted Approve/Reject buttons into a sticky modal footer.",
    "descriptionBn": "সিম অ্যাপ্রুভাল মডালে মাল্টি-স্টেজ সিগনেচার সেকশনটি কমেন্টস ও অ্যাকশন প্যানেলের নিচে চালনা করা হয়েছে এবং Approve ও Reject বাটন দুটিকে স্টিকি ফুটার করা হয়েছে।"
  },
  {
    "id": "485",
    "date": "2026-09-24T19:52",
    "type": "Interactive Workflow / Approver Inputs",
    "module": "All Approvals - SIM Requisition",
    "link": "/all-approvals",
    "descriptionEn": "Added dynamic approver input controls to SIM Approval Modal: Assigned SIM & Balance for New SIM, Approved Limit for SIM Balance Limit, and New Issued SIM Number for SIM Replacement.",
    "descriptionBn": "সিম অ্যাপ্রুভাল মডালে ডায়নামিক অ্যাপ্রুভার ইনপুট ফিল্ড যুক্ত করা হয়েছে: New SIM-এর জন্য SIM Number ও Balance, Balance Limit-এর জন্য Approved Limit এবং Replacement-এর জন্য New SIM Number।"
  },
  {
    "id": "484",
    "date": "2026-09-24T19:35",
    "type": "New Feature / UI",
    "module": "All Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Added 3 separate SIM requisition approval entries for New SIM, SIM Balance Limit, and SIM Replacement in Central Approvals with dedicated detailed approval modal.",
    "descriptionBn": "সেন্ট্রাল অল অ্যাপ্রুভালস পেজে New SIM, SIM Balance Limit এবং SIM Replacement-এর জন্য ৩টি আলাদা অ্যাপ্রুভাল এন্ট্রি ও বিষদ অ্যাপ্রুভাল মডাল যুক্ত করা হয়েছে।"
  },
  {
    "id": "483",
    "date": "2026-09-19T16:33",
    "type": "UI / Design Update",
    "module": "Separation & All Approvals",
    "link": "/ssp-approval",
    "descriptionEn": "Redesigned Resignation Approval Modal to match exact official letter layout with editable Intended Last Working Day, live body updates, and integrated a new entry in All Approvals Queue.",
    "descriptionBn": "অফিশিয়াল রিজাইন লেটার ডিজাইনের সাথে হুবহু মিলিয়ে মডাল রিডিজাইন করা হয়েছে, সংশোধনযোগ্য Intended Last Working Day অপশন এবং অল অ্যাপ্রুভালস পেজে নতুন এন্ট্রি যুক্ত করা হয়েছে।"
  },
  {
    "id": "482",
    "date": "2026-09-19T16:07",
    "type": "New Feature / Workflow",
    "module": "Separation",
    "link": "/separation-resignation-request",
    "descriptionEn": "Added interactive Approval and Rejection actions to the Resignation Approval Modal with real-time signature clearance updates, remarks, and status tracking.",
    "descriptionBn": "রিজাইন অপশন মডালে নতুন ইন্টারঅ্যাক্টিভ Approve ও Reject বাটন, সিগনেচার স্ট্যাটাস আপডেট এবং মন্তব্য যোগের ব্যবস্থা করা হয়েছে।"
  },
  {
    "id": "481",
    "date": "2026-09-19T15:53",
    "type": "UI / Workflow Update",
    "module": "SSP Requisition",
    "link": "/ssp-sim-requisition",
    "descriptionEn": "Refactored SIM Requisition dropdown to 3 options (New SIM, SIM Balance Limit, SIM Replacement) with dynamic conditional fields (SIM Number, Existing/Expected Limit).",
    "descriptionBn": "সিম রিকুইজিশন ড্রপডাউন পরিবর্তন করে ৩টি অপশন (New SIM, SIM Balance Limit, SIM Replacement) এবং প্রতিটি অপশনের জন্য ডায়নামিক ফিল্ড যুক্ত করা হয়েছে।"
  },
  {
    "id": "480",
    "date": "2026-09-19T15:09",
    "type": "New Feature / UI",
    "module": "Separation",
    "link": "/separation-resignation-request",
    "descriptionEn": "Designed and integrated a unified Resignation Approval View Modal for better readability of resignation details, clearance statuses, and signatures.",
    "descriptionBn": "রিজাইন ডিটেইলস, ক্লিয়ারেন্স স্ট্যাটাস এবং সিগনেচার সহজে পড়ার জন্য একটি নতুন Resignation Approval View Modal ডিজাইন ও যুক্ত করা হয়েছে।"
  },
  {
    "id": "479",
    "date": "2026-09-19T14:49",
    "type": "UI Update",
    "module": "SSP Requisition",
    "link": "/ssp-sim-requisition",
    "descriptionEn": "Removed the Corporate SIM Policy Notice section from the SIM Requisition application form for a cleaner user interface.",
    "descriptionBn": "সিম রিকুইজিশন অ্যাপ্লিকেশন ফর্ম থেকে 'Corporate SIM Policy Notice' সেকশনটি সরিয়ে ফেলা হয়েছে যাতে ইন্টারফেসটি আরও পরিষ্কার ও সহজবোধ্য হয়।"
  },
  {
    "id": "478",
    "date": "2026-09-19T14:15",
    "type": "UI / UX Update",
    "module": "SSP Requisition",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Converted the SIM Requisition view into an interactive modal dialog matching the exact layout and design standards of the Leave Application view modal. Features structured employee details, full requisition particulars table, 3-tier approval signatures workflow, and comments history.",
    "descriptionBn": "সিম রিকুইজিশন ভিউটিকে পৃথক পেজের পরিবর্তে লিভ অ্যাপ্লিকেশন ভিউ মোডালের মতো একটি ইন্টারেক্টিভ মোডালে রূপান্তর করা হয়েছে। এতে রয়েছে সুন্দর এমপ্লয়ী ডিটেইলস, রিকুইজিশন টেবিল, ৩-স্তরের অনুমোদন সিগনেচার ফ্লো এবং কমেন্টস হিস্ট্রি।"
  },
  {
    "id": "477",
    "date": "2026-09-19T14:06",
    "type": "UI Update",
    "module": "SSP Requisition",
    "link": "/ssp-sim-requisition-view",
    "descriptionEn": "Redesigned the SIM Requisition Slip view to exactly match the standard official requisition table layout with a header, request details block, 8-row data table, 3 approval signature blocks, and comments history.",
    "descriptionBn": "অফিসিয়াল রিকুইজিশন টেবিল লেআউটের সাথে মিল রেখে সিম রিকুইজিশন স্লিপ ভিউটি নতুন করে ডিজাইন করা হয়েছে। এতে রয়েছে হেডার, বিস্তারিত রিকুয়েস্ট ব্লক, ৮-সারি বিশিষ্ট ডাটা টেবিল, ৩টি অ্যাপ্রুভাল সিগনেচার ব্লক এবং কমেন্টস হিস্ট্রি।"
  },
  {
    "id": "476",
    "date": "2026-09-19T14:15",
    "type": "UI Update",
    "module": "SSP Requisition",
    "link": "/ssp-sim-requisition",
    "descriptionEn": "Simplified the SIM Requisition form by removing the Preferred Operator field, Quick Justification Templates, and the suggestions list from the Requisition For field.",
    "descriptionBn": "সিম রিকুইজিশন ফর্মটি আরও সহজ করার জন্য Preferred Operator ফিল্ড, Quick Justification Templates এবং Requisition For ফিল্ডের সাজেশন লিস্ট রিমুভ করা হয়েছে।"
  },
  {
    "id": "475",
    "date": "2026-09-19T14:10",
    "type": "New Feature",
    "module": "SSP Requisition",
    "link": "/ssp-sim-requisition",
    "descriptionEn": "Designed and deployed the SIM Requisition system (/ssp-sim-requisition) and official slip view (/ssp-sim-requisition-view). Features Request For dropdown, preferred operator picker, justification input with quick templates, document attachments, and an On Behalf toggle revealing Section and Requisition For fields. Submitting instantly registers the requisition into the My Requisitions table with full slip view access.",
    "descriptionBn": "সিম রিকুইজিশন সিস্টেম (/ssp-sim-requisition) এবং অফিশিয়াল স্লিপ ভিউ (/ssp-sim-requisition-view) ডিজাইন ও চালু করা হয়েছে। এতে রয়েছে Request For ড্রপডাউন, অপারেটর নির্বাচন, কুইক টেমপ্লেটসহ Justification ইনপুট, ফাইল অ্যাটাচমেন্ট এবং On Behalf অপশন যা সচল করলে Section ড্রপডাউন ও Requisition For ইনপুট ফিল্ড দৃশ্যমান হয়। সাবমিট করার সাথে সাথে তা My Requisition টেবিলে যুক্ত হয়ে যায় এবং সম্পূর্ণ স্লিপ ভিউ দেখা যায়।"
  },
  {
    "id": "474",
    "date": "2026-09-15T16:50",
    "type": "Bug Fix / Improvement",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Restored the missing 'Leave Count' column in the Bulk Leave allocation data table (/bulk-leave). The column displays high-density badges for Casual Leave (CL), Sick Leave (SL), and Earned Leave (EL) balances for each employee, complete with sort headers, responsive colSpan handling, and updated CSV export support.",
    "descriptionBn": "Bulk Leave পেজের (/bulk-leave) ডাটা টেবিলে পূর্বে বাদ পড়ে যাওয়া 'Leave Count' কলামটি পুনরায় যুক্ত করা হয়েছে। প্রতিটি কর্মীর জন্য Casual Leave (CL), Sick Leave (SL), এবং Earned Leave (EL) ব্যালেন্স পরিষ্কার ব্যাজের মাধ্যমে প্রদর্শিত হচ্ছে, সাথে সর্ট হেডার এবং CSV এক্সপোর্ট সুবিধার সাথেও সমন্বয় করা হয়েছে।"
  },
  {
    "id": "473",
    "date": "2026-09-15T12:45",
    "type": "UI Update",
    "module": "Counseling",
    "link": "/welfare-verification",
    "descriptionEn": "Redesigned the 'Welfare Verification' page layout to match the premium Show Cause Notices style. Applied consistent dark mode compatibility, card-based filter console, refined iconography, updated the data table aesthetics, and enhanced the 'View Action Details' modal with premium styling.",
    "descriptionBn": "'Welfare Verification' পেজের লেআউটটি প্রিমিয়াম 'Show Cause Notices' স্টাইলের সাথে সামঞ্জস্যপূর্ণ করে রিডিজাইন করা হয়েছে। ডার্ক মোড সাপোর্ট, কার্ড-ভিত্তিক ফিল্টার কনসোল, চমৎকার আইকনোগ্রাফি, নতুন ডাটা টেবিল ডিজাইন এবং 'View Action Details' মোডালটিতে প্রিমিয়াম লুক যুক্ত করা হয়েছে।"
  },
  {
    "id": "472",
    "date": "2026-09-15T12:40",
    "type": "UI Update",
    "module": "Counseling",
    "link": "/welfare-verification",
    "descriptionEn": "Fixed the 'Welfare Verification' data table to correctly map inline editable fields (Absent Reason, Reporting Boss, Hr Remarks, Action Remarks dropdown, Verification Phone No., Welfare Action Status dropdown, Welfare Remarks) according to the reference design. Also updated the 'View Action Details' modal to correctly display the historical counselling data for each employee.",
    "descriptionBn": "রেফারেন্স ডিজাইন অনুযায়ী 'Welfare Verification' ডাটা টেবিলের ইনলাইন এডিটেবল ফিল্ডস (Absent Reason, Reporting Boss, Hr Remarks, Action Remarks dropdown, Verification Phone No., Welfare Action Status dropdown, Welfare Remarks) সঠিকভাবে ম্যাপ করে ফিক্স করা হয়েছে। এছাড়াও প্রতিটি কর্মচারীর ঐতিহাসিক কাউন্সেলিং ডাটা সঠিকভাবে প্রদর্শনের জন্য 'View Action Details' মোডালটি আপডেট করা হয়েছে।"
  },
  {
    "id": "471",
    "date": "2026-09-15T12:38",
    "type": "UI Update",
    "module": "Counseling",
    "link": "/absent-counseling",
    "descriptionEn": "Upgraded the 'Absent Counseling' data table to include detailed absentee metrics (Total Absent, Total Absent Monthly, Total Absent Yearly, Last Present Date) and interactive inline editable fields (Absent Reason, Reporting Boss, Hr Remarks, Action Remarks dropdown, Verification Phone No.). The mock data was also updated with 6 new realistic records to showcase the layout.",
    "descriptionBn": "'Absent Counseling' ডাটা টেবিল আপডেট করে বিস্তারিত অ্যাবসেন্ট মেট্রিক্স (Total Absent, Total Absent Monthly, Total Absent Yearly, Last Present Date) এবং ইন্টারেক্টিভ ইনলাইন এডিটেবল ফিল্ডস (Absent Reason, Reporting Boss, Hr Remarks, Action Remarks dropdown, Verification Phone No.) যুক্ত করা হয়েছে। লেআউট প্রদর্শনের জন্য ৬টি নতুন বাস্তবসম্মত রেকর্ড মক ডাটায় যুক্ত করা হয়েছে।"
  },
  {
    "id": "470",
    "date": "2026-09-15T12:37",
    "type": "New Feature",
    "module": "Counseling",
    "link": "/welfare-verification",
    "descriptionEn": "Created the 'Welfare Verification' page (/welfare-verification). It utilizes the same consistent ERP filter console layout (Date, Employee Type, Department, Section, etc.) and 'Reporting Boss' edit section. The data table has been extended to include new welfare-specific columns (Last Present Date, Absent Reason, HR Remarks, Action Remarks, Verification Phone No, Welfare Action Status, Welfare Remarks, and Status) populated with realistic data.",
    "descriptionBn": "নতুন 'Welfare Verification' পেজ (/welfare-verification) তৈরি করা হয়েছে। এতে একই রকম ইআরপি ফিল্টার কনসোল লেআউট এবং 'Reporting Boss' এডিট সেকশন ব্যবহার করা হয়েছে। ডাটা টেবিলে নতুন ওয়েলফেয়ার সংক্রান্ত কলাম (Last Present Date, Absent Reason, HR Remarks, Action Remarks, Verification Phone No, Welfare Action Status, Welfare Remarks, এবং Status) যুক্ত করা হয়েছে এবং বাস্তবসম্মত ডাটা দ্বারা পূর্ণ করা হয়েছে।"
  },
  {
    "id": "469",
    "date": "2026-09-15T12:35",
    "type": "New Feature",
    "module": "Counseling",
    "link": "/absent-counseling",
    "descriptionEn": "Created the 'Absent Counseling' page (/absent-counseling) matching the reference UI. It features a comprehensive filter console (Date, Employee Type, Department, Section, Designation, Unit, Line, Shift, Current Shift, Job Nature, Employee Id, and System/Office toggle). Included a 'Reporting Boss' inline edit section, Export toolbar (Excel, Print, PDF), and a high-density data table with a 'View Action Details' modal that displays complete counseling history.",
    "descriptionBn": "রেফারেন্স ইউআই অনুযায়ী নতুন 'Absent Counseling' পেজ (/absent-counseling) তৈরি করা হয়েছে। এতে রয়েছে বিস্তারিত ফিল্টার কনসোল (Date, Employee Type, Department, Section, Designation, Unit, Line, Shift, Current Shift, Job Nature, Employee Id, এবং System/Office টগল)। এছাড়াও রয়েছে 'Reporting Boss' ইনলাইন এডিট সেকশন, এক্সপোর্ট টুলবার (Excel, Print, PDF), এবং একটি হাই-ডেনসিটি ডাটা টেবিল যার 'View Action Details' মোডালের মাধ্যমে সম্পূর্ণ কাউন্সেলিং হিস্ট্রি দেখা যায়।"
  },
  {
    "id": "468",
    "date": "2026-09-15T12:30",
    "type": "New Addition",
    "module": "Navigation",
    "descriptionEn": "Added a new 'Counseling' menu to the sidebar navigation with two sub-menus: 'Absent Counseling' and 'Welfare Verification'.",
    "descriptionBn": "সাইডবার নেভিগেশনে নতুন 'Counseling' মেনু যোগ করা হয়েছে এবং এর অধীনে 'Absent Counseling' ও 'Welfare Verification' সাব-মেনু যুক্ত করা হয়েছে।"
  },
  {
    "id": "467",
    "date": "2026-09-15T12:25",
    "type": "UI Update",
    "module": "Budget",
    "link": "/budget-overtime",
    "descriptionEn": "Redesigned the Overtime Budget & OT Limit page (/budget-overtime) to match the standard ERP design layout found in My Requisitions. Added a clean, unified top header, refined the filter console elements (Year, Month, Department) inside a modern card, and implemented the standard high-density soft-accent data table for editing OT hours and amounts.",
    "descriptionBn": "ওভারটাইম বাজেট ও ওটি লিমিট পেজটি (/budget-overtime) রিডিজাইন করে 'My Requisitions' এর স্ট্যান্ডার্ড ইআরপি লেআউটের সাথে সামঞ্জস্যপূর্ণ করা হয়েছে। উপরে একটি ক্লিন ও ইউনিফাইড হেডার যুক্ত করা হয়েছে, ফিল্টার কনসোল (বছর, মাস, ডিপার্টমেন্ট) একটি আধুনিক কার্ডে সাজানো হয়েছে এবং ওটি আওয়ারস ও অ্যামাউন্ট এডিটের জন্য স্ট্যান্ডার্ড হাই-ডেনসিটি ডাটা টেবিল ইমপ্লিমেন্ট করা হয়েছে।"
  },
  {
    "id": "466",
    "date": "2026-09-15T11:55",
    "type": "New Feature / Refactor",
    "module": "SSP Requisition",
    "link": "/ssp-product-budget-request",
    "descriptionEn": "Merged 'General Product Budget Request' and 'ICT Product Budget Request' into a single unified 'Product Budget Request' portal (/ssp-product-budget-request) and card in the Requisition Hub. Added an in-form Product Requisition Type selector toggle (General vs ICT) that dynamically updates categories and product catalog options.",
    "descriptionBn": "আলাদা থাকা 'General Product Budget Request' এবং 'ICT Product Budget Request' পেজ দুটিকে একত্রিত করে একটি একক 'Product Budget Request' পোর্টালে (/ssp-product-budget-request) রূপান্তরিত করা হয়েছে। ফর্মের ভেতরে 'Product Requisition Type' সিলেকশন অপশন (General ও ICT) যুক্ত করা হয়েছে যা সিলেক্ট করার উপর নির্ভর করে ডাইনামিকালি ক্যাটাগরি ও প্রোডাক্ট ক্যাটালগ আপডেট করে।"
  },
  {
    "id": "456",
    "date": "2026-09-14T18:03",
    "type": "UI Update",
    "module": "Attendance",
    "link": "/pending-manual-attendance",
    "descriptionEn": "Redesigned Approve Manual Attendance page (/pending-manual-attendance) matching reference ERP layout: top filter console with Start Date *, End Date *, Employee Type, Sub Department, Job Title, Unit, Line, Employee Id, Status, and SEARCH button; export toolbar with EXCEL, PRINT, and PDF buttons; high-density data table with Action (Pencil), Reason, Emp ID, Name, Department, Designation, Date, In Time, Out Date, Out Time, System Data (formatted multi-line card), and HOD status; and bottom-left APPROVE action button.",
    "descriptionBn": "রেফারেন্স ERP লেআউট অনুযায়ী অ্যাপ্রুভ ম্যানুয়াল অ্যাটেনডেন্স পেজটি (/pending-manual-attendance) পুনর্নির্মাণ করা হয়েছে: টপ ফিল্টার কনসোলে Start Date *, End Date *, Employee Type, Sub Department, Job Title, Unit, Line, Employee Id, Status এবং SEARCH বাটন; টেবিল কার্ডে EXCEL, PRINT, PDF এক্সপোর্ট বাটন; হাই-ডেনসিটি ডাটা টেবিল (Action, Reason, Emp ID, Name, Department, Designation, Date, In Time, Out Date, Out Time, System Data কার্ড, HOD); এবং নিচে বটম-লেফটে APPROVE বাটন।"
  },
  {
    "id": "455",
    "date": "2026-09-14T17:00",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-approval",
    "descriptionEn": "Updated the 'Reschedule & Allocate Alternate Slot' modal on the Conference Room Approval Portal (/conference-room-approval): embedded top 'View Booking' summary card with 4-column detail grid and RESPONSIBLE PERSONS sub-table; added 'Allocate Date *' date picker alongside Allocate Room *, Allocate Start Time *, and Allocate End Time * controls; removed quick suggestion chips.",
    "descriptionBn": "কনফারেন্স রুম অ্যাপ্রুভাল পোর্টালে (/conference-room-approval) 'Reschedule & Allocate Alternate Slot' মোডালটি আপডেট করা হয়েছে: উপরে 'View Booking' সামারি কার্ড ও RESPONSIBLE PERSONS সাব-টেবিল এম্বেড করা হয়েছে; নিচে Allocate Room *, Allocate Start Time *, Allocate End Time * এর সাথে নতুন 'Allocate Date *' ডেট পিকাপ ড্রপডাউন অপশন যুক্ত করা হয়েছে এবং অতিরিক্ত quick suggestion chips সরিয়ে দেওয়া হয়েছে।"
  },
  {
    "id": "465",
    "date": "2026-09-14T16:53",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-booking",
    "descriptionEn": "Cleaned up Conference Room Booking page (/conference-room-booking) UI per user request: removed the top 4 metric stat cards and the target room selector grid, placing the Booking Details form and Booked Slots live table directly below the page header.",
    "descriptionBn": "ইউজার রিকোয়েস্ট অনুযায়ী কনফারেন্স রুম বুকিং পেজের (/conference-room-booking) ওপরের ৪টি মেট্রিক স্ট্যাট কার্ড এবং টার্গেট রুম সিলেক্টর গ্রিড সরিয়ে নেওয়া হয়েছে; বুকিং ডিটেইলস ফর্ম ও বুকড স্লটস টেবিল এখন সরাসরি পেজ হেডারের নিচে দেখতে পাওয়া যাবে।"
  },
  {
    "id": "464",
    "date": "2026-09-14T16:52",
    "type": "Bug Fix",
    "module": "Facility Management",
    "link": "/conference-room-booking",
    "descriptionEn": "Fixed runtime ReferenceError in Conference Room Booking page (/conference-room-booking): resolved undefined 'meetingRoom' variable in room select dropdown by binding directly to activeRoom.name and setSelectedRoomId state handler.",
    "descriptionBn": "কনফারেন্স রুম বুকিং পেজের (/conference-room-booking) মোটাল ও ড্রপডাউন সিলেক্টে থাকা অনাকাঙ্ক্ষিত ReferenceError সমাধান করা হয়েছে: সিলেক্ট ফিল্ডে activeRoom.name ও setSelectedRoomId বাইন্ডিং নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "463",
    "date": "2026-09-14T16:51",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-approval",
    "descriptionEn": "Redesigned Conference Room Approval modals (/conference-room-approval) with ultra-professional executive styling: rounded-3xl dialogs with backdrop blur, icon avatar headers, structured target requisition info card with status badges, icon-prefixed dropdown selects, quick suggestion justification chips, and modern gradient action buttons.",
    "descriptionBn": "কনফারেন্স রুম অ্যাপ্রুভাল পেজের (/conference-room-approval) মোডালগুলো সম্পূর্ণ প্রফেশনাল ও আকর্ষণীয় লেআউটে পুনর্নির্মাণ করা হয়েছে: ব্যাকড্রপ ব্লার সহ rounded-3xl ডায়ালগ, আইকন অ্যাভাটার হেডার, স্ট্যাটাস ব্যাজ সহ স্ট্রাকচার্ড টার্গেট রিকুইজিশন ইনফো কার্ড, আইকন প্রফিক্স সহ ড্রপডাউন সিলেক্ট, কুইক সাাজেশন রিমার্কস চিপস এবং আধুনিক গ্র্যাডিয়েন্ট অ্যাকশন বাটন।"
  },
  {
    "id": "462",
    "date": "2026-09-14T16:50",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-approval",
    "descriptionEn": "Enhanced Conference Room Approval Portal (/conference-room-approval) to allow rescheduling and cancelling of already approved room bookings, added top filter console status control (Pending, Approved, Rescheduled, All), introduced an Approved & Active Bookings table with direct 'Reschedule Slot' and 'Cancel Booking' action modals, and ensured uniform Inter font (font-sans) across all chips, badges, buttons, and high-density tables.",
    "descriptionBn": "কনফারেন্স রুম অ্যাপ্রুভাল পোর্টালে (/conference-room-approval) ইতিমধ্যে অ্যাপ্রুভ হওয়া বুকিংগুলোর জন্য রিশিডিউল ও ক্যানসেল করার সুবিধা যুক্ত করা হয়েছে: টপ ফিল্টার কনসোলে স্ট্যাটাস ফিল্টার যুক্ত করা হয়েছে, অ্যাপ্রুভড ও এক্টিভ বুকিংয়ের জন্য আলাদা ডাটা টেবিল প্রদান করা হয়েছে যেখানে 'Reschedule Slot' ও 'Cancel Booking' বাটনের মাধ্যমে বুকিং সময় পরিবর্তন বা বাতিল করা যাবে, এবং সকল চিপ, ব্যাজ ও টেবিল টেক্সটে ইন্টার ফন্ট (font-sans) নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "461",
    "date": "2026-09-14T16:49",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-approval",
    "descriptionEn": "Refined Conference Room Approval portal (/conference-room-approval): removed extra tab toggle button and conflict warning note banner; added top filter console box with Date Filter, Room Wise Filter, and Time Slot Filter; enforced clean Inter font styling across all elements, badges, tags, and table cells.",
    "descriptionBn": "কনফারেন্স রুম অ্যাপ্রুভাল পোর্টালটি (/conference-room-approval) মার্জিতভাবে আপডেট করা হয়েছে: অতিরিক্ত ট্যাব টগল বাটন ও ওয়ার্নিং নোট ব্যানার রিমুভ করা হয়েছে; টপ ফিল্টার কনসোলে Date Filter, Room Wise Filter ও Time Slot Filter যুক্ত করা হয়েছে; এবং সব ধরণের টেক্সট, টেবিল ও ব্যাজে ইন্টার (Inter) ফন্ট নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "460",
    "date": "2026-09-14T16:48",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-booking",
    "descriptionEn": "Completely revamped Conference Room Booking page (/conference-room-booking) UI: added top executive metric stat cards (Total Rooms, Today's Bookings, Active Target Room, Facility Utilization Rate); interactive Visual Room Selector Cards grid with 1-click room selection; active room specs preview card; high-contrast form inputs with icon prefixes; and live booked slots data table with status badges and pulsing live indicator.",
    "descriptionBn": "কনফারেন্স রুম বুকিং পেজের (/conference-room-booking) ইউআই সম্পূর্ণ নতুন ও আকর্ষণীয় ডিজাইনে উন্নীত করা হয়েছে: ওপরে ৪টি এক্সিকিউটিভ মেট্রিক স্ট্যাট কার্ড; ইন্টারঅ্যাক্টিভ রুমে সিলেক্টর কার্ডস গ্রিড (১-ক্লিক রুম সিলেকশন); অ্যাক্টিভ রুম স্পেক্স প্রিভিউ কার্ড; আইকন প্রফিক্স সহ হাই-কনট্রাস্ট ইনপুট ফিল্ড এবং পালসিং লাইভ ইন্ডিকেটর সহ বুকড স্লটস ডাটা টেবিল।"
  },
  {
    "id": "459",
    "date": "2026-09-14T16:45",
    "type": "New Feature",
    "module": "Facility Management",
    "link": "/conference-room-approval",
    "descriptionEn": "Implemented Smart Overlapping Time Window Grouping Algorithm in Conference Room Approval portal (/conference-room-approval): automatically merges overlapping time requests into a consolidated slot window (e.g., 10:00 AM - 11:00 AM, 10:30 AM - 11:00 AM, and 10:50 AM - 11:30 AM are grouped under Merged Window: 10:00 AM - 11:30 AM); inside the table view, each individual requested time slot is displayed alongside organizer details, allowing approvers to approve 1 request and reschedule/reassign the conflicting slots.",
    "descriptionBn": "কনফারেন্স রুম অ্যাপ্রুভাল পোর্টালে (/conference-room-approval) ওভারল্যাপিং টাইম উইন্ডো গ্রুপিং অ্যালগরিদম যুক্ত করা হয়েছে: উদাহরণস্বরূপ ৩ জন ব্যক্তির আলাদা সময়সূচী (১০:০০ - ১১:০০, ১০:৩০ - ১১:০০ এবং ১০:৫০ - ১১:৩০) পর পর ওভারল্যাপ করলে সিস্টেম স্বয়ংক্রিয়ভাবে মোট টাইম উইন্ডো হিসাব করে (১০:০০ - ১১:৩০) গ্রুপ তৈরি করে; এবং টেবিলের ভেতরে প্রতিটি ব্যক্তির ইন্ডিভিজুয়াল সময়সূচী প্রদর্শন করে যাতে অ্যাপ্রুভার ১টি রিকুইজিশন পছন্দ অনুযায়ী অ্যাপ্রুভ করে বাকিগুলো রি-শিডিউল বা রি-অ্যালোকিউট করতে পারেন।"
  },
  {
    "id": "458",
    "date": "2026-09-14T16:42",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-booking",
    "descriptionEn": "Enhanced UI aesthetics of Conference Room Booking page (/conference-room-booking): added field label icons, live selected room specifications preview banner with seating capacity badge, polished high-contrast form inputs with focus ring highlights, refined action buttons (SUBMIT and RESET), and updated live booked slots table with pulsing status indicator.",
    "descriptionBn": "কনফারেন্স রুম বুকিং পেজের (/conference-room-booking) ইউআই আরও সুন্দর ও এন্টারপ্রাইজ-গ্রেডে উন্নীত করা হয়েছে: ইনপুট ফিল্ডে আইকনসমূহ যুক্ত করা হয়েছে, লাইভ সিলেক্টেড রুম স্পেক্স প্রিভিউ ব্যানার (সিটিং ক্যাপাসিটি ব্যাজ সহ), হাই-কনট্রাস্ট ইনপুট ফিল্ড, বোতামের সুন্দর ফিনিশিং (SUBMIT ও RESET) এবং লাইভ আপডেটিং বুকড স্লটস টেবিল যুক্ত করা হয়েছে।"
  },
  {
    "id": "457",
    "date": "2026-09-14T16:41",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-approval",
    "descriptionEn": "Refactored Slot-Wise Competing Groups view in Conference Room Approval portal (/conference-room-approval): each time-slot conflict container now renders a high-density Table List View with Req ID, Meeting Subject & Agenda, Organizer & Dept, Attendees, Priority, and inline action buttons (Approve, Reschedule Slot, Reject).",
    "descriptionBn": "কনফারেন্স রুম অ্যাপ্রুভাল পোর্টালের (/conference-room-approval) স্লট-ওয়াইজ কম্পিটিং গ্রুপ ভিউটি কার্ড গ্রিড থেকে একটি হাই-ডেনসিটি টেবিল লিস্ট ভিউতে (Table List View) পুনর্নির্মাণ করা হয়েছে: প্রতিটি টাইম-স্লট কন্টেইনারে Req ID, Subject & Agenda, Organizer, Attendees, Priority এবং সরাসরি অ্যাকশন বাটনসহ (Approve, Reschedule Slot, Reject) ডাটা টেবিল যুক্ত করা হয়েছে।"
  },
  {
    "id": "456",
    "date": "2026-09-14T16:39",
    "type": "New Feature",
    "module": "Facility Management",
    "link": "/conference-room-approval",
    "descriptionEn": "Implemented Smart Time-Slot Conflict Matrix & Rescheduling Workflow in Conference Room Approval portal (/conference-room-approval): automatically groups pending requisitions by Date, Room, and Time Slot; detects competing requisitions for identical slots; enables approvers to approve 1 primary booking while reallocating competing requests to alternate available rooms or time slots via interactive Reschedule & Allocate Alternate Slot modal dialog.",
    "descriptionBn": "কনফারেন্স রুম অ্যাপ্রুভাল পোর্টালটিতে (/conference-room-approval) স্মাট টাইম-স্লট কনফ্লিক্ট ম্যাট্রিক্স ও রি-শিডিউলিং ওয়ার্কফ্লো যুক্ত করা হয়েছে: একই টাইম স্লট ও রুমে আবেদনকৃত একাধিক রিকুইজিশনগুলোকে গ্রুপ করে কনফ্লিক্ট ব্যাজ তৈরি করে; অ্যাপ্রুভার একটি প্রাইমারি আবেদন অ্যাপ্রুভ করে বাকি প্রতিদ্বন্দ্বী আবেদনগুলোকে বিকল্প এভেলেবল স্লট বা রুমে (Reschedule & Allocate Alternate Slot মোডাল দিয়ে) পুনরায় বরাদ্দের সুযোগ পান।"
  },
  {
    "id": "455",
    "date": "2026-09-14T16:36",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-booking-list",
    "descriptionEn": "Redesigned Conference Room Booking List page (/conference-room-booking-list) matching reference ERP layout: top filter console with From Date, To Date, and SEARCH button; table card toolbar with EXCEL, PRINT, and PDF export buttons alongside right-side Search bar; soft-accent header data table with Action (Eye & Pencil icons), Meeting Room, Date, Start Time, End Time, Agenda, Total Participants, Responsible Depts., and Status columns; bottom entries count and pagination; interactive View Booking modal with Responsible Persons sub-table; and Edit Booking modal with tag pills and UPDATE/CLOSE action buttons.",
    "descriptionBn": "কনফারেন্স রুম বুকিং লিস্ট পেজটি (/conference-room-booking-list) রেফারেন্স ERP লেআউট অনুযায়ী পুনর্নির্মাণ করা হয়েছে: টপ ফিল্টার কনসোলে From Date, To Date ও SEARCH বাটন; টেবিল কার্ডে EXCEL, PRINT, PDF এক্সপোর্ট বাটন ও Search বার; সফট অ্যাকসেন্ট হেডার সহ ডাটা টেবিল (Action, Meeting Room, Date, Start Time, End Time, Agenda, Total Participants, Responsible Depts., Status); নিচে এন্ট্রিজ কাউন্ট ও পেজিনেশন; Responsible Persons সাব-টেবিল সহ View Booking মোডাল; এবং ট্যাগ চিপস সহ Edit Booking মোডাল।"
  },
  {
    "id": "454",
    "date": "2026-09-14T16:34",
    "type": "UI Update",
    "module": "Facility Management",
    "link": "/conference-room-booking",
    "descriptionEn": "Redesigned Conference Room Booking page (/conference-room-booking) matching reference ERP 2-column layout: left column features 'Booking Details' form card with Date *, Meeting Room *, Start Time *, End Time *, Total Participants *, Agenda *, Responsible Department *, Responsible Persons *, and bottom-left SUBMIT and RESET action buttons; right column features 'Booked Slots' high-density live table grid with Start, End, Booked By, Meeting Agenda, Room, and Status columns.",
    "descriptionBn": "কনফারেন্স রুম বুকিং পেজটি (/conference-room-booking) রেফারেন্স ERP এর মতো ২-কলাম লেআউটে পুনর্নির্মাণ করা হয়েছে: বাম কলামে 'Booking Details' ফর্ম (Date *, Meeting Room *, Start Time *, End Time *, Total Participants *, Agenda *, Responsible Department *, Responsible Persons * ও বটম-লেফটে SUBMIT এবং RESET বাটন); এবং ডান কলামে 'Booked Slots' ডাটা টেবিল (Start, End, Booked By, Meeting Agenda, Room, Status)।"
  },
  {
    "id": "453",
    "date": "2026-09-14T16:33",
    "type": "New Feature",
    "module": "Facility Management",
    "link": "/conference-room-booking",
    "descriptionEn": "Added new top-level sidebar menu 'Conference Room' along with 3 enterprise sub-menus: 'Conference room booking' (/conference-room-booking) featuring room selection grid, technical amenities configuration, and reservation form; 'Booking list' (/conference-room-booking-list) with filter console, status badges, and booking modal; and 'Approval' (/conference-room-approval) facility manager portal with clash warnings, approve/reject workflow, and rejection justification dialog.",
    "descriptionBn": "সাইডবারে নতুন প্রধান মেনু 'Conference Room' এবং এর অধীনে ৩টি সাব-মেনু যুক্ত করা হয়েছে: 'Conference room booking' (/conference-room-booking) যেখানে রুম সিলেকশন, টেকনিক্যাল সুযোগ-সুবিধা কনফিগারেশন ও বুকিং ফর্ম রয়েছে; 'Booking list' (/conference-room-booking-list) যেখানে ফিল্টার কনসোল ও বুকিং হিস্ট্রি ডিটেইলস রয়েছে; এবং 'Approval' (/conference-room-approval) যেখানে ফেসিলিটি ম্যানেজার কনফ্লিক্ট চেক করে অ্যাপপ্রুভ বা রিজেক্ট করতে পারবেন।"
  },
  {
    "id": "452",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Restored top filter console allocation controls on the Bulk Leave page (/bulk-leave) matching reference ERP layout: Leave Type *, From Date *, To Date *, and Reason fields are located in the top filter console along with Year, Department, Section, Designation, Unit, Line, Shift, and Employee ID (Comma Separator); removed popup modal; clicking SUBMIT at the bottom-left of the table grid directly executes the bulk leave allocation for all selected employees.",
    "descriptionBn": "বাল্ক লিভ পেজে (/bulk-leave) হুবহু রেফারেন্স ERP লেআউট অনুযায়ী লিভ প্যারামিটার ফিল্ডগুলো (Leave Type *, From Date *, To Date *, Reason) পুনরায় টপ ফিল্টার কনসোলে ফিরিয়ে আনা হয়েছে; অতিরিক্ত মোডাল পপআপ উঠিয়ে দেওয়া হয়েছে; এবং টেবিলের নিচে বটম-লেফটে থাকা SUBMIT বাটনে ক্লিক করলে সরাসরি সিলেক্টেড কর্মীদের বাল্ক ছুটি প্রসেস হয়ে যাবে।"
  },
  {
    "id": "451",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Refactored the 'Bulk Leave Application Parameters' modal (/bulk-leave) into a wide 2-column enterprise dialog (max-w-3xl): left column features a clean high-density candidate summary table; right column provides structured Leave Type, From/To Date controls, Duration calculation bar, and Reason note text area; completely removed preset reason chips.",
    "descriptionBn": "বাল্ক লিভ আবেদনের মোডালটি (/bulk-leave) একটি প্রশস্ত ২-কলাম এন্টারপ্রাইজ ডায়ালগে (max-w-3xl) পুনর্নির্মাণ করা হয়েছে: বাম কলামে সিলেক্টেড কর্মীদের ডাটা গ্রিড; ডান কলামে Leave Type, From/To Date, Duration ক্যালকুলেশন বার ও Reason ফিল্ড রাখা হয়েছে; এবং অতিরিক্ত প্রেসেট চিপসগুলো রিমুভ করা হয়েছে।"
  },
  {
    "id": "450",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Enhanced the 'Bulk Leave Application Parameters' modal (/bulk-leave) with executive-grade UI refinements: dark gradient header banner with icon badge and close button; candidate summary pill box showing selected employee badges with IDs; Leave Type selector; From/To date inputs with side-by-side metric cards for Leave Duration and Total Impact Man-Days; reason text area with 1-click preset reason chips; and a high-impact orange confirm button.",
    "descriptionBn": "বাল্ক লিভ আবেদনের মোডালটি (/bulk-leave) আরও সুন্দর ও প্রফেশনাল ডিজাইনে উন্নীত করা হয়েছে: আইকন ব্যাজ সহ ডার্ক গ্রেডিয়েন্ট হেডার ব্যানার; সিলেক্টেড কর্মীদের নাম ও আইডি ব্যাজ সহ ক্যান্ডিডেট লিস্ট বক্স; লিভ টাইপ সিলেক্টর; ডেট পিকারের পাশে Leave Duration ও Total Impact Man-Days এর এক্সিকিউটিভ মেট্রিক কার্ড; ১-ক্লিক প্রেসেট চিপস সহ Reason টেক্সট এরিয়া; এবং অরেঞ্জ কনফার্ম বাটন।"
  },
  {
    "id": "449",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Positioned the orange SUBMIT button directly at the bottom-left of the table grid footer panel on the Bulk Leave page (/bulk-leave) matching reference ERP layout: removed screen overlay bottom bar so users search, select employees in the table, and click SUBMIT at the bottom of the table to open the leave parameter input modal.",
    "descriptionBn": "বাল্ক লিভ পেজে (/bulk-leave) অরেঞ্জ SUBMIT বাটনটি হুবহু রেফারেন্স ERP ডিজাইন অনুযায়ী ডাটা টেবিলের বটম-লেফট ফুটার অংশে স্থাপন করা হয়েছে: স্ক্রিন ওভারলে বটম বার সরিয়ে স্বাভাবিক টেবিল ফুটারে বাটন রাখা হয়েছে যাতে ইউজার সিলেক্ট করার পর টেবিলের নিচে থাকা SUBMIT বাটনে ক্লিক করে লিভ প্যারামিটার মোডাল চালু করতে পারেন।"
  },
  {
    "id": "448",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Implemented interactive 'Bulk Leave Application Parameters' submission modal on the Bulk Leave page (/bulk-leave): users search and select employees from the high-density data grid and click the orange SUBMIT button to launch a confirmation modal containing selected candidate chips preview, Leave Type selector (CL, SL, EL, CPL, LWP, ML), From Date & To Date pickers with instant duration and total man-days calculation, Reason text area, and 'Confirm & Apply Bulk Leave' submission button.",
    "descriptionBn": "বাল্ক লিভ পেজে (/bulk-leave) সাবমিট মোডাল ইন্টিগ্রেট করা হয়েছে: ব্যবহারকারী ফিল্টার ও গ্রিড থেকে কর্মী সিলেক্ট করে অরেঞ্জ SUBMIT বাটনে ক্লিক করলে 'Bulk Leave Application Parameters' মোডাল ওপেন হবে, যেখানে সিলেক্টেড কর্মীদের লিস্ট, Leave Type সিলেক্টর (CL, SL, EL, CPL, LWP, ML), From Date ও To Date পিকার সহ লাইভ ডিউরেশন ক্যালকুলেশন, Reason নোট ফিল্ড এবং কনফার্মেশন বাটন রয়েছে।"
  },
  {
    "id": "447",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Refactored the 'Bulk Leave Allocation Console' (/bulk-leave) into a clean, high-density enterprise ERP interface: top header with executive KPI counter pills (Total Staff, Selected Count, Leave Duration); compact filter console with Year, Employee ID (Comma Separated), Employee Type, Department, Section, Designation, Unit, Line, Leave Type (CL, SL, EL, CPL, LWP, ML), From Date, To Date, and Reason Note; action toolbar with EXCEL, PRINT, and PDF export buttons alongside live table search; high-density corporate data table featuring select-all checkbox, Emp ID, Emp ID (Offc), Employee Name, Type, Department, Section, Designation, Unit, Line, live Leave Balances (CL/SL/EL), per-row remarks input, and row selection highlight; alongside a fixed enterprise bottom action bar showing live allocation summary and a solid blue 'Submit Bulk Leave' primary action button.",
    "descriptionBn": "অফিশিয়াল 'Bulk Leave Allocation Console' পেজটি (/bulk-leave) ক্লিন ও হাই-ডেনসিটি এন্টারপ্রাইজ ERP ডিজাইন সিস্টেমে পুনর্নির্মাণ করা হয়েছে: এক্সিকিউটিভ KPI কাউন্টার পিল সহ টপ হেডার (Total Staff, Selected Count, Leave Duration); Year, Employee ID (কমা সেপারেটেড সার্চ), Employee Type, Department, Section, Designation, Unit, Line, Leave Type (CL, SL, EL, CPL, LWP, ML), From Date, To Date এবং Reason ফিল্ড সহ কম্প্যাক্ট ফিল্টার কনসোল; EXCEL, PRINT, PDF এক্সপোর্ট বাটন ও লাইভ টেবিল সার্চ টুলবার; সিলেক্ট-অল চেকবক্স, Emp ID, Emp ID (Offc), Employee Name, Type, Department, Section, Designation, Unit, Line, লাইভ লিভ ব্যালেন্স (CL/SL/EL) ও রিমার্কস ফিল্ড সহ হাই-ডেনসিটি কারপোরেট ডাটা গ্রিড; এবং রিয়েল-টাইম সামারি ও সলিড ব্লু 'Submit Bulk Leave' বাটন সহ স্টিকি এন্টারপ্রাইজ বটম বার।"
  },
  {
    "id": "446",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Completely redesigned the 'Bulk Leave Allocation' interface (/bulk-leave) into a modern, executive-grade 2-step workflow: top dark indigo gradient header displaying real-time metrics (Selected Staff, Leave Duration, Total Man-Days); Step 1 Leave Parameters console with visual Leave Type card selector (Casual Leave - CL, Earned Leave - EL, Sick Leave - SL, Compensatory Leave - CPL, Leave Without Pay - LWP), From Date & To Date pickers with instant duration calculation, Day Portion selector (Full Day, First Half, Second Half), Reason input, and quick-fill reason chips; Step 2 Employee Selection engine with smart instant search (supporting single/comma-separated IDs e.g. 1074, 1088), Department/Section/Type filters, Quick Select by Department shortcuts (+ Production, + Store, + Wash, + HR & Admin), live leave balances (CL, SL, EL), per-row remarks, and row selection highlight; alongside a sticky glassmorphic bottom action dock showing real-time allocation summary and a high-visibility 'Apply Bulk Leave' action button with export to CSV option.",
    "descriptionBn": "অফিশিয়াল 'Bulk Leave Allocation' পেজটি (/bulk-leave) একটি আধুনিক ও প্রফেশনাল ২-স্টেজ ওয়ার্কফ্লোতে সম্পূর্ণ রিডিজাইন করা হয়েছে: টপ ডার্ক ইনডিগো গ্রেডিয়েন্ট হেডার যেখানে রিয়েল-টাইম মেট্রিক্স (Selected Staff, Leave Duration, Total Man-Days) দেখা যায়; স্টেজ ১ কনসোলে রয়েছে ভিজ্যুয়াল লিভ টাইপ কার্ড সিলেক্টর (CL, EL, SL, CPL, LWP), ইনস্ট্যান্ট ডিউরেশন ক্যালকুলেটর সহ ডেট পিকার, ডে পোর্শন সিলেক্টর (Full Day, Half Day), কারণ ও কুইক চিপস; স্টেজ ২ এম্বপ্লয়ি সিলেক্টর ইঞ্জিনে রয়েছে ইনস্ট্যান্ট কমা সেপারেটেড আইডি সার্চ (যেমন: 1074, 1088), ডিপার্টমেন্ট/সেকশন ফিল্টার, ডিপার্টমেন্ট ভিত্তিক কুইক সিলেক্ট বাটন (+ Production, + Store ইত্যাদি), প্রতিটি কর্মীর লাইভ লিভ ব্যালেন্স (CL, SL, EL) ও রিমার্কস; এবং রিয়েল-টাইম সামারি ও হাই-ভিজিবিলিটি 'Apply Bulk Leave' বাটন সহ স্টিকি বটম বার।"
  },
  {
    "id": "445",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Leave",
    "link": "/bulk-leave",
    "descriptionEn": "Created the official 'Bulk Leave' sub menu and application page under Leave module (/bulk-leave) matching exact ERP reference screenshot: top filter console with Year selector (2026), Employee Id (Comma Separator) input, Employee Type tag multi-select (Worker, Staff, etc.), Department dropdown (All Departments, Production, Store, Wash, Electric, HR & Admin), Section dropdown (ALL, Sewing, Store, Wash, Finishing, Electric, Fusing, Compliance), Designation dropdown (ALL, Operator, Loader, Jr. Distributor, Asst. Boiler Operator, Fusing Asst.), Unit dropdown (ALL, Aleya Apparels Ltd. (Shirt), Aleya Apparels Ltd., Aleya Apparels Ltd. (Pant-1), Aleya Apparels Ltd. (Pant-2)), Line dropdown (ALL, 02.Line-B, 11.Line-3, AT-N/A, N/A), Shift input, mandatory From Date & To Date pickers, Leave Type selector (CL, SL, AL, CPL, LWP, ML), Reason input, and blue 'SEARCH' button; toolbar with EXCEL, PRINT, and PDF export buttons alongside live search filter; responsive data table featuring select-all header checkbox, per-row Remarks text field, Emp ID, Emp ID(Offc), Name, Employee Type, Department, Section, Job Title, Unit, Line, Grade, and Joining Date; bottom status bar showing entry count with orange 'SUBMIT' button to process bulk leave applications; green floating quick action button (+) for quick selection modal; alongside adding the 'Bulk Leave' sub menu item under 'Leave' in Sidebar navigation, Topbar quick search, and Leave Hub card directory.",
    "descriptionBn": "Leave মডিউলের অধীনে অফিশিয়াল 'Bulk Leave' সাব-মেনু এবং বাল্ক লিভ অ্যাপ্লিকেশন পেজটি (/bulk-leave) হুবহু ERP রেফারেন্স স্ক্রিনশট অনুযায়ী তৈরি করা হয়েছে: টপ ফিল্টার কনসোলে রয়েছে Year সিলেক্টর (2026), Employee Id (Comma Separator) ইনপুট, Employee Type ট্যাগ মাল্টি-সিলেক্ট (Worker, Staff ইত্যাদি), Department ড্রপডাউন (All Departments, Production, Store, Wash, Electric, HR & Admin), Section ড্রপডাউন (ALL, Sewing, Store, Wash, Finishing, Electric, Fusing, Compliance), Designation ড্রপডাউন (ALL, Operator, Loader, Jr. Distributor, Asst. Boiler Operator, Fusing Asst.), Unit ড্রপডাউন (ALL, Aleya Apparels Ltd. (Shirt), Aleya Apparels Ltd., Aleya Apparels Ltd. (Pant-1), Aleya Apparels Ltd. (Pant-2)), Line ড্রপডাউন (ALL, 02.Line-B, 11.Line-3, AT-N/A, N/A), Shift ইনপুট, বাধ্যতামূলক From Date ও To Date পিকার, Leave Type সিলেক্টর (CL, SL, AL, CPL, LWP, ML), Reason ইনপুট এবং ব্লু 'SEARCH' বাটন; EXCEL, PRINT, PDF এক্সপোর্ট বাটন এবং লাইভ সার্চ ফিল্টার সহ টুলবার; সিলেক্ট-অল চেকবক্স, প্রতি রোর জন্য Remarks ফিল্ড, Emp ID, Emp ID(Offc), Name, Employee Type, Department, Section, Job Title, Unit, Line, Grade এবং Joining Date সহ ডাটা গ্রিড; বাল্ক ছুটি আবেদনের জন্য এন্ট্রি কাউন্টার ও অরেঞ্জ 'SUBMIT' বাটন সহ বটম বার; কুইক সিলেকশন মোডালের জন্য গ্রিন ফ্লোটিং অ্যাকশন বাটন (+); এবং সাইডবার নেভিগেশনের 'Leave' মেনু, টপবার কুইক সার্চ ও লিভ হাব কার্ডে 'Bulk Leave' সাব-মেনু যুক্ত করা হয়েছে।"
  },
  {
    "id": "444",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Budget",
    "link": "/budget-overtime",
    "descriptionEn": "Added official 'Overtime Budget' / 'OT Limit' page under Budget module (/budget-overtime) matching exact ERP reference screenshot: header '← OT Limit' with breadcrumbs (Home > Human Resource > OT Limit); filter console with Year selector (2026), Month selector (Sep), Department dropdown (All Departments & 70+ sections), blue 'SHOW' button with red outline, and red 'EXPORT EXCEL' button; search box toolbar; table data grid with select-all checkbox, # (SL), Year, Month, Sections (department names), OT Hours (editable input), and OT Amount (editable input); pre-populated sample department records (Accessories Store (MCD), Accessories Store 1, Accounts, Admin, Brand and Media, CAD, Chemical Store, Commercial, Compliance, Cutting, Dyeing, Finishing, HR, ICT, IE, Knitting, Maintenance, Marketing, Merchandising, MIS, Printing, Procurement, Production, QA, Sewing, Supply Chain, Washing, etc.); inline budget editing, summary total calculations, Excel download, and local storage persistence; alongside adding sub-menu items 'Overtime Budget' and 'Over Time Limit' under 'Manpower Budget' in Sidebar navigation.",
    "descriptionBn": "বাজেট মডিউলের অধীনে অফিশিয়াল 'Overtime Budget' / 'OT Limit' পেজটি (/budget-overtime) হুবহু ERP রেফারেন্স স্ক্রিনশট অনুযায়ী তৈরি করা হয়েছে: হেডার '← OT Limit' সহ ব্রেডক্রাম্ব (Home > Human Resource > OT Limit); Year (2026), Month (Sep), Department ড্রপডাউন (All Departments ও ৭০+ সেকশন), রেড আউটলাইন সহ ব্লু 'SHOW' বাটন এবং লাল 'EXPORT EXCEL' বাটন সহ ফিল্টার কনসোল; সার্চ ফিল্টার টুলবার; সিলেক্ট-অল চেকবক্স, # (SL), Year, Month, Sections (ডিপার্টমেন্টের নাম), OT Hours (এডিটেবল ইনপুট) এবং OT Amount (এডিটেবল ইনপুট) সহ ডাটা গ্রিড; বিভিন্ন ডিপার্টমেন্টের প্রিপপুলেটেড রেকর্ড (Accessories Store (MCD), Accessories Store 1, Accounts, Admin, Compliance, Cutting, Dyeing, Finishing, HR, ICT, Sewing, etc.); ইনলাইন বাজেট এডিটিং, মোট সামারি ক্যালকুলেশন, এক্সেল ডাউনলোড ও লোকাল স্টোরেজ সেভ সুবিধা; এবং সাইডবার নেভিগেশনের 'Manpower Budget' মেনুর অধীনে 'Overtime Budget' ও 'Over Time Limit' সাব-মেনু যুক্ত করা হয়েছে।"
  },
  {
    "id": "443",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Separation",
    "link": "/separation-clearance-approval",
    "descriptionEn": "Redesigned the official 'Clearance Approval Console' page under Separation module (/separation-clearance-approval) matching exact approval queue reference screenshot UI: clean card rows displaying checkbox, green shield icon badge with Clearance ID (CLR-2025-57068), Request Type, Employee Name & Title (Riazul Islam • 2025057068 • Asst. Manager), Department & Leaving Date (Implementation & Business Analysis • Leaving: 15 Sep 2026), 6-stage clearance progress bar (83%), status pill (Pending Review, Approved, Rejected), direct circle check (✓) and cross (✕) quick decision action buttons, and uppercase blue VIEW button; and an interactive 'Clearance Request Details' modal opening upon clicking any row or VIEW button showing comprehensive employee resignation metadata, stated resignation reason, HR directives, 6-stage department clearance matrix (Accounts, Admin, ICT, Immediate Boss, HR, COO), quick approval decision controls, and official printable clearance document generator.",
    "descriptionBn": "Separation মডিউলের অধীনে অফিশিয়াল 'Clearance Approval Console' পেজটি (/separation-clearance-approval) হুবহু রেফারেন্স স্ক্রিনশটের অ্যাপ্রুভাল কিউ ডিজাইন অনুযায়ী পুনর্নির্মাণ করা হয়েছে: ক্লিন কার্ড রো যেখানে চেকবক্স, ক্লিয়ারেন্স আইডি (CLR-2025-57068) সহ সবুজ শিল্ড আইকন ব্যাজ, Request Type, কর্মী নাম ও পদবি (Riazul Islam • 2025057068 • Asst. Manager), ডিপার্টমেন্ট ও সার্ভিস ছাড়ার তারিখ (Implementation & Business Analysis • Leaving: 15 Sep 2026), ৬-স্টেজ ক্লিয়ারেন্স প্রগ্রেস বার (83%), স্ট্যাটাস পিল (Pending Review, Approved, Rejected), সরাসরি সার্কেল টিক (✓) ও ক্রস (✕) বাটন, এবং আপারকেস ব্লু VIEW বাটন রয়েছে; এবং যেকোনো রো বা VIEW বাটনে ক্লিক করলে ওপেন হওয়া বিস্তারিত 'Clearance Request Details' মোডাল যাতে রয়েছে পূর্ণাঙ্গ পদত্যাগ মেটাডেটা, কারণ, HR নির্দেশিকা, ৬-ডিপার্টমেন্টের ক্লিয়ারেন্স ম্যাট্রিক্স কার্ড (Accounts, Admin, ICT, Immediate Boss, HR, COO), কুইক অ্যাপ্রুভাল ডিসিশন কন্ট্রোল এবং অফিশিয়াল ক্লিয়ারেন্স ফর্ম প্রিন্ট সুবিধা।"
  },
  {
    "id": "442",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Manage Overtime",
    "link": "/manage-overtime?tab=individual-review",
    "descriptionEn": "Implemented the official 'Individual OT Review' view under Manage Overtime (/manage-overtime?tab=individual-review) matching exact ERP specifications: top filter console with Requisition Type dropdown (OT, Allowance, All), 75+ Main Department dropdown (Accounts & Finance, Admin, Administration, Audit, Brand & Media, CAD, Commercial, Cutting, Dyeing, Finishing, HR, ICT, IE, Knitting, Maintenance, Marketing, Merchandising, MIS, Procurement, Production, QA, R&D, Sewing, Supply Chain, Vat & Tax, Washing, Worker, WTP, Yarn Dyeing, etc.), W.Line Name selector (ALL, 0, 01 to 65, N/A), OT Date * date picker, and blue 'Search' button; action toolbar with EXCEL, PRINT, and PDF export buttons alongside live table Search; data grid displaying ∇ select column, # (SL), Emp ID, Name, Department, Designation, Date, In Time, Out Date, Out Time, and Status badge; and bottom status bar showing entry count with 'No data available in table' empty state.",
    "descriptionBn": "অফিশিয়াল 'Individual OT Review' পেজটি (/manage-overtime?tab=individual-review) হুবহু ERP স্পেসিফিকেশন অনুযায়ী তৈরি করা হয়েছে: টপ ফিল্টার কনসোলে রয়েছে Requisition Type ড্রপডাউন (OT, Allowance, All), ৭৫+ Main Department ড্রপডাউন, W.Line Name সিলেক্টর (ALL, 0, 01 থেকে 65, N/A), OT Date * ডেট পিকার এবং ব্লু 'Search' বাটন; EXCEL, PRINT, PDF এক্সপোর্ট বাটন এবং লাইভ Search ফিল্টার সহ টুলবার; ∇ সিলেক্ট কলাম, # (SL), Emp ID, Name, Department, Designation, Date, In Time, Out Date, Out Time এবং Status ব্যাজ সহ ডাটা গ্রিড; এবং এন্ট্রি কাউন্টার সহ 'No data available in table' স্টেট সহ বটম বার।"
  },
  {
    "id": "441",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Manage Overtime",
    "link": "/manage-overtime?tab=submitted-list",
    "descriptionEn": "Overhauled the official 'Submitted OT request List' page under Manage Overtime (/manage-overtime?tab=submitted-list) matching exact ERP specifications and reference screenshots: top filter console featuring Requisition Type dropdown (OT, Allowance, All), 75+ Main Department dropdown, Line Name selector (ALL, 0, 01 to 65, N/A), ApStatus filter (Review, Approved, Rejected, Pending, All), and blue 'SEARCH' button; export toolbar with EXCEL, PRINT, PDF buttons and live table Search filter; complete dataset containing all 140 entries (ReqNum 3625, 3634, 4487, 5132, 6040, 6342, 6447, 7131, 7934, 8015, 8552, 8596, 8689, 9772, 10258, 10289, 10443, etc.) displaying ∇ Action column (blue 🔍 magnifying glass for Details view, yellow ✏️ pencil for Edit view), ReqNum, Dates, DocDetails, ReqType, Department, Line, ReqBy, ReqTime, and Status badge with remarks; interactive 'OT Request Details' modal matching Screenshot 2 featuring red 'VIEW REPORT' button, top-right 'ReqNum: 3634', export toolbar, employee detail grid with Total Amount summary, and 4 bottom verification audit cards (Checked By: Approved, Verified By HOD: Approved, Verified By HR: Review, Approved By MD: Pending); and interactive 'Edit Submitted OT Request' modal matching Screenshot 3 with breadcrumb header (Home > Human Resource > Edit Submitted OT Request), editable OT Req and Morning OT input boxes, and save functionality.",
    "descriptionBn": "অফিশিয়াল 'Submitted OT request List' পেজটি (/manage-overtime?tab=submitted-list) হুবহু ERP স্পেসিফিকেশন ও রেফারেন্স স্ক্রিনশট অনুযায়ী তৈরি করা হয়েছে: টপ ফিল্টার কনসোলে রয়েছে Requisition Type ড্রপডাউন (OT, Allowance, All), ৭৫+ Main Department ড্রপডাউন, Line Name সিলেক্টর (ALL, 0, 01 থেকে 65, N/A), ApStatus ফিল্টার (Review, Approved, Rejected, Pending, All) এবং ব্লু 'SEARCH' বাটন; EXCEL, PRINT, PDF এক্সপোর্ট এবং লাইভ Search ফিল্টার সহ টুলবার; ১৪০টি রেকর্ডের পূর্ণাঙ্গ ডাটা সেট (ReqNum 3625, 3634, 4487, 5132, 6040, 6342, 6447, 7131, 7934, 8015, 8552 ইত্যাদি) যেখানে ∇ Action কলামে ব্লু 🔍 ম্যাগনিফাইং গ্লাস (ডিটেইলস মোডাল) এবং ইয়েলো ✏️ পেন্সিল (এডিট মোডাল) বাটন, ReqNum, Dates, DocDetails, ReqType, Department, Line, ReqBy, ReqTime এবং রিমার্ক সহ Status ব্যাজ রয়েছে; স্ক্রিনশট ২ এর হুবহু 'OT Request Details' মোডাল (রেড 'VIEW REPORT' বাটন, 'ReqNum: 3634', এক্সপোর্ট বার, কর্মী ডাটা গ্রিড, Total Amount এবং ৪টি ভেরিফিকেশন কার্ড - Checked By, Verified By HOD, Verified By HR, Approved By MD); এবং স্ক্রিনশট ৩ এর হুবহু 'Edit Submitted OT Request' মোডাল (ব্রেডক্রাম্ব হেডার, এডিটেবল OT Req ও Morning OT ইনপুট এবং সেভ অপশন)।"
  },
  {
    "id": "440",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Manage Overtime",
    "link": "/manage-overtime?tab=submit",
    "descriptionEn": "Built the official 'Submit OT Req' requisition page under Manage Overtime (/manage-overtime?tab=submit) matching exact ERP specifications: top filter console with Requisition Type dropdown (OT, Allowance, All), 75+ Main Department dropdown (Accounts & Finance, Admin, Administration, All over Printing, Audit, Brand and Media, Business Automation, Business Development, CAD, Commercial, Cutting, e-Governance, Embroidery, EMS, Fabric Dyeing, Finishing, HR, ICT, IE & Planning, Knitting, Maintenance, Marketing, Merchandising, MIS, Procurement, Production, QA, R&D, Sewing, Supply Chain, Vat & Tax, Washing, Worker, WTP, Yarn Dyeing, etc.), W.Line Name selector (ALL, 0, 01 to 65, N/A), OT Date * date picker, and blue 'Search' button; action toolbar with Excel, Print, PDF export buttons alongside live table Search; data grid displaying # SL with multi-select checkbox, Emp ID, Emp ID(Off), Name, Type, Department, Designation, Unit, Line, W.Line, Date, In Time, Out Date, Out Time, OT Req, OT Type, Amount (৳), and Status badge; and bottom action bar with entries count alongside orange 'SUBMIT OT REQ' button.",
    "descriptionBn": "অফিশিয়াল 'Submit OT Req' পেজটি (/manage-overtime?tab=submit) হুবহু ERP স্পেসিফিকেশন অনুযায়ী নির্মাণ করা হয়েছে: টপ ফিল্টার কনসোলে রয়েছে Requisition Type ড্রপডাউন (OT, Allowance, All), ৭৫+ Main Department ড্রপডাউন, W.Line Name সিলেক্টর (ALL, 0, 01 থেকে 65, N/A), OT Date * ডেট পিকার এবং ব্লু 'Search' বাটন; Excel, Print, PDF এক্সপোর্ট বাটন এবং লাইভ টেবিল Search ফিল্টার সহ টুলবার; মাল্টি-সিলেক্ট চেকবক্স ও # ক্রম সহ Emp ID, Emp ID(Off), Name, Type, Department, Designation, Unit, Line, W.Line, Date, In Time, Out Date, Out Time, OT Req, OT Type, Amount (৳) এবং Status ব্যাজ সহ ডাটা গ্রিড; এবং এন্ট্রি কাউন্টার সহ অরেঞ্জ 'SUBMIT OT REQ' বাটন।"
  },
  {
    "id": "439",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Manage Overtime",
    "link": "/manage-overtime?tab=requisition-list",
    "descriptionEn": "Created the official 'OT Requisition List' view under Manage Overtime (/manage-overtime?tab=requisition-list) matching exact ERP specifications: top filter panel featuring Start Date, End Date, Status options (Pending, Approved, Rejected, ALL), Employee Type selector (Management, Office Executive, Production Executive, Office Staff, Production Staff, Worker, Pcs Rate Worker, Intern), exhaustive Department dropdown (67+ departments including MCD, Dyeing, Printing, Sewing, QC, etc.), complete Job Title designation list (400+ designations), Unit list (Unit-01 to Unit-10, N/A), Line list (00 to 65, N/A), Requisition Type dropdown (All, OT, Allowance), Employee Id filter, and blue 'Search' button; action toolbar with Excel, Print, and PDF export buttons alongside live Search box; data grid displaying # (SL), Emp ID, Name, Department, Designation, Date, In Time, Out Date, Out Time, and Status badge; and bottom status bar showing entry count with empty table state.",
    "descriptionBn": "অফিশিয়াল 'OT Requisition List' ভিউ (/manage-overtime?tab=requisition-list) হুবহু ERP স্পেসিফিকেশন অনুযায়ী তৈরি করা হয়েছে: টপ ফিল্টার প্যানেলে রয়েছে Start Date, End Date, Status অপশন (Pending, Approved, Rejected, ALL), Employee Type সিলেক্টর (Management, Office Executive, Production Executive, Office Staff, Production Staff, Worker, Pcs Rate Worker, Intern), ৬৭+ ডিপার্টমেন্টের ড্রপডাউন, ৪০০+ পদবির Job Title সিলেক্টর, Unit লিস্ট (Unit-01 থেকে Unit-10, N/A), Line লিস্ট (00 থেকে 65, N/A), Requisition Type (All, OT, Allowance), Employee Id ফিল্টার এবং ব্লু 'Search' বাটন; Excel, Print, PDF এক্সপোর্ট বাটন ও লাইভ Search টুলবার; # (SL), Emp ID, Name, Department, Designation, Date, In Time, Out Date, Out Time এবং Status ব্যাজ সহ ডাটা গ্রিড; এবং এন্ট্রি কাউন্টার সহ বটম বার।"
  },
  {
    "id": "438",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Manage Overtime",
    "link": "/approve-overtime",
    "descriptionEn": "Created the official 'Approve OT Requisition' approval console (/approve-overtime) matching exact ERP specifications: top filter panel featuring Start Date, End Date, Status options (Pending, Approved, Rejected, ALL), Employee Type selector (Management, Office Executive, Production Executive, Office Staff, Production Staff, Worker, Pcs Rate Worker, Intern), exhaustive Department dropdown (67+ departments including MCD, Dyeing, Printing, Sewing, QC, etc.), complete Job Title designation list (400+ designations), Unit list (Unit-01 to Unit-10, N/A), Line list (00 to 65, N/A), Employee Id filter, and blue 'Search' button; action toolbar with Excel, Print, and PDF export buttons alongside live Search box; data grid displaying Select All checkbox column, Emp ID, Emp ID(Off), Name, Type, Department, Designation, Unit, Line, Date, In Time, Out Date, Out Time, OT Req, MOT Req, Amount, and Status badge; and bottom action bar with entries counter alongside green 'Approve' and red 'Reject' bulk action buttons.",
    "descriptionBn": "অফিশিয়াল 'Approve OT Requisition' অ্যাপ্রুভাল কনসোল (/approve-overtime) হুবহু ERP স্পেসিফিকেশন অনুযায়ী তৈরি করা হয়েছে: টপ ফিল্টার প্যানেলে রয়েছে Start Date, End Date, Status অপশন (Pending, Approved, Rejected, ALL), Employee Type সিলেক্টর (Management, Office Executive, Production Executive, Office Staff, Production Staff, Worker, Pcs Rate Worker, Intern), ৬৭+ ডিপার্টমেন্টের পূর্ণাঙ্গ ড্রপডাউন (MCD, Dyeing, Printing, Sewing, QC ইত্যাদি), ৪০০+ পদবির Job Title সিলেক্টর, Unit লিস্ট (Unit-01 থেকে Unit-10, N/A), Line লিস্ট (00 থেকে 65, N/A), Employee Id ফিল্টার এবং ব্লু 'Search' বাটন; Excel, Print, PDF এক্সপোর্ট বাটন ও লাইভ Search টুলবার; সিলেক্ট অল চেকবক্স, Emp ID, Emp ID(Off), Name, Type, Department, Designation, Unit, Line, Date, In Time, Out Date, Out Time, OT Req, MOT Req, Amount এবং Status ব্যাজ সহ ডাটা গ্রিড; এবং এন্ট্রি কাউন্টার সহ গ্রিন 'Approve' ও রেড 'Reject' বাটন।"
  },
  {
    "id": "437",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Manage Overtime",
    "link": "/manage-overtime",
    "descriptionEn": "Updated 'Manage Overtime' module (/manage-overtime) to feature all 6 required menu sub-items under Sidebar: OT Requisition, Approve OT Requisition, OT Requisition List, Submit OT Req, Submitted OT List, and Individual OT Review. Redesigned the OT Requisition page to match the user's reference screenshot with exact layout components: top filter panel with blue left accent border (Date, To Date, Employee Id with 'use comma as separator' input, Employee Type selector tag box, Department, Unit, Line, and vibrant blue 'SHOW' button); top-right OT Summary widget (OT header input with pencil icon to bulk apply, W.Line selector with pencil icon to set working line for selected rows, blue note 'Time will Add auto random by +5 minutes', Budget, Approved, and red Balance counter); action toolbar with EXCEL, PRINT, and PDF export buttons alongside live search box; full data grid displaying Select All checkbox, SL, Emp ID, Name, Department, Designation, Unit, Line, In Date/Time, Out Date/Time, W.Line dropdown, calculated OT, M_OT, Status badge, Req OT input, and Req MOT input; and bottom action bar featuring showing entries counter alongside amber 'SUBMIT' and red 'DELETE' action buttons.",
    "descriptionBn": "'Manage Overtime' মডিউলে (/manage-overtime) সাইডবারের অধীনে সকল ৬টি নির্ধারিত মেনু অপশন অন্তর্ভুক্ত করা হয়েছে: OT Requisition, Approve OT Requisition, OT Requisition List, Submit OT Req, Submitted OT List এবং Individual OT Review। রেফারেন্স স্ক্রিনশটের হুবহু লেআউট অনুযায়ী OT Requisition পেজটি নতুন করে সাজানো হয়েছে: নীল লেফট একসেন্টযুক্ত টপ ফিল্টার প্যানেল (Date, To Date, 'use comma as separator' প্লেসহোল্ডার সহ Employee Id, Employee Type ট্যাগ বক্স, Department, Unit, Line এবং ব্লু 'SHOW' বাটন); টপ-রাইট OT সামারি উইজেট (একসাথে সিলেক্টেড রোতে সেট করার পেন্সিল আইকন সহ OT ইনপুট, W.Line সিলেক্টর, 'Time will Add auto random by +5 minutes' ব্লু নোট, Budget, Approved ও লাল ফন্টে Balance কাউন্টার); EXCEL, PRINT, PDF এক্সপোর্ট এবং লাইভ সার্চ টুলবার; সিলেক্ট অল চেকবক্স, SL, Emp ID, Name, Department, Designation, Unit, Line, In Date/Time, Out Date/Time, W.Line ড্রপডাউন, হিসাবকৃত OT, M_OT, Status ব্যাজ, Req OT এবং Req MOT ইনপুট সহ ডাটা গ্রিড; এবং এন্ট্রি কাউন্টার সহ অরেঞ্জ 'SUBMIT' ও রেড 'DELETE' বাটনের বটম বার।"
  },
  {
    "id": "436",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "HR & SSP Requisitions",
    "link": "/ssp-new-requisition",
    "descriptionEn": "Added 'General Product Budget Request' and 'ICT Product Budget Request' as standalone portal cards in the HR/SSP New Requisition hub (/ssp-new-requisition) alongside Leave Application, IOU, and other requisitions. Each card navigates to its dedicated ERP page (/ssp-general-product-budget-request and /ssp-ict-product-budget-request) matching exact ERP screenshots: underline-styled form fields with Req. Type options for 'Monthly Purchase Request' and 'Regular Purchase Request', Category with General Stationary for General requests, Product with preloaded catalog suggestions, Quantity, Justification, and blue 'ADD' button; light-pink-headed table (#ffebee) with Item, Quantity, Justification, and For columns; red 'On Behalf :' checkbox with inline employee delegation picker; blue 'SUBMIT' button committing requests to local storage; recent submissions ledger; and sidebar/topbar navigation integration.",
    "descriptionBn": "HR/SSP নিউ রিকুইজিশন হাব পেজে (/ssp-new-requisition) 'Leave Application' এবং 'IOU' এর মতো 'General Product Budget Request' এবং 'ICT Product Budget Request' নামক দুটি আলাদা কার্ড যুক্ত করা হয়েছে। প্রতিটি কার্ডে ক্লিক করলে সরাসরি তার নির্দিষ্ট ERP পেজ ওপেন হবে (/ssp-general-product-budget-request এবং /ssp-ict-product-budget-request) যা হুবহু ERP স্ক্রিনশটের মতো তৈরি: আন্ডারলাইন-স্টাইলের ইনপুটযুক্ত ফর্ম (Req. Type ড্রপডাউনে 'Monthly Purchase Request' ও 'Regular Purchase Request' অপশন, জেনারেল রিকুয়েস্টের জন্য General Stationary ক্যাটাগরি, ক্যাটালগ সাজেশনসহ Product, Quantity, Justification এবং ব্লু 'ADD' বাটন); হালকা গোলাপি হেডারযুক্ত টেবিল (#ffebee - Item, Quantity, Justification, For); লাল 'On Behalf :' চেকবক্সসহ ইনলাইন কর্মী সিলেকশন; লোকাল স্টোরেজে সেভ করার ব্লু 'SUBMIT' বাটন; সাম্প্রতিক রিকুইজিশন লেজার; এবং সাইডবার ও টপবার নেভিগেশন সুবিধা।"
  },
  {
    "id": "435",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-reports-payment-statement",
    "descriptionEn": "Created the official 'Payment Statement' analytical and supplier accounting report console under Reports module matching exact ERP specifications: top filter bar with blue left accent bar (Bill Location dropdown with default 'PAL-Fabric Dyeing', Date From '01/09/2025', Date To '08/09/2026', vibrant blue 'SHOW' button, and vibrant green 'TRANSACTION' button); action toolbar with EXCEL, PRINT, and PDF export buttons alongside live search filter; data table featuring select-all checkbox column with filter indicator (∇), Supplier name, PreDue, BillingAmt, PaidAmt, and DueBalance with exact live mathematical balance computations (PreDue + BillingAmt - PaidAmt); and an authentic 'Transactions Statement' report modal triggered via the TRANSACTION button featuring Pakiza Apparels Limited branding and factory address (Khordo Nowpara, Rasulpur, Madhabdi, Narsingdi), sky-blue centered date range banner, and a 3-column responsive card grid for each supplier with italic blue supplier heading, pink-header Bill Table (Opening balance, bill date, bill number, bill amounts, and Bill Total), lavender-header Payment Table (Pay Date, Chq No, paid amounts, Pay Total, and Discount), and bold bottom Out Standing summary balance with full print preview support.",
    "descriptionBn": "Reports মডিউলের অধীনে অফিশিয়াল 'Payment Statement' অ্যানালাইটিক্যাল এবং সাপ্লায়ার অ্যাকাউন্টস রিপোর্ট কনসোল হুবহু ERP ডিজাইন অনুযায়ী তৈরি করা হয়েছে: বামপাশে নীল বর্ডার সহ টপ ফিল্টার বার (Bill Location ড্রপডাউন ডিফল্ট 'PAL-Fabric Dyeing', Date From '01/09/2025', Date To '08/09/2026', ব্লু 'SHOW' বাটন এবং উজ্জ্বল সবুজ 'TRANSACTION' বাটন); EXCEL, PRINT, PDF এক্সপোর্ট বাটন ও লাইভ সার্চ ফিল্টার টুলবার; সিলেক্ট-অল চেকবক্স কলাম সহ ∇ ফিল্টার আইকন, Supplier নাম, PreDue, BillingAmt, PaidAmt, এবং স্বয়ংক্রিয় গাণিতিক হিসাবযুক্ত DueBalance (PreDue + BillingAmt - PaidAmt) ডাটা গ্রিড; এবং TRANSACTION বাটনে ক্লিক করলে প্রদর্শিত অফিশিয়াল 'Transactions Statement' রিপোর্ট মোডাল যাতে রয়েছে সবুজ Pakiza Apparels Limited ব্র্যান্ডিং ও কারখানা ঠিকানা, স্কাই-ব্লু তারিখ রেঞ্জ ব্যানার, এবং প্রতিটি সাপ্লায়ারের জন্য ৩-কলাম রেসপনসিভ কার্ড গ্রিড (ইটালিক ব্লু সাপ্লায়ার হেডিং, গোলাপি হেডারযুক্ত Bill Table - Opening, বিল তারিখ, বিল নম্বর, বিলের পরিমাণ ও Bill Total, ল্যাভেন্ডার হেডারযুক্ত Payment Table - পেমেন্ট তারিখ, চেক নম্বর, পেমেন্টের পরিমাণ, Pay Total, Discount, এবং বোল্ড ফন্টে Out Standing ব্যালেন্স) সহ প্রিন্ট প্রিভিউ সুবিধা।"
  },
  {
    "id": "434",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-reports-purchase-price",
    "descriptionEn": "Created the official 'Purchase Price' analytical report console under Reports module matching exact ERP specifications: top filter panel with blue left accent bar (Store Name, Group Name e.g. Furniture_FixedAssets, Item Name text input, and vibrant blue 'SHOW' button); export toolbar with EXCEL, PRINT, and PDF export buttons alongside real-time search; comprehensive data table displaying Action (∇ list icon button to view historical bill records), GroupName, ItemName, Uom, LowestPrice, Supplier Details (Lowest Price with supplier name, Bill No, Bill Date, and interactive [↗] external link), LastPrice, and Supplier Details (Last Price with supplier name, Bill No, Bill Date, and interactive [↗] external link); interactive 'Purchase Price History' modal displaying Product Name, Unit, and a detailed Bill Details ledger (# with [↗] bill view link, PurType, Supplier, BillNo, BillDate, Rate, DCRate, LandedCost, Currency); and an authentic full 'Supplier Bill Document' modal displaying 4-row header metadata (Bill To, Bill No, Address, Bill Date, Supplier, Purchase Type, Currency, Currency Rate), itemized goods table with DC Price and Landed Cost, and complete financial summary block (Total Amt, Vat Amt, Tax Amt, Other Amt, Net Total, Discount, G.Total) with printable layout.",
    "descriptionBn": "Reports মডিউলের অধীনে অফিশিয়াল 'Purchase Price' অ্যানালাইটিক্যাল রিপোর্ট কনসোল হুবহু ERP ডিজাইন অনুযায়ী তৈরি করা হয়েছে: বামপাশে নীল বর্ডার সহ টপ ফিল্টার প্যানেল (Store Name, Group Name যেমন Furniture_FixedAssets, Item Name ইনপুট এবং 'SHOW' বাটন); EXCEL, PRINT, PDF এক্সপোর্ট বাটন ও লাইভ সার্চ টুলবার; একশন কলাম (হিস্ট্রি দেখতে ∇ লিস্ট আইকন বাটন), GroupName, ItemName, Uom, LowestPrice, Supplier Details (Lowest Price - সাপ্লায়ার নাম, বিল নং, তারিখ ও [↗] লিঙ্ক), LastPrice, এবং Supplier Details (Last Price - সাপ্লায়ার নাম, বিল নং, তারিখ ও [↗] লিঙ্ক) সহ ডাটা গ্রিড; Product Name, Unit, এবং পূর্ণাঙ্গ Bill Details লেজার (# কলামে [↗] লিঙ্ক, PurType, Supplier, BillNo, BillDate, Rate, DCRate, LandedCost, Currency) সহ 'Purchase Price History' মোডাল; এবং ৪-সারি মেটাডেটা (Bill To, Bill No, Address, Bill Date, Supplier, Purchase Type, Currency, Currency Rate), DC Price ও Landed Cost সহ আইটেম টেবিল, এবং ফিন্যান্সিয়াল সামারি ব্লক (Total Amt, Vat Amt, Tax Amt, Other Amt, Net Total, Discount, G.Total) সহ অফিশিয়াল 'Supplier Bill Document' প্রিন্ট মোডাল।"
  },
  {
    "id": "433",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-audit-bill",
    "descriptionEn": "Created the official 'Bill Audit' verification ledger and document console under Audit module matching exact ERP specifications: top filter panel with blue left accent bar (Date From, Date To, Audited Status dropdown with Unaudited/Audited/All, Searchable Supplier Name selector, and vibrant blue 'SHOW' button); action toolbar with EXCEL, PRINT, and PDF export buttons alongside live search; data table displaying Action (Blue Print Billing Info, Amber Pencil Bill Audit, and Green Paperclip Attachment viewer buttons), Supplier, Bill No, Bill Date, Currency, Currency Rate, Bill Value, Vat Amount, Tax Amount, Net Payable, Mrr No, Challan No, Remarks, and Status badges; interactive 'Bill Audit' modal with comprehensive metadata grid (Bill No, Bill Date, Supplier, PO/WO, PO/WO Date, Currency, Exchange Rate, MRIR No, MRIR Date, Challan No, Challan Date), itemized goods table with inline editable 'Review Note' inputs, complete financial breakdown rows (Total Qty, Total Amount, Discount, Vat(Inc), Tax(Inc), Others Amount, Advance Adjustment, Net Amount), spelled-out amount in words, clickable attachment file link, editable 'Audit Value *' field, 'Audit Note' textarea, and dual action buttons (amber 'REVIEW' to mark Under Review and blue 'AUDITED' to approve and commit to local storage); authentic 'Billing Information' print preview modal featuring Pakiza Software branding, address, boxed metadata, itemized table, comment section, and a 4-tier signature block (Prepared By, Vat and Tax Inputted By, Audited By, Approved By); and a dedicated document attachment preview modal.",
    "descriptionBn": "Audit মডিউলের অধীনে অফিশিয়াল 'Bill Audit' ভেরিফিকেশন লেজার ও ডকুমেন্ট কনসোল হুবহু ERP ডিজাইন অনুযায়ী তৈরি করা হয়েছে: বামপাশে নীল বর্ডার সহ টপ ফিল্টার প্যানেল (Date From, Date To, Audited Status ড্রপডাউন - Unaudited/Audited/All, Searchable Supplier Name সিলেক্টর এবং 'SHOW' বাটন); EXCEL, PRINT, PDF এক্সপোর্ট বাটন ও লাইভ সার্চ টুলবার; একশন কলাম (ব্লু প্রিন্ট Billing Info, অ্যাম্বার পেন্সিল Bill Audit এবং গ্রিন পেপারক্লিপ অ্যাটাচমেন্ট ভিউয়ার বাটন), Supplier, Bill No, Bill Date, Currency, Currency Rate, Bill Value, Vat Amount, Tax Amount, Net Payable, Mrr No, Challan No, Remarks, এবং Status ব্যাজ সহ ডাটা গ্রিড; মেটাডেটা গ্রিড, আইটেমভিত্তিক এডিটেবল 'Review Note' ইনপুট, পূর্ণাঙ্গ ফিন্যান্সিয়াল ব্রেকডাউন (Total Qty, Total Amount, Discount, Vat(Inc), Tax(Inc), Others Amount, Advance Adjustment, Net Amount), কথায় টাকার পরিমাণ, ক্লিকযোগ্য অ্যাটাচমেন্ট ফাইল লিঙ্ক, এডিটেবল 'Audit Value *' ফিল্ড, 'Audit Note' টেক্সটএরিয়া, এবং ডুয়াল অ্যাকশন বাটন (অ্যাম্বার 'REVIEW' এবং ব্লু 'AUDITED') সহ ইন্টারেক্টিভ 'Bill Audit' মোডাল; Pakiza Software ব্র্যান্ডিং, ঠিকানা, আইটেম টেবিল, কমেন্ট সেকশন এবং ৪-স্তর বিশিষ্ট সিগনেচার ব্লক (Prepared By, Vat and Tax Inputted By, Audited By, Approved By) সহ অফিশিয়াল 'Billing Information' প্রিন্ট প্রিভিউ মোডাল; এবং ডেডিকেটেড ডকুমেন্ট অ্যাটাচমেন্ট প্রিভিউ মোডাল।"
  },
  {
    "id": "432",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-audit-landed-cost",
    "descriptionEn": "Rebuilt the official 'Update Landed Cost' registry and calculation console under Audit module matching exact ERP specifications: top filter panel with blue left accent bar (PI Date From, PI Date To, Searchable Supplier Name selector, sky-blue styled PI Number input, and 'SHOW' button); action toolbar with EXCEL, PRINT, and PDF export buttons alongside live search; data table styled with slate-gray headers displaying Action (# column with Blue Print PI and Amber Pencil edit buttons), PINo, PIDate, LcNo, LcDate, ShipmentDate, Supplier, ProductType, and Status with custom badges; interactive 'Proforma Invoice' print view modal featuring green Pakiza Knit Composite Ltd company branding, address, centered blue title, two-column metadata (PI No, LC No, Supplier, Terms, Validity, Currency, Ports, Dates, Type), itemized goods table, remarks, and financial summary (Total, Upcharge, Discount, Net Total); and an advanced 'Update Product Landed Cost Sheet' modal providing real-time landing expense apportionment (Customs Duty/Taxes, Marine Insurance, Freight & Shipping, Port Charges/C&F Commission, Inland Transportation, Bank Charges/LC Commission, and Misc Expenses), live Landed Cost Factor multiplier and surcharge percentage, and automatic line-item landed unit rate recalculations saved to local storage.",
    "descriptionBn": "Audit মডিউলের অধীনে অফিশিয়াল 'Update Landed Cost' রেজিস্ট্রি ও ক্যালকুলেশন কনসোল হুবহু ERP ডিজাইন অনুযায়ী রি-বিল্ট করা হয়েছে: বামপাশে নীল বর্ডার সহ টপ ফিল্টার প্যানেল (PI Date From, PI Date To, Searchable Supplier Name সিলেক্টর, স্কাই-ব্লু লেবেল সহ PI Number ইনপুট এবং 'SHOW' বাটন); EXCEL, PRINT, PDF এক্সপোর্ট বাটন ও লাইভ সার্চ টুলবার; স্লেট-ধূসর হেডার সহ ডাটা গ্রিড (# কলামে ব্লু প্রিন্ট PI ও অ্যাম্বার পেন্সিল এডিট বাটন, PINo, PIDate, LcNo, LcDate, ShipmentDate, Supplier, ProductType, Status ব্যাজ); সবুজ Pakiza Knit Composite Ltd ব্র্যান্ডিং, ঠিকানা, দুই-কলাম মেটাডেটা, আইটেম টেবিল ও ফিন্যান্সিয়াল সামারি (Total, Upcharge, Discount, Net Total) সহ অফিশিয়াল 'Proforma Invoice' প্রিন্ট ভিউ মোডাল; এবং রিয়েল-টাইম ল্যান্ডিং ব্যয় বণ্টন (কাস্টমস শুল্ক, মেরিন ইন্স্যুরেন্স, ফ্রেইট ও শিপিং, পোর্ট ও সিঅ্যান্ডএফ কমিশন, অভ্যন্তরীণ পরিবহন, ব্যাংক চার্জ এবং অন্যান্য খরচ), লাইভ Landed Cost Factor মাল্টিপ্লায়ার ও অতিরিক্ত শতকরা হার, এবং লোকাল স্টোরেজে সংরক্ষণযোগ্য আইটেমভিত্তিক স্বয়ংক্রিয় ল্যান্ডেড ইউনিট রেট সহ অ্যাডভান্সড 'Update Product Landed Cost Sheet' মোডাল।"
  },
  {
    "id": "431",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-audit-mrr",
    "descriptionEn": "Created the official 'MRR Audit' ledger and review console under the Audit module matching exact ERP mockups: top filter panel with blue left accent bar (Location Name, Store Name, MRR Date From/To, MRR Type, Searchable Supplier Name selector, comma-separated MRR Numbers and Challan Numbers filters, and vibrant blue 'SHOW' button); action toolbar with EXCEL, PRINT, and PDF export buttons alongside real-time table search; data table displaying Action (Blue Print MRIR and Amber Audit icons), MRR, MRRDate, Supplier, Challan, ChDate, BillNo, and Remark; interactive 'MRR Details' audit modal with comprehensive metadata grid (MRR No, PO No, Revision, Dates, Supplier, Challan, LC, Bill info), itemized goods table with editable line-by-line 'Review Note' fields, mandatory 'Audit Note *' observation field, and 'AUDITED' action button that commits verification status to state and local storage; and an authentic 'Material Receiving & Inspection Report (MRIR)' print preview modal featuring Pakiza Software branding, office address, receive details header, boxed metadata, quantity/price breakdown, spelled-out amount in words, verification notes, and a 6-tier signature block (MCD Prepared By, MCD Checked By, Quality Inspected By, MCD Approved By, Billing Info Inputted By, Billing Info Approved By).",
    "descriptionBn": "Audit মডিউলের অধীনে অফিশিয়াল 'MRR Audit' লেজার ও রিভিউ কনসোল হুবহু ERP ডিজাইন অনুযায়ী তৈরি করা হয়েছে: বামপাশে নীল বর্ডার সহ টপ ফিল্টার প্যানেল (Location Name, Store Name, MRR Date From/To, MRR Type, Searchable Supplier Name সিলেক্টর, কমা-সেপারেটেড MRR Numbers ও Challan Numbers ফিল্টার এবং 'SHOW' বাটন); EXCEL, PRINT, PDF এক্সপোর্ট বাটন ও লাইভ সার্চ টুলবার; একশন কলাম (ব্লু প্রিন্ট MRIR ও অ্যাম্বার অডিট আইকন), MRR, MRRDate, Supplier, Challan, ChDate, BillNo, ও Remark সহ ডাটা গ্রিড; মেটাডেটা গ্রিড, আইটেমভিত্তিক এডিটেবল 'Review Note' ইনপুট, আবশ্যিক 'Audit Note *' ফিল্ড ও 'AUDITED' বাটন সহ ইন্টারেক্টিভ 'MRR Details' অডিট মোডাল যা ভেরিফিকেশন স্ট্যাটাস লোকাল স্টোরেজে সংরক্ষণ করে; এবং Pakiza Software ব্র্যান্ডিং, ঠিকানা, রিসিভ ডিটেইলস হেডার, কোয়ান্টিটি/প্রাইস ব্রেকডাউন, কথায় টাকার পরিমাণ, ভেরিফিকেশন নোট এবং ৬-স্তর বিশিষ্ট সিগনেচার ব্লক (MCD Prepared By, MCD Checked By, Quality Inspected By, MCD Approved By, Billing Info Inputted By, Billing Info Approved By) সহ অফিশিয়াল 'Material Receiving & Inspection Report (MRIR)' প্রিন্ট প্রিভিউ মোডাল।"
  },
  {
    "id": "430",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-payment-list",
    "descriptionEn": "Created the official 'Payment List' report console under Payment module matching exact BPM specifications: top filter panel with Date From, Date To, Payment Mode radio group (All, Cash, Cheque), Searchable Supplier selector featuring full ERP supplier directory (with 'All...' default and instant search filter), and 'Show' action button; export toolbar with Excel, Print, PDF actions and live search; data table with exact columns (∇, Supplier, Mode, PaymentDate, Amount, ChqNo, ChqDate, Remarks); interactive Bill Payment Voucher document preview modal with Pakiza Software branding, metadata, settled bills breakdown, spelled-out amount in words, and 4-tier signature block; live integration with vouchers saved from the Bill Payment page; and pagination with record status.",
    "descriptionBn": "Payment মডিউলের অধীনে অফিশিয়াল 'Payment List' রিপোর্ট কনসোল তৈরি করা হয়েছে: টপ ফিল্টার প্যানেলে Date From, Date To, Payment Mode রেডিও অপশন (All, Cash, Cheque), সম্পূর্ণ ERP সাপ্লায়ার তালিকা সহ Searchable সাপ্লায়ার সিলেক্টর ('All...' ডিফল্ট ও ইনস্ট্যান্ট সার্চ ফিল্টার) এবং 'Show' বাটন; Excel, Print, PDF এক্সপোর্ট টুলবার ও লাইভ সার্চ; অফিশিয়াল কলাম সহ ডাটা টেবিল (∇, Supplier, Mode, PaymentDate, Amount, ChqNo, ChqDate, Remarks); Pakiza Software ব্র্যান্ডিং, মেটাডেটা, সেটেল্ড বিল ব্রেকডাউন, কথায় টাকার পরিমাণ এবং ৪-স্তর বিশিষ্ট সিগনেচার ব্লক সহ ইন্টারেক্টিভ Bill Payment Voucher ডকুমেন্ট প্রিভিউ মোডাল; Bill Payment পেজ থেকে সেভ করা ভাউচারের সাথে লাইভ ইন্টিগ্রেশন; এবং পেজিনেশন ও রেকর্ড স্ট্যাটাস।"
  },
  {
    "id": "429",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-payment-bill",
    "descriptionEn": "Created the official 'Bill Payment' settlement console under Payment module matching exact mockup specifications: top payment form card with blue left accent bar (Payment Mode, Payment Date, Supplier Name, Bank Account, Cheque No, Cheque Date, Amount, Remarks, SUBMIT button, live PaidAmt and Discount counters, and SHOW button), pending bills grid with filter/select-all checkbox column (Type, Location, Bill No, Bill Date, Bill Amt, DueAmt, editable PaidAmt and Discount inputs), live allocation calculations, auto-allocate button, secondary toolbar with currency filters (ALL, BDT, USD), search and print actions, payment history drawer, and an official printable Bill Payment Voucher document modal with multi-signature block.",
    "descriptionBn": "Payment মডিউলের অধীনে অফিশিয়াল 'Bill Payment' সেটেলমেন্ট কনসোল তৈরি করা হয়েছে: বামপাশে নীল বর্ডার সহ টপ পেমেন্ট ফর্ম কার্ড (Payment Mode, Payment Date, Supplier Name, Bank Account, Cheque No, Cheque Date, Amount, Remarks, SUBMIT বাটন, লাইভ PaidAmt ও Discount কাউন্টার এবং SHOW বাটন), ফিল্টার/সিলেক্ট-অল চেকবক্স কলাম সহ পেন্ডিং বিল গ্রিড (Type, Location, Bill No, Bill Date, Bill Amt, DueAmt, এডিটেবল PaidAmt ও Discount ইনপুট), লাইভ এলোকেশন ক্যালকুলেটর, অটো-এলোকেট ফিচার, কারেন্সি ফিল্টার (ALL, BDT, USD), সার্চ ও প্রিন্ট একশন, পেমেন্ট হিস্ট্রি ট্যাব এবং ৪-স্তর বিশিষ্ট সিগনেচার ব্লক সহ অফিশিয়াল প্রিন্টযোগ্য Bill Payment Voucher ডকুমেন্ট মোডাল।"
  },
  {
    "id": "428",
    "date": "2026-09-14T10:30",
    "type": "UI Enhancement",
    "module": "Procurement Module",
    "link": "/procurement-billing-vat-tax-register",
    "descriptionEn": "Redesigned the official 'Billing Information' document view modal in VAT and Tax Register to match the authentic ERP billing format. Features Pakiza Software company branding header with address, serif document title, bordered Bill No / Date / Supplier table, 3-row comprehensive metadata grid (PO/WO, PO Date, Currency, Exchange Rate, MRIR No, MRIR Date, Challan No, Challan Date, Advance Adjustment), itemized goods table with underlined headers and total quantity, attached multi-line financial summary (Total Amount, Discount, Others, VAT Inc, TAX Inc, Net Payable, Total Amount), spelled out 'In words' number-to-words line, comment field, and a 4-tier signature block (Prepared By, Vat and Tax Inputted By, Audited By, Approved By).",
    "descriptionBn": "VAT and Tax Register পেজের অফিশিয়াল 'Billing Information' ডকুমেন্ট ভিউ মোডালটি রিয়েল ERP ফরম্যাট অনুযায়ী রি-ডিজাইন করা হয়েছে। এতে রয়েছে ঠিকানা সহ Pakiza Software ব্রান্ডিং হেডার, সেরিফ ডকুমেন্ট টাইটেল, বর্ডার সহ Bill No/Date/Supplier টেবিল, ৩-সারি বিশিষ্ট মেটাডেটা গ্রিড (PO/WO, PO Date, Currency, Exchange Rate, MRIR No, MRIR Date, Challan No, Challan Date, Advance Adjustment), আন্ডারলাইন হেডার সহ আইটেম টেবিল ও টোটাল কোয়ান্টিটি, হরিজন্টাল ফিন্যান্সিয়াল সামারি (Total Amount, Discount, Others, VAT Inc, TAX Inc, Net Payable), কথায় টাকার পরিমাণ ('In words' number-to-words), কমেন্ট সেকশন এবং ৪-স্তর বিশিষ্ট সিগনেচার ব্লক (Prepared By, Vat and Tax Inputted By, Audited By, Approved By)।"
  },
  {
    "id": "427",
    "date": "2026-09-08T12:55",
    "type": "New Feature",
    "module": "Procurement",
    "link": "/procurement-billing-supplier-bill",
    "descriptionEn": "Merged 'Supplier Bill Record' and 'Supplier Bill Record List' into a unified 'Supplier Bill' page. Features advanced multi-filter search panel, expandable MRR detail rows, quick summary stats, and a smart Add New Supplier Bill form with live Total Bill Value and Bill Balance calculations plus an inline MRR Details entry table.",
    "descriptionBn": "'Supplier Bill Record' এবং 'Supplier Bill Record List' মেনু দুটিকে একটি একক 'Supplier Bill' পেজে একত্রিত করা হয়েছে। এই পেজে অ্যাডভান্সড মাল্টি-ফিল্টার সার্চ প্যানেল, এক্সপ্যান্ডেবল MRR ডিটেইল সারি, কুইক সামারি স্ট্যাটস এবং একটি স্মার্ট Add New Supplier Bill ফর্ম যুক্ত করা হয়েছে যেখানে লাইভ Total Bill Value ও Bill Balance ক্যালকুলেশন এবং ইনলাইন MRR Details এন্ট্রি টেবিল রয়েছে।"
  },
  {
    "id": "426",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-billing-prepare",
    "descriptionEn": "Updated the 'Prepare Bill' workspace under Billing module matching exact mockup specifications: top filter console (Location, Document, Supplier Name, SHOW button), 2-column split master-detail layout (Left: Pending PO & GRN List with PO NO, Attachment, ChNo, ChDate, GRNo, GRDate; Right: Prepare Bill form with Bill Number, Bill Date, Purchase Type, Currency, Exchange Rate, Is Loan), light-green itemized grid (ItemName, PurchaseQty, AcPrice, TotalPrice), financial summary (Total Amt, Discount, Other Amt, Advance Adjustment, Net Payable, G.Total), comments, and 3 action buttons (Adjustment, ATTACHMENT, SAVE).",
    "descriptionBn": "Billing মডিউলের 'Prepare Bill' পেজটি আপগ্রেড করা হয়েছে: টপ ফিল্টার বার (Location, Document, Supplier Name, SHOW বাটন), ২-কলাম স্প্লিট লেআউট (বাম পাশে: পেন্ডিং PO ও GRN লিস্ট - PO NO, Att, ChNo, ChDate, GRNo, GRDate; ডান পাশে: Prepare Bill ফর্ম - Bill Number, Bill Date, Purchase Type, Currency, Exchange Rate, Is Loan), হালকা সবুজ আইটেম টেবিল (ItemName, PurchaseQty, AcPrice, TotalPrice), ফিন্যান্সিয়াল সামারি (Total Amt, Discount, Other Amt, Advance Adjustment, Net Payable, G.Total) এবং ৩টি অ্যাকশন বাটন (Adjustment, ATTACHMENT, SAVE)।"
  },
  {
    "id": "425",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-billing-vat-tax-entry",
    "descriptionEn": "Created the smart 'VAT Tax Entry' console under Billing module featuring top filter bar (Date From/To, VAT Applicable, Supplier Name, SHOW & ATTACHMENT action buttons), master-detail 2-column split layout (Left: Unposted Bills Selection List with search; Right: Prepare Bill console), editable items table, real-time VAT & Tax live calculation engine (Payer, Type: Include/Exclude, %, Output), Net Payable & G.Total summary, comments field, and attachment viewer modal.",
    "descriptionBn": "Billing মডিউলের অধীনে স্মার্ট 'VAT Tax Entry' কনসোল তৈরি করা হয়েছে, যেখানে টপ ফিল্টার বার (Date From/To, VAT Applicable, Supplier Name, SHOW এবং ATTACHMENT বাটন), মাস্টার-ডিটেইল ২-কলাম স্প্লিট লেআউট (বাম পাশে: আনপোস্টেড বিল লিস্ট; ডান পাশে: বিল প্রিপেয়ার কনসোল), এডিটেবল আইটেমস টেবিল, রিয়েল-টাইম VAT ও TAX লাইভ ক্যালকুলেটর (Payer, Type: Include/Exclude, %, Output), Net Payable ও G.Total সামারি, কমেন্ট বক্স এবং এ্যাটাচমেন্ট ভিউয়ার মোডাল রয়েছে।"
  },
  {
    "id": "424",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-billing-vat-tax-register",
    "descriptionEn": "Created the new 'VAT and Tax Register' compliance registry page under Billing module with Date From/To, Bill No, Purchase Order No, VAT & Tax Posting Status (All, Post, Un-Post) radio selector, Supplier Name filter, Excel/Print/PDF export actions, exact table columns (SL, Action, Supplier Name, Bill No, Bill Date, Bill Type, Currency, Exchange Rate, Bill Value, Vat amount, Tax amount, Discount Amt, Net Payable, Status), 11 sample records, and interactive Billing Information document view modal (PO/WO, MRIR, Challan, Items, Totals, In Words, Comments, and 4-tier signature block).",
    "descriptionBn": "Billing মডিউলের অধীনে নতুন 'VAT and Tax Register' কমপ্লায়েন্স রেজিস্ট্রি পেজ তৈরি করা হয়েছে, যেখানে Date From/To, Bill No, Purchase Order No, VAT & Tax Posting Status (All, Post, Un-Post) রেডিও সিলেক্টর, Supplier Name ফিল্টার, Excel/Print/PDF এক্সপোর্ট, সঠিক টেবিল কলামসমূহ, ১১টি রিয়েল ডেটা রেকর্ড এবং অফিশিয়াল Billing Information ডকুমেন্ট ভিউ মোডাল (PO/WO, MRIR, Challan, আইটেমস, টোটাল, ইন ওয়ার্ডস, কমেন্ট এবং ৪-স্তর সিগনেচার ব্লক) রয়েছে।"
  },
  {
    "id": "423",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-billing-purchase-list",
    "descriptionEn": "Created the new 'Purchase List' registry page under Billing module featuring Date From/To, Location dropdown, Document search, Product Name query filters, Excel/Print/PDF export actions, exact table columns (View, Bill No, Bill Date, Supplier, Type, Currency, Rate), populated with 21+ purchase records, and interactive Bill Details Document View modal (#, Product, Unit, Quantity, Rate, Total, DC Price, LandedCost, Total Amt, Vat Amt, Tax Amt, Other Amt, Net Total, Discount, G.Total).",
    "descriptionBn": "Billing মডিউলের অধীনে নতুন 'Purchase List' রেজিস্ট্রি পেজ তৈরি করা হয়েছে, যেখানে Date From/To, Location, Document সার্চ, Product Name ফিল্টার, Excel/Print/PDF এক্সপোর্ট একশন, হুবহু টেবিল কলাম (View, Bill No, Bill Date, Supplier, Type, Currency, Rate), ২১+ টি পারচেজ ডেটা রেকর্ড এবং অফিশিয়াল বিল ডিটেইলস ডকুমেন্ট ভিউ মোডাল (#, Product, Unit, Quantity, Rate, Total, DC Price, LandedCost, Total Amt, Vat, Tax, Net Total, Discount, G.Total) রয়েছে।"
  },
  {
    "id": "422",
    "date": "2026-09-14T10:30",
    "type": "UI Enhancement",
    "module": "Procurement Module",
    "link": "/procurement-pi-list",
    "descriptionEn": "Redesigned the Proforma Invoice (PI) View modal to mirror the official Pakiza Knit Composite Ltd format with green company logo header, cyan document title, two-column metadata grid (PI No, LC No, Supplier, Shipment Terms, PI Validity, Currency, Port of Discharge/Loading, PI Date, LC Date, Shipment Date, PI Type, Product Type), detailed itemized grid (#, ReqNums, ProductName, OriginName, Description, Quantity, Rate, Total), Remarks section, and financial total breakdown (Total, Upcharge, Discount, Net Total) with 3-tier signature block.",
    "descriptionBn": "Proforma Invoice (PI) ভিউ মোডালটি অফিশিয়াল Pakiza Knit Composite Ltd ফরম্যাটে আপগ্রেড করা হয়েছে, যেখানে সবুজ লোগো হেডার, সাইয়ান ডক টাইটেল, ২-কলাম মেটাডেটা গ্রিড, বিস্তারিত আইটেম গ্রিড (#, ReqNums, ProductName, OriginName, Description, Quantity, Rate, Total), রিমার্কস সেকশন এবং হিসাবের সামারি (Total, Upcharge, Discount, Net Total) সহ ৩-স্তর বিশিষ্ট সিগনেচার ব্লক রয়েছে।"
  },
  {
    "id": "421",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-pi-list",
    "descriptionEn": "Built the executive 'PI List (Proforma Invoice)' registry page featuring PI Date range filters, Supplier Name dropdown, PI Number search, Excel/Print/PDF exports, and exact table columns (#, PINo, PIDate, LcNo, LcDate, ShipmentDate, Supplier, ProductType, Status) with interactive Proforma Invoice document viewer modal.",
    "descriptionBn": "এক্সিকিউটিভ 'PI List (Proforma Invoice)' রেজিস্ট্রি পেজ তৈরি করা হয়েছে, যেখানে PI ডেট ফিল্টার, সাপ্লাইয়ার ফিল্টার, PI নম্বর সার্চ, Excel/Print/PDF এক্সপোর্ট এবং হুবহু টেবিল কলামসমূহ (#, PINo, PIDate, LcNo, LcDate, ShipmentDate, Supplier, ProductType, Status) সহ অফিশিয়াল PI ডকুমেন্ট ভিউ মোডাল রয়েছে।"
  },
  {
    "id": "420",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-po-list",
    "descriptionEn": "Built the executive 'Purchase Order List' registry page with date range filters, status selector (Saved, Review Pending, Approved, Rejected), payment mode filter, exact table schema (SL, PO No, PO Date, Delivery To, Bill To, Type, Currency, Prepared By, Total Amount, ItemType, Status, Req.No, Payment Type), Excel/Print/PDF export options, and interactive document viewer modal.",
    "descriptionBn": "এক্সিকিউটিভ 'Purchase Order List' রেজিস্ট্রি পেজ তৈরি করা হয়েছে, যেখানে ডেট ফিল্টার, স্ট্যাটাস সিলেক্টর (Saved, Review Pending, Approved, Rejected), পেমেন্ট মোড ফিল্টার, সঠিক টেবিল কলামসমূহ, Excel/Print/PDF এক্সপোর্ট এবং অফিশিয়াল PO ডকুমেন্ট ভিউয়ার মোডাল রয়েছে।"
  },
  {
    "id": "419",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-po-new",
    "descriptionEn": "Updated the Create Purchase Order page to pull Terms & Conditions from system configuration. Added template preset selector, live clause search, interactive checklist, and custom term addition.",
    "descriptionBn": "Create Purchase Order পেজে Terms & Conditions কনফিগারেশন থেকে লোড করার সুবিধা যুক্ত করা হয়েছে। টেমপ্লেট সিলেক্টর, লাইভ সার্চ, চেকবাক্স লিস্ট এবং কাস্টম ক্লজ এড করার অপশন রাখা হয়েছে।"
  },
  {
    "id": "418",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-po-new",
    "descriptionEn": "Created the new 'Create Purchase Order' page featuring PO Details headers (Type, ItemType, Bill To, Delivery To, Addresses, Currency Rate, Job Description), PO Item Details adder console, editable Terms & Conditions, and financial summary calculation block (Total, Discount, VAT, TAX, Grand Total, Advance, Balance).",
    "descriptionBn": "নতুন 'Create Purchase Order' পেজ তৈরি করা হয়েছে, যেখানে PO হেডার তথ্য (Type, ItemType, Bill To, Delivery To, ঠিকানা, বিনিময় হার, জব ডিসক্রিপশন), আইটেম এডার কনসোল, কাস্টমাইজড Terms & Conditions এবং ফিন্যান্সিয়াল সামারি ক্যালকুলেটর (টোটাল, ডিসকাউন্ট, ভ্যাট, ট্যাক্স, গ্র্যান্ড টোটাল, এডভান্স, ব্যালেন্স) রয়েছে।"
  },
  {
    "id": "417",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Procurement Module",
    "link": "/procurement-po-requisition-wise",
    "descriptionEn": "Cleaned up UI layout on the Requisition Wise PO page by removing redundant section description paragraphs and helper subtitles for a minimal, uncluttered view.",
    "descriptionBn": "Requisition Wise PO পেজের সেকশনগুলোর অতিরিক্ত বর্ণনা ও সাবটাইটেল লেখাগুলো তুলে দিয়ে লেআউটটি আরও ক্লিন ও মিনিমাল করা হয়েছে।"
  },
  {
    "id": "416",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-po-requisition-wise",
    "descriptionEn": "Added an interactive Requisition Selection Modal triggered by a '+ Select / Browse Requisitions' button. Allows users to search, review estimated totals, batch select multiple requisitions, and proceed seamlessly.",
    "descriptionBn": "Requisition Wise PO পেজে '+ Select / Browse Requisitions' বাটন এবং একটি পপ-আপ মোডাল যুক্ত করা হয়েছে। মোডালের মাধ্যমে রিকুইজিশন সার্চ করে, আনুমানিক মূল্য ও আইটেম দেখে সহজেই একাধিক রিকুইজিশন সিলেক্ট করে প্রসেস করা যাবে।"
  },
  {
    "id": "415",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-po-requisition-wise",
    "descriptionEn": "Streamlined the Requisition Wise PO page by removing the redundant intermediate staged items table and introducing multi-requisition badge selection. Items from selected requisitions now automatically merge into a single unified workspace table.",
    "descriptionBn": "Requisition Wise PO পেজটি আরও সহজ করা হয়েছে। অতিরিক্ত স্টেজড আইটেম লিস্ট বাদ দেওয়া হয়েছে এবং একসাথে একাধিক রিকুইজিশন সিলেক্ট করার ব্যবস্থা যুক্ত করা হয়েছে। নির্বাচিত রিকুইজিশনের আইটেমগুলো সরাসরি একটি সিঙ্গেল ওয়ার্কস্পেস টেবিলে কম্বাইন হয়ে দেখা যাবে।"
  },
  {
    "id": "414",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Module",
    "link": "/procurement-po-requisition-wise",
    "descriptionEn": "Created the executive Requisition Wise Purchase Order (PO) generator page with PO general headers, requisition item staging console, smart Terms & Conditions template selector from configuration, real-time financial calculations, and local storage integration.",
    "descriptionBn": "Requisition Wise Purchase Order (PO) তৈরির নতুন পেজ তৈরি করা হয়েছে, যেখানে PO হেডার, রিকুইজিশন আইটেম লোডার, কনফিগারেশন থেকে স্মার্ট Terms & Conditions টেমপ্লেট সিলেক্টর, লাইভ হিসাব-নিকাশ এবং সেভ অপশন রয়েছে।"
  },
  {
    "id": "413",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-config-currency-rate",
    "descriptionEn": "Updated Procurement Configuration sub-menu list to strictly include: Currency Rate, Terms and Condition, Bank Info, and Bank Accounts. Removed unused menu items.",
    "descriptionBn": "Procurement Configuration সাব-মেনু তালিকা আপডেট করা হয়েছে যাতে শুধুমাত্র Currency Rate, Terms and Condition, Bank Info এবং Bank Accounts থাকে। বাকি অপ্রয়োজনীয় মেনুগুলো তুলে দেওয়া হয়েছে।"
  },
  {
    "id": "412",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-cs-create-workorder",
    "descriptionEn": "Simplified the Forward Purchase Order modal by removing unnecessary contact and remarks input boxes, and added an interactive live search bar to filter Terms & Conditions.",
    "descriptionBn": "Forward Purchase Order মোডাল থেকে অপ্রয়োজনীয় কন্টাক্ট ও রিমার্কস বক্স তুলে দেওয়া হয়েছে এবং Terms & Conditions সহজে ফিল্টার করার জন্য একটি লাইভ সার্চ সুবিধা যুক্ত করা হয়েছে।"
  },
  {
    "id": "411",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Procurement Module",
    "link": "/procurement-cs-create-workorder",
    "descriptionEn": "Redesigned the 'Forward Purchase Order' modal into an ultra-clean, minimalist, spacious layout (max-w-4xl). Removed heavy yellow alert containers and bright borders in favor of clean typography, neutral borders, and smooth spacing.",
    "descriptionBn": "'Forward Purchase Order' মোডালটি আরও বড় (max-w-4xl), অতি পরিষ্কার ও পরিচ্ছন্ন মিনিমালিস্ট ডিজাইনে রূপান্তর করা হয়েছে। ভারী হলুদ বক্স ও উজ্জ্বল কালার বাদ দিয়ে ক্লিন হেডার, নিউট্রাল বর্ডার ও পর্যাপ্ত স্পেসিং ব্যবহার করা হয়েছে।"
  },
  {
    "id": "410",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-cs-create-workorder",
    "descriptionEn": "Implemented Purchase Order (PO) Draft status workflow with a dedicated 'Forward Purchase Order' modal. Enables interactive selection, custom term addition, and processing of Terms & Conditions before forwarding POs to vendors and approval channels.",
    "descriptionBn": "Purchase Order (PO) লিস্টে ড্রাফট স্ট্যাটাস এবং 'Forward Purchase Order' মোডাল যুক্ত করা হয়েছে। ফরওয়ার্ড করার আগে প্রয়োজনীয় Terms & Conditions নির্বাচন ও কাস্টমাইজ করে প্রসেস করার সুবিধা দেওয়া হয়েছে।"
  },
  {
    "id": "409",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-cs-create-workorder",
    "descriptionEn": "Renamed 'CS Workorder List' sub-menu to 'CS PO List' and redesigned the Purchase Order console with an official executive Purchase Order (PO) document view modal featuring company headers, supplier/delivery details, watermark overlays, itemized quotation tables, financial summary blocks, terms & conditions, and printable layout.",
    "descriptionBn": "'CS Workorder List' সাব-মেনুর নাম পরিবর্তন করে 'CS PO List' করা হয়েছে এবং অফিশিয়াল Purchase Order (PO) ডকুমেন্ট ভিউ মোডাল যুক্ত করা হয়েছে যাতে কোম্পানি হেডার, সাপ্লাইয়ার ও ডেলিভারি তথ্য, ওয়াটারমার্ক, আইটেম টেবিল, সামারি ও প্রিন্ট অপশন রয়েছে।"
  },
  {
    "id": "408",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation Module",
    "link": "/separation-clearance-configuration",
    "descriptionEn": "Updated Clearance Configuration to feature HTML5 drag-and-drop layer reordering, a single top 'Add Layer' button, color-matched UI theme, and dual approver assignment modes (Default Role vs Searchable Specific Person). Removed unnecessary top sub-header tabs.",
    "descriptionBn": "Clearance Configuration-এ ড্র্যাগ এন্ড ড্রপ দিয়ে লেয়ারের সিরিয়াল পরিবর্তনের সুবিধা, একটি নির্দিষ্ট 'Add Layer' বাটন, ব্লু থিম ম্যাচিং এবং Default Role বা Searchable Person অ্যাসাইন করার ব্যবস্থা করা হয়েছে। অতিরিক্ত হেডার ট্যাব তুলে দেওয়া হয়েছে।"
  },
  {
    "id": "407",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation Module",
    "link": "/separation-clearance-configuration",
    "descriptionEn": "Refined Clearance Configuration into a clean table-based grid layout with columns for Layer Name, Assigned Approver Person, Remarks, and actions, integrated as a dedicated sub-menu under Separation in the sidebar.",
    "descriptionBn": "Clearance Configuration পেজটি একটি ক্লিন টেবিল গ্রিডে রূপান্তর করা হয়েছে যার কলামে রয়েছে Layer Name, Assigned Approver Person এবং Remarks, এবং সাইডবারে Separation-এর অধীনে একটি আলাদা সাব-মেনু হিসেবে যুক্ত করা হয়েছে।"
  },
  {
    "id": "406",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Separation Module",
    "link": "/separation-clearance-configuration",
    "descriptionEn": "Created Separation Clearance Configuration page (/separation-clearance-configuration) allowing dynamic multi-layer workflow creation ('Add More Layer' option), stage reordering, checklist item management, and searchable approver person selection for each layer.",
    "descriptionBn": "Separation Module-এ নতুন Clearance Configuration পেজ তৈরি করা হয়েছে, যেখানে ইচ্ছামতো লেয়ার তৈরি (Add More Option), সিকুয়েন্স পুনঃবিন্যাস, চেকলিস্ট আইটেম যুক্তকরণ এবং প্রতি লেয়ারে নির্দিষ্ট অনুমোদনকারী ব্যক্তি (Approver Person) সিলেক্ট করা যায়।"
  },
  {
    "id": "405",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-cs-batch-list",
    "descriptionEn": "Enhanced Create CS Wizard with searchable multi-select requisitions in Step 1 (auto-combining items) and searchable candidate vendor selection in Step 2.",
    "descriptionBn": "Create CS Wizard-এর Step 1-এ সার্চ অপশন সহ একাধিক রিকুইজিশন সিলেক্ট (আইটেম কম্বাইন) এবং Step 2-এ সার্চ অপশন সহ ভেন্ডর সিলেক্ট করার সুবিধা দেওয়া হয়েছে।"
  },
  {
    "id": "404",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Procurement Module",
    "link": "/procurement-cs-detail?id=CS-2026-YRN4",
    "descriptionEn": "Added an 'Are you sure?' confirmation modal with a vendor PO breakdown summary when clicking the Finalize CS button.",
    "descriptionBn": "Finalize CS বাটনে ক্লিক করলে ভেন্ডর ভিত্তিক PO সামারি সহ একটি প্রফেশনাল 'Are you sure?' কনফার্মেশন মোডাল যুক্ত করা হয়েছে।"
  },
  {
    "id": "403",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-cs-detail?id=CS-2026-YRN4",
    "descriptionEn": "Created dedicated full-page CS Detail route (/procurement-cs-detail) with sticky item columns, horizontal vendor scrolling, clean cell color highlighting, fully visible vendor names, and searchable vendor selectors.",
    "descriptionBn": "নূতন ডেডিকেটেড ফুল-পেজ CS Detail পেজ (/procurement-cs-detail) তৈরি করা হয়েছে যাতে আইটেম কলাম স্টিকি ফিক্সড থাকে, ভেন্ডর কলাম সাইডে স্ক্রোল হয়, কম দামের সেল ডিরেক্ট কালার হাইলাইট হয় এবং ভেন্ডর নেম সার্চেবল থাকে।"
  },
  {
    "id": "402",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Procurement Module",
    "link": "/procurement-cs-batch-list",
    "descriptionEn": "Redesigned the CS Comparison Matrix into an ultra-compact, high-density Excel-style grid layout with tight cell padding, inline lowest price chips, and slim header bars.",
    "descriptionBn": "CS Comparison Matrix-কে এক্সেল শিট গ্রিডের মতো অত্যন্ত কম্প্যাক্ট ও টাইট প্যাডিং দেওয়া হয়েছে যাতে এক নজরে অনেকগুলো আইটেমের ডাটা দেখা যায়।"
  },
  {
    "id": "401",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Procurement Module",
    "link": "/procurement-cs-batch-list",
    "descriptionEn": "Replaced text buttons in the CS table Actions column with sleek single icon buttons to prevent text wrapping and fix row height expansion.",
    "descriptionBn": "CS টেবিলের Actions কলামের টেক্সট বাটন তুলে একটি ক্লিন আইকন বাটন দেওয়া হয়েছে যাতে টেক্সট ভেঙে না যায় এবং রো হাইট ঠিক থাকে।"
  },
  {
    "id": "400",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Procurement Module",
    "link": "/procurement-cs-batch-list",
    "descriptionEn": "Polished the Comparison Sheet Matrix & Wizard UI into an executive clean view, incorporating 15+ real-world procurement items, sticky matrix headers, sleek green highlight pills, and refined vendor select controls.",
    "descriptionBn": "Comparison Sheet Matrix ও Wizard-এর ডিজাইন আধুনিক ও প্রফেশনাল করা হয়েছে, যার মধ্যে রয়েছে ১৫+ আইটেম টেস্ট ডেটাসেট, স্টিকি টেবিল হেডার, গ্রিন হাইলাইট পিল এবং ভেন্ডর সিলেক্ট কন্ট্রোল।"
  },
  {
    "id": "399",
    "date": "2026-09-14T10:30",
    "type": "Business Logic",
    "module": "Procurement Module",
    "link": "/procurement-cs-batch-list",
    "descriptionEn": "Implemented full CS Creation Wizard (Requisition auto item loading & side-by-side vendor quotes) and Comparison Matrix with green lowest-price highlights, item-wise vendor selectors, and auto PO generation.",
    "descriptionBn": "সম্পূর্ণ CS তৈরি Wizard (রিকুইজিশন আইটেম অটো-লোড ও সাইড-বাই-সাইড ভেন্ডর দরপত্র) এবং সবচেয়ে কম দাম গ্রিন হাইলাইট, আইটেমভিত্তিক ভেন্ডর নির্বাচন ও অটো PO জেনারেশন সুবিধা যুক্ত করা হয়েছে।"
  },
  {
    "id": "398",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Procurement Module",
    "link": "/procurement-cs-batch-list",
    "descriptionEn": "Restructured the Comparison Sheet submenus in the Procurement module into two clean sections: 'CS List' (with a top button to create a new CS) and 'CS Workorder List'.",
    "descriptionBn": "প্রোকিউরমেন্ট মডিউলের Comparison Sheet সাবমেনু দুটি সুনির্দিষ্ট অংশে পুনর্গঠন করা হয়েছে: 'CS List' (নতুন CS তৈরির বাটন সহ) এবং 'CS Workorder List'।"
  },
  {
    "id": "397",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Personnel Info",
    "link": "/employee-doc-issue",
    "descriptionEn": "Replaced the Status pill buttons on the Employee Doc Issue page (/employee-doc-issue) with a sleek filter dropdown containing 'All Issues', 'Pending', and 'Action Taken' options.",
    "descriptionBn": "Employee Doc Issue (/employee-doc-issue) পেজের স্ট্যাটাস বাটন ফিল্টার পরিবর্তন করে 'All Issues', 'Pending' এবং 'Action Taken' অপশন সম্বলিত ফিল্টার ড্রপডাউন যুক্ত করা হয়েছে।"
  },
  {
    "id": "396",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Personnel Info",
    "link": "/employee-doc-issue",
    "descriptionEn": "Added an 'SL' (Serial) column to the Employee Doc Issue table (/employee-doc-issue) for better row tracking.",
    "descriptionBn": "Employee Doc Issue (/employee-doc-issue) পেজের টেবিলে ট্র্যাকিং সুবিধার জন্য 'SL' (সিরিয়াল) কলাম যুক্ত করা হয়েছে।"
  },
  {
    "id": "395",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Personnel Info",
    "link": "/employee-doc-issue",
    "descriptionEn": "Kept the Status and Action column texts in one line for the Employee Doc Issue table (/employee-doc-issue) to prevent text wrapping and improve layout readability.",
    "descriptionBn": "Employee Doc Issue (/employee-doc-issue) পেজের টেবিলের Status এবং Action কলামের টেক্সটগুলোকে এক লাইনে রাখা হয়েছে যাতে লেআউট সুন্দর দেখায় এবং লাইন ভেঙে না যায়।"
  },
  {
    "id": "394",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Personnel Info",
    "link": "/employee-doc-issue",
    "descriptionEn": "Removed top metric summary cards (Total Flagged Issues, Action Required, Pending Verification) from the Employee Doc Issue page (/employee-doc-issue) per user request.",
    "descriptionBn": "ইউজার রিকুয়েস্ট অনুযায়ী Employee Doc Issue পেজ (/employee-doc-issue) থেকে উপরের মেট্রিক সামারি কার্ডসমূহ (Total Flagged Issues, Action Required, Pending Verification) রিমুভ করা হয়েছে।"
  },
  {
    "id": "393",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Personnel Info",
    "link": "/employee-doc-issue",
    "descriptionEn": "Refined Employee Doc Issue (/employee-doc-issue) table & modal UI: removed card container box from Issue Feedback column to show plain text, updated Document Details column to display clickable document title text opening a detail modal without showing raw filenames, and redesigned the Re-Upload Document Modal to be minimal and professional.",
    "descriptionBn": "Employee Doc Issue (/employee-doc-issue) পেজের টেবিল ও মোডাল রিফাইন করা হয়েছে: ফিডব্যাক কলাম থেকে কার্ড বক্স তুলে প্লেন টেক্সট দেওয়া হয়েছে, ফাইলনেম হাইড করে ডক্যুমেন্ট টেক্সট ক্লিকেবল লিংকে রূপান্তর করা হয়েছে এবং রি-আপলোড মোডাল মিনিমাল ও প্রফেশনাল করা হয়েছে।"
  },
  {
    "id": "392",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Personnel Info",
    "link": "/employee-doc-issue",
    "descriptionEn": "Updated Employee Doc Issue (/employee-doc-issue) layout: removed image/scan preview components and converted the issue list into a structured, responsive Data Table view with columns for Employee Info, Document Details, HR Feedback, Status, and Upload Actions.",
    "descriptionBn": "Employee Doc Issue (/employee-doc-issue) পেজের লেআউট আপডেট করা হয়েছে: ইমেজ স্ক্যান প্রাকদর্শন রিমুভ করে সম্পূর্ণ ইস্যু লিস্টটিকে টেবিল ভিউতে রূপান্তর করা হয়েছে।"
  },
  {
    "id": "391",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Personnel Info",
    "link": "/employee-doc-issue",
    "descriptionEn": "Added new 'Employee Doc Issue' submenu under Personnel Info in Sidebar & Topbar navigation. Flagged document issues raised in Employee Doc Verification (/employee-doc-verification) are now routed directly here, where employees and HR can review compliance feedback, inspect flagged scans, and re-upload revised documents.",
    "descriptionBn": "Personnel Info মেনুর অধীনে নতুন 'Employee Doc Issue' সাবমেনু এবং পেজ যুক্ত করা হয়েছে। Employee Doc Verification পেজে কোনো ডক্যুমেন্টে ইস্যু রেইজ করা হলে তা সরাসরি এই পেজে আসবে, যেখানে ইউজার কারণ দেখে সংশোধিত ডক্যুমেন্ট পুনরায় আপলোড করতে পারবেন।"
  },
  {
    "id": "390",
    "date": "2026-09-14T10:30",
    "type": "UI Navigation",
    "module": "Personnel Info",
    "link": "/disciplinary-lefty",
    "descriptionEn": "Moved 'Lefty' menu item from Disciplinary Action to Personnel Info parent menu in both Sidebar and Topbar navigation.",
    "descriptionBn": "সাইডবার এবং টপবার নেভিগেশনে 'Lefty' মেনুটি Disciplinary Action থেকে সরিয়ে Personnel Info এর অধীনে স্থানান্তরিত করা হয়েছে।"
  },
  {
    "id": "389",
    "date": "2026-09-14T10:30",
    "type": "UI Navigation",
    "module": "Disciplinary Action",
    "link": "/disciplinary-showcause-notices",
    "descriptionEn": "Reordered Disciplinary Action sub-menu items to sequential workflow order: 1. Show Cause Notices, 2. Warning Letters, 3. Case Files, 4. Lefty.",
    "descriptionBn": "Disciplinary Action মেনুর সাব-আইটেমগুলো নতুন সিকোয়েন্সে সাজানো হয়েছে: ১. Show Cause Notices, ২. Warning Letters, ৩. Case Files, এবং ৪. Lefty।"
  },
  {
    "id": "388",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Disciplinary Action",
    "link": "/disciplinary-lefty",
    "descriptionEn": "Simplified Lefty Management table UI: Employee Info column now shows only Name & ID; stage badges renamed to 'Stage 1', 'Stage 2', 'Stage 3'; and salary mode badge updated to 'Cash'.",
    "descriptionBn": "Lefty Management টেবিলের লেআউট সহজ করা হয়েছে: Employee Info কলামে শুধুমাত্র Name ও ID রাখা হয়েছে (অফিসিয়াল আইডি ও পদবী রিমুভ করা হয়েছে); স্টেজ ব্যাজসমূহ কেবল 'Stage 1', 'Stage 2', 'Stage 3' এ পরিবর্তন করা হয়েছে এবং স্যালারি মোড লেবেল 'Cash' এ রিনেম করা হয়েছে।"
  },
  {
    "id": "387",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Disciplinary Action",
    "link": "/disciplinary-lefty",
    "descriptionEn": "Cleaned up UI on Lefty Management page (/disciplinary-lefty) by removing top policy guidelines banner per user request.",
    "descriptionBn": "ইউজার রিকুয়েস্ট অনুযায়ী Lefty Management পেজ (/disciplinary-lefty) থেকে উপরের পলিসি নির্দেশিকা ব্যানার রিমুভ করা হয়েছে।"
  },
  {
    "id": "386",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Disciplinary Action",
    "link": "/disciplinary-lefty",
    "descriptionEn": "Added new 'Lefty' menu under Disciplinary Action (/disciplinary-lefty) to track unauthorized absences. Enforces policy: 10 days absent without notice marks employee as Lefty, generates 1st Notice, and converts salary 100% to Cash; +10 days generates 2nd Notice; +7 days generates Final Discharge Notice.",
    "descriptionBn": "Disciplinary Action এর অধীনে নতুন 'Lefty' মেনু (/disciplinary-lefty) যুক্ত করা হয়েছে। অগোচরে ১০ দিন অনুপস্থিত থাকলে কর্মী Lefty চিহ্নিত হবে, ১ম নোটিশ পত্র ইস্যু হবে এবং বেতন ১০০% ক্যাশে রুপান্তর হবে; আরও ১০ দিন পর ২য় নোটিশ এবং আরও ৭ দিন পর চূড়ান্ত বরখাস্তপত্র ইস্যু করার সম্পূর্ণ লজিক ও প্রিন্ট সুবিধা যুক্ত করা হয়েছে।"
  },
  {
    "id": "385",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Self-Service (SSP)",
    "link": "/ssp-iou-requisition",
    "descriptionEn": "Built complete modern 'Cash & IOU Requisition Entry' module (/ssp-iou-requisition) matching Pakiza ERP schema (Requisition Master parameters, Requisition Details line items table, custom purpose modal, auto Taka in-words generator) with 'On Behalf Of' employee selection support.",
    "descriptionBn": "Pakiza ERP স্কিমা অনুযায়ী ক্যাশ ও IOU রিকুইজিশন এন্ট্রি মডিউল (/ssp-iou-requisition) সম্পূর্ণ আধুনিক ডিজাইনে তৈরি করা হয়েছে, যেখানে অন্যান্য সহকর্মীদের পক্ষে আবেদন করার জন্য 'On Behalf Of' অপশন যুক্ত করা হয়েছে।"
  },
  {
    "id": "384",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Payroll",
    "link": "/payroll-bonus-submit",
    "descriptionEn": "Redesigned all 6 Bonus Submit and Check Bonus pages to match Pakiza ERP schema (Join Date, Basic, Gross, Default%, Req%, Bonus Amount, Bank Bonus, Misc. Bonus, Notes, Unit, Line, Account No, Bank Name, EXCEL/PRINT/PDF buttons, and exact ERP layout).",
    "descriptionBn": "Bonus Submit এবং ৫টি Check Bonus পেজসমূহকে Pakiza ERP স্কিমা এবং লেআউট (Join Date, Basic, Gross, Default%, Req%, Bonus Amount, Bank Bonus, Misc. Bonus, Notes, Unit, Line, Account No, Bank Name, EXCEL/PRINT/PDF বাটন) অনুযায়ী পুনর্গঠন করা হয়েছে।"
  },
  {
    "id": "383",
    "date": "2026-09-14T10:30",
    "type": "UI Layout Optimization",
    "module": "Payroll",
    "link": "/payroll-salary-submit",
    "descriptionEn": "Grouped all salary submit and checking menus under a parent 'Salary Submission' sub-menu in Payroll -> Salary Process, featuring Salary Submit, Check Salary, Check Salary Vat/Tax, Check Salary Audit, Check Salary Plant Head, and the new Check Salary Accounts (/payroll-check-salary-accounts).",
    "descriptionBn": "Payroll -> Salary Process এর অধীনে 'Salary Submission' প্যারেন্ট সাব-মেনু তৈরি করে Salary Submit, Check Salary, Check Salary Vat/Tax, Check Salary Audit, Check Salary Plant Head এবং নতুন Check Salary Accounts পেজসমূহ সংগঠিত করা হয়েছে।"
  },
  {
    "id": "382",
    "date": "2026-09-14T10:30",
    "type": "New Sub-Menus",
    "module": "Payroll",
    "link": "/payroll-check-bonus",
    "descriptionEn": "Created 5 Check Bonus sub-menu pages under Payroll -> Salary Process -> Bonus Submission: Check Bonus (/payroll-check-bonus), Check Bonus Vat/Tax (/payroll-check-bonus-vattax), Check Bonus Audit (/payroll-check-bonus-audit), Check Bonus Plant Head (/payroll-check-bonus-planthead with APPROVE button), and Check Bonus Accounts (/payroll-check-bonus-accounts).",
    "descriptionBn": "Payroll -> Salary Process -> Bonus Submission এর অধীনে ৫টি চেক বোনাস পেজ তৈরি করা হয়েছে: Check Bonus, Check Bonus Vat/Tax, Check Bonus Audit, Check Bonus Plant Head (যেখানে APPROVE বাটন বিদ্যমান) এবং Check Bonus Accounts।"
  },
  {
    "id": "381",
    "date": "2026-09-14T10:30",
    "type": "New Sub-Menu",
    "module": "Payroll",
    "link": "/payroll-bonus-submit",
    "descriptionEn": "Added 'Bonus Submission' -> 'Bonus Submit' (/payroll-bonus-submit) under Payroll -> Salary Process for monthly and festival bonus submission with attendance log search and CSV export.",
    "descriptionBn": "Payroll -> Salary Process এর অধীনে 'Bonus Submission' -> 'Bonus Submit' (/payroll-bonus-submit) সাব-মেনু যুক্ত করা হয়েছে, যার মাধ্যমে ফেস্টিভ্যাল ও মান্থলি বোনাস সাবমিট, রিভিউ এবং এক্সপোর্ট করা সম্ভব।"
  },
  {
    "id": "380",
    "date": "2026-09-14T10:30",
    "type": "New Sub-Menus",
    "module": "Payroll",
    "link": "/payroll-check-salary-vattax",
    "descriptionEn": "Added 3 new Salary Check sub-menus under Payroll -> Salary Process: 'Check Salary Vat/Tax' (/payroll-check-salary-vattax), 'Check Salary Audit' (/payroll-check-salary-audit), and 'Check Salary Plant Head' (/payroll-check-salary-planthead) featuring REVIEW and APPROVE controls.",
    "descriptionBn": "Payroll -> Salary Process এর অধীনে ৩টি নতুন সাব-মেনু যুক্ত করা হয়েছে: 'Check Salary Vat/Tax', 'Check Salary Audit' এবং 'Check Salary Plant Head' (যেখানে Submit এর বদলে 'APPROVE' বাটন সংযুক্ত করা হয়েছে)।"
  },
  {
    "id": "379",
    "date": "2026-09-14T10:30",
    "type": "New Sub-Menu",
    "module": "Payroll",
    "link": "/payroll-check-salary",
    "descriptionEn": "Added 'Check Salary' sub-menu under Payroll -> Salary Process (/payroll-check-salary) featuring dual action buttons ('REVIEW' and 'SUBMIT') for both bulk and row-level salary verification.",
    "descriptionBn": "Payroll -> Salary Process এর অধীনে 'Check Salary' (/payroll-check-salary) সাব-মেনু যুক্ত করা হয়েছে; এতে যৌথভাবে বাল্ক ও ইন্ডিভিজুয়াল 'REVIEW' এবং 'SUBMIT' বাটনের সাহায্যে স্যালারি যাচাই করার ব্যবস্থা করা হয়েছে।"
  },
  {
    "id": "378",
    "date": "2026-09-14T10:30",
    "type": "UI Layout Optimization",
    "module": "Payroll",
    "link": "/payroll-salary-submit",
    "descriptionEn": "Redesigned Employee Attendance Details popup (/payroll-salary-submit) into a clean, spacious 5XL modal focusing purely on 31-day Date & Punch Log table with high visibility.",
    "descriptionBn": "Salary Submit (/payroll-salary-submit) পেজের এটেন্ডেন্স পপআপটি clutter সরিয়ে আরও বড় ও পরিষ্কার ৫XL লেআউটে সাজানো হয়েছে, যেখানে সরাসরি ৩১ দিনের ইন/আউট সময় ও স্ট্যাটাস স্পষ্ট দেখা যাবে।"
  },
  {
    "id": "377",
    "date": "2026-09-14T10:30",
    "type": "Feature Enhancement",
    "module": "Payroll",
    "link": "/payroll-salary-submit",
    "descriptionEn": "Added Employee Attendance & Monthly Job Card popup modal to Salary Submit page (/payroll-salary-submit) triggered upon clicking the row search button or searching by Employee ID.",
    "descriptionBn": "Salary Submit (/payroll-salary-submit) পেজে প্রতিটি এমপ্লয়ির সার্চ বাটনে বা আইডি ফিল্টারে ক্লিক করলে উক্ত কর্মীর বিস্তারিত উপস্থিতি (Present, Late, Absent, Leave, In/Out time log) দেখানোর এটেন্ডেন্স পপআপ যুক্ত করা হয়েছে।"
  },
  {
    "id": "376",
    "date": "2026-09-14T10:30",
    "type": "Filter & Export Update",
    "module": "Payroll",
    "link": "/payroll-salary-submit",
    "descriptionEn": "Added Status filter ('ALL', 'Submitted Only', 'Not Submitted (Draft)') to Salary Submit page (/payroll-salary-submit) along with dynamic CSV file export functionality for filtered salary records.",
    "descriptionBn": "Salary Submit (/payroll-salary-submit) পেজে 'Status' ফিল্টার ('ALL', 'Submitted Only', 'Not Submitted (Draft)') এবং ফিল্টারকৃত ডাটা সরাসরি CSV ফরমেটে ফাইল এক্সপোর্ট বা ডাউনলোড করার ফিচার যুক্ত করা হয়েছে।"
  },
  {
    "id": "375",
    "date": "2026-09-14T10:30",
    "type": "UI Refinement",
    "module": "Payroll",
    "link": "/payroll-salary-submit",
    "descriptionEn": "Refined Salary Submit page (/payroll-salary-submit) to use clean, high-density enterprise grid borders, compact form controls, and crisp non-rounded table cards for an executive HR layout.",
    "descriptionBn": "Salary Submit (/payroll-salary-submit) পেজের গোল ও অতিরিক্ত রাউন্ডেড ডিজাইন পরিবর্তন করে উচ্চ-ঘনত্বের এন্টারপ্রাইজ বর্ডার, নিখুঁত টেবিল গ্রিড এবং সার্প প্রফেশনাল কন্ট্রোল দিয়ে নতুনভাবে সাজানো হয়েছে।"
  },
  {
    "id": "374",
    "date": "2026-09-14T10:30",
    "type": "New Sub-Menu",
    "module": "Payroll",
    "link": "/payroll-salary-submit",
    "descriptionEn": "Added 'Salary Submit' sub-menu under Payroll -> Salary Process (/payroll-salary-submit) featuring monthly salary data loading (Year, Month, Employee Type, Department filters), employee feedback & review comments, and bulk salary submission & export functionality.",
    "descriptionBn": "Payroll -> Salary Process মেনুর অধীনে 'Salary Submit' (/payroll-salary-submit) সাব-মেনু যুক্ত করা হয়েছে; এতে ফিল্টার সিলেক্ট করে ডাটা লোড করা, এমপ্লয়ি ফিডব্যাক ও রিভিউ কমেন্ট সম্পাদন, এবং সিলেক্ট করে একসাথে স্যালারি সাবমিট করার সুবিধা অন্তর্ভুক্ত করা হয়েছে।"
  },
  {
    "id": "373",
    "date": "2026-09-14T10:30",
    "type": "UI Redesign",
    "module": "KPI Performance",
    "link": "/kpi-dashboard",
    "descriptionEn": "Redesigned KPI Performance Dashboard (/kpi-dashboard) into an executive analytics dashboard with live KPI metrics, Grade Band distribution charts, multi-layer approval pipeline funnel, department performance matrix, top performers wall, and searchable appraisal register.",
    "descriptionBn": "KPI Performance Dashboard (/kpi-dashboard) পেজটিকে এক্সিকিউটিভ অ্যানালিটিক্স ড্যাশবোর্ডে নতুনভাবে রূপান্তর করা হয়েছে; এতে লাইভ কেজিআই মেট্রিক্স, গ্রেড ডিস্ট্রিবিউশন বার চার্ট, মাল্টি-লেয়ার অ্যাপ্রুভাল পাইপলাইন, ডিপার্টমেন্ট পারফরম্যান্স ম্যাট্রিক্স এবং সার্চযোগ্য অ্যাপ্রাইজাল রেজিস্টার যুক্ত করা হয়েছে।"
  },
  {
    "id": "372",
    "date": "2026-09-14T10:30",
    "type": "Print Layout Update",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Configured print media page break rule starting from 'Recommendation By HRD' in Assesment Final Report (/kpi-final-report) so HRD recommendations and signature blocks print cleanly on Page 2.",
    "descriptionBn": "Assesment Final Report (/kpi-final-report) পেজে প্রিন্ট অপশনে 'Recommendation By HRD' অংশ থেকে পরবর্তী সকল সেকশন পেজ ২ (২য় পৃষ্ঠা)-এ প্রিন্ট হওয়ার নিয়ম যুক্ত করা হয়েছে।"
  },
  {
    "id": "371",
    "date": "2026-09-14T10:30",
    "type": "Calculation Fix",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Corrected Average Assessment Point calculation in Assesment Final Report (/kpi-final-report) to dynamically calculate Total Mark (softwareScore + hodJobScore + hodOtherScore + hrdOtherScore - showcaseDeduction) and auto-assign Grade Band with 100% mathematical accuracy.",
    "descriptionBn": "Assesment Final Report (/kpi-final-report) পেজের Average Assessment Point সেকশনে Total Mark এবং Grade হিসাবকে (Software Auto + HOD Job + HOD Others + HRD Others - Show Case Deduction) শতভাগ নির্ভুল ও ডায়নামিক করা হয়েছে।"
  },
  {
    "id": "370",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Identified top 3 criteria (Attendance, Target Achievement, Job Knowledge) with [System Auto Generated] badges in Assesment Final Report (/kpi-final-report) and merged their score cells across HOD and HRD columns into single auto-generation blocks.",
    "descriptionBn": "Assesment Final Report (/kpi-final-report) পেজের প্রথম ৩টি ক্রাইটেরিয়াকে [System Auto Generated] হিসেবে আইডেন্টিফাই করা হয়েছে এবং তাদের স্কোর সেল মার্জ করে সফটওয়্যার অটো-জেনারেটেড ব্লকে রূপান্তর করা হয়েছে।"
  },
  {
    "id": "369",
    "date": "2026-09-14T10:30",
    "type": "UI Fix",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Refined Assessment Gradings table formatting in Assesment Final Report (/kpi-final-report) with clean padding, proper character spacing for '< 50', and fixed text typos across recommendation tables.",
    "descriptionBn": "Assesment Final Report (/kpi-final-report) পেজের Assessment Gradings টেবিলের প্যাডিং, স্পেসিং এবং টাইপো সংশোধন করা হয়েছে।"
  },
  {
    "id": "368",
    "date": "2026-09-14T10:30",
    "type": "Typography Update",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Enforced Times New Roman font across all numbers, dates, IDs, scores, currency amounts, and text elements in Assesment Final Report (/kpi-final-report) to ensure 100% font consistency.",
    "descriptionBn": "Assesment Final Report (/kpi-final-report) পেজের সকল সংখ্যা, তারিখ, আইডি, স্কোর ও টেক্সট এলিমেন্টে শতভাগ Times New Roman ফন্ট প্রয়োগ করা হয়েছে।"
  },
  {
    "id": "367",
    "date": "2026-09-14T10:30",
    "type": "UI Fix",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Fixed Assessment Criteria table cell alignment in Assesment Final Report (/kpi-final-report) by removing merged colSpan cells on top rows to align all 4 sub-columns (HOD Max, HOD Given Score, HRD Max, HRD Given Score) with 100% precision.",
    "descriptionBn": "Assesment Final Report (/kpi-final-report) পেজের টেবিলের প্রথম ৩টি সারির মার্জ করা সেল সরিয়ে সকল সারির ৪টি সাব-কলাম (HOD Max, HOD Given, HRD Max, HRD Given) সঠিকভাবে সারিবদ্ধ করা হয়েছে।"
  },
  {
    "id": "366",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Clarified KPI Assessment Criteria table header in Assesment Final Report (/kpi-final-report) by adding explicit sub-column headers 'Max' and 'Given Score' under Department Head (HOD) and Human Resources (HRD).",
    "descriptionBn": "Assesment Final Report (/kpi-final-report) পেজের টেবিলে HOD ও HRD কলামকে স্পষ্ট করতে 'Max' (সর্বোচ্চ নম্বর) এবং 'Given Score' (প্রাপ্ত নম্বর) শিরোনাম সাব-কলাম আকারে আলাদা করে দেখানো হয়েছে।"
  },
  {
    "id": "365",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Refined Assesment Final Report (/kpi-final-report) layout strictly to A4 page dimensions (210mm x 297mm) with Times New Roman font typography, employee photo box, company logo emblem, crisp high-contrast tables, and A4 PDF print optimization.",
    "descriptionBn": "Assesment Final Report (/kpi-final-report) পেজের লেআউট Times New Roman ফন্ট, কোম্পানির লোগো, ইমপ্লয়ির ছবি এবং সুনির্দিষ্ট A4 সাইজ (210mm x 297mm) ফরমেটে আপডেট করা হয়েছে।"
  },
  {
    "id": "364",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "KPI Performance",
    "link": "/kpi-final-report",
    "descriptionEn": "Created 'Assesment Final Report' (/kpi-final-report) under KPI Performance featuring employee register list view and official print-ready 'Employee Performance Evaluation & Appraisal Form'.",
    "descriptionBn": "KPI Performance মেনুর অধীনে 'Assesment Final Report' (/kpi-final-report) পেজ যুক্ত করা হয়েছে, যাতে ইমপ্লয়ি তালিকা এবং অফিসিয়াল প্রিন্ট-রেডি 'Employee Performance Evaluation & Appraisal Form' রিপোর্ট অন্তর্ভুক্ত রয়েছে।"
  },
  {
    "id": "363",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "HR Approvals",
    "link": "/kpi-approval",
    "descriptionEn": "Enhanced KPI Approval (/kpi-approval) with multi-layer approval support (HRD, Plant Head, MD). Higher approval layers keep top evaluation form active while locking HOD Assessment, HOD Evaluation, HR Evaluation, and Employee Info as view-only.",
    "descriptionBn": "KPI Approval (/kpi-approval) পেজে মাল্টি-লেয়ার এপ্রুভাল (HRD, Plant Head, MD) যুক্ত করা হয়েছে। পরবর্তী এপ্রুভাল লেয়ারে শুধুমাত্র উপরের ফর্ম কন্ট্রোল পার্ট আপডেট করা যাবে এবং বাকি HOD/HR মূল্যায়ন প্যানেল ও Employee Info ভিউ-অনলি থাকবে।"
  },
  {
    "id": "362",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "HR Approvals",
    "link": "/kpi-approval",
    "descriptionEn": "Created 'KPI Approval' (/kpi-approval) sub-menu under HR Approvals featuring a list view of pending approvals and HRD Final Evaluation screen matching HOD Assessment criteria, HOD & HR Evaluation key-value panels, and Employee Info card.",
    "descriptionBn": "HR Approvals মেনুর অধীনে 'KPI Approval' (/kpi-approval) নামের নতুন সাব-মেনু যুক্ত করা হয়েছে, যাতে পেন্ডিং এপ্রুভাল লিস্ট ভিউ এবং HOD Assessment, HOD & HR Evaluation ও Employee Info সহ সম্পূর্ণ HRD ফাইনাল মূল্যায়ন স্ক্রিন অন্তর্ভুক্ত রয়েছে।"
  },
  {
    "id": "361",
    "date": "2026-09-14T10:30",
    "type": "UI Improvement",
    "module": "Approvals",
    "link": "/pending-approvals",
    "descriptionEn": "Updated sub-menu label and route header to 'All Pending Approval List' (/pending-approvals) under Approvals menu.",
    "descriptionBn": "Approvals মেনুর অধীনে থাকা সাব-মেনু ও পেজের নাম পরিবর্তন করে 'All Pending Approval List' করা হয়েছে।"
  },
  {
    "id": "360",
    "date": "2026-09-14T10:30",
    "type": "UI Improvement",
    "module": "Approvals",
    "link": "/pending-approvals",
    "descriptionEn": "Simplified Pending Approvals (/pending-approvals) to a clean, minimal list focusing on requisition title, employee, current approval stage (e.g. Stage 2/3), and pending approver name.",
    "descriptionBn": "Pending Approvals (/pending-approvals) পেজটি সহজ ও ক্লিন করা হয়েছে যাতে সহজেই রিকুইজিশন তালিকা, বর্তমান স্টেজ (যেমন Stage 2/3) এবং কার টেবিলে পেন্ডিং আছে তা দেখা যায়।"
  },
  {
    "id": "359",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Approvals",
    "link": "/pending-approvals",
    "descriptionEn": "Added a new sub-menu and route 'Pending Approvals' (/pending-approvals) under Approvals consolidating all pending requisitions with smart 'Pending to whom' approver tracking, approval chain steppers, and reminder nudges.",
    "descriptionBn": "Approvals মেনুর অধীনে 'Pending Approvals' (/pending-approvals) নামের নতুন সাব-মেনু ও পেজ যুক্ত করা হয়েছে, যেখানে প্রতিষ্ঠানের সকল পেন্ডিং রিকুইজিশন এবং তা কার টেবিলে পেন্ডিং আছে ('Pending to whom!') তা স্পষ্টভাবে দেখা যাবে।"
  },
  {
    "id": "358",
    "date": "2026-09-14T10:30",
    "type": "UI Improvement",
    "module": "Payroll (Salary Process)",
    "link": "/payroll-period-lock",
    "descriptionEn": "Refined Payroll Period Lock UI with professional typography, right-aligned table action buttons, and enabled/disabled state handling for the Certificate button.",
    "descriptionBn": "Payroll Period Lock পেজের UI কে আরও প্রফেশনাল ও মার্জিত রূপ দেওয়া হয়েছে, অ্যাকশন বাটন ডানপাশে এলাইন করা হয়েছে এবং আনলক থাকা অবস্থায় সার্টিফিকেট বাটন ডিজেবল করা রাখা হয়েছে।"
  },
  {
    "id": "357",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Payroll (Salary Process)",
    "link": "/payroll-period-lock",
    "descriptionEn": "Created a dedicated sub-menu and route 'Payroll Period Lock & Approval' (/payroll-period-lock) under Payroll -> Salary Process with period analytics cards, lock/unlock modals, persistent state, and printable frozen audit certificates.",
    "descriptionBn": "Payroll -> Salary Process এর নিচে 'Payroll Period Lock & Approval' (/payroll-period-lock) নামের নতুন সাব-মেনু যুক্ত করা হয়েছে যেখানে সকল মাসের বেতন প্রসেসের লক/আনলক ম্যানেজমেন্ট এবং অডিট রিপোর্ট জেনারেট করা যাবে।"
  },
  {
    "id": "356",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Payroll (Monthly Salary Process)",
    "link": "/monthly-salary-process",
    "descriptionEn": "Added a persistent Payroll Lock & Unlock System to Monthly Salary Process (/monthly-salary-process) featuring Lock/Unlock action buttons, Lock Confirmation Modal, Unlock Authorization Modal, top warning banner, and edit protection.",
    "descriptionBn": "Monthly Salary Process (/monthly-salary-process) পেজে পেরোল ফাইনাল লক ও আনলক সিস্টেম যুক্ত করা হয়েছে। লক করা অবস্থায় বেতন শিটে এডিট এবং পুনরায় ক্যালকুলেশন নিষ্ক্রিয় থাকবে।"
  },
  {
    "id": "355",
    "date": "2026-09-14T10:30",
    "type": "Bug Fix",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Fixed a runtime ReferenceError in Employee Doc Verification (/employee-doc-verification) caused by an undefined setRejectTarget call inside openModal and closeModal, restoring instant modal opening on Review click.",
    "descriptionBn": "Employee Doc Verification (/employee-doc-verification) পেজে openModal ও closeModal ফাংশনে থাকা রেফারেন্স এরর দূর করে রভিউ বাটনে ক্লিক করার সাথে সাথে মোডাল ওপেন হওয়া নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "354",
    "date": "2026-09-14T10:30",
    "type": "Bug Fix",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Enhanced modal triggers in Employee Doc Verification (/employee-doc-verification) by binding openModal to the blue Review > button, yellow ⏱ REVIEW status pill, and entire table row, while elevating modal z-index to z-[100].",
    "descriptionBn": "Employee Doc Verification (/employee-doc-verification) পেজে Review বাটন, হলুদ ⏱ REVIEW স্ট্যাটাস ব্যাজ এবং সম্পূর্ণ টেবিল রো তে মোডাল ওপেন ট্রিগার যুক্ত করা হয়েছে এবং z-index বৃদ্ধি করা হয়েছে।"
  },
  {
    "id": "353",
    "date": "2026-09-14T10:30",
    "type": "Bug Fix",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Fixed the Review button click handler in Employee Doc Verification (/employee-doc-verification) to cleanly open the verification modal and side-by-side OCR match console.",
    "descriptionBn": "Employee Doc Verification (/employee-doc-verification) পেজের Review বাটন ক্লিক সমস্যা সমাধান করা হয়েছে যাতে সহজে ভেরিফিকেশন মোডাল ও ডক্যুমেন্ট স্ক্যান দেখা যায়।"
  },
  {
    "id": "352",
    "date": "2026-09-14T10:30",
    "type": "Revert",
    "module": "Allowance Requisition",
    "link": "/allowance-requisition",
    "descriptionEn": "Reverted Allowance Requisition (/allowance-requisition) back to its original comprehensive layout per user request.",
    "descriptionBn": "ব্যবহারকারীর নির্দেশনায় Allowance Requisition (/allowance-requisition) পেজটি পূর্বের ভার্সনে রিভার্ট করা হয়েছে।"
  },
  {
    "id": "351",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Other Separations)",
    "link": "/separation-company-initiated",
    "descriptionEn": "Expanded the Initiate Company Separation Order modal width to max-w-5xl (~1024px wide) and arranged the category selection buttons into a clean 3-column grid per user request.",
    "descriptionBn": "Other Separations (/separation-company-initiated) মোডালটির চওড়া আরও বড় (max-w-5xl layout) করা হয়েছে এবং সেপারেশন ক্যাটাগরি বাটনগুলোকে ৩টি কলামের গ্রিডে চমৎকারভাবে সাজানো হয়েছে।"
  },
  {
    "id": "350",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Allowance Requisition",
    "link": "/allowance-requisition",
    "descriptionEn": "Redesigned Allowance Requisition (/allowance-requisition) to show a Saved Requisition List table, added a top '+ Create Allowance Requisition' header button, and created a modal with Date Range (Start/End Date), Allowance Type, Multi-Select Employee checklist, and Save functionality.",
    "descriptionBn": "Allowance Requisition (/allowance-requisition) পেজে পূর্বে সংরক্ষিত রিকুইজিশন তালিকা টেবিল প্রদর্শন করা হয়েছে এবং উপরে '+ Create Allowance Requisition' বাটন যুক্ত করে মোডাল চালু করা হয়েছে যেখানে ডেট রেঞ্জ, এলাউন্স টাইপ, মাল্টি-সিলেক্ট এমপ্লয়ি এবং সেভ বাটন রয়েছে।"
  },
  {
    "id": "349",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Other Separations)",
    "link": "/separation-company-initiated",
    "descriptionEn": "Simplified the Category Selection buttons in the Initiate Company Separation modal (/separation-company-initiated) by removing subtitle descriptions to display clean, uncluttered category titles per user request.",
    "descriptionBn": "Other Separations (/separation-company-initiated) মোডালের সেপারেশন ক্যাটাগরি অপশনগুলো থেকে অতিরিক্ত বিবরণ সাবটেক্সট সরিয়ে সম্পূর্ণ পরিষ্কার এবং শুধুমাত্র ক্যাটাগরি শিরোনামের বাটন হিসেবে ডিজাইন করা হয়েছে।"
  },
  {
    "id": "348",
    "date": "2026-09-14T10:30",
    "type": "New Module",
    "module": "Separation (Other Separations)",
    "link": "/separation-company-initiated",
    "descriptionEn": "Added a new menu 'Other Separations' (/separation-company-initiated) under Separation to manage company & management-initiated separations: Termination with Notice, Retirement, Mutual Separation, Medical Invalidation, Deceased Employee Settlement, and Disciplinary Dismissal.",
    "descriptionBn": "Separation মডিউলের অধীনে 'Other Separations' (/separation-company-initiated) নামে নতুন সাব-মেনু যুক্ত করা হয়েছে যার মাধ্যমে নোটিশসহ চাকরি অবসান, অবসরগ্রহণ, দ্বিপাক্ষিক সমঝোতা, চিকিৎসাজনিত অক্ষমতা, মৃত্যুজনিত পাওনা এবং শৃঙ্খলাভঙ্গের বরখাস্ত প্রক্রিয়াগুলো পরিচালনা করা যাবে।"
  },
  {
    "id": "347",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Clearance Matrix)",
    "link": "/separation-clearance",
    "descriptionEn": "Expanded the Create Clearance Request modal dimensions in Separation Clearance (/separation-clearance) to a spacious max-w-3xl layout with generous inner padding (px-8 py-6), larger form controls, and roomier resignation details profile card.",
    "descriptionBn": "Separation Clearance (/separation-clearance) পেজের মোডালটি চারদিকে আরও বড় (max-w-3xl layout) করা হয়েছে এবং ভেতরের প্যাডিং ও লেআউট আরও প্রসারিত করা হয়েছে।"
  },
  {
    "id": "346",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Clearance Matrix)",
    "link": "/separation-clearance",
    "descriptionEn": "Refined the Create Clearance Request modal in Separation Clearance (/separation-clearance) by limiting selection ONLY to approved resigned employees via a searchable combobox, removing Separation Type, auto-populating resignation metadata cards, and enhancing modal design.",
    "descriptionBn": "Separation Clearance (/separation-clearance) পেজের মোডালটি রিফাইন করা হয়েছে যাতে শুধুমাত্র পদত্যাগ অনুমোদনপ্রাপ্ত কর্মীরাই অনুসন্ধানযোগ্য (Searchable) তালিকায় থাকেন, সেপারেশন টাইপ ফিল্ড তুলে দেওয়া হয়েছে এবং পদত্যাগের তথ্য স্বয়ংক্রিয়ভাবে ভেসে ওঠার সুবিধা যোগ করা হয়েছে।"
  },
  {
    "id": "345",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Separation (Clearance Matrix)",
    "link": "/separation-clearance",
    "descriptionEn": "Added a '+ Create Clearance Request' button in the header bar of Separation Clearance (/separation-clearance) with a modal allowing HR/Management to select employees, choose Separation Types, set leaving date, and initiate a new 6-stage clearance workflow.",
    "descriptionBn": "Separation Clearance (/separation-clearance) পেজের হেডার বারে '+ Create Clearance Request' বাটন ও মোডাল যোগ করা হয়েছে যার মাধ্যমে এইচআর যেকোনো কর্মীর জন্য সেপারেশন টাইপ ও সার্ভিস ছাড়ার তারিখ সেট করে নতুন ৬টি ডিপার্টমেন্টের ছাড়পত্র রিকোয়েস্ট তৈরি করতে পারবে।"
  },
  {
    "id": "344",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Exit Documents)",
    "link": "/separation-exit-documents",
    "descriptionEn": "Fixed dropdown text alignment to left-aligned and resolved menu clipping issues by expanding dropdown width (w-64) and applying smart upward placement (bottom-full) on bottom rows in Exit Documents (/separation-exit-documents).",
    "descriptionBn": "Exit Documents (/separation-exit-documents) ড্রপডাউন অপশনগুলোকে লেফট-এলাইন করা হয়েছে এবং নিচের সারিতে অপশনগুলো কেটে যাওয়ার সমস্যা সমাধানে ড্রপডাউন প্রস্তুতকরণ ও স্মার্ট আপওয়ার্ড পজিশনিং যোগ করা হয়েছে।"
  },
  {
    "id": "343",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Exit Documents)",
    "link": "/separation-exit-documents",
    "descriptionEn": "Simplified the items inside the Exit Documents Download/Issue Documents dropdown menu to clean, simple document names without icons or subtext per user request.",
    "descriptionBn": "Exit Documents পেজের ডাউনলোড ড্রপডাউন মেনুর আইটেমগুলোকে আইকন এবং সাবটেক্সট ছাড়া একদম সাধারণ ও পরিষ্কার ডকুমেন্ট নাম হিসেবে সাজানো হয়েছে।"
  },
  {
    "id": "342",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Exit Documents)",
    "link": "/separation-exit-documents",
    "descriptionEn": "Removed top document tabs on Exit Documents (/separation-exit-documents) per user request and replaced them with a Download/Issue Documents dropdown button in the table Actions column allowing users to generate any of the 6 departure documents or download full packages.",
    "descriptionBn": "Exit Documents (/separation-exit-documents) পেজ থেকে উপরের ট্যাবগুলো তুলে দিয়ে প্রতিটি কর্মীর পাশে Actions কলামে Download/Issue Documents ড্রপডাউন বাটন যুক্ত করা হয়েছে যার মাধ্যমে যেকোন বিদায়ী ডকুমেন্ট দেখা ও ডাউনলোড করা যাবে।"
  },
  {
    "id": "341",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Clearance Matrix)",
    "link": "/separation-clearance",
    "descriptionEn": "Removed the redundant top department cards from Separation Clearance (/separation-clearance) per user feedback and added a comprehensive filter bar featuring Date Range (Leaving From/To), Department dropdown selector, Overall Status dropdown, Search keyword, and Reset Filters button.",
    "descriptionBn": "ব্যবহারকারীর ইউজার ইন্টারফেস ফিডব্যাক অনুযায়ী Separation Clearance (/separation-clearance) থেকে অপ্রয়োজনীয় টপ ডিপার্টমেন্ট কার্ডগুলো সরিয়ে ফেলা হয়েছে এবং ডেট রেঞ্জ (Leaving From/To), ডিপার্টমেন্ট সিলেক্টর, ওভারঅল স্ট্যাটাস সিলেক্টর ও ফিল্টার রিস্টোর বোতামসহ ফিল্টার বার যোগ করা হয়েছে।"
  },
  {
    "id": "340",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Exit Documents)",
    "link": "/separation-exit-documents",
    "descriptionEn": "Upgraded the Exit Documents Issuance page (/separation-exit-documents) to support 6 lucrative executive corporate departure paper documents: Release Letter, Clearance Form (with 6-dept matrix table), Experience Certificate, NOC, Service Certificate, and Final Settlement Voucher with brand gradient top bars, profile cards, and digital QR seals.",
    "descriptionBn": "Exit Documents (/separation-exit-documents) পেজটি আপগ্রেড করে ৬টি এক্সিকিউটিভ কর্পোরেট পেপার ডকুমেন্ট (রিলিজ লেটার, ৬টি ডিপার্টমেন্টের ছাড়পত্র ফর্ম, অভিজ্ঞতা সনদপত্র, NOC, সার্ভিস সার্টিফিকেট এবং চূড়ান্ত পাওনা ভাউচার) ব্র্যান্ড গ্র্যাডিয়েন্ট অ্যাকসেন্ট বার ও ডিজিটাল QR সিকিউরিটি সিলসহ তৈরি করার সুবিধা যোগ করা হয়েছে।"
  },
  {
    "id": "339",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Clearance & Resignation)",
    "link": "/separation-clearance",
    "descriptionEn": "Elevated the Employee Clearance Form and Resignation Letter view modals into lucrative executive corporate document paper designs featuring top brand gradient accent bars, employee profile cards, dark gradient table headers, rounded status pills, and digital QR security verification seal.",
    "descriptionBn": "Employee Clearance Form এবং Resignation Letter দেখার মোডাল দুটিকে লুকরেটিভ এক্সিকিউটিভ কর্পোরেট পেপার ডিজাইনে রূপান্তর করা হয়েছে, যেখানে ব্র্যান্ড গ্র্যাডিয়েন্ট অ্যাকসেন্ট বার, এমপ্লয়ি প্রোফাইল কার্ড, ডার্ক টেবিল হেডার, সফট স্ট্যাটাস পিলস এবং ডিজিটাল QR সিকিউরিটি সিল থাকবে।"
  },
  {
    "id": "338",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Clearance Matrix)",
    "link": "/separation-clearance",
    "descriptionEn": "Upgraded the Separation Clearance page (/separation-clearance) with a 6-stage clearance progress tracking dashboard and integrated the official printable Pakiza Software 'Employee Clearance Form' matching the reference document (Accounts, Administration, ICT, Immediate Reporting, HR Department, COO).",
    "descriptionBn": "Separation Clearance পেজটিতে ৬টি ডিপার্টমেন্টের (Accounts, Admin, ICT, Immediate Reporting, HR, COO) প্রোগ্রেস বার সহ স্মার্ট ড্যাশবোর্ড এবং রেফারেন্স ডকুমেন্ট অনুযায়ী হুবহু অফিসিয়াল প্রিন্টযোগ্য 'Employee Clearance Form' মোডাল যুক্ত করা হয়েছে।"
  },
  {
    "id": "337",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Resignation Request)",
    "link": "/separation-resignation-request",
    "descriptionEn": "Added a searchable Separation Reason combobox with 18+ comprehensive reasons and integrated a Rich Text Formatting Toolbar (Bold, Italic, Underline, Bullet List, Numbered List) styled with Inter font typography in Resignation Request (/separation-resignation-request).",
    "descriptionBn": "Resignation Request (/separation-resignation-request) মোডালে সার্চ সুবিধা সহ ১৮+ টি সেপারেশন রিজন কম্বোবক্স এবং ইন্টার (Inter) ফন্ট সহ রিচ টেক্সট ফরম্যাটিং টুলবার (Bold, Italic, Underline, Bullet List, Numbered List) যোগ করা হয়েছে।"
  },
  {
    "id": "336",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Separation (Resignation Request)",
    "link": "/separation-resignation-request",
    "descriptionEn": "Transformed the Resignation Request page into an Employee Self-Service portal with a large email-style modal composer featuring auto-filled metadata, Subject line, Notice Date, Last Working Date, comprehensive Reasons dropdown, and spacious editable letter body while removing table approval buttons.",
    "descriptionBn": "Resignation Request পেজটিকে ব্যবহারকারীর নিজের রিকোয়েস্ট করার উপযোগী ইমেইল-স্টাইল লার্জ কম্পোজার মোডালে রূপান্তর করা হয়েছে, যেখানে আইডি ও নাম অটো-শো করবে, সাবজেক্ট, নোটিশ ডেট, লাস্ট ওয়ার্কিং ডেট, বিস্তারিত রিজন ড্রপডাউন এবং বিস্তৃত লেটার বডি এডিটর থাকবে।"
  },
  {
    "id": "335",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Separation Module",
    "link": "/separation-resignation-request",
    "descriptionEn": "Created the comprehensive Separation Module featuring 4 smart sub-routes: Resignation Request (/separation-resignation-request), 6-Stage Multi-Departmental Clearance Matrix (/separation-clearance: Accounts, Admin, ICT, Reporting Boss, HR, C-Level), Settlement Payment (/separation-payment), and Exit Document Issuance (/separation-exit-documents).",
    "descriptionBn": "স্মার্ট সেপারেশন মডিউল তৈরি করা হয়েছে যার অধীনে ৪ টি সাব-মেনু যুক্ত করা হয়েছে: Resignation Request, ৬টি ডিপার্টমেন্টের (Accounts, Admin, ICT, Reporting Boss, HR, C-Level) স্মার্ট ক্লিয়ারেন্স ম্যাট্রিক্স (/separation-clearance), সেটেলমেন্ট পেমেন্ট (/separation-payment), এবং রিলিজ লেটার ও এক্সপেরিয়েন্স সার্টিফিকেটসহ Exit Documents।"
  },
  {
    "id": "334",
    "date": "2026-09-14T10:30",
    "type": "Cleanup",
    "module": "Leave (Maternity Leave)",
    "link": "/maternity-payment",
    "descriptionEn": "Removed the redundant /maternity-leave route page and purged all associated links from Sidebar.tsx and Topbar.tsx navigation menus per user request.",
    "descriptionBn": "ব্যবহারকারীর অনুরোধ অনুযায়ী অতিরিক্ত /maternity-leave রুট পেজটি মুছে ফেলা হয়েছে এবং সাইডবার ও টপবার মেনু থেকে এর সব ধরনের লিংক সরিয়ে ফেলা হয়েছে।"
  },
  {
    "id": "333",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Configure (Maternity Configuration)",
    "link": "/maternity-configuration",
    "descriptionEn": "Created the Maternity Policy Configuration module (/maternity-configuration) under Configure, enabling HR administrators to define cutoff date rules to automatically evaluate whether maternity benefit calculation is processed using Gross Pay or Net Pay, complemented by an active rules registry and live calculation simulator.",
    "descriptionBn": "Configure মডিউলের অধীনে Maternity Configuration (/maternity-configuration) নামে নতুন পেজ যোগ করা হয়েছে। এর মাধ্যমে কাটঅফ ডেট থ্রেশহোল্ড অনুযায়ী মাতৃত্বকালীন ছুটির সুবিধা Gross Pay নাকি Net Pay তে হিসাব হবে তা নির্ধারণ করা যাবে, সাথে লাইভ ক্যালকুলেশন সিমুলেটর যুক্ত করা হয়েছে।"
  },
  {
    "id": "332",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Leave (Maternity Leave)",
    "link": "/maternity-leave",
    "descriptionEn": "Set Emp Name, Sub Department, Job Title, and Date of joining input fields to readOnly with grey background styling in Maternity Leave (/maternity-leave) to signify auto-populated employee metadata.",
    "descriptionBn": "Maternity Leave (/maternity-leave) পেজে Emp Name, Sub Department, Job Title, এবং Date of joining ইনপুট ফিল্ডগুলোকে readOnly এবং ধূসর ব্যাকগ্রাউন্ড স্টাইলে পরিবর্তন করা হয়েছে যাতে অটো-ফিল ডাটা স্পষ্ট বোঝা যায়।"
  },
  {
    "id": "331",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Navigation (Sidebar)",
    "link": "/maternity-leave",
    "descriptionEn": "Grouped Maternity Leave, Maternity Payment, and Maternity Payment Report under a collapsible 'Maternity' sub-category within the Leave sidebar navigation menu for clean information architecture.",
    "descriptionBn": "সাইডবার নেভিগেশনে Leave মডিউলের অধীনে 'Maternity' নামে একটি নেস্টেড সাব-ক্যাটাগরি তৈরি করে তার অধীনে Maternity Leave, Maternity Payment, এবং Maternity Payment Report সাব-মেনুগুলো গুচ্ছ আকারে সাজানো হয়েছে।"
  },
  {
    "id": "330",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Leave (Maternity Payment)",
    "link": "/maternity-payment",
    "descriptionEn": "Removed the duplicate '+ Add New' button from the export toolbar in Maternity Payment (/maternity-payment), leaving strictly 1 primary Add button in the top breadcrumb header card. Restyled table action buttons into soft, subtle, professional icon badges with light color tints and crisp borders.",
    "descriptionBn": "Maternity Payment (/maternity-payment) পেজের টুলবার থেকে অতিরিক্ত 'Add New' বাটনটি সরিয়ে শুধুমাত্র উপরে মূল হেডারে ১ টি অ্যাড বাটন রাখা হয়েছে। টেবিলের অ্যাকশন বাটনগুলোকে সোবার, সফট এবং মার্জিত ব্যাকগ্রাউন্ড টিন্ট ও বর্ডার দিয়ে নতুনভাবে সাজানো হয়েছে।"
  },
  {
    "id": "329",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Leave (Maternity Leave)",
    "link": "/maternity-leave",
    "descriptionEn": "Relocated the 'Load 3-Month Salary History' button to a dedicated bottom-right footer row inside the top Configurator Card in Maternity Leave (/maternity-leave), improving card symmetry and form visual hierarchy.",
    "descriptionBn": "Maternity Leave (/maternity-leave) পেজের উপরেব কনফিগারেটর কার্ডের ডান পাশের নিচে প্রফেশনাল ফুটার সেশনে 'Load 3-Month Salary History' বাটনটি সরিয়ে পেজের ভিজ্যুয়াল অ্যালাইনমেন্ট সুন্দর করা হয়েছে।"
  },
  {
    "id": "328",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Leave (Maternity Leave)",
    "link": "/maternity-leave",
    "descriptionEn": "Realigned the Maternity Leave (/maternity-leave) configurator form controls into a clean, balanced 2-column grid and pre-populated 3 full months of realistic salary history demo data by default (Basic, Houserent, Medical, Conveyance, Present/Absence days, OT Hours, Wages Payable, and Net Wages) with a light-blue table header and summary totals row.",
    "descriptionBn": "Maternity Leave (/maternity-leave) পেজের ফর্ম ফিল্ডগুলোকে ২-কলামের ক্লিন গ্রিডে সাজানো হয়েছে এবং ডিফল্টভাবে ৩ মাসের পূর্ণাঙ্গ স্যালারি হিস্ট্রি ডেমো ডাটা (মৌলিক বেতন, বাড়ি ভাড়া, চিকিৎসা, যাতায়াত, ওভারটাইম, অর্জিত মজুরী) ও লাইট-ব্লু টেবিল হেডার যুক্ত করা হয়েছে।"
  },
  {
    "id": "327",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Leave (Maternity Payment)",
    "link": "/maternity-payment",
    "descriptionEn": "Relocated the Add Maternity Payment record trigger from the bottom-right floating button to top header positions ('+ Add New Maternity Payment' button in breadcrumb header and toolbar) matching other standard HRIS module pages.",
    "descriptionBn": "Maternity Payment পেজের নিচে থাকা ভাসমান প্লাস বাটনটি সরিয়ে দিয়ে অন্যান্য পেজের মতো উপরে হেডারে ও অ্যাকশন বাারে প্রফেশনাল '+ Add New Maternity Payment' বাটন স্থাপন করা হয়েছে।"
  },
  {
    "id": "326",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Leave (Maternity Payment)",
    "link": "/maternity-payment",
    "descriptionEn": "Refined the View / Actions column in Maternity Payment (/maternity-payment) by removing redundant search icons and standardizing 4 sleek professional action buttons per row: 1st Payment Bill (Indigo FileText icon), 2nd Payment Bill (Rose FileCheck icon), Edit Record (Amber Pencil icon), and Delete Record (Crimson Trash icon) with clear Bengali & English tooltips.",
    "descriptionBn": "Maternity Payment পেজের টেবিল থেকে অতিরিক্ত ২ টি সার্চ আইকন সরিয়ে ফেলা হয়েছে এবং ৪ টি প্রফেশনাল অ্যাকশন বাটন রাখা হয়েছে: ১ম কিস্তি বিল (Indigo FileText), ২য় কিস্তি বিল (Rose FileCheck), সম্পাদনা (Amber Edit), এবং মুছে ফেলুন (Crimson Trash) — যা টুলটিপ ও মার্জিত কালার প্যালেট দিয়ে আপডেট করা হয়েছে।"
  },
  {
    "id": "325",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Leave (Maternity Payment Report)",
    "link": "/maternity-payment-report",
    "descriptionEn": "Added a new 'Maternity Payment Report' sub-menu under the Leave module and created the Maternity Payment Report page (/maternity-payment-report). Features include Date range searching, Department and Section filters, summary metric cards (1st/2nd Payment totals and beneficiary counts), light-blue report table, real-time search, and Excel/PDF/Print exports.",
    "descriptionBn": "Leave মডিউলের অধীনে নতুন 'Maternity Payment Report' সাব-মেনু যুক্ত করা হয়েছে এবং মেটারনিটি পেমেন্ট রিপোর্ট পেজ (/maternity-payment-report) তৈরি করা হয়েছে। এতে তারিখের সীমা নির্বাচন, ডিপার্টমেন্ট ও সেকশন ফিল্টার, সামারি মেট্রিক কার্ড (১ম ও ২য় কিস্তির মোট টাকা ও সুবিধাভোগী সংখ্যা), লাইট-ব্লু রিপোর্ট টেবিল, ইনস্ট্যান্ট সার্চ এবং Excel/PDF/Print এক্সপোর্ট সুবিধা রয়েছে।"
  },
  {
    "id": "324",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Leave (Maternity Payment)",
    "link": "/maternity-payment",
    "descriptionEn": "Created official 1st Payment Bill (প্রথম পেমেন্ট বিল) and 2nd Payment Bill (দ্বিতীয় পেমেন্ট বিল) printable Bengali views for Maternity Payment records. Includes official Pakiza Knit Composite letterhead, employee & bill information, December 2022 salary breakdown table, 112-day benefit calculation formulas with in-words Bengali currency formatting, required attachments checklist, and 7 official signature blocks.",
    "descriptionBn": "মেটারনিটি পেমেন্ট রেকর্ডের জন্য অফিসিয়াল 'প্রথম পেমেন্ট বিল' এবং 'দ্বিতীয় পেমেন্ট বিল' ভিউ তৈরি করা হয়েছে। এতে পাকিজা নীট কম্পোজিট লেটারহেড, কর্মী ও বিল বিবরণী, ডিসেম্বর-২০২২ স্যালারি বিবরণী টেবিল, ১১২ দিনের সুবিধা হিসাব ও কথায় টাকা লেখা, সংযুক্তি তালিকা এবং ৭টি অফিসিয়াল স্বাক্ষর ব্লক রয়েছে।"
  },
  {
    "id": "323",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Leave (Maternity Payment)",
    "link": "/maternity-payment",
    "descriptionEn": "Added a new 'Maternity Payment' sub-menu under the Leave module and built the Maternity Payment management registry (/maternity-payment). Features include pre-populated real employee maternity records, Date range searching, live table filtering, Excel/PDF/Print export, floating creation button, interactive Add/Edit/View modal with salary history calculation, and 112/120-day benefit installment summary.",
    "descriptionBn": "Leave মডিউলের অধীনে নতুন 'Maternity Payment' সাব-মেনু যুক্ত করা হয়েছে এবং মেটারনিটি পেমেন্ট রেজিস্ট্রি পেজ (/maternity-payment) তৈরি করা হয়েছে। এতে কর্মীদের মেটারনিটি পেমেন্ট রেকর্ড দেখা, তারিখ অনুযায়ী ফিল্টারিং, Excel/PDF/Print এক্সপোর্ট, ফ্লোটিং প্লাস বাটন দিয়ে নতুন আবেদন ও এডিট মোডাল, ৩ মাসের স্যালারি হিস্ট্রি ও ১১২/১২০ দিনের সুবিধা কিস্তি হিসাব সুবিধা রয়েছে।"
  },
  {
    "id": "322",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Leave (Maternity Leave)",
    "link": "/maternity-leave",
    "descriptionEn": "Added a new Maternity Leave sub-menu under the Leave module and created the Maternity Leave benefit calculation page (/maternity-leave). Features include 3-month salary history loading, 112-day benefit calculation, 1st and 2nd installment splitting (pre/post-natal), PDF printing, Excel export, and saved application tracking.",
    "descriptionBn": "Leave মডিউলের অধীনে নতুন 'Maternity Leave' সাব-মেনু যুক্ত করা হয়েছে এবং মেটারনিটি লিভ বেনিফিট ক্যালকুলেশন পেজ (/maternity-leave) তৈরি করা হয়েছে। এতে ৩ মাসের স্যালারি হিস্ট্রি লোড, ১১২ দিনের মাতৃত্বকালীন সুবিধা হিসাব, ২ কিস্তিতে (প্রাক ও প্রসূতি পরবর্তী) পেমেন্ট ভাগ, PDF প্রিন্ট, Excel এক্সপোর্ট এবং সেভ করা আবেদনের তালিকা দেখা যাবে।"
  },
  {
    "id": "321",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Added searchable multi-select dropdown filters for Company and Area to the Employee Doc Verification filter bar. Users can now select one or more companies and areas to narrow down the employee list. Active filters are highlighted in blue and can be cleared individually or all at once via a 'Reset filters' button.",
    "descriptionBn": "Employee Doc Verification ফিল্টার বারে Company এবং Area-এর জন্য সার্চযোগ্য মাল্টি-সিলেক্ট ড্রপডাউন ফিল্টার যুক্ত করা হয়েছে। একাধিক কোম্পানি বা এরিয়া বেছে কর্মী তালিকা সংকীর্ণ করা যাবে। সক্রিয় ফিল্টার নীল রঙে হাইলাইট হয় এবং 'Reset filters' বাটনে ক্লিক করে সব ফিল্টার একসাথে রিসেট করা যায়।"
  },
  {
    "id": "320",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Removed the redundant 'Reject' button across the Employee Doc Verification module. All document issues (whether rejection or HR escalation) are now handled exclusively through the unified 'Mark as Issue' flow, simplifying the user experience.",
    "descriptionBn": "Employee Doc Verification মডিউল থেকে 'Reject' বাটনটি সরিয়ে ফেলা হয়েছে। এখন থেকে সব ধরনের ডকুমেন্ট সমস্যা বা রিজেকশন শুধুমাত্র 'Mark as Issue' অপশনের মাধ্যমে পরিচালিত হবে, যা ব্যবহারকারীদের জন্য আরও সহজ।"
  },
  {
    "id": "319",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Added a live HR Notification Bell to the Topbar. When a document is flagged with 'Mark as Issue', an instant notification is pushed to HR with the employee name, document title, issue description, and timestamp. Notifications are stored in localStorage, show an unread badge, and can be dismissed individually or cleared all at once.",
    "descriptionBn": "টপবারে একটি লাইভ HR নোটিফিকেশন বেল যুক্ত করা হয়েছে। 'Mark as Issue' দিলে সাথে সাথে HR-কে নোটিফিকেশন যায়, যেখানে কর্মীর নাম, ডকুমেন্টের নাম, সমস্যার বিবরণ ও সময় দেখা যায়। নোটিফিকেশনগুলো localStorage-এ সেভ থাকে, আনরিড ব্যাজ দেখায়, এবং একটি একটি বা সব একসাথে মুছে দেওয়া যায়।"
  },
  {
    "id": "318",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Added 'Mark as Issue' button to Employee Doc Verification. Verifiers can now flag a document with a specific issue description (from presets or custom text). Flagged documents show an orange 'Issue Flagged' status pill, display the issue note inline, and offer a 'Re-verify' button to reset the document back to Pending after the employee updates it. The global stats bar now also shows a Flagged count.",
    "descriptionBn": "Employee Doc Verification পেজে 'Mark as Issue' বাটন যুক্ত করা হয়েছে। ভেরিফায়াররা এখন একটি ডকুমেন্টে সমস্যা চিহ্নিত করতে পারবেন — প্রিসেট বা কাস্টম বিবরণ দিয়ে। ফ্ল্যাগ করা ডকুমেন্টে কমলা রঙের 'Issue Flagged' স্ট্যাটাস ও সমস্যার নোট দেখাবে, এবং ডকুমেন্ট আপডেট হলে 'Re-verify' বাটন দিয়ে আবার Pending-এ ফেরানো যাবে।"
  },
  {
    "id": "317",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "SSP Modals",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Added a checkmark icon to the Serial Number (SL) column in both Leave Application and Group Leave Application modal tables.",
    "descriptionBn": "লিভ অ্যাপ্লিকেশন এবং গ্রুপ লিভ অ্যাপ্লিকেশন মডালের টেবিলে সিরিয়াল নম্বর (SL) কলামে একটি চেকমার্ক আইকন যুক্ত করা হয়েছে।"
  },
  {
    "id": "316",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "General Product Store Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Added a Revision Count indicator alongside the Application Number in the General Product Store Requisition modal header.",
    "descriptionBn": "জেনারেল প্রোডাক্ট স্টোর রিকুইজিশন মডালের হেডারে অ্যাপ্লিকেশন নম্বরের পাশে রিভিশন কাউন্ট নির্দেশক যুক্ত করা হয়েছে।"
  },
  {
    "id": "315",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "General Product Store Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Redesigned the General Product Store Requisition detail view modal using the premium LeaveApplicationModal framework layout, featuring the custom items checkmarked list table shown in the design mockup.",
    "descriptionBn": "জেনারেল প্রোডাক্ট স্টোর রিকুইজিশন ডিটেইল ভিউ মডালটি প্রিমিয়াম লিভ অ্যাপ্লিকেশন মডাল লেআউটের আদলে নতুন করে ডিজাইন করা হয়েছে, এবং রিকুইজিশন আইটেম টেবিলটি স্ক্রিনশট মোকাআপের চেকমার্ক লিস্ট ডিজাইন অনুযায়ী সাজানো হয়েছে।"
  },
  {
    "id": "314",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Group Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Re-added the Requester avatar image to the Requester Details section in the Group Leave Application modal, formatted identically to the standard Employee Details layout.",
    "descriptionBn": "গ্রুপ লিভ অ্যাপ্লিকেশন মডালের 'Requester Details' সেকশনে আবেদনকারীর প্রোফাইল ছবি পুনরায় যুক্ত করা হয়েছে, যা সাধারণ এমপ্লয়ী ডিটেইলস লেআউটের অনুরূপ।"
  },
  {
    "id": "313",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Group Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Renamed the combined details card in the Group Leave Application Modal to 'Requester Details' and updated the field list to match the requested items, including custom label alignment width.",
    "descriptionBn": "গ্রুপ লিভ অ্যাপ্লিকেশন মডালের কম্বাইন্ড কার্ডের নাম পরিবর্তন করে 'Requester Details' করা হয়েছে এবং লেবেলগুলোর প্রস্থ সমন্বয় করে নতুন ফিল্ডগুলোর তালিকা আপডেট করা হয়েছে।"
  },
  {
    "id": "312",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Group Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Combined the Requester and Request For panels in the Group Leave Application details modal into a single Employee Details section without an avatar image, aligning with the default Employee Details layout.",
    "descriptionBn": "গ্রুপ লিভ অ্যাপ্লিকেশন ডিটেইলস মডালে রিকোয়েস্টার এবং রিকোয়েস্ট ফর প্যানেল দুটিকে একটি একক এমপ্লয়ী ডিটেইলস সেকশনে রূপান্তর করা হয়েছে (প্রোফাইল ছবি ছাড়া), যা সাধারণ এমপ্লয়ী ডিটেইলস লেআউটের অনুরূপ।"
  },
  {
    "id": "311",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Group Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Created and integrated the Group Leave Application Modal on the My Requisitions page, featuring a dual-panel Requester/Request For header layout and a comprehensive table displaying all leave member requests.",
    "descriptionBn": "মাই রিকুইজিশন পেজে গ্রুপ লিভ অ্যাপ্লিকেশন মডাল তৈরি এবং যুক্ত করা হয়েছে, যার মধ্যে রিকোয়েস্টার ও রিকোয়েস্ট ফর সেকশনগুলোর ডুয়াল-প্যানেল লেআউট এবং সকল কর্মচারীর ছুটির আবেদনের বিস্তারিত তালিকা টেবিল অন্তর্ভুক্ত রয়েছে।"
  },
  {
    "id": "310",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Updated the Employee Details avatar image height to exactly 91px as requested.",
    "descriptionBn": "এমপ্লয়ী ডিটেইলস সেকশনে কর্মচারীর প্রোফাইল ছবির উচ্চতা পরিবর্তন করে 91 পিক্সেল করা হয়েছে।"
  },
  {
    "id": "309",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Reduced horizontal column gap inside Employee Details section and corrected vertical top-alignment of the avatar image with the details grid.",
    "descriptionBn": "এমপ্লয়ী ডিটেইলস সেকশনে কলামগুলোর মধ্যবর্তী খালি জায়গা কমানো হয়েছে এবং কর্মচারীর প্রোফাইল ছবির সাথে ডানপাশের ডিটেইলস গ্রিডের উল্লম্ব সারিবদ্ধতা (vertical alignment) ঠিক করা হয়েছে।"
  },
  {
    "id": "308",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Increased Dialog content maximum width size from max-w-5xl to max-w-7xl, shortened details table headers to their short-form titles (e.g., DUR., ENJ. / BAL., DOCS) and enforced single-line rendering.",
    "descriptionBn": "লিভ রিকুইজিশন মডালের সর্বোচ্চ উইডথ বাড়িয়ে max-w-7xl করা হয়েছে, এবং কলাম টাইটেলগুলো সংক্ষিপ্ত আকারে (যেমন: DUR., ENJ. / BAL., DOCS) প্রকাশ করে এক লাইনে প্রদর্শনের ব্যবস্থা করা হয়েছে।"
  },
  {
    "id": "307",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Optimized Leave Requisition modal table layout to fit all columns inside the grid without horizontal scrolling by wrapping text and stacking Date Range vertically.",
    "descriptionBn": "লিভ রিকুইজিশন মডালের টেবিল লেআউট অপ্টিমাইজ করা হয়েছে যাতে কোন হরিজন্টাল স্ক্রল ছাড়াই কন্টেন্ট স্ক্রিনে দেখা যায়। এর জন্য ডেট রেঞ্জ ভার্টিক্যালি সাজানো হয়েছে এবং টেক্সট র‍্যাপিং সক্রিয় করা হয়েছে।"
  },
  {
    "id": "306",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Moved Contact and Responsible fields from the Leave Balance Table to the Employee Details card section of the Leave Requisition modal.",
    "descriptionBn": "লিভ রিকুইজিশন মডালের লিভ ব্যালেন্স টেবিল থেকে কন্টাক্ট এবং রেসপনসিবল ফিল্ড দুটিকে সরিয়ে এমপ্লয়ী ডিটেইলস কার্ড সেকশনে স্থানান্তর করা হয়েছে।"
  },
  {
    "id": "305",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Added Employee Avatar Image inside the Employee Details section of the Leave Application Details modal.",
    "descriptionBn": "লিভ অ্যাপ্লিকেশন ডিটেইলস মডালের এমপ্লয়ী ডিটেইলস সেকশনে কর্মচারীর প্রোফাইল ছবি যুক্ত করা হয়েছে।"
  },
  {
    "id": "304",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Updated Leave Application Details modal on the My Requisitions page to render Employee Details and Leave Details side-by-side using the same clean, bordered card styling with inline labels and bold values.",
    "descriptionBn": "মাই রিকুইজিশন পেজের লিভ অ্যাপ্লিকেশন ডিটেইলস মডালটির লেআউট পরিবর্তন করা হয়েছে। এখন এমপ্লয়ি ডিটেইলস এবং লিভ ডিটেইলস সেকশন দুটি পাশাপাশি প্রদর্শিত হবে এবং উভয় সেকশনেই একই রকম কার্ড ডিজাইন ও ইনলাইন লেবেল ব্যবহার করা হয়েছে।"
  },
  {
    "id": "303",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Allowance Requisition",
    "link": "/allowance-requisition",
    "descriptionEn": "Created the new Allowance Requisition menu under Manage Allowance, featuring dynamic search parameters (Start/End date, Employee, Dept, Unit, Line), select-all list checkboxes, inline OT inputs editing, a batch assignment panel to configure selected records, CSV export, print layout styling, and list submission.",
    "descriptionBn": "ম্যানেজ অ্যালাউন্সের অধীনে নতুন 'Allowance Requisition' মেনু ও পেজ যুক্ত করা হয়েছে, যেখানে রয়েছে ডাইনামিক সার্চ প্যারামিটার (শুরু/শেষ তারিখ, কর্মচারী, বিভাগ, ইউনিট, লাইন), সিলেক্ট-অল চেকবক্স, ইনলাইন ওভারটাইম ইনপুট এডিটর, নির্বাচিত রেকর্ডের মান একবারে সেট করার জন্য ব্যাচ অ্যাসাইনমেন্ট মোডাল, এক্সেল এক্সপোর্ট, প্রিন্ট ও সাবমিশন অ্যাকশন।"
  },
  {
    "id": "302",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Reordered the columns in the Leave Application details table and combined the Enjoyed and Balance fields into a single 'ENJOYED / BAL' column.",
    "descriptionBn": "লিভ অ্যাপ্লিকেশন ডিটেইলস টেবিলের কলামগুলোর ক্রম পরিবর্তন করা হয়েছে এবং এনজয়েড ও ব্যালেন্স ফিল্ড দুটিকে একত্রিত করে একটি একক কলাম করা হয়েছে।"
  },
  {
    "id": "301",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Applied fixed-width alignment to all entry labels within the Employee Details and Leave Details cards of the Leave Application Details modal, ensuring that all data values are perfectly aligned in a uniform vertical column.",
    "descriptionBn": "লিভ অ্যাপ্লিকেশন ডিটেইলস মডালের এমপ্লয়ী ও লিভ ডিটেইলস কার্ডের ভেতরের সকল লেবেলের জন্য নির্দিষ্ট প্রস্থ (fixed width) ব্যবহার করা হয়েছে, যার ফলে সবগুলো ডেটা ভ্যালু একটি সুন্দর, সোজা কলামে সারিবদ্ধভাবে প্রদর্শিত হচ্ছে।"
  },
  {
    "id": "300",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Updated Employee Details and Leave Details grids inside the Leave Application Details modal to be single-column. This left-aligns all entry fields sequentially to prevent text wrapping of long values while preserving the vertical row spacing.",
    "descriptionBn": "লিভ অ্যাপ্লিকেশন ডিটেইলস মডালের ভেতরে এমপ্লয়ী ও লিভ ডিটেইলসের গ্রিড লেআউট পরিবর্তন করে সিঙ্গেল-কলাম করা হয়েছে। এর ফলে সব তথ্য বাম পাশে সারিবদ্ধভাবে প্রদর্শিত হবে, যা বড় টেক্সট লাইনের রেন্ডারিং উন্নত করে।"
  },
  {
    "id": "299",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "JD List",
    "link": "/jd-list",
    "descriptionEn": "Made the Edit functionality fully functional on the JD List page. Users can now edit details of existing Job Descriptions (such as department, designation, reports to, key responsibilities, and qualifications) in the same modal interface with pre-filled inputs.",
    "descriptionBn": "জেডি (JD) লিস্ট পেজে এডিট অপশনটিকে সম্পূর্ণ সচল করা হয়েছে। ব্যবহারকারীরা এখন একই মডাল উইন্ডোতে বিদ্যমান তথ্যগুলো প্রি-ফিলড অবস্থায় পেয়ে যেকোনো তথ্য (ডিপার্টমেন্ট, ডেজিগনেশন, রিপোর্ট টু, মূল দায়িত্বসমূহ এবং শিক্ষাগত যোগ্যতা) আপডেট করতে পারবেন।"
  },
  {
    "id": "298",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Salary Sheet (Exec)",
    "link": "/salary-sheet-exec",
    "descriptionEn": "Created the Salary Sheet (Exec) landscape print report layout with 31 specific columns mapped precisely from the provided reference. Wired it to the Salary Sheet (Exec) button.",
    "descriptionBn": "রেফারেন্স থেকে 31 টি কলাম স্পেসিফিকেশন অনুযায়ী স্যালারি শিট (Exec) ল্যান্ডস্কেপ প্রিন্ট রিপোর্ট লেআউট তৈরি করা হয়েছে এবং এটিকে স্যালারি শিট (Exec) বাটনের সাথে যুক্ত করা হয়েছে।"
  },
  {
    "id": "297",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Bank Sheet (Exec)",
    "link": "/bank-sheet-exec",
    "descriptionEn": "Created the Bank Sheet (Exec) portrait print report layout matching the provided layout and wired it to the Bank Sheet (Exec) button in the Advanced Report Actions.",
    "descriptionBn": "ব্যাংক শিট (Exec) পোর্ট্রেট প্রিন্ট রিপোর্ট লেআউট তৈরি করা হয়েছে এবং এটিকে অ্যাডভান্সড রিপোর্ট অ্যাকশন সেকশনের ব্যাংক শিট (Exec) বাটনের সাথে যুক্ত করা হয়েছে।"
  },
  {
    "id": "296",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Salary Sheet Full (Without Holiday)",
    "link": "/salary-sheet-full-without-holiday",
    "descriptionEn": "Created Salary Sheet Full (Without Holiday) report layout by mapping to the exact 30-column screenshot specification, omitting the Holiday column. Linked the report to the corresponding button in the Advance Report Actions section.",
    "descriptionBn": "স্ক্রিনশটের 30-কলাম স্পেসিফিকেশন অনুযায়ী হলিডে কলাম বাদ দিয়ে স্যালারি শিট ফুল (উইদাউট হলিডে) রিপোর্ট লেআউট তৈরি করা হয়েছে এবং এটিকে সংশ্লিষ্ট বাটনের সাথে যুক্ত করা হয়েছে।"
  },
  {
    "id": "295",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Salary Sheet Full (WH)",
    "link": "/salary-sheet-full-wh",
    "descriptionEn": "Created Salary Sheet Full (WH) report layout based on the exact screenshot specifications and wired it to the Salary Sheet Full(WH) button.",
    "descriptionBn": "স্ক্রিনশটের স্পেসিফিকেশন অনুযায়ী স্যালারি শিট ফুল (WH) রিপোর্ট লেআউট তৈরি করা হয়েছে এবং এটিকে স্যালারি শিট ফুল (WH) বাটনের সাথে যুক্ত করা হয়েছে।"
  },
  {
    "id": "294",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "OT Sheet (Holiday)",
    "link": "/ot-sheet-holiday",
    "descriptionEn": "Created OT Sheet(Holiday) report with custom landscape layout and dynamic column grouping mapping to the provided screenshot structure. Wired it to the OT Sheet(Holiday) button in the Monthly Salary Details portal.",
    "descriptionBn": "স্ক্রিনশটের সাথে মিল রেখে কাস্টম ল্যান্ডস্কেপ লেআউট এবং ডায়নামিক কলাম গ্রুপিং সহ OT Sheet (Holiday) পেজ তৈরি করা হয়েছে এবং মাসিক স্যালারি ডিটেইলস পোর্টালে বাটনের সাথে যুক্ত করা হয়েছে।"
  },
  {
    "id": "293",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Cash Sheet (Exec)",
    "link": "/cash-sheet-print",
    "descriptionEn": "Added a portrait-oriented printable A4 Cash Payment Sheet report route (/cash-sheet-print) for the Payroll module, mapping exactly to reference mockups and wired to the Cash Sheet (Exec) button.",
    "descriptionBn": "পে-রোল মডিউলের জন্য একটি পোর্ট্রেট-ওরিয়েন্টেড প্রিন্টযোগ্য A4 ক্যাশ পেমেন্ট শিট রিপোর্ট রাউট (/cash-sheet-print) যুক্ত করা হয়েছে এবং এটি ক্যাশ শিট (Exec) বাটনের সাথে সংযুক্ত করা হয়েছে।"
  },
  {
    "id": "292",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Dept. wise Salary Sheet",
    "link": "/dept-wise-salary-sheet",
    "descriptionEn": "Added Department wise salary sheet print view with chunking by department and employee type, matching the PDF format.",
    "descriptionBn": "পিডিএফ ফরম্যাটের সাথে মিল রেখে ডিপার্টমেন্ট এবং এমপ্লয়ী টাইপ অনুযায়ী চাঙ্কিং সহ বিভাগ ভিত্তিক বেতন শিট প্রিন্ট ভিউ যোগ করা হয়েছে।"
  },
  {
    "id": "291",
    "date": "2026-09-14T10:30",
    "type": "Bug Fix",
    "module": "Monthly Salary Sheet Print",
    "link": "/salary-sheet-print",
    "descriptionEn": "Fixed a bug in calculatedRows where spreading vals (returned by getSalaryValues) overwrote the row serial number ('sl' key) with the sick leave count ('sl' key). Renamed the row serial number property to 'serialNo' to resolve duplicate property declarations and ensure the serial number renders correctly in print sheets.",
    "descriptionBn": "স্যালারি শিট প্রিন্ট পেইজে একটি বাগ ফিক্স করা হয়েছে যেখানে row serial number ('sl') এবং sick leave ('sl') একই কি (key) নাম হওয়ার কারণে সায়ালারি শিটের ক্রমিক নম্বরটি ভুল আসছিল। ক্রমিক নম্বরের কি নাম পরিবর্তন করে 'serialNo' করা হয়েছে যাতে এটি সঠিকভাবে প্রিন্ট শিটে প্রদর্শিত হয়।"
  },
  {
    "id": "290",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Monthly Salary Details",
    "link": "/monthly-salary-details",
    "descriptionEn": "Created a new professional, printable Landscape A4 Monthly Salary Sheet report route (/salary-sheet-print) for the Payroll module. Renders Pakiza Software branding, department/unit/line filters, complete double-header table grid (Salary Breakdown, Attendance, Deductions, Overtime, Net Pay), and bottom executive signature logs matching the reference screenshot. Wired this print action to all 'Salary Sheet' buttons in the Monthly Salary Details portal.",
    "descriptionBn": "পে-রোল মডিউলের জন্য একটি নতুন প্রফেশনাল, প্রিন্ট-বান্ধব ল্যান্ডস্কেপ A4 মাসিক স্যালারি শিট রাউট (/salary-sheet-print) তৈরি করা হয়েছে। এতে রয়েছে পাকিজা সফটওয়্যার ব্র্যান্ডিং হেডার, ডিপার্টমেন্ট/ইউনিট ফিল্টার মেটা, পূর্ণাঙ্গ ডাবল-হেডার গ্রিড টেবিল (বেতন ব্রেকডাউন, হাজিরা, কর্তন, ওভারটাইম, নেট পে) এবং স্ক্রিনশটের মতো ৬টি সিগনেচার এপ্রুভাল সেকশন। মাসিক স্যালারি ডিটেইলস পোর্টালের সব 'Salary Sheet' বাটনের সাথে এই প্রিন্ট অ্যাকশন যুক্ত করা হয়েছে।"
  },
  {
    "id": "289",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Workspace Selection Portal",
    "link": "/module-selection",
    "descriptionEn": "Updated the workspace landing page to separate modules into two distinct sections: 'Active Modules' (containing HRIS, Merchandising, Procurement Management, Inventory Management, and My Dashboard) and 'Available Modules' (containing the remaining modules). Integrated clean section headers, visual status indicators (online/offline module counts), and staggered animations.",
    "descriptionBn": "ওয়ার্কস্পেস ল্যান্ডিং পেজটি আপডেট করা হয়েছে যেখানে মডিউলগুলোকে দুটি আলাদা বিভাগে বিভক্ত করা হয়েছে: 'Active Modules' (যার মধ্যে রয়েছে HRIS, Merchandising, Procurement Management, Inventory Management এবং My Dashboard) এবং 'Available Modules' (অবশিষ্ট অন্যান্য মডিউলগুলো)। এর সাথে সুন্দর সেকশন হেডার, লাইভ অনলাইন/অফলাইন স্ট্যাটাস কাউন্টার এবং স্মুথ অ্যানিমেশন যুক্ত করা হয়েছে।"
  },
  {
    "id": "288",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Payroll",
    "link": "/employee-tax-pay",
    "descriptionEn": "Created the new Employee Tax Pay (Tax Update) menu and interactive form page in the Payroll module. Featuring period filters, total person and amount statistics cards, bank details, chalan numbers/dates configurations, and an editable data grid with inline input fields matching the user's reference screenshot.",
    "descriptionBn": "পে-রোল মডিউলের অধীনে নতুন এমপ্লয়ি ট্যাক্স পে (ট্যাক্স আপডেট) মেনু এবং ইন্টারঅ্যাক্টিভ ফর্ম পেইজ তৈরি করা হয়েছে। এর মধ্যে রয়েছে বছর ও মাস ফিল্টার, মোট ব্যক্তি ও টাকার পরিমাণের পরিসংখ্যান কার্ড, ব্যাংক ও চালান নম্বর/তারিখ কনফিগারেশন এবং স্ক্রিনশটের সাথে সামঞ্জস্যপূর্ণ ইনলাইন ইনপুট ফিল্ড সহ একটি এডিটেবল ডেটা গ্রিড টেবিল।"
  },
  {
    "id": "287",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Currency Rate Configuration",
    "link": "/procurement-config-currency-rate",
    "descriptionEn": "Redesigned the Currency Rate Configuration page under the Procurement Module. Implemented clean bottom-bordered inline inputs, float labels, specific active coloring for form action buttons (Create/Update), a floating green plus action button for create modal opening, and pagination controls.",
    "descriptionBn": "প্রকিউরমেন্ট মডিউলের কারেন্সি রেট কনফিগারেশন পেইজটি সম্পূর্ণ রিডিজাইন করা হয়েছে। এর মধ্যে রয়েছে পরিচ্ছন্ন বটম-বর্ডারড ইনপুট ফিল্ড, ফ্লোটিং লেবেল স্টাইল, ফর্মের সাবমিট বাটনে (Create/Update) বিশেষ কালারিং থিম, ক্রিয়েট মোডাল ওপেন করার জন্য ফ্লোটিং অ্যাকশন প্লাস বাতন এবং পেজিনেশন কন্ট্রোলস।"
  },
  {
    "id": "286",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Procurement Management Module",
    "link": "/procurement-dashboard",
    "descriptionEn": "Created the new Procurement Management module, including custom ProcurementSidebar, ProcurementTopbar, 45 individual static route files, and a rich graphical overview dashboard equipped with Recharts trends (spend and payouts), allocation splits, and comprehensive performance metrics.",
    "descriptionBn": "নতুন প্রকিউরমেন্ট ম্যানেজমেন্ট মডিউল তৈরি করা হয়েছে, যার মধ্যে রয়েছে কাস্টম প্রকিউরমেন্ট সাইডবার, প্রকিউরমেন্ট টপবার, ৪৫টি পৃথক স্ট্যাটিক রাউট পেইজ এবং রিচার্টস (Recharts) গ্রাফিক্যাল ট্রেন্ড অ্যানালিটিকস, ক্যাটাগরি স্পেন্ড অ্যালোকেশন এবং প্রিমিয়াম পারফরম্যান্স মেট্রিক্স সমৃদ্ধ একটি আকর্ষনীয় ড্যাশবোর্ড লেআউট।"
  },
  {
    "id": "285",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Employee Job Card",
    "link": "/employee-job-card",
    "descriptionEn": "Redesigned the Employee Job Card workspace including Scope & Parameters form columns grid, inline query triggers, employee profile summary card, stat card tiles, and responsive Attendance Summary block.",
    "descriptionBn": "এমপ্লয়ি জব কার্ড পেজটি নতুন করে রিডিজাইন করা হয়েছে: যেখানে রয়েছে স্কোপ ও প্যারামিটারস সার্চ প্যানেল, ইনলাইন অ্যাকশন ট্রিগার, এমপ্লয়ি প্রোফাইল সামারি কার্ড, ৪টি প্রিমিয়াম স্ট্যাট টাইলস এবং ডায়নামিক অ্যাটেনডেন্স সামারি ব্লক।"
  },
  {
    "id": "284",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition",
    "link": "/ssp-approval",
    "descriptionEn": "Refined the Leave Details list view to incorporate the Leave Type and Address as standard inline labeled items, providing a completely uniform key-value reading experience.",
    "descriptionBn": "লিভ ডিটেইলস সেকশনে 'লিভ টাইপ' এবং 'অ্যাড্রেস' কে ইনলাইন লিস্ট আইটেম হিসেবে যুক্ত করা হয়েছে, যাতে পুরো সেকশনটি একটি মানানসই এবং সুন্দর কী-ভ্যালু লেআউটে দেখা যায়।"
  },
  {
    "id": "283",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition",
    "link": "/ssp-approval",
    "descriptionEn": "Redesigned the Leave Details section into a clean inline list view layout matching the employee profile description layout, using inline key-value labels and bold values.",
    "descriptionBn": "লিভ ডিটেইলস সেকশনটি এমপ্লয়ি প্রোফাইল ডেসক্রিপশনের স্টাইল অনুযায়ী একটি পরিচ্ছন্ন ইনলাইন লিস্ট ভিউ লেআউটে রিডিজাইন করা হয়েছে, যাতে ইনলাইন কী-ভ্যালু লেবেল এবং বোল্ড ভ্যালু ব্যবহার করা হয়েছে।"
  },
  {
    "id": "282",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition",
    "link": "/ssp-approval",
    "descriptionEn": "Refined the Leave Details section into a structured 4-column layout to prevent UI breaks on long text blocks and corrected fallback Tailwind text color styles for consistent reading.",
    "descriptionBn": "লিভ ডিটেইলস সেকশনটি একটি সুন্দর ৪-কলাম লেআউটে সাজানো হয়েছে যাতে লম্বা টেক্সটের কারণে UI ভেঙে না যায় এবং টেক্সট কালার স্টাইল সঠিকভাবে রেন্ডার হওয়ার জন্য ক্লাসগুলো ঠিক করা হয়েছে।"
  },
  {
    "id": "281",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Increased modal design weight (width), redesigned the Leave Details section into premium statistics card tiles, and fixed a missing 'details' reference causing a runtime crash on /ssp-my-requisition.",
    "descriptionBn": "মোডালের ওজন (প্রস্থ) বৃদ্ধি করা হয়েছে, লিভ ডিটেইলস সেকশনটি প্রিমিয়াম স্ট্যাটিস্টিকস কার্ড টাইলস আকারে রিডিজাইন করা হয়েছে এবং /ssp-my-requisition পেইজের রানটাইম ক্র্যাশ হওয়া বাগটি ফিক্স করা হয়েছে।"
  },
  {
    "id": "280",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition Modal",
    "link": "/ssp-my-requisition",
    "descriptionEn": "Redesigned the Leave Application Requisition Detail View modal for the Employee portal to match the premium wireframe layout.",
    "descriptionBn": "কর্মচারী পোর্টালের জন্য লিভ অ্যাপ্লিকেশন রিকুইজিশন ডিটেইল ভিউ মোডালটি প্রিমিয়াম লেআউটে রিডিজাইন করা হয়েছে।"
  },
  {
    "id": "279",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Leave Requisition",
    "link": "/ssp-approval",
    "descriptionEn": "Redesigned the Leave Application detail view modal to match the premium, structured UI mockup, featuring a clean requester/request-for grid, detailed parameter blocks, and inline signatures.",
    "descriptionBn": "লিভ অ্যাপ্লিকেশন ডিটেইল ভিউ মোডাল রিডিজাইন করা হয়েছে যাতে রয়েছে রিকোয়েস্টার ও রিকোয়েস্ট-ফর গ্রিড, বিস্তারিত লিভ ডিটেইলস ব্লক এবং সুন্দর ইনলাইন সিগনেচার ওয়ার্কফ্লো।"
  },
  {
    "id": "278",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Workspace Settings Profile",
    "link": "/enroll-fingerprint",
    "descriptionEn": "Simplified the Enroll Fingerprint page to a clean, mobile-style UI — tap the sensor icon to add a fingerprint, rename or delete saved ones just like iOS Touch ID settings.",
    "descriptionBn": "ফিঙ্গারপ্রিন্ট এনরোল পেজটি মোবাইলের মতো সহজ UI তে রূপান্তর করা হয়েছে — সেন্সর আইকনে ট্যাপ করলেই ফিঙ্গারপ্রিন্ট যোগ হবে, রিনেম বা ডিলেটও করা যাবে।"
  },
  {
    "id": "277",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Workspace Login Portal",
    "link": "/login",
    "descriptionEn": "Login fingerprint button now uses the real WebAuthn API — the browser prompts the actual Touch ID sensor. Login won't proceed until you physically touch the fingerprint sensor.",
    "descriptionBn": "লগইন পেজের ফিঙ্গারপ্রিন্ট বাটনটি এখন আসল WebAuthn API ব্যবহার করে — আসল Touch ID সেন্সর স্পর্শ না করলে লগইন হবে না।"
  },
  {
    "id": "276",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Workspace Settings Profile",
    "link": "/enroll-fingerprint",
    "descriptionEn": "Developed a dedicated Biometric Setup page (/enroll-fingerprint) featuring a professional fingerprint enrollment console with multi-pass scans, visual hand-mapping selectors, real-time minutiae extraction, and active biometric templates logs.",
    "descriptionBn": "ফিঙ্গারপ্রিন্ট রেজিস্ট্রেশনের জন্য একটি ডেডিকেটেড পেজ (/enroll-fingerprint) তৈরি করা হয়েছে যাতে রয়েছে ৪-ধাপের ভেরিফিকেশন স্ক্যানার, ভিজ্যুয়াল হ্যান্ড-ম্যাপিং সিলেক্টর, রিয়েল-টাইম মিনিট পয়েন্ট এক্সট্রাকশন এবং অ্যাক্টিভ বায়োমেট্রিক টেমপ্লেট ডাটাবেস।"
  },
  {
    "id": "275",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Workspace Header Navigation",
    "descriptionEn": "Added interactive dropdown menu to Topbar profile block with options: My Profile, Change Region, and Enroll Fingerprint setup dialog.",
    "descriptionBn": "টপবার প্রোফাইল সেকশনে একটি ইন্টারেক্টিভ ড্রপডাউন মেনু যুক্ত করা হয়েছে যাতে রয়েছে: My Profile, Change Region এবং Enroll Fingerprint সেটআপ মোডাল।"
  },
  {
    "id": "274",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Workspace Login Portal",
    "link": "/login",
    "descriptionEn": "Implemented secure fingerprint authentication option on the login page, featuring a high-fidelity scanning modal, laser scan line animations, and automated user redirection.",
    "descriptionBn": "লগইন পেজে ফিঙ্গারপ্রিন্ট দিয়ে লগইন করার সুবিধা যুক্ত করা হয়েছে, যার মধ্যে রয়েছে দৃষ্টিনন্দন অ্যানিমেটেড স্ক্যানিং মডাল এবং স্বয়ংক্রিয় রিডাইরেকশন সুবিধা।"
  },
  {
    "id": "273",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Sidebar Navigation Layout",
    "descriptionEn": "Reorganized Leave and SSP Attendance sidebar menus into nested dropdown submenus (excluding Hub pages) for cleaner navigation.",
    "descriptionBn": "নেভিগেশন সহজ ও পরিচ্ছন্ন করতে হাব পেজগুলো বাদ দিয়ে সাইডবার মেনুতে লিভ এবং এসএসপি অ্যাটেনডেন্স অপশনগুলোকে ড্রপডাউন সাব-মেনুতে রূপান্তর করা হয়েছে।"
  },
  {
    "id": "272",
    "date": "2026-09-14T10:30",
    "type": "Bug Fix",
    "module": "System Settings",
    "link": "/changes",
    "descriptionEn": "Resolved TypeScript compilation type-checking error by adding 'Bug Fix' to the ChangeRecord allowed types and selection dropdown options.",
    "descriptionBn": "টাইপস্ক্রিপ্ট কম্পাইলেশন টাইপ-চেকিং ত্রুটি দূর করতে পরিবর্তনের প্রকারভেদে 'Bug Fix' যুক্ত করা হয়েছে এবং এর ড্রপডাউন অপশন আপডেট করা হয়েছে।"
  },
  {
    "id": "271",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Added Lock/Unlock layout toggle button to dynamically toggle drag and drop permissions and show/hide reorder handle badges.",
    "descriptionBn": "ড্যাশবোর্ড লেআউট লক/আনলক করার জন্য বাটন যুক্ত করা হয়েছে, যা দিয়ে ড্র্যাগ অ্যান্ড ড্রপ সক্রিয় বা নিষ্ক্রিয় করা যাবে এবং হ্যান্ডেল ব্যাজ লুকানো যাবে।"
  },
  {
    "id": "270",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Updated default widget positioning to set order: Attendance Summary, Notice Board, Recent Messages, Leave Balance, Ontime vs Late, Upcoming, and bumped local storage namespace.",
    "descriptionBn": "ড্যাশবোর্ড উইজেটের ডিফল্ট লেআউট সাজানো হয়েছে: Attendance Summary, Notice Board, Recent Messages, Leave Balance, Ontime vs Late, Upcoming এবং লোকাল স্টোরেজ কী সংস্করণ ৩-এ আপডেট করা হয়েছে।"
  },
  {
    "id": "269",
    "date": "2026-09-14T10:30",
    "type": "Bug Fix",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Increased the dashboard widget heights to 330px and scaled up inline charts, eliminating notice items and bottom buttons clipping on viewport zoom scales.",
    "descriptionBn": "ড্যাশবোর্ড উইজেটের হাইট ৩৩০ পিক্সেল করা হয়েছে এবং চার্টগুলোর উচ্চতা সমন্বয় করা হয়েছে, যার ফলে নোটিশ আইটেম বা নিচের বাটনগুলো কেটে যাবে না।"
  },
  {
    "id": "268",
    "date": "2026-09-14T10:30",
    "type": "Bug Fix",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Resolved a UI layout overlap on dashboard widgets by shifting the top-right header action links to the left of the absolute hoverable drag handles.",
    "descriptionBn": "ড্যাশবোর্ড উইজেটের শীর্ষে থাকা অ্যাকশন বাটনগুলোর মার্জিন অফসেট বাড়িয়ে দেওয়া হয়েছে, যার ফলে হোভার করা অবস্থায় ড্র্যাগ হ্যান্ডেলের সাথে কোনো ওভারল্যাপিং হবে না।"
  },
  {
    "id": "267",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Upgraded the Leave Balance widget to dynamically map any number of leave types, showing them inside a horizontally scrollable carousel with custom SVG radial progress gauges.",
    "descriptionBn": "লীভ ব্যালেন্স উইজেটটি আপডেট করে যেকোনো সংখ্যক লীভ টাইপ ডাইনামিক রেন্ডার করার সুবিধা এবং হরিজন্টাল স্ক্রলযোগ্য ক্যারোসেল ও SVG সার্কুলার গেজ যুক্ত করা হয়েছে।"
  },
  {
    "id": "266",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Optimized dashboard overview cards height to a uniform 310px, compressed paddings/gaps, reduced chart sizes, and restructured list contents to completely eliminate blank spaces.",
    "descriptionBn": "ড্যাশবোর্ড কার্ডের উচ্চতা পরিবর্তন করে ৩১০ পিক্সেল করা হয়েছে, ভেতরের প্যাডিং ও গ্যাপ কমানো হয়েছে, এবং ফাঁকা জায়গা দূর করে আরও কম্প্যাক্ট করা হয়েছে।"
  },
  {
    "id": "265",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Added a 'Reset Layout' button next to the Download Report header to restore the default dashboard overview widget sequence.",
    "descriptionBn": "ড্যাশবোর্ড ওভারভিউয়ের পূর্বনির্ধারিত উইজেট লেআউট পুনরায় ফিরে পাওয়ার জন্য হেডার সেকশনে 'Reset Layout' বাটন যুক্ত করা হয়েছে।"
  },
  {
    "id": "264",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Implemented dynamic drag-and-drop widget reordering on the main dashboard layout, added visual drag handles, and integrated aesthetic card borders/accents.",
    "descriptionBn": "ড্যাশবোর্ডের প্রধান লেআউটে ডাইনামিক ড্র্যাগ-অ্যান্ড-ড্রপ উইজেট রি-অর্ডারিং সুবিধা যুক্ত করা হয়েছে, ড্র্যাগ হ্যান্ডল ও আকর্ষণীয় কার্ড বর্ডার এক্সেন্টসহ সৌন্দর্যবর্ধন করা হয়েছে।"
  },
  {
    "id": "263",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Refactored top stats cards into a highly compact horizontal flex-row, placed Notice Board and Recent Messages cards prominently below stats, and shifted charts and upcoming events/leave balances down.",
    "descriptionBn": "টপ স্ট্যাটস কার্ডগুলোকে আরও কম্প্যাক্ট করা হয়েছে, স্ট্যাটসের ঠিক নিচে নোটিশ বোর্ড ও সাম্প্রতিক মেসেজ কার্ড স্থাপন করা হয়েছে, এবং অন্যান্য চার্ট ও উইজেট নিচে সরিয়ে সাজানো হয়েছে।"
  },
  {
    "id": "262",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "My Dashboard Layout",
    "link": "/my-dashboard",
    "descriptionEn": "Added a dynamic Notice Board widget card and interactive full-circular announcement preview letters to the Organization Overview dashboard layout.",
    "descriptionBn": "অর্গানাইজেশন ওভারভিউ ড্যাশবোর্ডে ডাইনামিক নোটিশ বোর্ড উইজেট কার্ড এবং ইন্টারেক্টিভ সার্কুলার প্রিভিউ লেটার যুক্ত করা হয়েছে।"
  },
  {
    "id": "261",
    "date": "2026-09-14T10:30",
    "type": "Bug Fix",
    "module": "Sidebar Navigation Layout",
    "link": "/module-selection",
    "descriptionEn": "Implemented synchronous state load from sessionStorage and an navigation lock state to prevent sidebar scroll jumping or menu resets on route navigation changes.",
    "descriptionBn": "মেনু নেভিগেশন পরিবর্তনের সময় সাইডবার স্ক্রল লাফানো এবং বন্ধ হওয়া রোধ করতে সিনক্রোনাস স্টেট লোড এবং ট্রানজিশন লকিং যুক্ত করা হয়েছে।"
  },
  {
    "id": "260",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Salary Increment History",
    "link": "/increment-history",
    "descriptionEn": "Mounted the complete 57 salary increment history mock records and set all year-by-year increment columns visible by default to match the target report visual layout.",
    "descriptionBn": "স্যালারি ইনক্রিমেন্ট হিস্ট্রি ডাটাবেজে ৫৭টি রেকর্ড লোড করা হয়েছে এবং সবগুলো কলাম ডিফল্টভাবে দৃশ্যমান করা হয়েছে যাতে সহজে সকল ঐতিহাসিক তথ্য দেখা যায়।"
  },
  {
    "id": "259",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Increment Report Workspace",
    "link": "/increment-report",
    "descriptionEn": "Implemented dynamic Increment Report page including the multi-parametric search filter console, side-scrolling reports table with green (lens) and orange (file sheet) preview icons, and modular appraisal letters popups.",
    "descriptionBn": "ডায়নামিক ইনক্রিমেন্ট রিপোর্ট পেজটি সফলভাবে তৈরি করা হয়েছে: যেখানে রয়েছে ফিল্টার সার্চ কনসোল, সাইড-স্ক্রোল ডাটা টেবিল, প্রিভিউ বাটন এবং ইন্টারেক্টিভ স্যালারি ইনক্রিমেন্ট/প্রমোশন লেটার মোডাল উইন্ডো।"
  },
  {
    "id": "258",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Proposed Increment List",
    "link": "/propose-increment",
    "descriptionEn": "Implemented side-scrolling table configuration for proposed increments list to display detailed compensation fields on a single line, fit column widths to content, and aligned mock records with correct base and increment arithmetic.",
    "descriptionBn": "প্রস্তাবিত ইনক্রিমেন্ট তালিকা পেজটি আপডেট করা হয়েছে: সব কলাম যাতে এক লাইনে সুন্দরভাবে দেখা যায় সেজন্য সাইড-স্ক্রোল সেট করা হয়েছে এবং বাস্তবসম্মত বেস স্যালারি ও ইনক্রিমেন্ট হিসেব মিলানো হয়েছে।"
  },
  {
    "id": "257",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Salary Increment Configurator",
    "link": "/increment",
    "descriptionEn": "Redesigned the single increment workspace to match the premium multiple increment visual scheme: implemented the exact dual-panel layout (Employee Details & Increment Details) with inline material underline input fields, interactive SHOW/SUBMIT triggers, and custom orange color configurations.",
    "descriptionBn": "সিঙ্গেল ইনক্রিমেন্ট ওয়ার্কস্পেসটি নতুন করে ডিজাইন করা হয়েছে: স্পেসিফিকেশন অনুযায়ী দুটি প্যানেল (কর্মচারীর তথ্য ও ইনক্রিমেন্ট তথ্য), ম্যাটেরিয়াল আন্ডারলাইন ফিল্ড, শো/সাবমিট ট্রিগার এবং দৃষ্টিনন্দন কমলা রঙের বাটন ব্যবহার করা হয়েছে।"
  },
  {
    "id": "256",
    "date": "2026-09-14T10:30",
    "type": "Business Logic",
    "module": "Final Settlement Configuration",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Enhanced Final Settlement: added options in Settlement Type Configuration to choose between Year Basis and Day Basis for calculations, along with a toggle to count the present day. When Day Basis is selected, the configuration table dynamically updates from Year/Month/Day columns to a single Min. Service Days field, and the engine evaluates tiers accordingly.",
    "descriptionBn": "ফাইনাল সেটেলমেন্টের হিসাব আরো উন্নত করা হয়েছে: সেটেলমেন্ট পলিসি কনফিগারেশনে বছর ভিত্তিক (Year Basis) বা দিন ভিত্তিক (Day Basis) হিসাব এবং বর্তমান দিন যুক্ত করার টগল যোগ করা হয়েছে। ডে বেসিস সিলেক্ট করলে কনফিগারেশন টেবিলটি বছর/মাস/দিনের কলাম থেকে পরিবর্তিত হয়ে শুধু 'Min. Service Days' ইনপুটে রূপান্তর হয়।"
  },
  {
    "id": "255",
    "date": "2026-09-14T10:30",
    "type": "UI / UX",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Completely redesigned the Employee Doc Verification page: cleaner table with live document progress bars, a polished full-screen review modal, fully functional Verify / Reject / Verify-All / Complete Verification buttons, a dedicated Reject Dialog with quick-reason presets and a custom text area, and an improved scan viewer with OCR match/mismatch highlighting.",
    "descriptionBn": "Employee Doc Verification পেজটি সম্পূর্ণ নতুন ডিজাইন করা হয়েছে। টেবিলে ডকুমেন্ট প্রগ্রেস বার যোগ হয়েছে, রিভিউ মডাল আরো পরিষ্কার ও প্রফেশনাল হয়েছে, Verify / Reject / Verify All / Complete Verification বাটন সঠিকভাবে কাজ করছে, Reject করার জন্য আলাদা ডায়ালগ বক্স এসেছে যেখানে প্রি-সেট রিজন এবং কাস্টম রিজন লেখার সুবিধা আছে, এবং স্ক্যান ভিউয়ারে OCR ম্যাচ ও মিসম্যাচ আরো স্পষ্টভাবে দেখা যায়।"
  },
  {
    "id": "254",
    "date": "2026-09-14T10:30",
    "type": "Business Logic",
    "module": "Final Settlement Configuration",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Made the Final Settlement compensation calculation fully dynamic: replaced 4 hardcoded day-bracket fields with a configurable 'Compensation Tiers' table (Year / Month / Day → Days per Year). HR can now add, edit, or remove tiers for each settlement type directly from the configuration page. The calculation engine reads from this config automatically.",
    "descriptionBn": "ফাইনাল সেটেলমেন্টের ক্ষতিপূরণ হিসাব এখন সম্পূর্ণ ডাইনামিক করা হয়েছে। আগের ৪টি হার্ডকোডেড ব্র্যাকেটের পরিবর্তে প্রতিটি সেটেলমেন্ট টাইপের জন্য 'Compensation Tiers' টেবিল তৈরি করা হয়েছে। HR নিজেই বছর/মাস/দিন অনুযায়ী যেকোনো টায়ার যোগ, সম্পাদনা বা মুছে ফেলতে পারবেন এবং হিসাব স্বয়ংক্রিয়ভাবে সেই কনফিগ অনুযায়ী হবে।"
  },
  {
    "id": "253",
    "date": "2026-09-14T10:30",
    "type": "Business Logic",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Updated Final Settlement compensation calculation to use exact Year + Month + Day business rules with 8 service tiers (SL1–SL8): e.g. 2Y 11M 30D+ → 7 days/yr, 3Y–8Y 11M → 15 days/yr, 9Y 11M 30D+ or 10Y+ → 30 days/yr. Now stores Month and Day service period fields alongside Year for precise tier matching.",
    "descriptionBn": "ফাইনাল সেটেলমেন্টের ক্ষতিপূরণ হিসাব এখন সঠিক বছর + মাস + দিনের ভিত্তিতে ৮টি সার্ভিস টায়ার (SL1–SL8) অনুযায়ী গণনা করা হবে। যেমন: ২ বছর ১১ মাস ৩০+ দিন → ৭ দিন/বছর, ৩–৮ বছর → ১৫ দিন/বছর, ৯ বছর ১১ মাস ৩০+ দিন বা ১০+ বছর → ৩০ দিন/বছর।"
  },
  {
    "id": "252",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Employee Doc Verification",
    "link": "/employee-doc-verification",
    "descriptionEn": "Created the Employee Doc Verification page with interactive side-by-side OCR scan review console and individual verification actions (Approve/Reject) per document. Added approvals menu item and topbar integration.",
    "descriptionBn": "কর্মচারীদের আপলোডকৃত প্রয়োজনীয় কাগজপত্র ও সার্টিফিকেট যাচাইয়ের জন্য 'Employee Doc Verification' ফিচার যুক্ত করা হয়েছে যেখানে প্রতিটি ডকুমেন্ট আলাদা আলাদাভাবে (অ্যাপ্রুভ/রিজেক্ট) যাচাই করা যাবে এবং ডাইনামিক এআই-ওসিআর স্ক্যান ভিউয়ারের মাধ্যমে তুলনা করা যাবে।"
  },
  {
    "id": "251",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Final Settlement Configuration",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Upgraded all configuration lists to fully responsive, clean HTML tables, resolving layout wraps and headers misalignment. Formatted compensation rate columns with robust fallback checks.",
    "descriptionBn": "কনফিগারেশন তালিকার গ্রিড পরিবর্তন করে দৃষ্টিনন্দন ও রেসপনসিভ HTML টেবিলে রূপান্তর করা হয়েছে, যার ফলে কলামের মিস-অ্যালাইনমেন্ট সমস্যা সমাধান হয়েছে।"
  },
  {
    "id": "250",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Upgraded the detail print view header with a clean flex layout displaying the employee's ID badge photo. Expanded the mock profiles database to allow real-time calculations and accurate photo loads for all listed users.",
    "descriptionBn": "ডিটেইল প্রিন্ট ভিউ হেডার উন্নত করে কর্মচারীর আইডি ব্যাজ ছবি প্রদর্শনের ব্যবস্থা করা হয়েছে। এছাড়াও সকল কর্মচারীর জন্য রিয়েল-টাইম হিসাবনিকাশ এবং সঠিক ছবি লোড করার জন্য ডেটাবেস প্রসারিত করা হয়েছে।"
  },
  {
    "id": "249",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Added diverse mock settlement records with varying settlement types (Resignation, Termination, Retirement, Dismissal, Death) and configured custom color status badges in the list view.",
    "descriptionBn": "লিস্ট ভিউতে বিভিন্ন ক্যাটাগরির ফাইনাল সেটেলমেন্ট রেকর্ড (পদত্যাগ, ছাঁটাই, অবসর, বরখাস্ত, মৃত্যু) যুক্ত করা হয়েছে এবং প্রতিটি ক্যাটাগরির জন্য কাস্টম রঙের স্ট্যাটাস ব্যাজ ডাইনামিকালি দেখানোর ব্যবস্থা করা হয়েছে।"
  },
  {
    "id": "248",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Added a styled employee photo avatar slot to the Employee Information panel, displaying mock profiles photos for loaded users.",
    "descriptionBn": "এমপ্লয়ি ইনফরমেশন প্যানেলে এমপ্লয়ি ছবির জন্য একটি দৃষ্টিনন্দন প্রোফাইল স্লট যুক্ত করা হয়েছে এবং ব্যবহারকারী পরিবর্তনের সাথে সাথে স্বয়ংক্রিয়ভাবে ছবি পরিবর্তিত হয়।"
  },
  {
    "id": "247",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Added accordion toggles to all final settlement sections. Toggling a section's header or checkbox expands/collapses the card and dynamically updates calculations to exclude unchecked sections.",
    "descriptionBn": "ফাইনাল সেটেলমেন্টের সব কার্ডে অ্যাকোর্ডিয়ান টগল যুক্ত করা হয়েছে। কোনো সেকশনের হেডার বা চেক বক্স টগল করলে কার্ডটি প্রসারিত/সংকুচিত হবে এবং আনচেক করা সেকশন স্বয়ংক্রিয়ভাবে ক্যালকুলেশন থেকে বাদ যাবে।"
  },
  {
    "id": "246",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Polished and modernized the Salary Information, Earn Leave Encashment, Service Benefit, Compensation Additions, and Deductions sections on the Final Settlement form. Replaced raw tables and flat text with custom stat cards, badge elements, structured layouts, and currency formatting for a highly professional view.",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট ফর্মের স্যালারি ইনফরমেশন, অর্জিত ছুটি নগদীকরণ, সার্ভিস বেনিফিট, অতিরিক্ত ক্ষতিপূরণ এবং ডিডাকশন সেকশনগুলোর ডিজাইন আধুনিক ও দৃষ্টিনন্দন করা হয়েছে। প্লেইন টেবিল ও টেক্সটের পরিবর্তে কাস্টম স্ট্যাট কার্ড, ব্যাজ এলিমেন্ট, পরিপাটি লেআউট এবং লোকাল কারেন্সি ফরম্যাটিং যুক্ত করা হয়েছে।"
  },
  {
    "id": "245",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Implemented dynamic calculations for Notice Pay, Notice Shortage Deduction, Tiered Service Compensation, Earned Leave Encashment, and Provident Fund payout using live configurations stored in LocalStorage. Added three mock employee profiles (Tahmid Afsar, Anika Rahman, Sabbir Ahmed) to showcase various service lengths and rule combinations.",
    "descriptionBn": "লোকাল স্টোরেজে সংরক্ষিত সেটিংস ব্যবহার করে নোটিশ পে, নোটিশ শর্টেজ ডিডাকশন, সার্ভিস লেন্থভিত্তিক ক্ষতিপূরণ, অর্জিত ছুটি নগদীকরণ এবং প্রভিডেন্ট ফান্ড পেমেন্টের ডায়নামিক ক্যালকুলেশন ইঞ্জিন চালু করা হয়েছে। বিভিন্ন মেয়াদের এবং নিয়মের ব্যবহার প্রদর্শনের জন্য তিনটি ডেমো এমপ্লয়ি প্রোফাইল (তাহমিদ আফসার, আনিকা রহমান, সাব্বির আহমেদ) যুক্ত করা হয়েছে।"
  },
  {
    "id": "244",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Redesigned the Configuration & Records section of the Final Settlement form. Reorganized all inputs (Employee ID, dates, and settings) into a single, cohesive, modern 6-column responsive grid layout with a polished header, and placed the 'Load' button inline with the Employee ID input.",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট ফর্মের 'কনফিগারেশন ও রেকর্ডস' সেকশনটির ডিজাইন পরিবর্তন করা হয়েছে। সব ইনপুট ফিল্ডকে (এমপ্লয়ি আইডি, তারিখ এবং অন্যান্য সেটিংস) একটি আধুনিক ও সুন্দর ৬-কলাম রেসপন্সিভ গ্রিড লেআউটে সাজানো হয়েছে এবং 'Load' বাটনটিকে এমপ্লয়ি আইডি ইনপুটের পাশে যুক্ত করা হয়েছে।"
  },
  {
    "id": "243",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Final Settlement",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Removed the BLA 2006 Quick Reference statutory guide sections from the Notice Period Policy and Service Period Policy creation/edit modals.",
    "descriptionBn": "নোটিশ পিরিয়ড এবং সার্ভিস পিরিয়ড পলিসি তৈরির মোডালগুলো থেকে বিএলএ ২০০৬ কুইক রেফারেন্স গাইড সেকশনগুলো বাদ দেওয়া হয়েছে।"
  },
  {
    "id": "242",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Final Settlement",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Reorganized the Compensation and Gratuity configuration input fields from a single line into a neat two-line layout inside the modal for a cleaner and better view.",
    "descriptionBn": "মোডালের ভেতরে ক্ষতিপূরণ এবং গ্র্যাচুইটি কনফিগারেশনের ইনপুট ফিল্ডগুলোকে এক লাইনের বদলে সুন্দরভাবে দুই লাইনে সাজানো হয়েছে যেন দেখতে ও ব্যবহার করতে আরও সুবিধা হয়।"
  },
  {
    "id": "241",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Compensation Days/Year now supports 4 tiers: 3+ years, 5+ years, under 10 years, and 10+ years. HR can now configure custom compensation rates for each service length bracket per settlement type.",
    "descriptionBn": "কমপেনসেশন ডেজ/ইয়ার এখন ৪টি স্তরে ভাগ করা হয়েছে: ৩+ বছর, ৫+ বছর, ১০ বছরের নিচে এবং ১০+ বছর। এইচআর এখন প্রতিটি সেটেলমেন্ট টাইপের জন্য প্রতিটি সার্ভিস দৈর্ঘ্যের জন্য আলাদা রেট সেট করতে পারবেন।"
  },
  {
    "id": "240",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Deep legal analysis completed: all 12 Final Settlement Types, 8 Notice Period policies, and 9 Service Period rules are now fully aligned with the Bangladesh Labour Act, 2006 (amended 2013). Each type now carries a legal BLA section reference, two-tier compensation rates (<10 yrs / ≥10 yrs), separate flags for Gratuity, PF, Earned Leave, Misconduct, and Death in Service — all editable by HR.",
    "descriptionBn": "গভীর আইনি বিশ্লেষণ সম্পন্ন: সকল ১২টি ফাইনাল সেটেলমেন্ট টাইপ, ৮টি নোটিশ পিরিয়ড নীতি এবং ৯টি সার্ভিস পিরিয়ড নিয়ম এখন বাংলাদেশ শ্রম আইন ২০০৬ (সংশোধিত ২০১৩) অনুযায়ী সম্পূর্ণভাবে আপডেট করা হয়েছে। প্রতিটি টাইপে এখন আইনি ধারার রেফারেন্স, দুই স্তরের ক্ষতিপূরণের হার, গ্র্যাচুইটি, পিএফ, অর্জিত ছুটির এনক্যাশমেন্ট, অসদাচরণ এবং মৃত্যুজনিত কেসের জন্য আলাদা সুইচ রয়েছে — যা এইচআর নিজেই পরিচালনা করতে পারবেন।"
  },
  {
    "id": "239",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Notice Period Policies and Service Period Requirements are now fully dynamic. HR can manage exact rules based on employee types, payment basis, and specific benefit types like Gratuity and Leave Encashment.",
    "descriptionBn": "নোটিশ পিরিয়ড এবং সার্ভিস পিরিয়ডের নিয়মগুলি এখন সম্পূর্ণ ডাইনামিক। এইচআর এখন কর্মীর ধরন এবং পেমেন্টের ভিত্তি অনুযায়ী নোটিশের নিয়ম এবং গ্র্যাচুইটির মতো সুবিধার জন্য ন্যূনতম সার্ভিসের সময়কাল পরিচালনা করতে পারবেন।"
  },
  {
    "id": "238",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Implemented fully dynamic Final Settlement Policy configuration. HR can now add, edit, and manage custom settlement types with specific notice periods, compensation rules, and leave encashment settings based on Bangladesh Labour Act.",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট পলিসি কনফিগারেশন সম্পূর্ণ ডাইনামিক করা হয়েছে। এইচআর এখন বাংলাদেশ শ্রম আইন অনুযায়ী কাস্টম সেটেলমেন্ট টাইপ যোগ এবং এডিট করতে পারবেন, যেখানে নোটিশ পিরিয়ড এবং ক্ষতিপূরণের নিয়ম সেট করা যাবে।"
  },
  {
    "id": "237",
    "date": "2026-09-14T10:30",
    "type": "Feature Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Updated Final Settlement module to align with Bangladesh Labour Act standards. Separated Settlement Types from Components, introduced 12 distinct settlement types, and implemented dynamic demo calculations for Resignation, Termination, Dismissal, Retirement, etc.",
    "descriptionBn": "বাংলাদেশ শ্রম আইন অনুযায়ী ফাইনাল সেটেলমেন্ট মডিউল আপডেট করা হয়েছে। সেটেলমেন্ট টাইপ এবং কম্পোনেন্ট আলাদা করা হয়েছে, ১২টি ভিন্ন টাইপ যুক্ত করা হয়েছে এবং রিজাইন, টার্মিনেশন, ডিসমিসাল ইত্যাদির জন্য ডাইনামিক ক্যালকুলেশন যোগ করা হয়েছে।"
  },
  {
    "id": "236",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Final Settlement",
    "link": "/final-settlement",
    "descriptionEn": "Redesigned the Final Settlement execution page. Transformed the layout into a clean, modern, flat UI featuring unified grid-based data fields, colorful distinct sections for benefits/deductions, and borderless bottom-lined inputs for an elevated aesthetic experience.",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট এক্সিকিউশন পেজটির ডিজাইন আপডেট করা হয়েছে। সম্পূর্ণ পেজটিকে এখন একটি মডার্ন, ফ্ল্যাট ইউআই-তে রূপান্তর করা হয়েছে যেখানে গ্রিড লেআউট, আকর্ষণীয় রঙের সেকশন এবং সুন্দর বর্ডারলেস ইনপুট ব্যবহার করা হয়েছে।"
  },
  {
    "id": "235",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Final Settlement",
    "link": "/final-settlement-configuration",
    "descriptionEn": "Added a new Final Settlement Configuration page with three tabs: Notice Deduction, Final Settlement Type, and Service Period Setup. Users can now easily customize settings and save configurations.",
    "descriptionBn": "ফাইনাল সেটেলমেন্ট কনফিগারেশনের জন্য একটি নতুন পেজ যোগ করা হয়েছে যেখানে তিনটি ট্যাব রয়েছে: নোটিশ ডিডাকশন, ফাইনাল সেটেলমেন্ট টাইপ এবং সার্ভিস পিরিয়ড সেটআপ। এখন খুব সহজেই কনফিগারেশন পরিবর্তন এবং সেভ করা যাবে।"
  },
  {
    "id": "234",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "System Settings",
    "link": "/changes",
    "descriptionEn": "Fixed a typing issue where 'UX Optimization' was missing from the list of allowed change types.",
    "descriptionBn": "সিস্টেম আপডেটের তালিকায় 'UX Optimization' টাইপটি অপশন হিসেবে না থাকার সমস্যাটি সমাধান করা হয়েছে।"
  },
  {
    "id": "233",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Payroll Reports",
    "link": "/monthly-salary-details",
    "descriptionEn": "Created the new 'Monthly Salary Details' report page. Added advanced filter options (Year, Month, Department, etc.), populated the datatable with real-time employee salary structures, and integrated a comprehensive suite of report generation action buttons at the bottom.",
    "descriptionBn": "নতুন 'Monthly Salary Details' রিপোর্ট পেইজ তৈরি করা হয়েছে। এখানে অ্যাডভান্সড ফিল্টার অপশন (Year, Month, Department, ইত্যাদি) যোগ করা হয়েছে, এমপ্লয়ি স্যালারি স্ট্রাকচার দিয়ে ডাটাটেবিল আপডেট করা হয়েছে, এবং পেইজের নিচে রিপোর্ট জেনারেট করার জন্য প্রয়োজনীয় সব অ্যাকশন বাটন যুক্ত করা হয়েছে।"
  },
  {
    "id": "232",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Implemented a structured table layout for the Loan Terms & Details section inside the details modal. Utilizes a light-gray table header and borderless table row design matching the styling of the other master data tables.",
    "descriptionBn": "à¦²à§‹à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦²à§‹à¦¨ à¦Ÿà¦¾à¦°à§�à¦®à¦¸ à¦…à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦¸à§‡à¦•à¦¶à¦¨à¦Ÿà¦¿ à¦Ÿà§‡à¦¬à¦¿à¦² à¦«à¦°à¦®à§�à¦¯à¦¾à¦Ÿà§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦Ÿà¦¿à¦¤à§‡ à¦²à¦¾à¦‡à¦Ÿ-à¦—à§�à¦°à§‡ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¹à§‡à¦¡à¦¾à¦° à¦�à¦¬à¦‚ à¦¬à¦°à§�à¦¡à¦¾à¦°à¦¹à§€à¦¨ à¦Ÿà§‡à¦¬à¦¿à¦² à¦°à§‹ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾ à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦®à§‡à¦° à¦…à¦¨à§�à¦¯ à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦¡à§‡à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦²à¦—à§�à¦²à§‹à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à¦¾à¦®à¦žà§�à¦œà¦¸à§�à¦¯à¦ªà§‚à¦°à§�à¦£à¥¤"
  },
  {
    "id": "231",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Refined the Loan Terms details grid layout for a cleaner and more professional presentation. Replaced spreadsheet-like vertical divider lines with an aligned borderless grid system, and standardized all value colors and font sizes to prevent a clashing layout.",
    "descriptionBn": "à¦²à§‹à¦¨ à¦Ÿà¦¾à¦°à§�à¦®à¦¸ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸à§‡à¦° à¦²à§‡à¦†à¦‰à¦Ÿà¦Ÿà¦¿ à¦†à¦°à¦“ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à¦“ à¦ªà¦°à¦¿à¦šà§�à¦›à¦¨à§�à¦¨ à¦•à¦°à¦¤à§‡ à¦°à¦¿à¦«à¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¸à§�à¦ªà§�à¦°à§‡à¦¡à¦¶à¦¿à¦Ÿà§‡à¦° à¦®à¦¤à§‹ à¦…à¦¨à¦®à¦¨à§€à§Ÿ à¦–à¦¾à¦�à§œà¦¾ à¦¬à¦¿à¦­à¦¾à¦œà¦• à¦°à§‡à¦–à¦¾ à¦¸à¦°à¦¿à§Ÿà§‡ à¦�à¦•à¦Ÿà¦¿ à¦¸à¦¾à¦¬à¦²à§€à¦² à¦¬à¦°à§�à¦¡à¦¾à¦°à¦¹à§€à¦¨ à¦—à§�à¦°à¦¿à¦¡ à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦® à¦ªà§�à¦°à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¸à¦¬ à¦®à¦¾à¦¨à¦—à§�à¦²à§‹à¦° à¦«à¦¨à§�à¦Ÿ à¦¸à¦¾à¦‡à¦œ à¦“ à¦°à¦™ à¦�à¦•à¦‡ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦•à¦¾à¦²à¦¾à¦° à¦•à§�à¦²à§�à¦¯à¦¾à¦¶ à¦¨à¦¾ à¦¹à§Ÿà¥¤"
  },
  {
    "id": "230",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Separated main tabs content sections in the details modal using clean horizontal dividers. Replaced blocky nested white cards in the timeline, projections, and comments sections with borderless flat areas divided by thin solid separator lines for a more professional, cohesive layout.",
    "descriptionBn": "à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦®à§‚à¦² à¦¸à§‡à¦•à¦¶à¦¨à¦—à§�à¦²à§‹à¦•à§‡ à¦ªà¦°à¦¿à¦šà§�à¦›à¦¨à§�à¦¨ à¦¹à¦°à¦¾à¦‡à¦œà¦¨à§�à¦Ÿà¦¾à¦² à¦¡à¦¿à¦­à¦¾à¦‡à¦¡à¦¾à¦° à¦¦à¦¿à§Ÿà§‡ à¦†à¦²à¦¾à¦¦à¦¾ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦Ÿà¦¾à¦‡à¦®à¦²à¦¾à¦‡à¦¨, à¦ªà§�à¦°à§‹à¦œà§‡à¦•à¦¶à¦¨ à¦“ à¦•à¦®à§‡à¦¨à§�à¦Ÿà¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡à¦° à¦šà¦¾à¦°à¦ªà¦¾à¦¶à§‡à¦° à¦¬à§�à¦¯à¦¾à¦•à¦—à§�à¦°à¦¾à¦‰à¦¨à§�à¦¡ à¦•à¦¾à¦°à§�à¦¡ à¦“ à¦¬à¦°à§�à¦¡à¦¾à¦° à¦¸à¦°à¦¿à§Ÿà§‡ à¦ªà¦¾à¦¤à¦²à¦¾ à¦¸à§‹à¦œà¦¾ à¦¬à¦¿à¦­à¦¾à¦œà¦• à¦°à§‡à¦–à¦¾ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾ à¦¦à§‡à¦–à¦¤à§‡ à¦†à¦°à¦“ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à¦“ à¦—à§‹à¦›à¦¾à¦¨à§‹à¥¤"
  },
  {
    "id": "229",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Polished the details modal styling for a cleaner and less bulky aesthetic. Reduced typography weights (replaced heavy font-black with font-bold or font-semibold), consolidated font sizes (made details metrics flat text-base), and compacted modal frames, headers, switcher containers, and footer buttons.",
    "descriptionBn": "à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦‡à¦‰à¦œà¦¾à¦° à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à¦«à§‡à¦¸ à¦†à¦°à¦“ à¦ªà¦°à¦¿à¦šà§�à¦›à¦¨à§�à¦¨ à¦“ à¦¹à¦¾à¦²à¦•à¦¾ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦«à¦¨à§�à¦Ÿà§‡à¦° à¦“à¦­à¦¾à¦°-à¦¬à§‹à¦²à§�à¦¡à¦¨à§‡à¦¸ à¦•à¦®à¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡ (à¦­à¦¾à¦°à§€ à¦«à¦¨à§�à¦Ÿ-à¦¬à§�à¦²à§�à¦¯à¦¾à¦• à¦¸à¦°à¦¿à§Ÿà§‡ à¦«à¦¨à§�à¦Ÿ-à¦¬à§‹à¦²à§�à¦¡ à¦¬à¦¾ à¦¸à§‡à¦®à¦¿à¦¬à§‹à¦²à§�à¦¡ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡), à¦«à¦¨à§�à¦Ÿ à¦¸à¦¾à¦‡à¦œ à¦¸à¦¾à¦®à¦žà§�à¦œà¦¸à§�à¦¯à¦ªà§‚à¦°à§�à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ (à¦®à§‡à¦Ÿà§�à¦°à¦¿à¦•à§�à¦¸ à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ-à¦¬à§‡à¦¸ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡), à¦�à¦¬à¦‚ à¦®à§‹à¦¡à¦¾à¦² à¦¹à§‡à¦¡à¦¾à¦°, à¦Ÿà§�à¦¯à¦¾à¦¬ à¦¸à§�à¦‡à¦š à¦�à¦¬à¦‚ à¦«à§�à¦Ÿà¦¾à¦° à¦¬à¦¾à¦Ÿà¦¨à¦—à§�à¦²à§‹à¦•à§‡ à¦†à¦°à¦“ à¦•à¦®à¦ªà§�à¦¯à¦¾à¦•à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "228",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Redesigned the Loan Terms & Details section inside the details modal to a clean, flat, borderless design. Replaced blocky card panels with a horizontal metrics bar separated by clean vertical dividers, and flat inline text indicators to reduce card fatigue.",
    "descriptionBn": "à¦²à§‹à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦²à§‹à¦¨ à¦Ÿà¦¾à¦°à§�à¦®à¦¸ à¦…à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦¸à§‡à¦•à¦¶à¦¨à¦Ÿà¦¿ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦•à¦¾à¦°à§�à¦¡-à¦®à§�à¦•à§�à¦¤ à¦�à¦¬à¦‚ à¦«à§�à¦²à§�à¦¯à¦¾à¦Ÿ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¬à§�à¦²à¦• à¦¬à§�à¦¯à¦¾à¦•à¦—à§�à¦°à¦¾à¦‰à¦¨à§�à¦¡ à¦“ à¦¬à¦•à§�à¦¸ à¦¬à¦°à§�à¦¡à¦¾à¦°à§‡à¦° à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à§‡ à¦�à¦¤à§‡ à¦®à¦¿à¦¨à¦¿à¦®à¦¾à¦²à¦¿à¦¸à§�à¦Ÿà¦¿à¦• à¦¡à¦Ÿ/à¦²à¦¾à¦‡à¦¨ à¦¬à¦¿à¦­à¦¾à¦œà¦•à¦¯à§�à¦•à§�à¦¤ à¦¹à¦°à¦¾à¦‡à¦œà¦¨à§�à¦Ÿà¦¾à¦² à¦®à§‡à¦Ÿà§�à¦°à¦¿à¦•à§�à¦¸ à¦¬à¦¾à¦° à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾ à¦¦à§‡à¦–à¦¤à§‡ à¦†à¦°à¦“ à¦†à¦§à§�à¦¨à¦¿à¦• à¦“ à¦ªà¦°à¦¿à¦šà§�à¦›à¦¨à§�à¦¨à¥¤"
  },
  {
    "id": "227",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Redesigned the Loan Terms & Details section inside the Loan details modal into a split-layout comparative dashboard. Features a visual loan amount allocation panel with a dynamic progress bar on the left, and a high-contrast dark-slate repayment overview sidebar card on the right.",
    "descriptionBn": "à¦²à§‹à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦²à§‹à¦¨ à¦Ÿà¦¾à¦°à§�à¦®à¦¸ à¦…à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦¸à§‡à¦•à¦¶à¦¨à¦Ÿà¦¿ à¦¸à§�à¦ªà§�à¦²à¦¿à¦Ÿ-à¦²à§‡à¦†à¦‰à¦Ÿ à¦¡à§�à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§�à¦¡à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¬à¦¾à¦® à¦ªà¦¾à¦¶à§‡ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦• à¦ªà§�à¦°à§‹à¦—à§�à¦°à§‡à¦¸ à¦¬à¦¾à¦°à¦¸à¦¹ à¦²à§‹à¦¨ à¦…à§�à¦¯à¦¾à¦²à§‹à¦•à§‡à¦¶à¦¨ à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦² à¦�à¦¬à¦‚ à¦¡à¦¾à¦¨ à¦ªà¦¾à¦¶à§‡ à¦¹à¦¾à¦‡-à¦•à¦¨à¦Ÿà§�à¦°à¦¾à¦¸à§�à¦Ÿ à¦¡à¦¾à¦°à§�à¦•-à¦¸à§�à¦²à§‡à¦Ÿ à¦°à¦¿à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦•à¦¾à¦°à§�à¦¡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "226",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Company Setup",
    "link": "/company-setup?tab=payslip",
    "descriptionEn": "Updated the Employee Type dropdown in the Payslip Template configuration to standard categories (Worker, Office Executive, Staff). Added a smart conditional OT Type selection (e.g. 2hrs OT, 3hrs OT) that elegantly animates in whenever 'Worker' is selected, making template designation highly specific and professional.",
    "descriptionBn": "পে স্লিপ টেমপ্লেট তৈরির সময় এমপ্লয়ি টাইপ অপশনগুলো পরিবর্তন করে (Worker, Office Executive, Staff) করা হয়েছে। এছাড়াও যখন 'Worker' সিলেক্ট করা হবে, তখন স্বয়ংক্রিয়ভাবে একটি স্মার্ট OT Type অপশন (যেমন- 2hrs OT, 3hrs OT) অ্যানিমেশন সহ প্রদর্শিত হবে, যা টেমপ্লেটগুলোকে আরও স্পেসিফিক এবং প্রফেশনাল করবে।"
  },
  {
    "id": "225",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Added inline editing for Approved Amount and Installment Terms inside the Loan details modal. Editing dynamically updates the calculations, monthly rate, and amortization projections in real time. Redesigned the tab switcher for full width container aesthetics and enhanced the details card formatting.",
    "descriptionBn": "à¦²à§‹à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦®à§‹à¦¡à¦¾à¦²à§‡ à¦…à¦¨à§�à¦®à§‹à¦¦à¦¿à¦¤ à¦ªà¦°à¦¿à¦®à¦¾à¦£ (Approved Amount) à¦�à¦¬à¦‚ à¦•à¦¿à¦¸à§�à¦¤à¦¿à¦° à¦®à§‡à§Ÿà¦¾à¦¦ (Installment Terms) à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦�à¦¡à¦¿à¦Ÿ à¦•à¦°à¦¾à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦¡à¦¿à¦Ÿ à¦•à¦°à¦¾à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à¦¾à¦¥à§‡ à¦¹à¦¿à¦¸à¦¾à¦¬à¦•à§ƒà¦¤ à¦®à¦¾à¦¸à¦¿à¦• à¦šà¦¾à¦°à§�à¦œ à¦“ à¦…à§�à¦¯à¦¾à¦®à§‹à¦°à¦Ÿà¦¾à¦‡à¦œà§‡à¦¶à¦¨ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¸à§�à¦¬à§Ÿà¦‚à¦•à§�à¦°à¦¿à§Ÿà¦­à¦¾à¦¬à§‡ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦¹à¦¬à§‡à¥¤ à¦�à¦›à¦¾à§œà¦¾ à¦Ÿà§�à¦¯à¦¾à¦¬ à¦¸à§�à¦‡à¦šà¦¾à¦°à¦•à§‡ à¦«à§�à¦²-à¦‰à¦‡à¦¡à¦¥ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦•à¦¾à¦°à§�à¦¡à§‡à¦° à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦†à¦°à¦“ à¦†à¦•à¦°à§�à¦·à¦£à§€à§Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "224",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Upgraded the All Approvals page by adding a prominent 'View' button for all approval requests and making the new Modal design accessible across all module types (Leave, Advance, Increment, etc.), instead of just Loan requests.",
    "descriptionBn": "à¦¸à¦•à¦² à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦ªà§‡à¦œà§‡ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦ªà¦·à§�à¦Ÿ 'View' à¦¬à¦¾à¦Ÿà¦¨ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¨à¦¤à§�à¦¨ à¦®à§‹à¦¡à¦¾à¦² à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à¦Ÿà¦¿ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° à¦²à§‹à¦¨à§‡à¦° à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à§‡ à¦�à¦–à¦¨ à¦¸à¦¬ à¦§à¦°à¦¨à§‡à¦° à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° (à¦²à¦¿à¦­, à¦…à§�à¦¯à¦¾à¦¡à¦­à¦¾à¦¨à§�à¦¸, à¦‡à¦¨à¦•à§�à¦°à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦‡à¦¤à§�à¦¯à¦¾à¦¦à¦¿) à¦°à¦¿à¦•à§�à§Ÿà§‡à¦¸à§�à¦Ÿ à¦¦à§‡à¦–à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "223",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Central Approvals",
    "link": "/all-approvals",
    "descriptionEn": "Designed and integrated an interactive Loan Approval View Modal in the All Approvals page. It presents comprehensive loan summary data, terms, repayment metrics, zero-interest amortization projections table, approval flow timeline cards, and comments/notes history using a modern card-based modal interface.",
    "descriptionBn": "à¦…à¦² à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦²à¦¸ à¦ªà§‡à¦œà§‡ à¦�à¦•à¦Ÿà¦¿ à¦†à¦•à¦°à§�à¦·à¦£à§€à§Ÿ à¦²à§‹à¦¨ à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦² à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦“ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦²à§‹à¦¨à§‡à¦° à¦¸à¦‚à¦•à§�à¦·à¦¿à¦ªà§�à¦¤ à¦¬à¦¿à¦¬à¦°à¦£, à¦¶à¦°à§�à¦¤à¦¾à¦¬à¦²à§€, à§ª-à§§à§¦ à¦®à¦¾à¦¸à§‡à¦° à¦°à¦¿-à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦®à§‡à¦Ÿà§�à¦°à¦¿à¦•à§�à¦¸, à¦œà¦¿à¦°à§‹-à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à§‡à¦¸à§�à¦Ÿ à¦…à§�à¦¯à¦¾à¦®à§‹à¦°à¦Ÿà¦¾à¦‡à¦œà§‡à¦¶à¦¨ à¦¸à¦¿à¦¡à¦¿à¦‰à¦² à¦Ÿà§‡à¦¬à¦¿à¦², à¦¸à§�à¦Ÿà§‡à¦ª-à¦¬à¦¾à¦‡-à¦¸à§�à¦Ÿà§‡à¦ª à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦² à¦«à§�à¦²à§‹ à¦Ÿà¦¾à¦‡à¦®à¦²à¦¾à¦‡à¦¨ à¦�à¦¬à¦‚ à¦•à¦®à§‡à¦¨à§�à¦Ÿ/à¦¨à§‹à¦Ÿà¦¸ à¦¹à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦�à¦•à¦¨à¦œà¦°à§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "222",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Company Setup",
    "link": "/company-setup?tab=payslip",
    "descriptionEn": "Polished the Payslip Templates Setup page for better UI/UX. Improved the empty state with a dedicated icon, added modern focus rings to all form inputs, redesigned the English/Bangla toggle switch, added clear action icons to all buttons, and included a success notification when a new template is created.",
    "descriptionBn": "à¦ªà§‡ à¦¸à§�à¦²à¦¿à¦ª à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿ à¦¸à§‡à¦Ÿà¦†à¦ª à¦ªà§‡à¦œà§‡à¦° à¦‡à¦‰à¦œà¦¾à¦° à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à¦«à§‡à¦¸ à¦†à¦°à¦“ à¦†à¦•à¦°à§�à¦·à¦£à§€à§Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¨à¦¤à§�à¦¨ à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿ à¦¨à¦¾ à¦¥à¦¾à¦•à¦²à§‡ à¦¸à§‡à¦–à¦¾à¦¨à§‡ à¦¸à§�à¦¨à§�à¦¦à¦° à¦†à¦‡à¦•à¦¨ à¦¸à¦®à§�à¦¬à¦²à¦¿à¦¤ à¦�à¦®à§�à¦ªà¦Ÿà¦¿ à¦¸à§�à¦Ÿà§‡à¦Ÿ à¦¦à§‡à¦–à¦¾à¦¨à§‹ à¦¹à¦šà§�à¦›à§‡à¥¤ à¦«à¦°à§�à¦®à§‡à¦° à¦¸à¦¬ à¦‡à¦¨à¦ªà§�à¦Ÿà§‡ à¦®à¦¡à¦¾à¦°à§�à¦¨ à¦«à§‹à¦•à¦¾à¦¸ à¦°à¦¿à¦‚ à¦�à¦¬à¦‚ à¦¸à¦¬ à¦¬à¦¾à¦Ÿà¦¨à§‡ à¦¨à¦¤à§�à¦¨ à¦†à¦‡à¦•à¦¨ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦›à¦¾à§œà¦¾ à¦¨à¦¤à§�à¦¨ à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿ à¦¤à§ˆà¦°à¦¿à¦° à¦¸à¦®à§Ÿ à¦¸à¦¾à¦•à¦¸à§‡à¦¸ à¦®à§‡à¦¸à§‡à¦œ à¦¦à§‡à¦–à¦¾à¦¨à§‹à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "221",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Company Setup",
    "link": "/company-setup?tab=payslip",
    "descriptionEn": "Upgraded the Payslip Configuration system to be template-based. Users can now view a list of templates, create new templates targeting specific companies and employee types, configure custom field names/visibilities for each template individually, and manage them via an interactive list and configure workflow.",
    "descriptionBn": "à¦ªà§‡ à¦¸à§�à¦²à¦¿à¦ª à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦®à¦•à§‡ à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿ à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦°à¦¾ à¦�à¦–à¦¨ à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿ à¦�à¦¬à¦‚ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦Ÿà¦¾à¦‡à¦ªà§‡à¦° à¦œà¦¨à§�à¦¯ à¦¨à¦¤à§�à¦¨ à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨, à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿà§‡à¦° à¦«à¦¿à¦²à§�à¦¡à§‡à¦° à¦¨à¦¾à¦® à¦“ à¦­à¦¿à¦œà¦¿à¦¬à¦¿à¦²à¦¿à¦Ÿà¦¿ à¦†à¦²à¦¾à¦¦à¦¾à¦­à¦¾à¦¬à§‡ à¦•à¦¾à¦¸à§�à¦Ÿà¦®à¦¾à¦‡à¦œ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨ à¦�à¦¬à¦‚ à¦²à¦¿à¦¸à§�à¦Ÿ à¦­à¦¿à¦‰ à¦¥à§‡à¦•à§‡ à¦�à¦—à§�à¦²à§‹ à¦ªà¦°à¦¿à¦šà¦¾à¦²à¦¨à¦¾ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "220",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Company Setup",
    "link": "/company-setup?tab=payslip",
    "descriptionEn": "Implemented a fully dynamic Payslip Configuration tab within the Company Setup page. Users can edit English and Bengali names/labels for all working status, earning, and deduction fields, customize visibility toggles per company, and view real-time pay slip mockups in both English and Bengali with a mathematically consistent preview totaling 165,000 Net Payment.",
    "descriptionBn": "à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿ à¦¸à§‡à¦Ÿà¦†à¦ª à¦ªà§‡à¦œà§‡à¦° à¦­à§‡à¦¤à¦°à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦• à¦ªà§‡à¦¸à¦²à¦¿à¦ª à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦Ÿà§�à¦¯à¦¾à¦¬ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿à¦° à¦•à¦¾à¦œà§‡à¦° à¦…à¦¬à¦¸à§�à¦¥à¦¾, à¦†à§Ÿ à¦�à¦¬à¦‚ à¦•à¦°à§�à¦¤à¦¨à§‡à¦° à¦¸à¦•à¦² à¦«à¦¿à¦²à§�à¦¡à§‡à¦° à¦‡à¦‚à¦°à§‡à¦œà¦¿ à¦“ à¦¬à¦¾à¦‚à¦²à¦¾ à¦¨à¦¾à¦® à¦•à¦¾à¦¸à§�à¦Ÿà¦®à¦¾à¦‡à¦œ à¦�à¦¬à¦‚ à¦…à¦¨/à¦…à¦« à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡ à¦�à¦¬à¦‚ à¦²à¦¾à¦‡à¦­ à¦ªà§‡à¦¸à¦²à¦¿à¦ª à¦ªà§�à¦°à¦¿à¦­à¦¿à¦‰ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤ à¦ªà§�à¦°à¦¿à¦­à¦¿à¦‰ à¦­à¦¿à¦‰à¦¤à§‡ à¦¨à§‡à¦Ÿ à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à§§à§¬à§«,à§¦à§¦à§¦ à¦�à¦¬à¦‚ à¦…à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¯ à¦¸à¦®à§€à¦•à¦°à¦£à¦—à§�à¦²à§‹ à¦¸à¦¾à¦®à¦žà§�à¦œà¦¸à§�à¦¯à¦ªà§‚à¦°à§�à¦£ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "219",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Employee Job Card",
    "link": "/employee-job-card",
    "descriptionEn": "Removed the summary stats cards ribbon (Present, Leaves, Holidays, Overtime, Late Entries, and Early Leaves) to make the registry interface cleaner and more streamlined.",
    "descriptionBn": "à¦œà¦¬ à¦•à¦¾à¦°à§�à¦¡ à¦ªà§‡à¦œ à¦¥à§‡à¦•à§‡ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¸ à¦°à¦¿à¦¬à¦¨ (Present, Leaves, Holidays à¦‡à¦¤à§�à¦¯à¦¾à¦¦à¦¿ à¦¸à¦‚à¦¬à¦²à¦¿à¦¤ à¦•à¦¾à¦°à§�à¦¡à¦—à§�à¦²à§‹) à¦¸à¦°à¦¿à§Ÿà§‡ à¦«à§‡à¦²à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à¦«à§‡à¦¸à¦Ÿà¦¿ à¦†à¦°à¦“ à¦ªà¦°à¦¿à¦šà§�à¦›à¦¨à§�à¦¨ à¦¦à§‡à¦–à¦¾à§Ÿà¥¤"
  },
  {
    "id": "218",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Employee Job Card",
    "link": "/employee-job-card",
    "descriptionEn": "Removed the dynamic employee metadata summary card to make the view strictly focus on filtering logs and presenting the core table data, removing unnecessary clutter.",
    "descriptionBn": "à¦œà¦¬ à¦•à¦¾à¦°à§�à¦¡ à¦ªà§‡à¦œ à¦¥à§‡à¦•à§‡ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦®à§‡à¦Ÿà¦¾à¦¡à§‡à¦Ÿà¦¾ à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦•à¦¾à¦°à§�à¦¡à¦Ÿà¦¿ à¦¸à¦°à¦¿à§Ÿà§‡ à¦«à§‡à¦²à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦¶à§�à¦§à§� à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à¦¿à¦‚ à¦�à¦¬à¦‚ à¦ªà§�à¦°à§Ÿà§‹à¦œà¦¨à§€à§Ÿ à¦¡à§‡à¦Ÿà¦¾à¦—à§�à¦²à§‹ à¦«à§‹à¦•à¦¾à¦¸à§‡ à¦¥à¦¾à¦•à§‡à¥¤"
  },
  {
    "id": "217",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Employee Job Card",
    "link": "/employee-job-card",
    "descriptionEn": "Replaced the Month and Year dropdowns with a comprehensive Date Range selector (Start Date and End Date). This allows for much more flexible and precise log fetching across multiple periods.",
    "descriptionBn": "à¦œà¦¬ à¦•à¦¾à¦°à§�à¦¡ à¦ªà§‡à¦œà§‡ Month à¦�à¦¬à¦‚ Year à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à§‡à¦° à¦¬à¦¦à¦²à§‡ à¦�à¦–à¦¨ à¦�à¦•à¦Ÿà¦¿ Date Range à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° (Start Date à¦�à¦¬à¦‚ End Date) à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦–à§�à¦¬ à¦¸à¦¹à¦œà§‡à¦‡ à¦ªà¦›à¦¨à§�à¦¦à¦®à¦¤à§‹ à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ à¦¤à¦¾à¦°à¦¿à¦–à§‡à¦° à¦²à¦— à¦¬à§‡à¦° à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "216",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Employee Job Card",
    "link": "/employee-job-card",
    "descriptionEn": "Perfected the alignment of all filter fields into a single, unified grid layout. Removed the 'Show Advanced' toggle to keep all fields permanently visible and easily accessible.",
    "descriptionBn": "à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦œà¦¬ à¦•à¦¾à¦°à§�à¦¡à§‡à¦° à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦«à¦¿à¦²à§�à¦¡à¦—à§�à¦²à§‹à¦° à¦…à§�à¦¯à¦¾à¦²à¦¾à¦‡à¦¨à¦®à§‡à¦¨à§�à¦Ÿ (Alignment) à¦ à¦¿à¦• à¦•à¦°à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦¨à§�à¦¦à¦°, à¦¸à¦¿à¦™à§�à¦—à¦² à¦—à§�à¦°à¦¿à¦¡ à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ 'Show Advanced' à¦Ÿà¦—à¦²à¦Ÿà¦¿ à¦¸à¦°à¦¿à§Ÿà§‡ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦«à¦²à§‡ à¦�à¦–à¦¨ à¦¸à¦¬ à¦«à¦¿à¦²à§�à¦¡ à¦¸à¦¬à¦¸à¦®à§Ÿ à¦�à¦•à¦¸à¦¾à¦¥à§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "215",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Employee Job Card",
    "link": "/employee-job-card",
    "descriptionEn": "Simplified the Job Card UI by removing confusing multi-employee selections and reorganizing filters into a cleaner, single-row design. Moved the 'Runtime Evaluation' into an 'Advanced' toggle.",
    "descriptionBn": "à¦œà¦¬ à¦•à¦¾à¦°à§�à¦¡à§‡à¦° à¦‡à¦‰à¦œà¦¾à¦° à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à¦«à§‡à¦¸ à¦†à¦°à¦“ à¦¸à¦¹à¦œ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦•à¦¸à¦¾à¦¥à§‡ à¦…à¦¨à§‡à¦• à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¾à¦° à¦…à¦ªà¦¶à¦¨à¦Ÿà¦¿ à¦¸à¦°à¦¿à§Ÿà§‡ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦¨à§�à¦¦à¦° à¦¸à¦¿à¦™à§�à¦—à¦²-à¦°à§‹ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ 'Runtime Evaluation' à¦…à¦ªà¦¶à¦¨à¦Ÿà¦¿à¦•à§‡ à¦�à¦•à¦Ÿà¦¿ 'Advanced' à¦Ÿà¦—à¦²à§‡à¦° à¦­à§‡à¦¤à¦°à§‡ à¦°à¦¾à¦–à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "214",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Disciplinary Action",
    "link": "/disciplinary-showcause-notices",
    "descriptionEn": "Added Disciplinary Show Cause Notices page to manage and track notices with complete lifecycle tracking and a modern modal interface.",
    "descriptionBn": "à¦¡à¦¿à¦¸à¦¿à¦ªà§�à¦²à¦¿à¦¨à¦¾à¦°à¦¿ à¦¶à§‹-à¦•à¦œ à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦¨à§‹à¦Ÿà¦¿à¦¶ à¦ªà§�à¦°à¦¦à¦¾à¦¨ à¦�à¦¬à¦‚ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦²à¦¾à¦‡à¦«à¦¸à¦¾à¦‡à¦•à§‡à¦² à¦Ÿà§�à¦°à§�à¦¯à¦¾à¦•à¦¿à¦‚ à¦�à¦° à¦œà¦¨à§�à¦¯ à¦†à¦§à§�à¦¨à¦¿à¦• à¦®à§‹à¦¡à¦¾à¦² à¦�à¦¬à¦‚ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à¦¿à¦‚ à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "213",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Disciplinary Action",
    "link": "/disciplinary-warning-letters",
    "descriptionEn": "Added Disciplinary Warning Letters page with comprehensive record tracking, filtering, and a modern modal for issuing letters.",
    "descriptionBn": "à¦¡à¦¿à¦¸à¦¿à¦ªà§�à¦²à¦¿à¦¨à¦¾à¦°à¦¿ à¦“à§Ÿà¦¾à¦°à§�à¦¨à¦¿à¦‚ à¦²à§‡à¦Ÿà¦¾à¦°à¦¸ (à¦¸à¦¤à¦°à§�à¦•à¦¤à¦¾à¦®à§‚à¦²à¦• à¦šà¦¿à¦ à¦¿) à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦šà¦¿à¦ à¦¿ à¦ªà§�à¦°à¦¦à¦¾à¦¨ à¦“ à¦°à§‡à¦•à¦°à§�à¦¡ à¦Ÿà§�à¦°à§�à¦¯à¦¾à¦•à¦¿à¦‚ à¦�à¦° à¦œà¦¨à§�à¦¯ à¦†à¦§à§�à¦¨à¦¿à¦• à¦®à§‹à¦¡à¦¾à¦² à¦�à¦¬à¦‚ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à¦¿à¦‚ à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "212",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Disciplinary Action",
    "link": "/disciplinary-case-files",
    "descriptionEn": "Added Disciplinary Action module with a comprehensive Case Files management page including advanced filtering and status tracking.",
    "descriptionBn": "à¦¡à¦¿à¦¸à¦¿à¦ªà§�à¦²à¦¿à¦¨à¦¾à¦°à¦¿ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦®à¦¡à¦¿à¦‰à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦•à§‡à¦¸ à¦«à¦¾à¦‡à¦² à¦ªà¦°à¦¿à¦šà¦¾à¦²à¦¨à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦‰à¦¨à§�à¦¨à¦¤ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à¦¿à¦‚ à¦�à¦¬à¦‚ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦Ÿà§�à¦°à§�à¦¯à¦¾à¦•à¦¿à¦‚ à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦°à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "211",
    "date": "2026-09-14T10:30",
    "type": "UX Optimization",
    "module": "KPI Cycles",
    "link": "/kpi-cycles",
    "descriptionEn": "Added a real-time search bar to the Employee Selection modal, allowing users to instantly filter by Name, ID, or Department. Also introduced profile picture avatars (with fallback initials) to each employee card for quick visual identification.",
    "descriptionBn": "à¦�à¦®à¦ªà§�à¦²à§Ÿà§€ à¦¸à¦¿à¦²à§‡à¦•à¦¶à¦¨ à¦®à§‹à¦¡à¦¾à¦²à§‡ à¦�à¦•à¦Ÿà¦¿ à¦°à¦¿à§Ÿà§‡à¦²-à¦Ÿà¦¾à¦‡à¦® à¦¸à¦¾à¦°à§�à¦š à¦¬à¦¾à¦° à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦¸à¦¾à¦¹à¦¾à¦¯à§�à¦¯à§‡ à¦¨à¦¾à¦®, à¦†à¦‡à¦¡à¦¿ à¦¬à¦¾ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦¦à¦¿à§Ÿà§‡ à¦¦à§�à¦°à§�à¦¤ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦–à§�à¦�à¦œà§‡ à¦¬à§‡à¦° à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤ à¦ªà¦¾à¦¶à¦¾à¦ªà¦¾à¦¶à¦¿, à¦ªà§�à¦°à¦¤à§�à¦¯à§‡à¦• à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦•à¦¾à¦°à§�à¦¡à§‡ à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦ªà¦¿à¦•à¦šà¦¾à¦° à¦…à§�à¦¯à¦¾à¦­à¦¾à¦Ÿà¦¾à¦° (à¦…à¦¥à¦¬à¦¾ à¦¨à¦¾à¦®à§‡à¦° à¦†à¦¦à§�à¦¯à¦•à§�à¦·à¦°) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦¤à¦¾à¦¦à§‡à¦° à¦¸à¦¹à¦œà§‡à¦‡ à¦šà§‡à¦¨à¦¾ à¦¯à¦¾à§Ÿà¥¤"
  },
  {
    "id": "210",
    "date": "2026-09-14T10:30",
    "type": "UX Optimization",
    "module": "KPI Cycles",
    "link": "/kpi-cycles",
    "descriptionEn": "Replaced the standard popover for 'Applicable Employees' with a dedicated advanced selection modal. This provides a much better experience by showing employee details (ID, Name, and Department) in a spacious grid view.",
    "descriptionBn": "'Applicable Employees' à¦¨à¦¿à¦°à§�à¦¬à¦¾à¦šà¦¨à§‡à¦° à¦œà¦¨à§�à¦¯ à¦¸à¦¾à¦§à¦¾à¦°à¦£ à¦ªà¦ªà¦“à¦­à¦¾à¦°à§‡à¦° à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à§‡ à¦�à¦•à¦Ÿà¦¿ à¦†à¦§à§�à¦¨à¦¿à¦• à¦¡à§‡à¦¡à¦¿à¦•à§‡à¦Ÿà§‡à¦¡ à¦¸à¦¿à¦²à§‡à¦•à¦¶à¦¨ à¦®à§‹à¦¡à¦¾à¦² à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦° à¦«à¦²à§‡ à¦¬à§œ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à§‡ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿à¦¦à§‡à¦° à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ (ID, à¦¨à¦¾à¦® à¦�à¦¬à¦‚ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ) à¦¤à¦¥à§�à¦¯à¦¸à¦¹ à¦¸à¦¹à¦œà§‡à¦‡ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡, à¦¯à¦¾ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦¦à§‡à¦° à¦¦à¦¾à¦°à§�à¦£ à¦…à¦­à¦¿à¦œà§�à¦žà¦¤à¦¾ à¦¦à§‡à¦¬à§‡à¥¤"
  },
  {
    "id": "209",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Core UI",
    "link": "/kpi-cycles",
    "descriptionEn": "Upgraded the MultiSelect component to display selected items as visible chips inside the input box (showing up to 3 items and a '+ X more' badge) instead of a generic text like '6 items selected'. This provides immediate visibility into what is selected without needing to open the dropdown.",
    "descriptionBn": "MultiSelect à¦•à¦®à§�à¦ªà§‹à¦¨à§‡à¦¨à§�à¦Ÿà¦Ÿà¦¿ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦–à¦¨ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° '6 items selected' à¦�à¦°à¦•à¦® à¦²à§‡à¦–à¦¾à¦° à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à§‡, à¦¨à¦¿à¦°à§�à¦¬à¦¾à¦šà¦¿à¦¤ à¦†à¦‡à¦Ÿà§‡à¦®à¦—à§�à¦²à§‹ à¦‡à¦¨à¦ªà§�à¦Ÿ à¦¬à¦•à§�à¦¸à§‡à¦° à¦­à§‡à¦¤à¦°à§‡ à¦šà¦¿à¦ªà¦¸ (Chips) à¦†à¦•à¦¾à¦°à§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡ (à¦¸à¦°à§�à¦¬à§‹à¦šà§�à¦š à§©à¦Ÿà¦¿ à¦†à¦‡à¦Ÿà§‡à¦® à¦�à¦¬à¦‚ à¦�à¦•à¦Ÿà¦¿ '+ X more' à¦¬à§�à¦¯à¦¾à¦œ à¦¸à¦¹)à¥¤ à¦�à¦° à¦«à¦²à§‡ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦¨à¦¾ à¦–à§�à¦²à§‡à¦‡ à¦•à§€ à¦•à§€ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¤à¦¾ à¦¸à¦¹à¦œà§‡ à¦¬à§‹à¦�à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "208",
    "date": "2026-09-14T10:30",
    "type": "UX Optimization",
    "module": "KPI Cycles",
    "link": "/kpi-cycles",
    "descriptionEn": "Deep UX optimization for KPI Cycles modal. The Applicable Departments and Applicable Employees inputs are now neatly aligned side-by-side using a grid layout to save vertical space. Furthermore, the Employees list is now smartly filtered dynamically based on the selected Departments.",
    "descriptionBn": "KPI Cycles à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° UX-à¦� à¦¬à§œ à¦§à¦°à¦£à§‡à¦° à¦‰à¦¨à§�à¦¨à§Ÿà¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ Applicable Departments à¦�à¦¬à¦‚ Applicable Employees à¦‡à¦¨à¦ªà§�à¦Ÿ à¦¦à§�à¦Ÿà¦¿ à¦�à¦–à¦¨ à¦ªà¦¾à¦¶à¦¾à¦ªà¦¾à¦¶à¦¿ à¦¸à§�à¦¨à§�à¦¦à¦°à¦­à¦¾à¦¬à§‡ à¦—à§�à¦°à¦¿à¦¡ à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦›à¦¾à§œà¦¾, à¦�à¦–à¦¨ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° à¦¨à¦¿à¦°à§�à¦¬à¦¾à¦šà¦¿à¦¤ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦“à¦ªà¦° à¦­à¦¿à¦¤à§�à¦¤à¦¿ à¦•à¦°à§‡ Employees-à¦�à¦° à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦•à¦¾à¦²à¦¿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¹à§Ÿà§‡ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à¦¬à§‡à¥¤"
  },
  {
    "id": "207",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "KPI Cycles",
    "link": "/kpi-cycles",
    "descriptionEn": "Upgraded the KPI Cycles creation modal with a smart, searchable combobox (MultiSelect) for both Applicable Departments and Applicable Employees, replacing the previous bulky scrollable lists for a much more professional and clean UX.",
    "descriptionBn": "KPI Cycles à¦¤à§ˆà¦°à¦¿à¦° à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿ à¦†à¦°à¦“ à¦¸à§�à¦®à¦¾à¦°à§�à¦Ÿ à¦“ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ Applicable Departments à¦�à¦¬à¦‚ Applicable Employees à¦¨à¦¿à¦°à§�à¦¬à¦¾à¦šà¦¨à§‡à¦° à¦œà¦¨à§�à¦¯ à¦†à¦—à§‡à¦° à¦¬à§œ à¦¸à§�à¦•à§�à¦°à¦²à¦¯à§‹à¦—à§�à¦¯ à¦¤à¦¾à¦²à¦¿à¦•à¦¾à¦° à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à§‡ à¦¸à¦¾à¦°à§�à¦š-à¦¸à§�à¦¬à¦¿à¦§à¦¾à¦¯à§�à¦•à§�à¦¤ à¦†à¦§à§�à¦¨à¦¿à¦• à¦®à¦¾à¦²à§�à¦Ÿà¦¿-à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦®à§�à¦¬à§‹à¦¬à¦•à§�à¦¸ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "206",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "KPI Cycles",
    "link": "/kpi-cycles",
    "descriptionEn": "Upgraded the 'Create/Edit Cycle' modal to be more user-friendly. Replaced the native multi-select box with scrollable checkbox lists for both Applicable Departments and Applicable Employees.",
    "descriptionBn": "'Create/Edit Cycle' à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿à¦•à§‡ à¦†à¦°à¦“ à¦‡à¦‰à¦œà¦¾à¦°-à¦«à§�à¦°à§‡à¦¨à§�à¦¡à¦²à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦†à¦—à§‡à¦° à¦¡à¦¿à¦«à¦²à§�à¦Ÿ à¦®à¦¾à¦²à§�à¦Ÿà¦¿-à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦¬à¦•à§�à¦¸à§‡à¦° à¦¬à¦¦à¦²à§‡ Applicable Departments à¦�à¦¬à¦‚ Applicable Employees-à¦�à¦° à¦œà¦¨à§�à¦¯ à¦¸à§�à¦•à§�à¦°à¦² à¦•à¦°à¦¾ à¦¯à¦¾à§Ÿ à¦�à¦®à¦¨ à¦šà§‡à¦•à¦¬à¦•à§�à¦¸ à¦²à¦¿à¦¸à§�à¦Ÿ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "205",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Employee Increment",
    "link": "/increment-list",
    "descriptionEn": "Reordered fields in the Employee Evaluation modal to place the KPI option before the promotion checkbox, as per the new logical flow.",
    "descriptionBn": "à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦‡à¦­à§�à¦¯à¦¾à¦²à§�à§Ÿà§‡à¦¶à¦¨ à¦®à§‹à¦¡à¦¾à¦²à§‡ à¦«à¦¿à¦²à§�à¦¡à§‡à¦° à¦•à§�à¦°à¦® à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡; à¦¨à¦¤à§�à¦¨ à¦«à§�à¦²à§‹ à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ KPI à¦…à¦ªà¦¶à¦¨à¦Ÿà¦¿ à¦ªà§�à¦°à¦®à§‹à¦¶à¦¨ à¦šà§‡à¦•à¦¬à¦•à§�à¦¸à§‡à¦° à¦†à¦—à§‡ à¦°à¦¾à¦–à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "204",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Employee Increment",
    "link": "/increment-list",
    "descriptionEn": "Updated the Employee Evaluation modal flow to enforce a logical order: the 'Pull Increment Data from KPI' option is now disabled until an employee is selected, and checking the KPI option auto-fills data specifically for the selected employee.",
    "descriptionBn": "à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦‡à¦­à§�à¦¯à¦¾à¦²à§�à§Ÿà§‡à¦¶à¦¨ à¦®à§‹à¦¡à¦¾à¦²à§‡ à¦�à¦•à¦Ÿà¦¿ à¦²à¦œà¦¿à¦•à§�à¦¯à¦¾à¦² à¦«à§�à¦²à§‹ à¦�à¦¨à¦«à§‹à¦°à§�à¦¸ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à¦•à§‹à¦¨à§‹ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¾à¦° à¦†à¦—à§‡ 'Pull Increment Data from KPI' à¦…à¦ªà¦¶à¦¨à¦Ÿà¦¿ à¦¡à¦¿à¦œà§‡à¦¬à¦² à¦¥à¦¾à¦•à¦¬à§‡, à¦�à¦¬à¦‚ KPI à¦…à¦ªà¦¶à¦¨à§‡ à¦šà§‡à¦• à¦•à¦°à¦²à§‡ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà§‡à¦¡ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿à¦° à¦œà¦¨à§�à¦¯ à¦…à¦Ÿà§‹à¦®à§‡à¦Ÿà¦¿à¦• à¦¡à§‡à¦Ÿà¦¾ à¦«à¦¿à¦² à¦¹à¦¬à§‡à¥¤"
  },
  {
    "id": "203",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Fixed a TypeScript error where the initialDyeings and initialFinishings arrays were missing the status property.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸à§‡ à¦�à¦•à¦Ÿà¦¿ à¦Ÿà¦¾à¦‡à¦ªà¦¸à§�à¦•à§�à¦°à¦¿à¦ªà§�à¦Ÿ à¦�à¦°à¦° à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ initialDyeings à¦�à¦¬à¦‚ initialFinishings à¦…à§�à¦¯à¦¾à¦°à§‡à¦—à§�à¦²à§‹à¦¤à§‡ status à¦ªà§�à¦°à¦ªà¦¾à¦°à§�à¦Ÿà¦¿à¦Ÿà¦¿ à¦®à¦¿à¦¸à¦¿à¦‚ à¦›à¦¿à¦²à¥¤"
  },
  {
    "id": "202",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Fixed a TypeScript error where the FabricConstructionSpec data was missing the rateConstraint property.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸à§‡ à¦�à¦•à¦Ÿà¦¿ à¦Ÿà¦¾à¦‡à¦ªà¦¸à§�à¦•à§�à¦°à¦¿à¦ªà§�à¦Ÿ à¦�à¦°à¦° à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ FabricConstructionSpec à¦¡à§‡à¦Ÿà¦¾à¦¤à§‡ rateConstraint à¦ªà§�à¦°à¦ªà¦¾à¦°à§�à¦Ÿà¦¿à¦Ÿà¦¿ à¦®à¦¿à¦¸à¦¿à¦‚ à¦›à¦¿à¦²à¥¤"
  },
  {
    "id": "201",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Fixed a TypeScript error where SpecialCostSpec and AdditionalCostSpec were missing rate and rateConstraint properties.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸à§‡ à¦�à¦•à¦Ÿà¦¿ à¦Ÿà¦¾à¦‡à¦ªà¦¸à§�à¦•à§�à¦°à¦¿à¦ªà§�à¦Ÿ à¦�à¦°à¦° à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ SpecialCostSpec à¦�à¦¬à¦‚ AdditionalCostSpec-à¦� rate à¦�à¦¬à¦‚ rateConstraint à¦ªà§�à¦°à¦ªà¦¾à¦°à§�à¦Ÿà¦¿à¦—à§�à¦²à§‹ à¦®à¦¿à¦¸à¦¿à¦‚ à¦›à¦¿à¦²à¥¤"
  },
  {
    "id": "200",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "User Management",
    "link": "/user-management",
    "descriptionEn": "Restored the avatar/image holder circle next to the employee name in the User Access Overview modal, removed the bottom metadata ribbon (Landing Route, Phone, Last Login) to reduce clutter, and removed the short company code (e.g. PSL, PKCL) chips beside the company names in the access list.",
    "descriptionBn": "à¦‡à¦‰à¦œà¦¾à¦° à¦…à§�à¦¯à¦¾à¦•à§�à¦¸à§‡à¦¸ à¦“à¦­à¦¾à¦°à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦²à§‡ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿à¦° à¦¨à¦¾à¦®à§‡à¦° à¦ªà¦¾à¦¶à§‡ à¦…à§�à¦¯à¦¾à¦­à¦¾à¦Ÿà¦¾à¦°/à¦›à¦¬à¦¿ à¦†à¦¬à¦¾à¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¨à¦¿à¦šà§‡à¦° à¦®à§‡à¦Ÿà¦¾à¦¡à§‡à¦Ÿà¦¾ à¦°à¦¿à¦¬à¦¨ (à¦²à§�à¦¯à¦¾à¦¨à§�à¦¡à¦¿à¦‚ à¦°à¦¾à¦‰à¦Ÿ, à¦«à§‹à¦¨, à¦²à¦¾à¦¸à§�à¦Ÿ à¦²à¦—à¦‡à¦¨) à¦¸à¦°à¦¿à§Ÿà§‡ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦›à¦¾à§œà¦¾à¦“ à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿ à¦…à§�à¦¯à¦¾à¦•à§�à¦¸à§‡à¦¸ à¦²à¦¿à¦¸à§�à¦Ÿà§‡à¦° à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿à¦° à¦¨à¦¾à¦®à§‡à¦° à¦ªà¦¾à¦¶ à¦¥à§‡à¦•à§‡ à¦¶à¦°à§�à¦Ÿ à¦•à§‹à¦¡ (à¦¯à§‡à¦®à¦¨- PSL, PKCL) à¦šà¦¿à¦ªà¦—à§�à¦²à§‹ à¦®à§�à¦›à§‡ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "199",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "User Management",
    "link": "/user-management",
    "descriptionEn": "Removed the user avatar/image section from the User Access Overview modal to create a cleaner layout.",
    "descriptionBn": "à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿à¦•à§‡ à¦†à¦°à¦“ à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦° à¦�à¦¬à¦‚ à¦›à¦¿à¦®à¦›à¦¾à¦® à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦‡à¦‰à¦œà¦¾à¦° à¦…à§�à¦¯à¦¾à¦•à§�à¦¸à§‡à¦¸ à¦“à¦­à¦¾à¦°à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦² à¦¥à§‡à¦•à§‡ à¦‡à¦‰à¦œà¦¾à¦°à§‡à¦° à¦›à¦¬à¦¿/à¦…à§�à¦¯à¦¾à¦­à¦¾à¦Ÿà¦¾à¦° à¦¸à§‡à¦•à¦¶à¦¨à¦Ÿà¦¿ à¦¸à¦°à¦¿à§Ÿà§‡ à¦«à§‡à¦²à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "198",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "User Management",
    "link": "/user-management",
    "descriptionEn": "Added a dedicated 'User Access Overview' action button and modal in the User Management table. It provides a visual snapshot of user credentials, system role, department, status, and an enhanced card-based matrix of assigned companies and accessible operational areas.",
    "descriptionBn": "à¦‡à¦‰à¦œà¦¾à¦° à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦®à§‡à¦¨à§�à¦Ÿ à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ 'User Access Overview' à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦Ÿà¦¨ à¦�à¦¬à¦‚ à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦° à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦¤à¦¥à§�à¦¯, à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦® à¦°à§‹à¦², à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ, à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦�à¦¬à¦‚ à¦…à§�à¦¯à¦¾à¦¸à¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿ à¦“ à¦…à¦¨à§�à¦®à§‹à¦¦à¦¿à¦¤ à¦�à¦°à¦¿à§Ÿà¦¾à¦—à§�à¦²à§‹ à¦¸à§�à¦¨à§�à¦¦à¦° à¦•à¦¾à¦°à§�à¦¡ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡ à¦�à¦•à¦¨à¦œà¦°à§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "197",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Evaluation",
    "link": "/increment-list",
    "descriptionEn": "Added a 'Pull from KPI' integration in the Evaluation modal. You can now check a box to automatically fetch and fill the increment amount based on an employee's KPI score. When unchecked, you can manually enter the amount. This streamlines the data entry for KPI-driven evaluations.",
    "descriptionBn": "à¦‡à¦­à§�à¦¯à¦¾à¦²à§�à§Ÿà§‡à¦¶à¦¨ à¦®à§‹à¦¡à¦¾à¦²à§‡ 'Pull from KPI' à¦…à¦ªà¦¶à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦‡ à¦šà§‡à¦•à¦¬à¦•à§�à¦¸à§‡ à¦Ÿà¦¿à¦• à¦¦à¦¿à¦²à§‡ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿à¦° KPI à¦¸à§�à¦•à§‹à¦°à§‡à¦° à¦‰à¦ªà¦° à¦­à¦¿à¦¤à§�à¦¤à¦¿ à¦•à¦°à§‡ à¦‡à¦¨à¦•à§�à¦°à¦¿à¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦ªà¦°à¦¿à¦®à¦¾à¦£ à¦…à¦Ÿà§‹à¦®à§‡à¦Ÿà¦¿à¦•à§�à¦¯à¦¾à¦²à¦¿ à¦«à¦¿à¦² à¦¹à§Ÿà§‡ à¦¯à¦¾à¦¬à§‡à¥¤ à¦†à¦° à¦Ÿà¦¿à¦• à¦¨à¦¾ à¦¦à¦¿à¦²à§‡ à¦†à¦ªà¦¨à¦¿ à¦®à§�à¦¯à¦¾à¦¨à§�à§Ÿà¦¾à¦²à¦¿ à¦…à§�à¦¯à¦¾à¦®à¦¾à¦‰à¦¨à§�à¦Ÿ à¦²à¦¿à¦–à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨, à¦¯à¦¾ à¦•à¦¾à¦œà¦•à§‡ à¦†à¦°à¦“ à¦¸à¦¹à¦œ à¦“ à¦¨à¦¿à¦–à§�à¦�à¦¤ à¦•à¦°à¦¬à§‡à¥¤"
  },
  {
    "id": "196",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Evaluation",
    "link": "/increment-list",
    "descriptionEn": "Enhanced the 'New Evaluation' modal for a more professional experience. Replaced the manual designation input field with an 'Is Promoted?' checkbox. When checked, it gracefully reveals a dropdown to precisely select the new designation. This prevents typos and makes the form much cleaner.",
    "descriptionBn": "à¦¨à¦¤à§�à¦¨ à¦‡à¦­à§�à¦¯à¦¾à¦²à§�à§Ÿà§‡à¦¶à¦¨ à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿à¦•à§‡ à¦†à¦°à¦“ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¡à§‡à¦œà¦¿à¦—à¦¨à§‡à¦¶à¦¨ à¦®à§�à¦¯à¦¾à¦¨à§�à§Ÿà¦¾à¦²à¦¿ à¦²à§‡à¦–à¦¾à¦° à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à§‡ à¦�à¦–à¦¨ 'Is Promoted?' à¦šà§‡à¦•à¦¬à¦•à§�à¦¸ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦Ÿà¦¿ à¦Ÿà¦¿à¦• à¦¦à¦¿à¦²à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦†à¦¸à¦¬à§‡ à¦¯à§‡à¦–à¦¾à¦¨ à¦¥à§‡à¦•à§‡ à¦¨à¦¤à§�à¦¨ à¦¡à§‡à¦œà¦¿à¦—à¦¨à§‡à¦¶à¦¨ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤ à¦�à¦° à¦«à¦²à§‡ à¦­à§�à¦² à¦¹à¦“à§Ÿà¦¾à¦° à¦¸à¦®à§�à¦­à¦¾à¦¬à¦¨à¦¾ à¦¥à¦¾à¦•à¦¬à§‡ à¦¨à¦¾ à¦�à¦¬à¦‚ à¦«à¦°à§�à¦®à¦Ÿà¦¿ à¦¦à§‡à¦–à¦¤à§‡à¦“ à¦¸à§�à¦¨à§�à¦¦à¦° à¦²à¦¾à¦—à¦¬à§‡à¥¤"
  },
  {
    "id": "195",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Evaluation",
    "link": "/increment-list",
    "descriptionEn": "Corrected the Evaluation sidebar menu. It is now called 'Evaluation' and contains three sub-menus: Increment List, Summary, and History. The 'Evaluate' button remains conveniently at the top of the Increment List page as requested.",
    "descriptionBn": "à¦‡à¦­à§�à¦¯à¦¾à¦²à§�à§Ÿà§‡à¦¶à¦¨ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦®à§‡à¦¨à§�à¦Ÿà¦¿ à¦ à¦¿à¦• à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦–à¦¨ à¦�à¦° à¦¨à¦¾à¦® 'Evaluation' à¦°à¦¾à¦–à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦�à¦° à¦†à¦¨à§�à¦¡à¦¾à¦°à§‡ à§©à¦Ÿà¦¿ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦†à¦›à§‡: Increment List, Summary, à¦�à¦¬à¦‚ Historyà¥¤ à¦�à¦›à¦¾à§œà¦¾ à¦‡à¦¨à¦•à§�à¦°à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦²à¦¿à¦¸à§�à¦Ÿ à¦ªà§‡à¦‡à¦œà§‡à¦° à¦‰à¦ªà¦°à§‡ 'Evaluate' à¦¬à¦¾à¦Ÿà¦¨à¦Ÿà¦¿ à¦†à¦—à§‡à¦° à¦®à¦¤à§‹à¦‡ à¦°à¦¾à¦–à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "194",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Evaluation",
    "link": "/increment-list",
    "descriptionEn": "Refactored the Evaluation workflow again based on feedback. The main entry point is now simply 'Increment List' in the sidebar. We removed the extra tabs and added a direct 'New Evaluation' button at the top of the list. Clicking it opens a fast, intuitive modal where you can select Year, Month, Employee, enter a Promotion Designation (if any), and input the Increment Amount, saving it instantly.",
    "descriptionBn": "à¦«à¦¿à¦¡à¦¬à§�à¦¯à¦¾à¦•à§‡à¦° à¦‰à¦ªà¦° à¦­à¦¿à¦¤à§�à¦¤à¦¿ à¦•à¦°à§‡ à¦‡à¦­à§�à¦¯à¦¾à¦²à§�à§Ÿà§‡à¦¶à¦¨ à¦ªà§�à¦°à¦¸à§‡à¦¸à¦Ÿà¦¿ à¦†à¦¬à¦¾à¦°à¦“ à¦¸à¦¹à¦œ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦–à¦¨ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° 'Increment List' à¦®à§‡à¦¨à§�à¦Ÿà¦¿ à¦°à¦¾à¦–à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦…à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¯ à¦Ÿà§�à¦¯à¦¾à¦¬à¦—à§�à¦²à§‹ à¦®à§�à¦›à§‡ à¦«à§‡à¦²à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦‡à¦¨à¦•à§�à¦°à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦²à¦¿à¦¸à§�à¦Ÿ à¦ªà§‡à¦‡à¦œà§‡à¦° à¦‰à¦ªà¦°à§‡ à¦�à¦•à¦Ÿà¦¿ 'New Evaluation' à¦¬à¦¾à¦Ÿà¦¨ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦‡ à¦¬à¦¾à¦Ÿà¦¨à§‡ à¦•à§�à¦²à¦¿à¦• à¦•à¦°à¦²à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦¨à§�à¦¦à¦° à¦®à§‹à¦¡à¦¾à¦² à¦“à¦ªà§‡à¦¨ à¦¹à¦¬à§‡ à¦¯à§‡à¦–à¦¾à¦¨ à¦¥à§‡à¦•à§‡ à¦¬à¦›à¦°, à¦®à¦¾à¦¸ à¦�à¦¬à¦‚ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à§‡ à¦ªà§�à¦°à¦®à§‹à¦¶à¦¨ à¦“ à¦‡à¦¨à¦•à§�à¦°à¦¿à¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦Ÿà¦¾à¦•à¦¾ à¦¬à¦¸à¦¿à§Ÿà§‡ à¦–à§�à¦¬ à¦¸à¦¹à¦œà§‡à¦‡ à¦¸à§‡à¦­ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "193",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Evaluation",
    "link": "/evaluation-propose",
    "descriptionEn": "Completely streamlined the Evaluation workflow into 4 simple steps: Evaluate, Increment List, Summary, and History. Removed the complex configurator step. Managers can now directly input the proposed 'Increment Amount' and 'Promotion Designation' for each employee in the Evaluate datatable itself, making the process much faster and more professional.",
    "descriptionBn": "à¦‡à¦­à§�à¦¯à¦¾à¦²à§�à§Ÿà§‡à¦¶à¦¨ à¦ªà§�à¦°à¦¸à§‡à¦¸à¦Ÿà¦¿à¦•à§‡ à§ªà¦Ÿà¦¿ à¦¸à¦¹à¦œ à¦§à¦¾à¦ªà§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡: Evaluate, Increment List, Summary à¦�à¦¬à¦‚ Historyà¥¤ à¦œà¦Ÿà¦¿à¦² à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦¸à§�à¦Ÿà§‡à¦ª à¦¬à¦¾à¦¦ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦–à¦¨ à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦¾à¦°à¦°à¦¾ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ Evaluate à¦ªà§‡à¦‡à¦œà§‡à¦° à¦¡à§‡à¦Ÿà¦¾à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ à¦¬à¦¸à§‡ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿à¦° à¦œà¦¨à§�à¦¯ 'Increment Amount' à¦�à¦¬à¦‚ 'Promotion Designation' à¦‡à¦¨à¦ªà§�à¦Ÿ à¦¦à¦¿à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨, à¦¯à¦¾ à¦•à¦¾à¦œà¦Ÿà¦¿ à¦†à¦°à¦“ à¦¦à§�à¦°à§�à¦¤ à¦“ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à¦•à¦°à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "192",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Evaluation",
    "link": "/evaluation-propose",
    "descriptionEn": "Simplified the Evaluation menu into a cleaner, modern, and professional inline tab navigation bar by removing the large block layout and complex descriptions. This makes the interface more user-friendly and standard.",
    "descriptionBn": "à¦‡à¦­à§�à¦¯à¦¾à¦²à§�à§Ÿà§‡à¦¶à¦¨ à¦®à§‡à¦¨à§�à¦Ÿà¦¿à¦•à§‡ à¦†à¦°à¦“ à¦¸à¦¹à¦œ, à¦†à¦§à§�à¦¨à¦¿à¦• à¦�à¦¬à¦‚ à¦ªà§‡à¦¶à¦¾à¦¦à¦¾à¦° à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¬à§œ à¦¬à§�à¦²à¦• à¦²à§‡à¦†à¦‰à¦Ÿ à¦�à¦¬à¦‚ à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ à¦¡à§‡à¦¸à¦•à§�à¦°à¦¿à¦ªà¦¶à¦¨ à¦¸à¦°à¦¿à§Ÿà§‡ à¦�à¦Ÿà¦¿à¦•à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦¨à§�à¦¦à¦° à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ à¦Ÿà§�à¦¯à¦¾à¦¬ à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨ à¦¬à¦¾à¦°à§‡ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦¦à§‡à¦° à¦œà¦¨à§�à¦¯ à¦†à¦°à¦“ à¦¬à§‡à¦¶à¦¿ à¦‡à¦‰à¦œà¦¾à¦°-à¦«à§�à¦°à§‡à¦¨à§�à¦¡à¦²à¦¿à¥¤"
  },
  {
    "id": "191",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Configuration - Allowance Rate",
    "link": "/allowance-rate",
    "descriptionEn": "Created a new 'Allowance Rate' configuration page with a centralized one-page modal design. Users can easily view, add, edit, and delete company-wide allowance rates (Percentage or Fixed amount) using a beautiful and well-organized interface.",
    "descriptionBn": "à¦�à¦•à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ 'Allowance Rate' à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦ªà§‡à¦‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦¨à§�à¦¦à¦° à¦“ à¦—à§‹à¦›à¦¾à¦¨à§‹ à¦�à¦•-à¦ªà§‡à¦‡à¦œ à¦®à¦¡à§‡à¦² à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡ à¦¤à§ˆà¦°à¦¿à¥¤ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦°à¦¾ à¦�à¦–à¦¨ à¦¸à¦¹à¦œà§‡à¦‡ à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿à¦° à¦…à§�à¦¯à¦¾à¦²à¦¾à¦‰à¦¨à§�à¦¸ à¦°à§‡à¦Ÿà¦—à§�à¦²à§‹ (à¦¶à¦¤à¦•à¦°à¦¾ à¦¬à¦¾ à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ à¦ªà¦°à¦¿à¦®à¦¾à¦£) à¦¦à§‡à¦–à¦¤à§‡, à¦¯à§‹à¦— à¦•à¦°à¦¤à§‡, à¦�à¦¡à¦¿à¦Ÿ à¦•à¦°à¦¤à§‡ à¦�à¦¬à¦‚ à¦¡à¦¿à¦²à¦¿à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "190",
    "date": "2026-09-14T10:30",
    "type": "New Feature",
    "module": "Merchandising Quotation",
    "link": "/merchandising-quotation",
    "descriptionEn": "Implemented dynamic rate constraints across the Buyer Costing form based on Master Settings. When a description is selected, the rate field is automatically populated with a default rate. Depending on the master setting, the rate field can now be 'Fixed' (cannot be changed), 'Increase Only' (can only be raised), 'Decrease Only' (can only be lowered), or 'No Restriction' (can be freely edited).",
    "descriptionBn": "à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦«à¦°à§�à¦®à§‡ à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸à§‡à¦° à¦‰à¦ªà¦° à¦­à¦¿à¦¤à§�à¦¤à¦¿ à¦•à¦°à§‡ à¦¡à¦¾à§Ÿà¦¨à¦¾à¦®à¦¿à¦• à¦°à§‡à¦Ÿ à¦°à§‡à¦¸à¦Ÿà§�à¦°à¦¿à¦•à¦¶à¦¨ (Rate Constraint) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦–à¦¨ à¦•à§‹à¦¨à§‹ à¦†à¦‡à¦Ÿà§‡à¦® à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦²à§‡ à¦°à§‡à¦Ÿ à¦«à¦¿à¦²à§�à¦¡à§‡ à¦…à¦Ÿà§‹à¦®à§‡à¦Ÿà¦¿à¦• à¦¡à¦¿à¦«à¦²à§�à¦Ÿ à¦°à§‡à¦Ÿ à¦šà¦²à§‡ à¦†à¦¸à¦¬à§‡à¥¤ à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸ à¦�à¦° à¦‰à¦ªà¦° à¦¨à¦¿à¦°à§�à¦­à¦° à¦•à¦°à§‡ à¦�à¦‡ à¦°à§‡à¦Ÿ à¦«à¦¿à¦²à§�à¦¡à¦Ÿà¦¿ 'Fixed', 'Increase Only', 'Decrease Only', à¦…à¦¥à¦¬à¦¾ 'No Restriction' à¦¹à¦¤à§‡ à¦ªà¦¾à¦°à§‡à¥¤"
  },
  {
    "id": "189",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Merchandising Quotation",
    "link": "/merchandising-quotation",
    "descriptionEn": "Replaced all free-text description fields in the Buyer Costing form with dropdown menus. The options for Fabric Class, Used In, Accessories, Embellishments, Washing, Yarn Count, Knitting, and Dyeing are now directly populated from the Master Settings.",
    "descriptionBn": "à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦«à¦°à§�à¦®à§‡à¦° à¦¸à¦•à¦² à¦¡à§‡à¦¸à¦•à§�à¦°à¦¿à¦ªà¦¶à¦¨ à¦«à¦¿à¦²à§�à¦¡à¦—à§�à¦²à§‹à¦•à§‡ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦®à§‡à¦¨à§�à¦¤à§‡ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦–à¦¨ Fabric Class, Used In, Accessories, Embellishments, Washing, Yarn Count, Knitting, à¦�à¦¬à¦‚ Dyeing à¦�à¦° à¦…à¦ªà¦¶à¦¨à¦—à§�à¦²à§‹ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸ à¦¥à§‡à¦•à§‡ à¦†à¦¸à¦¬à§‡à¥¤"
  },
  {
    "id": "188",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Financial Aid & Zakat",
    "link": "/financial-aid-list",
    "descriptionEn": "Upgraded the 'Employee Verified Details' card in both the Financial Aid Request and Zakat Assignment modals to display a comprehensive view including the employee's image, department, section, join date, and gross salary.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¸à¦¿à§Ÿà¦¾à¦² à¦�à¦‡à¦¡ à¦°à¦¿à¦•à§‹à¦¯à¦¼à§‡à¦¸à§�à¦Ÿ à¦�à¦¬à¦‚ à¦¯à¦¾à¦•à¦¾à¦¤ à¦…à§�à¦¯à¦¾à¦¸à¦¾à¦‡à¦¨à¦®à§‡à¦¨à§�à¦Ÿ à¦®à§‹à¦¡à¦¾à¦²à¦—à§�à¦²à§‹à¦° 'Employee Verified Details' à¦•à¦¾à¦°à§�à¦¡à¦Ÿà¦¿ à¦†à¦°à¦“ à¦‰à¦¨à§�à¦¨à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦–à¦¨ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦²à§‡ à¦¤à¦¾à¦° à¦›à¦¬à¦¿, à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ, à¦¸à§‡à¦•à¦¶à¦¨, à¦œà§Ÿà§‡à¦¨à¦¿à¦‚ à¦¡à§‡à¦Ÿ à¦�à¦¬à¦‚ à¦—à§�à¦°à¦¸ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤à¦­à¦¾à¦¬à§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "187",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Financial Aid",
    "link": "/financial-aid-list",
    "descriptionEn": "Fixed an issue where the 'New Aid Request' financial modal was not opening on the Financial Aid page.",
    "descriptionBn": "à¦«à¦¾à¦‡à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¸à¦¿à§Ÿà¦¾à¦² à¦�à¦‡à¦¡ à¦ªà§‡à¦œà§‡ 'New Aid Request' à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿ à¦“à¦ªà§‡à¦¨ à¦¨à¦¾ à¦¹à¦“à§Ÿà¦¾à¦° à¦¸à¦®à¦¸à§�à¦¯à¦¾à¦Ÿà¦¿ à¦ à¦¿à¦• à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "186",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Merchandising Order Profile",
    "link": "/merchandising-order-profile",
    "descriptionEn": "Redesigned the 'Style Master Data' table into a modern, gorgeous Card-based UI with clear hierarchical blocks for Fabric, Yarn, and Trims requirements instead of a dense, monolithic HTML table.",
    "descriptionBn": "'Style Master Data' à¦Ÿà§‡à¦¬à¦¿à¦²à¦Ÿà¦¿à¦•à§‡ à¦¨à¦¤à§�à¦¨à¦­à¦¾à¦¬à§‡ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦–à¦¨ à¦�à¦Ÿà¦¿ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦¨à§�à¦¦à¦° à¦•à¦¾à¦°à§�à¦¡-à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à¦¬à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ Fabric, Yarn à¦�à¦¬à¦‚ Trims à¦�à¦° à¦œà¦¨à§�à¦¯ à¦†à¦²à¦¾à¦¦à¦¾ à¦¸à§�à¦¨à§�à¦¦à¦° à¦¬à§�à¦²à¦• à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "185",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Merchandising Quotation",
    "link": "/merchandising-quotation",
    "descriptionEn": "Added a dynamic 'Budget Summary' table showing a comprehensive breakdown of order value, variable costs, contribution margin, and net profit based on form variables.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ à¦ªà§‡à¦œà§‡ à¦�à¦•à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦• 'à¦¬à¦¾à¦œà§‡à¦Ÿ à¦¸à¦¾à¦®à¦¾à¦°à¦¿' à¦Ÿà§‡à¦¬à¦¿à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à¦¾ à¦«à¦°à§�à¦®à§‡à¦° à¦¡à§‡à¦Ÿà¦¾ à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦…à¦°à§�à¦¡à¦¾à¦°à§‡à¦° à¦­à§�à¦¯à¦¾à¦²à§�, à¦­à§�à¦¯à¦¾à¦°à¦¿à¦¯à¦¼à§‡à¦¬à¦² à¦•à¦¸à§�à¦Ÿ, à¦•à¦¨à§�à¦Ÿà§�à¦°à¦¿à¦¬à¦¿à¦‰à¦¶à¦¨ à¦®à¦¾à¦°à§�à¦œà¦¿à¦¨ à¦�à¦¬à¦‚ à¦¨à§‡à¦Ÿ à¦ªà§�à¦°à¦«à¦¿à¦Ÿà§‡à¦° à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦¬à§�à¦°à§‡à¦•à¦¡à¦¾à¦‰à¦¨ à¦¦à§‡à¦–à¦¾à¦¯à¦¼à¥¤"
  },
  {
    "id": "184",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Zakat Management",
    "link": "/zakat-management",
    "descriptionEn": "Implemented Budget Configuration and Zakat List sub-menus. Styled tables for a cleaner, modern look aligning with the requested minimal design.",
    "descriptionBn": "à¦¬à¦¾à¦œà§‡à¦Ÿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦�à¦¬à¦‚ à¦¯à¦¾à¦•à¦¾à¦¤ à¦²à¦¿à¦¸à§�à¦Ÿ à¦¨à¦¾à¦®à§‡ à¦¦à§�à¦Ÿà¦¿ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§�à¦¯à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦†à¦°à¦“ à¦¸à§�à¦¨à§�à¦¦à¦° à¦“ à¦®à¦¡à¦¾à¦°à§�à¦¨ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡à¦° à¦œà¦¨à§�à¦¯ à¦Ÿà§‡à¦¬à¦¿à¦²à¦—à§�à¦²à§‹à¦° à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "183",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Budget Planning",
    "link": "/budget-planning",
    "descriptionEn": "Redesigned the Budget Planning page by combining Approved and Pending budgets into a single master list with new filtering options. Moved the Budget Strategy Form and Staged Proposals into a Create Budget modal.",
    "descriptionBn": "à¦¬à¦¾à¦œà§‡à¦Ÿ à¦ªà§�à¦²à§�à¦¯à¦¾à¦¨à¦¿à¦‚ à¦ªà§‡à¦œà¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨à¦­à¦¾à¦¬à§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦–à¦¨ à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¡ à¦�à¦¬à¦‚ à¦ªà§‡à¦¨à§�à¦¡à¦¿à¦‚ à¦¬à¦¾à¦œà§‡à¦Ÿà¦—à§�à¦²à§‹ à¦�à¦•à¦Ÿà¦¿ à¦ªà§‡à¦œà§‡à¦‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡ à¦�à¦¬à¦‚ à¦¨à¦¤à§�à¦¨ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦¬à¦¾à¦œà§‡à¦Ÿ à¦¸à§�à¦Ÿà§�à¦°à§�à¦¯à¦¾à¦Ÿà§‡à¦œà¦¿ à¦«à¦°à§�à¦® à¦�à¦¬à¦‚ à¦¸à§�à¦Ÿà§‡à¦œà¦¡ à¦ªà§�à¦°à¦ªà§‹à¦œà¦¾à¦²à¦—à§�à¦²à§‹ à¦�à¦–à¦¨ 'Create Budget' à¦®à§‹à¦¡à¦¾à¦²à§‡ à¦¸à§�à¦¥à¦¾à¦¨à¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "182",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Recruitment Configuration",
    "link": "/recruitment-configuration",
    "descriptionEn": "Refined the 'Weight Factor' field to strictly enforce numeric input and automatically format the value to 2 decimal places.",
    "descriptionBn": "à¦…à¦ªà¦¾à¦°à§‡à¦¶à¦¨ à¦—à§�à¦°à§‡à¦¡ (Operation Grade) à¦�à¦° 'Weight Factor' à¦«à¦¿à¦²à§�à¦¡à¦Ÿà¦¿ à¦°à¦¿à¦«à¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦�à¦Ÿà¦¿ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° à¦¨à¦®à§�à¦¬à¦° à¦—à§�à¦°à¦¹à¦£ à¦•à¦°à§‡ à¦�à¦¬à¦‚ à¦®à¦¾à¦¨à¦Ÿà¦¿ à§¨ à¦¦à¦¶à¦®à¦¿à¦• à¦¸à§�à¦¥à¦¾à¦¨à§‡ à¦¸à§�à¦¬à¦¯à¦¼à¦‚à¦•à§�à¦°à¦¿à¦¯à¦¼à¦­à¦¾à¦¬à§‡ à¦«à¦°à¦®à§�à¦¯à¦¾à¦Ÿ à¦¹à¦¯à¦¼à¥¤"
  },
  {
    "id": "181",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Recruitment Configuration",
    "link": "/recruitment-configuration",
    "descriptionEn": "Added a new 'Weight Factor' field to the Operation Grade configuration matrix. It captures a numeric 2-decimal value and displays it in the data table.",
    "descriptionBn": "à¦…à¦ªà¦¾à¦°à§‡à¦¶à¦¨ à¦—à§�à¦°à§‡à¦¡ (Operation Grade) à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦®à§�à¦¯à¦¾à¦Ÿà§�à¦°à¦¿à¦•à§�à¦¸à§‡ à¦¨à¦¤à§�à¦¨ 'Weight Factor' à¦«à¦¿à¦²à§�à¦¡ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦Ÿà¦¿ à§¨ à¦¦à¦¶à¦®à¦¿à¦• à¦¸à§�à¦¥à¦¾à¦¨ à¦ªà¦°à§�à¦¯à¦¨à§�à¦¤ à¦¸à¦‚à¦–à§�à¦¯à¦¾ à¦§à¦¾à¦°à¦£ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à§‡ à¦�à¦¬à¦‚ à¦¤à¦¾ à¦¡à§‡à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à¦¬à§‡à¥¤"
  },
  {
    "id": "180",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Recruitment Configuration",
    "link": "/recruitment-configuration",
    "descriptionEn": "Updated the SMV Value in the SMV Bank configuration matrix to consistently format to 4 decimal places.",
    "descriptionBn": "à¦�à¦¸à¦�à¦®à¦­à¦¿ à¦¬à§�à¦¯à¦¾à¦‚à¦• (SMV Bank) à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦®à§�à¦¯à¦¾à¦Ÿà§�à¦°à¦¿à¦•à§�à¦¸à§‡ SMV Value à¦•à§‡ à§ª à¦¡à§‡à¦¸à¦¿à¦®à§‡à¦² à¦ªà§�à¦²à§‡à¦¸ (à§ª à¦¦à¦¶à¦®à¦¿à¦• à¦¸à§�à¦¥à¦¾à¦¨) à¦ªà¦°à§�à¦¯à¦¨à§�à¦¤ à¦«à¦°à¦®à§�à¦¯à¦¾à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "179",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Recruitment Configuration",
    "link": "/recruitment-configuration",
    "descriptionEn": "Updated the OP Grade field in the Multi/SS configuration matrix to use a multi-select component.",
    "descriptionBn": "à¦®à¦¾à¦²à§�à¦Ÿà¦¿/à¦�à¦¸à¦�à¦¸ (Multi/SS) à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦®à§�à¦¯à¦¾à¦Ÿà§�à¦°à¦¿à¦•à§�à¦¸à§‡ OP Grade à¦«à¦¿à¦²à§�à¦¡à¦Ÿà¦¿à¦•à§‡ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à§‡ à¦®à¦¾à¦²à§�à¦Ÿà¦¿-à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦®à§�à¦ªà§‹à¦¨à§‡à¦¨à§�à¦Ÿ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "178",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Add Employee",
    "link": "/add-employee",
    "descriptionEn": "Added a 'Company Reference (Internal)' section under Professional & Corporate References to track if a new employee has any relatives working in the company. Captures region and relative's employee ID.",
    "descriptionBn": "à¦…à§�à¦¯à¦¾à¦¡ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦«à¦°à§�à¦®à§‡ à¦�à¦•à¦Ÿà¦¿ 'Company Reference (Internal)' à¦¸à§‡à¦•à¦¶à¦¨ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦ªà§�à¦°à¦¾à¦°à§�à¦¥à§€à¦° à¦•à§‹à¦¨à§‹ à¦†à¦¤à§�à¦®à§€à¦¯à¦¼ à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿à¦¤à§‡ à¦•à¦°à§�à¦®à¦°à¦¤ à¦¥à¦¾à¦•à¦²à§‡ à¦¤à¦¾à¦° à¦°à¦¿à¦œà¦¿à¦“à¦¨ à¦�à¦¬à¦‚ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦†à¦‡à¦¡à¦¿ à¦¸à¦‚à¦°à¦•à§�à¦·à¦£ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "177",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Add Employee",
    "link": "/add-employee",
    "descriptionEn": "Flattened the Personal & Identity tab into a single continuous scrollable form by removing sub-steps (Placement, Contact, Emergency, Reference) for a faster and unified data entry experience.",
    "descriptionBn": "à¦ªà¦¾à¦°à§�à¦¸à§‹à¦¨à¦¾à¦² à¦�à¦¬à¦‚ à¦†à¦‡à¦¡à§‡à¦¨à§�à¦Ÿà¦¿à¦Ÿà¦¿ à¦Ÿà§�à¦¯à¦¾à¦¬à¦Ÿà¦¿à¦•à§‡ à¦�à¦•à¦Ÿà¦¿ à¦�à¦•à¦• à¦¸à§�à¦•à§�à¦°à¦²à¦¯à§‹à¦—à§�à¦¯ à¦«à¦°à§�à¦®à§‡ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦¸à¦¾à¦¬-à¦¸à§�à¦Ÿà§‡à¦ª (à¦ªà§�à¦²à§‡à¦¸à¦®à§‡à¦¨à§�à¦Ÿ, à¦•à¦¨à§�à¦Ÿà¦¾à¦•à§�à¦Ÿ, à¦‡à¦®à¦¾à¦°à§�à¦œà§‡à¦¨à§�à¦¸à¦¿, à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸) à¦¸à¦°à¦¿à§Ÿà§‡ à¦�à¦• à¦ªà¦¾à¦¤à¦¾à§Ÿ à¦¸à¦¬ à¦¤à¦¥à§�à¦¯ à¦ªà§‚à¦°à¦£à§‡à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "176",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Personnel List",
    "link": "/employee-detail/2023046001R",
    "descriptionEn": "Redesigned the employee detail profile header for a more professional and user-friendly experience. The employee's avatar is now prominently displayed at the very top alongside key information organized cleanly.",
    "descriptionBn": "à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦² à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦¹à§‡à¦¡à¦¾à¦° à¦¨à¦¤à§�à¦¨ à¦•à¦°à§‡ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦–à¦¨ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿à¦° à¦›à¦¬à¦¿ à¦¸à¦¬à¦¾à¦° à¦ªà§�à¦°à¦¥à¦®à§‡ à¦¬à§œ à¦•à¦°à§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡ à¦�à¦¬à¦‚ à¦—à§�à¦°à§�à¦¤à§�à¦¬à¦ªà§‚à¦°à§�à¦£ à¦¤à¦¥à§�à¦¯à¦—à§�à¦²à§‹ à¦¸à§�à¦¨à§�à¦¦à¦°à¦­à¦¾à¦¬à§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦†à¦›à§‡à¥¤"
  },
  {
    "id": "175",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "IE Recruitment",
    "link": "/recruitment-basic-entry",
    "descriptionEn": "Added Unit, Line, and Date of Joining (DOJ) to the Mandatory Information card on top as required fields while removing duplicate inputs from Company Info.",
    "descriptionBn": "à¦†à¦‡à¦‡ à¦°à¦¿à¦•à§�à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦¬à§‡à¦¸à¦¿à¦• à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦«à¦°à§�à¦®à§‡ Unit, Line à¦�à¦¬à¦‚ Date of Joining (DOJ) à¦«à¦¿à¦²à§�à¦¡à¦—à§�à¦²à§‹à¦•à§‡ à¦¬à¦¾à¦§à§�à¦¯à¦¤à¦¾à¦®à§�à¦²à¦• à¦«à¦¿à¦²à§�à¦¡ à¦¹à¦¿à¦¸à§‡à¦¬à§‡ à¦¸à¦¬à¦¾à¦° à¦‰à¦ªà¦°à§‡à¦° à¦®à§�à¦¯à¦¾à¦¨à§�à¦¡à§‡à¦Ÿà¦°à¦¿ à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦¸à§�à¦¥à¦¾à¦¨à¦¾à¦¨à§�à¦¤à¦°à¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿ à¦‡à¦¨à¦«à§‹ à¦¸à§‡à¦•à¦¶à¦¨ à¦¥à§‡à¦•à§‡ à¦¡à§�à¦ªà§�à¦²à¦¿à¦•à§‡à¦Ÿ à¦¸à¦°à¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "174",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Inventory",
    "link": "/inv-receive-list",
    "descriptionEn": "Implemented the Receive List page with detailed filtering, searchable table, and a comprehensive Print Details (MRIR) modal.",
    "descriptionBn": "à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à¦¿à¦‚, à¦¸à¦¾à¦°à§�à¦šà§‡à¦¬à¦² à¦Ÿà§‡à¦¬à¦¿à¦² à¦�à¦¬à¦‚ à¦¸à§�à¦¨à§�à¦¦à¦° à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ (MRIR) à¦®à§‹à¦¡à¦¾à¦² à¦¸à¦¹ à¦°à¦¿à¦¸à¦¿à¦­ à¦²à¦¿à¦¸à§�à¦Ÿ à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "173",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Inventory",
    "link": "/inv-receive-direct",
    "descriptionEn": "Implemented the Direct Receive page with a complete MRR form and an interactive product entry table.",
    "descriptionBn": "à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦�à¦®à¦†à¦°à¦†à¦° (MRR) à¦«à¦°à§�à¦® à¦�à¦¬à¦‚ à¦ªà§�à¦°à§‹à¦¡à¦¾à¦•à§�à¦Ÿ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¸à¦¹ à¦¡à¦¿à¦°à§‡à¦•à§�à¦Ÿ à¦°à¦¿à¦¸à¦¿à¦­ à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "172",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Inventory",
    "link": "/inv-yarn-opening-stock",
    "descriptionEn": "Implemented the Yarn Opening Stock page with a multiple-product add form in a modal for efficient stock entry.",
    "descriptionBn": "à¦¸à¦¹à¦œà§‡ à¦�à¦•à¦¸à¦¾à¦¥à§‡ à¦…à¦¨à§‡à¦• à¦ªà§�à¦°à§‹à¦¡à¦¾à¦•à§�à¦Ÿà§‡à¦° à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦¦à§‡à¦“à§Ÿà¦¾à¦° à¦œà¦¨à§�à¦¯ à¦�à¦•à¦¾à¦§à¦¿à¦• à¦ªà§�à¦°à§‹à¦¡à¦¾à¦•à§�à¦Ÿ à¦…à§�à¦¯à¦¾à¦¡ à¦«à¦°à§�à¦® à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à§‡ à¦‡à§Ÿà¦¾à¦°à§�à¦¨ à¦“à¦ªà§‡à¦¨à¦¿à¦‚ à¦¸à§�à¦Ÿà¦• à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "171",
    "date": "2026-09-14T10:30",
    "type": "Feature",
    "module": "Inventory",
    "link": "/inv-config-uom",
    "descriptionEn": "Added new configuration pages for Unit of Measurement (UoM), Brand, and Model in the Inventory module.",
    "descriptionBn": "à¦‡à¦¨à¦­à§‡à¦¨à§�à¦Ÿà¦°à¦¿ à¦®à¦¡à¦¿à¦‰à¦²à§‡ Unit of Measurement (UoM), Brand, à¦�à¦¬à¦‚ Model à¦�à¦° à¦œà¦¨à§�à¦¯ à¦¨à¦¤à§�à¦¨ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦ªà§‡à¦œ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "170",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Human Resource",
    "link": "/add-employee",
    "descriptionEn": "Added a new 'House No' field in both Present and Permanent Address sections and updated the dispatch previews.",
    "descriptionBn": "à¦¬à¦°à§�à¦¤à¦®à¦¾à¦¨ à¦�à¦¬à¦‚ à¦¸à§�à¦¥à¦¾à§Ÿà§€ à¦ à¦¿à¦•à¦¾à¦¨à¦¾ à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦¨à¦¤à§�à¦¨ 'House No' à¦«à¦¿à¦²à§�à¦¡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¡à¦¿à¦¸à¦ªà§�à¦¯à¦¾à¦š à¦ªà§�à¦°à¦¿à¦­à¦¿à¦‰ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "169",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Human Resource",
    "link": "/add-employee",
    "descriptionEn": "Removed the separate Smart Scanner card and moved its button to the top right of the Primary Information header to save vertical space.",
    "descriptionBn": "à¦…à§�à¦¯à¦¾à¦¡ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦ªà§‡à¦œà§‡ à¦¸à§�à¦®à¦¾à¦°à§�à¦Ÿ à¦¸à§�à¦•à§�à¦¯à¦¾à¦¨à¦¾à¦° à¦•à¦¾à¦°à§�à¦¡à¦Ÿà¦¿ à¦¸à¦°à¦¿à¦¯à¦¼à§‡ à¦�à¦° à¦¬à¦¾à¦Ÿà¦¨à¦Ÿà¦¿ à¦ªà§�à¦°à¦¾à¦‡à¦®à¦¾à¦°à¦¿ à¦“ à¦¡à§‡à¦®à§‹à¦—à§�à¦°à¦¾à¦«à¦¿à¦• à¦¡à¦¸à¦¿à¦¯à¦¼à¦¾à¦° à¦¹à§‡à¦¡à¦¾à¦°à§‡à¦° à¦‰à¦ªà¦°à§‡ à¦¡à¦¾à¦¨à¦¦à¦¿à¦•à§‡ à¦¨à§‡à¦“à¦¯à¦¼à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "168",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Human Resource",
    "link": "/add-employee",
    "descriptionEn": "Added a collapsible accordion toggle to the Sub-section Progress Stepper Timeline on the Add Employee page.",
    "descriptionBn": "à¦…à§�à¦¯à¦¾à¦¡ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦ªà§‡à¦œà§‡ à¦¸à¦¾à¦¬-à¦¸à§‡à¦•à¦¶à¦¨ à¦ªà§�à¦°à§‹à¦—à§�à¦°à§‡à¦¸ à¦¸à§�à¦Ÿà§‡à¦ªà¦¾à¦° à¦Ÿà¦¾à¦‡à¦®à¦²à¦¾à¦‡à¦¨à§‡ à¦…à§�à¦¯à¦¾à¦•à¦°à§�à¦¡à¦¿à¦¯à¦¼à¦¨ à¦Ÿà¦—à¦² à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "167",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Human Resource",
    "link": "/add-employee",
    "descriptionEn": "Added a collapsible accordion toggle to the Profile Completion Status card on the Add Employee page to save screen space when not needed.",
    "descriptionBn": "à¦…à§�à¦¯à¦¾à¦¡ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦ªà§‡à¦œà§‡ à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦•à¦®à¦ªà§�à¦²à¦¿à¦¶à¦¨ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦•à¦¾à¦°à§�à¦¡à¦Ÿà¦¿à¦¤à§‡ à¦…à§�à¦¯à¦¾à¦•à¦°à§�à¦¡à¦¿à¦¯à¦¼à¦¨ à¦Ÿà¦—à¦² à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à¦¦à¦°à¦•à¦¾à¦°à§‡ à¦�à¦Ÿà¦¿ à¦›à§‹à¦Ÿ à¦•à¦°à§‡ à¦°à¦¾à¦–à¦¾ à¦¯à¦¾à¦¯à¦¼à¥¤"
  },
  {
    "id": "166",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Human Resource",
    "link": "/add-employee",
    "descriptionEn": "Compacted the layout of the Add Employee page by reducing padding, shrinking the progress cards, and minimizing the timeline stepper to maximize visible workspace.",
    "descriptionBn": "à¦…à§�à¦¯à¦¾à¦¡ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦ªà§‡à¦œà§‡à¦° à¦²à§‡à¦†à¦‰à¦Ÿ à¦†à¦°à¦“ à¦•à¦®à¦ªà§�à¦¯à¦¾à¦•à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡; à¦¸à§�à¦ªà§‡à¦¸ à¦¬à¦¾à¦�à¦šà¦¾à¦¨à§‹à¦° à¦œà¦¨à§�à¦¯ à¦•à¦¾à¦°à§�à¦¡, à¦ªà§�à¦¯à¦¾à¦¡à¦¿à¦‚ à¦�à¦¬à¦‚ à¦ªà§�à¦°à§‹à¦—à§�à¦°à§‡à¦¸ à¦¸à§�à¦Ÿà§‡à¦ªà¦—à§�à¦²à§‹ à¦›à§‹à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "165",
    "date": "2026-09-14T10:30",
    "type": "UI Update",
    "module": "Inventory Management",
    "link": "/inv-config-product-type",
    "descriptionEn": "Standardized table designs across all Inventory configuration pages (Product Type, Store Name, Group Name, Product Name) for consistent font sizes, alignments, and action buttons.",
    "descriptionBn": "à¦‡à¦¨à¦­à§‡à¦¨à§�à¦Ÿà¦°à¦¿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨à§‡à¦° à¦¸à¦¬ à¦ªà§‡à¦œà§‡à¦° à¦Ÿà§‡à¦¬à¦¿à¦² à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ (à¦«à¦¨à§�à¦Ÿ à¦¸à¦¾à¦‡à¦œ, à¦�à¦²à¦¾à¦‡à¦¨à¦®à§‡à¦¨à§�à¦Ÿ, à¦�à¦¬à¦‚ à¦¬à¦¾à¦Ÿà¦¨) à¦¸à§�à¦¨à§�à¦¦à¦° à¦�à¦¬à¦‚ à¦¸à¦¾à¦®à¦žà§�à¦œà¦¸à§�à¦¯à¦ªà§‚à¦°à§�à¦£ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "164",
    "date": "2026-09-14T10:30",
    "type": "New Addition",
    "module": "Inventory Management",
    "link": "/inv-config-group-name",
    "descriptionEn": "Created the Group Name configuration page with Product Type filtering and a clean single-column modal for group entry.",
    "descriptionBn": "à¦—à§�à¦°à§�à¦ª à¦¨à§‡à¦® à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦ªà§‡à¦‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦–à¦¾à¦¨à§‡ à¦ªà§�à¦°à§‹à¦¡à¦¾à¦•à§�à¦Ÿ à¦Ÿà¦¾à¦‡à¦ª à¦¦à¦¿à¦¯à¦¼à§‡ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦°à¦¾à¦° à¦…à¦ªà¦¶à¦¨ à¦�à¦¬à¦‚ à¦¡à¦¾à¦Ÿà¦¾ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿à¦° à¦œà¦¨à§�à¦¯ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦¨à§�à¦¦à¦° à¦®à§‹à¦¡à¦¾à¦² à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "163",
    "date": "2026-09-14T10:30",
    "type": "New Addition",
    "module": "Inventory Management",
    "link": "/inv-config-store-name",
    "descriptionEn": "Created the Store Name configuration page featuring an advanced locations multi-select tag input.",
    "descriptionBn": "à¦¸à§�à¦Ÿà§‹à¦° à¦¨à§‡à¦® à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦ªà§‡à¦‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦–à¦¾à¦¨à§‡ à¦²à§‹à¦•à§‡à¦¶à¦¨ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦¨à§�à¦¦à¦° à¦Ÿà§�à¦¯à¦¾à¦—-à¦¸à§�à¦Ÿà¦¾à¦‡à¦²à§‡à¦° à¦®à¦¾à¦²à§�à¦Ÿà¦¿-à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦…à¦ªà¦¶à¦¨ à¦†à¦›à§‡à¥¤"
  },
  {
    "id": "162",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Inventory Management",
    "link": "/inventory-dashboard",
    "descriptionEn": "Added three new sub-menus (UoM, Brand, Model) under the Configuration main menu in the Inventory sidebar.",
    "descriptionBn": "à¦‡à¦¨à¦­à§‡à¦¨à§�à¦Ÿà¦°à¦¿ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡ 'Configuration' à¦®à§‡à¦¨à§�à¦° à¦¨à¦¿à¦šà§‡ à¦†à¦°à¦“ à¦¤à¦¿à¦¨à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� (UoM, Brand, Model) à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "161",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Inventory Management",
    "link": "/inventory-dashboard",
    "descriptionEn": "Refined and reorganized the Inventory sidebar menu structure. Consolidated sections into Configuration, Config, Store Receive, and Store Issue with updated sub-menus.",
    "descriptionBn": "à¦‡à¦¨à¦­à§‡à¦¨à§�à¦Ÿà¦°à¦¿ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦®à§‡à¦¨à§� à¦¸à§�à¦Ÿà§�à¦°à¦¾à¦•à¦šà¦¾à¦° à¦°à¦¿à¦«à¦¾à¦‡à¦¨ à¦�à¦¬à¦‚ à¦°à¦¿à¦…à¦°à§�à¦—à¦¾à¦¨à¦¾à¦‡à¦œ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦–à¦¨ Configuration, Config, Store Receive, à¦�à¦¬à¦‚ Store Issue à¦¨à¦¾à¦®à§‡ à¦¨à¦¤à§�à¦¨ à¦¸à§‡à¦•à¦¶à¦¨à¦—à§�à¦²à§‹ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "160",
    "date": "2026-09-14T10:30",
    "type": "New Addition",
    "module": "Inventory Management",
    "link": "/inv-config-product-name",
    "descriptionEn": "Created the Product Name configuration page with store-specific filtering and a dual-column modal design to show existing products for context during creation.",
    "descriptionBn": "Product Name à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦ªà§‡à¦‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦–à¦¾à¦¨à§‡ à¦¸à§�à¦Ÿà§‹à¦° à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à¦¿à¦‚ à¦�à¦¬à¦‚ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦ªà§‡à¦¶à¦¾à¦² à¦¡à§�à¦¯à¦¼à¦¾à¦²-à¦•à¦²à¦¾à¦® à¦®à§‹à¦¡à¦¾à¦² à¦†à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à¦¨à¦¤à§�à¦¨ à¦ªà§�à¦°à§‹à¦¡à¦¾à¦•à§�à¦Ÿ à¦�à¦¡ à¦•à¦°à¦¾à¦° à¦¸à¦®à¦¯à¦¼ à¦†à¦—à§‡à¦° à¦ªà§�à¦°à§‹à¦¡à¦¾à¦•à§�à¦Ÿà¦—à§�à¦²à§‹ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¯à¦¼à¥¤"
  },
  {
    "id": "159",
    "date": "2026-09-14T10:30",
    "type": "New Addition",
    "module": "Inventory Management",
    "link": "/inv-config-product-type",
    "descriptionEn": "Created the Product Type Configuration page under Inventory Management. Features include a dynamic data table, Create/Update modals with standard fields, and an interactive dual-list parameter assignment modal.",
    "descriptionBn": "à¦‡à¦¨à¦­à§‡à¦¨à§�à¦Ÿà¦°à¦¿ à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦†à¦¨à§�à¦¡à¦¾à¦°à§‡ 'Product Type Configuration' à¦ªà§‡à¦‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦• à¦¡à§‡à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦², à¦•à§�à¦°à¦¿à¦¯à¦¼à§‡à¦Ÿ/à¦†à¦ªà¦¡à§‡à¦Ÿ à¦®à§‹à¦¡à¦¾à¦² à¦�à¦¬à¦‚ à¦ªà§�à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦° à¦…à§�à¦¯à¦¾à¦¸à¦¾à¦‡à¦¨ à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦¸à§�à¦ªà§‡à¦¶à¦¾à¦² à¦¡à§�à¦¯à¦¼à¦¾à¦²-à¦²à¦¿à¦¸à§�à¦Ÿ à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "158",
    "date": "2026-09-14T10:30",
    "type": "New Addition",
    "module": "Inventory Management",
    "link": "/inv-yarn-opening-stock",
    "descriptionEn": "Added a new 'Manage Item' menu group to the Inventory Sidebar and created the 'Yarn Opening Stock' page featuring a search, filtering layout, and an 'Add New Stock' button.",
    "descriptionBn": "à¦‡à¦¨à¦­à§‡à¦¨à§�à¦Ÿà¦°à¦¿ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡ 'Manage Item' à¦¨à¦¾à¦®à§‡à¦° à¦¨à¦¤à§�à¦¨ à¦®à§‡à¦¨à§� à¦—à§�à¦°à§�à¦ª à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ 'Yarn Opening Stock' à¦ªà§‡à¦‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦¸à¦¾à¦°à§�à¦š, à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦�à¦¬à¦‚ 'Add New Stock' à¦¬à¦¾à¦Ÿà¦¨ à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "157",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Inventory Management",
    "link": "/inventory-dashboard",
    "descriptionEn": "Removed placeholder menus from the Inventory sidebar. The sidebar now only strictly displays the 'Dashboard' and 'Configuration' menus.",
    "descriptionBn": "à¦‡à¦¨à¦­à§‡à¦¨à§�à¦Ÿà¦°à¦¿ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦¥à§‡à¦•à§‡ à¦¡à§‡à¦®à§‹ à¦®à§‡à¦¨à§�à¦—à§�à¦²à§‹ à¦¬à¦¾à¦¦ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦–à¦¨ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° 'Dashboard' à¦�à¦¬à¦‚ 'Configuration' à¦®à§‡à¦¨à§� à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "156",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "Inventory Management",
    "link": "/inventory-dashboard",
    "descriptionEn": "Redesigned the Store Selection modal to be more compact with horizontal store cards, and added a search bar to easily filter stores by name or description.",
    "descriptionBn": "à¦¸à§�à¦Ÿà§‹à¦° à¦¸à¦¿à¦²à§‡à¦•à¦¶à¦¨ à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿ à¦†à¦°à¦“ à¦•à¦®à¦ªà§�à¦¯à¦¾à¦•à§�à¦Ÿ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¸à§�à¦Ÿà§‹à¦° à¦¸à¦¹à¦œà§‡ à¦–à§�à¦�à¦œà§‡ à¦ªà§‡à¦¤à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¸à¦¾à¦°à§�à¦š à¦¬à¦¾à¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "155",
    "date": "2026-09-14T10:30",
    "type": "New",
    "module": "Inventory Management",
    "link": "/inventory-dashboard",
    "descriptionEn": "Created the new Inventory Management module with a dashboard layout consistent with HRIS. Added a Store Selection Modal (e.g. General Store, ICT Store) that appears on first load to enforce store context.",
    "descriptionBn": "à¦¨à¦¤à§�à¦¨ à¦‡à¦¨à¦­à§‡à¦¨à§�à¦Ÿà¦°à¦¿ à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦®à§‡à¦¨à§�à¦Ÿ à¦®à¦¡à¦¿à¦‰à¦² à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦° à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦�à¦‡à¦šà¦†à¦°à¦†à¦‡à¦�à¦¸ (HRIS) à¦�à¦° à¦®à¦¤à§‹ à¦°à¦¾à¦–à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦®à¦¡à¦¿à¦‰à¦²à§‡ à¦ªà§�à¦°à¦¥à¦®à¦¬à¦¾à¦° à¦ªà§�à¦°à¦¬à§‡à¦¶ à¦•à¦°à¦²à§‡ à¦¸à§�à¦Ÿà§‹à¦° (à¦¯à§‡à¦®à¦¨- à¦œà§‡à¦¨à¦¾à¦°à§‡à¦² à¦¸à§�à¦Ÿà§‹à¦°, à¦†à¦‡à¦¸à¦¿à¦Ÿà¦¿ à¦¸à§�à¦Ÿà§‹à¦°) à¦¨à¦¿à¦°à§�à¦¬à¦¾à¦šà¦¨ à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦�à¦•à¦Ÿà¦¿ à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "154",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "e-Recruitment",
    "link": "/e-recruitment-form",
    "descriptionEn": "Redesigned form tooltips with a professional card UI, detailed field instructions, and placed the hover icon before the label for improved user guidance.",
    "descriptionBn": "à¦‡-à¦°à¦¿à¦•à§�à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦«à¦°à§�à¦®à§‡à¦° à¦Ÿà§�à¦²à¦Ÿà¦¿à¦ªà¦—à§�à¦²à§‹ à¦†à¦°à¦“ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦²à§‡à¦¬à§‡à¦²à§‡à¦° à¦†à¦—à§‡ à¦‡à¦¨à¦«à§‹ à¦†à¦‡à¦•à¦¨ à¦¦à§‡à¦“à¦¯à¦¼à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦—à¦¾à¦‡à¦¡à¦²à¦¾à¦‡à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦•à§�à¦¯à¦¾à¦¨à§�à¦¡à¦¿à¦¡à§‡à¦Ÿà¦¦à§‡à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦¹à¦¯à¦¼à¥¤"
  },
  {
    "id": "153",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "e-Recruitment",
    "link": "/",
    "descriptionEn": "Hid the 'Settings' and 'Approved List' menus from the e-Recruitment section in both the sidebar and topbar navigation.",
    "descriptionBn": "à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦�à¦¬à¦‚ à¦Ÿà¦ªà¦¬à¦¾à¦° à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨ à¦‰à¦­à¦¯à¦¼ à¦œà¦¾à¦¯à¦¼à¦—à¦¾ à¦¥à§‡à¦•à§‡ à¦‡-à¦°à¦¿à¦•à§�à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦¸à§‡à¦•à¦¶à¦¨à§‡à¦° 'Settings' à¦�à¦¬à¦‚ 'Approved List' à¦®à§‡à¦¨à§�à¦—à§�à¦²à§‹ à¦¹à¦¾à¦‡à¦¡ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "152",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "e-Recruitment",
    "link": "/e-recruitment-form",
    "descriptionEn": "Fixed an issue in the e-Recruitment form where the 'jobPost' property was missing from the URL search parameters type definition.",
    "descriptionBn": "e-Recruitment à¦«à¦°à§�à¦®à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¸à¦®à¦¸à§�à¦¯à¦¾ à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ URL à¦¸à¦¾à¦°à§�à¦š à¦ªà§�à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦° à¦¥à§‡à¦•à§‡ 'jobPost' à¦ªà§�à¦°à¦ªà¦¾à¦°à§�à¦Ÿà¦¿à¦Ÿà¦¿ à¦®à¦¿à¦¸à¦¿à¦‚ à¦›à¦¿à¦²à¥¤"
  },
  {
    "id": "151",
    "date": "2026-09-14T10:30",
    "type": "Modify",
    "module": "e-Recruitment",
    "link": "/e-recruitment-form",
    "descriptionEn": "Completely redesigned the e-Recruitment form into a standalone page with a step-by-step sidebar navigation. The main app navigation has been removed from this page for a focused applicant experience.",
    "descriptionBn": "à¦‡-à¦°à¦¿à¦•à§�à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦«à¦°à§�à¦®à¦Ÿà¦¿ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¨à¦¤à§�à¦¨ à¦•à¦°à§‡ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦Ÿà¦¿ à¦�à¦–à¦¨ à¦¸à§�à¦Ÿà§‡à¦ª-à¦¬à¦¾à¦‡-à¦¸à§�à¦Ÿà§‡à¦ª à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨ à¦¸à¦¹ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦¬à¦¯à¦¼à¦‚à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦ªà§‡à¦œà¥¤ à¦«à§‹à¦•à¦¾à¦¸à¦¡ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§�à¦¯à¦¾à¦¨à§�à¦Ÿ à¦…à¦­à¦¿à¦œà§�à¦žà¦¤à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦®à§‡à¦‡à¦¨ à¦…à§�à¦¯à¦¾à¦ª à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨ à¦�à¦‡ à¦ªà§‡à¦œ à¦¥à§‡à¦•à§‡ à¦¸à¦°à¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "150",
    "date": "2026-09-14T10:30",
    "type": "New Addition",
    "module": "e-Recruitment",
    "link": "/e-recruitment-link-generator",
    "descriptionEn": "Enhanced the 'Link Generator' workflow under e-Recruitment. Added 'Form Status' column and 'Copy Link', 'Offer Letter' buttons in the Application Queue list. The 'Review' button is now automatically disabled until the candidate fills out the form. Also added 'Form Status' and 'Workflow Status' dropdown filters to easily sort candidates.",
    "descriptionBn": "e-Recruitment à¦�à¦° à¦…à¦§à§€à¦¨à§‡ 'Link Generator' à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¾à¦¨ à¦•à¦¿à¦‰ à¦²à¦¿à¦¸à§�à¦Ÿà§‡ 'Form Status' à¦•à¦²à¦¾à¦® à¦�à¦¬à¦‚ 'Copy Link', 'Offer Letter' à¦¬à¦¾à¦Ÿà¦¨ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦•à§�à¦¯à¦¾à¦¨à§�à¦¡à¦¿à¦¡à§‡à¦Ÿ à¦«à¦°à§�à¦® à¦«à¦¿à¦² à¦†à¦ª à¦¨à¦¾ à¦•à¦°à¦¾ à¦ªà¦°à§�à¦¯à¦¨à§�à¦¤ 'Review' à¦¬à¦¾à¦Ÿà¦¨à¦Ÿà¦¿ à¦�à¦–à¦¨ à¦¸à§�à¦¬à¦¯à¦¼à¦‚à¦•à§�à¦°à¦¿à¦¯à¦¼à¦­à¦¾à¦¬à§‡ à¦¨à¦¿à¦·à§�à¦•à§�à¦°à¦¿à¦¯à¦¼ à¦¥à¦¾à¦•à¦¬à§‡à¥¤ à¦�à¦›à¦¾à§œà¦¾ à¦¸à¦¹à¦œà§‡ à¦•à§�à¦¯à¦¾à¦¨à§�à¦¡à¦¿à¦¡à§‡à¦Ÿ à¦–à§‹à¦�à¦œà¦¾à¦° à¦œà¦¨à§�à¦¯ 'Form Status' à¦�à¦¬à¦‚ 'Workflow Status' à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "149",
    "date": "2026-08-04T15:53",
    "type": "Modify",
    "module": "Personnel List",
    "link": "/personnel-list",
    "descriptionEn": "Removed the 'OT After(H)' field from the Assign OT And Allowance modal and updated the modal to automatically prefill and display the employee's existing OT Option and OT Rate if already assigned.",
    "descriptionBn": "Assign OT And Allowance à¦®à§‹à¦¡à¦¾à¦² à¦¥à§‡à¦•à§‡ 'OT After(H)' à¦«à¦¿à¦²à§�à¦¡à¦Ÿà¦¿ à¦¸à¦°à¦¾à¦¤à§‡ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦•à¦°à§�à¦®à¦šà¦¾à¦°à§€à¦° à¦ªà§‚à¦°à§�à¦¬à§‡ à¦¨à¦¿à¦°à§�à¦§à¦¾à¦°à¦¿à¦¤ OT à¦…à¦ªà¦¶à¦¨ à¦“ OT Rate à¦¡à§‡à¦Ÿà¦¾ à¦¥à¦¾à¦•à¦²à§‡ à¦®à§‹à¦¡à¦¾à¦² à¦–à§‹à¦²à¦¾à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à¦¾à¦¥à§‡ à¦¤à¦¾ à¦¸à§�à¦¬à§Ÿà¦‚à¦•à§�à¦°à¦¿à§Ÿà¦­à¦¾à¦¬à§‡ à¦¦à§‡à¦–à¦¾à¦¨à§‹à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "148",
    "date": "2026-08-04T15:33",
    "type": "New Addition",
    "module": "Personnel List",
    "link": "/personnel-list",
    "descriptionEn": "Implemented all operational modals for Personnel List: 'Shift Update' (Shift Rotation), 'Employee Status Change', 'Shift Update - Default Holiday', 'ID Card Issue Date', and 'Revenue Mapping' with interactive fields and submit actions.",
    "descriptionBn": "à¦ªà¦¾à¦°à§�à¦¸à§‹à¦¨à§‡à¦² à¦²à¦¿à¦¸à§�à¦Ÿà§‡à¦° à¦œà¦¨à§�à¦¯ à¦¸à¦®à¦¸à§�à¦¤ à¦…à¦ªà¦¾à¦°à§‡à¦¶à¦¨ à¦®à§‹à¦¡à¦¾à¦² à¦¬à¦¾à¦¸à§�à¦¤à¦¬à¦¾à§Ÿà¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: 'Shift Update' (Shift Rotation), 'Employee Status Change', 'Shift Update - Default Holiday', 'ID Card Issue Date', à¦�à¦¬à¦‚ 'Revenue Mapping'à¥¤"
  },
  {
    "id": "147",
    "date": "2026-08-04T15:30",
    "type": "New Addition",
    "module": "Personnel List",
    "link": "/personnel-list",
    "descriptionEn": "Added the 'Assign OT And Allowance' modal to Personnel List when clicking 'OT Status Update' for selected employees (with N/A, OverTime, Fixed OverTime options, OT Rate, Close/Delete/Submit buttons), and increased the Personnel Operations sidebar width for better readability.",
    "descriptionBn": "à¦ªà¦¾à¦°à§�à¦¸à§‹à¦¨à§‡à¦² à¦²à¦¿à¦¸à§�à¦Ÿà§‡ à¦¨à¦¿à¦°à§�à¦¬à¦¾à¦šà¦¿à¦¤ à¦•à¦°à§�à¦®à¦šà¦¾à¦°à§€à¦¦à§‡à¦° à¦œà¦¨à§�à¦¯ 'OT Status Update' à¦•à§�à¦²à¦¿à¦• à¦•à¦°à¦²à§‡ 'Assign OT And Allowance' à¦ªà¦ªà¦†à¦ª à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¸à§�à¦¬à¦¿à¦§à¦¾à¦œà¦¨à¦•à¦­à¦¾à¦¬à§‡ à¦¦à§‡à¦–à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦…à¦ªà¦¾à¦°à§‡à¦¶à¦¨ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à¦Ÿà¦¿à¦° à¦ªà§�à¦°à¦¾à¦¸à§�à¦¥ (Width) à¦¬à¦¾à§œà¦¿à§Ÿà§‡ à¦šà¦“à§œà¦¾ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "146",
    "date": "2026-07-25T10:15",
    "type": "New Addition",
    "module": "Module Selection",
    "link": "/module-selection",
    "descriptionEn": "Created this 'Changes!' page! It works just like Excel, so you can easily track and edit all the new updates happening in the system.",
    "descriptionBn": "à¦¨à¦¤à§�à¦¨ 'Changes!' à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡! à¦�à¦Ÿà¦¿ à¦�à¦•à§�à¦¸à§‡à¦²à§‡à¦° à¦®à¦¤à§‹ à¦•à¦¾à¦œ à¦•à¦°à§‡, à¦¤à¦¾à¦‡ à¦†à¦ªà¦¨à¦¿ à¦¸à¦¹à¦œà§‡à¦‡ à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦®à§‡à¦° à¦¨à¦¤à§�à¦¨ à¦†à¦ªà¦¡à§‡à¦Ÿà¦—à§�à¦²à§‹ à¦Ÿà§�à¦°à§�à¦¯à¦¾à¦• à¦“ à¦�à¦¡à¦¿à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "145",
    "date": "2026-07-25T11:45",
    "type": "Modify",
    "module": "Order Profile",
    "link": "/merchandising-order-profile",
    "descriptionEn": "Made the Basic Information section much cleaner! It's now laid out in 4 neat columns, making it much easier to read and prettier to look at.",
    "descriptionBn": "à¦¬à§‡à¦¸à¦¿à¦• à¦‡à¦¨à¦«à¦°à¦®à§‡à¦¶à¦¨ à¦¸à§‡à¦•à¦¶à¦¨à¦Ÿà¦¿ à¦†à¦°à¦“ à¦¸à§�à¦¨à§�à¦¦à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡! à¦�à¦Ÿà¦¿ à¦�à¦–à¦¨ à§ªà¦Ÿà¦¿ à¦•à¦²à¦¾à¦®à§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹, à¦«à¦²à§‡ à¦ªà§œà¦¾ à¦¸à¦¹à¦œ à¦�à¦¬à¦‚ à¦¦à§‡à¦–à¦¤à§‡ à¦†à¦°à¦“ à¦­à¦¾à¦²à§‹ à¦²à¦¾à¦—à¦›à§‡à¥¤"
  },
  {
    "id": "144",
    "date": "2026-07-25T12:10",
    "type": "Modify",
    "module": "Order Profile",
    "link": "/merchandising-order-profile",
    "descriptionEn": "Fixed the messy tables for Yarn, Fabric, and Trim! They are now combined into one perfectly aligned master table.",
    "descriptionBn": "Yarn, Fabric à¦�à¦¬à¦‚ Trim-à¦�à¦° à¦›à§œà¦¾à¦¨à§‹ à¦Ÿà§‡à¦¬à¦¿à¦²à¦—à§�à¦²à§‹ à¦ à¦¿à¦• à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡! à¦�à¦—à§�à¦²à§‹à¦•à§‡ à¦�à¦–à¦¨ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦¨à§�à¦¦à¦° à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ à¦�à¦•à¦¤à§�à¦°à¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "143",
    "date": "2026-07-25T13:00",
    "type": "Modify",
    "module": "Order Profile",
    "link": "/merchandising-order-profile",
    "descriptionEn": "Made the tables more compact by reducing the text size and spacing. Now everything fits on the screen without having to scroll left and right!",
    "descriptionBn": "à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦¸à¦¾à¦‡à¦œ à¦�à¦¬à¦‚ à¦¸à§�à¦ªà§‡à¦¸à¦¿à¦‚ à¦•à¦®à¦¿à§Ÿà§‡ à¦Ÿà§‡à¦¬à¦¿à¦²à¦—à§�à¦²à§‹à¦•à§‡ à¦†à¦°à¦“ à¦•à¦®à§�à¦ªà§�à¦¯à¦¾à¦•à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦–à¦¨ à¦¡à¦¾à¦¨à§‡-à¦¬à¦¾à¦®à§‡ à¦¸à§�à¦•à§�à¦°à¦² à¦•à¦°à¦¾ à¦›à¦¾à§œà¦¾à¦‡ à¦¸à¦¬ à¦�à¦• à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à§‡ à¦«à¦¿à¦Ÿ à¦¹à§Ÿà§‡ à¦¯à¦¾à¦¬à§‡!"
  },
  {
    "id": "142",
    "date": "2026-07-25T13:45",
    "type": "Modify",
    "module": "Global System",
    "link": "/",
    "descriptionEn": "Switched the entire system to default to Light Mode! Everything will look bright and clear right from the start.",
    "descriptionBn": "à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦®à§‡à¦° à¦¡à¦¿à¦«à¦²à§�à¦Ÿ à¦¥à¦¿à¦® à¦¹à¦¿à¦¸à§‡à¦¬à§‡ à¦²à¦¾à¦‡à¦Ÿ à¦®à§‹à¦¡ à¦¸à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡! à¦�à¦–à¦¨ à¦¸à¦¬à¦•à¦¿à¦›à§� à¦¶à§�à¦°à§� à¦¥à§‡à¦•à§‡à¦‡ à¦‰à¦œà§�à¦œà§�à¦¬à¦² à¦�à¦¬à¦‚ à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦° à¦¦à§‡à¦–à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "141",
    "date": "2026-07-25T14:50",
    "type": "Modify",
    "module": "Personnel List",
    "link": "/personnel-list",
    "descriptionEn": "Moved the 'Operations' tools to a sidebar! Now, when you select an employee, the tools automatically pop up on the right side. You can still see the main table and continue clicking other employees to update multiple at once.",
    "descriptionBn": "à¦…à¦ªà¦¾à¦°à§‡à¦¶à¦¨ à¦Ÿà§�à¦²à¦¸à¦—à§�à¦²à§‹à¦•à§‡ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡ à¦¸à¦°à¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡! à¦�à¦–à¦¨ à¦®à§‡à¦‡à¦¨ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¥à§‡à¦•à§‡ à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦²à§‡à¦‡ à¦Ÿà§�à¦²à¦¸à¦—à§�à¦²à§‹ à¦¡à¦¾à¦¨à¦ªà¦¾à¦¶à§‡ à¦¸à§�à¦²à¦¾à¦‡à¦¡ à¦¹à§Ÿà§‡ à¦–à§�à¦²à¦¬à§‡à¥¤ à¦†à¦ªà¦¨à¦¿ à¦¤à¦–à¦¨à¦“ à¦®à§‡à¦‡à¦¨ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¦à§‡à¦–à¦¤à§‡ à¦ªà¦¾à¦¬à§‡à¦¨ à¦�à¦¬à¦‚ à¦�à¦•à¦¸à¦¾à¦¥à§‡ à¦�à¦•à¦¾à¦§à¦¿à¦• à¦•à¦¾à¦œ à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦…à¦¨à§�à¦¯ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤"
  },
  {
    "id": "140",
    "date": "2026-07-25T15:08",
    "type": "Modify",
    "module": "Payroll Deductions",
    "link": "/payroll-deductions",
    "descriptionEn": "Removed the 'Auto-Skip during Ramadan' option and the 'Single Period Exceptions' configuration from the Payroll Deductions setup panel.",
    "descriptionBn": "à¦ªà§‡à¦°à§‹à¦² à¦¡à¦¿à¦¡à¦¾à¦•à¦¶à¦¨ à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦² à¦¥à§‡à¦•à§‡ 'à¦°à§‹à¦œà¦¾à¦° à¦®à¦¾à¦¸à§‡ à¦…à¦Ÿà§‹-à¦¸à§�à¦•à¦¿à¦ª' à¦…à¦ªà¦¶à¦¨ à¦�à¦¬à¦‚ 'à¦¸à¦¿à¦™à§�à¦—à§‡à¦² à¦ªà¦¿à¦°à¦¿à§Ÿà¦¡ à¦�à¦•à§�à¦¸à§‡à¦ªà¦¶à¦¨' à¦¸à§‡à¦Ÿà¦¿à¦‚ à¦…à¦ªà¦¶à¦¨à¦—à§�à¦²à§‹ à¦¬à¦¾à¦¦ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "139",
    "date": "2026-07-25T15:35",
    "type": "Modify",
    "module": "User Management",
    "link": "/user-management",
    "descriptionEn": "Merged Company and Section access options into a nested view where Areas (renamed from Sections) show up directly under their selected Company. Renamed all 'Section' terms to 'Area'.",
    "descriptionBn": "à¦‡à¦‰à¦œà¦¾à¦° à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦®à§‡à¦¨à§�à¦Ÿà§‡ à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿ à¦�à¦¬à¦‚ à¦¸à§‡à¦•à¦¶à¦¨ à¦�à¦•à§�à¦¸à§‡à¦¸ à¦…à¦ªà¦¶à¦¨à¦—à§�à¦²à§‹à¦•à§‡ à¦�à¦•à¦¤à§�à¦°à¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦–à¦¨ à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦²à§‡à¦‡ à¦¤à¦¾à¦° à¦­à§‡à¦¤à¦°à§‡à¦° à¦�à¦°à¦¿à§Ÿà¦¾ (à¦¸à§‡à¦•à¦¶à¦¨ à¦�à¦° à¦¨à¦¤à§�à¦¨ à¦¨à¦¾à¦® à¦�à¦°à¦¿à§Ÿà¦¾) à¦…à¦ªà¦¶à¦¨à¦—à§�à¦²à§‹ à¦¨à¦¿à¦šà§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤ à¦�à¦›à¦¾à§œà¦¾ à¦¸à¦¬ à¦œà¦¾à§Ÿà¦—à¦¾à§Ÿ 'à¦¸à§‡à¦•à¦¶à¦¨' à¦¶à¦¬à§�à¦¦à§‡à¦° à¦¨à¦¾à¦® à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ 'à¦�à¦°à¦¿à§Ÿà¦¾' à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "138",
    "date": "2026-07-25T15:40",
    "type": "Modify",
    "module": "Salary Process",
    "link": "/monthly-salary-process",
    "descriptionEn": "Refactored the Payroll Adjustments editing dialog in Monthly Salary Process. Removed Section 1 (Attendance Parameters) and Section 2 (Monthly Earnings) fields. Upgraded Section 3 (Monthly Deductions & Exceptions) into a premium card-based layout with customized Lucide icons and currency symbols.",
    "descriptionBn": "à¦®à¦¾à¦¨à§�à¦¥à¦²à¦¿ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦ªà§�à¦°à¦¸à§‡à¦¸à§‡à¦° à¦ªà§‡à¦°à§‹à¦² à¦…à§�à¦¯à¦¾à¦¡à¦œà¦¾à¦¸à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦�à¦¡à¦¿à¦Ÿ à¦¡à¦¾à¦¯à¦¼à¦¾à¦²à¦— à¦°à¦¿à¦«à§�à¦¯à¦¾à¦•à§�à¦Ÿà¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¸à§‡à¦•à¦¶à¦¨ à§§ (à¦…à§�à¦¯à¦¾à¦Ÿà§‡à¦¨à¦¡à§‡à¦¨à§�à¦¸ à¦ªà§�à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦°) à¦�à¦¬à¦‚ à¦¸à§‡à¦•à¦¶à¦¨ à§¨ (à¦®à¦¾à¦¨à§�à¦¥à¦²à¦¿ à¦†à¦°à§�à¦¨à¦¿à¦‚à¦¸) à¦�à¦° à¦‡à¦¨à¦ªà§�à¦Ÿà¦—à§�à¦²à§‹ à¦¬à¦¾à¦¦ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦›à¦¾à§œà¦¾ à¦¸à§‡à¦•à¦¶à¦¨ à§© (à¦®à¦¾à¦¨à§�à¦¥à¦²à¦¿ à¦¡à¦¿à¦¡à¦¾à¦•à¦¶à¦¨ à¦…à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦�à¦•à§�à¦¸à§‡à¦ªà¦¶à¦¨à¦¸) à¦�à¦° à¦‡à¦¨à¦ªà§�à¦Ÿà¦—à§�à¦²à§‹à¦•à§‡ à¦†à¦•à¦°à§�à¦·à¦£à§€à§Ÿ à¦•à¦¾à¦°à§�à¦¡ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¸à¦¾à¦¥à§‡ à¦†à¦‡à¦•à¦¨ à¦“ à¦Ÿà¦¾à¦•à¦¾à¦° à¦¸à¦¾à¦‡à¦¨ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "137",
    "date": "2026-07-25T15:43",
    "type": "Modify",
    "module": "Salary Process",
    "link": "/monthly-salary-process",
    "descriptionEn": "Upgraded the Monthly Salary Process data table to match the detailed 58-column spreadsheet layout. Loaded the full 14 employees roster matching the active bank and account details exactly.",
    "descriptionBn": "à¦®à¦¾à¦¨à§�à¦¥à¦²à¦¿ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦ªà§�à¦°à¦¸à§‡à¦¸ à¦Ÿà§‡à¦¬à¦¿à¦²à¦Ÿà¦¿à¦•à§‡ à§«à§®à¦Ÿà¦¿ à¦•à¦²à¦¾à¦®à¦¬à¦¿à¦¶à¦¿à¦·à§�à¦Ÿ à¦¬à¦¿à¦¶à¦¦ à¦¸à§�à¦ªà§�à¦°à§‡à¦¡à¦¶à¦¿à¦Ÿ à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦‰à¦¨à§�à¦¨à§€à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¬à§�à¦¯à¦¾à¦‚à¦• à¦“ à¦…à§�à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§�à¦Ÿ à¦¨à¦®à§�à¦¬à¦°à¦¸à¦¹ à§§à§ª à¦œà¦¨ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿à¦° à¦¸à¦®à§�à¦ªà§�à¦°à§�à¦£ à¦¡à§‡à¦Ÿà¦¾à¦¬à§‡à¦¸ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "136",
    "date": "2026-07-25T15:46",
    "type": "Modify",
    "module": "Salary Process",
    "link": "/monthly-salary-process",
    "descriptionEn": "Added a custom column rearrangement and show/hide toggle panel to the Monthly Salary Process page, enabling draggable reordering, visibility control, and template saving matching the personnel list page design.",
    "descriptionBn": "à¦®à¦¾à¦¨à§�à¦¥à¦²à¦¿ à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦ªà§�à¦°à¦¸à§‡à¦¸ à¦ªà§‡à¦œà§‡ à¦•à¦²à¦¾à¦®à§‡à¦° à¦•à§�à¦°à¦® à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦�à¦¬à¦‚ à¦¹à¦¾à¦‡à¦¡/à¦¶à§‹ à¦•à¦°à¦¾à¦° à¦…à¦ªà¦¶à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦¡à§�à¦°à§�à¦¯à¦¾à¦— à¦•à¦°à§‡ à¦•à¦²à¦¾à¦® à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¯à¦¾à¦¬à§‡, à¦•à¦²à¦¾à¦®à§‡à¦° à¦¦à§ƒà¦¶à§�à¦¯à¦®à¦¾à¦¨à¦¤à¦¾ à¦¨à¦¿à§Ÿà¦¨à§�à¦¤à§�à¦°à¦£ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡ à¦�à¦¬à¦‚ à¦ªà¦¾à¦°à§�à¦¸à§‹à¦¨à§‡à¦² à¦²à¦¿à¦¸à§�à¦Ÿ à¦ªà§‡à¦œà§‡à¦° à¦®à¦¤à§‹ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦²à§‡à¦†à¦‰à¦Ÿ à¦Ÿà§‡à¦®à¦ªà§�à¦²à§‡à¦Ÿ à¦¸à§‡à¦­ à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤"
  },
  {
    "id": "135",
    "date": "2026-07-25T15:48",
    "type": "Modify",
    "module": "Salary Process",
    "link": "/monthly-salary-process",
    "descriptionEn": "Updated default column visibility to show all 58 columns on load, and removed the currency Taka (à§³) symbol from the table cell amounts.",
    "descriptionBn": "à¦¸à¦¬à¦—à§�à¦²à§‹ à§«à§®à¦Ÿà¦¿ à¦•à¦²à¦¾à¦® à¦²à§‹à¦¡ à¦¹à¦“à§Ÿà¦¾à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à¦¾à¦¥à§‡ à¦¦à§ƒà¦¶à§�à¦¯à¦®à¦¾à¦¨ à¦°à¦¾à¦–à¦¤à§‡ à¦¡à¦¿à¦«à¦²à§�à¦Ÿ à¦¸à§‡à¦Ÿà¦¿à¦‚ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¸à§‡à¦²à§‡à¦° à¦…à§�à¦¯à¦¾à¦®à¦¾à¦‰à¦¨à§�à¦Ÿ à¦¥à§‡à¦•à§‡ à¦Ÿà¦¾à¦•à¦¾ (à§³) à¦šà¦¿à¦¹à§�à¦¨ à¦¬à¦¾à¦¦ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "134",
    "date": "2026-07-25T16:20",
    "type": "Modify",
    "module": "Evaluation",
    "link": "/evaluation-propose",
    "descriptionEn": "Redesigned all 7 Evaluation sub-pages to be simpler and easier to use! Added a shared horizontal tab navigation bar across all pages so you can jump between Configurator, Evaluation Propose, Propose Increment, Summary, Queue & Approvals, Increment List, and History without using the sidebar. Also cleaned up breadcrumbs, added short descriptions to each page, and renamed jargon-heavy labels (e.g. 'Increment Gadget' is now 'Configurator'). Created a documentation file explaining how the full workflow works.",
    "descriptionBn": "à¦‡à¦­à§�à¦¯à¦¾à¦²à§�à¦¯à¦¼à§‡à¦¶à¦¨ à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦¸à¦¬à¦—à§�à¦²à§‹ à§­à¦Ÿà¦¿ à¦¸à¦¾à¦¬à¦ªà§‡à¦œ à¦†à¦°à¦“ à¦¸à¦¹à¦œ à¦“ à¦¸à§�à¦¨à§�à¦¦à¦° à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡! à¦�à¦–à¦¨ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦ªà§‡à¦œà§‡à¦° à¦‰à¦ªà¦°à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¹à¦°à¦¿à¦œà¦¨à§�à¦Ÿà¦¾à¦² à¦Ÿà§�à¦¯à¦¾à¦¬ à¦¬à¦¾à¦° à¦†à¦›à§‡ â€” Configurator, Evaluation Propose, Propose Increment, Summary, Queue & Approvals, Increment List, à¦�à¦¬à¦‚ History â€” à¦¯à§‡à¦Ÿà¦¾à¦¤à§‡ à¦¦à¦¿à¦¯à¦¼à§‡ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦›à¦¾à¦¡à¦¼à¦¾à¦‡ à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦ªà§‡à¦œà§‡ à¦¯à¦¾à¦“à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤ à¦¬à§�à¦°à§‡à¦¡à¦•à§�à¦°à¦¾à¦®à§�à¦¬ à¦ à¦¿à¦• à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦ªà§‡à¦œà§‡ à¦›à§‹à¦Ÿ à¦¬à¦¿à¦¬à¦°à¦£ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦�à¦¬à¦‚ 'Increment Gadget' à¦�à¦° à¦®à¦¤à§‹ à¦•à¦ à¦¿à¦¨ à¦¨à¦¾à¦®à¦—à§�à¦²à§‹ à¦¸à¦¹à¦œ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦›à¦¾à¦¡à¦¼à¦¾ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦“à¦¯à¦¼à¦¾à¦°à§�à¦•à¦«à§�à¦²à§‹ à¦¬à§�à¦¯à¦¾à¦–à§�à¦¯à¦¾ à¦•à¦°à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿà§‡à¦¶à¦¨ à¦«à¦¾à¦‡à¦²à¦“ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "133",
    "date": "2026-07-25T16:25",
    "type": "Modify",
    "module": "Evaluation",
    "link": "/evaluation-propose",
    "descriptionEn": "Fixed the double-navigation issue in the Evaluation module! Before, there were both sidebar sub-items AND a tab bar â€” which was confusing. Now the sidebar shows a single 'Evaluation' link, and the tab bar at the top of each page handles all navigation within the module. The sidebar also stays highlighted on all Evaluation pages.",
    "descriptionBn": "à¦‡à¦­à§�à¦¯à¦¾à¦²à§�à¦¯à¦¼à§‡à¦¶à¦¨ à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦¡à¦¾à¦¬à¦² à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨ à¦¸à¦®à¦¸à§�à¦¯à¦¾ à¦ à¦¿à¦• à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡! à¦†à¦—à§‡ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦›à¦¿à¦² à¦�à¦¬à¦‚ à¦ªà§‡à¦œà§‡à¦“ à¦Ÿà§�à¦¯à¦¾à¦¬ à¦¬à¦¾à¦° à¦›à¦¿à¦² â€” à¦¦à§�à¦Ÿà§‹ à¦�à¦•à¦¸à¦¾à¦¥à§‡ à¦¥à¦¾à¦•à¦¾à¦¯à¦¼ à¦¬à¦¿à¦­à§�à¦°à¦¾à¦¨à§�à¦¤à¦¿ à¦¹à¦šà§�à¦›à¦¿à¦²à¥¤ à¦�à¦–à¦¨ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡ à¦¶à§�à¦§à§� à¦�à¦•à¦Ÿà¦¿ 'Evaluation' à¦²à¦¿à¦‚à¦• à¦†à¦›à§‡, à¦†à¦° à¦ªà§‡à¦œà§‡à¦° à¦‰à¦ªà¦°à§‡à¦° à¦Ÿà§�à¦¯à¦¾à¦¬ à¦¬à¦¾à¦° à¦¥à§‡à¦•à§‡à¦‡ à¦¸à¦¬ à¦¸à¦¾à¦¬à¦ªà§‡à¦œà§‡ à¦¯à¦¾à¦“à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤ à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦‡à¦­à§�à¦¯à¦¾à¦²à§�à¦¯à¦¼à§‡à¦¶à¦¨ à¦ªà§‡à¦œà§‡ à¦¥à¦¾à¦•à¦²à§‡ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡à¦° 'Evaluation' à¦†à¦‡à¦Ÿà§‡à¦®à¦Ÿà¦¿ à¦¹à¦¾à¦‡à¦²à¦¾à¦‡à¦Ÿà§‡à¦¡ à¦¥à¦¾à¦•à¦¬à§‡à¥¤"
  },
  {
    "id": "132",
    "date": "2026-07-25T17:47",
    "type": "New Addition",
    "module": "Benefits",
    "link": "/payroll-benefits-common",
    "descriptionEn": "Brand new Common Benefits page built! You can now filter employees by type, department, section, and benefit category, then enter individual benefit amounts in an editable table. Features include select-all checkboxes, live amount totals, search, pagination, Excel/Print/PDF export, and a Save button with a confirmation toast.",
    "descriptionBn": "à¦¨à¦¤à§�à¦¨ Common Benefits à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦¹à¦¯à¦¼à§‡à¦›à§‡! à¦�à¦–à¦¨ à¦†à¦ªà¦¨à¦¿ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦Ÿà¦¾à¦‡à¦ª, à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ, à¦¸à§‡à¦•à¦¶à¦¨ à¦�à¦¬à¦‚ à¦¬à§‡à¦¨à¦¿à¦«à¦¿à¦Ÿ à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿ à¦¦à¦¿à¦¯à¦¼à§‡ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦°à§‡ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿à¦° à¦œà¦¨à§�à¦¯ à¦¬à§‡à¦¨à¦¿à¦«à¦¿à¦Ÿ à¦…à§�à¦¯à¦¾à¦®à¦¾à¦‰à¦¨à§�à¦Ÿ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦¦à¦¿à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨à¥¤ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ-à¦…à¦² à¦šà§‡à¦•à¦¬à¦•à§�à¦¸, à¦²à¦¾à¦‡à¦­ à¦…à§�à¦¯à¦¾à¦®à¦¾à¦‰à¦¨à§�à¦Ÿ à¦Ÿà§‹à¦Ÿà¦¾à¦², à¦¸à¦¾à¦°à§�à¦š, à¦ªà§‡à¦œà¦¿à¦¨à§‡à¦¶à¦¨, Excel/Print/PDF à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦�à¦¬à¦‚ à¦¸à§‡à¦­ à¦¬à¦¾à¦Ÿà¦¨ à¦¸à¦¹ à¦•à¦¨à¦«à¦¾à¦°à§�à¦®à§‡à¦¶à¦¨ à¦¨à§‹à¦Ÿà¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨à¦“ à¦†à¦›à§‡à¥¤"
  },
  {
    "id": "131",
    "date": "2026-07-25T17:50",
    "type": "New Addition",
    "module": "Benefits",
    "link": "/payroll-benefits-monthly",
    "descriptionEn": "New Monthly Benefits page is live! Filter by month, year, benefit type, benefit name, employee type, department, unit, or employee ID. Add new records via the '+' button or the FAB, edit or delete existing ones, and view full details in a clean modal. Modals match the rest of the system's style â€” orange CLOSE, green SUBMIT.",
    "descriptionBn": "à¦¨à¦¤à§�à¦¨ Monthly Benefits à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦¹à¦¯à¦¼à§‡à¦›à§‡! à¦®à¦¾à¦¸, à¦¬à¦›à¦°, à¦¬à§‡à¦¨à¦¿à¦«à¦¿à¦Ÿ à¦Ÿà¦¾à¦‡à¦ª, à¦¬à§‡à¦¨à¦¿à¦«à¦¿à¦Ÿ à¦¨à¦¾à¦®, à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦Ÿà¦¾à¦‡à¦ª, à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ, à¦‡à¦‰à¦¨à¦¿à¦Ÿ à¦¬à¦¾ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦†à¦‡à¦¡à¦¿ à¦¦à¦¿à¦¯à¦¼à§‡ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤ '+' à¦¬à¦¾à¦Ÿà¦¨ à¦¬à¦¾ à¦«à§�à¦²à§‹à¦Ÿà¦¿à¦‚ à¦¬à¦¾à¦Ÿà¦¨ à¦¦à¦¿à¦¯à¦¼à§‡ à¦¨à¦¤à§�à¦¨ à¦°à§‡à¦•à¦°à§�à¦¡ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¯à¦¾à¦¬à§‡, à¦¸à¦®à§�à¦ªà¦¾à¦¦à¦¨à¦¾ à¦¬à¦¾ à¦®à§�à¦›à§‡ à¦«à§‡à¦²à¦¾ à¦¯à¦¾à¦¬à§‡à¥¤ à¦®à§‹à¦¡à¦¾à¦² à¦¬à¦¾à¦•à¦¿ à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦®à§‡à¦° à¦®à¦¤à§‹à¦‡ â€” à¦…à¦°à§‡à¦žà§�à¦œ CLOSE, à¦¸à¦¬à§�à¦œ SUBMITà¥¤"
  },
  {
    "id": "130",
    "date": "2026-07-25T21:30",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-dashboard",
    "descriptionEn": "Restructured the entire Merchandising module sidebar menu into 9 clean, task-oriented categories matching BD garments industry standard workflow stages. Also upgraded the Order Entry form workspace into a Unified Order & Costing Hub, adding a segmented Knit | Woven | Sweater type selector with dynamically conditional fields for Yarn counts, GSM, Weave density, or Sweater Gauges.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦®à§‡à¦¨à§� à§¯à¦Ÿà¦¿ à¦¸à¦¹à¦œà§‡ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦¯à§‹à¦—à§�à¦¯ à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿à¦¤à§‡ à¦ªà§�à¦¨à¦°à§�à¦—à¦ à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à¦¾ à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à§‡à¦° à¦—à¦¾à¦°à§�à¦®à§‡à¦¨à§�à¦Ÿà¦¸ à¦¶à¦¿à¦²à§�à¦ªà§‡à¦° à¦•à¦¾à¦œà§‡à¦° à¦§à¦¾à¦ªà¦—à§�à¦²à§‹à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à¦¾à¦®à¦žà§�à¦œà¦¸à§�à¦¯à¦ªà§‚à¦°à§�à¦£à¥¤ à¦¤à¦¾à¦›à¦¾à¦¡à¦¼à¦¾ à¦…à¦°à§�à¦¡à¦¾à¦° à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦«à¦°à§�à¦®à¦Ÿà¦¿à¦•à§‡ à¦�à¦•à¦Ÿà¦¿ à¦‡à¦‰à¦¨à¦¿à¦«à¦¾à¦‡à¦¡ à¦…à¦°à§�à¦¡à¦¾à¦° à¦�à¦¬à¦‚ à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦¹à¦¾à¦¬à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦¨à¦¿à¦Ÿ, à¦“à¦­à§‡à¦¨ à¦�à¦¬à¦‚ à¦¸à§‹à¦¯à¦¼à§‡à¦Ÿà¦¾à¦° à¦…à¦°à§�à¦¡à¦¾à¦°à§‡à¦° à¦œà¦¨à§�à¦¯ à¦†à¦²à¦¾à¦¦à¦¾ à¦†à¦²à¦¾à¦¦à¦¾ à¦•à¦¨à§�à¦¡à¦¿à¦¶à¦¨à¦¾à¦² à¦ªà§�à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦° à¦¯à§‡à¦®à¦¨ à¦œà¦¿à¦�à¦¸à¦�à¦®, à¦‡à¦¯à¦¼à¦¾à¦°à§�à¦¨ à¦•à¦¾à¦‰à¦¨à§�à¦Ÿ, à¦‰à¦‡à¦­ à¦¡à§‡à¦¨à¦¸à¦¿à¦Ÿà¦¿ à¦�à¦¬à¦‚ à¦¸à§‹à¦¯à¦¼à§‡à¦Ÿà¦¾à¦° à¦—à¦œ à¦«à¦¿à¦²à§�à¦¡à¦—à§�à¦²à§‹ à¦¸à§�à¦¬à¦¯à¦¼à¦‚à¦•à§�à¦°à¦¿à¦¯à¦¼à¦­à¦¾à¦¬à§‡ à¦šà¦²à§‡ à¦†à¦¸à¦¬à§‡à¥¤"
  },
  {
    "id": "129",
    "date": "2026-07-25T21:40",
    "type": "New Addition",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Built the complete RMG Merchandising ERP Suite! Created 7 brand-new dedicated pages: Master Settings (Buyer config, Fabric/Yarn specs, Process Loss %, Trims master), Capacity Planning & Booking (SMV calculator, Monthly limits, Over-booking alerts), Sample Development Tracker (Proto/Fit/PP requisitions & Buyer feedback), Material Bookings (Auto Yarn Kg calculator, Fabric & Trims WOs), Service Work Orders (Washing, Printing, Dyeing, Embroidery sub-contracts), TNA Critical Path Calendar (11 Milestones timeline), and MM BI Reports (PO Order status, Buyer export share). All sidebar links are fully connected.",
    "descriptionBn": "à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦†à¦°à¦�à¦®à¦œà¦¿ à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦‡à¦†à¦°à¦ªà¦¿ à¦¸à§�à¦¯à§�à¦Ÿ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡! à§­à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ à¦ªà§‡à¦œ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸, à¦•à§�à¦¯à¦¾à¦ªà¦¾à¦¸à¦¿à¦Ÿà¦¿ à¦ªà§�à¦²à§�à¦¯à¦¾à¦¨à¦¿à¦‚, à¦¸à§�à¦¯à¦¾à¦®à§�à¦ªà¦² à¦Ÿà§�à¦°à§�à¦¯à¦¾à¦•à¦¾à¦°, à¦®à§‡à¦Ÿà§‡à¦°à¦¿à¦¯à¦¼à¦¾à¦² à¦¬à§�à¦•à¦¿à¦‚, à¦¸à¦¾à¦°à§�à¦­à¦¿à¦¸ à¦“à¦¯à¦¼à¦¾à¦°à§�à¦• à¦…à¦°à§�à¦¡à¦¾à¦°, à¦Ÿà¦¿à¦�à¦¨à¦� à¦•à§�à¦¯à¦¾à¦²à§‡à¦¨à§�à¦¡à¦¾à¦° à¦�à¦¬à¦‚ à¦�à¦®à¦�à¦® à¦¬à¦¿à¦†à¦‡ à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸à¥¤ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡à¦° à¦¸à¦¬ à¦²à¦¿à¦‚à¦• à¦¸à¦šà¦² à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "128",
    "date": "2026-07-25T21:51",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Completely eliminated duplicate navigation in the Merchandising module! Replaced redundant accordion sub-menus in the sidebar with clean, direct-action top-level navigation links. Sub-view switching is now handled exclusively by the sleek horizontal top tab bar on each dedicated module page for a 100% stable, uncluttered user experience.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¡à§�à¦ªà§�à¦²à¦¿à¦•à§‡à¦Ÿ à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨ à¦¦à§‚à¦° à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡! à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡à¦° à¦¬à¦¾à¦¡à¦¼à¦¤à¦¿ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦�à¦•à¦°à§�à¦¡à¦¿à¦¯à¦¼à¦¨à¦—à§�à¦²à§‹ à¦¸à¦°à¦¿à¦¯à¦¼à§‡ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦¡à¦¿à¦°à§‡à¦•à§�à¦Ÿ-à¦²à¦¿à¦‚à¦• à¦®à§‡à¦¨à§� à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦–à¦¨ à¦¥à§‡à¦•à§‡ à¦¸à¦¬ à¦¸à¦¾à¦¬-à¦­à¦¿à¦‰ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦ªà§‡à¦œà§‡à¦° à¦ªà¦°à¦¿à¦šà§�à¦›à¦¨à§�à¦¨ à¦Ÿà¦ª à¦¹à¦°à¦¿à¦œà¦¨à§�à¦Ÿà¦¾à¦² à¦Ÿà§�à¦¯à¦¾à¦¬ à¦¬à¦¾à¦° à¦¦à¦¿à¦¯à¦¼à§‡ à¦ªà¦°à¦¿à¦šà¦¾à¦²à¦¿à¦¤ à¦¹à¦¬à§‡, à¦¯à¦¾ à¦‡à¦‰à¦œà¦¾à¦° à¦�à¦•à§�à¦¸à¦ªà§‡à¦°à¦¿à¦¯à¦¼à§‡à¦¨à§�à¦¸à¦•à§‡ à¦•à¦°à§‡à¦›à§‡ à§§à§¦à§¦% à¦¸à§�à¦¥à¦¿à¦¤à¦¿à¦¶à§€à¦² à¦“ à¦¸à§�à¦¨à§�à¦¦à¦°à¥¤"
  },
  {
    "id": "127",
    "date": "2026-07-25T22:00",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-dashboard",
    "descriptionEn": "Deep-researched and rebuilt the entire Merchandising sidebar navigation from scratch based on real Bangladesh RMG ERP standards (OCMS BD, PrideSys, Infocrat). New structure: 'Master Settings' accordion (5 sub-items linking directly to specific database tabs), 'Orders & Costing' accordion (Order Ledger + New Order Entry), and 6 clean flat-link items (Sample, Material Booking, Work Orders, TNA, Capacity, Reports). Active state auto-highlights the correct parent and child. Smart auto-expand: accordion opens automatically when you navigate to its page.",
    "descriptionBn": "à¦¬à¦¾à¦‚à¦²à¦¾à¦¦à§‡à¦¶à§‡à¦° à¦¬à¦¾à¦¸à§�à¦¤à¦¬ à¦†à¦°à¦�à¦®à¦œà¦¿ à¦‡à¦†à¦°à¦ªà¦¿ à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦®à§‡à¦° (OCMS BD, PrideSys, Infocrat) à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦¡à¦¾à¦°à§�à¦¡ à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¨à¦¤à§�à¦¨à¦­à¦¾à¦¬à§‡ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦¨à¦¤à§�à¦¨ à¦¸à§�à¦Ÿà§�à¦°à¦¾à¦•à¦šà¦¾à¦°: 'à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸' à¦�à¦•à¦°à§�à¦¡à¦¿à¦¯à¦¼à¦¨ (à§«à¦Ÿà¦¿ à¦¸à¦¾à¦¬-à¦†à¦‡à¦Ÿà§‡à¦® à¦¯à¦¾ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ à¦Ÿà§�à¦¯à¦¾à¦¬ à¦–à§‹à¦²à§‡), 'à¦…à¦°à§�à¦¡à¦¾à¦° à¦“ à¦•à¦¸à§�à¦Ÿà¦¿à¦‚' à¦�à¦•à¦°à§�à¦¡à¦¿à¦¯à¦¼à¦¨ (à¦…à¦°à§�à¦¡à¦¾à¦° à¦²à§‡à¦œà¦¾à¦° + à¦¨à¦¤à§�à¦¨ à¦…à¦°à§�à¦¡à¦¾à¦° à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿), à¦�à¦¬à¦‚ à§¬à¦Ÿà¦¿ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦«à§�à¦²à§�à¦¯à¦¾à¦Ÿ à¦²à¦¿à¦‚à¦• (à¦¸à§�à¦¯à¦¾à¦®à§�à¦ªà¦², à¦®à§‡à¦Ÿà§‡à¦°à¦¿à¦¯à¦¼à¦¾à¦² à¦¬à§�à¦•à¦¿à¦‚, à¦“à¦¯à¦¼à¦¾à¦°à§�à¦• à¦…à¦°à§�à¦¡à¦¾à¦°, à¦Ÿà¦¿à¦�à¦¨à¦�, à¦•à§�à¦¯à¦¾à¦ªà¦¾à¦¸à¦¿à¦Ÿà¦¿, à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¸)à¥¤ à¦¸à¦•à§�à¦°à¦¿à¦¯à¦¼ à¦ªà§‡à¦œà§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦®à¦¿à¦²à¦¿à¦¯à¦¼à§‡ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦†à¦‡à¦Ÿà§‡à¦® à¦¸à§�à¦¬à¦¯à¦¼à¦‚à¦•à§�à¦°à¦¿à¦¯à¦¼à¦­à¦¾à¦¬à§‡ à¦¹à¦¾à¦‡à¦²à¦¾à¦‡à¦Ÿ à¦“ à¦�à¦•à¦°à§�à¦¡à¦¿à¦¯à¦¼à¦¨ à¦–à§‹à¦²à§‡à¥¤"
  },
  {
    "id": "126",
    "date": "2026-07-25T22:09",
    "type": "New Addition",
    "module": "Merchandising",
    "link": "/merchandising-inquiry",
    "descriptionEn": "Added the missing first stage of the garments order lifecycle: 'Buyer Inquiry & Pre-Costing Quotation' page. The Orders & Costing sidebar accordion now correctly shows all 3 workflow steps in order: Buyer Inquiry & Quotation â†’ Purchase Order (PO) Register â†’ Order Entry & Costing (KDS). The new inquiry page includes: Inquiry Register (log buyer style inquiries with AQL, payment terms, ship date), a live Pre-Costing Engine (auto-calculates Quoted FOB from fabric consumption, CMT, trims, overheads and profit margin), and a Quotation Status Kanban Board (Draft â†’ Sent to Buyer â†’ Buyer Approved â†’ Converted to PO).",
    "descriptionBn": "à¦—à¦¾à¦°à§�à¦®à§‡à¦¨à§�à¦Ÿà¦¸ à¦…à¦°à§�à¦¡à¦¾à¦° à¦²à¦¾à¦‡à¦«à¦¸à¦¾à¦‡à¦•à§‡à¦²à§‡à¦° à¦ªà§�à¦°à¦¥à¦® à¦§à¦¾à¦ª à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: 'à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦‡à¦¨à¦•à§‹à¦¯à¦¼à¦¾à¦°à¦¿ à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¿-à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦•à§‹à¦Ÿà§‡à¦¶à¦¨' à¦ªà§‡à¦œà¥¤ à¦�à¦–à¦¨ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡ 'à¦…à¦°à§�à¦¡à¦¾à¦° à¦“ à¦•à¦¸à§�à¦Ÿà¦¿à¦‚' à¦¸à§‡à¦•à¦¶à¦¨à§‡ à¦¸à¦ à¦¿à¦• à¦•à§�à¦°à¦®à§‡ à¦¤à¦¿à¦¨à¦Ÿà¦¿ à¦§à¦¾à¦ª à¦¦à§‡à¦–à¦¾à¦šà§�à¦›à§‡: à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦‡à¦¨à¦•à§‹à¦¯à¦¼à¦¾à¦°à¦¿ â†’ à¦ªà¦¿à¦“ à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà¦¾à¦° â†’ à¦…à¦°à§�à¦¡à¦¾à¦° à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿à¥¤ à¦¨à¦¤à§�à¦¨ à¦ªà§‡à¦œà§‡ à¦†à¦›à§‡: à¦‡à¦¨à¦•à§‹à¦¯à¦¼à¦¾à¦°à¦¿ à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà¦¾à¦° (à¦¬à¦¾à¦¯à¦¼à¦¾à¦°à§‡à¦° à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦‡à¦¨à¦•à§‹à¦¯à¦¼à¦¾à¦°à¦¿, à¦�à¦•à¦¿à¦‰à¦�à¦², à¦ªà§‡à¦®à§‡à¦¨à§�à¦Ÿ à¦Ÿà¦¾à¦°à§�à¦®à¦¸ à¦²à¦—), à¦²à¦¾à¦‡à¦­ à¦ªà§�à¦°à¦¿-à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦‡à¦žà§�à¦œà¦¿à¦¨ (à¦«à§�à¦¯à¦¾à¦¬à§�à¦°à¦¿à¦• à¦•à¦¨à¦¸à¦¾à¦®à§�à¦ªà¦¶à¦¨, à¦¸à¦¿à¦�à¦®à¦Ÿà¦¿, à¦Ÿà§�à¦°à¦¿à¦®à¦¸, à¦“à¦­à¦¾à¦°à¦¹à§‡à¦¡ à¦¥à§‡à¦•à§‡ à¦�à¦«à¦“à¦¬à¦¿ à¦…à¦Ÿà§‹-à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦Ÿ) à¦�à¦¬à¦‚ à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦•à¦¾à¦¨à¦¬à¦¾à¦¨ à¦¬à§‹à¦°à§�à¦¡ (à¦¡à§�à¦°à¦¾à¦«à¦Ÿ â†’ à¦¬à¦¾à¦¯à¦¼à¦¾à¦°à§‡ à¦ªà¦¾à¦ à¦¾à¦¨à§‹ â†’ à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¡ â†’ à¦ªà¦¿à¦“à¦¤à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦°)à¥¤"
  },
  {
    "id": "125",
    "date": "2026-07-27T10:10",
    "type": "Modify",
    "module": "Company Setup",
    "link": "/company-setup",
    "descriptionEn": "Added all 15 missing parameters to the Company Basic Settings modal matching the enterprise standard layout! Included New Employee Approval, Authorization (L/E), Absent Deduct Based On, ML Count, ML Stamp, WithOut In Absent, Searching By, Holiday Tiffin, Holiday Night, Early Out, Early Out Based On, Salary Breakdown Round, Sandwich Holiday, Sandwich Employee Type, and Late Time Calculation.",
    "descriptionBn": "à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿ à¦¬à§‡à¦¸à¦¿à¦• à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸ à¦®à§‹à¦¡à¦¾à¦²à§‡ à¦�à¦¨à§�à¦Ÿà¦¾à¦°à¦ªà§�à¦°à¦¾à¦‡à¦œ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦¡à¦¾à¦°à§�à¦¡ à¦²à§‡à¦†à¦‰à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à§§à§«à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ à¦«à¦¿à¦²à§�à¦¡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡! à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦°à§Ÿà§‡à¦›à§‡ à¦¨à¦¿à¦‰ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦², à¦…à¦¥à¦°à¦¾à¦‡à¦œà§‡à¦¶à¦¨ (à¦�à¦²/à¦‡), à¦…à§�à¦¯à¦¾à¦¬à¦¸à§‡à¦¨à§�à¦Ÿ à¦¡à¦¿à¦¡à¦¾à¦•à§�à¦Ÿ à¦¬à§‡à¦¸à¦¡ à¦…à¦¨, à¦�à¦®à¦�à¦² à¦•à¦¾à¦‰à¦¨à§�à¦Ÿ, à¦�à¦®à¦�à¦² à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦®à§�à¦ª, à¦‰à¦‡à¦¦à¦¾à¦‰à¦Ÿ à¦‡à¦¨ à¦…à§�à¦¯à¦¾à¦¬à¦¸à§‡à¦¨à§�à¦Ÿ, à¦¸à¦¾à¦°à§�à¦šà¦¿à¦‚ à¦¬à¦¾à¦‡, à¦¹à§‹à¦²à¦¿à¦¡à§‡ à¦Ÿà¦¿à¦«à¦¿à¦¨, à¦¹à§‹à¦²à¦¿à¦¡à§‡ à¦¨à¦¾à¦‡à¦Ÿ, à¦†à¦°à§�à¦²à¦¿ à¦†à¦‰à¦Ÿ, à¦†à¦°à§�à¦²à¦¿ à¦†à¦‰à¦Ÿ à¦¬à§‡à¦¸à¦¡ à¦…à¦¨, à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿ à¦¬à§�à¦°à§‡à¦•à¦¡à¦¾à¦‰à¦¨ à¦°à¦¾à¦‰à¦¨à§�à¦¡, à¦¸à§�à¦¯à¦¾à¦¨à§�à¦¡à¦‰à¦‡à¦š à¦¹à§‹à¦²à¦¿à¦¡à§‡, à¦¸à§�à¦¯à¦¾à¦¨à§�à¦¡à¦‰à¦‡à¦š à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦Ÿà¦¾à¦‡à¦ª à¦�à¦¬à¦‚ à¦²à§‡à¦Ÿ à¦Ÿà¦¾à¦‡à¦® à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦¶à¦¨à¥¤"
  },
  {
    "id": "124",
    "date": "2026-07-27T10:12",
    "type": "Modify",
    "module": "Company Setup",
    "link": "/company-setup",
    "descriptionEn": "Reorganized the Company Basic Settings modal with interactive category filter tabs (All Settings, Approvals & Governance, Attendance & Work, OT & Allowances, Leave & Holidays, Salary & Validation, ID & System Setup) and 6 structured 4-column responsive grid cards with clear red asterisks for required fields.",
    "descriptionBn": "à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿ à¦¬à§‡à¦¸à¦¿à¦• à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸ à¦®à§‹à¦¡à¦¾à¦²à¦•à§‡ à¦šà¦®à§Žà¦•à¦¾à¦° à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à§‡à¦•à§�à¦Ÿà¦¿à¦­ à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦Ÿà§�à¦¯à¦¾à¦¬ (à¦…à¦² à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸, à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¾à¦²à¦¸, à¦…à§�à¦¯à¦¾à¦Ÿà§‡à¦¨à¦¡à§‡à¦¨à§�à¦¸, à¦“à¦­à¦¾à¦°à¦Ÿà¦¾à¦‡à¦®, à¦²à¦¿à¦­ à¦“ à¦¹à§‹à¦²à¦¿à¦¡à§‡, à¦¸à§�à¦¯à¦¾à¦²à¦¾à¦°à¦¿, à¦†à¦‡à¦¡à¦¿ à¦“ à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦® à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸) à¦�à¦¬à¦‚ à§¬à¦Ÿà¦¿ à¦¸à§�à¦¨à§�à¦¦à¦° à§ª-à¦•à¦²à¦¾à¦® à¦°à§‡à¦¸à¦ªà¦¨à§�à¦¸à¦¿à¦­ à¦—à§�à¦°à¦¿à¦¡ à¦•à¦¾à¦°à§�à¦¡à§‡à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦¸à§�à¦¬à¦¿à¦¨à§�à¦¯à¦¸à§�à¦¤ à¦“ à¦—à§‹à¦›à¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "123",
    "date": "2026-07-27T11:26",
    "type": "New Addition",
    "module": "Payroll",
    "link": "/payroll-benefits-master-data",
    "descriptionEn": "Built the complete Payroll Master Data (Master Information) page matching the enterprise standard screen! Features Master For category selection (Common Benefit Add/Deduct, Individual Benefit Add/Deduct, Bonus Type / Festival Master), inline entry form (Name, Comments, Status), table row editing via pencil icon, Excel/Print/PDF exports, status filters, live search, and dynamic record counters.",
    "descriptionBn": "à¦ªà§‡ à¦°à§‹à¦² à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦‡à¦¨à¦«à¦°à¦®à§‡à¦¶à¦¨ à¦ªà§‡à¦œà¦Ÿà¦¿ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£à¦°à§‚à¦ªà§‡ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡! à¦�à¦¤à§‡ à¦°à¦¯à¦¼à§‡à¦›à§‡ à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦«à¦° à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿ à¦¨à¦¿à¦°à§�à¦¬à¦¾à¦šà¦¨ (à¦•à¦®à§‹à¦¨ à¦¬à§‡à¦¨à¦¿à¦«à¦¿à¦Ÿ à¦…à§�à¦¯à¦¾à¦¡/à¦¡à¦¿à¦¡à¦¾à¦•à§�à¦Ÿ, à¦‡à¦¨à§�à¦¡à¦¿à¦­à¦¿à¦œà§�à¦¯à¦¼à¦¾à¦² à¦¬à§‡à¦¨à¦¿à¦«à¦¿à¦Ÿ, à¦¬à§‹à¦¨à¦¾à¦¸ à¦Ÿà¦¾à¦‡à¦ª/à¦«à§‡à¦¸à§�à¦Ÿà¦¿à¦­à§�à¦¯à¦¾à¦² à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦°), à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦«à¦°à§�à¦® (à¦¨à§‡à¦®, à¦•à¦®à§‡à¦¨à§�à¦Ÿà¦¸, à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸), à¦ªà§‡à¦¨à§�à¦¸à¦¿à¦² à¦†à¦‡à¦•à¦¨ à¦¦à¦¿à¦¯à¦¼à§‡ à¦Ÿà§‡à¦¬à¦¿à¦² à¦°à§‹ à¦�à¦¡à¦¿à¦Ÿà¦¿à¦‚, à¦�à¦•à§�à¦¸à§‡à¦²/à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ/à¦ªà¦¿à¦¡à¦¿à¦�à¦« à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ, à¦²à¦¾à¦‡à¦­ à¦¸à¦¾à¦°à§�à¦š à¦�à¦¬à¦‚ à¦ªà¦¾à¦°à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦¨à§�à¦Ÿ à¦¡à¦¾à¦Ÿà¦¾ à¦¸à§�à¦Ÿà§‹à¦°à§‡à¦œà¥¤"
  },
  {
    "id": "122",
    "date": "2026-07-27T11:45",
    "type": "Modify",
    "module": "Payroll",
    "link": "/payroll-benefits-master-data",
    "descriptionEn": "Completely redesigned the Payroll Master Data page for zero-scroll list efficiency! Replaced static top form with an instant List View first design, top horizontal category pills filter, status badges, one-click table row status toggling, and a prominent '+ Add Master Item' primary button that opens a sleek backdrop modal for adding and editing master options without pushing data down.",
    "descriptionBn": "à¦ªà§‡ à¦°à§‹à¦² à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦¡à¦¾à¦Ÿà¦¾ à¦ªà§‡à¦œà¦Ÿà¦¿ à¦œà¦¿à¦°à§‹-à¦¸à§�à¦•à§�à¦°à§‹à¦² à¦²à¦¿à¦¸à§�à¦Ÿ à¦«à¦¾à¦°à§�à¦¸à§�à¦Ÿ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦ªà§�à¦¨à¦°à§�à¦—à¦ à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡! à¦†à¦—à§‡ à¦«à¦°à§�à¦®à§‡à¦° à¦•à¦¾à¦°à¦£à§‡ à¦¸à§�à¦•à§�à¦°à§‹à¦² à¦•à¦°à¦¤à§‡ à¦¹à¦¤à§‹, à¦�à¦–à¦¨ à¦ªà§‡à¦œ à¦²à§‹à¦¡à§‡à¦‡ à¦ªà§�à¦°à§‹ à¦¡à¦¾à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¦à§ƒà¦¶à§�à¦¯à¦®à¦¾à¦¨à¥¤ à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦ªà¦¿à¦²à¦¸, à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦Ÿà§‡à¦¬à¦¿à¦² à¦°à§‹ à¦¥à§‡à¦•à§‡ à¦�à¦•-à¦•à§�à¦²à¦¿à¦•à§‡ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦�à¦¬à¦‚ à¦¡à¦¾à¦¨à§‡ à¦¨à¦¤à§�à¦¨ '+ Add Master Item' à¦¬à¦¾à¦Ÿà¦¨ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾ à¦•à§�à¦²à¦¿à¦•à§‡ à¦ªà¦ªà¦†à¦ª à¦®à§‹à¦¡à¦¾à¦²à§‡ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦“ à¦�à¦¡à¦¿à¦Ÿà§‡à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦°à¦¾à¦–à§‡à¥¤"
  },
  {
    "id": "121",
    "date": "2026-07-27T11:48",
    "type": "Modify",
    "module": "Payroll",
    "link": "/payroll-benefits-master-data",
    "descriptionEn": "Cleaned and refined the Master Information page to exact original specifications! Removed redundant top navigation pills and horizontal category scroll bars, restoring the ultra-clean enterprise Master Information layout with a 4-column entry form (Master For, Name, Comments, Status), table export controls (Excel, Print, PDF), pencil edit actions, and bottom SUBMIT button.",
    "descriptionBn": "à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦‡à¦¨à¦«à¦°à¦®à§‡à¦¶à¦¨ à¦ªà§‡à¦œà¦Ÿà¦¿ à¦�à¦•à¦¦à¦® à¦¨à¦¿à¦–à§�à¦�à¦¤ à¦�à¦¬à¦‚ à¦°à¦¿à§Ÿà¦¾à¦²-à¦“à§Ÿà¦¾à¦°à§�à¦²à§�à¦¡ à¦�à¦¨à§�à¦Ÿà¦¾à¦°à¦ªà§�à¦°à¦¾à¦‡à¦œ à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦°à¦¿à¦«à¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡! à¦…à¦ªà§�à¦°à§Ÿà§‹à¦œà¦¨à§€à§Ÿ à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨ à¦ªà¦¿à¦²à¦¸ à¦�à¦¬à¦‚ à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿ à¦¸à§�à¦•à§�à¦°à§‹à¦² à¦¬à¦¾à¦° à¦¬à¦¾à¦¦ à¦¦à¦¿à§Ÿà§‡ à§ª-à¦•à¦²à¦¾à¦® à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦«à¦°à§�à¦® (à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦«à¦°, à¦¨à§‡à¦®, à¦•à¦®à§‡à¦¨à§�à¦Ÿà¦¸, à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸), à¦Ÿà§‡à¦¬à¦¿à¦² à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ (à¦�à¦•à§�à¦¸à§‡à¦², à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ, à¦ªà¦¿à¦¡à¦¿à¦�à¦«), à¦ªà§‡à¦¨à§�à¦¸à¦¿à¦² à¦�à¦¡à¦¿à¦Ÿ à¦�à¦•à¦¶à¦¨ à¦�à¦¬à¦‚ à¦¨à¦¿à¦šà§‡à¦° à¦¦à¦¿à¦•à§‡ à¦¸à¦¾à¦¬à¦®à¦¿à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨ à¦¸à¦¹ à¦ªà§‡à¦œà¦Ÿà¦¿ à¦�à¦•à¦¦à¦® à¦•à§�à¦²à¦¿à§Ÿà¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "120",
    "date": "2026-07-27T11:49",
    "type": "Modify",
    "module": "Payroll",
    "link": "/payroll-benefits-master-data",
    "descriptionEn": "Elevated the Master Information page with stunning modern aesthetics and placed all 4 form fields (Master For *, Name *, Comments, Status *) inside an interactive '+ Add Master Item' modal popup! Features an indigo-purple gradient hero banner, real-time KPI stats (Total Items, Active, Inactive), category dropdown filter, search box, export options, and one-click status toggling.",
    "descriptionBn": "à¦ªà§‡ à¦°à§‹à¦² à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦‡à¦¨à¦«à¦°à¦®à§‡à¦¶à¦¨ à¦ªà§‡à¦œà¦Ÿà¦¿ à¦†à¦§à§�à¦¨à¦¿à¦• à¦ªà§�à¦°à¦¿à¦®à¦¿à§Ÿà¦¾à¦® à¦²à§�à¦• à¦“ à¦«à¦¿à¦² à¦¦à¦¿à§Ÿà§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à§Ÿà§‡à¦›à§‡! à§ªà¦Ÿà¦¿ à¦«à¦¿à¦²à§�à¦¡ (à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦«à¦°, à¦¨à§‡à¦®, à¦•à¦®à§‡à¦¨à§�à¦Ÿà¦¸, à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸) à¦¨à¦¤à§�à¦¨ '+ Add Master Item' à¦ªà¦ªà¦†à¦ª à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦­à§‡à¦¤à¦° à¦¨à¦¿à§Ÿà§‡ à¦¨à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦ªà§‡à¦œà§‡à¦° à¦“à¦ªà¦°à§‡ à¦¸à§�à¦Ÿà¦¾à¦¨à¦¿à¦‚ à¦¹à¦¿à¦°à§‹ à¦¬à§�à¦¯à¦¾à¦¨à¦¾à¦°, à¦°à¦¿à§Ÿà§‡à¦²-à¦Ÿà¦¾à¦‡à¦® à¦•à§‡à¦ªà¦¿à¦†à¦‡ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¸, à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦�à¦¬à¦‚ à¦Ÿà§‡à¦¬à¦¿à¦² à¦�à¦¡à¦¿à¦Ÿà¦¿à¦‚ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "119",
    "date": "2026-07-27T11:52",
    "type": "Modify",
    "module": "Payroll",
    "link": "/payroll-benefits-master-data",
    "descriptionEn": "Updated all primary action buttons on the Payroll Master Data page (including the main header button, footer button, and modal submit button) to use the project's standard primary brand color (bg-primary) for visual consistency.",
    "descriptionBn": "à¦ªà§‡ à¦°à§‹à¦² à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦¡à¦¾à¦Ÿà¦¾ à¦ªà§‡à¦œà§‡à¦° à¦¸à¦•à¦² à¦ªà§�à¦°à¦¾à¦‡à¦®à¦¾à¦°à¦¿ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦Ÿà¦¨ (à¦ªà§�à¦°à¦§à¦¾à¦¨ à¦¹à§‡à¦¡à¦¾à¦° à¦¬à¦¾à¦Ÿà¦¨, à¦«à§�à¦Ÿà¦¾à¦° à¦¬à¦¾à¦Ÿà¦¨ à¦�à¦¬à¦‚ à¦®à§‹à¦¡à¦¾à¦² à¦¸à¦¾à¦¬à¦®à¦¿à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨) à¦ªà§�à¦°à§‹à¦œà§‡à¦•à§�à¦Ÿà§‡à¦° à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦¡à¦¾à¦°à§�à¦¡ à¦¬à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦•à¦¾à¦²à¦¾à¦° (bg-primary) à¦� à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡ à¦¸à¦¾à¦®à¦žà§�à¦œà¦¸à§�à¦¯ à¦¥à¦¾à¦•à§‡à¥¤"
  },
  {
    "id": "118",
    "date": "2026-07-27T11:53",
    "type": "Modify",
    "module": "Payroll",
    "link": "/payroll-benefits",
    "descriptionEn": "Removed redundant 'Loan/Advance Req.' and 'Loan Reschedule Sys.' submenus under the Benefits section in both the main sidebar navigation and the Payroll Benefits overview dashboard page.",
    "descriptionBn": "à¦¬à§‡à¦¨à¦¿à¦«à¦¿à¦Ÿà¦¸ à¦¸à§‡à¦•à¦¶à¦¨à§‡à¦° à¦…à¦§à§€à¦¨à§‡ à¦¥à¦¾à¦•à¦¾ à¦…à¦ªà§�à¦°à§Ÿà§‹à¦œà¦¨à§€à§Ÿ 'Loan/Advance Req.' à¦�à¦¬à¦‚ 'Loan Reschedule Sys.' à¦¸à¦¾à¦¬à¦®à§‡à¦¨à§� à¦¦à§�à¦Ÿà¦¿ à¦®à§‡à¦‡à¦¨ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨ à¦�à¦¬à¦‚ à¦ªà§‡ à¦°à§‹à¦² à¦¬à§‡à¦¨à¦¿à¦«à¦¿à¦Ÿà¦¸ à¦“à¦­à¦¾à¦°à¦­à¦¿à¦‰ à¦¡à§�à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§�à¦¡ à¦ªà§‡à¦œ à¦¥à§‡à¦•à§‡ à¦¬à¦¾à¦¦ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "117",
    "date": "2026-07-28T14:55",
    "type": "Modify",
    "module": "Benefits",
    "link": "/payroll-benefits-common",
    "descriptionEn": "Redesigned the Common Benefits page into a highly user-friendly dual-view layout. Replaced the modal with a spacious full-screen Configure Workspace, featuring dynamic employee lists, default quick-fill amounts, individual overrides, and manual employee add/remove controls.",
    "descriptionBn": "à¦•à¦®à¦¨ à¦¬à§‡à¦¨à¦¿à¦«à¦¿à¦Ÿà¦¸ à¦ªà§‡à¦œà¦Ÿà¦¿à¦•à§‡ à¦†à¦°à¦“ à¦‡à¦‰à¦œà¦¾à¦°-à¦«à§�à¦°à§‡à¦¨à§�à¦¡à¦²à¦¿ à¦•à¦°à¦¤à§‡ à¦¡à§�à¦¯à¦¼à¦¾à¦²-à¦­à¦¿à¦‰ à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦°à¦¿à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à§‡ à¦«à§�à¦²-à¦¸à§�à¦•à§�à¦°à¦¿à¦¨ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦“à§Ÿà¦¾à¦°à§�à¦•à¦¸à§�à¦ªà§‡à¦¸ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦• à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦²à¦¿à¦¸à§�à¦Ÿ, à¦¡à¦¿à¦«à¦²à§�à¦Ÿ à¦•à§�à¦‡à¦•-à¦«à¦¿à¦² à¦…à§�à¦¯à¦¾à¦®à¦¾à¦‰à¦¨à§�à¦Ÿ, à¦ªà§�à¦°à¦¤à¦¿ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿à¦° à¦œà¦¨à§�à¦¯ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦…à§�à¦¯à¦¾à¦®à¦¾à¦‰à¦¨à§�à¦Ÿ à¦�à¦¬à¦‚ à¦®à§�à¦¯à¦¾à¦¨à§�à¦¯à¦¼à¦¾à¦²à¦¿ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦¯à§�à¦•à§�à¦¤/à¦¬à¦¾à¦¦ à¦¦à§‡à¦“à§Ÿà¦¾à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "116",
    "date": "2026-07-28T15:56",
    "type": "Modify",
    "module": "Company Setup",
    "link": "/company-setup",
    "descriptionEn": "Added a new 'Half Leave' Yes/No setting dropdown to the Company Architecture & ID Setup configuration panel on the Company Setup page.",
    "descriptionBn": "à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿ à¦¸à§‡à¦Ÿà¦†à¦ª à¦ªà§‡à¦œà§‡à¦° à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿ à¦†à¦°à§�à¦•à¦¿à¦Ÿà§‡à¦•à¦šà¦¾à¦° à¦…à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦†à¦‡à¦¡à¦¿ à¦¸à§‡à¦Ÿà¦†à¦ª à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦²à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ 'Half Leave' (Yes/No) à¦¸à§‡à¦Ÿà¦¿à¦‚ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "115",
    "date": "2026-07-29T10:10",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-dashboard",
    "descriptionEn": "Simplified the Merchandising module sidebar menu by removing all other links and keeping only the Dashboard and Order Entry & Costing workspace.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦®à§‡à¦¨à§� à¦¥à§‡à¦•à§‡ à¦…à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¯ à¦¸à¦¬ à¦²à¦¿à¦‚à¦• à¦¬à¦¾à¦¦ à¦¦à¦¿à§Ÿà§‡ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° à¦¡à§�à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§�à¦¡ à¦�à¦¬à¦‚ à¦…à¦°à§�à¦¡à¦¾à¦° à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦“ à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦“à§Ÿà¦¾à¦°à§�à¦•à¦¸à§�à¦ªà§‡à¦¸ à¦°à§‡à¦–à§‡ à¦�à¦•à§‡ à¦¸à¦¹à¦œ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "114",
    "date": "2026-07-29T10:12",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Added the new 'MERC Master Setting' accordion sidebar menu containing 34 custom submenus, correctly mapped to default RMG database tabs.",
    "descriptionBn": "à§©à§ªà¦Ÿà¦¿ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� à¦¬à¦¿à¦¶à¦¿à¦·à§�à¦Ÿ à¦¨à¦¤à§�à¦¨ 'MERC Master Setting' à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦�à¦•à¦°à§�à¦¡à¦¿à¦¯à¦¼à¦¨ à¦®à§‡à¦¨à§� à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¸à§‡à¦—à§�à¦²à§‹à¦•à§‡ à¦¯à¦¥à§‹à¦ªà¦¯à§�à¦•à§�à¦¤ RMG à¦¡à§‡à¦Ÿà¦¾à¦¬à§‡à¦¸ à¦Ÿà§�à¦¯à¦¾à¦¬à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à¦‚à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "113",
    "date": "2026-07-29T10:15",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Refactored the MERC Master Settings to use a clean split layout. The sidebar menu now has a single direct link, and the settings page groups all 34 sub-settings into interactive sub-tabs nested within the 5 main database categories. Also built a fully functional generic CRUD Master DB manager.",
    "descriptionBn": "MERC à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸ à¦ªà§‡à¦œà¦Ÿà¦¿à¦•à§‡ à¦šà¦®à§Žà¦•à¦¾à¦° à¦¸à§�à¦ªà§�à¦²à¦¿à¦Ÿ à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡ à¦�à¦–à¦¨ à¦�à¦•à¦Ÿà¦¿ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦²à¦¿à¦‚à¦• à¦°à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦ªà§‡à¦œà§‡à¦° à¦­à§‡à¦¤à¦°à§‡ à§©à§ªà¦Ÿà¦¿ à¦ªà§�à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦°à¦•à§‡ à§«à¦Ÿà¦¿ à¦®à§‚à¦² à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿à¦° à¦­à§‡à¦¤à¦°à§‡ à¦¸à¦¾à¦¬-à¦Ÿà§�à¦¯à¦¾à¦¬ à¦†à¦•à¦¾à¦°à§‡ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦›à¦¾à§œà¦¾ à¦�à¦•à¦Ÿà¦¿ à¦«à§�à¦²-à¦«à¦¾à¦‚à¦¶à¦¨à¦¾à¦² à¦œà§‡à¦¨à§‡à¦°à¦¿à¦• CRUD à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦¡à¦¾à¦Ÿà¦¾à¦¬à§‡à¦¸ à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦¾à¦° à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "112",
    "date": "2026-07-29T10:23",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Reorganized the Merchandising Settings hierarchy to match the requested 8-category taxonomy (Company Configuration, Business Partners, Product Masters, Fabric Masters, Yarn Masters, Color & Processing, Costing, and Quality). Renamed the sidebar settings menu to 'Merchandising Settings'.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸à§‡à¦° à¦¸à§�à¦¤à¦°à¦¬à¦¿à¦¨à§�à¦¯à¦¾à¦¸ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ à¦…à¦¨à§�à¦°à§‹à¦§à¦•à§ƒà¦¤ à§®à¦Ÿà¦¿ à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿à¦¤à§‡ (à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨, à¦¬à¦¿à¦œà¦¨à§‡à¦¸ à¦ªà¦¾à¦°à§�à¦Ÿà¦¨à¦¾à¦°, à¦ªà§�à¦°à§‹à¦¡à¦¾à¦•à§�à¦Ÿ à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦°à§�à¦¸, à¦«à§‡à¦¬à§�à¦°à¦¿à¦• à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦°à§�à¦¸, à¦‡à¦¯à¦¼à¦¾à¦°à§�à¦¨ à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦°à§�à¦¸, à¦•à¦¾à¦²à¦¾à¦° à¦“ à¦ªà§�à¦°à¦¸à§‡à¦¸à¦¿à¦‚, à¦•à¦¸à§�à¦Ÿà¦¿à¦‚, à¦�à¦¬à¦‚ à¦•à§‹à¦¯à¦¼à¦¾à¦²à¦¿à¦Ÿà¦¿) à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡à¦° à¦®à§‡à¦¨à§�à¦° à¦¨à¦¾à¦® à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ 'Merchandising Settings' à¦°à¦¾à¦–à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "111",
    "date": "2026-07-29T10:25",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented a fully nested three-level accordion layout in the Merchandising Settings sidebar. Clicking 'Merchandising Settings' now reveals the 8 sub-categories, and clicking each sub-category reveals its corresponding parameter configuration links.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸à§‡à¦° à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¤à§�à¦°à¦¿à¦®à¦¾à¦¤à§�à¦°à¦¿à¦• à¦�à¦•à¦°à§�à¦¡à¦¿à¦¯à¦¼à¦¨ à¦²à§‡à¦†à¦‰à¦Ÿ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ 'Merchandising Settings' à¦� à¦•à§�à¦²à¦¿à¦• à¦•à¦°à¦²à§‡ à§®à¦Ÿà¦¿ à¦¸à¦¾à¦¬-à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿ à¦¦à§ƒà¦¶à§�à¦¯à¦®à¦¾à¦¨ à¦¹à¦¯à¦¼, à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦¸à¦¾à¦¬-à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿à¦¤à§‡ à¦•à§�à¦²à¦¿à¦• à¦•à¦°à¦²à§‡ à¦¤à¦¾à¦° à¦…à¦¨à§�à¦¤à¦°à§�à¦­à§�à¦•à§�à¦¤ à¦ªà§�à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦° à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦²à¦¿à¦‚à¦•à¦—à§�à¦²à§‹ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¯à¦¼à¥¤"
  },
  {
    "id": "110",
    "date": "2026-07-29T11:20",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Fixed the sidebar scrolling behavior by removing nested max-height restrictions and duplicate scrollbars from the nested subGroup accordion containers, allowing the entire sidebar pane to scroll naturally.",
    "descriptionBn": "à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦¸à§�à¦•à§�à¦°à§‹à¦²à¦¿à¦‚ à¦¸à¦®à¦¸à§�à¦¯à¦¾ à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦¸à¦¾à¦¬-à¦—à§�à¦°à§�à¦ª à¦�à¦•à¦°à§�à¦¡à¦¿à¦¯à¦¼à¦¨ à¦•à¦¨à§�à¦Ÿà§‡à¦‡à¦¨à¦¾à¦° à¦¥à§‡à¦•à§‡ à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ à¦®à§�à¦¯à¦¾à¦•à§�à¦¸-à¦¹à¦¾à¦‡à¦Ÿ à¦�à¦¬à¦‚ à¦¡à§�à¦ªà§�à¦²à¦¿à¦•à§‡à¦Ÿ à¦¸à§�à¦•à§�à¦°à§‹à¦²à¦¬à¦¾à¦° à¦¸à¦°à¦¿à¦¯à¦¼à§‡ à¦«à§‡à¦²à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à¦¾à¦° à¦«à¦²à§‡ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à¦Ÿà¦¿ à¦�à¦–à¦¨ à¦¸à§�à¦¬à¦¾à¦šà§�à¦›à¦¨à§�à¦¦à§�à¦¯à§‡ à¦¸à§�à¦•à§�à¦°à§‹à¦² à¦•à¦°à¦¾ à¦¯à¦¾à¦¯à¦¼à¥¤"
  },
  {
    "id": "109",
    "date": "2026-07-29T11:25",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Fixed text alignment issues on the accordion header buttons by adding the 'text-left' class, ensuring wrapped texts are properly left-aligned.",
    "descriptionBn": "à¦�à¦•à¦°à§�à¦¡à¦¿à¦¯à¦¼à¦¨ à¦¹à§‡à¦¡à¦¾à¦° à¦¬à¦¾à¦Ÿà¦¨à¦—à§�à¦²à§‹à¦° à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦…à§�à¦¯à¦¾à¦²à¦¾à¦‡à¦¨à¦®à§‡à¦¨à§�à¦Ÿ à¦«à¦¿à¦•à§�à¦¸ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ 'text-left' à¦•à§�à¦²à¦¾à¦¸ à¦¯à§‹à¦— à¦•à¦°à¦¾à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦¨à¦¿à¦¶à§�à¦šà¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à§‡ à¦°â€�à§�à¦¯à¦¾à¦ª à¦¹à¦“à¦¯à¦¼à¦¾ à¦²à§‡à¦–à¦¾à¦—à§�à¦²à§‹ à¦¬à¦¾à¦� à¦¦à¦¿à¦•à§‡ à¦¸à¦®à¦¾à¦¨à¦­à¦¾à¦¬à§‡ à¦¬à¦¿à¦¨à§�à¦¯à¦¸à§�à¦¤ à¦¥à¦¾à¦•à¦¬à§‡à¥¤"
  },
  {
    "id": "108",
    "date": "2026-07-30T10:59",
    "type": "New Addition",
    "module": "Personnel File",
    "link": "/add-employee",
    "descriptionEn": "Added a new 'Allowance' card to the personnel file creation page and updated the employee detail view to show these overtime, holiday rate, behavior bonus, and transport/mobile/lunch allowances dynamically.",
    "descriptionBn": "à¦ªà¦¾à¦°à§�à¦¸à§‹à¦¨à§‡à¦² à¦«à¦¾à¦‡à¦² à¦•à§�à¦°à¦¿à§Ÿà§‡à¦¶à¦¨ à¦ªà§‡à¦œà§‡ à¦�à¦•à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ 'Allowance' à¦•à¦¾à¦°à§�à¦¡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦�à¦®à¦ªà§�à¦²à§Ÿà¦¿ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦­à¦¿à¦‰à¦¤à§‡ à¦“à¦­à¦¾à¦°à¦Ÿà¦¾à¦‡à¦®, à¦¹à§‹à¦²à¦¿à¦¡à§‡ à¦°à§‡à¦Ÿ, à¦¬à¦¿à¦¹à§‡à¦­à¦¿à§Ÿà¦¾à¦° à¦¬à§‹à¦¨à¦¾à¦¸ à¦�à¦¬à¦‚ à¦Ÿà§�à¦°à¦¾à¦¨à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ/à¦®à§‹à¦¬à¦¾à¦‡à¦²/à¦²à¦¾à¦žà§�à¦š à¦…à§�à¦¯à¦¾à¦²à¦¾à¦‰à¦¨à§�à¦¸à¦—à§�à¦²à§‹ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦•à¦²à¦¿ à¦¦à§‡à¦–à¦¾à¦¨à§‹à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "107",
    "date": "2026-07-30T11:05",
    "type": "Modify",
    "module": "Personnel File",
    "link": "/add-employee",
    "descriptionEn": "Simplified the Disbursement Routing & Bank Details card to show only Bank Pay, Cash Pay, Bank Name, and Account Number in both employee creation and employee detail views.",
    "descriptionBn": "à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦•à§�à¦°à¦¿à¦¯à¦¼à§‡à¦¶à¦¨ à¦�à¦¬à¦‚ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦‰à¦­à¦¯à¦¼ à¦ªà§‡à¦œà§‡à¦‡ à¦¬à§�à¦¯à¦¾à¦‚à¦• à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦•à¦¾à¦°à§�à¦¡à¦Ÿà¦¿ à¦¸à¦¹à¦œ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° à¦¬à§�à¦¯à¦¾à¦‚à¦• à¦ªà§‡, à¦•à§�à¦¯à¦¾à¦¶ à¦ªà§‡, à¦¬à§�à¦¯à¦¾à¦‚à¦•à§‡à¦° à¦¨à¦¾à¦® à¦�à¦¬à¦‚ à¦…à§�à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§�à¦Ÿ à¦¨à¦®à§�à¦¬à¦° à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¯à¦¼à¥¤"
  },
  {
    "id": "106",
    "date": "2026-07-30T11:10",
    "type": "Modify",
    "module": "Personnel File",
    "link": "/add-employee",
    "descriptionEn": "Shifted Job Description and Assigned Equipment & Assets sections from Financial & Employment to Qualifications & Experience tab on both employee creation and details screens. Removed the Submit button from the custom Allowance card.",
    "descriptionBn": "à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦•à§�à¦°à¦¿à¦¯à¦¼à§‡à¦¶à¦¨ à¦�à¦¬à¦‚ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦‰à¦­à¦¯à¦¼ à¦ªà§‡à¦œà§‡à¦‡ à¦•à¦°à¦ªà§‹à¦°à§‡à¦Ÿ à¦œà¦¬ à¦¡à§‡à¦¸à¦•à§�à¦°à¦¿à¦ªà¦¶à¦¨ à¦�à¦¬à¦‚ à¦•à¦°à¦ªà§‹à¦°à§‡à¦Ÿ à¦‡à¦•à§�à¦‡à¦ªà¦®à§‡à¦¨à§�à¦Ÿ à¦¸à§‡à¦•à¦¶à¦¨ à¦¦à§�à¦Ÿà¦¿à¦•à§‡ à¦«à¦¿à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¸à¦¿à¦¯à¦¼à¦¾à¦² à¦…à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦®à§‡à¦¨à§�à¦Ÿ à¦Ÿà§�à¦¯à¦¾à¦¬ à¦¥à§‡à¦•à§‡ à¦•à§‹à¦¯à¦¼à¦¾à¦²à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦…à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦�à¦•à§�à¦¸à¦ªà§‡à¦°à¦¿à¦¯à¦¼à§‡à¦¨à§�à¦¸ à¦Ÿà§�à¦¯à¦¾à¦¬à§‡ à¦¸à§�à¦¥à¦¾à¦¨à¦¾à¦¨à§�à¦¤à¦°à¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦…à§�à¦¯à¦¾à¦²à¦¾à¦‰à¦¨à§�à¦¸ à¦•à¦¾à¦°à§�à¦¡ à¦¥à§‡à¦•à§‡ à¦¸à¦¾à¦¬à¦®à¦¿à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨à¦Ÿà¦¿ à¦¸à¦°à¦¿à¦¯à¦¼à§‡ à¦«à§‡à¦²à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "105",
    "date": "2026-07-30T11:15",
    "type": "Modify",
    "module": "Personnel File",
    "link": "/add-employee",
    "descriptionEn": "Implemented robust file uploading, size validation (5MB max), extension validation (.pdf, .jpg, .jpeg, .png), upload progress indicators, and an interactive secure document preview modal for academic and experience attachments.",
    "descriptionBn": "à¦�à¦•à¦¾à¦¡à§‡à¦®à¦¿à¦• à¦�à¦¬à¦‚ à¦…à¦­à¦¿à¦œà§�à¦žà¦¤à¦¾ à¦¸à¦¨à¦¦à§‡à¦° à¦…à§�à¦¯à¦¾à¦Ÿà¦¾à¦šà¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦œà¦¨à§�à¦¯ à¦¶à¦•à§�à¦¤à¦¿à¦¶à¦¾à¦²à§€ à¦«à¦¾à¦‡à¦² à¦†à¦ªà¦²à§‹à¦¡à¦¿à¦‚, à¦«à¦¾à¦‡à¦²à§‡à¦° à¦¸à¦¾à¦‡à¦œ à¦­à§�à¦¯à¦¾à¦²à¦¿à¦¡à§‡à¦¶à¦¨ (à¦¸à¦°à§�à¦¬à§‹à¦šà§�à¦š à§« à¦®à§‡à¦—à¦¾à¦¬à¦¾à¦‡à¦Ÿ), à¦«à¦¾à¦‡à¦² à¦�à¦•à§�à¦¸à¦Ÿà§‡à¦¨à¦¶à¦¨ à¦­à§�à¦¯à¦¾à¦²à¦¿à¦¡à§‡à¦¶à¦¨ (.pdf, .jpg, .jpeg, .png), à¦†à¦ªà¦²à§‹à¦¡ à¦ªà§�à¦°à§‹à¦—à§�à¦°à§‡à¦¸ à¦¬à¦¾à¦° à¦�à¦¬à¦‚ à¦�à¦•à¦Ÿà¦¿ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à§‡à¦•à§�à¦Ÿà¦¿à¦­ à¦¸à¦¿à¦•à¦¿à¦‰à¦° à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦ªà§�à¦°à¦¿à¦­à¦¿à¦‰ à¦®à§‹à¦¡à¦¾à¦² à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "104",
    "date": "2026-07-30T12:00",
    "type": "Modify",
    "module": "Personnel File",
    "link": "/add-employee",
    "descriptionEn": "Added a smart missing attachment warning modal on form submit. It detects which academic degrees and work experience entries are filled in but missing a supporting document, lists them by name, and lets the user go back to attach files or proceed anyway.",
    "descriptionBn": "à¦«à¦°à§�à¦® à¦¸à¦¾à¦¬à¦®à¦¿à¦Ÿà§‡à¦° à¦¸à¦®à¦¯à¦¼ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦®à¦¾à¦°à§�à¦Ÿ à¦®à¦¿à¦¸à¦¿à¦‚ à¦…à§�à¦¯à¦¾à¦Ÿà¦¾à¦šà¦®à§‡à¦¨à§�à¦Ÿ à¦“à¦¯à¦¼à¦¾à¦°à§�à¦¨à¦¿à¦‚ à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦Ÿà¦¿ à¦¸à§�à¦¬à¦¯à¦¼à¦‚à¦•à§�à¦°à¦¿à¦¯à¦¼à¦­à¦¾à¦¬à§‡ à¦¶à¦¨à¦¾à¦•à§�à¦¤ à¦•à¦°à§‡ à¦•à§‹à¦¨ à¦�à¦•à¦¾à¦¡à§‡à¦®à¦¿à¦• à¦¡à¦¿à¦—à§�à¦°à¦¿ à¦¬à¦¾ à¦•à¦°à§�à¦®à¦…à¦­à¦¿à¦œà§�à¦žà¦¤à¦¾à¦° à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿à¦¤à§‡ à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦†à¦ªà¦²à§‹à¦¡ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à¦¨à¦¿, à¦¸à§‡à¦—à§�à¦²à§‹à¦° à¦¨à¦¾à¦® à¦¦à¦¿à¦¯à¦¼à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦¦à§‡à¦–à¦¾à¦¯à¦¼, à¦�à¦¬à¦‚ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦°à¦•à¦¾à¦°à§€à¦•à§‡ à¦«à¦¿à¦°à§‡ à¦—à¦¿à¦¯à¦¼à§‡ à¦¡à¦•à§�à¦®à§‡à¦¨à§�à¦Ÿ à¦¯à§‹à¦— à¦•à¦°à¦¾à¦° à¦¬à¦¾ à¦�à¦¡à¦¼à¦¿à¦¯à¦¼à§‡ à¦¸à¦¾à¦¬à¦®à¦¿à¦Ÿ à¦•à¦°à¦¾à¦° à¦¸à§�à¦¯à§‹à¦— à¦¦à§‡à¦¯à¦¼à¥¤"
  },
  {
    "id": "103",
    "date": "2026-07-30T12:12",
    "type": "Modify",
    "module": "Personnel File",
    "link": "/add-employee",
    "descriptionEn": "Implemented the dynamic pre-upload attachment ID generation and saved qualification/experience details with attachment tokens in localStorage during employee creation.",
    "descriptionBn": "à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦•à§�à¦°à¦¿à¦¯à¦¼à§‡à¦¶à¦¨ à¦«à¦°à§�à¦®à§‡ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦• à¦ªà§�à¦°à¦¿-à¦†à¦ªà¦²à§‹à¦¡ à¦…à§�à¦¯à¦¾à¦Ÿà¦¾à¦šà¦®à§‡à¦¨à§�à¦Ÿ à¦†à¦‡à¦¡à¦¿ à¦œà§‡à¦¨à¦¾à¦°à§‡à¦¶à¦¨ à¦‡à¦®à¦ªà§�à¦²à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦²à§‹à¦•à¦¾à¦² à¦¸à§�à¦Ÿà§‹à¦°à§‡à¦œà§‡ à¦•à§‹à¦¯à¦¼à¦¾à¦²à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦“ à¦�à¦•à§�à¦¸à¦ªà§‡à¦°à¦¿à¦¯à¦¼à§‡à¦¨à§�à¦¸ à¦¡à§‡à¦Ÿà¦¾ à¦…à§�à¦¯à¦¾à¦Ÿà¦¾à¦šà¦®à§‡à¦¨à§�à¦Ÿ à¦Ÿà§‹à¦•à§‡à¦¨à¦¸à¦¹ à¦¸à¦‚à¦°à¦•à§�à¦·à¦£ à¦•à¦°à¦¾à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "102",
    "date": "2026-07-30T14:18",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-dashboard",
    "descriptionEn": "Restructured the Merchandising module sidebar menu to align with the core RMG workflow: Inquiry, Quotation, PO Management, Pre Costing, Order Management (with sub-menus), Yarn Booking, and Fabric Booking, with the Merchandising Settings category moved to the top.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦®à§‡à¦¨à§� à¦†à¦°à¦�à¦®à¦œà¦¿ à¦“à¦¯à¦¼à¦¾à¦°à§�à¦•à¦«à§�à¦²à§‹ à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à¦¯à¦¼à§‡à¦›à§‡ (Inquiry, Quotation, PO Management, Pre Costing, Order Management sub-menus, Yarn Booking à¦�à¦¬à¦‚ Fabric Booking) à¦�à¦¬à¦‚ 'Merchandising Settings' à¦®à§‡à¦¨à§�à¦Ÿà¦¿à¦•à§‡ à¦¸à¦¬à¦¾à¦° à¦‰à¦ªà¦°à§‡ à¦¨à¦¿à¦¯à¦¼à§‡ à¦¯à¦¾à¦“à¦¯à¦¼à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "101",
    "date": "2026-07-30T14:24",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-dashboard",
    "descriptionEn": "Added 'Capacity' section with sub-menus (Monthly Capacity, Capacity Allocation, Capacity Distribution, Sales Target Entry) right after the Dashboard category in the Merchandising module sidebar.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡ Dashboard-à¦�à¦° à¦ªà¦° à¦¨à¦¤à§�à¦¨ 'Capacity' à¦®à§‡à¦¨à§� à¦�à¦¬à¦‚ à¦¤à¦¾à¦° à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§�à¦¸à¦®à§‚à¦¹ (Monthly Capacity, Capacity Allocation, Capacity Distribution, Sales Target Entry) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "100",
    "date": "2026-07-30T14:30",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-capacity-planning",
    "descriptionEn": "Implemented the fully interactive Capacity Allocation module, including a spreadsheet-style Master Ledger view with filters/searches/exports, and an inline day-by-day calculation form for month-wise line capacity allocation.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦•à§�à¦¯à¦¾à¦¡ à¦•à§�à¦¯à¦¾à¦ªà¦¾à¦¸à¦¿à¦Ÿà¦¿ à¦ªà§�à¦²à§�à¦¯à¦¾à¦¨à¦¿à¦‚ à¦®à¦¡à¦¿à¦‰à¦²à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à¦…à§�à¦¯à¦¾à¦•à§�à¦Ÿà¦¿à¦­ 'Capacity Allocation' à¦«à¦¿à¦šà¦¾à¦° à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦° à¦®à¦§à§�à¦¯à§‡ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°/à¦¸à¦¾à¦°à§�à¦š/à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦¸à¦¹ à¦¸à§�à¦ªà§�à¦°à§‡à¦¡à¦¶à¦¿à¦Ÿ-à¦¸à§�à¦Ÿà¦¾à¦‡à¦²à§‡à¦° à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦²à§‡à¦œà¦¾à¦° à¦­à¦¿à¦‰ à¦�à¦¬à¦‚ à¦¦à¦¿à¦¨à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦•à§�à¦¯à¦¾à¦ªà¦¾à¦¸à¦¿à¦Ÿà¦¿ à¦¹à¦¿à¦¸à¦¾à¦¬à§‡à¦° à¦œà¦¨à§�à¦¯ à¦«à¦°à§�à¦® à¦“à§Ÿà¦¾à¦°à§�à¦•à¦¸à§�à¦ªà§‡à¦¸ à¦…à¦¨à§�à¦¤à¦°à§�à¦­à§�à¦•à§�à¦¤ à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "99",
    "date": "2026-07-30T14:46",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-capacity-planning",
    "descriptionEn": "Implemented the 'Monthly Capacity' configuration panel inside the capacity planning module. Added Status, Year, and Month filters, spreadsheet export capabilities, and loaded realistic month-wise line machine/SMV capacity calculation entries as seed data.",
    "descriptionBn": "à¦•à§�à¦¯à¦¾à¦ªà¦¾à¦¸à¦¿à¦Ÿà¦¿ à¦ªà§�à¦²à§�à¦¯à¦¾à¦¨à¦¿à¦‚ à¦®à¦¡à¦¿à¦‰à¦²à§‡à¦° à¦…à¦§à§€à¦¨à§‡ 'Monthly Capacity' à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦² à¦‡à¦®à¦ªà§�à¦²à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦° à¦®à¦§à§�à¦¯à§‡ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸, à¦¬à¦›à¦°, à¦�à¦¬à¦‚ à¦®à¦¾à¦¸ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, à¦¸à§�à¦ªà§�à¦°à§‡à¦¡à¦¶à¦¿à¦Ÿ à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦�à¦¬à¦‚ à¦¬à¦¿à¦­à¦¿à¦¨à§�à¦¨ à¦®à¦¾à¦¸à§‡à¦° à¦®à§‡à¦¶à¦¿à¦¨/à¦�à¦¸à¦�à¦®à¦­à¦¿ à¦•à§�à¦¯à¦¾à¦ªà¦¾à¦¸à¦¿à¦Ÿà¦¿ à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦¶à¦¨ à¦¸à¦‚à¦•à§�à¦°à¦¾à¦¨à§�à¦¤ à¦¡à§‡à¦®à§‹ à¦¡à§‡à¦Ÿà¦¾ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "98",
    "date": "2026-07-30T14:48",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-capacity-planning",
    "descriptionEn": "Implemented the 'Capacity Distribution' workspace and list ledger in the capacity planning module. Features auto-lookup of month-wise capacities, multi-buyer selection (Zara, Mango, Fatface, etc.), allocation ratio validation, and real-time distribution summaries.",
    "descriptionBn": "à¦•à§�à¦¯à¦¾à¦ªà¦¾à¦¸à¦¿à¦Ÿà¦¿ à¦ªà§�à¦²à§�à¦¯à¦¾à¦¨à¦¿à¦‚ à¦®à¦¡à¦¿à¦‰à¦²à§‡ 'Capacity Distribution' à¦ªà§‡à¦œ à¦“ à¦²à§‡à¦œà¦¾à¦° à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦®à¦¾à¦¸à¦­à¦¿à¦¤à§�à¦¤à¦¿à¦• à¦®à§‹à¦Ÿ à¦•à§�à¦¯à¦¾à¦ªà¦¾à¦¸à¦¿à¦Ÿà¦¿ à¦°à¦¿à¦¯à¦¼à§‡à¦²-à¦Ÿà¦¾à¦‡à¦®à§‡ à¦¸à¦¾à¦°à§�à¦š à¦•à¦°à¦¾, à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ à¦¬à¦¾à¦¯à¦¼à¦¾à¦°à¦¦à§‡à¦° (à¦¯à§‡à¦®à¦¨: Zara, Mango, Fatface à¦‡à¦¤à§�à¦¯à¦¾à¦¦à¦¿) à¦®à¦§à§�à¦¯à§‡ à¦¶à¦¤à¦¾à¦‚à¦¶ à¦­à¦¾à¦— à¦•à¦°à§‡ à¦¦à§‡à¦“à§Ÿà¦¾ à¦�à¦¬à¦‚ à¦°à¦¿à¦¯à¦¼à§‡à¦²-à¦Ÿà¦¾à¦‡à¦®à§‡ à¦®à§‹à¦Ÿ à¦¬à¦£à§�à¦Ÿà¦¨à§‡à¦° à¦¯à§‹à¦—à¦«à¦² à¦¹à¦¿à¦¸à¦¾à¦¬à§‡à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "97",
    "date": "2026-07-30T14:55",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-monthly-capacity",
    "descriptionEn": "Refactored the capacity planning module from a single tabbed route to four separate, independent URLs/pages: /merchandising-monthly-capacity, /merchandising-capacity-allocation, /merchandising-capacity-distribution, and /merchandising-sales-target-entry. Updated the merchandising sidebar layout and navigation routes accordingly.",
    "descriptionBn": "à¦•à§�à¦¯à¦¾à¦ªà¦¾à¦¸à¦¿à¦Ÿà¦¿ à¦ªà§�à¦²à§�à¦¯à¦¾à¦¨à¦¿à¦‚ à¦®à¦¡à¦¿à¦‰à¦²à¦•à§‡ à¦�à¦•à¦Ÿà¦¿ à¦®à¦¾à¦¤à§�à¦° à¦Ÿà§�à¦¯à¦¾à¦¬à¦¡ à¦‡à¦‰à¦†à¦°à¦�à¦² à¦¥à§‡à¦•à§‡ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ à§ªà¦Ÿà¦¿ à¦†à¦²à¦¾à¦¦à¦¾ à¦‡à¦‰à¦†à¦°à¦�à¦² à¦“ à¦ªà§‡à¦œà§‡ à¦¬à¦¿à¦­à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: /merchandising-monthly-capacity, /merchandising-capacity-allocation, /merchandising-capacity-distribution à¦�à¦¬à¦‚ /merchandising-sales-target-entryà¥¤ à¦¸à§‡à¦‡ à¦¸à¦¾à¦¥à§‡ à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦²à§‡à¦†à¦‰à¦Ÿ à¦“ à¦¨à§‡à¦­à¦¿à¦—à§‡à¦¶à¦¨ à¦²à¦¿à¦‚à¦•à¦¸à¦®à§‚à¦¹ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "96",
    "date": "2026-07-30T14:58",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-capacity-distribution",
    "descriptionEn": "Refactored the Capacity Distribution list layout and edit controls to match the user's reference columns: SL, edit pencil, Company Name, Location, Year, Month, Total Capacity (Min), and Total Capacity (Pcs). Also refactored the creation/editing view to open in a wide modal overlay with a dual-panel layout.",
    "descriptionBn": "à¦‡à¦‰à¦œà¦¾à¦°à§‡à¦° à¦¦à§‡à§Ÿà¦¾ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦•à§�à¦¯à¦¾à¦ªà¦¾à¦¸à¦¿à¦Ÿà¦¿ à¦¡à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿à¦¬à¦¿à¦‰à¦¶à¦¨ à¦Ÿà§‡à¦¬à¦¿à¦²à§‡à¦° à¦•à¦²à¦¾à¦®à¦¸à¦®à§‚à¦¹ à¦�à¦¬à¦‚ à¦�à¦¡à¦¿à¦Ÿ à¦ªà§‡à¦¨à§�à¦¸à¦¿à¦² à¦ªà¦œà¦¿à¦¶à¦¨ à¦¬à¦¿à¦¨à§�à¦¯à¦¸à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦›à¦¾à§œà¦¾ à¦�à¦²à§‹à¦•à§‡à¦¶à¦¨ à¦ªà§‡à¦œà§‡à¦° à¦®à¦¤à§‹ à¦¡à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿à¦¬à¦¿à¦‰à¦¶à¦¨ à¦¤à§ˆà¦°à¦¿ à¦“ à¦�à¦¡à¦¿à¦Ÿ à¦•à¦°à¦¾à¦° à¦«à¦°à§�à¦®à¦Ÿà¦¿à¦•à§‡à¦“ à¦¬à§�à¦¯à¦¾à¦•à¦¡à§�à¦°à¦ª-à¦¬à§�à¦²à¦¾à¦°à¦¡ à¦®à§‹à¦¡à¦¾à¦²à§‡ à¦°à§�à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "95",
    "date": "2026-07-30T15:00",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-sales-target-entry",
    "descriptionEn": "Refactored the Sales Target Entry page. List view now features columns: SL, edit pencil, Year, and Buyer Name. Added a backdrop-blurred wide modal for creating/editing targets with top controls: Year, Buyer, and GET MONTH button, along with a bottom-scrollable 12-month details grid showing: SL, Month, Quantity (Pcs), Amount (USD), Minute, Margin (USD), CM, RM, Avg SMV, Avg Eff, Mgt Notes, and a blue Team ACTION button.",
    "descriptionBn": "à¦¸à§‡à¦²à¦¸ à¦Ÿà¦¾à¦°à§�à¦—à§‡à¦Ÿ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦ªà§‡à¦œà¦Ÿà¦¿ à¦°à¦¿à¦«à§�à¦¯à¦¾à¦•à§�à¦Ÿà¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦²à¦¿à¦¸à§�à¦Ÿ à¦­à¦¿à¦‰ à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ SL, à¦�à¦¡à¦¿à¦Ÿ à¦ªà§‡à¦¨à§�à¦¸à¦¿à¦², à¦¬à¦›à¦° à¦�à¦¬à¦‚ à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦¨à¦¾à¦®à§‡à¦° à¦•à¦²à¦¾à¦® à¦°à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦›à¦¾à§œà¦¾ à¦Ÿà¦¾à¦°à§�à¦—à§‡à¦Ÿ à¦¤à§ˆà¦°à¦¿ à¦“ à¦�à¦¡à¦¿à¦Ÿ à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦¬à§�à¦¯à¦¾à¦•à¦¡à§�à¦°à¦ª-à¦¬à§�à¦²à¦¾à¦°à¦¡ à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦¬à¦›à¦°, à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦�à¦¬à¦‚ GET MONTH à¦¬à¦¾à¦Ÿà¦¨à§‡à¦° à¦¸à¦¾à¦¹à¦¾à¦¯à§�à¦¯à§‡ à§§à§¨ à¦®à¦¾à¦¸à§‡à¦° à¦›à¦• à¦œà§‡à¦¨à¦¾à¦°à§‡à¦Ÿ à¦•à¦°à¦¾ à¦“ à¦•à¦²à¦¾à¦®à¦¸à¦®à§‚à¦¹à§‡à¦° à¦®à§‹à¦Ÿ à¦¯à§‹à¦—à¦«à¦² à¦°à¦¿à¦¯à¦¼à§‡à¦²-à¦Ÿà¦¾à¦‡à¦®à§‡ à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦Ÿ à¦•à¦°à¦¾à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "94",
    "date": "2026-07-30T15:08",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-work-orders",
    "descriptionEn": "Added a new 'Workorder' accordion menu in the Merchandising Sidebar below Fabric Booking. Included submenus: Dyed Yarn WO, Trims WO, Wash WO, AOP WO, Print WO, Emb WO, and Sweater Service WO, pointing to /merchandising-work-orders with specific tab query parameters.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡ Fabric Booking à¦�à¦° à¦¨à¦¿à¦šà§‡ à¦¨à¦¤à§�à¦¨ 'Workorder' à¦…à§�à¦¯à¦¾à¦•à¦°à§�à¦¡à¦¿à¦¯à¦¼à¦¨ à¦®à§‡à¦¨à§� à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦° à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§�à¦¸à¦®à§‚à¦¹ à¦¹à¦šà§�à¦›à§‡: Dyed Yarn WO, Trims WO, Wash WO, AOP WO, Print WO, Emb WO, à¦�à¦¬à¦‚ Sweater Service WO; à¦¯à¦¾ à¦Ÿà¦¾à¦°à§�à¦—à§‡à¦Ÿ à¦•à§�à§Ÿà§‡à¦°à¦¿ à¦Ÿà§�à¦¯à¦¾à¦¬ à¦¨à¦¿à§Ÿà§‡ /merchandising-work-orders à¦°à§�à¦Ÿà§‡ à¦¨à§‡à¦­à¦¿à¦—à§‡à¦Ÿ à¦•à¦°à¦¬à§‡à¥¤"
  },
  {
    "id": "93",
    "date": "2026-07-30T15:11",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-reports",
    "descriptionEn": "Added a new 'Reports' accordion menu in the Merchandising Sidebar containing 24 submenu entries (Sample Report, Capacity & Booking, Order Summary, Date Wise Shipment, Yarn Booking Status, Order Pre. Vs Post Costing, etc.) pointing to /merchandising-reports with tab query configurations.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡ à¦¸à¦°à§�à¦¬à¦¶à§‡à¦·à§‡ à¦¨à¦¤à§�à¦¨ 'Reports' à¦…à§�à¦¯à¦¾à¦•à¦°à§�à¦¡à¦¿à¦¯à¦¼à¦¨ à¦®à§‡à¦¨à§� à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦° à¦…à¦§à§€à¦¨à§‡ à§¨à§ªà¦Ÿà¦¿ à¦°à¦¿à¦ªà§‹à¦°à§�à¦Ÿà¦¿à¦‚ à¦¸à¦¾à¦¬-à¦®à§‡à¦¨à§� (à¦¯à§‡à¦®à¦¨: Sample Report, Capacity & Booking, Order Summary, Date Wise Shipment, Yarn Booking Status, Order Pre. Vs Post Costing à¦‡à¦¤à§�à¦¯à¦¾à¦¦à¦¿) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾ à¦Ÿà§�à¦¯à¦¾à¦¬ à¦•à§�à§Ÿà§‡à¦°à¦¿ à¦¨à¦¿à§Ÿà§‡ /merchandising-reports à¦°à§�à¦Ÿà§‡ à¦¨à§‡à¦­à¦¿à¦—à§‡à¦Ÿ à¦•à¦°à¦¬à§‡à¥¤"
  },
  {
    "id": "92",
    "date": "2026-07-30T15:12",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Renamed the 'Merchandising Settings' accordion label to 'MM Settings' in the sidebar layout.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦²à§‡à¦†à¦‰à¦Ÿà§‡ 'Merchandising Settings' à¦…à§�à¦¯à¦¾à¦•à¦°à§�à¦¡à¦¿à¦¯à¦¼à¦¨ à¦²à§‡à¦¬à§‡à¦²à§‡à¦° à¦¨à¦¾à¦® à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ 'MM Settings' à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "91",
    "date": "2026-07-30T15:15",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-reports",
    "descriptionEn": "Refactored the sidebar component in MerchandisingLayout.tsx to preserve and restore scroll position via sessionStorage. Updated accordion expanded states initialization to dynamically analyze the current URL pathname and search tab parameters, ensuring the active category and subitem are always expanded, selected, and scrolled into view.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦°à§‡ à¦¸à§�à¦•à§�à¦°à¦² à¦ªà¦œà¦¿à¦¶à¦¨ à¦§à¦°à§‡à¦° à¦°à¦¾à¦–à¦¾à¦° à¦œà¦¨à§�à¦¯ sessionStorage à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦¸à§‡à¦‡ à¦¸à¦¾à¦¥à§‡ à¦…à§�à¦¯à¦¾à¦•à¦°à§�à¦¡à¦¿à¦¯à¦¼à¦¨à¦—à§�à¦²à§‹à¦° à¦�à¦•à§�à¦¸à¦ªà§�à¦¯à¦¾à¦¨à§�à¦¡à§‡à¦¡ à¦¸à§�à¦Ÿà§‡à¦Ÿ à¦¡à¦¾à¦¯à¦¼à¦¨à¦¾à¦®à¦¿à¦• à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦¬à¦°à§�à¦¤à¦®à¦¾à¦¨ à¦ªà§‡à¦œ à¦�à¦¬à¦‚ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦Ÿà§�à¦¯à¦¾à¦¬à§‡à¦° à¦‰à¦ªà¦° à¦­à¦¿à¦¤à§�à¦¤à¦¿ à¦•à¦°à§‡ à¦¸à¦‚à¦¶à§�à¦²à¦¿à¦·à§�à¦Ÿ à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿à¦Ÿà¦¿ à¦¸à§�à¦¬à§Ÿà¦‚à¦•à§�à¦°à¦¿à§Ÿà¦­à¦¾à¦¬à§‡ à¦�à¦•à§�à¦¸à¦ªà§�à¦¯à¦¾à¦¨à§�à¦¡à§‡à¦¡, à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà§‡à¦¡ à¦�à¦¬à¦‚ à¦¸à§�à¦•à§�à¦°à¦² à¦­à¦¿à¦‰à¦¤à§‡ à¦¦à§ƒà¦¶à§�à¦¯à¦®à¦¾à¦¨ à¦¥à¦¾à¦•à§‡à¥¤"
  },
  {
    "id": "90",
    "date": "2026-07-30T15:17",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Moved the static menuCategories configuration array outside the MerchandisingLayout component scope to fix a ReferenceError during component state initialization.",
    "descriptionBn": "à¦¸à§�à¦Ÿà§‡à¦Ÿ à¦‡à¦¨à¦¿à¦¶à¦¿à§Ÿà¦¾à¦²à¦¾à¦‡à¦œà§‡à¦¶à¦¨ à¦�à¦° à¦¸à¦®à§Ÿ à¦†à¦¸à¦¾ ReferenceError à¦¦à§‚à¦° à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ MerchandisingLayout à¦•à¦®à§�à¦ªà§‹à¦¨à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦¬à¦¾à¦‡à¦°à§‡ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¿à¦• menuCategories à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦…à§�à¦¯à¦¾à¦°à§‡à¦Ÿà¦¿à¦•à§‡ à¦¸à¦°à¦¿à§Ÿà§‡ à¦¨à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "89",
    "date": "2026-07-30T15:23",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Refactored the Company Wise MERC Setting master page under MM Settings. Rendered custom company ledger table (Act hamburger dropdown, SL, Company Name, Address, and status badges). Implemented action dropdown with items (Fabric Source, Print Type, Fabric Nature, UOM, Body Part, Map DOM Key) that trigger backdrop-blurred multi-select tag modal setup editors with suggestion listings and manual custom tagging.",
    "descriptionBn": "MM Settings à¦�à¦° à¦…à¦§à§€à¦¨à§‡ 'Company Wise MERC Setting' à¦ªà§‡à¦œà¦Ÿà¦¿ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¨à¦¤à§�à¦¨à¦­à¦¾à¦¬à§‡ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿à¦° à¦œà¦¨à§�à¦¯ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ (Fabric Source, Print Type, Fabric Nature, UOM, Body Part, Map DOM Key) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦«à¦¿à¦šà¦¾à¦°à§‡à¦° à¦œà¦¨à§�à¦¯ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à§‡à¦•à§�à¦Ÿà¦¿à¦­ à¦Ÿà§�à¦¯à¦¾à¦— à¦�à¦¡à¦¿à¦Ÿà¦° à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦ªà§�à¦°à¦¿à¦¸à§‡à¦Ÿ à¦¸à¦¾à¦œà§‡à¦¶à¦¨ à¦¥à§‡à¦•à§‡ à¦Ÿà§�à¦¯à¦¾à¦— à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¾ à¦¬à¦¾ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦Ÿà¦¾à¦‡à¦ªà¦¿à¦‚à§Ÿà§‡à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦Ÿà§�à¦¯à¦¾à¦— à¦…à§�à¦¯à¦¾à¦¡ à¦•à¦°à¦¾à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "88",
    "date": "2026-07-30T15:47",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings?tab=costing-configuration-cpm",
    "descriptionEn": "Replaced the old simple 4-field Costing Configuration panel with a proper data table showing Setup Date, Year, Month, CM Expense, No of Resource, Working Hour, Working Day, CPM (auto-calculated), Applied CPM, Currency, and Status. Added Create and Update modals with full field validation.",
    "descriptionBn": "à¦ªà§�à¦°à¦¨à§‹ à¦¸à¦¾à¦§à¦¾à¦°à¦£ à§ª-à¦«à¦¿à¦²à§�à¦¡à§‡à¦° Costing Configuration à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦²à¦Ÿà¦¿ à¦�à¦•à¦Ÿà¦¿ à¦ªà§‚à¦°à§�à¦£à¦¾à¦™à§�à¦— à¦¡à§‡à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¦à¦¿à¦¯à¦¼à§‡ à¦ªà§�à¦°à¦¤à¦¿à¦¸à§�à¦¥à¦¾à¦ªà¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ Setup Date, Year, Month, CM Expense, No of Resource, Working Hour, Working Day, CPM (à¦¸à§�à¦¬à¦¯à¦¼à¦‚à¦•à§�à¦°à¦¿à¦¯à¦¼à¦­à¦¾à¦¬à§‡ à¦—à¦£à¦¨à¦¾ à¦•à¦°à¦¾), Applied CPM, Currency à¦�à¦¬à¦‚ Status à¦¦à§‡à¦–à¦¾à¦¨à§‹ à¦¹à¦šà§�à¦›à§‡à¥¤ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦­à§�à¦¯à¦¾à¦²à¦¿à¦¡à§‡à¦¶à¦¨à¦¸à¦¹ Create à¦�à¦¬à¦‚ Update à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "87",
    "date": "2026-07-30T15:49",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings?tab=payment-terms",
    "descriptionEn": "Built a dedicated Payment Terms tab with a clean data table (Actions, SL, Name, IsActive) pre-loaded with 10 standard terms (120/180/30/60/90 Days BBLC, At Sight, Cash, FOD, Others, TT). Added Create and Update modals with Short Name and IsActive fields.",
    "descriptionBn": "Payment Terms à¦Ÿà§�à¦¯à¦¾à¦¬à§‡à¦° à¦œà¦¨à§�à¦¯ à¦�à¦•à¦Ÿà¦¿ à¦ªà§‚à¦°à§�à¦£à¦¾à¦™à§�à¦— à¦¡à§‡à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² (Actions, SL, Name, IsActive) à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à§§à§¦à¦Ÿà¦¿ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦¡à¦¾à¦°à§�à¦¡ à¦Ÿà¦¾à¦°à§�à¦® (120/180/30/60/90 Days BBLC, At Sight, Cash, FOD, Others, TT) à¦†à¦—à§‡ à¦¥à§‡à¦•à§‡à¦‡ à¦²à§‹à¦¡ à¦•à¦°à¦¾ à¦†à¦›à§‡à¥¤ Short Name à¦�à¦¬à¦‚ IsActive à¦«à¦¿à¦²à§�à¦¡à¦¸à¦¹ Create à¦“ Update à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "86",
    "date": "2026-07-30T16:11",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings?tab=buying-house",
    "descriptionEn": "Created a dedicated Buying House tab with a detailed data table (Actions, SL, Short Name, Full Name, Contact Person, Address, Phone, Email, Fax, IsActive) pre-populated with standard houses (ITPS, JMS Buyer, KLD, PFD). Added fully validated Create/Update modals.",
    "descriptionBn": "Buying House à¦Ÿà§�à¦¯à¦¾à¦¬à§‡à¦° à¦œà¦¨à§�à¦¯ à¦�à¦•à¦Ÿà¦¿ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦¡à§‡à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² à¦�à¦¬à¦‚ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦­à§�à¦¯à¦¾à¦²à¦¿à¦¡à§‡à¦¶à¦¨à¦¸à¦¹ Create/Update à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦ªà§‚à¦°à§�à¦¬à§‡ à¦¥à§‡à¦•à§‡à¦‡ ITPS, JMS Buyer, KLD, PFD à¦‡à¦¤à§�à¦¯à¦¾à¦¦à¦¿ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦¡à¦¾à¦°à§�à¦¡ à¦¹à¦¾à¦‰à¦¸à§‡à¦° à¦¡à§‡à¦Ÿà¦¾ à¦²à§‹à¦¡ à¦•à¦°à¦¾ à¦†à¦›à§‡à¥¤"
  },
  {
    "id": "85",
    "date": "2026-07-30T16:15",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings?tab=buyer-wise-brand",
    "descriptionEn": "Implemented a dedicated Buyer Brand tab with a custom table (Actions, SL, Buyer Name, Brand, IsActive). Integrated dynamic Buyer selection dropdown populated from registered buyers list and added Create/Update modals.",
    "descriptionBn": "Buyer Brand à¦Ÿà§�à¦¯à¦¾à¦¬à§‡à¦° à¦œà¦¨à§�à¦¯ à¦�à¦•à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ à¦­à¦¿à¦‰ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦ªà§�à¦°à¦¤à¦¿ à¦•à§�à¦°à§‡à¦¤à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦¬à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦…à§�à¦¯à¦¾à¦¸à¦¾à¦‡à¦¨ à¦•à¦°à¦¾à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦°à§Ÿà§‡à¦›à§‡à¥¤ à¦•à§�à¦°à§‡à¦¤à¦¾ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦¡à¦¾à¦¯à¦¼à¦¨à¦¾à¦®à¦¿à¦• à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦�à¦¬à¦‚ à¦•à§�à¦°à¦¿à§Ÿà§‡à¦Ÿ à¦“ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "84",
    "date": "2026-07-30T16:20",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings?tab=buying-agent",
    "descriptionEn": "Added a dedicated Buying Agent tab with a detailed data table (Actions, SL, Short Name, Full Name, Address, Phone, Email, Fax, IsActive) preloaded with initial agent (JMS Buyer Agent) and added fully validated Create/Update modals.",
    "descriptionBn": "Buying Agent à¦Ÿà§�à¦¯à¦¾à¦¬à§‡à¦° à¦œà¦¨à§�à¦¯ à¦�à¦•à¦Ÿà¦¿ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦¡à§‡à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² à¦�à¦¬à¦‚ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦­à§�à¦¯à¦¾à¦²à¦¿à¦¡à§‡à¦¶à¦¨à¦¸à¦¹ Create/Update à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦ªà§‚à¦°à§�à¦¬à§‡ à¦¥à§‡à¦•à§‡à¦‡ JMS Buyer Agent à¦�à¦° à¦¡à§‡à¦Ÿà¦¾ à¦²à§‹à¦¡ à¦•à¦°à¦¾ à¦†à¦›à§‡à¥¤"
  },
  {
    "id": "83",
    "date": "2026-07-30T16:24",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings?tab=supplier",
    "descriptionEn": "Created a dedicated Supplier tab with a clean table (Actions, SL, Company Name, Name, Designation, Address, E-mail, Cell, IsActive) preloaded with 10 standard supplier entries, along with custom validated Create/Update modals.",
    "descriptionBn": "Supplier à¦Ÿà§�à¦¯à¦¾à¦¬à§‡à¦° à¦œà¦¨à§�à¦¯ à¦�à¦•à¦Ÿà¦¿ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦¡à§‡à¦Ÿà¦¾ à¦Ÿà§‡à¦¬à¦¿à¦² à¦�à¦¬à¦‚ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦­à§�à¦¯à¦¾à¦²à¦¿à¦¡à§‡à¦¶à¦¨à¦¸à¦¹ Create/Update à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦ªà§‚à¦°à§�à¦¬à§‡ à¦¥à§‡à¦•à§‡à¦‡ à§§à§¦à¦Ÿà¦¿ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦¡à¦¾à¦°à§�à¦¡ à¦¸à¦¾à¦ªà§�à¦²à¦¾à¦¯à¦¼à¦¾à¦°à§‡à¦° à¦¡à§‡à¦Ÿà¦¾ à¦²à§‹à¦¡ à¦•à¦°à¦¾ à¦†à¦›à§‡à¥¤"
  },
  {
    "id": "82",
    "date": "2026-07-30T16:29",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings?tab=buyer-name",
    "descriptionEn": "Replaced the simple buyer modal with a comprehensive, beautiful 14-accordion 'Buyer Profile' editor. Updated the buyer table to match screenshots with Excel/Print/Pdf options, country filters, and 15 default entries.",
    "descriptionBn": "à¦¸à¦¾à¦§à¦¾à¦°à¦£ à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦®à§‹à¦¡à¦¾à¦² à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ à¦�à¦•à¦Ÿà¦¿ à§§à§ª-à¦…à§�à¦¯à¦¾à¦•à¦°à§�à¦¡à¦¿à¦¯à¦¼à¦¨ à¦¬à¦¿à¦¶à¦¿à¦·à§�à¦Ÿ à¦šà¦®à§Žà¦•à¦¾à¦° 'Buyer Profile' à¦�à¦¡à¦¿à¦Ÿà¦° à¦­à¦¿à¦‰ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦Ÿà§‡à¦¬à¦¿à¦²à¦Ÿà¦¿à¦¤à§‡ à¦�à¦•à§�à¦¸à§‡à¦²/à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ/à¦ªà¦¿à¦¡à¦¿à¦�à¦« à¦¬à¦¾à¦Ÿà¦¨, à¦•à¦¾à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦�à¦¬à¦‚ à§§à§«à¦Ÿà¦¿ à¦¡à¦¿à¦«à¦²à§�à¦Ÿ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "81",
    "date": "2026-07-30T17:07",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Extracted renderDynamicMasterDB logic into a standalone React component (DynamicMasterDBManager) to avoid conditional React hooks rendering and fix the Rules of Hooks violation.",
    "descriptionBn": "Rules of Hooks à¦²à¦™à§�à¦˜à¦¨ à¦�à§œà¦¾à¦¤à§‡ à¦�à¦¬à¦‚ à¦•à¦¨à§�à¦¡à¦¿à¦¶à¦¨à¦¾à¦² à¦¹à§�à¦• à¦°à§‡à¦¨à§�à¦¡à¦¾à¦°à¦¿à¦‚ à¦¸à¦®à¦¸à§�à¦¯à¦¾à¦° à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦•à¦°à¦¤à§‡ renderDynamicMasterDB à¦«à¦¾à¦‚à¦¶à¦¨à¦Ÿà¦¿à¦•à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦¡à¦…à§�à¦¯à¦¾à¦²à§‹à¦¨ à¦°à¦¿à¦…à§�à¦¯à¦¾à¦•à§�à¦Ÿ à¦•à¦®à§�à¦ªà§‹à¦¨à§‡à¦¨à§�à¦Ÿà§‡ (DynamicMasterDBManager) à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "80",
    "date": "2026-07-30T17:55",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Fixed layout overlap bug by making the main switch fallback conditional. Now, custom tabs (buyer-name, fabric-construction, additional-cost-entry, rmg-process-loss) correctly hide the generic fallback table, preventing duplicate elements from showing.",
    "descriptionBn": "à¦²à§‡à¦†à¦‰à¦Ÿ à¦“à¦­à¦¾à¦°à¦²à§�à¦¯à¦¾à¦ª à¦¬à¦¾à¦—à¦Ÿà¦¿ à¦¦à§‚à¦° à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦•à¦¨à§�à¦¡à¦¿à¦¶à¦¨à¦¾à¦² à¦°à§‡à¦¨à§�à¦¡à¦¾à¦°à¦¿à¦‚ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦° à¦«à¦²à§‡ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦Ÿà§�à¦¯à¦¾à¦¬à¦¸à¦®à§‚à¦¹à§‡ (buyer-name, fabric-construction, additional-cost-entry, rmg-process-loss) à¦¸à¦¾à¦§à¦¾à¦°à¦£ à¦Ÿà§‡à¦¬à¦¿à¦²à¦Ÿà¦¿ à¦†à¦° à¦ªà§�à¦¨à¦°à¦¾à¦¬à§ƒà¦¤à§�à¦¤à¦¿ à¦¹à¦¬à§‡ à¦¨à¦¾à¥¤"
  },
  {
    "id": "79",
    "date": "2026-07-30T18:05",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented beautiful, fully-functional custom layouts and modals for 'Item Department', 'Garment Item Name (GMT Item Name)', and 'Body Part' tabs based on layout screenshots. Added Excel/Print/Pdf options, search filters, default entries, and select dropdowns.",
    "descriptionBn": "'Item Department', 'Garment Item Name (GMT Item Name)' à¦�à¦¬à¦‚ 'Body Part' à¦Ÿà§�à¦¯à¦¾à¦¬à¦—à§�à¦²à§‹à¦° à¦œà¦¨à§�à¦¯ à¦²à§‡à¦†à¦‰à¦Ÿ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦†à¦•à¦°à§�à¦·à¦£à§€à§Ÿ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦²à§‡à¦†à¦‰à¦Ÿ à¦�à¦¬à¦‚ à¦®à§‹à¦¡à¦¾à¦² à¦­à¦¿à¦‰ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦�à¦•à§�à¦¸à§‡à¦²/à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ/à¦ªà¦¿à¦¡à¦¿à¦�à¦« à¦°à¦«à¦¤à¦¾à¦¨à¦¿, à¦¸à¦¾à¦°à§�à¦š à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, à¦¡à¦¿à¦«à¦²à§�à¦Ÿ à¦¤à¦¥à§�à¦¯à¦¸à¦®à§‚à¦¹ à¦�à¦¬à¦‚ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦…à¦¨à§�à¦¤à¦°à§�à¦­à§�à¦•à§�à¦¤ à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "78",
    "date": "2026-07-30T18:11",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Added beautiful, fully-functional custom styled registry tables, filters, and add/edit modals for both 'Season' and 'Sample Type' tabs, resolving a React state namespace collision with the pre-existing accordion seasons state.",
    "descriptionBn": "'Season' à¦�à¦¬à¦‚ 'Sample Type' à¦Ÿà§�à¦¯à¦¾à¦¬à¦¦à§�à¦¬à§Ÿà§‡à¦° à¦œà¦¨à§�à¦¯ à¦†à¦•à¦°à§�à¦·à¦£à§€à§Ÿ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦Ÿà§‡à¦¬à¦¿à¦², à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦�à¦¬à¦‚ à¦…à§�à¦¯à¦¾à¦¡/à¦�à¦¡à¦¿à¦Ÿ à¦®à§‹à¦¡à¦¾à¦² à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦•à¦‡ à¦¸à¦¾à¦¥à§‡ à¦¬à¦¾à§Ÿà¦¾à¦° à¦ªà§�à¦°à§‹à¦«à¦¾à¦‡à¦² à¦�à¦•à§‹à¦°à§�à¦¡à¦¿à§Ÿà¦¨à§‡à¦° à¦¨à¦¿à¦œà¦¸à§�à¦¬ 'seasons' à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦¨à§‡à¦®à¦¸à§�à¦ªà§‡à¦¸ à¦¸à¦‚à¦˜à¦°à§�à¦·à§‡à¦° à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "77",
    "date": "2026-07-30T18:18",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented custom styled registry tables, pagination indicators, action sheets, search functions, and input/select modals for both 'Size Group' (Group size) and 'UoM' (Unit of Measurement) settings tabs matching design specifications.",
    "descriptionBn": "'Size Group' (à¦—à§�à¦°à§�à¦ª à¦¸à¦¾à¦‡à¦œ) à¦�à¦¬à¦‚ 'UoM' (à¦ªà¦°à¦¿à¦®à¦¾à¦ªà¦• à¦�à¦•à¦•) à¦Ÿà§�à¦¯à¦¾à¦¬à¦¦à§�à¦¬à§Ÿà§‡à¦° à¦œà¦¨à§�à¦¯ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦¸à§�à¦ªà§‡à¦¸à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦Ÿà§‡à¦¬à¦¿à¦², à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¶à¦¿à¦Ÿ, à¦¸à¦¾à¦°à§�à¦š à¦�à¦¬à¦‚ à¦…à§�à¦¯à¦¾à¦¡/à¦�à¦¡à¦¿à¦Ÿ à¦®à§‹à¦¡à¦¾à¦² à¦­à¦¿à¦‰ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "76",
    "date": "2026-07-30T18:32",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented custom registry layouts, actions, live searches, export mock actions, and dialog modals for 'Fabric GSM', 'Fabric Nature' (Fabric Type), and 'Fabric Construction' tabs matching screen layouts.",
    "descriptionBn": "'Fabric GSM', 'Fabric Nature' (Fabric Type) à¦�à¦¬à¦‚ 'Fabric Construction' à¦Ÿà§�à¦¯à¦¾à¦¬à¦—à§�à¦²à§‹à¦° à¦œà¦¨à§�à¦¯ à¦²à§‡à¦†à¦‰à¦Ÿ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦Ÿà§‡à¦¬à¦¿à¦², à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨, à¦¸à¦¾à¦°à§�à¦š à¦�à¦¬à¦‚ à¦…à§�à¦¯à¦¾à¦¡/à¦�à¦¡à¦¿à¦Ÿ à¦®à§‹à¦¡à¦¾à¦² à¦­à¦¿à¦‰ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "75",
    "date": "2026-08-01T10:47",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Added a searchable 'Supplier Category' multi-select dropdown as the first field in the Add/Update Supplier modal (options: Yarn, Fabric, Trims, etc.), displayed selected categories as pill badges in the Supplier table, and made Designation, E-mail, and Cell fields optional (removed validation constraints).",
    "descriptionBn": "à¦¸à¦¾à¦ªà§�à¦²à¦¾à§Ÿà¦¾à¦° à¦…à§�à¦¯à¦¾à¦¡/à¦†à¦ªà¦¡à§‡à¦Ÿ à¦®à§‹à¦¡à¦¾à¦²à§‡ à¦ªà§�à¦°à¦¥à¦® à¦«à¦¿à¦²à§�à¦¡ à¦¹à¦¿à¦¸à§‡à¦¬à§‡ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦¸à¦¾à¦°à§�à¦šà§‡à¦¬à¦² à¦®à¦¾à¦²à§�à¦Ÿà¦¿-à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ 'Supplier Category' à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¸à¦¾à¦ªà§�à¦²à¦¾à§Ÿà¦¾à¦° à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¾ à¦•à§�à¦¯à¦¾à¦Ÿà¦¾à¦—à¦°à¦¿à¦—à§�à¦²à§‹ à¦ªà¦¿à¦² à¦¬à§�à¦¯à¦¾à¦œ à¦¹à¦¿à¦¸à§‡à¦¬à§‡ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¡à§‡à¦œà¦¿à¦—à¦¨à§‡à¦¶à¦¨, à¦‡à¦®à§‡à¦‡à¦² à¦“ à¦¸à§‡à¦² à¦«à¦¿à¦²à§�à¦¡à¦—à§�à¦²à§‹à¦•à§‡ à¦�à¦šà§�à¦›à¦¿à¦• (optional) à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ (à¦¬à¦¾à¦§à§�à¦¯à¦¤à¦¾à¦®à§‚à¦²à¦• à¦­à§�à¦¯à¦¾à¦²à¦¿à¦¡à§‡à¦¶à¦¨ à¦¤à§�à¦²à§‡ à¦¨à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡)à¥¤"
  },
  {
    "id": "74",
    "date": "2026-08-01T10:51",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Upgraded the UOM (Measurement Head) modal and registry table matching specifications, including advanced properties: Unit Name, Short Name, Unit Group, Sort Order, Relative Factor, and a checkbox for Is Base Unit status.",
    "descriptionBn": "UOM (à¦ªà¦°à¦¿à¦®à¦¾à¦ªà¦• à¦�à¦•à¦•) à¦®à§‹à¦¡à¦¾à¦² à¦�à¦¬à¦‚ à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦Ÿà§‡à¦¬à¦¿à¦² à¦‰à¦¨à§�à¦¨à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦¨à¦¤à§�à¦¨ à¦¬à§ˆà¦¶à¦¿à¦·à§�à¦Ÿà§�à¦¯à¦¸à¦®à§‚à¦¹ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: Unit Name, Short Name, Unit Group, Sort Order, Relative Factor à¦�à¦¬à¦‚ Is Base Unit à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸à§‡à¦° à¦œà¦¨à§�à¦¯ à¦šà§‡à¦•à¦¬à¦•à§�à¦¸à¥¤"
  },
  {
    "id": "73",
    "date": "2026-08-01T10:54",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Added generic Manage Rates ($) buttons and details modals for Dyeing and Finishing tabs under RMG Master Settings, supporting dynamic date validation and export actions matching design layouts.",
    "descriptionBn": "RMG Master Settings-à¦�à¦° à¦…à¦§à§€à¦¨à§‡ Dyeing à¦�à¦¬à¦‚ Finishing à¦Ÿà§�à¦¯à¦¾à¦¬à¦—à§�à¦²à§‹à¦° à¦œà¦¨à§�à¦¯ à¦œà§‡à¦¨à§‡à¦°à¦¿à¦• Manage Rates ($) à¦¬à¦¾à¦Ÿà¦¨ à¦�à¦¬à¦‚ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸ à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾ à¦²à§‡à¦†à¦‰à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦• à¦¡à§‡à¦Ÿ à¦­à§�à¦¯à¦¾à¦²à¦¿à¦¡à§‡à¦¶à¦¨ à¦�à¦¬à¦‚ à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¸à¦®à¦°à§�à¦¥à¦¨ à¦•à¦°à§‡à¥¤"
  },
  {
    "id": "72",
    "date": "2026-08-01T14:35",
    "type": "New Addition",
    "module": "Global System",
    "link": "/module-selection",
    "descriptionEn": "Added a compact, Google-style corporate modules launcher (3x3 grid / waffle button) to both the global dashboard Topbar and the Merchandising layout header, enabling instant, dynamic switching between HRIS, Merchandising, and all other modules from anywhere in the application.",
    "descriptionBn": "à¦—à§�à¦²à§‹à¦¬à¦¾à¦² à¦¡à§�à¦¯à¦¾à¦¶à¦¬à§‹à¦°à§�à¦¡ à¦Ÿà¦ªà¦¬à¦¾à¦° à¦�à¦¬à¦‚ à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦²à§‡à¦†à¦‰à¦Ÿ à¦¹à§‡à¦¡à¦¾à¦° à¦‰à¦­à¦¯à¦¼ à¦¸à§�à¦¥à¦¾à¦¨à§‡à¦‡ à¦�à¦•à¦Ÿà¦¿ à¦•à¦®à§�à¦ªà§�à¦¯à¦¾à¦•à§�à¦Ÿ, à¦—à§�à¦—à¦²-à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦•à¦°à§�à¦ªà§‹à¦°à§‡à¦Ÿ à¦®à¦¡à¦¿à¦‰à¦² à¦²à¦žà§�à¦šà¦¾à¦° (à§©xà§© à¦—à§�à¦°à¦¿à¦¡ / à¦“à¦¯à¦¼à¦¾à¦«à§‡à¦² à¦¬à¦¾à¦Ÿà¦¨) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à¦¾ à¦…à§�à¦¯à¦¾à¦ªà§�à¦²à¦¿à¦•à§‡à¦¶à¦¨à§‡à¦° à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦¸à§�à¦¥à¦¾à¦¨ à¦¥à§‡à¦•à§‡ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ HRIS, à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦�à¦¬à¦‚ à¦…à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¯ à¦¸à¦®à¦¸à§�à¦¤ à¦®à¦¡à¦¿à¦‰à¦²à§‡ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦•à¦¾à¦²à¦¿ à¦¸à§�à¦‡à¦š à¦•à¦°à¦¤à§‡ à¦¸à¦¾à¦¹à¦¾à¦¯à§�à¦¯ à¦•à¦°à¦¬à§‡à¥¤"
  },
  {
    "id": "71",
    "date": "2026-08-01T15:00",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented Yarn Brand, Yarn Type, Yarn Count, and Yarn PO Type custom settings pages with specifications matching the screenshots, custom add/edit modals, export actions, live search, and an olive green floating plus action button.",
    "descriptionBn": "à¦‡à¦‰à¦œà¦¾à¦° à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ Yarn Brand, Yarn Type, Yarn Count à¦�à¦¬à¦‚ Yarn PO Type-à¦�à¦° à¦œà¦¨à§�à¦¯ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸ à¦ªà§‡à¦œà¦¸à¦®à§‚à¦¹ à¦‡à¦®à¦ªà§�à¦²à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦…à§�à¦¯à¦¾à¦¡/à¦�à¦¡à¦¿à¦Ÿ à¦®à§‹à¦¡à¦¾à¦², à¦²à¦¾à¦‡à¦­ à¦¸à¦¾à¦°à§�à¦š, à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦�à¦¬à¦‚ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦¨à§�à¦¦à¦° à¦œà¦²à¦ªà¦¾à¦‡ à¦¸à¦¬à§�à¦œ à¦°à¦™à§‡à¦° à¦«à§�à¦²à§‹à¦Ÿà¦¿à¦‚ à¦ªà§�à¦²à¦¾à¦¸ à¦¬à¦¾à¦Ÿà¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "70",
    "date": "2026-08-01T15:10",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented Yarn PO Settings custom configuration page, with custom dropdown fields for Company Name and Action parameter (Ceiling/Floor/Round/None), Nearest Value and CompareValue Value input controls, custom add/edit modals, and Excel/Print/PDF export functionalities.",
    "descriptionBn": "Yarn PO Settings-à¦�à¦° à¦œà¦¨à§�à¦¯ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦ªà§‡à¦œ à¦‡à¦®à¦ªà§�à¦²à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ Company Name à¦�à¦¬à¦‚ Action à¦ªà§�à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦° (Ceiling/Floor/Round/None)-à¦�à¦° à¦œà¦¨à§�à¦¯ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦«à¦¿à¦²à§�à¦¡, Nearest Value à¦�à¦¬à¦‚ CompareValue Value-à¦�à¦° à¦œà¦¨à§�à¦¯ à¦‡à¦¨à¦ªà§�à¦Ÿ à¦•à¦¨à§�à¦Ÿà§�à¦°à§‹à¦², à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦®à§‹à¦¡à¦¾à¦² à¦�à¦¬à¦‚ à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "69",
    "date": "2026-08-01T15:15",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Removed the top 'RMG Master Database & Parameters' header banner block from the Merchandising Master Settings workspace to streamline the interface.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦®à¦¾à¦¸à§�à¦Ÿà¦¾à¦° à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸ à¦“à§Ÿà¦¾à¦°à§�à¦•à¦¸à§�à¦ªà§‡à¦¸à§‡à¦° à¦¶à§€à¦°à§�à¦·à¦¦à§‡à¦¶ à¦¥à§‡à¦•à§‡ 'RMG Master Database & Parameters' à¦¹à§‡à¦¡à¦¾à¦° à¦¬à§�à¦¯à¦¾à¦¨à¦¾à¦°à¦Ÿà¦¿ à¦…à¦ªà¦¸à¦¾à¦°à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦¤à§‡ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à¦«à§‡à¦¸à¦Ÿà¦¿ à¦†à¦°à¦“ à¦ªà¦°à¦¿à¦šà§�à¦›à¦¨à§�à¦¨ à¦“ à¦¸à§�à¦¨à§�à¦¦à¦° à¦¦à§‡à¦–à¦¾à§Ÿà¥¤"
  },
  {
    "id": "68",
    "date": "2026-08-01T15:20",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented Garment & Fabric Color and Print/Color Type custom settings pages with datasets matching reference screenshots, custom add/edit dialog modals, and integrated their modals with the floating action plus button.",
    "descriptionBn": "Garment & Fabric Color à¦�à¦¬à¦‚ Print/Color Type-à¦�à¦° à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸ à¦ªà§‡à¦œà¦¸à¦®à§‚à¦¹ à¦‡à¦®à¦ªà§�à¦²à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦…à§�à¦¯à¦¾à¦¡/à¦�à¦¡à¦¿à¦Ÿ à¦®à§‹à¦¡à¦¾à¦², à¦«à§�à¦²à§‹à¦Ÿà¦¿à¦‚ à¦ªà§�à¦²à¦¾à¦¸ à¦¬à¦¾à¦Ÿà¦¨ à¦“ à¦�à¦•à§�à¦¸à¦ªà§‹à¦°à§�à¦Ÿ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "67",
    "date": "2026-08-01T15:25",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented Print/Embroidery/Wash Type (Special Cost) configuration page, featuring main parameters, sub-modals, a floating plus action button, and a nested 'Rat Chart Information' interactive modal.",
    "descriptionBn": "Print/Embroidery/Wash Type-à¦�à¦° à¦œà¦¨à§�à¦¯ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦ªà§‡à¦œ à¦�à¦¬à¦‚ à¦°à§‡à¦Ÿ à¦šà¦¾à¦°à§�à¦Ÿ à¦¸à¦¾à¦¬-à¦¸à¦¿à¦¸à§�à¦Ÿà§‡à¦® à¦‡à¦®à¦ªà§�à¦²à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦…à§�à¦¯à¦¾à¦¡/à¦�à¦¡à¦¿à¦Ÿ à¦®à§‹à¦¡à¦¾à¦² à¦�à¦¬à¦‚ à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à§‡à¦•à§�à¦Ÿà¦¿à¦­ à¦°à§‡à¦Ÿ à¦šà¦¾à¦°à§�à¦Ÿ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "66",
    "date": "2026-08-01T15:30",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented AOP Process configuration page featuring initial dataset matching reference screenshots ('Discharge Print', 'Pigment Print'), custom Add New/Update AopProcess modal dialogs, and integrated floating action plus button.",
    "descriptionBn": "AOP Process-à¦�à¦° à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸ à¦ªà§‡à¦œ à¦‡à¦®à¦ªà§�à¦²à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿà§‡à¦° à¦…à¦¨à§�à¦•à¦°à¦£à§‡ à¦¡à§�à¦¯à¦¾à¦Ÿà¦¾ à¦¸à§‡à¦Ÿ, 'Add New AopProcess' à¦®à§‹à¦¡à¦¾à¦² à¦�à¦¬à¦‚ à¦«à§�à¦²à§‹à¦Ÿà¦¿à¦‚ à¦ªà§�à¦²à¦¾à¦¸ à¦¬à¦¾à¦Ÿà¦¨ à¦‡à¦¨à§�à¦Ÿà¦¿à¦—à§�à¦°à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "65",
    "date": "2026-08-02T16:25",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Completely redesigned the Quotation detail view into a side-by-side high-fidelity Buyer Costing Sheet: built a 2-column header with buyer details/dress sketch mockups, side-by-side grids containing the garment cost breakdown (with dynamic yarn, accessories, embellishments, wash, other costs lists) and fabric price calculation, profit gap metrics banner, and signature approvals section.",
    "descriptionBn": "à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦² à¦­à¦¿à¦‰à¦•à§‡ à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦¶à¦¿à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à§¨-à¦•à¦²à¦¾à¦®à§‡ à¦¬à¦¿à¦­à¦•à§�à¦¤ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦² à¦¡à¦¿à¦œà¦¾à¦‡à¦¨à§‡ à¦‰à¦¨à§�à¦¨à§€à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à¦¯à¦¾à¦° à¦¬à¦¾à¦® à¦ªà¦¾à¦¶à§‡ à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦¬à§‡à¦¸à¦¿à¦• à¦¤à¦¥à§�à¦¯, à¦«à§‡à¦¬à§�à¦°à¦¿à¦• à¦“ à¦�à¦®à§�à¦¬à§‡à¦¡ à¦•à¦°à¦¾ à¦¸à§�à¦•à§‡à¦š à¦‡à¦®à§‡à¦œ à¦�à¦¬à¦‚ à¦¨à¦¿à¦šà§‡à¦° à¦—à§�à¦°à¦¿à¦¡à¦—à§�à¦²à§‹à¦¤à§‡ à¦ªà§‹à¦¶à¦¾à¦•à§‡à¦° à¦–à¦°à¦š (à¦‡à¦¯à¦¼à¦¾à¦°à§�à¦¨, à¦�à¦•à§�à¦¸à§‡à¦¸à¦°à¦¿à¦œ, à¦�à¦®à§�à¦¬à§‡à¦²à¦¿à¦¶à¦®à§‡à¦¨à§�à¦Ÿ, à¦“à§Ÿà¦¾à¦¶ à¦“ à¦…à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¯ à¦–à¦°à¦š à¦¤à¦¾à¦²à¦¿à¦•à¦¾) à¦�à¦¬à¦‚ à¦¡à¦¾à¦¨ à¦ªà¦¾à¦¶à§‡ à¦•à¦¾à¦ªà¦¡à¦¼à§‡à¦° à¦¦à¦¾à¦® à¦¹à¦¿à¦¸à¦¾à¦¬à§‡à¦° à¦Ÿà§‡à¦¬à¦¿à¦², à¦ªà§�à¦°à¦«à¦¿à¦Ÿ à¦—à§�à¦¯à¦¾à¦ª à¦¬à§�à¦¯à¦¾à¦¨à¦¾à¦° à¦“ à¦¨à¦¿à¦šà§‡ à¦¸à§�à¦¬à¦¾à¦•à§�à¦·à¦°à¦•à¦¾à¦°à§€à¦¦à§‡à¦° à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦¸à§�à¦¨à§�à¦¦à¦°à¦­à¦¾à¦¬à§‡ à¦«à§�à¦Ÿà¦¿à§Ÿà§‡ à¦¤à§‹à¦²à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "64",
    "date": "2026-08-02T16:30",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Configured the style image slot in the Quotation detail/print view to default load the premium dress sketch illustration image and enabled dynamic file upload replacements.",
    "descriptionBn": "à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²/à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰à¦¯à¦¼à§‡à¦° à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦‡à¦®à§‡à¦œ à¦¬à¦•à§�à¦¸à§‡ à¦¡à¦¿à¦«à¦²à§�à¦Ÿà¦­à¦¾à¦¬à§‡ à¦ªà§�à¦°à¦¿à¦®à¦¿à§Ÿà¦¾à¦® à¦¡à§�à¦°à§‡à¦¸ à¦¸à§�à¦•à§‡à¦š à¦‡à¦²à¦¾à¦¸à§�à¦Ÿà§�à¦°à§‡à¦¶à¦¨ à¦‡à¦®à§‡à¦œà¦Ÿà¦¿ à¦²à§‹à¦¡ à¦•à¦°à¦¾à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦°à¦¾à¦–à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦«à¦¾à¦‡à¦² à¦†à¦ªà¦²à§‹à¦¡ à¦•à¦°à§‡ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨à§‡à¦° à¦…à¦ªà¦¶à¦¨à¦Ÿà¦¿ à¦šà¦¾à¦²à§� à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "63",
    "date": "2026-08-01T15:35",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented Additional Cost Entry custom configuration page featuring pre-populated financial/commission/commercial datasets, custom edit modal dialog, and floating action button.",
    "descriptionBn": "Additional Cost Entry à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸ à¦ªà§‡à¦œ à¦‡à¦®à¦ªà§�à¦²à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦«à¦¿à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¸à¦¿à¦¯à¦¼à¦¾à¦², à¦•à¦®à¦¿à¦¶à¦¨ à¦“ à¦•à¦®à¦¾à¦°à§�à¦¶à¦¿à¦¯à¦¼à¦¾à¦² à¦¡à§�à¦¯à¦¾à¦Ÿà¦¾ à¦¸à§‡à¦Ÿ, à¦�à¦¡à¦¿à¦Ÿ à¦®à§‹à¦¡à¦¾à¦² à¦�à¦¬à¦‚ à¦«à§�à¦²à§‹à¦Ÿà¦¿à¦‚ à¦ªà§�à¦²à¦¾à¦¸ à¦¬à¦¾à¦Ÿà¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "62",
    "date": "2026-08-01T15:38",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented RMG Process Loss custom configuration page with comprehensive parameters (Garment types dropdown, Order qty ranges, Cutting/Print/EMB/Sewing/Wash/Finishing percentages), custom Add New/Update modal dialog, and light blue table styling matching reference screenshots.",
    "descriptionBn": "RMG Process Loss à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦ªà§‡à¦œ à¦‡à¦®à¦ªà§�à¦²à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦¸à¦•à¦² à¦ªà§�à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦° à¦¸à¦®à§�à¦¬à¦²à¦¿à¦¤ à¦…à§�à¦¯à¦¾à¦¡/à¦�à¦¡à¦¿à¦Ÿ à¦®à§‹à¦¡à¦¾à¦² à¦�à¦¬à¦‚ à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦²à¦¾à¦‡à¦Ÿ à¦¬à§�à¦²à§� à¦Ÿà§‡à¦¬à¦¿à¦² à¦¡à¦¿à¦¸à¦ªà§�à¦²à§‡ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "61",
    "date": "2026-08-01T15:42",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Implemented Quality Label custom configuration page with pre-populated 'AQL Standard' entry, custom create/edit modal labeled 'Create New Country' matching reference design, and floating action button integration.",
    "descriptionBn": "Quality Label à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦ªà§‡à¦œ à¦‡à¦®à¦ªà§�à¦²à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦�à¦¡à¦¿à¦Ÿ/à¦•à§�à¦°à¦¿à§Ÿà§‡à¦Ÿ à¦®à§‹à¦¡à¦¾à¦² à¦“ à¦«à§�à¦²à§‹à¦Ÿà¦¿à¦‚ à¦ªà§�à¦²à¦¾à¦¸ à¦¬à¦¾à¦Ÿà¦¨ à¦‡à¦¨à§�à¦Ÿà¦¿à¦—à§�à¦°à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "60",
    "date": "2026-08-01T15:46",
    "type": "Modify",
    "module": "Monthly Capacity Planning",
    "link": "/merchandising-monthly-capacity",
    "descriptionEn": "Updated the Setup New Monthly Capacity modal dialog layout to match reference screenshot design exactly, including a left blue accent border card, horizontal grid alignment across three rows, real-time formula calculations for operators and minutes, and underline styled input fields.",
    "descriptionBn": "Setup New Monthly Capacity à¦«à¦°à§�à¦®à§‡à¦° à¦²à§‡à¦†à¦‰à¦Ÿ à¦“ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦•à¦¾à¦¸à§�à¦Ÿà¦®à¦¾à¦‡à¦œ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦°à¦¿à¦¯à¦¼à§‡à¦²-à¦Ÿà¦¾à¦‡à¦® à¦«à¦°à§�à¦®à§�à¦²à¦¾ à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦¶à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "59",
    "date": "2026-08-01T15:52",
    "type": "Modify",
    "module": "Company Setup",
    "link": "/company-setup",
    "descriptionEn": "Added a new 'Default Holiday Setup' tab inside Company Setup, including initial Friday/Saturday weekend history data, list ledger with calendar badges, search filtering, and CRUD operations modal featuring datepicker and MultiSelect days.",
    "descriptionBn": "Company Setup à¦� à¦�à¦•à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ 'Default Holiday Setup' à¦Ÿà§�à¦¯à¦¾à¦¬ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦‡à¦¤à¦¿à¦¹à¦¾à¦¸ à¦¤à¦¾à¦²à¦¿à¦•à¦¾, à¦•à§�à¦¯à¦¾à¦²à§‡à¦¨à§�à¦¡à¦¾à¦° à¦¬à§�à¦¯à¦¾à¦œà¦¸à¦¹ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à¦¿à¦‚ à¦¸à¦¾à¦°à§�à¦š à¦�à¦¬à¦‚ à¦…à§�à¦¯à¦¾à¦¡/à¦�à¦¡à¦¿à¦Ÿ à¦®à§‹à¦¡à¦¾à¦² à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "58",
    "date": "2026-08-01T15:56",
    "type": "Modify",
    "module": "Company Setup",
    "link": "/company-setup",
    "descriptionEn": "Removed edit and delete actions from the Default Holiday Setup list to treat it strictly as a historical track of weekend configurations, and added status indicators (Active, Upcoming, Archived) for all setup records.",
    "descriptionBn": "à¦¡à¦¿à¦«à¦²à§�à¦Ÿ à¦¹à¦²à¦¿à¦¡à§‡ à¦¸à§‡à¦Ÿà¦†à¦ª à¦²à¦¿à¦¸à§�à¦Ÿ à¦¥à§‡à¦•à§‡ à¦�à¦¡à¦¿à¦Ÿ à¦“ à¦¡à¦¿à¦²à¦¿à¦Ÿ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦¦ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦�à¦Ÿà¦¿ à¦¸à¦¾à¦ªà§�à¦¤à¦¾à¦¹à¦¿à¦• à¦›à§�à¦Ÿà¦¿à¦° à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨à§‡à¦° à¦‡à¦¤à¦¿à¦¹à¦¾à¦¸ (à¦¹à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦Ÿà§�à¦°à§�à¦¯à¦¾à¦•) à¦¹à¦¿à¦¸à§‡à¦¬à§‡ à¦•à¦¾à¦œ à¦•à¦°à§‡ à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦°à§‡à¦•à¦°à§�à¦¡à§‡à¦° à¦œà¦¨à§�à¦¯ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦‡à¦¨à§�à¦¡à¦¿à¦•à§‡à¦Ÿà¦° (Active, Upcoming, Archived) à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "57",
    "date": "2026-08-01T16:08",
    "type": "Modify",
    "module": "Employee Roster",
    "link": "/create-roster",
    "descriptionEn": "Updated the DEFAULT HOLIDAY generator in the employee roster matrix to dynamically query and apply the weekly holidays configured in the Default Holiday Setup track based on the target month and year.",
    "descriptionBn": "à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦°à¦¸à§�à¦Ÿà¦¾à¦° à¦®à§�à¦¯à¦¾à¦Ÿà§�à¦°à¦¿à¦•à§�à¦¸à§‡à¦° DEFAULT HOLIDAY à¦œà§‡à¦¨à¦¾à¦°à§‡à¦Ÿà¦° à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦�à¦Ÿà¦¿ à¦Ÿà¦¾à¦°à§�à¦—à§‡à¦Ÿ à¦®à¦¾à¦¸ à¦“ à¦¬à¦›à¦° à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¡à¦¿à¦«à¦²à§�à¦Ÿ à¦¹à¦²à¦¿à¦¡à§‡ à¦¸à§‡à¦Ÿà¦†à¦ª à¦Ÿà§�à¦°à§�à¦¯à¦¾à¦•à§‡ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦° à¦•à¦°à¦¾ à¦¸à¦¾à¦ªà§�à¦¤à¦¾à¦¹à¦¿à¦• à¦›à§�à¦Ÿà¦¿à¦—à§�à¦²à§‹ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦•à¦¾à¦²à¦¿ à¦²à§‹à¦¡ à¦�à¦¬à¦‚ à¦ªà§�à¦°à§Ÿà§‹à¦— à¦•à¦°à§‡à¥¤"
  },
  {
    "id": "56",
    "date": "2026-08-01T16:13",
    "type": "Modify",
    "module": "Employee Roster",
    "link": "/create-roster",
    "descriptionEn": "Redesigned the Employee Roster page to automatically pre-populate the roster matrix with active default weekly holidays upon loading or switching months/years, and removed the redundant ROSTER HOLIDAY and DEFAULT HOLIDAY action buttons.",
    "descriptionBn": "à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à¦¿ à¦°à¦¸à§�à¦Ÿà¦¾à¦° à¦ªà§‡à¦œ à¦°à¦¿à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦ªà§‡à¦œ à¦²à§‹à¦¡ à¦¹à¦“à§Ÿà¦¾ à¦¬à¦¾ à¦®à¦¾à¦¸/à¦¬à¦›à¦° à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨à§‡à¦° à¦¸à¦®à§Ÿ à¦°à¦¸à§�à¦Ÿà¦¾à¦° à¦®à§�à¦¯à¦¾à¦Ÿà§�à¦°à¦¿à¦•à§�à¦¸ à¦¸à§�à¦¬à§Ÿà¦‚à¦•à§�à¦°à¦¿à§Ÿà¦­à¦¾à¦¬à§‡ à¦¸à¦•à§�à¦°à¦¿à§Ÿ à¦¸à¦¾à¦ªà§�à¦¤à¦¾à¦¹à¦¿à¦• à¦¡à¦¿à¦«à¦²à§�à¦Ÿ à¦›à§�à¦Ÿà¦¿à¦° à¦¦à¦¿à¦¨à¦—à§�à¦²à§‹ à¦¦à¦¿à§Ÿà§‡ à¦ªà§‚à¦°à¦£ à¦¹à§Ÿ, à¦�à¦¬à¦‚ à¦…à¦ªà§�à¦°à§Ÿà§‹à¦œà¦¨à§€à§Ÿ ROSTER HOLIDAY à¦“ DEFAULT HOLIDAY à¦¬à¦¾à¦Ÿà¦¨ à¦¦à§�à¦Ÿà¦¿ à¦¬à¦¾à¦¦ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "55",
    "date": "2026-08-01T16:48",
    "type": "New Addition",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Created a brand-new dedicated Prepare Pre-Cost page containing an initial pre-cost list view and a detailed, tab-free workspace featuring complete Order Basic Information, RMG Operation Process Loss %, dynamic style details entry with size breakdown tables, and checkable Additional Costing formulas matching the design system.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦®à¦¡à¦¿à¦‰à¦²à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¨à¦¤à§�à¦¨ 'Prepare Pre-Cost' à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦�à¦•à¦Ÿà¦¿ à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦�à¦¬à¦‚ '+ Prepare Pre-Cost' à¦¬à¦¾à¦Ÿà¦¨à§‡ à¦•à§�à¦²à¦¿à¦• à¦•à¦°à¦²à§‡ à¦…à¦°à§�à¦¡à¦¾à¦° à¦¬à§‡à¦¸à¦¿à¦• à¦‡à¦¨à¦«à¦°à¦®à§‡à¦¶à¦¨, à¦†à¦°à¦�à¦®à¦œà¦¿ à¦ªà§�à¦°à¦¸à§‡à¦¸ à¦²à¦¸ %, à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦• à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦¬à§�à¦°à§‡à¦•à¦¡à¦¾à¦‰à¦¨ à¦Ÿà§‡à¦¬à¦¿à¦² à¦�à¦¬à¦‚ à¦…à§�à¦¯à¦¾à¦¡à¦¿à¦¶à¦¨à¦¾à¦² à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦«à¦°à§�à¦®à§�à¦²à¦¾ à¦¸à¦®à§�à¦¬à¦²à¦¿à¦¤ à¦šà¦®à§Žà¦•à¦¾à¦° à¦“à§Ÿà¦¾à¦°à§�à¦•à¦¸à§�à¦ªà§‡à¦¸ à¦“à¦ªà§‡à¦¨ à¦¹à¦¬à§‡à¥¤"
  },
  {
    "id": "54",
    "date": "2026-08-01T17:04",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Polished the Pre-Cost form interface: removed the duplicate top-bar Cancel/Save buttons, replaced with a clean query number + style count indicator. Upgraded the bottom summary bar to show 3 live KPI metrics (Avg Quoted FOB, Total Qty, Styles count) and an optional Commission Total card. Actions are now a single Discard + Save Sheet pair, cleaner and more professional.",
    "descriptionBn": "Pre-Cost à¦«à¦°à§�à¦®à§‡à¦° à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à¦«à§‡à¦¸ à¦ªà¦¾à¦²à¦¿à¦¶ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à¦¡à§�à¦ªà§�à¦²à¦¿à¦•à§‡à¦Ÿ à¦Ÿà¦ª-à¦¬à¦¾à¦° Cancel/Save à¦¬à¦¾à¦Ÿà¦¨ à¦¸à¦°à¦¿à¦¯à¦¼à§‡ à¦•à§‹à¦¯à¦¼à§‡à¦°à¦¿ à¦¨à¦®à§�à¦¬à¦° à¦“ à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦•à¦¾à¦‰à¦¨à§�à¦Ÿ à¦‡à¦¨à§�à¦¡à¦¿à¦•à§‡à¦Ÿà¦° à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦«à§�à¦Ÿà¦¾à¦° à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦¬à¦¾à¦°à§‡ à¦¤à¦¿à¦¨à¦Ÿà¦¿ à¦²à¦¾à¦‡à¦­ à¦•à§‡à¦ªà¦¿à¦†à¦‡ à¦®à§‡à¦Ÿà§�à¦°à¦¿à¦• (à¦—à¦¡à¦¼ à¦•à§‹à¦Ÿà§‡à¦¡ à¦�à¦«à¦“à¦¬à¦¿, à¦®à§‹à¦Ÿ à¦ªà¦°à¦¿à¦®à¦¾à¦£, à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦¸à¦‚à¦–à§�à¦¯à¦¾) à¦�à¦¬à¦‚ à¦�à¦šà§�à¦›à¦¿à¦• à¦•à¦®à¦¿à¦¶à¦¨ à¦Ÿà§‹à¦Ÿà¦¾à¦² à¦•à¦¾à¦°à§�à¦¡ à¦¦à§‡à¦–à¦¾à¦¨à§‹ à¦¹à¦šà§�à¦›à§‡à¥¤ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦Ÿà¦¨ à¦�à¦–à¦¨ à¦¶à§�à¦§à§� à¦�à¦•à¦Ÿà¦¿ Discard + Save Sheet à¦ªà§‡à¦¯à¦¼à¦¾à¦°, à¦¯à¦¾ à¦†à¦—à§‡à¦° à¦¥à§‡à¦•à§‡ à¦…à¦¨à§‡à¦• à¦•à§�à¦²à¦¿à¦¨ à¦“ à¦ªà§�à¦°à¦«à§‡à¦¶à¦¨à¦¾à¦²à¥¤"
  },
  {
    "id": "53",
    "date": "2026-08-02T10:55",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-inquiry",
    "descriptionEn": "Upgraded the Buyer Inquiry page: refactored the old modal-based workflow to a premium split-view list register and dedicated Prepare Inquiry workspace. Added division-specific configuration grids for Knit/Woven/Sweater specs (e.g. GSM, weave construction, machine gauge), process toggles, sketch image upload slot, and a real-time live pre-costing FOB/CMT calculator engine.",
    "descriptionBn": "à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦‡à¦¨à¦•à§‹à¦¯à¦¼à¦¾à¦°à¦¿ à¦ªà§‡à¦œà¦Ÿà¦¿ à¦°à¦¿à¦«à§�à¦¯à¦¾à¦•à§�à¦Ÿà¦° à¦•à¦°à§‡ à¦�à¦•à¦Ÿà¦¿ à¦ªà§�à¦°à¦¿à¦®à¦¿à¦¯à¦¼à¦¾à¦® à¦¸à§�à¦ªà§�à¦²à¦¿à¦Ÿ-à¦­à¦¿à¦‰ à¦²à¦¿à¦¸à§�à¦Ÿ à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà¦¾à¦° à¦�à¦¬à¦‚ à¦¡à§‡à¦¡à¦¿à¦•à§‡à¦Ÿà§‡à¦¡ à¦ªà§�à¦°à¦¿à¦ªà§�à¦°à§‡à¦‡à¦¯à¦¼à¦¾à¦° à¦‡à¦¨à¦•à§‹à¦¯à¦¼à¦¾à¦°à¦¿ à¦“à¦¯à¦¼à¦¾à¦°à§�à¦•à¦¸à§�à¦ªà§‡à¦¸ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦¨à¦¿à¦Ÿ/à¦“à¦­à§‡à¦¨/à¦¸à§‹à¦¯à¦¼à§‡à¦Ÿà¦¾à¦°à§‡à¦° à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ à¦ªà§�à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦° à¦—à§�à¦°à¦¿à¦¡ (à¦¯à§‡à¦®à¦¨ à¦œà¦¿à¦�à¦¸à¦�à¦®, à¦‰à¦‡à¦­ à¦•à¦¨à¦¸à§�à¦Ÿà§�à¦°à¦¾à¦•à¦¶à¦¨, à¦—à§‡à¦œ), à¦ªà§�à¦°à¦¸à§‡à¦¸ à¦Ÿà¦—à¦²à¦¸, à¦¸à§�à¦•à§‡à¦š à¦†à¦ªà¦²à§‹à¦¡à¦¾à¦° à¦�à¦¬à¦‚ à¦°à¦¿à¦¯à¦¼à§‡à¦²-à¦Ÿà¦¾à¦‡à¦® à¦ªà§�à¦°à¦¿-à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦�à¦«à¦“à¦¬à¦¿ à¦•à§�à¦¯à¦¾à¦²à¦•à§�à¦²à§‡à¦Ÿà¦° à¦‡à¦žà§�à¦œà¦¿à¦¨ à¦…à¦¨à§�à¦¤à¦°à§�à¦­à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "52",
    "date": "2026-08-02T10:58",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-inquiry",
    "descriptionEn": "Simplified the Buyer Inquiry creation and editing form by removing unnecessary PO-specific inputs (AQL Standard, Agent, Brand, Currency, Exchange Rate, and Shipping Mode). Retained only the core specifications required during initial buyer quotation to keep the workflow clean and focused.",
    "descriptionBn": "à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦‡à¦¨à¦•à§‹à¦¯à¦¼à¦¾à¦°à¦¿ à¦¤à§ˆà¦°à¦¿ à¦�à¦¬à¦‚ à¦¸à¦®à§�à¦ªà¦¾à¦¦à¦¨à¦¾ à¦«à¦°à§�à¦®à¦Ÿà¦¿ à¦¸à¦¹à¦œ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦…à¦ªà§�à¦°à¦¯à¦¼à§‹à¦œà¦¨à§€à¦¯à¦¼ à¦ªà¦¿à¦“-à¦¨à¦¿à¦°à§�à¦¦à¦¿à¦·à§�à¦Ÿ à¦‡à¦¨à¦ªà§�à¦Ÿ à¦¯à§‡à¦®à¦¨ à¦�à¦•à¦¿à¦‰à¦�à¦² à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦¡à¦¾à¦°à§�à¦¡, à¦�à¦œà§‡à¦¨à§�à¦Ÿ, à¦¬à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡, à¦•à¦¾à¦°à§‡à¦¨à§�à¦¸à¦¿, à¦�à¦•à§�à¦¸à¦šà§‡à¦žà§�à¦œ à¦°à§‡à¦Ÿ à¦�à¦¬à¦‚ à¦¶à¦¿à¦ªà¦¿à¦‚ à¦®à§‹à¦¡ à¦¸à¦°à¦¿à¦¯à¦¼à§‡ à¦¦à¦¿à§Ÿà§‡à¥¤ à¦“à¦¯à¦¼à¦¾à¦°à§�à¦•à¦«à§�à¦²à§‹ à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦° à¦°à¦¾à¦–à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦ªà§�à¦°à¦¾à¦¥à¦®à¦¿à¦• à¦•à§‹à¦Ÿà§‡à¦¶à¦¨à§‡à¦° à¦œà¦¨à§�à¦¯ à¦ªà§�à¦°à¦¯à¦¼à§‹à¦œà¦¨à§€à¦¯à¦¼ à¦®à§‚à¦² à¦ªà§�à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦°à¦—à§�à¦²à§‹ à¦°à¦¾à¦–à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "51",
    "date": "2026-08-02T11:02",
    "type": "New Addition",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Created the new Buyer Price Quotation page, completing the standard RMG workflow sequence: Inquiry -> Quotation -> Order Entry. It features a list register of quotations, a pipeline status board, a detailed cost calculation workspace (linking active inquiries to auto-populate specifications), and a print-ready official quote sheet preview layout.",
    "descriptionBn": "à¦¨à¦¤à§�à¦¨ à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦ªà§�à¦°à¦¾à¦‡à¦¸ à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à¦¾ à¦†à¦°à¦�à¦®à¦œà¦¿ à¦“à¦¯à¦¼à¦¾à¦°à§�à¦•à¦«à§�à¦²à§‹ à¦¸à¦¿à¦•à§‹à¦¯à¦¼à§‡à¦¨à§�à¦¸ à¦¸à¦®à§�à¦ªà¦¨à§�à¦¨ à¦•à¦°à§‡: à¦‡à¦¨à¦•à§‹à¦¯à¦¼à¦¾à¦°à¦¿ -> à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ -> à¦…à¦°à§�à¦¡à¦¾à¦° à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿à¥¤ à¦�à¦¤à§‡ à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ à¦²à¦¿à¦¸à§�à¦Ÿ à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà¦¾à¦°, à¦ªà¦¾à¦‡à¦ªà¦²à¦¾à¦‡à¦¨ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦¬à§‹à¦°à§�à¦¡, à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦“à¦¯à¦¼à¦¾à¦°à§�à¦•à¦¸à§�à¦ªà§‡à¦¸ (à¦¯à¦¾ à¦�à¦•à¦Ÿà¦¿ à¦‡à¦¨à¦•à§‹à¦¯à¦¼à¦¾à¦°à¦¿ à¦²à¦¿à¦‚à¦• à¦•à¦°à§‡ à¦¸à§�à¦ªà§‡à¦¸à¦¿à¦«à¦¿à¦•à§‡à¦¶à¦¨ à¦²à§‹à¦¡ à¦•à¦°à§‡), à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ-à¦°à§‡à¦¡à¦¿ à¦…à¦«à¦¿à¦¸à¦¿à¦¯à¦¼à¦¾à¦² à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ à¦¶à¦¿à¦Ÿ à¦ªà§�à¦°à¦¿à¦­à¦¿à¦‰ à¦²à§‡à¦†à¦‰à¦Ÿ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "50",
    "date": "2026-08-02T11:05",
    "type": "New Addition",
    "module": "Merchandising",
    "link": "/merchandising-po",
    "descriptionEn": "Created the new Purchase Order (PO) Register page, successfully establishing the full RMG sequence: Inquiry -> Quotation -> PO -> Order Entry. It features a list register of official buyer contracts, KPI summaries, and a workspace that links to approved quotations (auto-populating product specs and FOB price offers) and allows proceeding directly to the Order Entry details hub.",
    "descriptionBn": "à¦¨à¦¤à§�à¦¨ à¦ªà¦¾à¦°à¦šà§‡à¦œ à¦…à¦°à§�à¦¡à¦¾à¦° (à¦ªà¦¿à¦“) à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà¦¾à¦° à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾ à¦†à¦°à¦�à¦®à¦œà¦¿ à¦“à§Ÿà¦¾à¦°à§�à¦•à¦«à§�à¦²à§‹ à¦¸à¦¿à¦•à§‹à§Ÿà§‡à¦¨à§�à¦¸ à¦¸à¦®à§�à¦ªà¦¨à§�à¦¨ à¦•à¦°à§‡: à¦‡à¦¨à¦•à§‹à¦¯à¦¼à¦¾à¦°à¦¿ -> à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ -> à¦ªà¦¿à¦“ -> à¦…à¦°à§�à¦¡à¦¾à¦° à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿à¥¤ à¦�à¦¤à§‡ à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦•à¦¨à§�à¦Ÿà¦¾à¦•à§�à¦Ÿ à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà¦¾à¦°, à¦•à§‡à¦ªà¦¿à¦†à¦‡ à¦¸à¦¾à¦®à¦¾à¦°à¦¿ à¦�à¦¬à¦‚ à¦�à¦•à¦Ÿà¦¿ à¦“à¦¯à¦¼à¦¾à¦°à§�à¦•à¦¸à§�à¦ªà§‡à¦¸ à¦°à¦¯à¦¼à§‡à¦›à§‡ à¦¯à¦¾ à¦…à¦¨à§�à¦®à§‹à¦¦à¦¿à¦¤ à¦•à§‹à¦Ÿà§‡à¦¶à¦¨à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦²à¦¿à¦‚à¦• à¦•à¦°à§‡ à¦¤à¦¥à§�à¦¯ à¦…à¦Ÿà§‹-à¦ªà¦ªà§�à¦²à§‡à¦Ÿ à¦•à¦°à§‡ à¦�à¦¬à¦‚ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦…à¦°à§�à¦¡à¦¾à¦° à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦¹à¦¾à¦¬à§‡ à¦¯à¦¾à¦“à¦¯à¦¼à¦¾à¦° à¦²à¦¿à¦‚à¦• à¦ªà§�à¦°à¦¦à¦¾à¦¨ à¦•à¦°à§‡à¥¤"
  },
  {
    "id": "49",
    "date": "2026-08-02T11:08",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Fixed a ReferenceError where 'showCostingModal' was not defined inside the Quotation page component. Declared the missing state hooks for showCostingModal and costingItem to resolve the rendering crash.",
    "descriptionBn": "à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ à¦ªà§‡à¦œ à¦‰à¦ªà¦¾à¦¦à¦¾à¦¨à§‡à¦° à¦­à§‡à¦¤à¦°à§‡ 'showCostingModal' à¦¸à¦‚à¦œà§�à¦žà¦¾à¦¯à¦¼à¦¿à¦¤ à¦¨à¦¾ à¦¥à¦¾à¦•à¦¾à¦° à¦•à¦¾à¦°à¦£à§‡ à¦†à¦¸à¦¾ à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦�à¦°à¦°à¦Ÿà¦¿ à¦¸à¦‚à¦¶à§‹à¦§à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦°à§‡à¦¨à§�à¦¡à¦¾à¦°à¦¿à¦‚ à¦•à§�à¦°à§�à¦¯à¦¾à¦¶ à¦�à§œà¦¾à¦¤à§‡ showCostingModal à¦�à¦¬à¦‚ costingItem-à¦�à¦° à¦…à¦¨à§�à¦ªà¦¸à§�à¦¥à¦¿à¦¤ à¦¸à§�à¦Ÿà§‡à¦Ÿ à¦¹à§�à¦•à¦—à§�à¦²à§‹ à¦¡à¦¿à¦•à§�à¦²à§‡à¦¯à¦¼à¦¾à¦° à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "48",
    "date": "2026-08-02T11:12",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-inquiry",
    "descriptionEn": "Standardized the UI/UX design of the Buyer Inquiry, Price Quotation, and Purchase Order pages to match the premium Order Entry page. Applied unified input component states, teal focus-rings, action button gradients, sidebar links, and structured section layout headers.",
    "descriptionBn": "à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦‡à¦¨à¦•à§‹à¦¯à¦¼à¦¾à¦°à¦¿, à¦ªà§�à¦°à¦¾à¦‡à¦¸ à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ à¦�à¦¬à¦‚ à¦ªà¦¾à¦°à¦šà§‡à¦œ à¦…à¦°à§�à¦¡à¦¾à¦° à¦ªà§‡à¦œà§‡à¦° à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦“ à¦²à§‡à¦†à¦‰à¦Ÿ à¦ªà§�à¦°à¦¿à¦®à¦¿à¦¯à¦¼à¦¾à¦® à¦…à¦°à§�à¦¡à¦¾à¦° à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦ªà§‡à¦œà§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦®à¦¿à¦² à¦°à§‡à¦–à§‡ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦¡à¦¾à¦°à§�à¦¡à¦¾à¦‡à¦œ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦…à¦­à¦¿à¦¨à§�à¦¨ à¦‡à¦¨à¦ªà§�à¦Ÿ à¦•à¦®à§�à¦ªà§‹à¦¨à§‡à¦¨à§�à¦Ÿ, à¦Ÿà¦¿à¦² à¦•à¦¾à¦²à¦¾à¦° à¦«à§‹à¦•à¦¾à¦¸-à¦°à¦¿à¦‚, à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦Ÿà¦¨ à¦—à§�à¦°à§‡à¦¡à¦¿à¦¯à¦¼à§‡à¦¨à§�à¦Ÿ à¦�à¦¬à¦‚ à¦¸à§‡à¦•à¦¶à¦¨ à¦²à§‡à¦†à¦‰à¦Ÿ à¦¹à§‡à¦¡à¦¾à¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "47",
    "date": "2026-08-02T11:15",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Standardized the UI/UX design of the Prepare Pre-Costing page to match the premium Order Entry page styling. Integrated unified input states, teal highlights, action button gradients, sidebar links, and structured section layout headers, and added the linkable inquiry dropdown.",
    "descriptionBn": "à¦ªà§�à¦°à¦¿à¦ªà§‡à¦¯à¦¼à¦¾à¦° à¦ªà§�à¦°à¦¿-à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦ªà§‡à¦œà§‡à¦° à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦“ à¦²à§‡à¦†à¦‰à¦Ÿ à¦ªà§�à¦°à¦¿à¦®à¦¿à¦¯à¦¼à¦¾à¦® à¦…à¦°à§�à¦¡à¦¾à¦° à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦ªà§‡à¦œà§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦®à¦¿à¦² à¦°à§‡à¦–à§‡ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦¡à¦¾à¦°à§�à¦¡à¦¾à¦‡à¦œ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦…à¦­à¦¿à¦¨à§�à¦¨ à¦‡à¦¨à¦ªà§�à¦Ÿ à¦•à¦®à§�à¦ªà§‹à¦¨à§‡à¦¨à§�à¦Ÿ, à¦Ÿà¦¿à¦² à¦•à¦¾à¦²à¦¾à¦° à¦«à§‹à¦•à¦¾à¦¸-à¦°à¦¿à¦‚, à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦Ÿà¦¨ à¦—à§�à¦°à§‡à¦¡à¦¿à¦¯à¦¼à§‡à¦¨à§�à¦Ÿ, à¦�à¦¬à¦‚ à¦‡à¦¨à¦•à§‹à¦¯à¦¼à¦¾à¦°à¦¿ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà¦° à¦Ÿà¦—à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "46",
    "date": "2026-08-02T11:20",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-order-profile",
    "descriptionEn": "Completed the sequential integration of the RMG Merchandising lifecycle (Inquiry -> Pre-Costing -> Quotation -> PO -> Order Entry). Updated the Quotation page to pull costing parameters directly from Pre-costing sheets, and updated the Order Entry page to include a PO linkage dropdown, auto-populating final buyer, style reference, ship date, unit FOB, and sizing grids from the PO registry.",
    "descriptionBn": "à¦†à¦°à¦�à¦®à¦œà¦¿ à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦²à¦¾à¦‡à¦«à¦¸à¦¾à¦‡à¦•à§‡à¦² (à¦‡à¦¨à¦•à§‹à¦¯à¦¼à¦¾à¦°à¦¿ -> à¦ªà§�à¦°à¦¿-à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ -> à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ -> à¦ªà¦¿à¦“ -> à¦…à¦°à§�à¦¡à¦¾à¦° à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿) à¦¸à¦¿à¦•à§‹à¦¯à¦¼à§‡à¦¨à§�à¦¸ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦‡à¦¨à§�à¦Ÿà¦¿à¦—à§�à¦°à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ à¦ªà§‡à¦œà§‡ à¦ªà§�à¦°à¦¿-à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦¶à¦¿à¦Ÿ à¦¥à§‡à¦•à§‡ à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦¡à¦¾à¦Ÿà¦¾ à¦²à§‹à¦¡ à¦•à¦°à¦¾à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾ à¦�à¦¬à¦‚ à¦…à¦°à§�à¦¡à¦¾à¦° à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦ªà§‡à¦œà§‡ à¦ªà¦¿à¦“ à¦²à¦¿à¦‚à¦•à¦¾à¦° à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à¦¾ à¦ªà¦¿à¦“ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦²à§‡ à¦¸à§�à¦¬à¦¯à¦¼à¦‚à¦•à§�à¦°à¦¿à¦¯à¦¼à¦­à¦¾à¦¬à§‡ à¦¬à¦¾à¦¯à¦¼à¦¾à¦°, à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸, à¦¶à¦¿à¦ª à¦¡à§‡à¦Ÿ, à¦�à¦«à¦“à¦¬à¦¿ à¦°à§‡à¦Ÿ à¦�à¦¬à¦‚ à¦¸à¦¾à¦‡à¦œ à¦—à§�à¦°à¦¿à¦¡ à¦²à§‹à¦¡ à¦•à¦°à§‡à¥¤"
  },
  {
    "id": "45",
    "date": "2026-08-02T11:25",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-inquiry",
    "descriptionEn": "Reordered and serialized the Merchandising module sidebar menu inside MerchandisingLayout.tsx to match the logical RMG lifecycle: Inquiry -> Pre Costing -> Quotation -> PO Management -> Order Management.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦®à¦¡à¦¿à¦‰à¦² à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦®à§‡à¦¨à§�à¦Ÿà¦¿à¦° à¦¸à¦¿à¦•à§‹à¦¯à¦¼à§‡à¦¨à§�à¦¸ MerchandisingLayout.tsx-à¦� à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à¦¾ à¦¯à§Œà¦•à§�à¦¤à¦¿à¦• à¦†à¦°à¦�à¦®à¦œà¦¿ à¦²à¦¾à¦‡à¦«à¦¸à¦¾à¦‡à¦•à§‡à¦²à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦¸à¦¾à¦®à¦žà§�à¦œà¦¸à§�à¦¯à¦ªà§‚à¦°à§�à¦£: à¦‡à¦¨à¦•à§‹à¦¯à¦¼à¦¾à¦°à¦¿ -> à¦ªà§�à¦°à¦¿ à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ -> à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ -> à¦ªà¦¿à¦“ à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦®à§‡à¦¨à§�à¦Ÿ -> à¦…à¦°à§�à¦¡à¦¾à¦° à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦®à§‡à¦¨à§�à¦Ÿà¥¤"
  },
  {
    "id": "44",
    "date": "2026-08-02T11:30",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-order-profile",
    "descriptionEn": "Refactored the entire merchandising flow to support professional RMG parameters: added sample checklists to Inquiry, itemized trims spreadsheets to Pre-Costing, commercial terms to Quotation, and L/C Details plus Nominated Supplier assignments to PO Management and Order Entry.",
    "descriptionBn": "à¦®à¦¾à¦°à§�à¦šà§‡à¦¨à§�à¦¡à¦¾à¦‡à¦œà¦¿à¦‚ à¦«à§�à¦²à§‹-à¦Ÿà¦¿ à¦ªà§‡à¦¶à¦¾à¦¦à¦¾à¦° à¦†à¦°à¦�à¦®à¦œà¦¿ à¦ªà§�à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦° à¦¸à¦¹ à¦°à¦¿à¦«à§�à¦¯à¦¾à¦•à§�à¦Ÿà¦° à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à¦‡à¦¨à¦•à§‹à¦¯à¦¼à¦¾à¦°à¦¿à¦¤à§‡ à¦¸à§�à¦¯à¦¾à¦®à§�à¦ªà¦² à¦šà§‡à¦•à¦²à¦¿à¦¸à§�à¦Ÿ, à¦ªà§�à¦°à¦¿-à¦•à¦¸à§�à¦Ÿà¦¿à¦‚à¦¯à¦¼à§‡ à¦†à¦‡à¦Ÿà§‡à¦®à¦¾à¦‡à¦œà¦¡ à¦Ÿà§�à¦°à¦¿à¦®à¦¸ à¦¸à§�à¦ªà§�à¦°à§‡à¦¡à¦¶à¦¿à¦Ÿ, à¦•à§‹à¦Ÿà§‡à¦¶à¦¨à§‡ à¦•à¦®à¦¾à¦°à§�à¦¶à¦¿à¦¯à¦¼à¦¾à¦² à¦Ÿà¦¾à¦°à§�à¦®à¦¸ à¦�à¦¬à¦‚ à¦ªà¦¿à¦“ à¦“ à¦…à¦°à§�à¦¡à¦¾à¦° à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿à¦¤à§‡ à¦�à¦²/à¦¸à¦¿ à¦¬à¦¿à¦¬à¦°à¦£à§€ à¦“ à¦¨à¦®à¦¿à¦¨à§‡à¦Ÿà§‡à¦¡ à¦¸à¦¾à¦ªà§�à¦²à¦¾à¦¯à¦¼à¦¾à¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "43",
    "date": "2026-08-02T11:55",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Cloned the Pakiza Knit Composite Ltd high-fidelity costing/quotation sheet, integrating garment cost breakdowns (main fabric, trims, emb, washing, overheads), fabric price formulas (yarn cost blend ratios, knitting, process loss), machine productivity income calculations, and official signature rows.",
    "descriptionBn": "à¦ªà¦¾à¦•à¦¿à¦œà¦¾ à¦¨à¦¿à¦Ÿ à¦•à¦®à§�à¦ªà§‹à¦œà¦¿à¦Ÿ à¦²à¦¿à¦®à¦¿à¦Ÿà§‡à¦¡à§‡à¦° à¦¹à¦¾à¦‡-à¦«à¦¿à¦¡à§‡à¦²à¦¿à¦Ÿà¦¿ à¦•à¦¸à§�à¦Ÿà¦¿à¦‚/à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ à¦¶à¦¿à¦Ÿ à¦•à§�à¦²à§‹à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à¦¾à¦° à¦®à¦§à§�à¦¯à§‡ à¦°à§Ÿà§‡à¦›à§‡ à¦—à¦¾à¦°à§�à¦®à§‡à¦¨à§�à¦Ÿà¦¸ à¦•à¦¸à§�à¦Ÿ à¦¬à§�à¦°à§‡à¦•à¦¡à¦¾à¦‰à¦¨ (à¦®à§‡à¦¨ à¦«à§‡à¦¬à§�à¦°à¦¿à¦•, à¦Ÿà§�à¦°à¦¿à¦®à¦¸, à¦�à¦®à¦¬à§�à¦°à¦¯à¦¼à¦¡à¦¾à¦°à¦¿, à¦“à¦¯à¦¼à¦¾à¦¶à¦¿à¦‚, à¦“à¦­à¦¾à¦°à¦¹à§‡à¦¡), à¦«à§‡à¦¬à§�à¦°à¦¿à¦• à¦ªà§�à¦°à¦¾à¦‡à¦¸ à¦«à¦°à§�à¦®à§�à¦²à¦¾ (à¦‡à¦¯à¦¼à¦¾à¦°à§�à¦¨ à¦•à¦¸à§�à¦Ÿ à¦¬à§�à¦²à§‡à¦¨à§�à¦¡ à¦°à§‡à¦¶à¦¿à¦“, à¦¨à¦¿à¦Ÿà¦¿à¦‚, à¦ªà§�à¦°à¦¸à§‡à¦¸ à¦²à¦¸), à¦®à§‡à¦¶à¦¿à¦¨ à¦ªà§�à¦°à§‹à¦¡à¦¾à¦•à§�à¦Ÿà¦¿à¦­à¦¿à¦Ÿà¦¿ à¦‡à¦¨à¦•à¦¾à¦® à¦¹à¦¿à¦¸à¦¾à¦¬ à¦�à¦¬à¦‚ à¦…à¦«à¦¿à¦¸à¦¿à¦¯à¦¼à¦¾à¦² à¦¸à¦¿à¦—à¦¨à§‡à¦šà¦¾à¦° à¦°à§‹à¥¤"
  },
  {
    "id": "42",
    "date": "2026-08-02T12:00",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Implemented automatic costing formulas in the Quotation page: CAD consumption plus wastage auto-computes fabric consumption, Fabric Price/KG dynamically maps into main fabric rate, dozen costs sum automatically, and markups yield the live FOB price with target gap validation.",
    "descriptionBn": "à¦•à§‹à¦Ÿà§‡à¦¶à¦¨ à¦ªà§‡à¦œà§‡ à¦¸à§�à¦¬à¦¯à¦¼à¦‚à¦•à§�à¦°à¦¿à¦¯à¦¼ à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦«à¦°à§�à¦®à§�à¦²à¦¾ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à¦•à§�à¦¯à¦¾à¦¡ à¦•à¦¨à¦¸à¦¾à¦®à§�à¦ªà¦¶à¦¨ à¦“ à¦“à¦¯à¦¼à§‡à¦¸à§�à¦Ÿà§‡à¦œ à¦¯à§‹à¦— à¦•à¦°à§‡ à¦«à§‡à¦¬à§�à¦°à¦¿à¦• à¦•à¦¨à¦¸à¦¾à¦®à§�à¦ªà¦¶à¦¨ à¦¹à¦¿à¦¸à¦¾à¦¬, à¦«à§‡à¦¬à§�à¦°à¦¿à¦• à¦ªà§�à¦°à¦¾à¦‡à¦¸/à¦•à§‡à¦œà¦¿ à¦¸à§�à¦¬à¦¯à¦¼à¦‚à¦•à§�à¦°à¦¿à¦¯à¦¼à¦­à¦¾à¦¬à§‡ à¦®à§‡à¦‡à¦¨ à¦«à§‡à¦¬à§�à¦°à¦¿à¦• à¦°à§‡à¦Ÿà§‡ à¦®à§�à¦¯à¦¾à¦ªà¦¿à¦‚, à¦¡à¦œà¦¨ à¦•à¦¸à§�à¦Ÿ à¦¹à¦¿à¦¸à¦¾à¦¬ à¦�à¦¬à¦‚ à¦®à¦¾à¦°à§�à¦•à¦†à¦ª à¦¯à§‹à¦— à¦•à¦°à§‡ à¦²à¦¾à¦‡à¦­ à¦�à¦«à¦“à¦¬à¦¿ à¦°à§‡à¦Ÿ à¦“ à¦Ÿà¦¾à¦°à§�à¦—à§‡à¦Ÿ à¦—à§�à¦¯à¦¾à¦ª à¦­à§�à¦¯à¦¾à¦²à¦¿à¦¡à§‡à¦¶à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "41",
    "date": "2026-08-02T12:05",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Completely rebuilt the Quotation/Buyer Costing page as a true spreadsheet-style layout matching the Pakiza Knit ERP: dynamic + add row and Ã— delete row buttons for every section (Fabric, Accessories, Embellishment, Washing, Other Costs, Yarn, Knitting, Dyeing), split left/right table panels, inline editable cells, and auto-calculated fabric consumption and FOB pricing.",
    "descriptionBn": "à¦•à§‹à¦Ÿà§‡à¦¶à¦¨/à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦ªà§‡à¦œà¦Ÿà¦¿ à¦ªà¦¾à¦•à¦¿à¦œà¦¾ à¦¨à¦¿à¦Ÿ à¦‡à¦†à¦°à¦ªà¦¿à¦° à¦®à¦¤à§‹ à¦¸à¦¤à§�à¦¯à¦¿à¦•à¦¾à¦°à§‡à¦° à¦¸à§�à¦ªà§�à¦°à§‡à¦¡à¦¶à¦¿à¦Ÿ à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦ªà§�à¦¨à¦°à§�à¦¨à¦¿à¦°à§�à¦®à¦¾à¦£ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦¸à§‡à¦•à¦¶à¦¨à§‡ (à¦«à§‡à¦¬à§�à¦°à¦¿à¦•, à¦…à§�à¦¯à¦¾à¦•à§�à¦¸à§‡à¦¸à¦°à¦¿à¦œ, à¦�à¦®à¦¬à§�à¦°à¦¯à¦¼à¦¡à¦¾à¦°à¦¿, à¦“à¦¯à¦¼à¦¾à¦¶à¦¿à¦‚, à¦…à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¯ à¦–à¦°à¦š, à¦‡à¦¯à¦¼à¦¾à¦°à§�à¦¨, à¦¨à¦¿à¦Ÿà¦¿à¦‚, à¦¡à¦¾à¦¯à¦¼à¦¿à¦‚) à¦¡à¦¾à¦¯à¦¼à¦¨à¦¾à¦®à¦¿à¦• + à¦°à§‹ à¦¯à§‹à¦— à¦�à¦¬à¦‚ Ã— à¦°à§‹ à¦®à§�à¦›à¦¾à¦° à¦¬à§‹à¦¤à¦¾à¦® à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¬à¦¾à¦®-à¦¡à¦¾à¦¨ à¦¬à¦¿à¦­à¦•à§�à¦¤ à¦Ÿà§‡à¦¬à¦¿à¦² à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦², à¦‡à¦¨à¦²à¦¾à¦‡à¦¨ à¦�à¦¡à¦¿à¦Ÿà¦¯à§‹à¦—à§�à¦¯ à¦¸à§‡à¦² à¦�à¦¬à¦‚ à¦¸à§�à¦¬à¦¯à¦¼à¦‚à¦•à§�à¦°à¦¿à¦¯à¦¼ à¦«à§‡à¦¬à§�à¦°à¦¿à¦• à¦•à¦¨à¦¸à¦¾à¦®à§�à¦ªà¦¶à¦¨ à¦“ à¦�à¦«à¦“à¦¬à¦¿ à¦®à§‚à¦²à§�à¦¯ à¦¹à¦¿à¦¸à¦¾à¦¬ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "40",
    "date": "2026-08-02T12:10",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Full design overhaul of the Buyer Costing Sheet: replaced harsh purple/blue table headers with clean white card sections and a consistent indigo accent palette, added a sticky live FOB pricing panel on the right, grouped related sections side-by-side, made delete buttons hover-to-reveal, and highlighted auto-calculated fields in teal for clarity.",
    "descriptionBn": "à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦¶à¦¿à¦Ÿà§‡à¦° à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à¦•à¦¡à¦¼à¦¾ à¦¬à§‡à¦—à§�à¦¨à¦¿/à¦¨à§€à¦² à¦Ÿà§‡à¦¬à¦¿à¦² à¦¹à§‡à¦¡à¦¾à¦°à§‡à¦° à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à§‡ à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦° à¦¸à¦¾à¦¦à¦¾ à¦•à¦¾à¦°à§�à¦¡ à¦¸à§‡à¦•à¦¶à¦¨ à¦“ à¦‡à¦¨à§�à¦¡à¦¿à¦—à§‹ à¦°à¦™à§‡à¦° à¦ªà§�à¦¯à¦¾à¦²à§‡à¦Ÿ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¡à¦¾à¦¨à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¸à§�à¦Ÿà¦¿à¦•à¦¿ à¦²à¦¾à¦‡à¦­ à¦�à¦«à¦“à¦¬à¦¿ à¦®à§‚à¦²à§�à¦¯ à¦•à¦¾à¦°à§�à¦¡ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¸à¦®à§�à¦ªà¦°à§�à¦•à¦¿à¦¤ à¦¸à§‡à¦•à¦¶à¦¨à¦—à§�à¦²à§‹ à¦ªà¦¾à¦¶à¦¾à¦ªà¦¾à¦¶à¦¿ à¦¸à¦¾à¦œà¦¾à¦¨à§‹ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¡à¦¿à¦²à¦¿à¦Ÿ à¦¬à§‹à¦¤à¦¾à¦® à¦¹à§‹à¦­à¦¾à¦°à§‡ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¯à¦¼ à¦�à¦¬à¦‚ à¦¸à§�à¦¬à¦¯à¦¼à¦‚à¦•à§�à¦°à¦¿à¦¯à¦¼ à¦«à¦¿à¦²à§�à¦¡à¦—à§�à¦²à§‹ à¦Ÿà¦¿à¦² à¦°à¦™à§‡ à¦¹à¦¾à¦‡à¦²à¦¾à¦‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "39",
    "date": "2026-08-02T12:16",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-quotation",
    "descriptionEn": "Added major UX improvements to the Buyer Costing Sheet: collapsible sections with chevrons, section total chips showing $/dozen in headers, dashed full-width Add Row buttons, teal-styled auto-calculated fields, context-sensitive FOB card (green when target met), inline tooltip hints on complex fields, and main fabric row highlighted differently from editable rows.",
    "descriptionBn": "à¦¬à¦¾à¦¯à¦¼à¦¾à¦° à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦¶à¦¿à¦Ÿà§‡ à¦—à§�à¦°à§�à¦¤à§�à¦¬à¦ªà§‚à¦°à§�à¦£ à¦‡à¦‰à¦œà¦¾à¦° à¦�à¦•à§�à¦¸à¦ªà§‡à¦°à¦¿à¦¯à¦¼à§‡à¦¨à§�à¦¸ à¦‰à¦¨à§�à¦¨à¦¤à¦¿ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à¦šà§‡à¦­à¦°à¦¨ à¦¸à¦¹ à¦¸à§‡à¦•à¦¶à¦¨ à¦­à¦¾à¦�à¦œ à¦•à¦°à¦¾à¦° à¦¸à§�à¦¬à¦¿à¦§à¦¾, à¦¹à§‡à¦¡à¦¾à¦°à§‡ $/à¦¡à¦œà¦¨ à¦¸à§‡à¦•à¦¶à¦¨ à¦Ÿà§‹à¦Ÿà¦¾à¦² à¦šà¦¿à¦ª, à¦¡à§�à¦¯à¦¾à¦¶à¦¡ à¦¬à¦°à§�à¦¡à¦¾à¦° à¦¸à¦¹ Add Row à¦¬à§‹à¦¤à¦¾à¦®, à¦Ÿà¦¿à¦² à¦°à¦™à§‡à¦° à¦¸à§�à¦¬à¦¯à¦¼à¦‚à¦•à§�à¦°à¦¿à¦¯à¦¼ à¦«à¦¿à¦²à§�à¦¡, à¦Ÿà¦¾à¦°à§�à¦—à§‡à¦Ÿ à¦ªà§‚à¦°à¦£ à¦¹à¦²à§‡ à¦¸à¦¬à§�à¦œ FOB à¦•à¦¾à¦°à§�à¦¡, à¦œà¦Ÿà¦¿à¦² à¦«à¦¿à¦²à§�à¦¡à§‡ à¦Ÿà§�à¦²à¦Ÿà¦¿à¦ª à¦¹à¦¿à¦¨à§�à¦Ÿ à¦�à¦¬à¦‚ à¦®à§‡à¦‡à¦¨ à¦«à§‡à¦¬à§�à¦°à¦¿à¦• à¦°à§‹ à¦†à¦²à¦¾à¦¦à¦¾à¦­à¦¾à¦¬à§‡ à¦¹à¦¾à¦‡à¦²à¦¾à¦‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "38",
    "date": "2026-08-02T12:31",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Completely rebuilt the Pre-Costing page with three views: (1) List view with date/buyer/status filters, Excel/Print/PDF export buttons, and color-coded status badges; (2) Entry form with collapsible sections for Order Info, Process Loss, Style FOB details, Fabric (B.1), Accessories (B.5), CM Cost (D), Special Cost (G), Others (H), and a live budget summary card; (3) Full detail/print view matching the Pakiza Knit ERP format with budget summary A-K, all costing sections, and 5-person approval signature block.",
    "descriptionBn": "à¦ªà§�à¦°à¦¿-à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦ªà§‡à¦œà¦Ÿà¦¿ à¦¤à¦¿à¦¨à¦Ÿà¦¿ à¦­à¦¿à¦‰ à¦¸à¦¹ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦ªà§�à¦¨à¦°à§�à¦¨à¦¿à¦°à§�à¦®à¦¾à¦£ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: (à§§) à¦¤à¦¾à¦°à¦¿à¦–/à¦•à§�à¦°à§‡à¦¤à¦¾/à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°, à¦�à¦•à§�à¦¸à§‡à¦²/à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ/à¦ªà¦¿à¦¡à¦¿à¦�à¦« à¦¬à§‹à¦¤à¦¾à¦® à¦“ à¦°à¦™à¦¿à¦¨ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦¬à§�à¦¯à¦¾à¦œ à¦¸à¦¹ à¦¤à¦¾à¦²à¦¿à¦•à¦¾ à¦­à¦¿à¦‰; (à§¨) à¦…à¦°à§�à¦¡à¦¾à¦° à¦¤à¦¥à§�à¦¯, à¦ªà§�à¦°à¦¸à§‡à¦¸ à¦²à¦¸, à¦¸à§�à¦Ÿà¦¾à¦‡à¦² FOB, à¦«à§‡à¦¬à§�à¦°à¦¿à¦• (B.1), à¦…à§�à¦¯à¦¾à¦•à§�à¦¸à§‡à¦¸à¦°à¦¿à¦œ (B.5), à¦¸à¦¿à¦�à¦® à¦•à¦¸à§�à¦Ÿ (D), à¦¬à¦¿à¦¶à§‡à¦· à¦–à¦°à¦š (G), à¦…à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¯ (H) à¦¸à§‡à¦•à¦¶à¦¨ à¦“ à¦²à¦¾à¦‡à¦­ à¦¬à¦¾à¦œà§‡à¦Ÿ à¦¸à¦¾à¦°à¦¸à¦‚à¦•à§�à¦·à§‡à¦ª à¦•à¦¾à¦°à§�à¦¡ à¦¸à¦¹ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦«à¦°à§�à¦®; (à§©) à¦ªà¦¾à¦•à¦¿à¦œà¦¾ à¦¨à¦¿à¦Ÿ à¦‡à¦†à¦°à¦ªà¦¿à¦° à¦®à¦¤à§‹ à¦ªà§‚à¦°à§�à¦£ à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤/à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰, à¦¬à¦¾à¦œà§‡à¦Ÿ à¦¸à¦¾à¦°à¦¸à¦‚à¦•à§�à¦·à§‡à¦ª A-K à¦�à¦¬à¦‚ à§« à¦œà¦¨à§‡à¦° à¦…à¦¨à§�à¦®à§‹à¦¦à¦¨ à¦¸à¦‡ à¦¬à§�à¦²à¦• à¦¸à¦¹à¥¤"
  },
  {
    "id": "37",
    "date": "2026-08-02T13:28",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Rebuilt the Pre-Costing detail/print view to match the Pakiza Knit ERP format: company header with logo, 6-column style info grid, Key Information + Style Image + Budget Summary in a 3-panel side-by-side layout, B.4 Fabric Conversion Cost grouped by Knitting/Dyeing sub-sections with sub-totals, B.2 Yarn and B.3 Dyed Yarn tables, G Special Cost + H Others Cost + I Sample Cost displayed side by side, and a 5-person approval block with Approved/Pending status per approver.",
    "descriptionBn": "à¦ªà§�à¦°à¦¿-à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²/à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰ à¦ªà¦¾à¦•à¦¿à¦œà¦¾ à¦¨à¦¿à¦Ÿ à¦‡à¦†à¦°à¦ªà¦¿à¦° à¦®à¦¤à§‹ à¦ªà§�à¦¨à¦°à§�à¦¨à¦¿à¦°à§�à¦®à¦¾à¦£ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à¦²à§‹à¦—à§‹ à¦¸à¦¹ à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿ à¦¹à§‡à¦¡à¦¾à¦°, à§¬-à¦•à¦²à¦¾à¦® à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦¤à¦¥à§�à¦¯ à¦—à§�à¦°à¦¿à¦¡, à§©-à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦² à¦ªà¦¾à¦¶à¦¾à¦ªà¦¾à¦¶à¦¿ à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦•à§€ à¦‡à¦¨à¦«à§‹ + à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦‡à¦®à§‡à¦œ + à¦¬à¦¾à¦œà§‡à¦Ÿ à¦¸à¦¾à¦°à¦¸à¦‚à¦•à§�à¦·à§‡à¦ª, à¦¨à¦¿à¦Ÿà¦¿à¦‚/à¦¡à¦¾à¦¯à¦¼à¦¿à¦‚ à¦¸à¦¾à¦¬-à¦¸à§‡à¦•à¦¶à¦¨ à¦¸à¦¹ B.4 à¦«à§‡à¦¬à§�à¦°à¦¿à¦• à¦•à¦¨à¦­à¦¾à¦°à§�à¦¸à¦¨ à¦•à¦¸à§�à¦Ÿ, B.2 à¦‡à¦¯à¦¼à¦¾à¦°à§�à¦¨ à¦“ B.3 à¦¡à¦¾à¦¯à¦¼à§‡à¦¡ à¦‡à¦¯à¦¼à¦¾à¦°à§�à¦¨ à¦Ÿà§‡à¦¬à¦¿à¦², à¦ªà¦¾à¦¶à¦¾à¦ªà¦¾à¦¶à¦¿ G à¦¬à¦¿à¦¶à§‡à¦· à¦–à¦°à¦š + H à¦…à¦¨à§�à¦¯à¦¾à¦¨à§�à¦¯ à¦–à¦°à¦š + I à¦¸à§�à¦¯à¦¾à¦®à§�à¦ªà¦² à¦•à¦¸à§�à¦Ÿ, à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦…à¦¨à§�à¦®à§‹à¦¦à¦¨à¦•à¦¾à¦°à§€à¦° à¦…à§�à¦¯à¦¾à¦ªà§�à¦°à§�à¦­à¦¡/à¦ªà§‡à¦¨à§�à¦¡à¦¿à¦‚ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦¸à¦¹ à§« à¦œà¦¨à§‡à¦° à¦¸à¦‡ à¦¬à§�à¦²à¦•à¥¤"
  },
  {
    "id": "36",
    "date": "2026-08-02T15:00",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Polished the Pre-Costing Detail/Print view: added matching letterhead design elements, cleaner 6-column Style Info borders and spacing, highly-aligned 3-column mid-section (Key Info, Style image, Budget table), and custom tables formatting (perfect grid alignments, dollar symbol formatting, monospace fonts for values, and refined border-slate configurations). Added status-colored signature lines with clean spacing.",
    "descriptionBn": "à¦ªà§�à¦°à¦¿-à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²/à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰ à¦®à¦¾à¦°à§�à¦œà¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à¦®à§�à¦¯à¦¾à¦šà¦¿à¦‚ à¦²à§‡à¦Ÿà¦¾à¦°à¦¹à§‡à¦¡ à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦‰à¦ªà¦¾à¦¦à¦¾à¦¨, à§¬-à¦•à¦²à¦¾à¦® à¦¬à¦¿à¦¶à¦¿à¦·à§�à¦Ÿ à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦¤à¦¥à§�à¦¯à§‡à¦° à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦° à¦¬à¦°à§�à¦¡à¦¾à¦° à¦“ à¦¸à§�à¦ªà§‡à¦¸à¦¿à¦‚, à§©-à¦•à¦²à¦¾à¦® à¦¬à¦¿à¦¶à¦¿à¦·à§�à¦Ÿ à¦®à¦¾à¦�à§‡à¦° à¦¸à§‡à¦•à¦¶à¦¨à§‡à¦° à¦¨à¦¿à¦–à§�à¦�à¦¤ à¦…à§�à¦¯à¦¾à¦²à¦¾à¦‡à¦¨à¦®à§‡à¦¨à§�à¦Ÿ, à¦�à¦¬à¦‚ à¦¨à¦¿à¦–à§�à¦�à¦¤ à¦—à§�à¦°à¦¿à¦¡ à¦…à§�à¦¯à¦¾à¦²à¦¾à¦‡à¦¨à¦®à§‡à¦¨à§�à¦Ÿ, à¦¡à¦²à¦¾à¦° à¦¸à¦¿à¦®à§�à¦¬à¦² à¦«à¦°à¦®à§�à¦¯à¦¾à¦Ÿà¦¿à¦‚, à¦®à¦¾à¦¨à¦—à§�à¦²à§‹à¦° à¦œà¦¨à§�à¦¯ à¦®à¦¨à§‹à¦¸à§�à¦ªà§‡à¦¸ à¦«à¦¨à§�à¦Ÿ à¦�à¦¬à¦‚ à¦®à¦¾à¦°à§�à¦œà¦¿à¦¤ à¦¬à¦°à§�à¦¡à¦¾à¦° à¦¸à¦¹ à¦•à¦¾à¦¸à§�à¦Ÿà¦® à¦Ÿà§‡à¦¬à¦¿à¦² à¦«à¦°à¦®à§�à¦¯à¦¾à¦Ÿà¦¿à¦‚ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "35",
    "date": "2026-08-02T15:03",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Resolved Pre-Costing page rendering issues: imported React to fix ReferenceError, added stable unique keys to fallback empty table rows in Yarn, Dyed Yarn, and Embellishment tables, and filtered process types in Fabric Conversion map to prevent returning null elements.",
    "descriptionBn": "à¦ªà§�à¦°à¦¿-à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦ªà§‡à¦œ à¦°à§‡à¦¨à§�à¦¡à¦¾à¦°à¦¿à¦‚ à¦¸à¦®à¦¸à§�à¦¯à¦¾ à¦¸à¦‚à¦¶à§‹à¦§à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§�à¦¸ à¦�à¦°à¦° à¦¦à§‚à¦° à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ React à¦‡à¦®à¦ªà§‹à¦°à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦‡à§Ÿà¦¾à¦°à§�à¦¨, à¦¡à¦¾à¦‡à¦¡ à¦‡à§Ÿà¦¾à¦°à§�à¦¨ à¦“ à¦�à¦®à¦¬à§‡à¦²à¦¿à¦¶à¦®à§‡à¦¨à§�à¦Ÿ à¦Ÿà§‡à¦¬à¦¿à¦²à§‡à¦° à¦«à§�à¦¯à¦¾à¦²à¦¬à§�à¦¯à¦¾à¦• à¦–à¦¾à¦²à¦¿ à¦°à§‹-à¦¤à§‡ à¦‡à¦‰à¦¨à¦¿à¦• à¦•à¦¿ (key) à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦•à¦¨à¦­à¦¾à¦°à§�à¦¸à¦¨ à¦•à¦¸à§�à¦Ÿ à¦®à§�à¦¯à¦¾à¦ªà§‡à¦° à¦¨à¦² à¦�à¦²à¦¿à¦®à§‡à¦¨à§�à¦Ÿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "34",
    "date": "2026-08-02T15:05",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Expanded the Pre-Costing printable sheet width by increasing the outer container constraint from max-w-7xl to max-w-[1500px] and changing the card container to max-w-full, reducing empty space on the sides for wide screen displays.",
    "descriptionBn": "à¦ªà§�à¦°à¦¿-à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿà§‡à¦¬à¦¿à¦² à¦¶à¦¿à¦Ÿà§‡à¦° à¦¸à¦¾à¦‡à¦¡ à¦—à§�à¦¯à¦¾à¦ª à¦•à¦®à¦¾à¦¨à§‹à¦° à¦œà¦¨à§�à¦¯ à¦•à¦¨à§�à¦Ÿà§‡à¦‡à¦¨à¦¾à¦° à¦‰à¦‡à¦¡à¦¥ max-w-7xl à¦¥à§‡à¦•à§‡ à¦¬à¦¾à¦¡à¦¼à¦¿à¦¯à¦¼à§‡ max-w-[1500px] à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦­à§‡à¦¤à¦°à§‡à¦° à¦•à¦¾à¦°à§�à¦¡à¦Ÿà¦¿à¦•à§‡ max-w-full à¦� à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "33",
    "date": "2026-08-02T15:12",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Completely rebuilt the Pre-Costing edit/new entry form view matching the user's screenshot layout and fields exactly: added all basic information inputs (Query No, Query Date, customer buying house, departments, agent/brand, etc.), RMG process loss inputs, Order Style Information row insertion controller (with items mapping itemType, sizeGroup, and checkboxes PRINT/EMB/WASH/SPECIAL), dynamic styles basic grid table rendering matching all columns from the screenshot, and Additional Costing spreadsheet-style input panel with final Save button.",
    "descriptionBn": "à¦ªà§�à¦°à¦¿-à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦ªà§‡à¦œà§‡à¦° à¦�à¦¡à¦¿à¦Ÿ/à¦¨à¦¤à§�à¦¨ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦«à¦°à§�à¦® à¦­à¦¿à¦‰ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿà§‡à¦° à¦®à¦¤à§‹ à¦•à¦°à§‡ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦ªà§�à¦¨à¦°à§�à¦¨à¦¿à¦°à§�à¦®à¦¾à¦£ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à¦•à§‹à¦¯à¦¼à§‡à¦°à¦¿ à¦¨à¦®à§�à¦¬à¦°, à¦•à§‹à¦¯à¦¼à§‡à¦°à¦¿ à¦¡à§‡à¦Ÿ, à¦•à§�à¦°à§‡à¦¤à¦¾à¦° à¦¬à¦¾à¦¯à¦¼à¦¿à¦‚ à¦¹à¦¾à¦‰à¦¸, à¦�à¦œà§‡à¦¨à§�à¦Ÿ/à¦¬à§�à¦°à§�à¦¯à¦¾à¦¨à§�à¦¡ à¦¸à¦¹ à¦¸à¦•à¦² à¦¬à§‡à¦¸à¦¿à¦• à¦¤à¦¥à§�à¦¯ à¦‡à¦¨à¦ªà§�à¦Ÿ, à¦†à¦°à¦�à¦®à¦œà¦¿ à¦ªà§�à¦°à¦¸à§‡à¦¸ à¦²à¦¸ à¦‡à¦¨à¦ªà§�à¦Ÿ, à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦¤à¦¥à§�à¦¯ à¦‡à¦¨à¦ªà§�à¦Ÿ à¦“ à¦²à¦¿à¦™à§�à¦•à§‡à¦œ (PRINT/EMB/WASH/SPECIAL), à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦¶à¦Ÿà§‡à¦° à¦¸à¦¬ à¦•à¦²à¦¾à¦® à¦¸à¦¹ à¦¡à¦¾à¦¯à¦¼à¦¨à¦¾à¦®à¦¿à¦• à¦—à§�à¦°à¦¿à¦¡ à¦Ÿà§‡à¦¬à¦¿à¦² à¦°à§‡à¦¨à§�à¦¡à¦¾à¦°à¦¿à¦‚ à¦�à¦¬à¦‚ à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ à¦–à¦°à¦šà§‡à¦° à¦¸à§�à¦ªà§�à¦°à§‡à¦¡à¦¶à§€à¦Ÿ à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦ªà§�à¦¯à¦¾à¦¨à§‡à¦² à¦¸à¦¹ à¦¸à¦‚à¦°à¦•à§�à¦·à¦£ à¦¬à§‹à¦¤à¦¾à¦®à¥¤"
  },
  {
    "id": "32",
    "date": "2026-08-02T15:20",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Ensured 100% field coverage in the Pre-Costing detail/print sheet: added missing Key Information attributes including M/c Per Line, Production per Hour, Assortment, Fabric Loss Qty, Lead Time, and Sample, and linked dynamic calculation parameters.",
    "descriptionBn": "à¦ªà§�à¦°à¦¿-à¦•à¦¸à§�à¦Ÿà¦¿à¦‚ à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²/à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦¶à¦¿à¦Ÿà§‡ à¦¶à¦¤à¦­à¦¾à¦— à¦«à¦¿à¦²à§�à¦¡ à¦•à¦­à¦¾à¦°à§‡à¦œ à¦¨à¦¿à¦¶à§�à¦šà¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦•à§€ à¦‡à¦¨à¦«à¦°à¦®à§‡à¦¶à¦¨ à¦Ÿà§‡à¦¬à¦¿à¦²à§‡ à¦¬à¦¾à¦¦ à¦ªà§œà¦¾ à¦�à¦Ÿà§�à¦°à¦¿à¦¬à¦¿à¦‰à¦Ÿ à¦¯à§‡à¦®à¦¨ à¦®à§‡à¦¶à¦¿à¦¨ à¦ªà¦¾à¦° à¦²à¦¾à¦‡à¦¨, à¦ªà§�à¦°à§‹à¦¡à¦¾à¦•à¦¶à¦¨ à¦ªà¦¾à¦° à¦†à¦“à§Ÿà¦¾à¦°, à¦…à§�à¦¯à¦¾à¦¸à§‹à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ, à¦«à§‡à¦¬à§�à¦°à¦¿à¦• à¦²à¦¸ à¦•à§‹à§Ÿà¦¾à¦¨à§�à¦Ÿà¦¿à¦Ÿà¦¿, à¦²à¦¿à¦¡ à¦Ÿà¦¾à¦‡à¦® à¦“ à¦¸à§�à¦¯à¦¾à¦®à§�à¦ªà¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "31",
    "date": "2026-08-02T15:49",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-pre-costing",
    "descriptionEn": "Reordered sidebar workflow menus to follow the specified ERP pipeline sequence: Inquiry, Quotation, PO Management, and Pre Costing.",
    "descriptionBn": "à¦¬à¦¾à¦¯à¦¼à¦¿à¦‚ à¦¬à¦¾ à¦‡à¦†à¦°à¦ªà¦¿ à¦¸à¦¿à¦•à§‹à¦¯à¦¼à§‡à¦¨à§�à¦¸ à¦…à¦¨à§�à¦¯à¦¾à¦¯à¦¼à§€ à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦®à§‡à¦¨à§�à¦—à§�à¦²à§‹ à¦°à¦¿à¦…à¦°à§�à¦¡à¦¾à¦° à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à¦‡à¦¨à¦•à§‹à¦¯à¦¼à¦¾à¦°à¦¿, à¦•à§‹à¦Ÿà§‡à¦¶à¦¨, à¦ªà¦¿à¦“ à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦®à§‡à¦¨à§�à¦Ÿ à¦�à¦¬à¦‚ à¦ªà§�à¦°à¦¿-à¦•à¦¸à§�à¦Ÿà¦¿à¦‚à¥¤"
  },
  {
    "id": "30",
    "date": "2026-08-02T16:01",
    "type": "New Addition",
    "module": "Merchandising",
    "link": "/merchandising-bom",
    "descriptionEn": "Created the Bill of Materials (BOM) page: integrated 'Bill of Materials' and 'BOM List' links into the sidebar layout; designed a filterable BOM Sheet Report register with status-colored row highlighting; implemented a high-fidelity Accessories BOM Sheet details view featuring Color/Size breakdown grids, Fabric detail lists, and sewing trim items grouped by style with subtotals.",
    "descriptionBn": "à¦¬à¦¿à¦² à¦…à¦¬ à¦®à§�à¦¯à¦¾à¦Ÿà§‡à¦°à¦¿à¦¯à¦¼à¦¾à¦²à¦¸ (BOM) à¦ªà§‡à¦œ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¸à¦¾à¦‡à¦¡à¦¬à¦¾à¦° à¦²à§‡à¦†à¦‰à¦Ÿà§‡ à¦²à¦¿à¦™à§�à¦• à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡; à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦Ÿà¦¾à¦¸ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦°à¦™à¦¿à¦¨ à¦°à§‹ à¦¬à¦¿à¦¶à¦¿à¦·à§�à¦Ÿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à¦¯à§‹à¦—à§�à¦¯ à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà¦¾à¦° à¦­à¦¿à¦‰ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡; à¦�à¦¬à¦‚ à¦�à¦•à§�à¦¸à§‡à¦¸à¦°à¦¿à¦œ à¦¬à¦¿à¦“à¦�à¦® à¦¶à¦¿à¦Ÿà§‡à¦° à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦­à¦¿à¦‰ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦•à¦¾à¦²à¦¾à¦°/à¦¸à¦¾à¦‡à¦œ à¦¬à§�à¦°à§‡à¦•à¦¡à¦¾à¦‰à¦¨ à¦—à§�à¦°à¦¿à¦¡, à¦«à§‡à¦¬à§�à¦°à¦¿à¦• à¦¡à¦¿à¦Ÿà§‡à¦‡à¦² à¦�à¦¬à¦‚ à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦—à§�à¦°à§�à¦ª à¦•à¦°à¦¾ à¦¸à§�à¦‡à¦‚ à¦Ÿà§�à¦°à¦¿à¦®à¦¸ à¦†à¦‡à¦Ÿà§‡à¦®à§‡à¦° à¦¸à¦¾à¦¬à¦Ÿà§‹à¦Ÿà¦¾à¦² à¦Ÿà§‡à¦¬à¦¿à¦² à¦°à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "29",
    "date": "2026-08-02T16:03",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-bom",
    "descriptionEn": "Upgraded the BOM List view row highlights to soft, professional pastel tints (Approved: soft green, Pending: soft blue, Review: soft amber, Saved: soft grey) and replaced the harsh white-on-colored text with premium high-contrast dark text and stylized inline action eye buttons.",
    "descriptionBn": "à¦¬à¦¿à¦“à¦�à¦® à¦²à¦¿à¦¸à§�à¦Ÿ à¦­à¦¿à¦‰à§Ÿà§‡à¦° à¦…à¦¤à¦¿à¦°à¦¿à¦•à§�à¦¤ à¦‰à¦œà§�à¦œà§�à¦¬à¦² à¦°à¦™ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ à¦®à§ƒà¦¦à§� à¦“ à¦ªà§‡à¦¶à¦¾à¦¦à¦¾à¦° à¦°à¦™à§‡à¦° à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ (à¦�à¦ªà§�à¦°à§�à¦­à¦¡: à¦¸à¦«à¦Ÿ à¦—à§�à¦°à¦¿à¦¨, à¦ªà§‡à¦¨à§�à¦¡à¦¿à¦‚: à¦¸à¦«à¦Ÿ à¦¬à§�à¦²à§�, à¦°à¦¿à¦­à¦¿à¦‰: à¦¸à¦«à¦Ÿ à¦…à§�à¦¯à¦¾à¦®à§�à¦¬à¦¾à¦°, à¦¸à§‡à¦­à¦¡: à¦¸à¦«à¦Ÿ à¦—à§�à¦°à§‡) à¦�à¦¬à¦‚ à¦²à§‡à¦–à¦¾à¦° à¦°à¦™ à¦¸à¦¾à¦¦à¦¾ à¦¥à§‡à¦•à§‡ à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ à¦ªà¦°à¦¿à¦·à§�à¦•à¦¾à¦° à¦—à¦¾à§� à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦“ à¦†à¦•à¦°à§�à¦·à¦£à§€à§Ÿ à¦†à¦‡ (Eye) à¦†à¦‡à¦•à¦¨ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à¦¾à¦Ÿà¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "28",
    "date": "2026-08-02T16:40",
    "type": "New Addition",
    "module": "Merchandising",
    "link": "/merchandising-cad",
    "descriptionEn": "Created the CAD Consumption Update module: implemented a filterable registry list view; built a high-fidelity spreadsheet-style edit/entry form with automatic dozen-wise consumption and wastage weight calculations; and designed a printable sheet featuring style details, marker length/DIA parameters, signature approvals, and marker nest visualizers.",
    "descriptionBn": "à¦•à§�à¦¯à¦¾à¦¡ à¦•à¦¨à¦œà¦¾à¦®à§�à¦ªà¦¶à¦¨ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦®à¦¡à¦¿à¦‰à¦² à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦°à¦¯à§‹à¦—à§�à¦¯ à¦°à§‡à¦œà¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦²à¦¿à¦¸à§�à¦Ÿ à¦­à¦¿à¦‰; à¦¡à¦œà¦¨à¦ªà§�à¦°à¦¤à¦¿ à¦«à§‡à¦¬à§�à¦°à¦¿à¦• à¦•à¦¨à¦œà¦¾à¦®à§�à¦ªà¦¶à¦¨ à¦“ à¦“à§Ÿà§‡à¦¸à§�à¦Ÿà§‡à¦œ à¦“à¦œà¦¨à§‡à¦° à¦¸à§�à¦¬à§Ÿà¦‚à¦•à§�à¦°à¦¿à§Ÿ à¦¹à¦¿à¦¸à¦¾à¦¬ à¦¸à¦®à§�à¦¬à¦²à¦¿à¦¤ à¦¸à§�à¦ªà§�à¦°à§‡à¦¡à¦¶à§€à¦Ÿ à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦�à¦¡à¦¿à¦Ÿ/à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿ à¦«à¦°à§�à¦®; à¦�à¦¬à¦‚ à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦¡à¦¿à¦Ÿà§‡à¦‡à¦²à¦¸, à¦®à¦¾à¦°à§�à¦•à¦¾à¦° à¦¦à§ˆà¦°à§�à¦˜à§�à¦¯/à¦¡à¦¿à¦†à¦‡à¦� à¦ªà§�à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦°, à¦ªà§�à¦°à§Ÿà§‹à¦œà¦¨à§€à§Ÿ à¦¸à§�à¦¬à¦¾à¦•à§�à¦·à¦° à¦“ à¦®à¦¾à¦°à§�à¦•à¦¾à¦° à¦²à§‡à¦†à¦‰à¦Ÿà§‡à¦° à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿ à¦­à¦¿à¦‰ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "27",
    "date": "2026-08-02T16:45",
    "type": "Modify",
    "module": "Merchandising",
    "link": "/merchandising-cad",
    "descriptionEn": "Refined the CAD entry/edit screen into a unified borderless spreadsheet grid editor visually matching the printable sheet, integrated the marker nesting and style card assets from the workspace, and added dark mode styling support.",
    "descriptionBn": "à¦•à§�à¦¯à¦¾à¦¡ à¦�à¦¨à§�à¦Ÿà§�à¦°à¦¿/à¦�à¦¡à¦¿à¦Ÿ à¦¸à§�à¦•à§�à¦°à¦¿à¦¨à¦•à§‡ à¦†à¦°à¦“ à¦ªà§‡à¦¶à¦¾à¦¦à¦¾à¦° à¦“ à¦¨à¦¿à¦–à§�à¦�à¦¤ à¦•à¦°à¦¤à§‡ à¦¸à¦°à¦¾à¦¸à¦°à¦¿ à¦ªà§�à¦°à¦¿à¦¨à§�à¦Ÿà§‡à¦¬à¦¿à¦² à¦¶à¦¿à¦Ÿà§‡à¦° à¦…à¦¨à§�à¦°à§‚à¦ª à¦¬à¦°à§�à¦¡à¦¾à¦°à¦¹à§€à¦¨ à¦¸à§�à¦ªà§�à¦°à§‡à¦¡à¦¶à§€à¦Ÿ à¦—à§�à¦°à¦¿à¦¡ à¦�à¦¡à¦¿à¦Ÿà¦°à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦®à¦¾à¦°à§�à¦•à¦¾à¦° à¦¨à§‡à¦¸à§�à¦Ÿà¦¿à¦‚ à¦“ à¦¸à§�à¦Ÿà¦¾à¦‡à¦² à¦•à¦¾à¦°à§�à¦¡ à¦‡à¦²à¦¾à¦¸à§�à¦Ÿà§�à¦°à§‡à¦¶à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦¡à¦¾à¦°à§�à¦• à¦®à§‹à¦¡ à¦¸à¦¾à¦ªà§‹à¦°à§�à¦Ÿ à¦¨à¦¿à¦¶à§�à¦šà¦¿à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "26",
    "date": "2026-08-02T23:42",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Added the missing 'Working Hour' field to the OT Configuration edit modal under the OT Deductions block; added options for 'Worker', 'HR, Admin and Compliance', 'Admin', and 'Driver' to their respective dropdown selects; updated the default configurations; conditionally rendered the 'Fixed OT Hour' field when OT Type is set to 'Fixed Hour'; reorganized standard shift info settings modal to match legacy fields exactly, and changed action button to 'CREATE'.",
    "descriptionBn": "à¦“à¦Ÿà¦¿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦�à¦¡à¦¿à¦Ÿ à¦®à§‹à¦¡à¦¾à¦²à§‡ à¦“à¦Ÿà¦¿ à¦¡à¦¿à¦¡à¦¾à¦•à¦¶à¦¨ à¦¬à§�à¦²à¦•à§‡à¦° à¦†à¦“à¦¤à¦¾à§Ÿ à¦…à¦¨à§�à¦ªà¦¸à§�à¦¥à¦¿à¦¤ 'Working Hour' à¦«à¦¿à¦²à§�à¦¡à¦Ÿà¦¿ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡; à¦¸à§�à¦¬-à¦¸à§�à¦¬ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà§‡ 'Worker', 'HR, Admin and Compliance', 'Admin' à¦�à¦¬à¦‚ 'Driver' à¦…à¦ªà¦¶à¦¨à¦—à§�à¦²à§‹ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡; à¦¡à¦¿à¦«à¦²à§�à¦Ÿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡; à¦“à¦Ÿà¦¿ à¦Ÿà¦¾à¦‡à¦ª 'Fixed Hour' à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦²à§‡ à¦¶à¦°à§�à¦¤à¦¸à¦¾à¦ªà§‡à¦•à§�à¦·à§‡ 'Fixed OT Hour' à¦‡à¦¨à¦ªà§�à¦Ÿ à¦«à¦¿à¦²à§�à¦¡à¦Ÿà¦¿ à¦¦à§‡à¦–à¦¾à¦¨à§‹à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡; à¦¶à¦¿à¦«à¦Ÿ à¦‡à¦¨à¦«à¦°à¦®à§‡à¦¶à¦¨ à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸ à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦«à¦¿à¦²à§�à¦¡à¦—à§�à¦²à§‹à¦•à§‡ à¦²à¦¿à¦—à§�à¦¯à¦¾à¦¸à¦¿ à¦¬à¦¿à¦¨à§�à¦¯à¦¾à¦¸ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦°à¦¿à¦…à¦°à§�à¦—à¦¾à¦¨à¦¾à¦‡à¦œ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦�à¦¬à¦‚ à¦…à§�à¦¯à¦¾à¦•à¦¶à¦¨ à¦¬à§‹à¦¤à¦¾à¦®à§‡à¦° à¦¨à¦¾à¦® à¦ªà¦°à¦¿à¦¬à¦°à§�à¦¤à¦¨ à¦•à¦°à§‡ 'CREATE' à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "25",
    "date": "2026-08-03T00:13",
    "type": "Modify",
    "module": "Allowance Rate",
    "link": "/configure-compensation?tab=allowance",
    "descriptionEn": "Upgraded text inputs to dropdown select elements in the Allowance Rate (Holiday Rate) configuration modal: converted Company, Area, Employee Type, Department, Section, Designation, Rate For, and Div By Hour fields into fully configured select options to match the legacy screen's look and feel.",
    "descriptionBn": "à¦…à§�à¦¯à¦¾à¦²à¦¾à¦‰à¦¨à§�à¦¸ à¦°à§‡à¦Ÿ (à¦¹à¦²à¦¿à¦¡à§‡ à¦°à§‡à¦Ÿ) à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦Ÿà§‡à¦•à§�à¦¸à¦Ÿ à¦‡à¦¨à¦ªà§�à¦Ÿà¦—à§�à¦²à§‹à¦•à§‡ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿ à¦‰à¦ªà¦¾à¦¦à¦¾à¦¨à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡: à¦�à¦° à¦®à¦§à§�à¦¯à§‡ à¦•à§‹à¦®à§�à¦ªà¦¾à¦¨à¦¿, à¦�à¦°à¦¿à§Ÿà¦¾, à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à§€ à¦Ÿà¦¾à¦‡à¦ª, à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ, à¦¸à§‡à¦•à¦¶à¦¨, à¦¡à§‡à¦œà¦¿à¦—à¦¨à§‡à¦¶à¦¨, à¦°à§‡à¦Ÿ à¦«à¦° à¦�à¦¬à¦‚ à¦¡à¦¿à¦­ à¦¬à¦¾à¦‡ à¦†à¦“à§Ÿà¦¾à¦° à¦«à¦¿à¦²à§�à¦¡à¦—à§�à¦²à§‹à¦•à§‡ à¦ªà§‚à¦°à§�à¦¬à¦¬à¦°à§�à¦¤à§€ à¦¬à¦¿à¦¨à§�à¦¯à¦¾à¦¸ à¦…à¦¨à§�à¦¯à¦¾à§Ÿà§€ à¦¡à§�à¦°à¦ªà¦¡à¦¾à¦‰à¦¨ à¦…à¦ªà¦¶à¦¨à§‡ à¦°à§‚à¦ªà¦¾à¦¨à§�à¦¤à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "24",
    "date": "2026-08-04T11:15",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Upgraded the OT configuration modal to a premium Dialog with a dynamic round slab builder, and added a detailed timings/slabs overview table layout.",
    "descriptionBn": "à¦“à¦Ÿà¦¿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦®à§‹à¦¡à¦¾à¦²à¦Ÿà¦¿à¦•à§‡ à¦�à¦•à¦Ÿà¦¿ à¦ªà§�à¦°à¦¿à¦®à¦¿à§Ÿà¦¾à¦® à¦¡à¦¾à§Ÿà¦¾à¦²à¦—à§‡ à¦‰à¦¨à§�à¦¨à§€à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡ à¦¯à§‡à¦–à¦¾à¦¨à§‡ à¦�à¦•à¦Ÿà¦¿ à¦¡à¦¾à¦‡à¦¨à¦¾à¦®à¦¿à¦• à¦°à¦¾à¦‰à¦¨à§�à¦¡ à¦¸à§�à¦²à§�à¦¯à¦¾à¦¬ à¦¬à¦¿à¦²à§�à¦¡à¦¾à¦° à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦�à¦¬à¦‚ à¦�à¦•à¦Ÿà¦¿ à¦¬à¦¿à¦¸à§�à¦¤à¦¾à¦°à¦¿à¦¤ à¦¸à¦®à§Ÿ à¦“ à¦¸à§�à¦²à§�à¦¯à¦¾à¦¬ à¦¸à¦®à§�à¦¬à¦²à¦¿à¦¤ à¦Ÿà§‡à¦¬à¦¿à¦² à¦²à§‡à¦†à¦‰à¦Ÿ à¦ªà§�à¦°à¦¦à¦¾à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "23",
    "date": "2026-08-04T11:20",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Added conditional fields for Day Name, Time From, and Time To under the Prayer Break option in the OT configuration dialog when set to Yes.",
    "descriptionBn": "à¦“à¦Ÿà¦¿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦¡à¦¾à¦¯à¦¼à¦¾à¦²à¦—à§‡ à¦ªà§‡à¦¯à¦¼à¦¾à¦° à¦¬à§�à¦°à§‡à¦• à¦…à¦ªà¦¶à¦¨ 'Yes' à¦¸à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦²à§‡ à¦¡à§‡ à¦¨à§‡à¦®, à¦Ÿà¦¾à¦‡à¦® à¦«à§�à¦°à¦® à¦�à¦¬à¦‚ à¦Ÿà¦¾à¦‡à¦® à¦Ÿà§� à¦«à¦¿à¦²à§�à¦¡à¦—à§�à¦²à§‹ à¦¦à§‡à¦–à¦¾à¦¨à§‹à¦° à¦œà¦¨à§�à¦¯ à¦•à¦¨à§�à¦¡à¦¿à¦¶à¦¨à¦¾à¦² à¦‡à¦¨à¦ªà§�à¦Ÿ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "22",
    "date": "2026-08-04T11:22",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Increased width of the OT configuration dialog modal from 5xl to 7xl to allow more room for nested configurations.",
    "descriptionBn": "à¦“à¦Ÿà¦¿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦¡à¦¾à¦¯à¦¼à¦¾à¦²à¦— à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦ªà§�à¦°à¦¸à§�à¦¥ 5xl à¦¥à§‡à¦•à§‡ à¦¬à¦¾à¦¡à¦¼à¦¿à¦¯à¦¼à§‡ 7xl à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦•à¦°à§‡ à¦¨à§‡à¦¸à§�à¦Ÿà§‡à¦¡ à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸à¦—à§�à¦²à§‹ à¦†à¦°à§‹ à¦¸à¦¹à¦œà§‡ à¦¬à§�à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¯à¦¾à¦¯à¦¼à¥¤"
  },
  {
    "id": "21",
    "date": "2026-08-04T11:28",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Added conditional fields for Deduction For, Time From, Time To, and Deduct Min under the Dinner/Others Break option in the OT configuration dialog when set to Yes, and included 'Regular' in Deduction For options.",
    "descriptionBn": "à¦“à¦Ÿà¦¿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦¡à¦¾à¦¯à¦¼à¦¾à¦²à¦—à§‡ à¦¡à¦¿à¦¨à¦¾à¦°/à¦†à¦¦à¦¾à¦°à§�à¦¸ à¦¬à§�à¦°à§‡à¦• à¦…à¦ªà¦¶à¦¨ 'Yes' à¦¸à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¹à¦²à§‡ à¦¡à¦¿à¦¡à¦¾à¦•à¦¶à¦¨ à¦«à¦°, à¦Ÿà¦¾à¦‡à¦® à¦«à§�à¦°à¦®, à¦Ÿà¦¾à¦‡à¦® à¦Ÿà§� à¦�à¦¬à¦‚ à¦¡à¦¿à¦¡à¦¾à¦•à§�à¦Ÿ à¦®à¦¿à¦¨ à¦«à¦¿à¦²à§�à¦¡à¦—à§�à¦²à§‹ à¦¦à§‡à¦–à¦¾à¦¨à§‹à¦° à¦œà¦¨à§�à¦¯ à¦•à¦¨à§�à¦¡à¦¿à¦¶à¦¨à¦¾à¦² à¦‡à¦¨à¦ªà§�à¦Ÿ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦�à¦¬à¦‚ à¦¡à¦¿à¦¡à¦¾à¦•à¦¶à¦¨ à¦«à¦° à¦…à¦ªà¦¶à¦¨à§‡ 'Regular' à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "20",
    "date": "2026-08-04T11:31",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Implemented validation checks and marked asterisks for all required fields in the OT configuration dialog when clicking Create/Update.",
    "descriptionBn": "à¦“à¦Ÿà¦¿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦¡à¦¾à¦¯à¦¼à¦¾à¦²à¦—à§‡ à¦•à§�à¦°à¦¿à¦¯à¦¼à§‡à¦Ÿ/à¦†à¦ªà¦¡à§‡à¦Ÿ à¦¬à¦¾à¦Ÿà¦¨à§‡ à¦•à§�à¦²à¦¿à¦• à¦•à¦°à¦¾à¦° à¦¸à¦®à¦¯à¦¼ à¦ªà§�à¦°à¦¯à¦¼à§‹à¦œà¦¨à§€à¦¯à¦¼ à¦«à¦¿à¦²à§�à¦¡à¦—à§�à¦²à§‹à¦° à¦­à§�à¦¯à¦¾à¦²à¦¿à¦¡à§‡à¦¶à¦¨ à¦�à¦¬à¦‚ à¦²à¦¾à¦² à¦¸à§�à¦Ÿà¦¾à¦° à¦šà¦¿à¦¹à§�à¦¨ à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "19",
    "date": "2026-08-04T11:45",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Embedded the OT Configurations Overview table inside the settings dialog to display existing rules and easily load them into the form above via a pencil click.",
    "descriptionBn": "à¦“à¦Ÿà¦¿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦¡à¦¾à¦¯à¦¼à¦¾à¦²à¦—à§‡à¦° à¦­à§‡à¦¤à¦°à§‡ à¦�à¦•à¦Ÿà¦¿ à¦“à¦­à¦¾à¦°à¦­à¦¿à¦‰ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦¬à¦¿à¦¦à§�à¦¯à¦®à¦¾à¦¨ à¦¨à¦¿à§Ÿà¦®à¦—à§�à¦²à§‹ à¦¦à§‡à¦–à¦¾ à¦¯à¦¾à¦¯à¦¼ à¦�à¦¬à¦‚ à¦ªà§‡à¦¨à¦¸à¦¿à¦² à¦†à¦‡à¦•à¦¨ à¦•à§�à¦²à¦¿à¦•à§‡à¦° à¦®à¦¾à¦§à§�à¦¯à¦®à§‡ à¦¸à§‡à¦—à§�à¦²à§‹à¦•à§‡ à¦«à¦°à§�à¦®à§‡à¦° à¦­à§‡à¦¤à¦°à§‡ à¦�à¦¡à¦¿à¦Ÿà§‡à¦° à¦œà¦¨à§�à¦¯ à¦²à§‹à¦¡ à¦•à¦°à¦¾ à¦¯à¦¾à¦¯à¦¼à¥¤"
  },
  {
    "id": "18",
    "date": "2026-08-04T11:46",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Configured separate layouts for Add/Edit rules and Settings modes: hid Start/End Dates and the Configurations table during Add/Edit rule operations, rendering them exclusively in Settings mode.",
    "descriptionBn": "à¦…à§�à¦¯à¦¾à¦¡/à¦�à¦¡à¦¿à¦Ÿ à¦¨à¦¿à§Ÿà¦® à¦�à¦¬à¦‚ à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸ à¦®à§‹à¦¡à§‡à¦° à¦œà¦¨à§�à¦¯ à¦†à¦²à¦¾à¦¦à¦¾ à¦²à§‡à¦†à¦‰à¦Ÿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦° à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡: à¦…à§�à¦¯à¦¾à¦¡/à¦�à¦¡à¦¿à¦Ÿ à¦¨à¦¿à§Ÿà¦® à¦…à¦ªà¦¾à¦°à§‡à¦¶à¦¨à§‡à¦° à¦¸à¦®à§Ÿ à¦¸à§�à¦Ÿà¦¾à¦°à§�à¦Ÿ/à¦�à¦¨à§�à¦¡ à¦¡à§‡à¦Ÿ à¦�à¦¬à¦‚ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¹à¦¾à¦‡à¦¡ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡, à¦¯à¦¾ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸ à¦®à§‹à¦¡à§‡ à¦ªà§�à¦°à¦¦à¦°à§�à¦¶à¦¿à¦¤ à¦¹à¦¬à§‡à¥¤"
  },
  {
    "id": "17",
    "date": "2026-08-04T11:48",
    "type": "Modify",
    "module": "OT Configuration",
    "link": "/configure-time?tab=ot",
    "descriptionEn": "Filtered the OT Configurations Overview history table in the settings modal to only display rules matching the selected Employee Type.",
    "descriptionBn": "à¦¸à§‡à¦Ÿà¦¿à¦‚à¦¸ à¦®à§‹à¦¡à¦¾à¦²à§‡à¦° à¦“à¦Ÿà¦¿ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨ à¦“à¦­à¦¾à¦°à¦­à¦¿à¦‰ à¦¹à¦¿à¦¸à§�à¦Ÿà§�à¦°à¦¿ à¦Ÿà§‡à¦¬à¦¿à¦²à¦Ÿà¦¿ à¦«à¦¿à¦²à§�à¦Ÿà¦¾à¦° à¦•à¦°à§‡ à¦¶à§�à¦§à§� à¦¸à¦¿à¦²à§‡à¦•à§�à¦Ÿà§‡à¦¡ à¦�à¦®à¦ªà§�à¦²à¦¯à¦¼à§€ à¦Ÿà¦¾à¦‡à¦ªà§‡à¦° à¦¨à¦¿à¦¯à¦¼à¦®à¦—à§�à¦²à§‹ à¦¦à§‡à¦–à¦¾à¦¨à§‹à¦° à¦¬à§�à¦¯à¦¬à¦¸à§�à¦¥à¦¾ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "16",
    "date": "2026-08-04T11:58",
    "type": "Modify",
    "module": "Allowance Rate",
    "link": "/configure-compensation?tab=allowance",
    "descriptionEn": "Added missing fields ('Div By Day', 'Calculation For') and 'Basic Salary' option under Based On to the Allowance Rate form, states, interfaces, mock data, and table overview columns.",
    "descriptionBn": "à¦�à¦²à¦¾à¦‰à¦¨à§�à¦¸ à¦°à§‡à¦Ÿ à¦«à¦°à§�à¦®à§‡ à¦…à¦¨à§�à¦ªà¦¸à§�à¦¥à¦¿à¦¤ à¦«à¦¿à¦²à§�à¦¡ ('Div By Day', 'Calculation For') à¦�à¦¬à¦‚ Based On à¦…à¦ªà¦¶à¦¨à§‡ 'Basic Salary' à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡, à¦¯à¦¾ à¦¸à§�à¦Ÿà§‡à¦Ÿ, à¦‡à¦¨à§�à¦Ÿà¦¾à¦°à¦«à§‡à¦¸, à¦®à¦• à¦¡à¦¾à¦Ÿà¦¾ à¦�à¦¬à¦‚ à¦“à¦­à¦¾à¦°à¦­à¦¿à¦‰ à¦Ÿà§‡à¦¬à¦¿à¦² à¦•à¦²à¦¾à¦®à§‡ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "15",
    "date": "2026-08-15T17:35",
    "type": "New",
    "module": "HR Policy",
    "link": "/hr-policy",
    "descriptionEn": "Fully redesigned the HR Policy module to exclusively focus on Policy uploading and management, completely removing Job Description (JD) features. Added a dedicated attachment upload workflow.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦ªà¦²à¦¿à¦¸à¦¿ à¦®à¦¡à¦¿à¦‰à¦²à¦Ÿà¦¿ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£à¦°à§‚à¦ªà§‡ à¦°à¦¿à¦¡à¦¿à¦œà¦¾à¦‡à¦¨ à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡ à¦¯à¦¾à¦¤à§‡ à¦¶à§�à¦§à§�à¦®à¦¾à¦¤à§�à¦° à¦ªà¦²à¦¿à¦¸à¦¿ à¦†à¦ªà¦²à§‹à¦¡ à¦“ à¦®à§�à¦¯à¦¾à¦¨à§‡à¦œà¦®à§‡à¦¨à§�à¦Ÿà§‡à¦° à¦‰à¦ªà¦° à¦«à§‹à¦•à¦¾à¦¸ à¦•à¦°à¦¾ à¦¯à¦¾à¦¯à¦¼, à¦œà¦¬ à¦¡à§‡à¦¸à¦•à§�à¦°à¦¿à¦ªà¦¶à¦¨ (JD) à¦«à¦¿à¦šà¦¾à¦°à¦—à§�à¦²à§‹ à¦¸à¦®à§�à¦ªà§‚à¦°à§�à¦£ à¦¸à¦°à¦¿à¦¯à¦¼à§‡ à¦¦à§‡à¦“à¦¯à¦¼à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤ à¦ªà¦²à¦¿à¦¸à¦¿ à¦…à§�à¦¯à¦¾à¦Ÿà¦¾à¦šà¦®à§‡à¦¨à§�à¦Ÿ à¦†à¦ªà¦²à§‹à¦¡ à¦•à¦°à¦¾à¦° à¦¨à¦¤à§�à¦¨ à¦…à¦ªà¦¶à¦¨ à¦¯à§‹à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤"
  },
  {
    "id": "14",
    "date": "2026-08-15T17:42",
    "type": "New",
    "module": "JD List",
    "link": "/jd-list",
    "descriptionEn": "Created a new dedicated JD List module decoupled from HR Policies. Features a high-fidelity data table and a standardized modal for creating JDs based on Department and Designation.",
    "descriptionBn": "à¦�à¦‡à¦šà¦†à¦° à¦ªà¦²à¦¿à¦¸à¦¿ à¦¥à§‡à¦•à§‡ à¦†à¦²à¦¾à¦¦à¦¾ à¦•à¦°à§‡ à¦¨à¦¤à§�à¦¨ 'JD List' à¦®à¦¡à¦¿à¦‰à¦² à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤ à¦�à¦¤à§‡ à¦¡à¦¿à¦ªà¦¾à¦°à§�à¦Ÿà¦®à§‡à¦¨à§�à¦Ÿ à¦�à¦¬à¦‚ à¦¡à§‡à¦œà¦¿à¦—à¦¨à§‡à¦¶à¦¨à§‡à¦° à¦“à¦ªà¦° à¦­à¦¿à¦¤à§�à¦¤à¦¿ à¦•à¦°à§‡ à¦œà§‡à¦¡à¦¿ (JD) à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¾à¦° à¦œà¦¨à§�à¦¯ à¦�à¦•à¦Ÿà¦¿ à¦Ÿà§‡à¦¬à¦¿à¦² à¦�à¦¬à¦‚ à¦¸à§�à¦Ÿà§�à¦¯à¦¾à¦¨à§�à¦¡à¦¾à¦°à§�à¦¡ à¦®à§‹à¦¡à¦¾à¦² à¦¯à§�à¦•à§�à¦¤ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "13",
    "date": "2026-08-16T15:09",
    "type": "Modify",
    "module": "Merchandising Master Settings",
    "link": "/merchandising-master-settings",
    "descriptionEn": "Fixed a TypeScript error in the YarnCountSpec initial data configuration by correcting object properties.",
    "descriptionBn": "à¦‡à§Ÿà¦¾à¦°à§�à¦¨ à¦•à¦¾à¦‰à¦¨à§�à¦Ÿ à¦¸à§�à¦ªà§‡à¦• (YarnCountSpec)-à¦�à¦° à¦‡à¦¨à¦¿à¦¶à¦¿à§Ÿà¦¾à¦² à¦¡à§‡à¦Ÿà¦¾ à¦•à¦¨à¦«à¦¿à¦—à¦¾à¦°à§‡à¦¶à¦¨à§‡ à¦­à§�à¦² à¦…à¦¬à¦œà§‡à¦•à§�à¦Ÿ à¦ªà§�à¦°à¦ªà¦¾à¦°à§�à¦Ÿà¦¿à¦—à§�à¦²à§‹à¦° à¦•à¦¾à¦°à¦£à§‡ à¦¤à§ˆà¦°à¦¿ à¦¹à¦“à§Ÿà¦¾ à¦�à¦•à¦Ÿà¦¿ à¦Ÿà¦¾à¦‡à¦ªà¦¸à§�à¦•à§�à¦°à¦¿à¦ªà§�à¦Ÿ à¦�à¦°à¦° à¦¸à¦®à¦¾à¦§à¦¾à¦¨ à¦•à¦°à¦¾ à¦¹à§Ÿà§‡à¦›à§‡à¥¤"
  },
  {
    "id": "12",
    "date": "2026-08-18T08:42",
    "type": "New",
    "module": "Monthly Salary Process",
    "link": "/monthly-salary-process",
    "descriptionEn": "Added the Advanced Report Actions accordion to the Monthly Salary Process page, enabling dynamic smart printing for processed salary records directly in Pay Slip templates (English & Bangla) precisely matching single-column A4 format.",
    "descriptionBn": "Monthly Salary Process পেজে Advanced Report Actions অপশন যোগ করা হয়েছে, যার মাধ্যমে প্রসেস করা স্যালারি রেকর্ডগুলো থেকে সরাসরি Pay Slip (ইংরেজি ও বাংলা) প্রিন্ট করা যাবে, যা সিঙ্গেল-কলাম A4 ফরম্যাটে সাজানো হয়েছে।"
  },
  {
    "id": "11",
    "date": "2026-08-20T10:23",
    "type": "Feature Update",
    "module": "Payroll Advance",
    "link": "/payroll-advance",
    "descriptionEn": "Added detailed requisition view modal mimicking the salary advance requisition layout. Allows comprehensive view of employee info, requested amount, advance history, and multi-level approval workflows.",
    "descriptionBn": "Payroll Advance-এ বিস্তারিত রিকুইজিশন ভিউ মোডাল যুক্ত করা হয়েছে, যেখানে এমপ্লয়ির তথ্য, হিস্ট্রি এবং অ্যাপ্রুভাল ওয়ার্কফ্লো দেখা যায়।"
  },
  {
    "id": "10",
    "date": "2026-08-20T10:35",
    "type": "UI Update",
    "module": "Payroll Advance",
    "link": "/payroll-advance",
    "descriptionEn": "Redesigned the Approval Workflow and Comments sections in the Payroll Advance details view for a cleaner, more interactive experience.",
    "descriptionBn": "পে-রোল অ্যাডভান্স ডিটেইলস ভিউতে অ্যাপ্রুভাল ওয়ার্কফ্লো এবং কমেন্টস সেকশনের ডিজাইন আরও সুন্দর এবং ইন্টারঅ্যাক্টিভ করা হয়েছে।"
  },
  {
    "id": "9",
    "date": "2026-08-20T10:53",
    "type": "UI Update",
    "module": "Advance Approval",
    "link": "/approve-advance",
    "descriptionEn": "Copied the detailed requisition view modal from Payroll Advance to the Advance Approval page for a consistent and improved approval experience.",
    "descriptionBn": "পে-রোল অ্যাডভান্স থেকে বিস্তারিত রিকুইজিশন ভিউ মোডালটি অ্যাডভান্স অ্যাপ্রুভাল পেজে কপি করা হয়েছে, যাতে অ্যাপ্রুভালের অভিজ্ঞতা আরও ভালো এবং সামঞ্জস্যপূর্ণ হয়।"
  },
  {
    "id": "8",
    "date": "2026-08-23T11:26",
    "type": "Modify",
    "module": "Evaluation",
    "link": "/increment",
    "descriptionEn": "Removed all old evaluation pages and horizontal/sub-tab navigation bars. Reorganized the Evaluation module with 5 clean standalone page workspaces: Increment (Single), Increment (Multi), Proposed Increment, Increment Report, and Increment History.",
    "descriptionBn": "মূল্যায়ন মডিউলের পুরাতন পেজ এবং সকল অনুভূমিক/সাব-ট্যাব বার মুছে ফেলা হয়েছে। মডিউলটিকে ৫টি পরিষ্কার ও স্বতন্ত্র পেজে পুনর্বিন্যাস করা হয়েছে: Increment (Single), Increment (Multi), Proposed Increment, Increment Report, এবং Increment History।"
  },
  {
    "id": "7",
    "date": "2026-08-23T11:54",
    "type": "New Feature",
    "module": "Evaluation",
    "link": "/increment-multiple",
    "descriptionEn": "Fully implemented the new Increment (Multi) page workspace, including query filter consoles, search modal for employee IDs, dynamic calculations by percentage and fixed value, and interactive spreadsheet datagrid actions.",
    "descriptionBn": "নতুন Increment (Multi) পেজ ওয়ার্কস্পেসটি সম্পূর্ণ বাস্তবায়ন করা হয়েছে, যার মধ্যে কুয়েরি ফিল্টার কনসোল, এমপ্লয়ি আইডির জন্য সার্চ মডাল, পারসেন্টেজ ও ফিক্সড ভ্যালুর ডায়নামিক ক্যালকুলেশন এবং ইন্টারেক্টিভ স্প্রেডশীট ডেটাগ্রিড অন্তর্ভুক্ত রয়েছে।"
  },
  {
    "id": "6",
    "date": "2026-08-23T12:03",
    "type": "New Feature",
    "module": "Personnel",
    "link": "/set-hod",
    "descriptionEn": "Added a new Set HOD configuration page and navigation links under Personnel Info. This page enables users to assign and manage Head of Department (HOD) roles bulky department-wise with active/inactive historical registry logs.",
    "descriptionBn": "পার্সোনেল ইনফোর অধীনে একটি নতুন Set HOD কনফিগারেশন পেজ এবং নেভিগেশন লিংক যুক্ত করা হয়েছে। এই পেজটির মাধ্যমে ব্যবহারকারীরা সক্রিয়/নিষ্ক্রিয় হিস্টোরিক্যাল রেজিস্ট্রি লগসহ বাল্ক বা বিভাগ-ভিত্তিক হেড অফ ডিপার্টমেন্ট (HOD) রোল নির্ধারণ ও পরিচালনা করতে পারবেন।"
  },
  {
    "id": "5",
    "date": "2026-08-23T13:28",
    "type": "New Feature",
    "module": "Personnel",
    "link": "/set-manager",
    "descriptionEn": "Added a new Set Manager page under Personnel Info to bulk assign reporting managers to employees. Features a master staff manager directory and a bulk assignment console modal with department/designation checklists.",
    "descriptionBn": "কর্মচারীদের জন্য বাল্ক বা এককালীন রিপোর্টিং ম্যানেজার নির্ধারণ করার জন্য পার্সোনেল ইনফোর অধীনে নতুন Set Manager পেজ যুক্ত করা হয়েছে। পেজটিতে একটি মাস্টার স্টাফ ম্যানেজার ডিরেক্টরি এবং ডিপার্টমেন্ট/ডেসিগনেশন ফিল্টার ফিল্টারসহ বাল্ক অ্যাসাইনমেন্ট মডাল কনসোল যুক্ত করা হয়েছে।"
  },
  {
    "id": "4",
    "date": "2026-08-23T14:22",
    "type": "New Feature",
    "module": "Personnel",
    "link": "/notice",
    "descriptionEn": "Added a new Notice Board route page and sidebar navigation links. Features a live search directory of notices, rich text circular content configurations using jodit-react, circular format exports, and a premium official letterhead document circular view overlay.",
    "descriptionBn": "একটি নতুন Notice Board পেজ এবং সাইডবার নেভিগেশন লিংক যুক্ত করা হয়েছে। পেজটিতে নোটিসের লাইভ সার্চ ডিরেক্টরি, jodit-react এর মাধ্যমে রিচ টেক্সট সার্কুলার কনফিগারেশন, বিভিন্ন সার্কুলার ফাইল এক্সপোর্ট এবং একটি আধুনিক কর্পোরেট লেটারহেড ডকুমেন্টের মাধ্যমে সার্কুলার ভিউ ওভারলে যুক্ত করা হয়েছে।"
  },
  {
    "id": "3",
    "date": "2026-08-24T15:40",
    "type": "UI Update",
    "module": "Employee Job Card",
    "link": "/employee-job-card",
    "descriptionEn": "Redesigned Employee Job Card with modern header styling and repositioned Attendance Summary Panel. Rebuilt top filter cards and statistics grids.",
    "descriptionBn": "এমপ্লয়ি জব কার্ড পেজটিকে নতুনভাবে ডিজাইন করা হয়েছে, যার মধ্যে আধুনিক হেডার স্টাইলিং এবং অ্যাটেনডেন্স সামারি প্যানেলটি পুনরায় পজিশন করা অন্তর্ভুক্ত।"
  },
  {
    "id": "2",
    "date": "2026-09-08T15:15",
    "type": "Feature Update",
    "module": "SSP Requisition",
    "link": "/ssp-general-product-budget-request",
    "descriptionEn": "Converted the Product field into an interactive searchable dropdown with custom entry support across both General Product and ICT Product budget request forms. Enhanced the Add Item mechanism with automated quantity unit formatting, optional justification fallback, and seamless ERP table queuing.",
    "descriptionBn": "জেনারেল প্রোডাক্ট এবং আইসিটি প্রোডাক্ট বাজেট রিকুইজিশন উভয় পেজে প্রোডাক্ট ইনপুট ফিল্ডটিকে ইন্টারঅ্যাক্টিভ সার্চেবল ড্রপডাউনে রূপান্তর করা হয়েছে। এছাড়াও আইটেম যুক্ত করার প্রক্রিয়ায় স্বয়ংক্রিয় ইউনিট ফরম্যাটিং ও ফলব্যাক সাপোর্ট যুক্ত করে সমাধান নিশ্চিত করা হয়েছে।"
  },
  {
    "id": "1",
    "date": "2026-09-08T15:17",
    "type": "UI / UX",
    "module": "SSP Requisition",
    "link": "/ssp-general-product-budget-request",
    "descriptionEn": "Polished the SearchableSelect component with a dedicated 'underline' variant! Fixed the bottom border line curvature bug to produce a crisp 1px straight underline, removed distracting icons in trigger state, and aligned chevron arrows perfectly with standard form select elements.",
    "descriptionBn": "SearchableSelect কম্পোনেন্টটিতে একটি নিবেদিত 'underline' ভ্যারিয়েন্ট যোগ করা হয়েছে! ইউ-শেপ বাঁকানো লাইনের বাগটি সমাধান করে খাড়া ১ পিক্সেল বটম বর্ডার লাইন নিশ্চিত করা হয়েছে এবং অন্যান্য স্ট্যান্ডার্ড ড্রপডাউন সিলেক্টের সাথে হুবহু সামঞ্জস্যপূর্ণ করা হয়েছে।"
  }
];
