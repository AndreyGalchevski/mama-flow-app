import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput, useTheme } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

import { getDateLocale } from '../date';
import { useSnackbarStore } from '../hooks/useSnackbarStore';
import i18n from '../i18n';
import type { PumpLog } from '../types';
import { pumpLogFormSchema } from '../validation/pumpLog';
import ActionsBar from './ActionBar';

export interface PumpLogFormData {
  volumeLeftML: number;
  volumeRightML: number;
  durationMinutes: number;
  notes: string;
  timestamp: number;
}

interface Props {
  initialState?: PumpLog;
  onSave: (data: PumpLogFormData) => Promise<void>;
}

export default function PumpLogForm({ initialState, onSave }: Props) {
  const router = useRouter();
  const theme = useTheme();

  const [volumeLeft, setVolumeLeft] = useState('');
  const [volumeRight, setVolumeRight] = useState('');
  const [duration, setDuration] = useState('20');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const showSnackbar = useSnackbarStore((s) => s.showSnackbar);

  useEffect(() => {
    if (initialState) {
      setVolumeLeft(initialState.volumeLeftML.toString());
      setVolumeRight(initialState.volumeRightML.toString());
      setDuration(initialState.durationMinutes.toString());
      setNotes(initialState.notes || '');
      setDate(new Date(initialState.timestamp));
    }
  }, [initialState]);

  const handleDateConfirm = (params: { date: Date | undefined }) => {
    if (!params.date) {
      return;
    }

    setShowDatePicker(false);
    setDate(new Date(params.date.setHours(date.getHours(), date.getMinutes())));
  };

  const handleTimeConfirm = ({ hours, minutes }: { hours: number; minutes: number }) => {
    setShowTimePicker(false);
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setDate(newDate);
  };

  const handleSave = async () => {
    const volumeLeftML = Number.parseFloat(volumeLeft);
    const volumeRightML = Number.parseFloat(volumeRight);
    const durationMinutes = Number.parseFloat(duration);

    const parsed = pumpLogFormSchema.safeParse({
      volumeLeftML,
      volumeRightML,
      durationMinutes,
      notes: notes.trim(),
      timestamp: date.getTime(),
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string | undefined> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0] as string;
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    await onSave(parsed.data);

  showSnackbar({ message: i18n.t('snackbar.logSaved'), type: 'success' });
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
        <View style={styles.formContainer}>
          <TextInput
            label={i18n.t('logs.volumeLeft')}
            value={volumeLeft}
            keyboardType="numeric"
            onChangeText={setVolumeLeft}
            style={styles.firstInput}
            error={!!errors.volumeLeftML}
          />

          {errors.volumeLeftML ? (
            <HelperText type="error" visible>
              {errors.volumeLeftML}
            </HelperText>
          ) : null}

          <TextInput
            label={i18n.t('logs.volumeRight')}
            value={volumeRight}
            keyboardType="numeric"
            onChangeText={setVolumeRight}
            error={!!errors.volumeRightML}
          />

          {errors.volumeRightML ? (
            <HelperText type="error" visible>
              {errors.volumeRightML}
            </HelperText>
          ) : null}

          <TextInput
            label={i18n.t('logs.duration')}
            value={duration}
            keyboardType="numeric"
            onChangeText={setDuration}
            error={!!errors.durationMinutes}
          />

          {errors.durationMinutes ? (
            <HelperText type="error" visible>
              {errors.durationMinutes}
            </HelperText>
          ) : null}

          <TextInput label={i18n.t('logs.notes')} value={notes} onChangeText={setNotes} multiline />

          {errors.notes ? (
            <HelperText type="error" visible>
              {errors.notes}
            </HelperText>
          ) : null}

          <Button
            onPress={() => setShowDatePicker(true)}
            mode="outlined"
            style={styles.dateTimeButton}
          >
            {format(date, 'PP', { locale: getDateLocale() })}
          </Button>

          <Button
            onPress={() => setShowTimePicker(true)}
            mode="outlined"
            style={styles.dateTimeButton}
          >
            {format(date, 'p', { locale: getDateLocale() })}
          </Button>
        </View>

        <ActionsBar>
          <Button onPress={() => router.back()}>{i18n.t('common.cancel')}</Button>

          <Button mode="contained" onPress={handleSave}>
            {i18n.t('common.save')}
          </Button>
        </ActionsBar>
      </View>

      <DatePickerModal
        locale={i18n.locale}
        mode="single"
        visible={showDatePicker}
        onDismiss={() => setShowDatePicker(false)}
        date={date}
        onConfirm={handleDateConfirm}
      />

      <TimePickerModal
        visible={showTimePicker}
        onDismiss={() => setShowTimePicker(false)}
        onConfirm={handleTimeConfirm}
        hours={date.getHours()}
        minutes={date.getMinutes()}
        locale={i18n.locale}
        label={i18n.t('form.selectTime')}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  firstInput: {
    marginTop: 16,
  },
  dateTimeButton: {
    marginTop: 8,
  },
});
