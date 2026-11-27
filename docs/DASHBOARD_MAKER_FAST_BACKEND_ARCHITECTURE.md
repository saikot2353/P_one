# CRIPTON HRIS Dashboard Maker — High-Speed Full Backend Architecture (Easy & Detailed Guide)

এই ডকুমেন্টটি **Dashboard Maker (Final HRIS — 21 Components)**-এর ব্যাকএন্ড বানানোর জন্য একদম সহজ, বিস্তারিত এবং প্র্যাকটিক্যাল আর্কিটেকচার গাইড। এখানে প্রতিটি ধাপে **"কীভাবে বানাবেন"** এবং **"কেন এটা দিলে সিস্টেম সুপার ফাস্ট হবে"** তা পরিষ্কারভাবে ব্যাখ্যা করা হয়েছে।

---

## ১. সমস্যা ও সমাধানের মূল ধারণা (কেন ড্যাশবোর্ড স্লো হয়, আর কীভাবে ফাস্ট করবো?)

একটি HRIS ড্যাশবোর্ডে ২১টি কার্ড আছে। যদি প্রতিটি কার্ড খোলার সাথে সাথে ১০,০০০+ কর্মীর Attendance, Payroll, OT ও Separation টেবিল স্ক্যান করে, তাহলে পেজ লোড হতে **৫–১৫ সেকেন্ড** লাগবে এবং সার্ভার হ্যাং করবে।

### আমাদের ৩-স্তরের সমাধান (3-Layer Speed Formula):
1. **স্তর ১ — Redis Cache (`< 20 ms`):** আগে থেকে হিসাব করা রেজাল্ট ৩০ সেকেন্ড – ১৫ মিনিট পর্যন্ত মেমোরিতে থাকবে। ইউজার পেজ খুললেই সাথে সাথে দেখাবে।
2. **স্তর ২ — Pre-Aggregated Rollup Tables (`< 10 ms`):** ১০,০০০ কর্মীর প্রতিদিনের হিসাব আগে থেকেই ছোট সামারি টেবিলে যোগ করে রাখা হবে, যাতে কুয়েরি মাত্র ২০–৫০টি রো পড়ে রেজাল্ট দিতে পারে।
3. **স্তর ৩ — Parallel + Selective Loading:** পুরো পেজ একসাথে না আটকে প্রতিটি কার্ড আলাদাভাবে লোড হবে, আর ইউজার যে চিপগুলো **বন্ধ (Unchecked)** রেখেছে সেগুলোর হিসাব ব্যাকএন্ড করবেই না।

---

## ২. পুরো রিকোয়েস্ট লাইফসাইকেল (Step-by-Step Flow)

```
ইউজার ড্যাশবোর্ড ওপেন করলো
   │
   ├─► (১) GET /api/dashboards
   │       └─► ইউজারের সেভ করা Layout, Serial, Size (33%/50%/67%/100%),
   │           Chips ও Rename করা নাম নিয়ে আসে।
   │
   └─► (২) প্রতিটি কার্ড আলাদা আলাদা কল করে: POST /api/dashboard/widget-data
           │
           ├─► [Step A] JWT Token থেকে User Permission চেক (Self / Area / Dept)
           ├─► [Step B] Redis Cache চেক ──► পেলে সাথে সাথে Return (< 20 ms!)
           └─► [Step C] Cache Miss হলে:
                   ├─► Rollup Table / Indexed SQL চালায় (শুধু enabledChips নিয়ে)
                   ├─► রেজাল্ট Redis-এ সেভ করে
                   └─► ফ্রন্টএন্ডে JSON পাঠায়
```

---

## ৩. ডাটাবেজ ডিজাইন (Database Schema)

### ৩.১ লেআউট ও কাস্টমাইজেশন টেবিল (২টি টেবিল)

#### টেবিল ১: `dashboard_templates`
ইউজারের টেমপ্লেট তালিকা এবং কোনটা মেইন ড্যাশবোর্ড হিসেবে অ্যাক্টিভ তা রাখে।
```sql
CREATE TABLE dashboard_templates (
  id              VARCHAR(64) PRIMARY KEY,
  user_id         VARCHAR(64) NULL,          -- NULL মানে সিস্টেম ডিফল্ট (যেমন: Final HRIS)
  title           VARCHAR(150) NOT NULL,
  description     TEXT NULL,
  category        VARCHAR(50) NOT NULL DEFAULT 'Departmental',
  is_default      BOOLEAN NOT NULL DEFAULT FALSE,
  is_active_main  BOOLEAN NOT NULL DEFAULT FALSE,
  layout_columns  INT NOT NULL DEFAULT 12,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### টেবিল ২: `dashboard_template_widgets`
প্রতিটি টেমপ্লেটের ভেতরের কার্ড, তার সিরিয়াল, সাইজ এবং চিপ/ফিল্টার সেটিংস রাখে।
```sql
CREATE TABLE dashboard_template_widgets (
  id              VARCHAR(64) PRIMARY KEY,
  template_id     VARCHAR(64) NOT NULL,
  component_id    VARCHAR(80) NOT NULL,      -- যেমন: 'hr_quick_stats'
  custom_title    VARCHAR(150) NULL,
  col_span        INT NOT NULL DEFAULT 6,    -- 3(25%), 4(33%), 6(50%), 8(67%), 12(100%)
  sort_order      INT NOT NULL DEFAULT 0,    -- 0, 1, 2... (কার্ডের সিরিয়াল)
  settings_json   JSON NOT NULL,             -- নিচে উদাহরণ দেখুন
  FOREIGN KEY (template_id) REFERENCES dashboard_templates(id) ON DELETE CASCADE
);

CREATE INDEX idx_tpl_user_active ON dashboard_templates(user_id, is_active_main);
CREATE INDEX idx_tpl_widgets_sort ON dashboard_template_widgets(template_id, sort_order);
```

**`settings_json`-এ কী কী থাকবে (উদাহরণ):**
```json
{
  "scope": "area",
  "areas": ["Dhaka North / Gazipur"],
  "departments": ["Sewing Floor", "Cutting Unit"],
  "period": "year",
  "enabledChips": ["total_workforce", "worker_present", "worker_absent", "staff_present", "staff_absent"],
  "chipLabels": {
    "total_workforce": "DHAKA STAFF"
  }
}
```
> **সহজ ব্যাখ্যা:** `enabledChips` অ্যারে-র ভেতর আইডিগুলো যে সিরিয়ালে থাকবে, কার্ডেও চিপগুলো ঠিক সেই সিরিয়ালে দেখাবে। আর `chipLabels`-এ ইউজারের রিনেম করা নাম থাকবে (রিসেট করলে ওই কী ডিলিট হবে)।

---

### ৩.২ স্পিডের জন্য Pre-Aggregated Rollup Tables (খুব গুরুত্বপূর্ণ)

#### Rollup টেবিল ১: `dash_daily_attendance_rollup`
প্রতিদিন প্রতি Line/Unit/Section/Department/Area-তে কতজন Worker/Staff Present, Absent, Late, Leave, Holiday আছে তার রেডি হিসাব এখানে থাকবে।
```sql
CREATE TABLE dash_daily_attendance_rollup (
  att_date        DATE NOT NULL,
  area_id         VARCHAR(64) NOT NULL,
  department_id   VARCHAR(64) NOT NULL,
  section_id      VARCHAR(64) NOT NULL,
  unit_id         VARCHAR(64) NOT NULL,
  line_id         VARCHAR(64) NOT NULL,
  worker_total    INT NOT NULL DEFAULT 0,
  staff_total     INT NOT NULL DEFAULT 0,
  worker_present  INT NOT NULL DEFAULT 0,
  worker_absent   INT NOT NULL DEFAULT 0,
  staff_present   INT NOT NULL DEFAULT 0,
  staff_absent    INT NOT NULL DEFAULT 0,
  late_worker     INT NOT NULL DEFAULT 0,
  late_staff      INT NOT NULL DEFAULT 0,
  on_leave        INT NOT NULL DEFAULT 0,
  holiday         INT NOT NULL DEFAULT 0,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (att_date, area_id, department_id, section_id, unit_id, line_id)
);
```
- **কখন আপডেট হবে?** একটি ব্যাকগ্রাউন্ড জব প্রতি **১–২ মিনিটে** (অথবা বায়োমেট্রিক পাঞ্চ সিঙ্ক হওয়ার পর) শুধু **আজকের তারিখের (`CURDATE()`)** হিসাব আপডেট করবে।
- **সুবিধা:** ড্যাশবোর্ড ওপেন করলে ১০,০০০ কর্মীর টেবিল স্ক্যান না করে এই ছোট টেবিল থেকে `< 5 ms`-এ সব Attendance কার্ড ও Drill-Down-এর ডেটা চলে আসবে!

#### Rollup টেবিল ২: `dash_monthly_finance_rollup`
প্রতি মাসের Payroll, OT, Increment এবং Separation-এর রেডি হিসাব এখানে থাকবে।
```sql
CREATE TABLE dash_monthly_finance_rollup (
  year_no              INT NOT NULL,
  month_no             INT NOT NULL,         -- 1 থেকে 12
  area_id              VARCHAR(64) NOT NULL,
  department_id        VARCHAR(64) NOT NULL,
  payroll_gross        DECIMAL(14,2) NOT NULL DEFAULT 0,
  payroll_net          DECIMAL(14,2) NOT NULL DEFAULT 0,
  ot_budget_amt        DECIMAL(14,2) NOT NULL DEFAULT 0,
  ot_req_hours         DECIMAL(10,2) NOT NULL DEFAULT 0,
  ot_actual_hours      DECIMAL(10,2) NOT NULL DEFAULT 0,
  ot_actual_amt        DECIMAL(14,2) NOT NULL DEFAULT 0,
  increment_amount     DECIMAL(14,2) NOT NULL DEFAULT 0,
  increment_staff_cnt  INT NOT NULL DEFAULT 0,
  resign_count         INT NOT NULL DEFAULT 0,
  lefty_count          INT NOT NULL DEFAULT 0,
  terminated_count     INT NOT NULL DEFAULT 0,
  retired_count        INT NOT NULL DEFAULT 0,
  PRIMARY KEY (year_no, month_no, area_id, department_id)
);
```
- **কখন আপডেট হবে?** Payroll run, OT approve, Increment approve বা Separation approve হলে সাথে সাথে (অথবা প্রতি ১৫ মিনিটে) আপডেট হবে।

---

## ৪. API ডিজাইন (কী পাঠাবেন, কী ফেরত পাবেন)

### ৪.১ টেমপ্লেট সেভ/লোড API (লগইন ও এডিটের জন্য)
- `GET /api/dashboards` → ইউজারের সব টেমপ্লেট ও `activeTemplateId` পাঠায়।
- `POST /api/dashboards` → নতুন টেমপ্লেট বানায় বা ক্লোন করে।
- `PUT /api/dashboards/:id` → ড্র্যাগ করা সিরিয়াল, `colSpan`, `chipLabels`, `enabledChips`, `scope` সেভ করে।
- `PATCH /api/dashboards/:id/activate` → মেইন ড্যাশবোর্ড সেট করে।
- `DELETE /api/dashboards/:id` → কাস্টম টেমপ্লেট ডিলিট করে।

### ৪.২ ইউনিফাইড উইজেট ডেটা API (`POST /api/dashboard/widget-data`)

**ফ্রন্টএন্ড যা পাঠাবে (Request):**
```json
{
  "componentId": "hr_increment_yearly",
  "scope": "area",
  "areas": ["Dhaka North / Gazipur"],
  "departments": [],
  "period": "year",
  "enabledChips": ["total_inc", "inc_staff", "avg_inc", "peak_month"]
}
```

**ব্যাকএন্ড যা ফেরত দেবে (Response — ৩ ধরনের স্ট্যান্ডার্ড ফরম্যাট):**

1. **KPI / Metric কার্ডের জন্য (`hr_quick_stats`, `hr_workforce_info`, `hr_requisitions_summary`):**
   ```json
   {
     "componentId": "hr_quick_stats",
     "scopeLabel": "Dhaka North / Gazipur",
     "chips": {
       "total_workforce": { "value": 1248, "sub": "1 Area(s)" },
       "worker_present":  { "value": 1727, "pct": "95.6%", "sub": "Lines active" },
       "worker_absent":   { "value": 80,   "pct": "4.4%",  "sub": "Floor absent" }
     }
   }
   ```

2. **চার্ট + KPI কার্ডের জন্য (`hr_increment_yearly`, `hr_manpower_budget_vs_onboard`, `hr_ot_bar_chart`):**
   ```json
   {
     "componentId": "hr_increment_yearly",
     "scopeLabel": "Dhaka North / Gazipur",
     "chips": {
       "total_inc":  { "value": 6420000, "sub": "Jan–Dec 2026" },
       "inc_staff":  { "value": 1840,    "sub": "Eligible & Approved" },
       "avg_inc":    { "value": 3489,    "sub": "Per Staff / Mo" },
       "peak_month": { "value": "Jul (৳14.2L)", "sub": "Annual Appraisal" }
     },
     "chartData": [
       { "month": "Jan", "amount": 420000, "staffCount": 145 },
       { "month": "Feb", "amount": 185000, "staffCount": 62 },
       { "month": "Jul", "amount": 1420000, "staffCount": 890 }
     ]
   }
   ```

3. **ডোনাট/পাই চার্টের জন্য (`hr_attendance_pie`, `hr_late_absent_pie`):**
   ```json
   {
     "componentId": "hr_attendance_pie",
     "scopeLabel": "Dhaka North / Gazipur",
     "centerPct": 91,
     "items": [
       { "id": "present", "name": "Present",    "value": 1196, "pct": 91 },
       { "id": "absent",  "name": "Absent",     "value": 42,   "pct": 3 },
       { "id": "late",    "name": "Late Entry", "value": 73,   "pct": 6 },
       { "id": "leave",   "name": "On Leave",   "value": 10,   "pct": 1 }
     ]
   }
   ```

---

## ৫. Security, RBAC এবং Shared Scope Filter (সহজ নিয়ম)

ডেভেলপার প্রতিটি কুয়েরিতে আলাদা `if/else` না লিখে **একটি কমন Scope Filter ফাংশন** বানাবে:

| ফ্রন্টএন্ড `scope` | সার্ভার কী চেক করবে | SQL-এ কী ফিল্টার বসবে |
|---|---|---|
| `personal` (**Self**) | টোকেন থেকে নিজের `employeeId` নেবে | `WHERE employee_id = @currentEmployeeId` |
| `area` (**Area**) | ইউজারের ওই Area দেখার পারমিশন আছে কি না | `WHERE area_id = @selectedAreaId` |
| `department` (**Department**) | সিলেক্ট করা ডিপার্টমেন্টগুলোর মধ্যে ইউজার কোনগুলো দেখার অনুমতি পায় | `WHERE department_id IN (@allowedSelectedDeptIds)` |

---

## ৬. Dynamic Hierarchy Drill-Down (`Area → Dept → Section → Unit → Line`)

- **Endpoint:** `GET /api/dashboard/drill-down?componentId=hr_quick_stats&level=department&parentId=...`
- **কাজ করার ধরন:**
  1. `level=department` → সব ডিপার্টমেন্টের সামারি (Rollup টেবিল থেকে `GROUP BY department_id`)।
  2. ডিপার্টমেন্টে ক্লিক করলে → `level=section&parentId=DEPT_01` → ওই ডিপার্টমেন্টের সব সেকশন (`GROUP BY section_id`)।
  3. সেকশনে ক্লিক করলে → `level=unit&parentId=SEC_02` → ওই সেকশনের সব ইউনিট (`GROUP BY unit_id`)।
  4. ইউনিটে ক্লিক করলে → `level=line&parentId=UNIT_03` → লাইন অনুযায়ী ফাইনাল তালিকা (`GROUP BY line_id`)।

---

## ৭. Redis Caching ও Invalidation (কখন ক্যাশ আপডেট হবে?)

- **Cache Key:** `dash:v1:{componentId}:{scope}:{areaId}:{deptIdsHash}:{period}:{dateOrYear}`
- **TTL (কতক্ষণ ক্যাশ থাকবে):**
  - Attendance / Pending Approvals / Messages: **৩০–৬০ সেকেন্ড**
  - OT / Manpower Budget / Separation: **২–৫ মিনিট**
  - Yearly Payroll / Increment / Headcount Trend: **১০–১৫ মিনিট**
- **Instant Invalidation (সাথে সাথে আপডেট):**
  - কেউ নতুন Leave/Requisition অ্যাপ্রুভ করলে বা মেসেজ পাঠালে শুধু `hr_requisitions_summary` ও `hr_messages_feed`-এর ক্যাশ কী মুছে (Invalidate করে) দেবে।

---

## ৮. Final HRIS-এর সব ২১টি উইজেটের পূর্ণাঙ্গ স্পেসিফিকেশন (All 21 Widgets Detailed Spec)

নিচে ১ থেকে ২১ সিরিয়াল অনুযায়ী প্রতিটি উইজেটের Exact `componentId`, ডিফল্ট সাইজ, চিপ আইডি, ডেটা সোর্স, কুয়েরি লজিক এবং ক্যাশ টাইম দেওয়া হলো:

### #1. Workforce Information (`hr_workforce_info`) — Default: `100%` (`colSpan: 12`)
- **Available Chips (14):** `total_manpower`, `worker`, `staff`, `resign`, `lefty`, `ml`, `others`, `new_joining`, `male`, `female`, `confirmed`, `probation`, `terminated`, `retired`
- **Default Selected (5):** `total_manpower`, `worker`, `staff`, `resign`, `lefty`
- **Query Logic:**
  - `employees` টেবিল থেকে active কর্মী (`total_manpower`, `worker`, `staff`, `male`, `female`, `confirmed`, `probation`, `new_joining` চলতি মাসে) এবং `dash_monthly_finance_rollup` / `employee_separations` থেকে চলতি মাসের `resign`, `lefty`, `ml`, `terminated`, `retired`, `others` একটি `SUM(CASE WHEN ...)` কুয়েরিতে আনবে।
- **Cache TTL:** `60 seconds`

### #2. Total Manpower Breakdown (`hr_total_manpower_chart`) — Default: `67%` (`colSpan: 8`)
- **Chips:** নেই (ডিপার্টমেন্ট বার চার্ট)
- **Query Logic:**
  - `employees` টেবিল থেকে `GROUP BY department_id` করে প্রতিটি ডিপার্টমেন্ট/ইউনিটের (যেমন `CUT`, `R&D`, `FIN`, `QC`, `SEW`, `PCK`) active কর্মী সংখ্যা এবং মোট হেডকাউন্ট (`SUM`) রিটার্ন করবে।
- **Cache TTL:** `2 minutes`

### #3. Requisitions & Messages Summary (`hr_requisitions_summary`) — Default: `33%` (`colSpan: 4`)
- **Available Chips (6):** `total_req`, `pending_req`, `unread_msg`, `my_req_pending`, `my_app_pending`, `approved_req`
- **Default Selected (5):** `total_req`, `pending_req`, `unread_msg`, `my_req_pending`, `my_app_pending`
- **Query Logic:**
  - `requisitions` ও `approvals` টেবিল থেকে মোট রিকুইজিশন, পেন্ডিং রিকুইজিশন, লগইন করা ইউজারের নিজের `my_req_pending`, ইউজারের অ্যাপ্রুভালের জন্য আটকে থাকা `my_app_pending`, এবং `messenger_messages` থেকে `unread_msg` কাউন্ট আনবে।
- **Cache TTL:** `15–30 seconds` (অ্যাপ্রুভাল/মেসেজে Instant Invalidate)

### #4. Manpower Budget vs Actual On Board (`hr_manpower_budget_vs_onboard`) — Default: `50%` (`colSpan: 6`)
- **Available Chips (4):** `budget_mp`, `onboard_mp`, `vacancy`, `fill_rate`
- **Query Logic:**
  - `manpower_budgets` (অনুমোদিত বাজেট সংখ্যা ও বেতন বাজেট টাকা) বনাম `employees` (বর্তমান active কর্মী সংখ্যা ও gross salary যোগফল)।
  - **বিশেষ নিয়ম:** প্রতিটি কার্ডে প্রধান বড় ভ্যালু হিসেবে **Amount (৳)** এবং নিচে ছোট করে **Headcount** রিটার্ন করবে (`vacancy = budget - onboard`, `fill_rate = (onboard / budget) * 100`)। চার্টে ডিপার্টমেন্ট অনুযায়ী Budget Amount vs On-Board Amount ও Tooltip-এ Amount + MP দেখাবে।
- **Cache TTL:** `5 minutes`

### #5. Separation & Turnover (`hr_separation_turnover`) — Default: `50%` (`colSpan: 6`)
- **Available Chips (6):** `total_sep`, `turnover_rate`, `resign`, `lefty`, `terminated`, `retired`
- **Default Selected (4):** `total_sep`, `turnover_rate`, `resign`, `lefty`
- **Query Logic:**
  - `dash_monthly_finance_rollup` থেকে চলতি মাসের separation সংখ্যা (`resign + lefty + terminated + retired`), `turnover_rate = (total_sep / avg_headcount) * 100`, এবং গত ৬ মাসের `resign` vs `lefty` বার চার্ট ডেটা রিটার্ন করবে।
- **Cache TTL:** `5 minutes`

### #6. OT Budget Comparison (`hr_ot_budget_comparison`) — Default: `100%` (`colSpan: 12`)
- **Available Chips (5):** `budget_amt`, `actual_ot`, `request_ot`, `diff_actual`, `diff_request`
- **Query Logic:**
  - `ot_budgets`, `ot_requisitions` ও `dash_monthly_finance_rollup` থেকে অনুমোদিত OT Budget Amount (৳), Actual OT Amount (৳), Requested OT Amount (৳), এবং `Diff (Budget - Actual)` ও `Diff (Budget - Request)` হিসাব করে বার চার্টসহ পাঠাবে।
- **Cache TTL:** `2 minutes`

### #7. OT Requisition vs Consumption (`hr_ot_requisition_vs_consumption`) — Default: `50%` (`colSpan: 6`)
- **Available Chips (3):** `ot_requisition`, `ot_consumed`, `ot_variance`
- **Query Logic:**
  - সুপারভাইজারদের চাওয়া OT ঘণ্টা ও টাকা বনাম বায়োমেট্রিক পাঞ্চ অনুযায়ী আসল OT ঘণ্টা ও টাকা। কার্ড ও চার্টে **Hours + Amount (৳)** উভয়ই দেখাবে এবং লাইন/সেকশন (`Sewing L-01..04`, `Cutting`, `Finishing`) অনুযায়ী বার চার্ট রিটার্ন করবে।
- **Cache TTL:** `2 minutes`

### #8. Overtime Payout & Hours Trend (`hr_ot_bar_chart`) — Default: `50%` (`colSpan: 6`)
- **Chips:** নেই (সাপ্তাহিক/মাসিক ডুয়াল বার চার্ট)
- **Query Logic:**
  - গত ৭ দিনের (`Sat`–`Fri`) প্রতিটি দিনের মোট **OT Hours** এবং **OT Amount (৳)** একসাথে `GROUP BY ot_date` করে রিটার্ন করবে।
- **Cache TTL:** `2 minutes`

### #9. Workforce Presence & Attendance Stats (`hr_quick_stats`) — Default: `100%` (`colSpan: 12`)
- **Available Chips (21):** `total_workforce`, `present_today`, `absent`, `late_punch`, `on_leave`, `ot_active`, `new_joiners`, `early_leave`, `worker`, `staff`, `staff_present`, `worker_present`, `worker_absent`, `staff_absent`, `holiday`, `late_worker`, `late_staff`, `leave_worker`, `leave_staff`, `uninformed_absent`, `weekend_duty`
- **Default Selected (5):** `total_workforce`, `worker_present`, `worker_absent`, `staff_present`, `staff_absent`
- **Query Logic:**
  - `dash_daily_attendance_rollup` টেবিল থেকে আজকের তারিখের (`att_date = CURDATE()`) শুধু `enabledChips`-এর কলামগুলো যোগ করে `value` ও `pct` রিটার্ন করবে। (`personal` স্কোপে ইউজারের নিজস্ব মাসিক উপস্থিতির দিনসংখ্যা দেখাবে)।
- **Cache TTL:** `30–60 seconds`

### #10. Attendance Distribution Chart (`hr_attendance_pie`) — Default: `33%` (`colSpan: 4`)
- **Available Chips (8):** `present`, `absent`, `late`, `leave`, `holiday`, `early_leave`, `ml`, `weekend_duty`
- **Default Selected (4):** `present`, `absent`, `late`, `leave`
- **Query Logic:**
  - `dash_daily_attendance_rollup` থেকে শুধু সিলেক্ট করা চিপগুলোর সংখ্যা ও শতকরা হার (`%`) রিটার্ন করবে। ডোনাটের মাঝখানে `Present %` দেখাবে।
- **Cache TTL:** `30–60 seconds`

### #11. On-Time vs Late Entry Trend (`hr_ontime_vs_late_chart`) — Default: `33%` (`colSpan: 4`)
- **Available Chips (2):** `ontime`, `late`
- **Query Logic:**
  - গত ৬ মাসের (`Jan`–`Jun` বা রোলিং ৬ মাস) `GROUP BY MONTH(att_date)` করে প্রতি মাসে কতজন On-Time ও কতজন Late হয়েছে তার সংখ্যা রিটার্ন করবে।
- **Cache TTL:** `5 minutes`

### #12. Late vs Absent Analysis (`hr_late_absent_pie`) — Default: `33%` (`colSpan: 4`)
- **Chips:** নেই (ডোনাট চার্ট)
- **Query Logic:**
  - `attendance_daily` থেকে Grace Period (`<15m`), Heavy Delay (`>30m`), Uninformed Absent, এবং Medical/Approved Absent-এর কাউন্ট রিটার্ন করবে।
- **Cache TTL:** `60 seconds`

### #13. Talent Acquisition Pipeline (`hr_recruitment_pipeline`) — Default: `50%` (`colSpan: 6`)
- **Chips:** নেই (`period`: `year` / `month`)
- **Query Logic:**
  - `job_requisitions` ও `candidates` টেবিল থেকে Openings, Screened (CVs), Interviewed, এবং Hired/Offered (সাথে Joined `%`) সংখ্যা রিটার্ন করবে।
- **Cache TTL:** `5 minutes`

### #14. Headcount Growth & Turnover (`hr_headcount_trend`) — Default: `50%` (`colSpan: 6`)
- **Chips:** নেই (এরিয়া/লাইন চার্ট)
- **Query Logic:**
  - ১২ মাসের প্রতি মাসে মোট active হেডকাউন্ট ও নিয়োগ বনাম প্রস্থানের ট্রেন্ড রিটার্ন করবে।
- **Cache TTL:** `15 minutes`

### #15. Yearly Payroll Disbursement & Salary (`acc_payroll_payout`) — Default: `50%` (`colSpan: 6`)
- **Available Chips:** Payroll summary chips (`gross_payroll`, `net_disbursed`, `deductions`, `avg_salary`)
- **Query Logic:**
  - `dash_monthly_finance_rollup` থেকে নির্বাচিত বছরের (`period: "year"`) ১২ মাসের (`Jan`–`Dec`) বেতন বিতরণের টাকা ও সামারি কার্ড রিটার্ন করবে।
- **Cache TTL:** `15 minutes`

### #16. Increment Yearly (`hr_increment_yearly`) — Default: `50%` (`colSpan: 6`)
- **Available Chips (4):** `total_inc_amt`, `inc_employees`, `avg_inc_pct`, `peak_month`
- **Query Logic:**
  - `dash_monthly_finance_rollup` / `employee_increments` থেকে জানুয়ারি–ডিসেম্বর প্রতি মাসে কত টাকা (`৳`) ইনক্রিমেন্ট হয়েছে এবং কতজন স্টাফ (`staffCount`) পেয়েছে তার চার্ট ও সামারি কার্ড রিটার্ন করবে।
- **Cache TTL:** `15 minutes`

### #17. Leave Balance Overview (`hr_leave_balance_card`) — Default: `50%` (`colSpan: 6`)
- **Available Chips (6):** `casual`, `sick`, `earned`, `maternity`, `compoff`, `lwp`
- **Query Logic:**
  - `employee_leave_balances` থেকে প্রতিটি ছুটির ধরনের `total`, `used`, `left`, এবং `percentage = (left / total) * 100` রিটার্ন করবে।
- **Cache TTL:** `2 minutes`

### #18. Upcoming Events & Birthdays (`hr_upcoming_events`) — Default: `50%` (`colSpan: 6`)
- **Available Chips (4):** `birthdays`, `anniversaries`, `interviews`, `holidays`
- **Query Logic:**
  - আগামী ৭ দিনের কর্মীদের জন্মদিন (`employees.dob`), চাকরির বর্ষপূর্তি (`employees.joining_date`), নির্ধারিত ইন্টারভিউ (`candidates.interview_date`) এবং আসন্ন মিটিং/ছুটি রিটার্ন করবে।
- **Cache TTL:** `10 minutes`

### #19. Notice Board & Circulars (`hr_notice_board`) — Default: `50%` (`colSpan: 6`)
- **Available Chips (3):** `holiday`, `meeting`, `policy`
- **Query Logic:**
  - `hr_notices` টেবিল থেকে সর্বশেষ ৩–৫টি অ্যাক্টিভ সার্কুলার (`title`, `category`, `date`, `circularNo`, `summary`) রিটার্ন করবে।
- **Cache TTL:** `5 minutes`

### #20. Recent Messages & Team Inbox (`hr_messages_feed`) — Default: `50%` (`colSpan: 6`)
- **Available Chips (4):** `hr_desk`, `floor_chief`, `payroll`, `it_support`
- **Query Logic:**
  - লগইন করা ইউজারের সর্বশেষ চ্যাট থ্রেডগুলো (`senderName`, `avatar`, `lastMessage`, `time`, `unreadCount`) আনবে।
- **Cache TTL:** `15 seconds`

### #21. My Team Members (`hr_team_members`) — Default: `100%` (`colSpan: 12`)
- **Available Chips (4):** `sr_exec`, `exec`, `jr_exec`, `managers`
- **Query Logic:**
  - `employees` টেবিল থেকে ইউজারের টিম/ডিপার্টমেন্ট/এরিয়ার সহকর্মীদের `id`, `name`, `designation`, `phone`, `email`, `photoUrl`, এবং `isOnline` স্ট্যাটাস রিটার্ন করবে।
- **Cache TTL:** `5 minutes`

---

## ৯. ডেভেলপারের কাজের সিরিয়াল (Step-by-Step Build Checklist)

1. **ধাপ ১ — টেবিল ও ইন্ডেক্স তৈরি:**
   `dashboard_templates`, `dashboard_template_widgets`, `dash_daily_attendance_rollup`, `dash_monthly_finance_rollup` টেবিল ও ইন্ডেক্স তৈরি করা।
2. **ধাপ ২ — Template Save/Load API:**
   `GET/POST/PUT/PATCH/DELETE /api/dashboards` তৈরি করে ফ্রন্টএন্ডের `localStorage` বন্ধ করে API কানেক্ট করা।
3. **ধাপ ৩ — Rollup Sync Job চালু:**
   প্রতি ১–২ মিনিটে Attendance rollup এবং ইভেন্ট-ভিত্তিক Finance rollup আপডেট করার ব্যাকগ্রাউন্ড জব চালু করা।
4. **ধাপ ৪ — Scope Guard + Redis Cache:**
   RBAC পারমিশন হেল্পার ও Redis ক্যাশিং লেয়ার বসানো।
5. **ধাপ ৫ — Widget Handler-গুলো যুক্ত করা (প্রায়োরিটি অনুযায়ী):**
   - **Priority 1:** `hr_workforce_info`, `hr_quick_stats`, `hr_attendance_pie`, `hr_requisitions_summary`
   - **Priority 2:** `hr_total_manpower_chart`, `hr_manpower_budget_vs_onboard`, `hr_separation_turnover`, `hr_ontime_vs_late_chart`, `hr_late_absent_pie`
   - **Priority 3:** `hr_ot_budget_comparison`, `hr_ot_requisition_vs_consumption`, `hr_ot_bar_chart`, `acc_payroll_payout`, `hr_increment_yearly`, `hr_headcount_trend`, `hr_recruitment_pipeline`
   - **Priority 4:** `hr_leave_balance_card`, `hr_upcoming_events`, `hr_notice_board`, `hr_messages_feed`, `hr_team_members`
6. **ধাপ ৬ — Drill-Down ও Load Test:**
   `GET /api/dashboard/drill-down` তৈরি করে ১০,০০০+ এমপ্লয়ি ডেটায় লোড টেস্ট চালিয়ে `< 100 ms` রেসপন্স নিশ্চিত করা।
