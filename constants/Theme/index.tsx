import { cardLight, cardDark, cardTokens } from "./Card";
import { generalDark, generalLight, generalTokens } from "./General";
import { menuDark, menuLight, menuTokens } from "./Menu";
import { buttonDark, buttonLight, buttonTokens } from "./Button";

export const lightTheme = {
  ...cardLight,
  ...generalLight,
  ...menuLight,
  ...buttonLight,
};

export const darkTheme = {
  ...cardDark,
  ...generalDark,
  ...menuDark,
  ...buttonDark,
};

export const tokens = {
  size: {
    ...cardTokens.size,
    ...menuTokens.size,
    ...generalTokens.size,
    ...buttonTokens.size,
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
