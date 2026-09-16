import { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import localesConfig from "./generated/locales.json";

// Every strings_*.xml file the exporter reads, per locale. The exporter guarantees no key
// appears in two of them, so they can be merged into one flat lookup per locale.
const STRING_FILES = [
  "strings",
  "strings_articles",
  "strings_glossary",
  "strings_mistakes",
  "strings_qada",
  "strings_travel",
  "strings_wudu",
];

// Non-eager: each locale's JSON is its own dynamic import, so switching languages fetches only
// what's needed and the other two locales never enter the initial bundle.
const stringModules = import.meta.glob("./generated/strings/*/*.json");

export const LOCALE_TAGS = localesConfig.tags;

const STORAGE_KEY = "salah-language";
const MISSING_KEY_PREFIX = "❓missing:";

function detectLocale(tags) {
  const navLangs =
    typeof navigator !== "undefined" && navigator.languages && navigator.languages.length
      ? navigator.languages
      : [typeof navigator !== "undefined" ? navigator.language : "en"];
  for (const raw of navLangs) {
    const base = String(raw).toLowerCase().split("-")[0];
    if ((base === "fil" || base === "tl") && tags.includes("fil")) return "fil";
    if (base === "ar" && tags.includes("ar")) return "ar";
    if (base === "en" && tags.includes("en")) return "en";
  }
  return tags.includes("en") ? "en" : tags[0];
}

function getInitialLocale(tags) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && tags.includes(stored)) return stored;
  } catch {
    // localStorage unavailable (private mode, etc.) -- fall through to detection.
  }
  return detectLocale(tags);
}

function setStoredLocale(tag) {
  try {
    localStorage.setItem(STORAGE_KEY, tag);
  } catch {
    // Nothing to persist to -- the explicit choice just won't survive a reload.
  }
}

async function loadLocaleData(tag) {
  const strings = {};
  const plurals = {};
  for (const file of STRING_FILES) {
    const loader = stringModules[`./generated/strings/${tag}/${file}.json`];
    const mod = await loader();
    Object.assign(strings, mod.default.strings);
    Object.assign(plurals, mod.default.plurals);
  }
  return { strings, plurals };
}

function missing(key) {
  console.warn(`[i18n] missing string key: ${key}`);
  return `${MISSING_KEY_PREFIX}${key}`;
}

function lookupString(data, key) {
  return Object.prototype.hasOwnProperty.call(data.strings, key) ? data.strings[key] : missing(key);
}

// Android's format specifiers only: %1$s / %2$d (positional) and bare %s / %d (consumed in the
// order they appear). No other conversion (%f, %x, ...) is used by this app's resources.
const FORMAT_SPEC_RE = /%(\d+\$)?[sd]|%%/g;

function formatAndroidString(template, args) {
  if (!args || args.length === 0) return template;
  let seq = 0;
  return template.replace(FORMAT_SPEC_RE, (match, posGroup) => {
    if (match === "%%") return "%";
    const idx = posGroup ? parseInt(posGroup, 10) - 1 : seq++;
    const value = args[idx];
    // Never Intl.NumberFormat: Android renders these digits in Latin numerals in every locale
    // (verified on-device in Arabic), and plain String(n) is what reproduces that.
    return value === undefined ? match : String(value);
  });
}

function pluralCategory(locale, quantity, forms) {
  const category = new Intl.PluralRules(locale).select(quantity);
  return Object.prototype.hasOwnProperty.call(forms, category) ? category : "other";
}

/** Resolves a {type,key,args[,quantity]} object from the generated JSON against one locale's
 *  already-loaded data. `{res: "some_key"}` arguments are resolved in this same locale first. */
export function resolveText(entry, data, locale) {
  if (!entry) return "";
  const args = (entry.args || []).map((arg) =>
    arg && typeof arg === "object" && "res" in arg ? lookupString(data, arg.res) : arg
  );
  if (entry.type === "plural") {
    const forms = data.plurals[entry.key];
    if (!forms) return missing(entry.key);
    const category = pluralCategory(locale, entry.quantity, forms);
    return formatAndroidString(forms[category], args);
  }
  return formatAndroidString(lookupString(data, entry.key), args);
}

/** The three languages by endonym/exonym, exactly as AppLanguages.kt describes them on Android. */
export function describeLanguages(tags, uiLocale) {
  return tags.map((tag) => {
    const endonymRaw = new Intl.DisplayNames([tag], { type: "language" }).of(tag) || tag;
    const endonym = endonymRaw.charAt(0).toUpperCase() + endonymRaw.slice(1);
    const exonymRaw = new Intl.DisplayNames([uiLocale], { type: "language" }).of(tag) || "";
    const exonym = exonymRaw.toLowerCase() === endonym.toLowerCase() ? "" : exonymRaw;
    return { tag, endonym, exonym };
  });
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => getInitialLocale(LOCALE_TAGS));
  const [cache] = useState(() => new Map());
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!cache.has(locale)) cache.set(locale, loadLocaleData(locale));
    cache.get(locale).then((loaded) => {
      if (!cancelled) setData(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [locale, cache]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  useEffect(() => {
    if (data) document.title = lookupString(data, "app_name");
  }, [data]);

  const setLocale = useCallback((tag) => {
    setStoredLocale(tag);
    setLocaleState(tag);
  }, []);

  const resolve = useCallback((entry) => (data ? resolveText(entry, data, locale) : ""), [data, locale]);
  const t = useCallback((key, ...args) => resolve({ type: "plain", key, args }), [resolve]);
  const languages = useMemo(() => describeLanguages(LOCALE_TAGS, locale), [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t, resolveText: resolve, languages, ready: !!data }),
    [locale, setLocale, t, resolve, languages, data]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
