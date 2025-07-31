import { format, subDays } from 'date-fns';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { FlatList } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../lib/colors';
import PumpCard from '../lib/components/PumpCard';
import { isInLast24Hours } from '../lib/date';
import { useLogsStore } from '../lib/hooks/useLogsStore';

export default function Home() {
  const router = useRouter();
  const logs = useLogsStore((s) => s.logs);
  const recentLogs = logs
    .filter((l) => isInLast24Hours(l.timestamp))
    .sort((a, b) => b.timestamp - a.timestamp);

  const days = [...Array(7)].map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    return format(d, 'yyyy-MM-dd');
  });

  const volumeByDay = days.map((day) => {
    const total = logs
      .filter((log) => format(log.timestamp, 'yyyy-MM-dd') === day)
      .reduce((sum, log) => sum + log.volumeTotalML, 0);
    return { date: day, volumeTotalML: total };
  });

  const handleImportCSVPress = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return;
    }

    router.push({ pathname: '/import-csv-modal', params: { csvURI: result.assets[0].uri } });
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: COLORS.background }}>
      <Text variant="titleMedium" style={{ marginBottom: 12 }}>
        Volume Trend (Last 7 Days)
      </Text>

      <LineChart
        data={volumeByDay.map((it) => ({
          value: it.volumeTotalML,
          label: format(new Date(it.date), 'EEE'),
        }))}
      />

      <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 8 }}>
        Latest Logs (Last 24 Hours)
      </Text>

      <FlatList
        data={recentLogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PumpCard item={item} />}
      />

      <Button
        mode="contained"
        onPress={() => router.push('/add-log-modal')}
        style={{ marginTop: 16 }}
      >
        + Add Log
      </Button>

      {logs.length === 0 && (
        <Button onPress={handleImportCSVPress} style={{ marginTop: 8 }}>
          Import CSV
        </Button>
      )}

      <Button onPress={() => router.push('/all-logs-modal')} style={{ marginTop: 8 }}>
        View All Logs
      </Button>
    </SafeAreaView>
  );
}
