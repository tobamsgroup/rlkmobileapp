import { getAllBadges } from '@/actions/kid';
import { IMAGES } from '@/assets/images';
import Container from '@/components/Container';
import Select from '@/components/Select';
import Skeleton from '@/components/Skeleton';
import { Badge } from '@/types';
import { scaleWidth } from '@/utils/scale';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

const HomeKid = () => {
  const [series, setSeries] = useState('Think Sustainability');
  const [tab, setTab] = useState('journey');
  const [seriesGroup, setSeriesGroup] = useState<SeriesGroup[]>([]);
  const { data, isLoading } = useQuery({
    queryKey: ['badges'],
    queryFn: async () => {
      return await getAllBadges();
    },
  });

  useEffect(() => {
    if (!data || !series) return;
    setSeriesGroup(groupBadgesBySeries(data, series?.split(' ')?.[1]?.trim()));
  }, [series, data]);
  return (
    <Container scrollable edges={['top']}>
      <View className="p-6">
        <Text className="font-sansSemiBold text-dark text-[20px]">
          My Badges
        </Text>
        <View className="bg-[#265828] rounded-full p-2 my-6 flex-row items-center">
          <Pressable
            onPress={() => setTab('journey')}
            className={twMerge(
              'h-12 items-center justify-center rounded-full flex-1',
              tab === 'journey' && 'bg-white',
            )}
          >
            <Text
              className={twMerge(
                'text-[16px] font-sansMedium text-white',
                tab === 'journey' && 'bg-white text-[#474348]',
              )}
            >
              Learning Journey
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setTab('series')}
            className={twMerge(
              ' h-12 items-center justify-center rounded-full flex-1',
              tab === 'series' && 'bg-white',
            )}
          >
            <Text
              className={twMerge(
                'text-[16px] font-sansMedium text-white',
                tab === 'series' && 'bg-white text-[#474348]',
              )}
            >
              All Series
            </Text>
          </Pressable>
        </View>

        <View className="border border-[#C3E4C5] bg-white rounded-[20px] p-2 gap-4">
          {tab === 'journey' && (
            <>
              {JOURNEY_BADGES?.map((j, i) => {
                const badges = data?.filter(
                  (d) => d.category?.toLowerCase() === j?.toLowerCase(),
                );
                return (
                  <View
                    key={j}
                    className="border border-[#D3D2D366] rounded-[20px] bg-white p-4"
                  >
                    <Text className="text-dark font-sansMedium text-[16px] ">
                      {j}
                    </Text>
                    <View className="mt-5 flex-row flex-wrap gap-2">
                      {!isLoading ? (
                        <>
                          {badges?.map((b) => (
                            <BadgeCard key={b._id} {...b} />
                          ))}
                        </>
                      ) : (
                        <>
                          {[1, 2, 3, 4]?.map((b) => (
                            <BadgeCardSkeleton key={b} />
                          ))}
                        </>
                      )}
                    </View>
                  </View>
                );
              })}
            </>
          )}
          {tab === 'series' && (
            <>
              <Select
                value={series}
                onChange={(text) => setSeries(text)}
                options={[
                  'Think Sustainability',
                  'Think Entrepreneurship',
                  'Think Finance',
                  'Think Strategy',
                  'Think Leadership',
                ]}
              />
              {seriesGroup?.map((s) => {
                return (
                  <View
                    key={s.name + series}
                    className="border border-[#D3D2D366] rounded-[20px] bg-white p-4"
                  >
                    <Text className="text-dark font-sansMedium text-[16px] ">
                      {s.name}
                    </Text>
                    <View className="mt-5 flex-row flex-wrap gap-2">
                      {s.badges?.map((b) => (
                        <BadgeCard key={b._id} {...b} />
                      ))}
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </View>
      </View>
    </Container>
  );
};

export const BadgeCard = (props: Badge) => {
  return (
    <Pressable className="items-center gap-1.5 border border-[#D3D2D366] rounded-[12px] py-6 w-[48%]">
      <Image
        style={{ width: scaleWidth(52), height: scaleWidth(52) }}
        // source={{ uri: props?.imageUrl }}
        source={IMAGES.NoBadge}
      />
      <Text
        numberOfLines={1}
        className="font-sansMedium text-dark text-center "
      >
        {props?.name}
      </Text>
    </Pressable>
  );
};
export const BadgeCardSkeleton = () => {
  return (
    <Pressable className="items-center gap-1.5 border border-[#D3D2D366] rounded-[12px] py-6 w-[48%]">
      <Skeleton
        style={{ width: scaleWidth(52), height: scaleWidth(52) }}
        className="rounded-full"
      />
      <Skeleton className="w-1/2 h-5" />
    </Pressable>
  );
};

interface SeriesGroup {
  name: string; // "Series 1"
  badges: Badge[];
}

function groupBadgesBySeries(badges: Badge[], category: string): SeriesGroup[] {
  const filtered = badges.filter(
    (badge) =>
      badge.category?.toLowerCase() === category?.toLowerCase() &&
      badge.subcategory,
  );

  const grouped = filtered.reduce<Record<string, Badge[]>>((acc, badge) => {
    const series = badge.subcategory as string;

    if (!acc[series]) {
      acc[series] = [];
    }

    acc[series].push(badge);
    return acc;
  }, {});

  // Convert object → array format
  return Object.entries(grouped)
    .map(([series, badges]) => ({
      name: series,
      badges,
    }))
    .sort((a, b) => {
      // Sort numerically by Series number
      const numA = parseInt(a.name.replace(/\D/g, ''));
      const numB = parseInt(b.name.replace(/\D/g, ''));
      return numA - numB;
    });
}

const JOURNEY_BADGES = [
  'Learning Progress',
  'Consistency',
  'Skill Mastery',
  'Motivation',
  'Special Occasion',
];

export default HomeKid;
