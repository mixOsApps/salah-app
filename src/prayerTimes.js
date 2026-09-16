import { CalculationMethod, Coordinates, Madhab, PrayerTimes, SunnahTimes } from "adhan";

// Mirrors PrayerManager.kt's `methodIndex` `when` block exactly: same order, same default
// (index 0 / unrecognised -> Muslim World League) -- this is the index PreferenceManager.
// calculationMethod and the exported "calculation_methods" string array both use.
const CALCULATION_METHODS = [
  CalculationMethod.MuslimWorldLeague,
  CalculationMethod.NorthAmerica,
  CalculationMethod.Egyptian,
  CalculationMethod.UmmAlQura,
  CalculationMethod.Karachi,
  CalculationMethod.Dubai,
  CalculationMethod.Kuwait,
  CalculationMethod.Qatar,
  CalculationMethod.Singapore,
];

/**
 * Mirrors PrayerManager.getPrayerTimes(): same (0,0) "no location saved" sentinel as
 * PreferenceManager.hasLocation, same madhab mapping (1 -> Hanafi, else Shafi), same six prayer
 * times plus `qiyam` (SunnahTimes.lastThirdOfTheNight). There is no `witr` entry -- the Adhan
 * library does not calculate a fixed Witr time, on Android or here.
 */
export function getPrayerTimes(latitude, longitude, calculationMethod, madhab, date = new Date()) {
  if (latitude === 0 && longitude === 0) return null;

  const coordinates = new Coordinates(latitude, longitude);
  const methodFn = CALCULATION_METHODS[calculationMethod] ?? CalculationMethod.MuslimWorldLeague;
  const params = methodFn();
  params.madhab = madhab === 1 ? Madhab.Hanafi : Madhab.Shafi;

  const prayerTimes = new PrayerTimes(coordinates, date, params);
  const sunnahTimes = new SunnahTimes(prayerTimes);

  return {
    fajr: prayerTimes.fajr,
    sunrise: prayerTimes.sunrise,
    dhuhr: prayerTimes.dhuhr,
    asr: prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha: prayerTimes.isha,
    qiyam: sunnahTimes.lastThirdOfTheNight,
  };
}
