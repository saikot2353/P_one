import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { QrCode, AlertCircle, Copy, Check } from "lucide-react";
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
  const [svgString, setSvgString] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!value) {
      setSvgString("");
      return;
    }

    let isMounted = true;
    QRCode.toString(
      value,
      {
        type: "svg",
        margin: 1,
        color: {
          dark: "#0f172a", // slate-900
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      },
      (err, svg) => {
        if (!isMounted) return;
        if (err) {
          console.error("QR Code generation error:", err);
          setError("Failed to generate QR code");
        } else {
          setSvgString(svg);
          setError(null);
        }
      },
    );

    return () => {
      isMounted = false;
    };
  }, [value]);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Public URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex flex-col items-center justify-center bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 p-4 text-center ${className}`}
      >
        <AlertCircle className="size-8 mb-2" />
        <span className="text-xs font-semibold">{error}</span>
      </div>
    );
  }

  if (!svgString) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl animate-pulse ${className}`}
      >
        <QrCode className="size-10 text-slate-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div
        className="rounded-2xl bg-white p-3 shadow-md border border-slate-100 flex items-center justify-center overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{ __html: svgString }}
      />

      {showCopyButton && (
        <button
          type="button"
          onClick={handleCopy}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
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
