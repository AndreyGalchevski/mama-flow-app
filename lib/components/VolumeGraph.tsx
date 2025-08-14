import { useFocusEffect } from '@react-navigation/native';
import { max } from 'd3-array';
import { scaleBand, scaleLinear } from 'd3-scale';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { G, Text as SvgText } from 'react-native-svg';

import { AccessibilityLabels } from '../accessibility';
import { COLORS } from '../colors';
import i18n from '../i18n';
import type { DataPoint } from '../types';
import AnimatedBar from './AnimatedBar';

const barRadius = 18;
const INACTIVE_OPACITY = 0.55;
const WAVE_DELAY_STEP_IN_MS = 40;

const padding = { top: 16, right: 16, bottom: 36, left: 16 };

// Animated Text component for smooth label transitions
const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

interface AnimatedTextProps {
  x: number;
  y: number;
  children: React.ReactNode;
  fontSize: number;
  fill: string;
  textAnchor: 'start' | 'middle' | 'end';
}

function AnimatedText({ x, y, children, fontSize, fill, textAnchor }: AnimatedTextProps) {
  const animatedX = useSharedValue(x);

  useEffect(() => {
    animatedX.value = withTiming(x, { duration: 250 });
  }, [x, animatedX]);

  const animatedProps = useAnimatedProps(() => ({
    x: animatedX.value,
  }));

  return (
    <AnimatedSvgText
      y={y}
      fontSize={fontSize}
      fill={fill}
      textAnchor={textAnchor}
      animatedProps={animatedProps}
    >
      {children}
    </AnimatedSvgText>
  );
}

interface Props {
  data: DataPoint[];
  width?: number;
  height?: number;
}

export default function VolumeGraph({ data, width = 340, height = 220 }: Props) {
  const [selectedBar, setSelectedBar] = useState<string | null>(null);

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
        if (selectedBar === clickedBar.label) {
          setSelectedBar(null);
        } else {
          setSelectedBar(clickedBar.label);
        }
      } else {
        setSelectedBar(null);
      }
    },
    [data, x, y, chartH, selectedBar],
  );

  const chartAnimatedStyle = useAnimatedStyle(() => ({
    opacity: chartOpacity.value,
  }));

  const selectedIndex = useMemo(
    () => (selectedBar ? data.findIndex((item) => item.label === selectedBar) : -1),
    [selectedBar, data],
  );

  return (
    <Animated.View
      style={[{ width, height, alignSelf: 'center' }, chartAnimatedStyle]}
      accessible
      accessibilityLabel={AccessibilityLabels.volumeChart}
      accessibilityRole="image"
    >
      <Svg width={width} height={height} onPress={handleSvgPress}>
        <G x={padding.left} y={padding.top}>
          {data.map((d, index) => {
            const barX = x(d.label) ?? 0;
            const barW = x.bandwidth();
            const barH = chartH - y(d.value);
            const barY = y(d.value);

            const isSelected = selectedIndex === index;
            const anySelected = selectedIndex !== -1;
            const expandedWidth = barW * 1.8;

            const shouldShowText = isSelected && barH > 10;
            const shouldShowFullText = isSelected && barH > 60;
            const shouldShowTwoLines = isSelected && barH > 40;

            // Horizontal shift of neighbors based on selectedIndex
            let adjustedBarX = barX;
            if (anySelected && selectedIndex !== -1) {
              const extraWidth = (expandedWidth - barW) / 2;
              if (index > selectedIndex) adjustedBarX = barX + extraWidth;
              else if (index < selectedIndex) adjustedBarX = barX - extraWidth;
            }

            // Wave delay (skip selected bar itself)
            const opacityDelay =
              anySelected && !isSelected
                ? Math.abs(index - selectedIndex) * WAVE_DELAY_STEP_IN_MS
                : 0;

            return (
              <G key={d.label}>
                <AnimatedBar
                  x={adjustedBarX}
                  width={barW}
                  toY={barY}
                  toHeight={barH}
                  fill={COLORS.primary}
                  rx={barRadius}
                  ry={barRadius}
                  duration={400 + index * 100}
                  isActive={isSelected}
                  expandedWidth={expandedWidth}
                  targetOpacity={anySelected ? (isSelected ? 1 : INACTIVE_OPACITY) : 1}
                  opacityDelay={opacityDelay}
                  stroke={isSelected ? '#2C5E5F' : undefined}
                  strokeWidth={isSelected ? 2 : 0}
                />

                {shouldShowText && (
                  <G>
                    <SvgText
                      x={adjustedBarX + barW / 2}
                      y={barY + 16}
                      fontSize={13}
                      fontWeight="600"
                      fill={COLORS.surface}
                      textAnchor="middle"
                    >
                      {i18n.t('units.volumeWithUnit', { volume: Math.round(d.value) })}
                    </SvgText>
                    {shouldShowTwoLines && (
                      <SvgText
                        x={adjustedBarX + barW / 2}
                        y={barY + 30}
                        fontSize={11}
                        fill={COLORS.surface}
                        textAnchor="middle"
                        opacity={0.9}
                      >
                        {i18n.t('units.sessions', { count: d.pumpCount })}
                      </SvgText>
                    )}
                    {shouldShowFullText && (
                      <SvgText
                        x={adjustedBarX + barW / 2}
                        y={barY + 44}
                        fontSize={10}
                        fill={COLORS.surface}
                        textAnchor="middle"
                        opacity={0.8}
                      >
                        {d.tooltip}
                      </SvgText>
                    )}
                  </G>
                )}

                <AnimatedText
                  x={adjustedBarX + barW / 2}
                  y={chartH + 18}
                  fontSize={12}
                  fill={COLORS.onSurface}
                  textAnchor="middle"
                >
                  {d.label}
                </AnimatedText>
              </G>
            );
          })}
        </G>
      </Svg>
    </Animated.View>
  );
}
