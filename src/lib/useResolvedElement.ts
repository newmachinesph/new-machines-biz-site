import { use, type ReactNode } from "react";

type LazyNode = { $$typeof: symbol; _payload: PromiseLike<ReactNode> };

const isLazy = (node: ReactNode): node is ReactNode & LazyNode =>
  typeof node === "object" && node !== null && (node as unknown as LazyNode).$$typeof === Symbol.for("react.lazy");

/** In dev, an element passed from a Server Component to a Client Component can still be a
 *  lazy reference. Base UI clones `render` elements as-is, which loses the type, so resolve it first. */
export function useResolvedElement<T extends ReactNode>(node: T): T {
  return isLazy(node) ? (use(node._payload) as T) : node;
}
