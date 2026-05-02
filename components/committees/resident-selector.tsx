"use client";

import { searchResidentsAction } from "@/actions/residents";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Search, User } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";

interface ResidentSelectorProps {
  onSelect: (residentId: string) => void;
  selectedId?: string;
}

export function ResidentSelector({
  onSelect,
  selectedId,
}: ResidentSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebounce(searchValue, 300);

  const { data: residents = [], isLoading } = useQuery({
    queryKey: ["residents-search", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      const res = await searchResidentsAction(debouncedSearch);
      if (!res.success) throw new Error(res.error);
      return res.data || [];
    },
    enabled: debouncedSearch.length > 0,
  });

  const selectedResident = residents.find((r) => r.id === selectedId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedResident ? (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>
                {selectedResident.firstName} {selectedResident.lastName} (
                {selectedResident.cedula})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>Buscar habitante por nombre o cédula...</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Escriba para buscar..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Buscando...
              </div>
            ) : residents.length === 0 ? (
              <CommandEmpty>No se encontraron habitantes.</CommandEmpty>
            ) : (
              <CommandGroup>
                {residents.map((resident: any) => (
                  <CommandItem
                    key={resident.id}
                    value={resident.id}
                    onSelect={() => {
                      onSelect(resident.id);
                      setOpen(false);
                    }}
                    className="flex justify-between items-center"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {resident.firstName} {resident.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        C.I: {resident.cedula}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4",
                        selectedId === resident.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
