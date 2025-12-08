import React, { useEffect, useRef } from "react";
import { Button, XStack, YStack, Text, Stack, useTheme } from "tamagui";
import CircularTimer, {
  CircularTimerRef,
  CircularTimerProps,
} from "./CircularTimer";
import CustomDropDown, {
  CustomDropDownRef,
} from "components/Menus/CustomDropDown";
import {
  TimerContextProvider,
  useTimerContext,
  TimerOption,
  addNewKey,
} from "../contexts/TimerContext";
import {
  RefreshCcw,
  RefreshCcwDot,
  Repeat,
  Undo,
  Undo2,
} from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { ShadowProps } from "constants/ShadowProps";

const timerStyle: Record<"work" | "break", CircularTimerProps> = {
  work: {
    startColor: "$timerWorkStartColor",
    endColor: "$timerWorkEndColor",
    activeColor: "$timerWorkActiveColor",
    inactiveColor: "$timerWorkInactiveColor",
    thumbColor: "$timerWorkThumbColor",
  },
  break: {
    startColor: "$timerBreakStartColor",
    endColor: "$timerBreakEndColor",
    activeColor: "$timerBreakActiveColor",
    inactiveColor: "$timerBreakInactiveColor",
    thumbColor: "$timerBreakThumbColor",
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

  console.log(selectedOption);

  const theme = useTheme();

  const [key, setKey] = React.useState(1);

  const dropdownRef = useRef<CustomDropDownRef>(null);

  useEffect(() => {
    if (!selectedOption) {
      setSelectedOption(timerOptions[0]);
    }
  }, []);

  const handleTimeChange = (seconds: number) => {
    setTimeLeft(seconds);
    console.log("Time left updated to:", seconds);
  };

  const handleAddNewOption = () => {
    if (dropdownRef?.current) {
      dropdownRef.current.toggle(false);
    }
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
  };

  const currentConfig = {
    startColor:
      theme[`timer${mode === "work" ? "Work" : "Break"}StartColor`].val,
    endColor: theme[`timer${mode === "work" ? "Work" : "Break"}EndColor`].val,
    activeColor:
      theme[`timer${mode === "work" ? "Work" : "Break"}ActiveColor`].val,
    inactiveColor:
      theme[`timer${mode === "work" ? "Work" : "Break"}InactiveColor`].val,
    thumbColor:
      theme[`timer${mode === "work" ? "Work" : "Break"}ThumbColor`].val,
  };

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
      <CustomDropDown
        ref={dropdownRef}
        selectedItem={selectedOption}
        items={timerOptions}
        onSelect={(item) => {
          if (item.key === addNewKey) {
            handleAddNewOption();
          } else {
            setSelectedOption(item as TimerOption);
          }
        }}
        minWidth={"95%"}
        height={40}
        menuBorderRadius={10}
        deselectable={false}
      />

      <XStack alignItems="center" gap="$4">
        <Button
          onPress={() => setMode("work")}
          flex={1}
          disabled={mode === "work" || isTimerRunning}
          borderColor={mode === "work" ? "green" : undefined}
          variant="outlined"
          {...(ShadowProps.medium as any)}
          fontWeight={600}
        >
          Work Mode
        </Button>
        <Button
          onPress={() => setMode("break")}
          flex={1}
          disabled={mode === "break" || isTimerRunning}
          borderColor={mode === "break" ? "yellow" : undefined}
          variant="outlined"
          {...(ShadowProps.medium as any)}
          fontWeight={600}
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
