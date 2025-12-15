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
import {
  computeRecoveredState,
  createTimerSessionId,
} from "utils/TimerDataUtils";
import { StoppedType, TimerData } from "constants/Types/TimerDataTypes";

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
  notifyOnFinish: boolean;
  setNotifyOnFinish: (notify: boolean) => void;
  briefData: TimerData | null;
  setBriefData: (data: TimerData | null) => void;
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
    workTimeInMinutes: 1 / 6,
    breakTimeInMinutes: 1 / 10,
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
  const { vibrationsEnabled, soundEnabled, backgroundBehavior } =
    useUserPreferences();

  /** TIMER SESSION */
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const [notifyOnFinish, setNotifyOnFinish] = useState<boolean>(false);
  const [distractedCount, setDistractedCount] = useState<number>(0);
  const [repeatCount, setRepeatCount] = useState<number>(0);

  const [mode, setMode] = useState<TimerMode>("work");
  const [selectedOption, setSelectedOption] = useState<TimerOption>(
    fixedTimerOptions[0]
  );
  const [timerOptions, setTimerOptions] =
    useState<TimerOption[]>(fixedTimerOptions);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isRepeatAvailable, setIsRepeatAvailable] = useState<boolean>(false);

  const [timerCurrentSecond, setTimerCurrentSecond] = useState<number>(0);
  const [briefData, setBriefData] = useState<TimerData | null>(null);

  const initialMaxTime = fixedTimerOptions[0].workTimeInMinutes * 60;

  const [timeLeft, setTimeLeft] = useState(initialMaxTime);

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
        setMode("work");
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
    if (selectedOption) {
      setRepeatCount(0);
      setDistractedCount(0);
      const currentOptionMinutes =
        mode === "work"
          ? selectedOption.workTimeInMinutes
          : selectedOption.breakTimeInMinutes;
      const currentOptionSeconds = Math.floor(currentOptionMinutes * 60);
      if (
        !(timerCurrentSecond <= 0) &&
        timerCurrentSecond < currentOptionSeconds
      ) {
        finishTimerSession("uncompleted");
      }
    }
  }, [selectedOption]);

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
            distractedCount,
            repeatCount,
          };

          finishTimerSession("background");

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

          setDistractedCount(savedData.distractedCount || 0);
          setRepeatCount(savedData.repeatCount || 0);

          if (savedData.wasRunning) {
            const now = Date.now();

            let recoveredTime = savedData.timeLeft;

            if (backgroundBehavior === "CONTINUE") {
              const secondsPassed = Math.floor(
                (now - savedData.timestamp) / 1000
              );

              const {
                mode: newMode,
                remaining,
                finished,
              } = computeRecoveredState(
                savedData.mode,
                savedData.timeLeft,
                secondsPassed,
                selectedOption,
                isRepeatAvailable
              );

              if (finished) {
                setMode("break");
                setTimeLeft(0);
                setIsTimerRunning(false);
                timerRef.current?.toggle(false);
                return;
              }
              console.log(newMode, remaining);
              setMode(newMode as TimerMode);
              setTimeLeft(remaining);

              console.log(
                `Arka planda ${secondsPassed} sn geçti → yeni mod: ${newMode}, süre: ${remaining}`
              );

              // continue
              setTimeout(() => {
                setIsTimerRunning(true);
                timerRef?.current?.reset(remaining);
                setTimeout(() => {
                  timerRef?.current?.toggle(true);
                }, 20);
              }, 10);
            } else {
              console.log(
                `Timer dondurulmuştu. Kaldığı yerden devam ediyor: ${recoveredTime}`
              );
            }

            setTimeLeft(recoveredTime);
            setRepeatCount(savedData.repeatCount || 0);
            setDistractedCount(savedData.distractedCount || 0);

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
        setRepeatCount((count) => count + 1);
        setTimeout(() => {
          timerRef.current?.toggle(true);
        }, 10);
      } else {
        setTimeout(() => {
          timerRef.current?.toggle(false);
        }, 10);
        setStopMedia(false);
        setRepeatCount(0);
      }
      finishTimerSession("completed");
    }
  };

  const onManualTimerStarted = (seconds?: number) => {
    let sessionId = currentSessionId;
    if (!currentSessionId) {
      sessionId = createTimerSessionId();
      setCurrentSessionId(sessionId);
    }
    console.log("Timer started manually with seconds:", seconds, sessionId);
  };

  const onManualTimerEnd = (seconds?: number) => {
    setDistractedCount((count) => count + 1);
    finishTimerSession("manual");
  };

  const finishTimerSession = async (stoppedType?: StoppedType) => {
    const brief: TimerData = {
      id: currentSessionId || createTimerSessionId(),
      date: new Date().toISOString(),
      mode,
      currentTimerOption: selectedOption!,
      stoppedType: stoppedType || "completed",
      workSeconds: timeLeft,
      backgroundBehavior: backgroundBehavior,
      breakSeconds: 0,
      repeatCount: repeatCount,
      distractedCount: distractedCount,
    };

    setNotifyOnFinish(true);

    if ("completed" === stoppedType) {
      saveLocally(brief);
      setRepeatCount(0);
      setDistractedCount(0);
      if (currentSessionId) {
        setCurrentSessionId(null);
      }
    }
  };

  const saveLocally = async (data: TimerData) => {
    try {
      const existingDataString = await getData("local_timer_data");
      let existingData: TimerData[] = [];
      if (existingDataString) {
        existingData = JSON.parse(existingDataString);
      }
      existingData.push(data);
      await saveData("local_timer_data", JSON.stringify(existingData));
      console.log("Timer data saved locally:", data.id);
    } catch (error) {
      console.log("Error saving timer data locally:", error);
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

    finishTimerSession("uncompleted");
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
        briefData,
        setBriefData,
        mode,
        setMode,
        notifyOnFinish,
        setNotifyOnFinish,
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
