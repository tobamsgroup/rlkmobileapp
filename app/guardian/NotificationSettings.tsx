import Container from '@/components/Container';
import TopBackButton from '@/components/TopBackButton';
import React, { useEffect, useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from '@/hooks/useNotificationSettings';
import Button from '@/components/Button';
import { NotificationSettingsData } from '@/actions/notification-settings';

const DEFAULTS: NotificationSettingsData = {
  accountVerified: { inApp: false, email: true },
  childProfileCreated: { inApp: true, email: false },
  newLearnerProfile: { inApp: true, email: false },
  preferencesSaved: { inApp: false, email: false },
  passwordChange: { inApp: false, email: false },
  childPinUpdate: { inApp: false, email: false },
  newDeviceLogin: { inApp: false, email: false },
  suspiciousLoginActivity: { inApp: false, email: false },
  weeklyLearningReport: { inApp: false, email: true },
  ideaWall: { inApp: true, email: false },
  submissionApproved: { inApp: false, email: false },
  policyTermsUpdate: { inApp: false, email: false },
};

const NotificationSettings = () => {
  const { data: settings } = useNotificationSettings();
  const { mutate, isPending } = useUpdateNotificationSettings();
  const [local, setLocal] = useState<NotificationSettingsData>(DEFAULTS);

  useEffect(() => {
    if (settings) setLocal((prev) => ({ ...prev, ...settings }));
  }, [settings]);

  const toggle =
    (key: keyof NotificationSettingsData, channel: 'inApp' | 'email') =>
    (v: boolean) =>
      setLocal((prev) => ({ ...prev, [key]: { ...prev[key], [channel]: v } }));

  return (
    <Container scrollable>
      <View className="px-6 py-5">
        <TopBackButton />
        <Text className="font-sansSemiBold text-dark text-[20px] mt-4">
          Notifications
        </Text>
        <Text className="mt-2 text-[16px] text-[#6C686C] font-sans leading-[1.5]">
          Control how and when you receive updates about your children's reading
          activity.
        </Text>
      </View>
      <View className="bg-white p-6 border-b border-[#D3D2D366]">
        <Text className="text-[16px] text-dark font-sansSemiBold mb-2.5">
          Notification Channels
        </Text>
        <Text className="text-[#474348] font-sansItalic mb-2.5">
          Choose where you'd like to receive notifications.
        </Text>
        <View className="border-[#D3D2D366] py-2 border rounded-[8px] flex-row">
          <Pressable className="flex-1 items-center justify-center">
            <Text className="text-dark font-sans leading-[1.5]">In-App</Text>
          </Pressable>
          <View className="h-[20px] border-r border-[#D3D2D366]" />
          <Pressable className="flex-1 items-center justify-center">
            <Text className="text-dark font-sans leading-[1.5]">Email</Text>
          </Pressable>
        </View>
      </View>
      <View className="bg-white p-6">
        <View className="border border-[#C3E4C5] border-b-4 rounded-[16px] p-5 mb-6">
          <Text className="text-[#221D23] text-[16px] font-sansSemiBold mb-2">
            Registrations
          </Text>
          <Text className="leading-[1.5] font-sansItalic text-[#474348]">
            Get Notifications when your account is up and verified.
          </Text>
          <View className="border border-[#D3D2D366] p-4 rounded-[12px] mt-5">
            <Text className="text-[#221D23] font-sansSemiBold mb-2">
              Account Verified
            </Text>
            <Text className="leading-[1.5] font-sans text-[#474348]">
              Get Notifications when your account is up and verified.
            </Text>
            <View className="border-[#D3D2D366] py-2 border rounded-[8px] flex-row mt-3">
              <Pressable className="flex-1 items-center justify-center" />
              <View className="h-[20px] border-r border-[#D3D2D366]" />
              <Pressable className="flex-1 items-center flex-row justify-center">
                <Switch value={local.accountVerified.email} onValueChange={toggle('accountVerified', 'email')} trackColor={{ false: '#D3D2D3', true: '#3F9243' }} />
              </Pressable>
            </View>
          </View>
        </View>
        <View className="border border-[#C3E4C5] border-b-4 rounded-[16px] p-5 mb-6">
          <Text className="text-[#221D23] text-[16px] font-sansSemiBold mb-2">
            Profile Management
          </Text>
          <Text className="leading-[1.5] font-sansItalic text-[#474348]">
            Get Updates related to child profiles linked to your account.
          </Text>
          <View className="border border-[#D3D2D366] p-4 rounded-[12px] mt-5">
            <View className="pb-3 border-b border-b-[#D3D2D366]">
              <Text className="text-[#221D23] font-sansSemiBold mb-2">
                Child Profile Created
              </Text>
              <Text className="leading-[1.5] font-sans text-[#474348]">
                Get notified when a child’s profile is created
              </Text>
              <View className="border-[#D3D2D366] py-2 border rounded-[8px] flex-row mt-3">
               <Pressable className="flex-1 items-center flex-row justify-center">
                  <Switch value={local.childProfileCreated.inApp} onValueChange={toggle('childProfileCreated', 'inApp')} trackColor={{ false: '#D3D2D3', true: '#3F9243' }} />
                </Pressable>
                <View className="h-[20px] border-r border-[#D3D2D366]" />
                <Pressable className="flex-1 items-center justify-center" />
              </View>
            </View>
            <View className="py-3 border-b border-b-[#D3D2D366]">
              <Text className="text-[#221D23] font-sansSemiBold mb-2">
                New learner profile
              </Text>
              <Text className="leading-[1.5] font-sans text-[#474348]">
                Get notified when a new learner profile is created.
              </Text>
              <View className="border-[#D3D2D366] py-2 border rounded-[8px] flex-row mt-3">
                <Pressable className="flex-1 items-center flex-row justify-center">
                  <Switch value={local.newLearnerProfile.inApp} onValueChange={toggle('newLearnerProfile', 'inApp')} trackColor={{ false: '#D3D2D3', true: '#3F9243' }} />
                </Pressable>
                <View className="h-[20px] border-r border-[#D3D2D366]" />
                <Pressable className="flex-1 items-center justify-center" />
              </View>
            </View>
            <View className="py-3 border-b border-b-[#D3D2D366]">
              <Text className="text-[#221D23] font-sansSemiBold mb-2">
                Preferences saved
              </Text>
              <Text className="leading-[1.5] font-sans text-[#474348]">
                Get Notified on Child’s Learning preferences
              </Text>
              <View className="border-[#D3D2D366] py-2 border rounded-[8px] flex-row mt-3">
                <Pressable className="flex-1 items-center flex-row justify-center">
                  <Switch value={local.preferencesSaved.inApp} onValueChange={toggle('preferencesSaved', 'inApp')} trackColor={{ false: '#D3D2D3', true: '#3F9243' }} />
                </Pressable>
                <View className="h-[20px] border-r border-[#D3D2D366]" />
                <Pressable className="flex-1 items-center justify-center" />
              </View>
            </View>
          </View>
        </View>
        <View className="border border-[#C3E4C5] border-b-4 rounded-[16px] p-5 mb-6">
          <Text className="text-[#221D23] text-[16px] font-sansSemiBold mb-2">
            Security
          </Text>
          <Text className="leading-[1.5] font-sansItalic text-[#474348]">
            Critical alerts for account security events.
          </Text>
          <View className="border border-[#D3D2D366] p-4 rounded-[12px] mt-5">
            <View className="pb-3 border-b border-b-[#D3D2D366]">
              <Text className="text-[#221D23] font-sansSemiBold mb-2">
                Password Change
              </Text>
              <Text className="leading-[1.5] font-sans text-[#474348]">
                Get notified on password change.
              </Text>
              <View className="border-[#D3D2D366] py-2 border rounded-[8px] flex-row mt-3">
                <Pressable className="flex-1 items-center justify-center" />
                <View className="h-[20px] border-r border-[#D3D2D366]" />
                <Pressable className="flex-1 items-center flex-row justify-center">
                  <Switch value={local.passwordChange.email} onValueChange={toggle('passwordChange', 'email')} trackColor={{ false: '#D3D2D3', true: '#3F9243' }} />
                </Pressable>
              </View>
            </View>
            <View className="py-3 border-b border-b-[#D3D2D366]">
              <Text className="text-[#221D23] font-sansSemiBold mb-2">
                Child Pin Update
              </Text>
              <Text className="leading-[1.5] font-sans text-[#474348]">
                Get notified on pin change
              </Text>
              <View className="border-[#D3D2D366] py-2 border rounded-[8px] flex-row mt-3">
                <Pressable className="flex-1 items-center flex-row justify-center">
                  <Switch value={local.childPinUpdate.inApp} onValueChange={toggle('childPinUpdate', 'inApp')} trackColor={{ false: '#D3D2D3', true: '#3F9243' }} />
                </Pressable>
                <View className="h-[20px] border-r border-[#D3D2D366]" />
                <Pressable className="flex-1 items-center justify-center" />
              </View>
            </View>
            <View className="py-3 border-b border-b-[#D3D2D366]">
              <Text className="text-[#221D23] font-sansSemiBold mb-2">
                New Device Login
              </Text>
              <Text className="leading-[1.5] font-sans text-[#474348]">
                Get notified when a login is detected from.
              </Text>
              <View className="border-[#D3D2D366] py-2 border rounded-[8px] flex-row mt-3">
                <Pressable className="flex-1 items-center flex-row justify-center">
                  <Switch value={local.newDeviceLogin.inApp} onValueChange={toggle('newDeviceLogin', 'inApp')} trackColor={{ false: '#D3D2D3', true: '#3F9243' }} />
                </Pressable>
                <View className="h-[20px] border-r border-[#D3D2D366]" />
                <Pressable className="flex-1 items-center flex-row justify-center">
                  <Switch value={local.newDeviceLogin.email} onValueChange={toggle('newDeviceLogin', 'email')} trackColor={{ false: '#D3D2D3', true: '#3F9243' }} />
                </Pressable>
              </View>
            </View>
            <View className="pt-3 ">
              <Text className="text-[#221D23] font-sansSemiBold mb-2">
                Suspicious Login Activity
              </Text>
              <Text className="leading-[1.5] font-sans text-[#474348]">
                Get notified of unfamiliar login activity.
              </Text>
              <View className="border-[#D3D2D366] py-2 border rounded-[8px] flex-row mt-3">
                <Pressable className="flex-1 items-center justify-center" />
                <View className="h-[20px] border-r border-[#D3D2D366]" />
                <Pressable className="flex-1 items-center flex-row justify-center">
                  <Switch value={local.suspiciousLoginActivity.email} onValueChange={toggle('suspiciousLoginActivity', 'email')} trackColor={{ false: '#D3D2D3', true: '#3F9243' }} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        <View className="border border-[#C3E4C5] border-b-4 rounded-[16px] p-5 mb-6">
          <Text className="text-[#221D23] text-[16px] font-sansSemiBold mb-2">
            Progress Reporting
          </Text>
          <Text className="leading-[1.5] font-sansItalic text-[#474348]">
            Periodic summaries of your child's learning activity.
          </Text>
          <View className="border border-[#D3D2D366] p-4 rounded-[12px] mt-5">
            <Text className="text-[#221D23] font-sansSemiBold mb-2">
              Weekly Learning Report
            </Text>
            <Text className="leading-[1.5] font-sans text-[#474348]">
              Get notified on your child’s weekly learning.
            </Text>
            <View className="border-[#D3D2D366] py-2 border rounded-[8px] flex-row mt-3">
              <Pressable className="flex-1 items-center justify-center" />
              <View className="h-[20px] border-r border-[#D3D2D366]" />
              <Pressable className="flex-1 items-center flex-row justify-center">
                <Switch value={local.weeklyLearningReport.email} onValueChange={toggle('weeklyLearningReport', 'email')} trackColor={{ false: '#D3D2D3', true: '#3F9243' }} />
              </Pressable>
            </View>
          </View>
        </View>
        <View className="border border-[#C3E4C5] border-b-4 rounded-[16px] p-5 mb-6">
          <Text className="text-[#221D23] text-[16px] font-sansSemiBold mb-2">
            Content Moderation
          </Text>
          <Text className="leading-[1.5] font-sansItalic text-[#474348]">
            Notifications about your child's Idea Wall and submissions.
          </Text>
          <View className="border border-[#D3D2D366] p-4 rounded-[12px] mt-5">
            <View className="pb-3 border-b border-b-[#D3D2D366]">
              <Text className="text-[#221D23] font-sansSemiBold mb-2">
                Idea Wall
              </Text>
              <Text className="leading-[1.5] font-sans text-[#474348]">
                Get notified when your child’s submission is flagged for review.
              </Text>
              <View className="border-[#D3D2D366] py-2 border rounded-[8px] flex-row mt-3">
                <Pressable className="flex-1 items-center flex-row justify-center">
                  <Switch value={local.ideaWall.inApp} onValueChange={toggle('ideaWall', 'inApp')} trackColor={{ false: '#D3D2D3', true: '#3F9243' }} />
                </Pressable>
                <View className="h-[20px] border-r border-[#D3D2D366]" />
                <Pressable className="flex-1 items-center justify-center" />
              </View>
            </View>
            <View className="pt-3 ">
              <Text className="text-[#221D23] font-sansSemiBold mb-2">
                Submission Approved
              </Text>
              <Text className="leading-[1.5] font-sans text-[#474348]">
                Get notified when your child’s Idea Wall is published.
              </Text>
              <View className="border-[#D3D2D366] py-2 border rounded-[8px] flex-row mt-3">
                <Pressable className="flex-1 items-center flex-row justify-center">
                  <Switch value={local.submissionApproved.inApp} onValueChange={toggle('submissionApproved', 'inApp')} trackColor={{ false: '#D3D2D3', true: '#3F9243' }} />
                </Pressable>
                <View className="h-[20px] border-r border-[#D3D2D366]" />
                <Pressable className="flex-1 items-center justify-center" />
              </View>
            </View>
          </View>
        </View>
        <View className="border border-[#C3E4C5] border-b-4 rounded-[16px] p-5 mb-6">
          <Text className="text-[#221D23] text-[16px] font-sansSemiBold mb-2">
            Data Privacy
          </Text>
          <Text className="leading-[1.5] font-sansItalic text-[#474348]">
            Mandatory notices about policy updates.
          </Text>
          <View className="border border-[#D3D2D366] p-4 rounded-[12px] mt-5">
            <Text className="text-[#221D23] font-sansSemiBold mb-2">
              Policy / Terms Update
            </Text>
            <Text className="leading-[1.5] font-sans text-[#474348]">
              Get notified when the Terms or Privacy Policy is updated.
            </Text>
            <View className="border-[#D3D2D366] py-2 border rounded-[8px] flex-row mt-3">
              <Pressable className="flex-1 items-center justify-center" />
              <View className="h-[20px] border-r border-[#D3D2D366]" />
              <Pressable className="flex-1 items-center flex-row justify-center">
                <Switch value={local.policyTermsUpdate.email} onValueChange={toggle('policyTermsUpdate', 'email')} trackColor={{ false: '#D3D2D3', true: '#3F9243' }} />
              </Pressable>
            </View>
          </View>
        </View>

        <Button text='SAVE MY SETTINGS' onPress={() => mutate(local)} loading={isPending} />
      </View>
    </Container>
  );
};

export default NotificationSettings;
