import { format, subDays } from 'date-fns';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { FlatList, View } from 'react-native';
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
        Volume Trend
      </Text>

      <LineChart
        data={volumeByDay.map((it) => ({
          value: it.volumeTotalML,
          label: format(new Date(it.date), 'EEE'),
        }))}
      />

      <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 8 }}>
        Latest Logs
      </Text>

      <FlatList
        data={recentLogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PumpCard item={item} />}
      />

      <View style={{ gap: 8 }}>
        <Button mode="contained" onPress={() => router.push('/add-log-modal')}>
          + Add Log
        </Button>

        {logs.length === 0 && <Button onPress={handleImportCSVPress}>Import CSV</Button>}

        <Button onPress={() => router.push('/all-logs-modal')}>View All Logs</Button>

        <Button onPress={() => router.push('/settings-modal')}>Settings</Button>
      </View>
    </SafeAreaView>
  );
}
