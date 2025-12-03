import React, { useState } from "react";
import { YStack } from "tamagui";
import {
  CircularTimer,
  CircularTimerProps,
} from "../../components/CircularTimer";
import CustomDropDown from "components/Menus/CustomDropDown";

type TimerMode = "work" | "break";

interface TimerOption {
  key: string;
  label: string;
  workTime: number;
  breakTime: number;
}

const dropdownItems: TimerOption[] = [
  { key: "pomodoro", label: "Pomodoro", workTime: 25, breakTime: 5 },
  { key: "5217", label: "52/17", workTime: 52, breakTime: 17 },
  { key: "ultradian", label: "Ultradian", workTime: 90, breakTime: 25 },
  { key: "custom", label: "Custom", workTime: 45, breakTime: 15 },
];

export default function TabOneScreen() {
  const [mode, setMode] = useState<TimerMode>("work");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedMode, setSelectedMode] = useState<TimerOption>(
    dropdownItems[0]
  );

  const timerConfig: Record<TimerMode, CircularTimerProps> = {
    work: {
      maxSeconds: (1 / 6) * 60, // 25 Dakika
      initialSeconds: (1 / 6) * 60, // 12.5 Dakika
      startColor: "#072712c0",
      endColor: "#007a29bd",
      activeColor: "#38a15bff",
      inactiveColor: "#ff0000ff",
      thumbColor: "#114221ff",
    },
    break: {
      maxSeconds: (1 / 12) * 60, // 5 Dakika
      initialSeconds: (1 / 12) * 60, // 2.5 Dakika
      startColor: "#212707c0",
      endColor: "#b5c710bd",
      activeColor: "#81a138ff",
      inactiveColor: "#ff0000ff",
      thumbColor: "#b5c528ff",
    },
  };

  const handleTimerEnd = () => {
    console.log(`${mode} bitti!`);

    if (mode === "work") {
      setMode("break");
    } else {
      setMode("work");
    }
  };

  const currentConfig = timerConfig[mode];

  return (
    <YStack
      flex={1}
      pt={"$10"}
      alignItems="center"
      gap="$8"
      px="$10"
      bg="$background"
    >
      <CustomDropDown
        selectedItem={selectedMode}
        items={dropdownItems}
        keyName="key"
        labelName="label"
        onSelect={(item) => setSelectedMode(item)}
        minWidth={250}
        height={40}
        menuBorderRadius={12}
        deselectable={false}
      />
      <CircularTimer
        key={mode}
        maxSeconds={currentConfig.maxSeconds}
        initialSeconds={currentConfig.initialSeconds}
        startColor={currentConfig.startColor}
        endColor={currentConfig.endColor}
        activeColor={currentConfig.activeColor}
        inactiveColor={currentConfig.inactiveColor}
        thumbColor={currentConfig.thumbColor}
        onEnd={handleTimerEnd}
        onActiveChange={(isActive) => setIsTimerRunning(isActive)}
      />
    </YStack>
  );
}
