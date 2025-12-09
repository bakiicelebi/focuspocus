import React, { useEffect, useRef } from "react";
import { Button, XStack, YStack, Stack, useTheme } from "tamagui";
import CircularTimer, { CircularTimerProps } from "./CircularTimer";
import CustomDropDown, {
  CustomDropDownRef,
} from "components/Menus/CustomDropDown";
import {
  useTimerContext,
  TimerOption,
  addNewKey,
} from "../contexts/TimerContext";
import { Repeat, Undo } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { ShadowProps } from "constants/ShadowProps";
import { useMediaContext } from "contexts/MediaContext";

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

  const theme = useTheme();
  const { playVideo } = useMediaContext();

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

  const workButtonDisabled = mode === "work" || isTimerRunning;
  const breakButtonDisabled = mode === "break" || isTimerRunning;

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
        minWidth={"100%"}
        height={50}
        menuBorderRadius={10}
        deselectable={false}
      />

      <XStack alignItems="center" gap="$4">
        <Button
          onPress={() => setMode("work")}
          flex={1}
          disabled={workButtonDisabled}
          borderColor={mode === "work" ? "green" : undefined}
          {...(ShadowProps.medium as any)}
          fontWeight={600}
          bg={"$accent12"}
          theme={"green"}
          textProps={{
            opacity: workButtonDisabled ? 0.8 : 1,
            fontWeight: !workButtonDisabled ? 500 : 700,
          }}
          borderWidth={!workButtonDisabled ? 1 : 2}
        >
          Work Mode
        </Button>
        <Button
          onPress={() => setMode("break")}
          flex={1}
          disabled={breakButtonDisabled}
          borderColor={mode === "break" ? "yellow" : undefined}
          borderWidth={!breakButtonDisabled ? 1 : 2}
          {...(ShadowProps.medium as any)}
          fontWeight={600}
          bg={"$accent12"}
          theme={"yellow"}
          textProps={{
            opacity: breakButtonDisabled ? 0.8 : 1,
            fontWeight: !breakButtonDisabled ? 500 : 700,
          }}
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

      <Button onPress={playVideo}>Play Video</Button>

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
