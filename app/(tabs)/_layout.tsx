import { Link, Tabs, usePathname } from "expo-router";
import { Button, Stack, useTheme } from "tamagui";
import {
  Atom,
  AudioWaveform,
  ChartBar,
  ChartColumn,
  ChartNoAxesGantt,
  Cog,
  Home,
  Settings2,
} from "@tamagui/lucide-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Settings } from "react-native";

export default function TabLayout() {
  // const [homeButtonActive, setHomeButtonActive] = useState(true);

  const pathname = usePathname();

  // Home sayfasında mıyız?
  const homeButtonActive = pathname === "/"; // veya "/(tabs)" yapısı varsa ayarla

  const theme = useTheme();

  const tabOpacity = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const initialAnimation = Animated.timing(tabOpacity, {
        toValue: 0.6,
        duration: 1500,
        useNativeDriver: true,
      });

      animationRef.current = initialAnimation;
      initialAnimation.start();
    }, 5000);

    return () => {
      animationRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    triggerAnimation();
  }, [pathname]);

  const triggerAnimation = () => {
    animationRef.current?.stop();

    tabOpacity.setValue(1);

    animationRef.current = Animated.sequence([
      Animated.timing(tabOpacity, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(tabOpacity, {
        toValue: 0.6,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]);

    animationRef.current.start();
  };

  const handleTabPress = () => {
    triggerAnimation();
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent1.val,
        headerTitle: "",
        tabBarStyle: {
          backgroundColor: theme.background08.val,
          display: "flex",
          position: "absolute",
          maxHeight: 60,
          opacity: tabOpacity,
          margin: 15,
          marginBottom: 30,
          borderRadius: 20,
          zIndex: 10,
          borderWidth: 1,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 5,
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          height: 60,
          borderBottomColor: theme.borderColor.val,
        },
        headerTintColor: theme.color.val,
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarLabelPosition: "below-icon", // bazen default olarak 'beside-icon' geliyor
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          display: "none",
        },
        tabBarItemStyle: {
          padding: 0,
          margin: 0,
        },
      }}
    >
      <Tabs.Screen
        name="two"
        listeners={{ tabPress: handleTabPress }}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <ChartNoAxesGantt
              marginTop={15}
              size={focused ? 45 : 40}
              color={color as any}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        listeners={{ tabPress: handleTabPress }}
        options={{
          title: "QR Code",
          tabBarShowLabel: false,
          headerStatusBarHeight: 45,
          tabBarButton: (props: any) => {
            return (
              <Stack
                borderRadius={50}
                top={-12}
                left={-1}
                bottom={-20}
                shadowColor={"$accent10"}
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.6}
                shadowRadius={10}
                zIndex={20}
                onPress={props?.onPress ? () => props.onPress() : undefined}
              >
                <Button
                  onPress={props?.onPress ? () => props.onPress() : undefined}
                  width={85}
                  height={85}
                  alignSelf="center"
                  bg={"$background"}
                  borderRadius={50}
                >
                  <Home
                    opacity={homeButtonActive ? 1 : 0.5}
                    size={homeButtonActive ? 40 : 35}
                  />
                </Button>
              </Stack>
            );
          },
        }}
      />

      <Tabs.Screen
        name="three"
        listeners={{ tabPress: handleTabPress }}
        options={{
          tabBarShowLabel: false,
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Cog marginTop={15} size={focused ? 45 : 40} color={color as any} />
          ),
          headerStatusBarHeight: 45,
        }}
      />
    </Tabs>
  );
}
