import "../tamagui-web.css";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { Provider } from "components/Provider";
import { useTheme } from "tamagui";
import { AppStateContextProvider } from "contexts/AppStateContext";
import { TimerContextProvider } from "contexts/TimerContext";
import { ThemeProviderCustom, useThemeMode } from "contexts/ThemeContext";
import { UserPreferencesContextProvider } from "contexts/UserPreferencesContext";
import VideoPlayerCustom from "components/VideoPlayerCustom";
import { MediaProvider, useMediaContext } from "contexts/MediaContext";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (interLoaded || interError) {
      SplashScreen.hideAsync();
    }
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }

  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  );
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <ThemeProviderCustom>
        <UserPreferencesContextProvider>
          <MediaProvider>
            <AppStateContextProvider>
              <TimerContextProvider>{children}</TimerContextProvider>
            </AppStateContextProvider>
          </MediaProvider>
        </UserPreferencesContextProvider>
      </ThemeProviderCustom>
    </Provider>
  );
};

function RootLayoutNav() {
  const { effectiveScheme } = useThemeMode();
  const theme = useTheme();

  const { videoRef, isVisible } = useMediaContext();

  return (
    <ThemeProvider
      value={effectiveScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <StatusBar
        hidden={isVisible ? true : false}
        style={effectiveScheme === "dark" ? "light" : "dark"}
        backgroundColor="black"
      />
      {isVisible && <VideoPlayerCustom ref={videoRef} />}
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="modal"
          options={{
            title: "Tamagui + Expo",
            presentation: "modal",
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: {
              backgroundColor: theme.background.val,
            },
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
