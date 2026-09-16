import { useI18n } from "../i18n";
import { useTheme, THEME_CHOICES } from "../theme";

export default function SettingsScreen({ onAboutClick, onBack }) {
  const { t, locale, setLocale, languages } = useI18n();
  const { choice, setChoice } = useTheme();

  return (
    <div className="salah-screen salah-screen--settings">
      <div className="salah-settings-topbar">
        <button className="salah-back-btn" onClick={onBack}>
          <span className="salah-arrow" aria-hidden="true">←</span> {t("back")}
        </button>
        <div className="salah-settings-title">{t("settings")}</div>
      </div>
      <div className="salah-settings-body">
        <section className="salah-settings-section">
          <h2 className="salah-settings-section-title">{t("theme")}</h2>
          <div className="salah-theme-row">
            {THEME_CHOICES.map((value) => (
              <button
                key={value}
                className={"salah-theme-option" + (value === choice ? " is-selected" : "")}
                onClick={() => setChoice(value)}
                aria-pressed={value === choice}
              >
                {t(value)}
              </button>
            ))}
          </div>
        </section>

        <section className="salah-settings-section">
          <h2 className="salah-settings-section-title">{t("language")}</h2>
          <div className="salah-language-list">
            {languages.map((lang) => (
              <button
                key={lang.tag}
                className={"salah-language-option" + (lang.tag === locale ? " is-selected" : "")}
                onClick={() => setLocale(lang.tag)}
                aria-pressed={lang.tag === locale}
              >
                <span className="salah-language-endonym">{lang.endonym}</span>
                {lang.exonym && <span className="salah-language-exonym">{lang.exonym}</span>}
              </button>
            ))}
          </div>
        </section>

        <section className="salah-settings-section">
          <h2 className="salah-settings-section-title">{t("about_title")}</h2>
          <button className="salah-about-btn salah-about-btn--outline" onClick={onAboutClick}>
            {t("about_open")}
          </button>
        </section>
      </div>
    </div>
  );
}
