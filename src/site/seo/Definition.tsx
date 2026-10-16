import { SectionCell } from "@/home/Frame";
import { DEFINITION } from "./answers";
import { JsonLd } from "./JsonLd";
import { softwareApplicationSchema } from "./schema";

/** The answer-first block: "What is New Machines?" in one sentence, a short fact list, and the platform's
 *  SoftwareApplication JSON-LD. Rendered near the top of the home page and /product. Static, no motion. */
export function Definition({ id = "definition-title" }: { id?: string }) {
  return (
    <SectionCell labelledBy={id} className="answer-section">
      <div className="answer-block" data-component="definition">
        <div>
          <p className="section-eyebrow"><span aria-hidden="true" />{DEFINITION.eyebrow}</p>
          <h2 id={id}>{DEFINITION.question}</h2>
        </div>
        <div>
          <p className="answer-text">{DEFINITION.answer}</p>
          <dl className="answer-facts">
            {DEFINITION.facts.map((fact) => <div key={fact.term}><dt>{fact.term}</dt><dd>{fact.detail}</dd></div>)}
          </dl>
        </div>
      </div>
      <JsonLd data={softwareApplicationSchema()} />
    </SectionCell>
  );
}
