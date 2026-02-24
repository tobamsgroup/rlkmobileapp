import { scaleHeight } from '@/utils/scale';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
  ViewStyle,
} from 'react-native';
import { twMerge } from 'tailwind-merge';

type Props = {
  text?: string;
  textClassname?: string;
  loading?: boolean;
  haptic?: boolean;
  disabled?: boolean;
  linearStyle?: ViewStyle;
};

const Button = ({ children, ...props }: Props & PressableProps) => {
  return (
    <Pressable
      style={{ paddingVertical: scaleHeight(14.5) }}
      {...props}
      onPress={(e) => {
        props?.onPress?.(e);
        if (props?.haptic) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        }
      }}
      className={twMerge(
        ' flex-row items-center justify-center bg-[#3F9243] rounded-full border-b-2 border-b-[#337535]',
        props.className,
        props?.disabled && 'bg-[#D3D2D3] border-b-[#918E91]',
      )}
    >
      {props?.loading ? (
        <ActivityIndicator color={'white'} size={'small'} />
      ) : (
        <>
          {children ? (
            children
          ) : (
            <Text
              className={twMerge(
                'text-[16px] text-white font-sansMedium',
                props.textClassname,
                props?.disabled && 'text-dark',
              )}
            >
              {props.text}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
};

export const SecondaryButton = ({
  children,
  linearStyle,
  ...props
}: Props & PressableProps) => {
  return (
    <Pressable
      {...props}
      onPress={(e) => {
        props?.onPress?.(e);
        if (props?.haptic) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        }
      }}
      className={twMerge('w-full', props.className)}
    >
      <LinearGradient
        colors={['#FFEB80', '#FFF7CC']}
        className="rounded-xl"
        start={{ x: 1, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={[
          {
            shadowColor: '#D5B300',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 3,
            paddingVertical: scaleHeight(14.5),
            paddingHorizontal: scaleHeight(14.5),
            borderRadius: 100000,
            borderBottomWidth: 3,
            borderWidth: 1,
            borderColor: '#FFF7CC',
            borderBottomColor: '#D5B300',
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center',
            ...(linearStyle || {}),

          },
        ]}
      >
        {props?.loading ? (
          <ActivityIndicator color={'white'} size={'small'} />
        ) : (
          <>
            {children ? (
              children
            ) : (
              <Text
                className={twMerge(
                  'text-[16px] text-[#806C00] font-sansMedium',
                  props.textClassname,
                  props?.disabled && 'text-dark',
                )}
              >
                {props.text}
              </Text>
            )}
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
};

export default Button;
