"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { PreviewCard } from "@/design-system/components/PreviewCard";
import { lineDiffs, type MatchRecord } from "@/marketplace/invoiceMatcher";
import { Icon } from "../Icon";
import { SourceDocument } from "./SourceDocument";

/** An invoice reference that shows its redacted source photo beside the PO and receiving report on hover, focus or tap; plain text when the record has no photo. */
export function InvoicePhotoPreview({ record, dataComponent, className, onOpenChange, children }: { record: MatchRecord; dataComponent: string; className?: string; onOpenChange?: (open: boolean) => void; children: ReactNode }) {
  const { photo } = record;
  if (!photo) return <>{children}</>;
  const diffs = new Set(lineDiffs(record).map((line) => line.item));
  return (
    <PreviewCard trigger={<button type="button" className={className ?? "invoice-photo-trigger"} data-component={dataComponent} aria-label={`${record.supplier} ${record.invoice.number}, show the source document`}>{children}</button>} description={photo.alt} onOpenChange={onOpenChange} className="invoice-photo-card">
      <div className="invoice-photo-documents">
        <figure className="invoice-photo-source">
          <Image src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} sizes="240px" />
          <figcaption>{record.supplier} · {record.invoice.number}<span>Redacted source document</span></figcaption>
        </figure>
        <div className="invoice-photo-records">
          <SourceDocument kind="po" number={record.purchase_order.number} lines={record.purchase_order.items} diffs={diffs} />
          <SourceDocument kind="received" number={record.received.number} lines={record.received.items} diffs={diffs} />
        </div>
      </div>
      <p className="invoice-photo-redaction"><Icon name="shield" />AI hid supplier and personal details before review.</p>
    </PreviewCard>
  );
}
