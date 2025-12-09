import React, { createContext, useContext, useRef, useState } from "react";
import { VideoSource } from "expo-video";
import { VideoPlayerRef } from "components/VideoPlayerCustom";
import { AudioSource } from "expo-audio";
import { usePlaySound } from "hooks/usePlaySound";

type MediaContextType = {
  videoSrc: VideoSource | null;
  isVisible: boolean;
  playVideo: (src: VideoSource) => void;
  hideVideo: () => void;
  videoRef?: React.Ref<VideoPlayerRef>;
};

const MediaContext = createContext<MediaContextType | null>(null);

export const VERTICAL_FIREPLACE_VIDEO_SRC = require("assets/videos/fireplace_vertical.mp4");
export const HORIZONTAL_FIREPLACE_VIDEO_SRC = require("assets/videos/fireplace_horizontal.mp4");

export const NOTIFICATION_SOUND_SRC = require("assets/sounds/notification_sound.mp3");
export const FIREPLACE_SOUND_SRC = require("assets/sounds/fireplace_sound.mp3");

export const MediaProvider = ({ children }: { children: React.ReactNode }) => {
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

  const videoRef = useRef<VideoPlayerRef>(null);

  const playVideo = (src: VideoSource) => {
    setVideoSrc(src);
    setIsVisible(true);
    if (videoRef?.current) {
      videoRef.current.play();
    }
    setTimeout(() => {
      playSound(FIREPLACE_SOUND_SRC);
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

  const playSound = (src: AudioSource) => {
    setSrc(src);
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
