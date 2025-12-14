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
import { useUserPreferences } from "./UserPreferencesContext";
import { Vibration } from "react-native";
import { triggerVibrationPattern } from "utils/Vibrations";
import { usePlaySound } from "hooks/usePlaySound";
import { useMediaContext } from "./MediaContext";
import { createTimerSessionId } from "utils/TimerDataUtils";

const ss = `
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
    key: "custom6",
    label: "Custom 6",
    workTimeInMinutes: 5,
    breakTimeInMinutes: 2,
  },
  {
    key: "custom7",
    label: "Custom 7",
    workTimeInMinutes: 3,
    breakTimeInMinutes: 1,
  },
   `;

export type TimerMode = "work" | "break";
export type BackgroundBehavior = "PAUSE" | "CONTINUE";

export interface TimerOption {
  key: string;
  label: string;
  workTimeInMinutes: number;
  breakTimeInMinutes: number;
  icon?: IconComponentType;
  editable?: boolean;
}

export type IconComponentType = React.ComponentType<IconProps>;

interface TimerContextType {
  mode: TimerMode;
  timerOptions: TimerOption[];
  setTimerOptions: (options: TimerOption[]) => void;
  saveTimerOption: (option: TimerOption) => Promise<void>;
  removeTimerOption: (key: string) => Promise<void>;
  setMode: (mode: TimerMode) => void;
  selectedOption: TimerOption;
  setSelectedOption: (option: TimerOption) => void;
  isTimerRunning: boolean;
  setIsTimerRunning: (isRunning: boolean) => void;
  timeLeft: number;
  setTimeLeft: (seconds: number) => void;
  handleTimerEnd: () => void;
  onManualTimerStarted: (seconds?: number) => void;
  onManualTimerEnd: (seconds?: number) => void;
  timerRef: React.RefObject<CircularTimerRef | null>;
  backgroundBehavior: BackgroundBehavior;
  setBackgroundBehavior: (behavior: BackgroundBehavior) => void;
  isRepeatAvailable: boolean;
  setIsRepeatAvailable: (available: boolean) => void;
  resetTimer: () => void;
  timerCurrentSecond: number;
  setTimerCurrentSecond: (second: number) => void;
  stopMedia: boolean;
  setStopMedia: (visible: boolean) => void;
}

export const fixedTimerOptions: TimerOption[] = [
  {
    key: "testing",
    label: "Testing",
    workTimeInMinutes: 1 / 10,
    breakTimeInMinutes: 1 / 12,
    editable: false,
  },
  {
    key: "pomodoro",
    label: "Pomodoro",
    workTimeInMinutes: 25,
    breakTimeInMinutes: 5,
    editable: false,
  },
  {
    key: "5217",
    label: "52/17",
    workTimeInMinutes: 52,
    breakTimeInMinutes: 17,
    editable: false,
  },
  {
    key: "ultradian",
    label: "Ultradian",
    workTimeInMinutes: 90,
    breakTimeInMinutes: 25,
    editable: false,
  },
];

export const addNewKey = "add*New";

export const addNewTimerOption: TimerOption = {
  key: addNewKey,
  label: "Add New",
  workTimeInMinutes: 0,
  breakTimeInMinutes: 0,
  icon: Plus as IconComponentType,
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const TIMER_STORAGE_KEY = "saved_timer_state";
const TIMER_OPTIONS_STORAGE_KEY = "timer_options";

export const TimerContextProvider = ({ children }: { children: ReactNode }) => {
  const { appState } = useAppStateContext();
  const { vibrationsEnabled, soundEnabled } = useUserPreferences();

  /** TIMER SESSION */
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const [mode, setMode] = useState<TimerMode>("work");
  const [selectedOption, setSelectedOption] = useState<TimerOption | null>(
    fixedTimerOptions[0]
  );
  const [timerOptions, setTimerOptions] =
    useState<TimerOption[]>(fixedTimerOptions);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isRepeatAvailable, setIsRepeatAvailable] = useState<boolean>(false);

  const [timerCurrentSecond, setTimerCurrentSecond] = useState<number>(0);

  const initialMaxTime = fixedTimerOptions[0].workTimeInMinutes * 60;

  const [timeLeft, setTimeLeft] = useState(initialMaxTime);
  const [backgroundBehavior, setBackgroundBehavior] =
    useState<BackgroundBehavior>("PAUSE");

  const [stopMedia, setStopMedia] = useState<boolean>(true);

  const { play } = usePlaySound({ src: "", loop: false });

  const startTimeRef = useRef<number | null>(null);
  const initialTimeLeftRef = useRef<number>(0);
  const selectedOptionRef = useRef<TimerOption | null>(null);
  const timerRef = useRef<CircularTimerRef | null>(null);

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
            backgroundBehavior,
          };

          console.log("Timer durumu kaydediliyor:", stateToSave);

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
      if (vibrationsEnabled) {
        Promise.resolve().then(() => triggerVibrationPattern());
      }
      if (soundEnabled) {
        play();
      }
      setTimeout(() => {
        timerRef.current?.toggle(true);
      }, 10);
    } else {
      setMode("work");
      setTimeLeft(selectedOption?.workTimeInMinutes! * 60);
      if (vibrationsEnabled) {
        Promise.resolve().then(() => triggerVibrationPattern());
      }
      if (soundEnabled) {
        play();
      }
      if (isRepeatAvailable) {
        setTimeout(() => {
          timerRef.current?.toggle(true);
        }, 10);
      } else {
        setTimeout(() => {
          timerRef.current?.toggle(false);
        }, 10);
        setStopMedia(false);
      }
    }
  };

  const onManualTimerStarted = (seconds?: number) => {
    setCurrentSessionId(createTimerSessionId());
    console.log(
      "Manual timer started with seconds:",
      seconds,
      currentSessionId
    );
  };

  const onManualTimerEnd = (seconds?: number) => {};

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

  const saveTimerOption = async (option: TimerOption) => {
    const savedDataString = await getData(TIMER_OPTIONS_STORAGE_KEY);
    let savedOptions: TimerOption[] = [];
    if (savedDataString) {
      savedOptions = JSON.parse(savedDataString);
    }

    const existingIndex = savedOptions.findIndex((o) => o?.key === option?.key);

    if (existingIndex !== -1) {
      savedOptions[existingIndex] = option;
    } else {
      savedOptions.push(option);
    }

    const allOptions = [...fixedTimerOptions, ...savedOptions];

    if (allOptions.length < 10) {
      allOptions.push(addNewTimerOption);
    }

    setTimerOptions(allOptions);
    await saveData(TIMER_OPTIONS_STORAGE_KEY, JSON.stringify(savedOptions));
  };

  const removeTimerOption = async (key: string) => {
    let updatedOptions = timerOptions.filter((option) => option?.key !== key);

    if (
      updatedOptions.length < 10 &&
      !updatedOptions.find((o) => o?.key === addNewKey)
    ) {
      updatedOptions.push(addNewTimerOption);
    }
    setTimerOptions(updatedOptions);

    const editables = updatedOptions.filter((o) => o?.editable);
    const editablesWithoutAddNew = editables.filter(
      (o) => o?.key !== addNewKey
    );

    if (selectedOption?.key === key) {
      setSelectedOption(fixedTimerOptions[0]);
    }

    await saveData(
      TIMER_OPTIONS_STORAGE_KEY,
      JSON.stringify(editablesWithoutAddNew)
    );
  };

  const loadTimerOptions = async () => {
    const savedOptionsString = await getData(TIMER_OPTIONS_STORAGE_KEY);
    let options = [...fixedTimerOptions];
    if (savedOptionsString) {
      const savedOptions = JSON.parse(savedOptionsString);
      options = [...fixedTimerOptions, ...savedOptions];
    }

    if (options.length < 10 && addNewTimerOption) {
      options.push(addNewTimerOption);
    }

    setTimerOptions(options);
    console.log(
      "Loaded timer options:",
      options,
      "savedOptionsString:",
      savedOptionsString
    );
  };

  useEffect(() => {
    loadTimerOptions();
  }, []);

  return (
    <TimerContext.Provider
      value={{
        mode,
        setMode,
        timerOptions,
        setTimerOptions,
        saveTimerOption,
        removeTimerOption,
        selectedOption: selectedOption!,
        setSelectedOption,
        isTimerRunning,
        setIsTimerRunning,
        timeLeft,
        setTimeLeft,
        handleTimerEnd,
        onManualTimerStarted,
        onManualTimerEnd,
        backgroundBehavior,
        setBackgroundBehavior,
        timerRef,
        isRepeatAvailable,
        setIsRepeatAvailable,
        resetTimer,
        timerCurrentSecond,
        setTimerCurrentSecond,
        stopMedia,
        setStopMedia,
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
