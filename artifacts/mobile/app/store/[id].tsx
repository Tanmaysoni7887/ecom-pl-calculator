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
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ConfirmSheet } from "@/components/ConfirmSheet";
import { FormField } from "@/components/FormField";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const PLATFORMS = [
  "Shopify", "WooCommerce", "Amazon", "Etsy", "eBay", "BigCommerce", "TikTok Shop", "Other",
];

export default function StoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { stores, addStore, updateStore, deleteStore } = useData();

  const isNew = id === "new";
  const existing = isNew ? null : stores.find((s) => s.id === id);

  const [name, setName] = useState(existing?.name ?? "");
  const [platform, setPlatform] = useState(existing?.platform ?? "Shopify");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  function validate(): boolean {
    const e: { name?: string } = {};
    if (!name.trim()) e.name = "Store name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      if (isNew) {
        await addStore({ name: name.trim(), currency: "USD", platform, notes: notes.trim() });
      } else if (existing) {
        await updateStore(existing.id, { name: name.trim(), platform, notes: notes.trim() });
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    if (!existing) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await deleteStore(existing.id);
    setShowDeleteConfirm(false);
    router.back();
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: botPad + 40 }}
        keyboardShouldPersistTaps="handled"
        bottomOffset={80}
        showsVerticalScrollIndicator={false}
      >
        {/* Gradient header */}
        <LinearGradient
          colors={isNew ? ["#6366F1", "#8B5CF6"] : ["#10B981", "#059669"]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroIcon}>
            <Feather name="shopping-bag" size={26} color="#fff" />
          </View>
          <View>
            <Text style={styles.heroTitle}>{isNew ? "New Store" : "Edit Store"}</Text>
            <Text style={styles.heroSub}>{isNew ? "Add a new store to track" : existing?.name ?? ""}</Text>
          </View>
        </LinearGradient>

        <View style={styles.form}>
          <FormField
            label="Store Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. DropShip Pro"
            keyboardType="default"
            error={errors.name}
          />

          <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Platform</Text>
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            style={styles.pillRow} contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
          >
            {PLATFORMS.map((p) => {
              const active = platform === p;
              return (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPlatform(p)}
                  style={[styles.pill, {
                    backgroundColor: active ? colors.primary : colors.secondary,
                    borderColor: active ? colors.primary : colors.border,
                  }]}
                >
                  <Text style={[styles.pillText, { color: active ? "#fff" : colors.mutedForeground }]}>{p}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <FormField
            label="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional notes about this store..."
            keyboardType="default"
            multiline
            optional
          />

          {/* Save button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={saving ? ["#94A3B8", "#64748B"] : ["#6366F1", "#8B5CF6"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={[styles.saveBtn, { borderRadius: colors.radius }]}
            >
              <Feather name={saving ? "loader" : "check"} size={18} color="#fff" />
              <Text style={styles.saveBtnText}>
                {saving ? "Saving..." : isNew ? "Create Store" : "Save Changes"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Delete button — only in edit mode */}
          {!isNew && existing && (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowDeleteConfirm(true);
              }}
              style={[styles.deleteBtn, { borderColor: colors.destructive, borderRadius: colors.radius }]}
              activeOpacity={0.8}
            >
              <Feather name="trash-2" size={16} color={colors.destructive} />
              <Text style={[styles.deleteBtnText, { color: colors.destructive }]}>Delete Store</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAwareScrollView>

      {/* Delete confirm — ConfirmSheet works on web + native */}
      <ConfirmSheet
        visible={showDeleteConfirm}
        title="Delete Store"
        message={`Delete "${existing?.name ?? ""}"?\n\nAll calculations for this store will also be permanently removed.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        icon="trash-2"
        onConfirm={doDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 20, paddingVertical: 22 },
  heroIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  heroTitle: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#fff" },
  heroSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)", marginTop: 2 },
  form: { paddingHorizontal: 20, paddingTop: 20 },
  fieldLabel: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 8 },
  pillRow: {},
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderRadius: 20 },
  pillText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, gap: 8, marginTop: 24 },
  saveBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
  deleteBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, gap: 8, marginTop: 12, borderWidth: 1 },
  deleteBtnText: { fontSize: 15, fontFamily: "Inter_500Medium" },
});
