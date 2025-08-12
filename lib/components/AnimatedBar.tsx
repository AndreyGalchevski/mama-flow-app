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
}: Props) {
  const animatedY = useSharedValue(toY + toHeight);
  const animatedHeight = useSharedValue(0);
  const animatedFill = useSharedValue(fill);

  useEffect(() => {
    animatedY.value = withTiming(toY, { duration });
    animatedHeight.value = withTiming(Math.max(2, toHeight), { duration });
    animatedFill.value = fill;
  }, [toY, toHeight, fill, duration, animatedY, animatedHeight, animatedFill]);

  const animatedProps = useAnimatedProps(() => ({
    y: animatedY.value,
    height: animatedHeight.value,
    fill: animatedFill.value,
  }));

  return (
    <AnimatedRect
      x={x}
      width={width}
      rx={rx}
      ry={ry}
      animatedProps={animatedProps}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      opacity={isActive ? 0.7 : 1}
    />
  );
}
