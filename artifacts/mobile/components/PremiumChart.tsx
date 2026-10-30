import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Line,
  Text as SvgText,
  Rect,
} from "react-native-svg";
import { useColors } from "@/hooks/useColors";

interface DataPoint {
  label: string;
  value: number;
}

interface PremiumChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  formatValue?: (v: number) => string;
  type?: "line" | "bar";
  gradientId?: string;
}

export function PremiumChart({
  data,
  height = 160,
  color,
  formatValue,
  type = "line",
  gradientId = "grad",
}: PremiumChartProps) {
  const colors = useColors();
  const chartColor = color ?? colors.primary;

  if (!data || data.length < 2) {
    return (
      <View style={[styles.empty, { height }]}>
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          Not enough data
        </Text>
      </View>
    );
  }

  const W = 340;
  const H = height;
  const padL = 8;
  const padR = 8;
  const padT = 24;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const values = data.map((d) => d.value);
  const minVal = Math.min(0, ...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const toX = (i: number) =>
    type === "bar"
      ? padL + (i / data.length) * innerW + innerW / data.length / 2
      : padL + (i / (data.length - 1)) * innerW;

  const toY = (v: number) =>
    padT + innerH - ((v - minVal) / range) * innerH;

  const zeroY = toY(0);

  // ── Line chart path (cubic bezier) ─────────────────────────
  let linePath = `M ${toX(0)} ${toY(values[0])}`;
  for (let i = 1; i < values.length; i++) {
    const x0 = toX(i - 1);
    const x1 = toX(i);
    const y0 = toY(values[i - 1]);
    const y1 = toY(values[i]);
    const mx = (x0 + x1) / 2;
    linePath += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
  }

  // Area fill under the line
  const firstX = toX(0);
  const lastX = toX(values.length - 1);
  const areaPath =
    linePath +
    ` L ${lastX} ${zeroY} L ${firstX} ${zeroY} Z`;

  const lastIdx = values.length - 1;
  const lastX2 = toX(lastIdx);
  const lastY2 = toY(values[lastIdx]);

  // ── Bar chart ───────────────────────────────────────────────
  const barWidth = (innerW / data.length) * 0.6;
  const barGap = (innerW / data.length) * 0.4;

  const labelStep = data.length <= 6 ? 1 : Math.ceil(data.length / 5);

  return (
    <View style={styles.container}>
      <Svg width={W} height={H}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={chartColor} stopOpacity={0.35} />
            <Stop offset="100%" stopColor={chartColor} stopOpacity={0.01} />
          </LinearGradient>
          <LinearGradient id={`${gradientId}_bar`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={chartColor} stopOpacity={1} />
            <Stop offset="100%" stopColor={chartColor} stopOpacity={0.5} />
          </LinearGradient>
        </Defs>

        {/* Zero baseline */}
        <Line
          x1={padL}
          y1={zeroY}
          x2={W - padR}
          y2={zeroY}
          stroke={colors.border}
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        {type === "line" ? (
          <>
            {/* Gradient fill */}
            <Path d={areaPath} fill={`url(#${gradientId})`} />
            {/* Line */}
            <Path
              d={linePath}
              stroke={chartColor}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dots */}
            {values.map((v, i) => {
              const cx = toX(i);
              const cy = toY(v);
              const isLast = i === lastIdx;
              return (
                <React.Fragment key={i}>
                  {isLast && (
                    <Circle cx={cx} cy={cy} r={7} fill={chartColor} opacity={0.2} />
                  )}
                  <Circle
                    cx={cx}
                    cy={cy}
                    r={isLast ? 4 : 2.5}
                    fill={chartColor}
                    stroke={colors.card}
                    strokeWidth={isLast ? 2 : 1}
                  />
                </React.Fragment>
              );
            })}
            {/* Last value label */}
            {formatValue && (
              <SvgText
                x={lastX2}
                y={lastY2 - 12}
                fontSize={11}
                fill={chartColor}
                textAnchor="middle"
                fontWeight="bold"
              >
                {formatValue(values[lastIdx])}
              </SvgText>
            )}
          </>
        ) : (
          <>
            {data.map((d, i) => {
              const x = padL + (i / data.length) * innerW + barGap / 2;
              const barH = Math.abs(toY(d.value) - zeroY);
              const barY = d.value >= 0 ? zeroY - barH : zeroY;
              return (
                <Rect
                  key={i}
                  x={x}
                  y={barY}
                  width={barWidth}
                  height={Math.max(barH, 2)}
                  rx={4}
                  fill={
                    d.value >= 0
                      ? `url(#${gradientId}_bar)`
                      : colors.destructive
                  }
                  opacity={0.9}
                />
              );
            })}
          </>
        )}

        {/* X-axis labels */}
        {data.map((point, i) => {
          if (i % labelStep !== 0 && i !== data.length - 1) return null;
          return (
            <SvgText
              key={`lbl_${i}`}
              x={toX(i)}
              y={H - 6}
              fontSize={9}
              fill={colors.mutedForeground}
              textAnchor="middle"
              fontFamily="Inter_400Regular"
            >
              {point.label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  empty: { alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 13, fontFamily: "Inter_400Regular" },
});
