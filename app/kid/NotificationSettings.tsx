import Button from '@/components/Button';
import Container from '@/components/Container';
import TopBackButton from '@/components/TopBackButton';
import {
  useKidNotificationSettings,
  useUpdateKidNotificationSettings,
} from '@/hooks/useKidNotificationSettings';
import { KidNotificationSettingsData } from '@/actions/kid-notification-settings';
import React, { useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';

const DEFAULTS: KidNotificationSettingsData = {
  xpMilestoneReached: true,
  badgeUnlocked: true,
  levelUp: true,
  activityCompleted: false,
  streakReminder: true,
  newContentAvailable: false,
};

const NotificationSettings = () => {
  const { data: settings } = useKidNotificationSettings();
  const { mutate, isPending } = useUpdateKidNotificationSettings();
  const [local, setLocal] = useState<KidNotificationSettingsData>(DEFAULTS);

  console.log({settings})

  useEffect(() => {
    if (settings) setLocal((prev) => ({ ...prev, ...settings }));
  }, [settings]);

  const toggle =
    (key: keyof KidNotificationSettingsData) => (v: boolean) =>
      setLocal((prev) => ({ ...prev, [key]: v }));

  return (
    <Container scrollable>
      <View className="px-6 py-5">
        <TopBackButton />
        <Text className="font-sansSemiBold text-dark text-[20px] mt-4">
          Notifications
        </Text>
        <Text className="mt-2 text-[16px] text-[#6C686C] font-sans leading-[1.5]">
          Control how and when you receive updates about your reading activity.
        </Text>
      </View>

      <View className="bg-white p-6">
        <View className="border border-[#C3E4C5] border-b-4 rounded-[16px] p-5 mb-6">
          <Text className="text-[#221D23] text-[16px] font-sansSemiBold mb-2">
            Achievement
          </Text>
          <Text className="leading-[1.5] font-sansItalic text-[#474348]">
            Get notified when you complete a milestone.
          </Text>
          <View className="border border-[#D3D2D366] rounded-[12px] mt-5">
            <View className="flex-row p-4">
              <View className="flex-1 border-b border-b-[#D3D2D366] pb-4">
                <Text className="text-[#221D23] font-sansSemiBold mb-2">
                  XP Milestone Reached
                </Text>
                <Text className="leading-[1.5] font-sans text-[#474348]">
                  Get notified when you reach a new XP milestone
                </Text>
              </View>
              <View className="flex-shrink-0">
                <Switch
                  style={{ transform: [{ scale: 0.8 }] }}
                  value={local.xpMilestoneReached}
                  onValueChange={toggle('xpMilestoneReached')}
                  trackColor={{ false: '#D3D2D3', true: '#3F9243' }}
                />
              </View>
            </View>
            <View className="flex-row p-4">
              <View className="flex-1 border-b border-b-[#D3D2D366] pb-4">
                <Text className="text-[#221D23] font-sansSemiBold mb-2">
                  Badge Unlocked
                </Text>
                <Text className="leading-[1.5] font-sans text-[#474348]">
                  When you unlock a new badge
                </Text>
              </View>
              <View className="flex-shrink-0">
                <Switch
                  style={{ transform: [{ scale: 0.8 }] }}
                  value={local.badgeUnlocked}
                  onValueChange={toggle('badgeUnlocked')}
                  trackColor={{ false: '#D3D2D3', true: '#3F9243' }}
                />
              </View>
            </View>
            <View className="flex-row p-4">
              <View className="flex-1 border-b border-b-[#D3D2D366] pb-4">
                <Text className="text-[#221D23] font-sansSemiBold mb-2">
                  Level Up
                </Text>
                <Text className="leading-[1.5] font-sans text-[#474348]">
                  Get notified when you reach a new level
                </Text>
              </View>
              <View className="flex-shrink-0">
                <Switch
                  style={{ transform: [{ scale: 0.8 }] }}
                  value={local.levelUp}
                  onValueChange={toggle('levelUp')}
                  trackColor={{ false: '#D3D2D3', true: '#3F9243' }}
                />
              </View>
            </View>
          </View>
        </View>

        <View className="border border-[#C3E4C5] border-b-4 rounded-[16px] p-5 mb-6">
          <Text className="text-[#221D23] text-[16px] font-sansSemiBold mb-2">
            Learning Activities
          </Text>
          <Text className="leading-[1.5] font-sansItalic text-[#474348]">
            Get notified about your learning activities
          </Text>
          <View className="border border-[#D3D2D366] rounded-[12px] mt-5">
            <View className="flex-row p-4">
              <View className="flex-1 border-b border-b-[#D3D2D366] pb-4">
                <Text className="text-[#221D23] font-sansSemiBold mb-2">
                  Activity Completed
                </Text>
                <Text className="leading-[1.5] font-sans text-[#474348]">
                  Get notified when you complete an activity
                </Text>
              </View>
              <View className="flex-shrink-0">
                <Switch
                  style={{ transform: [{ scale: 0.8 }] }}
                  value={local.activityCompleted}
                  onValueChange={toggle('activityCompleted')}
                  trackColor={{ false: '#D3D2D3', true: '#3F9243' }}
                />
              </View>
            </View>
            <View className="flex-row p-4">
              <View className="flex-1 border-b border-b-[#D3D2D366] pb-4">
                <Text className="text-[#221D23] font-sansSemiBold mb-2">
                  Streak Reminder
                </Text>
                <Text className="leading-[1.5] font-sans text-[#474348]">
                  Get reminded about your streak everyday
                </Text>
              </View>
              <View className="flex-shrink-0">
                <Switch
                  style={{ transform: [{ scale: 0.8 }] }}
                  value={local.streakReminder}
                  onValueChange={toggle('streakReminder')}
                  trackColor={{ false: '#D3D2D3', true: '#3F9243' }}
                />
              </View>
            </View>
            <View className="flex-row p-4">
              <View className="flex-1 border-b border-b-[#D3D2D366] pb-4">
                <Text className="text-[#221D23] font-sansSemiBold mb-2">
                  New Content Available
                </Text>
                <Text className="leading-[1.5] font-sans text-[#474348]">
                  Get notified when there are new content available for you
                </Text>
              </View>
              <View className="flex-shrink-0">
                <Switch
                  style={{ transform: [{ scale: 0.8 }] }}
                  value={local.newContentAvailable}
                  onValueChange={toggle('newContentAvailable')}
                  trackColor={{ false: '#D3D2D3', true: '#3F9243' }}
                />
              </View>
            </View>
          </View>
        </View>

        <Button
          text="SAVE MY SETTINGS"
          onPress={() => mutate(local)}
          loading={isPending}
        />
      </View>
    </Container>
  );
};

export default NotificationSettings;
