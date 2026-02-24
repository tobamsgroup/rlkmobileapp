import { IMAGES } from '@/assets/images';
import React, { Dispatch, SetStateAction } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type QuestionType = {
  type: 'trueOrFalse';
  statement: string;
  answer: boolean;
  feedback: {
    correct: string;
    incorrect: string;
  };
};

export default function TrueOrFalse({
  question,
  isSubmitted,
  setSelected,
  selected,
}: {
  question: {
    type: 'trueOrFalse';
    statement: string;
    answer: boolean;
    feedback: {
      correct: string;
      incorrect: string;
    };
  };
  isSubmitted: boolean;
  setSelected: Dispatch<SetStateAction<string | boolean | null>>;
  selected: string | boolean | null;
}) {
  return (
    <View className=''>
      <View className="bg-white  px-8 py-8 rounded-2xl">
        {/* Question */}
        <Text className="text-[18px] font-sansMedium text-center z-30">
          {question.statement}
        </Text>

        {/* Options */}
        <View className="flex-row gap-3 items-center justify-center mt-12">
          {/* TRUE BUTTON */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => !isSubmitted && setSelected(true)}
            className={`py-5 px-8 rounded-xl border border-b-4 font-sansMedium
            ${
              selected === true
                ? 'bg-[#0991374D] border-2 border-b-4 border-[#6ABC6D]'
                : 'bg-[#0991370D] border-[#A6D7A8]'
            }
            ${
              isSubmitted && selected === true && !question.answer
                ? 'border-2 border-[#DE212166] bg-[#DE212133]'
                : ''
            }
          `}
          >
            <Text className="text-center text-[16px] font-sansMedium">
              True
            </Text>
          </TouchableOpacity>

          {/* FALSE BUTTON */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => !isSubmitted && setSelected(false)}
            className={`py-5 px-8 rounded-xl border border-b-4 font-medium
            ${
              selected === false
                ? 'bg-[#0991374D] border-2 border-b-4 border-[#6ABC6D]'
                : 'bg-[#0991370D] border-[#A6D7A8]'
            }
            ${
              isSubmitted && selected === false && question.answer
                ? 'border-2 border-[#DE212166] bg-[#DE212133]'
                : ''
            }
          `}
          >
            <Text className="text-center text-[16px] font-sansMedium">
              False
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}
