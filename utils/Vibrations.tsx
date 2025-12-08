import { Vibration } from "react-native";

export const VIBRATION_PATTERN_1 = [0, 500, 200, 500];
export const VIBRATION_PATTERN_2 = [0, 300, 100, 300, 100, 300];
export const VIBRATION_PATTERN_3 = [0, 500, 200, 500, 200, 500];
export const VIBRATION_PATTERN_4 = [0, 600, 200, 600, 200, 600];
export const VIBRATION_PATTERN_5 = [0, 1000, 500, 1000, 500, 1000];
export const VIBRATION_PATTERN_6 = [0, 1000, 200, 1000];

export const triggerVibrationShort = () => {
  Promise.resolve().then(() => {
    Vibration.vibrate(100);
  });
  Vibration.cancel();
};

export const triggerVibrationLong = () => {
  Promise.resolve().then(() => {
    Vibration.vibrate(500);
  });
  Vibration.cancel();
};

export const triggerVibrationPattern = (pattern?: number[]) => {
  if (!pattern || pattern.length === 0) {
    Promise.resolve().then(() => Vibration.vibrate(VIBRATION_PATTERN_6));
  } else {
    Promise.resolve().then(() => Vibration.vibrate(pattern));
  }
  Vibration.cancel();
};

export const cancelVibration = () => {
  Vibration.cancel();
};
