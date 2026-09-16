import { useI18n } from "../i18n";

// Shared between ArticleScreen and GlossaryScreen, mirroring ArticleScreen.kt's `internal`
// composables (SchoolComparisonCard, NoteCard, CitationView): a school split or a citation reads
// identically wherever it appears.

/** A caveat that would be lost inside running text -- also doubles as the "not yet reviewed by a
 *  qualified person" notice, which is just the first Note block of an article/the glossary, not a
 *  distinct thing in the data. */
export function NoteCard({ text }) {
  const { resolveText } = useI18n();
  return <div className="salah-note-card">{resolveText(text)}</div>;
}

export function CitationView({ citation }) {
  const { resolveText } = useI18n();
  if (!citation) return null;
  return <div className="salah-citation">{resolveText(citation.label)}</div>;
}

/**
 * Every school's position on one disputed point, side by side. `readerSchool` marks the reader's
 * own school when known; always null until W6 gives the web a madhab setting to read it from --
 * until then every position shows with equal weight, exactly like Android does when it can't tell.
 */
export function SchoolComparisonCard({ block, readerSchool }) {
  const { t, resolveText } = useI18n();
  return (
    <div className="salah-school-card">
      <div className="salah-school-card-label">{t("article_schools_differ")}</div>
      <div className="salah-school-card-subject">{resolveText(block.subject)}</div>
      {block.positions.map((position, i) => {
        const isReaders = !!readerSchool && position.schools.includes(readerSchool);
        return (
          <div className="salah-school-position" key={i}>
            <div className="salah-school-position-header">
              <span className={"salah-school-position-names" + (isReaders ? " is-reader" : "")}>
                {position.schools.map((s) => t(`school_${s.toLowerCase()}`)).join(" · ")}
              </span>
              {isReaders && <span className="salah-school-position-badge">{t("school_your_school")}</span>}
            </div>
            <div className="salah-school-position-text">{resolveText(position.text)}</div>
            <CitationView citation={position.citation} />
          </div>
        );
      })}
    </div>
  );
}

function ListItems({ items, ordered, citation }) {
  const { resolveText } = useI18n();
  const Tag = ordered ? "ol" : "ul";
  return (
    <>
      <Tag className="salah-block-list">
        {items.map((item, i) => (
          <li key={i}>{resolveText(item)}</li>
        ))}
      </Tag>
      <CitationView citation={citation} />
    </>
  );
}

/** One numbered step in a procedure. `number` comes from position among the section's Step
 *  blocks, not from the data, so reordering steps renumbers itself. */
function StepBlock({ block, number }) {
  const { resolveText } = useI18n();
  return (
    <div className="salah-block-step">
      <div className="salah-block-step-row">
        <span className="salah-block-step-number">{number}.</span>
        <span className="salah-block-step-title">{resolveText(block.title)}</span>
      </div>
      {block.detail && <p className="salah-block-step-detail">{resolveText(block.detail)}</p>}
      {block.citation && (
        <div className="salah-block-step-citation">
          <CitationView citation={block.citation} />
        </div>
      )}
    </div>
  );
}

/** Renders any ArticleBlock. Kept to one switch, shared by ArticleScreen and GlossaryScreen, so a
 *  block type reads the same in both places -- adding a kind here is the one place to do it. */
export function ArticleBlockView({ block, readerSchool, stepNumber }) {
  const { resolveText } = useI18n();
  switch (block.type) {
    case "body":
      return (
        <>
          <p className="salah-block-body">{resolveText(block.text)}</p>
          <CitationView citation={block.citation} />
        </>
      );
    case "bullets":
      return <ListItems items={block.items} ordered={false} citation={block.citation} />;
    case "numbered":
      return <ListItems items={block.items} ordered={true} citation={block.citation} />;
    case "note":
      return <NoteCard text={block.text} />;
    case "step":
      return <StepBlock block={block} number={stepNumber} />;
    case "schoolComparison":
      return <SchoolComparisonCard block={block} readerSchool={readerSchool} />;
    default:
      return null;
  }
}

/** An article/glossary's "Sources" foot section -- a list of Citations with no per-item text. */
export function SourcesSection({ sources }) {
  const { t } = useI18n();
  if (!sources || sources.length === 0) return null;
  return (
    <div className="salah-sources-section">
      <hr className="salah-divider" />
      <div className="salah-sources-label">{t("article_sources_label")}</div>
      {sources.map((c, i) => (
        <CitationView citation={c} key={i} />
      ))}
    </div>
  );
}
