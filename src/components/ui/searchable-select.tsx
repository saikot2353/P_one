import * as React from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface Option {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  options: (Option | string)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  allowCustom?: boolean;
  variant?: "default" | "underline";
  showSearchIconInTrigger?: boolean;
  disabled?: boolean;
}

export function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  className,
  allowCustom = false,
  variant = "default",
  showSearchIconInTrigger,
  disabled = false,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const normalizedOptions = React.useMemo<Option[]>(() => {
    if (!Array.isArray(options)) return [];
    return options.map((opt) => {
      if (typeof opt === "string") {
        return { value: opt, label: opt };
      }
      if (opt && typeof opt === "object") {
        return {
          value: opt.value ?? opt.label ?? "",
          label: opt.label ?? opt.value ?? "",
        };
      }
      return { value: String(opt), label: String(opt) };
    });
  }, [options]);

  const selectedOption = React.useMemo(() => {
    return normalizedOptions.find((opt) => opt.value === value || opt.label === value);
  }, [normalizedOptions, value]);

  const filteredOptions = React.useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return normalizedOptions;
    return normalizedOptions.filter(
      (opt) =>
        (opt.label || "").toLowerCase().includes(q) ||
        (opt.value || "").toLowerCase().includes(q)
    );
  }, [normalizedOptions, searchValue]);

  React.useEffect(() => {
    if (open) {
      setSearchValue("");
      setHighlightedIndex(-1);
      const t = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const el = listRef.current.children[highlightedIndex] as HTMLElement;
      if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = React.useCallback(
    (val: string) => {
      onChange(val);
      setOpen(false);
      setSearchValue("");
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex].value);
      } else if (allowCustom && searchValue.trim()) {
        handleSelect(searchValue.trim());
      } else if (filteredOptions.length === 1) {
        handleSelect(filteredOptions[0].value);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  const isUnderline = variant === "underline";
  const shouldShowSearchIcon = showSearchIconInTrigger ?? !isUnderline;

  const showCustomOption =
    allowCustom &&
    searchValue.trim() !== "" &&
    !normalizedOptions.some(
      (o) =>
        (o.label || "").toLowerCase() === searchValue.trim().toLowerCase() ||
        (o.value || "").toLowerCase() === searchValue.trim().toLowerCase()
    );

  return (
    <Popover open={disabled ? false : open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            isUnderline
              ? "flex w-full items-center justify-between h-8 py-1 px-0 bg-transparent border-0 border-b border-slate-300 focus:border-blue-500 rounded-none outline-none text-sm text-slate-800 cursor-pointer text-left shadow-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              : "flex w-full items-center justify-between h-10 px-3 rounded-xl bg-background border border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm transition-all text-foreground cursor-pointer hover:border-primary/50 text-left disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
        >
          <span className="flex items-center gap-2 truncate min-w-0 flex-1 pr-2">
            {shouldShowSearchIcon && (
              <Search className="size-3.5 text-muted-foreground/60 shrink-0" />
            )}
            <span
              className={cn(
                "truncate",
                !selectedOption && !value && "text-slate-400 font-normal"
              )}
            >
              {selectedOption ? selectedOption.label : value || placeholder}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 opacity-60 text-slate-500 transition-transform duration-150",
              open && "rotate-180"
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0 shadow-xl border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden z-[100] bg-white dark:bg-slate-900"
        align="start"
      >
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-3 py-2 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="mr-2 h-3.5 w-3.5 shrink-0 opacity-50 text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setHighlightedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="flex h-7 w-full rounded-md bg-transparent text-xs outline-none placeholder:text-muted-foreground text-slate-900 dark:text-white"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => {
                setSearchValue("");
                inputRef.current?.focus();
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        <div
          ref={listRef}
          className="max-h-[220px] overflow-y-auto p-1 text-xs space-y-0.5 divide-y divide-transparent"
        >
          {showCustomOption && (
            <button
              type="button"
              onClick={() => handleSelect(searchValue.trim())}
              className="w-full text-left font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <span>+ Use &ldquo;{searchValue.trim()}&rdquo;</span>
            </button>
          )}

          {filteredOptions.length === 0 && !showCustomOption ? (
            <div className="py-4 text-center text-xs text-muted-foreground text-slate-400">
              No results found.
            </div>
          ) : (
            filteredOptions.map((option, idx) => {
              const isSelected = value === option.value;
              const isHighlighted = idx === highlightedIndex;
              return (
                <div
                  key={option.value || idx}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer text-xs transition-colors select-none",
                    isSelected && "bg-primary/10 text-primary font-semibold",
                    isHighlighted && !isSelected && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white",
                    !isSelected && !isHighlighted && "text-slate-700 dark:text-slate-300"
                  )}
                >
                  <span className="truncate pr-2">{option.label}</span>
                  <Check
                    className={cn(
                      "size-3.5 shrink-0 text-primary",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
