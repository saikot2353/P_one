# Zakat Management Module: Master Business Analysis & Technical Specification

**Document Version:** 1.2.0 (Multi-Dimensional Segregation & Flexible Recurring Model)  
**Effective Date:** 20 October 2026  
**Language Standard:** English Only  
**Module Name:** Welfare & Support &rarr; Zakat Management (`/zakat-list`, `/zakat-budget-configuration`)  
**Target Application:** CRIPTON HRIS & Enterprise Management System  
**Prepared For:** Executive Management & Development Team  

---

## 1. Executive Summary & Core Management Directives

Corporate Zakat at CRIPTON is governed as an impactful, multi-dimensional Islamic welfare and corporate social responsibility (CSR) mechanism. Management has identified three fundamental axes of Zakat governance:

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                       ZAKAT MULTI-DIMENSIONAL GOVERNANCE                      │
├─────────────────────┬───────────────────────────┬──────────────────────────────┤
│ 1. BENEFICIARY      │ 2. DISBURSEMENT MODE      │ 3. PURPOSE & LIVELIHOOD      │
│    CHANNEL          │    (AID FORM)             │    CATEGORY                  │
├─────────────────────┼───────────────────────────┼──────────────────────────────┤
│ • Direct Employee   │ • Direct Cash / Financial │ • Mosque / Madrasa           │
│   (Internal Staff)  │   (Cash / Bank / MFS)     │ • Medical Treatment          │
│ • Via Employee Agent│ • In-Kind Asset Purchased │ • Vehicle / Transport (Auto) │
│   (Employee Rep)    │   (Physical Asset, Shop,  │ • Farm Animal (Cow / Goat)   │
│ • Direct External   │    Van, Cattle Purchased) │ • Business Setup (Tea Stall) │
│   (Outside Recipient│                           │ • Others (Custom Input)      │
└─────────────────────┴───────────────────────────┴──────────────────────────────┘
```

---

## 2. Management Requirements Deep-Dive & Translation

### 2.1 Beneficiary Channel Segregation (Target Recipient & Route)
Management must be able to generate separate reports answering:
1. **Direct to Employee:** How much Zakat did the company pay directly to internal company employees who qualify under Asnaf categories (e.g. low-income staff medical crisis, destitute family support)?
2. **Via Employee as Agent:** How much did the company disburse by giving funds to an employee who acted as a trusted representative to distribute to verified poor individuals or families in their village?
3. **Direct to Outside Individual / Institution:** How much was disbursed directly by company management to external people (widows, destitute individuals) or institutions (Mosques, Madrasas, Orphanages)?

### 2.2 Disbursement Mode / Aid Form (Cash Grant vs. Asset Purchase)
Management explicitly highlighted: *"Did we give cash directly, or buy physical assets like a shop/stall, rickshaw, auto, or livestock?"*
1. **Direct Cash / Financial Transfer:** Direct financial assistance where cash, cheque, or bank/MFS transfer is handed over to the beneficiary.
2. **In-Kind Asset / Item Purchased:** The company does **not** give liquid cash; instead, the company buys and hands over a physical, productive income-generating asset or covers a direct vendor bill:
   - **Vehicle / Transport:** Electric battery auto-rickshaw, cargo van, manual rickshaw.
   - **Farm Animal / Livestock:** Milking cow, breeding goats, poultry livestock.
   - **Business Setup / Micro-Enterprise:** Tea stall setup (wooden stall, stove, gas cylinder, utensils), grocery store initial stock, tailoring machine.
   - **Medical Bills:** Hospital surgery package or pharmacy bill paid directly to hospital/diagnostic counter.

### 2.3 Flexible Automated Recurring Stipends (Monthly Regular Allowance)
* The recurring monthly allowance is **not** a rigid ৳10,000; it is **fully customizable** to whatever amount management decides (e.g., ৳3,000, ৳5,000, ৳8,000, ৳10,000, ৳15,000, ৳25,000+).
* Provide quick-selection amount chips alongside a custom amount input.
* Automatic monthly ledger generation on schedule without manual monthly re-entry.

---

## 3. Data Architecture & TypeScript Specification

```typescript
// 1. Disbursement Channel
export type ZakatDisbursementChannel =
  | "Direct Employee"        // Directly to internal company employee
  | "Via Employee Agent"     // Handed to employee to distribute to village poor
  | "Direct External";       // Directly to outside individual or institution

// 2. Disbursement Mode (Cash vs. Asset)
export type ZakatDisbursementMode =
  | "Cash Grant"             // Direct cash, cheque, bank, or MFS transfer
  | "Asset Purchased";       // Physical productive asset purchased (shop, vehicle, livestock)

// 3. Purpose Category (Management Directive)
export type ZakatPurposeCategory =
  | "Mosque/Madrasa"
  | "Medical Treatment"
  | "Vehicle"
  | "Farm Animal"
  | "Business Setup"
  | "Others";

// 4. Asset Details Interface
export interface ZakatAssetDetails {
  assetName: string;           // e.g. "Auto Van", "Dairy Cow", "Tea Stall Counter + Stove"
  assetQuantity?: string;      // e.g. "1 Unit", "2 Goats"
  vendorOrMarket?: string;     // e.g. "Sreepur Bazar", "Gafargaon Hat"
  invoiceRef?: string;         // Purchase receipt number
}

// 5. Complete Zakat Record Interface
export interface ZakatRecord {
  id: string;
  budgetYear: number;
  assignedDate: string;
  distributionDeadline: string;
  amount: number;
  
  // Three Core Governance Axes:
  disbursementChannel: ZakatDisbursementChannel;
  disbursementMode: ZakatDisbursementMode;
  purposeCategory: ZakatPurposeCategory;
  
  // Asset Specifications (when mode === "Asset Purchased")
  assetDetails?: ZakatAssetDetails;
  
  // Custom Purpose (when purposeCategory === "Others")
  otherPurposeDetails?: string;
  purposeSpecificDescription?: string;
  
  // Beneficiary & Agent Identity
  employeeId?: string;
  employeeName?: string;
  employeeDept?: string;
  employeeDesignation?: string;
  
  beneficiaryName: string;
  beneficiaryPhone?: string;
  beneficiaryAddress?: string;
  beneficiaryNid?: string;
  
  institutionName?: string;
  institutionType?: "Madrasa" | "Mosque" | "Orphanage" | "Hospital" | "Trust/NGO" | "Other";
  institutionRepresentative?: string;
  institutionContactPhone?: string;
  
  // Compliance & Distribution Workflow
  asnafCategory: "Al-Fuqara" | "Al-Masakin" | "Al-Gharimin" | "Fi Sabilillah" | "Ibnus-Sabil";
  justificationDetails: string;
  agencyStatus: "Assigned" | "Acknowledged" | "Distributed" | "Verified";
  
  // Recurring Linkage
  isRecurring?: boolean;
  recurringScheduleId?: string;
  installmentNumber?: number;
  installmentTotal?: number;
  
  proofDetails?: {
    receiptRef: string;
    witnessName: string;
    witnessPhone: string;
    notes: string;
    submittedAt: string;
  };
}

// 6. Flexible Recurring Schedule Model
export interface RecurringZakatSchedule {
  id: string;
  title: string;
  disbursementChannel: ZakatDisbursementChannel;
  disbursementMode: ZakatDisbursementMode;
  purposeCategory: ZakatPurposeCategory;
  otherPurposeDetails?: string;
  purposeDescription: string;
  
  // Beneficiary Identity
  employeeId?: string;
  employeeName?: string;
  beneficiaryName: string;
  beneficiaryPhone?: string;
  institutionName?: string;
  
  // Dynamic Amount (not hardcoded to 10k)
  monthlyAmount: number;
  disbursementDayOfMonth: number;
  startDate: string;
  endDate?: string;
  totalPlannedMonths?: number;
  
  status: "Active" | "Paused" | "Completed" | "Cancelled";
  installmentsGenerated: number;
  totalAmountDisbursed: number;
  lastGeneratedDate?: string;
  nextDueDate: string;
  createdAt: string;
  notes?: string;
}
```

---

## 4. Multi-Dimensional Reporting & Matrix Specification

### Report Dimension 1: Beneficiary Channel Breakdown
```
---------------------------------------------------------------------------------------------------------
Disbursement Channel             Cash Grants (৳)   Assets Purchased (৳)   Total Disbursed (৳)   Share (%)
---------------------------------------------------------------------------------------------------------
1. Direct Employee (Internal)    ৳ 120,000         ৳ 45,000               ৳ 165,000             20.6%
2. Via Employee Agent (Proxy)    ৳ 50,000          ৳ 140,000              ৳ 190,000             23.8%
3. Direct External (Outside)     ৳ 210,000         ৳ 235,000              ৳ 445,000             55.6%
---------------------------------------------------------------------------------------------------------
Total                            ৳ 380,000         ৳ 420,000              ৳ 800,000            100.0%
---------------------------------------------------------------------------------------------------------
```

### Report Dimension 2: Purpose & Asset Purchase Matrix
```
---------------------------------------------------------------------------------------------------------
Purpose Category           Cash Given (৳)    Asset / Item Bought (৳)   Total (৳)    Primary Assets Provided
---------------------------------------------------------------------------------------------------------
Mosque / Madrasa           ৳ 160,000         ৳ 20,000                  ৳ 180,000    Books, Food Stock, Renovation
Medical Treatment          ৳ 185,000         ৳ 20,000                  ৳ 205,000    Surgery Package, Medicines
Vehicle (Livelihood)       ৳ 0               ৳ 115,000                 ৳ 115,000    Electric Vans, Rickshaws
Farm Animal (Livestock)    ৳ 0               ৳ 140,000                 ৳ 140,000    Cows, Breeding Goats
Business Set-up            ৳ 15,000          ৳ 95,000                  ৳ 110,000    Tea Stall Units, Grocery Stock
Others                     ৳ 20,000          ৳ 30,000                  ৳ 50,000     Reconstruction Materials
---------------------------------------------------------------------------------------------------------
Total                      ৳ 380,000         ৳ 420,000                 ৳ 800,000
---------------------------------------------------------------------------------------------------------
```

---

## 5. UI/UX Design System & Layout Polish

1. **Clean Header & Top Navigation:**
   - Soft borders, refined typography, responsive actions dock.
   - Quick search with debounce.
2. **Interactive Top KPI Cards:**
   - Macro Budget & Remaining Balance.
   - **3-Way Channel Split Cards:** `Direct Employee`, `Via Employee Agent`, `Direct External`.
   - **2-Way Mode Split Cards:** `Cash / Financial` vs. `Asset / Items Purchased`.
   - **Monthly Recurring Active Commitments:** Shows dynamic total committed per month.
3. **Integrated Ledger Filter Toolbar:**
   - Comprehensive dropdown filters for Beneficiary Channel, Aid Mode, Purpose Category, Grant Type, and Status — keeping the page compact, clean, and free of vertical clutter.
4. **Modal Form Refinements:**
   - Multi-step segmented form with clean Radio Cards for Channel and Mode.
   - Dynamic asset fields appearing when "Asset Purchased" is selected.
   - Amount input with quick chips for recurring (e.g. ৳3k, ৳5k, ৳8k, ৳10k, ৳15k, ৳20k, custom).
5. **Print & CSV Report Integration:**
   - Generates official management statement with company letterhead styling.

---

## 6. Clickable Itemized Drill-Down Detail Report Architecture

As per management requirements, every aggregated figure in the Executive Reports is interactive and clickable:

1. **Click-to-Inspect Interaction:**
   - Clicking any purpose row or cell (e.g., **Medical Treatment**, **Vehicle**, **Farm Animal**, etc.) opens an itemized widescreen audit modal (`Medical Treatment — Itemized Distribution Details`).
   - Clicking any disbursement channel row (e.g., **Direct Employee**, **Via Employee Agent**, **Direct External**) displays all underlying cases belonging to that channel.
   - Clicking specific sub-figures (e.g. Cash Grants vs. Assets Purchased) pre-filters the itemized list instantly.

2. **Detailed Itemized Breakdown per Case:**
   - **Table Structure:** Standard corporate table layout with standard column borders, clear padding, and high readability. No icon/emoji clutter or nested card widgets.
   - **Case ID & Date:** Internal tracking identifier, allocation date, purpose category, and recurring installment tag.
   - **Beneficiary & Location:** Recipient or institution name, contact number, and clear text address.
   - **Channel & Delivery Agent:** Clear text indicator of delivery channel (`Direct Staff`, `Via Staff Agent`, or `Direct External`) with proxy names and IDs.
   - **Aid Mode & What Was Given:**
     - **If Cash Grant:** Plain-text description of aid purpose and clinical or welfare justification.
     - **If In-Kind Asset Purchased:** Asset item name, quantity, purchase showroom/market, and official vendor invoice number.
   - **Shariah Asnaf & Compliance:** Asnaf eligibility category, clean text distribution status badge (`Verified` / `Assigned`), and voucher receipt reference.
   - **Disbursed Amount:** Bold BDT amount.
   - **Audit Action ("Inspect"):** Standard action button opening the complete verification dossier with handover proof, witness details, and notes.

3. **In-Modal Dynamic Controls:**
   - Executive KPI ribbon summarizing Total in Scope, Cash Grants total, Asset Purchases total, and Beneficiary count in clean, neutral corporate metric cards.
   - Multi-field live search (searches across names, phone numbers, hospitals, clinics, addresses, asset names, and invoice numbers).
   - Instant Aid Mode toggle buttons (`All Modes`, `Cash Grants`, `Assets Purchased`).
   - Dynamic Purpose and Channel select dropdowns.
   - One-click detailed CSV export and Print statement.

---

## 7. 1-Year Advance Lump Sum & Dynamic Stipend Architecture ("1 Bochorer Ta Ekbare")

In enterprise Zakat management, welfare cases frequently require disbursing an entire annual entitlement upfront rather than waiting for month-by-month periodic cycles (e.g. paying an entire 1-year university tuition, annual house repair lease, or upfront emergency therapy).

### 7.1 Core Governance Specifications
1. **Settlement Modes:**
   - **Periodic Scheduled Batches:** Installments run on the selected cadence (Monthly, Quarterly, Bi-Annual) via the recurring scheduler.
   - **⚡ 1-Year Full Advance Upfront:** All 12 months (or custom duration) are paid in advance in a single lump-sum payout (`Base Monthly Rate × Duration Months`).
2. **Immediate Ledger Synchronization:**
   - When a 1-Year Advance schedule is established, a single advance record is immediately posted to the primary Zakat disbursement ledger.
   - Deducted in real time from the corporate annual Zakat budget pool.
   - Tagged with `⚡ Full 1-Year Advance (12 Months Upfront)` badge, preventing repetitive month-to-month auto-generation while fulfilling full 1-year audit compliance.
3. **Instant 1-Click Advance Settlement on Active Mandates:**
   - For active recurring schedules with remaining unpaid months, an instant `"⚡ Settle 1-Year Advance Now"` action button enables managers to calculate remaining months, choose payment transfer details, and settle the remaining period upfront in a single transaction.
4. **Dynamic Payment Methods & Evidence:**
   - Supported channels: Bank Transfer (IBBL, Standard Chartered, City Bank), Mobile Financial Services (bKash, Nagad, Rocket), Cash Handover, and In-Kind delivery.
   - Multi-file uploaded mandate proofs (medical board approvals, academic enrollment letters, vouchers) stored with direct preview and download capabilities.

---

## 8. Official Zakat Money Receipt & Disbursement Voucher Architecture ("Proper Receipt Modal View")

In response to executive governance requirements, record inspections must not be rendered in cramped side drawers, but in an **authoritative, centered Modal Window** presenting an official, formal Zakat Money Receipt & Disbursement Voucher.

### 8.1 Voucher Design & Document Structure
1. **Centered Modal Canvas:**
   - High-density centered modal window (`max-w-4xl`) with backdrop blur, printable canvas, and zero icon/emoji clutter.
2. **Corporate & Welfare Identity:**
   - Formal entity title: **Pakiza Knit Composite Ltd. Corporate Welfare, CSR & Shariah Zakat Fund**.
   - Official voucher numbering: `VR-[Case ID]` (e.g. `VR-ZK-2026-03`).
   - Official compliance stamp: Boxed status seal (`VERIFIED & AUDITED COMPLIANT`, `DISTRIBUTED — PENDING FINAL AUDIT`, or `DISPATCHED`).
3. **Beneficiary & Delivery Parties Particulars (2-Column Grid):**
   - **Beneficiary Information (গ্রহীতার বিবরণ):** Recipient/Institution Name, Phone, National ID / Proof, Present Location, and Shariah Asnaf classification with theological explanation.
   - **Channel & Delivery Trustee (বিতরণ মাধ্যম ও প্রতিনিধি):** Disbursement Channel (`Direct Employee`, `Via Employee Agent`, or `Direct External`), Staff Trustee details (Name, EMP ID, Dept), Target Deadline, and Handover Method.
4. **Itemized Aid Particulars (The Core Receipt Ledger):**
   - Itemized SL, Particulars & Narrative, Aid Medium (Cash vs. In-Kind Asset), Asnaf Category, and Disbursed Amount.
   - **In-Kind Asset Specifications:** Full showroom/market vendor, unit quantity, cash memo reference, and inspection notes.
   - **Recurring Stipend Breakdown:** Installment count (e.g., `#1 of 12`), schedule ID, and lump-sum advance notation.
   - **Grand Total & Amount in Words:** Bold numeric sum alongside Bangladeshi Taka amount written in formal words (e.g. *"Thirty Thousand Taka Only"*).
5. **Verification Dossier & Supporting Attachments:**
   - Formal handover receipt reference, verified witness name & telephone, audit notes, and direct download links for attached prescriptions, invoices, and signed money receipts.
6. **Formal 4-Column Signature & Audit Endorsement Row:**
   - `Received By (Beneficiary Signature)`
   - `Handover Trustee (Staff Agent / Proxy)`
   - `Verified By (HR & Shariah Auditor)`
   - `Approved By (Managing Director / Board of Trustees)`
7. **Action Bar & Print Engine:**
   - Print-ready CSS (`@media print`) and instant `Print Voucher`, `Verify & Complete`, `Submit Proof`, and `Delete Record` operations.


