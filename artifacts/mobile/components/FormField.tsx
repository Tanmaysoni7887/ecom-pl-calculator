import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "decimal-pad" | "email-address";
  info?: string;
  error?: string;
  suffix?: string;
  prefix?: string;
  multiline?: boolean;
  optional?: boolean;
}

export function FormField({
  label,
  value,
  onChangeText,
  placeholder = "0",
  keyboardType = "decimal-pad",
  info,
  error,
  suffix,
  prefix,
  multiline,
  optional,
}: FormFieldProps) {
  const colors = useColors();
  const [infoVisible, setInfoVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>
          {label}
          {optional ? <Text style={{ color: colors.mutedForeground }}> (optional)</Text> : null}
        </Text>
        {info ? (
          <TouchableOpacity onPress={() => setInfoVisible(true)} style={styles.infoBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="info" size={13} color={colors.mutedForeground} />
          </TouchableOpacity>
        ) : null}
      </View>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.input,
            borderColor: error ? colors.destructive : colors.border,
            borderRadius: colors.radius - 2,
          },
        ]}
      >
        {prefix ? (
          <Text style={[styles.affix, { color: colors.mutedForeground }]}>{prefix}</Text>
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          keyboardType={keyboardType}
          multiline={multiline}
          style={[
            styles.input,
            {
              color: colors.foreground,
              fontFamily: "Inter_400Regular",
              textAlignVertical: multiline ? "top" : "center",
              height: multiline ? 80 : 44,
            },
          ]}
          returnKeyType="done"
        />
        {suffix ? (
          <Text style={[styles.affix, { color: colors.mutedForeground }]}>{suffix}</Text>
        ) : null}
      </View>
      {error ? (
        <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
      ) : null}

      <Modal visible={infoVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setInfoVisible(false)}
        >
          <View
            style={[
              styles.modalBox,
              { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>{label}</Text>
            <Text style={[styles.modalText, { color: colors.mutedForeground }]}>{info}</Text>
            <TouchableOpacity
              onPress={() => setInfoVisible(false)}
              style={[styles.modalClose, { backgroundColor: colors.primary, borderRadius: colors.radius - 4 }]}
            >
              <Text style={{ color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 14 }}>Got it</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  labelRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  label: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1 },
  infoBtn: { marginLeft: 4 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  affix: { fontSize: 14, fontFamily: "Inter_400Regular", marginRight: 4 },
  input: { flex: 1, fontSize: 15, paddingVertical: 0 },
  error: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  modalBox: {
    width: "100%",
    padding: 20,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    marginBottom: 16,
  },
  modalClose: {
    alignItems: "center",
    paddingVertical: 10,
  },
});
