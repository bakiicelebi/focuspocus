import React, { createContext, useContext, useRef, useState } from "react";
import { VideoSource } from "expo-video";
import { VideoPlayerRef } from "components/VideoPlayerCustom";
import { AudioSource } from "expo-audio";
import { usePlaySound } from "hooks/usePlaySound";
import {
  FIREPLACE_SOUNDEFFECT_SRC,
  HORIZONTAL_FIREPLACE_VIDEO_SRC,
  NOTIFICATION_SOUNDEFFECT_SRC,
  useUserPreferences,
  VERTICAL_FIREPLACE_VIDEO_SRC,
} from "./UserPreferencesContext";

type MediaContextType = {
  videoSrc: VideoSource | null;
  isVideoVisible: boolean;
  isMediaPlaying: boolean;
  setIsMediaPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  playVideo: () => void;
  playMedia: () => void;
  stopMedia: () => void;
  videoRef?: React.Ref<VideoPlayerRef>;
};

const MediaContext = createContext<MediaContextType | null>(null);

export const MediaProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    videoPreference,
    videoEnabled,
    musicPreference,
    musicEnabled,
    soundEffectEnabled,
    soundEffectPreference,
    isVideoHorizontal,
  } = useUserPreferences();

  const [videoSrc, setVideoSrc] = useState<VideoSource | null>(
    require("assets/videos/fireplace_vertical.mp4")
  );
  const [isVideoVisible, setVideoIsVisible] = useState(false);
  const [isMediaPlaying, setIsMediaPlaying] = useState(false);

  // --- SOUND EFFECT PLAYER ---
  const {
    play: playEffect,
    stop: stopEffect,
    setSrc: setEffectSrc,
  } = usePlaySound({
    src: NOTIFICATION_SOUNDEFFECT_SRC,
    loop: false,
    volume: musicEnabled ? 0.4 : 1,
  });

  // --- MUSIC PLAYER ---
  const {
    play: playMusicPlayer,
    stop: stopMusic,
    setSrc: setMusicSrc,
  } = usePlaySound({
    src: FIREPLACE_SOUNDEFFECT_SRC,
    loop: true,
  });

  const videoRef = useRef<VideoPlayerRef>(null);

  const playVideo = () => {
    setVideoSrc(
      isVideoHorizontal
        ? HORIZONTAL_FIREPLACE_VIDEO_SRC
        : videoPreference?.source
        ? videoPreference?.source
        : VERTICAL_FIREPLACE_VIDEO_SRC
    );
    setVideoIsVisible(true);
    if (videoRef?.current) {
      videoRef.current.play();
      setIsMediaPlaying(true);
    }
  };

  const stopMedia = () => {
    setVideoIsVisible(false);
    setIsMediaPlaying(false);
    setVideoSrc(null);
    if (videoRef?.current) {
      videoRef.current.pause();
    }
    stopMusic();
    stopEffect();
  };

  const playSoundEffect = () => {
    setEffectSrc(
      soundEffectPreference?.source
        ? soundEffectPreference.source
        : FIREPLACE_SOUNDEFFECT_SRC
    );
    playEffect();
    setIsMediaPlaying(true);
  };

  const playMusic = () => {
    setMusicSrc(
      musicPreference?.source
        ? musicPreference.source
        : FIREPLACE_SOUNDEFFECT_SRC
    );
    playMusicPlayer();
    setIsMediaPlaying(true);
  };

  const playMedia = () => {
    if (isMediaPlaying) {
      return;
    }

    if (videoEnabled) {
      console.log("Playing video...");
      playVideo();
    }
    setTimeout(() => {
      if (soundEffectEnabled) {
        console.log("Playing sound effect...");
        playSoundEffect();
      }
      if (musicEnabled) {
        setTimeout(() => {
          console.log("Playing music...");
          playMusic();
        }, 500);
      }
    }, 1000);
  };

  return (
    <MediaContext.Provider
      value={{
        isMediaPlaying,
        setIsMediaPlaying,
        videoSrc,
        isVideoVisible,
        playVideo,
        playMedia,
        stopMedia,
        videoRef,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export const useMediaContext = () => {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error("useMedia must be inside MediaProvider");
  return ctx;
};
