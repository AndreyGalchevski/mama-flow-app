import { useFocusEffect } from '@react-navigation/native';
import { max } from 'd3-array';
import { scaleBand, scaleLinear } from 'd3-scale';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { G, Rect, Text as SvgText } from 'react-native-svg';

import { AccessibilityLabels } from '../accessibility';
import { COLORS } from '../colors';
import i18n, { isRTL } from '../i18n';
import { getRTLTextAlign } from '../rtl';
import type { DataPoint } from '../types';

const barRadius = 18;

const padding = { top: 24, right: 16, bottom: 36, left: 16 };

interface Props {
  data: DataPoint[];
  width?: number;
  height?: number;
}

export default function VolumeGraph({ data, width = 340, height = 220 }: Props) {
  const [selectedBar, setSelectedBar] = useState<{
    x: number;
    y: number;
    value: number;
    label: string;
    tooltip: string;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSelectedBar(null);
      };
    }, []),
  );

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxY = useMemo(() => Math.max(1, max(data, (d) => d.value) || 1), [data]);

  const x = useMemo(
    () =>
      scaleBand<string>()
        .domain(data.map((d) => d.label))
        .range([0, chartW])
        .padding(0.1),
    [data, chartW],
  );

  const y = useMemo(
    () =>
      scaleLinear()
        .domain([0, maxY * 1.1])
        .nice()
        .range([chartH, 0]),
    [chartH, maxY],
  );

  const handleSvgPress = useCallback(
    (event: { nativeEvent: { locationX: number; locationY: number } }) => {
      const { locationX, locationY } = event.nativeEvent;

      let clickedBar: DataPoint | null = null;
      let minDistance = Number.POSITIVE_INFINITY;

      for (const d of data) {
        const barX = (x(d.label) ?? 0) + padding.left;
        const barW = x.bandwidth();
        const barH = chartH - y(d.value);
        const barY = y(d.value) + padding.top;

        if (
          locationX >= barX &&
          locationX <= barX + barW &&
          locationY >= barY &&
          locationY <= barY + barH
        ) {
          const barCenterX = barX + barW / 2;
          const barCenterY = barY + barH / 2;
          const distance = Math.sqrt((locationX - barCenterX) ** 2 + (locationY - barCenterY) ** 2);

          if (distance < minDistance) {
            minDistance = distance;
            clickedBar = d;
          }
        }
      }

      if (clickedBar) {
        if (selectedBar?.label === clickedBar.label) {
          setSelectedBar(null);
        } else {
          const barX = (x(clickedBar.label) ?? 0) + padding.left;
          const barW = x.bandwidth();
          const barY = y(clickedBar.value) + padding.top;

          setSelectedBar({
            x: barX + barW / 2,
            y: barY,
            value: clickedBar.value,
            label: clickedBar.label,
            tooltip: clickedBar.tooltip,
          });
        }
      } else {
        setSelectedBar(null);
      }
    },
    [data, x, y, chartH, selectedBar],
  );

  const tooltipOffset = selectedBar ? Math.min(width - 100, Math.max(10, selectedBar.x)) : 0;

  return (
    <View
      style={{ width, height, alignSelf: 'center' }}
      accessible
      accessibilityLabel={AccessibilityLabels.volumeChart}
      accessibilityRole="image"
    >
      <Svg width={width} height={height} onPress={handleSvgPress}>
        <G x={padding.left} y={padding.top}>
          {data.map((d) => {
            const barX = x(d.label) ?? 0;
            const barW = x.bandwidth();
            const barH = chartH - y(d.value);
            const barY = y(d.value);

            const isSelected = selectedBar?.label === d.label;

            const barColor = isSelected ? '#3A6B6C' : COLORS.primary;

            return (
              <G
                key={d.label}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`${d.label} ${d.value} steps`}
              >
                <Rect
                  x={barX}
                  y={barY}
                  width={barW}
                  height={Math.max(2, barH)}
                  fill={barColor}
                  rx={barRadius}
                  ry={barRadius}
                />

                <SvgText
                  x={barX + barW / 2}
                  y={chartH + 18}
                  fontSize={12}
                  fill={COLORS.onSurface}
                  textAnchor="middle"
                >
                  {d.label}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>

      {selectedBar && (
        <View
          style={[
            styles.tooltip,
            {
              top: Math.max(10, selectedBar.y - 44),
              ...(isRTL() ? { right: tooltipOffset } : { left: tooltipOffset }),
              flexDirection: isRTL() ? 'row-reverse' : 'row',
            },
          ]}
        >
          <Text variant="labelLarge" style={{ textAlign: getRTLTextAlign() }}>
            {i18n.t('units.volumeWithUnit', {
              volume: Math.round(selectedBar.value),
            })}
          </Text>

          <Text variant="bodySmall" style={{ textAlign: getRTLTextAlign() }}>
            {selectedBar.tooltip}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.outline,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    minWidth: 80,
    alignItems: 'baseline',
    zIndex: 1000,
    gap: 4,
    justifyContent: 'space-between',
  },
});
