import { getToken } from "tamagui";

export const getTokenValueFromProp = (value: number | string): number => {
  if (typeof value === "number") return value;
  const tokenValue = getToken(value as any);
  return tokenValue;
};
