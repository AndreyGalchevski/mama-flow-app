import { parse } from 'date-fns';
import * as Crypto from 'expo-crypto';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';

import { COLORS } from '../lib/colors';
import ActionsBar from '../lib/components/ActionBar';
import { useLogsStore } from '../lib/hooks/useLogsStore';
import i18n from '../lib/i18n';
import type { PumpLog } from '../lib/types';

const pumpLogFields: { key: keyof PumpLog; label: string }[] = [
  { key: 'timestamp', label: i18n.t('importCSV.fields.timestamp') },
  { key: 'volumeLeftML', label: i18n.t('importCSV.fields.volumeLeft') },
  { key: 'volumeRightML', label: i18n.t('importCSV.fields.volumeRight') },
  { key: 'durationMinutes', label: i18n.t('importCSV.fields.duration') },
  { key: 'notes', label: i18n.t('importCSV.fields.notes') },
];

export default function ImportCSVModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [fieldMap, setFieldMap] = useState<Record<string, string>>({});

  const addLog = useLogsStore((s) => s.add);

  useEffect(() => {
    const init = async () => {
      if (!params?.csvURI) {
        return;
      }

      const response = await fetch(params.csvURI as string);
      const text = await response.text();

      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });

      if (parsed.errors.length > 0) {
        throw new Error(`CSV parse errors: ${JSON.stringify(parsed.errors)}`);
      }

      setRows(parsed.data as Record<string, string>[]);
      setCsvHeaders(Object.keys(parsed.data[0] || {}));
    };

    init();
  }, [params?.csvURI]);

  const handleImport = () => {
    if (!rows.length) {
      return;
    }

    const logs: PumpLog[] = rows
      .map((row) => {
        return {
          id: Crypto.randomUUID(),
          timestamp: parse(row[fieldMap.timestamp], 'dd/MM/yyyy HH:mm:ss', new Date()).getTime(),
          volumeLeftML: Number.parseFloat(row[fieldMap.volumeLeftML]),
          volumeRightML: Number.parseFloat(row[fieldMap.volumeRightML]),
          volumeTotalML:
            Number.parseFloat(row[fieldMap.volumeLeftML]) +
            Number.parseFloat(row[fieldMap.volumeRightML]),
          durationMinutes: Number.parseFloat(row[fieldMap.durationMinutes]),
          notes: row[fieldMap.notes] || '',
        };
      })
      .filter(Boolean) as PumpLog[];

    logs.forEach(addLog);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text variant="titleMedium" style={styles.title}>
          {i18n.t('importCSV.title')}
        </Text>

        {pumpLogFields.map((field) => (
          <View key={field.key} style={styles.fieldContainer}>
            <Dropdown
              label={field.label}
              mode="outlined"
              options={csvHeaders.map((h) => ({ label: h, value: h }))}
              value={fieldMap[field.key]}
              onSelect={(val?: string) => val && setFieldMap((m) => ({ ...m, [field.key]: val }))}
            />
          </View>
        ))}

        <Divider style={styles.divider} />

        <Text variant="titleSmall">{i18n.t('importCSV.preview')}</Text>

        {rows.slice(0, 3).map((row, i) => (
          <Text key={i} style={styles.previewRow}>
            {JSON.stringify(row)}
          </Text>
        ))}
      </ScrollView>

      <ActionsBar>
        <Button onPress={() => router.back()}>{i18n.t('common.cancel')}</Button>

        <Button
          mode="contained"
          onPress={handleImport}
          disabled={
            !fieldMap.timestamp ||
            !fieldMap.volumeLeftML ||
            !fieldMap.volumeRightML ||
            !fieldMap.durationMinutes
          }
        >
          {i18n.t('importCSV.importButton')}
        </Button>
      </ActionsBar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  title: {
    marginBottom: 12,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  previewRow: {
    fontSize: 12,
    marginBottom: 4,
  },
});
