import { useI18n } from "../i18n";

export default function SettingsScreen({ onBack }) {
  const { t, locale, setLocale, languages } = useI18n();

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
      </div>
    </div>
  );
}
