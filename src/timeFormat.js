// Latin digits always, like every other number in this app (i18n.jsx's formatAndroidString
// comment: Android renders repetition counts etc. in Latin numerals in every locale, verified
// on-device in Arabic). The bare "ar" locale tag this app uses happens to default to "latn"
// already, but that's an ICU/browser default, not a guarantee -- "ar-SA" resolves to "arab"
// digits with the same options, so this is pinned explicitly rather than left to chance.
const LATIN_DIGITS = { numberingSystem: "latn" };

/**
 * Mirrors TimeFormat.kt's rememberTimeFormatter(): Android reads the device's 24-hour clock
 * setting directly (`DateFormat.is24HourFormat`), which the web has no equivalent of -- this uses
 * the locale's own Intl default instead, the standard web equivalent, and still varies the
 * separator/ordering per locale the way `getBestDateTimePattern` does.
 */
export function formatPrayerTime(date, locale) {
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", ...LATIN_DIGITS }).format(date);
}

/**
 * Mirrors rememberCompactTimeFormatter(): always 24-hour, for the five-across prayer-times row
 * where an AM/PM marker on each of five entries would overflow a narrow screen.
 */
export function formatPrayerTimeCompact(date, locale) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    ...LATIN_DIGITS,
  }).format(date);
}
