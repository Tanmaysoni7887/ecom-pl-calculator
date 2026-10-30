import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { CalculationRecord } from "@/context/DataContext";
import { formatCompact, formatROAS, formatShortDate } from "@/utils/formatters";

interface HistoryCardProps {
  calc: CalculationRecord;
  storeName: string;
  onPress: () => void;
}

export function HistoryCard({ calc, storeName, onPress }: HistoryCardProps) {
  const colors = useColors();
  const profit = calc.results.netProfit;
  const isProfit = profit >= 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View style={styles.left}>
        <View
          style={[
            styles.indicator,
            { backgroundColor: isProfit ? colors.success : colors.destructive, borderRadius: 3 },
          ]}
        />
        <View style={styles.info}>
          <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={1}>
            {calc.productName}
          </Text>
          <View style={styles.meta}>
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              {storeName}
            </Text>
            <Text style={[styles.dot, { color: colors.border }]}> · </Text>
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              {calc.adPlatform}
            </Text>
            <Text style={[styles.dot, { color: colors.border }]}> · </Text>
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              {formatShortDate(calc.date)}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.right}>
        <Text
          style={[
            styles.profit,
            { color: isProfit ? colors.success : colors.destructive },
          ]}
        >
          {isProfit ? "+" : ""}
          {formatCompact(profit)}
        </Text>
        <Text style={[styles.roas, { color: colors.mutedForeground }]}>
          {formatROAS(calc.results.roas)} ROAS
        </Text>
      </View>
      <Feather name="chevron-right" size={16} color={colors.mutedForeground} style={styles.chevron} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 8 },
  indicator: { width: 3, height: 40, marginRight: 12, flexShrink: 0 },
  info: { flex: 1 },
  productName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  meta: { flexDirection: "row", alignItems: "center", flexWrap: "nowrap" },
  metaText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  dot: { fontSize: 11 },
  right: { alignItems: "flex-end", marginRight: 6 },
  profit: { fontSize: 15, fontFamily: "Inter_700Bold" },
  roas: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  chevron: { flexShrink: 0 },
});
