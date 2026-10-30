import { useSettings } from "@/context/SettingsContext";

export function useCurrency() {
  const { currency, currencySymbol } = useSettings();
  return { currency, currencySymbol };
}
