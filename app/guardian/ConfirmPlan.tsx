import { fetchKids } from '@/actions/learners';
import {
  confirmCheckoutSession,
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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { twMerge } from 'tailwind-merge';

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
  const [addedKidIds, setAddedKidIds] = useState<string[]>([]);

  const params = useLocalSearchParams();
  const selectedKidId = params.kid as string;

  const plan = planId && PLAN_DETAILS[planId] ? PLAN_DETAILS[planId] : null;

  const { data: kidsWithSubs = [] } = useQuery({
    queryKey: ['guardian-kids'],
    queryFn: async () => {
      return await fetchKids();
    },
  });

  const remainingKids = useMemo(
    () => kidsWithSubs.filter((k) => k._id !== selectedKidId),
    [kidsWithSubs, selectedKidId],
  );

  const selectedKid = useMemo(
    () => kidsWithSubs.find((k) => k._id === selectedKidId),
    [kidsWithSubs, selectedKidId],
  );

  const totalKids = 1 + addedKidIds.length;
  const totalPrice = (plan?.price ?? 0) * totalKids;

  const toggleKid = (kidId: string) => {
    setAddedKidIds((prev) =>
      prev.includes(kidId)
        ? prev.filter((id) => id !== kidId)
        : [...prev, kidId],
    );
  };

  const handleCompletePayment = async () => {
    if (!planId || !selectedKidId) return;
    setLoading(true);
    try {
      const result = await createCheckoutSession(selectedKidId, planId);

      if ('upgraded' in result && result.upgraded) {
        queryClient.invalidateQueries({ queryKey: ['subscription'] });
        queryClient.invalidateQueries({ queryKey: ['guardian-kids'] });
        queryClient.invalidateQueries({ queryKey: ['billing-history'] });
        router.replace('/guardian/Subscription');
        showToast('success', 'Plan upgraded successfully.');
        return;
      }

      //@ts-ignore
      setCheckoutUrl(result.url);
    } catch (error: any) {
      Alert.alert('Payment Error', error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationChange = async (navState: { url: string }) => {
    if (navState.url.startsWith(SUCCESS_URL) && !successHandledRef.current) {
      successHandledRef.current = true;
      setCheckoutUrl(null);

      // try {
      //   const sessionId = new URL(navState.url).searchParams.get('session_id');
      //   if (sessionId) await confirmCheckoutSession(sessionId);
      // } catch {}

      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['guardian-kids'] });
      queryClient.invalidateQueries({ queryKey: ['billing-history'] });
      router.replace('/guardian/Subscription');
      showToast('success', 'Payment Successful.');
      successHandledRef.current = false;
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
            Review Selection
          </Text>
          <Text className="mt-2 text-[16px] text-[#6C686C] font-sans leading-[1.5]">
            Just one step to go! Review your selected plan before checkout.
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
                /month per learner
              </Text>
            </Text>
            <View className="flex-row items-center gap-2 mt-3">
              <Text className="text-[#474348] font-sansMedium text-[16px]">
                {plan.noOfBooks} Books
              </Text>
              <View className="bg-[#D9D9D9] w-2 h-2 rounded-full" />
              <Text className="text-[#474348] font-sansMedium text-[16px]">
                {totalKids} Learner{totalKids > 1 ? 's' : ''}
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

            <View className="mt-8">
              <Text className="text-[#221D23] font-sansMedium text-[16px]">
                Learner
              </Text>
              <View className="gap-4 flex-wrap mt-6 flex-row">
                <LearnerChip
                  name={selectedKid?.name?.split(' ')[0] || ''}
                  id={selectedKidId}
                />
              </View>

              {/* {remainingKids?.length > 0 && (
                <>
                  <Text className="font-sansMedium text-[#221D23] text-[16px] mt-6 mb-2">
                    Also Upgrade Other Learners
                  </Text>
                  <Text className="font-sansItalic text-[#474348]">
                    Select any learners you'd like to upgrade to {plan.name}{' '}
                    too.
                  </Text>
                  <View className="flex-row flex-wrap gap-3 mt-4">
                    {remainingKids.map((kid) => {
                      const isAdded = addedKidIds.includes(kid._id);
                      return isAdded ? (
                        <LearnerChip
                          key={kid._id}
                          name={kid.name?.split(' ')[0] || ''}
                          id={kid._id}
                          added
                          onPress={() => toggleKid(kid._id)}
                        />
                      ) : (
                        <Pressable
                          key={kid._id}
                          onPress={() => toggleKid(kid._id)}
                          className="bg-[#D3D2D31A] px-2 py-1.5 rounded-[12px] flex-row items-center gap-1 border border-[#D3D2D366]"
                        >
                          <Text className="text-[#221D23] text-[16px] font-sansMedium">
                            {kid.name?.split(' ')[0]}
                          </Text>
                          <View className="w-6 h-6 rounded-full items-center justify-center bg-[#D3D2D333]">
                            <ICONS.Add
                              width={16}
                              height={16}
                              fill={'#221D23'}
                              strokeWidth={2}
                            />
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </>
              )} */}
            </View>

            <View className="border-b border-b-[#D3D2D366] my-8 w-full" />
            <View className="w-full flex-row justify-between items-center">
              <Text className="text-[18px] font-sansMedium text-[#221D23]">
                Amount to pay today
              </Text>
              <Text className="text-[18px] font-sansMedium text-[#221D23]">
                £{totalPrice.toFixed(2)}
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
                  £{totalPrice.toFixed(2)}
                </Text>
              </View>
              {totalKids > 1 && (
                <View className="w-full flex-row justify-between items-center">
                  <Text className="text-[16px] font-sans text-[#474348]">
                    Learners
                  </Text>
                  <Text className="text-[16px] font-sans text-[#474348]">
                    £{plan.price.toFixed(2)} × {totalKids} Learners
                  </Text>
                </View>
              )}
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
              text={loading ? 'PROCESSING...' : 'COMPLETE PAYMENT'}
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
        <SafeAreaView  className="flex-1 bg-white">
          <View style={{paddingTop:Constants.statusBarHeight
          }} className="flex-row items-center justify-between px-4 py-3 border-b border-[#D3D2D366]">
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

          {checkoutUrl && (
            <WebView
              source={{ uri: checkoutUrl }}
              onNavigationStateChange={handleNavigationChange}
              onLoadStart={() => setWebViewLoading(true)}
              onLoadEnd={() => setWebViewLoading(false)}
              onShouldStartLoadWithRequest={(request) => {
                // Block non-http schemes (stripe://, tel://, itms-appss://, etc.)
                // so they don't trigger -1004 errors. Stripe's checkout page
                // injects these for Apple Pay / deep links.
                return (
                  request.url.startsWith('https://') ||
                  request.url.startsWith('http://')
                );
              }}
              originWhitelist={['https://*', 'http://*']}
              javaScriptEnabled
              domStorageEnabled
              style={{ flex: 1 }}
            />
          )}

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

const LearnerChip = ({
  name,
  id,
  added,
  onPress,
}: {
  added?: boolean;
  name: string;
  id: string;
  onPress?: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      className={twMerge(
        'bg-[#221D23] px-2 py-1.5 rounded-[12px] flex-row items-center gap-1',
        added && 'bg-[#1671D91A] border-[#1671D9] border',
      )}
    >
      <Text
        className={twMerge(
          'text-white text-[16px] font-sansMedium',
          added && 'text-[#1671D9]',
        )}
      >
        {name}
      </Text>
      {added && (
        <View className="w-6 h-6 rounded-full items-center justify-center bg-white">
          <ICONS.Close width={16} height={16} />
        </View>
      )}
    </Pressable>
  );
};

export default ConfirmPlan;
