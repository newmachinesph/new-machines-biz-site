import { LEGAL_COPY } from "@/site/copy";
import { LegalPage } from "@/site/LegalPage";
import { pageMetadata } from "@/site/metadata";

export const metadata = pageMetadata({ ...LEGAL_COPY.privacy.meta, path: "/privacy" });

export default function Page() {
  return <LegalPage document={LEGAL_COPY.privacy} kind="privacy" />;
}
