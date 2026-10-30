import { BlurView } from "expo-blur";
import { Tabs, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";

function SettingsButton() {
  const colors = useColors();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        onPress={() => {
          scale.value = withSpring(0.88, { damping: 10 }, () => {
            scale.value = withSpring(1, { damping: 10 });
          });
          router.push("/settings");
        }}
        style={[styles.settingsBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name="settings" size={17} color={colors.foreground} />
      </TouchableOpacity>
    </Animated.View>
  );
}

function TabIcon({
  name,
  color,
  focused,
}: {
  name: string;
  color: string;
  focused: boolean;
}) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.18, { damping: 8, stiffness: 200 }, () => {
        scale.value = withSpring(1, { damping: 8 });
      });
      translateY.value = withSpring(-3, { damping: 8 }, () => {
        translateY.value = withSpring(0, { damping: 8 });
      });
    }
  }, [focused]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const glowOpacity = useSharedValue(0);
  React.useEffect(() => {
    glowOpacity.value = withTiming(focused ? 1 : 0, { duration: 200 });
  }, [focused]);
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));

  return (
    <View style={styles.tabIconContainer}>
      {/* Glow background */}
      <Animated.View
        style={[
          styles.tabGlow,
          { backgroundColor: color + "20" },
          glowStyle,
        ]}
      />
      <Animated.View style={animStyle}>
        <Feather name={name as any} size={22} color={color} />
      </Animated.View>
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();
  const t = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.foreground,
        headerTitleStyle: { fontFamily: "Inter_700Bold", fontSize: 18 },
        headerRight: () => <SettingsButton />,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: isWeb ? 84 : 66,
          paddingBottom: isWeb ? 34 : 10,
          paddingTop: 4,
        },
        tabBarLabelStyle: { fontFamily: "Inter_600SemiBold", fontSize: 10 },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={90}
              tint={isDark ? "dark" : "light"}
              style={[
                StyleSheet.absoluteFill,
                { borderTopWidth: 1, borderTopColor: colors.border },
              ]}
            />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: colors.card,
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                },
              ]}
            />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.calculator,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="activity" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t.history,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="clock" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: t.insights,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="bar-chart-2" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="stores"
        options={{
          title: t.stores,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="shopping-bag" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  settingsBtn: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: "center", justifyContent: "center",
    marginRight: 16, borderWidth: 1,
  },
  tabIconContainer: {
    width: 44, height: 34,
    alignItems: "center", justifyContent: "center",
  },
  tabGlow: {
    position: "absolute",
    width: 44, height: 34,
    borderRadius: 10,
  },
});
