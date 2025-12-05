import React, { useEffect, useRef } from "react";
import { Button, XStack, YStack, Text, Stack } from "tamagui";
import CircularTimer, {
  CircularTimerRef,
  CircularTimerProps,
} from "./CircularTimer";
import CustomDropDown from "components/Menus/CustomDropDown";
import {
  TimerContextProvider,
  useTimerContext,
  TimerOption,
} from "../contexts/TimerContext";
import {
  RefreshCcw,
  RefreshCcwDot,
  Repeat,
  Undo,
  Undo2,
} from "@tamagui/lucide-icons";
import { router } from "expo-router";

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

const TimerScreenContent = () => {
  const {
    mode,
    setMode,
    selectedOption,
    setSelectedOption,
    timerOptions,
    setIsTimerRunning,
    timeLeft,
    setTimeLeft,
    handleTimerEnd,
    timerRef,
    isTimerRunning,
    isRepeatAvailable,
    setIsRepeatAvailable,
    resetTimer,
  } = useTimerContext();

  const [key, setKey] = React.useState(1);

  useEffect(() => {
    if (!selectedOption) {
      setSelectedOption(timerOptions[0]);
    }
  }, []);

  const handleTimeChange = (seconds: number) => {
    setTimeLeft(seconds);
    console.log("Time left updated to:", seconds);
  };

  const currentConfig = timerStyle[mode];

  if (!selectedOption) return null;

  const maxTime =
    mode === "work"
      ? selectedOption.workTimeInMinutes * 60
      : selectedOption.breakTimeInMinutes * 60;

  const timerKey = `${mode}-${selectedOption?.key}-${selectedOption?.workTimeInMinutes}-${selectedOption?.breakTimeInMinutes}-${timeLeft}-${maxTime}`;

  return (
    <YStack
      flex={1}
      pt={"$5"}
      alignItems="center"
      gap="$10"
      px="$10"
      bg="$background"
    >
      <XStack alignItems="center" gap="$4">
        <Text fontSize={16}>Timer Option:</Text>
        <CustomDropDown
          selectedItem={selectedOption}
          items={timerOptions}
          keyName="key"
          labelName="label"
          onSelect={(item) => {
            if (item.key === "addNew") {
              console.log("Add New option selected");
              setKey((prev) => {
                router.navigate({
                  pathname: "/(tabs)/three",
                  params: {
                    addNew: "true",
                    key: prev,
                  },
                });
                return prev + 1;
              });
            } else {
              setSelectedOption(item as TimerOption);
            }
          }}
          minWidth={225}
          height={40}
          menuBorderRadius={10}
          deselectable={false}
        />
      </XStack>

      <XStack alignItems="center" gap="$4">
        <Button
          onPress={() => setMode("work")}
          flex={1}
          disabled={mode === "work" || isTimerRunning}
          borderColor={mode === "work" ? "green" : undefined}
          variant="outlined"
        >
          Work Mode
        </Button>
        <Button
          onPress={() => setMode("break")}
          flex={1}
          disabled={mode === "break" || isTimerRunning}
          borderColor={mode === "break" ? "yellow" : undefined}
          variant="outlined"
        >
          Break Mode
        </Button>
        <Stack position="absolute" bottom={-60} right={10} zIndex={10}>
          <Repeat
            color={isRepeatAvailable ? "green" : "lightgray"}
            onPress={() => setIsRepeatAvailable(!isRepeatAvailable)}
            size={30}
          />
        </Stack>
        <Stack position="absolute" bottom={-60} left={10} zIndex={10}>
          <Undo
            disabled={isTimerRunning}
            color={"lightgray"}
            onPress={resetTimer}
            size={30}
          />
        </Stack>
      </XStack>

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
        onActiveChange={(isActive) => setIsTimerRunning(isActive)}
        onChange={handleTimeChange}
      />
    </YStack>
  );
};
export default TimerScreenContent;
