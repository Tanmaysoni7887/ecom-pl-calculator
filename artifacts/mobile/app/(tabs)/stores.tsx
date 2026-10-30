import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ConfirmSheet } from "@/components/ConfirmSheet";
import { EmptyState } from "@/components/EmptyState";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";
import { formatCompact, formatROAS } from "@/utils/formatters";

const GRADIENTS: [string, string][] = [
  ["#6366F1", "#8B5CF6"],
  ["#10B981", "#059669"],
  ["#F59E0B", "#EF4444"],
  ["#EC4899", "#8B5CF6"],
  ["#06B6D4", "#3B82F6"],
  ["#F97316", "#EF4444"],
];

function AnimatedStoreCard({
  store,
  calcCount,
  totalRevenue,
  totalProfit,
  avgROAS,
  gradient,
  index,
  onEdit,
  onDelete,
}: {
  store: { id: string; name: string; platform: string; currency: string };
  calcCount: number;
  totalRevenue: number;
  totalProfit: number;
  avgROAS: number;
  gradient: [string, string];
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const isProfit = totalProfit >= 0;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function onPressIn() {
    scale.value = withSpring(0.97, { damping: 15 });
  }
  function onPressOut() {
    scale.value = withSpring(1, { damping: 15 });
  }

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()} style={[animStyle, styles.cardWrap]}>
      <TouchableOpacity
        onPress={onEdit}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius + 2 }]}>
          {/* Gradient banner */}
          <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradBanner}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerLeft}>
                <View style={styles.iconCircle}>
                  <Feather name="shopping-bag" size={22} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.storeName} numberOfLines={1}>{store.name}</Text>
                  <Text style={styles.storeMeta}>{store.platform} · {calcCount} calc{calcCount !== 1 ? "s" : ""}</Text>
                </View>
              </View>
              {/* Action buttons */}
              <View style={styles.actionCol}>
                <TouchableOpacity
                  onPress={onEdit}
                  style={styles.actionCircle}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather name="edit-2" size={13} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onDelete}
                  style={[styles.actionCircle, { backgroundColor: "rgba(239,68,68,0.8)" }]}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather name="trash-2" size={13} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statVal, { color: colors.foreground }]}>{formatCompact(totalRevenue)}</Text>
              <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Revenue</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.stat}>
              <Text style={[styles.statVal, { color: isProfit ? colors.success : colors.destructive }]}>
                {isProfit ? "+" : ""}{formatCompact(totalProfit)}
              </Text>
              <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Net Profit</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.stat}>
              <Text style={[styles.statVal, { color: avgROAS >= 2 ? colors.success : avgROAS > 0 ? colors.warning : colors.mutedForeground }]}>
                {formatROAS(avgROAS)}
              </Text>
              <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Avg ROAS</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function StoresScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const t = useTranslation();
  const { stores, calculations, deleteStore } = useData();

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmName, setConfirmName] = useState("");

  const botPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 60;

  function askDelete(id: string, name: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setConfirmId(id);
    setConfirmName(name);
  }

  function doDelete() {
    if (!confirmId) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    deleteStore(confirmId);
    setConfirmId(null);
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: botPad + 8 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          stores.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={[styles.listCount, { color: colors.mutedForeground }]}>
                {stores.length} store{stores.length !== 1 ? "s" : ""}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/store/new")}
                style={[styles.newBtn, { backgroundColor: colors.primary, borderRadius: 20 }]}
              >
                <Feather name="plus" size={14} color="#fff" />
                <Text style={styles.newBtnText}>{t.newStore}</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="shopping-bag"
            title={t.noStores}
            description={t.noStoresDesc}
            actionLabel={t.createStore}
            onAction={() => router.push("/store/new")}
          />
        }
        renderItem={({ item, index }) => {
          const calcs = calculations.filter((c) => c.storeId === item.id);
          const totalRevenue = calcs.reduce((s, c) => s + c.results.adjustedRevenue, 0);
          const totalProfit = calcs.reduce((s, c) => s + c.results.netProfit, 0);
          const totalSpend = calcs.reduce((s, c) => s + c.adSpend, 0);
          const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
          return (
            <AnimatedStoreCard
              store={item}
              gradient={GRADIENTS[index % GRADIENTS.length]}
              calcCount={calcs.length}
              totalRevenue={totalRevenue}
              totalProfit={totalProfit}
              avgROAS={avgROAS}
              index={index}
              onEdit={() => router.push(`/store/${item.id}`)}
              onDelete={() => askDelete(item.id, item.name)}
            />
          );
        }}
      />

      {/* FAB */}
      {stores.length > 0 && (
        <TouchableOpacity
          onPress={() => router.push("/store/new")}
          style={[styles.fab, { backgroundColor: colors.primary, bottom: botPad + 16 }]}
          activeOpacity={0.85}
        >
          <Feather name="plus" size={26} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Confirm delete modal — works on both web & native */}
      <ConfirmSheet
        visible={confirmId !== null}
        title={t.deleteStore}
        message={`Delete "${confirmName}"?\n\nAll calculations for this store will also be permanently removed.`}
        confirmLabel={t.delete}
        cancelLabel={t.cancel}
        destructive
        icon="trash-2"
        onConfirm={doDelete}
        onCancel={() => setConfirmId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  listHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  listCount: { fontSize: 13, fontFamily: "Inter_500Medium" },
  newBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8 },
  newBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#fff" },
  cardWrap: { marginBottom: 16 },
  card: { borderWidth: 1, overflow: "hidden" },
  gradBanner: { paddingHorizontal: 16, paddingVertical: 16 },
  bannerContent: { flexDirection: "row", alignItems: "center" },
  bannerLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  storeName: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  storeMeta: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)", marginTop: 2 },
  actionCol: { flexDirection: "column", gap: 6, marginLeft: 8 },
  actionCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center",
  },
  statsRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 },
  stat: { flex: 1, alignItems: "center" },
  statVal: { fontSize: 15, fontFamily: "Inter_700Bold" },
  statLbl: { fontSize: 10, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.4, marginTop: 3 },
  divider: { width: 1, height: 32 },
  fab: {
    position: "absolute", right: 20,
    width: 58, height: 58, borderRadius: 29,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
});
