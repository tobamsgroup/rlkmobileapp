import { ICONS } from '@/assets/icons';
import Container from '@/components/Container';
import TopBackButton from '@/components/TopBackButton';
import { useReadSettings } from '@/context/ReadContext';
import { scaleHeight, scaleWidth } from '@/utils/scale';
import React, { useState } from 'react';
import { Image, Pressable, Switch, Text, View } from 'react-native';
import RangeSlider from 'react-native-sticky-range-slider';
import Svg, { Path } from 'react-native-svg';
import { twMerge } from 'tailwind-merge';

const ReadingSettings = () => {
  const [activeTooltip, setActiveTooltip] = useState('');
  const { readingSettings, saveSettings, updateReadingSettings } =
    useReadSettings();
  const [fontSize, setFontSize] = useState(readingSettings.fontSize);
  const [lineSpace, setLineSpace] = useState(readingSettings.lineSpace);
  const [highContrast, sethighContrast] = useState(
    readingSettings.highContrast,
  );
  const [dyslexia, setDyslexia] = useState(readingSettings.dyslexiaFriendly);

  const onSave = () => {
    updateReadingSettings({
      dyslexiaFriendly: dyslexia,
      lineSpace,
      highContrast,
      fontSize,
    });
    saveSettings();
  };

  return (
    <Container scrollable>
      {/* <TouchableWithoutFeedback onPress={() => setActiveTooltip('')}> */}
      <View className="p-6 flex-1">
        <TopBackButton />
        <View className="bg-white rounded-3xl p-6 mt-6">
          <Text className="text-[18px] font-sansSemiBold text-dark leading-[1.5]">
            Reading Settings
          </Text>
          <Text className="text-[16px] leading-[1.5] text-[#474348] font-sans mt-2">
            Make your reading more{'\n'}comfortable.
          </Text>

          <View className="border-t border-t-[#D3D2D366] mt-6" />
          <View className="mt-6 border border-[#C3E4C5] rounded-[16px] p-4 bg-[#F1F9F1] ">
            <Text className="font-sansSemiBold leading-[1.5] text-dark mb-3 text-[18px]">
              Preview
            </Text>

            <View
              className={twMerge(
                'bg-white rounded-2xl p-5 border border-[#D3D2D366]',
                highContrast && 'bg-[#FEFAEE]',
              )}
            >
              <Text
                style={{
                  fontSize: fontSize.header,
                }}
                className="font-sansSemiBold text-[16px] text-dark mb-4 leading-[1.5]"
              >
                Welcome to the Adventure!
              </Text>

              <Image
                source={{
                  uri: 'https://picsum.photos/600/300',
                }}
                className="w-full  mb-3"
                style={{ height: scaleHeight(120) }}
                resizeMode="cover"
              />

              <Text
                style={{
                  lineHeight: lineSpace,
                  fontSize: fontSize.body,
                }}
                className={twMerge(
                  `text-dark font-sans leading-[1.5] `,
                  dyslexia && 'font-lexend',
                )}
              >
                Hey there, future Eco Explorer! Are you ready to start an
                amazing journey to discover the wonders of our planet? Imagine
                you’re about to go on the most exciting treasure hunt ever.
              </Text>
            </View>
          </View>

          {/* Font Size */}
          <View className="mt-6 border border-[#C3E4C5] rounded-[16px] border-b-4 p-4 bg-white ">
            <Text className="text-[18px]  font-sansMedium text-dark leading-[1.5]">
              Choose Font Size
            </Text>
            <Text className="font-sansItalic text-[#474348] leading-[1.5] mt-2 mb-4">
              Make the words bigger or smaller so they’re easy to read.
            </Text>

            <View className="bg-white rounded-2xl p-4 border border-[#D3D2D366]">
              <View className="flex-row items-center justify-between">
                <Pressable
                  onPress={() =>
                    setFontSize((s) => {
                      return {
                        body: s.body - 2,
                        header: s.header - 2,
                      };
                    })
                  }
                  className=" rounded-full "
                >
                  <ICONS.AMinus />
                </Pressable>

                <RangeSlider
                  className="flex-1"
                  min={10}
                  max={50}
                  step={1}
                  low={fontSize.body}
                  renderHighValue={(value) => null}
                  renderLowValue={(value) => null}
                  onValueChanged={(low) =>
                    setFontSize((s) => {
                      return {
                        body: low,
                        header: low + 2,
                      };
                    })
                  }
                  renderThumb={(type) => (
                    <View
                      style={{
                        width: scaleWidth(24),
                        height: scaleWidth(24),
                      }}
                      className="rounded-full bg-[#DBEFDC]"
                    />
                  )}
                  renderRail={() => (
                    <View className="h-2.5 bg-[#D3D2D366] flex-1 rounded-tr-[16px] rounded-br-[16px]" />
                  )}
                  renderRailSelected={() => (
                    <View className="bg-[#3F9243] h-2.5 flex-1 rounded-tl-[16px] rounded-bl-[16px]" />
                  )}
                  disableRange
                />

                <Pressable
                  onPress={() =>
                    setFontSize((s) => {
                      return {
                        body: s.body + 2,
                        header: s.header + 2,
                      };
                    })
                  }
                  className="rounded-full "
                >
                  <ICONS.APlus />
                </Pressable>
              </View>

              <Pressable
                onPress={() => setFontSize(() => ({ header: 16, body: 14 }))}
                className="mt-4 border border-[#265828] rounded-full px-6 py-3 self-start"
              >
                <Text className="text-[#265828] text-[16px] font-sansMedium">
                  RESET
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Reading Style */}
          <View className="mt-6 border border-[#C3E4C5] rounded-[16px] border-b-4 p-4 bg-white ">
            <Text className="text-[18px]  font-sansMedium text-dark leading-[1.5]">
              Reading Style
            </Text>
            <Text className="font-sansItalic text-[#474348] leading-[1.5] mt-2 mb-4">
              Pick a style that makes words easier{'\n'}to see.
            </Text>

            <View className="bg-white rounded-2xl p-4 border border-[#D3D2D366] gap-4">
              <View className="flex-row items-center justify-between relative">
                <View className="flex-row items-center gap-2">
                  <Text className="text-[16px] font-sans text-dark">
                    Dyslexia-Friendly
                  </Text>
                  <Pressable
                    onPress={() =>
                      activeTooltip
                        ? setActiveTooltip('')
                        : setActiveTooltip('dyslexia')
                    }
                  >
                    <ICONS.QuestionCircled />
                  </Pressable>
                </View>
                <Switch
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  thumbColor={'white'}
                  trackColor={{
                    true: '#3F9243',
                    false: '#D3D2D3',
                  }}
                  value={dyslexia}
                  onChange={() => setDyslexia((prev) => !prev)}
                />
                {activeTooltip === 'dyslexia' && (
                  <View className="absolute w-full top-[30]">
                    <ToolTip
                      title="Dyslexia-Friendly Mode"
                      desc="Changes the font on reading screens to make words easier to read."
                    />
                  </View>
                )}
              </View>

              <View className="flex-row items-center justify-between relative">
                <View className="flex-row items-center gap-2">
                  <Text className="text-[16px] font-sans text-dark">
                    High Contrast
                  </Text>
                  <Pressable
                    onPress={() =>
                      activeTooltip
                        ? setActiveTooltip('')
                        : setActiveTooltip('contrast')
                    }
                  >
                    <ICONS.QuestionCircled />
                  </Pressable>
                </View>

                <Switch
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  thumbColor={'white'}
                  trackColor={{
                    true: '#3F9243',
                    false: '#D3D2D3',
                  }}
                  value={highContrast}
                  onChange={() => sethighContrast((prev) => !prev)}
                />
                {activeTooltip === 'contrast' && (
                  <View className="absolute w-full top-[30]">
                    <ToolTip
                      title="High Contrast Mode"
                      desc="Applies only to reading screens in the course player."
                    />
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Line Spacing */}
          <View className="mt-6 border border-[#C3E4C5] rounded-[16px] border-b-4 p-4 bg-white ">
            <Text className="text-[18px]  font-sansMedium text-dark leading-[1.5]">
              Line Spacing
            </Text>
            <Text className="font-sansItalic text-[#474348] leading-[1.5] mt-2 mb-4">
              Add more space between lines to make reading easier.
            </Text>

            <View className="bg-white rounded-2xl p-4 py-5 border border-[#D3D2D366] gap-4">
              <View className="flex-row items-center w-full gap-2">
                <Pressable onPress={() => setLineSpace((s) => s - 2)}>
                  <ICONS.LineHeightSmall />
                </Pressable>
                <RangeSlider
                  className="flex-1"
                  min={10}
                  max={50}
                  step={1}
                  low={lineSpace}
                  renderHighValue={(value) => null}
                  onValueChanged={(newLow: number) => {
                    setLineSpace(newLow);
                  }}
                  renderLowValue={(value) => null}
                  renderThumb={(type) => (
                    <View
                      style={{
                        width: scaleWidth(24),
                        height: scaleWidth(24),
                      }}
                      className="rounded-full bg-[#DBEFDC]"
                    />
                  )}
                  renderRail={() => (
                    <View className="h-2.5 bg-[#D3D2D366] flex-1 rounded-tr-[16px] rounded-br-[16px]" />
                  )}
                  renderRailSelected={() => (
                    <View className="bg-[#3F9243] h-2.5 flex-1 rounded-tl-[16px] rounded-bl-[16px]" />
                  )}
                  disableRange
                />
                <Pressable onPress={() => setLineSpace((s) => s + 2)}>
                  <ICONS.LineHeightBig />
                </Pressable>
              </View>

              <Pressable
                onPress={() => setLineSpace(24)}
                className="mt-4 border border-[#265828] rounded-full px-6 py-3 self-start"
              >
                <Text className="text-[#265828] text-[16px] font-sansMedium">
                  RESET
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Save Button */}
          <Pressable onPress={onSave} className="mt-8 bg-green-700 rounded-full py-4 items-center">
            <Text className="text-white font-semibold text-lg">
              SAVE MY SETTINGS
            </Text>
          </Pressable>
        </View>
      </View>
      {/* </TouchableWithoutFeedback> */}
    </Container>
  );
};

const ToolTip = ({ title, desc }: { title: string; desc: string }) => {
  return (
    <View className="items-center w-full  z-[100]">
      <Svg width={40} height={20} viewBox="0 0 40 20">
        <Path
          d="M0 20 L20 0 L40 20 Z"
          fill="white"
          stroke="#D3D2D3"
          strokeWidth={1}
        />
      </Svg>

      <View className="bg-white rounded-3xl p-6 border border-[#D3D2D3] flex-row w-full gap-3">
        <ICONS.TooltipStar />
        <View className="flex-1">
          <Text className="text-[18px] font-sansMedium text-gray-800 mb-2">
            {title}
          </Text>

          <Text className="text-[16px] leading-[1.5] font-sans text-[#474348]">
            <Text className="">{desc}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ReadingSettings;
