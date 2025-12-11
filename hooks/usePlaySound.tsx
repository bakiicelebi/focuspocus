import { AudioSource, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect, useState } from "react";

type CreatePlayerOptions = {
  src: AudioSource;
  loop?: boolean;
  mute?: boolean;
  playbackRate?: number;
  volume?: number;
};

export const usePlaySound = ({
  src,
  loop = false,
  mute = false,
  volume = 1,
}: CreatePlayerOptions) => {
  const [inlineSrc, setInlineSrc] = useState<AudioSource | null>(src);
  const player = useAudioPlayer(inlineSrc);

  const inlineVolume =
    volume < 0 ? 0 : volume > 1 ? 1 : Number(volume) !== undefined ? volume : 1;

  // Configure player
  player.loop = loop;
  player.muted = mute;
  player.volume = mute ? 0 : inlineVolume ? inlineVolume : 1;

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
