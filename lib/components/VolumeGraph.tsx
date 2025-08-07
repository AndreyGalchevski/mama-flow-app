import { useFocusEffect } from '@react-navigation/native';
import { max, min } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line } from 'd3-shape';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle, Line, Path, Text as TextSVG } from 'react-native-svg';

import { AccessibilityLabels } from '../accessibility';
import { COLORS } from '../colors';
import i18n, { isRTL } from '../i18n';
import { getRTLTextAlign } from '../rtl';
import type { DataPoint } from '../types';

const GRAPH_WIDTH = 340;
const GRAPH_HEIGHT = 240;

const createGraph = (chartData: DataPoint[]) => {
  if (chartData.length === 0) return { pathData: '', points: [], scales: null };

  const maxValue = max(chartData, (d) => d.value) || 0;
  const minValue = min(chartData, (d) => d.value) || 0;

  let adjustedMax: number;
  let adjustedMin: number;

  if (maxValue === 0 && minValue === 0) {
    adjustedMax = 10;
    adjustedMin = 0;
  } else if (maxValue === minValue) {
    const padding = Math.max(maxValue * 0.2, 10);
    adjustedMax = maxValue + padding;
    adjustedMin = Math.max(0, maxValue - padding);
  } else {
    const yPadding = (maxValue - minValue) * 0.1;
    adjustedMax = maxValue + yPadding;
    adjustedMin = Math.max(0, minValue - yPadding);
  }

  const yScale = scaleLinear()
    .domain([adjustedMin, adjustedMax])
    .range([GRAPH_HEIGHT - 30, 30]);

  const xScale = scaleTime()
    .domain([chartData[0].timestamp, chartData[chartData.length - 1].timestamp])
    .range([30, GRAPH_WIDTH - 30]);

  const lineGenerator = line<DataPoint>()
    .x((d) => xScale(d.timestamp))
    .y((d) => yScale(d.value));

  const pathData = lineGenerator(chartData) || '';

  const points = chartData.map((point) => ({
    x: xScale(point.timestamp),
    y: yScale(point.value),
    value: point.value,
    label: point.label,
    tooltip: point.tooltip,
  }));

  return { pathData, points, scales: { xScale, yScale } };
};

interface Props {
  data: DataPoint[];
}

export default function VolumeGraph({ data }: Props) {
  const [selectedPoint, setSelectedPoint] = useState<{
    x: number;
    y: number;
    value: number;
    label: string;
    tooltip: string;
  } | null>(null);

  // Reset selected point when screen loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        setSelectedPoint(null);
      };
    }, []),
  );

  const { pathData, points, scales } = useMemo(() => createGraph(data), [data]);

  const handleSvgPress = useCallback(
    (event: { nativeEvent: { locationX: number; locationY: number } }) => {
      if (!scales) {
        return;
      }

      const { locationX, locationY } = event.nativeEvent;

      let closestPoint = points[0];
      let minDistance = Number.POSITIVE_INFINITY;

      for (const point of points) {
        const distance = Math.sqrt((locationX - point.x) ** 2 + (locationY - point.y) ** 2);

        if (distance < minDistance) {
          minDistance = distance;
          closestPoint = point;
        }
      }

      if (minDistance < 60) {
        setSelectedPoint(closestPoint);
      } else {
        setSelectedPoint(null);
      }
    },
    [points, scales],
  );

  const tooltipOffset = selectedPoint
    ? Math.min(GRAPH_WIDTH - 100, Math.max(10, selectedPoint.x))
    : 0;

  return (
    <View
      style={styles.graph}
      accessible={true}
      accessibilityLabel={AccessibilityLabels.volumeChart}
      accessibilityRole="image"
    >
      <Pressable onPress={handleSvgPress}>
        <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT} style={styles.svg}>
          <Line
            x1={30}
            y1={30}
            x2={30}
            y2={GRAPH_HEIGHT - 30}
            stroke={COLORS.outline}
            strokeWidth={1}
            opacity={0.2}
          />

          <Line
            x1={30}
            y1={GRAPH_HEIGHT - 30}
            x2={GRAPH_WIDTH - 30}
            y2={GRAPH_HEIGHT - 30}
            stroke={COLORS.outline}
            strokeWidth={1}
            opacity={0.2}
          />

          {pathData && (
            <Path
              d={pathData}
              stroke={COLORS.primary}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {points.map((point, index) => (
            <Circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r={5}
              fill={COLORS.primary}
              stroke={COLORS.background}
              strokeWidth={3}
            />
          ))}

          {points.map((point, index) => (
            <TextSVG
              key={`label-${index}`}
              x={point.x}
              y={GRAPH_HEIGHT - 10}
              textAnchor="middle"
              fontSize="10"
              fill={COLORS.onSurface}
            >
              {point.label}
            </TextSVG>
          ))}

          {selectedPoint && (
            <Circle
              cx={selectedPoint.x}
              cy={selectedPoint.y}
              r={8}
              fill={COLORS.secondary}
              stroke={COLORS.background}
              strokeWidth={4}
              opacity={0.8}
            />
          )}
        </Svg>
      </Pressable>

      {selectedPoint && (
        <View
          style={[
            styles.tooltip,
            {
              top: Math.max(10, selectedPoint.y - 40),
              ...(isRTL() ? { right: tooltipOffset } : { left: tooltipOffset }),
            },
          ]}
        >
          <Text variant="labelLarge" style={{ textAlign: getRTLTextAlign() }}>
            {i18n.t('units.volumeWithUnit', {
              volume: Math.round(selectedPoint.value),
            })}
          </Text>

          <Text variant="bodySmall" style={{ textAlign: getRTLTextAlign() }}>
            {selectedPoint.tooltip}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  graph: {
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: COLORS.outline,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  svg: {
    backgroundColor: 'transparent',
  },
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
    flexDirection: isRTL() ? 'row-reverse' : 'row',
    gap: 4,
    justifyContent: 'space-between',
  },
});
