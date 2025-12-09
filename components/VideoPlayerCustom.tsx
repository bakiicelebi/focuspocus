import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { View, Button, Stack, Text, useTheme } from "tamagui";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import { useMediaContext } from "contexts/MediaContext";
import CircularTimer from "./CircularTimer";
import { useTimerContext } from "contexts/TimerContext";

export interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
}

const VideoPlayerCustom = (props: any, ref: React.Ref<VideoPlayerRef>) => {
  const { videoSrc, isVisible, playVideo, hideVideo } = useMediaContext();
  const [videoStarted, setVideoStarted] = useState(false);

  const theme = useTheme();
  const {
    timerCurrentSecond,
    mode,
    timeLeft,
    canVideoVisible,
    setCanVideoVisible,
  } = useTimerContext();


  const player = useVideoPlayer(videoSrc, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  useEffect(() => {
    if (!canVideoVisible && isVisible) {
      setCanVideoVisible(true);
      hideVideo();
    }
  }, [canVideoVisible]);

  useImperativeHandle(ref, () => ({
    play: () => {
      player.play();
    },
    pause: () => {
      player.pause();
      setVideoStarted(false);
    },
  }));

  const currentConfig = {
    startColor:
      theme[`timerOnVideo${mode === "work" ? "Work" : "Break"}StartColor`].val,
    endColor:
      theme[`timerOnVideo${mode === "work" ? "Work" : "Break"}EndColor`].val,
    activeColor:
      theme[`timerOnVideo${mode === "work" ? "Work" : "Break"}ActiveColor`].val,
    inactiveColor:
      theme[`timer${mode === "work" ? "Work" : "Break"}InactiveColor`].val,
    thumbColor:
      theme[`timerOnVideo${mode === "work" ? "Work" : "Break"}ThumbColor`].val,
    sliderTrackColor:
      theme[`timerOnVideo${mode === "work" ? "Work" : "Break"}SliderTrackColor`]
        .val,
  };

  console.log(timerCurrentSecond);

  return (
    <Stack onPress={() => hideVideo()} bg={"black"}>
      <VideoView
        style={{
          width: "100%",
          height: "100%",
          opacity: isVisible ? 0.6 : 0,
          display: isVisible ? "flex" : "none",
        }}
        player={player}
        contentFit="cover"
        fullscreenOptions={{ enable: true, autoExitOnRotate: true }}
        allowsPictureInPicture={false}
        nativeControls={false}
        onFirstFrameRender={() => setVideoStarted(true)}
      />
      {videoStarted && (
        <Stack
          enterStyle={{ opacity: -20 }}
          animateOnly={["opacity"]}
          animation={"lazy"}
          position="absolute"
          zIndex={999}
          top={45}
          right={0}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <CircularTimer
            size={200}
            startColor={currentConfig.startColor}
            endColor={currentConfig.endColor}
            activeColor={currentConfig.activeColor}
            inactiveColor={currentConfig.inactiveColor}
            thumbColor={currentConfig.thumbColor}
            maxSeconds={timeLeft}
            backgroundColor={"transparent"}
            sliderTrackColor={currentConfig.sliderTrackColor}
            outline={false}
            isButtonHidden={true}
            isCenterTextHidden={true}
            disabledChange={true}
            workWithContext={true}
            initialSeconds={timerCurrentSecond}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default forwardRef(VideoPlayerCustom);
