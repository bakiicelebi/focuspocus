import React, { useEffect, useRef } from "react";
import { YStack } from "tamagui";
import CircularTimer, {
  CircularTimerRef,
  CircularTimerProps,
} from "../../components/CircularTimer";
import CustomDropDown from "components/Menus/CustomDropDown";
import {
  TimerContextProvider,
  useTimerContext,
  TimerOption,
} from "../../contexts/TimerContext";

const timerStyle: Record<"work" | "break", CircularTimerProps> = {
  work: {
    startColor: "#072712c0",
    endColor: "#007a29bd",
    activeColor: "#38a15bff",
    inactiveColor: "#ff0000ff",
    thumbColor: "#114221ff",
  },
  break: {
    startColor: "#212707c0",
    endColor: "#b5c710bd",
    activeColor: "#81a138ff",
    inactiveColor: "#ff0000ff",
    thumbColor: "#b5c528ff",
  },
};

const timerOptions: TimerOption[] = [
  {
    key: "pomodoro",
    label: "Pomodoro",
    workTimeInMinutes: 25,
    breakTimeInMinutes: 5,
  },
  {
    key: "5217",
    label: "52/17",
    workTimeInMinutes: 52,
    breakTimeInMinutes: 17,
  },
  {
    key: "ultradian",
    label: "Ultradian",
    workTimeInMinutes: 90,
    breakTimeInMinutes: 25,
  },
  {
    key: "custom",
    label: "Custom",
    workTimeInMinutes: 45,
    breakTimeInMinutes: 15,
  },
];

const TimerScreenContent = () => {
  const {
    mode,
    selectedOption,
    setSelectedOption,
    isTimerRunning,
    setIsTimerRunning,
    timeLeft,
    maxTime,
    handleTimerEnd,
    timerKey,
    timerRef,
  } = useTimerContext();

  useEffect(() => {
    if (!selectedOption) {
      setSelectedOption(timerOptions[0]);
    }
  }, []);

  const currentConfig = timerStyle[mode];
  const disabledChangeTimer = selectedOption?.key !== "custom";

  if (!selectedOption) return null;

  return (
    <YStack
      flex={1}
      pt={"$5"}
      alignItems="center"
      gap="$10"
      px="$10"
      bg="$background"
    >
      <CustomDropDown
        selectedItem={selectedOption}
        items={timerOptions}
        keyName="key"
        labelName="label"
        onSelect={(item) => setSelectedOption(item)}
        minWidth={250}
        height={40}
        menuBorderRadius={10}
        deselectable={false}
      />

      <CircularTimer
        ref={timerRef}
        key={timerKey}
        maxSeconds={maxTime}
        initialSeconds={timeLeft}
        startColor={currentConfig.startColor}
        endColor={currentConfig.endColor}
        activeColor={currentConfig.activeColor}
        inactiveColor={currentConfig.inactiveColor}
        thumbColor={currentConfig.thumbColor}
        onEnd={handleTimerEnd}
        // Kullanıcı butona bastığında Context'i haberdar et
        onActiveChange={(isActive) => setIsTimerRunning(isActive)}
        disabledChange={disabledChangeTimer}
      />
    </YStack>
  );
};

// Ana Ekran (Provider ile sarmalıyoruz)
export default function TabOneScreen() {
  return (
    <TimerContextProvider>
      <TimerScreenContent />
    </TimerContextProvider>
  );
}
