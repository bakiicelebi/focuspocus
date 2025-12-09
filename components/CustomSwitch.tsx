import { View, Text, Switch } from "tamagui";
import React from "react";

const CustomSwitch = ({ state, setState }) => {
  return (
    <Switch
      checked={state}
      onCheckedChange={(checked) => {
        setState(checked);
      }}
    >
      <Switch.Thumb
        bg={!state ? "$timerWorkInactiveColor" : "$timerWorkEndColor"}
        animation="bouncy"
      />
    </Switch>
  );
};

export default CustomSwitch;
