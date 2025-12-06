import {
  View,
  YStack,
  XStack,
  AnimatePresence,
  Text,
  getToken,
  Input,
  useTheme,
  ScrollView,
} from "tamagui";
import React, { forwardRef } from "react";
import OutsidePressHandler from "./OutsidePressHelper";
import { ChevronDown, X } from "@tamagui/lucide-icons";
import { getTokenValueFromProp } from "../../utils/theme/getNumericValue";
import CustomDropDownItem from "./CustomDropDownItem";
import { ShadowProps } from "../../constants/ShadowProps";
import { useDebounce } from "../../hooks/useDebounce";

export interface CustomDropDownProps {
  items: any[];
  selectedItem?: any; // single select
  selectedItems?: any[]; // multi select
  onSelect: (key: any) => void;
  keyName?: string;
  labelName?: string;
  height?: number | string;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  zIndex?: number;
  style?: React.CSSProperties;
  bg?: string;
  menuBorderRadius?: number | string;
  multiSelect?: boolean;
  selectHeader?: string; // header text for multi-select dropdown
  autoComplete?: boolean;
  selectedOnTop?: boolean;
  clearWithButton?: boolean;
  disabled?: boolean;
  deselectable?: boolean;
}

export interface CustomDropDownRef {
  toggle: (open: boolean) => void;
}

const CustomDropDown = (
  {
    items,
    selectedItem,
    selectedItems = [], // multiSelect
    onSelect,
    keyName = "key",
    labelName = "label",
    height = "$listDropdownMenuHeight",
    width = "$listDropdownMenuMinWidth",
    minWidth = "$listDropdownMenuMinWidth",
    maxWidth,
    zIndex = 1000,
    bg = "$cardBg",
    menuBorderRadius = "$menuBorderRadius",
    style = {},
    multiSelect = false,
    selectHeader = "Select an option",
    autoComplete = false,
    selectedOnTop = false,
    clearWithButton = false,
    disabled = false,
    deselectable = true,
  }: CustomDropDownProps,
  ref: React.Ref<CustomDropDownRef>
) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState(
    selectedItem?.[labelName] || ""
  );
  const { debouncedValue: debouncedSearchTerm } = useDebounce(searchTerm, 400);
  const [filteredItems, setFilteredItems] = React.useState(items);

  const inputRef = React.useRef<Input>(null);
  const scrollRef = React.useRef<ScrollView>(null);

  const theme = useTheme();

  const calculatedHeight = getTokenValueFromProp(height);
  const calculatedWidth = getTokenValueFromProp(width);
  const menuBorderRadiusValue = getTokenValueFromProp(menuBorderRadius);

  const maxVisibleItems = 4;
  const visibleItemsCount = Math.min(filteredItems.length, maxVisibleItems);
  const dropdownHeight = calculatedHeight * visibleItemsCount;

  const zIndexControlled = open ? zIndex : zIndex - 4;

  const backgroundColor = disabled
    ? theme.buttonBgDisabled.val
    : theme.cardBg.val;

  React.useEffect(() => {
    if (selectedItem && autoComplete) {
      setSearchTerm(selectedItem[labelName]);
    } else {
      setSearchTerm("");
    }
  }, [selectedItem, autoComplete]);

  React.useEffect(() => {
    if (!open || !selectedOnTop) return;

    let newItems = items;

    if (multiSelect && selectedItems.length > 0) {
      const selectedSet = new Set(selectedItems.map((sel) => sel[keyName]));
      const selected = items.filter((item) => selectedSet.has(item[keyName]));
      const notSelected = items.filter(
        (item) => !selectedSet.has(item[keyName])
      );
      newItems = [...selected, ...notSelected];
    } else if (!multiSelect && selectedItem) {
      const selected = items.filter(
        (item) => item[keyName] === selectedItem[keyName]
      );
      const notSelected = items.filter(
        (item) => item[keyName] !== selectedItem[keyName]
      );
      newItems = [...selected, ...notSelected];
    }

    setFilteredItems(newItems);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [open]);

  React.useEffect(() => {
    if (!debouncedSearchTerm || !autoComplete) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        item[labelName]
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [debouncedSearchTerm, items]);

  const handleSelect = (item: any) => {
    if (multiSelect) {
      const alreadySelected = selectedItems.some(
        (sel) => sel[keyName] === item[keyName]
      );
      let newSelection;
      if (alreadySelected) {
        newSelection = selectedItems.filter(
          (sel) => sel[keyName] !== item[keyName]
        );
      } else {
        newSelection = [...selectedItems, item];
      }
      onSelect(newSelection);
    } else {
      onSelect(item);
      if (deselectable && selectedItem?.[keyName] === item[keyName]) {
        onSelect(undefined);
      }
    }

    if (!multiSelect) {
      setOpen(false);
    }
  };

  const handleTextChange = (text: string) => {
    setSearchTerm(text);
  };

  return (
    <View
      height={calculatedHeight}
      width={calculatedWidth}
      minWidth={minWidth as any}
      maxWidth={maxWidth ? (maxWidth as any) : "100%"}
      bg={backgroundColor as any}
      style={{ ...style }}
      onPress={() => {
        if (disabled) return;
        setOpen(!open);
      }}
      justify={"center"}
      borderTopRightRadius={menuBorderRadiusValue as any}
      borderTopLeftRadius={menuBorderRadiusValue as any}
      borderBottomRightRadius={open ? 0 : (menuBorderRadiusValue as any)}
      borderBottomLeftRadius={open ? 0 : (menuBorderRadiusValue as any)}
      zIndex={zIndexControlled}
      {...(ShadowProps.small as any)}
    >
      <XStack
        alignItems="center"
        position="relative"
        justify={"space-between"}
        pr="$2"
        onPress={() => {
          if (disabled) return;
          setOpen(!open);
          inputRef.current?.focus();
        }}
        disabled={disabled}
      >
        {autoComplete ? (
          <>
            <Input
              disabled={disabled}
              value={searchTerm}
              onChangeText={handleTextChange}
              onFocus={() => setOpen(true)}
              ref={inputRef}
              height={height as any}
              borderTopRightRadius={0}
              borderBottomRightRadius={0}
              borderBottomLeftRadius={open ? 0 : (menuBorderRadiusValue as any)}
              flex={1}
              placeholder={selectHeader || "Search..."}
              selectTextOnFocus
              placeholderTextColor={theme?.placeholderTextColor}
              style={{
                fontSize: 16,
              }}
            />
          </>
        ) : (
          <>
            {multiSelect ? (
              <InputHeader selectHeader={selectHeader} />
            ) : selectedItem ? (
              <CustomDropDownItem item={selectedItem} />
            ) : (
              <InputHeader selectHeader={selectHeader} />
            )}
          </>
        )}
        {(selectedItem || selectedItems?.length > 0) &&
          clearWithButton &&
          autoComplete && (
            <View
              onPress={() => {
                setSearchTerm("");
                onSelect(undefined);
              }}
              pl={"$2"}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={25} />
            </View>
          )}
        <YStack
          animation="tooltip"
          animateOnly={["transform"]}
          rotate={open ? "-180deg" : "0deg"}
          transition="rotate 200ms"
          ml={"$2"}
        >
          <ChevronDown size={25} />
        </YStack>
      </XStack>

      <OutsidePressHandler
        onPressOutside={() => {
          if (inputRef.current?.isFocused()) {
            inputRef.current.blur();
          }
          setOpen(false);
        }}
        zIndex={zIndexControlled - 1}
        disabled={!open}
        backgroundColor="#0c0c0c3d"
      >
        <View
          position="absolute"
          height={dropdownHeight + 5}
          width={"100%"}
          top={calculatedHeight}
          zIndex={zIndexControlled}
          pointerEvents="box-none"
          bg={open ? "$cardBg" : "transparent"}
          borderBottomEndRadius={menuBorderRadiusValue as any}
          borderBottomStartRadius={menuBorderRadiusValue as any}
        >
          <ScrollView
            ref={scrollRef}
            style={{
              height: dropdownHeight,
              borderBottomEndRadius: menuBorderRadiusValue as any,
              borderBottomStartRadius: menuBorderRadiusValue as any,
              pointerEvents: open ? "auto" : "none",
            }}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            <AnimatePresence>
              {open && (
                <YStack
                  animation={open ? "medium" : "medium"}
                  enterStyle={{
                    y: -dropdownHeight,
                    opacity: 0,
                  }}
                  exitStyle={{
                    opacity: 0,
                    y: -dropdownHeight,
                  }}
                  animateOnly={["transform", "opacity"]}
                  zIndex={zIndexControlled + 1}
                  position="relative"
                  backgroundColor="$cardBg"
                  borderBottomEndRadius={menuBorderRadius as any}
                  borderBottomStartRadius={menuBorderRadius as any}
                  width={"100%"}
                >
                  {filteredItems && filteredItems.length > 0 ? (
                    filteredItems.map((item: any) => {
                      const isSelected = multiSelect
                        ? selectedItems?.some(
                            (sel) => sel[keyName] === item[keyName]
                          )
                        : selectedItem?.[keyName] === item[keyName];

                      return (
                        <View
                          key={item[keyName]}
                          height={calculatedHeight}
                          onPress={() => handleSelect(item)}
                        >
                          <CustomDropDownItem
                            selected={isSelected}
                            item={item}
                            labelName={labelName}
                          />
                        </View>
                      );
                    })
                  ) : (
                    <View
                      height={calculatedHeight}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text>No results found</Text>
                    </View>
                  )}
                </YStack>
              )}
            </AnimatePresence>
          </ScrollView>
        </View>
      </OutsidePressHandler>
    </View>
  );
};

const InputHeader = ({ selectHeader }) => {
  return (
    <Text flex={1} pl="$3" fontSize={16}>
      {selectHeader}
    </Text>
  );
};

export default forwardRef(CustomDropDown);
