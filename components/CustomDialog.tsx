import { X } from "@tamagui/lucide-icons";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Animated } from "react-native";
import {
  Button,
  Dialog,
  Unspaced,
  XStack,
  Text,
  GetThemeValueForKey,
  ThemeName,
  ButtonProps,
} from "tamagui";

export type DialogType = "normal" | "warn" | "error";

export interface DialogButton {
  label: string;
  onPress: () => void;
  theme?: ThemeName | null | undefined;
  bg?: GetThemeValueForKey<"backgroundColor"> | undefined;
  buttonText?: GetThemeValueForKey<"color"> | undefined;
  props?: ButtonProps;
}

export interface CustomDialogRef {
  toggle: (open: boolean) => void;
}

export interface CustomDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: boolean;
  header?: string;
  description?: string;
  description2?: string;
  type?: DialogType;
  buttons?: DialogButton[];
  width?:
    | number
    | Animated.AnimatedNode
    | GetThemeValueForKey<"width">
    | null
    | undefined;
  top?: GetThemeValueForKey<"top"> | null | undefined;
  minWidth?: number;
  minHeight?: GetThemeValueForKey<"minHeight"> | number | undefined;
  onPress?: () => void;
  description1FontSize?: GetThemeValueForKey<"fontSize"> | undefined;
  description2FontSize?: GetThemeValueForKey<"fontSize"> | undefined;
  headerFontSize?: GetThemeValueForKey<"fontSize"> | undefined;
  triggerProps?: ButtonProps;
  children?: React.ReactNode;
  triggerIcon?: React.ReactNode;
  triggerHeader?: string;
  headerIcon?: React.ReactNode;
  height?: GetThemeValueForKey<"height"> | number | undefined;
}

export const dialogColors: Record<
  DialogType,
  {
    background: GetThemeValueForKey<"backgroundColor"> | undefined;
    header: GetThemeValueForKey<"color"> | undefined;
    fontColor: GetThemeValueForKey<"color"> | undefined;
    buttonBg?: GetThemeValueForKey<"backgroundColor"> | undefined;
    buttonText: GetThemeValueForKey<"color"> | undefined;
  }
> = {
  normal: {
    background: "$background",
    header: "$color",
    fontColor: "$color",
    buttonBg: "$cardBg",
    buttonText: "$color",
  },
  warn: {
    background: "$warningBackground",
    header: "$warningYellow",
    fontColor: "$color",
    buttonBg: "$warningYellow",
    buttonText: "white",
  },
  error: {
    background: "$errorBackground",
    header: "$errorRed",
    fontColor: "$color",
    buttonBg: "$errorRed",
    buttonText: "white",
  },
};

export const getDefaultButtons = (
  onPress: any,
  type: DialogType
): DialogButton[] => [
  {
    label: "Cancel",
    onPress: () => {},
    bg: dialogColors[type].buttonBg,
    buttonText: dialogColors[type].buttonText,
  },
  {
    label: "OK",
    onPress: () => {
      onPress();
    },
    bg: dialogColors[type].buttonBg,
    buttonText: dialogColors[type].buttonText,
  },
];

const CustomDialog = (
  {
    open,
    onOpenChange,
    trigger = true,
    header,
    description,
    description2,
    type = "normal",
    buttons = [],
    width,
    minWidth = 300,
    minHeight = 150,
    height,
    headerFontSize = "$8",
    description1FontSize = "$6",
    description2FontSize = "$6",
    onPress = () => {},
    triggerProps,
    children = null,
    top,
    triggerIcon,
    triggerHeader = header,
    headerIcon,
  }: CustomDialogProps,
  ref: React.Ref<CustomDialogRef>
) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;

  const currentOpen = isControlled ? open : internalOpen;
  const setCurrentOpen = (val: boolean) => {
    if (isControlled) onOpenChange!(val);
    else setInternalOpen(val);
  };

  const colors = dialogColors[type];

  const buttonsToUse =
    buttons.length > 0 ? buttons : getDefaultButtons(onPress, type);

  useImperativeHandle(ref, () => ({
    toggle: (open: boolean) => {
      setCurrentOpen(open);
    },
  }));

  return (
    <Dialog open={currentOpen} onOpenChange={setCurrentOpen}>
      {trigger && (
        <Dialog.Trigger asChild>
          <Button minW={0} {...triggerProps}>
            <XStack alignItems="center" gap={triggerHeader ? "$2" : 0}>
              {triggerIcon && <>{triggerIcon}</>}
              {triggerHeader && (
                <Text fontSize={triggerProps?.fontSize}>{triggerHeader}</Text>
              )}
            </XStack>
          </Button>
        </Dialog.Trigger>
      )}

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          backgroundColor="$shadow6"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          onPress={() => setCurrentOpen(false)}
        />

        <Dialog.FocusScope focusOnIdle>
          <Dialog.Content
            bordered
            elevate
            borderRadius="$6"
            key="content"
            width={(width as any) || "auto"}
            height={height}
            minWidth={minWidth}
            minHeight={minHeight}
            gap="$4"
            top={top}
          >
            {/* Close Button */}
            <Unspaced>
              <Dialog.Close asChild>
                <Button
                  position="absolute"
                  hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                  top="$2"
                  right="$2"
                  size="$3"
                  circular
                  icon={X}
                  aria-label="Close"
                />
              </Dialog.Close>
            </Unspaced>

            <XStack alignItems="center" gap="$2" mb="$2">
              {headerIcon && <>{headerIcon}</>}

              {/* Header */}
              <Text
                fontWeight="700"
                color={colors.header}
                fontSize={headerFontSize}
              >
                {header}
              </Text>
            </XStack>

            {/* Descriptions */}
            {description && (
              <Text color={colors.fontColor} fontSize={description1FontSize}>
                {description}
              </Text>
            )}
            {description2 && (
              <Text color={colors.fontColor} fontSize={description2FontSize}>
                {description2}
              </Text>
            )}

            {children}

            {/* Buttons */}
            {buttonsToUse.length > 0 && (
              <XStack justifyContent="flex-end" gap="$3" marginTop="$5">
                {buttonsToUse.map((btn, idx) => (
                  <Button
                    key={idx}
                    theme={btn.theme}
                    flex={1}
                    bg={btn.bg || "$cardBg"}
                    onPress={() => {
                      btn.onPress();
                      setCurrentOpen(false);
                    }}
                    pressStyle={{
                      opacity: 0.9,
                      scale: 0.97,
                      bg: btn.bg || "$cardBg",
                    }}
                    {...btn.props}
                  >
                    <Button.Text
                      fontWeight={"bold"}
                      color={btn.buttonText || "$color"}
                    >
                      {btn.label}
                    </Button.Text>
                  </Button>
                ))}
              </XStack>
            )}
          </Dialog.Content>
        </Dialog.FocusScope>
      </Dialog.Portal>
    </Dialog>
  );
};

export default forwardRef(CustomDialog);
