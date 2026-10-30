import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated as RNAnimated,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState";
import { PremiumChart } from "@/components/PremiumChart";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";
import {
  formatCompact,
  formatPercent,
  formatROAS,
  formatShortDate,
} from "@/utils/formatters";

type DrillKey = "revenue" | "profit" | "roas" | "margin" | null;

interface DrillItem {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

// ── Animated KPI Card ──────────────────────────────────────────────────────
function StatCard({
  label, value, sub, positive, icon, color, gradient, onPress, index,
}: {
  label: string; value: string; sub?: string; positive?: boolean;
  icon: string; color: string; gradient: [string, string];
  onPress?: () => void; index: number;
}) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()} style={[styles.statCardWrap, animStyle]}>
      <TouchableOpacity
        onPress={() => {
          scale.value = withSpring(0.94, { damping: 12 }, () => {
            scale.value = withSpring(1, { damping: 12 });
          });
          onPress?.();
        }}
        activeOpacity={1}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.statCard, { borderRadius: colors.radius + 2 }]}
        >
          <View style={styles.statIconRow}>
            <View style={styles.statIconCircle}>
              <Feather name={icon as any} size={15} color="#fff" />
            </View>
            <Feather name="chevron-right" size={12} color="rgba(255,255,255,0.6)" />
          </View>
          <Text style={styles.statValue} adjustsFontSizeToFit numberOfLines={1}>
            {value}
          </Text>
          <Text style={styles.statLabel} numberOfLines={1}>{label}</Text>
          {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Animated Progress Bar ──────────────────────────────────────────────────
function AnimatedBar({ pct, color }: { pct: number; color: string }) {
  const width = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    RNAnimated.timing(width, {
      toValue: pct,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  return (
    <View style={styles.barTrack}>
      <RNAnimated.View
        style={[
          styles.barFill,
          {
            backgroundColor: color,
            width: width.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
          },
        ]}
      />
    </View>
  );
}

// ── Animated Chart Card ────────────────────────────────────────────────────
function ChartCard({
  title, children, badge, badgeColor, index,
}: {
  title: string; children: React.ReactNode;
  badge?: string; badgeColor?: string; index?: number;
}) {
  const colors = useColors();
  return (
    <Animated.View
      entering={FadeInUp.delay((index ?? 0) * 120).springify()}
      style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
    >
      <View style={styles.chartHeader}>
        <Text style={[styles.chartTitle, { color: colors.foreground }]}>{title}</Text>
        {badge ? (
          <View style={[styles.badge, { backgroundColor: (badgeColor ?? colors.primary) + "22" }]}>
            <Text style={[styles.badgeText, { color: badgeColor ?? colors.primary }]}>{badge}</Text>
          </View>
        ) : null}
      </View>
      {children}
    </Animated.View>
  );
}

function SectionLabel({ title }: { title: string }) {
  const colors = useColors();
  return (
    <Animated.View entering={FadeInDown.springify()}>
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{title}</Text>
    </Animated.View>
  );
}

// ── Drill Row ────────────────────────────────────────────────────────────
function DrillRow({ item, index }: { item: DrillItem; index: number }) {
  const colors = useColors();
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).springify()}
      style={[styles.drillRow, { borderBottomColor: colors.border }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.drillLabel, { color: colors.foreground }]}>{item.label}</Text>
        {item.sub ? <Text style={[styles.drillSub, { color: colors.mutedForeground }]}>{item.sub}</Text> : null}
      </View>
      <Text style={[styles.drillValue, { color: item.color ?? colors.foreground }]}>{item.value}</Text>
    </Animated.View>
  );
}

export default function InsightsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const t = useTranslation();
  const { calculations, stores } = useData();
  const [drill, setDrill] = useState<DrillKey>(null);

  const botPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 60;

  const sorted = useMemo(
    () => [...calculations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [calculations]
  );

  const totalRevenue = calculations.reduce((s, c) => s + c.results.adjustedRevenue, 0);
  const totalProfit = calculations.reduce((s, c) => s + c.results.netProfit, 0);
  const totalSpend = calculations.reduce((s, c) => s + c.adSpend, 0);
  const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const avgMargin = calculations.length > 0
    ? calculations.reduce((s, c) => s + c.results.profitMargin, 0) / calculations.length : 0;

  const revenueData = sorted.slice(-12).map((c) => ({ label: formatShortDate(c.date), value: c.results.adjustedRevenue }));
  const profitData = sorted.slice(-12).map((c) => ({ label: formatShortDate(c.date), value: c.results.netProfit }));
  const roasData = sorted.slice(-12).map((c) => ({ label: formatShortDate(c.date), value: c.results.roas }));

  const topProducts = useMemo(() => {
    const map = new Map<string, { profit: number; revenue: number; roas: number; count: number }>();
    calculations.forEach((c) => {
      const e = map.get(c.productName) ?? { profit: 0, revenue: 0, roas: 0, count: 0 };
      map.set(c.productName, { profit: e.profit + c.results.netProfit, revenue: e.revenue + c.results.adjustedRevenue, roas: e.roas + c.results.roas, count: e.count + 1 });
    });
    return Array.from(map.entries())
      .map(([name, v]) => ({ name, profit: v.profit, revenue: v.revenue, roas: v.count > 0 ? v.roas / v.count : 0, count: v.count }))
      .sort((a, b) => b.profit - a.profit).slice(0, 5);
  }, [calculations]);

  const platformBreakdown = useMemo(() => {
    const map = new Map<string, { revenue: number; spend: number; profit: number; count: number }>();
    calculations.forEach((c) => {
      const e = map.get(c.adPlatform) ?? { revenue: 0, spend: 0, profit: 0, count: 0 };
      map.set(c.adPlatform, { revenue: e.revenue + c.results.adjustedRevenue, spend: e.spend + c.adSpend, profit: e.profit + c.results.netProfit, count: e.count + 1 });
    });
    return Array.from(map.entries())
      .map(([platform, v]) => ({ platform, roas: v.spend > 0 ? v.revenue / v.spend : 0, revenue: v.revenue, profit: v.profit, count: v.count }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [calculations]);

  const storeBreakdown = useMemo(() => {
    const storeMap = new Map(stores.map((s) => [s.id, s.name]));
    const map = new Map<string, { revenue: number; profit: number; spend: number; count: number }>();
    calculations.forEach((c) => {
      const e = map.get(c.storeId) ?? { revenue: 0, profit: 0, spend: 0, count: 0 };
      map.set(c.storeId, { revenue: e.revenue + c.results.adjustedRevenue, profit: e.profit + c.results.netProfit, spend: e.spend + c.adSpend, count: e.count + 1 });
    });
    return Array.from(map.entries())
      .map(([id, v]) => ({ name: storeMap.get(id) ?? "Unknown", profit: v.profit, revenue: v.revenue, roas: v.spend > 0 ? v.revenue / v.spend : 0, count: v.count }))
      .sort((a, b) => b.profit - a.profit);
  }, [calculations, stores]);

  const drillData: DrillItem[] = useMemo(() => {
    if (!drill) return [];
    if (drill === "revenue") return [
      { label: "Total Revenue", value: formatCompact(totalRevenue), sub: "All-time adjusted revenue" },
      { label: "Avg per Entry", value: formatCompact(totalRevenue / Math.max(calculations.length, 1)), sub: "Average adjusted revenue" },
      { label: "Total Orders", value: String(calculations.reduce((s, c) => s + c.numberOfOrders, 0)), sub: "Across all calculations" },
      { label: "Total Ad Spend", value: formatCompact(totalSpend), sub: "All ad spend combined" },
      ...platformBreakdown.map((p) => ({ label: p.platform, value: formatCompact(p.revenue), sub: `${p.count} calc${p.count !== 1 ? "s" : ""}`, color: colors.primary })),
    ];
    if (drill === "profit") {
      const wins = calculations.filter((c) => c.results.netProfit > 0).length;
      const losses = calculations.filter((c) => c.results.netProfit <= 0).length;
      return [
        { label: "Total Net Profit", value: formatCompact(totalProfit), sub: "After all costs & fees", color: totalProfit >= 0 ? colors.success : colors.destructive },
        { label: "Winning Calculations", value: String(wins), sub: "Profitable entries", color: colors.success },
        { label: "Losing Calculations", value: String(losses), sub: "Unprofitable entries", color: colors.destructive },
        { label: "Win Rate", value: formatPercent(calculations.length > 0 ? (wins / calculations.length) * 100 : 0), sub: "% profitable" },
        { label: "Best Product", value: topProducts[0]?.name ?? "—", sub: formatCompact(topProducts[0]?.profit ?? 0) },
      ];
    }
    if (drill === "roas") {
      const above2 = calculations.filter((c) => c.results.roas >= 2).length;
      return [
        { label: "Average ROAS", value: formatROAS(avgROAS), sub: "Revenue ÷ Ad Spend" },
        { label: "Total Ad Spend", value: formatCompact(totalSpend), sub: "All ad spend combined" },
        { label: "ROAS ≥ 2x", value: String(above2), sub: "Good performance", color: colors.success },
        { label: "ROAS < 2x", value: String(calculations.length - above2), sub: "Needs optimization", color: colors.warning },
        ...platformBreakdown.map((p) => ({ label: p.platform + " ROAS", value: formatROAS(p.roas), sub: `${p.count} calc${p.count !== 1 ? "s" : ""}`, color: p.roas >= 2 ? colors.success : colors.warning })),
      ];
    }
    if (drill === "margin") return [
      { label: "Average Margin", value: formatPercent(avgMargin), sub: "Net profit ÷ revenue", color: avgMargin >= 0 ? colors.success : colors.destructive },
      { label: "Margin > 20%", value: String(calculations.filter((c) => c.results.profitMargin > 20).length), sub: "Healthy margin entries", color: colors.success },
      { label: "Margin 0–20%", value: String(calculations.filter((c) => c.results.profitMargin > 0 && c.results.profitMargin <= 20).length), sub: "Low but positive", color: colors.warning },
      { label: "Negative Margin", value: String(calculations.filter((c) => c.results.profitMargin <= 0).length), sub: "Unprofitable", color: colors.destructive },
      ...storeBreakdown.slice(0, 4).map((s) => ({ label: s.name, value: formatCompact(s.profit), sub: `${s.count} calc${s.count !== 1 ? "s" : ""}`, color: s.profit >= 0 ? colors.success : colors.destructive })),
    ];
    return [];
  }, [drill, calculations, totalRevenue, totalProfit, avgROAS, avgMargin, totalSpend, platformBreakdown, storeBreakdown, topProducts, colors]);

  const drillTitle = drill === "revenue" ? t.totalRevenue : drill === "profit" ? t.totalProfit : drill === "roas" ? t.avgROAS : t.avgMargin;

  const GRADIENTS: [string, string][] = [
    ["#6366F1", "#8B5CF6"],
    [totalProfit >= 0 ? "#10B981" : "#EF4444", totalProfit >= 0 ? "#059669" : "#DC2626"],
    ["#F59E0B", "#F97316"],
    [avgMargin >= 0 ? "#06B6D4" : "#EF4444", avgMargin >= 0 ? "#3B82F6" : "#DC2626"],
  ];
  const PLATFORM_COLORS = [colors.primary, colors.purple, colors.cyan, colors.orange, colors.pink];

  if (calculations.length === 0) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <EmptyState icon="bar-chart-2" title={t.noData} description={t.noDataDesc} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: botPad + 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Grid */}
        <View style={styles.statsGrid}>
          {([
            { label: t.totalRevenue, value: formatCompact(totalRevenue), icon: "dollar-sign", key: "revenue" as DrillKey, gradient: GRADIENTS[0] },
            { label: t.totalProfit, value: formatCompact(totalProfit), icon: "trending-up", key: "profit" as DrillKey, gradient: GRADIENTS[1] },
            { label: t.avgROAS, value: formatROAS(avgROAS), icon: "zap", key: "roas" as DrillKey, gradient: GRADIENTS[2] },
            { label: t.avgMargin, value: formatPercent(avgMargin), icon: "percent", key: "margin" as DrillKey, gradient: GRADIENTS[3] },
          ] as const).map((card, i) => (
            <StatCard
              key={card.key ?? i}
              index={i}
              label={card.label}
              value={card.value}
              icon={card.icon}
              color={card.gradient[0]}
              gradient={card.gradient}
              onPress={() => setDrill(card.key)}
            />
          ))}
        </View>

        {/* Charts */}
        {revenueData.length >= 2 && (
          <ChartCard title={t.revenueTrend} badge={`${revenueData.length} entries`} badgeColor={colors.primary} index={0}>
            <PremiumChart data={revenueData} color={colors.primary} gradientId="rev" formatValue={(v) => formatCompact(v)} type="line" />
          </ChartCard>
        )}
        {profitData.length >= 2 && (
          <ChartCard title={t.profitTrend} badge={totalProfit >= 0 ? "Profitable" : "Loss"} badgeColor={totalProfit >= 0 ? colors.success : colors.destructive} index={1}>
            <PremiumChart data={profitData} color={totalProfit >= 0 ? colors.success : colors.destructive} gradientId="prof" formatValue={(v) => formatCompact(v)} type="bar" />
          </ChartCard>
        )}
        {roasData.length >= 2 && (
          <ChartCard title={t.roas_trend} badge={`Avg ${formatROAS(avgROAS)}`} badgeColor={colors.warning} index={2}>
            <PremiumChart data={roasData} color={colors.warning} gradientId="roas" formatValue={(v) => formatROAS(v)} type="line" />
          </ChartCard>
        )}

        {/* Top Products with animated bars */}
        {topProducts.length > 0 && (
          <>
            <SectionLabel title={t.topProducts} />
            <Animated.View
              entering={FadeInDown.delay(100).springify()}
              style={[styles.listCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
            >
              {topProducts.map((p, i) => {
                const barPct = topProducts[0].profit !== 0 ? Math.abs(p.profit / topProducts[0].profit) : 0;
                return (
                  <Animated.View
                    key={p.name}
                    entering={FadeInDown.delay(i * 80).springify()}
                    style={[styles.listRow, i < topProducts.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
                  >
                    <View style={[styles.rankBadge, { backgroundColor: PLATFORM_COLORS[i % PLATFORM_COLORS.length] + "25" }]}>
                      <Text style={[styles.rankText, { color: PLATFORM_COLORS[i % PLATFORM_COLORS.length] }]}>{i + 1}</Text>
                    </View>
                    <View style={styles.listMid}>
                      <Text style={[styles.listName, { color: colors.foreground }]} numberOfLines={1}>{p.name}</Text>
                      <AnimatedBar pct={barPct} color={p.profit >= 0 ? colors.success : colors.destructive} />
                    </View>
                    <View style={styles.listRight}>
                      <Text style={[styles.listProfit, { color: p.profit >= 0 ? colors.success : colors.destructive }]}>
                        {p.profit >= 0 ? "+" : ""}{formatCompact(p.profit)}
                      </Text>
                      <Text style={[styles.listRoas, { color: colors.mutedForeground }]}>{formatROAS(p.roas)} ROAS</Text>
                    </View>
                  </Animated.View>
                );
              })}
            </Animated.View>
          </>
        )}

        {/* Ad Platforms */}
        {platformBreakdown.length > 0 && (
          <>
            <SectionLabel title={t.adPlatforms} />
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              style={[styles.listCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
            >
              {platformBreakdown.map((p, i) => (
                <Animated.View
                  key={p.platform}
                  entering={FadeInDown.delay(i * 60).springify()}
                  style={[styles.listRow, i < platformBreakdown.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
                >
                  <View style={[styles.platformDot, { backgroundColor: PLATFORM_COLORS[i % PLATFORM_COLORS.length] }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.listName, { color: colors.foreground }]}>{p.platform}</Text>
                    <Text style={[styles.listRoas, { color: colors.mutedForeground }]}>{p.count} calc{p.count !== 1 ? "s" : ""}</Text>
                  </View>
                  <View style={styles.listRight}>
                    <Text style={[styles.listProfit, { color: colors.foreground }]}>{formatCompact(p.revenue)}</Text>
                    <Text style={[styles.listRoas, { color: p.roas >= 2 ? colors.success : colors.warning }]}>{formatROAS(p.roas)} ROAS</Text>
                  </View>
                </Animated.View>
              ))}
            </Animated.View>
          </>
        )}

        {/* Store Performance */}
        {storeBreakdown.length > 0 && (
          <>
            <SectionLabel title={t.storePerformance} />
            <Animated.View
              entering={FadeInDown.delay(300).springify()}
              style={[styles.listCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
            >
              {storeBreakdown.map((s, i) => (
                <Animated.View
                  key={s.name}
                  entering={FadeInDown.delay(i * 60).springify()}
                  style={[styles.listRow, i < storeBreakdown.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
                >
                  <View style={[styles.storeIconBox, { backgroundColor: PLATFORM_COLORS[i % PLATFORM_COLORS.length] + "25" }]}>
                    <Feather name="shopping-bag" size={14} color={PLATFORM_COLORS[i % PLATFORM_COLORS.length]} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.listName, { color: colors.foreground }]} numberOfLines={1}>{s.name}</Text>
                    <Text style={[styles.listRoas, { color: colors.mutedForeground }]}>{s.count} calc{s.count !== 1 ? "s" : ""} · {formatROAS(s.roas)} ROAS</Text>
                  </View>
                  <View style={styles.listRight}>
                    <Text style={[styles.listProfit, { color: s.profit >= 0 ? colors.success : colors.destructive }]}>
                      {s.profit >= 0 ? "+" : ""}{formatCompact(s.profit)}
                    </Text>
                    <Text style={[styles.listRoas, { color: colors.mutedForeground }]}>{formatCompact(s.revenue)} rev</Text>
                  </View>
                </Animated.View>
              ))}
            </Animated.View>
          </>
        )}
      </ScrollView>

      {/* Drill-down modal */}
      <Modal visible={drill !== null} transparent animationType="slide" onRequestClose={() => setDrill(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <LinearGradient colors={["#6366F1", "#8B5CF6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalTitleBar}>
              <Text style={styles.modalTitle}>{drillTitle}</Text>
              <TouchableOpacity onPress={() => setDrill(null)} style={styles.closeX} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Feather name="x" size={18} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
            <ScrollView showsVerticalScrollIndicator={false}>
              {drillData.map((item, i) => (
                <DrillRow key={i} item={item} index={i} />
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  statCardWrap: { width: "48%", flex: undefined },
  statCard: { padding: 16, minHeight: 110 },
  statIconRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  statIconCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff", marginBottom: 4 },
  statLabel: { fontSize: 11, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: 0.4 },
  statSub: { fontSize: 10, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.65)", marginTop: 3 },
  sectionLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.6, marginTop: 20, marginBottom: 10 },
  chartCard: { borderWidth: 1, padding: 16, marginBottom: 14 },
  chartHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  chartTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  listCard: { borderWidth: 1, overflow: "hidden", marginBottom: 14 },
  listRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 12, gap: 12 },
  rankBadge: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  rankText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  listMid: { flex: 1 },
  listName: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 6 },
  barTrack: { height: 5, borderRadius: 3, backgroundColor: "rgba(0,0,0,0.08)", overflow: "hidden" },
  barFill: { height: 5, borderRadius: 3 },
  listRight: { alignItems: "flex-end" },
  listProfit: { fontSize: 14, fontFamily: "Inter_700Bold" },
  listRoas: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  platformDot: { width: 10, height: 10, borderRadius: 5 },
  storeIconBox: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, overflow: "hidden", maxHeight: "80%" },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginTop: 10, marginBottom: 4 },
  modalTitleBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16 },
  modalTitle: { flex: 1, fontSize: 17, fontFamily: "Inter_700Bold", color: "#fff" },
  closeX: { width: 32, height: 32, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 16 },
  drillRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
  drillLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  drillSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  drillValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
});
