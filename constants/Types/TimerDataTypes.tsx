import {
  BackgroundBehavior,
  TimerMode,
  TimerOption,
} from "contexts/TimerContext";

export type StoppedType = "manual" | "completed" | "background";

export interface TimerData {
  id: string;
  date: string;
  mode: TimerMode;
  currentTimerOption: TimerOption;
  stoppedType: StoppedType;
  elapsedSeconds: number;
  completedCycles: number;
  backgroundBehavior: BackgroundBehavior;
  distractedCount: number;
}
