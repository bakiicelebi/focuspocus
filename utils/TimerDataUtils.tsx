import { TimerMode, TimerOption } from "../contexts/TimerContext";

export const createTimerSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};


export const computeRecoveredState = (
  savedMode: TimerMode,
  savedRemaining: number,
  elapsed: number, // Geçen toplam süre (saniye)
  option: TimerOption,
  isLoop: boolean
) => {
  let mode = savedMode;
  let remaining = savedRemaining;
  let passed = elapsed;

  // İstatistikler
  let addedWorkSeconds = 0;
  let addedCycles = 0;

  const workSec = Math.floor(option.workTimeInMinutes * 60);
  const breakSec = Math.floor(option.breakTimeInMinutes * 60);

  while (passed > 0) {
    if (mode === "work") {
      if (passed >= remaining) {
        // Work bitti -> Break'e geçiş
        addedWorkSeconds += remaining; // Kalan tüm süreyi work olarak ekle
        passed -= remaining;
        mode = "break";
        remaining = breakSec;
      } else {
        // Work devam ediyor
        addedWorkSeconds += passed;
        remaining -= passed;
        passed = 0;
      }
    } else if (mode === "break") {
      if (passed >= remaining) {
        // Break bitti -> Work'e geçiş (Cycle tamamlandı)
        addedCycles += 1; // Bir tur bitti

        if (!isLoop) {
          return {
            mode: "break",
            remaining: 0,
            finished: true,
            addedWorkSeconds,
            addedCycles,
          };
        }

        passed -= remaining;
        mode = "work";
        remaining = workSec;
      } else {
        remaining -= passed;
        passed = 0;
      }
    }
  }

  return {
    mode,
    remaining,
    finished: false,
    addedWorkSeconds,
    addedCycles,
  };
};