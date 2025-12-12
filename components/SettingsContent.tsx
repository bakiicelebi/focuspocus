import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, Text, YStack, Button, XStack } from "tamagui";
import CustomDialog, { CustomDialogRef } from "./CustomDialog";
import TimerOptionsForm from "./TimerOptionsForm";
import { TimerOption, useTimerContext } from "contexts/TimerContext";
import { useThemeMode } from "contexts/ThemeContext";
import {
  Clock,
  Moon,
  SunDim,
  SunMoon,
  Vibrate,
  VibrateOff,
  Volume2,
  VolumeOff,
} from "@tamagui/lucide-icons";
import { ShadowProps } from "constants/ShadowProps";
import { useUserPreferences } from "contexts/UserPreferencesContext";
import MediaPreferences from "./MediaPreferences";
import { clearAllData } from "utils/AsyncStorageUtils";

const SettingsContent = () => {
  const params = useLocalSearchParams();
  const { timerOptions, saveTimerOption, removeTimerOption } =
    useTimerContext();
  const { effectiveScheme: effectiveColorScheme } = useThemeMode();
  const { setColorScheme: setThemeColorScheme, colorScheme } = useThemeMode();
  const {
    vibrationsEnabled,
    setVibrationsEnabled,
    soundEnabled,
    setSoundEnabled,
    videoEnabled,
    setVideoEnabled,
    videoPreference,
    setVideoPreference,
    isVideoHorizontal,
    setIsVideoHorizontal,
    soundEffectEnabled,
    setSoundEffectEnabled,
    soundEffectPreference,
    setSoundEffectPreference,
    musicEnabled,
    setMusicEnabled,
    musicPreference,
    setMusicPreference,
  } = useUserPreferences();

  const [colorSchemeState, setColorSchemeState] = useState<
    "light" | "dark" | "default"
  >(colorScheme);

  const keyRef = useRef(0);
  const timerOptionsDialogRef = useRef<CustomDialogRef>(null);

  useEffect(() => {
    if (params?.key && params.key !== keyRef?.current?.toString()) {
      keyRef.current = Number(params?.key);
      if (timerOptionsDialogRef?.current) {
        setTimeout(() => {
          timerOptionsDialogRef.current?.toggle(true);
        }, 100);
      }
    }
  }, [params?.key]);

  const handleDeleteTimerOption = (option: TimerOption) => {
    console.log("Deleting option from SettingsContent:", option);
    removeTimerOption(option.key);
  };

  const handleSaveTimerOption = (option: TimerOption) => {
    console.log("Saving option from SettingsContent:", option);
    saveTimerOption(option);
  };

  const toggleTheme = () => {
    if (colorSchemeState === "light") {
      setColorSchemeState("dark");
      setThemeColorScheme("dark");
    } else if (colorSchemeState === "dark") {
      setColorSchemeState("default");
      setThemeColorScheme("default");
    } else {
      setColorSchemeState("light");
      setThemeColorScheme("light");
    }
  };

  const restoreDefaults = async () => {
    await clearAllData();
  };

  const themeText =
    colorSchemeState === "light"
      ? "Light"
      : colorSchemeState === "dark"
      ? "Dark"
      : "System Default";

  const ThemeIcon = () => {
    return colorSchemeState === "light" ? (
      <SunDim color={"orange"} size={20} />
    ) : colorSchemeState === "dark" ? (
      <Moon size={20} />
    ) : (
      <SunMoon size={20} />
    );
  };

  return (
    <View flex={1} bg={"$background"} justify={"center"}>
      <YStack alignItems="center" gap={"$5"} justify={"center"} mb={"$20"}>
        <CustomDialog
          ref={timerOptionsDialogRef}
          triggerHeader="Timer Options"
          headerFontSize={25}
          triggerProps={{
            fontSize: 20,
            width: "90%",
            ...(ShadowProps.medium as any),
            borderRadius: 10,
            height: 50,
            bg: "$cardBg",
          }}
          height={"90%"}
          width={"95%"}
          header="Timer Options"
          triggerIcon={<Clock size={25} />}
          headerIcon={<Clock size={25} />}
          buttons={[{ label: "Done", onPress() {}, bg: "$cardBg" }]}
          children={
            <TimerOptionsForm
              timerOptions={timerOptions}
              onDeleteOption={handleDeleteTimerOption}
              onSaveOption={handleSaveTimerOption}
            />
          }
        />
        <XStack
          justify={"space-around"}
          width={"90%"}
          height={50}
          alignItems="center"
          {...(ShadowProps.medium as any)}
          borderRadius={10}
          bg={"$cardBg"}
          onPress={toggleTheme}
          pressStyle={{
            scale: 0.95,
            opacity: 0.9,
          }}
        >
          <Text fontSize={20}>Color Scheme</Text>
          <XStack alignItems="center" gap={10}>
            <XStack gap={"$2"} alignItems="center">
              <Text
                color={
                  colorSchemeState === "light"
                    ? "orange"
                    : colorSchemeState === "dark"
                    ? "white"
                    : "gray"
                }
                fontSize={15}
                opacity={0.85}
              >
                {themeText}
              </Text>
              <ThemeIcon />
            </XStack>
          </XStack>
        </XStack>
        <XStack
          width={"90%"}
          height={50}
          gap={"$2"}
          justifyContent="space-between"
          alignItems="center"
          borderRadius={10}
        >
          <Button
            width={"47%"}
            height={50}
            fontSize={20}
            {...(ShadowProps.medium as any)}
            borderRadius={10}
            bg={"$cardBg"}
            padding={0}
            onPress={() => setVibrationsEnabled(!vibrationsEnabled)}
          >
            {vibrationsEnabled ? (
              <Vibrate size={20} style={{ marginRight: 10 }} />
            ) : (
              <VibrateOff size={20} style={{ marginRight: 10 }} />
            )}
            Vibrations
          </Button>
          <Button
            width={"47%"}
            height={50}
            fontSize={20}
            padding={0}
            {...(ShadowProps.medium as any)}
            borderRadius={10}
            bg={"$cardBg"}
            onPress={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? (
              <Volume2 size={20} style={{ marginRight: 10 }} />
            ) : (
              <VolumeOff size={20} style={{ marginRight: 10 }} />
            )}
            Sound
          </Button>
        </XStack>
        <CustomDialog
          ref={timerOptionsDialogRef}
          triggerHeader="Media Preferences"
          headerFontSize={25}
          triggerProps={{
            fontSize: 20,
            width: "90%",
            ...(ShadowProps.medium as any),
            borderRadius: 10,
            height: 50,
            bg: "$cardBg",
          }}
          height={"85%"}
          width={"95%"}
          header="Media Preferences"
          buttons={[{ label: "Done", onPress: () => {}, bg: "$cardBg" }]}
          children={
            <MediaPreferences
              videoEnabled={videoEnabled}
              setVideoEnabled={setVideoEnabled}
              videoPreference={videoPreference}
              setVideoPreference={setVideoPreference}
              soundEffectEnabled={soundEffectEnabled}
              setSoundEffectEnabled={setSoundEffectEnabled}
              soundEffectPreference={soundEffectPreference}
              setSoundEffectPreference={setSoundEffectPreference}
              musicEnabled={musicEnabled}
              setMusicEnabled={setMusicEnabled}
              musicPreference={musicPreference}
              setMusicPreference={setMusicPreference}
              colorScheme={effectiveColorScheme}
              isVideoHorizontal={isVideoHorizontal}
              setIsVideoHorizontal={setIsVideoHorizontal}
            />
          }
        />
        <XStack
          justify={"space-around"}
          width={"90%"}
          height={50}
          alignItems="center"
          {...(ShadowProps.medium as any)}
          borderRadius={10}
          bg={"$cardBg"}
          onPress={restoreDefaults}
          pressStyle={{
            scale: 0.95,
            opacity: 0.9,
          }}
        >
          <Text fontSize={20}>Restore All Defaults</Text>
        </XStack>
      </YStack>
    </View>
  );
};

export default SettingsContent;
