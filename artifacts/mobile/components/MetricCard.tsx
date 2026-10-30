import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  isPositive?: boolean;
  isNegative?: boolean;
  isNeutral?: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function MetricCard({
  label,
  value,
  subtitle,
  isPositive,
  isNegative,
  isNeutral,
  size = "md",
  fullWidth,
}: MetricCardProps) {
  const colors = useColors();

  const valueColor = isPositive
    ? colors.success
    : isNegative
    ? colors.destructive
    : colors.foreground;

  const bgColor = isPositive
    ? colors.successLight
    : isNegative
    ? colors.dangerLight
    : colors.card;

  const borderColor = isPositive
    ? colors.success
    : isNegative
    ? colors.destructive
    : colors.border;

  const valueFontSize = size === "lg" ? 28 : size === "sm" ? 16 : 22;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: bgColor,
          borderColor,
          borderRadius: colors.radius,
          flex: fullWidth ? 1 : undefined,
        },
      ]}
    >
      <Text style={[styles.label, { color: colors.mutedForeground }]} numberOfLines={1}>
        {label}
      </Text>
      <Text
        style={[styles.value, { color: valueColor, fontSize: valueFontSize }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    minWidth: 140,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontFamily: "Inter_700Bold",
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
});
