# Dashboard Maker — Complete Backend Architecture & Query Specification

This document provides the complete backend architecture, database schema, API contracts, dynamic SQL query pattern, and implementation roadmap for the **CRIPTON HRIS Dashboard Maker** (`Final HRIS` 22-component system).

---

## 1. High-Level Architecture (Two-Part Design)

The Dashboard Maker separates **Layout/Configuration** from **Live Widget Data**:

```
┌──────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                             │
│  1. Loads user's saved templates & active dashboard                  │
│  2. Renders grid (colSpan: 3=25%, 4=33%, 6=50%, 8=67%, 12=100%)      │
│  3. Each widget independently queries /api/dashboard/widget-data     │
└───────────────┬──────────────────────────────────┬───────────────────┘
                │                                  │
                ▼                                  ▼
┌───────────────────────────────┐  ┌───────────────────────────────────┐
│   Part A: Template CRUD API   │  │   Part B: Live Widget Query API   │
│   GET/POST/PUT/DELETE         │  │   POST /api/dashboard/widget-data │
│   /api/dashboards             │  │   GET  /api/dashboard/drill-down  │
└───────────────┬───────────────┘  └───────────────┬───────────────────┘
                │                                  │
                ▼                                  ▼
┌───────────────────────────────┐  ┌───────────────────────────────────┐
│  dashboard_templates          │  │  Handler Registry + Shared Scope  │
│  dashboard_template_widgets   │  │  SQL Filter + Redis/Short Cache   │
└───────────────────────────────┘  └───────────────────────────────────┘
```

---

## 2. Database Schema (2 Tables)

### 2.1 `dashboard_templates`
Stores each template header (including system defaults like `Final HRIS` and user-created/cloned templates).

```sql
CREATE TABLE dashboard_templates (
  id              VARCHAR(64) PRIMARY KEY,
  user_id         VARCHAR(64) NULL,          -- NULL for global/default templates
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

### 2.2 `dashboard_template_widgets`
Stores each widget card inside a template, its position (`sort_order`), width (`col_span`), and JSON settings (`scope`, `areas`, `departments`, `enabledChips`, `period`).

```sql
CREATE TABLE dashboard_template_widgets (
  id              VARCHAR(64) PRIMARY KEY,
  template_id     VARCHAR(64) NOT NULL,
  component_id    VARCHAR(80) NOT NULL,      -- e.g. 'hr_quick_stats'
  custom_title    VARCHAR(150) NULL,
  col_span        INT NOT NULL DEFAULT 6,    -- Allowed: 3 (25%), 4 (33%), 6 (50%), 8 (67%), 12 (100%)
  sort_order      INT NOT NULL DEFAULT 0,    -- 0, 1, 2... (canvas order)
  settings_json   JSON NOT NULL,             -- { scope, areas, departments, enabledChips, period }
  FOREIGN KEY (template_id) REFERENCES dashboard_templates(id) ON DELETE CASCADE
);

CREATE INDEX idx_template_widgets_order ON dashboard_template_widgets(template_id, sort_order);
```

**Example `settings_json`:**
```json
{
  "scope": "area",
  "areas": ["Dhaka North / Gazipur"],
  "departments": ["Sewing Floor", "Cutting Unit"],
  "period": "year",
  "enabledChips": [
    "total_workforce",
    "worker_present",
    "worker_absent",
    "staff_present",
    "staff_absent"
  ]
}
```

> **Note:** Chip order in `enabledChips` controls both which chips are visible **and** their display order in the card.

---

## 3. REST API Endpoints

### 3.1 Template Management (Replaces `localStorage`)

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/dashboards` | List all user + default templates and return `activeTemplateId` |
| `POST` | `/api/dashboards` | Create or duplicate a dashboard template |
| `PUT` | `/api/dashboards/:id` | Save full widget list (`sort_order`, `col_span`, `custom_title`, `settings_json`) |
| `PATCH` | `/api/dashboards/:id/activate` | Set as the user's active main dashboard |
| `DELETE` | `/api/dashboards/:id` | Delete a custom user template |

### 3.2 Live Widget Data Endpoint (Unified Dispatcher)

Instead of 22 separate endpoints, expose **one unified query endpoint**:

**`POST /api/dashboard/widget-data`**

**Request Body:**
```json
{
  "componentId": "hr_quick_stats",
  "scope": "area",
  "areas": ["Dhaka North / Gazipur"],
  "departments": ["Sewing Floor", "Cutting Unit"],
  "period": "year",
  "enabledChips": ["total_workforce", "worker_present", "worker_absent", "staff_present", "staff_absent"]
}
```

**Response Body:**
```json
{
  "componentId": "hr_quick_stats",
  "scopeLabel": "Dhaka North / Gazipur",
  "generatedAt": "2026-11-26T10:30:00Z",
  "chips": {
    "total_workforce": { "value": 1248, "sub": "+14 this month" },
    "worker_present":  { "value": 5180, "pct": "95.6%", "sub": "Lines active" },
    "worker_absent":   { "value": 240,  "pct": "4.4%",  "sub": "Floor absent" },
    "staff_present":   { "value": 978,  "pct": "96.2%", "sub": "On duty" },
    "staff_absent":    { "value": 39,   "pct": "3.8%",  "sub": "Office absent" }
  },
  "chartData": []
}
```

### 3.3 Hierarchy Drill-Down Endpoint

**`GET /api/dashboard/drill-down`**

Query params:
- `componentId` (e.g. `hr_quick_stats`)
- `scope` (`area` | `department` | `personal`)
- `level` (`area` | `department` | `section` | `unit` | `line`)
- `parentId` (optional parent node ID when drilling down)
- `areaId` / `departmentIds`

**Drill-Down Hierarchy:**
`Area → Department → Section → Unit → Line`

---

## 4. How Component Queries Work (Backend Implementation)

### 4.1 Handler Registry Pattern

```ts
// dashboardQueryRegistry.ts
type WidgetQueryFn = (ctx: QueryContext) => Promise<WidgetDataResponse>;

const WIDGET_QUERY_HANDLERS: Record<string, WidgetQueryFn> = {
  hr_workforce_info: queryWorkforceInfo,
  hr_quick_stats: queryQuickStats,
  hr_total_manpower_chart: queryTotalManpowerBreakdown,
  hr_requisitions_summary: queryRequisitionsSummary,
  hr_manpower_budget_vs_onboard: queryManpowerBudgetVsOnboard,
  hr_separation_turnover: querySeparationTurnover,
  hr_ot_budget_comparison: queryOtBudgetComparison,
  hr_ot_requisition_vs_consumption: queryOtReqVsConsumption,
  hr_ot_bar_chart: queryOvertimeTrend,
  hr_attendance_pie: queryAttendanceDistribution,
  hr_ontime_vs_late_chart: queryOntimeVsLate,
  hr_late_absent_pie: queryLateVsAbsent,
  hr_recruitment_pipeline: queryRecruitmentPipeline,
  hr_headcount_trend: queryHeadcountTrend,
  acc_payroll_payout: queryYearlyPayroll,
  hr_increment_yearly: queryIncrementYearly,
  hr_leave_balance_card: queryLeaveBalance,
  hr_upcoming_events: queryUpcomingEvents,
  hr_notice_board: queryNoticeBoard,
  hr_messages_feed: queryRecentMessages,
  hr_team_members: queryTeamMembers,
};
```

### 4.2 Shared Scope Filter Builder (Security + Reuse)

Every query calls **one shared helper** that validates user permissions from the JWT/session and builds a parameterized `WHERE` clause:

| Frontend `scope` | Meaning | Parameterized SQL Filter |
|---|---|---|
| `personal` | **Self** (logged-in employee only) | `AND e.id = @currentEmployeeId` |
| `area` | **Area** (single selected area/zone) | `AND e.area_id = @selectedAreaId` |
| `department` | **Department** (1 or more departments) | `AND e.department_id IN (@selectedDepartmentIds)` |

> **Security Rule:** Never trust `scope`, `areaId`, or `departmentIds` blindly from the client. Always intersect them with the authenticated user's RBAC permissions on the server.

---

### 4.3 Concrete SQL Query Examples

#### Example A: Single-Pass KPI Aggregation (`hr_quick_stats`)
Compute all enabled attendance chips in **one single table scan** using `SUM(CASE WHEN ...)`:

```sql
SELECT
  COUNT(*) AS total_workforce,
  SUM(CASE WHEN e.emp_type = 'Worker' AND a.status = 'Present' THEN 1 ELSE 0 END) AS worker_present,
  SUM(CASE WHEN e.emp_type = 'Worker' AND a.status = 'Absent'  THEN 1 ELSE 0 END) AS worker_absent,
  SUM(CASE WHEN e.emp_type = 'Staff'  AND a.status = 'Present' THEN 1 ELSE 0 END) AS staff_present,
  SUM(CASE WHEN e.emp_type = 'Staff'  AND a.status = 'Absent'  THEN 1 ELSE 0 END) AS staff_absent,
  SUM(CASE WHEN e.emp_type = 'Worker' AND a.is_late = 1        THEN 1 ELSE 0 END) AS late_worker,
  SUM(CASE WHEN e.emp_type = 'Staff'  AND a.is_late = 1        THEN 1 ELSE 0 END) AS late_staff,
  SUM(CASE WHEN a.status = 'Holiday'                           THEN 1 ELSE 0 END) AS holiday
FROM employees e
LEFT JOIN attendance_daily a
  ON a.employee_id = e.id AND a.att_date = @targetDate
WHERE e.is_active = 1
  -- + Shared Scope Filter (e.id = ... / e.area_id = ... / e.department_id IN (...))
```

#### Example B: Yearly Increment Bar Chart (`hr_increment_yearly`)
Returns month-by-month increment Taka amount and staff count (`Jan`–`Dec`):

```sql
SELECT
  MONTH(inc.effective_date) AS month_no,
  SUM(inc.increment_amount) AS amount,
  COUNT(DISTINCT inc.employee_id) AS staff_count
FROM employee_increments inc
INNER JOIN employees e ON e.id = inc.employee_id
WHERE YEAR(inc.effective_date) = @targetYear
  AND inc.status = 'Approved'
  -- + Shared Scope Filter
GROUP BY MONTH(inc.effective_date)
ORDER BY month_no;
```

#### Example C: Manpower Budget vs Actual On-Board (`hr_manpower_budget_vs_onboard`)
Returns both **Amount (৳)** and **Headcount** per department:

```sql
SELECT
  d.id AS dept_id,
  d.short_name AS dept,
  b.budgeted_headcount AS budget_count,
  b.budgeted_salary_amount AS budget_amount,
  COUNT(e.id) AS onboard_count,
  COALESCE(SUM(e.gross_salary), 0) AS onboard_amount
FROM departments d
LEFT JOIN manpower_budgets b ON b.department_id = d.id AND b.fiscal_year = @year
LEFT JOIN employees e ON e.department_id = d.id AND e.is_active = 1
WHERE 1 = 1
  -- + Shared Scope Filter
GROUP BY d.id, d.short_name, b.budgeted_headcount, b.budgeted_salary_amount
ORDER BY onboard_count DESC;
```

#### Example D: Dynamic Hierarchy Drill-Down (`Department → Section → Unit → Line`)
One query handles all drill-down levels by swapping the `GROUP BY` column based on `level`:

```sql
-- level = 'department' | 'section' | 'unit' | 'line'
SELECT
  node.id,
  node.name,
  COUNT(e.id) AS total_workforce,
  SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_count,
  SUM(CASE WHEN a.status = 'Absent'  THEN 1 ELSE 0 END) AS absent_count,
  SUM(CASE WHEN a.is_late = 1        THEN 1 ELSE 0 END) AS late_count
FROM employees e
LEFT JOIN attendance_daily a ON a.employee_id = e.id AND a.att_date = @targetDate
-- Join & filter dynamically by level/parentId:
--   department -> GROUP BY e.department_id
--   section    -> WHERE e.department_id = @parentId GROUP BY e.section_id
--   unit       -> WHERE e.section_id    = @parentId GROUP BY e.unit_id
--   line       -> WHERE e.unit_id       = @parentId GROUP BY e.line_id
```

---

## 5. Complete Reference of All 21 Final HRIS Components

| # | `componentId` | Title | Default `colSpan` | Supported Scopes | Primary Data Source |
|---|---|---|---|---|---|
| 1 | `hr_workforce_info` | Workforce Information | `12` (100%) | `personal`, `area`, `department` | `employees`, `employee_separations` |
| 2 | `hr_total_manpower_chart` | Total Manpower Breakdown | `8` (67%) | `area`, `department` | `employees` + `departments` |
| 3 | `hr_requisitions_summary` | Requisitions & Messages Summary | `4` (33%) | `personal`, `area`, `department` | `requisitions`, `approvals`, `messages` |
| 4 | `hr_manpower_budget_vs_onboard` | Manpower Budget vs Actual On Board | `6` (50%) | `area`, `department` | `manpower_budgets`, `employees` |
| 5 | `hr_separation_turnover` | Separation & Turnover | `6` (50%) | `area`, `department` | `employee_separations` |
| 6 | `hr_ot_budget_comparison` | OT Budget Comparison | `12` (100%) | `area`, `department` | `ot_budgets`, `ot_requisitions`, `ot_logs` |
| 7 | `hr_ot_requisition_vs_consumption` | OT Requisition vs Consumption | `6` (50%) | `area`, `department` | `ot_requisitions`, `attendance_ot` |
| 8 | `hr_ot_bar_chart` | Overtime Payout & Hours Trend | `6` (50%) | `personal`, `area`, `department` | `attendance_ot` (hours + amount) |
| 9 | `hr_quick_stats` | Workforce Presence & Attendance Stats | `12` (100%) | `personal`, `area`, `department` | `employees`, `attendance_daily` |
| 10 | `hr_attendance_pie` | Attendance Distribution Chart | `4` (33%) | `personal`, `area`, `department` | `attendance_daily` |
| 11 | `hr_ontime_vs_late_chart` | On-Time vs Late Entry Trend | `4` (33%) | `personal`, `area`, `department` | `attendance_daily` (6 months) |
| 12 | `hr_late_absent_pie` | Late vs Absent Analysis | `4` (33%) | `personal`, `area`, `department` | `attendance_daily` |
| 13 | `hr_recruitment_pipeline` | Talent Acquisition Pipeline | `6` (50%) | `area`, `department` | `job_requisitions`, `candidates` (`period`: month/year) |
| 14 | `hr_headcount_trend` | Headcount Growth & Turnover | `6` (50%) | `area`, `department` | `employees`, `employee_separations` |
| 15 | `acc_payroll_payout` | Yearly Payroll Disbursement & Salary | `6` (50%) | `area`, `department` | `payroll_runs` (`period`: year) |
| 16 | `hr_increment_yearly` | Increment Yearly | `6` (50%) | `area`, `department` | `employee_increments` (Jan–Dec Taka) |
| 17 | `hr_leave_balance_card` | Leave Balance Overview | `6` (50%) | `personal`, `area`, `department` | `employee_leave_balances` |
| 18 | `hr_upcoming_events` | Upcoming Events & Birthdays | `6` (50%) | Global / `area` | `employees` (DOB, DOJ), `holidays`, `events` |
| 19 | `hr_notice_board` | Notice Board & Circulars | `6` (50%) | Global / `area` | `hr_notices` |
| 20 | `hr_messages_feed` | Recent Messages & Team Inbox | `6` (50%) | `personal` | `messenger_threads` |
| 21 | `hr_team_members` | My Team Members | `12` (100%) | `personal`, `area`, `department` | `employees` |

---

## 6. Performance & Caching Strategy

1. **Per-Widget Parallel Fetching:** Each widget card calls `POST /api/dashboard/widget-data` independently (e.g., via TanStack Query `useQuery`), showing a skeleton loader without blocking other cards.
2. **Short-TTL Caching (Redis / In-Memory):**
   - Cache key: `dash:{componentId}:{scope}:{areaId}:{deptHash}:{period}:{date}`
   - TTL: **30–120 seconds** for heavy attendance/manpower aggregations; **5–15 minutes** for yearly payroll/increment charts.
3. **Database Indexes:** Ensure composite indexes exist on:
   - `attendance_daily(att_date, employee_id, status)`
   - `employees(is_active, area_id, department_id, emp_type)`
   - `employee_increments(effective_date, status, employee_id)`
   - `payroll_runs(year, month, department_id)`

---

## 7. Step-by-Step Implementation Roadmap

1. **Phase 1 — Template Persistence:**
   - Create `dashboard_templates` and `dashboard_template_widgets` tables.
   - Replace `loadDashboardTemplates()` / `saveDashboardTemplates()` in `src/components/dashboard-maker/dashboard-maker-types.ts` with `GET`/`PUT /api/dashboards`.
2. **Phase 2 — Core Query Engine & Top KPIs:**
   - Implement the Shared Scope Filter Builder + `POST /api/dashboard/widget-data` dispatcher.
   - Wire `hr_workforce_info`, `hr_quick_stats`, `hr_attendance_pie`, and `hr_requisitions_summary`.
3. **Phase 3 — Analytics, OT & Financial Charts:**
   - Wire Manpower Budget, Separation, OT, Payroll, and Yearly Increment queries.
4. **Phase 4 — Drill-Down & Workspace Cards:**
   - Implement `GET /api/dashboard/drill-down` (`Area → Dept → Section → Unit → Line`) and connect Notice Board, Leave Balance, Upcoming Events, Messages, and Team Members.
