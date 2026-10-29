import { getAllKids } from '@/actions/curriculum';
import { getAssignedBooks } from '@/actions/learner-progress';
import Container from '@/components/Container';
import {
  BookCard,
  BookCardSkeleton,
  EmptyState,
  KidSwitcher,
} from '@/components/LearnerProgress';
import Skeleton from '@/components/Skeleton';
import TopBackButton from '@/components/TopBackButton';
import { BookStatus, LearnerBookCard } from '@/types/learnerProgress';
import Feather from '@expo/vector-icons/Feather';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { twMerge } from 'tailwind-merge';

const PAGE_SIZE = 12;

// `label` is shown on the trigger, `chipLabel` inside the panel
type FilterOption = { label: string; chipLabel?: string; value?: string };

const STATUS_OPTIONS: FilterOption[] = [
  { label: 'All Status', chipLabel: 'All Books' },
  { label: 'Not Started', value: 'not_started' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
];

const FilterTrigger = ({
  options,
  value,
  open,
  onToggle,
}: {
  options: FilterOption[];
  value?: string;
  open: boolean;
  onToggle: () => void;
}) => {
  const selected = options.find((o) => o.value === value) ?? options[0];
  const color = open ? '#3F9243' : '#221D23';
  return (
    <Pressable
      onPress={onToggle}
      className={twMerge(
        'flex-1 bg-[#FAFDFF] border border-[#EDEDED] rounded-full px-4 py-3 flex-row items-center justify-between gap-2',
        open && 'bg-[#F1F9F1] border-[#DBEFDC]',
      )}
    >
      <Text
        numberOfLines={1}
        style={{ color }}
        className="flex-1 text-[14px] font-sans"
      >
        {selected?.label}
      </Text>
      <Feather
        name={open ? 'chevron-up' : 'chevron-down'}
        size={18}
        color={color}
      />
    </Pressable>
  );
};

// Chip panel shown inline under both filter triggers (the card grows)
const FilterChips = ({
  options,
  value,
  onChange,
}: {
  options: FilterOption[];
  value?: string;
  onChange: (value?: string) => void;
}) => (
  <View className="mt-4 bg-white rounded-[12px] border border-[#EDEDED] p-4 flex-row flex-wrap justify-center gap-3">
    {options.map((option) => {
      const active = option.value === value;
      return (
        <Pressable
          key={option.label}
          onPress={() => onChange(option.value)}
          className={twMerge(
            'rounded-full border border-[#EDEDED] bg-white px-5 py-2.5',
            active && 'bg-[#3F9243] border-[#3F9243]',
          )}
        >
          <Text
            className={twMerge(
              'text-[14px] font-sans text-dark',
              active && 'text-white font-sansMedium',
            )}
          >
            {option.chipLabel ?? option.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const AssignedBooks = () => {
  const params = useLocalSearchParams();
  const [kid, setKid] = useState(params?.kidId as string);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<BookStatus | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [openFilter, setOpenFilter] = useState<'status' | 'category' | null>(
    null,
  );
  const { data: allKids, isLoading: learnerLoading } = useQuery({
    queryKey: ['kids'],
    queryFn: async () => await getAllKids(),
  });
  const learner = (allKids as any[] | undefined)?.find((k) => k?._id === kid);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['assigned-books', kid, debouncedSearch, status, categoryId],
    queryFn: async ({ pageParam }) =>
      await getAssignedBooks(kid, {
        search: debouncedSearch || undefined,
        status,
        categoryId,
        page: pageParam,
        limit: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.page < lastPage?.pagination?.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    enabled: !!kid,
  });

  const books = data?.pages.flatMap((p) => p?.items ?? []) ?? [];
  const firstPage = data?.pages?.[0];
  const categories: FilterOption[] = [
    { label: 'All Categories' },
    ...(firstPage?.categories ?? []).map((c) => ({
      label: c.title,
      value: String(c.categoryId),
    })),
  ];

  const openBook = (book: LearnerBookCard) =>
    router.push(
      `/guardian/BookProgress?kidId=${kid}&seriesId=${book.seriesId}&name=${encodeURIComponent(learner?.name ?? '')}`,
    );

  const header = (
    <View className="z-20">
      <TopBackButton />
      <Text className="font-sansSemiBold text-dark text-[20px] my-4">
        Assigned Books
      </Text>
      <KidSwitcher
        loading={learnerLoading}
        kid={learner}
        onSelect={(id) => {
          setKid(id);
          setCategoryId(undefined);
        }}
      />
      <View className="bg-white rounded-[24px] p-5 mt-5 z-20">
        <View className="bg-[#FAFDFF] border border-[#DBEFDC] rounded-full px-4 flex-row items-center gap-3">
          <Feather name="search" size={20} color="#474348" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by book title or series..."
            placeholderTextColor="#918E91"
            className="flex-1 py-3.5 font-sans text-[15px] text-dark"
            autoCapitalize="none"
            returnKeyType="search"
          />
          {!!search && (
            <Pressable onPress={() => setSearch('')}>
              <Feather name="x" size={18} color="#474348" />
            </Pressable>
          )}
        </View>
        <View className="mt-4 z-30">
          <View className="flex-row gap-3">
            <FilterTrigger
              options={STATUS_OPTIONS}
              value={status}
              open={openFilter === 'status'}
              onToggle={() =>
                setOpenFilter((f) => (f === 'status' ? null : 'status'))
              }
            />
            <FilterTrigger
              options={categories}
              value={categoryId}
              open={openFilter === 'category'}
              onToggle={() =>
                setOpenFilter((f) => (f === 'category' ? null : 'category'))
              }
            />
          </View>
          {openFilter === 'status' && (
            <FilterChips
              options={STATUS_OPTIONS}
              value={status}
              onChange={(v) => {
                setStatus(v as BookStatus | undefined);
                setOpenFilter(null);
              }}
            />
          )}
          {openFilter === 'category' && (
            <FilterChips
              options={categories}
              value={categoryId}
              onChange={(v) => {
                setCategoryId(v);
                setOpenFilter(null);
              }}
            />
          )}
        </View>
      </View>
      <View className="bg-white rounded-t-[24px] px-5 pt-6 pb-2 mt-5 -z-10">
        {isLoading ? (
          <Skeleton className="w-1/3 rounded-full" />
        ) : (
          <Text className="text-[20px] font-sansSemiBold text-dark">
            All Books ({firstPage?.pagination?.total ?? 0})
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <Container>
      <FlatList
        data={books}
        keyExtractor={(item) => String(item.seriesId)}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={header}
        ListHeaderComponentStyle={{ zIndex: 20 }}
        renderItem={({ item }) => (
          <View className="bg-white px-5 pt-4">
            <BookCard book={item} onPress={() => openBook(item)} />
          </View>
        )}
        ListEmptyComponent={
          <View className="bg-white px-5 pt-4">
            {isLoading ? (
              <BookCardSkeleton />
            ) : (
              <EmptyState
                text={
                  debouncedSearch || status || categoryId
                    ? 'No books match your filters.'
                    : 'No books assigned yet.'
                }
              />
            )}
          </View>
        }
        ListFooterComponent={
          <View className="bg-white rounded-b-[24px] pb-5 pt-1 items-center">
            {isFetchingNextPage && <ActivityIndicator color="#3F9243" />}
          </View>
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.4}
      />
    </Container>
  );
};

export default AssignedBooks;
