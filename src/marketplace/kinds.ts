/** The three kinds of marketplace talent. No imports: both the homepage mockups and the marketplace build on this. */
export const KINDS = ["agent", "pack", "human"] as const;
export type Kind = (typeof KINDS)[number];
export type KindFilter = "all" | Kind;

export function isKind(value: string | null | undefined): value is Kind {
  return KINDS.some((kind) => kind === value);
}

export const KIND_LABEL: Record<Kind, string> = { agent: "AI agent", pack: "Workflow pack", human: "Human work" };

export const KIND_FILTERS: readonly { label: string; kind: KindFilter }[] = [
  { label: "All talent", kind: "all" },
  { label: "AI agents", kind: "agent" },
  { label: "Workflow packs", kind: "pack" },
  { label: "Human work", kind: "human" },
];

export const KIND_FILTER_GROUP_LABEL = "Filter marketplace talent";
