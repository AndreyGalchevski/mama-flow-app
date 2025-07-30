import * as FileSystem from 'expo-file-system';
import { Stack, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import Papa from 'papaparse';
import { FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { format } from 'date-fns';
import { COLORS } from '../lib/colors';
import PumpCard from '../lib/components/PumpCard';
import { useLogsStore } from '../lib/hooks/useLogsStore';

export default function AllLogsModal() {
  const router = useRouter();

  const logs = useLogsStore((s) => s.logs);

  async function handleExportToCSVPress() {
    const csv = Papa.unparse(
      logs.map((log) => ({
        id: log.id,
        timestamp: format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss'),
        volumeLeftML: log.volumeLeftML,
        volumeRightML: log.volumeRightML,
        volumeTotalML: log.volumeTotalML,
        durationMinutes: log.durationMinutes,
        notes: log.notes ?? '',
      })),
    );

    const fileName = `pump-logs-${Date.now()}.csv`;

    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Share Pump Logs CSV',
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: COLORS.background }}>
      <Stack.Screen options={{ title: 'All Logs', presentation: 'modal' }} />

      <Button onPress={handleExportToCSVPress} style={{ marginTop: 8 }}>
        Export to CSV
      </Button>

      <FlatList
        data={[...logs].sort((a, b) => b.timestamp - a.timestamp)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PumpCard item={item} />}
      />

      <Button onPress={() => router.back()} style={{ marginTop: 8 }}>
        Close
      </Button>
    </SafeAreaView>
  );
}
