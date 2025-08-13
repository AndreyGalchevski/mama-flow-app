import { useFocusEffect } from '@react-navigation/native';
import { format, subDays } from 'date-fns';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../../lib/colors';
import EmptyState from '../../lib/components/EmptyState';
import NextReminderBanner from '../../lib/components/NextReminderBanner';
import PumpCard from '../../lib/components/PumpCard';
import RatingPromptDialog from '../../lib/components/RatingPromptDialog';
import VolumeGraph from '../../lib/components/VolumeGraph';
import { getDateLocale, isInLast24Hours } from '../../lib/date';
import useImportCSV from '../../lib/hooks/useImportCSV';
import { useLogsStore } from '../../lib/hooks/useLogsStore';
import { useRatingPrompt } from '../../lib/hooks/useRatingPrompt';
import i18n from '../../lib/i18n';
import DocumentAdd from '../../lib/icons/DocumentAdd';
import type { DataPoint } from '../../lib/types';

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showRatingDialog, setShowRatingDialog] = useState(false);

  const logs = useLogsStore((s) => s.logs);
  const { shouldShowPrompt } = useRatingPrompt();

  const { handleImportCSVPress } = useImportCSV();

  useFocusEffect(
    useCallback(() => {
      // Only check for automatic rating prompt if it should be shown
      if (shouldShowPrompt) {
        // Delay slightly to avoid showing immediately on app launch
        const timer = setTimeout(() => {
          setShowRatingDialog(true);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }, [shouldShowPrompt]),
  );

  const recentLogs = logs
    .filter((l) => isInLast24Hours(l.timestamp))
    .sort((a, b) => b.timestamp - a.timestamp);

  const chartData: DataPoint[] = useMemo(() => {
    const days = [...Array(7)].map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      return format(d, 'yyyy-MM-dd');
    });

    return days.map((day) => {
      const dayLogs = logs.filter((log) => format(log.timestamp, 'yyyy-MM-dd') === day);
      const total = dayLogs.reduce((sum, log) => sum + log.volumeTotalML, 0);
      const pumpCount = dayLogs.length;

      const dayDate = new Date(day);
      return {
        timestamp: dayDate.getTime(),
        value: total,
        label: format(dayDate, 'EEE', { locale: getDateLocale() }),
        tooltip: format(dayDate, 'MMM d', { locale: getDateLocale() }),
        pumpCount,
      };
    });
  }, [logs]);

  if (logs.length === 0) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingLeft: insets.left + 16,
            paddingRight: insets.right + 16,
          },
        ]}
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
            onPress: () => handleImportCSVPress(),
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
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
        },
      ]}
    >
      <NextReminderBanner />

      <Text variant="titleMedium">{i18n.t('home.volumeTrend')}</Text>

      <VolumeGraph data={chartData} />

      <Text variant="titleMedium">{i18n.t('home.latestPumps')}</Text>

      {recentLogs.length === 0 ? (
        <View style={styles.noRecentContainer}>
          <Text variant="bodyLarge" style={styles.noRecentTitle}>
            {i18n.t('home.noRecentPumps.title')}
          </Text>
          <Text variant="bodyMedium" style={styles.noRecentDescription}>
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
        style={styles.fab}
        onPress={() => router.push('/add-log-modal')}
      />

      <RatingPromptDialog visible={showRatingDialog} onDismiss={() => setShowRatingDialog(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    backgroundColor: COLORS.background,
  },
  noRecentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  noRecentTitle: {
    textAlign: 'center',
    color: COLORS.onSurfaceVariant,
    marginBottom: 16,
  },
  noRecentDescription: {
    textAlign: 'center',
    color: COLORS.onSurfaceVariant,
  },
  fab: {
    backgroundColor: COLORS.primary,
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
