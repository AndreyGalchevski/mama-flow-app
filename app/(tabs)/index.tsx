import { format, subDays } from 'date-fns';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../../lib/colors';
import EmptyState from '../../lib/components/EmptyState';
import NextReminderBanner from '../../lib/components/NextReminderBanner';
import PumpCard from '../../lib/components/PumpCard';
import VolumeGraph from '../../lib/components/VolumeGraph';
import { getDateLocale, isInLast24Hours } from '../../lib/date';
import { useLogsStore } from '../../lib/hooks/useLogsStore';
import i18n from '../../lib/i18n';
import DocumentAdd from '../../lib/icons/DocumentAdd';
import type { DataPoint } from '../../lib/types';

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const logs = useLogsStore((s) => s.logs);

  const recentLogs = logs
    .filter((l) => isInLast24Hours(l.timestamp))
    .sort((a, b) => b.timestamp - a.timestamp);

  const chartData: DataPoint[] = useMemo(() => {
    const days = [...Array(7)].map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      return format(d, 'yyyy-MM-dd');
    });

    return days.map((day) => {
      const total = logs
        .filter((log) => format(log.timestamp, 'yyyy-MM-dd') === day)
        .reduce((sum, log) => sum + log.volumeTotalML, 0);

      const dayDate = new Date(day);
      return {
        timestamp: dayDate.getTime(),
        value: total,
        label: format(dayDate, 'EEE', { locale: getDateLocale() }),
        tooltip: format(dayDate, 'PP', { locale: getDateLocale() }),
      };
    });
  }, [logs]);

  if (logs.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
          backgroundColor: COLORS.background,
        }}
      >
        <EmptyState
          title={i18n.t('home.empty.title')}
          description={i18n.t('home.empty.description')}
          primaryAction={{
            label: i18n.t('home.empty.primaryAction'),
            onPress: () => router.push('/add-log-modal'),
          }}
          secondaryAction={{
            label: i18n.t('home.empty.secondaryAction'),
            onPress: () => router.push('/(tabs)/all-logs'),
          }}
          tertiaryAction={{
            label: i18n.t('home.empty.tertiaryAction'),
            onPress: () => router.push('/(tabs)/settings'),
          }}
          icon={<DocumentAdd size={64} color={COLORS.primary} />}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        gap: 16,
        paddingTop: insets.top,
        paddingLeft: insets.left + 16,
        paddingRight: insets.right + 16,
        backgroundColor: COLORS.background,
      }}
    >
      <NextReminderBanner />

      <Text variant="titleMedium">{i18n.t('home.volumeTrend')}</Text>

      <VolumeGraph data={chartData} />

      <Text variant="titleMedium">{i18n.t('home.latestPumps')}</Text>

      {recentLogs.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 32,
          }}
        >
          <Text
            variant="bodyLarge"
            style={{
              textAlign: 'center',
              color: COLORS.onSurfaceVariant,
              marginBottom: 16,
            }}
          >
            {i18n.t('home.noRecentPumps.title')}
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              textAlign: 'center',
              color: COLORS.onSurfaceVariant,
            }}
          >
            {i18n.t('home.noRecentPumps.description')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={recentLogs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PumpCard item={item} />}
        />
      )}

      <FAB
        icon={() => <DocumentAdd color={COLORS.onPrimary} />}
        style={{
          backgroundColor: COLORS.primary,
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={() => router.push('/add-log-modal')}
      />
    </View>
  );
}
