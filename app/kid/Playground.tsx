import { ICONS } from '@/assets/icons';
import AdvancedDrawer from '@/components/kid/Drawer';
import Journal from '@/components/kid/Journal';
import WhatDidYouLearn from '@/components/kid/Journal';
import Quiz from '@/components/kid/Quiz';
import ReadMode from '@/components/kid/ReadMode';
import ScenarioQuiz from '@/components/kid/ScenarioQuiz';
import { STAUS_BAR_HEIGHT } from '@/utils/scale';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PieChart } from 'react-native-gifted-charts';
import ReactNativeModal from 'react-native-modal';

const Playground = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const pieData = [
    { value: 30, color: '#3F9243' },
    { value: 70, color: '#DBEFDC' },
  ];
  return (
    <ScrollView className="bg-[#DBEFDC] flex-1 pb-10 " showsVerticalScrollIndicator={false} contentContainerClassName='pb-10'>
      <View
        style={{ paddingTop: STAUS_BAR_HEIGHT + 20 }}
        className=" px-6 flex-row gap-8 items-center pb-6 border-b border-b-[#DBEFDC] bg-white"
      >
        <Pressable
          onPress={() => router.back()}
          className="w-12 h-12 bg-[#337535] items-center justify-center rounded-[12px]"
        >
          <ICONS.ChevronLeft strokeWidth={4} stroke={'white'} />
        </Pressable>
        <View className="flex-row items-center flex-1 gap-4 justify-around">
          <View className="flex-row items-center gap-3 i">
            <PieChart
              donut
              textColor="black"
              radius={20}
              textSize={20}
              data={pieData}
              innerRadius={15}
            />
            <Text className="text-[18px] text-[#265828] font-sansSemiBold">
              30%
            </Text>
          </View>
          <View className="flex-row items-center border border-[#D3D2D333] gap-2.5 py-2 px-2.5 rounded-[5px]">
            <ICONS.Star3 />
            <Text className="text-[#004D99] text-[18px]  font-sansSemiBold">
              350
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => setOpenSidebar(true)}
          className="w-12 h-12 bg-[#337535] items-center justify-center rounded-full"
        >
          <ICONS.Menu />
        </Pressable>
      </View>
      <View className="py-4 px-6 bg-white">
        <Text className="text-[18px] font-sansSemiBold text-[#337535]">
          Lesson 1: Becoming a Hero
        </Text>
      </View>
      <View className="items-end">
        <View className=" bg-[#DBEFDC] p-6">
          <Pressable className="relative flex-row items-center gap-2 py-2 px-3">
            <LinearGradient
              colors={['#D5B300', '#3F9243']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: 0,
                borderRadius: 20,
              }}
            />
            <ICONS.Curriculum fill={'white'} />
            <Text className="text-white font-sansSemiBold">
              SWITCH TO PLAY & LEARN
            </Text>
          </Pressable>
        </View>
      </View>
      {/* Component Block */}
      <View className="px-6">
        {/* <ReadMode /> */}
        {/* <Quiz/> */}
        {/* <ScenarioQuiz/> */}
        {/* <WhatDidYouLearn/> */}
        <GestureHandlerRootView style={{flex:1}}>

        <Journal/>
        </GestureHandlerRootView>
      </View>
      {/* Component Block */}
      <ReactNativeModal
        style={{ padding: 0, margin: 0 }}
        className="p-0 m-0"
        isVisible={openSidebar}
      >
        <ScrollView
          style={{ paddingTop: STAUS_BAR_HEIGHT + 20 }}
          className="bg-white flex-1 "
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between px-6 border-b border-b-[#D3D2D366] pb-5">
            <Text className="text-dark text-[20px] font-sansSemiBold">
              Curriculum
            </Text>
            <Pressable
              onPress={() => setOpenSidebar(false)}
              className="w-12 h-12 bg-[#C3E4C5] items-center justify-center rounded-full"
            >
              <ICONS.Close width={24} height={24} stroke={'#221D23'} />
            </Pressable>
          </View>
          <View className="flex-row items-center justify-between p-6 border-b border-b-[#D3D2D366]">
            <Text className="text-dark text-[20px] font-sansSemiBold">
              Series 1: Eco Explorers
            </Text>
          </View>
          <Pressable className="bg-[#DBEFDC80] py-5 px-3 flex-row items-center gap-3">
            <View className="rotate-180">
              <ICONS.ChevronDown />
            </View>
            <Text className="flex-1 text-dark text-[18px] font-sansMedium">
              01: What is Eco Exploring?
            </Text>
            <Text className="font-sansMedium text-[#474348]">1/6</Text>
          </Pressable>
          {[1, 2, 3, 4]?.map((c) => (
            <Pressable className=" py-5 px-3 flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-[#1671D91A] items-center justify-center">
                <ICONS.Note />
              </View>
              <Text className="flex-1 text-dark text-[16px] font-sans">
                01: What is Eco Exploring?
              </Text>
              {/* <ICONS.PadLock/> */}
              <ICONS.CheckCircle />
            </Pressable>
          ))}
          <Pressable className="bg-[#DBEFDC80] py-5 px-3 flex-row items-center gap-3">
            <View className="rotate-180">
              <ICONS.ChevronDown />
            </View>
            <Text className="flex-1 text-dark text-[18px] font-sansMedium">
              01: What is Eco Exploring?
            </Text>
            <Text className="font-sansMedium text-[#474348]">1/6</Text>
          </Pressable>
          {[1, 2, 3, 4]?.map((c) => (
            <Pressable className=" py-5 px-3 flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-[#1671D91A] items-center justify-center">
                <ICONS.Note />
              </View>
              <Text className="flex-1 text-dark text-[16px] font-sans">
                01: What is Eco Exploring?
              </Text>
              {/* <ICONS.PadLock/> */}
              <ICONS.CheckCircle />
            </Pressable>
          ))}
          <Pressable className="bg-[#DBEFDC80] py-5 px-3 flex-row items-center gap-3">
            <View className="rotate-180">
              <ICONS.ChevronDown />
            </View>
            <Text className="flex-1 text-dark text-[18px] font-sansMedium">
              01: What is Eco Exploring?
            </Text>
            <Text className="font-sansMedium text-[#474348]">1/6</Text>
          </Pressable>
          {[1, 2, 3, 4]?.map((c) => (
            <Pressable className=" py-5 px-3 flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-[#1671D91A] items-center justify-center">
                <ICONS.Note />
              </View>
              <Text className="flex-1 text-dark text-[16px] font-sans">
                01: What is Eco Exploring?
              </Text>
              {/* <ICONS.PadLock/> */}
              <ICONS.CheckCircle />
            </Pressable>
          ))}
        </ScrollView>
      </ReactNativeModal>
    </ScrollView>
  );
};

export default Playground;
