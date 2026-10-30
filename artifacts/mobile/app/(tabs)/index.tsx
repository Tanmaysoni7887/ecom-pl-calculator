import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FormField } from "@/components/FormField";
import { useData } from "@/context/DataContext";
import { calculate } from "@/utils/calculations";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";
import { useCurrency } from "@/hooks/useCurrency";

const AD_PLATFORMS = ["Meta", "Google", "TikTok", "Amazon", "Pinterest", "Snapchat", "YouTube", "Other"];

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  const colors = useColors();
  return (
    <Animated.View entering={FadeInDown.springify()} style={[styles.sectionHeader, { borderBottomColor: colors.border }]}>
      <Feather name={icon as any} size={14} color={colors.primary} />
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>{title}</Text>
    </Animated.View>
  );
}

interface FormState {
  storeId: string; productName: string; sku: string; adPlatform: string; date: string;
  sellingPrice: string; discount: string; productCost: string; shippingCost: string;
  packagingCost: string; transactionFee: string; paymentGatewayFee: string; taxes: string;
  refundRate: string; chargebackRate: string; adSpend: string; numberOfOrders: string;
  numberOfClicks: string; impressions: string; otherCosts: string; notes: string;
}

const defaultForm: FormState = {
  storeId: "", productName: "", sku: "", adPlatform: "Meta",
  date: new Date().toISOString().slice(0, 10),
  sellingPrice: "", discount: "0", productCost: "", shippingCost: "0",
  packagingCost: "0", transactionFee: "0", paymentGatewayFee: "0", taxes: "0",
  refundRate: "0", chargebackRate: "0", adSpend: "", numberOfOrders: "",
  numberOfClicks: "0", impressions: "0", otherCosts: "0", notes: "",
};

export default function CalculatorScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const t = useTranslation();
  const { stores, addCalculation } = useData();

  const [form, setForm] = useState<FormState>(defaultForm);
  const { currency: currencyCode, currencySymbol: currSym } = useCurrency();

  const selectedStore = stores.find((s) => s.id === form.storeId);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [saving, setSaving] = useState(false);

  const btnScale = useSharedValue(1);
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1.04, { duration: 900 }), withTiming(1, { duration: 900 })),
      -1, true
    );
  }, []);

  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  function set(key: keyof FormState, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.productName.trim()) e.productName = "Required";
    if (!form.sellingPrice || isNaN(+form.sellingPrice) || +form.sellingPrice <= 0) e.sellingPrice = "Required";
    if (!form.productCost || isNaN(+form.productCost)) e.productCost = "Required";
    if (!form.adSpend || isNaN(+form.adSpend)) e.adSpend = "Required";
    if (!form.numberOfOrders || isNaN(+form.numberOfOrders) || +form.numberOfOrders <= 0) e.numberOfOrders = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleCalculate() {
    if (!validate()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    btnScale.value = withSpring(0.95, { damping: 10 }, () => {
      btnScale.value = withSpring(1, { damping: 10 });
    });
    setSaving(true);
    try {
      const inputs = {
        sellingPrice: +form.sellingPrice,
        discount: +form.discount,
        productCost: +form.productCost,
        shippingCost: +form.shippingCost,
        packagingCost: +form.packagingCost,
        transactionFee: +form.transactionFee,
        paymentGatewayFee: +form.paymentGatewayFee,
        taxes: +form.taxes,
        refundRate: +form.refundRate,
        chargebackRate: +form.chargebackRate,
        adSpend: +form.adSpend,
        numberOfOrders: +form.numberOfOrders,
        numberOfClicks: +form.numberOfClicks,
        impressions: +form.impressions,
        otherCosts: +form.otherCosts,
      };
      const results = calculate(inputs);
      const saved = await addCalculation({
        storeId: form.storeId,
        productName: form.productName.trim(),
        sku: form.sku.trim(),
        adPlatform: form.adPlatform,
        date: form.date,
        notes: form.notes.trim(),
        ...inputs,
        results,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push(`/results/${saved.id}`);
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSaving(false);
    }
  }

  const botPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 60;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: botPad + 16 }}
        keyboardShouldPersistTaps="handled"
        bottomOffset={80}
        showsVerticalScrollIndicator={false}
      >
        {/* Gradient hero banner */}
        <LinearGradient colors={["#6366F1", "#8B5CF6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Animated.View style={pulseStyle}>
            <View style={styles.heroIcon}>
              <Feather name="trending-up" size={28} color="#fff" />
            </View>
          </Animated.View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>{t.calculatorTitle}</Text>
            <Text style={styles.heroSub}>Enter your numbers below</Text>
          </View>
          <View style={styles.heroCurrBadge}>
            <Text style={styles.heroCurrSym}>{currSym}</Text>
            <Text style={styles.heroCurrCode}>{currencyCode}</Text>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <SectionHeader title="STORE & PRODUCT" icon="package" />

          {/* Store selector */}
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{t.selectStore}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}
            contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
            <TouchableOpacity
              onPress={() => set("storeId", "")}
              style={[styles.pill, {
                backgroundColor: !form.storeId ? colors.primary : colors.secondary,
                borderColor: !form.storeId ? colors.primary : colors.border,
              }]}
            >
              <Text style={[styles.pillTxt, { color: !form.storeId ? "#fff" : colors.mutedForeground }]}>
                {t.noStore}
              </Text>
            </TouchableOpacity>
            {stores.map((s) => (
              <TouchableOpacity
                key={s.id}
                onPress={() => set("storeId", s.id)}
                style={[styles.pill, {
                  backgroundColor: form.storeId === s.id ? colors.primary : colors.secondary,
                  borderColor: form.storeId === s.id ? colors.primary : colors.border,
                }]}
              >
                <Text style={[styles.pillTxt, { color: form.storeId === s.id ? "#fff" : colors.mutedForeground }]}>
                  {s.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <FormField label={t.productName} value={form.productName} onChangeText={(v) => set("productName", v)}
            placeholder="e.g. Wireless Earbuds Pro" keyboardType="default" error={errors.productName} />
          <FormField label={t.sku} value={form.sku} onChangeText={(v) => set("sku", v)}
            placeholder="e.g. WEP-001" keyboardType="default" optional />

          {/* Ad Platform */}
          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{t.platform}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}
            contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
            {AD_PLATFORMS.map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => set("adPlatform", p)}
                style={[styles.pill, {
                  backgroundColor: form.adPlatform === p ? colors.purple ?? colors.primary : colors.secondary,
                  borderColor: form.adPlatform === p ? colors.purple ?? colors.primary : colors.border,
                }]}
              >
                <Text style={[styles.pillTxt, { color: form.adPlatform === p ? "#fff" : colors.mutedForeground }]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <FormField label="Date" value={form.date} onChangeText={(v) => set("date", v)}
            placeholder="YYYY-MM-DD" keyboardType="default" optional />

          <SectionHeader title="PRICING" icon="dollar-sign" />
          <FormField label={t.sellingPrice} value={form.sellingPrice} onChangeText={(v) => set("sellingPrice", v)}
            placeholder="0.00" keyboardType="decimal-pad" prefix={currSym} error={errors.sellingPrice}
            info="The price you charge customers per unit" />
          <FormField label={t.discount} value={form.discount} onChangeText={(v) => set("discount", v)}
            placeholder="0" keyboardType="decimal-pad" suffix="%" optional
            info="Average discount % applied to orders" />

          <SectionHeader title="COSTS" icon="layers" />
          <FormField label={t.productCost} value={form.productCost} onChangeText={(v) => set("productCost", v)}
            placeholder="0.00" keyboardType="decimal-pad" prefix={currSym} error={errors.productCost}
            info="Supplier/manufacturing cost per unit" />
          <FormField label={t.shippingCost} value={form.shippingCost} onChangeText={(v) => set("shippingCost", v)}
            placeholder="0.00" keyboardType="decimal-pad" prefix={currSym} optional
            info="Average shipping cost per order" />
          <FormField label={t.packagingCost} value={form.packagingCost} onChangeText={(v) => set("packagingCost", v)}
            placeholder="0.00" keyboardType="decimal-pad" prefix={currSym} optional />
          <FormField label={t.otherCosts} value={form.otherCosts} onChangeText={(v) => set("otherCosts", v)}
            placeholder="0.00" keyboardType="decimal-pad" prefix={currSym} optional />

          <SectionHeader title="FEES & TAXES" icon="percent" />
          <FormField label={t.transactionFee} value={form.transactionFee} onChangeText={(v) => set("transactionFee", v)}
            placeholder="2.9" keyboardType="decimal-pad" suffix="%" optional
            info="Platform transaction fee (e.g. Shopify 2.9%)" />
          <FormField label={t.paymentGateway} value={form.paymentGatewayFee} onChangeText={(v) => set("paymentGatewayFee", v)}
            placeholder="0.30" keyboardType="decimal-pad" suffix="%" optional />
          <FormField label={t.taxes} value={form.taxes} onChangeText={(v) => set("taxes", v)}
            placeholder="0" keyboardType="decimal-pad" suffix="%" optional />

          <SectionHeader title="RISK" icon="alert-triangle" />
          <FormField label={t.refundRate} value={form.refundRate} onChangeText={(v) => set("refundRate", v)}
            placeholder="0" keyboardType="decimal-pad" suffix="%" optional
            info="% of orders that are refunded" />
          <FormField label={t.chargebackRate} value={form.chargebackRate} onChangeText={(v) => set("chargebackRate", v)}
            placeholder="0" keyboardType="decimal-pad" suffix="%" optional />

          <SectionHeader title="ADVERTISING" icon="zap" />
          <FormField label={t.adSpend} value={form.adSpend} onChangeText={(v) => set("adSpend", v)}
            placeholder="0.00" keyboardType="decimal-pad" prefix={currSym} error={errors.adSpend}
            info="Total ad spend for this period" />
          <FormField label={t.numberOfOrders} value={form.numberOfOrders} onChangeText={(v) => set("numberOfOrders", v)}
            placeholder="0" keyboardType="number-pad" error={errors.numberOfOrders} />
          <FormField label={t.numberOfClicks} value={form.numberOfClicks} onChangeText={(v) => set("numberOfClicks", v)}
            placeholder="0" keyboardType="number-pad" optional />
          <FormField label={t.impressions} value={form.impressions} onChangeText={(v) => set("impressions", v)}
            placeholder="0" keyboardType="number-pad" optional />

          <SectionHeader title="NOTES" icon="edit-3" />
          <FormField label={t.notes} value={form.notes} onChangeText={(v) => set("notes", v)}
            placeholder="Campaign details, product notes..." keyboardType="default" optional multiline />

          {/* Calculate Button */}
          <Animated.View style={[btnStyle, { marginTop: 24 }]}>
            <TouchableOpacity
              onPress={handleCalculate}
              disabled={saving}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={saving ? ["#94A3B8", "#64748B"] : ["#6366F1", "#8B5CF6"]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={[styles.calcBtn, { borderRadius: colors.radius + 2 }]}
              >
                <Feather name={saving ? "loader" : "trending-up"} size={20} color="#fff" />
                <Text style={styles.calcBtnText}>
                  {saving ? t.calculating : t.calculate}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Clear */}
          <TouchableOpacity
            onPress={() => { setForm(defaultForm); setErrors({}); }}
            style={[styles.clearBtn, { borderColor: colors.border }]}
          >
            <Feather name="refresh-cw" size={14} color={colors.mutedForeground} />
            <Text style={[styles.clearBtnText, { color: colors.mutedForeground }]}>{t.clearForm}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  heroIcon: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  heroTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff" },
  heroSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)", marginTop: 2 },
  sectionHeader: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingBottom: 10, marginBottom: 14,
    borderBottomWidth: 1, marginTop: 8,
  },
  sectionTitle: { fontSize: 12, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.8 },
  fieldLabel: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  pillTxt: { fontSize: 13, fontFamily: "Inter_500Medium" },
  heroCurrBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
    minWidth: 48,
  },
  heroCurrSym: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  heroCurrCode: { fontSize: 10, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.8)", marginTop: 1 },
  calcBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 18, gap: 10 },
  calcBtnText: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#fff" },
  clearBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 14, marginTop: 10, borderWidth: 1, borderRadius: 12 },
  clearBtnText: { fontSize: 14, fontFamily: "Inter_500Medium" },
});
