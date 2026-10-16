/** The kinds of marketplace listing. No imports: both the homepage mockups and the marketplace build on this.
 *  The catalogue lists packs and agents only; "human" stays in the type for the homepage mockups that still label it. */
export const KINDS = ["agent", "pack", "human"] as const;
export type Kind = (typeof KINDS)[number];
export type KindFilter = "all" | Kind;

export function isKind(value: string | null | undefined): value is Kind {
  return KINDS.some((kind) => kind === value);
}

export const KIND_LABEL: Record<Kind, string> = { agent: "AI agent", pack: "Workflow pack", human: "Human work" };

/** The app's marketplace views: all, packs, agents. Human work is not a listing kind in the product. */
export const KIND_FILTERS: readonly { label: string; kind: KindFilter }[] = [
  { label: "All", kind: "all" },
  { label: "Packs", kind: "pack" },
  { label: "Agents", kind: "agent" },
];

export const KIND_FILTER_GROUP_LABEL = "Filter listings";
