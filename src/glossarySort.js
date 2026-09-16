// Mirrors Glossary.kt's glossaryOrder / glossaryEntryMatches exactly, so a term list sorts and
// searches the same way on the web as on Android -- see that file's doc comments for why this
// isn't `sortedBy` / a plain substring check.

/** Drops the apostrophe standing in for ayn/hamza, so "Ta'awwudh" collates under "Taa...". */
function collationKey(term) {
  return term.replace(/['’]/g, "");
}

/** Entry ids in display order, collated for `locale` (Intl.Collator, not code-point order). */
export function glossaryOrder(idsWithTerms, locale) {
  const collator = new Intl.Collator(locale);
  return idsWithTerms
    .map(([id, term]) => [id, collationKey(term)])
    .sort((a, b) => collator.compare(a[1], b[1]))
    .map(([id]) => id);
}

/** Lower-cases, strips combining marks (accents) and apostrophes, so search ignores all three:
 *  "Ṣalāh" -> "salah"; "raka'ah" and "rakaah" both -> "rakaah". */
function normalizeForSearch(s) {
  return s
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .replace(/['’]/g, "")
    .toLowerCase()
    .trim();
}

export function glossaryEntryMatches(term, alsoKnownAs, definition, query) {
  const q = normalizeForSearch(query);
  if (!q) return true;
  return (
    normalizeForSearch(term).includes(q) ||
    (!!alsoKnownAs && normalizeForSearch(alsoKnownAs).includes(q)) ||
    normalizeForSearch(definition).includes(q)
  );
}
