import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Plus,
  Link2,
  Copy,
  FileText,
  Eye,
  Printer,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Building2,
  DollarSign,
  Lock,
  Unlock,
  Calendar,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Check,
  Share2,
  RotateCcw,
  UserCheck,
  User,
  Filter,
  BadgeCheck,
  Download,
  Upload,
  Trash2,
  Paperclip,
  Send,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";
import { initializeRecruitmentMockData } from "@/lib/recruitment-mock-data";

export const Route = createFileRoute("/recruitment-candidate-selection")({
  head: () => ({
    meta: [
      { title: "Candidate Selection (Data Entry) — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Job-wise candidate evaluation, salary agreement entry, PDF CV review, and candidate nomination submission.",
      },
    ],
  }),
  component: CandidateSelectionPage,
});

import {
  JobCandidate,
  JobPost,
  createDefaultApprovalFlow,
} from "@/lib/recruitment-candidate-selection-data";

export type { JobCandidate, JobPost };

const STORAGE_KEY = "recruitment_job_selections";

const INITIAL_JOBS: JobPost[] = [
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
    status: "Open",
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
        experience: "6.5 Years",
        noticePeriod: "15 Days",
        selected: false,
        status: "Shortlisted",
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
        experience: "5.0 Years",
        noticePeriod: "Immediate",
        selected: false,
        status: "Shortlisted",
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
    status: "Open",
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
        experience: "4.5 Years",
        noticePeriod: "Immediate",
        selected: false,
        status: "Shortlisted",
        cv: {
          summary:
            "Certified Garment Quality Inspector experienced in inline, roving, end-line, and final audits under ISO 9001 and AQL 2.5 standards for US & EU apparel buyers.",
          highlights: [
            "Zero major shipment rejections across 3 years at Envoy Textiles",
            "Expert in measurement spec sheets, shade lot matching, and carton audits",
          ],
          academics: [
            {
              degree: "Diploma in Garments Quality Management",
              institute: "BIFT / BGMEA University of Fashion & Technology",
              year: "2020",
              grade: "First Division",
            },
          ],
          experiences: [
            {
              role: "Quality Assurance Inspector",
              company: "Envoy Textiles & Garments Ltd",
              duration: "2021 - Present (3.5 Years)",
              responsibilities: [
                "Conducting 100% pre-final and final packaging inspections.",
                "Reviewing PP sample comments and ensuring production follows tech packs.",
              ],
            },
          ],
          personalDetails: {
            dob: "1997-02-10",
            bloodGroup: "O+",
            nid: "19973391800000111",
            address: "Board Bazar, Gazipur Sadar",
            maritalStatus: "Married",
          },
          skills: ["AQL 2.5 Standards", "Inline Quality Audit", "Tech Pack Analysis", "Fabric Defect 4-Point System"],
          references: [
            {
              name: "Jamil Hossain",
              designation: "QA Manager",
              company: "Envoy Garments",
              phone: "+880 1722-111000",
            },
          ],
        },
      },
      {
        id: "PAL000026",
        name: "Shahadat Hossain Babu",
        nameBng: "শাহাদাত হোসেন বাবু",
        email: "shahadat.babu@example.com",
        phone: "+880 1833-221100",
        department: "Quality Control",
        designation: "QA Inspector",
        previousSalary: 21500,
        agreedSalary: 27500,
        experience: "3.5 Years",
        noticePeriod: "7 Days",
        selected: false,
        status: "Shortlisted",
        cv: {
          summary:
            "Dedicated QA Auditor with specialized competency in sewing defect root cause analysis, needle detector verification, and pull-test calibration.",
          highlights: [
            "Conducted over 1,200 inline audits with comprehensive statistical SPC tracking",
          ],
          academics: [
            {
              degree: "Higher Secondary Certificate (HSC)",
              institute: "Tongi Government College",
              year: "2019",
              grade: "GPA 4.20 / 5.00",
            },
          ],
          experiences: [
            {
              role: "Junior Quality Controller",
              company: "Robintex Group Bangladesh",
              duration: "2021 - Present (3 Years)",
              responsibilities: [
                "Line roving check, critical operation monitoring, and button pull testing.",
              ],
            },
          ],
          personalDetails: {
            dob: "1998-09-12",
            bloodGroup: "B+",
            nid: "19983391800000222",
            address: "Cherag Ali, Tongi, Gazipur",
            maritalStatus: "Single",
          },
          skills: ["Inline Auditing", "Pull Testing", "Color Shading", "Needle Detection Compliance"],
          references: [
            {
              name: "Abul Kashem",
              designation: "Quality In-charge",
              company: "Robintex Group",
              phone: "+880 1833-444333",
            },
          ],
        },
      },
      {
        id: "PAL000027",
        name: "Nazmul Huda Sumon",
        nameBng: "নাজমুল হুদা সুমন",
        email: "nazmul.sumon@example.com",
        phone: "+880 1555-667788",
        department: "Quality Control",
        designation: "QA Inspector",
        previousSalary: 24000,
        agreedSalary: 30000,
        experience: "5.0 Years",
        noticePeriod: "15 Days",
        selected: false,
        status: "Pending",
        cv: {
          summary:
            "Seasoned QA Inspector well-versed in Wal-Mart, Target, and Kohl's audit standards.",
          highlights: ["Certified Internal Auditor for ISO 9001:2015"],
          academics: [
            {
              degree: "B.Sc. (Pass Course)",
              institute: "National University",
              year: "2018",
              grade: "Second Class",
            },
          ],
          experiences: [
            {
              role: "Senior QA Officer",
              company: "Square Fashions Ltd",
              duration: "2019 - Present (5 Years)",
              responsibilities: [
                "Supervising final inspection and container loading verification.",
              ],
            },
          ],
          personalDetails: {
            dob: "1996-05-30",
            bloodGroup: "A+",
            nid: "19963391800000333",
            address: "Kashimpur, Gazipur",
            maritalStatus: "Married",
          },
          skills: ["Final Inspection", "Container Loading Audit", "Barcode Verification"],
          references: [
            {
              name: "Delwar Hossain",
              designation: "QC Manager",
              company: "Square Fashions",
              phone: "+880 1555-111222",
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
            "Achieved highest operator efficiency award at Standard Group in 2024",
            "Operates both automatic computer-controlled and standard sewing machines",
          ],
          academics: [
            {
              degree: "SSC (Vocational - RMG)",
              institute: "VTI Gazipur",
              year: "2018",
              grade: "GPA 4.50 / 5.00",
            },
          ],
          experiences: [
            {
              role: "Senior Sewing Operator",
              company: "Standard Group Ltd (Unit-2)",
              duration: "2020 - 2026 (4.5 Years)",
              responsibilities: [
                "Executed collar attach, side seam, and armhole join with zero alteration rate.",
              ],
            },
          ],
          personalDetails: {
            dob: "1998-01-15",
            bloodGroup: "O+",
            nid: "1998261548002341",
            address: "Konabari, Gazipur",
            maritalStatus: "Married",
          },
          skills: ["SNLS", "Overlock 4TH/5TH", "Flatlock", "Armhole Join", "Collar Attach"],
          references: [
            {
              name: "Sirajul Islam",
              designation: "Sewing Line Supervisor",
              company: "Standard Group",
              phone: "+880 1911-999888",
            },
          ],
        },
      },
      {
        id: "PAL000029",
        name: "Ruma Akter",
        nameBng: "রুমা আক্তার",
        email: "ruma.akter@example.com",
        phone: "+880 1744-889900",
        department: "RMG Operation",
        designation: "Operator",
        previousSalary: 14200,
        agreedSalary: 17200,
        experience: "5.0 Years",
        noticePeriod: "Immediate",
        selected: false,
        status: "Shortlisted",
        cv: {
          summary:
            "Expert female sewing operator specializing in polo shirt placket making, cuff join, and neck rib attachments with exceptional finishing standards.",
          highlights: [
            "Zero defect record in critical placket stitching for Tommy Hilfiger & Lacoste lines",
          ],
          academics: [
            {
              degree: "Secondary School Certificate (SSC)",
              institute: "Joydebpur Pilot Girls High School",
              year: "2017",
              grade: "GPA 3.90 / 5.00",
            },
          ],
          experiences: [
            {
              role: "Operator (Sewing)",
              company: "Epyllion Knitwear Ltd",
              duration: "2019 - Present (5 Years)",
              responsibilities: [
                "Dedicated operator for polo front placket and collar joining.",
              ],
            },
          ],
          personalDetails: {
            dob: "1997-06-20",
            bloodGroup: "A+",
            nid: "1997261548009876",
            address: "Shimultoli, Joydebpur, Gazipur",
            maritalStatus: "Married",
          },
          skills: ["Polo Placket Making", "Neck Rib Attachment", "SNLS Precision Stitch"],
          references: [
            {
              name: "Nazneen Sultana",
              designation: "Floor In-charge",
              company: "Epyllion Knitwear",
              phone: "+880 1744-111333",
            },
          ],
        },
      },
      {
        id: "PAL000030",
        name: "Sultana Begum",
        nameBng: "সুলতানা বেগম",
        email: "sultana.begum@example.com",
        phone: "+880 1866-554433",
        department: "RMG Operation",
        designation: "Operator",
        previousSalary: 13000,
        agreedSalary: 16000,
        experience: "3.5 Years",
        noticePeriod: "Immediate",
        selected: false,
        status: "Pending",
        cv: {
          summary:
            "Reliable sewing operator with solid skills in bottom hem, sleeve hem flatlock, and waistband attach.",
          highlights: ["Maintains 80%+ daily target consistency across all knitwear programs"],
          academics: [
            {
              degree: "Class 8 Pass / JSC",
              institute: "Sreepur High School",
              year: "2016",
              grade: "Passed",
            },
          ],
          experiences: [
            {
              role: "Sewing Operator",
              company: "Impress-Newtex Composite Textiles",
              duration: "2021 - Present (3 Years)",
              responsibilities: ["Bottom hem and sleeve hem stitching."],
            },
          ],
          personalDetails: {
            dob: "1999-04-10",
            bloodGroup: "B+",
            nid: "1999261548003322",
            address: "Sreepur, Gazipur",
            maritalStatus: "Married",
          },
          skills: ["Flatlock", "Bottom Hem", "Sleeve Hem"],
          references: [
            {
              name: "Abdul Barek",
              designation: "Line Leader",
              company: "Impress-Newtex",
              phone: "+880 1866-000999",
            },
          ],
        },
      },
      {
        id: "PAL000031",
        name: "Md. Jewel Rana",
        nameBng: "মোঃ জুয়েল রানা",
        email: "jewel.rana@example.com",
        phone: "+880 1688-223344",
        department: "RMG Operation",
        designation: "Operator",
        previousSalary: 14000,
        agreedSalary: 17000,
        experience: "5.5 Years",
        noticePeriod: "Immediate",
        selected: false,
        status: "Pending",
        cv: {
          summary:
            "Multi-skilled operator skilled in back rise, front rise, yoke join, and pocket attach on heavyweight denim & twill fabrics.",
          highlights: ["Experienced with feed-off-the-arm sewing machines for denim inseams"],
          academics: [
            {
              degree: "SSC",
              institute: "Bhawal Mirzapur High School",
              year: "2016",
              grade: "GPA 3.75",
            },
          ],
          experiences: [
            {
              role: "Denim Operator",
              company: "Tusuka Denim Ltd",
              duration: "2019 - Present (5 Years)",
              responsibilities: ["Denim back pocket stitch and inseam run."],
            },
          ],
          personalDetails: {
            dob: "1997-12-08",
            bloodGroup: "O-",
            nid: "1997261548005544",
            address: "Mirzapur, Gazipur",
            maritalStatus: "Single",
          },
          skills: ["Feed-off-the-Arm", "Pocket Attach", "Heavy Fabric Stitching"],
          references: [
            {
              name: "Golam Mostafa",
              designation: "Supervisor",
              company: "Tusuka Denim",
              phone: "+880 1688-777666",
            },
          ],
        },
      },
      {
        id: "PAL000032",
        name: "Bilkis Khatun",
        nameBng: "বিলকিস খাতুন",
        email: "bilkis.khatun@example.com",
        phone: "+880 1977-112233",
        department: "RMG Operation",
        designation: "Operator",
        previousSalary: 13200,
        agreedSalary: 15800,
        experience: "3.5 Years",
        noticePeriod: "Immediate",
        selected: false,
        status: "Pending",
        cv: {
          summary: "Skilled overlock operator specialized in T-shirt side seam and shoulder join.",
          highlights: ["Punctual with 98% attendance rating"],
          academics: [
            {
              degree: "SSC",
              institute: "Rajbari High School",
              year: "2018",
              grade: "GPA 3.50",
            },
          ],
          experiences: [
            {
              role: "Junior Operator",
              company: "Ananta Garments Ltd",
              duration: "2021 - Present (3 Years)",
              responsibilities: ["Side seam overlock on circular knit garments."],
            },
          ],
          personalDetails: {
            dob: "1999-08-25",
            bloodGroup: "AB+",
            nid: "1999261548006677",
            address: "Board Bazar, Gazipur",
            maritalStatus: "Married",
          },
          skills: ["Overlock 4TH", "Shoulder Join", "Side Seam"],
          references: [
            {
              name: "Salma Begum",
              designation: "Line In-charge",
              company: "Ananta Garments",
              phone: "+880 1977-999000",
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
            "Certified GSD Practitioner and Industrial Engineer with strong expertise in line balancing, SMV breakdown calculation, video motion study, and bottleneck elimination in knit and woven lines.",
          highlights: [
            "Reduced line balancing loss from 18% to 8.5% across 14 sewing lines at DBL Group",
            "Certified in GSD (General Sewing Data) license #BD-2021-094",
          ],
          academics: [
            {
              degree: "B.Sc. in Industrial & Production Engineering (IPE)",
              institute: "Chittagong University of Engineering & Technology (CUET)",
              year: "2020",
              grade: "CGPA 3.58 / 4.00",
            },
          ],
          experiences: [
            {
              role: "Industrial Engineering Officer",
              company: "DBL Group (Matin Spinning & Apparels)",
              duration: "2021 - Present (3.5 Years)",
              responsibilities: [
                "Developing operations bulletins, machine layouts, and worker pitch diagrams.",
                "Conducting time studies and tracking hourly operator efficiency graphs.",
              ],
            },
          ],
          personalDetails: {
            dob: "1997-07-19",
            bloodGroup: "O+",
            nid: "19971591500000555",
            address: "Sector 4, Uttara, Dhaka",
            maritalStatus: "Single",
          },
          skills: ["GSD Software", "Line Balancing", "SMV Calculation", "Lean Manufacturing 5S", "Kaizen"],
          references: [
            {
              name: "Engr. Shariful Islam",
              designation: "DGM (IE & Planning)",
              company: "DBL Group",
              phone: "+880 1733-111000",
            },
          ],
        },
      },
      {
        id: "PAL000034",
        name: "Md. Mehedi Hasan",
        nameBng: "মোঃ মেহেদী হাসান",
        email: "mehedi.ie@example.com",
        phone: "+880 1844-667788",
        department: "Industrial Engineering",
        designation: "IE Officer",
        previousSalary: 28000,
        agreedSalary: 35000,
        experience: "3.5 Years",
        noticePeriod: "Immediate",
        selected: false,
        status: "Shortlisted",
        cv: {
          summary:
            "Data-driven IE Executive skilled in line layout design, method study, and SMV reduction through folder & attachment development.",
          highlights: ["Designed 8 customized sewing guides saving 14.2% SMV on polo collar join"],
          academics: [
            {
              degree: "B.Sc. in Textile Engineering",
              institute: "Ahsanullah University of Science & Technology (AUST)",
              year: "2021",
              grade: "CGPA 3.62 / 4.00",
            },
          ],
          experiences: [
            {
              role: "Junior IE Executive",
              company: "Viyellatex Group",
              duration: "2021 - Present (3 Years)",
              responsibilities: [
                "Prepared line balancing matrices and machine allocation plans.",
              ],
            },
          ],
          personalDetails: {
            dob: "1998-10-14",
            bloodGroup: "A+",
            nid: "19981591500000666",
            address: "Gazipur Sadar, Gazipur",
            maritalStatus: "Single",
          },
          skills: ["Work Study", "Method Analysis", "Folder Design", "Line Balancing"],
          references: [
            {
              name: "Tanvir Hossain",
              designation: "Senior Manager (IE)",
              company: "Viyellatex Group",
              phone: "+880 1844-999888",
            },
          ],
        },
      },
      {
        id: "PAL000035",
        name: "Sharmin Sultana",
        nameBng: "শারমিন সুলতানা",
        email: "sharmin.ie@example.com",
        phone: "+880 1955-332211",
        department: "Industrial Engineering",
        designation: "IE Officer",
        previousSalary: 29000,
        agreedSalary: 36000,
        experience: "3.0 Years",
        noticePeriod: "30 Days",
        selected: false,
        status: "Pending",
        cv: {
          summary: "IE specialist in statistical productivity forecasting and non-productive time (NPT) reduction.",
          highlights: ["Six Sigma Green Belt certified"],
          academics: [
            {
              degree: "B.Sc. in IPE",
              institute: "KUET",
              year: "2021",
              grade: "CGPA 3.69 / 4.00",
            },
          ],
          experiences: [
            {
              role: "Work Study Officer",
              company: "Snowtex Outerwear Ltd",
              duration: "2021 - Present (3 Years)",
              responsibilities: ["Time and motion studies on jacket sewing floors."],
            },
          ],
          personalDetails: {
            dob: "1998-03-22",
            bloodGroup: "B+",
            nid: "19981591500000777",
            address: "Dhamrai, Dhaka",
            maritalStatus: "Single",
          },
          skills: ["Six Sigma", "NPT Tracking", "Capacity Study", "AutoCAD Layouts"],
          references: [
            {
              name: "Monirul Islam",
              designation: "Head of Operations",
              company: "Snowtex Outerwear",
              phone: "+880 1955-444555",
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
    status: "Closed",
    closedAt: "2026-10-14 16:30",
    closedBy: "Md. Mostafa Kamal (Factory GM)",
    closeReason: "Requisite 2 candidates selected and accepted offer letters.",
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
        previousSalary: 28000,
        agreedSalary: 34000,
        experience: "7.0 Years",
        noticePeriod: "Joined",
        selected: true,
        selectedAt: "2026-10-13 11:20",
        generatedLink: "http://localhost:5173/e-recruitment-form?tempId=PAL000036",
        linkGeneratedAt: "2026-10-13 11:20",
        status: "Selected",
        cv: {
          summary: "Accomplished Garments Sewing Line Supervisor with 7 years managing 60+ operators per line.",
          highlights: ["Maintained 88% overall line efficiency on fleece hoodie orders"],
          academics: [
            {
              degree: "Higher Secondary Certificate (HSC)",
              institute: "Bhawal Badre Alam Govt College",
              year: "2015",
              grade: "GPA 4.00 / 5.00",
            },
          ],
          experiences: [
            {
              role: "Sewing Line Supervisor",
              company: "Ha-Meem Group Ltd",
              duration: "2017 - 2024 (7 Years)",
              responsibilities: ["Floor line management, hourly target achievement, operator motivation."],
            },
          ],
          personalDetails: {
            dob: "1994-08-11",
            bloodGroup: "B+",
            nid: "19941191500000888",
            address: "Chowrasta, Gazipur",
            maritalStatus: "Married",
          },
          skills: ["Line Supervision", "Hourly Target Balancing", "Quality Enforcement"],
          references: [
            {
              name: "Amirul Islam",
              designation: "Production GM",
              company: "Ha-Meem Group",
              phone: "+880 1712-999000",
            },
          ],
        },
      },
      {
        id: "PAL000037",
        name: "Abdur Rashid Mia",
        nameBng: "আব্দুর রশিদ মিয়া",
        email: "abdur.rashid@example.com",
        phone: "+880 1823-445566",
        department: "Production",
        designation: "Line Supervisor",
        previousSalary: 27500,
        agreedSalary: 33500,
        experience: "6.5 Years",
        noticePeriod: "Joined",
        selected: true,
        selectedAt: "2026-10-13 11:25",
        generatedLink: "http://localhost:5173/e-recruitment-form?tempId=PAL000037",
        linkGeneratedAt: "2026-10-13 11:25",
        status: "Selected",
        cv: {
          summary: "Experienced RMG Supervisor adept in knit basic and fancy tops line management.",
          highlights: ["Reduced endline alteration rate below 2%"],
          academics: [
            {
              degree: "HSC",
              institute: "Kapasia College",
              year: "2016",
              grade: "GPA 3.80",
            },
          ],
          experiences: [
            {
              role: "Floor Supervisor",
              company: "Standard Group Ltd",
              duration: "2018 - 2024 (6 Years)",
              responsibilities: ["Managing line output and bottleneck interventions."],
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

function CandidateSelectionPage() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Pending" | "Submitted" | "Approved">("Pending");
  const [deptFilter, setDeptFilter] = useState<string>("All");
  const [expandedJobIds, setExpandedJobIds] = useState<Record<string, boolean>>({});

  // Active CV & Review Modal state
  const [activeCvCandidate, setActiveCvCandidate] = useState<{
    candidate: JobCandidate;
    jobTitle: string;
    jobCode: string;
  } | null>(null);
  const [reviewSalaryInput, setReviewSalaryInput] = useState<number | "">("");

  const openReviewModal = (candidate: JobCandidate, jobTitle: string, jobCode: string) => {
    setActiveCvCandidate({
      candidate,
      jobTitle,
      jobCode,
    });
    setReviewSalaryInput(candidate.agreedSalary || candidate.previousSalary || 0);
  };

  // Close Job Confirmation Modal
  const [closingJob, setClosingJob] = useState<JobPost | null>(null);
  const [closeReasonInput, setCloseReasonInput] = useState("");

  // Create Job Modal
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [addJobModalStep, setAddJobModalStep] = useState<1 | 2>(1);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobDept, setNewJobDept] = useState("Merchandising");
  const [newJobDesig, setNewJobDesig] = useState("");
  const [newJobVacancies, setNewJobVacancies] = useState(1);
  const [newJobAssigned, setNewJobAssigned] = useState("Tanvir Ahmed (HR/Hiring Manager)");
  const [newJobTargetDate, setNewJobTargetDate] = useState("2026-11-15");
  const [newJobBudgetMin, setNewJobBudgetMin] = useState(25000);
  const [newJobBudgetMax, setNewJobBudgetMax] = useState(35000);

  const handleProceedToStep2 = () => {
    if (!newJobTitle.trim()) {
      toast.error("Please enter the Job Title before proceeding to Step 2.");
      return;
    }
    if (!newJobDesig.trim()) {
      toast.error("Please enter the Designation before proceeding to Step 2.");
      return;
    }
    setAddJobModalStep(2);
  };

  // Candidate draft state for Job Creation & Add Candidate
  const createDefaultCandidateDraft = () => ({
    id: "draft-" + Math.random().toString(36).substring(2, 9),
    name: "",
    nameBng: "",
    phone: "",
    email: "",
    previousSalary: 28000,
    agreedSalary: 35000,
    experience: "4.0 Years",
    noticePeriod: "Immediate",
    pdfFileName: "Tahmid Afsar Shapno-details_.pdf",
    pdfUrl: "/Tahmid%20Afsar%20Shapno-details_.pdf",
    fileSizeLabel: "809 KB (Default)",
    isCustomPdf: false,
  });

  const [newJobCandidates, setNewJobCandidates] = useState<Array<ReturnType<typeof createDefaultCandidateDraft>>>([
    createDefaultCandidateDraft(),
  ]);

  // Modal state for adding candidate to existing job
  const [addingCandidateToJob, setAddingCandidateToJob] = useState<JobPost | null>(null);
  const [singleCandidateDraft, setSingleCandidateDraft] = useState<ReturnType<typeof createDefaultCandidateDraft>>(
    createDefaultCandidateDraft()
  );

  const handleCandidateFileUpload = (
    index: number,
    file: File,
    isSingleJobMode = false
  ) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please upload a PDF document (.pdf)");
      return;
    }

    const sizeKb = Math.round(file.size / 1024);
    const sizeLabel = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (isSingleJobMode) {
        setSingleCandidateDraft((prev) => ({
          ...prev,
          pdfFileName: file.name,
          pdfUrl: dataUrl,
          fileSizeLabel: sizeLabel,
          isCustomPdf: true,
        }));
      } else {
        setNewJobCandidates((prev) => {
          const copy = [...prev];
          copy[index] = {
            ...copy[index],
            pdfFileName: file.name,
            pdfUrl: dataUrl,
            fileSizeLabel: sizeLabel,
            isCustomPdf: true,
          };
          return copy;
        });
      }
      toast.success(`PDF attached: ${file.name} (${sizeLabel})`);
    };
    reader.onerror = () => {
      const objUrl = URL.createObjectURL(file);
      if (isSingleJobMode) {
        setSingleCandidateDraft((prev) => ({
          ...prev,
          pdfFileName: file.name,
          pdfUrl: objUrl,
          fileSizeLabel: sizeLabel,
          isCustomPdf: true,
        }));
      } else {
        setNewJobCandidates((prev) => {
          const copy = [...prev];
          copy[index] = {
            ...copy[index],
            pdfFileName: file.name,
            pdfUrl: objUrl,
            fileSizeLabel: sizeLabel,
            isCustomPdf: true,
          };
          return copy;
        });
      }
      toast.success(`PDF attached: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleAddCandidateRow = () => {
    setNewJobCandidates((prev) => [...prev, createDefaultCandidateDraft()]);
    toast.info("Added candidate profile entry.");
  };

  const handleRemoveCandidateRow = (index: number) => {
    if (newJobCandidates.length <= 1) {
      setNewJobCandidates([createDefaultCandidateDraft()]);
      return;
    }
    setNewJobCandidates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateCandidateDraft = (
    index: number,
    field: string,
    val: any
  ) => {
    setNewJobCandidates((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  // Edit Agreed Salary Modal
  const [editingSalary, setEditingSalary] = useState<{
    jobId: string;
    candidateId: string;
    candidateName: string;
    currentAgreed: number;
    prevSalary: number;
  } | null>(null);
  const [tempAgreedSalary, setTempAgreedSalary] = useState(0);

  // Edit Candidate Modal State (Direct Candidate Particulars & Proposed Salary Editing)
  const [editingCandidate, setEditingCandidate] = useState<{
    job: JobPost;
    candidate: JobCandidate;
    name: string;
    phone: string;
    email: string;
    experience: string;
    noticePeriod: string;
    previousSalary: number | string;
    agreedSalary: number | string;
    pdfUrl: string;
    pdfFileName: string;
  } | null>(null);

  const handleOpenEditCandidate = (job: JobPost, candidate: JobCandidate) => {
    if (candidate.status === "Approved" || job.status === "Approved") {
      toast.error("This candidate has already been approved and cannot be edited.");
      return;
    }
    setEditingCandidate({
      job,
      candidate,
      name: candidate.name,
      phone: candidate.phone,
      email: candidate.email,
      experience: candidate.experience,
      noticePeriod: candidate.noticePeriod,
      previousSalary: candidate.previousSalary,
      agreedSalary: candidate.agreedSalary,
      pdfUrl: candidate.pdfUrl || "/Tahmid%20Afsar%20Shapno-details_.pdf",
      pdfFileName: candidate.pdfFileName || "Curriculum_Vitae.pdf",
    });
  };

  const handleSaveEditedCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidate) return;
    const { job, candidate, name, phone, email, experience, noticePeriod, previousSalary, agreedSalary, pdfUrl, pdfFileName } = editingCandidate;

    if (!name.trim()) {
      toast.error("Candidate full name is required.");
      return;
    }

    const prevSal = Number(previousSalary) || 0;
    const agrSal = Number(agreedSalary) || prevSal;

    const updatedJobs = jobs.map((j) => {
      if (j.id === job.id) {
        return {
          ...j,
          candidates: j.candidates.map((c) => {
            if (c.id === candidate.id) {
              return {
                ...c,
                name: name.trim(),
                phone: phone.trim(),
                email: email.trim(),
                experience: experience.trim() || c.experience,
                noticePeriod: noticePeriod.trim() || c.noticePeriod,
                previousSalary: prevSal,
                agreedSalary: agrSal,
                pdfUrl,
                pdfFileName,
              };
            }
            return c;
          }),
        };
      }
      return j;
    });

    persistJobs(updatedJobs);
    setEditingCandidate(null);
    toast.success(`Candidate ${name} updated successfully!`);
  };

  // Job Submission & Final Approval Modal (with batch salary review)
  const [approvingJob, setApprovingJob] = useState<{
    job: JobPost;
    candidateSalaries: Record<string, number>;
    closeReason: string;
  } | null>(null);

  // Initialize and load data
  useEffect(() => {
    initializeRecruitmentMockData();
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const normalized = parsed.map((j: JobPost) => ({
          ...j,
          candidates: j.candidates.map((c: JobCandidate) => ({
            ...c,
            selected: true,
            status: (c.status === "Approved" ? "Approved" : "Selected") as JobCandidate["status"],
          })),
        }));
        setJobs(normalized);
        // Smart default status filter selection
        const hasPending = normalized.some((j: JobPost) => {
          const tot = j.candidates.length;
          const app = j.candidates.filter((c: JobCandidate) => c.status === "Approved").length;
          const isApp = j.status === "Approved" || (tot > 0 && app === tot);
          return !isApp && j.status !== "Submitted";
        });
        const hasSubmitted = normalized.some((j: JobPost) => j.status === "Submitted");
        if (!hasPending && hasSubmitted) {
          setStatusFilter("Submitted");
        } else if (!hasPending && !hasSubmitted && normalized.length > 0) {
          setStatusFilter("Approved");
        }

        // Default expand first two open jobs
        const initialExpand: Record<string, boolean> = {};
        normalized.slice(0, 2).forEach((j: JobPost) => {
          initialExpand[j.id] = true;
        });
        setExpandedJobIds(initialExpand);
      } catch (e) {
        const normalizedInit: JobPost[] = INITIAL_JOBS.map((j) => ({
          ...j,
          candidates: j.candidates.map((c) => ({
            ...c,
            selected: true,
            status: (c.status === "Approved" ? "Approved" : "Selected") as JobCandidate["status"],
          })),
        }));
        setJobs(normalizedInit);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedInit));
      }
    } else {
      const normalizedInit: JobPost[] = INITIAL_JOBS.map((j) => ({
        ...j,
        candidates: j.candidates.map((c) => ({
          ...c,
          selected: true,
          status: (c.status === "Approved" ? "Approved" : "Selected") as JobCandidate["status"],
        })),
      }));
      setJobs(normalizedInit);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedInit));
      const initialExpand: Record<string, boolean> = {};
      normalizedInit.slice(0, 2).forEach((j) => {
        initialExpand[j.id] = true;
      });
      setExpandedJobIds(initialExpand);
    }
  }, []);

  // Save jobs helper
  const persistJobs = (updated: JobPost[]) => {
    setJobs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Toggle Accordion
  const toggleJobAccordion = (jobId: string) => {
    setExpandedJobIds((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  // Synchronize candidate to recruitment_candidates (Application Queue)
  const syncCandidateToQueue = (candidate: JobCandidate, job: JobPost, link: string) => {
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
  };

  // Open candidate review & approval modal
  const handleOpenApproveCandidate = (jobId: string, candidate: JobCandidate) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    if (job.status === "Closed") {
      toast.error("This job is Closed. Reopen the job to modify selections.");
      return;
    }

    openReviewModal(candidate, job.title, jobId);
  };

  // Confirm candidate selection & proposed salary from review modal (Entry Mode)
  const handleApproveFromReview = () => {
    if (!activeCvCandidate) return;
    const salary = Number(reviewSalaryInput);
    if (!salary || salary <= 0 || isNaN(salary)) {
      toast.error("Please enter a valid agreed/proposed salary.");
      return;
    }

    const { jobCode, candidate } = activeCvCandidate;
    const job = jobs.find((j) => j.id === jobCode);
    if (!job) return;

    const updatedJobs = jobs.map((j) => {
      if (j.id === jobCode) {
        const updatedCandidates = j.candidates.map((c) => {
          if (c.id === candidate.id) {
            return {
              ...c,
              selected: true,
              selectedAt: c.selectedAt || new Date().toISOString(),
              status: "Selected" as const,
              agreedSalary: salary,
              initialAgreedSalary: c.initialAgreedSalary || salary,
            };
          }
          return c;
        });
        return { ...j, candidates: updatedCandidates };
      }
      return j;
    });

    persistJobs(updatedJobs);
    toast.success(`Candidate ${candidate.name} selected (৳${salary.toLocaleString()})! Ready for approval.`);
  };

  // Confirm candidate approval with the inputted salary (legacy support)
  const handleConfirmApproveCandidate = () => {
    handleApproveFromReview();
  };

  // Deselect candidate
  const handleDeselectCandidate = (jobId: string, candidateId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    if (job.status === "Closed") {
      toast.error("This job is Closed. Reopen the job to modify selections.");
      return;
    }

    const candidate = job.candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    const updatedJobs = jobs.map((j) => {
      if (j.id === jobId) {
        const updatedCandidates = j.candidates.map((c) => {
          if (c.id === candidateId) {
            return {
              ...c,
              selected: false,
              selectedAt: undefined,
              status: "Shortlisted" as const,
            };
          }
          return c;
        });
        return { ...j, candidates: updatedCandidates };
      }
      return j;
    });

    persistJobs(updatedJobs);
    toast.info(`Deselected ${candidate.name}.`);
  };

  // Auto-generate link and toggle selection (mandates salary input when approving)
  const handleToggleCandidateSelection = (jobId: string, candidateId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    if (job.status === "Closed") {
      toast.error("This job is Closed. Reopen the job to modify selections.");
      return;
    }

    const candidate = job.candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    if (!candidate.selected) {
      handleOpenApproveCandidate(jobId, candidate);
    } else {
      handleDeselectCandidate(jobId, candidateId);
    }
  };

  // Copy candidate e-recruitment link
  const handleCopyLink = (link?: string, candidateName?: string) => {
    if (!link) {
      toast.error("No link generated for this candidate.");
      return;
    }
    navigator.clipboard.writeText(link);
    toast.success(`Copied e-recruitment link for ${candidateName || "candidate"}!`);
  };

  // Confirm and close job
  const handleConfirmCloseJob = () => {
    if (!closingJob) return;

    const selectedCount = closingJob.candidates.filter((c) => c.selected).length;
    const finalReason =
      closeReasonInput.trim() ||
      `Job selection successfully completed with ${selectedCount} candidate(s) selected and enrolled.`;

    const updatedJobs = jobs.map((j) => {
      if (j.id === closingJob.id) {
        return {
          ...j,
          status: "Closed" as const,
          closedAt: new Date().toLocaleString(),
          closedBy: `${closingJob.assignedPerson} (${closingJob.assignedRole})`,
          closeReason: finalReason,
        };
      }
      return j;
    });

    persistJobs(updatedJobs);
    setClosingJob(null);
    setCloseReasonInput("");
    toast.success(`Job ${closingJob.title} has been officially Closed!`);
  };

  // Open Job Proposal & Submission Modal (reviews and mandates salary verification before forwarding to approval console)
  const handleOpenApproveJobModal = (jobId: string) => {
    const targetJob = jobs.find((j) => j.id === jobId);
    if (!targetJob) return;

    if (targetJob.candidates.length === 0) {
      toast.error("Please add at least one candidate before submitting this position for approval.");
      return;
    }

    const initialSalaries: Record<string, number> = {};
    targetJob.candidates.forEach((c) => {
      initialSalaries[c.id] = c.agreedSalary || c.previousSalary || targetJob.salaryBudgetMin || 0;
    });

    setApprovingJob({
      job: targetJob,
      candidateSalaries: initialSalaries,
      closeReason: `Candidate selection submitted: ${targetJob.candidates.length} of ${targetJob.vacancies} vacancies proposed for management approval.`,
    });
  };

  // Confirm Job Submission for Approval
  const handleConfirmApproveJob = () => {
    if (!approvingJob) return;
    const { job, candidateSalaries, closeReason } = approvingJob;

    for (const cand of job.candidates) {
      const sal = candidateSalaries[cand.id] || cand.agreedSalary;
      if (!sal || sal <= 0 || isNaN(sal)) {
        toast.error(`Please input a valid proposed salary (> 0) for candidate ${cand.name}.`);
        return;
      }
    }

    const updatedJobs = jobs.map((j) => {
      if (j.id === job.id) {
        const updatedCandidates = j.candidates.map((c) => {
          const finalSal = candidateSalaries[c.id] || c.agreedSalary;
          return {
            ...c,
            selected: true,
            agreedSalary: finalSal,
            initialAgreedSalary: c.initialAgreedSalary || finalSal,
            status: c.status === "Approved" ? ("Approved" as const) : ("Selected" as const),
          };
        });

        const newFlow =
          j.approvalFlow && j.approvalFlow.length > 0
            ? j.approvalFlow
            : createDefaultApprovalFlow(j.assignedPerson, j.assignedRole);

        const newHistoryLog = {
          id: "act-" + Date.now(),
          level: 1,
          approverName: j.assignedPerson || "Requisition Lead",
          approverRole: "Department Head",
          approverDesignation: j.assignedRole || "Lead Evaluator",
          action: "Submitted" as const,
          timestamp: new Date().toLocaleString(),
          remarks:
            closeReason.trim() ||
            `Candidate selection submitted: ${updatedCandidates.length} of ${j.vacancies} vacancies proposed for management approval.`,
        };

        return {
          ...j,
          candidates: updatedCandidates,
          status: "Submitted" as const,
          submittedAt: new Date().toLocaleString(),
          submittedBy: `${job.assignedPerson || "Evaluator"} (${job.assignedRole || "Lead"})`,
          currentApprovalLevel: 1,
          approvalFlow: newFlow,
          approvalHistory: [...(j.approvalHistory || []), newHistoryLog],
        };
      }
      return j;
    });

    persistJobs(updatedJobs);
    setApprovingJob(null);
    toast.success(
      `Requisition ${job.title} successfully submitted! Awaiting approval in Candidate Selection Approval console.`
    );
  };

  // Withdraw / Recall to draft
  const handleWithdrawSubmission = (jobId: string) => {
    const updatedJobs = jobs.map((j) => {
      if (j.id === jobId) {
        return {
          ...j,
          status: "Open" as const,
          submittedAt: undefined,
          submittedBy: undefined,
        };
      }
      return j;
    });
    persistJobs(updatedJobs);
    toast.info("Requisition withdrawn to editable draft.");
  };

  // Legacy wrapper for direct submit
  const handleSubmitJob = (jobId: string) => {
    handleOpenApproveJobModal(jobId);
  };

  // Reopen Job
  const handleReopenJob = (jobId: string) => {
    const updatedJobs = jobs.map((j) => {
      if (j.id === jobId) {
        return {
          ...j,
          status: "Open" as const,
          closedAt: undefined,
          closedBy: undefined,
          closeReason: undefined,
        };
      }
      return j;
    });
    persistJobs(updatedJobs);
    toast.info("Job position has been reopened for candidate selection.");
  };

  // Save updated agreed salary
  const handleSaveAgreedSalary = () => {
    if (!editingSalary) return;
    if (tempAgreedSalary <= 0) {
      toast.error("Please enter a valid salary amount.");
      return;
    }

    const updatedJobs = jobs.map((j) => {
      if (j.id === editingSalary.jobId) {
        const updatedCands = j.candidates.map((c) => {
          if (c.id === editingSalary.candidateId) {
            return {
              ...c,
              agreedSalary: tempAgreedSalary,
            };
          }
          return c;
        });
        return { ...j, candidates: updatedCands };
      }
      return j;
    });

    persistJobs(updatedJobs);

    // Also sync to application queue if candidate is registered
    const queueData = localStorage.getItem("recruitment_candidates");
    if (queueData) {
      try {
        let queue: any[] = JSON.parse(queueData);
        queue = queue.map((c: any) =>
          c.empIdTemp === editingSalary.candidateId ? { ...c, agreedSalary: tempAgreedSalary } : c
        );
        localStorage.setItem("recruitment_candidates", JSON.stringify(queue));
      } catch (e) {}
    }

    setEditingSalary(null);
    toast.success(`Agreed salary updated to ৳${tempAgreedSalary.toLocaleString()}!`);
  };

  // Add candidate directly to an existing job
  const handleAddCandidateToExistingJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingCandidateToJob) return;
    if (!singleCandidateDraft.name.trim()) {
      toast.error("Please enter the candidate's name.");
      return;
    }

    const totalExistingCandidates = jobs.flatMap((j) => j.candidates).length;
    const candId = `PAL${String(totalExistingCandidates + 40).padStart(6, "0")}`;

    const newCandidate: JobCandidate = {
      id: candId,
      name: singleCandidateDraft.name.trim(),
      nameBng: singleCandidateDraft.nameBng?.trim() || undefined,
      department: addingCandidateToJob.department,
      designation: addingCandidateToJob.designation,
      previousSalary: Number(singleCandidateDraft.previousSalary) || 0,
      agreedSalary: Number(singleCandidateDraft.agreedSalary) || Number(singleCandidateDraft.previousSalary) || 0,
      experience: singleCandidateDraft.experience || "3.5 Years",
      noticePeriod: singleCandidateDraft.noticePeriod || "Immediate",
      phone: singleCandidateDraft.phone || "+880 1700-000000",
      email:
        singleCandidateDraft.email ||
        `${singleCandidateDraft.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      pdfUrl: singleCandidateDraft.pdfUrl || "/Tahmid%20Afsar%20Shapno-details_.pdf",
      pdfFileName: singleCandidateDraft.pdfFileName || "Tahmid Afsar Shapno-details_.pdf",
      selected: true,
      status: "Selected",
      cv: {
        summary: `Applicant for ${addingCandidateToJob.title} with background in ${addingCandidateToJob.department}.`,
        highlights: [
          `Evaluated for ${addingCandidateToJob.title}`,
          `Previous Salary: ৳${Number(singleCandidateDraft.previousSalary).toLocaleString()}, Agreed: ৳${Number(singleCandidateDraft.agreedSalary).toLocaleString()}`,
        ],
        academics: [
          {
            degree: "Graduation / Diploma",
            institute: "University / Polytechnic Institute",
            year: "2019",
            grade: "First Class",
          },
        ],
        experiences: [
          {
            role: addingCandidateToJob.designation,
            company: "Apparel & Garment Manufacturing Ltd",
            duration: "Previous 3-5 Years",
            responsibilities: [
              "Daily operational execution and quality standard adherence.",
            ],
          },
        ],
        personalDetails: {
          dob: "1996-05-15",
          bloodGroup: "B+",
          nid: "1996" + Math.floor(10000000000 + Math.random() * 90000000000),
          address: "Dhaka, Bangladesh",
          maritalStatus: "Single",
        },
        skills: [addingCandidateToJob.department, addingCandidateToJob.designation, "ERP"],
        references: [
          {
            name: "Hiring Authority",
            designation: "Manager",
            company: "Previous Enterprise",
            phone: "+880 1700-112233",
          },
        ],
      },
    };

    const updatedJobs = jobs.map((j) => {
      if (j.id === addingCandidateToJob.id) {
        return {
          ...j,
          candidates: [newCandidate, ...j.candidates],
        };
      }
      return j;
    });

    persistJobs(updatedJobs);
    setAddingCandidateToJob(null);
    setSingleCandidateDraft(createDefaultCandidateDraft());
    toast.success(`Candidate ${newCandidate.name} added to ${addingCandidateToJob.title} with PDF attached!`);
  };

  // Create new job with candidate information and uploaded PDFs
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobDesig.trim()) {
      toast.error("Please fill in the Job Title and Designation.");
      return;
    }

    const totalExistingCandidates = jobs.flatMap((j) => j.candidates).length;

    // Build candidates from the drafts
    const builtCandidates: JobCandidate[] = [];
    newJobCandidates.forEach((draft, idx) => {
      if (!draft.name.trim()) return;

      const candId = `PAL${String(totalExistingCandidates + idx + 38).padStart(6, "0")}`;
      builtCandidates.push({
        id: candId,
        name: draft.name.trim(),
        nameBng: draft.nameBng?.trim() || undefined,
        department: newJobDept,
        designation: newJobDesig || newJobTitle,
        previousSalary: Number(draft.previousSalary) || 0,
        agreedSalary: Number(draft.agreedSalary) || Number(draft.previousSalary) || 0,
        experience: draft.experience || "3.5 Years",
        noticePeriod: draft.noticePeriod || "Immediate",
        phone: draft.phone || "+880 1700-000000",
        email:
          draft.email ||
          `${draft.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        pdfUrl: draft.pdfUrl || "/Tahmid%20Afsar%20Shapno-details_.pdf",
        pdfFileName: draft.pdfFileName || "Tahmid Afsar Shapno-details_.pdf",
        selected: true,
        status: "Selected",
        cv: {
          summary: `Applicant for ${newJobTitle} with background in ${newJobDept}.`,
          highlights: [
            `Candidate evaluated for ${newJobTitle} position at ${newJobDept}`,
            `Previous Salary: ৳${Number(draft.previousSalary).toLocaleString()}, Agreed: ৳${Number(draft.agreedSalary).toLocaleString()}`,
          ],
          academics: [
            {
              degree: "Graduation / Diploma",
              institute: "University / Technical Institute",
              year: "2019",
              grade: "First Class",
            },
          ],
          experiences: [
            {
              role: newJobDesig || "Executive",
              company: "Apparel & Garment Manufacturing Ltd",
              duration: "Previous 3-5 Years",
              responsibilities: [
                "Responsible for daily operations, line execution, and quality compliance.",
              ],
            },
          ],
          personalDetails: {
            dob: "1996-05-15",
            bloodGroup: "B+",
            nid: "1996" + Math.floor(10000000000 + Math.random() * 90000000000),
            address: "Dhaka, Bangladesh",
            maritalStatus: "Single",
          },
          skills: [newJobDept, newJobDesig || "Operations", "ERP"],
          references: [
            {
              name: "Manager",
              designation: "Department Head",
              company: "Previous Enterprise",
              phone: "+880 1700-112233",
            },
          ],
        },
      });
    });

    const newJob: JobPost = {
      id: `JOB-2026-${String(jobs.length + 1).padStart(3, "0")}`,
      title: newJobTitle,
      department: newJobDept,
      designation: newJobDesig,
      vacancies: Number(newJobVacancies) || 1,
      assignedPerson: newJobAssigned,
      assignedRole: "Hiring Manager",
      targetDate: newJobTargetDate,
      salaryBudgetMin: Number(newJobBudgetMin),
      salaryBudgetMax: Number(newJobBudgetMax),
      status: "Open",
      createdAt: new Date().toISOString().split("T")[0],
      candidates: builtCandidates,
    };

    const updated = [newJob, ...jobs];
    persistJobs(updated);
    setExpandedJobIds((prev) => ({ ...prev, [newJob.id]: true }));
    setShowAddJobModal(false);
    setNewJobTitle("");
    setNewJobDesig("");
    setNewJobCandidates([createDefaultCandidateDraft()]);
    toast.success(
      `Job ${newJob.id} created with ${builtCandidates.length} candidate(s) and PDF CV attached!`
    );
  };

  // Canonical job status category: Pending | Submitted | Approved
  const getJobStatusCategory = (j: JobPost): "Pending" | "Submitted" | "Approved" => {
    const totalCand = j.candidates.length;
    const approvedCount = j.candidates.filter((c) => c.status === "Approved").length;
    const isApproved =
      j.status === "Approved" || (totalCand > 0 && approvedCount === totalCand);
    if (isApproved) return "Approved";
    if (j.status === "Submitted") return "Submitted";
    return "Pending";
  };

  // Filtered Jobs by canonical status: Pending | Submitted | Approved
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        j.title.toLowerCase().includes(q) ||
        j.id.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.designation.toLowerCase().includes(q) ||
        j.candidates.some((c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));

      const matchesStatus = getJobStatusCategory(j) === statusFilter;
      const matchesDept = deptFilter === "All" || j.department === deptFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [jobs, searchQuery, statusFilter, deptFilter]);

  // Global aggregate stats
  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const pendingJobs = jobs.filter((j) => getJobStatusCategory(j) === "Pending").length;
    const submittedJobs = jobs.filter((j) => getJobStatusCategory(j) === "Submitted").length;
    const approvedJobs = jobs.filter((j) => getJobStatusCategory(j) === "Approved").length;
    const allCandidates = jobs.flatMap((j) => j.candidates);
    const totalCandidates = allCandidates.length;
    const selectedCandidates = allCandidates.filter((c) => c.selected).length;
    const linksGenerated = allCandidates.filter((c) => c.generatedLink).length;

    return {
      totalJobs,
      pendingJobs,
      submittedJobs,
      approvedJobs,
      totalCandidates,
      selectedCandidates,
      linksGenerated,
    };
  }, [jobs]);

  // Unique departments for filter dropdown
  const departments = useMemo(() => {
    const depts = new Set<string>();
    jobs.forEach((j) => depts.add(j.department));
    return Array.from(depts);
  }, [jobs]);

  return (
    <div
      className="min-h-screen flex bg-background text-foreground transition-colors duration-300 font-sans"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-5">
          {/* Header & Breadcrumb */}
          <div className="bg-card rounded-xl border border-border/70 p-4 sm:p-5 shadow-2xs flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-normal text-muted-foreground/70 uppercase tracking-normal mb-1">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3" />
                <span>e-Recruitment</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-normal">Candidate Selection</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <UserCheck className="size-5" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-medium text-foreground tracking-tight">
                    Candidate Selection & Link Generator
                  </h1>
                  <p className="text-xs text-muted-foreground font-normal mt-0.5">
                    Review candidate PDF CV, finalize agreed salary, and generate recruitment link.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/recruitment-basic-list"
                className="h-8.5 px-3 bg-muted hover:bg-muted/80 text-foreground border border-border/60 font-normal text-xs rounded-lg shadow-2xs transition flex items-center gap-1.5"
              >
                <Users className="size-3.5 text-primary" />
                <span>Application Queue ({stats.linksGenerated})</span>
              </Link>
              <button
                onClick={() => {
                  setAddJobModalStep(1);
                  setShowAddJobModal(true);
                }}
                className="h-8.5 px-3.5 bg-primary hover:opacity-95 text-primary-foreground font-normal text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Create Position</span>
              </button>
            </div>
          </div>

          {/* Unified Executive Metrics Strip */}
          <div className="bg-card rounded-xl border border-border/70 p-4 shadow-2xs grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
            {/* Metric 1 */}
            <div className="flex items-center gap-3 pt-2 lg:pt-0 lg:px-3 first:pt-0 first:px-0">
              <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Clock className="size-4.5" />
              </div>
              <div>
                <div className="text-[11px] font-normal text-muted-foreground">Pending Selection</div>
                <div className="text-lg font-medium text-foreground">
                  {stats.pendingJobs} <span className="text-xs font-normal text-muted-foreground">/ {stats.totalJobs} total</span>
                </div>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex items-center gap-3 pt-2 lg:pt-0 lg:px-4">
              <div className="size-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Send className="size-4.5" />
              </div>
              <div>
                <div className="text-[11px] font-normal text-muted-foreground">Submitted for Approval</div>
                <div className="text-lg font-medium text-amber-600 dark:text-amber-400">
                  {stats.submittedJobs} <span className="text-xs font-normal text-muted-foreground">in review</span>
                </div>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="flex items-center gap-3 pt-2 lg:pt-0 lg:px-4">
              <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <UserCheck className="size-4.5" />
              </div>
              <div>
                <div className="text-[11px] font-normal text-muted-foreground">Approved Finalized</div>
                <div className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
                  {stats.approvedJobs} <span className="text-xs font-normal text-muted-foreground">finalized</span>
                </div>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="flex items-center gap-3 pt-2 lg:pt-0 lg:px-4">
              <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Link2 className="size-4.5" />
              </div>
              <div>
                <div className="text-[11px] font-normal text-muted-foreground">Links Generated</div>
                <div className="text-lg font-medium text-foreground">
                  {stats.linksGenerated} <span className="text-xs font-normal text-muted-foreground">dispatched</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters & Search Control Bar */}
          <div className="bg-card rounded-xl border border-border/70 p-3 sm:p-3.5 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Segmented Tabs: Pending, Submitted, Approved */}
              <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/40 text-xs font-normal">
                <button
                  type="button"
                  onClick={() => setStatusFilter("Pending")}
                  className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === "Pending"
                      ? "bg-card text-primary shadow-2xs border border-border/60 font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Clock className="size-3" />
                  <span>Pending ({stats.pendingJobs})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("Submitted")}
                  className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === "Submitted"
                      ? "bg-card text-amber-600 dark:text-amber-400 shadow-2xs border border-border/60 font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Send className="size-3" />
                  <span>Submitted ({stats.submittedJobs})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("Approved")}
                  className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === "Approved"
                      ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-2xs border border-border/60 font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CheckCircle2 className="size-3" />
                  <span>Approved ({stats.approvedJobs})</span>
                </button>
              </div>

              {/* Department Dropdown */}
              <div className="flex items-center gap-1.5">
                <Filter className="size-3.5 text-muted-foreground/70" />
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="h-8 px-2.5 rounded-lg bg-muted/60 border border-border/40 text-xs font-normal text-foreground outline-none focus:border-primary/50"
                >
                  <option value="All">All Departments</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="size-3.5 text-muted-foreground/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search job title, code, candidate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8.5 pr-8 rounded-lg bg-muted/40 border border-border/60 text-xs font-normal text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <XCircle className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List View of the Jobs */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="bg-card rounded-xl border border-dashed border-border p-12 text-center space-y-3">
                <div className="size-12 mx-auto rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <Briefcase className="size-6" />
                </div>
                <h3 className="text-sm font-medium text-foreground">No jobs match your filter criteria</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto font-normal">
                  Try adjusting the department filter or search query, or post a new job requisition to begin candidate selection.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("Pending");
                    setDeptFilter("All");
                  }}
                  className="px-3.5 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-medium transition cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isExpanded = !!expandedJobIds[job.id];
                const selectedCount = job.candidates.filter((c) => c.selected).length;
                const totalCandCount = job.candidates.length;
                const approvedCandCount = job.candidates.filter((c) => c.status === "Approved").length;
                const isJobApproved =
                  job.status === "Approved" ||
                  (totalCandCount > 0 && approvedCandCount === totalCandCount);
                const isJobSubmitted = job.status === "Submitted";
                const isFulfilled = selectedCount >= job.vacancies;
                const isClosed = job.status === "Closed";

                return (
                  <div
                    key={job.id}
                    className={`bg-card rounded-xl border transition-all duration-200 shadow-2xs overflow-hidden ${
                      isClosed
                        ? "border-slate-300/70 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10"
                        : isJobApproved
                        ? "border-emerald-500/40 hover:border-emerald-500/60"
                        : isJobSubmitted
                        ? "border-amber-500/40 hover:border-amber-500/60"
                        : isFulfilled
                        ? "border-primary/40 hover:border-primary/60"
                        : "border-border/70 hover:border-border"
                    }`}
                  >
                    {/* Job Card Header */}
                    <div className="p-4 sm:px-5 sm:py-3.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 border-b border-border/40 bg-card">
                      <div className="space-y-1.5 min-w-0">
                        {/* Row 1: Title + Job ID + Status */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                            {job.title}
                          </h2>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/70 text-muted-foreground border border-border/50">
                            {job.id}
                          </span>

                          {/* Status Badge */}
                          {isJobApproved ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <span className="size-1.5 rounded-full bg-emerald-500" />
                              Approved ({approvedCandCount}/{totalCandCount})
                            </span>
                          ) : isJobSubmitted ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Submitted ({approvedCandCount}/{totalCandCount})
                            </span>
                          ) : isClosed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                              <Lock className="size-2.5 text-slate-500" />
                              Closed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              <span className="size-1.5 rounded-full bg-blue-500" />
                              Pending Selection
                            </span>
                          )}
                        </div>

                        {/* Row 2: Clean Metadata Line */}
                        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-muted-foreground font-normal">
                          <span className="flex items-center gap-1 text-foreground/85 font-medium">
                            <Building2 className="size-3.5 text-muted-foreground/70" />
                            {job.department}
                          </span>
                          <span className="text-border/80">•</span>
                          <span className="flex items-center gap-1">
                            <Users className="size-3.5 text-muted-foreground/70" />
                            {job.vacancies} {job.vacancies === 1 ? "Vacancy" : "Vacancies"}
                          </span>
                          <span className="text-border/80">•</span>
                          <span className="flex items-center gap-1">
                            <User className="size-3.5 text-muted-foreground/70" />
                            Evaluator: <span className="text-foreground">{job.assignedPerson}</span>
                          </span>
                          <span className="text-border/80">•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3.5 text-muted-foreground/70" />
                            Target: {job.targetDate}
                          </span>
                          <span className="text-border/80">•</span>
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <DollarSign className="size-3.5" />
                            ৳{job.salaryBudgetMin.toLocaleString()} – ৳{job.salaryBudgetMax.toLocaleString()}
                          </span>
                          {isClosed && job.closedAt && (
                            <>
                              <span className="text-border/80">•</span>
                              <span className="text-slate-500 text-[11px]">
                                Closed: {job.closedAt}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Header Actions & Selection Counter */}
                      <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/30 shrink-0">
                        {/* Status / Selection Progress Pill */}
                        <div className="flex items-center gap-2.5 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/60">
                          <div className="text-right">
                            <div className="text-[10px] text-muted-foreground">
                              {isJobApproved || isJobSubmitted ? "Status" : "Selected"}
                            </div>
                            <div className="text-xs font-semibold font-mono text-foreground">
                              {isJobApproved || isJobSubmitted ? (
                                <span className={isJobApproved ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
                                  {approvedCandCount}/{totalCandCount} Approved
                                </span>
                              ) : (
                                <span className={selectedCount >= job.vacancies ? "text-emerald-600" : "text-primary"}>
                                  {selectedCount}/{job.vacancies} Selected
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="w-10 h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isJobApproved
                                  ? "bg-emerald-500"
                                  : isJobSubmitted
                                  ? "bg-amber-500"
                                  : selectedCount >= job.vacancies
                                  ? "bg-emerald-500"
                                  : "bg-primary"
                              }`}
                              style={{
                                width: `${
                                  isJobApproved || isJobSubmitted
                                    ? totalCandCount > 0
                                      ? (approvedCandCount / totalCandCount) * 100
                                      : 0
                                    : Math.min(100, (selectedCount / (job.vacancies || 1)) * 100)
                                }%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Add Candidate Button */}
                        {!isClosed && (
                          <button
                            type="button"
                            onClick={() => {
                              setAddingCandidateToJob(job);
                              setSingleCandidateDraft(createDefaultCandidateDraft());
                            }}
                            className="h-8.5 px-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 font-medium text-xs rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                            title="Add a candidate directly to this job"
                          >
                            <Plus className="size-3.5" />
                            <span>Add Candidate</span>
                          </button>
                        )}

                        {/* Expand / Collapse Button */}
                        <button
                          onClick={() => toggleJobAccordion(job.id)}
                          className="h-8.5 px-3 bg-card hover:bg-muted text-foreground border border-border/70 font-medium text-xs rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Users className="size-3.5 text-muted-foreground" />
                          <span>{job.candidates.length} Candidates</span>
                          {isExpanded ? (
                            <ChevronUp className="size-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="size-3.5 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Candidates Table for This Job */}
                    {isExpanded && (
                      <div className="p-3.5 sm:p-4 space-y-3">
                        {/* Notice Banner if Job is Closed */}
                        {isClosed && (
                          <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 sm:p-3 flex items-start sm:items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-normal">
                              <Lock className="size-3.5 text-slate-500 shrink-0" />
                              <span>
                                Job position closed. {job.closeReason || "Candidate selection completed."}
                              </span>
                            </div>
                            <span className="text-[11px] text-muted-foreground shrink-0 font-normal">
                              Application links remain active.
                            </span>
                          </div>
                        )}

                        {job.candidates.length === 0 ? (
                          <div className="py-8 text-center text-xs text-muted-foreground font-normal">
                            No candidates currently queued for this job posting. Click "+ Add Candidate" above to attach applicant profiles.
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-lg border border-border/60">
                            <table className="w-full border-collapse text-left text-xs">
                              <thead>
                                <tr className="text-[11px] font-semibold text-muted-foreground bg-muted/40 border-b border-border/60">
                                  <th className="px-4 py-2.5">Candidate</th>
                                  <th className="px-4 py-2.5">Experience</th>
                                  <th className="px-4 py-2.5 text-right">Prev. Salary</th>
                                  <th className="px-4 py-2.5 text-right whitespace-nowrap">Final Agreed Salary</th>
                                  <th className="px-4 py-2.5 text-center">Status</th>
                                  <th className="px-4 py-2.5 text-right">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/30 bg-card">
                                {job.candidates.map((cand) => (
                                  <tr
                                    key={cand.id}
                                    className={`transition-colors duration-150 ${
                                      cand.selected
                                        ? "bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06] hover:bg-emerald-500/[0.08]"
                                        : "hover:bg-muted/30"
                                    }`}
                                  >
                                    {/* Candidate Info */}
                                    <td className="px-4 py-3">
                                      <div className="font-semibold text-foreground text-xs">{cand.name}</div>
                                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5 font-mono">
                                        <span>{cand.id}</span>
                                        <span>·</span>
                                        <span>{cand.phone}</span>
                                      </div>
                                    </td>

                                    {/* Experience & Notice */}
                                    <td className="px-4 py-3">
                                      <div className="text-xs font-medium text-foreground">{cand.experience}</div>
                                      <div className="text-[11px] text-muted-foreground mt-0.5">{cand.noticePeriod} notice</div>
                                    </td>

                                    {/* Previous Salary */}
                                    <td className="px-4 py-3 text-right">
                                      <span className="text-xs text-muted-foreground font-mono">
                                        ৳{cand.previousSalary.toLocaleString()}
                                      </span>
                                    </td>

                                    {/* Final Salary */}
                                    <td className="px-4 py-3 text-right">
                                      <span
                                        className={`text-xs font-mono font-bold ${
                                          cand.selected ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                                        }`}
                                      >
                                        {cand.agreedSalary ? `৳${cand.agreedSalary.toLocaleString()}` : "—"}
                                      </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3 text-center">
                                      {job.status === "Approved" || cand.status === "Approved" ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                                          <Check className="size-3 stroke-[2.5]" /> Approved
                                        </span>
                                      ) : cand.selected ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/25">
                                          <UserCheck className="size-3 stroke-[2]" /> Selected / Nominated
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] text-muted-foreground bg-muted/60 border border-border/40">
                                          Shortlisted
                                        </span>
                                      )}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3 text-right">
                                      <div className="flex items-center justify-end gap-1.5">
                                        {/* After approval, candidate cannot be edited */}
                                        {job.status === "Approved" || cand.status === "Approved" ? (
                                          <span
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border/50 cursor-not-allowed"
                                            title="Approved candidate cannot be edited"
                                          >
                                            <Lock className="size-3 text-muted-foreground" />
                                            <span>Locked (Approved)</span>
                                          </span>
                                        ) : (
                                          <button
                                            type="button"
                                            disabled={isClosed}
                                            onClick={() => handleOpenEditCandidate(job, cand)}
                                            className={`h-7.5 px-2.5 rounded-lg bg-card hover:bg-muted text-foreground border border-border/70 text-xs font-normal flex items-center gap-1.5 transition shadow-2xs ${
                                              isClosed ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                                            }`}
                                            title="Edit candidate particulars & proposed salary"
                                          >
                                            <Edit3 className="size-3 text-primary" />
                                            <span>Edit</span>
                                          </button>
                                        )}

                                        {/* View CV */}
                                        <button
                                          type="button"
                                          onClick={() => openReviewModal(cand, job.title, job.id)}
                                          className="h-7.5 px-2.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground border border-border/70 text-xs flex items-center gap-1 transition cursor-pointer"
                                          title="View Candidate CV"
                                        >
                                          <FileText className="size-3 text-red-500" />
                                          <span>CV</span>
                                        </button>

                                        {cand.generatedLink && (
                                          <button
                                            type="button"
                                            onClick={() => handleCopyLink(cand.generatedLink, cand.name)}
                                            className="h-7.5 px-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 font-medium text-xs flex items-center gap-1 transition cursor-pointer"
                                            title="Copy e-Recruitment Link"
                                          >
                                            <Copy className="size-3" />
                                            <span>Link</span>
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ─── BOTTOM SUBMIT BAR FOR EVERY JOB ───────────────────── */}
                    <div className="p-3 sm:p-3.5 bg-muted/20 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="text-xs text-muted-foreground font-normal flex items-center gap-2">
                        <CheckCircle2
                          className={`size-3.5 ${
                            job.status === "Approved"
                              ? "text-emerald-600"
                              : job.status === "Submitted"
                              ? "text-amber-500"
                              : isClosed
                              ? "text-slate-400"
                              : "text-primary"
                          }`}
                        />
                        <span>
                          {job.status === "Approved" ? (
                            <>
                              Requisition is <span className="font-semibold text-emerald-600">Approved</span>.{" "}
                              <span className="font-mono font-semibold text-foreground">{approvedCandCount}/{totalCandCount}</span> candidate(s) approved and appointment links dispatched.
                            </>
                          ) : job.status === "Submitted" ? (
                            <>
                              Requisition is <span className="font-semibold text-amber-600 dark:text-amber-400">Submitted for Approval</span> (Status:{" "}
                              <span className="font-mono font-semibold text-foreground">{approvedCandCount}/{totalCandCount}</span> approved · Level {job.currentApprovalLevel || 1} Review).
                            </>
                          ) : isClosed ? (
                            <>
                              Requisition is <span className="font-normal text-slate-700 dark:text-slate-300">Closed</span>.
                              {job.closedAt && ` Closed on ${job.closedAt}.`}
                            </>
                          ) : (
                            <>
                              Candidate Selection: <span className="font-mono font-semibold text-foreground">{selectedCount}/{job.vacancies}</span> required vacancies selected.
                              {selectedCount === 0 && (
                                <span className="text-amber-600 dark:text-amber-400 font-normal ml-1.5">
                                  (Select candidate to enable submit)
                                </span>
                              )}
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {job.status === "Submitted" ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleWithdrawSubmission(job.id)}
                              className="h-8 px-3 bg-muted hover:bg-muted/80 text-foreground border border-border/60 text-xs font-normal rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                              title="Withdraw submission to edit candidate data"
                            >
                              <RotateCcw className="size-3 text-amber-600" />
                              <span>Recall to Draft</span>
                            </button>
                            <Link
                              to="/recruitment-candidate-selection-approval"
                              className="h-8 px-3.5 bg-primary hover:opacity-90 text-primary-foreground text-xs font-medium rounded-lg transition flex items-center gap-1.5 shadow-2xs"
                            >
                              <span>Open in Approval Console</span>
                              <ArrowRight className="size-3" />
                            </Link>
                          </div>
                        ) : job.status === "Approved" ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                              <CheckCircle2 className="size-3.5" />
                              <span>Approved & Finalized</span>
                            </span>
                          </div>
                        ) : isClosed ? (
                          <button
                            type="button"
                            onClick={() => handleReopenJob(job.id)}
                            className="h-8 px-3 bg-muted hover:bg-muted/80 text-foreground border border-border/60 text-xs font-normal rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                            title="Reopen this job to modify candidate selection"
                          >
                            <Unlock className="size-3 text-emerald-600" />
                            <span>Reopen Job</span>
                          </button>
                        ) : job.candidates.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => handleSubmitJob(job.id)}
                            className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-normal rounded-lg transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            title="Submit candidate selection for management approval"
                          >
                            <Send className="size-3.5" />
                            <span>Submit for Approval</span>
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ─── UNIFIED MODAL: REVIEW PDF CV, FIX SALARY & APPROVE ───────────── */}
        {activeCvCandidate && (() => {
          const liveCand =
            jobs.flatMap((j) => j.candidates).find((c) => c.id === activeCvCandidate.candidate.id) ||
            activeCvCandidate.candidate;
          const liveJob = jobs.find((j) => j.id === activeCvCandidate.jobCode);
          const pdfUrl = liveCand.pdfUrl || "/Tahmid%20Afsar%20Shapno-details_.pdf";

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 md:p-6 overflow-hidden">
              <div className="bg-card w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Modal Top Bar */}
                <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{liveCand.name}</h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/60">
                          {liveCand.id}
                        </span>
                        {liveCand.selected ? (
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Approved
                          </span>
                        ) : (
                          <span className="px-2 py-0.2 rounded-full text-[10px] text-muted-foreground bg-muted border border-border/40">
                            Pending Review
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activeCvCandidate.jobTitle} · {liveCand.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 px-2.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs flex items-center gap-1.5 transition"
                      title="Open PDF in new tab"
                    >
                      <ExternalLink className="size-3.5" />
                      <span className="hidden sm:inline">Open in Tab</span>
                    </a>
                    <a
                      href={pdfUrl}
                      download={`${liveCand.name}-CV.pdf`}
                      className="h-8 px-2.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs flex items-center gap-1.5 transition"
                      title="Download PDF"
                    >
                      <Download className="size-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setActiveCvCandidate(null)}
                      className="size-8 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition cursor-pointer"
                      title="Close modal"
                    >
                      <XCircle className="size-4.5" />
                    </button>
                  </div>
                </div>

                {/* Main Split Body: PDF Viewer on Left, Salary & Approval on Right */}
                <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
                  {/* Left: Full PDF CV Viewer */}
                  <div className="flex-1 min-w-0 h-full bg-slate-900/5 dark:bg-slate-950 flex flex-col relative">
                    <iframe
                      src={`${pdfUrl}#view=FitH&toolbar=1`}
                      className="w-full h-full border-0"
                      title={`CV of ${liveCand.name}`}
                    />
                  </div>

                  {/* Right: Focused Approval & Salary Panel */}
                  <div className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-border bg-card p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Candidate Quick Info */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-muted-foreground">Phone</span>
                          <span className="font-mono text-foreground">{liveCand.phone}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-muted-foreground">Experience</span>
                          <span className="text-foreground">{liveCand.experience}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-muted-foreground">Notice Period</span>
                          <span className="text-foreground">{liveCand.noticePeriod}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-muted-foreground">Previous Salary</span>
                          <span className="font-semibold text-foreground">
                            ৳{liveCand.previousSalary.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-muted-foreground font-medium">Final Agreed Salary</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                            {liveCand.agreedSalary ? `৳${liveCand.agreedSalary.toLocaleString()}` : (reviewSalaryInput ? `৳${Number(reviewSalaryInput).toLocaleString()}` : "—")}
                          </span>
                        </div>
                      </div>

                      {/* Final Salary Input */}
                      <div className="space-y-1.5 pt-1">
                        <label className="text-xs font-semibold text-foreground">
                          Final Agreed Salary (৳)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
                            ৳
                          </span>
                          <input
                            type="number"
                            min={1}
                            value={reviewSalaryInput}
                            onChange={(e) =>
                              setReviewSalaryInput(e.target.value === "" ? "" : Number(e.target.value))
                            }
                            placeholder="e.g. 52000"
                            className="w-full h-10 pl-8 pr-3 rounded-lg border border-border bg-background text-sm font-bold text-foreground outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
                          />
                        </div>
                      </div>

                      {/* Candidate Selection & Proposed Salary Action */}
                      {!liveCand.selected ? (
                        <div className="pt-2 space-y-2">
                          <button
                            type="button"
                            disabled={!reviewSalaryInput || Number(reviewSalaryInput) <= 0 || liveJob?.status === "Closed"}
                            onClick={handleApproveFromReview}
                            className="w-full h-10.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition"
                          >
                            <UserCheck className="size-4" />
                            <span>Select Candidate & Save Proposed Salary</span>
                          </button>
                          <p className="text-[10px] text-muted-foreground text-center">
                            Candidate will be nominated for approval in Candidate Selection Approval console.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 pt-2">
                          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-2.5 text-primary">
                            <UserCheck className="size-4 shrink-0" />
                            <div>
                              <div className="font-semibold text-xs">
                                {liveCand.status === "Approved" ? "Candidate Approved" : "Candidate Selected (Pending Approval)"}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                Proposed Salary: ৳{liveCand.agreedSalary.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          {liveCand.generatedLink && (
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-foreground">Recruitment Link</label>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  readOnly
                                  value={liveCand.generatedLink || ""}
                                  className="flex-1 h-8.5 px-2.5 text-[11px] bg-muted/60 border border-border/70 rounded-lg text-foreground font-mono select-all outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleCopyLink(liveCand.generatedLink, liveCand.name)}
                                  className="h-8.5 px-3 bg-primary hover:opacity-90 text-primary-foreground text-xs font-medium rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
                                >
                                  <Copy className="size-3.5" />
                                  <span>Copy</span>
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                            <button
                              type="button"
                              onClick={handleApproveFromReview}
                              className="text-primary hover:underline font-medium cursor-pointer"
                            >
                              Update Proposed Salary
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (liveJob) handleDeselectCandidate(liveJob.id, liveCand.id);
                              }}
                              className="text-muted-foreground hover:text-red-600 transition cursor-pointer"
                            >
                              Remove Selection
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border/40">
                      <button
                        type="button"
                        onClick={() => setActiveCvCandidate(null)}
                        className="w-full h-8.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ─── MODAL 2: CLOSE JOB CONFIRMATION MODAL ───────────────────────── */}
        {closingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-border/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 sm:p-5 border-b border-border/60 bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                    <Lock className="size-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Close Job Requisition</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 font-normal">{closingJob.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setClosingJob(null)}
                  className="size-8 rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center cursor-pointer"
                >
                  <XCircle className="size-4.5" />
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div className="bg-muted/40 p-3.5 rounded-lg border border-border/50 space-y-2 text-xs font-normal">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Job ID:</span>
                    <span className="text-foreground">{closingJob.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vacancies:</span>
                    <span className="text-foreground font-medium">{closingJob.vacancies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Candidates Selected:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {closingJob.candidates.filter((c) => c.selected).length} Selected
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-normal text-muted-foreground">Closure Reason / Official Note</label>
                  <textarea
                    rows={3}
                    value={closeReasonInput}
                    onChange={(e) => setCloseReasonInput(e.target.value)}
                    placeholder="e.g. Selection completed, required number of positions filled."
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  />
                  <p className="text-[11px] text-muted-foreground font-normal">
                    Closing locks this job to mark recruitment as completed. You can reopen it at any time if required.
                  </p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 border-t border-border/60 bg-muted/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setClosingJob(null)}
                  className="h-8 px-3.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-normal rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCloseJob}
                  className="h-8 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-normal rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="size-3" />
                  <span>Confirm & Close Job</span>
                </button>
              </div>
            </div>
          </div>
        )}


        {/* ─── MODAL 2.6: SUBMIT CANDIDATE SELECTION FOR APPROVAL ───────── */}
        {approvingJob && (() => {
          const selectedCands = approvingJob.job.candidates.filter((c) => c.selected);
          const totalPayroll = selectedCands.reduce((sum, c) => {
            return sum + (approvingJob.candidateSalaries[c.id] || 0);
          }, 0);
          const minBudgetTotal = approvingJob.job.salaryBudgetMin * selectedCands.length;
          const maxBudgetTotal = approvingJob.job.salaryBudgetMax * selectedCands.length;
          const hasInvalidSalary = selectedCands.some(
            (c) => !approvingJob.candidateSalaries[c.id] || approvingJob.candidateSalaries[c.id] <= 0
          );

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
              <div className="bg-card w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl border border-border/80 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-border/60 bg-muted/20 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl border border-primary/20">
                      <Send className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <span>Submit Candidate Selection for Approval</span>
                        <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {selectedCands.length} Selected
                        </span>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 font-normal">
                        Job: <span className="font-medium text-foreground">{approvingJob.job.title}</span> ({approvingJob.job.id})
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setApprovingJob(null)}
                    className="size-8 rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center cursor-pointer transition"
                  >
                    <XCircle className="size-4.5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
                  <div className="text-xs text-muted-foreground font-normal">
                    Please review or input the proposed monthly salary for each selected candidate before submitting to the multi-level management approval console:
                  </div>

                  {/* Candidate Salary Input Table */}
                  <div className="border border-border/70 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/40 text-[11px] font-medium text-muted-foreground uppercase border-b border-border/60">
                        <tr>
                          <th className="px-3.5 py-2.5 text-left">Candidate</th>
                          <th className="px-3.5 py-2.5 text-right">Previous Salary</th>
                          <th className="px-3.5 py-2.5 text-right">Proposed Salary (BDT ৳) *</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 bg-card">
                        {selectedCands.map((cand) => {
                          const currentVal = approvingJob.candidateSalaries[cand.id] ?? 0;
                          const isZero = !currentVal || currentVal <= 0;
                          return (
                            <tr key={cand.id} className="hover:bg-muted/20">
                              <td className="px-3.5 py-3">
                                <div className="font-medium text-foreground">{cand.name}</div>
                                <div className="text-[11px] text-muted-foreground mt-0.5">
                                  {cand.id} · {cand.department}
                                </div>
                              </td>
                              <td className="px-3.5 py-3 text-right text-muted-foreground">
                                ৳{cand.previousSalary.toLocaleString()}
                              </td>
                              <td className="px-3.5 py-3 text-right">
                                <div className="inline-flex items-center gap-1.5 justify-end">
                                  <span className="text-xs text-muted-foreground font-medium">৳</span>
                                  <input
                                    type="number"
                                    min={1}
                                    value={currentVal || ""}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setApprovingJob((prev) =>
                                        prev
                                          ? {
                                              ...prev,
                                              candidateSalaries: {
                                                ...prev.candidateSalaries,
                                                [cand.id]: val,
                                              },
                                            }
                                          : null
                                      );
                                    }}
                                    className={`w-32 h-8.5 px-2.5 rounded-lg border text-right text-xs font-semibold outline-none transition ${
                                      isZero
                                        ? "border-red-500 bg-red-500/5 text-red-600 focus:border-red-500"
                                        : "border-primary/40 bg-primary/[0.03] text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                                    }`}
                                    placeholder="Input Salary"
                                  />
                                </div>
                                {isZero && (
                                  <div className="text-[10px] text-red-500 mt-1 font-normal">Salary required</div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Budget & Total Payroll Summary Card */}
                  <div className="p-3.5 bg-muted/30 rounded-xl border border-border/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Proposed Monthly Payroll:</span>
                      <span className="font-bold text-sm text-primary">
                        ৳{totalPayroll.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Budgeted Range for {selectedCands.length} position(s):</span>
                      <span className="font-normal text-foreground">
                        ৳{minBudgetTotal.toLocaleString()} – ৳{maxBudgetTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Notes / Reason */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Submission Remarks & Notes for Reviewers
                    </label>
                    <textarea
                      rows={2}
                      value={approvingJob.closeReason}
                      onChange={(e) =>
                        setApprovingJob({
                          ...approvingJob,
                          closeReason: e.target.value,
                        })
                      }
                      placeholder="e.g. Candidates shortlisted based on technical interviews. Proposed compensation within budget parameters."
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="p-3.5 sm:p-4 border-t border-border/60 bg-muted/10 flex items-center justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setApprovingJob(null)}
                    className="h-8.5 px-3.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-normal rounded-lg transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={hasInvalidSalary}
                    onClick={handleConfirmApproveJob}
                    className="h-8.5 px-4 bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground text-xs font-medium rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="size-3.5 stroke-[2]" />
                    <span>Submit for Approval</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ─── MODAL 3: EDIT AGREED SALARY MODAL ───────────────────────── */}
        {editingSalary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-card w-full max-w-md rounded-xl shadow-2xl border border-border/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 sm:p-5 border-b border-border/60 bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                    <DollarSign className="size-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Update Agreed Salary</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 font-normal">{editingSalary.candidateName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingSalary(null)}
                  className="size-8 rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center cursor-pointer"
                >
                  <XCircle className="size-4.5" />
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex justify-between items-center text-xs p-3 bg-muted/40 rounded-lg border border-border/40 font-normal">
                  <span className="text-muted-foreground">Previous Salary:</span>
                  <span className="text-foreground">
                    ৳{editingSalary.prevSalary.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-normal text-muted-foreground">Agreed Salary (BDT ৳)</label>
                  <input
                    type="number"
                    value={tempAgreedSalary || ""}
                    onChange={(e) => setTempAgreedSalary(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                    placeholder="Enter agreed salary"
                  />
                  <p className="text-[11px] text-muted-foreground font-normal">
                    This finalized agreed remuneration will be reflected on their official dossier and e-recruitment offer.
                  </p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 border-t border-border/60 bg-muted/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSalary(null)}
                  className="h-8 px-3.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-normal rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAgreedSalary}
                  className="h-8 px-4 bg-primary hover:opacity-95 text-primary-foreground text-xs font-normal rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="size-3.5 stroke-[2]" />
                  <span>Save Agreed Salary</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL 4: POST NEW JOB WITH CANDIDATES & PDF CV UPLOAD (2-STEP WIZARD) ───────────── */}
        {showAddJobModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
            <div className="bg-card w-full max-w-4xl max-h-[94vh] rounded-xl shadow-2xl border border-border/80 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-border/60 bg-muted/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Briefcase className="size-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                      <span>Create Position & Enroll Candidates</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 font-normal">
                      Define job requirements and attach candidate information with their PDF CV documents.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddJobModal(false);
                    setAddJobModalStep(1);
                  }}
                  className="size-8 rounded-lg border border-border/70 bg-card hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition cursor-pointer"
                >
                  <XCircle className="size-4.5" />
                </button>
              </div>

              {/* Step Navigation Indicator Tabs */}
              <div className="bg-muted/30 border-b border-border/60 px-4 sm:px-6 py-2.5 flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setAddJobModalStep(1)}
                  className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition border cursor-pointer ${
                    addJobModalStep === 1
                      ? "bg-card border-primary/40 text-primary shadow-2xs font-medium"
                      : "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-card/50 font-normal"
                  }`}
                >
                  <span
                    className={`size-5 rounded-full flex items-center justify-center text-[10px] ${
                      addJobModalStep === 1
                        ? "bg-primary text-primary-foreground font-normal"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    1
                  </span>
                  <div className="text-left min-w-0">
                    <div className="text-xs truncate">Step 1: Job Specifications</div>
                    <div className="text-[10px] text-muted-foreground truncate hidden sm:block">
                      Position, department, vacancies & budget
                    </div>
                  </div>
                </button>

                <ChevronRight className="size-4 text-muted-foreground/40 shrink-0" />

                <button
                  type="button"
                  onClick={() => {
                    if (addJobModalStep === 1) {
                      handleProceedToStep2();
                    }
                  }}
                  className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition border cursor-pointer ${
                    addJobModalStep === 2
                      ? "bg-card border-primary/40 text-primary shadow-2xs font-medium"
                      : "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-card/50 font-normal"
                  }`}
                >
                  <span
                    className={`size-5 rounded-full flex items-center justify-center text-[10px] ${
                      addJobModalStep === 2
                        ? "bg-primary text-primary-foreground font-normal"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    2
                  </span>
                  <div className="text-left min-w-0">
                    <div className="text-xs truncate flex items-center gap-1.5">
                      <span>Step 2: Candidate Profiles & CV</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-primary/10 text-primary text-[10px] font-normal">
                        {newJobCandidates.length}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate hidden sm:block">
                      Salaries, contacts & PDF CV documents
                    </div>
                  </div>
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleCreateJob} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs custom-scrollbar">
                  {/* ───────────────── STEP 1: JOB SPECIFICATIONS ───────────────── */}
                  {addJobModalStep === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div className="bg-card rounded-xl border border-border/70 p-4 sm:p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-border/40">
                          <div className="flex items-center gap-2">
                            <Briefcase className="size-4 text-primary" />
                            <h4 className="text-xs font-medium text-foreground">
                              Job Position & Requisition Requirements
                            </h4>
                          </div>
                          <span className="text-[11px] text-muted-foreground font-normal">
                            All * fields are required
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-1.5 sm:col-span-2">
                            <label className="font-normal text-muted-foreground flex items-center gap-1">
                              <span>Job Title</span>
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={newJobTitle}
                              onChange={(e) => setNewJobTitle(e.target.value)}
                              placeholder="e.g. Senior Merchandiser (Woven) or Quality Controller"
                              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="font-normal text-muted-foreground flex items-center gap-1">
                              <span>Department</span>
                              <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={newJobDept}
                              onChange={(e) => setNewJobDept(e.target.value)}
                              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                            >
                              <option value="Merchandising">Merchandising</option>
                              <option value="Quality Control">Quality Control</option>
                              <option value="RMG Operation">RMG Operation</option>
                              <option value="Industrial Engineering">Industrial Engineering</option>
                              <option value="Production">Production</option>
                              <option value="Human Resources">Human Resources</option>
                              <option value="Maintenance">Maintenance</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="font-normal text-muted-foreground flex items-center gap-1">
                              <span>Designation</span>
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={newJobDesig}
                              onChange={(e) => setNewJobDesig(e.target.value)}
                              placeholder="e.g. Senior Merchandiser"
                              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="font-normal text-muted-foreground">Vacancies Required</label>
                            <input
                              type="number"
                              min={1}
                              value={newJobVacancies}
                              onChange={(e) => setNewJobVacancies(Number(e.target.value))}
                              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="font-normal text-muted-foreground">Target Closing Date</label>
                            <input
                              type="date"
                              value={newJobTargetDate}
                              onChange={(e) => setNewJobTargetDate(e.target.value)}
                              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="font-normal text-muted-foreground">Min Salary Budget (৳)</label>
                            <input
                              type="number"
                              value={newJobBudgetMin}
                              onChange={(e) => setNewJobBudgetMin(Number(e.target.value))}
                              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="font-normal text-muted-foreground">Max Salary Budget (৳)</label>
                            <input
                              type="number"
                              value={newJobBudgetMax}
                              onChange={(e) => setNewJobBudgetMax(Number(e.target.value))}
                              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                            />
                          </div>

                          <div className="space-y-1.5 sm:col-span-2">
                            <label className="font-normal text-muted-foreground">Assigned Evaluator / Selector</label>
                            <input
                              type="text"
                              value={newJobAssigned}
                              onChange={(e) => setNewJobAssigned(e.target.value)}
                              placeholder="e.g. Tanvir Ahmed (HR Manager)"
                              className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                            />
                          </div>
                        </div>

                        {/* Salary Budget Indicator Pill */}
                        <div className="p-3 rounded-lg bg-muted/30 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <span className="text-muted-foreground font-normal">
                            Approved Budget Range:
                          </span>
                          <span className="font-medium text-foreground">
                            ৳{newJobBudgetMin.toLocaleString()} — ৳{newJobBudgetMax.toLocaleString()} / month
                          </span>
                        </div>
                      </div>

                      {/* Hint for Next Step */}
                      <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground font-normal">
                          <Users className="size-4 text-primary shrink-0" />
                          <span>
                            Next step: Attach candidate basic information, agreed salary, and their PDF CV documents.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleProceedToStep2}
                          className="h-7.5 px-3 bg-primary hover:opacity-95 text-primary-foreground text-xs font-normal rounded-lg transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <span>Go to Step 2</span>
                          <ArrowRight className="size-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ───────────────── STEP 2: CANDIDATE PROFILES & CV ─────────── */}
                  {addJobModalStep === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      {/* Job Context Strip */}
                      <div className="p-3 bg-muted/30 rounded-xl border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <Briefcase className="size-4 text-primary shrink-0" />
                          <div className="truncate">
                            <span className="font-medium text-foreground">{newJobTitle || "Requisition"}</span>
                            <span className="text-muted-foreground font-normal ml-2">
                              ({newJobDept} • {newJobDesig} • {newJobVacancies} vacancy)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-muted-foreground font-normal">
                            Budget: ৳{newJobBudgetMin.toLocaleString()} - ৳{newJobBudgetMax.toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => setAddJobModalStep(1)}
                            className="text-[11px] text-primary hover:underline font-normal cursor-pointer"
                          >
                            Edit Job Details
                          </button>
                        </div>
                      </div>

                      {/* Candidate Profiles List Container */}
                      <div className="bg-card rounded-xl border border-primary/20 bg-primary/[0.01] p-4 sm:p-5 shadow-2xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/40">
                          <div className="flex items-center gap-2">
                            <Users className="size-4 text-primary" />
                            <div>
                              <h4 className="text-xs font-medium text-foreground flex items-center gap-2">
                                <span>Candidate Profiles & PDF CV Attachments</span>
                                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                  {newJobCandidates.length} {newJobCandidates.length === 1 ? "Candidate" : "Candidates"}
                                </span>
                              </h4>
                              <p className="text-[11px] text-muted-foreground mt-0.5 font-normal">
                                Review candidate salaries, phone, and attach their PDF CV document below.
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleAddCandidateRow}
                            className="h-7.5 px-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-normal text-xs rounded-lg transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                          >
                            <Plus className="size-3" />
                            <span>Add Another Candidate</span>
                          </button>
                        </div>

                        {/* Candidate Cards */}
                        <div className="space-y-3.5">
                          {newJobCandidates.map((draft, idx) => {
                            const prevSal = Number(draft.previousSalary) || 0;
                            const agrSal = Number(draft.agreedSalary) || 0;
                            const diffSal = agrSal - prevSal;
                            const diffPercent = prevSal > 0 ? Math.round((diffSal / prevSal) * 100) : 0;

                            return (
                              <div
                                key={draft.id}
                                className="bg-muted/20 rounded-lg border border-border/70 p-3.5 space-y-3 relative group"
                              >
                                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                                  <span className="font-normal text-xs text-foreground flex items-center gap-2">
                                    <span className="size-4.5 rounded-full bg-primary text-primary-foreground font-normal text-[10px] flex items-center justify-center">
                                      {idx + 1}
                                    </span>
                                    <span>
                                      Candidate #{idx + 1}:{" "}
                                      <span className="font-medium">{draft.name || "Pending Name"}</span>
                                    </span>
                                  </span>

                                  {newJobCandidates.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveCandidateRow(idx)}
                                      className="p-1 text-muted-foreground hover:text-red-500 rounded hover:bg-red-500/10 transition cursor-pointer"
                                      title="Remove candidate"
                                    >
                                      <Trash2 className="size-3.5" />
                                    </button>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                  <div className="space-y-1 sm:col-span-2 md:col-span-1">
                                    <label className="font-normal text-muted-foreground flex items-center gap-1">
                                      <span>Candidate Full Name</span>
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={draft.name}
                                      onChange={(e) => handleUpdateCandidateDraft(idx, "name", e.target.value)}
                                      placeholder="e.g. Md. Hasan Ali"
                                      className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="font-normal text-muted-foreground">Previous Salary (৳)</label>
                                    <input
                                      type="number"
                                      value={draft.previousSalary || ""}
                                      onChange={(e) => handleUpdateCandidateDraft(idx, "previousSalary", e.target.value)}
                                      placeholder="e.g. 28000"
                                      className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <label className="font-normal text-emerald-600 dark:text-emerald-400">
                                        Agreed Salary (৳)
                                      </label>
                                      {prevSal > 0 && agrSal > 0 && (
                                        <span className={`text-[10px] font-normal ${diffSal >= 0 ? "text-emerald-600" : "text-amber-600"}`}>
                                          {diffSal >= 0 ? `+৳${diffSal.toLocaleString()} (+${diffPercent}%)` : `-৳${Math.abs(diffSal).toLocaleString()}`}
                                        </span>
                                      )}
                                    </div>
                                    <input
                                      type="number"
                                      value={draft.agreedSalary || ""}
                                      onChange={(e) => handleUpdateCandidateDraft(idx, "agreedSalary", e.target.value)}
                                      placeholder="e.g. 35000"
                                      className="w-full h-8 px-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.02] text-xs font-normal text-emerald-700 dark:text-emerald-400 outline-none focus:border-emerald-500"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="font-normal text-muted-foreground">Phone Number</label>
                                    <input
                                      type="text"
                                      value={draft.phone}
                                      onChange={(e) => handleUpdateCandidateDraft(idx, "phone", e.target.value)}
                                      placeholder="e.g. +880 1711-000000"
                                      className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="font-normal text-muted-foreground">Email Address</label>
                                    <input
                                      type="email"
                                      value={draft.email}
                                      onChange={(e) => handleUpdateCandidateDraft(idx, "email", e.target.value)}
                                      placeholder="e.g. hasan@example.com"
                                      className="w-full h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="font-normal text-muted-foreground">Experience & Notice</label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                      <input
                                        type="text"
                                        value={draft.experience}
                                        onChange={(e) => handleUpdateCandidateDraft(idx, "experience", e.target.value)}
                                        placeholder="4.0 Yrs"
                                        className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                                      />
                                      <input
                                        type="text"
                                        value={draft.noticePeriod}
                                        onChange={(e) => handleUpdateCandidateDraft(idx, "noticePeriod", e.target.value)}
                                        placeholder="Immediate"
                                        className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* PDF CV Document Attachment for Candidate */}
                                <div className="pt-1.5">
                                  <label className="font-normal text-muted-foreground block mb-1">
                                    Attached Curriculum Vitae (.pdf document)
                                  </label>
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-lg border border-dashed border-border bg-card/80 hover:border-primary/40 transition">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className="p-1.5 bg-red-500/10 text-red-500 rounded-md shrink-0">
                                        <FileText className="size-3.5" />
                                      </div>
                                      <div className="min-w-0">
                                        {draft.isCustomPdf ? (
                                          <div className="flex items-center gap-1.5 font-normal text-emerald-700 dark:text-emerald-400 truncate">
                                            <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                                            <span className="truncate">{draft.pdfFileName}</span>
                                            <span className="text-[10px] text-muted-foreground">
                                              ({draft.fileSizeLabel})
                                            </span>
                                          </div>
                                        ) : (
                                          <div className="text-xs font-normal text-foreground truncate">
                                            <span>Default Template: </span>
                                            <span className="text-primary">{draft.pdfFileName}</span>
                                            <span className="text-[10px] text-muted-foreground ml-1">
                                              (809 KB verified template)
                                            </span>
                                          </div>
                                        )}
                                        <div className="text-[10px] text-muted-foreground font-normal">
                                          {draft.isCustomPdf
                                            ? "Custom PDF CV attached and ready for evaluator review."
                                            : "Tahmid Afsar Shapno PDF details loaded by default. You can upload applicant's specific CV."}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                      <a
                                        href={draft.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-7.5 px-2.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground border border-border/60 text-xs font-normal transition flex items-center gap-1"
                                        title="Preview PDF CV"
                                      >
                                        <Eye className="size-3 text-primary" />
                                        <span>Preview PDF</span>
                                      </a>

                                      <label className="h-7.5 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-normal transition flex items-center gap-1.5 cursor-pointer">
                                        <Upload className="size-3" />
                                        <span>{draft.isCustomPdf ? "Change PDF" : "Upload Custom PDF"}</span>
                                        <input
                                          type="file"
                                          accept=".pdf"
                                          className="hidden"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleCandidateFileUpload(idx, file, false);
                                          }}
                                        />
                                      </label>

                                      {draft.isCustomPdf && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            handleUpdateCandidateDraft(idx, "pdfFileName", "Tahmid Afsar Shapno-details_.pdf");
                                            handleUpdateCandidateDraft(idx, "pdfUrl", "/Tahmid%20Afsar%20Shapno-details_.pdf");
                                            handleUpdateCandidateDraft(idx, "isCustomPdf", false);
                                            handleUpdateCandidateDraft(idx, "fileSizeLabel", "809 KB (Default)");
                                            toast.info("Reset to default PDF CV template.");
                                          }}
                                          className="h-7.5 px-2.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground text-xs font-normal transition cursor-pointer"
                                          title="Reset to default PDF"
                                        >
                                          Reset Default
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Actions Footer */}
                <div className="p-3.5 sm:p-4 border-t border-border/60 bg-muted/15 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    {addJobModalStep === 2 ? (
                      <button
                        type="button"
                        onClick={() => setAddJobModalStep(1)}
                        className="h-8 px-3 bg-muted hover:bg-muted/80 text-foreground text-xs font-normal rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="size-3" />
                        <span>Back to Job Details</span>
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground font-normal">
                        Step 1 of 2: Define position & budget parameters
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddJobModal(false);
                        setAddJobModalStep(1);
                      }}
                      className="h-8 px-3.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-normal rounded-lg transition cursor-pointer"
                    >
                      Cancel
                    </button>

                    {addJobModalStep === 1 ? (
                      <button
                        type="button"
                        onClick={handleProceedToStep2}
                        className="h-8 px-4 bg-primary hover:opacity-95 text-primary-foreground text-xs font-normal rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Next: Candidate Enrollment</span>
                        <ArrowRight className="size-3.5" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="h-8 px-4 bg-primary hover:opacity-95 text-primary-foreground text-xs font-normal rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="size-3.5" />
                        <span>Create Position & Enroll Candidates</span>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL 5: ADD CANDIDATE DIRECTLY TO EXISTING JOB ────────────────── */}
        {addingCandidateToJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-card w-full max-w-xl rounded-xl shadow-2xl border border-border/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 sm:p-5 border-b border-border/60 bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <UserCheck className="size-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      Add Candidate to {addingCandidateToJob.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 font-normal">
                      {addingCandidateToJob.id} · {addingCandidateToJob.department}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAddingCandidateToJob(null)}
                  className="size-8 rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center cursor-pointer"
                >
                  <XCircle className="size-4.5" />
                </button>
              </div>

              <form onSubmit={handleAddCandidateToExistingJob}>
                <div className="p-5 sm:p-6 space-y-3.5 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-normal text-muted-foreground">Candidate Full Name *</label>
                    <input
                      type="text"
                      required
                      value={singleCandidateDraft.name}
                      onChange={(e) =>
                        setSingleCandidateDraft((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="e.g. Md. Zahid Hasan"
                      className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="font-normal text-muted-foreground">Previous Salary (BDT ৳)</label>
                      <input
                        type="number"
                        value={singleCandidateDraft.previousSalary || ""}
                        onChange={(e) =>
                          setSingleCandidateDraft((prev) => ({
                            ...prev,
                            previousSalary: Number(e.target.value),
                          }))
                        }
                        placeholder="e.g. 30000"
                        className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-normal text-emerald-600 dark:text-emerald-400">
                        Agreed Salary (BDT ৳)
                      </label>
                      <input
                        type="number"
                        value={singleCandidateDraft.agreedSalary || ""}
                        onChange={(e) =>
                          setSingleCandidateDraft((prev) => ({
                            ...prev,
                            agreedSalary: Number(e.target.value),
                          }))
                        }
                        placeholder="e.g. 38000"
                        className="w-full h-8.5 px-3 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.02] text-xs font-normal text-emerald-700 dark:text-emerald-400 outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="font-normal text-muted-foreground">Phone Number</label>
                      <input
                        type="text"
                        value={singleCandidateDraft.phone}
                        onChange={(e) =>
                          setSingleCandidateDraft((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        placeholder="e.g. +880 1711-223344"
                        className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-normal text-muted-foreground">Email Address</label>
                      <input
                        type="email"
                        value={singleCandidateDraft.email}
                        onChange={(e) =>
                          setSingleCandidateDraft((prev) => ({ ...prev, email: e.target.value }))
                        }
                        placeholder="e.g. zahid@example.com"
                        className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="font-normal text-muted-foreground">Total Experience</label>
                      <input
                        type="text"
                        value={singleCandidateDraft.experience}
                        onChange={(e) =>
                          setSingleCandidateDraft((prev) => ({ ...prev, experience: e.target.value }))
                        }
                        placeholder="e.g. 5.0 Years"
                        className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-normal text-muted-foreground">Notice Period</label>
                      <input
                        type="text"
                        value={singleCandidateDraft.noticePeriod}
                        onChange={(e) =>
                          setSingleCandidateDraft((prev) => ({ ...prev, noticePeriod: e.target.value }))
                        }
                        placeholder="e.g. Immediate or 15 Days"
                        className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>

                  {/* PDF CV Upload */}
                  <div className="space-y-1.5 pt-1">
                    <label className="font-normal text-muted-foreground">Curriculum Vitae (.pdf)</label>
                    <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-dashed border-border bg-muted/20">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="size-3.5 text-red-500 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-normal text-foreground truncate">
                            {singleCandidateDraft.pdfFileName}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-normal">
                            {singleCandidateDraft.isCustomPdf
                              ? `Custom PDF Attached (${singleCandidateDraft.fileSizeLabel})`
                              : "Default PDF Template Loaded (809 KB)"}
                          </div>
                        </div>
                      </div>

                      <label className="h-7.5 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-normal transition flex items-center gap-1.5 cursor-pointer shrink-0">
                        <Upload className="size-3" />
                        <span>Upload PDF</span>
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCandidateFileUpload(0, file, true);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 border-t border-border/60 bg-muted/15 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAddingCandidateToJob(null)}
                    className="h-8 px-3.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-normal rounded-lg transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-8 px-4 bg-primary hover:opacity-95 text-primary-foreground text-xs font-normal rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>Add Candidate to Job</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL 6: EDIT CANDIDATE INFORMATION & PROPOSED SALARY ──────────── */}
        {editingCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-card w-full max-w-xl rounded-xl shadow-2xl border border-border/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 sm:p-5 border-b border-border/60 bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Edit3 className="size-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      Edit Candidate Particulars
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 font-normal">
                      {editingCandidate.candidate.id} · {editingCandidate.job.title}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingCandidate(null)}
                  className="size-8 rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center cursor-pointer"
                >
                  <XCircle className="size-4.5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditedCandidate}>
                <div className="p-5 sm:p-6 space-y-3.5 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-normal text-muted-foreground">Candidate Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editingCandidate.name}
                      onChange={(e) =>
                        setEditingCandidate((prev) => (prev ? { ...prev, name: e.target.value } : null))
                      }
                      placeholder="e.g. Md. Tariqul Islam"
                      className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-normal text-muted-foreground">Previous Gross Salary (৳)</label>
                      <input
                        type="number"
                        min={0}
                        value={editingCandidate.previousSalary}
                        onChange={(e) =>
                          setEditingCandidate((prev) =>
                            prev ? { ...prev, previousSalary: e.target.value } : null
                          )
                        }
                        placeholder="e.g. 40000"
                        className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-normal text-muted-foreground">
                        Proposed / Agreed Salary (৳) *
                      </label>
                      <input
                        type="number"
                        required
                        min={1000}
                        value={editingCandidate.agreedSalary}
                        onChange={(e) =>
                          setEditingCandidate((prev) =>
                            prev ? { ...prev, agreedSalary: e.target.value } : null
                          )
                        }
                        placeholder="e.g. 52000"
                        className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-normal text-muted-foreground">Contact Phone</label>
                      <input
                        type="text"
                        value={editingCandidate.phone}
                        onChange={(e) =>
                          setEditingCandidate((prev) =>
                            prev ? { ...prev, phone: e.target.value } : null
                          )
                        }
                        placeholder="+880 1711-000000"
                        className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-normal text-muted-foreground">Email Address</label>
                      <input
                        type="email"
                        value={editingCandidate.email}
                        onChange={(e) =>
                          setEditingCandidate((prev) =>
                            prev ? { ...prev, email: e.target.value } : null
                          )
                        }
                        placeholder="candidate@example.com"
                        className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-normal text-muted-foreground">Total Experience</label>
                      <input
                        type="text"
                        value={editingCandidate.experience}
                        onChange={(e) =>
                          setEditingCandidate((prev) =>
                            prev ? { ...prev, experience: e.target.value } : null
                          )
                        }
                        placeholder="e.g. 6.5 Years"
                        className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-normal text-muted-foreground">Notice Period</label>
                      <input
                        type="text"
                        value={editingCandidate.noticePeriod}
                        onChange={(e) =>
                          setEditingCandidate((prev) =>
                            prev ? { ...prev, noticePeriod: e.target.value } : null
                          )
                        }
                        placeholder="e.g. 15 Days notice"
                        className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-normal text-foreground outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>

                  {/* PDF CV Preview & Replacement */}
                  <div className="space-y-1.5 pt-1">
                    <label className="font-normal text-muted-foreground">Curriculum Vitae (.pdf)</label>
                    <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-dashed border-border bg-muted/20">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="size-3.5 text-red-500 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-normal text-foreground truncate">
                            {editingCandidate.pdfFileName}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-normal">
                            Attached Document
                          </div>
                        </div>
                      </div>

                      <label className="h-7.5 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-normal transition flex items-center gap-1.5 cursor-pointer shrink-0">
                        <Upload className="size-3" />
                        <span>Replace PDF</span>
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const sizeKb = Math.round(file.size / 1024);
                              const sizeLabel = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
                              const objectUrl = URL.createObjectURL(file);
                              setEditingCandidate((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      pdfUrl: objectUrl,
                                      pdfFileName: file.name,
                                    }
                                  : null
                              );
                              toast.success(`Attached new CV: ${file.name} (${sizeLabel})`);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 border-t border-border/60 bg-muted/15 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCandidate(null)}
                    className="h-8 px-3.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-normal rounded-lg transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-8 px-4 bg-primary hover:opacity-95 text-primary-foreground text-xs font-normal rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="size-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
