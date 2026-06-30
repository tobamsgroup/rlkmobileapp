import { ICONS } from '@/assets/icons';
import { scaleHeight } from '@/utils/scale';
import React, { FC, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { twMerge } from 'tailwind-merge';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DROPDOWN_MAX_HEIGHT = 300;
const BUTTON_RADIUS = 9999;
const DROPDOWN_RADIUS = 12;

type SelectProps = {
  placeholder?: string;
  onChange?: (v: string) => void;
  className?: string;
  label?: string;
  containerClassname?: string;
  wrapperClassname?: string;
  options: string[];
  value?: string;
  error?: string;
};

type DropdownLayout = {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  openUpward: boolean;
};

const Select: FC<SelectProps> = ({
  placeholder,
  onChange,
  className,
  label,
  containerClassname,
  options,
  value: inputValue,
  wrapperClassname,
  error,
}) => {
  const [value, setValue] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [layout, setLayout] = useState<DropdownLayout | null>(null);
  const selectRef = useRef<View>(null);

  const handleOpen = () => {
    selectRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      const spaceBelow = SCREEN_HEIGHT - pageY - height;
      const spaceAbove = pageY;
      const openUpward =
        spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow;

      setLayout({
        left: pageX,
        width,
        openUpward,
        ...(openUpward
          ? { bottom: SCREEN_HEIGHT - pageY }
          : { top: pageY + height }),
      });
      setOpenModal(true);
    });
  };

  const handleClose = () => setOpenModal(false);

  const handleSelect = (option: string) => {
    onChange?.(option);
    setValue(option);
    handleClose();
  };

  // Border radius for the trigger button when open
  const buttonStyle = openModal && layout
    ? {
        borderTopLeftRadius: BUTTON_RADIUS,
        borderTopRightRadius: BUTTON_RADIUS,
        borderBottomLeftRadius: layout.openUpward ? BUTTON_RADIUS : 0,
        borderBottomRightRadius: layout.openUpward ? BUTTON_RADIUS : 0,
      }
    : { borderRadius: BUTTON_RADIUS };

  // Border radius for the dropdown
  const dropdownStyle = layout
    ? {
        borderTopLeftRadius: layout.openUpward ? DROPDOWN_RADIUS : 0,
        borderTopRightRadius: layout.openUpward ? DROPDOWN_RADIUS : 0,
        borderBottomLeftRadius: layout.openUpward ? 0 : DROPDOWN_RADIUS,
        borderBottomRightRadius: layout.openUpward ? 0 : DROPDOWN_RADIUS,
      }
    : {};

  return (
    <View className={twMerge('relative', wrapperClassname)}>
      {label && (
        <Text className="mb-3 font-normal text-dark font-sans text-[16px] lg:text-[18px]">
          {label}
        </Text>
      )}
      <View ref={selectRef}>
        <Pressable
          onPress={handleOpen}
          style={[{ height: scaleHeight(48) }]}
          className={`w-full bg-transparent border rounded-full border-[#D3D2D3] flex flex-row items-center justify-between px-6 ${containerClassname}`}
        >
          <Text
            className="flex-1 text-[16px] text-dark font-sans"
            numberOfLines={1}
          >
            {value || inputValue || placeholder || 'Select'}
          </Text>
          <ICONS.ChevronDown />
        </Pressable>
      </View>
      {error && (
        <View className="flex-row gap-1 mt-1">
          <ICONS.InformationCircle />
          <Text className="text-[#DE2121] font-sans">{error}</Text>
        </View>
      )}

      <Modal
        visible={openModal}
        transparent
        animationType="none"
        onRequestClose={handleClose}
      >
        <Pressable style={{ flex: 1 }} onPress={handleClose}>
          {layout && (
            <Pressable
              onPress={(e) => e.stopPropagation()}
              className='shadow-lg'
              style={[
                {
                  position: 'absolute',
                  left: layout.left,
                  width: layout.width,
                  maxHeight: DROPDOWN_MAX_HEIGHT,
                  backgroundColor: 'white',
                  padding: 20,
                  paddingVertical: 24,
              
                },
                layout.top !== undefined ? { top: layout.top } : { bottom: layout.bottom },
                dropdownStyle,
              ]}
            >
              <ScrollView>
                {options?.map((o, i) => (
                  <Pressable
                    onPress={() => handleSelect(o)}
                    className={twMerge(
                      'border-b-[0.5px] border-[#D3D2D366] py-5 rounded-[8px]',
                      i + 1 === options.length && 'border-b-0',
                    )}
                    key={i}
                  >
                    <Text className="font-sans text-[16px] text-dark">{o}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </Pressable>
          )}
        </Pressable>
      </Modal>
    </View>
  );
};

export default Select;
