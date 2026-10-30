import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Line, Text as SvgText, Circle } from "react-native-svg";
import { useColors } from "@/hooks/useColors";

interface DataPoint {
  label: string;
  value: number;
}

interface SimpleLineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  formatValue?: (v: number) => string;
}

export function SimpleLineChart({
  data,
  height = 140,
  color,
  formatValue,
}: SimpleLineChartProps) {
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

  const paddingLeft = 8;
  const paddingRight = 8;
  const paddingTop = 12;
  const paddingBottom = 24;
  const chartWidth = 320;
  const chartHeight = height;
  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const toX = (i: number) => paddingLeft + (i / (data.length - 1)) * innerWidth;
  const toY = (v: number) =>
    paddingTop + innerHeight - ((v - minVal) / range) * innerHeight;

  let d = `M ${toX(0)} ${toY(values[0])}`;
  for (let i = 1; i < values.length; i++) {
    const cx1 = (toX(i - 1) + toX(i)) / 2;
    const cy1 = toY(values[i - 1]);
    const cx2 = (toX(i - 1) + toX(i)) / 2;
    const cy2 = toY(values[i]);
    d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toX(i)} ${toY(values[i])}`;
  }

  const lastX = toX(values.length - 1);
  const lastY = toY(values[values.length - 1]);
  const lastVal = values[values.length - 1];
  const isUp = lastVal >= values[0];

  return (
    <View>
      <Svg width={chartWidth} height={chartHeight}>
        <Line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft}
          y2={chartHeight - paddingBottom}
          stroke={colors.border}
          strokeWidth={1}
        />
        <Line
          x1={paddingLeft}
          y1={chartHeight - paddingBottom}
          x2={chartWidth - paddingRight}
          y2={chartHeight - paddingBottom}
          stroke={colors.border}
          strokeWidth={1}
        />
        <Path d={d} stroke={chartColor} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <Circle cx={lastX} cy={lastY} r={4} fill={chartColor} />
        {formatValue && (
          <SvgText
            x={lastX}
            y={lastY - 10}
            fontSize={10}
            fill={chartColor}
            textAnchor="middle"
            fontWeight="bold"
          >
            {formatValue(lastVal)}
          </SvgText>
        )}
        {data.map((point, i) => {
          const showLabel = i === 0 || i === data.length - 1 || (data.length <= 6);
          if (!showLabel) return null;
          return (
            <SvgText
              key={i}
              x={toX(i)}
              y={chartHeight - 6}
              fontSize={9}
              fill={colors.mutedForeground}
              textAnchor="middle"
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
  empty: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
});
