import { parse } from 'date-fns';
import * as Crypto from 'expo-crypto';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Papa from 'papaparse';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, DataTable, Divider, HelperText, Text } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';

import { COLORS } from '../lib/colors';
import ActionsBar from '../lib/components/ActionBar';
import { useLogsStore } from '../lib/hooks/useLogsStore';
import i18n from '../lib/i18n';
import type { PumpLog } from '../lib/types';
import { pumpLogCSVRowSchema } from '../lib/validation/pumpLog';

const pumpLogFields: { key: keyof PumpLog; label: string; required: boolean; helpKey: string }[] = [
  {
    key: 'timestamp',
    label: i18n.t('importCSV.fields.timestamp'),
    required: true,
    helpKey: 'importCSV.help.timestamp',
  },
  {
    key: 'volumeLeftML',
    label: i18n.t('importCSV.fields.volumeLeft'),
    required: true,
    helpKey: 'importCSV.help.volumeLeft',
  },
  {
    key: 'volumeRightML',
    label: i18n.t('importCSV.fields.volumeRight'),
    required: true,
    helpKey: 'importCSV.help.volumeRight',
  },
  {
    key: 'durationMinutes',
    label: i18n.t('importCSV.fields.duration'),
    required: true,
    helpKey: 'importCSV.help.duration',
  },
  {
    key: 'notes',
    label: i18n.t('importCSV.fields.notes'),
    required: false,
    helpKey: 'importCSV.help.notes',
  },
];

export default function ImportCSVModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [fieldMap, setFieldMap] = useState<Record<string, string>>({});
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [showExample, setShowExample] = useState(false);
  const [invalidIndices, setInvalidIndices] = useState<number[]>([]);

  const requiredFieldsMapped = useMemo(
    () => pumpLogFields.filter((f) => f.required).every((f) => fieldMap[f.key]),
    [fieldMap],
  );

  useEffect(() => {
    if (!rows.length || !requiredFieldsMapped) {
      setInvalidIndices([]);
      return;
    }

    const invalid: number[] = [];

    rows.forEach((row, index) => {
      try {
        const parsedTimestamp = parse(
          row[fieldMap.timestamp],
          'dd/MM/yyyy HH:mm:ss',
          new Date(),
        ).getTime();
        const candidate = {
          timestamp: parsedTimestamp,
          volumeLeftML: Number.parseFloat(row[fieldMap.volumeLeftML]),
          volumeRightML: Number.parseFloat(row[fieldMap.volumeRightML]),
          durationMinutes: Number.parseFloat(row[fieldMap.durationMinutes]),
          notes: fieldMap.notes ? row[fieldMap.notes] || '' : '',
        };
        const result = pumpLogCSVRowSchema.safeParse(candidate);
        if (!result.success) invalid.push(index);
      } catch {
        invalid.push(index);
      }
    });
    setInvalidIndices(invalid);
  }, [fieldMap, rows, requiredFieldsMapped]);

  const resetMappings = useCallback(() => {
    setFieldMap({});
    setInvalidIndices([]);
    setImportErrors([]);
  }, []);

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

    const errors: string[] = [];
    const logs: PumpLog[] = [];

    // Helper to present human labels instead of raw field keys
    const fieldLabel = (k: string) => {
      switch (k) {
        case 'timestamp':
          return i18n.t('importCSV.fields.timestamp');
        case 'volumeLeftML':
          return i18n.t('importCSV.fields.volumeLeft');
        case 'volumeRightML':
          return i18n.t('importCSV.fields.volumeRight');
        case 'durationMinutes':
          return i18n.t('importCSV.fields.duration');
        case 'notes':
          return i18n.t('importCSV.fields.notes');
        default:
          return k;
      }
    };

    rows.forEach((row, index) => {
      try {
        const parsedTimestamp = parse(
          row[fieldMap.timestamp],
          'dd/MM/yyyy HH:mm:ss',
          new Date(),
        ).getTime();
        const candidate = {
          timestamp: parsedTimestamp,
          volumeLeftML: Number.parseFloat(row[fieldMap.volumeLeftML]),
          volumeRightML: Number.parseFloat(row[fieldMap.volumeRightML]),
          durationMinutes: Number.parseFloat(row[fieldMap.durationMinutes]),
          notes: fieldMap.notes ? row[fieldMap.notes] || '' : '',
        };

        const result = pumpLogCSVRowSchema.safeParse(candidate);
        if (!result.success) {
          const firstIssue = result.error.issues[0];
          const field = fieldLabel(String(firstIssue.path[0] ?? 'field'));
          errors.push(
            i18n.t('validation.csvRow', {
              row: index + 1,
              field,
              message: firstIssue.message,
            }),
          );
          return;
        }
        logs.push({
          id: Crypto.randomUUID(),
          ...result.data,
          volumeTotalML: result.data.volumeLeftML + result.data.volumeRightML,
        });
      } catch (e) {
        errors.push(
          i18n.t('validation.csvRow', {
            row: index + 1,
            field: i18n.t('importCSV.fields.timestamp'),
            message: 'Parse error',
          }),
        );
      }
    });

    if (errors.length) {
      setImportErrors(errors.slice(0, 10));
      return;
    }

    logs.forEach(addLog);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text variant="titleMedium" style={styles.title}>
          {i18n.t('importCSV.title')}
        </Text>
        <Text style={styles.intro}>{i18n.t('importCSV.intro')}</Text>
        <View style={styles.guideRow}>
          <Button compact mode="text" onPress={() => setShowExample((v) => !v)}>
            {showExample ? i18n.t('importCSV.hideExample') : i18n.t('importCSV.viewExample')}
          </Button>
          <Button
            compact
            mode="text"
            onPress={resetMappings}
            disabled={!Object.keys(fieldMap).length}
          >
            {i18n.t('importCSV.reset')}
          </Button>
        </View>
        {showExample && (
          <View style={styles.exampleBox}>
            <Text style={styles.exampleHeader}>timestamp,left_ml,right_ml,duration_min,notes</Text>
            <Text style={styles.exampleLine}>16/07/2025 19:00:00,70,55,19,Medela</Text>
            <Text style={styles.exampleLine}>16/07/2025 22:00:00,115,5,20,Annabella</Text>
            <Text style={styles.exampleLine}>17/07/2025 02:00:00,45,5,16,Annabella</Text>
          </View>
        )}

        {pumpLogFields.map((field) => {
          const isRequiredMissing = field.required && !fieldMap[field.key];
          return (
            <View key={field.key} style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                {field.label}
                {field.required && <Text style={styles.required}> *</Text>}
              </Text>
              <Dropdown
                label={i18n.t('importCSV.selectColumn')}
                mode="outlined"
                options={csvHeaders.map((h) => ({ label: h, value: h }))}
                value={fieldMap[field.key]}
                onSelect={(val?: string) => val && setFieldMap((m) => ({ ...m, [field.key]: val }))}
              />
              <Text style={styles.helpText}>{i18n.t(field.helpKey)}</Text>
            </View>
          );
        })}

        <Divider style={styles.divider} />

        <Text variant="titleSmall">{i18n.t('importCSV.preview')}</Text>
        {requiredFieldsMapped && (
          <Text style={styles.validationSummary}>
            {rows.length
              ? invalidIndices.length
                ? i18n.t('importCSV.rowsSummaryInvalid', {
                    total: rows.length,
                    invalid: invalidIndices.length,
                  })
                : i18n.t('importCSV.rowsSummaryAllValid', { total: rows.length })
              : null}
          </Text>
        )}
        {!requiredFieldsMapped && (
          <HelperText type="info" visible>
            {i18n.t('importCSV.mapAllRequired')}
          </HelperText>
        )}
        {importErrors.length > 0 && (
          <HelperText type="error" visible style={{ marginTop: 8 }}>
            {importErrors.join('\n')}
          </HelperText>
        )}
        {requiredFieldsMapped && (
          <DataTable style={styles.table}>
            <DataTable.Header>
              {pumpLogFields.map((f) => (
                <DataTable.Title key={f.key}>{f.label}</DataTable.Title>
              ))}
            </DataTable.Header>
            {rows.slice(0, 3).map((row, idx) => {
              const isInvalid = invalidIndices.includes(idx);
              return (
                <DataTable.Row key={idx} style={isInvalid ? styles.invalidRow : undefined}>
                  {pumpLogFields.map((f) => (
                    <DataTable.Cell key={f.key} style={styles.cell}>
                      <Text style={styles.cellText} numberOfLines={1}>
                        {fieldMap[f.key] ? row[fieldMap[f.key]] : ''}
                      </Text>
                    </DataTable.Cell>
                  ))}
                </DataTable.Row>
              );
            })}
          </DataTable>
        )}
        {invalidIndices.length > 0 && requiredFieldsMapped && (
          <Chip icon="alert" selectedColor={COLORS.error} style={styles.chip}>
            {i18n.t('importCSV.fixMappingBeforeImport')}
          </Chip>
        )}
      </ScrollView>

      <ActionsBar>
        <Button onPress={() => router.back()}>{i18n.t('common.cancel')}</Button>

        <Button
          mode="contained"
          onPress={handleImport}
          disabled={!requiredFieldsMapped || invalidIndices.length > 0}
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
  intro: {
    marginBottom: 8,
    fontSize: 14,
  },
  guideRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  exampleBox: {
    backgroundColor: '#F4F4F4',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  exampleHeader: { fontFamily: 'monospace', fontSize: 12, fontWeight: '600' },
  exampleLine: { fontFamily: 'monospace', fontSize: 12 },
  fieldContainer: {
    marginBottom: 16,
    gap: 8,
  },
  fieldLabel: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  required: { color: COLORS.error },
  helpText: { fontSize: 12, color: '#555', marginTop: 4 },
  divider: {
    marginVertical: 16,
  },
  table: { marginTop: 8 },
  invalidRow: { backgroundColor: 'rgba(255,0,0,0.08)' },
  cell: { flex: 1 },
  cellText: { fontSize: 12 },
  chip: { marginTop: 8 },
  validationSummary: { fontSize: 12, marginTop: 4 },
});
