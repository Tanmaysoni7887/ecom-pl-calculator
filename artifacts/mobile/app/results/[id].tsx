import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ConfirmSheet } from "@/components/ConfirmSheet";
import { useData } from "@/context/DataContext";
import { calculate } from "@/utils/calculations";
import { shareCalculation } from "@/utils/export";
import { formatCurrency, formatDate, formatPercent, formatROAS } from "@/utils/formatters";
import { useColors } from "@/hooks/useColors";
import { useCurrency } from "@/hooks/useCurrency";

function uid() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function AnimatedMetricCard({
  label,
  value,
  sub,
  isPositive,
  isNegative,
  size = "md",
  fullWidth,
  index,
  accentColor,
}: {
  label: string;
  value: string;
  sub?: string;
  isPositive?: boolean;
  isNegative?: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  index: number;
  accentColor?: string;
}) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const valueColor = isPositive ? colors.success : isNegative ? colors.destructive : colors.foreground;
  const bgColor = isPositive ? colors.successLight : isNegative ? colors.dangerLight : colors.card;
  const borderColor = isPositive ? colors.success + "60" : isNegative ? colors.destructive + "60" : colors.border;
  const valueFontSize = size === "lg" ? 28 : size === "sm" ? 16 : 22;

  return (
    <Animated.View
      entering={FadeInLeft.delay(index * 70).springify()}
      style={[animStyle, { flex: fullWidth ? 1 : undefined }]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPressIn={() => { scale.value = withSpring(0.96, { damping: 12 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 12 }); }}
        style={[styles.metricCard, { backgroundColor: bgColor, borderColor, borderRadius: colors.radius }]}
      >
        {accentColor && <View style={[styles.metricAccent, { backgroundColor: accentColor }]} />}
        <Text style={[styles.metricLabel, { color: colors.mutedForeground }]} numberOfLines={1}>{label}</Text>
        <Text style={[styles.metricValue, { color: valueColor, fontSize: valueFontSize }]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
        {sub ? <Text style={[styles.metricSub, { color: colors.mutedForeground }]}>{sub}</Text> : null}
      </TouchableOpacity>
    </Animated.View>
  );
}

function SectionTitle({ title, icon, index }: { title: string; icon?: string; index: number }) {
  const colors = useColors();
  return (
    <Animated.View entering={FadeInDown.delay(index * 40).springify()} style={[styles.sectionRow, { borderBottomColor: colors.border }]}>
      {icon && <Feather name={icon as any} size={13} color={colors.primary} />}
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>{title}</Text>
    </Animated.View>
  );
}

function MetricRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.metricRow}>{children}</View>;
}

export default function ResultsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { calculations, stores, addCalculation, deleteCalculation } = useData();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDupConfirm, setShowDupConfirm] = useState(false);

  const calc = calculations.find((c) => c.id === id);
  const store = stores.find((s) => s.id === calc?.storeId);

  if (!calc) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Calculation not found.</Text>
      </View>
    );
  }

  const { currency } = useCurrency();
  const r = calc.results;
  const isProfit = r.netProfit >= 0;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  async function doDuplicate() {
    const duplicate = {
      ...calc,
      productName: `${calc.productName} (Copy)`,
      results: calculate({ ...calc }),
    };
    await addCalculation({ ...duplicate, id: undefined as never });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowDupConfirm(false);
  }

  async function doDelete() {
    await deleteCalculation(calc.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setShowDeleteConfirm(false);
    router.back();
  }

  const bannerGrad: [string, string] = isProfit ? ["#10B981", "#059669"] : ["#EF4444", "#DC2626"];

  let idx = 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: botPad + 16 }} showsVerticalScrollIndicator={false}>

        {/* Gradient header banner */}
        <Animated.View entering={FadeInDown.springify()}>
          <LinearGradient colors={bannerGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.topBanner}>
            <View style={styles.bannerIcon}>
              <Feather name={isProfit ? "trending-up" : "trending-down"} size={26} color="#fff" />
            </View>
            <View style={styles.bannerLeft}>
              <Text style={styles.productNameBanner} numberOfLines={2}>{calc.productName}</Text>
              <View style={styles.metaRow}>
                {store && <Text style={styles.metaTextBanner}>{store.name} · </Text>}
                <Text style={styles.metaTextBanner}>{calc.adPlatform} · </Text>
                <Text style={styles.metaTextBanner}>{formatDate(calc.date)}</Text>
              </View>
            </View>
            <View style={styles.bannerRight}>
              <Text style={styles.netProfitLabelBanner}>Net Profit</Text>
              <Text style={styles.netProfitValueBanner} adjustsFontSizeToFit numberOfLines={1}>
                {isProfit ? "+" : ""}{formatCurrency(r.netProfit, currency)}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.content}>
          {/* Quick KPI strip */}
          <Animated.View entering={FadeInDown.delay(100).springify()} style={[styles.kpiStrip, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {[
              { label: "ROAS", value: formatROAS(r.roas), color: r.roas >= r.breakevenROAS && r.breakevenROAS > 0 ? colors.success : colors.warning },
              { label: "Margin", value: formatPercent(r.profitMargin), color: r.profitMargin >= 0 ? colors.success : colors.destructive },
              { label: "CPA", value: formatCurrency(r.cpa, currency), color: colors.foreground },
              { label: "AOV", value: formatCurrency(r.aov, currency), color: colors.foreground },
            ].map((kpi, i, arr) => (
              <React.Fragment key={kpi.label}>
                <View style={styles.kpiItem}>
                  <Text style={[styles.kpiVal, { color: kpi.color }]}>{kpi.value}</Text>
                  <Text style={[styles.kpiLbl, { color: colors.mutedForeground }]}>{kpi.label}</Text>
                </View>
                {i < arr.length - 1 && <View style={[styles.kpiDiv, { backgroundColor: colors.border }]} />}
              </React.Fragment>
            ))}
          </Animated.View>

          <SectionTitle title="REVENUE" icon="dollar-sign" index={++idx} />
          <MetricRow>
            <AnimatedMetricCard label="Revenue" value={formatCurrency(r.revenue, currency)} fullWidth index={++idx} />
            <AnimatedMetricCard label="Adj. Revenue" value={formatCurrency(r.adjustedRevenue, currency)} fullWidth index={++idx} />
          </MetricRow>
          <AnimatedMetricCard label="Average Order Value" value={formatCurrency(r.aov, currency)} index={++idx} />

          <SectionTitle title="COSTS" icon="layers" index={++idx} />
          <MetricRow>
            <AnimatedMetricCard label="Total COGS" value={formatCurrency(r.totalCOGS, currency)} isNegative fullWidth index={++idx} accentColor={colors.destructive} />
            <AnimatedMetricCard label="Total Fees" value={formatCurrency(r.totalFees, currency)} isNegative fullWidth index={++idx} accentColor={colors.destructive} />
          </MetricRow>
          <AnimatedMetricCard label="Total Variable Costs" value={formatCurrency(r.totalVariableCosts, currency)} isNegative index={++idx} />

          <SectionTitle title="PROFITABILITY" icon="trending-up" index={++idx} />
          <AnimatedMetricCard
            label="Net Profit"
            value={(isProfit ? "+" : "") + formatCurrency(r.netProfit, currency)}
            isPositive={isProfit} isNegative={!isProfit}
            size="lg" index={++idx}
            accentColor={isProfit ? colors.success : colors.destructive}
          />
          <MetricRow>
            <AnimatedMetricCard label="Gross Profit" value={formatCurrency(r.grossProfit, currency)} isPositive={r.grossProfit >= 0} isNegative={r.grossProfit < 0} fullWidth index={++idx} />
            <AnimatedMetricCard label="Profit Margin" value={formatPercent(r.profitMargin)} isPositive={r.profitMargin >= 0} isNegative={r.profitMargin < 0} fullWidth index={++idx} />
          </MetricRow>
          <AnimatedMetricCard label="Contribution Margin" value={formatPercent(r.contributionMargin)} isPositive={r.contributionMargin >= 0} isNegative={r.contributionMargin < 0} index={++idx} />

          <SectionTitle title="AD PERFORMANCE" icon="zap" index={++idx} />
          <MetricRow>
            <AnimatedMetricCard
              label="ROAS"
              value={formatROAS(r.roas)}
              isPositive={r.roas >= r.breakevenROAS && r.breakevenROAS > 0}
              isNegative={r.roas > 0 && r.breakevenROAS > 0 && r.roas < r.breakevenROAS}
              size="lg" fullWidth index={++idx}
              accentColor={colors.warning}
            />
            <AnimatedMetricCard label="Breakeven ROAS" value={formatROAS(r.breakevenROAS)} fullWidth index={++idx} />
          </MetricRow>
          <MetricRow>
            <AnimatedMetricCard label="CPA" value={formatCurrency(r.cpa, currency)} fullWidth index={++idx} />
            <AnimatedMetricCard label="CPC" value={formatCurrency(r.cpc, currency)} fullWidth index={++idx} />
          </MetricRow>

          <SectionTitle title="TRAFFIC" icon="bar-chart-2" index={++idx} />
          <MetricRow>
            <AnimatedMetricCard label="CPM" value={formatCurrency(r.cpm, currency)} fullWidth index={++idx} />
            <AnimatedMetricCard label="CTR" value={formatPercent(r.ctr)} fullWidth index={++idx} />
          </MetricRow>
          <AnimatedMetricCard label="Conversion Rate" value={formatPercent(r.conversionRate)} index={++idx} />

          <SectionTitle title="INPUTS" icon="edit-3" index={++idx} />
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={[styles.inputsGrid, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
          >
            {[
              ["Selling Price", formatCurrency(calc.sellingPrice, currency)],
              ["Orders", String(calc.numberOfOrders)],
              ["Ad Spend", formatCurrency(calc.adSpend, currency)],
              ["Product Cost", formatCurrency(calc.productCost, currency)],
              ["Shipping", formatCurrency(calc.shippingCost, currency)],
              ["Refund Rate", formatPercent(calc.refundRate)],
              ["Discount", formatPercent(calc.discount)],
              ["Chargeback", formatPercent(calc.chargebackRate)],
              ["Clicks", String(calc.numberOfClicks)],
              ["Impressions", String(calc.impressions)],
            ].map(([label, value], i) => (
              <View key={label} style={[styles.inputRow, i % 2 === 1 && { backgroundColor: colors.secondary }]}>
                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>{label}</Text>
                <Text style={[styles.inputValue, { color: colors.foreground }]}>{value}</Text>
              </View>
            ))}
          </Animated.View>

          {calc.notes ? (
            <Animated.View
              entering={FadeInDown.delay(220).springify()}
              style={[styles.notesBox, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
            >
              <Text style={[styles.notesLabel, { color: colors.mutedForeground }]}>NOTES</Text>
              <Text style={[styles.notesText, { color: colors.foreground }]}>{calc.notes}</Text>
            </Animated.View>
          ) : null}

          {/* Action buttons */}
          <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.actions}>
            <TouchableOpacity
              onPress={() => shareCalculation(calc, store?.name ?? "Unknown")}
              style={[styles.actionBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
              activeOpacity={0.8}
            >
              <Feather name="share-2" size={16} color="#fff" />
              <Text style={[styles.actionBtnText, { color: "#fff" }]}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowDupConfirm(true)}
              style={[styles.actionBtn, { backgroundColor: colors.secondary, borderRadius: colors.radius, borderWidth: 1, borderColor: colors.border }]}
              activeOpacity={0.8}
            >
              <Feather name="copy" size={16} color={colors.foreground} />
              <Text style={[styles.actionBtnText, { color: colors.foreground }]}>Duplicate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowDeleteConfirm(true)}
              style={[styles.actionBtn, { backgroundColor: colors.dangerLight, borderRadius: colors.radius, borderWidth: 1, borderColor: colors.destructive }]}
              activeOpacity={0.8}
            >
              <Feather name="trash-2" size={16} color={colors.destructive} />
              <Text style={[styles.actionBtnText, { color: colors.destructive }]}>Delete</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>

      <ConfirmSheet
        visible={showDeleteConfirm}
        title="Delete Calculation"
        message={`Delete "${calc.productName}"? This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive icon="trash-2"
        onConfirm={doDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
      <ConfirmSheet
        visible={showDupConfirm}
        title="Duplicate Calculation"
        message={`Create a copy of "${calc.productName}"?`}
        confirmLabel="Duplicate"
        cancelLabel="Cancel"
        icon="copy"
        onConfirm={doDuplicate}
        onCancel={() => setShowDupConfirm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBanner: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 16, paddingVertical: 18, gap: 12 },
  bannerIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  bannerLeft: { flex: 1 },
  productNameBanner: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#fff", marginBottom: 5 },
  metaRow: { flexDirection: "row", flexWrap: "wrap" },
  metaTextBanner: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)" },
  bannerRight: { alignItems: "flex-end" },
  netProfitLabelBanner: { fontSize: 10, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.8)", textTransform: "uppercase", marginBottom: 4 },
  netProfitValueBanner: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff" },
  // KPI strip
  kpiStrip: { flexDirection: "row", borderWidth: 1, borderRadius: 14, marginBottom: 16, overflow: "hidden" },
  kpiItem: { flex: 1, alignItems: "center", paddingVertical: 12 },
  kpiVal: { fontSize: 14, fontFamily: "Inter_700Bold" },
  kpiLbl: { fontSize: 10, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.3, marginTop: 2 },
  kpiDiv: { width: 1, height: "60%", alignSelf: "center" },
  content: { paddingHorizontal: 16, paddingTop: 14 },
  sectionRow: { flexDirection: "row", alignItems: "center", gap: 6, paddingBottom: 8, marginBottom: 12, marginTop: 8, borderBottomWidth: 1 },
  sectionTitle: { fontSize: 11, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.7 },
  metricRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  metricCard: { paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, marginBottom: 10, overflow: "hidden" },
  metricAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3 },
  metricLabel: { fontSize: 11, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  metricValue: { fontFamily: "Inter_700Bold", lineHeight: 34 },
  metricSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  inputsGrid: { borderWidth: 1, marginBottom: 12, overflow: "hidden" },
  inputRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 10 },
  inputLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  inputValue: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  notesBox: { padding: 14, borderWidth: 1, marginBottom: 12 },
  notesLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", marginBottom: 6 },
  notesText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  actions: { flexDirection: "row", gap: 10, marginTop: 12 },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 13, gap: 6 },
  actionBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});
