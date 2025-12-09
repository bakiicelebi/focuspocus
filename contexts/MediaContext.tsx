import React, { createContext, useContext, useRef, useState } from "react";
import { VideoSource } from "expo-video";
import { VideoPlayerRef } from "components/VideoPlayerCustom";
import { AudioSource } from "expo-audio";
import { usePlaySound } from "hooks/usePlaySound";
import { FIREPLACE_SOUND_SRC, NOTIFICATION_SOUND_SRC, useUserPreferences, VERTICAL_FIREPLACE_VIDEO_SRC } from "./UserPreferencesContext";

type MediaContextType = {
  videoSrc: VideoSource | null;
  isVisible: boolean;
  playVideo: () => void;
  hideVideo: () => void;
  videoRef?: React.Ref<VideoPlayerRef>;
};

const MediaContext = createContext<MediaContextType | null>(null);

export const MediaProvider = ({ children }: { children: React.ReactNode }) => {
  const { videoPreference, musicPreference, musicEnabled } =
    useUserPreferences();

  const [videoSrc, setVideoSrc] = useState<VideoSource | null>(
    require("assets/videos/fireplace_vertical.mp4")
  );
  const [isVisible, setIsVisible] = useState(false);
  const {
    play,
    pause,
    stop: stopSound,
    player,
    status,
    setSrc,
  } = usePlaySound({
    src: NOTIFICATION_SOUND_SRC,
  });

  console.log(videoPreference);

  const videoRef = useRef<VideoPlayerRef>(null);

  const playVideo = () => {
    setVideoSrc(
      videoPreference?.source
        ? videoPreference?.source
        : VERTICAL_FIREPLACE_VIDEO_SRC
    );
    setIsVisible(true);
    if (videoRef?.current) {
      videoRef.current.play();
    }
    setTimeout(() => {
      if (musicEnabled) {
        playMusic();
      }
    }, 1000);
  };

  const hideVideo = () => {
    setIsVisible(false);
    setVideoSrc(null);
    if (videoRef?.current) {
      videoRef.current.pause();
    }
    stopSound();
  };

  const playMusic = () => {
    setSrc(
      musicPreference?.source ? musicPreference.source : FIREPLACE_SOUND_SRC
    );
    play();
  };

  return (
    <MediaContext.Provider
      value={{ videoSrc, isVisible, playVideo, hideVideo, videoRef }}
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
