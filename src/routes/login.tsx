import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import clientLogo from "../components/dashboard/client_logo.png";
import {
  Eye, EyeOff, Lock, Mail, User, Building2, LayoutGrid,
  ChevronRight, ChevronDown, Shield, ArrowRight, Check, Fingerprint,
  Zap, Users, BarChart3, Globe, Cpu, Target, Search, Sun, Moon
} from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "CRIPTON HRIS — Sign In" },
      { name: "description", content: "Sign in to your CRIPTON HRIS account to access workforce intelligence." },
    ],
  }),
  component: LoginPage,
});

/* ─────────── Theme Types ─────────── */
type Theme = "dark" | "light";

/* ─────────── Aurora Canvas Background ─────────── */
function AuroraCanvas({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const isDark = themeRef.current === "dark";
      time += 0.003;

      ctx.clearRect(0, 0, w, h);

      // Base fill
      ctx.fillStyle = isDark ? "#06081a" : "#e8edf8";
      ctx.fillRect(0, 0, w, h);

      // Aurora ribbons
      for (let ribbon = 0; ribbon < 5; ribbon++) {
        ctx.beginPath();
        const baseY = h * (0.2 + ribbon * 0.15);
        const amplitude = 40 + ribbon * 20;
        const speed = time * (0.8 + ribbon * 0.2);

        ctx.moveTo(0, baseY);
        for (let x = 0; x <= w; x += 3) {
          const y =
            baseY +
            Math.sin(x * 0.004 + speed) * amplitude +
            Math.sin(x * 0.007 + speed * 1.3) * (amplitude * 0.5) +
            Math.cos(x * 0.002 + speed * 0.7) * (amplitude * 0.3);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const hue = isDark ? 190 + ribbon * 10 : 190 + ribbon * 8;
        const gradient = ctx.createLinearGradient(0, baseY - amplitude, 0, h);
        if (isDark) {
          gradient.addColorStop(0, `hsla(${hue}, 85%, 65%, 0)`);
          gradient.addColorStop(0.1, `hsla(${hue}, 85%, 55%, ${0.08 - ribbon * 0.01})`);
          gradient.addColorStop(0.3, `hsla(${hue}, 90%, 45%, ${0.06 - ribbon * 0.008})`);
          gradient.addColorStop(1, `hsla(${hue}, 85%, 30%, 0)`);
        } else {
          gradient.addColorStop(0, `hsla(${hue}, 70%, 70%, 0)`);
          gradient.addColorStop(0.1, `hsla(${hue}, 70%, 65%, ${0.12 - ribbon * 0.015})`);
          gradient.addColorStop(0.3, `hsla(${hue}, 75%, 55%, ${0.08 - ribbon * 0.01})`);
          gradient.addColorStop(1, `hsla(${hue}, 70%, 50%, 0)`);
        }
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Bright core streaks
      for (let s = 0; s < 3; s++) {
        ctx.beginPath();
        const baseY = h * (0.3 + s * 0.18);
        const speed = time * (1.2 + s * 0.3);

        for (let x = 0; x <= w; x += 2) {
          const y =
            baseY +
            Math.sin(x * 0.005 + speed) * 30 +
            Math.cos(x * 0.008 + speed * 1.5) * 15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const streakHue = isDark ? 195 + s * 12 : 195 + s * 10;
        const streakAlpha = isDark ? 0.15 - s * 0.03 : 0.2 - s * 0.04;
        ctx.strokeStyle = `hsla(${streakHue}, 100%, ${isDark ? 75 : 60}%, ${streakAlpha})`;
        ctx.lineWidth = 2 - s * 0.5;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsla(${streakHue}, 100%, 70%, ${isDark ? 0.3 : 0.15})`;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Floating light dust particles (aurora embers)
      const numParticles = 25;
      for (let i = 0; i < numParticles; i++) {
        const px = ((i * 197.3 + time * 15) % w);
        const py = (h * 0.9 - ((i * 37.7 + time * 30) % (h * 0.8)));
        const opacity = Math.sin((py / h) * Math.PI) * (isDark ? 0.08 : 0.15) * (0.6 + 0.4 * Math.sin(time * 2 + i));
        const r = 1 + (i % 2.5);
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = isDark 
          ? `rgba(100, 180, 255, ${opacity})`
          : `rgba(29, 78, 216, ${opacity})`;
        ctx.fill();
      }

      // Stars (dark mode only)
      if (isDark) {
        for (let i = 0; i < 80; i++) {
          const sx = ((i * 137.5) % w);
          const sy = ((i * 97.3) % (h * 0.6));
          const flicker = 0.3 + Math.sin(time * 2 + i) * 0.3;
          const size = 0.5 + (i % 3) * 0.5;
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 220, 255, ${flicker})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}

/* ─────────── Floating Geometric Shape ─────────── */
function FloatingShape({ type, size, x, y, delay, duration }: {
  type: "hexagon" | "diamond" | "circle" | "triangle";
  size: number; x: string; y: string; delay: number; duration: number;
}) {
  const shapes: Record<string, string> = {
    hexagon: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
    diamond: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    circle: "circle(50%)",
    triangle: "polygon(50% 0%, 100% 100%, 0% 100%)",
  };

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x, top: y, width: size, height: size,
        clipPath: shapes[type],
        border: "1px solid var(--l-shape-border)",
        background: "var(--l-shape-fill)",
        animation: `floatShape ${duration}s ease-in-out ${delay}s infinite`,
        backdropFilter: "blur(2px)",
      }}
    />
  );
}

/* ─────────── Animated Typing Text ─────────── */
function TypeWriter({ texts }: { texts: string[] }) {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex <= currentText.length) {
      timeout = setTimeout(() => {
        setDisplay(currentText.slice(0, charIndex));
        setCharIndex((c) => c + 1);
      }, 60 + Math.random() * 40);
    } else if (!isDeleting && charIndex > currentText.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setCharIndex((c) => c - 1);
        setDisplay(currentText.slice(0, charIndex - 1));
      }, 30);
    } else {
      setIsDeleting(false);
      setTextIndex((i) => (i + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts]);

  return (
    <span>
      {display}
      <span
        className="inline-block w-[2px] h-[1em] ml-0.5 align-text-bottom"
        style={{
          background: "linear-gradient(180deg, var(--l-accent-solid), var(--l-icon-active))",
          animation: "blink 1s step-end infinite",
        }}
      />
    </span>
  );
}

/* ─────────── Animated Stat Counter ─────────── */
function AnimatedCounter({ end, suffix, label, delay }: {
  end: number; suffix: string; label: string; delay: number;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const step = end / 40;
    const interval = setInterval(() => {
      setCount((c) => {
        if (c + step >= end) { clearInterval(interval); return end; }
        return c + step;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [started, end]);

  return (
    <div className="text-center" style={{ animation: `fadeInUp 0.6s ease-out ${delay}ms both` }}>
      <div
        className="text-2xl font-black"
        style={{
          background: "linear-gradient(135deg, #1d4ed8, #00b4d8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {Math.round(count).toLocaleString()}{suffix}
      </div>
      <div className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: "var(--l-stat-label)" }}>
        {label}
      </div>
    </div>
  );
}

/* ─────────── Pulsing Ring Logo ─────────── */
function PulsingLogo({ size = 48 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-2xl"
        style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", animation: "pulseRing 2.5s ease-in-out infinite", opacity: 0.2 }}
      />
      <div
        className="absolute inset-0 rounded-2xl"
        style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", animation: "pulseRing 2.5s ease-in-out 0.5s infinite", opacity: 0.1 }}
      />
      <div
        className="relative w-full h-full rounded-2xl flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1d4ed8, #0b3c95)",
          boxShadow: "0 8px 32px rgba(29, 78, 216, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        <Shield className="text-white" style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={2.2} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)" }} />
      </div>
    </div>
  );
}

/* ─────────── Theme Toggle Button ─────────── */
function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute top-6 right-6 z-50 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 group"
      style={{
        background: "var(--l-toggle-bg)",
        border: "1px solid var(--l-toggle-border)",
        boxShadow: "var(--l-toggle-shadow)",
        backdropFilter: "blur(12px)",
      }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      id="theme-toggle-btn"
    >
      <div className="relative w-5 h-5">
        <Sun
          className="absolute inset-0 w-5 h-5 transition-all duration-500"
          style={{
            color: "#f59e0b",
            opacity: theme === "light" ? 1 : 0,
            transform: theme === "light" ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)",
          }}
        />
        <Moon
          className="absolute inset-0 w-5 h-5 transition-all duration-500"
          style={{
            color: "#a5b4fc",
            opacity: theme === "dark" ? 1 : 0,
            transform: theme === "dark" ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.5)",
          }}
        />
      </div>
    </button>
  );
}

/* ─────────── Glass Searchable Dropdown ─────────── */
interface DropdownItem {
  id: string;
  name: string;
  description: string;
  gradient: string;
  renderIcon: () => React.ReactNode;
}

function GlassSearchDropdown({
  label, icon, placeholder, triggerPlaceholder, value, onChange, items, id, className = "",
}: {
  label: string; icon: React.ReactNode; placeholder: string; triggerPlaceholder: string;
  value: string | null; onChange: (value: string) => void; items: DropdownItem[]; id: string; className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter(
    (item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase())
  );
  const selectedItem = items.find((i) => i.id === value);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) { setOpen(false); setSearch(""); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);

  return (
    <div className={`mb-5 ${className}`} ref={containerRef} id={id}>
      <div className="flex items-center gap-2 mb-2.5">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--l-label)" }}>{label}</span>
      </div>

      <button
        type="button"
        onClick={() => { setOpen(!open); setSearch(""); }}
        className="login-glass-input w-full rounded-2xl flex items-center gap-3 px-4 py-3.5 text-left group"
        style={{
          borderColor: open ? "var(--l-focus-border)" : undefined,
          boxShadow: open ? "var(--l-focus-shadow)" : undefined,
          background: open ? "var(--l-input-focus-bg)" : undefined,
        }}
      >
        {selectedItem ? (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: selectedItem.gradient }}>{selectedItem.renderIcon()}</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate" style={{ color: "var(--l-text)" }}>{selectedItem.name}</p>
              <p className="text-[10px] truncate" style={{ color: "var(--l-muted)" }}>{selectedItem.description}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 flex-1">
            <Search className="w-4 h-4" style={{ color: "var(--l-icon-muted)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--l-placeholder)" }}>{triggerPlaceholder}</span>
          </div>
        )}
        <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform duration-300" style={{ color: "var(--l-icon-muted)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>

      {open && (
        <div
          className="mt-2 rounded-2xl overflow-hidden relative z-50"
          style={{
            background: "var(--l-dropdown-bg)", border: "1px solid var(--l-dropdown-border)",
            boxShadow: "var(--l-dropdown-shadow)", backdropFilter: "blur(24px)",
            animation: "dropdownOpen 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="flex items-center gap-2.5 px-4 py-3" style={{ borderBottom: "1px solid var(--l-divider)" }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: "var(--l-accent)" }} />
            <input
              ref={inputRef} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={placeholder}
              className="w-full bg-transparent outline-none text-sm font-medium"
              style={{ color: "var(--l-text)", caretColor: "var(--l-accent)" }}
            />
            {search && (
              <button type="button" onClick={() => setSearch("")}
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                style={{ color: "var(--l-muted)", background: "var(--l-clear-bg)" }}>Clear</button>
            )}
          </div>
          <div className="overflow-y-auto p-1.5" style={{ maxHeight: 220 }}>
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-xs font-medium" style={{ color: "var(--l-muted)" }}>No results found</div>
            ) : (
              filtered.map((item, idx) => (
                <button
                  key={item.id} type="button"
                  onClick={() => { onChange(item.id); setOpen(false); setSearch(""); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                  style={{
                    background: value === item.id ? "var(--l-selected-bg)" : "transparent",
                    animation: `fadeInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.03}s both`,
                  }}
                  onMouseEnter={(e) => { if (value !== item.id) e.currentTarget.style.background = "var(--l-hover-bg)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = value === item.id ? "var(--l-selected-bg)" : "transparent"; }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: item.gradient, boxShadow: value === item.id ? "0 4px 14px rgba(79, 110, 247, 0.2)" : "none" }}>
                    {item.renderIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold truncate" style={{ color: "var(--l-text)" }}>{item.name}</p>
                    <p className="text-[10px] truncate" style={{ color: "var(--l-muted)" }}>{item.description}</p>
                  </div>
                  {value === item.id && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 2px 6px rgba(16, 185, 129, 0.3)", animation: "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════ MAIN LOGIN PAGE ═══════════ */
function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setTransitioning(true);
    setTimeout(() => { setStep(2); setTransitioning(false); }, 500);
  }, [email, password]);

  const handleContinue = useCallback(async () => {
    if (!selectedCompany || !selectedSection) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsLoading(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("cripton_logged_in", "true");
    }
    navigate({ to: "/" });
  }, [selectedCompany, selectedSection, navigate]);

  const companies = [
    { id: "cripton-bd", name: "Cripton Group", location: "Dhaka, Bangladesh", employees: "2,450", gradient: "linear-gradient(135deg, #1d4ed8, #3b82f6)" },
    { id: "cripton-intl", name: "Cripton International", location: "Singapore", employees: "890", gradient: "linear-gradient(135deg, #0e7490, #0891b2)" },
    { id: "cripton-tech", name: "Cripton Technologies", location: "Chittagong, BD", employees: "1,120", gradient: "linear-gradient(135deg, #2563eb, #1e40af)" },
  ];

  const sections = [
    { id: "hr", name: "Human Resources", icon: Users, desc: "Personnel & payroll", gradient: "linear-gradient(135deg, #2563eb, #1e40af)" },
    { id: "admin", name: "Administration", icon: Cpu, desc: "System & policies", gradient: "linear-gradient(135deg, #6366f1, #4338ca)" },
    { id: "finance", name: "Finance & Accounts", icon: BarChart3, desc: "Budget & compensation", gradient: "linear-gradient(135deg, #0891b2, #0e7490)" },
    { id: "operations", name: "Operations", icon: Zap, desc: "Factory & workforce", gradient: "linear-gradient(135deg, #d97706, #b45309)" },
    { id: "it", name: "IT Department", icon: Globe, desc: "Infrastructure & support", gradient: "linear-gradient(135deg, #059669, #047857)" },
    { id: "recruitment", name: "Recruitment", icon: Target, desc: "Talent acquisition", gradient: "linear-gradient(135deg, #dc2626, #b91c1c)" },
  ];

  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{ background: "var(--l-page-bg)", transition: "background 0.5s ease" }}
      data-theme={theme}
    >
      {/* ── Theme CSS Variables + Keyframes ── */}
      <style>{`
        /* ═══ DARK THEME ═══ */
        [data-theme="dark"] {
          --l-page-bg: #06081a;
          --l-panel-bg: #06081a;
          --l-edge-fade: #06081a;
          --l-card-bg: rgba(12, 15, 40, 0.8);
          --l-card-border-gradient: conic-gradient(from var(--angle, 0deg), #1d4ed8, #3b82f6, #00b4d8, #1d4ed8);
          --l-text: rgba(230, 240, 255, 0.9);
          --l-text-heading: rgba(240, 245, 255, 0.95);
          --l-text-subtitle: rgba(160, 180, 220, 0.5);
          --l-label: rgba(160, 180, 220, 0.45);
          --l-muted: rgba(160, 180, 220, 0.4);
          --l-placeholder: rgba(160, 180, 220, 0.35);
          --l-icon-muted: rgba(160, 180, 220, 0.3);
          --l-icon-active: #3b82f6;
          --l-accent: rgba(59, 130, 246, 0.6);
          --l-accent-solid: #3b82f6;
          --l-input-bg: rgba(255, 255, 255, 0.03);
          --l-input-border: rgba(255, 255, 255, 0.07);
          --l-input-focus-bg: rgba(255, 255, 255, 0.06);
          --l-focus-border: rgba(59, 130, 246, 0.5);
          --l-focus-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08), 0 0 30px rgba(59, 130, 246, 0.06);
          --l-icon-glow: drop-shadow(0 0 6px rgba(59, 130, 246, 0.4));
          --l-divider: rgba(255, 255, 255, 0.04);
          --l-badge-dot: rgba(59, 130, 246, 0.5);
          --l-badge-text: rgba(160, 180, 220, 0.3);
          --l-checkbox-border: rgba(255,255,255,0.1);
          --l-checkbox-bg: rgba(255,255,255,0.03);
          --l-forgot-color: rgba(59, 130, 246, 0.7);
          --l-back-color: rgba(59, 130, 246, 0.6);
          --l-spinner-track: rgba(255,255,255,0.15);
          --l-spinner-head: #fff;
          --l-step-inactive: rgba(255, 255, 255, 0.08);
          --l-footer-color: rgba(160, 180, 220, 0.2);
          --l-step2-note: rgba(160, 180, 220, 0.25);
          --l-shape-border: rgba(59, 130, 246, 0.15);
          --l-shape-fill: linear-gradient(135deg, rgba(59, 130, 246, 0.06), rgba(6, 182, 212, 0.03));
          --l-stat-label: rgba(180, 200, 255, 0.5);
          --l-left-brand-sub: rgba(160, 180, 255, 0.7);
          --l-left-body: rgba(180, 200, 255, 0.55);
          --l-radial-glow: radial-gradient(circle, rgba(59, 130, 246, 0.06), transparent 70%);
          --l-blob1: radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent 70%);
          --l-blob2: radial-gradient(circle, rgba(6, 182, 212, 0.2), transparent 70%);
          --l-dropdown-bg: rgba(14, 17, 45, 0.95);
          --l-dropdown-border: rgba(255, 255, 255, 0.08);
          --l-dropdown-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.03);
          --l-selected-bg: rgba(59, 130, 246, 0.1);
          --l-hover-bg: rgba(255, 255, 255, 0.04);
          --l-clear-bg: rgba(255,255,255,0.04);
          --l-toggle-bg: rgba(255, 255, 255, 0.05);
          --l-toggle-border: rgba(255, 255, 255, 0.08);
          --l-toggle-shadow: 0 2px 12px rgba(0,0,0,0.2);
          --l-fingerprint-bg: rgba(59, 130, 246, 0.1);
          --l-secure-text: rgba(160, 180, 255, 0.4);
        }

        /* ═══ LIGHT THEME ═══ */
        [data-theme="light"] {
          --l-page-bg: #f0f2f8;
          --l-panel-bg: #f0f2f8;
          --l-edge-fade: #e8edf8;
          --l-card-bg: rgba(255, 255, 255, 0.75);
          --l-card-border-gradient: conic-gradient(from var(--angle, 0deg), #1d4ed8, #3b82f6, #00b4d8, #1d4ed8);
          --l-text: rgba(15, 23, 42, 0.9);
          --l-text-heading: rgba(15, 23, 42, 0.95);
          --l-text-subtitle: rgba(71, 85, 105, 0.7);
          --l-label: rgba(71, 85, 105, 0.6);
          --l-muted: rgba(100, 116, 139, 0.6);
          --l-placeholder: rgba(100, 116, 139, 0.45);
          --l-icon-muted: rgba(100, 116, 139, 0.4);
          --l-icon-active: #1d4ed8;
          --l-accent: rgba(29, 78, 216, 0.7);
          --l-accent-solid: #1d4ed8;
          --l-input-bg: rgba(255, 255, 255, 0.6);
          --l-input-border: rgba(100, 116, 139, 0.15);
          --l-input-focus-bg: rgba(255, 255, 255, 0.8);
          --l-focus-border: rgba(29, 78, 216, 0.45);
          --l-focus-shadow: 0 0 0 4px rgba(29, 78, 216, 0.08), 0 0 20px rgba(29, 78, 216, 0.05);
          --l-icon-glow: drop-shadow(0 0 4px rgba(29, 78, 216, 0.25));
          --l-divider: rgba(100, 116, 139, 0.08);
          --l-badge-dot: rgba(29, 78, 216, 0.45);
          --l-badge-text: rgba(100, 116, 139, 0.45);
          --l-checkbox-border: rgba(100, 116, 139, 0.2);
          --l-checkbox-bg: rgba(255,255,255,0.5);
          --l-forgot-color: rgba(29, 78, 216, 0.8);
          --l-back-color: rgba(29, 78, 216, 0.7);
          --l-spinner-track: rgba(255,255,255,0.3);
          --l-spinner-head: #fff;
          --l-step-inactive: rgba(100, 116, 139, 0.12);
          --l-footer-color: rgba(100, 116, 139, 0.35);
          --l-step2-note: rgba(100, 116, 139, 0.4);
          --l-shape-border: rgba(29, 78, 216, 0.12);
          --l-shape-fill: linear-gradient(135deg, rgba(29, 78, 216, 0.06), rgba(6, 182, 212, 0.04));
          --l-stat-label: rgba(71, 85, 105, 0.5);
          --l-left-brand-sub: rgba(29, 78, 216, 0.6);
          --l-left-body: rgba(71, 85, 105, 0.6);
          --l-radial-glow: radial-gradient(circle, rgba(29, 78, 216, 0.04), transparent 70%);
          --l-blob1: radial-gradient(circle, rgba(29, 78, 216, 0.15), transparent 70%);
          --l-blob2: radial-gradient(circle, rgba(6, 182, 212, 0.15), transparent 70%);
          --l-dropdown-bg: rgba(255, 255, 255, 0.95);
          --l-dropdown-border: rgba(100, 116, 139, 0.12);
          --l-dropdown-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(100,116,139,0.05);
          --l-selected-bg: rgba(29, 78, 216, 0.08);
          --l-hover-bg: rgba(29, 78, 216, 0.04);
          --l-clear-bg: rgba(100,116,139,0.06);
          --l-toggle-bg: rgba(255, 255, 255, 0.7);
          --l-toggle-border: rgba(100, 116, 139, 0.12);
          --l-toggle-shadow: 0 2px 12px rgba(0,0,0,0.06);
          --l-fingerprint-bg: rgba(29, 78, 216, 0.08);
          --l-secure-text: rgba(29, 78, 216, 0.5);
        }

        /* ═══ KEYFRAMES ═══ */
        @keyframes floatShape {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-25px) rotate(6deg) scale(1.03); }
          100% { transform: translateY(0) rotate(0deg) scale(1); }
        }
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes slideOutLeft {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to { opacity: 0; transform: translateX(-60px) scale(0.95); }
        }
        @keyframes morphGlow {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { border-radius: 50% 60% 30% 60% / 30% 50% 70% 60%; }
          75% { border-radius: 60% 30% 60% 40% / 60% 50% 40% 50%; }
        }
        @keyframes borderRotate {
          from { --angle: 0deg; }
          to { --angle: 360deg; }
        }
        @keyframes shimmerSlide {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.88); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes dropdownOpen {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        /* ═══ COMPONENT STYLES (using variables) ═══ */
        .gradient-border {
          position: relative;
          background: var(--l-card-bg);
          backdrop-filter: blur(40px) saturate(1.5);
          -webkit-backdrop-filter: blur(40px) saturate(1.5);
          transition: background 0.5s ease;
        }
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: var(--l-card-border-gradient);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: borderRotate 4s linear infinite;
          pointer-events: none;
        }
        .login-glass-input {
          background: var(--l-input-bg);
          border: 1px solid var(--l-input-border);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .login-glass-input:focus-within {
          background: var(--l-input-focus-bg);
          border-color: var(--l-focus-border);
          box-shadow: var(--l-focus-shadow);
        }
        .btn-shine {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, var(--l-accent-solid), #0b3c95);
          box-shadow: 0 8px 32px rgba(29, 78, 216, 0.35);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-shine:hover:not(:disabled) {
          box-shadow: 0 12px 40px rgba(29, 78, 216, 0.5);
          transform: translateY(-2px);
        }
        .btn-shine:active:not(:disabled) { transform: translateY(0); }
        .btn-shine::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          animation: shimmerSlide 3s ease-in-out infinite;
        }
        .btn-shine:disabled { opacity: 0.4; cursor: not-allowed; }
        .spinner-ring {
          width: 22px; height: 22px;
          border: 2.5px solid var(--l-spinner-track);
          border-top-color: var(--l-spinner-head);
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }
        .morph-blob {
          animation: morphGlow 12s ease-in-out infinite;
          filter: blur(50px);
        }
      `}</style>

      {/* Theme Toggle */}
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      {/* ═══════ LEFT PANEL — Immersive Visual ═══════ */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-10 overflow-hidden">
        <AuroraCanvas theme={theme} />

        {/* Morphing blobs */}
        <div className="morph-blob absolute" style={{ width: 350, height: 350, left: "10%", top: "15%", background: "var(--l-blob1)" }} />
        <div className="morph-blob absolute" style={{ width: 280, height: 280, right: "5%", bottom: "20%", background: "var(--l-blob2)", animationDelay: "-4s" }} />

        {/* Floating shapes */}
        <FloatingShape type="hexagon" size={80} x="15%" y="20%" delay={0} duration={8} />
        <FloatingShape type="diamond" size={50} x="75%" y="15%" delay={1.5} duration={10} />
        <FloatingShape type="circle" size={35} x="60%" y="70%" delay={0.5} duration={7} />
        <FloatingShape type="triangle" size={60} x="25%" y="75%" delay={2} duration={9} />
        <FloatingShape type="hexagon" size={40} x="85%" y="50%" delay={1} duration={11} />
        <FloatingShape type="diamond" size={30} x="45%" y="35%" delay={3} duration={8.5} />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <PulsingLogo size={44} />
            <div>
              <h1 className="text-xl font-extrabold tracking-tight" style={{ color: "var(--l-text-heading)" }}>CRIPTON</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--l-left-brand-sub)" }}>HRIS Platform</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 -mt-8">
          <h2 className="text-4xl xl:text-5xl font-black leading-[1.1] tracking-tight mb-4" style={{ color: "var(--l-text-heading)" }}>
            Workforce<br />Intelligence,<br />
            <span style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              <TypeWriter texts={["Reimagined.", "Simplified.", "Amplified.", "Unified."]} />
            </span>
          </h2>
          <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--l-left-body)" }}>
            An enterprise HR command center that transforms how organizations manage people, performance, and potential.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex gap-8">
            <AnimatedCounter end={4500} suffix="+" label="Employees" delay={600} />
            <AnimatedCounter end={98} suffix="%" label="Uptime" delay={900} />
            <AnimatedCounter end={12} suffix="" label="Countries" delay={1200} />
          </div>
        </div>

        {/* Edge fades */}
        <div className="absolute inset-0 pointer-events-none z-[5]" style={{
          background: `linear-gradient(to right, transparent 85%, var(--l-edge-fade) 100%), linear-gradient(to bottom, transparent 90%, var(--l-edge-fade) 100%), linear-gradient(to top, transparent 92%, var(--l-edge-fade) 100%)`,
          transition: "background 0.5s ease",
        }} />
      </div>

      {/* ═══════ RIGHT PANEL — Form ═══════ */}
      <div
        className="w-full lg:w-[48%] flex items-center justify-center p-6 md:p-10 relative"
        style={{ background: "var(--l-panel-bg)", transition: "background 0.5s ease" }}
      >
        <div className="absolute pointer-events-none" style={{ width: 500, height: 500, left: "50%", top: "50%", transform: "translate(-50%, -50%)", background: "var(--l-radial-glow)" }} />

        <div className="w-full relative z-10" style={{ maxWidth: step === 1 ? 420 : 520, transition: "max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>

          {/* ─── STEP 1: Login ─── */}
          {step === 1 && (
            <div
              className="gradient-border rounded-3xl p-8 md:p-10"
              style={{
                animation: mounted ? (transitioning ? "slideOutLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards" : "scaleIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards") : "none",
                opacity: mounted ? undefined : 0,
              }}
            >
              {/* Mobile Logo */}
              <div className="flex items-center gap-3 mb-8 lg:hidden">
                <PulsingLogo size={40} />
                <div>
                  <h1 className="text-lg font-extrabold tracking-tight" style={{ color: "var(--l-text-heading)" }}>CRIPTON</h1>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--l-muted)" }}>HRIS Platform</p>
                </div>
              </div>

              {/* Client Logo Header */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center p-3 mb-4 shadow-sm border transition-all duration-300"
                  style={{
                    background: "var(--l-input-bg)",
                    borderColor: "var(--l-input-border)",
                    boxShadow: "0 10px 30px -10px rgba(29, 78, 216, 0.12)",
                  }}>
                  <img src={clientLogo} alt="Client Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full mb-3" 
                  style={{ 
                    background: "var(--l-fingerprint-bg)",
                    border: "1px solid var(--l-input-border)"
                  }}>
                  <Fingerprint className="w-3.5 h-3.5" style={{ color: "var(--l-accent-solid)" }} />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--l-secure-text)" }}>Secure Gateway</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2" style={{ color: "var(--l-text-heading)" }}>Welcome back</h2>
                <p className="text-sm" style={{ color: "var(--l-text-subtitle)" }}>Enter your credentials to access your workspace</p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold mb-2 uppercase tracking-wider" style={{ color: "var(--l-label)" }} htmlFor="login-username">User ID</label>
                  <div className="login-glass-input rounded-2xl flex items-center gap-3 px-4 py-3.5">
                    <User className="w-[18px] h-[18px] flex-shrink-0 transition-all duration-400" style={{ color: focusedField === "email" ? "var(--l-icon-active)" : "var(--l-icon-muted)", filter: focusedField === "email" ? "var(--l-icon-glow)" : "none" }} />
                    <input id="login-username" type="text" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                      placeholder="Enter your User ID" className="w-full bg-transparent outline-none text-sm font-medium"
                      style={{ color: "var(--l-text)", caretColor: "var(--l-accent-solid)" }} autoComplete="username" required />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--l-label)" }} htmlFor="login-password">Password</label>
                    <button type="button" className="text-[11px] font-semibold transition-colors duration-300" style={{ color: "var(--l-forgot-color)" }} tabIndex={-1}>Forgot?</button>
                  </div>
                  <div className="login-glass-input rounded-2xl flex items-center gap-3 px-4 py-3.5">
                    <Lock className="w-[18px] h-[18px] flex-shrink-0 transition-all duration-400" style={{ color: focusedField === "password" ? "var(--l-icon-active)" : "var(--l-icon-muted)", filter: focusedField === "password" ? "var(--l-icon-glow)" : "none" }} />
                    <input id="login-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)}
                      placeholder="Enter your password" className="w-full bg-transparent outline-none text-sm font-medium"
                      style={{ color: "var(--l-text)", caretColor: "var(--l-accent-solid)" }} autoComplete="current-password" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="flex-shrink-0 p-1 rounded-lg transition-all duration-300" style={{ color: "var(--l-icon-muted)" }} tabIndex={-1} aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group" htmlFor="login-remember">
                    <div className="w-4.5 h-4.5 rounded-md flex items-center justify-center transition-all duration-300" style={{ border: `1.5px solid var(--l-checkbox-border)`, background: "var(--l-checkbox-bg)" }}>
                      <Check className="w-3 h-3" style={{ color: "var(--l-accent-solid)" }} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: "var(--l-label)" }}>Remember me</span>
                  </label>
                </div>

                <button type="submit" disabled={isLoading || !email || !password} className="btn-shine w-full py-4 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2.5 mt-1" id="login-submit-btn">
                  {isLoading ? <div className="spinner-ring" /> : <><span>Sign In to Workspace</span><ArrowRight className="w-4.5 h-4.5" /></>}
                </button>
              </form>

              {/* Footer badges */}
              <div className="mt-8 pt-6" style={{ borderTop: `1px solid var(--l-divider)` }}>
                <div className="flex items-center justify-center gap-6">
                  {["AES-256", "SOC 2", "GDPR"].map((badge) => (
                    <div key={badge} className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--l-badge-dot)" }} />
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--l-badge-text)" }}>{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Company & Section ─── */}
          {step === 2 && (
            <div className="gradient-border rounded-3xl p-8 md:p-10" style={{ animation: "slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
              <button type="button"
                onClick={() => { setTransitioning(true); setTimeout(() => { setStep(1); setTransitioning(false); }, 400); }}
                className="flex items-center gap-1.5 text-xs font-semibold mb-6 transition-all duration-300 group"
                style={{ color: "var(--l-back-color)" }}>
                <ChevronRight className="w-3.5 h-3.5 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
                Back to login
              </button>

              <div className="mb-7">
                <h2 className="text-2xl font-black tracking-tight mb-1.5" style={{ color: "var(--l-text-heading)" }}>Select Workspace</h2>
                <p className="text-sm" style={{ color: "var(--l-text-subtitle)" }}>Choose a company and department to begin</p>
              </div>

              <GlassSearchDropdown label="Company" icon={<Building2 className="w-4 h-4" style={{ color: "var(--l-accent-solid)" }} />}
                placeholder="Search companies..." triggerPlaceholder="Select a company" value={selectedCompany} onChange={setSelectedCompany}
                items={companies.map((c) => ({ id: c.id, name: c.name, description: `${c.location} · ${c.employees} people`, gradient: c.gradient, renderIcon: () => <Building2 className="w-4.5 h-4.5 text-white" /> }))}
                id="company-dropdown" />

              <GlassSearchDropdown label="Department" icon={<LayoutGrid className="w-4 h-4" style={{ color: "var(--l-accent-solid)" }} />}
                placeholder="Search departments..." triggerPlaceholder="Select a department" value={selectedSection} onChange={setSelectedSection}
                items={sections.map((s) => { const Icon = s.icon; return { id: s.id, name: s.name, description: s.desc, gradient: s.gradient, renderIcon: () => <Icon className="w-4.5 h-4.5 text-white" /> }; })}
                id="section-dropdown" className="mb-7" />

              <button type="button" onClick={handleContinue} disabled={isLoading || !selectedCompany || !selectedSection}
                className="btn-shine w-full py-4 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2.5" id="continue-to-dashboard-btn">
                {isLoading ? <div className="spinner-ring" /> : <><span>Launch Dashboard</span><ArrowRight className="w-4.5 h-4.5" /></>}
              </button>

              <p className="text-center text-[10px] font-medium mt-4" style={{ color: "var(--l-step2-note)" }}>Switch workspaces anytime from settings</p>
            </div>
          )}

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2.5 mt-7">
            {[1, 2].map((s) => (
              <div key={s} className="h-1.5 rounded-full transition-all duration-600"
                style={{
                  width: step === s ? 28 : 8,
                  background: step === s ? "linear-gradient(90deg, #1d4ed8, #3b82f6)" : "var(--l-step-inactive)",
                  boxShadow: step === s ? "0 0 12px rgba(29, 78, 216, 0.3)" : "none",
                }} />
            ))}
          </div>

          <p className="text-center text-[10px] font-medium mt-4" style={{ color: "var(--l-footer-color)" }}>
            © 2026 Cripton HRIS · Privacy · Terms
          </p>
        </div>
      </div>
    </div>
  );
}
