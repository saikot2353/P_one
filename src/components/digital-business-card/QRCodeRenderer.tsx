import { useState } from "react";
import { AlertCircle, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface QRCodeRendererProps {
  value: string;
  size?: number;
  className?: string;
  showCopyButton?: boolean;
}

export function QRCodeRenderer({
  value,
  size = 200,
  className = "",
  showCopyButton = false,
}: QRCodeRendererProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Public URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const qrUrl = value
    ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&margin=1`
    : "";

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div
        className="rounded-2xl bg-white p-3 shadow-md border border-slate-100 flex items-center justify-center overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
        style={{ width: size, height: size }}
      >
        {qrUrl ? (
          <img
            src={qrUrl}
            alt="QR Code"
            className="w-full h-full object-contain"
            loading="lazy"
          />
        ) : (
          <svg viewBox="0 0 29 29" className="size-full text-slate-800">
            <path d="M0,0 h7 v7 h-7 z M1,1 h5 v5 h-5 z M2,2 h3 v3 h-3 z" fill="currentColor" />
            <path d="M22,0 h7 v7 h-7 z M23,1 h5 v5 h-5 z M24,2 h3 v3 h-3 z" fill="currentColor" />
            <path d="M0,22 h7 v7 h-7 z M1,23 h5 v5 h-5 z M2,24 h3 v3 h-3 z" fill="currentColor" />
            <path d="M22,22 h5 v5 h-5 z M23,23 h3 v3 h-3 z" fill="currentColor" />
            <path d="M8,6 h13 M6,8 v13" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1,1" />
            <path d="M9,0 h2 v2 h-2 z M13,0 h1 v3 h-1 z M16,1 h3 v1 h-3 z M20,2 h1 v2 h-1 z" fill="currentColor" />
            <path d="M8,9 h3 v1 h-3 z M12,8 h2 v3 h-2 z M16,9 h1 v2 h-1 z M19,8 h2 v2 h-2 z" fill="currentColor" />
            <path d="M9,13 h1 v2 h-1 z M11,12 h3 v1 h-3 z M15,14 h3 v1 h-3 z M19,12 h1 v3 h-1 z" fill="currentColor" />
            <path d="M8,17 h2 v1 h-2 z M11,16 h1 v3 h-1 z M13,18 h2 v1 h-2 z M17,16 h3 v2 h-3 z" fill="currentColor" />
          </svg>
        )}
      </div>

      {showCopyButton && (
        <button
          type="button"
          onClick={handleCopy}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-600" />
          ) : (
            <Copy className="size-3.5 text-slate-500" />
          )}
          <span>{copied ? "Copied!" : "Copy Public URL"}</span>
        </button>
      )}
    </div>
  );
}
