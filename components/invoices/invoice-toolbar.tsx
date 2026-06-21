// components/invoices/invoice-toolbar.tsx
"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SortOption } from "@/types/invoice-list";

type InvoiceToolbarProps = {
  keyword: string;
  status: string;
  sort: SortOption;
  onKeywordChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
};

const STATUSES = ["All", "Due", "Overdue", "Paid", "Cancelled", "Rejected"];

export function InvoiceToolbar({
  keyword,
  status,
  sort,
  onKeywordChange,
  onStatusChange,
  onSortChange,
}: InvoiceToolbarProps) {
  const [text, setText] = useState(keyword);
  const lastEmitted = useRef(keyword);

  // Debounce local input -> emit. Guard against re-emitting the controlled value.
  useEffect(() => {
    if (text === keyword) {
      return;
    }

    const id = setTimeout(() => {
      lastEmitted.current = text;
      onKeywordChange(text);
    }, 350);

    return () => clearTimeout(id);
  }, [text, keyword, onKeywordChange]);

  // Sync when the keyword prop changes externally (e.g. Clear filters), but not
  // when the change is the echo of our own debounced emit.
  useEffect(() => {
    if (keyword !== lastEmitted.current) {
      lastEmitted.current = keyword;
      setText(keyword);
    }
  }, [keyword]);

  const triggerClass =
    "bg-muted w-full flex-1 data-[size=default]:h-11 min-[881px]:w-[150px] min-[881px]:flex-none";

  return (
    <div className="flex flex-col gap-3 min-[881px]:flex-row min-[881px]:flex-wrap min-[881px]:items-center">
      <div className="relative w-full min-[881px]:max-w-[360px] min-[881px]:flex-1">
        <Search className="text-subtle-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
        <Input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Search invoice #..."
          className="bg-muted h-11 w-full pl-10"
        />
      </div>
      <div className="flex items-center gap-2.5">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className={triggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "All" ? "All statuses" : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sort}
          onValueChange={(value) =>
            onSortChange(value === "oldest" ? "oldest" : "newest")
          }
        >
          <SelectTrigger className={triggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
