import { useEffect } from 'react';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { Rect as SvgRect } from 'react-native-svg';

interface Props {
  x: number;
  width: number;
  toY: number;
  toHeight: number;
  fill: string;
  rx: number;
  ry: number;
  duration?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
  isActive?: boolean;
  expandedWidth?: number;
  targetOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
}

const AnimatedRect = Animated.createAnimatedComponent(SvgRect);

export default function AnimatedBar({
  x,
  width,
  toY,
  toHeight,
  fill,
  rx,
  ry,
  duration = 600,
  onPress,
  accessibilityLabel,
  isActive,
  expandedWidth,
  targetOpacity = 1,
  stroke,
  strokeWidth = 0,
}: Props) {
  const animatedY = useSharedValue(toY + toHeight);
  const animatedHeight = useSharedValue(0);
  const animatedOpacity = useSharedValue(1);
  const animatedWidth = useSharedValue(width);
  const animatedX = useSharedValue(x);

  useEffect(() => {
    animatedY.value = withTiming(toY, { duration });
    animatedHeight.value = withTiming(Math.max(2, toHeight), { duration });
  }, [toY, toHeight, duration, animatedY, animatedHeight]);

  useEffect(() => {
    animatedOpacity.value = withTiming(targetOpacity, { duration: 200 });
  }, [targetOpacity, animatedOpacity]);

  useEffect(() => {
    const targetWidth = isActive && expandedWidth ? expandedWidth : width;
    const widthDiff = targetWidth - width;
    const targetX = isActive ? x - widthDiff / 2 : x;

    animatedWidth.value = withTiming(targetWidth, { duration: 250 });
    animatedX.value = withTiming(targetX, { duration: 250 });
  }, [isActive, expandedWidth, width, x, animatedWidth, animatedX]);

  const animatedProps = useAnimatedProps(() => ({
    x: animatedX.value,
    y: animatedY.value,
    width: animatedWidth.value,
    height: animatedHeight.value,
    fill,
    opacity: animatedOpacity.value,
  }));

  return (
    <AnimatedRect
      width={0}
      x={0}
      rx={rx}
      ry={ry}
      animatedProps={animatedProps}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}
