import React, { createContext, useContext, useEffect, useState } from "react";
import { Theme } from "tamagui";
import { useColorScheme } from "react-native";
import { getData, saveData } from "utils/AsyncStorageUtils";

type ColorScheme = "light" | "dark" | "default";

type ThemeContextValue = {
  colorScheme: ColorScheme;
  effectiveScheme: "light" | "dark";
  setColorScheme: (mode: ColorScheme) => void;
  toggleColorScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  colorScheme: "default",
  effectiveScheme: "light",
  setColorScheme: () => {},
  toggleColorScheme: () => {},
});

const COLOR_MODE_KEY = "color-mode";

export const ThemeProviderCustom = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const systemScheme = useColorScheme() ?? "light";
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("default");

  const effectiveScheme: "light" | "dark" =
    colorScheme === "default" ? systemScheme : colorScheme;

  useEffect(() => {
    loadColorScheme();
  }, []);

  const setColorScheme = (mode: ColorScheme) => {
    setColorSchemeState(mode);
    saveData(COLOR_MODE_KEY, mode);
  };

  const toggleColorScheme = () => {
    setColorSchemeState((prev) => {
      const base = prev === "default" ? systemScheme : prev;
      const next = base === "light" ? "dark" : "light";
      saveData(COLOR_MODE_KEY, next);
      return next;
    });
  };

  const loadColorScheme = async () => {
    const savedMode = await getData(COLOR_MODE_KEY);

    if (
      savedMode === "light" ||
      savedMode === "dark" ||
      savedMode === "default"
    ) {
      setColorSchemeState(savedMode);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        effectiveScheme,
        setColorScheme,
        toggleColorScheme,
      }}
    >
      <Theme name={effectiveScheme}>{children}</Theme>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeContext);
