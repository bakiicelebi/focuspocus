import { useThemeMode } from "contexts/ThemeContext";
import React from "react";
import { XStack, View, Text } from "tamagui";

const CustomDropDownItem = ({
  selected = false,
  item,
  labelName = "label",
  colorScheme,
}: {
  selected?: boolean;
  labelName?: string;
  item?: any;
  colorScheme?: "light" | "dark";
}) => {
  const { effectiveScheme } = useThemeMode();
  const color = colorScheme
    ? colorScheme === "dark"
      ? "white"
      : "black"
    : effectiveScheme === "dark"
    ? "white"
    : "black";

  return (
    <XStack
      flex={1}
      alignItems="center"
      gap="$2"
      px={"$3"}
      bg={selected ? "$menuSelected" : "transparent"}
    >
      {item?.icon && <item.icon size={"$iconSizeSmall"} color="$iconBorder" />}
      <Text fontSize={"$6"} color={color}>
        {item[labelName]}
      </Text>
    </XStack>
  );
};

export default React.memo(CustomDropDownItem, (prevProps, nextProps) => {
  return (
    prevProps.selected === nextProps.selected &&
    prevProps.item === nextProps.item &&
    prevProps.labelName === nextProps.labelName
  );
});
