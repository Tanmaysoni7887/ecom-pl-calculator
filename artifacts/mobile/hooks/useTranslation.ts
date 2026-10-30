import { useSettings } from "@/context/SettingsContext";
import { translations } from "@/i18n/translations";

export function useTranslation() {
  const { language } = useSettings();
  return translations[language] ?? translations.en;
}
