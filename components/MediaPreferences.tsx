import {
  View,
  Text,
  YStack,
  Separator,
  XStack,
  Switch,
  RadioGroup,
  Label,
  Stack,
} from "tamagui";
import React, { useState } from "react";
import CustomDropDown from "./Menus/CustomDropDown";
import CustomSwitch from "./CustomSwitch";
import {
  MusicPreference,
  musics,
  SoundEffectPreference,
  soundEffects,
  useUserPreferences,
  VideoPreference,
  videos,
} from "contexts/UserPreferencesContext";

const MediaPreferences = ({
  colorScheme,
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
}: {
  colorScheme?: "light" | "dark";
  videoEnabled: boolean;
  setVideoEnabled: (enabled: boolean) => void;
  videoPreference: VideoPreference;
  setVideoPreference: (preference: VideoPreference) => void;
  isVideoHorizontal: boolean;
  setIsVideoHorizontal: (isHorizontal: boolean) => void;
  soundEffectEnabled: boolean;
  setSoundEffectEnabled: (enabled: boolean) => void;
  soundEffectPreference: SoundEffectPreference;
  setSoundEffectPreference: (preference: SoundEffectPreference) => void;
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  musicPreference: MusicPreference;
  setMusicPreference: (preference: MusicPreference) => void;
}) => {
  return (
    <YStack pt={"$5"} flex={1}>
      <Text fontSize={20} fontWeight="bold" mb={"$2"}>
        Video Preferences
      </Text>
      <Separator mb={"$2"} />
      <XStack
        justify={"space-between"}
        alignItems="center"
        my={"$3"}
        mx={"$2"}
        gap={"$2"}
      >
        <Text fontSize={16} fontWeight="500">
          Video Enabled
        </Text>
        <CustomSwitch state={videoEnabled} setState={setVideoEnabled} />
      </XStack>
      <XStack
        justify={"space-between"}
        alignItems="center"
        my={"$1"}
        mb={"$3"}
        mx={"$2"}
        gap={"$2"}
      >
        <RadioGroup
          value={isVideoHorizontal ? "horizontal" : "vertical"}
          gap="$10"
          flexDirection="row"
          alignItems="center"
          justify={"center"}
          width={"100%"}
          flex={1}
        >
          <Stack flexDirection="row" alignItems="center" gap={"$2"}>
            <Label fontSize={16}>Horizontal Video</Label>
            <RadioGroup.Item
              onPress={() => setIsVideoHorizontal(true)}
              value="horizontal"
              id="horizontal-radio-item"
            >
              <RadioGroup.Indicator />
            </RadioGroup.Item>
          </Stack>

          <Stack flexDirection="row" alignItems="center" gap={"$2"}>
            <Label fontSize={16}>Vertical Video</Label>
            <RadioGroup.Item
              onPress={() => setIsVideoHorizontal(false)}
              value="vertical"
              id="vertical-radio-item"
            >
              <RadioGroup.Indicator />
            </RadioGroup.Item>
          </Stack>
        </RadioGroup>
      </XStack>
      <CustomDropDown
        width={"90%"}
        height={50}
        items={videos}
        selectedItem={videoPreference}
        onSelect={setVideoPreference}
        colorScheme={colorScheme}
      />

      {/* Sound Effect Preferences */}

      <Text mt={"$6"} fontSize={20} fontWeight="bold" mb={"$2"}>
        Sound Effect Preferences
      </Text>
      <Separator mb={"$2"} />
      <XStack
        justify={"space-between"}
        alignItems="center"
        my={"$3"}
        mx={"$2"}
        gap={"$2"}
      >
        <Text fontSize={16} fontWeight="500">
          Sound Effect Enabled
        </Text>
        <CustomSwitch
          state={soundEffectEnabled}
          setState={setSoundEffectEnabled}
        />
      </XStack>
      <CustomDropDown
        width={"90%"}
        height={50}
        items={soundEffects}
        selectedItem={soundEffectPreference}
        onSelect={setSoundEffectPreference}
        colorScheme={colorScheme}
      />

      {/** Music Preferences */}

      <Text mt={"$6"} fontSize={20} fontWeight="bold" mb={"$2"}>
        Music Preferences
      </Text>
      <Separator mb={"$2"} />
      <XStack
        justify={"space-between"}
        alignItems="center"
        my={"$3"}
        mx={"$2"}
        gap={"$2"}
      >
        <Text fontSize={16} fontWeight="500">
          Music Enabled
        </Text>
        <CustomSwitch state={musicEnabled} setState={setMusicEnabled} />
      </XStack>
      <CustomDropDown
        width={"90%"}
        height={50}
        items={musics}
        selectedItem={musicPreference}
        onSelect={setMusicPreference}
        colorScheme={colorScheme}
        maxVisibleItemCount={3}
      />
    </YStack>
  );
};

export default MediaPreferences;
