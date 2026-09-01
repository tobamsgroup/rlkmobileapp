import { BillingInvoice, BillingStatus, getBillingHistory } from '@/actions/subscription';
import { ICONS } from '@/assets/icons';
import Button from '@/components/Button';
import Container from '@/components/Container';
import Select from '@/components/Select';
import BillingCard from '@/components/Subscription/BillingCard';
import TopBackButton from '@/components/TopBackButton';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { twMerge } from 'tailwind-merge';

const DATE_RANGES: Record<string, number | null> = {
  'All time': null,
  'Last 3 months': 3,
  'Last 6 months': 6,
  'Last 12 months': 12,
};

const STATUS_TABS: (BillingStatus | 'All')[] = ['All', 'Paid', 'Pending', 'Failed'];

const BillingHistory = () => {
  const [statusFilter, setStatusFilter] = useState<BillingStatus | 'All'>('All');
  const [dateRange, setDateRange] = useState<string>('All time');
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [webViewLoading, setWebViewLoading] = useState(true);

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['billing-history'],
    queryFn: getBillingHistory,
  });

  const filtered = useMemo(() => {
    const months = DATE_RANGES[dateRange];
    const cutoff = months
      ? new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000)
      : null;

    return invoices.filter((inv: BillingInvoice) => {
      const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
      const matchesDate = !cutoff || new Date(inv.date) >= cutoff;
      return matchesStatus && matchesDate;
    });
  }, [invoices, statusFilter, dateRange]);

  return (
    <>
      <Container scrollable>
        <View className="px-6 py-5 pb-10">
          <TopBackButton />
          <Text className="font-sansSemiBold text-dark text-[20px] mt-4">
            Billing History
          </Text>
          <Text className="mt-2 text-[16px] text-[#6C686C] font-sans leading-[1.5]">
            View all your past payments and receipts.
          </Text>
        </View>
        <View className="bg-white p-6">
          <Select
            options={Object.keys(DATE_RANGES)}
            onChange={(v) => setDateRange(v)}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            horizontal
            className="flex-row gap-2 mt-4"
            contentContainerClassName="gap-2"
          >
            {STATUS_TABS.map((tab) => (
              <Button
                onPress={() => setStatusFilter(tab)}
                text={tab}
                key={tab}
                textClassname={twMerge(
                  'font-sans',
                  statusFilter === tab ? 'text-white' : 'text-[#474348]',
                )}
                className={twMerge(
                  'px-7 border-0',
                  statusFilter === tab
                    ? 'bg-primary'
                    : 'bg-white border border-[#D3D2D3]',
                )}
              />
            ))}
          </ScrollView>

          {isLoading ? (
            <ActivityIndicator className="mt-12" color="#004D99" />
          ) : filtered.length === 0 ? (
            <View className="mt-12 items-center">
              <Text className="text-[#6C686C] font-sans text-[15px]">
                No billing records found.
              </Text>
            </View>
          ) : (
            <View className="gap-6 mt-8">
              {filtered.map((invoice: BillingInvoice) => (
                <BillingCard
                  key={invoice.id}
                  planName={invoice.planName}
                  amount={invoice.amount}
                  currency={invoice.currency}
                  status={invoice.status}
                  date={invoice.date}
                  receiptUrl={invoice.receiptUrl}
                  kid={invoice.kid}
                  onDownload={(url) => {
                    setWebViewLoading(true);
                    setReceiptUrl(url);
                  }}
                />
              ))}
            </View>
          )}
        </View>
      </Container>

      <Modal
        isVisible={!!receiptUrl}
        style={{ margin: 0 }}
        onBackButtonPress={() => setReceiptUrl(null)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#D3D2D366]">
            <Pressable
              onPress={() => setReceiptUrl(null)}
              className="w-9 h-9 items-center justify-center rounded-full bg-[#F5F5F5]"
            >
              <ICONS.Close width={18} height={18} stroke="#221D23" />
            </Pressable>
            <Text className="font-sansMedium text-[#221D23] text-[16px]">
              Receipt
            </Text>
            <View className="w-9" />
          </View>

          {receiptUrl && (
            <WebView
              source={{ uri: receiptUrl }}
              onLoadStart={() => setWebViewLoading(true)}
              onLoadEnd={() => setWebViewLoading(false)}
              style={{ flex: 1 }}
            />
          )}

          {webViewLoading && (
            <View className="absolute inset-0 items-center justify-center bg-white">
              <ActivityIndicator size="large" color="#004D99" />
              <Text className="font-sans text-[#474348] mt-3 text-[14px]">
                Loading receipt...
              </Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default BillingHistory;
