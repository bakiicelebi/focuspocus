import { AudioSource, useAudioPlayer } from "expo-audio";

export const usePlaySound = (
  type: "notification" | "alert" | undefined = "notification"
) => {
  let notificationSound: AudioSource;
  if (type === "notification") {
   notificationSound = require("../assets/sounds/notification_sound.mp3");
  } else if (type === "alert") {
    notificationSound = require("../assets/sounds/notification_sound.mp3");
  } else {
    notificationSound = require("../assets/sounds/notification_sound.mp3");
  }

  const player = useAudioPlayer(notificationSound);

  const play = () => {
    try {
      player.seekTo(0);
      player.play();
    } catch (e) {
      console.log("Error playing notification sound:", e);
    }
  };

  return { play };
};
