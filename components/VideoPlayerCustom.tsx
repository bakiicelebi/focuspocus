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

import { useWindowDimensions, Animated, Easing } from "react-native";

import { useMediaContext } from "contexts/MediaContext";
import CircularTimer from "./CircularTimer";
import { useTimerContext } from "contexts/TimerContext";
import { formatTime } from "utils/TimeFormats";
import { Circle, Dot } from "@tamagui/lucide-icons";
import { useUserPreferences } from "contexts/UserPreferencesContext";

export interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
}

const VideoPlayerCustom = (props: any, ref: React.Ref<VideoPlayerRef>) => {
  const { videoSrc, isVideoVisible, stopMedia } = useMediaContext();
  const { isVideoHorizontal } = useUserPreferences();

  // 2. EKRAN BOYUTLARINI AL
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [videoStarted, setVideoStarted] = useState(false);

  const theme = useTheme();
  const {
    timerCurrentSecond,
    mode,
    timeLeft,
    stopMedia: stopMediaContext,
    setStopMedia: setStopMediaContext,
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
    if (!stopMediaContext && isVideoVisible) {
      setStopMediaContext(true);
      stopMedia();
    }
  }, [stopMediaContext]);

  useImperativeHandle(ref, () => ({
    play: () => {
      player.play();
    },
    pause: () => {
      player.pause();
      setVideoStarted(false);
    },
  }));

  // ... Animation useEffect kodların aynı kalsın ...
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

  // ... Renk konfigürasyonun aynı kalsın ...
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
    <Stack
      onPress={() => {
        stopMedia();
      }}
      bg={"black"}
      {...(isVideoHorizontal
        ? {
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 9999,
            width: windowHeight,
            height: windowWidth,
            rotate: "90deg",
            y: (windowHeight - windowWidth) / 2,
            x: -((windowHeight - windowWidth) / 2),
          }
        : {
            width: "100%",
            height: "100%",
            position: "relative",
            rotate: "0deg",
            x: 0,
            y: 0,
            zIndex: 1,
          })}
    >
      <VideoView
        style={{
          width: "100%",
          height: "100%",
          opacity: isVideoVisible ? 0.6 : 0,
          display: isVideoVisible ? "flex" : "none",
        }}
        player={player}
        contentFit="cover"
        fullscreenOptions={{ enable: false }}
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
          {/* İçeriklerin aynı... */}
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
        </Stack>
      )}
    </Stack>
  );
};

export default forwardRef(VideoPlayerCustom);
