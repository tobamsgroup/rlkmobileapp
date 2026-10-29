import {
  CheckOption,
  ControlIntro,
  ControlsHeader,
  DetailBody,
  DetailBodySkeleton,
  DetailScreen,
  FooterActions,
  InfoNote,
  SectionLabel,
} from '@/components/LearningTimeControls';
import {
  useControlDraft,
  useLearnerOption,
} from '@/hooks/useLearningTimeControls';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';

const LearningNotifications = () => {
  const params = useLocalSearchParams<{ kidId: string }>();
  const [kid, setKid] = useState(params.kidId);
  const { learner, isLoading: loadingLearner } = useLearnerOption(kid);
  const { controls, draft, update, dirty, isLoading, saving, submit, cancel } =
    useControlDraft(kid, 'notifications', 'Learning notifications saved');

  // Dependent notifications follow the *saved* state of their control
  const dailyLimitOn = !!controls?.dailyLimit.enabled;
  const breakRemindersOn = !!controls?.breakReminder.enabled;

  return (
    <DetailScreen>
      <ControlsHeader
        title="Learning Notifications"
        learner={learner}
        loading={loadingLearner}
        onSelectKid={setKid}
      />
      {isLoading || !draft ? (
        <DetailBodySkeleton />
      ) : (
        <DetailBody>
          <ControlIntro
            control="notifications"
            description="Choose what learning updates you’d like to receive about this learner."
          />
          <SectionLabel title="Notification types" />
          <CheckOption
            title="Session Started"
            description="Get notified when this learner starts a learning session"
            checked={draft.sessionStarted}
            onPress={() => update({ sessionStarted: !draft.sessionStarted })}
          />
          <CheckOption
            title="Daily Limit Reached"
            description={
              dailyLimitOn
                ? 'Know when they reach their daily learning limit'
                : 'Available when Daily Learning Limit is enabled.'
            }
            disabled={!dailyLimitOn}
            checked={dailyLimitOn && draft.dailyLimitReached}
            onPress={() =>
              update({ dailyLimitReached: !draft.dailyLimitReached })
            }
          />
          <CheckOption
            title="Break Reminder Sent"
            description={
              breakRemindersOn
                ? 'Get notified when a break reminder is shown'
                : 'Available when Break Reminders is enabled.'
            }
            disabled={!breakRemindersOn}
            checked={breakRemindersOn && draft.breakReminderSent}
            onPress={() =>
              update({ breakReminderSent: !draft.breakReminderSent })
            }
          />
          <InfoNote title="Each notification is optional and independent. Notifications are set per learner, not global." />
        </DetailBody>
      )}
      <FooterActions
        dirty={dirty}
        saving={saving}
        onSave={submit}
        onCancel={cancel}
      />
    </DetailScreen>
  );
};

export default LearningNotifications;
