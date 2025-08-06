import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../../lib/colors';
import { getDateLocale } from '../date';
import i18n from '../i18n';
import type { PumpLog } from '../types';

export interface PumpLogFormData {
  volumeLeftML: number;
  volumeRightML: number;
  durationMinutes: number;
  notes: string;
  timestamp: number;
}

interface Props {
  initialState?: PumpLog;
  onSave: (data: PumpLogFormData) => void;
}

export default function PumpLogForm({ initialState, onSave }: Props) {
  const router = useRouter();

  const getModalLocale = () => {
    switch (i18n.locale) {
      case 'ru':
        return 'ru';
      default:
        return 'en';
    }
  };

  const [volumeLeft, setVolumeLeft] = useState('');
  const [volumeRight, setVolumeRight] = useState('');
  const [duration, setDuration] = useState('20');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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

  const handleSave = () => {
    const volumeLeftML = Number.parseFloat(volumeLeft);
    const volumeRightML = Number.parseFloat(volumeRight);
    const durationMinutes = Number.parseFloat(duration);

    if (!volumeLeftML || !volumeRightML || !durationMinutes) {
      return;
    }

    onSave({
      volumeLeftML,
      volumeRightML,
      durationMinutes,
      notes: notes.trim(),
      timestamp: date.getTime(),
    });
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ flex: 1, padding: 16, gap: 8 }}>
          <TextInput
            mode="outlined"
            label={i18n.t('logs.volumeLeft')}
            value={volumeLeft}
            keyboardType="numeric"
            onChangeText={setVolumeLeft}
            style={{ marginTop: 16 }}
          />

          <TextInput
            mode="outlined"
            label={i18n.t('logs.volumeRight')}
            value={volumeRight}
            keyboardType="numeric"
            onChangeText={setVolumeRight}
          />

          <TextInput
            mode="outlined"
            label={i18n.t('logs.duration')}
            value={duration}
            keyboardType="numeric"
            onChangeText={setDuration}
          />

          <TextInput
            mode="outlined"
            label={i18n.t('logs.notes')}
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <Button onPress={() => setShowDatePicker(true)} mode="outlined" style={{ marginTop: 8 }}>
            {format(date, 'PP', { locale: getDateLocale() })}
          </Button>

          <Button onPress={() => setShowTimePicker(true)} mode="outlined" style={{ marginTop: 8 }}>
            {format(date, 'p', { locale: getDateLocale() })}
          </Button>
        </View>

        <View style={{ padding: 16, gap: 8 }}>
          <Button mode="contained" onPress={handleSave}>
            {i18n.t('common.save')}
          </Button>

          <Button onPress={() => router.back()}>{i18n.t('common.cancel')}</Button>
        </View>
      </SafeAreaView>

      <DatePickerModal
        locale={getModalLocale()}
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
        locale={getModalLocale()}
        label={i18n.t('form.selectTime')}
      />
    </>
  );
}
