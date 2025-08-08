import { format, isToday, isYesterday, startOfDay } from 'date-fns';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import Papa from 'papaparse';
import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../../lib/colors';
import EmptyState from '../../lib/components/EmptyState';
import PumpCard from '../../lib/components/PumpCard';
import { getDateLocale } from '../../lib/date';
import useImportCSV from '../../lib/hooks/useImportCSV';
import { useLogsStore } from '../../lib/hooks/useLogsStore';
import i18n from '../../lib/i18n';
import Download from '../../lib/icons/Download';
import Upload from '../../lib/icons/Upload';

export default function AllLogs() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const logs = useLogsStore((s) => s.logs);

  const { handleImportCSVPress } = useImportCSV();

  const handleExportToCSVPress = async () => {
    const csv = Papa.unparse(
      logs.map((log) => ({
        id: log.id,
        timestamp: format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss', {
          locale: getDateLocale(),
        }),
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
      dialogTitle: i18n.t('logs.allLogs.shareDialogTitle'),
    });
  };

  const sections = React.useMemo(() => {
    if (!logs?.length) return [] as { title: string; data: typeof logs }[];

    const locale = getDateLocale();
    const byDay = new Map<number, typeof logs>();

    for (const log of [...logs].sort((a, b) => b.timestamp - a.timestamp)) {
      const day = startOfDay(new Date(log.timestamp)).getTime();
      const arr = byDay.get(day) ?? [];
      arr.push(log);
      byDay.set(day, arr);
    }

    const makeTitle = (dayTs: number) => {
      const d = new Date(dayTs);
      if (isToday(d)) return i18n.t('date.today');
      if (isYesterday(d)) return i18n.t('date.yesterday');
      return format(d, 'PPP', { locale });
    };

    return Array.from(byDay.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([day, data]) => ({ title: makeTitle(day), data }));
  }, [logs]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingLeft: insets.left + 16, paddingRight: insets.right + 16 },
      ]}
    >
      {logs.length > 0 && (
        <View style={styles.buttonRow}>
          <Button
            onPress={handleImportCSVPress}
            mode="outlined"
            icon={() => <Download size={20} />}
          >
            {i18n.t('logs.allLogs.import')}
          </Button>

          <Button
            onPress={handleExportToCSVPress}
            mode="outlined"
            icon={() => <Upload size={20} />}
          >
            {i18n.t('logs.allLogs.export')}
          </Button>
        </View>
      )}

      {logs.length === 0 ? (
        <EmptyState
          title={i18n.t('logs.allLogs.empty.title')}
          description={i18n.t('logs.allLogs.empty.description')}
          primaryAction={{
            label: i18n.t('logs.allLogs.empty.primaryAction'),
            onPress: () => router.push('/add-log-modal'),
          }}
          secondaryAction={{
            label: i18n.t('logs.allLogs.empty.secondaryAction'),
            onPress: handleImportCSVPress,
          }}
          tertiaryAction={{
            label: i18n.t('logs.allLogs.empty.tertiaryAction'),
            onPress: () => router.push('/(tabs)/settings'),
          }}
          icon={<Download size={64} color={COLORS.primary} />}
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PumpCard item={item} />}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>
                {section.title} ({section.data.length})
              </Text>
            </View>
          )}
          stickySectionHeadersEnabled
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionHeader: {
    backgroundColor: COLORS.background,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    color: COLORS.onBackground,
    fontWeight: '600',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
  },
});
