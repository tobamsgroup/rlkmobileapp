import { updateWorkbookProgress } from '@/actions/kid';
import { ICONS } from '@/assets/icons';
import Button, { LinearButton, SecondaryButton } from '@/components/Button';
import { WorkbookChapter } from '@/types';
import { invalidateQueries } from '@/utils/query';
import { STAUS_BAR_HEIGHT } from '@/utils/scale';
import { showToast } from '@/utils/toast';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import Pdf, { PdfRef } from 'react-native-pdf';
import { twMerge } from 'tailwind-merge';

const WorkbookView = () => {
  const pdfRef = useRef<PdfRef>(null);
  const { chapter } = useLocalSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const startedRef = useRef(false);
  const parsedChapter = useMemo(() => {
    return JSON.parse(chapter as string) as WorkbookChapter;
  }, [chapter]);
  const [currentIndex, setCurrentIndex] = useState(parsedChapter?.start || 0);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProgress = async (status: 'started' | 'completed') => {
    await updateWorkbookProgress(
      parsedChapter?.workbookId!,
      parsedChapter?.chapterId,
      status,
    );
    invalidateQueries('workbooks');
  };

  const onComplete = async () => {
    setIsLoading(true);
    try {
      await handleUpdateProgress('completed');
      setOpenModal(false);
      showToast('success', 'Workbook marked as completed');
      router.back();
    } catch (error: any) {
      showToast('error', error?.response?.data?.message || 'Try again');
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <View className="bg-[#DBEFDC] flex-1 pb-10 ">
      <View
        style={{ paddingTop: STAUS_BAR_HEIGHT + 20 }}
        className=" px-6 flex-row gap-8 items-center pb-6 border-b border-b-[#DBEFDC] bg-[#FAFDFF]"
      >
        <Pressable
          onPress={() => router.back()}
          className="w-12 h-12 bg-[#337535] items-center justify-center rounded-[12px]"
        >
          <ICONS.ChevronLeft strokeWidth={4} stroke={'white'} />
        </Pressable>
      </View>
      <View className="bg-[#FAFDFF] py-4 px-6">
        <Text className="text-[18px] font-sansSemiBold text-[#337535]">
          Chapter {' '}
          {parsedChapter?.chapterIndex}: {parsedChapter?.chapterName}
        </Text>
      </View>

      <View className="py-5  px-6 flex-1">
        {parsedChapter?.pdfUrl && (
          <Pdf
            style={{ flex: 1 }}
            ref={pdfRef}
            page={parsedChapter?.start}
            source={{
              uri: parsedChapter?.pdfUrl,
            }}
            trustAllCerts={false}
            enablePaging
            enableDoubleTapZoom
            singlePage
            onPageChanged={(page) => {
              setCurrentIndex(page);

              if (page < parsedChapter?.start) {
                pdfRef.current?.setPage(parsedChapter?.start);
              }
              if (page > parsedChapter?.end) {
                alert('true');
                pdfRef.current?.setPage(parsedChapter?.end);
              }
              if (
                currentIndex > parsedChapter?.start &&
                !parsedChapter?.isStarted &&
                !startedRef.current
              ) {
                handleUpdateProgress('started');
                startedRef.current = true;
              }
            }}
          />
        )}
      </View>
      <View className="px-6">
        {currentIndex === parsedChapter?.end && (
          <LinearButton
            onPress={() => setOpenModal(true)}
            linearStyle={{ width: '100%' }}
            className={twMerge(
              'text-xl font-semibold flex items-center justify-center gap-2 z-100 w-[100%]',
            )}
          >
            <Text className="text-white font-sansSemiBold text-[16px]">
              MARK AS COMPLETE
            </Text>
            <View className="rotate-270">
              <ICONS.ChevronRight stroke="white" strokeWidth="3" />
            </View>
          </LinearButton>
        )}
      </View>
      <View className="flex justify-between mt-5 gap-4 items-center flex-row px-6">
        {currentIndex > parsedChapter?.start && (
          <SecondaryButton
            onPress={() => {
              if (currentIndex > parsedChapter?.start) {
                pdfRef?.current?.setPage(currentIndex - 1);
                setCurrentIndex((prev) => prev - 1);
              }
            }}
            linearStyle={{ gap: 8 }}
            className={twMerge(
              'w-[46%]',
              currentIndex === parsedChapter?.end && 'w-[100%]',
            )}
          >
            <ICONS.ChevronLeft stroke="#806C00" strokeWidth="3" />
            <Text className=" text-[#806C00] font-sansSemiBold text-[16px]">
              PREVIOUS
            </Text>
          </SecondaryButton>
        )}
        {currentIndex !== parsedChapter?.end && (
          <LinearButton
            onPress={() => {
              if (currentIndex < parsedChapter?.end) {
                pdfRef?.current?.setPage(currentIndex + 1);
                setCurrentIndex((prev) => prev + 1);
              }
            }}
            linearStyle={{ width: '100%' }}
            className={twMerge(
              'text-xl font-semibold flex items-center justify-center gap-2 z-100 w-[46%]',
              currentIndex <= parsedChapter?.start && 'w-[100%]',
            )}
          >
            <Text className="text-white font-sansSemiBold text-[16px]">
              NEXT
            </Text>
            <View className="rotate-270">
              <ICONS.ChevronRight stroke="white" strokeWidth="3" />
            </View>
          </LinearButton>
        )}
      </View>
      <Modal isVisible={openModal} onBackdropPress={() => setOpenModal(false)}>
        <View className="bg-[#DBEFDC] p-6  border-2 border-[#6ABC6D] rounded-[24px] items-center">
          <View className="bg-white rounded-[24px] p-5 items-center mb-6 w-full">
            <View className="w-24 h-24 rounded-full bg-[#FFBF001A] items-center justify-center">
              <ICONS.GrinningEmoji />
            </View>
            <Text className="text-center font-sansSemiBold text-[#265828] text-[20px] mb-2 mt-6">
              Mark Workbook Exercise Complete?
            </Text>
            <Text className="text-center text-[#221D23] font-sans text-[16px] leading-[1.5]">
              Only mark this complete after finishing the workbook exercise in
              your notebook.
            </Text>
          </View>
          <LinearButton
            onPress={onComplete}
            disabled={isLoading}
            className="w-full mt-6"
            text={isLoading ? 'MARKING...' : 'MARK COMPLETE'}
          />
          <SecondaryButton
            onPress={() => setOpenModal(false)}
            className="w-full mt-4"
            text={'GO BACK'}
          />
        </View>
      </Modal>
    </View>
  );
};

export default WorkbookView;
