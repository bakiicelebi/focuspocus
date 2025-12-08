import React, { createContext, useContext, useEffect, useState } from "react";

import { getData, saveData } from "utils/AsyncStorageUtils";

type UserPreferencesContextValue = {
  vibrationsEnabled: boolean;
  setVibrationsEnabled: (enabled: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
};

const UserPreferencesContext = createContext<
  UserPreferencesContextValue | undefined
>(undefined);

const VIBRATIONS_KEY = "vibrationsEnabled";
const SOUND_KEY = "soundEnabled";

export const UserPreferencesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [vibrationsEnabled, setVibrationsEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const setVibrationsEnabledWrapper = (enabled: boolean) => {
    setVibrationsEnabled(enabled);
    saveData(VIBRATIONS_KEY, enabled?.toString());
  };

  const setSoundEnabledWrapper = (enabled: boolean) => {
    setSoundEnabled(enabled);
    saveData(SOUND_KEY, enabled?.toString());
  };

  const loadUserPreferences = async () => {
    const savedVibrations = await getData(VIBRATIONS_KEY);
    const savedSound = await getData(SOUND_KEY);

    if (savedVibrations !== null) {
      if (savedVibrations === "true") {
        setVibrationsEnabled(true);
      } else if (savedVibrations === "false") {
        setVibrationsEnabled(false);
      }
    }

    if (savedSound !== null) {
      if (savedSound === "true") {
        setSoundEnabled(true);
      } else if (savedSound === "false") {
        setSoundEnabled(false);
      }
    }
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        vibrationsEnabled,
        setVibrationsEnabled: setVibrationsEnabledWrapper,
        soundEnabled,
        setSoundEnabled: setSoundEnabledWrapper,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error(
      "useUserPreferences must be used within a UserPreferencesContextProvider"
    );
  }
  return context;
};
