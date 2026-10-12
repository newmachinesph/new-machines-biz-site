import { HOME_COPY } from "../copy";
import { SectionCell } from "../Frame";
import { SectionHeader } from "../SectionHeader";
import { Icon } from "../Icon";

const STEP_TARGETS = ["work-explorer", "sandbox", "hire", "human", "trust"] as const;

export function HowItWorks() {
  const { eyebrow, lead, tail, sub, steps } = HOME_COPY.how;
  return (
    <SectionCell labelledBy="how-title">
      <div className="section-opener">
        <SectionHeader id="how-title" eyebrow={eyebrow} lead={lead} tail={tail} />
        <p>{sub}</p>
      </div>
      <ol className="work-guide">
        {steps.map((s, i) => (
          <li key={s.title}>
            <a href={`#${STEP_TARGETS[i]}`}>
              <span className="guide-number font-mono font-light">{String(i + 1).padStart(2, "0")}</span>
              <div><h3>{s.title}</h3><p>{s.body}</p></div>
              <Icon name="arrow-up" />
            </a>
          </li>
        ))}
      </ol>
    </SectionCell>
  );
}
