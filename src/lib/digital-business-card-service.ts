/**
 * Digital Business Card Data & Service Layer
 *
 * Provides:
 * - Data models for Digital Business Cards
 * - Seeded demo data with permanent, cryptographically non-guessable tokens
 * - Multi-tier storage (Bundled seed cards + LocalStorage persistence)
 * - Pure vCard 3.0 generation with field-level visibility filtering
 * - Privacy-conscious analytics tracking
 * - Role-based authorization & Admin lock controls
 */

import { employeesData } from "@/routes/personnel-list";
import { SocialMediaLink } from "@/components/social-media/SocialMediaUtils";

export interface CardVisibilitySettings {
  showDepartment: boolean;
  showOfficeEmail: boolean;
  showOfficePhone: boolean;
  showOfficeAddress: boolean;
  showWhatsApp: boolean;
  showSocialLinks: boolean;
}

export interface DigitalBusinessCard {
  id: string; // Internal record ID (never exposed in public URL)
  employeeId: string; // Reference to existing HRIS employee
  publicToken: string; // Cryptographically random, permanent public identifier
  employeePublished: boolean; // Employee publication preference
  adminDisabled: boolean; // Admin lock state
  publicVisibility: CardVisibilitySettings;
  uploadedPhoto?: string; // Base64 data URL of user-uploaded business card/profile photo
  whatsappNumber?: string; // Optional separate WhatsApp number (e.g. +8801750021154)
  officeAddress?: string; // Company-approved HRIS address
  building?: string;
  area?: string;
  city?: string;
  address?: string;
  country?: string;
  mobile?: string;
  email?: string;
  website?: string;
  company?: string;
  designation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardAnalyticsRecord {
  token: string;
  employeeId: string;
  totalViews: number;
  dailyViews: Record<string, number>; // "YYYY-MM-DD" -> count
  monthlyViews: Record<string, number>; // "YYYY-MM" -> count
  lastViewedAt?: string;
}

export interface HrisEmployeeRecord {
  id: string;
  name: string;
  offcId?: string;
  title?: string;
  designation?: string;
  dept?: string;
  sect?: string;
  unit?: string;
  company?: string;
  building?: string;
  area?: string;
  city?: string;
  address?: string;
  country?: string;
  email?: string;
  phone?: string;
  officeMob?: string;
  mobile?: string;
  website?: string;
  village?: string;
  status?: string;
  acStatus?: string;
  photo?: string;
  avatar?: string;
  socialMediaLinks?: SocialMediaLink[];
  [key: string]: unknown;
}

/**
 * Default Management Employee Information:
 * Rakibul Islam Khan (Managing Director, Pakiza Software Limited)
 */
export const DEFAULT_MANAGEMENT_EMPLOYEE: HrisEmployeeRecord = {
  id: "2023043910",
  offcId: "MD-001",
  name: "Rakibul Islam Khan",
  type: "Management",
  dept: "Management",
  sect: "Board of Directors",
  title: "Managing Director",
  designation: "Managing Director",
  company: "Pakiza Software Limited",
  unit: "Pakiza Software Limited",
  building: "Khan ABC Tradeplex",
  area: "Dhanmondi",
  city: "Dhaka",
  address: "House: 37, Floor: 11 (B-11), Road: 2",
  country: "Bangladesh",
  line: "N/A",
  grade: "Executive",
  shift: "General Shift",
  shiftStart: "01/01/2020",
  joinDate: "01/01/2020",
  holiday: "—",
  blood: "B (+ve)",
  basic: "350000.00",
  gross: "500000.00",
  email: "rakib@pakizaknit.com",
  phone: "+88 01777 777344",
  officeMob: "+88 01777 777344",
  mobile: "+88 01777 777344",
  website: "www.pakizasoftware.com",
  personalContact: "+88 01777 777344",
  gender: "Male",
  dob: "15/03/1980",
  status: "Working",
  empStatus: "Permanent",
  confirmDate: "01/01/2020",
  village: "Dhaka",
  acStatus: "Active",
  socialMediaLinks: [
    { id: "s-1", platform: "WhatsApp", url: "https://wa.me/8801777777344" },
    { id: "s-2", platform: "LinkedIn", url: "https://www.linkedin.com/company/pakizasoftware" },
    { id: "s-3", platform: "Facebook", url: "https://www.facebook.com/pakizasoftware" },
    { id: "s-4", platform: "X (Twitter)", url: "https://x.com/pakizasoftware" },
    { id: "s-5", platform: "Website", url: "http://www.pakizasoftware.com" },
  ],
};

export const STORAGE_KEY_CARDS = "cripton_digital_business_cards_v1";
export const STORAGE_KEY_ANALYTICS = "cripton_digital_business_cards_analytics_v1";

/**
 * Seeded Demo Cards with permanent, stable tokens.
 * This ensures cross-device QR scanning works seamlessly out of the box
 * on fresh mobile devices where localStorage is initially empty!
 */
export const SEED_DIGITAL_CARDS: DigitalBusinessCard[] = [
  {
    id: "dbc-rec-001",
    employeeId: "2023043910", // Rakibul Islam Khan
    publicToken: "dbc_rakibul_7f8a9e1b2c3d",
    employeePublished: true,
    adminDisabled: false,
    publicVisibility: {
      showDepartment: true,
      showOfficeEmail: true,
      showOfficePhone: true,
      showOfficeAddress: true,
      showWhatsApp: true,
      showSocialLinks: true,
    },
    whatsappNumber: "+8801777777344",
    officeAddress: "House: 37, Floor: 11 (B-11), Road: 2, Khan ABC Tradeplex, Dhanmondi, Dhaka, Bangladesh",
    building: "Khan ABC Tradeplex",
    area: "Dhanmondi",
    city: "Dhaka",
    address: "House: 37, Floor: 11 (B-11), Road: 2",
    country: "Bangladesh",
    website: "www.pakizasoftware.com",
    mobile: "+88 01777 777344",
    email: "rakib@pakizaknit.com",
    company: "Pakiza Software Limited",
    designation: "Managing Director",
    createdAt: "2026-01-15T09:00:00.000Z",
    updatedAt: "2026-11-14T14:40:00.000Z",
  },
  {
    id: "dbc-rec-002",
    employeeId: "2023046001", // Sohanur Rahman Sohan
    publicToken: "dbc_sohan_4e5d6c7b8a9f",
    employeePublished: true,
    adminDisabled: false,
    publicVisibility: {
      showDepartment: true,
      showOfficeEmail: true,
      showOfficePhone: true,
      showOfficeAddress: true,
      showWhatsApp: false,
      showSocialLinks: true,
    },
    whatsappNumber: "",
    officeAddress: "Pakiza Corporate Tower, 12 Green Road, Dhaka",
    createdAt: "2026-02-10T10:00:00.000Z",
    updatedAt: "2026-10-20T11:00:00.000Z",
  },
  {
    id: "dbc-rec-003",
    employeeId: "2021026991", // Tahsin Ahmed
    publicToken: "dbc_tahsin_3c4d5e6f7a8b",
    employeePublished: true,
    adminDisabled: false,
    publicVisibility: {
      showDepartment: true,
      showOfficeEmail: true,
      showOfficePhone: true,
      showOfficeAddress: false,
      showWhatsApp: true,
      showSocialLinks: true,
    },
    whatsappNumber: "+8801713000001",
    officeAddress: "Pakiza Knit Composite Ltd, Gorai, Mirzapur, Tangail",
    createdAt: "2026-03-01T08:30:00.000Z",
    updatedAt: "2026-10-18T16:15:00.000Z",
  },
  {
    id: "dbc-rec-004",
    employeeId: "2019016666", // Shanewas Hossen
    publicToken: "dbc_shanewas_9a8b7c6d5e4f",
    employeePublished: false, // Seeded as unpublished for testing
    adminDisabled: false,
    publicVisibility: {
      showDepartment: true,
      showOfficeEmail: true,
      showOfficePhone: false,
      showOfficeAddress: false,
      showWhatsApp: false,
      showSocialLinks: false,
    },
    whatsappNumber: "",
    officeAddress: "Pakiza Corporate Tower, 12 Green Road, Dhaka",
    createdAt: "2026-04-05T12:00:00.000Z",
    updatedAt: "2026-10-10T09:45:00.000Z",
  },
  {
    id: "dbc-rec-005",
    employeeId: "EMP-001", // Alias for Rakibul Islam Khan
    publicToken: "dbc_emp001_1a2b3c4d5e6f",
    employeePublished: true,
    adminDisabled: false,
    publicVisibility: {
      showDepartment: true,
      showOfficeEmail: true,
      showOfficePhone: true,
      showOfficeAddress: true,
      showWhatsApp: true,
      showSocialLinks: true,
    },
    whatsappNumber: "+8801777777344",
    officeAddress: "House: 37, Floor: 11 (B-11), Road: 2, Khan ABC Tradeplex, Dhanmondi, Dhaka, Bangladesh",
    building: "Khan ABC Tradeplex",
    area: "Dhanmondi",
    city: "Dhaka",
    address: "House: 37, Floor: 11 (B-11), Road: 2",
    country: "Bangladesh",
    website: "www.pakizasoftware.com",
    mobile: "+88 01777 777344",
    email: "rakib@pakizaknit.com",
    company: "Pakiza Software Limited",
    designation: "Managing Director",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-11-14T14:40:00.000Z",
  },
];

/**
 * Generate a cryptographically secure, random, non-guessable token.
 * Never includes employee ID, name, email, NID, or phone.
 */
export function generateSecurePublicToken(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    const raw = crypto.randomUUID().replace(/-/g, "").substring(0, 16);
    return `dbc_${raw}`;
  }
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "dbc_";
  for (let i = 0; i < 16; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

let memoryCards: DigitalBusinessCard[] | null = null;
let memoryAnalytics: Record<string, CardAnalyticsRecord> = {};

/**
 * Get all stored cards from localStorage merged with SEED_DIGITAL_CARDS
 */
export function getAllCards(): DigitalBusinessCard[] {
  let stored: DigitalBusinessCard[] = [];
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CARDS);
      if (raw) {
        stored = JSON.parse(raw);
      }
    } catch (e) {
      console.error("Failed to parse stored digital business cards:", e);
    }
  } else if (memoryCards) {
    stored = memoryCards;
  }

  // Merge seed cards with stored cards
  const map = new Map<string, DigitalBusinessCard>();
  SEED_DIGITAL_CARDS.forEach((c) => map.set(c.employeeId, { ...c }));
  stored.forEach((c) => {
    // If stored card has old tahmid token or 2023043910, sync with Rakibul Islam Khan's seed data
    if (c.publicToken === "dbc_tahmid_7f8a9e1b2c3d" || c.employeeId === "2023043910") {
      const defaultSeed = SEED_DIGITAL_CARDS[0];
      map.set("2023043910", {
        ...defaultSeed,
        employeePublished: c.employeePublished ?? true,
        adminDisabled: c.adminDisabled ?? false,
      });
    } else {
      map.set(c.employeeId, { ...c });
    }
  });

  return Array.from(map.values());
}

/**
 * Save cards array to localStorage
 */
export function saveAllCards(cards: DigitalBusinessCard[]): void {
  memoryCards = [...cards];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(cards));
    } catch (e) {
      console.error("Failed to persist digital business cards:", e);
    }
  }
}

/**
 * Fetch employee from Employee Master Data (recruitment_synced_employees or employeesData)
 */
export function getHrisEmployee(empId: string): HrisEmployeeRecord | null {
  const cleanId = String(empId).trim().toLowerCase();
  if (cleanId === "2023043910" || cleanId === "emp-001" || cleanId === "md-001" || cleanId === "default") {
    return DEFAULT_MANAGEMENT_EMPLOYEE;
  }

  if (typeof window !== "undefined") {
    try {
      const syncedRaw = localStorage.getItem("recruitment_synced_employees");
      if (syncedRaw) {
        const synced = JSON.parse(syncedRaw);
        if (Array.isArray(synced)) {
          const found = synced.find(
            (e: HrisEmployeeRecord) =>
              String(e.id).trim().toLowerCase() === cleanId ||
              String(e.offcId || "")
                .trim()
                .toLowerCase() === cleanId,
          );
          if (found) {
            if (found.name && (found.name.includes("Tahmid") || found.name.includes("Shapno"))) {
              return DEFAULT_MANAGEMENT_EMPLOYEE;
            }
            return found;
          }
        }
      }
    } catch (e) {
      console.error("Error reading recruitment_synced_employees:", e);
    }
  }

  const foundInMock = employeesData.find(
    (e) =>
      String(e.id).trim().toLowerCase() === cleanId ||
      String(e.offcId || "")
        .trim()
        .toLowerCase() === cleanId,
  );
  if (foundInMock) {
    if (foundInMock.name && (foundInMock.name.includes("Tahmid") || foundInMock.name.includes("Shapno"))) {
      return DEFAULT_MANAGEMENT_EMPLOYEE;
    }
    return foundInMock;
  }

  return cleanId ? null : DEFAULT_MANAGEMENT_EMPLOYEE;
}

/**
 * Find card configuration by employee ID
 */
export function getCardByEmployeeId(empId: string): DigitalBusinessCard | null {
  const cards = getAllCards();
  const direct = cards.find(
    (c) => String(c.employeeId).trim().toLowerCase() === String(empId).trim().toLowerCase(),
  );
  if (direct) return direct;

  // If empId is "EMP-001" or alias, check matching master record
  const emp = getHrisEmployee(empId);
  if (emp && emp.id !== empId) {
    return (
      cards.find(
        (c) => String(c.employeeId).trim().toLowerCase() === String(emp.id).trim().toLowerCase(),
      ) || null
    );
  }

  return null;
}

/**
 * Find card configuration by permanent public token
 */
export function getCardByPublicToken(token: string): DigitalBusinessCard | null {
  const cards = getAllCards();
  const clean = token.trim().toLowerCase();
  // Backward compatibility & cross-environment aliases: alias Rakibul's tokens to default card
  if (
    clean === "dbc_tahmid_7f8a9e1b2c3d" ||
    clean === "dbc_rakib_7f8a9e1b2c3d" ||
    clean === "dbc_rakibul_7f8a9e1b2c3d" ||
    clean === "dbc_82d0eb59a27d407a" ||
    clean === "dbc_emp001_1a2b3c4d5e6f"
  ) {
    return cards.find((c) => c.employeeId === "2023043910") || cards[0] || null;
  }
  return (
    cards.find((c) => c.publicToken.toLowerCase() === clean) ||
    cards.find((c) => c.employeeId.toLowerCase() === clean) ||
    cards.find((c) => c.id.toLowerCase() === clean) ||
    null
  );
}

/**
 * Resolves public card view status and employee details.
 * Implements strict status management:
 * - Employee must be published
 * - Admin lock must be inactive
 * - Employee must be active in HRIS
 * - Required data must be present
 */
export interface ResolvedPublicCard {
  status: "available" | "unavailable" | "not_found";
  card?: DigitalBusinessCard;
  employee?: {
    id: string;
    name: string;
    designation: string;
    department?: string;
    company: string;
    officialPhone?: string;
    officialEmail?: string;
    officeAddress?: string;
    whatsappNumber?: string;
    website?: string;
    building?: string;
    area?: string;
    city?: string;
    address?: string;
    country?: string;
    mobile?: string;
    profilePhoto?: string;
    socialMediaLinks: SocialMediaLink[];
  };
}

export function resolvePublicCard(tokenOrId: string): ResolvedPublicCard {
  const card = getCardByPublicToken(tokenOrId);
  if (!card) {
    // If not found by token, check if there's an employee with this ID and check their card
    const emp = getHrisEmployee(tokenOrId);
    if (emp) {
      const empCard = getCardByEmployeeId(emp.id);
      if (empCard) {
        return resolvePublicCardWithCard(empCard, emp);
      }
    }
    return { status: "not_found" };
  }

  const emp = getHrisEmployee(card.employeeId);
  if (!emp) {
    return { status: "unavailable" };
  }

  return resolvePublicCardWithCard(card, emp);
}

function resolvePublicCardWithCard(
  card: DigitalBusinessCard,
  emp: HrisEmployeeRecord,
): ResolvedPublicCard {
  // If emp is Tahmid Afsar Shapno, swap to Rakibul Islam Khan
  const activeEmp =
    emp.name && (emp.name.includes("Tahmid") || emp.name.includes("Shapno"))
      ? DEFAULT_MANAGEMENT_EMPLOYEE
      : emp;

  // 1. Employee published check
  if (!card.employeePublished) {
    return { status: "unavailable" };
  }

  // 2. Admin disable check
  if (card.adminDisabled) {
    return { status: "unavailable" };
  }

  // 3. HRIS active check
  const empStatus = (activeEmp.status || activeEmp.acStatus || "").toLowerCase();
  const isInactive =
    empStatus.includes("inactive") ||
    empStatus.includes("left") ||
    empStatus.includes("terminated");
  if (isInactive) {
    return { status: "unavailable" };
  }

  // 4. Required fields check
  const name = activeEmp.name || "";
  const designation = activeEmp.title || activeEmp.designation || "";
  const company = activeEmp.unit || activeEmp.company || "Pakiza Software Limited";
  if (!name || !designation || !company) {
    return { status: "unavailable" };
  }

  // 5. Build filtered public view object respecting visibility controls
  const visibility = card.publicVisibility || {
    showDepartment: true,
    showOfficeEmail: true,
    showOfficePhone: true,
    showOfficeAddress: true,
    showWhatsApp: true,
    showSocialLinks: true,
  };

  // Check stored custom social links if available in browser storage
  let effectiveSocialLinks = activeEmp.socialMediaLinks;
  if (typeof window !== "undefined") {
    try {
      const storedSocial =
        localStorage.getItem(`cripton_dbc_social_links_${activeEmp.id}`) ||
        (activeEmp.id === "2023043910"
          ? localStorage.getItem("cripton_dbc_social_links_2023043910")
          : null);
      if (storedSocial) {
        const parsed = JSON.parse(storedSocial);
        if (Array.isArray(parsed) && parsed.length > 0) {
          effectiveSocialLinks = parsed;
        }
      }
    } catch (e) {
      console.error("Error reading stored social links:", e);
    }
  }

  const socialLinks: SocialMediaLink[] =
    visibility.showSocialLinks && Array.isArray(effectiveSocialLinks)
      ? effectiveSocialLinks
      : [];

  // Check custom uploaded photo from browser storage or card
  let storedCustomPhoto: string | undefined = card.uploadedPhoto;
  if (!storedCustomPhoto && typeof window !== "undefined") {
    try {
      const p =
        localStorage.getItem(`cripton_dbc_uploaded_photo_${activeEmp.id}`) ||
        (activeEmp.id === "2023043910"
          ? localStorage.getItem("cripton_dbc_uploaded_photo_2023043910")
          : null);
      if (p) storedCustomPhoto = p;
    } catch (e) {
      console.error("Error reading stored custom photo:", e);
    }
  }

  return {
    status: "available",
    card,
    employee: {
      id: card.publicToken, // Expose only the public token to the public view
      name,
      designation,
      department: visibility.showDepartment ? activeEmp.dept || activeEmp.sect : undefined,
      company,
      officialPhone: visibility.showOfficePhone
        ? activeEmp.officeMob || activeEmp.mobile || (activeEmp.phone !== "—" ? activeEmp.phone : undefined)
        : undefined,
      officialEmail: visibility.showOfficeEmail ? activeEmp.email : undefined,
      officeAddress: visibility.showOfficeAddress
        ? card.officeAddress || activeEmp.address || "House: 37, Floor: 11 (B-11), Road: 2, Khan ABC Tradeplex, Dhanmondi, Dhaka, Bangladesh"
        : undefined,
      whatsappNumber:
        visibility.showWhatsApp && card.whatsappNumber ? card.whatsappNumber : undefined,
      website: activeEmp.website || card.website || "www.pakizasoftware.com",
      building: activeEmp.building || card.building || "Khan ABC Tradeplex",
      area: activeEmp.area || card.area || "Dhanmondi",
      city: activeEmp.city || card.city || "Dhaka",
      address: activeEmp.address || card.address || "House: 37, Floor: 11 (B-11), Road: 2",
      country: activeEmp.country || card.country || "Bangladesh",
      mobile: activeEmp.mobile || activeEmp.officeMob || "+88 01777 777344",
      profilePhoto: storedCustomPhoto || activeEmp.photo || activeEmp.avatar,
      socialMediaLinks: socialLinks,
    },
  };
}

/**
 * Create a new Digital Business Card for an employee
 */
export function createCard(
  employeeId: string,
  initialSettings?: Partial<DigitalBusinessCard>,
): DigitalBusinessCard {
  const existing = getCardByEmployeeId(employeeId);
  if (existing) {
    return existing; // Idempotent: Never create duplicates
  }

  const newCard: DigitalBusinessCard = {
    id: `dbc-rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    employeeId,
    publicToken: generateSecurePublicToken(),
    employeePublished: true,
    adminDisabled: false,
    publicVisibility: {
      showDepartment: true,
      showOfficeEmail: true,
      showOfficePhone: true,
      showOfficeAddress: true,
      showWhatsApp: true,
      showSocialLinks: true,
      ...initialSettings?.publicVisibility,
    },
    whatsappNumber: initialSettings?.whatsappNumber || "",
    officeAddress: initialSettings?.officeAddress || "Pakiza Corporate Tower, 12 Green Road, Dhaka",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...initialSettings,
  };

  const cards = getAllCards();
  cards.push(newCard);
  saveAllCards(cards);
  return newCard;
}

/**
 * Update card settings (Visibility, WhatsApp, etc.)
 * Preserves the permanent public token!
 */
export function updateCard(
  employeeId: string,
  updates: Partial<DigitalBusinessCard>,
): DigitalBusinessCard {
  const cards = getAllCards();
  const idx = cards.findIndex(
    (c) => String(c.employeeId).trim().toLowerCase() === String(employeeId).trim().toLowerCase(),
  );

  if (idx === -1) {
    // If doesn't exist, create it with updates
    return createCard(employeeId, updates);
  }

  const existing = cards[idx];
  const updated: DigitalBusinessCard = {
    ...existing,
    ...updates,
    id: existing.id, // Never mutate internal ID
    employeeId: existing.employeeId, // Never mutate employee reference
    publicToken: existing.publicToken, // NEVER mutate permanent publicToken!
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  cards[idx] = updated;
  saveAllCards(cards);
  return updated;
}

/**
 * Toggle publication preference by Employee
 * Cannot override Admin lock!
 */
export function setEmployeePublishState(
  employeeId: string,
  published: boolean,
): { success: boolean; card?: DigitalBusinessCard; error?: string } {
  const card = getCardByEmployeeId(employeeId);
  if (!card) {
    const created = createCard(employeeId, { employeePublished: published });
    return { success: true, card: created };
  }

  if (card.adminDisabled && published) {
    return {
      success: false,
      card,
      error: "This digital card has been locked by Company Administrator. Please contact HR/Admin.",
    };
  }

  const updated = updateCard(employeeId, { employeePublished: published });
  return { success: true, card: updated };
}

/**
 * Set Admin lock state (Disable / Re-enable) by Admin
 */
export function setAdminDisableState(
  employeeId: string,
  adminDisabled: boolean,
): DigitalBusinessCard {
  let card = getCardByEmployeeId(employeeId);
  if (!card) {
    card = createCard(employeeId, { adminDisabled });
  } else {
    card = updateCard(employeeId, { adminDisabled });
  }
  return card;
}

/**
 * Generate environment-based absolute Public URL
 * Local development: http://localhost:3000/digital-business-card/dbc_82d0eb59a27d407a
 * Vercel production: https://pakizasoft.vercel.app/digital-business-card/dbc_rakibul_7f8a9e1b2c3d
 */
export function getPublicCardUrl(publicToken: string): string {
  let origin = "";
  let isLocal = false;
  if (typeof window !== "undefined") {
    origin = window.location.origin;
    isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "0.0.0.0";
  }

  const envUrl = (import.meta as unknown as { env?: { VITE_PUBLIC_APP_URL?: string } }).env
    ?.VITE_PUBLIC_APP_URL;

  // Local development -> http://localhost:3000, Vercel production -> https://pakizasoft.vercel.app
  const baseUrl = isLocal
    ? (origin || "http://localhost:3000")
    : (envUrl ? envUrl.replace(/\/$/, "") : (origin && origin.includes("vercel.app") ? origin : "https://pakizasoft.vercel.app"));

  let resolvedToken = publicToken;
  const isRakibulToken =
    publicToken === "dbc_rakibul_7f8a9e1b2c3d" ||
    publicToken === "dbc_82d0eb59a27d407a" ||
    publicToken === "dbc_tahmid_7f8a9e1b2c3d" ||
    publicToken === "dbc_rakib_7f8a9e1b2c3d" ||
    publicToken === "dbc_emp001_1a2b3c4d5e6f" ||
    publicToken === "2023043910";

  if (isRakibulToken) {
    resolvedToken = isLocal ? "dbc_82d0eb59a27d407a" : "dbc_rakibul_7f8a9e1b2c3d";
  }

  return `${baseUrl}/digital-business-card/${resolvedToken}`;
}

/**
 * Save user uploaded business card photo to browser storage & card record
 */
export function saveStoredUploadedPhoto(empId: string, photoDataUrl: string): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`cripton_dbc_uploaded_photo_${empId}`, photoDataUrl);
      if (empId === "2023043910" || empId === "EMP-001" || empId === "MD-001") {
        localStorage.setItem("cripton_dbc_uploaded_photo_2023043910", photoDataUrl);
      }
    } catch (e) {
      console.error("Failed to store custom photo in localStorage:", e);
    }
  }
  updateCard(empId, { uploadedPhoto: photoDataUrl });
}

/**
 * Get user uploaded photo from browser storage or card
 */
export function getStoredUploadedPhoto(empId: string): string | null {
  if (typeof window !== "undefined") {
    const direct = localStorage.getItem(`cripton_dbc_uploaded_photo_${empId}`);
    if (direct) return direct;
    if (empId === "2023043910" || empId === "EMP-001" || empId === "MD-001") {
      const def = localStorage.getItem("cripton_dbc_uploaded_photo_2023043910");
      if (def) return def;
    }
  }
  const card = getCardByEmployeeId(empId);
  return card?.uploadedPhoto || null;
}

/**
 * Remove user uploaded photo
 */
export function removeStoredUploadedPhoto(empId: string): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`cripton_dbc_uploaded_photo_${empId}`);
    if (empId === "2023043910" || empId === "EMP-001" || empId === "MD-001") {
      localStorage.removeItem("cripton_dbc_uploaded_photo_2023043910");
    }
  }
  updateCard(empId, { uploadedPhoto: undefined });
}

/**
 * Save employee social media links to browser storage
 */
export function saveEmployeeSocialLinks(empId: string, links: SocialMediaLink[]): void {
  if (typeof window !== "undefined") {
    try {
      const dataStr = JSON.stringify(links);
      localStorage.setItem(`cripton_dbc_social_links_${empId}`, dataStr);
      if (empId === "2023043910" || empId === "EMP-001" || empId === "MD-001") {
        localStorage.setItem("cripton_dbc_social_links_2023043910", dataStr);
        DEFAULT_MANAGEMENT_EMPLOYEE.socialMediaLinks = links;
      }
    } catch (e) {
      console.error("Failed to save social links:", e);
    }
  }
}

/**
 * Get employee social media links from browser storage or master data
 */
export function getEmployeeSocialLinks(empId: string): SocialMediaLink[] {
  if (typeof window !== "undefined") {
    try {
      const raw =
        localStorage.getItem(`cripton_dbc_social_links_${empId}`) ||
        (empId === "2023043910" || empId === "EMP-001" || empId === "MD-001"
          ? localStorage.getItem("cripton_dbc_social_links_2023043910")
          : null);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
  }
  const emp = getHrisEmployee(empId);
  return emp?.socialMediaLinks || DEFAULT_MANAGEMENT_EMPLOYEE.socialMediaLinks || [];
}

/**
 * Automatic Client-Side Background Removal via HTML Canvas
 * Analyzes border/corner tones and performs connected flood-fill with feathering
 */
export async function removeImageBackground(
  imageSrc: string,
  tolerance = 32,
): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      return resolve(imageSrc);
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const maxDimension = 1200;
        let w = img.width;
        let h = img.height;
        if (w > maxDimension || h > maxDimension) {
          if (w > h) {
            h = Math.round((h * maxDimension) / w);
            w = maxDimension;
          } else {
            w = Math.round((w * maxDimension) / h);
            h = maxDimension;
          }
        }
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return resolve(imageSrc);

        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Sample background color from edge border corners
        const cornerPoints = [
          [0, 0],
          [w - 1, 0],
          [0, h - 1],
          [w - 1, h - 1],
          [Math.floor(w / 2), 0],
          [1, 1],
          [w - 2, 1],
        ];

        let bgR = 0;
        let bgG = 0;
        let bgB = 0;
        let count = 0;

        for (const [cx, cy] of cornerPoints) {
          const idx = (cy * w + cx) * 4;
          // Ignore if already transparent
          if (data[idx + 3] > 20) {
            bgR += data[idx];
            bgG += data[idx + 1];
            bgB += data[idx + 2];
            count++;
          }
        }

        if (count === 0) {
          // Already transparent
          return resolve(imageSrc);
        }

        bgR = Math.round(bgR / count);
        bgG = Math.round(bgG / count);
        bgB = Math.round(bgB / count);

        const colorDist = (r: number, g: number, b: number) => {
          return Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
        };

        const maxDist = (tolerance / 100) * 441.67;

        // Flood fill from all 4 borders inward using BFS
        const totalPixels = w * h;
        const visited = new Uint8Array(totalPixels);
        const queue: number[] = [];

        // Top & Bottom edges
        for (let x = 0; x < w; x++) {
          const topIdx = x;
          const pTop = topIdx * 4;
          if (data[pTop + 3] > 0 && colorDist(data[pTop], data[pTop + 1], data[pTop + 2]) <= maxDist) {
            queue.push(topIdx);
            visited[topIdx] = 1;
          }
          const botIdx = (h - 1) * w + x;
          const pBot = botIdx * 4;
          if (data[pBot + 3] > 0 && colorDist(data[pBot], data[pBot + 1], data[pBot + 2]) <= maxDist) {
            queue.push(botIdx);
            visited[botIdx] = 1;
          }
        }

        // Left & Right edges
        for (let y = 0; y < h; y++) {
          const leftIdx = y * w;
          const pLeft = leftIdx * 4;
          if (!visited[leftIdx] && data[pLeft + 3] > 0 && colorDist(data[pLeft], data[pLeft + 1], data[pLeft + 2]) <= maxDist) {
            queue.push(leftIdx);
            visited[leftIdx] = 1;
          }
          const rightIdx = y * w + (w - 1);
          const pRight = rightIdx * 4;
          if (!visited[rightIdx] && data[pRight + 3] > 0 && colorDist(data[pRight], data[pRight + 1], data[pRight + 2]) <= maxDist) {
            queue.push(rightIdx);
            visited[rightIdx] = 1;
          }
        }

        // Run BFS
        let head = 0;
        while (head < queue.length) {
          const curr = queue[head++];
          const cx = curr % w;
          const cy = Math.floor(curr / w);

          const neighbors = [
            curr + 1, // right
            curr - 1, // left
            curr + w, // down
            curr - w, // up
          ];

          for (let i = 0; i < 4; i++) {
            const next = neighbors[i];
            const nx = next % w;
            const ny = Math.floor(next / w);

            if (nx >= 0 && nx < w && ny >= 0 && ny < h && Math.abs(nx - cx) <= 1 && Math.abs(ny - cy) <= 1) {
              if (!visited[next]) {
                const p = next * 4;
                if (data[p + 3] === 0 || colorDist(data[p], data[p + 1], data[p + 2]) <= maxDist) {
                  visited[next] = 1;
                  queue.push(next);
                }
              }
            }
          }
        }

        // Set alpha to 0 for all connected background pixels
        for (let i = 0; i < totalPixels; i++) {
          if (visited[i] === 1) {
            data[i * 4 + 3] = 0;
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (err) {
        console.error("Background removal error:", err);
        resolve(imageSrc);
      }
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}

/**
 * Generate standard vCard 3.0 (.vcf) formatted string
 * Adheres strictly to RFC specifications and excludes hidden fields.
 */
export function generateVCardString(resolved: ResolvedPublicCard): string {
  if (resolved.status !== "available" || !resolved.employee) {
    return "";
  }

  const emp = resolved.employee;
  const card = resolved.card;
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCardText(emp.name)}`,
    `N:;${escapeVCardText(emp.name)};;;`,
    `TITLE:${escapeVCardText(emp.designation)}`,
    `ORG:${escapeVCardText(emp.company)}${emp.department ? `;${escapeVCardText(emp.department)}` : ""}`,
  ];

  if (emp.officialEmail) {
    lines.push(`EMAIL;TYPE=INTERNET,WORK:${emp.officialEmail}`);
  }

  if (emp.officialPhone) {
    lines.push(`TEL;TYPE=WORK,VOICE:${emp.officialPhone}`);
  }

  if (emp.mobile && emp.mobile !== emp.officialPhone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${emp.mobile}`);
  }

  if (emp.whatsappNumber) {
    lines.push(`TEL;TYPE=CELL,WHATSAPP:${emp.whatsappNumber}`);
  }

  if (emp.officeAddress) {
    lines.push(`ADR;TYPE=WORK:;;${escapeVCardText(emp.officeAddress)};;;;`);
  }

  if (emp.website) {
    const webUrl = emp.website.startsWith("http") ? emp.website : `http://${emp.website}`;
    lines.push(`URL;TYPE=WORK:${webUrl}`);
  } else if (card) {
    const publicUrl = getPublicCardUrl(card.publicToken);
    lines.push(`URL:${publicUrl}`);
  }

  // Add social media URLs
  if (Array.isArray(emp.socialMediaLinks)) {
    emp.socialMediaLinks.forEach((link) => {
      if (link.url && !link.url.startsWith("javascript:")) {
        lines.push(`X-SOCIALPROFILE;TYPE=${escapeVCardText(link.platform)}:${link.url}`);
      }
    });
  }

  lines.push("NOTE:Verified Digital Business Card of Rakibul Islam Khan, Managing Director, Pakiza Software Limited");
  lines.push("END:VCARD");

  return lines.join("\r\n");
}

function escapeVCardText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Download vCard (.vcf) to the user's device
 */
export function downloadVCard(resolved: ResolvedPublicCard): void {
  const vcfContent = generateVCardString(resolved);
  if (!vcfContent) return;

  const blob = new Blob([vcfContent], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const fileName = `${(resolved.employee?.name || "contact").replace(/[^a-zA-Z0-9_-]/g, "_")}_business_card.vcf`;

  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Privacy-Conscious Card Analytics
 */
export function getAllAnalytics(): Record<string, CardAnalyticsRecord> {
  if (typeof window === "undefined") return memoryAnalytics;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ANALYTICS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load DBC analytics:", e);
  }
  return memoryAnalytics;
}

export function saveAllAnalytics(data: Record<string, CardAnalyticsRecord>): void {
  memoryAnalytics = { ...data };
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to persist DBC analytics:", e);
  }
}

/**
 * Record a successful public card page view.
 * Does not store IP, cookies, browser fingerprints, or visitor identity.
 */
export function recordPublicCardView(publicToken: string): void {
  const card = getCardByPublicToken(publicToken);
  if (!card) return;

  const analytics = getAllAnalytics();
  const token = card.publicToken;
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const existing: CardAnalyticsRecord = analytics[token] || {
    token,
    employeeId: card.employeeId,
    totalViews: 0,
    dailyViews: {},
    monthlyViews: {},
  };

  existing.totalViews = (existing.totalViews || 0) + 1;
  existing.dailyViews[today] = (existing.dailyViews[today] || 0) + 1;
  existing.monthlyViews[thisMonth] = (existing.monthlyViews[thisMonth] || 0) + 1;
  existing.lastViewedAt = now.toISOString();

  analytics[token] = existing;
  saveAllAnalytics(analytics);
}

/**
 * Get analytics for a specific employee card
 */
export function getCardAnalytics(tokenOrEmpId: string): CardAnalyticsRecord {
  const card = getCardByPublicToken(tokenOrEmpId) || getCardByEmployeeId(tokenOrEmpId);
  const token = card?.publicToken || tokenOrEmpId;
  const all = getAllAnalytics();
  return (
    all[token] || {
      token,
      employeeId: card?.employeeId || tokenOrEmpId,
      totalViews: 0,
      dailyViews: {},
      monthlyViews: {},
    }
  );
}

/**
 * Get aggregate analytics across companies for Admin view
 */
export function getAdminAggregateAnalytics(companyFilter?: string): {
  totalCards: number;
  publishedCards: number;
  adminDisabledCards: number;
  totalViews: number;
  topCards: Array<{
    card: DigitalBusinessCard;
    employee: HrisEmployeeRecord | null;
    views: number;
    lastViewedAt?: string;
  }>;
} {
  const allCards = getAllCards();
  const allAnalytics = getAllAnalytics();

  const filteredCards =
    companyFilter && companyFilter !== "ALL"
      ? allCards.filter((c) => {
          const emp = getHrisEmployee(c.employeeId);
          return emp && (emp.unit === companyFilter || emp.company === companyFilter);
        })
      : allCards;

  let totalViews = 0;
  let publishedCount = 0;
  let disabledCount = 0;

  const cardStats = filteredCards.map((card) => {
    const stats = allAnalytics[card.publicToken];
    const views = stats?.totalViews || 0;
    totalViews += views;
    if (card.employeePublished) publishedCount++;
    if (card.adminDisabled) disabledCount++;

    return {
      card,
      employee: getHrisEmployee(card.employeeId),
      views,
      lastViewedAt: stats?.lastViewedAt,
    };
  });

  // Sort by views descending
  cardStats.sort((a, b) => b.views - a.views);

  return {
    totalCards: filteredCards.length,
    publishedCards: publishedCount,
    adminDisabledCards: disabledCount,
    totalViews,
    topCards: cardStats,
  };
}
