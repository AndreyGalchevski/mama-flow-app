import { useFocusEffect } from '@react-navigation/native';
import { max } from 'd3-array';
import { scaleBand, scaleLinear } from 'd3-scale';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { G, Text as SvgText } from 'react-native-svg';

import { AccessibilityLabels } from '../accessibility';
import { COLORS } from '../colors';
import i18n, { isRTL } from '../i18n';
import { getRTLTextAlign } from '../rtl';
import type { DataPoint } from '../types';
import AnimatedBar from './AnimatedBar';

const barRadius = 18;

const padding = { top: 24, right: 16, bottom: 36, left: 42 };

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

  const chartOpacity = useSharedValue(0);

  useEffect(() => {
    chartOpacity.value = withTiming(1, { duration: 300 });
  }, [chartOpacity]);

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
    [data, x, y, chartH, selectedBar?.label],
  );

  const chartAnimatedStyle = useAnimatedStyle(() => ({
    opacity: chartOpacity.value,
  }));

  const tooltipOffset = selectedBar ? Math.min(width - 100, Math.max(10, selectedBar.x)) : 0;

  return (
    <Animated.View
      style={[{ width, height, alignSelf: 'center' }, chartAnimatedStyle]}
      accessible
      accessibilityLabel={AccessibilityLabels.volumeChart}
      accessibilityRole="image"
    >
      <Svg width={width} height={height} onPress={handleSvgPress}>
        <G x={padding.left} y={padding.top}>
          {(() => {
            const yTicks = 4;
            const yValues = [];
            const yDomain = y.domain();
            for (let i = 0; i <= yTicks; i++) {
              const value = yDomain[0] + (yDomain[1] - yDomain[0]) * (i / yTicks);
              if (value === 0) {
                continue;
              }
              yValues.push(value);
            }

            return yValues.map((value, index) => {
              const yPos = y(value);
              return (
                <SvgText
                  key={`y-label-${index}`}
                  x={-8}
                  y={yPos + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill={COLORS.onSurface}
                >
                  {i18n.t('units.volumeWithUnit', {
                    volume: Math.round(value),
                  })}
                </SvgText>
              );
            });
          })()}

          {data.map((d, index) => {
            const barX = x(d.label) ?? 0;
            const barW = x.bandwidth();
            const barH = chartH - y(d.value);
            const barY = y(d.value);

            const isSelected = selectedBar?.label === d.label;
            const barColor = isSelected ? '#2D5455' : COLORS.primary;

            return (
              <G key={d.label}>
                <AnimatedBar
                  x={barX}
                  width={barW}
                  toY={barY}
                  toHeight={barH}
                  fill={barColor}
                  rx={barRadius}
                  ry={barRadius}
                  duration={400 + index * 100}
                  isActive={isSelected}
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
    </Animated.View>
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
