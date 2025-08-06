import { parse } from 'date-fns';
import * as Crypto from 'expo-crypto';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../lib/colors';
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
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: COLORS.background }}>
      <ScrollView>
        <Text variant="titleMedium" style={{ marginBottom: 12 }}>
          {i18n.t('importCSV.title')}
        </Text>

        {pumpLogFields.map((field) => (
          <View key={field.key} style={{ marginBottom: 16 }}>
            <Dropdown
              label={field.label}
              mode="outlined"
              options={csvHeaders.map((h) => ({ label: h, value: h }))}
              value={fieldMap[field.key]}
              onSelect={(val?: string) => val && setFieldMap((m) => ({ ...m, [field.key]: val }))}
            />
          </View>
        ))}

        <Divider style={{ marginVertical: 16 }} />

        <Text variant="titleSmall">{i18n.t('importCSV.preview')}</Text>

        {rows.slice(0, 3).map((row, i) => (
          <Text key={i} style={{ fontSize: 12, marginBottom: 4 }}>
            {JSON.stringify(row)}
          </Text>
        ))}

        <Button
          mode="contained"
          onPress={handleImport}
          style={{ marginTop: 24 }}
          disabled={
            !fieldMap.timestamp ||
            !fieldMap.volumeLeftML ||
            !fieldMap.volumeRightML ||
            !fieldMap.durationMinutes
          }
        >
          {i18n.t('importCSV.importButton')}
        </Button>

        <Button onPress={() => router.back()} style={{ marginTop: 8 }}>
          {i18n.t('common.cancel')}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
