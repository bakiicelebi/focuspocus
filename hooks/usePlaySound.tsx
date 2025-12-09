import { AudioSource, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect, useState } from "react";

type CreatePlayerOptions = {
  src: AudioSource;
  loop?: boolean;
  mute?: boolean;
  playbackRate?: number;
};

export const usePlaySound = ({
  src,
  loop = false,
  mute = false,
}: CreatePlayerOptions) => {
  const [inlineSrc, setInlineSrc] = useState<AudioSource | null>(src);
  const player = useAudioPlayer(inlineSrc);

  // Configure player
  player.loop = loop;
  player.muted = mute;

  // Subscribe to live playback status
  const status = useAudioPlayerStatus(player);

  const play = () => {
    try {
      player.seekTo(0);
      player.play();
    } catch (e) {
      console.log("Error play:", e);
    }
  };

  const pause = () => {
    try {
      player.pause();
    } catch (e) {
      console.log("Error pause:", e);
    }
  };

  const stop = () => {
    try {
      player.pause();
      player.seekTo(0);
    } catch (e) {
      console.log("Error stop:", e);
    }
  };

  return {
    play,
    pause,
    stop,
    player,
    status,
    setSrc: setInlineSrc,
  };
};
