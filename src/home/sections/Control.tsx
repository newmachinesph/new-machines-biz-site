import { HOME_COPY } from "../copy";
import { SectionCell } from "../Frame";
import { MotionItem } from "@/design-system/motion/MotionItem";
import { SpendControl } from "../mockups/SpendControl";
import { SectionHeader } from "../SectionHeader";

export function Control() {
  const { eyebrow, lead, tail, sub } = HOME_COPY.control;
  return (
    <SectionCell labelledBy="control-title" className="control-section">
      <div className="section-opener"><SectionHeader id="control-title" eyebrow={eyebrow} lead={lead} tail={tail} /><p>{sub}</p></div>
      <MotionItem className="control-board"><SpendControl /></MotionItem>
    </SectionCell>
  );
}
