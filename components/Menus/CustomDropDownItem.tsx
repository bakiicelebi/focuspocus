import React from "react";
import { XStack, View, Text } from "tamagui";

const CustomDropDownItem = ({
  selected = false,
  item,
  labelName = "label",
}: {
  selected?: boolean;
  labelName?: string;
  item?: any;
}) => {
  return (
    <XStack
      flex={1}
      alignItems="center"
      gap="$2"
      px={"$3"}
      bg={selected ? "$menuSelected" : "transparent"}
    >
      {item?.icon && <item.icon size={"$iconSizeSmall"} color="$iconBorder" />}
      <Text fontSize={"$6"}>{item[labelName]}</Text>
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
