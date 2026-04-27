import {
  createCheckoutSession,
  type SubscriptionPlan,
} from '@/actions/subscription';
import { ICONS } from '@/assets/icons';
import { IMAGES } from '@/assets/images';
import Button from '@/components/Button';
import Container from '@/components/Container';
import TopBackButton from '@/components/TopBackButton';
import { PLAN_DETAILS, formatDateShort } from '@/constants/subscription';
import { showToast } from '@/utils/toast';
import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';

const SUCCESS_URL =
  'https://staging.recycledlearningkids.com/subscription/success';
const CANCEL_URL =
  'https://staging.recycledlearningkids.com/subscription/cancel';

const ConfirmPlan = () => {
  const { planId } = useLocalSearchParams<{ planId: SubscriptionPlan }>();
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [webViewLoading, setWebViewLoading] = useState(true);
  const queryClient = useQueryClient();
  const successHandledRef = useRef(false);

  const plan = planId && PLAN_DETAILS[planId] ? PLAN_DETAILS[planId] : null;

  const handleCompletePayment = async () => {
    if (!planId) return;
    setLoading(true);
    try {
      const { url } = await createCheckoutSession(planId);
      setCheckoutUrl(url);
    } catch (error: any) {
      Alert.alert('Payment Error', error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationChange = (navState: { url: string }) => {
    if (navState.url.startsWith(SUCCESS_URL) && !successHandledRef.current) {
      successHandledRef.current = true;
      setTimeout(() => {
        setCheckoutUrl(null);
        queryClient.invalidateQueries({ queryKey: ['subscription'] });
        queryClient.invalidateQueries({ queryKey: ['guardian'] });
        queryClient.invalidateQueries({ queryKey: ['billing-history'] });
        successHandledRef.current = false;
        router.replace('/guardian/Subscription');
        showToast('success', 'Payment Successful.');
      }, 6000);
    } else if (navState.url.startsWith(CANCEL_URL)) {
      setCheckoutUrl(null);
      showToast('info', 'Payment cancelled. No charges were made.');
    }
  };

  if (!plan) {
    return (
      <Container edges={['top']}>
        <View className="px-6 py-5">
          <TopBackButton />
          <Text className="font-sans text-[#474348] mt-6 text-[16px]">
            Invalid plan selected. Please go back and choose a plan.
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <>
      <Container scrollable>
        <View className="px-6 py-5 pb-10">
          <TopBackButton />
          <Text className="font-sansSemiBold text-dark text-[20px] mt-4">
            Confirm Your Plan
          </Text>
          <Text className="mt-2 text-[16px] text-[#6C686C] font-sans leading-[1.5]">
            Just one step to go! Review your plan and complete your
            subscription.
          </Text>

          {/* Plan summary */}
          <View className="bg-white rounded-[12px] p-4 mt-6 items-start">
            <Text className="text-[18px] font-sansSemiBold text-[#221D23] mb-8">
              Plan Summary
            </Text>
            <View className="bg-[#FFF7CC] rounded-[17px] p-1.5 border-[0.9px] border-[#FFF2AA] mb-4">
              <Image source={IMAGES.DollarCoin} className="w-[84px] h-[84px]" />
            </View>
            <Text
              style={{ color: plan.themeText, backgroundColor: plan.themeBg }}
              className="text-[16px] font-sansSemiBold rounded-[8px] px-4 py-1.5"
            >
              {plan.name}
            </Text>
            <Text className="text-[20px] font-sansSemiBold text-[#221D23] leading-[1.3] mt-4">
              £{plan.price.toFixed(2)}
              <Text className="text-[16px] text-[#474348] font-sans">
                /month
              </Text>
            </Text>
            <View className="flex-row items-center gap-2 mt-3">
              <Text className="text-[#474348] font-sansMedium text-[16px]">
                {plan.noOfBooks} Books
              </Text>
              <View className="bg-[#D9D9D9] w-2 h-2 rounded-full" />
              <Text className="text-[#474348] font-sansMedium text-[16px]">
                1 Child
              </Text>
            </View>
            <Text className="font-sansItalic text-[#474348] mt-6">
              Billed monthly. Cancel anytime.
            </Text>
            <Pressable
              onPress={() => router.back()}
              className="flex-row border-b border-b-[#3F9243] gap-2 mt-5"
            >
              <Text className="text-[16px] text-[#3F9243] font-sansMedium">
                CHANGE PLAN
              </Text>
              <ICONS.Pencil width={20} height={20} stroke={'#3F9243'} />
            </Pressable>

            {/* Features */}
            <View className="border border-[#D3D2D366] rounded-[12px] mt-8 bg-[#D3D2D31A] p-4 w-full">
              <Text className="font-sansMedium text-[#221D23] text-[16px] mb-4">
                Features
              </Text>
              {[
                'Add more children to your account',
                'Track detailed learning progress',
                `Access ${plan.noOfBooks} books in the library`,
              ].map((feature) => (
                <View
                  key={feature}
                  className="flex-row gap-3 items-center mb-4"
                >
                  <View className="w-8 h-8 rounded-full items-center justify-center bg-[#D3D2D333]">
                    <ICONS.Check color={'#474348'} />
                  </View>
                  <Text className="text-[#474348] font-sans text-[16px] flex-1">
                    {feature}
                  </Text>
                </View>
              ))}
            </View>

            <View className="border-b border-b-[#D3D2D366] my-8 w-full" />
            <View className="w-full flex-row justify-between items-center">
              <Text className="text-[18px] font-sansMedium text-[#221D23]">
                Amount to pay today
              </Text>
              <Text className="text-[18px] font-sansMedium text-[#221D23]">
                £{plan.price.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Billing summary */}
          <View className="bg-white rounded-[12px] p-5 mt-6 items-start">
            <Text className="font-sansSemiBold text-dark text-[18px]">
              Billing Summary
            </Text>
            <View className="gap-4 mt-6">
              <View className="w-full flex-row justify-between items-center">
                <Text className="text-[16px] font-sans text-[#474348]">
                  Amount to pay today
                </Text>
                <Text className="text-[16px] font-sans text-[#474348]">
                  £{plan.price.toFixed(2)}
                </Text>
              </View>
              <View className="w-full flex-row justify-between items-center">
                <Text className="text-[16px] font-sans text-[#474348]">
                  Billing cycle
                </Text>
                <Text className="text-[16px] font-sans text-[#474348]">
                  Monthly
                </Text>
              </View>
              <View className="w-full flex-row justify-between items-center">
                <Text className="text-[16px] font-sans text-[#474348]">
                  Next Billing Date
                </Text>
                <Text className="text-[16px] font-sans text-[#474348]">
                  {formatDateShort(
                    new Date(
                      Date.now() + 30 * 24 * 60 * 60 * 1000,
                    ).toISOString(),
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Payment method */}
          <View className="bg-white rounded-[12px] p-5 mt-6 items-start">
            <Text className="font-sansSemiBold text-dark text-[18px] mb-4">
              Payment Method
            </Text>
            <Pressable className="border border-[#3F9243] rounded-full py-4 px-6 w-full flex-row gap-4 items-center">
              <View className="w-6 h-6 rounded-full border border-[#3F9243] items-center justify-center">
                <View className="w-3 h-3 bg-[#3F9243] rounded-full" />
              </View>
              <Text className="text-[#221D23] text-[16px] font-sans">
                PAY VIA STRIPE
              </Text>
            </Pressable>
            <View className="border-b border-b-[#D3D2D366] my-6 w-full" />
            <Button
              text={loading ? 'LOADING...' : 'COMPLETE PAYMENT'}
              className="w-full"
              onPress={handleCompletePayment}
              disabled={loading}
            />
            <Text className="mt-4 font-sansItalic text-[#474348] text-[12px]">
              Secure payment powered by Stripe. Complete your payment without
              leaving the app.
            </Text>
          </View>
        </View>
      </Container>

      {/* Stripe checkout WebView modal */}
      <Modal
        isVisible={!!checkoutUrl}
        style={{ margin: 0 }}
        onBackButtonPress={() => setCheckoutUrl(null)}
      >
        <SafeAreaView className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#D3D2D366]">
            <Pressable
              onPress={() => setCheckoutUrl(null)}
              className="w-9 h-9 items-center justify-center rounded-full bg-[#F5F5F5]"
            >
              <ICONS.Close width={18} height={18} stroke="#221D23" />
            </Pressable>
            <Text className="font-sansMedium text-[#221D23] text-[16px]">
              Secure Checkout
            </Text>
            <View className="w-9" />
          </View>

          {/* WebView */}
          {checkoutUrl && (
            <WebView
              source={{ uri: checkoutUrl }}
              onNavigationStateChange={handleNavigationChange}
              onLoadStart={() => setWebViewLoading(true)}
              onLoadEnd={() => setWebViewLoading(false)}
              style={{ flex: 1 }}
            />
          )}

          {/* Loading overlay */}
          {webViewLoading && (
            <View className="absolute inset-0 items-center justify-center bg-white">
              <ActivityIndicator size="large" color="#3F9243" />
              <Text className="font-sans text-[#474348] mt-3 text-[14px]">
                Loading secure checkout...
              </Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default ConfirmPlan;
