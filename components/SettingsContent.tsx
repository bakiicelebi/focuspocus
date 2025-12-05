import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { View, Text } from "tamagui";

const SettingsContent = () => {
  const params = useLocalSearchParams();

  const keyRef = useRef(0);

  useEffect(() => {
    if (params?.key && params.key !== keyRef?.current?.toString()) {
      keyRef.current = Number(params?.key);
      // Add new option logic here
    }
  }, [params?.key]);

  console.log("SettingsContent params:", params);

  return (
    <View flex={1} bg={"$background"}>
      <Text>SettingsContent</Text>
    </View>
  );
};

export default SettingsContent;
