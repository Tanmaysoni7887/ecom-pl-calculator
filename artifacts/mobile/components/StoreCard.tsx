import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Store, CalculationRecord } from "@/context/DataContext";
import { formatCompact, formatROAS } from "@/utils/formatters";

interface StoreCardProps {
  store: Store;
  calculations: CalculationRecord[];
  onPress: () => void;
  onEdit: () => void;
}

export function StoreCard({ store, calculations, onPress, onEdit }: StoreCardProps) {
  const colors = useColors();

  const totalRevenue = calculations.reduce((s, c) => s + c.results.adjustedRevenue, 0);
  const totalProfit = calculations.reduce((s, c) => s + c.results.netProfit, 0);
  const totalSpend = calculations.reduce((s, c) => s + c.adSpend, 0);
  const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const isProfit = totalProfit >= 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <View
            style={[styles.iconBox, { backgroundColor: colors.accent, borderRadius: colors.radius - 4 }]}
          >
            <Feather name="shopping-bag" size={18} color={colors.primary} />
          </View>
          <View style={styles.nameInfo}>
            <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
              {store.name}
            </Text>
            <Text style={[styles.platform, { color: colors.mutedForeground }]}>
              {store.platform} · {store.currency} · {calculations.length} calc{calculations.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="edit-2" size={16} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Revenue</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {formatCompact(totalRevenue, store.currency)}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Net Profit</Text>
          <Text style={[styles.statValue, { color: isProfit ? colors.success : colors.destructive }]}>
            {isProfit ? "+" : ""}
            {formatCompact(totalProfit, store.currency)}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Avg ROAS</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {formatROAS(avgROAS)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, marginBottom: 12, borderWidth: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  nameRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconBox: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginRight: 12 },
  nameInfo: { flex: 1 },
  name: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  platform: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  stats: { flexDirection: "row", alignItems: "center" },
  stat: { flex: 1, alignItems: "center" },
  statLabel: { fontSize: 11, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 },
  statValue: { fontSize: 15, fontFamily: "Inter_700Bold" },
  divider: { width: 1, height: 32 },
});
