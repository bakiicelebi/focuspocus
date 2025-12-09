import { View, Text, YStack, Separator, XStack, Switch } from "tamagui";
import React, { useState } from "react";
import CustomDropDown from "./Menus/CustomDropDown";
import CustomSwitch from "./CustomSwitch";
import {
  MusicPreference,
  musics,
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
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  musicPreference: MusicPreference;
  setMusicPreference: (preference: MusicPreference) => void;
}) => {
  return (
    <YStack pt={"$5"} flex={1}>
      <Text fontSize={20} fontWeight="bold" mb={"$3"}>
        Video Preferences
      </Text>
      <Separator mb={"$3"} />
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
      <CustomDropDown
        width={"90%"}
        height={50}
        items={videos}
        selectedItem={videoPreference}
        onSelect={setVideoPreference}
        colorScheme={colorScheme}
      />
      <Text mt={"$10"} fontSize={20} fontWeight="bold" mb={"$3"}>
        Music Preferences
      </Text>
      <Separator mb={"$3"} />
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
      />
    </YStack>
  );
};

export default MediaPreferences;
