import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';

import ActionsBar from '../lib/components/ActionBar';
import { formatTimeHM } from '../lib/date';
import { useSettingsStore } from '../lib/hooks/useSettingsStore';
import { useSnackbarStore } from '../lib/hooks/useSnackbarStore';
import i18n from '../lib/i18n';

export default function NightTimeModal() {
  const router = useRouter();
  const theme = useTheme();

  const nightStartMinutes = useSettingsStore((s) => s.nightStartMinutes);
  const nightEndMinutes = useSettingsStore((s) => s.nightEndMinutes);
  const updateNightTimeInterval = useSettingsStore((s) => s.updateNightTimeInterval);

  const showSnackbar = useSnackbarStore((s) => s.showSnackbar);

  const [start, setStart] = useState(nightStartMinutes);
  const [end, setEnd] = useState(nightEndMinutes);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const startHM = useMemo(() => ({ h: Math.floor(start / 60), m: start % 60 }), [start]);
  const endHM = useMemo(() => ({ h: Math.floor(end / 60), m: end % 60 }), [end]);

  const onConfirmStart = ({ hours, minutes }: { hours: number; minutes: number }) => {
    setShowStartPicker(false);
    setStart(hours * 60 + minutes);
  };

  const onConfirmEnd = ({ hours, minutes }: { hours: number; minutes: number }) => {
    setShowEndPicker(false);
    setEnd(hours * 60 + minutes);
  };

  const onSave = () => {
    updateNightTimeInterval(start, end);
    router.back();
  showSnackbar({ type: 'success', message: i18n.t('snackbar.nightIntervalUpdated') });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
          {i18n.t('settings.nightIntervalDesc')}
        </Text>

        <Button mode="outlined" onPress={() => setShowStartPicker(true)} style={styles.timeBtn}>
          {i18n.t('settings.nightStart', { time: formatTimeHM(startHM.h, startHM.m) })}
        </Button>
        <Button mode="outlined" onPress={() => setShowEndPicker(true)} style={styles.timeBtn}>
          {i18n.t('settings.nightEnd', { time: formatTimeHM(endHM.h, endHM.m) })}
        </Button>
      </View>

      <ActionsBar>
        <Button onPress={() => router.back()}>{i18n.t('common.cancel')}</Button>
        <Button mode="contained" onPress={onSave}>
          {i18n.t('common.save')}
        </Button>
      </ActionsBar>

      <TimePickerModal
        visible={showStartPicker}
        onDismiss={() => setShowStartPicker(false)}
        onConfirm={onConfirmStart}
        hours={startHM.h}
        minutes={startHM.m}
        locale={i18n.locale}
        label={i18n.t('settings.pickNightStart')}
      />

      <TimePickerModal
        visible={showEndPicker}
        onDismiss={() => setShowEndPicker(false)}
        onConfirm={onConfirmEnd}
        hours={endHM.h}
        minutes={endHM.m}
        locale={i18n.locale}
        label={i18n.t('settings.pickNightEnd')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  description: {
    opacity: 0.7,
  },
  timeBtn: {
    marginTop: 8,
  },
});
