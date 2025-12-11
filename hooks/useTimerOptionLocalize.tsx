import { TimerOption } from "contexts/TimerContext";
import { useEffect, useState } from "react";
import { getData, saveData } from "utils/AsyncStorageUtils";

const useTimerOptionLocalize = () => {
  const syncSelectedOption = async (option: TimerOption) => {
    console.log("Syncing selected option:", option);
    await saveData("selectedTimerOption", option ? JSON.stringify(option) : "");
  };

  const loadOption: () => Promise<TimerOption | null> = async () => {
    let savedOption = await getData("selectedTimerOption");
    if (savedOption) {
      console.log("Loaded saved timer option:", savedOption);
      try {
        return JSON.parse(savedOption) as TimerOption;
      } catch (error) {
        console.log("Error parsing saved timer option:", error);
        return null;
      }
    }
    return null;
  };

  return { syncSelectedOption, loadOption };
};

export default useTimerOptionLocalize;
