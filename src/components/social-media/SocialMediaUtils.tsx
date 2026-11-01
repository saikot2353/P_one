import React from "react";
import { Globe, Link2, ExternalLink } from "lucide-react";

export interface SocialMediaLink {
  id: string;
  platform: string;
  customPlatform?: string;
  url: string;
}

export const SUPPORTED_PLATFORMS = [
  "LinkedIn",
  "Facebook",
  "Instagram",
  "X (Twitter)",
  "YouTube",
  "WhatsApp",
  "Personal Website",
  "Other",
] as const;

export type SupportedPlatform = (typeof SUPPORTED_PLATFORMS)[number];

// Standard Brand Vectors for Pixel-Perfect Cross-Browser Rendering
export function LinkedInIcon({ className = "size-4 text-[#0A66C2]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export function FacebookIcon({ className = "size-4 text-[#1877F2]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "size-4 text-[#E4405F]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export function XTwitterIcon({ className = "size-4 text-foreground" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function YouTubeIcon({ className = "size-4 text-[#FF0000]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "size-4 text-[#25D366]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.35.06-.53.25-.19.19-.71.69-.71 1.69 0 1 .73 1.97.83 2.11.1.13 1.43 2.19 3.47 3.07.49.21.87.33 1.16.43.49.15.93.13 1.28.08.39-.06 1.2-.49 1.37-.96.17-.47.17-.88.12-.96-.05-.08-.19-.13-.39-.23-.2-.1-1.2-.59-1.38-.66-.19-.07-.32-.1-.46.1-.14.2-.53.66-.65.8-.12.14-.24.16-.44.06-.2-.1-.85-.31-1.63-1-.6-.54-1.01-1.2-1.13-1.4-.12-.2-.01-.31.09-.41.09-.09.2-.24.3-.35.1-.12.14-.2.21-.34.07-.13.03-.25-.02-.35-.05-.1-.46-1.11-.63-1.52-.17-.4-.34-.35-.46-.35z" />
    </svg>
  );
}

export function PersonalWebsiteIcon({ className = "size-4 text-sky-600" }: { className?: string }) {
  return <Globe className={className} />;
}

export function GenericLinkIcon({ className = "size-4 text-slate-500" }: { className?: string }) {
  return <Link2 className={className} />;
}

/**
 * Auto-maps platform name to its official brand icon or a generic link/globe fallback.
 */
export function SocialMediaIcon({
  platform,
  className = "size-4",
}: {
  platform: string;
  className?: string;
}) {
  const norm = (platform || "").trim().toLowerCase();

  if (norm.includes("linkedin")) {
    return <LinkedInIcon className={className} />;
  }
  if (norm.includes("facebook")) {
    return <FacebookIcon className={className} />;
  }
  if (norm.includes("instagram")) {
    return <InstagramIcon className={className} />;
  }
  if (norm === "x" || norm.includes("twitter") || norm.includes("x (twitter)")) {
    return <XTwitterIcon className={className} />;
  }
  if (norm.includes("youtube")) {
    return <YouTubeIcon className={className} />;
  }
  if (norm.includes("whatsapp")) {
    return <WhatsAppIcon className={className} />;
  }
  if (norm.includes("website") || norm.includes("personal website") || norm.includes("portfolio")) {
    return <PersonalWebsiteIcon className={className} />;
  }

  // For custom platforms or unsupported icons, display a generic link or globe icon.
  return <GenericLinkIcon className={className} />;
}

/**
 * Validates a social media profile/website URL.
 * - Must be a valid HTTP or HTTPS URL.
 * - Rejects unsafe schemes such as `javascript:`, `data:`, `vbscript:`, etc.
 */
export function validateSocialUrl(rawUrl: string): { isValid: boolean; error?: string } {
  if (!rawUrl || !rawUrl.trim()) {
    return { isValid: false, error: "Profile URL is required." };
  }

  const trimmed = rawUrl.trim();

  // Reject explicit unsafe URL schemes
  if (/^(javascript|data|vbscript|file|about):/i.test(trimmed)) {
    return { isValid: false, error: "Unsafe URL scheme detected. Only HTTP and HTTPS are permitted." };
  }

  // Check valid HTTP/HTTPS protocol
  if (!/^https?:\/\//i.test(trimmed)) {
    return {
      isValid: false,
      error: "URL must begin with http:// or https:// (e.g. https://linkedin.com/in/username).",
    };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { isValid: false, error: "Only HTTP and HTTPS URLs are allowed." };
    }
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      return { isValid: false, error: "Please enter a valid website domain." };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: "Invalid URL format. Please check the entered address." };
  }
}

/**
 * Validates a list of social media links.
 * Returns error messages keyed by link index or field.
 */
export function validateSocialMediaLinks(links: SocialMediaLink[]): {
  isValid: boolean;
  errors: Record<number, { platform?: string; customPlatform?: string; url?: string }>;
} {
  const errors: Record<number, { platform?: string; customPlatform?: string; url?: string }> = {};
  let isValid = true;

  links.forEach((link, idx) => {
    const rowErrors: { platform?: string; customPlatform?: string; url?: string } = {};

    const hasPlatform = Boolean(link.platform && link.platform.trim());
    const hasUrl = Boolean(link.url && link.url.trim());
    const hasCustomPlatform = Boolean(link.customPlatform && link.customPlatform.trim());

    // If row exists, prevent saving incomplete entry
    if (!hasPlatform && !hasUrl) {
      // completely blank row
      rowErrors.platform = "Please select a platform.";
      rowErrors.url = "Please enter a profile URL.";
      isValid = false;
    } else {
      if (!hasPlatform) {
        rowErrors.platform = "Please select a platform.";
        isValid = false;
      }

      if (link.platform === "Other" && !hasCustomPlatform) {
        rowErrors.customPlatform = "Please enter a custom platform name.";
        isValid = false;
      }

      if (!hasUrl) {
        rowErrors.url = "Please enter the profile URL.";
        isValid = false;
      } else {
        const urlValidation = validateSocialUrl(link.url);
        if (!urlValidation.isValid) {
          rowErrors.url = urlValidation.error;
          isValid = false;
        }
      }
    }

    if (Object.keys(rowErrors).length > 0) {
      errors[idx] = rowErrors;
    }
  });

  return { isValid, errors };
}

/**
 * Safely sanitizes external URLs to prevent XSS.
 */
export function getSafeExternalUrl(url?: string): string {
  if (!url) return "#";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return "#";
}

/**
 * Extracts a friendly display label from a URL (e.g. linkedin.com/in/john).
 */
export function getDisplayUrl(url: string): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/\/$/, "");
    return `${parsed.hostname}${path}`;
  } catch {
    return url.replace(/^https?:\/\//, "");
  }
}

/**
 * Returns the effective platform display name (handles "Other").
 */
export function getPlatformDisplayName(link: SocialMediaLink): string {
  if (link.platform === "Other" && link.customPlatform) {
    return link.customPlatform.trim();
  }
  return link.platform || "Social Link";
}
