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

const STATUS_OPTIONS: { label: string; value?: BookStatus }[] = [
  { label: 'All Status' },
  { label: 'Not Started', value: 'not_started' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
];

type FilterOption = { label: string; value?: string };

const FilterSelect = ({
  options,
  value,
  open,
  onToggle,
  onChange,
}: {
  options: FilterOption[];
  value?: string;
  open: boolean;
  onToggle: () => void;
  onChange: (value?: string) => void;
}) => {
  const selected = options.find((o) => o.value === value) ?? options[0];
  return (
    <View className="flex-1 relative">
      <Pressable
        onPress={onToggle}
        className="bg-[#FAFDFF] border border-[#DBEFDC] rounded-full px-4 py-3 flex-row items-center justify-between gap-2"
      >
        <Text
          numberOfLines={1}
          className="flex-1 text-[14px] font-sans text-dark"
        >
          {selected?.label}
        </Text>
        <Feather
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#221D23"
        />
      </Pressable>
      {open && (
        <View className="absolute top-[52px] w-full bg-white rounded-[16px] shadow-md py-2 z-40">
          {options.map((option) => (
            <Pressable
              key={option.label}
              onPress={() => onChange(option.value)}
              className="px-4 py-2.5"
            >
              <Text
                className={twMerge(
                  'text-[14px] font-sans text-dark',
                  option.value === value && 'font-sansMedium text-[#3F9243]',
                )}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

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
        <View className="flex-row gap-3 mt-4 z-30">
          <FilterSelect
            options={STATUS_OPTIONS}
            value={status}
            open={openFilter === 'status'}
            onToggle={() =>
              setOpenFilter((f) => (f === 'status' ? null : 'status'))
            }
            onChange={(v) => {
              setStatus(v as BookStatus | undefined);
              setOpenFilter(null);
            }}
          />
          <FilterSelect
            options={categories}
            value={categoryId}
            open={openFilter === 'category'}
            onToggle={() =>
              setOpenFilter((f) => (f === 'category' ? null : 'category'))
            }
            onChange={(v) => {
              setCategoryId(v);
              setOpenFilter(null);
            }}
          />
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
