import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ConfirmSheet } from "@/components/ConfirmSheet";
import { useData } from "@/context/DataContext";
import { useSettings, CURRENCIES } from "@/context/SettingsContext";
import { LANGUAGE_LABELS, type Language } from "@/i18n/translations";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";

const LANGUAGES: Language[] = ["en", "hi", "es", "fr", "de", "pt", "ar", "zh", "ja", "id"];

function SettingRow({
  icon, iconColor, label, sublabel, right, onPress, destructive, index = 0,
}: {
  icon: string; iconColor?: string; label: string; sublabel?: string;
  right?: React.ReactNode; onPress?: () => void; destructive?: boolean; index?: number;
}) {
  const colors = useColors();
  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
        style={[styles.row, { borderBottomColor: colors.border }]}
      >
        <View style={[styles.rowIcon, { backgroundColor: (iconColor ?? colors.primary) + "20", borderRadius: 10 }]}>
          <Feather name={icon as any} size={18} color={iconColor ?? colors.primary} />
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.rowLabel, { color: destructive ? colors.destructive : colors.foreground }]}>{label}</Text>
          {sublabel ? <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>{sublabel}</Text> : null}
        </View>
        {right ?? (onPress ? <Feather name="chevron-right" size={16} color={colors.mutedForeground} /> : null)}
      </TouchableOpacity>
    </Animated.View>
  );
}

function SectionHeader({ title }: { title: string }) {
  const colors = useColors();
  return (
    <Text style={[styles.sectionHeader, { color: colors.mutedForeground }]}>{title.toUpperCase()}</Text>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const t = useTranslation();
  const { darkModeOverride, setDarkModeOverride, language, setLanguage, currency, currencySymbol, setCurrency } = useSettings();
  const { clearAllData } = useData();

  const [langModal, setLangModal] = useState(false);
  const [currModal, setCurrModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const selectedCurr = CURRENCIES.find((c) => c.code === currency);

  async function handleClearData() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await clearAllData();
    setShowClearConfirm(false);
  }

  async function handleShareApp() {
    await Share.share({
      message: "Check out Ecom P&L & ROAS Calculator — the best tool for dropshipping sellers!",
    });
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <LinearGradient colors={["#6366F1", "#8B5CF6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroIcon}>
            <Feather name="trending-up" size={32} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>Ecom P&L Calculator</Text>
          <Text style={styles.heroSub}>Dropshipping profit tracker</Text>
        </LinearGradient>

        {/* Appearance */}
        <SectionHeader title={t.appearance} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            index={0}
            icon="moon"
            iconColor={colors.purple}
            label={t.darkMode}
            sublabel={darkModeOverride === "system" ? "Auto" : darkModeOverride === "dark" ? "Dark" : "Light"}
            right={
              <View style={styles.darkToggleRow}>
                {(["light", "system", "dark"] as const).map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => { Haptics.selectionAsync(); setDarkModeOverride(mode); }}
                    style={[
                      styles.modeBtn,
                      {
                        backgroundColor: darkModeOverride === mode ? colors.primary : colors.secondary,
                        borderRadius: 8,
                        borderColor: darkModeOverride === mode ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.modeBtnText, { color: darkModeOverride === mode ? "#fff" : colors.mutedForeground }]}>
                      {mode === "light" ? "☀️" : mode === "dark" ? "🌙" : "Auto"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            }
          />
        </View>

        {/* Currency — global for the whole app */}
        <SectionHeader title="CURRENCY" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            index={1}
            icon="dollar-sign"
            iconColor={colors.success}
            label="Default Currency"
            sublabel={`${selectedCurr?.symbol ?? ""} ${selectedCurr?.label ?? currency}`}
            onPress={() => setCurrModal(true)}
            right={
              <View style={styles.currBadge}>
                <Text style={[styles.currBadgeSym, { color: colors.primary }]}>{currencySymbol}</Text>
                <Text style={[styles.currBadgeCode, { color: colors.mutedForeground }]}>{currency}</Text>
                <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
              </View>
            }
          />
        </View>

        {/* Language */}
        <SectionHeader title={t.language} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            index={2}
            icon="globe"
            iconColor={colors.cyan}
            label={t.language}
            sublabel={LANGUAGE_LABELS[language]}
            onPress={() => setLangModal(true)}
          />
        </View>

        {/* Data */}
        <SectionHeader title={t.data} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            index={3}
            icon="trash-2"
            iconColor={colors.destructive}
            label={t.clearAllData}
            sublabel={t.clearAllDataDesc}
            onPress={() => setShowClearConfirm(true)}
            destructive
          />
        </View>

        {/* App Info */}
        <SectionHeader title={t.appInfo} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow index={4} icon="share-2" iconColor={colors.success} label={t.shareApp} onPress={handleShareApp} />
          <SettingRow index={5} icon="info" iconColor={colors.warning} label={t.version} sublabel="1.0.0" />
        </View>
      </ScrollView>

      {/* Clear all data confirm */}
      <ConfirmSheet
        visible={showClearConfirm}
        title={t.clearConfirm}
        message={t.clearConfirmMsg}
        confirmLabel={t.clearAllData}
        cancelLabel={t.cancel}
        destructive icon="trash-2"
        onConfirm={handleClearData}
        onCancel={() => setShowClearConfirm(false)}
      />

      {/* Currency picker modal */}
      <Modal visible={currModal} transparent animationType="slide" onRequestClose={() => setCurrModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <LinearGradient colors={["#6366F1", "#8B5CF6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalTitleBar}>
              <Feather name="dollar-sign" size={18} color="#fff" />
              <Text style={styles.modalTitleText}>Select Currency</Text>
            </LinearGradient>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
              {CURRENCIES.map((c, i) => {
                const active = currency === c.code;
                return (
                  <TouchableOpacity
                    key={c.code}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setCurrency(c.code);
                      setCurrModal(false);
                    }}
                    style={[
                      styles.currRow,
                      { borderBottomColor: colors.border },
                      active && { backgroundColor: colors.accent },
                    ]}
                  >
                    <View style={[styles.currSymCircle, { backgroundColor: (active ? colors.primary : colors.secondary), borderColor: active ? colors.primary : colors.border }]}>
                      <Text style={[styles.currSymText, { color: active ? "#fff" : colors.foreground }]}>{c.symbol}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.currCode, { color: colors.foreground }]}>{c.code}</Text>
                      <Text style={[styles.currLabel, { color: colors.mutedForeground }]}>{c.label}</Text>
                    </View>
                    {active && <Feather name="check-circle" size={20} color={colors.primary} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setCurrModal(false)}
              style={[styles.closeBtn, { backgroundColor: colors.secondary, borderRadius: colors.radius, borderColor: colors.border, borderWidth: 1 }]}
            >
              <Text style={[styles.closeBtnText, { color: colors.foreground }]}>{t.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language picker modal */}
      <Modal visible={langModal} transparent animationType="slide" onRequestClose={() => setLangModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <LinearGradient colors={["#06B6D4", "#3B82F6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalTitleBar}>
              <Feather name="globe" size={18} color="#fff" />
              <Text style={styles.modalTitleText}>{t.language}</Text>
            </LinearGradient>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
              {LANGUAGES.map((lang) => {
                const active = language === lang;
                return (
                  <TouchableOpacity
                    key={lang}
                    onPress={() => { Haptics.selectionAsync(); setLanguage(lang); setLangModal(false); }}
                    style={[styles.langRow, { borderBottomColor: colors.border }, active && { backgroundColor: colors.accent }]}
                  >
                    <Text style={[styles.langLabel, { color: colors.foreground }]}>{LANGUAGE_LABELS[lang]}</Text>
                    {active && <Feather name="check-circle" size={20} color={colors.primary} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setLangModal(false)}
              style={[styles.closeBtn, { backgroundColor: colors.secondary, borderRadius: colors.radius, borderColor: colors.border, borderWidth: 1 }]}
            >
              <Text style={[styles.closeBtnText, { color: colors.foreground }]}>{t.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { alignItems: "center", paddingVertical: 32, paddingHorizontal: 20, marginBottom: 8 },
  heroIcon: { width: 72, height: 72, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  heroTitle: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#fff", marginBottom: 4 },
  heroSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)" },
  sectionHeader: { fontSize: 11, fontFamily: "Inter_600SemiBold", marginTop: 20, marginBottom: 6, paddingHorizontal: 20, letterSpacing: 0.6 },
  card: { marginHorizontal: 16, borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  rowIcon: { width: 36, height: 36, alignItems: "center", justifyContent: "center", marginRight: 12 },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 15, fontFamily: "Inter_500Medium" },
  rowSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  darkToggleRow: { flexDirection: "row", gap: 6 },
  modeBtn: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1 },
  modeBtnText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  currBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  currBadgeSym: { fontSize: 16, fontFamily: "Inter_700Bold" },
  currBadgeCode: { fontSize: 12, fontFamily: "Inter_500Medium" },
  // Modals
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.55)" },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, overflow: "hidden", maxHeight: "78%" },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginTop: 10, marginBottom: 4 },
  modalTitleBar: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 20, paddingVertical: 16 },
  modalTitleText: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#fff" },
  // Currency rows
  currRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
  currSymCircle: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  currSymText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  currCode: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  currLabel: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  // Language rows
  langRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1 },
  langLabel: { fontSize: 16, fontFamily: "Inter_500Medium" },
  closeBtn: { marginHorizontal: 16, marginTop: 10, paddingVertical: 14, alignItems: "center" },
  closeBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
