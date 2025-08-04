import { useRouter } from 'expo-router';
import { FlatList } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../../lib/colors';
import NextReminderBanner from '../../lib/components/NextReminderBanner';
import PumpCard from '../../lib/components/PumpCard';
import VolumeGraph from '../../lib/components/VolumeGraph';
import { isInLast24Hours } from '../../lib/date';
import { useLogsStore } from '../../lib/hooks/useLogsStore';
import DocumentAdd from '../../lib/icons/DocumentAdd';

export default function Home() {
  const router = useRouter();

  const logs = useLogsStore((s) => s.logs);

  const recentLogs = logs
    .filter((l) => isInLast24Hours(l.timestamp))
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        paddingBottom: 0,
        gap: 16,
        backgroundColor: COLORS.background,
      }}
    >
      <NextReminderBanner />

      <Text variant="titleMedium">Volume trend (7 Days)</Text>

      <VolumeGraph />

      <Text variant="titleMedium">Latest pumps</Text>

      <FlatList
        data={recentLogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PumpCard item={item} />}
      />

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
    </SafeAreaView>
  );
}
