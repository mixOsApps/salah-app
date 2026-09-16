// Mirrors ContrastUtils.kt exactly (WCAG relative luminance and contrast ratio), so the Next
// button's text color is computed the same way Android's bestOnColor() computes it.

function relativeLuminance(r, g, b) {
  const channel = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Black or white, whichever reads better on top of this hex color. */
export function bestOnColor(hex) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const l = relativeLuminance(r, g, b);
  const contrastWithWhite = contrastRatio(1, l);
  const contrastWithBlack = contrastRatio(0, l);
  return contrastWithWhite >= contrastWithBlack ? "#FFFFFF" : "#000000";
}
