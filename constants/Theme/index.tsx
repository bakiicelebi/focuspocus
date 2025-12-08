import { cardLight, cardDark, cardTokens } from "./Card";
import { generalDark, generalLight, generalTokens } from "./General";
import { menuDark, menuLight, menuTokens } from "./Menu";
import { buttonDark, buttonLight, buttonTokens } from "./Button";
import { timerDark, timerLight, timerTokens } from "./Timer";

export const lightTheme = {
  ...cardLight,
  ...generalLight,
  ...menuLight,
  ...buttonLight,
  ...timerLight,
};

export const darkTheme = {
  ...cardDark,
  ...generalDark,
  ...menuDark,
  ...buttonDark,
  ...timerDark,
};

export const tokens = {
  size: {
    ...cardTokens.size,
    ...menuTokens.size,
    ...generalTokens.size,
    ...buttonTokens.size,
    ...timerTokens.size,
  },
  space: {
    ...cardTokens.space,
    ...menuTokens.space,
    ...generalTokens.space,
    ...buttonTokens.space,
  },
  radius: {
    ...cardTokens.radius,
    ...menuTokens.radius,
    ...generalTokens.radius,
    ...buttonTokens.radius,
  },
};
