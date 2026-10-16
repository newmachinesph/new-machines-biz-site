import { LEGAL_COPY } from "@/site/copy";
import { LegalPage } from "@/site/LegalPage";
import { pageMetadata } from "@/site/metadata";

export const metadata = pageMetadata({ ...LEGAL_COPY.terms.meta, path: "/terms" });

export default function Page() {
  return <LegalPage document={LEGAL_COPY.terms} kind="terms" />;
}
