import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { View, Text, YStack } from "tamagui";
import CustomDialog, { CustomDialogRef } from "./CustomDialog";
import TimerOptionsForm from "./TimerOptionsForm";
import { TimerOption, useTimerContext } from "contexts/TimerContext";

const SettingsContent = () => {
  const params = useLocalSearchParams();
  const { timerOptions, saveTimerOption, removeTimerOption } =
    useTimerContext();

  const keyRef = useRef(0);
  const timerOptionsDialogRef = useRef<CustomDialogRef>(null);

  useEffect(() => {
    if (params?.key && params.key !== keyRef?.current?.toString()) {
      keyRef.current = Number(params?.key);
      if (timerOptionsDialogRef?.current) {
        setTimeout(() => {
          timerOptionsDialogRef.current?.toggle(true);
        }, 100);
      }
    }
  }, [params?.key]);

  console.log("SettingsContent params:", params);

  const handleDeleteTimerOption = (option: TimerOption) => {
    console.log("Deleting option from SettingsContent:", option);
    removeTimerOption(option.key);
  };

  const handleSaveTimerOption = (option: TimerOption) => {
    console.log("Saving option from SettingsContent:", option);
    saveTimerOption(option);
  };

  return (
    <View flex={1} bg={"$background"}>
      <YStack alignItems="center">
        <CustomDialog
          ref={timerOptionsDialogRef}
          triggerHeader="Timer Options"
          headerFontSize={25}
          triggerProps={{ fontSize: 20, width: "80%" }}
          height={"90%"}
          width={"95%"}
          header="Timer Options"
          buttons={[{ label: "Done", onPress() {} }]}
          children={
            <TimerOptionsForm
              timerOptions={timerOptions}
              onDeleteOption={handleDeleteTimerOption}
              onSaveOption={handleSaveTimerOption}
            />
          }
        />
      </YStack>
    </View>
  );
};

export default SettingsContent;
