import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";
import { getData, removeData, saveData } from "utils/AsyncStorageUtils";

type AppStateContextType = {
  appState: string;
  setAppState: React.Dispatch<
    React.SetStateAction<
      "active" | "background" | "inactive" | "unknown" | "extension"
    >
  >;
};

const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

export const LAST_BACKGROUND_TRANSITION_KEY = "lastBackgroundTransitionTime";

export const AppStateContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const appStateRef = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appStateRef.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
        loadLastBackgroundTransition();
      }

      if (nextAppState === "background") {
        saveLastBackgroundTransition();
      }

      appStateRef.current = nextAppState;
      setAppStateVisible(appStateRef.current);
      console.log("AppState", appStateRef.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const saveLastBackgroundTransition = async () => {
    const currentTime = new Date().toISOString();
    console.log("Saving last background transition time:", currentTime);
    await saveData(LAST_BACKGROUND_TRANSITION_KEY, currentTime);
    console.log("Background transition time saved.");
  };

  const loadLastBackgroundTransition = async () => {
    const data = await getData(LAST_BACKGROUND_TRANSITION_KEY);
    console.log("Loaded last background transition time:", data);
    return data;
  };

  const removeLastBackgroundTransition = async () => {
    await removeData(LAST_BACKGROUND_TRANSITION_KEY);
    console.log("Last background transition time removed.");
  };

  return (
    <AppStateContext.Provider
      value={{ appState: appStateVisible, setAppState: setAppStateVisible }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppStateContext = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error(
      "useAppStateContext must be used within an AppStateContextProvider"
    );
  }
  return context;
};
