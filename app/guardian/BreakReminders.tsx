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
import {
  BREAK_INTERVAL_OPTIONS,
  RECOMMENDED_BREAK_INTERVAL,
} from '@/utils/learningTime';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';

const BreakReminders = () => {
  const params = useLocalSearchParams<{ kidId: string }>();
  const [kid, setKid] = useState(params.kidId);
  const { learner, isLoading: loadingLearner } = useLearnerOption(kid);
  const { draft, update, dirty, isLoading, saving, submit, cancel } =
    useControlDraft(kid, 'breakReminder', 'Break reminders saved');

  return (
    <DetailScreen>
      <ControlsHeader
        title="Break Reminders"
        learner={learner}
        loading={loadingLearner}
        onSelectKid={setKid}
      />
      {isLoading || !draft ? (
        <DetailBodySkeleton />
      ) : (
        <DetailBody>
          <ControlIntro
            control="breakReminder"
            description="Encourage short breakers to keep learning fun and effective."
            enabled={draft.enabled}
            onToggle={(enabled) => update({ enabled })}
          />

          {draft.enabled ? (
            <>
              <SectionLabel title="Remind after" />
              {BREAK_INTERVAL_OPTIONS.map((intervalMinutes) => (
                <RadioOption
                  key={intervalMinutes}
                  label={`${intervalMinutes} minutes`}
                  selected={draft.intervalMinutes === intervalMinutes}
                  recommended={intervalMinutes === RECOMMENDED_BREAK_INTERVAL}
                  onPress={() => update({ intervalMinutes })}
                />
              ))}
              <InfoNote
                className="mt-4"
                // title=""
                title="A break reminder will appear during the learner's session. If they choose to take a break, a 5-minute timer will start. They can return to learning whenever they're ready."
              />
            </>
          ) : (
            <>
              <OffStateCard
                title="Break reminders are off"
                description="This learner won’t receive any break reminders. You can turn this on when you are ready."
              />
              <WhyCard
                title="Why use break reminders?"
                description="Regular breaks help the learner stay focused, avoid fatigue and get the most out of their learning time."
              />
              <CloudCard
                tone="blue"
                illustration={CloudIllustration.alarm}
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

export default BreakReminders;
