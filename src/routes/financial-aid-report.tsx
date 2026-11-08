import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Banknote,
  Printer,
  ChevronRight,
  TrendingUp,
  PieChart,
  Users,
  ShieldCheck,
  Search,
  ExternalLink,
  Filter,
  CheckCircle2,
  Calendar,
  Building2,
  Phone,
  MapPin,
  X,
  FileText,
  Layers,
  RotateCcw,
  GraduationCap,
  Home,
  HeartHandshake,
  HeartPulse,
} from "lucide-react";

export const Route = createFileRoute("/financial-aid-report")({
  head: () => ({
    meta: [
      { title: "Financial Aid Executive Report — CRIPTON" },
      {
        name: "description",
        content:
          "Executive Governance & Audit report for corporate financial aid disbursements across staff, agent proxies, and community recipients.",
      },
    ],
  }),
  component: FinancialAidReportPage,
});

export type FinancialAidChannel = "Direct Employee" | "Via Employee Agent";
export type FinancialAidPurpose =
  | "Medical Treatment"
  | "Education Assistance"
  | "House Repair & Disaster"
  | "Livelihood & Self-Reliance"
  | "Family & Marriage"
  | "Others";

export interface FinancialAidRecord {
  id: string;
  fundType?: string;
  budgetYear: number;
  assignedDate: string;
  distributionDeadline?: string;
  amount: number;
  isRecurring?: boolean;
  disbursementChannel: FinancialAidChannel;
  purposeCategory: FinancialAidPurpose;
  purposeSpecificDescription?: string;
  employeeId?: string;
  employeeName?: string;
  employeeDept?: string;
  employeeDesignation?: string;
  beneficiaryName: string;
  beneficiaryPhone?: string;
  beneficiaryAddress?: string;
  institutionName?: string;
  institutionType?: string;
  agencyStatus: "Verified" | "Distributed" | "Approved" | "Pending";
  proofDetails?: {
    receiptRef?: string;
    witnessName?: string;
    witnessPhone?: string;
    notes?: string;
    submittedAt?: string;
  };
}

// Helper to construct realistic demo records (28 per category = 168 records)
function generateComprehensiveFinancialAidData(): FinancialAidRecord[] {
  const staffPool = [
    { id: "2023043021", name: "Shakil Ahmed", dept: "Maintenance", desig: "Sr. Electrician", phone: "01711-223344" },
    { id: "2023046001", name: "Tariqul Islam", dept: "Knitting", desig: "Machine Operator", phone: "01822-334455" },
    { id: "2023049112", name: "Nazrul Islam", dept: "Finishing", desig: "Floor Supervisor", phone: "01912-334455" },
    { id: "2023047890", name: "Anowar Hossain", dept: "Quality Assurance", desig: "Sr. Inspector", phone: "01733-445566" },
    { id: "2023041122", name: "Rafiqul Islam", dept: "Cutting", desig: "Cutter Master", phone: "01622-113344" },
    { id: "2023045566", name: "Mustafizur Rahman", dept: "Security", desig: "Security Guard", phone: "01811-332244" },
    { id: "2023048899", name: "Delwar Hossain", dept: "Dyeing", desig: "Chemical Technician", phone: "01744-556677" },
    { id: "2023042211", name: "Mizanur Rahman", dept: "Spinning", desig: "Mechanic", phone: "01933-667788" },
    { id: "2023041987", name: "Jahangir Alam", dept: "Inventory Store", desig: "Storekeeper", phone: "01522-889900" },
    { id: "2023044433", name: "Kamrul Hasan", dept: "Human Resources", desig: "HR Welfare Assistant", phone: "01611-223344" },
    { id: "2023046781", name: "Sirajul Islam", dept: "Merchandising", desig: "Sample Specialist", phone: "01788-990011" },
    { id: "2023043329", name: "Faruk Hossain", dept: "Engineering", desig: "TIG Welder", phone: "01833-776655" },
    { id: "2023045512", name: "Monirul Islam", dept: "Sewing Line 4", desig: "Senior Tailor", phone: "01955-443322" },
    { id: "2023047761", name: "Shahin Alam", dept: "Logistics", desig: "Forklift Operator", phone: "01633-887766" },
  ];

  const outsideBeneficiaries = [
    { name: "Khadija Bibi", phone: "01755-667788", address: "Kaliakair, Gazipur" },
    { name: "Abdur Rahim", phone: "01944-556677", address: "Kapasia, Gazipur" },
    { name: "Sufia Begum", phone: "01833-221100", address: "Sreepur, Gazipur" },
    { name: "Mofizur Rahman", phone: "01711-998844", address: "Bhaluka, Mymensingh" },
    { name: "Kulsum Akter", phone: "01622-334499", address: "Gafargaon, Mymensingh" },
    { name: "Siraj Mia", phone: "01911-445588", address: "Fulbaria, Mymensingh" },
    { name: "Rashida Khatun", phone: "01722-114477", address: "Tongi, Gazipur" },
    { name: "Kalam Sheikh", phone: "01844-552233", address: "Joydebpur, Gazipur" },
    { name: "Anwara Begum", phone: "01655-778899", address: "Tangail Sadar" },
    { name: "Habibur Rahman", phone: "01933-225566", address: "Narsingdi Sadar" },
  ];

  // Specific, realistic case seeds per category (28 items each)
  const categoryTemplates: Record<
    FinancialAidPurpose,
    Array<{ desc: string; amount: number; witness: string }>
  > = {
    "Medical Treatment": [
      { desc: "Cardiac Stent Co-pay Subsidy at National Heart Foundation (NICVD)", amount: 45000, witness: "Dr. A. Rahman (Cardiologist)" },
      { desc: "Chemotherapy Infusion Cycle 3 and Specialized Oncology Medication", amount: 38000, witness: "Dr. S. K. Roy (Cancer Institute)" },
      { desc: "Lower Leg Fracture Internal Fixation & Bone Plating Surgery at NITOR", amount: 28000, witness: "Dr. Nazmul Huda (Surgeon)" },
      { desc: "Pediatric Thalassemia Blood Transfusions & Iron Chelation Pack", amount: 16000, witness: "Medical Officer, Red Crescent" },
      { desc: "Bilateral Cataract Removal Surgery & Foldable Hydrophobic IOL Lens", amount: 22000, witness: "Dr. Selim Reza (Eye Specialist)" },
      { desc: "Hemodialysis Session Assistance & Erythropoietin Hormone Injections", amount: 32000, witness: "Kidney Care Clinic Manager" },
      { desc: "Lap Chole Gallbladder Stone Laser Surgery at Tongi General Hospital", amount: 25000, witness: "Dr. Farhana Yasmin" },
      { desc: "Spinal Lumbar Disc Herniation Targeted Physiotherapy & Meds", amount: 19000, witness: "Lead Physio, CRP Mirpur" },
      { desc: "Dengue Hemorrhagic Shock ICU Bed Support & Platelet Transfusion", amount: 35000, witness: "ICU Resident, Gazipur Sadar" },
      { desc: "Severe Burn Wound Debridement, Antiseptic Dressings & Skin Grafting", amount: 42000, witness: "Burn Institute Welfare Desk" },
      { desc: "Pediatric Severe Pneumonia Hospitalization & Nebulization Care", amount: 15000, witness: "Pediatric Consultant" },
      { desc: "Chronic Diabetic Neuropathy Maintenance & Insulin Supplies", amount: 13000, witness: "Local Registered Physician" },
      { desc: "Emergency Appendectomy Surgical Bill Clearance at Local Clinic", amount: 24000, witness: "Clinic Administrator" },
      { desc: "Post-Stroke Neurological Rehabilitation & Wheelchair Assistance", amount: 27000, witness: "Neurology Welfare Desk" },
      { desc: "ENT Mastoiditis Ear Reconstruction Surgery & Digital Hearing Aid", amount: 23000, witness: "Dr. Moniruzzaman" },
      { desc: "Orthopedic Knee Joint Arthroscopy & Synovial Fluid Injections", amount: 31000, witness: "Orthopedic Surgeon" },
      { desc: "Emergency C-Section Delivery with Neonatal Incubator Support", amount: 26000, witness: "Maternity Clinic In-Charge" },
      { desc: "Hepatitis B Chronic Liver Impairment Antiviral Therapy Subsidy", amount: 34000, witness: "Hepatology Specialist" },
      { desc: "Tuberculosis DOTS Specialized High-Protein Nutrition & Medicines", amount: 17000, witness: "Upazila Health Officer" },
      { desc: "Severe COPD & Asthma Portable Oxygen Concentrator Machine Grant", amount: 29000, witness: "Chest Disease Specialist" },
      { desc: "Prostate Enucleation Surgery & Post-Op Catheter Care Grant", amount: 27000, witness: "Urologist, Shaheed Tajuddin Hosp." },
      { desc: "Pediatric Clubfoot Corrective Tenotomy & Orthotic Foot Braces", amount: 20000, witness: "Orthotic Specialist" },
      { desc: "Advanced Glaucoma Trabeculectomy Intraocular Pressure Surgery", amount: 21000, witness: "Ophthalmic Surgeon" },
      { desc: "Renal Calculi Extracorporeal Shock Wave Lithotripsy (ESWL)", amount: 26000, witness: "Diagnostic Imaging Center" },
      { desc: "Post-Road Accident Facial Maxillofacial Bone Alignment Surgery", amount: 39000, witness: "Maxillofacial Surgeon" },
      { desc: "Severe Typhoid Intestinal Perforation Emergency Laparotomy", amount: 30000, witness: "General Surgeon" },
      { desc: "Arteriovenous (AV) Fistula Vascular Creation for Dialysis Access", amount: 22000, witness: "Vascular Surgeon" },
      { desc: "Parkinsonian Neurological Medication & Mobility Walker Equipment", amount: 18000, witness: "Consultant Neurologist" },
    ],

    "Education Assistance": [
      { desc: "Diploma in Textile Engineering 4th Semester Tuition & Lab Fees", amount: 18000, witness: "Principal, Textile Institute" },
      { desc: "Higher Secondary Certificate (HSC) College Exam Registration Fee", amount: 14000, witness: "College Academic In-Charge" },
      { desc: "Public University Undergraduate Admission & Residence Hall Seat", amount: 25000, witness: "Hall Provost, Dhaka University" },
      { desc: "Polytechnic Institute Mechanical Engineering Books & Workshop Kits", amount: 20000, witness: "Head of Dept, Polytechnic" },
      { desc: "Government Medical College 1st Year Anatomy & Pathology Textbooks", amount: 23000, witness: "Medical College Librarian" },
      { desc: "BSc Nursing 2nd Year Institutional Hospital Training & Uniform Fee", amount: 24000, witness: "Nursing Institute Director" },
      { desc: "Madrasa Orphan Student Hafizi Quran Course Kit & Annual Boarding", amount: 12000, witness: "Madrasa Mohtamim" },
      { desc: "Secondary School Certificate (SSC) Final Board Registration Subsidy", amount: 10000, witness: "High School Headmaster" },
      { desc: "Vocational Electrical Trade License Certification & Safety Equipment", amount: 15000, witness: "Technical Training Center (TTC)" },
      { desc: "Bachelor of Science Chemistry Practical Laboratory Chemicals & Glassware", amount: 16000, witness: "Departmental Head" },
      { desc: "Special Education Speech & Hearing Therapy Learning Kit for Deaf Child", amount: 19000, witness: "Special School Principal" },
      { desc: "College Female Student Year-round Commuter Transport Allowance", amount: 12000, witness: "College Welfare Officer" },
      { desc: "Primary School English & Mathematics Remedial Foundation Coaching", amount: 8000, witness: "Primary School Head Teacher" },
      { desc: "Computer Hardware Networking & Graphic Design Professional Diploma", amount: 21000, witness: "IT Academy Coordinator" },
      { desc: "University Undergraduate Final Year Research & Thesis Printing Cost", amount: 15000, witness: "Faculty Advisor" },
      { desc: "Technical School 2D/3D CAD Software Drafting Drafting Certification", amount: 17000, witness: "CAD Training Instructor" },
      { desc: "High School Girl Science Fair Prototype Project & Olympiad Travel", amount: 11000, witness: "Science Club Moderator" },
      { desc: "Orphan Student Madrasa Dakhil Examination Registration & Kit", amount: 13000, witness: "Madrasa Superintendent" },
      { desc: "Polytechnic Computer Engineering Embedded Microcontroller Lab Fee", amount: 20000, witness: "Computer Dept Head" },
      { desc: "Agricultural Training Institute Horticulture Fieldwork & Seeds Kit", amount: 16000, witness: "Agriculture Extension Officer" },
      { desc: "Higher Secondary College Physics & Chemistry Practical Books & Kit", amount: 14000, witness: "College Lecturer" },
      { desc: "Undergraduate Economics Survey Field Research & Dataset Printing", amount: 13000, witness: "Academic Supervisor" },
      { desc: "Heavy Vehicle Driving & Mechanics Certification Training Course", amount: 18000, witness: "BRTA Authorized Driving School" },
      { desc: "High School Science Students Group Textbooks & Geometry Sets", amount: 9000, witness: "Senior Science Teacher" },
      { desc: "Bachelor of Business Administration (BBA) Midterm Examination Fee", amount: 22000, witness: "BBA Program Coordinator" },
      { desc: "Secondary School Board Examination Centre Practical Coaching", amount: 11000, witness: "High School Assistant Head" },
      { desc: "Islamic University Dawah & Islamic Studies Department Semester Dues", amount: 15000, witness: "Department Chairman" },
      { desc: "Technical Training Center (TTC) Industrial Pipefitting Trade Course", amount: 17000, witness: "TTC Trade Instructor" },
    ],

    "House Repair & Disaster": [
      { desc: "Cyclone Remal Heavy Corrugated Iron (CI) Roofing Restoration", amount: 32000, witness: "Local Union Parishad Member" },
      { desc: "Flash Flood Earthen Mud Wall Collapse Brick Foundation Rebuilding", amount: 28000, witness: "Ward Commissioner" },
      { desc: "Electrical Short-Circuit Kitchen Fire Damage Reconstruction Grant", amount: 45000, witness: "Fire Station Station Officer" },
      { desc: "Deep Tube-well & Sanitary Latrine Installation Flood-Safe Subsidy", amount: 26000, witness: "DPHE Sub-Assistant Engineer" },
      { desc: "Monsoon Riverbank Erosion Homestead Immediate Dismantling Transit", amount: 35000, witness: "Local UP Chairman" },
      { desc: "Storm-Damaged Bamboo Truss & Heavy Timber Rafters Reinforcement", amount: 19000, witness: "Community Elder" },
      { desc: "Monsoon Waterlogging Courtyard Earth Filling & Brick Plinth Elevation", amount: 23000, witness: "Village Headman (Matbar)" },
      { desc: "Lightning Strike Damaged Ceiling Patching & Wiring Replacement", amount: 21000, witness: "Local Electrical Inspector" },
      { desc: "Canal Embankment Breach Sandbagging & Wall Shoring Protection", amount: 30000, witness: "Water Management Committee" },
      { desc: "Fallen Banyan Tree Clearance & Crushed Tin Shed Rebuilding", amount: 25000, witness: "Forest Beat Officer" },
      { desc: "Hazardous Broken Asbestos Sheet Safe Disposal & Tin Replacement", amount: 29000, witness: "Union Parishad Secretary" },
      { desc: "Rural Homestead Soil Landfill Elevation to Prevent Flood Inundation", amount: 22000, witness: "Local UP Member" },
      { desc: "Severe Erosion Threat Evacuation & Temporary Homestead Shelter Aid", amount: 27000, witness: "Disaster Relief Volunteer" },
      { desc: "Post-Flood Damp Wall Cement Plastering & Antifungal Wash", amount: 17000, witness: "Building Contractor" },
      { desc: "Accidental Fire Victim Family Emergency Utensils & Temporary Tent", amount: 16000, witness: "Red Crescent Volunteer" },
      { desc: "Nor'wester (Kalbaishakhi) Storm Destroyed Tin Veranda Rebuilding", amount: 31000, witness: "UP Ward Member" },
      { desc: "Safe Drinking Water Shallow Tube-well Arsenic Mitigation Filter Kit", amount: 33000, witness: "Public Health Care Worker" },
      { desc: "Destitute Widow Dilapidated Thatch Cottage Complete Renovation", amount: 22000, witness: "Village Masjid Imam" },
      { desc: "Tornado Windstorm Corrugated Roofing Iron Handover Grant", amount: 34000, witness: "Local UP Chairman" },
      { desc: "Monsoon Roof Leakage Heavy-Duty Tarpaulin & Bitumen Sealing Grant", amount: 14000, witness: "Community Welfare Officer" },
      { desc: "Cracked Load-Bearing Brick Pillar Structural Underpinning Support", amount: 26000, witness: "Civil Works Overseer" },
      { desc: "Severe Hailstorm Pierced Tin Roof Replacement with 0.42mm Sheets", amount: 24000, witness: "Building Materials Merchant" },
      { desc: "Low-Lying Homestead Brick Bordering to Stop Monsoon Mud Runoff", amount: 20000, witness: "UP Ward Representative" },
      { desc: "Flooded Soak Well De-sludging & Concrete Cover Reconstruction", amount: 18000, witness: "Sanitation Supervisor" },
      { desc: "Gale Wind Demolished Cooking Shed & Straw Storage Rebuilding", amount: 18000, witness: "Local Community Leader" },
      { desc: "Flash Flood Livestock Cattle Shed Elevated Timber Floor Rebuilding", amount: 25000, witness: "Livestock Extension Officer" },
      { desc: "Retaining Boundary Wall Collapse Debris Removal & Re-erection", amount: 21000, witness: "Ward Council Member" },
      { desc: "Homestead Rainwater Drainage Sluice Pipe Installation Assistance", amount: 15000, witness: "Union Parishad Engineer" },
    ],

    "Livelihood & Self-Reliance": [
      { desc: "Direct-Drive Industrial Tailoring Sewing Machine Setup for Home Work", amount: 35000, witness: "Garments Machinery Vendor" },
      { desc: "Village Grocery & Tea Stall Fast-Moving Inventory Replenishment", amount: 25000, witness: "Bazaar Business Association" },
      { desc: "Flatbed Wooden Cargo Van Chasis Overhaul & New Rubber Tires", amount: 22000, witness: "Van Workshop Proprietor" },
      { desc: "Mobile Phone Hardware Diagnostic SMD Rework Station & Toolkit", amount: 28000, witness: "Telecom Traders Guild" },
      { desc: "Carpentry Wood Planer, Chisels & Heavy Electric Circular Saw Set", amount: 24000, witness: "Timber Mart President" },
      { desc: "Battery Electric Auto-Van 48V Heavy Lead-Acid Battery Replacement", amount: 42000, witness: "Auto-Rickshaw Union President" },
      { desc: "Small Poultry Farm 200 Layer Chicks, Brooder & Feed Starter Kit", amount: 26000, witness: "Upazila Livestock Officer" },
      { desc: "Street Vendor Vegetable Pushcart Construction & Digital Scale Unit", amount: 18000, witness: "Vegetable Market Secretary" },
      { desc: "Manual Rickshaw Full Body Refurbishment & Ball Bearing Overhaul", amount: 16000, witness: "Rickshaw Workshop In-Charge" },
      { desc: "Hairdressing Salon Hydraulic Chair, Clippers & Sterilizer Cabinet", amount: 23000, witness: "Barber Association Secretary" },
      { desc: "Mobile Fish Vending Insulated Ice Box & Fresh Aeration Drums", amount: 19000, witness: "Fish Wholesalers Samity" },
      { desc: "Bicycle Servicing Workshop Spares, Rim Truer & Foot Air Pump", amount: 17000, witness: "Bicycle Mechanics Association" },
      { desc: "Street Food Snack Vending Stainless Steel Kiosk & LPG Stove", amount: 22000, witness: "Bazaar Committee Inspector" },
      { desc: "Traditional Leather Shoe Repair Hand Stitching Machine & Awls", amount: 17000, witness: "Shoemakers Guild Head" },
      { desc: "Traditional Handloom Weaving Shuttle Spares & High-Grade Yarn Spools", amount: 23000, witness: "Weavers Cooperative Society" },
      { desc: "Dairy Cattle Milking Equipment, Milk Churns & Concentrate Feed", amount: 25000, witness: "Veterinary Surgeon" },
      { desc: "Motorcycle Servicing Socket Wrench Cabinet & Hydraulic Lift Jack", amount: 27000, witness: "Auto Mechanics Workshop Head" },
      { desc: "Seasonal Fruit Retailing Wholesale Working Capital Grant", amount: 20000, witness: "Fruit Market Secretary" },
      { desc: "Electrical Contractor House Wiring Tools & Digital Insulation Meter", amount: 20000, witness: "Electrical Contractors Guild" },
      { desc: "Pottery Terracotta Potter's Wheel Motorization & High-Grade Clay", amount: 19000, witness: "Artisans Cooperative Secretary" },
      { desc: "Industrial Garments Tailoring 5-Thread Overlock Edge Sewing Unit", amount: 32000, witness: "Machine Importers Association" },
      { desc: "School Stationery Shop Paper Reams & Photocopy Toners Restock", amount: 24000, witness: "Stationery Traders Union" },
      { desc: "Backyard Quail Bird Breeding Cage Battery & Initial Bird Flock", amount: 21000, witness: "Poultry Consultant" },
      { desc: "Embroidery (Karchopi) Wooden Framing Stand & Zari Thread Inventory", amount: 19000, witness: "Handicrafts Guild Representative" },
      { desc: "Heavy Brass Water Boiling Samovar & Double Burner Gas Range", amount: 17000, witness: "Tea Merchants Association" },
      { desc: "Watch Repair Microscope Eyepiece & Precision Tweezers Toolkit", amount: 16000, witness: "Watch Technicians Union" },
      { desc: "Blacksmith Workshop Heavy Anvil & Hand-Cranked Blower Refurbishment", amount: 22000, witness: "Blacksmiths Guild Elder" },
      { desc: "Apiculture Modern Wooden Bee Box with Queen Bee Colony & Honey Extractor", amount: 24000, witness: "Beekeeping Extension Specialist" },
    ],

    "Family & Marriage": [
      { desc: "Orphan Sister Wedding Ceremonial Welfare Grant & Bridal Attire", amount: 40000, witness: "Kazi Nurul Huda (Marriage Registrar)" },
      { desc: "Daughter Marriage Essential Household Setup & Kitchen Utensils", amount: 35000, witness: "Village Masjid Imam" },
      { desc: "Destitute Widow Monthly Living Subsistence & Emergency Survival Aid", amount: 20000, witness: "Local UP Ward Member" },
      { desc: "Deceased Factory Worker Bereavement Support & Funeral Rites Dues", amount: 28000, witness: "HR Welfare Officer" },
      { desc: "Orphan Minors Support for Winter Clothing, Rice Rations & Medicine", amount: 19000, witness: "Orphanage Welfare Committee" },
      { desc: "Paralyzed Aged Parents Dedicated Home Care & Medicine Allowance", amount: 16000, witness: "Registered Family Physician" },
      { desc: "Fatherless Underprivileged Daughter Wedding Ceremony Subsidy", amount: 45000, witness: "Marriage Registrar" },
      { desc: "Premature Newborn Infant Emergency Incubator Care & Specialized Formula", amount: 15000, witness: "Hospital Neonatal In-Charge" },
      { desc: "Destitute Abandoned Mother Safe Shelter Transition Advance Rent", amount: 22000, witness: "Women Affairs Officer" },
      { desc: "Deceased Technician Family Post-Mortem Compassionate Hardship Grant", amount: 30000, witness: "Factory Safety Committee Head" },
      { desc: "Orphan Niece Marriage Community Feasting Grain & Spice Subsidy", amount: 32000, witness: "Community Matbar" },
      { desc: "Divorced Sister Rehabilitation Household Essentials & Bedding Set", amount: 20000, witness: "Village Salish Committee" },
      { desc: "Bedridden Disabled Elderly Kinsman Palliative Care Assistance", amount: 18000, witness: "Local Registered Doctor" },
      { desc: "Physically Challenged Daughter Wedding Mobility Crutches & Living Kit", amount: 38000, witness: "Disability Welfare Officer" },
      { desc: "Widowed Sister-in-law Family Food Staples & Monthly Sustenance", amount: 17000, witness: "Local Ward Member" },
      { desc: "Sudden Demise of Breadwinner Emergency Living Bridge Fund", amount: 30000, witness: "HR Department Representative" },
      { desc: "Destitute Family House Fire Loss Household Rehabilitation Cash", amount: 25000, witness: "UP Chairman" },
      { desc: "Impoverished Rural Bride Dignified Bridal Attire & Trunk Set", amount: 26000, witness: "Union Parishad Secretary" },
      { desc: "Severely Malnourished Infant Clinical Therapeutic Milk Formula Aid", amount: 16000, witness: "Clinical Nutritionist" },
      { desc: "Elderly Mother Cataract Post-Surgery Convalescence Family Care", amount: 18000, witness: "Upazila Health Complex Doctor" },
      { desc: "Fatherless Younger Brother Wedding Venue & Basic Food Dues", amount: 26000, witness: "Masjid Committee President" },
      { desc: "Special Needs Child Attendant Monthly Caregiver Living Support", amount: 22000, witness: "Child Rights NGO Worker" },
      { desc: "Orphan Nephews Education & Family Food Ration Grocery Pack", amount: 17000, witness: "School Teacher" },
      { desc: "Single Destitute Mother Winter Blanket & Baby Warmer Supplies", amount: 14000, witness: "Local Health Assistant" },
      { desc: "Traditional Artisan Family Bereavement Funeral & Memorial Rites", amount: 21000, witness: "Artisan Samity President" },
      { desc: "Daughter Marriage Wooden Wardrobe & Household Metal Ware Gift", amount: 34000, witness: "Union Parishad Member" },
      { desc: "Retired Elderly Indigent Mill Artisan Monthly Living Subsidy", amount: 18000, witness: "Retiree Welfare Club" },
      { desc: "Widow Daughter Secure Living Enclosure Construction Grant", amount: 23000, witness: "Local Community Leader" },
    ],

    Others: [
      { desc: "High-Interest Informal Micro-Lender Compound Debt Relief", amount: 30000, witness: "Village Conciliation Council" },
      { desc: "Urgent Legal Bail Bond & Affidavit Defense for False Litigation", amount: 35000, witness: "District Bar Advocate" },
      { desc: "Off-Season Agricultural Lean Period Emergency Family Living Subsidy", amount: 18000, witness: "Farmers Samity Secretary" },
      { desc: "Accidental Fire Total Destruction Emergency Rehabilitation Grant", amount: 28000, witness: "Fire Service Station Officer" },
      { desc: "Winter Severe Cold Wave Heavy Fleece Blankets Distribution Aid", amount: 15000, witness: "Disaster Relief Coordinator" },
      { desc: "Destitute Orphan Youth Ongoing Monthly Subsistence Allowance", amount: 13000, witness: "Orphanage Welfare Trustee" },
      { desc: "Emergency Critical Patient ICU Ambulance Long-Distance Fare", amount: 11000, witness: "Ambulance Service Provider" },
      { desc: "Accidental Lightning Strike Cattle Demise Emergency Farm Aid", amount: 22000, witness: "Upazila Veterinary Officer" },
      { desc: "Village Boundary Land Demarcation & Legal Land Record Search Fee", amount: 16000, witness: "Sub-Registry Deed Writer" },
      { desc: "Lost NID & Biometric Identity Restoration Legal Stamp Affidavit Dues", amount: 9000, witness: "Election Office Assistant" },
      { desc: "Heavy Monsoon Inundation Submerged Crop Harvest Emergency Recovery", amount: 21000, witness: "Agriculture Extension Supervisor" },
      { desc: "Elderly Indigent Street Beggar Dignified Resettlement Subsidy", amount: 16000, witness: "Social Welfare Officer" },
      { desc: "Specialized Psychiatric Medications & Clinical Therapy Grant", amount: 25000, witness: "Consultant Psychiatrist" },
      { desc: "Paraplegic Handicapped Youth Heavy Tricycle Frame Overhaul", amount: 21000, witness: "Disability Center In-Charge" },
      { desc: "Stranded Indigent Passenger Emergency Return Rail Ticket & Food", amount: 9000, witness: "Station Master Assistant" },
      { desc: "Flash Flood Rescue Country Boat Fuel & Emergency Charter Subsidy", amount: 14000, witness: "Boatmen Union Leader" },
      { desc: "Summer Heatwave Acute Drinking Water Tanker Disinfection Delivery", amount: 19000, witness: "Public Health Engineer" },
      { desc: "Electrical Transformer Voltage Surge Appliance Loss Relief Grant", amount: 20000, witness: "Palli Bidyut Inspector" },
      { desc: "Orphan Care Shelter Annual Festive Clothing & Nutrition Support", amount: 26000, witness: "Shelter Superintendent" },
      { desc: "Hand-Operated Mobility Wheelchair Replacement & Tire Set", amount: 14000, witness: "Rehabilitation Center Worker" },
      { desc: "Permanently Incapacitated Ex-Employee Palliative Living Stipend", amount: 29000, witness: "HR Welfare Head" },
      { desc: "Abandoned Child Emergency Hospital Nursery Care & Cloth Diapers", amount: 16000, witness: "Pediatric Ward In-Charge" },
      { desc: "Land Cadastral Survey & Title Dispute Document Search Cost", amount: 12000, witness: "Land Revenue Assistant" },
      { desc: "Emergency Polyvalent Snakebite Antivenom Sourcing & ICU Care", amount: 23000, witness: "Civil Surgeon Office Doctor" },
      { desc: "Cold Wave Heavy Thermal Cotton Quilts for Destitute Village Kin", amount: 16000, witness: "Local UP Member" },
      { desc: "Extreme Poverty Family Rice, Lentils & Edible Oil Ration Pack", amount: 18000, witness: "Ward Relief Committee" },
      { desc: "Major Surgery Post-Hospitalization Convalescence Diet Allowance", amount: 20000, witness: "Attending Resident Doctor" },
      { desc: "Special Management Compassionate Extreme Hardship Discretionary Grant", amount: 33000, witness: "Factory General Manager" },
    ],
  };

  const records: FinancialAidRecord[] = [];
  let globalCounter = 1;

  // Categories iteration (6 categories * 28 items = 168 records)
  (Object.keys(categoryTemplates) as FinancialAidPurpose[]).forEach((cat) => {
    const templates = categoryTemplates[cat];

    templates.forEach((tmpl, idx) => {
      // Realistic assignment across 2026 (first 23), 2025 (next 3), 2024 (last 2)
      let year = 2026;
      let month = ((idx % 12) + 1).toString().padStart(2, "0");
      let day = ((idx * 3 + 2) % 27 + 1).toString().padStart(2, "0");

      if (idx >= 26) {
        year = 2024;
        month = "11";
      } else if (idx >= 23) {
        year = 2025;
        month = "09";
      }

      const assignedDate = `${year}-${month}-${day}`;
      const id = `FA-${year}-${globalCounter.toString().padStart(3, "0")}`;
      globalCounter++;

      // Strict channel allocation: 50% Direct Employee, 50% Via Employee Agent (NO Direct External)
      const staff = staffPool[idx % staffPool.length];
      let channel: FinancialAidChannel = "Direct Employee";
      let beneficiaryName = staff.name;
      let beneficiaryPhone = staff.phone;
      let beneficiaryAddress = "Gazipur Industrial Zone";

      if (idx % 2 === 1) {
        // Via Employee Agent
        channel = "Via Employee Agent";
        const ext = outsideBeneficiaries[idx % outsideBeneficiaries.length];
        beneficiaryName = `${ext.name} (Village Beneficiary)`;
        beneficiaryPhone = ext.phone;
        beneficiaryAddress = ext.address;
      }

      // Status
      const status: "Verified" | "Distributed" | "Approved" | "Pending" =
        idx % 14 === 0 ? "Pending" : idx % 7 === 0 ? "Approved" : idx % 5 === 0 ? "Distributed" : "Verified";

      records.push({
        id,
        budgetYear: year,
        assignedDate,
        amount: tmpl.amount,
        isRecurring: false,
        disbursementChannel: channel,
        purposeCategory: cat,
        purposeSpecificDescription: tmpl.desc,
        employeeId: staff.id,
        employeeName: staff.name,
        employeeDept: staff.dept,
        employeeDesignation: staff.desig,
        beneficiaryName,
        beneficiaryPhone,
        beneficiaryAddress,
        agencyStatus: status,
        proofDetails: {
          receiptRef: `VCH-${year}-${(1000 + globalCounter).toString()}`,
          witnessName: tmpl.witness,
          notes: "Verification certificate & voucher countersigned by HR Welfare Officer.",
          submittedAt: assignedDate,
        },
      });
    });
  });

  return records;
}

export const DEFAULT_FINANCIAL_AID_RECORDS: FinancialAidRecord[] = generateComprehensiveFinancialAidData();

function FinancialAidReportPage() {
  const [records, setRecords] = useState<FinancialAidRecord[]>([]);
  const [budgetPools] = useState<{ year: number; amount: number }[]>([
    { year: 2026, amount: 4500000 },
    { year: 2025, amount: 3500000 },
    { year: 2024, amount: 3000000 },
  ]);

  // Multi-dimensional filters (Year, Month, Date Range, Channel)
  const [filterYear, setFilterYear] = useState<string>("2026");
  const [filterMonth, setFilterMonth] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [filterChannel, setFilterChannel] = useState<string>("ALL");

  // Load records from storage or initial (with 28 records per category guarantee)
  useEffect(() => {
    let loaded: FinancialAidRecord[] = [];

    // Check unified aid records first
    const rawUnified = localStorage.getItem("cripton_unified_aid_records");
    if (rawUnified) {
      try {
        const parsed = JSON.parse(rawUnified);
        if (Array.isArray(parsed)) {
          const aidOnly = parsed
            .filter((r: any) => r.fundType === "Financial Aid" || r.id?.startsWith("FA-"))
            // Filter out any legacy direct external records
            .filter((r: any) => r.disbursementChannel !== "Direct External")
            .map((r: any) => ({
              id: r.id,
              budgetYear: r.budgetYear || 2026,
              assignedDate: r.assignedDate || "2026-06-18",
              distributionDeadline: r.distributionDeadline,
              amount: Number(r.amount) || 0,
              isRecurring: Boolean(r.isRecurring),
              disbursementChannel: (r.disbursementChannel === "Via Employee Agent" ? "Via Employee Agent" : "Direct Employee") as FinancialAidChannel,
              purposeCategory: (r.purposeCategory as FinancialAidPurpose) || "Others",
              purposeSpecificDescription: r.purposeSpecificDescription || r.otherPurposeDetails || "",
              employeeId: r.employeeId,
              employeeName: r.employeeName,
              employeeDept: r.employeeDept,
              employeeDesignation: r.employeeDesignation,
              beneficiaryName: r.beneficiaryName || r.employeeName || "Beneficiary",
              beneficiaryPhone: r.beneficiaryPhone,
              beneficiaryAddress: r.beneficiaryAddress,
              institutionName: r.institutionName,
              institutionType: r.institutionType,
              agencyStatus: r.agencyStatus || "Verified",
              proofDetails: r.proofDetails,
            }));
          if (aidOnly.length > 0) {
            loaded = aidOnly;
          }
        }
      } catch (e) {}
    }

    // Always merge so that all 28 demo records per category are present and available
    const existingIds = new Set(loaded.map((r) => r.id));
    const merged = [
      ...loaded,
      ...DEFAULT_FINANCIAL_AID_RECORDS.filter((r) => !existingIds.has(r.id)),
    ];
    setRecords(merged);
  }, []);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // 1. Year filter
      if (filterYear !== "ALL") {
        const matchesYear =
          r.budgetYear?.toString() === filterYear ||
          (r.assignedDate && r.assignedDate.startsWith(filterYear));
        if (!matchesYear) return false;
      }

      // 2. Month filter (assignedDate: YYYY-MM-DD)
      if (filterMonth !== "ALL") {
        if (!r.assignedDate) return false;
        const parts = r.assignedDate.split("-");
        if (parts.length >= 2) {
          if (parts[1] !== filterMonth) return false;
        } else {
          return false;
        }
      }

      // 3. Date Range
      if (dateFrom && r.assignedDate && r.assignedDate < dateFrom) return false;
      if (dateTo && r.assignedDate && r.assignedDate > dateTo) return false;

      // 4. Channel filter
      if (filterChannel !== "ALL" && r.disbursementChannel !== filterChannel) return false;

      return true;
    });
  }, [records, filterYear, filterMonth, dateFrom, dateTo, filterChannel]);

  // Compute statistics (Direct Employee vs Via Employee Agent only)
  const stats = useMemo(() => {
    const targetRecords = filteredRecords;

    let totalAssigned = 0;
    let totalDistributed = 0;

    // Channels
    let totalDirectEmployee = 0;
    let countDirectEmployee = 0;
    let totalViaAgent = 0;
    let countViaAgent = 0;

    const channelMatrix = {
      "Direct Employee": { total: 0, count: 0 },
      "Via Employee Agent": { total: 0, count: 0 },
    };

    const purposeBreakdown: Record<
      FinancialAidPurpose,
      { total: number; count: number }
    > = {
      "Medical Treatment": { total: 0, count: 0 },
      "Education Assistance": { total: 0, count: 0 },
      "House Repair & Disaster": { total: 0, count: 0 },
      "Livelihood & Self-Reliance": { total: 0, count: 0 },
      "Family & Marriage": { total: 0, count: 0 },
      Others: { total: 0, count: 0 },
    };

    targetRecords.forEach((r) => {
      totalAssigned += r.amount;
      if (r.agencyStatus === "Distributed" || r.agencyStatus === "Verified") {
        totalDistributed += r.amount;
      }

      // Channel Segregation (Strictly Direct Employee vs Via Employee Agent)
      if (r.disbursementChannel === "Via Employee Agent") {
        totalViaAgent += r.amount;
        countViaAgent++;
        channelMatrix["Via Employee Agent"].total += r.amount;
        channelMatrix["Via Employee Agent"].count++;
      } else {
        totalDirectEmployee += r.amount;
        countDirectEmployee++;
        channelMatrix["Direct Employee"].total += r.amount;
        channelMatrix["Direct Employee"].count++;
      }

      // Purpose breakdown
      const targetCat = purposeBreakdown[r.purposeCategory] ? r.purposeCategory : "Others";
      purposeBreakdown[targetCat].total += r.amount;
      purposeBreakdown[targetCat].count += 1;
    });

    const currentBudget =
      filterYear !== "ALL"
        ? (budgetPools || []).find((b) => b.year === Number(filterYear))?.amount || 1500000
        : (budgetPools || []).reduce((sum, b) => sum + b.amount, 0);
    const remainingBudget = currentBudget - totalAssigned;

    return {
      currentBudget,
      totalAssigned,
      totalDistributed,
      remainingBudget,
      totalDirectEmployee,
      countDirectEmployee,
      totalViaAgent,
      countViaAgent,
      channelMatrix,
      purposeBreakdown,
      totalRecords: targetRecords.length,
    };
  }, [filteredRecords, filterYear, budgetPools]);

  // Drill-down Modal State
  const [drillDownState, setDrillDownState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    channel: FinancialAidChannel | "ALL";
    purpose: FinancialAidPurpose | "ALL";
  }>({
    isOpen: false,
    title: "",
    subtitle: "",
    channel: "ALL",
    purpose: "ALL",
  });

  const [drillDownSearch, setDrillDownSearch] = useState("");
  const [drillDownChannelFilter, setDrillDownChannelFilter] = useState<string>("ALL");

  // Filtered drill-down items
  const drillDownRecords = useMemo(() => {
    if (!drillDownState.isOpen) return [];
    return filteredRecords.filter((r) => {
      if (drillDownState.channel !== "ALL" && r.disbursementChannel !== drillDownState.channel) return false;
      if (drillDownState.purpose !== "ALL" && r.purposeCategory !== drillDownState.purpose) return false;

      if (drillDownChannelFilter !== "ALL" && r.disbursementChannel !== drillDownChannelFilter) return false;

      if (drillDownSearch.trim()) {
        const q = drillDownSearch.toLowerCase().trim();
        const str = `${r.employeeName || ""} ${r.employeeId || ""} ${r.beneficiaryName || ""} ${r.institutionName || ""} ${r.purposeCategory || ""} ${r.purposeSpecificDescription || ""}`.toLowerCase();
        return str.includes(q);
      }
      return true;
    });
  }, [
    filteredRecords,
    drillDownState,
    drillDownChannelFilter,
    drillDownSearch,
  ]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar />

        <main className="p-4 sm:p-5 lg:p-6 w-full space-y-5">
          {/* Top Breadcrumb & Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5 font-medium">
                <Link to="/" className="hover:text-primary transition">Home</Link>
                <span>/</span>
                <span>Welfare & Support</span>
                <span>/</span>
                <Link to="/zakat-and-financial-aid" className="hover:text-primary transition">Zakat & Aid</Link>
                <span>/</span>
                <span className="text-foreground font-semibold">Financial Aid Report</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-emerald-600/10 text-emerald-600 rounded-xl border border-emerald-600/20">
                  <Banknote className="size-5" />
                </div>
                <span>Financial Aid Governance & Executive Audit Report</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1 font-normal">
                Cross-tabulated audit statement by Beneficiary Channel (Company Staff vs. Staff Agent vs. Outside Community) and Purpose Categories.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap print:hidden">
              <Link
                to="/zakat-and-financial-aid"
                className="h-8.5 px-3.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-medium flex items-center gap-1.5 transition shadow-2xs"
              >
                <HeartHandshake className="size-4 text-emerald-600" />
                <span>Disbursements Ledger</span>
              </Link>

              <button
                type="button"
                onClick={handlePrint}
                className="h-8.5 px-3.5 bg-primary hover:opacity-95 text-primary-foreground text-xs font-medium rounded-lg transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Printer className="size-3.5" />
                <span>Print Executive Statement</span>
              </button>
            </div>
          </div>

          {/* Enhanced Multi-Dimensional Filter Bar (5 Columns, No Asset Mode) */}
          <div className="bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3 print:hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/60">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide">
                <Filter className="size-3.5 text-primary" />
                <span>Executive Report Filters</span>
                {(filterYear !== "2026" || filterMonth !== "ALL" || dateFrom || dateTo || filterChannel !== "ALL") && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    Filters Active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFilterYear("2026");
                    setFilterMonth("ALL");
                    setDateFrom("");
                    setDateTo("");
                    setFilterChannel("ALL");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground hover:underline flex items-center gap-1 cursor-pointer transition"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset All</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* 1. Year */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                  Year
                </label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:border-primary cursor-pointer shadow-2xs"
                >
                  <option value="ALL">All Years</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              {/* 2. Month */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                  Month
                </label>
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:border-primary cursor-pointer shadow-2xs"
                >
                  <option value="ALL">All Months</option>
                  <option value="01">01 - January</option>
                  <option value="02">02 - February</option>
                  <option value="03">03 - March</option>
                  <option value="04">04 - April</option>
                  <option value="05">05 - May</option>
                  <option value="06">06 - June</option>
                  <option value="07">07 - July</option>
                  <option value="08">08 - August</option>
                  <option value="09">09 - September</option>
                  <option value="10">10 - October</option>
                  <option value="11">11 - November</option>
                  <option value="12">12 - December</option>
                </select>
              </div>

              {/* 3. Date From */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                  Date From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer shadow-2xs"
                />
              </div>

              {/* 4. Date To */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                  Date To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer shadow-2xs"
                />
              </div>

              {/* 5. Channel */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                  Channel
                </label>
                <select
                  value={filterChannel}
                  onChange={(e) => setFilterChannel(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:border-primary cursor-pointer shadow-2xs"
                >
                  <option value="ALL">All Channels</option>
                  <option value="Direct Employee">Direct Employee</option>
                  <option value="Via Employee Agent">Via Staff Agent</option>
                </select>
              </div>
            </div>

            {/* Clean Key Metrics Strip */}
            <div className="flex items-center justify-end pt-2.5 border-t border-border/50 text-xs">
              <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-lg border border-border/70">
                <span className="text-muted-foreground text-[11px] uppercase font-bold">Total Disbursed:</span>
                <span className="text-foreground font-mono text-sm font-black">
                  ৳{stats.totalAssigned.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* REPORT 1: CHANNEL SEGREGATION MATRIX (Strictly Direct Staff vs. Staff Agent) */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Report 1: Beneficiary Channel Segregation (Direct Staff vs. Via Staff Agent)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Segregates financial aid distributed directly to eligible staff or channeled through staff proxies for village handovers.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider self-start sm:self-auto">
                Direct Staff vs. Staff Agent
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="px-4 py-3">Disbursement Channel</th>
                    <th className="px-4 py-3 text-right font-bold text-foreground">Total Disbursed (৳)</th>
                    <th className="px-4 py-3 text-center">Cases</th>
                    <th className="px-4 py-3 text-right">Share of Aid (%)</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-card font-normal">
                  {[
                    {
                      channel: "Direct Employee" as FinancialAidChannel,
                      label: "Direct Employee (Company Staff)",
                      desc: "Disbursed directly to eligible company staff in urgent need",
                    },
                    {
                      channel: "Via Employee Agent" as FinancialAidChannel,
                      label: "Via Staff Agent (Village Handover)",
                      desc: "Channeled through employee to verified needy families or relatives in rural communities",
                    },
                  ].map(({ channel, label, desc }) => {
                    const data = stats.channelMatrix[channel];
                    const share = stats.totalAssigned > 0 ? ((data.total / stats.totalAssigned) * 100).toFixed(1) : "0.0";
                    return (
                      <tr key={channel} className="hover:bg-muted/30 transition">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-foreground text-xs">{label}</div>
                          <div className="text-[10px] text-muted-foreground">{desc}</div>
                        </td>
                        <td
                          onClick={() => {
                            setDrillDownState({
                              isOpen: true,
                              title: `${label} — All Disbursements`,
                              subtitle: `Complete audit trail for channel ${label}`,
                              channel,
                              purpose: "ALL",
                            });
                            setDrillDownChannelFilter(channel);
                            setDrillDownSearch("");
                          }}
                          className="px-4 py-3 text-right font-bold text-foreground cursor-pointer hover:bg-muted/50 hover:underline"
                        >
                          ৳{data.total.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-muted-foreground">
                          {data.count}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground font-medium">
                          {share}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setDrillDownState({
                                isOpen: true,
                                title: `${label} — Channel Audit`,
                                subtitle: `Complete audit trail of all allocations and cases for ${label}`,
                                channel,
                                purpose: "ALL",
                              });
                              setDrillDownChannelFilter(channel);
                              setDrillDownSearch("");
                            }}
                            className="px-2.5 py-1 rounded border border-border hover:bg-muted text-foreground text-xs font-medium cursor-pointer transition shadow-2xs"
                          >
                            Inspect ({data.count})
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-muted/40 font-bold border-t-2 border-border text-foreground">
                    <td className="px-4 py-3 uppercase tracking-wider text-[11px]">Total All Channels</td>
                    <td className="px-4 py-3 text-right font-black text-sm">৳{stats.totalAssigned.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center font-bold">{stats.totalRecords}</td>
                    <td className="px-4 py-3 text-right font-bold">100.0%</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setDrillDownState({
                            isOpen: true,
                            title: "All Financial Aid Cases — Complete Audit",
                            subtitle: "Complete audit portfolio of all aid channels",
                            channel: "ALL",
                            purpose: "ALL",
                          });
                          setDrillDownChannelFilter("ALL");
                          setDrillDownSearch("");
                        }}
                        className="px-3 py-1 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        View All
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* REPORT 2: PURPOSE BREAKDOWN MATRIX (Cleaned: No Asset Columns) */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Report 2: Purpose Category Breakdown
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Itemized distribution across Medical Treatment, Education & Tuition, Disaster & House Reconstruction, Livelihood Self-Reliance, and Family Welfare.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider self-start sm:self-auto">
                Purpose Objectives
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="px-4 py-3">Purpose Category</th>
                    <th className="px-4 py-3 text-right font-bold text-foreground">Total Disbursement (৳)</th>
                    <th className="px-4 py-3 text-right">Share of Aid (%)</th>
                    <th className="px-4 py-3 text-center">Cases</th>
                    <th className="px-4 py-3">Typical Assistance Scope</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-card font-normal">
                  {[
                    {
                      cat: "Medical Treatment" as FinancialAidPurpose,
                      label: "Medical Treatment & Surgery",
                      typical: "Hospital Bill Settlement, Medicine Subsidy, Dialysis Grants",
                    },
                    {
                      cat: "Education Assistance" as FinancialAidPurpose,
                      label: "Education & Tuition Allowance",
                      typical: "School/College Fees, Textbooks, Uniforms, University Stipend",
                    },
                    {
                      cat: "House Repair & Disaster" as FinancialAidPurpose,
                      label: "House Repair & Disaster Relief",
                      typical: "Storm/Flash Flood Rehabilitation, Roofing Subsidy",
                    },
                    {
                      cat: "Livelihood & Self-Reliance" as FinancialAidPurpose,
                      label: "Livelihood & Self-Reliance",
                      typical: "Home-based Tailoring Setup, Small Trading Grant",
                    },
                    {
                      cat: "Family & Marriage" as FinancialAidPurpose,
                      label: "Family & Marriage Welfare",
                      typical: "Marriage Welfare Grant for Daughter/Sister, Bereavement Support",
                    },
                    {
                      cat: "Others" as FinancialAidPurpose,
                      label: "Others (Emergency Subsistence)",
                      typical: "Direct Emergency Compassionate Living Assistance",
                    },
                  ].map(({ cat, label, typical }) => {
                    const row = stats.purposeBreakdown[cat];
                    const share = stats.totalAssigned > 0 ? ((row.total / stats.totalAssigned) * 100).toFixed(1) : "0.0";
                    return (
                      <tr key={cat} className="hover:bg-muted/30 transition">
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {label}
                        </td>
                        <td
                          onClick={() => {
                            setDrillDownState({
                              isOpen: true,
                              title: `${label} — All Disbursements`,
                              subtitle: `All Financial Aid disbursements for ${label}`,
                              purpose: cat,
                              channel: "ALL",
                            });
                            setDrillDownChannelFilter("ALL");
                            setDrillDownSearch("");
                          }}
                          className="px-4 py-3 text-right font-bold text-foreground cursor-pointer hover:bg-muted/50 hover:underline"
                        >
                          ৳{row.total.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground font-medium">{share}%</td>
                        <td className="px-4 py-3 text-center text-muted-foreground font-medium">{row.count}</td>
                        <td className="px-4 py-3 text-muted-foreground text-[11px]">{typical}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setDrillDownState({
                                isOpen: true,
                                title: `${label} — Purpose Audit`,
                                subtitle: `All cases filed under purpose ${label}`,
                                purpose: cat,
                                channel: "ALL",
                              });
                              setDrillDownChannelFilter("ALL");
                              setDrillDownSearch("");
                            }}
                            className="px-2.5 py-1 rounded border border-border hover:bg-muted text-foreground text-xs font-medium cursor-pointer transition shadow-2xs"
                          >
                            Inspect ({row.count})
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-muted/40 font-bold border-t-2 border-border text-foreground">
                    <td className="px-4 py-3 uppercase tracking-wider text-[11px]">Total Portfolio</td>
                    <td className="px-4 py-3 text-right font-black text-sm">৳{stats.totalAssigned.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-bold">100.0%</td>
                    <td className="px-4 py-3 text-center font-bold">{stats.totalRecords}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">All welfare assistance grants</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setDrillDownState({
                            isOpen: true,
                            title: "All Financial Aid Cases — Complete Audit",
                            subtitle: "Complete audit portfolio of all aid purposes",
                            channel: "ALL",
                            purpose: "ALL",
                          });
                          setDrillDownChannelFilter("ALL");
                          setDrillDownSearch("");
                        }}
                        className="px-3 py-1 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        View All
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* ─── DRILL-DOWN AUDIT TRAIL MODAL (Cleaned: No Asset Fields) ────────── */}
        {drillDownState.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
            <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200/90 bg-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 leading-tight">
                        {drillDownState.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-100/80 text-emerald-700 border border-emerald-200">
                        Audit Trail
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{drillDownState.subtitle}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDrillDownState({ ...drillDownState, isOpen: false })}
                  className="size-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                  title="Close modal"
                >
                  <X className="size-4.5" />
                </button>
              </div>

              {/* Filters toolbar inside modal */}
              <div className="px-6 py-3 border-b border-slate-200/80 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={drillDownSearch}
                      onChange={(e) => setDrillDownSearch(e.target.value)}
                      placeholder="Search recipient, ID, agent..."
                      className="h-8.5 pl-8 pr-3 w-52 sm:w-60 rounded-lg border border-slate-300/90 bg-white text-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all"
                    />
                  </div>
                  <select
                    value={drillDownChannelFilter}
                    onChange={(e) => setDrillDownChannelFilter(e.target.value)}
                    className="h-8.5 px-3 rounded-lg border border-slate-300/90 bg-white text-xs font-medium text-slate-700 outline-none focus:border-emerald-600 shadow-2xs cursor-pointer"
                  >
                    <option value="ALL">All Channels</option>
                    <option value="Direct Employee">Direct Employee</option>
                    <option value="Via Employee Agent">Via Staff Agent</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/90 font-medium">
                    Found: <strong className="text-slate-900 font-bold">{drillDownRecords.length}</strong> cases
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold shadow-2xs">
                    Total: ৳{drillDownRecords.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-auto flex-1 bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50/95 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 w-[155px] min-w-[155px] shrink-0 whitespace-nowrap">Case ID</th>
                      <th className="px-4 py-3 min-w-[180px]">Beneficiary / Recipient</th>
                      <th className="px-4 py-3 w-[160px] min-w-[160px] shrink-0 whitespace-nowrap">Channel & Agent</th>
                      <th className="px-4 py-3 w-[150px] shrink-0 whitespace-nowrap">Purpose Category</th>
                      <th className="px-4 py-3 min-w-[220px]">Assistance Scope & Notes</th>
                      <th className="px-4 py-3 w-[120px] shrink-0 text-right whitespace-nowrap">Amount (৳)</th>
                      <th className="px-4 py-3 w-[110px] shrink-0 text-center whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {drillDownRecords.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-14 text-center text-slate-400 text-xs font-medium">
                          No matching financial aid cases found for this matrix cross-section.
                        </td>
                      </tr>
                    ) : (
                      drillDownRecords.map((r, rIdx) => (
                        <tr key={`${r.id}-${rIdx}`} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3.5 font-mono font-bold text-emerald-700 whitespace-nowrap align-middle">
                            {r.id}
                          </td>
                          <td className="px-4 py-3.5 align-middle">
                            <div className="font-bold text-slate-800 text-xs leading-snug">
                              {r.beneficiaryName || r.employeeName || r.institutionName}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {r.beneficiaryPhone || r.employeeId || r.institutionType}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 align-middle">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 text-[11px] font-semibold whitespace-nowrap">
                              {r.disbursementChannel}
                            </span>
                            {r.disbursementChannel === "Via Employee Agent" && r.employeeName && (
                              <div className="text-[11px] text-slate-500 font-medium mt-1 leading-tight">
                                Agent: <span className="text-slate-800 font-semibold">{r.employeeName}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-slate-700 font-medium align-middle whitespace-nowrap text-xs">
                            {r.purposeCategory}
                          </td>
                          <td className="px-4 py-3.5 align-middle">
                            <div className="text-[11px] text-slate-700 font-medium leading-relaxed">
                              {r.purposeSpecificDescription || "Emergency welfare assistance"}
                            </div>
                            {r.proofDetails?.receiptRef && (
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                Ref: {r.proofDetails.receiptRef}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 align-middle whitespace-nowrap text-xs">
                            ৳{r.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5 text-center align-middle whitespace-nowrap">
                            <span
                              className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                                r.agencyStatus === "Verified" || r.agencyStatus === "Distributed"
                                  ? "bg-emerald-100/90 text-emerald-800 border border-emerald-200"
                                  : "bg-amber-100/90 text-amber-800 border border-amber-200"
                              }`}
                            >
                              {r.agencyStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 border-t border-slate-200/90 bg-slate-50/70 flex items-center justify-between shrink-0">
                <span className="text-xs text-slate-500 font-medium">
                  Showing <strong className="text-slate-700 font-bold">{drillDownRecords.length}</strong> records in this drill-down audit trail
                </span>
                <button
                  type="button"
                  onClick={() => setDrillDownState({ ...drillDownState, isOpen: false })}
                  className="h-8.5 px-5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
