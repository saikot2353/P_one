import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
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
  options,
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

  const selectedOption = options.find((option) => option.value === value);
  const isUnderline = variant === "underline";
  const shouldShowSearchIcon = showSearchIconInTrigger ?? !isUnderline;

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
            className,
          )}
        >
          <span className="flex items-center gap-2 truncate min-w-0 flex-1 pr-2">
            {shouldShowSearchIcon && (
              <Search className="size-3.5 text-muted-foreground/60 shrink-0" />
            )}
            <span className={cn("truncate", !selectedOption && !value && "text-slate-400 font-normal")}>
              {selectedOption ? selectedOption.label : value || placeholder}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-60 text-slate-500" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 shadow-lg border-border/50 rounded-xl overflow-hidden z-[100]"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder="Search product..."
            className="h-9 text-xs"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList className="max-h-[220px]">
            <CommandEmpty className="py-2.5 px-3 text-xs text-muted-foreground">
              {allowCustom && searchValue.trim() ? (
                <button
                  type="button"
                  onClick={() => {
                    onChange(searchValue.trim());
                    setOpen(false);
                    setSearchValue("");
                  }}
                  className="w-full text-left font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+ Use &ldquo;{searchValue.trim()}&rdquo;</span>
                </button>
              ) : (
                <span>No results found.</span>
              )}
            </CommandEmpty>
            <CommandGroup className="p-1">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={(currentValue) => {
                    const selected = options.find((o) => o.label.toLowerCase() === currentValue.toLowerCase());
                    if (selected) {
                      onChange(selected.value);
                      setOpen(false);
                      setSearchValue("");
                    }
                  }}
                  className="text-xs rounded-lg cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary my-0.5"
                >
                  <Check
                    className={cn(
                      "mr-2 h-3.5 w-3.5 text-primary",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
