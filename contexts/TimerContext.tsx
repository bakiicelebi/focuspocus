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
import type { IconProps } from "@tamagui/helpers-icon";
import { Heart, Plus } from "@tamagui/lucide-icons";

export type TimerMode = "work" | "break";
export type BackgroundBehavior = "PAUSE" | "CONTINUE";

export interface TimerOption {
  key: string;
  label: string;
  workTimeInMinutes: number;
  breakTimeInMinutes: number;
  icon?: IconComponentType;
}

export type IconComponentType = React.ComponentType<IconProps>;

interface TimerContextType {
  mode: TimerMode;
  timerOptions: TimerOption[];
  setTimerOptions: (options: TimerOption[]) => void;
  setMode: (mode: TimerMode) => void;
  selectedOption: TimerOption;
  setSelectedOption: (option: TimerOption) => void;
  isTimerRunning: boolean;
  setIsTimerRunning: (isRunning: boolean) => void;
  timeLeft: number;
  setTimeLeft: (seconds: number) => void;
  handleTimerEnd: () => void;
  timerRef: React.RefObject<CircularTimerRef | null>;
  backgroundBehavior: BackgroundBehavior;
  setBackgroundBehavior: (behavior: BackgroundBehavior) => void;
  isRepeatAvailable: boolean;
  setIsRepeatAvailable: (available: boolean) => void;
  resetTimer: () => void;
}

export const defaultTimerOptions: TimerOption[] = [
  {
    key: "testing",
    label: "Testing",
    workTimeInMinutes: 1 / 15,
    breakTimeInMinutes: 1 / 18,
  },
  {
    key: "pomodoro",
    label: "Pomodoro",
    workTimeInMinutes: 25,
    breakTimeInMinutes: 5,
  },
  {
    key: "5217",
    label: "52/17",
    workTimeInMinutes: 52,
    breakTimeInMinutes: 17,
  },
  {
    key: "ultradian",
    label: "Ultradian",
    workTimeInMinutes: 90,
    breakTimeInMinutes: 25,
  },
  {
    key: "custom1",
    label: "Custom 1",
    workTimeInMinutes: 45,
    breakTimeInMinutes: 10,
  },
  {
    key: "custom2",
    label: "Custom 2",
    workTimeInMinutes: 30,
    breakTimeInMinutes: 15,
  },
  {
    key: "custom3",
    label: "Custom 3",
    workTimeInMinutes: 20,
    breakTimeInMinutes: 5,
  },
  {
    key: "custom4",
    label: "Custom 4",
    workTimeInMinutes: 15,
    breakTimeInMinutes: 10,
  },
  {
    key: "custom5",
    label: "Custom 5",
    workTimeInMinutes: 10,
    breakTimeInMinutes: 5,
  },
  {
    key: "addNew",
    label: "Add New",
    workTimeInMinutes: 0,
    breakTimeInMinutes: 0,
    icon: Plus as IconComponentType,
  },
];

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const TIMER_STORAGE_KEY = "saved_timer_state";

export const TimerContextProvider = ({ children }: { children: ReactNode }) => {
  const { appState } = useAppStateContext();

  const [mode, setMode] = useState<TimerMode>("work");
  const [selectedOption, setSelectedOption] = useState<TimerOption | null>(
    defaultTimerOptions[0]
  );
  const [timerOptions, setTimerOptions] =
    useState<TimerOption[]>(defaultTimerOptions);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isRepeatAvailable, setIsRepeatAvailable] = useState<boolean>(false);

  const initialMaxTime = defaultTimerOptions[0].workTimeInMinutes * 60;

  const [timeLeft, setTimeLeft] = useState(initialMaxTime);
  const [backgroundBehavior, setBackgroundBehavior] =
    useState<BackgroundBehavior>("PAUSE");

  const startTimeRef = useRef<number | null>(null);
  const initialTimeLeftRef = useRef<number>(0);
  const selectedOptionRef = useRef<TimerOption | null>(null);
  const timerRef = useRef<CircularTimerRef | null>(null);

  useEffect(() => {
    let options = [...defaultTimerOptions];
    const addNewOption = options.find((o) => o.key === "addNew");
    options = options.filter((o) => o.key !== "addNew").slice(0, 10);
    if (options.length < 10 && addNewOption) {
      options.push(addNewOption);
    }

    setTimerOptions(options);
  }, [defaultTimerOptions]);

  useEffect(() => {
    if (selectedOption) {
      if (selectedOption !== selectedOptionRef.current) {
        timerRef.current?.toggle(false);
      }
      selectedOptionRef.current = selectedOption;
      const minutes =
        mode === "work"
          ? selectedOption.workTimeInMinutes
          : selectedOption.breakTimeInMinutes;
      const seconds = Math.floor(minutes * 60);

      setTimeLeft(seconds);
      initialTimeLeftRef.current = seconds;
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
            }
          }
          await removeData(TIMER_STORAGE_KEY);
        }
      }
    };

    handleAppStateChange();
  }, [appState]);

  const handleTimerEnd = () => {
    setIsTimerRunning(false);
    if (mode === "work") {
      setMode("break");
      setTimeLeft(selectedOption?.breakTimeInMinutes! * 60);
      setTimeout(() => {
        timerRef.current?.toggle(true);
      }, 10);
    } else {
      setMode("work");
      setTimeLeft(selectedOption?.workTimeInMinutes! * 60);
      if (isRepeatAvailable) {
        setTimeout(() => {
          timerRef.current?.toggle(true);
        }, 10);
      } else {
        setTimeout(() => {
          timerRef.current?.toggle(false);
        }, 10);
      }
    }
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    const minutes =
      mode === "work"
        ? selectedOption?.workTimeInMinutes! * 60
        : selectedOption?.breakTimeInMinutes! * 60;
    setTimeLeft(minutes);
    setTimeout(() => {
      timerRef.current?.reset(minutes);
    }, 10);
  };

  return (
    <TimerContext.Provider
      value={{
        mode,
        setMode,
        timerOptions,
        setTimerOptions,
        selectedOption: selectedOption!,
        setSelectedOption,
        isTimerRunning,
        setIsTimerRunning,
        timeLeft,
        setTimeLeft,
        handleTimerEnd,
        backgroundBehavior,
        setBackgroundBehavior,
        timerRef,
        isRepeatAvailable,
        setIsRepeatAvailable,
        resetTimer,
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
