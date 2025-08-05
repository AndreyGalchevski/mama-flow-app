import { useRouter } from 'expo-router';
import { FlatList, View } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../../lib/colors';
import EmptyState from '../../lib/components/EmptyState';
import NextReminderBanner from '../../lib/components/NextReminderBanner';
import PumpCard from '../../lib/components/PumpCard';
import VolumeGraph from '../../lib/components/VolumeGraph';
import { isInLast24Hours } from '../../lib/date';
import { useLogsStore } from '../../lib/hooks/useLogsStore';
import DocumentAdd from '../../lib/icons/DocumentAdd';

export default function Home() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const logs = useLogsStore((s) => s.logs);

  const recentLogs = logs
    .filter((l) => isInLast24Hours(l.timestamp))
    .sort((a, b) => b.timestamp - a.timestamp);

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
          title="Welcome to MamaFlow!"
          description="Start tracking your pumping sessions to see volume trends, get reminders, and keep a record of your journey."
          primaryAction={{
            label: 'Add Your First Log',
            onPress: () => router.push('/add-log-modal'),
          }}
          secondaryAction={{
            label: 'Import Existing Data',
            onPress: () => router.push('/(tabs)/all-logs'),
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

      <Text variant="titleMedium">Volume trend (7 Days)</Text>

      <VolumeGraph />

      <Text variant="titleMedium">Latest pumps</Text>

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
            No pumps in the last 24 hours
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              textAlign: 'center',
              color: COLORS.onSurfaceVariant,
            }}
          >
            Your recent pumping sessions will appear here
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
