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
        Volume trend (7 Days)
      </Text>

      <View
        style={{ marginBottom: 8, borderRadius: 12, backgroundColor: COLORS.surface, padding: 16 }}
      >
        <LineChart
          data={volumeByDay.map((it) => ({
            value: it.volumeTotalML,
            label: format(new Date(it.date), 'EEE'),
          }))}
          width={300}
          height={200}
          spacing={40}
          initialSpacing={20}
          color={COLORS.primary}
          thickness={3}
          startFillColor={COLORS.primary}
          endFillColor={COLORS.background}
          startOpacity={0.3}
          endOpacity={0.1}
          areaChart
          curved
          isAnimated
          animateOnDataChange
          animationDuration={1000}
          dataPointsHeight={8}
          dataPointsWidth={8}
          dataPointsColor={COLORS.primary}
          dataPointsRadius={4}
          textColor={COLORS.onSurface}
          textFontSize={12}
          hideRules
          showVerticalLines
          verticalLinesColor={COLORS.surfaceVariant}
          verticalLinesThickness={1}
          verticalLinesStrokeDashArray={[2, 6]}
          xAxisThickness={2}
          xAxisColor={COLORS.surfaceVariant}
          yAxisThickness={0}
          yAxisTextStyle={{ color: COLORS.onSurfaceVariant, fontSize: 11 }}
          xAxisLabelTextStyle={{ color: COLORS.onSurfaceVariant, fontSize: 11 }}
          rulesColor={COLORS.surfaceVariant}
          backgroundColor={COLORS.surface}
          noOfSections={4}
          maxValue={Math.max(...volumeByDay.map((d) => d.volumeTotalML)) * 1.1 || 100}
          focusEnabled
          showDataPointOnFocus
          showStripOnFocus
          showTextOnFocus
          stripHeight={200}
          stripWidth={2}
          stripColor={COLORS.primary}
          stripOpacity={0.3}
          focusedDataPointColor={COLORS.secondary}
          focusedDataPointRadius={6}
        />
      </View>

      <Text variant="titleMedium" style={{ marginTop: 16, marginBottom: 8 }}>
        Latest pumps
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
