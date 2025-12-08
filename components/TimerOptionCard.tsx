import { View, Text, YStack, XStack, Separator } from "tamagui";
import { TimerOption } from "contexts/TimerContext";
import { Clock, ClockFading, Pen, PenSquare } from "@tamagui/lucide-icons";

const formatMinutes = (value?: number) => {
  if (value === undefined || value === null) return "";

  if (value < 1) {
    const seconds = Math.round(value * 60);
    return `${seconds} sec`;
  }

  return Number.isInteger(value) ? `${value} min` : `${value.toFixed(1)} min`;
};

const TimerOptionCard = ({
  item,
  index,
}: {
  item: TimerOption;
  index: number;
}) => {
  return (
    <XStack
      padding={5}
      margin={5}
      borderWidth={1}
      borderRadius={8}
      borderColor="$borderColor"
      bg="$cardBg"
      alignItems="center"
    >
      <Text ml={5} flex={1} fontSize={16} fontWeight="600">
        <Text fontWeight={"900"}>{index + 1}.</Text> {item.label}
      </Text>

      <XStack alignItems="center">
        {item?.editable && <PenSquare mr={5} size={16} />}
        <YStack width={120} gap="$2" alignItems="center">
          <XStack gap={"$2"}>
            <Clock size={16} />
            <Text>Work: {formatMinutes(item?.workTimeInMinutes)}</Text>
          </XStack>
          <Separator borderColor={"gray"} width={"80%"} />
          <XStack gap={"$2"}>
            <ClockFading size={16} />
            <Text>Break: {formatMinutes(item?.breakTimeInMinutes)}</Text>
          </XStack>
        </YStack>
      </XStack>
    </XStack>
  );
};

export default TimerOptionCard;
