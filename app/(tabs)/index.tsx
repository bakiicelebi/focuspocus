import React, { useState, useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { YStack, ZStack, Text } from "tamagui";
import { RadialSlider } from "react-native-radial-slider";
import { Power } from "@tamagui/lucide-icons";
import { interpolateColor } from "utils/InterpolateColor"; // Senin fonksiyonun
import { formatTime } from "utils/TimeFormats";

export default function TabOneScreen() {
  const [maxSpeed, setMaxSpeed] = useState(60 * 60); // Maksimum dakika
  const [totalSeconds, setTotalSeconds] = useState(600); // 10 dakika * 60 saniye
  const [isActive, setIsActive] = useState(false);

  const breathAnim = useRef(new Animated.Value(0)).current;

  const startColor = "#072712c0";
  const endColor = "#007a29bd";
  const activeIconColor = "#38a15bff";
  const inactiveIconColor = "#ff0000ff";

  const handleChangeSpeed = (val: number) => {
    if (!isActive) {
      setTotalSeconds(val);
    }
  };

  const dynamicBorderColor = interpolateColor(
    startColor,
    endColor,
    totalSeconds / maxSpeed
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => prev - 1);
      }, 1000);
    } else if (totalSeconds === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, totalSeconds]);

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathAnim, {
            toValue: 1,
            duration: 1250, // 1 saniyede nefes al
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),

          Animated.delay(500),

          Animated.timing(breathAnim, {
            toValue: 0,
            duration: 1250, // 1 saniyede nefes ver
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      breathAnim.stopAnimation(() => {
        breathAnim.setValue(0);
      });
    }
  }, [isActive]);

  const animatedOpacity = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1], // Parlaklığı biraz değişsin
  });

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const ringSize = 260;
  const ringThickness = 10;

  return (
    <YStack
      flex={1}
      pt={"$10"}
      alignItems="center"
      gap="$8"
      px="$10"
      bg="$background"
    >
      <ZStack
        width={ringSize}
        height={ringSize}
        alignItems="center"
        justifyContent="center"
      >
        {/* 1. KATMAN: Dış Çerçeve ve İçerik */}
        <YStack
          marginTop={0.5 * ringThickness}
          width={ringSize}
          height={ringSize}
          borderRadius={ringSize / 2}
          borderWidth={ringThickness}
          borderColor={dynamicBorderColor}
          justifyContent="center"
          alignItems="center"
        >
          <YStack
            zIndex={99}
            pointerEvents={"box-none"}
            flex={1}
            borderRadius={200}
            alignItems="center"
            justifyContent="space-evenly"
            onPress={toggleTimer}
          >
            <Text
              fontSize={30}
              width={150}
              textAlign="center"
              fontWeight="bold"
              color="$color"
            >
              {formatTime(totalSeconds)}
            </Text>

            {/* Animated Power Icon */}
            <Animated.View
              style={{
                opacity: isActive ? animatedOpacity : 1,
                marginBottom: 10,
              }}
            >
              <Power
                size={40}
                color={isActive ? activeIconColor : inactiveIconColor}
              />
            </Animated.View>
          </YStack>
        </YStack>

        <RadialSlider
          variant="radial-circle-slider"
          value={60} // Slider dakika bazlı çalışır
          min={0}
          max={maxSpeed}
          onChange={handleChangeSpeed}
          radius={ringSize / 2 - ringThickness * 2}
          sliderWidth={10}
          thumbColor={"#114221ff"}
          sliderTrackColor="transparent"
          isHideLines
          isHideCenterContent
          thumbBorderColor={activeIconColor}
          style={{
            alignSelf: "center",
            position: "absolute",
            pointerEvents: isActive ? "none" : "auto",
          }}
          linearGradient={[
            { offset: "0%", color: startColor },
            { offset: "100%", color: endColor },
          ]}
        />
      </ZStack>
    </YStack>
  );
}
