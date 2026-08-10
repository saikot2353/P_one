import { useState, useRef, useEffect } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { SearchableSelect } from "@/components/ui/searchable-select";
import companyLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronRight,
  UserPlus,
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Camera,
  Upload,
  Trash2,
  CheckCircle2,
  Info,
  Contact2,
  Search,
  Plus,
  FileText,
  ShieldCheck,
  Mail,
  Heart,
  Cpu,
  Scan,
  Loader2,
  Sparkles,
  X,
  Check,
} from "lucide-react";

type ERecruitmentSearchParams = {
  candidateName?: string;
  designation?: string;
  department?: string;
  jobPost?: string;
  reportingBoss?: string;
  tempId?: string;
};

export const Route = createFileRoute("/e-recruitment-form")({
  component: ERecruitmentForm,
  validateSearch: (search: Record<string, unknown>): ERecruitmentSearchParams => {
    return {
      candidateName: search.candidateName as string | undefined,
      designation: search.designation as string | undefined,
      department: search.department as string | undefined,
      jobPost: search.jobPost as string | undefined,
      reportingBoss: search.reportingBoss as string | undefined,
      tempId: search.tempId as string | undefined,
    };
  },
});

// ─── Reusable Field Components ───────────────────────────────────────────────

function getTooltipContent(label: string) {
  const contentMap: Record<string, string> = {
    "Full Name (English)": "Please enter your complete name in English exactly as it appears on your official documents (NID or Passport).",
    "Full Name (Bengali)": "জাতীয় পরিচয়পত্র অনুযায়ী আপনার সম্পূর্ণ নাম বাংলায় লিখুন।",
    "Date of Birth": "Select your official date of birth as registered in your National ID or Birth Certificate.",
    "Religion": "Select your faith or religious belief from the provided list.",
    "Marital Status": "Indicate your current marital status (e.g., Single, Married).",
    "NID Number": "Enter your 10, 13, or 17-digit National Identity Card number. This is required for official verification.",
    "Birth Registration No.": "If you do not have an NID, provide your official 17-digit Birth Registration Number.",
    "Father's Name (English)": "Enter your father's full name in English as per official records.",
    "Father's Name (Bengali)": "আপনার পিতার সম্পূর্ণ নাম বাংলায় লিখুন।",
    "Mother's Name (English)": "Enter your mother's full name in English as per official records.",
    "Mother's Name (Bengali)": "আপনার মাতার সম্পূর্ণ নাম বাংলায় লিখুন।",
    "Personal Contact No.": "Provide a valid and active mobile number where you can be reached for interview and updates.",
    "Emergency Contact No.": "Provide a reliable phone number of a family member or guardian to contact in case of an emergency.",
    "Personal Email": "Enter a valid, professional email address for official communication.",
    "Contact Person Name": "Enter the full name of the individual we should contact during an emergency.",
    "Relationship": "Specify your relation to the emergency contact person (e.g., Father, Brother, Spouse).",
    "Division": "Select the division corresponding to this address.",
    "District": "Select the district corresponding to this address.",
    "Thana / Upazila": "Select the specific Thana or Upazila for this address.",
    "Post Office": "Select or type the relevant Post Office for this area.",
    "Village / House No": "Provide the precise house number, village, or street details for accurate record keeping.",
    "Road / Block / Sector": "Specify any additional road, block, or sector information for this address.",
    "Country": "Select your country of residence.",
    "Nominee Name": "Enter the full name of the person you are nominating for employment benefits.",
    "Relation with Nominee": "Specify your exact relationship with the designated nominee.",
    "Nominee NID / Birth Reg.": "Provide the nominee's National ID or Birth Registration Number for verification.",
    "Nominee Contact No.": "Provide a valid mobile number for the nominee.",
  };
  return contentMap[label] || `Please provide accurate information for ${label}.`;
}

function FieldInput({
  label,
  required,
  readOnly,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  tooltip,
}: {
  label: string;
  required?: boolean;
  readOnly?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  tooltip?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" tabIndex={-1} className="cursor-help text-muted-foreground hover:text-primary transition-colors focus:outline-none flex items-center">
              <Info className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-card text-card-foreground border border-border shadow-xl p-3 max-w-[250px] rounded-xl text-left">
            <p className="leading-relaxed text-[11.5px] text-muted-foreground font-medium">
              <strong className="text-foreground block mb-1">{label}</strong>
              {tooltip || getTooltipContent(label)}
            </p>
          </TooltipContent>
        </Tooltip>
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide flex items-center">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      </div>
      <input
        type={type}
        readOnly={readOnly}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`h-10 w-full rounded-xl border px-3 text-sm outline-none transition-all duration-200
          ${readOnly
            ? "bg-muted/60 border-border/30 text-primary font-bold cursor-default"
            : "bg-background border-border/80 text-foreground hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10"
          }`}
      />
    </div>
  );
}

function FieldSelect({
  label,
  required,
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
  tooltip,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  tooltip?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" tabIndex={-1} className="cursor-help text-muted-foreground hover:text-primary transition-colors focus:outline-none flex items-center">
                <Info className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-card text-card-foreground border border-border shadow-xl p-3 max-w-[250px] rounded-xl text-left">
              <p className="leading-relaxed text-[11.5px] text-muted-foreground font-medium">
                <strong className="text-foreground block mb-1">{label}</strong>
                {tooltip || getTooltipContent(label)}
              </p>
            </TooltipContent>
          </Tooltip>
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide flex items-center">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        </div>
        <span className="inline-flex items-center gap-0.5 text-[8.5px] font-black text-primary/80 tracking-wider uppercase bg-primary/5 px-1.5 py-0.5 rounded-md border border-primary/10 select-none">
          <Search className="size-2 text-primary" /> Searchable
        </span>
      </div>
      <SearchableSelect
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder || `Search & select ${label}...`}
      />
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border/50 bg-muted/20">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-card border border-border/80 text-primary shadow-2xs">
          {icon}
        </div>
        <div>
          <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest leading-none">
            {title}
          </h2>
          {subtitle && <p className="text-[10px] text-muted-foreground/75 mt-1">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── Option Matrices ─────────────────────────────────────────────────────────

const religionOptions = [
  { value: "Islam", label: "Islam" },
  { value: "Hindu", label: "Hindu" },
  { value: "Christian", label: "Christian" },
  { value: "Buddhist", label: "Buddhist" },
  { value: "Other", label: "Other" },
];

const maritalStatusOptions = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Divorced", label: "Divorced" },
  { value: "Widowed", label: "Widowed" },
];

const divisionOptions = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Rangpur",
  "Mymensingh",
].map((d) => ({ value: d, label: d }));
const districtOptions = ["Dhaka", "Gazipur", "Narayanganj", "Chattogram", "Sylhet", "Comilla"].map(
  (d) => ({ value: d, label: d }),
);
const thanaOptions = [
  "Uttara",
  "Mirpur",
  "Motijheel",
  "Tongi",
  "Gazipur Sadar",
  "Hathazari",
  "Raujan",
  "Boalkhali",
].map((t) => ({ value: t, label: t }));
const postOfficeOptions = ["Uttara Model Town", "Mirpur-10", "Hathazari", "Raujan Bazar"].map(
  (p) => ({ value: p, label: p }),
);
const countryOptions = [{ value: "Bangladesh", label: "Bangladesh" }];

function FormSidebar({ activeSection, setActiveSection, completion, designation }: { activeSection: string, setActiveSection: (s: string) => void, completion?: Record<string, number>, designation?: string }) {
  const sections = [
    { id: "identity", label: "Candidate Identity", icon: <User className="size-4" /> },
    { id: "family", label: "Family & Contact", icon: <Contact2 className="size-4" /> },
    { id: "address", label: "Address Enrollment", icon: <MapPin className="size-4" /> },
    { id: "academics", label: "Academic Credentials", icon: <GraduationCap className="size-4" /> },
    { id: "experience", label: "Prior Experience", icon: <Briefcase className="size-4" /> },
    { id: "nominee", label: "Nominee & Submit", icon: <ShieldCheck className="size-4" /> },
  ];

  return (
    <aside className="w-64 border-r border-border/50 bg-card hidden md:flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6 border-b border-border/50 flex justify-center">
        <img src={companyLogo} alt="Company Logo" className="h-14 object-contain drop-shadow-md" />
      </div>
      <div className="p-4 flex-1 space-y-1 overflow-y-auto">
        {sections.map((sec) => {
          const pct = completion ? completion[sec.id] || 0 : 0;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSection === sec.id
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
                }`}
            >
              <div className="flex items-center gap-3">
                {sec.icon}
                {sec.label}
              </div>
              {completion && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${pct === 100 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                  {pct}%
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="p-4 border-t border-border/50 bg-card mt-auto">
        <button
          type="button"
          onClick={() => setActiveSection("help")}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSection === "help"
              ? "bg-primary/10 text-primary border border-primary/20"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
          }`}
        >
          <div className="flex items-center gap-3">
            <Info className="size-4" />
            Help & User Manual
          </div>
        </button>
      </div>
      <div className="p-4 border-t border-border/50 bg-muted/10 text-center">
        <p className="text-[9px] text-muted-foreground font-medium leading-relaxed">
          Powered by <span className="font-bold text-primary">Pakiza Software Limited</span><br/>
          For help call: 01xxxxxxxxx
        </p>
      </div>
    </aside>
  );
}

function FormBottomNav({
  onNext,
  onPrev,
  isSubmit = false,
  onSubmit,
}: {
  onNext?: () => void;
  onPrev?: () => void;
  isSubmit?: boolean;
  onSubmit?: (e: React.FormEvent) => void;
}) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-border/50 mt-6">
      <div>
        {onPrev && (
          <button
            type="button"
            onClick={onPrev}
            className="h-10 px-6 rounded-xl border border-border/80 bg-card hover:bg-muted text-sm font-bold text-foreground hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            Previous
          </button>
        )}
      </div>
      <div>
        {!isSubmit ? (
          <button
            type="button"
            onClick={onNext}
            className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center gap-2"
          >
            Next Step
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            className="h-11 px-8 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center gap-2"
          >
            <CheckCircle2 className="size-5" /> Submit Application
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function ERecruitmentForm() {
  const router = useRouter();
  const search = Route.useSearch();
  const [activeSection, setActiveSection] = useState("identity");
  const [helpLanguage, setHelpLanguage] = useState<'en' | 'bn'>('en');
  const [copyAddress, setCopyAddress] = useState(false);

  // NID OCR Scanner States
  const [isNidScanning, setIsNidScanning] = useState(false);
  const [nidScanProgress, setNidScanProgress] = useState(0);
  const [nidScanStep, setNidScanStep] = useState(0);
  const [showNidOcrModal, setShowNidOcrModal] = useState(false);
  const [showNidScannerModal, setShowNidScannerModal] = useState(false);
  const [scanDocumentType, setScanDocumentType] = useState("");
  const [rawOcrText, setRawOcrText] = useState("");
  const [nidFrontImage, setNidFrontImage] = useState<File | null>(null);
  const [nidBackImage, setNidBackImage] = useState<File | null>(null);
  const [nidFrontPreview, setNidFrontPreview] = useState<string | null>(null);
  const [nidBackPreview, setNidBackPreview] = useState<string | null>(null);
  const [extractedNid, setExtractedNid] = useState({
    nameEng: "",
    nameBng: "",
    fatherNameEng: "",
    fatherNameBng: "",
    motherNameEng: "",
    motherNameBng: "",
    nid: "",
    dob: "",
    gender: "Male",
    religion: "Islam",
    blood: "B (+ve)",
    presVillageEng: "",
    presVillageBng: "",
    presRoad: "",
    presDistrict: "",
    presDivision: "",
    presUpazila: "",
    presPostOffice: "",
  });

  const parseNidText = (text: string) => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    let nameEng = "";
    let nameBng = "";
    let fatherNameBng = "";
    let motherNameBng = "";
    let nid = "";
    let dob = "";
    let gender = "Male";
    let bloodGroup = "";
    let addressLines: string[] = [];

    // Pass 1: Extract NID Number
    const digitNormalized = text
      .replace(/[lI]/g, "1")
      .replace(/O/g, "0")
      .replace(/S(?=\d)/g, "5");
    const nidMatch = digitNormalized.match(/\b(\d[\d\s]{8,18}\d)\b/);
    if (nidMatch) {
      nid = nidMatch[1].replace(/\s/g, "");
      if (![10, 13, 17].includes(nid.length)) {
        const strictMatch = digitNormalized.match(/\b(\d{10}|\d{13}|\d{17})\b/);
        nid = strictMatch ? strictMatch[1] : nid;
      }
    }

    // Pass 2: Extract Date of Birth
    for (const line of lines) {
      if (/(place of birth|জন্মস্থান|birthplace)/i.test(line)) continue;
      if (/(date of birth|dob|birth date|জন্ম তারিখ)/i.test(line)) {
        const afterColon = line.split(/[:]\s*/);
        if (afterColon.length > 1) {
          const dateStr = afterColon.slice(1).join(":").trim();
          if (dateStr.length > 3) dob = dateStr;
        }
        if (!dob) {
          const inlineDate = line.match(/(\d{1,2}\s+[A-Za-z]{3,}\s+\d{4})/);
          if (inlineDate) dob = inlineDate[1];
        }
        continue;
      }
      if (!dob) {
        const standaloneDate = line.match(/^(\d{1,2}\s+[A-Za-z]{3,}\s+\d{4})$/);
        if (standaloneDate) dob = standaloneDate[1];
      }
    }

    // Pass 3: Extract structured fields
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineLower = line.toLowerCase();

      if (
        /(^name\b|^nane\b|^mame\b)/i.test(lineLower) &&
        !/(father|mother|spouse|পিতা|মাতা)/i.test(lineLower)
      ) {
        const parts = line.split(/[:]\s*/);
        if (parts.length > 1 && parts.slice(1).join(":").trim().length > 1) {
          nameEng = parts.slice(1).join(":").trim();
        } else if (i + 1 < lines.length && /^[A-Z\s\.]+$/.test(lines[i + 1].trim())) {
          nameEng = lines[i + 1].trim();
        }
      }

      if (/নাম/.test(line) && !/(পিতা|মাতা|স্বামী|স্ত্রী)/.test(line)) {
        const parts = line.split(/[:]\s*/);
        if (parts.length > 1 && parts.slice(1).join(":").trim().length > 1) {
          nameBng = parts.slice(1).join(":").trim();
        } else if (i + 1 < lines.length) {
          nameBng = lines[i + 1].trim();
        }
      }

      if (/পিতা/.test(line)) {
        const parts = line.split(/[:]\s*/);
        if (parts.length > 1 && parts.slice(1).join(":").trim().length > 1) {
          fatherNameBng = parts.slice(1).join(":").trim();
        } else if (i + 1 < lines.length) {
          fatherNameBng = lines[i + 1].trim();
        }
      }

      if (/মাতা/.test(line)) {
        const parts = line.split(/[:]\s*/);
        if (parts.length > 1 && parts.slice(1).join(":").trim().length > 1) {
          motherNameBng = parts.slice(1).join(":").trim();
        } else if (i + 1 < lines.length) {
          motherNameBng = lines[i + 1].trim();
        }
      }

      if (/(ঠিকানা|address)/i.test(line)) {
        const parts = line.split(/ঠিকানা[:]\s*/i);
        let addrStart = "";
        if (parts.length > 1) {
          addrStart = parts.slice(1).join(":").trim();
        } else {
          const engParts = line.split(/address[:]\s*/i);
          if (engParts.length > 1) addrStart = engParts.slice(1).join(":").trim();
        }
        if (addrStart) addressLines.push(addrStart);

        for (let j = i + 1; j < lines.length && j <= i + 4; j++) {
          const nextLine = lines[j];
          if (
            /(^name|^নাম|^পিতা|^মাতা|^date|^জন্ম|^blood|^রক্তের|^id\s*no|^national)/i.test(nextLine)
          )
            break;
          if (nextLine.length > 3) {
            addressLines.push(nextLine);
          }
        }
      }

      if (/(blood|রক্তের)/i.test(line)) {
        const parts = line.split(/[:]\s*/);
        if (parts.length > 1) {
          let bg = parts.slice(1).join(":").trim().toUpperCase().replace(/\s/g, "");
          if (bg.includes("AB+") || bg.includes("AB(+")) bloodGroup = "AB (+ve)";
          else if (bg.includes("AB-") || bg.includes("AB(-")) bloodGroup = "AB (-ve)";
          else if (bg.includes("A+") || bg.includes("A(+")) bloodGroup = "A (+ve)";
          else if (bg.includes("A-") || bg.includes("A(-")) bloodGroup = "A (-ve)";
          else if (bg.includes("B+") || bg.includes("B(+")) bloodGroup = "B (+ve)";
          else if (bg.includes("B-") || bg.includes("B(-")) bloodGroup = "B (-ve)";
          else if (bg.includes("O+") || bg.includes("O(+")) bloodGroup = "O (+ve)";
          else if (bg.includes("O-") || bg.includes("O(-")) bloodGroup = "O (-ve)";
        }
      }

      if (/(female|মহিলা)/i.test(line)) {
        gender = "Female";
      }
    }

    if (!nameEng) {
      const allCapsLine = lines.find(
        (l) =>
          /^[A-Z][A-Z\s\.]{4,}$/.test(l.trim()) &&
          !/(FATHER|MOTHER|BLOOD|NID|DATE|BIRTH|GOVERNMENT|REPUBLIC|NATIONAL|CARD|BANGLADESH)/i.test(
            l,
          ),
      );
      if (allCapsLine) nameEng = allCapsLine.trim();
    }

    if (!motherNameBng) {
      const dobLineIdx = lines.findIndex(
        (l) => /(date of birth|dob|জন্ম তারিখ)/i.test(l) && !/(place|জন্মস্থান)/i.test(l),
      );
      if (dobLineIdx !== -1 && dobLineIdx + 1 < lines.length) {
        const nextLine = lines[dobLineIdx + 1].trim();
        if (
          nextLine.length > 3 &&
          !/(id|nid|blood|address|ঠিকানা|রক্তের|national|\d{5,})/i.test(nextLine)
        ) {
          motherNameBng = nextLine;
        }
      }
    }

    if (!dob) {
      const anyDate = text.match(/(\d{1,2}\s+[A-Za-z]{3,}\s+\d{4})/);
      if (anyDate) dob = anyDate[1];
    }

    if (dob) {
      const monthMap: Record<string, string> = {
        jan: "01",
        feb: "02",
        mar: "03",
        apr: "04",
        may: "05",
        jun: "06",
        jul: "07",
        aug: "08",
        sep: "09",
        oct: "10",
        nov: "11",
        dec: "12",
        january: "01",
        february: "02",
        march: "03",
        april: "04",
        june: "06",
        july: "07",
        august: "08",
        september: "09",
        october: "10",
        november: "11",
        december: "12",
      };
      const match1 = dob.match(/(\d{1,2})[\s\-\/]+([a-zA-Z]{3,})[\s\-\/]+(\d{4})/);
      const match2 = dob.match(/(\d{4})[\s\-\/]+(\d{1,2})[\s\-\/]+(\d{1,2})/);
      const match3 = dob.match(/(\d{1,2})[\-\/](\d{1,2})[\-\/](\d{4})/);

      if (match1) {
        const day = match1[1].padStart(2, "0");
        const monthKey = match1[2].toLowerCase().substring(0, 3);
        const month = monthMap[monthKey] || monthMap[match1[2].toLowerCase()] || "01";
        const year = match1[3];
        dob = `${year}-${month}-${day}`;
      } else if (match2) {
        dob = `${match2[1]}-${match2[2].padStart(2, "0")}-${match2[3].padStart(2, "0")}`;
      } else if (match3) {
        dob = `${match3[3]}-${match3[2].padStart(2, "0")}-${match3[1].padStart(2, "0")}`;
      } else {
        const dObj = new Date(dob);
        if (!isNaN(dObj.getTime())) {
          const offset = dObj.getTimezoneOffset() * 60000;
          dob = new Date(dObj.getTime() - offset).toISOString().slice(0, 10);
        } else {
          dob = "";
        }
      }
    }

    const fullAddress = addressLines.join(", ").replace(/,\s*,/g, ",").replace(/\s+/g, " ").trim();
    const cleanEngName = (val: string) =>
      val
        .replace(/(name|nane|mame)[:\-\s]*/gi, "")
        .replace(/[^a-zA-Z\s\.]/g, "")
        .trim();
    const cleanBngLabel = (val: string, label: string) =>
      val.replace(new RegExp(`${label}[:\\-\\s]*`, "ig"), "").trim();

    return {
      nameEng: cleanEngName(nameEng) || "",
      nameBng: cleanBngLabel(nameBng, "নাম") || "",
      fatherNameEng: "",
      fatherNameBng: cleanBngLabel(fatherNameBng, "পিতা") || "",
      motherNameEng: "",
      motherNameBng: cleanBngLabel(motherNameBng, "মাতা") || "",
      blood: bloodGroup || "",
      nid: nid || "",
      dob: dob || "",
      gender,
      religion: "Islam",
      presVillageEng: fullAddress || "",
      presVillageBng: fullAddress || "",
      presRoad: "",
      presDistrict: "",
      presDivision: "",
      presUpazila: "",
      presPostOffice: "",
    };
  };

  const handleRealNidUpload = async () => {
    if (!nidFrontImage) return;

    setIsNidScanning(true);
    setNidScanProgress(5);
    setNidScanStep(1);

    try {
      const resizeImage = (f: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          const reader = new FileReader();
          reader.onload = (e) => {
            img.onload = () => {
              const canvas = document.createElement("canvas");
              let width = img.width;
              let height = img.height;
              const maxDim = 1024;

              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL("image/jpeg", 0.9));
              } else {
                resolve(e.target?.result as string);
              }
            };
            if (typeof e.target?.result === "string") {
              img.src = e.target.result;
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(f);
        });
      };

      const processFile = async (file: File) => {
        const optimizedImageBase64 = await resizeImage(file);
        const formData = new FormData();
        formData.append("apikey", "K85293260888957");
        formData.append("base64Image", optimizedImageBase64);
        formData.append("language", "ben");
        formData.append("detectOrientation", "true");
        formData.append("scale", "true");
        formData.append("OCREngine", "3");

        const res = await fetch("https://api.ocr.space/parse/image", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data && data.ParsedResults && data.ParsedResults.length > 0) {
          return data.ParsedResults[0].ParsedText || "";
        } else if (data && data.ErrorMessage) {
          throw new Error(
            Array.isArray(data.ErrorMessage) ? data.ErrorMessage.join(", ") : data.ErrorMessage,
          );
        }
        return "";
      };

      setNidScanProgress(15);
      setNidScanStep(2);

      setNidScanProgress(30);
      setNidScanStep(3);
      let combinedText = await processFile(nidFrontImage);

      if (nidBackImage) {
        setNidScanProgress(55);
        setNidScanStep(3);
        const backText = await processFile(nidBackImage);
        combinedText += "\n" + backText;
      }

      setNidScanProgress(80);
      setNidScanStep(4);

      if (!combinedText || combinedText.trim() === "") {
        throw new Error("Could not extract any text. Please ensure the image is clear.");
      }

      setNidScanProgress(100);

      setTimeout(() => {
        setIsNidScanning(false);
        const extracted = parseNidText(combinedText);
        setExtractedNid(extracted);
        setRawOcrText(combinedText);
        setShowNidScannerModal(false);
        setShowNidOcrModal(true);
      }, 400);
    } catch (err: any) {
      console.error("OCR Scanning failed: ", err);
      setNidScanProgress(100);
      setTimeout(() => {
        setIsNidScanning(false);
        setExtractedNid({
          nameEng: "Upload Completed",
          nameBng: "",
          fatherNameEng: "",
          fatherNameBng: "",
          motherNameEng: "",
          motherNameBng: "",
          nid: "",
          dob: "",
          gender: "Male",
          religion: "Islam",
          blood: "B (+ve)",
          presVillageEng: "",
          presVillageBng: "",
          presRoad: "",
          presDistrict: "",
          presDivision: "",
          presUpazila: "",
          presPostOffice: "",
        });
        setRawOcrText(
          `OCR Error: ${err?.message || "Unknown error"}\n\nModal loaded in safe input mode. Please enter the details manually below.`,
        );
        setShowNidScannerModal(false);
        setShowNidOcrModal(true);
      }, 400);
    }
  };

  const handleAutofill = () => {
    if (extractedNid.nameEng) setNameEng(extractedNid.nameEng);
    if (extractedNid.nameBng) setNameBng(extractedNid.nameBng);
    if (extractedNid.dob) setDob(extractedNid.dob);
    if (extractedNid.religion) {
      const religionVal = extractedNid.religion.toLowerCase();
      if (religionVal.includes("islam")) setReligion("Islam");
      else if (religionVal.includes("hindu")) setReligion("Hindu");
      else if (religionVal.includes("christian")) setReligion("Christian");
      else if (religionVal.includes("buddhist") || religionVal.includes("buddhism"))
        setReligion("Buddhist");
      else setReligion("Other");
    }
    if (extractedNid.nid) setNidNumber(extractedNid.nid);
    if (extractedNid.fatherNameBng) setFatherBng(extractedNid.fatherNameBng);
    if (extractedNid.motherNameBng) setMotherBng(extractedNid.motherNameBng);
    if (extractedNid.presVillageEng) setPresVillage(extractedNid.presVillageEng);

    setShowNidOcrModal(false);
  };

  // Candidate Photo Preview
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoFileRef = useRef<HTMLInputElement>(null);

  // Basic Details States
  const [nameEng, setNameEng] = useState(search.candidateName || "");
  const [department, setDepartment] = useState(search.department || "RMG Operation");
  const [designation, setDesignation] = useState(search.designation || "Software Quality Assurance (QA) Engineer");
  const [jobPost, setJobPost] = useState(search.jobPost || "");
  const [reportingBoss, setReportingBoss] = useState(search.reportingBoss || "");

  useEffect(() => {
    if (search.tempId) {
      const saved = localStorage.getItem("recruitment_candidates");
      if (saved) {
        const parsed = JSON.parse(saved);
        const cand = parsed.find((c: any) => c.empIdTemp === search.tempId);
        if (cand) {
          if (cand.nameEng) setNameEng(cand.nameEng);
          if (cand.department) setDepartment(cand.department);
          if (cand.designation) setDesignation(cand.designation);
          if (cand.jobPost) setJobPost(cand.jobPost);
          if (cand.reportingBoss) setReportingBoss(cand.reportingBoss);
        }
      }
    }
  }, [search.tempId]);
  const [nameBng, setNameBng] = useState("");
  const [dob, setDob] = useState("");
  const [religion, setReligion] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [nidNumber, setNidNumber] = useState("");
  const [birthReg, setBirthReg] = useState("");

  const [fatherEng, setFatherEng] = useState("");
  const [fatherBng, setFatherBng] = useState("");
  const [motherEng, setMotherEng] = useState("");
  const [motherBng, setMotherBng] = useState("");

  const [personalContact, setPersonalContact] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");

  // Additional Contact Person details
  const [contactPerson, setContactPerson] = useState("");
  const [relationship, setRelationship] = useState("");

  // Address: Present States
  const [presDivision, setPresDivision] = useState("");
  const [presDistrict, setPresDistrict] = useState("");
  const [presThana, setPresThana] = useState("");
  const [presPostOffice, setPresPostOffice] = useState("");
  const [presVillage, setPresVillage] = useState("");
  const [presRoad, setPresRoad] = useState("");
  const [presCountry, setPresCountry] = useState("Bangladesh");

  // Address: Permanent States
  const [permDivision, setPermDivision] = useState("");
  const [permDistrict, setPermDistrict] = useState("");
  const [permThana, setPermThana] = useState("");
  const [permPostOffice, setPermPostOffice] = useState("");
  const [permVillage, setPermVillage] = useState("");
  const [permRoad, setPermRoad] = useState("");
  const [permCountry, setPermCountry] = useState("Bangladesh");

  // Dynamic Lists
  const [academics, setAcademics] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);

  // Nominee Dossier States
  const [nominees, setNominees] = useState<any[]>([
    { id: "1", name: "", relation: "", nidReg: "", contact: "" },
  ]);

  // Compute Full Addresses
  const fullPresentAddress = [
    presVillage ? `House/Village: ${presVillage}` : "",
    presRoad ? `Road/Block: ${presRoad}` : "",
    presPostOffice ? `PO: ${presPostOffice}` : "",
    presThana ? `Thana: ${presThana}` : "",
    presDistrict ? `District: ${presDistrict}` : "",
    presDivision ? `Division: ${presDivision}` : "",
    presCountry,
  ]
    .filter(Boolean)
    .join(", ");

  const computedPermDivision = copyAddress ? presDivision : permDivision;
  const computedPermDistrict = copyAddress ? presDistrict : permDistrict;
  const computedPermThana = copyAddress ? presThana : permThana;
  const computedPermPostOffice = copyAddress ? presPostOffice : permPostOffice;
  const computedPermVillage = copyAddress ? presVillage : permVillage;
  const computedPermRoad = copyAddress ? presRoad : permRoad;
  const computedPermCountry = copyAddress ? presCountry : permCountry;

  const fullPermanentAddress = [
    computedPermVillage ? `House/Village: ${computedPermVillage}` : "",
    computedPermRoad ? `Road/Block: ${computedPermRoad}` : "",
    computedPermPostOffice ? `PO: ${computedPermPostOffice}` : "",
    computedPermThana ? `Thana: ${computedPermThana}` : "",
    computedPermDistrict ? `District: ${computedPermDistrict}` : "",
    computedPermDivision ? `Division: ${computedPermDivision}` : "",
    computedPermCountry,
  ]
    .filter(Boolean)
    .join(", ");

  const calculateCompletion = () => {
    let identityScore = 0;
    if (nameEng) identityScore++;
    if (dob) identityScore++;
    if (religion) identityScore++;
    if (maritalStatus) identityScore++;
    if (nidNumber) identityScore++;
    const identity = Math.round((identityScore / 5) * 100);

    let familyScore = 0;
    if (fatherEng || fatherBng) familyScore++;
    if (motherEng || motherBng) familyScore++;
    if (personalContact) familyScore++;
    if (emergencyContact) familyScore++;
    const family = Math.round((familyScore / 4) * 100);

    let addressScore = 0;
    if (presDistrict && presVillage) addressScore++;
    if (computedPermDistrict && computedPermVillage) addressScore++;
    const address = Math.round((addressScore / 2) * 100);

    const firstAc = academics[0];
    let academicScore = 0;
    if (firstAc?.title) academicScore++;
    if (firstAc?.institution) academicScore++;
    if (firstAc?.year) academicScore++;
    if (firstAc?.result) academicScore++;
    const academicsPct = academics.length > 1 ? 100 : Math.round((academicScore / 4) * 100);

    const firstExp = experiences[0];
    let experience = 0;
    if (experiences.length > 1 || (firstExp?.company && firstExp?.designation)) {
      experience = 100;
    } else if (firstExp?.company || firstExp?.designation) {
      experience = 50;
    }

    const firstNom = nominees[0];
    let nomineeScore = 0;
    if (firstNom) {
      if (firstNom.name) nomineeScore++;
      if (firstNom.relation) nomineeScore++;
      if (firstNom.contact) nomineeScore++;
    }
    const nominee = Math.round((nomineeScore / 3) * 100);

    return {
      identity,
      family,
      address,
      academics: academicsPct,
      experience,
      nominee,
    };
  };

  const completion = calculateCompletion();
  const totalProgress = Math.round(
    (completion.identity + completion.family + completion.address + completion.academics + completion.experience + completion.nominee) / 6
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Academic Grid Operations
  const handleAddAcademic = () => {
    setAcademics([
      ...academics,
      { id: Date.now().toString(), title: "", institution: "", year: "", result: "", file: null },
    ]);
  };
  const handleRemoveAcademic = (id: string) => {
    if (academics.length > 1) setAcademics(academics.filter((a) => a.id !== id));
  };
  const handleAcademicChange = (id: string, key: string, value: any) => {
    setAcademics(academics.map((a) => (a.id === id ? { ...a, [key]: value } : a)));
  };

  // Experience Grid Operations
  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now().toString(),
        company: "",
        designation: "",
        from: "",
        to: "",
        reason: "",
        file: null,
      },
    ]);
  };
  const handleRemoveExperience = (id: string) => {
    if (experiences.length > 1) setExperiences(experiences.filter((e) => e.id !== id));
  };
  const handleExperienceChange = (id: string, key: string, value: any) => {
    setExperiences(experiences.map((e) => (e.id === id ? { ...e, [key]: value } : e)));
  };

  const handleAddNominee = () => {
    setNominees([...nominees, { id: crypto.randomUUID(), name: "", relation: "", nidReg: "", contact: "" }]);
  };
  const handleRemoveNominee = (id: string) => {
    setNominees(nominees.filter((n) => n.id !== id));
  };
  const handleNomineeChange = (id: string, key: string, value: any) => {
    setNominees(nominees.map((n) => (n.id === id ? { ...n, [key]: value } : n)));
  };

  const handleSubmit = () => {
    if (!nameEng || !dob || !religion || !maritalStatus || !personalContact) {
      alert("Please fill in all required (*) fields.");
      return;
    }

    const saved = localStorage.getItem("recruitment_candidates");
    let parsed = saved ? JSON.parse(saved) : [];
    const newCandidate = {
      empIdTemp: search.tempId || `PAL${String(parsed.length + 1).padStart(6, "0")}`,
      nameEng,
      nameBng,
      doj: new Date().toISOString().split("T")[0],
      personalContact,
      personalEmail,
      department,
      designation,
      jobPost,
      reportingBoss,
      formStatus: "Filled",
      assessStatus: "IE Pending",
      dob,
      religion,
      maritalStatus,
      nidNumber,
      birthReg,
      fatherNameEng: fatherEng,
      fatherNameBng: fatherBng,
      motherNameEng: motherEng,
      motherNameBng: motherBng,
      emergencyContact,
      contactPerson,
      relationship,
      photo: photoPreview,
      presentAddress: fullPresentAddress,
      permanentAddress: fullPermanentAddress,
      academics,
      experiences,
      nominees,
    };

    if (search.tempId) {
      const idx = parsed.findIndex((c: any) => c.empIdTemp === search.tempId);
      if (idx !== -1) {
        parsed[idx] = { ...parsed[idx], ...newCandidate };
      } else {
        parsed.push(newCandidate);
      }
    } else {
      parsed.push(newCandidate);
    }

    localStorage.setItem("recruitment_candidates", JSON.stringify(parsed));
    alert("✅ Candidate registered successfully under Public e-Recruitment Portal!");
    router.navigate({ to: "/recruitment-basic-list" });
  };

  const handleReset = () => {
    setNameEng("");
    setNameBng("");
    setDob("");
    setReligion("");
    setMaritalStatus("");
    setNidNumber("");
    setBirthReg("");
    setFatherEng("");
    setFatherBng("");
    setMotherEng("");
    setMotherBng("");
    setPersonalContact("");
    setEmergencyContact("");
    setPersonalEmail("");
    setContactPerson("");
    setRelationship("");
    setPhotoPreview(null);
    setAcademics([]);
    setExperiences([]);
    setNominees([{ id: "1", name: "", relation: "", nidReg: "", contact: "" }]);
    setCopyAddress(false);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <FormSidebar activeSection={activeSection} setActiveSection={setActiveSection} completion={completion} />
      <main className="flex-1 min-w-0 flex flex-col relative h-screen overflow-y-auto">
        {/* Global Progress Bar */}
        <div className="sticky top-0 left-0 right-0 z-50 h-1.5 bg-muted/40 w-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-700 ease-out shadow-[0_0_10px_var(--primary)]"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
        
        <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full max-w-[1600px] mx-auto">

          {/* Topbar / Intro Card */}
          <div className="bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 shadow-xl shadow-primary/5 p-6 relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <div className="space-y-1.5 z-10 relative">
              <h2 className="text-xl font-extrabold tracking-tight text-primary">
                Employment Application Portal - <span className="text-foreground/70">{jobPost || designation || "Software Quality Assurance (QA) Engineer"}</span>
              </h2>
              <p className="text-xs text-muted-foreground font-medium max-w-3xl leading-relaxed">
                Please complete the application form below with your correct personal, contact,
                academic, and professional details. Fields marked with{" "}
                <span className="text-red-500 font-bold">*</span> are mandatory.
              </p>
            </div>
          </div>

          {activeSection === 'identity' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* AI NID OCR Scanner Widget */}
              <div className="bg-gradient-to-br from-card/80 to-primary/5 backdrop-blur-md border border-border/50 rounded-2xl p-5 md:p-6 shadow-xl shadow-primary/5 relative overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group">
                <div className="absolute top-0 right-0 p-3 opacity-[0.03] text-primary pointer-events-none">
                  <Cpu className="size-24" />
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="space-y-1.5 max-w-xl">

                    <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                      Autofill with Smart Document Scan
                    </h3>
                  </div>

                  {/* Control Panel */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowNidScannerModal(true)}
                      className="h-10 px-6 rounded-xl text-xs font-black shadow-lg bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                      <Scan className="size-4 group-hover:rotate-12 transition-transform" /> Open Smart
                      Scanner
                    </button>
                  </div>
                </div>
              </div>

              {/* ── SECTION 1: CANDIDATE IDENTITY ── */}
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl shadow-black/5 overflow-hidden hover:border-primary/20 transition-colors duration-500">
                <SectionHeader
                  icon={<User className="size-4" />}
                  title="Candidate Profile & Identity"
                  subtitle="Primary applicant identification and document credentials"
                />
                <div className="p-6 flex flex-col lg:flex-row gap-8">
                  {/* Photo Upload Zone */}
                  <div className="w-full lg:w-72 shrink-0 flex flex-col items-center gap-4 bg-muted/10 border border-border/60 rounded-lg p-5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-foreground/80">
                      Candidate Photo
                    </span>
                    <div
                      onClick={() => photoFileRef.current?.click()}
                      className="relative w-40 h-40 rounded-lg border-2 border-dashed border-border/85 hover:border-primary/50 bg-card hover:bg-muted/10 transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-center group"
                    >
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Candidate Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground/50 group-hover:text-primary/70 text-center p-3">
                          <Camera className="size-8 stroke-[1.5]" />
                          <span className="text-[9px] font-bold uppercase tracking-wider">
                            Upload Portrait
                          </span>
                          <span className="text-[8px] text-muted-foreground/60">Max 2MB (JPG/PNG)</span>
                        </div>
                      )}
                      {photoPreview && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">Replace Photo</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => photoFileRef.current?.click()}
                        className="flex-1 h-8 rounded-lg bg-card border border-border/85 text-[10px] font-bold text-foreground/80 hover:text-primary hover:border-primary/30 transition-all shadow-3xs"
                      >
                        Select File
                      </button>
                      {photoPreview && (
                        <button
                          type="button"
                          onClick={() => setPhotoPreview(null)}
                          className="h-8 px-3 rounded-lg bg-red-50 hover:bg-red-100 border border-red-150 text-red-600 transition-all"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      ref={photoFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </div>

                  {/* Identity Details Fields */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-5">
                    <FieldInput
                      label="Candidate Name (ENG)"
                      required
                      placeholder="John Doe"
                      value={nameEng}
                      onChange={(e) => setNameEng(e.target.value)}
                    />
                    <FieldInput
                      label="Candidate Name (BNG)"
                      placeholder="জন ডো"
                      value={nameBng}
                      onChange={(e) => setNameBng(e.target.value)}
                    />
                    <FieldInput
                      label="Date of Birth (DOB)"
                      required
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />

                    <FieldSelect
                      label="Religion"
                      required
                      value={religion}
                      onChange={setReligion}
                      options={religionOptions}
                    />
                    <FieldSelect
                      label="Marital Status"
                      required
                      value={maritalStatus}
                      onChange={setMaritalStatus}
                      options={maritalStatusOptions}
                    />
                    <FieldInput
                      label="NID Number"
                      placeholder="e.g. 5534XXXXXXXX"
                      value={nidNumber}
                      onChange={(e) => setNidNumber(e.target.value)}
                    />

                    <FieldInput
                      label="Birth Registration No"
                      placeholder="e.g. 199XXXXXXXXXXXXXX"
                      value={birthReg}
                      onChange={(e) => setBirthReg(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <FormBottomNav onNext={() => setActiveSection('family')} />
            </div>
          )}

          {activeSection === 'family' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* ── SECTION 2: FAMILY & PRIMARY CONTACT ── */}
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl shadow-black/5 overflow-hidden hover:border-primary/20 transition-colors duration-500">
                <SectionHeader
                  icon={<Contact2 className="size-4" />}
                  title="Family Details & Contacts"
                  subtitle="Parental information, personal contact details, and emergency references"
                />
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-5">
                  <FieldInput
                    label="Father Name (ENG)"
                    placeholder="Father's English Name"
                    value={fatherEng}
                    onChange={(e) => setFatherEng(e.target.value)}
                  />
                  <FieldInput
                    label="Father Name (BNG)"
                    placeholder="বাবার বাংলা নাম"
                    value={fatherBng}
                    onChange={(e) => setFatherBng(e.target.value)}
                  />
                  <FieldInput
                    label="Mother Name (ENG)"
                    placeholder="Mother's English Name"
                    value={motherEng}
                    onChange={(e) => setMotherEng(e.target.value)}
                  />

                  <FieldInput
                    label="Mother Name (BNG)"
                    placeholder="মায়ের বাংলা নাম"
                    value={motherBng}
                    onChange={(e) => setMotherBng(e.target.value)}
                  />
                  <FieldInput
                    label="Personal Contact No"
                    required
                    placeholder="e.g. 017XXXXXXXX"
                    value={personalContact}
                    onChange={(e) => setPersonalContact(e.target.value)}
                  />
                  <FieldInput
                    label="Emergency Contact No"
                    placeholder="Alternative contact number"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                  />

                  <FieldInput
                    label="Personal Email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={personalEmail}
                    onChange={(e) => setPersonalEmail(e.target.value)}
                  />
                  <FieldInput
                    label="Contact Person Name"
                    placeholder="Emergency reference name"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                  />
                  <FieldInput
                    label="Relationship"
                    placeholder="e.g. Brother, Wife"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                  />
                </div>
              </div>
              <FormBottomNav onPrev={() => setActiveSection('identity')} onNext={() => setActiveSection('address')} />
            </div>
          )}

          {activeSection === 'address' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* ── SECTION 3: ADDRESS ENROLLMENT ── */}
              {/* Present Address */}
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl shadow-black/5 overflow-hidden hover:border-primary/20 transition-colors duration-500">
                <SectionHeader
                  icon={<MapPin className="size-4" />}
                  title="Present Address"
                  subtitle="Current residential and mailing coordinates"
                />
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5">
                  <FieldSelect
                    label="Division"
                    value={presDivision}
                    onChange={setPresDivision}
                    options={divisionOptions}
                  />
                  <FieldSelect
                    label="District"
                    value={presDistrict}
                    onChange={setPresDistrict}
                    options={districtOptions}
                  />
                  <FieldSelect
                    label="Thana / Upazila"
                    value={presThana}
                    onChange={setPresThana}
                    options={thanaOptions}
                  />
                  <FieldSelect
                    label="Post Office"
                    value={presPostOffice}
                    onChange={setPresPostOffice}
                    options={postOfficeOptions}
                  />

                  <FieldInput
                    label="Village / House"
                    placeholder="e.g. House 35, Block D"
                    value={presVillage}
                    onChange={(e) => setPresVillage(e.target.value)}
                  />
                  <FieldInput
                    label="Road / Block"
                    placeholder="e.g. Road 12"
                    value={presRoad}
                    onChange={(e) => setPresRoad(e.target.value)}
                  />
                  <FieldSelect
                    label="Country"
                    value={presCountry}
                    onChange={setPresCountry}
                    options={countryOptions}
                  />

                  <div className="md:col-span-2 xl:col-span-4 flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                      Full Present Address
                    </label>
                    <div className="h-10 px-3 flex items-center bg-muted/40 rounded-xl border border-border/50 text-xs font-semibold text-foreground/80 overflow-hidden text-ellipsis whitespace-nowrap">
                      {fullPresentAddress ||
                        "Division, District, Thana, PO details auto-compiled here..."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Permanent Address */}
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl shadow-black/5 overflow-hidden hover:border-primary/20 transition-colors duration-500">
                <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border/50 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-card border border-border/80 text-primary shadow-2xs">
                      <MapPin className="size-4" />
                    </div>
                    <div>
                      <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest leading-none">
                        Permanent Address
                      </h2>
                      <p className="text-[10px] text-muted-foreground/75 mt-1">
                        Native / legal home address
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer bg-card hover:bg-muted border border-border/80 rounded-xl px-3.5 py-1.5 transition-all shadow-2xs">
                    <input
                      type="checkbox"
                      checked={copyAddress}
                      onChange={(e) => setCopyAddress(e.target.checked)}
                      className="size-3.5 accent-primary cursor-pointer rounded"
                    />
                    <span className="text-[10.5px] text-foreground font-bold whitespace-nowrap">
                      Same as Present Address
                    </span>
                  </label>
                </div>
                <div
                  className={`p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5 transition-opacity duration-300 ${copyAddress ? "opacity-45 pointer-events-none" : ""}`}
                >
                  <FieldSelect
                    label="Division"
                    value={permDivision}
                    onChange={setPermDivision}
                    options={divisionOptions}
                  />
                  <FieldSelect
                    label="District"
                    value={permDistrict}
                    onChange={setPermDistrict}
                    options={districtOptions}
                  />
                  <FieldSelect
                    label="Thana / Upazila"
                    value={permThana}
                    onChange={setPermThana}
                    options={thanaOptions}
                  />
                  <FieldSelect
                    label="Post Office"
                    value={permPostOffice}
                    onChange={setPermPostOffice}
                    options={postOfficeOptions}
                  />

                  <FieldInput
                    label="Village / House"
                    placeholder="e.g. Village/Para name"
                    value={permVillage}
                    onChange={(e) => setPermVillage(e.target.value)}
                  />
                  <FieldInput
                    label="Road / Block"
                    placeholder="e.g. Post Code/Word"
                    value={permRoad}
                    onChange={(e) => setPermRoad(e.target.value)}
                  />
                  <FieldSelect
                    label="Country"
                    value={permCountry}
                    onChange={setPermCountry}
                    options={countryOptions}
                  />

                  <div className="md:col-span-2 xl:col-span-4 flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                      Full Permanent Address
                    </label>
                    <div className="h-10 px-3 flex items-center bg-muted/40 rounded-xl border border-border/50 text-xs font-semibold text-foreground/80 overflow-hidden text-ellipsis whitespace-nowrap">
                      {fullPermanentAddress ||
                        "Division, District, Thana, PO details auto-compiled here..."}
                    </div>
                  </div>
                </div>
              </div>
              <FormBottomNav onPrev={() => setActiveSection('family')} onNext={() => setActiveSection('academics')} />
            </div>
          )}

          {activeSection === 'academics' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* ── SECTION 4: ACADEMIC CREDENTIALS ── */}
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl shadow-black/5 overflow-hidden hover:border-primary/20 transition-colors duration-500">
                <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border/50 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-card border border-border/80 text-primary shadow-2xs">
                      <GraduationCap className="size-4" />
                    </div>
                    <div>
                      <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest leading-none">
                        Academic Credentials &amp; Qualifications
                      </h2>
                      <p className="text-[10px] text-muted-foreground/75 mt-1">
                        Highest educational details, board examinations and certificates
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAcademic}
                    className="inline-flex items-center gap-1 bg-primary hover:opacity-95 text-primary-foreground text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-xs transition"
                  >
                    <Plus className="size-3.5" /> Add Row
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {academics.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-border/60 rounded-xl bg-muted/10">
                      <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 shadow-inner">
                        <GraduationCap className="size-8" />
                      </div>
                      <h3 className="text-sm font-extrabold text-foreground mb-1">No Academic Records</h3>
                      <p className="text-xs text-muted-foreground max-w-sm mb-5">
                        Add your highest educational degrees, diplomas, or certifications to boost your profile.
                      </p>
                      <button
                        type="button"
                        onClick={handleAddAcademic}
                        className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                      >
                        <Plus className="size-4" /> Add Academic Record
                      </button>
                    </div>
                  ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground/70 border-b border-border/30 bg-muted/20">
                          <th className="px-4 py-3">Degree / Exam Title</th>
                          <th className="px-4 py-3">Institution Name</th>
                          <th className="px-4 py-3 w-40">Passing Year</th>
                          <th className="px-4 py-3 w-40">Result / GPA</th>
                          <th className="px-4 py-3 w-64">Attachment (Optional)</th>
                          <th className="px-4 py-3 text-center w-16">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {academics.map((row) => (
                          <tr key={row.id} className="hover:bg-muted/10 transition-colors">
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                placeholder="e.g. SSC, HSC, Diploma"
                                value={row.title}
                                onChange={(e) => handleAcademicChange(row.id, "title", e.target.value)}
                                className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                placeholder="Board or School Name"
                                value={row.institution}
                                onChange={(e) =>
                                  handleAcademicChange(row.id, "institution", e.target.value)
                                }
                                className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                placeholder="YYYY"
                                value={row.year}
                                onChange={(e) => handleAcademicChange(row.id, "year", e.target.value)}
                                className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary font-mono"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                placeholder="e.g. 5.00 / First Div"
                                value={row.result}
                                onChange={(e) => handleAcademicChange(row.id, "result", e.target.value)}
                                className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary font-semibold"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <label className="flex-1 flex items-center justify-center gap-1.5 h-9 border border-dashed border-border/80 hover:border-primary/50 bg-background hover:bg-muted/20 rounded-lg text-[10px] font-bold text-muted-foreground cursor-pointer transition">
                                  <Upload className="size-3" />
                                  <span className="truncate">
                                    {row.file ? row.file.name : "Choose PDF/JPG"}
                                  </span>
                                  <input
                                    type="file"
                                    accept=".pdf,image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleAcademicChange(row.id, "file", file);
                                    }}
                                  />
                                </label>
                                {row.file && (
                                  <button
                                    type="button"
                                    onClick={() => handleAcademicChange(row.id, "file", null)}
                                    className="size-9 rounded-lg border border-red-200 bg-red-50 text-red-650 flex items-center justify-center hover:bg-red-100"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveAcademic(row.id)}
                                className="size-9 rounded-lg border border-border/40 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-muted-foreground transition"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  )}
                </div>
              </div>
              <FormBottomNav onPrev={() => setActiveSection('address')} onNext={() => setActiveSection('experience')} />
            </div>
          )}

          {activeSection === 'experience' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* ── SECTION 5: PRIOR JOB EXPERIENCE ── */}
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl shadow-black/5 overflow-hidden hover:border-primary/20 transition-colors duration-500">
                <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border/50 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-card border border-border/80 text-primary shadow-2xs">
                      <Briefcase className="size-4" />
                    </div>
                    <div>
                      <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest leading-none">
                        Prior Job Experience &amp; Career History
                      </h2>
                      <p className="text-[10px] text-muted-foreground/75 mt-1">
                        Previous employment history, designations and clearances
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="inline-flex items-center gap-1 bg-primary hover:opacity-95 text-primary-foreground text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-xs transition"
                  >
                    <Plus className="size-3.5" /> Add Row
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {experiences.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-border/60 rounded-xl bg-muted/10">
                      <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 shadow-inner">
                        <Briefcase className="size-8" />
                      </div>
                      <h3 className="text-sm font-extrabold text-foreground mb-1">No Experience Added</h3>
                      <p className="text-xs text-muted-foreground max-w-sm mb-5">
                        Include any past employment, internships, or relevant work history.
                      </p>
                      <button
                        type="button"
                        onClick={handleAddExperience}
                        className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                      >
                        <Plus className="size-4" /> Add Experience
                      </button>
                    </div>
                  ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground/70 border-b border-border/30 bg-muted/20">
                          <th className="px-4 py-3">Organization / Company</th>
                          <th className="px-4 py-3">Designation</th>
                          <th className="px-4 py-3 w-40">From Date</th>
                          <th className="px-4 py-3 w-40">To Date</th>
                          <th className="px-4 py-3">Reason for Leaving</th>
                          <th className="px-4 py-3 w-56">Attachment (Optional)</th>
                          <th className="px-4 py-3 text-center w-16">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {experiences.map((row) => (
                          <tr key={row.id} className="hover:bg-muted/10 transition-colors">
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                placeholder="Company Name"
                                value={row.company}
                                onChange={(e) =>
                                  handleExperienceChange(row.id, "company", e.target.value)
                                }
                                className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                placeholder="Job Title / Role"
                                value={row.designation}
                                onChange={(e) =>
                                  handleExperienceChange(row.id, "designation", e.target.value)
                                }
                                className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="date"
                                value={row.from}
                                onChange={(e) => handleExperienceChange(row.id, "from", e.target.value)}
                                className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary font-mono"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="date"
                                value={row.to}
                                onChange={(e) => handleExperienceChange(row.id, "to", e.target.value)}
                                className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary font-mono"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                placeholder="Reason for Resignation"
                                value={row.reason}
                                onChange={(e) =>
                                  handleExperienceChange(row.id, "reason", e.target.value)
                                }
                                className="h-9 w-full bg-background border border-border/60 rounded-lg px-3 text-xs outline-none focus:border-primary"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <label className="flex-1 flex items-center justify-center gap-1.5 h-9 border border-dashed border-border/80 hover:border-primary/50 bg-background hover:bg-muted/20 rounded-lg text-[10px] font-bold text-muted-foreground cursor-pointer transition">
                                  <Upload className="size-3" />
                                  <span className="truncate">
                                    {row.file ? row.file.name : "Experience Copy"}
                                  </span>
                                  <input
                                    type="file"
                                    accept=".pdf,image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleExperienceChange(row.id, "file", file);
                                    }}
                                  />
                                </label>
                                {row.file && (
                                  <button
                                    type="button"
                                    onClick={() => handleExperienceChange(row.id, "file", null)}
                                    className="size-9 rounded-lg border border-red-200 bg-red-50 text-red-650 flex items-center justify-center hover:bg-red-100"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveExperience(row.id)}
                                className="size-9 rounded-lg border border-border/40 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-muted-foreground transition"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  )}
                </div>
              </div>
              <FormBottomNav onPrev={() => setActiveSection('academics')} onNext={() => setActiveSection('nominee')} />
            </div>
          )}

          {activeSection === 'nominee' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* ── SECTION 6: NOMINEE DECLARATION ── */}
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl shadow-black/5 overflow-hidden hover:border-primary/20 transition-colors duration-500">
                <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border/50 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-card border border-border/80 text-primary shadow-2xs">
                      <Heart className="size-4" />
                    </div>
                    <div>
                      <h2 className="text-[11px] font-black text-foreground/70 uppercase tracking-widest leading-none">
                        Nominee Declaration Dossier
                      </h2>
                      <p className="text-[10px] text-muted-foreground/75 mt-1">
                        Declared legal nominee details for official allocations and benefits
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddNominee}
                    className="inline-flex items-center gap-1 bg-primary hover:opacity-95 text-primary-foreground text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-xs transition"
                  >
                    <Plus className="size-3.5" /> Add Nominee
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  {nominees.map((nominee, index) => (
                    <div key={nominee.id} className="relative p-5 border border-border/50 bg-muted/5 rounded-xl space-y-5 group transition-colors hover:border-primary/20 hover:bg-muted/10">
                      {nominees.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveNominee(nominee.id)}
                          className="absolute -top-3 -right-3 size-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-red-200 hover:bg-red-200"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                      
                      <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                        <div className="size-5 rounded-full bg-primary/10 text-primary text-[10px] font-black flex items-center justify-center">
                          {index + 1}
                        </div>
                        <h4 className="text-xs font-bold text-foreground">Nominee Details</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5">
                        <FieldInput
                          label="Nominee Full Name"
                          placeholder="Nominee's complete name"
                          value={nominee.name}
                          onChange={(e) => handleNomineeChange(nominee.id, "name", e.target.value)}
                        />
                        <FieldInput
                          label="Relation"
                          placeholder="e.g. Spouse, Mother, Son"
                          value={nominee.relation}
                          onChange={(e) => handleNomineeChange(nominee.id, "relation", e.target.value)}
                        />
                        <FieldInput
                          label="Nominee NID / Birth Reg"
                          placeholder="Identity credentials"
                          value={nominee.nidReg}
                          onChange={(e) => handleNomineeChange(nominee.id, "nidReg", e.target.value)}
                        />
                        <FieldInput
                          label="Nominee Contact No"
                          placeholder="Nominee's mobile number"
                          value={nominee.contact}
                          onChange={(e) => handleNomineeChange(nominee.id, "contact", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── SUBMIT BAR ────────────────────────── */}
              <div className="p-5 bg-card rounded-lg border border-border/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] text-muted-foreground font-semibold">
                  All <span className="text-red-500 font-bold">*</span> marked fields are required
                  before application submission.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveSection('experience')}
                    className="h-10 px-6 rounded-xl border border-border/80 bg-card text-sm font-bold text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="h-10 px-8 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground font-bold text-xs transition-all"
                  >
                    Reset Form
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="h-10 px-10 rounded-lg bg-primary text-primary-foreground font-black text-xs shadow-md hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  >
                    Submit Application Form
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'help' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl shadow-black/5 overflow-hidden">
                <SectionHeader
                  icon={<Info className="size-4" />}
                  title="Help & User Manual"
                  subtitle="Detailed instructions and explanations for filling out the e-Recruitment form"
                  action={
                    <div className="flex items-center gap-1 bg-card border border-border/80 rounded-lg p-1">
                      <button
                        onClick={() => setHelpLanguage('en')}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${helpLanguage === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => setHelpLanguage('bn')}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${helpLanguage === 'bn' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}
                      >
                        বাংলা
                      </button>
                    </div>
                  }
                />
                <div className="p-6 space-y-8">
                  {/* Comprehensive Manual Content */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Identity & Family */}
                    <div className="space-y-6">
                      <div className="bg-muted/10 p-5 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-muted/30 transition-colors">
                        <h3 className="text-sm font-extrabold text-primary border-b border-border/50 pb-3 mb-4 flex items-center gap-2">
                          <User className="size-4" /> 1. Candidate Identity
                        </h3>
                        <div className="space-y-3">
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Candidate Photo:</strong> {helpLanguage === 'bn' ? "আপনার একটি পাসপোর্ট সাইজ ছবি আপলোড করুন। আপনার মুখমণ্ডল যেন পরিষ্কার দেখা যায়। ছবির সাইজ ২ মেগাবাইটের (2MB) কম হতে হবে।" : "Click on the photo box to upload a recent passport-size picture of yourself. Make sure your face is clearly visible. The picture must be smaller than 2MB."}
                          </p>
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Candidate Name (English & Bengali):</strong> {helpLanguage === 'bn' ? "আপনার জাতীয় পরিচয়পত্রে (NID) যেভাবে নাম লেখা আছে, ঠিক সেভাবেই আপনার সম্পূর্ণ নাম লিখুন। এটি ইংরেজি এবং বাংলা উভয় ভাষায় লিখতে হবে।" : "Type your full name exactly as it is written on your National ID (NID). We need you to write it in both English and Bengali."}
                          </p>
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Date of Birth:</strong> {helpLanguage === 'bn' ? "বক্সে ক্লিক করে ক্যালেন্ডার থেকে আপনার সঠিক জন্মতারিখ (দিন, মাস ও বছর) নির্বাচন করুন।" : "Click the box to open a calendar and select the exact day, month, and year you were born."}
                          </p>
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Religion & Marital Status:</strong> {helpLanguage === 'bn' ? "ড্রপডাউন মেনু থেকে আপনার ধর্ম এবং বৈবাহিক অবস্থা (যেমন: ইসলাম, অবিবাহিত) নির্বাচন করুন।" : "Click the dropdown menus and choose the options that apply to you (e.g., Islam, Single)."}
                          </p>
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">NID Number & Birth Registration Number:</strong> {helpLanguage === 'bn' ? "আপনার ১০, ১৩, বা ১৭-সংখ্যার জাতীয় পরিচয়পত্র (NID) নম্বর দিতে হবে। যদি NID না থাকে, তবে আপনার জন্ম নিবন্ধন নম্বর দিন।" : "You must enter your 10, 13, or 17-digit National ID (NID) number. If you don't have an NID, enter your Birth Registration Number."}
                          </p>
                        </div>
                      </div>

                      <div className="bg-muted/10 p-5 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-muted/30 transition-colors">
                        <h3 className="text-sm font-extrabold text-primary border-b border-border/50 pb-3 mb-4 flex items-center gap-2">
                          <Contact2 className="size-4" /> 2. Family & Contact
                        </h3>
                        <div className="space-y-3">
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Parents' Names:</strong> {helpLanguage === 'bn' ? "আপনার পিতা এবং মাতার নাম লিখুন। নিজের নামের মতো এগুলোও ইংরেজি এবং বাংলা উভয় ভাষায় লিখতে হবে।" : "Type your Father's Name and Mother's Name. Like your own name, please write these in both English and Bengali."}
                          </p>
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Personal Contact No & Email Address:</strong> {helpLanguage === 'bn' ? "আপনার ব্যক্তিগত মোবাইল নম্বর এবং ইমেইল ঠিকানা দিন। এগুলো অবশ্যই চালু থাকতে হবে, কারণ আমরা আপনার সাথে যোগাযোগের জন্য এগুলো ব্যবহার করব!" : "Type your personal mobile phone number and your email address. Make sure these are active, because we will use them to contact you!"}
                          </p>
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Emergency Contact:</strong> {helpLanguage === 'bn' ? "জরুরি প্রয়োজনে আমরা কাকে কল করব? তার নাম, মোবাইল নম্বর এবং তার সাথে আপনার সম্পর্ক (যেমন: ভাই বা চাচা) লিখুন।" : "If there is an emergency, who should we call? Enter their Name, their Contact Number, and how they are related to you (for example, \"Brother\" or \"Uncle\")."}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-muted/10 p-5 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-muted/30 transition-colors">
                        <h3 className="text-sm font-extrabold text-primary border-b border-border/50 pb-3 mb-4 flex items-center gap-2">
                          <MapPin className="size-4" /> 3. Address Enrollment
                        </h3>
                        <div className="space-y-3">
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Present Address:</strong> {helpLanguage === 'bn' ? "বর্তমানে আপনি যেখানে বসবাস করছেন তার ঠিকানা। আপনার বিভাগ, জেলা, থানা এবং পোস্ট অফিস নির্বাচন করুন। এরপর আপনার বিস্তারিত ঠিকানা (যেমন: বাড়ির নম্বর, রাস্তা বা গ্রাম) লিখুন।" : "This is where you live right now. Fill in your Division, District, Thana, Post Office, and Country. Then, type your exact address details (like house number, road, or village)."}
                          </p>
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Permanent Address:</strong> {helpLanguage === 'bn' ? "এটি আপনার স্থায়ী ঠিকানা।" : "This is your permanent or home address."} <br/><br/>
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold text-[11px] inline-flex items-center gap-1">💡 {helpLanguage === 'bn' ? "শর্টকাট" : "Shortcut"}</span> {helpLanguage === 'bn' ? "যদি আপনার স্থায়ী এবং বর্তমান ঠিকানা একই হয়, তবে শুধু \"Same as Present Address\" সুইচটিতে ক্লিক করুন! এটি স্বয়ংক্রিয়ভাবে সব তথ্য কপি করে নেবে।" : "If your Permanent Address is exactly the same as your Present Address, just click the \"Same as Present Address\" switch! It will automatically copy everything for you."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Academics, Experience & Nominee */}
                    <div className="space-y-6">
                      <div className="bg-muted/10 p-5 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-muted/30 transition-colors">
                        <h3 className="text-sm font-extrabold text-primary border-b border-border/50 pb-3 mb-4 flex items-center gap-2">
                          <GraduationCap className="size-4" /> 4. Academic Credentials
                        </h3>
                        <div className="space-y-3">
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Education Details:</strong> {helpLanguage === 'bn' ? "আপনার শিক্ষাগত যোগ্যতার তথ্য দিন। আপনার ডিগ্রির নাম (যেমন: B.Sc বা HSC), প্রতিষ্ঠানের নাম (স্কুল বা বিশ্ববিদ্যালয়), পাসের বছর এবং ফলাফল (যেমন: GPA 4.00) লিখুন।" : "Tell us about your education. Type the name of your Degree (like B.Sc or HSC), the Institute Name (your school or university), your Passing Year, and your Result (like GPA 4.00)."}
                          </p>
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Upload Document:</strong> {helpLanguage === 'bn' ? "সার্টিফিকেট বা মার্কশিটের ছবি বা PDF আপলোড করতে বক্সে ক্লিক করুন।" : "You can click the upload box to attach a picture or PDF of your certificate or mark sheet."}
                          </p>
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Adding More Degrees:</strong> {helpLanguage === 'bn' ? <>একাধিক ডিগ্রি থাকলে, আপনার পরবর্তী ডিগ্রির তথ্য যোগ করার জন্য <span className="text-primary font-bold">"Add More"</span> বাটনে ক্লিক করুন!</> : <>Have more than one degree? Just click the <span className="text-primary font-bold">"Add More"</span> button to add another set of boxes for your next degree!</>}
                          </p>
                        </div>
                      </div>

                      <div className="bg-muted/10 p-5 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-muted/30 transition-colors">
                        <h3 className="text-sm font-extrabold text-primary border-b border-border/50 pb-3 mb-4 flex items-center gap-2">
                          <Briefcase className="size-4" /> 5. Prior Experience
                        </h3>
                        <div className="space-y-3">
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Job Details:</strong> {helpLanguage === 'bn' ? "যদি আপনার আগে কাজ করার অভিজ্ঞতা থাকে, তবে প্রতিষ্ঠানের নাম, আপনার পদবি এবং চাকরি ছাড়ার কারণ লিখুন।" : "If you have worked before, type the Organization Name (the company), your Designation (your job title), and the Reason for Leaving."}
                          </p>
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Employment Period:</strong> {helpLanguage === 'bn' ? "ক্যালেন্ডার ব্যবহার করে আপনি কবে চাকরি শুরু করেছিলেন (From) এবং কবে শেষ করেছিলেন (To) তা নির্বাচন করুন।" : "Use the calendars to select when you started the job (From) and when you finished (To)."}
                          </p>
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Adding More Jobs:</strong> {helpLanguage === 'bn' ? <>একাধিক জায়গায় কাজ করে থাকলে, আরও চাকরির তথ্য যোগ করতে <span className="text-primary font-bold">"Add Experience"</span> বাটনে ক্লিক করুন।</> : <>If you have worked at multiple places, click the <span className="text-primary font-bold">"Add Experience"</span> button to add more jobs to the list.</>}
                          </p>
                        </div>
                      </div>

                      <div className="bg-muted/10 p-5 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-muted/30 transition-colors">
                        <h3 className="text-sm font-extrabold text-primary border-b border-border/50 pb-3 mb-4 flex items-center gap-2">
                          <ShieldCheck className="size-4" /> 6. Nominee Declaration
                        </h3>
                        <div className="space-y-3">
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">What is a Nominee?:</strong> {helpLanguage === 'bn' ? "নমিনি হলেন সেই ব্যক্তি যিনি আপনার কোনো দুর্ঘটনা বা অবর্তমানে আপনার অফিশিয়াল কোম্পানির সুযোগ-সুবিধাগুলো গ্রহণ করবেন (সাধারণত স্বামী/স্ত্রী বা পিতা-মাতা)।" : "A nominee is a person who will receive your official company benefits if something happens to you (usually a husband, wife, or parent)."}
                          </p>
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Nominee Details:</strong> {helpLanguage === 'bn' ? "নমিনির সম্পূর্ণ নাম, তার সাথে আপনার সম্পর্ক, তার NID বা জন্ম নিবন্ধন নম্বর এবং মোবাইল নম্বর লিখুন।" : "Type their Full Name, their Relation to you, their NID or Birth Registration number, and their Contact Number."}
                          </p>
                          <p className="text-[12px] text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Adding Multiple Nominees:</strong> {helpLanguage === 'bn' ? <>আপনি চাইলে একাধিক ব্যক্তিকে নমিনি হিসেবে রাখতে পারেন! অন্য কাউকে যোগ করতে শুধু <span className="text-primary font-bold">"Add Nominee"</span> বাটনে ক্লিক করুন।</> : <>You can choose more than one person to be your nominee! Just click the <span className="text-primary font-bold">"Add Nominee"</span> button to add another person.</>}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-5 bg-primary/10 rounded-xl border border-primary/30 flex gap-4 items-start shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                        <CheckCircle2 className="size-6 text-primary mt-1 shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{helpLanguage === 'bn' ? 'জমা দেওয়ার জন্য প্রস্তুত?' : 'Ready to Submit?'}</h4>
                          <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                            {helpLanguage === 'bn' ? <>উপরের প্রগ্রেস বারটি লক্ষ্য করুন। ফর্ম জমা দেওয়ার আগে এটি অবশ্যই <strong className="text-foreground">100%</strong> হতে হবে। লাল তারকা (<span className="text-red-500 font-bold">*</span>) চিহ্ন দেওয়া ঘরগুলো অবশ্যই পূরণ করতে হবে, কারণ এগুলো বাধ্যতামূলক!</> : <>Look at the progress bar at the top of the page. It must reach <strong className="text-foreground">100%</strong> before you can submit. Make sure you have filled out all the boxes that have a red star (<span className="text-red-500 font-bold">*</span>) next to them, because those are mandatory!</>}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* AI NID OCR SCANNER MODAL OVERLAY */}
      {showNidOcrModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="bg-card border border-border/80 rounded-2xl shadow-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto flex flex-col gap-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/30 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                    AI NID OCR Extracted Information
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Review and verify the details extracted from the National ID card image.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNidOcrModal(false)}
                className="size-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body - Editable Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto max-h-[65vh] pr-1.5">
              {/* Left Column: Image Preview & Raw OCR Log */}
              <div className="lg:col-span-5 space-y-4">
                {nidFrontPreview ? (
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                      <Camera className="size-3.5 text-primary" /> Scanned Document Previews
                    </label>
                    <div className="flex flex-col gap-3">
                      <div className="border border-border/80 rounded-xl overflow-hidden bg-muted/20 relative aspect-video flex items-center justify-center p-1.5 shadow-sm">
                        <img
                          src={nidFrontPreview}
                          alt="Front Side"
                          className="object-contain max-h-32 w-full rounded-lg"
                        />
                      </div>
                      {nidBackPreview && (
                        <div className="border border-border/80 rounded-xl overflow-hidden bg-muted/20 relative aspect-video flex items-center justify-center p-1.5 shadow-sm">
                          <img
                            src={nidBackPreview}
                            alt="Back Side"
                            className="object-contain max-h-32 w-full rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-border/80 rounded-xl p-4 text-center text-[10px] text-muted-foreground bg-muted/10 space-y-2">
                    <div className="size-8 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto">
                      <Sparkles className="size-4" />
                    </div>
                    <span className="block font-bold">Mock Profiler Mode</span>
                    <span className="block text-[9px] text-muted-foreground/75">
                      Pre-populated simulation database loaded.
                    </span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                    <Cpu className="size-3.5 text-primary" /> Raw OCR Text Console
                  </label>
                  <textarea
                    readOnly
                    value={rawOcrText}
                    className="h-60 w-full p-2.5 rounded-xl bg-muted/40 border border-border/50 text-[9px] font-mono text-muted-foreground/80 resize-none focus:outline-none scrollbar-thin"
                    placeholder="Raw scanned text log will appear here..."
                  />
                </div>
              </div>

              {/* Right Column: Editable fields */}
              <div className="lg:col-span-7 space-y-6">
                {/* Category 1: Names & Identity */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary border-b border-border/20 pb-1">
                    1. Names & Identity Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Name (English)
                      </label>
                      <input
                        type="text"
                        value={extractedNid.nameEng}
                        onChange={(e) =>
                          setExtractedNid((prev) => ({ ...prev, nameEng: e.target.value }))
                        }
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Name (Bangla)
                      </label>
                      <input
                        type="text"
                        value={extractedNid.nameBng}
                        onChange={(e) =>
                          setExtractedNid((prev) => ({ ...prev, nameBng: e.target.value }))
                        }
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Father's Name (Bng)
                      </label>
                      <input
                        type="text"
                        value={extractedNid.fatherNameBng}
                        onChange={(e) =>
                          setExtractedNid((prev) => ({ ...prev, fatherNameBng: e.target.value }))
                        }
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Mother's Name (Bng)
                      </label>
                      <input
                        type="text"
                        value={extractedNid.motherNameBng}
                        onChange={(e) =>
                          setExtractedNid((prev) => ({ ...prev, motherNameBng: e.target.value }))
                        }
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Category 2: Legal Registry */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary border-b border-border/20 pb-1">
                    2. National Registry & Demographics
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        NID Number
                      </label>
                      <input
                        type="text"
                        value={extractedNid.nid}
                        onChange={(e) =>
                          setExtractedNid((prev) => ({ ...prev, nid: e.target.value }))
                        }
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={extractedNid.dob}
                        onChange={(e) =>
                          setExtractedNid((prev) => ({ ...prev, dob: e.target.value }))
                        }
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Gender
                      </label>
                      <select
                        value={extractedNid.gender}
                        onChange={(e) =>
                          setExtractedNid((prev) => ({ ...prev, gender: e.target.value }))
                        }
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Category 3: Address Mapping */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary border-b border-border/20 pb-1">
                    3. Address Coordinates
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        Village / Street (English)
                      </label>
                      <input
                        type="text"
                        value={extractedNid.presVillageEng}
                        onChange={(e) =>
                          setExtractedNid((prev) => ({ ...prev, presVillageEng: e.target.value }))
                        }
                        className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-border/30 pt-4 mt-2">
              <button
                type="button"
                onClick={() => setShowNidOcrModal(false)}
                className="h-10 px-5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted transition duration-200"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleAutofill}
                className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-xs font-black shadow-md hover:opacity-95 transition duration-200 flex items-center justify-center gap-1.5"
              >
                <Check className="size-4" /> Confirm & Autofill Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NID Scanner Modal */}
      {showNidScannerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => !isNidScanning && setShowNidScannerModal(false)}
          />
          <div className="relative w-full max-w-4xl bg-card border border-border/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <Scan className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                    Smart Document Scanner
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Upload both sides of the document for AI data extraction
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNidScannerModal(false)}
                disabled={isNidScanning}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 flex flex-col gap-8 bg-gradient-to-b from-transparent to-muted/10">
              {/* Document Type Selector */}
              {!isNidScanning && (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                    Step 1: Select Document Type
                  </span>
                  <select
                    className="h-11 px-4 rounded-xl bg-card border border-border/60 text-sm font-bold outline-none focus:border-primary shadow-xs min-w-[280px] text-center"
                    value={scanDocumentType}
                    onChange={(e) => setScanDocumentType(e.target.value)}
                  >
                    <option value="" disabled>
                      -- Select Document --
                    </option>
                    <option value="NID">National ID (NID)</option>
                    <option value="Passport">Passport</option>
                    <option value="Birth_Certificate">Birth Certificate</option>
                    <option value="Driving_License">Driving License</option>
                  </select>
                </div>
              )}

              {/* Upload Zones */}
              {scanDocumentType && !isNidScanning && (
                <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center justify-center mb-6">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                      Step 2: Upload Images
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Front Side Upload */}
                    <div
                      className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-200 ${nidFrontImage ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:border-primary/50 hover:bg-muted/30 cursor-pointer group"}`}
                      onClick={() =>
                        !nidFrontImage && document.getElementById("modal-front-input")?.click()
                      }
                    >
                      <input
                        type="file"
                        id="modal-front-input"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setNidFrontImage(f);
                            setNidFrontPreview(URL.createObjectURL(f));
                          }
                        }}
                      />
                      {nidFrontPreview ? (
                        <div className="relative w-full h-[140px] rounded-lg overflow-hidden shadow-sm">
                          <img
                            src={nidFrontPreview}
                            alt="Front Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setNidFrontImage(null);
                                setNidFrontPreview(null);
                              }}
                              className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-2"
                            >
                              <Trash2 className="size-3.5" /> Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="p-3 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform">
                            <Upload className="size-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">Front Side</p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Click to browse
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Back Side Upload */}
                    <div
                      className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-200 ${nidBackImage ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:border-primary/50 hover:bg-muted/30 cursor-pointer group"}`}
                      onClick={() =>
                        !nidBackImage && document.getElementById("modal-back-input")?.click()
                      }
                    >
                      <input
                        type="file"
                        id="modal-back-input"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setNidBackImage(f);
                            setNidBackPreview(URL.createObjectURL(f));
                          }
                        }}
                      />
                      {nidBackPreview ? (
                        <div className="relative w-full h-[140px] rounded-lg overflow-hidden shadow-sm">
                          <img
                            src={nidBackPreview}
                            alt="Back Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setNidBackImage(null);
                                setNidBackPreview(null);
                              }}
                              className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-2"
                            >
                              <Trash2 className="size-3.5" /> Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="p-3 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform">
                            <Upload className="size-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">Back Side</p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Click to browse
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}



          {/* Scanning Animation UI */}
              {isNidScanning && (
                <div className="flex flex-col items-center justify-center py-12 w-full animate-in zoom-in-95 duration-500">
                  <div className="relative w-full max-w-md mx-auto">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse scale-90" />
                    <div className="relative p-8 bg-card border border-primary/30 rounded-2xl shadow-[0_0_40px_rgba(var(--primary-glow),0.12)] flex flex-col items-center gap-6 text-center">
                      <div className="relative flex items-center justify-center size-28">
                        <svg
                          className="absolute inset-0 w-full h-full -rotate-90"
                          viewBox="0 0 100 100"
                        >
                          <circle
                            className="text-muted/20 stroke-current"
                            strokeWidth="5"
                            cx="50"
                            cy="50"
                            r="44"
                            fill="transparent"
                          />
                          <circle
                            className="text-primary stroke-current transition-all duration-300 ease-in-out"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray="276.46"
                            strokeDashoffset={276.46 - (276.46 * nidScanProgress) / 100}
                            cx="50"
                            cy="50"
                            r="44"
                            fill="transparent"
                          />
                        </svg>
                        <Cpu className="size-10 text-primary animate-pulse" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-black uppercase tracking-wider text-primary">
                          {nidScanStep === 1 && "Initializing AI Engine..."}
                          {nidScanStep === 2 && "Optimizing Images for Transfer..."}
                          {nidScanStep === 3 && "Running Deep-Learning OCR..."}
                          {nidScanStep === 4 && "Structuring Semantic Fields..."}
                        </h4>
                        <p className="text-xs font-bold text-muted-foreground mt-1.5">
                          {nidScanProgress}% Completed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border/50 bg-muted/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowNidScannerModal(false)}
                disabled={isNidScanning}
                className="h-10 px-6 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!scanDocumentType || !nidFrontImage || isNidScanning}
                onClick={handleRealNidUpload}
                className={`h-10 px-8 rounded-xl text-xs font-black shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${!scanDocumentType || !nidFrontImage || isNidScanning ? "bg-muted text-muted-foreground cursor-not-allowed opacity-70" : "bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98]"}`}
              >
                {isNidScanning ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" /> Start Scan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </TooltipProvider>
  );
}
