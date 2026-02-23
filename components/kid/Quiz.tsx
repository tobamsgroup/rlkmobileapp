import { ICONS } from '@/assets/icons';
import { scaleHeight, scaleWidth } from '@/utils/scale';
import React from 'react';
import { GestureResponderEvent, Pressable, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import Button from '../Button';
import ProgressBar from '../ProgressBar';

const Quiz = () => {
  return (
    <View>
      <View className="bg-[#FAFDFF] border-b-2 border-b-[#4CAF50] rounded-[12px] p-6 border border-[#DBEFDC] flex-row items-center gap-6">
        <Text className="text-[#265828] font-sansSemiBold text-[16px]">
          Question 3 of 5
        </Text>
        <View className="flex-1">
          <ProgressBar percent={30} height={10} />
        </View>
      </View>
      <Reward />
      <View className="flex-row justify-between mt-8">
        <Button className="w-[48%] gap-3 bg-[#FFEB80] border-[#D5B300] border border-b-4 ">
          <ICONS.ChevronLeft stroke={'#806C00'} />
          <Text className="text-[#806C00] text-[16px] font-sansSemiBold">
            PREVIOUS
          </Text>
        </Button>
        <Button className="w-[48%] gap-3 bg-[#337535] border-[#265828] border border-b-4 ">
          <Text className="text-[#FFFFFF] text-[16px] font-sansSemiBold">
            NEXT
          </Text>
          <ICONS.ChevronRight stroke={'#FFFFFF'} />
        </Button>
      </View>
    </View>
  );
};

interface OptionButtonProps {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  selected?: boolean;
  left?: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({
  label,
  onPress,
  selected,
  left,
}) => {
  return (
    <Pressable onPress={onPress}>
      <View className="items-center justify-center">
        {selected ? (
          <ICONS.McqOptionSelected
            width={scaleWidth(135)}
            height={scaleHeight(50)}
            style={{
              transform: [{ rotateY: left ? '0deg' : '180deg' }],
            }}
          />
        ) : (
          <ICONS.McqOption
            width={scaleWidth(135)}
            height={scaleHeight(50)}
            style={{
              transform: [{ rotateY: left ? '0deg' : '180deg' }],
            }}
          />
        )}
        <Text className="absolute text-white  font-sansMedium break-words text-center whitespace-normal">
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

const MCQ: React.FC = () => {
  return (
    <View className="flex-1 bg-[#265828] p-4 rounded-[20px] border-[3px] border-[#337535] my-6">
      <View className="flex-1 rounded-3xl overflow-hidden">
        <View className="flex-1 justify-between p-6">
          <Text className="text-white text-[16px] font-sansSemiBold text-center font-semibold leading-[1.5] mt-4">
            You have 10 coins. You want to buy a toy that costs 7 coins. How
            many coins will you have left?
          </Text>

          {/* Options */}
          <View className="mt-10">
            <View className=" flex-wrap flex-row mb-6 gap-1">
              {[1, 2, 3, 4]?.map((o, i) => (
                <OptionButton
                  key={i}
                  left={i % 2 === 0}
                  label={`${i + 1} Coins`}
                />
              ))}
            </View>
          </View>
          <View className="border border-[#D3D2D333] mb-8" />
          <View className="bg-[#FFFFFF1A] border-[#6ABC6D] border rounded-[12px] p-5">
            <View className="flex-row items-center gap-2">
              <ICONS.Bulb stroke={'white'} width={20} height={20} />
              <Text className="text-[16px] font-sansMedium text-white">
                Great Job!
              </Text>
            </View>
            <Text className="text-[16px] font-sansMedium text-white mt-2">
              Keep going, you’re doing amazing!
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const FillInOption = ({
  label,
  onPress,
  selected,
  isCorrect,
  isWrong,
}: {
  label: string;
  onPress: () => void;
  selected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
}) => {
  return (
    <Pressable
      className={twMerge(
        'bg-white h-[72px] rounded-[12px] w-[48%] items-center justify-center mb-5',
        selected && 'bg-[#A6D7A8] border-4 border-[#88CA8A]',
        isCorrect && 'border-4 border-[#88CA8A] bg-[#3F9243]',
        isWrong && 'border-4 border-[#DE21214D] bg-white',
      )}
      onPress={onPress}
    >
      <Text className="absolute text-dark text-[16px]  font-sansSemiBold break-words text-center whitespace-normal">
        {label}
      </Text>
    </Pressable>
  );
};

const FillIn: React.FC = () => {
  return (
    <View className="flex-1 bg-[#265828] p-4 rounded-[20px] border-[3px] border-[#337535] my-6">
      <View className="flex-1 rounded-3xl overflow-hidden">
        <View className="flex-1 justify-between p-6">
          <View className="bg-[#FFFFFF1A] border-[#6ABC6D] border rounded-[12px] p-5">
            <Text className="text-[16px] font-sansSemiBold text-white ">
              Plants need sunlight, water, and ___ to grow
            </Text>
          </View>
          <View className="border border-[#D3D2D333] mt-8" />

          <View className="mt-10">
            <View className="flex-row flex-wrap  mb-6 justify-between">
              {[1, 2, 3, 4]?.map((o, i) => (
                <FillInOption
                  key={i}
                  selected={i % 2 === 0}
                  isCorrect={i % 2 === 0}
                  isWrong={i % 2 === 0}
                  label={`${i + 1} Coins`}
                  onPress={() => {}}
                />
              ))}
            </View>
          </View>
          <View className="border border-[#D3D2D333] mb-8" />
          <View className="bg-[#FFFFFF1A] border-[#6ABC6D] border rounded-[12px] p-5">
            <View className="flex-row items-center gap-2">
              <ICONS.Bulb stroke={'white'} width={20} height={20} />
              <Text className="text-[16px] font-sansMedium text-white">
                Great Job!
              </Text>
            </View>
            <Text className="text-[16px] font-sansMedium text-white mt-2">
              Keep going, you’re doing amazing!
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const Reward = () => {
  return (
    <View className="flex-1 bg-[#265828] p-6 my-6 rounded-[20px] items-center">
      <View className="items-center flex-row gap-2.5">
        <ICONS.PartyPopper />
        <Text className="text-[20px] text-center text-white font-sansSemiBold">
          Perfect Run, Alex!
        </Text>
      </View>
      <Text className="text-[16px] font-sansSemiBold text-white text-center mt-2">
        Amazing — you nailed every question on the first try!
      </Text>
      <View className="bg-[#FFFFFF26] rounded-[12px] py-5 px-4 w-full my-9">
        <View className="bg-[#FAFDFF] p-4 rounded-[8px] flex-row items-center gap-4 mb-5">
          <View className="w-12 h-12 rounded-full bg-[#0991371A] items-center justify-center">
            <ICONS.Check />
          </View>
          <View>
            <Text className="text-dark font-sans">Score</Text>
            <Text className="text-[16px] font-sansSemiBold text-dark mt-1.5">
              20/20
            </Text>
          </View>
        </View>
        <View className="bg-[#FAFDFF] p-4 rounded-[8px] flex-row items-center gap-4 mb-5">
          <View className="w-12 h-12 rounded-full bg-[#C821DE1A] items-center justify-center">
            <ICONS.Award />
          </View>
          <View>
            <Text className="text-dark font-sans">Badge Earned</Text>
            <Text className="text-[16px] font-sansSemiBold text-dark mt-1.5">
              Learner
            </Text>
          </View>
        </View>
        <View className="bg-[#FAFDFF] p-4 rounded-[8px] flex-row items-center gap-4 mb-5">
          <View className="w-12 h-12 rounded-full bg-[#D5B3001A] items-center justify-center">
            <ICONS.Star2 width={20} height={20} />
          </View>
          <View>
            <Text className="text-dark font-sans">XP Earned</Text>
            <Text className="text-[16px] font-sansSemiBold text-dark mt-1.5">
              +2000
            </Text>
          </View>
        </View>
        <View className="bg-[#FAFDFF] p-4 rounded-[8px] flex-row items-center gap-4 mb-5">
          <View className="w-12 h-12 rounded-full bg-[#D5B3001A] items-center justify-center">
            <ICONS.Star2 width={20} height={20} />
          </View>
          <View>
            <Text className="text-dark font-sans">Total XP</Text>
            <Text className="text-[16px] font-sansSemiBold text-dark mt-1.5">
              21,000
            </Text>
          </View>
        </View>
      </View>
      <Button className=" gap-3 bg-[#337535] border-[#265828] border border-b-4 w-full mb-4">
        <Text className="text-[#FFFFFF] text-[16px] font-sansSemiBold">
          NEXT LESSON
        </Text>
        <ICONS.ChevronRight stroke={'#FFFFFF'} />
      </Button>
      <Button className=" gap-3 bg-[#FFEB80] border-[#D5B300] border border-b-4 w-full ">
        <Text className="text-[#806C00] text-[16px] font-sansSemiBold">
          RETAKE QUIZ
        </Text>
      </Button>
    </View>
  );
};
export default Quiz;
