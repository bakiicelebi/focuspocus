import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Animated, Easing } from "react-native";
import { YStack, ZStack, Text, ViewProps, getToken } from "tamagui";
import { RadialSlider } from "react-native-radial-slider";
import { Power } from "@tamagui/lucide-icons";
import { interpolateColor } from "utils/InterpolateColor";
import { formatTime } from "utils/TimeFormats";
import { useTimerContext } from "contexts/TimerContext";

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
  outline?: boolean;
  isButtonHidden?: boolean;
  isCenterTextHidden?: boolean;
  sliderTrackColor?: string;
  workWithContext?: boolean;
  onTrigger?: (started: boolean, seconds?: number) => void;
}

export interface CircularTimerRef {
  toggle: (trigger?: boolean) => void;
  reset: (seconds?: number) => void;
}

const CircularTimer = (
  {
    size = getToken("$defaultTimerSize"),
    thickness = getToken("$defaultTimerThickness"),
    maxSeconds = 30 * 60,
    initialSeconds,
    startColor = "$timerWorkStartColor",
    endColor = "$timerWorkEndColor",
    activeColor = "$timerWorkActiveColor",
    inactiveColor = "$timerWorkInactiveColor",
    thumbColor = "$timerWorkThumbColor",
    thumbBorderColor,
    backgroundColor = "$background",
    onEnd,
    onActiveChange,
    disabledChange,
    centerTexts = ["Start", "Stop"],
    centerTextDisabled,
    onChange,
    outline = true,
    isButtonHidden = false,
    isCenterTextHidden = false,
    sliderTrackColor = "transparent",
    workWithContext = false,
    onTrigger,
  }: CircularTimerProps,
  ref: React.Ref<CircularTimerRef>
) => {
  const { setTimerCurrentSecond, timerCurrentSecond } = useTimerContext();

  const safeMaxSeconds = Math.max(1, Math.floor(maxSeconds));

  const calculateInitialValue = () => {
    if (initialSeconds !== undefined) {
      return Math.floor(initialSeconds);
    }
    return Math.floor(safeMaxSeconds / 6);
  };

  const [totalSeconds, setTotalSeconds] = useState(calculateInitialValue); // Pass reference or call it, both work here since it's pure now
  const [isActive, setIsActive] = useState(false);


  const breathAnim = useRef(new Animated.Value(0)).current;

  const handleChangeSpeed = (val: number, updateCallback?: boolean) => {
    if (!isActive) {
      let currentVal = val;
      if (currentVal < 0) currentVal = 0;
      if (currentVal > safeMaxSeconds) currentVal = safeMaxSeconds;
      if (disabledChange) currentVal = totalSeconds;

      setTotalSeconds(Math.floor(currentVal));
      setTimerCurrentSecond(Math.floor(currentVal));
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
    if (workWithContext) {
      setTotalSeconds(timerCurrentSecond);
    }
  }, [timerCurrentSecond, workWithContext]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          const next = prev - 1;
          setTimerCurrentSecond(next);
          return next;
        });
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
      const newVal =
        seconds !== undefined ? Math.floor(seconds) : calculateInitialValue();
      setTotalSeconds(newVal);
      setTimerCurrentSecond(newVal);
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
        borderWidth={outline ? thickness : 0}
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
          onPress={() => {
            if (onTrigger) {
              onTrigger(isActive, totalSeconds);
            }
            toggleTimer();
          }}
        >
          <Text
            fontSize={size * 0.12}
            width={size * 0.6}
            textAlign="center"
            fontWeight="bold"
            color="$color"
            mb={
              isButtonHidden && isCenterTextHidden
                ? 0
                : isCenterTextHidden || isButtonHidden
                ? 20
                : 40
            }
          >
            {formatTime(totalSeconds)}
          </Text>

          {!isButtonHidden && (
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
          )}
          {!isCenterTextHidden && (
            <Text textAlign="center" color="$color" fontSize={20}>
              {centerTextDisabled
                ? ""
                : isActive
                ? centerTexts[1]
                : centerTexts[0]}
            </Text>
          )}
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
        sliderTrackColor={sliderTrackColor}
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
