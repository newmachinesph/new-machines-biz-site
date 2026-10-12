import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Column = { key: string; header: string; align?: "left" | "right"; mono?: boolean };

export type TableProps = {
  columns: Column[];
  rows: Record<string, ReactNode>[];
  /** Names the table for assistive tech (visually hidden). */
  caption?: string;
  /** Caps the height so the header can stick while the body scrolls; override with a max-h-* in className. */
  stickyHeader?: boolean;
  rowKey?: (row: Record<string, ReactNode>, index: number) => string;
  className?: string;
};

export function Table({ columns, rows, caption, stickyHeader, rowKey, className }: TableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-grey-200", stickyHeader && "max-h-[32rem] overflow-y-auto", className)}>
      <table className="w-full border-collapse text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className={cn("bg-grey-50 text-xs uppercase tracking-wide text-grey-500", stickyHeader && "sticky top-0")}>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cn("px-4 py-2 text-left font-medium", c.align === "right" && "text-right")}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={rowKey ? rowKey(row, i) : i} className="border-t border-grey-200">
              {columns.map((c) => (
                <td key={c.key} className={cn("px-4 py-2.5 text-ink", c.align === "right" && "text-right tabular-nums", c.mono && "font-mono text-xs")}>
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
