/** One `<script type="application/ld+json">`. Pass one schema.org object or an array of them.
 *  `<` is escaped so no string in the data can close the script element. */
export type JsonLdData = Record<string, unknown> | readonly Record<string, unknown>[];

export function JsonLd({ data }: { data: JsonLdData }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
