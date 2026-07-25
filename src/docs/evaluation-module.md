# Evaluation & Increment Module — Documentation

## Overview

The **Evaluation** module in CRIPTON HRIS handles employee salary increment management end-to-end: from checking who is eligible for an increment, to proposing, approving, and recording the final increment.

---

## Navigation

All 7 sub-pages share a **horizontal tab navigation bar** at the top of each page. You can jump between pages by clicking any tab — no need to go back to the sidebar.

The tabs flow in the logical order of the increment workflow:

```
Configurator → Evaluation Propose → Propose Increment → Summary → Queue & Approvals → Increment List → History
```

---

## Sub-Pages Explained

### 1. Configurator (`/increment-gadget`)
**Purpose:** Set the rules that govern how increments are calculated.

- Choose a year/month and a **Gadget Mode** (e.g., Percentage, Flat Amount, Grade-Based).
- The system uses these rules when you generate increment proposals.
- Once rules are ready, click **"Submit to Queue"** to push selected employees for approval.

**Who uses it:** HR Managers who decide the increment policy for each cycle.

---

### 2. Evaluation Propose (`/evaluation-propose`)
**Purpose:** Review employees' tenure and eligibility before starting the increment cycle.

- Filter by Year, Month, Department, Section, or Employee ID.
- The table shows each employee's: joining date, current salary, tenure (years/months/days), and last increment date.
- The **"BLL Sec 111"** column shows whether an employee is legally **Entitled** (1+ year of service) or if the increment is **Discretionary** (under 1 year).
- Select the employees you want to proceed with, then click **Submit** — the system will carry these selections to the Configurator.

**Who uses it:** HR team to identify who qualifies for an increment this cycle.

---

### 3. Propose Increment (`/propose-increment`)
**Purpose:** Enter the actual increment amounts for each employee.

- See each employee's current salary and last increment details.
- Fill in the **Proposed Increment** amount and the **new designation** (if a promotion is involved).
- Save or submit the proposals for manager review.

**Who uses it:** Department heads or HR executives submitting increment proposals.

---

### 4. Summary (`/increment-summary`)
**Purpose:** See department-wise totals of the increment budget.

- Shows how many employees in each department/unit are getting increments and the total amount.
- Useful for budget review and cost planning.

**Who uses it:** Finance and senior HR for budget approval.

---

### 5. Queue & Approvals (`/increment-queuelist`)
**Purpose:** The central approval console for all pending increments.

This page has **3 internal tabs:**
- **Queue** — Increment proposals waiting for initial approval (Gadget-level approvals)
- **HR** — HR manager endorsements for approved proposals
- **MD** — Final executive (MD-level) approvals

Each tab shows the employees pending at that stage. You can approve individually or in bulk.

**Who uses it:** Approvers at each level (Gadget approver → HR Manager → Managing Director).

---

### 6. Increment List (`/increment-list`)
**Purpose:** View all finalized increment records.

- Filter by year, month, department, section.
- Shows previous gross, new gross, and the increment amount.
- Can be exported to Excel or PDF.

**Who uses it:** HR team for record-keeping and salary sheet verification.

---

### 7. History (`/increment-history`)
**Purpose:** Year-by-year salary increment log for every employee.

- Powerful column show/hide and drag-to-reorder system (same as Personnel List).
- See each year's increment amount for every employee.
- Filter by department, section, designation, or search by name/ID.

**Who uses it:** HR for auditing, trend analysis, and historical records.

---

## Typical Workflow

```
1. HR checks eligibility → Evaluation Propose
2. HR configures rules → Configurator
3. Managers enter amounts → Propose Increment
4. Finance reviews totals → Summary
5. Approvals at each level → Queue & Approvals
6. Finalized records saved → Increment List
7. Historical audit → History
```

---

## Key Design Decisions

- **Unified tab navigation** — All 7 sub-pages share a horizontal tab bar so users do not need the sidebar to move between steps.
- **Consistent header format** — Each page has a breadcrumb (Home > Evaluation > Page), a page title, and a one-line description.
- **Same visual language** — All pages use the same card, filter form, and table design patterns for consistency.
- **BLL Section 111 compliance** — The Evaluation Propose page explicitly flags employees who are legally entitled to an annual increment under Bangladesh Labour Law.
