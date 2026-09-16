import { useMemo, useState } from "react";
import { useI18n } from "../i18n";
import { CitationView, SchoolComparisonCard, SourcesSection } from "../components/ArticleBlocks";
import { glossaryOrder, glossaryEntryMatches } from "../glossarySort";

// See ArticleScreen.jsx: always null until W6 gives the web a madhab setting.
const readerSchool = null;

function entryDomId(id) {
  return `glossary-entry-${id}`;
}

export default function GlossaryScreen({ glossary, onBack }) {
  const { t, resolveText, locale } = useI18n();
  const [query, setQuery] = useState("");

  // Resolve every entry's sortable/searchable text once per locale, exactly as
  // GlossaryScreen.kt's `resolved` does.
  const resolved = useMemo(
    () =>
      glossary.entries.map((entry) => ({
        entry,
        term: resolveText(entry.term),
        alsoKnownAs: entry.alsoKnownAs ? resolveText(entry.alsoKnownAs) : null,
        definition: resolveText(entry.definition),
      })),
    [glossary, resolveText]
  );

  const sorted = useMemo(() => {
    const order = glossaryOrder(
      resolved.map((r) => [r.entry.id, r.term]),
      locale
    );
    const byId = new Map(resolved.map((r) => [r.entry.id, r]));
    return order.map((id) => byId.get(id)).filter(Boolean);
  }, [resolved, locale]);

  const termById = useMemo(() => new Map(resolved.map((r) => [r.entry.id, r.term])), [resolved]);

  const visible = useMemo(() => {
    const q = query.trim();
    if (!q) return sorted;
    return sorted.filter((r) => glossaryEntryMatches(r.term, r.alsoKnownAs, r.definition, q));
  }, [sorted, query]);

  function jumpTo(targetId) {
    setQuery("");
    // The target may be filtered out of the DOM right now; let the clear above re-render first.
    requestAnimationFrame(() => {
      document.getElementById(entryDomId(targetId))?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div className="salah-screen salah-screen--article">
      <div className="salah-settings-topbar">
        <button className="salah-back-btn" onClick={onBack}>
          <span className="salah-arrow" aria-hidden="true">
            ←
          </span>{" "}
          {t("back")}
        </button>
        <div className="salah-settings-title">{resolveText(glossary.title)}</div>
      </div>
      <div className="salah-article-body">
        <div className="salah-glossary-search">
          <span className="salah-glossary-search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="text"
            className="salah-glossary-search-input"
            placeholder={t("glossary_search_hint")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="salah-glossary-search-clear"
              onClick={() => setQuery("")}
              aria-label={t("glossary_search_clear_cd")}
            >
              ✕
            </button>
          )}
        </div>

        <p className="salah-article-intro">{resolveText(glossary.intro)}</p>
        <div className="salah-note-card">{resolveText(glossary.unreviewed)}</div>

        {visible.length === 0 && (
          <p className="salah-glossary-empty" aria-live="polite">
            {t("glossary_no_results", query)}
          </p>
        )}

        {visible.map((r) => {
          const links = r.entry.seeAlso.map((id) => [id, termById.get(id)]).filter(([, term]) => !!term);
          return (
            <div className="salah-glossary-entry" id={entryDomId(r.entry.id)} key={r.entry.id}>
              <div className="salah-glossary-term">{r.term}</div>
              {r.alsoKnownAs && <div className="salah-glossary-aka">{t("glossary_also_known_as", r.alsoKnownAs)}</div>}
              <p className="salah-glossary-definition">{r.definition}</p>
              {r.entry.schoolNotes && <SchoolComparisonCard block={r.entry.schoolNotes} readerSchool={readerSchool} />}
              <CitationView citation={r.entry.citation} />
              {links.length > 0 && (
                <div className="salah-see-also">
                  <span className="salah-see-also-label">{t("glossary_see_also")}:</span>
                  {links.map(([id, term]) => (
                    <button type="button" className="salah-see-also-chip" onClick={() => jumpTo(id)} key={id}>
                      {term}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <SourcesSection sources={glossary.sources} />
      </div>
    </div>
  );
}
