import { useState } from "react";
import { useI18n } from "../i18n";
import { useSettings } from "../settings";

const GEOLOCATION_OPTIONS = { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 };

/**
 * Mirrors LocationAction.kt's request-then-fetch flow, simplified for the browser's permission
 * model: the Permissions API's "denied" state has no equivalent of Android's distinction between
 * "denied, can ask again" and "denied permanently" (shouldShowRequestPermissionRationale), and
 * there is no cross-browser deep link to a site's permission settings the way
 * ACTION_APPLICATION_DETAILS_SETTINGS opens Android's. So "denied" here just keeps offering the
 * same enable button -- retapping it re-fails the same way until the reader changes the browser's
 * own site permission, which is the standard web UX for this (usually the address-bar padlock).
 *
 * No `onLocationUpdated` callback, unlike Android: `setLocation` updates SettingsProvider's
 * context, and HomeScreen already subscribes to latitude/longitude there, so it recomputes prayer
 * times on its own -- Android needs the callback only because PreferenceManager is a plain mutable
 * object with no reactivity of its own.
 */
export default function LocationAction() {
  const { t } = useI18n();
  const { setLocation } = useSettings();
  const [status, setStatus] = useState("idle"); // idle | finding | unavailable | denied

  function fetchLocation() {
    if (!navigator.geolocation) {
      setStatus("unavailable");
      return;
    }
    setStatus("finding");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords.latitude, position.coords.longitude);
        setStatus("idle");
      },
      (error) => {
        setStatus(error.code === error.PERMISSION_DENIED ? "denied" : "unavailable");
      },
      GEOLOCATION_OPTIONS
    );
  }

  const statusText =
    status === "finding"
      ? t("location_finding")
      : status === "unavailable"
        ? t("location_unavailable")
        : status === "denied"
          ? t("location_denied")
          : null;

  return (
    <div className="salah-location-action">
      {statusText && <p className="salah-location-status">{statusText}</p>}
      {status !== "finding" && (
        <button type="button" className="salah-location-btn" onClick={fetchLocation}>
          {t("location_enable_action")}
        </button>
      )}
    </div>
  );
}
