import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Language } from "@/i18n/translations";

export const CURRENCIES = [
  { code: "USD", symbol: "$",   label: "US Dollar" },
  { code: "INR", symbol: "₹",   label: "Indian Rupee" },
  { code: "EUR", symbol: "€",   label: "Euro" },
  { code: "GBP", symbol: "£",   label: "British Pound" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham" },
  { code: "JPY", symbol: "¥",   label: "Japanese Yen" },
  { code: "CNY", symbol: "¥",   label: "Chinese Yuan" },
  { code: "CAD", symbol: "CA$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "A$",  label: "Australian Dollar" },
  { code: "BRL", symbol: "R$",  label: "Brazilian Real" },
  { code: "MXN", symbol: "MX$", label: "Mexican Peso" },
  { code: "SGD", symbol: "S$",  label: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", label: "Hong Kong Dollar" },
  { code: "KRW", symbol: "₩",   label: "South Korean Won" },
  { code: "TRY", symbol: "₺",   label: "Turkish Lira" },
  { code: "IDR", symbol: "Rp",  label: "Indonesian Rupiah" },
  { code: "MYR", symbol: "RM",  label: "Malaysian Ringgit" },
  { code: "PHP", symbol: "₱",   label: "Philippine Peso" },
  { code: "PKR", symbol: "₨",   label: "Pakistani Rupee" },
  { code: "NGN", symbol: "₦",   label: "Nigerian Naira" },
  { code: "ZAR", symbol: "R",   label: "South African Rand" },
  { code: "THB", symbol: "฿",   label: "Thai Baht" },
];

interface SettingsContextType {
  darkModeOverride: "system" | "light" | "dark";
  setDarkModeOverride: (v: "system" | "light" | "dark") => Promise<void>;
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  currency: string;
  currencySymbol: string;
  setCurrency: (code: string) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

const SETTINGS_KEY = "@ecom_pl_settings";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [darkModeOverride, setDarkModeOverrideState] = useState<"system" | "light" | "dark">("system");
  const [language, setLanguageState] = useState<Language>("en");
  const [currency, setCurrencyState] = useState("USD");

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.darkModeOverride) setDarkModeOverrideState(parsed.darkModeOverride);
          if (parsed.language) setLanguageState(parsed.language);
          if (parsed.currency) setCurrencyState(parsed.currency);
        } catch {}
      }
    });
  }, []);

  const save = useCallback(async (data: object) => {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
  }, []);

  const setDarkModeOverride = useCallback(async (v: "system" | "light" | "dark") => {
    setDarkModeOverrideState(v);
    await save({ darkModeOverride: v, language, currency });
  }, [language, currency, save]);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    await save({ darkModeOverride, language: lang, currency });
  }, [darkModeOverride, currency, save]);

  const setCurrency = useCallback(async (code: string) => {
    setCurrencyState(code);
    await save({ darkModeOverride, language, currency: code });
  }, [darkModeOverride, language, save]);

  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? currency + " ";

  return (
    <SettingsContext.Provider value={{ darkModeOverride, setDarkModeOverride, language, setLanguage, currency, currencySymbol, setCurrency }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
