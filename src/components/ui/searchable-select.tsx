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
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex w-full items-center justify-between h-10 px-3 rounded-xl bg-background border border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm transition-all text-foreground cursor-pointer hover:border-primary/50 text-left",
            className,
          )}
        >
          <span className="flex items-center gap-2 truncate">
            <Search className="size-3.5 text-muted-foreground/60 shrink-0" />
            <span>{selectedOption ? selectedOption.label : placeholder}</span>
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 shadow-lg border-border/50 rounded-xl overflow-hidden"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search..." className="h-9 text-xs" />
          <CommandList className="max-h-[200px]">
            <CommandEmpty className="py-3 text-center text-xs text-muted-foreground">
              No results found.
            </CommandEmpty>
            <CommandGroup className="p-1">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
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
