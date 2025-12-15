import {
  BackgroundBehavior,
  TimerMode,
  TimerOption,
} from "contexts/TimerContext";

export type StoppedType = "manual" | "completed" | "background" | "uncompleted";

export interface TimerData {
  id: string;
  date: string; // ISO string
  mode: TimerMode;
  currentTimerOption: TimerOption;
  stoppedType: StoppedType;
  workSeconds: number;
  breakSeconds: number;
  repeatCount: number;
  backgroundBehavior: BackgroundBehavior;
  distractedCount: number;
}
