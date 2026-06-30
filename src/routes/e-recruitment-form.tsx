import { useState, useRef } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
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
  Copy,
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

export const Route = createFileRoute("/e-recruitment-form")({
  component: ERecruitmentForm,
});

// ─── Reusable Field Components ───────────────────────────────────────────────

function FieldInput({
  label,
  required,
  readOnly,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  label: string;
  required?: boolean;
  readOnly?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        readOnly={readOnly}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`h-10 w-full rounded-xl border px-3 text-sm outline-none transition-all duration-200
          ${
            readOnly
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
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
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
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50 bg-muted/20">
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

// ─── Main Component ──────────────────────────────────────────────────────────

function ERecruitmentForm() {
  const router = useRouter();
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
  const [nameEng, setNameEng] = useState("");
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
  const [academics, setAcademics] = useState<any[]>([
    { id: "1", title: "", institution: "", year: "", result: "", file: null },
  ]);
  const [experiences, setExperiences] = useState<any[]>([
    { id: "1", company: "", designation: "", from: "", to: "", reason: "", file: null },
  ]);

  // Nominee Dossier States
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeRelation, setNomineeRelation] = useState("");
  const [nomineeNidReg, setNomineeNidReg] = useState("");
  const [nomineeContact, setNomineeContact] = useState("");

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

  const handleSubmit = () => {
    if (!nameEng || !dob || !religion || !maritalStatus || !personalContact) {
      alert("Please fill in all required (*) fields.");
      return;
    }

    const saved = localStorage.getItem("recruitment_candidates");
    const parsed = saved ? JSON.parse(saved) : [];
    const newCandidate = {
      empIdTemp: `PAL${String(parsed.length + 1).padStart(6, "0")}`,
      nameEng,
      nameBng,
      doj: new Date().toISOString().split("T")[0],
      personalContact,
      personalEmail,
      department: "RMG Operation",
      designation: "Operator",
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
      nominee: {
        name: nomineeName,
        relation: nomineeRelation,
        nidReg: nomineeNidReg,
        contact: nomineeContact,
      },
    };

    localStorage.setItem("recruitment_candidates", JSON.stringify([...parsed, newCandidate]));
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
    setAcademics([{ id: "1", title: "", institution: "", year: "", result: "", file: null }]);
    setExperiences([
      { id: "1", company: "", designation: "", from: "", to: "", reason: "", file: null },
    ]);
    setNomineeName("");
    setNomineeRelation("");
    setNomineeNidReg("");
    setNomineeContact("");
    setCopyAddress(false);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto w-full">
          {/* Breadcrumb & Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3" />
                <span>Recruitment</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">e-Recruitment Form</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <UserPlus className="size-5.5 text-primary" />
                <span>e-Recruitment Application Form</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-3 py-2 shadow-2xs">
              <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                Security Active (SSL Encrypted)
              </span>
            </div>
          </div>

          {/* Intro Card */}
          <div className="bg-card rounded-lg border border-border/80 p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <div className="space-y-1.5 z-10 relative">
              <h2 className="text-xl font-extrabold text-foreground tracking-tight text-primary">
                Employment Application Portal
              </h2>
              <p className="text-xs text-muted-foreground font-medium max-w-3xl leading-relaxed">
                Please complete the application form below with your correct personal, contact,
                academic, and professional details. Fields marked with{" "}
                <span className="text-red-500 font-bold">*</span> are mandatory.
              </p>
            </div>
          </div>

          {/* AI NID OCR Scanner Widget */}
          <div className="bg-card border border-border/80 rounded-xl p-5 md:p-6 shadow-xs relative overflow-hidden transition-all duration-300 hover:border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <div className="absolute top-0 right-0 p-3 opacity-[0.03] text-primary pointer-events-none">
              <Cpu className="size-24" />
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/20">
                  <Sparkles className="size-3" /> AI Smart Utility
                </div>
                <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                  Autofill with Smart Document Scan
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Upload a scanned copy or picture of your National ID, Passport, Birth Certificate,
                  or Driving License. Our smart AI extractor will instantly parse your name, parent
                  details, date of birth, document number, gender, and address so you don't have to
                  enter them manually.
                </p>
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
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
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

          {/* ── SECTION 2: FAMILY & PRIMARY CONTACT ── */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
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

          {/* ── SECTION 3: ADDRESS ENROLLMENT ── */}
          {/* Present Address */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
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
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
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
                <Copy className="size-3 text-muted-foreground" />
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

          {/* ── SECTION 4: ACADEMIC CREDENTIALS ── */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
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
                            disabled={academics.length === 1}
                            onClick={() => handleRemoveAcademic(row.id)}
                            className="size-9 rounded-lg border border-border/40 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-muted-foreground disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── SECTION 5: PRIOR JOB EXPERIENCE ── */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
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
                            disabled={experiences.length === 1}
                            onClick={() => handleRemoveExperience(row.id)}
                            className="size-9 rounded-lg border border-border/40 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-muted-foreground disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── SECTION 6: NOMINEE DECLARATION ── */}
          <div className="bg-card rounded-lg border border-border/80 shadow-2xs overflow-hidden">
            <SectionHeader
              icon={<Heart className="size-4" />}
              title="Nominee Declaration Dossier"
              subtitle="Declared legal nominee details for official allocations and benefits"
            />
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5">
              <FieldInput
                label="Nominee Full Name"
                placeholder="Nominee's complete name"
                value={nomineeName}
                onChange={(e) => setNomineeName(e.target.value)}
              />
              <FieldInput
                label="Relation"
                placeholder="e.g. Spouse, Mother, Son"
                value={nomineeRelation}
                onChange={(e) => setNomineeRelation(e.target.value)}
              />
              <FieldInput
                label="Nominee NID / Birth Reg"
                placeholder="Identity credentials"
                value={nomineeNidReg}
                onChange={(e) => setNomineeNidReg(e.target.value)}
              />
              <FieldInput
                label="Nominee Contact No"
                placeholder="Nominee's mobile number"
                value={nomineeContact}
                onChange={(e) => setNomineeContact(e.target.value)}
              />
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
  );
}
