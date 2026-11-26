# Dashboard Maker — ডেভেলপারের জন্য বিস্তারিত কাজের প্রক্রিয়া (Detailed Process Guide)

এই ডকুমেন্টটি **CRIPTON HRIS Dashboard Maker (Final HRIS)**-এর ব্যাকএন্ড এবং ডাটাবেজ ইন্টিগ্রেশন করার জন্য ডেভেলপারদের পূর্ণাঙ্গ গাইড। এতে পুরো ফ্লো, ডাটা স্ট্রাকচার, প্রতিটি কার্ডের হিসাবের নিয়ম, ফিল্টারিং, ড্রিল-ডাউন, পারমিশন ও পারফরম্যান্স সবকিছু বিস্তারিত ও সহজভাবে দেওয়া হয়েছে।

---

## ১. পুরো সিস্টেম কীভাবে কাজ করে (End-to-End Flow)

1. **ইউজার ড্যাশবোর্ড খুললে (Initial Load):**
   - ফ্রন্টএন্ড প্রথমে ব্যাকএন্ড থেকে ইউজারের সেভ করা টেমপ্লেট লিস্ট এবং কোন টেমপ্লেটটি `Active Main` হিসেবে সেট করা আছে তা নিয়ে আসে।
   - টেমপ্লেট পাওয়ার পর গ্রিডে কার্ডগুলো `sortOrder` (সিরিয়াল) এবং `colSpan` (`25%`, `33%`, `50%`, `67%`, `100%`) অনুযায়ী সাজানো হয়।
2. **প্রতিটি কার্ডের ডেটা লোড (Parallel Fetching):**
   - সব কার্ডের ডেটা একসাথে না এনে, **প্রতিটি কার্ড আলাদা আলাদাভাবে** ব্যাকএন্ডের কাছে নিজের ডেটা চায়।
   - ডেটা আসার সময় ওই কার্ডে লোডিং (Skeleton) দেখাবে; কোনো একটি কার্ড স্লো হলে বাকি কার্ডগুলো আটকে থাকবে না।
3. **ইউজার কার্ড কাস্টমাইজ করলে (Edit & Save):**
   - ইউজার কার্ড ড্র্যাগ করে সিরিয়াল বদলালে, সাইজ (`33%` / `50%` / `67%` / `100%`) পরিবর্তন করলে, চিপ অন/অফ বা রিঅর্ডার করলে, অথবা `Scope` (`Self` / `Area` / `Department`) বদলালে — **Save** বাটনে ক্লিক করার সাথে সাথে পুরো লেআউট ও সেটিংস ডাটাবেজে আপডেট হবে।

---

## ২. ডাটাবেজে কী কী তথ্য সেভ রাখতে হবে

### ক) টেমপ্লেট টেবিল (Dashboard Template)
প্রতিটি টেমপ্লেটের জন্য নিচের তথ্যগুলো থাকবে:
- **Template ID:** ইউনিক আইডি (যেমন: `tpl_final_hris` বা ইউজারের বানানো নতুন আইডি)।
- **User ID:** কোন ইউজারের টেমপ্লেট (`Default` টেমপ্লেটের ক্ষেত্রে সবার জন্য কমন থাকবে)।
- **Title & Description:** ড্যাশবোর্ডের নাম ও সংক্ষিপ্ত বিবরণ।
- **Is Default:** সিস্টেমের ডিফল্ট টেমপ্লেট কি না (ডিফল্ট টেমপ্লেট ডিলিট করা যাবে না, তবে ক্লোন বা এডিট করা যাবে)।
- **Is Active Main:** লগইন করলে হোমপেজে কোন ড্যাশবোর্ডটি প্রথমে ওপেন হবে (`true`/`false` — প্রতি ইউজারের জন্য কেবল একটিই `true` থাকবে)।

### খ) উইজেট/কার্ড টেবিল (Template Widgets)
প্রতিটি টেমপ্লেটের ভেতরে থাকা কার্ডগুলোর জন্য নিচের তথ্যগুলো থাকবে:
- **Widget ID:** কার্ডের ইউনিক আইডি।
- **Template ID:** কোন টেমপ্লেটের অংশ।
- **Component ID:** কার্ডের ধরন (যেমন: `hr_quick_stats`, `hr_increment_yearly`)।
- **Custom Title:** ইউজার কার্ডের নাম রিনেম করলে সেটি সেভ থাকবে (না করলে ডিফল্ট নাম দেখাবে)।
- **Sort Order:** গ্রিডে কার্ডের অবস্থান (`0, 1, 2...`) — ড্র্যাগ অ্যান্ড ড্রপ করে পরিবর্তন করা হয়।
- **Col Span (Width):** কার্ডের প্রস্থ — শুধুমাত্র `3` (25%), `4` (33%), `6` (50%), `8` (67%), `12` (100%) গ্রহণযোগ্য।
- **Settings (JSON / Object):**
  - `scope`: `"personal"` (`Self`) | `"area"` (`Area`) | `"department"` (`Department`)
  - `areas`: সিলেক্ট করা Area-র নাম/আইডি (Single-select হিসেবে কাজ করবে)
  - `departments`: সিলেক্ট করা ১ বা একাধিক Department-এর তালিকা (Multi-select)
  - `period`: `"month"` বা `"year"` (যেমন Talent Acquisition বা Payroll-এর জন্য)
  - `enabledChips`: কোন কোন চিপ **অন** আছে এবং **কোন সিরিয়ালে** সাজানো আছে (অ্যারে-র অর্ডারটাই কার্ডের চিপ পজিশন নির্ধারণ করবে)।

---

## ৩. ডেটা আনার প্রক্রিয়া (Unified Widget Data Engine)

২১টি কার্ডের জন্য আলাদা আলাদা ২১টি API না বানিয়ে **একটি মাত্র ইউনিফাইড API** থাকবে:

### ফ্রন্টএন্ড যা পাঠাবে (Request):
- `componentId` (কোন কার্ডের ডেটা লাগবে)
- `scope` (`personal` / `area` / `department`)
- `areas` (Area ফিল্টারের মান)
- `departments` (Department ফিল্টারের মান)
- `period` (সময়কাল — মাসিক না বার্ষিক)
- `enabledChips` (কোন চিপগুলো অন আছে)

### ব্যাকএন্ড যেভাবে প্রসেস করবে (Step-by-Step):
1. **Authentication & Permission Check (সবচেয়ে জরুরি):**
   - টোকেন/সেশন থেকে লগইন করা ইউজারের পরিচয় ও রোল বের করবে।
   - ইউজার যদি `Area` বা `Department` সিলেক্ট করে, ব্যাকএন্ড চেক করবে তার ওই Area/Department দেখার পারমিশন আছে কি না। পারমিশন না থাকলে অনুমোদিত স্কোপের মধ্যেই ডেটা সীমাবদ্ধ রাখবে (অথবা `403` দেবে)।
2. **Scope Filter তৈরি (Shared Helper):**
   - সব কার্ডের কুয়েরিতে একই নিয়ম কাজ করবে:
     - **`Self` (`personal`):** শুধু ওই ইউজারের নিজের Employee ID দিয়ে ফিল্টার হবে।
     - **`Area` (`area`):** সিলেক্ট করা নির্দিষ্ট একটি Area/Zone-এর সব কর্মীর ডেটা ফিল্টার হবে।
     - **`Department` (`department`):** সিলেক্ট করা এক বা একাধিক Department-এর সব কর্মীর ডেটা যোগ হয়ে আসবে।
3. **Selective Chip Query (Optimization):**
   - `enabledChips`-এ যে চিপগুলো **বন্ধ (Disabled)** আছে, সেগুলোর হিসাব করার দরকার নেই। শুধু অন থাকা চিপগুলোর অ্যাগ্রিগেশন চালালে ডাটাবেজের ওপর লোড কমবে।
4. **Response পাঠানো:**
   - ফ্রন্টএন্ডের চাহিদা অনুযায়ী প্রতিটি চিপের `value`, `percentage`, `subtext` এবং চার্টের জন্য `chartData` অ্যারে রিটার্ন করবে।

---

## ৪. Final HRIS-এর ২১টি কার্ডের হিসাব ও বিজনেস লজিক

### গ্রুপ ক: Workforce & Attendance (জনবল ও উপস্থিতি)
1. **Workforce Information (`hr_workforce_info`)**
   - **কী দেখায়:** Total Man Power, Worker, Staff, Resign, Lefty, ML (Maternity Leave), Others ইত্যাদি।
   - **উৎস:** Active Employee Master এবং চলতি মাসের Separation/Leave স্ট্যাটাস।
2. **Total Manpower Breakdown (`hr_total_manpower_chart`)**
   - **কী দেখায়:** ডিপার্টমেন্ট অনুযায়ী জনবলের বার চার্ট (যেমন: Sewing, QC, Finishing, Wash, Cutting, Packing)।
   - **শর্ত:** বারের উপরে মোট সংখ্যা (Label) থাকবে।
3. **Workforce Presence & Attendance Stats (`hr_quick_stats`)**
   - **কী দেখায়:** Total Workforce, Worker Present/Absent, Staff Present/Absent, Holiday, Late Worker/Staff, Leave ইত্যাদি (মোট ২১টি চিপ অপশন)।
   - **উৎস:** Daily Attendance Summary (`att_date = আজকের তারিখ`) + Employee Master।
4. **Attendance Distribution Chart (`hr_attendance_pie`)**
   - **কী দেখায়:** ডোনাট চার্ট + মাঝখানে মোট Present `%` + পাশে প্রতিটি স্ট্যাটাসের সংখ্যা ও `%`।
5. **On-Time vs Late Entry Trend (`hr_ontime_vs_late_chart`)**
   - **কী দেখায়:** গত ৬ মাসের মাসভিত্তিক On-Time বনাম Late বার চার্ট।
6. **Late vs Absent Analysis (`hr_late_absent_pie`)**
   - **কী দেখায়:** Grace Period (<15m), Heavy Delay (>30m), Uninformed Absent, Medical Absent-এর ডোনাট চার্ট।

### গ্রুপ খ: Requisitions, Budget & Separation
7. **Requisitions & Messages Summary (`hr_requisitions_summary`)**
   - **কী দেখায়:** Total Requisitions, Pending Requisitions, Unread Messages, **My Requisition Pending**, **My Approval Pending**, Approved Requisitions।
   - **ক্লিক অ্যাকশন:** ফ্রন্টএন্ডে ক্লিক করলে যথাক্রমে My Requisition (`/ssp-my-requisition`), Pending Approvals (`/pending-approvals`), ও Messenger (`/messenger`)-এ নিয়ে যায় — তাই ব্যাকএন্ড থেকে লাইভ কাউন্ট রিটার্ন করবে।
8. **Manpower Budget vs Actual On Board (`hr_manpower_budget_vs_onboard`)**
   - **কী দেখায়:** Budgeted MP, Actual On-Board, Vacancy/Gap, Fill Rate%।
   - **গুরুত্বপূর্ণ নিয়ম:** কার্ডের মূল বড় সংখ্যাটি হবে **Amount (৳)** এবং তার নিচে ছোট করে **Headcount** দেখাবে। ডিপার্টমেন্ট চার্টেও Amount (৳) ও Tooltip-এ Amount + Count দুটোই থাকবে।
9. **Separation & Turnover (`hr_separation_turnover`)**
   - **কী দেখায়:** Total Separation, Turnover Rate%, Resign, Lefty, Terminated, Retired এবং ৬ মাসের Resign vs Lefty ট্রেন্ড চার্ট।

### গ্রুপ গ: Overtime, Recruitment & Yearly Compensation
10. **OT Budget Comparison (`hr_ot_budget_comparison`)**
    - **কী দেখায়:** Budget Amt (৳), Actual OT (৳), Request OT (৳), Diff (Bud-Act), Diff (Bud-Req) এবং এর বার চার্ট।
11. **OT Requisition vs Consumption (`hr_ot_requisition_vs_consumption`)**
    - **কী দেখায়:** OT Requisition (Hours + Amount ৳), Actual Punch OT (Hours + Amount ৳), Variance এবং লাইন/সেকশনভিত্তিক বার চার্ট।
12. **Overtime Payout & Hours Trend (`hr_ot_bar_chart`)**
    - **কী দেখায়:** সাপ্তাহিক (Sat–Fri) OT Hours এবং OT Amount (৳) একসাথে ডুয়াল বার চার্টে।
13. **Talent Acquisition Pipeline (`hr_recruitment_pipeline`)**
    - **কী দেখায়:** Openings, Screened, Interviewed, Hired/Offered (Default `Yearly` মোড, চাইলে Monthly সুইচ করা যাবে)।
14. **Headcount Growth & Turnover (`hr_headcount_trend`)**
    - **কী দেখায়:** মাসভিত্তিক হেডকাউন্ট গ্রোথ এরিয়া/লাইন চার্ট।
15. **Yearly Payroll Disbursement & Salary (`acc_payroll_payout`)**
    - **কী দেখায়:** সারা বছরের (Jan–Dec) বেতন খরচের বার চার্ট এবং Gross Payroll, Net Paid, Deductions/Tax সামারি।
16. **Increment Yearly (`hr_increment_yearly`)**
    - **কী দেখায়:** জানুয়ারি থেকে ডিসেম্বর পর্যন্ত কোন মাসে কত টাকা (৳) ইনক্রিমেন্ট হয়েছে তার বার চার্ট, স্টাফ সংখ্যা এবং মোট ইনক্রিমেন্ট সামারি।

### গ্রুপ ঘ: Personal Workspace & Team Directory
17. **Leave Balance Overview (`hr_leave_balance_card`)**
    - **কী দেখায়:** Casual, Sick, Earned, Maternity, Comp Off, Without Pay — প্রতিটির মোট, ব্যবহৃত, অবশিষ্ট ও `%` প্রোগ্রেস।
18. **Upcoming Events & Birthdays (`hr_upcoming_events`)**
    - **কী দেখায়:** কর্মীদের জন্মদিন, চাকরির বর্ষপূর্তি (Milestone), আসন্ন ইন্টারভিউ ও সরকারি ছুটি/মিটিং।
19. **Notice Board & Circulars (`hr_notice_board`)**
    - **কী দেখায়:** সর্বশেষ অফিশিয়াল নোটিশ (Holiday, Meeting, Policy) ও সার্কুলার রেফারেন্স নম্বর।
20. **Recent Messages & Team Inbox (`hr_messages_feed`)**
    - **কী দেখায়:** লগইন করা ইউজারের সর্বশেষ মেসেজ ও Unread কাউন্ট।
21. **My Team Members (`hr_team_members`)**
    - **কী দেখায়:** টিম মেম্বারদের নাম, আইডি, পদবি, ছবি, অনলাইন স্ট্যাটাস, ফোন নম্বর ও ইমেইল।

---

## ৫. Hierarchy Drill-Down প্রক্রিয়া (`Area → Dept → Section → Unit → Line`)

- যেকোনো কার্ডের **Drill Down** বাটনে বা KPI চিপে ক্লিক করলে একটি মডাল ওপেন হয়।
- ব্যাকএন্ডে **একটি মাত্র Drill-Down API** থাকবে, যা `level` ও `parentId` অনুযায়ী নিচের ধাপগুলোতে নামবে:
  1. `level = department` → সব অনুমোদিত ডিপার্টমেন্টের সামারি দেখাবে।
  2. কোনো ডিপার্টমেন্টে ক্লিক করলে → `level = section` ও `parentId = deptId` পাঠাবে, ওই ডিপার্টমেন্টের সব সেকশন দেখাবে।
  3. সেকশনে ক্লিক করলে → `level = unit` ও `parentId = sectionId` পাঠাবে, সব ইউনিট দেখাবে।
  4. ইউনিটে ক্লিক করলে → `level = line` ও `parentId = unitId` পাঠাবে, লাইনভিত্তিক চূড়ান্ত হিসাব দেখাবে।

---

## ৬. পারফরম্যান্স, ক্যাশিং ও এজ কেস (Edge Cases)

1. **ক্যাশিং (Short-TTL Cache):**
   - ড্যাশবোর্ডে ২১টি কার্ড থাকায় বারবার রিফ্রেশ করলে ডাটাবেজে চাপ পড়তে পারে।
   - তাই `componentId + scope + areaId + deptIds + period + date` মিলিয়ে একটি ক্যাশ-কী (Cache Key) বানিয়ে **৩০ সেকেন্ড থেকে ২ মিনিট** পর্যন্ত রেজাল্ট ক্যাশ করে রাখা উচিত।
2. **Zero Division & Empty Data:**
   - কোনো নতুন ডিপার্টমেন্টে কর্মী `0` হলে `%` হিসাব করার সময় যেন `NaN` বা `Division by Zero` এরর না হয় (`0%` রিটার্ন করবে)।
   - কোনো মাসে ডাটা না থাকলে খালি স্ট্রিং বা ক্র্যাশ না করে `0` ভ্যালুসহ ১২ মাসের কাঠামো পাঠাবে।
3. **Partial Error Isolation:**
   - একটি কার্ডের কুয়েরিতে সমস্যা হলে শুধু সেই কার্ডটি Error/Retry দেখাবে, পুরো ড্যাশবোর্ড ক্র্যাশ করবে না।

---

## ৭. ডেভেলপারের কাজের সিরিয়াল (Implementation Checklist)

- [ ] **ধাপ ১:** `dashboard_templates` এবং `dashboard_template_widgets` টেবিল তৈরি ও Template Save/Load API চালু করা।
- [ ] **ধাপ ২:** `Shared Scope Filter` (`personal` / `area` / `department`) ও ইউজার পারমিশন ভ্যালিডেশন তৈরি করা।
- [ ] **ধাপ ৩:** Unified `widget-data` এন্ডপয়েন্ট বানিয়ে প্রথমে টপ কার্ডগুলো (`Workforce Info`, `Quick Stats`, `Attendance Pie`, `Requisitions Summary`) কানেক্ট করা।
- [ ] **ধাপ ৪:** Manpower Budget, Separation, OT, Payroll, Yearly Increment ও HR Analytics চার্টগুলো কানেক্ট করা।
- [ ] **ধাপ ৫:** Workspace কার্ডগুলো (`Leave Balance`, `Notice Board`, `Messages`, `Upcoming`, `Team Members`) কানেক্ট করা।
- [ ] **ধাপ ৬:** `Hierarchy Drill-Down` (`Department → Section → Unit → Line`) API সম্পন্ন করা ও ক্যাশিং যোগ করা।
