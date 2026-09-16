import { useI18n } from "../i18n";
import { ArticleBlockView, SourcesSection } from "../components/ArticleBlocks";

export default function ArticleScreen({ article, readerSchool, onBack }) {
  const { t, resolveText } = useI18n();

  return (
    <div className="salah-screen salah-screen--article">
      <div className="salah-settings-topbar">
        <button className="salah-back-btn" onClick={onBack}>
          <span className="salah-arrow" aria-hidden="true">
            ←
          </span>{" "}
          {t("back")}
        </button>
        <div className="salah-settings-title">{resolveText(article.title)}</div>
      </div>
      <div className="salah-article-body">
        {article.intro && <p className="salah-article-intro">{resolveText(article.intro)}</p>}

        {article.sections.map((section, si) => {
          let stepNumber = 0;
          return (
            <div className="salah-article-section" key={si}>
              <h2 className="salah-article-section-heading">{resolveText(section.heading)}</h2>
              {section.blocks.map((block, bi) => {
                if (block.type === "step") stepNumber++;
                return <ArticleBlockView block={block} readerSchool={readerSchool} stepNumber={stepNumber} key={bi} />;
              })}
            </div>
          );
        })}

        <SourcesSection sources={article.sources} />
      </div>
    </div>
  );
}
