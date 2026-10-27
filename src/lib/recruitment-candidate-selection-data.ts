// Shared Recruitment Candidate Selection & Approval Data Store

export interface SalaryRevision {
  id: string;
  approverLevel: number; // 1, 2, 3
  approverRole: string; // "Department Head", "Head of HR", "Managing Director"
  approverName: string;
  approverDesignation: string;
  timestamp: string;
  previousSalary: number;
  newSalary: number;
  delta: number; // newSalary - previousSalary
  reason?: string;
}

export interface CandidateApprovalTier {
  id: string;
  level: number;
  tierName: string;
  approverName: string;
  approverDesignation: string;
  company: string;
  approvedSalary: number;
  status: "Approved" | "Pending";
  actionDate?: string;
  remarks?: string;
}

export interface ApprovalStep {
  level: number;
  role: string;
  approverName: string;
  approverDesignation: string;
  status: "Pending" | "Approved" | "Returned" | "Rejected" | "Waiting";
  actionDate?: string;
  remarks?: string;
}

export interface ApprovalActionLog {
  id: string;
  level: number;
  approverName: string;
  approverRole: string;
  approverDesignation: string;
  action: "Submitted" | "Approved" | "Returned" | "Rejected" | "Salary Adjusted";
  timestamp: string;
  remarks: string;
}

export interface JobCandidate {
  id: string; // e.g. "PAL000021"
  name: string;
  nameBng?: string;
  photo?: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  previousSalary: number;
  agreedSalary: number; // Current offered/agreed salary
  initialAgreedSalary?: number; // Proposed in entry stage before any approver modifications
  experience: string;
  noticePeriod: string;
  selected: boolean;
  selectedAt?: string;
  generatedLink?: string;
  linkGeneratedAt?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  status: "Shortlisted" | "Selected" | "Rejected" | "Pending" | "Approved";
  salaryHistory?: SalaryRevision[];
  approvalTiers?: CandidateApprovalTier[];
  approvalStatus?: "Draft" | "Pending Approval" | "Approved" | "Returned" | "Rejected";
  cv: {
    summary: string;
    highlights: string[];
    academics: { degree: string; institute: string; year: string; grade: string }[];
    experiences: {
      role: string;
      company: string;
      duration: string;
      responsibilities: string[];
    }[];
    personalDetails: {
      dob: string;
      bloodGroup: string;
      nid: string;
      address: string;
      maritalStatus: string;
    };
    skills: string[];
    references: { name: string; designation: string; company: string; phone: string }[];
  };
}

export interface JobPost {
  id: string; // e.g. "JOB-2026-001"
  title: string;
  department: string;
  designation: string;
  vacancies: number;
  assignedPerson: string;
  assignedRole: string;
  targetDate: string;
  salaryBudgetMin: number;
  salaryBudgetMax: number;
  status: "Open" | "Submitted" | "Approved" | "Closed";
  submittedAt?: string;
  submittedBy?: string;
  submissionRemarks?: string;
  currentApprovalLevel?: number; // 1 = Dept Head, 2 = Head of HR, 3 = Managing Director / Group COO
  approvalFlow?: ApprovalStep[];
  approvalHistory?: ApprovalActionLog[];
  closedAt?: string;
  closedBy?: string;
  closeReason?: string;
  createdAt: string;
  candidates: JobCandidate[];
}

export const STORAGE_KEY = "recruitment_job_selections";

export const createDefaultApprovalFlow = (
  assignedPerson?: string,
  assignedRole?: string
): ApprovalStep[] => [
  {
    level: 1,
    role: "Department Head / Hiring Manager",
    approverName: assignedPerson || "Tanvir Ahmed",
    approverDesignation: assignedRole || "Head of Merchandising",
    status: "Pending",
  },
  {
    level: 2,
    role: "Head of HR & Talent Acquisition",
    approverName: "Tahmid Afsar Shapno",
    approverDesignation: "Manager, HR & Talent Acquisition",
    status: "Waiting",
  },
  {
    level: 3,
    role: "Managing Director / Executive Management",
    approverName: "Engr. Rafiqul Islam",
    approverDesignation: "Group COO & Executive Director",
    status: "Waiting",
  },
];

export const INITIAL_JOBS: JobPost[] = [
  {
    id: "JOB-2026-001",
    title: "Senior Merchandiser (Woven & Knitwear)",
    department: "Merchandising",
    designation: "Senior Merchandiser",
    vacancies: 2,
    assignedPerson: "Tanvir Ahmed",
    assignedRole: "Head of Merchandising",
    targetDate: "2026-10-31",
    salaryBudgetMin: 45000,
    salaryBudgetMax: 60000,
    status: "Submitted",
    submittedAt: "2026-10-25 11:30",
    submittedBy: "Tanvir Ahmed (Head of Merchandising)",
    submissionRemarks: "Proposed 2 exceptional candidates from top textile institutions for European accounts.",
    currentApprovalLevel: 2,
    approvalFlow: [
      {
        level: 1,
        role: "Department Head / Hiring Manager",
        approverName: "Tanvir Ahmed",
        approverDesignation: "Head of Merchandising",
        status: "Approved",
        actionDate: "2026-10-25 15:45",
        remarks: "Approved. Technical evaluation and sample-development aptitude match buyer criteria.",
      },
      {
        level: 2,
        role: "Head of HR & Talent Acquisition",
        approverName: "Tahmid Afsar Shapno",
        approverDesignation: "Manager, HR & Talent Acquisition",
        status: "Pending",
      },
      {
        level: 3,
        role: "Managing Director / Executive Management",
        approverName: "Engr. Rafiqul Islam",
        approverDesignation: "Group COO & Executive Director",
        status: "Waiting",
      },
    ],
    approvalHistory: [
      {
        id: "act-101",
        level: 1,
        approverName: "Tanvir Ahmed",
        approverRole: "Department Head",
        approverDesignation: "Head of Merchandising",
        action: "Submitted",
        timestamp: "2026-10-25 11:30",
        remarks: "Candidate selection dossiers submitted for formal management approval.",
      },
      {
        id: "act-102",
        level: 1,
        approverName: "Tanvir Ahmed",
        approverRole: "Department Head",
        approverDesignation: "Head of Merchandising",
        action: "Salary Adjusted",
        timestamp: "2026-10-25 15:40",
        remarks: "Adjusted candidate Tariqul Islam proposed salary from ৳54,000 to ৳52,000 to maintain department budget ceiling.",
      },
      {
        id: "act-103",
        level: 1,
        approverName: "Tanvir Ahmed",
        approverRole: "Department Head",
        approverDesignation: "Head of Merchandising",
        action: "Approved",
        timestamp: "2026-10-25 15:45",
        remarks: "Endorsed at Level 1. Forwarded to Head of HR.",
      },
    ],
    createdAt: "2026-10-01",
    candidates: [
      {
        id: "PAL000021",
        name: "Md. Tariqul Islam",
        nameBng: "মোঃ তারিকুল ইসলাম",
        email: "tariqul.merch@example.com",
        phone: "+880 1711-234567",
        department: "Merchandising",
        designation: "Senior Merchandiser",
        previousSalary: 42000,
        agreedSalary: 52000,
        initialAgreedSalary: 54000,
        experience: "6.5 Years",
        noticePeriod: "15 Days",
        selected: true,
        selectedAt: "2026-10-25 10:15",
        status: "Selected",
        salaryHistory: [
          {
            id: "rev-201",
            approverLevel: 0,
            approverRole: "Entry Specialist",
            approverName: "Tanvir Ahmed",
            approverDesignation: "Head of Merchandising",
            timestamp: "2026-10-25 10:15",
            previousSalary: 42000,
            newSalary: 54000,
            delta: 12000,
            reason: "Initial proposed salary based on candidate assessment and previous package.",
          },
          {
            id: "rev-202",
            approverLevel: 1,
            approverRole: "Department Head",
            approverName: "Tanvir Ahmed",
            approverDesignation: "Head of Merchandising",
            timestamp: "2026-10-25 15:40",
            previousSalary: 54000,
            newSalary: 52000,
            delta: -2000,
            reason: "Fine-tuned during Level 1 department budget review.",
          },
        ],
        cv: {
          summary:
            "Accomplished Apparel Merchandiser with 6+ years specializing in Woven tops and bottoms for European buyers (H&M, Inditex, Next). Proven track record in cost minimization, consumption yield enhancement, and on-time shipment coordination.",
          highlights: [
            "Handled US$ 12M annual export orders with 99.4% on-time delivery rate",
            "Specialized in high-fashion woven fabric sourcing and chemical compliance",
            "Proficient in FastReact planning and ERP order lifecycle management",
          ],
          academics: [
            {
              degree: "B.Sc. in Textile Engineering (Apparel)",
              institute: "Bangladesh University of Textiles (BUTEX)",
              year: "2018",
              grade: "CGPA 3.65 / 4.00",
            },
            {
              degree: "HSC (Science)",
              institute: "Notre Dame College, Dhaka",
              year: "2014",
              grade: "GPA 5.00 / 5.00",
            },
          ],
          experiences: [
            {
              role: "Senior Merchandiser",
              company: "Ha-Meem Group Ltd (Apparel Division)",
              duration: "2022 - Present (3 Years)",
              responsibilities: [
                "Leading key client accounts for Zara and Pull&Bear woven pants and jackets.",
                "Conducting consumption calculations, factory costings, and raw material booking.",
                "Liaising directly with European buyer QA teams and third-party testing labs.",
              ],
            },
            {
              role: "Assistant Merchandiser",
              company: "Ananta Apparels Ltd",
              duration: "2019 - 2022 (3 Years)",
              responsibilities: [
                "Assisted in sample development, lab dip approvals, and trim procurement.",
                "Prepared daily production tracking (T&A) and shipment documentation.",
              ],
            },
          ],
          personalDetails: {
            dob: "1996-03-14",
            bloodGroup: "B+",
            nid: "19962691500000452",
            address: "House 24, Road 7, Sector 3, Uttara, Dhaka",
            maritalStatus: "Married",
          },
          skills: [
            "Cost Sheet Preparation",
            "T&A Scheduling",
            "Fabric & Trim Sourcing",
            "FastReact ERP",
            "Buyer Communication",
            "AQL 1.5/2.5 Inspection",
          ],
          references: [
            {
              name: "Engr. Zahidul Haque",
              designation: "General Manager (Marketing & Merchandising)",
              company: "Ha-Meem Group",
              phone: "+880 1713-000111",
            },
          ],
        },
      },
      {
        id: "PAL000022",
        name: "Farzana Yasmin",
        nameBng: "ফারজানা ইয়াসমিন",
        email: "farzana.merch@example.com",
        phone: "+880 1819-876543",
        department: "Merchandising",
        designation: "Senior Merchandiser",
        previousSalary: 40000,
        agreedSalary: 49000,
        initialAgreedSalary: 49000,
        experience: "5.0 Years",
        noticePeriod: "Immediate",
        selected: true,
        selectedAt: "2026-10-25 10:20",
        status: "Selected",
        salaryHistory: [
          {
            id: "rev-203",
            approverLevel: 0,
            approverRole: "Entry Specialist",
            approverName: "Tanvir Ahmed",
            approverDesignation: "Head of Merchandising",
            timestamp: "2026-10-25 10:20",
            previousSalary: 40000,
            newSalary: 49000,
            delta: 9000,
            reason: "Initial proposed salary agreed during interview evaluation.",
          },
        ],
        cv: {
          summary:
            "Detail-oriented Merchandiser adept in Knit & Woven tops development, buyer negotiation, sample room tracking, and trim quality audits. Strong background in sustainable fabrics and GOTS certifications.",
          highlights: [
            "Managed multi-vendor development cycles for Primark & C&A knit accounts",
            "Expert in sample turnaround time reduction by 22%",
            "Certified in Sustainable Textile Supply Chain (OEKO-TEX & BCI)",
          ],
          academics: [
            {
              degree: "B.A. (Hons) in Fashion Design & Technology",
              institute: "Shanto-Mariam University of Creative Technology",
              year: "2019",
              grade: "CGPA 3.72 / 4.00",
            },
          ],
          experiences: [
            {
              role: "Merchandiser",
              company: "DBL Group (Matin Spinning & Apparels)",
              duration: "2021 - Present (3.5 Years)",
              responsibilities: [
                "Responsible for customer inquiry costings and strike-off approvals.",
                "Monitored yarn in-house dates and knitting production floor outputs.",
              ],
            },
            {
              role: "Trainee Merchandiser",
              company: "Epyllion Group",
              duration: "2019 - 2021 (2 Years)",
              responsibilities: [
                "Coordinated with sample technicians for Proto, Fit, and PP samples.",
              ],
            },
          ],
          personalDetails: {
            dob: "1997-08-22",
            bloodGroup: "O+",
            nid: "19972691500000891",
            address: "Flat 4B, Green Road, Dhanmondi, Dhaka",
            maritalStatus: "Single",
          },
          skills: [
            "Knitwear Costing",
            "Sample Room Management",
            "Buyer Negotiation",
            "ERP Software",
            "Colour Matching (Spectrophotometer)",
          ],
          references: [
            {
              name: "Nusrat Jahan",
              designation: "DGM Merchandising",
              company: "DBL Group",
              phone: "+880 1819-222333",
            },
          ],
        },
      },
      {
        id: "PAL000023",
        name: "Kamrul Hasan Chowdhury",
        nameBng: "কামরুল হাসান চৌধুরী",
        email: "kamrul.hasan@example.com",
        phone: "+880 1622-445566",
        department: "Merchandising",
        designation: "Senior Merchandiser",
        previousSalary: 38000,
        agreedSalary: 47000,
        experience: "4.5 Years",
        noticePeriod: "30 Days",
        selected: false,
        status: "Pending",
        cv: {
          summary:
            "Proactive Garments Merchandiser with core expertise in Denim wash development, trim development, and cost modeling.",
          highlights: [
            "Extensive experience working with Levi's and Lee Cooper accounts",
            "Specialized in laser distressing and ozone eco-wash processes",
          ],
          academics: [
            {
              degree: "B.Sc. in Textile Engineering",
              institute: "National Institute of Textile Engineering & Research (NITER)",
              year: "2020",
              grade: "CGPA 3.55 / 4.00",
            },
          ],
          experiences: [
            {
              role: "Merchandiser (Denim)",
              company: "Standard Group Ltd",
              duration: "2021 - Present (3 Years)",
              responsibilities: [
                "Handled Denim bottom bookings and wet/dry wash recipe follow-up.",
              ],
            },
          ],
          personalDetails: {
            dob: "1997-11-05",
            bloodGroup: "A+",
            nid: "19972691500000999",
            address: "Mirpur-10, Block C, Dhaka",
            maritalStatus: "Single",
          },
          skills: ["Denim Costing", "Wet Processing", "Vendor Sourcing", "MS Excel Advanced"],
          references: [
            {
              name: "Sultan Mahmud",
              designation: "AGM Merchandising",
              company: "Standard Group",
              phone: "+880 1622-111222",
            },
          ],
        },
      },
      {
        id: "PAL000024",
        name: "Nusrat Jahan Shimu",
        nameBng: "নুসরাত জাহান শিমু",
        email: "nusrat.shimu@example.com",
        phone: "+880 1933-778899",
        department: "Merchandising",
        designation: "Senior Merchandiser",
        previousSalary: 36000,
        agreedSalary: 46000,
        experience: "4.0 Years",
        noticePeriod: "Immediate",
        selected: false,
        status: "Pending",
        cv: {
          summary:
            "Energetic Merchandiser adept at activewear garments, synthetic fabrics, bonded seams, and technical performance testing.",
          highlights: [
            "Decathlon and Puma technical outerwear merchandising experience",
            "Bilingual communication in English and French (Conversational)",
          ],
          academics: [
            {
              degree: "BBA in Supply Chain Management",
              institute: "North South University",
              year: "2020",
              grade: "CGPA 3.60 / 4.00",
            },
          ],
          experiences: [
            {
              role: "Assistant Merchandiser",
              company: "Beximco Apparels Ltd",
              duration: "2020 - Present (4 Years)",
              responsibilities: [
                "Managed accessory inventory, buyer comments tracking, and factory scheduling.",
              ],
            },
          ],
          personalDetails: {
            dob: "1998-04-18",
            bloodGroup: "AB+",
            nid: "19982691500000123",
            address: "Sector 11, Uttara, Dhaka",
            maritalStatus: "Single",
          },
          skills: ["Activewear Sourcing", "Technical Trims", "Supply Chain", "FastReact"],
          references: [
            {
              name: "Mahbubur Rahman",
              designation: "Senior Manager",
              company: "Beximco Apparels",
              phone: "+880 1933-555666",
            },
          ],
        },
      },
      {
        id: "PAL000020",
        name: "Md. Kamrul Hasan",
        nameBng: "মোঃ কামরুল হাসান",
        email: "kamrul.hasan@example.com",
        phone: "+880 1819-223344",
        department: "Merchandising",
        designation: "Senior Merchandiser",
        previousSalary: 42000,
        agreedSalary: 52000,
        initialAgreedSalary: 52000,
        experience: "5.5 Years",
        noticePeriod: "15 Days",
        selected: false,
        status: "Pending",
        cv: {
          summary:
            "Experienced Merchandiser with 5+ years handling knitwear fabric sourcing, yarn costing, lab-dip approvals, and bulk production monitoring for H&M and Next.",
          highlights: [
            "Managed $4.2M knitwear export volume annually",
            "Expert in buyer portal tech packs and sample lifecycle",
          ],
          academics: [
            {
              degree: "B.Sc. in Textile Engineering (Fabric Manufacturing)",
              institute: "BUTEX (Bangladesh University of Textiles)",
              year: "2019",
              grade: "CGPA 3.52 / 4.00",
            },
          ],
          experiences: [
            {
              role: "Merchandiser",
              company: "Epyllion Group",
              duration: "2019 - Present (5 Years)",
              responsibilities: [
                "Handled buyer correspondence, costing sheets, and T&A calendar tracking.",
              ],
            },
          ],
          personalDetails: {
            dob: "1996-08-14",
            bloodGroup: "O+",
            nid: "19962691500000888",
            address: "Dhanmondi 27, Dhaka",
            maritalStatus: "Married",
          },
          skills: ["Knitwear Costing", "Fabric Sourcing", "ERP Followup", "Buyer Negotiation"],
          references: [
            {
              name: "Zillur Rahman",
              designation: "General Manager Merchandising",
              company: "Epyllion Group",
              phone: "+880 1819-887766",
            },
          ],
        },
      },
    ],
  },
  {
    id: "JOB-2026-002",
    title: "Quality Assurance Inspector (AQL 2.5 Major / 4.0 Minor)",
    department: "Quality Control",
    designation: "QA Inspector",
    vacancies: 1,
    assignedPerson: "Engr. Rezaul Karim",
    assignedRole: "Quality Assurance Director",
    targetDate: "2026-10-28",
    salaryBudgetMin: 24000,
    salaryBudgetMax: 32000,
    status: "Submitted",
    submittedAt: "2026-10-26 09:15",
    submittedBy: "Engr. Rezaul Karim (Quality Assurance Director)",
    submissionRemarks: "Selected top performing candidate with 4.5 years ISO & AQL garment audit experience.",
    currentApprovalLevel: 1,
    approvalFlow: createDefaultApprovalFlow("Engr. Rezaul Karim", "Quality Assurance Director"),
    approvalHistory: [
      {
        id: "act-104",
        level: 1,
        approverName: "Engr. Rezaul Karim",
        approverRole: "Department Head",
        approverDesignation: "Quality Assurance Director",
        action: "Submitted",
        timestamp: "2026-10-26 09:15",
        remarks: "Candidate nomination submitted for review.",
      },
    ],
    createdAt: "2026-10-04",
    candidates: [
      {
        id: "PAL000025",
        name: "Md. Rafiqul Alam",
        nameBng: "মোঃ রফিকুল আলম",
        email: "rafiq.qa@example.com",
        phone: "+880 1722-998877",
        department: "Quality Control",
        designation: "QA Inspector",
        previousSalary: 23000,
        agreedSalary: 29000,
        initialAgreedSalary: 29000,
        experience: "4.5 Years",
        noticePeriod: "Immediate",
        selected: true,
        selectedAt: "2026-10-26 09:00",
        status: "Selected",
        salaryHistory: [
          {
            id: "rev-204",
            approverLevel: 0,
            approverRole: "Entry Specialist",
            approverName: "Engr. Rezaul Karim",
            approverDesignation: "Quality Assurance Director",
            timestamp: "2026-10-26 09:00",
            previousSalary: 23000,
            newSalary: 29000,
            delta: 6000,
            reason: "Initial proposed salary based on technical test score 94%.",
          },
        ],
        cv: {
          summary:
            "Certified Garment Quality Inspector experienced in inline, roving, end-line, and final audits under ISO 9001 and AQL 2.5 standards for US & EU apparel buyers.",
          highlights: [
            "Zero major shipment rejections across 3 years at Envoy Textiles",
            "Expert in measurement spec sheets, shade lot matching, and carton audits",
          ],
          academics: [
            {
              degree: "Diploma in Garment Quality & Production",
              institute: "BIFT Institute, Dhaka",
              year: "2019",
              grade: "First Division",
            },
          ],
          experiences: [
            {
              role: "Senior QA Inspector",
              company: "Envoy Textiles Ltd",
              duration: "2021 - Present (3 Years)",
              responsibilities: [
                "Performing final carton AQL checks for Target and Walmart shipments.",
                "Conducting 4-point fabric inspection and GSM lab checks.",
              ],
            },
          ],
          personalDetails: {
            dob: "1995-07-12",
            bloodGroup: "O+",
            nid: "19952691500000333",
            address: "Savar, Dhaka",
            maritalStatus: "Married",
          },
          skills: ["AQL 2.5 / 4.0", "ISO 9001:2015", "4-Point System", "Fabric Inspection"],
          references: [
            {
              name: "Jasim Uddin",
              designation: "Quality Manager",
              company: "Envoy Textiles",
              phone: "+880 1722-111000",
            },
          ],
        },
      },
      {
        id: "PAL000026",
        name: "Shirin Akter",
        nameBng: "শিরীন আক্তার",
        email: "shirin.qa@example.com",
        phone: "+880 1844-112233",
        department: "Quality Control",
        designation: "QA Inspector",
        previousSalary: 22000,
        agreedSalary: 28000,
        experience: "3.5 Years",
        noticePeriod: "15 Days",
        selected: false,
        status: "Shortlisted",
        cv: {
          summary:
            "Meticulous Quality Auditor specializing in sewing floor inline audits, defect classification (Critical, Major, Minor), and Root Cause Analysis (RCA).",
          highlights: ["Implemented 5S and Traffic Light system on 12 sewing lines at Viyellatex"],
          academics: [
            {
              degree: "HSC (Commerce)",
              institute: "Gazipur Govt. Girls College",
              year: "2018",
              grade: "GPA 4.40 / 5.00",
            },
          ],
          experiences: [
            {
              role: "Line QA",
              company: "Viyellatex Group",
              duration: "2020 - Present (4 Years)",
              responsibilities: ["Supervised 7 inline QA inspectors across knitwear sewing floors."],
            },
          ],
          personalDetails: {
            dob: "1998-02-19",
            bloodGroup: "A+",
            nid: "19982691500000777",
            address: "Tongi, Gazipur",
            maritalStatus: "Single",
          },
          skills: ["RCA Analysis", "Traffic Light System", "Inline Audit", "Garment Defects"],
          references: [
            {
              name: "Nazmul Huda",
              designation: "DGM QA",
              company: "Viyellatex Group",
              phone: "+880 1844-333444",
            },
          ],
        },
      },
    ],
  },
  {
    id: "JOB-2026-003",
    title: "Senior Sewing Machine Operator (Multi-Machine Grade-A)",
    department: "RMG Operation",
    designation: "Operator",
    vacancies: 3,
    assignedPerson: "Mizanur Rahman",
    assignedRole: "Production Manager",
    targetDate: "2026-11-05",
    salaryBudgetMin: 14500,
    salaryBudgetMax: 18500,
    status: "Open",
    approvalFlow: createDefaultApprovalFlow("Mizanur Rahman", "Production Manager"),
    createdAt: "2026-10-06",
    candidates: [
      {
        id: "PAL000028",
        name: "Md. Al-Amin Sheikh",
        nameBng: "মোঃ আল-আমিন শেখ",
        email: "alamin.op@example.com",
        phone: "+880 1911-334455",
        department: "RMG Operation",
        designation: "Operator",
        previousSalary: 13800,
        agreedSalary: 16800,
        experience: "4.5 Years",
        noticePeriod: "Immediate",
        selected: false,
        status: "Shortlisted",
        cv: {
          summary:
            "High-efficiency Grade-A Sewing Operator proficient in Overlock (4-thread / 5-thread), Single Needle Lockstitch (SNLS), and Flatlock cuff/hem attachments at 85%+ operator efficiency.",
          highlights: [
            "Achieved Star Operator recognition 3 times at Square Fashions Ltd",
            "Expert in bottom hem folding without guide attachment at high speed",
          ],
          academics: [
            {
              degree: "SSC (Vocational)",
              institute: "Mirpur Technical Training Centre (TTC)",
              year: "2017",
              grade: "GPA 4.10 / 5.00",
            },
          ],
          experiences: [
            {
              role: "Senior Sewing Operator",
              company: "Square Fashions Ltd (Unit 2)",
              duration: "2020 - Present (4 Years)",
              responsibilities: [
                "Handled critical collar attach, sleeve attach, and side seam overlock.",
              ],
            },
          ],
          personalDetails: {
            dob: "1997-09-10",
            bloodGroup: "B+",
            nid: "19972691500000555",
            address: "Konabari, Gazipur",
            maritalStatus: "Married",
          },
          skills: ["Overlock 4-thread", "Flatlock Hem", "SNLS Topstitch", "85%+ Efficiency"],
          references: [
            {
              name: "Abdul Kader",
              designation: "Line Supervisor",
              company: "Square Fashions",
              phone: "+880 1911-999888",
            },
          ],
        },
      },
      {
        id: "PAL000029",
        name: "Mst. Rina Parvin",
        nameBng: "মোসাঃ রীনা পারভীন",
        email: "rina.op@example.com",
        phone: "+880 1788-223344",
        department: "RMG Operation",
        designation: "Operator",
        previousSalary: 13200,
        agreedSalary: 16200,
        experience: "3.5 Years",
        noticePeriod: "Immediate",
        selected: false,
        status: "Shortlisted",
        cv: {
          summary:
            "Skilled knitwear sewing operator with specialized training in waistband elastic attach, tape binding, and double needle feed-off-the-arm machine.",
          highlights: [
            "Proficient in Kansai Special waistband multi-needle machine operations",
          ],
          academics: [
            {
              degree: "SSC (General)",
              institute: "Bogra Cantonment High School",
              year: "2018",
              grade: "GPA 3.85 / 5.00",
            },
          ],
          experiences: [
            {
              role: "Machine Operator",
              company: "Fakir Apparels Ltd",
              duration: "2021 - Present (3 Years)",
              responsibilities: ["Operated Kansai Special and Flatlock elastic attach machines."],
            },
          ],
          personalDetails: {
            dob: "1999-03-25",
            bloodGroup: "AB+",
            nid: "19992691500000222",
            address: "Fatullah, Narayanganj",
            maritalStatus: "Single",
          },
          skills: ["Kansai Special", "Waistband Elastic", "Flatlock Binding", "Quality Check"],
          references: [
            {
              name: "Selim Reza",
              designation: "Floor Incharge",
              company: "Fakir Apparels",
              phone: "+880 1788-777666",
            },
          ],
        },
      },
    ],
  },
  {
    id: "JOB-2026-004",
    title: "Industrial Engineering (IE) & Work Study Officer",
    department: "Industrial Engineering",
    designation: "IE Officer",
    vacancies: 1,
    assignedPerson: "Engr. Asaduzzaman",
    assignedRole: "Head of Industrial Engineering",
    targetDate: "2026-10-30",
    salaryBudgetMin: 32000,
    salaryBudgetMax: 42000,
    status: "Open",
    approvalFlow: createDefaultApprovalFlow("Engr. Asaduzzaman", "Head of Industrial Engineering"),
    createdAt: "2026-10-08",
    candidates: [
      {
        id: "PAL000033",
        name: "Tanmoy Barua",
        nameBng: "তন্ময় বড়ুয়া",
        email: "tanmoy.ie@example.com",
        phone: "+880 1733-445566",
        department: "Industrial Engineering",
        designation: "IE Officer",
        previousSalary: 30000,
        agreedSalary: 37000,
        experience: "4.0 Years",
        noticePeriod: "15 Days",
        selected: false,
        status: "Shortlisted",
        cv: {
          summary:
            "Results-driven Industrial Engineer skilled in GSD (General Sewing Data), operation breakdown, line balancing, SMV calculation, and bottleneck troubleshooting for Polo and T-shirt lines.",
          highlights: [
            "Improved line efficiency by 14% on 6 critical lines at Pacific Jeans",
            "Certified GSD Practitioner (UK Certified)",
          ],
          academics: [
            {
              degree: "B.Sc. in Industrial & Production Engineering (IPE)",
              institute: "CUET (Chittagong University of Engineering and Technology)",
              year: "2020",
              grade: "CGPA 3.48 / 4.00",
            },
          ],
          experiences: [
            {
              role: "Junior IE Officer",
              company: "Pacific Jeans Ltd (EPZ)",
              duration: "2020 - Present (4 Years)",
              responsibilities: [
                "Prepared method analysis, motion study, and standard operational bulletins.",
              ],
            },
          ],
          personalDetails: {
            dob: "1996-10-18",
            bloodGroup: "O+",
            nid: "19961591500000789",
            address: "Nasirabad, Chattogram",
            maritalStatus: "Single",
          },
          skills: ["GSD Analysis", "Time & Motion Study", "Line Balancing", "FastReact"],
          references: [
            {
              name: "Engr. Monirul Islam",
              designation: "AGM IE",
              company: "Pacific Jeans",
              phone: "+880 1733-111000",
            },
          ],
        },
      },
    ],
  },
  {
    id: "JOB-2026-005",
    title: "Production Line Supervisor (Unit-6)",
    department: "Production",
    designation: "Line Supervisor",
    vacancies: 2,
    assignedPerson: "Md. Mostafa Kamal",
    assignedRole: "Factory GM / Head of Production",
    targetDate: "2026-10-12",
    salaryBudgetMin: 28000,
    salaryBudgetMax: 35000,
    status: "Approved",
    submittedAt: "2026-10-10 11:00",
    submittedBy: "Md. Mostafa Kamal",
    currentApprovalLevel: 3,
    approvalFlow: [
      {
        level: 1,
        role: "Department Head",
        approverName: "Md. Mostafa Kamal",
        approverDesignation: "Factory GM",
        status: "Approved",
        actionDate: "2026-10-11 14:00",
        remarks: "Approved. Candidates proven track record in knit production lines.",
      },
      {
        level: 2,
        role: "Head of HR",
        approverName: "Tahmid Afsar Shapno",
        approverDesignation: "Manager, HR & Talent Acquisition",
        status: "Approved",
        actionDate: "2026-10-12 11:30",
        remarks: "Background check cleared, notice period verified.",
      },
      {
        level: 3,
        role: "Managing Director / COO",
        approverName: "Engr. Rafiqul Islam",
        approverDesignation: "Group COO & Executive Director",
        status: "Approved",
        actionDate: "2026-10-13 16:30",
        remarks: "Final approval granted. Issue formal e-recruitment links and appointment dockets.",
      },
    ],
    closedAt: "2026-10-14 16:30",
    closedBy: "Engr. Rafiqul Islam (Group COO)",
    closeReason: "Requisite 2 candidates approved and appointment links dispatched.",
    createdAt: "2026-09-25",
    candidates: [
      {
        id: "PAL000036",
        name: "Md. Shahinur Rahman",
        nameBng: "মোঃ শাহিনুর রহমান",
        email: "shahinur.sup@example.com",
        phone: "+880 1712-334455",
        department: "Production",
        designation: "Line Supervisor",
        previousSalary: 26000,
        agreedSalary: 32000,
        initialAgreedSalary: 32000,
        experience: "6.0 Years",
        noticePeriod: "Immediate",
        selected: true,
        selectedAt: "2026-10-10 10:00",
        generatedLink: "http://localhost:3000/e-recruitment-form?tempId=PAL000036&candidateName=Md.%20Shahinur%20Rahman",
        linkGeneratedAt: "2026-10-13 16:30",
        status: "Approved",
        cv: {
          summary:
            "Dynamic Garments Sewing Line Supervisor with 6+ years managing 60-operator knitwear assembly lines, hourly production tracking, and target attainment.",
          highlights: ["Maintained 96%+ DHU compliance and 82% line efficiency over 2 years at Standard Group"],
          academics: [
            {
              degree: "Diploma in Textile Engineering",
              institute: "Mymensingh Polytechnic Institute",
              year: "2017",
              grade: "CGPA 3.40 / 4.00",
            },
          ],
          experiences: [
            {
              role: "Sewing Line Supervisor",
              company: "Standard Group Ltd",
              duration: "2018 - Present (6 Years)",
              responsibilities: [
                "Responsible for daily target achievement (1,400 pcs/day Polo Shirts).",
                "Line balancing and operator skill matrix maintenance.",
              ],
            },
          ],
          personalDetails: {
            dob: "1995-12-05",
            bloodGroup: "O+",
            nid: "19951191500000999",
            address: "Kapasia, Gazipur",
            maritalStatus: "Married",
          },
          skills: ["Bottleneck Troubleshooting", "Operator Allocation", "Knitwear Line Layout"],
          references: [
            {
              name: "Kazi Nuruzzaman",
              designation: "Production Manager",
              company: "Standard Group",
              phone: "+880 1823-111000",
            },
          ],
        },
      },
    ],
  },
];

export const getStoredJobSelections = (): JobPost[] => {
  if (typeof window === "undefined") return INITIAL_JOBS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_JOBS));
      return INITIAL_JOBS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_JOBS;
  } catch (e) {
    console.error("Failed to parse recruitment job selections", e);
    return INITIAL_JOBS;
  }
};

export const saveStoredJobSelections = (jobs: JobPost[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch (e) {
    console.error("Failed to save recruitment job selections", e);
  }
};

export const syncCandidateToQueue = (
  candidate: JobCandidate,
  job: JobPost,
  link: string
) => {
  if (typeof window === "undefined") return;
  try {
    const queueData = localStorage.getItem("recruitment_candidates");
    let queue: any[] = queueData ? JSON.parse(queueData) : [];
    const existingIdx = queue.findIndex((c: any) => c.empIdTemp === candidate.id);

    const record = {
      empIdTemp: candidate.id,
      nameEng: candidate.name,
      nameBng: candidate.nameBng || "",
      department: candidate.department,
      designation: candidate.designation,
      jobPost: job.title,
      reportingBoss: job.assignedPerson,
      employeeType: candidate.department === "RMG Operation" ? "Worker" : "Staff",
      doj: new Date().toISOString().split("T")[0],
      personalContact: candidate.phone,
      personalEmail: candidate.email,
      formStatus: "Not Filled",
      assessStatus: "Selected / Link Sent",
      agreedSalary: candidate.agreedSalary,
      previousSalary: candidate.previousSalary,
      linkGeneratedAt: new Date().toISOString(),
      recruitmentLink: link,
    };

    if (existingIdx !== -1) {
      queue[existingIdx] = { ...queue[existingIdx], ...record };
    } else {
      queue.unshift(record);
    }
    localStorage.setItem("recruitment_candidates", JSON.stringify(queue));
  } catch (e) {
    console.error("Failed to sync candidate to queue", e);
  }
};

export const getOrInitCandidateApprovalTiers = (
  candidate: JobCandidate,
  job?: { assignedPerson?: string; assignedRole?: string; department?: string }
): CandidateApprovalTier[] => {
  if (candidate.approvalTiers && candidate.approvalTiers.length > 0) {
    return candidate.approvalTiers;
  }

  const initialSalary = candidate.initialAgreedSalary || candidate.agreedSalary || 0;
  const currentAgreed = candidate.agreedSalary || initialSalary;
  const isCandidateFullyApproved = candidate.status === "Approved";
  const isTier1Approved = isCandidateFullyApproved;

  // Tier 1: Department Head / Functional Lead (Evaluator)
  const tier1Name = job?.assignedPerson || "Tanvir Ahmed";
  const tier1Role = job?.assignedRole || "Head of Department";

  const tiers: CandidateApprovalTier[] = [
    {
      id: `tier-1-${candidate.id}`,
      level: 1,
      tierName: "Tier 1: Department Head Endorsement",
      approverName: tier1Name,
      approverDesignation: tier1Role,
      company: "Pakiza Knit Composite Ltd.",
      approvedSalary: initialSalary,
      status: isTier1Approved ? "Approved" : "Pending",
      actionDate: isTier1Approved ? (candidate.selectedAt || "2026-10-13 11:20") : undefined,
      remarks: isTier1Approved
        ? "Candidate credentials verified & endorsed for HR compensation review."
        : undefined,
    },
    {
      id: `tier-2-${candidate.id}`,
      level: 2,
      tierName: "Tier 2: HR Operations & Compensation",
      approverName: "Tahmid Afsar",
      approverDesignation: "HR Director",
      company: "Pakiza Software Limited (PSL-Operation)",
      approvedSalary: currentAgreed,
      status: isCandidateFullyApproved ? "Approved" : "Pending",
      actionDate: isCandidateFullyApproved ? (candidate.linkGeneratedAt || "2026-10-27 13:10") : undefined,
      remarks: isCandidateFullyApproved
        ? "Salary benchmark verified and approved for issuance of recruitment link."
        : undefined,
    },
    {
      id: `tier-3-${candidate.id}`,
      level: 3,
      tierName: "Tier 3: Executive Management Approval",
      approverName: "Engr. Mosharraf Hossain",
      approverDesignation: "Managing Director & CEO",
      company: "Pakiza Group",
      approvedSalary: currentAgreed,
      status: "Pending", // "bakider ta pending thakbe"
      actionDate: undefined,
      remarks: undefined,
    },
  ];

  return tiers;
};

export const getCandidateTier = (
  candidate: JobCandidate,
  level: number,
  job?: { assignedPerson?: string; assignedRole?: string; department?: string }
): CandidateApprovalTier | undefined => {
  const tiers = getOrInitCandidateApprovalTiers(candidate, job);
  return tiers.find((t) => t.level === level);
};
