import React, { createContext, useContext, useEffect, useState } from "react";

import { clearAllData, getData, saveData } from "utils/AsyncStorageUtils";
import { BackgroundBehavior } from "./TimerContext";

export const VERTICAL_FIREPLACE_VIDEO_SRC = require("assets/videos/fireplace_vertical.mp4");
export const HORIZONTAL_FIREPLACE_VIDEO_SRC = require("assets/videos/fireplace_horizontal.mp4");
export const VERTICAL_RAIN_VIDEO_SRC = require("assets/videos/rain_vertical.mp4");

export const NOTIFICATION_SOUNDEFFECT_SRC = require("assets/sounds/notification_sound.mp3");
export const FIREPLACE_SOUNDEFFECT_SRC = require("assets/sounds/fireplace_sound.mp3");
export const RAIN_SOUNDEFFECT_SRC = require("assets/sounds/rain_sound.mp3");

export const LOFI_MUSIC1_SRC = require("assets/musics/lofi_1.mp3");
export const LOFI_MUSIC2_SRC = require("assets/musics/lofi_2.mp3");
export const JAZZ_AMBIENT_1 = require("assets/musics/jazz_1.mp3");
export const JAZZ_AMBIENT_2 = require("assets/musics/jazz_2.mp3");

export interface VideoPreference {
  key: string;
  label: string;
  source: any;
  isLocal: boolean;
}

export interface SoundEffectPreference {
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
  backgroundBehavior: BackgroundBehavior;
  setBackgroundBehavior: (behavior: BackgroundBehavior) => void;
  vibrationsEnabled: boolean;
  setVibrationsEnabled: (enabled: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  videoEnabled: boolean;
  setVideoEnabled: (enabled: boolean) => void;
  isVideoHorizontal: boolean;
  setIsVideoHorizontal: (isHorizontal: boolean) => void;
  videoPreference: VideoPreference;
  setVideoPreference: (preference: VideoPreference) => void;
  soundEffectEnabled: boolean;
  setSoundEffectEnabled: (enabled: boolean) => void;
  soundEffectPreference: SoundEffectPreference;
  setSoundEffectPreference: (preference: SoundEffectPreference) => void;
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  musicPreference: MusicPreference;
  setMusicPreference: (preference: MusicPreference) => void;
};

const UserPreferencesContext = createContext<
  UserPreferencesContextValue | undefined
>(undefined);

const BACKGROUND_BEHAVIOR_KEY = "backgroundBehavior";
const VIBRATIONS_KEY = "vibrationsEnabled";
const SOUND_KEY = "soundEnabled";
const VIDEO_PREFERENCE_KEY = "videoPreference";
const SOUND_EFFECT_PREFERENCE_KEY = "soundEffectPreference";
const MUSIC_PREFERENCE_KEY = "musicPreference";
const VIDEO_ENABLED_KEY = "videoEnabled";
const VIDEO_IS_HORIZONTAL_KEY = "videoIsHorizontal";
const SOUND_EFFECT_ENABLED_KEY = "soundEffectEnabled";
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

export const soundEffects: SoundEffectPreference[] = [
  {
    key: "soundEffect1",
    label: "Fireplace Sounds",
    source: FIREPLACE_SOUNDEFFECT_SRC,
    isLocal: true,
  },

  {
    key: "soundEffect2",
    label: "Rain Sounds",
    source: RAIN_SOUNDEFFECT_SRC,
    isLocal: true,
  },
];

export const musics: MusicPreference[] = [
  {
    key: "music1",
    label: "LO-FI Music 1",
    source: LOFI_MUSIC1_SRC,
    isLocal: true,
  },
  {
    key: "music2",
    label: "LO-FI Music 2",
    source: LOFI_MUSIC2_SRC,
    isLocal: true,
  },
  {
    key: "music3",
    label: "Jazz Ambient 1",
    source: JAZZ_AMBIENT_1,
    isLocal: true,
  },
  {
    key: "music4",
    label: "Jazz Ambient 2",
    source: JAZZ_AMBIENT_2,
    isLocal: true,
  },
];

export const UserPreferencesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [backgroundBehavior, setBackgroundBehavior] =
    useState<BackgroundBehavior>("PAUSE");
  const [vibrationsEnabled, setVibrationsEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [videoPreference, setVideoPreference] = useState<VideoPreference>(
    videos[0]
  );
  const [soundEffectPreference, setSoundEffectPreference] =
    useState<SoundEffectPreference>(soundEffects[0]);
  const [musicPreference, setMusicPreference] = useState<MusicPreference>(
    musics[0]
  );

  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [isVideoHorizontal, setIsVideoHorizontal] = useState<boolean>(false);
  const [soundEffectEnabled, setSoundEffectEnabled] = useState<boolean>(true);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(true);

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const setBackgroundBehaviorWrapper = (behavior: BackgroundBehavior) => {
    setBackgroundBehavior(behavior);
    saveData(BACKGROUND_BEHAVIOR_KEY, behavior);
    console.log("Saved Background Behavior Preference:", behavior);
  };

  const setVibrationsEnabledWrapper = (enabled: boolean) => {
    setVibrationsEnabled(enabled);
    saveData(VIBRATIONS_KEY, enabled?.toString());
    console.log("Saved Vibrations Enabled Preference:", enabled);
  };

  const setSoundEnabledWrapper = (enabled: boolean) => {
    setSoundEnabled(enabled);
    saveData(SOUND_KEY, enabled?.toString());
    console.log("Saved Sound Enabled Preference:", enabled);
  };

  const setVideoPreferenceWrapper = (preference: VideoPreference) => {
    setVideoPreference(preference);
    saveData(VIDEO_PREFERENCE_KEY, JSON.stringify(preference));
    console.log("Saved Video Preference:", preference);
  };

  const setMusicPreferenceWrapper = (preference: MusicPreference) => {
    setMusicPreference(preference);
    saveData(MUSIC_PREFERENCE_KEY, JSON.stringify(preference));
    console.log("Saved Music Preference:", preference);
  };

  const setMusicEnabledWrapper = (enabled: boolean) => {
    setMusicEnabled(enabled);
    saveData(MUSIC_ENABLED_KEY, enabled?.toString());
    console.log("Saved Music Enabled Preference:", enabled);
  };

  const setSoundEffectEnabledWrapper = (enabled: boolean) => {
    setSoundEffectEnabled(enabled);
    saveData(SOUND_EFFECT_ENABLED_KEY, enabled?.toString());
    console.log("Saved Sound Effect Enabled Preference:", enabled);
  };

  const setSoundEffectPreferenceWrapper = (
    preference: SoundEffectPreference
  ) => {
    setSoundEffectPreference(preference);
    saveData(SOUND_EFFECT_PREFERENCE_KEY, JSON.stringify(preference));
    console.log("Saved Sound Effect Preference:", preference);
  };

  const setVideoEnabledWrapper = (enabled: boolean) => {
    setVideoEnabled(enabled);
    saveData(VIDEO_ENABLED_KEY, enabled?.toString());
    console.log("Saved Video Enabled Preference:", enabled);
  };

  const setIsVideoHorizontalWrapper = (isHorizontal: boolean) => {
    setIsVideoHorizontal(isHorizontal);
    saveData(VIDEO_IS_HORIZONTAL_KEY, isHorizontal?.toString());
    console.log("Saved Video Is Horizontal Preference:", isHorizontal);
  };

  const loadUserPreferences = async () => {
    // clearAllData();

    const savedBackgroundBehavior = await getData(BACKGROUND_BEHAVIOR_KEY);
    const savedVibrations = await getData(VIBRATIONS_KEY);
    const savedSound = await getData(SOUND_KEY);
    const savedVideoPreference = await getData(VIDEO_PREFERENCE_KEY);
    const savedSoundEffectPreference = await getData(
      SOUND_EFFECT_PREFERENCE_KEY
    );
    const savedMusicPreference = await getData(MUSIC_PREFERENCE_KEY);
    const savedVideoEnabled = await getData(VIDEO_ENABLED_KEY);
    const savedVideoIsHorizontal = await getData(VIDEO_IS_HORIZONTAL_KEY);
    const savedSoundEffectEnabled = await getData(SOUND_EFFECT_ENABLED_KEY);
    const savedMusicEnabled = await getData(MUSIC_ENABLED_KEY);

    console.log("Loaded User Preferences:", {
      savedBackgroundBehavior,
      savedVibrations,
      savedSound,
      savedVideoPreference,
      savedMusicPreference,
      savedVideoEnabled,
      savedVideoIsHorizontal,
      savedSoundEffectEnabled,
      savedMusicEnabled,
    });

    if (savedBackgroundBehavior) {
      setBackgroundBehavior(savedBackgroundBehavior as BackgroundBehavior);
    }

    if (savedVideoEnabled !== null) {
      if (savedVideoEnabled === "true") {
        setVideoEnabled(true);
      } else if (savedVideoEnabled === "false") {
        setVideoEnabled(false);
      }
    }

    if (savedVideoIsHorizontal !== null) {
      if (savedVideoIsHorizontal === "true") {
        setIsVideoHorizontal(true);
      } else if (savedVideoIsHorizontal === "false") {
        setIsVideoHorizontal(false);
      }
    }

    if (savedSoundEffectEnabled !== null) {
      if (savedSoundEffectEnabled === "true") {
        setSoundEffectEnabled(true);
      } else if (savedSoundEffectEnabled === "false") {
        setSoundEffectEnabled(false);
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

    if (savedSoundEffectPreference) {
      const parsedSoundEffectPref: SoundEffectPreference = JSON.parse(
        savedSoundEffectPreference
      );
      setSoundEffectPreference(parsedSoundEffectPref);
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
        backgroundBehavior,
        setBackgroundBehavior: setBackgroundBehaviorWrapper,
        vibrationsEnabled,
        setVibrationsEnabled: setVibrationsEnabledWrapper,
        soundEnabled,
        setSoundEnabled: setSoundEnabledWrapper,
        videoEnabled,
        setVideoEnabled: setVideoEnabledWrapper,
        videoPreference,
        setVideoPreference: setVideoPreferenceWrapper,
        soundEffectEnabled,
        setSoundEffectEnabled: setSoundEffectEnabledWrapper,
        soundEffectPreference,
        setSoundEffectPreference: setSoundEffectPreferenceWrapper,
        musicEnabled,
        setMusicEnabled: setMusicEnabledWrapper,
        musicPreference,
        setMusicPreference: setMusicPreferenceWrapper,
        isVideoHorizontal,
        setIsVideoHorizontal: setIsVideoHorizontalWrapper,
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
