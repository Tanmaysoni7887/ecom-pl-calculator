import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface ConfirmSheetProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  icon?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  icon = "alert-triangle",
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  const colors = useColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius + 4,
            },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: destructive
                  ? colors.destructive + "20"
                  : colors.warning + "20",
              },
            ]}
          >
            <Feather
              name={icon as any}
              size={28}
              color={destructive ? colors.destructive : colors.warning}
            />
          </View>

          <Text style={[styles.title, { color: colors.foreground }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: colors.mutedForeground }]}>
            {message}
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={onCancel}
              style={[
                styles.btn,
                {
                  backgroundColor: colors.secondary,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
              activeOpacity={0.75}
            >
              <Text style={[styles.cancelText, { color: colors.foreground }]}>
                {cancelLabel}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={[
                styles.btn,
                {
                  backgroundColor: destructive
                    ? colors.destructive
                    : colors.primary,
                  borderColor: destructive ? colors.destructive : colors.primary,
                  borderRadius: colors.radius,
                },
              ]}
              activeOpacity={0.75}
            >
              <Text style={[styles.confirmText, { color: "#fff" }]}>
                {confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  sheet: {
    width: "100%",
    maxWidth: 360,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  buttons: { flexDirection: "row", gap: 10, width: "100%" },
  btn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  cancelText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  confirmText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
