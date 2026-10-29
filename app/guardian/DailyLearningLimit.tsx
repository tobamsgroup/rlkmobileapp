import { firstName } from '@/components/LearnerProgress';
import {
  CloudCard,
  CloudIllustration,
  ControlIntro,
  ControlsHeader,
  DetailBody,
  DetailBodySkeleton,
  DetailScreen,
  FooterActions,
  InfoNote,
  OffStateCard,
  RadioOption,
  SectionLabel,
  WhyCard,
} from '@/components/LearningTimeControls';
import {
  useControlDraft,
  useLearnerOption,
} from '@/hooks/useLearningTimeControls';
import { LimitReachedAction } from '@/types/learningTimeControls';
import {
  DAILY_LIMIT_OPTIONS,
  RECOMMENDED_DAILY_LIMIT,
} from '@/utils/learningTime';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

const LIMIT_ACTIONS: {
  value: LimitReachedAction;
  label: string;
  description: string;
}[] = [
  {
    value: 'reminder',
    label: 'Show a reminder',
    description:
      'Let learner know they have reached their daily limit with a friendly message.',
  },
  {
    value: 'pause',
    label: 'Pause new learning until the next day',
    description:
      'Learner won’t be able to start new books or activities until tomorrow.',
  },
];

const DailyLearningLimit = () => {
  const params = useLocalSearchParams<{ kidId: string }>();
  const [kid, setKid] = useState(params.kidId);
  const { learner, isLoading: loadingLearner } = useLearnerOption(kid);
  const { draft, update, dirty, isLoading, saving, submit, cancel } =
    useControlDraft(kid, 'dailyLimit', 'Daily learning limit saved');
  const name = firstName(learner?.name) || 'this learner';

  return (
    <DetailScreen>
      <ControlsHeader
        title="Daily Learning Limit"
        learner={learner}
        loading={loadingLearner}
        onSelectKid={setKid}
      />
      {isLoading || !draft ? (
        <DetailBodySkeleton />
      ) : (
        <DetailBody>
          <ControlIntro
            control="dailyLimit"
            description={`Choose how long ${name} can learn on RLKids each day.`}
            enabled={draft.enabled}
            onToggle={(enabled) => update({ enabled })}
          />

          {draft.enabled ? (
            <>
              <SectionLabel title="Select daily limit" />
              {DAILY_LIMIT_OPTIONS.map((minutes) => (
                <RadioOption
                  key={minutes}
                  label={`${minutes} minutes`}
                  selected={draft.minutes === minutes}
                  recommended={minutes === RECOMMENDED_DAILY_LIMIT}
                  onPress={() => update({ minutes })}
                />
              ))}

              <View className="border-t border-[#E5E5E5] mt-2 pt-6">
                <SectionLabel title="When the limit reached" />
                {LIMIT_ACTIONS.map((action) => (
                  <RadioOption
                    key={action.value}
                    label={action.label}
                    description={action.description}
                    selected={draft.action === action.value}
                    onPress={() => update({ action: action.value })}
                  />
                ))}
              </View>

              <InfoNote
                  title="The daily limit counts only active learning time, like reading or completing learning activities."
              />
            </>
          ) : (
            <>
              <OffStateCard
                title="No daily learning limit set"
                description="This learner can learn for as long as they like each day, unless other controls (like learning schedule) are enabled."
              />
              <WhyCard
                title="Why set a daily limit?"
                description="A daily limit helps the learner develop healthy learning habits, stay focused and maintain a balanced routine."
              />
              <CloudCard
                tone="green"
                illustration={CloudIllustration.books}
                title="Healthy learning habits"
                description="Short breaks can help the learner stay energized, focused and enjoy learning more."
              />
            </>
          )}
        </DetailBody>
      )}
      {(draft?.enabled || dirty) && (
        <FooterActions
          dirty={dirty}
          saving={saving}
          onSave={submit}
          onCancel={cancel}
        />
      )}
    </DetailScreen>
  );
};

export default DailyLearningLimit;
