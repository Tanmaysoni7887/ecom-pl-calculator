import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";
import { exportCSV } from "@/utils/export";
import { formatCompact, formatDate, formatPercent, formatROAS } from "@/utils/formatters";

type SortKey = "date" | "profit" | "roas" | "revenue";

function HistoryCard({ calc, storeName, index, onPress }: { calc: any; storeName: string; index: number; onPress: () => void }) {
  const colors = useColors();
  const isProfit = calc.results.netProfit >= 0;

  return (
    <Animated.View entering={FadeInDown.delay(index * 40).springify()}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
      >
        <View style={[styles.accentBar, { backgroundColor: isProfit ? colors.success : colors.destructive }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={1}>{calc.productName}</Text>
              <View style={styles.metaRow}>
                <View style={[styles.platformPill, { backgroundColor: colors.accent }]}>
                  <Text style={[styles.platformTxt, { color: colors.primary }]}>{calc.adPlatform}</Text>
                </View>
                {storeName ? <Text style={[styles.metaTxt, { color: colors.mutedForeground }]}>{storeName}</Text> : null}
                <Text style={[styles.metaTxt, { color: colors.mutedForeground }]}>{formatDate(calc.date)}</Text>
              </View>
            </View>
            <View style={styles.profitBlock}>
              <Text style={[styles.profitVal, { color: isProfit ? colors.success : colors.destructive }]}>
                {isProfit ? "+" : ""}{formatCompact(calc.results.netProfit)}
              </Text>
              <Text style={[styles.profitLbl, { color: colors.mutedForeground }]}>profit</Text>
            </View>
          </View>
          <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
            {[
              { v: formatCompact(calc.results.adjustedRevenue), l: "Revenue", c: colors.foreground },
              { v: formatROAS(calc.results.roas), l: "ROAS", c: calc.results.roas >= 2 ? colors.success : colors.warning },
              { v: formatPercent(calc.results.profitMargin), l: "Margin", c: calc.results.profitMargin >= 0 ? colors.success : colors.destructive },
              { v: formatCompact(calc.adSpend), l: "Spend", c: colors.foreground },
            ].map((s, i, arr) => (
              <React.Fragment key={s.l}>
                <View style={styles.statItem}>
                  <Text style={[styles.statVal, { color: s.c }]}>{s.v}</Text>
                  <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>{s.l}</Text>
                </View>
                {i < arr.length - 1 && <View style={[styles.statDiv, { backgroundColor: colors.border }]} />}
              </React.Fragment>
            ))}
          </View>
        </View>
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} style={{ alignSelf: "center", marginRight: 12 }} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const t = useTranslation();
  const { calculations, stores } = useData();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("date");
  const [storeFilter, setStoreFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");

  const botPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 60;
  const storeMap = useMemo(() => new Map(stores.map((s) => [s.id, s.name])), [stores]);
  const platforms = useMemo(() => [...new Set(calculations.map((c) => c.adPlatform))], [calculations]);

  const filtered = useMemo(() => {
    let list = [...calculations];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.productName.toLowerCase().includes(q) ||
        c.sku?.toLowerCase().includes(q) ||
        c.adPlatform.toLowerCase().includes(q) ||
        storeMap.get(c.storeId)?.toLowerCase().includes(q)
      );
    }
    if (storeFilter) list = list.filter((c) => c.storeId === storeFilter);
    if (platformFilter) list = list.filter((c) => c.adPlatform === platformFilter);
    list.sort((a, b) => {
      if (sort === "profit") return b.results.netProfit - a.results.netProfit;
      if (sort === "roas") return b.results.roas - a.results.roas;
      if (sort === "revenue") return b.results.adjustedRevenue - a.results.adjustedRevenue;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return list;
  }, [calculations, search, sort, storeFilter, platformFilter, storeMap]);

  const SORTS: { key: SortKey; label: string }[] = [
    { key: "date", label: "Newest" },
    { key: "profit", label: "Profit" },
    { key: "roas", label: "ROAS" },
    { key: "revenue", label: "Revenue" },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Search bar */}
      <View style={[styles.searchWrap, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.secondary, borderColor: colors.border, borderRadius: 12 }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            value={search} onChangeText={setSearch}
            placeholder={t.searchPlaceholder} placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={14} color={colors.mutedForeground} />
            </TouchableOpacity>
          ) : null}
        </View>
        {calculations.length > 0 && (
          <TouchableOpacity
            onPress={() => exportCSV(calculations, stores)}
            style={[styles.exportBtn, { backgroundColor: colors.success + "20", borderRadius: 10 }]}
          >
            <Feather name="share-2" size={16} color={colors.success} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter/sort chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.chipRow, { borderBottomColor: colors.border }]}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 10 }}>
        {SORTS.map((s) => (
          <TouchableOpacity key={s.key} onPress={() => setSort(s.key)}
            style={[styles.chip, {
              backgroundColor: sort === s.key ? colors.primary : colors.secondary,
              borderColor: sort === s.key ? colors.primary : colors.border,
            }]}>
            <Text style={[styles.chipTxt, { color: sort === s.key ? "#fff" : colors.mutedForeground }]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
        {stores.length > 1 && stores.map((s) => (
          <TouchableOpacity key={s.id} onPress={() => setStoreFilter(storeFilter === s.id ? "" : s.id)}
            style={[styles.chip, {
              backgroundColor: storeFilter === s.id ? (colors.purple ?? colors.primary) : colors.secondary,
              borderColor: storeFilter === s.id ? (colors.purple ?? colors.primary) : colors.border,
            }]}>
            <Feather name="shopping-bag" size={11} color={storeFilter === s.id ? "#fff" : colors.mutedForeground} />
            <Text style={[styles.chipTxt, { color: storeFilter === s.id ? "#fff" : colors.mutedForeground }]}>{s.name}</Text>
          </TouchableOpacity>
        ))}
        {platforms.map((p) => (
          <TouchableOpacity key={p} onPress={() => setPlatformFilter(platformFilter === p ? "" : p)}
            style={[styles.chip, {
              backgroundColor: platformFilter === p ? (colors.cyan ?? colors.primary) : colors.secondary,
              borderColor: platformFilter === p ? (colors.cyan ?? colors.primary) : colors.border,
            }]}>
            <Text style={[styles.chipTxt, { color: platformFilter === p ? "#fff" : colors.mutedForeground }]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: botPad + 8 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          filtered.length > 0 ? (
            <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="clock"
            title={search ? "No results" : t.noCalculations}
            description={search ? `No match for "${search}"` : t.noCalculationsDesc}
          />
        }
        renderItem={({ item, index }) => (
          <HistoryCard
            calc={item}
            storeName={storeMap.get(item.storeId) ?? ""}
            index={index}
            onPress={() => router.push(`/results/${item.id}`)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  searchWrap: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  searchBox: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  exportBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  chipRow: { borderBottomWidth: 1 },
  chip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  chipTxt: { fontSize: 12, fontFamily: "Inter_500Medium" },
  resultCount: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 10 },
  card: { flexDirection: "row", alignItems: "stretch", borderWidth: 1, marginBottom: 12, overflow: "hidden" },
  accentBar: { width: 4 },
  cardBody: { flex: 1, paddingTop: 12, paddingLeft: 12, paddingBottom: 12 },
  cardTop: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  productName: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 5 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  platformPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  platformTxt: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  metaTxt: { fontSize: 11, fontFamily: "Inter_400Regular" },
  profitBlock: { alignItems: "flex-end", paddingLeft: 12 },
  profitVal: { fontSize: 17, fontFamily: "Inter_700Bold" },
  profitLbl: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 2 },
  statsRow: { flexDirection: "row", borderTopWidth: 1, paddingTop: 10 },
  statItem: { flex: 1, alignItems: "center" },
  statVal: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  statLbl: { fontSize: 9, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.3, marginTop: 2 },
  statDiv: { width: 1, height: 28 },
});
