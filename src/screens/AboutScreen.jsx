import { useEffect, useState } from "react";
import { useI18n } from "../i18n";
import pdfUrl from "../generated/assets/salah-guide.pdf?url";

// Mirrors AboutScreen.kt's feature list, minus two rows the web can't honestly claim yet:
// Qibla is never ported (owner's call, WEB_TASK_PROMPTS.md), and prayer times land in W6.
const FEATURE_KEYS = ["about_feature_steps", "about_feature_guides", "about_feature_schools", "about_feature_sources"];

export default function AboutScreen({ about, onBack }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(id);
  }, [copied]);

  // "Share this app" shares the link to the app the reader is actually using -- the web build's
  // own URL -- the same way AboutScreen.kt's Share button shares PLAY_URL on Android: the
  // actionable way to pass on the build you're currently in. Same template, different platform's
  // link in the %1$s slot.
  const shareText = t("about_share_text", about.webUrl);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // User dismissed the share sheet -- nothing to do.
      }
      return;
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
      } catch {
        // No clipboard access either -- nothing more this button can do.
      }
    }
  }

  const feedbackSubject = t("about_feedback_subject", "Web");
  const feedbackHref = `mailto:${about.feedbackEmail}?subject=${encodeURIComponent(feedbackSubject)}`;

  return (
    <div className="salah-screen salah-screen--about">
      <div className="salah-settings-topbar">
        <button className="salah-back-btn" onClick={onBack}>
          <span className="salah-arrow" aria-hidden="true">←</span> {t("back")}
        </button>
        <div className="salah-settings-title">{t("about_title")}</div>
      </div>

      <div className="salah-article-body">
        <h1 className="salah-settings-title">{t("app_name")}</h1>
        <p className="salah-about-text">{t("about_tagline")}</p>

        <div className="salah-about-features">
          {FEATURE_KEYS.map((key) => (
            <div key={key} className="salah-about-feature">
              <span className="salah-about-feature-bullet" aria-hidden="true">•</span>
              <span>{t(key)}</span>
            </div>
          ))}
        </div>

        <button className="salah-about-btn salah-about-btn--filled" onClick={handleShare}>
          {copied ? "✓ " : ""}
          {t("about_share")}
        </button>
        <a
          className="salah-about-btn salah-about-btn--outline"
          href={about.privacyUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("about_privacy")}
        </a>

        <hr className="salah-divider" />

        <h2 className="salah-about-heading">{t("about_pdf_heading")}</h2>
        <p className="salah-about-text">{t("about_pdf_body")}</p>
        <a className="salah-about-btn salah-about-btn--filled" href={pdfUrl} download={about.pdfAsset}>
          {t("about_pdf_open")}
        </a>

        <hr className="salah-divider" />

        <h2 className="salah-about-heading">{t("about_ack_heading")}</h2>
        <p className="salah-about-text-primary">{t("about_ack_body")}</p>
        <p className="salah-about-dua">{t("about_ack_dua")}</p>

        <hr className="salah-divider" />

        <p className="salah-about-text">{t("about_more_apps")}</p>
        <a
          className="salah-about-btn salah-about-btn--outline"
          href={about.developerUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("about_more_apps_action")}
        </a>
        <p className="salah-about-text">{t("about_feedback")}</p>
        <a className="salah-about-btn salah-about-btn--outline" href={feedbackHref}>
          {t("about_feedback_action")}
        </a>
      </div>
    </div>
  );
}
