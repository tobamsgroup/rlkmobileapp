import { IMAGES } from '@/assets/images';
import React, { useState } from 'react';
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

export default function TrueOrFalse() {
  // ✅ Default Question Data
  const question: QuestionType = {
    type: 'trueOrFalse',
    statement: 'A responsible person does what they say they will do.',
    answer: true,
    feedback: {
      correct: 'Correct! Responsible people keep their promises.',
      incorrect: 'Not quite. Responsible people keep their promises.',
    },
  };

  const [selected, setSelected] = useState<boolean | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected !== null) {
      setIsSubmitted(true);
    }
  };

  const isCorrect = selected === question.answer;

  return (
    <View>

    <View className="bg-white  px-8 py-8 rounded-2xl mx-4 mt-10">
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
          <Text className="text-center text-[16px] font-sansMedium">True</Text>
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
          <Text className="text-center text-[16px] font-sansMedium">False</Text>
        </TouchableOpacity>
      </View>

      {/* Feedback */}
      {isSubmitted && selected !== null && (
        <View className="mt-6">
          <Text
            className={`text-center font-medium ${
              isCorrect ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {isCorrect
              ? question.feedback.correct
              : question.feedback.incorrect}
          </Text>
        </View>
      )}

      <Image
        source={IMAGES.Scenario_Corner_3}
        alt="corner3"
        className="absolute top-0 right-0  w-[55px] h-[55px] rounded-[20px]  z-[10] "
      />
   
      <Image
        source={IMAGES.Scenario_Corner_2}
        alt="corner2"
        className="absolute top-0 left-0  w-[55px] h-[55px] rounded-[20px]  z-[10] "
      />
   
    </View>
    </View>
  );
}
