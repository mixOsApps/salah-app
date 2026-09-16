import { I18nProvider, useI18n } from "./src/i18n";
import { useHashRoute, navigate } from "./src/useHashRoute";
import HomeScreen from "./src/screens/HomeScreen";
import PrayerDetailScreen from "./src/screens/PrayerDetailScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import ArticleScreen from "./src/screens/ArticleScreen";
import GlossaryScreen from "./src/screens/GlossaryScreen";
import prayersData from "./src/generated/prayers.json";
import articlesData from "./src/generated/articles.json";
import glossaryData from "./src/generated/glossary.json";

function AppShell() {
  const route = useHashRoute();
  const { ready } = useI18n();

  if (!ready) return null;

  if (route.screen === "settings") {
    return <SettingsScreen onBack={() => navigate("/")} />;
  }

  if (route.screen === "glossary") {
    return <GlossaryScreen glossary={glossaryData} onBack={() => navigate("/")} />;
  }

  if (route.screen === "article") {
    const article = articlesData.articles.find((a) => a.id === route.id);
    if (article) {
      return <ArticleScreen article={article} onBack={() => navigate("/")} />;
    }
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
      articles={articlesData.articles}
      glossary={glossaryData}
      onPrayerClick={(id) => navigate(`/prayer/${id}`)}
      onArticleClick={(id) => navigate(`/article/${id}`)}
      onGlossaryClick={() => navigate("/glossary")}
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
