import { format } from 'date-fns';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import Papa from 'papaparse';
import { FlatList, View } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../../lib/colors';
import PumpCard from '../../lib/components/PumpCard';
import { useLogsStore } from '../../lib/hooks/useLogsStore';

export default function AllLogs() {
  const router = useRouter();

  const logs = useLogsStore((s) => s.logs);

  const handleImportCSVPress = async () => {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });

    if (result.canceled) {
      return;
    }

    router.push({ pathname: '/import-csv-modal', params: { csvURI: result.assets[0].uri } });
  };

  const handleExportToCSVPress = async () => {
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
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 16, backgroundColor: COLORS.background }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button
          onPress={handleImportCSVPress}
          mode="outlined"
          icon="upload"
          // icon={() => require('../../assets/images/upload.svg')}
        >
          Import
        </Button>

        <Button
          onPress={handleExportToCSVPress}
          mode="outlined"
          icon="download"
          // icon={() => require('../../assets/images/download.svg')}
        >
          Export
        </Button>
      </View>

      <FlatList
        data={[...logs].sort((a, b) => b.timestamp - a.timestamp)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PumpCard item={item} />}
      />
    </SafeAreaView>
  );
}
