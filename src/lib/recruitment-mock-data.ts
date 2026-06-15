// Version key — bump this to force-refresh stale localStorage data
const DATA_VERSION = "v6";

export const initializeRecruitmentMockData = (forceReset = false) => {
  if (typeof window === "undefined") return;

  const versionKey = "recruitment_data_version";
  const storedVersion = localStorage.getItem(versionKey);

  // Force refresh if version mismatch OR explicit reset
  if (!forceReset && storedVersion === DATA_VERSION) return;

  // Clear all old recruitment keys
  const keysToReset = [
    "recruitment_config_operations",
    "recruitment_config_machines",
    "recruitment_config_op_grades",
    "recruitment_config_measurements",
    "recruitment_config_smv_bank",
    "recruitment_config_eff_grades",
    "recruitment_config_grade_vs_grade",
    "recruitment_config_multi_ss_v2",
    "recruitment_candidates",
  ];
  keysToReset.forEach((k) => localStorage.removeItem(k));

  const set = (key: string, data: any) =>
    localStorage.setItem(key, JSON.stringify(data));

  // ─── 1. OPERATION NAMES (10 rows) ───────────────────────────────────────────
  set("recruitment_config_operations", [
    { id: "1",  opName: "Attach Neck Rib - Tube, No Fold",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "2",  opName: "Attach Back Rise",                  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "3",  opName: "Side Seam",                         createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "4",  opName: "Sleeve Hem",                        createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "5",  opName: "Bottom Hem",                        createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "6",  opName: "Collar Join",                       createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "7",  opName: "Placket Making",                    createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "8",  opName: "Cuff Attach",                       createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "9",  opName: "Armhole Join",                      createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "10", opName: "Label Attach",                      createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "11", opName: "Shoulder Join",                     createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "12", opName: "Pocket Attach",                     createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
  ]);

  // ─── 2. M/C NAMES (10 rows) ─────────────────────────────────────────────────
  set("recruitment_config_machines", [
    { id: "1",  mcFullName: "Single Needle Lock Stitch",  mcName: "SNLS",   createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "2",  mcFullName: "Overlock 4 Thread",          mcName: "OL-4TH", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "3",  mcFullName: "Overlock 5 Thread",          mcName: "OL-5TH", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "4",  mcFullName: "Flat Lock 3 Thread",         mcName: "FL-3TH", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "5",  mcFullName: "Button Hole Machine",        mcName: "BH",     createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "6",  mcFullName: "Button Attach Machine",      mcName: "BA",     createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "7",  mcFullName: "Bar Tack Machine",           mcName: "BT",     createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "8",  mcFullName: "Feed Off The Arm",           mcName: "FOTA",   createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "9",  mcFullName: "Kansai Special Waistband",   mcName: "KS",     createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "10", mcFullName: "Snap Button Attach",         mcName: "SBA",    createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "11", mcFullName: "Linking Machine",            mcName: "LM",     createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "12", mcFullName: "Safety Stitch Machine",      mcName: "SS",     createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
  ]);

  // ─── 3. OPERATION GRADES (10 rows) — THE ROOT CAUSE FIX ─────────────────────
  // All grades used in SMV Bank and Multi/SS MUST exist here
  set("recruitment_config_op_grades", [
    { id: "1",  grade: "P",   createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "2",  grade: "P1",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "3",  grade: "A+",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "4",  grade: "A",   createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "5",  grade: "A-",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "6",  grade: "B+",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "7",  grade: "B",   createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "8",  grade: "B-",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "9",  grade: "C+",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "10", grade: "C",   createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "11", grade: "C-",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "12", grade: "H",   createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
  ]);

  // ─── 4. MEASUREMENT (MP) (10 rows) — now with descriptive names ──────────────
  set("recruitment_config_measurements", [
    { id: "1",  name: "44 CM",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "2",  name: "12 CM",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "3",  name: "14 CM",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "4",  name: "32 CM",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "5",  name: "20 CM",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "6",  name: "38 CM",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "7",  name: "50 CM",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "8",  name: "24 CM",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "9",  name: "10 CM",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "10", name: "18 CM",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "11", name: "28 CM",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "12", name: "36 CM",  createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
  ]);

  // ─── 5. SMV BANK (12 rows) — all opGrade/mcName/meas values match above ─────
  set("recruitment_config_smv_bank", [
    { id: "1",  opName: "Attach Neck Rib - Tube, No Fold", mcName: "OL-4TH", opGrade: "P",   meas: "44 CM", smvValue: "0.26", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "2",  opName: "Attach Back Rise",                 mcName: "SNLS",   opGrade: "P1",  meas: "12 CM", smvValue: "0.30", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "3",  opName: "Side Seam",                        mcName: "OL-5TH", opGrade: "A",   meas: "32 CM", smvValue: "0.45", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "4",  opName: "Sleeve Hem",                       mcName: "FL-3TH", opGrade: "B",   meas: "14 CM", smvValue: "0.35", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "5",  opName: "Bottom Hem",                       mcName: "FL-3TH", opGrade: "B",   meas: "38 CM", smvValue: "0.40", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "6",  opName: "Collar Join",                      mcName: "SNLS",   opGrade: "A+",  meas: "20 CM", smvValue: "0.55", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "7",  opName: "Placket Making",                   mcName: "SNLS",   opGrade: "A",   meas: "18 CM", smvValue: "0.60", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "8",  opName: "Cuff Attach",                      mcName: "OL-4TH", opGrade: "C",   meas: "10 CM", smvValue: "0.25", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "9",  opName: "Armhole Join",                     mcName: "OL-5TH", opGrade: "B+",  meas: "24 CM", smvValue: "0.42", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "10", opName: "Label Attach",                     mcName: "SNLS",   opGrade: "C-",  meas: "12 CM", smvValue: "0.15", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "11", opName: "Shoulder Join",                    mcName: "OL-4TH", opGrade: "P",   meas: "28 CM", smvValue: "0.32", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "12", opName: "Pocket Attach",                    mcName: "SNLS",   opGrade: "B-",  meas: "36 CM", smvValue: "0.38", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
  ]);

  // ─── 6. EFF. GRADE POINT (10 rows) ──────────────────────────────────────────
  set("recruitment_config_eff_grades", [
    { id: "1",  effFrom: "0.00",   effTo: "39.99",  point: "0.00", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "2",  effFrom: "40.00",  effTo: "49.99",  point: "1.00", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "3",  effFrom: "50.00",  effTo: "59.99",  point: "2.00", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "4",  effFrom: "60.00",  effTo: "69.99",  point: "3.00", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "5",  effFrom: "70.00",  effTo: "79.99",  point: "4.00", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "6",  effFrom: "80.00",  effTo: "89.99",  point: "4.50", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "7",  effFrom: "90.00",  effTo: "100.00", point: "5.00", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "8",  effFrom: "100.01", effTo: "110.00", point: "5.50", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "9",  effFrom: "110.01", effTo: "120.00", point: "6.00", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "10", effFrom: "120.01", effTo: "200.00", point: "7.00", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
  ]);

  // ─── 7. GRADE POINTS VS GRADE (10 rows) ─────────────────────────────────────
  set("recruitment_config_grade_vs_grade", [
    { id: "1",  pointFrom: "0.00", pointTo: "1.99",  grade: "H",       salaryFrom: "12500", salaryTo: "12500", govtGrade: "Grade-4", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Hold" },
    { id: "2",  pointFrom: "2.00", pointTo: "2.99",  grade: "C",       salaryFrom: "13000", salaryTo: "13500", govtGrade: "Grade-4", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" },
    { id: "3",  pointFrom: "3.00", pointTo: "3.49",  grade: "C+",      salaryFrom: "13501", salaryTo: "14000", govtGrade: "Grade-3", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" },
    { id: "4",  pointFrom: "3.50", pointTo: "3.99",  grade: "B-",      salaryFrom: "14001", salaryTo: "14200", govtGrade: "Grade-3", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" },
    { id: "5",  pointFrom: "4.00", pointTo: "4.49",  grade: "B",       salaryFrom: "14201", salaryTo: "14500", govtGrade: "Grade-3", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" },
    { id: "6",  pointFrom: "4.50", pointTo: "4.99",  grade: "B+",      salaryFrom: "14501", salaryTo: "15000", govtGrade: "Grade-2", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" },
    { id: "7",  pointFrom: "5.00", pointTo: "5.49",  grade: "A-",      salaryFrom: "15001", salaryTo: "15500", govtGrade: "Grade-2", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" },
    { id: "8",  pointFrom: "5.50", pointTo: "5.99",  grade: "A",       salaryFrom: "15501", salaryTo: "16000", govtGrade: "Grade-1", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" },
    { id: "9",  pointFrom: "6.00", pointTo: "6.99",  grade: "A+",      salaryFrom: "16001", salaryTo: "17000", govtGrade: "Grade-1", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" },
    { id: "10", pointFrom: "7.00", pointTo: "10.00", grade: "Special", salaryFrom: "17001", salaryTo: "20000", govtGrade: "Grade-1", validityFrom: "2026-01-01", validityTo: "2029-12-31", remarks: "Current" },
  ]);

  // ─── 8. MULTI/SS (10 rows) — all opGrade values match op_grades above ────────
  set("recruitment_config_multi_ss_v2", [
    { id: "1",  point: "5.00", opGrade: "P",   minOpCount: "2",   mcType: "Different", eff: "90",  addAmt: "500",  validityRemarks: "Current", remarks: "Multi Task",    validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "2",  point: "5.00", opGrade: "P1",  minOpCount: "1,1", mcType: "Same",      eff: "90",  addAmt: "500",  validityRemarks: "Current", remarks: "Special SS",    validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "3",  point: "4.50", opGrade: "P",   minOpCount: "2",   mcType: "Same",      eff: "85",  addAmt: "300",  validityRemarks: "Current", remarks: "Multi L2",      validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "4",  point: "4.00", opGrade: "C",   minOpCount: "3",   mcType: "Different", eff: "80",  addAmt: "400",  validityRemarks: "Current", remarks: "Multi L3",      validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "5",  point: "6.00", opGrade: "A",   minOpCount: "2",   mcType: "Different", eff: "95",  addAmt: "800",  validityRemarks: "Current", remarks: "Expert Multi",  validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "6",  point: "3.50", opGrade: "C+",  minOpCount: "2",   mcType: "Same",      eff: "75",  addAmt: "200",  validityRemarks: "Current", remarks: "Basic Multi",   validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "7",  point: "5.50", opGrade: "A-",  minOpCount: "3",   mcType: "Different", eff: "90",  addAmt: "600",  validityRemarks: "Current", remarks: "Pro Multi",     validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "8",  point: "4.80", opGrade: "B+",  minOpCount: "2",   mcType: "Different", eff: "88",  addAmt: "450",  validityRemarks: "Current", remarks: "Adv Multi",     validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "9",  point: "6.50", opGrade: "A+",  minOpCount: "4",   mcType: "Different", eff: "100", addAmt: "1000", validityRemarks: "Current", remarks: "Master Multi",  validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
    { id: "10", point: "3.00", opGrade: "C-",  minOpCount: "2",   mcType: "Same",      eff: "70",  addAmt: "100",  validityRemarks: "Current", remarks: "Trainee Multi", validityFrom: "2026-01-01", validityTo: "2029-12-31", createdBy: "MTS 01/01/2026 09:00:00 AM", updatedBy: "" },
  ]);

  // ─── 9. CANDIDATES (15 rows) ─────────────────────────────────────────────────
  set("recruitment_candidates", [
    { 
      empIdTemp: "PAL000001", 
      nameEng: "Md. Karim Hossain",   
      nameBng: "মোঃ করিম হোসেন",     
      employeeType: "Worker", 
      department: "RMG Operation", 
      section: "Sewing",   
      designation: "Operator",        
      unit: "Unit-6", 
      line: "52",  
      doj: "2026-08-16", 
      dob: "1994-04-15", 
      personalContact: "01634846914", 
      personalEmail: "karim.hossain@example.com",
      religion: "Islam",
      maritalStatus: "Married",
      nidNumber: "5534893420",
      birthReg: "1994261548002341",
      fatherNameEng: "Md. Abdul Latif",
      fatherNameBng: "মোঃ আব্দুল লতিফ",
      motherNameEng: "Mst. Kulsum Begum",
      motherNameBng: "মোসাঃ কুলসুম বেগম",
      emergencyContact: "01711223344",
      contactPerson: "Md. Abdul Latif",
      relationship: "Father",
      presentAddress: "House: 12, Road: 4, Sector: 11, Uttara, Dhaka, Bangladesh",
      permanentAddress: "Village: Ramnagar, PO: Ramnagar, Thana: Hathazari, District: Chattogram, Bangladesh",
      academics: [
        { id: "1", title: "SSC (Vocational)", institution: "Gazipur High School", year: "2010", result: "GPA 4.50" },
        { id: "2", title: "Trade Certificate in Sewing", institution: "VTI Gazipur", year: "2012", result: "First Class" }
      ],
      experiences: [
        { id: "1", company: "Ananta Garments Ltd", designation: "Junior Operator", from: "2013-01-10", to: "2016-12-15", reason: "Salary Increment & Better Career Prospects" },
        { id: "2", company: "Standard Group Ltd", designation: "Sewing Operator", from: "2017-02-01", to: "2025-05-30", reason: "Relocated closer to home address" }
      ],
      nominee: {
        name: "Mst. Salma Khatun",
        relation: "Wife",
        nidReg: "8893482341",
        contact: "01999888777"
      },
      assessStatus: "IE Pending",   
      grade: "" 
    },
    { 
      empIdTemp: "PAL000002", 
      nameEng: "Fatema Begum",         
      nameBng: "ফাতেমা বেগম",          
      employeeType: "Worker", 
      department: "RMG Operation", 
      section: "Cutting",  
      designation: "Cutter",          
      unit: "Unit-6", 
      line: "12",  
      doj: "2026-08-17", 
      dob: "1995-05-10", 
      personalContact: "01700000001", 
      personalEmail: "fatema.begum@example.com",
      religion: "Islam",
      maritalStatus: "Single",
      nidNumber: "3489234120",
      birthReg: "1995261548002999",
      fatherNameEng: "Md. Abul Hossain",
      fatherNameBng: "মোঃ আবুল হোসেন",
      motherNameEng: "Mst. Rehana Begum",
      motherNameBng: "মোসাঃ রেহানা বেগম",
      emergencyContact: "01811223344",
      contactPerson: "Md. Abul Hossain",
      relationship: "Father",
      presentAddress: "House: 45, Road: 1, Block: A, Tongi, Gazipur, Bangladesh",
      permanentAddress: "Village: Tongi Bazar, PO: Tongi, Thana: Gazipur Sadar, District: Gazipur, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Tongi Girls High School", year: "2011", result: "GPA 3.80" }
      ],
      experiences: [
        { id: "1", company: "Ha-Meem Group", designation: "Helper (Cutting)", from: "2014-06-01", to: "2018-08-15", reason: "Promoted to Cutter in other factory" }
      ],
      nominee: {
        name: "Md. Abul Hossain",
        relation: "Father",
        nidReg: "3489234120",
        contact: "01811223344"
      },
      assessStatus: "HR Approved",  
      grade: "B" 
    },
    { 
      empIdTemp: "PAL000003", 
      nameEng: "Md. Rakibul Islam",    
      nameBng: "মোঃ রাকিবুল ইসলাম",   
      employeeType: "Staff",  
      department: "Quality Control",
      section: "Inspection",
      designation: "QC Inspector",    
      unit: "Unit-6", 
      line: "QC1", 
      doj: "2026-08-18", 
      dob: "1992-02-20", 
      personalContact: "01800000002", 
      personalEmail: "rakibul.qc@example.com",
      religion: "Islam",
      maritalStatus: "Married",
      nidNumber: "4589234122",
      birthReg: "1992261548002888",
      fatherNameEng: "Md. Altaf Ali",
      fatherNameBng: "মোঃ আলতাফ আলী",
      motherNameEng: "Mst. Shahnaz Parvin",
      motherNameBng: "মোসাঃ শাহনাজ পারভীন",
      emergencyContact: "01911223344",
      contactPerson: "Mst. Shahnaz Parvin",
      relationship: "Mother",
      presentAddress: "House: 3, Road: 14, Sector: 4, Uttara, Dhaka, Bangladesh",
      permanentAddress: "Village: Joydebpur, PO: Joydebpur, Thana: Gazipur Sadar, District: Gazipur, Bangladesh",
      academics: [
        { id: "1", title: "HSC", institution: "Joydebpur Govt College", year: "2010", result: "GPA 4.00" },
        { id: "2", title: "Diploma in textile", institution: "Dhaka Polytechnic", year: "2014", result: "GPA 3.65" }
      ],
      experiences: [
        { id: "1", company: "DBL Group Ltd", designation: "Quality Assistant", from: "2015-05-10", to: "2020-04-12", reason: "Joined as Inspector elsewhere" },
        { id: "2", company: "Pacific Jeans Ltd", designation: "QC Inspector", from: "2020-06-01", to: "2025-12-30", reason: "Personal relocation" }
      ],
      nominee: {
        name: "Mst. Lima Akter",
        relation: "Wife",
        nidReg: "9903482344",
        contact: "01999777666"
      },
      assessStatus: "HR Pending",   
      grade: "" 
    },
    { 
      empIdTemp: "PAL000004", 
      nameEng: "Rahima Khatun",        
      nameBng: "রাহিমা খাতুন",         
      employeeType: "Worker", 
      department: "RMG Operation", 
      section: "Finishing",
      designation: "Iron Man",        
      unit: "Unit-6", 
      line: "F-1", 
      doj: "2026-08-19", 
      dob: "1990-12-05", 
      personalContact: "01900000003", 
      personalEmail: "rahima.khatun@example.com",
      religion: "Islam",
      maritalStatus: "Married",
      nidNumber: "4189234123",
      birthReg: "1990261548002777",
      fatherNameEng: "Md. Sofiullah",
      fatherNameBng: "মোঃ সফিউল্লাহ",
      motherNameEng: "Mst. Razia Begum",
      motherNameBng: "মোসাঃ রাজিয়া বেগম",
      emergencyContact: "01511223344",
      contactPerson: "Md. Sofiullah",
      relationship: "Father",
      presentAddress: "House: 15, Road: 2, Block: C, Mirpur-1, Dhaka, Bangladesh",
      permanentAddress: "Village: Mirpur, PO: Mirpur, Thana: Mirpur, District: Dhaka, Bangladesh",
      academics: [
        { id: "1", title: "Class 8 Pass", institution: "Mirpur Primary School", year: "2005", result: "Pass" }
      ],
      experiences: [
        { id: "1", company: "Palmal Group", designation: "Iron helper", from: "2008-01-01", to: "2015-12-31", reason: "Promoted to Iron Man" }
      ],
      nominee: {
        name: "Md. Kamal Hossain",
        relation: "Husband",
        nidReg: "8893482348",
        contact: "01511223344"
      },
      assessStatus: "IE Pending",   
      grade: "" 
    },
    { 
      empIdTemp: "PAL000005", 
      nameEng: "Md. Sohel Rana",       
      nameBng: "মোঃ সোহেল রানা",       
      employeeType: "Worker", 
      department: "RMG Operation", 
      section: "Sewing",   
      designation: "Operator",        
      unit: "Unit-6", 
      line: "53",  
      doj: "2026-08-20", 
      dob: "1996-07-22", 
      personalContact: "01500000004", 
      personalEmail: "sohel.rana@example.com",
      religion: "Islam",
      maritalStatus: "Single",
      nidNumber: "5189234124",
      birthReg: "1996261548002666",
      fatherNameEng: "Md. Akbar Ali",
      fatherNameBng: "মোঃ আকবর আলী",
      motherNameEng: "Mst. Morjina Begum",
      motherNameBng: "মোসাঃ মর্জিনা বেগম",
      emergencyContact: "01611223344",
      contactPerson: "Md. Akbar Ali",
      relationship: "Father",
      presentAddress: "House: 8, Road: 5, Sector: 6, Uttara, Dhaka, Bangladesh",
      permanentAddress: "Village: Sreepur, PO: Sreepur, Thana: Sreepur, District: Gazipur, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Sreepur Pilot High School", year: "2012", result: "GPA 3.50" }
      ],
      experiences: [
        { id: "1", company: "Epyllion Group", designation: "Junior Operator", from: "2014-03-01", to: "2020-08-30", reason: "Career growth" }
      ],
      nominee: {
        name: "Mst. Morjina Begum",
        relation: "Mother",
        nidReg: "5189234124",
        contact: "01611223344"
      },
      assessStatus: "HR Rejected",  
      grade: "" 
    },
    { 
      empIdTemp: "PAL000006", 
      nameEng: "Roksana Akhter",       
      nameBng: "রোকসানা আক্তার",       
      employeeType: "Worker", 
      department: "RMG Operation", 
      section: "Sewing",   
      designation: "Helper",          
      unit: "Unit-6", 
      line: "54",  
      doj: "2026-08-21", 
      dob: "1998-03-11", 
      personalContact: "01600000005", 
      personalEmail: "roksana.helper@example.com",
      religion: "Islam",
      maritalStatus: "Single",
      nidNumber: "6189234125",
      birthReg: "1998261548002555",
      fatherNameEng: "Md. Abdur Rahim",
      fatherNameBng: "মোঃ আব্দুর রহিম",
      motherNameEng: "Mst. Rahima Begum",
      motherNameBng: "মোসাঃ রহিমা বেগম",
      emergencyContact: "01711223345",
      contactPerson: "Md. Abdur Rahim",
      relationship: "Father",
      presentAddress: "House: 20, Road: 3, Block: B, Tongi, Gazipur, Bangladesh",
      permanentAddress: "Village: Tongi, PO: Tongi, Thana: Gazipur, District: Gazipur, Bangladesh",
      academics: [
        { id: "1", title: "Class 8 Pass", institution: "Tongi Primary School", year: "2013", result: "Pass" }
      ],
      experiences: [
        { id: "1", company: "Viyellatex Group", designation: "Helper", from: "2018-05-15", to: "2024-04-10", reason: "Salary issue" }
      ],
      nominee: {
        name: "Mst. Rahima Begum",
        relation: "Mother",
        nidReg: "6189234125",
        contact: "01711223345"
      },
      assessStatus: "IE Pending",   
      grade: "" 
    },
    { 
      empIdTemp: "PAL000007", 
      nameEng: "Md. Jahangir Alam",    
      nameBng: "মোঃ জাহাঙ্গীর আলম",   
      employeeType: "Worker", 
      department: "RMG Operation", 
      section: "Sewing",   
      designation: "Operator",        
      unit: "Unit-6", 
      line: "55",  
      doj: "2026-08-22", 
      dob: "1993-09-30", 
      personalContact: "01700000006", 
      personalEmail: "jahangir.operator@example.com",
      religion: "Islam",
      maritalStatus: "Married",
      nidNumber: "7189234126",
      birthReg: "1993261548002444",
      fatherNameEng: "Md. Mofiz Uddin",
      fatherNameBng: "মোঃ মফিজ উদ্দিন",
      motherNameEng: "Mst. Sakhina Khatun",
      motherNameBng: "মোসাঃ সখিনা খাতুন",
      emergencyContact: "01811223346",
      contactPerson: "Mst. Sakhina Khatun",
      relationship: "Mother",
      presentAddress: "House: 11, Road: 1, Block: D, Savar, Dhaka, Bangladesh",
      permanentAddress: "Village: Savar, PO: Savar, Thana: Savar, District: Dhaka, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Savar High School", year: "2009", result: "GPA 3.90" }
      ],
      experiences: [
        { id: "1", company: "Dekko Group", designation: "Junior Operator", from: "2010-06-01", to: "2015-12-30", reason: "Better Salary" },
        { id: "2", company: "Sterling Group", designation: "Sewing Operator", from: "2016-01-05", to: "2024-08-15", reason: "Relocation" }
      ],
      nominee: {
        name: "Mst. Kohinoor Begum",
        relation: "Wife",
        nidReg: "7189234126",
        contact: "01811223346"
      },
      assessStatus: "HR Approved",  
      grade: "A-" 
    },
    { 
      empIdTemp: "PAL000008", 
      nameEng: "Nasrin Sultana",       
      nameBng: "নাসরিন সুলতানা",       
      employeeType: "Worker", 
      department: "RMG Operation", 
      section: "Finishing",
      designation: "Folder",          
      unit: "Unit-6", 
      line: "F-2", 
      doj: "2026-08-23", 
      dob: "1997-01-14", 
      personalContact: "01800000007", 
      personalEmail: "nasrin.folder@example.com",
      religion: "Islam",
      maritalStatus: "Single",
      nidNumber: "8189234127",
      birthReg: "1997261548002333",
      fatherNameEng: "Md. Sirajul Islam",
      fatherNameBng: "মোঃ সিরাজুল ইসলাম",
      motherNameEng: "Mst. Rokeya Begum",
      motherNameBng: "মোসাঃ রোকেয়া বেগম",
      emergencyContact: "01911223347",
      contactPerson: "Md. Sirajul Islam",
      relationship: "Father",
      presentAddress: "House: 31, Road: 8, Sector: 10, Uttara, Dhaka, Bangladesh",
      permanentAddress: "Village: Uttara, PO: Uttara, Thana: Uttara, District: Dhaka, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Uttara Girls High School", year: "2013", result: "GPA 3.40" }
      ],
      experiences: [
        { id: "1", company: "Hamid Fabrics", designation: "Helper", from: "2015-02-10", to: "2020-11-20", reason: "Salary Increment" }
      ],
      nominee: {
        name: "Md. Sirajul Islam",
        relation: "Father",
        nidReg: "8189234127",
        contact: "01911223347"
      },
      assessStatus: "IE Pending",   
      grade: "" 
    },
    { 
      empIdTemp: "PAL000009", 
      nameEng: "Md. Abul Kashem",      
      nameBng: "মোঃ আবুল কাশেম",       
      employeeType: "Worker", 
      department: "RMG Operation", 
      section: "Cutting",  
      designation: "Spreader",        
      unit: "Unit-6", 
      line: "13",  
      doj: "2026-08-24", 
      dob: "1991-11-08", 
      personalContact: "01900000008", 
      personalEmail: "kashem.cutter@example.com",
      religion: "Islam",
      maritalStatus: "Married",
      nidNumber: "9189234128",
      birthReg: "1991261548002222",
      fatherNameEng: "Md. Nurul Islam",
      fatherNameBng: "মোঃ নুরুল ইসলাম",
      motherNameEng: "Mst. Fatema Khatun",
      motherNameBng: "মোসাঃ ফাতেমা খাতুন",
      emergencyContact: "01511223348",
      contactPerson: "Mst. Fatema Khatun",
      relationship: "Mother",
      presentAddress: "House: 6, Road: 2, Block: E, Tongi, Gazipur, Bangladesh",
      permanentAddress: "Village: Tongi Bazar, PO: Tongi, Thana: Gazipur, District: Gazipur, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Tongi High School", year: "2007", result: "GPA 3.20" }
      ],
      experiences: [
        { id: "1", company: "Mohammadi Group", designation: "Helper (Cutting)", from: "2008-05-12", to: "2016-04-18", reason: "Promoted to Spreader" }
      ],
      nominee: {
        name: "Mst. Sabina Akter",
        relation: "Wife",
        nidReg: "9189234128",
        contact: "01511223348"
      },
      assessStatus: "HR Pending",   
      grade: "" 
    },
    { 
      empIdTemp: "PAL000010", 
      nameEng: "Mariam Akter",         
      nameBng: "মরিয়ম আক্তার",        
      employeeType: "Worker", 
      department: "RMG Operation", 
      section: "Sewing",   
      designation: "Operator",        
      unit: "Unit-6", 
      line: "56",  
      doj: "2026-08-25", 
      dob: "1999-06-19", 
      personalContact: "01500000009", 
      personalEmail: "mariam.sewing@example.com",
      religion: "Islam",
      maritalStatus: "Single",
      nidNumber: "1289234129",
      birthReg: "1999261548002111",
      fatherNameEng: "Md. Lokman Hakim",
      fatherNameBng: "মোঃ লোকমান হাকিম",
      motherNameEng: "Mst. Amena Begum",
      motherNameBng: "মোসাঃ আমেনা বেগম",
      emergencyContact: "01611223349",
      contactPerson: "Md. Lokman Hakim",
      relationship: "Father",
      presentAddress: "House: 4, Road: 7, Sector: 3, Uttara, Dhaka, Bangladesh",
      permanentAddress: "Village: Uttara, PO: Uttara, Thana: Uttara, District: Dhaka, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Uttara Model School", year: "2015", result: "GPA 4.10" }
      ],
      experiences: [
        { id: "1", company: "Dysin Group", designation: "Helper", from: "2016-07-01", to: "2021-12-30", reason: "Promoted to Operator" }
      ],
      nominee: {
        name: "Md. Lokman Hakim",
        relation: "Father",
        nidReg: "1289234129",
        contact: "01611223349"
      },
      assessStatus: "IE Pending",   
      grade: "" 
    },
    { 
      empIdTemp: "PAL000011", 
      nameEng: "Md. Saiful Islam",     
      nameBng: "মোঃ সাইফুল ইসলাম",    
      employeeType: "Worker", 
      department: "RMG Operation", 
      section: "Sewing",   
      designation: "Operator",        
      unit: "Unit-6", 
      line: "57",  
      doj: "2026-08-26", 
      dob: "1994-08-25", 
      personalContact: "01600000010", 
      personalEmail: "saiful.operator@example.com",
      religion: "Islam",
      maritalStatus: "Married",
      nidNumber: "2289234130",
      birthReg: "1994261548002000",
      fatherNameEng: "Md. Shamsul Alam",
      fatherNameBng: "মোঃ শামসুল আলম",
      motherNameEng: "Mst. Jahanara Begum",
      motherNameBng: "মোসাঃ জাহানারা বেগম",
      emergencyContact: "01711223350",
      contactPerson: "Mst. Jahanara Begum",
      relationship: "Mother",
      presentAddress: "House: 18, Road: 4, Savar, Dhaka, Bangladesh",
      permanentAddress: "Village: Savar, PO: Savar, Thana: Savar, District: Dhaka, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Savar Pilot School", year: "2010", result: "GPA 3.60" }
      ],
      experiences: [
        { id: "1", company: "Fakir Apparels", designation: "Junior Operator", from: "2011-01-15", to: "2018-09-30", reason: "Better prospects" }
      ],
      nominee: {
        name: "Mst. Rina Akter",
        relation: "Wife",
        nidReg: "2289234130",
        contact: "01711223350"
      },
      assessStatus: "HR Approved",  
      grade: "C+" 
    },
    { 
      empIdTemp: "PAL000012", 
      nameEng: "Halima Begum",         
      nameBng: "হালিমা বেগম",           
      employeeType: "Worker", 
      department: "RMG Operation", 
      section: "Sewing",   
      designation: "Helper",          
      unit: "Unit-6", 
      line: "58",  
      doj: "2026-08-27", 
      dob: "1996-02-14", 
      personalContact: "01700000011", 
      personalEmail: "halima.helper@example.com",
      religion: "Islam",
      maritalStatus: "Single",
      nidNumber: "3289234131",
      birthReg: "1996261548001999",
      fatherNameEng: "Md. Hanif Ali",
      fatherNameBng: "মোঃ হানিফ আলী",
      motherNameEng: "Mst. Sahida Begum",
      motherNameBng: "মোসাঃ শাহিদা বেগম",
      emergencyContact: "01811223351",
      contactPerson: "Md. Hanif Ali",
      relationship: "Father",
      presentAddress: "House: 22, Road: 2, Block: F, Tongi, Gazipur, Bangladesh",
      permanentAddress: "Village: Tongi, PO: Tongi, Thana: Gazipur, District: Gazipur, Bangladesh",
      academics: [
        { id: "1", title: "Class 8 Pass", institution: "Tongi Girls School", year: "2011", result: "Pass" }
      ],
      experiences: [
        { id: "1", company: "Nassa Group", designation: "Helper", from: "2013-05-10", to: "2020-03-12", reason: "Personal problem" }
      ],
      nominee: {
        name: "Md. Hanif Ali",
        relation: "Father",
        nidReg: "3289234131",
        contact: "01811223351"
      },
      assessStatus: "IE Pending",   
      grade: "" 
    },
    { 
      empIdTemp: "PAL000013", 
      nameEng: "Md. Nur Islam",        
      nameBng: "মোঃ নুর ইসলাম",        
      employeeType: "Worker", 
      department: "RMG Operation", 
      section: "Finishing",
      designation: "Poly Man",        
      unit: "Unit-6", 
      line: "F-3", 
      doj: "2026-08-28", 
      dob: "1995-10-02", 
      personalContact: "01800000012", 
      personalEmail: "nur.finishing@example.com",
      religion: "Islam",
      maritalStatus: "Single",
      nidNumber: "4289234132",
      birthReg: "1995261548001888",
      fatherNameEng: "Md. Mozammel Hoque",
      fatherNameBng: "মোঃ মোজাম্মেল হক",
      motherNameEng: "Mst. Morjina Khatun",
      motherNameBng: "মোসাঃ মর্জিনা খাতুন",
      emergencyContact: "01911223352",
      contactPerson: "Md. Mozammel Hoque",
      relationship: "Father",
      presentAddress: "House: 14, Road: 5, Sector: 9, Uttara, Dhaka, Bangladesh",
      permanentAddress: "Village: Uttara, PO: Uttara, Thana: Uttara, District: Dhaka, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Uttara High School", year: "2011", result: "GPA 3.45" }
      ],
      experiences: [
        { id: "1", company: "Hameem Group", designation: "Poly Helper", from: "2012-08-01", to: "2019-12-30", reason: "Promoted to Poly Man" }
      ],
      nominee: {
        name: "Md. Mozammel Hoque",
        relation: "Father",
        nidReg: "4289234132",
        contact: "01911223352"
      },
      assessStatus: "HR Pending",   
      grade: "" 
    },
    { 
      empIdTemp: "PAL000014", 
      nameEng: "Shirin Akter",         
      nameBng: "শিরিন আক্তার",         
      employeeType: "Worker", 
      department: "RMG Operation", 
      section: "Sewing",   
      designation: "Operator",        
      unit: "Unit-6", 
      line: "59",  
      doj: "2026-08-29", 
      dob: "1992-05-18", 
      personalContact: "01900000013", 
      personalEmail: "shirin.sewing@example.com",
      religion: "Islam",
      maritalStatus: "Married",
      nidNumber: "5289234133",
      birthReg: "1992261548001777",
      fatherNameEng: "Md. Abul Kalam",
      fatherNameBng: "মোঃ আবুল কালাম",
      motherNameEng: "Mst. Fatema Begum",
      motherNameBng: "মোসাঃ ফাতেমা বেগম",
      emergencyContact: "01511223353",
      contactPerson: "Md. Abul Kalam",
      relationship: "Father",
      presentAddress: "House: 25, Road: 1, Savar, Dhaka, Bangladesh",
      permanentAddress: "Village: Savar, PO: Savar, Thana: Savar, District: Dhaka, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Savar Govt School", year: "2008", result: "GPA 3.80" }
      ],
      experiences: [
        { id: "1", company: "Interstop Apparels", designation: "Operator", from: "2010-04-10", to: "2021-08-15", reason: "Family issues" }
      ],
      nominee: {
        name: "Md. Rafiqul Islam",
        relation: "Husband",
        nidReg: "5289234133",
        contact: "01511223353"
      },
      assessStatus: "IE Pending",   
      grade: "" 
    },
    { 
      empIdTemp: "PAL000015", 
      nameEng: "Md. Shahidullah",      
      nameBng: "মোঃ শহীদুল্লাহ",       
      employeeType: "Worker", 
      department: "RMG Operation", 
      section: "Cutting",  
      designation: "Numbering Man",   
      unit: "Unit-6", 
      line: "14",  
      doj: "2026-08-30", 
      dob: "1998-12-09", 
      personalContact: "01500000014", 
      personalEmail: "shahid.cutter@example.com",
      religion: "Islam",
      maritalStatus: "Single",
      nidNumber: "6289234134",
      birthReg: "1998261548001666",
      fatherNameEng: "Md. Abdus Sobhan",
      fatherNameBng: "মোঃ আব্দুস সোবহান",
      motherNameEng: "Mst. Laila Begum",
      motherNameBng: "মোসাঃ লায়লা বেগম",
      emergencyContact: "01611223354",
      contactPerson: "Md. Abdus Sobhan",
      relationship: "Father",
      presentAddress: "House: 16, Road: 3, Block: G, Tongi, Gazipur, Bangladesh",
      permanentAddress: "Village: Tongi Bazar, PO: Tongi, Thana: Gazipur, District: Gazipur, Bangladesh",
      academics: [
        { id: "1", title: "SSC", institution: "Tongi Pilot High School", year: "2014", result: "GPA 3.95" }
      ],
      experiences: [
        { id: "1", company: "Ha-Meem Group", designation: "Cutting Helper", from: "2015-06-01", to: "2022-12-15", reason: "Promoted to Numbering Man" }
      ],
      nominee: {
        name: "Md. Abdus Sobhan",
        relation: "Father",
        nidReg: "6289234134",
        contact: "01611223354"
      },
      assessStatus: "HR Approved",  
      grade: "B+" 
    },
  ]);

  // Mark this version as seeded
  localStorage.setItem(versionKey, DATA_VERSION);
};

// Call this from the browser console: window.__resetRecruitmentData() to force reload
if (typeof window !== "undefined") {
  (window as any).__resetRecruitmentData = () => {
    initializeRecruitmentMockData(true);
    window.location.reload();
  };
}
