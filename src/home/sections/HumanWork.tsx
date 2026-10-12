import { MotionItem } from "@/design-system/motion/MotionItem";
import { HOME_COPY } from "../copy";
import { SectionCell } from "../Frame";
import { ReviewerTask } from "../mockups/HumanWork";
import { ReviewContext } from "../mockups/ReviewContext";
import { SectionHeader } from "../SectionHeader";
import Image from "next/image";

export function HumanWork() {
  const { eyebrow, lead, tail, sub } = HOME_COPY.human;
  return (
    <SectionCell labelledBy="human-title">
      <div className="human-editorial">
        <SectionHeader id="human-title" eyebrow={eyebrow} lead={lead} tail={tail} sub={sub} />
        <MotionItem className="human-photo-frame" delay={.1}><figure className="human-portrait"><Image src="/editorial/japan-architecture.jpg" fill sizes="(min-width: 1024px) 480px, 90vw" alt="Sunlight and shadow in a concrete passage in Shiga, Japan" /><figcaption>Light & structure / Shiga, Japan</figcaption></figure></MotionItem>
      </div>
      <div className="human-work-layout">
        <MotionItem><ReviewerTask /></MotionItem>
        <ReviewContext />
      </div>
    </SectionCell>
  );
}
