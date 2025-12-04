import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { useAppStateContext } from "./AppStateContext";
import { getData, saveData, removeData } from "utils/AsyncStorageUtils";
import { CircularTimerRef } from "components/CircularTimer";

export type TimerMode = "work" | "break";
export type BackgroundBehavior = "PAUSE" | "CONTINUE";

export interface TimerOption {
  key: string;
  label: string;
  workTimeInMinutes: number;
  breakTimeInMinutes: number;
}

interface TimerContextType {
  mode: TimerMode;
  setMode: (mode: TimerMode) => void;
  selectedOption: TimerOption;
  setSelectedOption: (option: TimerOption) => void;
  isTimerRunning: boolean;
  setIsTimerRunning: (isRunning: boolean) => void;
  timeLeft: number;
  maxTime: number;
  handleTimerEnd: () => void;
  timerKey: string;
  timerRef: React.RefObject<CircularTimerRef | null>;
  backgroundBehavior: BackgroundBehavior;
  setBackgroundBehavior: (behavior: BackgroundBehavior) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const TIMER_STORAGE_KEY = "saved_timer_state";

const defaultOption = {
  key: "pomodoro",
  label: "Pomodoro",
  workTimeInMinutes: 25,
  breakTimeInMinutes: 5,
};

export const TimerContextProvider = ({ children }: { children: ReactNode }) => {
  const { appState } = useAppStateContext();

  const [mode, setMode] = useState<TimerMode>("work");
  const [selectedOption, setSelectedOption] = useState<TimerOption | null>(
    null
  );

  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const initialMaxTime = defaultOption.workTimeInMinutes * 60;

  const [timeLeft, setTimeLeft] = useState(initialMaxTime);
  const [maxTime, setMaxTime] = useState(initialMaxTime);
  const [backgroundBehavior, setBackgroundBehavior] =
    useState<BackgroundBehavior>("PAUSE");

  const startTimeRef = useRef<number | null>(null);
  const initialTimeLeftRef = useRef<number>(0);
  const timerRef = useRef<CircularTimerRef | null>(null);

  const [timerKey, setTimerKey] = useState("init-key");

  useEffect(() => {
    if (selectedOption) {
      const minutes =
        mode === "work"
          ? selectedOption.workTimeInMinutes
          : selectedOption.breakTimeInMinutes;
      const seconds = Math.floor(minutes * 60);

      setMaxTime(seconds);
      if (!isTimerRunning) {
        setTimeLeft(seconds);
        updateTimerKey();
      }
    }
  }, [selectedOption, mode]);

  useEffect(() => {
    if (isTimerRunning) {
      startTimeRef.current = Date.now();
      initialTimeLeftRef.current = timeLeft;
    }
  }, [isTimerRunning]);

  useEffect(() => {
    const handleAppStateChange = async () => {
      if (appState === "background" || appState === "inactive") {
        if (isTimerRunning) {
          const now = Date.now();
          const elapsed = (now - (startTimeRef.current || now)) / 1000;
          const currentRemaining = Math.max(
            0,
            Math.floor(initialTimeLeftRef.current - elapsed)
          );

          console.log(
            `Arka plana gidiliyor. Kalan süre hesaplandı: ${currentRemaining}`
          );

          const stateToSave = {
            timeLeft: currentRemaining,
            mode,
            optionKey: selectedOption?.key,
            timestamp: now,
            wasRunning: true,
          };
          await saveData(TIMER_STORAGE_KEY, JSON.stringify(stateToSave));

          if (backgroundBehavior === "PAUSE") {
            setIsTimerRunning(false);
            setTimeLeft(currentRemaining);
          }
        }
      } else if (appState === "active") {
        console.log("Ön plana gelindi. Veri kontrol ediliyor...");
        const savedDataString = await getData(TIMER_STORAGE_KEY);

        if (savedDataString) {
          const savedData = JSON.parse(savedDataString);

          if (savedData.wasRunning) {
            const now = Date.now();

            let recoveredTime = savedData.timeLeft;

            if (backgroundBehavior === "CONTINUE") {
              const secondsPassedInBackground =
                (now - savedData.timestamp) / 1000;
              recoveredTime = Math.max(
                0,
                Math.floor(savedData.timeLeft - secondsPassedInBackground)
              );
              console.log(
                `Arka planda ${secondsPassedInBackground} sn geçti. Yeni süre: ${recoveredTime}`
              );

              if (timerRef?.current) {
                setTimeout(() => {
                  setIsTimerRunning(true);
                  timerRef?.current?.toggle(true);
                }, 10);
              }
            } else {
              console.log(
                `Timer dondurulmuştu. Kaldığı yerden devam ediyor: ${recoveredTime}`
              );
              if (timerRef?.current) {
                setTimeout(() => {
                  setIsTimerRunning(true);
                  timerRef?.current?.toggle(true);
                }, 10);
              }
            }

            setTimeLeft(recoveredTime);

            if (recoveredTime <= 0) {
              handleTimerEnd();
            } else {
              updateTimerKey();
            }
          }
          await removeData(TIMER_STORAGE_KEY);
        }
      }
    };

    handleAppStateChange();
  }, [appState]);

  const updateTimerKey = () => {
    setTimerKey(`${mode}-${selectedOption?.key}-${Date.now()}`);
  };

  const handleTimerEnd = () => {
    setIsTimerRunning(false);
    console.log(`${mode} süresi doldu!`);

    if (mode === "work") {
      setMode("break");
    } else {
      setMode("work");
    }
  };

  return (
    <TimerContext.Provider
      value={{
        mode,
        setMode,
        selectedOption: selectedOption!,
        setSelectedOption,
        isTimerRunning,
        setIsTimerRunning,
        timeLeft,
        maxTime,
        handleTimerEnd,
        timerKey,
        backgroundBehavior,
        setBackgroundBehavior,
        timerRef,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error(
      "useTimerContext must be used within a TimerContextProvider"
    );
  }
  return context;
};
