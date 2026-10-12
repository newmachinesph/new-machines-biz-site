const ACCENT_UTILITY =
  /(?:^|\s)(?:[a-z-]+:)*(?:bg|text|border|fill|stroke|from|to|ring|outline)-(machine|human|blocked)(?:-soft)?(?:\/\d+)?(?=\s|$)/g;

/** Colour discipline: an accent utility may only appear inside an element declaring that accent. */
export function accentViolations(root: ParentNode): string[] {
  const bad: string[] = [];
  root.querySelectorAll<Element>("[class]").forEach((el) => {
    const cls = el.getAttribute("class") ?? "";
    for (const match of cls.matchAll(ACCENT_UTILITY)) {
      const tone = match[1];
      if (!el.closest(`[data-accent="${tone}"]`)) bad.push(`<${el.tagName.toLowerCase()} class="${cls}"> uses ${tone} outside data-accent="${tone}"`);
    }
  });
  return bad;
}
