import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Animated, Easing } from "react-native";
import { YStack, ZStack, Text, ViewProps } from "tamagui";
import { RadialSlider } from "react-native-radial-slider";
import { Power } from "@tamagui/lucide-icons";
import { interpolateColor } from "utils/InterpolateColor";
import { formatTime } from "utils/TimeFormats";

type backgroundColorType = ViewProps["backgroundColor"];

export interface CircularTimerProps {
  size?: number;
  thickness?: number;
  maxSeconds?: number;
  initialSeconds?: number;
  startColor?: any;
  endColor?: any;
  activeColor?: any;
  inactiveColor?: any;
  thumbColor?: any;
  thumbBorderColor?: any;
  backgroundColor?: backgroundColorType;
  onEnd?: () => void;
  onActiveChange?: (isActive: boolean) => void;
  disabledChange?: boolean;
  centerTexts?: [string, string];
  centerTextDisabled?: boolean;
  onChange?: (seconds: number) => void;
}

export interface CircularTimerRef {
  toggle: (trigger?: boolean) => void;
  reset: (seconds?: number) => void;
  // start: () => void;
  // stop: () => void;
}

const CircularTimer = (
  {
    size = 260,
    thickness = 10,
    maxSeconds = 30 * 60,
    initialSeconds,
    startColor = "#072712c0",
    endColor = "#007a29bd",
    activeColor = "#38a15bff",
    inactiveColor = "#ff0000ff",
    thumbColor = "#114221ff",
    thumbBorderColor,
    backgroundColor = "$background",
    onEnd,
    onActiveChange,
    disabledChange,
    centerTexts = ["Start", "Stop"],
    centerTextDisabled,
    onChange,
  }: CircularTimerProps,
  ref: React.Ref<CircularTimerRef>
) => {
  const safeMaxSeconds = Math.max(1, Math.floor(maxSeconds));

  const calculateInitialValue = () => {
    if (initialSeconds !== undefined) {
      return Math.floor(initialSeconds);
    }
    return Math.floor(safeMaxSeconds / 6);
  };

  const [totalSeconds, setTotalSeconds] = useState(calculateInitialValue());
  const [isActive, setIsActive] = useState(false);

  const breathAnim = useRef(new Animated.Value(0)).current;

  const handleChangeSpeed = (val: number, updateCallback?: boolean) => {
    if (!isActive) {
      let currentVal = val;
      if (currentVal < 0) currentVal = 0;
      if (currentVal > safeMaxSeconds) currentVal = safeMaxSeconds;
      if (disabledChange) currentVal = totalSeconds;

      setTotalSeconds(Math.floor(currentVal));
      if (onChange && updateCallback) {
        onChange(Math.floor(currentVal));
      }
    }
  };

  const dynamicBorderColor: any = interpolateColor(
    startColor,
    endColor,
    totalSeconds / safeMaxSeconds
  );

  useEffect(() => {
    if (onActiveChange) {
      onActiveChange(isActive);
    }
  }, [isActive, onActiveChange]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => prev - 1);
      }, 1000);
    } else if (totalSeconds === 0 && isActive) {
      setIsActive(false);
      if (onEnd) onEnd();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, totalSeconds, onEnd]);

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(500),
          Animated.timing(breathAnim, {
            toValue: 0,
            duration: 1000,
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

  useImperativeHandle(ref, () => ({
    toggle: (trigger?: boolean) => toggleTimer(trigger),
    reset: (seconds?: number) => {
      setTotalSeconds(
        seconds !== undefined ? Math.floor(seconds) : calculateInitialValue()
      );
      setIsActive(false);
    },
  }));

  const animatedOpacity = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const toggleTimer = (trigger?: boolean) => {
    if (trigger !== undefined) {
      setIsActive(trigger);
    } else if (totalSeconds > 0) {
      setIsActive(!isActive);
    }
  };

  return (
    <ZStack
      width={size}
      height={size}
      alignItems="center"
      justifyContent="center"
    >
      <YStack
        marginTop={0.5 * thickness}
        width={size}
        height={size}
        borderRadius={size / 2}
        borderWidth={thickness}
        borderColor={dynamicBorderColor}
        justifyContent="center"
        alignItems="center"
        backgroundColor={backgroundColor}
      >
        <YStack
          zIndex={99}
          pointerEvents={"box-none"}
          flex={1}
          borderRadius={200}
          alignItems="center"
          justifyContent="center"
          gap={5}
          onPress={() => toggleTimer()}
        >
          <Text
            fontSize={size * 0.12}
            width={size * 0.6}
            textAlign="center"
            fontWeight="bold"
            color="$color"
            mb={40}
          >
            {formatTime(totalSeconds)}
          </Text>

          <Animated.View
            style={{
              opacity: isActive ? animatedOpacity : 1,
            }}
          >
            <Power
              size={size * 0.15}
              color={isActive ? activeColor : inactiveColor}
            />
          </Animated.View>
          <Text textAlign="center" color="$color" fontSize={20}>
            {centerTextDisabled
              ? ""
              : isActive
              ? centerTexts[1]
              : centerTexts[0]}
          </Text>
        </YStack>
      </YStack>

      <RadialSlider
        variant="radial-circle-slider"
        value={totalSeconds}
        disabled={disabledChange}
        min={0}
        max={safeMaxSeconds}
        onChange={handleChangeSpeed}
        radius={size / 2 - thickness * 2}
        sliderWidth={thickness}
        thumbColor={thumbColor}
        sliderTrackColor="transparent"
        isHideLines
        onComplete={(val: number) => handleChangeSpeed(val, true)}
        isHideCenterContent
        thumbBorderColor={thumbBorderColor ?? activeColor}
        style={{
          alignSelf: "center",
          position: "absolute",
          pointerEvents: isActive || disabledChange ? "none" : "auto",
        }}
        linearGradient={[
          { offset: "0%", color: startColor },
          { offset: "100%", color: endColor },
        ]}
      />
    </ZStack>
  );
};

export default forwardRef(CircularTimer);
