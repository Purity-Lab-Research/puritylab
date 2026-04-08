"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import { SkeletonTableRow } from "./AdminSkeleton";
import AdminEmptyState from "./AdminEmptyState";
import { Package } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
  render: (row: T, index: number) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  loadingRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: typeof Package;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onRowClick?: (row: T) => void;
  className?: string;
  stickyHeader?: boolean;
  maxHeight?: string;
}

export default function AdminTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  loadingRows = 5,
  emptyTitle = "No data yet",
  emptyDescription,
  emptyIcon,
  onSort,
  sortKey,
  sortDirection,
  onRowClick,
  className,
  stickyHeader = false,
  maxHeight,
}: AdminTableProps<T>) {
  const [localSortKey, setLocalSortKey] = useState<string | null>(null);
  const [localSortDir, setLocalSortDir] = useState<"asc" | "desc">("asc");

  const activeSortKey = sortKey ?? localSortKey;
  const activeSortDir = sortDirection ?? localSortDir;

  function handleSort(key: string) {
    const newDir = activeSortKey === key && activeSortDir === "asc" ? "desc" : "asc";
    if (onSort) {
      onSort(key, newDir);
    } else {
      setLocalSortKey(key);
      setLocalSortDir(newDir);
    }
  }

  return (
    <div
      className={cn("overflow-x-auto", maxHeight && "overflow-y-auto", className)}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <table className="w-full text-left text-sm">
        <thead
          className={cn(
            "border-b bg-[#FAFAFA]/50 text-xs uppercase tracking-wider text-gray-500",
            stickyHeader && "sticky top-0 bg-white z-10"
          )}
        >
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-5 py-3 font-medium",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  col.sortable && "cursor-pointer select-none hover:text-gray-700",
                  col.className
                )}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && activeSortKey === col.key && (
                    activeSortDir === "asc" ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {loading ? (
            Array.from({ length: loadingRows }).map((_, i) => (
              <SkeletonTableRow key={i} cols={columns.length} />
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <AdminEmptyState
                  icon={emptyIcon ?? Package}
                  title={emptyTitle}
                  description={emptyDescription}
                />
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={keyExtractor(row)}
                className={cn(
                  "transition-colors hover:bg-[#FAFAFA]/50",
                  onRowClick && "cursor-pointer"
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-5 py-3",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center"
                    )}
                  >
                    {col.render(row, index)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
