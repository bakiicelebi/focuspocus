import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui } from "tamagui";
import { lightTheme, darkTheme, tokens } from "./constants/Theme";
import { createAnimations } from "@tamagui/animations-css";

const animations = createAnimations({
  fast: "ease-in 150ms",

  medium: "ease-in 300ms",
  slow: "ease-in 450ms",
  spring: "cubic-bezier(0.68, -0.55, 0.27, 1.55) 300ms",
  bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55) 300ms",
  fadeIn: "ease-in 300ms",
  fadeOut: "ease-out 300ms",
  slideIn: "ease-in 300ms",
  slideOut: "ease-out 300ms",
  zoomIn: "ease-in 300ms",
  zoomOut: "ease-out 300ms",
});

export const config = createTamagui({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    size: {
      ...defaultConfig.tokens.size,
      ...tokens.size,
    },
    space: {
      ...defaultConfig.tokens.space,
      ...tokens.space,
    },
    radius: {
      ...defaultConfig.tokens.radius,
      ...tokens.radius,
    },
  },
  themes: {
    ...defaultConfig.themes,
    light: {
      ...defaultConfig.themes.light,
      ...lightTheme,
    },
    dark: {
      ...defaultConfig.themes.dark,
      ...darkTheme,
    },
  },
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands: false,
  },
});

export type Conf = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
