import { useColorScheme } from "react-native";
import colors from "@/constants/colors";
import { useSettings } from "@/context/SettingsContext";

export function useColors() {
  const systemScheme = useColorScheme();
  const { darkModeOverride } = useSettings();

  const scheme =
    darkModeOverride === "system" ? systemScheme : darkModeOverride;

  const palette =
    scheme === "dark" && "dark" in colors
      ? (colors as Record<string, typeof colors.light>).dark
      : colors.light;
  return { ...palette, radius: colors.radius };
}
