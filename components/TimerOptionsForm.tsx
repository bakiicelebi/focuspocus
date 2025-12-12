import { View, Text, Stack, YStack, useTheme, XStack, Button } from "tamagui";
import { addNewKey, TimerOption } from "../contexts/TimerContext";
import { FlashList } from "@shopify/flash-list";
import TimerOptionCard from "./TimerOptionCard";
import { ArrowDown, Minus, Plus } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { FloatingLabelInputOnly } from "./FloatingLabelInputOnly";
import CustomDialog from "./CustomDialog";
import OutsidePressHandler from "./Menus/OutsidePressHelper";

const TimerOptionsForm = ({
  timerOptions,
  onDeleteOption,
  onSaveOption,
}: {
  timerOptions: TimerOption[];
  onDeleteOption: (option: TimerOption) => void;
  onSaveOption: (option: TimerOption) => void;
}) => {
  const [showArrow, setShowArrow] = useState(true);
  const [titleValue, setTitleValue] = useState("Custom");
  const [workTimeValue, setWorkTimeValue] = useState("10");
  const [breakTimeValue, setBreakTimeValue] = useState("10");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeletingDialogOpen, setIsDeletingDialogOpen] = useState(false);
  const [deletingOption, setDeletingOption] = useState<TimerOption | null>(
    null
  );

  const theme = useTheme();
  const bg = theme.background.val;

  const timerOptionsFiltered = timerOptions.filter(
    (option) => option?.key !== addNewKey
  );

  const disabledAddButton =
    titleValue.trim() === "" ||
    workTimeValue.trim() === "0" ||
    workTimeValue.trim() === "" ||
    breakTimeValue.trim() === "0" ||
    breakTimeValue.trim() === "" ||
    timerOptionsFiltered.length >= 10;

  const handleScroll = (e: any) => {
    const offsetY = e?.nativeEvent?.contentOffset?.y;
    const visibleHeight = e?.nativeEvent?.layoutMeasurement?.height;
    const contentHeight = e?.nativeEvent?.contentSize?.height;

    const isAtBottom = offsetY + visibleHeight >= contentHeight - 20;

    setShowArrow(!isAtBottom);
  };

  const regex = /^[0-9]*\.?[0-9]*$/;

  const handleWorkTimeChange = (text: string) => {
    if (regex.test(text)) {
      setWorkTimeValue(text);
    }
  };

  const handleBreakTimeChange = (text: string) => {
    if (regex.test(text)) {
      setBreakTimeValue(text);
    }
  };

  const handlePlusMinus = (
    currentValue: string,
    isIncrement: boolean,
    setter: (value: string) => void
  ) => {
    let numericValue = parseFloat(currentValue) || 0;
    numericValue = isIncrement ? numericValue + 1 : numericValue - 1;
    if (numericValue < 0) numericValue = 0;
    if (numericValue > 999) numericValue = 999;
    setter(numericValue.toString());
  };

  const handleEditMode = (key: string) => {
    console.log("Edit mode for key:", key);
    const editableOption = timerOptions.find((option) => option?.key === key);
    if (editableOption) {
      setIsEditMode(true);
      setTitleValue(editableOption.label);
      setWorkTimeValue(editableOption.workTimeInMinutes.toString());
      setBreakTimeValue(editableOption.breakTimeInMinutes.toString());
    }
  };

  const cancelEditMode = () => {
    setIsEditMode(false);
    setTitleValue("Custom");
    setWorkTimeValue("0");
    setBreakTimeValue("0");
  };

  const handleDeleteOptionDialog = (item: TimerOption) => {
    setDeletingOption(item);
    setIsDeletingDialogOpen(true);
  };

  const handleDeleteOption = () => {
    console.log("Deleting option:", deletingOption);
    if (deletingOption) {
      onDeleteOption(deletingOption);
    }
    setDeletingOption(null);
    setIsDeletingDialogOpen(false);
    setIsEditMode(false);
    setTitleValue("Custom");
    setWorkTimeValue("0");
    setBreakTimeValue("0");
  };

  const saveOption = () => {
    if (!isEditMode) {
      const exists = timerOptions.some(
        (option) =>
          option?.key === titleValue.trim().toLowerCase().replace(/\s+/g, "-")
      );
      if (exists) {
        alert("An option with this title already exists. To update, touch it.");
        return;
      }
    }

    const newOption: TimerOption = {
      key: titleValue.trim().toLowerCase().replace(/\s+/g, "-"),
      label: titleValue.trim().replace(/\s+/g, " "),
      workTimeInMinutes: parseFloat(workTimeValue),
      breakTimeInMinutes: parseFloat(breakTimeValue),
      editable: true,
    };

    onSaveOption(newOption);

    if (isEditMode) {
      cancelEditMode();
    }
  };

  const renderItem = (item: TimerOption, index: number) => {
    return (
      <Stack
        disabled={!item.editable}
        onPress={() => handleEditMode(item?.key)}
        onLongPress={() => handleDeleteOptionDialog(item)}
      >
        <TimerOptionCard item={item} index={index} />
      </Stack>
    );
  };

  return (
    <React.Fragment>
      <Stack gap={"$2"} flex={1}>
        <Stack height={"40%"}>
          <FloatingLabelInputOnly
            value={titleValue}
            onChangeText={setTitleValue}
            placeholder="Option Title"
            bgColor={bg}
            inputMode="text"
            inputHeight={40}
            maxInputLength={30}
            disabled={isDeletingDialogOpen || isEditMode}
          />
          <YStack flex={1} gap={"$2"}>
            <XStack height={45} gap={"$2"}>
              <FloatingLabelInputOnly
                flexible
                value={workTimeValue}
                onChangeText={setWorkTimeValue}
                placeholder="Work Time (min)"
                bgColor={bg}
                inputMode="numeric"
                inputHeight={40}
                maxInputLength={3}
                disabled={isDeletingDialogOpen}
              />
              <Button
                onPress={() =>
                  handlePlusMinus(workTimeValue, false, handleWorkTimeChange)
                }
                height={40}
              >
                <Minus size={15} />
              </Button>
              <Button
                onPress={() =>
                  handlePlusMinus(workTimeValue, true, handleWorkTimeChange)
                }
                height={40}
              >
                <Plus size={15} />
              </Button>
            </XStack>
            <XStack gap={"$2"}>
              <FloatingLabelInputOnly
                flexible
                value={breakTimeValue}
                onChangeText={setBreakTimeValue}
                placeholder="Break Time (min)"
                bgColor={bg}
                inputMode="numeric"
                inputHeight={40}
                maxInputLength={3}
                disabled={isDeletingDialogOpen}
              />
              <Button
                onPress={() =>
                  handlePlusMinus(breakTimeValue, false, handleBreakTimeChange)
                }
                height={40}
              >
                <Minus size={15} />
              </Button>
              <Button
                onPress={() =>
                  handlePlusMinus(breakTimeValue, true, handleBreakTimeChange)
                }
                height={40}
              >
                <Plus size={15} />
              </Button>
            </XStack>
            <XStack alignItems="center" gap={"$3"}>
              {isEditMode && (
                <Button onPress={cancelEditMode} flexGrow={1}>
                  {"Cancel Edit"}
                </Button>
              )}
              <Button
                flexGrow={1}
                onPress={saveOption}
                disabled={disabledAddButton}
                backgroundColor={
                  disabledAddButton ? "$buttonBgDisabled" : "$buttonBg"
                }
              >
                {isEditMode ? "Save Changes" : "Add Timer Option"}
              </Button>
            </XStack>
            {isEditMode && (
              <Text my={3} textAlign="center" color="orange">
                To delete an option, long press on it
              </Text>
            )}
            {timerOptionsFiltered?.length >= 10 && !isEditMode && (
              <Text my={3} textAlign="center" color="red">
                Maximum of 10 timer options reached. Please delete an option to
                add a new one.
              </Text>
            )}
          </YStack>
        </Stack>

        <Stack borderRadius={10} bg="$backgroundOverlay" height={"60%"}>
          <Text m={6} textAlign="right">
            Total Options: {timerOptionsFiltered?.length}
          </Text>
          <FlashList
            data={timerOptionsFiltered}
            renderItem={({ item, index }) => renderItem(item, index)}
            keyExtractor={(item) => item?.key}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />

          {showArrow && (
            <YStack
              position="absolute"
              bottom={5}
              left="50%"
              zIndex={10}
              transform={[{ translateX: -12.5 }]}
              opacity={0.6}
            >
              <ArrowDown size={25} />
            </YStack>
          )}
        </Stack>
      </Stack>
      <OutsidePressHandler
        zIndex={4000}
        disabled={!isDeletingDialogOpen}
        onPressOutside={() => setIsDeletingDialogOpen(false)}
        backgroundColor="rgba(0,0,0,0.6)"
      >
        <CustomDialog
          open={isDeletingDialogOpen}
          onOpenChange={setIsDeletingDialogOpen}
          onPress={handleDeleteOption}
          trigger={false}
          type="error"
          header="Delete Timer Option"
          width={"75%"}
          description={`Are you sure you want to delete the timer option "${deletingOption?.label}" ?`}
        />
      </OutsidePressHandler>
    </React.Fragment>
  );
};

export default TimerOptionsForm;
