import { useEffect, useState } from "react";
import { useI18n } from "../i18n";
import { useTheme } from "../theme";
import { useSettings } from "../settings";
import { ensureContrastAgainst, SALAH_BG_DARK, SALAH_BG_LIGHT } from "../colorUtils";
import { getPrayerTimes } from "../prayerTimes";
import { formatPrayerTime, formatPrayerTimeCompact } from "../timeFormat";
import LocationAction from "../components/LocationAction";
import appLogo from "../generated/assets/app-logo.png";

const GEOLOCATION_OPTIONS = { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 };

export default function HomeScreen({ prayers, articles, glossary, onPrayerClick, onArticleClick, onGlossaryClick, onSettingsClick }) {
  const { t, resolveText, locale } = useI18n();
  const { isDark } = useTheme();
  const { latitude, longitude, calculationMethod, madhab, hasLocation, setLocation } = useSettings();

  const [prayerTimes, setPrayerTimes] = useState(() =>
    hasLocation ? getPrayerTimes(latitude, longitude, calculationMethod, madhab) : null
  );

  useEffect(() => {
    setPrayerTimes(hasLocation ? getPrayerTimes(latitude, longitude, calculationMethod, madhab) : null);
  }, [latitude, longitude, calculationMethod, madhab, hasLocation]);

  // Mirrors HomeScreen.kt's LaunchedEffect(Unit): try a silent refresh on every visit when
  // permission is already granted. This never itself prompts -- LocationAction below is the only
  // thing that does -- and prayerTimes above already shows whatever was last saved while this
  // resolves, so there's nothing to await before rendering.
  useEffect(() => {
    if (!navigator.permissions || !navigator.geolocation) return;
    let cancelled = false;
    navigator.permissions
      .query({ name: "geolocation" })
      .then((status) => {
        if (cancelled || status.state !== "granted") return;
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (!cancelled) setLocation(position.coords.latitude, position.coords.longitude);
          },
          () => {}, // a failed background refresh just leaves the cached times on screen
          GEOLOCATION_OPTIONS
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // Run once on mount only, matching LaunchedEffect(Unit) -- setLocation is stable (useCallback).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {prayerTimes ? (
          <PrayerTimesRow prayers={prayers} prayerTimes={prayerTimes} locale={locale} t={t} />
        ) : (
          <>
            <p className="salah-home-sub">{t("home_subtitle")}</p>
            {/* Never shown at launch on its own -- LocationAction only ever requests the
                permission from its own button tap, not from appearing here. */}
            {!hasLocation && <LocationAction />}
          </>
        )}
      </div>
      <div className="salah-prayer-grid">
        {prayers.map((prayer) => {
          // The authored accents are tuned for the dark background; on white the Dhuhr yellow
          // lands near 1.5:1, so re-tone before using it for text -- see HomeScreen.kt's
          // rememberReadableAccent comment. accentColor (raw) still fills the icon badge and the
          // pill background; only the pill's text needs the readable variant.
          const accentText = ensureContrastAgainst(prayer.color, isDark ? SALAH_BG_DARK : SALAH_BG_LIGHT);
          const time = prayerTimes?.[prayer.id];
          return (
            <button
              key={prayer.id}
              onClick={() => onPrayerClick(prayer.id)}
              className="salah-prayer-card"
              style={{ "--prayer-accent": prayer.color, "--prayer-accent-text": accentText }}
            >
              <div className="salah-prayer-card-icon">{prayer.icon}</div>
              <div className="salah-prayer-card-body">
                <div className="salah-prayer-card-name-row">
                  <div className="salah-prayer-card-name">{t(prayer.name)}</div>
                  {time && <div className="salah-prayer-card-time">{formatPrayerTime(time, locale)}</div>}
                </div>
                <div className="salah-prayer-card-subtitle">{t(prayer.subtitle)}</div>
              </div>
              <div className="salah-prayer-card-badge">{t(prayer.description)}</div>
            </button>
          );
        })}
        {/* Qiyam has no card of its own in prayers.json -- it's not one of the six walkthroughs,
            just a computed time worth surfacing, so it renders here as a 7th, non-clickable grid
            item rather than joining the prayer list itself. */}
        {prayerTimes?.qiyam && <QiyamCard time={prayerTimes.qiyam} locale={locale} t={t} />}
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

/** Mirrors HomeScreen.kt's PrayerTimesRow: the five daily prayers (not Witr, which the Adhan
 *  library does not compute a time for), always in compact 24-hour form. */
function PrayerTimesRow({ prayers, prayerTimes, locale, t }) {
  return (
    <div className="salah-prayer-times-row">
      {prayers
        .filter((p) => p.id !== "witr")
        .map((p) => (
          <div className="salah-prayer-time-item" key={p.id}>
            <div className="salah-prayer-time-name">{t(p.name)}</div>
            <div className="salah-prayer-time-value">
              {prayerTimes[p.id] ? formatPrayerTimeCompact(prayerTimes[p.id], locale) : "--:--"}
            </div>
          </div>
        ))}
    </div>
  );
}

/** Mirrors HomeScreen.kt's QiyamCard. */
function QiyamCard({ time, locale, t }) {
  return (
    <div className="salah-qiyam-card">
      <div className="salah-qiyam-card-icon" aria-hidden="true">
        🌙
      </div>
      <div className="salah-qiyam-card-body">
        <div className="salah-qiyam-card-title">{t("qiyam_title")}</div>
        <div className="salah-qiyam-card-desc">{t("qiyam_desc")}</div>
      </div>
      <div className="salah-qiyam-card-time">{formatPrayerTime(time, locale)}</div>
    </div>
  );
}
