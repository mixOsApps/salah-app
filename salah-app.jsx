import { I18nProvider, useI18n } from "./src/i18n";
import { useHashRoute, navigate } from "./src/useHashRoute";
import HomeScreen from "./src/screens/HomeScreen";
import PrayerDetailScreen from "./src/screens/PrayerDetailScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import prayersData from "./src/generated/prayers.json";

function AppShell() {
  const route = useHashRoute();
  const { ready } = useI18n();

  if (!ready) return null;

  if (route.screen === "settings") {
    return <SettingsScreen onBack={() => navigate("/")} />;
  }

  if (route.screen === "prayer") {
    const prayer = prayersData.prayers.find((p) => p.id === route.id);
    if (prayer) {
      return <PrayerDetailScreen prayer={prayer} onBack={() => navigate("/")} />;
    }
  }

  return (
    <HomeScreen
      prayers={prayersData.prayers}
      onPrayerClick={(id) => navigate(`/prayer/${id}`)}
      onSettingsClick={() => navigate("/settings")}
    />
  );
}

export default function SalahApp() {
  return (
    <I18nProvider>
      <AppShell />
    </I18nProvider>
  );
}
