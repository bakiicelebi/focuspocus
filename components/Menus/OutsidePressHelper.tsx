import { useEffect, useState } from "react";
import { Keyboard, Pressable, useWindowDimensions } from "react-native";

const OutsidePressHandler = ({
  autoDismiss = false,
  onPressOutside,
  children,
  zIndex = 999,
  disabled = false,
  backgroundColor = "transparent",
}) => {
  const size = useWindowDimensions();

  /** When keyboard is enable the touchable is enable */
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const active = autoDismiss ? isKeyboardVisible : !disabled;
  const conditionalZIndex = autoDismiss ? 0 : zIndex;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <>
      {active && (
        <Pressable
          style={{
            position: "absolute",
            top: size.height * -0.5,
            bottom: size.height * -0.5,
            left: size.width * -0.5,
            right: size.width * -0.5,
            zIndex: conditionalZIndex,
            width: size.width * 2,
            height: size.height * 2,
            backgroundColor: backgroundColor,
          }}
          onPress={onPressOutside}
          disabled={!active}
          pointerEvents="box-only"
        />
      )}
      {children}
    </>
  );
};

export default OutsidePressHandler;
