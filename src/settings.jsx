import { createContext, useCallback, useContext, useMemo, useState } from "react";

const STORAGE_PREFIX = "salah-";
const KEYS = {
  latitude: "latitude",
  longitude: "longitude",
  calculationMethod: "calculation-method",
  madhab: "madhab",
};

function readNumber(key, fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}

function writeNumber(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, String(value));
  } catch {
    // Nothing to persist to -- the change just won't survive a reload.
  }
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [latitude, setLatitudeState] = useState(() => readNumber(KEYS.latitude, 0));
  const [longitude, setLongitudeState] = useState(() => readNumber(KEYS.longitude, 0));
  // Defaults match PreferenceManager.kt: 0 = Muslim World League, 0 = Shafi.
  const [calculationMethod, setCalculationMethodState] = useState(() => readNumber(KEYS.calculationMethod, 0));
  const [madhab, setMadhabState] = useState(() => readNumber(KEYS.madhab, 0));

  const setLocation = useCallback((lat, lon) => {
    writeNumber(KEYS.latitude, lat);
    writeNumber(KEYS.longitude, lon);
    setLatitudeState(lat);
    setLongitudeState(lon);
  }, []);

  const setCalculationMethod = useCallback((index) => {
    writeNumber(KEYS.calculationMethod, index);
    setCalculationMethodState(index);
  }, []);

  const setMadhab = useCallback((index) => {
    writeNumber(KEYS.madhab, index);
    setMadhabState(index);
  }, []);

  // Same (0,0) sentinel as PreferenceManager.hasLocation -- "no location saved".
  const hasLocation = latitude !== 0 || longitude !== 0;

  // Mirrors Article.kt's School.readerSchoolOrNull(madhabSetting): the setting only
  // distinguishes Hanafi from a grouped "Shafi/Maliki/Hanbali" (they agree on Asr timing, which
  // is all this setting was built for), so it can identify the reader's school only when they've
  // selected Hanafi. Every other case shows every school-comparison position with equal weight
  // rather than guessing which of the other three the reader actually follows.
  const readerSchool = madhab === 1 ? "HANAFI" : null;

  const value = useMemo(
    () => ({
      latitude,
      longitude,
      calculationMethod,
      madhab,
      hasLocation,
      readerSchool,
      setLocation,
      setCalculationMethod,
      setMadhab,
    }),
    [latitude, longitude, calculationMethod, madhab, hasLocation, readerSchool, setLocation, setCalculationMethod, setMadhab]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
