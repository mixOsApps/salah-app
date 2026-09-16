import { useI18n } from "../i18n";
import appLogo from "../generated/assets/app-logo.png";

export default function HomeScreen({ prayers, onPrayerClick, onSettingsClick }) {
  const { t } = useI18n();

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
        {prayers.map((prayer) => (
          <button
            key={prayer.id}
            onClick={() => onPrayerClick(prayer.id)}
            className="salah-prayer-card"
            style={{ "--prayer-accent": prayer.color }}
          >
            <div className="salah-prayer-card-icon">{prayer.icon}</div>
            <div className="salah-prayer-card-body">
              <div className="salah-prayer-card-name">{t(prayer.name)}</div>
              <div className="salah-prayer-card-subtitle">{t(prayer.subtitle)}</div>
            </div>
            <div className="salah-prayer-card-badge">{t(prayer.description)}</div>
          </button>
        ))}
      </div>
      <p className="salah-footer">{t("home_footer")}</p>
    </div>
  );
}
