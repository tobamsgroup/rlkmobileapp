import { firstName } from '@/components/LearnerProgress';
import {
  CloudCard,
  CloudIllustration,
  ControlIntro,
  ControlsHeader,
  DayChip,
  DetailBody,
  DetailBodySkeleton,
  DetailScreen,
  FooterActions,
  InfoNote,
  OffStateCard,
  SectionLabel,
  TimeSelect,
  WhyCard,
} from '@/components/LearningTimeControls';
import {
  useControlDraft,
  useLearnerOption,
} from '@/hooks/useLearningTimeControls';
import { WeekDay } from '@/types/learningTimeControls';
import { WEEK_DAYS } from '@/utils/learningTime';
import { showToast } from '@/utils/toast';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

const LearningSchedule = () => {
  const params = useLocalSearchParams<{ kidId: string }>();
  const [kid, setKid] = useState(params.kidId);
  const { learner, isLoading: loadingLearner } = useLearnerOption(kid);
  const { draft, update, dirty, isLoading, saving, submit, cancel } =
    useControlDraft(kid, 'schedule', 'Learning schedule saved');
  const name = firstName(learner?.name) || 'This learner';

  const toggleDay = (day: WeekDay) => {
    if (!draft) return;
    const days = draft.days.includes(day)
      ? draft.days.filter((d) => d !== day)
      : [...draft.days, day];
    // Keep week order so the dirty check isn't fooled by ordering
    update({
      days: WEEK_DAYS.map((d) => d.value).filter((d) => days.includes(d)),
    });
  };

  const handleSave = () => {
    if (draft?.enabled) {
      if (!draft.days.length) {
        showToast('error', 'Select at least one learning day');
        return;
      }
      if (draft.startTime >= draft.endTime) {
        showToast('error', 'End time must be after start time');
        return;
      }
    }
    submit();
  };

  return (
    <DetailScreen>
      <ControlsHeader
        title="Learning Schedule"
        learner={learner}
        loading={loadingLearner}
        onSelectKid={setKid}
      />
      {isLoading || !draft ? (
        <DetailBodySkeleton />
      ) : (
        <DetailBody>
          <ControlIntro
            control="schedule"
            description="Choose the days and times the learner is allowed to learn."
            enabled={draft.enabled}
            onToggle={(enabled) => update({ enabled })}
          />

          {draft.enabled ? (
            <>
              <SectionLabel
                title="Choose days"
                subtitle="Select the days this learner can access"
              />
              <View className="flex-row flex-wrap gap-x-6 gap-y-4 mb-8">
                {WEEK_DAYS.map((day) => (
                  <DayChip
                    key={day.value}
                    label={day.label}
                    selected={draft.days.includes(day.value)}
                    onPress={() => toggleDay(day.value)}
                  />
                ))}
              </View>

              <SectionLabel
                title="Set time period"
                subtitle="Select the start and end time for the selected days"
              />
              <View className="flex-row items-end gap-3 mb-6">
                <TimeSelect
                  label="Start time"
                  value={draft.startTime}
                  onChange={(startTime) => update({ startTime })}
                />
                <Text className="text-[18px] text-dark mb-4">—</Text>
                <TimeSelect
                  label="End time"
                  value={draft.endTime}
                  onChange={(endTime) => update({ endTime })}
                />
              </View>

              <InfoNote
                title={`${name} can only select learning content during the selected days and time period.`}
              />
            </>
          ) : (
            <>
              <OffStateCard
                title="No learning schedule set"
                description="This learner can currently access learning content at any time."
              />
              <WhyCard
                title="Why set a learning schedule?"
                description="A learning schedule helps create structure, reduces distractions and supports a healthy balance."
              />
              <CloudCard
                tone="purple"
                illustration={CloudIllustration.calendar}
                title="Set a consistent routine"
                description="Choose the days and the times that works best for learning."
              />
            </>
          )}
        </DetailBody>
      )}
      {(draft?.enabled || dirty) && (
        <FooterActions
          dirty={dirty}
          saving={saving}
          onSave={handleSave}
          onCancel={cancel}
        />
      )}
    </DetailScreen>
  );
};

export default LearningSchedule;
