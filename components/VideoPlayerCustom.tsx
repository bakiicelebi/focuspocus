import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { View, Button, Stack, Text, useTheme, XStack } from "tamagui";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { useMediaContext } from "contexts/MediaContext";
import CircularTimer from "./CircularTimer";
import { useTimerContext } from "contexts/TimerContext";
import { formatTime } from "utils/TimeFormats";
import { Circle, Dot } from "@tamagui/lucide-icons";
import { Animated, Easing } from "react-native";

export interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
}

const VideoPlayerCustom = (props: any, ref: React.Ref<VideoPlayerRef>) => {
  const { videoSrc, isVideoVisible, playVideo, hideVideo } = useMediaContext();
  const [videoStarted, setVideoStarted] = useState(false);

  const theme = useTheme();
  const {
    timerCurrentSecond,
    mode,
    timeLeft,
    canVideoVisible,
    setCanVideoVisible,
  } = useTimerContext();

  const breathAnim = useRef(new Animated.Value(0)).current;

  const player = useVideoPlayer(videoSrc, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  useEffect(() => {
    if (!canVideoVisible && isVideoVisible) {
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

  useEffect(() => {
    if (videoStarted) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breathAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(500),
          Animated.timing(breathAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      breathAnim.stopAnimation(() => {
        breathAnim.setValue(0);
      });
    }
  }, [videoStarted]);

  const animatedOpacity = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

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

  return (
    <Stack onPress={() => hideVideo()} bg={"black"}>
      <VideoView
        style={{
          width: "100%",
          height: "100%",
          opacity: isVideoVisible ? 0.6 : 0,
          display: isVideoVisible ? "flex" : "none",
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
          top={50}
          right={40}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <XStack justifyContent="center" alignItems="center" gap={10}>
            <Text
              width={150}
              fontSize={40}
              ml={10}
              textAlign="center"
              fontWeight="bold"
              color="$color"
            >
              {formatTime(timerCurrentSecond)}
            </Text>
            <Animated.View style={{ opacity: animatedOpacity }}>
              <Circle
                size={30}
                color={currentConfig.endColor as any}
                fill={currentConfig.endColor}
              />
            </Animated.View>
          </XStack>
          {/* <CircularTimer
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
          /> */}
        </Stack>
      )}
    </Stack>
  );
};

export default forwardRef(VideoPlayerCustom);
