import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";
import { poseImageUrl, poseLabelKey } from "../poseImages";
import { bestOnColor } from "../colorUtils";

export default function PrayerDetailScreen({ prayer, onBack }) {
  const { t, resolveText, locale } = useI18n();
  const [stepIndex, setStepIndex] = useState(0);
  const [showArabic, setShowArabic] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const contentRef = useRef(null);

  const step = prayer.steps[stepIndex];
  const total = prayer.steps.length;
  const pct = ((stepIndex + 1) / total) * 100;
  const accentColor = prayer.color;
  const nextTextColor = bestOnColor(accentColor);
  // Content-language comparison, not layout-direction: the Arabic/transliteration cards are
  // always the same fixed-language content, so a "Translation" card only becomes redundant when
  // the UI itself is Arabic -- see PrayerDetailScreen.kt's translationWouldBeRedundant comment.
  const translationWouldBeRedundant = locale === "ar";

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
    setIsImageExpanded(false);
  }, [stepIndex]);

  const go = useCallback(
    (i) => {
      if (i < 0 || i >= total) return;
      setStepIndex(i);
    },
    [total]
  );

  const title = resolveText(step.title);
  const instruction = resolveText(step.instruction);
  const poseLabel = t(poseLabelKey(step.pose));
  const imageUrl = poseImageUrl(step.pose);
  const isSalamRight = step.pose === "SALAM_RIGHT";
  const isSalamLeft = step.pose === "SALAM_LEFT";
  const stepProgressLabel = t("step_progress_cd", stepIndex + 1, total);

  const showArabicCard = showArabic && step.arabic !== "";
  const showTransliterationCard = showTransliteration && step.transliteration !== "";
  const showTranslationCard = showTranslation && !translationWouldBeRedundant && !!step.translation;

  return (
    <div
      className="salah-screen salah-screen--step"
      style={{ "--prayer-accent": accentColor, "--progress-pct": `${pct}%` }}
    >
      <div className="salah-topbar">
        <button onClick={onBack} className="salah-back-btn">
          <span className="salah-arrow" aria-hidden="true">←</span> {t("back")}
        </button>
        <div className="salah-topbar-title">
          {prayer.icon} {t(prayer.name)}
        </div>
        <div className="salah-step-badge" aria-label={stepProgressLabel}>
          <span aria-hidden="true">{stepIndex + 1}/{total}</span>
        </div>
      </div>
      <div
        className="salah-progress-wrap"
        role="progressbar"
        aria-label={stepProgressLabel}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={stepIndex + 1}
      >
        <div className="salah-progress-fill" />
      </div>

      <div className="salah-step-body">
        <div className="salah-illust-header">
          <div className="salah-illust-decorative">
            <button
              type="button"
              className="salah-illust-wrap salah-illust-button"
              onClick={() => setIsImageExpanded(true)}
              aria-label={`${title} — ${poseLabel}`}
            >
              <img src={imageUrl} alt="" className="salah-pose-img" />
              {(isSalamRight || isSalamLeft) && (
                <div
                  className={
                    "salah-salam-badge " +
                    (isSalamRight ? "salah-salam-badge--right" : "salah-salam-badge--left")
                  }
                >
                  {isSalamRight ? t("look_right") : t("look_left")}
                </div>
              )}
              {/* Title + pose label overlaid on the bottom of the illustration, over a
                  gradient -- the Android arrangement. See .salah-illust-overlay in styles.css. */}
              <div className="salah-illust-overlay">
                <h2 className="salah-illust-overlay-title">{title}</h2>
                <div className="salah-pose-label">{poseLabel}</div>
              </div>
            </button>
          </div>
        </div>

        <div ref={contentRef} className="salah-content">
          <div className="salah-instruction-box">
            <span className="salah-instruction-icon" aria-hidden="true">📖</span>
            <p className="salah-instruction-text">{instruction}</p>
          </div>

          {showArabicCard && (
            <div className="salah-text-card">
              <div className="salah-text-card-label">{t("arabic_content_label")}</div>
              <div className="salah-arabic-text">{step.arabic}</div>
            </div>
          )}
          {showTransliterationCard && (
            <div className="salah-text-card">
              <div className="salah-text-card-label">{t("transliteration_label")}</div>
              <div className="salah-translit-text">{step.transliteration}</div>
            </div>
          )}
          {showTranslationCard && (
            <div className="salah-text-card">
              <div className="salah-text-card-label">{t("translation_content_label")}</div>
              <div className="salah-translation-text">{resolveText(step.translation)}</div>
            </div>
          )}

          <div className="salah-toggle-row">
            <button
              onClick={() => setShowArabic((v) => !v)}
              className={"salah-toggle-btn" + (showArabic ? " is-active" : "")}
              aria-pressed={showArabic}
            >
              {t("arabic_label")}
            </button>
            <button
              onClick={() => setShowTransliteration((v) => !v)}
              className={"salah-toggle-btn" + (showTransliteration ? " is-active" : "")}
              aria-pressed={showTransliteration}
            >
              {t("transliteration_label")}
            </button>
            {!translationWouldBeRedundant && (
              <button
                onClick={() => setShowTranslation((v) => !v)}
                className={"salah-toggle-btn" + (showTranslation ? " is-active" : "")}
                aria-pressed={showTranslation}
              >
                {t("translation_label")}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="salah-navbar">
        <button onClick={() => go(stepIndex - 1)} disabled={stepIndex === 0} className="salah-nav-btn salah-nav-prev">
          <span className="salah-arrow" aria-hidden="true">◀</span> {t("previous")}
        </button>
        <button
          onClick={() => go(stepIndex + 1)}
          disabled={stepIndex >= total - 1}
          className="salah-nav-btn salah-nav-next"
          style={{ color: nextTextColor }}
        >
          {t("next")} <span className="salah-arrow" aria-hidden="true">▶</span>
        </button>
      </div>

      {isImageExpanded && (
        <div
          className="salah-image-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setIsImageExpanded(false)}
        >
          <div className="salah-image-overlay-body">
            <img src={imageUrl} alt="" className="salah-image-overlay-img" />
            <h2 className="salah-image-overlay-title">{title}</h2>
            <div className="salah-image-overlay-pose">{poseLabel}</div>
          </div>
          <button
            className="salah-image-overlay-close"
            onClick={() => setIsImageExpanded(false)}
            aria-label={t("close")}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
