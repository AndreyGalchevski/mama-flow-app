import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { type Locale, format, isToday, isYesterday, startOfDay } from 'date-fns';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import Papa from 'papaparse';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import EmptyState from '../../lib/components/EmptyState';
import PumpCard from '../../lib/components/PumpCard';
import { getDateLocale } from '../../lib/date';
import useImportCSV from '../../lib/hooks/useImportCSV';
import { useLogsStore } from '../../lib/hooks/useLogsStore';
import i18n from '../../lib/i18n';
import Download from '../../lib/icons/Download';
import Upload from '../../lib/icons/Upload';
import type { PumpLog } from '../../lib/types';

const makeTitle = (dayTs: number, locale: Locale) => {
  const d = new Date(dayTs);
  if (isToday(d)) {
    return i18n.t('date.today');
  }
  if (isYesterday(d)) {
    return i18n.t('date.yesterday');
  }
  return format(d, 'PPP', { locale });
};

type Row =
  | { type: 'header'; id: string; title: string; count: number }
  | { type: 'item'; id: string; item: PumpLog[][number] };

export default function AllLogs() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

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

  const rows = useMemo<Row[]>(() => {
    if (!logs?.length) {
      return [];
    }

    const locale = getDateLocale();
    const byDay = new Map<number, Array<PumpLog[][number]>>();

    for (const log of [...logs].sort((a, b) => b.timestamp - a.timestamp)) {
      const day = startOfDay(new Date(log.timestamp)).getTime();
      const arr = byDay.get(day) ?? [];
      arr.push(log);
      byDay.set(day, arr);
    }

    const out: Row[] = [];
    for (const [day, data] of Array.from(byDay.entries()).sort((a, b) => b[0] - a[0])) {
      const title = makeTitle(day, locale);

      out.push({ type: 'header', id: `h-${day}`, title, count: data.length });

      for (const it of data) {
        out.push({ type: 'item', id: it.id, item: it });
      }
    }
    return out;
  }, [logs]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
        },
      ]}
    >
      {logs.length > 0 && (
        <View style={styles.buttonRow}>
          <Button
            onPress={handleImportCSVPress}
            mode="outlined"
            icon={() => <Download size={20} color={theme.colors.primary} />}
          >
            {i18n.t('logs.allLogs.import')}
          </Button>

          <Button
            onPress={handleExportToCSVPress}
            mode="outlined"
            icon={() => <Upload size={20} color={theme.colors.primary} />}
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
          icon={<Download size={64} color={theme.colors.primary} />}
        />
      ) : (
        <FlashList
          data={rows}
          keyExtractor={(row) => row.id}
          renderItem={({ item }: ListRenderItemInfo<Row>) => {
            if (item.type === 'header') {
              return (
                <View style={[styles.sectionHeader, { backgroundColor: theme.colors.background }]}>
                  <Text style={[styles.sectionHeaderText, { color: theme.colors.onSurface }]}>
                    {item.title} ({item.count})
                  </Text>
                </View>
              );
            }
            return <PumpCard item={item.item} />;
          }}
          getItemType={(row) => row.type}
          contentContainerStyle={{ paddingBottom: 16 }}
          stickyHeaderIndices={rows
            .map((r, idx) => (r.type === 'header' ? idx : -1))
            .filter((i) => i !== -1)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionHeader: {
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
  },
});
