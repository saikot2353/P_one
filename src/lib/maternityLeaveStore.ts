// Maternity Leave Store, State Management, and Mock Database
// Compliant with Bangladesh Labor Act 2006 (Section 46, 47, 48 - Maternity Benefits)

export interface MaternityDocument {
  id: string;
  name: string;
  type: "Prescription" | "USG_Report" | "NID" | "Declaration_Form" | "Doctor_Certificate" | "Other";
  size: string;
  uploadDate: string;
  fileUrl?: string;
  status: "Verified" | "Pending";
}

export interface PreviousMaternityHistory {
  id: string;
  leaveStartDate: string;
  leaveEndDate: string;
  totalDays: number;
  deliveryDate: string;
  childNumber: number; // 1st child, 2nd child, etc.
  benefitDisbursedBdt: number;
  hospitalName: string;
  remarks: string;
}

export interface FemaleEmployee {
  id: string;
  name: string;
  nameBn?: string;
  avatar: string;
  department: string;
  section: string;
  designation: string;
  unit: string;
  line: string;
  joiningDate: string; // YYYY-MM-DD
  phone: string;
  nid: string;
  dob: string;
  maritalStatus: "Married" | "Single" | "Divorced" | "Widowed";
  spouseName: string;
  emergencyContact: string;
  presentAddress: string;
  permanentAddress: string;
  grossSalary: number;
  basicSalary: number;
  livingChildrenCount: number;
  previousMaternityLeaves: PreviousMaternityHistory[];
}

export interface MedicalCheckupVisit {
  visitId: string;
  visitNumber: number;
  visitDate: string;
  doctorName: string;
  doctorRegNo: string;
  bloodPressure: string; // e.g. "120/80 mmHg"
  pulseRate: string; // e.g. "78 bpm"
  weightKg: number;
  gestationalWeeks: number;
  fetalHeartRate: string; // e.g. "142 bpm"
  hemoglobin: string; // e.g. "11.5 g/dL"
  bloodSugar: string; // e.g. "5.6 mmol/L"
  clinicalFindings: string;
  prescribedVitamins: string;
  nextFollowupDate: string | null; // null if final checkup
  medicalReports: string[];
}

export type MaternityStage =
  | "WELFARE_REGISTERED" // Employee registered at welfare, awaiting intake docs & consultation
  | "WELFARE_INITIATED" // Welfare intake complete, sent to Medical
  | "MEDICAL_FOLLOWUP" // Medical in progress (follow-up scheduled)
  | "MEDICAL_VERIFIED" // Medical checkup complete with EDD, sent back to Welfare
  | "WELFARE_LEAVE_SCHEDULED" // Welfare scheduled leave start & end date, sent to HR
  | "HR_APPROVED" // HR fully approved with Sanction Order
  | "HR_REVISION" // HR asked for revision
  | "HR_REJECTED"; // Rejected

export interface MaternityRequest {
  id: string; // e.g. "MAT-2026-001"
  employeeId: string;
  employee: FemaleEmployee;
  currentStage: MaternityStage;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;

  // 1. Welfare Verification (Stage 1 - Intake)
  welfareStage1: {
    intakeDate: string;
    welfareOfficerName: string;
    welfareOfficerId: string;
    informedPregnancyDate: string;
    tentativeTrimester: "1st Trimester (1-12 wks)" | "2nd Trimester (13-26 wks)" | "3rd Trimester (27+ wks)";
    serviceDurationText: string;
    isEligible: boolean;
    counselingNotes: string;
    attachedDocuments: MaternityDocument[];
    previousHistoryDisplayed: boolean;
  };

  // 2. Medical Verification
  medicalStage: {
    assignedDoctor: string;
    doctorRegNo: string;
    checkupVisits: MedicalCheckupVisit[];
    isFinalCheckupDone: boolean;
    expectedDeliveryDate: string; // EDD (YYYY-MM-DD)
    clinicalFitness: "Fit for Light Duty" | "Normal Health - Fit to Work" | "High Risk - Immediate Rest Advised";
    doctorFinalRemarks: string;
    medicalVerifiedAt: string | null;
  };

  // 3. Welfare Verification (Stage 2 - Leave Scheduling)
  welfareStage2: {
    expectedLeaveStartDate: string; // YYYY-MM-DD
    expectedLeaveEndDate: string; // YYYY-MM-DD
    rejoiningDate?: string; // YYYY-MM-DD (day immediately following leave end date)
    totalLeaveDays: number; // 112 days
    leaveAddress: string;
    emergencyContactPerson: string;
    emergencyPhone: string;
    welfareOfficerRemarks: string;
    submittedToHrAt: string | null;
  };

  // 4. HR Verification & Approval
  hrStage: {
    hrReviewerName: string | null;
    approvedAt: string | null;
    sanctionOrderNo: string | null; // e.g. "CRIPTON/HR/MAT/2026/089"
    hrRemarks: string | null;
    benefitEstimate: {
      grossMonthlyWage: number;
      dailyRate: number;
      total112DaysAmount: number;
      firstInstallment: number; // 50%
      secondInstallment: number; // 50%
    };
  };
}

// Female Employees Database
export const INITIAL_FEMALE_EMPLOYEES: FemaleEmployee[] = [
  {
    id: "2016003496",
    name: "মোসাঃ সাথী আক্তার",
    nameBn: "মোসাঃ সাথী আক্তার",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    department: "Admin and Compliance",
    section: "Medical",
    designation: "Senior Executive",
    unit: "Unit-01",
    line: "Line-A",
    joiningDate: "2016-02-13",
    phone: "01712-458921",
    nid: "19922692019000341",
    dob: "1992-04-15",
    maritalStatus: "Married",
    spouseName: "Md. Aminul Islam",
    emergencyContact: "01819-234567",
    presentAddress: "House 24, Road 4, Sector 10, Uttara, Dhaka",
    permanentAddress: "Vill: Joypur, PO: Mirzapur, Dist: Tangail",
    grossSalary: 35000,
    basicSalary: 21000,
    livingChildrenCount: 1,
    previousMaternityLeaves: [
      {
        id: "PREV-MAT-01",
        leaveStartDate: "2023-01-10",
        leaveEndDate: "2023-05-01",
        totalDays: 112,
        deliveryDate: "2023-03-07",
        childNumber: 1,
        benefitDisbursedBdt: 150769,
        hospitalName: "Enam Medical College Hospital, Savar",
        remarks: "First child (Baby boy). Delivered safely with normal delivery. Full 112 days benefit disbursed.",
      },
    ],
  },
  {
    id: "2020021174",
    name: "Mst. Rikta Akter",
    nameBn: "মোসাঃ রিক্তা আক্তার",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    department: "Sample & CAD",
    section: "Sample",
    designation: "Sample Coordinator",
    unit: "Unit-02",
    line: "Line-02",
    joiningDate: "2020-11-10",
    phone: "01823-987654",
    nid: "19965412349000128",
    dob: "1996-08-20",
    maritalStatus: "Married",
    spouseName: "Md. Kamal Hossain",
    emergencyContact: "01711-345678",
    presentAddress: "Ward 5, Ashulia, Savar, Dhaka",
    permanentAddress: "Vill: Shibpur, Upazila: Singair, Dist: Manikganj",
    grossSalary: 28500,
    basicSalary: 17100,
    livingChildrenCount: 0,
    previousMaternityLeaves: [],
  },
  {
    id: "2022031902",
    name: "Tania Sultana",
    nameBn: "তানিয়া সুলতানা",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    department: "Quality Assurance",
    section: "Finishing QA",
    designation: "Quality Inspector",
    unit: "Unit-03",
    line: "QA-01",
    joiningDate: "2022-03-15",
    phone: "01912-765432",
    nid: "19984512984560012",
    dob: "1998-11-05",
    maritalStatus: "Married",
    spouseName: "Md. Sohel Rana",
    emergencyContact: "01720-998877",
    presentAddress: "Dania, Jatrabari, Dhaka",
    permanentAddress: "Vill: Chandpur, PO: Matlab, Dist: Chandpur",
    grossSalary: 24000,
    basicSalary: 14400,
    livingChildrenCount: 0,
    previousMaternityLeaves: [],
  },
  {
    id: "2023018844",
    name: "Shahanaz Parvin",
    nameBn: "শাহনাজ পারভীন",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
    department: "Production RMG",
    section: "Sewing",
    designation: "Senior Sewing Operator",
    unit: "Unit-05",
    line: "Line-04",
    joiningDate: "2023-01-05",
    phone: "01688-123987",
    nid: "19957812349000456",
    dob: "1995-02-14",
    maritalStatus: "Married",
    spouseName: "Md. Anisur Rahman",
    emergencyContact: "01855-667788",
    presentAddress: "Kashimpur, Gazipur",
    permanentAddress: "Vill: Char Fashion, Dist: Bhola",
    grossSalary: 22500,
    basicSalary: 13500,
    livingChildrenCount: 2,
    previousMaternityLeaves: [
      {
        id: "PREV-MAT-02A",
        leaveStartDate: "2021-02-01",
        leaveEndDate: "2021-05-23",
        totalDays: 112,
        deliveryDate: "2021-03-25",
        childNumber: 1,
        benefitDisbursedBdt: 72000,
        hospitalName: "Gazipur Sadar Hospital",
        remarks: "First child (Daughter). Full benefit received.",
      },
      {
        id: "PREV-MAT-02B",
        leaveStartDate: "2023-06-15",
        leaveEndDate: "2023-10-04",
        totalDays: 112,
        deliveryDate: "2023-08-10",
        childNumber: 2,
        benefitDisbursedBdt: 86400,
        hospitalName: "Kumudini Hospital, Mirzapur",
        remarks: "Second child (Son). Full statutory benefit disbursed.",
      },
    ],
  },
  {
    id: "2026070119",
    name: "Nusrat Jahan Bristi",
    nameBn: "নুসরাত জাহান বৃষ্টি",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    department: "Merchandising",
    section: "Woven Merchandising",
    designation: "Trainee Merchandiser",
    unit: "Head Office",
    line: "Team-03",
    joiningDate: "2026-07-01", // Joined July 2026 (< 4 months from Oct 2026) -> INELIGIBLE DEMO
    phone: "01799-887766",
    nid: "20013456789012345",
    dob: "2001-09-18",
    maritalStatus: "Married",
    spouseName: "Tanvir Ahmed",
    emergencyContact: "01899-776655",
    presentAddress: "Mirpur DOHS, Dhaka",
    permanentAddress: "Vill: Goalondo, Dist: Rajbari",
    grossSalary: 32000,
    basicSalary: 19200,
    livingChildrenCount: 0,
    previousMaternityLeaves: [],
  },
];

// Calculate Service Duration and Check Eligibility (>= 6 Months)
export function checkMaternityEligibility(
  joiningDateStr: string,
  referenceDateStr: string = "2026-10-28"
): {
  isEligible: boolean;
  years: number;
  months: number;
  days: number;
  totalDays: number;
  durationFormatted: string;
  eligibilityMessage: string;
} {
  const joinDate = new Date(joiningDateStr);
  const refDate = new Date(referenceDateStr);

  const diffTime = refDate.getTime() - joinDate.getTime();
  const totalDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  let years = refDate.getFullYear() - joinDate.getFullYear();
  let months = refDate.getMonth() - joinDate.getMonth();
  let days = refDate.getDate() - joinDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(refDate.getFullYear(), refDate.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const durationParts: string[] = [];
  if (years > 0) durationParts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (months > 0) durationParts.push(`${months} ${months === 1 ? "month" : "months"}`);
  durationParts.push(`${days} ${days === 1 ? "day" : "days"}`);
  const durationFormatted = durationParts.join(", ");

  // Check eligibility against configured minimum working period
  const config = getMaternityVerificationConfig();
  const requiredDays = config.servicePeriodUnit === "MONTHS"
    ? config.minServicePeriodMonths * 30
    : config.minServicePeriodDays;

  const isEligible = totalDays >= requiredDays;

  let eligibilityMessage = "";
  if (isEligible) {
    eligibilityMessage = `Eligible for Maternity Leave and Benefit. Employee has completed ${durationFormatted} of continuous service (meets required ${config.minServicePeriodMonths} months / ${requiredDays} days threshold).`;
  } else {
    eligibilityMessage = `Not Eligible for Maternity Benefit. Employee has completed only ${durationFormatted} of service. Policy requires minimum ${config.minServicePeriodMonths} months (${requiredDays} days) continuous service with employer immediately preceding expected delivery date.`;
  }

  return {
    isEligible,
    years,
    months,
    days,
    totalDays,
    durationFormatted,
    eligibilityMessage,
  };
}

// Initial Mock Requests to provide rich data out of the box across all 3 pages
export const INITIAL_MATERNITY_REQUESTS: MaternityRequest[] = [
  {
    id: "MAT-2026-004",
    employeeId: "2023018844",
    employee: INITIAL_FEMALE_EMPLOYEES[3],
    currentStage: "MEDICAL_VERIFIED",
    statusLabel: "Medical Verified (Ready to Schedule Dates)",
    createdAt: "2026-10-10 10:00:00",
    updatedAt: "2026-10-28 11:30:00",
    welfareStage1: {
      intakeDate: "2026-10-10",
      welfareOfficerName: "Rozina Akter (Welfare Lead)",
      welfareOfficerId: "WLF-012",
      informedPregnancyDate: "2026-10-09",
      tentativeTrimester: "2nd Trimester (13-26 wks)",
      serviceDurationText: "3 years, 9 months",
      isEligible: true,
      counselingNotes:
        "Employee Shahanaz Parvin (Senior Sewing Operator, Unit-05) reported pregnancy. Service period exceeds statutory requirement (3y 9m). Two previous maternity deliveries verified on record. Completed welfare counseling and referred to Medical Clinic for full follow-up verification.",
      attachedDocuments: [
        {
          id: "DOC-301",
          name: "Doctor_Initial_Prescription.pdf",
          type: "Prescription",
          size: "1.4 MB",
          uploadDate: "2026-10-10",
          status: "Verified",
        },
        {
          id: "DOC-302",
          name: "USG_Fetal_Growth_Scan.pdf",
          type: "USG_Report",
          size: "2.8 MB",
          uploadDate: "2026-10-10",
          status: "Verified",
        },
        {
          id: "DOC-303",
          name: "Employee_NID_Document.pdf",
          type: "NID",
          size: "512 KB",
          uploadDate: "2026-10-10",
          status: "Verified",
        },
      ],
      previousHistoryDisplayed: true,
    },
    medicalStage: {
      assignedDoctor: "Dr. Farzana Yasmin, MBBS, DGO",
      doctorRegNo: "BMDC-A-45920",
      checkupVisits: [
        {
          visitId: "VISIT-01",
          visitNumber: 1,
          visitDate: "2026-10-14",
          doctorName: "Dr. Farzana Yasmin",
          doctorRegNo: "BMDC-A-45920",
          bloodPressure: "118/76 mmHg",
          pulseRate: "78 bpm",
          weightKg: 64.5,
          gestationalWeeks: 24,
          fetalHeartRate: "142 bpm",
          hemoglobin: "11.6 g/dL",
          bloodSugar: "5.3 mmol/L",
          clinicalFindings: "First clinical checkup. Single intrauterine pregnancy. Maternal vitals normal. Advised prenatal multivitamins.",
          prescribedVitamins: "Tab. Folic Acid 5mg, Cap. Iron polymaltose, Calcium daily.",
          nextFollowupDate: "2026-10-21",
          medicalReports: ["USG_Anomaly_Scan_Report.pdf"],
        },
        {
          visitId: "VISIT-02",
          visitNumber: 2,
          visitDate: "2026-10-21",
          doctorName: "Dr. Farzana Yasmin",
          doctorRegNo: "BMDC-A-45920",
          bloodPressure: "120/78 mmHg",
          pulseRate: "76 bpm",
          weightKg: 65.2,
          gestationalWeeks: 25,
          fetalHeartRate: "140 bpm",
          hemoglobin: "11.4 g/dL",
          bloodSugar: "5.5 mmol/L",
          clinicalFindings: "Second follow-up consultation. Fetal movements active. Growth parameters satisfactory. Repeat routine blood tests normal.",
          prescribedVitamins: "Continue prenatal supplements. Balanced nutrition advised.",
          nextFollowupDate: "2026-10-28",
          medicalReports: ["Routine_Blood_Report.pdf"],
        },
        {
          visitId: "VISIT-03",
          visitNumber: 3,
          visitDate: "2026-10-28",
          doctorName: "Dr. Farzana Yasmin",
          doctorRegNo: "BMDC-A-45920",
          bloodPressure: "116/74 mmHg",
          pulseRate: "74 bpm",
          weightKg: 66.0,
          gestationalWeeks: 26,
          fetalHeartRate: "138 bpm",
          hemoglobin: "11.8 g/dL",
          bloodSugar: "5.2 mmol/L",
          clinicalFindings: "Final follow-up visit successfully completed. Mother and fetus both in optimal health. Full clinical follow-up protocol finished.",
          prescribedVitamins: "Prenatal multivitamin continued.",
          nextFollowupDate: null,
          medicalReports: ["Final_Clinical_Fitness_Slip.pdf"],
        },
      ],
      isFinalCheckupDone: true,
      expectedDeliveryDate: "",
      clinicalFitness: "Normal Health - Fit to Work",
      doctorFinalRemarks:
        "All 3 medical follow-up consultations and clinical verifications completed. Patient is in healthy condition. Returned to Welfare Department for inputting Expected Delivery Date (EDD), computing statutory leave dates, and recording employee leave address.",
      medicalVerifiedAt: "2026-10-28 11:30:00",
    },
    welfareStage2: {
      expectedLeaveStartDate: "",
      expectedLeaveEndDate: "",
      totalLeaveDays: 112,
      leaveAddress: "",
      emergencyContactPerson: "Md. Anisur Rahman (Spouse)",
      emergencyPhone: "01855-667788",
      welfareOfficerRemarks: "",
      submittedToHrAt: null,
    },
    hrStage: {
      hrReviewerName: null,
      approvedAt: null,
      sanctionOrderNo: null,
      hrRemarks: null,
      benefitEstimate: {
        grossMonthlyWage: 22500,
        dailyRate: 865.38,
        total112DaysAmount: 96923,
        firstInstallment: 48462,
        secondInstallment: 48461,
      },
    },
  },
  {
    id: "MAT-2026-001",
    employeeId: "2016003496",
    employee: INITIAL_FEMALE_EMPLOYEES[0],
    currentStage: "WELFARE_LEAVE_SCHEDULED",
    statusLabel: "At HR Verification",
    createdAt: "2026-10-15 09:30:00",
    updatedAt: "2026-10-27 16:45:00",
    welfareStage1: {
      intakeDate: "2026-10-15",
      welfareOfficerName: "Rozina Akter (Welfare Lead)",
      welfareOfficerId: "WLF-012",
      informedPregnancyDate: "2026-10-14",
      tentativeTrimester: "2nd Trimester (13-26 wks)",
      serviceDurationText: "10 years, 8 months",
      isEligible: true,
      counselingNotes:
        "Employee personally informed Welfare Department regarding her 2nd pregnancy. Service tenure verified (> 10 years). Previous maternity leave in 2023 reviewed. All medical checkup slips attached for Medical Officer examination.",
      attachedDocuments: [
        {
          id: "DOC-001",
          name: "Hospital_Pregnancy_Confirmation_Scan.pdf",
          type: "Doctor_Certificate",
          size: "1.8 MB",
          uploadDate: "2026-10-15",
          status: "Verified",
        },
        {
          id: "DOC-002",
          name: "USG_Anomaly_Scan_Report.pdf",
          type: "USG_Report",
          size: "3.4 MB",
          uploadDate: "2026-10-15",
          status: "Verified",
        },
        {
          id: "DOC-003",
          name: "Employee_NID_Card_Copy.pdf",
          type: "NID",
          size: "640 KB",
          uploadDate: "2026-10-15",
          status: "Verified",
        },
      ],
      previousHistoryDisplayed: true,
    },
    medicalStage: {
      assignedDoctor: "Dr. Farzana Yasmin, MBBS, DGO",
      doctorRegNo: "BMDC-A-45920",
      checkupVisits: [
        {
          visitId: "VISIT-01",
          visitNumber: 1,
          visitDate: "2026-10-18",
          doctorName: "Dr. Farzana Yasmin",
          doctorRegNo: "BMDC-A-45920",
          bloodPressure: "115/75 mmHg",
          pulseRate: "76 bpm",
          weightKg: 62.4,
          gestationalWeeks: 26,
          fetalHeartRate: "144 bpm",
          hemoglobin: "11.8 g/dL",
          bloodSugar: "5.4 mmol/L",
          clinicalFindings: "Single active intrauterine pregnancy. Fundal height matches dates. Normal heart sounds.",
          prescribedVitamins: "Tab. Folic Acid 5mg, Cap. Iron polymaltose, Calcium + Vit D3 daily.",
          nextFollowupDate: "2026-10-25",
          medicalReports: ["USG_Report_18Oct2026.pdf"],
        },
        {
          visitId: "VISIT-02",
          visitNumber: 2,
          visitDate: "2026-10-25",
          doctorName: "Dr. Farzana Yasmin",
          doctorRegNo: "BMDC-A-45920",
          bloodPressure: "118/78 mmHg",
          pulseRate: "80 bpm",
          weightKg: 63.8,
          gestationalWeeks: 27,
          fetalHeartRate: "140 bpm",
          hemoglobin: "11.6 g/dL",
          bloodSugar: "5.2 mmol/L",
          clinicalFindings: "Follow-up physical checkup completed. Fetal movements good. No edema, normal BP. EDD determined.",
          prescribedVitamins: "Continue prenatal supplements. Recommended light walking.",
          nextFollowupDate: null, // Finalized!
          medicalReports: ["Blood_Routine_Report.pdf"],
        },
      ],
      isFinalCheckupDone: true,
      expectedDeliveryDate: "2026-12-25",
      clinicalFitness: "Normal Health - Fit to Work",
      doctorFinalRemarks:
        "Patient in good clinical condition. Verified Expected Delivery Date (EDD) is 25th December 2026. Advised to commence statutory leave 8 weeks prior or as scheduled by Welfare & HR.",
      medicalVerifiedAt: "2026-10-25 15:30:00",
    },
    welfareStage2: {
      expectedLeaveStartDate: "2026-11-01",
      expectedLeaveEndDate: "2027-02-20",
      rejoiningDate: "2027-02-21",
      totalLeaveDays: 112,
      leaveAddress: "House 24, Road 4, Sector 10, Uttara, Dhaka",
      emergencyContactPerson: "Md. Aminul Islam (Spouse)",
      emergencyPhone: "01712-458921",
      welfareOfficerRemarks:
        "Medical review completed and EDD confirmed as 25/12/2026. Expected leave schedule prepared for 112 days (8 weeks pre-delivery + 8 weeks post-delivery: 01/11/2026 to 20/02/2027). Submitted for HR final approval.",
      submittedToHrAt: "2026-10-27 16:45:00",
    },
    hrStage: {
      hrReviewerName: null,
      approvedAt: null,
      sanctionOrderNo: null,
      hrRemarks: null,
      benefitEstimate: {
        grossMonthlyWage: 35000,
        dailyRate: 1346.15,
        total112DaysAmount: 150769,
        firstInstallment: 75385,
        secondInstallment: 75385,
      },
    },
  },
  {
    id: "MAT-2026-002",
    employeeId: "2020021174",
    employee: INITIAL_FEMALE_EMPLOYEES[1],
    currentStage: "MEDICAL_FOLLOWUP",
    statusLabel: "At Medical Verification (Follow-up Scheduled)",
    createdAt: "2026-10-20 11:15:00",
    updatedAt: "2026-10-24 14:00:00",
    welfareStage1: {
      intakeDate: "2026-10-20",
      welfareOfficerName: "Rozina Akter (Welfare Lead)",
      welfareOfficerId: "WLF-012",
      informedPregnancyDate: "2026-10-19",
      tentativeTrimester: "2nd Trimester (13-26 wks)",
      serviceDurationText: "5 years, 11 months",
      isEligible: true,
      counselingNotes:
        "First pregnancy for Mst. Rikta Akter. Has completed 5+ years of continuous service. All primary doctor prescription slips uploaded.",
      attachedDocuments: [
        {
          id: "DOC-101",
          name: "Pregnancy_Doctor_Slip.pdf",
          type: "Prescription",
          size: "1.2 MB",
          uploadDate: "2026-10-20",
          status: "Verified",
        },
        {
          id: "DOC-102",
          name: "USG_Early_Scan.pdf",
          type: "USG_Report",
          size: "2.1 MB",
          uploadDate: "2026-10-20",
          status: "Verified",
        },
      ],
      previousHistoryDisplayed: true,
    },
    medicalStage: {
      assignedDoctor: "Dr. Farzana Yasmin, MBBS, DGO",
      doctorRegNo: "BMDC-A-45920",
      checkupVisits: [
        {
          visitId: "VISIT-01",
          visitNumber: 1,
          visitDate: "2026-10-24",
          doctorName: "Dr. Farzana Yasmin",
          doctorRegNo: "BMDC-A-45920",
          bloodPressure: "122/82 mmHg",
          pulseRate: "82 bpm",
          weightKg: 58.2,
          gestationalWeeks: 22,
          fetalHeartRate: "148 bpm",
          hemoglobin: "10.9 g/dL",
          bloodSugar: "5.8 mmol/L",
          clinicalFindings: "First clinical checkup completed. Mild anemia detected (Hb 10.9). Scheduled next follow-up.",
          prescribedVitamins: "Double iron dosage, elemental calcium, dietary protein enhancement.",
          nextFollowupDate: "2026-11-08",
          medicalReports: ["Hb_Test_Result.pdf"],
        },
      ],
      isFinalCheckupDone: false,
      expectedDeliveryDate: "",
      clinicalFitness: "Fit for Light Duty",
      doctorFinalRemarks: "Follow-up visit scheduled for 08/11/2026 to evaluate repeat hemoglobin and confirm EDD.",
      medicalVerifiedAt: null,
    },
    welfareStage2: {
      expectedLeaveStartDate: "",
      expectedLeaveEndDate: "",
      totalLeaveDays: 112,
      leaveAddress: "Ward 5, Ashulia, Savar, Dhaka",
      emergencyContactPerson: "Md. Kamal Hossain",
      emergencyPhone: "01711-345678",
      welfareOfficerRemarks: "",
      submittedToHrAt: null,
    },
    hrStage: {
      hrReviewerName: null,
      approvedAt: null,
      sanctionOrderNo: null,
      hrRemarks: null,
      benefitEstimate: {
        grossMonthlyWage: 28500,
        dailyRate: 1096.15,
        total112DaysAmount: 122769,
        firstInstallment: 61385,
        secondInstallment: 61385,
      },
    },
  },
  {
    id: "MAT-2026-003",
    employeeId: "2022031902",
    employee: INITIAL_FEMALE_EMPLOYEES[2],
    currentStage: "WELFARE_REGISTERED",
    statusLabel: "Welfare Registered (Awaiting Intake & Docs)",
    createdAt: "2026-10-26 14:20:00",
    updatedAt: "2026-10-26 14:20:00",
    welfareStage1: {
      intakeDate: "2026-10-26",
      welfareOfficerName: "Sharmin Sultana (Welfare Executive)",
      welfareOfficerId: "WLF-019",
      informedPregnancyDate: "",
      tentativeTrimester: "1st Trimester (1-12 wks)",
      serviceDurationText: "4 years, 7 months",
      isEligible: true,
      counselingNotes:
        "Tania Sultana reported pregnancy. Initial service tenure verified (4+ years - Statutory Eligible). Registered at Welfare. Instructed to bring doctor's consultation report and prescription for full intake and medical verification.",
      attachedDocuments: [],
      previousHistoryDisplayed: false,
    },
    medicalStage: {
      assignedDoctor: "Dr. Farzana Yasmin, MBBS, DGO",
      doctorRegNo: "BMDC-A-45920",
      checkupVisits: [],
      isFinalCheckupDone: false,
      expectedDeliveryDate: "",
      clinicalFitness: "Normal Health - Fit to Work",
      doctorFinalRemarks: "Awaiting welfare intake completion and document verification.",
      medicalVerifiedAt: null,
    },
    welfareStage2: {
      expectedLeaveStartDate: "",
      expectedLeaveEndDate: "",
      totalLeaveDays: 112,
      leaveAddress: "Dania, Jatrabari, Dhaka",
      emergencyContactPerson: "Md. Sohel Rana",
      emergencyPhone: "01720-998877",
      welfareOfficerRemarks: "",
      submittedToHrAt: null,
    },
    hrStage: {
      hrReviewerName: null,
      approvedAt: null,
      sanctionOrderNo: null,
      hrRemarks: null,
      benefitEstimate: {
        grossMonthlyWage: 24000,
        dailyRate: 923.08,
        total112DaysAmount: 103385,
        firstInstallment: 51693,
        secondInstallment: 51692,
      },
    },
  },

];

const LOCAL_STORAGE_KEY = "cripton_maternity_requests_v6";

export function getMaternityRequests(): MaternityRequest[] {
  if (typeof window === "undefined") return INITIAL_MATERNITY_REQUESTS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MATERNITY_REQUESTS));
      return INITIAL_MATERNITY_REQUESTS;
    }
    const parsed: MaternityRequest[] = JSON.parse(raw);
    let hasNew = false;
    INITIAL_MATERNITY_REQUESTS.forEach((initReq) => {
      if (!parsed.some((r) => r.id === initReq.id)) {
        parsed.push(initReq);
        hasNew = true;
      }
    });
    if (hasNew) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (err) {
    console.error("Error reading maternity requests from storage", err);
    return INITIAL_MATERNITY_REQUESTS;
  }
}

export function saveMaternityRequests(requests: MaternityRequest[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(requests));
    window.dispatchEvent(new CustomEvent("maternity-data-updated"));
  } catch (err) {
    console.error("Error saving maternity requests", err);
  }
}

// 0. Welfare Officer registers an employee for the first time (without intake details or documents)
export function registerWelfareMaternityEmployee(payload: {
  employee: FemaleEmployee;
  notes: string;
}): MaternityRequest {
  const currentRequests = getMaternityRequests();
  const nextNum = currentRequests.length + 1;
  const newId = `MAT-2026-${String(nextNum).padStart(3, "0")}`;

  const eligibility = checkMaternityEligibility(payload.employee.joiningDate);
  const dailyRate = Number((payload.employee.grossSalary / 26).toFixed(2));
  const total112Days = Math.round(dailyRate * 112);
  const installment = Math.round(total112Days / 2);

  const newRequest: MaternityRequest = {
    id: newId,
    employeeId: payload.employee.id,
    employee: payload.employee,
    currentStage: "WELFARE_REGISTERED",
    statusLabel: "Welfare Registered (Awaiting Intake & Docs)",
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    welfareStage1: {
      intakeDate: new Date().toISOString().substring(0, 10),
      welfareOfficerName: "Rozina Akter (Welfare Lead)",
      welfareOfficerId: "WLF-012",
      informedPregnancyDate: "",
      tentativeTrimester: "1st Trimester (1-12 wks)",
      serviceDurationText: eligibility.durationFormatted,
      isEligible: eligibility.isEligible,
      counselingNotes:
        payload.notes.trim() ||
        "Initial employee pregnancy registration recorded. Awaiting medical documents and consultation details upon next visit.",
      attachedDocuments: [],
      previousHistoryDisplayed: payload.employee.previousMaternityLeaves.length > 0,
    },
    medicalStage: {
      assignedDoctor: "Dr. Farzana Yasmin, MBBS, DGO",
      doctorRegNo: "BMDC-A-45920",
      checkupVisits: [],
      isFinalCheckupDone: false,
      expectedDeliveryDate: "",
      clinicalFitness: "Normal Health - Fit to Work",
      doctorFinalRemarks: "Awaiting welfare intake completion and document verification.",
      medicalVerifiedAt: null,
    },
    welfareStage2: {
      expectedLeaveStartDate: "",
      expectedLeaveEndDate: "",
      totalLeaveDays: 112,
      leaveAddress: payload.employee.presentAddress,
      emergencyContactPerson: payload.employee.spouseName || "Next of Kin",
      emergencyPhone: payload.employee.emergencyContact || payload.employee.phone,
      welfareOfficerRemarks: "",
      submittedToHrAt: null,
    },
    hrStage: {
      hrReviewerName: null,
      approvedAt: null,
      sanctionOrderNo: null,
      hrRemarks: null,
      benefitEstimate: {
        grossMonthlyWage: payload.employee.grossSalary,
        dailyRate: dailyRate,
        total112DaysAmount: total112Days,
        firstInstallment: installment,
        secondInstallment: installment,
      },
    },
  };

  const updated = [newRequest, ...currentRequests];
  saveMaternityRequests(updated);
  return newRequest;
}

// 0.5. Submit Welfare Intake & Documents for a registered employee, advancing to Medical Verification
export function submitWelfareIntakeAndDocs(
  requestId: string,
  payload: {
    welfareOfficerName?: string;
    welfareOfficerId?: string;
    informedPregnancyDate: string;
    tentativeTrimester: MaternityRequest["welfareStage1"]["tentativeTrimester"];
    counselingNotes: string;
    documents: MaternityDocument[];
  }
): MaternityRequest | null {
  const currentRequests = getMaternityRequests();
  const index = currentRequests.findIndex((r) => r.id === requestId);
  if (index === -1) return null;

  const target = { ...currentRequests[index] };
  target.currentStage = "WELFARE_INITIATED";
  target.statusLabel = "At Medical Verification (Initial Queue)";
  target.updatedAt = new Date().toISOString().replace("T", " ").substring(0, 19);
  target.welfareStage1 = {
    ...target.welfareStage1,
    informedPregnancyDate: payload.informedPregnancyDate,
    tentativeTrimester: payload.tentativeTrimester,
    counselingNotes: payload.counselingNotes,
    attachedDocuments: payload.documents,
    ...(payload.welfareOfficerName ? { welfareOfficerName: payload.welfareOfficerName } : {}),
    ...(payload.welfareOfficerId ? { welfareOfficerId: payload.welfareOfficerId } : {}),
  };

  currentRequests[index] = target;
  saveMaternityRequests(currentRequests);
  return target;
}

// 1. Welfare Officer creates and submits new Maternity Intake
export function createWelfareMaternityRequest(payload: {
  employee: FemaleEmployee;
  welfareOfficerName: string;
  welfareOfficerId: string;
  informedPregnancyDate: string;
  tentativeTrimester: MaternityRequest["welfareStage1"]["tentativeTrimester"];
  counselingNotes: string;
  documents: MaternityDocument[];
}): MaternityRequest {
  const currentRequests = getMaternityRequests();
  const nextNum = currentRequests.length + 1;
  const newId = `MAT-2026-${String(nextNum).padStart(3, "0")}`;

  const eligibility = checkMaternityEligibility(payload.employee.joiningDate);
  const dailyRate = Number((payload.employee.grossSalary / 26).toFixed(2));
  const total112Days = Math.round(dailyRate * 112);
  const installment = Math.round(total112Days / 2);

  const newRequest: MaternityRequest = {
    id: newId,
    employeeId: payload.employee.id,
    employee: payload.employee,
    currentStage: "WELFARE_INITIATED",
    statusLabel: "At Medical Verification (Initial Queue)",
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    welfareStage1: {
      intakeDate: new Date().toISOString().substring(0, 10),
      welfareOfficerName: payload.welfareOfficerName,
      welfareOfficerId: payload.welfareOfficerId,
      informedPregnancyDate: payload.informedPregnancyDate,
      tentativeTrimester: payload.tentativeTrimester,
      serviceDurationText: eligibility.durationFormatted,
      isEligible: eligibility.isEligible,
      counselingNotes: payload.counselingNotes,
      attachedDocuments: payload.documents,
      previousHistoryDisplayed: payload.employee.previousMaternityLeaves.length > 0,
    },
    medicalStage: {
      assignedDoctor: "Dr. Farzana Yasmin, MBBS, DGO",
      doctorRegNo: "BMDC-A-45920",
      checkupVisits: [],
      isFinalCheckupDone: false,
      expectedDeliveryDate: "",
      clinicalFitness: "Normal Health - Fit to Work",
      doctorFinalRemarks: "Awaiting in-person medical checkup.",
      medicalVerifiedAt: null,
    },
    welfareStage2: {
      expectedLeaveStartDate: "",
      expectedLeaveEndDate: "",
      totalLeaveDays: 112,
      leaveAddress: payload.employee.presentAddress,
      emergencyContactPerson: payload.employee.spouseName || "Next of Kin",
      emergencyPhone: payload.employee.emergencyContact || payload.employee.phone,
      welfareOfficerRemarks: "",
      submittedToHrAt: null,
    },
    hrStage: {
      hrReviewerName: null,
      approvedAt: null,
      sanctionOrderNo: null,
      hrRemarks: null,
      benefitEstimate: {
        grossMonthlyWage: payload.employee.grossSalary,
        dailyRate: dailyRate,
        total112DaysAmount: total112Days,
        firstInstallment: installment,
        secondInstallment: installment,
      },
    },
  };

  const updated = [newRequest, ...currentRequests];
  saveMaternityRequests(updated);
  return newRequest;
}

// 2. Medical Officer logs checkup visit, schedules follow-up, or completes final checkup with EDD
export function logMedicalVisitAndProcess(
  requestId: string,
  visit: Omit<MedicalCheckupVisit, "visitId" | "visitNumber">,
  isFinalCheckup: boolean,
  eddDate?: string,
  clinicalFitness?: MaternityRequest["medicalStage"]["clinicalFitness"],
  finalRemarks?: string
): MaternityRequest | null {
  const currentRequests = getMaternityRequests();
  const index = currentRequests.findIndex((r) => r.id === requestId);
  if (index === -1) return null;

  const target = { ...currentRequests[index] };
  const existingVisits = target.medicalStage.checkupVisits || [];
  const nextVisitNumber = existingVisits.length + 1;

  const newVisitRecord: MedicalCheckupVisit = {
    ...visit,
    visitId: `VISIT-${String(nextVisitNumber).padStart(2, "0")}`,
    visitNumber: nextVisitNumber,
  };

  const updatedVisits = [...existingVisits, newVisitRecord];
  target.medicalStage.checkupVisits = updatedVisits;
  target.updatedAt = new Date().toISOString().replace("T", " ").substring(0, 19);

  if (isFinalCheckup) {
    target.medicalStage.isFinalCheckupDone = true;
    if (eddDate) {
      target.medicalStage.expectedDeliveryDate = eddDate;
    }
    if (clinicalFitness) target.medicalStage.clinicalFitness = clinicalFitness;
    if (finalRemarks) target.medicalStage.doctorFinalRemarks = finalRemarks;
    target.medicalStage.medicalVerifiedAt = new Date().toISOString().replace("T", " ").substring(0, 19);

    // Moves back to Welfare Stage 2
    target.currentStage = "MEDICAL_VERIFIED";
    target.statusLabel = "Medical Verified (Ready for Leave Scheduling in Welfare)";

    if (eddDate) {
      // Pre-calculate suggested leave dates (typically 56 days before EDD to 56 days after EDD = 112 days)
      const edd = new Date(eddDate);
      const startDate = new Date(edd);
      startDate.setDate(edd.getDate() - 56);
      const endDate = new Date(edd);
      endDate.setDate(edd.getDate() + 55);

      target.welfareStage2.expectedLeaveStartDate = startDate.toISOString().substring(0, 10);
      target.welfareStage2.expectedLeaveEndDate = endDate.toISOString().substring(0, 10);
      target.welfareStage2.totalLeaveDays = 112;
    }
  } else {
    // Scheduled follow-up visit
    target.currentStage = "MEDICAL_FOLLOWUP";
    target.statusLabel = `At Medical Verification (Next Follow-up: ${visit.nextFollowupDate || "TBD"})`;
  }

  currentRequests[index] = target;
  saveMaternityRequests(currentRequests);
  return target;
}

// Helper: Calculate Re-joining date (day after leave end date)
export function calculateRejoiningDate(endDateStr: string): string {
  if (!endDateStr) return "";
  try {
    const parts = endDateStr.split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return "";
    const end = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
    if (isNaN(end.getTime())) return "";
    const rejoining = new Date(end);
    rejoining.setDate(end.getDate() + 1);
    const y = rejoining.getFullYear();
    const m = String(rejoining.getMonth() + 1).padStart(2, "0");
    const dayStr = String(rejoining.getDate()).padStart(2, "0");
    return `${y}-${m}-${dayStr}`;
  } catch {
    return "";
  }
}

// 3. Welfare Officer sets Expected Leave Start & End Date and submits to HR
export function submitWelfareLeaveScheduleToHr(
  requestId: string,
  data: {
    startDate: string;
    endDate: string;
    rejoiningDate?: string;
    totalDays: number;
    leaveAddress: string;
    emergencyContact: string;
    emergencyPhone: string;
    welfareRemarks: string;
  }
): MaternityRequest | null {
  const currentRequests = getMaternityRequests();
  const index = currentRequests.findIndex((r) => r.id === requestId);
  if (index === -1) return null;

  const target = { ...currentRequests[index] };
  target.welfareStage2 = {
    ...target.welfareStage2,
    expectedLeaveStartDate: data.startDate,
    expectedLeaveEndDate: data.endDate,
    rejoiningDate: data.rejoiningDate || (data.endDate ? calculateRejoiningDate(data.endDate) : ""),
    totalLeaveDays: data.totalDays,
    leaveAddress: data.leaveAddress,
    emergencyContactPerson: data.emergencyContact,
    emergencyPhone: data.emergencyPhone,
    welfareOfficerRemarks: data.welfareRemarks,
    submittedToHrAt: new Date().toISOString().replace("T", " ").substring(0, 19),
  };

  target.currentStage = "WELFARE_LEAVE_SCHEDULED";
  target.statusLabel = "At HR Verification (Pending Approval)";
  target.updatedAt = new Date().toISOString().replace("T", " ").substring(0, 19);

  currentRequests[index] = target;
  saveMaternityRequests(currentRequests);
  return target;
}

// 4. HR Officer Approves Maternity Leave Request and Issues Sanction Order
export function approveMaternityByHr(
  requestId: string,
  hrName: string,
  hrRemarks: string
): MaternityRequest | null {
  const currentRequests = getMaternityRequests();
  const index = currentRequests.findIndex((r) => r.id === requestId);
  if (index === -1) return null;

  const target = { ...currentRequests[index] };
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const sanctionNo = `CRIPTON/HR/MAT/2026/${randomSuffix}`;

  target.hrStage = {
    ...target.hrStage,
    hrReviewerName: hrName,
    approvedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    sanctionOrderNo: sanctionNo,
    hrRemarks: hrRemarks,
  };

  target.currentStage = "HR_APPROVED";
  target.statusLabel = "Approved by HR (Sanction Order Issued)";
  target.updatedAt = new Date().toISOString().replace("T", " ").substring(0, 19);

  currentRequests[index] = target;
  saveMaternityRequests(currentRequests);
  return target;
}

// 5. HR Officer Rejects Maternity Request
export function rejectMaternityByHr(
  requestId: string,
  hrName: string,
  reason: string
): MaternityRequest | null {
  const currentRequests = getMaternityRequests();
  const index = currentRequests.findIndex((r) => r.id === requestId);
  if (index === -1) return null;

  const target = { ...currentRequests[index] };
  target.hrStage = {
    ...target.hrStage,
    hrReviewerName: hrName,
    approvedAt: null,
    sanctionOrderNo: null,
    hrRemarks: `REJECTED: ${reason}`,
  };

  target.currentStage = "HR_REJECTED";
  target.statusLabel = "Rejected by HR";
  target.updatedAt = new Date().toISOString().replace("T", " ").substring(0, 19);

  currentRequests[index] = target;
  saveMaternityRequests(currentRequests);
  return target;
}


// ============================================================================
// MATERNITY VERIFICATION SETUP & BUSINESS RULES CONFIGURATION
// ============================================================================

export interface MaternityVerificationConfig {
  // 1. Minimum Working Period to Check Employee Eligibility
  minServicePeriodMonths: number; // default: 6
  minServicePeriodDays: number; // default: 180
  servicePeriodUnit: "MONTHS" | "DAYS";
  includeProbation: boolean;
  continuityRequirement: "STRICT_CONTINUOUS" | "CUMULATIVE";
  ineligibilityHandling: "BLOCK" | "ALLOW_WITH_OVERRIDE" | "WARNING_ONLY";

  // 2. Minimum Medical Follow-up Checkup Count
  minMedicalFollowupCount: number; // default: 3
  minFollowupIntervalDays: number; // default: 7
  enforceMinFollowupBeforeFinal: boolean;
  requireMandatoryVitals: boolean;
  allowEmergencyOverride: boolean;

  // 3. Leave Count Setup Previous & After Expected Delivery Date (EDD)
  preDeliveryLeaveDays: number; // default: 56 (8 weeks)
  postDeliveryLeaveDays: number; // default: 56 (8 weeks)
  totalLeaveDays: number; // default: 112 (16 weeks)
  rolloverUnspentPreNatal: boolean;
  preservePostNatalOnDelay: boolean;
  maxLivingChildrenForBenefit: number; // default: 2
  policyPreset: "BLA_2006_STANDARD" | "EXTENDED_180" | "CUSTOM";

  // Metadata
  updatedAt: string;
  updatedBy: string;
}

export const DEFAULT_MATERNITY_VERIFICATION_CONFIG: MaternityVerificationConfig = {
  minServicePeriodMonths: 6,
  minServicePeriodDays: 180,
  servicePeriodUnit: "MONTHS",
  includeProbation: true,
  continuityRequirement: "STRICT_CONTINUOUS",
  ineligibilityHandling: "BLOCK",

  minMedicalFollowupCount: 3,
  minFollowupIntervalDays: 7,
  enforceMinFollowupBeforeFinal: true,
  requireMandatoryVitals: true,
  allowEmergencyOverride: true,

  preDeliveryLeaveDays: 56,
  postDeliveryLeaveDays: 56,
  totalLeaveDays: 112,
  rolloverUnspentPreNatal: true,
  preservePostNatalOnDelay: true,
  maxLivingChildrenForBenefit: 2,
  policyPreset: "BLA_2006_STANDARD",

  updatedAt: "2026-10-31 10:00:00",
  updatedBy: "HR Compliance Authority",
};

const MATERNITY_CONFIG_STORAGE_KEY = "cripton_maternity_verification_config_v1";

export function getMaternityVerificationConfig(): MaternityVerificationConfig {
  if (typeof window === "undefined") return DEFAULT_MATERNITY_VERIFICATION_CONFIG;
  try {
    const raw = localStorage.getItem(MATERNITY_CONFIG_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MATERNITY_CONFIG_STORAGE_KEY, JSON.stringify(DEFAULT_MATERNITY_VERIFICATION_CONFIG));
      return DEFAULT_MATERNITY_VERIFICATION_CONFIG;
    }
    return { ...DEFAULT_MATERNITY_VERIFICATION_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_MATERNITY_VERIFICATION_CONFIG;
  }
}

export function saveMaternityVerificationConfig(
  config: Partial<MaternityVerificationConfig>
): MaternityVerificationConfig {
  const current = getMaternityVerificationConfig();
  const updated: MaternityVerificationConfig = {
    ...current,
    ...config,
    updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(MATERNITY_CONFIG_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("maternity-config-updated", { detail: updated }));
  }
  return updated;
}

export function resetMaternityVerificationConfig(): MaternityVerificationConfig {
  if (typeof window !== "undefined") {
    localStorage.setItem(MATERNITY_CONFIG_STORAGE_KEY, JSON.stringify(DEFAULT_MATERNITY_VERIFICATION_CONFIG));
    window.dispatchEvent(new CustomEvent("maternity-config-updated", { detail: DEFAULT_MATERNITY_VERIFICATION_CONFIG }));
  }
  return DEFAULT_MATERNITY_VERIFICATION_CONFIG;
}
