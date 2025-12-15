import React, { useEffect, useRef } from "react";
import { Button, XStack, YStack, Stack, useTheme, Text } from "tamagui";
import CircularTimer, { CircularTimerProps } from "./CircularTimer";
import CustomDropDown, {
  CustomDropDownRef,
} from "components/Menus/CustomDropDown";
import {
  useTimerContext,
  TimerOption,
  addNewKey,
} from "../contexts/TimerContext";
import { Pause, Play, Repeat, Undo } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { ShadowProps } from "constants/ShadowProps";
import { useMediaContext } from "contexts/MediaContext";
import useTimerOptionLocalize from "hooks/useTimerOptionLocalize";
import { useUserPreferences } from "contexts/UserPreferencesContext";
import CustomDialog from "./CustomDialog";

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
    notifyOnFinish,
    setNotifyOnFinish,
    mode,
    setMode,
    selectedOption,
    setSelectedOption,
    timerOptions,
    setIsTimerRunning,
    timeLeft,
    setTimeLeft,
    handleTimerEnd,
    onManualTimerStarted,
    onManualTimerEnd,
    timerRef,
    isTimerRunning,
    isRepeatAvailable,
    setIsRepeatAvailable,
    resetTimer,
    stopMedia: stopMediaFromAll,
    setStopMedia: setStopMediaFromAll,
  } = useTimerContext();

  const theme = useTheme();
  const { playMedia, stopMedia, isMediaPlaying, setIsMediaPlaying } =
    useMediaContext();
  const { loadOption, syncSelectedOption } = useTimerOptionLocalize();

  const [key, setKey] = React.useState(1);
  const [notifyDialogOpen, setNotifyDialogOpen] = React.useState(false);

  const dropdownRef = useRef<CustomDropDownRef>(null);

  useEffect(() => {
    if (!selectedOption) {
      setSelectedOption(timerOptions[0]);
    }
    setTimeout(() => {
      loadSelectedOption();
    }, 50);
  }, []);

  useEffect(() => {
    if (!stopMediaFromAll) {
      stopMedia();
      setStopMediaFromAll(true);
    }
  }, [stopMediaFromAll]);

  useEffect(() => {
    if (notifyOnFinish) {
      setNotifyDialogOpen(true);
      console.log("Notifications on finish are enabled.");
      setNotifyOnFinish(false);
    }
  }, [notifyOnFinish]);

  const loadSelectedOption = async () => {
    console.log("Loading selected option from storage...");
    const localizedOption = await loadOption();
    if (localizedOption !== null) {
      console.log("Setting selected option from storage:", localizedOption);
      setSelectedOption(localizedOption);
    }
  };

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
        disabled={isTimerRunning}
        ref={dropdownRef}
        selectedItem={selectedOption}
        items={timerOptions}
        onSelect={(item) => {
          if (item.key === addNewKey) {
            handleAddNewOption();
          } else {
            setSelectedOption(item as TimerOption);
            syncSelectedOption(item as TimerOption);
            console.log("Selected timer option:", item);
          }
        }}
        minWidth={"100%"}
        height={50}
        menuBorderRadius={10}
        deselectable={false}
      />

      <XStack alignItems="center" mb={"$5"} gap="$4">
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
        <Stack
          position="absolute"
          bottom={-60}
          left={"50%"}
          style={{ transform: [{ translateX: -15 }] }}
          zIndex={10}
        >
          {isMediaPlaying ? (
            <Pause color={"lightgray"} onPress={stopMedia} size={30} />
          ) : (
            <Play color={"lightgray"} onPress={playMedia} size={30} />
          )}
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
        onTrigger={(started, seconds) => {
          if (!started) {
            playMedia();
            onManualTimerStarted(seconds);
          } else {
            stopMedia();
            onManualTimerEnd(seconds);
          }
        }}
      />
      <CustomDialog
        open={notifyDialogOpen}
        onOpenChange={setNotifyDialogOpen}
        width={"80%"}
        height={"auto"}
        trigger={false}
        header="Brief"
        buttons={[{ label: "OK", onPress: () => setNotifyDialogOpen(false) }]}
        children={
          <YStack gap="$4" padding="$4">
            <XStack
              width={"100%"}
              alignItems="center"
              justify={"space-between"}
            >
              <Text fontSize={18} fontWeight="600">
                Working Time
              </Text>
              <Text fontSize={18} fontWeight="300">
                {selectedOption.workTimeInMinutes?.toFixed(2)} minutes
              </Text>
            </XStack>
            <XStack
              width={"100%"}
              alignItems="center"
              justify={"space-between"}
            >
              <Text fontSize={18} fontWeight="600">
                Break Time
              </Text>
              <Text fontSize={18} fontWeight="300">
                {selectedOption.workTimeInMinutes?.toFixed(2)} minutes
              </Text>
            </XStack>
            <XStack
              width={"100%"}
              alignItems="center"
              justify={"space-between"}
            >
              <Text fontSize={18} fontWeight="600">
                Repeated Count
              </Text>
              <Text fontSize={18} fontWeight="300">
                {isRepeatAvailable ? "Infinite" : "Once"}
              </Text>
            </XStack>
            <XStack
              width={"100%"}
              alignItems="center"
              justify={"space-between"}
            >
              <Text fontSize={18} fontWeight="600">
                Distracted Count
              </Text>
              <Text fontSize={18} fontWeight="300">
                3
              </Text>
            </XStack>
          </YStack>
        }
      />
    </YStack>
  );
};

export default TimerScreenContent;
