import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface AnimatedPressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  scale?: number;
  disabled?: boolean;
}

export function AnimatedPressable({
  children,
  onPress,
  style,
  scale = 0.96,
  disabled,
}: AnimatedPressableProps) {
  const s = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: s.value }],
  }));

  const tap = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => { s.value = withSpring(scale, { damping: 12, stiffness: 200 }); })
    .onFinalize(() => { s.value = withSpring(1, { damping: 12, stiffness: 200 }); })
    .onEnd(() => { if (onPress) onPress(); });

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[style, animStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
}
