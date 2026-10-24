# Lunch Deduction Smart Solution Architecture
**Module:** `/payroll-deductions`  
**Purpose:** Automated, policy-driven handling of complex regional, seasonal, and attendance lunch deduction rules.

---

## 1. Executive Summary
In factory and corporate HR operations, canteen lunch deduction is not a flat one-size-fits-all deduction. It involves:
1. **Prepaid Cycle & New Joining Catch-up:** Prepaid deduction where first-month joiners must pay arrear + advance, with prorated amounts based on joining cutoff dates.
2. **Seasonal Religious Exemption (Ramadan):** Automated waiver for fasting Muslim employees during Ramadan, while continuing normal canteen billing for non-fasting or non-Muslim staff.
3. **High Volume Non-Consumer Management:** Efficiently handling situations where 60%+ of employees (out of 400+) do not avail canteen lunch, avoiding manual line-by-line ticking.

---

## 2. Business Cases & Smart Solutions

### Case 1: Prepaid Regional Policy & New Joiner Catch-up
* **Context:**
  - In certain regions/plants, lunch fee is collected on a **Prepaid** basis (next month's fee is deducted from the current month's salary).
  - Regular monthly lunch fee: **৳ 1,000**.
  - A newly joined employee had no prior month payroll, so advance deduction was impossible.
* **Smart Solution (Automated Joining-Date Rule):**
  - **Payment Mode Setting:** Region/Unit configuration defines `Billing Mode: [ Prepaid | Postpaid ]`.
  - When payroll processes the **First Salary** of an employee:
    - **Condition A (Joined on or before 10th of the month):**
      - Current Month Arrear: **৳ 1,000** (Full month)
      - Next Month Prepaid Advance: **৳ 1,000**
      - **Total Deduction in 1st Month:** **`৳ 2,000`**
    - **Condition B (Joined after 10th of the month):**
      - Current Month Arrear: **৳ 500** (Half month / 50% prorated)
      - Next Month Prepaid Advance: **৳ 1,000**
      - **Total Deduction in 1st Month:** **`৳ 1,500`**
  - **Subsequent Months (Month 2 onwards):**
    - The employee automatically enters the regular cycle: **`৳ 1,000`** per month.
  - **Payroll Audit Trail:**
    - The deduction ledger displays the detailed breakdown tooltip:  
      `1st Month: Arrear (৳500/৳1000) + Advance Next Month (৳1000)`.

---

### Case 2: Ramadan Month & Religion-Based Exemption
* **Context:**
  - During the Holy Month of Ramadan, Muslim employees observe fasting and the main lunch service is paused/not consumed, resulting in **৳ 0** deduction.
  - Non-Muslim employees (Hindu, Christian, Buddhist, etc.) continue to receive canteen service, requiring their regular deduction (e.g. ৳ 1,000).
* **Smart Solution (Ramadan Seasonal Mode + Religion Filter):**
  - **Global / Payroll Month Toggle:**
    - `[✓] Ramadan Month Active (Select Month: e.g., March / April)`
  - **Execution Engine:**
    - Reads `employee.religion` from the Employee Master Data.
    - If `Ramadan Active === true`:
      - **Muslim Employees:** Lunch Deduction = **`৳ 0`** (Status Tag: `Ramadan Exempted`).
      - **Non-Muslim Employees:** Normal Lunch Deduction = **`৳ 1,000`** (Status Tag: `Canteen Active`).
  - **HR Manual Override Flexibility:**
    - Provides a quick toggle checkbox per employee row in case a non-Muslim opts out or a specific employee requires custom adjustment.

---

### Case 3: High-Volume Opt-In / Opt-Out Management (400+ Staff, 60% Opted Out)
* **Context:**
  - Out of 400+ employees in a unit, ~240 (60%) do not use canteen lunch.
  - Manually zeroing out 240 rows every single month creates severe administrative friction and human error risk.
* **Smart Solution (3 Modular Approaches):**

#### Approach A: "Opt-In Subscription Model" (Recommended & Standard ERP)
* In Employee Profile / Job Setup:
  - Add flag: `Lunch Availed: [ Yes | No ]` (Default: `No`).
* Only employees who officially register with the canteen manager have `Lunch Availed = Yes` (~160 employees).
* When payroll runs **"Calculate Lunch Deductions"**:
  - Only active subscribers (40%) get billed.
  - The remaining 60% are automatically calculated as **৳ 0**.
* Subscribing / unsubscribing is done on an exception basis (only when someone joins or leaves the canteen meal plan).

#### Approach B: 1-Click Canteen CSV / Excel Import
* Canteen supervisor provides an Excel sheet of meal consumers for the month.
* Payroll has an **"Import Canteen Consumer List"** button:
  - Upload matching `EmpID`.
  - System instantaneously updates lunch deduction for listed IDs and sets others to `0`.

#### Approach C: Daily Punch / Token Machine Integration
* If the plant uses a canteen card/fingerprint scanner:
  - System counts `Actual Meals Consumed` from daily logs.
  - Automatically charges `Days × Rate per Day` or triggers the monthly flat rate if threshold days are met.

---

## 3. Calculation Matrix Summary

| Scenario | Religion | Join Date | Month Type | Regular Fee | 1st Month Arrear | Advance Prepaid | Total Deducted |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Existing Employee** | Any | Prior Months | Regular | ৳ 1,000 | ৳ 0 | ৳ 1,000 | **৳ 1,000** |
| **New Joiner (<= 10th)** | Any | 05th Current | Regular | ৳ 1,000 | ৳ 1,000 | ৳ 1,000 | **৳ 2,000** |
| **New Joiner (> 10th)** | Any | 18th Current | Regular | ৳ 1,000 | ৳ 500 | ৳ 1,000 | **৳ 1,500** |
| **Ramadan (Muslim)** | Muslim | Prior Months | Ramadan | ৳ 1,000 | ৳ 0 | ৳ 0 | **৳ 0** |
| **Ramadan (Non-Muslim)**| Hindu/Other | Prior Months | Ramadan | ৳ 1,000 | ৳ 0 | ৳ 1,000 | **৳ 1,000** |
| **Opted-out Employee** | Any | Any | Any | ৳ 0 | ৳ 0 | ৳ 0 | **৳ 0** |

---

## 4. Proposed UI & Workflow in `/payroll-deductions`

1. **Top Configuration Drawer:**
   - **Billing Scheme:** `[ Prepaid ]` vs `[ Postpaid ]`
   - **Monthly Flat Fee:** `৳ 1,000`
   - **Joining Prorate Cut-off Day:** `Day 10`
   - **Ramadan Period Active:** `[ Toggle ON / OFF ]`
2. **Bulk Action Toolbar:**
   - `[ Auto-Calculate Lunch Deductions ]`
   - `[ Import Canteen List (Excel) ]`
   - `[ Batch Opt-In / Opt-Out ]`
3. **Table Columns:**
   - `Emp ID`
   - `Name`
   - `Religion`
   - `Join Date`
   - `Lunch Status` *(Active / Exempted / Opted Out)*
   - `Calculation Note` *(e.g. "1st Mo Arrear 500 + Adv 1000")*
   - `Lunch Deduction (Editable ৳)`
