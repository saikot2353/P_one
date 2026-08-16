// ────────────────────────────────────────────────────────────────────────────────
// KPI MODULE — SHARED DATA LAYER
// Central data management for the entire Performance Management System
// ────────────────────────────────────────────────────────────────────────────────

const KPI_DATA_VERSION = "kpi_v3";

// ── INTERFACES ──────────────────────────────────────────────────────────────────

export interface ScoringRubric {
  excellent: string;
  good: string;
  average: string;
  poor: string;
}

export interface KpiCriteria {
  id: string;
  category: "Core Competency" | "Technical" | "Behavioral" | "Organizational";
  criteriaName: string;
  criteriaDetail: string;
  weight: number; // percentage weight (all should sum to 100%)
  maxScore: number; // max score for this criteria
  scoringRubric: ScoringRubric;
  department: string;
  status: "Active" | "Inactive";
}

export interface GradeBand {
  id: string;
  pointFrom: number;
  pointTo: number;
  grade: string;
  assessment: string;
  color: string;
  incrementEligible: boolean;
  promotionEligible: boolean;
  status: "Active" | "Inactive";
}

export interface KpiCycle {
  id: string;
  name: string;
  type: "Annual" | "Mid-Year" | "Probation" | "Custom";
  startDate: string;
  endDate: string;
  status: "Draft" | "Active" | "Closed" | "Archived";
  departments: string[];
  employees?: string[];
  totalEmployees: number;
  completedCount: number;
  createdAt: string;
}

export interface CriteriaScore {
  criteriaId: string;
  hodScore: number;
  selfScore: number;
  notes: string;
}

export interface KpiAssessment {
  id: string;
  cycleId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  section: string;
  designation: string;
  grossSalary: number;

  // Workflow state
  currentStep: number; // 1=HOD, 2=HR, 3=PlantHead, 4=MD, 5=Final
  completedSteps: number[];

  // Criteria scores
  criteriaScores: CriteriaScore[];
  totalWeightedScore: number;
  gradeResult: string;
  gradeBandId: string;

  // HOD
  hodManualMarks: number;
  hodRecommendation: string;
  improvementPlan: string;
  specialComments: string;
  jdDetails: string;

  // HR
  hrdStrength: string;
  hrdImprovementPlan: string;
  hrdSpecialComments: string;

  // Plant Head
  plantHeadComments: string;
  plantHeadApproval: string;

  // MD
  mdComments: string;
  mdApproval: string;

  // HOD Proposals
  hodProposedInc?: number;
  hodProposedPromotion?: string;
  hodProposedDesignation?: string;

  // HR Proposals
  hrProposedInc?: number;

  // Plant Head Proposals
  plantHeadProposedInc?: number;

  // MD Proposals
  mdProposedInc?: number;

  // Final
  incAmount: number;
  givePromotion: string;
  newDesignation: string;
  effectYear: string;
  effectMonth: string;
  finalNotes: string;
  newGrossSalary: number;

  status: "Pending" | "In Progress" | "Completed" | "On Hold";
  createdAt: string;
  completedAt: string;
}

export interface SelfAssessment {
  id: string;
  cycleId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  scores: { criteriaId: string; score: number; justification: string }[];
  totalScore: number;
  overallComments: string;
  status: "Draft" | "Submitted" | "Reviewed";
  submittedAt: string;
}

export interface PeerReview {
  id: string;
  cycleId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerDesignation: string;
  revieweeId: string;
  revieweeName: string;
  revieweeDesignation: string;
  department: string;
  ratings: {
    teamwork: number; // 1-10
    communication: number; // 1-10
    problemSolving: number; // 1-10
    leadership: number; // 1-10
    workEthic: number; // 1-10
  };
  strengths: string;
  weaknesses: string;
  overallComments: string;
  status: "Pending" | "Completed";
  submittedAt?: string;
}

// ── DEFAULTS ────────────────────────────────────────────────────────────────────

export const DEFAULT_KPI_CRITERIA: KpiCriteria[] = [
  // Core Competency (40%)
  {
    id: "KPI-001",
    category: "Core Competency",
    criteriaName: "Decision Making & Problem Solving",
    weight: 10,
    maxScore: 10,
    criteriaDetail:
      "Measures effectiveness in understanding complex problems, analyzing options, and making timely practical decisions best suited for the organization.",
    scoringRubric: {
      excellent: "Consistently makes sound decisions under pressure with minimal guidance",
      good: "Makes appropriate decisions in most situations",
      average: "Needs guidance for complex decisions",
      poor: "Frequently makes poor decisions or avoids making them",
    },
    department: "All Departments",
    status: "Active",
  },
  {
    id: "KPI-002",
    category: "Core Competency",
    criteriaName: "Leadership & Initiative",
    weight: 10,
    maxScore: 10,
    criteriaDetail:
      "Demonstrates ability to influence, guide, and support others toward achieving goals. Takes initiative and drives projects forward proactively.",
    scoringRubric: {
      excellent: "Inspires teams and leads by example, proactively initiates improvements",
      good: "Effectively leads assigned tasks and motivates team members",
      average: "Shows basic leadership when required",
      poor: "Avoids leadership responsibilities, passive approach",
    },
    department: "All Departments",
    status: "Active",
  },
  {
    id: "KPI-003",
    category: "Core Competency",
    criteriaName: "Dependability & Accountability",
    weight: 10,
    maxScore: 10,
    criteriaDetail:
      "Delivers quality work on time, can be trusted to follow instructions accurately, requires minimal supervision, is consistent and reliable.",
    scoringRubric: {
      excellent: "Always delivers ahead of schedule with exceptional quality",
      good: "Consistently meets deadlines with good quality",
      average: "Usually meets deadlines but quality varies",
      poor: "Frequently misses deadlines or produces subpar work",
    },
    department: "All Departments",
    status: "Active",
  },
  {
    id: "KPI-004",
    category: "Core Competency",
    criteriaName: "Teamwork & Collaboration",
    weight: 10,
    maxScore: 10,
    criteriaDetail:
      "Works effectively with colleagues across departments. Contributes to team goals, supports peers, and fosters a positive collaborative environment.",
    scoringRubric: {
      excellent: "Actively strengthens team dynamics, mentors others, resolves conflicts",
      good: "Works well in teams and contributes positively",
      average: "Cooperates when required but doesn't proactively contribute",
      poor: "Creates friction in team settings, works in isolation",
    },
    department: "All Departments",
    status: "Active",
  },
  // Technical (25%)
  {
    id: "KPI-005",
    category: "Technical",
    criteriaName: "Job Knowledge & Expertise",
    weight: 8,
    maxScore: 10,
    criteriaDetail:
      "Demonstrates comprehensive understanding of their role, industry knowledge, and technical expertise required for the position.",
    scoringRubric: {
      excellent: "Expert-level knowledge, recognized as go-to resource",
      good: "Strong knowledge across all job requirements",
      average: "Adequate knowledge for basic tasks",
      poor: "Lacks fundamental knowledge required for the role",
    },
    department: "All Departments",
    status: "Active",
  },
  {
    id: "KPI-006",
    category: "Technical",
    criteriaName: "Quality of Work Output",
    weight: 8,
    maxScore: 10,
    criteriaDetail:
      "Produces work that meets or exceeds quality standards. Attention to detail, accuracy, and completeness of deliverables.",
    scoringRubric: {
      excellent: "Exceptional quality, sets new standards, zero error rate",
      good: "Consistently high quality with rare errors",
      average: "Acceptable quality but needs improvement in accuracy",
      poor: "Frequent errors and quality issues",
    },
    department: "All Departments",
    status: "Active",
  },
  {
    id: "KPI-007",
    category: "Technical",
    criteriaName: "Productivity & Efficiency",
    weight: 5,
    maxScore: 10,
    criteriaDetail:
      "Manages time effectively, prioritizes tasks intelligently, and maintains high output without compromising quality.",
    scoringRubric: {
      excellent: "Exceeds productivity targets by 20%+, optimizes processes",
      good: "Consistently meets productivity targets",
      average: "Meets basic targets but could improve efficiency",
      poor: "Below expected productivity levels",
    },
    department: "All Departments",
    status: "Active",
  },
  {
    id: "KPI-008",
    category: "Technical",
    criteriaName: "Innovation & Process Improvement",
    weight: 4,
    maxScore: 10,
    criteriaDetail:
      "Identifies opportunities for improvement, proposes innovative solutions, and implements process enhancements.",
    scoringRubric: {
      excellent: "Regularly introduces successful innovations that save cost/time",
      good: "Suggests improvements and implements some changes",
      average: "Follows existing processes, rarely suggests improvements",
      poor: "Resistant to change, no contribution to improvement",
    },
    department: "All Departments",
    status: "Active",
  },
  // Behavioral (20%)
  {
    id: "KPI-009",
    category: "Behavioral",
    criteriaName: "Communication Skills",
    weight: 7,
    maxScore: 10,
    criteriaDetail:
      "Communicates effectively through verbal, written, and presentation formats. Listens actively and conveys information clearly.",
    scoringRubric: {
      excellent: "Exceptional communicator, influences and persuades effectively",
      good: "Clear and effective communication in most situations",
      average: "Basic communication skills, sometimes unclear",
      poor: "Poor communication leading to misunderstandings",
    },
    department: "All Departments",
    status: "Active",
  },
  {
    id: "KPI-010",
    category: "Behavioral",
    criteriaName: "Professionalism & Conduct",
    weight: 5,
    maxScore: 10,
    criteriaDetail:
      "Maintains professional demeanor, adheres to company values and ethics, represents the organization positively.",
    scoringRubric: {
      excellent: "Role model for professionalism, upholds highest ethical standards",
      good: "Consistently professional in all interactions",
      average: "Generally professional but occasional lapses",
      poor: "Unprofessional behavior, ethical concerns",
    },
    department: "All Departments",
    status: "Active",
  },
  {
    id: "KPI-011",
    category: "Behavioral",
    criteriaName: "Adaptability & Learning Agility",
    weight: 4,
    maxScore: 10,
    criteriaDetail:
      "Adapts to changing circumstances, learns new skills quickly, embraces organizational changes positively.",
    scoringRubric: {
      excellent: "Thrives in change, quickly masters new skills and systems",
      good: "Adapts well to most changes with minimal support",
      average: "Adjusts to changes but takes time",
      poor: "Resists change, struggles to learn new approaches",
    },
    department: "All Departments",
    status: "Active",
  },
  {
    id: "KPI-012",
    category: "Behavioral",
    criteriaName: "Emotional Intelligence",
    weight: 4,
    maxScore: 10,
    criteriaDetail:
      "Manages own emotions effectively, shows empathy, handles interpersonal relationships judiciously and with maturity.",
    scoringRubric: {
      excellent: "Exceptional self-awareness and empathy, de-escalates conflicts naturally",
      good: "Good emotional control and interpersonal skills",
      average: "Basic emotional awareness, occasional reactive behavior",
      poor: "Poor emotional control, creates workplace tension",
    },
    department: "All Departments",
    status: "Active",
  },
  // Organizational (15%)
  {
    id: "KPI-013",
    category: "Organizational",
    criteriaName: "Company Loyalty & Alignment",
    weight: 5,
    maxScore: 10,
    criteriaDetail:
      "Demonstrates commitment to the organization's mission, values, and long-term success. Shows pride in the company brand.",
    scoringRubric: {
      excellent: "Brand ambassador, deeply aligned with company vision",
      good: "Loyal employee who supports company initiatives",
      average: "Neutral alignment, does the minimum required",
      poor: "Shows dissatisfaction, negative influence on others",
    },
    department: "All Departments",
    status: "Active",
  },
  {
    id: "KPI-014",
    category: "Organizational",
    criteriaName: "Knowledge of Policies, Law & SOP",
    weight: 5,
    maxScore: 10,
    criteriaDetail:
      "Understands and applies relevant legal regulations, industry standards, and internal Standard Operating Procedures.",
    scoringRubric: {
      excellent: "Deep knowledge of all relevant policies, trains others",
      good: "Good understanding and consistent compliance",
      average: "Basic knowledge, occasional non-compliance",
      poor: "Lacks awareness of policies, frequent violations",
    },
    department: "All Departments",
    status: "Active",
  },
  {
    id: "KPI-015",
    category: "Organizational",
    criteriaName: "Attendance & Punctuality",
    weight: 5,
    maxScore: 10,
    criteriaDetail:
      "Maintains excellent attendance record, arrives on time, manages leave responsibly, and respects work schedules.",
    scoringRubric: {
      excellent: "Perfect attendance, always punctual, never misuses leave",
      good: "Excellent attendance with rare exceptions",
      average: "Acceptable attendance but some tardiness",
      poor: "Frequent absences or tardiness, leave policy issues",
    },
    department: "All Departments",
    status: "Active",
  },
];

export const DEFAULT_GRADE_BANDS: GradeBand[] = [
  {
    id: "GB-001",
    pointFrom: 95,
    pointTo: 100,
    grade: "A+",
    assessment: "Outstanding",
    color: "#059669",
    incrementEligible: true,
    promotionEligible: true,
    status: "Active",
  },
  {
    id: "GB-002",
    pointFrom: 85,
    pointTo: 94,
    grade: "A",
    assessment: "Excellent",
    color: "#10b981",
    incrementEligible: true,
    promotionEligible: true,
    status: "Active",
  },
  {
    id: "GB-003",
    pointFrom: 75,
    pointTo: 84,
    grade: "B+",
    assessment: "Very Good",
    color: "#3b82f6",
    incrementEligible: true,
    promotionEligible: false,
    status: "Active",
  },
  {
    id: "GB-004",
    pointFrom: 65,
    pointTo: 74,
    grade: "B",
    assessment: "Good",
    color: "#6366f1",
    incrementEligible: true,
    promotionEligible: false,
    status: "Active",
  },
  {
    id: "GB-005",
    pointFrom: 55,
    pointTo: 64,
    grade: "C+",
    assessment: "Satisfactory",
    color: "#8b5cf6",
    incrementEligible: true,
    promotionEligible: false,
    status: "Active",
  },
  {
    id: "GB-006",
    pointFrom: 40,
    pointTo: 54,
    grade: "C",
    assessment: "Needs Improvement",
    color: "#f59e0b",
    incrementEligible: false,
    promotionEligible: false,
    status: "Active",
  },
  {
    id: "GB-007",
    pointFrom: 25,
    pointTo: 39,
    grade: "D",
    assessment: "Poor",
    color: "#ef4444",
    incrementEligible: false,
    promotionEligible: false,
    status: "Active",
  },
  {
    id: "GB-008",
    pointFrom: 0,
    pointTo: 24,
    grade: "F",
    assessment: "Unsatisfactory",
    color: "#991b1b",
    incrementEligible: false,
    promotionEligible: false,
    status: "Active",
  },
];

export const DEFAULT_KPI_CYCLES: KpiCycle[] = [
  {
    id: "CYC-001",
    name: "Annual Performance Review 2026",
    type: "Annual",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "Active",
    departments: ["All Departments"],
    totalEmployees: 10,
    completedCount: 3,
    createdAt: "2026-01-01",
  },
  {
    id: "CYC-002",
    name: "Mid-Year Review 2026",
    type: "Mid-Year",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    status: "Draft",
    departments: ["All Departments"],
    totalEmployees: 10,
    completedCount: 0,
    createdAt: "2026-06-01",
  },
  {
    id: "CYC-003",
    name: "Annual Performance Review 2025",
    type: "Annual",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: "Closed",
    departments: ["All Departments"],
    totalEmployees: 10,
    completedCount: 10,
    createdAt: "2025-01-01",
  },
  {
    id: "CYC-004",
    name: "Probation Review Q1 2026",
    type: "Probation",
    startDate: "2026-01-01",
    endDate: "2026-03-31",
    status: "Closed",
    departments: ["Business Innovation", "Business Automation"],
    totalEmployees: 4,
    completedCount: 4,
    createdAt: "2026-01-01",
  },
];

export const DEFAULT_ASSESSMENTS: KpiAssessment[] = [
  {
    id: "ASM-001",
    cycleId: "CYC-001",
    employeeId: "2023043910",
    employeeName: "Tahmid Afsar Shapno",
    department: "Business Innovation",
    section: "Project Resource & Strategy",
    designation: "Asst. Manager",
    grossSalary: 152000,
    currentStep: 5,
    completedSteps: [1, 2, 3, 4, 5],
    criteriaScores: DEFAULT_KPI_CRITERIA.map((c) => ({
      criteriaId: c.id,
      hodScore: 8,
      selfScore: 9,
      notes: "",
    })),
    totalWeightedScore: 82.5,
    gradeResult: "B+",
    gradeBandId: "GB-003",
    hodManualMarks: 17,
    hodRecommendation: "Excellent performance in project management. Recommended for increment.",
    improvementPlan: "Focus on cross-team collaboration skills.",
    specialComments: "Delivered 3 critical projects ahead of schedule.",
    jdDetails: "Expanded role to include strategic planning.",
    hrdStrength: "Strong analytical and leadership skills.",
    hrdImprovementPlan: "Attend advanced leadership workshop.",
    hrdSpecialComments: "Top performer in the department.",
    plantHeadComments: "Concur with HOD assessment. Well-deserved increment.",
    plantHeadApproval: "Approved",
    mdComments: "Approved. Continue to nurture leadership potential.",
    mdApproval: "Approved",
    incAmount: 15000,
    givePromotion: "No",
    newDesignation: "",
    effectYear: "2026",
    effectMonth: "July",
    finalNotes: "Annual increment effective July 2026.",
    newGrossSalary: 167000,
    status: "Completed",
    createdAt: "2026-01-15",
    completedAt: "2026-03-10",
  },
  {
    id: "ASM-002",
    cycleId: "CYC-001",
    employeeId: "2024049326",
    employeeName: "Hanif Uddin",
    department: "Business Innovation",
    section: "APPS Team",
    designation: "Sr. Executive",
    grossSalary: 50000,
    currentStep: 3,
    completedSteps: [1, 2],
    criteriaScores: DEFAULT_KPI_CRITERIA.map((c) => ({
      criteriaId: c.id,
      hodScore: 7,
      selfScore: 8,
      notes: "",
    })),
    totalWeightedScore: 72,
    gradeResult: "B",
    gradeBandId: "GB-004",
    hodManualMarks: 14,
    hodRecommendation: "Good performance. Needs to improve time management.",
    improvementPlan: "Time management training recommended.",
    specialComments: "",
    jdDetails: "",
    hrdStrength: "Technical proficiency.",
    hrdImprovementPlan: "Cross-training in project management.",
    hrdSpecialComments: "",
    plantHeadComments: "",
    plantHeadApproval: "",
    mdComments: "",
    mdApproval: "",
    incAmount: 0,
    givePromotion: "No",
    newDesignation: "",
    effectYear: "2026",
    effectMonth: "July",
    finalNotes: "",
    newGrossSalary: 50000,
    status: "In Progress",
    createdAt: "2026-02-01",
    completedAt: "",
  },
  {
    id: "ASM-003",
    cycleId: "CYC-001",
    employeeId: "2023045044",
    employeeName: "Sultan Ahmed",
    department: "Implementation & Business Analysis",
    section: "Business Analysis",
    designation: "Manager",
    grossSalary: 81000,
    currentStep: 5,
    completedSteps: [1, 2, 3, 4, 5],
    criteriaScores: DEFAULT_KPI_CRITERIA.map((c) => ({
      criteriaId: c.id,
      hodScore: 9,
      selfScore: 9,
      notes: "",
    })),
    totalWeightedScore: 91,
    gradeResult: "A",
    gradeBandId: "GB-002",
    hodManualMarks: 18,
    hodRecommendation: "Outstanding contributor. Recommended for promotion.",
    improvementPlan: "Delegation skills development.",
    specialComments: "Led successful ERP implementation.",
    jdDetails: "Proposed new role: Sr. Manager.",
    hrdStrength: "Exceptional domain expertise and client management.",
    hrdImprovementPlan: "Executive leadership program.",
    hrdSpecialComments: "Strong candidate for promotion.",
    plantHeadComments: "Fully endorse promotion and increment.",
    plantHeadApproval: "Approved",
    mdComments: "Approved promotion to Sr. Manager with increment.",
    mdApproval: "Approved",
    incAmount: 19000,
    givePromotion: "Yes",
    newDesignation: "Sr. Manager",
    effectYear: "2026",
    effectMonth: "July",
    finalNotes: "Promoted to Sr. Manager with 19K increment.",
    newGrossSalary: 100000,
    status: "Completed",
    createdAt: "2026-01-15",
    completedAt: "2026-03-15",
  },
  {
    id: "ASM-004",
    cycleId: "CYC-001",
    employeeId: "2026058726",
    employeeName: "Parvej Mahmud",
    department: "Business Innovation",
    section: "APPS Team",
    designation: "Executive",
    grossSalary: 40000,
    currentStep: 1,
    completedSteps: [],
    criteriaScores: [],
    totalWeightedScore: 0,
    gradeResult: "",
    gradeBandId: "",
    hodManualMarks: 0,
    hodRecommendation: "",
    improvementPlan: "",
    specialComments: "",
    jdDetails: "",
    hrdStrength: "",
    hrdImprovementPlan: "",
    hrdSpecialComments: "",
    plantHeadComments: "",
    plantHeadApproval: "",
    mdComments: "",
    mdApproval: "",
    incAmount: 0,
    givePromotion: "No",
    newDesignation: "",
    effectYear: "2026",
    effectMonth: "July",
    finalNotes: "",
    newGrossSalary: 40000,
    status: "Pending",
    createdAt: "2026-02-01",
    completedAt: "",
  },
  {
    id: "ASM-005",
    cycleId: "CYC-001",
    employeeId: "2026058686",
    employeeName: "Md. Abdur Rahaman",
    department: "Business Innovation",
    section: "Business Innovation",
    designation: "Executive",
    grossSalary: 50000,
    currentStep: 1,
    completedSteps: [],
    criteriaScores: [],
    totalWeightedScore: 0,
    gradeResult: "",
    gradeBandId: "",
    hodManualMarks: 0,
    hodRecommendation: "",
    improvementPlan: "",
    specialComments: "",
    jdDetails: "",
    hrdStrength: "",
    hrdImprovementPlan: "",
    hrdSpecialComments: "",
    plantHeadComments: "",
    plantHeadApproval: "",
    mdComments: "",
    mdApproval: "",
    incAmount: 0,
    givePromotion: "No",
    newDesignation: "",
    effectYear: "2026",
    effectMonth: "July",
    finalNotes: "",
    newGrossSalary: 50000,
    status: "Pending",
    createdAt: "2026-02-01",
    completedAt: "",
  },
  {
    id: "ASM-006",
    cycleId: "CYC-001",
    employeeId: "2025058109",
    employeeName: "Mohammad Methoun Ahmed",
    department: "Business Automation",
    section: "Core Development",
    designation: "Sr. Manager",
    grossSalary: 130000,
    currentStep: 2,
    completedSteps: [1],
    criteriaScores: DEFAULT_KPI_CRITERIA.map((c) => ({
      criteriaId: c.id,
      hodScore: 9,
      selfScore: 8,
      notes: "",
    })),
    totalWeightedScore: 88,
    gradeResult: "A",
    gradeBandId: "GB-002",
    hodManualMarks: 18,
    hodRecommendation: "Top performer. Key strategic contributor.",
    improvementPlan: "Continue current trajectory.",
    specialComments: "Mentored 4 junior developers.",
    jdDetails: "",
    hrdStrength: "",
    hrdImprovementPlan: "",
    hrdSpecialComments: "",
    plantHeadComments: "",
    plantHeadApproval: "",
    mdComments: "",
    mdApproval: "",
    incAmount: 0,
    givePromotion: "No",
    newDesignation: "",
    effectYear: "2026",
    effectMonth: "July",
    finalNotes: "",
    newGrossSalary: 130000,
    status: "In Progress",
    createdAt: "2026-02-01",
    completedAt: "",
  },
  {
    id: "ASM-007",
    cycleId: "CYC-001",
    employeeId: "2026058685",
    employeeName: "Md Johirul Islam",
    department: "Business Automation",
    section: "Core Development",
    designation: "Executive",
    grossSalary: 40000,
    currentStep: 1,
    completedSteps: [],
    criteriaScores: [],
    totalWeightedScore: 0,
    gradeResult: "",
    gradeBandId: "",
    hodManualMarks: 0,
    hodRecommendation: "",
    improvementPlan: "",
    specialComments: "",
    jdDetails: "",
    hrdStrength: "",
    hrdImprovementPlan: "",
    hrdSpecialComments: "",
    plantHeadComments: "",
    plantHeadApproval: "",
    mdComments: "",
    mdApproval: "",
    incAmount: 0,
    givePromotion: "No",
    newDesignation: "",
    effectYear: "2026",
    effectMonth: "July",
    finalNotes: "",
    newGrossSalary: 40000,
    status: "Pending",
    createdAt: "2026-02-01",
    completedAt: "",
  },
  {
    id: "ASM-008",
    cycleId: "CYC-001",
    employeeId: "2023046001",
    employeeName: "Sohanur Rahman Sohan",
    department: "HR, Admin and Compliance",
    section: "Admin",
    designation: "Executive",
    grossSalary: 27000,
    currentStep: 4,
    completedSteps: [1, 2, 3],
    criteriaScores: DEFAULT_KPI_CRITERIA.map((c) => ({
      criteriaId: c.id,
      hodScore: 6,
      selfScore: 7,
      notes: "",
    })),
    totalWeightedScore: 62,
    gradeResult: "C+",
    gradeBandId: "GB-005",
    hodManualMarks: 12,
    hodRecommendation: "Satisfactory performance. Needs improvement in communication.",
    improvementPlan: "Communication skills workshop.",
    specialComments: "",
    jdDetails: "",
    hrdStrength: "Reliable and punctual.",
    hrdImprovementPlan: "Skill enhancement in MS Office and reporting.",
    hrdSpecialComments: "",
    plantHeadComments: "Approved with note for improvement.",
    plantHeadApproval: "Approved with Adjustment",
    mdComments: "",
    mdApproval: "",
    incAmount: 0,
    givePromotion: "No",
    newDesignation: "",
    effectYear: "2026",
    effectMonth: "July",
    finalNotes: "",
    newGrossSalary: 27000,
    status: "In Progress",
    createdAt: "2026-02-01",
    completedAt: "",
  },
  {
    id: "ASM-009",
    cycleId: "CYC-001",
    employeeId: "2023043021",
    employeeName: "Easin Mia",
    department: "HR, Admin and Compliance",
    section: "Admin",
    designation: "Receptionist",
    grossSalary: 19000,
    currentStep: 1,
    completedSteps: [],
    criteriaScores: [],
    totalWeightedScore: 0,
    gradeResult: "",
    gradeBandId: "",
    hodManualMarks: 0,
    hodRecommendation: "",
    improvementPlan: "",
    specialComments: "",
    jdDetails: "",
    hrdStrength: "",
    hrdImprovementPlan: "",
    hrdSpecialComments: "",
    plantHeadComments: "",
    plantHeadApproval: "",
    mdComments: "",
    mdApproval: "",
    incAmount: 0,
    givePromotion: "No",
    newDesignation: "",
    effectYear: "2026",
    effectMonth: "July",
    finalNotes: "",
    newGrossSalary: 19000,
    status: "Pending",
    createdAt: "2026-02-01",
    completedAt: "",
  },
  {
    id: "ASM-010",
    cycleId: "CYC-001",
    employeeId: "2024091802",
    employeeName: "Md. Anik Islam",
    department: "Business Innovation",
    section: "WEB Team",
    designation: "Business Analyst",
    grossSalary: 79000,
    currentStep: 5,
    completedSteps: [1, 2, 3, 4, 5],
    criteriaScores: DEFAULT_KPI_CRITERIA.map((c) => ({
      criteriaId: c.id,
      hodScore: 8,
      selfScore: 8,
      notes: "",
    })),
    totalWeightedScore: 78,
    gradeResult: "B+",
    gradeBandId: "GB-003",
    hodManualMarks: 16,
    hodRecommendation: "Strong analytical skills. Good team player.",
    improvementPlan: "Public speaking and presentation skills.",
    specialComments: "",
    jdDetails: "",
    hrdStrength: "Analytical mindset and domain expertise.",
    hrdImprovementPlan: "Leadership development track.",
    hrdSpecialComments: "",
    plantHeadComments: "Good assessment. Approve increment.",
    plantHeadApproval: "Approved",
    mdComments: "Approved as recommended.",
    mdApproval: "Approved",
    incAmount: 8000,
    givePromotion: "No",
    newDesignation: "",
    effectYear: "2026",
    effectMonth: "July",
    finalNotes: "Standard annual increment.",
    newGrossSalary: 87000,
    status: "Completed",
    createdAt: "2026-01-15",
    completedAt: "2026-03-20",
  },
];

export const DEFAULT_SELF_ASSESSMENTS: SelfAssessment[] = [
  {
    id: "SA-001",
    cycleId: "CYC-001",
    employeeId: "2023043910",
    employeeName: "Tahmid Afsar Shapno",
    department: "Business Innovation",
    designation: "Asst. Manager",
    scores: DEFAULT_KPI_CRITERIA.map((c) => ({
      criteriaId: c.id,
      score: 9,
      justification: "Consistently delivered excellent results in this area.",
    })),
    totalScore: 90,
    overallComments:
      "I have contributed significantly to the organization's growth through innovation and strategic planning.",
    status: "Submitted",
    submittedAt: "2026-01-20",
  },
  {
    id: "SA-002",
    cycleId: "CYC-001",
    employeeId: "2024049326",
    employeeName: "Hanif Uddin",
    department: "Business Innovation",
    designation: "Sr. Executive",
    scores: DEFAULT_KPI_CRITERIA.map((c) => ({
      criteriaId: c.id,
      score: 8,
      justification: "Performed well with scope for improvement.",
    })),
    totalScore: 80,
    overallComments: "Good year overall. Looking forward to taking on more responsibilities.",
    status: "Submitted",
    submittedAt: "2026-01-25",
  },
  {
    id: "SA-003",
    cycleId: "CYC-001",
    employeeId: "2023045044",
    employeeName: "Sultan Ahmed",
    department: "Implementation & Business Analysis",
    designation: "Manager",
    scores: DEFAULT_KPI_CRITERIA.map((c) => ({
      criteriaId: c.id,
      score: 9,
      justification: "Exceeded expectations in all key deliverables.",
    })),
    totalScore: 92,
    overallComments: "Led the ERP implementation successfully. Ready for senior leadership role.",
    status: "Reviewed",
    submittedAt: "2026-01-18",
  },
];

export const DEFAULT_PEER_REVIEWS: PeerReview[] = [
  // Completed Reviews
  {
    id: "PR-001",
    cycleId: "CYC-001",
    reviewerId: "2023043910",
    reviewerName: "Tahmid Afsar Shapno",
    reviewerDesignation: "Asst. Manager",
    revieweeId: "2024049326",
    revieweeName: "Hanif Uddin",
    revieweeDesignation: "Sr. Executive",
    department: "Business Innovation",
    ratings: { teamwork: 8, communication: 7, problemSolving: 9, leadership: 6, workEthic: 9 },
    strengths: "Great technical problem solver, always ready to tackle difficult issues.",
    weaknesses: "Sometimes works in silos, could communicate progress more frequently.",
    overallComments: "Hanif is a solid team member but could improve on proactive updates.",
    status: "Completed",
    submittedAt: "2026-02-15",
  },
  {
    id: "PR-002",
    cycleId: "CYC-001",
    reviewerId: "2024091802",
    reviewerName: "Md. Anik Islam",
    reviewerDesignation: "Business Analyst",
    revieweeId: "2023043910",
    revieweeName: "Tahmid Afsar Shapno",
    revieweeDesignation: "Asst. Manager",
    department: "Business Innovation",
    ratings: { teamwork: 9, communication: 9, problemSolving: 8, leadership: 9, workEthic: 10 },
    strengths: "Excellent leadership and strategic vision. Very supportive.",
    weaknesses: "Takes on too much work personally.",
    overallComments: "A great leader who inspires the team.",
    status: "Completed",
    submittedAt: "2026-02-16",
  },
  {
    id: "PR-003",
    cycleId: "CYC-001",
    reviewerId: "2024049326",
    reviewerName: "Hanif Uddin",
    reviewerDesignation: "Sr. Executive",
    revieweeId: "2024091802",
    revieweeName: "Md. Anik Islam",
    revieweeDesignation: "Business Analyst",
    department: "Business Innovation",
    ratings: { teamwork: 9, communication: 10, problemSolving: 8, leadership: 7, workEthic: 8 },
    strengths: "Translates business requirements to tech perfectly.",
    weaknesses: "Can be overly detail-oriented, slowing down fast iterations.",
    overallComments: "Anik bridges the gap between teams very well.",
    status: "Completed",
    submittedAt: "2026-02-17",
  },
  // Pending Reviews
  {
    id: "PR-004",
    cycleId: "CYC-001",
    reviewerId: "2023043910",
    reviewerName: "Tahmid Afsar Shapno",
    reviewerDesignation: "Asst. Manager",
    revieweeId: "2024091802",
    revieweeName: "Md. Anik Islam",
    revieweeDesignation: "Business Analyst",
    department: "Business Innovation",
    ratings: { teamwork: 0, communication: 0, problemSolving: 0, leadership: 0, workEthic: 0 },
    strengths: "",
    weaknesses: "",
    overallComments: "",
    status: "Pending",
  },
  {
    id: "PR-005",
    cycleId: "CYC-001",
    reviewerId: "2023043910",
    reviewerName: "Tahmid Afsar Shapno",
    reviewerDesignation: "Asst. Manager",
    revieweeId: "2026058726",
    revieweeName: "Parvej Mahmud",
    revieweeDesignation: "Executive",
    department: "Business Innovation",
    ratings: { teamwork: 0, communication: 0, problemSolving: 0, leadership: 0, workEthic: 0 },
    strengths: "",
    weaknesses: "",
    overallComments: "",
    status: "Pending",
  },
];

// ── STORAGE HELPERS ─────────────────────────────────────────────────────────────

function safeParse<T>(key: string, defaultVal: T): T {
  if (typeof window === "undefined") return defaultVal;
  const saved = localStorage.getItem(key);
  if (!saved) return defaultVal;
  try {
    const parsed = JSON.parse(saved);
    return parsed;
  } catch {
    return defaultVal;
  }
}

function initVersion(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("kpi_data_version");
  if (stored !== KPI_DATA_VERSION) {
    // Clear all KPI keys to force fresh load
    const keys = [
      "kpi_criteria",
      "kpi_grade_bands",
      "kpi_cycles",
      "kpi_assessments",
      "kpi_self_assessments",
      "kpi_peer_reviews",
    ];
    keys.forEach((k) => localStorage.removeItem(k));
    localStorage.setItem("kpi_data_version", KPI_DATA_VERSION);
    return true; // was reset
  }
  return false;
}

// Criteria
export function loadKpiCriteria(): KpiCriteria[] {
  initVersion();
  return safeParse("kpi_criteria", DEFAULT_KPI_CRITERIA);
}
export function saveKpiCriteria(data: KpiCriteria[]) {
  localStorage.setItem("kpi_criteria", JSON.stringify(data));
}

// Grade Bands
export function loadGradeBands(): GradeBand[] {
  initVersion();
  return safeParse("kpi_grade_bands", DEFAULT_GRADE_BANDS);
}
export function saveGradeBands(data: GradeBand[]) {
  localStorage.setItem("kpi_grade_bands", JSON.stringify(data));
}

// Cycles
export function loadKpiCycles(): KpiCycle[] {
  initVersion();
  return safeParse("kpi_cycles", DEFAULT_KPI_CYCLES);
}
export function saveKpiCycles(data: KpiCycle[]) {
  localStorage.setItem("kpi_cycles", JSON.stringify(data));
}

// Assessments
export function loadAssessments(): KpiAssessment[] {
  initVersion();
  return safeParse("kpi_assessments", DEFAULT_ASSESSMENTS);
}
export function saveAssessments(data: KpiAssessment[]) {
  localStorage.setItem("kpi_assessments", JSON.stringify(data));
}

// Self Assessments
export function loadSelfAssessments(): SelfAssessment[] {
  initVersion();
  return safeParse("kpi_self_assessments", DEFAULT_SELF_ASSESSMENTS);
}
export function saveSelfAssessments(data: SelfAssessment[]) {
  localStorage.setItem("kpi_self_assessments", JSON.stringify(data));
}

// Peer Reviews
export function loadPeerReviews(): PeerReview[] {
  initVersion();
  return safeParse("kpi_peer_reviews", DEFAULT_PEER_REVIEWS);
}
export function savePeerReviews(data: PeerReview[]) {
  localStorage.setItem("kpi_peer_reviews", JSON.stringify(data));
}

// ── UTILITY FUNCTIONS ───────────────────────────────────────────────────────────

export function calculateWeightedScore(
  criteriaScores: CriteriaScore[],
  criteria: KpiCriteria[],
): number {
  if (!criteriaScores.length || !criteria.length) return 0;
  let totalWeighted = 0;
  for (const cs of criteriaScores) {
    const cDef = criteria.find((c) => c.id === cs.criteriaId);
    if (!cDef || cDef.status !== "Active") continue;
    // Score is out of maxScore, weight is percentage
    const normalizedScore = (cs.hodScore / cDef.maxScore) * 100;
    totalWeighted += (normalizedScore * cDef.weight) / 100;
  }
  return Math.round(totalWeighted * 100) / 100;
}

export function getGradeForScore(score: number, bands: GradeBand[]): GradeBand | null {
  const activeBands = bands.filter((b) => b.status === "Active");
  for (const band of activeBands) {
    if (score >= band.pointFrom && score <= band.pointTo) {
      return band;
    }
  }
  return null;
}

export function getCategoryColor(category: KpiCriteria["category"]): string {
  switch (category) {
    case "Core Competency":
      return "#3b82f6";
    case "Technical":
      return "#8b5cf6";
    case "Behavioral":
      return "#f59e0b";
    case "Organizational":
      return "#10b981";
    default:
      return "#6b7280";
  }
}

export function getCategoryBg(category: KpiCriteria["category"]): string {
  switch (category) {
    case "Core Competency":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "Technical":
      return "bg-violet-500/10 text-violet-600 border-violet-500/20";
    case "Behavioral":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "Organizational":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    default:
      return "bg-slate-500/10 text-slate-600 border-slate-500/20";
  }
}

export const CATEGORY_LIST: KpiCriteria["category"][] = [
  "Core Competency",
  "Technical",
  "Behavioral",
  "Organizational",
];

export const DEPARTMENT_LIST = [
  "All Departments",
  "Business Innovation",
  "Business Automation",
  "Implementation & Business Analysis",
  "HR, Admin and Compliance",
  "Business Development",
  "Finance & Accounts",
  "Operations & HR",
  "Quality Control",
  "RMG Operation",
  "Core Development",
];
