import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, InputModeOptions, Keyboard } from "react-native";
import {
  getToken,
  Input,
  SizeTokens,
  Text,
  useTheme,
  View,
  YStack,
} from "tamagui";
import OutsidePressHandler from "components/Menus/OutsidePressHelper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type MaterialCommunityIconName = keyof typeof MaterialCommunityIcons.glyphMap;

type Props = {
  value: string;
  onChangeText: (val: string) => void;
  placeholder: string;
  ref?: React.Ref<any>;
  bgColor?: string;
  secureTextEntry?: boolean;
  rules?: Object; // Opsiyonel, hook-form yok ama ihtiyaç olabilir
  error?: any;
  inputHeight?: number;
  animationDuration?: number;
  errorColor?: string;
  activeColor?: string;
  baseFontSize?: number;
  borderUnstyledColor?: string;
  fontUnstyledColor?: string;
  selectTextOnFocus?: boolean;
  inputMode?: InputModeOptions | undefined;
  onSubmitEditing?: () => void;
  zIndex?: number;
  maxInputLength?: number;
  flexible?: boolean;
  autoCapitalize?: boolean;
  visibleIcon?: boolean;
  visibleIconPosition?: "left" | "right";
  iconSize?: number | SizeTokens | undefined;
  onIconPress?: () => void;
  iconName?: MaterialCommunityIconName;
  debounceCheck?: (value: string) => void; // field yok artık
  disabled?: boolean;
};

export const FloatingLabelInputOnly = ({
  value,
  onChangeText,
  ref,
  placeholder,
  secureTextEntry,
  bgColor = "#fff",
  error,
  inputHeight = 50,
  animationDuration = 100,
  errorColor,
  activeColor,
  baseFontSize = 16,
  borderUnstyledColor = "$iconBorder",
  fontUnstyledColor = "#999",
  selectTextOnFocus = false,
  inputMode = "text",
  onSubmitEditing,
  zIndex = 1200,
  maxInputLength = 50,
  flexible = false,
  autoCapitalize = false,
  visibleIcon = false,
  visibleIconPosition = "right",
  iconSize = 24,
  onIconPress = () => {},
  iconName = "eye-off",
  debounceCheck,
  disabled = false,
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const themes = useTheme();
  const insideActiveColor = activeColor ?? themes.infoText.val;
  const insideErrorColor = errorColor ?? themes.errorRed.val;
  const iconSizeVal =
    typeof iconSize === "string" ? getToken(iconSize as any) : iconSize;
  const colorVal = themes.borderColor.val;

  const borderColor = error
    ? insideErrorColor
    : isFocused
    ? insideActiveColor
    : borderUnstyledColor;

  const fontColor = error
    ? insideErrorColor
    : isFocused
    ? insideActiveColor
    : fontUnstyledColor;

  const animateLabel = (toValue: number) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: animationDuration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const labelStyle = {
    position: "absolute" as const,
    left: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 10],
    }),
    backgroundColor: bgColor,
    paddingHorizontal: 8,
    zIndex: zIndex + 1,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [inputHeight / 2 - baseFontSize / 2, -6],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [baseFontSize, 14],
    }),
    color: fontColor,
  };

  const maxLength =
    placeholder.toLowerCase() === "phone"
      ? value?.length === 19
        ? 19
        : maxInputLength + 10
      : maxInputLength;

  useEffect(() => {
    if (value || isFocused) {
      animateLabel(1);
    } else {
      animateLabel(0);
    }
  }, [value, isFocused]);

  const formatText = (text: string) => {
    let t = text;
    debounceCheck?.(t);
    return t;
  };

  return (
    <OutsidePressHandler
      onPressOutside={() => {
        if (isFocused) {
          Keyboard.dismiss();
          setIsFocused(false);
        }
      }}
      zIndex={zIndex - 1}
      disabled={!isFocused}
    >
      <YStack flex={flexible ? 1 : undefined} marginBottom="$3">
        <Animated.Text style={labelStyle} pointerEvents="none">
          {placeholder}
        </Animated.Text>

        <Input
          ref={ref}
          inputMode={inputMode}
          disabled={disabled}
          borderColor={(borderColor as any) || "$iconBorder"}
          backgroundColor={(bgColor as any) || "$background"}
          height={inputHeight}
          zIndex={zIndex}
          fontSize={baseFontSize}
          value={value}
          onChangeText={(text) => onChangeText(formatText(text))}
          onBlur={() => setIsFocused(false)}
          caretHidden={!isFocused}
          onFocus={() => setIsFocused(true)}
          autoCapitalize={autoCapitalize ? "words" : "none"}
          secureTextEntry={secureTextEntry}
          selectTextOnFocus={selectTextOnFocus}
          onSubmitEditing={onSubmitEditing}
          maxLength={maxLength}
        />

        {visibleIcon && (
          <View
            position="absolute"
            padding={10}
            zIndex={zIndex + 4}
            {...(visibleIconPosition === "right" ? { right: 3 } : { left: 3 })}
            top={inputHeight / 2 - iconSizeVal / 2 - 10}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={onIconPress}
          >
            <MaterialCommunityIcons
              name={iconName}
              size={iconSizeVal}
              color={colorVal}
            />
          </View>
        )}

        {error && (
          <Text
            fontWeight={"500"}
            color={(insideErrorColor as any) || "#ce0808ff"}
            paddingLeft={8}
            mt={3}
          >
            * {error}
          </Text>
        )}
      </YStack>
    </OutsidePressHandler>
  );
};
