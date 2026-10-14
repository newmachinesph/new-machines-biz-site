import { Close } from "./sections/Close";
import { Control } from "./sections/Control";
import { Hero } from "./sections/Hero";
import { Hire } from "./sections/Hire";
import { HowItWorks } from "./sections/HowItWorks";
import { HumanWork } from "./sections/HumanWork";
import { JapacStrip } from "./sections/JapacStrip";
import { Sandbox } from "./sections/Sandbox";
import { Trust } from "./sections/Trust";
import { Customers } from "./sections/Customers";
import { WorkExplorer } from "./sections/WorkExplorer";
import { Integrations } from "./sections/Integrations";
import { CustomerStories } from "./sections/CustomerStories";
import { Faq } from "./sections/Faq";

import { PageShell } from "@/marketplace/PageShell";

export function HomePage() {
  return (
    <PageShell home={true} dataComponent="homePage">
      <Hero />
      <Customers />
      <WorkExplorer />
      <Hire />
      <Sandbox />
      <Trust />
      <HumanWork />
      <Control />
      <Integrations />
      <CustomerStories />
      <JapacStrip />
      <HowItWorks />
      <Faq />
      <Close />
    </PageShell>
  );
}
