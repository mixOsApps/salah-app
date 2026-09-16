import { useI18n } from "../i18n";
import { useTheme } from "../theme";
import { ensureContrastAgainst, SALAH_BG_DARK, SALAH_BG_LIGHT } from "../colorUtils";
import appLogo from "../generated/assets/app-logo.png";

export default function HomeScreen({ prayers, articles, glossary, onPrayerClick, onArticleClick, onGlossaryClick, onSettingsClick }) {
  const { t, resolveText } = useI18n();
  const { isDark } = useTheme();

  return (
    <div className="salah-screen salah-screen--home">
      <div className="salah-arc" />
      <div className="salah-header">
        <button className="salah-settings-gear" onClick={onSettingsClick} aria-label={t("settings")}>
          ⚙
        </button>
        <div className="salah-bismillah">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
        <img className="salah-header-logo" src={appLogo} alt="" />
        <h1 className="salah-home-title">{t("app_name")}</h1>
        <p className="salah-home-sub">{t("home_subtitle")}</p>
      </div>
      <div className="salah-prayer-grid">
        {prayers.map((prayer) => {
          // The authored accents are tuned for the dark background; on white the Dhuhr yellow
          // lands near 1.5:1, so re-tone before using it for text -- see HomeScreen.kt's
          // rememberReadableAccent comment. accentColor (raw) still fills the icon badge and the
          // pill background; only the pill's text needs the readable variant.
          const accentText = ensureContrastAgainst(prayer.color, isDark ? SALAH_BG_DARK : SALAH_BG_LIGHT);
          return (
            <button
              key={prayer.id}
              onClick={() => onPrayerClick(prayer.id)}
              className="salah-prayer-card"
              style={{ "--prayer-accent": prayer.color, "--prayer-accent-text": accentText }}
            >
              <div className="salah-prayer-card-icon">{prayer.icon}</div>
              <div className="salah-prayer-card-body">
                <div className="salah-prayer-card-name">{t(prayer.name)}</div>
                <div className="salah-prayer-card-subtitle">{t(prayer.subtitle)}</div>
              </div>
              <div className="salah-prayer-card-badge">{t(prayer.description)}</div>
            </button>
          );
        })}
      </div>

      <div className="salah-reference-section">
        <div className="salah-reference-section-title">{t("reference_section_title")}</div>
        <div className="salah-reference-list">
          {articles.map((article) => (
            <button key={article.id} className="salah-reference-card" onClick={() => onArticleClick(article.id)}>
              <span className="salah-reference-card-icon" aria-hidden="true">
                📖
              </span>
              <span className="salah-reference-card-body">
                <span className="salah-reference-card-title">{resolveText(article.title)}</span>
                <span className="salah-reference-card-summary">{resolveText(article.summary)}</span>
              </span>
            </button>
          ))}
          <button className="salah-reference-card" onClick={onGlossaryClick}>
            <span className="salah-reference-card-icon" aria-hidden="true">
              📖
            </span>
            <span className="salah-reference-card-body">
              <span className="salah-reference-card-title">{resolveText(glossary.title)}</span>
              <span className="salah-reference-card-summary">{resolveText(glossary.summary)}</span>
            </span>
          </button>
        </div>
      </div>

      <p className="salah-footer">{t("home_footer")}</p>
    </div>
  );
}
