import { fetchKidsCourses } from '@/actions/curriculum';
import { fetchKids } from '@/actions/learners';
import { ICONS } from '@/assets/icons';
import { IMAGES } from '@/assets/images';
import Button from '@/components/Button';
import CreateChildProfile from '@/components/Home/CreateChildProfile';
import { SimpleInput } from '@/components/Input';
import LearnerCard, {
  LearnerCardSkeleton,
  NoLearnersFound,
} from '@/components/Learners/LearnersCard';
import TrialLockModal from '@/components/Subscription/TrialLockModal';
import { groupByKid, GroupedByKid } from '@/utils';
import { scaleHeight, scaleWidth } from '@/utils/scale';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Learners() {
  const [filteredData, setFilteredData] = useState<GroupedByKid[]>([]);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const { data: allKids, isLoading: isLoadingALlKids } = useQuery({
    queryKey: ['guardian-kids'],
    queryFn: async () => {
      return await fetchKids();
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['kids-courses'],
    queryFn: async () => {
      return await fetchKidsCourses();
    },
  });

  const groupedData = useMemo(() => {
    if (!allKids) return [];
    const coursesByKid = groupByKid(data ?? []).reduce<
      Record<string, GroupedByKid>
    >((acc, g) => {
      acc[g.kid._id] = g;
      return acc;
    }, {});
    return allKids.map(
      (kid) =>
        coursesByKid[kid._id] ?? {
          kid: kid as GroupedByKid['kid'],
          courses: [],
        },
    );
  }, [allKids, data]);

  useEffect(() => {
    if (!groupedData) return;
    if (search) {
      setFilteredData(
        groupedData?.filter((d) =>
          d?.kid?.name?.toLowerCase()?.includes(search?.toLowerCase()),
        ),
      );
      return;
    }
    setFilteredData(groupedData);
  }, [groupedData, search]);

  return (
    <SafeAreaView
      edges={['top']}
      style={{ backgroundColor: '#DBEFDC', flex: 1 }}
    >
      {!isLoading && !!!data?.length && (
        <View className="items-center px-12 justify-center flex-1 relative">
          <Image
            className="mb-4"
            style={{ width: scaleWidth(149), height: scaleHeight(124) }}
            source={IMAGES.LearnerPlaceholder}
          />
          <Text className="text-[#265828] font-sansSemiBold text-[20px] text-center mb-4">
            No Progress to Show Yet
          </Text>
          <Text className="text-dark text-center font-sans mb-6">
            Once you add a child and they start learning, their progress will
            appear here.
          </Text>
          <ICONS.StarFlower
            style={{
              position: 'absolute',
              bottom: scaleHeight(62),
              right: scaleWidth(55),
              zIndex: 20,
            }}
          />
          <ICONS.StarFlower
            fill={'#D5B300'}
            style={{
              position: 'absolute',
              bottom: scaleHeight(46),
              left: scaleWidth(40),
              zIndex: 20,
            }}
          />
          <Button
            onPress={() => router.push('/guardian/AddLearner')}
            className="w-full"
            text="ADD CHILD"
          />
        </View>
      )}
      {(isLoading || !!data?.length) && (
        <FlatList
          ListHeaderComponent={
            <>
              <Text className="text-[24px] font-sansSemiBold text-center text-dark leading-[1.3]">
                Choose a Learner Profile to Continue
              </Text>
              <Text className="text-[16px] font-sans text-dark text-center leading-[1.5] mt-4">
                Pick from the profiles below to view learning progress or access
                the platform as a learner.
              </Text>
              <Button
                onPress={() => router.push('/guardian/AddLearner')}
                className="mt-8"
                text="ADD CHILD PROFILE"
              />
              <SimpleInput
                displayIcon={<ICONS.Search />}
                placeholderColor="#918E91"
                containerClass="bg-white border-0 mt-6"
                placeholder="Search by name..."
                name="search"
                value={search}
                handleChange={setSearch}
              />
              {!!filteredData?.length && (
                <Text className="text-dark font-sansMedium mt-3 text-[16px] mb-6">
                  Total Kids: {filteredData?.length || 0}
                </Text>
              )}
            </>
          }
          ListEmptyComponent={
            isLoading ? <LearnerCardSkeleton /> : <NoLearnersFound />
          }
          data={filteredData}
          renderItem={({ item }) => <LearnerCard {...item} />}
          className="flex-1 mt-6 px-6 py-5"
          showsVerticalScrollIndicator={false}
        />
      )}
      <CreateChildProfile
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
      <TrialLockModal
        title="Unable to Create Child Profile"
        desc="Your current plan includes access to only 1 child profile. To continue, please upgrade your plan."
        open={false}
        buttonText1="UPGRADE PLAN"
        buttonText2='MAYBE LATER'
      />
    </SafeAreaView>
  );
}
