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

function hexToRgb01(hex) {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.substring(0, 2), 16) / 255,
    parseInt(clean.substring(2, 4), 16) / 255,
    parseInt(clean.substring(4, 6), 16) / 255,
  ];
}

function luminanceOfHex(hex) {
  const [r, g, b] = hexToRgb01(hex);
  return relativeLuminance(r, g, b);
}

function contrastRatioHex(hexA, hexB) {
  return contrastRatio(luminanceOfHex(hexA), luminanceOfHex(hexB));
}

/** Black or white, whichever reads better on top of this hex color. */
export function bestOnColor(hex) {
  const l = luminanceOfHex(hex);
  const contrastWithWhite = contrastRatio(1, l);
  const contrastWithBlack = contrastRatio(0, l);
  return contrastWithWhite >= contrastWithBlack ? "#FFFFFF" : "#000000";
}

function toHex2(v) {
  return Math.round(v * 255).toString(16).padStart(2, "0");
}

function lerpHex(hexA, hexB, t) {
  const [ar, ag, ab] = hexToRgb01(hexA);
  const [br, bg, bb] = hexToRgb01(hexB);
  return (
    "#" +
    toHex2(ar + (br - ar) * t) +
    toHex2(ag + (bg - ag) * t) +
    toHex2(ab + (bb - ab) * t)
  ).toUpperCase();
}

/** The app's two theme backgrounds (Color.kt's AppBackground / AppBackgroundLight), for
 *  ensureContrastAgainst -- the per-prayer accents need to know which one they're sitting on. */
export const SALAH_BG_DARK = "#0B1622";
export const SALAH_BG_LIGHT = "#FDFDFD";

/**
 * Mirrors ContrastUtils.kt's Color.ensureContrastAgainst() exactly: nudges `hex` toward black (on
 * a light background) or white (on a dark one), via the same 12-step binary search over a linear
 * per-channel blend, until it clears `minRatio` against `backgroundHex`. Returns `hex` unchanged
 * if it already clears the ratio.
 *
 * The per-prayer accents are authored for the dark theme -- e.g. the Dhuhr yellow #F9C74F lands
 * near 1.5:1 on white -- so they need re-toning before use as text/icon color in light mode.
 */
export function ensureContrastAgainst(hex, backgroundHex, minRatio = 4.5) {
  if (contrastRatioHex(hex, backgroundHex) >= minRatio) return hex;
  const target = luminanceOfHex(backgroundHex) > 0.5 ? "#000000" : "#FFFFFF";
  let low = 0;
  let high = 1;
  let best = target;
  for (let i = 0; i < 12; i++) {
    const mid = (low + high) / 2;
    const candidate = lerpHex(hex, target, mid);
    if (contrastRatioHex(candidate, backgroundHex) >= minRatio) {
      best = candidate;
      high = mid;
    } else {
      low = mid;
    }
  }
  return best;
}
