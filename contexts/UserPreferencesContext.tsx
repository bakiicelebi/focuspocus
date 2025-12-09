import React, { createContext, useContext, useEffect, useState } from "react";

import { clearAllData, getData, saveData } from "utils/AsyncStorageUtils";

export const VERTICAL_FIREPLACE_VIDEO_SRC = require("assets/videos/fireplace_vertical.mp4");
export const HORIZONTAL_FIREPLACE_VIDEO_SRC = require("assets/videos/fireplace_horizontal.mp4");
export const VERTICAL_RAIN_VIDEO_SRC = require("assets/videos/rain_vertical.mp4");

export const NOTIFICATION_SOUND_SRC = require("assets/sounds/notification_sound.mp3");
export const FIREPLACE_SOUND_SRC = require("assets/sounds/fireplace_sound.mp3");
export const RAIN_SOUND_SRC = require("assets/sounds/rain_sound.mp3");

export interface VideoPreference {
  key: string;
  label: string;
  source: any;
  isLocal: boolean;
}

export interface MusicPreference {
  key: string;
  label: string;
  source: any;
  isLocal: boolean;
}

type UserPreferencesContextValue = {
  vibrationsEnabled: boolean;
  setVibrationsEnabled: (enabled: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  videoEnabled: boolean;
  setVideoEnabled: (enabled: boolean) => void;
  videoPreference: VideoPreference;
  setVideoPreference: (preference: VideoPreference) => void;
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  musicPreference: MusicPreference;
  setMusicPreference: (preference: MusicPreference) => void;
};

const UserPreferencesContext = createContext<
  UserPreferencesContextValue | undefined
>(undefined);

const VIBRATIONS_KEY = "vibrationsEnabled";
const SOUND_KEY = "soundEnabled";
const VIDEO_PREFERENCE_KEY = "videoPreference";
const MUSIC_PREFERENCE_KEY = "musicPreference";
const VIDEO_ENABLED_KEY = "videoEnabled";
const MUSIC_ENABLED_KEY = "musicEnabled";

export const videos: VideoPreference[] = [
  {
    key: "video1",
    label: "Fireplace Ambience",
    source: VERTICAL_FIREPLACE_VIDEO_SRC,
    isLocal: true,
  },
  {
    key: "video2",
    label: "Rain Ambience",
    source: VERTICAL_RAIN_VIDEO_SRC,
    isLocal: true,
  },
];
export const musics: MusicPreference[] = [
  {
    key: "music1",
    label: "Fireplace Sounds",
    source: FIREPLACE_SOUND_SRC,
    isLocal: true,
  },
  {
    key: "music2",
    label: "Rain Sounds",
    source: RAIN_SOUND_SRC,
    isLocal: true,
  },
];

export const UserPreferencesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [vibrationsEnabled, setVibrationsEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [videoPreference, setVideoPreference] = useState<VideoPreference>(
    videos[0]
  );
  const [musicPreference, setMusicPreference] = useState<MusicPreference>(
    musics[0]
  );
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(true);

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const setVibrationsEnabledWrapper = (enabled: boolean) => {
    setVibrationsEnabled(enabled);
    saveData(VIBRATIONS_KEY, enabled?.toString());
  };

  const setSoundEnabledWrapper = (enabled: boolean) => {
    setSoundEnabled(enabled);
    saveData(SOUND_KEY, enabled?.toString());
  };

  const setVideoPreferenceWrapper = (preference: VideoPreference) => {
    setVideoPreference(preference);
    saveData(VIDEO_PREFERENCE_KEY, JSON.stringify(preference));
  };

  const setMusicPreferenceWrapper = (preference: MusicPreference) => {
    setMusicPreference(preference);
    saveData(MUSIC_PREFERENCE_KEY, JSON.stringify(preference));
  };

  const setMusicEnabledWrapper = (enabled: boolean) => {
    setMusicEnabled(enabled);
    saveData(MUSIC_ENABLED_KEY, enabled?.toString());
  };

  const setVideoEnabledWrapper = (enabled: boolean) => {
    setVideoEnabled(enabled);
    saveData(VIDEO_ENABLED_KEY, enabled?.toString());
  };

  const loadUserPreferences = async () => {
    clearAllData();

    const savedVibrations = await getData(VIBRATIONS_KEY);
    const savedSound = await getData(SOUND_KEY);
    const savedVideoPreference = await getData(VIDEO_PREFERENCE_KEY);
    const savedMusicPreference = await getData(MUSIC_PREFERENCE_KEY);
    const savedVideoEnabled = await getData(VIDEO_ENABLED_KEY);
    const savedMusicEnabled = await getData(MUSIC_ENABLED_KEY);

    console.log("Loaded User Preferences:", {
      savedVibrations,
      savedSound,
      savedVideoPreference,
      savedMusicPreference,
      savedVideoEnabled,
      savedMusicEnabled,
    });

    if (savedVideoEnabled !== null) {
      if (savedVideoEnabled === "true") {
        setVideoEnabled(true);
      } else if (savedVideoEnabled === "false") {
        setVideoEnabled(false);
      }
    }

    if (savedMusicEnabled !== null) {
      if (savedMusicEnabled === "true") {
        setMusicEnabled(true);
      } else if (savedMusicEnabled === "false") {
        setMusicEnabled(false);
      }
    }

    if (savedVideoPreference) {
      const parsedVideoPref: VideoPreference = JSON.parse(savedVideoPreference);
      setVideoPreference(parsedVideoPref);
    }

    if (savedMusicPreference) {
      const parsedMusicPref: MusicPreference = JSON.parse(savedMusicPreference);
      setMusicPreference(parsedMusicPref);
    }

    if (savedVibrations !== null) {
      if (savedVibrations === "true") {
        setVibrationsEnabled(true);
      } else if (savedVibrations === "false") {
        setVibrationsEnabled(false);
      }
    }

    if (savedSound !== null) {
      if (savedSound === "true") {
        setSoundEnabled(true);
      } else if (savedSound === "false") {
        setSoundEnabled(false);
      }
    }
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        vibrationsEnabled,
        setVibrationsEnabled: setVibrationsEnabledWrapper,
        soundEnabled,
        setSoundEnabled: setSoundEnabledWrapper,
        videoEnabled,
        setVideoEnabled: setVideoEnabledWrapper,
        videoPreference,
        setVideoPreference: setVideoPreferenceWrapper,
        musicEnabled,
        setMusicEnabled: setMusicEnabledWrapper,
        musicPreference,
        setMusicPreference: setMusicPreferenceWrapper,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error(
      "useUserPreferences must be used within a UserPreferencesContextProvider"
    );
  }
  return context;
};
